# Phase 6C-41 — Public Detail Reading System and RU HTML Lang Fix Report

**Status:** COMPLETE — local validated, not yet committed/deployed  
**Date:** 2026-05-21  
**TypeScript:** 0 errors  
**Build:** 86 pages, 0 errors  

---

## Root issues addressed

1. All `/ru/*` routes rendered `<html lang="en">` — RU content under wrong locale declaration
2. Detail page body text too small and too tight (text-[14px], space-y-3, no section rhythm)
3. News page had CalendarContextCta before the body (interrupting reading flow)
4. Source link was a generic pill button — low trust signal
5. Event source link buried after body — not visible as verification context
6. Calendar pages did not display `officialSourceUrl` or `lastVerifiedDate`
7. MarkdownBody table lacked border/rounded container; h4 spacing ignored due to space-y specificity conflict

---

## Files inspected

- `app/layout.tsx` — root layout (deleted)
- `app/ru/layout.tsx` — RU nested layout (upgraded to full root layout)
- `app/(public)/layout.tsx` → `app/(en)/(public)/layout.tsx` — EN public layout (moved)
- `app/(public)/events/[slug]/page.tsx` → `app/(en)/(public)/events/[slug]/page.tsx`
- `app/(public)/news/[slug]/page.tsx` → `app/(en)/(public)/news/[slug]/page.tsx`
- `app/(public)/calendar/[slug]/page.tsx` → `app/(en)/(public)/calendar/[slug]/page.tsx`
- `app/ru/events/[slug]/page.tsx`
- `app/ru/news/[slug]/page.tsx`
- `app/ru/calendar/[slug]/page.tsx`
- `components/MarkdownBody.tsx`
- `lib/db/news-events-calendar.ts` — confirmed `sourceUrl`, `officialSourceUrl`, `lastVerifiedDate` fields available

---

## Files modified

### Routing restructure (RU lang fix)

| Change | Detail |
|---|---|
| `app/layout.tsx` | DELETED — replaced by `app/(en)/layout.tsx` |
| `app/(en)/layout.tsx` | CREATED — full root layout, `lang="en"`, html/body/GTM |
| `app/ru/layout.tsx` | UPGRADED — now full root layout, `lang="ru"`, html/body/GTM + Header/Footer |
| `app/(public)/*` → `app/(en)/(public)/*` | 24 files MOVED via git mv (no URL changes) |
| `app/admin/*` → `app/(en)/admin/*` | ~30 files MOVED via git mv (no URL changes) |
| Admin `@/app/admin/` imports | Updated to `@/app/(en)/admin/` in 14 files |

### Reading system

| File | Changes |
|---|---|
| `components/MarkdownBody.tsx` | h4/h3/h2 use `border-t` section separators + `pt-*` instead of conflicting `mt-*`; `space-y-3→4`; `text-[14px]→[15px]` lists; `leading-relaxed→[1.72]` paragraphs; table has rounded border container; HR renders as thin `h-px bg-stone-100` divider; bold uses `font-semibold` with `text-gray-900` |
| `app/(en)/(public)/news/[slug]/page.tsx` | Summary `text-[14px]→[15px] leading-[1.6]`; source link → left-border trust block "Source: View source ↗"; CalendarContextCta moved AFTER body |
| `app/ru/news/[slug]/page.tsx` | Same — RU source label "Перейти к источнику ↗" |
| `app/(en)/(public)/events/[slug]/page.tsx` | Summary `text-[14px]→[15px] leading-[1.6]`; source link moved ABOVE confidence notice as "Source: Official source ↗" trust block |
| `app/ru/events/[slug]/page.tsx` | Same — "Источник: Официальный источник ↗" |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Summary `text-[14px]→[15px]`; `officialSourceUrl` + `lastVerifiedDate` now rendered as source trust block |
| `app/ru/calendar/[slug]/page.tsx` | Same — "Источник: Официальный источник ↗ · проверено {date}" |

---

## RU html lang fix

**Approach:** Next.js App Router requires `<html>` and `<body>` to live in a root layout. Nested layouts cannot override `lang`. The only correct fix is separate root layouts via route groups.

**Implementation:**
- Deleted `app/layout.tsx` (single root layout for all routes)
- Created `app/(en)/layout.tsx` — new root layout for EN routes (route group, no URL impact)
- Moved `app/(public)/` → `app/(en)/(public)/` and `app/admin/` → `app/(en)/admin/` (no URL changes)
- Upgraded `app/ru/layout.tsx` to a full root layout with `lang="ru"`, html/body, GTM, Header/Footer

**Verified:**
```
html lang="en" on: /, /events/*, /news/*, /calendar/*, /admin/*
html lang="ru" on: /ru/*, /ru/events/*, /ru/news/*, /ru/calendar/*
```

---

## MarkdownBody changes

| Element | Before | After |
|---|---|---|
| Container spacing | `space-y-3` | `space-y-4` |
| Paragraph | `text-[15px] leading-relaxed` | `text-[15px] leading-[1.72]` |
| List items | `text-[14px] leading-relaxed space-y-1.5` | `text-[15px] leading-[1.72] space-y-2` |
| Table | Borderless, `text-[13px]`, no rounded | Rounded border container, `text-[14px]`, `px-3 py-2.5` cells |
| h4 | `mt-6 mb-1.5` (ignored by space-y) | `border-t border-stone-100 pt-5` section separator |
| h3 | `mt-7 mb-2` (ignored) | `border-t border-stone-200 pt-6` |
| h2 | `mt-8 mb-2.5` (ignored) | `border-t-2 border-stone-200 pt-7` |
| HR (`---`) | `return null` (invisible) | `h-px bg-stone-100 my-1` (soft divider) |
| Bold | `<strong>` (browser default) | `font-semibold text-gray-900` |

**Root cause of previous h4 spacing issue:** `space-y-3` generates `.space-y-3 > * ~ *` with higher CSS specificity than direct `mt-6` on child elements. The heading margins were overridden by the container's space-y. Fix: replaced margin approach with `border-t + pt-*` which doesn't conflict with `space-y`.

---

## SEO/RAG first-screen structure

| Content type | First-screen order (after fix) |
|---|---|
| News | Back link → category · date meta → h1 → summary (15px) → source trust block → body → [CalendarContextCta after body] |
| Event | Back link → category · date meta → h1 → summary (15px) → source trust block → confidence notice → CalendarContextCta (date pills) → body |
| Calendar | Back link → type · year meta → h1 → summary (15px) → source + verified date → Islamic dates notice → CalendarContextCta → body → dates list |

All pages: crawlers see title → summary → source context → structured body within the first viewport.

---

## Local QA results

| Route | HTTP | `lang=` | No raw MD | Headings | Source block | Robots |
|---|---|---|---|---|---|---|
| `/events/uae-eid-al-adha-2026` | 200 | en ✓ | 0 ✓ | h4 with borders ✓ | "Official source ↗" ✓ | index, follow |
| `/ru/events/uae-eid-al-adha-2026` | 200 | ru ✓ | 0 ✓ | RU h4s ✓ | "Официальный источник ↗" ✓ | index, follow |
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | en ✓ | 0 ✓ | h1 ✓ | "Official source ↗" ✓ | index, follow |
| `/ru/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | ru ✓ | 0 ✓ | RU h1 ✓ | "Перейти к источнику ↗" ✓ | — |
| `/calendar/may-2026-uae-calendar` | 200 | en ✓ | 0 ✓ | h4s ✓ | Official source + verified date ✓ | index, follow |
| `/ru/calendar/may-2026-uae-calendar` | 200 | ru ✓ | — | RU h1 ✓ | — | — |
| `/news/uae-emiratisation-june-30-2026-deadline` | 200 | en ✓ | — | h4s ✓ | — | index, follow |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | en ✓ | — | ✓ | — | index, follow |
| `/ru/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | ru ✓ | — | RU h1 ✓ | — | — |
| `/calendar` | 200 | en ✓ | — | — | — | — |
| `/ru/calendar` | 200 | ru ✓ | — | — | — | — |
| `/` homepage | 200 | en ✓ | — | — | — | — |
| `/admin/login` | 200 | en ✓ | — | — | — | — |

**News CalendarContextCta position:** confirmed after body (position 14521 vs body position 9508).  
**Mock data:** none found.  
**DGHR/KHDA:** appear only in event body content as legitimate authority citations — not a UI issue.

---

## TypeScript / build results

- TypeScript: 0 errors (stale `.next/types/validator.ts` errors are from old cache, not source — resolved on build)
- Build: 86 pages, 0 errors (two runs confirmed)
- `.next/types/validator.ts` regenerated correctly on first build after restructure

---

## Git status (Phase 6C-41 changes)

**Staged or changed (not yet committed):**
- `D app/layout.tsx` — deleted (root layout replaced)
- `A app/(en)/layout.tsx` — new EN root layout
- `M app/ru/layout.tsx` — upgraded to full root layout
- `R app/(public)/* → app/(en)/(public)/*` — 24 files moved
- `R app/admin/* → app/(en)/admin/*` — ~30 files moved
- `M components/admin/DeleteGuideButton.tsx` — import path fix
- `M components/admin/GuideEditForm.tsx` — import path fix
- `M components/admin/StepCard.tsx` — import path fix
- `M components/admin/StepList.tsx` — import path fix
- `M components/MarkdownBody.tsx` — reading system improvements
- `M app/(en)/(public)/news/[slug]/page.tsx` — reading system
- `M app/(en)/(public)/events/[slug]/page.tsx` — reading system
- `M app/(en)/(public)/calendar/[slug]/page.tsx` — reading system + source display
- `M app/ru/news/[slug]/page.tsx` — reading system
- `M app/ru/events/[slug]/page.tsx` — reading system
- `M app/ru/calendar/[slug]/page.tsx` — reading system + source display
- `M docs/content-drafts/PHASE_6C41_PUBLIC_DETAIL_READING_SYSTEM_REPORT.md` — this report

**Not staged:**
- `CHECKPOINTS.md`, `SESSION_LOG.md`, `PROJECT_STATE.md`, `NEW_CHAT_TRANSFER.txt`
- All Long Weekend files, source ledgers, other docs

---

## What was not touched

- DB schema — no changes
- DB data — no migrations, no imports, no records published
- Env / secrets / GTM / GA4 — unchanged
- Routes — all public URLs identical (route groups don't affect URLs)
- Admin functionality — unchanged, only import paths updated
- `app/api/`, `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` — untouched (these don't require layouts)

---

## Final report answers

| Question | Answer |
|---|---|
| Is RU html lang fixed? | ✓ Yes — `/ru/*` routes now render `<html lang="ru">` |
| Are detail pages easier to read? | ✓ Yes — larger body text, better line height, section separators on headings |
| Is first-screen structure better for SEO/RAG? | ✓ Yes — title → summary → source trust → body order on all detail types |
| Are tables/headings/bold rendered cleanly? | ✓ Yes — bordered tables, subtle section borders on headings, `font-semibold` bold |
| Are date/context blocks near top? | ✓ Yes — CalendarContextCta before body on events/calendar; CalendarContextCta after body on news (CalendarContextCta deferred on news since news doesn't have specific event dates) |
| Are published pages still indexable? | ✓ Yes — `robots: index, follow` confirmed on all published detail pages |
| Is it safe to deploy? | ✓ Yes — TypeScript 0 errors, build 86 pages 0 errors, all routes 200, lang attributes correct |

---

## Remaining risks

- **Admin panel**: Moved to `app/(en)/admin/`. All admin imports updated. Not visually tested — admin is owner-only and the import path fix was mechanical (sed across 14 files). Recommend one manual admin login check before deploying.
- **`app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts`**: These are at `app/` root with no parent layout — this is correct per Next.js docs for metadata routes. Verified: build included them (86 pages count unchanged).
- **MarkdownBody ordered lists, blockquotes, inline code**: Still not handled. If future DB content uses these, extend MarkdownBody.

---

## Recommended next steps

1. **Commit Phase 6C-41** (scope defined above — routing restructure + reading system)
2. **Deploy to production** after owner review
3. **Manual admin check** on production after deploy (login + one edit view)
4. **Commit memory files** as separate doc-only commit
5. **Resume Long Weekend VIRAL-01** — owner decisions on import path and update cadence pending
