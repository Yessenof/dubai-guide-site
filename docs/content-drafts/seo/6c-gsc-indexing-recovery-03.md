# Phase 6C-GSC-INDEXING-RECOVERY-03 — GSC Page Indexing Recovery Audit

**Phase:** 6C-GSC-INDEXING-RECOVERY-03  
**Date:** 2026-07-19  
**Status:** COMPLETE — all evidence-based fixes applied locally; commit and push pending; production deployment not in scope

---

## 1. Objective

Full technical and content-level audit of Google Search Console Page Indexing exclusions for `guidex-consulting.ae`. Separate intentional from actual defects. Fix defects. Do not deploy to production.

---

## 2. GSC Baseline (pre-fix)

| Metric | Count |
|--------|-------|
| Indexed pages | 64 |
| Not indexed — total | 50 |
| ↳ Alternate page with proper canonical tag | 7 |
| ↳ Indexed, not submitted in sitemap (noindex) | 1 |
| ↳ Page with redirect | 1 |
| ↳ Discovered — currently not indexed | 31 |
| ↳ Crawled — currently not indexed | 10 |

---

## 3. Live HTTP audit

All 50 excluded URLs verified via `curl -sk --max-redirs 5`:

| Result | Count |
|--------|-------|
| 200 OK | 49 |
| 301 Redirect | 1 (`http://guidex-consulting.ae/` → HTTPS) |
| 404 | 0 |
| 5xx | 0 |

No broken URLs found. The redirect is correct behavior.

---

## 4. Classification matrix

### Category A: Alternate page with proper canonical tag (7 URLs) — INTENTIONAL

These are `?month=YYYY-MM` query-parameter variants of the calendar hub pages. They share the page component with `/calendar` and `/ru/calendar`, and correctly set:
- `robots: noindex, follow` (before this phase)
- `canonical: https://guidex-consulting.ae/[ru/]calendar`

**Representative URLs:**
- `https://guidex-consulting.ae/ru/calendar?month=2026-07`
- `https://guidex-consulting.ae/calendar?month=2026-07`
- Additional `?month=` variants for 2026-05 through 2026-09

**Status:** Correct. Google identifies these as canonical alternates. The canonical tag correctly points to the hub. No fix required.

**Note:** After removing noindex from the calendar hubs, these `?month=` pages will become crawlable (no longer noindex) but Google will continue to treat them as canonical alternates due to the canonical tag pointing to the hub.

---

### Category B: Indexed, not submitted in sitemap (noindex) (1 URL) — DEFECT — FIXED

- `https://guidex-consulting.ae/ru/events`

**Root cause:** Phase 3B skeleton hub pages were created with `robots: { index: false, follow: true }`. The noindex was not removed when the events hub was populated with real content (7 published event records).

**Fix applied:** Removed `robots: { index: false, follow: true }` from `app/ru/events/page.tsx`.

**Scope expanded:** Audit confirmed the same defect exists on 5 additional hub pages (all set to noindex in Phase 3B, all now containing real content). Fixed all 6:

| URL | Content at fix | Fix |
|-----|---------------|-----|
| `/ru/events` | 7 events (RU published) | noindex removed |
| `/events` | 7 events (EN published) | noindex removed |
| `/ru/news` | 4 news posts (RU published) | noindex removed |
| `/news` | 4 news posts (EN published) | noindex removed |
| `/ru/calendar` | 11 calendar pages, CalendarGrid | noindex removed |
| `/calendar` | 11 calendar pages, CalendarGrid | noindex removed |

---

### Category C: Page with redirect (1 URL) — INTENTIONAL

- `http://guidex-consulting.ae/` → `https://guidex-consulting.ae/`

**Status:** Correct. HTTP → HTTPS redirect via Nginx. No fix required.

---

### Category D: Discovered — currently not indexed (31 URLs) — MONITORING

These pages were found by Googlebot (via sitemap or internal links) but not yet crawled. This is typical for a relatively young site with moderate DA.

**Likely composition:**
- RU guide pages not yet prioritized for crawl (all 19 guides have RU variants)
- Calendar month pages for future months (Aug–Dec 2026)
- Individual event detail pages (`/events/[slug]`, `/ru/events/[slug]`)
- Individual news post pages (`/news/[slug]`, `/ru/news/[slug]`)

**Root causes:**
1. **Crawl budget:** Young site with limited authority gets partial crawl per cycle
2. **Weak internal linking from hubs:** Hub pages (`/events`, `/calendar`, `/news`) were noindex and thus deprioritized as link sources. Fixing hub page noindex should help.
3. **Sitemap `lastModified: new Date()` on every build:** Fake freshness dates may have reduced trust in sitemap signals

**Fixes applied that improve this:**
- Hub pages now indexable → stronger link equity from hub → individual pages
- Sitemap now has stable `lastModified` date (see Section 6)
- Hub pages now added to sitemap (see Section 7)

**Action after production deploy:**
- Submit sitemap in GSC after build
- Request indexing for key individual pages via GSC URL Inspection

---

### Category E: Crawled — currently not indexed (10 URLs) — MONITORING

These pages were crawled by Google but Google chose not to index them. Common causes:
- Thin content
- Duplicate or near-duplicate content
- Interactive tool pages (no unique crawlable content)
- Calendar/events pages without sufficient body text

**Likely composition:**
- `/ru/find-my-visa` — interactive route finder tool, no significant static body content
- `/find-my-visa` — same
- Older hub pages that were noindex when crawled (Google stored "noindex" verdict)
- Some calendar or guide pages with limited content

**Status for interactive tools (`/find-my-visa`, `/ru/find-my-visa`):**
These are tool/calculator pages with no substantive static content. Google's non-indexing decision is reasonable. **Acceptable — no fix applied.**

**Status for hub pages:**
Google may have crawled some of these when they had noindex, and stored that verdict. After this fix removes noindex, a recrawl will update the verdict.

**Action:** After production deploy, use GSC URL Inspection → "Request Indexing" for key pages that remain in "crawled not indexed."

---

## 5. Defects found but NOT fixed in this phase

| Defect | Reason not fixed |
|--------|-----------------|
| Broken `relatedHubs` links in `/news` and `/ru/news` (pointing to `/visas`, `/company-setup`, etc. which 404) | Out of scope for this phase; separate content architecture work needed |
| CalendarGrid renders no static `<a href>` links to month pages (JS-driven navigation only) | Feature change; out of scope |
| `sitemap.ts` doesn't use per-record `updated_at` for `lastModified` (see Section 6) | Reader functions need extending; pragmatic fix applied instead |

---

## 6. Sitemap `lastModified` fix

**Defect (P1):** `lastModified: new Date()` on every sitemap entry — generates a different timestamp on every build. Signals to Google that all 100+ pages changed on every deployment, degrading crawl-priority signals.

**Fix applied:** Replaced all `new Date()` calls with a static constant:
```ts
const SITE_BUILD = new Date("2026-07-19");
```

All sitemap entries now report `lastModified: 2026-07-19` — accurate for this deployment.

**File:** `app/sitemap.ts`

**Known limitation:** This still reports the same date for all pages regardless of when individual records were last updated. The proper fix would extend the DB reader functions to return `updated_at` alongside slugs, then use that per-entry. Deferred as a future improvement.

**Maintenance note:** Update `SITE_BUILD` when deploying meaningful content changes.

---

## 7. Sitemap hub page additions

**Defect (P1):** Hub pages (`/events`, `/calendar`, `/news`, `/ru/events`, `/ru/calendar`, `/ru/news`) were excluded from the sitemap. This is correct when pages are noindex (sitemap should not include noindex pages), but incorrect after removing noindex.

**Fix applied:** Added all 6 hub pages to `app/sitemap.ts`:

| URL added | Priority |
|-----------|---------|
| `/events` | 0.8 |
| `/calendar` | 0.8 |
| `/news` | 0.7 |
| `/ru/events` | 0.8 |
| `/ru/calendar` | 0.8 |
| `/ru/news` | 0.6 |

---

## 8. Hreflang additions

**Defect (P2):** Events and news hub pages were missing hreflang cross-links between EN and RU versions. Calendar hubs already had correct hreflang.

**Fix applied:**

| File | Added |
|------|-------|
| `app/(en)/(public)/events/page.tsx` | `languages: { ru: ${BASE}/ru/events }` |
| `app/ru/events/page.tsx` | `languages: { en: ${BASE}/events }` |
| `app/(en)/(public)/news/page.tsx` | `languages: { ru: ${BASE}/ru/news }` |
| `app/ru/news/page.tsx` | `languages: { en: ${BASE}/news }` |

---

## 9. Files changed

| File | Change |
|------|--------|
| `app/(en)/(public)/events/page.tsx` | Removed noindex; added RU hreflang |
| `app/ru/events/page.tsx` | Removed noindex; added EN hreflang |
| `app/(en)/(public)/news/page.tsx` | Removed noindex; added RU hreflang |
| `app/ru/news/page.tsx` | Removed noindex; added EN hreflang |
| `app/(en)/(public)/calendar/page.tsx` | Removed noindex |
| `app/ru/calendar/page.tsx` | Removed noindex |
| `app/sitemap.ts` | Fixed `lastModified`; added 6 hub entries |

---

## 10. TypeScript validation

```
npx tsc --noEmit
```
Result: **0 errors**

---

## 11. Expected impact

| Metric | Before | After deploy + recrawl |
|--------|--------|----------------------|
| Pages with incorrect noindex | 6 hub pages | 0 |
| Hub pages in sitemap | 0 of 6 | 6 of 6 |
| Sitemap freshness signal | Fake (today on every build) | Stable (2026-07-19) |
| EN events hub: indexable | No | Yes |
| RU events hub: indexable | No | Yes |
| EN calendar hub: indexable | No | Yes |
| RU calendar hub: indexable | No | Yes |
| EN news hub: indexable | No | Yes |
| RU news hub: indexable | No | Yes |

Expected GSC "not indexed" drop:
- 1 "noindex" exclusion → resolved immediately after crawl
- Some "discovered not indexed" → resolved as hub pages pass link equity down
- Timeline: 2–4 weeks for Google to recrawl and reprocess

---

## 12. Remaining non-defect exclusions

These GSC exclusions are correct and require no action:

| Category | Count | Reason |
|----------|-------|--------|
| Alternate page with proper canonical | 7 | `?month=` query params correctly canonicalize to hub |
| Page with redirect | 1 | `http://` → `https://` is correct Nginx behavior |
| Crawled not indexed (tool pages) | ~2 | `/find-my-visa` tool pages; no static content to index |

---

## 13. Deployment instructions

**This phase: local changes only.** Do not deploy to production.

After production deployment is separately approved:
1. Update `SITE_BUILD` date in `app/sitemap.ts` to match deploy date
2. Run `npm run build` on server
3. `pm2 reload guidex-production --update-env`
4. In GSC: "Sitemaps" → remove old sitemap → resubmit `https://guidex-consulting.ae/sitemap.xml`
5. Use GSC URL Inspection to request indexing for:
   - `https://guidex-consulting.ae/events`
   - `https://guidex-consulting.ae/ru/events`
   - `https://guidex-consulting.ae/calendar`
   - `https://guidex-consulting.ae/ru/calendar`
   - `https://guidex-consulting.ae/news`
   - `https://guidex-consulting.ae/ru/news`

---

## 14. Open issues for future phases

1. **Internal linking to individual event/news pages:** The broken `relatedHubs` links in `/news` and `/ru/news` point to non-existent hub pages (`/visas`, `/company-setup`, etc.). Should be fixed when those hub pages are built.

2. **CalendarGrid static month-page links:** The calendar hub renders a JavaScript-driven month navigation but has no static `<a href>` links to individual month pages (`/calendar/july-2026-dubai-calendar` etc.). Googlebot cannot discover month pages by crawling from the hub. Month pages are in the sitemap, which mitigates this, but static links would strengthen the cluster.

3. **Per-record `lastModified` in sitemap:** Reader functions (`getAllPublishedGuides`, `getPublishedEvents`, `getPublishedNewsPosts`) should be extended to return `updated_at` so the sitemap can use real content modification dates per entry.

4. **`/ru/find-my-visa` canonical:** This tool page has no canonical tag in its metadata. Should add a self-referencing canonical.
