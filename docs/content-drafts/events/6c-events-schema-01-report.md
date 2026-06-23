# Phase 6C-EVENTS-SCHEMA-01 — Event Rich Result Recommended Fields Audit/Fix
## Local Report

Date: 2026-06-22
Status: Local changes complete. Pending owner review before commit/deploy.
Build: Passed (88 pages, 0 TypeScript errors, 0 compilation errors)

---

## Summary

Audited all three live Event JSON-LD pages for GSC recommended fields.
Added `image` field to both EN and RU event page templates.
Blocked `performer` for all three events — no safe, official, accurate data exists for any of them.

---

## Files Changed

| File | Change |
|---|---|
| `app/(en)/(public)/events/[slug]/page.tsx` | Added `image: \`${BASE}${heroImage}\`` to eventSchema |
| `app/ru/events/[slug]/page.tsx` | Identical change |

## Files Created

| File | Purpose |
|---|---|
| `docs/content-drafts/events/6c-events-schema-01-audit.md` | Full audit with image dimensions, performer analysis |
| `docs/content-drafts/events/6c-events-schema-01-report.md` | This report |

---

## Events Audited

1. DP World Tour Championship 2026 (`/events/dp-world-tour-championship-2026`)
2. GITEX Global 2026 (`/events/gitex-global-2026`)
3. Formula 1 Abu Dhabi Grand Prix 2026 (`/events/formula-1-abu-dhabi-grand-prix-2026`)

All three have EN and RU routes. All six pages audited.

---

## Image Field Decision per Event

| Event | Image Added | Image URL | Rationale |
|---|---|---|---|
| DP World Tour Championship 2026 | YES | `https://guidex-consulting.ae/images/hubs/dubai-skyline-downtown.webp` | Existing page hero; publicly crawlable; 960px wide (≥720px min) |
| GITEX Global 2026 | YES | `https://guidex-consulting.ae/images/hubs/dubai-skyline-downtown.webp` | Same |
| Formula 1 Abu Dhabi GP 2026 | YES | `https://guidex-consulting.ae/images/hubs/dubai-skyline-downtown.webp` | Same |

Image details:
- File: `public/images/hubs/dubai-skyline-downtown.webp`
- Dimensions: 960×1200px (portrait, ratio 0.80:1)
- Google minimum width: 720px — PASSES
- Google preferred ratio: 1.9:1 — does NOT match, but portrait images are accepted
- Served at: `/images/hubs/dubai-skyline-downtown.webp` — no auth, publicly crawlable
- EN/RU: identical (same `heroImage` variable in both templates)

Implementation: `image: \`${BASE}${heroImage}\`` — dynamic, tied to whatever hero image each event page actually displays. Stays in sync if `categoryImage()` returns different images in future.

---

## Performer Field Decision per Event

| Event | Performer Status | Reason | Action |
|---|---|---|---|
| DP World Tour Championship 2026 | BLOCKED | Golf tournament. Player list varies yearly; not in page data. `performer` ≠ golfer in schema.org sense (would need SportsEvent + competitor). Using organizer as performer would be wrong. | Not added |
| GITEX Global 2026 | NOT APPLICABLE | Trade expo, not a performance event. Thousands of speakers/exhibitors; no single "performer" exists. Adding a speaker as performer would misrepresent event type. | Not added |
| Formula 1 Abu Dhabi GP 2026 | BLOCKED — separate event model needed | F1 drivers are competitors, not performers (schema.org distinction). Yasalam concerts are separate ticketed events — adding their performers to the F1 race JSON-LD conflates two distinct events. | Not added |

---

## Changes Implemented

Single logical change: added one field to the Event JSON-LD object in both page templates.

```tsx
// Before
const eventSchema = event.schemaEligible ? {
  "@context": "https://schema.org",
  "@type":    "Event",
  name:        event.seoTitle || event.title,
  description: event.metaDescription || event.summary,
  startDate:   event.eventDateStart,
  ...

// After
const eventSchema = event.schemaEligible ? {
  "@context": "https://schema.org",
  "@type":    "Event",
  name:        event.seoTitle || event.title,
  description: event.metaDescription || event.summary,
  image:       `${BASE}${heroImage}`,
  startDate:   event.eventDateStart,
  ...
```

---

## Blocked Claims

- `performer` for DP World Tour: no confirmed player list in data; schema type mismatch
- `performer` for GITEX: trade expo, not a performance event
- `performer` for F1: race vs. concert conflation risk; driver ≠ schema.org performer
- No invented performers, speakers, athletes, artists, teams, ticket prices, or attendance figures added

---

## Build Result

```
✓ Compiled successfully in 2.7s
✓ TypeScript: 0 errors
✓ 88 pages generated
```

---

## Route QA Result

All 9 required routes returned HTTP 200:

| Route | Status |
|---|---|
| /events/dp-world-tour-championship-2026 | 200 |
| /ru/events/dp-world-tour-championship-2026 | 200 |
| /events/gitex-global-2026 | 200 |
| /ru/events/gitex-global-2026 | 200 |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| /sitemap.xml | 200 |

JSON-LD validation (all 6 event routes, EN + RU):

| Check | Result |
|---|---|
| `image` field present | PASS — all 6 routes |
| `image` URL correct absolute URL | PASS — `https://guidex-consulting.ae/images/hubs/dubai-skyline-downtown.webp` |
| `performer` absent | PASS — not added to any route |
| `location` intact | PASS — all 6 routes |
| `organizer` intact | PASS — all 6 routes |
| DP World Tour: Jumeirah Golf Estates, DP World Tour organizer, dates 2026-11-12–15 | PASS |
| GITEX: Dubai Exhibition Centre at Expo City Dubai | PASS |
| F1: Yas Marina Circuit, Abu Dhabi | PASS |
| No "Dubai Grand Prix" | PASS |
| Calendar UX intact | PASS |

---

## Remaining GSC Warnings Expected After Deploy

- `image` warning: RESOLVED for all three events (EN + RU) — 6 pages fixed
- `performer` warning: REMAINS on DP World Tour page (and possibly others)
  - This is intentional. No safe, accurate `performer` data exists.
  - GSC will still show "recommended field missing: performer" — this is acceptable
  - `performer` is recommended, not required. Rich results will still be eligible.

---

## Confirmation: No DB / Admin / AI Inbox / Import / Deploy / Commit / Push / Schema Changes

- No DB touched
- No schema changed
- No imports run
- No admin files touched
- No AI Inbox touched
- Not committed
- Not pushed
- Not deployed

---

## Owner Approval Required

Yes — owner must approve before commit and deploy.

Changes are minimal (1 line per file, 2 files) and low-risk. The only new data added is the absolute URL of the existing page hero image.

---

## Next Recommended Phase

After deploy, no immediate follow-up required for Event schema.

If in future an event-specific image (golf course, expo hall, circuit) becomes available and is legally usable, the `IMAGE_BY_SLUG` map pattern (similar to existing `VENUE_BY_SLUG` / `ORGANIZER_BY_SLUG`) can be added to override the generic hub image for specific events.

Next product priority: owner direction — new content batch, calendar expansion, or another QA phase.
