---
country: ph
category: bir
record_type: archive-index
topic: BIR Revenue Issuances archive — index, taxonomy, capture status, and the automated capture job
last_verified: 2026-06-24
tags: [bir, issuances, archive, rr, rmo, rmc, index, automated]
---

# BIR Revenue Issuances — Archive

A golden-source mirror of BIR's official issuances (the "archive everything, then
tag relevance" layer). Maintained by the **automated capture job** in
[`tools/bir-capture`](../../../tools/bir-capture/) — re-runnable, idempotent, and
it reports new issuances each run. Curated payroll KB files (e.g.
[`../income_tax_table_2025.md`](../income_tax_table_2025.md)) sit on top.

Master source: [bir.gov.ph/revenue-issuances-details](https://www.bir.gov.ph/revenue-issuances-details)

## Taxonomy — what we capture

| Type | What it is | Captured? |
|------|-----------|-----------|
| **RR** — Revenue Regulations | Finance-Secretary-signed rules enforcing the NIRC. **Where income-tax & withholding rules live.** | ✅ keep |
| **RMO** — Revenue Memorandum Orders | Internal BIR directives/procedures. Rarely payroll-relevant. | ✅ keep |
| **RMC** — Revenue Memorandum Circulars | Publishes/amplifies laws, rules, precedents. Sometimes payroll-relevant. | ✅ keep |
| RAO — Revenue Administrative Orders | BIR internal org structure/staffing. | ❌ skip |
| RDAO — Revenue Delegation of Authority Orders | Delegated CIR functions. | ❌ skip |

## Capture status — 2022–2026 complete (894 issuances)

| Type | 2026 | 2025 | 2024 | 2023 | 2022 | Total | Pre-2022 |
|------|-----:|-----:|-----:|-----:|-----:|------:|----------|
| [RR](rr/)  | 4 | 29 | 17 | 16 | 15 | **81** | ⬜ bir-archive |
| [RMO](rmo/) | 13 | 48 | 51 | 40 | 59 | **211** | ⬜ bir-archive |
| [RMC](rmc/) | 71 | 110 | 135 | 126 | 160 | **602** | ⬜ bir-archive |
| | | | | | | **894** | |

Files: `{rr,rmo,rmc}/{year}.md` — each row has a clean subject, date, payroll tag, and a **direct link to the official BIR PDF** (Full Text / Annex). Captured by **structured table extraction** (reads the BIR table cells + anchor URLs directly — exact, not text-parsed; this is what makes it 100%-faithful to the source). ~98 rows auto-flagged payroll-relevant.

## Payroll-relevant rollup
Heuristic tags surface the high-signal subset (withholding, alphalist, 13th month,
de minimis, annual ITR, etc.). They are weighted toward **RMCs** (which clarify
filing/withholding) and a few **RRs**. The substantive income-tax/withholding
**Revenue Regulations** are RR **8-2018** and RR **11-2018** — pre-2022, reachable
via the `bir-archive` extension below (the 2023+ tax tables themselves are already
verified directly in [`../income_tax_table_2025.md`](../income_tax_table_2025.md)).

To list every flagged row: open each `{year}.md` and read its "Payroll-relevant
subset" section, or grep the tables for `| Y |` / `| ~ |`.

## The automated capture job

[`tools/bir-capture`](../../../tools/bir-capture/) — a headless-browser crawler
(the BIR lists are JS/server-streamed, so a plain fetch fails). It:
- discovers every RR/RMO/RMC year page from the master index (handles the RMO
  singular/plural slug quirk: `2025-Revenue-Memorandum-Order` vs `2026-…-Orders`),
- renders each, parses the rows, tags payroll-relevance, writes `{type}/{year}.md`,
- diffs against `state.json` and prints **NEW issuances since the last run**.

Run: `node capture.mjs` (all) · `--type=rmc --year=2025` (narrow). See its README
for setup and scheduling. RAO/RDAO are excluded by design.

## URL patterns
```
https://www.bir.gov.ph/{YEAR}-Revenue-Regulations
https://www.bir.gov.ph/{YEAR}-Revenue-Memorandum-Circulars
https://www.bir.gov.ph/{YEAR}-Revenue-Memorandum-Orders     # 2026
https://www.bir.gov.ph/{YEAR}-Revenue-Memorandum-Order      # 2025 and earlier (singular!)
```

## Remaining: pre-2022 ("Previous Years")
Every type's "Previous Years" link points to **one archive page**:
[bir.gov.ph/bir-archive](https://www.bir.gov.ph/bir-archive). It's a deeper
index (Revenue Regulations / RMO / RMC / Rulings / Bulletins → older issuances)
with a different sub-structure than the year pages. Capturing it is a future
extension to the job — not yet built. The 2022–2026 set above covers the
currently-operative issuances.

## Capture method note
BIR is a Next.js app; issuance lists stream into the page document server-side, so
a plain `curl`/WebFetch sees only a `Loading…` skeleton. The job renders the page
in a real (headless) browser and reads the rendered text. Digest/Full-Text/Annex
PDFs are linked per row on `bir-cdn.bir.gov.ph` (often scanned → render-from-scan
to extract text). Last full capture: 2026-06-24.
