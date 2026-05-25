# Phase 6C-62B — Calendar Seed Matrix Consistency Cleanup

**Date:** 2026-05-25
**Phase:** 6C-62B
**Scope:** Audit-only — corrects stale data in Phase 6C-62 output documents; no DB writes, no imports, no code changes, no deploy

---

## 1. Live Production Robots/Index Check

All 8 target routes verified via WebFetch (2026-05-25):

| Route | HTTP | Robots meta |
|---|---|---|
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | **index, follow** |
| `/events/uae-eid-al-adha-2026` | 200 | **index, follow** |
| `/calendar/may-2026-uae-calendar` | 200 | **index, follow** |
| `/news/uae-emiratisation-june-30-2026-deadline` | 200 | **index, follow** |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | **index, follow** |
| `/calendar/uae-long-weekends-2026-2027` | 200 | **index, follow** |
| `/calendar` | 200 | noindex, follow |
| `/ru/calendar` | 200 | noindex, follow |

---

## 2. Was the "P0 Noindex Blocker" Stale or Real?

**Stale.**

Phase 6C-62 stated: "All news, events, and calendar routes hardcode `robots: { index: false }`. No SEO or RAG value from any calendar/news/event page until this is resolved."

This is incorrect. All 6 individual content detail pages are `index, follow`. The code that was once broken has been fixed (the fix predates this session — likely resolved during Phase 6C-33 Indexing Policy Fix or a subsequent phase).

The `/calendar` and `/ru/calendar` listing pages are `noindex, follow`. This is a product decision — these are paginated listing pages, not content destinations. It does not affect the indexability of any individual news/event/calendar detail page.

**Consequence:** The P0 blocker language must not appear in any future phase documents or be used to justify holding content imports.

---

## 3. Which Candidate Items Are Already Live?

Four item groups are live in production (all `index, follow`):

### HOL-01 — Eid Al Adha 2026 Package
- `/news/uae-eid-al-adha-2026-federal-holiday-long-break` — index, follow ✓
- `/events/uae-eid-al-adha-2026` — index, follow ✓
- `/calendar/may-2026-uae-calendar` — index, follow ✓ (monthly calendar, May 2026)

**Action:** Monitor. Archive news after 2026-06-01.

### TAX-01A — Emiratisation June 30 (50+ employees)
- `/news/uae-emiratisation-june-30-2026-deadline` — index, follow ✓
- `/calendar/uae-emiratisation-june-30-2026-reminder` — index, follow ✓

**Action:** Monitor GSC. noindex_after 2026-07-10.

### VIRAL-01 — UAE Long Weekends 2026–27
- `/calendar/uae-long-weekends-2026-2027` — index, follow ✓

**Action:** Monitor GSC. Phase 6C-50 DB write for copy drift and label softening (no date change — Dec 1 confirmed correct per Phase 6C-63).

### May 2026 Monthly Calendar
- `/calendar/may-2026-uae-calendar` — index, follow ✓ (part of HOL-01 package above)

**Status:** Part of the Eid Al Adha package. Live.

---

## 4. Are HOL-04/HOL-05 Safe to Import Separately, or Would They Duplicate?

**They would duplicate. Do NOT import standalone.**

Live DB query of `uae-long-weekends-2026-2027` datesJson confirms both dates are already represented:

```json
{
  "date": "2026-12-01",
  "label_en": "Commemoration Day -- Federal Holiday (date statutory; 2026 scope pending FAHR)",
  "confidence": "expected",
  "detail_url": "/calendar/uae-long-weekends-2026-2027"
},
{
  "date": "2026-12-02",
  "date_end": "2026-12-03",
  "label_en": "UAE National Day -- Federal Holiday (dates statutory; 2026 scope pending FAHR)",
  "confidence": "expected",
  "detail_url": "/calendar/uae-long-weekends-2026-2027"
}
```

If separate `calendar_pages` rows are imported for Nov 30 and Dec 2–3, the calendar agenda view would show the same holiday twice for those dates — once from the Long Weekends datesJson, once from the new standalone page.

### Commemoration Day Date — Phase 6C-63 Correction

**The "pre-existing data error" claim in this section is retracted.** Phase 6C-62B stated that Dec 1 in the Long Weekends datesJson was wrong and should be Nov 30. This claim was itself incorrect and unverified — Phase 6C-62B made it without checking the Phase 6C-40 source ledger or Phase 6C-46 QA records.

Phase 6C-63 source research found:
- Nov 30 = the national occasion/observance date (Cabinet Decision 14/2015) — not a public holiday
- Dec 1 = the public holiday/day-off date per Cabinet Resolution 27/2024 — correctly stored in the DB
- The Long Weekends datesJson shows day-off dates, not observance dates; Dec 1 is correct for what the entry represents
- The Phase 6C-46 QA explicitly reviewed Dec 1 and marked it safe: *"Commemoration Day = Dec 1 (date fixed) | UAE law / Cabinet Resolution 27/2024 | Safe"*

**No date correction is needed.** The Phase 6C-50 DB write should soften label language and fix `--` style — but must NOT change the date from Dec 1 to Nov 30. See `calendar/december-2026-holiday-source-resolution.md` for full source resolution findings.

### Recommended Path for HOL-04/HOL-05

Two options — owner decides:

**Option A (minimal):** Leave HOL-04 and HOL-05 inside the Long Weekends yearly reference only. No standalone pages. Phase 6C-50 DB write: soften label language and fix `--` style only — no date change. Both holidays remain as datesJson entries pointing to `/calendar/uae-long-weekends-2026-2027`. Clean, no duplicate risk.

**Option B (full):** Build a December 2026 monthly calendar page (same pattern as May 2026 for Eid). When ready: update Long Weekends datesJson `detail_url` for both entries to point to the new December page. Update labels (soften language, fix `--`) in same DB write — no date change. This creates a dedicated December 2026 destination. More content value, more work, coordinated DB operation.

Option A is lower risk and safe now. Option B is the content-rich path but requires a deliberate owner decision and a coordinated DB write with the Long Weekends update.

---

## 5. Corrected First Import Batch

After removing already-live items and flagging duplicate risks, the corrected first import batch is:

### Tier B (Owner Approval) — 1 item group

**TAX-05C + TAX-05A — E-invoicing Package**

| Field | Value |
|---|---|
| TAX-05C date | 2026-10-30 (ASP deadline, large businesses ≥ AED 50M) |
| TAX-05A date | 2026-07-01 (pilot start + voluntary phase) |
| Source | Official MoF permalink captured (Phase 6C-23) |
| Draft | `docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md` |
| Condition | Owner approves → recheck MoF URL at time of import → import |
| Scope guard | Large businesses (≥ AED 50M annual revenue) only. SME deadline: March 31, 2027. |
| Risk | High — scope-specific compliance claim |

### Tier C (Source Sprint) — 3 items

| ID | Item | Source action | When |
|---|---|---|---|
| DXB-02 | GITEX Global 2026 | Monitor gitex.com for 2026 dates | July 2026 |
| AUH-01 | F1 Abu Dhabi 2026 | Monitor formula1.com for 2026 race weekend | August 2026 |
| TAX-02 | Corporate Tax Sept 30 | Build guide first; target import-ready by Aug 1 | July–August 2026 |

### HOL-04 / HOL-05 — Decision Gate

Not in the first import batch. Owner decides Option A or Option B above.

---

## 6. Items NOT to Import (Summary)

| ID | Item | Reason |
|---|---|---|
| HOL-01 | Eid package | ALREADY LIVE |
| TAX-01A | Emiratisation June 30 | ALREADY LIVE |
| VIRAL-01 | Long Weekends | ALREADY LIVE |
| May 2026 calendar | Monthly calendar | ALREADY LIVE |
| HOL-04 | Commemoration Day | DUPLICATE RISK — in Long Weekends datesJson |
| HOL-05 | National Day | DUPLICATE RISK — in Long Weekends datesJson |
| HOL-02 | Islamic New Year | HOLD — no official FAHR date |
| HOL-03 | Mawlid | HOLD — no official FAHR date |
| TAX-01B | Emiratisation 20–49 band | HOLD — June 30 not confirmed 2026-specific |
| TAX-04 | Emiratisation Dec 31 | Follow-up to TAX-01A; already live |
| All other events without dates | DXB-01/03–06, AUH-02/03 | SOURCE_NEEDED |
| Internal-only items | TAX-06/07, PROP-01/02, DLS-07/08 | INTERNAL_ONLY |

---

## 7. What Phase 6C-63 Should Actually Import

```
Decision required first:
  □ Owner decides HOL-04/HOL-05 path (Option A or Option B)

If Option A (minimal — recommended for now):
  → No standalone HOL-04/HOL-05 import
  → Phase 6C-50 DB write only: fix copy drift + soften Commemoration Day label (no date change)

If Option B (December 2026 page):
  → Build December 2026 monthly calendar page
  → Update Long Weekends datesJson to point both entries to new page
  → Soften label language + fix -- style (no date change — Dec 1 is correct)
  → All changes in one coordinated DB write + build + deploy

Content import (approved separately):
  → TAX-05C + TAX-05A e-invoicing (owner approval → URL recheck → import)

Source sprint (July–August, not imports yet):
  → Capture GITEX 2026 dates
  → Capture F1 Abu Dhabi 2026 dates
  → Begin Corporate Tax guide draft
```

---

## 8. Documents Updated This Phase

| File | Change |
|---|---|
| `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` | Replaced stale P0 blocker with verified noindex table; added ALREADY_LIVE + DUPLICATE_RISK classification codes; updated HOL-01, TAX-01A, VIRAL-01 to ALREADY_LIVE; updated HOL-04, HOL-05 to DUPLICATE_RISK with data error note; updated VIRAL-01 detail spec |
| `docs/content-drafts/calendar/phase-6c62-first-import-batch-recommendation.md` | Complete rewrite — removed already-live items; added duplicate risk warning for HOL-04/HOL-05; corrected noindex status; rebuilt tiers with only genuinely new items |
| `docs/content-drafts/PHASE_6C62_SUMMARY.md` | Updated key findings (P0 blocker, 4 live groups); updated Q&A; updated recommended next phase |
| `docs/content-drafts/PHASE_6C62B_CALENDAR_SEED_MATRIX_CONSISTENCY_CLEANUP.md` | Created (this file) |

---

## 9. Git Status

No code files were modified. All changes are to `docs/content-drafts/` planning documents only.

Files changed this phase:
```
docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md      (modified)
docs/content-drafts/calendar/phase-6c62-first-import-batch-recommendation.md  (modified)
docs/content-drafts/PHASE_6C62_SUMMARY.md                                 (modified)
docs/content-drafts/PHASE_6C62B_CALENDAR_SEED_MATRIX_CONSISTENCY_CLEANUP.md   (new)
```

No code changed. No DB touched. No deploy. No push. No commit (pending owner approval).

---

## 10. What Was Not Touched

- DB: not touched
- Admin panel: not touched
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Code: not touched
- No imports, no deployments

---

## Final Answers

**Was the "P0 noindex blocker" stale or real?**
Stale. All individual detail pages are `index, follow`. The code fix was applied in a prior phase. The P0 language must not appear in future phase documents.

**Which candidate items are already live?**
Four groups: HOL-01 Eid package, TAX-01A Emiratisation, VIRAL-01 Long Weekends, May 2026 monthly calendar. All `index, follow`.

**What is the corrected first import batch?**
One item group ready for owner approval: TAX-05C + TAX-05A e-invoicing package. Three items pending source capture: GITEX, F1 Abu Dhabi, Corporate Tax.

**Are HOL-04/HOL-05 safe to import separately?**
No. Both dates are already inside the Long Weekends datesJson. Standalone import would create duplicate calendar agenda entries. Owner must choose: Option A (keep in Long Weekends only) or Option B (build December 2026 monthly page with coordinated DB update).

**What should Phase 6C-63 actually import locally?**
1. Decision gate: HOL-04/HOL-05 path (owner decides)
2. TAX-05C + TAX-05A e-invoicing package (after owner approval + URL recheck)
3. December 2026 monthly calendar page (only if owner chooses Option B)
4. DB maintenance (Phase 6C-50): Long Weekends copy drift + Commemoration Day date correction

**Phase 6C-62B is complete. No code, no DB, no deploy.**
