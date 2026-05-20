# Phase 6C-40A — Public Rendering and Calendar UX Fix Report

**Status:** COMPLETE  
**Date:** 2026-05-21  
**TypeScript:** 0 errors  
**Build:** 86 pages, 0 errors (pre-phase baseline)

---

## What was fixed

### 1. Raw Markdown rendering on detail pages

**Root cause:** Body content stored as Markdown in DB. Pages were splitting by `\n\n` and rendering each block as a plain `<p>` tag, leaving `####`, `**bold**`, `|tables|`, and `---` visible as raw text.

**Fix:** Created `components/MarkdownBody.tsx` — a minimal server-compatible Markdown renderer with zero external dependencies. Handles: `h2`, `h3`, `h4`, `**bold**`, `|pipe tables|`, `- bullet lists`, `---` (skipped). Applied to all 6 detail page routes.

**Files changed:**
- `components/MarkdownBody.tsx` — NEW
- `app/(public)/events/[slug]/page.tsx`
- `app/(public)/news/[slug]/page.tsx`
- `app/(public)/calendar/[slug]/page.tsx`
- `app/ru/events/[slug]/page.tsx`
- `app/ru/news/[slug]/page.tsx`
- `app/ru/calendar/[slug]/page.tsx`

### 2. Contextual calendar date strip on detail pages

**Fix:** Extended `CalendarContextCta` with `highlightStart?` and `highlightEnd?` props. When provided, renders navy date-pill strip showing every date in the event's range (capped at 14 days). Event detail pages (EN + RU) pass `event.eventDateStart` and `event.eventDateEnd`.

**Files changed:**
- `components/calendar/CalendarContextCta.tsx`
- `app/(public)/events/[slug]/page.tsx`
- `app/ru/events/[slug]/page.tsx`

### 3. Calendar range visualization — multi-day items on every day

**Root cause:** `itemsByDate` map was keyed only by `item.date` (start date), so a 5-day Eid range (May 25–29) only appeared on May 25 in the grid.

**Fix:** Added `expandRanges()` helper in `CalendarGrid.tsx`. Expands items with `period_end` into one `GridItem` per day in the range (clamped to current month, max span cap). Each clone carries `_cellDate` set to the expanded date. `itemsByDate` keys by `_cellDate ?? item.date`.

### 4. Agenda grouping — duplicate cards collapsed

**Root cause:** 4 calendar items shared `detail_url: "/events/uae-eid-al-adha-2026"`, producing 4 separate agenda cards.

**Fix:** Added `groupByDetailUrl()` helper. Items sharing a `detail_url` collapse into a single array entry. New `GroupedAgendaCard` and `GroupedAgendaRow` components render grouped items with sub-item list (date + label), range display, and single CTA.

### 5. Monday-first calendar grid

**Root cause:** Day headers were `["Su", "Mo", ...]` and `getDay()` Sunday=0 mapping was used directly.

**Fix:**
- Headers changed to `["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]` (EN) and `["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]` (RU)
- `buildGridCells()`: `const firstDay = (rawFirstDay + 6) % 7` — maps Sun→6, Mon→0, ..., Sat→5

**File changed:** `components/calendar/CalendarGrid.tsx`

---

## QA results

| Route | HTTP | Headings render | No raw MD | Date strip | Robots |
|---|---|---|---|---|---|
| `/events/uae-eid-al-adha-2026` | 200 | ✓ h4s visible | ✓ | May 25–29 pills ✓ | index, follow |
| `/ru/events/uae-eid-al-adha-2026` | 200 | ✓ RU h4s | ✓ | ✓ | — |
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | ✓ | ✓ | n/a | — |
| `/ru/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | ✓ | ✓ | n/a | — |
| `/calendar/may-2026-uae-calendar` | 200 | ✓ h4s | ✓ | n/a | — |
| `/ru/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | ✓ RU | ✓ | n/a | — |
| `/news/uae-emiratisation-june-30-2026-deadline` | 200 | ✓ | ✓ | n/a | — |
| `/calendar` | 200 | — | — | Mon-first (code ✓) | — |
| `/ru/calendar` | 200 | — | — | Mon-first (code ✓) | — |
| `/` homepage | 200 | — | — | — | — |

**Calendar client-rendered checks (code-verified):**
- Monday-first headers: `DAY_HEADERS_EN = ["Mo", "Tu", ...]` — line 34
- Monday shift formula: `(rawFirstDay + 6) % 7` — line 83
- Range expansion: `expandRanges()` present — line 136
- Agenda grouping: `groupByDetailUrl()` + `GroupedAgendaCard/Row` — lines 168, 832, 924

---

## Hard restriction compliance

| Restriction | Status |
|---|---|
| No new article/event/guide/calendar drafts | ✓ |
| No new imports (external packages) | ✓ (MarkdownBody uses only React) |
| No DB schema/migration changes | ✓ |
| No admin or AI Inbox changes | ✓ |
| No env/secrets/GTM/GA4 changes | ✓ |
| No production data deleted | ✓ |
| No mock URLs in output | ✓ |
| TypeScript 0 errors | ✓ |

---

## Files changed (commit scope)

```
components/MarkdownBody.tsx                     NEW
components/calendar/CalendarContextCta.tsx      MODIFIED
components/calendar/CalendarGrid.tsx            MODIFIED
app/(public)/events/[slug]/page.tsx             MODIFIED
app/(public)/news/[slug]/page.tsx               MODIFIED
app/(public)/calendar/[slug]/page.tsx           MODIFIED
app/ru/events/[slug]/page.tsx                   MODIFIED
app/ru/news/[slug]/page.tsx                     MODIFIED
app/ru/calendar/[slug]/page.tsx                 MODIFIED
```
