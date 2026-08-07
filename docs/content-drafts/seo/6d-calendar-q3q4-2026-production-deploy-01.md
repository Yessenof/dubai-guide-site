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
| September 2026 | 16 | +4 |
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

**Correction (6D-CLOSURE-01): the original QA used a lowercase  regex. Next.js App Router emits  (camelCase). Re-audit with correct case.**

Monthly calendar pages (Oct, Dec EN+RU): 3 hreflang tags each — en, ru, x-default. Reciprocal. PASS.
Event pages (GITEX, F1 EN+RU): 3 hreflang tags each — en, ru, x-default. Reciprocal. PASS.
Guide detail pages: 3 hreflang tags each. Reciprocal. PASS.

Hub-page partial hreflang (pre-existing, not introduced by Phase 6D):
- Events hub (/events, /ru/events): 1 hreflang tag each (opposite locale only; missing self-referential and x-default)
- Calendar hub (/calendar, /ru/calendar): 1 hreflang tag each (same pattern)
- EN guides hub (/guides): 0 hreflang tags (RU hub has 3 — asymmetry)

These hub-page gaps are pre-existing Phase 6C implementation issues. P1 backlog item added.

Overall: calendar monthly pages and event pages are CORRECT. Hub pages have a pre-existing partial implementation.

---

## 25 — Live QA: JSON-LD Structured Data

All sampled calendar pages emit three JSON-LD blocks:
- @type=Organization: Guidex Consulting
- @type=WebSite: Guidex Consulting
- @type=WebPage: page-specific title

Event pages emit @type=Event schema (F1, GITEX confirmed).

---

## 25b — Correction: Dedicated F1 Event Page Exists (6D-CLOSURE-01)

The original deployment report stated No dedicated F1 sub-page — F1 content is on the December calendar page only. This was incorrect.

Fact:
- URL: https://guidex-consulting.ae/events/formula-1-abu-dhabi-grand-prix-2026 -> HTTP 200
- RU: https://guidex-consulting.ae/ru/events/formula-1-abu-dhabi-grand-prix-2026 -> HTTP 200
- JSON-LD: @type=Event
- Canonical: self-referential, correct
- hreflang: 3 tags (en, ru, x-default), fully reciprocal
- Race dates: 4-6 December; race day Dec 6 confirmed in page text
- Sitemap: present (EN + RU)
- DEC-03-F1 in December calendar has detail_url=/events/formula-1-abu-dhabi-grand-prix-2026 (internal link active)

Classification: A — dedicated F1 event page exists and is published.
The December calendar page is the calendar owner; the event page is the canonical content destination.

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


---

## 33 — Closure Corrections (6D-PRODUCTION-DEPLOY-CLOSURE-01)

Phase 6D-PRODUCTION-DEPLOY-CLOSURE-01 corrections applied 2026-08-07:

**C1: September event count corrected**
- Deployment summary incorrectly stated Sep +8 (total 30). Correct: Sep +4 (total 26).
- Error source: Phase 6D Stage A verification recorded Sep=8 as pre-6D baseline.
- Actual pre-6D Sep baseline from backup (guides.db.pre-6d-deploy-20260806-122013): 12 items.
- The 4 Phase 6C95/96/97 items (SEP-NEW-01 ATB/Solarstone, SEP-09-AGUILERA Christina Aguilera, SEP-10-OAKENFOLD Paul Oakenfold, SEP-R1 The Corrs) were already live before Phase 6D began.
- Phase 6D added: SEP-6D-01, SEP-6D-02, SEP-6D-03 (Batch-02) + SEP-NEW-DEKA (Batch-03) = 4 items.
- 26 total is correct. Sep month delta was 12->16 (+4).

**C2: Hreflang QA corrected**
- Previous QA used lowercase regex; Next.js App Router emits hrefLang (camelCase).
- Calendar monthly pages: hreflang CORRECT (3 tags, reciprocal, x-default). PASS.
- Event pages: hreflang CORRECT. PASS.
- Hub pages: pre-existing partial implementation (not introduced by Phase 6D). P1 backlog.

**C3: F1 event page existence corrected**
- Previous report: No dedicated F1 sub-page.
- Correct: /events/formula-1-abu-dhabi-grand-prix-2026 is published, indexed, in sitemap (EN+RU).
- @type=Event JSON-LD present. Dates confirmed correct (4-6 Dec, race day Dec 6).

**C4: GITEX event URL corrected**
- Previous QA tested /events/gitex-2026 (404). Correct slug: gitex-global-2026.
- /events/gitex-global-2026 -> 200. hreflang 3 tags. Canonical correct. DWTC/Scale Summit/Expo City content present.

**C5: Memory-guard.sh root cause**
- Script at /var/www/guidex/.claude/memory-guard.sh has correct permissions (-rwxr-xr-x).
- Script runs correctly on the production server (exit code 0).
- The Operation not permitted error was in the LOCAL Mac Claude Code session due to macOS TCC (Transparency, Consent, and Control) filesystem access restriction.
- The entire local filesystem was inaccessible in that session (even  failed).
- Fix: grant Claude Code Full Disk Access in macOS System Settings > Privacy & Security > Full Disk Access.
- No script change needed. No production change needed.

**Pre-6D baseline correction:**
| Month | Documented pre-6D | Actual pre-6D (from backup) | Phase 6D new |
|---|---|---|---|
| July | 10 | 10 | 0 |
| August | 8 | 8 | +7 |
| September | 8 (WRONG) | 12 | +4 |
| October | 14 | 14 | +12 |
| November | 17 | 17 | +2 |
| December | 10 | 10 | +1 |
| **Total** | **67** | **71** | **26** |
