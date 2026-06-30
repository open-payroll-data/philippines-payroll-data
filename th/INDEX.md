# Thailand Payroll — Index

> Country: Thailand | Currency: Thai Baht (฿ / THB) | Tax authority: Revenue Department | Social security: SSO | Labour: Ministry of Labour
> AI: This index lists every file in `th/`. For the full master index go to `../INDEX.md`.

---

## 🔎 Answer router — AI starts here

Match the question to a row, open that one file. Don't scan the repo.

| If you need… | Open |
|--------------|------|
| **Income tax** rates (0%–35%), allowances, **monthly withholding (PND.1)**, residency | [revenue/income_tax_2025.md](revenue/income_tax_2025.md) |
| **Social Security Fund (SSF)** rate & ceiling, + **Workmen's Compensation** | [sso/social_security.md](sso/social_security.md) |
| **Overtime, working hours, holiday pay** multipliers | [labour/working_hours_overtime.md](labour/working_hours_overtime.md) |
| **Annual / sick leave, public holidays, maternity (120 days)** | [labour/leave.md](labour/leave.md) |
| **Severance pay** by length of service | [labour/severance.md](labour/severance.md) |
| **Minimum wage** (daily, by province) | [wages/minimum_wage.md](wages/minimum_wage.md) |
| **Exact numbers for software** (typed JSON, generated from + validated against these files) | [`../data/th_income_tax_2025.json`](../data/th_income_tax_2025.json) · [`../data/th_social_security_2025.json`](../data/th_social_security_2025.json) |
| **When/where** gov't rates change (monitoring sources) | [../SCHEMA.md](../SCHEMA.md) → Golden sources |

> Every target file opens with frontmatter (rates, effective dates, source, `last_verified`) and a `## Summary`. Read those two first.

---

## Quick reference — current rates

| Item | Rate / Amount | File |
|------|--------------|------|
| Income tax | 0%–35% graduated; top 35% above ฿5,000,000 | [revenue/income_tax_2025.md](revenue/income_tax_2025.md) |
| Monthly withholding | Mandatory (PND.1, within 7 days of month-end) | [revenue/income_tax_2025.md](revenue/income_tax_2025.md) |
| Social Security (SSF) | 5% employee + 5% employer; **ceiling ฿17,500 → max ฿875/side (from 1 Jan 2026)** | [sso/social_security.md](sso/social_security.md) |
| Workmen's Compensation (WCF) | Employer-only 0.2%–1.0%; cap ฿240,000/yr | [sso/social_security.md](sso/social_security.md) |
| Overtime | 1.5× normal / 2× holiday work / 3× holiday OT | [labour/working_hours_overtime.md](labour/working_hours_overtime.md) |
| Annual leave | ≥ 6 days/year after 1 year | [labour/leave.md](labour/leave.md) |
| Maternity leave | **120 days** (from 7 Dec 2025); employer pays up to 60 | [labour/leave.md](labour/leave.md) |
| Severance | 30 → 400 days' wages by tenure | [labour/severance.md](labour/severance.md) |
| Minimum wage | ฿337–฿400/day by province (Bangkok ฿400; from 1 Jul 2025) | [wages/minimum_wage.md](wages/minimum_wage.md) |

---

## All files

### Revenue Department / Income Tax (`revenue/`)
- [`revenue/income_tax_2025.md`](revenue/income_tax_2025.md) — PIT 0%–35%, allowances, monthly withholding PND.1, Form 50 Bis, residency

### Social Security (`sso/`)
- [`sso/social_security.md`](sso/social_security.md) — SSF (5%/5%, ฿17,500 ceiling from 2026) + Workmen's Compensation Fund

### Labour standards (`labour/`)
- [`labour/working_hours_overtime.md`](labour/working_hours_overtime.md) — Hours (8/48), overtime & holiday multipliers (1.5× / 2× / 3×)
- [`labour/leave.md`](labour/leave.md) — Annual, sick, public holidays, maternity (120 days from Dec 2025), paternity, childcare
- [`labour/severance.md`](labour/severance.md) — Severance pay 30→400 days by tenure

### Wages (`wages/`)
- [`wages/minimum_wage.md`](wages/minimum_wage.md) — Provincial daily minimum wage ฿337–฿400 (Notification No. 14, from 1 Jul 2025; Bangkok ฿400)

---

## Key authorities & instruments

| Authority / Instrument | Covers |
|------------------------|--------|
| Revenue Department (Revenue Code) | Personal income tax, monthly withholding (PND.1), Form 50 Bis |
| Social Security Office (Social Security Act) | SSF contributions + Workmen's Compensation Fund |
| Ministry of Labour (Labour Protection Act B.E. 2541, amended 2019/2025) | Hours, overtime, leave, severance |
| Wage Committee (Minimum Wage Notification) | Provincial daily minimum wage |

---

_Last updated: 2026-06-29_
