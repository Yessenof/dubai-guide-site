# Guide Schema RAG/AEO Fix Log — Phase 6C-99C
## Date: 2026-06-08 | LOCAL ONLY — NO DEPLOY, NO PUSH

---

## Phase summary

Added Article and HowTo JSON-LD structured data to all 17 published guide pages. Added BreadcrumbList to the TRC custom page (was missing). All existing schema (Organization, WebSite, BreadcrumbList) preserved. All 17 guides are procedural with full step data and full RU content — all are HowTo-eligible. No FAQPage schema added (no visible FAQ blocks on any guide page).

---

## Baseline

| Field | Value |
|---|---|
| Branch | main |
| Commit at phase start | 2e499c5 (Phase 6C-99B-PROD complete) |
| Package manager | npm |
| Build command | `npm run build` |
| Guide routes | `/guides/[slug]` (EN SSG), `/ru/guides/[slug]` (RU SSG) |
| Published guides | 17 |
| Guides with RU content | 17/17 |
| Guides with steps | 17/17 |
| Guides with RU steps | 17/17 |

### Pre-change schema on guide pages

| Schema type | Present before phase |
|---|---|
| Organization | YES — from layout via OrgSchema component |
| WebSite | YES — added in Phase 6C-99B |
| BreadcrumbList | YES — in main [slug] template; MISSING from TRC custom page |
| Article | NO |
| HowTo | NO |
| FAQPage | NO |

---

## Files changed

| File | Change |
|---|---|
| `lib/db/reader.ts` | Added `updatedAt: string` to `GuideData` interface; added `updatedAt: guide.updatedAt` to `getGuideGroup()` and `getPublishedGuideBySlug()` return values |
| `app/(en)/(public)/guides/[slug]/page.tsx` | Added Article + HowTo JSON-LD |
| `app/ru/guides/[slug]/page.tsx` | Added Article + HowTo JSON-LD |
| `app/(en)/(public)/guides/tax-residency-certificate-uae/page.tsx` | Added BreadcrumbList + Article + HowTo JSON-LD (BreadcrumbList was missing from this custom page) |
| `app/ru/guides/tax-residency-certificate-uae/page.tsx` | Added BreadcrumbList + Article + HowTo JSON-LD |

---

## Schema added per page

### Main template: `app/(en)/(public)/guides/[slug]/page.tsx`
Covers 16 of 17 guides (all except `tax-residency-certificate-uae`).

**Article JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[guide.title]",
  "description": "[guide.summary]",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "[canonical URL]" },
  "url": "[canonical URL]",
  "inLanguage": "en",
  "dateModified": "[guide.updatedAt — ISO timestamp]",
  "publisher": { "@type": "Organization", "name": "Guidex Consulting", "url": "[BASE]" }
}
```

**HowTo JSON-LD (output when guide.steps.length >= 2):**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[guide.title]",
  "description": "[guide.summary]",
  "step": [
    { "@type": "HowToStep", "name": "[step.title]", "text": "[step.what]" },
    ...
  ]
}
```

### RU template: `app/ru/guides/[slug]/page.tsx`
Same structure. `inLanguage: "ru"`, url: `/ru/guides/{slug}`, Russian title/description/step text.

### TRC custom page: `app/(en)/(public)/guides/tax-residency-certificate-uae/page.tsx`
Added BreadcrumbList (was absent), plus Article + HowTo with same logic as main template.

### RU TRC custom page: `app/ru/guides/tax-residency-certificate-uae/page.tsx`
Same. BreadcrumbList added with Russian item names. Article inLanguage: "ru". HowTo with Russian step data.

---

## Schema fields used

### Article
| Field | Source | Note |
|---|---|---|
| `headline` | `guide.title` | Locale-appropriate |
| `description` | `guide.summary` | Locale-appropriate |
| `mainEntityOfPage` | `{ "@type": "WebPage", "@id": URL }` | Standard |
| `url` | Canonical URL | EN or RU |
| `inLanguage` | `"en"` or `"ru"` | Per locale |
| `dateModified` | `guide.updatedAt` | ISO timestamp from DB |
| `publisher` | Organization block | Matches global OrgSchema |

**Not used:** `datePublished` (last_updated is human text; created_at is admin entry time — not reliable editorial publication date), `image` (no stable guide images), `author` (not in DB).

### HowTo
| Field | Source | Note |
|---|---|---|
| `name` | `guide.title` | Locale-appropriate |
| `description` | `guide.summary` | Locale-appropriate |
| `step[].name` | `step.title` | Locale-appropriate |
| `step[].text` | `step.what` | Locale-appropriate |

**Not used:** `totalTime` (`timeline` is human text, not ISO 8601 duration), `estimatedCost` (`price` is human text, not structured), `supply`/`tool` (not in DB), `HowToStep.url` (no stable step anchor IDs in template).

---

## Pages with Article schema: 17 EN + 17 RU = 34

All published guide pages including TRC custom page.

## Pages with HowTo schema: 17 EN + 17 RU = 34

All 17 guides have 3+ steps with full EN and RU content — all eligible.

## Pages skipped for HowTo: 0

All published procedural guides are eligible. No thin or non-procedural guides exist.

## Pages with FAQPage schema: 0

No guide pages have visible FAQ blocks. No FAQPage schema added.

## Pages that gained BreadcrumbList this phase: 2

`/guides/tax-residency-certificate-uae` (EN + RU) — was missing before; added alongside Article + HowTo.

---

## Visible RAG/AEO blocks status

No new visible content blocks were added in this phase. The existing visible blocks are:

| Block | Status |
|---|---|
| RouteSnapshot (cost, timeline, audience, step count, first step) | PRESENT on all 17 guides |
| Step outline (numbered list above detailed steps) | PRESENT on all 17 guides |
| Detailed StepCard blocks (title, what, where, address, cost, time, advice, warning) | PRESENT on all 17 guides |
| Overview paragraphs | PRESENT on all 17 guides |
| CTAs (Find My Route + Ask an Expert + footer CTA) | PRESENT on all 17 guides |
| Source note | ABSENT on all — documented as gap in GUIDE_RAG_AEO_GAP_LIST_6C99C.md |
| Related guides links | ABSENT on all — documented as gap |
| Calendar link | ABSENT on all — documented as gap |

---

## Build result

| Check | Result |
|---|---|
| Build command | `npm run build` |
| Result | PASS |
| Static pages | 88 (unchanged) |
| TypeScript errors | 0 |

---

## QA results

| # | Check | Result |
|---|---|---|
| 1 | EN employment-visa: HTTP 200 | PASS |
| 2 | EN employment-visa: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 3 | EN employment-visa: Article headline = "How to Get an Employment Visa in Dubai Without Leaving the UAE" | PASS |
| 4 | EN employment-visa: Article inLanguage = "en" | PASS |
| 5 | EN employment-visa: Article url = https://guidex-consulting.ae/guides/employment-visa | PASS |
| 6 | EN employment-visa: Article dateModified present (ISO) | PASS — "2026-04-29 18:43:57" |
| 7 | EN employment-visa: HowTo name matches title | PASS |
| 8 | EN employment-visa: HowTo step count = 8 | PASS |
| 9 | EN employment-visa: HowTo step 1 name = "Submit Offer Letter, Labor Card, and Work Permit" | PASS |
| 10 | RU employment-visa: HTTP 200 | PASS |
| 11 | RU employment-visa: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 12 | RU employment-visa: Article inLanguage = "ru" | PASS |
| 13 | RU employment-visa: Article url = https://guidex-consulting.ae/ru/guides/employment-visa | PASS |
| 14 | RU employment-visa: HowTo name = "Рабочая виза в Дубае: оформление через компанию без выезда из ОАЭ" | PASS |
| 15 | RU employment-visa: HowTo step 1 = "Подача оффера, трудовой карты и разрешения на работу" | PASS |
| 16 | EN mainland-company: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 17 | RU mainland-company: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 18 | EN golden-visa: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 19 | EN holiday-home: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 20 | EN amer-center: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 21 | EN TRC custom page: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 22 | EN TRC: BreadcrumbList items = 3 | PASS |
| 23 | EN TRC: Article url = https://guidex-consulting.ae/guides/tax-residency-certificate-uae | PASS |
| 24 | EN TRC: HowTo step count = 8 | PASS |
| 25 | RU TRC custom page: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 26 | RU TRC: Article inLanguage = "ru" | PASS |
| 27 | RU TRC: Article url = https://guidex-consulting.ae/ru/guides/tax-residency-certificate-uae | PASS |
| 28 | RU TRC: HowTo step 1 = "Определить цель сертификата" (Russian) | PASS |
| 29 | EN TRC: No raw JSON visible in body | PASS |
| 30 | EN GITEX event page (regression): schemas = [Organization, WebSite, Event] — no Article/HowTo bleed | PASS |
| 31 | EN News page (regression): schemas = [Organization, WebSite, NewsArticle] — no Article/HowTo bleed | PASS |
| 32 | EN Calendar page (regression): schemas = [Organization, WebSite] — no Article/HowTo bleed | PASS |

---

## Remaining risks

| Risk | Severity | Notes |
|---|---|---|
| `dateModified` reflects last admin save, not last content review | LOW | This is a technical timestamp. Future admin saves may update it without editorial changes. Documented; no workaround without separate editorial date field. |
| `HowToStep` has no `url` field | LOW | No step anchor IDs exist. Not adding fake URLs. Future fix: add `id="step-{n}"` to StepCard. |
| `employment-visa` and `child-dependent-visa-dubai-outside-country` are 14+ months old | MEDIUM | Content risk (fee changes), not schema risk. Owner should review. |
| Hub pages (`child-dependent-visa-dubai`, `spouse-dependent-visa-dubai`) have no Article/HowTo schema | LOW | Not addressed this phase. Deferred to 6C-99D or later. |
| `tax-residency-certificate-uae` is high-risk topic | MANAGED | Schema accurately reflects visible step content. No legal certainty claimed. |

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| No deploy | ✓ |
| No push | ✓ |
| No production DB write | ✓ |
| No migrations | ✓ |
| No schema changes | ✓ — only added `updatedAt` field to reader.ts return values; no DB DDL |
| No admin | ✓ |
| No AI Inbox | ✓ |
| No content import | ✓ |
| No commit unless owner explicitly approves | ✓ |
| No destructive commands | ✓ |
| No fake schema fields | ✓ |
| No unsupported legal/tax/visa claims | ✓ |
