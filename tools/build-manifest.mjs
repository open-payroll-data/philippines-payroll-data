// build-manifest.mjs — generate a root manifest.json indexing every markdown
// file with its frontmatter metadata, for RAG / programmatic ingestion.
//   node tools/build-manifest.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SKIP = new Set(['node_modules', 'HANDOFF.md', 'PUBLISHING.md']);
async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function frontmatter(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!mm) continue;
    let [, k, v] = mm;
    v = v.trim().replace(/^["']|["']$/g, '');
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    }
    fm[k] = v;
  }
  return fm;
}

const files = (await walk(ROOT)).sort();
const records = [];
for (const f of files) {
  const rel = path.relative(ROOT, f);
  const fm = frontmatter(await fs.readFile(f, 'utf8'));
  // Files with no `country` frontmatter (README, CLAUDE, AGENTS, INDEX, SCHEMA,
  // HANDOFF, PUBLISHING, ph/INDEX) are navigation/docs, not rate files — mark
  // them clearly so an AI filtering the manifest for trusted data doesn't read
  // a null source_tier as "unverified rate file".
  const isMeta = !fm.country && !fm.record_type;
  const rec = {
    path: rel,
    country: fm.country || null,
    category: fm.category || null,
    record_type: fm.record_type || (isMeta ? 'navigation' : (rel.includes('INDEX') ? 'index' : 'topic')),
    topic: fm.topic || (isMeta ? 'Navigation / documentation (not a rate file)' : null),
    source_tier: fm.source_tier || (isMeta ? 'navigation' : null),
    volatility: fm.volatility || 'stable',
    last_verified: fm.last_verified || null,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
  };
  if (fm.captured_count) rec.captured_count = Number(fm.captured_count);
  records.push(rec);
}

const manifest = {
  name: 'Philippine Payroll Knowledge Base',
  description: 'AI-ready, primary-sourced Philippine payroll reference (BIR, SSS, PhilHealth, Pag-IBIG, benefits, minimum wage) + linked catalogs of 894 BIR issuances and 142 SSS circulars.',
  generated: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date()),
  entry_points: { ai_navigation: 'AGENTS.md', ai_navigation_claude: 'CLAUDE.md', llms_txt: 'llms.txt', human_readme: 'README.md', answer_router: 'ph/INDEX.md' },
  structured_data: {
    'data/index.json': 'Machine-readable rate-table layer (SSS, income tax, PhilHealth, Pag-IBIG, 13th-month, minimum wage, premium pay, leaves) — typed JSON generated from and validated against the verified markdown; the index lists each file. Use for payroll computation. Build/validate with tools/build-data.mjs. Installable on npm as philippines-payroll-data.',
    'schemas/payroll-data.schema.json': 'JSON Schema (2020-12) that every data/*.json rate file conforms to; enforced by tools/build-data.mjs --check.',
    'ph/bir/issuances/issuances.json': 'Every BIR RR/RMO/RMC issuance (2022-2026), one record each (number, type, year, date, subject, payroll tag, source PDF links).',
    'ph/sss/circulars.json': 'Every SSS circular (2020-2026), one record each (number, year, title, payroll tag, PDF link).',
  },
  file_count: records.length,
  files: records,
};
await fs.writeFile(path.join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote manifest.json: ${records.length} files indexed`);
