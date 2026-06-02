# UAE Calendar Density Targets — June to December 2026
## Phase 6C-95A | Date: 2026-06-01

---

## Methodology

- "Items" = DATES_JSON entries in the calendar_pages table
- "Unique days covered" = count of distinct dates covered by items (start dates)
- "Coverage %" = unique days / total days in month × 100
- Counts are from local dev DB (production DB has same monthly calendar pages, may differ slightly)

---

## Current state

| Month | Days | Current items | Unique days | Coverage % | Status |
|-------|------|--------------|-------------|-----------|--------|
| June 2026 | 30 | 8 | ~8 | ~27% | WEAK |
| July 2026 | 31 | 3 | ~3 | ~10% | CRITICAL |
| August 2026 | 31 | 3 | ~3 | ~10% | CRITICAL |
| September 2026 | 30 | 8 | ~8 | ~27% | WEAK |
| October 2026 | 31 | 4 | ~4 | ~13% | CRITICAL |
| November 2026 | 30 | 3 | ~3 | ~10% | CRITICAL |
| December 2026 | 31 | 0 | 0 | 0% | MISSING |

---

## Target state (after Phase 6C-95B import)

| Month | Target items | Target unique days | Target coverage % | Priority |
|-------|-------------|-------------------|------------------|----------|
| June 2026 | 12-15 | 12-14 | 40-47% | Medium |
| July 2026 | 8-12 | 7-10 | 23-32% | HIGH |
| August 2026 | 10-14 | 9-12 | 29-39% | HIGH |
| September 2026 | 12-16 | 11-13 | 37-43% | High |
| October 2026 | 10-14 | 9-11 | 29-35% | HIGH |
| November 2026 | 8-12 | 7-10 | 23-33% | High |
| December 2026 | 10-14 | 9-12 | 29-39% | HIGH (new page needed) |

Minimum target: **15+ useful items per month** if sources exist.

---

## Target category mix per month (minimum)

Each month should include at minimum:
- 2-3 entertainment/lifestyle/concert items
- 2-3 business/trade show/exhibition items
- 1-2 government/compliance/deadline items
- 1-2 UAE-wide/Abu Dhabi/Sharjah items
- 1-2 school/family/seasonal dates
- 1-2 major anchor events or festival items

---

## Month-by-month gap analysis

### June 2026 (current: 8 items, ~27%)
**What's in:** Emiratisation deadline, e-invoicing deadline, Eid Al Adha (carried), some compliance items.
**Missing:** Concerts, lifestyle events, DSS preview/announcement, family events.
**New YES_READY candidates:** 2-3 (business compliance, pre-DSS notes)
**Blocker:** June is genuinely quieter; summer season starts July. Target 12 is realistic.

### July 2026 (current: 3 items, ~10%)
**What's in:** DSS launch, 1-2 others.
**Missing:** DSS sub-events, Modesh World, summer family events, concert dates.
**New YES_READY candidates:** 4-6 (DSS launch, Modesh World, school break end, summer offers)
**Blocker:** None. DSS is OFFICIAL_CONFIRMED July 2 - Aug 30.

### August 2026 (current: 3 items, ~10%)
**What's in:** DSS continues, some items.
**Missing:** Back to School (Aug 31), concerts (SB Girls Aug 9, This Is Michael Abu Dhabi Aug 22), Back to School shopping wave.
**New YES_READY candidates:** 5-7
**Blocker:** None for confirmed items.

### September 2026 (current: 8 items, ~27%)
**What's in:** Corporate tax deadline (Sep 30), some business items.
**Missing:** Concerts (Christina Aguilera Sep 25, Paul Oakenfold Sep 18), school events, Back to School settling in.
**New YES_READY candidates:** 4-5
**Note:** Corporate tax deadline Sep 30 is the anchor item.

### October 2026 (current: 4 items, ~13%)
**What's in:** GITEX (but GITEX moved to December 2026!), some items.
**Missing:** WETEX Oct 20-22, mid-term break Oct 12-18, schools reopen Oct 19, RISE Oct 13-14, Richard Marx Oct 5.
**New YES_READY candidates:** 5-7
**IMPORTANT:** GITEX Global 2026 moved from October to December 7-11. October calendar page may have incorrect GITEX date. MUST VERIFY and correct.

### November 2026 (current: 3 items, ~10%)
**What's in:** DDW, Big5, ADIPEC (imported in 6C-94D).
**Missing:** Sharjah International Book Fair Nov 4-15.
**New YES_READY candidates:** 1-2
**Note:** November is already solid with 3 major items. SIBF adds Sharjah cultural angle.

### December 2026 (current: 0 items, page missing)
**What's in:** Nothing — no December calendar page exists yet.
**Needed:** New december-2026-dubai-calendar page.
**Items:** UAE National Day Dec 2-3, Commemoration Day Dec 1, F1 Abu Dhabi Dec 4-6, GITEX Global Dec 7-11, school winter break Dec 14+, DSF (hold, date TBC).
**New YES_READY candidates:** 5-6 (without DSF)
**Blocker:** Need to create the page. GITEX date confirmation is key (December 7-11 from official gitex.com).

---

## Recommended import batch order

**Batch 1 (immediate, Phase 6C-95B):**
1. December 2026 calendar page (new) — anchor: Commemoration Day, National Day, F1, GITEX
2. July 2026 additions — DSS launch item (update existing page)
3. August 2026 additions — Back to School Aug 31, concerts
4. October 2026 corrections — GITEX date correction, add WETEX, mid-term break, RISE, Richard Marx

**Batch 2 (follow-on, Phase 6C-95C):**
5. September 2026 additions — concerts, Back to School context items
6. November 2026 additions — Sharjah Book Fair
7. June 2026 additions — compliance items if any new deadlines confirmed

---

## Critical correction required

**October calendar page likely contains GITEX at wrong dates.**
GITEX Global moved from October to December 7-11, 2026 (moved to Expo City Dubai).
Before importing October items, verify and remove/correct any GITEX October item.

Sources:
- gitex.com/gitex-global-2026: December 7-11
- mediaoffice.ae: confirmed move to Expo City Dubai December
- whatson.ae/2025/10/gitex-global-set-for-new-location-and-dates-in-2026/
