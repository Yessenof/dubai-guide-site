# UAE Calendar Batch 2B Production Import — Approval Draft
## Phase 6C-97B | Date: 2026-06-06

---

## Status

**LOCAL QA: PASS**
**Recommendation: APPROVE_BATCH_2B_PRODUCTION_IMPORT**

Awaiting owner approval before any production action.

---

## Exact production import list

### New items (12 inserts)

| ID | Month | Date | Label (short) | Emirate |
|----|-------|------|---------------|---------|
| SEP-R1 | September | Sep 27 | The Corrs | Abu Dhabi |
| OCT-R1 | October | Oct 24 | Elrow Dubai | Dubai |
| OCT-R2 | October | Oct 24 | Boris Grebenshikov | Dubai |
| NOV-R1 | November | Nov 1 | Dubai Ride | Dubai |
| NOV-R2 | November | Nov 13 | ANOTR | Dubai |
| NOV-R3 | November | Nov 14 | When Chai Met Toast | Dubai |
| NOV-R4 | November | Nov 20 | Anuv Jain | Dubai |
| NOV-R5 | November | Nov 21 | KEINEMUSIK | Dubai |
| NOV-R6 | November | Nov 22 | Dubai Run | Dubai |
| NOV-R7 | November | Nov 27 | Atif Aslam Dubai | Dubai |
| NOV-R8 | November | Nov 27 | Hiba Tawaji & Maalouf | Dubai |
| DEC-R1 | December | Dec 5 | Imagine Dragons | Abu Dhabi |

### Updates (1 update)

| ID | Target | Change |
|----|--------|--------|
| DEC-UPDATE-1 | DEC-NEW-01 (December page) | Update labels and brief to add Zara Larsson as co-headliner alongside Lewis Capaldi. Update venue from "Yas Marina Circuit" to "Etihad Park, Yas Island". Update short label from "F1 Concert" to "F1 Concert Night 1". |

### Not imported

| Item | Reason |
|------|--------|
| Global Village | HOLD |
| DSF 2026-27 | HOLD |
| Timur Bey 2 Jul 9 | HOLD |
| Beat The Heat DXB | HOLD |
| CCA Dec 16-20 | HOLD |
| Kadim Al Sahir | REJECT |
| Swedish House Mafia | REJECT |

---

## Expected item counts after production import

| Month | Current production | After import |
|-------|-------------------|-------------|
| September 2026 | 11 | **12** |
| October 2026 | 11 | **13** |
| November 2026 | 6 | **14** |
| December 2026 | 6 | **7** |

---

## DB backup requirement

A timestamped backup must be created on the server **before** running the import script.

The production import script will create a backup automatically. Verify backup exists before proceeding.

Expected backup path: `/var/www/guidex/data/guides.db.backup-pre-6c97c-YYYYMMDD-HHMMSS`

---

## Env confirmation flag

The production script must require:

```
CONFIRM_PRODUCTION_IMPORT_6C97C=yes
```

Do not run without this flag.

---

## Deploy requirement

**No app code changed.** This is a DB-only import.

- PM2 reload: NOT required
- Zero-downtime deploy script: NOT required
- A `git pull` on the server is required to fetch the production script before running.

**If the production script is the only new file:**

```bash
# On server — fetch script
cd /var/www/guidex && git pull

# Run import (only after DB backup confirmed)
CONFIRM_PRODUCTION_IMPORT_6C97C=yes npx tsx scripts/import-uae-calendar-batch-2b-production-6c97c.ts
```

**If any app code changes are also included:**
```bash
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```

**Do NOT use old PM2 stop/build/start flow.**

---

## Rollback command

```bash
# DB-only rollback
ssh root@85.9.203.69 "cp /var/www/guidex/data/guides.db.backup-pre-6c97c-YYYYMMDD-HHMMSS /var/www/guidex/data/guides.db"

# Full rollback (if deploy was run)
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

---

## Live QA routes (post-production import)

Check all of these against https://guidex-consulting.ae after import:

| Route | Expected content |
|-------|----------------|
| /calendar?month=2026-09 | The Corrs present |
| /ru/calendar?month=2026-09 | The Corrs present |
| /calendar?month=2026-10 | Elrow, Boris Grebenshikov present |
| /ru/calendar?month=2026-10 | Гребенщиков present |
| /calendar?month=2026-11 | Dubai Ride, ANOTR, When Chai Met Toast, Anuv Jain, KEINEMUSIK, Dubai Run, Atif Aslam Dubai, Hiba Tawaji all present |
| /ru/calendar?month=2026-11 | KEINEMUSIK, Dubai Run, Atif Aslam, Hiba Tawaji present |
| /calendar?month=2026-12 | Imagine Dragons present; Zara Larsson in Dec 3 label; F1 Concert Night 1 short label |
| /ru/calendar?month=2026-12 | Imagine Dragons, Zara Larsson present |
| /calendar/december-2026-uae-calendar | Imagine Dragons, Zara Larsson present |
| /ru/calendar/december-2026-uae-calendar | RU December detail page renders |
| /events/dubai-design-week-2026 | Regression: 200 OK |
| /events/big-5-global-dubai-2026 | Regression: 200 OK |

---

## Risk notes

| Risk | Level | Note |
|------|-------|------|
| Data correctness | LOW | All 13 items locally verified, multi-source confirmed |
| Schema compatibility | LOW | Same schema as Batch 2A — no new fields |
| Duplicate items | LOW | Idempotent script; existing IDs are skipped |
| DEC-NEW-01 update | LOW | In-place JSON patch confirmed to work locally; Zara Larsson verified in label |
| Rollback | LOW | DB backup created before import; restore path tested |
| Deploy impact | NONE | DB-only import, no code changes, no PM2 reload required |

---

## Owner approval required

**No production action will be taken until owner explicitly approves.**

To approve: respond with "Approved — proceed with Batch 2B production import" or similar explicit instruction.

The production import script (`scripts/import-uae-calendar-batch-2b-production-6c97c.ts`) should be created after owner approval, following the same pattern as `scripts/import-uae-calendar-batch-2a-production-6c96c.ts`.
