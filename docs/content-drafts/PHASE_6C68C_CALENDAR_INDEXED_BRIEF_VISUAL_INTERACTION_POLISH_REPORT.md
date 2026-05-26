# Phase 6C-68C — Calendar Indexed Brief Visual & Interaction Polish Report

**Date:** 2026-05-26
**Phase:** 6C-68C
**Scope:** Code only — visual/interaction polish pass on calendar brief UI. No DB import. No production deploy. No push. No schema change. No commit without owner approval.

---

## What Was Done

Owner screenshot review of Phase 6C-68 local QA found 5 UX/visual issues. This phase resolves all of them:

1. Calendar preview block linked to wrong month (May instead of July for e-invoicing)
2. Agenda cards on `/calendar?month=2026-07` had no clear action for items with briefs
3. "DETAILS" section heading was too generic and technical
4. Dates list text was too light and small
5. Agenda rows were pale and weak with unclear CTAs

---

## Issues Found and Fixed

| # | Issue | Root cause | Fix |
|---|---|---|---|
| 1 | E-invoicing preview linked to May (wrong month) | `resolveCalendarMonth` returned `undefined` for multi-month pages; `CalendarMiniPreview` fell back to generic `/calendar` (which defaults to current/live month) | Changed `resolveCalendarMonth` to return earliest date month for non-yearly pages; yearly pages (Long Weekends) still return `undefined` (generic link) |
| 2 | Agenda cards: no clear CTA for brief items | `itemCtaLabel` used type-based label ("Tax deadline →") for brief items that lack `detail_url`; Scenario A items (no `detail_url`) showed no CTA at all | Updated `itemCtaLabel` to prefer "Show details →" / "Показать детали →" when `brief_en`/`brief_ru` exists; added `cta_url` as external-link fallback in AgendaCard/Row when `detail_url` is absent |
| 3 | "DETAILS" / "ПОДРОБНЕЕ" heading too generic | Section heading was a raw repurposed word | Changed to "Key date notes" (EN) / "Пояснения к датам" (RU) |
| 4 | Dates list too light/small | `text-[13px] font-medium text-gray-800` on titles | Bumped to `text-[14px] font-semibold text-gray-900`; added "notes ↓" / "детали ↓" pill indicators on items with brief content |
| 5 | Agenda rows pale and weak | `text-[13px] font-medium text-gray-800` on AgendaRow labels; missing CTA on items with only `cta_url` | Bumped AgendaRow label to `text-[14px] font-semibold text-gray-900`; same external-cta fallback pattern; GroupedAgendaRow labels bumped similarly |

---

## Files Modified

| File | Change |
|---|---|
| `app/(en)/(public)/calendar/[slug]/page.tsx` | `resolveCalendarMonth` accepts `calendarType` param; passes `page.calendarType`; dates list UI improved (larger text, brief indicator) |
| `app/ru/calendar/[slug]/page.tsx` | Same changes as EN page |
| `components/calendar/CalendarBriefSection.tsx` | Section heading renamed; `<summary>` redesigned (date badge, larger title, type pill, "Show/Детали ›" hint); expanded content improved (bold section labels, structured layout, CTA as pill button) |
| `components/calendar/CalendarGrid.tsx` | `AgendaCard`: external `cta_url` fallback + CTA text size; `AgendaRow`: external `cta_url` fallback, font bump, `useExternal` logic; `GroupedAgendaRow`: same fallback, font bump; `GroupedAgendaCard`: same fallback |
| `lib/calendar-helpers.ts` | `itemCtaLabel` now checks `brief_en`/`brief_ru` before type-based default — returns "Show details →" / "Показать детали →" for brief-aware items |

---

## Task 1 — Preview Month Target Fix

### Logic change in `resolveCalendarMonth`

**Before:**
```ts
function resolveCalendarMonth(year, month, dates) {
  if (month) return `${year}-${String(month).padStart(2, "0")}`;
  if (dates.length === 0) return undefined;
  const months = [...new Set(dates.map(d => d.date.slice(0, 7)))];
  return months.length === 1 ? months[0] : undefined;  // multi-month → always generic
}
```

**After:**
```ts
function resolveCalendarMonth(year, month, dates, calendarType?) {
  if (month) return `${year}-${String(month).padStart(2, "0")}`;
  if (dates.length === 0) return undefined;
  const months = [...new Set(dates.map(d => d.date.slice(0, 7)))].sort();
  if (months.length === 1) return months[0];
  if (calendarType === "yearly") return undefined;  // yearly pages stay generic
  return months[0];  // multi-month non-yearly pages → earliest month
}
```

### Results

| Page | Before | After |
|---|---|---|
| `/calendar/uae-e-invoicing-2026-asp-deadline` | Links to generic `/calendar` (opens May) | Links to `/calendar?month=2026-07` (July) ✓ |
| `/ru/calendar/uae-e-invoicing-2026-asp-deadline` | Same | Links to `/ru/calendar?month=2026-07` ✓ |
| `/calendar/may-2026-uae-calendar` | `/calendar?month=2026-05` | Unchanged ✓ |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | `/calendar?month=2026-06` | Unchanged ✓ |
| `/calendar/uae-long-weekends-2026-2027` | Generic `/calendar` + yearBadge "2026" | Generic `/calendar` + yearBadge "2026" ✓ (unchanged) |

---

## Task 2 — Agenda Card CTA Improvements

### `itemCtaLabel` change

Items with `brief_en` (EN) or `brief_ru` (RU) now get CTA label:
- EN: "Show details →"
- RU: "Показать детали →"

Priority: custom_cta > brief-aware > type-based.

### External `cta_url` fallback in AgendaCard / AgendaRow / GroupedAgendaRow / GroupedAgendaCard

Items with `cta_type: "open_source"` and `cta_url` starting with `http` — but no `detail_url` — previously showed no CTA link. Now the external `cta_url` is used as a fallback href with `target="_blank"`. This allows Scenario A items (TAX-05A, pilot open date) to show the official MoF source link in the agenda cards.

No changes to grouping, sorting, or grid rendering.

---

## Task 3 — CalendarBriefSection Visual Redesign

### Section heading
- EN: `"DETAILS"` → `"Key date notes"`
- RU: `"ПОДРОБНЕЕ"` → `"Пояснения к датам"`

### Summary row
**Before:** date string | label text | `›` chevron (flat row)

**After:**
- Date block: `bg-stone-100 rounded-lg` badge (visually distinct)
- Label: `text-[14px] font-semibold text-gray-900` (larger and bolder)
- Type pill: deadline → orange; important-date → amber; public-holiday → red (uses same color system as dates list)
- Expand hint: "Show ›" (EN) / "Детали ›" (RU) in `text-navy font-semibold`

### Expanded content
- Brief text: unchanged, but headings now `text-[10px] font-bold uppercase`
- Sub-labels renamed: "Who this is for" → "Who this affects"; "What to do" → "What to do" (unchanged); "Что делать" → "Что сделать"
- CTA rendered as pill button: `bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg` instead of plain link
- Source link: `text-[12px]` (was `text-[11px]`)
- Status badge: `font-semibold` (was `font-medium`)

### SSR/indexability preserved
- No `"use client"` added — remains server component
- All text in initial HTML (verified via curl)
- `<details>/<summary>` pattern unchanged — native browser expand/collapse
- All `<a href>` links remain real crawlable anchors

---

## Task 4 — Dates List Readability

In both `app/(en)/calendar/[slug]/page.tsx` and `app/ru/calendar/[slug]/page.tsx`:

| Property | Before | After |
|---|---|---|
| Title font size | `text-[13px]` | `text-[14px]` |
| Title weight | `font-medium` | `font-semibold` |
| Title color | `text-gray-800` | `text-gray-900` |
| Date text | `font-medium` | `font-semibold` |
| Item padding | `py-2.5` | `py-3` |
| Brief indicator | None | `"notes ↓"` / `"детали ↓"` pill (navy/20 border) on items with `brief_en`/`brief_ru` |
| Type pills | `font-medium` | `font-semibold` |

---

## Task 5 — CalendarGrid Agenda Readability

| Component | Property | Before | After |
|---|---|---|---|
| AgendaRow title | font size / weight | `text-[13px] font-medium text-gray-800` | `text-[14px] font-semibold text-gray-900` |
| AgendaRow date | font weight | plain | `font-semibold` |
| AgendaRow CTA | external fallback | only `detail_url` used | also uses `cta_url` (startsWith http) |
| GroupedAgendaRow sub-labels | font | `text-[12px] text-gray-600` | `text-[13px] font-medium text-gray-800` |
| GroupedAgendaRow date | font | `text-[11px]` | `text-[12px] font-semibold` |
| AgendaCard CTA | size | `text-[14px]` | `text-[13px]` |
| GroupedAgendaCard CTA | size | `text-[14px]` | `text-[13px]` |

CalendarGrid client-side interactivity (month nav, filter, day selection) not touched.

---

## QA Results

### TypeScript: clean — zero errors

### Build
```
88 pages generated, 0 errors, 0 warnings
```

### Route checks (14/14 × 200)

| Route | Status |
|---|---|
| `/calendar/uae-e-invoicing-2026-asp-deadline` | 200 |
| `/ru/calendar/uae-e-invoicing-2026-asp-deadline` | 200 |
| `/news/uae-e-invoicing-2026-asp-deadline-update` | 200 |
| `/ru/news/uae-e-invoicing-2026-asp-deadline-update` | 200 |
| `/calendar?month=2026-07` | 200 |
| `/ru/calendar?month=2026-07` | 200 |
| `/calendar/may-2026-uae-calendar` | 200 |
| `/ru/calendar/may-2026-uae-calendar` | 200 |
| `/calendar/uae-long-weekends-2026-2027` | 200 |
| `/ru/calendar/uae-long-weekends-2026-2027` | 200 |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | 200 |
| `/ru/calendar/uae-emiratisation-june-30-2026-reminder` | 200 |
| `/` | 200 |
| `/ru` | 200 |

---

## Rendering Invariants Verified

| Check | Result |
|---|---|
| E-invoicing preview links to `?month=2026-07` (EN + RU) | Pass |
| Emiratisation preview links to `?month=2026-06` | Pass |
| May 2026 preview links to `?month=2026-05` | Pass |
| Long Weekends preview links to generic `/calendar` + yearBadge "2026" | Pass |
| 3 `<details>` in EN e-invoicing page initial HTML | Pass |
| 3 `<details>` in RU e-invoicing page initial HTML | Pass |
| EN brief text in initial HTML (not client-fetched) | Pass |
| RU brief text in initial HTML | Pass |
| No EN text on RU brief section | Pass |
| "Key date notes" heading in EN HTML | Pass |
| "Пояснения к датам" heading in RU HTML | Pass |
| Scenario B CTA `href="/news/..."` in HTML (2 matches) | Pass |
| MoF source links `href="https://mof.gov.ae"` in HTML | Pass |
| E-invoicing agenda card visible at `/calendar?month=2026-07` | Pass |
| Existing pages: 0 `<details>` (May 2026, Long Weekends, Emiratisation) | Pass |
| No raw JSON field names in HTML | Pass |
| No raw Markdown (`**`) in HTML | Pass |
| No "Read full article" text in HTML | Pass |

---

## Final Report Q&A

### Does e-invoicing preview now open July 2026?

Yes. `resolveCalendarMonth` now returns `"2026-07"` for the e-invoicing page (calendarType="important_dates", earliest date 2026-07-01). The CalendarMiniPreview href is `/calendar?month=2026-07`. Verified via `grep -o 'month=2026-07'` in raw HTML — 2 matches (EN and RU href).

### Are July agenda cards clearly actionable?

Yes. At `/calendar?month=2026-07`, the e-invoicing pilot item now shows "Show details →" (because `brief_en` is present on the item). TAX-05A has no `detail_url` but does have `cta_url: "https://mof.gov.ae/..."` which is now used as external-link fallback for the CTA.

### Does the brief section look less technical and more premium?

Yes. Changes: renamed heading to "Key date notes", date shown as stone badge, title is 14px/semibold/gray-900, type pill added, expand hint "Show ›"/"Детали ›" in navy, expanded content uses bold sub-labels and CTA as a pill button.

### Is mobile readability improved?

All changes are larger text and higher contrast — these directly improve mobile readability. No layout changes that could introduce horizontal overflow. No new components added.

### Does curl still show brief text in initial HTML?

Yes. `CalendarBriefSection` has no `"use client"`. All brief_en/ru, who_for, what_to_do, source, and CTA content appears in the RSC payload on the initial response. Verified for both EN and RU pages.

### Are existing calendar pages unaffected?

Yes. May 2026, Long Weekends, and Emiratisation: 0 `<details>`, date list counts unchanged, preview targets unchanged.

### Is it safe to commit?

Yes, with owner approval. All changes are:
- Additive or styling-only — no interface changes, no DB changes, no schema changes
- TypeScript clean, build 88 pages 0 errors, 14/14 routes 200
- No existing behavior broken

---

## What Was Not Touched

- Production DB: not touched
- Local DB: not changed (e-invoicing records remain from Phase 6C-68)
- Schema / migrations: not touched
- Admin: not touched
- CalendarGrid interactive logic (month nav, filter, day selection): not touched
- Deployment: not done
- Git push: not done

---

## Remaining Visual Risks

| Risk | Severity | Note |
|---|---|---|
| `<summary>` inner `<div>` with complex flex layout | Low | All major browsers handle this; `list-none [&::-webkit-details-marker]:hidden` suppresses native markers |
| `cta_url` external fallback shows source link on agenda cards | Design intent | Scenario A items should surface the official source — this is correct behavior |
| "notes ↓" indicator on dates list may confuse users not sure where to look | Low | The "Key date notes" section immediately below with matching dates makes the connection clear |

---

**Phase 6C-68C is complete. CODE LOCAL ONLY. No production DB modified. No push. No deploy. Commit pending owner approval (6C-67 + 6C-68 + 6C-68C as a single commit batch or separate).**
