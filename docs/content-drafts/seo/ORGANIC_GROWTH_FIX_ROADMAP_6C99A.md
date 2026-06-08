# Organic Growth Fix Roadmap
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

This roadmap is the output of the full SEO/RAG/AEO audit. It prioritizes fixes by impact vs effort, ordered for maximum organic growth uplift. No fixes are implemented here — this is planning only.

---

## Root cause diagnosis

The site has near-zero organic traffic. The root causes in order of severity:

| # | Root cause | Type |
|---|---|---|
| 1 | **New domain, zero backlinks, zero domain authority** | Authority gap — cannot be fixed by code |
| 2 | **Event and news pages not in sitemap** — Google cannot efficiently discover or crawl 8+ indexable pages | Technical gap — 30 min fix |
| 3 | **No structured data on events and news** — missing Event / NewsArticle schema prevents rich results and reduces AI citation confidence | Technical gap — 3–4 hours |
| 4 | **No HowTo schema on guide pages** — guide pages are the site's best content but don't signal HowTo rich results | Technical gap — 3 hours |
| 5 | **Hreflang missing for events, news, calendar EN pages** — RU traffic potential blocked | Technical gap — 1 hour |
| 6 | **No Organization / WebSite schema** — entity not established | Technical gap — 30 min |
| 7 | **Thin site overall** — 36 unique content pages is not enough to signal topical authority on Dubai procedures | Content gap — ongoing work |
| 8 | **Large content gaps** — Ejari, tourist visa, driving licence, corporate tax, healthcare | Content gap — weeks of work |
| 9 | **Guide pages have no cross-links** — link equity is siloed | Architecture gap — 2 hours |

---

## Tier 1: Quick wins (< 1 hour each, HIGH impact)

### Fix 1: Add events and news to sitemap
**File:** `app/sitemap.ts`  
**Change:** Query `events` (status=published) and `news_posts` (status=published, noindex=0) and include their EN + RU slugs in the sitemap output  
**Impact:** Googlebot immediately gets a crawl signal for 8+ previously invisible pages  
**Effort:** 30 min  
**Evidence:** CONFIRMED_REPO — `app/sitemap.ts` never queries events or news_posts

### Fix 2: Add Organization + WebSite schema to layout
**File:** `app/(en)/layout.tsx`  
**Change:** Add JSON-LD `Organization` with name, url, contactPoint; add `WebSite` with url and potentialAction/SearchAction  
**Impact:** Entity recognition, potential Knowledge Panel, sitelinks search  
**Effort:** 30 min  

### Fix 3: Add explicit canonical to homepage
**File:** `app/(en)/(public)/page.tsx`  
**Change:** Export `generateMetadata` with `alternates.canonical: "${BASE}/"` and a more targeted title  
**Current title:** "Guidex Consulting — Step-by-step guides for living and working in Dubai" (from layout)  
**Suggested title:** "Dubai Procedures & Visa Guides — Step-by-step | Guidex Consulting"  
**Effort:** 15 min  

### Fix 4: Add hreflang `ru` to EN event pages
**File:** `app/(en)/(public)/events/[slug]/page.tsx`  
**Change:** Add `"ru": "${BASE}/ru/events/${slug}"` to `alternates.languages` — mirrors what the RU event page already declares  
**Effort:** 10 min  

### Fix 5: Add hreflang `ru` to EN news pages
**File:** `app/(en)/(public)/news/[slug]/page.tsx`  
**Change:** Same pattern — add `ru` alternate  
**Effort:** 10 min  

### Fix 6: Add hreflang `ru` to EN calendar pages
**File:** `app/(en)/(public)/calendar/[slug]/page.tsx`  
**Change:** Same pattern  
**Effort:** 10 min  

---

## Tier 2: High-impact structured data (2–4 hours each)

### Fix 7: Event schema on event pages
**File:** `app/(en)/(public)/events/[slug]/page.tsx`  
**Condition:** Only output when `event.schemaEligible === 1`  
**Schema type:** `Event`  
**Required fields:** `name`, `startDate`, `endDate`, `location.name`, `location.addressCountry`, `url`, `description`  
**DB fields available:** `en_title`, `event_date_start`, `event_date_end`, `en_meta_description`  
**Gap:** `location.name` and `location.address` are not structured DB fields — currently only in `en_body` text. Need either a new DB field or per-event logic. REQUIRES_OWNER_INPUT.  
**Effort:** 2–3 hours (including venue DB structure decision)  
**Evidence:** CONFIRMED_REPO — all 5 published events have `schema_eligible: 1`

### Fix 8: HowTo schema on guide pages
**File:** `app/(en)/(public)/guides/[slug]/page.tsx`  
**Schema type:** `HowTo`  
**Required fields:** `name`, `description`, `step[]` with `@type: HowToStep`, `name`, `text`, optionally `estimatedCost`  
**DB fields available:** `en_title`, `en_overview` (description), steps from `steps` table with `en_title`, `en_what`, `cost`, `time`  
**Effort:** 3 hours  

### Fix 9: NewsArticle schema on news pages
**File:** `app/(en)/(public)/news/[slug]/page.tsx`  
**Schema type:** `NewsArticle`  
**Required fields:** `headline`, `description`, `datePublished`, `dateModified`, `publisher`  
**DB fields available:** `en_seo_title`, `en_meta_description`, `date_published`, `date_updated`  
**Effort:** 1.5 hours  

---

## Tier 3: Content work (weeks)

### Fix 10: Fill the critical content gaps
Priority order based on search volume hypothesis:
1. **Ejari registration Dubai** — every Dubai resident needs it; high procedural intent
2. **UAE tourist visa 2026** — high volume, tourism category
3. **Dubai driving licence conversion** — high expat need
4. **UAE corporate tax registration** — high business need, underserved
5. **Dubai NOC letter** — frequent employment need
6. **GDRFA services guide** — authoritative government navigation

Each guide requires: 2+ overview paragraphs, 5–8 steps with full fields, audience statement, cost and timeline. ~2–3 hours per guide.

### Fix 11: Backlink acquisition (zero-code)
**This is the #1 blocker.** No technical fix can substitute for domain authority. Suggested approaches:
- Submit to UAE expat communities (Reddit r/dubai, Facebook groups)
- Reach out to Dubai HR/PRO companies for resource-link exchanges
- Get listed in Dubai business guides, relocation directories
- Publish "UAE visa updates 2026" on Medium/LinkedIn linking back to site
- Partner content with DED/freezone portals

**Evidence:** HYPOTHESIS_SEO — domain authority not measured; backlink count not measured. REQUIRES_GA4.

---

## Tier 4: Architecture improvements (medium effort, medium impact)

### Fix 12: Add cross-links between related guides
Example: Employment visa guide → link to "PRO services dubai" and "amer-center-dubai"  
Mainland company guide → link to "open business bank account" and "tax residency certificate"  
**File:** Would require a `related_guides` data structure in DB or static configuration  
**Effort:** 3–4 hours (design + implementation)

### Fix 13: Fix news page guide label bug
**File:** `app/(en)/(public)/news/[slug]/page.tsx` line 123  
**Bug:** `post.relatedGuideSlug.replace(/-/g, " ")` — shows slug text instead of guide title  
**Fix:** Same secondary DB lookup pattern used for events in Phase 6C-98C  
**Effort:** 30 min  
**Urgency:** LOW — no published news currently has a related guide set

### Fix 14: Real `lastModified` dates in sitemap
**File:** `app/sitemap.ts`  
**Change:** Use `guide.updatedAt`, `calendarPage.updatedAt`, etc. from DB instead of `new Date()`  
**Effort:** 1 hour  

---

## Monitoring requirements

None of the above fixes can be validated without:
- **Google Search Console:** Submit sitemap, monitor indexing status, track impressions/clicks per page
- **GA4:** Confirm organic traffic baseline is truly near-zero; monitor after fix deployment
- **Ahrefs or Semrush (free tier):** Backlink count, domain rating, keyword rankings

**Current monitoring gap:** REQUIRES_GSC + REQUIRES_GA4  
**Action:** Submit sitemap to GSC immediately after Fix 1 is deployed.

---

## Prioritized implementation order

| Order | Fix | Hours | Impact |
|---|---|---|---|
| 1 | Fix 1: Events + news in sitemap | 0.5h | CRITICAL |
| 2 | Fix 4+5+6: Hreflang for events/news/calendar | 0.5h | HIGH |
| 3 | Fix 2: Organization + WebSite schema | 0.5h | HIGH |
| 4 | Fix 3: Homepage canonical + title | 0.25h | MEDIUM |
| 5 | Fix 7: Event schema | 2–3h | HIGH (requires venue decision) |
| 6 | Fix 8: HowTo schema on guides | 3h | HIGH |
| 7 | Fix 9: NewsArticle schema | 1.5h | MEDIUM |
| 8 | Fix 10: New content guides | ongoing | CRITICAL (long-term) |
| 9 | Fix 11: Backlink acquisition | ongoing | CRITICAL (domain authority) |
| 10 | Fix 12: Cross-links between guides | 4h | MEDIUM |
| 11 | Fix 13: News guide label bug | 0.5h | LOW |
| 12 | Fix 14: Real lastModified in sitemap | 1h | LOW |

**Total quick-win effort (Fixes 1–6):** ~2.5 hours of code changes → immediately addresses the 3 most actionable technical gaps.
