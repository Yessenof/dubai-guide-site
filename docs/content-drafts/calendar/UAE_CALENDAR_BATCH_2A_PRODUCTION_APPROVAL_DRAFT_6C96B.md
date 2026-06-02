# UAE Calendar Batch 2A Production Approval Draft
## Phase 6C-96B → 6C-96C | Prepared: 2026-06-02

---

## Recommendation: APPROVE_BATCH_2A_PRODUCTION_IMPORT

Local QA passes 18/18 routes. Build passes 88/88 pages. 15 items added across 6 months. All items have 2+ verified sources. No HOLD items present. Mawlid correctly marked `confidence: "expected"` with moon-sighting disclaimer.

---

## Production import items

| Month | ID | Event | Date | Emirate |
|-------|-----|-------|------|---------|
| July | JUL-NEW-01 | Atif Aslam, Etihad Arena Abu Dhabi | Jul 18 | Abu Dhabi |
| July | JUL-NEW-02 | UFC Fight Night Abu Dhabi | Jul 25 | Abu Dhabi |
| July | JUL-NEW-03 | DSS Summer Restaurant Week | Jul 13–Aug 2 | Dubai |
| August | AUG-NEW-01 | SB Girls (Get Get Aw!), Etihad Arena Abu Dhabi | Aug 8 | Abu Dhabi |
| August | AUG-NEW-02 | Prophet Muhammad's Birthday (Mawlid) — expected | ~Aug 24-25 | UAE |
| August | AUG-NEW-03 | Miami Show, Coca-Cola Arena Dubai | Aug 29 | Dubai |
| September | SEP-NEW-01 | ATB Legends of Trance, The Agenda Dubai | Sep 5 | Dubai |
| October | OCT-NEW-01 | God Save The Queen, Dubai Opera | Oct 5 | Dubai |
| October | OCT-NEW-02 | Sonny Fodera, FIVE LUXE JBR | Oct 10 | Dubai |
| October | OCT-NEW-03 | Blue 25th Anniversary, Expo City Dubai | Oct 25 | Dubai |
| October | OCT-NEW-04 | Russell Peters, Etihad Arena Abu Dhabi | Oct 25 | Abu Dhabi |
| October | OCT-NEW-05 | Riverdance, Etihad Arena Abu Dhabi | Oct 31–Nov 1 | Abu Dhabi |
| November | NOV-NEW-02 | OFFLIMITS Festival (Shakira+), Etihad Park Abu Dhabi | Nov 21 | Abu Dhabi |
| November | NOV-NEW-03 | Tarkan, Etihad Arena Abu Dhabi | Nov 27 | Abu Dhabi |
| December | DEC-NEW-01 | F1 Concert (Lewis Capaldi), Yas Marina Abu Dhabi | Dec 3 | Abu Dhabi |

---

## Production script plan

Create: `scripts/import-uae-calendar-batch-2a-production-6c96c.ts`

Following the 6C-94D / 6C-95C production script pattern:
- Env gate: `CONFIRM_PRODUCTION_IMPORT_6C96C=yes`
- Log DB path
- HOLD guard (same as local script)
- Em dash guard
- Idempotent merge (checks existing IDs)
- Update + re-publish existing monthly pages
- Post-import verification
- Print rows inserted

---

## Production DB backup required

Before any production write:
```
BACKUP_TS=$(date +%Y%m%d-%H%M%S)
ssh root@85.9.203.69 "cp /var/www/guidex/data/guides.db \
  /var/www/guidex/data/guides.db.backup-pre-6c96c-${BACKUP_TS}"
```

---

## No new deploy required

This import does NOT require a code deploy — only a production DB write.
The calendar code already renders DATES_JSON items dynamically from the DB.
Running the import script on the server is sufficient; no `npm run build` needed on production.

If the owner wishes to deploy the production script itself (new file):
```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```
Do NOT use old PM2 stop/build/start flow.

---

## Live QA routes (after production import)

```
/ (homepage regression)
/ru (RU homepage regression)
/calendar?month=2026-07 (July new items)
/calendar?month=2026-08 (August new items)
/calendar?month=2026-09 (September ATB)
/calendar?month=2026-10 (October new items x5)
/calendar?month=2026-11 (November OFFLIMITS + Tarkan)
/calendar?month=2026-12 (December F1 Concert)
RU equivalents for all above
/calendar/december-2026-uae-calendar (regression)
/ru/calendar/december-2026-uae-calendar (regression)
/events/dubai-design-week-2026 (regression)
/events/big-5-global-dubai-2026 (regression)
```

---

## Risk notes

| Risk | Level | Mitigation |
|------|-------|-----------|
| Mawlid date shifts by moon sighting | LOW | Confidence = "expected"; label says "subject to announcement" |
| Concert cancelled/postponed | LOW | All have noindex_after; can archive if needed |
| Abu Dhabi events confusing Dubai users | LOW | All labelled emirate=Abu Dhabi, briefs say "~130 km from Dubai" |
| Riverdance spans Oct 31–Nov 1 | LOW | period_end set correctly; shows in Oct calendar |

---

## Rollback command

```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

To remove only DB changes:
```sql
-- On production server, restore from backup:
-- /var/www/guidex/data/guides.db.backup-pre-6c96c-YYYYMMDD-HHMMSS
```

---

## Confirmed exclusions

- No DFC imported
- No Global Village imported
- No DSF imported
- No The Corrs imported
- No VAT Q3 Nov imported
- No El Row imported
- No Kadim Al Sahir imported
- No Swedish House Mafia imported
- No migrations ran
- No admin panel used
