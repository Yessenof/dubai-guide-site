# UAE Calendar Batch 2B Production Import Report
## Phase 6C-97C | Date: 2026-06-06

---

## Final status

**IMPORTED_DB_ONLY** — Production import complete. Zero-downtime deploy run to rebuild SSG pages.

---

## Commit and push

| Item | Value |
|------|-------|
| Commit hash | `6665da8` |
| Commit message | Import UAE Calendar Batch 2B production candidates |
| Push status | PUSHED — `main` branch, GitHub `Yessenof/dubai-guide-site` |
| Files committed | scripts/import-uae-calendar-batch-2b-local-6c97b.ts, scripts/import-uae-calendar-batch-2b-production-6c97c.ts, docs/content-drafts/calendar/UAE_CALENDAR_BATCH_2B_3_CANDIDATE_PACK_6C97A.md, UAE_CALENDAR_BATCH_2B_LOCAL_IMPORT_QA_6C97B.md, UAE_CALENDAR_BATCH_2B_PREIMPORT_REVIEW_6C97B.md, UAE_CALENDAR_BATCH_2B_PRODUCTION_APPROVAL_DRAFT_6C97B.md, HIGH_VALUE_EVENT_DETAIL_PAGE_PLAN_6C97A.md, JULY_2026_DEEP_RECOVERY_ROUND_2_6C97A.md, NOV_DEC_2026_DENSITY_RECOVERY_6C97A.md, PENDING_CANDIDATES_SECOND_SOURCE_RECHECK_6C97A.md, PHASE_6C97A_FINAL_REPORT.md, PROJECT_STATE.md, SESSION_LOG.md |

---

## Deploy

| Item | Value |
|------|-------|
| Deploy script used | YES — `scripts/deploy-zero-downtime.sh` |
| Reason | Calendar detail pages are SSG (pre-built). Rebuild required to reflect new DB content. |
| Build result | PASS — 88/88 pages, 0 TypeScript errors |
| Build time | 47s |
| PM2 reload | Graceful — max ~1-3s window |
| PM2 status after | online, 144.5MB |
| Health check after | HTTP 200 |

---

## DB backup

| Item | Value |
|------|-------|
| Pre-import backup (manual, before script) | `/var/www/guidex/data/guides.db.backup-pre-6c97c-20260606-091142` |
| Pre-import backup size | 745472 bytes (non-zero) PASS |
| Script-internal backup | `/var/www/guidex/data/guides.db.backup-pre-6c97c-2026-06-06-09-12-15` |
| Script-internal backup size | 728K |

Both backups confirmed non-zero before script ran.

---

## Production import script

| Item | Value |
|------|-------|
| Script | `scripts/import-uae-calendar-batch-2b-production-6c97c.ts` |
| Env flag required | `CONFIRM_PRODUCTION_IMPORT_6C97C=yes` |
| Path guard | Refuses `/Users/`, `/home/`, `Desktop`, `/tmp/` paths |
| No migrations | Confirmed — schema unchanged |
| No admin/AI Inbox | Confirmed — not used |
| No unapproved items | Confirmed — pre-flight validation passed |

---

## Production import result

| Item | Value |
|------|-------|
| New items inserted | **12** |
| Items updated | **1** (DEC-NEW-01) |
| Items skipped (already present) | **0** |
| Script exit code | 0 (success) |
| Post-import verification | ALL PASS |

---

## Rows inserted by month

| Month | Slug | Added | IDs | After |
|-------|------|-------|-----|-------|
| September 2026 | september-2026-dubai-calendar | +1 | SEP-R1 | **12** |
| October 2026 | october-2026-dubai-calendar | +2 | OCT-R1, OCT-R2 | **13** |
| November 2026 | november-2026-dubai-calendar | +8 | NOV-R1, NOV-R2, NOV-R3, NOV-R4, NOV-R5, NOV-R6, NOV-R7, NOV-R8 | **14** |
| December 2026 | december-2026-uae-calendar | +1 (+1 update) | DEC-R1; DEC-NEW-01 updated | **7** |

---

## Final totals by month (post-import)

| Month | Before Batch 2B | After Batch 2B |
|-------|----------------|----------------|
| July 2026 | 6 | 6 (no change) |
| August 2026 | 8 | 8 (no change) |
| September 2026 | 11 | **12** |
| October 2026 | 11 | **13** |
| November 2026 | 6 | **14** |
| December 2026 | 6 | **7** |

---

## Boris Grebenshikov (OCT-R2) handling

**Decision: CONDITIONAL VERIFIED — included in production.**

Verification trail across all 3 required documents:
1. `UAE_CALENDAR_BATCH_2B_3_CANDIDATE_PACK_6C97A.md` — Listed explicitly in **BATCH 2B — YES_READY (13 items)**. Sources: Platinumlist, Songkick, comingsoon.ae, The Agenda official, Instagram (5 sources). `source_status: confirmed`, `risk: low`.
2. `UAE_CALENDAR_BATCH_2B_PREIMPORT_REVIEW_6C97B.md` — OCT-R2 review: `MULTI_SOURCE_CONFIRMED`, Decision = **IMPORT**.
3. `UAE_CALENDAR_BATCH_2B_LOCAL_IMPORT_QA_6C97B.md` — Inserted as OCT-R2, content spot-check: **PASS**. `Гребенщиков present in RU: PASS`.

Condition met on all 3 checks. Boris Grebenshikov included in production as Oct 24, The Agenda, Dubai Media City.

---

## Dec 3 F1 concert (DEC-NEW-01) update confirmation

| Field | Before | After |
|-------|--------|-------|
| label_en | "F1 Abu Dhabi GP week concert at Yas Marina Circuit (3 December) -- Lewis Capaldi headline" | "F1 Abu Dhabi Week -- Yasalam opening concert at Etihad Park, Yas Island (3 December): Lewis Capaldi & Zara Larsson" |
| label_ru | Yas Marina / Lewis Capaldi only | "F1 Abu Dhabi -- концерт Yasalam в Etihad Park, Yas Island (3 декабря): Льюис Капальди и Zara Larsson" |
| short_label_en | "F1 Concert" | "F1 Concert Night 1" |
| short_label_ru | "F1 Концерт" | "F1 Концерт (3 дек)" |
| brief_en | Yas Marina Circuit | Updated to Etihad Park, Yas Island |
| Duplicate created | No — updated in place | Confirmed: no duplicate |

Live verification: `Zara Larsson in label_en: PASS`, `Etihad Park in brief_en: PASS`, `short_label_en=Night 1: PASS`.

---

## Live QA results

All 14 required routes: **14/14 PASS (200 OK)**

| Route | HTTP | Key content check |
|-------|------|------------------|
| / | 200 | OK |
| /ru | 200 | OK |
| /calendar | 200 | OK |
| /ru/calendar | 200 | OK |
| /calendar?month=2026-09 | 200 | The Corrs PASS, Abu Dhabi labelled PASS |
| /ru/calendar?month=2026-09 | 200 | The Corrs PASS, Абу-Даби PASS |
| /calendar?month=2026-10 | 200 | Elrow PASS, Boris Grebenshikov PASS |
| /ru/calendar?month=2026-10 | 200 | Elrow PASS, Гребенщиков PASS |
| /calendar?month=2026-11 | 200 | All 8 items PASS (Dubai Ride, ANOTR, When Chai Met Toast, Anuv Jain, KEINEMUSIK, Dubai Run, Atif Aslam Dubai, Hiba Tawaji); Expo City PASS; Bab Al Shams PASS; FIVE LUXE PASS |
| /ru/calendar?month=2026-11 | 200 | Dubai Ride, ANOTR, KEINEMUSIK, Dubai Run, Atif Aslam, Hiba Tawaji PASS |
| /calendar?month=2026-12 | 200 | Imagine Dragons PASS, Zara Larsson PASS, F1 Concert Night 1 PASS |
| /ru/calendar?month=2026-12 | 200 | Imagine Dragons PASS, Zara Larsson PASS, Льюис Капальди PASS |
| /calendar/december-2026-uae-calendar | 200 | Imagine Dragons PASS, Zara Larsson PASS, Etihad Park PASS, Lewis Capaldi PASS |
| /ru/calendar/december-2026-uae-calendar | 200 | Imagine Dragons PASS, Zara Larsson PASS, Льюис Капальди PASS |

Additional checks:
- No hard-excluded items on any page: PASS
- UAE Calendar label visible on November listing: PASS
- Календарь ОАЭ label on RU November: PASS
- No horizontal bars: PASS
- No raw Markdown/JSON in HTML: PASS
- No EN fallback on RU pages: PASS
- PM2 healthy: online, 0 errors
- No nginx 502 window during deploy (graceful reload)

---

## Known remaining holds

| Item | Status |
|------|--------|
| July 2026 calendar | At realistic summer ceiling (6 items). No change. |
| Global Village Season 31 | HOLD — no official opening date. Re-check Aug-Sep 2026. |
| DSF 2026-27 | HOLD — no official DET dates. Re-check Oct-Nov 2026. |
| Timur Bey 2 Jul 9 | HOLD — artist identity unverified. |
| Beat The Heat DXB | HOLD — 2026 performer lineup not announced. Re-check Jul 2026. |
| CCA Dec 16-20 unnamed event | HOLD — no title announced. Re-check Jul-Aug 2026. |

---

## Rollback instructions

**DB-only rollback:**
```bash
ssh root@85.9.203.69 "cp /var/www/guidex/data/guides.db.backup-pre-6c97c-20260606-091142 /var/www/guidex/data/guides.db"
```

**Full rollback (code + DB):**
```bash
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

**Items to delete if targeted rollback needed:**
- SEP-R1 from september-2026-dubai-calendar
- OCT-R1, OCT-R2 from october-2026-dubai-calendar
- NOV-R1 through NOV-R8 from november-2026-dubai-calendar
- DEC-R1 from december-2026-uae-calendar
- Revert DEC-NEW-01 label/brief in december-2026-uae-calendar
