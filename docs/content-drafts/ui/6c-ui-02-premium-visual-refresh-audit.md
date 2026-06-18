# Phase 6C-UI-02 — Premium Visual Refresh: Audit

**Date:** 2026-06-17 | **Status:** Step 1 complete — ready for implementation

---

## 1. Files audited

| File | Role | Visual issues found |
|---|---|---|
| `components/FeaturedSlider.tsx` | Homepage carousel | Heavy gradients — see §2 |
| `app/(en)/(public)/page.tsx` | EN homepage | Heavy GRAD constants + hero card overlays — see §3 |
| `app/ru/page.tsx` | RU homepage | Identical GRAD constants at 0.97 — see §4 |
| `components/detail/DetailHero.tsx` | Calendar/event hero images | Overlay too heavy — see §5 |
| `components/StickyRouteCta.tsx` | Mobile sticky CTA | Not hidden on calendar routes — see §6 |
| `components/calendar/CalendarGrid.tsx` | Interactive calendar grid | **Clean** — no overlay issues |
| `components/calendar/CalendarBriefSection.tsx` | Date brief expandables | **Clean** — `border border-stone-200 rounded-xl bg-white` |
| `components/calendar/CalendarContextCta.tsx` | Calendar cross-link block | **Clean** — `bg-stone-50/30 border border-stone-200` |
| `components/calendar/SaveCalendarCta.tsx` | Add-to-homescreen strip | **Clean** — `border border-stone-200 rounded-xl` |
| `app/(en)/(public)/calendar/page.tsx` | Calendar hub page | **Clean** — no image overlays; WhatsApp `bg-navy` block is intentional |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Monthly calendar detail | Uses `DetailHero` — fixed via §5; date list cards are clean |

---

## 2. FeaturedSlider.tsx — gradient issues

**File:** `components/FeaturedSlider.tsx` lines 121–130

Two gradient paths, both too heavy:

| Variant | Current | Problem |
|---|---|---|
| Custom (`gradientFrom` provided) | `linear-gradient(to top, ${gradientFrom} 0%, rgba(10,22,40,0.65) 55%, rgba(10,22,40,0.08) 100%)` | `gradientFrom` values are 0.97; mid-stop at 0.65 is heavy |
| Default (no `gradientFrom`) | `bg-gradient-to-t from-navy/95 via-navy/55 to-navy/10` | Bottom at 95% opacity — images nearly invisible |

**Fix:** 
- Custom gradient mid-stop: `rgba(10,22,40,0.65)` → `rgba(10,22,40,0.52)`
- Default gradient bottom: `from-navy/95` → `from-navy/80`
- GRAD constants in page.tsx supply the bottom value (0.97) — fixed there (§3)

---

## 3. app/(en)/(public)/page.tsx — gradient issues

**Lines 102–107** — all GRAD_* constants at 0.97 (nearly opaque bottom):

```ts
const GRAD_CALENDAR    = "rgba(4,47,46,0.97)";   // → 0.82
const GRAD_COMPLIANCE  = "rgba(55,28,0,0.97)";   // → 0.82
const GRAD_EVENT       = "rgba(10,22,40,0.97)";   // → 0.82
const GRAD_NEWS        = "rgba(18,18,40,0.97)";   // → 0.82
const GRAD_GUIDE_VISA  = "rgba(10,22,40,0.97)";   // → 0.82
const GRAD_GUIDE_BIZ   = "rgba(20,15,5,0.97)";    // → 0.82
```

**Line 398** — Dubai Life Calendar primary hero card:
```tsx
<div className="absolute inset-0 bg-gradient-to-t from-navy/97 via-navy/72 to-navy/20" />
// → from-navy/82 via-navy/60 to-navy/15
```

**Line 434** — Dubai Life Setup primary hero card:
```tsx
style={{ background: "linear-gradient(to top, rgba(75,40,5,0.97) 0%, rgba(105,60,12,0.62) 50%, rgba(165,105,38,0.10) 100%)" }}
// → rgba(75,40,5,0.82) 0%, rgba(105,60,12,0.52) 50%  (top stop unchanged)
```

---

## 4. app/ru/page.tsx — same GRAD constants

**Lines 86–91** — exact mirror of the EN GRAD_* constants at 0.97. Same fix: 0.97 → 0.82.

---

## 5. components/detail/DetailHero.tsx — overlay

**Line 31:**
```tsx
<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
// → from-black/72 via-black/38 to-black/05
```

This component is used on both calendar detail pages and event detail pages. The fix improves both.

---

## 6. StickyRouteCta.tsx — calendar pages

**Line 9:** `const HIDDEN_ON = ["/find-my-visa", "/ru/find-my-visa"]`

Currently visible on `/calendar`, `/calendar/[slug]`, `/ru/calendar`, `/ru/calendar/[slug]`.

**Problem:** On mobile, the sticky bar slides up from the bottom, covering the bottommost interactive elements of CalendarGrid (last visible agenda row / month picker "Open" button).

**Decision:** Hide on all calendar routes. Calendar is an interactive planning tool, not a passive reading surface. StickyRouteCta targets unengaged users who haven't started a visa/route journey — calendar users are already in a different, task-focused intent.

**Fix:** Replace exact-match `HIDDEN_ON.includes()` with a path-aware check that covers `/calendar`, `/calendar/*`, `/ru/calendar`, `/ru/calendar/*`.

---

## 7. CalendarGrid — no changes needed

CalendarGrid uses `bg-stone-100` gap lines, `bg-white` day cells, `bg-navy` for today/selected dots, and clean `border border-stone-100 rounded-xl bg-white` agenda cards. No heavy overlays, no image backgrounds. Existing visual pattern is already light and editorial. No changes.

---

## 8. Change summary

| Component | Change | Impact |
|---|---|---|
| `FeaturedSlider.tsx` | Lighten custom mid-stop (0.65→0.52) + default bottom (navy/95→navy/80) | Carousel slides show more image depth |
| `page.tsx` GRAD constants | 0.97→0.82 across all 6 constants | Carousel cards lighter at bottom |
| `page.tsx` hero cards | Calendar: navy/97→navy/82; Life Setup: 0.97→0.82 + 0.62→0.52 | Primary pair cards lighter |
| `ru/page.tsx` GRAD constants | 0.97→0.82 (mirror of EN) | RU carousel cards lighter |
| `DetailHero.tsx` | from-black/85→from-black/72; via-black/45→via-black/38; to-black/10→to-black/05 | Calendar + event hero images show more texture |
| `StickyRouteCta.tsx` | Hide on /calendar/* and /ru/calendar/* routes | Removes mobile bottom occlusion on interactive calendar |
