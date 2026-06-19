# Phase 6C-CALENDAR-EXPANSION-03 — Final Report

**Date:** 2026-06-19
**Phase:** 6C-CALENDAR-EXPANSION-03 — Approved First-Batch Import + DP World Tour JSON-LD + Deploy
**Status:** COMPLETE — all 7 DB writes live, code deployed, QA passed.

---

## Summary

Applied 7 approved DB writes to local dev and production DBs. Added DP World Tour to VENUE_BY_SLUG + ORGANIZER_BY_SLUG in both EN/RU event page templates. Built, committed, pushed, and deployed zero-downtime. All 10 QA routes 200. All content checks passed.

**Commit:** `e8e863d feat: expand November December calendar items (6C-CALENDAR-EXPANSION-03)`

---

## DB writes applied

| # | Table | Row | Action | ID |
|---|---|---|---|---|
| 1 | `events` | `dp-world-tour-championship-2026` (new) | INSERT | ITEM 1 |
| 2 | `calendar_pages` | `november-2026-dubai-calendar` | Append | NOV-DPWT |
| 3 | `calendar_pages` | `november-2026-dubai-calendar` | Append | NOV-DFTS |
| 4 | `calendar_pages` | `november-2026-dubai-calendar` | Update | NOV-R1 |
| 5 | `calendar_pages` | `october-2026-dubai-calendar` | Append | OCT-DFC |
| 6 | `calendar_pages` | `december-2026-uae-calendar` | Append | DEC-CTAX |
| 7 | `calendar_pages` | `december-2026-uae-calendar` | Append | DEC-EMIR |

**Calendar item counts after import:**
- November: 14 → 16 items
- October: 13 → 14 items
- December: 7 → 9 items

---

## Code changes

| File | Change |
|---|---|
| `app/(en)/(public)/events/[slug]/page.tsx` | +5 lines: dp-world-tour-championship-2026 in VENUE_BY_SLUG + ORGANIZER_BY_SLUG |
| `app/ru/events/[slug]/page.tsx` | +5 lines: same in RU template |

---

## DB backup

- Server: `/var/www/guidex/data/guides.db.pre-calendar-expansion-03-20260619-163622`
- Local: `data/guides.db.pre-calendar-expansion-03-20260619-163626`
- Production pulled: `backups/production-db/guides.db.pre-calendar-expansion-03-20260619-163639`

---

## Deploy summary

| Metric | Value |
|---|---|
| Deploy method | `scripts/deploy-zero-downtime.sh` |
| Build time | 50s |
| PM2 reload | ~1s graceful |
| PM2 memory | 148.2 MB |
| Pages built | 88 |
| TypeScript errors | 0 |
| Health check | HTTP 200 ✓ |
| Commit | e8e863d |

---

## Live QA results

### HTTP 200 checks (10/10 passed)

| Route | Status |
|---|---|
| `/events/dp-world-tour-championship-2026` | 200 ✓ |
| `/ru/events/dp-world-tour-championship-2026` | 200 ✓ |
| `/calendar/november-2026-dubai-calendar` | 200 ✓ |
| `/ru/calendar/november-2026-dubai-calendar` | 200 ✓ |
| `/calendar/october-2026-dubai-calendar` | 200 ✓ |
| `/ru/calendar/october-2026-dubai-calendar` | 200 ✓ |
| `/calendar/december-2026-uae-calendar` | 200 ✓ |
| `/ru/calendar/december-2026-uae-calendar` | 200 ✓ |
| `/` | 200 ✓ |
| `/sitemap.xml` | 200 ✓ |

### Content checks (all passed)

- DP World Tour event JSON-LD: `@type: Event`, startDate: 2026-11-12, endDate: 2026-11-15, venue: Jumeirah Golf Estates (Earth Course), organizer: DP World Tour, eventAttendanceMode: OfflineEventAttendanceMode ✓
- EN source domain: `europeantour.com` ✓
- RU event page: "Чемпионат DP World Tour" in title ✓, JSON-LD venue + organizer present ✓
- November calendar: DP World Tour Championship ✓, Dubai FinTech Summit ✓, DFC 30x30 in NOV-R1 label ✓, "31 October to 29 November" ✓
- October calendar: "Dubai Fitness Challenge 2026 opens" on 31 October ✓
- December calendar: Corporate Tax ✓, Emiratisation ✓, "March 2026" year-end specified ✓, "administrative penalties" (no AED figure) ✓
- No "108,000" or "all companies" found in December calendar ✓

---

## Items held (not imported in this phase)

| Item | Status | Recheck |
|---|---|---|
| Global Village Season 31 | DRAFT-ONLY — opening date not yet announced | Sep 2026 on globalvillage.ae |
| Dubai Shopping Festival 2026–2027 | DRAFT-ONLY — dates blocked (no DFRE announcement) | Sep 2026 on dubaidet.gov.ae |
| ILT20 Season 5 | BLOCKED — ilt20.com is a parked domain | When official site appears |
| Frieze Abu Dhabi 2026 | RECHECK-LATER | Sep 2026 on frieze.com/abudhabiart.ae |
| NYE Dubai 2026 | RECHECK-LATER | Nov 2026 |

---

## What was NOT done

- Admin panel: not used
- AI Inbox: not used
- Schema changes: none
- Sitemap changes: none
- Unrelated DB rows: not touched
- Rollback: not needed
