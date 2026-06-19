# Phase 6C-EVENTS-CTR-01 — F1 + GITEX CTR / Source / Detail Polish: Final Report

**Date:** 2026-06-18  
**Status:** Complete — awaiting owner approval for commit and deploy  
**Mode:** Local only. No deploy, no commit, no push, no DB, no admin, no schema changes.

---

## Summary

Template improvements to the event detail pages for F1 Abu Dhabi Grand Prix 2026 and GITEX Global 2026. All changes are in the shared event page templates (`app/(en)/(public)/events/[slug]/page.tsx` and `app/ru/events/[slug]/page.tsx`). Zero DB changes. Zero content changes.

---

## Official source verification results

### Formula 1 Abu Dhabi Grand Prix 2026

| Source | URL | Status |
|---|---|---|
| Official race promoter | https://www.abudhabigp.com/en/ | ✓ Live 200 |

All DB facts confirmed from official source:
- Dates Dec 3–6 ✓
- Venue: Yas Marina Circuit, Yas Island, Abu Dhabi ✓
- Yasalam: Lewis Capaldi + Zara Larsson (Dec 3/Thu) ✓
- Yasalam: Imagine Dragons (Dec 5/Sat) ✓
- Dec 4/6 "more artists on the way" matches "not yet announced" in DB ✓

**No DB correction needed for F1.**

### GITEX Global 2026

| Source | URL | Status |
|---|---|---|
| Official organizer | https://www.gitex.com/gitex-global-2026 | ✓ Live 200 |

Facts confirmed: dates Dec 7–11 ✓, main expo at Expo City Dubai (Dec 8–11) ✓

**DB corrections needed (owner action required — DB locked this phase):**

| Issue | Current DB | Official source | Correction needed |
|---|---|---|---|
| Summit venue | Implies Expo City Dubai | DWTC (Dec 7) | Body should clarify Summit at DWTC, Expo at Expo City Dubai |
| "First GITEX outside DWTC since 1981" | In body | Partially wrong — Summit still at DWTC | Clarify: main Expo moves outside DWTC, not the whole event |
| 200,000+/6,800+ figures | In meta and body | Not confirmed for 2026 on official page | Add "expected" qualifier or hold until confirmed |

---

## Template changes implemented

### `app/(en)/(public)/events/[slug]/page.tsx`

1. **Venue lookup table** — `VENUE_BY_SLUG` keyed on slug for F1 and GITEX
2. **Organizer lookup table** — `ORGANIZER_BY_SLUG` keyed on slug for F1 and GITEX
3. **`sourceDomain()` helper** — extracts hostname from `sourceUrl`, strips `www.`
4. **JSON-LD enrichment:**
   - Added `location` (Place + PostalAddress) for F1 and GITEX
   - Added `organizer` (Organization) for F1 and GITEX
   - Added `eventAttendanceMode: OfflineEventAttendanceMode` for all events
5. **Source block:** `{sourceDomain(event.sourceUrl)} ↗` instead of "Official source ↗"

### `app/ru/events/[slug]/page.tsx`

Identical changes — EN/RU parity maintained.

---

## JSON-LD before → after

### F1 (before)
```json
{ "@type": "Event", "name": "...", "startDate": "2026-12-03", "endDate": "2026-12-06",
  "eventStatus": "EventScheduled", "url": "..." }
```

### F1 (after)
```json
{ "@type": "Event", "name": "...", "startDate": "2026-12-03", "endDate": "2026-12-06",
  "eventStatus": "EventScheduled", "eventAttendanceMode": "OfflineEventAttendanceMode",
  "url": "...",
  "location": { "@type": "Place", "name": "Yas Marina Circuit",
    "address": { "@type": "PostalAddress", "streetAddress": "Yas Island",
      "addressLocality": "Abu Dhabi", "addressCountry": "AE" } },
  "organizer": { "@type": "Organization", "name": "Abu Dhabi Motorsport Management",
    "url": "https://www.abudhabigp.com/" } }
```

### GITEX (after)
```json
{ "@type": "Event", ..., "eventAttendanceMode": "OfflineEventAttendanceMode",
  "location": { "@type": "Place", "name": "Dubai Exhibition Centre at Expo City Dubai",
    "address": { "streetAddress": "Expo City Dubai", "addressLocality": "Dubai", "addressCountry": "AE" } },
  "organizer": { "@type": "Organization", "name": "Dubai World Trade Centre",
    "url": "https://www.gitex.com/" } }
```

---

## Source block before → after

| Before | After |
|---|---|
| `Official source ↗` | `abudhabigp.com ↗` (F1) |
| `Official source ↗` | `gitex.com ↗` (GITEX) |
| `Официальный источник ↗` | `abudhabigp.com ↗` (RU F1) |
| `Официальный источник ↗` | `gitex.com ↗` (RU GITEX) |

Domain extracted at render time from `event.sourceUrl` — works for all future events.

---

## Build result

`npm run build` — **88/88 pages generated, zero TypeScript errors, zero compilation errors.**

---

## Route QA

| Route | Status |
|---|---|
| `/events/formula-1-abu-dhabi-grand-prix-2026` | 200 ✓ |
| `/ru/events/formula-1-abu-dhabi-grand-prix-2026` | 200 ✓ |
| `/events/gitex-global-2026` | 200 ✓ |
| `/ru/events/gitex-global-2026` | 200 ✓ |
| `/events` | 200 ✓ |
| `/ru/events` | 200 ✓ |
| `/calendar/december-2026-uae-calendar` | 200 ✓ |
| `/ru/calendar/december-2026-uae-calendar` | 200 ✓ |
| `/guides/mainland-company-setup-dubai` | 200 ✓ |
| `/` | 200 ✓ |

---

## Per-page element QA

| Check | F1 EN | F1 RU | GITEX EN | GITEX RU |
|---|---|---|---|---|
| JSON-LD Event block | ✓ | ✓ | ✓ | ✓ |
| `eventAttendanceMode` in JSON-LD | ✓ | ✓ | ✓ | ✓ |
| `location` in JSON-LD | ✓ | ✓ | ✓ | ✓ |
| `organizer` in JSON-LD | ✓ | ✓ | ✓ | ✓ |
| Source domain shows (not "Official source") | `abudhabigp.com` ✓ | `abudhabigp.com` ✓ | `gitex.com` ✓ | `gitex.com` ✓ |
| December calendar link | `/calendar/december-2026-uae-calendar` ✓ | — | `/calendar/december-2026-uae-calendar` ✓ | — |
| Related guide link (GITEX only) | — | — | `/guides/mainland-company-setup-dubai` ✓ | — |

---

## Docs created

| File | Purpose |
|---|---|
| `docs/content-drafts/events/6c-events-ctr-01-f1-gitex-audit.md` | Pre-flight audit — DB content review, template inventory, change plan |
| `docs/content-drafts/events/6c-events-ctr-01-f1-gitex-source-ledger.md` | Official source verification ledger — claim-by-claim comparison |
| `docs/content-drafts/events/6c-events-ctr-01-f1-gitex-report.md` | This file |

---

## Confirmations

- No `git commit` or `git push` run
- No deploy script or PM2 command run
- No admin or AI Inbox route used
- No schema file touched
- No DB row modified (neither local nor production)
- No factual content changed (no dates, fees, venues, performer names modified)
- No EN/RU content field changed
- No sitemap modified
- No unrelated pages or events touched
- EN/RU parity maintained — identical template structure for both locales

---

## GITEX DB correction — recommended next phase

Before deploying, consider a DB patch phase for GITEX:

1. Fix Summit venue claim in `en_body`/`ru_body`
2. Clarify "first GITEX outside DWTC" to "first GITEX Expo outside DWTC"
3. Add "expected" qualifier to 200,000+/6,800+ visitor/company figures

This is separate from the template changes and does not block commit of 6C-EVENTS-CTR-01.

---

## Owner approval needed

**Commit and deploy require explicit owner approval.**

Staged files for this phase:
```
app/(en)/(public)/events/[slug]/page.tsx
app/ru/events/[slug]/page.tsx
docs/content-drafts/events/
```
