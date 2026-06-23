# 6C-EVENTS-SCHEMA-01 — Event Rich Result Recommended Fields Audit

Phase: 6C-EVENTS-SCHEMA-01
Date: 2026-06-22
Method: Code review + dev server HTML inspection

---

## Files Audited

- `app/(en)/(public)/events/[slug]/page.tsx` — EN event page + JSON-LD
- `app/ru/events/[slug]/page.tsx` — RU event page + JSON-LD
- `components/detail/DetailHero.tsx` — `categoryImage()` function
- `public/images/hubs/` — available static image assets

---

## Current JSON-LD Fields (all three events, EN + RU)

| Field | Present | Value |
|---|---|---|
| @context | ✓ | https://schema.org |
| @type | ✓ | Event |
| name | ✓ | from seoTitle or title |
| description | ✓ | from metaDescription or summary |
| startDate | ✓ | eventDateStart |
| endDate | ✓ | eventDateEnd (if multi-day) |
| eventStatus | ✓ | EventScheduled |
| eventAttendanceMode | ✓ | OfflineEventAttendanceMode |
| url | ✓ | absolute URL to event page |
| location | ✓ | Place + PostalAddress (per-slug map) |
| organizer | ✓ | Organization + url (per-slug map) |
| **image** | **✗ MISSING** | — |
| **performer** | **✗ MISSING** | — |

---

## Missing Recommended Fields (GSC warnings)

Both `image` and `performer` are Google-recommended but not required for Event rich results.
Missing them triggers GSC "recommended field" warnings, not errors.

---

## Available Image Assets

All images are in `public/images/hubs/` — served at `/images/hubs/[filename]`.
They are publicly crawlable (no auth, no CDN restriction, no noindex on images).

| File | Dimensions | Ratio | Size | Orientation |
|---|---|---|---|---|
| `dubai-skyline-downtown.webp` | 960×1200px | 0.80:1 | 122KB | Portrait |
| `difc-business-bay-glass-towers.webp` | 1440×960px | 1.50:1 | 130KB | Landscape |
| `jlt-dubai-towers-sunset-reflection.webp` | 1440×970px | 1.48:1 | 140KB | Landscape |

Google Event rich result image guidance:
- Minimum width: 720px — all images meet this
- Recommended ratio: 1.9:1 (landscape) — none meet this exactly, but Google accepts other ratios
- Portrait images are accepted but may display differently in rich results

---

## Image Assignment per Event (current `categoryImage()` output)

The `categoryImage(event.category)` function maps:
- category `visa` or `living` → `jlt-dubai-towers-sunset-reflection.webp`
- category `company`, `tax`, `banking` → `difc-business-bay-glass-towers.webp`
- everything else → `dubai-skyline-downtown.webp`

| Event | Category | Hero Image Used |
|---|---|---|
| DP World Tour Championship 2026 | sports/entertainment | `dubai-skyline-downtown.webp` |
| GITEX Global 2026 | tech/conference | `dubai-skyline-downtown.webp` |
| Formula 1 Abu Dhabi GP 2026 | sports | `dubai-skyline-downtown.webp` |

All three currently display `dubai-skyline-downtown.webp` as their hero image.

---

## Image Field Decision per Event

### DP World Tour Championship 2026
- Hero image: `dubai-skyline-downtown.webp` (960×1200px, portrait)
- Crawlable: YES — `/images/hubs/dubai-skyline-downtown.webp`
- Event-relevant: Partially — generic UAE context, not golf-course specific
- Misleading: NO — does not misrepresent the event
- Meets width minimum: YES (960px ≥ 720px)
- Absolute URL: `https://guidex-consulting.ae/images/hubs/dubai-skyline-downtown.webp`
- **Decision: ADD `image` field** — page hero matches, crawlable, meets minimum width
- Note: Portrait orientation is suboptimal; Google may display or crop differently

### GITEX Global 2026
- Same image: `dubai-skyline-downtown.webp`
- Same crawlability and width assessment
- **Decision: ADD `image` field** — same rationale

### Formula 1 Abu Dhabi GP 2026
- Same image: `dubai-skyline-downtown.webp`
- Same crawlability and width assessment
- **Decision: ADD `image` field** — same rationale

### Implementation approach
Use dynamic reference to existing `heroImage` variable (already computed from `categoryImage()`):
```
image: `${BASE}${heroImage}`
```
This ties JSON-LD image to actual page hero — stays in sync if category images change.
Applied identically in EN and RU templates.

---

## Performer Field Decision per Event

### DP World Tour Championship 2026
- **Status: BLOCKED**
- Reason: Professional golf tournament. Player field (who competes) changes yearly based on tour standings. No confirmed player list in page data or source ledger.
- Additional concern: Schema.org `performer` (Person/PerformingGroup) is ambiguous for golf — would need `SportsEvent` type with `competitor` property, not `Event` + `performer`.
- Using organizer (DP World Tour) as performer would be incorrect — organizer ≠ performer.
- **Action: Do not add performer.**

### GITEX Global 2026
- **Status: NOT APPLICABLE**
- Reason: GITEX is a trade expo / technology conference. It has thousands of exhibitors and speakers, but no single "performer". The `performer` schema field is for concerts, shows, theatrical performances, sports competitors. A trade show does not have a performer in the schema.org sense.
- Adding a random speaker as `performer` would misrepresent the event type.
- **Action: Do not add performer.**

### Formula 1 Abu Dhabi Grand Prix 2026
- **Status: BLOCKED — needs separate event model**
- Race: F1 drivers are "competitors" not "performers" — correct schema would be `SportsEvent` with `competitor`, not `Event` + `performer`.
- Yasalam concerts: separate ticketed entertainment events running alongside the race weekend. Adding concert performers to the F1 race Event JSON-LD would conflate two distinct events.
- **Action: Do not add performer. Yasalam performers would need their own separate Event entries, which are not in the current page model.**

---

## Risk Assessment per Change

| Change | Risk |
|---|---|
| Add `image` field to EN event template | Low — 1 line added to eventSchema object |
| Add `image` field to RU event template | Low — identical 1 line |
| Portrait image ratio | Low — Google accepts, may display differently |
| Not adding `performer` | No risk — leaves existing warning in GSC, correct decision |

---

## Expected GSC outcome after deploy

- `image` warning: RESOLVED for all three events (EN + RU)
- `performer` warning: REMAINS — this is intentional and correct
  - GSC will still show "recommended field missing: performer" for DP World Tour
  - This is the right call: no official performer data, no performer to add

---

## Proposed Code Change

**EN template** (`app/(en)/(public)/events/[slug]/page.tsx`):
Add `image: \`${BASE}${heroImage}\`` to `eventSchema` object after `description`.

**RU template** (`app/ru/events/[slug]/page.tsx`):
Identical change — same `heroImage` variable already computed.

No other changes needed.
