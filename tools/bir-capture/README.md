# BIR Capture — automated archive updater

This job visits the BIR website and saves **every** Revenue Regulation (RR),
Revenue Memorandum Order (RMO), and Revenue Memorandum Circular (RMC) into the
archive at `ph/bir/issuances/`. It skips RAO and RDAO. Each run also tells you
which circulars are **new** since the last run.

It uses a real (headless) browser because the BIR site builds its lists with
JavaScript — a plain download just sees a "Loading…" page.

---

## One-time setup (do this once)

You already have Node.js installed. In the Terminal:

```bash
cd tools/bir-capture   # run from the repository root
npm install
npx playwright install chromium
```

- `npm install` downloads the browser-automation library.
- `npx playwright install chromium` downloads the headless browser it drives (~150 MB, one time).

---

## Run it

```bash
cd tools/bir-capture   # run from the repository root
node capture.mjs
```

That captures all types, all years. To narrow it down:

```bash
node capture.mjs --type=rr            # only Revenue Regulations
node capture.mjs --year=2024          # only 2024
node capture.mjs --type=rmc --year=2025
```

**What it does:**
- Writes/updates files like `ph/bir/issuances/rmc/2026.md` (one per type per year).
- Prints a line per page, e.g. `[ok] RMC 2026: 71 rows, 5 payroll-flagged`.
- At the end, lists any **NEW** issuances found since your last run.

**Check the parser anytime** (no browser needed):
```bash
node parse.mjs        # runs the built-in self-test; every line should say PASS
```

---

## Reading the output

Each archive file has a `Payroll?` column:
- **Y** — payroll / compensation-tax relevant (withholding, alphalist, 13th month, de minimis, etc.)
- **~** — tax-filing adjacent (annual income tax returns, eAFS)
- blank — not payroll (captured for completeness)

> The tags are a **keyword guess** to help you triage — always glance at a
> flagged row before relying on it. Nothing is dropped; everything is archived.

---

## Keep it updated automatically (optional)

To run it every day at 7am, create a scheduled job with `launchd` (macOS):

1. Save this as `~/Library/LaunchAgents/com.payrollkb.bircapture.plist` — replace
   `/ABSOLUTE/PATH/TO/payroll-data` with your real repo path (run `pwd` in the repo to get it),
   and the node path if `which node` shows a different one:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0"><dict>
     <key>Label</key><string>com.payrollkb.bircapture</string>
     <key>ProgramArguments</key>
     <array>
       <string>/usr/local/bin/node</string>
       <string>/ABSOLUTE/PATH/TO/payroll-data/tools/bir-capture/capture.mjs</string>
     </array>
     <key>StartCalendarInterval</key><dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>0</integer></dict>
     <key>StandardOutPath</key><string>/ABSOLUTE/PATH/TO/payroll-data/tools/bir-capture/last-run.log</string>
     <key>StandardErrorPath</key><string>/ABSOLUTE/PATH/TO/payroll-data/tools/bir-capture/last-run.log</string>
   </dict></plist>
   ```

2. Load it: `launchctl load ~/Library/LaunchAgents/com.payrollkb.bircapture.plist`

The newest run's output (including any NEW issuances) lands in `last-run.log`.

---

## Files
- `capture.mjs` — the job (browser + writing).
- `parse.mjs` — the parser + payroll tagging + markdown rendering (testable on its own).
- `state.json` — remembers what it has seen, so it can report new issuances (auto-created).

## Later: cloud version
This same logic ports to a **Cloudflare Worker with Browser Rendering** on a cron
trigger (fits the existing CF stack), writing to R2 or committing to the repo via
the GitHub API — for fully hands-off updates. Ask when ready.
