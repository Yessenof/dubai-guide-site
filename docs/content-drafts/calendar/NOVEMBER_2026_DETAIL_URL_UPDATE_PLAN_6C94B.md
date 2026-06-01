# November 2026 — Calendar Detail URL Update Plan

**Phase:** 6C-94B
**Date:** 2026-06-01
**Status:** Planning document — no DB write in this phase

---

## Overview

When November 2026 calendar is imported in Phase 6C-94C, the `dates_json` for each item must include the correct `detail_url` values. This document specifies exactly what each calendar item's `detail_url` should be, and what the import sequence must be.

---

## Import sequence requirement

The events detail pages (DDW + Big 5) must be created in the `events` table BEFORE or SIMULTANEOUSLY WITH the `calendar_pages` import. The calendar item `detail_url` points to these pages — if the events don't exist yet, the CTA renders a broken link.

**Recommended sequence for Phase 6C-94C:**

1. Import events: INSERT `dubai-design-week-2026` into events table (status=published, ru_published=1)
2. Import events: INSERT `big-5-global-dubai-2026` into events table (status=published, ru_published=1)
3. Verify event routes: curl /events/dubai-design-week-2026 → 200; /events/big-5-global-dubai-2026 → 200
4. Import calendar: INSERT `november-2026-dubai-calendar` into calendar_pages with correct detail_urls in dates_json

Or: Import all in a single transaction, events first.

---

## detail_url values per calendar item

### NOV-01-DDW (Dubai Design Week)

```
detail_url:  "/events/dubai-design-week-2026"
cta_type:    "view_details"
cta_url:     "/events/dubai-design-week-2026"
cta_label_en: "Event details"
cta_label_ru: "Подробнее о событии"
```

- EN page: `/events/dubai-design-week-2026`
- RU page: `/ru/events/dubai-design-week-2026` (CalendarGrid prefixes /ru/ automatically for locale=ru)

### NOV-02-DD (Downtown Design — grouped with DDW)

```
detail_url:  "/events/dubai-design-week-2026"  ← same as DDW
cta_type:    "view_details"
cta_url:     "/events/dubai-design-week-2026"
cta_label_en: "See DDW details"
cta_label_ru: "Подробнее о DDW"
```

Both DDW and Downtown Design calendar items link to the same event detail page. The detail page covers both.

### NOV-03-BIG5 (Big 5 Global)

```
detail_url:  "/events/big-5-global-dubai-2026"
cta_type:    "view_details"
cta_url:     "/events/big-5-global-dubai-2026"
cta_label_en: "Event details"
cta_label_ru: "Подробнее о событии"
```

- EN page: `/events/big-5-global-dubai-2026`
- RU page: `/ru/events/big-5-global-dubai-2026`

### NOV-04-ADIPEC (ADIPEC, Abu Dhabi)

```
detail_url:  null
cta_type:    "open_source"
cta_url:     "https://www.adipec.com/"
cta_label_en: "Official website"
cta_label_ru: "Официальный сайт"
```

No internal Guidex page for ADIPEC. External CTA only. Future: if an Abu Dhabi events section is added to Guidex, consider an ADIPEC brief page.

---

## Items still on HOLD

| Item | Hold reason | detail_url when resolved |
|------|-------------|--------------------------|
| NOV-05-DFC (Dubai Fitness Challenge) | dubaifitnesschallenge.com still 403 | `/events/dubai-fitness-challenge-2026` (future) |
| NOV-06-VAT-MONTHLY | FTA explicit page for Nov 28 not captured | null (external FTA link) |
| Global Village Season 31 | No opening date from globalvillage.ae | null (external link) |
| Downtown Design 2026 (exact dates) | downtowndesign.ae unreachable | Already handled via DDW shared detail_url |

---

## What the AgendaCard renders with detail_url

When `detail_url` is set on a calendar item:
- CTA renders as an internal Next.js `<Link>` (not external `<a>`)
- For RU locale: CalendarGrid prepends `/ru` to the detail_url path
- AgendaCard shows the CTA as: "[cta_label_en] →" (no ↗ external arrow)
- User stays on guidex-consulting.ae

When `detail_url` is null:
- If `cta_url` starts with `http`: renders as external `<a href>` with ↗
- User leaves guidex-consulting.ae

---

## CTA routing (AgendaCard code reference)

From `components/calendar/CalendarGrid.tsx` (AgendaCard component):

```tsx
const href = item.detail_url
  ? isExternalItem
    ? item.detail_url
    : isRu ? `/ru${item.detail_url}` : item.detail_url
  : externalCtaHref;
const useExternal = isExternalItem || !!externalCtaHref;
```

For DDW (detail_url = "/events/dubai-design-week-2026", isExternal = false):
- EN: href = "/events/dubai-design-week-2026" → internal Link
- RU: href = "/ru/events/dubai-design-week-2026" → internal Link

Correct behavior. No code changes needed.

---

## RU calendar item label convention

For the RU calendar, the `label_ru` and `short_label_ru` are already in Russian (set in the calendar page import). The `detail_url` is locale-agnostic (the component handles /ru prefix). No separate RU detail_url field needed.

---

## Fallback plan if Phase 6C-94C cannot create event rows before calendar import

If Phase 6C-94C imports the calendar page before the event rows are created:
- Set `detail_url: null` on DDW and Big 5 calendar items
- Set `cta_type: "open_source"` + external CTA URLs
- Patch in Phase 6C-94D once event rows are live

This avoids broken internal links. Preferred: import events first, then calendar.
