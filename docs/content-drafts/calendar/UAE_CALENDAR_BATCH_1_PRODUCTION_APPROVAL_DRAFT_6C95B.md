# UAE Calendar Batch 1 Production Approval Draft
## Phase 6C-95B → 6C-95C | Prepared: 2026-06-02

---

## Recommendation

**APPROVE_BATCH_1_PRODUCTION_IMPORT**

Local QA passes 18/18 routes. Build passes 88/88 pages. 12 new calendar items + 1 new December page. All items have verified sources. No HOLD items present. December page uses correct UAE-scope branding.

This approval covers TWO actions:
1. **Deploy UX code changes** (Dubai Calendar → UAE Calendar rename + horizontal bar removal from 6C-95A)
2. **Production DB import** (Batch 1: 7 new items to existing pages + December page)

---

## Action 1: Deploy code changes (6C-95A UX)

Code changes committed locally but not yet pushed:
- `Dubai Calendar` → `UAE Calendar` across 9 files
- CalendarGrid: 2px horizontal bars removed, dim dot for mid-range days
- Build: PASS 88/88

**Deploy command (requires explicit owner approval):**
```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```
**Do NOT use old PM2 stop/build/start flow.**

**Rollback:**
```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

---

## Action 2: Production DB import (Batch 1)

### Production import script

`scripts/import-uae-calendar-batch-1-local-6c95b.ts` is safe to run on production after adding the env gate.

**IMPORTANT:** Before running on production, a separate production-safe script should be created with:
- `CONFIRM_PRODUCTION_IMPORT_6C95B=yes` env gate
- explicit DB path logging

Following the Phase 6C-94D pattern, create:
`scripts/import-uae-calendar-batch-1-production-6c95c.ts`

The content strings and item data are identical to the local script. The production script adds:
- Env gate check
- Production DB logging
- Abort guard if December page already exists
- Rollback instructions

### Production DB backup required

Before any production DB write:
```
BACKUP_TS=$(date +%Y%m%d-%H%M%S)
ssh root@85.9.203.69 "cp /var/www/guidex/data/guides.db \
  /var/www/guidex/data/guides.db.backup-pre-batch1-6c95c-${BACKUP_TS}"
```

### Items to import on production

| Month | Slug | New items |
|-------|------|-----------|
| August 2026 | august-2026-dubai-calendar | AUG-04-BACKSCH, AUG-05-MICHAEL |
| September 2026 | september-2026-dubai-calendar | SEP-09-AGUILERA, SEP-10-OAKENFOLD |
| October 2026 | october-2026-dubai-calendar | OCT-05-MIDTERM, OCT-06-MARX |
| November 2026 | november-2026-dubai-calendar | NOV-05-SIBF |
| December 2026 (NEW) | december-2026-uae-calendar | DEC-01-COMMEM, DEC-02-NATDAY, DEC-03-F1, DEC-04-GITEX, DEC-05-WINBRK |

---

## Live QA route list (after production import)

```
/calendar?month=2026-07 (regression)
/calendar?month=2026-08 (new items)
/calendar?month=2026-09 (new items)
/calendar?month=2026-10 (new items)
/calendar?month=2026-11 (new items)
/calendar?month=2026-12 (new December page)
/calendar/december-2026-uae-calendar (new)
/ru/calendar?month=2026-07 (regression)
/ru/calendar?month=2026-08
/ru/calendar?month=2026-09
/ru/calendar?month=2026-10
/ru/calendar?month=2026-11
/ru/calendar?month=2026-12
/ru/calendar/december-2026-uae-calendar
/events/dubai-design-week-2026 (regression)
/events/big-5-global-dubai-2026 (regression)
/ (homepage, regression)
/ru (RU homepage, regression)
```

---

## Risks

| Risk | Level | Mitigation |
|------|-------|-----------|
| Concert dates may change | LOW | All entertainment items have noindex_after set; can archive if cancelled |
| December slugs differ from existing pattern | LOW | New page, no existing URL to break |
| December summary warning (length) | NONE | Non-blocking; content is accurate |
| Abu Dhabi items (F1, Christina, This Is Michael) causing confusion | LOW | All clearly labelled emirate=Abu Dhabi |
| GITEX at new venue | LOW | Brief explicitly mentions Expo City Dubai, not DWTC |

---

## Confirmed exclusions

- No DFC imported
- No Global Village imported
- No DSF imported
- No migration ran
- No admin panel used
- No unapproved items

---

## Next phase actions (Phase 6C-95C)

After Batch 1 production import:
1. Create F1 Abu Dhabi detail page (`/events/f1-abu-dhabi-grand-prix-2026`)
2. Create GITEX Global detail page (`/events/gitex-global-2026`)
3. Update December calendar to add detail_urls to F1 and GITEX items
4. Source second confirmation for The Corrs September date
5. Verify VAT Q3 November deadline with FTA
6. Re-check DFC and Global Village sources
7. Begin Batch 2: June additions, July density
