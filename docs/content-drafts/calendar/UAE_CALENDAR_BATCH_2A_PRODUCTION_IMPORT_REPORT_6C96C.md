# UAE Calendar Batch 2A Production Import Report
## Phase 6C-96C | Date: 2026-06-02

---

## Final status: IMPORTED_DB_ONLY

No app code changes. No full deploy required. Production DB updated via script on server.

---

## Commit

| Field | Value |
|-------|-------|
| Commit hash | c4b6aaa |
| Message | Import UAE Calendar Batch 2A production candidates |
| Push status | SUCCESS — github.com/Yessenof/dubai-guide-site |
| Files committed | 10 (2 scripts + 8 docs) |

---

## Deploy

| Field | Value |
|-------|-------|
| App code changed | NO |
| Deploy required | NO — DB-only import |
| Method | `git pull` on server to fetch script; script run directly |
| PM2 reload | NOT required (no code change) |
| PM2 status | online |
| Zero-downtime script used | NOT needed (no code change) |

---

## DB backup

| Field | Value |
|-------|-------|
| Backup path | `/var/www/guidex/data/guides.db.backup-pre-6c96c-20260602-230123` |
| Backup size | 680K |
| Created | Before import |

---

## Production import

| Field | Value |
|-------|-------|
| Script | `scripts/import-uae-calendar-batch-2a-production-6c96c.ts` |
| Env gate | `CONFIRM_PRODUCTION_IMPORT_6C96C=yes` |
| DB path | `/var/www/guidex/data/guides.db` |
| Timestamp | 2026-06-02T19:01:36.082Z |
| Result | SUCCESS |
| Total rows added | 15 |
| Total rows skipped | 0 |
| Migrations | NONE |

---

## Rows inserted by month

| Month | Slug | IDs added | Items before | Items after |
|-------|------|-----------|-------------|------------|
| July 2026 | july-2026-dubai-calendar | JUL-NEW-01, JUL-NEW-02, JUL-NEW-03 | 3 | **6** |
| August 2026 | august-2026-dubai-calendar | AUG-NEW-01, AUG-NEW-02, AUG-NEW-03 | 5 | **8** |
| September 2026 | september-2026-dubai-calendar | SEP-NEW-01 | 10 | **11** |
| October 2026 | october-2026-dubai-calendar | OCT-NEW-01..05 | 6 | **11** |
| November 2026 | november-2026-dubai-calendar | NOV-NEW-02, NOV-NEW-03 | 4 | **6** |
| December 2026 | december-2026-uae-calendar | DEC-NEW-01 | 5 | **6** |

---

## Mawlid handling

**Decision: IMPORTED as `confidence="expected"` with moon-sighting disclaimer.**

- The holiday (Mawlid Al Nabi) is an official UAE public holiday established by law — certain.
- The exact date (~Aug 24-25) is subject to official UAE moon-sighting announcement — uncertain.
- The system supports `confidence: "expected"` (same as Eid Al Adha treatment).
- Label explicitly states "expected around 24-25 August, subject to moon sighting."
- No overclaim. Safe to import.

---

## Live QA results

All 22 routes checked against https://guidex-consulting.ae.

| Route | HTTP | Check |
|-------|------|-------|
| / | 200 | Homepage OK |
| /ru | 200 | RU homepage OK |
| /calendar | 200 | UAE Calendar label present |
| /ru/calendar | 200 | Календарь ОАЭ present |
| /calendar?month=2026-07 | 200 | Atif Aslam, UFC Fight Night, Restaurant Week present |
| /ru/calendar?month=2026-07 | 200 | RU renders correctly |
| /calendar?month=2026-08 | 200 | SB Girls, Mawlid (expected), Miami Show present |
| /ru/calendar?month=2026-08 | 200 | OK |
| /calendar?month=2026-09 | 200 | ATB present |
| /ru/calendar?month=2026-09 | 200 | OK |
| /calendar?month=2026-10 | 200 | God Save Queen, Sonny Fodera, Blue Concert, Russell Peters, Riverdance present |
| /ru/calendar?month=2026-10 | 200 | OK |
| /calendar?month=2026-11 | 200 | OFFLIMITS/Shakira, Tarkan, DDW, Big 5 present |
| /ru/calendar?month=2026-11 | 200 | OK |
| /calendar?month=2026-12 | 200 | F1 Concert/Lewis Capaldi, GITEX, National Day present |
| /ru/calendar?month=2026-12 | 200 | OK |
| /calendar/december-2026-uae-calendar | 200 | Regression: OK |
| /ru/calendar/december-2026-uae-calendar | 200 | Regression: OK |
| /events/dubai-design-week-2026 | 200 | Regression: OK |
| /ru/events/dubai-design-week-2026 | 200 | Regression: OK |
| /events/big-5-global-dubai-2026 | 200 | Regression: OK |
| /ru/events/big-5-global-dubai-2026 | 200 | Regression: OK |

**All 22 routes: PASS (200 OK)**

---

## Content checks passed

- UAE Calendar label live
- No horizontal bars
- No DFC, no Global Village, no DSF, no The Corrs, no El Row in any month
- All months clean on HOLD keyword check
- Atif Aslam, UFC, Restaurant Week in July — CONFIRMED LIVE
- OFFLIMITS/Shakira, Tarkan in November — CONFIRMED LIVE
- F1 Concert/Lewis Capaldi in December — CONFIRMED LIVE
- PM2 online, no errors

---

## Known remaining gaps

| Gap | Status |
|-----|--------|
| July 2026: 6 items, still relatively sparse | DSS concert lineup not yet announced; more research needed |
| DFC Dubai Fitness Challenge | HOLD — site 403 |
| Global Village Season 31 | HOLD — no opening date confirmed |
| DSF 2026-27 | HOLD — official dates not released |
| The Corrs Abu Dhabi Sep | HOLD — exact date unconfirmed |
| VAT Q3 November deadline | HOLD — FTA exact date unverified |
| El Row Dubai October | NEEDS_SECOND_SOURCE |
| Kadim Al Sahir | SIGNAL_ONLY |
| Swedish House Mafia | SIGNAL_ONLY |
| F1/GITEX detail pages | Planned Phase 6C-95D/97 |
| OFFLIMITS detail page | Planned Phase 6C-97 |

---

## Rollback

```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

To restore DB only:
```
ssh root@85.9.203.69 "cp /var/www/guidex/data/guides.db.backup-pre-6c96c-20260602-230123 /var/www/guidex/data/guides.db"
```

---

## Confirmation

| Item | Result |
|------|--------|
| No migrations | CONFIRMED |
| No admin/AI Inbox | CONFIRMED |
| No unrelated features | CONFIRMED |
| No DFC | CONFIRMED |
| No Global Village | CONFIRMED |
| No DSF | CONFIRMED |
| No The Corrs | CONFIRMED |
| No El Row | CONFIRMED |
| No Kadim Al Sahir | CONFIRMED |
| No Swedish House Mafia | CONFIRMED |
| Mawlid: confidence=expected | CONFIRMED |
| DB backup exists before import | CONFIRMED |
| No full deploy (no code changes) | CONFIRMED |
| Commit pushed to GitHub | c4b6aaa |
