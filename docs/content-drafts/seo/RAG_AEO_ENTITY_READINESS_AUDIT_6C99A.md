# RAG / AEO / Entity Readiness Audit
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

RAG = Retrieval-Augmented Generation (ChatGPT, Gemini, Perplexity)  
AEO = Answer Engine Optimization (featured snippets, AI Overviews, direct answers)  
Entity = how Google's Knowledge Graph understands who "Guidex Consulting" is

---

## 1. Structured data inventory

### What exists

| Page type | Schema type | Fields output |
|---|---|---|
| Guide detail (`/guides/[slug]`) | `BreadcrumbList` | Home → category hub → guide title |
| All other pages | **NONE** | — |

**Evidence:** CONFIRMED_REPO — `app/(en)/(public)/guides/[slug]/page.tsx` lines 65-78 (JSON-LD object), `script type="application/ld+json"`

### What is missing

| Page type | Schema types that should exist | Why |
|---|---|---|
| Event detail (`/events/[slug]`) | `Event` | All events have `schema_eligible: 1`, dates, venue, description in DB |
| News detail (`/news/[slug]`) | `NewsArticle` or `Article` | Time-sensitive content — Article schema helps Google date and rank news content |
| Calendar detail (`/calendar/[slug]`) | `ItemList` or `Event` | Month-level calendar pages benefit from structured date items |
| Homepage | `Organization` + `WebSite` + `SiteLinksSearchBox` | Establishes entity identity, triggers sitelinks search |
| Guide detail | `HowTo` or `Article` | Step-by-step guides are natural `HowTo` candidates — currently only has `BreadcrumbList` |
| Hub pages | `CollectionPage` or `ItemList` | Lists of guides by category |

---

## 2. Event structured data gap — CRITICAL

All 5 published events have:
- `schema_eligible: 1` in DB
- `en_seo_title` filled (e.g., "GITEX Global 2026: Dates, Venue and Planning Guide | Expo City Dubai")
- `en_meta_description` filled
- `event_date_start`, `event_date_end` in DB
- `source_url` set

**Evidence:** CONFIRMED_REPO — DB query output showing all 5 published events with `schema_eligible: 1`

Despite this, the event page template (`app/(en)/(public)/events/[slug]/page.tsx`) outputs **zero JSON-LD**. The `schemaEligible` field is read from the DB into `EventDetail` but never used in any template rendering.

**What a properly structured `Event` schema would enable:**
- Google Event rich results (visible in SERPs as event cards with date/location)
- Perplexity/ChatGPT citation of event details with structured confidence
- Featured snippets for "[Event name] 2026 dates"

**Example schema that should be output when `schema_eligible = 1`:**
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "GITEX Global 2026",
  "startDate": "2026-12-07",
  "endDate": "2026-12-11",
  "location": {
    "@type": "Place",
    "name": "Dubai Exhibition Centre, Expo City Dubai",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE"
    }
  },
  "url": "https://guidex-consulting.ae/events/gitex-global-2026",
  "description": "..."
}
```

---

## 3. HowTo schema gap — MODERATE

Guide pages are step-by-step procedural content. This is the canonical use case for `HowTo` schema. Google renders HowTo rich results as expandable step cards in SERPs for "how to" queries. The site targets queries like "how to get an employment visa in Dubai" and "how to set up a company in Dubai" — exact `HowTo` match.

**What exists:** `BreadcrumbList` only.  
**What should exist:** `HowTo` with `name`, `description`, `step[]` (each with `@type: HowToStep`, `name`, `text`, optionally `estimatedCost`).

Steps are already structured in the DB (separate `steps` table with `en_title`, `en_what`, `en_where`, `cost`, `time`). The data is available; the schema output is absent.

**Evidence:** CONFIRMED_REPO — guide page template reads steps but only renders them in HTML, no JSON-LD `HowToStep` output.

---

## 4. Organization / WebSite schema gap — MODERATE

No `Organization` schema exists anywhere on the site. This means:
- Google has no machine-readable signal for who "Guidex Consulting" is
- Knowledge Panel is unlikely without entity disambiguation
- WhatsApp/contact information is not structured

**Minimum viable `Organization` schema (should be in layout or homepage):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Guidex Consulting",
  "url": "https://guidex-consulting.ae",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Russian"]
  }
}
```

No `WebSite` schema either — missing `siteLinksSearchBox` opportunity.

---

## 5. RAG / AI citation readiness

### How AI systems (Perplexity, ChatGPT, Gemini) cite pages

AI citation depends on:
1. **Page is indexable and in sitemap** (Googlebot → Bing → AI training pipelines)
2. **Content is clearly attributed** (author, publisher, date)
3. **Structured data confirms entity type** (Event, Article, HowTo)
4. **Content answers a specific question clearly in the first 200 words**

### Guidex Consulting current state

| Factor | Status | Notes |
|---|---|---|
| Pages indexable | PARTIAL — event/news not in sitemap | Crawlable but not signaled |
| Content clearly attributed | WEAK — no author byline, no `datePublished` in HTML | No visible publication date on most pages |
| Structured data | MINIMAL — BreadcrumbList only on guide pages | Events, news, calendars have no schema |
| Content answers questions in first 200 words | MODERATE — overview paragraphs are clear | Good for guides; event summary paragraphs are short |
| Site age / domain authority | WEAK — site is new, few/no backlinks | HYPOTHESIS_SEO — requires GA4/GSC/Ahrefs |

### AI-readability strengths
- Guide pages: step-by-step format with numbered steps is highly parseable
- Official body names (MOHRE, ICA, GDRFA, Tasheel, Amer) used throughout — good entity signals
- Bilingual content (EN + RU) — potential for Russian-language AI query answering

### AI-readability gaps
- No `datePublished`/`dateModified` visible in guide page HTML (exists in DB as `last_updated` but not rendered in `<time>` tags or schema)
- No author or publisher byline
- Calendar pages: dates in `dates_json` are not in HTML as visible structured data (rendered via React but only as display text, not machine-readable ISO date attributes)
- FAQ-style content on hub pages (e.g., life-setup "who is this for" sections) has no FAQPage schema

---

## 6. Featured snippet / zero-click readiness

Target queries and snippet readiness:

| Query | Target page | Snippet-ready? |
|---|---|---|
| "how to get employment visa dubai" | `/guides/employment-visa` | MODERATE — clear steps, but no `HowTo` schema |
| "how to set up company dubai" | `/guides/mainland-company-setup-dubai` | MODERATE — same |
| "Dubai Eid al Adha 2026 dates" | `/events/uae-eid-al-adha-2026` | WEAK — no `Event` schema, event not in sitemap |
| "GITEX 2026 dates venue" | `/events/gitex-global-2026` | WEAK — not in sitemap, no Event schema |
| "Dubai golden visa property" | `/guides/golden-visa-dubai-property` | MODERATE — step list present, BreadcrumbList only |
| "UAE corporate tax deadline 2026" | guide or news page | WEAK — news not in sitemap, no Article schema |

---

## 7. Priority structured data fixes

| # | Schema type | Target page | DB fields available | Effort |
|---|---|---|---|---|
| R1 | `Event` | `/events/[slug]` (when `schema_eligible=1`) | `en_title`, `event_date_start`, `event_date_end`, `en_meta_description`, `source_url` | 2 hours |
| R2 | `HowTo` | `/guides/[slug]` | `en_title`, `en_overview`, `steps` table with `en_title`, `en_what` | 3 hours |
| R3 | `Organization` + `WebSite` | Layout or homepage | Static data | 30 min |
| R4 | `NewsArticle` | `/news/[slug]` | `en_seo_title`, `en_meta_description`, `date_published`, `date_updated` | 1 hour |
| R5 | `FAQPage` | Hub pages (life-setup, find-my-visa) | Content already structured | 2 hours |
| R6 | `BreadcrumbList` | Event + news + calendar pages | Slug + title already available | 1 hour |
