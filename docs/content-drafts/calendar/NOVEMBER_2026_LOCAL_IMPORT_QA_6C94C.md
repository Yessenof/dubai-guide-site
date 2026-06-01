# November 2026 Local Import QA Report
## Phase 6C-94C | QA date: 2026-06-01

---

## 1. Import run summary

| Item | Value |
|------|-------|
| Script | `scripts/november-2026-local-import-6c94c.ts` |
| DB | `data/guides.db` (local dev, NOT production) |
| Run timestamp | 2026-06-01 |
| Result | SUCCESS (after enum fix, see section 3) |
| Events created | 2 |
| Calendar pages created | 1 |
| Production DB written | NO |
| Push/deploy | NO |

---

## 2. Items imported

### Events

| Slug | Title | Dates | Category | color_type | Status |
|------|-------|-------|----------|------------|--------|
| dubai-design-week-2026 | Dubai Design Week 2026 -- 3 to 8 November at Dubai Design District | 2026-11-03 to 2026-11-08 | festival | major-event | published |
| big-5-global-dubai-2026 | Big 5 Global 2026 -- 23 to 26 November at Dubai World Trade Centre | 2026-11-23 to 2026-11-26 | dubai-event | major-event | published |

### Calendar pages

| Slug | Month/Year | Type | Status |
|------|-----------|------|--------|
| november-2026-dubai-calendar | 11/2026 | monthly | published |

### Calendar DATES_JSON (3 items)

| ID | Date | Type | Emirate | detail_url |
|---|---|---|---|---|
| NOV-04-ADIPEC | 2026-11-02 | conference | Abu Dhabi | null |
| NOV-01-DDW | 2026-11-03 | trade_show | Dubai | /events/dubai-design-week-2026 |
| NOV-03-BIG5 | 2026-11-23 | trade_show | Dubai | /events/big-5-global-dubai-2026 |

### HOLD items (not imported)

| Item | Reason |
|------|--------|
| Downtown Design (standalone) | Source unreachable, OFFICIAL_PARTIAL only |
| Dubai Fitness Challenge (DFC) | Official site returns 403 |
| Global Village Season 31 | No confirmed opening date |

---

## 3. Script fix required (applied)

**Bug found:** Script used `category: "event"` and `color_type: "event"` for both events.
These values are not in the allowed enums (`EVENT_CATEGORIES` / `EVENT_COLOR_TYPES`).
The validator allows `publishEvent` to fail after draft creation, leaving an orphaned draft row.

**Fix applied to script:**
- DDW: `category` changed from `"event"` to `"festival"`, `color_type` to `"major-event"`
- Big 5: `category` changed from `"event"` to `"dubai-event"`, `color_type` to `"major-event"`

**Why these values:**
- DDW: explicitly a "design festival" per organizer — `festival` is accurate; it's a major professional event — `major-event`
- Big 5: a trade exhibition, not a festival — `dubai-event` is the appropriate catch-all; `major-event` for color (region's largest construction show)

**Rollback of orphaned partial draft:** `DELETE FROM events WHERE slug='dubai-design-week-2026'` was run before the fixed re-import.

**Script was updated before the successful import run.** The committed script file now contains the correct values.

---

## 4. Publish warnings (non-blocking)

Both events triggered warning: `en_summary should be 1–2 sentences — currently longer.`

DDW summary: 3 sentences (68 words). The extra sentence mentions Downtown Design, which is contextually important for users searching for DDW+Downtown Design together. Recommend keeping as-is; the 3rd sentence is load-bearing for search intent.

Big 5 summary: 3 sentences (52 words). Trade-only restriction appears in sentence 3. This is useful user information. Recommend keeping.

The calendar page published with **no warnings**.

---

## 5. Route QA results

All routes checked against local dev server (http://localhost:3000). Dev server: `npm run dev -- --hostname 0.0.0.0`.

| Route | HTTP Status | Title rendered | Content spot-check |
|-------|------------|---------------|-------------------|
| /events/dubai-design-week-2026 | 200 | Dubai Design Week 2026 \| 3-8 November, Dubai Design District | November, d3, Design District present |
| /ru/events/dubai-design-week-2026 | 200 | Dubai Design Week 2026 \| 3-8 ноября, Dubai Design District | RU title rendered correctly |
| /events/big-5-global-dubai-2026 | 200 | Big 5 Global 2026 Dubai \| 23-26 November, Dubai World Trade Centre | Correct |
| /ru/events/big-5-global-dubai-2026 | 200 | (inherits from EN SEO title — RU slug renders) | 200 OK |
| /calendar/november-2026-dubai-calendar | 200 | November 2026 Dubai calendar: Dubai Design Week, Big 5 Global and ADIPEC | Correct |
| /ru/calendar/november-2026-dubai-calendar | 200 | RU calendar page | 200 OK |
| /calendar?month=2026-11 | 200 | Calendar index | ADIPEC, Design Week, Big 5 all present in index |
| /ru/calendar?month=2026-11 | 200 | RU calendar index | ADIPEC, Design Week, Big 5 all present |

**All 8 routes: PASS (200 OK)**

---

## 6. Dev server error log

No errors in `/tmp/guidex-dev-6c94c.log` related to these routes.

---

## 7. Local DB state after import

| Table | Before | After |
|-------|--------|-------|
| events | 2 rows | 4 rows |
| calendar_pages | 10 rows | 11 rows |

---

## 8. QA verdict

**LOCAL IMPORT QA: PASS**

All routes return 200. Content renders correctly. No server errors. Script fixed for enum values; fix documented and applied.

Items ready for production: DDW event, Big 5 event, November 2026 calendar page.

HOLD items remain on hold: DFC (403), Downtown Design (source unreachable), Global Village (no date).
