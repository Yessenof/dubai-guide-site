# Phase 6C-38 — Emergency Public Surface Audit and Stabilization Report

**Date:** 2026-05-20
**Phase:** 6C-38
**Type:** Emergency audit, code fix, public surface stabilization
**Scope:** Calendar data source, Dubai Life Setup link, homepage desktop alignment, SEO safety

---

## Hard restrictions (enforced — zero deviations)

- No new content drafts created
- No Emiratisation production import
- No new records imported
- No DB schema or migrations touched
- No production data deleted
- No admin or AI Inbox used
- No GTM/GA4/env/secrets changed
- No unrelated content published
- No push/deploy performed
- No commit performed (pending validation sign-off)

---

## Root cause summary

| Issue | Root cause |
|-------|------------|
| Calendar showing mock/test data | Both `/calendar` and `/ru/calendar` imported `MOCK_CALENDAR_ITEMS` from `lib/calendar-mock-data.ts` and passed them directly to `CalendarGrid`. DB was never read. |
| Eid A–D not visible in calendar | Eid items are in DB (May 25–29 in `may-2026-uae-calendar`), but the calendar grid showed mock Eid dates (June 6–9) instead. Since mock data replaced DB data entirely, real items never rendered. |
| Dubai Life Setup routes to All Guides | Homepage card used `<Link href="/guides">`. No Dubai Life Setup route exists. |
| Homepage desktop alignment | `FeaturedSlider.tsx` had `px-5` on its inner wrapper divs rather than the outer section. Other homepage sections use `px-5` on the section and `max-w-2xl mx-auto` on the inner div. On desktop (>672px), this made the slider 20px narrower and 20px more inset on each side than the surrounding sections. |
| `compliance_deadline` type not handled | `lib/calendar-helpers.ts` `itemCategoryType()` had no case for `"compliance_deadline"` (used by the Emiratisation item). Fell to `default: "news_update"` → gray color, wrong badge. |

---

## Files inspected

| File | Finding |
|------|---------|
| `app/(public)/calendar/page.tsx` | Imported `MOCK_CALENDAR_ITEMS`, passed to CalendarGrid — never read DB |
| `app/ru/calendar/page.tsx` | Same issue |
| `lib/calendar-mock-data.ts` | Contains 18 fake items: "Schools" May 15, "VAT Q1" May 28, "DMCC Summit", mock Eid June 6–9, mock dead links (`/events/mock-*`, `/calendar/mock-*`) |
| `lib/db/news-events-calendar.ts` | `getPublishedCalendarPages()` correctly reads DB and parses `dates_json` |
| `app/(public)/page.tsx` | Life Setup card: `<Link href="/guides">` — routes to All Guides, not a real Life Setup product |
| `components/FeaturedSlider.tsx` | `px-5` on inner divs, not on section — desktop alignment mismatch vs other sections |
| `lib/calendar-helpers.ts` | No `compliance_deadline` case in `itemCategoryType()` |

---

## DB state at time of audit

| Table | Published records |
|-------|-------------------|
| `calendar_pages` | 2: `may-2026-uae-calendar` (Eid A–D, May 23–31) + `uae-emiratisation-june-30-2026-reminder` (Item A, Jun 30) |
| `news_posts` | 2: Eid news + Emiratisation news |
| `guides` | 17 — unchanged |

**Eid dates in DB (may-2026-uae-calendar):**
- 2026-05-25 – 2026-05-29: Federal Eid Al Adha Holiday (confirmed)
- 2026-05-27: Eid Al Adha Begins (confirmed)
- 2026-05-23 – 2026-05-31: Federal Break Planning Window (expected)
- 2026-05-26 – 2026-05-29: Private Sector Eid Al Adha Holiday (confirmed)

---

## Files modified

| File | Change |
|------|--------|
| `app/(public)/calendar/page.tsx` | Removed `MOCK_CALENDAR_ITEMS` import; added `getPublishedCalendarPages("en")`; flattened `dates` from all calendar pages; removed prototype disclaimer note |
| `app/ru/calendar/page.tsx` | Same — `getPublishedCalendarPages("ru")`; removed prototype disclaimer |
| `app/(public)/page.tsx` | Life Setup card: changed `<Link href="/guides">` to `<div>` (non-clickable); removed hover scale; changed CTA from "Browse →" to "Coming soon"; dimmed CTA text |
| `components/FeaturedSlider.tsx` | Added `px-5` to outer `<section>`; removed `px-5` from header div and slider wrapper div |
| `lib/calendar-helpers.ts` | Added runtime string check for `"compliance_deadline"` → maps to `"government_deadline"` (amber color, "Deadline" badge, "Business" filter) |

---

## Calendar data source — before and after

| State | Source | Items shown |
|-------|--------|-------------|
| Before | `lib/calendar-mock-data.ts` (hardcoded) | 18 fake items: "Schools", "VAT Q1", mock DMCC, mock Eid June 6–9 — all with dead `/mock-*` links |
| After | `lib/db/news-events-calendar.ts` — `getPublishedCalendarPages()` | Only real published DB items — Eid A–D (May) + Emiratisation deadline (June) |

---

## Mock/test data removed from public calendar

All 18 items from `MOCK_CALENDAR_ITEMS` are no longer rendered in the public calendar. Specifically:
- "School Admissions Window: Dubai Private Schools" (May 15) — REMOVED
- "UAE Corporate Tax: Key Clarifications 2026" (May 17) — REMOVED
- "Golden Visa via Property: 2026 Requirements Updated" (May 20) — REMOVED
- "VAT Return: Q1 2026 Filing Deadline" (May 28) — REMOVED
- "Trade License Renewal Reminder, DED Mainland" (May 28) — REMOVED
- "DMCC Business Summit 2026" (May 28) — REMOVED
- Mock Eid Al Adha items on June 6–9 (wrong dates, mock links) — REMOVED
- Dubai Summer Surprises (Jun 15) — REMOVED
- All other mock items — REMOVED

No dead `/events/mock-*`, `/calendar/mock-*`, `/news/mock-*` CTAs are shown to users or crawlers.

---

## Eid A–D visibility result

Eid A–D ARE now visible in the May 2026 calendar. Items from DB:
- May 23–31: Federal Break Planning Window
- May 25–29: Federal Eid Al Adha Holiday (P1 green, confirmed)
- May 26–29: Private Sector Eid Al Adha Holiday (P1 green, confirmed)
- May 27: Eid Al Adha Begins (P1 green, confirmed)

All have `detail_url: "/events/uae-eid-al-adha-2026"` — a real published event page. CTAs render as live internal links.

---

## DGHR/KHDA hold result

DGHR and KHDA calendar items (Items E and F from Eid Al Adha package) were never imported and do not appear in the DB. They are absent from the public calendar. HOLD maintained.

---

## Dubai Life Setup link/page decision

**Decision: Option B applied.** No Dubai Life Setup route exists. The homepage card has been changed:
- Before: `<Link href="/guides">` with "Browse →" CTA
- After: `<div>` (non-clickable, no hover effects) with "Coming soon" CTA
- The card image and label remain visible — the product is shown as planned but not ready

No user is routed to All Guides in place of a non-existent product.

---

## Homepage desktop alignment fix

**Before:** `FeaturedSlider` section had no `px-5`; inner divs had `px-5` + `max-w-2xl mx-auto`. On desktop (>672px), the slider was 40px narrower than surrounding sections and 20px more inset on each side.

**After:** `px-5` moved to the outer `<section>` element. Inner divs use `max-w-2xl mx-auto` only. Now matches the pattern of all other homepage sections: section carries `px-5`, inner div carries `max-w-2xl mx-auto`. Visual result: identical on mobile (both approaches yield same edge margins), corrected on desktop (slider now aligns with surrounding cards and tiles).

---

## TypeScript and build results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS — 86 pages compiled cleanly, 2.4s |

---

## Route QA results

| Route | HTTP | robots |
|-------|------|--------|
| / | 200 | (homepage, no meta robots) |
| /calendar | 200 | noindex, follow (calendar index — unchanged) |
| /ru/calendar | 200 | noindex, follow |
| /news/uae-emiratisation-june-30-2026-deadline | 200 | index, follow |
| /ru/news/uae-emiratisation-june-30-2026-deadline | 200 | index, follow |
| /calendar/uae-emiratisation-june-30-2026-reminder | 200 | index, follow |
| /ru/calendar/uae-emiratisation-june-30-2026-reminder | 200 | index, follow |
| /news/uae-eid-al-adha-2026-federal-holiday-long-break | 200 | index, follow |
| /ru/news/uae-eid-al-adha-2026-federal-holiday-long-break | 200 | index, follow |
| /guides | 200 | — |
| /guides/employment-visa | 200 | — |

---

## SEO/RAG safety

| Check | Result |
|-------|--------|
| No fake calendar items | PASS — all 18 mock items removed; only real DB items shown |
| No unsupported claims | PASS — calendar items from verified official sources |
| No broken CTA links | PASS — all `detail_url` values point to real published pages |
| No English fallback on RU calendar | PASS — `getPublishedCalendarPages("ru")` uses RU gate |
| No noindex regression for published detail pages | PASS — Emiratisation + Eid news/calendar detail routes all `index, follow` |
| No mock/test data exposed to crawlers | PASS — no mock data in RSC payload; type-only import has zero runtime footprint |
| Dubai Life Setup not presented as complete product | PASS — "Coming soon" label, no live route linked |

---

## Git status — Phase 6C-38

**Modified (tracked — pending commit):**
- `CHECKPOINTS.md`
- `NEW_CHAT_TRANSFER.txt`
- `PROJECT_STATE.md`
- `SESSION_LOG.md`
- `app/(public)/calendar/page.tsx` ← calendar DB connection
- `app/(public)/page.tsx` ← Life Setup card fix
- `app/ru/calendar/page.tsx` ← calendar DB connection (RU)
- `components/FeaturedSlider.tsx` ← desktop alignment fix
- `lib/calendar-helpers.ts` ← compliance_deadline handler
- (and prior-session docs files)

**Untracked (pending add):**
- `docs/content-drafts/PHASE_6C38_PUBLIC_SURFACE_STABILIZATION_REPORT.md` (this file)
- `scripts/emiratisation-june30-import.ts`
- Various docs from prior phases

---

## What was not touched

- No DB schema or migrations
- No admin panel
- No AI Inbox
- No production server
- No push, no deploy, no commit
- No new content records
- No Emiratisation production import
- No GTM/GA4/env/secrets
- No existing published guide content
- No other route or component outside the 5 files modified

---

## Production deploy recommendation

**SAFE TO DEPLOY** — after owner confirmation.

The fix is a code-only change (5 files modified). No DB schema change, no migration, no data deletion. The calendar pages now read from the DB — if the DB has the same published records on production (which it does: Eid + Eid calendar imported in Phase 6C-34), production will show real data immediately after deploy.

**Deploy sequence:**
1. Run standard code push to production server
2. `npm run build` on production
3. `pm2 restart guidex-production`
4. Verify `/calendar` shows Eid A–D (May 2026)
5. Verify no mock items visible
6. Verify Life Setup card shows "Coming soon"
7. Verify FeaturedSlider aligns with surrounding sections on desktop

**Note:** Emiratisation records (news + Calendar Item A) are in the LOCAL DB only. They will NOT appear on production calendar until Phase 6C-38 production DB deploy is separately performed.

---

## Final report answers

**Why was the live calendar showing old/test data?**
Both `/calendar` and `/ru/calendar` passed `MOCK_CALENDAR_ITEMS` (a hardcoded 18-item demo array) directly to `CalendarGrid`. The DB reader `getPublishedCalendarPages()` was never called from the calendar index pages. This was a Phase 5E prototype that was never connected to real data.

**Is public calendar now connected to real published data or safely empty?**
Connected to real published DB data. `getPublishedCalendarPages()` is called server-side; dates from all published calendar pages are flattened and passed to `CalendarGrid`. If no records are published, the grid shows an empty state (already built into CalendarGrid).

**Are Eid A–D visible?**
Yes — in the May 2026 view. All 4 Eid items from `may-2026-uae-calendar` render with correct dates (May 23–29), P1 priority, green holiday color, and live CTA links to `/events/uae-eid-al-adha-2026`.

**Are DGHR/KHDA still held?**
Yes. Neither was ever imported. They remain absent from the DB and absent from the public calendar.

**What happened to Dubai Life Setup public link?**
The `<Link href="/guides">` was replaced with a non-clickable `<div>`. The card shows "Coming soon" instead of "Browse →". No user is sent to All Guides.

**Is homepage desktop fixed?**
Yes. `px-5` moved to the `<section>` in FeaturedSlider, matching the pattern of all other homepage sections. The slider now aligns with surrounding sections on both mobile and desktop.

**Are published detail pages still indexable?**
Yes. All 4 published detail routes (EN/RU × news/calendar for both Emiratisation and Eid) return `robots: index, follow`. No regression.

**Is it safe to deploy this fix?**
Yes. TypeScript clean, build clean, 86 pages. All routes 200. No mock data in public surface. No broken links. No DB changes required for code deploy.

---

*Phase 6C-38 complete — 2026-05-20*
