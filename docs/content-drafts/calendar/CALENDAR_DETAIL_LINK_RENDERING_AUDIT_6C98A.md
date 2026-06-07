# Calendar Detail Page — Internal Link Rendering Audit
## Phase 6C-98A Part A | Date: 2026-06-08

---

## Problem statement

The SSG monthly calendar detail pages (`/calendar/[slug]`, `/ru/calendar/[slug]`) store
`detail_url` in the `dates_json` blob but do NOT render it as a clickable link.
The dynamic listing (`/calendar?month=2026-12`) DOES render clickable links via `CalendarGrid.tsx`.

The data is correctly in the DB — 4 December 2026 items have `detail_url` values:

| Item ID      | label_en                                | detail_url                                          |
|--------------|-----------------------------------------|-----------------------------------------------------|
| DEC-03-F1    | Formula 1 Etihad Airways Abu Dhabi GP   | /events/formula-1-abu-dhabi-grand-prix-2026         |
| DEC-04-GITEX | GITEX Global 2026 at Expo City Dubai    | /events/gitex-global-2026                           |
| DEC-NEW-01   | F1 Abu Dhabi Week — Yasalam opening     | /events/formula-1-abu-dhabi-grand-prix-2026         |
| DEC-R1       | F1 Abu Dhabi Week — Imagine Dragons     | /events/formula-1-abu-dhabi-grand-prix-2026         |

---

## Files responsible for rendering

### SSG EN detail page
`app/(en)/(public)/calendar/[slug]/page.tsx`

- Renders each `CalendarDateItem` in a `<ul>` (lines 170–211)
- Shows: date, `label_en`, type pill, `brief_en` badge ("notes ↓")
- Does NOT read or render `item.detail_url`

### SSG RU detail page
`app/ru/calendar/[slug]/page.tsx`

- Identical structure to EN (lines 167–209)
- Shows: date, `label_ru || label_en`, type pill, `brief_ru` badge ("детали ↓")
- Does NOT read or render `item.detail_url`

### Dynamic listing (works correctly)
`components/calendar/CalendarGrid.tsx`

- Reads `item.detail_url` at lines 243, 859–862, 954–957, 1052–1055, 1137–1140
- Builds href with locale prefix: `isRu ? \`/ru${item.detail_url}\` : item.detail_url`
- Handles external URLs (starts with `http`) vs internal paths
- Renders the full card as a `<Link>` or `<a>` when `detail_url` is present

### CalendarBriefSection.tsx
`components/calendar/CalendarBriefSection.tsx`

- Renders expandable `<details>` for items with `brief_en`/`brief_ru`
- Uses `item.cta_url` for its CTA link — does NOT use `detail_url`
- Not the right place to add the fix (CTA is separate from the "view event" link)

### CalendarMiniPreview.tsx
`components/calendar/CalendarMiniPreview.tsx`

- Does NOT use `detail_url`

---

## TypeScript interface gap

`lib/db/news-events-calendar.ts` — `CalendarDateItem` interface (lines 25–53):

```typescript
export interface CalendarDateItem {
  date:       string;
  label_en:   string;
  label_ru:   string;
  type:       "public-holiday" | "important-date" | "deadline" | "other";
  confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  source?:    string;
  brief_en?:  string;
  brief_ru?:  string;
  // ... other optional fields ...
  // MISSING: detail_url?: string
}
```

`parseDatesJson()` casts the parsed JSON array to `CalendarDateItem[]` — so `detail_url`
IS present at runtime on each item object, but TypeScript does not know about it.
The SSG page template simply never reads it.

---

## Root cause

Two independent gaps, both in the SSG template only:

1. **TypeScript type**: `detail_url` not declared in `CalendarDateItem` interface → TypeScript
   would error if we tried to access `item.detail_url` in the template without the type fix.

2. **Template gap**: The EN and RU SSG date list loops do not include any rendering for `detail_url`.
   Adding the field to the type is necessary but not sufficient — the template must also render it.

---

## EN/RU template differences

Both pages have structurally identical dates list loops. RU-specific differences:
- Uses `label_ru || label_en` for the label text
- Uses `CONFIDENCE_BADGE_RU` for confidence badges
- Link `href` must be prefixed with `/ru` for internal paths

---

## Fix scope (Phase 6C-98A Part B)

Three files require changes:

| File | Change |
|------|--------|
| `lib/db/news-events-calendar.ts` | Add `detail_url?: string` to `CalendarDateItem` |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Render `<Link href={item.detail_url}>View event guide →</Link>` when present |
| `app/ru/calendar/[slug]/page.tsx` | Render `<Link href={\`/ru\${item.detail_url}\`}>Открыть гид →</Link>` when present |

Link placement: inside the existing `<div className="flex flex-wrap items-center gap-1.5 mt-1">` pills row.

Link style: match existing pill/badge style — small, inline, brass-colored, low visual weight.
Items WITHOUT `detail_url` must render cleanly with no gap or empty element.

---

## No-op check

- `CalendarBriefSection.tsx`: no change needed (uses `cta_url`, not `detail_url`)
- `CalendarMiniPreview.tsx`: no change needed
- `CalendarGrid.tsx`: no change needed (already correct)
- DB: no change needed (data is already correct)
- No migrations. No production DB writes. No deploy.
