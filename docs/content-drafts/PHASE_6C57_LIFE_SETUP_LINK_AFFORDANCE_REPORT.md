# Phase 6C-57 — Life Setup Link Affordance Polish Report

**Date:** 2026-05-24
**Phase:** 6C-57
**Scope:** Link styling only — `/life-setup` and `/ru/life-setup`

---

## Files Modified

| File | Status |
|---|---|
| `app/(en)/(public)/life-setup/page.tsx` | Modified |
| `app/ru/life-setup/page.tsx` | Modified |

No other files touched. No DB. No admin. No content changes.

---

## Problem: Links That Blended Into Plain Text

Two link classes were visually indistinguishable from surrounding text:

**1. Timeline task links** (items with guide `href`):
- Before: `text-[13px] text-navy hover:underline leading-snug`
- Problem: navy is the same color as the stage heading. No underline at rest → looks like bold text, not a link.

**2. Route card guide links** (list items inside route cards):
- Before: `text-[13px] text-navy hover:underline`
- Same problem: navy text without underline blends with description text.

---

## Fix Applied — 4 Edits (2 per file, symmetric)

**After — timeline task links:**
```
text-[13px] text-brass font-medium underline underline-offset-2
decoration-brass/30 hover:decoration-brass leading-snug transition-colors
```

**After — route card guide links:**
```
text-[13px] text-brass font-medium underline underline-offset-2
decoration-brass/30 hover:decoration-brass transition-colors
```

### What this achieves

- `text-brass` — distinct color (warm gold), matches existing brass `→` prefix in task list
- `font-medium` — slightly heavier than surrounding `text-gray-700` text
- `underline` — underline present at rest, not just on hover
- `underline-offset-2` — clear gap between text baseline and underline
- `decoration-brass/30` — underline is brass at 30% opacity (subtle, not aggressive)
- `hover:decoration-brass` — underline brightens to full brass on hover
- `transition-colors` — smooth hover transition

### What was NOT changed

| Element | Style | Reason |
|---|---|---|
| Timeline stage CTAs ("Ask us →") | `text-navy font-semibold` | Already `font-semibold` + `→` suffix — clearly action-styled |
| Timeline internal CTA ("Open Dubai Life Calendar →") | `text-navy font-semibold` | Same — CTA position at card bottom is sufficient signal |
| Route card CTA buttons ("Ask about…") | `bg-navy text-white rounded-lg` | Already rendered as clear navy pill buttons |
| Bottom CTA WhatsApp link | `text-brass font-semibold` on dark navy bg | Already clearly distinct |
| Hero CTAs | White pill + ghost border button | Already clearly distinct |

---

## Link Type Hierarchy After Fix

| Type | Style | Example |
|---|---|---|
| Guide/page link (task list) | brass underlined text, brass `→` prefix | `→ [brass text, underlined]` |
| Guide/page link (route card) | brass underlined text, `→ ` inline | `→ [brass text, underlined]` |
| Stage CTA (WhatsApp) | navy bold text, `→` suffix | navy, `font-semibold` |
| Stage CTA (internal nav) | navy bold text, `→` suffix | navy, `font-semibold` |
| Route card CTA button | white text, navy pill | `bg-navy px-3 py-1.5 rounded-lg` |
| Bottom WA link | brass on dark bg | `text-brass font-semibold` |

---

## RU Link Labels Checked

| EN | RU | Natural? |
|---|---|---|
| Task links (guide hrefs) | same brass treatment applied | ✓ |
| Route card links: "Виза для ребёнка" | "→ Виза для ребёнка" (brass underlined) | ✓ |
| Route card links: "Гайд: разрешение DET" | brass underlined | ✓ |
| Stage CTAs: "Написать о вашем визовом маршруте →" | navy font-semibold — unchanged | ✓ |
| Bottom CTA: "Написать в Guidex →" | text-brass on dark bg — unchanged | ✓ |

No awkward phrases. No English words in RU link text.

---

## QA Results

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | 0 errors ✓ |
| Production build (`npm run build`) | 88 pages, 0 errors ✓ |
| `/life-setup` | HTTP 200 ✓ |
| `/ru/life-setup` | HTTP 200 ✓ |
| `/` | HTTP 200 ✓ |
| `/ru` | HTTP 200 ✓ |
| `decoration-brass` class in EN HTML | Present ✓ |
| `decoration-brass` class in RU HTML | Present ✓ |
| Old `text-navy hover:underline` pattern in EN | Gone (0 matches) ✓ |
| Old `text-navy hover:underline` pattern in RU | Gone (0 matches) ✓ |
| Hero image on EN and RU | Present ✓ |
| RU: no EN fallback text | Clean ✓ |
| RU: no "Landlord" | Clean ✓ |
| EN homepage link to `/life-setup` | Present ✓ |
| RU homepage link to `/ru/life-setup` | Present ✓ |
| No default blue browser links | None — brass replaces navy ✓ |
| No horizontal overflow risk | No — link text is inline, no new elements added ✓ |
| Mobile tap targets | Unchanged container — brass underlined text is easy to tap ✓ |

---

## Visual Before / After Summary

**Timeline task list — before:**
`[brass →]  [navy text, no underline — looks like a bullet label]`

**Timeline task list — after:**
`[brass →]  [brass text, underlined — clearly a guide link]`

**Route card links — before:**
`→ [navy text, no underline — blends with description]`

**Route card links — after:**
`→ [brass text, underlined — clearly a guide link]`

---

## Git Status

**Modified, not staged:**
- `app/(en)/(public)/life-setup/page.tsx`
- `app/ru/life-setup/page.tsx`

**No other code files changed.**

---

## Safe to Commit / Deploy

**Yes.**

- TypeScript: 0 errors
- Build: 88 pages, 0 errors
- All 4 routes: 200
- Changes: 4 className edits across 2 files
- No content changes, no DB, no admin, no schema
- Old problematic style confirmed gone
- New brass style confirmed present in rendered HTML
