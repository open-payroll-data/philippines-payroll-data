---
country: id
category: labour
topic: Indonesia working hours and overtime pay (PP 35/2021 / UU Cipta Kerja)
effective_year: 2025
effective_date_start: 2021-02-02
effective_date_end:
source: "Government Regulation PP No. 35/2021 (implementing UU Cipta Kerja), Pasal 21 (hours), Pasal 26 (overtime limit), Pasal 31–32 (overtime pay) — Ministry of Manpower JDIH — https://jdih.kemnaker.go.id/asset/data_puu/PP352021.pdf"
source_tier: primary
last_verified: 2026-06-30
verified_from: "Extracted the text layer of the official Kemnaker JDIH PP 35/2021 PDF directly (PyMuPDF). Pasal 21 (40-hour week), Pasal 31 (1.5×/2× normal-day OT + rest-day/holiday scale), and Pasal 32 (1/173 hourly divisor) quoted verbatim from the regulation."
tags: [labour, working-hours, overtime, pp-35-2021, cipta-kerja, 1-173, kemnaker, indonesia]
---

## Summary
Under **PP 35/2021** (implementing the UU Cipta Kerja), normal working time is **40 hours/week**, as either **7 hours/day × 6 days** or **8 hours/day × 5 days**. **Overtime** on a normal working day is **1.5×** the hourly wage for the first hour and **2×** for each subsequent hour, where the **hourly wage = 1/173 of the monthly wage**. Overtime is capped at **4 hours/day and 18 hours/week**. Higher multipliers apply on rest days and public holidays.

> Currency: **Rp / IDR**. Statute: UU 13/2003 as amended by UU Cipta Kerja; implementing regulation **PP 35/2021**.

---

## ✅ Verification & provenance
- **Verified against the primary source:** the official **Kemnaker JDIH PP 35/2021** PDF (text layer), read on 2026-06-30 (`source_tier: primary`).
- **Verbatim from PP 35/2021:** Pasal 21 (40-hour week, 7×6 or 8×5); Pasal 31 (OT 1.5× first hour / 2× subsequent; rest-day/holiday scale); Pasal 32 (hourly wage = 1/173 × monthly wage). The 4h/day–18h/week cap is Pasal 26.

---

## Working hours (Pasal 21)
**40 hours/week**, as either:
- **7 hours/day × 6 days/week**, or
- **8 hours/day × 5 days/week**.

## Overtime (Pasal 26, 31, 32)
- **Limit:** max **4 hours/day** and **18 hours/week** (excluding weekly rest days and public holidays).
- **Hourly wage = 1/173 × monthly wage** (Pasal 32). The wage base is 100% of the monthly wage (or 75% of total wage where fixed allowances are large).

**Normal working day (Pasal 31(1)):**
| Hour | Rate |
|------|------|
| 1st overtime hour | **1.5×** hourly wage |
| each subsequent hour | **2×** hourly wage |

**Weekly rest day / public holiday (Pasal 31(2)–(3)) — 5-day week:**
| Hours | Rate |
|-------|------|
| 1st–8th | 2× hourly |
| 9th | 3× hourly |
| 10th–12th | 4× hourly |

*(6-day week: hours 1–7 = 2×, hour 8 = 3×, hours 9–11 = 4×.)*

---

## Quick example (monthly wage Rp8,000,000, 3 OT hours on a normal day)
- Hourly wage = Rp8,000,000 ÷ 173 = **Rp46,243**.
- OT pay = (1.5 × 46,243) + (2 × 46,243) + (2 × 46,243) = Rp69,365 + Rp92,486 + Rp92,486 = **Rp254,337**.

---

## Source & Notes
- Official source: [PP 35/2021 — Kemnaker JDIH](https://jdih.kemnaker.go.id/asset/data_puu/PP352021.pdf) (Pasal 21, 26, 31, 32).
- Use directly; multipliers and the 1/173 divisor are verbatim from the regulation.

## See Also
- [`leave_and_thr.md`](leave_and_thr.md) — annual leave, THR, maternity
- [`severance.md`](severance.md) — severance & long-service pay
- [`../wages/minimum_wage.md`](../wages/minimum_wage.md) — UMP/UMK minimum wage
- [`../INDEX.md`](../INDEX.md) — Indonesia answer router
