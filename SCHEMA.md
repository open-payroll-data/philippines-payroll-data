# Schema — How to Add Files to This Knowledge Base

## File template

Copy this block to the top of every new file:

```markdown
---
country: ph
category: bir
topic: One-line description of what this file covers
effective_year: 2025
effective_date_start: 2025-01-01
effective_date_end: (leave blank if still current)
source: "Primary issuing document — e.g. BIR Revenue Regulation No. XX-XXXX — direct URL to the ACTUAL agency issuance, not a summary site"
source_tier: primary        # primary = the issuing agency's own document; secondary = summary/news site (avoid — confirm against primary)
last_verified: YYYY-MM-DD
verified_from: "How it was checked — e.g. 'Read the scanned circular PDF directly'"
tags: [tag1, tag2, tag3]
---

## Summary
2–3 sentences. What question does this file answer? What are the key numbers?

## [Body — tables, rules, examples]

## Source & Notes
- Official source: [Name](URL)
- Last verified against source: YYYY-MM-DD
- Known limitations or caveats

## See Also
- Add a relative link to each related file (one in `../<category>/`) with a one-line reason. See any topic file's "See Also" section for real examples.
```

## Rules for adding content

1. **One topic per file.** Don't combine SSS and PhilHealth in one file.
2. **Golden source only — cite the issuing agency's own document.** Link the actual circular / regulation / wage-order PDF from the agency itself, NOT a third-party summary (Grant Thornton, KPMG, payroll-vendor blogs, news sites). Secondary sites are fine as a first lead, but every published number must be confirmed against — and cited to — the primary issuance. Set `source_tier: primary`. If a value can only be found on a secondary site, mark `source_tier: secondary` and flag it as unverified. *(This rule exists because reading the actual SSS Circular 2024-006 revealed errors that summary sites carried — e.g. minimum MSC is ₱5,000, not ₱4,000.)*
3. **Always set `last_verified`.** Use today's date when you write the file.
4. **Use tables for rates.** Markdown tables are faster for AI to parse than prose.
5. **Add a See Also section.** Link related files — AI follows these to find adjacent facts.
6. **Update INDEX.md.** Add a row to the master index AND the country index.
7. **Name files with year suffix** when the data changes annually: `topic_2025.md`. For timeless rules, omit the year.

## Golden sources (primary issuing channels)

Always verify and cite from these official agency channels — never a summary site:

| Agency | Golden source (monitor + cite this) |
|--------|-------------------------------------|
| BIR (tax, withholding) | [bir.gov.ph → Revenue Issuances](https://www.bir.gov.ph/revenue-issuances-details) — RR / RMC / RMO. New tax laws also in the [Official Gazette](https://www.officialgazette.gov.ph/section/laws/republic-acts/) |
| SSS (contributions) | [sss.gov.ph/sss-circulars](https://www.sss.gov.ph/sss-circulars/) — grouped by year; contribution circulars appear here ~December for January effectivity |
| PhilHealth (premiums) | [philhealth.gov.ph](https://www.philhealth.gov.ph) → Advisories & Circulars; predictable dated URLs (e.g. `/advisories/2026/PA2026-0001.pdf`) |
| Pag-IBIG / HDMF | [pagibigfund.gov.ph](https://www.pagibigfund.gov.ph) → Circulars (reCAPTCHA-protected — manual download) |
| Minimum wage | [nwpc.dole.gov.ph](https://nwpc.dole.gov.ph) → Wage Orders + the consolidated "Latest Wage Orders Matrix" PDF |
| Laws (Republic Acts) | [Official Gazette](https://www.officialgazette.gov.ph/section/laws/) — laws & executive issuances only (NOT agency circulars) |

**Singapore golden sources (monitor + cite):**

| Agency | Golden source | Change cadence |
|--------|---------------|----------------|
| IRAS (income tax) | [iras.gov.sg → Individual Income Tax rates](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates) (rate tables are JS accordions — render, don't plain-fetch) | Budget-driven (Feb); rebate set per YA |
| CPF Board (CPF + SDL) | [cpf.gov.sg → Employer contribution rates](https://www.cpf.gov.sg/employer/employer-obligations/cpf-contribution-and-allocation-rates) — dated rate-table PDFs | Year-start (1 Jan); senior-rate phase-ins + OW-ceiling steps through 2026 |
| MOM (Employment Act, leave, wage floors) | [mom.gov.sg → Employment practices](https://www.mom.gov.sg/employment-practices) | Parental-leave reforms keyed to child DOB (1 Apr 2025, 1 Apr 2026); LQS step 1 Jul 2026 |

> SG sources are mostly **clean digital pages/PDFs** (not scanned), so transcription is reliable — but the IRAS rate tables are JavaScript-rendered, so a plain fetch returns them empty (render the page).

**Malaysia golden sources (monitor + cite):**

| Agency | Golden source | Change cadence |
|--------|---------------|----------------|
| LHDN/IRBM (income tax, MTD/PCB) | [hasil.gov.my → Tax Rate / Responsibility of Employer](https://www.hasil.gov.my/en/employers/responsibility-of-employer/); annual PCB computerised-calc specification | Federal Budget (Oct); PCB spec reissued yearly |
| EPF/KWSP | [kwsp.gov.my → Mandatory contribution + Third Schedule](https://www.kwsp.gov.my/en/employer/responsibilities/mandatory-contribution) (blocks server fetch — use a browser) | Year-start; non-citizen tier (2% from Oct 2025) may step up |
| PERKESO (SOCSO + EIS) | [perkeso.gov.my → Rate of Contribution](https://www.perkeso.gov.my/en/rate-of-contribution.html) (Act 4 + Act 800 band-table PDFs) | Ceiling raised to RM6,000 (Oct 2024); watch Employers Circulars |
| MOHR (Employment Act, minimum wage) | Employment Act 1955 (jtksm.mohr.gov.my); Minimum Wages Order (Federal Gazette, lom.agc.gov.my) | EA amended ~2022; minimum wage by periodic Orders |

> MY sources mix clean HTML (LHDN), browser-only pages (KWSP), and band-table PDFs (PERKESO). Store SOCSO/EIS and the EPF Third Schedule as **RM band tables** (they are published as bands, not percentages).

**Thailand golden sources (monitor + cite):**

| Agency | Golden source | Change cadence |
|--------|---------------|----------------|
| Revenue Department (income tax, PND.1) | [rd.go.th — annual PND.91 return guide + Revenue Code](https://www.rd.go.th/english/) (the English summary page 6045.html is STALE — use the dated return guide) | Yearly allowances; brackets stable |
| Social Security Office (SSF + WCF) | [sso.go.th — contributions + Ministerial Regulations](https://www.sso.go.th/) (Royal Gazette PDFs) | **Ceiling rising: ฿17,500 (2026) → ฿20,000 (2029) → ฿23,000 (2032)** — enacted |
| Ministry of Labour (Labour Protection Act) | [mol.go.th / labour.go.th](https://www.mol.go.th/en/) + Royal Gazette | Maternity raised to 120 days (Dec 2025); watch amendments |
| Wage Committee (minimum wage) | MOL Wage Committee Notifications (Royal Gazette) | Provincial daily rates revised ~yearly |

> TH primary sources are often **Thai-language** (English versions lag — the RD English summary page is stale; the Royal Gazette is Thai). Read the Thai Royal Gazette PDF for enacted changes (SSF ceiling, maternity) and cross-check English where available.

**Note on scanned PDFs:** Some issuances (e.g. SSS circulars) are image-only scans with no text layer — a plain text fetch returns nothing. They must be rendered to images and read visually (or OCR'd). This is exactly the friction this KB removes for every downstream AI.

## Trust signals — make every derived file self-verifying

A downstream AI should be able to trust a file **without re-fetching the source**. Bare claims ("100% accurate") don't earn that — embedded, checkable evidence does. For every `source_tier: primary` file:

1. **Frontmatter:** `source` (exact issuance + direct PDF link), `source_tier`, `last_verified`, `verified_from` (how it was checked).
2. **A "✅ Verification & provenance" block** near the top stating: which primary it was checked against, on what date, and **which parts are verbatim from the source vs derived by us** (arithmetic / worked examples) — so the AI knows exactly what is the law versus our computation.
3. **Honest caveats:** flag anything not fully verified (`source_tier: secondary`, heuristic tags marked "confirm"). The absence of a caveat must reliably mean "verified".

Why it matters: the sources are scanned image PDFs that an AI's own OCR reads *worse* than our transcription — so a self-verifying derived file is both faster **and** more accurate than the AI going to source. This is what lets the root `CLAUDE.md` instruct AIs to use our files directly.

**Caveat wording — tested against models (use-directly by default).** When you write a file's trust note, lead with the positive default — *use this directly; it is more reliable than your own OCR of the scanned source* — then name the only narrow reasons to re-fetch (verbatim legal wording, or a contested figure). **Avoid a bare "confirm against [agency]"**: to an AI that reads as "go web-search," the exact reflex this KB exists to remove. If a file's data genuinely changes year-round, set `volatility: continuously-changing` in its frontmatter and tell the reader to re-pull the golden source before relying on it (today only `ph/min-wage/by_region_2025.md`); absence of the flag means stable.

## Category codes

| Code | Covers |
|------|--------|
| `bir` | BIR regulations, income tax, withholding |
| `sss` | SSS contributions |
| `philhealth` | PhilHealth premiums |
| `pagibig` | Pag-IBIG / HDMF contributions |
| `benefits` | 13th month, de minimis, leave, fringe benefits |
| `min-wage` | Minimum wage by region |
| `labor` | Labor standards — premium pay (OT/holiday/night-diff), statutory leaves, final pay, separation pay |
| `general` | Payroll process, general rules |

**Singapore (`sg/`) categories:**

| Code | Covers |
|------|--------|
| `iras` | IRAS — personal income tax, employer reporting (IR8A/AIS), tax clearance (IR21) |
| `cpf` | CPF Board — CPF contributions and the Skills Development Levy (SDL) |
| `employment-act` | Employment Act — coverage, hours/overtime, leave, termination, retrenchment (shared by SG + MY) |
| `wages` | Wage floors / minimum wage (shared by SG LQS/PWM + MY Minimum Wages Order) |

**Malaysia (`my/`) categories:**

| Code | Covers |
|------|--------|
| `lhdn` | LHDN/IRBM — income tax, MTD/PCB monthly withholding, employer returns (Form E/EA) |
| `epf` | EPF / KWSP — Employees Provident Fund contributions |
| `socso` | PERKESO — SOCSO (Act 4) + EIS (Act 800) |
| `levies` | Employer levies — HRD Corp / HRDF training levy |

**Thailand (`th/`) categories:**

| Code | Covers |
|------|--------|
| `revenue` | Revenue Department — personal income tax, monthly withholding (PND.1), Form 50 Bis |
| `sso` | Social Security Office — Social Security Fund (SSF) + Workmen's Compensation Fund (WCF) |
| `labour` | Labour Protection Act — hours, overtime, leave, severance |
| `wages` | Provincial minimum wage (Wage Committee notifications) — shared `wages` category |

## Tag vocabulary (reuse these for consistency)

`income-tax`, `withholding`, `graduated-tax`, `train-law`, `bir`, `annualization`,
`sss`, `philhealth`, `pagibig`, `hdmf`,
`13th-month`, `de-minimis`, `fringe-benefit`, `non-taxable`, `tax-exempt`,
`minimum-wage`, `ncr`, `region`,
`2023`, `2024`, `2025`, `2026`,
`employer-share`, `employee-share`, `remittance`, `deadline`

## Machine-readable data layer (`data/`)

The markdown in `ph/**` is the **source of truth** (verified against the scanned PDFs) and the reasoning layer. The `data/*.json` files are the **parse layer** for software and exact lookups — they are **generated, never hand-edited**:

- `tools/build-data.mjs` builds each JSON from the verified **rules** (rate %, MSC range, brackets, …) and **validates twice** before writing: (1) arithmetic self-consistency (every figure must follow from the stated rate), and (2) anchor cross-checks that parse the published example rows in the markdown and assert they equal the generated values. If anything would drift, it exits non-zero and writes nothing.
- Run `node tools/build-data.mjs` after changing any rate file; `--check` validates without writing (use in CI). Each JSON carries a `source` block (issuance + PDF URL + `last_verified` + the `markdown` it derives from) and a `volatility` flag.
- To add a topic, add a builder + its validation anchors in `build-data.mjs` — **don't author JSON by hand** (hand-kept copies drift). This is why the data layer can be trusted as much as the markdown: it is provably the same numbers.
- Every `data/*.json` rate file conforms to [`schemas/payroll-data.schema.json`](schemas/payroll-data.schema.json) (JSON Schema 2020-12). `build-data.mjs --check` enforces the envelope (topic, country, and a `source` block with issuance / source_tier / last_verified / markdown) on every push; the schema also ships with the npm package for downstream validation.

## Adding a new country

To extend this KB beyond the Philippines (SG, US, …), follow **[`PLAYBOOK.md`](PLAYBOOK.md)** — the country-agnostic, 7-step process distilled from the PH build: (0) decompose payroll into components + governing agencies; (1) build the golden-source index FIRST; (2) capture verified curated files (provenance blocks, verbatim-vs-derived); (3) build issuance archives per streaming agency (detect JS-app → browser vs server-rendered → fetch; capture real `href`s; emit JSON + state-diff); (4) `{cc}/INDEX.md` answer router; (5) generate + validate the `data/` layer; (6) verify (link-health + multi-model AI test + privacy scan); (7) record the monitoring cadence here in the golden-sources table. The `ph/` folder + `tools/` are the worked reference implementation.
