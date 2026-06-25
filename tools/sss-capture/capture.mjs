// capture.mjs — SSS circulars archive capture.
// The SSS circulars page is a server-rendered WordPress page (one fetch, no
// browser needed). This fetches it, parses the per-year tables, tags payroll
// relevance, and writes ph/sss/circulars.md.  Run:  node capture.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const OUT = path.join(REPO, 'ph', 'sss', 'circulars.md');
const SRC = 'https://www.sss.gov.ph/sss-circulars/';

// Payroll-relevance (SSS-specific). Contribution schedules = the core payroll item.
const STRONG = [
  /schedule of\s+(sss\s+)?contributions?/i, /contribution (rate|schedule|table)/i,
  /\bWISP\b/i, /mandatory provident fund/i, /\bMPF\b/i,
  /employer[s]?\b[^.]{0,40}(contribution|remittance|obligation|liabilit)/i,
];
const ADJACENT = [
  /\bcontribution/i, /salary loan/i, /remittance/i, /collection/i,
  /employees['’ ]?\s*compensation/i, /\bEC\b/, /membership/i,
];
function tag(t) {
  if (STRONG.some((r) => r.test(t))) return 'Y';
  if (ADJACENT.some((r) => r.test(t))) return '~';
  return '';
}

function decodeHtml(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&#39;|&rsquo;|&#8216;|&lsquo;/g, '’')
    .replace(/&#8211;|&ndash;|&#8212;|&mdash;/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseCirculars(html) {
  // Iterate table rows. First cell holds the circular number — either linked
  // (<a href="PDF">NUMBER</a>) or plain text (some older ones have no PDF).
  // Number may carry a letter suffix (e.g. 2020-004-b amendments).
  const rows = [];
  const seen = new Set();
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let tr;
  while ((tr = trRe.exec(html))) {
    const cells = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => c[1]);
    if (cells.length < 2) continue; // skips header rows (which use <th>)
    const c0 = cells[0];
    const numM = c0.match(/(\d{4}-\d{1,4}(?:-[A-Za-z0-9]+)?)/);
    if (!numM) continue;
    const num = numM[1];
    if (seen.has(num)) continue;
    const urlM = c0.match(/<a\s+href="([^"]+)"/i);
    const url = urlM ? urlM[1].trim() : '';
    const title = decodeHtml(cells[1]);
    if (!title) continue;
    seen.add(num);
    rows.push({ num, year: num.slice(0, 4), title, url, payroll: tag(title) });
  }
  return rows;
}

function render(rows, today) {
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a);
  const flagged = rows.filter((r) => r.payroll);
  const fm = [
    '---', 'country: ph', 'category: sss', 'record_type: circular-archive-index',
    'topic: Complete index of SSS Circulars (2020-2026), with payroll-relevance tagging',
    `source: "SSS — Circulars listing — ${SRC}"`,
    'source_tier: primary',
    `last_verified: ${today}`,
    `verified_from: "Auto-captured by the sss-capture job (fetch + parse of the server-rendered SSS circulars page). ${rows.length} circulars parsed."`,
    `captured_count: ${rows.length}`,
    'tags: [sss, circular, archive, index, contributions, issuances]', '---', '',
    '## SSS Circulars — complete index',
    '',
    'Golden-source archive (capture-all). `Payroll?`: **Y** = contribution schedule / employer obligation · **~** = contribution/loan/remittance adjacent · blank = other (benefits, admin). Tags are heuristic — confirm. **Source** links go to the official SSS PDF.',
    '',
    `> The **contribution schedule** circulars (tagged Y) are the payroll-critical ones — e.g. the annual "Schedule of SSS Contributions for Employers and Employees". For the parsed current contribution table see [\`contribution_table_2025.md\`](contribution_table_2025.md).`,
  ];
  const body = [];
  for (const y of years) {
    body.push('', `### ${y}`, '', '| No. | Title | Payroll? | Source |', '|-----|-------|----------|--------|');
    for (const r of rows.filter((x) => x.year === y)) {
      const src = r.url ? `[PDF](${r.url})` : '_(no PDF)_';
      body.push(`| ${r.num} | ${r.title.replace(/\|/g, '\\|')} | ${r.payroll} | ${src} |`);
    }
  }
  const subset = ['', '## Payroll-relevant subset (contribution schedules & employer obligations)', ''];
  if (flagged.length) for (const r of flagged.filter((x) => x.payroll === 'Y')) subset.push(`- **${r.num}** — ${r.title}${r.url ? ` — [PDF](${r.url})` : ''}`);
  else subset.push('_None flagged._');
  const foot = ['', '## Source & Notes', `- **Primary source:** [SSS Circulars](${SRC})`, `- Auto-captured by \`tools/sss-capture\` (server-rendered page; simple fetch+parse, no browser). Captured ${today} — ${rows.length} circulars.`, ''];
  return [...fm, ...body, ...subset, ...foot].join('\n');
}

// --- run ---
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date());
  const res = await fetch(SRC, { headers: { 'user-agent': 'Mozilla/5.0 (payroll-data archive bot)' } });
  if (!res.ok) { console.error(`fetch failed: HTTP ${res.status}`); process.exit(1); }
  const html = await res.text();
  const rows = parseCirculars(html);
  if (!rows.length) { console.error('0 circulars parsed — page structure may have changed.'); process.exit(1); }
  await fs.writeFile(OUT, render(rows, today));
  // Machine-readable manifest (for RAG / programmatic ingestion).
  await fs.writeFile(OUT.replace(/\.md$/, '.json'), JSON.stringify({
    source: SRC, captured: today, count: rows.length,
    records: rows.map((r) => ({ id: `SSS ${r.num}`, number: r.num, year: r.year, title: r.title, payroll: r.payroll || null, url: r.url || null })),
  }, null, 2));
  const byYear = {};
  for (const r of rows) byYear[r.year] = (byYear[r.year] || 0) + 1;
  const flagged = rows.filter((r) => r.payroll === 'Y').length;
  console.log(`Wrote ${rows.length} SSS circulars to ph/sss/circulars.md`);
  console.log('By year:', Object.entries(byYear).sort((a, b) => b[0] - a[0]).map(([y, n]) => `${y}:${n}`).join('  '));
  console.log(`Payroll-flagged (Y): ${flagged}`);
}
