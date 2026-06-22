# 6C-CALENDAR-UX-01 — Mobile Calendar Readability Audit

Phase: 6C-CALENDAR-UX-01
Date: 2026-06-22
Method: Code review of all calendar components and route files

---

## Files Audited

- `components/calendar/CalendarGrid.tsx` — main interactive calendar (client)
- `components/calendar/CalendarBriefSection.tsx` — expandable key-date notes (server)
- `components/calendar/CalendarMiniPreview.tsx` — mini date chip preview (server)
- `components/calendar/CalendarContextCta.tsx` — cross-link CTA (server)
- `components/calendar/SaveCalendarCta.tsx` — save-to-homescreen (client)
- `components/StickyRouteCta.tsx` — sticky bottom CTA (client)
- `app/(en)/(public)/calendar/page.tsx` — /calendar hub page
- `app/(en)/(public)/calendar/[slug]/page.tsx` — monthly detail pages (EN)
- `app/ru/calendar/page.tsx` — /ru/calendar hub page
- `app/ru/calendar/[slug]/page.tsx` — monthly detail pages (RU)
- `lib/calendar-helpers.ts` — badge labels, colors, CTA labels

---

## Current Mobile Order (on /calendar)

1. H1 "UAE Calendar" + subtitle (19px / 13px)
2. Month navigation bar (current month 18px bold, ghost months 11–13px, arrows 28×28px)
3. Filter chips (12px, flex-wrap — no horizontal scroll)
4. Legend (11–12px, color dots)
5. [mobile only] "This Month in the UAE" highlights (AgendaRow list, up to 6 items)
6. Grid (7-column, cells 64px tall mobile)
7. [if day tapped] Selected-day agenda panel (AgendaCard, 15px title)
8. "All dates this month" full agenda (AgendaRow list)
9. Save-to-phone CTA
10. Moon-sighting disclaimer note
11. SEO/RAG paragraph
12. WhatsApp CTA

---

## Current Font Sizes

| Element | Current | Notes |
|---|---|---|
| Page H1 | 19px | Compact product label |
| Page subtitle | 13px | OK |
| Month nav current | 18px bold | Good |
| Month nav ghosts | 11–13px | Intentionally small |
| Nav arrows | 14px text inside 28×28px button | Touch target small |
| Filter chip label | 12px | OK |
| Legend label | 11px uppercase | Very small |
| Legend dot | 10px (w-2.5) | OK |
| Legend text | 12px gray-500 | OK |
| Grid cell height | 64px mobile | Tight |
| Grid day number | 15px | OK |
| Grid day circle | 28×28px | Not a touch target issue (full cell is button) |
| Grid pill label | **9px** | Too small — unreadable |
| Grid dot | 6px | Fine for indicator |
| Section headings ("This Month", "All dates") | 12px uppercase gray-400 | Too de-emphasized |
| AgendaRow date col | 12px gray-500 | Small for key navigation info |
| AgendaRow badge | **10px** | Very small |
| AgendaRow title | 14px | OK |
| AgendaRow CTA | 12px brass | Small |
| AgendaCard title | 15px semibold | Good |
| AgendaCard badge | 11px | Acceptable |
| AgendaCard confidence | 11px | OK |
| CalendarBriefSection date | 11px | OK (summary row) |
| CalendarBriefSection label | 14px | Good |
| Detail page date col | 12px gray-500 w-[88px] | Small |
| Detail page item label | 14px | Good |
| Detail page type pill | 10px | Small |

---

## Current Tap Targets

| Element | Size | Status |
|---|---|---|
| Nav arrow buttons | 28×28px (w-7 h-7) | Below 44pt recommended |
| Picker nav arrows | 32×32px (w-8 h-8) | Borderline acceptable |
| Filter chip buttons | 12px text + padding — ~32px height | OK |
| Grid cells | 64px tall × ~50px wide | Full cell is button — OK |
| AgendaRow / AgendaCard CTA links | Inline text — ~24px height | Small tap area |

---

## Calendar Grid Density

- 7 columns, cells 64px tall on mobile
- Pill labels at 9px — unreadable without zooming
- 3 content layers per cell: day number, pill, dots
- Works logically but pill text is illegible in practice
- Grid uses `gap-px bg-stone-100` for thin dividers — clean
- Empty cells render white — no overflow

---

## Agenda Card Readability

### AgendaCard (selected-day / desktop sidebar)
- Clean layout: badge → title → date range → CTA
- Confidence status correctly shown ("Expected", "Subject to moon sighting")
- "Ongoing" badge for multi-day events in progress
- Card border `border-stone-100` on white — low contrast on white background
- Good overall

### AgendaRow (compact list — "This Month" + "All dates")
- 3-column layout: date | badge | title+CTA
- Date column fixed at w-[52px] — works for most dates
- Confidence status NOT shown in AgendaRow — a gap: users reading the list have no status context
- Badge at 10px hard to scan by type
- Title at 14px semibold — good

---

## Icon / Badge Visibility

- Color dots in grid: 6px — visible but small
- Category badge pills: colored backgrounds with white text — good color contrast
- Badge font at 10px (AgendaRow) and 11px (AgendaCard) — text barely readable
- The badge color system is well-designed (holiday=green, tax=red, deadline=amber, event=blue, etc.)
- Legend always visible as reference — helpful

---

## Item Type Clarity

- Category type is clearly communicated through badge color + label
- Holiday, Event, Business, Property filters map well to categories
- The 6-item legend with color dots gives a reference key
- Issue: at 10–11px badge size, users have to squint to read type labels on real phone screens

---

## Source / Status Clarity

### What exists in data:
- `confidence`: confirmed | expected | subject_to_official_confirmation
- `source_status`: confirmed | expected
- `source_url` + `source_label_en/ru`
- `official_source_url` (page-level)
- `last_verified_date` (page-level)
- `has_islamic_dates` (page-level)

### Current display:
- AgendaCard: shows confidence badge ("Expected", "Subject to moon sighting") — good
- AgendaRow: shows NO confidence — gap for list scanning
- CalendarBriefSection: shows source link + status dot (confirmed/expected) — good
- Detail page: shows page-level source URL + last verified date — good
- Moon sighting amber notice at page level — clear

### Gap: AgendaRow confidence
When browsing "All dates this month" as a list, users cannot see whether an item is confirmed or expected without tapping it. This reduces planning utility.

---

## StickyRouteCta on Calendar Routes

StickyRouteCta.tsx correctly excludes:
- `/calendar` (exact)
- `/calendar/*` (all detail pages)
- `/ru/calendar` (exact)
- `/ru/calendar/*` (all detail pages)

No overlap issue. Confirmed by reading `isHiddenRoute()`.

---

## Horizontal Overflow Check

- Grid: 7-column using `grid grid-cols-7` with `overflow-hidden` on container — safe
- Pill labels use `truncate` — cannot overflow cell
- Month nav uses `flex-shrink-0` on all buttons — safe
- Filter chips use `flex-wrap whitespace-nowrap` — safe
- AgendaRow date column fixed `w-[52px] flex-shrink-0` — safe
- Badge `flex-shrink-0` in AgendaRow — safe
- Title `min-w-0 flex-1` — text wraps, no overflow

No horizontal overflow issues detected.

---

## EN / RU Layout Parity

- CalendarGrid accepts `locale` prop — all labels, months, day headers bilingual
- Both /calendar and /ru/calendar use identical layout, same CalendarGrid component
- AgendaRow, AgendaCard, GroupedAgendaRow all pass locale through
- RU calendar page (page.tsx) has matching structure to EN
- CalendarBriefSection has strict locale gate — no EN fallback on RU page
- Detail page (RU) has all labels in Russian — no English fallback visible to user
- Parity is structural — confirmed equal

---

## Top 5 UX Issues

### 1. Grid pill labels at 9px — unreadable
The labeled pill inside each calendar cell uses `text-[9px]`. On iPhone at 375px width, a 7-column grid cell is ~50px wide. A 9px text inside a pill is below the minimum readable size on a non-zoomed screen. Users cannot read what the pill says without zooming.

**Fix:** Increase to `text-[10px]`. The pill uses `truncate` so text still clips — but at 10px it's marginally readable, and `itemShortLabel()` is already designed for ≤12 characters.

### 2. "This Month in the UAE" section has no visual prominence
The mobile-first section is the most valuable planning content on the page. Its heading reads `text-[12px] font-semibold uppercase tracking-widest text-gray-400`. On a phone, this looks like a footnote, not the main value. The section should have more visual weight to orient the user as they scroll past filters.

**Fix:** Bump heading to `text-[13px]`, darken to `text-gray-500`, widen brass accent to `w-6`.

### 3. AgendaRow badge at 10px — hard to scan by type
The category badge in the compact list rows is `text-[10px] font-bold uppercase`. On a phone, users cannot reliably read "HOLIDAY" or "DEADLINE" at 10px while scrolling a list. This makes scanning by type difficult.

**Fix:** Increase to `text-[11px]`.

### 4. AgendaRow shows no confidence status
In the full "All dates this month" list, items like Eid that are "subject to moon sighting" show no status indicator. Users can see the date and title but have no signal that the date is provisional. This matters for planning decisions.

**Fix:** Add a small inline confidence label after the title in AgendaRow for non-confirmed items (text-[11px] text-amber-600 for expected, text-amber-700 for moon sighting).

### 5. Nav arrow buttons at 28px — below recommended touch target
The previous/next month arrows use `w-7 h-7` (28px). Apple HIG recommends 44pt minimum. While the overall grid cell is the primary interaction point, these arrows are tapped frequently to change month.

**Fix:** Increase to `w-9 h-9` (36px) — compact but more accessible.

---

## Proposed Low-Risk Fixes

| Area | Change | Risk |
|---|---|---|
| Nav arrows | w-7 h-7 → w-9 h-9 | Low |
| Grid cell mobile height | h-[64px] → h-[70px] | Low |
| Grid pill label | text-[9px] → text-[10px] | Low |
| Section headings | text-[12px] gray-400 → text-[13px] gray-500 | Low |
| Brass accent line | w-5 → w-6 | Low |
| AgendaRow date | text-[12px] gray-500 → text-[13px] gray-600 | Low |
| AgendaRow badge | text-[10px] → text-[11px] | Low |
| AgendaRow confidence label | Add for non-confirmed items | Low-Medium |
| GroupedAgendaRow badge | text-[10px] → text-[11px] | Low |
| GroupedAgendaRow date | text-[12px] → text-[13px] | Low |
| AgendaRow CTA | text-[12px] → text-[13px] | Low |
| Legend label | text-[11px] → text-[12px] | Low |

All changes are CSS class updates within a single file. No schema changes. No content changes. No new dependencies.

---

## Items Confirmed Correct — Do Not Touch

- StickyRouteCta exclusion for all /calendar/* routes — already correct
- Filter chip system (flex-wrap, 5 filters, no horizontal scroll) — already good
- Month picker panel — clean and functional
- Confidence badges in AgendaCard — already implemented
- EN/RU parity — structurally built in
- Source citation in CalendarBriefSection — complete
- The "Tap a day to see details" helper text on desktop
- Horizontal overflow prevention — already handled
- Event JSON-LD — not touched in this phase
- GSC Event schema warnings (image, performer) — deferred to 6C-EVENTS-SCHEMA-01
