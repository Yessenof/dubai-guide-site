# Sitemap, Robots, Canonical & Hreflang Audit
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

---

## 1. Sitemap analysis

### Live sitemap structure
**URL:** `https://guidex-consulting.ae/sitemap.xml`  
**Total URLs:** 88  
**Evidence:** CONFIRMED_LIVE_GET

### URL breakdown
| Type | EN count | RU count | Total |
|---|---|---|---|
| Homepage | 1 | 1 | 2 |
| Static hub pages | ~9 | ~9 | ~18 |
| Guide slugs | 17 | 17 | 34 |
| Calendar slugs | 11 | 11 | 22 |
| Event slugs | 0 | 0 | **0 — MISSING** |
| News slugs | 0 | 0 | **0 — MISSING** |

### What `app/sitemap.ts` actually generates
```typescript
// CONFIRMED_REPO — app/sitemap.ts
// Queries: guides (published) + calendarPages (published) + static route list
// NEVER queries: events, news_posts
```

### Missing from sitemap
| URL | Status | Reason missing |
|---|---|---|
| `/events/uae-eid-al-adha-2026` | 200, indexable | Not in sitemap.ts queries |
| `/events/dubai-design-week-2026` | 200, indexable | Not in sitemap.ts queries |
| `/events/big-5-global-dubai-2026` | 200, indexable | Not in sitemap.ts queries |
| `/events/formula-1-abu-dhabi-grand-prix-2026` | 200, indexable | Not in sitemap.ts queries |
| `/events/gitex-global-2026` | 200, indexable | Not in sitemap.ts queries |
| `/news/uae-e-invoicing-2026-asp-deadline-update` | 200, indexable | Not in sitemap.ts queries |
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200, indexable | Not in sitemap.ts queries |
| `/news/uae-emiratisation-june-30-2026-deadline` | 200, indexable | Not in sitemap.ts queries |
| RU mirrors of all above | 200, indexable | Not in sitemap.ts queries |

**Severity:** CRITICAL — Google cannot efficiently discover or re-crawl these 16 URLs without sitemap entries. Google may find them through internal links, but frequency and priority signals are absent.

### `lastModified` issue
All sitemap entries use `lastModified: new Date()`. This means every page signals "modified today" on every deploy. Google may ignore `lastModified` entirely when it's unreliable. **CONFIRMED_REPO — low severity.**

---

## 2. Robots.txt analysis

### Live robots.txt
```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/
Sitemap: https://guidex-consulting.ae/sitemap.xml
```
**Evidence:** CONFIRMED_LIVE_GET

**Status:** CORRECT — all public pages are crawlable, admin is blocked, sitemap declared.

---

## 3. Per-page noindex directives

### Pages with explicit `robots: { index: false }` (intentional)
| Page | Rationale |
|---|---|
| `/calendar` | Hub/listing page — noindex intended |
| `/events` | Hub/listing page — noindex intended |
| `/news` | Hub/listing page — noindex intended |

**Evidence:** CONFIRMED_REPO — `app/(en)/(public)/calendar/page.tsx`, `events/page.tsx`, `news/page.tsx`

**Note:** These are intentional design decisions — hub/listing pages are kept noindex to concentrate ranking signals on detail pages. This is a valid SEO strategy BUT only works if detail pages are in the sitemap (gap T1/T2 above).

### Pages with conditional noindex (news_posts.noindex field)
All 3 published news posts have `noindex = 0` → they render `index: true`. CONFIRMED_REPO.

---

## 4. Canonical tags

| Page | Canonical set | Value |
|---|---|---|
| `/guides/[slug]` | YES | `${BASE}/guides/${slug}` |
| `/calendar/[slug]` | YES | `${BASE}/calendar/${slug}` |
| `/events/[slug]` | YES | `${BASE}/events/${slug}` |
| `/news/[slug]` | YES | `${BASE}/news/${slug}` |
| `/calendar` (listing) | YES | `${BASE}/calendar` |
| `/events` (listing) | YES | `${BASE}/events` |
| `/news` (listing) | YES | `${BASE}/news` |
| `/` (homepage) | NOT SET | No canonical in homepage metadata or layout |
| Hub pages (`/visas`, `/company-setup`, etc.) | `/life-setup` has it, others need verification | REQUIRES_OWNER_INPUT |

**Risk for homepage:** Without a canonical, if Google finds the homepage under multiple URLs (http vs https, www vs non-www, with/without trailing slash), duplicate content signals are possible. In practice, the CDN/reverse proxy likely handles www redirects — but a canonical is still best practice. HYPOTHESIS_SEO.

---

## 5. Hreflang implementation

### Pattern by page type

| Page type | `en` | `ru` | `x-default` | Notes |
|---|---|---|---|---|
| Homepage (`/`) | ✓ | ✓ | ✓ | Correct — bidirectional ✓ |
| RU homepage (`/ru`) | ✓ | ✓ | ✓ | Correct ✓ |
| Guide detail (`/guides/[slug]`) | ✓ | **MISSING** | ✓ | RU guides exist at `/ru/guides/[slug]` — hreflang gap |
| RU guide detail (`/ru/guides/[slug]`) | UNKNOWN | UNKNOWN | UNKNOWN | REQUIRES_OWNER_INPUT |
| Event detail (`/events/[slug]`) | ✓ | **MISSING** | ✓ | RU events exist at `/ru/events/[slug]` |
| RU event detail (`/ru/events/[slug]`) | ✓ | ✓ | ✓ | Has `ru`, `en`, `x-default` ✓ |
| News detail (`/news/[slug]`) | ✓ | **MISSING** | ✓ | RU news pages exist |
| Calendar SSG (`/calendar/[slug]`) | ✓ | **MISSING** | ✓ | RU calendar exists |
| RU calendar SSG (`/ru/calendar/[slug]`) | ✓ | ✓ | ✓ | Has all 3 ✓ |

**Evidence:** CONFIRMED_REPO — `alternates.languages` in each page's `generateMetadata`

### Hreflang correctness rule
Google requires **bidirectional** hreflang: if `/guides/employment-visa` declares `ru: /ru/guides/employment-visa`, then `/ru/guides/employment-visa` must also declare `en: /guides/employment-visa`. If only one side declares the alternate, Google may ignore both.

**Current state:** EN guide pages declare NO `ru` alternate → Google cannot establish bidirectional hreflang for any EN/RU guide pair. The RU event page DOES declare `en` and `ru` alternates, but the EN event page only declares `en` + `x-default`. This is a one-sided hreflang — Google will likely ignore it for RU targeting.

### Impact
- Russian-language search results: Google cannot reliably serve `/ru/guides/*` pages for Russian queries because no guide page declares `ru` hreflang
- For a Dubai-based site targeting both EN and RU speakers, this is a structural gap that limits RU organic reach

---

## 6. Priority fix list (technical scope only)

| # | Fix | File | Effort |
|---|---|---|---|
| S1 | Add events + news to `app/sitemap.ts` | `app/sitemap.ts` | 30 min |
| S2 | Add `ru` hreflang alternates to EN guide pages | `app/(en)/(public)/guides/[slug]/page.tsx` | 15 min |
| S3 | Add `ru` hreflang alternates to EN event pages | `app/(en)/(public)/events/[slug]/page.tsx` | 15 min |
| S4 | Add `ru` hreflang alternates to EN news pages | `app/(en)/(public)/news/[slug]/page.tsx` | 15 min |
| S5 | Add `ru` hreflang alternates to EN calendar pages | `app/(en)/(public)/calendar/[slug]/page.tsx` | 15 min |
| S6 | Add explicit canonical to homepage | `app/(en)/(public)/page.tsx` | 10 min |
| S7 | Use real `lastModified` dates in sitemap | `app/sitemap.ts` | 1 hour (needs `updated_at` from DB) |
