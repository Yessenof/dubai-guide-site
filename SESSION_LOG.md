# Session Log — Dubai Guide Site

Reverse chronological. One entry per meaningful implementation step.
Trivial edits (typos, comment fixes) do not get entries.

---

## 2026-06-08 — Phase 6C-99C COMPLETE (local only) -- Guide schema + RAG/AEO improvements

5 files changed. (1) lib/db/reader.ts: added updatedAt to GuideData interface + getGuideGroup + getPublishedGuideBySlug returns. (2) EN [slug]/page.tsx: Article + HowTo JSON-LD. (3) RU [slug]/page.tsx: Article + HowTo JSON-LD. (4) EN TRC custom page: BreadcrumbList (was missing) + Article + HowTo. (5) RU TRC custom page: same. All 17 guides x EN+RU = 34 pages now have [Organization, WebSite, BreadcrumbList, Article, HowTo] schemas. Article: headline, description, url, inLanguage, dateModified (ISO), publisher. HowTo: name, description, step[]{name, text} per locale. No totalTime/estimatedCost (human text). No author/image/datePublished (not reliably available). Build: 88 pages, 0 TS errors. QA: 32/32 pass. No deploy, no push, no DB write, no migrations. 3 docs created. Awaiting owner approval.

---

## 2026-06-08 — Phase 6C-99B-PROD COMPLETE -- Technical SEO fixes deployed to production

Commit 33d4460. Push to origin/main. Deploy: zero-downtime 49s build, PM2 reload ~1s, online 149.3MB. All 13 live routes HTTP 200. Sitemap: 92 URLs (5+5 events, 3+3 news). EN GITEX: hreflang=[en, ru, x-default], schemas=[Organization, WebSite, Event]. RU GITEX: hreflang=[ru, en, x-default], schemas=[Organization, WebSite, Event]. EN/RU F1, News, Calendar: all correct. Homepage: Organization+WebSite schemas, hreflang=[en, ru, x-default]. Guide regression: Organization+WebSite+BreadcrumbList. No DB write, no PM2 stop/start, no migrations, no admin. Production deploy report: docs/content-drafts/seo/PRODUCTION_DEPLOY_REPORT_6C99B.md.

---

## 2026-06-08 — Phase 6C-99B COMPLETE (local only) -- Technical SEO discovery fixes

7 files changed + 2 docs created. (1) app/sitemap.ts: added getPublishedEvents + getPublishedNewsPosts imports; 5 EN events + 5 RU events + 3 EN news + 3 RU news added to sitemap (92 total URLs). (2) lib/db/news-events-calendar.ts: added ruPublished to EventDetail, NewsPostDetail, CalendarPageDetail interfaces + getEventBySlug/getNewsPostBySlug/getCalendarPageBySlug return values. (3) EN event page: added ru hreflang (conditional on ruPublished) + Event JSON-LD when schema_eligible=1. (4) RU event page: added Event JSON-LD. (5) EN news page: added ru hreflang + NewsArticle JSON-LD when noindex!=1. (6) RU news page: added NewsArticle JSON-LD. (7) EN calendar page: added ru hreflang conditional. (8) OrgSchema.tsx: added WebSite schema alongside existing Organization schema. (9) Homepage page.tsx: added explicit title + description. Build: 88 pages, 0 TS errors. 27/27 QA checks passed. Awaiting deploy approval.

---

## 2026-06-08 — Phase 6C-99A COMPLETE -- Full SEO/RAG/AEO organic growth audit

8 audit files written to docs/content-drafts/seo/. No code changes made. Key findings: (1) Event pages (5 published) and news pages (3 published) not in sitemap — app/sitemap.ts never queries those tables. (2) All events have schema_eligible=1 but zero JSON-LD output — Event schema missing. (3) No HowTo schema on guide pages (BreadcrumbList only). (4) EN event/news/calendar pages missing hreflang ru alternate (guide pages are CORRECT — conditional on hasRuContent, true for all 17). (5) No Organization/WebSite schema. (6) New domain zero backlinks is primary organic growth blocker. Quick-win fix order: sitemap.ts event+news entries → hreflang ru for event/news/calendar EN pages → Organization schema → Event/HowTo/NewsArticle schemas. Audit files: FULL_SEO_RAG_AUDIT, TECHNICAL_SEO_INDEXING, SITEMAP_ROBOTS_CANONICAL_HREFLANG, CONTENT_QUALITY_AND_SEARCH_INTENT, KEYWORD_CLUSTER_AND_PAGE_MAPPING, RAG_AEO_ENTITY_READINESS, INTERNAL_LINKING_AND_SITE_ARCHITECTURE, ORGANIC_GROWTH_FIX_ROADMAP.

---

## 2026-06-08 — Phase 6C-98D DEPLOYED -- UAE Calendar internal linking improvements live on production

Commit: 8726038. Deploy: zero-downtime 49s build, PM2 reload ~1s. 14/14 live routes 200. GITEX/F1/Design Week/Big 5 event pages now link to SSG calendar detail pages via CalendarMiniPreview (e.g. /calendar/december-2026-uae-calendar). Related guide box shows "How to Set Up a Mainland Company in Dubai" instead of slug text. RU event pages use /ru/calendar/... hrefs. December + November SSG calendar regression: PASS. PM2 online 138.2 MB. No DB write, no migrations, no admin, no content import. Final report: UAE_CALENDAR_INTERNAL_LINKING_DEPLOY_REPORT_6C98D.md.

---

## 2026-06-08 — Phase 6C-98C COMPLETE (local only) -- UAE Calendar internal linking improvements

4 code files changed. (1) lib/db/news-events-calendar.ts: EventDetail gains calendarDetailSlug? and relatedGuideTitle? fields; getEventBySlug() does two secondary lookups -- calendar_pages by year+month to find SSG slug, guides by slug to get actual guide title. (2) CalendarMiniPreview.tsx: new optional detailSlug prop; when set, href = calendarBase/detailSlug (SSG page) instead of ?month= (dynamic listing). (3) EN event template: passes detailSlug, shows relatedGuideTitle. (4) RU event template: same, /ru/ prefix applied correctly. Result: GITEX/F1/Design Week/Big 5 event pages now link to SSG calendar detail pages. Guide box shows "How to Set Up a Mainland Company in Dubai" instead of slug text. Build: 88 pages, 0 TS errors. 16/16 local routes 200. No DB write, no push, no deploy. Recommendation: APPROVE_INTERNAL_LINKING_DEPLOY.

---

## 2026-06-08 — Phase 6C-98B DEPLOYED -- Calendar detail page internal link rendering fix live on production

Commit: bde7dba. Deploy: zero-downtime 48s build, PM2 reload ~1s. 14/14 live routes 200. December SSG now shows "View event guide →" links for GITEX and F1 (4 items). RU page shows "Открыть гид →" with /ru/events/... hrefs. November shows Design Week + Big 5 links correctly. September renders cleanly. Dynamic listing unaffected. No DB write, no migrations, no admin, no content import. Final report: CALENDAR_DETAIL_LINK_RENDERING_DEPLOY_REPORT_6C98B.md.

---

## 2026-06-08 — Phase 6C-98A COMPLETE (local only) -- Calendar detail page internal link rendering fix

3 files changed. (1) lib/db/news-events-calendar.ts: added `detail_url?: string` to CalendarDateItem interface. (2) app/(en)/(public)/calendar/[slug]/page.tsx: render `<Link href={item.detail_url}>View event guide →</Link>` in dates list pills row when detail_url present. (3) app/ru/calendar/[slug]/page.tsx: render `<Link href={/ru${item.detail_url}}>Открыть гид →</Link>`. Root cause: detail_url was stored in DB dates_json (added in 6C-97E/F) but CalendarDateItem type didn't declare it and SSG template never read it. Dynamic CalendarGrid.tsx was already correct. Build: 88 pages, 0 TS errors. 8/8 QA routes 200. December SSG now shows clickable event guide links. November shows links for Design Week + Big 5 (pre-existing). September clean. No DB write, no deploy, no production changes. Recommendation: APPROVE_LINK_RENDERING_DEPLOY.

---

## 2026-06-07 — Phase 6C-97F COMPLETE -- GITEX + F1 event pages production import and deploy

Script: scripts/import-high-value-event-pages-production-6c97f.ts. Production backup: guides.db.backup-pre-6c97f-2026-06-07-21-45-02 (752K). Inserted: gitex-global-2026 (id=f754720c, dubai-event, Dec 7-11), formula-1-abu-dhabi-grand-prix-2026 (id=4d54de70, festival, Dec 3-6). Both EN+RU published. 4 calendar detail_url links updated: DEC-04-GITEX, DEC-03-F1, DEC-NEW-01, DEC-R1. Guard fix: GITEX content guard was blocking historical DWTC mention -- fixed to positive checks (Expo City Dubai present, Dec 7-11 present). Deploy: zero-downtime 48s, PM2 online. All 10 live routes 200, 29 content checks PASS. Commits: b8da31c, 403249b. No migrations, no admin, no unrelated items.

---

## 2026-06-07 — Phase 6C-97E COMPLETE -- GITEX + F1 event detail pages local import QA

Script: scripts/import-high-value-event-pages-local-6c97e.ts. Local backup: guides.db.backup-pre-6c97e-2026-06-07-11-41-33. Events inserted: gitex-global-2026 (id=c6d5ca4f, dubai-event, Dec 7-11), formula-1-abu-dhabi-grand-prix-2026 (id=2eaeaf43, festival, Dec 3-6). Both EN+RU published. Fix: F1 category must be "festival" not "event" (enforced in local script, noted for production). December calendar detail_url updated for 4 items: DEC-04-GITEX, DEC-03-F1, DEC-NEW-01, DEC-R1. Build: 88/88, 0 TypeScript errors. All 8 routes 200. Content checks: 36/36 PASS. Production approval draft created. No production write, no push, no deploy.

---

## 2026-06-06 — Phase 6C-97D COMPLETE -- GITEX + F1 event draft files created

File-based EN/RU event detail drafts for GITEX Global 2026 and F1 Abu Dhabi Grand Prix 2026. Source recheck, schema audit, calendar linkage plan, and quality audit all created. No DB write, no deploy, no push.

---

## 2026-06-06 — Phase 6C-97C COMPLETE -- Batch 2B production import

Script: scripts/import-uae-calendar-batch-2b-production-6c97c.ts. Commit: 6665da8. DB backup: guides.db.backup-pre-6c97c-20260606-091142 (745472 bytes). Production import: 12 inserted, 1 updated (DEC-NEW-01), 0 skipped. Boris Grebenshikov (OCT-R2) CONDITIONAL VERIFIED across all 3 required docs — imported. Dec 3 F1 concert updated with Zara Larsson + Etihad Park venue correction (short_label=F1 Concert Night 1). Zero-downtime deploy run (rebuild required for SSG detail pages). Final totals: Sep=12, Oct=13, Nov=14, Dec=7. All 14 live QA routes 200. All content spot-checks PASS. PM2 healthy. No hard-excluded items. No migrations, no admin, no unapproved items. Final report: UAE_CALENDAR_BATCH_2B_PRODUCTION_IMPORT_REPORT_6C97C.md.

---

## 2026-06-06 — Phase 6C-97B COMPLETE -- Batch 2B local import QA

Script: scripts/import-uae-calendar-batch-2b-local-6c97b.ts. Local backup: data/guides.db.backup-pre-6c97b-2026-06-06T07-46-59 (736K). 12 new items inserted + 1 update (DEC-NEW-01 Lewis Capaldi → added Zara Larsson). Months: Sep+1 (The Corrs Sep 27 Abu Dhabi), Oct+2 (Elrow Oct 24, Boris Grebenshikov Oct 24), Nov+8 (Dubai Ride Nov 1, ANOTR Nov 13, When Chai Met Toast Nov 14, Anuv Jain Nov 20, KEINEMUSIK Nov 21, Dubai Run Nov 22, Atif Aslam Dubai Nov 27, Hiba Tawaji & Maalouf Nov 27), Dec+1 (Imagine Dragons Dec 5). Item counts: Sep=12, Oct=13, Nov=14, Dec=7. All 14 routes 200. Build: 88/88 pages, 0 TypeScript errors. Hard exclusions confirmed absent. Pre-import review doc created. QA report + production approval draft created. Recommendation: APPROVE_BATCH_2B_PRODUCTION_IMPORT. No production write, no push, no deploy.

---

## 2026-06-05 — Phase 6C-97A COMPLETE -- calendar density research (docs only)

Deep research phase. No production writes. 40+ sources checked across Jul-Dec 2026. July confirmed structurally thin (peak summer — major venues go quiet). 13 YES_READY items found for Batch 2B: SEP-R1 (The Corrs Abu Dhabi Sep 27), OCT-R1 (Elrow Oct 24), OCT-R2 (Boris Grebenshikov Oct 24), NOV-R1 through R8 (Dubai Ride Nov 1, ANOTR Nov 13, When Chai Met Toast Nov 14, Anuv Jain Nov 20, KEINEMUSIK Nov 21, Dubai Run Nov 22, Atif Aslam Dubai Nov 27, Hiba Tawaji+Maalouf Nov 27), DEC-R1 (Imagine Dragons Dec 5), DEC-UPDATE-1 (add Zara Larsson to existing F1 Concert Dec 3). Pending resolved: The Corrs (YES_READY), Elrow (YES_READY), Kadim Al Sahir (REJECT-past), Swedish House Mafia (REJECT-cancelled), DFC sub-events (YES_READY). Still HOLD: Global Village, DSF, Coca-Cola Arena Dec 16-20. Detail page plan created for GITEX, F1, OFFLIMITS, DSS. 6 docs created. NEXT: 6C-97B local import QA.

---

## 2026-06-02 — Phase 6C-96C COMPLETE -- Batch 2A production DB import (DB-only, no deploy)

Commit c4b6aaa pushed. DB backup: guides.db.backup-pre-6c96c-20260602-230123. Import script: scripts/import-uae-calendar-batch-2a-production-6c96c.ts, env gate CONFIRM_PRODUCTION_IMPORT_6C96C=yes. 15 items imported: Jul+3 (Atif Aslam, UFC, Restaurant Week), Aug+3 (SB Girls AD, Mawlid expected, Miami Show), Sep+1 (ATB), Oct+5 (God Save Queen, Sonny Fodera, Blue, Russell Peters, Riverdance), Nov+2 (OFFLIMITS/Shakira, Tarkan), Dec+1 (F1 Concert/Lewis Capaldi). Live QA: 22/22 routes 200. No code changes — DB-only, no PM2 reload. Report: UAE_CALENDAR_BATCH_2A_PRODUCTION_IMPORT_REPORT_6C96C.md. Totals: Jul=6, Aug=8, Sep=11, Oct=11, Nov=6, Dec=6.

---

## 2026-06-02 — Phase 6C-96B COMPLETE -- Batch 2A local import QA

Local DB backup: data/guides.db.backup-pre-6c96b-20260602-175147. 15 items imported locally. All 18 required routes 200 OK. All content spot-checks pass. No duplicates, no HOLD items imported, Mawlid imported as confidence=expected with moon-sighting disclaimer. Production readiness: APPROVED. Docs: UAE_CALENDAR_BATCH_2A_LOCAL_IMPORT_QA_6C96B.md, PREIMPORT_REVIEW, PRODUCTION_APPROVAL. No production write, no push.

---

## 2026-06-02 — Phase 6C-95C COMPLETE -- UAE Calendar UX deployed + Batch 1 production import

Commit d60c513 pushed. Deploy: zero-downtime script, 53s build, ~1s reload, PM2 online. DB backup: guides.db.backup-pre-6c95c-20260602-120350 (680K). Production import script: import-uae-calendar-batch-1-production-6c95c.ts, env gate CONFIRM_PRODUCTION_IMPORT_6C95C=yes. 12 items imported: Aug +2 (Back to School, This Is Michael), Sep +2 (Christina Aguilera, Paul Oakenfold), Oct +2 (mid-term break, Richard Marx), Nov +1 (Sharjah Book Fair), Dec +5 (new december-2026-uae-calendar page: Commemoration Day, National Day, F1 Abu Dhabi, GITEX, winter break). Live QA: 22/22 routes 200. UAE Calendar label live. No horizontal bars. F1/GITEX/Sharjah Book Fair all correctly labelled. No HOLD items. No migrations, no admin. Report: UAE_CALENDAR_BATCH_1_PRODUCTION_IMPORT_REPORT_6C95C.md.

---

## 2026-06-02 — Phase 6C-95B COMPLETE -- UAE Calendar Batch 1 local import QA

Local DB backup: data/guides.db.backup-pre-6c95b-20260602-113427. Import script: scripts/import-uae-calendar-batch-1-local-6c95b.ts. 12 new calendar items added: AUG-04-BACKSCH (Back to School Aug 31), AUG-05-MICHAEL (This Is Michael Abu Dhabi Aug 22), SEP-09-AGUILERA (Christina Aguilera Abu Dhabi Sep 25), SEP-10-OAKENFOLD (Paul Oakenfold Dubai Sep 18), OCT-05-MIDTERM (UAE school mid-term Oct 12-18), OCT-06-MARX (Richard Marx Coca-Cola Arena Oct 5), NOV-05-SIBF (Sharjah Book Fair Nov 4-15), DEC-01-COMMEM, DEC-02-NATDAY, DEC-03-F1, DEC-04-GITEX, DEC-05-WINBRK. New December page slug: december-2026-uae-calendar. 18/18 routes 200 OK (Jul-Dec EN/RU, December detail page EN/RU, DDW/Big5 regression). Build PASS 88/88 0 errors. No production write, no push, no deploy. HOLD: July (no new confirmed sources), The Corrs Sep (date TBC), VAT Q3 Nov (FTA date unverified), DFC (403), Global Village (no date), DSF (dates TBC), RISE Oct (1 source).

---

## 2026-06-01 — Phase 6C-95A COMPLETE -- UAE Calendar product recovery sprint

Part A: Renamed Dubai Calendar → UAE Calendar across 9 files (calendar index EN/RU, homepage EN/RU, life-setup EN/RU, CalendarContextCta, CalendarMiniPreview, CalendarGrid "This month" label). Part B/C: Removed 2px horizontal continuation bars from CalendarGrid — mid-range days now show 5px dim dot only. Build: PASS (88/88 pages). Part D: Research ledger for Jun-Dec 2026 events — 18 YES_READY candidates found (DSS, Back to School, school breaks, WETEX, National Day, Commemoration Day, F1 Abu Dhabi Dec 4-6, GITEX Dec 7-11, concerts). Part E: Density targets created — July/August/October/December most critical. Part F: Import candidate pack created with full EN/RU strings for 12 Batch-1 items. Part G: Detail page strategy — GITEX and F1 priority Class 1 pages. Part H: QA — all 12 routes 200, naming changes verified. No production write, no push, no deploy. NEXT: 6C-95B local import (December page + multi-month additions).

---

## 2026-06-01 — Phase 6C-94D COMPLETE -- November 2026 production import and deploy

Build: passed locally (no errors). Committed 20 files as c157861 and pushed to GitHub. Production DB backup created at /var/www/guidex/data/guides.db.backup-pre-nov2026-6c94d-20260601-120456 before deploy. Deployed via zero-downtime script: 54s build, ~1s PM2 reload, health check 200. Production import run with CONFIRM_PRODUCTION_IMPORT_6C94D=yes: 3 rows created (DDW event id=8d67fd22, Big5 event id=a4aa3f84, november-2026-dubai-calendar id=3347c9a7), all status=published. Post-import verification PASS. Live QA: all 12 routes 200 (homepage, RU homepage, 2x DDW EN/RU, 2x Big5 EN/RU, 2x November calendar EN/RU, 2x calendar index EN/RU, 2x September regression). Content spot-checks pass. No DFC, no Global Village, no Downtown Design standalone. ADIPEC correctly labelled Abu Dhabi. No migrations, no admin, no unapproved items. Report: NOVEMBER_2026_PRODUCTION_IMPORT_REPORT_6C94D.md.

---

## 2026-06-01 — Phase 6C-94C COMPLETE -- November 2026 local import QA

Script `scripts/november-2026-local-import-6c94c.ts` audited and fixed: `category` and `color_type` were set to `"event"` (not in allowed enums). Fixed to `festival`/`major-event` (DDW) and `dubai-event`/`major-event` (Big5). Pre-flight found orphaned draft from failed first run; cleaned up with `DELETE FROM events WHERE slug='dubai-design-week-2026'`. Re-run succeeded: 2 events + 1 calendar page imported to local DB and published. All 8 required routes return 200 against local dev server. No server errors. HOLD items: DFC (403), Downtown Design (source unreachable), Global Village (no date). 3 docs created: SCHEMA_AUDIT, QA, PRODUCTION_APPROVAL. Recommendation: APPROVE_WITH_NOTES. No production DB write, no push, no deploy.

---

## 2026-06-01 — Phase 6C-94B COMPLETE -- November 2026 event detail page drafts

Events route (/events/[slug]) reads from DB via getEventBySlug() -- requires status=published rows in events table. DB write forbidden in this phase. Created file-based drafts with all DB fields mapped. Files: docs/content-drafts/events/dubai-design-week-2026.md (EN, all DB fields), ru-dubai-design-week-2026.md (RU), big-5-global-dubai-2026.md (EN), ru-big-5-global-dubai-2026.md (RU). Source recheck: DDW "3 - 8 NOVEMBER 2026" (200), Big5 Nov23-26 (200 DWTC), DFC still 403. QA: all EN/RU parity checks pass. No em dashes. No unsupported claims. No copied source text. Internal detail_url plan: DDW item→/events/dubai-design-week-2026 (shared with Downtown Design); Big5→/events/big-5-global-dubai-2026. detail_url update plan doc created. ADIPEC: external CTA only (Abu Dhabi, no detail page). Import sequence: events first (2 rows), then calendar_pages. No DB write, no deploy, no push, docs only.

---

## 2026-06-01 — Phase 6C-94A COMPLETE — November 2026 calendar source pack and import plan

Sources verified: (1) DDW Nov 3-8 OFFICIAL_CONFIRMED from dubaidesignweek.ae ("3 - 8 NOVEMBER 2026" exact text); (2) Big 5 Nov 23-26 OFFICIAL_CONFIRMED from dwtc.com/en/events/the-big-5-2026/ (metadata 2026-11-23 to 2026-11-26, organizer DMG Events); (3) ADIPEC Nov 2-5 OFFICIAL_CONFIRMED from adipec.com (Abu Dhabi, ADNEC -- must label Abu Dhabi); (4) Downtown Design Nov 4-8 OFFICIAL_PARTIAL (DDW programme lists it as component, downtowndesign.ae unreachable 000). DFC: still 403. Global Village S31: announced, no date. Cityscape: 403. CCA: queue system. Dubai Opera: dynamic content. 5 docs created: source ledger, candidate matrix, short briefs, detail page plan, draft import payload. 4 YES_READY candidates. Projected coverage: 36.7% (11/30 unique days). With DFC: ~93%. Detail pages planned: DDW (/events/dubai-design-week-2026) + Big5 (/events/big-5-global-dubai-2026). No DB write, no deploy, no push, docs only.

---

## 2026-06-01 — Phase 6C-93D COMPLETE — Zero-downtime deploy fix & 502 prevention

Root cause confirmed: pm2 stop before build drops port 3000 for ~30s → nginx connection refused (111) → 502 for all users. Evidence: nginx error log showed 15+ 502 errors at 16:47 UTC during Phase 6C-93C deploy from real user (IP 5.38.42.61). Fix: scripts/deploy-zero-downtime.sh — build while app runs (no 502), then pm2 reload (~2-3s gap vs 30s). scripts/rollback.sh added. nginx error_page 502/503 → /maintenance.html applied on server (nginx -t passed, nginx -s reload done, site still 200). Commit 35d799b pushed. Scripts pulled to server. No DB write, no migrations, no app code, no content import. Recommendation: USE_NEW_DEPLOY_FLOW.

---

## 2026-05-31 — Phase 6C-93C COMPLETE — Calendar UX patch deployed to production

Commit 8bebafb pushed to origin/main. Server git pull fast-forward 0e1dd87→8bebafb. PM2 stop → npm run build (88 pages 0 errors EXIT=0, 24.5s compile) → PM2 start pid 209175 online. Live QA: 14/14 routes 200. Production checks: Jul/Aug h-[4px]=0 (old bars gone on production). Sep h-[2px]=6 (short-range bars live). Aug #2D5FA3=7 (new business color live). Jul/Aug DSS=17 (side panel present). No raw JSON. Build: 88 pages 0 errors. No DB write, no migrations, no new content imported. Deploy report: CALENDAR_UX_DEPLOY_REPORT_6C93C.md.

---

## 2026-05-31 — Phase 6C-93B COMPLETE — Calendar UX local QA and deploy readiness check

Dev server at localhost:3000. 12/12 routes 200. Grid QA: h-[4px]=0 in ALL months checked (Jul/Aug/Sep/Oct/Jun). h-[2px] bars=4 Oct (exact: Oct 7-8 Beautyworld + Oct 21-22 WETEX), 6 Sep, 4 Jun. #2D5FA3 (new business navy) live in Aug/Sep/Oct. #1B2E4B (old near-black) absent from all calendar items across all months. E-invoicing cross-ref link: 12 occurrences in Oct grid. Homepage carousel showing Jul/Aug correctly. RU routes 200. No raw JSON. Recommendation: APPROVE_WITH_MINOR_NOTES. Minor notes: DSS "Dubai Summer Surprises 2026" chip truncates to ~"Dubai Sum..." (DB fix needed, not code bug); #0D9488 property color not exercised (no live real_estate_event items). Report: CALENDAR_UX_DEPLOY_READINESS_6C93B.md. No push, no deploy, no DB write.

---

## 2026-05-31 — Phase 6C-93A COMPLETE — Calendar UX patch + PDF extraction + coverage audit

Root cause of July/August bar spam identified: DSS noindex_after=2026-09-01 → inferPeriodEnd returned 2026-08-31 (60d range ≤ 90 threshold) → expanded to 29 bars in July, 31 bars in August. Fix: LONG_RANGE_DAYS=7 constant in CalendarGrid.tsx. Items with inferred or explicit range ≥ 7d now show only on start date. Mid-range bars: 4px→2px/opacity-40. Colors: real_estate_event #1B2E4B→#0D9488 (teal), business_event #1B2E4B→#2D5FA3 (soft navy). Legend updated. Build: 88 pages 0 errors. TypeScript: 0 errors. 7 docs created: UX audit, redesign spec, QA notes, PDF extraction matrix (26 candidates/19 calendar/9 recurring/7 blocked), coverage audit (Aug-Dec+Jan), import candidate pack (8 READY + 3 pending), SEO/RAG audit. Phase report: PHASE_6C93A. No DB write, no deploy, no push.

---

## 2026-05-31 — Phase 6C-92 COMPLETE — Claude Routines setup for Guidex Daily Calendar Intelligence

5 Claude Code remote routines created and enabled. All use claude-sonnet-4-6, env_017eduszWN2ArhrAo3oEvEPH, standard context, no 1M context. R01 (Event Radar, 06:00 UTC): scans DWTC/Visit Dubai/dubaidesignweek/big5/gitex/globalvillage/fahr/DFC for Nov/Dec/Jan signals. R02 (Source Verification, 06:30): rechecks 6 HOLD items daily (DFC 403, Global Village, Mawlid, Cityscape, DSF, Sole DXB). R03 (Density Watch, 07:00): tracks Nov/Dec/Jan coverage vs 90% target. R04 (Live QA, 07:30): 19 production route checks + freshness. R05 (Import Candidate Pack, 08:00): synthesises R01-R04 → daily owner summary. Trigger IDs: trig_01N7xgjFVsXJUngruD3WunYi / trig_014nMNqBaHHABn91FAFEDzqn / trig_019JU3K2PBiehmRvAzsTQTXR / trig_01THaHu2wafKh5ZcVzC8zqp9 / trig_01Bsdr3WcdsZm3dAXEZ2JT3B. First run: 2026-06-01. GitHub App connection required (see phase report Section 11). 7 docs created: strategy + 5 routine templates + setup guide. No code/DB/deploy changes. docs/content-drafts/daily-radar/ created for outputs.

---

## 2026-05-31 — Phase 6C-91 COMPLETE — October 2026 calendar production import

Pre-recheck: Beautyworld 301/accessible, WETEX 200, DFC still 403 (HELD), e-invoicing cross-ref 200, October 404 (expected). Import script ran on production: `scripts/october-2026-calendar-import-6c90.ts`. Created and published `october-2026-dubai-calendar` (id=8ad2a183-75dd-427d-a70e-5b10237c3e9c). calendar_pages 8→9. TypeScript build failed first: `label_en` not in type assertion -- fixed with `Array<{ id: string; date: string; label_en?: string }>`, committed 0e1dd87. Second build: 88 pages 0 errors EXIT_CODE=0. PM2 pid 207214. 15/15 routes 200. EN: 1 L2 detail, WETEX 26 hits, Beautyworld 20, GITEX 0, DFC 0. RU: 1 L2 detail, WETEX 18, no EN fallback. Sitemap: 2 October entries. Sep unaffected (2 L2), e-invoicing unaffected (3 L2). Coverage: 25.8% (8/31). Production backup: /var/backups/guidex/guides.db.pre-october-calendar-6c91-. Report: PHASE_6C91.

---

## 2026-05-31 — Phase 6C-90 COMPLETE — October 2026 calendar local import QA

Source rechecks: Beautyworld 200 confirmed, WETEX 200 confirmed, DFC 403 (HELD), GITEX December confirmed. Created and published `october-2026-dubai-calendar` (new row -- CREATE). Script: `scripts/october-2026-calendar-import-6c90.ts`. Backup: `backups/local/guides-before-6c90-october-import-20260531-141612.db` (652K). Two attempts: first failed on em dash in OCT-04-EINV label_ru/en ("—" → replaced with comma). calendar_pages 9→10. 4 items: Beautyworld (L1 Oct6), WETEX (L2 Oct20), VAT Q3 (L1 Oct28), E-invoicing cross-ref (L1 Oct30, internal link). DFC Oct31 held -- site 403. 18/18 routes 200. 1 L2 detail (WETEX EN+RU). GITEX=0, Global Village=0, DFC=0 in pages. E-invoicing cross-ref renders as href in CalendarGrid hydration payload. 4 range bars (Oct7-8 Beautyworld, Oct21-22 WETEX). Sep unaffected (2 L2), e-invoicing unaffected (3 L2). Coverage: 25.8% (8/31 days -- DFC held). No production DB, no code, no deploy. Phase report: PHASE_6C90.

---

## 2026-05-31 — Phase 6C-89 COMPLETE — October 2026 calendar source radar and draft pack

Docs-only source radar and draft pack. Confirmed October 2026 items: Beautyworld Dubai Oct 6-8 (Messe Frankfurt/DWTC, L1), WETEX Oct 20-22 (DEWA/DWTC, L2 brief written EN+RU), UAE VAT Q3 deadline Oct 28 (FTA, L1), E-invoicing ASP cross-ref Oct 30 (internal link to existing live page, L1), DFC launch Oct 31 (source_ready but site now 403 -- recheck required, L1). Coverage: 29.0% (9/31 days) -- significantly below target. GITEX 2026 confirmed December (NOT October; corrected any October assumption). Dubai Airshow: no 2026 edition (biennial, odd years). Global Village Season 31: HOLD (estimated mid-Oct but no official date). Cityscape: HOLD/SOURCE_NEEDED. No imports, no code changes, no deploy. Files: october-2026-dubai-calendar.md, october-2026-calendar-sources.md, october-2026-calendar-density-report.md, PHASE_6C89 report.

---

## 2026-05-31 — Phase 6C-88 COMPLETE — September 2026 calendar deployed to production

Production import of september-2026-dubai-calendar. ATM source recheck: DWTC page returns 200, "14 - 17 Sep 2026" confirmed on page. Server at 1d4650d (synced in this phase). Backup: /var/backups/guidex/guides.db.pre-september-calendar-6c88-20260531-092503 (624K). Script ran cleanly: createCalendarDraft + publishCalendar, first attempt, no errors. Row ID: 915e1808-3130-4d97-9674-a5fef1d15e38. DB delta: calendar_pages 7→8, all others unchanged. Safe deploy: pm2 stop → npm run build → pm2 start. Live QA: 17/17 routes 200. 2 L2 details EN+RU (ATM + Corp Tax). Sep 14-17 text confirmed in live HTML. ATM in Aug = 0. Mawlid = 0. Cityscape = 0. EN title fallback on RU = 0. 6 range bars in Sep live grid. July 28 range bars confirmed still working. Aug (1 L2, 0 ATM), E-invoicing (3 L2): unaffected. Sitemap: 2 Sep URLs present. Coverage: 46.7% (14/30 days, sub-target). Phase 6C-86 range system confirmed in production. GSC: pending. Phase report: PHASE_6C88_SEPTEMBER_2026_CALENDAR_PRODUCTION_IMPORT_REPORT.md.

---

## 2026-05-31 — Phase 6C-87 COMPLETE — September 2026 calendar local import QA

Corrected B2-05 in batch2 candidates doc: ATM dates updated from stale Aug 17-20 to Sep 14-17; content level changed from L1/Aug to L2/Sep; monthly pages table updated. Created and published `september-2026-dubai-calendar` (new row -- CREATE). Script: `scripts/september-2026-calendar-import-6c87.ts`. Local DB backup: `backups/local/guides-before-6c87-september-import-20260531-131440.db` (632K). Import: 1 attempt, clean, no errors. Row ID: `e47b4587-fed3-4e77-866d-0ff302c09a1e`. calendar_pages 8→9. 8 items: MEE (L1 Sep1), IPS (L1 Sep7), AIM (L1 Sep7), ATM (L2 Sep14-17), PLME (L1 Sep15), Seamless (L1 Sep22), Forex (L1 Sep22), Corp Tax (L2 Sep30). 16/16 routes 200. 2 L2 details EN+RU (ATM + Corp Tax). No EN fallback. ATM = 0 in August. Mawlid = 0. Cityscape = 0. 6 range bars in Sep grid (MEE Sep2-3, ATM Sep15-17, Seamless Sep24). Coverage: 46.7% (14/30 days) -- sub-target, documented. Phase 6C-86 range system confirmed working with Sep items. No production DB, no code change, no deploy. Phase report: PHASE_6C87_SEPTEMBER_2026_CALENDAR_LOCAL_IMPORT_QA.md.

---

## 2026-05-31 — Phase 6C-86 COMPLETE — Calendar visual density, homepage freshness deployed

UI-only phase. Key changes: (1) CalendarGrid: added inferPeriodEnd() helper using noindex_after field (≤90 day threshold) so event_seasonal items expand across their full month. Start dates show full colored pill; mid-range days show 4px colored bar. AgendaCard shows Ongoing/Идёт badge for range-expansion views. (2) calendar-helpers: mapped all runtime DB type values (retail_offer, venue_show, trade_show, conference, compliance, family, entertainment) to correct category/color — this fixed a long-standing bug where DSS and concerts showed in gray. (3) FeaturedSlider: optional gradientFrom field for per-slide color variety. (4) Homepage (EN+RU): carousel now prioritizes current/upcoming monthly calendar pages, filters stale events (>7d past end) and old news (>90d), uses teal/amber/navy gradient variation. Live: July 28 range bars (blue), August 30 range bars (blue), June 3 bars, homepage teal gradient confirmed. TypeScript clean. Build clean. 16/16 routes 200. No DB changes. Deployed via safe sequence. Phase report: PHASE_6C86_CALENDAR_VISUAL_DENSITY_EVENT_MEDIA_HOMEPAGE_FRESHNESS_REPORT.md.

---

## 2026-05-29 — Phase 6C-85 COMPLETE — August 2026 calendar deployed to production

Production import of august-2026-dubai-calendar. Server was at 81d21a9 — git pull synced to b1a62a2 (3 commits: 6C-82 report, 6C-83 draft pack, 6C-84 local QA). Backup: /var/backups/guidex/guides.db.pre-august-calendar-6c85-20260529-104130 (616K). Script ran cleanly: createCalendarDraft + publishCalendar, first attempt, no errors. Row ID: 8210213f-8a1b-45d7-9fa5-32e8bc94db5e. DB delta: calendar_pages 6→7, all others unchanged. Safe deploy: pm2 stop → npm run build → pm2 start. Live QA: 15/15 routes 200, 22/22 content invariants pass. EN+RU index/follow. Sitemap: both EN+RU August URLs present. DSS Back to School L2 brief confirmed in live HTML EN+RU. ATM absent (0 occurrences EN+RU). No EN fallback on RU. June (4 details), July (1 detail), e-invoicing unaffected. Coverage: 96.8% (30/31 days -- Aug 31 only gap). GSC URL inspection: pending. Phase report: PHASE_6C85_AUGUST_2026_CALENDAR_PRODUCTION_IMPORT_REPORT.md.

---

## 2026-05-29 — Phase 6C-84 COMPLETE — August 2026 calendar local import QA

Created and published `august-2026-dubai-calendar` (new row — CREATE, not UPDATE). Script: `scripts/august-2026-calendar-import-6c84.ts`. Local DB backup before import: `backups/local/guides-before-6c84-august-import-20260529-093916.db` (580K). Import: 1 attempt, clean first run (no publish validation failures). Row ID: `6375670b-2842-43c4-a9d3-7235aae0ef75`. calendar_pages 7→8. Dates_json: 3 items (AUG-01-DSS L2, AUG-02-DEFLEP L1, AUG-03-DIHAD L1). 14/14 routes 200. 30/30 invariants pass. EN+RU index/follow. Sitemap EN+RU August URLs present. L2 brief (DSS Back to School) confirmed in initial HTML EN+RU. ATM: 0 occurrences (correctly absent). No EN fallback on RU page. June (4 details), July (3 items), e-invoicing unaffected. Coverage: 96.8% (30/31 days -- Aug 31 only gap). No production DB, no code change, no deploy. Phase report: PHASE_6C84_AUGUST_2026_CALENDAR_LOCAL_IMPORT_QA.md.

---

## 2026-05-28 — Phase 6C-83 COMPLETE — August and September 2026 calendar draft pack

Docs-only source radar and draft pack. August 2026: 3 items confirmed (AUG-01-DSS L2 Back-to-School focus covers Aug 1–30, AUG-02-DEFLEP L1 Def Leppard Aug 2 CCA, AUG-03-DIHAD L1 DIHAD Aug 24–26 DWTC). Coverage: 96.8% (30/31 days — Aug 31 is gap). September 2026: 8 items confirmed (SEP-01-MEE L1 Sep 1–3, SEP-02-IPS L1 Sep 7–9, SEP-03-AIM L1 Sep 7–9, SEP-04-ATM L2 Sep 14–17, SEP-05-PLME L1 Sep 15–17, SEP-06-SEAMLESS L1 Sep 22–24, SEP-07-FOREX L1 Sep 22–23, SEP-08-TAX L2 Sep 30 with heavy compliance caveats). Coverage: 46.7% (14/30 days) — sub-target, documented. Key correction: ATM rescheduled from Aug 17–20 to Sep 14–17 (DWTC official + May 22 2026 trade press). Batch2 B2-05 must be updated before Phase 6C-86. Beat the Heat DXB, Timur Bey 2, Mawlid Al-Nabi, Cityscape: all excluded — no confirmed 2026 source. Files: august-2026-dubai-calendar.md, september-2026-dubai-calendar.md, august-september-2026-calendar-sources.md, august-september-2026-calendar-density-report.md, PHASE_6C83 report. No DB, no code, no deploy.

---

## 2026-05-28 — Phase 6C-82 COMPLETE — July 2026 calendar deployed to production

Production import of july-2026-dubai-calendar. Server was behind (at 5bac54d) — git pull synced to 81d21a9. Backup: /var/backups/guidex/guides.db.pre-july-calendar-6c82-20260528-193114 (616K). Script ran cleanly: createCalendarDraft + publishCalendar. Row ID: 48233336-4d9c-442a-b990-23287a97c34d. DB delta: calendar_pages 5→6, all others unchanged. Safe deploy: pm2 stop → npm run build → pm2 start. Live QA: 13/13 routes 200, 22/22 content invariants pass. EN+RU index/follow. Sitemap: both EN+RU July URLs present. CSS 200 text/css. June page unaffected (4 details, Mallathon brief confirmed). E-invoicing page unaffected. Coverage: 93.5% (29/31 days calendar-only), 97% with e-invoicing Jul 1. Beat the Heat / Timur Bey / RE:SET absent. Phase report: PHASE_6C82_JULY_2026_CALENDAR_PRODUCTION_IMPORT_REPORT.md. GSC URL inspection: pending.

---

## 2026-05-28 — Phase 6C-81 COMPLETE — July 2026 calendar local import QA

Created and published `july-2026-dubai-calendar` (new row — CREATE, not UPDATE). Script: `scripts/july-2026-calendar-import-6c81.ts`. Local DB backup before import: `backups/local/guides-before-6c81-july-import-20260527-181640.db`. Three import attempts needed to discover all required publish fields (`image_path` + `official_source_url` + `image_alt` + `ru_image_alt`) — drafts from failed attempts deleted via sqlite3. Final row ID: `9a3b6c4c-8098-4b14-8f3d-93f0a337ea04`. Dates_json: 3 items (JUL-03-DSS L2, JUL-03-MODESH L1, JUL-03-KHAIR L1). 12/12 routes 200. Content invariants: 1 `<details>` EN+RU (DSS only), DSS brief EN+RU confirmed, Modesh + KHAIR labels present, Beat the Heat named only as DSS component (correct), no Timur Bey, no RE:SET, e-invoicing Jul 1 not duplicated. SEO: correct EN+RU titles and meta. Sitemap: both EN+RU URLs present. en_notes/ru_notes: user-facing public content only. em dash violations: 0. Coverage: 93.5% (29/31 days, calendar-only); 97% combined with e-invoicing Jul 1 (separate page). No production DB, no code change, no deploy. Phase report: PHASE_6C81_JULY_2026_CALENDAR_LOCAL_IMPORT_QA.md.

---

## 2026-05-27 — Phase 6C-80 COMPLETE — July 2026 DSS summer calendar enrichment sprint

Docs-only source scan for July 2026. Scanned 12 official/authorized sources: DFRE/Zawya, visitdubai.com (403), DWTC events page (May only, no July), beattheheatdxb.ae (still 2025 Season 4), CCA/Platinumlist, Dubai Opera/Platinumlist, Expo City Dubai (no July events), KHDA/Gulf News, Cinema Akil (calendar not renderable), whatson.ae (discovery), hhoteldubai.com (discovery). Key finding: Muntazah Al Khairan theatrical comedy at Dubai Opera July 3-4 confirmed — Platinumlist is an authorized official Dubai Opera ticketing partner; event explicitly DSS 2026 branded. Critical correction: initially suspected CCA venue but confirmed venue is Dubai Opera. Added JUL-03-KHAIR (L1) to July draft. July calendar now has 3 items: JUL-03-DSS (L2), JUL-03-MODESH (L1), JUL-03-KHAIR (L1). Coverage: 93.5% (29/31 days via DSS umbrella). Beat the Heat DXB Season 5: no announcement — still HOLD. Great Dubai Summer Sale 2026 phase dates: not announced. Expo City: no July events confirmed. Timur Bey 2 at CCA (Jul 9): still signal_only. July calendar recommended for local import QA (Phase 6C-81). Files: july-2026-dubai-calendar.md updated, july-2026-dss-summer-calendar-sources.md created, july-2026-calendar-density-update.md created, density candidates + radar updated, Phase 6C-80 report created. No DB, no code, no deploy.

---

## 2026-05-27 — Phase 6C-79 COMPLETE — June 2026 calendar enrichment deployed to production

Production update of june-2026-dubai-calendar: 5 items → 8 items. Git pull on production server (c3f2d5c → 5bac54d) to sync Phase 6C-78 script. Production DB backup created. Script `scripts/june-2026-calendar-enrich-local-import-6c78.ts` run on production server — resolved row by slug lookup (ID `adddc561-74dd-4541-9183-34802f2aedd6`), updateCalendarDraft + publishCalendar. Two full safe deploy cycles (pm2 stop → build → pm2 start): initial deploy + hotfix. Hotfix reason: en_notes field renders publicly in a `<p>` tag — the import script had included an internal editorial note ("RE:SET (Jun 6, Dubai Opera): genre unverified, kept on hold") in en_notes by mistake. Hotfix script `fix-notes-6c79.ts` replaced en_notes/ru_notes with clean public-facing source-disclosure text. Live QA: 12/12 routes 200, 4 `<details>` EN+RU, Mallathon brief full text confirmed in HTML EN+RU, RE:SET absent (0 occurrences), no EN fallback on RU page, no raw Markdown/JSON, source labels visible, CSS 200, sitemap 2 URLs. Coverage: 83% (25/30 days). Phase report: PHASE_6C79_JUNE_2026_CALENDAR_ENRICHMENT_PRODUCTION_UPDATE_REPORT.md.

---

## 2026-05-27 — Phase 6C-78 COMPLETE — June 2026 calendar enrichment local import QA

Local import QA for 3 enrichment items. Script created: `scripts/june-2026-calendar-enrich-local-import-6c78.ts`. Local DB backup: `backups/local/guides.db.pre-june-enrichment-6c78-20260527-121704`. Local row updated: ca207e36 (june-2026-dubai-calendar), 5 → 8 items. 12/12 routes 200, 4 `<details>` EN+RU, all briefs in initial HTML, TypeScript 0 errors, CSS 200 91KB. RE:SET excluded (genre unverified). Coverage: 83%. Report: PHASE_6C78_JUNE_2026_CALENDAR_ENRICHMENT_LOCAL_IMPORT_QA.md. Docs + script committed.

---

## 2026-05-27 — Phase 6C-77 COMPLETE — June/July 2026 calendar source enrichment sprint

Docs-only source scan. Found 4 June enrichment candidates: JUN-15-MALLATHON (L2, Batch A — dubaimallathon.ae + mediaoffice.ae), JUN-20-BASSI (L1, Batch A — dubaiopera.com), JUN-24-ORCH (L1, Batch A — dubaiopera.com), JUN-06-RESET (L1, Batch B — genre unverified, HOLD). July: DSS Jul 3–Aug 30 confirmed (Zawya/DFRE); Modesh World dates not announced; Beat the Heat DXB 2026 on HOLD (Jul 4-13 were 2025 dates); CCA July concerts signal-only. Files updated: june-2026-dubai-calendar.md (enrichment candidates added), july-2026-dubai-calendar.md (calendar_type fixed to monthly, status updated). Files created: june-july-2026-calendar-event-sources.md, PHASE_6C77 report. No DB, no code, no deploy.

---

## 2026-05-26 — Phase 6C-69 COMPLETE — Calendar fill sprint plan and first 30 candidates

Documentation-only phase. Read all relevant source files (seed matrix, content model, full radar matrix, production priority queue, source research queue, e-invoicing brief data, events/tourism source ledger, long weekends source ledger). Created three output documents: (1) `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md` — complete sprint plan covering 8 new monthly calendar pages (Jun–Jan), 5 new standalone topic pages, 7 priority batches, strict Islamic date hold rules, event date monitoring schedule, and P0 noindex blocker flag. (2) `docs/content-drafts/calendar/2026-2027-first-30-calendar-candidates.md` — 30 individually documented source-safe calendar date item candidates from Jan 2026 through Feb 2027; each with source status, page assignment, content level (L1/L2/L3), readiness tier (T0–T3), allowed claims, blocked claims, and next action. (3) `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md` — phase summary. Key finding: P0 noindex blocker (hardcoded `robots: index:false` in all 3 route files) means NO calendar content is currently indexed — must be fixed before next content wave has SEO value. 26 of 30 candidates are source-safe today; 4 are monitoring/hold (Islamic dates, DSF, Ramadan 2027). No code, no DB, no commits.

---

## 2026-05-26 — Phase 6C-68C COMPLETE — Calendar brief visual/interaction polish

Owner screenshot review found 5 issues after 6C-68 local QA. Fixed: (1) `resolveCalendarMonth` now uses earliest date month for non-yearly pages — e-invoicing preview links to July 2026, not May; Long Weekends still generic with yearBadge "2026". (2) `itemCtaLabel` now checks `brief_en`/`brief_ru` first — items with indexed briefs show "Show details →" / "Показать детали →"; external `cta_url` fallback added to AgendaCard/Row/GroupedAgendaRow/GroupedAgendaCard for Scenario A items. (3) CalendarBriefSection: heading → "Key date notes" / "Пояснения к датам"; summary row redesigned (date badge, 14px/semibold title, type pill, expand hint in navy); CTA rendered as pill button. (4) Dates list: 14px/semibold titles, "notes ↓" indicators. (5) AgendaRow: 14px/semibold labels. TypeScript clean, 88 pages 0 errors, 14/14 routes 200. Report: PHASE_6C68C_CALENDAR_INDEXED_BRIEF_VISUAL_INTERACTION_POLISH_REPORT.md. Not pushed. Commit pending owner approval.

---

## 2026-05-26 — Phase 6C-68 COMPLETE — E-invoicing indexed brief local import QA

Local import of UAE e-invoicing content to support CalendarBriefSection QA. Two records created and published: news post `uae-e-invoicing-2026-asp-deadline-update` (id `0d12b049`) and calendar page `uae-e-invoicing-2026-asp-deadline` (id `011f928a`) with 3 date items (TAX-05A, TAX-05C, TAX-05D) each carrying full brief_en + brief_ru. Script `scripts/e-invoicing-indexed-brief-local-import-6c68.ts` required two fixes before passing: title shortened from 90 to 61 chars, source_label changed from "Ministry of Finance UAE" to enum value "official". Local DB backup at `backups/local/guides.db.pre-6c68-20260526-004835`. Route QA: 14/14 routes 200. SSR check: 3 `<details>` in raw HTML on EN and RU pages; RU brief text present, no EN fallback. CTA links (`<a href="/news/...">`) present in HTML; Scenario B target returns 200. Existing pages: 0 `<details>`, date list counts intact. Report: PHASE_6C68_E_INVOICING_INDEXED_BRIEF_LOCAL_IMPORT_QA.md. LOCAL ONLY. No push, no deploy, no production import.

---

## 2026-05-26 — Phase 6C-67 COMMITTED — Calendar brief UI code foundation

Six files committed as `feat: add server-rendered calendar brief UI foundation` (c774709). Changes: 18 optional brief fields added to `CalendarDateItem` and `CalendarDateItemExtended` interfaces (additive); `CalendarBriefSection.tsx` server component created (no "use client", `<details>/<summary>` SSR pattern); component added to EN and RU calendar detail pages. TypeScript clean, build 88 pages 0 errors, 10 route checks all 200. Existing pages: 0 `<details>` on pages without brief data. CalendarGrid not touched. Phase report: PHASE_6C67_CALENDAR_BRIEF_UI_CODE_MVP_REPORT.md. NOT pushed — push approval needed separately.

---

## 2026-05-24 — Phase 6C-55B COMPLETE — Safe deploy rule documented

Docs-only update following Phase 6C-55 P0 CSS incident. No code, no DB, no deploy. Updated docs/deployment-upcloud.md: "Pull code update and redeploy" section now shows mandatory pm2 stop → build → pm2 start sequence with full warning explaining the build race condition. Phase 4 annotated (no risk on first deploy when PM2 not yet running). Updated DECISIONS.md: new entry "Safe Production Deploy Sequence: Stop PM2 Before Build" with root cause, incident date, evidence (old CSS 500), acceptable downtime (~30s), future optional improvement (atomic directory swap), and alternatives rejected. Created PHASE_6C55B_SAFE_DEPLOY_RULE_SUMMARY.md. Commit recommended alongside memory files.

---

## 2026-05-24 — Phase 6C-55 COMPLETE — P0 CSS incident diagnosed and resolved

Production site rendered without CSS on real devices for ~4 minutes during Phase 6C-54 nohup build. Root cause: Next.js Turbopack deleted old CSS hash (0i59pw~swdt7w.css) during compilation while PM2 still served HTML referencing it. Confirmed via Nginx access log (500 for old hash at 20:03:51). No Nginx proxy cache — Nginx is transparent reverse proxy. Current CSS (0gqktdxjmy9t5.css): 200, 67,846 bytes, text/css, Tailwind utilities confirmed. All 10 routes 200. PM2 PID 145929 online stable. Self-healed by pm2 restart already done in 6C-54 deploy — no additional rebuild needed. Report: PHASE_6C55_PRODUCTION_CSS_STATIC_ASSET_INCIDENT_REPORT.md.

---

## 2026-05-24 — Phase 6C-54 COMMITTED + DEPLOYED — Dubai Life Setup MVP live in production

Commit e4ef907 pushed to origin/main. Production: git pull (fast-forward ac0e12f→e4ef907, 5 files), nohup build (88 pages 0 errors 28.2s), pm2 restart (PID 145929). First SSH build attempt failed (SSH timeout during TypeScript check) — resolved by nohup. Live QA: 13/13 routes 200, /life-setup lang=en robots=index,follow canonical correct, /ru/life-setup lang=ru robots=index,follow canonical correct no EN fallback, EN homepage → /life-setup "Explore →", RU homepage → /ru/life-setup "Открыть →". Deploy report: PHASE_6C54_DUBAI_LIFE_SETUP_MVP_DEPLOY_REPORT.md.

---

## 2026-05-22 — Phase 6C-54 COMPLETE — Dubai Life Setup MVP built — awaiting commit + deploy

Created app/(en)/(public)/life-setup/page.tsx (EN hub, SSG) + app/ru/life-setup/page.tsx (RU hub, SSG). Fixed EN homepage card: div → Link, "Coming soon" → "Explore →". Fixed RU homepage card: href="/ru/guides" → href="/ru/life-setup", "Смотреть →" → "Открыть →". Content: 5 timeline stages (Before Arrival/Arrival Week/First 30 Days/First 90 Days/Annual) + 7 route cards (Family/Business Owner/Property Owner/Pet/Holiday Home/Investor/Renewal). All guide links verified against live published slugs. No DB records. No schema changes. No new components. TypeScript: 0 errors. Build: 88 pages 0 errors. Local QA: /life-setup 200 lang=en robots=index,follow; /ru/life-setup 200 lang=ru 0 EN fallback; EN homepage card → /life-setup; RU homepage card → /ru/life-setup. Source-risk: no unsupported claims; AED 2M backed by golden visa guide; authority pointers for uncovered topics. RU naturalness: natural editorial Russian, proper nouns preserved (Emirates ID, Ejari, Corporate Tax). All 10 existing key routes: 200, no regressions. Safe to commit. Report: PHASE_6C54_DUBAI_LIFE_SETUP_MVP_BUILD_REPORT.md.

---

## 2026-05-22 — Phase 6C-53 COMPLETE — Dubai Life Setup MVP product plan — Phase 6C-54 ready

Planning-only phase. No code, no DB, no deploy. Produced: DUBAI_LIFE_SETUP_MVP_PRODUCT_PLAN.md (authoritative Phase 6C-54 build spec) + PHASE_6C53_SUMMARY.md. Key decisions: MVP = single hub page per locale (/life-setup + /ru/life-setup), all content hardcoded JSX (no DB records), no new components, homepage card fix included in scope (div → Link, "Coming soon" → "Explore →"), 4 code files total. Content: 5 timeline stages (Before Arrival/Days 0-7/30 Days/90 Days/Annual) + 7 route cards (Family/Business/Property/Pet/Holiday Home/Investor/Renewal), each with task lists linking to 17 existing published guides where applicable. Source risk table: P0 claims blocked for DHA/KHDA/RTA/MOCCAE/DED renewal fees until source ledgers exist. RU parity required at launch (not optional). Build: expect 88 pages. Full QA checklist in plan.

---

## 2026-05-22 — Phase 6C-52 COMPLETE — Eid news P1 copy hotfix — all process language removed

Targeted DB hotfix on news_posts slug uae-eid-al-adha-2026-federal-holiday-long-break. Backup: guides.db.pre-eid-news-copy-hotfix-6c52-20260522-102055. Changes: EN body (2 replacements): removed "; verify before publish." from para 2 end + removed "All source URLs captured in the related source ledger. Recheck before publication." from source note. RU body (2 replacements): removed "; проверить перед публикацией." from para 2 end + removed "URL всех источников зафиксированы в источниковом реестре. Повторная проверка обязательна перед публикацией." from source note. EN length: 1918→1812. RU length: 2070→1933. 1 row updated. DB verification: 0 banned phrases, all required content present, 0 editorial --. Build: 86 pages 0 errors. PM2: online PID 133779. Live QA: 2/2 routes 200. All 6 banned phrases: 0 in live HTML. Factual scope unchanged: dates, sector distinction, DGHR/KHDA factual note preserved. ALL P0+P1 copy issues now resolved across all 12 audited routes. Report: PHASE_6C52_EID_NEWS_COPY_HOTFIX_REPORT.md. Next: Dubai Life Setup MVP.

---

## 2026-05-22 — Phase 6C-51 COMPLETE — Post-hotfix reading quality recheck — 10/12 PASS, 1 new P1

Full reading quality review of all 12 live routes after Phase 6C-50 hotfix. No DB changes, no code changes, no deploy. Results: 10/12 routes PASS, 0 P0 issues. New P1 finding (not caught in Phase 6C-49): `/news/uae-eid-al-adha-2026-federal-holiday-long-break` EN+RU body contains "verify before publish", "source ledger", and "Recheck before publication" — editorial process instructions visible to public users. Proposed fix for Phase 6C-52: remove 2 clauses from EN body + 2 from RU body (news_posts table), no facts changed. Global checks: all 11 banned-phrase patterns = 0 across all 12 routes. Reading quality: all 6 page types well-structured, first paragraphs lead with key facts. P2 notes: Emiratisation news body verbose (scope caveat ×4, acceptable for compliance topic), Long Weekend sources section has bare URLs (acceptable, lower priority). Cleared for Dubai Life Setup MVP planning. Report: PHASE_6C51_POST_HOTFIX_COPY_RECHECK.md.

---

## 2026-05-22 — Phase 6C-50 COMPLETE — Production copy hotfix — all P0+P1 issues resolved

Direct DB write to production. Backup: guides.db.pre-copy-hotfix-6c50-20260522-072104. Changes: Long Weekend en_notes+ru_notes (removed datesJson, may-2026-uae-calendar slug, --); Emiratisation calendar en_notes+ru_notes (removed "Calendar Item B"/"Пункт B", "2026-специфичным"); Long Weekend en_body (6 `--` patterns → 0 editorial --); Long Weekend ru_body (15 `--` patterns → 0 editorial --); Emiratisation news en_body (4 replacements: captured/Guidex jargon); Emiratisation news ru_body (5 replacements: захваченный/Guidex); Eid event en_body+ru_body (removed leading ---, fixed table note). All DB writes: 4 rows × 1 = 4 rows total (calendar_pages ×2, news_posts ×1, events ×1). Build: 86 pages 0 errors. PM2: online PID 131761. Live QA: 8/8 routes 200. Banned phrases: 0 in all live HTML. Factual scope unchanged (50+, no AED amounts, no June 30 for 20-49 band). Report: PHASE_6C50_PRODUCTION_COPY_HOTFIX_REPORT.md.

---

## 2026-05-22 — Phase 6C-49 COMPLETE — Live content copy audit — 4 P0 + 9 P1 issues documented

Full audit of 8 live pages (2 news, 1 event, 3 calendar, 2 guide samples). URGENT P0 issues: Long Weekend `en_notes`/`ru_notes` contain `datesJson` (internal DB field name) and `may-2026-uae-calendar` (internal DB slug) — live now, readable by users. Emiratisation calendar `en_notes`/`ru_notes` contain "Calendar Item B" / "Пункт B" (internal editorial labels). Long Weekend `en_body` has 7× `--` double hyphens. P1: Emiratisation news body has "captured source" sourcing jargon + Guidex brand self-mentions in EN + RU. Eid event body starts with `---` (orphaned HR). Deliverables: `PUBLIC_COPY_POLISH_RULES.md` (10 permanent rules), `reviews/live-content-copy-audit.md`, `reviews/live-content-copy-polish-plan.md` (SQL-ready fix plan), 2 draft files corrected, `uae-long-weekends-2026-2027-copy-drift-note.md` (new). No DB writes, no code changes, no deploy. Phase 6C-50 DB hotfix pending approval. Report: `PHASE_6C49_LIVE_CONTENT_COPY_AUDIT_SUMMARY.md`.

---

## 2026-05-22 — Phase 6C-48 DEPLOYED — DetailHero + CalendarMiniPreview live on production

Push: bc041a6 + ac0e12f → origin/main (2d2691e..ac0e12f). Production: git pull (9 files, Fast-forward) → npm run build (86 pages, 0 errors, 21.8s) → pm2 restart (online, PID 128615, 0 unstable restarts). Live QA: 19/19 routes 200. DetailHero gradient confirmed on all 5 tested EN detail pages. Preview targets: all 12 correct (Eid → ?month=2026-05, Emiratisation → ?month=2026-06, Long Weekend → /calendar generic + yearBadge "2026"). RU CTA: "Открыть календарь за май 2026" / "за июнь 2026" confirmed. RU badge: "мая 2026" / "июня 2026" (genitive, correct). May calendar chips: 23/25/26/27 (sorted). robots=index,follow on all 6 EN detail pages. lang=en/ru correct. Raw Markdown 0. Admin /admin/content → 307, /admin/login → 200. Homepage carousel link present (uae-eid-al-adha-2026). Deploy report: PHASE_6C48_DETAIL_HERO_AND_CALENDAR_PREVIEW_DEPLOY_REPORT.md.

---

## 2026-05-22 — Phase 6C-48B News calendar targeting corrected — all 12 detail pages month-specific

News posts have no event date or calendar_month field — only datePublished. Added slug-based `NEWS_CALENDAR_MONTH` mapping in both news detail pages (EN + RU): `uae-eid-al-adha-2026-federal-holiday-long-break → 2026-05`, `uae-emiratisation-june-30-2026-deadline → 2026-06`. Mapping is temporary until news_posts gains explicit calendar_month column. CalendarMiniPreview now receives `calendarMonth` for these two slugs; unknown slugs remain generic. QA: TypeScript 0 errors, build 86 pages 0 errors, 18/18 routes 200 (added /calendar?month=2026-05, ?month=2026-06, RU variants). Exact targets verified: Eid news EN/RU → ?month=2026-05; Emiratisation news EN/RU → ?month=2026-06; events → from eventDateStart; calendar pages → month field or inferred. Long Weekend: generic /calendar, yearBadge "2026". No nested anchors confirmed. Robots index/follow preserved. RU lang=ru, no EN fallback. Raw Markdown 0. Report updated: PHASE_6C48_DETAIL_HERO_AND_CALENDAR_PREVIEW_REPORT.md. Pending: commit + deploy approval.

---

## 2026-05-22 — Phase 6C-48 Detail Hero and CalendarMiniPreview system complete — local, pending deploy

Created 2 new components and modified 6 detail pages. `components/detail/DetailHero.tsx`: hero with bg image, gradient, eyebrow, h1 + `categoryImage()` helper (visa/living → JLT; company/tax/banking → DIFC; default → skyline). `components/calendar/CalendarMiniPreview.tsx`: whole-card `<Link>`, no nested `<a>`, supports `range` (events → individual day chips), `dateItems` (calendar pages → first 5 chips), `yearBadge` (yearly pages), locale-aware labels and date formatting. 6 pages modified: news EN+RU (generic preview, no calendarMonth — news lacks event date field), events EN+RU (calendarMonth from eventDateStart.slice(0,7), range chips), calendar EN+RU (smart month resolution: month field → direct; month=null + all dates in one month → infer; month=null + multi-month → undefined → yearBadge). CalendarContextCta removed from all 6 pages (kept in codebase). QA: TypeScript 0 errors, build 86 pages 0 errors, 16/16 routes 200. Eid event EN: skyline hero, /calendar?month=2026-05, May 25-29 chips. Eid RU: /ru/calendar?month=2026-05, Russian chips. Emiratisation: /calendar?month=2026-06 (smart resolution from single-date datesJson). Long Weekend: generic /calendar, yearBadge "2026", Jan 1/Mar 19/Dec 1/Dec 2 chips. No nested links. Source trust blocks present. Published pages remain robots=index,follow. Report: `docs/content-drafts/PHASE_6C48_DETAIL_HERO_AND_CALENDAR_PREVIEW_REPORT.md`. Pending: owner commit + deploy approval.

---

## 2026-05-22 — Phase 6C-47B Production build complete — homepage carousel updated

`npm run build && pm2 restart guidex-production` on production (root@85.9.203.69, /var/www/guidex). No code changes, no DB changes, no pull needed (production already at `2d2691e`). Build: 86 pages, 0 errors, TypeScript 0 errors. PM2 online (PID 126356). Homepage now statically pre-rendered with current DB state: Long Weekend (`uae-long-weekends-2026-2027`) confirmed at carousel slot 5 in both EN and RU from production HTML. Carousel order: Eid event → Eid news → Emiratisation news → Emiratisation calendar → Long Weekend → May calendar → Employment guide (7 slides). All detail page checks pass: EN lang=en, RU lang=ru, both robots=index follow, raw Markdown 0, fahr.gov.ae source trust block present, RU no EN fallback. Calendar integration: no Eid Al Adha duplication in May calendar (0 matches for uae-long-weekends in May calendar HTML). Admin routes: login 200, /admin/content + /admin/guides redirect to login with callbackUrl. 14 routes 200 total. Report: `docs/content-drafts/PHASE_6C47B_LONG_WEEKEND_BUILD_REFRESH_REPORT.md`. Pending: GSC indexing (2 URLs).

---

## 2026-05-21 — Phase 6C-47 Long Weekend Calendar Reference imported to production — build pending

Production import of `uae-long-weekends-2026-2027` as a `calendar_pages` yearly reference page. `scripts/long-weekend-calendar-import.ts` run on production server (root@85.9.203.69, /var/www/guidex). Pre-import backup: `/var/backups/guidex/guides.db.pre-longweekend-6c47-20260521-192515`. Record id=1f06eca2-676c-4ca6-a22a-a9d124fa44ba: calendarType=yearly, month=null, year=2026, ruPublished=1, hasIslamicDates=0, featuredHomepage=0. 4 datesJson items: New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3. Eid Al Adha (May 25-29) excluded — confirmed by pre-flight guard and post-import DB assertion (9/9 pass). 9 routes 200 (EN+RU detail, EN+RU list, 5 regression routes). Raw Markdown 0. Source trust visible. CalendarContextCta links to /calendar. No Eid Al Adha duplication in May calendar. Carousel NOT yet visible on production homepage — root cause: homepage is a synchronous (non-async) React Server Component with no `dynamic` or `revalidate` export; Next.js pre-renders it at build time; new DB records do not invalidate the pre-built HTML. Fix requires `npm run build && pm2 restart guidex-production` (no code changes). Report: `docs/content-drafts/PHASE_6C47_LONG_WEEKEND_PRODUCTION_IMPORT_REPORT.md`. No code modified, no schema changes. Pending: production build approval + GSC indexing (2 URLs).

---

## 2026-05-21 — Phase 6C-46 Long Weekend Calendar Reference imported locally — ready for production

Local import of `uae-long-weekends-2026-2027` as a `calendar_pages` yearly reference page. `scripts/long-weekend-calendar-import.ts` created and run. Record id=a6d4d59b-d09a-4282-a908-1f87ba9fab51: calendarType=yearly, month=null, year=2026, ruPublished=1, hasIslamicDates=0, featuredHomepage=0. 4 datesJson items: New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3. Eid Al Adha (May 25-29) excluded — confirmed by pre-flight guard and post-import DB assertion. All 9 assertions pass. 6 routes 200 (EN+RU detail, calendar list, homepage). Raw Markdown 0 in both EN and RU. Source trust block visible. CalendarContextCta links to /calendar (month=null behavior). Carousel now 7 slides: Long Weekend at slot 5 (all calPages enter pool). No Eid Al Adha duplication in May calendar view confirmed. QA report: `docs/content-drafts/PHASE_6C46_LONG_WEEKEND_LOCAL_IMPORT_QA.md`. No code modified, no commit, no push, no deploy.

---

## 2026-05-21 — Phase 6C-45 Long Weekend Calendar Reference import path confirmed — planning only

Code inspection of calendar_pages schema, detail page renderer, list page, admin form, and validation confirmed: calendar_pages model is fully suitable; no pre-import code or schema changes needed. calendarType must be `"yearly"` (not "annual" — invalid; corrected from Phase 6C-43 decision doc). month: null is safe across all rendering paths. Eid Al Adha excluded from datesJson (already in may-2026-uae-calendar — duplicate CalendarGrid risk). 4 safe datesJson candidates: New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3. D-6 resolved by inspection; D-1–D-5 require owner approval. Deliverables: `docs/content-drafts/reviews/uae-long-weekends-calendar-reference-import-map.md`, `docs/content-drafts/PHASE_6C45_SUMMARY.md`, CONTENT_PRODUCTION_PRIORITY_QUEUE.md + FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md updated. No code deployed, no content published, no DB changes.

---

## 2026-05-21 — Phase 6C-44 DEPLOYED — commit 171dac1 pushed and live on guidex-consulting.ae

`git push origin main` (`78015d4..171dac1`). Production: `git pull` → `npm run build` (86 pages, 0 errors, TypeScript 0 errors) → `pm2 restart guidex-production` (online, PID 121704). Live QA: all 16 routes 200; EN carousel 7 slides confirmed (Eid event → Eid news → Emiratisation news → Emiratisation calendar → May calendar → 2 guides); RU carousel 7 slides with RU CTAs ("К событию →", "Читать →", "Открыть календарь →", "Читать гайд →"); This Month: 2 deduplicated items on both EN and RU; Monday-first (Mo–Su / Пн–Вс) confirmed; 0 mock refs; all detail pages lang+robots correct; no raw Markdown; RU pages fully in Russian; admin routes protected (307 when logged out). Deploy report: `docs/content-drafts/PHASE_6C44_HOMEPAGE_CAROUSEL_AND_CALENDAR_AGENDA_DEPLOY_REPORT.md`.

---

## 2026-05-21 — Phase 6C-44 Homepage carousel priority + calendar agenda UX polish complete

Unified `CarouselSlide` export type added to `components/FeaturedSlider.tsx` — replaces `GuideListItem[]`; every slide carries its own `bgImage` field. Priority carousel builder added to both `app/(en)/(public)/page.tsx` and `app/ru/page.tsx`: events → news → calPages → GUIDE_PRIORITY_SLUGS → other guides. Image fallback map: events/calendar → dubai-skyline-downtown.webp; news → difc-business-bay-glass-towers.webp; visa/living guides → jlt-dubai-towers-sunset-reflection.webp; company/hiring guides → difc. `buildThisMonthItems()` now deduplicates by `detail_url` (seenKeys Set) — 4 Eid items collapse to 1 row "Federal Eid holiday"; events also checked against seenKeys to prevent double Eid row. Calendar date items now pass `detail_url` as `href`. `CalendarGrid.tsx` GroupedAgendaCard compact mode: uses `itemShortLabel` (prefers `short_label_en/ru` from DB), caps sub-items at 3 with "+N more" overflow. CTA labels in `lib/calendar-helpers.ts` updated: "Details →"→"See holiday →", "View event →"→"Event details →", "Open →"→"Open calendar →", "Read guide →"→"Deadline details →"/"Tax deadline →". TypeScript: 0 errors. Build: 86 pages, 0 errors. Route QA: 16 routes all 200. Content QA: Eid event slide 1, both news in slides 2–3, both calendar pages in slides 4–5, This Month 2 deduplicated items, Monday-first headers, no mock data, no raw Markdown, lang attrs correct, RU short labels confirmed. Report: `docs/content-drafts/PHASE_6C44_HOMEPAGE_CAROUSEL_AND_CALENDAR_AGENDA_REPORT.md`. Not committed, not deployed — pending owner approval.

---

## 2026-05-21 — Phase 6C-43B Owner visual review checklist complete

`docs/content-drafts/OWNER_PUBLIC_SURFACE_REVIEW_CHECKLIST.md` created: 9 sections with exact production URLs (guidex-consulting.ae), visual QA checkboxes per section, 9-question Long Weekend import decision table (D-1 through D-6 blocking import, D-7 through D-9 optional), blocking decision summary. `docs/content-drafts/PHASE_6C43B_SUMMARY.md` created. No code changes, no DB changes, no commit.

---

## 2026-05-21 — Phase 6C-43 Content production queue and radar matrix update complete

`docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md` updated: Long Weekend marked owner_review_ready, import_path_pending, DO NOT IMPORT gate added (P2-09 entry with 6 owner decisions). `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` updated: VIRAL-01 summary and detail rows reflect import_path_pending status, Phase 6C-43. `docs/content-drafts/PHASE_6C43_SUMMARY.md` created.

---

## 2026-05-21 — Phase 6C-40A Emergency public rendering and calendar UX fix complete

`components/MarkdownBody.tsx` created — minimal server-compatible Markdown renderer (h2/h3/h4, **bold**, pipe tables, bullet lists, HR skip), zero external deps. Applied to all 6 detail page routes (EN + RU: events, news, calendar). Raw `####`, `**bold**`, `|table|`, `---` no longer visible on live pages. `CalendarContextCta` extended with `highlightStart`/`highlightEnd` props — renders navy date-pill strip for event date ranges; event detail pages pass `eventDateStart`/`eventDateEnd`. `CalendarGrid.tsx`: (1) Monday-first headers (`["Mo","Tu","We","Th","Fr","Sa","Su"]`, shift formula `(rawFirstDay+6)%7`); (2) `expandRanges()` — multi-day items now appear on every date in range (Eid May 25–29 shows on all 5 days); (3) `groupByDetailUrl()` + `GroupedAgendaCard/Row` — 4 Eid cards collapsed into 1 grouped card. TypeScript: 0 errors. QA: 10 routes checked, all 200, all detail pages render proper HTML headings, no raw Markdown, `robots: index, follow` confirmed. Report: `docs/content-drafts/PHASE_6C40A_PUBLIC_RENDERING_AND_CALENDAR_UX_FIX_REPORT.md`.

---

## 2026-05-20 — Phase 6C-40 VIRAL-01 UAE Long Weekends 2026-2027 source-safe draft package complete

File-based content package created for UAE public holidays 2026-2027 — no code, no DB, no import, no publish, no push, no deploy, no commit of draft content. Files created: (1) `docs/content-drafts/source-ledgers/uae-long-weekends-2026-2027-sources.md` — 6 sources; 3 FAHR URLs verified 200 (New Year 2026, Eid Al Fitr 2026, Eid Al Adha 2026); MoHRE Arabic captured; Cabinet Res 27/2024 via FAHR text (direct URL 403); u.ae framework 200; full 2026+2027 holiday status tables; confirmed/fixed/monitoring categories. (2) `docs/content-drafts/guides/uae-long-weekends-2026-2027.md` — full EN+RU guide draft; 5 key facts tables; 6 body sections; SEO title EN 60 chars, RU 62 chars; meta EN 158 chars, RU 155 chars; 6 EN + 5 RU keywords; RAG/AEO summary EN+RU; 7 blocked claim categories absent from publishable copy; calendar connection planning (4 confirmed + 6 monitoring items, no import); lifecycle: evergreen_seasonal; 5 EN + 5 RU social hooks; WhatsApp CTA EN+RU; no em dashes in publishable copy; вы throughout RU. (3) `docs/content-drafts/reviews/uae-long-weekends-2026-2027-owner-review.md` — 13-dimension readiness score (all Pass except content type mapping flagged); 11 confirmed claims; 7 monitoring items with unlock conditions; 7 blocked claim categories; pre-import checklist; Decision 1 (import path — recommend news_posts); Decision 2 (update cadence — recommend per-FAHR-announcement); recheck schedule. (4) `docs/content-drafts/PHASE_6C40_SUMMARY.md` — full phase summary. Surgical updates: FULL_CALENDAR_AND_NEWS_RADAR_MATRIX (VIRAL-01 → owner_review_ready, SOC-01 → owner_review_ready), CONTENT_PRODUCTION_PRIORITY_QUEUE (timestamp), SOURCE_RESEARCH_QUEUE (Phase 6C-40 capture summary), CONTENT_AUDIT_MATRIX (scope 10→13, File 13 detailed audit added). Verdict: owner_review_ready with two decisions pending. Recommend import before June 10, 2026.

---

## 2026-05-20 — Phase 6C-39 Emiratisation A-only production DB deploy complete

`scripts/emiratisation-june30-import.ts` run on production server. Production backup taken before deploy (`guides.db.pre-emiratisation-6c39-20260520-225341`). Records created: news `35d9ae35` (slug=uae-emiratisation-june-30-2026-deadline, status=published, noindex=0, ru_published=1) and calendar `b479cd5b` (slug=uae-emiratisation-june-30-2026-reminder, status=published, calendar_type=important_dates, 1 date item — Item A only). Item B NOT imported. Post-import rebuild: 86 pages clean, PM2 restarted online. Route QA: all 14 routes (4 Emiratisation + 10 existing) return 200. Robots: index, follow on all 4 Emiratisation detail pages. Content safety: no AED amount, no "all companies", no June 30 for 20-49 band, source note present, RU served in Russian (no EN fallback). Item B hold maintained — absent from production DB. Production DB now: 2 news posts + 1 event + 2 calendar pages + 17 guides. Report: `docs/content-drafts/PHASE_6C39_EMIRATISATION_PRODUCTION_DEPLOY_REPORT.md`.

---

## 2026-05-20 — Phase 6C-38B Public surface stabilization deployed to production

Commit `dd2ab89` pushed to origin/main. Production: pulled, built (86 pages clean), PM2 restarted (online). Live QA all pass. Production /calendar now reads `getPublishedCalendarPages()` — no mock data. Eid A–D visible in RSC payload. "Coming soon" confirmed on homepage Life Setup card. Published detail pages still `index, follow`. Emiratisation records (news + Calendar A) are 404 on production — expected, local-only, require separate Phase 6C-39 DB deploy. Report: `docs/content-drafts/PHASE_6C38B_PUBLIC_SURFACE_STABILIZATION_DEPLOY_REPORT.md`.

---

## 2026-05-20 — Phase 6C-38 Emergency public surface stabilization complete

Four public surface issues identified and fixed. (1) Calendar mock data: both `/calendar` and `/ru/calendar` were passing `MOCK_CALENDAR_ITEMS` (18 fake items) to CalendarGrid — DB never read. Fixed: both pages now call `getPublishedCalendarPages()` and flatten real dates from all published calendar pages. Mock items fully removed. Eid A–D (May 23–29) now visible from `may-2026-uae-calendar`. Emiratisation deadline (Jun 30) also visible from `uae-emiratisation-june-30-2026-reminder`. No dead `/mock-*` CTAs exposed. (2) Dubai Life Setup: `<Link href="/guides">` changed to non-clickable `<div>` with "Coming soon" label — no longer routes users to All Guides in place of a non-existent product. (3) Homepage desktop alignment: `FeaturedSlider.tsx` had `px-5` on inner wrapper divs; moved to outer `<section>`, matching all other homepage sections. Desktop: slider now aligns with surrounding cards (was 20px narrower and inset before). (4) `compliance_deadline` type: added runtime string check in `itemCategoryType()` — maps to `government_deadline` (amber, "Deadline" badge, Business filter). TypeScript: 0 errors. Build: 86 pages clean. All routes 200, detail pages `index,follow`. DGHR/KHDA absent. Report: `docs/content-drafts/PHASE_6C38_PUBLIC_SURFACE_STABILIZATION_REPORT.md`.

---

## 2026-05-20 — Phase 6C-37 TAX-01 Emiratisation A-only local import and launch QA complete

MoHRE source URLs rechecked live (both HTTP 200, content unchanged). Import script `scripts/emiratisation-june30-import.ts` created following `eid-import.ts` pattern: 22-string em dash pre-flight, createNewsDraft + publishNews + createCalendarDraft + publishCalendar. Records created: news `26cf9c7b-5480-4524-9ee3-b44837595aae` (slug=uae-emiratisation-june-30-2026-deadline, status=published, noindex=0, category=government, ru_published=1, EN meta 140 chars, RU meta 138 chars) and calendar `9a5404e5-4116-41ee-aa0a-c5fac832d626` (slug=uae-emiratisation-june-30-2026-reminder, status=published, calendar_type=important_dates, year=2026, dates_json 1 item only — Item A). Item B NOT imported, still held. Route QA: all 4 routes (EN/RU news + calendar) return 200, robots: index, follow. Regression: 17 guides unchanged, Eid news still live. Content safety: no em dashes in article body (template title suffix only), Item B not asserted as fact, no AED figure. Draft files metadata updated (db_status → published_local). Phase report: `docs/content-drafts/PHASE_6C37_EMIRATISATION_LOCAL_IMPORT_QA.md`. Verdict: news + Item A ready for production deploy. Item B remains held.

---

## 2026-05-20 — Phase 6C-36 TAX-01 Emiratisation final QA + Item B hold correction complete

Phase 6C-35 package audited against owner decisions. Decision 1 (contributions framing without AED amount): ACCEPTED — cautious framing kept. Decision 2 (20-49 band deadline): HOLD APPLIED — the January 2024 MoHRE source for the 20-49 band does not confirm June 30 2026; only the 7 May 2026 MoHRE news confirms June 30, and that source primarily covers the 50+ band. Files modified: (1) `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` — major restructure: June 30 asserted only for 50+ employees; 20-49 band softened throughout to "verify with MoHRE"; EN meta trimmed to 140 chars; RU meta trimmed to 138 chars; all publishable em dashes removed (EN source note x2, RU key facts table, RU source note x2, RU RAG/AEO, plus prior-session quick answer/what-to-check fixes); status → owner_review_ready. (2) `docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md` — Item A (50+): owner_review_ready; Item B (20-49): fully reclassified to hold_source_pending_do_not_import; blocked claim added: "30 June 2026 applicability to the 20–49 employee band is not confirmed by the captured official source." (3) `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md` — Phase 6C-36 final decision section added; both decisions resolved; import recommendation table; pre-import checklist. (4) `docs/content-drafts/PHASE_6C36_SUMMARY.md` — created. Surgical updates: FULL_CALENDAR_AND_NEWS_RADAR_MATRIX (v1.1→1.2, TAX-01 row updated), CONTENT_PRODUCTION_PRIORITY_QUEUE (Item B HOLD noted, import sequence news+Item A only), SOURCE_RESEARCH_QUEUE (status updated), CONTENT_AUDIT_MATRIX (Phase 6C-36 notes for files 11+12). Validation: all publishable sections em-dash free; metas under 160 chars; no code/DB/admin/import/publish/push/deploy/commit. Import path: news + Item A after owner approval + source recheck. Item B: hold until 2026-specific MoHRE source confirms June 30 for 20-49 band.

---

## 2026-05-20 — Phase 6C-35 TAX-01 Emiratisation June 30 content package complete

Source-safe content package created for Emiratisation June 30 2026 compliance window. No code, no DB, no import, no publish, no push, no deploy, no commit. Files created: (1) `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` — full EN + RU news draft; 2 MoHRE official sources cited; EN SEO title 57 chars; EN meta 155 chars; RU meta 158 chars; 2-sentence summaries; 6-paragraph bodies; key facts tables; who/check/assume/source sections; blocked claims verified absent; lifecycle: compliance_deadline, noindex_after: 2026-07-10, archive_action: keep_public. (2) `docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md` — 2 calendar items: A (50+ employees: 1% semi-annual quota, June 30) and B (20–49 employees: 1 UAE national, June 30 — phase-in date must be verified at publish); EN + RU labels and agenda text; no AED amounts; mainland scope stated on all items; noindex_after: 2026-07-10. (3) `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md` — factual safety audit CLEAN; all blocked claims absent; EN/RU quality pass; HOLD status — 2 owner decisions required: (a) financial contributions framing acceptable? (b) 20–49 band activation date confirmed as June 30? (4) `docs/content-drafts/PHASE_6C35_SUMMARY.md` — phase summary, pre-import checklist, git status. Surgical updates to 4 planning docs: FULL_CALENDAR_AND_NEWS_RADAR_MATRIX (TAX-01 row + detail block + Cluster A updated, version 1.1), CONTENT_PRODUCTION_PRIORITY_QUEUE (Phase 6C-35 queue summary added), SOURCE_RESEARCH_QUEUE (Emiratisation status: draft_created, Phase 6C-35 entry added), CONTENT_AUDIT_MATRIX (Phase 6C-35 addition section with 2 new files). Status: owner review required before any import action.

---

## 2026-05-20 — Phase 6C-34 Eid Al Adha 2026 production launch complete

All three Eid Al Adha 2026 records (news + event + calendar) deployed to production. Commit `fde9c36` pushed to origin/main. Production DB backed up before changes (`guides.db.pre-eid-6c34-20260520-141403`, 372K). Discovery: `news_posts`, `events`, `calendar_pages` tables had never been applied to production — applied `scripts/migrate-add-news-events-calendar.sql` (schema only, IF NOT EXISTS guards). Ran `scripts/eid-import.ts` on production (3 records created: news `9485dbb9`, event `4a260f00`, calendar `fadcf8e4`). Applied compressed 2-sentence summaries via SQL UPDATE (import script embeds original summaries; fix applied by slug). Production build: clean (86 pages, 24.4s). PM2 restarted: online. All 6 live URLs (EN+RU × news/event/calendar) return HTTP 200 with `robots: index, follow`. Unknown slug → 404 confirmed. Content checks: no "9 days" claim; FAHR + MoHRE + WAM source distinction confirmed live. Calendar items: exactly 4 (A–D). DGHR/KHDA (E/F) not imported, held. All 17 existing guides intact. Report: `docs/content-drafts/PHASE_6C34_EID_PRODUCTION_LAUNCH_REPORT.md`.

---

## 2026-05-20 — Phase 6C-33 News/Events/Calendar indexing policy fix complete

P0 technical blocker resolved. All 6 public detail route files (`[slug]/page.tsx`) had hardcoded `robots: { index: false, follow: true }` in `generateMetadata`. Created `lib/db/indexing.ts` with three helper functions: `newsRobots(post)` (respects DB `noindex` flag on `news_posts`), `eventRobots(event)` (always index — no noindex field in `events` table, reader gates on published), `calendarRobots(page)` (always index — no noindex field in `calendar_pages` table, reader gates on published). Updated all 6 routes to import and call appropriate helper. Verified: draft slugs → reader returns null → `generateMetadata` returns `{}` → `notFound()` → 404 (safe without additional noindex tag). RU safety: RU readers gate on `ru_published=1` AND non-empty `ru_title`/`ru_body` — null → 404, no EN fallback. DB QA: Eid news `noindex=0`, all 3 records `status=published`, `ru_published=1`. TypeScript check: 0 errors. Build: clean (86 pages, 2.6s). Grep check: no hardcoded noindex in any `[slug]` route. Summary doc: `docs/content-drafts/PHASE_6C33_INDEXING_POLICY_FIX_SUMMARY.md`. Listing pages (`/news`, `/events`, `/calendar`) retain noindex — not in scope. No DB writes, no content, no deploy, no push, no commit.

---

## 2026-05-20 — Phase 6C-32 Full calendar, news radar and opportunity matrix complete

Five planning documents created in `docs/content-drafts/`: (1) `FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` — 85 items across 15 categories (UAE holidays, Dubai events, Abu Dhabi/Yas, business/tax, property/DLD, DET/holiday homes, Dubai Life Setup, schools/KHDA, pets, transport, attractions, viral news, offers, social-first, service/monetization); each item has all required fields including type_candidate, source_status, source_urls, CTA behavior, SEO/RAG/viral/monetization value, risk, blocked claims, priority, review frequency, expiry/archive logic; P0 noindex blocker prominently documented; opportunity clusters A–D mapped. (2) `CALENDAR_SEED_ITEM_POLICY.md` — 12-part policy for when calendar items go public, CTA rules, offer controls, expired item handling, tentative events, official vs media signals, EN/RU parity, decision tree; P0 noindex blocker section at top. (3) `HOMEPAGE_AND_CAROUSEL_CONTENT_MODEL.md` — carousel priority order (5 tiers), image rules (no stock photos of people, no AI-generated people, fallback image rules), CTA logic by item type, EN/RU parity rules, no-show hard rules, current state with eligible items, future design hints. (4) `DUBAI_LIFE_SETUP_LAUNCH_MATRIX.md` — 12 modules (M01 Before Arrival through M12 Existing Resident Renewal); each module: first screen answer, checklist with official sources, calendar reminders, source needs, related guides, service path, SEO/RAG angle, EN/RU route notes, what can launch now, what must wait; launch readiness table showing partial readiness for 5 of 12 modules. (5) `PHASE_6C32_SUMMARY.md` — opportunity clusters, public/internal/news/social/offer/life-setup candidates, source gaps, SEO/RAG implications, monetization paths, recommended next phases (6C-33 noindex fix, 6C-34 emiratisation+tax sprint, 6C-35 long weekend guide, 6C-36 life setup hub, 6C-37 events import, 6C-38 property guides). P0 identified: Emiratisation June 30 quota in 10 days. No DB writes, no code, no push, no commit.

---

## 2026-05-20 — Phase 6C-31 Eid Al Adha 2026 local QA and production readiness complete

All three Phase 6C-30 records fully QA'd and validated locally. Issues found and fixed: (1) All 6 summary fields (EN + RU × news/event/calendar) were 3 sentences — compressed to 2 sentences each, DB updated via updateNewsDraft/updateEventDraft/updateCalendarDraft + re-publish, draft files synced; (2) Calendar en_meta_description was 178 chars (over 160 limit) — compressed to 139 chars; (3) Calendar ru_meta_description was 165 chars — compressed to 138 chars. Additional QA findings: em dash scan of all string fields in all 3 DB records — CLEAN; nine-days claim scan — CLEAN; all en_seo_title under 80 chars; all en_meta_description under 160 chars (after fix); all en_title under 80 chars; federal vs private sector distinction clearly preserved; DGHR/KHDA held items confirmed not in DB (0 records); calendar dates_json confirmed exactly 4 items (A–D only). Route QA: EN/RU parity confirmed (ru_published=1, all required RU fields populated); event confidence=confirmed → no amber banner; calendar has_islamic_dates=1 → amber notice always shown (fixed code behavior); noindex hardcoded in route files (content not indexed regardless of DB field). Scripts created: scripts/eid-summary-fix.ts. Readiness report: docs/content-drafts/PHASE_6C31_EID_LOCAL_QA_AND_PRODUCTION_READINESS.md. No code changes, no push, no deploy, no commit.

---

## 2026-05-20 — Phase 6C-30 Eid Al Adha 2026 import and publish complete

All three Eid Al Adha 2026 content records created and published to local DB via `scripts/eid-import.ts`. Calendar items A–D only; items E (DGHR) and F (KHDA) not imported. Records published: (1) News post — slug `uae-eid-al-adha-2026-federal-holiday-long-break`, id `5b1eecec-e64a-4cc9-9f67-c6cb2b55e1e4`, category=government, ru_published=1, source=FAHR (official); (2) Event page — slug `uae-eid-al-adha-2026`, id `8532feee-1d6f-4ed3-b716-61712b473ca3`, category=holiday, color_type=public-holiday, date_confidence=confirmed, event_date_start=2026-05-25, event_date_end=2026-05-29, ru_published=1; (3) Calendar — slug `may-2026-uae-calendar`, id `6ce82fda-d696-4040-b6c3-3d74c17347ea`, calendar_type=monthly, year=2026, month=5, has_islamic_dates=1, image_path=/images/hubs/dubai-skyline-downtown.webp, ru_published=1. Em dash validation: 37 string fields pre-validated, all clean. Six em dash locations caught and fixed during authoring: 4 section headings in body text, 2 source-note lines with em dash separators. Warnings (non-blocking, 3x): en_summary should be 1–2 sentences (all three files have 2–3 sentence summaries). dates_json items: A=Federal Eid Al Adha Holiday (25–29 May, confirmed, FAHR), B=Eid Al Adha Begins (27 May, confirmed, WAM), C=Federal Break Planning Window (23–31 May, expected, derived), D=Private Sector Eid Holiday (26–29 May, confirmed, MoHRE). No push, no deploy, no git commit.

---

## 2026-05-20 — Phase 6C-29 Eid Al Adha 2026 emergency launch decision package complete

Owner launch decision package created for all three Eid Al Adha 2026 files. No new content, no import, no publish. Key outputs: (1) `docs/content-drafts/reviews/eid-al-adha-2026-launch-checklist.md` — per-file import readiness tables (news, event, calendar), per-calendar-item tables (items A–F), DGHR/KHDA exact hold conditions and release criteria, publish window deadlines (22 May for calendar, 25 May for news/event), expiry/archive behavior after 1 June, homepage/This Month visibility recommendations, WhatsApp/service CTA tone guidance, owner approval boxes for all three files and both hold items; (2) `docs/content-drafts/reviews/eid-al-adha-2026-owner-review.md` — Launch decision section added (Safe now / Hold / Owner decision / Recommended action by 22 May / by 25 May / expiry table). Micro-polish: news draft meta descriptions were still over 160 chars despite Phase 6C-27 pass — EN trimmed 179 → 125 chars, RU trimmed 173 → 128 chars. Em dash scan confirmed clean across all three Eid files. Calendar items A–D confirmed safe to import; items E (DGHR) and F (KHDA) remain on hold until official permalink captured. Surgical updates: CONTENT_AUDIT_MATRIX.md (version line, Phase 6C-29 notes for files 1/2/5), CONTENT_PRODUCTION_PRIORITY_QUEUE.md (last updated, P0-02 entry updated). No admin, no DB, no code, no push, no commit.

---

## 2026-05-20 — Phase 6C-28 VAT registration threshold guide polish gate complete

Full editorial audit and polish of `docs/content-drafts/guides/uae-vat-registration-threshold.md`. Status: draft_file_only → owner_review_ready. Key fixes: (1) Both meta descriptions were over 160 chars — EN rewritten from 225→140 chars, RU from 179→150 chars; (2) 13 prose em dashes removed — 11 from EN body (summary, quick answer, threshold section, checklist x3, calendar reminder, "What not to assume" x4, RAG summary) and 2 from RU body (body paragraph, checklist); (3) RU checklist parity: item 9 was missing from RU (EN had 9 items) — added "Ведите бухгалтерские записи полными и актуальными..."; (4) RU target_keywords item 5 was English ("VAT free zone UAE") — corrected to Russian ("VAT для компаний в свободных зонах ОАЭ"); (5) Calendar item completed with all missing fields: detail_url_en/ru, lifecycle (relative_reminder), noindex_after (not_applicable), archive_action (keep_public), external_cta_status, location_display, emirate; (6) Metadata: lifecycle (compliance_evergreen), recheck_annually (true), recheck_trigger added; last_reviewed updated; (7) Editor-only phrasing ("in this draft — do not add") replaced with reader-facing text in EN and RU "What not to assume" sections; (8) Admin import notes section added with Path A service/CTA guidance. Factual safety confirmed: all 9 allowed claims present; all 10 blocked claims absent; penalty amounts correctly excluded; VAT vs Corporate Tax kept distinct; no tax/legal advice. New files: `docs/content-drafts/reviews/uae-vat-registration-threshold-owner-review.md`, `docs/content-drafts/PHASE_6C28_SUMMARY.md`. Surgical updates: CONTENT_AUDIT_MATRIX.md (row 6 updated; Phase 6C-28 note added), CONTENT_PRODUCTION_PRIORITY_QUEUE.md (P0-03 partially resolved). No new content, no admin, no DB, no code, no push, no commit.

---

## 2026-05-20 — Phase 6C-27 Eid Al Adha 2026 emergency polish gate complete

All three Eid Al Adha 2026 draft files polished and promoted to owner_review_ready. Editorial-only phase — no new content, no admin, no DB, no code. Files polished: `news/uae-eid-al-adha-2026-federal-holiday-long-break.md`, `events/uae-eid-al-adha-2026.md`, `calendar/may-2026-uae-calendar.md`. Key changes across all three: (1) lifecycle, noindex_after, archive_action added to top-level metadata and all calendar items; (2) DGHR/KHDA source status upgraded from `[ ]` (blocked) to `[~]` (media_confirmed with "recheck official permalink before publish" condition) — consistent with Phase 6C-22/23 source ledger findings; (3) body copy updated throughout to reflect media_confirmed DGHR/KHDA status without overclaiming; (4) full em dash scan — all publishable prose em dashes removed from EN and RU body, RAG summaries, key dates tables; (5) all meta descriptions brought under 160 chars; (6) calendar item type fixed to public_holiday (underscore); (7) all calendar items completed with full required fields (detail_url_en/ru, lifecycle, noindex_after, archive_action, external_cta_status, location_display, emirate). Additional per-file: news draft got target_keywords_en/ru, search_intent_en/ru, rebuilt 10-column calendar items table with DGHR/KHDA rows, updated key dates tables. Event draft got search_intent_ru (was missing), updated "What not to claim" and "What is still being verified" sections. Calendar draft got 2 new calendar items (E: DGHR, F: KHDA — both media_confirmed, hold for permalink). Lifecycle decisions: news = time_sensitive_news / noindex_after 2026-06-01 / noindex_keep; event = major_annual_event / noindex_after 2026-12-31 / keep_public; calendar = time_sensitive_news / noindex_after 2026-06-01 / archive. New files created: `docs/content-drafts/reviews/eid-al-adha-2026-owner-review.md` (full factual safety audit, per-file publish readiness, owner decisions required), `docs/content-drafts/PHASE_6C27_SUMMARY.md`. Surgical updates: CONTENT_AUDIT_MATRIX.md (rows 1/2/5 updated, Phase 6C-27 notes added to detailed audit for all three files), CONTENT_PRODUCTION_PRIORITY_QUEUE.md (P0-02 and P0-04 marked resolved), SOURCE_RESEARCH_QUEUE.md (Phase 6C-27 section added). Owner must decide on Eid content publish by 25 May 2026 (May calendar: by 22 May for meaningful pre-break traffic).

---

## 2026-05-20 — Phase 6C-26 Unified readiness re-audit and next cluster selection complete

Audited all 10 draft files across 4 content types. Updated CONTENT_AUDIT_MATRIX.md to v1.1 (added 3 e-invoicing files, rows 8–10; expanded publication gate table to 10 columns; added 12-item priority action list with Eid emergency flagged as Priority 0). Created `docs/content-drafts/reviews/unified-draft-bank-readiness-review.md` (all 10 drafts: readiness scores 3–4/5, per-file blockers, cross-cutting gap table, recommended action sequence). Created `docs/content-drafts/NEXT_CLUSTER_DECISION_MATRIX.md` (8 candidate clusters A–H evaluated; Cluster A = EMERGENCY, Cluster B = best next, Cluster C = second next, Clusters D–H on hold). Key findings: (1) Eid Al Adha 2026 package (files 1, 2, 5) — EMERGENCY — owner must decide by 25 May 2026, window closes 1 June; (2) cross-cutting gaps across 7 non-e-invoicing files: lifecycle, noindex_after, archive_action all unset; em dash scan (RU) pending; (3) GITEX file has stale `venue_recheck_required: true` flag — must be corrected; (4) CT guide natural persons section uses stale 2025 date anchor — fix with advisory caveat; (5) VAT guide is best next evergreen cluster (4/5, small fixes, strong source backing). No new content drafted. No admin, no DB, no code, no push, no commit.

---

## 2026-05-20 — Phase 6C-25 E-invoicing owner review quality gate complete

Editorial audit of all 3 e-invoicing draft files (news, guide, calendar) against CONTENT_QUALITY_STANDARD.md, RU_EDITORIAL_STANDARD.md, CALENDAR_CONNECTION_MODEL.md, CONTENT_AUDIT_MATRIX.md, source ledger, and verification file. Factual safety confirmed: all deadline dates, penalty amounts, scope boundaries, and source attributions verified correct against official source ledger. Eight categories of corrections applied directly to the three files: (1) em dashes in EN body — 4 instances fixed across news and guide; (2) em dashes in RU body — 12 instances fixed across all three files using commas, colons, parentheses, sentence restructuring; (3) meta descriptions too long — all 4 violations fixed (EN/RU in news and guide, each now under 160 chars); (4) missing SEO fields — target_keywords_en/ru + search_intent_en/ru added to news draft, search_intent_ru added to guide draft; (5) missing calendar item metadata — detail_url_en/ru, lifecycle, noindex_after, archive_action, external_cta_status added to all 5 calendar items (A–E) in calendar post; (6) stale "to be created" references fixed in news draft and guide draft; (7) imprecise phrasing "final accreditation stages" → "undergoing accreditation"; (8) last_updated dates set to 2026-05-20 in all three files. New files created: `docs/content-drafts/reviews/e-invoicing-2026-owner-review.md` (full review: issue log, factual safety audit, SEO title audit, RU naturalness audit, calendar connection audit, pre-publish checklist), `docs/content-drafts/PHASE_6C25_SUMMARY.md`. No admin, no DB, no code, no push, no commit.

---

## 2026-05-19 — Phase 6C-24 UAE e-invoicing 2026 content package created

Three files created (all `draft_file_only`, no admin, no DB): `docs/content-drafts/news/uae-e-invoicing-2026-asp-deadline-update.md` (news draft — EN+RU, 5 body sections, 4 official sources, RAG summary, blocked claims, admin import notes), `docs/content-drafts/guides/uae-e-invoicing-2026-business-readiness.md` (guide draft — EN+RU, 8 body sections, ASP explained, deadline table, penalty table, checklist), `docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md` (calendar visual post — 5 calendar items with full EN+RU metadata). Source basis: official MoF amendment permalink captured Phase 6C-23 (https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/, 10 May 2026). Key confirmed facts: ASP deadline 30 October 2026 (extended from 31 July) for large businesses (>= AED 50M revenue); implementation 1 January 2027 unchanged; SMEs ASP 31 March 2027, implementation 1 July 2027; fines AED 5,000/month (Cabinet Resolution 106 of 2025). Also created `PHASE_6C24_SUMMARY.md`. Surgically updated SOURCE_RESEARCH_QUEUE.md (T1-05 Phase 6C-24 status added) and CONTENT_PRODUCTION_PRIORITY_QUEUE.md (P1-06 rewritten, Phase 6C-24 summary section added). Owner review required before any publish action.

---

## 2026-05-18 — Phase 6C File-based content draft bank (committed 9b7f850)

`docs/content-drafts/` workspace created: no admin, no AI Inbox, no DB writes. Files created: `README.md` (workspace rules — EN/RU parity, allowed EN proper nouns, two-step publish path), 4 templates (`news-draft-template.md`, `event-draft-template.md`, `calendar-item-template.md`, `guide-update-template.md`), plus first live drafts for Eid Al Adha 2026 content. Eid source ledger (`source-ledgers/eid-al-adha-2026-sources.md`) captures 3 confirmed official URLs — WAM (Eid begins 27 May), FAHR (federal holiday 25–29 May), UAE Legislation (statutory framework) — with claim boundary table (5 allowed, 10 blocked until MoHRE/DGHR/KHDA confirmed). News draft (`news/uae-eid-al-adha-2026-federal-holiday-long-break.md`): full EN+RU body, SEO fields, 7 calendar items, verification checklist. May 2026 calendar draft (`calendar/may-2026-uae-calendar.md`): monthly planning view, key dates table in EN+RU, 4 calendar items (3 confirmed, 1 watchlist). Events/detail draft (`events/uae-eid-al-adha-2026.md`): deeper audience-specific page with resident, family, and business planning sections, RAG summaries in EN+RU, full DB field model for future admin import. 9 files, 1932 insertions. Commit: `9b7f850`. Branch is 6 commits ahead of origin/main.

---

## 2026-05-18 — Phase 6A 2026 Calendar Content Research Matrix (committed cdc6ca7)

`docs/phase-6a-2026-calendar-content-research-matrix.md` created (798 lines, 17 sections). 46 research matrix rows with IDs: H01–H09 holidays, E01–E08 events, B01–B11 business/compliance, V01–V04 visa, C01–C04 company ops, F01–F03 family/school, P01–P03 property, T01–T02 tourism, G01–G02 guide updates. UAE Business Compliance Calendar PDF breakdown into 8 cluster groups (35 content opportunities). Source reliability model: WAM = confirmed religious dates, FAHR = federal sector, MoHRE = private sector, DGHR = Dubai government, KHDA = education — each requires separate announcement. Verification rules, EN/RU draft requirements per content type, claim boundary enforcement. 5-batch production plan, 25-item no-publish launch gate, phases 6B through 7D outlined. Commit: `cdc6ca7`.

---

## 2026-05-18 — Phase 5F Connect calendar to detail pages (committed bb0ba0a)

`CalendarContextCta` component (`components/calendar/CalendarContextCta.tsx`): server-compatible (no "use client"), locale-aware EN/RU copy, brass dot label, navy primary CTA with month-aware deep-link (`?month=YYYY-MM`), secondary brass link when `calendarMonth` present. `SaveCalendarCta` component (`components/calendar/SaveCalendarCta.tsx`): "use client", compact strip + fixed modal overlay with iOS/Android tabs, numbered steps for each platform, backdrop close. `CalendarGrid` updated: accepts `initialYear?`, `initialMonth?`, `initialDate?` props initialized from searchParams. Calendar index pages (`/calendar`, `/ru/calendar`): read `?month=YYYY-MM` and `?date=YYYY-MM-DD` searchParams — `await searchParams`, parse with regex, pass to CalendarGrid; invalid params fall back to current month. `CalendarContextCta` added to 6 detail page routes: EN/RU news detail (`contentType="news"`, no calendarMonth), EN/RU event detail (`calendarMonth = event.eventDateStart.slice(0,7)`), EN/RU calendar detail (calendarMonth derived from page.year+page.month). Guide detail pages deferred — requires `calendar_relevant`/`calendar_month` schema fields first. Build: 86 pages, TypeScript clean. Commit: `bb0ba0a`.

---

## 2026-05-17 — Phase 5E Calendar prototype (committed e11c321)

Dubai Calendar pages (`/calendar`, `/ru/calendar`) rebuilt from static skeleton into functional interactive calendar. `components/calendar/CalendarGrid.tsx` (794 lines, "use client"): month grid with multi-item day behavior (P1 pill, P2/P3 dots), selected-day agenda, full month agenda list, 5-month nav strip (Mar Apr [May] Jun Jul), month/year picker (tap → 3×4 grid + year ±arrows + Today shortcut), 5 filter chips (All/Holidays/Events/Business/Property), adaptive legend by filter, 12 internal item category types with color/priority/badge/CTA system, date confidence badges (confirmed/expected/subject_to_official_confirmation), external link support. `lib/calendar-helpers.ts` (146 lines): helper functions for category system, color mapping, priority. `lib/calendar-mock-data.ts` (291 lines): static mock data — real data connection deferred to Phase 5E-b. `docs/phase-5e-calendar-ux-product-design.md` (1237 lines): full product design spec. `.no-scrollbar` utility added to `globals.css`. Build: 86 pages, 0 errors. Commit: `e11c321`.

---

## 2026-05-17 — Phase 5D RU homepage parity + connected calendar plan (committed 5ac6103)

`app/ru/page.tsx` rebuilt to match EN portal-style homepage structure: compact intro, dual photo cards (Календарь Дубая + Переезд и первые шаги), FeaturedSlider (uses `getRecentPublishedGuidesLocale` — RU titles only, no EN fallback), 6-tile service grid, This Month card, latest feed. `FeaturedSlider.tsx` updated: `localizeValue` on price/timeline. `RouteSnapshotBand.tsx` updated: RU category label map, `localizeValue` on price/timeline. `lib/db/reader.ts`: `getRecentPublishedGuidesLocale` added (locale-aware, no EN fallback for RU). `Header.tsx` RU nav fix: "Компания" not plural, `whitespace-nowrap` on desktop nav links. `docs/phase-5d-connected-calendar-content-bank-plan.md` (822 lines): planning doc for calendar auto-date linking, item type/color system, multi-item day behavior, 2026 research workflow, PDF source-signal handling, and launch gates. Build: 86 pages, TypeScript clean. QA: 691/691. Commit: `5ac6103`.

---

## 2026-05-17 — Phase 5B Mobile portal homepage (committed fdf5c59)

`app/(public)/page.tsx` fully rebuilt (475 lines): compact intro block, dual photo cards (Dubai Life Calendar + Dubai Life Setup at h-[162px]), `FeaturedSlider`, 6-tile service grid (2-col), This Month in Dubai dark gradient card (live calendar/events data with guide fallback), latest news/events feed with guide fallback. `components/FeaturedSlider.tsx` (206 lines, "use client"): auto-rotating 4.5s carousel with swipe support, prev/next arrows, progress dots; slide 0 = DIFC hero photo, slides 1+ = CSS gradients; long price text truncated. `components/Header.tsx`: WhatsApp pill always shows text on mobile; mobile nav 14px semibold. Polish: cards softer shadow (`rgba(0,0,0,0.4)`), chips removed, body breathing room, This Month font sizes raised, FeaturedSlider price truncation fixed. Build: 86 pages, TypeScript clean. DB unchanged: guides=17, steps=115, news=1, events=1, calendar=1. Commit: `fdf5c59`.

---

## 2026-05-16 — Phase 4B-2E Admin polish + dark theme (committed 19786e8)

`lib/ai/editor-types.ts`: `image_path` + `ru_image_alt` added to `GeneratedDraftBase`. `lib/ai/editor-schemas.ts`: `validateNewsBase()` now validates image_path/ru_image_alt; `has_islamic_dates` accepts boolean `true`; yearly calendar forces `month = null`. `lib/ai/import-parser.ts`: image aliases; `applySeoFallbacks()`; file:// path detection; Islamic keyword auto-detection; `importWarnings: string[]`; updated `buildImportPrompt()`. `app/admin/content/ai-inbox/actions.ts`: `sanitizeImagePath()`; newsInputFromDraft/calendarInputFromDraft use image_path/ru_image_alt. Admin dark theme applied to `app/admin/content/layout.tsx`, `ContentAdminNav.tsx`, news/events/calendar list pages, `AiInboxClient.tsx`. `lib/db/news-events-calendar-admin.ts`: fixed `month: null` stored as 0 in createCalendarDraft. DB: news=1, events=1, calendar=1 (3 real drafts created via admin). QA: 691/691. Build: 86 pages, TypeScript clean. Commit: `19786e8`.

---

## 2026-05-15 — Phase 4B-2D No-API AI-Assisted Draft Import Mode (not committed)

Primary UX of `/admin/content/ai-inbox` refactored to import-first, no-API-required mode. New `lib/ai/import-parser.ts`: `parseImportedDraft()` (client-safe parser — `extractJson` → `JSON.parse` → snake_case alias normalization → `validateGeneratedDraftJson` → `normalizeGeneratedDraftForSave`; returns `ImportParseResult` with helpful error messages) and `buildImportPrompt(contentType)` (copyable prompt for Claude/ChatGPT with full JSON schema template + content rules). AiInboxClient.tsx rewritten: local classifier removed; primary section = "Paste AI Draft Package" with collapsible prompt builder (type selector, monospace textarea, copy-to-clipboard), import textarea, inline error display; AI section shown only if `isConnected`; shared draft view with `draftSource: "import" | "ai"` label; refine grayed when not connected; runtime notice gray-neutral ("Import mode active. No API required.") instead of amber warning; both import and AI drafts save via same `_draft_json` + `useActionState` path. QA: `scripts/qa-phase-4b2d-no-api-import.ts` 79/79. All 7 scripts: 560 passing. Build: 86 pages, TypeScript clean. DB unchanged.

## 2026-05-15 — Phase 4B-2B Real AI Runtime MVP for AI Inbox (committed 2b83518)

Full AI runtime wired into `/admin/content/ai-inbox`. New `lib/ai/` module: `editor-types.ts` (all type definitions), `editor-prompts.ts` (system prompt + classification/generation/refinement prompt builders with type-specific JSON schemas), `editor-schemas.ts` (extractJson fence stripping, validateClassificationJson/validateGeneratedDraftJson/validateRefinementJson with coercion and sanitization, normalizeGeneratedDraftForSave forcing ru_published=0), `editor-runtime.ts` (getAiRuntimeStatus, in-memory daily rate limiter, native fetch to Anthropic API, classifyWithAi/generateDraftWithAi/refineDraftWithAi). Actions.ts rewritten: classifyInputAction/generateDraftAction/refineDraftAction (programmatic via startTransition), saveGeneratedNews/Event/CalendarDraftAction (useActionState + _draft_json hidden field → redirect), legacy actions kept. page.tsx updated: getAiRuntimeStatus() server-side → runtimeStatus prop. AiInboxClient.tsx rewritten: two-click flow (classify → generate → refine → save) in connected mode, local deterministic classifier fallback in disabled mode, phase state machine (input|classifying|classified|generating|draft|refining). QA: 82/82 (new script). All 5 scripts: 381/381. Build: 86 pages, TypeScript clean. DB unchanged: guides=17, steps=115, news_posts=1, events=1, calendar_pages=1. 3 drafts: all status=draft, ru_published=0.

## 2026-05-14 — Phase 4A-6 Calendar Visual Posts admin full workflow committed

Calendar admin complete inside the unified content shell. Writer changes: `calendarRowToInput` exported; `validateCalendarPublish` imported into writer; `publishCalendar(id)` (archived gate → `validateCalendarPublish` → sets status=published); `archiveCalendar(id)` (sets status=archived, permanent). New files: `actions/calendar.ts` (saveCalendarDraftAction/publishCalendarAction/archiveCalendarAction), `CalendarForm.tsx` (10 sections: core/verification-source/image/dates_json/EN content+SEO/RU content+SEO/flags), `CalendarStatusPanel.tsx` (status, dates count, last_verified_date indicator, image indicator, Islamic dates warning block, two `useActionState` hooks), `CalendarPreview.tsx` (server component — parsed dates list with red/orange/gray color dots, EN+RU preview with Islamic warning, datesParseError indicator). Calendar list page replaced: full table (status/RU/type/year/dates count/verified/updated). `/calendar/new` and `/calendar/[id]` pages created with `xl:grid-cols-[1fr_320px]` layout. `scripts/qa-phase-4a6-calendar.ts`: 112/112 checks. All 5 QA+verify scripts pass (100+86+60+41+112 = 399 total). Build: 85 pages, 0 errors, TypeScript clean. Commit: `75f3e63`.

## 2026-05-14 — Phase 4A-5 Events admin full workflow committed

Events admin complete inside the unified content shell. Writer changes: `eventsRowToInput` exported; `related_guide_slug`/`related_news_slug` added to `EventInput`, `eventsRowToInput`, `eventInputToPatch`, and `createEventDraft`; `publishEvent(id)` (archived gate → `validateEventPublish` → sets status=published); `archiveEvent(id)` (sets status=archived, permanent). Validation changes in `validateEventPublish`: `event_date_end` made optional (single-day events pass), date comparison added (end ≥ start when provided), `en_body`/`en_seo_title`/`en_meta_description` now required for publish. New files: `actions/events.ts` (saveEventDraftAction/publishEventAction/archiveEventAction), `EventForm.tsx` (11 sections including related content + date confidence), `EventStatusPanel.tsx` (date confidence badge + non-confirmed amber warning + two `useActionState` hooks), `EventPreview.tsx` (EN preview with date confidence warning + RU "saved, not published" badge). Events list page replaced: full table with status/RU/category/color/confidence/dates/calendar columns. `/events/new` and `/events/[id]` pages created. `scripts/qa-phase-4a5-events.ts`: 41/41 checks. All 4 QA+verify scripts pass (100+86+60+41 = 287 total). `verify-news-events-calendar-admin.ts` updated: stale event publish PASS test data extended with now-required en_body/seo/meta fields. Build: 84 pages, 0 errors, TypeScript clean.

## 2026-05-12 — Phase 4A-4b News publish/archive gates (not committed)

Full publish/archive gate layer on top of Phase 4A-4a draft workflow. Writer additions: `newsRowToInput` exported, `publishNews(id)` (RU gate → date auto-fill → `validateNewsPublish` → sets status=published), `archiveNews(id)` (sets status=archived, permanent). `validateNewsPublish` import added to writer. Server action additions: `publishNewsAction`, `archiveNewsAction` in `app/admin/content/actions/news.ts`. New components: `NewsStatusPanel.tsx` ("use client" — two `useActionState` hooks for publish+archive, status badge, pre-computed blocking errors list, conditional publish button disabled if errors, archive button hidden for archived posts), `NewsPreview.tsx` (server component — EN preview card + RU preview card with live/not-published badge). Edit page `[id]/page.tsx` updated: grid layout (`xl:grid-cols-[1fr_320px]`), pre-computes `validateNewsPublish` with auto-filled dates for panel props. List page: `bg-emerald-50/30` tint for published rows, `opacity-55` for archived. QA: 60/60 (`scripts/qa-phase-4a4b-news-publish.ts`). All 4 scripts pass. Build: 83 pages, 0 errors, TypeScript clean.

## 2026-05-12 — Phase 4A-4a News admin draft workflow (not committed)

News draft CRUD workflow at `/admin/content/news`. Files created: `app/admin/content/actions/news.ts` ("use server" — `saveNewsDraftAction` handles both create and update via `_id` hidden field, calls `createNewsDraft`/`updateNewsDraft`, redirects to edit page on success with `?saved=<ts>`), `app/admin/content/_components/NewsForm.tsx` ("use client" — `useActionState`, 9 form sections: core/EN content/EN SEO/source/dates/RU content/RU SEO/flags/tags, saved banner with 3s auto-hide, red error box, amber warning box), `app/admin/content/news/page.tsx` (list with status badges + RU live indicator + Edit links + empty state), `app/admin/content/news/new/page.tsx` (create shell), `app/admin/content/news/[id]/page.tsx` (edit shell — loads by id, passes `key={saved}` for remount after save). No publish/archive/AI/image. `related_*` fields excluded from form (not in current `NewsInput` writer API). Build: 83 pages (+1), 0 errors. Verify script: 100/100. DB: news=0, events=0, calendar=0.

---

## 2026-05-12 — Phase 4A-3 Unified Admin Shell committed

`app/admin/content/` shell created and protected. Files: `_components/ContentAdminNav.tsx` ("use client", `usePathname` active state, 4 active sections + 7 planned-badge items), `layout.tsx` (server component, sidebar flex layout, "Guidex Content Admin" label, nests inside existing admin `<main>`), `page.tsx` (dashboard: 6 status cards — 3 active with "Open" links, 3 planned with phase badge), `news/page.tsx`, `events/page.tsx`, `calendar/page.tsx` (placeholder pages describing future workflow, no forms/DB). `proxy.ts` extended with exactly 2 lines: `"/admin/content"` and `"/admin/content/:path*"`. Build: 82 pages, 0 errors. All 4 new admin routes render as dynamic (ƒ) server routes. Old guide admin unaffected. No DB reads from new pages. No public page changes.

---

## 2026-05-12 — Phase 3E reader wiring committed to 6 list pages (5a2a49d)

6 existing list skeleton pages converted from static to `async` server components and wired to readers. EN pages call `getPublishedNewsPosts("en")`, `getPublishedEvents("en")`, `getPublishedCalendarPages("en")`. RU pages call the same with `"ru"` — RU gate (`ru_published=1`) enforced inside the reader, no EN fallback possible. When DB has 0 rows (current state), reader returns `[]` → existing dashed empty-state block renders unchanged. When rows exist, compact portal-style card list renders instead: news cards (category chip + date + title + summary), event cards (date column + title + confidence badge + category), calendar cards (type + period + Islamic flag + title + summary + date count). Static placeholder/preview card arrays removed from calendar pages (were illustrative only). `robots: { index: false, follow: true }` preserved on all 6. No structured data. No sitemap changes. No homepage changes. No old admin changes. No DB writes. Build: 78 pages, 0 errors, TypeScript clean. Smoke: 6/6 list routes 200.

---

## 2026-05-11 — Phase 3D dynamic detail route skeletons committed (80d7cec)

6 dynamic detail pages created for news, events, and calendar (EN + RU). `generateStaticParams` returns `[]` on all 6 — zero static pre-renders, SSR on demand. Unknown slugs hit `notFound()` → 404. `robots: { index: false, follow: true }` on all 6 — noindex guard until content launch approved. No structured data added. RU pages call reader with `"ru"` locale and call `notFound()` if reader returns null (enforces no EN fallback). EN news: source attribution pill, body, related guide box, WA CTA. EN events: amber confidence notice for `expected` and `subject_to_official_confirmation` dates. EN calendar: Islamic disclaimer if `has_islamic_dates === 1`, HTML dates list with color-coded type pills and confidence badges. RU equivalents: all UI text in Russian, source labels in Russian, Islamic disclaimer in Russian. Build: 78 pages, 0 errors (6 new `●` SSG routes with 0 pre-rendered paths). 404 smoke: 6/6 unknown slugs returned 404. No sitemap changes. No homepage changes. No DB writes. No admin changes.

---

## 2026-05-11 — Phase 3C reader layer corrected and committed (e0ecd26)

`lib/db/news-events-calendar.ts` rewritten: replaced `pick()` (had EN fallback when RU field empty) with `field()` (no fallback — `locale === "ru" ? ru : en` always). All 6 list/featured functions add `.filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)` after `.all()` — RU rows with empty `ru_title` are excluded at application layer, not shown with EN title. All 3 detail functions now check BOTH `ru_title.trim() !== ""` AND `ru_body.trim() !== ""` before returning data — previously only checked `ru_title`. Calendar `ru_notes` and `ru_image_alt` returned via `field()` — empty string is valid on RU, no EN fallback. `scripts/verify-news-events-calendar-readers.ts` rewritten: removed `{ readonly: true }`, added 3 SAVEPOINT-based test blocks that insert test rows, verify no-fallback behavior, then ROLLBACK — no data persists. Tests cover: RU list filter (empty `ru_title` excluded), RU detail null when `ru_body` empty, calendar `ru_notes` returns empty string not `en_notes`. Final DB counts confirmed unchanged (0/0/0 new tables, 17 guides, 115 steps). 138/138 checks passed. Build: 78 pages, 0 errors. Committed: `lib/db/news-events-calendar.ts` + `scripts/verify-news-events-calendar-readers.ts` only. No routes wired. No sitemap changes. No homepage changes. No DB writes.

---

## 2026-05-11 — Phase 3C reader layer created (not committed)

`lib/db/news-events-calendar.ts` created following the exact existing reader.ts pattern (Drizzle ORM, `pick()` locale helper, plain TS interfaces). 9 exported reader functions: `getPublishedNewsPosts`, `getFeaturedNewsPosts`, `getNewsPostBySlug`, `getPublishedEvents`, `getFeaturedEvents`, `getEventBySlug`, `getPublishedCalendarPages`, `getFeaturedCalendarPages`, `getCalendarPageBySlug`. EN gate: `status='published'`. RU gate: `status='published' AND ru_published=1`. Strict RU detail gate: returns null if `ru_title.trim()===''` (no EN fallback on RU detail pages). `parseDatesJson()` safe parser: returns [] on invalid JSON or non-array, logs warning. `dateConfidence` exposed as-is — never transformed. `CalendarDateItem` interface defined. 7 exported interfaces: `NewsPostSummary`, `NewsPostDetail`, `EventSummary`, `EventDetail`, `CalendarPageSummary`, `CalendarPageDetail` + `CalendarDateItem`. `scripts/verify-news-events-calendar-readers.ts` created: 117 checks (table existence, row counts, all 31 news_posts columns, all 29 events columns, all 29 calendar_pages columns, EN/RU/featured query simulation, dates_json parse safety x4, CHECK constraint enforcement x3, PRAGMA integrity_check). Result: 117/117 passed. Build: 78 pages, 0 errors, TypeScript clean. Not committed. No routes wired. No sitemap changes. No homepage changes. No DB writes.

---

## 2026-05-11 — Phase 3B skeleton pages created (6 routes, not committed)

`app/(public)/news/page.tsx`, `app/(public)/events/page.tsx`, `app/(public)/calendar/page.tsx`, `app/ru/news/page.tsx`, `app/ru/events/page.tsx`, `app/ru/calendar/page.tsx` created. All 6 are static, zero DB reads, zero sitemap entries, zero homepage changes. Compact inline header pattern (overline + h1 + subtext), category chip pills, dashed empty-state block, WhatsApp navy CTA. Calendar pages include Islamic holiday disclaimer (amber block). News pages include hub links section + Find My Route CTA. Events pages cross-link to /calendar. RU pages fully translated — no English fallback. `robots: { index: false, follow: true }` on all 6 (skeleton guard). Build: 78 pages, 0 errors (+6 from 72). TypeScript clean. Smoke test: 6/6 routes 200. No production changes. Not committed.

---

## 2026-05-11 — Phase 3A local schema migration complete (local only, not committed)

`scripts/migrate-add-news-events-calendar.sql` created — full SQL with `CREATE TABLE IF NOT EXISTS` for `news_posts`, `events`, `calendar_pages` + 13 `CREATE INDEX IF NOT EXISTS` statements. All 3 tables have `status` CHECK constraint (draft/published/archived). `events.date_confidence` has CHECK (confirmed/expected/subject_to_official_confirmation). Zero INSERT statements. Zero ALTER to existing tables. `lib/db/schema.ts` appended with Drizzle table definitions for all 3 new tables (`newsPosts`, `eventsTable`, `calendarPages`) + type exports (`NewsPost`, `HubEvent`, `CalendarPage`). `eventsTable` export name chosen to avoid collision with Node.js `events` module. `ru_published` and flag fields kept as `integer` 0/1, not boolean mode (two-gate model explicit). `calendar_pages.month` intentionally nullable (no `.notNull()`). Local DB backup created: `data/guides.db.backup-before-news-events-calendar-schema-20260511-113849`. Migration run against local `data/guides.db`. Verification: `PRAGMA integrity_check` = ok; guides = 17; steps = 115 (both unchanged); all 3 new tables = 0 rows; all 13 indexes present. Build: 72 pages, 0 errors. No routes added. No sitemap changes. Not committed. Production DB untouched.

---

## 2026-05-10 — Analytics hooks for service cards and guide CTAs deployed (commit 85f5519)

`components/ServiceCardLink.tsx` created — "use client" wrapper for homepage service card `<Link>`; fires `homepage_service_card_click` with `{service, destination, locale, source:"homepage"}`. Service key derived from last href segment. `components/GuideCta.tsx` created — "use client" wrapper for guide CTAs; fires `guide_cta_click` always + `whatsapp_click` (source: guide) for WhatsApp; renders `<a target="_blank">` when `isExternal`, otherwise `<Link>`. Wired in 6 server-component pages: EN + RU homepages (5 active service cards each → ServiceCardLink), EN + RU guide `[slug]/page.tsx` (3 CTAs each: route_finder, whatsapp×2 → GuideCta), EN + RU `tax-residency-certificate-uae/page.tsx` (3 WA CTAs each → GuideCta). No DB changes. No content scripts. Build: 72 pages, 0 errors. DB: 17 guides / 115 steps (unchanged before and after). Smoke tests: 6/6 routes 200. PM2 online.

---

## 2026-05-07 — SEO/analytics foundation deployed to production

GTM support: `components/GoogleTagManager.tsx` (GTMScript + GTMNoScript, reads `NEXT_PUBLIC_GTM_ID`, renders nothing if unset) + `app/layout.tsx` wired. `lib/gtm.ts`: `pushEvent` dataLayer helper. Organization JSON-LD: `components/OrgSchema.tsx` injected via both `app/(public)/layout.tsx` and `app/ru/layout.tsx`. BreadcrumbList JSON-LD: added to EN and RU guide `[slug]/page.tsx` — 3-level (Home → All Guides → Guide Title), RU uses Russian labels. OG/Twitter metadata: added to root layout (site-level defaults) + EN/RU guide `generateMetadata` (og:type article, og:locale en_AE/ru_RU, twitter:card summary). Event tracking: `Header.tsx` → `language_switch_click` + `whatsapp_click`; `RouteFinderFlow.tsx` → `route_finder_start` (first answer), `route_finder_result_view` (useEffect on result phase), `route_finder_whatsapp_click` (3 WA links in results); `StickyRouteCta.tsx` → `route_finder_start` (source: sticky_cta). GTM inactive on production until `NEXT_PUBLIC_GTM_ID` added to `.env.local` + clean rebuild. Build: 72 pages, 0 errors. DB: unchanged (17 guides / 115 steps).

---

## 2026-05-07 — pre-GSC SEO cleanup deployed to production

`app/sitemap.ts`: `/ru/find-my-visa` added to `RU_STATIC` at priority 0.6 (was absent, asymmetric with `/find-my-visa` in EN). `app/(public)/guides/child-dependent-visa-dubai/page.tsx` + `spouse-dependent-visa-dubai/page.tsx`: `alternates` with `en`/`ru`/`x-default` hreflang added (both were missing — RU counterparts already had them). `lib/localize-value.ts`: 2 newborn guide-level mappings added — timeline `"4–10 weeks from birth (depends on consulate passport speed)"` → Russian; price `"AED 900–1,500 (UAE government fees...)"` → Russian. `components/RouteFinderFlow.tsx`: `localizeValue` imported; `guide.price` and `guide.timeline` in result card now wrapped with `localizeValue(_, locale)` (previously raw strings). No DB changes. No content scripts. Full clean build (cold cache): 72 pages, 0 errors. All 4 fixes verified pre-commit. Deployed to production. Smoke tests: 10/10 routes 200. DB: 17 guides / 115 steps (unchanged).

---

## 2026-05-07 — RU route finder deployed to production

`app/ru/find-my-visa/page.tsx` created (was 404). `lib/route-finder-config.ts`: `ROUTE_FINDER_CONFIG_RU` added — parallel RU config with 15 resolution paths (all flows traced and verified). `lib/guide-groups.ts`: `RU_GROUP_HREFS` added — spouse/child variant slugs map to `/ru/guides/[group]?route=...`. `components/RouteFinderFlow.tsx`: `locale` prop added; selects RU config + RU UI strings at runtime; guide/hub/supporting hrefs locale-aware. `components/Header.tsx`: "Найти маршрут" added to `RU_NAV`. `components/StickyRouteCta.tsx`: href locale-aware, `HIDDEN_ON` extended. `components/GuideTabs.tsx`: `findVisaHref` locale-aware. 5 RU hub pages updated (visas, visas/family, visas/golden, company-setup, guides/[slug]): all route finder CTAs now point to `/ru/find-my-visa` with correct `?flow=` params. Em-dash in `r-hub-golden` heading fixed (colon). No DB changes. Build: 72 pages, 0 errors (full clean build from cold cache). 15/15 RU flow paths verified via config tracing. EN regression clean. 0 banned EN strings in RU rendered page.

---

## 2026-05-07 — spouse dependent visa pair RU deployed to production (a231560)

`scripts/add-ru-spouse-dependent-visa-outside.ts` + `scripts/add-ru-spouse-dependent-visa-inside.ts` committed + run on production. Both guides: 7/7 RU steps + 4 guide fields written. Spouse group page at `/ru/guides/spouse-dependent-visa-dubai` renders Russian title, summary, tab labels ("Из-за пределов ОАЭ" / "Внутри ОАЭ"). `lib/guide-groups.ts`: spouse entry extended with `ruTitle`, `ruSummary`, `ruLabel` on both variants. `lib/localize-value.ts`: 4 new mappings (Depends on travel, AED 1,100/640/320 approx.). `app/ru/guides/spouse-dependent-visa-dubai/page.tsx`: metadata uses RU title/summary. Factual cleanup: inside medical fitness step uses "Approved Medical Fitness Center" (not Amer), correct ru_where/address/advice. No MOHRE clinic, no ICA, no physical stamp, no guarantee language, no em-dashes. Build: 71 pages, 0 errors (full clean build). Smoke tests: 9/9 routes 200. Cost/time: 0 English leakage on RU pages. Variant slugs excluded from sitemap. EN spouse group unchanged. Child group regression clean. DB: 17 guides / 115 steps (unchanged).

---

## 2026-05-07 — child dependent visa pair RU deployed to production (0b05cef)

Scripts run on production server: `add-ru-child-dependent-visa-outside.ts` + `add-ru-child-dependent-visa-inside.ts`. Both guides: 6/6 RU steps + 4 guide fields written. Production DB backup: `/var/backups/guidex/guides.db.pre-ru-child-dependent-20260507-131600`. Factual cleanup applied: biometrics conditional (15+, not mandatory for younger children), no physical stamp wording (residence status updates in system), RU CTA uses "сопровождение этапов" not "медосмотры". GuideTabs extended: locale-aware tab labels, localizeValue + locale wired into RouteSnapshot and StepCard. GuideGroupConfig/GuideVariant extended with optional RU fields. 7 new localize-value.ts mappings (3–6 weeks, Varies by country, AED 1,586/2,875 govt fees, Depends on travel arrangements, 1–4 weeks varies, 2–3 days card delivered). Build: 69 pages, 0 errors (full clean build). PM2 restarted, online. Smoke tests: 11/11 routes 200. RU child group: Russian h1 + tab labels ("Из-за пределов ОАЭ"/"Внутри ОАЭ") + all cost/time values Russian. EN child group unchanged. EN/RU spouse group unchanged. EN variant slugs 308 → group?route=outside/inside. Sitemap: /ru/guides/child-dependent-visa-dubai present, variant slugs absent. /ru/guides + /ru/visas/family: group card only. Risky phrases: 0. Em-dashes: 0. DB: 17 guides / 115 steps (unchanged).

---

## 2026-05-07 — child dependent visa pair RU complete locally (not yet deployed)

`components/GuideTabs.tsx`: added locale-aware tab labels (`v.ruLabel`), passed `locale` prop and `localizeValue`-wrapped values to both `RouteSnapshot` and `StepCard`. `lib/guide-groups.ts`: extended `GuideGroupConfig` with `ruTitle?`/`ruSummary?` and `GuideVariant` with `ruLabel?`; child group entry populated with full RU strings. `app/ru/guides/child-dependent-visa-dubai/page.tsx`: metadata updated to use `group.ruTitle`/`group.ruSummary`. `scripts/add-ru-child-dependent-visa-outside.ts` + `scripts/add-ru-child-dependent-visa-inside.ts` created and run: 6 steps + 4 guide `ru_*` fields each. All guards passed (0 em-dashes, 0 guarantee language). ICA replaced with ICP throughout RU content. No new `localize-value.ts` mappings needed (all step cost/time values already mapped). Build: 69 pages (+2 from child variant slugs now SSG'd), 0 errors (full clean build). Smoke tests: 8/8 routes correct (RU group page 200, EN group page 200, EN variant slugs 308, RU variant slugs 200). Tab labels: "Из-за пределов ОАЭ" / "Внутри ОАЭ" confirmed rendering. DB: 17 guides / 115 steps (unchanged). Local backup: `backups/local/guides.db.pre-ru-child-*`.

---

## 2026-05-07 — employment-visa-dubai-outside-uae RU deployed to production (6d76f66)

`scripts/add-ru-employment-visa-outside-uae.ts` committed + pushed. Production DB backup: `/var/backups/guidex/guides.db.pre-ru-employment-outside-20260507-115242`. Script run on server: 7 steps + 4 guide fields populated. Factual cleanup applied: no MOHRE-approved clinic wording (replaced with approved Medical Fitness Center), ICA replaced with ICP framing, WPS correctly described as salary payment channel not contract registry. `lib/localize-value.ts`: 8 new cost/time mappings (4–8 weeks, 1–2/2–4/3–5 working days, Travel day, Flight costs, 3–5 working days for card delivery, Included in MOHRE work permit). Build: 67 pages, 0 errors (full clean build). PM2 restarted. Smoke tests: 11/11 routes 200. Hreflang: en + ru + x-default correct. Sitemap: 2 entries for slug (EN + RU). RU page: 8/8 RU cost/time strings present, 0 EN leakage, 0 risky phrases. DB: 17 guides / 115 steps (unchanged). Em-dashes in guide content: 0 (2 in page title template — site-wide pattern, expected).

---

## 2026-05-07 — government RU batch deployed to production (6b510b8)

3 government guides translated: `document-attestation-dubai` (3 steps), `amer-center-dubai` (4 steps), `pro-services-dubai` (5 steps). 25 new exact-match mappings in `lib/localize-value.ts`. `app/ru/government/page.tsx` flipped all 3 cards from "Скоро" to live hrefs. Factual cleanup applied: no apostille-replaces claims, no unverified amer.ae URL. Full clean build required (node_modules/.cache must be cleared with localize-value.ts changes). Production DB backup created. All 3 scripts run on server. Build: 0 errors. PM2 restarted. Smoke tests: 13/13 routes 200. /ru/government: 3 live links, 0 "Скоро". Sitemap: all 6 RU/EN government guide URLs present. DB: 17 guides / 115 steps (unchanged).

---

## 2026-05-05 — renew-family-visa-dubai RU deployed to production (daa9cf3)

`scripts/add-ru-renew-family-visa.ts` committed + pushed. Production DB backup: `/var/backups/guidex/guides.db.pre-ru-renew-family-20260505-071227`. Script run on server: 4 steps + 4 guide fields populated. Factual cleanup applied: no "GDRFA медцентр", no "система ICA", no "ica.gov.ae". `lib/localize-value.ts` 9 renew-family cost/time mappings deployed. Build: 63 pages, 0 errors. PM2 restarted. Smoke tests: 9/9 routes 200. Hreflang: en + ru + x-default on EN page. Sitemap includes both `/guides/renew-family-visa-dubai` and `/ru/guides/renew-family-visa-dubai`. RU page: all 7 target RU strings present, 0 EN cost/time leakage, 0 risky medical/ICA phrases. DB: 17 guides / 115 steps (unchanged).

---

## 2026-05-05 — renew-family-visa-dubai RU complete locally — factual cleanup applied

`scripts/add-ru-renew-family-visa.ts` created and run: 4 steps + 4 guide fields written to local DB. All guards passed, 0 em-dashes, EN fields untouched. 9 new exact-match mappings added to `lib/localize-value.ts`. Clean build required (Turbopack module cache stale after localize-value.ts edit — `rm -rf .next` + rebuild resolved it). Built HTML verified: 10/10 RU cost/time strings present, 0 EN leakage. Build: 63 pages (+1 from 62), 0 errors. Sitemap built file: both `/guides/renew-family-visa-dubai` and `/ru/guides/renew-family-visa-dubai` present. Hreflang bidirectionally correct. DB: 17 guides / 115 steps (unchanged). Local backup: `backups/production-db/guides.db.pre-ru-renew-family-20260505-095803`. Note: `holiday-home-permit-dubai` also has RU content (pre-existing from earlier work).

---

## 2026-05-05 — newborn-visa-dubai RU cost/time localization complete

11 new exact-match mappings added to `lib/localize-value.ts` (newborn visa guide section). All 12 cost/time_est strings now display in Russian on /ru/guides/newborn-visa-dubai. "No additional fee" was already mapped. Built HTML verified clean: 0 EN cost/time leakage. Build: 62 pages, 0 errors. 5/5 smoke tests 200.

---

## 2026-05-05 — newborn-visa-dubai RU complete locally — pending owner approval for commit + deploy

`scripts/add-ru-newborn-visa.ts` created and run: all 6 steps + 4 guide fields written to local DB. All guards passed (0 em-dashes, 0 guarantee language). EN fields untouched. No custom page file needed — generic `app/ru/guides/[slug]/page.tsx` handles it. EN guide auto-adds RU hreflang via `guide.hasRuContent`. Build: 62 pages (+1 from last), 0 errors. `/ru/guides/newborn-visa-dubai` included in generic RU SSG `[+4 more paths]`. 8/8 local smoke tests 200. Sitemap includes both EN and RU newborn URLs. Hreflang correct on both pages. DB: 17 guides / 115 steps (unchanged). Local backup: `backups/production-db/guides.db.pre-ru-newborn-20260505-093223`.

---

## 2026-05-04 — RU TRC deployed to production — all smoke tests green (e811c6a)

`scripts/add-ru-trc.ts` run on production DB. All 8 RU step fields + 4 guide fields written. Production DB backup: `/var/backups/guidex/guides.db.pre-ru-trc-20260504-222454`. Build: 61 pages, 0 errors. 9/9 production smoke tests 200. RU TRC page live at guidex-consulting.ae/ru/guides/tax-residency-certificate-uae.

---

## 2026-05-04 — RU TRC guide complete locally — pending owner approval for deploy

`scripts/add-ru-trc.ts` run: all 8 ru_* step fields + 4 guide fields written to local DB. Em-dash guard caught 4 issues in script content — all fixed (colon, restructured sentence) before write. All guards passed, EN fields untouched. Custom RU premium page created at `app/ru/guides/tax-residency-certificate-uae/page.tsx` (navy hero, 3 WHY_CARDS in Russian, Russian CTAs). `CUSTOM_PAGE_SLUGS` filter added to RU `[slug]/page.tsx`. EN TRC hreflang updated with `"ru"` key. `/ru/banking-tax` TRC card updated to RU route, `· EN` label removed. Build: 61 pages (+1 from last), 0 errors. `/ru/guides/tax-residency-certificate-uae` = `○ (Static)`. 9/9 smoke tests 200.

---

## 2026-05-04 — Fix /ru/government 404 links — deployed b588201

`app/ru/government/page.tsx`: all 3 broken `/ru/guides/` link cards converted to `soon: true` non-link "Скоро" cards. WhatsApp CTA retained as conversion path. 8/8 production smoke tests 200. DB unchanged (17 guides, 115 steps). No broken `/ru/guides/` links remain on any RU hub page.

---

## 2026-05-04 — RU hub parity batch deployed (60deb84) — all smoke tests green

`/ru/banking-tax` and `/ru/tourism` live on production. Sitemap fixed (4 hub URLs added). Canonical + hreflang added to all 4 hub pages. RU homepage no longer has any `soon:true` cards. 9/9 smoke tests 200. DB unchanged (17 guides, 115 steps).

TRC card on `/ru/banking-tax` links to EN guide with `· EN` meta label — honest, no fake RU link.

Known issue carried forward: `/ru/government` links to 3 guides with no RU content (will 404 from that hub). Fix deferred to government guide RU translation batch.

---

## 2026-05-04 — CODE7: Deployed to production — all smoke tests green

CODE7 fully live on production at `guidex-consulting.ae`. 10/10 smoke tests 200. All content checks passed.

- TRC inserted to production DB via `npx tsx scripts/add-en-trc.ts` (17 guides, 115 steps)
- `npm run build` — 58 pages, 0 TypeScript errors
- PM2 restarted — `guidex-production` online
- Smoke tests: `/`, `/ru`, `/banking-tax`, `/tourism`, `/guides/tax-residency-certificate-uae`, bank-account, holiday-home, employment-visa, `/ru/guides`, `/sitemap.xml` — all 200
- Content checks: TRC renders, appears on `/guides` index and sitemap, absent from `/ru/guides`; homepage links to `/banking-tax` and `/tourism` confirmed
- Production DB backup: `/var/backups/guidex/guides.db.pre-code7-20260504-114324`

---

## 2026-05-04 — CODE7: Premium hubs, TRC page, visual system, homepage hero, RU parity — committed

Phase complete. All CODE7 local work committed as `d3faa8a feat: add premium hubs and TRC service page`. Not pushed, not deployed.

**What was built:**
- `/banking-tax` hub page — editorial gradient hero, service cards, who-it's-for, WhatsApp CTA
- `/tourism` hub page — same structure, warm-light gradient, JLT image
- `/guides/tax-residency-certificate-uae` — custom static route bypassing `[slug]`, navy premium header block, TRC-specific CTAs, no RouteSnapshot, steps from DB
- `components/PageHero.tsx` — reusable editorial gradient hero (image + gradient + text + children CTA slot)
- `lib/page-visuals.ts` — central gradient config (`light` / `medium` / `warm-light`)
- `components/Header.tsx` — mobile overflow fix: RU pill moved to top row, mobile nav uses flex-wrap
- `components/Hero.tsx` — updated to use PageHero with downtown skyline image
- `app/(public)/page.tsx` — Banking & Tax and Tourism cards activated (removed `soon:true`)
- `app/(public)/guides/[slug]/page.tsx` — `CUSTOM_PAGE_SLUGS` filter excludes TRC from `generateStaticParams`
- `app/ru/page.tsx` — RU hero refactored to PageHero for visual parity
- `scripts/add-en-trc.ts` — one-shot script that inserted TRC guide + 8 steps into local DB (not re-run)
- 3 hub images in `public/images/hubs/`: Business Bay (banking-tax), JLT sunset (tourism), Dubai dusk Burj (homepage/RU)
- `SESSION_LOG.md` updated

**Gradient values:**
- `light` (homepage + RU): `from-white via-white/75 to-white/25`
- `medium` (banking-tax): `from-white via-white/95 to-white/40`
- `warm-light` (tourism): `from-white via-white/90 to-white/50`

**Images:**
- `difc-business-bay-glass-towers.webp` — 131KB, Pexels 19689942
- `jlt-dubai-towers-sunset-reflection.webp` — 140KB, Pexels 29353238
- `dubai-skyline-downtown.webp` — 122KB, Pexels 5087047 (960×1200, dusk Burj+Downtown)

**Build:** 58 pages, 0 TS errors. All 7 routes 200.

**Not done yet:** push to GitHub, deploy to Cloudways, RU translations for TRC/banking-tax/tourism, business bank account guide, add `banking-tax` DB category.

---

## 2026-05-03 — CODE7-EN: TRC guide (EN) inserted locally, homepage Banking & Tax card activated

New guide `tax-residency-certificate-uae` inserted via `scripts/add-en-trc.ts`. Category: government. Published: true (local only). 8 steps. All ru_* fields empty. All guards passed (em-dash, guarantee, AED fee amounts). Homepage EN card renamed from "Banking & Advice" to "Banking & Tax" with href to TRC page. Build: 56 pages, 0 TS errors. Local verification complete. Not pushed, not deployed, not committed.

**Files changed:**
- `scripts/add-en-trc.ts` (new)
- `app/(public)/page.tsx` (Banking & Tax card activated)
- `data/guides.db` (local only — guide + 8 steps inserted)

**Local backup:** `data/guides.db.backup-trc-en-1777805265`

---

## 2026-05-03 — CP-LOCALE-FIX-01: Fixed all 5 RU listing locale bugs locally

Fixed all 5 confirmed bugs from CP-LOCALE-AUDIT-01 in two files. Build clean. Local verification complete. Not pushed.

**Files changed:**
- `app/ru/guides/page.tsx` — added `ruSlugSet` filter (BUG-1), replaced English `RU_GROUP_ENTRIES` with hardcoded Russian (BUG-5)
- `components/TopicCard.tsx` — added `LABELS`, `CATEGORY_RU`, `localizeValue()` calls (BUG-2, BUG-3, BUG-4)

**Verification:**
- Build: 55 pages, 0 TS errors
- `/ru/guides`: shows 8 cards (6 RU-complete DB + 2 Russian group entries), all RU labels, zero EN bleed-through
- `/guides`: EN regression clean — Fee/Time still English, all 14 EN guides listed, zero Russian labels
- `/sitemap.xml`: 200, unchanged

**Status:** Local only. Awaiting owner review before commit.

---

## 2026-05-02 — CP-BATCH-RU-02: Bank Account RU + Holiday Homes RU deployed to production

Batch production deploy. Two targeted scripts run on production. Both passed all guards. Build: 55 pages, 0 errors. PM2 restarted, online. All 4 URLs return 200. Both RU URLs in sitemap. EN pages unchanged. No full DB restore used.

**Scripts run:**
1. `scripts/add-ru-business-bank-account.ts` — 1 guide + 9 steps updated
2. `scripts/add-ru-holiday-home-permit-guide.ts` — 1 guide + 12 steps updated

**Production state:**
- DB backup: `/var/backups/guidex/guides.db.pre-batch-ru-bank-hh-20260502-180053`
- Production HEAD: `b18971e`
- Build: 55 pages, 0 errors
- PM2: online, 0 unstable restarts
- `open-business-bank-account-dubai`: ru_title populated, 9/9 RU steps
- `holiday-home-permit-dubai`: ru_title populated, 12/12 RU steps
- EN fields: unchanged on both guides
- Em-dashes in RU DB content: 0
- Integrity check: ok
- `/tourism` hub: 404 (not created)
- Homepage Tourism card: inactive

**Live:**
- https://guidex-consulting.ae/ru/guides/open-business-bank-account-dubai
- https://guidex-consulting.ae/ru/guides/holiday-home-permit-dubai

---

## 2026-05-02 — CP-BATCH-RU-01: Bank RU script verified locally, ready for batch production deploy

Verified `scripts/add-ru-business-bank-account.ts` against all content rules. Script run locally: 1 guide + 9 steps updated, all guards passed, 0 em-dashes. EN title unchanged. Build: 55 pages, 0 errors. All 4 URLs return 200. Both RU URLs in sitemap. Script committed. Ready to batch with Holiday Homes RU in one production maintenance session.

**Changes:**
- `scripts/add-ru-business-bank-account.ts` committed (local run only, no production change)
- `docs/bank-account-guide-upgrade-audit.md` updated with RU status
- `docs/ru-guide-value-localization-audit.md` committed (research doc)

**Production: untouched. Local only.**

---

## 2026-05-02 — CP-HH-RU-02A: Russian content phrase polish for holiday-home-permit-dubai

Patched 5 weak phrases in `scripts/add-ru-holiday-home-permit-guide.ts`. Script rerun: 1 guide + 12 steps updated, all guards passed, 0 em-dashes. Build: 55 pages, 0 errors. RU page 200. Sitemap includes `/ru/guides/holiday-home-permit-dubai`. Ready for production deploy.

**Changes:**
- `scripts/add-ru-holiday-home-permit-guide.ts`: Step 1 ru_what (Add New Unit / Renew phrasing), Step 2 ru_advice (portal login note), Step 4 ru_advice (date errors), Step 7 ru_advice (DET classification self-service), Step 12 ru_advice (Tourism Dirham obligation)

**Production: untouched. Local only.**

---

## 2026-05-02 — CP-HH-RU-01: Russian content for holiday-home-permit-dubai (local only)

Created `scripts/add-ru-holiday-home-permit-guide.ts`. Wrote RU content for all guide-level fields and all 12 steps. Updated `lib/localize-value.ts` with 16 new HH-specific mappings.

**Changes:**
- `scripts/add-ru-holiday-home-permit-guide.ts` created: UPDATE-only script, targets RU fields only, does not touch EN fields or published status, transaction with full post-write verification
- `lib/localize-value.ts`: 9 new timeEst mappings + 5 new cost mappings + 2 guide-level price/timeline mappings
- DB: ru_title, ru_summary, ru_audience, ru_overview populated; all 12 steps have ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning
- DB backup: `data/guides.db.backup-holiday-home-ru-content-1777742571`

**Verification:**
- Script guards: em-dash (caught and fixed 1 in script + 1 in localize-value.ts), guarantee, partnership, private data — all pass
- DB: 12/12 steps have ru_title, ru_what, ru_advice, ru_warning; em-dash count in RU DB fields = 0
- Build: 55 pages, 0 errors (+1 RU holiday home guide now pre-rendered)
- Sitemap: /ru/guides/holiday-home-permit-dubai now included locally
- RU page: correct H1 in Russian, 12 Russian step titles, no EN body fallback, 2 em-dashes (standard title separator only)
- EN guide: unchanged, still 200
- Bank pages (local): unchanged

**Production: untouched. Local only.**

---

## 2026-05-02 — CP-HH-03B: Holiday home permit guide deployed to production

Targeted script `scripts/add-holiday-home-permit-guide.ts` run on production. Guide is live at https://guidex-consulting.ae/guides/holiday-home-permit-dubai.

**Deployment sequence:**
- Commit `2dbd005` pushed to `origin/main`
- Production pulled: `git pull origin main` on `root@85.9.203.69:/var/www/guidex`
- Production DB backed up: `/var/backups/guidex/guides.db.pre-holiday-home-guide-20260502-164949`
- Script run: guide created fresh (did not exist on production), `published=1`, 12 steps, all guards passed, em-dash=0, RU fields empty
- Production build: 53 pages, 0 errors (EN holiday guide included, RU holiday guide absent — correct, no ru_title)
- PM2 restarted: `guidex-production` online, 0 unstable restarts

**Smoke tests passed:**
- `https://guidex-consulting.ae/guides/holiday-home-permit-dubai` → 200, correct H1 and meta
- `/guides` → 200, Tourism section present, holiday home link present
- `/ru/guides/employment-visa` → 200 (RU pages intact)
- `/` → 200, Tourism card still inactive/Coming soon, no direct link to guide
- Sitemap: `/guides/holiday-home-permit-dubai` present, `/ru/guides/holiday-home-permit-dubai` absent

**No full DB restore used. No bank/RU files deployed.**

---

## 2026-05-02 — CP-HH-02E: Holiday home permit guide final content QA polish (local only)

Final pre-review pass on `scripts/add-holiday-home-permit-guide.ts`. Guide remains DRAFT.

**Changes (7 targeted edits):**
1. All `tourism.gov.ae` en_address values replaced with `HH Permits portal` (10 steps, replace_all)
2. Step 2 address: `tourism.gov.ae (HH Permits section)` → `HH Permits portal`
3. Step 2 warning (was empty): account type caution added
4. Step 3 warning (was empty): bedroom count caution added
5. Step 5 advice: tenant/non-owner cautious note appended ("If the applicant is not the property owner, or if a company or operator manages the unit, check current portal requirements...")
6. Step 6 warning (was empty): submission risk caution added
7. Step 8 warning (was empty): portal fee controls caution added

**All 12 warnings now non-empty.**
**Zero `tourism.gov.ae` in any en_address field.**

**DB backup:** data/guides.db.backup-holiday-home-final-polish-1777717040
**Build:** 63 pages, 0 errors. **Production:** untouched. **Git pushed:** no.

---

## 2026-05-02 — CP-HH-02D: Holiday home permit guide EN accuracy polish (local only)

Applied 8 accuracy and wording fixes to `scripts/add-holiday-home-permit-guide.ts` and reran locally. Guide remains DRAFT.

**Fixes applied:**
1. Step 5: Property Management Letter added to document list with cautious wording ("may be required depending on applicant type and portal flow")
2. Step 2 advice: owner-managed vs operator-managed note added ("A separate management company is not always required...")
3. Step 5 what + advice: DEWA wording updated to "recent DEWA bill and the DEWA number requested by the portal"; added account-vs-premises number caution
4. Step 4 what: "Permits are valid for one year" replaced with "Holiday home permits are generally annual"; added Property Management Letter date-matching note for operator-managed units
5. Step 6 title changed to "Review and Submit the Application"; what and advice rewritten to be safe about portal stage labeling
6. Step 7 what: classification timing made portal-sequence-safe; advice added DET public guidance note
7. Step 10 advice: payment-pending status clarified as not meaning approved; new warning added for Renewal Payment Pending Approval persistence
8. Step 11 what: added "unit status must show Approved before you rely on the permit"; new warning: do not list until status is Approved
9. Step 12 advice: added "Holiday Homes 2.0 handles guest check-ins, check-outs, Tourism Dirham payments and QR code functions where applicable"

**DB backup:** data/guides.db.backup-holiday-home-polish-1777716404
**Build:** 63 pages, 0 errors. **Production:** untouched. **Git pushed:** no.

---

## 2026-05-02 — CP-HH-02B: Holiday home permit guide created as draft (local only)

Created guide `holiday-home-permit-dubai` via `scripts/add-holiday-home-permit-guide.ts`. Draft only, not published.

**Script:** `scripts/add-holiday-home-permit-guide.ts`
- Pre-write validation: em-dash, guarantee language, partnership language, private data
- Transaction: delete-if-exists then insert guide + 12 steps
- Post-write verification: step count = 12, RU fields empty, em-dashes = 0, category = tourism, published = 0

**Guide fields:**
- en_title: "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Booking.com"
- slug: holiday-home-permit-dubai
- category: tourism
- published: false (DRAFT)
- price: From AED 370 for a 1-bedroom unit...
- timeline: DET lists 1 business day target...

**12 steps created:**
1. Choose Add New Unit or Renew
2. Open the HH Permits Portal
3. Fill Unit Information
4. Set Permit Dates Carefully
5. Upload Required Documents
6. Review Before Submission
7. Complete Unit Classification
8. Check Official Fees
9. Wait for DET Review or Comments
10. Confirm Payment and Upload Receipt if Required
11. Wait for Payment Approval and Record Issuance
12. Print the Permit and Keep the Unit Ready for Guests

**DB backup:** data/guides.db.backup-holiday-home-guide-1777714931
**Build:** 63 pages, 0 errors (guide is draft, not pre-rendered yet; will be 64 pages after publish)
**Production:** untouched. **Git pushed:** no. **Homepage:** unchanged (Tourism card still inactive).

**Admin URL:** http://localhost:3000/admin/guides/holiday-home-permit-dubai
**Public URL (after publish):** http://localhost:3000/guides/holiday-home-permit-dubai

---

## 2026-05-02 — CP-HH-02A: Tourism category support added (local only)

Added `tourism` category value across all relevant frontend files. No guide created, no DB changes, no homepage card activated, no hub page created.

**Files changed (5):**
- `components/admin/GuideFormFields.tsx` — added `{ value: "tourism", label: "Tourism & Short-Term Rentals" }` to CATEGORIES
- `components/CategoryIcon.tsx` — added `"tourism"` to KnownCategory type + key SVG icon (14×14, 1.5px stroke)
- `components/GuideHeader.tsx` — added `"tourism" → "Туризм"` to CATEGORY_RU map
- `app/(public)/guides/page.tsx` — added `"tourism"` to CATEGORY_ORDER + `"Tourism & Short-Term Rentals"` to CATEGORY_LABELS
- `app/ru/guides/page.tsx` — added `"tourism"` to CATEGORY_ORDER + `"Туризм и краткосрочная аренда"` to CATEGORY_LABELS

**Build:** 63 pages, 0 TypeScript errors, 0 warnings.
**DB:** untouched. **Production:** untouched. **Homepage:** no change (Tourism card remains inactive/soon).

**Next:** Create holiday home permit guide via admin panel (slug: `holiday-home-permit-dubai`, category: `tourism`).

---

## 2026-05-01 — CP-HH-01: Holiday Home Permit guide — research and content plan

Created `docs/holiday-home-permit-guide-plan.md` — planning document only, no code/DB/production changes.

**Document covers (10 sections):**
- Executive Summary: "holiday home permit Dubai" / "Airbnb permit Dubai" — high-intent, underserved, neutral slot
- Official Source Findings: DET portal, fee formula (AED 300/bedroom + AED 70 = AED 370 for 1-bed), permit duration 1 year, Tourism Dirham rates (AED 15 Deluxe / AED 10 Standard), 7 unit statuses
- Screenshot Workflow Findings: 6-stage portal flow (Unit Information → Documents → Review → Associated Forms → Pay Fees → Record Issuance)
- SEO/Competitor Gap: underserved by real estate blogs and DET portal pages; AI answer gap
- IA and Naming: new `tourism` category required, slug `holiday-home-permit-dubai`, URL `/guides/holiday-home-permit-dubai`
- Recommended Guide Structure: 12 steps from qualification check through Tourism Dirham setup
- Privacy and Legal Cautions: never publish permit numbers, owner names, unit numbers, DEWA numbers, payment refs
- Future Web App Opportunities: fee calculator, document checklist, classification checker, renewal reminder, Tourism Dirham tracker
- Implementation Plan: 4-phase, ~2 hours total effort
- Exact Next Single Action: add `tourism` to CATEGORIES constant in GuideFormFields.tsx

**No implementation.** No DB changes. No scripts. No production changes.

---

## 2026-05-01 — CP-26: RU content for bank account guide (local only)

Added RU content for `open-business-bank-account-dubai` via `scripts/add-ru-business-bank-account.ts`.

**Changes:**
- ru_title: "Открыть бизнес-счёт в банке ОАЭ для компании в Дубае"
- ru_summary, ru_audience, ru_overview: populated
- All 9 steps: ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning populated
- EN fields: unchanged
- Wio Business: example only (not partner), monthly subscription + no minimum balance nuance present, digital onboarding compliance depth mentioned
- POA: one scenario only (not mandatory) — owner/shareholder can apply directly
- Real estate: conditional language ("may ask", "depending on exact activity")
- No em-dashes, no guarantee language, no Wio partnership implication

**Value localization (6 new mappings in lib/localize-value.ts):**
- "No fee (regulatory registration costs are separate)" → Russian
- "No government fee. Bank package, monthly subscription..." → Russian
- "Allow additional weeks if RERA or goAML registration is required." → Russian
- "2–6 weeks from submission (varies by bank and compliance review)" → Russian
- "2–6 weeks (varies by bank, compliance review, and business activity)" → Russian
- Guide price long text → Russian

**Verification:** 9 steps RU complete, 0 em-dashes, EN unchanged, sitemap now includes /ru/guides/open-business-bank-account-dubai, build 63 pages 0 errors.

**Not deployed:** local only. Production DB untouched.

---

## 2026-05-01 — CP-25B: EN bank account guide deployed to production

Deployed upgraded EN content for `open-business-bank-account-dubai` to production via targeted script only.

**Process:**
- Committed `scripts/update-bank-account-guide-en.ts` + docs to GitHub
- SSH into UpCloud (85.9.203.69), git pull origin main
- Production DB backed up at `/var/backups/guidex/guides.db.pre-bank-en-upgrade-20260501-134430`
- Ran `npx tsx scripts/update-bank-account-guide-en.ts` on production server
- Post-write verification: step count = 9, RU empty, 0 em-dashes, integrity_check = ok
- `npm run build` on production: 63 pages, 0 errors
- PM2 restarted: guidex-production online
- Smoke test: EN page 200, H1 correct, 9 steps visible, Wio nuance correct, no guarantee language

**No full DB restore used.** Targeted script only.

---

## 2026-05-01 — Bank account guide EN upgrade (local only)

Upgraded EN content for `open-business-bank-account-dubai` via `scripts/update-bank-account-guide-en.ts`.

**Changes:**
- en_title: "How to Open a Business Bank Account in Dubai" → "Open a Business Bank Account in Dubai for a UAE Company"
- en_summary, en_audience, en_overview, price: fully rewritten
- Steps: 8 → 9 (delete-and-reinsert; all ru_* fields explicitly set to empty string)

**New steps:**
1. Confirm Your Company Profile and Applicant Role
2. Choose the Bank Route and Understand Digital Onboarding
3. Prepare Company, Shareholder, and Authority Documents
4. Build the Business Profile the Bank Can Understand
5. Prepare Customer and Supplier Evidence
6. Explain Source of Funds and Provide Bank History
7. Prepare Expected Transaction and Tax Information
8. Handle Compliance Checks for Real Estate and Regulated Activities
9. Submit, Answer Bank Questions, and Wait for the Decision

**Content covers:** shareholder/POA role types, digital bank option (Wio as example only), customer/supplier profiles, source of funds + 3-month bank statements, FATCA/CRS/TIN, RERA/DNFBP/goAML, expected transaction estimates.

**QA assertions passed:** no em-dashes, no guarantee language, no Wio partnership language, step count = 9, RU empty, build 63 pages 0 errors.

**Local DB backup:** data/guides.db.backup-bank-en-upgrade-1777616978301

**No code changes. No production changes. No RU content.**

CP-25 added.

---

## 2026-04-30 — Bank account guide upgrade audit

Reviewed Wio Business onboarding screenshots (user-provided) and audited the current `open-business-bank-account-dubai` EN guide for content gaps.

**Current state:** 8 steps, all EN fields populated, all RU fields empty. Guide is structurally sound but compliance-thin. Missing: customer/supplier profiles, source of funds detail, 3-month bank statement requirement, RERA warning, CV/LinkedIn, digital bank options, shareholder role types.

**Wio Business evidence:** Shows structured onboarding for applicant role (shareholder/POA/employee), top 5 customers, top 5 suppliers, 3-month bank statements (not password-protected), subsidiary disclosure, consultancy service description, regulated/RERA activity, source of funds declaration, and CV/LinkedIn. Guide covers none of these explicitly.

**Recommendation:** Upgrade EN master guide first (8 → 9 steps). New Step 4 dedicated to source of funds. Step 3 rewritten to cover KYC compliance package (customers, suppliers, bank statements, CV). Steps 5–9 correspond to current 4–8.

**No code, DB, or content changes made in this step.** Audit only.

Audit document: `docs/bank-account-guide-upgrade-audit.md`

---

## 2026-04-30 — Step 4: full RU value localization + D-class em-dash fix

**lib/localize-value.ts expanded** from 21 to 47 mappings, covering:
- 3 guide price strings (AED+English context): "AED 9,884.75 (main applicant)" etc.
- 2 guide timeline conditionals: "(without external approvals)", "(varies by free zone)"
- 10 step cost AED+context strings (employment-visa steps 2/7, golden step 7, mainland steps 4/5/7, free-zone steps 4/5/6)
- 7 step timeEst duration+context strings ("for review", "after payment", "after submission", etc.)
- 2 post-D-fix timeEst mappings ("Varies: 4–10+...", "Varies: bank account...")

**D-class DB patch** (`scripts/patch-d-class-timeest-em-dashes.ts`): removed em-dash from 2 EN `time_est` fields. Applied locally and on production (backup at /var/backups/guidex/guides.db.pre-step4-d-class-fix-*). Verified: mainland step 6 and free-zone step 8 now use colon on both EN and RU pages.

**Build:** 63 pages, 0 errors. **Production smoke test:** all 4 RU guides show Russian values; EN employment-visa shows English; D-class em-dash gone from EN mainland. Commit: bcf98b9. CP-24 added.

**Remaining English on RU pages (intentional, B-class pure AED):**
- AED 278, AED 1,126, AED 676, AED 323, AED 386, AED 546 (employment-visa steps)
- AED 8,031.75, AED 700, AED 1,153 (golden-visa steps)
- AED 620–720 (mainland step 3)
- AED 4,900 – 7,300 (employment-visa guide price)
These are internationally understood in a Dubai financial context — no mapping needed.

---

## 2026-04-30 — Step 3: display-level value localization for RU guide pages

Created `lib/localize-value.ts` with 21 exact-match A-class mappings (cost + timeEst strings) and a month-name regex for `lastUpdated`. Helper returns original value unchanged for any unmatched or B/C-class string.

Updated `app/ru/guides/[slug]/page.tsx` to wrap guide.price, guide.timeline, guide.lastUpdated, step.cost, and step.timeEst via `localizeValue("ru")` before passing to RouteSnapshot and StepCard. EN guide page not touched.

Verified via built HTML: "2–4 недели", "2–3 дня", "Апрель 2025/2026", "Бесплатно", "По необходимости", "Без сборов", "Без сборов на этом этапе", "Зависит от сектора", "Включено в шаг 6/7", "Включено в стоимость пакета", "Оплата в тот же день" all present on correct RU pages. AED amounts and C-class values unchanged.

Production smoke test: all 4 RU guides confirmed. Build: 63 pages, 0 errors. Commit: 665744e. CP-23 added.

Remaining English on RU pages: C-class values (AED + English context strings) — deferred to schema redesign. D-class EN em-dashes ("Varies — 4–10+ weeks", "Varies — bank account may take 2–6 weeks") — separate EN content fix.

---

## 2026-04-30 — Step 2: UI label localization for RU guide pages

Added `locale?: "en" | "ru"` prop (default "en") to:
- `components/RouteSnapshot.tsx` — 6 label pairs in LABELS dict
- `components/StepCard.tsx` — 6 label pairs in LABELS dict
- `components/GuideHeader.tsx` — category map (5 category slugs → Russian)

Updated `app/ru/guides/[slug]/page.tsx` to pass `locale="ru"` to GuideHeader, RouteSnapshot, and every StepCard.

EN guide page (`app/(public)/guides/[slug]/page.tsx`) not touched — defaults work.

Build: 63 pages, 0 TypeScript errors. No DB changes. No schema changes.

Production smoke test: all 4 RU guide pages return HTTP 200 with all 8 Russian label types confirmed. EN employment-visa page retains English labels.

Still not fixed (Category B): step cost/time values ("No fee", "1 day"), guide price/timeline values — English DB values, separate step.

CP-22 added.

---

## 2026-04-30 — Step 1A: RU content em-dash hygiene pass (all 4 guides)

Removed all content em-dashes from the 4 completed RU guides.

**Before:**
- employment-visa: guide-level pos 180, steps 2/3/4/7/8 affected
- golden-visa-dubai-property: guide-level pos 133, steps 1/3/7 affected
- mainland-company-setup-dubai: guide-level pos 660, steps 1/3/4/5/6 affected
- free-zone-company-setup-dubai: guide-level clean (prev patched locally), steps clean locally; production had em-dashes

**After:** guide=OK steps=OK for all 4 on both local and production DB.

**Files changed:**
- `scripts/add-ru-employment-visa.ts` — 9 content em-dashes removed
- `scripts/add-ru-golden-visa-property.ts` — 6 content em-dashes removed
- `scripts/add-ru-mainland-company.ts` — 11 content em-dashes removed
- `scripts/add-ru-free-zone-company-setup.ts` — 7 content em-dashes removed
- `scripts/patch-ru-em-dashes-completed-guides.ts` — NEW targeted patch script with assertNoEmDash guards

**Replacements used:** comma, colon, parentheses, sentence split. No meaning removed.

**Production backup:** `/var/backups/guidex/guides.db.pre-ru-em-dash-cleanup-YYYYMMDD-HHMMSS`
**Build:** 63 pages, 0 errors. PM2 restarted, online.

Remaining em-dashes in HTML: `<title>` separator (intentional) + EN `time_est` values (Category B, not in scope).

CP-21 added.

---

## 2026-04-30 — RU guide quality audit (no code/DB changes)

Produced comprehensive audit of all 4 live RU guide pages. Output: `docs/ru-guide-quality-audit.md`.

**Key findings:**

- **Category A (code fix):** 12 UI labels hardcoded in English across `RouteSnapshot.tsx` (6 labels) and `StepCard.tsx` (6 labels). Category pill in `GuideHeader.tsx` also has no locale mapping. Fix: add `locale` prop, translate labels, pass from `app/ru/guides/[slug]/page.tsx`.

- **Category B (schema/content fix):** 6 DB fields have no `ru_*` equivalents — `price`, `timeline`, `lastUpdated`, `category` (guide level) and `cost`, `timeEst` (step level). Values show in English on all RU pages. Recommended fix: display-level mapping for category; rewrite EN-only duration words in content.

- **Category C (CRITICAL — em-dashes):** `free-zone-company-setup-dubai` has em-dashes in production DB (Step 1 ru_advice, Step 2 ru_what, ru_overview). Script file `scripts/add-ru-free-zone-company-setup.ts` was never updated after local DB patch — source still contains em-dashes. Both script file AND production DB must be fixed.

- SEO quality: employment-visa 4/5, golden-visa 3.5/5, mainland-company-setup 3.5/5, free-zone 3/5 (em-dash penalty).

**No code, no DB, no deploy in this step.**

Next: Step 1 — fix em-dashes in free-zone script file + production DB patch.

---

## 2026-04-30 — RU content: free-zone-company-setup-dubai

Populated all RU fields for the free zone company setup guide. 8/8 steps.

**Script:** `scripts/add-ru-free-zone-company-setup.ts`

**Guide-level fields set:**
- `ru_title`: Открыть компанию в free zone в Дубае: лицензия, визы и банковский счёт
- `ru_summary`: 4-sentence meta with zone selection warning, cost range (AED 6k–20k+)
- `ru_audience`: Non-residents, online business, consulting, international trade, holding
- `ru_overview`: 2 paragraphs. Para 1: free zone overview + zone selection risk. Para 2: timeline + post-license steps (establishment card, bank, visas, VAT, CT)

**Steps populated:**
1. Выбор free zone
2. Выбор типа лицензии и вида деятельности
3. Выбор пакета и визовой квоты
4. Резервирование названия компании
5. Подача заявки и документов
6. Оплата сборов за регистрацию
7. Получение лицензии и учредительных документов
8. Первые шаги после получения лицензии

**Em-dash fix:** Initial version had 6 em-dashes across steps 1/2/3/5/8 and overview. Fixed via targeted DB patch before commit. Final count: 0.

**Verified:**
- /ru/guides/free-zone-company-setup-dubai: 200, Russian H1, all 8 step H3 titles in Russian, 0 em-dashes
- /guides/free-zone-company-setup-dubai: EN unchanged, hreflang now includes ru
- Sitemap: /ru/guides/free-zone-company-setup-dubai entry present
- /ru/company-setup: all 3 guide links intact (mainland, free-zone, bank-account)
- Build: 63 pages, 0 TypeScript errors

CP-20 added.

---

## 2026-04-30 — Visual/UX smoke test after commit 1948214

All 8 routes 200. No code changes. Findings recorded below.

Passed: EN homepage 5 cards render correctly; soon cards are non-clickable divs with no href; "Browse all guides →" present; RouteSnapshotBand renders (12 AED mentions); PrimaryServices not in HTML; RU homepage has Скоро badges, Government card, /ru/government link, "Все гайды →" bottom link; /ru/government: Russian H1 and copy, all 3 guide links to /ru/guides/..., hreflang canonical /ru/government + en-alternate /government, language switcher points to /government; Business Bank Account inside both /company-setup and /ru/company-setup; soon cards have no href on either locale; no EN /guides/ bleed on RU pages.

One structural difference confirmed as intentional: EN homepage has 5 sections (Hero + Cards + RouteSnapshotBand + HowItWorks + FreeAdviceCta); RU has 3 (Hero + Cards + WhatsApp CTA). Not a bug.

Density note: RouteSnapshotBand adds 4 more guide cards after the 5 category cards on EN only. Page total is shorter than old PrimaryServices (which had 12 item rows). Recommend keeping band for now; flag for removal if EN/RU parity becomes a priority.

---

## 2026-04-29 — Homepage IA restructure: route-hub cards on EN and RU

Replaced EN homepage `PrimaryServices` list with 5 category cards matching RU's route-hub structure.

**Files changed:**
- `app/(public)/page.tsx` — removed `PrimaryServices`; added 5 inline `ServiceCard` entries (3 active, 2 soon); kept `RouteSnapshotBand`, `HowItWorks`, `FreeAdviceCta`, "Browse all guides →"
- `app/ru/page.tsx` — removed "Все гайды" primary card; added Государственные услуги card; added 2 soon cards (Туризм и аренда, Банкинг и консультации); added "Все гайды →" bottom text link
- `app/ru/government/page.tsx` — new file; mirrors EN government hub structure; Russian copy; 3 guide cards; WhatsApp CTA; hreflang: `ru` canonical `/ru/government`, `en` alternate `/government`

**Not changed:**
- `components/PrimaryServices.tsx` — retained (not imported anywhere after this change)
- All guide article pages — untouched
- All hub pages (`/visas`, `/company-setup`, `/government`, `/ru/visas`, `/ru/company-setup`) — untouched
- DB, sitemap logic, brand — untouched

**Verified:**
- `PrimaryServices` not imported anywhere in `app/` or `components/`
- Build: 63 pages, 0 errors (new page: `/ru/government`)
- TypeScript: clean

CP-19 added.

---

## 2026-04-29 — Fix: locale-aware navigation for RU pages

Full audit of all public components generating guide/service links.

**Bugs found and fixed:**
- `Footer.tsx` — `/contact` → `/ru/contact` on RU pages; English labels → Russian ("О нас", "Контакты")
- `StickyRouteCta.tsx` — English "Find My Route" / "Answer 2–3 quick questions" → Russian on RU pages

**New helper:** `lib/locale-path.ts`
- `getGuidePath(slug, locale)` — `/guides/slug` or `/ru/guides/slug`
- `getLocalePath(path, locale)` — prefixes `/ru` when locale=ru
- `getLocaleFromPathname(pathname)` — detects locale from URL

**Audit findings — already correct (no changes):**
- `TopicCard.tsx` — already locale-aware (locale prop, /ru/guides/ prefix)
- `GuideTabs.tsx` — guidesHref already locale-aware; /find-my-visa stays EN (no RU equiv)
- `Header.tsx` — already locale-aware (language switcher, RU_NAV/EN_NAV)
- All RU-specific page-level links correct (hardcoded /ru/ in ru/ directory pages)

**Audit findings — EN-only, not on RU pages (no fix needed):**
- `PrimaryServices.tsx` — EN homepage only
- `RouteSnapshotBand.tsx` — EN homepage only
- `BrowseByService.tsx` — unused
- `QuickDecisionCards.tsx` — unused
- `RouteFinderFlow.tsx` — on /find-my-visa (EN-only page, no /ru/find-my-visa)

**Verified:**
- 6 RU pages: /ru/contact in footer, "Найти маршрут" in sticky CTA, no English sticky text
- 4 EN pages: unaffected (/contact link, English sticky CTA)
- Language switcher EN links on RU pages confirmed correct (Header alternatePath() behavior)
- Build: 62 pages, 0 errors

CP-18 added.

---

## 2026-04-29 — Russian content: mainland-company-setup-dubai guide fully populated

Created `scripts/add-ru-mainland-company.ts` — populates all ru_* fields for mainland-company-setup-dubai.

- ru_title: "Открыть mainland компанию в Дубае: лицензия DED и полный процесс"
- ru_summary: 3 sentences — route, AED 12 000–25 000+ slab, Ejari/trade license
- ru_audience: DED-licensed company founders, excludes regulated sectors
- ru_overview: 2 paragraphs — what mainland means + 3-phase process + post-license steps (establishment card, MOHRE, VAT, bank account)
- All 8 step ru_* fields populated; keywords woven in: DED, trade name reservation, initial approval, Ejari, MoA, local service agent, establishment card, immigration file, MOHRE, VAT, corporate tax, trade license

Verified:
- `/ru/guides/mainland-company-setup-dubai` 200, Russian H1, all 8 step titles in Russian, meta in Russian
- `/guides/mainland-company-setup-dubai` emits `ru` hreflang
- Sitemap: both EN and RU entries present
- Build: 62 pages, 0 errors

CP-17 added.

---

## 2026-04-29 — Russian content: golden-visa-dubai-property guide fully populated

Created `scripts/add-ru-golden-visa-property.ts` — populates all ru_* fields for golden-visa-dubai-property.

- ru_title: "Золотая виза в Дубае через недвижимость от AED 2 000 000"
- ru_summary: 3 sentences, covers route, AED 2M threshold, DLD/GDRFA, AED 9 885 slab
- ru_audience: freehold owners at AED 2M+ threshold, no employer required
- ru_overview: 2 paragraphs — eligibility + cost/timeline
- All 7 step ru_* fields populated (title, what, where, address, advice, warning)
- Keywords woven in: золотая виза в Дубае через недвижимость, DLD, GDRFA, title deed, Oqood, mortgage NOC, property valuation certificate, Emirates ID, freehold, AED 2 000 000

Verified:
- `/ru/guides/golden-visa-dubai-property` 200, Russian H1, all 7 step titles in Russian, meta in Russian
- `/guides/golden-visa-dubai-property` now emits `ru` hreflang
- Sitemap: both EN and RU entries present
- Build: 62 pages, 0 errors

CP-16 added.

---

## 2026-04-29 — Russian content: employment-visa guide fully populated

Created `scripts/add-ru-employment-visa.ts` — populates all ru_* fields for employment-visa.

- ru_title: "Рабочая виза в Дубае: оформление через компанию без выезда из ОАЭ"
- ru_summary: 2 sentences, includes price range (AED 4 900–7 300), service centers
- ru_audience: exact reader description in Russian
- ru_overview: 2 paragraphs — route explanation + cost/timeline/reader role
- All 8 step ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning fields populated
- Russian style: short sentences, no em dashes, official terms (MOHRE, Tasheel, Amer, GDRFA, Tawjeeh, entry permit, change status, Emirates ID) used naturally
- Target keywords woven in: рабочая виза в Дубае, рабочая резидентская виза, стоимость, сроки

Verified:
- `/ru/guides/employment-visa` 200, H1 in Russian, all 8 step titles in Russian, meta description in Russian
- `/guides/employment-visa` now emits `ru` hreflang (hasRuContent=true triggered correctly)
- Sitemap: `https://guidex-consulting.ae/ru/guides/employment-visa` present
- Build: 62 pages, 0 errors

CP-15 added.

---

## 2026-04-29 — Phase 1B Russian routing: full verification pass

Discovered Phase 1B was already fully implemented in commit 5149a84. Ran complete spec verification:

- All 7 routes return 200: `/`, `/guides`, `/guides/employment-visa`, `/ru/guides/employment-visa`, `/guides/golden-visa-dubai-property`, `/ru/guides/golden-visa-dubai-property`, `/admin/login`
- EN guide hreflang: `en` + `x-default` only (no `ru` — correct, all ru_title empty so hasRuContent=false)
- RU guide hreflang: `en` + `ru` + `x-default` + canonical `/ru/guides/[slug]`
- Language switcher: EN→RU and RU→EN links both correct via alternatePath()
- RU nav: Визы / Компании / Гайды (no Find My Route — correct per spec)
- EN fallback: RU pages render EN h1 for empty ru_title (correct)
- Sitemap: 32 entries — EN static (12) + EN guides (11, minus 4 redirect slugs) + RU static (9) + RU guides (0, filtered by ru_title)
- No admin/writer imports in public bundle
- CP-14 added to CHECKPOINTS.md
- NEW_CHAT_TRANSFER.txt rewritten: UpCloud server details, correct git hash (3927e4c), Phase 1B verified status

---

## 2026-04-29 — Post-migration cleanup: UpCloud docs and scripts

- Created `docs/deployment-upcloud.md` — authoritative runbook with IP filled in (85.9.203.69), all OVH placeholders removed
- Removed `docs/deployment-ovh.md` (superseded)
- Created `scripts/db-backup-from-upcloud.sh` — clean backup script, IP hardcoded
- Created `scripts/db-restore-to-upcloud.sh` — clean restore script, IP hardcoded
- `scripts/db-backup-from-ovh.sh` and `db-restore-to-ovh.sh` — updated to deprecated with backwards-compat default of UpCloud IP
- `PROJECT_STATE.md` — updated deployment target, deployment notes, removed all OVH/Cloudways stale references

---

## 2026-04-29 — UpCloud migration: HTTPS live, DNS switched, all smoke tests pass

Full migration from Cloudways (165.245.187.15) to UpCloud (85.9.203.69) complete.

Steps completed:
- 2 GB swap created (fallocate, permanent via /etc/fstab)
- Repo cloned from GitHub at c127e9b, data/ dir created
- .env.local uploaded (scp), chmod 600, all 5 keys verified present without printing values
- DB uploaded (guides.db.20260429-140304): integrity ok, 15 guides, 94 steps
- npm ci + npm run build: 62 pages, 0 errors
- PM2 started via ecosystem.config.js (guidex-production), pm2 save, pm2-root.service enabled
- Port 3000 → 200 confirmed from server
- Nginx config deployed, nginx -t passes, nginx reload
- Pre-DNS smoke tests: 8/8 routes 200 by IP + Host header
- DNS: @ + www → 85.9.203.69 updated at Tasjeel
- Certbot SSL issued: guidex-consulting.ae + www, valid to 2026-07-28, certbot.timer active
- Post-DNS smoke tests: 9/9 HTTPS routes 200, HTTP→HTTPS 301 confirmed

Cloudways still live — do NOT cancel until cron backup (Phase 8) is done.

Phase 8: cron backup installed (0 3 * * *), first backup verified (guides.db.20260429-140750, 124K, SQLite ok).
All 8 phases complete. Cloudways safe to cancel.

---

## 2026-04-29 — OVH migration: DB verified, migration prep committed

DB backup `guides.db.20260429-140304` pulled from Cloudways and verified:
- `PRAGMA integrity_check;` → ok
- 15 guides, 94 steps, all published=1
- All key slugs present

This is the source DB for the OVH migration. Cloudways remains live (do not cancel until OVH is live and DNS has switched). Waiting on: OVH server IP + SSH root access.

All OVH migration assets committed in `5149a84`:
- `ecosystem.config.js`, `deploy/nginx/guidex-consulting.ae`, `deploy/scripts/server-cron-backup.sh`
- `scripts/ovh-server-setup.sh`, `scripts/db-backup-from-ovh.sh`, `scripts/db-restore-to-ovh.sh`
- `docs/deployment-ovh.md` — full 9-phase runbook

**Next:** Provide OVH IP → Phase 1 server setup → Phase 2 clone/env → Phase 3 DB upload → Phase 4 PM2 → Phase 5 Nginx → Phase 6 smoke tests → Phase 7 DNS+SSL

---

## 2026-04-28 — Phase 1B: Russian public routing infrastructure

**Build result:** 62 pages, 0 TypeScript errors, 0 build errors. Up from 38 pages (EN only).

**New RU routes (all static or SSG):**
- `/ru` — Russian homepage
- `/ru/guides` — all published guides, localized (EN fallback where ru_* empty)
- `/ru/guides/[slug]` — 15 static pages, EN fallback content until translated
- `/ru/guides/spouse-dependent-visa-dubai` — tab group page (locale-aware)
- `/ru/guides/child-dependent-visa-dubai` — tab group page (locale-aware)
- `/ru/visas` — Russian visa hub
- `/ru/visas/family` — Russian family visa hub
- `/ru/visas/golden` — Russian golden visa hub
- `/ru/company-setup` — Russian company setup hub
- `/ru/contact` — Russian contact page

**Infrastructure changes:**
- `lib/db/reader.ts` — added `Locale` type, field-level `pick()` helper, locale params (default 'en') to all public query functions, `hasRuContent: boolean` on GuideData, `getRuPublishedGuidesSlugs()` for sitemap
- `components/Header.tsx` — locale detection from `usePathname`, RU nav items, EN/RU language switcher pill (desktop + mobile), locale-aware logo link and active state
- `components/GuideTabs.tsx` — added `locale?: Locale` prop, `STRINGS` map for translated UI labels, locale-aware breadcrumb links
- `components/TopicCard.tsx` — added `locale?: 'en'|'ru'` prop, href prefix switches to `/ru/guides/` when locale is 'ru'
- `app/sitemap.ts` — added RU static pages + RU guide entries (filtered to slugs where ru_title non-empty)
- `app/(public)/guides/[slug]/page.tsx` — added hreflang alternates to generateMetadata (ru only added when guide.hasRuContent is true)
- `app/(public)/page.tsx` — added metadata with hreflang alternates (EN/RU/x-default)
- `app/ru/layout.tsx` — new RU layout wrapping same Header/Footer/StickyRouteCta as EN

**Fallback behavior:** All RU routes use field-level EN fallback. If `ru_title` is empty, the EN title renders. Same per field. No blank pages possible.

**Sitemap:** RU guide entries only appear for slugs where `ru_title` non-empty. Currently 0 (no translations yet). Will grow automatically as admin fills ru_* fields.

**Not yet committed — pending owner QA review.**

---

## 2026-04-28 — Strategic planning docs created (RU/EN SEO strategy + platform roadmap)

**Five planning documents created:**

1. `docs/platform-roadmap.md` — 8-phase forward roadmap with Russian as Phase 1 (business decision). Locked URL design: EN = `/guides/[slug]`, RU = `/ru/guides/[slug]`, no `/en/` prefix ever. Phase 1 implementation plan with routing, language switcher, hreflang/canonical, and first 12 pages to translate.

2. `docs/seo-keyword-map-ru-en.md` — Keyword map for 5 clusters: A=Visa, B=Company setup, C=Bank account, D=Government, E=Relocation. Each keyword has language, priority label, page type, and target URL. Both EN and RU Cyrillic keywords. No invented search volumes.

3. `docs/content-style-guide-ru-en.md` — Writing rules for all content fields. Em dash ban, short sentences, costs/timelines first, theatrical framing ban, AI verbosity ban. Bad/good examples in both English and Russian. RU-specific rules: do not translate English, use terms Russian professionals use, fees formatted "AED 2 500", lowercase "вы".

4. `docs/ru-launch-plan.md` — Page-by-page plan for the 12 minimum RU launch pages. Each entry: RU URL, primary keyword, secondary keywords, title direction, meta description direction, content notes. Go/no-go criteria checklist included.

5. `docs/content-audit-ai-tone.md` — Audit of all 15 published EN guides. Em dashes found in 11/15 guides. Priority fix queue: bank account (worst), mainland company, free zone, child visa summary, employment outside-UAE, then minor instances. One audience self-reference in mainland guide. No theatrical framing or AI verbosity remaining (prior pass cleaned those).

**Memory files updated:** ROADMAP.md (forward phases added), PROJECT_STATE.md (next step updated to Phase 1 RU routing).

---

## 2026-04-28 — Cloudways server recovery (new IP, new SSH user)

**Problem:** Cloudways suspended/deleted the original server (157.245.207.99). Site went down.
**Resolution:** Cloudways recovered the application onto a new server.

**New server facts:**
- IP: 165.245.187.15 (was: 157.245.207.99)
- SSH user: master_asumzwhebx (was: master_udndspcyhr)
- Server name: Recovered-guidex-main-server
- App path: /home/master/applications/dgcmdxxpjx/public_html (unchanged)

**Recovery steps:**
- Confirmed app files, .env.local, data/guides.db, and .next build survived restore
- Cloudways Support re-enabled proxy_module, proxy_http_module, proxy_fcgi_module
- DNS A record updated in Tasjeel: guidex-consulting.ae → 165.245.187.15
- HTTP → HTTPS redirect confirmed working (301)
- Site smoke-tested: all HTTPS routes 200

**Files updated:** All scripts, docs/deployment-cloudways.md, PROJECT_STATE.md,
CHECKPOINTS.md, NEW_CHAT_TRANSFER.txt — old IP/SSH user replaced throughout.

---

## 2026-04-27 — Real domain launch + final smoke test (Phase 12)

**guidex-consulting.ae is LIVE.**

**Steps completed:**
- DNS A record set in Tasjeel: guidex-consulting.ae → 157.245.207.99; www CNAME → apex
- Cloudways primary domain: guidex-consulting.ae; additional: www.guidex-consulting.ae
- Server .env.local updated: NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → https://guidex-consulting.ae (Python-safe update, backup created first)
- `npm run build` on server — rebuild required for NEXT_PUBLIC_SITE_URL bake-in
- PM2 restarted with --update-env
- SSL Let's Encrypt installed for guidex-consulting.ae + www.guidex-consulting.ae
- Production DB backed up locally: backups/production-db/guides.db.20260427-223918

**Final smoke test (all HTTPS — 200):**
- https://guidex-consulting.ae/ ✅
- https://guidex-consulting.ae/guides ✅
- https://guidex-consulting.ae/guides/employment-visa ✅
- https://guidex-consulting.ae/guides/golden-visa-dubai-property ✅
- https://guidex-consulting.ae/contact ✅
- https://guidex-consulting.ae/admin/login ✅
- https://guidex-consulting.ae/robots.txt ✅
- https://guidex-consulting.ae/sitemap.xml ✅
- https://www.guidex-consulting.ae/ ✅

**Homepage confirmed:** Next.js Guidex (title: "Guidex Consulting — Step-by-step guides for living and working in Dubai")

**Remaining item:** HTTP → HTTPS redirect not yet enabled (Cloudways panel toggle). HTTP returns 200 instead of 301.

---

## 2026-04-27 — Admin auth debug + fix (production)

**Problem:** Admin login returned "Invalid email or password" despite bcrypt compare being true.
**Root cause:** `reset-admin-credentials.sh` wrote the bcrypt hash with bare `$` signs to `.env.local`. The debug script read the file directly (bypassing dotenv-expand) so bcrypt compared true. But Next.js loads `.env.local` through `dotenv-expand`, which treats `$<letters>` as env var references and expands them to empty string — corrupting the hash.
**Fix:** `runtime-env-diag.sh` — used `@next/env loadEnvConfig` to confirm corruption, re-escaped every `$` as `\$` in .env.local, PM2 restarted, NextAuth callback returned success.

**Rule confirmed:** bcrypt hashes in .env.local MUST escape `$` as `\$`. This is now documented in CLAUDE.md.

---

## 2026-04-27 — Backup/sync workflow + deployment docs (Phase 11 completion)

**Files created/updated:**
- `scripts/db-backup-from-server.sh` — pulls production DB to `backups/production-db/` with timestamp + latest symlink
- `scripts/db-restore-to-server.sh` — restores local backup to server; requires typed `YES`; creates server-side timestamped backup first; restarts PM2
- `backups/production-db/.gitkeep` — directory tracked in git; actual `.db*` files excluded
- `.gitignore` — added `data/guides.db.backup-*` and `backups/production-db/*.db*`
- `docs/deployment-cloudways.md` — full rewrite: accurate server paths, source-of-truth rules, PM2 commands, domain-switch procedure, troubleshooting
- `CLAUDE.md` — added "Deployment and Source-of-Truth Rules (locked)" section

**Rules established:**
- Cloudways is runtime only — not source of truth
- Code → GitHub; production DB → local backups; secrets → out-of-band
- Never overwrite production DB without server-side backup (enforced by restore script)
- NEXT_PUBLIC_* domain change requires rebuild — documented in deploy doc

---

## 2026-04-27 — Production deployment to Cloudways (Phase 11)

**Server:** Cloudways DigitalOcean VPS — 157.245.207.99 — app ID dgcmdxxpjx
**Temporary URL:** https://phpstack-1618074-6379172.cloudwaysapps.com/

**Steps completed:**
- nvm v0.40.1 installed under master user; Node v20.20.2 (LTS) + PM2 v6.0.14 installed
- rsync: 150 files uploaded to `/home/master/applications/dgcmdxxpjx/public_html/`
- `data/guides.db` uploaded (124K), permissions 664
- `.env.local` created on server with 5 production vars (NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → temporary Cloudways URL), permissions 600
- `npm ci`: 428 packages, 0 errors
- `npm run build`: 38/38 pages, 0 TypeScript errors, 0 build errors
- PM2 started via `~/start-guidex.sh` (sources nvm, cd to app, PORT=3000); 0 restarts, 0 errors
- `pm2 save` completed
- `.htaccess` written: `RewriteRule ^(.*)?$ http://127.0.0.1:3000/$1 [P,L]`
- Cloudways Support enabled `mod_proxy_http` — Apache reverse proxy now live
- Cloudways placeholder `index.php` renamed to `index.php.placeholder` (backup: `index.php.bak`)
- Cloudways Nginx cache purged from control panel

**Smoke test result (all 200):**
- / → Guidex Next.js homepage (html lang="en", inter font, logo-header.png) ✅
- /guides ✅ | /guides/employment-visa ✅ | /guides/golden-visa-dubai-property ✅
- /contact ✅ | /admin/login ✅ | /robots.txt ✅ | /sitemap.xml ✅

**Response headers confirm Next.js:** `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`

---

## 2026-04-26 — Guidex Consulting brand integration (Phase 10)

**Assets:** Resized from `/Users/batyr/Desktop/GUIDEX/logos/` → `public/brand/` (logo-header.png 480×120, logo-header-dark.png 480×120, logo-mobile-compact.png 330×110, android-chrome-192×192, android-chrome-512×512). Used Pillow for RGBA-preserving favicon resize (sips strips alpha). Created multi-size ICO (16/32/48px) using Python struct writer.

**Files changed:**
- `components/Header.tsx` — replaced "Dubai Guide" text with `<Image src="/brand/logo-header.png" width={120} height={30} priority />`
- `components/Footer.tsx` — © Guidex Consulting
- `app/layout.tsx` — title → "Guidex Consulting — …"
- `app/(public)/find-my-visa/page.tsx` — metadata title + eyebrow label
- `app/admin/layout.tsx` — admin brand label
- 9 other page files — all `— Dubai Guide` metadata suffixes → `— Guidex Consulting`
- `app/(public)/about/page.tsx` — description updated
- `app/favicon.ico` — replaced with Guidex icon (3-size ICO: 16/32/48px, RGBA)
- `app/icon.png` — Guidex transparent icon 192×192 (Next.js metadata icon)
- `app/apple-icon.png` — Guidex favicon-master 180×180

**Build:** 38 pages, 0 errors. "Dubai Guide" text: 0 remaining occurrences. Added `app/manifest.ts` → `/manifest.webmanifest` (android-chrome icons wired). All logos re-saved as RGB (no unused alpha) for 5–9% additional size reduction. Missing assets added: `logo-wordmark.png` (57KB, 480×160), `icon-g-transparent.png` (62KB, 256×256).

---

## 2026-04-25 — Full launch-prep audit + guide list / calculator / visas hub fixes

**Bugs found and fixed:**

1. **guides/page.tsx — redirect slug duplication (HIGH):** All 15 DB guides were shown in the list including the 4 individual spouse/child slugs that redirect to group pages. Users saw 4 duplicate family visa cards with redirect links. Fix: filter out REDIRECT_SLUGS, inject 2 synthetic group-page entries (spouse + child group), sort within each category alphabetically by slug.

2. **RouteFinderFlow.tsx — calculator linked to redirect slugs (MEDIUM):** "View Step-by-Step Guide →" button for family visa results linked to `/guides/spouse-dependent-visa-dubai-outside-country` etc., causing an extra redirect hop. Fix: import GROUP_HREFS from lib/guide-groups, resolve canonical group URLs before falling back to /guides/${slug}.

3. **visas/page.tsx — outside-UAE employment visa missing (MEDIUM):** The /visas hub only showed the inside-UAE employment visa guide. Users outside the UAE had no entry point to the outside-UAE guide from this hub. Fix: split into two separate cards — "Employment Visa — Inside UAE" and "Employment Visa — From Abroad".

4. **lib/guide-groups.ts — added GROUP_HREFS and REDIRECT_SLUGS exports:** Centralised data for the above fixes. GROUP_HREFS maps variant slugs to canonical group page URLs. REDIRECT_SLUGS is the Set used for filtering in the guide list.

**Build:** Clean — 35 pages, 0 TypeScript errors.

**Other audit findings (not fixed — owner action or future):**
- data/guides.db still tracked in git (needs `git rm --cached data/guides.db`)
- Contact page social handles (instagram.com/dubaiguide, facebook.com/dubaiguide) need owner verification
- ROADMAP.md severely stale (still shows Phase 7 as "Sitemap — future")
- BrowseByService.tsx and QuickDecisionCards.tsx are unused leftover components (safe to delete or keep)
- No analytics yet (non-blocking for soft launch)

---

## 2026-04-25 — Phase 6 launch-readiness audit and implementation

**Technical SEO:**
- `app/sitemap.ts` — dynamic sitemap (12 static pages + 11 guide pages; 4 redirect slugs excluded)
- `app/robots.ts` — allows `/`, blocks `/admin/` and `/api/auth/`, links to sitemap
- `app/layout.tsx` — `metadataBase` added (fixes canonical + og:url)
- `next.config.ts` — 4 group-guide redirects changed from `permanent: false` → `permanent: true`

**Deployment readiness:**
- `.env.example` — documents 5 required env vars including `NEXT_PUBLIC_SITE_URL`
- `docs/deployment-cloudways.md` — full VPS deploy guide (git/rsync, npm install, build, PM2, nginx, DB backup, re-deploy workflow)
- `.gitignore` — `data/guides.db` added (was missing; only WAL sidecars were excluded)
- Manual action still required: `git rm --cached data/guides.db` (pending user approval)

**Cleanup:**
- `public/` — 5 Next.js boilerplate SVGs removed (file, globe, next, vercel, window)

**Build result:** Clean — 35 pages, 0 TypeScript errors. sitemap.xml and robots.txt both static ○.

**Verdict:** Ready for soft launch. Blocking items: `git rm --cached data/guides.db` + domain/DNS.

---

## 2026-04-25 — Phase 5 guide content compression

Script: `scripts/phase5-content-cleanup.ts` — 34 DB writes (9 guide rows, 25 step rows) across 14 of 15 guides. golden-visa-dubai-property was already clean.

**Price/Timeline fields shortened (were multi-sentence paragraphs):**
- amer-center-dubai, document-attestation-dubai, open-business-bank-account-dubai, pro-services-dubai, renew-family-visa-dubai

**Summaries compressed (removed "A step-by-step guide to..." / "A practical guide to..." openers):**
- amer-center-dubai, child x2, document-attestation-dubai, employment-visa-dubai-outside-uae, free-zone-company-setup-dubai, mainland-company-setup-dubai, newborn-visa-dubai, open-business-bank-account-dubai, pro-services-dubai, renew-family-visa-dubai

**Audiences tightened:**
- amer-center-dubai, free-zone-company-setup-dubai, mainland-company-setup-dubai, newborn-visa-dubai, open-business-bank-account-dubai, renew-family-visa-dubai

**Overviews rewritten (removed "This route is for..." / "To sponsor...from outside" openers):**
- child x2, spouse x2, employment-visa-dubai-outside-uae

**Step-level changes:**
- employment-visa-dubai-outside-uae: all 7 step titles standardized to title case; EIDA → ICA; Step 4 warning trimmed
- employment-visa (inside): Step 2 advice — informal "It's" fixed, reworded; Step 5 advice — "Arrive early — clinics are busy" removed
- mainland-company-setup-dubai: Step 1 warning trimmed; Step 4 what — definition of initial approval tightened
- newborn-visa-dubai: Step 3 advice — long question form rewritten; Step 5 advice — "confirm with branch" removed
- spouse-dependent-visa-dubai-inside-country: Step 3 advice — conditional → imperative; Step 4 advice — non-advice removed
- spouse-dependent-visa-dubai-outside-country: Step 7 warning — useless "make sure all previous steps..." removed
- document-attestation-dubai: Step 2 what — "this is the step that makes it legally recognized" filler removed
- amer-center-dubai: Step 1 address — shortened; Step 3 advice — "confirm the total before paying" removed
- pro-services-dubai: Step 1 what — trimmed to remove duplicate of overview
- free-zone-company-setup-dubai: Step 6 warning — "submitted and processed" → "submitted"

## 2026-04-24 — Phase 4 copy compression + premium visibility pass

**Copy compressed:**
- `Hero.tsx`: subtitle "Official steps and real government fees — no guesswork" → "Official fees and exact steps — no guesswork"; text-gray-500 → text-gray-600
- `HowItWorks.tsx`: item 2 description — removed "No jargon, no vague overviews." opener (echoed the label)
- `FreeAdviceCta.tsx`: heading "Need help with your specific situation?" → "Not sure which route applies?"; body removed echo of "no jargon/no sales pitch" — now action-oriented
- `about/page.tsx`: 3 paragraphs tightened — removed "This site is a practical reference" framing; last para condensed to 2 sentences
- `visas/family/page.tsx`: card descriptions shortened — removed sub-item lists (GDRFA, Amer, medicals, Emirates ID enumerated twice); hub summary de-duplicated "both inside-UAE and outside-UAE"
- `government/page.tsx`: hub description "the government-facing layer behind most visa and business procedures" → "The three services that underpin most visa and company filings"
- `company-setup/page.tsx`: 3 route card descriptions compressed; processSteps intro paragraph removed; compare note "If your customers are UAE businesses..." → "UAE customers → mainland. International, digital, or remote → free zone."
- `GuideTabs.tsx` + `guides/[slug]/page.tsx`: footer CTA body "We handle the paperwork and government submissions for you" → "We manage government submissions, medicals, and filings on your behalf"
- `RouteFinderFlow.tsx`: "Talk to an expert on WhatsApp →" → "Ask an expert on WhatsApp →"; advisor CTA "Contact Us on WhatsApp →" → "Message Us on WhatsApp →"

**Visibility improved:**
- All hub card descriptions: text-gray-500 → text-gray-600 (visas, family, government)
- Company hub card descriptions: text-sm text-gray-500 leading-relaxed → text-[13px] text-gray-600 leading-snug
- Company hub compare row labels: text-gray-500 → text-gray-600
- Company hub process step text: text-gray-700 → text-gray-800
- Company hub footnotes: text-xs text-gray-400 → text-[12px] text-gray-500

**Golden hub polished:**
- `visas/golden/page.tsx`: hub description "5 or 10-year" → "10-year" (more decisive); section label "Other Routes — Ask Us Directly" → "Ask about these routes"; WhatsApp badge style: gray pill → navy/70 with white text (more visible, clearly actionable)

## 2026-04-23 — Phase 3 UX redesign complete

**Employment visa outside UAE — published and wired:**
- `scripts/publish-employment-visa-outside.ts` ran: `employment-visa-dubai-outside-uae` set to published=1
- `lib/route-finder-config.ts`: `r-employment-outside` changed from advisor to guide resolution with `guideSlug: "employment-visa-dubai-outside-uae"`
- `"employment-visa-dubai-outside-uae"` added to `CALCULATOR_GUIDE_SLUGS`

**Golden visa hub — rebuilt as 4-route hub:**
- `app/(public)/visas/golden/page.tsx`: 1-guide thin page → proper 4-route hub
- Property route: live guide link
- Professional, Business Investor, Special Talent: WhatsApp CTA cards with pre-filled message
- Footer: "Not sure which route?" WhatsApp advisor CTA

**Mobile visibility pass:**
- `components/RouteSnapshotBand.tsx`: audience text `text-gray-500` → `text-gray-600`
- `components/HowItWorks.tsx`: description text `text-gray-500` → `text-gray-600`
- `components/TopicCard.tsx`: summary text `text-gray-500` → `text-gray-600`

**Maid Visa — dead-end removed:**
- `components/PrimaryServices.tsx`: "Soon" div → WhatsApp link with pre-filled "maid visa" context
- Added `external?: boolean` to `ServiceItem` type; external items render as `<a target="_blank">`

**Tap target fix:**
- `components/PrimaryServices.tsx`: "All →" links `py-1` → `py-2.5 pl-4`

## 2026-04-23 — Full-site QA sweep pass 2 (11 issues, all fixed)

**Clickability fixes:**

`components/GuideTabs.tsx`:
- Replaced lone "← All guides" (18px tap target) with breadcrumb+calculator row matching guide detail pages
- Both links get `px-1 py-3` — consistent with [slug]/page.tsx pattern
- Tab switch buttons: `py-2` (36px) → `py-3` (44px minimum)

`app/(public)/visas/page.tsx`, `visas/family/page.tsx`, `visas/golden/page.tsx`, `company-setup/page.tsx`:
- All back links: no padding (18px) → `py-3 -mt-1` (42px, preserving visual rhythm)

**Content duplication fixes:**

`app/(public)/page.tsx`:
- Removed "Guides" section (7th homepage section showing 3 recent TopicCards)
- Removed `TopicCard` import and `getRecentPublishedGuides` call
- Added single "Browse all guides →" link with `py-3` tap target
- RouteSnapshotBand already provides guide discovery — second card list was redundant, likely overlapping
- Homepage now has 6 logical sections instead of 7

`components/HowItWorks.tsx`:
- Item 1 "Real process, real costs / Government fees and timelines from official sources" → "Official sources only / Fees and steps are traced to GDRFA, ICA, MOHRE, DED, and Amer — not estimated."
- Previous text repeated Hero's "Official steps, real government fees" claim exactly
- New text names the specific authorities — genuinely different information from the Hero

**Consistency fixes:**

`app/(public)/find-my-visa/page.tsx`:
- H1: "Find Your Route" → "Find My Route" — now matches header nav, mobile header, sticky CTA, homepage card

`components/RouteFinderFlow.tsx`:
- Step counter: `state.answers.length + 1` → `startFlow ? state.answers.length : state.answers.length + 1`
- When startFlow pre-answers Q1, user's first visible question is Q2 — now correctly shows "Step 1"
- Without startFlow, normal flow: Q2 = Step 2, Q3 = Step 3 (unchanged)

Build: 31/31 clean.

---

## 2026-04-23 — Full-site QA sweep and cleanup pass

**Issues found and fixed (5 of 10):**

`components/GuideHeader.tsx`:
- Removed `import Link` and the "← All guides" back link
- The guide page's own breadcrumb row (added in discoverability pass) already handles this
- Duplicate back links on every guide page — eliminated

`components/FreeAdviceCta.tsx`:
- Heading: "Not sure which route applies to you?" → "Need help with your specific situation?"
- Previous heading was the exact same question the calculator answers — two consecutive homepage sections competing for the same user need
- Now clearly positioned as human escalation (WhatsApp), not route selection (calculator)

`components/Header.tsx`:
- Added mobile-only "Find My Route" link between logo and WhatsApp button
- Uses `self-stretch flex items-center` — full 56px (h-14) tap area across the header height
- Marked `sm:hidden` — desktop nav already shows the full link set
- Mobile users previously had ZERO navigation beyond logo and WhatsApp on any non-homepage page
- Active state uses same `isActive()` logic as desktop nav

`app/(public)/guides/[slug]/page.tsx`:
- Breadcrumb link tap targets: `py-2` (34px) → `py-3` (42px)
- Below the 44px minimum — fixed

`components/CtaCard.tsx`:
- Link: `text-xs` with no padding (18px tap target) → `text-sm py-3 -mb-1` (~42px tap target)
- Used on every guide detail page and /company-setup as the bottom CTA
- Previously effectively untappable on mobile

**Issues found but NOT fixed (5 remaining):**
- Issue 6: RouteSnapshot "Where to start" previews step 1 content which reappears in full below — intentional design, leave
- Issue 7: "Property Visa" alongside "Golden Visa" in PrimaryServices — minor, acceptable shortcut for property-route users
- Issue 8: /visas and /visas/family both have calculator CTAs in sequence — separate pages, not competing
- Issue 9: CtaCard uses `<a>` for internal links instead of `<Link>` — minor perf, not UX
- Issue 10: RouteSnapshotBand links employment-visa directly while PrimaryServices routes it to route finder — different sections with different purposes

Build: 31/31 clean.

---

## 2026-04-23 — Route-selection UX reset

**What changed:**

`components/RouteFinderFlow.tsx`:
- Added `startFlow?: string` prop
- Added `buildInitialState(startFlow)` — finds matching Q1 option, initializes FlowState at Q2 with Q1 pre-answered
- `useState` changed to lazy initializer `() => buildInitialState(startFlow)`
- Back from Q2 correctly returns to Q1 (Q1 answer is in state.answers); reset goes to Q1 unconditionally

`app/(public)/find-my-visa/page.tsx`:
- Now async with `searchParams: Promise<{ flow?: string }>`
- Reads `flow` param, passes as `startFlow` to RouteFinderFlow
- Page is now ƒ (dynamic) — appropriate for a tool page reading URL params

`components/PrimaryServices.tsx` — 4 link changes (ambiguous → route finder with pre-selected flow):
- Employment Visa: `/guides/employment-visa` → `/find-my-visa?flow=employment`
- New Family Visa: `/visas/family` → `/find-my-visa?flow=family-new`
- Golden Visa: `/visas/golden` → `/find-my-visa?flow=golden`
- Company Setup: `/company-setup` → `/find-my-visa?flow=company`
- Kept direct: Renew, Newborn, Property Visa, Mainland, Free Zone, Bank Account, Government items (all unambiguous)

`app/(public)/page.tsx`:
- Brass card headline: "Not sure where to start?" → "Find My Route"
- Now one label for the tool everywhere (nav, sticky CTA, guide pages, homepage card)

`app/(public)/guides/[slug]/page.tsx`:
- Added `py-2 px-1` to both breadcrumb links — fixes 18px tap target → ~44px on mobile

Build: 31/31 clean. `/find-my-visa` now ƒ (dynamic).

---

## 2026-04-22 — Calculator discoverability pass

**What changed:**

`app/(public)/page.tsx`:
- Added inline calculator entry section between PrimaryServices and FreeAdviceCta
- Brass-bordered card ("Not sure where to start? / Answer 2–3 questions") — visible on initial page load, both desktop and mobile
- Fixes: homepage had zero in-page calculator presence; FreeAdviceCta was absorbing unsure users with WhatsApp instead of sending them to self-serve tool first

`app/(public)/visas/page.tsx`:
- Added slim "Not sure which visa applies to you? Find your route" link above hub cards
- Same stone-50 bordered pattern as /visas/family and /visas/golden

`app/(public)/guides/[slug]/page.tsx`:
- Added `import Link from "next/link"`
- Added breadcrumb+calculator row at top of every guide detail page
- "← All guides" (left) + "Find my route →" (right in brass)
- Gives users an escape route if they landed on the wrong guide

Build: 31/31 pages, clean.

---

## 2026-04-22 — Sticky mobile CTA QA polish

**What changed:**

`components/StickyRouteCta.tsx`:
- Removed `if (!visible) return null` — bar is always in the DOM after pathname check
- Bar now slides in via `translate-y-full → translate-y-0` with `transition-transform duration-200`
- Replaces snap-in with a smooth slide-up; feels native rather than pop-up

`app/(public)/layout.tsx`:
- `pb-16` → `pb-20` — 80px bottom padding on main (was 64px)
- 64px gave only ~4px clearance above the bar's edge; 80px gives a comfortable 20px buffer

Build: 31/31 pages, clean.

---

## 2026-04-22 — Sticky mobile CTA

**What changed:**

`components/StickyRouteCta.tsx` (new):
- Mobile-only sticky bottom bar linking to `/find-my-visa`
- Hidden on `/find-my-visa` itself via `HIDDEN_ON` list + `usePathname()`
- Appears after 100px scroll via `useEffect` + scroll listener (`passive: true`)
- `position: fixed; bottom: 0` — zero CLS (out of document flow)
- `sm:hidden` — desktop nav already shows "Find My Route"
- `z-40` — below sticky header (`z-50`)
- `env(safe-area-inset-bottom)` — iPhone home indicator safe area

`app/(public)/layout.tsx`:
- Added `StickyRouteCta` import and render after `<Footer />`
- Added `pb-16 sm:pb-0` to `<main>` — prevents footer from hiding under bar on mobile

Build: 31/31 pages, clean.

---

## 2026-04-22 — Calculator v1 QA + polish pass

**What changed:**

`lib/route-finder-config.ts`:
- `whatsappHref` added to `RouteFinderConfig` interface + object — WhatsApp URL now lives in config, not component
- `ctaLabel?: string` added to `HubResolution` — hub CTA button text is now config-controlled per resolution
- Q2-emp-loc options: "I am in the UAE" / "I am outside the UAE" → "In the UAE" / "Outside the UAE" (shorter, mobile-friendly)
- Q2-golden question: "What is the basis for your Golden Visa?" → "How are you applying for a Golden Visa?" (removes bureaucratic "basis")
- Q2-golden option: "I am a professional, executive, or investor" → "...or senior talent" (removes ambiguous "investor")
- Q2-golden option: "I am not sure" → "I am not sure which route applies to me" (clearer prompt)
- Q2-company options: free zone parenthetical "(zone-based, simpler)" → "(100% ownership, export-focused)" (honest differentiator); mainland gains parenthetical "(DED-licensed, trade anywhere in the UAE)"
- r-family-outside fact 1: "Your family member applies from outside the UAE" (restated what user said) → "Your family member travels to Dubai after the entry permit is approved" (new information: the mechanism)
- r-family-inside fact 1: "Your family member is already in the UAE" (restated) → "No departure required — your family member stays in the UAE throughout" (the key benefit)
- r-employment-inside fact 1: "You are already in the UAE on any visa status" (restated) → "This route applies to mainland Dubai employers only — free zone employees follow a different process" (eligibility gate)
- r-employment-outside heading: removed em-dash from "... — Guide Coming Soon"; new heading "Employment Visa: Outside UAE Route" + body trimmed
- r-hub-company: added `ctaLabel: "Compare Your Options →"` (more specific than the generic "See All Routes →")

`components/RouteFinderFlow.tsx`:
- `WHATSAPP_HREF` constant removed from component; now reads `ROUTE_FINDER_CONFIG.whatsappHref`
- `BackLink` and `ResetLink` inner component functions removed (React anti-pattern); replaced with `backButton` and `resetButton` JSX variables
- Empty `h-8` container on Q1 removed; back+progress row now renders only when `hasAnswers` is true (eliminates 32px wasted space on first question)
- Back button tap target: `py-1` (28px) → `py-3` (44px minimum) in both question and result states
- Reset button tap target: `py-2` → `py-3`
- Secondary CTA `py-1` → `py-2` for slightly better tap area
- Hub CTA now uses `resolution.ctaLabel ?? "See All Routes →"` — config-driven per resolution

**Build:** Clean — 31 pages, TypeScript clean, /find-my-visa ○ Static.

**Mobile UX flag (owner decision needed):** "Find My Route" is in the `hidden sm:flex` nav — invisible on mobile viewports. Discovery on mobile is via hub page CTAs only. Recommend adding a visible entry point on the homepage (PrimaryServices or Hero) in a future pass.

---

## 2026-04-22 — Calculator v1 implemented (/find-my-visa live)

**What was built:**
- `lib/route-finder-config.ts` — full config: 6 question nodes, 13 resolution states, supporting service injection
- `components/RouteFinderFlow.tsx` — `'use client'` generic renderer; manages question stack + context state
- `app/(public)/find-my-visa/page.tsx` — static SSR page; pre-fetches all 14 guide slugs server-side
- `components/Header.tsx` — "Find My Route" added as first nav item
- `app/(public)/visas/family/page.tsx` — "Find My Route" CTA added above guide cards
- `app/(public)/visas/golden/page.tsx` — "Find My Route" CTA added above guide cards
- `app/(public)/company-setup/page.tsx` — "Find My Route" CTA added above route cards

**Architecture:**
- Config (no DB deps) imported directly by the client component
- Guide data (price/timeline/title) fetched server-side via `getPublishedGuidesForBand`; passed to client as `Record<string, CalcGuideData>`
- Context carries `familyType` (spouse/child) from Q2 to resolve the correct slug at the result card
- `guideSlugByContext` pattern handles the family inside/outside resolution split
- No public API endpoint. No hardcoded fees. No email gate.

**Route coverage:**
- family-new (spouse/child × outside/inside) → 4 guide resolutions
- family-renew → 1 guide resolution
- newborn → 1 guide resolution
- employment inside UAE → 1 guide resolution
- employment outside UAE → advisor (guide coming soon)
- golden property → 1 guide resolution
- golden professional/unsure → hub resolution
- mainland/freezone/bankaccount → 3 guide resolutions
- company unsure → hub resolution
- other/advisor → catch-all

**Build:** Clean — 31 pages, TypeScript passed, `/find-my-visa` ○ Static.

**Mismatch check:** Zero mismatches. All 14 DB slugs confirmed published before build.

---

## 2026-04-22 — Calculator spec v2 (route-finder-calculator-spec-v1.md rewritten)

**What changed:** Full strategic audit of current 14-guide coverage against calculator v1 feasibility. Spec rewritten from scratch with implementation-ready config, complete Q1→Q3 question tree, all resolution states, supporting service injection logic, and company setup sub-tree (absent in v1.0).

**Key decisions:**
- Q1 options: family-new / family-renew / newborn / employment / golden / company / other (7 top-level paths)
- Max 3 questions before result — hard limit
- Employment outside UAE: resolves to advisor (no guide yet) — does not fail silently
- Golden Visa: only property route (AED 2M) resolves to guide; all other golden routes → hub + WhatsApp
- Company setup added to Q1 — covered 3 guides + hub
- Supporting service injection: attestation appears on outside-country family routes; Amer on inside-country; PRO on company routes
- Pre-fetch all guide data server-side at page load (max 11 slugs) — no client-side fee fetching
- `guideSlugByContext` pattern for family inside/outside: single resolution record uses Q2 context (spouse/child) to pick correct slug

**Files changed:**
- `docs/route-finder-calculator-spec-v1.md` — complete rewrite (v2.0)

**Implementation readiness verdict:** Ready to build. All prerequisites met (14 guides live, fees audited, config fully defined, mobile interaction spec in interaction-patterns-mobile-first.md Pattern 4). Next step: create `lib/route-finder-config.ts` + `/find-my-visa` page + `RouteFinderFlow` component.

---

## 2026-04-22 — renew-family-visa-dubai published (pricing pass)

**Pricing fix:** "UAE government fees apply" replaced with "Residence visa renewal and Emirates ID fees vary by visa duration and family file status" — names the actual drivers of variation (duration and whether the family file needs updating), which is more useful than a generic disclaimer. Step 3 cost updated to match. Medical test fee (AED 250–450) retained as-is — well-supported range for GDRFA-approved centers.

**What changed:**
- `data/guides.db` — guide-level price and step 3 cost revised; published = 1
- `components/PrimaryServices.tsx` — Renew Family Visa: soon → href "/guides/renew-family-visa-dubai"

**Build result:** Clean. `[+11 more paths]` — renew-family-visa-dubai confirmed in generateStaticParams (was +10 before).

**Visas group in PrimaryServices now:** Employment Visa (live) + New Family Visa (live) + Renew Family Visa (live) + Newborn Visa (live) + Golden Visa (live) + Property Visa (live) + Maid Visa (soon). 6/7 live — only Maid Visa remaining as Soon.

---

## 2026-04-22 — Draft guide: renew-family-visa-dubai (4 steps, visas category)

**Scope:** In-country renewal of an existing family residence visa for a spouse or child already living in the UAE. Starts from checking renewal timing, covers medical fitness test for adults 18+ (children under 18 exempt), Amer submission, and EID delivery by post. Does NOT cover: first-time applications, outside-country re-entry, attestation (not needed at renewal), sponsor visa complications.

**Key distinction from first-time guides:** No entry permit, no change of status, no attestation of marriage/birth certificates, no Tasheel steps. Simpler route — medical (adults only) then Amer.

**What changed:**
- `scripts/create-renew-family-visa-guide.ts` (new) — one-time insertion script
- `data/guides.db` — 1 guide row + 4 step rows. Self-audit found 1 em-dash in step 2 advice; fixed.

**Guide details:**
- ID: 1faf6935-03c4-48c8-b53f-8835d91ddb9c
- Slug: renew-family-visa-dubai
- Category: visas
- Published: false (draft)
- Price: "AED 250–450 for medical fitness test (adults 18+ only). UAE government fees for visa + EID confirmed at Amer counter."
- Timeline: "4–7 working days for medical results plus Amer processing. Emirates ID by post 5–10 working days after visa approval."
- Steps: 4

**Step sequence:**
1. Check Renewal Timing and Requirements — no cost — 5–10 min
2. Complete Medical Fitness Test (adults 18+ only) — AED 250–450 — 1–3 working days for ICA upload
3. Submit Renewal at Amer — govt fees + Amer service fee — 30–60 min visit, 2–5 days processing
4. Collect Renewed Visa and Emirates ID — no fee — 2–5 days visa; 5–10 days EID by post

**Publish decision:** Draft. Medical fitness test fee (AED 250–450) is a well-known range for GDRFA-approved centers; other fees are honestly deferred to Amer counter. Recommend owner review before publishing.

**Build result:** Clean. `[+10 more paths]` unchanged — draft correctly excluded.

---

## 2026-04-22 — pro-services-dubai published (fee confidence pass)

**Fee fix:** Removed AED 150–350 range from step 3 cost (Dubai notary fees vary by center type and document complexity; range could be low for complex PoAs). Replaced with: "Notarized power of attorney: notary fees apply if required. Confirm the exact cost with the notary center before proceeding." Guide-level price was already clean.

**What changed:**
- `data/guides.db` — step 3 cost revised; published = 1
- `components/PrimaryServices.tsx` — PRO Services: soon → href "/guides/pro-services-dubai"

**Build result:** Clean. `[+10 more paths]` — PRO guide confirmed in generateStaticParams (was +9 before).

**Government group in PrimaryServices now:** Document Attestation (live) + Amer Services (live) + PRO Services (live). All 3 items live. Government pillar complete.

---

## 2026-04-22 — Draft guide: pro-services-dubai (5 steps, government category)

**Scope:** Service-provider orientation guide. Explains what PRO services are, which government tasks they handle (license renewals, employee visa processing, MOHRE registrations, DED/free zone filings, attestation), how to find and vet a provider, and how the engagement workflow runs. Explicitly notes PRO fees are set by the provider, not government-regulated. Does not cover any specific visa/license procedure in detail.

**What changed:**
- `scripts/create-pro-services-guide.ts` (new) — one-time insertion script
- `data/guides.db` — 1 guide row + 5 step rows inserted. Self-audit found 5 em-dash issues and 1 sentence-count issue; all fixed.

**Guide details:**
- ID: 815e003d-c999-431a-baed-313c8fb8687c
- Slug: pro-services-dubai
- Category: government
- Published: false (draft)
- Price: "PRO service fees are set by the provider and are not government-regulated. Request written quotes from at least two providers before committing."
- Timeline: "PRO engagement typically 1–3 working days to set up. Transaction timelines depend on government department."
- Steps: 5

**Step sequence:**
1. Identify Tasks for PRO Handling — no cost — 30–60 min assess
2. Find a Reputable PRO Provider — no cost — 1–3 working days
3. Authorize and Engage Your PRO — LoA free; notarized PoA AED 150–350 — same-day to 2 days
4. Provide Documents to Your PRO — no additional fee — same-day handover
5. Review and Collect Outcomes — no fee — varies by transaction

**Publish decision:** Draft. Structure and content are clean. Notary PoA fee (AED 150–350) is a reasonable estimate for Dubai notary centers. Keep as draft for owner review of fee estimate before live indexing.

**Build result:** Clean. `[+9 more paths]` unchanged — draft correctly excluded from generateStaticParams.

---

## 2026-04-22 — amer-center-dubai published (fee confidence pass)

**Fee fix:** Removed AED 30–220 range (no official Amer tariff to back it; range was too wide to be useful and specific enough to be wrong). Replaced with honest structural wording: "Amer charges a typing/service fee per transaction in addition to the applicable UAE government fee." Step 3 cost updated to match. Em-dash also removed from price field.

**What changed:**
- `data/guides.db` — price field and step 3 cost revised; published = 1
- `components/PrimaryServices.tsx` — Amer Services: soon → href "/guides/amer-center-dubai"

**Build result:** Clean. `[+9 more paths]` — Amer guide confirmed in generateStaticParams (was +8 before).

**Government group in PrimaryServices now:** Document Attestation (live) + Amer Services (live) + PRO Services (soon). Two live items — group has real substance.

---

## 2026-04-22 — Draft guide: amer-center-dubai (4 steps, government category)

**Scope:** Service-center orientation guide. Covers how to use Amer centers for personal residency transactions (residence visas, Emirates ID, entry permits, status changes). Explicitly distinguishes Amer (personal residency) from Tasheel (employer/labor). Does not cover any single visa in full procedural detail — those live in dedicated guides. 4 steps: Book appointment → Gather documents → Visit Amer → Collect outcome.

**What changed:**
- `scripts/create-amer-center-guide.ts` (new) — one-time insertion script with existence guard
- `data/guides.db` — 1 guide row + 4 step rows inserted. Self-audit applied 7 fixes: em-dashes removed from overview, step 1 address, step 2 warning, step 3 advice; step 1/3/4 what fields compressed to 2 sentences.

**Guide details:**
- ID: 9b7f6b00-5f52-46d7-aa63-0badb30ea3e5
- Slug: amer-center-dubai
- Category: government
- Published: false (draft)
- Price: "Amer service fee varies by transaction (typically AED 30–220). UAE government fees are additional."
- Timeline: "1–5 working days for most transactions. Walk-in wait 30–90 minutes; appointment 10–20 minutes."
- Steps: 4

**Step sequence:**
1. Book Your Appointment — no booking fee — available within 1–3 working days
2. Gather Your Documents — AED 2–5 photocopies if needed — 15–30 min prep
3. Visit the Amer Center — AED 30–220 service fee + govt fees — 30–90 min total
4. Collect Your Outcome — no fee — 1–5 working days processing

**Publish decision:** Draft. Amer service fee range (AED 30–220) is an estimate based on known Amer pricing — Amer does not publish a single official tariff list. Guide structure is clean and SEO-ready; recommend owner review of fee range before publishing.

**Build result:** Clean. `[+8 more paths]` unchanged — draft correctly excluded from generateStaticParams.

---

## 2026-04-22 — document-attestation-dubai published (scope-tightened to 3 steps)

**Scope tightening decision:** Original 5-step structure overclaimed procedural authority for home-country steps (steps 1–3 in draft said "varies by country" in a step-card format that implies follow-in-order certainty). Restructured to 3 steps: Step 1 is an honest prerequisite framework (home-country chain overview + apostille decision point), Step 2 is the detailed UAE MOFA step (the only Dubai-specific, fee-certain part), Step 3 is collection.

**What changed:**
- `data/guides.db` — guide restructured from 5 steps to 3 steps; published = 1
- `components/PrimaryServices.tsx` — Government group added (3 items: Document Attestation live, PRO Services soon, Amer Services soon)

**Guide details:**
- Slug: document-attestation-dubai
- Category: government (first published guide in this category)
- Published: true
- Price: "AED 150 per document (UAE MOFA government fee, standard processing). Home-country fees vary by nationality."
- Timeline: "2–6 weeks end-to-end. Home-country 1–4 weeks; UAE MOFA 1–3 working days."
- Steps: 3

**Step sequence:**
1. Complete Home-Country Authentication — varies USD 20–80 (notary) + USD 30–100 (UAE Embassy) — 1–4 weeks
2. Submit to UAE MOFA — AED 150 standard — 1–3 working days
3. Collect the Attested Document — no fee — included in step 2

**Build result:** Clean. `[+8 more paths]` — attestation guide confirmed in generateStaticParams (was +7 before).

---

## 2026-04-22 — Draft guide: document-attestation-dubai (5 steps, government category)

**Scope:** Full attestation chain for foreign-issued personal and educational documents intended for UAE use. Standard route: notarization in home country → home Ministry of Foreign Affairs authentication → UAE Embassy stamp → UAE MOFA final attestation. Apostille route (for Hague Convention countries) covered in step 1 advice. Does not cover country-specific home-country procedures in detail.

**What changed:**
- `scripts/create-attestation-guide.ts` (new) — one-time insertion script with existence guard
- `data/guides.db` — 1 new guide row + 5 step rows inserted. Self-audit applied 8 fixes: em-dashes removed from summary, audience, step 1 address, step 4 where; step 2/3/4 titles shortened to ≤6 words; step 3 filler sentence removed.

**Guide details:**
- ID: c2731133-30a0-40d7-9cd8-2970358a2284
- Slug: document-attestation-dubai
- Category: government (first live guide in this category)
- Published: false (draft)
- Price: "AED 150 per document (UAE MOFA government fee, standard processing). Home-country fees vary by nationality — typically USD 50–200 total for home-country chain."
- Timeline: "2–6 weeks end-to-end. Home-country steps 1–4 weeks; UAE MOFA 1–3 working days."

**Step sequence:**
1. Notarize the Document in Your Home Country — varies USD 20–80 — 1–3 working days
2. Get Home Ministry Authentication — varies (often free) — 1–5 working days
3. Get UAE Embassy Stamp — varies USD 30–100 — 1–3 working days
4. Submit to UAE MOFA — AED 150 (standard) — 1–3 working days
5. Collect the Attested Document — no fee — included in step 4

**Publish decision:** Draft. Steps 1–3 describe home-country processes that vary by nationality and cannot be fully verified. Step 4 (MOFA fee AED 150) is confirmed. Recommend owner review before publishing; guide is structurally clean and procedurally accurate.

**Build result:** Clean. `[+7 more paths]` unchanged — draft correctly excluded from generateStaticParams.

---

## 2026-04-22 — newborn-visa-dubai published (fee audit pass)

**Audit result:** One wording error found in overview — "and the visa duration selected" removed (dependent visa duration is tied to sponsor's visa, not a user-selected option). Fees (Step 4: AED 510–762, Step 5: AED 385) confirmed as consistent with known Amer/ICA structures. No child-dependent-visa logic found (no attestation, no entry permit — correctly scoped to UAE birth).

**What changed:**
- `data/guides.db` — overview wording fix; `published = 1`
- `components/PrimaryServices.tsx` — Newborn Visa: `soon: true` → `href: "/guides/newborn-visa-dubai"`

**Guide details:**
- Slug: newborn-visa-dubai
- Published: true
- Price: "AED 900–1,500 (UAE government fees for residence visa and Emirates ID; varies by family file status). Consulate and birth registration fees are additional and vary by nationality."
- Timeline: "4–10 weeks from birth (depends on consulate passport speed)"

**Build result:** Clean — 25 pages. `[+7 more paths]` confirms newborn guide in generateStaticParams (was +6 before).

---

## 2026-04-21 — Draft guide: newborn-visa-dubai (6 steps, visas category)

**Scope:** Baby born IN Dubai to UAE resident parents. Starts from birth registration — not from foreign birth certificate attestation. No entry permit, no change of status. Distinct from both child dependent visa guides.

**What changed:**
- `scripts/create-newborn-visa-guide.ts` (new) — one-time insertion script with existence guard
- `data/guides.db` — 1 new guide row + 6 step rows inserted. Step 4 cost arithmetic error found and fixed in self-audit.

**Guide details:**
- ID: 754b7cf6-d2bd-4fb4-82e0-acf62961f69a
- Slug: newborn-visa-dubai
- Category: visas
- Published: false (draft)
- Price: "AED 900–1,500 (UAE government fees for residence visa and Emirates ID; varies by family file status). Consulate and birth registration fees are additional and vary by nationality."
- Timeline: "4–10 weeks from birth (depends on consulate passport speed)"
- Steps: 6

**Step sequence:**
1. Register the Birth at the Hospital — AED 50–100 — 1–3 working days
2. Register with Your Home Country's Consulate — varies — 1–5 days (+ 2–8 weeks for passport)
3. Collect the Child's Passport — included in Step 2 — 2–8 weeks
4. Apply for UAE Residence Visa at Amer — AED 510–762 — 2–5 working days
5. Apply for Emirates ID — AED 385 — 5–10 working days
6. Collect Residence Visa and Emirates ID — No fee — 2–5 working days

**Publish recommendation:** Owner review first. Fee values are estimated from known Amer/ICA structures — not confirmed from official newborn-specific sources. Guide is procedurally accurate but should be validated before publishing.

**Build result:** Clean — 24 pages. Draft excluded from generateStaticParams ([+6 paths] unchanged).

---

## 2026-04-21 — Bank account guide published + company-setup pillar fully live

**Audit fixes applied before publish (6 changes):**
- `en_summary`: reduced 3→2 sentences, removed "A guide to" opener
- `en_audience`: reduced 3→2 sentences
- Step 3 `en_where`: "Internal — your own business records" → "Your own business records" (removed em-dash)
- Step 4 `cost`: "AED 0–500" → "up to AED 500" (cleaner phrasing)
- Step 5 `en_where`: "Internal bank process — no action required..." → parenthetical form (removed em-dash)
- Step 8 `en_advice`: removed "builds a track record" (ongoing-operations drift)

**Published:** `open-business-bank-account-dubai` (`published = 1`)

**Files changed:**
- `data/guides.db` — guide published, 6 field fixes
- `app/(public)/company-setup/page.tsx` — Bank Account card: `soon: true` → `href: "/guides/open-business-bank-account-dubai"`. Hub intro updated: "All three guides are live."
- `components/PrimaryServices.tsx` — Bank Account: `soon: true` → live link

**Final guide fields:**
- Price: "No government fee. Minimum average monthly balance of AED 25,000–50,000 required (varies by bank and account tier)."
- Timeline: "2–6 weeks (varies by bank, compliance review, and business activity)"
- Published: true

**Build result:** Clean — 24 pages. [+6 more paths] confirms bank account guide in generateStaticParams.

**Company Setup pillar: FULLY LIVE**
- /company-setup hub — all 3 route cards active
- /guides/mainland-company-setup-dubai ✅
- /guides/free-zone-company-setup-dubai ✅
- /guides/open-business-bank-account-dubai ✅
- PrimaryServices Business Setup: all 3 live + Bank Account now live (4/4 live)

---

## 2026-04-21 — PrimaryServices v2: Employment Visa added, Government & Legal removed

**What changed:**
- `components/PrimaryServices.tsx` — Employment Visa added as first item in Visas group (live, → /guides/employment-visa). Government & Legal group removed entirely (was 5 items, all soon — hurt trust more than helped).

**Visas group now (7 items, 4 live):** Employment Visa → New Family Visa → Renew Family Visa (soon) → Newborn Visa (soon) → Golden Visa → Property Visa → Maid Visa (soon)
**Business Setup unchanged:** Company Setup → Mainland Company → Free Zone Company → Bank Account (soon)
**Government & Legal:** Removed. Returns when first real service is live.
**Build result:** Clean — 23 pages.

---

## 2026-04-21 — Homepage polish pass + WhatsApp CTA live

**What changed:**
- `components/Header.tsx` — WHATSAPP_HREF set to `https://wa.me/971506304817`. Added `target="_blank" rel="noopener noreferrer"` to WA link.
- `components/Hero.tsx` — WHATSAPP_HREF set live. Added WhatsApp SVG icon to CTA button. "Official process" → "Official steps" (tighter). Added `target="_blank"`.
- `components/FreeAdviceCta.tsx` — WHATSAPP_HREF set live. Added `target="_blank" rel="noopener noreferrer"`.
- `components/PrimaryServices.tsx` — Soon rows: `bg-white` → `bg-stone-50` (live/soon now clearly distinct). Dividers: `divide-stone-100` → `divide-stone-200` (more visible). Category label: `text-[11px]` → `text-[12px]`. Business Setup: added "Mainland Company" (live) + "Free Zone Company" (live) — now 3 live + 1 soon, matching Visas group weight.

**Business Setup now:** Company Setup hub + Mainland + Free Zone (all live) + Bank Account (soon).
**WhatsApp href:** `https://wa.me/971506304817` — same number in all 3 files.
**Build result:** Clean — 23 pages.

---

## 2026-04-21 — Homepage hard reset v3: service-first IA, WhatsApp header, new section order

**What changed:**
- `components/Header.tsx` — WhatsApp green pill button added (right side). Nav hidden on mobile (hidden sm:flex). TODO comment for actual number in file.
- `components/Hero.tsx` — H1 expanded to "Dubai Visas, Company Setup, and Government Services" (28px, up from 24px). Subheadline contrast improved (gray-600 vs gray-500). CTA changed from "Browse All Guides" → "Get Free Advice" (navy, links to /contact as WA placeholder). Removed `Link` import.
- `components/PrimaryServices.tsx` (new) — Full-width stacked service rows, 3 groups (Visas/navy, Business Setup/brass, Government & Legal/slate), 13 service items total, 4 live + 9 soon.
- `components/FreeAdviceCta.tsx` (new) — Navy card CTA block with WhatsApp green button. "Not sure which route applies to you?" Positioned after services.
- `app/(public)/page.tsx` — New section order: Hero → PrimaryServices → FreeAdviceCta → HowItWorks → RouteSnapshotBand → Featured Guides. Removed QuickDecisionCards and BrowseByService imports.
- `docs/homepage-hard-reset-v3.md` (new) — IA decision record.
- `docs/mobile-header-reset.md` (new) — Header decision record.

**Sections retired from homepage (components kept in codebase):**
- `QuickDecisionCards` — replaced by PrimaryServices
- `BrowseByService` — replaced by PrimaryServices

**Sections demoted (still present, lower in page):**
- `RouteSnapshotBand` — position 5 (was position 3)
- Featured Guides — position 6 (was position 5)

**Build result:** Clean — 23 pages. / remains static (○).

---

## 2026-04-21 — Draft guide: open-business-bank-account-dubai (8 steps, company-setup category)

**What changed:**
- `scripts/create-bank-account-guide.ts` (new) — one-time insertion script with existence guard.
- `data/guides.db` — 1 new guide row + 8 step rows inserted.

**Guide details:**
- ID: 31f0f98e-61d5-41df-952d-1409f5801e87
- Slug: open-business-bank-account-dubai
- Category: company-setup
- Published: false (draft)
- Price: "No government fee. Minimum average monthly balance of AED 25,000–50,000 required (varies by bank and account tier)."
- Timeline: "2–6 weeks (varies by bank, compliance review, and business activity)"

**Step sequence:**
1. Prepare Your Company Documents — No fee — 1 day
2. Choose the Right Bank — No fee — 1–2 days
3. Prepare Supporting Business Documents — No fee — 1–3 days
4. Submit the Bank Application — No fee / AED 0–500 — 1 day
5. Complete Compliance Review — No fee — 1–3 weeks
6. Attend the Bank Meeting if Required — No fee — 1–2 hours if required
7. Receive Approval and Activate the Account — No fee — 1–5 business days
8. Fund the Account — AED 25,000–50,000 min balance — same day

**Build result:** Clean. Draft not in generateStaticParams ([+5 paths] unchanged).

---

## 2026-04-21 — Free zone guide published + company-setup hub fully activated

**What changed:**
- `data/guides.db` — free-zone-company-setup-dubai published (`published = 1`).
- `app/(public)/company-setup/page.tsx` — Free Zone Setup route card converted from `soon: true` `<div>` to live `<Link href="/guides/free-zone-company-setup-dubai">`. Hub hero paragraph updated to reflect both guides live.

**Build result:** Clean — 23 pages. `/guides/[slug]` now shows [+5 more paths] confirming free zone guide in generateStaticParams.

**Company Setup pillar (2 of 3 routes live):**
- Mainland Company Setup → live
- Free Zone Company Setup → live
- Business Bank Account → coming soon

---

## 2026-04-21 — Draft guide: free-zone-company-setup-dubai (8 steps, company-setup category)

**What changed:**
- `scripts/create-freezone-company-guide.ts` (new) — one-time insertion script. Guard against re-running.
- `data/guides.db` — 1 new guide row + 8 step rows inserted.

**Guide details:**
- ID: ab3862e6-00b4-4b73-806d-277b19b38aeb
- Slug: free-zone-company-setup-dubai
- Category: company-setup
- Published: false (draft)
- Price: "AED 6,000–20,000+ per year (varies by free zone and package)"
- Timeline: "1–2 weeks (varies by free zone)"
- Steps: 8

**Step sequence:**
1. Choose Your Free Zone — No fee — 1–2 days (research)
2. Choose License Type and Activity — No fee at this stage — 1 day
3. Choose Package and Visa Quota — Included in package price — 1 day
4. Reserve the Company Name — AED 100–500 — 1–2 business days
5. Submit Application Documents — AED 500–2,000 (often included) — 1–3 business days
6. Pay the Setup Fees — AED 6,000–20,000+ — same day
7. Receive License and Documents — Included in Step 6 — 1–5 business days
8. Complete Post-License Steps — establishment card + bank account — 2–6 weeks for bank

**Build result:** Clean — 23/23 pages. Draft not exposed on public site.

---

## 2026-04-21 — Company Setup pillar fully live: publish + hub activation + nav + QDC

**What changed:**
- `data/guides.db` — mainland-company-setup-dubai published (`published = 1`).
- `app/(public)/company-setup/page.tsx` — Mainland Setup route card converted from coming-soon `<div>` to live `<Link href="/guides/mainland-company-setup-dubai">`. Added discriminated union type `Route`. Hub hero paragraph updated: "The mainland guide is live. Free zone and bank account guides are in progress." Free zone and Bank Account cards remain non-interactive with "Guide coming soon" badge.
- `components/Header.tsx` — "Company Setup" added between Visas and Guides: `[Visas | Company Setup | Guides]`. Active state: activates on `/company-setup` and any `/company-setup/*` path.
- `components/QuickDecisionCards.tsx` — "Find my route" → "Set up a company", href `/guides` → `/company-setup`. Icon updated to building SVG matching CategoryIcon company-setup style.

**Build result:** Clean — 23 pages. `/guides/[slug]` now shows [+4 more paths] (was [+3]) confirming mainland guide is in generateStaticParams.

**Company Setup pillar coverage (fully live):**
| Surface | What | Status |
|---|---|---|
| Header | Company Setup nav item | ✅ |
| Homepage QDC | "Set up a company" card → /company-setup | ✅ |
| BrowseByService | Company Setup → /company-setup | ✅ |
| /company-setup hub | Mainland card live, freezone + bank = soon | ✅ |
| /guides/mainland-company-setup-dubai | Public guide, 8 steps | ✅ |

---

## 2026-04-21 — Draft guide: mainland-company-setup-dubai (8 steps, company-setup category)

**What changed:**
- `scripts/create-mainland-company-guide.ts` (new) — one-time insertion script for the mainland company setup guide. Guard against re-running if slug exists.
- `data/guides.db` — 1 new guide row + 8 step rows inserted.

**Guide details:**
- ID: 2a0e5966-50fa-4f9f-8eff-aa5e22763c70
- Slug: mainland-company-setup-dubai
- Category: company-setup
- Published: false (draft)
- Price: "AED 12,000–25,000+ (government fees only)"
- Timeline: "2–4 weeks (without external approvals)"
- Steps: 8

**Step sequence:**
1. Choose Your Business Activity — No fee — 1 day
2. Choose Your Legal Structure — No fee at this stage — 1 day
3. Reserve Your Trade Name — AED 620–720 — 1–2 business days
4. Get Initial Approval — AED 100–1,000 — 1–3 business days
5. Register Your Office Lease — AED 220 + office rent — 1–2 business days
6. Obtain External Approvals — AED 500–15,000+ — 4–10 weeks (conditional step)
7. Submit the License Application — AED 8,000–20,000+ — 1–3 business days
8. Receive Your Trade License — Included in Step 7 — 1–3 business days

**Writing standard compliance:**
- Step 6 (external approvals) is conditional — "what" field opens with the condition and closes with "Most commercial and professional activities skip this step entirely."
- No em-dashes in any field
- All costs use official UAE fee ranges sourced from DED process
- Audience explicitly excludes regulated sectors

**Build result:** Clean — 22/22 pages. Draft not exposed on public site.

---

## 2026-04-21 — /company-setup hub: real product pillar (coming-soon routes)

**What changed:**
- `app/(public)/company-setup/page.tsx` (new) — static hub page. 5 sections: hub hero, 3 route cards, mainland-vs-freezone compare table, process overview (7 steps), CtaCard. All 3 route cards ("Mainland Setup", "Free Zone Setup", "Business Bank Account") are non-interactive `<div>` with "Guide coming soon" badge — no dead ends. Compare block is a 3-col grid table (label | Mainland | Free zone) covering 5 differentiators. Process overview is a numbered list with navy/10 step bubbles.
- `components/BrowseByService.tsx` — "Company Setup" updated from `soon: true` to `href: "/company-setup"` — now a live link.

**Why the page earns its keep before guides exist:**
- Compare table answers the primary decision (mainland vs free zone) with 5 concrete differentiators
- Process overview shows the full 7-step sequence that applies to both routes
- Bank account card explains the AED 25–50k balance requirement and 2–6 week timeline
- Zero filler sentences — every paragraph contains specific, actionable information

**Build result:** Clean — 22/22 pages. `/company-setup` renders as `○` (static).

---

## 2026-04-21 — BrowseByService section: broader service map on homepage

**What changed:**
- `components/BrowseByService.tsx` (new) — directory-style service section. Stone-50 full-section background (distinct surface from white card sections). Three groups: Visas, Business Setup, Government & Legal. Live items are `<Link>` at `text-gray-700 hover:text-gray-900`. Coming-soon items are non-interactive `<span>` at `text-gray-400` with a `bg-stone-200` "Soon" pill. No icons (intentional — icons are QDC's visual signature). 3-column grid on sm+, stacked on mobile.
- `app/(public)/page.tsx` — inserted BrowseByService after RouteSnapshotBand. Moved HowItWorks from position 4 to position 6 (after Featured Guides), per above-the-fold audit.

**Final homepage layer order:**
1. Hero — identity
2. QuickDecisionCards — fast action (primary, above fold)
3. RouteSnapshotBand — route comparison (specific routes)
4. BrowseByService — full service map (directory, stone-50 surface)
5. Featured Guides — read more (TopicCards)
6. HowItWorks — trust signals (moved later per audit)
7. CtaCard — conversion

**Service map destinations:**
| Service | Destination |
|---|---|
| Employment Visa | `/guides/employment-visa` ✅ |
| Family Visas | `/visas/family` ✅ |
| Golden Visa | `/visas/golden` ✅ |
| Maid Visa | Soon (non-link) |
| Newborn Visa | Soon (non-link) |
| Company Setup | Soon (non-link) |
| Bank Account | Soon (non-link) |
| Amer Services | Soon (non-link) |
| Attestation | Soon (non-link) |
| Legal Translation | Soon (non-link) |
| POA | Soon (non-link) |
| DLD Services | Soon (non-link) |

**Build result:** Clean — 21/21 pages.

---

## 2026-04-21 — Header nav cleanup: Visas | Guides, About/Contact to footer

**What changed:**
- `components/Header.tsx` — converted to `"use client"` to use `usePathname`. Nav reduced from `Guides | About | Contact` to `Visas | Guides`. Active state: active link gets `text-gray-900 font-medium`, inactive gets `text-gray-500 hover:text-gray-900`. Active logic: `pathname === href || pathname.startsWith(href + "/")`. Visas activates on `/visas` and all `/visas/*`. Guides activates on `/guides` and all `/guides/*`.
- `components/Footer.tsx` (new) — minimal footer: `© year Dubai Guide` left, `About | Contact` right. `text-xs text-gray-400`, border-t border-gray-100, py-6.
- `app/(public)/layout.tsx` — added `<Footer />` import and render below `<main>`.

**Active state verified across routes:**
- `/` → neither item active ✅
- `/visas` → Visas active ✅
- `/visas/family` → Visas active ✅
- `/visas/golden` → Visas active ✅
- `/guides` → Guides active ✅
- `/guides/[slug]` → Guides active ✅

**Build result:** Clean — 21/21 pages.

---

## 2026-04-21 — Hero compression: above-the-fold audit pass

**What changed:**
- `components/Hero.tsx` — removed eyebrow label ("Dubai Guide"), removed topic pills (5 pills all → /guides), removed secondary CTA ("Find My Route →" → /guides). Shortened h1 from `text-[28px]` to `text-[24px]`. Shortened subheadline from 2 lines to 1: "Official government fees and process — in plain English." Tightened padding from `pt-12 pb-10` to `pt-8 pb-5`. Reduced subheadline margin from `mb-7` to `mb-5`. Kept: h1, subheadline, primary CTA "Browse All Guides" → /guides.

**Above-the-fold result at 375px (iPhone SE, 611px below header):**
- Hero compressed: ~222px
- All 6 QuickDecisionCards + their section heading: ~275px
- Total: ~497px — **all 6 cards fully visible with ~114px to spare before fold**

**Build result:** Clean — 21/21 pages.

---

## 2026-04-20 — Phase 3: Visa hub pages (/visas, /visas/family, /visas/golden)

**What changed:**
- `app/(public)/visas/page.tsx` (new) — parent visa hub; static; lists Family, Golden, Employment as stone-50 cards with brass badges. Breadcrumb: ← All guides.
- `app/(public)/visas/family/page.tsx` (new) — static; lists spouse + child group pages as cards. Breadcrumb: ← Visas.
- `app/(public)/visas/golden/page.tsx` (new) — static; lists golden-via-property guide card + "more routes coming" note. Breadcrumb: ← Visas.
- `components/QuickDecisionCards.tsx` — "Get a Golden Visa" href updated from `/guides/golden-visa-dubai-property` → `/visas/golden`. Spouse/child cards kept at group pages (already act as focused hubs with inside/outside tabs).

**Verified (Step 1 — launch cleanup):**
- All 6 QuickDecisionCard destinations return 200 ✅
- RouteSnapshotBand shows 4 cards (all 4 BAND_SLUGS published) ✅
- No unpublished destination exposed from homepage ✅
- Group pages + redirects correct ✅

**Verified (Step 2 — sticky tabs):**
- GuideTabs sticky tab bar already live: `sticky top-14 z-10 bg-white -mx-5 px-5 py-3` ✅ (Phase 5.1, no change needed)

**Build result:** Clean — 21/21 pages. `/visas`, `/visas/family`, `/visas/golden` all render as `○` (static).

**Final live navigation flow from homepage:**
- "Sponsor my spouse" → `/guides/spouse-dependent-visa-dubai` (inside/outside tabs)
- "Bring my child to Dubai" → `/guides/child-dependent-visa-dubai` (inside/outside tabs)
- "Get a Golden Visa" → `/visas/golden` → `/guides/golden-visa-dubai-property`
- "Employment visa" → `/guides/employment-visa`
- "Newborn visa" / "Find my route" → `/guides` (safe fallback — no guide yet)

---

## 2026-04-20 — Phase 2.9: Featured Guides section (3 most recent, "See all →")

**What changed:**
- `lib/db/reader.ts` — added `getRecentPublishedGuides(limit)`: published only, sorted by `updatedAt` desc, hard limit passed by caller.
- `app/(public)/page.tsx` — replaced `getAllPublishedGuides()` with `getRecentPublishedGuides(3)`; replaced bare `<h2>` heading with brass overline + uppercase label pattern; added `border-t border-stone-100` separator from HowItWorks; added "See all guides →" brass text link below the 3 cards.

**Homepage layer logic (verified):**
1. QuickDecisionCards — quick decide
2. RouteSnapshotBand — compare routes (cost + timeline)
3. HowItWorks — understand the product
4. Featured Guides (3 cards + "See all →") — read full guides

**Build result:** Clean — 18/18 pages.

---

## 2026-04-20 — Phase 2 homepage upgrades: Hero, HowItWorks, CtaCard

**What changed:**
- `components/Hero.tsx` — Rewritten: h1 → "Dubai Visas and Procedures — Step by Step"; new subheadline (official process focus); topic pills reordered (Visas first); removed 4-item "Every guide includes" value grid; added primary CTA (navy, "Browse All Guides") + secondary CTA (brass text, "Find My Route →").
- `components/HowItWorks.tsx` (new) — 3-item vertical list with brass SVG icons: "Real process, real costs", "Step by step", "Always free". Added to homepage between RouteSnapshotBand and guide list.
- `components/CtaCard.tsx` (new) — Shared navy CTA card extracted from inline use in slug page and GuideTabs. Props: `heading`, `linkLabel`, `href` — all optional with defaults. Homepage uses custom heading "Have questions about your situation?".
- `app/(public)/page.tsx` — Replaced inline social links footer section with `<CtaCard>`.
- `app/(public)/guides/[slug]/page.tsx` — Replaced inline navy CTA block with `<CtaCard />`.
- `components/GuideTabs.tsx` — Replaced inline navy CTA block with `<CtaCard />`.

**Build result:** Clean — 18/18 pages.

**Next step:** Phase 2.9 — Featured Guides section (3 most recent, "See all →" link)

---

## 2026-04-20 — Launch skeleton complete: 6 guides published, sticky tabs, link audit

**What changed:**
- `data/guides.db` — 5 draft guides published (published=1); `last_updated` on child-inside corrected from ISO timestamp to "April 2026"
- `components/QuickDecisionCards.tsx` — Golden Visa card href corrected to `/guides/golden-visa-dubai-property` (held at `/guides` briefly during publish window; restored after guide went live)
- `components/GuideTabs.tsx` — Variant tab bar wrapped in sticky container: `sticky top-14 z-10 bg-white -mx-5 px-5 py-3 border-b border-stone-100`. The `-mx-5 px-5` bleed ensures the white background covers full column width when tabs stick. `top-14` matches public Header `h-14` (56px).

**Build result:** Clean — 18/18 pages. `generateStaticParams` now outputs 6 guide slugs (up from 1).

**Homepage audit — all QuickDecisionCard destinations return 200:**
| Card | Destination | Status |
|---|---|---|
| Sponsor my spouse | /guides/spouse-dependent-visa-dubai | ✅ 200 |
| Bring my child to Dubai | /guides/child-dependent-visa-dubai | ✅ 200 |
| Newborn visa | /guides | ✅ 200 (fallback — guide not yet written) |
| Get a Golden Visa | /guides/golden-visa-dubai-property | ✅ 200 |
| Employment visa | /guides/employment-visa | ✅ 200 |
| Find my route | /guides | ✅ 200 (fallback — calculator not yet built) |

**RouteSnapshotBand:** Expanded from 1 card to 4 cards automatically on publish — no code change needed.

**Launch skeleton definition met:**
- ✅ 6 published guides
- ✅ Group pages render published content
- ✅ Homepage Quick Decision Cards all point to live pages
- ✅ RouteSnapshotBand shows 4 routes with cost/timeline
- ✅ No broken links

**Next step:** Build hub pages (/visas/family, /visas/golden) or move to next UX improvement

---

## 2026-04-20 — QuickDecisionCards added to homepage

**What changed:**
- `components/QuickDecisionCards.tsx` (new) — 6-card 2-col grid; each card: 20px inline SVG icon (brass/70, no external lib), short label (≤4 words), white bg + stone-200 border at rest, stone-50 + stone-300 border on hover; min-height 56px for touch targets; all SVGs drawn on 20×20 viewport matching CategoryIcon stroke weight (1.5px, round caps). Cards are static — no DB dependency.
- `app/(public)/page.tsx` — imports QuickDecisionCards; renders between Hero and RouteSnapshotBand.

**Card destinations (current):**
| Card | Destination | Status |
|---|---|---|
| Sponsor my spouse | /guides/spouse-dependent-visa-dubai | Group page live |
| Bring my child to Dubai | /guides/child-dependent-visa-dubai | Group page live |
| Newborn visa | /guides | Guide not yet built |
| Get a Golden Visa | /guides/golden-visa-dubai-property | Draft — redirects when published |
| Employment visa | /guides/employment-visa | Published |
| Find my route | /guides | Calculator not yet built |

**Build result:** Clean — 0 TypeScript errors, 13/13 pages.

**Homepage order confirmed:** Hero (3231) → QuickDecision (6056) → RouteSnapshotBand (11113) → Guides (12522) — verified by byte position in HTML output.

**Next step:** Run /guide-content-qa on 5 draft guides, publish them — RouteSnapshotBand fills to 4 cards; golden visa and child/spouse QuickDecisionCards start routing to real content.

---

## 2026-04-20 — RouteSnapshotBand added to homepage; RouteSnapshot truncation tightened

**What changed:**
- `components/RouteSnapshot.tsx` — replaced word-boundary truncation with `truncateToSentence()`: finds the first sentence-ending `.!?` within [40, 150] chars, falls back to word boundary. "Where to start" on employment-visa guide now shows the full clean sentence instead of a mid-clause cut.
- `lib/db/reader.ts` — added `BandGuideItem` interface and `getPublishedGuidesForBand(slugs: string[])`: single DB query using `and + inArray` from drizzle-orm; returns guide-level fields only (no steps); respects published filter.
- `components/RouteSnapshotBand.tsx` (new) — section component; renders 1-col mobile / 2-col tablet+ grid; each card shows category, title (line-clamp-2), cost/timeline 2-col grid, audience (line-clamp-2), "Full guide →" link; slug→href mapping handles group guide URLs directly (no redirect hop for child/spouse slugs); returns null if no published guides match.
- `app/(public)/page.tsx` — imports RouteSnapshotBand and getPublishedGuidesForBand; `BAND_SLUGS` constant defines the 4 target routes; band renders between Hero and the existing guide list.

**Build result:** Clean — 0 TypeScript errors, 13/13 pages.

**Current state:** Band shows 1 card (employment-visa is the only published guide). The other 3 slugs (child, spouse, golden visa) are drafts — they'll appear automatically when published, no code change needed.

**What this enables:**
- Ad-traffic users see price/timeline for published routes without scrolling into the guide list
- Band is zero-maintenance: publishes a guide → it appears in the band automatically
- `RouteSnapshotBand` card design uses existing tokens (stone-50, border-stone-200, navy, brass) — no new CSS
- When all 4 target guides are published, the band shows a 2x2 grid on desktop

**Next step:** Run /guide-content-qa on 5 draft guides, publish them — band fills to 4 cards immediately

---

## 2026-04-20 — RouteSnapshot.tsx built and integrated on guide + group pages

**What changed:**
- `components/RouteSnapshot.tsx` (new) — fast-answer block: estimated cost, timeline, best for, where to start (step 1 what, truncated), step titles preview (first 4), "See all N steps ↓" anchor link, last updated date. Works in server and client component contexts (pure props, no server APIs).
- `components/GuideHeader.tsx` — stripped metadata grid (cost/timeline/audience/lastUpdated). Now renders: back link, category icon + label, h1, summary only. Interface reduced to `{ title, summary, category }`.
- `app/(public)/guides/[slug]/page.tsx` — imports RouteSnapshot, passes all guide fields; `GuideHeader` call updated to 3-field props; steps container gets `id="steps"` for anchor navigation.
- `components/GuideTabs.tsx` — imports RouteSnapshot; replaces inline metadata grid + lastUpdated with `<RouteSnapshot activeGuide.* />` that switches per active tab; steps container gets `id="steps"`.

**Build result:** Clean — 0 TypeScript errors, 13/13 pages.

**What this enables:**
- Ad-traffic users see cost/timeline/best-for/step-preview before the overview paragraphs on both individual guide pages and group guide pages
- "See all N steps ↓" anchor link works on both page types (targets `id="steps"`)
- RouteSnapshot switches live with the tab on group guide pages (client state update)
- Component is ready to be reused for the homepage Route Snapshot Band (Phase 2, Task 2.10 equivalent) — same props interface, same rendering

**Next step:** Run /guide-content-qa on 5 draft guides, then publish

---

## 2026-04-20 — Hybrid homepage and route page design system created

**What changed:**
- Created 3 new design blueprint docs:
  - `docs/homepage-blueprint-v2.md` — 8-section homepage with Route Snapshot Band as the fast-answer layer for ad traffic; replaces v1 as build reference
  - `docs/hybrid-route-page-blueprint.md` — 3 page-type patterns (group guide, individual guide, hub page); Route Snapshot Block defined as new component bridging fast and deep modes; sticky tab bar behavior specified
  - `docs/interaction-patterns-mobile-first.md` — 10 concrete patterns (touch targets, sticky tab, calculator flow, filter, CTA card, scroll behavior); build-ready CSS specs included

**Key design decisions:**
- Route Snapshot Block is the single highest-impact addition: one new component, inserted between guide header and overview, delivers cost/timeline/step-preview for ad traffic without changing the deep-content layer
- Sticky tab bar required for group guide pages — users mid-scroll must be able to switch variants
- No animations on any mobile interactive element (tab switch, calculator questions, filter) — instant transitions only
- Section 3 of homepage (Route Snapshot Band) is new — FamilyVisa.ae hides costs behind a calculator; we show them openly on the homepage

**Next step:** Execute Phase 1 guide publishing, then implement the Route Snapshot Block (highest ROI, lowest risk change)

---

## 2026-04-20 — Strategic planning complete: 10 planning documents created

**What changed:**
- Created 10 planning/strategy documents in `docs/`:
  1. `familyvisa-competitor-matrix.md` — 23-point structured analysis of FamilyVisa.ae
  2. `familyvisa-topic-inventory.md` — full topic map with USE NOW / VERIFY FIRST / DO NOT USE tiers
  3. `site-ia-upgrade-plan.md` — upgraded IA with hub URL structure and guide list upgrade plan
  4. `service-hub-architecture.md` — hub page component pattern and 9-section design spec
  5. `route-finder-calculator-spec-v1.md` — config-first calculator spec with TypeScript pseudocode
  6. `homepage-restructure-plan.md` — 7-section homepage plan with Phase 1 launchable subset
  7. `seo-vs-ux-balance-rules.md` — 10 explicit product rules governing SEO/UX tradeoffs
  8. `anti-copy-friction-plan.md` — anti-copy measures ranked by impact; calculator server-side as primary
  9. `content-migration-and-gap-plan.md` — current content state + 4-tier priority roadmap
  10. `implementation-roadmap-master.md` — 10-phase phased build plan from skeleton to Russian

**No code changes in this session block (pure planning).**

**Next step:** Phase 1 — run `/guide-content-qa` on 5 draft guides, publish them

---

## 2026-04-20 — Dubai Golden Visa property guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `golden-visa-dubai-property`
  - Title: "How to Get a Dubai Golden Visa Through Property (AED 2 Million Route)"
  - Category: visas | Price: AED 9,884.75 (main applicant) | Timeline: 4–8 weeks | Last updated: April 2026
  - 7 steps: property check → doc prep → valuation (if required) → DLD application → medical → Emirates ID → family sponsorship
  - Guide ID: b881b20c-e0df-45e3-b800-7dff8aa62269
  - Kept strictly separate from salary / entrepreneur / retirement Golden Visa routes

**Assumptions flagged:**
- Step 4 bundles DLD fees (AED 4,020) + residency permit (AED 2,856.75) + admin fees (AED 1,155) = AED 8,031.75 at submission. Actual timing of each fee may differ — confirm with DLD.
- Timeline "4–8 weeks" is an estimate; official DLD timelines are not specified in source material.
- Off-plan/mortgaged files noted as needing confirmation; not presented as universally approved.

**What was verified:**
- published=0 (draft)
- 7 steps with correct order, costs, and time_est
- Cost math: 8,031.75 + 700 + 1,153 = 9,884.75 ✓

**Next step:** Owner reviews in admin, runs /guide-content-qa, publishes if approved

---

## 2026-04-19 — Spouse visa group page created

**What changed:**
- `lib/guide-groups.ts` — added `spouse-dependent-visa-dubai` group config (same structure as child group)
- `app/(public)/guides/spouse-dependent-visa-dubai/page.tsx` (new) — identical pattern to child group page, GROUP_KEY adjusted
- `next.config.ts` — added two 307 redirects for spouse individual slugs → group URL with `?route=` param

**What was NOT changed:**
- `GuideTabs.tsx` — untouched
- `reader.ts` — untouched (`getGuideGroup` reused as-is)
- `StepCard.tsx` — untouched
- Any guide content — untouched

**What was verified:**
- Build: clean (0 errors, 13/13 pages)
- `/guides/spouse-dependent-visa-dubai` listed as ƒ (dynamic) in build output
- Both group pages (`child` and `spouse`) coexist correctly

**Routing:**
- `/guides/spouse-dependent-visa-dubai` → spouse group page, default Outside tab
- `/guides/spouse-dependent-visa-dubai?route=inside` → Inside tab
- `/guides/spouse-dependent-visa-dubai-outside-country` → 307 → `?route=outside`
- `/guides/spouse-dependent-visa-dubai-inside-country` → 307 → `?route=inside`

---

## 2026-04-19 — Spouse inside-country visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `spouse-dependent-visa-dubai-inside-country`
  - Title: "How to Sponsor a Spouse Residence Visa in Dubai Without Leaving the UAE"
  - Category: visas | Price: AED 2,700 – 3,200 | Timeline: 3–6 weeks | Last updated: April 2026
  - 7 steps: attestation → family file → inside-country entry permit → change of status → medical → Emirates ID → residence
  - Guide ID: f2e9ac9a-6194-44ce-bcfd-65a7f8c96961

**What was verified:**
- published=0 (draft)
- 7 steps with correct order, costs, and time_est

**Next step:** Owner reviews in admin, runs /guide-content-qa, publishes if approved

---

## 2026-04-19 — Spouse outside-country visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `spouse-dependent-visa-dubai-outside-country`
  - Title: "How to Sponsor a Spouse Residence Visa in Dubai from Outside the UAE"
  - Category: visas | Price: AED 1,800 – 2,200 | Timeline: 3–6 weeks | Last updated: April 2026
  - 7 steps: attestation → family file → entry permit → spouse arrival → medical → Emirates ID → residence
  - Medical step included (Step 5) — spouse route requires medical fitness test; correct distinction from child route
  - Sponsor-proof rule in Step 2: salary cert for free zone/government, labour contract for private sector
  - Guide ID: 5b394aa0-fbfe-4036-8ab7-20cee0e5c3dd

**What was verified:**
- published=0 (draft)
- 7 steps confirmed with correct step_order, costs, and time_est
- All field values match the spec exactly

**Next step:** Owner reviews in admin at /admin/guides/spouse-dependent-visa-dubai-outside-country, runs /guide-content-qa, then publishes if approved

---

## 2026-04-18 — Tab-based group guide page implemented

**What changed:**
- `lib/guide-groups.ts` (new) — `GUIDE_GROUPS` constant mapping parent slug to variant config (title, summary, category, variants array with slug/label/routeKey)
- `lib/db/reader.ts` — added `getGuideGroup(slugs[])` — fetches multiple guides without published check (group pages are not subject to individual publish gating)
- `app/(public)/guides/child-dependent-visa-dubai/page.tsx` (new) — server component, reads `?route=` from searchParams, calls `getGuideGroup`, renders `<GuideTabs>`; static route takes precedence over `[slug]` in Next.js
- `components/GuideTabs.tsx` (new) — client component; `useState(defaultRoute)` for instant tab switching; `router.replace(..., { scroll: false })` updates URL without page reload; renders static title/category/summary then dynamic price/timeline/audience/overview/steps per active tab; reuses `<StepCard>` unchanged
- `next.config.ts` — added two `permanent: false` redirects: old child slug URLs → parent group URL with `?route=` query param

**What was NOT changed:**
- `app/(public)/guides/[slug]/page.tsx` — untouched
- `components/StepCard.tsx` — untouched
- Guide content in DB — untouched
- Published status of any guide — untouched

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors, 12/12 pages)
- `employment-visa` remains static (●); group page is dynamic (ƒ) as expected
- Group page at `/guides/child-dependent-visa-dubai` — confirmed in build output

**Next step:** Start dev server, review tab UI, publish child guides when ready

---

## 2026-04-18 — Both child visa guides aligned and cleaned

**What changed:**
- Step titles standardized across both guides: "Open Family File at Amer", "Apply for Entry Permit", "Finalize Residence Visa" (dropped "the", "Child", "Inside-Country" qualifiers from titles — distinctions moved to WHAT text)
- WHERE field standardized: outside guide "Amer service center" → "Amer"; Step 1 "Varies by country; UAE MOFA for final step" → "UAE MOFA (final step)" in both
- Step 1 time_est standardized: "1–4 weeks (varies by country)" → "1–4 weeks (varies)" in both
- Step 1 WHAT aligned: both guides now use identical description of the attestation chain
- Step 1 ADVICE aligned: identical phrasing; em dash removed
- Step 2 doc list aligned: both guides now list same docs (Emirates ID original, passport, residence visa, child docs, white-background photo, Ejari, proof of income with sector split)
- Step 2 WARNING standardized: "Bring the original Emirates ID card. A copy or digital version is not accepted."
- Step 5 WHAT: removed "This fee covers a 2-year card" from outside WHAT; moved 2-year note to ADVICE in both
- Step 5 ADVICE aligned: "The Emirates ID is issued for 2 years. Track card dispatch via the ICA app." (both)
- Step 5 time_est standardized: "2–3 days (card delivered in 5–10 days)" (both)
- Step 6 ADVICE added to inside: "The child's passport is held briefly during stamping. Do not plan travel until it is returned."
- Step 6 WARNING sharpened in outside: vague "adequate remaining validity" → specific "6 months beyond intended expiry" (matching inside)
- Outside guide: audience updated to include "government sector" (was omitted despite Step 2 mentioning it)
- Outside guide: summary updated to remove "for private sector and free zone sponsors" suffix; added "No medical test required"
- Outside guide: overview em dash removed (para 2)
- Inside guide: summary updated to add "Covers document attestation" to coverage list
- Inside Step 3 WHAT: clarified entry permit is "inside-country" variant (moved qualifier from title to WHAT)
- Inside Step 4 ADVICE removed: "Change of status must be completed before..." was obvious sequencing info
- Inside Step 1 cost: fixed from "0" to "Varies by country" (was incorrect)
- Inside steps 2–6 cost: fixed from raw floats ("252.0") to proper text strings ("AED 252")

**What was verified:**
- Outside: 6 steps, all WHERE = "Amer" (except Step 1 = "UAE MOFA (final step)", Step 4 = "UAE port of entry")
- Inside: 6 steps, all WHERE = "Amer" (except Step 1 = "UAE MOFA (final step)")
- Both guides: published=0 (draft)

**Next step:** Owner reviews both drafts in admin, runs /guide-content-qa on each, then publishes if approved

---

## 2026-04-18 — Inside-country child dependent visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `child-dependent-visa-dubai-inside-country`
  - Title: "How to Sponsor a Child Dependent Visa in Dubai from Inside the UAE"
  - Category: visas | Price: AED 2,875 (govt fees, excl. attestation) | Timeline: 3–6 weeks
  - 6 steps: attestation → family file → inside-country entry permit → change of status → Emirates ID → residence
  - No medical step — correct for standard child route
  - Sponsor-proof rule in Step 2: salary cert for free zone/govt, labour contract for private sector
  - Change of status step (Step 4, AED 639) distinguishes this from the outside-country route
  - Attestation step cost set to 0 (external/varies by country — excluded from guide total)

**What was verified:**
- Guide inserted as published=0 (draft, not live on public site)
- 6 steps confirmed with correct step_order, costs, and time_est
- Guide ID: 77b500b7-7ea3-4635-b102-fa4674b4dad8

**Next step:** Owner reviews both child visa drafts in admin, runs /guide-content-qa on each, then publishes if approved

---

## 2026-04-18 — Child dependent visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `child-dependent-visa-dubai-outside-country`
  - Title: "How to Sponsor a Child Dependent Visa in Dubai from Outside the UAE"
  - Category: visas | Price: AED 1,586 (govt fees, excl. attestation) | Timeline: 3–6 weeks
  - 6 steps: attestation → family file → entry permit → child arrival → Emirates ID → residence
  - No medical step — correct for standard child route
  - Private sector/free zone sponsor document split noted in Step 2 advice
  - Attestation country-variance noted in Step 1 warning and overview

**What was verified:**
- Guide inserted as published=0 (draft, not live on public site)
- 6 steps confirmed in DB with correct order, costs, and non-empty timeEst
- employment-visa guide unchanged (still published)

**Correction applied (2026-04-18):** Guide was accidentally published; unpublished back to draft.
Step 2 sponsor-proof advice updated: salary certificate for free zone/government sector, labour contract for private sector, partner/investor noted as separate case.

**Next step:** Owner reviews draft in admin, runs /guide-content-qa, then publishes if approved

---

## 2026-04-17 — guide-content-qa skill created

**What changed:**
- `.claude/commands/guide-content-qa.md` (new) — Claude Code slash command skill
  that audits any guide draft against the project's locked content writing standard;
  reads from SQLite when given a slug, or audits pasted content; produces structured
  verdict (STRONG / NEEDS TIGHTENING / NEEDS REWRITE) with key issues, exact
  problem quotes, example rewrites, and final publish recommendation

**What was verified:**
- Skill file parses correctly (markdown, no syntax issues)
- Manual audit of `employment-visa` using the skill's DB read logic: verdict STRONG
- Three minor issues found: Step 5 `where` parenthetical, summary 3 chars over soft 160-char limit

**Next step:** Second article — Dependent / Family Visa guide (children)

---

## 2026-04-17 — Claude Project knowledge pack created

**What changed:**
- `CLAUDE_PROJECT_KB.md` (new) — full knowledge base snapshot for uploading into
  a Claude Project: stack, architecture, schema, phases, live guide content with
  step table, visual design system, content writing standard, validation rules,
  open decisions, next step, memory workflow
- `CLAUDE_PROJECT_CHAT_BRIEF.txt` (new) — paste-ready chat starter (~200 words)
  for a new conversation inside the Claude Project
- `CLAUDE_PROJECT_INSTRUCTIONS.txt` (new) — suggested Claude Project Instructions
  text: tells Claude to trust repo files, not invent architecture, preserve hard
  rules, flag open decisions, follow content writing standard
- `.claude/memory-guard.sh` — added Check 2: warns when PROJECT_STATE.md is
  newer than CLAUDE_PROJECT_KB.md (KB may be stale); also updated Check 1 warning
  to mention CLAUDE_PROJECT_KB.md in the update list
- `CLAUDE.md` — added CLAUDE_PROJECT_KB.md to the memory maintenance file table

**What was verified:**
- Build: clean (0 errors, 11/11 pages)
- Guard script: bash syntax clean (exits 0, two independent checks)

**Next step:** Second article — Dependent / Family Visa guide (children)

---

## 2026-04-17 — Full project-state sync and handoff hardening

**What changed:**
- `PROJECT_STATE.md` — complete rewrite: accurate phase status table, current guide
  content documented, real blockers, category taxonomy flagged as not owner-approved
- `ROADMAP.md` — fixed duplicate "Current Phase" headings; moved Phase 4.5 and 4.6
  to Completed with accurate descriptions; added "Current Priority" section with
  next content task (dependent visa guide)
- `DECISIONS.md` — category taxonomy entry changed from "locked" to "defined but
  not owner-approved as final" per explicit owner instruction
- `CHECKPOINTS.md` — added CP-05 (Phase 4.5 + 4.6 verified stable); corrected
  CP-04 branch/commit note from "uncommitted" to "committed"
- `HANDOFF_PROMPT.md` — complete rewrite: accurate dates, Phase 4.5 + 4.6 listed,
  real guide content described, 10 rules list including new timeline and writing standard rules
- `NEW_CHAT_TRANSFER.txt` — complete rewrite: accurate phase table, current content
  state, correct next step, all 10 rules
- `SEO_STRATEGY.md` — content quality bar updated: required timeline/timeEst
  fields flagged, writing standard reference added

**What was NOT changed (already accurate):**
- `CLAUDE.md` — content writing standard was already correct
- `docs/article-template.md` — already updated in previous session
- `SESSION_LOG.md` — entries were accurate

**Next step:** Second article — Dependent / Family Visa guide (children)

---

## 2026-04-13 — Content writing standard + final visual polish

**What changed:**
- `CLAUDE.md` — added "Content Writing Standard (locked)" section: field-level
  rules (title, summary, overview, steps), style rules (no theatrical framing, no
  em-dashes, no filler), SEO rules for content. Binding rule for all future guides.
- `docs/article-template.md` — rewrote to align field specs with writing standard
  (summary 1–2 sentences, overview 2 paragraphs, step what 1–2 sentences);
  updated example outline to use real employment-visa guide as reference;
  removed the old loose "3–6 sentences" overview spec
- `app/(public)/guides/[slug]/page.tsx` — replaced plain "Need help?" text link
  with a small navy card (bg-navy, rounded-2xl, brass link text). Clear premium
  CTA anchor at the bottom of every guide.
- `components/TopicCard.tsx` — card surface: `bg-white border-gray-100` →
  `bg-stone-50 border-stone-200 hover:stone-100`; category pill: `bg-gray-100
  text-gray-400` → `bg-brass/[.08] text-brass/80`

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors)
- Rendered HTML: `bg-navy`, `text-brass`, `bg-brass` tokens all present
- CLAUDE.md writing standard now enforces field-level length limits for all future guides

**Next step:** Owner decides — Phase 5 (RU), Phase 7 (sitemap), or more guide content

---

## 2026-04-13 — Real employment-visa guide + timeline required

**What changed:**
- `scripts/update-employment-visa.ts` (new) — replaced seeded sample with real production
  content: title "How to Get an Employment Visa in Dubai Without Leaving the UAE",
  inside-country route, 8 steps with exact Tasheel/Amer/Tawjeeh fees, SEO-focused
  summary and overview, addresses as "Any [center] branch in Dubai"
- DB: guide timeline updated to `2–4 weeks`; all 8 step `time_est` set to `2–3 days`;
  overview text "4–6 weeks" corrected to "2–4 weeks"
- `components/admin/GuideFormFields.tsx` — `timeline` field: added `required` + label `*`
- `components/admin/StepCard.tsx` — `timeEst` field: added `required` + label `*`,
  placeholder updated to `2–3 days`
- `app/admin/actions.ts` — server-side guards: `createGuideAction` and
  `updateGuideAction` throw if `timeline` empty; `updateStepAction` throws if
  `timeEst` empty

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors)
- DB confirmed: guide timeline = `2–4 weeks`, all 8 steps = `2–3 days`
- Public page HTML: `2–4 weeks` ×2, `2–3 days` ×16 (8 steps, rendered twice each)
- Overview body text consistent with guide timeline field

**Next step:** Owner decides — Phase 5 (RU public rendering), Phase 7 (sitemap/structured data), or more content

---

## 2026-04-12 — Phase 4.5: public visual identity polish

**What changed:**
- `app/globals.css` — `@theme` block with `--color-navy: #1B2E4B` and `--color-brass: #B5935A`
- `components/CategoryIcon.tsx` (new) — 5 inline SVG micro-icons (14×14, 1.5px stroke,
  round caps, currentColor): visas/passport, company-setup/building, hiring/person,
  living/house, government/seal
- `components/StepCard.tsx` — step number bubble: `bg-gray-900` → `bg-navy`;
  advice block: `bg-blue-50/60 text-blue-600` → `bg-navy/[.06] text-navy`
- `components/Hero.tsx` — value cards: added `border-l-2 border-brass` left accent;
  section divider: `border-gray-100` → `border-stone-200`
- `components/TopicCard.tsx` — category pill now inline-flex with brass CategoryIcon
  left of text; hyphen-to-space display fix for compound category names
- `components/GuideHeader.tsx` — category label wrapped in flex row with brass
  CategoryIcon; hyphen-to-space fix
- `app/(public)/guides/[slug]/page.tsx` — brass overline (`w-6 h-0.5 bg-brass`)
  above Overview and Steps h2 labels; section border: `border-stone-200`

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors)
- Rendered HTML confirmed: `bg-navy`, `bg-brass`, `border-l-2 border-brass`,
  `aria-hidden="true"` SVGs, `<svg width="14"` all present in page output
- Header brand mark correctly skipped per scope

**Next step:** Checkpoint commit for Phase 4 + 4.5, then Phase 5 or 7 (owner decides)

---

## 2026-04-12 — Memory sync + Phase 4.5 design plan

**What changed:**
- Fixed all stale references across PROJECT_STATE.md, HANDOFF_PROMPT.md,
  NEW_CHAT_TRANSFER.txt (removed "step management not built", updated next step)
- Added CP-04 to CHECKPOINTS.md
- Added Phase 4.5 scope to ROADMAP.md

**What was verified:**
- All memory files internally consistent
- No stale "Phase 4 is next" references remaining

**Next step:** Implement Phase 4.5 visual polish after owner approval of plan

---

## 2026-04-12 — Phase 4: inline step CRUD

**What changed:**
- `lib/db/writer.ts` — added `getStepsByGuideId(guideId)`
- `app/admin/actions.ts` — added `createStepAction`, `updateStepAction`,
  `deleteStepAction` (with contiguous renumber), `reorderStepAction` (swap)
- `components/admin/StepCard.tsx` (new) — client component, per-step form with
  all 14 fields (cost, timeEst, EN×6, RU×6), Save/Delete/Up/Down buttons
- `components/admin/StepList.tsx` (new) — client component, step list + Add step
- `app/admin/guides/[slug]/page.tsx` — fetches steps, renders `<StepList>` as
  sibling below `<GuideEditForm>` (no nested forms)
- Step actions use `router.refresh()` pattern — no redirect, guide form unsaved
  state is fully preserved across step mutations

**What was verified:**
- Production build clean (0 errors, 0 TypeScript errors)
- SQLite mutations tested: create appends at max+1, delete renumbers remaining
  contiguously, reorder swaps adjacent stepOrder integers
- 5 seeded steps for employment-visa confirmed present after restore

**Next step:** Checkpoint commit, then Phase 5 or Phase 7 (owner decides)

---

## 2026-04-12 — Memory system and Phase 3A checkpoint

**What changed:**
- Created project-memory workflow: `NEW_CHAT_TRANSFER.txt`, `SESSION_LOG.md`,
  `CHECKPOINTS.md`, `PROJECT_STATE.md`, `DECISIONS.md`, `ROADMAP.md`,
  `SEO_STRATEGY.md`, `HANDOFF_PROMPT.md`
- Added Claude Code hook in `.claude/settings.json` + `.claude/memory-guard.sh`
  to warn when source files change without memory file updates
- Updated `CLAUDE.md` with project-memory maintenance rule, category taxonomy,
  language rules, React key rule

**What was verified:**
- Production build: clean (0 errors, 0 warnings, 11/11 pages)
- SQLite write paths: save draft, unpublish, save and publish — all confirmed correct
- React key audit: no duplicate sibling keys anywhere in the codebase
- Public page reads fresh data from SQLite after a DB write

**Next step:** Phase 4 — step management in the admin

---

## 2026-04-12 — Fix duplicate React key warning

**What changed:**
- Removed `key={savedTs}` from `<SavedBanner>` inside `GuideEditForm`
- Removed `key={savedTs ?? "init"}` from `<form>` inside `GuideEditForm`
- Removed now-unnecessary `useEffect` that manually cleared dirty state
- Root cause: both siblings had value `savedTs` when it was set — collided

**What was verified:**
- Static code audit: only one `key={saved ?? "init"}` remains, on the outer
  `<GuideEditForm>` in the page — inner elements carry no keys
- Production build: clean

**Next step:** Phase 3A verification pass + checkpoint

---

## 2026-04-12 — Fix owner-workflow publish bug (Phase 3A complete)

**What changed:**
- Merged separate Publish form into the main edit form using `name="intent"`
  (`value="draft"` and `value="publish"` submit buttons)
- `updateGuideAction` now reads `intent` and spreads `{ published: true }` when
  `intent === "publish"`
- Unpublish remains a safe standalone form (no field data at risk)
- Created `components/admin/GuideEditForm.tsx` (client component):
  dirty tracking via `useRef` + `useState`, `beforeunload` guard, back-nav
  confirm dialog, "Unsaved changes" indicator
- Simplified `app/admin/guides/[slug]/page.tsx` to thin server component
- Updated `CLAUDE.md` with Admin QA Rules section

**What was verified:**
- Publish no longer discards unsaved field edits
- Save draft preserves published state correctly

**Next step:** Fix the React key bug introduced by this change

---

## 2026-04-12 — Fix stale defaultValue after save redirect

**What changed:**
- `updateGuideAction` redirects to `/admin/guides/${slug}?saved=${Date.now()}`
  (timestamp forces URL change on every save)
- Edit page passes `key={saved ?? "init"}` to `<GuideEditForm>` so the
  component fully remounts when the URL changes
- Added `SavedBanner` component (3s auto-hide green success banner)

**What was verified:**
- After saving, the edit form shows the newly saved values (not stale inputs)
- DB write was always correct — this was a React rendering issue only

**Next step:** Fix publish discarding unsaved changes

---

## 2026-04-12 — Phase 3A: Guide CRUD

**What changed:**
- `app/admin/guides/new/page.tsx` + `createGuideAction`
- `app/admin/guides/[slug]/page.tsx` + `updateGuideAction`, `setPublishedAction`,
  `deleteGuideAction`
- `components/admin/GuideFormFields.tsx` (shared field inputs, server component)
- `components/admin/DeleteGuideButton.tsx`
- `lib/revalidate.ts` — calls `revalidatePath` for guide + list + home after save
- ISR on-demand revalidation wired to every save action

**What was verified:**
- Create guide → appears in guide list → publishes to public site
- Edit guide → public page updates after save
- Delete guide → redirects to list, public page gone

**Next step:** Fix stale defaultValue on same-URL redirect

---

## 2026-04-12 — Rename middleware.ts → proxy.ts

**What changed:**
- Renamed `middleware.ts` to `proxy.ts` (Next.js 16 convention)

**What was verified:**
- Build no longer shows deprecation warning
- Route protection still works

---

## 2026-04-12 — Fix bcrypt hash corruption by dotenv-expand

**What changed:**
- Escaped all `$` as `\$` in `ADMIN_PASSWORD_HASH` in `.env.local`
- Added `scripts/debug-auth.ts` — reads `.env.local` raw, bypasses dotenv-expand,
  calls `bcryptjs.compare()` for diagnosis

**What was verified:**
- `debug-auth.ts` confirmed hash length 60, `starts with $2b$: true`
- Admin login works correctly

---

## 2026-04-12 — Phase 2: Admin foundation

**What changed:**
- `lib/auth.ts` — NextAuth.js v4 + CredentialsProvider + bcryptjs
- `app/admin/layout.tsx` — isolated layout, no public Header
- `app/admin/login/page.tsx` — credentials form with `signIn`
- `app/admin/guides/page.tsx` — lists all guides (draft + published)
- `proxy.ts` — route protection for `/admin/guides` and subpaths
- `scripts/generate-hash.ts` — generates bcrypt hash for `.env.local`

**What was verified:**
- Login works with correct credentials
- Wrong credentials show error
- `/admin/guides` redirects to login when unauthenticated

**Next step:** Phase 3A — guide CRUD

---

## 2026-04-12 — Phase 1: SQLite migration

**What changed:**
- Installed `better-sqlite3`, `drizzle-orm`, `drizzle-kit`, `@types/better-sqlite3`
- `lib/db/schema.ts` — Drizzle schema (guides + steps, bilingual flat columns)
- `lib/db/connection.ts` — SQLite singleton (WAL mode, FK enforcement)
- `lib/db/reader.ts` — public read-only queries
- `lib/db/writer.ts` — admin queries
- `scripts/seed.ts` — seeded employment-visa guide from old MDX
- Updated public guide page to render from DB
- Deleted MDX files, `metadata.ts`, `@next/mdx` config
- Added `serverExternalPackages: ["better-sqlite3"]` to `next.config.ts`

**What was verified:**
- Public site output identical before and after migration
- Employment-visa guide renders correctly from SQLite
- Build clean, zero SEO regression

**Next step:** Phase 2 — admin foundation
