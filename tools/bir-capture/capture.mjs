// capture.mjs — automated BIR Revenue Issuances archive capture.
// Renders each BIR issuance page (the list is JS/server-streamed, so a plain
// fetch fails), parses it, and writes the markdown archive files.
//
//   node capture.mjs                 # all types, all years
//   node capture.mjs --type=rr       # one type (rr|rmo|rmc)
//   node capture.mjs --year=2024     # one year
//   node capture.mjs --type=rr --year=2026
//
// On each run it reports NEW issuances since the previous run (state.json).
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tagRelevance, renderMarkdown } from './parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');          // payroll-data/
const OUT = path.join(REPO, 'ph', 'bir', 'issuances');
const STATE = path.join(__dirname, 'state.json');
const BASE = 'https://www.bir.gov.ph';
const MASTER = `${BASE}/revenue-issuances-details`;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (payroll-data archive bot)';

// Types we keep. RAO and RDAO are intentionally excluded.
// Note the BIR URL quirk: RMO prior-year pages use the SINGULAR "Order"
// (e.g. /2025-Revenue-Memorandum-Order) while 2026 uses the plural — the
// regex below allows the optional trailing "s".
const TYPES = [
  { abbr: 'RR',  re: /(\d{4})-Revenue-Regulations\b/i },
  { abbr: 'RMO', re: /(\d{4})-Revenue-Memorandum-Orders?\b/i },
  { abbr: 'RMC', re: /(\d{4})-Revenue-Memorandum-Circulars\b/i },
];

function todayManila() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date());
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wait until the streamed issuance list has actually rendered.
async function waitForList(page) {
  await page.waitForFunction(() => {
    const t = document.body.innerText || '';
    return /NO\.\s*OF\s*ISSUANCE/i.test(t) && /(RR|RMO|RMC)\s*No\.?\s*\d+\s*-\s*\d{4}/i.test(t);
  }, { timeout: 45000 });
}

// Structured extraction: read the table rows directly (number cell, subject
// cell, date cell) plus the real PDF links from each row's <a> tags. More
// accurate than text-parsing AND captures the direct source URLs.
async function extractRows(page, abbr) {
  const raw = await page.$$eval('table tr', (trs) => {
    const DATE = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/;
    const txt = (el) => (el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '');
    return trs.map((tr) => {
      const tds = [...tr.querySelectorAll('td,th')];
      const numCell = txt(tds[0]);
      // subject cell = subject text + trailing "Digest | Full Text | Annex…" scaffolding.
      // Cut at the "Digest" marker (always prefixes the link scaffolding; never appears
      // in BIR subjects). If absent, the whole cell text is the subject.
      const rawSub = txt(tds[1]);
      const cut = rawSub.indexOf('Digest');
      const subject = (cut > 0 ? rawSub.slice(0, cut) : rawSub).trim();
      // date is in the last cell (avoid matching dates inside the subject text)
      const lastTxt = txt(tds[tds.length - 1]);
      const dm = lastTxt.match(DATE);
      const date = dm ? dm[0] : lastTxt;
      const links = [...tr.querySelectorAll('a')].map((a) => ({ text: (a.textContent || '').trim(), href: a.href }));
      return { numCell, subject, date, links };
    });
  });
  const numRe = new RegExp(`^${abbr}\\s*No\\.?\\s*(\\d+)\\s*-\\s*(\\d{4})`, 'i');
  const rows = [];
  for (const r of raw) {
    const m = r.numCell.match(numRe);
    if (!m) continue; // skips header + non-data rows
    const links = r.links.filter((l) => l.text && /^https?:/i.test(l.href || ''));
    rows.push({ num: `${m[1]}-${m[2]}`, subject: r.subject, date: r.date, links, payroll: tagRelevance(r.subject) });
  }
  return rows;
}

// Discover every year/type page link from the master index (auto-includes new
// years and the "Previous Years" pages without hardcoding).
async function discoverLinks(page) {
  await page.goto(MASTER, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => [...document.querySelectorAll('a')].some((a) => /Revenue-Regulations/i.test(a.getAttribute('href') || '')),
    { timeout: 30000 },
  );
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const out = [];
  const seen = new Set();
  for (const href of hrefs) {
    if (!href) continue;
    for (const { abbr, re } of TYPES) {
      const m = href.match(re);
      if (!m) continue;
      const year = m[1];
      const key = `${abbr}-${year}`;
      if (seen.has(key)) continue; // dedup by type+year (collapses query-string variants)
      seen.add(key);
      const url = href.startsWith('http') ? href : `${BASE}/${href.replace(/^\//, '')}`;
      out.push({ abbr, url, year });
    }
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const onlyType = (args.find((a) => a.startsWith('--type=')) || '').split('=')[1];
  const onlyYear = (args.find((a) => a.startsWith('--year=')) || '').split('=')[1];
  const today = todayManila();

  let state = {};
  try { state = JSON.parse(await fs.readFile(STATE, 'utf8')); } catch { /* first run */ }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ userAgent: UA });
  page.setDefaultTimeout(45000);

  // Discover the exact year/type page URLs from the master index. Discovery
  // returns correct slugs (incl. the RMO singular/plural quirk), so it is the
  // primary source; the pattern fallback only runs if discovery returns nothing.
  let links = [];
  try {
    links = await discoverLinks(page);
  } catch (e) {
    console.log(`Link discovery failed (${e.message}); using fallback URL pattern.`);
  }
  if (!links.length) {
    for (const { abbr } of TYPES)
      for (const y of [2026, 2025, 2024, 2023, 2022]) {
        const slug = abbr === 'RR' ? 'Revenue-Regulations'
          : abbr === 'RMC' ? 'Revenue-Memorandum-Circulars'
          : (y === 2026 ? 'Revenue-Memorandum-Orders' : 'Revenue-Memorandum-Order');
        links.push({ abbr, url: `${BASE}/${y}-${slug}`, year: String(y) });
      }
  }
  if (onlyType) links = links.filter((l) => l.abbr.toLowerCase() === onlyType.toLowerCase());
  if (onlyYear) links = links.filter((l) => l.year === onlyYear);

  console.log(`Capturing ${links.length} page(s)...`);
  const newFindings = [];
  const allRecords = [];

  for (const { abbr, url, year } of links) {
    try {
      let rows = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          await waitForList(page);
          rows = await extractRows(page, abbr);
          break;
        } catch (err) {
          if (attempt === 3) throw err;
          await sleep(2500 * attempt); // backoff on transient network/timeout drops
        }
      }
      if (!rows || !rows.length) { console.log(`  [skip] ${abbr} ${year}: 0 rows parsed`); continue; }

      const dir = path.join(OUT, abbr.toLowerCase());
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, `${year}.md`), renderMarkdown({ abbr, year, url, rows, today }));
      for (const r of rows) allRecords.push({ type: abbr, id: `${abbr} ${r.num}`, number: r.num, year, date: r.date, subject: r.subject, payroll: r.payroll || null, links: r.links });

      const key = `${abbr}-${year}`;
      const prev = new Set(state[key] || []);
      const cur = rows.map((r) => r.num);
      const added = cur.filter((n) => !prev.has(n));
      state[key] = cur;
      const flagged = rows.filter((r) => r.payroll).length;
      console.log(`  [ok]  ${abbr} ${year}: ${rows.length} rows, ${flagged} payroll-flagged${added.length ? `  NEW: ${added.map((n) => abbr + ' ' + n).join(', ')}` : ''}`);
      for (const n of added) newFindings.push(`${abbr} ${n} (${year})`);
      await sleep(800); // be polite
    } catch (e) {
      console.log(`  [ERR] ${abbr} ${year}: ${e.message}`);
    }
  }

  // Machine-readable manifest of every issuance (for RAG / programmatic ingestion).
  allRecords.sort((a, b) => a.type.localeCompare(b.type) || b.year - a.year || parseInt(b.number) - parseInt(a.number));
  await fs.writeFile(path.join(OUT, 'issuances.json'), JSON.stringify({
    source: 'https://www.bir.gov.ph/revenue-issuances-details',
    captured: today, count: allRecords.length, records: allRecords,
  }, null, 2));
  await fs.writeFile(STATE, JSON.stringify(state, null, 2));
  await browser.close();
  console.log(`\nWrote issuances.json (${allRecords.length} records). ${newFindings.length ? `NEW since last run:\n - ${newFindings.join('\n - ')}` : 'No new issuances since last run.'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
