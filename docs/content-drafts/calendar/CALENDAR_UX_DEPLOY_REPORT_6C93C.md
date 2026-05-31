# Calendar UX Deploy Report — Phase 6C-93C

**Phase:** 6C-93C
**Date:** 2026-05-31
**Status:** DEPLOYED

---

## Final status: DEPLOYED ✓

---

## 1. Files committed

| File | Type |
|------|------|
| components/calendar/CalendarGrid.tsx | Code — core UX patch |
| lib/calendar-helpers.ts | Code — color map |
| docs/content-drafts/calendar/CALENDAR_UX_AUDIT_6C93A.md | Doc |
| docs/content-drafts/calendar/CALENDAR_UX_REDESIGN_SPEC_6C93A.md | Doc |
| docs/content-drafts/calendar/CALENDAR_UX_QA_6C93A.md | Doc |
| docs/content-drafts/calendar/CALENDAR_SEO_RAG_CONNECTION_AUDIT_6C93A.md | Doc |
| docs/content-drafts/calendar/CALENDAR_SOURCE_COVERAGE_AUDIT_AUG_DEC_2026.md | Doc |
| docs/content-drafts/calendar/CALENDAR_UX_DEPLOY_READINESS_6C93B.md | Doc |
| docs/content-drafts/PHASE_6C93A_CALENDAR_UX_PDF_EXTRACTION_COVERAGE_REPORT.md | Doc |
| docs/content-drafts/compliance/PDF_MAKE_FORTUNE_2026_EXTRACTION_MATRIX.md | Doc |
| docs/content-drafts/daily-radar/6C93A-calendar-import-candidate-pack.md | Doc |
| PROJECT_STATE.md | Memory |
| SESSION_LOG.md | Memory |
| NEW_CHAT_TRANSFER.txt | Memory |

---

## 2. Commit hash

`8bebafb` — "Fix calendar long-range event rendering and UX colors"

---

## 3. Push status

Pushed to `origin/main`. Server pulled cleanly (Fast-forward `0e1dd87..8bebafb`). 25 files changed (accumulated from 6C-91, 6C-92, 6C-93A/B all pulled together — all docs/code).

---

## 4. Deploy method

1. `git pull origin main` on server — pulled `8bebafb`
2. `pm2 stop guidex-production` — PM2 stopped (critical: before build to prevent CSS hash mismatch)
3. `npm run build` on server (logged to `/tmp/guidex-build-6c93c.log`)
4. `pm2 start ecosystem.config.js` — PM2 started with ecosystem config

---

## 5. Build result

| Metric | Value |
|--------|-------|
| Pages | 88 |
| TypeScript errors | 0 |
| Build exit code | 0 |
| Compile time | 24.5s |
| Static page gen | 3.0s |

---

## 6. PM2 stop/build/start confirmation

| Step | Result |
|------|--------|
| pm2 stop | `[guidex-production](0) ✓` — confirmed stopped |
| npm run build | EXIT=0, 88 pages, 0 errors |
| pm2 start | PID 209175, status: online, 56.0 MB RSS |

---

## 7. Live routes checked — 14/14 HTTP 200

| Route | Status |
|-------|--------|
| / | 200 ✓ |
| /ru | 200 ✓ |
| /calendar/july-2026-dubai-calendar | 200 ✓ |
| /ru/calendar/july-2026-dubai-calendar | 200 ✓ |
| /calendar/august-2026-dubai-calendar | 200 ✓ |
| /ru/calendar/august-2026-dubai-calendar | 200 ✓ |
| /calendar/september-2026-dubai-calendar | 200 ✓ |
| /ru/calendar/september-2026-dubai-calendar | 200 ✓ |
| /calendar?month=2026-07 | 200 ✓ |
| /calendar?month=2026-08 | 200 ✓ |
| /calendar?month=2026-09 | 200 ✓ |
| /ru/calendar?month=2026-07 | 200 ✓ |
| /ru/calendar?month=2026-08 | 200 ✓ |
| /ru/calendar?month=2026-09 | 200 ✓ |

---

## 8. Live QA result

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| July `h-[4px]` old bars absent | 0 | 0 | ✓ |
| August `h-[4px]` old bars absent | 0 | 0 | ✓ |
| September `h-[2px]` subtle bars present | >0 | 6 | ✓ |
| July `#1B2E4B` absent in calendar grid | 0 | 0 | ✓ |
| August `#2D5FA3` new business color live | >0 | 7 | ✓ |
| July DSS still in side panel/agenda | >0 | 17 | ✓ |
| August DSS still in side panel/agenda | >0 | 17 | ✓ |
| No raw JSON field names | 0 | 0 | ✓ |

---

## 9. Known minor notes (not blocking)

1. **DSS chip label truncation** — `short_label_en = "Dubai Summer Surprises 2026"` (28 chars) truncates to "Dubai Sum…" in a ~52px mobile grid cell. Fix: update DB `short_label_en` to `"DSS"` on JUL-03-DSS and AUG-01-DSS in a future import phase. No code change needed.

2. **`#0D9488` (teal/property) not exercised** — No `real_estate_event` items exist in any live calendar month. The color change is correct in code but produces no visible output until property events are added. Not a bug.

3. **Internal `detail_url` recovery** — Only 1 of 31+ live calendar items has an internal Guidex detail_url. All others use external CTAs. This is a documented content strategy gap tracked in `CALENDAR_SEO_RAG_CONNECTION_AUDIT_6C93A.md`. Future phases (GITEX detail page, Dubai Design Week, etc.) will address this.

---

## 10. Confirmed: no unrelated changes deployed

| Action | Status |
|--------|--------|
| DB content write | None |
| New calendar items imported | None |
| Migrations run | None |
| Admin/AI Inbox used | None |
| DSS short_label DB fix | Not done (out of scope) |
| November/December/January content | Not added (out of scope) |

---

*Phase 6C-93C complete. Calendar UX patch is live at guidex-consulting.ae.*
