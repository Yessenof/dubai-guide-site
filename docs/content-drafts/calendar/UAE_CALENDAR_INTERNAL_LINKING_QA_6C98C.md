# UAE Calendar Internal Linking — Local QA Report
## Phase 6C-98C | Date: 2026-06-08

---

## Files changed

| File | Change |
|------|--------|
| `lib/db/news-events-calendar.ts` | Import `guides`; add `calendarDetailSlug?` + `relatedGuideTitle?` to `EventDetail`; secondary lookups in `getEventBySlug()` |
| `components/calendar/CalendarMiniPreview.tsx` | Add optional `detailSlug?: string` prop; when set, href = `calendarBase/detailSlug` |
| `app/(en)/(public)/events/[slug]/page.tsx` | Pass `detailSlug={event.calendarDetailSlug}`; show `relatedGuideTitle` in guide box |
| `app/ru/events/[slug]/page.tsx` | Same as EN; RU route gets `/ru/calendar/december-2026-uae-calendar` href |
| `docs/content-drafts/calendar/UAE_CALENDAR_INTERNAL_LINKING_AUDIT_6C98C.md` | NEW — audit doc |

---

## Links added / changed

### CalendarMiniPreview upgrade on all event pages

Before: linked to `/calendar?month=2026-12` (dynamic listing)
After: links to `/calendar/december-2026-uae-calendar` (SSG detail page — richer content)

Affects:
- `/events/gitex-global-2026` → CalendarMiniPreview now → `/calendar/december-2026-uae-calendar`
- `/ru/events/gitex-global-2026` → CalendarMiniPreview now → `/ru/calendar/december-2026-uae-calendar`
- `/events/formula-1-abu-dhabi-grand-prix-2026` → CalendarMiniPreview → `/calendar/december-2026-uae-calendar`
- `/ru/events/formula-1-abu-dhabi-grand-prix-2026` → CalendarMiniPreview → `/ru/calendar/december-2026-uae-calendar`
- `/events/dubai-design-week-2026` → CalendarMiniPreview → `/calendar/november-2026-dubai-calendar`
- `/ru/events/dubai-design-week-2026` → CalendarMiniPreview → `/ru/calendar/november-2026-dubai-calendar`
- `/events/big-5-global-dubai-2026` → CalendarMiniPreview → `/calendar/november-2026-dubai-calendar`
- `/ru/events/big-5-global-dubai-2026` → CalendarMiniPreview → `/ru/calendar/november-2026-dubai-calendar`

Events without a matching published calendar page for their month: CalendarMiniPreview
falls back to the existing `?month=X` dynamic listing URL (unchanged behavior).

### Related guide label upgrade on GITEX and Big 5

Before: "mainland company setup dubai" (slug text)
After EN: "How to Set Up a Mainland Company in Dubai" (real guide title)
After RU: "Открыть mainland компанию в Дубае: лицензия DED и полный процесс" (real RU guide title)

---

## Local route status (16/16 × 200)

| Route | HTTP |
|-------|------|
| / | 200 |
| /ru | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| /calendar/december-2026-uae-calendar | 200 |
| /ru/calendar/december-2026-uae-calendar | 200 |
| /calendar/november-2026-dubai-calendar | 200 |
| /ru/calendar/november-2026-dubai-calendar | 200 |
| /events/gitex-global-2026 | 200 |
| /ru/events/gitex-global-2026 | 200 |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /events/dubai-design-week-2026 | 200 |
| /ru/events/dubai-design-week-2026 | 200 |
| /events/big-5-global-dubai-2026 | 200 |
| /ru/events/big-5-global-dubai-2026 | 200 |

---

## Content checks

### GITEX EN (`/events/gitex-global-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/calendar/december-2026-uae-calendar` | PASS |
| No old `?month=2026-12` href | PASS |
| Guide title "How to Set Up a Mainland Company in Dubai" present | PASS |
| No slug-as-text "mainland company setup dubai" | PASS |

### GITEX RU (`/ru/events/gitex-global-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/ru/calendar/december-2026-uae-calendar` | PASS |
| RU guide title "Открыть mainland компанию в Дубае..." present | PASS |
| No slug-as-text | PASS |

### F1 EN (`/events/formula-1-abu-dhabi-grand-prix-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/calendar/december-2026-uae-calendar` | PASS |
| No "Related guide" box rendered | PASS |
| "Abu Dhabi" present (19 mentions) | PASS |

### F1 RU (`/ru/events/formula-1-abu-dhabi-grand-prix-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/ru/calendar/december-2026-uae-calendar` | PASS |
| No "Связанное руководство" box | PASS |

### Big 5 EN (`/events/big-5-global-dubai-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/calendar/november-2026-dubai-calendar` | PASS |
| Guide title "How to Set Up a Mainland Company in Dubai" present | PASS |

### Dubai Design Week EN (`/events/dubai-design-week-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/calendar/november-2026-dubai-calendar` | PASS |
| No "Related guide" box | PASS |

### Dubai Design Week RU (`/ru/events/dubai-design-week-2026`)

| Check | Result |
|-------|--------|
| CalendarMiniPreview href → `/ru/calendar/november-2026-dubai-calendar` | PASS |
| No "Связанное руководство" box | PASS |

### December SSG calendar (regression)

| Check | Result |
|-------|--------|
| "View event guide →" links still present (8 count) | PASS |
| GITEX link present | PASS |
| F1 link present | PASS |
| No raw JSON / dates_json leak | PASS |

---

## Broken link check

All internal hrefs verified:
- `/calendar/december-2026-uae-calendar` → 200 ✓
- `/calendar/november-2026-dubai-calendar` → 200 ✓
- `/ru/calendar/december-2026-uae-calendar` → 200 ✓
- `/ru/calendar/november-2026-dubai-calendar` → 200 ✓
- `/guides/mainland-company-setup-dubai` → verified in DB (published) ✓
- `/ru/guides/mainland-company-setup-dubai` → 200 ✓

No broken links introduced.

---

## EN/RU status

- EN event pages: correct labels, correct hrefs
- RU event pages: correct RU guide titles (RU DB title used; EN title as fallback for nav)
- RU calendar links use `/ru/calendar/...` prefix ✓
- No EN text leaked on RU pages

---

## Build result

- TypeScript errors: 0
- Static pages: 88 / 88

---

## Production readiness

**APPROVE_INTERNAL_LINKING_DEPLOY**

All 16 local routes 200. Content checks pass. No broken links. Build clean.

Changes are backward-compatible:
- `detailSlug` prop on CalendarMiniPreview is optional — existing usages (calendar detail pages, news pages) are unaffected
- `relatedGuideTitle` in EventDetail is optional — falls back to slug-as-text if lookup fails
- `calendarDetailSlug` in EventDetail is optional — falls back to `?month=` if no matching calendar page exists

No DB writes, no migrations, no admin, no production changes.
