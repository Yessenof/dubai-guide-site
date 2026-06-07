# High-Value Event Calendar Linkage Plan
## Phase 6C-97D | Date: 2026-06-06

This document defines how the new GITEX Global 2026 and F1 Abu Dhabi Grand Prix 2026 detail pages
connect to the existing calendar system.

---

## 1. Current calendar item status

### GITEX-related calendar items (December 2026)

From the December 2026 UAE Calendar page (`december-2026-uae-calendar`), the existing imported items include:

| Calendar ID | Label | Date | detail_url (current) |
|-------------|-------|------|---------------------|
| DEC-03-GITEX | GITEX Global (or similar) | Dec 8-11 | null |

**Action needed:** Update `detail_url` field on the GITEX calendar item(s) to `/events/gitex-global-2026` once the event page is live.

### F1-related calendar items (December 2026)

| Calendar ID | Label | Date | detail_url (current) |
|-------------|-------|------|---------------------|
| DEC-03-F1 | F1 Abu Dhabi GP (or similar) | Dec 3-6 | null |
| DEC-NEW-01 | F1 Concert Night 1 (Lewis Capaldi + Zara Larsson) | Dec 3 | null |
| DEC-R1 | Imagine Dragons (Yasalam) | Dec 5 | null |

**Action needed:** Update `detail_url` on all three items to `/events/formula-1-abu-dhabi-grand-prix-2026` once the event page is live.

---

## 2. detail_url plan

### GITEX Global 2026

| Item | EN detail_url | RU detail_url |
|------|--------------|--------------|
| GITEX calendar item(s) | /events/gitex-global-2026 | /ru/events/gitex-global-2026 |
| Source: gitex.com/gitex-global-2026 | external CTA | external CTA |

The calendar item label shows "GITEX Global" or "GITEX Summit". When a user taps/clicks, they go to the Guidex detail page (`/events/gitex-global-2026`), which has the full planning content and an external CTA to gitex.com.

### Formula 1 Abu Dhabi Grand Prix 2026

| Item | EN detail_url | RU detail_url |
|------|--------------|--------------|
| F1 Abu Dhabi GP calendar item | /events/formula-1-abu-dhabi-grand-prix-2026 | /ru/events/formula-1-abu-dhabi-grand-prix-2026 |
| F1 Concert Night 1 (DEC-NEW-01) | /events/formula-1-abu-dhabi-grand-prix-2026 | /ru/events/formula-1-abu-dhabi-grand-prix-2026 |
| Imagine Dragons (DEC-R1) | /events/formula-1-abu-dhabi-grand-prix-2026 | /ru/events/formula-1-abu-dhabi-grand-prix-2026 |
| Source: abudhabigp.com | external CTA | external CTA |

The F1 concert items (DEC-NEW-01, DEC-R1) should link to the F1 detail page rather than staying calendar-only. The detail page explains the full Yasalam context that the calendar items cannot show in a brief.

---

## 3. source_url vs detail_url logic

| Field | Where it points | Used for |
|-------|----------------|----------|
| `source_url` (calendar item) | Official external source (gitex.com, abudhabigp.com) | Source attribution, CTA button |
| `cta_url` (calendar item) | Official external ticket/info page | External CTA button |
| `detail_url` (calendar item) | Guidex internal event page (/events/[slug]) | "More info" link within calendar UI |

**Rule:** Calendar items have both a `cta_url` (external) and a `detail_url` (internal Guidex page). When `detail_url` is set, the calendar UI should show an internal "read more" link in addition to the external CTA.

The current calendar items were imported with `detail_url: null`. The update script for Phase 6C-97E (or a targeted DB update) should set `detail_url` on each affected calendar item once the event pages are published.

---

## 4. F1 concert items: link to F1 page or stay calendar-only?

**Decision: Link to F1 detail page.**

DEC-NEW-01 (Lewis Capaldi + Zara Larsson, Dec 3) and DEC-R1 (Imagine Dragons, Dec 5) are Yasalam concerts that are part of the F1 Abu Dhabi GP weekend. They are NOT standalone events -- they are sub-events within the F1 GP event window.

Linking both concert items to `/events/formula-1-abu-dhabi-grand-prix-2026` is correct because:
1. The detail page explains the full Yasalam context (what Yasalam is, how access works, what other concerts are happening)
2. Users who click "more" on a concert item benefit from seeing the race/GP context
3. The GP detail page already includes the confirmed Yasalam lineup

If a user only sees the Dec 3 Lewis Capaldi calendar item, linking them to the F1 detail page gives them the full picture (tickets, access, GP weekend context).

---

## 5. Sitemap and index recommendations

| Page | noindex value | Rationale |
|------|--------------|-----------|
| /events/gitex-global-2026 | 0 (index) | Primary SEO target, high-volume search query |
| /ru/events/gitex-global-2026 | 0 (index) | RU SEO target |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 0 (index) | Primary SEO target, high-volume search query |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 0 (index) | RU SEO target |

Both pages should be included in sitemap.xml at publication. Both should remain indexed after the event as historical reference pages.

---

## 6. Homepage carousel recommendation

Neither GITEX nor the F1 Abu Dhabi GP should be featured on the homepage carousel before the events are closer (September–November 2026 is the appropriate window).

| Page | Recommended carousel timing | featured_homepage value |
|------|----------------------------|------------------------|
| GITEX Global 2026 | October–November 2026 (search peak) | 0 now, update to 1 in Oct 2026 |
| F1 Abu Dhabi GP 2026 | September–November 2026 (search peak) | 0 now, update to 1 in Sep 2026 |

---

## 7. Internal linking plan

### Pages that should link TO the GITEX detail page

| Source page | Link type | Notes |
|------------|-----------|-------|
| December 2026 UAE Calendar | detail_url on GITEX calendar item | Requires calendar item update |
| UAE company setup guide | Contextual "events" mention | "GITEX Global is when major deals happen" |
| Homepage (in season) | Carousel feature | From October 2026 |

### Pages that should link TO the F1 detail page

| Source page | Link type | Notes |
|------------|-----------|-------|
| December 2026 UAE Calendar | detail_url on F1, DEC-NEW-01, DEC-R1 items | Requires calendar item updates |
| GITEX detail page | Cross-event mention | "F1 Abu Dhabi GP ends Dec 6, GITEX begins Dec 7" |
| Homepage (in season) | Carousel feature | From September 2026 |

### Cross-linking between GITEX and F1 pages

Both pages should cross-link to each other in the "Related Guidex topics" section, since the two events form the most valuable combined trip window in the UAE calendar (Dec 3–11).

---

## 8. Implementation order for next phase (6C-97E)

After owner approval of these drafts, the import and linkage should proceed in this order:

1. Import GITEX EN+RU event page into `events` table (status=draft first, then publish after QA)
2. Import F1 EN+RU event page into `events` table (status=draft first, then publish after QA)
3. Build to generate static event pages (/events/gitex-global-2026 and /events/formula-1-abu-dhabi-grand-prix-2026)
4. Update `detail_url` on calendar items:
   - GITEX calendar items -> /events/gitex-global-2026
   - DEC-03-F1, DEC-NEW-01, DEC-R1 -> /events/formula-1-abu-dhabi-grand-prix-2026
5. Publish both events (update status to published)
6. Deploy (zero-downtime script)
7. Verify live QA: all event routes 200, content correct, calendar links functional
