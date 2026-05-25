# Phase 6C-62 — 2026 Calendar Seed Matrix from Backlog, PDFs and Signals

**Date:** 2026-05-25
**Phase:** 6C-62
**Scope:** Audit-only — no DB writes, no imports, no code changes, no deploy

---

## What Was Done

Read and synthesized all primary source files to build a comprehensive 2026 calendar seed matrix and first-import batch recommendation:

**Source files read:**
- `FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` — 132 items across 15 categories
- `CALENDAR_SEED_ITEM_POLICY.md` — 12-part policy on what can be public vs internal
- `CALENDAR_CONNECTION_MODEL.md` — Calendar item anatomy, 22 fields, 13 types
- `SOURCE_RESEARCH_QUEUE.md` — T1–T4 source tiers, Phase 6C-22 through 6C-40 captures
- `NEWS_SIGNAL_RADAR_MODEL.md` — NSR framework, active signals
- `CONTENT_PRODUCTION_PRIORITY_QUEUE.md` — P0–P5 groups, VIRAL-01, e-invoicing status
- `source-ledgers/uae-e-invoicing-2026-sources.md` — Full ASP deadline verification
- `source-ledgers/uae-corporate-tax-deadline-sources.md` — Nine-month rule sources

**Files created:**
1. `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` — Full matrix for all 2026 calendar candidates
2. `docs/content-drafts/calendar/phase-6c62-first-import-batch-recommendation.md` — Ranked first-import batch
3. `docs/content-drafts/PHASE_6C62_SUMMARY.md` — This file

---

## What Was Not Touched

- DB: not touched
- Admin: not touched
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Code: not touched
- No imports, no deployments, no commits (pending owner approval)

---

## Key Findings

### 1. P0 Noindex Blocker — WAS STALE (Corrected in Phase 6C-62B)

Phase 6C-62 stated a P0 noindex blocker across all routes. **This was incorrect.** Live production check (2026-05-25) confirmed all individual content pages are `index, follow`:

- `/news/uae-eid-al-adha-2026-federal-holiday-long-break` — index, follow ✓
- `/events/uae-eid-al-adha-2026` — index, follow ✓
- `/calendar/may-2026-uae-calendar` — index, follow ✓
- `/news/uae-emiratisation-june-30-2026-deadline` — index, follow ✓
- `/calendar/uae-emiratisation-june-30-2026-reminder` — index, follow ✓
- `/calendar/uae-long-weekends-2026-2027` — index, follow ✓
- `/calendar` — noindex, follow (product decision — not a blocker)
- `/ru/calendar` — noindex, follow (product decision — not a blocker)

The noindex on the `/calendar` listing page is a separate product decision and does not block content indexing on detail pages.

### 2. Four Item Groups Are Already Live — Not One

Phase 6C-62 described HOL-01 as the only live item. The actual production state has four live groups:

- **HOL-01 Eid Al Adha package:** news + event + calendar — LIVE, index, follow
- **TAX-01A Emiratisation June 30:** news + calendar — LIVE, index, follow
- **VIRAL-01 Long Weekends 2026-27:** calendar yearly reference — LIVE, index, follow
- **May 2026 calendar:** monthly calendar — LIVE, index, follow

### 3. HOL-04 / HOL-05 — Duplicate Risk, Not Import-Ready

Phase 6C-62 recommended HOL-04 (Commemoration Day) and HOL-05 (National Day) as Tier A imports with no blockers. **This was incorrect.**

Both dates are already represented in the live Long Weekends datesJson with `detail_url` pointing to `/calendar/uae-long-weekends-2026-2027`. Importing standalone calendar_pages would create duplicate agenda entries. The correct path is a coordinated December 2026 monthly calendar page decision (owner decision required).

**Phase 6C-63 note:** Phase 6C-62B incorrectly claimed the Long Weekends datesJson had a "data error" (Dec 1 should be Nov 30). This was retracted in Phase 6C-63. Dec 1 is the correct holiday/day-off date per Cabinet Resolution 27/2024 as reviewed in Phase 6C-46. Nov 30 is the observance date — a different thing. No date correction needed. Phase 6C-50 DB write should soften labels and fix `--` style only.

### 4. One Compliance Item Is Owner-Review-Ready

- **TAX-05C** — E-invoicing ASP deadline Oct 30: official MoF permalink captured (Phase 6C-23), draft exists. Requires URL recheck before import. Import as paired package with TAX-05A (Jul 1 pilot start).
- **TAX-01A** — Already live. Do not reimport.

### 6. Six Items Require Source Capture Before Import

| ID | Item | Source to capture |
|---|---|---|
| DXB-02 | GITEX 2026 | gitex.com — 2026 exact dates |
| AUH-01 | F1 Abu Dhabi 2026 | formula1.com — 2026 race weekend |
| TAX-02 | Corporate Tax Sept 30 | Guide draft + penalty source needed |
| HOL-02 | Islamic New Year | FAHR announcement ~July 1 |
| HOL-03 | Mawlid | FAHR announcement ~Sept 1 |
| DXB-01 | Cityscape Dubai | organizer site — dates TBC |

### 7. Islamic Dates Remain on HOLD

HOL-02 (Islamic New Year, ~Jul 17) and HOL-03 (Mawlid, ~Sep 14) must not be published with approximate dates. Official FAHR or WAM announcement required. Monitor from ~2 weeks before each expected date.

### 8. 20 Items Are Internal-Only

TAX-03 (VAT quarterly), TAX-06 (ESR), TAX-07 (UBO), TAX-08 (trade license), PROP-01/02 (rent/Ejari), DLS-07/08 (visa/ID renewal), PET-04, and HOL-10 are not appropriate for the public calendar as standalone items. They feed Life Setup modules, the Business Compliance Calendar (not yet built), and internal planning only.

---

## Final Q&A

**How many 2026 calendar candidates were identified?**
44 items with "calendar" in their type across all categories. Of these: 4 groups already live, 2 have duplicate risk (HOL-04/HOL-05), 1 owner-review-ready (TAX-05C/A package), 6 source-needed, 5 intentional holds, 20+ internal-only or 2027+ scope.

**What is the corrected first import batch?**
After removing already-live items and flagging duplicates:
- **Immediate owner decision needed:** HOL-04/HOL-05 path (December 2026 monthly page vs Long Weekends-only)
- **Owner review → import:** TAX-05C + TAX-05A e-invoicing package (recheck MoF URL first)
- **Source sprint (July–August 2026):** GITEX dates, F1 Abu Dhabi dates, Corporate Tax guide

**What is blocked that should not be?**
TAX-05C/A are blocked only by owner approval — source and draft work is done. Everything else has a legitimate technical or source blocker.

**What should be prioritized in the next source sprint?**
1. Capture GITEX 2026 dates from gitex.com (July 2026)
2. Capture F1 Abu Dhabi 2026 dates from formula1.com (August 2026)
3. Build Corporate Tax FY2025 guide (target: import-ready by August 1, 2026)
4. Phase 6C-50 DB write: fix Long Weekends copy drift + soften Commemoration Day label (no date change)

**Was the P0 noindex blocker real?**
No — it was stale. All detail pages are `index, follow`. The `/calendar` index page is `noindex, follow` as a product decision. No code change needed to enable content indexing.

**Are there any content claims that are NOT safe to make?**
- Do not state a specific June 30 deadline for the 20–49 employee Emiratisation band (no 2026-specific source)
- Do not state Islamic holiday dates as confirmed until FAHR/WAM announcement
- Do not use July 31, 2026 as the e-invoicing ASP deadline — superseded by the October 30, 2026 amendment
- Do not call Sept 30 the Corporate Tax deadline for all UAE companies — it is an example for December year-end entities only
- Do not state specific fine amounts for Emiratisation without MoHRE source

---

## Recommended Next Phase

**Phase 6C-63** should focus on:

1. **Owner decision:** HOL-04/HOL-05 path — December 2026 monthly calendar page, or keep inside Long Weekends only?
2. **Owner review:** TAX-05C + TAX-05A e-invoicing drafts → approve → recheck MoF URL → import
3. **DB maintenance (Phase 6C-50):** Long Weekends label softening + fix `--` style (no date change — Dec 1 confirmed correct per Phase 6C-63)
4. **Source sprint:** GITEX dates (July 2026), F1 Abu Dhabi dates (August 2026), Corporate Tax guide (by August 1)

Do NOT:
- Import HOL-04/HOL-05 standalone before the December 2026 page decision
- Reimport TAX-01A or VIRAL-01 (already live)
- Reference a P0 noindex blocker in any future phase documents (stale)

---

## Output Files Created This Phase

| File | Purpose |
|---|---|
| `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` | Full matrix of all 2026 calendar candidates — all required fields per item |
| `docs/content-drafts/calendar/phase-6c62-first-import-batch-recommendation.md` | Ranked first-import batch with import conditions and checklists |
| `docs/content-drafts/PHASE_6C62_SUMMARY.md` | This file — phase summary and Q&A |

---

**Phase 6C-62 is complete. No code was touched. No DB was modified. No content was imported or deployed.**
