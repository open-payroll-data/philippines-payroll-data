// parse.mjs — pure parsing + tagging + markdown rendering for BIR issuance pages.
// No browser here: this is the testable core. capture.mjs feeds it page text.
import { fileURLToPath } from 'node:url';

// ---- Payroll-relevance tagging (heuristic; a human reviews flagged rows) ----
const STRONG = [
  /withholding/i, /compensation/i, /\balphalist\b/i, /alphabetical list of (employee|payee)/i,
  /13th[-\s]?month/i, /de\s?minimis/i, /fringe benefit/i, /minimum wage/i, /substituted filing/i,
  /\bBIR Form (No\.?\s*)?2316\b/i, /\b1601[-\s]?C\b/i, /\b1604[-\s]?C\b/i,
  /income tax table/i, /graduated income tax/i, /\bTRAIN\b/i, /tax on compensation/i,
];
const ADJACENT = [
  /annual income tax return/i, /\bincome tax return\b/i, /\bITR\b/i, /\beAFS\b/i,
  /audited financial statement/i, /\bBIR Form (No\.?\s*)?170[01]\b/i,
];

export function tagRelevance(subject) {
  if (STRONG.some((re) => re.test(subject))) return 'Y';
  if (ADJACENT.some((re) => re.test(subject))) return '~';
  return '';
}

// ---- Parse the rendered page text into issuance rows ----
// abbr is "RR" | "RMO" | "RMC". Robust to multi-line subjects, uppercase "NO.",
// dates on their own line, and cross-references in subjects (e.g. "Circular No. 8-2026").
export function parseIssuances(text, abbr) {
  let body = text;
  const headRe = /NO\.\s*OF\s*ISSUANCE[\s\S]*?DATE OF ISSUE/i;
  const hm = body.match(headRe);
  if (hm) body = body.slice(body.search(headRe) + hm[0].length);
  const eIdx = body.search(/Copyright\s*©/i);
  if (eIdx >= 0) body = body.slice(0, eIdx);

  const startRe = new RegExp(`^${abbr}\\s*No\\.?\\s*\\d+\\s*-\\s*\\d{4}\\b`, 'i');
  const numRe = new RegExp(`^${abbr}\\s*No\\.?\\s*(\\d+)\\s*-\\s*(\\d{4})`, 'i');
  const dateRe = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i;
  const dateReG = new RegExp(dateRe.source, 'gi');

  const lines = body.split('\n').map((l) => l.trim()).filter((l) => l.length);
  const records = [];
  let cur = null;
  for (const line of lines) {
    if (startRe.test(line)) { if (cur) records.push(cur); cur = [line]; }
    else if (cur) cur.push(line);
  }
  if (cur) records.push(cur);

  const rows = [];
  for (const rec of records) {
    const joined = rec.join('\n');
    const nm = rec[0].match(numRe);
    if (!nm) continue;
    const num = `${nm[1]}-${nm[2]}`;

    const allDates = joined.match(dateReG);
    const date = allDates ? allDates[allDates.length - 1] : '';

    const linkIdx = rec.findIndex((l) => /\b(Digest|Full Text)\b/i.test(l));
    let subject = '';
    let links = '';
    if (linkIdx >= 0) {
      const firstRest = rec[0].slice(nm[0].length);
      const middle = rec.slice(1, linkIdx).join(' ');
      subject = `${firstRest} ${middle}`;
      links = date ? rec[linkIdx].replace(date, '') : rec[linkIdx];
    } else {
      let rest = rec[0].slice(nm[0].length) + ' ' + rec.slice(1).join(' ');
      if (date) rest = rest.replace(date, '');
      subject = rest;
    }
    subject = subject.replace(/\s+/g, ' ').trim();
    links = links.replace(/\s*\|\s*/g, ' | ').replace(/(\s*\|)+\s*$/,'').replace(/^\s*\|\s*/,'').trim();
    if (subject) rows.push({ num, date, subject, links, payroll: tagRelevance(subject) });
  }
  return rows;
}

// ---- Render an archive markdown file (matches the repo's existing format) ----
const TYPE_META = {
  RR:  { code: 'rr',  name: 'Revenue Regulations',          slug: 'Revenue-Regulations' },
  RMO: { code: 'rmo', name: 'Revenue Memorandum Orders',    slug: 'Revenue-Memorandum-Orders' },
  RMC: { code: 'rmc', name: 'Revenue Memorandum Circulars', slug: 'Revenue-Memorandum-Circulars' },
};

export function renderMarkdown({ abbr, year, url, rows, today }) {
  const meta = TYPE_META[abbr];
  const payroll = rows.filter((r) => r.payroll);
  const fm = [
    '---',
    'country: ph',
    'category: bir',
    'record_type: circular-archive-index',
    `issuance_type: ${abbr}`,
    `topic: Complete index of all ${year} BIR ${meta.name} (${abbr}s), with payroll-relevance tagging`,
    `effective_year: ${year}`,
    `source: "BIR — ${year} ${meta.name} listing — ${url}"`,
    'source_tier: primary',
    `last_verified: ${today}`,
    `verified_from: "Auto-captured by the bir-capture job (headless-browser render of the BIR Next.js page). ${rows.length} ${abbr}s parsed."`,
    `captured_count: ${rows.length}`,
    `tags: [bir, ${meta.code}, archive, index, ${year}, issuances]`,
    '---',
    '',
  ].join('\n');

  // Keep the primary documents (Full Text, Digest) as direct links; collapse the
  // long tail of annexes/attachments into a count so cells stay compact & readable.
  const linkMd = (links) => {
    const ls = (Array.isArray(links) ? links : []).filter((l) => l && l.href);
    if (!ls.length) return '';
    const isPrimary = (t) => /full text|digest/i.test(t || '');
    const primary = ls.filter((l) => isPrimary(l.text));
    const extra = ls.filter((l) => !isPrimary(l.text));
    const parts = primary.map((l) => `[${(l.text || 'doc').replace(/\|/g, '/')}](${l.href})`);
    if (!parts.length && extra.length) { // nothing labelled Full Text/Digest — surface the first link
      parts.push(`[${(extra[0].text || 'doc').replace(/\|/g, '/')}](${extra[0].href})`);
      extra.shift();
    }
    if (extra.length) parts.push(`+${extra.length} annex${extra.length > 1 ? 'es' : ''}`);
    return parts.join(' · ');
  };

  const head = [
    `## ${year} BIR ${meta.name} — complete index`,
    '',
    'Golden-source archive (capture-all). `Payroll?`: **Y** = payroll/compensation-tax · **~** = tax-filing adjacent · blank = not payroll (heuristic — confirm). **Source** links go straight to the official BIR PDF — fetch these for full text.',
    '',
    '| No. | Date | Subject | Payroll? | Source |',
    '|-----|------|---------|----------|--------|',
  ].join('\n');

  const tableRows = rows.map((r) => {
    const subj = (r.subject || '').replace(/\|/g, '\\|');
    return `| ${abbr} ${r.num} | ${r.date} | ${subj} | ${r.payroll} | ${linkMd(r.links)} |`;
  }).join('\n');

  const subset = payroll.length
    ? ['', '## Payroll-relevant subset', '', ...payroll.map((r) => {
        const lm = linkMd(r.links);
        return `- **${abbr} ${r.num}** (${r.payroll}) — ${r.subject}${lm ? ` — ${lm}` : ''}`;
      })].join('\n')
    : ['', '## Payroll-relevant subset', '', '_None auto-flagged in this year._'].join('\n');

  const foot = [
    '', '## Source & Notes',
    `- **Primary source:** [BIR ${year} ${meta.name}](${url})`,
    '- Auto-captured by `tools/bir-capture` (browser-render; list is JS/server-streamed). Digest/Full-Text PDFs hosted on `bir-cdn.bir.gov.ph`.',
    `- Captured ${today} — ${rows.length} ${abbr}s.`,
    '',
  ].join('\n');

  return `${fm}${head}\n${tableRows}\n${subset}\n${foot}`;
}

// ---- Self-test: `node parse.mjs` ----
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const RMC_SAMPLE = `2026 Revenue Memorandum Circulars
NO. OF ISSUANCE SUBJECT DATE OF ISSUE
RMC No. 71-2026 Clarification on the Extension of the Validity of Certificates of Compliance (COC) ... Pursuant to the Cooperative Development Authority Memorandum Circular No. 2026-07, Series of 2026
Digest | Full Text | Annex A June 24, 2026
RMC No. 55-2026 Obligation of Electronic Marketplace Operators and Digital Financial Services Providers on the submission of the prescribed Alphabetical List of Employees/Payees
Digest | Full Text May 26, 2026
RMC No. 41-2026

Publishing the Updated List of Registered Manufacturers/Importers/Exporters with the Corresponding Product Brands/Variants ... for Compliance Purposes
Digest | Full Text | Annex A | Annex B | Annex N

April 30, 2026
RMC No. 24-2026 Clarifying the Application of Revenue Memorandum Circular Nos. 5-2024 and 38-2024 on the Tax Treatment of Cross-Border Services
Digest | Full Text March 30, 2026
RMC NO. 31-2026 Circularizing Executive Order No. 114, Series of 2026
Digest | Full Text April 17, 2026
Copyright © Bureau of Internal Revenue.
All Rights Reserved`;

  const rows = parseIssuances(RMC_SAMPLE, 'RMC');
  console.log(`Parsed ${rows.length} RMC rows (expected 5):`);
  for (const r of rows) console.log(`  RMC ${r.num} | ${r.date} | payroll='${r.payroll}' | ${r.subject.slice(0, 60)}...`);

  // assertions
  const nums = rows.map((r) => r.num).join(',');
  const assert = (cond, msg) => console.log(`${cond ? 'PASS' : 'FAIL'}: ${msg}`);
  assert(rows.length === 5, `row count 5 (got ${rows.length})`);
  assert(nums === '71-2026,55-2026,41-2026,24-2026,31-2026', `numbers in order (got ${nums})`);
  assert(rows.find((r) => r.num === '55-2026')?.payroll === 'Y', '55-2026 tagged Y (alphalist/employees)');
  assert(rows.find((r) => r.num === '24-2026')?.payroll === '', '24-2026 not flagged (cross-ref, not payroll)');
  assert(rows.find((r) => r.num === '41-2026')?.date === 'April 30, 2026', '41-2026 date parsed from own line');
  assert(rows.find((r) => r.num === '41-2026')?.subject.startsWith('Publishing the Updated List'), '41-2026 multi-line subject joined');
  assert(rows.find((r) => r.num === '71-2026')?.subject.includes('Cooperative Development Authority'), '71-2026 keeps embedded "No. 2026-07" cross-ref without splitting');

  const RR_SAMPLE = `2026 Revenue Regulations
NO. OF ISSUANCE SUBJECT DATE OF ISSUE
RR No. 4-2026 Prescribing guidelines and procedures for the availment of a one-time abatement of taxes and/or penalties for Micro Taxpayers
Digest | Full Text | Application Form June 22, 2026
Copyright ©`;
  const rr = parseIssuances(RR_SAMPLE, 'RR');
  assert(rr.length === 1 && rr[0].num === '4-2026', `RR parse (got ${rr.length}, ${rr[0]?.num})`);
  assert(rr[0].links.includes('Application Form'), 'RR links include Application Form');
}
