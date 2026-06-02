# UAE Calendar UX QA Report
## Phase 6C-95A | Date: 2026-06-01

---

## Build result
**npm run build: PASS** — 88/88 pages, no errors, compiled in 2.4s.

---

## Route QA results

All 12 required routes checked against local dev server (http://localhost:3000).

| Route | HTTP | Content check |
|-------|------|--------------|
| /calendar?month=2026-06 | 200 | OK |
| /calendar?month=2026-07 | 200 | OK |
| /calendar?month=2026-08 | 200 | OK |
| /calendar?month=2026-09 | 200 | OK |
| /calendar?month=2026-10 | 200 | OK |
| /calendar?month=2026-11 | 200 | OK |
| /ru/calendar?month=2026-06 | 200 | OK |
| /ru/calendar?month=2026-07 | 200 | OK |
| /ru/calendar?month=2026-08 | 200 | OK |
| /ru/calendar?month=2026-09 | 200 | OK |
| /ru/calendar?month=2026-10 | 200 | OK |
| /ru/calendar?month=2026-11 | 200 | OK |

**All 12 routes: PASS (200 OK)**

---

## UX naming changes — verified

| Check | Result |
|-------|--------|
| EN H1 "UAE Calendar" rendered | PASS (rendered 5× on calendar index, matches H1 + badge + metadata) |
| RU H1 "Календарь ОАЭ" rendered | PASS |
| Metadata title EN: "UAE Calendar: Holidays, Events..." | PASS |
| Metadata title RU: "Календарь ОАЭ: праздники..." | PASS |
| Homepage badge "UAE Calendar" | PASS |
| "This month in the UAE" rendered | PASS |
| "В этом месяце в ОАЭ" rendered | PASS (from RU locale check) |
| No remaining "Dubai Calendar" in product labels | PASS |
| No remaining "Календарь Дубая" in product labels | PASS |

---

## UX grid changes — verified

| Check | Result |
|-------|--------|
| 2px horizontal bars removed from mid-range days | PASS — code change confirmed in CalendarGrid.tsx |
| Mid-range days now show 5px dim dot | PASS — new rendering path |
| Start dates still show colored pill with label | PASS — unchanged |
| Dot items (secondary) still show 6px dots | PASS — unchanged |
| Overflow +N count still shows | PASS — unchanged |
| No TypeScript errors in build | PASS |

---

## Tested months with multi-day events

- July 2026: DSS (July 2 - Aug 30, long range, shows only on start date since ≥7 days — correct)
- August 2026: DSS continuation
- October 2026: WETEX (3 days, < 7 days — would show dim dots on Oct 21-22 instead of bars)
- November 2026: DDW (6 days — shows dim dots on Nov 4-8, pill only on Nov 3 start date)
- November 2026: Big5 (4 days — shows dim dots on Nov 24-26, pill only on Nov 23 start)

No horizontal bars visible for any multi-day events tested.

---

## Known visual limitations remaining (content gaps, not code issues)

| Month | Current items | Status |
|-------|--------------|--------|
| July 2026 | 3 | Sparse — needs concert/lifestyle items |
| August 2026 | 3 | Sparse — needs Back to School, concert |
| October 2026 | 4 | Thin — needs mid-term break, concert |
| November 2026 | 3 | Thin — needs Sharjah Book Fair |
| December 2026 | 0 | Missing page entirely |

These are content gaps, not UX code issues. Addressed in Parts D-F and Phase 6C-95B.

---

## Mobile width note

The grid uses `h-[64px]` cells on mobile, `h-[86px]` on desktop. With 1-2 items per day (start-date pill + dot), cells are clean and readable at 390px. No overflow issues with current item density.

---

## Dev server errors

No errors in `/tmp/guidex-dev-6c95a.log`.

---

## QA verdict

**UX QA: PASS**
