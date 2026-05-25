# Phase 6C-67 — Calendar Brief UI Code MVP Report

**Date:** 2026-05-25
**Phase:** 6C-67
**Scope:** Code only — TypeScript interfaces, new component, calendar detail page integration. No DB import, no production deploy, no schema change.

---

## What Was Done

Implemented minimal UI code support for indexed calendar briefs on calendar detail pages. Brief content is rendered server-side in `<details>/<summary>` markup with all text in the initial HTML response. CalendarGrid was not touched.

---

## Files Inspected

| File | Purpose |
|---|---|
| `app/(en)/(public)/calendar/[slug]/page.tsx` | EN calendar detail page — where brief section is added |
| `app/ru/calendar/[slug]/page.tsx` | RU calendar detail page — where brief section is added |
| `lib/db/news-events-calendar.ts` | `CalendarDateItem` interface and `parseDatesJson` helper |
| `lib/calendar-mock-data.ts` | `CalendarDateItemExtended` interface and mock items |
| `components/calendar/CalendarMiniPreview.tsx` | Server-compatible — not modified |
| `components/calendar/CalendarContextCta.tsx` | Server-compatible — not modified |
| `components/calendar/CalendarGrid.tsx` | `"use client"` — not modified |

---

## Files Modified

| File | Change |
|---|---|
| `lib/db/news-events-calendar.ts` | Added 18 optional brief fields to `CalendarDateItem` interface |
| `lib/calendar-mock-data.ts` | Added same 18 optional brief fields to `CalendarDateItemExtended` interface |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Imported `CalendarBriefSection`; added `<CalendarBriefSection items={page.dates} locale="en" />` after dates list |
| `app/ru/calendar/[slug]/page.tsx` | Imported `CalendarBriefSection`; added `<CalendarBriefSection items={page.dates} locale="ru" />` after dates list |

## Files Created

| File | Purpose |
|---|---|
| `components/calendar/CalendarBriefSection.tsx` | New server component — renders indexed expandable briefs |
| `docs/content-drafts/PHASE_6C67_CALENDAR_BRIEF_UI_CODE_MVP_REPORT.md` | This file |

---

## Interface Fields Added

Both `CalendarDateItem` (in `lib/db/news-events-calendar.ts`) and `CalendarDateItemExtended` (in `lib/calendar-mock-data.ts`) now include these optional fields:

| Field | Type | Purpose |
|---|---|---|
| `brief_en` | `string?` | EN brief body text (80–180 words) |
| `brief_ru` | `string?` | RU brief body text |
| `who_for_en` | `string?` | EN audience description |
| `who_for_ru` | `string?` | RU audience description |
| `what_to_do_en` | `string?` | EN action or awareness note |
| `what_to_do_ru` | `string?` | RU action or awareness note |
| `source_label_en` | `string?` | EN source display name |
| `source_label_ru` | `string?` | RU source display name |
| `source_url` | `string?` | Source URL — rendered as crawlable `<a>` |
| `source_status` | `"confirmed" \| "expected" \| "monitoring"?` | Status badge |
| `cta_type` | union of 6 values? | CTA type (view_details, read_guide, open_event, open_source, add_calendar, ask_guidex) |
| `cta_url` | `string?` | Internal path (`/news/...`) or external URL |
| `cta_label_en` | `string?` | EN CTA button label |
| `cta_label_ru` | `string?` | RU CTA button label |
| `location_en` | `string?` | EN location string |
| `location_ru` | `string?` | RU location string |
| `risk_level` | `"low" \| "medium" \| "high"?` | Risk classification |
| `lifecycle` | `string?` | Lifecycle tag |
| `noindex_after` | `string?` | ISO date after which item should be noindexed |
| `archive_action` | `string?` | Action to take on archive |

All fields are optional. Existing `CalendarDateItem` objects without these fields parse and render exactly as before — `parseDatesJson` does a simple JSON.parse cast, so extra fields survive and missing fields are `undefined`.

---

## Component Behavior

**File:** `components/calendar/CalendarBriefSection.tsx`

- No `"use client"` — server component, safe for SSR/SSG
- Props: `items: CalendarDateItem[]`, `locale: "en" | "ru"`
- Strict locale gate: RU page shows only items where `brief_ru` is non-empty; EN page shows only items where `brief_en` is non-empty
- No EN fallback on RU: if `brief_ru` is absent, the item is skipped entirely
- Returns `null` (renders nothing) when no items have brief content for the current locale — existing pages are unaffected
- Each qualifying item renders as a native `<details>/<summary>` element
- Summary line: date, label, static `›` indicator
- Expanded content: brief body, who_for, what_to_do, source (with status badge), CTA
- Source `<a>` link: `target="_blank" rel="noopener noreferrer"` — always crawlable
- CTA: internal paths (`/news/...`) rendered via `<Link>` (Next.js client routing); external URLs (`http...`) rendered via `<a target="_blank">`
- Section heading: "Details" (EN) / "Подробнее" (RU) — consistent with existing Dates heading style
- Styling: matches existing Guidex design system (stone-200 borders, brass accent, navy CTAs, 12–13px body text)

---

## SSR / Indexability Design

- No `"use client"` — component renders on the server
- All brief text, source labels, source URLs, and CTA links are in the initial HTML response
- `<details>/<summary>` pattern: browsers render collapsed but Google and AI crawlers index the content regardless of collapse state
- No JavaScript fetch for brief content — content does not depend on any client-side hydration or API call
- `list-none [&::-webkit-details-marker]:hidden` on `<summary>` suppresses native disclosure triangle in WebKit; standard `list-none` suppresses the `::marker` pseudo-element in other browsers
- Safe for `curl` extraction — `grep -o '<details'` on existing pages returns 0 (no briefs in current DB data); after import it will return the count of briefed items

---

## Placement

**EN page** (`app/(en)/(public)/calendar/[slug]/page.tsx`):

```
DetailHero
summary paragraph
official source link (if present)
Islamic dates warning (if applicable)
CalendarMiniPreview
MarkdownBody (if body)
Dates list
→ CalendarBriefSection (NEW — returns null when no briefs)
notes
WhatsApp CTA block
```

**RU page** (`app/ru/calendar/[slug]/page.tsx`):

Identical placement. Locale="ru" passed to component.

No duplicate CTA clutter: `CalendarBriefSection` CTAs are inside the collapsed `<details>` and only visible when the user expands a brief. They do not compete with the page-level WhatsApp CTA.

---

## QA Results

### TypeScript

```
npx tsc --noEmit
```

Result: **clean — zero errors, zero warnings**

### Build

```
npm run build
```

Result: **88 pages generated, no errors, no warnings**

Build output: `/calendar/[slug]` and `/ru/calendar/[slug]` both listed as `● (SSG)` — server-side generated.

### Route checks (all 200)

| Route | Status |
|---|---|
| `/calendar/may-2026-uae-calendar` | 200 |
| `/ru/calendar/may-2026-uae-calendar` | 200 |
| `/calendar/uae-long-weekends-2026-2027` | 200 |
| `/ru/calendar/uae-long-weekends-2026-2027` | 200 |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | 200 |
| `/ru/calendar/uae-emiratisation-june-30-2026-reminder` | 200 |
| `/calendar` | 200 |
| `/ru/calendar` | 200 |
| `/` | 200 |
| `/ru` | 200 |

### Rendering invariants verified

| Check | Result |
|---|---|
| No "Details" / "Подробнее" heading on existing pages (no brief data) | Pass — count: 0 |
| No `<details>` elements on Long Weekends page | Pass — count: 0 |
| Long Weekends `<li>` items still render | Pass — count: 26 |
| May 2026 `<li>` items still render | Pass — count: 19 |
| CalendarGrid present on `/calendar` | Pass |
| No raw Markdown in rendered HTML | Pass — count: 0 |
| No EN fallback tested in code | Pass — filter is `isRu ? !!item.brief_ru : !!item.brief_en` |

---

## What Was Not Touched

- DB: not touched
- Admin: not touched
- Schema/migrations: not touched
- CalendarGrid: not touched
- CalendarMiniPreview: not touched
- CalendarContextCta: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Production records: not imported
- No content published
- No deployment
- No commit (pending owner approval)

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `<details>` marker suppression inconsistent across browsers | Low | `list-none` + `[&::-webkit-details-marker]:hidden` covers major engines; content is still accessible and visible on expand |
| `source_url` field name conflicts with existing `source` field | None | They are distinct fields: `source` (legacy URL on some items) and `source_url` (new brief-level source) — both optional, both survive in JSON cast |
| `parseDatesJson` casts via `as CalendarDateItem[]` | None | TypeScript cast; extra JSON fields are on the runtime objects regardless of type; brief fields will be populated correctly when present |
| `<details>` content indexed by search engines | Design intent | All content is SSR'd in initial HTML — this is required behaviour, not a risk |
| Long Weekends `date_end` vs `period_end` pre-existing inconsistency | None | Brief fields add zero interaction with that inconsistency |

---

## Final Report Q&A

### Can existing calendar pages still render without brief fields?

Yes. `CalendarBriefSection` returns `null` when no items have `brief_en` (or `brief_ru` for RU). All existing pages were verified 200 with correct date list rendering. Zero `<details>` elements appear on pages without brief data.

### Are briefs server-rendered when fields exist?

Yes. `CalendarBriefSection` has no `"use client"` directive. It is a pure server component. All text, source links, and CTA links are rendered in the initial HTML. After local DB import (Phase 6C-68), `curl` of the page and `grep` for brief text will confirm server presence.

### Does RU avoid EN fallback?

Yes. The filter is `isRu ? !!item.brief_ru : !!item.brief_en`. Items without `brief_ru` are skipped on the RU page — they produce no HTML output at all. This is strictly enforced; there is no fallback path.

### Is CalendarGrid untouched/stable?

Yes. CalendarGrid was not read after initial inspection and was not modified. All 10 route checks pass including `/calendar` and `/ru/calendar` which feed CalendarGrid.

### Is it safe to commit?

Yes, with owner approval. The changes are:
- Additive TypeScript only — no breaking changes to existing interfaces
- New server component — zero impact on existing pages when brief data is absent
- Two small import + one-line render additions to the detail pages
- Build passes clean, TypeScript passes clean, all routes 200

### What should 6C-68 import locally for testing?

**Phase 6C-68 local import checklist:**

1. **Create the `uae-e-invoicing-2026-deadlines` calendar_pages row locally** using the `sqlite3` CLI (or a local admin session) — do NOT touch production DB:
   - `calendar_type`: `important_dates`
   - `year`: 2026
   - `en_title`: UAE E-Invoicing 2026: Key Deadlines
   - `dates_json`: the three JSON objects from `docs/content-drafts/calendar/e-invoicing-2026-indexed-brief-data.md` (TAX-05A, TAX-05C, TAX-05D) with all brief fields populated
   - `status`: `published`

2. **Optionally create the news post `uae-e-invoicing-2026-asp-deadline-update`** locally so Scenario B CTAs (`/news/uae-e-invoicing-2026-asp-deadline-update`) resolve to a real page — prevents 404 when the CTA is clicked during local QA.

3. **QA steps after local import:**
   - `curl http://localhost:3000/calendar/uae-e-invoicing-2026-deadlines | grep -o '<details' | wc -l` — should return 3 (one per brief item)
   - `curl http://localhost:3000/calendar/uae-e-invoicing-2026-deadlines | grep "brief_en"` — should return 0 (no raw JSON leaking)
   - `curl http://localhost:3000/calendar/uae-e-invoicing-2026-deadlines | grep "E-Invoicing"` — should return matches in plain text
   - Load page in browser with JS disabled — all brief text must be visible
   - Load `/ru/calendar/uae-e-invoicing-2026-deadlines` — RU briefs should appear; no EN text in brief section
   - Click each CTA — Scenario B CTAs should navigate to news post; Scenario A open_source CTAs open official MoF URL
   - Take iPhone screenshot for mobile readability

4. **Do not use this local import in production** until owner has reviewed and approved the rendered output.

---

**Phase 6C-67 is complete. Code is local only. No DB was modified. No production import. No deployment. Commit pending owner approval.**
