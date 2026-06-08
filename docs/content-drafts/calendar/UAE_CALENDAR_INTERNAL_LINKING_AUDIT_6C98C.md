# UAE Calendar Internal Linking Audit
## Phase 6C-98C Part A | Date: 2026-06-08

---

## Scope

Review internal linking between UAE Calendar pages, event guides, monthly calendar SSG pages,
life-setup, and the homepage — for gaps, broken links, mislabelled CTAs, and SEO/RAG quality.

---

## Pages audited

| Page | Route |
|------|-------|
| Calendar index | /calendar, /ru/calendar |
| Calendar SSG — December | /calendar/december-2026-uae-calendar |
| Calendar SSG — November | /calendar/november-2026-dubai-calendar |
| Calendar SSG — September | /calendar/september-2026-dubai-calendar |
| GITEX Global 2026 | /events/gitex-global-2026 |
| F1 Abu Dhabi GP 2026 | /events/formula-1-abu-dhabi-grand-prix-2026 |
| Dubai Design Week 2026 | /events/dubai-design-week-2026 |
| Big 5 Global Dubai 2026 | /events/big-5-global-dubai-2026 |
| Events index | /events |
| Life Setup | /life-setup |

---

## Findings

### 1. GAP — Event pages link to dynamic listing, not SSG calendar detail page

**Severity: Medium**

`CalendarMiniPreview` on every event page links to `/calendar?month=2026-12` (dynamic listing),
not to the richer SSG page `/calendar/december-2026-uae-calendar`.

The SSG detail page has:
- Indexed expandable briefs per date
- Source notes with verification dates
- Official source URL
- Arabic holiday disclaimer
- Deeper date context

Linking to the dynamic listing is one hop further from the SSG content.

**Fix (Part B):** Add `detailSlug` prop to `CalendarMiniPreview`. When set, use `calendarBase/detailSlug` as href.
Populate via secondary DB lookup in `getEventBySlug()`.

---

### 2. GAP — Related guide label shows slug text, not guide title

**Severity: Low**

`app/(en)/(public)/events/[slug]/page.tsx` (line 129) renders:
```typescript
{event.relatedGuideSlug.replace(/-/g, " ")}
```
This outputs "mainland company setup dubai" — not the real title.

The guide's actual EN title: "How to Set Up a Mainland Company in Dubai"
RU title: "Открыть mainland компанию в Дубае: лицензия DED и полный процесс"

**Fix (Part B):** Add secondary guide title lookup in `getEventBySlug()`. Return `relatedGuideTitle`.

---

### 3. PASS — Calendar SSG pages link to event guides (6C-98B)

`/calendar/december-2026-uae-calendar` now shows "View event guide →" for GITEX, F1, Capaldi, Dragons.
`/calendar/november-2026-dubai-calendar` now shows links for Design Week and Big 5.
Implemented and deployed in 6C-98B.

---

### 4. PASS — Dynamic calendar listing links to event guides

`CalendarGrid.tsx` renders `detail_url` from calendar item data as clickable links.
`/calendar?month=2026-12` links to GITEX and F1 event pages. ✓

---

### 5. PASS — Events index links to calendar

`/events` has a "UAE Calendar — Public holidays and monthly dates" block linking to `/calendar`. ✓

---

### 6. PASS — Calendar index does not need explicit event link

The `/calendar` page renders the `CalendarGrid` which shows all events inline with links.
No additional separate event links needed.

---

### 7. PASS — F1 correctly has no related guide

`formula-1-abu-dhabi-grand-prix-2026` has `related_guide_slug=""`.
This is correct — it is an Abu Dhabi event, not a Dubai business event.
Linking to `mainland-company-setup-dubai` or `free-zone-company-setup-dubai` would be misleading.
No F1 → Dubai Life Setup link exists because F1 is not about relocating to Dubai.

---

### 8. PASS — Dubai Design Week has no related guide

`dubai-design-week-2026` has `related_guide_slug=""`.
The Design Week event targets designers, visitors, and cultural travellers.
No existing Guidex guide is a clean fit. Correct to leave empty.

---

### 9. PASS — GITEX links to correct guide

`gitex-global-2026` has `related_guide_slug="mainland-company-setup-dubai"`.
Guide exists and is published. Link is valid. Relevant for business visitors attending GITEX. ✓

`big-5-global-dubai-2026` has same `related_guide_slug`. Also valid. ✓

---

### 10. PASS — Life Setup page references calendar

`/life-setup` page has calendar notes for each stage, links to
`/calendar/uae-emiratisation-june-30-2026-reminder`, and has "Open UAE Calendar →" CTA. ✓

---

### 11. PASS — Abu Dhabi labelling

- F1 event title explicitly includes "Abu Dhabi Grand Prix" and "Yas Marina Circuit"
- Calendar items for F1: "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026 at Yas Marina (4-6 December, Abu Dhabi)"
- No mislabelling as Dubai event found

---

### 12. PASS — RU pages — no EN fallback

RU event templates use strict locale gates:
- `item.label_ru || item.label_en` in calendar items (appropriate for date labels)
- Guide content: RU body must be non-empty or RU page returns 404
- WhatsApp CTAs in Russian on all RU pages

---

### 13. PASS — No broken internal links

All verified internal hrefs:
- `/events/gitex-global-2026` → 200 ✓
- `/events/formula-1-abu-dhabi-grand-prix-2026` → 200 ✓
- `/events/dubai-design-week-2026` → 200 ✓
- `/events/big-5-global-dubai-2026` → 200 ✓
- `/guides/mainland-company-setup-dubai` → 200 ✓
- `/calendar/december-2026-uae-calendar` → 200 ✓
- `/calendar/november-2026-dubai-calendar` → 200 ✓

---

## Gap summary

| # | Gap | Fix | Files |
|---|-----|-----|-------|
| 1 | Event pages link to dynamic listing, not SSG page | Add `detailSlug` to CalendarMiniPreview; lookup in reader | reader, CalendarMiniPreview, 2× event templates |
| 2 | Related guide shows slug text, not guide title | Add `relatedGuideTitle` to reader | reader, 2× event templates |

All other links: PASS. No broken links. No mislabelling.

---

## Scope of Part B changes

3-4 code files only:
- `lib/db/news-events-calendar.ts` — EventDetail + getEventBySlug secondary lookups
- `components/calendar/CalendarMiniPreview.tsx` — add optional `detailSlug` prop
- `app/(en)/(public)/events/[slug]/page.tsx` — use new fields
- `app/ru/events/[slug]/page.tsx` — use new fields

No DB schema changes. No new routes. No content import. No production writes.
