# Phase 6C-33 Summary
# News, Events, Calendar — Indexing Policy Fix

**Date:** 2026-05-20
**Phase:** 6C-33
**Type:** Code-only fix — no content creation, no imports, no DB schema changes, no publishing, no deploy, no commit.

---

## Problem Resolved

All 6 public detail route files (`[slug]/page.tsx`) hardcoded `robots: { index: false, follow: true }` in `generateMetadata`. This was the P0 blocker documented in Phase 6C-32: every published news, event, and calendar page was invisible to Google and AI crawlers regardless of content status.

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/db/indexing.ts` | Indexing helper — `newsRobots()`, `eventRobots()`, `calendarRobots()` |
| `docs/content-drafts/PHASE_6C33_INDEXING_POLICY_FIX_SUMMARY.md` | This file |

## Files Modified

| File | Change |
|------|--------|
| `app/(public)/news/[slug]/page.tsx` | Import `newsRobots`; replace hardcoded `robots` with `newsRobots(post)` |
| `app/(public)/events/[slug]/page.tsx` | Import `eventRobots`; replace hardcoded `robots` with `eventRobots(event)` |
| `app/(public)/calendar/[slug]/page.tsx` | Import `calendarRobots`; replace hardcoded `robots` with `calendarRobots(page)` |
| `app/ru/news/[slug]/page.tsx` | Import `newsRobots`; replace hardcoded `robots` with `newsRobots(post)` |
| `app/ru/events/[slug]/page.tsx` | Import `eventRobots`; replace hardcoded `robots` with `eventRobots(event)` |
| `app/ru/calendar/[slug]/page.tsx` | Import `calendarRobots`; replace hardcoded `robots` with `calendarRobots(page)` |

---

## Implementation: `lib/db/indexing.ts`

```typescript
import type {
  NewsPostDetail,
  EventDetail,
  CalendarPageDetail,
} from "@/lib/db/news-events-calendar";

type RobotsDirective = { index: boolean; follow: boolean };

const INDEX: RobotsDirective = { index: true, follow: true };
const NOINDEX: RobotsDirective = { index: false, follow: true };

/** News: respects DB noindex flag. Returns NOINDEX if noindex=1. */
export function newsRobots(post: NewsPostDetail): RobotsDirective {
  return post.noindex === 1 ? NOINDEX : INDEX;
}

/** Event: no noindex field in DB. Reader gates on status=published. Safe to index. */
export function eventRobots(_event: EventDetail): RobotsDirective {
  return INDEX;
}

/** Calendar: no noindex field in DB. Reader gates on status=published. Safe to index. */
export function calendarRobots(_page: CalendarPageDetail): RobotsDirective {
  return INDEX;
}
```

---

## Indexing Logic

### Why each helper works

**News (`newsRobots`):**
- `news_posts` table has a `noindex` column (confirmed via `PRAGMA table_info`)
- `getNewsPostBySlug` returns `noindex: row.noindex` in the result object
- `noindex=0` (default) → `{ index: true, follow: true }`
- `noindex=1` → `{ index: false, follow: true }`
- If slug is draft/archived: reader returns `null` → `generateMetadata` returns `{}` → component calls `notFound()` → 404 HTTP status → search engines do not index (safe without additional noindex tag)

**Event (`eventRobots`):**
- `events` table has NO `noindex` column (confirmed via `PRAGMA table_info`)
- `getEventBySlug` gates on `status=published` — draft/archived slugs return null → 404
- Safe to always return `{ index: true, follow: true }` for published records

**Calendar (`calendarRobots`):**
- `calendar_pages` table has NO `noindex` column (confirmed via `PRAGMA table_info`)
- `getCalendarPageBySlug` gates on `status=published` — draft/archived slugs return null → 404
- Safe to always return `{ index: true, follow: true }` for published records

### RU locale safety

The RU reader functions (`getNewsPostBySlug(slug, "ru")`, `getEventBySlug(slug, "ru")`, `getCalendarPageBySlug(slug, "ru")`) gate on:
- `status = published`
- `ru_published = 1`
- `ru_title.trim() !== ""`
- `ru_body.trim() !== ""`

If any gate fails → reader returns `null` → `generateMetadata` returns `{}` → `notFound()` → 404. No EN fallback ever. No thin RU pages.

---

## QA Results

### DB state of Eid records (confirmed)

| Record | slug | status | noindex | ru_published |
|--------|------|--------|---------|--------------|
| News | `uae-eid-al-adha-2026-federal-holiday-long-break` | published | 0 | 1 |
| Event | `uae-eid-al-adha-2026` | published | — (no column) | 1 |
| Calendar | `may-2026-uae-calendar` | published | — (no column) | 1 |

### Expected robots output (all 6 pages)

| Route | Expected robots |
|-------|----------------|
| EN News | `{ index: true, follow: true }` ✅ |
| RU News | `{ index: true, follow: true }` ✅ |
| EN Event | `{ index: true, follow: true }` ✅ |
| RU Event | `{ index: true, follow: true }` ✅ |
| EN Calendar | `{ index: true, follow: true }` ✅ |
| RU Calendar | `{ index: true, follow: true }` ✅ |

### Edge cases verified

| Case | Result |
|------|--------|
| News with `noindex=1` | `{ index: false, follow: true }` ✅ |
| Draft slug (any type) | reader → null → `{}` → notFound() → 404 ✅ |
| RU with empty `ru_title` or `ru_body` | reader → null → `{}` → notFound() → 404 ✅ |
| No EN fallback on RU | Enforced by reader (no field patching) ✅ |

### TypeScript check

```
npx tsc --noEmit → 0 errors
```

### Build

```
npm run build → ✓ Compiled successfully in 2.6s
All 86 static pages generated without error
```

### Grep check — no hardcoded noindex in [slug] routes

```
grep -r "index: false" app/(public)/news/[slug] ... → CLEAN
```

Note: Listing pages (`/news/page.tsx`, `/events/page.tsx`, `/calendar/page.tsx` and RU equivalents) retain `robots: { index: false }` — these are collection pages, not in scope for this phase.

---

## What Changed for SEO/RAG

**Before this fix:** All 6 detail route types were unconditionally noindex. Published Eid content (news + event + calendar) was invisible to Google and AI crawlers despite being published.

**After this fix:**
- `<meta name="robots" content="index, follow">` will appear on all published EN and RU detail pages where the DB record is published and (for news) `noindex=0`
- Eid Al Adha 2026 news, event, and calendar pages are now indexable on deploy
- All future published news, events, and calendar pages will be indexed by default
- Draft/archived pages remain safe: reader returns null → 404

---

## Out of Scope (not touched in this phase)

- Listing pages (`/news`, `/events`, `/calendar` and RU equivalents) — intentionally noindex pending list page design
- `noindex_after` date-based expiry — field does not exist in current DB schema; not implemented
- Admin, AI Inbox, DB schema, migrations — untouched
- GTM, GA4, env, secrets — untouched
- Content records — read only for QA; no writes

---

## Next Phases

This fix unblocks deployment of Eid Al Adha 2026 content (news + event + calendar). The P0 blocker from Phase 6C-32 is resolved.

Recommended immediate next step: **Deploy Eid content to production** (pending owner approval). Once deployed, Google and AI crawlers can discover and index all three Eid pages.

Subsequent phases per Phase 6C-32 plan:
- **6C-34:** Emiratisation and Corporate Tax compliance content sprint
- **6C-35:** UAE Long Weekend Guide 2026–2027 (VIRAL-01)
- **6C-36:** Dubai Life Setup Hub Phase 1 (M01–M03)
- **6C-37:** Events import sprint (F1 Abu Dhabi, GITEX)
- **6C-38:** Property guide sprint (Ejari, RERA, DLD)

---

## Validation

### No content created: ✅
No new articles, events, guides, or calendar drafts created.

### No DB schema changes: ✅
No migrations, no new columns, no table alterations.

### No DB writes: ✅
No admin actions, no imports, no publishing actions.

### No deploy/push/commit: ✅
No git operations. No deployment actions.

### No admin/AI Inbox: ✅
Untouched.

### Minimum code change: ✅
1 new file (23 lines), 6 route files each changed by 2 lines (import + robots call replacement).

---

*Phase 6C-33 complete — 2026-05-20.*
