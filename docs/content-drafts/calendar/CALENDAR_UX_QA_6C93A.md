# Calendar UX QA Notes — Phase 6C-93A Local Patch

**Date:** 2026-05-31
**Status:** Local code only — no deploy, no push

---

## Changes implemented

### 1. `lib/calendar-helpers.ts`

| Change | Before | After |
|--------|--------|-------|
| real_estate_event color | #1B2E4B (near-black) | #0D9488 (teal) |
| business_event color | #1B2E4B (near-black) | #2D5FA3 (medium blue) |

### 2. `components/calendar/CalendarGrid.tsx`

| Change | Before | After |
|--------|--------|-------|
| Long-range threshold constant | (none) | LONG_RANGE_DAYS = 7 |
| Range expansion for inferred ranges ≥ 7 days | Expanded to all days in month | Start date only (no expansion) |
| Range expansion for explicit period_end ≥ 7 days | Expanded all days | First visible day only |
| Mid-range bar height | h-[4px] 100% opacity | h-[2px] opacity-40 |
| Mid-range dot opacity | 55% | 35% |
| Mid-range dot size | w/h-[7px] | w/h-[6px] |
| Legend Business color | #1B2E4B | #2D5FA3 |
| Legend Property color | #1B2E4B | #0D9488 |

---

## Expected visual results by month

### July 2026
- **Before:** Jul 3-31 = 29 blue bars (DSS). Jul 3 = DSS pill + Modesh dot.
- **After:** Jul 3 = DSS chip (short label, starts here) + Modesh dot. Jul 4-31 = clean cells, no bars.
- Side panel "This month" still shows DSS (it starts Jul 3, which is in July).

### August 2026
- **Before:** Aug 1-31 = solid blue bar across every day (AUG-01-DSS, 31-day range). Aug 2 + Aug 24-26 had additional events.
- **After:** Aug 1 = DSS chip (monthly highlight). Aug 2 = Def Leppard chip. Aug 3-23 = clean. Aug 24-26 = DIHAD event with short range (3 days ≤ 7 threshold? → 3 days < 7 → still expanded). Aug 24 pill + Aug 25-26 = 2px subtle bars.
- **Net result:** August now has only 3 actual event markers (Aug 1, Aug 2, Aug 24-26). Clean and readable.

### September 2026
- All Sep items are 3-4 days. 4 days < 7 → still expanded as before.
- SEP-02-IPS Sep 7-9 (3 days): Sep 7 pill + Sep 8-9 = 2px subtle bars. ✓
- SEP-04-ATM Sep 14-17 (4 days): Sep 14 pill + Sep 15-17 = 2px bars. ✓
- Sep bar color: trade_show → business_event → was dark navy, now #2D5FA3. Better contrast.

### October 2026
- All items are single-day or 3-day short range.
- Oct 6-8 Beautyworld (3 days): Oct 6 pill + Oct 7-8 = 2px bars. ✓
- Oct 20-22 WETEX (3 days): Oct 20 pill + Oct 21-22 = 2px bars. ✓
- Oct 28 VAT: single day. ✓
- Oct 30 E-inv: single day, internal link. ✓

---

## TypeScript check

```
npx tsc --noEmit → 0 errors
```

---

## Build check

```
npm run build → pending (run before deploy, not required for local review)
```

---

## Manual QA checklist

Run the dev server (`npm run dev -- --hostname 0.0.0.0`) and check:

- [ ] Navigate to /calendar?month=2026-07 — no blue bars Jul 4-31, DSS chip on Jul 3
- [ ] Navigate to /calendar?month=2026-08 — no bars Aug 2-31 except Aug 24-26 short bars
- [ ] Jul/Aug: "This month in Dubai" side panel still shows DSS as a highlight
- [ ] Tap Jul 3 → agenda shows DSS full label. Tap Jul 5 → empty or other items
- [ ] Sep trade show chips are #2D5FA3 (medium blue), not near-black
- [ ] Oct WETEX color is same softer blue
- [ ] Oct VAT/E-inv chips are red/amber (compliance — unchanged)
- [ ] Legend shows "Business" = medium blue, "Property" = teal
- [ ] Mobile at 375px: cells render correctly without overflow
- [ ] RU calendar (/ru/calendar?month=2026-07) shows same changes
- [ ] No raw JSON or markdown on any calendar page

---

## Known remaining issues (not in scope for this patch)

1. **`short_label_en` for DSS**: "Dubai Summer Surprises 2026" (28 chars) → truncated by CSS to ~"Dubai S…" on mobile chip. Fix: update DB `short_label_en` to "DSS" in a future import phase.
2. **`period_end` not set**: All multi-day items still use `noindex_after` inference. Fix: set explicit `period_end` in future import scripts.
3. **No detail pages for events**: All but 1 item use external CTAs. Fix: build events detail pages for GITEX, ATM, DDW in future phases.
4. **KHDA school dates missing**: August/September have zero family/school items. Fix: source KHDA calendar in future phase.
5. **August thin content**: 3 items = weak SEO signal. Fix: enrich with compliance items or KHDA school content.
