# High-Value Event Detail Pages — Local Import QA Report
## Phase 6C-97E | Date: 2026-06-07

---

## Local import script

`scripts/import-high-value-event-pages-local-6c97e.ts`

Run: `npx tsx scripts/import-high-value-event-pages-local-6c97e.ts`

---

## Local DB backup

`data/guides.db.backup-pre-6c97e-2026-06-07-11-41-33`

(Backup confirmed non-zero before any write. Full rollback possible.)

---

## Events inserted/updated

| Slug | Action | DB ID | Status after | Notes |
|------|--------|-------|-------------|-------|
| gitex-global-2026 | INSERTED | c6d5ca4f-8b97-4216-8df5-ea96c2e4e458 | published | Warning: en_summary >2 sentences (non-blocking) |
| formula-1-abu-dhabi-grand-prix-2026 | INSERTED | 2eaeaf43-c70d-453b-9cb8-c07b4b37d74f | published | Warning: en_summary >2 sentences (non-blocking) |

**Note on category fix:** Initial run used `category: "event"` for F1 which is not in the allowed list. Fixed to `"festival"` before final successful run. Orphan draft (id: d79f5905) was deleted. Final script uses `"festival"` for F1.

---

## Calendar detail_url rows updated

| Item ID | Calendar page | detail_url set to |
|---------|--------------|------------------|
| DEC-04-GITEX | december-2026-uae-calendar | /events/gitex-global-2026 |
| DEC-03-F1 | december-2026-uae-calendar | /events/formula-1-abu-dhabi-grand-prix-2026 |
| DEC-NEW-01 | december-2026-uae-calendar | /events/formula-1-abu-dhabi-grand-prix-2026 |
| DEC-R1 | december-2026-uae-calendar | /events/formula-1-abu-dhabi-grand-prix-2026 |

Calendar page republished after update. All 4 detail_url values verified in post-import check.

---

## Route QA result

All 8 routes checked against local dev server (http://localhost:3000):

| Route | Status | Content verified |
|-------|--------|-----------------|
| /events/gitex-global-2026 | 200 | PASS |
| /ru/events/gitex-global-2026 | 200 | PASS |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200 | PASS |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 200 | PASS |
| /calendar?month=2026-12 | 200 | PASS (shows detail links) |
| /ru/calendar?month=2026-12 | 200 | PASS |
| /calendar/december-2026-uae-calendar | 200 | SSG page (detail links need rebuild to appear) |
| /ru/calendar/december-2026-uae-calendar | 200 | SSG page (detail links need rebuild to appear) |

### Content checks

**GITEX EN (/events/gitex-global-2026):**
- Quick answer: PASS
- Expo City Dubai venue: PASS
- 7-11 December dates: PASS
- 6,800+ companies: PASS
- 200,000+ visitors: PASS
- Source note (gitex.com): PASS
- December calendar backlink: PASS
- No October date claim: PASS

**GITEX RU (/ru/events/gitex-global-2026):**
- Коротко (RU quick answer): PASS
- Expo City Dubai in Russian context: PASS
- 7-11 декабря: PASS
- 6 800+ компаний: PASS
- RU calendar link: PASS
- No EN-only body: PASS

**F1 EN (/events/formula-1-abu-dhabi-grand-prix-2026):**
- Quick answer: PASS
- Yas Marina Circuit: PASS
- Abu Dhabi labelling: PASS
- Not called Dubai GP: PASS
- 3-6 December dates: PASS
- Race day 6 December: PASS
- Lewis Capaldi + Zara Larsson (Dec 3): PASS
- Imagine Dragons (Dec 5): PASS
- Dec 4/6 "Not yet announced": PASS
- Source note (abudhabigp.com): PASS
- December calendar backlink: PASS

**F1 RU (/ru/events/formula-1-abu-dhabi-grand-prix-2026):**
- Коротко (RU quick answer): PASS
- Абу-Даби labelling: PASS
- Not called Дубай GP: PASS
- Yas Marina Circuit: PASS
- Льюис Капальди: PASS
- Zara Larsson (Latin): PASS
- Imagine Dragons: PASS
- Ещё не объявлен (unannounced Dec 4/6): PASS
- RU calendar link: PASS
- No EN-only body: PASS

**December calendar (/calendar?month=2026-12, dynamic listing):**
- GITEX detail link (/events/gitex-global-2026): PASS
- F1 detail link (/events/formula-1-abu-dhabi-grand-prix-2026): PASS

---

## Build result

```
✓ Compiled successfully in 2.4s
✓ TypeScript: no errors
✓ Generating static pages using 7 workers (88/88)
```

Page count: 88 (unchanged from pre-import builds).

**Why 88 and not 92:** The `/events/[slug]` route uses `generateStaticParams()` that returns `[]` by design. Event pages are server-rendered on demand in production (not pre-built as static HTML). This is the established pattern for this project — the same pattern used by DDW, Big5, Eid Al Adha, and the E-invoicing event pages. New events become live immediately when published, without requiring a full rebuild.

**No TypeScript errors. Build passed.**

---

## SSG note on calendar detail pages

`/calendar/[slug]` routes use `generateStaticParams()` that DOES pre-render individual pages. The `/calendar/december-2026-uae-calendar` page will show the new `detail_url` links after a production deploy (which triggers a build). In the dynamic listing (`/calendar?month=2026-12`), the links are visible immediately.

---

## Issues found

| Issue | Severity | Resolution |
|-------|----------|-----------|
| F1 category `"event"` not in allowed list | Blocking (fixed before QA) | Changed to `"festival"`. Orphan draft deleted. |
| `en_summary` validator warning (both events) | Non-blocking warning | Validator prefers 1-2 sentences; summaries are 3-4. Acceptable for event detail pages with rich content. |

---

## Production readiness recommendation

**APPROVE_WITH_NOTES**

Both event pages are content-complete, route-verified, and build-clean. The two notes to carry into the production script:
1. F1 category must be `"festival"` (not `"event"`) — already fixed in local script
2. The GITEX `en_summary` and F1 `en_summary` warnings are non-blocking and acceptable

---

## Rollback instructions (local)

```bash
sqlite3 data/guides.db \
  "DELETE FROM events WHERE slug IN ('gitex-global-2026','formula-1-abu-dhabi-grand-prix-2026');"
cp data/guides.db.backup-pre-6c97e-2026-06-07-11-41-33 data/guides.db
```
