---
country: id
category: bpjs
topic: Indonesia BPJS contributions — Ketenagakerjaan (JHT, JKK, JKM, JP) and Kesehatan (health), with the 2026 JP wage cap
effective_year: 2026
effective_date_start: 2026-03-01
effective_date_end:
source: "BPJS Ketenagakerjaan — contribution rates (PP 44/2015, PP 46/2015 jo. 60/2015, PP 45/2015); JP wage cap Surat Edaran B/1226/022026 (25 Feb 2026); BPJS Kesehatan — Perpres 82/2018 as amended by Perpres 64/2020 (Pasal 30)"
source_tier: primary
last_verified: 2026-06-30
verified_from: "BPJS Ketenagakerjaan JHT/JKK/JKM/JP rates read from the official BPJS-TK site (verbatim, Bahasa). The JP wage cap Rp11,086,300 (from 1 Mar 2026) read VERBATIM from the official BPJS letter Surat Edaran B/1226/022026. BPJS Kesehatan 5% (4%+1%), Rp12,000,000 upper cap / UMK lower bound confirmed via verbatim quotes of Perpres 64/2020 Pasal 30 (the BPK primary PDF 403s to bots — recommend a browser pull for an archive-grade citation)."
tags: [bpjs, ketenagakerjaan, kesehatan, jht, jkk, jkm, jp, health, employer-share, employee-share, wage-cap, 2026]
---

## Summary
Indonesian employers run **two** mandatory social-security systems. **BPJS Ketenagakerjaan** (manpower) has four programs: **JHT** old-age **5.7%** (employer 3.7% + employee 2%, no cap); **JKK** work-accident **0.24%–1.74%** (employer-only, by risk class); **JKM** death **0.3%** (employer-only); **JP** pension **3%** (employer 2% + employee 1%) on a monthly wage cap of **Rp11,086,300** (from 1 Mar 2026). **BPJS Kesehatan** (health) is **5%** (employer 4% + employee 1%) on wages capped at **Rp12,000,000/month**. The contribution base is **monthly wage = basic salary + fixed allowance** (gaji pokok + tunjangan tetap).

> Currency: **Rp / IDR**. Administrators: **BPJS Ketenagakerjaan** and **BPJS Kesehatan**.

---

## ✅ Verification & provenance
- **Verified against the primary source:** the official **BPJS Ketenagakerjaan** rates page and the **Surat Edaran B/1226/022026** (JP cap), plus verbatim quotes of **Perpres 64/2020** Pasal 30 (BPJS Kesehatan), read on 2026-06-30 (`source_tier: primary`; Bahasa, translated).
- **Verbatim:** JHT 5.7% (3.7%+2%); JKK 0.24–1.74% employer-only; JKM 0.3% employer-only; JP 3% (2%+1%); the **JP cap Rp11,086,300 from 1 Mar 2026**; BPJS Kesehatan 5% (4%+1%), Rp12,000,000 upper cap, UMK lower bound; base = basic + fixed allowance.
- **Derived:** the max-contribution amounts (rate × cap).
- **⚠ Volatile:** the **JP wage cap rises every March** by prior-year GDP growth — Rp11,086,300 is current (from 1 Mar 2026; was Rp10,547,400). The official BPJS web page may still show the old cap; the Surat Edaran is authoritative.

---

## BPJS Ketenagakerjaan (4 programs)
| Program | Total | Employer | Employee | Wage cap | Regulation |
|---------|:-----:|:--------:|:--------:|----------|------------|
| **JHT** — old-age savings | **5.7%** | 3.7% | 2.0% | none (full wage) | PP 46/2015 jo. 60/2015 |
| **JKK** — work accident | **0.24%–1.74%** | 0.24%–1.74% | 0% | none | PP 44/2015 |
| **JKM** — death | **0.3%** | 0.3% | 0% | none | PP 44/2015 |
| **JP** — pension | **3.0%** | 2.0% | 1.0% | **Rp11,086,300/mo** (1 Mar 2026) | PP 45/2015 |

**JKK risk classes:** I 0.24% · II 0.54% · III 0.89% · IV 1.27% · V 1.74% (assigned by business risk).
**JP at the cap:** max employer Rp221,726 (2%) + max employee Rp110,863 (1%).

## BPJS Kesehatan (health)
| | Total | Employer | Employee | Cap |
|--|:-----:|:--------:|:--------:|-----|
| Health (JKN) | **5%** | 4% | 1% | **Upper Rp12,000,000/mo**; lower bound = UMK (regency/city minimum wage) |

At the upper cap: max employer **Rp480,000** + max employee **Rp120,000** (total Rp600,000). (Covers the worker + up to 5 family members.)

---

## Quick example (monthly wage Rp8,000,000)
- JHT: employer Rp296,000 (3.7%) + employee Rp160,000 (2%).
- JP: wage below the Rp11,086,300 cap → employer Rp160,000 (2%) + employee Rp80,000 (1%).
- JKM: employer Rp24,000 (0.3%). JKK: employer e.g. Rp43,200 at class II (0.54%).
- BPJS Kesehatan: employer Rp320,000 (4%) + employee Rp80,000 (1%).
- **Employee-side deductions:** JHT 2% + JP 1% + Kesehatan 1% = Rp320,000.

---

## Source & Notes
- Official sources: [BPJS Ketenagakerjaan — iuran](https://www.bpjsketenagakerjaan.go.id/penerima-upah.html) · JP cap Surat Edaran B/1226/022026 (25 Feb 2026) · [Perpres 64/2020](https://peraturan.bpk.go.id/Details/136650/perpres-no-64-tahun-2020) (BPJS Kesehatan, Pasal 30 — open in a browser; 403s to bots).
- Use directly. **Re-pull the JP cap each March** (rises with GDP growth). Confirm the JKK risk class assigned to the business.

## See Also
- [`../pajak/income_tax_2025.md`](../pajak/income_tax_2025.md) — employee JHT/JP reduce taxable income
- [`../wages/minimum_wage.md`](../wages/minimum_wage.md) — UMK is the BPJS Kesehatan lower bound
- [`../INDEX.md`](../INDEX.md) — Indonesia answer router
