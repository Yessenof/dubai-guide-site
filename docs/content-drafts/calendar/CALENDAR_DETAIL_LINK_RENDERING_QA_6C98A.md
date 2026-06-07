# Calendar Detail Page — Internal Link Rendering QA
## Phase 6C-98A | Date: 2026-06-08

---

## Scope

Code-only fix: SSG monthly calendar detail pages now render `detail_url` from dates_json items as
clickable internal links. No DB write, no production deploy, no migration.

---

## Files changed

| File | Change |
|------|--------|
| `lib/db/news-events-calendar.ts` | Added `detail_url?: string` to `CalendarDateItem` interface |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Render `<Link href={item.detail_url}>View event guide →</Link>` when present |
| `app/ru/calendar/[slug]/page.tsx` | Render `<Link href={/ru${item.detail_url}}>Открыть гид →</Link>` when present |

### TypeScript change

`lib/db/news-events-calendar.ts` line ~53:

```typescript
// BEFORE
  archive_action?:  string;
}

// AFTER
  archive_action?:  string;
  detail_url?:      string;
}
```

### EN template change

`app/(en)/(public)/calendar/[slug]/page.tsx` — inside dates list `<li>` pills row:

```tsx
{item.detail_url && (
  <Link
    href={item.detail_url}
    className="text-[10px] font-semibold text-brass border border-brass/30 px-1.5 py-0.5 rounded hover:bg-brass/5 transition-colors"
  >
    View event guide →
  </Link>
)}
```

### RU template change

`app/ru/calendar/[slug]/page.tsx` — inside dates list `<li>` pills row:

```tsx
{item.detail_url && (
  <Link
    href={`/ru${item.detail_url}`}
    className="text-[10px] font-semibold text-brass border border-brass/30 px-1.5 py-0.5 rounded hover:bg-brass/5 transition-colors"
  >
    Открыть гид →
  </Link>
)}
```

---

## Route status (8/8 × 200)

| Route | HTTP | Notes |
|-------|------|-------|
| /calendar/december-2026-uae-calendar | 200 | GITEX + F1 links present |
| /ru/calendar/december-2026-uae-calendar | 200 | RU links present (/ru/events/...) |
| /calendar/november-2026-dubai-calendar | 200 | 2 links (Design Week, Big 5) — correct |
| /ru/calendar/november-2026-dubai-calendar | 200 | 2 RU links — correct |
| /calendar/september-2026-dubai-calendar | 200 | 0 links — no detail_url items |
| /ru/calendar/september-2026-dubai-calendar | 200 | 0 links — no detail_url items |
| /calendar?month=2026-12 | 200 | Dynamic listing unaffected |
| /ru/calendar?month=2026-12 | 200 | Dynamic listing unaffected |

---

## Content checks

### December EN SSG (`/calendar/december-2026-uae-calendar`)

| Check | Result |
|-------|--------|
| "View event guide →" present (4 items × 2 for RSC payload = 8) | PASS |
| `/events/gitex-global-2026` links present | PASS |
| `/events/formula-1-abu-dhabi-grand-prix-2026` links present | PASS |
| No RU text ("Открыть гид") leaked | PASS |

### December RU SSG (`/ru/calendar/december-2026-uae-calendar`)

| Check | Result |
|-------|--------|
| "Открыть гид →" present | PASS |
| `/ru/events/gitex-global-2026` href present | PASS |
| `/ru/events/formula-1-abu-dhabi-grand-prix-2026` href present | PASS |
| No EN text ("View event guide") leaked | PASS |

### November EN/RU SSG (regression check)

| Check | Result |
|-------|--------|
| EN "View event guide" present (2 items: Design Week, Big 5) | PASS — expected |
| RU "Открыть гид" present (2 items) | PASS — expected |
| Both event pages return 200 | PASS |
| No phantom/broken links | PASS |

### September EN/RU SSG (no-link regression)

| Check | Result |
|-------|--------|
| EN: 0 "View event guide" occurrences | PASS |
| RU: 0 "Открыть гид" occurrences | PASS |
| Items render cleanly without empty element | PASS |

### Dynamic listing (no regression)

| Check | Result |
|-------|--------|
| `/calendar?month=2026-12` renders GITEX link | PASS |
| `/calendar?month=2026-12` renders F1 link | PASS |
| `/ru/calendar?month=2026-12` renders /ru/events/gitex | PASS |

---

## Build check

| Check | Result |
|-------|--------|
| TypeScript errors | 0 |
| Static pages generated | 88 / 88 |
| Build time | ~323ms static generation |

---

## Locale link correctness

EN SSG: `href={item.detail_url}` → `/events/gitex-global-2026` (no prefix)
RU SSG: `href={\`/ru${item.detail_url}\`}` → `/ru/events/gitex-global-2026` (ru prefix)

Matches the same pattern used in `CalendarGrid.tsx` (lines 859–862).

---

## Items without detail_url

Items without `detail_url` render with no empty element or visual gap.
The pills row `{item.detail_url && <Link ...>}` evaluates to `false`/`null` and produces no DOM output.
September calendar (no detail_url items) confirms this cleanly.

---

## Recommendation

**APPROVE_LINK_RENDERING_DEPLOY**

- 8/8 routes return 200
- December SSG now shows clickable event guide links for GITEX and F1
- November SSG correctly shows links for Design Week and Big 5 (pre-existing data)
- September SSG renders cleanly with no links (no detail_url items)
- Dynamic listing unaffected
- Build: 88 pages, 0 TypeScript errors
- No DB writes, no migrations, no production changes
- Ready for zero-downtime deploy when owner approves
