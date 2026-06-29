---
country: ph
category: bir
topic: How to compute, withhold, remit, and file monthly/annual withholding tax on compensation
effective_year: 2025
effective_date_start: 2023-01-01
effective_date_end:
source: "BIR Revenue Regulations No. 2-98 as amended; RMC 1-2023; BIR.gov.ph"
source_tier: primary
last_verified: 2026-06-29
verified_from: "Procedural guide compiled from BIR withholding regulations (RR 2-98 as amended) and the form/deadline framework (1601-C, 1604-C, 2316). A process summary, not a single-document transcription. The tax tables it applies are verified in income_tax_table_2025.md (vs RR 8-2018). The standing forms and the 10th-of-month / Jan-31 deadlines below are reliable for ordinary use — use them directly. Only when a BIR issuance has moved a specific period's deadline (e.g. a filing-extension RMC) consult the in-repo BIR issuances archive at issuances/ — that catalog carries any such circular with its official PDF, so the open web is not needed."
tags: [withholding, bir, 1601-c, 1604-c, 2316, annualization, remittance, deadline, 2025]
---

## Summary
Employers are required to withhold income tax from employees' compensation each payroll period, remit monthly using BIR Form 1601-C, file an annual alphalist (1604-C) with individual certificates (2316), and handle the January annualization adjustment.

## ✅ Provenance
- **Source tier:** primary — cites BIR RR 2-98 (Withholding Tax Regulations, as amended) and the BIR form framework.
- **Verified:** the income-tax tables applied in the computations here are verified in [`income_tax_table_2025.md`](income_tax_table_2025.md) (vs RR 8-2018).
- **Confidence:** high for the process and forms; this is a compiled procedural guide, not a single transcribed document. **Use the deadlines below directly for ordinary filing.** They move only when a specific BIR issuance grants an extension for a given period — and those circulars are catalogued in [`issuances/INDEX.md`](issuances/INDEX.md) with their official PDFs (search that in-repo archive, not the open web).

---

## Step-by-step: Monthly withholding computation

### Step 1 — Compute gross compensation
Gross compensation = basic pay + overtime + holiday pay + allowances + commissions + all cash payments from employment.

### Step 2 — Subtract non-taxable items
- Mandatory contributions: SSS employee share + PhilHealth employee share + Pag-IBIG employee share
- De minimis benefits (within BIR ceilings only — excess is taxable)
- First ₱90,000 of 13th month and other bonuses (total combined for the year)

### Step 3 — Get monthly taxable income
= Gross compensation − Step 2 deductions

### Step 4 — Apply the monthly withholding tax table
Use the monthly table in [`income_tax_table_2025.md`](income_tax_table_2025.md).

### Step 5 — Withhold that amount each pay period
If semi-monthly pay, use the semi-monthly table and withhold each pay run.
Accumulated each month → this is the amount to remit.

---

## Annualization (January adjustment)

At year-end (or when an employee leaves), the employer must:
1. Annualize all taxable compensation earned during the year
2. Apply the annual tax table to get the full-year tax due
3. Compare against total monthly tax withheld
4. Collect any shortfall or refund any excess in the January payroll

This is called the **annualization method**. It corrects for months where bonuses, mid-year adjustments, or de minimis excess shifted the true annual tax.

**BIR Form 2316** (Certificate of Compensation Payment/Tax Withheld) must be issued to each employee by January 31 of the following year.

---

## Remittance schedule

| Employer type | Form | Filing deadline |
|--------------|------|-----------------|
| Large taxpayer | BIR Form 1601-C | Within 10 days after month end |
| Non-large taxpayer (eFPS) | BIR Form 1601-C | Staggered e-filing by industry group (Group A 15th, B 14th, C 13th, D 12th, E 11th of following month); e-payment on or before the 15th |
| Non-eFPS | BIR Form 1601-C | On or before 10th day of following month |

Payment is made at Authorized Agent Banks (AABs) or via eBIRForms / eFPS online.

---

## Annual compliance filings

| Form | Purpose | Deadline |
|------|---------|----------|
| BIR Form 1604-C | Annual Information Return of Income Taxes Withheld on Compensation | January 31 of following year |
| BIR Form 2316 | Certificate of Compensation — given to each employee | January 31 of following year |
| Alphalist | Annex to 1604-C listing each employee's income and tax | Filed with 1604-C |

Employees who are **purely compensation earners** with one employer and whose tax was correctly withheld are **not required to file an ITR** — their 2316 serves as the substitute return. (Under TRAIN, the test is purely-compensation / one-employer / correctly-withheld / no other income; there is no income-amount threshold.)

---

## Substitute filing rule
Employees who qualify for **substituted filing** (purely compensation income, one employer, no other income, tax correctly withheld):
- Do NOT need to file BIR Form 1700 (Individual ITR)
- Their BIR Form 2316, duly stamped by BIR, IS their tax return
- Employer files the 2316 on their behalf via the 1604-C alphalist

---

## Common mistakes to avoid

1. Forgetting to add excess de minimis into taxable income (only the first ₱X is exempt, excess IS taxable)
2. Annualization only done at year-end — should also be done when employee resigns mid-year
3. Not issuing 2316 to resigned employees on the day their final compensation is paid (BIR requires the 2316 upon last payment of wages — this is separate from, and earlier than, the DOLE 30-day final-pay release window)
4. Using old 2018–2022 tax tables after 2022 (the 2023 table has lower rates — underwithheld)

---

## Source & Notes
- BIR Revenue Regulations No. 2-98 (Withholding Tax Regulations) as amended
- RMC 1-2023 (implementing 2023 tax table)
- Last verified: 2026-06-24
- BIR eFPS: [efps.bir.gov.ph](https://efps.bir.gov.ph)
- eBIRForms: [bir.gov.ph/ebirforms](https://bir.gov.ph)

## See Also
- [`income_tax_table_2025.md`](income_tax_table_2025.md) — Tax tables (annual, monthly, semi-monthly)
- [`../benefits/13th_month_pay.md`](../benefits/13th_month_pay.md) — ₱90,000 bonus exemption and how it affects annualization
- [`../benefits/de_minimis_benefits.md`](../benefits/de_minimis_benefits.md) — What's non-taxable and what's excess
