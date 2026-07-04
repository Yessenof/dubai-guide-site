# Guidex SEO Operating System

**Version:** 1.0  
**Date:** 2026-07-01  
**Commit at creation:** `6da016d`

This is the master operational document for Guidex's organic growth system. Every content decision, internal link, and deployment must be measured against this document.

---

## A. Operating Principle

Guidex grows as a **compounding SEO/RAG machine**. Each new piece of correct, well-structured content raises the site's topical authority for the next piece. This only works if every page meets the quality bar. One thin, inaccurate, or technically broken page costs more than it gains.

**Non-negotiable operating rules:**

| Rule | Why |
|---|---|
| Organic search is the primary acquisition channel | All architecture and content decisions serve search first |
| AI/RAG discoverability is co-equal | LLMs cite structured, factual, extract-ready content — same bar as Google |
| Cluster-based growth only | Isolated standalone pages don't build topical authority |
| Source-aware content | No fee, salary, deposit, or deadline claim without source label |
| EN/RU parity is mandatory | A broken RU page or EN fallback in RU harms trust and hreflang signals |
| No fake guarantees | "guaranteed", "always required", "official fee" without citation = publish blocker |
| Production safety is non-negotiable | No DB write without backup; no deploy without zero-downtime script |
| Correct is better than fast | A correct page published in 3 days beats a weak page published in 1 day |
| GSC drives decisions | No content investment without checking what's already indexing and ranking |

---

## B. Weekly SEO Workflow

Run every Monday morning. Takes approximately 30–45 minutes.

### Step 1 — GSC export

Export the following from Google Search Console (last 28 days unless noted):

| Report | What to look for |
|---|---|
| Performance → Queries | Queries with impressions but no clicks (CTR gap) |
| Performance → Pages | Pages with impressions but CTR < 2% |
| Performance → Countries | UAE / Russia / UK split |
| Performance → Devices | Mobile % — should be > 60% |
| Coverage → Excluded | "Crawled, not indexed", "Discovered, not indexed", "Duplicate", "Redirect" |
| Coverage → Valid | Count of indexed pages |
| Enhancements → HowTo | Rich result eligibility for guide pages |
| Enhancements → Breadcrumbs | Breadcrumb schema health |
| Sitemaps | sitemap.xml status + last crawl date |

### Step 2 — Identify priority pages

Use GSC data to find:

1. **CTR gap** — Pages with >100 impressions and CTR < 2%. These rank but users don't click. Problem: title/meta is weak.
2. **Position 8–30** — Pages almost on page 1. Small improvements can move them to 1–7.
3. **Crawled not indexed** — Pages Google found but rejected. Usually: thin content, soft 404, or blocked by robots.
4. **Missing from index** — Published pages not appearing in GSC at all. Usually: not in sitemap, blocked, or no inbound links.
5. **High-intent weak pages** — Pages where the first 100 words don't answer the query. Bounce rate signal.

### Step 3 — Update

For CTR gap pages:
- Rewrite `<title>` — add specific differentiator (route type, fee range, year)
- Rewrite meta description — add the benefit, not just description
- Improve H1 / first paragraph — answer the query in the first sentence

For position 8–30 pages:
- Check first-screen answer — is it above the fold on mobile?
- Add or improve a summary table or checklist
- Strengthen internal links from higher-authority pages
- Check source notes — AI-cited pages outrank unsourced pages

For all pages being updated:
- Do not add unconfirmed claims
- Do not add length for length's sake
- Update `lastUpdated` field if content changes are substantive

### Step 4 — QA (mandatory before any deploy)

Run for every changed file:

```
1. npm run build — 0 errors, all static pages generated
2. HTTP 200 on all changed routes + their RU equivalents
3. EN/RU parity check — no English text on RU pages
4. Canonical correct — each page points to its own URL
5. Hreflang correct — EN↔RU alternates present and bidirectional
6. Sitemap — changed pages appear in sitemap.xml
7. JSON-LD parse — all ld+json blocks parse without error
8. No forbidden phrases — guaranteed / always required / official fee / Ukraine / absconding
9. No dead slugs in related-guides.ts
10. Related guides section renders at least 1 card on changed guides
```

### Step 5 — Log

Add one entry to `SESSION_LOG.md`:

```
[YYYY-MM-DD] Phase X — Description
- What changed and why
- Expected SEO effect
- GSC URLs submitted
- Build: X/X pages
```

### Step 6 — GSC submission

After deploy, submit in GSC:
- Every new or significantly updated URL → URL Inspection → Request Indexing
- Sitemap if new pages were added

---

## C. Monthly SEO Workflow

Run on the 1st of each month.

### Calendar pages

- Check all calendar month pages for the current + next 2 months
- Update `lastmod` if event data was refreshed
- Confirm events have confirmed/estimated/expected status labels (not invented dates)
- Submit calendar month pages to GSC if events changed

### Content decay review

- Pull GSC data for the past 90 days vs prior 90 days
- Identify pages where impressions or clicks dropped >20%
- Investigate: freshness issue, new competitor, algorithm signal
- Update content or improve internal links if decay is confirmed

### Sitemap health

- Fetch `/sitemap.xml` — count URLs
- Compare to count of published guides, events, news, calendar pages in DB
- Any gap = missing entry = fix

### Cluster gap review

- List all published guides per cluster
- Identify: which cluster is thinnest?
- Identify: which cluster has the most GSC impressions?
- Decide: next content investment

### CTA/conversion review

- Check WhatsApp click patterns if tracked
- Check form submissions if applicable
- Identify: which guide has the most traffic but no CTA conversion?

---

## D. Four Core Clusters

### Cluster 1 — Dubai Calendar

**Purpose:** Capture time-sensitive event and date queries. Fast-decaying but high-volume. Drives brand awareness and repeat visits.

**Target search intent:**
- "Dubai events [month] [year]"
- "UAE public holidays 2026"
- "long weekends Dubai 2026"
- "things to do Dubai [month]"
- "[Event name] Dubai 2026 dates"

**Priority pages:**
- `/calendar/[month]-[year]-dubai-calendar` — monthly calendars
- `/events/[slug]` — individual event pages
- `/calendar` — main calendar hub

**Internal linking logic:**
- Monthly calendar page → individual event pages for that month
- Individual event page → same-month calendar page
- Homepage → calendar hub → current month
- Life setup hub → relevant calendar entries (e.g., public holidays)

**RAG/AEO structure:**
- Confirmed dates at top — extractable immediately
- Status label: "Confirmed" / "Expected" / "Estimated" — never invent
- Event: name, dates, venue, what it is, official source
- Source note mandatory for any date or attendance figure

**Conversion path:**
- Calendar pages have no direct service CTA (awareness content)
- Cross-link to relevant visa/setup guides where natural
- Footer CTA: WhatsApp for event-related inquiries (not primary)

---

### Cluster 2 — Dubai Visa Guides

**Purpose:** Highest-value cluster. Procedural, high-intent, captures users who are about to spend money and need an expert. Primary commercial cluster.

**Target search intent:**
- "how to get [visa type] in Dubai"
- "[visa type] Dubai requirements"
- "sponsor [family member] visa Dubai"
- "Dubai visa [inside/outside UAE]"
- "Golden Visa Dubai property"

**Priority pages (live):**
- `/guides/employment-visa`
- `/guides/golden-visa-dubai-property`
- `/guides/parents-visa-dubai`
- `/guides/spouse-dependent-visa-dubai`
- `/guides/child-dependent-visa-dubai`
- `/guides/renew-family-visa-dubai`
- `/guides/newborn-visa-dubai`

**Internal linking logic:**
- Every visa guide → family hub (`/visas/family`) or golden hub (`/visas/golden`)
- Family hub → all family visa guides
- Related guides: 3 per guide, all real published slugs, no dead entries
- Cross-cluster: Golden Visa → tax residency, company setup
- Cross-cluster: Employment visa → company setup, Amer center

**RAG/AEO structure:**
- Short answer in first 80 words: who, what, where, rough cost
- RouteSnapshot: price/timeline/audience/steps count
- HowTo JSON-LD — auto-generated from steps (≥2 steps threshold)
- BreadcrumbList JSON-LD — auto-generated from route
- Step-by-step with cost/time per step
- Source note: distinguish official vs AMER service-centre data
- "case by case at GDRFA" framing for AMER practical data

**Content wording rules:**
- AMER fees: "Amer service-centre notes" / "Amer notes reviewed by Guidex" — never "official fee"
- Salary references: "Amer filing guideline, reviewed case by case" — never "required by law"
- Deposits: same framing
- Inside/outside UAE distinction: always explicit in audience field and step 1

**Conversion path:**
- Above steps: Find My Route (route finder) + Ask an Expert (WhatsApp)
- After steps: full WhatsApp CTA block
- Related guides at bottom: keep user in cluster

---

### Cluster 3 — Life Setup Dubai

**Purpose:** Captures broad "moving to Dubai" intent. High volume, moderate commercial intent. Builds brand authority as the Dubai procedures expert.

**Target search intent:**
- "how to move to Dubai"
- "Dubai relocation checklist"
- "Ejari Dubai"
- "DEWA connection Dubai"
- "Dubai driving license transfer"
- "health insurance Dubai residents"

**Priority pages:**
- `/life-setup` — hub page (live)
- Individual life setup guides (in progress)

**Internal linking logic:**
- Life setup hub → all life setup guides
- Cross-link to visa guides where relevant (e.g., "you need a valid residence visa before registering Ejari")
- Cross-link to business setup guides for entrepreneurs

**RAG/AEO structure:**
- Same as visa guides: short answer first, steps, source note
- Document checklists extractable by AI
- Official authority names must be correct: DEWA, RTA, DHA, Ejari, Tawtheeq

**Conversion path:**
- WhatsApp / consultation for complex processes
- Cross-sell: visa guide if user doesn't have residence yet

---

### Cluster 4 — Company / Business Setup

**Purpose:** High commercial intent. Entrepreneurs are ready to spend significant money. Captures queries from founders planning Dubai company.

**Target search intent:**
- "how to set up company in Dubai"
- "Dubai mainland vs free zone"
- "trade license Dubai cost"
- "corporate tax UAE"
- "VAT registration Dubai"
- "open business bank account Dubai"

**Priority pages (live):**
- `/guides/mainland-company-setup-dubai`
- `/guides/free-zone-company-setup-dubai`
- `/guides/open-business-bank-account-dubai`
- `/guides/tax-residency-certificate-uae`
- `/guides/pro-services-dubai`

**Internal linking logic:**
- Company setup hub → all business guides
- Mainland → bank account guide (natural next step)
- Free zone → bank account guide
- Company setup → employment visa (hire after setup)
- Tax residency → bank account, Golden Visa property

**RAG/AEO structure:**
- Mainland vs free zone comparison table — highly extractable
- Cost ranges with source note
- Timeline per step
- Official body names: DED, DIFC, JAFZA, ADGM, MOHRE, CBUAE

**Conversion path:**
- Company setup is high-value — WhatsApp CTA should be prominent
- PRO services guide cross-links strengthen conversion path

---

## E. Page Quality Standard

### Visa / procedural guides

Every guide page must have all of the following:

1. **First 80 words** — answers: what this is, who does it, rough cost/timeline
2. **RouteSnapshot** — price, timeline, audience, step count (above the fold)
3. **CTA pair** — Find My Route + Ask an Expert immediately after snapshot
4. **Step outline** — numbered list of step titles (scannable)
5. **Source note** — before steps, for AMER/GDRFA-backed data
6. **Full step cards** — title, what, where, address, cost, time, advice, warning
7. **Overview paragraphs** — after steps (SEO depth + RAG extraction)
8. **Related guides** — 3 working slugs, no dead entries
9. **Footer CTA** — WhatsApp block

Field-level quality bars:

| Field | Standard |
|---|---|
| Title | Specific, searchable, no "Ultimate Guide" or vague questions. Max 65 chars. |
| Summary / meta | 1–2 sentences, under 160 chars, works as standalone meta description |
| Audience | 1–2 sentences, describes exact reader, not a category |
| Overview | 2–6 paragraphs, each ≤ 4 sentences. No restatement of steps. |
| Step title | 3–6 words, action-oriented |
| Step what | 1–2 sentences — action only, no background |
| Step where | Name of authority or service centre only |
| Step address | "Any [name] branch" or portal URL — never invent physical addresses |
| Step advice | Only when it adds value a reader could not guess |
| Step warning | Only for genuine risk of error, delay, or money lost |

### Calendar / event pages

| Field | Standard |
|---|---|
| Dates | Confirmed / Expected / Estimated — status label mandatory |
| Venue | Name only — no invented address if not confirmed |
| Attendance/performer | Only if officially published — never invent |
| Source note | Mandatory for any date, attendance, or lineup claim |
| Body text | What is this event + what it means for residents/visitors |
| Schema | Event JSON-LD if `schema_eligible = 1` |

---

## F. RAG/AEO Rules

Rules for AI citation readiness:

**Structure:**
- Answer the question in the first sentence of the guide
- Short declarative sentences throughout
- Use `<p>` tags, not `<div>` soup — clean HTML is easier to parse
- Tables and checklists are highly extractable — prefer them over prose for lists of requirements or fees

**Headings:**
- `<h1>` matches `<title>` — consistent entity for AI
- `<h2>` section labels are short and keyword-accurate
- No marketing language in headings ("The Ultimate...", "Everything You Need...")

**Entities:**
- Use official names consistently: MOHRE, ICA, GDRFA, AMER, Tasheel, Tawjeeh, DLD, DED, CBUAE, DEWA, RTA, DHA
- Consistent spelling across EN and RU pages
- Year in title for time-sensitive content

**Schema:**
- HowTo JSON-LD auto-generated for all guides with ≥2 steps ✓ (live)
- BreadcrumbList on all guide and hub pages ✓ (live)
- Article schema on all guides ✓ (live)
- Event schema on events where `schema_eligible = 1` (live)
- Organization + WebSite schema on root layout (priority gap to fill)

**Source signals:**
- Source note component renders inline before steps — signals trustworthiness to AI
- Label type clearly: "AMER service-centre notes" vs "ICA/GDRFA official guidelines" vs "DLD official data"
- "Checked [Month Year]" freshness signal — update when content is re-verified

**Prohibited:**
- Vague filler: "Once complete, you will then proceed to…"
- Repeated explanations across fields
- Keyword stuffing
- Em-dash chains
- Theatrical framing: "This is the pivot of the process"

---

## G. Internal Linking Rules

**Cluster integrity:**
- Every new guide must link back to its cluster hub (via breadcrumb + related guides)
- Every hub must link to all key child guides
- No orphan pages — every new guide must be linked from at least one hub or parent page

**Related guides (`lib/related-guides.ts`):**
- Every entry must use slugs that exist as published rows in the `guides` table
- Verify with: `SELECT slug FROM guides WHERE published=1` before adding
- Maximum 3 related guides per page — quality over quantity
- Prefer same-cluster guides in slots 1–2, cross-cluster in slot 3
- After any new guide is published, add it to related-guides of 2–3 existing guides

**Hub cards (family, golden, company-setup hubs):**
- Card order = user journey priority (new actions first, renewal/maintenance last)
- All hrefs must return 200 or redirect to the canonical group page
- EN hrefs must point to EN, RU hrefs must point to RU — never cross

**Anchor text:**
- Natural, descriptive, non-repetitive
- Good: "parents visa in Dubai", "renew a family residence visa", "property Golden Visa"
- Bad: same anchor on 5 pages, keyword spam, "click here"

**Pre-deploy link QA (mandatory):**

```
1. No dead slugs in related-guides.ts (query DB to verify)
2. All hub card hrefs return 200 locally
3. RU hub card hrefs point to /ru/guides/ not /guides/
4. Related guides section renders at least 1 card per guide
5. No circular link that provides no value (A→B→A with no content reason)
```

---

## H. Regression-Safe Checklist

Every deployment phase must check against this list. These are patterns that have caused real issues in this project.

### Content mistakes

| Check | Past incident |
|---|---|
| No `guaranteed` / `always required` wording | AMER data integration — overclaiming |
| No "official fee AED X" without citation | AMER fee framing |
| No salary threshold without "case by case" label | AED 10,500 sponsor income |
| No deposit amount without "Amer notes reference" label | AED 5,000 parent deposit |
| No performer/attendance claims in events without official source | Event schema phase |
| No unsupported exact dates for recurring events | Calendar expansion — recurring events |
| No Ukraine-specific content in general UAE guides | AMER data briefing |
| No "absconding" fee claims | AMER data briefing |

### Technical mistakes

| Check | Past incident |
|---|---|
| Verify dead slugs fixed in related-guides.ts | `child-dependent-dubai-inside` — never existed in DB |
| Confirm RU pages have Russian content — no EN fallback | Multiple phases — `ru_title` empty = guide excluded from RU routes |
| Check `lastUpdated` updated when content changes | Content drift without freshness signal |
| Confirm `data/guides.db` never committed to git | gitignore rule — DB is gitignored |
| Never copy local DB over production DB | Production DB is source of truth |
| Always create timestamped DB backup before production DB write | Lost data risk |
| Use `python3` not `tsx`/`node` for DB scripts | tsx/node EPERM failures on macOS |
| Deploy only via `bash scripts/deploy-zero-downtime.sh` | Never manual PM2 stop/start |
| Run `npm run build` locally before committing | Catch TypeScript errors early |
| Check page count stays consistent (or increases by expected amount) | Build regressions |

### Internal linking mistakes

| Check | Past incident |
|---|---|
| All slugs in `related-guides.ts` verified against DB | `spouse-dependent-dubai-inside` dead slug — 2 phases to fix |
| EN hub cards use `/guides/` prefix, RU use `/ru/guides/` | Cross-language link risk |
| Related guides section renders ≥ 1 card after build | `renew-family-visa-dubai` silently showed 1/3 cards |
| No spouse/child guide referenced by old short slug names | `spouse-dependent-dubai-*` pattern — dead |

### SEO mistakes

| Check | Past incident |
|---|---|
| New pages submitted to GSC after deploy | Parents visa not initially submitted |
| Sitemap includes new pages (check after build) | Events/news not in sitemap (6C-99A audit) |
| Canonical correct — each page self-canonicalises | Hreflang audit |
| Hreflang bidirectional — both pages reference each other | Missing EN→RU on some events |
| RU page has `ru_title` — otherwise excluded from RU static generation | RU filtering logic in generateStaticParams |

---

## I. Conversion System

### Commercial page CTAs

Every guide page must have at minimum:

| Position | CTA | Implementation |
|---|---|---|
| After RouteSnapshot | "Find My Route" + "Ask an Expert" (WhatsApp) | Two-button row — current ✓ |
| Footer of guide page | WhatsApp block | Current ✓ |
| Hub pages | "Find My [X] Route" CTA block | Current ✓ on family hub |

**Conversion wording rules:**
- "Ask an Expert" — not "Contact Sales" or "Hire Us"
- "Guidex can review..." — in overview, not in step cards
- WhatsApp number must not change without a production deploy + test

### GA4 event tracking (plan — not yet implemented)

| Event name | Trigger |
|---|---|
| `whatsapp_click` | Any WhatsApp CTA click |
| `route_finder_click` | "Find My Route" click |
| `guide_view` | Guide page view (page_view is automatic but tag with guide slug) |
| `guide_step_view` | Scroll past step section (75% scroll depth) |
| `cta_click` | Any non-WhatsApp CTA |
| `calendar_event_click` | Click on an event from a calendar page |
| `related_guide_click` | Click on related guide card |

Implementation note: GA4 is not yet live. When added, use `next/script` with `afterInteractive` strategy. Do not block page render.

---

## J. 90-Day Growth Plan

This is a framework, not a forecast. Do not publish fake traffic numbers.

### Days 1–7: GSC baseline

- Export GSC data for the past 28 days (if any data exists)
- Identify all indexed pages
- Identify queries driving impressions
- Identify pages position 8–30
- Fix any crawl errors or "discovered not indexed" pages
- Submit sitemap if not already submitted
- Submit all priority guide URLs manually if new

### Days 8–30: Cluster strengthening

**Visa cluster (highest commercial priority):**
- Improve title/meta on guides where CTR < 2%
- Add or improve FAQ section on 2–3 high-impression visa guides
- Ensure all visa guides have 3 working related guides
- Verify newborn/parents/renew cluster links are all clean ✓ (done)

**Calendar cluster:**
- Ensure all current + next 2 months have content and are indexed
- Verify event pages have correct schema
- Identify 2–3 missing calendar month pages and plan content

**Do not publish new pages unless quality bar is fully met.**

### Days 31–60: Selective expansion

- Add 1–2 new visa guides if there is GSC evidence of demand (impressions for an unranked query)
- Add 1–2 new life setup guides (Ejari, DEWA, or driving license — confirmed high-intent)
- Deepen calendar cluster for Q4 events if GSC shows demand
- Internal link cleanup pass if new pages were added

### Days 61–90: Business setup + authority signals

- Strengthen company setup cluster with 1–2 new guides (VAT registration, MOHRE)
- Review backlink profile — identify any natural brand mentions to build on
- Review GSC coverage tab — are previously "discovered, not indexed" pages now indexed?
- Assess: is a 4th cluster (life setup) ready to be its own hub?
- Decide: next 90 days investment based on actual GSC data

### Growth metrics to track (not to invent)

| Metric | Track in GSC | Target direction |
|---|---|---|
| Total impressions | Performance → Pages | ↑ |
| Total clicks | Performance → Pages | ↑ |
| Average CTR | Performance → Queries | ↑ (target: >3% portfolio average) |
| Average position | Performance → Pages | ↓ (lower = better) |
| Indexed pages | Coverage → Valid | ↑ (track vs published count) |
| Rich result eligibility | Enhancements → HowTo | ↑ |

---

## Appendix: Current architecture state (as of 2026-07-01)

| Area | Status |
|---|---|
| Guides DB (SQLite) | 18 published guides (visa: 9, company: 4, government: 3, living: 1, other: 1) |
| EN guide routes | All 18 published, static SSG, 200 ✓ |
| RU guide routes | Live where `ru_title != ""` — all 18 have RU content |
| HowTo JSON-LD | Auto-generated for all guides ≥ 2 steps ✓ |
| BreadcrumbList JSON-LD | On all guide + hub pages ✓ |
| Source notes | On AMER/GDRFA-backed guides ✓ |
| Related guides | Cleaned — no dead slugs in visa cluster ✓ |
| Hreflang | Bidirectional EN/RU on all guide pages ✓ |
| Sitemap | Includes all published guides, events, news, calendar pages |
| Organization schema | Not yet implemented (gap) |
| GA4 | Not yet implemented (gap) |
| Production deploy | Zero-downtime via `scripts/deploy-zero-downtime.sh` ✓ |
| Production DB backup | Timestamped backup before every DB write ✓ |
