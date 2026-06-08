# UAE Calendar Internal Linking — Production Deploy Report
## Phase 6C-98D | Date: 2026-06-08

---

## Files committed

| File | Change |
|------|--------|
| `lib/db/news-events-calendar.ts` | Import `guides`; add `calendarDetailSlug?` + `relatedGuideTitle?` to `EventDetail`; secondary lookups in `getEventBySlug()` |
| `components/calendar/CalendarMiniPreview.tsx` | Add optional `detailSlug?` prop; when set, href = `calendarBase/detailSlug` |
| `app/(en)/(public)/events/[slug]/page.tsx` | Pass `detailSlug`; show `relatedGuideTitle` |
| `app/ru/events/[slug]/page.tsx` | Same; `/ru/` prefix applied correctly |
| `PROJECT_STATE.md` | Updated |
| `SESSION_LOG.md` | Updated |
| `docs/content-drafts/calendar/UAE_CALENDAR_INTERNAL_LINKING_AUDIT_6C98C.md` | NEW — audit doc |
| `docs/content-drafts/calendar/UAE_CALENDAR_INTERNAL_LINKING_QA_6C98C.md` | NEW — local QA report |

---

## Commit hash

`8726038` — "Improve UAE Calendar internal linking"

Pushed to `Yessenof/dubai-guide-site` on `main`.

---

## Deploy command used

```bash
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```

Zero-downtime script only. Old PM2 stop/build/start flow NOT used.

---

## Build result

- Build time: 49s
- Static pages: 88 / 88
- TypeScript errors: 0
- PM2 status: online (138.2 MB, uptime 4m)
- Health check: HTTP 200

---

## Live routes checked (14/14 × 200)

| Route | HTTP |
|-------|------|
| / | 200 |
| /ru | 200 |
| /events/gitex-global-2026 | 200 |
| /ru/events/gitex-global-2026 | 200 |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 200 |
| /events/dubai-design-week-2026 | 200 |
| /ru/events/dubai-design-week-2026 | 200 |
| /events/big-5-global-dubai-2026 | 200 |
| /ru/events/big-5-global-dubai-2026 | 200 |
| /calendar/december-2026-uae-calendar | 200 |
| /ru/calendar/december-2026-uae-calendar | 200 |
| /calendar/november-2026-dubai-calendar | 200 |
| /ru/calendar/november-2026-dubai-calendar | 200 |

---

## QA result

### GITEX EN

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/calendar/december-2026-uae-calendar` | PASS |
| No old `?month=` href | PASS |
| Guide title "How to Set Up a Mainland Company in Dubai" | PASS |
| No slug-as-text "mainland company setup dubai" | PASS |
| Expo City Dubai present (9 mentions) | PASS |

### GITEX RU

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/ru/calendar/december-2026-uae-calendar` | PASS |
| RU guide title "Открыть mainland компанию в Дубае..." | PASS |
| No slug-as-text | PASS |

### F1 EN

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/calendar/december-2026-uae-calendar` | PASS |
| No "Related guide" box | PASS |
| Abu Dhabi mentions (19) | PASS |
| Yas Marina mentions (6) | PASS |

### F1 RU

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/ru/calendar/december-2026-uae-calendar` | PASS |
| No "Связанное руководство" box | PASS |

### Big 5 EN

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/calendar/november-2026-dubai-calendar` | PASS |
| Guide title "How to Set Up a Mainland Company in Dubai" | PASS |

### Dubai Design Week EN

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/calendar/november-2026-dubai-calendar` | PASS |
| No "Related guide" box | PASS |

### Dubai Design Week RU

| Check | Result |
|-------|--------|
| CalendarMiniPreview → `/ru/calendar/november-2026-dubai-calendar` | PASS |
| No EN text leak | PASS |

### December SSG calendar (regression)

| Check | Result |
|-------|--------|
| "View event guide →" (8 count) | PASS |
| GITEX link | PASS |
| F1 link | PASS |

### November SSG calendar (regression)

| Check | Result |
|-------|--------|
| "View event guide" links for Design Week + Big 5 | PASS |
| Design Week reference | PASS |

---

## Issues

None.

---

## No-ops confirmed

- No DB write
- No migrations
- No admin/AI Inbox used
- No calendar items imported or modified
- No new event pages added
- No unrelated app code changed

---

## Final status

**DEPLOYED**

- Commit: `8726038`
- Build: 88 pages, 0 TypeScript errors
- All 14 live QA routes: 200
- All event pages now link to SSG calendar detail pages via CalendarMiniPreview
- Related guide labels show real guide titles
- RU event pages use `/ru/calendar/...` hrefs correctly
- Calendar detail pages retain event guide links (6C-98B, unaffected)
- PM2: online, 138.2 MB
- No DB write, no migrations, no admin, no content import
