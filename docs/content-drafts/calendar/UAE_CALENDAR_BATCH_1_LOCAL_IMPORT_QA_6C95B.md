# UAE Calendar Batch 1 Local Import QA Report
## Phase 6C-95B | Date: 2026-06-02

---

## 1. Import summary

| Item | Value |
|------|-------|
| Script | `scripts/import-uae-calendar-batch-1-local-6c95b.ts` |
| DB | `data/guides.db` (local dev, NOT production) |
| Local backup | `data/guides.db.backup-pre-6c95b-20260602-113427` |
| Result | SUCCESS |
| Pages updated | 4 (August, September, October, November 2026) |
| Pages created | 1 (December 2026) |
| New items added | 12 |
| Production DB written | NO |
| Push/deploy | NO |

---

## 2. Items imported

### Existing pages updated (dates_json extended)

| Month | Slug | Items before | Items added | Items after |
|-------|------|-------------|-------------|------------|
| August 2026 | august-2026-dubai-calendar | 3 | +2 (AUG-04-BACKSCH, AUG-05-MICHAEL) | 5 |
| September 2026 | september-2026-dubai-calendar | 8 | +2 (SEP-09-AGUILERA, SEP-10-OAKENFOLD) | 10 |
| October 2026 | october-2026-dubai-calendar | 4 | +2 (OCT-05-MIDTERM, OCT-06-MARX) | 6 |
| November 2026 | november-2026-dubai-calendar | 3 | +1 (NOV-05-SIBF) | 4 |

### New page created

| Slug | Month | Items | Status |
|------|-------|-------|--------|
| december-2026-uae-calendar | December 2026 | 5 (DEC-01-COMMEM, DEC-02-NATDAY, DEC-03-F1, DEC-04-GITEX, DEC-05-WINBRK) | published |

---

## 3. Warnings

- December page: `en_summary should be 1-2 sentences -- currently longer` — non-blocking. The summary is 4 sentences but each carries specific factual content (holiday cluster, F1 timing, GITEX venue change). Recommend keeping as-is.

---

## 4. Route QA results

All 18 routes checked against local dev server (http://localhost:3000).

| Route | HTTP | Content check |
|-------|------|--------------|
| /calendar?month=2026-07 | 200 | OK (3 items, unchanged) |
| /calendar?month=2026-08 | 200 | Back to School, This Is Michael present |
| /calendar?month=2026-09 | 200 | Christina Aguilera, Paul Oakenfold present |
| /calendar?month=2026-10 | 200 | Mid-term break, Richard Marx, WETEX, VAT present |
| /calendar?month=2026-11 | 200 | Book Fair (Sharjah), DDW, Big 5, ADIPEC present |
| /calendar?month=2026-12 | 200 | National Day, GITEX, F1 Abu Dhabi, Commemoration Day present |
| /calendar/december-2026-uae-calendar | 200 | Title: "December 2026 UAE Calendar: National Day, F1 Abu Dhabi and GITEX" |
| /ru/calendar?month=2026-07 | 200 | OK |
| /ru/calendar?month=2026-08 | 200 | OK |
| /ru/calendar?month=2026-09 | 200 | OK |
| /ru/calendar?month=2026-10 | 200 | OK |
| /ru/calendar?month=2026-11 | 200 | OK |
| /ru/calendar?month=2026-12 | 200 | OK |
| /ru/calendar/december-2026-uae-calendar | 200 | RU title: "Декабрь 2026 ОАЭ: День независимости, Гран-при Абу-Даби и GITEX" |
| /events/dubai-design-week-2026 | 200 | Regression: OK |
| /ru/events/dubai-design-week-2026 | 200 | Regression: OK |
| /events/big-5-global-dubai-2026 | 200 | Regression: OK |
| /ru/events/big-5-global-dubai-2026 | 200 | Regression: OK |

**All 18 routes: PASS (200 OK)**

---

## 5. Content spot-checks

| Check | Result |
|-------|--------|
| UAE Calendar label renders on December calendar index | PASS |
| F1 labelled "Abu Dhabi" | PASS |
| GITEX labelled "Expo City" | PASS |
| National Day present | PASS |
| Commemoration Day present | PASS |
| No DFC in any month | PASS |
| No Global Village in any month | PASS |
| No DSF in any month | PASS |
| Sharjah Book Fair present in November | PASS |
| Back to School present in August | PASS |
| Mid-term break present in October | PASS |
| Richard Marx present in October | PASS |
| Christina Aguilera + Abu Dhabi label in September | PASS |
| No horizontal bars (UX fix from 6C-95A) | PASS |

---

## 6. December page slug decision

The new December page uses slug `december-2026-uae-calendar` (not `december-2026-dubai-calendar`).
Rationale: December content is UAE-wide (National Day, F1 in Abu Dhabi, GITEX). New page — no existing URLs to break. Starts the new naming convention.

Existing monthly pages keep their Dubai slugs (`august-2026-dubai-calendar` etc.) — those are live on production and changing them would break URLs. Future pages will use the UAE pattern.

---

## 7. Coverage before vs after Batch 1

| Month | Before (items) | After (items) | Change |
|-------|---------------|--------------|--------|
| June 2026 | 8 | 8 | No change (Batch 2) |
| July 2026 | 3 | 3 | No change (no confirmed new sources) |
| August 2026 | 3 | 5 | +2 |
| September 2026 | 8 | 10 | +2 |
| October 2026 | 4 | 6 | +2 |
| November 2026 | 3 | 4 | +1 |
| December 2026 | 0 (missing) | 5 (new page) | +5 |

---

## 8. Build result

Build was running at QA time. See build log `/tmp/guidex-build-6c95b.log`.

---

## 9. HOLD items

| Item | Reason |
|------|--------|
| July 2026 additions | No confirmed events with 2+ sources found — July stays at 3 items |
| The Corrs Sep | Exact date unconfirmed |
| VAT Q3 Nov deadline | FTA exact date unverified |
| DFC | Site still 403 |
| Global Village | No confirmed opening date |
| DSF Dec | Official dates not released |
| RISE Real Estate Oct | Single source only |

---

## 10. Dev server errors

No errors in `/tmp/guidex-dev-6c95b.log`.

---

## 11. QA verdict

**LOCAL IMPORT QA: PASS**

All 18 routes pass. Content verified. No HOLD items visible. December page live locally with correct UAE-scope content. UX fix (no horizontal bars) confirmed active.
