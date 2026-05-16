# Phase 5A — Connected Calendar + Mobile Homepage UX Architecture Plan

**Status:** Planning only. No code, no DB changes, no commit, no deploy.
**Date:** 2026-05-16
**Author:** Guidex / Owner direction

---

## Section 1 — Executive Direction

### Why calendar, news, events, and guides must be connected

Each content type has a different shelf life and a different job. Calendar entries are short and time-specific. Events have context, venue, and duration. News covers announcements that change rules or procedures. Guides are evergreen procedures. When these live in separate silos, users navigate between them without understanding the relationships — they see a holiday marked on a calendar but cannot get to the source, or they read a news article about a visa change but cannot see when that change takes effect on the calendar.

The value of Guidex is not individual articles. It is the ability to understand what to do, when, and in what order. That requires the calendar to be aware of news and events, and the news/events to link back to relevant dates and procedures. A user planning a company setup needs to see both the procedure guide and the current deadline calendar side by side.

### Why the calendar is not just an events listing

An events listing is a flat reverse-chronological feed. A calendar is a navigable time map. The difference matters on mobile: a user can scan a calendar grid and understand the next 30 days faster than scrolling a list. With short labels inside cells (Eid, Tax, GITEX, Visa, School), the calendar becomes legible at a glance. The tap-to-expand pattern then gives depth without requiring the user to open every item.

The Dubai Life Calendar is also a trust signal. A site that maintains an accurate, well-labeled, source-linked calendar of UAE dates demonstrates expertise. It answers the implicit question users have every month: "What do I need to know right now?"

### Why the homepage should become a compact Dubai dashboard

The current homepage works as a guide directory. That was the right starting point. But as Guidex now has news, events, calendar, and upcoming guides on multiple topics, a directory-only homepage wastes the first screen. Users who already know what Guidex does do not need a large hero to explain it again — they need to see what is new, what matters this month, and where to go next.

A compact dashboard homepage serves both new and returning users. New users get a quick picture of what the site covers. Returning users (the more valuable segment for a Dubai knowledge hub) immediately see updates relevant to their situation without hunting for them.

The attached uchet.kz screenshot illustrates this principle: the first screen is dense with utility — currency rates, calendar entry, category tiles, and featured content — all without a hero image. The site communicates its value through content, not marketing copy. Guidex should apply the same logic with a premium Dubai visual identity.

### Why Area Map is deferred

Area Map requires reliable local data, design patterns for geographical disambiguation, and a clear user need to navigate Dubai by zone. Before that need is validated, the engineering and design cost of Area Map would slow down the more immediately valuable calendar + news + events public experience. Users looking up visa procedures or business compliance dates are not blocked by the absence of a map. Area Map is a V2 feature that makes sense after the core content experience is stable and used.

### Why public product takes priority over admin UI polish

The admin workflow is functional. Content can be imported, drafted, and published. Further admin polish yields zero user-visible value. The public calendar, news, and events pages do not yet present the content professionally in a connected, mobile-first format. That gap is what limits Guidex's ability to be useful to real visitors and to rank for the content already in the DB. The next session of effort should be visible to users, not just the owner.

---

## Section 2 — Public Homepage Mobile Dashboard

### Design principle

The homepage should feel like a compact utility dashboard for someone who needs to understand something about UAE procedures or Dubai life. Not a marketing landing page. Not a brochure. Every block answers a real question.

Inspired by the density of compact portal homepages (like the attached reference), but applied with Guidex's premium clean aesthetic — white/off-white background, high-quality typography, purposeful color only for status/category signals.

### Homepage block order (mobile-first)

---

**Block 1 — Compact hero**

Not a full-screen hero. Single visible block at mobile viewport top. No image behind text. No gradient overlay.

Content:
- Short headline (2–5 words): "Your Dubai Procedure Guide"
- Short sub-line (1 sentence): "Step-by-step guides, key dates, and updates for UAE visas, company setup, and daily life."
- Two CTA buttons side by side:
  - Primary: "Find My Route" → /find-my-visa or guide index
  - Secondary: "Dubai Calendar" → /calendar

Visual:
- Compact padding (not `py-20`, more like `py-8 md:py-12`)
- Text only or a single small decorative icon/mark — no stock photo
- Immediate reading — the block fits on one mobile screen with room below

---

**Block 2 — This Month in Dubai**

3 to 5 key date items. Not the full calendar. A preview that gives users immediate "what matters now" awareness.

Each item row:
- Colored category badge (left)
- Short date + label: "25 May · Eid Al Adha"
- One-line note: "Federal holiday period begins"
- Category chip: "UAE Holiday"
- Not a link per row by default — the block has a single CTA at bottom: "See full calendar →"

---

**Block 3 — Latest Updates**

Unified feed. Not just news. Horizontal scroll cards on mobile. Grid on desktop.

Card types:
- [News] UAE public holiday confirmed
- [Event] GITEX Global opens
- [Calendar] Business compliance dates updated
- [Guide update] Investor visa rule change

Mobile: horizontal scroll, 2.5 cards visible at once (peek design, no arrows required)
Desktop: 3 or 4 column grid

---

**Block 4 — Start with your need**

Category tiles. Quick decision point.

Tiles:
- Visas
- Company Setup
- Government Services
- Banking & Tax
- Living in Dubai

6 tiles on mobile: 2×3 grid or 3×2. Compact, icon + label. No long descriptions.

---

**Block 5 — Dubai Life Setup teaser**

Short block. Soft background. Practical CTA.

Headline: "New to Dubai? Start here."
Sub-line: "A checklist for your first 30 days — visa, bank, home, school, transport."
CTA: "Dubai Life Setup →"

No image required. Could have a simple icon row (visa card, house, key, school) as accent.

---

**Block 6 — Dubai Calendar preview**

Not the full calendar. A mini month strip or 4–6 key date cards for current month.

Headline: "Dubai Calendar"
Content: compact date chips or mini card list for top 4–6 items of current/next month
CTA: "View full calendar →"

This reinforces the calendar as a utility, not just an afterthought.

---

**Block 7 — Popular guides**

3 to 4 cards: most-read or editorially selected.

Card: title, category chip, short summary, "Read guide →"

No more than 4 on mobile to avoid excessive scroll.

---

**Block 8 — WhatsApp / consultation CTA**

Optional. Bottom of page. Compact strip:
"Need help with your specific situation? Ask us on WhatsApp."
Single CTA button.

---

### What to avoid on the homepage

- Large blank hero with background image and minimal text
- "About us" section near the top
- Repeated explanations of what Guidex is
- Decorative sections that delay the user reaching useful content
- Full-width images as primary content
- Too many competing CTAs in one block

---

## Section 3 — Latest Updates Definition

### What it is

Latest Updates is a unified content feed across all content types. It is the answer to the question "what has changed or is happening recently on Guidex?" It is not just news. It includes:

- News articles (official announcements, policy updates, visa/tax/company rule changes)
- Events (public exhibitions, conferences, festivals, government-organized events)
- Calendar updates (when a calendar entry is materially changed or a new important date is added)
- Guide updates (when a procedure guide is revised due to a rule change)
- Service updates (future: new government service, new tool, new fee schedule)

### Card structure

Each card contains:

```
[Type label]  Category chip
Title (max 2 lines)
Short summary (1 sentence, max 15 words)
Date / deadline if relevant
→ Read more / View event / See dates
```

Type label options (small uppercase chip, left-aligned):
- NEWS
- EVENT
- CALENDAR
- GUIDE UPDATE

Category chip (right or below type):
- Visas · Company Setup · UAE Holidays · Business · Relocation

Date field:
- For News: published date ("16 May 2026")
- For Events: event date ("14–18 Oct 2026")
- For Calendar: affected date ("From 25 May")
- For Guide updates: update date ("Updated May 2026")

Source / verified indicator:
- Optional small icon or label if the source is an official government source: "Confirmed by MOHRE" or "Source: UAE Cabinet"
- Only show when confident in source

### Mobile behavior

- Horizontal scroll container
- 2.5 cards visible at once on standard mobile (375px width)
- Cards are ~240px wide, ~160px tall
- No carousel library needed — CSS `overflow-x: auto` with `snap-x` + `snap-start` per card
- No left/right arrows needed on mobile — touch scroll is natural
- On desktop: 3 or 4 column grid, same card proportions

### Card visual

- White card on light background, or slate-50 card on white
- Category chip in category color (see Section 7 color system)
- Title: medium weight, readable at small size
- Type label: small, uppercase, muted — does not compete with title
- CTA: text link, not full-width button — keeps card compact

### Example cards

```
NEWS · Visas
UAE introduces new entry permit fee
Effective from 1 June 2026
→ Read update

EVENT · Business
GITEX Global 2026
14–18 Oct, Dubai World Trade Centre
→ View event

CALENDAR · UAE Holidays
Eid Al Adha 2026 dates confirmed
From 25 May · Federal holiday
→ See calendar

GUIDE UPDATE · Company Setup
Free Zone company formation steps revised
Updated May 2026
→ Read guide
```

---

## Section 4 — "This Month in Dubai" Block

### What it is

A compact homepage block showing the 3 to 5 most important calendar items for the current (or upcoming) month. It is not the calendar. It is a curated selection that gives the user "calendar awareness" without requiring them to open the calendar.

### When to show which month

- If viewing in the first half of a month: show current month
- If viewing in the second half: show current month with "coming up" framing or blend current + next
- Logic can be simple at MVP: always show current calendar month

### Item row structure

```
[color badge]  25 May         Eid Al Adha begins
               UAE Holiday    Federal holiday period
```

Fields per item:
- Category color badge (left-most, 4px tall rectangle or dot, or chip)
- Date: "25 May" or "25–29 May" for ranges
- Title: short, e.g., "Eid Al Adha begins" (not the full news article title)
- Category: small chip — "UAE Holiday" / "Business" / "Event" / "Deadline"
- One-line note: "Federal holiday period for UAE ministries and federal entities."

### Block footer

"See all dates for May 2026 →" linking to /calendar or /calendar/2026/may (if that route exists)

### Visual treatment

- Compact list inside a soft card or bordered section
- Color badges match the calendar color system (green for holiday, red for deadline, blue for event)
- Not a table — a tight card list with consistent left-side color signal
- Section heading: "This Month in Dubai" with month name subtitle: "May 2026"

### Possible block names

- **This Month in Dubai** (recommended — practical, memorable, scannable)
- Key Dates in Dubai (more neutral, less personality)
- Dubai Dates to Watch (slightly editorial)

RU direction (Phase 5D or later): "Что важно в Дубае в мае"

### What this block is not

Not the full calendar. Not a news feed. Not a marketing section. It is a concise date-aware teaser that drives users to the full calendar for more.

---

## Section 5 — Full Dubai Life Calendar Concept

### Core principle

Users should understand what is happening without tapping every date. Labels inside calendar cells are not optional decoration — they are the primary signal.

### Calendar structure (mobile-first layout)

```
[Month selector: < April 2026  May 2026  June 2026 >]
[Tab bar: All | Holidays | Events | Business | Family | Government]

[Month grid]
  Mon  Tue  Wed  Thu  Fri  Sat  Sun
   -    -    -    1    2    3    4
   5    6    7    8    9   10   11
  12   13   14   15   16   17   18
  19   20   21   22   23   24   25
                               Eid
  26   27   28   29   30   31   -
                         Eid
                         +2

[Selected date panel]
  25 May 2026
  ─────────────────────
  [green] Eid Al Adha holiday begins
  Federal holiday for all UAE ministries
  → Read details  → View source

[Month agenda list]
  25 May ─────────────────────────
  [green] Eid Al Adha holiday begins
  [green] Abu Dhabi public sector holiday

  31 May ─────────────────────────
  [red] Corporate tax filing reminder
  [red] Residency visa renewal deadline (advisory)
```

### Calendar cell content rules

Each date cell can contain:

- The day number (always)
- A color treatment (background, border, or band)
- One short label (4–6 chars max): `Eid`, `F1`, `Tax`, `GITEX`, `Visa`, `School`, `Move`, `Design`, `Expo`, `Deadline`
- One or two tiny secondary indicators (color dots)
- `+N` count if more than 2 entries on that day

Labels are never full event names. They are abbreviated signals, like airport codes — understood by the user at a glance because the category color gives context.

### Priority when multiple items share a date

When multiple entries fall on the same date, the cell shows the highest-priority item's label and color:

1. Critical deadline (red)
2. Confirmed official holiday (green)
3. Major public event (blue)
4. Business/investment event (navy)
5. Family/relocation item (purple)
6. Minor note (grey)

Secondary items appear as small dots or `+N`.

### Holiday period treatment

Multi-day holiday periods (Eid, New Year, National Day) use a continuous band across cells:

```
[ 25 ] [ 26 ] [ 27 ] [ 28 ] [ 29 ]
 Eid   (green band across all five cells)
```

The first cell shows the label. Subsequent cells in the period show no label but share the same band color. End-of-band cell gets a soft right-corner rounding. Start cell gets left-corner rounding.

---

## Section 6 — Calendar Tabs / Layers

### Tabs

```
All  |  UAE Holidays  |  Dubai Events  |  Business & Investment  |  Relocation & Family  |  Government & Deadlines
```

On mobile: horizontal scroll tab bar. Sticky below month selector. Current tab underlined or pill-selected.

Each tab filters the calendar grid, selected date panel, and agenda list to show only matching items. "All" shows everything — this is the default.

### Tab behavior differences

**UAE Holidays**
- Simpler grid — mostly bands and confirmed dates
- Color logic: green (confirmed) / soft yellow (expected) / amber (subject to official confirmation)
- Labels: minimal — `Eid`, `New Year`, `National Day`
- Tone is careful around Islamic calendar dates — always include confidence state
- Cells do not need dense label stacking; holiday bands are self-explanatory
- Show "Subject to moon sighting" note for Islamic dates under the agenda item, not in the cell

**Dubai Events**
- Labels are essential: `F1`, `GITEX`, `Design`, `Art`, `Expo`, `Marathon`, `Fashion`
- More visual energy in color treatment — event blue is prominent
- Period bands for multi-day events (Design Week spans 7 days)
- First day of event shows label; subsequent days show band only
- Cell may also show venue name in agenda (not in cell itself)

**Business & Investment**
- Strong label emphasis: `Tax`, `GITEX`, `Cityscape`, `Expo`, `Deadline`
- Red for deadlines, navy for business expos/conferences
- Agenda shows company type relevance where known ("Applicable to mainland companies")
- Premium/serious tone — no emojis, no casual language

**Relocation & Family**
- Soft period bands: school term start/end, summer moving window, admission deadlines
- Purple/lavender color treatment
- Labels: `School`, `Admission`, `Move`, `Break`
- Family-first language in agenda: "School term begins — key date for families with children in Dubai government schools"
- Not alarmist — practical and calm

**Government & Deadlines**
- Red/amber dominates
- Labels: `Deadline`, `Visa`, `Tax`, `Renew`, `File`
- Agenda is direct and action-oriented: "File by this date" / "Renewal window opens"
- No softening language — deadlines must read as deadlines
- May include advisory note (not legal advice) where appropriate

---

## Section 7 — Calendar Visual Color System

### Color definitions

| Color | Hex (approximate) | Meaning |
|---|---|---|
| Green | `#22C55E` | Confirmed official holiday / confirmed date |
| Soft Green | `#86EFAC` | Expected date (not yet officially confirmed) |
| Amber | `#F59E0B` | Subject to official confirmation (Islamic calendar) |
| Red | `#EF4444` | Deadline / urgent compliance item |
| Blue | `#3B82F6` | Dubai event / lifestyle / exhibition |
| Purple | `#A855F7` | Family / relocation / school |
| Navy | `#1E3A5F` | Business / investment event |
| Grey | `#94A3B8` | Minor note / informational |

### Usage rules

**Consistency across surfaces.** The same item must show the same color in: calendar cell, selected date panel badge, agenda date badge, homepage "This Month in Dubai" badge, and Latest Updates card chip.

**Never rely on color alone.** Every colored item must also have a text label, short label, or descriptive text nearby. Color is a fast signal; text is the accurate signal. Users who cannot distinguish colors must still understand the content.

**Contrast.** All colored backgrounds used for text containers must meet WCAG AA minimum contrast (4.5:1 for normal text). For calendar cell backgrounds, use light tints (10–15% opacity) rather than full saturation, to keep day numbers readable. Reserve full-saturation colors for badge dots, border accents, and date badges in the agenda.

**Mixed-date priority.** When a date has multiple items from different categories, the highest-priority item controls the cell's main color. Secondary items are represented as small colored dots below the label. Agenda shows all items in full.

**Holiday band opacity.** For multi-day holiday bands, use ~15% opacity on the background with a 2px colored left border on the first day only. This keeps the grid readable while clearly marking the period.

### Color chips in agenda and cards

Agenda date badge: filled circle or rounded square, full saturation, white text if dark color (navy, purple), dark text if light color (amber, soft green).

Category chip in Latest Updates cards: light tint background (`/10` or `/15` opacity), colored text at full saturation, readable at small size.

---

## Section 8 — Visual Behavior Inside Calendar Cells

### Mobile cell constraints

On a standard 375px mobile screen with 7 columns, each cell is approximately 46×52px. Labels must be extremely short. Font size in cells should be 10–11px for labels, 13–14px for the day number.

### Cell type designs

**A. Holiday period (Eid, National Day)**

```
┌───────────────┐
│ 25            │
│ Eid           │  ← soft green background band
└───────────────┘
┌───────────────┐
│ 26            │
│               │  ← continuation of band, no label
└───────────────┘
```

- Green band (10% opacity) spans all holiday days
- Label only on first day
- Subsequent days: band only, slightly lighter
- If today falls within the band: stronger border or ring

**B. Major public event (Formula 1, marathon)**

```
┌───────────────┐
│ 16            │
│ F1            │  ← blue label, blue dot/accent
└───────────────┘
```

- Blue dot or 2px top border accent
- Short label centered below day number
- If multi-day: band treatment same as holidays but in blue

**C. Business event (GITEX, Cityscape)**

```
┌───────────────┐
│ 12            │
│ GITEX         │  ← navy accent
└───────────────┘
```

- Navy dot or left border accent
- Label in navy or dark text on light background

**D. Deadline**

```
┌───────────────┐
│ 31            │
│ Tax ●         │  ← red indicator
└───────────────┘
```

- Red dot or red accent border
- Label: `Tax`, `Visa`, `File`, `Renew`, `Deadline`
- Avoid full word "Deadline" — use what the deadline is for

**E. Family / school period**

```
┌───────────────┐
│ 01            │
│ School        │  ← purple band, period start
└───────────────┘
```

- Purple/lavender band across school term period
- Label on first day only
- Soft treatment — not alarming

**F. Multiple items on same date**

```
┌───────────────┐
│ 14            │
│ GITEX  +2     │  ← primary label + count
│ ● ●           │  ← two secondary color dots
└───────────────┘
```

- Primary label from highest-priority item
- `+2` count for additional items
- 2 small colored dots representing secondary categories
- Tapping shows all items in selected date panel

### What never goes in a cell

- Full event names ("GITEX Global 2026 International Technology Exhibition")
- Venue names
- Times
- Prices
- Long sentences
- Multiple full labels stacked

---

## Section 9 — Selected Date Behavior

### Mobile interaction flow

1. User sees month grid
2. Taps a date cell
3. The selected date cell gets a visual highlight (ring, stronger background, or color fill)
4. Selected date panel appears directly below the calendar grid (not a modal, not a drawer — inline)
5. If the user has the month agenda open below, the tapped date's agenda group scrolls into view and highlights
6. Tapping the same date again deselects (or has no effect — keep it simple)
7. Tapping a different date updates the panel and agenda scroll position

### Selected date panel structure

```
┌──────────────────────────────────┐
│  Saturday, 25 May 2026           │
├──────────────────────────────────┤
│  [green●] Eid Al Adha begins     │
│  Federal holiday for all UAE     │
│  ministries and federal          │
│  entities. Eid period: 25–29 May │
│                                  │
│  [→ Read details]  [→ Source]    │
├──────────────────────────────────┤
│  [blue●] Design Days opens       │
│  Annual design event, DIFC       │
│  → View event                    │
└──────────────────────────────────┘
```

- Each item in the panel has: colored dot, title, 1–2 sentence description, CTA
- CTA options: "Read details" (→ news/calendar detail page), "View event" (→ event page), "Open guide" (→ relevant guide), "See source" (→ external official source, opens new tab)
- Panel is scrollable if multiple items
- Panel has a visible close/dismiss handle or automatically collapses when a new month is shown

### Desktop layout

- Left panel: sticky month calendar grid (fixed top position when scrolling)
- Right panel: selected date detail + month agenda list below
- Month switcher above the left panel
- Tabs above or inside the left panel
- Right panel is the primary reading area — wider than the calendar

```
┌─────────────────┬────────────────────────────────┐
│  < May 2026 >   │  Saturday, 25 May 2026         │
│                 │  ─────────────────────         │
│  [Tab bar]      │  ● Eid Al Adha begins          │
│                 │    Federal holiday period       │
│  M  T  W  T  F  │    → Read details              │
│  ...calendar... │                                │
│                 │  ─────────────────────         │
│                 │  Month Agenda — May 2026       │
│                 │  ─────────────────────         │
│                 │  25 May                        │
│                 │  ● Eid Al Adha begins          │
│                 │  ● Design Days opens           │
│                 │                                │
│                 │  31 May                        │
│                 │  ● Corporate tax reminder      │
└─────────────────┴────────────────────────────────┘
```

- Calendar grid on left is sticky (stays in view while user scrolls agenda)
- Agenda on right is scrollable
- Clicking a date in the grid highlights + scrolls the agenda
- Clicking a date in the agenda highlights the cell in the grid

---

## Section 10 — Month Agenda List

### Purpose

The agenda list shows all items for the month in chronological order, grouped by date. It provides the reading-friendly alternative to scanning the grid. Users who prefer a list view use the agenda; users who prefer spatial navigation use the grid. Both are visible simultaneously.

### Structure

```
May 2026 Agenda
──────────────────────────────────────

25 May                    [green badge]
─────────────────────────────────────
  [NEWS] Eid Al Adha 2026 — Federal holiday
  Confirmed federal holiday period for UAE ministries
  and federal entities. Period runs 25–29 May.
  → Read details

  [EVENT] Design Days Dubai opens
  Annual design and interiors event, DIFC
  → View event

──────────────────────────────────────
31 May                    [red badge]
──────────────────────────────────────
  [CALENDAR] Corporate tax filing reminder
  Advisory reminder for companies with relevant
  financial year-end. Consult your tax advisor.
  → See calendar

──────────────────────────────────────
```

### Visual rules

- Date badge on left: colored circle or rounded square matching the highest-priority item's category color for that date
- Date label right of badge: "25 May" in medium weight
- Items below the date header: each item has type label (NEWS / EVENT / CALENDAR / GUIDE UPDATE), title, 1–2 sentence note, CTA link
- No collapse by default — all items visible
- When a date is tapped in the calendar grid, the agenda scrolls to that date's group and briefly highlights it (e.g., background flash or border pulse)
- If the selected date panel is open above, the agenda does not duplicate content — it provides the persistent list view while the panel gives the interactive detail

### Agenda filtering

When a tab is selected (Holidays / Events / Business / etc.), the agenda filters to show only matching items for that tab, same as the calendar grid. The date badges remain but only show items from the active tab category.

---

## Section 11 — Relationship Between Calendar / News / Events / Guides

### The connected model

Content items relate to calendar entries, and calendar entries relate to content items. Neither direction is one-way.

```
Calendar Entry  ←────→  News Article
                         (confirms the date, gives official source)

Calendar Entry  ←────→  Event Page
                         (full event context, venue, registration)

Calendar Entry  ←────→  Guide Page
                         (explains the procedure behind the deadline)

News Article    ←────→  Calendar Entry
                         ("Eid Al Adha 2026 — Federal Holiday Confirmed"
                          links to: see this date on the calendar)

Guide Page      ←────→  Calendar Entry
                         (Employment visa guide links to visa renewal
                          deadline calendar entry for current year)
```

### Example: Eid Al Adha

```
News article:
  "UAE confirms Eid Al Adha 2026 holiday dates"
  Tags: UAE holidays, public sector, federal
  Calendar entries linked:
    - 25 May: Eid Al Adha holiday begins (green, confirmed)
    - 29 May: Eid Al Adha holiday ends (green, confirmed)

Calendar entries:
  - Each entry has detail_url pointing to the news article
  - Category: UAE Holidays
  - Confidence: confirmed
```

### Example: GITEX Global

```
Event page:
  "GITEX Global 2026"
  Dates: 14–18 October
  Venue: Dubai World Trade Centre
  Calendar entries linked:
    - 14 Oct: GITEX opens (blue, event)
    - 18 Oct: GITEX closes (blue, event)

Calendar entries:
  - detail_url points to the event page
  - Category: Dubai Events
  - Short label: GITEX
```

### Example: Corporate Tax Deadline

```
Guide page:
  "Corporate Tax in UAE — Filing and Deadlines"
  Calendar entries linked:
    - 31 May: Corporate tax reminder (red, deadline)

Calendar entry:
  - detail_url points to the guide page
  - type: deadline
  - short_label_en: Tax
  - source: FTA (Federal Tax Authority)
  - source_url: official FTA page
```

### Example: Property Investor Visa Rule Update

```
News article:
  "UAE updates property investor visa threshold"
  Published: May 2026
  Tags: visas, investor, property
  No specific calendar date attached (effective immediately)
  → Appears in Latest Updates feed
  → Does NOT create a calendar entry unless there is a deadline or key date
  → Related guide page gets "Updated May 2026" flag
```

### Key principle

Calendar gives short context. News/events/guides give full detail. They link to each other.

A calendar entry without a detail_url is still valid (minor reminders, advisory dates). But every important calendar entry should link to either an internal detail page or a verified external source.

---

## Section 12 — Data Model Recommendation

### Current state assessment

**`calendar_pages` table** stores broad monthly/yearly calendar documents (e.g., "UAE Business Compliance Calendar 2026–2027"). The `dates_json` field stores structured date entries as JSON. This is a document-level model, not an entry-level model.

**`news_posts` table** stores articles with date-level metadata.

**`events` table** stores events with venue, dates, and description.

Neither table has a `linked_calendar_entry` or `detail_url` concept. The connection between them is currently conceptual only.

### What `dates_json` can support for MVP

For the first public calendar MVP, `dates_json` is sufficient if:
- It stores individual date entries with `date`, `label_en`, `label_ru`, `short_label_en`, `category`, `confidence`, and `source`
- A single `calendar_pages` row represents one curated month's or year's worth of entries
- The public calendar page reads this JSON and renders it

**`dates_json` cannot currently support:** per-entry `detail_url` pointing to news/events/guides. This would need to be added to the JSON schema without a DB migration — it is a JSON field so the shape can evolve.

### Ideal per-entry shape inside `dates_json`

```json
{
  "id": "eid-al-adha-2026-start",
  "date": "2026-05-25",
  "label_en": "Eid Al Adha begins",
  "label_ru": "Начало Ид аль-Адха",
  "short_label_en": "Eid",
  "short_label_ru": "Ид",
  "type": "holiday",
  "category": "uae-holidays",
  "confidence": "confirmed",
  "source": "UAE Government",
  "source_url": "https://u.ae/en/...",
  "detail_url": "/news/uae-eid-al-adha-2026-holiday-confirmed",
  "linked_content_type": "news",
  "linked_content_slug": "eid-al-adha-2026-uae-public-holidays",
  "priority": 1,
  "is_featured": true,
  "tags": ["eid", "holiday", "public-sector", "federal"],
  "period_end": "2026-05-29"
}
```

This shape can be adopted in `dates_json` entries **without a DB schema change** — the JSON field already stores arbitrary JSON. The import-parser and admin forms would need updating to populate the new fields, but the DB column requires no migration.

### What may require future schema

If calendar entries become first-class DB rows (not nested in JSON), a `calendar_entries` table would be needed. This enables:
- Direct SQL queries by date range, category, or tag
- Many-to-many relationships between entries and news/events/guides
- Per-entry edit history, publish state, image

**Recommendation:** Do not add this table until after the public MVP is live and the entry-level model is validated by real usage. For MVP, evolve `dates_json` entry shape. Add the `calendar_entries` table in a future phase (5F or 6A).

### Content link fields (no schema change required)

`news_posts`, `events`, and `calendar_pages` can store `related_calendar_slugs`, `related_guide_slugs`, etc. as JSON metadata fields **if a new column is added** — or these can be derived from tag matching at read time for MVP.

For the first public release: use `dates_json` entry `detail_url` to link from calendar → content pages. Links from content pages → calendar can be editorial (manually placed in the article body or summary). Full cross-reference can be a Phase 5D feature.

---

## Section 13 — SEO and Routing Logic

### Existing routes (already in codebase)

```
/news             — news listing
/news/[slug]      — news article
/events           — events listing
/events/[slug]    — event detail
/calendar         — calendar page
/calendar/[slug]  — calendar document detail (e.g., business compliance calendar)
/guides/[slug]    — guide detail
```

Russian equivalents are already present or follow the same pattern under `/ru/`.

### Route decisions for calendar

**MVP approach (recommended):** Keep a single `/calendar` page that renders the full interactive calendar with tab filtering, month grid, selected date panel, and agenda list. Month filtering is done via URL params or client state: `/calendar?month=2026-05`.

This avoids creating a new route before the UX is stable. The single `/calendar` page can be statically generated at build time for the current and next month, with revalidation.

**Future approach (Phase 5D or later):** Add month-specific SEO pages at `/calendar/2026/may`. These can target queries like "Dubai calendar May 2026" or "UAE public holidays May 2026". Add only after the single `/calendar` route is stable and the content volume justifies it.

**Do not add:** `/calendar/[year]/[month]/[entry]` individual entry pages yet. Calendar entries should link to news/event/guide pages, not create their own route hierarchy.

### News and events routes

`/news/[slug]` and `/events/[slug]` are already present. These detail pages should:
- Show related calendar entries as a sidebar block or inline block: "Key dates linked to this article"
- Show related guides: "See also: Employment Visa Guide"
- Be statically generated (SSG) with revalidation — not client-fetched

### Guide routes

`/guides/[slug]` already exists and is statically generated. Guide detail pages should eventually show:
- "Related dates" section: relevant calendar entries for the current year
- "Recent updates" section: linked news items about rule changes

### RU routes

Pattern `/ru/calendar`, `/ru/news/[slug]`, `/ru/events/[slug]` already exists or follows the established convention. RU calendar should use the same data with `label_ru` and `short_label_ru` fields from `dates_json` entries.

### SEO notes

- `/calendar` should have a strong `<title>` and meta description updated per month: "Dubai Calendar — May 2026: Eid Al Adha, key dates, and business deadlines"
- `/news/[slug]` and `/events/[slug]` are primary SEO targets — individual URLs with full article content rank better than calendar aggregate pages
- Calendar's main SEO value is topical authority and internal linking, not direct keyword traffic at MVP stage
- Once month pages exist (`/calendar/2026/may`), they can target holiday/event search queries for specific months

---

## Section 14 — Content Type Decision Rules

### Use News when

- An official government body, ministry, or authority makes an announcement
- A UAE law, policy, visa requirement, or fee changes
- A deadline is confirmed or shifted by an official source
- A business or tax rule is updated with a clear effective date
- Something timely that a Dubai resident or business owner should know about today

Examples:
- "UAE Federal Tax Authority confirms corporate tax filing extension"
- "Dubai Land Department updates Golden Visa property threshold"
- "MOHRE announces new unified contract format for domestic workers"

### Use Event when

- There is a specific public event with a location, date range, and target audience
- An exhibition, conference, festival, trade show, or public activation
- Something a person would attend or plan around
- Date and location are both known and confirmed

Examples:
- "GITEX Global 2026 — Dubai World Trade Centre, 14–18 Oct"
- "Dubai Design Week — DIFC, Nov 2026"
- "Abu Dhabi Art Fair 2026"

### Use Calendar entry only (no full article) when

- The item is a date-level marker, not an article
- A deadline, reminder, or short note that does not need a full page
- A holiday period already covered by a linked news article
- An advisory date ("School term starts — KHDA registered schools")

Examples:
- "25 May — Eid Al Adha begins (links to news article for full detail)"
- "31 May — Corporate tax advisory reminder"
- "Sep 1 — Dubai school term begins"

### Use Guide update when

- An existing evergreen procedure guide needs content revision
- A rule change directly affects the steps in a guide
- The change is significant enough to show an "Updated [Month Year]" flag
- If the change is also newsworthy: create both a News article and update the Guide

Examples:
- Property investor visa guide: threshold changes → update guide + publish news
- Employment visa guide: new step added for medical screening → update guide only
- Free zone formation guide: a specific free zone changes fees → update guide

### Ignore / do not publish when

- The claim cannot be traced to a reliable official source
- The item is a social media rumor or unconfirmed report
- The content duplicates an existing piece without adding new information
- The item is about a topic outside the Guidex scope (sports scores, general entertainment, global news)
- The source is a PR release for a product or service (unless directly relevant to UAE procedures)

---

## Section 15 — Mobile Visual Wireframes in Text

### A. Homepage mobile

```
┌─────────────────────────────┐
│ GUIDEX        [EN] [RU]  ☰  │  ← Compact nav bar
├─────────────────────────────┤
│                             │
│  Dubai Procedures,          │
│  Simplified.                │  ← Compact hero
│                             │
│  Visas, company setup,      │
│  government services, and   │
│  key UAE dates — in one     │
│  place.                     │
│                             │
│  [Find My Route]  [Calendar]│  ← 2 CTAs side by side
│                             │
├─────────────────────────────┤
│  This Month in Dubai        │  ← Section header
│  May 2026                   │
│  ─────────────────────────  │
│  ● 25 May  Eid Al Adha      │
│    UAE Holiday              │
│  ─────────────────────────  │
│  ● 14 Oct  GITEX Global     │
│    Business Event           │
│  ─────────────────────────  │
│  ● 31 May  Tax Reminder     │
│    Business Deadline        │
│  ─────────────────────────  │
│  → See full calendar        │
│                             │
├─────────────────────────────┤
│  Latest Updates             │  ← Section header
│  ─────────────────────────  │
│ ┌──────────┐ ┌──────────┐   │
│ │ NEWS     │ │ EVENT    │   │  ← Horizontal scroll cards
│ │ Visas    │ │ Business │   │
│ │ UAE      │ │ GITEX    │   │
│ │ holiday  │ │ Global   │   │
│ │ update   │ │ 14 Oct   │   │
│ │ →Read   │ │ →View   │   │
│ └──────────┘ └──────────┘   │
│                → (scroll)   │
├─────────────────────────────┤
│  Start with your need       │
│  ─────────────────────────  │
│  ┌─────────┐ ┌─────────┐   │
│  │ Visas   │ │ Company │   │
│  └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐   │
│  │ Gov.    │ │ Banking │   │
│  └─────────┘ └─────────┘   │
│  ┌─────────────────────┐   │
│  │  Living in Dubai    │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│  New to Dubai?              │
│  Your first 30 days guide.  │
│  → Dubai Life Setup         │
├─────────────────────────────┤
│  Dubai Calendar Preview     │
│  ─────────────────────────  │
│  [25] Eid Al Adha           │
│  [31] Tax Reminder          │
│  [14] GITEX Global          │
│  → View full calendar       │
├─────────────────────────────┤
│  Popular Guides             │
│  ─────────────────────────  │
│  Employment Visa →          │
│  Company Setup →            │
│  Golden Visa →              │
│  Tax Residency →            │
├─────────────────────────────┤
│  Need personal help?        │
│  [WhatsApp us]              │
└─────────────────────────────┘
```

---

### B. Calendar mobile

```
┌─────────────────────────────┐
│ GUIDEX        [EN] [RU]  ☰  │
├─────────────────────────────┤
│ Dubai Life Calendar         │
├─────────────────────────────┤
│ < April 2026  May  June >   │  ← Month switcher (sticky)
├─────────────────────────────┤
│ All │ Holidays │ Events │ ▸ │  ← Tabs (sticky, scroll)
├─────────────────────────────┤
│  M    T    W    T    F    S  │
│  -    -    -    1    2    3  │
│  5    6    7    8    9   10  │
│ 12   13   14   15   16   17  │
│ 19   20   21   22   23   24  │
│ 25   26   27   28   29   30  │
│ Eid ←band────────────→      │
│ 31                           │
│ Tax                          │
├─────────────────────────────┤
│ Saturday, 25 May 2026       │  ← Selected date panel
│ ─────────────────────────   │
│ ● Eid Al Adha begins        │
│   Federal holiday period    │
│   for UAE ministries.       │
│   [→ Read details]          │
│ ─────────────────────────   │
│ ● Design Days Dubai opens   │
│   DIFC — annual event       │
│   [→ View event]            │
├─────────────────────────────┤
│ May 2026 — All dates        │  ← Agenda list
│ ─────────────────────────   │
│ [green] 25 May              │
│   Eid Al Adha begins        │
│   → Read details            │
│ ─────────────────────────   │
│ [red] 31 May                │
│   Tax filing reminder       │
│   → See calendar            │
└─────────────────────────────┘
```

---

### C. Calendar desktop

```
┌──────────────────┬──────────────────────────────────────┐
│ < May 2026 >     │  Saturday, 25 May 2026               │
│                  │  ────────────────────────────        │
│ All Holidays     │  ● Eid Al Adha holiday begins        │
│ Events Business  │    Federal holiday for all UAE       │
│ Family Gov       │    ministries. Period: 25–29 May.    │
│                  │    [→ Read details]  [→ Source]      │
│  M  T  W  T  F   │                                      │
│  -  -  -  1  2   │  ────────────────────────────        │
│  5  6  7  8  9   │  ● Design Days Dubai opens           │
│ 12 13 14 15 16   │    Annual design event, DIFC         │
│ 19 20 21 22 23   │    [→ View event]                    │
│ 25 26 27 28 29   │                                      │
│ Eid──────────    │  ════════════════════════════        │
│ 31               │  May 2026 Agenda                     │
│ Tax              │  ────────────────────────────        │
│                  │  [green] 25 May                      │
│                  │    Eid Al Adha begins                │
│                  │    → Read details                    │
│                  │                                      │
│                  │  [red] 31 May                        │
│                  │    Corporate tax reminder            │
│                  │    → See calendar                    │
└──────────────────┴──────────────────────────────────────┘
```

---

### D. Latest Updates block

```
Mobile (horizontal scroll):

  Latest Updates                    [View all →]

  ┌─────────────┐  ┌─────────────┐  ┌─────
  │ NEWS        │  │ EVENT       │  │ CAL
  │ ● Visas     │  │ ● Business  │  │ ●
  │             │  │             │  │
  │ UAE public  │  │ GITEX       │  │ UAE
  │ holiday     │  │ Global 2026 │  │ busi
  │ dates       │  │ 14–18 Oct   │  │ comp
  │ confirmed   │  │ DWTC        │  │ date
  │             │  │             │  │
  │ 16 May 2026 │  │ Oct 2026    │  │ Upd
  │ → Read      │  │ → View      │  │ →
  └─────────────┘  └─────────────┘  └─────

Desktop (3-column grid):

  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ NEWS · Visas │ │ EVENT · Biz  │ │ CALENDAR     │
  │              │ │              │ │ · Holidays   │
  │ UAE holiday  │ │ GITEX Global │ │ Eid Al Adha  │
  │ dates conf.  │ │ 2026, DWTC   │ │ dates updated│
  │              │ │              │ │              │
  │ 16 May 2026  │ │ 14–18 Oct    │ │ From 25 May  │
  │ → Read       │ │ → View event │ │ → See dates  │
  └──────────────┘ └──────────────┘ └──────────────┘
```

---

### E. This Month in Dubai block

```
┌──────────────────────────────────────────┐
│  This Month in Dubai — May 2026          │
│  ──────────────────────────────────────  │
│                                          │
│  ● 25 May   Eid Al Adha begins           │
│    UAE Holiday   Federal holiday period  │
│                                          │
│  ● 31 May   Corporate tax reminder       │
│    Business      Advisory — file by date │
│                                          │
│  ● 1 Sep    School term begins (preview) │
│    Family        KHDA registered schools │
│                                          │
│  ── ── ── ── ── ── ── ── ── ── ──        │
│  See all dates for May 2026 →            │
└──────────────────────────────────────────┘
```

---

## Section 16 — Visual Density Rules (Inspired by Reference Screenshot)

The attached uchet.kz screenshot shows a compact portal homepage where:
- The first screen contains: currency rates, date display, a calendar shortcut, a featured article category, and navigation
- No full-screen hero image wastes space
- Category tiles appear early
- Tags/chips are visible on content cards
- Content value is communicated through information, not aesthetics
- The user understands the site's purpose within 3 seconds of loading

### Guidex-specific rules derived from this density principle

**First screen must earn its space.**
Every element visible without scrolling on mobile must answer a user question: What is this site? What can I do right now? What is important today?

**No decorative hero.**
The hero block should be the minimum size needed to communicate the value proposition and primary CTAs. On mobile, it should consume no more than 35–40% of the first viewport. The remaining space should show the start of "This Month in Dubai" or Latest Updates.

**Cards must be compact and readable simultaneously.**
Card height on mobile: ~150–180px maximum. Title: 2 lines max. Summary: 1 line. CTA: text link, not full button. Category chip: small but visible.

**Tags/chips should be visible and meaningful.**
Every content card should show its category. Not as decorative color — as information. "Visas" chip on a card tells the user in 0.2 seconds whether to read it.

**Section headings should be short.**
No heading should exceed 4–5 words. "This Month in Dubai" is better than "Important Events and Dates Happening in Dubai This Month."

**CTAs should be adjacent to content.**
Do not place a CTA after a large whitespace gap below a block. The CTA should feel like a natural continuation of the block.

**Mobile spacing: tight but not cramped.**
Section padding: 16–20px vertical. Card gap: 12px. Inner card padding: 12–16px. Text line-height: 1.4–1.5. No 40px+ gaps between content blocks.

**Every block answers a question.**
- Compact hero → "What is this site?"
- This Month in Dubai → "What matters right now?"
- Latest Updates → "What changed recently?"
- Start with your need → "Where do I start?"
- Dubai Life Setup → "I'm new — what first?"
- Calendar preview → "Show me the calendar"
- Popular guides → "What do other people read?"
- WhatsApp CTA → "I need help directly"

**Do not copy the uchet.kz design.**
Guidex is English-first, premium, clean, Apple-inspired. The visual reference is about information density and first-screen utility, not about red headers, Russian text, or accounting software brand identity.

---

## Section 17 — Implementation Phases After Plan

### Phase 5B — Mobile Homepage Dashboard

Scope:
- Rewrite homepage (`app/page.tsx` or `app/(public)/page.tsx`) with new block structure
- Compact hero (text only, 2 CTAs)
- "This Month in Dubai" block — reads from current `calendar_pages` `dates_json`
- Latest Updates unified feed — reads from `news_posts` + `events` + recent calendar updates
- "Start with your need" category tiles (existing categories)
- Dubai Life Setup teaser (existing route if exists, or link to relevant guide)
- Dubai Calendar preview (small list, links to /calendar)
- Popular guides block (editorially selected or most recent)
- WhatsApp CTA strip
- No Area Map

**Do not change:** existing route structure, public guide pages, admin, DB schema

---

### Phase 5C — Public Calendar MVP

Scope:
- Rebuild `/calendar` page with full interactive calendar
- Month selector, tab bar, month grid with short labels, selected date panel, agenda list
- Color/label system from Section 7 applied consistently
- Uses existing `calendar_pages` `dates_json` data
- Updates `dates_json` entry shape to include `short_label_en`, `category`, `confidence`, `detail_url` (JSON shape only — no DB migration)
- Static generation with month-based revalidation
- No new routes yet (single `/calendar` page with `?month=` param)

---

### Phase 5D — Connected Content Package

Scope:
- Publish first real content set: 5–10 items across news, events, calendar entries
- All items: images, EN content, SEO fields populated, internal links
- News articles link to relevant calendar entries
- Calendar entries link to news/event detail pages
- Guide updates where rule changes are confirmed
- RU fields populated for priority items

---

### Phase 5E — Image and Content Pipeline

Scope:
- Define `/images/` naming convention for news/events/calendar images
- Define WebP conversion and size rules
- Update import prompt to enforce naming convention
- No-admin import package for batch content loading
- Admin image upload workflow (if not already present)

---

### Phase 5F — Production Migration and Deploy Plan

Scope:
- Local DB backup
- DB migration if `dates_json` schema changes require it (likely minor or none)
- Production DB backup before any restore
- New build on server
- PM2 restart
- Post-deploy smoke test (calendar loads, news article loads, admin login works)
- Git push of all committed phases

---

## Section 18 — What Not to Do Now

The following are explicitly deferred. Do not begin any of these until the relevant phase is approved:

- **No Area Map.** Not in any phase before 6A at the earliest.
- **No admin UI polishing.** Admin is functional. Public product comes first.
- **No paid APIs.** No Anthropic API calls, no map data APIs, no scraping services.
- **No auto-scraping.** Content must be human-reviewed and human-approved.
- **No production deploy.** Phase 5F is the first planned deploy. Nothing goes to production before that.
- **No DB schema changes.** `dates_json` entry shape can evolve; adding new columns or tables waits for Phase 5F or 6A planning.
- **No event mega-platform.** Events are content cards and detail pages. Not a ticketing system, not a registration platform.
- **No complex filters before MVP.** Calendar tabs are enough for the first release. Advanced search, multi-tag filter, saved dates — all Phase 6.
- **No copying the uchet.kz design.** It is a density reference only. Guidex has its own identity.
- **No RU homepage translation before EN homepage is stable.**

---

## Section 19 — Risks and Open Decisions

The following decisions need owner input before or during Phase 5B implementation:

| Decision | Options | Recommendation |
|---|---|---|
| `/calendar` routing at MVP | Single `/calendar` page with `?month=` param vs. `/calendar/2026/may` routes from day one | Single page first — add month routes in Phase 5C or 5D after UX is stable |
| `dates_json` entry shape | Evolve existing JSON shape vs. new `calendar_entries` DB table | Evolve JSON shape for MVP. DB table in Phase 6. |
| EN/RU images per event | Share one image vs. separate `image_path_en` / `image_path_ru` | Share one image for now. `ru_image_alt` already exists. |
| Number of calendar categories for launch | 5 tabs vs. 3 tabs (All / Holidays / Events + Business + Family merged) | 5 tabs as planned — can simplify if categories feel sparse at content volume |
| Events: separate detail pages from day one | Yes — `/events/[slug]` already exists | Yes — route exists, use it |
| Latest Updates: include guide updates immediately | Yes (show "Updated May 2026" badge) vs. start with News + Events only | Start with News + Events only. Add guide updates in Phase 5D. |
| Text in calendar cells on mobile | Short 4–6 char labels only vs. allow up to 8 chars | 4–6 chars max. Test with real data before relaxing. |
| Selected date panel: sticky or inline | Sticky (floats above agenda) vs. inline (pushes content down) | Inline for mobile MVP. Sticky can be added if UX testing shows scroll confusion. |
| Agenda: group by date or category first | By date (chronological) vs. by category | By date. Category filtering is handled by tabs, not agenda order. |
| Homepage "This Month" data source | Read from `calendar_pages.dates_json` vs. hardcoded editorial config | Read from `calendar_pages.dates_json` — already has the data. |

---

*End of Phase 5A plan. This document is planning only. No code, DB, or production changes were made.*
