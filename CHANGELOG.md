# Changelog

All notable changes to the Philippine Payroll Knowledge Base. Dates are the `last_verified` cadence, not software versions.

## 2026-06-25

- **Labor standards added** (`ph/labor/`): premium pay (overtime / holiday / night-diff / rest-day multipliers + the DOLE combined-multiplier matrix), statutory leaves (SIL, maternity, paternity, solo-parent, special leave for women, VAWC), and final pay / separation pay / Certificate of Employment — all primary-sourced (DOLE Handbook, lawphil statutes, DOLE Labor Advisory 06-2020). Adds `data/premium_pay.json` + `data/leaves.json` (drift-guarded) and a new `labor` category.
- **Machine-readable data layer** (`data/`): typed JSON for SSS (all 61 brackets), income tax (annual / monthly / semi-monthly), PhilHealth, Pag-IBIG, 13th-month, and minimum wage — **generated from and validated against the verified markdown** by `tools/build-data.mjs` (it refuses to write if any figure drifts from the source).
- **Worked net-pay examples** (`data/examples.json`): end-to-end employee deductions + net pay for ₱25k / ₱50k / ₱80k, computed from the rate files and drift-guarded.
- **LICENSE** (MIT) and **CITATION.cff** (citable dataset).
- **CI** (`.github/workflows/validate.yml`): every push re-checks that the `data/` JSON still matches the source markdown (the drift guard, automated).
- **De minimis ceilings updated to BIR RR 29-2025** (effective 6 Jan 2026): rice ₱2,500/mo, uniform ₱8,000/yr, laundry ₱400/mo, medical ₱12,000/yr, monetized VL 12 days, OT-meal 30%, gifts ₱6,000/yr, achievement/CBA ₱12,000/yr — superseding the prior RR 11-2018 figures.
- **Production packaging (v1.0.0):** installable on npm as `philippines-payroll-data` (typed JSON + schema, via `index.mjs`); **[`schemas/payroll-data.schema.json`](schemas/payroll-data.schema.json)** (JSON Schema 2020-12) now enforced by `build-data.mjs --check` and CI; first tagged release `v1.0.0`.
- **Tool-agnostic entry points**: `AGENTS.md` + `llms.txt` added alongside `CLAUDE.md`.
- **Volatility flag**: `volatility: continuously-changing` on minimum wage, with a trust-rule carve-out so an AI uses stable values directly but re-pulls the source for volatile ones.
- README opens with a Quick-answers table + a worked net-pay example; trust wording tuned across files (use-directly default for stable data).

## 2026-06-24

- Philippines complete — SSS, BIR income tax & withholding, PhilHealth, Pag-IBIG, 13th-month, de minimis and non-taxable benefits, minimum wage. All `source_tier: primary`, verified against the issuing government PDFs (rendered from scan and read directly).
- **BIR issuance archive**: 894 RR / RMO / RMC (2022–2026); **SSS circulars**: 142 (2020–2026) — each with the official PDF link, auto-maintained by `tools/bir-capture` + `tools/sss-capture`.
- `manifest.json` machine-readable file index; `SCHEMA.md` golden-source rules + per-agency monitoring sources.
