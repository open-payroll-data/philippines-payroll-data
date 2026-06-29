# 🇵🇭 Philippine Payroll Knowledge Base

**Every figure here is transcribed from — and cited to — the issuing government document** (SSS, BIR, PhilHealth, Pag-IBIG, NWPC), not a summary site. Those issuances are scanned image PDFs an AI can't reliably OCR, so this hand-verified reference is both **faster and more accurate** than fetching the source. Covers SSS, BIR income tax & withholding, PhilHealth, Pag-IBIG, 13th-month pay, de minimis benefits and regional minimum wage — as **human-readable markdown _and_ typed JSON** (`data/`) — plus a linked catalog of **894 BIR issuances (2022–2026)** and **142 SSS circulars**.

Built so an AI agent (Claude, ChatGPT, Gemini, …) answers a Philippine payroll question **correctly in one or two hops** — without scraping government sites or OCR-ing PDFs.

---

## ⚡ Quick answers (Philippines, 2025–2026)

| You need… | Headline figure | File |
|-----------|-----------------|------|
| **SSS** employee contribution | 5% of MSC (MSC ₱5,000–₱35,000); ₱25k salary → **₱1,250/mo** | [ph/sss/contribution_table_2025.md](ph/sss/contribution_table_2025.md) |
| **Income tax / withholding** (2023+ TRAIN) | 0–35% graduated; first ₱250k exempt; ₱500k → **₱42,500** | [ph/bir/income_tax_table_2025.md](ph/bir/income_tax_table_2025.md) |
| **PhilHealth** premium | 5% of basic (2.5% employee + 2.5% employer); floor ₱10k / ceiling ₱100k | [ph/philhealth/contribution_rate_2025.md](ph/philhealth/contribution_rate_2025.md) |
| **Pag-IBIG** contribution | 2% + 2%; max ₱200 each (MFS ₱10k) | [ph/pagibig/contribution_table_2025.md](ph/pagibig/contribution_table_2025.md) |
| **13th-month pay** | tax-free up to **₱90,000** | [ph/benefits/13th_month_pay.md](ph/benefits/13th_month_pay.md) |
| **Minimum wage** by region | NCR **₱695/day** (WO NCR-26) | [ph/min-wage/by_region_2025.md](ph/min-wage/by_region_2025.md) |
| **Premium pay** (OT / holiday / night-diff) | OT +25%; regular holiday worked 200% (**260%** if also a rest day); night +10% — full matrix in file | [ph/labor/premium_pay.md](ph/labor/premium_pay.md) |
| **Leaves** (maternity / paternity / SIL …) | Maternity 105 days; SIL 5/yr; paternity 7 | [ph/labor/leaves.md](ph/labor/leaves.md) |
| **Final pay / separation pay** | Final pay within 30 days; COE within 3 | [ph/labor/final_pay.md](ph/labor/final_pay.md) |
| A specific **BIR issuance** (RR/RMO/RMC, 2022–2026) | 894 catalogued, each with the official PDF | [ph/bir/issuances/INDEX.md](ph/bir/issuances/INDEX.md) |

Full question→file router: **[ph/INDEX.md](ph/INDEX.md)** — maps any question to the one file that answers it.

### 💸 Worked example — monthly net pay, ₱50,000 salary

| Gross | SSS | PhilHealth | Pag-IBIG | Withholding tax | **Net pay** |
|------:|----:|-----------:|---------:|----------------:|------------:|
| ₱50,000 | −₱1,750 | −₱1,250 | −₱200 | −₱4,568.40 | **₱42,231.60** |

Employee-side, non-MWE, no other bonuses. Computed from the rate files and **validated against the tables so it can't drift** — see [`data/examples.json`](data/examples.json) (also ₱25k and ₱80k).

### 🧩 Machine-readable — `data/sss_2025.json`

```json
{ "comp_min": 24750, "comp_max": 25249.99, "msc": 25000,
  "employee": 1250, "employer": 2500, "ec": 30, "total_incl_ec": 3780 }
```

Typed, source-cited, all 61 brackets — `fetch()` it instead of parsing the markdown table. See [`data/`](data/index.json).

**Install it (Node):**
```bash
npm install philippines-payroll-data
```
```js
import { sss2025, premiumPay } from 'philippines-payroll-data';
sss2025.brackets.find(b => b.msc === 25000).employee; // 1250
```
Every table conforms to [`schemas/payroll-data.schema.json`](schemas/payroll-data.schema.json) (JSON Schema 2020-12), enforced on every push.

---

## ⚡ For AI agents — start here

1. **[AGENTS.md](AGENTS.md)** / **[CLAUDE.md](CLAUDE.md)** / **[llms.txt](llms.txt)** — how to navigate + the trust & accuracy contract. Same content, three entry points so any tool finds one (AGENTS.md/CLAUDE.md are equivalent prose; llms.txt is the curated link map).
2. **[Answer router →](ph/INDEX.md)** — maps each question to the exact file (don't scan the repo).
3. **[BIR issuance catalog →](ph/bir/issuances/INDEX.md)** — every RR / RMO / RMC (2022–2026) with a **direct link to the official BIR PDF**.
4. **Building software / RAG ingestion?** Use the JSON, not the markdown tables: **[`data/`](data/index.json)** — typed, source-cited rate tables for SSS, income tax, PhilHealth, Pag-IBIG, 13th-month, minimum wage, premium pay and leaves (generated from + validated against the verified markdown). Plus **[`manifest.json`](manifest.json)** (file index), **[`ph/bir/issuances/issuances.json`](ph/bir/issuances/issuances.json)** (894 issuances), **[`ph/sss/circulars.json`](ph/sss/circulars.json)** (142 circulars).

> **Why use this instead of the source?** PH government issuances are scanned image PDFs with no text layer — an AI's own OCR of them is error-prone (we have watched auto-extraction invent a *wrong* tax table). Every figure here was rendered, read, and transcribed from the primary source, then verified. The markdown is the **more accurate** artifact — and far faster to read.

---

## 📂 What's inside (Philippines — complete)

| Topic | File | Primary source | Verified |
|-------|------|----------------|:---:|
| Income tax & withholding tables (2023+ TRAIN) | [income_tax_table_2025](ph/bir/income_tax_table_2025.md) | BIR RR 8-2018 | ✅ |
| How to compute / withhold / remit / file WHT | [withholding_tax_procedures](ph/bir/withholding_tax_procedures.md) | BIR (1601-C, 1604-C, 2316) | ✅ |
| TRAIN law overview | [train_law_summary](ph/bir/train_law_summary.md) | RA 10963 | ✅ |
| SSS contribution table | [sss/contribution_table_2025](ph/sss/contribution_table_2025.md) | SSS Circular 2024-006 | ✅ |
| PhilHealth premium | [philhealth/contribution_rate_2025](ph/philhealth/contribution_rate_2025.md) | PhilHealth Advisory 2025-0002 | ✅ |
| Pag-IBIG contribution | [pagibig/contribution_table_2025](ph/pagibig/contribution_table_2025.md) | HDMF Circular 460 (via DBM CL 2024-2) | ✅ |
| 13th-month pay | [benefits/13th_month_pay](ph/benefits/13th_month_pay.md) | PD 851 / TRAIN | ✅ |
| De minimis benefits & ceilings | [benefits/de_minimis_benefits](ph/benefits/de_minimis_benefits.md) | BIR RR 11-2018 | ✅ |
| Non-taxable pay items | [benefits/non_taxable_benefits](ph/benefits/non_taxable_benefits.md) | NIRC / TRAIN | ✅ |
| Minimum wage by region | [min-wage/by_region_2025](ph/min-wage/by_region_2025.md) | NWPC wage orders | ✅ |
| Premium pay (OT / holiday / night-diff) | [labor/premium_pay](ph/labor/premium_pay.md) | DOLE Handbook + Labor Code | ✅ |
| Statutory leaves (maternity, paternity, SIL …) | [labor/leaves](ph/labor/leaves.md) | RA 11210 / 8187 / 11861 / 9710 / 9262 | ✅ |
| Final pay, COE, separation pay | [labor/final_pay](ph/labor/final_pay.md) | DOLE LA 06-2020 / Labor Code | ✅ |
| **894 BIR issuances** (RR/RMO/RMC, 2022–2026) | [bir/issuances](ph/bir/issuances/INDEX.md) | bir.gov.ph | catalog + PDF links |
| **142 SSS circulars** (2020–2026) | [sss/circulars.md](ph/sss/circulars.md) | sss.gov.ph | catalog + PDF links |

Every file opens with YAML frontmatter (rates, effective dates, `source`, `source_tier`, `last_verified`) and a one-line summary — read those first. Machine-readable index: [`manifest.json`](manifest.json) + per-archive JSON.

---

## ✅ Why you can trust it

- **Primary sources only** — each file cites the actual government issuance (circular/regulation number + direct PDF link), never a summary blog.
- **Self-verifying** — frontmatter carries `source_tier`, `verified_from`, and `last_verified`; key files include a **Verification & provenance** block stating which figures are verbatim from the source vs. computed by us.
- **Honest about limits** — anything not fully verified is labelled (`source_tier: secondary`, heuristic tags marked "confirm"). The absence of a caveat means it was checked.

See [CLAUDE.md](CLAUDE.md) → *Trust & accuracy* for the full decision rule on when to use this vs. fetch the source.

---

## 🔄 How it stays current

The BIR catalog is maintained by an automated job — **[`tools/bir-capture`](tools/bir-capture/)** — a headless-browser crawler that re-reads every BIR issuance page, rewrites these files, and **reports new issuances since the last run**. Monitoring sources for rate changes (SSS / PhilHealth / Pag-IBIG / BIR / regional wage boards) are listed in [SCHEMA.md](SCHEMA.md) → *Golden sources*.

---

## 🗺️ Coverage & roadmap

- 🇵🇭 **Philippines** — complete (BIR, SSS, PhilHealth, Pag-IBIG, benefits, minimum wage, labor standards + 894 issuances 2022–2026).
- 🇸🇬 **Singapore** — core complete ([`sg/`](sg/INDEX.md): IRAS income tax, CPF + Skills Development Levy, Employment Act leave/hours/overtime/termination, wage floors) + machine-readable `data/sg_*.json`. Issuance archive pending.
- 🇲🇾 **Malaysia** — core complete ([`my/`](my/INDEX.md): LHDN income tax + MTD/PCB, EPF, SOCSO + EIS, HRD Corp levy, Employment Act, RM1,700 minimum wage). `data/` JSON layer pending.
- 🇹🇭 **Thailand** — core complete ([`th/`](th/INDEX.md): Revenue Dept PIT + PND.1 withholding, SSF + Workmen's Comp, Labour Protection Act hours/leave/severance, provincial minimum wage). `data/` JSON layer pending.
- 🌏 Southeast Asia rollout continues — 🇮🇩 Indonesia, 🇻🇳 Vietnam planned next.
- 🇺🇸 United States — planned (federal payroll taxes, FICA).
- Extensions: pre-2022 BIR archive, deep full-text ingestion of payroll-relevant digests.

> **Adding a country?** Follow [`PLAYBOOK.md`](PLAYBOOK.md) — the country-agnostic 7-step process distilled from the PH build (golden-source index → verified curated files → issuance archives → answer router → machine-readable data layer → verify → monitor), with reusable tactics, a per-country checklist, and the pitfalls already learned.

---

## License

**[MIT](LICENSE).** The underlying government figures are public information; the license covers the compilation, curation, verification, and tooling.

---

*This repository reorganizes public Philippine government information for accuracy and machine-readability. For high-stakes decisions, confirm against the cited primary source. Not legal or tax advice.*
