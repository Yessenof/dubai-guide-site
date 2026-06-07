# Calendar Detail Page Link Rendering — Production Deploy Report
## Phase 6C-98B | Date: 2026-06-08

---

## Files committed

| File | Change |
|------|--------|
| `lib/db/news-events-calendar.ts` | Added `detail_url?: string` to `CalendarDateItem` interface |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | Render `View event guide →` link when `detail_url` present |
| `app/ru/calendar/[slug]/page.tsx` | Render `Открыть гид →` link with `/ru` prefix when `detail_url` present |
| `PROJECT_STATE.md` | Updated |
| `SESSION_LOG.md` | Updated |
| `docs/content-drafts/calendar/CALENDAR_DETAIL_LINK_RENDERING_AUDIT_6C98A.md` | NEW — audit doc |
| `docs/content-drafts/calendar/CALENDAR_DETAIL_LINK_RENDERING_QA_6C98A.md` | NEW — local QA report |

---

## Commit hash

`bde7dba` — "Render calendar detail event guide links"

Pushed to `Yessenof/dubai-guide-site` on `main`.

---

## Deploy command used

```bash
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```

Zero-downtime script only. Old PM2 stop/build/start flow NOT used.

---

## Build result

- Build time: 48s
- Static pages: 88 / 88
- TypeScript errors: 0
- PM2 status: online (145.8 MB, 0 restarts)
- Port 3000 accepting connections: ~1s after reload
- Health check: HTTP 200

---

## Live routes checked (14/14 × 200)

| Route | HTTP |
|-------|------|
| / | 200 |
| /ru | 200 |
| /calendar/december-2026-uae-calendar | 200 |
| /ru/calendar/december-2026-uae-calendar | 200 |
| /calendar/november-2026-dubai-calendar | 200 |
| /ru/calendar/november-2026-dubai-calendar | 200 |
| /calendar/september-2026-dubai-calendar | 200 |
| /ru/calendar/september-2026-dubai-calendar | 200 |
| /calendar?month=2026-12 | 200 |
| /ru/calendar?month=2026-12 | 200 |
| /events/gitex-global-2026 | 200 |
| /ru/events/gitex-global-2026 | 200 |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 200 |

---

## QA result

### December EN SSG (`/calendar/december-2026-uae-calendar`)

| Check | Result |
|-------|--------|
| "View event guide →" present (8 = 4 items × 2 for RSC payload) | PASS |
| GITEX EN href `/events/gitex-global-2026` present | PASS |
| F1 EN href `/events/formula-1-abu-dhabi-grand-prix-2026` present (3 items) | PASS |
| No RU text ("Открыть гид") leaked | PASS |
| No raw JSON / dates_json in HTML | PASS |

### December RU SSG (`/ru/calendar/december-2026-uae-calendar`)

| Check | Result |
|-------|--------|
| "Открыть гид →" present (8 = 4 items × 2) | PASS |
| `/ru/events/gitex-global-2026` href present | PASS |
| `/ru/events/formula-1-abu-dhabi-grand-prix-2026` hrefs present (3 items) | PASS |
| No EN text ("View event guide") leaked | PASS |

### November EN SSG (regression — links expected)

| Check | Result |
|-------|--------|
| "View event guide" present (2 items: Design Week + Big 5) | PASS |
| `/events/dubai-design-week-2026` reference present | PASS |
| `/events/big-5-global-dubai-2026` reference present | PASS |

### November RU SSG

| Check | Result |
|-------|--------|
| "Открыть гид" present (2 items) | PASS |

### September EN+RU SSG (clean — no detail_url items)

| Check | Result |
|-------|--------|
| EN: 0 "View event guide" occurrences | PASS |
| RU: 0 "Открыть гид" occurrences | PASS |
| No `detail_url` string in raw HTML | PASS |

### Dynamic listing (`/calendar?month=2026-12`)

| Check | Result |
|-------|--------|
| GITEX reference present | PASS |
| F1 reference present | PASS |

---

## No-ops confirmed

- No DB write
- No migrations
- No admin/AI Inbox used
- No new calendar items added or modified
- No new events imported
- No unrelated app code changed

---

## Final status

**DEPLOYED**

- Commit: `bde7dba`
- Build: 88 pages, 0 TypeScript errors
- All 14 live QA routes: 200
- December SSG calendar detail page now shows clickable "View event guide →" links to GITEX and F1 event pages
- November SSG calendar shows links for Design Week and Big 5 (pre-existing data — correctly rendered)
- September SSG renders cleanly with no links
- Dynamic `/calendar?month=2026-12` unaffected
- PM2: online, 145.8 MB
- No DB write, no migrations, no admin, no new content import
