# Phase 6C-UI-02 — Premium Visual Refresh: Final Report

**Date:** 2026-06-17  
**Status:** Complete — awaiting owner approval for commit and deploy  
**Mode:** Local only. No deploy, no commit, no push, no DB, no admin, no AI Inbox, no schema changes.

---

## Summary

Visual polish pass reducing heavy dark overlay opacity across the EN and RU homepages, the FeaturedSlider carousel, the DetailHero component (used on calendar and event detail pages), and correcting the StickyRouteCta behavior on calendar routes. All changes are Tailwind CSS / inline-style opacity values only. Zero content, schema, or factual changes.

---

## Files changed

| File | Change |
|---|---|
| `components/FeaturedSlider.tsx` | Custom gradient mid-stop: `rgba(10,22,40,0.65)` → `rgba(10,22,40,0.52)`. Default gradient bottom: `from-navy/95` → `from-navy/80` |
| `app/(en)/(public)/page.tsx` | All 6 GRAD_* constants: `0.97` → `0.82`. Calendar hero card: `from-navy/97 via-navy/72 to-navy/20` → `from-navy/82 via-navy/60 to-navy/15`. Life Setup hero card: `rgba(75,40,5,0.97)` → `rgba(75,40,5,0.82)`, `rgba(105,60,12,0.62)` → `rgba(105,60,12,0.52)` |
| `app/ru/page.tsx` | All 6 GRAD_* constants: `0.97` → `0.82`. Same hero card changes as EN |
| `components/detail/DetailHero.tsx` | `from-black/85 via-black/45 to-black/10` → `from-black/72 via-black/38 to-black/05` |
| `components/StickyRouteCta.tsx` | Replaced `HIDDEN_ON.includes(pathname)` with `isHiddenRoute()` helper; hides on `/calendar`, `/calendar/*`, `/ru/calendar`, `/ru/calendar/*` |

---

## Files created

| File | Purpose |
|---|---|
| `docs/content-drafts/ui/6c-ui-02-premium-visual-refresh-audit.md` | Step 1 audit — component inventory, gradient values, change plan |
| `docs/content-drafts/ui/6c-ui-02-sticky-route-cta-decision.md` | Step 3 decision doc — rationale for hiding StickyRouteCta on calendar routes |
| `docs/content-drafts/ui/6c-ui-02-screenshot-qa.js` | Playwright screenshot script used for automated visual QA |
| `docs/content-drafts/ui/6c-ui-02-premium-visual-refresh-report.md` | This file |
| `docs/content-drafts/ui/6c-ui-02-screenshots/` | 32 screenshots (16 viewport + 16 full-page) |

---

## Build result

`npm run build` — **88/88 pages generated, zero TypeScript errors, zero compilation errors.**

Routes confirmed static: `/` (revalidate 1h), `/ru` (revalidate 1h), all guide, calendar, event, news, and hub pages. All admin routes still dynamic (correct separation).

---

## Screenshot QA folder

`docs/content-drafts/ui/6c-ui-02-screenshots/` — **not committed to git** (16 MB total, over 10 MB repo threshold). The QA script (`6c-ui-02-screenshot-qa.js`) and this report are committed. Screenshots can be regenerated locally at any time: `node docs/content-drafts/ui/6c-ui-02-screenshot-qa.js`

Viewports: desktop (1280×900) and mobile (390×844 iPhone 14 Pro, 2× devicePixelRatio).

---

## Visual QA results

### 1. Homepage carousel — ✅ Pass

- Carousel image (Dubai skyline, June 2026) clearly visible through lighter gradient
- Title and meta text readable at both viewports
- No horizontal overflow on mobile
- No layout shift

### 2. Homepage hero cards — ✅ Pass

- **Dubai Life Calendar card**: JLT/skyline photo texture visibly shows through the lighter navy gradient. "Holidays, events and reminders" and "Open →" button readable
- **Dubai Life Setup card**: JLT towers amber-tone image visible. "First 30 days, home and family" and "Explore →" readable
- Same result confirmed on RU page (Ru labels "Календарь ОАЭ", "Переезд и первые шаги")

### 3. Calendar pages — ✅ Pass

- `/calendar` (desktop + mobile): No StickyRouteCta bar. Calendar grid, filter chips, and legend fully unobstructed. "This Month in the UAE" agenda visible on mobile above the grid (Phase 6C-UI-01 order intact)
- `/calendar/october-2026-dubai-calendar` (desktop + mobile): No StickyRouteCta. DetailHero shows skyline image texture through lighter gradient. Title readable
- `/ru/calendar` and `/ru/calendar/october-2026-dubai-calendar`: Same — no StickyRouteCta; RU title and body text readable

### 4. DetailHero — ✅ Pass

- October calendar desktop: Skyline image texture clearly visible in hero section; title unambiguously readable over lightened overlay
- RU October calendar mobile: "Дубай, октябрь 2026: выставки, сроки и важные даты" readable; hero image visible; no over-darkening

### 5. StickyRouteCta rules — ✅ All pass

| Route | Expected | Result |
|---|---|---|
| `/calendar` | Absent | ✅ Absent |
| `/ru/calendar` | Absent | ✅ Absent |
| `/calendar/october-2026-dubai-calendar` | Absent | ✅ Absent |
| `/ru/calendar/october-2026-dubai-calendar` | Absent | ✅ Absent |
| `/guides/employment-visa` (after scroll) | Present | ✅ Present — bar reads "My Route / Answer 2–3 quick questions" |
| `/find-my-visa` | Absent | ✅ Absent |

### 6. Content accuracy regression — ✅ No regression

Phase 6C-UI-02 made zero content changes (CSS opacity only).

**Local dev DB note (pre-existing, not a regression):** The local `data/guides.db` was never patched with the AED 50M fix (Phase 6C-CONTENT-01-FIX was applied only to production). The local October calendar shows AED 150M+ — this is a pre-existing local DB discrepancy introduced before Phase 6C-UI-02.

**Production DB confirmed via SSH:** `label_en = "AED 50M+"`, `label_ru = "от 50 млн дирхамов"` — correct and unchanged.

Oct 30 e-invoicing deadline: present and unchanged in production.

---

## StickyRouteCta decision

**Decision: Hide on all calendar routes** (`/calendar`, `/calendar/*`, `/ru/calendar`, `/ru/calendar/*`).

Rationale: Calendar is an interactive planning product, not a passive reading surface. On mobile, the sticky bar physically covers the bottommost agenda row and the CalendarMiniPreview "Open" button. Calendar users are already in a date-specific task flow — the "Find My Route" nudge targets a different intent. Full rationale: `docs/content-drafts/ui/6c-ui-02-sticky-route-cta-decision.md`.

Guide articles, news/event detail pages, life-setup pages, and the homepage continue to show StickyRouteCta.

---

## Confirmations

- No `git commit` or `git push` run
- No deploy script or PM2 command run
- No admin or AI Inbox route used or touched
- No schema file touched
- No DB row modified (neither local nor production)
- No factual content changed (no dates, fees, deadlines, venues, performer names)
- No EN/RU content field changed
- No sitemap or JSON-LD facts changed
- No GITEX/F1/source content touched
- `next.config.ts`, `proxy.ts`, and all admin/lib routes unchanged

---

## Owner approval needed

**Commit and deploy require explicit owner approval.**

Once owner confirms local result is acceptable, the recommended next step is:

```
git add components/FeaturedSlider.tsx components/detail/DetailHero.tsx \
        components/StickyRouteCta.tsx \
        app/(en)/(public)/page.tsx app/ru/page.tsx \
        docs/content-drafts/ui/
git commit -m "feat: premium visual refresh — lighter overlays, calendar sticky cta fix (6C-UI-02)"
```

Then deploy via `scripts/deploy-zero-downtime.sh` on the production server.

---

## Next recommended phase

Owner review of local visual result first. After commit/deploy approval:
- **Phase 6C-UI-03** (if needed): Further visual polish on sub-hub pages, event/news detail pages, or guide pages
- Or resume content phases (additional calendar pages, guide updates)
