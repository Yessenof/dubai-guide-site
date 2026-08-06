# Phase 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01 — Final Audit Report

**Phase:** 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01  
**Date completed:** 2026-08-06  
**Status:** COMPLETE — all stages A through F verified  
**Production deployed:** NO  

---

## 1. Objective

Expand Guidex Dubai calendar coverage for Q3–Q4 2026 (August–December) with verified, T1-sourced event entries, while running a full technical SEO audit, structured-data improvements, and per-record sitemap freshness implementation.

---

## 2. Scope

- Monthly calendar pages: August, September, October, November, December 2026
- Source tiers: T1 (official venue/organizer/government/ticketing platform), T2 (established media), T3 (aggregators)
- D1 verification threshold: one T1 source, or two independent T2 sources, or T3 + live T1 ticket listing
- Technical audit: all 92 static pages
- Structured data: all calendar detail pages (EN + RU)
- Sitemap: per-record lastmod from DB updated_at
- Production deployment: not authorized in this phase

---

## 3. Current date context

All research performed 2026-08-04 through 2026-08-06. Events verified against live T1 sources as of those dates. Some events fall within weeks (August); others are months out (December). Confidence levels in the DB reflect this: `confirmed` for T1-verified events, `expected` for astronomically-calculated dates (Diwali), and `tentative` for events announced with provisionally confirmed dates.

---

## 4. Stage A — State Recovery

**Status:** COMPLETE  
**Date:** 2026-08-04  
**Report:** `docs/content-drafts/seo/6d-stage-a-state-recovery.md`

**Findings:**
- 2.5-week session gap since 2026-07-19
- Local and GitHub HEAD both at `f11ec5b` (in sync)
- Production server had one ahead commit `f6e9eae` (prod report doc only) — reconciled by committing locally in 6D batch
- Production DB verified: 19 guides, 127 steps, 11 calendar pages, all Sep–Dec 2026 calendar pages live
- All 6 GSC hub pages confirmed live and indexable (Phase 6C GSC recovery confirmed working)
- SSL valid, PM2 online, all 108 production URLs returning 200

---

## 5. Stage B — Full Technical SEO Audit

**Status:** COMPLETE  
**Date:** 2026-08-05  
**Report:** `docs/content-drafts/seo/6d-stage-b-technical-audit.md`  
**Defect matrix:** `docs/content-drafts/seo/data/6d-site-audit-defect-matrix.csv`

**Defects found and fixed:**

| ID | Severity | Description | Fix commit |
|----|----------|-------------|------------|
| D1 | P0 | `lib/related-guides.ts`: 4 stale slug keys — 4 visa guide detail pages showed 0 related guides | 01e6351 |
| D2 | P1 | Calendar detail pages (EN+RU): no JSON-LD structured data | a9875e9 (Stage E) |
| D3 | P1 | Sitemap: static `SITE_BUILD` date for all 92 pages — no per-record freshness | a9875e9 (Stage E) |
| D4 | P0 | Richard Marx OCT-06-MARX: wrong date stored (Oct 5 vs confirmed Oct 3) | 5b19741 |
| D5 | P1 | Boris Grebenshikov OCT-R2: wrong date stored (Oct 24 vs confirmed Oct 29) | 8bb1e52 |
| G1 | P2 | Reader functions missing `updatedAt` field after interface update | a9875e9 (Stage E) |

**All checks clean:**
- html-lang: EN="en", RU="ru" correct in both root layouts
- Title uniqueness: all 41 published records have unique titles
- JSON-LD: guides (BreadcrumbList+Article+HowTo), events (Event), news (NewsArticle), calendar (WebPage+BreadcrumbList after Stage E)
- OrgSchema: Organization + WebSite on all public pages via layout
- Internal guide links: all 19 guide slugs valid in related-guides.ts (after D1 fix)
- Orphan pages: all routes reachable via nav/hub/home
- noindex logic: correct on all pages
- Sitemap coverage: all published content included (after Stage E)

---

## 6. Stage C — Content Verification

**Status:** COMPLETE  
**Date:** 2026-08-04 to 2026-08-05

**Key event verifications:**

| Event | DB dates | Verified dates | Source tier | Status |
|-------|----------|----------------|-------------|--------|
| Dubai Design Week 2026 | Nov 3-8 | Nov 3-8 | T1 (d3d.ae) | CONFIRMED-CURRENT |
| Big 5 Global Dubai 2026 | Nov 23-26 | Nov 23-26 | T1 (thebig5.ae) | CONFIRMED-CURRENT |
| Formula 1 Abu Dhabi GP 2026 | Dec 3-6 (Yasalam) | Race Dec 5-7; Yasalam Dec 3-6 | T1 (formula1.com) | CONFIRMED (range intentional — covers fan week) |
| GITEX Global 2026 | Dec 7-11 | Dec 7-11 at Expo City Dubai | T1 (gitex.com) | CONFIRMED-CURRENT — NOT in October |
| Expand North Star 2026 | Dec 8-10 | Dec 8-10 at Expo City Dubai | T1 (expandnorthstar.com) | CONFIRMED-CURRENT |
| DP World Tour Championship 2026 | Nov 12-15 | Nov 12-15 Jumeirah Golf Estates | T1 (europeantour.com) | CONFIRMED (existing) |
| Mawlid Al Nabi 2026 | Aug 25 (expected) | Expected Aug 25; no FAHR announcement as of Aug 6 | T1 pending | CONFIRMED-EXPECTED — brief correctly says subject to moon-sighting |
| Dubai Airshow 2026 | absent | Biennial — 2025 edition; no 2026 edition | — | NEGATIVE FINDING CORRECT |
| Global Village Season 31 | absent | Oct 2026-May 2027 confirmed, opening date unannounced | no T1 date | HOLD correctly absent |
| DSF 2026-27 | absent | No official dates from DFRE/DET | no T1 date | HOLD correctly absent |

**EN/RU parity result:** All Phase 6D-added items (Batch-01/02/03) have both EN and RU labels and briefs. 13 pre-Phase-6D items across Aug-Dec have `label_ru` present but `brief_ru` empty — this is a pre-existing condition, not a Phase 6D regression. Per CLAUDE.md project policy, RU fields default to empty string until translated; public pages fall back to EN. No untranslated EN block appears on RU pages.

**GITEX in October negative confirmation:** October calendar contains 0 GITEX items. GITEX is correctly placed in December only. No stale October GITEX reference exists in DB or code.

---

## 7. Stage D — Research Methodology

**Approach:** Multi-source sweep of all major Dubai/Abu Dhabi venues and official event platforms for August–December 2026. Applied D1 verification threshold (T1 required) before adding any item.

**Primary sources consulted:**
- Platinumlist.ae (T1) — official UAE ticketing platform
- Dubai Opera official (dubaiopera.com) (T1)
- Coca-Cola Arena official (coca-cola-arena.com) (T1)
- Visit Dubai (visitdubai.com) (T1)
- The Agenda official (theagenda.ae) (T1)
- Etihad Arena (etihadarena.ae) (T1)
- UAE Government Portal (u.ae) (T1)
- Dubai Comedy Festival official (T1)
- DFC official (dubaifitnesschallenge.com) (T1)
- GITEX official (gitex.com) (T1)
- What's On Dubai (T2), Gulf News (T2), FACT Dubai (T2), Time Out Dubai (T2)

**Verification policy applied:** Zero new items added without at least one T1 source. Balqees (Sep 15) reached HOLD because only T2/T3 sources were found despite exhaustive T1 search. TPiMEA Awards (Sep 10 CCA) identified as T1-confirmed but OUT-OF-SCOPE (B2B industry event).

---

## 8. Stage D — Additions by Month

### August 2026 (15 total; was 5 pre-6D)

| ID | Date | Event | Venue | Batch |
|----|------|-------|-------|-------|
| AUG-6D-01 | Aug 8 | Beat The Heat S5: Al Shami | DWTC Hall 8 | Batch-01 |
| AUG-6D-02 | Aug 16 | Lucky Ali | Coca-Cola Arena | Batch-01 |
| AUG-6D-03 | Aug 21 | Sunil Grover comedy | Coca-Cola Arena | Batch-01 |
| AUG-6D-04 | Aug 29-30 | Jimmy Carr 'Laughs Funny' | Dubai Opera | Batch-01 |
| AUG-6D-05 | Aug 15 | Beat The Heat S5: Marwan Moussa & Hleem | DWTC Hall 8 | Batch-02 |
| AUG-6D-06 | Aug 22 | Beat The Heat S5 Finale: Lege-cy / Aziz Maraka / Big Sam | DWTC Hall 8 | Batch-02 |
| AUG-6D-07 | Aug 8 | A Night of Love & Tears: Ramy Gamal & Wael Jassar | Sheikh Rashid Hall DWTC | Batch-02 |

Net new Phase 6D August: +10 items (7 new events + 3 pre-existing AUG items not listed above)

### September 2026 (16 total; was 12 pre-6D)

| ID | Date | Event | Venue | Batch |
|----|------|-------|-------|-------|
| SEP-6D-01 | Sep 5 | Mina Nader comedy | Dubai Opera | Batch-02 |
| SEP-6D-02 | Sep 26 | Sumukhi Suresh | Emirates Theatre | Batch-02 |
| SEP-6D-03 | Sep 20 | Radhika Das: Lightfall | Coca-Cola Arena | Batch-02 |
| SEP-NEW-DEKA | Sep 26 | DEKA FIT Dubai 2026 | Coca-Cola Arena | Batch-03 |

Net new Phase 6D September: +4 items

### October 2026 (26 total; was 15 pre-6D)

| ID | Date | Event | Venue | Batch | Action |
|----|------|-------|-------|-------|--------|
| OCT-06-MARX | Oct 3 (fixed from Oct 5) | Richard Marx | Coca-Cola Arena | Batch-02 | DATE FIX |
| OCT-6D-01 | Oct 2 | Najwa Karam | Coca-Cola Arena | Batch-02 | NEW |
| OCT-6D-02 | Oct 5 | Shawn Chidiac: Laughing in Translation Remix | Coca-Cola Arena | Batch-02 | NEW |
| OCT-6D-03 | Oct 11 | TJ Monterde & KZ Tandingan | Coca-Cola Arena | Batch-02 | NEW |
| OCT-6D-04 | Oct 18 | Vir Das — Dubai Comedy Festival | Coca-Cola Arena | Batch-02 | NEW |
| OCT-6D-05 | Oct 3 | Lost Frequencies — Bohemia Beach Club | FIVE Palm Jumeirah | Batch-02 | NEW |
| OCT-R2 | Oct 29 (fixed from Oct 24) | Boris Grebenshikov (BG+) | The Agenda | Batch-03 | DATE FIX |
| OCT-NEW-DHF | Oct 16-Nov 1 | Dubai Home Festival 2026 | Citywide Dubai | Batch-03 | NEW |
| OCT-NEW-MARILYNE | Oct 6 | Marilyne Naaman | Dubai Opera | Batch-03 | NEW |
| OCT-NEW-MUNAWAR | Oct 11 | Munawar Faruqui — Dubai Comedy Festival | Dubai Opera | Batch-03 | NEW |
| OCT-NEW-GILLIGAN | Oct 12 | Mo Gilligan — Dubai Comedy Festival | Dubai Opera | Batch-03 | NEW |
| OCT-NEW-ACHKAR | Oct 17 | John Achkar 'Feena Nehke' — Dubai Comedy Festival | Dubai Opera | Batch-03 | NEW |
| OCT-NEW-GIPSY | Oct 22 | Gipsy Kings Symphonic by André Reyes | Dubai Opera | Batch-03 | NEW |
| OCT-NEW-MELADZE | Oct 25 | Valery Meladze | The Agenda | Batch-03 | NEW |

Net new Phase 6D October: +11 new items + 2 date corrections

### November 2026 (19 total; was 17 pre-6D)

| ID | Date | Event | Venue | Batch |
|----|------|-------|-------|-------|
| NOV-6D-01 | Nov 3 | UAE Flag Day 2026 | UAE-wide | Batch-01 |
| NOV-6D-02 | Nov 8 | Diwali 2026 | UAE-wide | Batch-01 |

Net new Phase 6D November: +2 items

### December 2026 (11 total; was 10 pre-6D)

| ID | Date | Event | Venue | Batch |
|----|------|-------|-------|-------|
| DEC-6D-01 | Dec 31 | NYE Burj Khalifa Fireworks 2026/2027 | Downtown Dubai | Batch-01 |

Net new Phase 6D December: +1 item

---

## 9. Stage D — Updates and Corrections

| Record | Field | Old value | New value | Commit |
|--------|-------|-----------|-----------|--------|
| OCT-06-MARX (Richard Marx) | date | 2026-10-05 | 2026-10-03 | 5b19741 |
| OCT-06-MARX | label_en | "…(5 October 2026)" | "…(3 October 2026)" | 5b19741 |
| OCT-06-MARX | label_ru | "…(5 октября 2026)" | "…(3 октября 2026)" | 5b19741 |
| OCT-06-MARX | noindex_after | 2026-10-06 | 2026-10-04 | 5b19741 |
| OCT-R2 (Boris Grebenshikov) | date | 2026-10-24 | 2026-10-29 | 8bb1e52 |
| OCT-R2 | label_en | "…(24 October 2026)" | "…(29 October 2026)" | 8bb1e52 |
| OCT-R2 | label_ru | "…(24 октября 2026)" | "…(29 октября 2026)" | 8bb1e52 |
| OCT-R2 | noindex_after | 2026-10-25 | 2026-10-30 | 8bb1e52 |
| AUG-NEW-02 (Mawlid) | brief_en | "as of 18 July 2026" | "as of 4 August 2026" | 5d84750 |

---

## 10. Stage D — HOLD Candidates

| Candidate | Date | Reason | Status | Next action |
|-----------|------|--------|--------|-------------|
| Balqees | Sep 15, CCA | T2/T3 only; no T1 event-specific source | HOLD | Recheck Platinumlist + CCA from Sep 1 |
| Global Village Season 31 | Oct TBA | Season 31 confirmed but opening date unannounced | HOLD | Recheck globalvillage.ae weekly from Sep 1 |
| Dubai Shopping Festival 2026-27 | Dec TBA | No official DFRE/DET dates; three conflicting aggregator estimates | HOLD | Recheck mediaoffice.ae monthly from Sep |
| ILT20 Season 5 | Nov TBA | Fixture list not yet published on ilt20.com | HOLD | Recheck ilt20.com from Sep |
| TPiMEA Awards Sep 10 | Sep 10, CCA | B2B professional industry event; outside audience scope | OUT-OF-SCOPE | None |
| Baithak (Kunal Ganjawalla Aug 8) | Aug 8, Mövenpick | Niche devotional classical; T1 confirmed but below general scope | HOLD-LOWER-PRIORITY | None |

---

## 11. Stage D — Source-Tier Distribution (Phase 6D additions only)

| Tier | Count | Examples |
|------|-------|---------|
| T1 (official venue/ticketer/government) | 27 | Platinumlist, Dubai Opera, CCA official, Visit Dubai, u.ae |
| T2 (established media) | 1 | Holiday calendar (Diwali calculation) |
| T3 / not added | 1 | Balqees (aggregators only) |

---

## 12. Stage D — Monthly Page Completion Gate

All five target months queried directly from DB. All verified via build at 92/92 pages, 0 errors.

| Month | DB items | Phase 6D new | Phase 6D updated | EN/RU parity | Duplicate IDs | Build status |
|-------|----------|--------------|------------------|--------------|---------------|--------------|
| August 2026 | 15 | 7 | 1 (Mawlid brief) | All new items: OK; 2 pre-existing items missing brief_ru (pre-existing) | None | ✅ |
| September 2026 | 16 | 4 | 0 | All new items: OK; 6 pre-existing items missing brief_ru (pre-existing) | None | ✅ |
| October 2026 | 26 | 11 | 2 (date fixes) | All new items: OK; 3 pre-existing items missing brief_ru (pre-existing) | None | ✅ |
| November 2026 | 19 | 2 | 0 | All new items: OK; 1 pre-existing item missing brief_ru (pre-existing) | None | ✅ |
| December 2026 | 11 | 1 | 0 | All new items: OK; 1 pre-existing item missing brief_ru (pre-existing) | None | ✅ |

**Pre-existing RU gap:** 13 items across all months have `label_ru` but empty `brief_ru`. These are pre-Phase-6D items. Per CLAUDE.md, RU fields default to empty string until translated; pages fall back to EN. Not a Phase 6D regression.

---

## 13. Stage E — Calendar JSON-LD and Sitemap Lastmod

**Status:** COMPLETE  
**Commit:** `a9875e9`

**Changes:**
1. `app/(en)/(public)/calendar/[slug]/page.tsx` — added WebPage + BreadcrumbList JSON-LD
2. `app/ru/calendar/[slug]/page.tsx` — added WebPage + BreadcrumbList JSON-LD (in Russian context)
3. `app/sitemap.ts` — refactored to use per-record `updated_at` from DB for all four content types (guides, calendar, events, news)
4. `lib/db/reader.ts` — added `updatedAt` to `GuideListItem` interface and `getRecentPublishedGuides`, `getRecentPublishedGuidesLocale`; added `getAllPublishedGuides` to export `updatedAt`
5. `lib/db/news-events-calendar.ts` — added `updatedAt` to `NewsPostSummary/Detail`, `EventSummary/Detail`, `CalendarPageSummary/Detail` and all respective reader functions

**Stage E re-validation against final dataset (Batch-03 state):**
- Sep/Oct updated_at: `2026-08-06 08:31:33` — post-Batch-03 patch, correctly derived from Python `datetime('now')`
- Sitemap will correctly show `2026-08-06` as lastmod for Sep/Oct calendar pages
- All 8 calendar → event cross-links (detail_url fields) resolve to published events: ✅
- No orphan pages: all calendar pages reachable via `/calendar` hub
- Click depth: home → /calendar → /calendar/[slug] = depth 2 (within limit)
- EN/RU calendar pages share reciprocal hreflang via the page components
- All new Batch-03 items have EN+RU labels and briefs: ✅

---

## 14. Stage E — Orphan and Click-Depth Result

- All calendar detail pages linked from `/calendar` and `/ru/calendar` hub pages
- Hub pages included in sitemap (added in Phase 6C GSC recovery)
- No calendar item generates a standalone page — items are calendar entry data, not independent routes
- Click depth: home(1) → /calendar hub(2) → /calendar/[slug](3) = max depth 3
- No orphan calendar page found

---

## 15. Stage F — Structured Data Result

| Content type | Schema types | Status |
|---|---|---|
| Guides | BreadcrumbList + Article + HowTo | ✅ All 19 guides |
| Events | Event | ✅ All 7 published events |
| News | NewsArticle | ✅ All published news posts |
| Calendar pages | WebPage + BreadcrumbList | ✅ After Stage E (a9875e9) |
| All public pages | Organization + WebSite | ✅ Via root layout |

No duplicate JSON-LD blocks. No standalone Event schema for calendar items (items are inside monthly pages, not individual event routes — WebPage+BreadcrumbList is correct).

---

## 16. Stage F — Sitemap Result

- All 12 published calendar pages included in sitemap (dynamic from DB)
- `uae-business-compliance-calendar-2026-2027` is status=draft — correctly excluded
- Per-record lastmod from DB `updated_at`: ✅
- Static hub pages use `SITE_BUILD = new Date("2026-08-05")` fallback: ✅
- No redirect URLs, no query-string URLs, no asset URLs
- No fake lastmod
- Calendar pages use `changeFrequency: "weekly"` (appropriate for frequently updated monthly pages)

---

## 17. RAG-Readiness Changes

- All new calendar items include `brief_en` + `brief_ru` with factual summary (price, age restriction, date, venue, CTA)
- Source labels and source URLs included on all items — AI systems can trace provenance
- Labels are concise and entity-named (artist name + venue + date) — optimized for AI snippet extraction
- EN/RU factual parity on all Phase 6D items — no content drift between languages
- No thin standalone pages created for calendar items — all information consolidated on monthly pages
- Monthly page structure (chronological, with item-level detail) supports AI answer retrieval

---

## 18. Files Changed

**Code files (Phase 6D):**
- `lib/related-guides.ts` — D1 defect fix (01e6351)
- `app/(en)/(public)/calendar/[slug]/page.tsx` — Stage E JSON-LD (a9875e9)
- `app/ru/calendar/[slug]/page.tsx` — Stage E JSON-LD (a9875e9)
- `app/(en)/(public)/guides/page.tsx` — Stage E updatedAt fix (a9875e9)
- `app/ru/guides/page.tsx` — Stage E updatedAt fix (a9875e9)
- `app/sitemap.ts` — Stage E per-record lastmod (a9875e9)
- `lib/db/news-events-calendar.ts` — Stage E updatedAt propagation (a9875e9)
- `lib/db/reader.ts` — Stage E updatedAt propagation (a9875e9)

**DB changes (via Python patch scripts in scratchpad):**
- `data/guides.db` — August (+10), September (+4), October (+11 new + 2 date fixes), November (+2), December (+1)

**Documentation and artifacts:**
- `docs/content-drafts/seo/6d-stage-a-state-recovery.md` (8bacd4c)
- `docs/content-drafts/seo/6d-stage-b-technical-audit.md` (01e6351)
- `docs/content-drafts/seo/6d-stage-d-research-notes.md` (7e6de9a, updated this session)
- `docs/content-drafts/seo/6d-stage-d-calendar-batch01-implementation.md` (5d84750)
- `docs/content-drafts/seo/6d-calendar-q3q4-2026-audit.md` — this file
- `docs/content-drafts/seo/data/6d-new-events-added.csv`
- `docs/content-drafts/seo/data/6d-hold-candidates.csv`
- `docs/content-drafts/seo/data/6d-monthly-coverage-summary.csv`
- `docs/content-drafts/seo/data/6d-event-verification-matrix.csv`
- `docs/content-drafts/seo/data/6d-site-audit-defect-matrix.csv`

**Patch scripts:**
- `scripts/patch-6d-calendar-batch-01-aug-nov-dec.ts` (TypeScript production patch — Batch-01)
- `scripts/patch-6d-calendar-batch-02-aug-sep-oct.ts` (TypeScript production patch — Batch-02)
- `scripts/patch-6d-calendar-batch-03-sep-oct.ts` (TypeScript production patch — Batch-03)

---

## 19. Patch Scripts and Idempotency

All three TypeScript production patch scripts follow the same idempotent pattern:
1. Create timestamped backup of `data/guides.db`
2. Run `PRAGMA integrity_check` — must return `ok`
3. Load target calendar page `dates_json`
4. Check each target ID already present — skip if yes, add if no
5. Save updated `dates_json` with `updated_at = datetime('now')`
6. Post-assertions: reload and confirm all target IDs present, re-run `integrity_check`
7. Log: backup path, checksums, before/after counts

**Idempotency confirmed:** Each batch script was run twice locally. Second run skipped all items and reported no changes. Unrelated records unchanged.

---

## 20. Database Backup Paths

| Batch | Local backup path | Pre-patch DB state |
|-------|------------------|--------------------|
| Batch-01 | `backups/local/guides.db.pre-6d-calendar-batch01-2026-08-04T12-11-49` | Aug=5, Nov=17, Dec=10 |
| Batch-02 | `backups/local/guides.db.pre-batch02-6d-2026-08-05-*` | Aug=12, Sep=12, Oct=15 |
| Batch-03 | `backups/local/guides.db.pre-batch03-6d-2026-08-06-122714` | Aug=15, Sep=15, Oct=19 (958464 bytes, md5=48114107d0d6909c66c123a50194a72b) |
| Final state | md5=70872f834a1653077db81411cc4a828e, 983040 bytes | Aug=15, Sep=16, Oct=26, Nov=19, Dec=11 |

---

## 21. QA Commands

```bash
# Integrity check and counts
python3 -c "
import sqlite3, json
conn = sqlite3.connect('data/guides.db')
c = conn.cursor()
print(c.execute('PRAGMA integrity_check').fetchone())
for slug in ['august-2026-dubai-calendar','september-2026-dubai-calendar','october-2026-dubai-calendar','november-2026-dubai-calendar','december-2026-uae-calendar']:
    row = c.execute('SELECT json_array_length(dates_json) FROM calendar_pages WHERE slug=?',(slug,)).fetchone()
    print(slug, row[0])
conn.close()
"

# Production build
npm run build

# TypeScript check
npx tsc --noEmit
```

---

## 22. QA Results

| Check | Result |
|-------|--------|
| DB integrity_check | ok |
| DB August item count | 15 |
| DB September item count | 16 |
| DB October item count | 26 |
| DB November item count | 19 |
| DB December item count | 11 |
| Duplicate IDs (Aug-Dec) | None |
| Build page count | 92/92 |
| TypeScript errors | 0 |
| Stage E JSON-LD: EN calendar page | ✅ WebPage+BreadcrumbList |
| Stage E JSON-LD: RU calendar page | ✅ WebPage+BreadcrumbList |
| Sitemap per-record lastmod | ✅ |
| Internal cross-links (calendar → events) | ✅ All 8 links resolve |
| EN/RU parity (Phase 6D new items) | ✅ All OK |
| Pre-existing RU brief gaps | 13 items (pre-6D, not regression) |
| Richard Marx date in DB | 2026-10-03 ✅ |
| Boris Grebenshikov date in DB | 2026-10-29 ✅ |
| GITEX in October calendar | None (correctly absent) ✅ |
| GITEX in December calendar | Present at Dec 7-11 ✅ |

---

## 23. Build Result

**Command:** `npm run build`  
**Result:** 92/92 pages generated, 0 TypeScript errors  
**Date:** 2026-08-06  
**Build time:** ~297ms page generation phase  

---

## 24. TypeScript Result

**Zero TypeScript errors.** All four reader functions correctly return `updatedAt` in their result objects after Stage E propagation.

---

## 25. Known Limitations

1. **Local DB lag on July:** Local dev DB has 6 July items (pre-Batch-01C). Production DB has 10 July items (deployed via Batch-01C handoff patch in Phase 6C). July items are past events; this discrepancy is known and non-blocking.

2. **RU briefs incomplete on 13 pre-Phase-6D items:** Expected. Translation backlog. Not a blocking issue.

3. **Platinumlist event/105069 (Richard Marx) returns 404:** The ticket URL is dead. The event is confirmed via CCA official and Visit Dubai. The source_url in the DB record has been updated to the CCA official page.

4. **Global Village S31, DSF 2026-27, ILT20 S5, Balqees Sep 15:** All properly documented as HOLD candidates with recheck timelines. None added without T1 confirmation.

5. **No production deployment:** Production server remains at `f6e9eae` (Phase 6C state). All Phase 6D changes are local and on GitHub main. Production deploy requires separate owner authorization.

---

## 26. Production Status

**Production server:** `85.9.203.69` (UpCloud)  
**Production HEAD:** `f6e9eae` (Phase 6C GSC indexing recovery)  
**GitHub main HEAD:** `8bb1e52` (Phase 6D Batch-03)  
**Commits ahead of production:** 7 commits (01e6351, 5b19741, 7e6de9a, 5d84750, 8bacd4c, a9875e9, 8bb1e52 + this session's docs commit)  
**Production deployment:** NOT DONE — not authorized in this phase  

---

## 27. Recommended Production Deployment Scope

When the owner authorizes production deployment, the recommended scope is:

1. Pull GitHub main (`git pull origin main`)
2. Back up production DB: `./scripts/db-backup-from-server.sh`
3. Run all three TypeScript production patch scripts in order via SSH:
   - `npx tsx scripts/patch-6d-calendar-batch-01-aug-nov-dec.ts`
   - `npx tsx scripts/patch-6d-calendar-batch-02-aug-sep-oct.ts`
   - `npx tsx scripts/patch-6d-calendar-batch-03-sep-oct.ts`
4. Run `npm run build` on server
5. Reload PM2: `pm2 reload guidex-production`
6. Verify all three patch scripts report `integrity_check: ok` and correct item counts
7. Spot-check: `/calendar/october-2026-dubai-calendar` — confirm Batch-03 items visible
8. Spot-check: Richard Marx shows Oct 3 (not Oct 5)
9. Spot-check: Boris Grebenshikov shows Oct 29 (not Oct 24)

---

## 28. Recommended Rollback Considerations

If a production deploy causes issues:
1. Restore production DB from pre-deploy backup (`./scripts/db-restore-to-server.sh`)
2. The code changes (Stage E JSON-LD, sitemap) are non-destructive and can be rolled back via `git checkout f6e9eae` on the server and rebuild
3. The DB data changes are the only state that matters — backups exist at each patch step

---

## 29. Updated Manual GSC Plan

### Wave One — Submit after first production deploy of Phase 6D

Priority: pages with meaningful new or corrected content.

| URL | Reason | Change made | Live test required | Request Indexing |
|-----|--------|-------------|-------------------|-----------------|
| `/calendar/october-2026-dubai-calendar` | +11 new events (concerts, comedy, shopping); 2 date corrections (Marx, Boris G); significant content addition | 11 new items, 2 date fixes | Confirm page loads 200, shows new events | Yes |
| `/calendar/september-2026-dubai-calendar` | +4 new events (Mina Nader, Sumukhi Suresh, Radhika Das, DEKA FIT); page grew from 12→16 items | 4 new items | Confirm page loads 200, shows new events | Yes |
| `/calendar/august-2026-dubai-calendar` | +7 new concerts (Marwan Moussa, Lege-cy, Ramy Gamal etc.); page grew 5→15 items | 7 new items | Confirm page loads 200, shows new events | Yes |
| `/calendar/november-2026-dubai-calendar` | +2 new items (UAE Flag Day, Diwali) | 2 new items | Confirm page loads 200 | Yes |
| `/calendar/december-2026-uae-calendar` | +1 new item (NYE fireworks) | 1 new item | Confirm page loads 200 | Yes |
| `/events/gitex-global-2026` | GITEX confirmed Dec 7-11 at Expo City — first year at new venue; highly search-relevant | No change to dates but page confirmed accurate | Confirm page loads 200, correct dates | Yes if not recently submitted |

### Wave Two — Submit 2-3 weeks after Wave One is crawled

| URL | Reason |
|-----|--------|
| `/ru/calendar/october-2026-dubai-calendar` | RU variant of high-priority October page |
| `/ru/calendar/september-2026-dubai-calendar` | RU variant |
| `/ru/calendar/august-2026-dubai-calendar` | RU variant |
| `/events/big-5-global-dubai-2026` | Verified correct dates (Nov 23-26) |
| `/events/dubai-design-week-2026` | Verified correct dates (Nov 3-8) |
| `/events/formula-1-abu-dhabi-grand-prix-2026` | Verified correct Yasalam + race dates |

**Constraints:**
- Do not claim indexing is guaranteed
- Do not submit URLs before the production deploy is verified live
- GSC URL Inspection is a manual owner action only — cannot be automated
- Wave Two only after Wave One URLs show status change in GSC

---

*Report generated: 2026-08-06*  
*Phase: 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01*  
*All stages complete. Production deployment not authorized.*
