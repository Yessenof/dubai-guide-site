# Phase 6C-CALENDAR-UNIVERSE-BATCH-01C-JULY-LIVE-EVENTS-2026 — Implementation Report

**Phase:** 6C-CALENDAR-UNIVERSE-BATCH-01C-JULY-LIVE-EVENTS-2026
**Date:** 2026-07-18
**Status:** COMPLETE — 4 items inserted, build verified (92 pages, 0 TS errors), dev QA EN+RU passed

---

## 1. Objective

Add 4 missing July 2026 live events to the `july-2026-dubai-calendar` datesJson — identified in Phase 6C-CALENDAR-UNIVERSE-AUDIT-01 as highest-urgency missing items. Events on 18 July are happening TODAY (Dubai time); events on 25-26 July are 7-8 days away.

---

## 2. Scope

- `calendar_pages` table, slug `july-2026-dubai-calendar`
- 4 new items appended to datesJson: JUL-NEW-04, JUL-NEW-05, JUL-NEW-06, JUL-NEW-07
- Six Calendar Universe audit docs updated (master inventory, backlog, gap analysis, source ledger, SEO cluster map, audit report)
- Implementation report (this file)
- No new guide pages. No `events` table inserts. No schema changes.

---

## 3. Date verification

Current date at implementation: **Saturday, 18 July 2026, 00:31 Dubai time (UTC+4).**

- Jul 18 events (JUL-NEW-04, JUL-NEW-05): happening TODAY — doors open 18:00–19:00, shows start 20:30
- Jul 25 (JUL-NEW-06): 7 days away
- Jul 26 (JUL-NEW-07): 8 days away

---

## 4. Research summary — all 4 candidates

### JUL-05 → JUL-NEW-04: Dystinct & Issam Najjar

| Field | Value |
|-------|-------|
| Event name | Beat The Heat DXB Season 5 ft Dystinct & Issam Najjar |
| Date | Saturday, 18 July 2026 |
| Venue | Hall 8, Dubai World Trade Centre |
| Time | Doors 18:00; show 20:30 |
| Tickets | AED 105+ |
| Confidence | confirmed |
| Primary source | Visit Dubai (T1 official Dubai Calendar) |
| Ticketing source | Platinumlist ID 106642 |
| Artists | Dystinct: Belgian-Moroccan rapper ("Ghazali", "Tek Tek"); Issam Najjar: Jordanian-Palestinian singer ("Hadal Ahbek") |

### JUL-06 → JUL-NEW-05: Michael Lives Forever

| Field | Value |
|-------|-------|
| Event name | Michael Lives Forever |
| Date | Saturday, 18 July 2026 |
| Venue | Coca-Cola Arena, City Walk, Dubai |
| Time | 20:30 |
| Tickets | AED 125 – AED 695 |
| Confidence | confirmed |
| Primary source | Coca-Cola Arena official (T1) + Visit Dubai (T1) |
| Ticketing source | Platinumlist ID 106634 |
| Nature | Michael Jackson tribute show — performer is Rodrigo Teaser. NOT Michael Jackson performing. Clearly identified as tribute in label_en, brief_en, brief_ru ("трибьют"). |
| Organiser | AJ Entertainment; supported by Dubai Calendar |

### JUL-07 → JUL-NEW-06: Talal Sam & Sultan Al Murshed — DATE CONFLICT RESOLVED

| Field | Value |
|-------|-------|
| Event name | Beat The Heat DXB Season 5 ft Talal Sam & Sultan Al Murshed |
| Date | Saturday, 25 July 2026 |
| Venue | Hall 8, Dubai World Trade Centre |
| Time | Doors 18:00; show 20:30 |
| Tickets | AED 105+ |
| Confidence | confirmed |
| Primary source | Visit Dubai (T1 official) + Beat The Heat official press release series schedule (S18) |
| Ticketing source | Platinumlist ID 106643 |

**Date conflict resolution:**
- Platinumlist ID 106643 page shows "Friday, August 21, 2026"
- Visit Dubai, few.ae, mid-east.info (press release), and the full Beat The Heat S5 schedule all show Saturday, 25 July 2026
- The Beat The Heat Season 5 series runs SATURDAYS: Jul 11 (Sat), Jul 18 (Sat), Jul 25 (Sat), Aug 1 (Sat), Aug 8 (Sat), Aug 15 (Sat), Aug 22 (Sat)
- July 25 = Saturday ✓. August 21 = Friday ✗ (contradicts the weekly Saturday pattern AND conflicts with the Aug 22 Sat concert)
- **Decision: Case B** — July 25 confirmed. Platinumlist ID 106643 has a data error.

### JUL-08 → JUL-NEW-07: Indie Soulfest

| Field | Value |
|-------|-------|
| Event name | Indie Soulfest with Bismil and Indian Ocean |
| Date | Sunday, 26 July 2026 |
| Venue | Coca-Cola Arena, City Walk, Dubai |
| Time | Doors 19:00; show 20:00 (until ~23:30) |
| Tickets | AED 99 – AED 2,000 |
| Confidence | confirmed |
| Primary source | Coca-Cola Arena official (T1) + Khaleej Times |
| Ticketing source | Platinumlist ID 106641 |
| Context | Part of Dubai Summer Surprises 2026. Draws on mehfil/baithak culture. |

---

## 5. DB records — all 4 new items

### JUL-NEW-04

| Field | Value |
|-------|-------|
| id | JUL-NEW-04 |
| date | 2026-07-18 |
| confidence | confirmed |
| source_status | confirmed |
| type | trade_show (project convention for concerts) |
| priority | 2 |
| emirate | Dubai |
| lifecycle | event_fixed |
| noindex_after | 2026-07-19 |
| archive_action | remove |
| label_en | Beat The Heat DXB S5: Dystinct & Issam Najjar at DWTC Hall 8 (18 July) |
| short_label_en | Dystinct & Issam Najjar |
| cta_label_en | Tickets from AED 105 |
| source_label_en | Visit Dubai · Platinumlist |

### JUL-NEW-05

| Field | Value |
|-------|-------|
| id | JUL-NEW-05 |
| date | 2026-07-18 |
| confidence | confirmed |
| source_status | confirmed |
| type | trade_show |
| priority | 2 |
| emirate | Dubai |
| lifecycle | event_fixed |
| noindex_after | 2026-07-19 |
| archive_action | remove |
| label_en | Michael Lives Forever (Michael Jackson tribute) at Coca-Cola Arena (18 July) |
| short_label_en | Michael Lives Forever |
| cta_label_en | Tickets from AED 125 |
| source_label_en | Coca-Cola Arena official · Visit Dubai |

### JUL-NEW-06

| Field | Value |
|-------|-------|
| id | JUL-NEW-06 |
| date | 2026-07-25 |
| confidence | confirmed |
| source_status | confirmed |
| type | trade_show |
| priority | 2 |
| emirate | Dubai |
| lifecycle | event_fixed |
| noindex_after | 2026-07-26 |
| archive_action | remove |
| label_en | Beat The Heat DXB S5: Talal Sam & Sultan Al Murshed at DWTC Hall 8 (25 July) |
| short_label_en | Talal Sam & Sultan Al Murshed |
| cta_label_en | Tickets from AED 105 |
| source_label_en | Visit Dubai · Beat The Heat official schedule |

### JUL-NEW-07

| Field | Value |
|-------|-------|
| id | JUL-NEW-07 |
| date | 2026-07-26 |
| confidence | confirmed |
| source_status | confirmed |
| type | trade_show |
| priority | 2 |
| emirate | Dubai |
| lifecycle | event_fixed |
| noindex_after | 2026-07-27 |
| archive_action | remove |
| label_en | Indie Soulfest: Bismil & Indian Ocean at Coca-Cola Arena (26 July) |
| short_label_en | Indie Soulfest |
| cta_label_en | Tickets from AED 99 |
| source_label_en | Coca-Cola Arena official · Khaleej Times |

---

## 6. Database backup

| Field | Value |
|-------|-------|
| Path | `backups/local/guides.db.pre-batch01c-july-events-2026-07-18-010600` |
| Size | 896K |
| Created before mutation | YES |

---

## 7. Mutation method

Python 3 `sqlite3` script:
1. Created timestamped backup
2. Parsed `dates_json` for `july-2026-dubai-calendar` (6 existing items)
3. Verified no duplicate IDs (JUL-NEW-04 through JUL-NEW-07)
4. Appended 4 new items
5. Serialised and wrote back via `UPDATE ... SET dates_json=?, updated_at=datetime('now')`
6. Post-verified: all 4 IDs present, correct dates, confidence=confirmed, label_en exact match, item count = 10

---

## 8. Item count

| State | Count |
|-------|-------|
| Before | 6 |
| After | 10 |
| Added | 4 (JUL-NEW-04, JUL-NEW-05, JUL-NEW-06, JUL-NEW-07) |

---

## 9. QA results

| # | Check | Result |
|---|-------|--------|
| 1 | DB backup created before mutation | PASS ✓ |
| 2 | No duplicate IDs | PASS ✓ |
| 3 | All 4 items inserted (Python post-assertions) | PASS ✓ |
| 4 | Item count: 6 → 10 | PASS ✓ |
| 5 | Build: 92 pages | PASS ✓ |
| 6 | Build: 0 TypeScript errors | PASS ✓ |
| 7 | EN page: "Dystinct", "Issam Najjar" present | PASS ✓ |
| 8 | EN page: "Michael Lives Forever", "tribute" present | PASS ✓ |
| 9 | EN page: "Talal Sam", "Sultan" present | PASS ✓ |
| 10 | EN page: "Indie Soulfest", "Bismil", "Indian Ocean" present | PASS ✓ |
| 11 | EN page: "AED 105" (x2), "AED 125", "AED 99" present | PASS ✓ |
| 12 | RU page: "трибьют" (tribute) present for Michael Lives Forever | PASS ✓ |
| 13 | RU page: "Талал Сам" present | PASS ✓ |
| 14 | RU page: "от 105 AED", "от 125 AED", "от 99 AED" present | PASS ✓ |
| 15 | No production deploy | PASS ✓ |
| 16 | Existing July items (JUL-NEW-01 Atif Aslam, JUL-NEW-02 UFC, JUL-NEW-03 Restaurant Week, JUL-03-DSS, JUL-03-MODESH, JUL-03-KHAIR) unchanged | PASS ✓ |

---

## 10. Audit files updated

| File | Changes |
|------|---------|
| `6c-calendar-universe-master-inventory.md` | JUL-05 through JUL-08: MISSING → in (JUL-NEW-04/05/06/07) ✓ Batch-01C; AUG-01 source updated (publicholidays.ae → UAE Government Portal) |
| `6c-calendar-universe-implementation-backlog.md` | B1-B: JUL-05 through JUL-08 marked DONE with JUL-07 date resolution note |
| `6c-calendar-universe-gap-analysis.md` | July 2026 concerts: 4 missing → 0 missing; all 4 marked implemented |
| `6c-calendar-universe-audit-report.md` | July 2026 row: Already in Guidex 6 → 10; Missing 4 → 0; Net new 4 → 0 |
| `6c-calendar-universe-source-ledger.md` | Added S16 (Visit Dubai), S17 (Coca-Cola Arena official), S18 (Beat The Heat press release) |
| `6c-calendar-universe-seo-cluster-map.md` | July 2026 concert coverage note updated |

---

## 11. Beat The Heat Season 5 — full schedule note (for August backlog)

From S18 (official press release), the complete Season 5 schedule is:
- Jul 11: Cairokee (past)
- Jul 18: Dystinct & Issam Najjar ← JUL-NEW-04 ✓ DONE
- Jul 25: Talal Sam & Sultan Al Murshed ← JUL-NEW-06 ✓ DONE
- Aug 1: Rasha Rizk ← candidate AUG-02 (next batch)
- Aug 8: Al Shami (& Leen Hayek per gap analysis) ← candidate AUG-04 (next batch)
- Aug 15: Marwan Moussa & Haleem ← new candidate, not in prior audit
- Aug 22: Leg_cy & Aziz Maraka & Big Sam ← new candidate, not in prior audit

Rasha Rizk and Al Shami are already in Batch 2 August backlog. Marwan Moussa/Haleem and Leg_cy are newly confirmed — add to August candidates list.

---

## 12. Files changed

**DB:** `data/guides.db` (local only, gitignored) — `calendar_pages.dates_json` for `july-2026-dubai-calendar`

**Docs (committed):**
- `docs/content-drafts/seo/6c-calendar-universe-batch-01c-july-live-events-2026.md` (this file)
- `docs/content-drafts/calendar/6c-calendar-universe-master-inventory.md`
- `docs/content-drafts/calendar/6c-calendar-universe-implementation-backlog.md`
- `docs/content-drafts/calendar/6c-calendar-universe-gap-analysis.md`
- `docs/content-drafts/calendar/6c-calendar-universe-audit-report.md`
- `docs/content-drafts/calendar/6c-calendar-universe-source-ledger.md`
- `docs/content-drafts/calendar/6c-calendar-universe-seo-cluster-map.md`
- `PROJECT_STATE.md`
- `SESSION_LOG.md`

**No code files changed.**

---

## 13. Production status

**NO PRODUCTION DEPLOYMENT.**
- DB change is local only (gitignored)
- Etihad Rail (d42f7f1), Mawlid 01B (0c37efc), FIX-01 (c18a5ed) remain undeployed
- PM2 not touched; no SSH; no production DB write

---

## 14. Recommended next phase

**Phase 6C-CALENDAR-UNIVERSE-BATCH-02** — August 2026 calendar additions:
- AUG-02: Rasha Rizk — Aug 1, DWTC
- AUG-04: Al Shami (& Leen Hayek) — Aug 8, DWTC
- AUG-05: Thaalam Beats (Usha Uthup, Benny Dayal) — Aug 15, CCA
- AUG-09: DUPHAT 2026 — Aug 25-27, DWTC
- NEW: Marwan Moussa & Haleem — Aug 15, DWTC (from Beat The Heat S18)
- NEW: Leg_cy & Aziz Maraka & Big Sam — Aug 22, DWTC (from Beat The Heat S18)
- AUG-06: Sonu Nigam Revolution Tour — Aug 21, Etihad Arena Abu Dhabi

---

## 15. Safety confirmation

| Rule | Status |
|------|--------|
| No production DB write | CONFIRMED ✓ |
| No db-restore-to-server.sh run | CONFIRMED ✓ |
| No production deploy | CONFIRMED ✓ |
| No schema / migrations | CONFIRMED ✓ |
| No admin / auth / proxy changes | CONFIRMED ✓ |
| No environment variable changes | CONFIRMED ✓ |
| No PM2 stop/start | CONFIRMED ✓ |
| No git add . | CONFIRMED ✓ |
| .env.local not committed | CONFIRMED ✓ |
| data/guides.db not committed | CONFIRMED ✓ |
| Michael Jackson tribute safeguard: label + brief clearly identify as tribute show | CONFIRMED ✓ |
| Talal Sam date conflict: Case B resolution documented and sourced | CONFIRMED ✓ |
| Etihad Rail Batch 01A (d42f7f1) undeployed | CONFIRMED ✓ |
| Mawlid Batch 01B (0c37efc) undeployed | CONFIRMED ✓ |
| Mawlid FIX-01 (c18a5ed) undeployed | CONFIRMED ✓ |
