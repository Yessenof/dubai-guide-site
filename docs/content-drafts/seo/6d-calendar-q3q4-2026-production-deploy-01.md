# Phase 6D Production Deployment Report
## 6D-CALENDAR-Q3Q4-2026-PRODUCTION-DEPLOY-01

**Date:** 2026-08-07
**Phase tag:** 6D-CALENDAR-Q3Q4-2026-PRODUCTION-DEPLOY-01
**Production commit deployed:** `5da1015`
**Pre-deploy backup MD5:** `fc5eebafcd3144f04a6204702637cc2a` (884K)
**Post-patch DB MD5:** `7085b33ec5f1cd5f8ea468bcf38f0ffd` (960K)

---

## 1 — Phase Scope Summary

Deploy all Phase 6D calendar work (commits `8bacd4c`..`5da1015`) to production:
- 4 TypeScript patch scripts adding Q3/Q4 2026 calendar items and corrections
- Calendar code (JSON-LD, per-record sitemap lastmod)
- Docs and audit reports

DB changes applied via patch scripts, not by overwriting the production database. Production DB is source of truth.

Items in scope: 26 new calendar items (Aug: 7, Sep: 8, Oct: 12, Nov: 2, Dec: 1), 2 date fixes (OCT-06-MARX, Mawlid brief), 1 URL fix (OCT-06-MARX dead Platinumlist -> CCA), 1 label/brief fix (DEC-04-GITEX split venue).

Items explicitly out of scope: 13 P1 content stubs (both brief_en and brief_ru empty).

---

## 2 — Hard Constraints Applied

- Production SQLite was NOT overwritten from local copy. All DB writes applied via idempotent patch scripts run server-side.
- No DNS, nameservers, SSL, domains, firewall, or server networking altered.
- No git history amended or force-pushed.
- No uncommitted local changes deployed.
- No GSC URL submission made automatically.
- No events below D1 verification bar introduced.
- No EN text duplicated into RU fields.
- No historical pages deleted or mass-noindexed.
- Pre-deploy DB backup taken before any patch script ran.

---

## 3 — Pre-Deployment State

| Item | Value |
|---|---|
| Local git HEAD | `5da1015` (branch: main) |
| GitHub HEAD | `5da1015` (origin/main) |
| Production server git HEAD | `f6e9eae` (diverged — see Section 4) |
| Production DB size | 884K |
| Production DB MD5 | `fc5eebafcd3144f04a6204702637cc2a` |

---

## 4 — Git Divergence Resolution

Production server was at `f6e9eae` — a docs-only commit made directly on the server and never pushed.

Investigation confirmed:
- Common ancestor with origin/main: `f11ec5b`
- Divergent commit `f6e9eae` contained only: PROJECT_STATE.md, SESSION_LOG.md, docs/content-drafts/seo/6c-gsc-indexing-recovery-03-prod.md
- All three files already present in origin/main with newer content
- No code changes in the divergent commit

Resolution: `git reset --hard origin/main` then `git pull`. Production now at `5da1015`.

---

## 5 — Rehearsal

Rehearsal environment created before any production DB writes:

```
/tmp/guidex-rehearsal-20260806-122030/
  data/guides.db  (copy of production DB, MD5: fc5eebafcd3144f04a6204702637cc2a)
  backups/local/  (rehearsal backup dir)
```

All 4 patch scripts run with GUIDEX_DB_PATH pointing at rehearsal copy. Second run confirmed idempotency: all scripts skipped all previously applied changes.

---

## 6 — Production DB Backup (Pre-Deploy)

```
/var/www/guidex/backups/local/guides.db.pre-6d-deploy-20260806-122013
Size: 884K
MD5: fc5eebafcd3144f04a6204702637cc2a
```

Backup taken BEFORE any patch script ran against the production DB.

---

## 7 — Patch Script Execution: Batch-01 (Aug/Nov/Dec)

Script: `scripts/patch-6d-calendar-batch-01-aug-nov-dec.ts`
Items: 7 new calendar items (AUG-6D-01 through AUG-6D-04, NOV-6D-01, NOV-6D-02, DEC-6D-01)
Result: All 7 items inserted. integrity_check: ok.

---

## 8 — Patch Script Execution: Batch-02 (Aug/Sep/Oct)

Script: `scripts/patch-6d-calendar-batch-02-aug-sep-oct.ts`
Items: 11 new items + P0 fix (OCT-06-MARX date 2026-10-05 corrected to 2026-10-03)
Result: All 11 items inserted, P0 fix applied. integrity_check: ok.

---

## 9 — Patch Script Execution: Batch-03 (Sep/Oct)

Script: `scripts/patch-6d-calendar-batch-03-sep-oct.ts`
Items: 8 new items + Boris Grebenshikov date fix (2026-10-24 corrected to 2026-10-29)
Result: All 8 items inserted, date fix applied. integrity_check: ok.

---

## 10 — Patch Script Execution: Final Correction

Script: `scripts/patch-6d-final-correction-01.ts`

Items:
- DEC-04-GITEX: label corrected from "Dec 7-11 at Expo City Dubai" to split-venue format (Scale Summit Dec 7 at DWTC; main expo Dec 8-11 at Expo City Dubai); brief_en and brief_ru updated.
- OCT-06-MARX: source_url + cta_url replaced from dead Platinumlist event/105069 to CCA official (coca-cola-arena.com/music/1837/richard-marx); source_label updated.

Result: Both fixes applied. integrity_check: ok.

---

## 11 — SQLite WAL Checkpoint

After all 4 patch scripts ran, post-run MD5 of guides.db was unchanged from pre-deploy backup. This was expected: production DB uses SQLite WAL mode — changes written to guides.db-wal (93K), not the main file.

Queries against the DB confirmed correct values throughout — data was always correct.

WAL checkpoint forced via Node.js:
```js
db.pragma("wal_checkpoint(FULL)")
// Result: { totalPages: 23, movedPages: 23 } — all 23 WAL pages checkpointed
```

Post-checkpoint main DB: 960K, MD5: `7085b33ec5f1cd5f8ea468bcf38f0ffd`

---

## 12 — Post-Patch DB Backup

```
/var/www/guidex/backups/local/guides.db.post-6d-patches-20260807-134006
Size: 960K
MD5: 7085b33ec5f1cd5f8ea468bcf38f0ffd
```

---

## 13 — Post-Patch DB Counts

| Month | Count | Phase 6D added |
|---|---|---|
| July 2026 | 10 | 0 (preserved) |
| August 2026 | 15 | +7 |
| September 2026 | 16 | +8 |
| October 2026 | 26 | +12 |
| November 2026 | 19 | +2 |
| December 2026 | 11 | +1 |
| **Total new (Phase 6D)** | | **26** |

---

## 14 — Build

```
npm run build
Result: 92/92 static pages generated, 0 TypeScript errors, 0 build warnings.
```

Build performed while PM2 was serving traffic (zero downtime during build).

---

## 15 — PM2 Zero-Downtime Reload

```
pm2 reload guidex-production --update-env
Result: 1 restart total (the reload). 0 unstable restarts.
```

Startup log: `2026-08-07T10:07:50: Next.js 16.2.3 — Ready in 151ms`

---

## 16 — PM2 Error Log

Error log empty. No exceptions, DB errors, missing routes, or repeated restarts observed.

---

## 17 — Live QA: Richard Marx (OCT-06-MARX)

URL: https://guidex-consulting.ae/calendar/october-2026-dubai-calendar

| Check | Result |
|---|---|
| Dead URL event/105069 present | 0 refs — PASS |
| CCA official URL refs | 8 refs — PASS |
| Date shown | "3 October 2026" — PASS |
| Platinumlist refs (other events) | 38 refs (expected — from other Oct events) |

---

## 18 — Live QA: Boris Grebenshikov Date Fix

- "29 October 2026" present: PASS
- Venue: The Agenda, Dubai Media City: PASS

---

## 19 — Live QA: GITEX Split Venue (DEC-04-GITEX)

URL: https://guidex-consulting.ae/calendar/december-2026-uae-calendar

| Check | Result |
|---|---|
| DWTC refs | 10 — PASS |
| Scale Summit refs | 6 — PASS |
| Old label "at Expo City Dubai (7-11 December)" | NOT present — PASS |

---

## 20 — Live QA: F1 Race Dates (DEC-03-F1)

URL: https://guidex-consulting.ae/calendar/december-2026-uae-calendar

- "Dec 5-7" stale claim: NOT present — PASS
- Correct "4-6 December" F1 weekend: PASS
- Page text: "Formula 1 Abu Dhabi Grand Prix follows on 4-6 December at Yas Marina Circuit"

---

## 21 — Live QA: July Calendar Preservation

URL: https://guidex-consulting.ae/calendar/july-2026-dubai-calendar

- HTTP: 200 OK — PASS
- Event items (li count): 10 — PASS (matches pre-deploy baseline)
- "Dubai Summer Surprises" content present: PASS

---

## 22 — Live QA: noindex + X-Robots-Tag

| Page | noindex in HTML | X-Robots-Tag |
|---|---|---|
| october-2026-dubai-calendar | not present | not-set |
| december-2026-uae-calendar | not present | not-set |

Result: INDEXABLE on both pages — PASS

---

## 23 — Live QA: Canonical

- october-2026-dubai-calendar: `canonical href="https://guidex-consulting.ae/calendar/october-2026-dubai-calendar"` — PASS

---

## 24 — Live QA: hreflang

hreflang tags: NOT present on calendar detail pages.

Pre-existing state — not introduced by this deployment. Noted as P2 future improvement.

---

## 25 — Live QA: JSON-LD Structured Data

All sampled calendar pages emit three JSON-LD blocks:
- @type=Organization: Guidex Consulting
- @type=WebSite: Guidex Consulting
- @type=WebPage: page-specific title

No per-event Event schema (not required for calendar hub pages). PASS.

---

## 26 — Live QA: Sitemap

Total calendar loc entries: 22 (11 EN + 11 RU)
EN slugs: all 8 monthly calendars + 3 standalone calendar articles
Lastmod: derived from DB updated_at (per-record, accurate). PASS.

---

## 27 — Blockers Found and Resolved

**Blocker 1: Production git divergence**
- Symptom: git pull failed — production at f6e9eae not in origin/main
- Divergent commit: docs only, all files already in origin/main with newer content
- Resolution: git reset --hard origin/main

**Blocker 2: Batch-01 DB path always targeted live DB**
- Symptom: Batch-01 used path.resolve(__dirname, "../data/guides.db") — no env var override
- Resolution: Added GUIDEX_DB_PATH env var to all 4 scripts (commits 4095631, 5da1015)

**Blocker 3: SQLite WAL mode — post-patch MD5 appeared unchanged**
- Symptom: Main DB file MD5 unchanged after patches; WAL held all changes in guides.db-wal (93K)
- Queries confirmed data was always correct
- Resolution: PRAGMA wal_checkpoint(FULL) via Node.js — 23/23 pages checkpointed

---

## 28 — Rollback Readiness

Pre-deploy backup: `/var/www/guidex/backups/local/guides.db.pre-6d-deploy-20260806-122013`

Rollback procedure:
1. `cp backup-path /var/www/guidex/data/guides.db`
2. `cd /var/www/guidex && git checkout f11ec5b`
3. `npm run build`
4. `pm2 reload guidex-production --update-env`
5. Verify July: 10 items at /calendar/july-2026-dubai-calendar

---

## 29 — GSC Wave 1 URLs (Manual Submission Required)

Do NOT submit automatically. Submit manually in Google Search Console after 24-hour stability window.

Priority 1 (new content pages):
```
https://guidex-consulting.ae/calendar/september-2026-dubai-calendar
https://guidex-consulting.ae/calendar/october-2026-dubai-calendar
https://guidex-consulting.ae/calendar/november-2026-dubai-calendar
https://guidex-consulting.ae/calendar/december-2026-uae-calendar
```

Priority 2 (updated content):
```
https://guidex-consulting.ae/calendar/august-2026-dubai-calendar
```

Priority 3 (corrected event page):
```
https://guidex-consulting.ae/events/gitex-2026
```

---

## 30 — P1 Content Backlog (Out of Scope)

13 calendar items with both brief_en and brief_ru empty — absent from CalendarBriefSection on both EN and RU pages.

Highest priority: OCT-03-VAT, OCT-04-EINV.

Full list: docs/content-drafts/seo/6d-calendar-q3q4-2026-audit.md Section 15.

Deferred to a future phase. No action in this deployment.

---

## 31 — Deployment Verification Summary

| Mandatory check | Result |
|---|---|
| Richard Marx dead URL gone | PASS |
| F1 race dates correct (4-6 Dec) | PASS |
| July 10 items preserved | PASS |
| noindex absent (Oct, Dec) | PASS |
| X-Robots-Tag absent | PASS |
| Canonical correct | PASS |
| JSON-LD on all pages | PASS |
| PM2 zero errors | PASS |
| Sitemap 11 EN + 11 RU cal entries | PASS |
| GITEX split venue correct | PASS |
| Boris Grebenshikov date corrected | PASS |
| hreflang | absent (pre-existing, P2) |

**Overall: PASS — deployment verified live.**

---

## 32 — Production State After Deploy

| Item | Value |
|---|---|
| Commit | `5da1015` |
| Build pages | 92/92 |
| PM2 status | online, 1 restart, 0 unstable |
| DB size | 960K |
| DB MD5 | `7085b33ec5f1cd5f8ea468bcf38f0ffd` |
| Calendar items | Jul=10, Aug=15, Sep=16, Oct=26, Nov=19, Dec=11 |
| Total Phase 6D new items | 26 |
