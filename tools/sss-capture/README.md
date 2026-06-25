# SSS Capture — circulars archive updater

Fetches the SSS circulars page and writes the archive at
[`ph/sss/circulars.md`](../../ph/sss/circulars.md) — every SSS Circular (2020–2026)
with a payroll-relevance tag and a direct link to its official PDF.

Unlike the BIR site, the SSS circulars page is **server-rendered** (plain HTML),
so this is a simple fetch + parse — **no headless browser needed**.

## Run

```bash
cd tools/sss-capture   # run from the repository root
node capture.mjs
```

No dependencies, no install. It prints a per-year count and the number of
payroll-flagged (contribution-schedule) circulars, then rewrites `ph/sss/circulars.md`.

## What it captures
- Source: <https://www.sss.gov.ph/sss-circulars/>
- Each row: circular number, title, `Payroll?` tag (**Y** = contribution schedule / employer obligation), and the official SSS PDF link.
- Handles the quirks: amendment circulars with letter suffixes (e.g. `2020-004-b`) and older circulars listed with **no PDF**.

## Notes
- `parse.mjs` logic lives inline in `capture.mjs` (small enough). Re-run anytime to refresh.
- The page covers 2020–2026; pre-2020 circulars are not listed there.
- For scheduling, add a daily `node capture.mjs` the same way as `tools/bir-capture` (see its README for a `launchd` example).
