# Technical SEO & Indexing Audit
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

---

## Rendering model

| Page type | SSG / SSR | `generateStaticParams` | Notes |
|---|---|---|---|
| Guide detail (`/guides/[slug]`) | SSG | returns all published slugs | Pre-built at deploy time ✓ |
| Calendar detail (`/calendar/[slug]`) | SSG | returns all published slugs | Pre-built at deploy time ✓ |
| Event detail (`/events/[slug]`) | On-demand SSR | `return []` | NOT pre-built — rendered per-request ✗ |
| News detail (`/news/[slug]`) | On-demand SSR | `return []` | NOT pre-built — rendered per-request ✗ |
| Homepage (`/`) | Static (layout default) | N/A | No page-level `generateMetadata` ✗ |
| Hub pages (company-setup, visas, etc.) | Static | N/A | SSG ✓ |
| Calendar listing (`/calendar`) | Dynamic | N/A | noindex ✓ |
| Events listing (`/events`) | Dynamic | N/A | noindex ✓ |
| News listing (`/news`) | Dynamic | N/A | noindex ✓ |

**Evidence:** CONFIRMED_REPO — `generateStaticParams()` returns `[]` in `app/(en)/(public)/events/[slug]/page.tsx` and `app/(en)/(public)/news/[slug]/page.tsx`

**Impact:** Event and news detail pages are server-rendered on first request. Googlebot and other crawlers see fully rendered HTML (Next.js SSR), so indexability is NOT blocked by rendering. However, these pages have no warm-cache benefit and rely on Google discovering them through links.

---

## Robots.txt

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/
Sitemap: https://guidex-consulting.ae/sitemap.xml
```

**Evidence:** CONFIRMED_LIVE_GET — `https://guidex-consulting.ae/robots.txt`

**Status:** CORRECT. Admin routes blocked. Sitemap declared. No crawl budget waste on API routes.

---

## Per-page robots metadata

| Page type | `robots` metadata | Effect |
|---|---|---|
| Guide detail | Not set in page — relies on layout default | `index: true, follow: true` (Next.js default) |
| Calendar detail | `calendarRobots(page)` → `{ index: true, follow: true }` | Indexable ✓ |
| Event detail | `eventRobots(event)` → `{ index: true, follow: true }` | Indexable ✓ |
| News detail | `newsRobots(post)` → `INDEX` or `NOINDEX` based on `noindex` DB field | Conditional |
| Calendar listing | `{ index: false, follow: true }` | **noindex** — intentional |
| Events listing | `{ index: false, follow: true }` | **noindex** — intentional |
| News listing | `{ index: false, follow: true }` | **noindex** — intentional |
| Homepage | Not set — layout default | `index: true` |
| Hub pages | Varies — life-setup has `index: true` explicitly | Indexable ✓ |

**Evidence:** CONFIRMED_REPO — `lib/db/indexing.ts`, individual page.tsx files

---

## News noindex field

DB column `noindex` in `news_posts` table controls per-post indexability. Current data:
- `uae-e-invoicing-2026-asp-deadline-update`: noindex = 0 → indexable
- `uae-eid-al-adha-2026-federal-holiday-long-break`: noindex = 0 → indexable
- `uae-emiratisation-june-30-2026-deadline`: noindex = 0 → indexable

**Evidence:** CONFIRMED_REPO — DB query via node/better-sqlite3

---

## Sitemap coverage

**Sitemap URL:** `https://guidex-consulting.ae/sitemap.xml`

| Content type | Count in DB (published) | Count in sitemap | Gap |
|---|---|---|---|
| Guides | 17 | 17 (EN) + 17 (RU) = 34 | NONE ✓ |
| Calendar pages | 11 | 11 (EN) + 11 (RU) = 22 | NONE ✓ |
| Events | 5 | 0 | **CRITICAL — 5 missing** |
| News posts | 3 | 0 | **CRITICAL — 3 missing** |
| Static hub pages | ~10 | ~10 (EN) + ~10 (RU) | NONE |
| Calendar listing | — | 0 | Intentional (noindex) |
| Events listing | — | 0 | Intentional (noindex) |
| News listing | — | 0 | Intentional (noindex) |

**Evidence:** CONFIRMED_LIVE_GET — `https://guidex-consulting.ae/sitemap.xml` (88 URLs confirmed)  
**Evidence:** CONFIRMED_REPO — `app/sitemap.ts` — no `events` or `news_posts` DB queries

**Root cause:** `app/sitemap.ts` queries only `guides` and `calendarPages` tables. It never queries `events` or `news_posts`.

---

## Canonical tags

| Page type | Canonical set | Value pattern |
|---|---|---|
| Guide detail | YES | `${BASE}/guides/${slug}` ✓ |
| Calendar detail | YES | `${BASE}/calendar/${slug}` ✓ |
| Event detail | YES | `${BASE}/events/${slug}` ✓ |
| News detail | YES | `${BASE}/news/${slug}` ✓ |
| Calendar listing | YES | `${BASE}/calendar` ✓ |
| Events listing | YES | `${BASE}/events` ✓ |
| News listing | YES | `${BASE}/news` ✓ |
| Homepage | NOT SET explicitly | Layout default — no canonical in layout |
| Hub pages | Some set (life-setup YES), others UNKNOWN | REQUIRES_OWNER_INPUT |

**Evidence:** CONFIRMED_REPO — `alternates.canonical` in each page.tsx

**Risk:** Homepage missing explicit canonical. In practice, Next.js does not auto-inject canonical from layout metadata unless the page exports it. If the homepage is accessible at both `https://guidex-consulting.ae` and `https://guidex-consulting.ae/en/` (or other variants), a missing canonical could cause duplicate-content issues. HYPOTHESIS_SEO.

---

## Core Web Vitals / Page speed

**Status:** REQUIRES_GA4 — no Lighthouse data available in this audit.

**Observable facts (CONFIRMED_REPO):**
- Inter font loaded via `next/font/google` — fonts are self-hosted at build time ✓
- No heavy third-party scripts besides Google Tag Manager
- GTM loaded via `GTMScript` / `GTMNoScript` components
- Guide pages are fully SSG — TTFB will be low ✓
- Event/news pages are SSR — TTFB depends on SQLite query time (fast, local file)
- No image optimization audit possible without CrUX data

**Hypothesis:** Page speed is not the blocking factor for near-zero organic traffic given the site is Next.js SSG/SSR on a VPS. The primary blocker is content volume, sitemap gaps, and incoming link deficit. HYPOTHESIS_SEO

---

## Summary of critical technical SEO gaps

| # | Gap | Severity | Evidence |
|---|---|---|---|
| T1 | Event pages not in sitemap | CRITICAL | CONFIRMED_REPO + CONFIRMED_LIVE_GET |
| T2 | News pages not in sitemap | CRITICAL | CONFIRMED_REPO + CONFIRMED_LIVE_GET |
| T3 | Event + news pages use SSR not SSG | MODERATE | CONFIRMED_REPO |
| T4 | Homepage has no explicit canonical tag | LOW | CONFIRMED_REPO |
| T5 | Guide pages rely on implicit robots default (not explicit) | LOW | CONFIRMED_REPO |
| T6 | `lastModified` in sitemap is always `new Date()` (signals everything changed on every deploy) | LOW | CONFIRMED_REPO |
