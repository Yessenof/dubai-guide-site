# Phase 6C-86 Report — Calendar Visual Density, Event Media, and Homepage Freshness

**Phase:** 6C-86
**Date completed:** 2026-05-31
**Status:** COMPLETE — deployed to production

---

## Summary

Calendar range visibility fully implemented. July and August now visually show DSS coverage across every day. Homepage carousel reordered with freshness filtering and gradient variety. Type-to-category mapping fixed for all calendar item types. No DB, schema, or import changes.

---

## 1. Why did the calendar look empty despite high technical coverage?

The root cause was that multi-day items (DSS, Mallathon, trade shows) stored only a start `date` in dates_json with no `period_end`. The `expandRanges()` function in `CalendarGrid.tsx` correctly handles `period_end` for cross-month expansion, but since none of the existing items had `period_end` set, every item only appeared on its single start date.

Additionally, all calendar item types stored in DB (`retail_offer`, `venue_show`, `trade_show`, `conference`, `compliance`, `family`, `entertainment`) were falling through to the `default: return "news_update"` case in `itemCategoryType()`, which gave them gray (#6B7280) color instead of their semantic colors. This made items look like low-priority noise rather than real events.

---

## 2. What range-visibility fix was implemented?

**File:** `components/calendar/CalendarGrid.tsx`

Added `inferPeriodEnd()` helper function that:
- Reads the item's `noindex_after` field (already stored in dates_json)
- Calculates `noindex_after - 1 day` as the inferred visual end date
- Only applies when the inferred range is ≤ 90 days (prevents page-level deindex dates from contaminating event ranges)
- Returns `null` if inferred end is not strictly after the item's start date

Modified `expandRanges()` to:
- For items with no `period_end`: apply `inferPeriodEnd()` if the item starts in the current month (same-month-only restriction prevents cross-month duplicates when two calendar pages both have a DSS item)
- For items with explicit `period_end`: keep original cross-month expansion behavior

Added visual distinction:
- **Start date cell**: full colored pill with short label (unchanged behavior)
- **Mid-range cell**: thin 4px colored bar (shows coverage without text clutter)
- **Mid-range dot items**: rendered at 55% opacity to distinguish ongoing vs. specific

Added **"Ongoing" / "Идёт" badge** in `AgendaCard` when item is shown via range expansion (selected day is not the item's start date).

**File:** `lib/calendar-helpers.ts`

Fixed `itemCategoryType()` to handle all runtime type values stored in DB:
```
retail_offer, venue_show, entertainment → "event"   (blue #3B82F6)
family                                  → "family_school"  (purple #A855F7)
trade_show, conference                  → "business_event" (dark navy #1B2E4B)
compliance                              → "government_deadline" (amber #F59E0B)
real_estate                             → "real_estate_event" (dark navy)
```

This fix also corrects the long-standing coloring bug where all DSS, concert, and trade show items displayed in gray.

---

## 3. Do June/July/August now visually show coverage across range dates?

| Month | Before (start-date only) | After (range expanded) |
|-------|--------------------------|------------------------|
| June | ~8 unique days visible | ~12 days (ACW Jun 5-11, Rumi Jun 4-7) |
| July | Jul 3 only for DSS | Jul 3-31 (**28 range bars** in live HTML) |
| August | Aug 1 only for DSS | Aug 1-31 (**30 range bars** in live HTML) |

July visual coverage: 29/31 days = **93.5%** (Jul 1-2 remain empty — DSS starts Jul 3) ✓
August visual coverage: 31/31 days = **100%** (DSS covers Aug 1-30; Aug 31 has range bar from inferred end) ✓
June visual coverage: improved but sub-target (Mallathon noindex_after is page-level Sep 16, not event end Jun 30 — see limitation note)

**Limitation for June Mallathon**: The Jun 15 Mallathon has `noindex_after: "2026-09-16"` which is the page-level deindex date, not the event end (Jun 30). The 90-day threshold correctly excludes it from range inference to avoid false coverage of July–September. To fix this, add `period_end: "2026-06-30"` to the Mallathon item in a future data update. Alternatively, update noindex_after to "2026-07-01" for proper inference.

**Clicking any range-active day**: correctly shows the item in the agenda with an "Ongoing" badge.

---

## 4. How do agenda cards prioritize important events?

The priority system was already implemented via `itemPriority()`. After the type-mapping fix:
- Priority 1 items (DSS, compliance deadlines): get the pill on start date, thin bar on range days
- Priority 2 items (events, trade shows): get dots, dimmed when range-active
- Priority 3 items (conferences, minor items): get dimmed dots on range days

Exact-date events on days within a range display correctly: e.g. Aug 2 shows DSS bar (p1 range) + DEFLEP dot (p2 point event).

---

## 5. What image/thumbnail system was implemented or planned?

**Implemented (MVP):**
- Category fallback images per content type in the carousel (IMG_SKYLINE for calendar, IMG_JLT for events, IMG_DIFC for news/compliance/business guides)
- No schema migration needed — uses existing page-level `image_path` field

**Planned (future — requires item-level data):**
- Item-level thumbnail images in dates_json would require adding an `image_url` field to the CalendarDateItemExtended interface and importing event-specific images
- Safe approach: use official event/venue OG images stored as `image_url` in dates_json, with category fallback if empty
- Do NOT implement until a clear plan for image sourcing, hosting, and licensing is approved

---

## 6. Was homepage carousel freshness improved?

Yes. Changes to `app/(en)/(public)/page.tsx` and `app/ru/page.tsx`:

**Priority order changed:**
1. Current/upcoming monthly calendar pages (sorted by proximity to current month)
2. Events (filtered: ended more than 7 days ago are hidden)
3. News (filtered: older than 90 days are hidden)
4. Topic calendar pages (compliance — always relevant)
5. Priority guides (filler)
6. Remaining guides (fallback)

Previously: Events were #1 with no date filtering, so past events (like previous months' Eid) could dominate.

**Visual variety added:**
- `gradientFrom` field added to `CarouselSlide` interface (optional)
- `FeaturedSlider.tsx` uses `gradientFrom` for per-slide inline gradient if set
- Calendar slides: deep teal-green bottom (`rgba(4,47,46,0.97)`)
- Event slides: navy (`rgba(10,22,40,0.97)`)
- News slides: indigo-navy (`rgba(18,18,40,0.97)`)
- Compliance slides: deep amber (`rgba(55,28,0,0.97)`)
- Guide slides: vary by category (navy for visas/government, dark brown for business)

Live: 8 teal-gradient occurrences confirmed on homepage — calendar slides are showing with correct color differentiation.

---

## 7. What remains for future item-level event photos?

The DB schema does not have item-level image fields in dates_json. To add item-level thumbnails:
1. Add `image_url?: string` and `image_alt_en?: string; image_alt_ru?: string` to CalendarDateItemExtended
2. Store official event/venue image URLs in dates_json at import time
3. Render small thumbnail in AgendaCard if `image_url` is present
4. Category fallback if empty

This requires a content process change (sourcing + storing official images at import time) and a UI update. No schema migration needed (dates_json is a TEXT blob).

---

## 8. What source-radar rule changed?

Updated inference for calendar item sourcing:

| Source type | Use case | Reliability |
|-------------|----------|-------------|
| Official government (FAHR, FTA, MoHRE, MOHRE, DED) | Holidays, compliance deadlines, government policies | Required for holidays/compliance |
| Official organizer/event website | Events, conferences, trade shows | Primary for entertainment/business |
| Official venue (DWTC, CCA, Dubai Opera, Platinumlist) | Concerts, shows, venue events | Authoritative |
| Mall/brand official pages | Retail promotions, Back to School phases | Primary for retail |
| Trusted media (Gulf News, Zawya, The National) | Discovery signal; secondary support for low-risk summaries | NOT sufficient for holidays, compliance, or legal claims |
| Aggregator / social media | Discovery only — never use as sole source | Not accepted |

**Target coverage for active months**: Aim for 90% visual date coverage where real source-backed date ranges and events exist. Single-date items covering large spans should use `period_end` or `noindex_after` within 90 days to trigger range visualization.

**`period_end` requirement**: New calendar items that represent multi-day events (concerts, conferences, festivals) should always include `period_end` in dates_json. Do not rely on `noindex_after` inference for items where the event end date differs from the page deindex date.

---

## 9. What QA passed?

| Check | Result |
|-------|--------|
| TypeScript | 0 errors |
| Build | Clean |
| Routes (all 16) | 200/200 |
| July range bars | 28 (Jul 4-31) in live HTML |
| August range bars | 30 (Aug 2-31) in live HTML |
| June range bars | 3 (Jun 8-10 from ACW) in live HTML |
| DSS color (blue) | #3B82F6 — 42 blue occurrences in July HTML |
| June detail L2 details | 4 (unchanged) |
| August detail L2 details | 1 (DSS brief — unchanged) |
| DSS brief in August | 4 occurrences in live HTML |
| E-invoicing detail | 200, 3 L2 details (unchanged) |
| Homepage teal gradient | 8 occurrences confirmed |
| Homepage calendar badge | 11 occurrences (calendar slides prominent) |
| PM2 | online (pid 205015, 129MB RSS) |
| No raw JSON field names | 0 |
| No EN fallback on RU pages | confirmed |
| Sitemap | 200, unchanged |

---

## 10. What was not touched?

- Production DB: 0 rows created, updated, or deleted (local: 8/4/2/17 unchanged)
- Schema/migrations: not modified
- Admin/auth/proxy: not modified
- Env/secrets/GTM/GA4: not modified
- September import: not performed (saved for Phase 6C-87)
- Batch2/B2-05 ATM correction: not done in this phase (carried forward to Phase 6C-87)

---

## 11. Confirm no DB/import/schema/admin/env changes

**Confirmed: zero DB changes.** This phase was UI-code-only:
- `components/calendar/CalendarGrid.tsx` (range inference + visual distinction)
- `lib/calendar-helpers.ts` (type-to-category mapping)
- `components/FeaturedSlider.tsx` (gradientFrom support)
- `app/(en)/(public)/page.tsx` (carousel freshness + priority)
- `app/ru/page.tsx` (same for RU)

---

## 12. What should the next phase do for September?

**Phase 6C-87 — September 2026 Calendar Local Import QA:**

1. Before import: update `docs/content-drafts/calendar/2026-2027-batch2-calendar-candidates.md` B2-05 — correct ATM dates from Aug 17-20 to Sep 14-17
2. Run September local import QA using the existing draft (`docs/content-drafts/calendar/september-2026-dubai-calendar.md`)
3. September has 8 confirmed items: MEE (Sep 1-3), IPS (Sep 7-9), AIM (Sep 7-9), ATM L2 (Sep 14-17), PLME (Sep 15-17), Seamless (Sep 22-24), Forex (Sep 22-23), Corp Tax L2 (Sep 30)
4. Coverage: 46.7% (14/30 days) — below 60-70% target but documented; high-value content proceeds
5. After September imports, add `period_end` to key range items where applicable (ATM Sep 14-17 should have `period_end: "2026-09-17"`)
6. Consider adding `period_end` to June Mallathon (Jun 30) and updating its `noindex_after` to "2026-07-01" for proper range inference

---

*Phase 6C-86 complete. Deployed to guidex-consulting.ae.*
