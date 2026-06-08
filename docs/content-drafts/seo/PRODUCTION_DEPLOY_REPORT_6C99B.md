# Production Deploy Report — Phase 6C-99B
## Technical SEO Discovery Fixes | Date: 2026-06-08

---

## Phase summary

Phase 6C-99B implemented confirmed technical SEO discovery gaps found in the 6C-99A audit. All changes are code-only — no DB writes, no migrations, no schema changes.

---

## Commit

| Field | Value |
|---|---|
| Commit hash | 33d4460 |
| Branch | main |
| Commit message | "fix: improve SEO sitemap hreflang and schema" |

---

## Deploy

| Field | Value |
|---|---|
| Deploy command | `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"` |
| Deploy method | Zero-downtime script only |
| Old PM2 stop/build/start used | NO |

---

## Files committed

| File | Change |
|---|---|
| `app/sitemap.ts` | Added events + news to sitemap (5 EN + 5 RU events, 3 EN + 3 RU news) |
| `lib/db/news-events-calendar.ts` | Added `ruPublished` to EventDetail, NewsPostDetail, CalendarPageDetail |
| `app/(en)/(public)/events/[slug]/page.tsx` | RU hreflang + Event JSON-LD |
| `app/ru/events/[slug]/page.tsx` | Event JSON-LD |
| `app/(en)/(public)/news/[slug]/page.tsx` | RU hreflang + NewsArticle JSON-LD |
| `app/ru/news/[slug]/page.tsx` | NewsArticle JSON-LD |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | RU hreflang |
| `components/OrgSchema.tsx` | WebSite schema added alongside Organization |
| `app/(en)/(public)/page.tsx` | Homepage title + description |
| `docs/content-drafts/seo/` | 10 SEO audit + fix docs |
| `PROJECT_STATE.md` | Updated |
| `SESSION_LOG.md` | Updated |

---

## Local QA results (pre-commit)

| Check | Result |
|---|---|
| Build: 88 static pages, 0 TS errors | PASS |
| Sitemap total URLs: 92 | PASS |
| Sitemap event URLs: 5 EN + 5 RU = 10 | PASS |
| Sitemap news URLs: 3 EN + 3 RU = 6 | PASS |
| Sitemap: no admin/API routes | PASS |
| EN GITEX hreflang: en, ru, x-default | PASS |
| RU GITEX hreflang: ru, en, x-default | PASS |
| EN F1 hreflang: en, ru, x-default | PASS |
| EN News hreflang: en, ru, x-default | PASS |
| EN Calendar hreflang: en, ru, x-default | PASS |
| EN GITEX schemas: Organization, WebSite, Event | PASS |
| RU GITEX schemas: Organization, WebSite, Event | PASS |
| EN F1 schemas: Organization, WebSite, Event | PASS |
| EN News schemas: Organization, WebSite, NewsArticle | PASS |
| RU News schemas: Organization, WebSite, NewsArticle | PASS |
| EN Guide regression: Organization, WebSite, BreadcrumbList | PASS |
| Homepage: HTTP 200, Organization, WebSite schemas | PASS |

---

## Live QA results (post-deploy)

| Check | Result |
|---|---|
| All 13 routes HTTP 200 (homepage, ru, sitemap, robots, 5 event/news/calendar/guide routes) | PASS |
| Sitemap total URLs: 92 | PASS |
| Sitemap event URLs: 5 EN + 5 RU = 10 | PASS |
| Sitemap news URLs: 3 EN + 3 RU = 6 | PASS |
| Sitemap: no admin/API routes | PASS |
| EN GITEX hreflang: en, ru, x-default | PASS |
| RU GITEX hreflang: ru, en, x-default | PASS |
| EN F1 hreflang: en, ru, x-default | PASS |
| EN News hreflang: en, ru, x-default | PASS |
| RU News hreflang: ru, en, x-default | PASS |
| EN Calendar Dec hreflang: en, ru, x-default | PASS |
| Homepage hreflang: en, ru, x-default | PASS |
| EN GITEX schemas: Organization, WebSite, Event | PASS |
| RU GITEX schemas: Organization, WebSite, Event | PASS |
| EN F1 schemas: Organization, WebSite, Event | PASS |
| EN News schemas: Organization, WebSite, NewsArticle | PASS |
| RU News schemas: Organization, WebSite, NewsArticle | PASS |
| EN Calendar Dec schemas: Organization, WebSite | PASS |
| Homepage schemas: Organization, WebSite | PASS |
| EN Guide regression schemas: Organization, WebSite, BreadcrumbList | PASS |
| PM2 status: online, 149.3 MB | PASS |
| Build time: 49s | PASS |

---

## Issues found

None.

---

## Rollback needed

No.

---

## Recommended next owner actions

1. **Submit sitemap in Google Search Console:**
   - Go to GSC → [property] → Sitemaps
   - Submit: `https://guidex-consulting.ae/sitemap.xml`
   - Monitor "Submitted" vs "Indexed" over the next 7–14 days

2. **Request indexing for key event/news pages:**
   - In GSC → URL Inspection tool, paste and request indexing for:
     - `https://guidex-consulting.ae/events/gitex-global-2026`
     - `https://guidex-consulting.ae/events/formula-1-abu-dhabi-grand-prix-2026`
     - `https://guidex-consulting.ae/news/uae-emiratisation-june-30-2026-deadline`
     - `https://guidex-consulting.ae/news/uae-e-invoicing-2026-asp-deadline-update`
   - Request indexing once per URL — Google will crawl within days

3. **Monitor GSC Pages and Performance reports:**
   - Check "Pages" → "Why pages aren't indexed" after 1 week
   - Track impressions/clicks for event and news pages in Performance report

4. **Test structured data with Google Rich Results Test:**
   - URL: https://search.google.com/test/rich-results
   - Test: GITEX event page, Emiratisation news page
   - Verify Event and NewsArticle rich result eligibility

---

## Recommended next development phase

**Phase 6C-99C — Guide structured data and RAG/AEO blocks**

- Add `HowTo` schema to all guide detail pages
  - Data available: `steps` table with `en_title`, `en_what`, `cost`, `time`
  - Expected: HowTo rich results in SERPs for "how to get employment visa dubai" etc.
- Add `BreadcrumbList` to event/news/calendar pages (currently only on guide pages)
- Optionally: add `FAQPage` schema to hub pages (/life-setup, /find-my-visa)
- Do NOT start Phase 6C-99C until owner approves

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
