# UAE Calendar Batch 1 Production Import Report
## Phase 6C-95C | Date: 2026-06-02

---

## Final status: DEPLOYED_AND_IMPORTED

---

## Commit and push

| Field | Value |
|-------|-------|
| Commit hash | d60c513 |
| Message | Deploy UAE Calendar UX and Batch 1 calendar import |
| Branch | main |
| Push status | SUCCESS — github.com/Yessenof/dubai-guide-site |
| Files committed | 24 (9 code changes + 2 scripts + 10 docs + 3 memory files) |

---

## Deploy

| Field | Value |
|-------|-------|
| Deploy command | `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"` |
| Deploy result | SUCCESS |
| Build time | 53s |
| Reload time | ~1s |
| Health check | HTTPS guidex-consulting.ae/ → 200 |
| PM2 status | online, 0% CPU, 141.9mb, 32 restarts, 5m uptime |
| Old PM2 flow used | NO — zero-downtime script only |
| Commit deployed | d60c513 |

---

## DB backup

| Field | Value |
|-------|-------|
| Backup path | `/var/www/guidex/data/guides.db.backup-pre-6c95c-20260602-120350` |
| Backup size | 680K |
| Backup created | Before import |

---

## Production import

| Field | Value |
|-------|-------|
| Script | `scripts/import-uae-calendar-batch-1-production-6c95c.ts` |
| Env gate | `CONFIRM_PRODUCTION_IMPORT_6C95C=yes` |
| DB path logged | `/var/www/guidex/data/guides.db` |
| Timestamp | 2026-06-02T08:04:12.085Z |
| Result | SUCCESS |
| Total new items | 12 |
| New pages created | 1 (december-2026-uae-calendar) |
| Migrations | NONE |

### Rows inserted/updated by month

| Month | Slug | Items added | Items total after | Status |
|-------|------|-------------|------------------|--------|
| August 2026 | august-2026-dubai-calendar | +2 (AUG-04-BACKSCH, AUG-05-MICHAEL) | 5 | published |
| September 2026 | september-2026-dubai-calendar | +2 (SEP-09-AGUILERA, SEP-10-OAKENFOLD) | 10 | published |
| October 2026 | october-2026-dubai-calendar | +2 (OCT-05-MIDTERM, OCT-06-MARX) | 6 | published |
| November 2026 | november-2026-dubai-calendar | +1 (NOV-05-SIBF) | 4 | published |
| December 2026 (NEW) | december-2026-uae-calendar | +5 (DEC-01-COMMEM, DEC-02-NATDAY, DEC-03-F1, DEC-04-GITEX, DEC-05-WINBRK) | 5 | published |

---

## Live QA results

All 22 routes checked against https://guidex-consulting.ae.

| Route | HTTP | Content check |
|-------|------|--------------|
| / | 200 | Homepage OK |
| /ru | 200 | RU homepage OK |
| /calendar | 200 | H1: "UAE Calendar" |
| /ru/calendar | 200 | H1: "Календарь ОАЭ" |
| /calendar?month=2026-07 | 200 | Existing items (unchanged) |
| /calendar?month=2026-08 | 200 | Back to School, This Is Michael present |
| /calendar?month=2026-09 | 200 | Christina Aguilera (Abu Dhabi), Paul Oakenfold, Corp Tax present |
| /calendar?month=2026-10 | 200 | Mid-term break, Richard Marx, WETEX, VAT present |
| /calendar?month=2026-11 | 200 | Sharjah Book Fair, DDW, Big 5, ADIPEC present |
| /calendar?month=2026-12 | 200 | National Day, Commemoration Day, F1 Abu Dhabi, GITEX, Winter break |
| /ru/calendar?month=2026-07..12 | 200 (×6) | RU renders correctly |
| /calendar/december-2026-uae-calendar | 200 | Title: "December 2026 UAE Calendar: National Day, F1 Abu Dhabi and GITEX" |
| /ru/calendar/december-2026-uae-calendar | 200 | Title: "Декабрь 2026 ОАЭ: День независимости, Гран-при Абу-Даби и GITEX" |
| /events/dubai-design-week-2026 | 200 | Regression: OK |
| /ru/events/dubai-design-week-2026 | 200 | Regression: OK |
| /events/big-5-global-dubai-2026 | 200 | Regression: OK |
| /ru/events/big-5-global-dubai-2026 | 200 | Regression: OK |

**All 22 routes: PASS (200 OK)**

---

## QA content checks

| Check | Result |
|-------|--------|
| "UAE Calendar" rendered (not "Dubai Calendar") | PASS |
| "Календарь ОАЭ" rendered (RU) | PASS |
| F1 labelled "Abu Dhabi" | PASS |
| GITEX labelled "Expo City" | PASS |
| National Day present in December | PASS |
| Commemoration Day present in December | PASS |
| Sharjah Book Fair present in November (labelled Sharjah) | PASS |
| Back to School present in August | PASS |
| Mid-term break present in October | PASS |
| Christina Aguilera + Abu Dhabi in September | PASS |
| No DFC in any month | PASS |
| No Global Village in any month | PASS |
| No DSF in any month | PASS |
| No The Corrs | PASS |
| "VAT Q3" present (pre-existing OCT-03-VAT item -- legitimate) | PASS (expected) |
| No raw Markdown/JSON visible | PASS |
| PM2 healthy | PASS |

---

## UX changes live

| Change | Status |
|--------|--------|
| "Dubai Calendar" → "UAE Calendar" product label | LIVE |
| "Календарь Дубая" → "Календарь ОАЭ" | LIVE |
| "This month in Dubai" → "This month in the UAE" | LIVE |
| 2px horizontal range bars removed | LIVE |
| Mid-range days: small dim dot only | LIVE |

---

## Known remaining gaps

| Gap | Status |
|-----|--------|
| July 2026: still only 3 items | No confirmed new sources found; Batch 2 |
| June 2026: 8 items (adequate) | No new additions needed immediately |
| DFC Dubai Fitness Challenge | HOLD -- site 403 |
| Global Village Season 31 | HOLD -- no confirmed opening date |
| DSF 2026-27 | HOLD -- official dates not yet released |
| The Corrs Abu Dhabi Sep | HOLD -- exact date unconfirmed |
| VAT Q3 Nov deadline | HOLD -- FTA exact date unverified |
| RISE Real Estate Oct | HOLD -- single source |
| F1 Abu Dhabi detail page | Planned Phase 6C-95D |
| GITEX Global detail page | Planned Phase 6C-95D |
| July lifestyle/concert additions | Planned Batch 2 with new source research |

---

## Rollback command

```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

To also remove DB rows:
```sql
DELETE FROM calendar_pages WHERE slug='december-2026-uae-calendar';
-- Restore updated months from backup:
-- /var/www/guidex/data/guides.db.backup-pre-6c95c-20260602-120350
```

---

## Confirmation checklist

| Item | Result |
|------|--------|
| No migrations | CONFIRMED |
| No admin/AI Inbox | CONFIRMED |
| No unrelated features | CONFIRMED |
| No DFC imported | CONFIRMED |
| No Global Village imported | CONFIRMED |
| No DSF imported | CONFIRMED |
| No The Corrs imported | CONFIRMED |
| No VAT Q3 (new) imported | CONFIRMED (existing OCT-03-VAT is pre-existing) |
| Production DB backup exists | CONFIRMED |
| Zero-downtime deploy script used | CONFIRMED |
| Old PM2 flow NOT used | CONFIRMED |
| Commit pushed to GitHub | d60c513 |
