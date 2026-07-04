# Guidex GSC Weekly Review — Week 01

**Week of:** 2026-07-04  
**Phase:** 6C-GSC-WEEKLY-01  
**Checked by:** Claude (doc prep) — requires owner to complete GSC section  
**Production commit reviewed:** `d2bf962` (SEO operating system docs)  
**Production HEAD:** `6da016d` (newborn visa linking cleanup — last deployed code)

---

## 1. GSC Data Status

**GSC data available:** NO

No actual Google Search Console performance exports (impressions, CTR, average position, clicks) were found anywhere in the repo:

- No CSV or XLSX exports
- No GA4 exports
- No manually recorded query/page metrics

**What exists instead (tracking docs only, not performance data):**

| File | What it is | Coverage period |
|---|---|---|
| `6c-seo-post-import-01-gsc-submission-log.md` | List of URLs submitted to GSC | 2026-06-20 submissions |
| `6c-seo-post-import-01-gsc-indexing-checklist.md` | Pre-submission URL list | Phase 6C-03 deploy |
| `6c-seo-post-import-02-gsc-checklist.md` | Submission checklist for 04B deploy | 2026-06-26 submissions |
| `6c-visas-parents-seo-post-publish-01-report.md` | Technical QA + GSC submission list | 2026-06-29 — no performance data |
| `LIFE_SETUP_GSC_SUBMISSION_CHECKLIST.md` | Submission checklist for life-setup pages | ~2026-05-25 |

**Conclusion:** The owner has been submitting pages to GSC, but no performance data has been exported or recorded. This is week 1 of formal GSC review — no historical baseline exists yet.

---

## 2. What We Know Without GSC Export

### Site context

| Fact | Source |
|---|---|
| Domain: `guidex-consulting.ae` | Live production |
| Site launch: approximately 2026-04 (calendar pages first submitted ~May) | Phase log |
| Age at this review: ~10–12 weeks | Inferred from phase log |
| Expected GSC data available: yes, if property was verified at launch | Operating system assumption |
| 19 published guides (DB) + calendar/event/news pages | PROJECT_STATE.md |
| Total static pages: ~90+ (last build count: 90/90) | Build logs |

### Technical SEO state (all confirmed, no issues)

| Signal | Status |
|---|---|
| Sitemap | Generated, includes all published guides + events + calendar pages ✓ |
| Canonical | Correct on all guide and hub pages ✓ |
| Hreflang (EN/RU) | Bidirectional on all guide pages ✓ |
| HowTo JSON-LD | Auto-generated for all guides ≥2 steps ✓ |
| BreadcrumbList | On all guide + hub pages ✓ |
| Mobile-first rendering | SSG only, no client-side rendering ✓ |
| Organization schema | **Implemented** — `OrgSchema.tsx` in both EN + RU layouts ✓ |
| GA4 | **NOT implemented** — identified gap |
| Related guides | No dead slugs in visa cluster — cleaned 2026-07-01 ✓ |

### Known pending GSC submission items

Based on existing submission logs, the following URLs may still be pending recheck or submission:

| URL | Last status | Action needed |
|---|---|---|
| `https://guidex-consulting.ae/calendar/october-2026-dubai-calendar` | "Pending quota" (2026-06-20 log) | Submit if not done |
| `https://guidex-consulting.ae/ru/calendar/october-2026-dubai-calendar` | "Pending quota" | Submit if not done |
| `https://guidex-consulting.ae/events/gitex-global-2026` | "Pending quota" | Submit (content corrected in Phase 03) |
| `https://guidex-consulting.ae/events/formula-1-abu-dhabi-grand-prix-2026` | "Pending quota" | Submit if not done |
| `https://guidex-consulting.ae/ru/visas` | "Pending quota (carry-forward)" | Submit |
| `https://guidex-consulting.ae/guides/parents-visa-dubai` | P0 list (2026-06-29) — not confirmed submitted | Submit |
| `https://guidex-consulting.ae/ru/guides/parents-visa-dubai` | P0 list (2026-06-29) — not confirmed submitted | Submit |
| `https://guidex-consulting.ae/guides/newborn-visa-dubai` | Linking fix deployed 2026-07-01 | Submit for reindex |
| `https://guidex-consulting.ae/ru/guides/newborn-visa-dubai` | Same | Submit for reindex |

**Recheck dates flagged in prior docs:**
- **2026-07-03** (now past) — should have checked indexing status of expand-north-star-2026 and other calendar pages. Check this now.
- **2026-07-10** (upcoming) — check Event rich result status for expand-north-star-2026.

---

## 3. Manual GSC Export — Required Before Next Review

The owner must complete this before the next weekly review. Without this data, no content investment decision can be made.

### Step 1 — Property verification

Confirm in Google Search Console that the property `guidex-consulting.ae` is verified and the status shows "Ownership confirmed." If the property shows 0 impressions over 28 days, the domain may be too new for significant data yet — document this.

### Step 2 — Performance exports

**A. Queries export**

1. GSC → Performance → Search results
2. Date range: **Last 28 days** (adjust if < 28 days of data)
3. Click **Queries** tab
4. Sort by **Impressions** descending
5. Click **Export** → Download CSV
6. Save as: `docs/content-drafts/seo/data/gsc-queries-YYYYMMDD.csv`

**B. Pages export**

1. Same Performance view
2. Click **Pages** tab
3. Sort by **Impressions** descending
4. Click **Export** → Download CSV
5. Save as: `docs/content-drafts/seo/data/gsc-pages-YYYYMMDD.csv`

**C. Countries export**

1. Click **Countries** tab
2. Export CSV
3. Save as: `docs/content-drafts/seo/data/gsc-countries-YYYYMMDD.csv`

**D. Devices export**

1. Click **Devices** tab
2. Export CSV
3. Save as: `docs/content-drafts/seo/data/gsc-devices-YYYYMMDD.csv`

### Step 3 — Indexing / Coverage check

1. GSC → Indexing → Pages
2. Record:
   - Count of **Indexed** pages
   - Count of **Crawled - currently not indexed**
   - Count of **Discovered - currently not indexed**
   - Any error types listed
3. Fill into `6c-gsc-export-template.md` (Section 5)

### Step 4 — Enhancements check

1. GSC → Enhancements → **HowTo** — are visa guide pages eligible for rich results?
2. GSC → Enhancements → **Breadcrumbs** — any errors?
3. GSC → Enhancements → **Events** — what is expand-north-star-2026 status? (recheck deadline: 2026-07-10)

### Step 5 — Sitemaps check

1. GSC → Indexing → Sitemaps
2. Record:
   - Sitemap URL submitted
   - Last crawl date
   - Pages discovered count

### Step 6 — URL Inspection for priority pages

Run URL Inspection for each of these and record result ("URL is on Google" / "URL not on Google" / "Crawled - currently not indexed"):

```
https://guidex-consulting.ae/guides/parents-visa-dubai
https://guidex-consulting.ae/ru/guides/parents-visa-dubai
https://guidex-consulting.ae/guides/newborn-visa-dubai
https://guidex-consulting.ae/ru/guides/newborn-visa-dubai
https://guidex-consulting.ae/calendar/november-2026-dubai-calendar
https://guidex-consulting.ae/calendar/december-2026-uae-calendar
https://guidex-consulting.ae/events/expand-north-star-2026
```

### Step 7 — Submit pending URLs

For any URL in Section 2's pending list that has not been submitted:
1. GSC → URL Inspection → paste URL → Request Indexing
2. Log submission in `6c-gsc-weekly-01-submission-log.md` (create on submission)

---

## 4. Context — What Google Is Likely Testing

Based on site age (~10–12 weeks since launch) and submission pattern, Google is likely:

1. **Crawling the sitemap** — all pages are in sitemap, so Googlebot has the full URL list
2. **Testing new domain authority** — `guidex-consulting.ae` is new; Google grants limited initial authority to new .ae domains
3. **Evaluating topical coverage** — the visa cluster (9 guides) is the most cohesive cluster; Google evaluates topical depth
4. **Processing recent submissions** — parents-visa-dubai submitted 2026-06-29, newborn linking fix deployed 2026-07-01; these need ~2–4 weeks to reflect in performance data
5. **Possible sandbox effect** — new sites often have suppressed rankings for the first 6–12 months; impressions may be low even for technically correct pages

**Realistic expectation for week 1 review:**
- Total impressions may be very low (tens to hundreds, not thousands)
- CTR data may be insufficient for conclusions
- Position data may fluctuate significantly on new domain
- Most value from this review: confirming pages are indexed, not diagnosing CTR

---

## 5. Data Needed Before Content Decision

**Do not start a new content cluster** until the owner exports GSC data and these questions are answered:

| Question | Why it matters |
|---|---|
| Are the 19 published guides indexed? | If guides aren't indexed, more content is wasted effort |
| What queries are driving impressions? | Confirms which cluster Google is testing first |
| Are visa pages getting impressions? | If yes → strengthen; if no → check for indexing issues |
| Are calendar pages getting impressions? | Calendar pages may index faster (fresh content signal) |
| What countries are sending impressions? | UAE + RU = expected; UK/US = bonus; other = investigate |
| Are there crawl errors? | Any "Discovered, not indexed" = technical issue to fix |

---

## 6. Risks and Unknowns

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GSC property not verified or misconfigured | Low (site is live, submissions made) | High (zero data forever) | Owner checks property verification |
| New domain sandbox effect | Medium | Medium (delays ranking, not blocking) | Continue publishing quality content; wait |
| Calendar pages competing with established sites | High | Medium | Ensure dates, schema, and freshness signals are correct |
| Hreflang not fully processed yet | Medium (new domain) | Low (RU pages may not rank for RU queries yet) | Give Google 4–8 more weeks; no action |
| Organization schema | Confirmed live ✓ | Resolved | No action needed |
| GA4 not tracking | Confirmed | High (zero conversion data) | Implement — see Action Plan |
| P1 pending submissions not yet done | Unknown | Medium (pages not being crawled) | Owner submits pending URLs |

---

## 7. Summary

**This week's review is blocked by missing GSC data.**

No impressions, CTR, position, or indexing data is available in the repo. The owner must export GSC data and fill the template (`6c-gsc-export-template.md`) before content decisions can be made.

**What is known with confidence:**
- All 19 guides are live, technically correct (schema, hreflang, canonical, sitemap) ✓
- Visa cluster internal links are clean ✓
- Parents visa page is new (submitted 2026-06-29) — needs 2–4 weeks to appear in GSC data
- Newborn linking fix just deployed — submit for reindex
- Several P1 URLs from June submissions may still be pending

**Next action:** Owner runs manual GSC export (Section 3 above) and fills `6c-gsc-export-template.md`. Weekly review restarts from Week 02 with real data.
