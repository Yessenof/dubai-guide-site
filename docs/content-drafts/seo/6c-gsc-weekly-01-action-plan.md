# Guidex GSC Weekly Action Plan — Week 01

**Week of:** 2026-07-04  
**Status:** GSC DATA NOT AVAILABLE — safe micro-tasks only  
**Phase:** 6C-GSC-WEEKLY-01  
**Production HEAD:** `6da016d`

---

## Decision: No New Content Phase This Week

**Reason:** The SEO Operating System requires GSC data before committing to a new content phase. No query impressions, page performance data, or indexing confirmation has been exported. Starting new content before confirming existing pages are indexed and performing is low-ROI.

**Exception:** Technical improvements that are data-independent (Organization schema, GA4) are approved because they improve future data availability and are identified gaps.

---

## Task 1 — Owner: Export GSC Data (Blocker)

**Priority: HIGHEST**  
**Who:** Owner (requires GSC access)  
**Estimated time:** 30 minutes  
**Output:** 4 CSV files in `docs/content-drafts/seo/data/`

Follow the exact steps in `6c-gsc-weekly-01-review.md` Section 3 (Manual GSC Export).

**What to record while in GSC:**
- Total impressions (last 28 days)
- Total clicks
- Average CTR
- Average position
- Indexed page count (Coverage → Valid)
- Any crawl errors (Coverage → Excluded)
- HowTo rich result status
- Sitemap crawl date

This data triggers Week 02 review and the first real content cluster decision.

---

## Task 2 — Owner: Submit Pending GSC URLs (High)

**Priority: HIGH**  
**Who:** Owner (requires GSC access)  
**Estimated time:** 15 minutes

The following URLs were in "pending quota" or "not confirmed submitted" status from prior phases. Submit these via GSC → URL Inspection → Request Indexing:

| URL | Source |
|---|---|
| `https://guidex-consulting.ae/calendar/october-2026-dubai-calendar` | Post-import-01 log: pending quota |
| `https://guidex-consulting.ae/ru/calendar/october-2026-dubai-calendar` | Same |
| `https://guidex-consulting.ae/events/gitex-global-2026` | Post-import-01 log: pending quota |
| `https://guidex-consulting.ae/events/formula-1-abu-dhabi-grand-prix-2026` | Post-import-01 log: pending quota |
| `https://guidex-consulting.ae/ru/visas` | Post-import-01 log: carry-forward pending |
| `https://guidex-consulting.ae/guides/parents-visa-dubai` | Post-publish SEO report: listed, submission not confirmed |
| `https://guidex-consulting.ae/ru/guides/parents-visa-dubai` | Same |
| `https://guidex-consulting.ae/guides/newborn-visa-dubai` | Linking fix deployed 2026-07-01 — submit for reindex |
| `https://guidex-consulting.ae/ru/guides/newborn-visa-dubai` | Same |

**GSC daily quota:** Request Indexing is limited to ~10–12 URLs per day. Spread across two days if needed:
- Day 1: parents-visa-dubai (EN+RU), newborn-visa-dubai (EN+RU), october calendar (EN+RU), ru/visas
- Day 2: GITEX, F1, remaining

**Also check July-03 recheck (now overdue):**
- Open URL Inspection for `expand-north-star-2026` EN+RU — confirm "URL is on Google"
- If "Crawled - currently not indexed" → request re-index and note in log

---

## Task 3 — Confirmed: Organization Schema Already Live

**Status: DONE — no action required**

`components/OrgSchema.tsx` is implemented and wired into both `app/(en)/(public)/layout.tsx` and `app/ru/layout.tsx`. Both Organization and WebSite schema JSON-LD blocks render on every public page.

```typescript
// components/OrgSchema.tsx (confirmed in use)
// Organization: name, url, logo, contactPoint (WhatsApp)
// WebSite: name, url
```

The gap listed in the SEO Operating System appendix was incorrect — it has been corrected.

**Optional future enhancement:** Add `description` and `availableLanguage` fields to the Organization schema. Not urgent — current schema is functional and indexable.

---

## Task 4 — Plan: GA4 Implementation

**Priority: MEDIUM (plan only this week, implement next)**  
**Who:** Claude (implementation) + Owner (GA4 property ID and tag)  
**Why now:** GA4 is the only way to measure conversion behavior (WhatsApp clicks, guide engagement). Without it, CTA optimization is impossible.

**What is needed from owner:**
1. GA4 Measurement ID (format: `G-XXXXXXXXXX`) — from GA4 property settings
2. Confirm which events to track first (recommend starting with `whatsapp_click` and `page_view`)

**Implementation plan (for next phase):**
1. Add `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX` to `.env.local` (production server + local)
2. Add `<Script>` component to root layout using `afterInteractive` strategy
3. Add `gtag` function calls for WhatsApp CTA clicks (using `onClick` handlers on client components)
4. Test with GA4 DebugView before deploying to production
5. Do NOT block page render — GA4 must be non-blocking

**This week:** Owner provides Measurement ID. No code this week.

---

## Task 5 — Review: July Event Schema Recheck (Overdue)

**Priority: MEDIUM**  
**Who:** Owner  
**Deadline:** 2026-07-10 (recheck date from post-import-02 checklist)

From `6c-seo-post-import-02-gsc-checklist.md`:
> "2026-07-10 (14 days post-deploy) — check Event rich result status for expand-north-star-2026 EN+RU. Confirm whether performer warning is suppressed when performer is absent from schema."

Action:
1. GSC → Enhancements → Events
2. Find `expand-north-star-2026` — check status (Valid / Valid with warnings / Error)
3. If "image" enhancement was previously flagged → click **Validate Fix** (image field was added in 6C-EVENTS-SCHEMA-01)
4. Record result in a new `6c-seo-post-import-02-events-recheck.md`

---

## Task 6 — Prepare: Next Content Phase Decision Tree

**Priority: LOW (decision only after GSC data)**  
**No implementation this week**

When GSC data is available, apply this decision tree:

```
IF visa pages have impressions > 100 AND CTR < 2%
  → Strengthen visa guide titles/meta first (no new content)

IF visa pages are indexed AND getting queries for "visa cancellation" or "Emirates ID"
  → Start Phase 6C-VISA-CANCELLATION-01 (Cluster B backlog P0)

IF calendar pages are indexed AND getting queries for "things to do Dubai August"
  → Start Phase 6C-CALENDAR-SEASONAL-01 (Aug/Sep seasonal pages)

IF no pages are indexed after 4+ weeks
  → Technical investigation priority — check Coverage → Excluded in GSC

IF life setup pages getting impressions for "Ejari Dubai" or "DEWA"
  → Start Phase 6C-LIFE-SETUP-GUIDES-01 (Cluster C backlog P0)

IF no clear signal from any cluster
  → Default to life setup cluster: lowest source risk, highest quality bar achievable
```

---

## This Week Summary

| Task | Owner | Estimated time | Blocks |
|---|---|---|---|
| Export GSC data → fill template | Owner | 30 min | All content decisions |
| Submit pending GSC URLs | Owner | 15 min | Indexing of 9 pages |
| July-03 recheck + expand-north-star recheck | Owner | 10 min | Rich result status |
| Read OrgSchema.tsx + plan implementation | Claude | 15 min | Task 3 approval |
| Confirm GA4 Measurement ID | Owner | 5 min | GA4 implementation |

**No new content phase this week.** Week 02 starts when GSC export is in hand.

---

## Week 02 Preview (conditional on GSC data)

If GSC export is provided by 2026-07-07:

- Week 02 review uses real impression/CTR/position data
- Content cluster decision is made from data, not assumptions
- First content phase likely: `6C-LIFE-SETUP-GUIDES-01` (Ejari) or `6C-VISA-EXTENSIONS-01` (visa cancellation) — whichever cluster shows demand
- If no impressions anywhere → `6C-ORG-SCHEMA-01` deploy (technical improvement, no content needed)
