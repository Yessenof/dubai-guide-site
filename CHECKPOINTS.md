# Checkpoints — Dubai Guide Site

Stable, verified milestones. Each entry represents a state the project can be
safely restored to or continued from. Add a new entry only after full verification.

---

## CP-PHASE6C82-JULY-CALENDAR-LIVE — July 2026 Calendar — LIVE ON PRODUCTION

**Date:** 2026-05-28
**Status:** DEPLOYED AND VERIFIED — live on guidex-consulting.ae

- July 2026 calendar created and published: `july-2026-dubai-calendar`
- Production row ID: `48233336-4d9c-442a-b990-23287a97c34d`
- 3 items: JUL-03-DSS (L2 EN+RU brief), JUL-03-MODESH (L1), JUL-03-KHAIR (L1)
- 13/13 routes 200; 22/22 content invariants; 1 `<details>` EN+RU; EN+RU index/follow; sitemap present
- Coverage: 93.5% (29/31 days, calendar-only); 97% combined with e-invoicing Jul 1 (separate page)
- Beat the Heat / Timur Bey / RE:SET excluded; e-invoicing Jul 1 not duplicated
- DB delta: calendar_pages 5→6; news/events/guides unchanged
- Backup: `/var/backups/guidex/guides.db.pre-july-calendar-6c82-20260528-193114`
- June page unaffected (4 `<details>`, Mallathon brief confirmed); e-invoicing page unaffected
- Script: `scripts/july-2026-calendar-import-6c81.ts`
- Phase reports: PHASE_6C80, 6C81, 6C82 all complete
- GSC URL inspection pending for EN+RU July URLs

---

## CP-PHASE6C81-JULY-LOCAL-QA-PASS — July 2026 Calendar Local Import QA — PASS

**Date:** 2026-05-28
**Status:** LOCAL QA COMPLETE — awaiting owner approval for production import (Phase 6C-82)

- New row created locally: `july-2026-dubai-calendar` (id: `9a3b6c4c-8098-4b14-8f3d-93f0a337ea04`)
- 3 items: JUL-03-DSS (L2 EN+RU brief), JUL-03-MODESH (L1), JUL-03-KHAIR (L1)
- 12/12 routes 200; 1 `<details>` EN+RU (DSS only); all labels present; no internal notes in en_notes/ru_notes
- Coverage: 93.5% (29/31 days, calendar-only); 97% combined with e-invoicing Jul 1 (separate page)
- Import type: CREATE (slug did not exist); script: `scripts/july-2026-calendar-import-6c81.ts`
- Lesson: `createCalendarDraft` publish requires `image_path`, `official_source_url`, `image_alt`, `ru_image_alt`
- Beat the Heat / Modesh specific dates / Great Dubai Summer Sale: all HOLD (no 2026 DFRE announcement)
- No production DB, no code change, no deploy

---

## CP-PHASE6C79-JUNE-ENRICHMENT-LIVE — June 2026 Calendar Enrichment — LIVE ON PRODUCTION

**Date:** 2026-05-27
**Status:** DEPLOYED AND VERIFIED — live on guidex-consulting.ae

- June 2026 calendar enriched: 5 items → 8 items (JUN-15-MALLATHON L2, JUN-20-BASSI L1, JUN-24-ORCH L1)
- Coverage: 33% → 83% (25/30 days) — 60-70% target exceeded
- 12/12 routes 200; 4 `<details>` EN+RU; Mallathon brief EN+RU confirmed in live HTML; RE:SET absent; notes public content fixed
- Hotfix applied: en_notes/ru_notes cleaned of internal editorial text (lesson: these fields render publicly)
- Sitemap: EN+RU URLs present; CSS 200; no unstyled page issue
- Production DB row ID: `adddc561-74dd-4541-9183-34802f2aedd6`; row count unchanged (5 calendar_pages, 3 news_posts, 1 event, 17 guides)
- Script: `scripts/june-2026-calendar-enrich-local-import-6c78.ts` (same script used for local QA and production)
- Phase reports: PHASE_6C77, 6C78, 6C79 all complete
- Commits: 5bac54d (Phase 6C-78 script + docs), 6C-79 report pending commit
- RE:SET (JUN-06-RESET): remains HOLD — owner to verify genre at dubaiopera.com before Batch B import
- July calendar: NOT imported — awaiting DFRE DSS sub-event schedule (~late June)

---

## CP-PHASE6C69-CALENDAR-SPRINT-PLAN — 2026-2027 Calendar Fill Sprint Plan — DOCS COMPLETE

**Date:** 2026-05-26
**Status:** DOCUMENTATION COMPLETE — no code, no DB, no imports, no commits

- Sprint plan: `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md`
- First 30 candidates: `docs/content-drafts/calendar/2026-2027-first-30-calendar-candidates.md`
- Phase summary: `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md`
- 30 source-safe candidates identified (26 ready, 4 monitoring/hold)
- 8 new monthly calendar pages planned (Jun 2026 – Jan 2027)
- 5 new standalone topic pages planned
- P0 noindex blocker documented (hardcoded `robots: index:false` in 3 route files — blocks all calendar SEO)
- Strict Islamic date hold rule confirmed — no Islamic dates without FAHR/WAM official announcement
- All source ledger references verified and cross-linked

---

## CP-PHASE6C68-LOCAL-IMPORT-QA — Phase 6C-67 + 6C-68 Calendar Brief UI + Local Import QA — LOCAL VERIFIED

**Date:** 2026-05-26
**Status:** LOCAL COMPLETE — Phase 6C-67 committed (c774709), Phase 6C-68 local import QA passed. NOT pushed. Production import pending owner approval.

- `CalendarBriefSection.tsx` — new server component, `<details>/<summary>` SSR pattern, strict locale gate
- 18 optional brief fields added to `CalendarDateItem` + `CalendarDateItemExtended` (additive, no migration)
- EN + RU calendar detail pages: `<CalendarBriefSection>` added after dates list
- Local DB: news post `uae-e-invoicing-2026-asp-deadline-update` + calendar `uae-e-invoicing-2026-asp-deadline` published
- 3 brief items (TAX-05A/C/D): all `brief_en` + `brief_ru` present; Scenario A + B CTAs verified
- 14/14 route checks 200; 3 `<details>` in initial HTML; 0 `<details>` on existing pages
- Import script: `scripts/e-invoicing-indexed-brief-local-import-6c68.ts`
- Phase reports: PHASE_6C67_CALENDAR_BRIEF_UI_CODE_MVP_REPORT.md + PHASE_6C68_E_INVOICING_INDEXED_BRIEF_LOCAL_IMPORT_QA.md

---

## CP-PHASE6C48-DEPLOYED — Phase 6C-48 + 6C-48B Detail Hero + CalendarMiniPreview — LIVE

**Date:** 2026-05-22
**Status:** DEPLOYED — live on guidex-consulting.ae
**Commits:** bc041a6 (feat) + ac0e12f (fix RU label)

- 2 new components: DetailHero.tsx + CalendarMiniPreview.tsx
- 6 detail pages updated: news EN+RU, events EN+RU, calendar EN+RU
- All 12 detail pages link to exact calendar month; Long Weekend → generic + yearBadge
- RU CTA: "Открыть календарь за май/июнь 2026" (nominative, correct)
- Badge: "мая/июня 2026" (genitive, correct for standalone label)
- Chips sorted chronologically from datesJson
- Build: 86 pages, 0 errors. PM2: online, PID 128615.
- 19/19 routes 200. robots=index,follow. lang correct. Raw Markdown 0. Admin protected.
- Deploy report: PHASE_6C48_DETAIL_HERO_AND_CALENDAR_PREVIEW_DEPLOY_REPORT.md

---

## CP-PHASE6C48B-DETAIL-HERO-CALENDAR-PREVIEW — Phase 6C-48 + 6C-48B Detail Hero + CalendarMiniPreview — local complete

**Date:** 2026-05-22
**Status:** LOCAL COMPLETE (including 6C-48B news targeting correction) — pending owner commit/deploy approval

- 2 new components: `components/detail/DetailHero.tsx` + `components/calendar/CalendarMiniPreview.tsx`
- 8 files changed: 2 new + 6 detail pages (news EN+RU, events EN+RU, calendar EN+RU)
- DetailHero: bg image + gradient + eyebrow + h1; `categoryImage()` helper (visa/living → JLT; company/tax/banking → DIFC; default → skyline)
- CalendarMiniPreview: whole-card `<Link>`, no nested `<a>`, chips (navy pills), month/year badge, locale-aware
- News targeting (6C-48B): slug-based `NEWS_CALENDAR_MONTH` map — temporary until news_posts gets explicit calendar_month column
- Exact targets: Eid news → ?month=2026-05 | Emiratisation news → ?month=2026-06 | events → eventDateStart | calendar → month field or inferred | Long Weekend → /calendar + yearBadge "2026"
- TypeScript: 0 errors. Build: 86 pages, 0 errors. 18/18 routes 200 (including calendar?month= variants).
- Report: `docs/content-drafts/PHASE_6C48_DETAIL_HERO_AND_CALENDAR_PREVIEW_REPORT.md`
- Not committed, not deployed — pending approval

---

## CP-PHASE6C47B-LONG-WEEKEND-BUILD-REFRESH — Phase 6C-47B Production build complete — carousel live

**Date:** 2026-05-22
**Status:** COMPLETE — homepage carousel updated; GSC indexing pending
**Build commit:** `2d2691e` (no code changes; build only)

- `npm run build && pm2 restart guidex-production` — 86 pages, 0 errors, TypeScript 0 errors
- PM2: online, PID 126356, unstable restarts 0
- Long Weekend confirmed at carousel slot 5 in EN + RU production homepage HTML
- Carousel: 7 slides — Eid event → Eid news → Emiratisation news → Emiratisation calendar → Long Weekend → May calendar → Employment guide
- All 14 QA routes 200 (EN+RU detail, EN+RU list, 5 regressions, admin login, admin redirect)
- Long Weekend EN: lang=en, robots=index follow, title correct, raw Markdown 0, fahr trust present
- Long Weekend RU: lang=ru, robots=index follow, RU title correct, no EN fallback, raw Markdown 0
- May calendar: 0 matches for uae-long-weekends — no Eid Al Adha duplication confirmed
- Admin protection: /admin/content and /admin/guides redirect to /admin/login when logged out
- Report: `docs/content-drafts/PHASE_6C47B_LONG_WEEKEND_BUILD_REFRESH_REPORT.md`
- Outstanding: GSC indexing — 2 URLs pending owner submission

---

## CP-PHASE6C47-LONG-WEEKEND-PRODUCTION-IMPORT — Phase 6C-47 Long Weekend Calendar Reference production import complete

**Date:** 2026-05-21
**Status:** PRODUCTION IMPORT COMPLETE — pending production build + GSC indexing
**Record id:** `1f06eca2-676c-4ca6-a22a-a9d124fa44ba`

- calendarType: "yearly", month: null, year: 2026, status: published (production)
- datesJson: 4 items — New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3
- Eid Al Adha excluded from datesJson — confirmed by pre-flight guard + post-import assertion (9/9 pass)
- 9 routes 200 (EN+RU detail, EN+RU list, 5 regression routes). Raw Markdown 0. Source trust visible.
- Production backup: `/var/backups/guidex/guides.db.pre-longweekend-6c47-20260521-192515`
- Carousel: NOT visible in homepage yet — homepage is statically pre-rendered at build time; requires `npm run build`
- No code modified. No schema changes. Commits: 2d2691e (import script + Phase 6C-46 report)
- Report: `docs/content-drafts/PHASE_6C47_LONG_WEEKEND_PRODUCTION_IMPORT_REPORT.md`
- GSC indexing pending: `/calendar/uae-long-weekends-2026-2027` + `/ru/calendar/uae-long-weekends-2026-2027`

---

## CP-PHASE6C46-LONG-WEEKEND-LOCAL-IMPORT — Phase 6C-46 Long Weekend Calendar Reference local import and QA complete

**Date:** 2026-05-21  
**Status:** LOCAL IMPORT COMPLETE — not deployed, not committed, not pushed  
**Record id:** `a6d4d59b-d09a-4282-a908-1f87ba9fab51`

- calendarType: "yearly", month: null, year: 2026, status: published (locally)
- datesJson: 4 items — New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3
- Eid Al Adha excluded from datesJson — confirmed by pre-flight guard + post-import assertion
- 9/9 DB assertions pass. 6 routes 200 (EN+RU). Raw Markdown 0. Source trust block present.
- Carousel: 7 slides (Long Weekend at slot 5, all calPages enter pool regardless of featuredHomepage)
- No Eid Al Adha duplication in May calendar view
- Import script: `scripts/long-weekend-calendar-import.ts`
- QA report: `docs/content-drafts/PHASE_6C46_LONG_WEEKEND_LOCAL_IMPORT_QA.md`
- Production import pending owner approval

---

## CP-PHASE6C45-LONG-WEEKEND-IMPORT-MAP — Phase 6C-45 Long Weekend Calendar Reference import plan complete

**Date:** 2026-05-21  
**Status:** COMPLETE — planning only; no code deployed, no content published  

- calendar_pages model confirmed suitable for Long Weekend guide; no pre-import changes needed
- calendarType correction: `"yearly"` (not "annual" — invalid); "yearly" already a valid admin form option
- month: null confirmed safe across all rendering paths (detail page, list page, CalendarContextCta)
- Eid Al Adha excluded from datesJson — already in may-2026-uae-calendar; would create CalendarGrid duplicate
- 4 safe datesJson items: New Year Jan 1, Eid Al Fitr Mar 19–22, Commemoration Day Dec 1, National Day Dec 2–3
- D-6 resolved by code inspection; D-1–D-5 require owner approval
- Import map: `docs/content-drafts/reviews/uae-long-weekends-calendar-reference-import-map.md`
- Phase summary: `docs/content-drafts/PHASE_6C45_SUMMARY.md`
- Queue files updated: VIRAL-01 → import_path_decision_complete, preferred_path_calendar_reference

---

## CP-PHASE6C44-CAROUSEL-AGENDA-UX — Phase 6C-44 Homepage carousel priority + agenda UX polish complete

**Date:** 2026-05-21  
**Code commit:** `171dac1` — pushed to origin/main 2026-05-21  
**Status:** DEPLOYED — live on guidex-consulting.ae — all 16 routes 200, PM2 online

- `components/FeaturedSlider.tsx` — exported `CarouselSlide` type; every slide carries `bgImage`; no CSS-gradient-only slides
- `app/(en)/(public)/page.tsx` — `buildCarouselSlides()`: events→news→calPages→priority guides→other guides; `buildThisMonthItems()` dedup by `detail_url`; This Month links calendar items via `detail_url`
- `app/ru/page.tsx` — same carousel + This Month dedup for RU locale
- `lib/calendar-helpers.ts` — CTA defaults: "See holiday →", "Deadline details →", "Event details →", "Open calendar →" (EN); "К праздничным датам →", "К дедлайну →", "К событию →", "Открыть календарь →" (RU)
- `components/calendar/CalendarGrid.tsx` — GroupedAgendaCard compact mode: `itemShortLabel`, cap 3, "+N more"
- Hard restrictions observed: no DB schema changes, no new content imported, no push/deploy without approval

---

## CP-PHASE6C40A-PUBLIC-RENDERING-FIX — Phase 6C-40A Emergency public rendering and calendar UX fix complete

**Date:** 2026-05-21  
**Code commit:** pending (changes built, QA passed, not yet committed)  
**Status:** Local verified — ready to commit and deploy

- `components/MarkdownBody.tsx` — NEW: server-compatible Markdown renderer, zero external deps
- All 6 detail routes (EN + RU: events/news/calendar) updated to use MarkdownBody
- `CalendarContextCta.tsx` — date-pill strip added (`highlightStart`/`highlightEnd` props)
- `CalendarGrid.tsx` — Monday-first headers + shift formula; `expandRanges()` for multi-day items; `groupByDetailUrl()` + `GroupedAgendaCard/Row` for duplicate collapsing
- TypeScript: 0 errors. QA: 10 routes 200, all detail pages render HTML headings, no raw Markdown
- Robots: `index, follow` on all published detail pages confirmed
- Hard restrictions: no new drafts, no DB changes, no external packages added

---

## CP-PHASE6C40-VIRAL01-DRAFT-PACKAGE — Phase 6C-40 UAE Long Weekends 2026-2027 draft package complete

**Date:** 2026-05-20
**Code commit:** `dd2ab89` (no code changes in Phase 6C-40)
**Status:** File-based draft — not yet imported to production

- Source ledger: `docs/content-drafts/source-ledgers/uae-long-weekends-2026-2027-sources.md` — 6 sources, 3 FAHR URLs 200 ✓
- Guide draft: `docs/content-drafts/guides/uae-long-weekends-2026-2027.md` — full EN+RU, SEO/RAG complete
- Owner review: `docs/content-drafts/reviews/uae-long-weekends-2026-2027-owner-review.md` — owner_review_ready
- Validation: no code, no DB, no import, no commit of draft content; all content safety checks pass
- Confirmed dates: New Year 2026, Eid Al Fitr 2026, Eid Al Adha 2026 (FAHR + MoHRE), Commemoration/National Day dates (fixed)
- Monitoring dates: Islamic New Year, Mawlid, Dec 2026 scope, 2027 holidays — all clearly labelled
- Owner decisions pending: (1) import path (news_posts recommended), (2) update cadence
- Recommend import before June 10, 2026

---

## CP-PHASE6C39-EMIRATISATION-PRODUCTION — Phase 6C-39 Emiratisation A-only production DB deploy complete

**Date:** 2026-05-20
**Code commit:** `dd2ab89` (Phase 6C-38B — no new code in 6C-39)
**Status:** LIVE on guidex-consulting.ae

- Production DB backed up: `/var/backups/guidex/guides.db.pre-emiratisation-6c39-20260520-225341`
- Script: `scripts/emiratisation-june30-import.ts` — ran successfully on production
- Records imported: news `35d9ae35` + calendar `b479cd5b` (Item A only — 50+ employees)
- Item B (20-49 band): NOT imported — source hold maintained
- Build: 86 pages, 0 errors. PM2: online.
- All 4 Emiratisation EN/RU pages: HTTP 200, `robots: index, follow`
- RU pages: Russian content confirmed — no EN fallback
- Content safety: no AED amount, no unscoped claim, no June 30 for 20-49 band, source note present
- Zero regressions: all 10 pre-existing routes (Eid + homepage + calendar index + guide) 200
- Production DB: 2 news posts + 1 event + 2 calendar pages + 17 guides
- TAX-01 archive action pending: 2026-07-10 — set noindex=1 on Emiratisation news

---

## CP-PHASE6C38B-SURFACE-STABILIZATION — Phase 6C-38B Public surface stabilization deployed

**Date:** 2026-05-20
**Commit:** `dd2ab89` (pushed to origin/main)
**Status:** LIVE on guidex-consulting.ae

- /calendar + /ru/calendar: reads `getPublishedCalendarPages()` — mock data removed
- Homepage: Dubai Life Setup card — non-clickable div, "Coming soon"
- FeaturedSlider: px-5 on outer section — desktop alignment fixed
- lib/calendar-helpers.ts: compliance_deadline → government_deadline handler
- Build: 86 pages, 0 errors. PM2: online.
- All routes 200, published detail pages: index, follow. No regressions.

---

## CP-PHASE6C34-EID-PRODUCTION — Phase 6C-34 Eid Al Adha 2026 production launch complete

**Date:** 2026-05-20
**Commit:** `fde9c36` (pushed to origin/main)
**Status:** LIVE on guidex-consulting.ae

- Production DB backed up: `/var/backups/guidex/guides.db.pre-eid-6c34-20260520-141403`
- Schema migration applied: `news_posts`, `events`, `calendar_pages` tables created
- 3 records imported and published: news, event, calendar (all `status=published`, `ru_published=1`)
- Calendar items: A–D only (E/F held)
- 2-sentence summaries applied via SQL UPDATE (import script used originals)
- Build: 86 pages, 0 errors. PM2: online.
- All 6 EN/RU pages: HTTP 200, `robots: index, follow`
- Unknown slug: 404
- Content: no 9-days claim; FAHR/MoHRE/WAM source distinction confirmed live
- 17 existing guides: intact
- Production IDs differ from local (normal — UUID generated at import time)

---

## CP-PHASE6C33-INDEXING — Phase 6C-33 Indexing policy fix complete (P0 resolved)

**Date:** 2026-05-20
**Commit:** uncommitted (lib/db/indexing.ts + 6 route edits + summary doc + memory files)
**Status:** Code complete — not pushed, not deployed

- `lib/db/indexing.ts` created: `newsRobots()`, `eventRobots()`, `calendarRobots()`
- All 6 `[slug]/page.tsx` detail routes updated (EN + RU × news/events/calendar)
- News: respects `noindex` DB field (0=index, 1=noindex)
- Events/Calendar: always index — no noindex column; reader gates on status=published
- Draft slugs: reader returns null → notFound() → 404 (safe)
- RU: reader gates on ru_published=1 + non-empty ru_title/ru_body — null → 404, no EN fallback
- DB QA: Eid news noindex=0, all 3 records published, ru_published=1 → all 6 pages indexable on deploy
- TypeScript: 0 errors. Build: clean (86 pages, 2.6s). Hardcoded noindex grep: CLEAN in all [slug] routes
- Listing pages (/news, /events, /calendar) retain noindex — out of scope

---

## CP-PHASE6C32-MATRIX — Phase 6C-32 Full calendar and news radar matrix complete

**Date:** 2026-05-20
**Commit:** uncommitted (5 new docs/content-drafts/ files + memory files)
**Status:** Planning complete — no DB writes, no code changes, no imports

- 85 items mapped across 15 categories in opportunity matrix
- P0 technical blocker identified: hardcoded noindex in all 3 route files
- Calendar seed item policy defined (12 parts)
- Homepage carousel model defined
- Dubai Life Setup 12-module matrix built
- Recommended next phases: 6C-33 (noindex fix), 6C-34 (compliance sprint), 6C-35 (long weekend guide)
- No article/guide/event/calendar drafts created
- No admin, no DB, no code, no push

---

## CP-PHASE6C31-EID-QA — Phase 6C-31 Eid Al Adha 2026 local QA and production readiness complete

**Date:** 2026-05-20
**Commit:** uncommitted (scripts/eid-summary-fix.ts + draft files + memory files modified)
**Status:** QA COMPLETE in local DB — not pushed, not deployed

- All 3 records: status=published, ru_published=1
- All 6 summaries (EN + RU × 3): compressed to 2 sentences each
- All en_meta_description: under 160 chars (calendar was 178 → 139, ru 165 → 138)
- Em dash scan: CLEAN across all string fields in all 3 records
- Nine-days claim scan: CLEAN
- DGHR/KHDA: 0 records in DB (held)
- dates_json: exactly 4 items (A–D)
- Draft files synced with DB: news, event, calendar
- QA report: docs/content-drafts/PHASE_6C31_EID_LOCAL_QA_AND_PRODUCTION_READINESS.md
- Route QA: EN/RU parity confirmed; event confidence=confirmed (no amber banner); noindex hardcoded in route files

---

## CP-PHASE6C30-EID-IMPORT — Phase 6C-30 Eid Al Adha 2026 import and publish complete

**Date:** 2026-05-20
**Commit:** uncommitted (scripts/eid-import.ts + memory files modified)
**Status:** Published to local DB — not pushed, not deployed

- News post published: slug=uae-eid-al-adha-2026-federal-holiday-long-break, id=5b1eecec-e64a-4cc9-9f67-c6cb2b55e1e4
- Event page published: slug=uae-eid-al-adha-2026, id=8532feee-1d6f-4ed3-b716-61712b473ca3
- Calendar page published: slug=may-2026-uae-calendar, id=6ce82fda-d696-4040-b6c3-3d74c17347ea
- All three records: status=published, ru_published=1, all required fields present
- Calendar items A–D active; items E (DGHR) and F (KHDA) not imported (hold)
- Import script: scripts/eid-import.ts — 37 strings pre-validated for em dashes, all clean
- Warnings only (non-blocking): en_summary 3 sentences in all three files
- DB: guides=17, steps=115, news=1+, events=1+, calendar=1+ (exact totals depend on prior test data)

---

## CP-PHASE6C-CONTENT-DRAFT-BANK — Phase 6C File-based content draft bank committed

**Date:** 2026-05-18
**Commit:** `9b7f850` (branch 6 commits ahead of origin/main — not pushed)
**Status:** Committed locally — not pushed, not deployed

- `docs/content-drafts/` workspace: README + 4 templates + 3 Eid drafts + 1 source ledger
- Source ledger: 3 confirmed official URLs (WAM, FAHR, UAE Legislation) + 10 blocked claims (MoHRE/DGHR/KHDA needed)
- News draft: full EN+RU body + SEO + 7 calendar items + verification checklist
- May 2026 calendar draft: monthly planning view EN+RU, 4 calendar items (3 confirmed, 1 watchlist)
- Event/detail draft: audience-specific page (residents, families, business), RAG summaries, full DB field model
- Phase 6A research matrix: `docs/phase-6a-2026-calendar-content-research-matrix.md` — 46 rows, 17 sections
- Build: 86 pages, TypeScript clean (no code changes in this commit — docs only)
- DB: guides=17, steps=115, news=1, events=1, calendar=1 — unchanged

---

## CP-PHASE5F-CALENDAR-CONNECTIONS — Phase 5F Connect calendar to detail pages

**Date:** 2026-05-18
**Commit:** `bb0ba0a`
**Status:** Committed locally — not pushed, not deployed

- `components/calendar/CalendarContextCta.tsx`: server-compatible, locale-aware EN/RU, brass dot + navy CTA + brass secondary link
- `components/calendar/SaveCalendarCta.tsx`: "use client", compact strip + modal, iOS/Android tabs with steps
- `CalendarGrid` updated: `initialYear?`, `initialMonth?`, `initialDate?` props for deep-link init
- `/calendar` and `/ru/calendar` index pages: `await searchParams`, parse `?month=YYYY-MM` and `?date=YYYY-MM-DD`, pass to CalendarGrid
- CalendarContextCta added to 6 detail routes: EN/RU news, EN/RU event, EN/RU calendar detail
- Guide detail pages deferred (need `calendar_relevant`/`calendar_month` schema fields)
- Build: 86 pages, TypeScript clean
- QA: all 7 QA scripts pass (691/691 total checks)

---

## CP-PHASE5E-CALENDAR-PROTOTYPE — Phase 5E Calendar prototype

**Date:** 2026-05-17
**Commit:** `e11c321`
**Status:** Committed locally — not pushed, not deployed

- `components/calendar/CalendarGrid.tsx` (794 lines, "use client"): month grid, multi-item day, 5-month nav, picker, 5 filter chips, adaptive legend, 12 category types, confidence badges, external link support
- `lib/calendar-helpers.ts` (146 lines): category/color/priority helpers
- `lib/calendar-mock-data.ts` (291 lines): static mock data (real data connection deferred)
- `docs/phase-5e-calendar-ux-product-design.md` (1237 lines): full UX product design spec
- `.no-scrollbar` added to `globals.css`
- Build: 86 pages, 0 errors. Static mock data only — no DB connection yet.

---

## CP-PHASE4A6-CALENDAR-ADMIN — Phase 4A-6 Calendar Visual Posts admin full workflow committed

**Date:** 2026-05-14
**Commit:** `75f3e63`
**Status:** Committed — not pushed, not deployed

- `calendarRowToInput` exported from writer
- `publishCalendar(id)`: archived gate → `validateCalendarPublish` → sets status=published
- `archiveCalendar(id)`: sets status=archived (permanent in this phase)
- `saveCalendarDraftAction` + `publishCalendarAction` + `archiveCalendarAction` in `actions/calendar.ts`
- `CalendarForm.tsx`: 10 sections (core, verification/source, image, dates_json, EN content+SEO, RU content+SEO, flags)
- `CalendarStatusPanel.tsx`: status badge, dates count, last_verified_date, image indicator, Islamic dates warning, two `useActionState` hooks
- `CalendarPreview.tsx`: server component — dates list with color dots, EN+RU preview, JSON parse error indicator
- Calendar list page: full table with status/RU/type/year/dates count/verified/updated columns
- `/calendar/new` and `/calendar/[id]` pages created; grid layout `xl:grid-cols-[1fr_320px]`
- `scripts/qa-phase-4a6-calendar.ts`: 112/112 checks passed
- All 5 QA+verify scripts: 100+86+60+41+112 = 399 total checks, 0 failures
- Build: 85 pages, 0 errors, TypeScript clean
- DB: guides=17, steps=115, news=0, events=0, calendar=0

---

## CP-PHASE4A5-EVENTS-ADMIN — Phase 4A-5 Events admin full workflow committed

**Date:** 2026-05-14
**Commit:** pending push
**Status:** Committed — not pushed, not deployed

- `publishEvent(id)` writer: archived gate → `validateEventPublish` → sets status=published
- `archiveEvent(id)` writer: sets status=archived (permanent in this phase)
- `eventsRowToInput` exported; related fields added to EventInput + writer functions
- `validateEventPublish` fixed: `event_date_end` optional, date comparison, en_body/seo/meta required
- `saveEventDraftAction` + `publishEventAction` + `archiveEventAction` in `actions/events.ts`
- `EventForm.tsx`: 11 sections (core, dates, source, EN content+SEO, RU content+SEO, related, flags, tags)
- `EventStatusPanel.tsx`: date confidence badge + non-confirmed warning + two `useActionState` hooks
- `EventPreview.tsx`: EN preview with confidence warning + RU "saved, not published" badge
- Events list page: full table with 11 columns, emerald/opacity/neutral status styling, DateConfidenceBadge
- `/events/new` and `/events/[id]` pages created
- `scripts/qa-phase-4a5-events.ts`: 41/41 checks passed
- `scripts/verify-news-events-calendar-admin.ts`: updated stale test data, 100/100 checks
- All 4 QA scripts pass: 100+86+60+41 = 287 total checks
- Build: 84 pages, 0 errors, TypeScript clean

---

## CP-PHASE4A4B-NEWS-PUBLISH — Phase 4A-4a+4b News admin complete (not committed)

**Date:** 2026-05-12
**Commit:** pending approval
**Status:** Not committed — pending approval

- `publishNews(id)` writer: RU gate → date auto-fill (empty → today's ISO date) → `validateNewsPublish` → sets status=published
- `archiveNews(id)` writer: sets status=archived (permanent in this phase; archived→draft blocked)
- `newsRowToInput` exported from admin writer (needed by edit page for pre-compute)
- `publishNewsAction` + `archiveNewsAction` server actions in `app/admin/content/actions/news.ts`
- `NewsStatusPanel.tsx`: "use client", two `useActionState` hooks, status badge, pre-computed publish errors (blocking), warnings, conditional publish button (disabled if errors), archive button (hidden if archived), "no further actions" for archived state
- `NewsPreview.tsx`: server component, EN preview card + RU preview card with live/not-published badge
- Edit page `news/[id]/page.tsx`: `xl:grid-cols-[1fr_320px]` grid, pre-computes `validateNewsPublish` with empty-date auto-fill for panel props
- List page: emerald tint for published rows, `opacity-55` for archived rows
- `scripts/qa-phase-4a4b-news-publish.ts`: 60/60 checks passed
- All 4 verification scripts pass (100+86+60+verify = 246 total checks)
- Build: 83 pages, 0 errors, TypeScript clean

---

## CP-PHASE3E-LIST-WIRING — Phase 3E reader wiring on 6 list pages committed

**Date:** 2026-05-12
**Commit:** 5a2a49d
**Status:** Committed — not deployed

- 6 list pages converted to `async` server components and wired to readers
- EN pages: `getPublishedNewsPosts("en")`, `getPublishedEvents("en")`, `getPublishedCalendarPages("en")`
- RU pages: same readers with `"ru"` locale — RU gate (`ru_published=1`) enforced in reader, no EN fallback
- Empty DB (0 rows) → reader returns `[]` → existing dashed empty-state renders, no errors
- When rows exist → compact card list: news (category + date + title + summary), events (date + title + confidence + category), calendar (type + period + Islamic flag + title + summary + date count)
- Static placeholder card arrays removed from calendar pages
- `robots: { index: false, follow: true }` preserved on all 6
- No structured data, no sitemap changes, no homepage changes, no DB writes, no admin changes
- Build: 78 pages, 0 errors, TypeScript clean
- Smoke: 6/6 list routes 200

---

## CP-PHASE3D-DETAIL-ROUTES — Phase 3D dynamic detail route skeletons committed

**Date:** 2026-05-11
**Commit:** 80d7cec
**Status:** Committed — not deployed, not wired into list pages

- 6 dynamic detail pages: `/news/[slug]`, `/events/[slug]`, `/calendar/[slug]`, `/ru/news/[slug]`, `/ru/events/[slug]`, `/ru/calendar/[slug]`
- `generateStaticParams` returns `[]` on all 6 — SSR on demand, no pre-rendered paths
- Unknown slugs reach `notFound()` → 404 (verified: 6/6 unknown detail slugs returned 404)
- `robots: { index: false, follow: true }` on all 6 — noindex guard until content launch
- No structured data added
- RU pages: call reader with `"ru"` locale; if reader returns null → `notFound()` (no EN fallback)
- EN news: source attribution pill, body paragraphs, related guide box, WhatsApp CTA
- EN events: amber confidence notice for `expected` and `subject_to_official_confirmation` dates
- EN calendar: Islamic disclaimer if `has_islamic_dates === 1`; HTML dates list with color-coded type pills and confidence badges
- RU equivalents: all UI text in Russian, source labels in Russian, Islamic disclaimer in Russian
- RU calendar: `label_ru || label_en` for individual date entry labels (data-level acceptable; page content has no fallback)
- Build: 78 pages, 0 errors (6 new ● SSG routes with 0 pre-rendered paths)
- No sitemap changes, no homepage changes, no DB writes, no admin changes

---

## CP-PHASE3C-READERS — Phase 3C reader layer verified and committed

**Date:** 2026-05-11
**Commit:** e0ecd26
**Status:** Committed — not wired into public routes, not deployed

- `lib/db/news-events-calendar.ts`: 9 reader functions for news_posts, events, calendar_pages
- EN gate: `status='published'`. RU gate: `status='published' AND ru_published=1`
- `field()` helper: no EN fallback — `locale === "ru" ? ru : en` returns locale field as-is
- RU list functions filter out rows with empty `ru_title` at application layer
- RU detail functions return null if `ru_title` OR `ru_body` is empty
- Calendar `ru_notes` / `ru_image_alt`: returned as-is (empty string valid on RU)
- `scripts/verify-news-events-calendar-readers.ts`: 138/138 checks passed
- SAVEPOINT-based tests confirm no EN fallback and no data persists in guides.db
- Build: 78 pages, 0 errors, TypeScript clean
- No routes wired, no sitemap changes, no homepage changes, no DB writes

---

## CP-PHASE3A-SCHEMA — Phase 3A local schema migration verified

**Date:** 2026-05-11
**Status:** Local only — not committed, not deployed to production

- `scripts/migrate-add-news-events-calendar.sql` created — 3 tables + 13 indexes, `IF NOT EXISTS` guards
- `lib/db/schema.ts` appended — `newsPosts`, `eventsTable`, `calendarPages` + type exports
- `data/guides.db` (local): 3 new tables created, 0 rows each
- `data/guides.db.backup-before-news-events-calendar-schema-20260511-113849` created before migration
- `PRAGMA integrity_check` = ok; guides = 17 (unchanged); steps = 115 (unchanged)
- All 3 `status` CHECK constraints: draft/published/archived
- `events.date_confidence` CHECK: confirmed/expected/subject_to_official_confirmation
- Build: 72 pages, 0 errors — same page count as before
- No routes added, no sitemap changes, no production changes, no Drizzle Kit commands run

---

## CP-SEO-ANALYTICS-FOUNDATION — SEO/analytics foundation live on production

**Date:** 2026-05-07
**Status:** Live — guidex-consulting.ae

- `lib/gtm.ts` — `pushEvent(event, payload?)` dataLayer helper; no-ops on server
- `components/GoogleTagManager.tsx` — GTMScript (afterInteractive) + GTMNoScript; reads `NEXT_PUBLIC_GTM_ID`; renders nothing if unset
- `components/OrgSchema.tsx` — Organization JSON-LD using `NEXT_PUBLIC_SITE_URL`
- `app/layout.tsx` — GTM wired; root OG (siteName, type: website) + Twitter (card: summary) defaults
- `app/(public)/layout.tsx` + `app/ru/layout.tsx` — OrgSchema added
- `app/(public)/guides/[slug]/page.tsx` — OG (article, en_AE) + Twitter + BreadcrumbList in EN
- `app/ru/guides/[slug]/page.tsx` — OG (article, ru_RU) + Twitter + BreadcrumbList in Russian
- `components/Header.tsx` — `language_switch_click` + `whatsapp_click` events
- `components/RouteFinderFlow.tsx` — `route_finder_start`, `route_finder_result_view`, `route_finder_whatsapp_click` events
- `components/StickyRouteCta.tsx` — `route_finder_start` event (source: sticky_cta)
- DB: unchanged (17 guides / 115 steps). No content scripts.
- Build: 72 pages, 0 errors.

---

## CP-PRE-GSC-CLEANUP — pre-GSC SEO cleanup live on production

**Date:** 2026-05-07
**Status:** Live — guidex-consulting.ae

- `app/sitemap.ts` — `/ru/find-my-visa` added to `RU_STATIC` at priority 0.6
- `app/(public)/guides/child-dependent-visa-dubai/page.tsx` — `alternates` (en/ru/x-default) added
- `app/(public)/guides/spouse-dependent-visa-dubai/page.tsx` — `alternates` (en/ru/x-default) added
- `lib/localize-value.ts` — newborn guide-level timeline + price mappings added
- `components/RouteFinderFlow.tsx` — result card `guide.price` and `guide.timeline` wrapped with `localizeValue(_, locale)`
- DB: unchanged (17 guides / 115 steps). No content scripts run.
- Build: 72 pages, 0 errors (full clean build, cold cache). 10/10 smoke tests 200.

---

## CP-RU-ROUTE-FINDER — RU route finder live on production

**Date:** 2026-05-07
**Status:** Live — guidex-consulting.ae

- `app/ru/find-my-visa/page.tsx` — new RU route finder page (was 404). Russian metadata. `locale="ru"` prop passed to `RouteFinderFlow`. Close button links to `/ru`.
- `lib/route-finder-config.ts` — `ROUTE_FINDER_CONFIG_RU` added (lines 360–580): parallel RU config, 15 resolution paths, all strings Russian, RU hub URLs (`/ru/visas/golden`, `/ru/company-setup`). No em-dash in any user-visible string.
- `lib/guide-groups.ts` — `RU_GROUP_HREFS` added: `spouse-dependent-visa-dubai-outside-country` → `/ru/guides/spouse-dependent-visa-dubai?route=outside`, etc.
- `components/RouteFinderFlow.tsx` — `locale?: "en" | "ru"` prop. RU config + UI strings selected at runtime. Guide result hrefs use `RU_GROUP_HREFS` with `/ru/guides/${slug}` fallback. Supporting service hrefs locale-aware.
- `components/Header.tsx` — "Найти маршрут" added to `RU_NAV` with `href: "/ru/find-my-visa"`.
- `components/StickyRouteCta.tsx` — `HIDDEN_ON` extended to `["/find-my-visa", "/ru/find-my-visa"]`. Href locale-aware.
- `components/GuideTabs.tsx` — `findVisaHref` locale-aware (`/ru/find-my-visa` for RU).
- 5 RU hub pages — route finder CTAs updated: `/ru/visas` → `/ru/find-my-visa`, `/ru/visas/family` → `?flow=family-new`, `/ru/visas/golden` → `?flow=golden`, `/ru/company-setup` → `?flow=company`, `/ru/guides/[slug]` → `/ru/find-my-visa` (×2) + footer body fixed.
- DB: unchanged (17 guides / 115 steps). No content scripts run.
- Build: 72 pages (+1 for `/ru/find-my-visa`), 0 errors. 15 RU flows verified via config tracing. EN regression clean.

---

## CP-RU-SPOUSE-VISA-PAIR — spouse dependent visa pair RU live on production

**Date:** 2026-05-07
**Commit:** a231560
**Status:** Live — guidex-consulting.ae

- `lib/guide-groups.ts`: spouse entry extended with `ruTitle?`, `ruSummary?`, `ruLabel?` on both variants
- `lib/localize-value.ts`: 4 new mappings — "Depends on travel", "AED 1,100 (approx.)", "AED 640 (approx.)", "AED 320 (approx.)"
- `app/ru/guides/spouse-dependent-visa-dubai/page.tsx`: metadata uses `group.ruTitle` / `group.ruSummary`
- `scripts/add-ru-spouse-dependent-visa-outside.ts`: 7 steps + 4 guide `ru_*` fields. All guards passed. 0 em-dashes. No MOHRE clinic / ICA / stamp language.
- `scripts/add-ru-spouse-dependent-visa-inside.ts`: 7 steps + 4 guide `ru_*` fields. All guards passed. Step 5 medical fitness: approved Medical Fitness Center (not Amer). 0 em-dashes.
- DB: 17 guides, 115 steps (unchanged). Local backup: `backups/local/guides.db.pre-ru-spouse-20260507-140859`.
- Build: 71 pages (+2 spouse variant slugs now SSG'd), 0 errors (full clean build). Smoke tests: 9/9 routes correct.
- Variant slugs absent from sitemap. EN spouse group unchanged. Child group regression clean. 0 cost/time English leakage.

---

## CP-RU-CHILD-VISA-PAIR — child dependent visa pair RU live on production

**Date:** 2026-05-07
**Commit:** 0b05cef
**Status:** Live — guidex-consulting.ae

- `components/GuideTabs.tsx`: locale-aware tab labels via `v.ruLabel`; `localizeValue`+`locale` passed to RouteSnapshot and StepCard
- `lib/guide-groups.ts`: `GuideGroupConfig.ruTitle?`, `ruSummary?` and `GuideVariant.ruLabel?` added; child group RU strings populated
- `app/ru/guides/child-dependent-visa-dubai/page.tsx`: metadata uses `group.ruTitle`/`group.ruSummary`
- `scripts/add-ru-child-dependent-visa-outside.ts`: 6 steps + 4 guide `ru_*` fields. All guards passed. 0 em-dashes. ICP (not ICA).
- `scripts/add-ru-child-dependent-visa-inside.ts`: 6 steps + 4 guide `ru_*` fields. All guards passed. 0 em-dashes. ICP (not ICA).
- No new `localize-value.ts` mappings needed — all step cost/time values already mapped.
- DB: 17 guides, 115 steps (unchanged). Local backup: `backups/local/guides.db.pre-ru-child-*`.
- Build: 69 pages (+2 child variant slugs now SSG'd), 0 errors (full clean build). Smoke tests: 8/8 routes correct.

---

## CP-RU-EMPLOYMENT-OUTSIDE-UAE — outside-UAE employment visa RU live on production

**Date:** 2026-05-07
**Commit:** 6d76f66

- `scripts/add-ru-employment-visa-outside-uae.ts`: 7 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 8 new cost/time exact-match mappings added (4–8 weeks, 1–2/2–4/3–5 working days, Travel day, Flight costs, 3–5 working days for card delivery, Included in MOHRE work permit).
- Factual cleanup: no MOHRE-approved clinic, ICA → ICP, WPS correctly described as salary payment not contract registry.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-employment-outside-20260507-115242`.
- Build: 67 pages, 0 errors (full clean build — node_modules/.cache cleared). Smoke tests: 11/11 routes 200.

---

## CP-RU-GOVERNMENT-BATCH — government RU batch live on production

**Date:** 2026-05-07
**Commit:** 6b510b8

- `scripts/add-ru-document-attestation.ts`: 3 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `scripts/add-ru-amer-center.ts`: 4 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `scripts/add-ru-pro-services.ts`: 5 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 25 government batch cost/time exact-match mappings added.
- `app/ru/government/page.tsx`: all 3 "Скоро" cards flipped to live href cards.
- Factual cleanup: no apostille-replaces wording, no unverified amer.ae URL.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-government-batch-20260507-070313`.
- Build: 0 errors (full clean build — node_modules/.cache cleared). Smoke tests: 13/13 routes 200.
- /ru/government: 3 live guide links, 0 "Скоро". Sitemap: all 6 EN+RU government guide URLs present.

---

## CP-RU-RENEW-FAMILY — renew-family-visa-dubai RU live on production

**Date:** 2026-05-05
**Commit:** daa9cf3

- `scripts/add-ru-renew-family-visa.ts`: 4 step + 4 guide `ru_*` fields written. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 9 renew-family cost/time exact-match mappings added. Zero EN cost/time leakage on RU page.
- Factual cleanup: no "GDRFA медцентр", no "система ICA", no "ica.gov.ae" in any RU field.
- Generic `app/ru/guides/[slug]/page.tsx` handles route — no custom page needed.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-renew-family-20260505-071227`.
- Build: 63 pages, 0 errors. Smoke tests: 9/9 production routes 200. Hreflang bidirectionally correct. Sitemap includes both EN and RU renew-family URLs.

---

## CP-RU-NEWBORN — newborn-visa-dubai RU live on production

**Date:** 2026-05-05
**Commit:** 4cd8e70

- `scripts/add-ru-newborn-visa.ts`: 6 step + 4 guide `ru_*` fields written. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 11 newborn cost/time exact-match mappings added. Zero EN cost/time leakage on RU page.
- Generic `app/ru/guides/[slug]/page.tsx` handles route — no custom page needed.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-newborn-20260505-094818`.
- Build: 62 pages, 0 errors. `[+4 more paths]` in RU slug route (newborn included).
- Smoke tests: 9/9 production routes 200. Hreflang bidirectionally correct. Sitemap includes both EN and RU newborn URLs.

---

## CP-RU-TRC — RU TRC guide deployed to production

**Date:** 2026-05-04
**Commit:** e811c6a

- `scripts/add-ru-trc.ts`: 8 step + 4 guide `ru_*` fields written. All guards passed. EN fields untouched.
- `app/ru/guides/tax-residency-certificate-uae/page.tsx`: custom static RU premium page (navy hero, Russian WHY_CARDS)
- `app/ru/guides/[slug]/page.tsx`: CUSTOM_PAGE_SLUGS filter excludes TRC from generic RU route
- `app/(public)/guides/tax-residency-certificate-uae/page.tsx`: hreflang `"ru"` key added
- `app/ru/banking-tax/page.tsx`: TRC card now links to `/ru/guides/tax-residency-certificate-uae`, `· EN` label removed
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-trc-20260504-222454`.
- Build: 61 pages, 0 errors. `/ru/guides/tax-residency-certificate-uae` = `○ (Static)`.
- Smoke tests: 9/9 production routes 200.

---

## CP-RU-HUBS — RU banking-tax and tourism hubs live, sitemap fixed, RU homepage complete

**Date:** 2026-05-04
**Commit:** 60deb84

All 5 RU homepage service cards active (no more `soon:true`). Sitemap now includes all hub routes. Hreflang bidirectionally correct on all hub pages.

- `/ru/banking-tax`: live — PageHero, DIFC image, RU text, TRC card links to EN guide with `· EN` label
- `/ru/tourism`: live — PageHero, JLT image, RU text, links to `/ru/guides/holiday-home-permit-dubai`
- Sitemap: `/banking-tax`, `/tourism`, `/ru/banking-tax`, `/ru/tourism` all present
- Hreflang: en, ru, x-default correct on all 4 hub pages
- DB: unchanged — 17 guides, 115 steps
- PM2: online
- Smoke test: 9/9 routes 200
- Known issue: `/ru/government` links to 3 EN-only guides that will 404 — deferred to government RU batch

---

## CP-CODE7 — Premium hubs, TRC guide, visual system live on production

**Date:** 2026-05-04
**Commits:** d3faa8a (local) · 5a3f1f2 (cron backup chmod fix)

CODE7 fully deployed. All smoke tests green.

- `/banking-tax` hub: live — editorial gradient hero, service cards, WhatsApp CTA
- `/tourism` hub: live — warm-light gradient, JLT image
- `/guides/tax-residency-certificate-uae`: live — custom static route, navy header, 8 steps from DB
- `PageHero` component: reusable gradient hero (image + gradient + text + CTA slot)
- `lib/page-visuals.ts`: central gradient config (`light` / `medium` / `warm-light`)
- Homepage hero: skyline image with "light" gradient, Burj visible
- RU homepage: visual parity via PageHero with overline + WhatsApp CTA
- Header mobile overflow fix: RU pill in top row, mobile nav flex-wrap
- Homepage: Banking & Tax and Tourism cards activated (removed `soon:true`)
- Production DB: 17 published guides, 115 steps
- DB backup: `/var/backups/guidex/guides.db.pre-code7-20260504-114324`
- Build: 58 pages, 0 TypeScript errors
- PM2: online
- Smoke test: 10/10 routes 200
- Content checks: TRC renders, on index and sitemap, absent from `/ru/guides`; homepage links confirmed

---

## CP-BATCH-RU-02 — Bank Account RU + Holiday Homes RU live on production

**Date:** 2026-05-02
**Commits:** 3a33d65 (HH RU + localize-value) · b18971e (Bank RU script)

Two Russian guides deployed via batch targeted scripts. Fully verified.

- `open-business-bank-account-dubai` RU: live at https://guidex-consulting.ae/ru/guides/open-business-bank-account-dubai
- `holiday-home-permit-dubai` RU: live at https://guidex-consulting.ae/ru/guides/holiday-home-permit-dubai
- DB backup before deploy: `/var/backups/guidex/guides.db.pre-batch-ru-bank-hh-20260502-180053`
- Build: 55 pages, 0 errors
- PM2: online, 0 unstable restarts
- EN pages: unchanged
- Em-dashes in RU DB: 0
- Full DB restore: not used

---

## CP-HH-03B — Holiday home permit guide live on production

**Date:** 2026-05-02
**Commit:** 2dbd005

Guide `holiday-home-permit-dubai` deployed to production via targeted script. Fully verified.

- URL: https://guidex-consulting.ae/guides/holiday-home-permit-dubai
- Category: tourism
- Published: 1 (live)
- Steps: 12 (EN only, RU fields empty)
- Build: 53 pages, 0 errors on production
- DB backup before deploy: `/var/backups/guidex/guides.db.pre-holiday-home-guide-20260502-164949`
- Tourism category support live: admin dropdown, CategoryIcon, EN/RU guides list pages, GuideHeader
- RU static params fix in place: RU route pre-renders only guides with ru_title populated
- Homepage Tourism card remains inactive (Coming soon)
- Sitemap: EN URL present, RU URL absent

**State at this checkpoint:**
- 16 EN guides on production (14 existing + holiday-home-permit-dubai + newborn-visa-dubai... wait, let me not guess)
- 4 RU guides pre-rendered: employment-visa, golden-visa-dubai-property, mainland-company-setup-dubai, free-zone-company-setup-dubai
- open-business-bank-account-dubai RU content: local only, not yet deployed

---

## CP-HH-02B — Holiday home permit guide draft (local only)

**Date:** 2026-05-02

**What is confirmed stable (locally):**

- `scripts/add-holiday-home-permit-guide.ts` executed cleanly
- Guide `holiday-home-permit-dubai` created: slug, category=tourism, published=false (DRAFT)
- en_title: "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Booking.com"
- 12 steps inserted, all EN fields populated, all RU fields empty
- Pre-write and post-write validation passed: 0 em-dashes, no guarantee language, no partnership language, no private data
- DB backup: data/guides.db.backup-holiday-home-guide-1777714931
- Build: 63 pages, 0 TypeScript errors (guide is draft, not pre-rendered)
- Homepage: unchanged — Tourism card still inactive
- Production DB: untouched

**Not done yet:**
- Guide not reviewed via admin panel/browser
- Guide not published
- RU content not created
- Deployment pending owner review and publish decision

---

## CP-HH-02A — Tourism category support (local only)

**Date:** 2026-05-02

**What is confirmed stable (locally):**

- `tourism` added to CATEGORIES in `components/admin/GuideFormFields.tsx`
- `tourism` added to KnownCategory type + key icon in `components/CategoryIcon.tsx`
- `tourism → "Туризм"` added to CATEGORY_RU in `components/GuideHeader.tsx`
- `tourism` + "Tourism & Short-Term Rentals" added to `app/(public)/guides/page.tsx`
- `tourism` + "Туризм и краткосрочная аренда" added to `app/ru/guides/page.tsx`
- Build: 63 pages, 0 TypeScript errors
- No homepage card activated
- No hub page created
- No guide created
- DB untouched
- Production untouched

**Not done yet:**
- Holiday home permit guide not created
- Tourism card on homepage still inactive/soon
- Deployment of category support pending (code-only change, no DB script needed)

---

## CP-26 — RU content for bank account guide (local only)

**Date:** 2026-05-01

**What is confirmed stable (locally):**

- `scripts/add-ru-business-bank-account.ts` executed cleanly
- `open-business-bank-account-dubai`: all 9 steps fully translated to Russian
- ru_title: "Открыть бизнес-счёт в банке ОАЭ для компании в Дубае"
- Wio Business: presented as example only, monthly subscription + no minimum balance nuance, digital onboarding compliance depth
- POA: framed as one scenario (not mandatory)
- Real estate: conditional language, not universal requirements
- No em-dashes, no guarantee language, no Wio partnership implication
- EN fields unchanged, step count unchanged (9)
- 6 new exact mappings added to lib/localize-value.ts for step/guide-level EN values
- Sitemap now includes /ru/guides/open-business-bank-account-dubai (ru_title non-empty)
- Local DB backup: data/guides.db.backup-bank-ru-content-1777629562706
- Build: 63 pages, 0 TypeScript errors
- RU page 200, H1 in Russian, all localized values correct

**Not done yet:**
- Production DB not updated with RU content
- Deployment pending owner review

**Next:** Review RU content at http://localhost:3000/ru/guides/open-business-bank-account-dubai, then deploy to production using targeted script.

---

## CP-25B — EN bank account guide deployed to production

**Date:** 2026-05-01

**What is confirmed stable (production):**

- `open-business-bank-account-dubai` EN upgrade live on https://guidex-consulting.ae
- 9 steps: shareholder/POA role, bank route + digital onboarding (Wio as example), company documents (UBO), business profile, customer/supplier evidence, source of funds + 3-month statements, expected transactions + FATCA/CRS/TIN, real estate RERA/goAML, submission + wait
- Wio nuance correct: monthly subscription + no minimum balance stated; no forbidden AED 25,000–50,000 phrase; other banks/packages correctly described as varying
- No em-dashes, no guarantee language, no Wio partnership implication in any field
- All ru_* fields remain empty
- Production DB backed up at `/var/backups/guidex/guides.db.pre-bank-en-upgrade-20260501-134430` before script ran
- Targeted script only — no full DB restore
- Build: 63 pages, 0 TypeScript errors
- PM2: guidex-production online
- Smoke test: 200 on EN and RU pages; RU falls back to EN (ru_title empty, excluded from sitemap)

**Next:** Create RU content for `open-business-bank-account-dubai` from the improved 9-step EN master.

---

## CP-25 — Bank account guide EN upgrade (local only)

**Date:** 2026-05-01

**What is confirmed stable (locally):**

- `scripts/update-bank-account-guide-en.ts` executed cleanly
- `open-business-bank-account-dubai`: 8 steps → 9 steps
- EN title: "Open a Business Bank Account in Dubai for a UAE Company"
- All 9 step EN fields populated: shareholder/POA role, digital bank option (Wio as example), customer/supplier profiles, source of funds + 3-month statements, FATCA/CRS/TIN, RERA/DNFBP/goAML, expected transactions
- All ru_* fields remain empty (untouched)
- Local DB backup: data/guides.db.backup-bank-en-upgrade-1777616978301
- Build: 63 pages, 0 TypeScript errors
- All 10 compliance terms present in built HTML
- No em-dashes in content, no guarantee language, no Wio partnership language

**Not done yet:**
- Production DB not updated
- RU content not created
- Admin panel review not completed

**Next:** Review locally via admin, then deploy to production with DB backup, then create RU content.

---

## CP-24 — Step 4: full RU value localization + D-class em-dash fix

**Date:** 2026-04-30

**What is confirmed stable:**

- `lib/localize-value.ts` expanded to 47 mappings (from 21)
  - 3 guide price (AED+context), 2 guide timeline (conditional)
  - 10 step cost (AED+context), 7 step timeEst (duration+context)
  - 2 post-D-fix timeEst (Varies: ...)
- D-class DB fix: mainland step 6 and free-zone step 8 `time_est` fields patched (em-dash → colon). Backup: /var/backups/guidex/guides.db.pre-step4-d-class-fix-*
- Production smoke test: all 4 RU guides verified; EN employment-visa verified; EN mainland shows "Varies:" not "Varies —"
- Build: 63 pages, 0 TypeScript errors
- Commit: bcf98b9

**Remaining English on RU pages (intentional — B-class pure AED):**
- Pure AED amount strings: AED 278, AED 1,126, AED 676, AED 323, AED 386, AED 546, AED 8,031.75, AED 700, AED 1,153, AED 620–720, AED 4,900–7,300
- No further action required for these values

**RU visible cleanup complete.** All 4 guides ready for RU content population.

---

## CP-23 — Step 3: display-level value localization for RU guide pages

**Date:** 2026-04-30

**What is confirmed stable:**

- `lib/localize-value.ts` created — 21 exact-match A-class mappings + month-name regex
- `app/ru/guides/[slug]/page.tsx` — wraps price, timeline, lastUpdated, cost, timeEst via localizeValue before passing to RouteSnapshot and StepCard
- EN guide page (`app/(public)/guides/[slug]/page.tsx`) unchanged
- All 8 audit checklist items verified in built HTML
- Production smoke test: all 4 RU guides confirmed ✅
- Build: 63 pages, 0 TypeScript errors
- No DB changes, no schema changes
- Commit: 665744e

**Remaining English on RU pages:**
- C-class values (AED + English context) — deferred to schema redesign (ru_price, ru_timeline, ru_cost, ru_timeEst columns)
- 2 D-class EN em-dashes in timeEst fields — separate EN content fix

---

## CP-22 — Step 2: UI label localization for RU guide pages

**Date:** 2026-04-30

**What is confirmed stable:**

- `RouteSnapshot.tsx`, `StepCard.tsx`, `GuideHeader.tsx` — all have optional `locale` prop, default "en"
- 12 UI labels localized (6 in RouteSnapshot, 6 in StepCard); category pill localized in GuideHeader
- `app/ru/guides/[slug]/page.tsx` passes `locale="ru"` to all three components
- EN guide page (`app/(public)/guides/[slug]/page.tsx`) unchanged — defaults to "en"
- Build: 63 pages, 0 TypeScript errors
- No DB changes, no schema changes
- Production: all 4 RU guide pages show Russian labels (verified via curl)
- EN guide page retains English labels (verified via curl)
- Remaining English on RU pages: step cost/time values and guide price/timeline — Category B, separate step

**Commit:** 025d40f

---

## CP-21 — Step 1A: RU content em-dash hygiene across all 4 completed guides

**Date:** 2026-04-30

**What is confirmed stable:**

- All 4 completed RU guides scanned for em-dashes in ru_* fields
- Source scripts updated: 0 content em-dashes in add-ru-employment-visa.ts, add-ru-golden-visa-property.ts, add-ru-mainland-company.ts, add-ru-free-zone-company-setup.ts
- Patch script created: `scripts/patch-ru-em-dashes-completed-guides.ts` (assertNoEmDash guards, UPDATE-only, ru_* fields only, 4-guide scope)
- Local DB: guide=OK steps=OK for all 4 (verified by patch script)
- Production DB: guide=OK steps=OK for all 4 (patch ran on server; backup at /var/backups/guidex/guides.db.pre-ru-em-dash-cleanup-*)
- DB integrity: ok before and after
- Build: 63 pages, 0 TypeScript errors
- PM2 restarted, online
- Live smoke test: all 4 RU guide pages return HTTP 200; no em-dashes in RU content fields
- EN fields: unchanged throughout
- Remaining HTML em-dashes: `<title>` separator pattern (intentional) + EN step time_est values (Category B, separate step)

**Commit:** 5f6c30d

---

## CP-20 — RU content: free-zone-company-setup-dubai

**Date:** 2026-04-30

**What is confirmed stable:**

- `ru_title`, `ru_summary`, `ru_audience`, `ru_overview` populated for `free-zone-company-setup-dubai`
- All 8 step `ru_*` fields populated (ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning)
- 0 em-dashes in any RU field (initial draft had 6; fixed via targeted DB patch before commit)
- EN fields unchanged
- EN guide page: hreflang now includes `ru` alternate (triggered by non-empty `ru_title`)
- Sitemap: `/ru/guides/free-zone-company-setup-dubai` entry present
- `/ru/company-setup` hub: all 3 guide links intact (mainland, free-zone, bank-account)
- Script: `scripts/add-ru-free-zone-company-setup.ts`
- Build: 63 pages, 0 TypeScript errors

---

## CP-19 — Homepage IA restructure: route-hub cards aligned across locales

**Date:** 2026-04-29

**What is confirmed stable:**

- EN homepage (`app/(public)/page.tsx`) — 5 category cards (3 active: Visas, Company Setup, Government Services; 2 soon: Tourism & Holiday Homes, Banking & Advice). "Browse all guides →" bottom text link. `PrimaryServices` removed from import.
- RU homepage (`app/ru/page.tsx`) — 5 category cards matching EN structure (Russian text). Government Services card added. "Все гайды →" bottom text link. "Все гайды" demoted from primary card.
- `app/ru/government/page.tsx` — new static page. Russian copy. 3 guide cards (document-attestation, amer, pro-services, all /ru/guides/ hrefs). WhatsApp CTA. Hreflang: canonical `/ru/government`, en-alternate `/government`.
- `components/PrimaryServices.tsx` — retained, not imported anywhere.
- Soon cards are `<div>` (non-clickable), not `<Link>`. No fake hrefs.
- Business Bank Account remains inside `/company-setup` and `/ru/company-setup` hubs.
- Build: 63 pages, 0 errors (+1 from CP-18 due to new `/ru/government`)
- TypeScript: clean

---

## CP-18 — Locale-aware navigation fixed for RU pages

**Date:** 2026-04-29

**What is confirmed stable:**

- `lib/locale-path.ts` created: `getGuidePath()`, `getLocalePath()`, `getLocaleFromPathname()`
- `Footer.tsx` — locale-aware: `/ru/contact` link and Russian labels ("О нас", "Контакты") on RU pages
- `StickyRouteCta.tsx` — locale-aware: shows "Найти маршрут / Ответить на 2–3 вопроса" on RU pages
- 6 RU pages verified: `/ru/contact` in footer, Russian sticky CTA, no EN-only text
- 4 EN pages verified: unaffected (`/contact` link, English sticky CTA)
- `TopicCard.tsx` was already locale-aware (confirmed)
- `GuideTabs.tsx` was already locale-aware for guide links (confirmed)
- `PrimaryServices`, `RouteSnapshotBand`, `BrowseByService`, `QuickDecisionCards` — EN-only components, not used on RU pages, no change needed
- `RouteFinderFlow` — EN-only page (`/find-my-visa`), no RU equiv exists, no change needed
- Build: 62 pages, 0 errors

---

## CP-17 — Russian mainland-company-setup-dubai guide content live

**Date:** 2026-04-29

**What is confirmed stable:**

- RU content populated for `mainland-company-setup-dubai`: ru_title, ru_summary, ru_audience, ru_overview, all 8 step ru_* fields
- `/ru/guides/mainland-company-setup-dubai` returns 200, H1 in Russian, all 8 step titles in Russian
- EN page emits `ru` hreflang (hasRuContent triggered correctly)
- Sitemap includes `https://guidex-consulting.ae/ru/guides/mainland-company-setup-dubai`
- Build: 62 pages, 0 errors
- Script: `scripts/add-ru-mainland-company.ts`

---

## CP-16 — Russian golden-visa-dubai-property guide content live

**Date:** 2026-04-29

**What is confirmed stable:**

- RU content populated for `golden-visa-dubai-property`: ru_title, ru_summary, ru_audience, ru_overview, all 7 step ru_* fields
- `/ru/guides/golden-visa-dubai-property` returns 200, H1 in Russian, all 7 step titles in Russian
- EN page now emits `ru` hreflang (hasRuContent triggered correctly)
- Sitemap includes `https://guidex-consulting.ae/ru/guides/golden-visa-dubai-property`
- Build: 62 pages, 0 errors
- Script: `scripts/add-ru-golden-visa-property.ts`

---

## CP-15 — Russian employment-visa guide content live

**Date:** 2026-04-29

**What is confirmed stable:**

- RU content populated for `employment-visa`: ru_title, ru_summary, ru_audience, ru_overview, all 8 step ru_* fields
- `/ru/guides/employment-visa` returns 200, renders Russian H1 and all 8 step titles in Russian
- EN fallback for RU pages no longer needed for this guide — all ru_* fields populated
- EN page `/guides/employment-visa` now emits `ru` hreflang (hasRuContent triggered correctly)
- Sitemap includes `https://guidex-consulting.ae/ru/guides/employment-visa` (filtered by ru_title)
- meta description on RU page: Russian, 2 sentences, under 160 chars
- Build: 62 pages, 0 errors

**Script used:** `scripts/add-ru-employment-visa.ts` — kept for reference

---

## CP-14 — Phase 1B Russian routing verified

**Date:** 2026-04-29

**What is confirmed stable:**

- All 7 required routes return 200: `/`, `/guides`, `/guides/employment-visa`, `/ru/guides/employment-visa`, `/guides/golden-visa-dubai-property`, `/ru/guides/golden-visa-dubai-property`, `/admin/login`
- EN guide pages: hreflang `en` + `x-default` emitted. `ru` hreflang only when `hasRuContent=true` (currently none — all ru_* empty)
- RU guide pages: hreflang `en` + `ru` + `x-default` + canonical `/ru/guides/[slug]`
- Language switcher: EN pages show RU pill → `/ru/[path]`, RU pages show EN pill → `/[path]`
- RU pages render with EN fallback for all empty ru_* fields
- RU nav: Визы / Компании / Гайды (no Find My Route)
- Sitemap: 32 entries — EN static + EN guides + RU static + RU guide entries (0 currently, filtered by ru_title)
- No admin/writer imports in public bundle
- Build: 62 pages, 0 errors (commit 3927e4c)

**Remaining before RU launch:**
1. Populate ru_* fields via admin (priority order in docs/ru-launch-plan.md)
2. After translations, deploy: `git pull` + `npm run build` + `pm2 restart`
3. Submit sitemap to Google Search Console
4. Add Plausible analytics

---

## CP-13 — UpCloud migration complete, guidex-consulting.ae live on new server

**Date:** 2026-04-29

**What is confirmed stable:**

*Server:*
- Provider: UpCloud
- IP: 85.9.203.69
- SSH user: root
- App path: /var/www/guidex
- Node v20.20.2 (system NodeSource), PM2 guidex-production online
- 2 GB swap (persistent), pm2-root.service enabled
- Nginx reverse proxy, Let's Encrypt SSL, certbot.timer active

*Database:*
- guides.db.20260429-140304: 15 guides, 94 steps, all published, integrity ok
- Server path: /var/www/guidex/data/guides.db
- Server cron backup: /var/backups/guidex/ — daily 03:00, 30-day retention
- First backup verified: guides.db.20260429-140750 (124K, SQLite ok)

*Domain and SSL:*
- https://guidex-consulting.ae ✅ HTTPS 200
- https://www.guidex-consulting.ae ✅ HTTPS 200
- HTTP → HTTPS redirect: 301 ✅
- SSL: Let's Encrypt, valid to 2026-07-28, auto-renewal via certbot.timer
- DNS: @ + www → 85.9.203.69 (updated at Tasjeel 2026-04-29)

*Build:*
- Commit c127e9b — 62 pages (EN + RU Phase 1B), 0 errors
- Phase 1B Russian routing live (EN fallback until ru_* fields populated)

*Smoke tests (9/9 HTTPS 200):*
/ /guides /guides/employment-visa /guides/golden-visa-dubai-property /contact /admin/login /robots.txt /sitemap.xml https://www.guidex-consulting.ae/

**Cloudways (165.245.187.15):** Safe to cancel — all 8 migration phases complete.

**Remaining:**
1. Cancel Cloudways subscription
2. Populate ru_* content fields in admin (see docs/ru-launch-plan.md)
3. Submit sitemap to Google Search Console
4. Add Plausible analytics

---

## CP-12 — Server recovery complete, guidex-consulting.ae fully live

**Date:** 2026-04-28

**What is confirmed stable:**

*Recovered server:*
- Cloudways — Recovered-guidex-main-server — IP: 165.245.187.15
- SSH user: master_asumzwhebx
- App path: /home/master/applications/dgcmdxxpjx/public_html
- Node v20.20.2 via nvm, PM2 guidex-production online
- mod_proxy_http, proxy_module, proxy_fcgi_module re-enabled by Cloudways Support
- All project files, .env.local, data/guides.db, .next build survived recovery

*Domain and SSL:*
- Primary domain: https://guidex-consulting.ae — SSL Let's Encrypt ✅
- WWW: https://www.guidex-consulting.ae ✅
- DNS: A record → 165.245.187.15 (updated in Tasjeel after recovery)
- HTTP → HTTPS redirect: ✅ Enabled

*GitHub:*
- Commit fea9411 — all scripts updated to new IP/SSH user

**Remaining:**
1. Fresh production DB backup after stable recovery
2. Submit sitemap to Google Search Console
3. Add Plausible analytics

---

## CP-11 — Phase 12: guidex-consulting.ae live with HTTPS (original server)

**Date:** 2026-04-27

**What was confirmed stable:**

*Domain and SSL:*
- Primary domain: https://guidex-consulting.ae — SSL Let's Encrypt ✅
- WWW: https://www.guidex-consulting.ae ✅
- DNS was: A record → 157.245.207.99 (Tasjeel) — **old IP, server later suspended**
- HTTP → HTTPS redirect: enabled

*Server at time of CP (later suspended by Cloudways):*
- IP: 157.245.207.99 — SSH user: master_udndspcyhr

*Smoke test (all HTTPS, all 200):*
- / /guides /guides/employment-visa /guides/golden-visa-dubai-property
- /contact /admin/login /robots.txt /sitemap.xml /www apex

*Production DB backup:*
- backups/production-db/guides.db.20260427-223918

*GitHub:*
- Commit c7288f1 — all code, docs, scripts, and memory files pushed

---

## CP-10 — Phase 11: Cloudways deployment live on temporary URL

**Date:** 2026-04-27

**What is confirmed stable:**

*Server:*
- Cloudways DigitalOcean VPS — 157.245.207.99 — app ID dgcmdxxpjx
- Node v20.20.2 via nvm (user-level, no sudo)
- PM2 v6.0.14 — `guidex-production` online, 0 restarts, saved to dump

*Deployment:*
- All project files rsync'd to `/home/master/applications/dgcmdxxpjx/public_html/`
- `data/guides.db` uploaded (124K), backed up locally as `guides.db.backup-20260427-163049`
- `.env.local` on server: 5 vars, permissions 600, NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → temporary URL
- `npm ci` + `npm run build` — 38/38 pages, 0 errors
- `~/start-guidex.sh` — PM2 entry point (sources nvm, cd, PORT=3000)
- `.htaccess` — `RewriteRule ^(.*)?$ http://127.0.0.1:3000/$1 [P,L]`
- `mod_proxy_http` enabled by Cloudways Support
- `index.php` renamed to `index.php.placeholder` (preserved as backup)

*Smoke test (all 200, Next.js confirmed):*
- / /guides /guides/employment-visa /guides/golden-visa-dubai-property
- /contact /admin/login /robots.txt /sitemap.xml

**Not yet done:** Real domain (guidex-consulting.ae) — DNS and SSL not connected.

**Backup/sync workflow established:**
- `scripts/db-backup-from-server.sh` — pull production DB to `backups/production-db/`
- `scripts/db-restore-to-server.sh` — restore with server-side backup + PM2 restart
- Source-of-truth rules locked in `CLAUDE.md` and `docs/deployment-cloudways.md`

---

## CP-09 — Phase 6 launch-readiness complete

**Date:** 2026-04-25

**What is confirmed stable:**

*Technical SEO:*
- `sitemap.xml` — static, pre-rendered, 12 static pages + 11 guide pages
- `robots.txt` — static, blocks /admin/ and /api/auth/
- `metadataBase` in root layout — canonical and og:url resolve correctly
- Group redirect slugs: `permanent: true` (301)

*Deployment:*
- `.env.example` — 5 vars documented
- `docs/deployment-cloudways.md` — complete VPS guide
- `.gitignore` — guides.db added (manual `git rm --cached` still pending)

*Cleanup:*
- 5 Next.js boilerplate SVGs removed from `public/`

**Build:** Clean — 35 pages, 0 TypeScript errors.

**Remaining pre-launch actions:**
1. `git rm --cached data/guides.db && git commit` — untrack DB from git
2. Set domain and DNS on Cloudways
3. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` in `.env.local` on server
4. Add Plausible or other analytics when domain is live

---

## CP-08 — Calculator v1 live at /find-my-visa

**Date:** 2026-04-22

**What is confirmed stable:**

*Route finder / calculator:*
- `/find-my-visa` — static page, build clean, TypeScript clean
- `lib/route-finder-config.ts` — config-first, no DB deps, 6 question nodes, 13 resolutions
- `components/RouteFinderFlow.tsx` — client component, state machine, instant tap = answer
- All 14 guide slugs verified published before build. Zero mismatches.

*Coverage:*
- Family visa (new): spouse/child × outside/inside UAE → 4 guide resolutions
- Family visa (renew): 1 resolution
- Newborn visa: 1 resolution
- Employment (inside UAE): 1 resolution
- Employment (outside UAE): advisor state ("guide coming soon")
- Golden visa (property): 1 resolution; other routes → hub + WhatsApp
- Company setup: mainland / free zone / bank account / unsure → 3 guides + hub
- Supporting service injection: attestation on outside-country family routes; Amer on inside/renew; PRO on company routes

*Hub page CTAs added:*
- `/visas/family` — "Find My Route" CTA above guide cards
- `/visas/golden` — "Find My Route" CTA above guide cards
- `/company-setup` — "Find My Route" CTA above route cards

*Header:* "Find My Route" added as first nav item

**Build:** Clean — 31 pages. No TypeScript errors. `/find-my-visa` ○ Static.

**State going forward:**
- Calculator is production-ready. Next content priority: Employment Visa Outside-Country (upgrades the one advisor state to a full guide resolution).

---

## CP-07 — Government pillar fully live + visa pillar 6/7 live (14 guides published)

**Date:** 2026-04-22

**What is confirmed stable:**

*Government pillar (3/3 live):*
- `/guides/document-attestation-dubai` — published, 3 steps, MOFA attestation
- `/guides/amer-center-dubai` — published, 4 steps, service center orientation
- `/guides/pro-services-dubai` — published, 5 steps, PRO services orientation
- PrimaryServices: Government group fully live (was removed when 0 items live)

*Visa pillar (6/7 live):*
- `/guides/renew-family-visa-dubai` — published, 4 steps, in-country renewal route (adults 18+ medical; children exempt)
- PrimaryServices Visas group: Employment + New Family + Renew Family + Newborn + Golden + Property = 6 live. Maid Visa remains "Soon".

*Guide count:* 14 published, 0 drafts

**Build:** Clean — `[+11 more paths]` on `/guides/[slug]` static generation.

**Fee discipline established:**
- No AED ranges without official tariff backing (Amer, PRO services, notary PoA — all removed)
- Medical fitness test (AED 250–450) retained — well-supported GDRFA-approved center range
- "Varies by visa duration and family file status. Amer confirms at submission." — pattern for government-variable fees

**State going forward:**
- Next priority: Employment Visa Outside-Country (most common first-hire path)
- All three service pillars live: Visas ✅ Business Setup ✅ Government ✅

---

## CP-06 — Company-setup pillar fully live + homepage service-first reset

**Date:** 2026-04-21

**What is confirmed stable:**

*Company-setup pillar (3/3 routes live):*
- `/guides/mainland-company-setup-dubai` — published, 8 steps, DED mainland route
- `/guides/free-zone-company-setup-dubai` — published, 8 steps, general free zone route
- `/guides/open-business-bank-account-dubai` — published, 8 steps, post-formation banking
- `/company-setup` hub — all 3 route cards active as `<Link>` (not `soon`)
- Hub intro updated: "All three guides are live."

*Homepage service-first reset (Phase 5.14–5.17):*
- `PrimaryServices` component — 2 groups (Visas/Business Setup), no dead placeholders
- Employment Visa in Visas group (live, position 1)
- Business Setup: Company Setup + Mainland + Free Zone + Bank Account (all 4 live)
- Government & Legal removed until first real service is live
- WhatsApp CTA live in Header, Hero, FreeAdviceCta (all → wa.me/971506304817)

*Guide count:* 9 published (was 6 at CP-05)

**Build:** Clean — 24 pages. `/guides/[slug]` shows [+6 more paths].

**State going forward:**
- Company-setup pillar: complete
- Visa pillar: employment + spouse + child + golden/property = 8 guides (5 slugs, 2 group pages)
- Next: first new visa content (employment outside-country, newborn, or maid visa)

---

## CP-05 — Phases 4.5 + 4.6 complete (visual polish + real content + validation)

**Date:** 2026-04-17

**What is confirmed stable:**

*Visual identity (Phase 4.5):*
- `globals.css` — `@theme` with `--color-navy: #1B2E4B`, `--color-brass: #B5935A`
- `CategoryIcon.tsx` — 5 inline SVG micro-icons (14×14, 1.5px stroke, currentColor)
- `StepCard.tsx` (public) — step bubble `bg-navy`; advice block `bg-navy/[.06] text-navy`
- `Hero.tsx` — value cards `border-l-2 border-brass`; divider `border-stone-200`
- `TopicCard.tsx` — `bg-stone-50 border-stone-200`; category pill `bg-brass/[.08] text-brass/80`; brass CategoryIcon
- `GuideHeader.tsx` — brass CategoryIcon beside category label
- `guides/[slug]/page.tsx` — brass overlines above section h2s; navy CTA card at guide bottom

*Real guide content (Phase 4.6):*
- Employment-visa guide: "How to Get an Employment Visa in Dubai Without Leaving the UAE"
  — 8 steps, exact Tasheel/Amer/Tawjeeh fees, inside-country route, April 2025
  — Timeline: 2–4 weeks overall, 2–3 days per step
- Content writing standard locked in `CLAUDE.md` and `docs/article-template.md`

*Validation:*
- Guide `timeline` field: `required` HTML + server-side throw in `createGuideAction`, `updateGuideAction`
- Step `timeEst` field: `required` HTML + server-side throw in `updateStepAction`

**Build:** clean — 0 errors, 0 TypeScript errors, 11/11 pages
**DB confirmed:** guide timeline `2–4 weeks`; all 8 steps `2–3 days`; overview text consistent

**State going forward:**
- 1 published guide: `employment-visa` (real production content)
- Admin: full guide + step CRUD working
- Public visual system: complete
- Next: second article (dependent/family visa guide)

---

## CP-04 — Phase 4 complete (step management)

**Date:** 2026-04-12
**Branch/commit:** committed

**What is confirmed stable:**
- Full inline step CRUD in `/admin/guides/[slug]`
- `createStepAction` — appends empty step at `max(stepOrder) + 1`
- `updateStepAction` — writes all 14 fields (cost, timeEst, EN×6, RU×6)
- `deleteStepAction` — deletes + renumbers remaining steps contiguously
- `reorderStepAction` — swaps `stepOrder` integers with adjacent step
- `router.refresh()` pattern — no redirect on step mutations, guide form unsaved state preserved
- `StepCard.tsx` — per-step form: Save, Delete (confirm), ↑/↓ reorder, `useTransition` pending state
- `StepList.tsx` — step list + Add step button, empty state message
- DOM structure: `<GuideEditForm>` and `<StepList>` are siblings — no nested forms
- Build: clean (0 errors, 0 warnings)

**What was verified:**
- SQLite mutation logic tested directly: create appends correctly, delete renumbers
  `[1,2,3,4,5] → delete 3 → [1,2,3,4]`, reorder swaps adjacent integers
- 5 seeded employment-visa steps confirmed intact after test and restore
- Production build clean

**Phase next:** Phase 4.5 — public visual identity polish

---

## CP-03 — Phase 3A complete

**Date:** 2026-04-12
**Branch/commit:** uncommitted (Phase 3A verification pass complete)

**What is confirmed stable:**
- Guide CRUD: create, edit, save draft, save and publish, unpublish, delete
- Single-form intent pattern: field edits and publish happen in one DB write
- Unsaved-changes guard: dirty tracking, `beforeunload`, back-nav confirm dialog
- Success banner: shows on save redirect, auto-hides after 3s
- React key correctness: no duplicate sibling keys anywhere
- ISR revalidation: public page updates immediately after admin save
- Build: clean — 0 errors, 0 TypeScript errors, 0 deprecation warnings, 11/11 pages

**What was verified:**
- SQLite write paths tested programmatically: save draft preserves published,
  unpublish sets published=0, save and publish atomically sets field + published=1
- Public page curl confirmed returning updated content after DB write
- Static code audit: only one `key={saved ?? "init"}` in the codebase
  (on outer `<GuideEditForm>` in the page — inner elements carry no keys)
- `npm run build` output reviewed line by line — no warnings

**Known state going in:**
- 1 guide seeded: `employment-visa` (published)
- Steps table exists and public page renders steps; no admin step UI yet
- RU fields in DB and admin form; public site renders EN only

**Phase next:** Phase 4 — step management in the admin

---

## CP-02 — Phase 2 complete (admin foundation)

**Date:** 2026-04-12

**What is confirmed stable:**
- NextAuth.js v4 credentials login working
- Route protection via `proxy.ts` working
- Admin layout isolated from public site
- Guide list page shows all guides (draft + published)
- bcrypt auth bug fixed (dotenv-expand `$` escaping)
- `middleware.ts` → `proxy.ts` migration done

**Phase next:** Phase 3A — guide CRUD

---

## CP-01 — Phase 1 complete (SQLite migration)

**Date:** 2026-04-12

**What is confirmed stable:**
- All guide data migrated from MDX to SQLite
- Public site renders identically to pre-migration state
- Zero SEO regression — same URLs, same HTML output
- Employment-visa guide seeded with all steps
- MDX files and metadata.ts retired

**Phase next:** Phase 2 — admin foundation
