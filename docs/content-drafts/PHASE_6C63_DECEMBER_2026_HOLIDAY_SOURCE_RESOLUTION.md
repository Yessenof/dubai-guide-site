# Phase 6C-63 — December 2026 Holiday Source Resolution

**Date:** 2026-05-25
**Phase:** 6C-63
**Scope:** Source research and semantic classification only — no DB write, no import, no code change, no deploy

---

## What Was Done

Read and synthesized all primary source files to resolve whether the Phase 6C-62B "pre-existing data error" claim about Commemoration Day (Dec 1 vs Nov 30) was correct.

**Source files read:**
- `source-ledgers/uae-long-weekends-2026-2027-sources.md` — Phase 6C-40 source ledger; explicitly states Dec 1
- `PHASE_6C46_LONG_WEEKEND_LOCAL_IMPORT_QA.md` — QA record from the Long Weekends import; explicitly reviewed Dec 1 date
- `calendar/december-2026-holiday-source-resolution.md` — Phase 6C-63 resolution document (created this phase)
- `PHASE_6C62B_CALENDAR_SEED_MATRIX_CONSISTENCY_CLEANUP.md` — document containing the retracted claim
- `calendar/phase-6c62-first-import-batch-recommendation.md` — document containing a reference to the retracted claim
- `calendar/uae-dubai-2026-calendar-seed-matrix.md` — document containing a reference to the retracted claim
- Live DB query of `uae-long-weekends-2026-2027` datesJson (read-only)

**External sources fetched:**
- `https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays` — official UAE statutory public holiday list (HTTP 200)
- `https://uaelegislation.gov.ae` (Cabinet Resolution 27/2024) — HTTP 403; text not directly read

**Files created:**
1. `docs/content-drafts/calendar/december-2026-holiday-source-resolution.md` — Full source research and semantic classification
2. `docs/content-drafts/PHASE_6C63_DECEMBER_2026_HOLIDAY_SOURCE_RESOLUTION.md` — This file

**Files updated:**
1. `docs/content-drafts/PHASE_6C62B_CALENDAR_SEED_MATRIX_CONSISTENCY_CLEANUP.md` — Retracted "pre-existing data error" claim in Sections 3 and 7
2. `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` — Corrected HOL-04 notes
3. `docs/content-drafts/calendar/phase-6c62-first-import-batch-recommendation.md` — Removed "Fix Dec 1 → Nov 30" reference
4. `docs/content-drafts/source-ledgers/uae-long-weekends-2026-2027-sources.md` — Added Phase 6C-63 clarification note

---

## What Was Not Touched

- DB: not touched
- Admin panel: not touched
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Code: not touched
- No imports, no deployments

---

## Key Findings

### 1. Phase 6C-62B "Data Error" Claim Is Retracted

Phase 6C-62B stated: *"The Long Weekends datesJson has Commemoration Day as `2026-12-01`. The correct date is November 30 (`2026-11-30`). This is a pre-existing data error that needs a DB write to correct."*

**This claim was incorrect.** Phase 6C-62B made it without checking:
- The Phase 6C-40 source ledger (which explicitly states "Commemoration Day is 1 December (fixed date by UAE statute)")
- The Phase 6C-46 QA (which explicitly reviewed and marked Dec 1 as safe per Cabinet Resolution 27/2024)

The Dec 1 date was a deliberate, reviewed decision — not an error.

### 2. The Core Semantic Distinction

There are two distinct dates for Commemoration Day:

| Concept | Date | What it is | Status |
|---|---|---|---|
| National Occasion / Observance | November 30 | The day UAE soldiers were killed in Yemen (2015); established by Cabinet Decision 14/2015 | Not a public holiday |
| Public Holiday / Day Off | December 1 | The holiday date per Cabinet Resolution 27/2024 (cited in prior research) | Correctly stored in DB |

The Long Weekends datesJson stores day-off dates, not observance dates. December 1 is correct for what the calendar entry represents.

### 3. Official Sources Confirm Current DB State Is Correct

| Date | DB entry | Verdict |
|---|---|---|
| 2026-12-01 (Commemoration Day) | `confidence: "expected"` | Correct — Dec 1 is the holiday date; FAHR 2026 scope pending |
| 2026-12-02 / 2026-12-03 (National Day) | `confidence: "expected"` | Correct — u.ae statutory page confirms Dec 2–3 |

No date correction is needed in any DB write.

### 4. What Does Need Changing (Phase 6C-50, Not Now)

- Label `--` → `—` (em dash style fix in both Commemoration and National Day entries)
- Soften label language: "Federal Holiday (date statutory)" → less assertive phrasing
- Example corrected label: `"Commemoration Day — Holiday date pending FAHR 2026 announcement (expected: 1 December)"`
- Example corrected label: `"UAE National Day — Public holiday 2–3 December (scope pending FAHR 2026 announcement)"`

**No date change. No new DB entry. No standalone import.**

### 5. Commemoration Day Is Not in UAE's 6 Statutory Public Holidays

The u.ae official public holidays page lists 6 statutory holidays. Commemoration Day is not one of them. It is governed annually by FAHR circulars and Cabinet Resolution 27/2024. This means calling it "Federal Holiday (date statutory)" overstates certainty. The label correction in Phase 6C-50 should soften this.

---

## Final Q&A

| Question | Answer |
|---|---|
| Is 2026-12-01 definitely wrong? | No. It is correct — it is the public holiday / day-off date per Cabinet Resolution 27/2024 as cited in Phase 6C-40/46 research. |
| Is 2026-11-30 the public holiday or observance date? | Observance date only. Not the holiday/day-off date. Do not store it as a public holiday in the calendar. |
| Is the Phase 6C-62B "data error" claim correct? | No. It was incorrect and unverified. It is retracted. |
| Does the current production datesJson need a date correction? | No. The dates are correct. Labels need softening (Phase 6C-50). |
| Should we build a December 2026 monthly calendar page? | Yes — but only after the FAHR November 2026 announcement. Plan in October 2026. |
| What is the safest next import batch? | TAX-05C + TAX-05A e-invoicing package (after owner approval + URL recheck). |
| What should FAHR monitoring cover? | Commemoration Day 2026 scope (expected October–November 2026). National Day 2026 scope (same window). |
| When is Cabinet Resolution 27/2024 accessible? | uaelegislation.gov.ae returns 403. Re-check when accessible. FAHR references it as authority. |

---

## Recommended Option

**Option A: Keep Long Weekends datesJson as-is. No DB correction for the date.**

The date Dec 1 is correct per prior research. No new official source contradicts it. Confidence `expected` is correct — FAHR 2026 scope pending.

Phase 6C-50 DB write (already planned): soften labels and fix `--` style. Not a date change.

**Not recommended:**
- Changing Dec 1 to Nov 30 (would contradict prior research without a new official source)
- Adding a Nov 30 standalone entry (observance date; not a public holiday)
- Importing HOL-04 or HOL-05 as standalone pages (duplicate risk)

---

## Next Steps

| Priority | Item | Condition |
|---|---|---|
| 1 | TAX-05C + TAX-05A (e-invoicing) | Owner approval + URL recheck |
| 2 | December 2026 monthly calendar page | After FAHR November 2026 announcement |
| 3 | DXB-02 GITEX 2026 | After gitex.com publishes 2026 dates (check July 2026) |
| 4 | AUH-01 F1 Abu Dhabi 2026 | After formula1.com publishes 2026 calendar (check August 2026) |
| 5 | TAX-02 Corporate Tax guide | Build guide first; target import-ready by August 1, 2026 |
| 6 | Phase 6C-50 DB write | Long Weekends label corrections (no date change) |

**Monitor:**
- FAHR: Commemoration Day 2026 scope (October–November 2026)
- FAHR: National Day 2026 scope (November 2026)
- uaelegislation.gov.ae: Cabinet Resolution 27/2024 direct text (currently 403)

---

## Output Files

| File | Purpose |
|---|---|
| `docs/content-drafts/calendar/december-2026-holiday-source-resolution.md` | Full source research, semantic classification, all 8 Q&A answers |
| `docs/content-drafts/PHASE_6C63_DECEMBER_2026_HOLIDAY_SOURCE_RESOLUTION.md` | This file — phase summary |

---

*Internal planning document — Phase 6C-63 — 2026-05-25. Not for publish. No admin action. No DB write.*
