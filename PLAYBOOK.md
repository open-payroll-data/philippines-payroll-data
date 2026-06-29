# Country Payroll KB — Build Playbook

> How to add a new country (SG, US, …) using the process proven on the Philippines.
> Country-agnostic. Pair with `SCHEMA.md` (conventions + golden-source index) and the `ph/` folder (the worked reference implementation). Last updated **2026-06-25**.

## The goal (identical for every country)

An AI answers **any** payroll question for the country in **1–2 hops**, from primary-sourced, self-verifying markdown — without scraping government sites or OCR-ing scanned PDFs. Markdown is the **source of truth + reasoning layer**; the `data/` JSON is the **parse layer** for software (generated from the markdown and validated against it, never hand-kept in parallel).

---

## The 7-step process

### Step 0 — Decompose the country's payroll into components
Every country's payroll reduces to the same buckets. List each + its governing agency + primary issuance channel:

| Component | PH (agency) | adapt for other countries |
|---|---|---|
| Income tax + withholding on compensation | BIR | US: IRS / federal + state; SG: IRAS |
| Social security / pension | SSS | US: SSA (FICA); SG: CPF |
| Health insurance | PhilHealth | US: n/a (employer plans); SG: MediSave (within CPF) |
| Housing / provident fund | Pag-IBIG | SG: CPF; US: n/a |
| Mandated benefits (13th-month, leave, premium/holiday/OT pay, final pay) | DOLE / Labor Code | US: FLSA; SG: Employment Act |
| Minimum wage | NWPC / regional boards | US: federal + state; SG: none (sectoral) |

### Step 1 — Build the golden-source index FIRST
For each component, find the agency's **primary issuance channel** (official circular/regulation page) — never a summary site. Record them in `SCHEMA.md`'s golden-source table. This is the spine; everything cites these.

### Step 2 — Capture the curated rate/rule files (verified)
One `{cc}/{category}/{topic}.md` per component, transcribed from the primary source:
- **Frontmatter:** `country, category, topic, effective_year, source, source_tier, last_verified, verified_from, tags`.
- **A `✅ Provenance` / `Verification & provenance` block:** state which figures are **verbatim-from-source** vs **derived-by-us** (arithmetic / worked examples).
- **Scanned PDFs:** render with PyMuPDF (`pip install --user pymupdf`, `page.get_pixmap()`) and **read visually**. Never trust text-extraction on a scan — it has fabricated a wrong tax table.
- **Two honest confidence levels:** `verified_from: "read … directly"` (PDF-checked) vs `"summarized … not re-read this pass"` (accurate summary — confirm source for high-stakes edge cases).

### Step 3 — Build the issuance archive(s)
For agencies that publish a stream of circulars/regulations, mirror the catalog:
- **Detect the site type:** `curl` the listing page. Empty `Loading…` shell → JS app → **browser-render (Playwright headless)**. Real HTML rows → **fetch + parse** (no browser).
- **Write a capture tool** (`tools/{agency}-capture/`) that: lists every issuance (number, date, subject); captures the **real PDF `href`** (never guess filenames — they vary: `_redacted`, `Digest`, `External`, suffixes); tags payroll-relevance (`Y`/`~`/blank, heuristic); writes `{cc}/{agency}/…md` + a JSON; and reports **"new since last run"** via a `state.json`.
- **Walled source?** Use a sibling agency's re-issuance, a government CDN, or query "issuance-number + pdf".

### Step 4 — Navigation
- `{cc}/INDEX.md` with an **answer router** at the top (question → exact file). This single artifact is the highest-leverage thing in the whole repo — the lazy-AI fast path.
- Register the country in the master `INDEX.md`, `README.md` coverage table, `CLAUDE.md`, and `AGENTS.md`/`llms.txt`.

### Step 5 — Machine-readable layer
- Capture tools emit **per-archive JSON** (one record per issuance).
- Add the curated rate tables to `data/{cc}_*.json` via `tools/build-data.mjs` — **generated from the markdown and validated against its anchors** (refuse to write on drift; markdown stays source-of-truth).
- Rebuild `manifest.json` (`node tools/build-manifest.mjs`).

### Step 6 — Verify & harden
- **Link-health:** sample captured PDF URLs → confirm HTTP 200.
- **AI test:** spawn fresh agents (ideally several models — Opus/Sonnet/Haiku — starting from `AGENTS.md` so it's tool-agnostic) with real questions; confirm 1–2-hop retrieval, correct figures, **no hallucination** (cites only real archived issuances).
- **Privacy scan** before any push: emails / phones / secrets / local paths (`/Users/<name>/…`). `.gitignore` `node_modules/`, `state.json`, logs.

### Step 7 — Monitoring
- Record each agency's change cadence in `SCHEMA.md` (most contributions change at year-start; minimum wage is continuous).
- The capture tools' "new since last run" + a year-start checkpoint **is** the listener.

---

## Reusable technical tactics (the hard-won bits)
- **Site-type test:** plain fetch shows `Loading…`/no rows → the data is client-rendered → use a headless browser and read the rendered DOM/`innerText`. (A JS app's data may not appear in `curl` *or* reliably in the browser network log — render and read the page.)
- **Structured table extraction beats text-parsing:** read table cells + anchor `href`s directly (`$$eval('table tr')`) — more accurate and it captures the real links. On PH it caught +43 rows a text parser missed.
- **Render-from-scan** is mandatory for image-only gov PDFs; auto-extraction silently corrupts tables.
- **Capture real hrefs**, never reconstruct filenames.
- **URL quirks happen** (e.g., singular vs plural slugs per year) — discover links from the index, don't hardcode.

## Conventions checklist (every file)
- [ ] Full frontmatter incl. `source_tier` + `verified_from`
- [ ] `✅ Provenance` block: verbatim-from-source vs derived-by-us
- [ ] Payroll tags `Y`/`~`/blank, marked heuristic
- [ ] Cites the **primary** issuance + direct PDF link; honest caveats where unverified

## Per-country instantiation checklist
- [ ] Components + agencies + primary channels listed (Step 0–1)
- [ ] One verified curated file per component, with provenance (Step 2)
- [ ] Issuance archive + capture tool + JSON per streaming agency (Step 3)
- [ ] `{cc}/INDEX.md` answer router; registered in all entry docs (Step 4)
- [ ] `data/{cc}_*.json` generated+validated; manifest rebuilt (Step 5)
- [ ] Link-health + multi-model AI test + privacy scan (Step 6)
- [ ] Monitoring cadence in SCHEMA (Step 7)

## Pitfalls (learned on PH — don't repeat)
1. **Summary sites carried wrong figures** (min MSC ₱5,000 not ₱4,000; a non-existent "16% in 2027" step) that reading the primary caught. Golden source only.
2. **Text-extraction on scans fabricates data.** Render + read visually.
3. **Don't guess PDF filenames.** Capture the real `href`.
4. **Catalog ≠ full text.** The archive links to PDFs; deep-ingest only the payroll-relevant subset.
5. **Trust is earned with embedded evidence** (provenance + verbatim anchors + honest caveats), not asserted — a careful AI rightly discounts a bare "100% accurate" claim.
6. **One source of truth.** Markdown is canonical; generate JSON from it and validate — never hand-maintain both.
7. **Disclose limits.** Heuristic tags, corroborated-not-original sources, stale dates — say so; the absence of a caveat must mean "verified".

## Worked example
The entire `ph/` folder + `tools/` is the reference build. Copy its shape for `sg/`, `us/`, etc. Read `HANDOFF.md` for the current PH state and `SCHEMA.md` for the exact conventions.
