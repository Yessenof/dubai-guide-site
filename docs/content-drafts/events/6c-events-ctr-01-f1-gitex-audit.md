# Phase 6C-EVENTS-CTR-01 — F1 + GITEX Audit

**Date:** 2026-06-18  
**Mode:** Local only. No deploy, no commit, no DB.

---

## Scope

Polish two live event detail pages for CTR, source clarity, and RAG/AI answer quality:
- `/events/formula-1-abu-dhabi-grand-prix-2026` and `/ru/events/...`
- `/events/gitex-global-2026` and `/ru/events/...`

---

## Implementation files (template only — no DB changes)

| File | Role |
|---|---|
| `app/(en)/(public)/events/[slug]/page.tsx` | EN event detail template |
| `app/ru/events/[slug]/page.tsx` | RU event detail template |
| `lib/db/news-events-calendar.ts` (read-only) | `getEventBySlug()` reader |
| `components/calendar/CalendarMiniPreview.tsx` | Calendar link component |
| `components/detail/DetailHero.tsx` | Hero image/eyebrow component |
| `components/MarkdownBody.tsx` | Body rendering component |

---

## Current JSON-LD schema (both templates, before this phase)

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "...",
  "description": "...",
  "startDate": "...",
  "endDate": "...",
  "eventStatus": "https://schema.org/EventScheduled",
  "url": "..."
}
```

**Missing fields:** `location`, `organizer`, `eventAttendanceMode`

---

## Current source block (before this phase)

```
Source: [Official source ↗]
```

Domain/authority name not displayed. Visitor cannot tell where the link goes.

---

## Current CalendarMiniPreview

- `detailSlug={event.calendarDetailSlug}` — resolved via DB join on `calendar_pages` table
- For GITEX and F1 (both December 2026), resolves to `december-2026-uae-calendar`
- Working correctly — no change needed

---

## DB content audit

### F1 Abu Dhabi Grand Prix 2026

| Field | DB value | Status |
|---|---|---|
| `en_title` | Formula 1 Abu Dhabi Grand Prix 2026: Race Weekend, Yasalam Concerts and Planning Notes | ✓ Accurate |
| `event_date_start` | 2026-12-03 | ✓ Confirmed official |
| `event_date_end` | 2026-12-06 | ✓ Confirmed official |
| `source_url` | https://www.abudhabigp.com/en/ | ✓ Live, returns 200 |
| Venue in body | Yas Marina Circuit, Yas Island, Abu Dhabi | ✓ Confirmed official |
| Yasalam Dec 3: Lewis Capaldi + Zara Larsson | In body | ✓ Confirmed from abudhabigp.com |
| Yasalam Dec 5: Imagine Dragons | In body | ✓ Confirmed from abudhabigp.com |
| Dec 4/6 not yet announced | In body | ✓ Matches "more artists on the way" on official page |
| "not Dubai" location note | In body ("Yas Marina Circuit, Yas Island, Abu Dhabi — not Dubai") | ✓ Correct |

**F1 content verdict: All key facts verified. No DB correction needed.**

### GITEX Global 2026

| Field | DB value | Status |
|---|---|---|
| `en_title` | GITEX Global 2026 at Expo City Dubai: Dates, Venue and What to Plan | ⚠️ Partially inaccurate (Summit is at DWTC) |
| `event_date_start` | 2026-12-07 | ✓ Confirmed official |
| `event_date_end` | 2026-12-11 | ✓ Confirmed official |
| `source_url` | https://www.gitex.com/gitex-global-2026 | ✓ Live, returns 200 |
| Summit Dec 7 venue | DB implies Expo City Dubai | ❌ WRONG — official page: DWTC |
| Main expo Dec 8-11 venue | Expo City Dubai (Dubai Exhibition Centre) | ✓ Confirmed official |
| "first GITEX outside DWTC since 1981" | In body | ⚠️ Partially inaccurate — Summit is still at DWTC |
| 6,800+ companies | In body | ⚠️ Unconfirmed for 2026 — likely historical figure from 2025 |
| 200,000+ visitors | In body / meta | ⚠️ Unconfirmed for 2026 — likely historical figure from 2025 |

**GITEX content verdict: DB requires correction for Summit venue and historical vs. 2026 visitor numbers. DB is locked this phase — owner action required.**

---

## Template improvements planned (code only)

1. **JSON-LD `location`** — add per-slug venue lookup for F1 and GITEX
2. **JSON-LD `organizer`** — add per-slug organizer lookup for F1 and GITEX
3. **JSON-LD `eventAttendanceMode`** — add `OfflineEventAttendanceMode` for all schema-eligible events
4. **Source block** — show domain name (extracted from `sourceUrl`) instead of generic "Official source"
5. Apply to both EN and RU templates

---

## GITEX DB correction flags (for owner action after this phase)

| Flag | Detail |
|---|---|
| Summit venue | Dec 7 Scale Summit is at DWTC, not Expo City Dubai. Body text implies otherwise. |
| "first GITEX outside DWTC" claim | Inaccurate — Summit is still at DWTC. Only the main Expo moves to Expo City Dubai. |
| 2026 visitor/company numbers | Not yet confirmed on official page for 2026. Currently shows placeholder text. |

These require a separate DB write phase.
