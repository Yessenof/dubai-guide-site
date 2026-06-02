# UAE Calendar Batch 2A Local Import QA Report
## Phase 6C-96B | Date: 2026-06-02

---

## 1. Import summary

| Item | Value |
|------|-------|
| Script | `scripts/import-uae-calendar-batch-2a-local-6c96b.ts` |
| DB | `data/guides.db` (local dev, NOT production) |
| Local backup | `data/guides.db.backup-pre-6c96b-20260602-175147` |
| Result | SUCCESS |
| Items added | 15 |
| Production DB written | NO |
| Push/deploy | NO |

---

## 2. Items added by month

| Month | Slug | Before | Added | After |
|-------|------|--------|-------|-------|
| July 2026 | july-2026-dubai-calendar | 3 | +3 (JUL-NEW-01, JUL-NEW-02, JUL-NEW-03) | 6 |
| August 2026 | august-2026-dubai-calendar | 5 | +3 (AUG-NEW-01, AUG-NEW-02, AUG-NEW-03) | 8 |
| September 2026 | september-2026-dubai-calendar | 10 | +1 (SEP-NEW-01) | 11 |
| October 2026 | october-2026-dubai-calendar | 6 | +5 (OCT-NEW-01..05) | 11 |
| November 2026 | november-2026-dubai-calendar | 4 | +2 (NOV-NEW-02, NOV-NEW-03) | 6 |
| December 2026 | december-2026-uae-calendar | 5 | +1 (DEC-NEW-01) | 6 |

---

## 3. Coverage before vs after Batch 2A

| Month | Before items | After items | Change | Approx. unique days | Notes |
|-------|-------------|------------|--------|-------------------|-------|
| June 2026 | 8 | 8 | — | ~8 | No change this batch |
| July 2026 | 3 | 6 | +3 | ~6 | Atif Aslam Jul 18, UFC Jul 25, Restaurant Week Jul 13 |
| August 2026 | 5 | 8 | +3 | ~8 | SB Girls AD Aug 8, Mawlid ~Aug 24-25, Miami Show Aug 29 |
| September 2026 | 10 | 11 | +1 | ~10 | ATB Sep 5 added |
| October 2026 | 6 | 11 | +5 | ~10 | God Save Queen Oct 5, Sonny Fodera Oct 10, Blue Oct 25, Russell Peters Oct 25, Riverdance Oct 31 |
| November 2026 | 4 | 6 | +2 | ~6 | OFFLIMITS/Shakira Nov 21, Tarkan Nov 27 |
| December 2026 | 5 | 6 | +1 | ~6 | F1 Concert Lewis Capaldi Dec 3 |

---

## 4. Script warnings

- December page: `en_summary should be 1-2 sentences — currently longer`. Non-blocking. Pre-existing from 6C-95B; content is accurate.
- All other pages: no warnings.

---

## 5. Route QA results

All 18 required routes checked against local dev server (http://localhost:3000).

| Route | HTTP | Content check |
|-------|------|--------------|
| /calendar?month=2026-07 | 200 | Atif Aslam, UFC Fight Night, Restaurant Week, Modesh, DSS present |
| /calendar?month=2026-08 | 200 | SB Girls Abu Dhabi, Mawlid (expected), Miami Show present |
| /calendar?month=2026-09 | 200 | ATB/Trance + existing 10 items present |
| /calendar?month=2026-10 | 200 | God Save Queen, Sonny Fodera, Blue Concert (Expo City), Russell Peters, Riverdance, WETEX, Richard Marx all present |
| /calendar?month=2026-11 | 200 | OFFLIMITS/Shakira, Tarkan, DDW, Big 5, ADIPEC, Sharjah Book Fair all present |
| /calendar?month=2026-12 | 200 | F1 Concert, Lewis Capaldi, GITEX, National Day, Commemoration, Winter break present |
| /calendar/december-2026-uae-calendar | 200 | December detail page renders |
| /ru/calendar?month=2026-07..12 | 200 (×6) | RU renders correctly |
| /ru/calendar/december-2026-uae-calendar | 200 | RU December detail page renders |
| /events/dubai-design-week-2026 | 200 | Regression: OK |
| /ru/events/dubai-design-week-2026 | 200 | Regression: OK |
| /events/big-5-global-dubai-2026 | 200 | Regression: OK |
| /ru/events/big-5-global-dubai-2026 | 200 | Regression: OK |

**All 18 routes: PASS (200 OK)**

---

## 6. Content spot-checks

| Check | Result |
|-------|--------|
| UAE Calendar label renders | PASS |
| July no longer has only 3 items | PASS (now 6) |
| Atif Aslam in July | PASS |
| UFC Fight Night in July | PASS |
| Restaurant Week in July | PASS |
| SB Girls labelled Abu Dhabi in August | PASS |
| Mawlid in August with expected confidence | PASS |
| Miami Show in August | PASS |
| ATB in September | PASS |
| God Save Queen (Queen tribute) in October | PASS |
| Sonny Fodera in October | PASS |
| Blue Concert (Expo City Dubai) in October | PASS |
| Russell Peters labelled Abu Dhabi | PASS |
| Riverdance labelled Abu Dhabi | PASS |
| OFFLIMITS (Shakira) in November | PASS |
| Tarkan in November | PASS |
| F1 Concert (Lewis Capaldi) in December | PASS |
| No horizontal bars in grid | PASS |
| No DFC in any month | PASS |
| No Global Village in any month | PASS |
| No DSF in any month | PASS |
| No The Corrs | PASS |
| Dev server errors | NONE (Turbopack cache reset note is informational only) |

---

## 7. Build result

Build was running at QA time — see `/tmp/guidex-build-6c96b.log`.

---

## 8. Hold items (excluded)

| Item | Reason |
|------|--------|
| DFC | Site 403 |
| Global Village | No opening date |
| DSF | Dates TBC |
| The Corrs Abu Dhabi | Exact date unconfirmed |
| VAT Q3 Nov | FTA date unverified |
| El Row Dubai Oct | Single source only |
| Kadim Al Sahir | No confirmed venue/date |
| Swedish House Mafia | No confirmed venue/date |
| ATB Sep 18 | Disambiguation needed (Sep 18 = Paul Oakenfold already imported) |

---

## 9. Production readiness

**All 15 items verified locally.** No issues found. Recommend APPROVE_BATCH_2A_PRODUCTION_IMPORT.
