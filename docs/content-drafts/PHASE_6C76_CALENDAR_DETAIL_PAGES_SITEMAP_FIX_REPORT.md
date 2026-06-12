# Phase 6C-76 — Calendar Detail Pages Sitemap Fix Report

**Date:** 2026-05-27
**Phase:** 6C-76
**Type:** Code fix and deploy

---

## 1. Problem

All published `calendar_pages` records were missing from `/sitemap.xml`. This was a pre-existing gap discovered in Phase 6C-75: none of the 5 published calendar pages (may-2026-uae-calendar, uae-emiratisation-june-30-2026-reminder, uae-long-weekends-2026-2027, uae-e-invoicing-2026-asp-deadline, june-2026-dubai-calendar) appeared in the sitemap before this fix.

The sitemap already used `getPublishedCalendarPages` pattern's analogues for guides (`getAllPublishedGuides`, `getRuPublishedGuidesSlugs`). Calendar pages needed the same treatment.

---

## 2. Files Changed

| File | Change |
|------|--------|
| `app/sitemap.ts` | Added `getPublishedCalendarPages` import and calendar detail URL generation |

No other files modified.

---

## 3. Change Summary

**Import added:**
```ts
import { getPublishedCalendarPages } from "@/lib/db/news-events-calendar";
```

**Logic added inside `sitemap()`:**
```ts
const enCalendarSlugs = getPublishedCalendarPages("en").map((p) => p.slug);
const ruCalendarSlugs = getPublishedCalendarPages("ru").map((p) => p.slug);

const enCalendarEntries = enCalendarSlugs.map((slug) => ({
  url:             `${BASE_URL}/calendar/${slug}`,
  lastModified:    new Date(),
  changeFrequency: "weekly" as const,
  priority:        0.7,
}));

const ruCalendarEntries = ruCalendarSlugs.map((slug) => ({
  url:             `${BASE_URL}/ru/calendar/${slug}`,
  lastModified:    new Date(),
  changeFrequency: "weekly" as const,
  priority:        0.7,
}));
```

**Return array updated:** `enCalendarEntries` and `ruCalendarEntries` added after their guide counterparts.

**Pattern:** Follows the exact same DB-driven pattern as guide entries. `getPublishedCalendarPages("ru")` already filters for `ruPublished=1` and non-empty `ruTitle`, so RU URLs are only included for pages that have live Russian content.

`changeFrequency: "weekly"` chosen (vs `"monthly"` for guides) because calendar pages receive periodic enrichment as events approach.

---

## 4. Local Validation

### 4.1 TypeScript
`npx tsc --noEmit` — 0 errors.

### 4.2 Local Sitemap Check

| Metric | Before | After |
|--------|--------|-------|
| Total sitemap URLs | 54 | 64 |
| Calendar detail URLs | 0 | 10 |
| Duplicates | 0 | 0 |

**Calendar URLs added (10):**
```
/calendar/june-2026-dubai-calendar
/calendar/may-2026-uae-calendar
/calendar/uae-e-invoicing-2026-asp-deadline
/calendar/uae-emiratisation-june-30-2026-reminder
/calendar/uae-long-weekends-2026-2027
/ru/calendar/june-2026-dubai-calendar
/ru/calendar/may-2026-uae-calendar
/ru/calendar/uae-e-invoicing-2026-asp-deadline
/ru/calendar/uae-emiratisation-june-30-2026-reminder
/ru/calendar/uae-long-weekends-2026-2027
```

**Preserved:**
- Life Setup: `/life-setup` and `/ru/life-setup` present
- All 13 static EN hub entries intact
- All RU static entries intact
- Guide entries unchanged

### 4.3 Local Route QA (10 routes — all 200)

| Route | Status |
|-------|--------|
| / | 200 |
| /ru | 200 |
| /sitemap.xml | 200 |
| /calendar/june-2026-dubai-calendar | 200 |
| /ru/calendar/june-2026-dubai-calendar | 200 |
| /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /calendar/may-2026-uae-calendar | 200 |
| /calendar/uae-long-weekends-2026-2027 | 200 |
| /calendar/uae-emiratisation-june-30-2026-reminder | 200 |

---

## 5. Commit

| Field | Value |
|-------|-------|
| Commit hash | `c3f2d5c` |
| Files staged | `app/sitemap.ts`, `docs/content-drafts/PHASE_6C75_JUNE_2026_CALENDAR_PRODUCTION_IMPORT_REPORT.md`, `docs/content-drafts/PHASE_6C76_CALENDAR_DETAIL_PAGES_SITEMAP_FIX_REPORT.md` |
| Message | `fix: add calendar detail pages to sitemap` |

---

## 6. Push and Deploy

| Step | Result |
|------|--------|
| git push origin main | `925867a..c3f2d5c` pushed |
| Server: git pull | Fast-forward to c3f2d5c — clean |
| pm2 stop | OK — stopped before build |
| npm run build | Exit 0 — clean |
| pm2 start | Online — pid 172509 |

---

## 7. Live Production QA

### 7.1 Live Sitemap

| Metric | Result |
|--------|--------|
| Total sitemap URLs | 64 |
| Calendar detail URLs | 10 |
| Duplicates | 0 |
| Life Setup URLs present | Yes (/life-setup + /ru/life-setup) |

**All 10 calendar detail URLs confirmed in live sitemap.xml:**
```
/calendar/june-2026-dubai-calendar
/calendar/may-2026-uae-calendar
/calendar/uae-e-invoicing-2026-asp-deadline
/calendar/uae-emiratisation-june-30-2026-reminder
/calendar/uae-long-weekends-2026-2027
/ru/calendar/june-2026-dubai-calendar
/ru/calendar/may-2026-uae-calendar
/ru/calendar/uae-e-invoicing-2026-asp-deadline
/ru/calendar/uae-emiratisation-june-30-2026-reminder
/ru/calendar/uae-long-weekends-2026-2027
```

### 7.2 Route QA

| Route | Status |
|-------|--------|
| /sitemap.xml | 200 |
| / | 200 |
| /ru | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| /calendar/june-2026-dubai-calendar | 200 |
| /ru/calendar/june-2026-dubai-calendar | 200 |

### 7.3 CSS Asset

| Check | Result |
|-------|--------|
| CSS file | `/_next/static/chunks/0ac1tmhoyyo1o.css` |
| HTTP status | 200 |
| Content-Type | `text/css; charset=UTF-8` |
| Unstyled page issue | None |

### 7.4 PM2 Status

Online — pid 172509, no restart needed.

---

## 8. What Was Not Touched

- DB: not touched
- Production DB: not touched
- Schema / migrations: not modified
- env / secrets / GTM / GA4: not touched
- Admin / auth / proxy: not modified
- Page rendering: not modified
- Robots / noindex directives: not modified
- No import / publish: zero records created or modified
- No unsupported claims added

---

## 9. GSC Next Actions

1. Google will discover the calendar pages automatically via the updated sitemap on next crawl
2. Manual URL inspection in GSC for `/calendar/june-2026-dubai-calendar` and `/ru/calendar/june-2026-dubai-calendar` to accelerate indexing
3. Monitor GSC coverage report in 3-7 days — expect all 5 EN + 5 RU calendar pages to appear as "Discovered" or "Indexed"
4. Future: any new published calendar page will be included automatically (DB-driven, no code change needed)
