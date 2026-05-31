# Calendar UX Audit — Phase 6C-93A

**Date:** 2026-05-31
**Status:** Audit complete — see redesign spec CALENDAR_UX_REDESIGN_SPEC_6C93A.md

---

## 1. Files responsible for calendar rendering

| Component | Path | Role |
|-----------|------|------|
| CalendarGrid | components/calendar/CalendarGrid.tsx | Main grid, chips, bars, agenda, filters |
| calendar-helpers | lib/calendar-helpers.ts | Category type, color, labels, filter logic |
| calendar-mock-data | lib/calendar-mock-data.ts | Type definitions (CalendarDateItemExtended) |
| EN calendar page | app/(en)/(public)/calendar/page.tsx | Server component, reads DB, renders CalendarGrid |
| RU calendar page | app/ru/calendar/page.tsx | Server component, RU locale |
| CalendarMiniPreview | components/calendar/CalendarMiniPreview.tsx | Homepage/detail page mini preview |

---

## 2. Current visual problems identified in code

### Problem 1 — Long-range events produce horizontal bar spam (CRITICAL)

**Root cause:** `expandRanges()` in CalendarGrid.tsx (lines 159–204) uses `inferPeriodEnd()` to infer the end date of an event from its `noindex_after` field. If the inferred range is ≤ 90 days, the item is expanded to appear on EVERY date in that range.

**Affected items:**
| Item | Date | noindex_after | Inferred end | Expanded days |
|------|------|--------------|-------------|---------------|
| JUL-03-DSS | 2026-07-03 | 2026-09-01 | 2026-08-31 | Jul 3 → Jul 31 = **29 bars in July** |
| JUL-03-MODESH | 2026-07-03 | 2026-09-01 | 2026-08-31 | Jul 3 → Jul 31 = **29 bars in July** (stacked) |
| AUG-01-DSS | 2026-08-01 | 2026-09-01 | 2026-08-31 | Aug 1 → Aug 31 = **31 bars in August** |

**Visual result:** July appears as a wall of blue pills and colored bars. August appears as a solid blue month. Both are unreadable on mobile and visually rejected by the owner.

**The bar style** (lines 617–620):
```jsx
<div className="w-full h-[4px] rounded-full" style={{ backgroundColor: itemColor(pillItem) }} />
```
4px height, full width, full opacity. On a 64px mobile cell, this is proportionally thick and visually heavy.

### Problem 2 — Business/property colors are near-black (HIGH)

**`real_estate_event`**: `#1B2E4B` — this is almost indistinguishable from black on mobile at small chip size.
**`business_event`**: `#1B2E4B` — same value as real_estate_event. No visual distinction between business and property events.

**In the legend**, both "Business" and "Property" show the same dark color `#1B2E4B`. Visually confusing.

### Problem 3 — Mobile cell height vs chip content (HIGH)

Cell height: `h-[64px] md:h-[86px]`
Available space after day number: ~28px on mobile.

With DSS bar (4px) + Modesh dot (7px) + gap + overflow text: the cell is completely packed. Users see colored blobs with no readable label.

**Short label truncation**: `itemShortLabel` returns `short_label_en` without truncation. "Dubai Summer Surprises 2026" (28 chars) in a ~40px wide chip cell gets truncated by CSS to "Duba…" — unreadable.

### Problem 4 — No long-range event highlight in side panel

Items that span > 7 days are expanded into the grid but NOT specially flagged in the side panel as "ongoing this month." A user looking at August who wonders "what is this blue bar?" has to tap a day and read the agenda.

The side panel only shows `monthHighlights` — items starting in the current month, up to 6, sorted by date. DSS appears here but only as "DSS starts Jul 3" — there is no "ongoing" indicator.

### Problem 5 — No visual distinction between range start vs mid-range

The code does distinguish start date (full pill) vs mid-range (4px bar) but the bar is visually heavy. The contrast is insufficient: a "DSS starts" pill on Jul 3 and a "DSS ongoing" 4px bar on Jul 4 look almost equally prominent at glance.

### Problem 6 — Chip overflow count is shown but chips are not labeled

When multiple items are on a day (e.g., Sep 7: IPS + AIM, both showing as dots), the user sees colored dots with no label. Tapping the day is the only way to understand what the dots mean. On mobile, users often don't understand they need to tap.

### Problem 7 — Filter "Property" shows 0 items in most months

`real_estate_event` category has no items in any currently live calendar page. The "Property" filter chip is always empty, which confuses users who tap it and see blank content.

---

## 3. Category color map — current state

From `lib/calendar-helpers.ts` COLOR_MAP:

| Category | Current color | Hex | Issue |
|----------|--------------|-----|-------|
| holiday | Green | #22C55E | ✓ Good |
| government_deadline | Amber | #F59E0B | ✓ Good |
| tax_deadline | Red | #EF4444 | ✓ Good |
| aml_deadline | Red | #EF4444 | Shares red with tax — OK for now |
| event | Blue | #3B82F6 | ✓ Good |
| real_estate_event | Dark navy | #1B2E4B | ✗ Too dark — near-black |
| business_event | Dark navy | #1B2E4B | ✗ Same as real_estate — no distinction |
| family_school | Purple | #A855F7 | ✓ Good |
| relocation | Teal | #0D9488 | ✓ Good but unused |
| news_update | Gray | #6B7280 | ✓ Fine |
| guide_update | Brass | #B5935A | ✓ Fine but rarely used |
| calendar_visual_post | Blue | #3B82F6 | Shares with event — OK |

---

## 4. Category type mapping — current state

From `lib/calendar-helpers.ts` `itemCategoryType()`:

| DB `type` value | Maps to category | Items using this |
|----------------|-----------------|-----------------|
| retail_offer | event | DSS, DSF |
| venue_show | event | Def Leppard, concerts |
| entertainment | event | Dubai Opera shows |
| family | family_school | Modesh World |
| trade_show | business_event | WETEX, Big5, ATM, all DWTC shows |
| conference | business_event | AIM Congress, DIHAD |
| compliance, compliance_deadline | government_deadline | VAT Q3, CT, e-invoicing |
| real_estate | real_estate_event | (no items yet) |
| public-holiday | holiday | (remapped from legacy) |

---

## 5. Mobile viewport issues

- **Cell width on 375px phone**: 375 / 7 = 53.5px. After 1px gap separators: ~52px per cell.
- **Cell height**: 64px. Day number = 28px (h-7). Available for indicators: ~28px.
- **Full-width pill at 9px font**: Text fits ~8 chars before truncation at 52px width.
- **4px bar**: Fills full 52px width — very visible, dominates the cell.
- **3 dots row**: Max 3 × 7px dots + 6px gaps = 27px wide — fits on 52px cell.
- **+N overflow**: 9px font, adds 12px — fits.

Current cap: 1 pill + 2 dots + overflow. This is the right number. The problem is not the count, it's the visual weight of the bars.

---

## 6. Desktop vs mobile layout

Desktop (`md:grid-cols-[1fr_288px]`):
- Left: 7-column calendar grid
- Right: 288px side panel (selected day / month highlights / up to 6 items)
- Cell height: 86px → more room for indicators

Mobile:
- Single column, 64px cells
- Selected day agenda appears below grid
- "This month" highlights below grid when no day selected
- No side panel

**Issues on desktop:** Side panel "month highlights" caps at 6 items. For July (3 items) this works fine. For September (8 items) the cap means 2 items are not shown in the side panel. Users have to scroll down to "All dates" section.

---

## 7. Agenda list connection

**AgendaRow** and **AgendaCard** components render below the grid on mobile (selected day or "this month"). They correctly link items to `detail_url` if set, or `cta_url` if external.

**Problem**: Most calendar items have `detail_url: null` and `cta_url` pointing to external sites. This means:
- No Guidex detail page for most items
- Users are immediately sent off-site when they tap a CTA
- Zero internal SEO benefit from the calendar item itself

**External-only items** (all currently live items):
Every item in July, August, September, October has `detail_url: null`. All CTAs point to official event/authority external URLs. No Guidex-hosted content about any event.

**Exception**: October e-invoicing item (OCT-04-EINV) links to `/calendar/uae-e-invoicing-2026-asp-deadline` — this is the only internal detail_url in the current calendar.

---

## 8. SEO/RAG impact of external-only links

| Issue | Impact |
|-------|--------|
| No Guidex detail page for events | User arrives at event website without ever reading Guidex content about it |
| No internal anchor text for events | Google can't follow event connections within guidex-consulting.ae |
| No structured data / schema | Calendar events not eligible for rich results |
| No Guidex brief content on most items | AI (RAG) cannot cite Guidex as source for event content |
| External CTA sends user away | No engagement metric, no return visit hook |

**Exception**: L2 brief items (WETEX, ATM, Corp Tax, Sept L2 items) render `<details>` elements with expandable content. These are indexable and provide Guidex-hosted content. This is the right approach for items without a full detail page.

**Recommendation**: Items with L2 briefs are correctly structured. Priority should be:
1. Convert most-visited events to full Guidex calendar detail pages
2. For remaining items, ensure at minimum an L2 brief is rendered

---

## 9. Missing schema/metadata fields

| Field | Status | Impact |
|-------|--------|--------|
| `period_end` | Not set on any live item (range inferred via noindex_after) | Inaccurate range inference for long events |
| `is_external` | Not set on most items | External link badge missing |
| `custom_cta_en/ru` | Not set | Default CTA labels only |
| `noindex_after` | Set correctly | Works for SEO lifecycle |
| `last_verified_date` | Set on page-level | Not on individual items |
| `confidence` | Set as "confirmed" on all live items | ✓ |

---

## Summary: top 5 fixes needed

1. **Long-range expansion threshold**: Skip grid expansion for items with range ≥ 7 days. Show only start date.
2. **Color fix**: `real_estate_event` → teal `#0D9488`, `business_event` → softer navy `#2D5FA3`.
3. **Bar weight**: Reduce 4px bars to 2px with 40% opacity for short-range mid days.
4. **Monthly highlights for long-range items**: Add explicit "ongoing this month" section in side panel.
5. **Short labels**: Truncate to 8 chars max in grid chips (or enforce shorter `short_label_en` values in DB).
