# Phase 5E — Dubai Life Calendar UX/Product Design Blueprint

**Status:** Design/planning only. No code, no DB changes, no commit, no deploy.
**Date:** 2026-05-17
**Builds on:** `phase-5a-connected-calendar-homepage-plan.md`, `phase-5d-connected-calendar-content-bank-plan.md`
**Routes to implement:** `/calendar` (EN), `/ru/calendar` (RU)

---

## 0. What This Document Is

A complete UX and product design specification for the Dubai Life Calendar by Guidex.

This document does not redesign Phase 5A or Phase 5D decisions. It operationalizes the calendar UX — layouts, item types, colors, behavior, EN/RU labels, homepage integration, and acceptance criteria — at a level of detail that allows direct implementation.

---

## 1. Product Purpose

Dubai Life Calendar is a connected date intelligence layer. Not a generic events list. Not a copied holiday page.

A user opens the calendar to answer one of these questions:
- What is happening in Dubai this month?
- When is my visa/license/tax deadline?
- When are UAE public holidays?
- Are there business events relevant to me?
- When should I plan my relocation or school enrollment?

The calendar connects to all Guidex content — news, events, guides, calendar visual posts — through `detail_url` links on each date entry. Every date item is either self-explanatory or links to a page that explains it.

**No dead-end items.** If a calendar item exists, it either fully explains itself in the card or has a `detail_url` linking to more.

---

## 2. Existing Data Shape (No Schema Change Required)

The current `CalendarDateItem` inside `dates_json`:

```typescript
interface CalendarDateItem {
  date:       string;   // "2026-06-09"
  label_en:   string;   // "Eid Al Adha — 1st Day"
  label_ru:   string;   // "Ид аль-Адха — первый день"
  type:       "public-holiday" | "important-date" | "deadline" | "other";
  confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  source?:    string;   // official source URL
}
```

The following optional fields can be added to JSON entries without a schema migration. The TypeScript interface should be updated to include them as optional:

```typescript
interface CalendarDateItemExtended extends CalendarDateItem {
  detail_url?:      string;   // link to news/event/guide/calendar page
  priority?:        1 | 2 | 3;
  category_type?:   string;   // richer type: see Section 4
  short_label_en?:  string;   // compact label for day cell (≤18 chars)
  short_label_ru?:  string;   // compact label for day cell (≤18 chars)
  period_end?:      string;   // ISO date — for multi-day events/holidays
}
```

**Schema change rule:** Do not create a new `calendar_entries` table in Phase 5E. All entries remain in `dates_json`. The extended fields are optional — backward compatible. Existing entries without them render with existing logic.

---

## 3. Mobile UX Design

### 3.1 Page Structure (top to bottom)

```
┌─────────────────────────────────────────┐
│  Dubai Calendar         [EN] [RU]       │  ← sticky header
│  Planning Dubai life, month by month.   │
├─────────────────────────────────────────┤
│  ← May 2026 →                           │  ← month navigation
├─────────────────────────────────────────┤
│  [All] [Holidays] [Events] [Business]  ↔ │  ← filter chips (scroll)
│  [Government] [Tax] [Family] [Property] │
├─────────────────────────────────────────┤
│                                         │
│  Su  Mo  Tu  We  Th  Fr  Sa            │
│  ─────────────────────────────────────  │
│       1   2   3   4   5   6            │
│  7   8   9  10  11  12  13            │
│           ╔══╗                         │  ← day with holiday (emerald)
│      14  15  16  17  18  19  20        │
│           ╔╗                           │  ← day with deadline (red dot)
│      21  22  23  24  25  26  27        │
│      28  29  30  31                    │
│                                         │
├─────────────────────────────────────────┤
│  ↑ selected day agenda (below grid)    │
│                                         │
│  Monday, 9 June 2026                   │
│  ─────────────────────────────────────  │
│  ● HOLIDAY  Expected — moon sighting   │
│  Eid Al Adha — 1st Day                 │
│  Subject to official moon sighting.    │
│  [Подробнее →]                         │
│                                         │
│  ● TAX                                 │
│  CT Return — FY ending 31 Dec 2025     │
│  [Read guide →]                        │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Header

- Title: "Dubai Calendar" (EN) / "Календарь Дубая" (RU)
- Subtitle: "Planning Dubai life, month by month." / "Планируйте жизнь в Дубае."
- Language switcher: compact pill (matches site header pattern)
- Sticky on scroll

### 3.3 Month Navigation

```
← May 2026 →
```

- Prev/next arrow taps navigate months
- Month name localized (EN: May | RU: Май)
- Year always shown
- Never navigate past current month - 12 months or beyond current month + 6
- Touch-swipe left/right on the grid can also change months

### 3.4 Filter Chips

Horizontally scrollable row. One active at a time (except All).

```
[All] [Holidays] [Events] [Business] [Government] [Tax] [Family] [Property] [Guides]
```

Active chip: filled background (type color or navy). Inactive: outlined.

When a filter is active:
- only items matching that type show in the grid
- other dates render as empty cells (no indicators)
- agenda panel shows only matching items
- a subtle "X" inside the chip allows clearing the filter

### 3.5 Month Grid — Day Cell Design

7-column grid. Headers: Su Mo Tu We Th Fr Sa (EN) / Вс Пн Вт Ср Чт Пт Сб (RU).

**Day cell dimensions (mobile):** ~44px × 54px minimum. Enough for number + 1 indicator.

**Cell states:**

| State | Visual treatment |
|---|---|
| Empty (no items) | Day number only, light gray text |
| Has items | Day number + indicator(s) below number |
| Today | Day number in navy circle or bold underline |
| Selected | Day number in brass/navy filled circle, indicators below |
| Past (before today) | Day number dimmed, indicators still visible |
| Other month (leading/trailing) | Day number very light, no indicators |

**Indicator layout within cell (below day number):**

Priority 1 item: short colored pill label (max ~8 chars). Truncated if too long.
Priority 2+ items: colored dot(s). Max 3 dots. If more, show "+N" in smallest text.

```
Example cell — 9 June with Eid + tax deadline:
┌────────────┐
│     9      │
│ ██████████ │  ← green pill: "Eid" (priority 1 holiday)
│  ●      +1 │  ← red dot (deadline) + "+1 more"
└────────────┘
```

```
Example cell — single tax deadline day:
┌────────────┐
│    15      │
│ ██████████ │  ← red pill: "CT Due"
└────────────┘
```

```
Example cell — today, no items:
┌────────────┐
│   [17]     │  ← today circle
│            │
└────────────┘
```

### 3.6 Selected Day Agenda

Appears directly below the grid. Replaces any previously selected day.

Heading: "Monday, 9 June 2026" / "Понедельник, 9 июня 2026"

Items sorted by priority (1 → 3), then by type alphabetically within same priority.

Each item card:

```
┌─────────────────────────────────────────┐
│  ● [HOLIDAY] [Expected — moon sighting]  │
│  Eid Al Adha — 1st Day                  │
│  First day of Eid Al Adha holiday.       │
│  Subject to official moon sighting.      │
│                  [Подробнее →]           │
└─────────────────────────────────────────┘
```

- Type badge: colored pill (matches type color)
- Confidence badge: gray pill, only shown when `!== "confirmed"`
- Title: `label_en` or `label_ru`
- Short body: calendar page summary or inline note from `dates_json`
- CTA: `detail_url`-driven; if no `detail_url`, no CTA shown

### 3.7 Empty Day

If selected day has no items:

```
No events or deadlines on this day.
```

RU: "В этот день событий нет."

Small, unobtrusive. No large illustration.

### 3.8 Empty Month State

If current filter returns no items for the month:

```
No [Holidays] in May 2026.
Try the "All" view or check another month.
```

RU: "Праздников в мае 2026 нет. Попробуйте «Все» или другой месяц."

### 3.9 Upcoming Strip (optional — Phase 5E-b)

Below the month section (not the agenda), a compact horizontal strip:

```
UPCOMING ─────────────────────────────
● 9 Jun   Eid Al Adha (expected)
● 30 Jun  DMCC Audit Deadline
● 4 Jul   UAE National Holiday
──────────────────────────────────────
```

Shows next 3 upcoming priority-1 items from today, regardless of selected month.
Tapping an item navigates to that month and selects that day.

This strip is useful when the current month is sparse (July, August). Deferred to Phase 5E-b.

---

## 4. Desktop UX Design

### 4.1 Layout

Two-column layout at ≥768px. Left: full month grid. Right: selected day panel or month highlights.

```
┌──────────────────────────────────────────────────────────┐
│  Dubai Calendar — May 2026                  ← May →      │
│  [All] [Holidays] [Events] [Business] [Government] [Tax]  │
│  Legend: ● Holiday ● Deadline ● Event ● Business ...     │
├─────────────────────────────┬────────────────────────────┤
│                             │                            │
│  Su  Mo  Tu  We  Th  Fr  Sa│  May 9, 2026              │
│  ─────────────────────────  │  ────────────────────────  │
│       1   2   3   4   5  6 │                            │
│  7   8   9  10  11  12  13 │  ● HOLIDAY                 │
│      ▓▓▓                   │  Eid Al Adha — 1st Day     │
│  14  15  16  17  18  19  20│  Expected (moon sighting)  │
│  21  22  23  24  25  26  27│  [Подробнее →]             │
│  28  29  30                │                            │
│                             │  ● TAX DEADLINE            │
│                             │  CT Return — FY Dec 2025   │
│                             │  [Read guide →]            │
│                             │                            │
│                             │  ──── Also this month ──── │
│                             │  15 May — DMCC Audit       │
│                             │  22 May — Business Forum   │
└─────────────────────────────┴────────────────────────────┘
│  Full month agenda                                        │
│  ─────────────────────────────────────────────────────── │
│  9 Jun  Eid Al Adha                        [Holidays]    │
│  9 Jun  CT Return Due                       [Tax]        │
│  15 Jun Audit Deadline                      [Business]   │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Desktop Day Cell

Larger than mobile. Minimum 80×90px.

Can show:
- Priority 1: 1 labeled pill (full label or truncated at ~16 chars)
- Priority 2: 1 small pill if space allows
- Overflow: "+N more" gray indicator

```
╔───────────────────╗
│         9         │
│ ▓▓▓▓▓ Eid ▓▓▓▓▓▓ │  ← emerald pill
│ ● +1              │  ← dot + overflow count
╚───────────────────╝
```

### 4.3 Right Side Panel

When no day is selected (initial page load):
- Title: "This month in Dubai" / "В этом месяце в Дубае"
- Lists top 5 priority items for the current month
- Sorted by date asc, then priority

When a day is selected:
- Title: "Thursday, 9 June 2026"
- Shows full item cards for that day
- Deselect by clicking day again or pressing Escape

### 4.4 Full Month Agenda (below grid on desktop)

Table-style list of all items in the month.
Columns: Date | Type badge | Title | Detail link

Sorted: date asc, priority asc within same date.

```
Date     Type        Title                           →
─────────────────────────────────────────────────────────
9 Jun    ● Holiday   Eid Al Adha — 1st Day          →
9 Jun    ● Tax       CT Return — FY Dec 2025         →
15 Jun   ● Business  DMCC Audit Deadline             →
22 Jun   ● Event     Dubai Summer Surprises opens    →
```

---

## 5. Item Type System — Full Specification

### Type map: current → extended

The current `type` field in `CalendarDateItem` has 4 values. The extended `category_type` optional field adds specificity without breaking existing entries.

| `category_type` value | Maps to current `type` | Display | Notes |
|---|---|---|---|
| `holiday` | `public-holiday` | Emerald | Federal + Emirate holidays |
| `government_deadline` | `deadline` | Amber | Visa, EID, company, PRO |
| `tax_deadline` | `deadline` | Red | FTA, CT, VAT, e-invoicing |
| `aml_deadline` | `deadline` | Red | goAML, MOEI, AML/DNFBP |
| `event` | `important-date` | Blue | General Dubai/UAE events |
| `real_estate_event` | `important-date` | Navy | DLD, Cityscape, property |
| `business_event` | `important-date` | Navy/Blue | GITEX, ADIPEC, exhibitions |
| `family_school` | `important-date` | Purple | KHDA, school terms |
| `relocation` | `other` | Teal | Move windows, first 30 days |
| `news_update` | `other` | Gray | Dated news with impact |
| `guide_update` | `other` | Brass `#B5935A` | Guide with deadline relevance |
| `calendar_visual_post` | `other` | Varies | Monthly planning visual |

When `category_type` is absent, fall back to the 3-color system based on `type`:
- `public-holiday` → emerald
- `deadline` → red/amber
- `important-date` → blue
- `other` → gray

### 5.1 holiday

| Field | Value |
|---|---|
| Color | Emerald `#22C55E` / dark: `#166534` |
| Cell pill text | `short_label_en` / `short_label_ru` (≤12 chars) |
| Badge label EN | "Holiday" |
| Badge label RU | "Праздник" |
| Priority | 1 |
| Confidence rule | Islamic holidays: always `subject_to_official_confirmation` until federal announcement. Then update to `confirmed`. |
| Day cell style | Filled emerald pill with white text |
| Agenda style | Full card with confidence badge if not confirmed |
| CTA | "Details →" / "Подробнее →" linking to news post about holiday |
| Example | "Eid Al Adha — 1st Day", "UAE National Day", "Islamic New Year" |

### 5.2 government_deadline

| Field | Value |
|---|---|
| Color | Amber `#F59E0B` |
| Badge label EN | "Deadline" |
| Badge label RU | "Срок" |
| Priority | 1 |
| Confidence rule | Must be official source verified (`verified` before publish) |
| Day cell style | Amber pill, short action label |
| Agenda style | Full card with source authority named in body |
| CTA | "Read guide →" / "Читать →" if guide exists; "Details →" otherwise |
| Example | "Residence Visa — renewal advisory", "Emirates ID Renewal Window" |

### 5.3 tax_deadline

| Field | Value |
|---|---|
| Color | Red `#EF4444` |
| Badge label EN | "Tax" |
| Badge label RU | "Налог" |
| Priority | 1 |
| Confidence rule | FTA or MoF official source required. Source_url must be non-empty before publish. |
| Day cell style | Red pill, short label (e.g. "CT Due", "VAT Q2") |
| Agenda style | Full card with official source link |
| CTA | "Read guide →" / "Читать →" |
| Example | "CT Return Due — FY ending 31 Dec 2025", "VAT Return — Q2 2026" |

### 5.4 aml_deadline

| Field | Value |
|---|---|
| Color | Red `#EF4444` |
| Badge label EN | "AML" |
| Badge label RU | "AML" |
| Priority | 1 |
| Confidence rule | MOEI / goAML official source required |
| Day cell style | Red dot (not pill — AML deadlines are complex and may be rolling) |
| Agenda style | Full card, body explains the AML requirement briefly |
| CTA | "Read guide →" / "Читать →" if AML guide exists |
| Example | "AML Annual Risk Assessment — goAML deadline" |

### 5.5 event

| Field | Value |
|---|---|
| Color | Blue `#3B82F6` |
| Badge label EN | "Event" |
| Badge label RU | "Событие" |
| Priority | 2 |
| Confidence rule | Official event organizer or venue website preferred. Trusted media OK as signal. |
| Day cell style | Blue pill or dot depending on priority relative to other same-day items |
| Agenda style | Full card with event dates (start–end if multi-day) |
| CTA | "View event →" / "Смотреть событие →" linking to event page |
| Example | "Dubai Shopping Festival", "Dubai Marathon", "Ramadan Night Markets" |

### 5.6 real_estate_event

| Field | Value |
|---|---|
| Color | Navy `#1B2E4B` |
| Badge label EN | "Property" |
| Badge label RU | "Недвижимость" |
| Priority | 2 |
| Confidence rule | Official exhibition organizer or DLD announcement |
| Day cell style | Navy dot |
| Agenda style | Full card |
| CTA | "View event →" / "Смотреть →" |
| Example | "Cityscape Global", "Dubai Real Estate Forum", "DLD Service Window" |

### 5.7 business_event

| Field | Value |
|---|---|
| Color | Navy `#1E3A5F` |
| Badge label EN | "Business" |
| Badge label RU | "Бизнес" |
| Priority | 2 |
| Confidence rule | Official event website required for dates |
| Day cell style | Navy dot or small pill if P1 items absent |
| Agenda style | Full card with venue/organizer |
| CTA | "View event →" / "Смотреть →" |
| Example | "GITEX Global", "ADIPEC", "Arab Health", "Future Investment Initiative" |

### 5.8 family_school

| Field | Value |
|---|---|
| Color | Purple `#A855F7` |
| Badge label EN | "School" |
| Badge label RU | "Школа" |
| Priority | 2 |
| Confidence rule | KHDA or official school operator source |
| Day cell style | Purple dot |
| Agenda style | Full card |
| CTA | "Details →" / "Подробнее →" |
| Example | "KHDA Schools — Term 1 Start", "MOE Exam Period", "School Admissions Window" |

### 5.9 relocation

| Field | Value |
|---|---|
| Color | Teal `#0D9488` |
| Badge label EN | "Relocation" |
| Badge label RU | "Переезд" |
| Priority | 3 |
| Confidence rule | Advisory / internal estimate OK. Clearly labeled as advisory. |
| Day cell style | Teal dot only |
| Agenda style | Smaller card; explicitly marked "Advisory" |
| CTA | "Read guide →" / "Читать →" linking to relevant guide |
| Example | "Summer Move Window (Jun–Aug)", "Best months to enrol children in Dubai schools" |

### 5.10 news_update

| Field | Value |
|---|---|
| Color | Gray `#6B7280` |
| Badge label EN | "News" |
| Badge label RU | "Новость" |
| Priority | 3 |
| Confidence rule | Inherits from the linked news post |
| Day cell style | Gray dot only |
| Agenda style | Compact card — title + date + CTA only |
| CTA | "Read update →" / "Читать обновление →" linking to news post |
| Example | "UAE Announces Extended Eid Holiday" |

### 5.11 guide_update

| Field | Value |
|---|---|
| Color | Brass `#B5935A` |
| Badge label EN | "Guide" |
| Badge label RU | "Гайд" |
| Priority | 3 |
| Confidence rule | Inherits from the linked guide's source |
| Day cell style | Brass dot only |
| Agenda style | Compact card — title + CTA |
| CTA | "Read guide →" / "Читать →" |
| Example | "Golden Visa via Property — 2026 requirements confirmed" |

### 5.12 calendar_visual_post

| Field | Value |
|---|---|
| Color | Context-based (category of the calendar page) |
| Badge label EN | "Calendar" |
| Badge label RU | "Календарь" |
| Priority | 2 |
| Confidence rule | Same as the calendar_pages document it belongs to |
| Day cell style | Color dot based on category |
| Agenda style | Full card |
| CTA | "Open →" / "Открыть →" linking to /calendar/{slug} |
| Example | "UAE Business Compliance Calendar 2026" |

---

## 6. Priority System

### Rules

| Priority | Description | Grid visibility | Agenda position |
|---|---|---|---|
| 1 | Must be visible. Never hidden below +N. | Always shows pill label in cell | First in agenda list |
| 2 | Shows if no P1 item occupies the cell. Otherwise dot. | Pill if cell has space; else dot | After P1 items |
| 3 | Always dot in cell. Never pill. | Dot only | After P1 and P2 items |

### Priority 1 types (auto-assigned)
- `holiday`
- `government_deadline`
- `tax_deadline`
- `aml_deadline`

### Priority 2 types (auto-assigned default)
- `event`
- `real_estate_event`
- `business_event`
- `family_school`
- `calendar_visual_post`

### Priority 3 types (auto-assigned default)
- `relocation`
- `news_update`
- `guide_update`

The `priority` field in `dates_json` can override the default. This allows a particularly important event (e.g., GITEX in tech context) to be elevated to priority 1 if editorially justified.

---

## 7. Color System

### Production color tokens (aligned with existing site design)

| Type | Light mode | Dark mode (if needed) | Tailwind approx |
|---|---|---|---|
| holiday | `#22C55E` | `#166534` | `green-500` |
| government_deadline | `#F59E0B` | `#92400E` | `amber-400` |
| tax_deadline | `#EF4444` | `#991B1B` | `red-500` |
| aml_deadline | `#EF4444` | `#991B1B` | `red-500` |
| event | `#3B82F6` | `#1E40AF` | `blue-500` |
| real_estate_event | `#1B2E4B` | `#0F1C2E` | navy (custom) |
| business_event | `#1E3A5F` | `#0F1C2E` | navy variant |
| family_school | `#A855F7` | `#6B21A8` | `purple-500` |
| relocation | `#0D9488` | `#0F4B45` | `teal-600` |
| news_update | `#6B7280` | `#374151` | `gray-500` |
| guide_update | `#B5935A` | `#7A5C2E` | brass (custom) |
| calendar_visual_post | varies | varies | context |

### Color usage rules

- Pill label: type color as background, white text
- Dot indicator: type color, 6–8px circle
- Badge in agenda card: type color background, white text, small rounded-full
- Legend swatch: type color filled square or circle

### No dark mode required for Phase 5E

Calendar pages are public (not admin). No dark theme. White background, consistent with existing public pages.

---

## 8. Multi-Item Day Behavior — Exact Rules

### Mobile cell (44px × 54px)

```
Scenario A — one P1 item only:
┌────────┐
│   9    │
│ ██████ │  ← green pill: "Eid" (≤8 chars)
└────────┘

Scenario B — one P1 + one P2/P3:
┌────────┐
│   9    │
│ ██████ │  ← green pill (P1 always visible)
│ ●      │  ← single dot for P2/P3
└────────┘

Scenario C — one P1 + two or more P2/P3:
┌────────┐
│   9    │
│ ██████ │  ← green pill (P1)
│ ● ●+1  │  ← two dots + "+1" if 3+ additional items
└────────┘

Scenario D — no P1, one P2 item:
┌────────┐
│  15    │
│ ██████ │  ← blue pill (P2 can show as pill when P1 absent)
└────────┘

Scenario E — no P1, multiple P2/P3:
┌────────┐
│  22    │
│ ● ● ●  │  ← colored dots (no pill — too many to label)
│ +2     │  ← if more than 3
└────────┘

Scenario F — P3 items only:
┌────────┐
│  28    │
│ ●      │  ← single gray/brass dot
└────────┘
```

### Desktop cell (80px × 90px)

```
Scenario A — P1 + P2 + overflow:
╔══════════════════╗
│        9         │
│ ██████ Eid ████  │  ← P1 full label pill
│ ▓▓▓▓ CT Due ▓▓▓  │  ← P2 smaller pill
│ ● +1             │  ← dot + overflow
╚══════════════════╝
```

### Hard rule: P1 items are never collapsed

If a day has 3 P1 items (e.g., 3 simultaneous major deadlines), all 3 appear as labeled pills — the cell expands vertically if necessary. This is exceptional and unlikely in practice.

---

## 9. Date Confidence Display

### `confirmed`

No indicator. Clean presentation. The date is officially announced.

Example (agenda card):
```
● HOLIDAY
UAE National Day
Federal public holiday — 2 December 2026.
[Details →]
```

### `expected`

Small gray badge next to type badge in agenda. Short note in body.

Badge: `Expected` (EN) / `Ожидается` (RU)

Example (agenda card):
```
● HOLIDAY  [Expected]
Eid Al Adha — 1st Day
Approximate date based on the Islamic lunar calendar.
Official dates announced by UAE authorities.
[Подробнее →]
```

In grid cell: pill shows, but with a small `~` prefix or dashed border if design space allows. Text inside pill: `~Eid` or just `Eid`. Keep simple on mobile — the agenda card explains.

### `subject_to_official_confirmation`

Stronger yellow/amber badge. Expanded note.

Badge: `Subject to confirmation` (EN, abbreviated: `Unconfirmed`) / `Ожидается` (RU, same badge)

Example (agenda card):
```
● HOLIDAY  [Subject to moon sighting]
Eid Al Adha — 1st Day (expected)
Date is based on the expected Islamic lunar calendar.
Confirmed by UAE authorities upon official moon sighting.
Official announcement typically 1–2 days before the holiday.
[Details →]
```

### Admin rule (not UI — editorial)

- Do not publish Islamic holiday dates as `confirmed` before official UAE announcement.
- After official announcement, update `confidence` from `subject_to_official_confirmation` to `confirmed` and add the announcement source URL.
- Compliance deadlines with `expected` confidence must have official source attached before publish.

---

## 10. Filter and Legend Design

### Filter chips

One-tap. Only one active at a time (exclusive). Tap active chip again to deactivate (return to "All").

Horizontal scroll on mobile. Chip row on desktop.

```
EN chips: All | Holidays | Events | Business | Government | Tax | Family | Property | Guides
RU chips: Все | Праздники | События | Бизнес | Госуслуги | Налоги | Семья | Недвижимость | Гайды
```

Active chip style:
- Background: type color (or navy for Business/Property/Government)
- Text: white
- No border

Inactive chip style:
- Background: white or light gray
- Text: gray-600
- Border: stone-200

### Legend

Compact. Below filter chips or in right panel header on desktop.

```
Legend: ● Holiday  ● Deadline/Tax  ● Event  ● Business  ● School  ● Property  ● Other
```

EN: "Holiday | Deadline | Event | Business | School | Property | Other"
RU: "Праздник | Срок | Событие | Бизнес | Школа | Недвижимость | Другое"

On mobile: the legend can be hidden behind a "Legend ↓" toggle if space is tight. Default: visible.

---

## 11. Calendar Item Card Design — Full Spec

### Anatomy (agenda panel item card)

```
┌─────────────────────────────────────────────┐
│  [TYPE BADGE]    [CONFIDENCE BADGE?]        │
│                                             │
│  Title — label_en / label_ru               │
│                                             │
│  Short body (optional):                     │
│  One sentence max. Source or note.          │
│  Official source: FTA / UAE Cabinet / ...   │
│                                             │
│  Date range if applicable: 9–13 Jun 2026    │
│                                             │
│                         [CTA text →]        │
└─────────────────────────────────────────────┘
```

### CTA rules by type

| Type | EN CTA | RU CTA | When shown |
|---|---|---|---|
| holiday | Details → | Подробнее → | Only if `detail_url` exists |
| government_deadline | Read guide → | Читать → | If guide linked |
| tax_deadline | Read guide → | Читать → | If guide linked |
| event | View event → | Смотреть → | Always if `detail_url` |
| real_estate_event | View event → | Смотреть → | If `detail_url` |
| business_event | View event → | Смотреть → | If `detail_url` |
| family_school | Details → | Подробнее → | If `detail_url` |
| relocation | Read guide → | Читать → | If guide linked |
| news_update | Read update → | Читать обновление → | Always if `detail_url` |
| guide_update | Read guide → | Читать → | Always if `detail_url` |
| calendar_visual_post | Open → | Открыть → | Always if `detail_url` |

**If no `detail_url`:** No CTA rendered. Item is label-only. Allowed only for standalone date labels (e.g., "Q4 begins" advisory note).

### Multi-day events

When `period_end` is set, the card shows:
```
9–13 June 2026
```
In the grid: the day cell for each day in the range shows the item indicator. The first day shows the label pill; subsequent days show a lighter dot or continuation indicator.

---

## 12. EN/RU Complete Label Dictionary

### Page-level labels

| Element | EN | RU |
|---|---|---|
| Page title | Dubai Calendar | Календарь Дубая |
| Page subtitle | Planning Dubai life, month by month. | Планируйте жизнь в Дубае. |
| Empty day | No events or deadlines on this day. | В этот день событий нет. |
| Empty month | No {filter} in {month} {year}. Try "All" or check another month. | {Фильтр} в {месяц} {год} нет. Попробуйте «Все» или другой месяц. |
| "This month highlights" (desktop panel) | This month in Dubai | В этом месяце в Дубае |
| Agenda section heading | {Weekday}, {Day} {Month} {Year} | {День недели}, {число} {месяц} {год} |
| Legend label | Legend | Обозначения |

### Month names

| EN | RU |
|---|---|
| January | Январь |
| February | Февраль |
| March | Март |
| April | Апрель |
| May | Май |
| June | Июнь |
| July | Июль |
| August | Август |
| September | Сентябрь |
| October | Октябрь |
| November | Ноябрь |
| December | Декабрь |

### Day abbreviations

| EN (Sun–Sat) | Su | Mo | Tu | We | Th | Fr | Sa |
|---|---|---|---|---|---|---|---|
| RU (Sun–Sat) | Вс | Пн | Вт | Ср | Чт | Пт | Сб |

### Weekday names (agenda heading)

| EN | RU |
|---|---|
| Monday | Понедельник |
| Tuesday | Вторник |
| Wednesday | Среда |
| Thursday | Четверг |
| Friday | Пятница |
| Saturday | Суббота |
| Sunday | Воскресенье |

### Filter chip labels

| EN | RU |
|---|---|
| All | Все |
| Holidays | Праздники |
| Events | События |
| Business | Бизнес |
| Government | Госуслуги |
| Tax | Налоги |
| Family | Семья |
| Property | Недвижимость |
| Guides | Гайды |

### Type badge labels

| Type | EN badge | RU badge |
|---|---|---|
| holiday | Holiday | Праздник |
| government_deadline | Deadline | Срок |
| tax_deadline | Tax | Налог |
| aml_deadline | AML | AML |
| event | Event | Событие |
| real_estate_event | Property | Недвижимость |
| business_event | Business | Бизнес |
| family_school | School | Школа |
| relocation | Relocation | Переезд |
| news_update | News | Новость |
| guide_update | Guide | Гайд |
| calendar_visual_post | Calendar | Календарь |

### Confidence badge labels

| Value | EN badge | RU badge |
|---|---|---|
| `confirmed` | (none) | (нет) |
| `expected` | Expected | Ожидается |
| `subject_to_official_confirmation` | Subject to moon sighting | Ожидается — лунный календарь |

### CTA labels

| EN | RU |
|---|---|
| Details → | Подробнее → |
| Read guide → | Читать → |
| View event → | Смотреть → |
| Read update → | Читать обновление → |
| Open → | Открыть → |

### Navigation labels

| Element | EN | RU |
|---|---|---|
| Previous month | ← | ← |
| Next month | → | → |
| "No date selected" panel default heading | This month in Dubai | В этом месяце в Дубае |

### Advisory labels (relocation, guide_update)

| Element | EN | RU |
|---|---|---|
| Advisory badge | Advisory | Ориентировочно |
| Advisory footnote | Dates are advisory and may vary. | Даты ориентировочны и могут меняться. |

---

## 13. Homepage Integration

### 13.1 "This Month in Dubai" block

Already implemented on homepage. Reads from `getPublishedCalendarPages` + `getPublishedEvents`.

**Current behavior (Phase 5B):**
- 60-day lookahead window
- Shows `label_ru` for RU, `label_en` for EN
- Dot color based on `type`
- Arrow links to `detail_url` if present

**Phase 5E additions (no change to existing block UI, only data):**
- Ensure `detail_url` is populated in all `dates_json` entries when creating content
- Ensure `short_label_en` / `short_label_ru` are filled for compact display
- The block already handles the data — content quality improves homepage automatically

### 13.2 Dubai Calendar card on homepage

The card linking to `/calendar` and `/ru/calendar` already exists. It should:

- Show total number of upcoming items this month as a subtle badge (optional, Phase 5E-b)
- Currently: "Праздники, события и важные даты." / "Holidays, events and reminders."
- No change needed for Phase 5E-a

### 13.3 FeaturedSlider integration

The slider currently shows guides only (from `getRecentPublishedGuidesLocale`).

**Future Phase 5F-a:** Allow the slider to include high-priority calendar-linked content — confirmed holiday news, major event announcements, important deadline guides — by adding a `featured_homepage` flag to the news/event/calendar system. Already present on `news_posts` and `events` tables.

**Phase 5E:** No change to slider. Document the future integration intent only.

### 13.4 Latest updates section

When news/events exist and are RU-published:
- They appear in "Последние обновления" / "Latest updates"
- Each links to `/ru/news/{slug}` or `/ru/events/{slug}`
- Currently empty (all content is draft). Will populate as content is published.

---

## 14. Route Structure

| Route | Page | SSG/SSR |
|---|---|---|
| `/calendar` | EN calendar — current month | SSR (month changes) or SSG with client month navigation |
| `/ru/calendar` | RU calendar — current month | Same |
| `/calendar/[slug]` | Calendar visual post detail | SSG |
| `/ru/calendar/[slug]` | RU calendar visual post detail | SSG |

### SSG vs SSR decision for month grid

**Recommended approach:** SSG for the page shell + client-side month navigation.

- Server renders current month's data as the initial state (SSG at build time or ISR)
- Client-side month navigation fetches data via a lightweight route or pre-loaded JSON
- OR: full SSR on `/calendar?month=2026-06` with standard Next.js route

Both approaches are valid. For simplest implementation: start with full SSR (`getServerSideProps` equivalent in App Router — export revalidate or dynamic = 'force-dynamic'). If performance is acceptable, keep. Add ISR later.

---

## 15. Admin/Editorial Implications

### Creating calendar entries

Calendar entries are created through the admin AI Inbox import flow as `calendar_pages` documents with structured `dates_json`.

Each `dates_json` entry should be authored with all extended fields:

```json
{
  "date": "2026-06-09",
  "label_en": "Eid Al Adha — 1st Day",
  "label_ru": "Ид аль-Адха — первый день",
  "short_label_en": "Eid",
  "short_label_ru": "Ид аль-Адха",
  "type": "public-holiday",
  "category_type": "holiday",
  "confidence": "subject_to_official_confirmation",
  "priority": 1,
  "detail_url": "/news/eid-al-adha-2026-uae-public-holidays",
  "period_end": "2026-06-12",
  "source": "https://www.mohre.gov.ae/..."
}
```

### Admin workflow for a new calendar entry

1. Identify the date/event/deadline
2. Find official source
3. Determine `category_type` and `priority`
4. Write `label_en` and `label_ru` (not literal translation — natural Russian)
5. Write `short_label_en` and `short_label_ru` (≤12 chars, for day cell)
6. Set `confidence` correctly
7. Set `detail_url` if related page exists (or will exist)
8. Add to existing `calendar_pages` draft or create new one
9. Human review: check labels, source, confidence
10. Publish only after review

### High-risk entry rules

- `tax_deadline`, `government_deadline`, `aml_deadline` entries: **must not be published** without `source` URL
- `holiday` entries with Islamic calendar: **must not be published as `confirmed`** before official UAE announcement
- Advisory entries (`relocation`, `guide_update`): source URL recommended but not blocking

---

## 16. Data Model Changes Required for Phase 5E Implementation

All changes are TypeScript-only (no schema migrations). The `dates_json` JSON field already accepts arbitrary additional fields.

### TypeScript changes needed

**`lib/db/news-events-calendar.ts`:**

Extend `CalendarDateItem`:

```typescript
export interface CalendarDateItem {
  date:             string;
  label_en:         string;
  label_ru:         string;
  type:             "public-holiday" | "important-date" | "deadline" | "other";
  confidence:       "confirmed" | "expected" | "subject_to_official_confirmation";
  source?:          string;
  // Extended fields (optional — backward compatible)
  category_type?:   string;
  priority?:        1 | 2 | 3;
  short_label_en?:  string;
  short_label_ru?:  string;
  detail_url?:      string;
  period_end?:      string;
}
```

**New helper functions needed:**

```typescript
function itemPriority(item: CalendarDateItem): 1 | 2 | 3 {
  if (item.priority) return item.priority;
  const p1 = ["holiday", "government_deadline", "tax_deadline", "aml_deadline"];
  const p2 = ["event", "real_estate_event", "business_event", "family_school", "calendar_visual_post"];
  if (item.category_type && p1.includes(item.category_type)) return 1;
  if (item.category_type && p2.includes(item.category_type)) return 2;
  // Fall back to type-based
  if (item.type === "public-holiday") return 1;
  if (item.type === "deadline") return 1;
  if (item.type === "important-date") return 2;
  return 3;
}

function itemColor(item: CalendarDateItem): string {
  const map: Record<string, string> = {
    holiday: "#22C55E",
    government_deadline: "#F59E0B",
    tax_deadline: "#EF4444",
    aml_deadline: "#EF4444",
    event: "#3B82F6",
    real_estate_event: "#1B2E4B",
    business_event: "#1E3A5F",
    family_school: "#A855F7",
    relocation: "#0D9488",
    news_update: "#6B7280",
    guide_update: "#B5935A",
    calendar_visual_post: "#6B7280",
  };
  if (item.category_type && map[item.category_type]) return map[item.category_type];
  // Fallback to type
  if (item.type === "public-holiday") return "#22C55E";
  if (item.type === "deadline") return "#EF4444";
  if (item.type === "important-date") return "#3B82F6";
  return "#6B7280";
}
```

**New reader functions needed:**

```typescript
// Get all published calendar entries for a given month
function getCalendarItemsForMonth(
  year: number,
  month: number,       // 1–12
  locale: Locale,
): CalendarDateItem[]

// Get upcoming items for homepage (60-day window)
// Already implemented as buildThisMonthItems in homepage — no change needed
```

No DB schema changes. No migrations.

---

## 17. Acceptance Criteria for Phase 5E Implementation

### Code gate

- [ ] `/calendar` and `/ru/calendar` routes exist and render
- [ ] Current month's grid renders correctly at 375px (iPhone SE)
- [ ] Current month's grid renders correctly at 390px (iPhone 14)
- [ ] Current month's grid renders correctly at 768px (tablet)
- [ ] Current month's grid renders correctly at 1280px (desktop)
- [ ] Day cells show correct item indicators per type/priority rules
- [ ] Priority 1 items always visible as labeled pills (not hidden below +N)
- [ ] "+N more" indicator accurate — no items silently discarded
- [ ] Tapping a day cell opens the selected day agenda
- [ ] Agenda shows all items sorted by priority, then date
- [ ] Filter chips filter grid and agenda correctly
- [ ] Month navigation (prev/next) works
- [ ] Current day highlighted
- [ ] Selected day highlighted differently from today
- [ ] `detail_url` links open correctly
- [ ] Dates without `detail_url` show no CTA
- [ ] Date confidence badges display for non-confirmed items
- [ ] Multi-day events show on all days in range
- [ ] EN/RU label toggle switches all copy (no English fallback on RU)
- [ ] Empty month state renders
- [ ] Empty day state renders
- [ ] TypeScript: 0 errors
- [ ] QA: all existing suites pass
- [ ] Build: clean
- [ ] No hydration errors
- [ ] No broken internal links

### Content gate

- [ ] At least UAE public holidays 2026 entered with correct confidence
- [ ] All Islamic holidays have `subject_to_official_confirmation` until announcement
- [ ] At least 1 compliance calendar page with verified entries
- [ ] All entries have `label_ru` (no empty RU labels on RU route)
- [ ] All high-risk entries have `source` URL before publish
- [ ] `detail_url` populated for all entries linked to real pages

### Quality gate

- [ ] No English UI labels on RU calendar page
- [ ] No machine-translated Russian in calendar item labels
- [ ] No copied text from compliance PDF
- [ ] No unsupported legal/tax claim without official source URL
- [ ] Month grid is readable at a glance — not visually chaotic
- [ ] User can identify holiday vs deadline vs event by color without reading labels

---

## 18. What NOT to Do

| Prohibited | Reason |
|---|---|
| Create a simple chronological list and call it a calendar | Defeats the whole product definition |
| Show English item labels on `/ru/calendar` | Violates RU-first rule |
| Publish compliance deadlines without official source | Legal/credibility risk |
| Publish Islamic holiday dates as `confirmed` before announcement | Factual accuracy requirement |
| Copy any text from the compliance PDF | Originality requirement |
| Use client-side fetch for initial calendar data | SEO requires server render |
| Make P1 items collapsible / hidden by "+N" | Priority 1 must always be visible |
| Launch the calendar before `/calendar` has at least one wave of content | Empty calendar page is worse than no calendar page |
| Ignore desktop layout | Desktop is used by business users |
| Make filter chips too small for touch targets | Mobile usability minimum: 40px touch target height |
| Use "дедлайны", "лайф", "настройка" in Russian calendar copy | Anglicisms and awkward literal phrases |

---

## 19. Recommended Next Phases

### Phase 5E-a — Calendar page implementation

1. Extend `CalendarDateItem` TypeScript interface with optional extended fields
2. Add `itemPriority()` and `itemColor()` helper functions
3. Create `app/(public)/calendar/page.tsx` — EN calendar
4. Create `app/ru/calendar/page.tsx` — RU calendar
5. Build `components/CalendarMonthGrid.tsx` — server or client component
6. Build `components/CalendarDayAgenda.tsx` — selected day panel
7. Build `components/CalendarFilterChips.tsx` — filter UI
8. Wire up existing `getPublishedCalendarPages` reader
9. Test at all breakpoints
10. QA pass
11. Commit

### Phase 5E-b — Content first wave

1. Author 2026 UAE public holidays in calendar_pages (with correct confidence)
2. Author top 5 business compliance entries (verified sources)
3. Author 3–5 major events (GITEX, Dubai Marathon, DSF)
4. Publish to staging/local after human review
5. Verify "This Month in Dubai" block updates on homepage
6. Check EN/RU parity for all entries

### Phase 5E-c — Launch gate clearance

1. All launch gate conditions from Phase 5D Section 10 met
2. Owner approves mobile + desktop screenshots
3. EN and RU calendar pages reviewed
4. Commit + push + deploy

### Phase 5F — Connected content (Phase 6A prep)

Add `related_calendar_slug` or `dates_json` cross-reference fields to news/events pages, allowing guide and news detail pages to surface "Related 2026 dates" sections.

---

## 20. Confirmations

- No commit
- No push
- No deploy
- No production access
- No SSH
- No PM2
- No DB change
- No schema change
- No migration
- No publish
