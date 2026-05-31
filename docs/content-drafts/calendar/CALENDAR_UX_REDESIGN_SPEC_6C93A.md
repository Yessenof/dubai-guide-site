# Calendar UX Redesign Spec — Phase 6C-93A

**Date:** 2026-05-31
**Status:** Spec approved for local implementation (Part C)

---

## Core problem statement

The current calendar renders long-range events (DSS: 59 days, Modesh: same) as heavy horizontal bars across every single day of July and August. This makes both months look like solid blue lines, rendering the grid unreadable. Users cannot understand what events fall on which days. The calendar loses its core utility as a date reference.

---

## Design rule 1 — Long-range threshold

**Rule:** Events with a visual range ≥ 7 days are "month-level highlights." They must NOT be expanded to individual day bars in the grid.

**Implementation:**
- In `expandRanges()`: if inferred or explicit range ≥ 7 days → push only the start date entry, no expansion.
- For cross-month items with explicit `period_end`: show on the first visible day of the current month, but only that one day in the grid.
- The month-level highlights side panel (already present) surfaces these items naturally.

**Before (July with DSS):** Jul 3-31 = 29 identical blue bars across every cell.
**After (July with DSS):** Jul 3 = one "DSS" chip. Jul 4-31 = clean. Side panel shows "DSS — Jul 3 to Aug 30."

---

## Design rule 2 — Short-range mid-day bars

**Rule:** Events spanning 2–6 days can still show continuation bars on mid-range days, but bars must be subtle, not dominant.

**New bar style:**
- Height: 2px (was 4px)
- Opacity: 40% (was 100%)
- Full width, rounded

**Before:** 4px solid-color bar fills ~6% of cell height and grabs attention.
**After:** 2px translucent bar is a gentle "this continues" hint, not a visual headline.

---

## Design rule 3 — Chip labels

**Rule:** Start-date chips show short label text. Labels must not exceed 9 characters before CSS truncation kicks in.

**Target short labels:**
| Event | Target short_label_en | Notes |
|-------|----------------------|-------|
| Dubai Summer Surprises | DSS | 3 chars ✓ |
| Modesh World | Modesh | 6 chars ✓ |
| Dubai Fitness Challenge | DFC | 3 chars ✓ |
| GITEX Global | GITEX | 5 chars ✓ |
| Big 5 Global | Big 5 | 5 chars ✓ |
| Dubai Design Week | Design Wk | 9 chars ✓ |
| Arabian Travel Market | ATM | 3 chars ✓ |
| VAT Q3 deadline | VAT Q3 | 6 chars ✓ |
| Corp Tax deadline | Corp Tax | 8 chars ✓ |
| E-invoicing ASP | E-inv | 5 chars ✓ |
| Beautyworld Dubai | Beauty | 6 chars ✓ |
| WETEX 2026 | WETEX | 5 chars ✓ |

**Implementation note:** Short labels can be fixed by updating `short_label_en/ru` in the DB during the next import phase. For the current local code patch, the truncation CSS already handles overflow.

---

## Design rule 4 — Mobile chip cap

**Rule:** Maximum 2 visible chip-items per cell on mobile, max 3 on desktop. Overflow shown as +N.

**Current code already implements this** (1 pill + 2 dots + overflow). No change needed.

**Additional note:** Long-range items that now only show on their start date will not consume a chip slot on non-start days. This frees up chip space for other items.

---

## Design rule 5 — Ongoing month highlights

**Rule:** Long-range events (≥ 7 days) that are active during the current month must appear in the "This month" side panel with an "Ongoing" badge.

**Implementation:**
- Existing `monthHighlights` already includes these because they start in the current month and are in `filteredMonthItems`.
- For cross-month items (explicit `period_end` starting in previous month), they may NOT appear in `filteredMonthItems` since it filters by `item.date.startsWith(prefix)`. Need a separate `crossMonthLongRangeItems` computed value for items that started before this month but are still active.
- Show these at top of side panel with "Ongoing" badge.

**For Phase C (local patch):** Items that START in the current month (like DSS in August starting Aug 1, DSS in July starting Jul 3) will naturally appear in `monthHighlights`. Cross-month case is a refinement for a future phase.

---

## Design rule 6 — Category colors

**New color map:**

| Category | New color | Hex | Rationale |
|----------|-----------|-----|-----------|
| holiday | Green | #22C55E | Unchanged ✓ |
| government_deadline | Amber | #F59E0B | Unchanged ✓ |
| tax_deadline | Red | #EF4444 | Unchanged ✓ |
| aml_deadline | Red | #EF4444 | Unchanged ✓ |
| event | Blue | #3B82F6 | Unchanged ✓ |
| **real_estate_event** | **Teal** | **#0D9488** | Was near-black #1B2E4B — now distinct |
| **business_event** | **Soft navy** | **#2D5FA3** | Was near-black #1B2E4B — now lighter, distinguishable |
| family_school | Purple | #A855F7 | Unchanged ✓ |
| relocation | Teal | #0D9488 | Note: shares with real_estate now — acceptable |
| news_update | Gray | #6B7280 | Unchanged ✓ |
| guide_update | Brass | #B5935A | Unchanged ✓ |
| calendar_visual_post | Blue | #3B82F6 | Unchanged ✓ |

---

## Design rule 7 — Mobile agenda

**Rule:** Selected-day agenda appears directly below the grid on mobile with no scroll needed.

**Current code:** `{selectedDay && <div className="md:hidden mt-5">...}` — this already renders below the grid.

**No change needed** for core behavior. Enhancement: add a subtle scroll indicator or arrow pointing down when a day is tapped, to help users discover the agenda below on small phones. (Future enhancement — not in Phase C patch.)

---

## Design rule 8 — Month navigation

Current nav shows 5 positions: ← prev-prev prev **Current** next next-next →

This works well on mobile and desktop. No change.

---

## Design rule 9 — Empty month handling

Items with a "Property" filter showing 0 results currently show an empty state. This is acceptable as-is since the `real_estate_event` category has no live items. As property content is added (Dubai Design Week has property audience, IPS, etc.), the filter will populate.

**No change needed for Phase C.** Note for future: add relevant items to real_estate_event to populate the Property filter.

---

## Breakpoints and responsive behavior

| Breakpoint | Grid layout | Cell height | Chips |
|-----------|-------------|-------------|-------|
| Mobile (<768px) | 1-col (full width) | 64px | max 2 visible |
| Desktop (≥768px) | grid 1fr + 288px sidebar | 86px | max 3 visible |

Both remain correct after the long-range patch. The key visual change is:
- July: 29 bars removed → clean grid with DSS chip on Jul 3 only
- August: 31 bars removed → clean grid with DSS chip on Aug 1 only

---

## What the patch does NOT change

- Mobile selected-day agenda behavior (already works)
- Filter chip behavior
- Month/year picker
- AgendaCard / AgendaRow / GroupedAgendaCard layout
- Legend
- Month navigation
- Server-side data loading
- Route structure
- DB schema

---

## Testing checklist (local)

After applying the patch:
- [ ] July 2026: Jul 3 shows DSS chip. Jul 4-31 are clean (no DSS bars).
- [ ] August 2026: Aug 1 shows DSS chip. Aug 2-31 are clean.
- [ ] Sep/Oct: short-range events (3-4 days) still show 2px subtle continuation bars.
- [ ] Business chip color is #2D5FA3 (medium blue), not near-black.
- [ ] Property chip color is #0D9488 (teal).
- [ ] Side panel "This month in Dubai" still shows DSS in July and August.
- [ ] Tapping Jul 3 shows DSS in selected-day agenda.
- [ ] Tapping Jul 4 shows empty or other non-DSS items.
- [ ] RU calendar renders correctly with same changes.
- [ ] No TypeScript errors. Build passes.
- [ ] No broken layout at 375px.
