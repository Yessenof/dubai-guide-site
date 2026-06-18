# Phase 6C-UI-02 — StickyRouteCta: Calendar Route Decision

**Date:** 2026-06-17

---

## Decision

**Hide StickyRouteCta on all calendar routes** (`/calendar`, `/calendar/*`, `/ru/calendar`, `/ru/calendar/*`).

---

## Options considered

| Option | Description | Decision |
|---|---|---|
| A — Keep visible everywhere | No change — CTA appears on calendar hub and all detail pages | Rejected |
| B — Make visually lighter on calendar | Reduce CTA height or opacity on calendar routes only | Rejected — adds complexity without solving the UX conflict |
| **C — Hide on calendar routes** | `isHiddenRoute()` returns true for all `/calendar` and `/ru/calendar` paths | **Selected** |

---

## Rationale

**User intent diverges on calendar pages.** StickyRouteCta is designed for users who haven't started a visa/route journey and need to be nudged toward "Find My Route." Calendar users are already engaged in a specific planning task — they're checking dates, viewing events, reading deadlines. The CTA's call-to-action ("Answer 2–3 quick questions") doesn't match their current mental model.

**Mobile occlusion.** On mobile (the primary device), the sticky bar slides up from the bottom. This physically covers:
- The bottommost visible agenda row(s) in CalendarGrid
- The "Open →" month button in CalendarMiniPreview on detail pages
- The bottom padding of the page's WhatsApp CTA block

**Calendar is interactive, not passive.** Unlike a guide article that scrolls top-to-bottom and benefits from a bottom-anchored action, the calendar grid requires bottom-area taps. Covering that area degrades the product.

**Where it stays:** All guide pages, news/event detail pages, life-setup pages, and the homepage continue to show StickyRouteCta. These are all passive reading surfaces where the CTA adds value without blocking interaction.

---

## Implementation

`components/StickyRouteCta.tsx` — replaced `HIDDEN_ON.includes(pathname)` with `isHiddenRoute(pathname)` helper that checks exact paths for find-my-visa and prefix paths for calendar routes:

```ts
function isHiddenRoute(pathname: string): boolean {
  if (pathname === "/find-my-visa" || pathname === "/ru/find-my-visa") return true;
  if (pathname === "/calendar" || pathname.startsWith("/calendar/")) return true;
  if (pathname === "/ru/calendar" || pathname.startsWith("/ru/calendar/")) return true;
  return false;
}
```
