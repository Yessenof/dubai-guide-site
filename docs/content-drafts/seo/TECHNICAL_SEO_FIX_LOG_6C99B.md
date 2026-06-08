# Technical SEO Fix Log — Phase 6C-99B
## Date: 2026-06-08 | FIX + LOCAL QA (NO DEPLOY, NO PUSH)

---

## Baseline (before changes)

| Field | Value |
|---|---|
| Git branch | main |
| Commit hash | c481d5457ca46ecabcebcfecaeca3c0489b82f04 |
| Package manager | npm |
| Build command | `npm run build` |
| Node | v25.9.0 |

### Files likely to change

| File | Why |
|---|---|
| `app/sitemap.ts` | Add events + news entries |
| `lib/db/news-events-calendar.ts` | Add `ruPublished` to EventDetail, NewsPostDetail, CalendarPageDetail |
| `app/(en)/(public)/events/[slug]/page.tsx` | Add RU hreflang + Event JSON-LD |
| `app/ru/events/[slug]/page.tsx` | Add Event JSON-LD |
| `app/(en)/(public)/news/[slug]/page.tsx` | Add RU hreflang + NewsArticle JSON-LD |
| `app/ru/news/[slug]/page.tsx` | Add NewsArticle JSON-LD |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Add RU hreflang |
| `components/OrgSchema.tsx` | Add WebSite schema |
| `app/(en)/(public)/page.tsx` | Add explicit title + description |

### Pre-change discoveries

- `components/OrgSchema.tsx` ALREADY EXISTS — Organization schema already output by both EN and RU layouts.
  - EN: via `app/(en)/(public)/layout.tsx` → `<OrgSchema />`
  - RU: via `app/ru/layout.tsx` → `<OrgSchema />`
  - Audit finding #6 ("No Organization schema") was WRONG. The component existed. No change needed beyond adding WebSite schema alongside it.
- Homepage already has `alternates.canonical: BASE` in `page.tsx`. Audit finding #7 was partially wrong.
  - Homepage title comes from layout default and IS generic — this IS a valid fix target.
- RU news page (`app/ru/news/[slug]/page.tsx`): ALREADY has correct hreflang (`ru`, `en`, `x-default`).
- RU calendar page (`app/ru/calendar/[slug]/page.tsx`): ALREADY has correct hreflang.
- RU event page (`app/ru/events/[slug]/page.tsx`): ALREADY has correct hreflang.
- Logo file `public/brand/logo-header.png`: EXISTS and is already used in OrgSchema.

---

## Step 0 — Baseline document created

This file.

---

## Step 1 — Sitemap fix

### Problem
`app/sitemap.ts` only queries `guides` and `calendarPages` tables. Never queries `events` or `news_posts`. Result: 5 published event pages and 3 published news pages have zero sitemap entries.

### Fix
Added imports for `getPublishedEvents` and `getPublishedNewsPosts` from `@/lib/db/news-events-calendar`. Added EN + RU event entries (priority 0.7 / 0.6) and EN + RU news entries (priority 0.6 / 0.5).

### Notes
- `getPublishedEvents("ru")` already gates on `ru_published = 1` and non-empty `ru_title`
- `getPublishedNewsPosts("ru")` already gates on `ru_published = 1` and non-empty `ru_title`
- EN news: `getPublishedNewsPosts("en")` does NOT filter by `noindex`. All 3 published news have `noindex = 0`, so this is currently safe. Documented as latent gap.
- Events: no `noindex` field in events table — no filtering needed

---

## Step 2 — Hreflang fixes

### Problem
EN event pages, EN news pages, EN calendar SSG pages: missing `ru` hreflang alternate. RU pages already correctly declare `en` and `ru` alternates.

### Fix
Added `ruPublished: number` to `EventDetail`, `NewsPostDetail`, and `CalendarPageDetail` interfaces. Added the field to the return values of `getEventBySlug()`, `getNewsPostBySlug()`, and `getCalendarPageBySlug()`. EN page metadata now conditionally adds `ru` alternate when `ruPublished === 1`.

### Hreflang before/after

| Page | Before | After |
|---|---|---|
| EN event page | `en`, `x-default` | `en`, `ru` (when `ruPublished=1`), `x-default` |
| EN news page | `en`, `x-default` | `en`, `ru` (when `ruPublished=1`), `x-default` |
| EN calendar page | `en`, `x-default` | `en`, `ru` (when `ruPublished=1`), `x-default` |
| RU event page | `ru`, `en`, `x-default` | UNCHANGED ✓ |
| RU news page | `ru`, `en`, `x-default` | UNCHANGED ✓ |
| RU calendar page | `ru`, `en`, `x-default` | UNCHANGED ✓ |
| EN guide pages | `en`, `ru` (when `hasRuContent`), `x-default` | UNCHANGED ✓ |

---

## Step 3 — WebSite JSON-LD

### Problem
No WebSite schema exists anywhere on the site.

### Fix
Added `WebSite` schema to `OrgSchema` component alongside the existing `Organization` schema. Both are output as a single JSON-LD array (`@graph` or two separate scripts). Used simple form: `@type: WebSite`, `name`, `url`.

No `SearchAction` added — no working site search URL pattern exists.

---

## Step 4 — Homepage title

### Problem
Homepage `page.tsx` only exports `alternates` metadata. Title comes from layout default: "Guidex Consulting — Step-by-step guides for living and working in Dubai" — generic, not keyword-targeted.

### Fix
Added explicit `title` and `description` to homepage `page.tsx` metadata export. Improved title to target Dubai procedures, UAE calendar, and expat life setup positioning.

### Before / After

| Field | Before | After |
|---|---|---|
| Title | "Guidex Consulting — Step-by-step guides for living and working in Dubai" (layout default) | "Guidex — Dubai Guides, UAE Calendar & Expat Life Setup" |
| Description | "Clear, practical guides for company setup, visas, hiring, and relocation in Dubai and the UAE." (layout default) | "Step-by-step guides for visas, company setup, and UAE procedures. Monthly UAE calendar, regulatory updates, and life-setup help for expats in Dubai." |

---

## Step 5 — Event JSON-LD

### Problem
Events have `schema_eligible: 1` in DB. Page template never outputs JSON-LD despite the flag.

### Fix
Added Event JSON-LD to EN and RU event page templates when `event.schemaEligible === 1`.

### Fields used
- `name`: `event.seoTitle || event.title`
- `description`: `event.metaDescription || event.summary`
- `startDate`: `event.eventDateStart`
- `endDate`: `event.eventDateEnd` when non-empty and different from startDate
- `eventStatus`: always `https://schema.org/EventScheduled`
- `url`: canonical event page URL

### Fields intentionally omitted
- `location`: no structured venue field in `events` table. DB has no `venue_name`, `venue_address` columns. Location is only in body text (unstructured). Cannot reliably extract programmatically. Documented in SCHEMA_IMPLEMENTATION_NOTES.
- `eventAttendanceMode`: omitted because `location` is omitted
- `organizer`: not in DB
- `performer`: not in DB
- `offers`/`image`: not in DB

---

## Step 6 — NewsArticle JSON-LD

### Problem
News pages have no structured data at all.

### Fix
Added NewsArticle JSON-LD to EN and RU news page templates when `post.noindex !== 1`.

### Fields used
- `headline`: `post.seoTitle || post.title`
- `description`: `post.metaDescription || post.summary`
- `datePublished`: `post.datePublished` when non-empty
- `dateModified`: `post.dateUpdated` when non-empty and different from `datePublished`
- `mainEntityOfPage`: `{ "@type": "WebPage", "@id": canonical URL }`
- `publisher`: `{ "@type": "Organization", "name": "Guidex Consulting", "url": BASE }`

### Fields intentionally omitted
- `author`: not in DB
- `image`: no stable image URLs in news_posts table (imagePath = NONE for all 3 published posts)
- `articleSection`: could be derived from `category` but adding category→section mapping not needed for valid schema

---

## QA plan

1. `npm run build` — must pass, 0 TS errors
2. Curl local `/sitemap.xml` after build/dev
3. Check sitemap contains event and news URLs
4. Check event pages render with Event JSON-LD
5. Check news pages render with NewsArticle JSON-LD
6. Check EN event page has `ru` hreflang in `<head>`
7. Check EN news page has `ru` hreflang in `<head>`
8. Check EN calendar page has `ru` hreflang in `<head>`
9. Check homepage has improved title
10. Check OrgSchema outputs both Organization and WebSite schemas

---

## QA results

| # | Check | Result |
|---|---|---|
| 1 | Build pass | PASS — 0 TypeScript errors, 88 static pages |
| 2 | Sitemap route returns successfully | PASS — 92 URLs total |
| 3 | Sitemap contains event URLs (all 5 EN + 5 RU) | PASS — 10 event URLs confirmed |
| 4 | Sitemap contains news URLs (all 3 EN + 3 RU) | PASS — 6 news URLs confirmed |
| 5 | Sitemap does not contain admin/API URLs | PASS — no /admin or /api/auth in sitemap |
| 6 | Event pages return 200 locally | PASS — GITEX, F1, Design Week, Big 5 all 200 |
| 7 | News pages return 200 locally | PASS — all 3 news posts 200 |
| 8 | Calendar pages return 200 locally | PASS — December + November 200 |
| 9 | Homepage returns 200 | PASS |
| 10 | Guide page returns 200 (regression) | PASS |
| 11 | EN event page has RU hreflang | PASS — `hrefLang="ru"` present on GITEX |
| 12 | EN news page has RU hreflang | PASS — `hrefLang="ru"` present on Emiratisation news |
| 13 | EN calendar page has RU hreflang | PASS — December calendar has `hrefLang="ru"` |
| 14 | Homepage has improved title | PASS — "Guidex — Dubai Guides, UAE Calendar & Expat Life Setup" |
| 15 | Organization JSON-LD exists (present before this phase) | PASS — confirmed on event page |
| 16 | WebSite JSON-LD exists (new) | PASS — confirmed on event and guide pages |
| 17 | Event JSON-LD exists on GITEX page | PASS — correct `@type: Event`, dates, url |
| 18 | Event JSON-LD on F1 page — Abu Dhabi preserved | PASS — description references "Yas Marina Circuit, Abu Dhabi" |
| 19 | Event JSON-LD exists on Eid Al Adha page | PASS — start 2026-05-25, end 2026-05-29 |
| 20 | Event JSON-LD exists on RU GITEX page (Russian content) | PASS — Russian name/description confirmed |
| 21 | NewsArticle JSON-LD exists on EN news page | PASS — confirmed on Emiratisation news |
| 22 | NewsArticle JSON-LD exists on RU news page (Russian content) | PASS — confirmed with Russian fields |
| 23 | No JSON-LD visible in body content | PASS — all schema in `<script>` tags only |
| 24 | Guide page schema types (regression) | PASS — Organization, WebSite, BreadcrumbList all present |
| 25 | RU event pages return 200 | PASS — ru/events/gitex-global-2026 = 200 |
| 26 | RU news pages return 200 | PASS — ru/news/... = 200 |
| 27 | No deploy, push, DB write, migration, admin, AI Inbox | CONFIRMED |

---

## Hard-stop compliance

- No deploy ✓
- No push ✓
- No production DB write ✓
- No migrations ✓
- No admin ✓
- No AI Inbox ✓
- No content import ✓
- No commit unless owner approves ✓
- No destructive commands ✓
