# Phase 6C-65 — Calendar Indexed Briefs Technical Implementation Plan

**Date:** 2026-05-25
**Phase:** 6C-65
**Scope:** Planning only — no code, no DB, no imports, no deploys

---

## 1. Current Implementation Audit

### Files inspected

| File | Type | Role |
|---|---|---|
| `components/calendar/CalendarGrid.tsx` | `"use client"` | Interactive grid/agenda — full-page calendar widget |
| `components/calendar/CalendarMiniPreview.tsx` | Server-compatible | Small link widget used on detail/news pages |
| `components/calendar/CalendarContextCta.tsx` | Server-compatible | Calendar back-link CTA on detail/news pages |
| `app/(en)/(public)/calendar/page.tsx` | Server component | Full-page `/calendar` — feeds all dates to CalendarGrid |
| `app/ru/calendar/page.tsx` | Server component | RU mirror of the above |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Server component | Individual calendar detail pages (SSG-capable) |
| `app/ru/calendar/[slug]/page.tsx` | Server component | RU mirror of the above |
| `lib/db/news-events-calendar.ts` | Reader (read-only) | All public calendar queries; `parseDatesJson` parser |
| `lib/calendar-mock-data.ts` | Interface definition | `CalendarDateItemExtended` — the extended item type |
| `lib/calendar-helpers.ts` | Pure helpers | Color, badge, CTA, filter helpers per item |
| `lib/db/schema.ts` | Drizzle schema | `calendar_pages` table definition |

---

### calendar_pages schema (current)

```sql
id, slug, status, calendar_type, year, month,
en_title, en_summary, en_body, en_notes, en_seo_title, en_meta_description,
ru_published, ru_title, ru_summary, ru_body, ru_notes, ru_seo_title, ru_meta_description,
image_path, image_alt, ru_image_alt,
dates_json TEXT NOT NULL DEFAULT '[]',
has_islamic_dates, official_source_url, last_verified_date,
featured_homepage, created_at, updated_at
```

`dates_json` is a freeform `TEXT` column. No schema validator is applied — the parser does `JSON.parse()` and casts with `as CalendarDateItem[]`. Extra fields in JSON items are silently preserved at runtime.

---

### Live datesJson field shape (from actual production data)

Fields observed in May 2026, Emiratisation, Long Weekends:

```
date              required   "2026-06-30"
label_en          required   full event label
label_ru          required   (may be "" for unfinished rows)
short_label_en    optional   ≤15 chars for grid pill
short_label_ru    optional
type              required   "public-holiday" | "important-date" | "deadline" | "other" | "compliance_deadline"
confidence        required   "confirmed" | "expected" | "subject_to_official_confirmation"
priority          optional   1 | 2 | 3 | 4
detail_url        optional   internal slug or external URL
period_end        optional   ISO date for multi-day events
date_end          optional   used in Long Weekends (legacy alias for period_end — do not normalise in this phase)
source            optional   URL string
is_external       optional   boolean
custom_cta_en     optional   overrides CTA label
custom_cta_ru     optional
```

No brief fields exist yet. All proposed brief fields are net-new and optional.

---

### Two distinct calendar page types in this codebase

| Route | Description | Component | Rendering |
|---|---|---|---|
| `/calendar` | Interactive full-page calendar | CalendarGrid (`"use client"`) | SSR initial HTML, then hydrated |
| `/calendar/[slug]` | Individual calendar detail page | Dates list in server component | Pure SSR, SSG-capable |

**Critical distinction:** Briefs do NOT render in CalendarGrid. They render on the detail pages (`/calendar/[slug]`). CalendarGrid is `"use client"` and is complex — no changes to it in the MVP. Briefs appear when the user navigates to a monthly or important-dates page.

---

### Data flow for calendar detail pages

```
DB (dates_json TEXT)
  → parseDatesJson() → CalendarDateItem[]          (minimal type)
  → CalendarPageDetail.dates                        (returned to page)
  → /calendar/[slug]/page.tsx renders dates list   (server component — pure SSR)
```

Brief fields added to JSON items will survive `parseDatesJson()` at runtime (simple JSON.parse, no validation). They will be present on the item objects even if TypeScript types don't yet declare them. Once types are updated, they become fully typed.

---

## 2. Data Storage Options Assessment

### Option A — Store brief fields inside existing dates_json items (additive fields)

| Dimension | Assessment |
|---|---|
| Schema risk | None — dates_json is already a freeform TEXT/JSON column; no ALTER TABLE needed |
| Admin risk | Low — existing admin JSON editor can handle new fields; brief UI can be added later |
| Code complexity | Low — TypeScript interface update + one new section in two detail page files |
| SEO/RAG value | High — brief content in initial HTML response on indexed `/calendar/[slug]` pages |
| EN/RU parity | Clean — brief_en/brief_ru matches existing column naming convention |
| Batch import ease | Easy — update datesJson per row in admin or import script |
| Duplicate risk | Low — brief is tied to the item, not a separate record |
| Rollback safety | Highest — remove brief fields from JSON, zero DB structure change |

**Verdict: Recommended for MVP.**

---

### Option B — Add a separate JSON column (e.g., `briefs_json`) to calendar_pages

| Dimension | Assessment |
|---|---|
| Schema risk | Medium — requires Drizzle migration; SQLite migrations are hard to undo |
| Admin risk | Medium — new column in writer.ts, admin form |
| Code complexity | Medium — new column, new reader fields, new parser |
| SEO/RAG value | Same as Option A if SSR'd |
| EN/RU parity | Manageable |
| Batch import ease | More complex — two JSON columns per row to maintain |
| Duplicate risk | Low |
| Rollback safety | Lower — column removal requires table recreation in SQLite |

**Verdict: Not recommended for MVP. Consider only if brief fields grow beyond viable JSON size or if per-item briefs conflict with page-level briefs.**

---

### Option C — Separate DB table for briefs (briefs table with foreign key to calendar_pages)

| Dimension | Assessment |
|---|---|
| Schema risk | Highest — new table, schema, foreign key semantics |
| Admin risk | Highest — entirely new admin section |
| Code complexity | High — joins or separate queries per slug |
| SEO/RAG value | Same if SSR'd correctly |
| EN/RU parity | Manageable |
| Batch import ease | Complex — separate import path |
| Duplicate risk | Orphaned records possible if slug changes |
| Rollback safety | Lowest |

**Verdict: Not recommended now. Revisit only if the calendar platform evolves to require standalone brief management (brief editor, per-brief lifecycle controls, brief-only search).**

---

### Option D — File-based brief bank first, import later

| Dimension | Assessment |
|---|---|
| Schema risk | None |
| Admin risk | None |
| Code complexity | None now, complex bridge later |
| SEO/RAG value | Zero — file content not rendered on public pages |
| EN/RU parity | Maintained in files |
| Batch import ease | Deferred |
| Duplicate risk | Low |
| Rollback safety | Highest |

**Verdict: Not recommended if the goal is indexed content. File-based briefs exist in `docs/content-drafts/` already — they serve as the authoring stage only. Import to DB is required for any public SEO/RAG value.**

---

## 3. Recommended MVP Data Shape

**Approach: Additive optional fields inside existing dates_json items. No schema change.**

### Interface update required

`CalendarDateItemExtended` in `lib/calendar-mock-data.ts` needs new optional fields:

```typescript
// Brief fields — optional, additive, backward-compatible
brief_en?:        string;   // 80–180 words; full brief text
brief_ru?:        string;   // Russian brief; "" = not translated yet
who_for_en?:      string;   // Audience description, 1 sentence
who_for_ru?:      string;
what_to_do_en?:   string;   // Action or awareness note, 1 sentence
what_to_do_ru?:   string;
source_label_en?: string;   // "Ministry of Finance", "MOHRE", etc.
source_label_ru?: string;
source_url?:      string;   // Official source URL
source_status?:   string;   // "confirmed" | "expected" | "monitoring"
cta_type?:        string;   // "view_details" | "read_guide" | "open_event" | "open_source" | "add_calendar" | "ask_guidex"
cta_url?:         string;   // Internal slug or external URL
cta_label_en?:    string;   // Overrides default CTA label
cta_label_ru?:    string;
location_en?:     string;   // Optional venue/location note
location_ru?:     string;
risk_level?:      string;   // "high" | "medium" | "low" | "info"
lifecycle?:       string;   // "time_sensitive_news" | "compliance_evergreen" | "seasonal_recurring"
noindex_after?:   string;   // ISO date — when to set noindex on parent page
archive_action?:  string;   // "noindex" | "remove" | "keep"
```

`CalendarDateItem` in `lib/db/news-events-calendar.ts` also needs the same optional brief fields, since `parseDatesJson` uses that type. Alternative: parse as `CalendarDateItemExtended` from the start (simpler unification).

### Backward compatibility

Items without brief fields render exactly as today — no change to grid, agenda, or dates list. Brief section renders only if `brief_en` is non-empty. The `parseDatesJson` function needs no logic change — it is a simple JSON.parse cast.

### EN/RU parity rule

- If `brief_ru` is empty or absent: the RU detail page skips the brief for that item. No EN fallback shown — consistent with the existing "no fallback" policy.
- Author must supply both `brief_en` and `brief_ru` before an item is flagged as RU-ready.
- `who_for_ru`, `what_to_do_ru`, `source_label_ru`, `cta_label_ru` follow same rule: empty = not displayed.

---

## 4. UI Behavior — Where and How Briefs Render

### Render location

Briefs render on **calendar detail pages** only (`/calendar/[slug]/page.tsx` and `/ru/calendar/[slug]/page.tsx`). These are server components. The brief section is added BELOW the existing dates list, or the dates list itself is extended so each item can expand its brief inline.

The main `/calendar/page.tsx` (interactive grid) is NOT changed. The CalendarGrid client component is NOT changed.

### Page layout with briefs

```
/calendar/may-2026-uae-calendar
  ├── Back link
  ├── Hero
  ├── Summary paragraph
  ├── Source link
  ├── Islamic dates warning (if applicable)
  ├── CalendarMiniPreview widget
  ├── Body (Markdown)
  ├── Dates list (existing)        ← current rendering, unchanged
  ├── Briefs section (NEW)         ← <details>/<summary> per item with brief_en
  ├── Notes
  └── WhatsApp CTA
```

Alternatively, if inline-within-dates-list is preferred by owner, each dates list `<li>` can include a brief accordion. Both approaches are pure SSR. The below-dates-list section is safer for MVP — no changes to the existing dates list rendering.

### HTML structure for each brief

```html
<section>
  <div class="w-5 h-0.5 bg-brass rounded-full mb-2" />
  <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
    Key Dates — Details
  </p>

  <details class="border border-stone-100 rounded-xl mb-2">
    <summary class="px-4 py-3 cursor-pointer list-none flex items-center justify-between">
      <div>
        <span class="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style="background-color: #EF4444">Tax</span>
        <span class="text-[13px] font-medium text-gray-800 ml-2">30 Oct 2026: ASP registration deadline</span>
      </div>
      <span class="text-gray-400 text-[12px]">▾</span>
    </summary>
    <div class="px-4 pb-4 pt-1">
      <p class="text-[13px] text-gray-700 leading-relaxed mb-2">
        [brief_en text — 80 to 180 words]
      </p>
      <p class="text-[11px] text-gray-500 mb-2">
        For: [who_for_en]
      </p>
      <p class="text-[11px] text-gray-500 mb-3">
        What to do: [what_to_do_en]
      </p>
      <!-- Source note -->
      <p class="text-[11px] text-gray-400 mb-2">
        Source: <a href="[source_url]" rel="noopener noreferrer" class="text-brass">[source_label_en] ↗</a>
        · [source_status]
      </p>
      <!-- CTA link -->
      <a href="[cta_url]" class="text-[13px] font-semibold text-brass hover:opacity-75">
        [cta_label_en] →
      </a>
    </div>
  </details>
</section>
```

### Indexability guarantee

All text inside `<details>` is in the **initial server-rendered HTML** — it is not fetched after hydration. There is no `useEffect`, no API call on expand, no lazy hydration of brief content. The `<details>/<summary>` element renders collapsed by default but all text content is present in the DOM from the first HTTP response.

### What is explicitly prohibited

- Do not put brief content behind a client-side fetch (useEffect, onClick → fetch)
- Do not use `suppressHydrationWarning` on brief content
- Do not reference `dynamic(() => import())` for brief content
- Do not use `loading="lazy"` on the brief text container
- Do not use raw Markdown strings rendered client-side
- Do not use JavaScript accordion libraries that swap content via JS
- "Read full article" as CTA label — use the specific approved labels from the CTA table

---

## 5. SEO / Indexability QA Checklist

All checks run locally against a test calendar_pages row with brief fields before any production deploy.

| Check | Command / Method | Pass condition |
|---|---|---|
| Brief text in initial HTML | `curl -s http://localhost:3000/calendar/[slug] \| grep "[first 10 words of brief_en]"` | Exits 0, text found |
| RU brief text on RU page | `curl -s http://localhost:3000/ru/calendar/[slug] \| grep "[brief_ru snippet]"` | Exits 0, text found |
| Source label visible | `curl -s ... \| grep "[source_label_en]"` | Found in raw HTML |
| CTA is real href | `curl -s ... \| grep 'href="[cta_url]"'` | `<a href=` found, not onClick |
| No raw Markdown | `curl -s ... \| grep '\*\*\|##\|---'` | Exit 1 (not found) |
| No client fetch for briefs | Read component source — no useEffect/fetch in brief path | Manual |
| No duplicate agenda groups | Inspect rendered HTML for repeated date+label pairs | Manual |
| Mobile layout clean | Open on iPhone via local IP, check no overflow | Visual |
| JS-disabled fallback | Firefox devtools → disable JS → load page | Brief text visible, source + CTA still accessible |
| CTA links resolve | `curl -I [cta_url]` | HTTP 200 or 301 |

---

## 6. First Safe Code MVP

### Scope

Smallest possible change that enables indexed briefs on calendar detail pages without touching CalendarGrid, the main calendar page, or the DB schema.

### Files to change (in order)

**Step 1 — TypeScript interfaces only (no runtime change)**

`lib/calendar-mock-data.ts`
- Add optional brief fields to `CalendarDateItemExtended` interface

`lib/db/news-events-calendar.ts`
- Add optional brief fields to `CalendarDateItem` interface
- Or: change `parseDatesJson` return type to `CalendarDateItemExtended` (simpler unification)

**Step 2 — Brief section in EN detail page (one new section, zero changes to existing rendering)**

`app/(en)/(public)/calendar/[slug]/page.tsx`
- After the existing `{page.dates.length > 0 && (...)}` block, add a new brief section:
  - Filter `page.dates` for items where `(item as CalendarDateItemExtended).brief_en`
  - If any have briefs, render the `<details>/<summary>` brief section
  - No changes to the existing dates list block above it

**Step 3 — Mirror in RU detail page**

`app/ru/calendar/[slug]/page.tsx`
- Same brief section, using `brief_ru` — render only if `brief_ru` is non-empty
- Do not fall back to `brief_en` on the RU page

**Step 4 — No other files change**

CalendarGrid, CalendarMiniPreview, CalendarContextCta, calendar-helpers, schema — all untouched.

### No component extraction required for MVP

The brief rendering logic is simple enough to inline in the page file. A `CalendarBrief` component can be extracted later. Do not extract prematurely for one-off MVP code.

### Test against local-only record

Before touching any production data:
1. Manually add `brief_en` and test fields to one item in the local `data/guides.db` for a test slug
2. Build and run locally: `npm run dev -- --hostname 0.0.0.0`
3. Verify with `curl` that brief text appears in initial HTML
4. Disable JS, verify fallback
5. Check mobile layout on iPhone via local IP
6. Owner screenshot review and approval
7. Only then write production DB brief content and plan production deploy

---

## 7. First Safe Data Batch After Implementation

### Approved for first batch (pending owner content approval)

| Item | Calendar page | Brief status |
|---|---|---|
| E-invoicing Jul 1 pilot start (TAX-05A) | `uae-e-invoicing-2026-deadlines` | Draft in docs/content-drafts/ — needs EN brief (~100 words), RU brief |
| E-invoicing Oct 30 ASP deadline (TAX-05C) | `uae-e-invoicing-2026-deadlines` | Draft exists — needs EN and RU brief, cta_url → news post slug |
| E-invoicing Jan 1 2027 mandatory (TAX-05D) | `uae-e-invoicing-2026-deadlines` | Draft in docs/content-drafts/ — needs EN brief, RU brief |
| Emiratisation June 30 (TAX-01A) | `uae-emiratisation-june-30-2026-reminder` | Already live — can update datesJson item with brief_en/brief_ru |

### Blocked — do NOT import as briefs yet

| Item | Reason |
|---|---|
| HOL-02 Islamic New Year | FAHR date unconfirmed — no source for brief |
| HOL-03 Mawlid | FAHR date unconfirmed |
| HOL-04 Commemoration Day | HOL-04/HOL-05 December path decision pending |
| HOL-05 National Day | Same — pending December 2026 monthly page decision |
| DXB-02 GITEX 2026 | Exact dates not captured yet |
| AUH-01 F1 Abu Dhabi 2026 | Exact dates not captured yet |
| TAX-02 Corporate Tax Sept 30 | Guide draft not ready |

### Brief data requirements before import

- [ ] `brief_en` non-empty, 80–180 words, fact-safe language only
- [ ] `brief_ru` non-empty (or explicitly deferred with `ruPublished: 0` pattern)
- [ ] `source_url` verified live (HTTP 200)
- [ ] `cta_type` and `cta_url` confirmed — internal slugs must exist and be published
- [ ] `source_status: "confirmed"` only if source was verified in the current phase
- [ ] No deadline claims beyond what source explicitly states
- [ ] No penalty/fine amounts unless source-backed
- [ ] Owner reviews EN draft — approves before import
- [ ] Owner reviews RU draft if RU is to be published simultaneously

---

## 8. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| TypeScript type update breaks existing code | Medium | Low | Additive optional fields only; no field renamed or removed; TypeScript won't error on extra fields |
| Brief content too long, breaks mobile layout | Low | Medium | 80–180 word limit enforced at content authoring stage; test on iPhone before deploy |
| `date_end` vs `period_end` field inconsistency in live data | Low | Confirmed | Already exists in Long Weekends data — document, do not fix in this phase |
| RU page renders EN brief (fallback) | High | Low | Enforce no-fallback rule in code: only render RU brief section if `brief_ru` is non-empty |
| CalendarGrid reacts unexpectedly to new fields in items | Low | Very low | CalendarGrid reads only the fields it knows — extra fields are ignored; no change to CalendarGrid |
| `parseDatesJson` strips brief fields from output | None | Very low | Parser does `JSON.parse() as CalendarDateItem[]` — cast does not strip runtime data; all fields preserved at runtime |
| Production deploy without local test | High | Medium | Hard rule: no production DB write until local QA + owner screenshot sign-off |
| Brief content makes unsupported legal claim | Critical | Low | Fact safety audit per item before import; use safe language ("deadline set by", "as announced by") |
| `cta_url` points to unpublished or removed slug | Medium | Low | Verify each cta_url is HTTP 200 before import; add to pre-import checklist |
| `source_url` goes dead between import and crawl | Low | Low | Source recheck at import time; note recheck date in source_status field |

---

## Final Report Q&A

### Can indexed briefs be implemented without DB schema change?

Yes. `dates_json` is a freeform TEXT/JSON column. Brief fields are added to individual JSON items inside the existing column. No `ALTER TABLE`, no Drizzle migration, no new column. The `parseDatesJson` function uses `JSON.parse` with a cast — it does not validate against a fixed schema and will not strip the new fields.

### Where should brief content live initially?

Inside `dates_json` items on the relevant `calendar_pages` row. This is Option A. No new column, no new table, no file-based intermediary at the point of rendering. Authoring happens in `docs/content-drafts/` as Markdown source; the approved content is imported into the `dates_json` item fields via admin or import script.

### What is the safest MVP code phase?

Two TypeScript interface files updated (no runtime change) + one new brief section added to each of the two calendar detail page server components (`/calendar/[slug]/page.tsx` and `/ru/calendar/[slug]/page.tsx`). Zero changes to CalendarGrid, calendar-helpers, schema, admin, or the main /calendar page. Local DB test with one synthetic row before any production write.

### How will Google/AI see the brief text?

The calendar detail pages are server components. They call `getCalendarPageBySlug` at request time (SSR) or build time (SSG). The brief section renders as static HTML in the initial response. `<details>/<summary>` content is present in the DOM before any JavaScript executes. `curl` will return the full brief text. Google indexes `<details>` content. AI/RAG crawlers that use static HTML snapshots will see it.

The `/calendar/page.tsx` (interactive grid) is excluded — CalendarGrid is `"use client"` and complex; its initial HTML is SSR'd by Next.js, but adding brief content there creates unnecessary complexity. The indexed value comes from the `/calendar/[slug]` pages, which are the correct target for this content.

### What should be imported first after implementation?

In priority order:
1. E-invoicing three-item package (TAX-05A/C/D) on `uae-e-invoicing-2026-deadlines` — owner review already in progress, source verified, content drafted
2. Emiratisation June 30 brief update on the existing `uae-emiratisation-june-30-2026-reminder` row — low risk, extends a live item
3. Nothing else until December 2026 page decision is made (HOL-04/HOL-05) and GITEX/F1 dates are captured

### What risks remain?

1. RU brief parity — every import needs a RU brief or explicit deferral decision
2. `date_end` vs `period_end` inconsistency in live Long Weekends data — pre-existing, document and carry forward
3. CTA URLs must be verified live before each import batch
4. Fact safety audit required per item — no unverified deadlines, no fine amounts without source
5. Brief text length discipline — must stay 80–180 words; brief is not an article
6. Production DB write must not happen until local QA + owner screenshot approval

### Is code implementation recommended now or after one more data-prep phase?

**After one more data-prep phase.** Before writing code:

1. Owner must approve the e-invoicing news post draft (`uae-e-invoicing-2026-asp-deadline-update`) and the `uae-e-invoicing-2026-deadlines` calendar_pages row — these are the test records for the first code phase
2. `brief_en` text for each of TAX-05A, TAX-05C, TAX-05D must be authored, reviewed, and ready to import
3. `brief_ru` texts must exist or be explicitly deferred

Rationale: writing the brief rendering code before having any real brief data to test against forces synthetic test data and risks a deploy that never actually displays a brief on production. One data-prep phase produces:
- The actual `brief_en` texts in final form
- Approved RU brief texts (or explicit deferral)
- Verified CTA URLs and source URLs
- Owner sign-off on the content model

With those in hand, the code phase becomes a 3-4 file change that can be tested end-to-end against real data in local dev, reviewed on iPhone, and deployed cleanly.

---

## Output File

| File | Purpose |
|---|---|
| `docs/content-drafts/PHASE_6C65_CALENDAR_INDEXED_BRIEFS_TECHNICAL_PLAN.md` | This file — full technical plan for indexed brief implementation |

---

**Phase 6C-65 is complete. No code was touched. No DB was modified. No content was imported or deployed.**
