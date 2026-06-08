# Production Deploy Report — Phase 6C-99C
## Guide Structured Data | Date: 2026-06-08

---

## Phase summary

Phase 6C-99C added Article and HowTo JSON-LD structured data to all 17 published guide pages (EN + RU = 34 pages). Added missing BreadcrumbList to the TRC custom page. All changes are code-only — no DB writes, no migrations, no schema changes.

---

## Commit

| Field | Value |
|---|---|
| Commit hash | 27c6f67 |
| Branch | main |
| Message | "fix: add guide article and howto schema" |

---

## Deploy

| Field | Value |
|---|---|
| Deploy command | `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"` |
| Build time | 50s |
| Reload time | ~1s |
| PM2 status | online, 147.0 MB |
| Health check | HTTP 200 ✓ |
| Old PM2 stop/build/start used | NO |

---

## Files committed

| File | Change |
|---|---|
| `lib/db/reader.ts` | Added `updatedAt: string` to `GuideData` interface; exposed `updated_at` column in `getGuideGroup()` and `getPublishedGuideBySlug()` |
| `app/(en)/(public)/guides/[slug]/page.tsx` | Article JSON-LD + HowTo JSON-LD |
| `app/ru/guides/[slug]/page.tsx` | Article JSON-LD + HowTo JSON-LD (RU locale) |
| `app/(en)/(public)/guides/tax-residency-certificate-uae/page.tsx` | BreadcrumbList (was missing) + Article + HowTo |
| `app/ru/guides/tax-residency-certificate-uae/page.tsx` | BreadcrumbList + Article + HowTo (RU locale) |
| `docs/content-drafts/seo/GUIDE_SCHEMA_RAG_FIX_LOG_6C99C.md` | Phase log |
| `docs/content-drafts/seo/GUIDE_SCHEMA_ELIGIBILITY_MATRIX_6C99C.md` | Eligibility matrix for all 17 guides |
| `docs/content-drafts/seo/GUIDE_RAG_AEO_GAP_LIST_6C99C.md` | Gap list and future recommendations |
| `PROJECT_STATE.md` | Updated |
| `SESSION_LOG.md` | Updated |

---

## Schema summary

| Schema type | Pages | Notes |
|---|---|---|
| Article | 17 EN + 17 RU = **34** | All published guides |
| HowTo | 17 EN + 17 RU = **34** | All 17 procedural, 3–12 steps each |
| BreadcrumbList (new) | 2 | TRC custom pages (EN+RU) — was missing before |
| FAQPage | 0 | No visible FAQ blocks on any guide page |

---

## Article schema fields

| Field | Value / Source | Confirmed |
|---|---|---|
| `@type` | `Article` | ✓ |
| `headline` | guide.title (locale-aware) | ✓ |
| `description` | guide.summary (locale-aware) | ✓ |
| `url` | Canonical URL | ✓ |
| `inLanguage` | `"en"` or `"ru"` per locale | ✓ |
| `dateModified` | `guide.updatedAt` (ISO from DB `updated_at`) | ✓ — "2026-04-29 20:33:55" |
| `publisher` | `{ "@type": "Organization", "name": "Guidex Consulting" }` | ✓ |
| `author` | NOT present — correct | ✓ |
| `datePublished` | NOT present — correct | ✓ |
| `image` | NOT present — correct | ✓ |

---

## HowTo schema fields

| Field | Value / Source | Confirmed |
|---|---|---|
| `@type` | `HowTo` | ✓ |
| `name` | guide.title (locale-aware) | ✓ |
| `description` | guide.summary (locale-aware) | ✓ |
| `step[].@type` | `HowToStep` | ✓ |
| `step[].name` | step.title (locale-aware) | ✓ |
| `step[].text` | step.what (locale-aware) | ✓ |
| `totalTime` | NOT present — correct | ✓ |
| `estimatedCost` | NOT present — correct | ✓ |

Confirmed on EN mainland-company: HowTo step count = 8, step 1 = "Choose Your Business Activity".
Confirmed on RU TRC: step 1 = "Определить цель сертификата" (Russian).

---

## Live QA results (21/21 checks pass)

| Route | Status | Schema types |
|---|---|---|
| /guides/employment-visa | 200 PASS | Organization, WebSite, BreadcrumbList, Article, HowTo |
| /ru/guides/employment-visa | 200 PASS | Same (RU locale) |
| /guides/mainland-company-setup-dubai | 200 PASS | Same |
| /ru/guides/mainland-company-setup-dubai | 200 PASS | Same |
| /guides/free-zone-company-setup-dubai | 200 PASS | Same |
| /ru/guides/free-zone-company-setup-dubai | 200 PASS | Same |
| /guides/golden-visa-dubai-property | 200 PASS | Same |
| /ru/guides/golden-visa-dubai-property | 200 PASS | Same |
| /guides/tax-residency-certificate-uae | 200 PASS | Same (custom page) |
| /ru/guides/tax-residency-certificate-uae | 200 PASS | Same (custom page, RU) |
| /guides/holiday-home-permit-dubai | 200 PASS | Same |
| /guides/open-business-bank-account-dubai | 200 PASS | Same |
| /ru/guides/open-business-bank-account-dubai | 200 PASS | Same |
| /guides/document-attestation-dubai | 200 PASS | Same |
| /ru/guides/newborn-visa-dubai | 200 PASS | Same |
| /ru/guides/spouse-dependent-visa-dubai-inside-country | 200 PASS | Same |
| /events/gitex-global-2026 | 200 PASS | Organization, WebSite, Event (no bleed) |
| /ru/events/gitex-global-2026 | 200 PASS | Organization, WebSite, Event |
| /news/uae-emiratisation-june-30-2026-deadline | 200 PASS | Organization, WebSite, NewsArticle |
| /calendar/december-2026-uae-calendar | 200 PASS | Organization, WebSite |
| / (homepage) | 200 PASS | Organization, WebSite |
| Sitemap | 92 URLs, 10 event, 6 news | PASS (unchanged from 6C-99B) |

---

## Issues found

None.

---

## Rollback needed

No.

---

## Recommended next owner actions

1. **Test structured data with Google Rich Results Test:**
   - URL: https://search.google.com/test/rich-results
   - Test: https://guidex-consulting.ae/guides/employment-visa
   - Test: https://guidex-consulting.ae/guides/mainland-company-setup-dubai
   - Verify Article eligibility and any HowTo recognition

2. **Content review for oldest guides:**
   - `employment-visa` — last updated April 2025 (14+ months old)
   - `child-dependent-visa-dubai-outside-country` — last updated April 2025
   - Review MOHRE/ICA fee accuracy before next content cycle

3. **GSC monitoring:**
   - Continue watching "Pages" → "Why pages aren't indexed" in Google Search Console
   - Monitor Performance report for guide page impressions

---

## Recommended next development phase

**Phase 6C-99D — Internal Linking, Hub Pages and Commercial SEO Architecture**

Priority tasks from the gap list:

1. **Step anchors** (`id="step-{n}"` on StepCard) — enables HowToStep URL references, in-page deep-linking, and table-of-contents linking. Template-only change, no DB migration.

2. **Source notes** — add visible `Source: [authority]` attribution per guide. Requires new `source_url` + `source_label` fields on guides table (DB migration).

3. **Related guides** — add cross-links between companion guides. Requires `related_guides_json` field (DB migration).

4. **Hub page Article schema** — add Article schema to `/guides/child-dependent-visa-dubai` and `/guides/spouse-dependent-visa-dubai` tab pages. No DB migration needed; data from guide-groups config.

5. **Authority backlinks** — still the primary organic traffic blocker. No code solution.

Do NOT start Phase 6C-99D until owner approves.

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| Zero-downtime deploy only | ✓ |
| No old PM2 stop/build/start | ✓ |
| No production DB write | ✓ |
| No migrations | ✓ |
| No admin | ✓ |
| No AI Inbox | ✓ |
| No content import | ✓ |
| No unrelated changes committed | ✓ |
| No destructive commands | ✓ |
| No fake schema fields | ✓ |
| No unsupported legal/tax/visa claims | ✓ |
