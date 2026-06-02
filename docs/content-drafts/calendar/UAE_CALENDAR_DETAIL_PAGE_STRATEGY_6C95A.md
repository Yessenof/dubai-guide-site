# UAE Calendar Detail Page Strategy
## Phase 6C-95A | Date: 2026-06-01

---

## Classification framework

### Class 1 — Internal detail page REQUIRED

Criteria: major annual event, strong SEO signal, business/property/tourism relevance, recurring, UAE residents/investors need guidance around it.

| Event | Slug | Rationale |
|-------|------|-----------|
| GITEX Global 2026 | /events/gitex-global-2026 | World's largest tech show, now at new venue; strong UAE business + startup + investment signal; recurring annual anchor |
| F1 Abu Dhabi Grand Prix 2026 | /events/f1-abu-dhabi-grand-prix-2026 | Season finale, international tourism anchor, Abu Dhabi + UAE calendar date |
| UAE National Day 2026 | (existing holiday guide or calendar page) | Annual, business impact (closures, long weekend), confirmed government date |
| Dubai Summer Surprises 2026 | /events/dubai-summer-surprises-2026 | 2-month citywide event, retail + family planning relevance, Visit Dubai official |
| Dubai Shopping Festival 2026-27 | /events/dubai-shopping-festival-2026 | Annual anchor, business/retail/tourism, confirmed when dates released |
| WETEX 2026 | optional | If expanded to full brief — construction/sustainability sector relevance |

**Recommended Class 1 detail pages to build in Phase 6C-95B:**
1. `/events/gitex-global-2026` — priority HIGH
2. `/events/f1-abu-dhabi-grand-prix-2026` — priority HIGH
3. `/events/dubai-summer-surprises-2026` — priority MEDIUM (before July)

---

### Class 2 — Calendar-only (no detail page)

Criteria: one-off or lower-SEO-value events, short-lived, no substantive guidance needed, concert/entertainment.

| Event | Reason |
|-------|--------|
| Christina Aguilera — Etihad Arena Sep 25 | Concert — calendar item + CTA to ticketing only |
| Paul Oakenfold — The Agenda Sep 18 | Concert — calendar item only |
| This Is Michael — Etihad Arena Aug 22 | Tribute show — calendar item only |
| Richard Marx — Coca-Cola Arena Oct 5 | Concert — calendar item only |
| Sharjah International Book Fair Nov 4-15 | Cultural fair — calendar item, emirate = Sharjah |
| Back to School Aug 31 | School date — calendar item |
| School mid-term break Oct 12-18 | School date — calendar item |
| School winter break Dec 14 | School date — calendar item |
| UAE Commemoration Day Dec 1 | Holiday — existing holiday guide or calendar item |
| The Corrs — Etihad Arena (TBC) | Concert — calendar item when date confirmed |

---

### Class 3 — Noindex / expiry required

Criteria: time-limited offers, ticket promotions, discount deals, temporary activations.

| Type | Policy |
|------|--------|
| DSS shopping deals | `noindex_after` = last day of DSS + 1 (2026-08-31) |
| DSF shopping deals | `noindex_after` = last day of DSF + 1 |
| Concert ticket promotions | `noindex_after` = event date + 1 |
| Restaurant/hotel offers | `noindex_after` = offer end date + 1 |
| Raffle promotions (DSS, DSF) | `noindex_after` = raffle close date + 1 |

---

## Phase 6C-95B page creation plan

**Step 1:** Create December 2026 calendar page
- Slug: `december-2026-dubai-calendar`
- Source script: `scripts/import-december-2026-local-6c95b.ts`
- Items: Commemoration Day, National Day, F1, GITEX, school winter break

**Step 2:** Create event detail pages (in order):
1. `dubai-summer-surprises-2026` — needed before July import
2. `gitex-global-2026` — needed for December calendar item
3. `f1-abu-dhabi-grand-prix-2026` — needed for December calendar item

**Step 3:** Add calendar items to existing monthly pages (update dates_json):
- July 2026: DSS launch item (may already exist, verify)
- August 2026: Back to School (Aug 31), This Is Michael concert
- September 2026: Corp tax deadline (already exists), Christina Aguilera, Paul Oakenfold
- October 2026: Mid-term break, schools reopen, Richard Marx
- November 2026: Sharjah Book Fair

**Step 4:** QA all new routes
**Step 5:** Production import approval (Phase 6C-95C or 6C-95D)

---

## Anti-patterns to avoid

- Do NOT create detail pages for every concert (50+ pages = low-value thin content)
- Do NOT import vague "season" items without dates (e.g. "summer offers at Mall X")
- Do NOT import items without at least MULTI_SOURCE_CONFIRMED status for entertainment events
- Do NOT import Abu Dhabi events without clearly labelling emirate = "Abu Dhabi" in dates_json
