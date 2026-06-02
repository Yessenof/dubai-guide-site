# UAE Calendar UX Redesign
## Phase 6C-95A | Date: 2026-06-01

---

## 1. Old UX problems (owner feedback)

1. **Horizontal continuation bars** — Multi-day events drew a 2px full-width colored bar across every active date cell. Even after the 6C-93A "fix" (reducing from full pill to 2px line), the bars still created visual "walls" and looked unclear.
2. **Too empty** — With only 1-3 calendar items per month, months looked barren. Business-only content made the calendar feel narrow.
3. **Product name** — "Dubai Calendar" undersells scope; product now includes Abu Dhabi and UAE-wide events.
4. **Panel label** — "This month in Dubai" was too limiting.

---

## 2. New UX rules (applied in this phase)

### Grid cell — visual hierarchy

1. **Start date of an event:** Colored pill with short label (unchanged).
2. **Mid-range active days:** Small dim dot (5px, opacity 0.4) — no horizontal bar of any kind.
3. **Dot items (secondary):** 6px colored dots, dimmed at opacity 0.35 for range continuations.
4. **Overflow:** +N count.

### Long-range events (≥ 7 days, LONG_RANGE_DAYS threshold)

Already show only on start date (no expansion). This was working correctly before and is preserved.

### Short-range events (< 7 days)

Previously expanded to all days with a full-width 2px bar on active days. Now: active days show only a small 5px dim dot. Start date still shows the full labeled pill.

### Agenda / list panel

Unchanged — this already carries full date ranges, descriptions, and CTAs. No regression.

### Labels

- "This month in Dubai" → "This month in the UAE" (EN)
- "В этом месяце в Дубае" → "В этом месяце в ОАЭ" (RU)

---

## 3. Component files changed

| File | Change |
|------|--------|
| `components/calendar/CalendarGrid.tsx` | Removed 2px horizontal bar for mid-range pillItem; replaced with 5px dim dot. Updated panel labels (Dubai → UAE). |

---

## 4. Design rationale

The 2px bar created a "horizontal stripe" visual pattern when multi-day events were active. Even at reduced opacity, stripes draw the eye and create visual confusion — especially when multiple events overlap.

A small dot communicates "something is active" without creating structure or dominating the cell. The pill on the start date already communicates the event clearly. The agenda panel provides full detail on day click.

This approach prioritizes:
- Clean grid cells even when 3-5 items are active
- Start date as the clear anchor for event identity
- Agenda panel as the detail layer

---

## 5. Known limitations not addressed in this phase

- The calendar grid is still sparse for summer months (June-August). This is a content problem, not a UX problem. Coverage recovery is in Parts D-F.
- The grid cell height (`h-[64px] md:h-[86px]`) is fixed. With more items per day, overflow is handled by `+N` count.
- No change to the grid layout or cell sizing — this preserves consistency with existing month pages.
