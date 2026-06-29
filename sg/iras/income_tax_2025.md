---
country: sg
category: iras
topic: Singapore resident & non-resident personal income tax on employment income, plus employer obligations (IR8A/AIS, IR21)
effective_year: 2025
effective_date_start: 2023-01-01
effective_date_end:
source: "IRAS — Individual Income Tax rates (resident & non-resident) — https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates"
source_tier: primary
last_verified: 2026-06-29
verified_from: "Read the live IRAS rates page directly (rendered — the bracket tables are JavaScript accordions that a plain fetch returns empty). Resident schedule 'From YA 2024 onwards' transcribed figure-by-figure; page last-updated 27 Apr 2026. Non-resident 15%/24% and the residency rule read from the same IRAS pages."
tags: [income-tax, iras, resident, non-resident, withholding, ir8a, ais, ir21, tax-clearance, ya2024, ya2025, ya2026]
---

## Summary
Singapore taxes resident individuals on a **progressive 0%–24%** schedule (top rate **24%** on chargeable income above **$1,000,000**), unchanged "**From YA 2024 onwards**" (i.e. YA2024, YA2025, YA2026). Singapore has **no monthly PAYE withholding** for resident employees — the employer's only duty is to **report** each employee's income to IRAS (Form **IR8A** / Auto-Inclusion Scheme) by **1 March**; the employee is assessed and pays the tax directly. **Non-resident** employment income is taxed at the higher of **15%** or the resident rates; non-resident director's fees / other income at **24%**. When a foreign or PR employee leaves, the employer must file **Form IR21** (tax clearance) and withhold final monies.

> **Year of Assessment (YA) basis.** Singapore taxes on a *preceding-year* basis: **YA2026 taxes income earned 1 Jan–31 Dec 2025; YA2025 = income earned 2024; YA2024 = income earned 2023.** The bracket *structure* below is identical across YA2024/2025/2026.

> Currency: Singapore Dollar (**S$**, written `$` throughout). Tax authority: **IRAS** (Inland Revenue Authority of Singapore).

---

## ✅ Verification & provenance (read this to trust the tables)

- **Verified against the primary source:** the **IRAS Individual Income Tax rates** page, read live on 2026-06-29 (`source_tier: primary`; page last-updated 27 Apr 2026). IRAS publishes the bracket table as a JavaScript accordion — a plain `curl`/WebFetch returns only navigation chrome, so it was **rendered and read visually**.
- **Verbatim from IRAS:** the resident bracket table (bands, marginal rates, and the cumulative "Gross Tax Payable" column), the **15% / resident-whichever-higher** non-resident employment rule, the **24%** non-resident director's-fee/other-income rate, the 183-day residency tests, the **1 March** IR8A/AIS deadline, and the YA2024/YA2025 rebate figures.
- **Derived by us (checkable):** the worked example below (computed from the verbatim schedule).
- **"No monthly PAYE for residents"** is a **structural conclusion**, not a single verbatim IRAS sentence: the resident rules require the employer to *report* (IR8A/AIS), not deduct; the individual is then assessed (Notice of Assessment from end-April) and pays within one month or via interest-free GIRO instalments. Employer withholding arises only for (a) tax clearance of departing non-citizens (IR21) and (b) statutory withholding tax on payments to non-residents.

---

## Resident income tax rates — From YA 2024 onwards

Applies to YA2024, YA2025 and YA2026 (income earned 2023, 2024, 2025). The marginal rate applies to the "Next $X" sub-band; the **Gross Tax Payable** figure is the cumulative tax at exactly that income level.

| Chargeable income | Marginal rate on the band | Gross tax payable (cumulative) |
|-------------------|---------------------------|--------------------------------|
| First $20,000 | 0% | $0 |
| Next $10,000 (to $30,000) | 2% | $200 |
| Next $10,000 (to $40,000) | 3.5% | $550 |
| Next $40,000 (to $80,000) | 7% | $3,350 |
| Next $40,000 (to $120,000) | 11.5% | $7,950 |
| Next $40,000 (to $160,000) | 15% | $13,950 |
| Next $40,000 (to $200,000) | 18% | $21,150 |
| Next $40,000 (to $240,000) | 19% | $28,750 |
| Next $40,000 (to $280,000) | 19.5% | $36,550 |
| Next $40,000 (to $320,000) | 20% | $44,550 |
| Next $180,000 (to $500,000) | 22% | $84,150 |
| Next $500,000 (to $1,000,000) | 23% | $199,150 |
| In excess of $1,000,000 | **24%** | — |

**Top marginal rate: 24%**, on chargeable income above $1,000,000. (Budget 2022 restructured the schedule above $320,000: 22% to $500k, a new **23%** band $500,001–$1,000,000, and a new **24%** band above $1,000,000 — effective YA2024.)

### Reference: YA 2017 to YA 2023 (income earned 2016–2022)
Identical for the first $320,000 (same bands; cumulative tax at First $320,000 = **$44,550**), but with a single top band: **22%** on income in excess of $320,000.

---

## Personal income tax rebate (residents only)
Granted automatically (no application); offsets tax payable (no payout if tax = $0); cannot be carried forward.

| Year of Assessment | Rebate |
|--------------------|--------|
| YA2024 | 50% of tax payable, capped at **$200** |
| YA2025 | 60% of tax payable, capped at **$200** |

---

## Non-resident employment income & director's fees

| Income type | Rate (YA2024 onwards) |
|-------------|-----------------------|
| Employment income of a non-resident | **15%, or the resident progressive rates — whichever is the higher tax** |
| Director's fees / other income of a non-resident | **24%** (was 22% up to YA2023) |
| Non-resident professional (consultant/trainer/coach) | 15% of gross **or** 24% of net |
| Non-resident public entertainer | 15% (concessionary) |

---

## Who is a tax resident
You are **tax resident** for a YA if you are:
- a **Singapore Citizen or PR** who normally resides in Singapore; or
- a **foreigner** who in the relevant period stayed/worked in Singapore (i) **≥183 days** in the previous calendar year, (ii) **continuously for 3 consecutive years**, or (iii) for a continuous period **straddling two calendar years totalling ≥183 days** (the two-year administrative concession — excludes directors, public entertainers, professionals); or
- a **foreigner issued a work pass valid for ≥1 year** (treated as resident; reviewed at tax clearance when employment ceases).

Anyone not meeting the above is a **non-resident**.

---

## Employer obligations (employment income)

**No monthly income-tax withholding for residents.** Employers report; employees are assessed and pay directly. The employer duties are:

1. **Form IR8A + appendices / Auto-Inclusion Scheme (AIS)** — under **s.68(2) Income Tax Act**, prepare an IR8A for **every** employee (full-time, part-time, resident, non-resident, director) by **1 March** of the year after the income year. Under **AIS**, the employer submits the income records **electronically to IRAS** (auto-included in the employee's return) — **deadline 1 March**; late submission can be fined up to **$5,000**. AIS is **mandatory** for employers with **5 or more employees** (or those notified by IRAS / already registered). *(Form IR8S is phased out from YA2026.)*
2. **Form IR21 — tax clearance** for a departing **non-citizen** employee (foreigner or PR ceasing employment, on overseas posting, or leaving Singapore > 3 months): **notify IRAS at least one month in advance** and **withhold all monies due** to the employee until clearance. Applies to all work-pass holders.
3. **Withholding tax** applies only to certain payments to **non-residents** (e.g. non-resident director's fees 24%) — not to ordinary resident salary.

> CPF contributions are deducted from pay, but CPF is a **social-security contribution (CPF Board)**, not income-tax withholding — see [`../cpf/contribution_rates_2025.md`](../cpf/contribution_rates_2025.md).

---

## Quick example (resident, YA2026)
Chargeable income $80,000 (after reliefs):
- Gross tax payable at "First $80,000" = **$3,350** (verbatim from the schedule).
- Less YA2025 rebate did not apply to YA2026 at time of writing; check the current YA's rebate.

Chargeable income $120,000:
= $7,950 (cumulative at First $120,000) — i.e. $3,350 + 11.5% × $40,000.

---

## Source & Notes
- Official source: [IRAS — Individual Income Tax rates](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates) (last updated 27 Apr 2026).
- Residency: [IRAS — Working out my tax residency](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/working-out-my-tax-residency).
- AIS / IR8A: [IRAS — Auto-Inclusion Scheme](https://www.iras.gov.sg/taxes/individual-income-tax/employers/auto-inclusion-scheme-(ais)-for-employment-income).
- Tax clearance: [IRAS — Tax clearance for foreign & SPR employees (IR21)](https://www.iras.gov.sg/taxes/individual-income-tax/employers/tax-clearance-for-foreign-spr-employees-(ir21)).
- Use directly for the rate schedule and employer duties; the figures are verbatim from IRAS and stable across YA2024–YA2026. Re-confirm only the **current YA's rebate** (announced per Budget) and any post-2026 Budget rate change.

## See Also
- [`../cpf/contribution_rates_2025.md`](../cpf/contribution_rates_2025.md) — CPF & SDL deducted from pay (CPF is SC/PR only)
- [`../employment-act/leave.md`](../employment-act/leave.md) — paid leave entitlements
- [`../wages/wage_floors.md`](../wages/wage_floors.md) — no minimum wage; LQS / Progressive Wage Model
- [`../INDEX.md`](../INDEX.md) — Singapore answer router
