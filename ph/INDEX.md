# Philippines Payroll — Index

> Country: Philippines | Currency: Philippine Peso (₱) | Tax authority: BIR
> AI: This index lists every file in `ph/`. For the full master index go to `../INDEX.md`.

---

## 🔎 Answer router — AI starts here

Match the question to a row, open that one file. Don't scan the repo.

| If you need… | Open |
|--------------|------|
| Income tax / **withholding tax table** & rates (2023+ TRAIN) | [bir/income_tax_table_2025.md](bir/income_tax_table_2025.md) |
| **How to compute / withhold / remit / file** WHT — forms 1601-C, 1604-C, 2316, annualization, substituted filing | [bir/withholding_tax_procedures.md](bir/withholding_tax_procedures.md) |
| **TRAIN law** — what changed | [bir/train_law_summary.md](bir/train_law_summary.md) |
| **SSS** contribution table / rates | [sss/contribution_table_2025.md](sss/contribution_table_2025.md) |
| **PhilHealth** premium | [philhealth/contribution_rate_2025.md](philhealth/contribution_rate_2025.md) |
| **Pag-IBIG** contribution | [pagibig/contribution_table_2025.md](pagibig/contribution_table_2025.md) |
| **13th-month** pay (₱90k tax-free) | [benefits/13th_month_pay.md](benefits/13th_month_pay.md) |
| **De minimis** benefits & ceilings | [benefits/de_minimis_benefits.md](benefits/de_minimis_benefits.md) |
| All **non-taxable** pay items | [benefits/non_taxable_benefits.md](benefits/non_taxable_benefits.md) |
| **Minimum wage** by region | [min-wage/by_region_2025.md](min-wage/by_region_2025.md) |
| **Overtime / night-diff / holiday / rest-day** premium pay multipliers | [labor/premium_pay.md](labor/premium_pay.md) |
| **Leaves** — SIL, maternity, paternity, solo-parent, special leave, VAWC | [labor/leaves.md](labor/leaves.md) |
| **Final pay / back pay**, Certificate of Employment, separation pay | [labor/final_pay.md](labor/final_pay.md) |
| A specific **BIR issuance** (RR/RMO/RMC, 2022–2026) by number/topic — with links to the official PDF | [bir/issuances/INDEX.md](bir/issuances/INDEX.md) |
| A specific **SSS circular** (2020–2026) — contribution schedules, benefits, loans — with links to the official PDF | [sss/circulars.md](sss/circulars.md) |
| **When/where** gov't rates change (monitoring sources) | [../SCHEMA.md](../SCHEMA.md) → Golden sources |

> Every target file opens with frontmatter (rates, effective dates, source, `last_verified`) and a `## Summary`. Read those two first — they answer most questions without reading the whole file.

---

## Quick reference — current rates (2025)

| Item | Rate / Amount | File |
|------|--------------|------|
| Income tax | 0%–35% graduated | [bir/income_tax_table_2025.md](bir/income_tax_table_2025.md) |
| SSS total contribution | 15% of MSC (₱5,000–₱35,000); ER 10% / EE 5% | [sss/contribution_table_2025.md](sss/contribution_table_2025.md) |
| PhilHealth | 5% of basic salary (50/50), floor ₱10k / ceiling ₱100k | [philhealth/contribution_rate_2025.md](philhealth/contribution_rate_2025.md) |
| Pag-IBIG | 2% EE + 2% ER, MFS ₱10,000 → max ₱200 each (since Feb 2024) | [pagibig/contribution_table_2025.md](pagibig/contribution_table_2025.md) |
| 13th month tax-free ceiling | ₱90,000 combined with other benefits | [benefits/13th_month_pay.md](benefits/13th_month_pay.md) |
| NCR minimum wage (non-agri) | ₱695/day (WO NCR-26, eff Jul 2025) | [min-wage/by_region_2025.md](min-wage/by_region_2025.md) |

---

## All files

### BIR / Income Tax (`bir/`)
- [`bir/income_tax_table_2025.md`](bir/income_tax_table_2025.md) — Graduated annual and monthly tax tables, TRAIN Law 2023+ rates
- [`bir/train_law_summary.md`](bir/train_law_summary.md) — What RA 10963 (TRAIN) changed for payroll; 2018 vs 2023 tranches
- [`bir/withholding_tax_procedures.md`](bir/withholding_tax_procedures.md) — How to compute, withhold, remit, and file (1601-C, 1604-C, 2316)
- [`bir/issuances/INDEX.md`](bir/issuances/INDEX.md) — **Archive of ALL BIR issuances** (RR/RMO/RMC) with payroll-relevance tags. **2022–2026 complete = 894 issuances**, auto-maintained by the [`tools/bir-capture`](../tools/bir-capture/) job; pre-2022 (bir-archive) is a pending extension

### SSS (`sss/`)
- [`sss/contribution_table_2025.md`](sss/contribution_table_2025.md) — Full monthly contribution table by salary range; employer, employee, EC columns
- [`sss/circulars.md`](sss/circulars.md) — **Archive of all 142 SSS Circulars (2020–2026)** with payroll tags + direct PDF links (auto-captured by `tools/sss-capture`)

### PhilHealth (`philhealth/`)
- [`philhealth/contribution_rate_2025.md`](philhealth/contribution_rate_2025.md) — 2025 premium rate, computation formula, salary floor/ceiling, remittance deadline

### Pag-IBIG (`pagibig/`)
- [`pagibig/contribution_table_2025.md`](pagibig/contribution_table_2025.md) — Contribution rates by salary bracket, voluntary vs mandatory, remittance schedule

### Benefits & Compensation (`benefits/`)
- [`benefits/13th_month_pay.md`](benefits/13th_month_pay.md) — PD 851 rules: who qualifies, how to compute, December 24 deadline, ₱90k tax treatment
- [`benefits/de_minimis_benefits.md`](benefits/de_minimis_benefits.md) — BIR-listed de minimis benefits with peso ceilings (non-taxable if within limit)
- [`benefits/non_taxable_benefits.md`](benefits/non_taxable_benefits.md) — All non-taxable compensation items under TRAIN Law

### Minimum Wage (`min-wage/`)
- [`min-wage/by_region_2025.md`](min-wage/by_region_2025.md) — Daily minimum wage by RTWPB region, agricultural vs non-agricultural

### Labor Standards (`labor/`)
- [`labor/premium_pay.md`](labor/premium_pay.md) — Overtime, night-shift differential, rest day, special day & holiday pay multipliers (+ the DOLE combined-multiplier matrix)
- [`labor/leaves.md`](labor/leaves.md) — SIL, maternity (RA 11210), paternity, solo-parent, special leave for women, VAWC
- [`labor/final_pay.md`](labor/final_pay.md) — Final pay (30-day rule), Certificate of Employment, separation pay

---

## Key laws & regulations referenced

| Law / Reg | What it covers |
|-----------|---------------|
| RA 10963 (TRAIN Law) | Income tax reform — graduated table, de minimis limits, ₱90k ceiling |
| PD 851 | Mandatory 13th month pay |
| RA 11199 (SSS Reform Act) | SSS contribution rate schedule through 2025 |
| RA 11223 (Universal Health Care) | PhilHealth premium rate increase schedule |
| RA 9679 | Pag-IBIG mandatory membership and contributions |
| BIR RR 11-2018 | Updated de minimis benefit amounts under TRAIN |
| DOLE-BWC | Minimum wage orders by region |

---

_Last updated: 2026-06-24_
