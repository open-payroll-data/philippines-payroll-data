# Indonesia Payroll — Index

> Country: Indonesia | Currency: Indonesian Rupiah (Rp / IDR) | Tax authority: DJP | Social security: BPJS Ketenagakerjaan + BPJS Kesehatan | Labour: Kemnaker
> AI: This index lists every file in `id/`. For the full master index go to `../INDEX.md`.

---

## 🔎 Answer router — AI starts here

Match the question to a row, open that one file. Don't scan the repo.

| If you need… | Open |
|--------------|------|
| **Income tax (PPh 21)** rates, PTKP, the **TER monthly withholding** method, employer forms | [pajak/income_tax_2025.md](pajak/income_tax_2025.md) |
| **BPJS** contributions — Ketenagakerjaan (JHT/JKK/JKM/JP) + Kesehatan (health) | [bpjs/contributions.md](bpjs/contributions.md) |
| **Working hours, overtime** (1/173 rule, 1.5×/2×) | [labour/working_hours_overtime.md](labour/working_hours_overtime.md) |
| **Annual leave, THR** (religious-holiday allowance), **maternity** (UU KIA) | [labour/leave_and_thr.md](labour/leave_and_thr.md) |
| **Severance** (uang pesangon) & long-service pay | [labour/severance.md](labour/severance.md) |
| **Minimum wage** (UMP / UMK, by province) | [wages/minimum_wage.md](wages/minimum_wage.md) |
| **Exact numbers for software** (typed JSON, generated from + validated against these files) | [`../data/id_income_tax_2025.json`](../data/id_income_tax_2025.json) · [`../data/id_bpjs_2025.json`](../data/id_bpjs_2025.json) |
| **When/where** gov't rates change (monitoring sources) | [../SCHEMA.md](../SCHEMA.md) → Golden sources |

> Every target file opens with frontmatter (rates, effective dates, source, `last_verified`) and a `## Summary`. Read those two first.

---

## Quick reference — current rates

| Item | Rate / Amount | File |
|------|--------------|------|
| Income tax (PPh 21) | 5%–35% graduated; top 35% above Rp5,000,000,000 | [pajak/income_tax_2025.md](pajak/income_tax_2025.md) |
| Monthly withholding | TER method (PP 58/2023): TER rate Jan–Nov, annual reconcile in Dec | [pajak/income_tax_2025.md](pajak/income_tax_2025.md) |
| PTKP (single, TK/0) | Rp54,000,000/year | [pajak/income_tax_2025.md](pajak/income_tax_2025.md) |
| BPJS JHT (old-age) | 5.7% (employer 3.7% + employee 2%) | [bpjs/contributions.md](bpjs/contributions.md) |
| BPJS JP (pension) | 3% (employer 2% + employee 1%); cap Rp11,086,300/mo (2026) | [bpjs/contributions.md](bpjs/contributions.md) |
| BPJS JKK / JKM | 0.24–1.74% / 0.3% (employer-only) | [bpjs/contributions.md](bpjs/contributions.md) |
| BPJS Kesehatan (health) | 5% (employer 4% + employee 1%); cap Rp12,000,000/mo | [bpjs/contributions.md](bpjs/contributions.md) |
| Overtime | 1.5× first hour / 2× subsequent; hourly = 1/173 monthly | [labour/working_hours_overtime.md](labour/working_hours_overtime.md) |
| Annual leave | ≥12 days after 12 months | [labour/leave_and_thr.md](labour/leave_and_thr.md) |
| THR | 1 month's wage (≥12 months); ≥7 days before holiday | [labour/leave_and_thr.md](labour/leave_and_thr.md) |
| Minimum wage (Jakarta UMP 2026) | Rp5,729,876/month | [wages/minimum_wage.md](wages/minimum_wage.md) |

---

## All files

### Pajak / Income Tax (`pajak/`)
- [`pajak/income_tax_2025.md`](pajak/income_tax_2025.md) — PPh 21: 5–35% annual scale, PTKP, the TER monthly withholding method, Bukti Potong 1721-A1

### BPJS (`bpjs/`)
- [`bpjs/contributions.md`](bpjs/contributions.md) — BPJS Ketenagakerjaan (JHT, JKK, JKM, JP) + BPJS Kesehatan, with the 2026 JP wage cap

### Labour (`labour/`)
- [`labour/working_hours_overtime.md`](labour/working_hours_overtime.md) — 40-hour week, overtime (1/173 rule, 1.5×/2×) — PP 35/2021
- [`labour/leave_and_thr.md`](labour/leave_and_thr.md) — Annual leave, mandatory THR, maternity (UU KIA 2024), paternity
- [`labour/severance.md`](labour/severance.md) — Uang pesangon + uang penghargaan masa kerja (PP 35/2021)

### Wages (`wages/`)
- [`wages/minimum_wage.md`](wages/minimum_wage.md) — UMP/UMK provincial minimum wage (2026; Jakarta Rp5,729,876)

---

## Key authorities & instruments

| Authority / Instrument | Covers |
|------------------------|--------|
| DJP (UU HPP, PP 58/2023, PMK 168/2023) | Income tax PPh 21, TER monthly withholding |
| BPJS Ketenagakerjaan (PP 44/45/46-2015) | JHT, JKK, JKM, JP |
| BPJS Kesehatan (Perpres 82/2018 jo. 64/2020) | Health insurance |
| Kemnaker (UU 13/2003, UU Cipta Kerja, PP 35/2021, PP 36/2021) | Hours, overtime, leave, THR, severance |
| UU No. 4/2024 (UU KIA) | Maternity/paternity leave |
| PP 36/2021 jo. PP 49/2025 + SK Gubernur | Minimum wage (UMP/UMK) |

---

_Last updated: 2026-06-30_
