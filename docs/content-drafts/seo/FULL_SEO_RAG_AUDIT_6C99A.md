# Full SEO / RAG / AEO Organic Growth Audit
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

This is the executive summary. Detailed findings are in the six supporting audit files.

---

## Audit scope

**Site:** guidex-consulting.ae  
**Primary question:** Why is organic traffic near zero?  
**Method:** Codebase analysis (repo), live HTTP checks, DB queries, evidence labeling

**Evidence labels used:**
- `CONFIRMED_REPO` — verified in local codebase
- `CONFIRMED_LIVE_GET` — verified via live HTTP request
- `HYPOTHESIS_SEO` — inference based on SEO best practice, not confirmed
- `REQUIRES_GSC` — needs Google Search Console data
- `REQUIRES_GA4` — needs Google Analytics 4 data
- `REQUIRES_OWNER_INPUT` — owner decision or external action required
- `REQUIRES_OFFICIAL_SOURCE` — would need FED authority or official data source

---

## The short answer

Near-zero organic traffic is explained by three compounding factors:

**1. New domain, zero backlinks (primary cause)**  
No amount of technical SEO fixes can substitute for domain authority. The site is new. Google has not yet established trust for this domain. This takes 6–18 months of consistent content publishing and link acquisition. HYPOTHESIS_SEO — REQUIRES_GA4 to confirm.

**2. Event and news pages not in sitemap (critical technical gap)**  
5 published event pages and 3 published news pages are **never included in `sitemap.xml`** because `app/sitemap.ts` does not query those tables. These pages are indexable but Google receives no crawl signal for them. CONFIRMED_REPO + CONFIRMED_LIVE_GET.

**3. No structured data on events and news (missed opportunity)**  
The DB has `schema_eligible: 1` for all events. SEO title and meta description fields exist. But the event page template outputs zero JSON-LD. Event rich results (Google's event cards) are completely unattainable in the current state. CONFIRMED_REPO.

---

## Site inventory

| Type | Published | In sitemap | Indexable | Has EN schema |
|---|---|---|---|---|
| Guides | 17 | YES (34 EN+RU) | YES | BreadcrumbList only |
| Calendar pages | 11 | YES (22 EN+RU) | YES | NONE |
| Events | 5 | **NO** | YES | **NONE** |
| News posts | 3 | **NO** | YES | **NONE** |
| Hub pages | ~10 | YES | YES | NONE |
| Listing pages (/calendar, /events, /news) | — | NO | **noindex** (intentional) | — |

**Evidence:** CONFIRMED_REPO (sitemap.ts logic) + CONFIRMED_LIVE_GET (live sitemap.xml, 88 URLs confirmed)

---

## Top 10 findings

### Finding 1 — Events not in sitemap [CRITICAL]
`app/sitemap.ts` queries only `guides` and `calendarPages`. Events table never queried.  
5 published event pages with good SEO titles and filled meta descriptions are invisible to Google's crawl scheduler.  
**Fix:** 30 min in `app/sitemap.ts`

### Finding 2 — News not in sitemap [CRITICAL]
Same as Finding 1. 3 published news posts — regulatory updates with time-sensitive keywords — are not in sitemap.  
**Fix:** 30 min combined with Finding 1

### Finding 3 — No Event schema on event pages [HIGH]
All events have `schema_eligible: 1` in DB. None output JSON-LD. Google Event rich results require `Event` schema.  
Event rich results in SERPs (date cards, venue, registration) are one of the highest-CTR SERP features for event-type queries.  
**Fix:** 2–3 hours (requires venue/location as structured DB field)

### Finding 4 — No HowTo schema on guide pages [HIGH]
Guide pages are the core content. They are structured step-by-step procedures. HowTo rich results (expandable step cards in SERP) are directly applicable.  
Only `BreadcrumbList` is currently output. No HowTo.  
**Fix:** 3 hours

### Finding 5 — Hreflang missing for events/news/calendar EN pages [MODERATE]
EN event pages: only `en` + `x-default` — no `ru` alternate  
EN news pages: only `en` + `x-default` — no `ru` alternate  
EN calendar SSG pages: only `en` + `x-default` — no `ru` alternate  
RU versions of all these pages correctly declare both `ru` + `en` alternates — but without the EN side declaring `ru`, Google ignores the hreflang pair.  
**Correction on guides:** EN guide pages DO correctly add `ru` hreflang when `hasRuContent` is true (all 17 guides have RU content). Guide hreflang is CORRECT.  
**Fix:** 30 min per page type (3 page types)

### Finding 6 — No Organization / WebSite schema anywhere [MODERATE]
No machine-readable entity identity for "Guidex Consulting" anywhere on the site. No Knowledge Panel. No sitelinks search action.  
**Fix:** 30 min in layout

### Finding 7 — Homepage has no dedicated canonical or title [LOW]
Homepage `page.tsx` exports only `alternates` (correct EN/RU hreflang). Title comes from layout default: "Guidex Consulting — Step-by-step guides for living and working in Dubai". No canonical tag.  
**Fix:** 15 min

### Finding 8 — Guides lack SEO title / meta description fields [LOW]
Guides table has `en_title` and `en_summary` but no `en_seo_title` or `en_meta_description` columns. The same `en_summary` is used for both the card preview text and the SERP meta description. This is not harmful but limits ability to optimize SERP snippets independently of card text.  
**Fix:** Schema migration + admin UI change (larger effort, lower priority)

### Finding 9 — News page related guide label uses slug text [LATENT BUG]
`post.relatedGuideSlug.replace(/-/g, " ")` renders slug as label — same bug fixed for events in Phase 6C-98C. Latent because no published news has `related_guide_slug` set yet.  
**Fix:** 30 min (apply same secondary DB lookup pattern as events)

### Finding 10 — Thin site overall [STRATEGIC]
36 unique content pages. Google expects topical authority signals — clusters of related content that collectively signal deep expertise on a topic. Current coverage is strong for employment visa and family visas. Missing: Ejari, tourist visa, driving licence, corporate tax, NOC letters, GDRFA services.  
**Fix:** Ongoing content production (~2–3 hours per guide)

---

## Hreflang status summary

| Page type | EN `ru` alternate | RU `en` alternate | Bidirectional? |
|---|---|---|---|
| Guides | YES (conditional on `hasRuContent`, true for all 17) | YES | CORRECT ✓ |
| Events | **NO** | YES | ONE-SIDED ✗ |
| News | **NO** | UNKNOWN | UNKNOWN |
| Calendar SSG | **NO** | YES | ONE-SIDED ✗ |
| Homepage | YES | YES | CORRECT ✓ |

---

## Structured data status summary

| Schema type | Where needed | Currently present |
|---|---|---|
| `BreadcrumbList` | All detail pages | Guide pages only |
| `HowTo` | Guide pages | **ABSENT** |
| `Event` | Event pages | **ABSENT** (schemaEligible flag exists, unused) |
| `NewsArticle` | News pages | **ABSENT** |
| `Organization` | Layout/homepage | **ABSENT** |
| `WebSite` | Layout/homepage | **ABSENT** |
| `FAQPage` | Hub pages | **ABSENT** |

---

## Robots and crawl status

- robots.txt: CORRECT — no issues
- Event detail pages: indexable (no noindex), but not in sitemap
- News detail pages: indexable, not in sitemap
- Calendar/events/news listing pages: noindex (intentional)
- Guide pages: indexable, in sitemap ✓
- Calendar SSG pages: indexable, in sitemap ✓

---

## Quick-win implementation order

| # | Fix | Time | Evidence |
|---|---|---|---|
| 1 | Add events + news to `app/sitemap.ts` | 30 min | CONFIRMED_REPO |
| 2 | Add `ru` hreflang to EN event/news/calendar pages | 30 min | CONFIRMED_REPO |
| 3 | Add Organization + WebSite schema to layout | 30 min | CONFIRMED_REPO |
| 4 | Add homepage canonical | 15 min | CONFIRMED_REPO |
| 5 | Event schema (when `schema_eligible=1`) | 2–3 h | CONFIRMED_REPO |
| 6 | HowTo schema on guide pages | 3 h | CONFIRMED_REPO |
| 7 | NewsArticle schema | 1.5 h | CONFIRMED_REPO |

**Total quick-win code time (items 1–4):** ~1.5 hours  
**Total structured data time (items 5–7):** ~7 hours

---

## Supporting audit files

| File | Contents |
|---|---|
| `TECHNICAL_SEO_INDEXING_AUDIT_6C99A.md` | Rendering model, robots.txt, noindex map, sitemap coverage, canonical analysis |
| `SITEMAP_ROBOTS_CANONICAL_HREFLANG_AUDIT_6C99A.md` | Full sitemap URL breakdown, noindex directives, canonical tags, hreflang matrix |
| `CONTENT_QUALITY_AND_SEARCH_INTENT_AUDIT_6C99A.md` | Guide quality, event quality, news quality, content gap analysis |
| `KEYWORD_CLUSTER_AND_PAGE_MAPPING_6C99A.md` | Keyword clusters by category, page mapping, cannibalization analysis |
| `RAG_AEO_ENTITY_READINESS_AUDIT_6C99A.md` | Structured data inventory, Event schema gap, HowTo gap, Organization gap, AI citation readiness |
| `INTERNAL_LINKING_AND_SITE_ARCHITECTURE_AUDIT_6C99A.md` | Link graph, nav structure, orphan page risk, hub-to-guide links |
| `ORGANIC_GROWTH_FIX_ROADMAP_6C99A.md` | Prioritized fix list with effort and impact ratings |
