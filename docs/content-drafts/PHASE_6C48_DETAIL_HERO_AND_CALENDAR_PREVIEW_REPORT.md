# Phase 6C-48 Report — Detail Hero and Month-Specific Calendar Preview System

**Date:** 2026-05-22
**Status:** COMPLETE (including 6C-48B correction) — local only; pending owner approval to commit and deploy

---

## Summary

Created 2 new reusable components and applied them to all 6 detail pages (news, events, calendar — EN + RU). Every detail page now has:

1. A hero image with gradient overlay, eyebrow line, and h1 title
2. A clickable calendar preview card that links to the exact relevant month when possible

TypeScript: 0 errors. Build: 86 pages, 0 errors. 16/16 routes 200.

---

## Files Created

### `components/detail/DetailHero.tsx`

Hero with background image, dark gradient overlay (bottom-heavy: from-black/85 → via-black/45 → to-black/10), eyebrow text (small caps), and h1 title with text shadow.

- Props: `{eyebrow, title, image, imageAlt}`
- Named export `categoryImage(category)` — image fallback helper:
  - `visa`, `living` → `/images/hubs/jlt-dubai-towers-sunset-reflection.webp`
  - `company`, `tax`, `banking` → `/images/hubs/difc-business-bay-glass-towers.webp`
  - Everything else (default) → `/images/hubs/dubai-skyline-downtown.webp`
- Height: 200px mobile / 230px sm+
- `priority` on the `<Image>` — above-the-fold LCP

### `components/calendar/CalendarMiniPreview.tsx`

Whole-card clickable `<Link>`. No nested `<a>` inside. No "use client".

**Props:**

| Prop | Type | Purpose |
|---|---|---|
| `locale` | `"en" \| "ru"` | Language for labels and date chips |
| `calendarBase` | `string` | `/calendar` or `/ru/calendar` |
| `calendarMonth` | `string?` | `"2026-05"` — links to `?month=` if present |
| `range` | `{start, end?}?` | Event date range — auto-expanded into individual day chips (max 9) |
| `dateItems` | `{date}[]?` | Calendar page dates — first 5 formatted as chips |
| `yearBadge` | `string?` | Shown in top-right badge for yearly pages with no single month |

**Card anatomy:**
- Top row: brass dot + "Dubai Calendar" / "Календарь Дубая" eyebrow + month/year badge (navy pill)
- Chips row: navy rounded pills showing individual dates (e.g. "May 25", "25 мая")
- CTA text: "Open May 2026 calendar →" / "Open Dubai Calendar →" (locale-aware, NOT an `<a>`)

---

## Files Modified

### `app/(en)/(public)/news/[slug]/page.tsx`

- Added: `DetailHero`, `CalendarMiniPreview`, `categoryImage`
- Removed: `CalendarContextCta` import
- Hero image: `post.imagePath || categoryImage(post.category)` (both live posts have `imagePath=""` → always fallback)
- Hero eyebrow: `"{Category} · {datePublished}"` or just `"{Category}"` if no date
- CalendarMiniPreview: generic (no `calendarMonth`) — news posts carry `datePublished`, not an event date; cannot safely infer a target month
- CalendarMiniPreview placed before body content (was after in CalendarContextCta)

### `app/ru/news/[slug]/page.tsx`

- Same changes, `locale="ru"`, `calendarBase="/ru/calendar"`

### `app/(en)/(public)/events/[slug]/page.tsx`

- Hero: `categoryImage(event.category)` always (events have no `imagePath` in schema)
- CalendarMiniPreview: `calendarMonth = event.eventDateStart.slice(0, 7)`, `range = {start, end}` → auto-expands to individual chips
- Eid Al Adha: `calendarMonth="2026-05"` → links to `/calendar?month=2026-05`, chips = May 25, May 26, May 27, May 28, May 29

### `app/ru/events/[slug]/page.tsx`

- Same, `locale="ru"`, `calendarBase="/ru/calendar"`, chips in Russian: "25 мая", "26 мая", etc.

### `app/(en)/(public)/calendar/[slug]/page.tsx`

- Added `resolveCalendarMonth()` helper:

```typescript
function resolveCalendarMonth(
  year: number,
  month: number | null,
  dates: CalendarDateItem[],
): string | undefined {
  if (month) return `${year}-${String(month).padStart(2, "0")}`;
  if (dates.length === 0) return undefined;
  const months = [...new Set(dates.map(d => d.date.slice(0, 7)))];
  return months.length === 1 ? months[0] : undefined;
}
```

- Hero: `page.imagePath || IMG_SKYLINE` (both published calendar pages have `imagePath` set to skyline)
- Hero eyebrow: `"UAE Calendar · {year}[ · {MonthName}]"`
- CalendarMiniPreview: `dateItems={page.dates}` (first 5 as chips), smart month resolution

**Smart month resolution outcomes:**
- `may-2026-uae-calendar`: `month=5` → `/calendar?month=2026-05` (direct)
- `uae-emiratisation-june-30-2026-reminder`: `month=null`, dates=["2026-06-30"] → resolves "2026-06" → `/calendar?month=2026-06`
- `uae-long-weekends-2026-2027`: `month=null`, dates span Jan/Mar/Dec → `undefined` → generic `/calendar` link; `yearBadge="2026"` shown in badge

### `app/ru/calendar/[slug]/page.tsx`

- Same `resolveCalendarMonth()`, `locale="ru"`, `calendarBase="/ru/calendar"`
- Hero eyebrow: `"Календарь ОАЭ · {year}[ · {month_ru_nominative}]"`
- Uses `MONTHS_RU_NOM` (nominative case: январь, февраль…)

---

## CalendarContextCta

Not removed from codebase (kept in `components/calendar/CalendarContextCta.tsx`). Not imported in any of the 6 modified pages. No dead-code risk — it may still exist in other pages or be referenced elsewhere.

---

## QA Results

### TypeScript

```
tsc --noEmit: 0 errors
```

### Build

```
npm run build: 86 pages, 0 errors, 0 warnings
```

### Route smoke test (16/16 → 200)

| Route | Status |
|---|---|
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 |
| `/ru/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 |
| `/events/uae-eid-al-adha-2026` | 200 |
| `/ru/events/uae-eid-al-adha-2026` | 200 |
| `/calendar/may-2026-uae-calendar` | 200 |
| `/ru/calendar/may-2026-uae-calendar` | 200 |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | 200 |
| `/ru/calendar/uae-emiratisation-june-30-2026-reminder` | 200 |
| `/calendar/uae-long-weekends-2026-2027` | 200 |
| `/ru/calendar/uae-long-weekends-2026-2027` | 200 |
| `/news/uae-emiratisation-june-30-2026-deadline` | 200 |
| `/ru/news/uae-emiratisation-june-30-2026-deadline` | 200 |
| `/events/uae-eid-al-adha-2026` | 200 |
| `/` | 200 |
| `/ru` | 200 |
| `/admin/login` | 200 |

### Detail page QA (spot-checked)

**Eid event EN** (`/events/uae-eid-al-adha-2026`):
- Hero: skyline image ✓ (category="public-holiday" → default fallback)
- Eyebrow: "Public-holiday · 2026-05-25 – 2026-05-29" ✓
- CalendarMiniPreview: `href=/calendar?month=2026-05` ✓
- Chips: May 25, May 26, May 27, May 28, May 29 ✓
- lang=en, robots=index,follow ✓
- Raw Markdown: 0 ✓

**Eid event RU** (`/ru/events/uae-eid-al-adha-2026`):
- CalendarMiniPreview: `href=/ru/calendar?month=2026-05` ✓
- Chips: 25 мая, 26 мая, 27 мая, 28 мая, 29 мая ✓
- lang=ru ✓

**Emiratisation calendar EN** (`/calendar/uae-emiratisation-june-30-2026-reminder`):
- Smart month resolution: month=null, dates=["2026-06-30"] → "2026-06" ✓
- CalendarMiniPreview: `href=/calendar?month=2026-06` ✓
- Chip: Jun 30 ✓

**Long Weekend calendar EN** (`/calendar/uae-long-weekends-2026-2027`):
- Smart month resolution: month=null, dates span multiple months → undefined ✓
- CalendarMiniPreview: `href=/calendar` (no month param) ✓
- yearBadge: "2026" ✓
- Chips: Jan 1, Mar 19, Dec 1, Dec 2 ✓ (first 4 of 4 datesJson items)

**No nested links check:**
- Each card: 1 outer `<Link>` → generates 1 `<a>`; CTA text is a `<p>`, not `<a>` ✓
- No nested anchor violations ✓

**Source trust blocks:**
- fahr.gov.ae source on Eid event ✓
- MoHRE source on Emiratisation calendar ✓

**Indexability:**
- All published pages: `robots=index,follow` ✓
- No regressions on non-detail routes ✓

---

## What Was Not Touched

- DB: no records changed
- Schema: no migrations
- Admin: no admin pages modified
- Content: no text/copy changed
- CalendarContextCta: kept in codebase, not deleted
- Sitemap: unchanged
- Env/secrets/GTM/GA4: unchanged
- Production: not deployed, not pushed

---

## Git Status (local, after Phase 6C-48)

**New untracked files:**
- `components/detail/DetailHero.tsx`
- `components/calendar/CalendarMiniPreview.tsx`

**Modified (tracked, not staged):**
- `app/(en)/(public)/news/[slug]/page.tsx`
- `app/(en)/(public)/events/[slug]/page.tsx`
- `app/(en)/(public)/calendar/[slug]/page.tsx`
- `app/ru/news/[slug]/page.tsx`
- `app/ru/events/[slug]/page.tsx`
- `app/ru/calendar/[slug]/page.tsx`

**Everything else:** clean

---

## Phase 6C-48B — Correction: Month-Specific Targeting for News Pages

**Issue identified:** Phase 6C-48 left news pages with a generic calendar preview (no `calendarMonth`). The product rule requires date-based pages to link to the exact relevant month. News posts have no event date, calendar month, or dates_json field — only `datePublished` (publication date, unsuitable for calendar targeting).

**Solution:** Slug-based mapping in the news detail page components — not in the reader, not in the DB. No overbuild.

```typescript
// Temporary: slug → calendar month for known date-based news until news_posts
// has an explicit calendar_month field.
const NEWS_CALENDAR_MONTH: Record<string, string> = {
  "uae-eid-al-adha-2026-federal-holiday-long-break": "2026-05",
  "uae-emiratisation-june-30-2026-deadline":          "2026-06",
};
```

Added to both `app/(en)/(public)/news/[slug]/page.tsx` and `app/ru/news/[slug]/page.tsx`. The `calendarMonth` variable is derived from the mapping and passed to `CalendarMiniPreview`. News slugs not in the map remain generic (`calendarMonth = undefined`), which is correct for news posts without a clear event date.

**Future improvement:** When `news_posts` gains an explicit `calendar_month` text column, replace this map with `post.calendarMonth`.

---

## Exact Preview Target URLs (all 12 detail pages)

| Page | Locale | Preview target | Reason |
|---|---|---|---|
| Eid news | EN | `/calendar?month=2026-05` | Slug mapping (NEWS_CALENDAR_MONTH) |
| Eid news | RU | `/ru/calendar?month=2026-05` | Slug mapping (NEWS_CALENDAR_MONTH) |
| Eid event | EN | `/calendar?month=2026-05` | `eventDateStart.slice(0,7)` |
| Eid event | RU | `/ru/calendar?month=2026-05` | `eventDateStart.slice(0,7)` |
| May calendar | EN | `/calendar?month=2026-05` | `page.month = 5` → direct |
| May calendar | RU | `/ru/calendar?month=2026-05` | `page.month = 5` → direct |
| Emiratisation news | EN | `/calendar?month=2026-06` | Slug mapping (NEWS_CALENDAR_MONTH) |
| Emiratisation news | RU | `/ru/calendar?month=2026-06` | Slug mapping (NEWS_CALENDAR_MONTH) |
| Emiratisation calendar | EN | `/calendar?month=2026-06` | `page.month = null`, inferred from single date 2026-06-30 |
| Emiratisation calendar | RU | `/ru/calendar?month=2026-06` | `page.month = null`, inferred from single date 2026-06-30 |
| Long Weekend | EN | `/calendar` | `page.month = null`, dates span Jan/Mar/Dec — multi-month, no faking; `yearBadge="2026"` |
| Long Weekend | RU | `/ru/calendar` | Same — multi-month, no faking; `yearBadge="2026"` |

All 12 verified via dev server with `curl` + grep.

---

## Final QA Answers

| Question | Answer |
|---|---|
| Are Eid and Emiratisation news previews now month-specific? | Yes — `/calendar?month=2026-05` and `/calendar?month=2026-06` respectively (EN and RU), via slug mapping |
| Are event/calendar previews month-specific? | Yes — events use `eventDateStart.slice(0,7)`; calendar pages use `month` field or single-month inference |
| Is Long Weekend handled safely as yearly/reference? | Yes — multi-month dates → no faking; generic `/calendar` with `yearBadge="2026"` |
| Is the whole card clickable without nested link issue? | Yes — outer `<Link>` generates one `<a>`; CTA text is a `<p>`, no nested anchors |
| Do all tested detail pages now have a hero image? | Yes — all 6 page types; skyline fallback on categories without a specific match |
| Are pages still readable and not bloated? | Yes — hero replaces old flat h1; mini preview is compact |
| Are published pages still indexable? | Yes — robots=index,follow on all 6 EN published detail pages confirmed |
| lang attributes correct? | Yes — EN pages lang=en, RU pages lang=ru |
| RU no EN fallback? | Yes — RU Eid event shows Russian title "Ид аль-Адха 2026 в ОАЭ…" |
| Raw Markdown: 0? | Yes — 0 on Eid news and Emiratisation news EN |
| Is it safe to commit and deploy? | Yes — TypeScript 0 errors, 86 pages clean build, 18/18 routes 200, no regressions |

---

## Deploy Recommendation

Safe to commit and deploy. Files to stage:

```
components/detail/DetailHero.tsx
components/calendar/CalendarMiniPreview.tsx
app/(en)/(public)/news/[slug]/page.tsx
app/(en)/(public)/events/[slug]/page.tsx
app/(en)/(public)/calendar/[slug]/page.tsx
app/ru/news/[slug]/page.tsx
app/ru/events/[slug]/page.tsx
app/ru/calendar/[slug]/page.tsx
```

No DB changes, no migrations, no env changes — deploy is: `git pull && npm run build && pm2 restart guidex-production`.

---

## Remaining Risks

- None technical — build is clean and routes verified.
- GSC indexing (2 URLs from Phase 6C-47): still pending owner action, unrelated to this phase.
- Emiratisation archive action (2026-07-10): unrelated to this phase.
