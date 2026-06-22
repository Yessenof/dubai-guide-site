# Phase 6C-CALENDAR-UX-01 — Mobile Calendar Readability & Visual Hierarchy
## Deploy Report

Date: 2026-06-22
Status: Local changes complete. Pending owner review before commit/deploy.
Build: Passed (88 pages, 0 TypeScript errors, 0 compilation errors)

---

## Summary

Improved mobile readability, visual hierarchy, and scan clarity of the Guidex Calendar (CalendarGrid.tsx) without changing any calendar content, DB data, schema, or Event JSON-LD. All changes are conservative CSS class updates within a single component file.

---

## Files Changed

| File | Type of change |
|---|---|
| `components/calendar/CalendarGrid.tsx` | Mobile UX improvements — font sizes, tap targets, grid density, confidence labels |

## Files Created

| File | Purpose |
|---|---|
| `docs/content-drafts/ui/6c-calendar-ux-01-mobile-audit.md` | Full mobile UX audit |
| `docs/content-drafts/ui/6c-calendar-ux-01-report.md` | This report |

---

## Design Decisions

1. **Conservative sizing only** — all font size increases are 1–2px. No visual redesign.
2. **Confidence labels in AgendaRow** — the compact list was the only surface not showing confirmation status. Added amber "expected" / "moon sighting" micro-label using existing `confidence` data.
3. **Arrow button tap targets increased** — from 28×28px (w-7) to 36×36px (w-9). Stays compact, better accessibility.
4. **Grid cell height +6px on mobile** — from 64px to 70px. More breathing room for pill labels.
5. **Section headings slightly darker/larger** — "This Month in the UAE" and "All dates this month" headings from 12px gray-400 to 13px gray-500. Still understated, but more legible as section anchors.
6. **Desktop changes minimal** — grid and sidebar use `md:h-[86px]` (unchanged). Section heading changes apply to both mobile and desktop sidebar but are subtle and consistent.

---

## Mobile Readability Improvements

| Element | Before | After |
|---|---|---|
| Nav arrow buttons | 28×28px | 36×36px |
| Grid cell height (mobile) | 64px | 70px |
| Grid pill label | 9px | 10px |
| Section headings | 12px gray-400 | 13px gray-500 |
| Brass accent lines | w-5 | w-6 |
| Legend label | 11px | 12px |
| AgendaRow date column | 12px gray-500 | 13px gray-600 |
| AgendaRow badge | 10px | 11px |
| AgendaRow CTA link | 12px | 13px |
| GroupedAgendaRow date | 12px | 13px |
| GroupedAgendaRow badge | 10px | 11px |
| GroupedAgendaRow inner date | 12px | 13px |
| GroupedAgendaRow CTA link | 12px | 13px |
| AgendaRow confidence | Not shown | "expected" / "moon sighting" in amber-600 (11px) |

---

## Icon / Badge / Status Improvements

- **Badge text size** increased from 10px → 11px in all list rows. Scanning by category (Holiday, Tax, Deadline, Event) is noticeably easier.
- **Confidence labels now visible in list view.** Previously, confirmation status was only visible in the selected-day popup (AgendaCard). Now the full agenda list also shows "expected" or "moon sighting" for non-confirmed items using existing `confidence` field values.
- **No new status types invented.** Only `expected` and `subject_to_official_confirmation` values are surfaced; `confirmed` items show no label (already confirmed = default assumption).

---

## Screenshots

Screenshots not taken — Playwright/browser automation not configured in this environment. Visual verification done via the running dev server on localhost:3000.

Dev server URLs:
- Desktop: http://localhost:3000
- iPhone: http://192.168.1.20:3000

Screenshot folder would be: `docs/content-drafts/ui/6c-calendar-ux-01-screenshots/` — not created.

---

## Build Result

```
✓ Compiled successfully in 2.4s
✓ TypeScript: 0 errors
✓ 88 pages generated
```

---

## Route QA Result

All 14 required routes returned HTTP 200:

| Route | Status |
|---|---|
| / | 200 |
| /ru | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| /calendar/october-2026-dubai-calendar | 200 |
| /ru/calendar/october-2026-dubai-calendar | 200 |
| /calendar/november-2026-dubai-calendar | 200 |
| /ru/calendar/november-2026-dubai-calendar | 200 |
| /calendar/december-2026-uae-calendar | 200 |
| /ru/calendar/december-2026-uae-calendar | 200 |
| /events/dp-world-tour-championship-2026 | 200 |
| /events/gitex-global-2026 | 200 |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /sitemap.xml | 200 |

---

## Regression Checks Result

| Check | Result |
|---|---|
| Homepage renders correctly | PASS |
| StickyRouteCta excluded from /calendar/* | PASS (confirmed in StickyRouteCta.tsx isHiddenRoute) |
| October e-invoicing AED 50M+ (not 150M) | PASS |
| No stale AED 150M / 150 млн | PASS |
| November slug: november-2026-dubai-calendar | PASS (200) |
| December slug: december-2026-uae-calendar | PASS (200) |
| GITEX page still renders | PASS |
| F1 Abu Dhabi / Yas Marina confirmed | PASS |
| DP World Tour page still renders | PASS |
| No Global Village exact date | PASS |
| No DSF exact dates invented | PASS (text correctly says "typically begins in December, not yet announced") |
| No Emiratisation penalty figure | PASS |
| No "all companies" wording | PASS |
| EN/RU layout parity | PASS (same CalendarGrid component with locale prop) |
| No horizontal overflow | PASS (all flex/grid containers confirmed safe) |

---

## What Was Intentionally Not Changed

- Calendar facts, dates, labels, summaries — unchanged
- DB / schema — not touched
- Event JSON-LD — not touched
- Admin panel — not touched
- AI Inbox — not touched
- Imports / seed scripts — not touched
- StickyRouteCta exclusion logic — already correct, not touched
- AgendaCard layout — already well-designed, not touched
- Filter chip system — already works correctly, not touched
- Month picker panel — already clean, not touched
- CalendarBriefSection — already good, not touched
- EN/RU content — not translated or changed
- GSC Event schema warnings (image, performer) — deferred per phase instructions

---

## GSC Event Schema Warning Follow-Up

From owner notes on DP World Tour page:

**Missing field: image**
- Can be fixed in a future phase if a valid, crawlable, indexable event image exists
- Candidate fix: add `image` field to Event JSON-LD pointing to an official event image URL
- Do not add an image unless a real, stable URL is available

**Missing field: performer**
- Do not add `performer` to Event JSON-LD unless an official source confirms the specific players/participants
- GSC recommends `performer` for sports events, but inventing it without source is a content integrity violation
- This field must remain absent until confirmed from official DP World Tour source

**Recommended follow-up phase:** `6C-EVENTS-SCHEMA-01` — Event rich result recommended fields audit/fix
- Scope: audit all Event JSON-LD across /events/* for GSC recommended fields
- Priority: image (if available), organizer (if confirmed), eventStatus, eventAttendanceMode
- performer: only if official source confirms participants

---

## Confirmation: No DB / Admin / AI Inbox / Import / Deploy / Commit / Push / Schema Changes

- No DB touched
- No schema changed
- No imports run
- No admin files touched
- No AI Inbox touched
- Not committed
- Not pushed
- Not deployed

---

## Owner Approval Required

Yes — owner must review the local changes at http://localhost:3000/calendar and http://192.168.1.20:3000/calendar before commit and deploy.

The changes are conservative and low-risk, but visual confirmation on a real phone is recommended before pushing to production.

---

## Next Recommended Phase

`6C-EVENTS-SCHEMA-01` — Event rich result recommended fields audit/fix
- Fix GSC Event schema warnings for image and performer fields
- Scope: /events/* JSON-LD audit
- image: add if valid crawlable URL exists
- performer: do not add without official source confirmation
