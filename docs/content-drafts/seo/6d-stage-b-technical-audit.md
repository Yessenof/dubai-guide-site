# Phase 6D Stage B — Full Technical SEO Audit

**Date:** 2026-08-05  
**Auditor:** Claude Sonnet (6D session)  
**Scope:** 92 static pages across all content types (guides, calendar, events, news, hub pages, RU variants)

---

## Summary

| Area | Status | Finding |
|---|---|---|
| html-lang | ✅ Clean | EN="en", RU="ru" — correct in both root layouts |
| Title uniqueness | ✅ Clean | 19 guides, 11 calendar, 7 events, 4 news — all unique |
| Meta description | ✅ Clean | All published records have non-empty summaries |
| JSON-LD — guides | ✅ Clean | BreadcrumbList + Article + HowTo on all guide pages |
| JSON-LD — events | ✅ Clean | Event schema on all event detail pages |
| JSON-LD — news | ✅ Clean | NewsArticle schema on all news detail pages |
| JSON-LD — calendar | ⚠️ GAP | No structured data on calendar detail pages |
| OrgSchema | ✅ Clean | Organization + WebSite schema on all public pages via layout |
| Internal guide links | ✅ Clean | All 19 guide slugs valid; no broken references |
| Orphan pages | ✅ Clean | All static routes reachable via nav / home page / hub pages |
| noindex logic | ✅ Clean | Calendar always indexed; news uses DB flag; events always indexed |
| related-guides.ts slugs | ❌ DEFECT → FIXED | 4 stale keys/values; corrected in this session |
| Sitemap coverage | ✅ Clean | All published content included (guides, calendar, events, news) |
| Sitemap lastModified | ⚠️ GAP | Static SITE_BUILD = 2026-07-19; per-record updated_at not used |

---

## Defects Found and Fixed

### D1 — related-guides.ts stale slugs (FIXED)

**File:** `lib/related-guides.ts`  
**Lines (before fix):** 13–32  
**Impact:** The 4 dependent visa guide detail pages (spouse-inside, spouse-outside, child-inside, child-outside) silently showed no related guides because:
  1. The keys in RELATED_GUIDES used old short slugs (`"spouse-dependent-dubai-inside"`, etc.) that don't match any published guide slug.
  2. The values also referenced those same stale slugs.

**Root cause:** Slug names were lengthened (adding `-visa` and `-country` suffixes) when guides were renamed, but `related-guides.ts` was not updated.

**Fix applied:** All 4 entries updated to use correct full slugs:
  - `"spouse-dependent-visa-dubai-inside-country"` ↔ `"spouse-dependent-visa-dubai-outside-country"`
  - `"child-dependent-visa-dubai-inside-country"` ↔ `"child-dependent-visa-dubai-outside-country"`

**Build verify:** 92/92 pages, 0 TS errors after fix.

---

## Gaps (not defects — design decisions or Stage E work)

### G1 — Calendar detail pages: no JSON-LD structured data

**Files:** `app/(en)/(public)/calendar/[slug]/page.tsx`, `app/ru/calendar/[slug]/page.tsx`  
**Observation:** All other content types (guides, events, news) emit JSON-LD. Calendar pages emit only OrgSchema (via layout) and no page-specific schema.  
**Risk:** Low — Google can still index and understand the page content. But no eligibility for rich results.  
**Recommended fix (Stage E):** Add a `WebPage` + `ItemList` schema to calendar pages, with each calendar item that has `cta_type=ticket` represented as an `Event` within the list.  
**Priority:** Medium.

### G2 — Sitemap lastModified: static SITE_BUILD, not per-record

**File:** `app/sitemap.ts`  
**Current:** `lastModified: SITE_BUILD` where `SITE_BUILD = new Date("2026-07-19")` for all 92 entries.  
**Issue:** Adding new calendar items (Phase 6D) doesn't update sitemap lastmod. Google can't tell which pages were recently updated.  
**Recommended fix (Stage E):** Extend `reader.ts` to return `updated_at` from the DB for guides; extend `news-events-calendar.ts` for calendar/events/news. Update `sitemap.ts` to use per-record dates.  
**Priority:** Medium.

---

## Coverage by content type

### Guides (19 published)
- All unique titles and summaries ✓
- All have BreadcrumbList + Article + HowTo JSON-LD ✓
- All linked from /guides hub page ✓
- Related guides: 4 entries were broken (fixed this session) ✓

### Calendar pages (11 published)
- All unique titles ✓
- All have non-empty title and meta ✓
- No JSON-LD (Gap G1) ⚠️
- All linked from /calendar hub page ✓

### Events (7 published)
- All unique titles ✓
- All have Event JSON-LD ✓
- All linked from /events hub page + home page feed ✓

### News posts (4 published)
- All unique titles ✓
- All have NewsArticle JSON-LD ✓
- All linked from /news hub page + home page feed ✓

### Hub pages and static routes
- All accessible from Header nav or home page service cards ✓
- /about, /contact linked from Footer ✓
- /visas/family, /visas/golden linked from /visas hub ✓

---

## Next steps (Stage E)

1. Add JSON-LD to calendar detail pages (Gap G1)
2. Implement per-record sitemap lastmod (Gap G2)
3. Validate existing Event JSON-LD structure for rich result eligibility
4. Internal linking: verify hub-to-guide cross-links are complete
