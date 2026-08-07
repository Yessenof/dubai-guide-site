# Phase 6D-AUG-NEW-02-SOURCE-LABEL-FIX-01
## AUG-NEW-02 — Source Label / URL Consistency Micro-Hotfix

**Hotfix date:** 2026-08-07
**Phase tag:** 6D-AUG-NEW-02-SOURCE-LABEL-FIX-01
**Status:** CLOSED — DEPLOYED — VERIFIED

---

## 1 — Defect Found

A read-only consistency check on `AUG-NEW-02` (performed immediately after
6D-MAWLID-OFFICIAL-CONFIRMATION-HOTFIX-01) found that `source_label_en` /
`source_label_ru` named **UAE Government Media Office** as the linked
authority, while `source_url` / `cta_url` pointed to **u.ae** (UAE
Government Portal) — the general public-holidays reference page, not a
Media Office announcement or press release. The label attributed one
authority while the link resolved to another.

Root cause: the prior hotfix (6D-MAWLID-OFFICIAL-CONFIRMATION-HOTFIX-01)
updated `source_label_en/ru` to name the announcing authority (UAE
Government Media Office) but deliberately left `source_url`/`cta_url`
pointing at u.ae, the more stable permanent reference — no Media Office
URL was ever captured. That decision (documented in
`6d-mawlid-official-confirmation-hotfix-01.md` §4) created the mismatch.

---

## 2 — Approved Correction

Two fields only, on `AUG-NEW-02` in `august-2026-dubai-calendar`:

| Field | Old value | New value |
|---|---|---|
| `source_label_en` | `UAE Government Media Office · Cabinet Resolution No. 27/2024` | `UAE Government Portal · Cabinet Resolution No. 27/2024` |
| `source_label_ru` | `Медиа-офис правительства ОАЭ · Постановление Кабинета № 27/2024` | `Правительство ОАЭ · Постановление Кабинета № 27/2024` |

The label now accurately identifies the actual link destination (u.ae /
UAE Government Portal). The Media Office attribution remains intact as
prose inside `brief_en`/`brief_ru` ("The UAE Government Media Office
confirmed on 7 August 2026 that...") — that text is not a clickable
label, so no mismatch exists there.

Fields explicitly protected and verified unchanged: `date` (2026-08-28),
`confidence` (confirmed), `source_status` (confirmed), `source_url`,
`cta_url`, `brief_en`, `brief_ru`, all other `AUG-NEW-02` fields, and all
other August 2026 calendar items.

---

## 3 — Production Access Path

The previously-documented `scripts/db-backup-from-server.sh` targets a
**decommissioned** Cloudways host (`165.245.187.15`, decommissioned April
2026 per the UpCloud migration) and its SSH ControlMaster socket does not
exist in this environment — attempting it produced a host-key mismatch,
correctly refused rather than bypassed. Actual production is the UpCloud
VPS at `85.9.203.69` (`root@85.9.203.69`, app at `/var/www/guidex`), which
was reachable via existing key-based SSH auth with no password prompt.
This matches `PROJECT_STATE.md`'s documented deployment target and the
paths used in the immediately-prior Mawlid hotfix.

---

## 4 — Patch Script

`scripts/patch-aug-new-02-source-label-fix.ts`

- Targets only `AUG-NEW-02` in `august-2026-dubai-calendar`
- Refuses to run if `AUG-NEW-02` appears more than once (ambiguous-update guard)
- Asserts protected invariants (date=2026-08-28, confirmed, source_url/cta_url=u.ae) before any write
- Asserts old label values before mutation
- Verifies both new label values and all protected invariants after write
- Snapshots the entry before/after (minus the two label fields) and aborts if anything else changed in memory
- Runs `PRAGMA integrity_check`
- Idempotent: second run detects already-applied state and skips

---

## 5 — Rehearsal

Rehearsed against a fresh copy of the actual production DB (pulled via
`scp` from `/var/www/guidex/data/guides.db`), not the stale local
`data/guides.db` (which predates both hotfixes and still reads
`2026-08-25`/`expected`).

Rehearsal copy MD5 before patch: `c09f358ff2b75ac7f87ecf87ca9805a9` —
matches the post-checkpoint MD5 recorded at the close of
6D-MAWLID-OFFICIAL-CONFIRMATION-HOTFIX-01, confirming the rehearsal copy
was byte-identical to true production state.

- First run: PASS — labels updated, all protected fields verified unchanged, integrity ok.
- Second run: PASS — no-op, integrity ok.

---

## 6 — Production Patch

Command:
```
GUIDEX_DB_PATH=/var/www/guidex/data/guides.db npx tsx scripts/patch-aug-new-02-source-label-fix.ts
```

First run: PASS. Backup created at
`/var/www/guidex/backups/local/guides.db.pre-aug-new-02-source-label-fix-2026-08-07T13-15-03`.
Both labels updated; all protected invariants (date, confidence,
source_status, source_url, cta_url, brief_en, brief_ru) verified
unchanged; August count = 15; no duplicate IDs; integrity_check = ok.

Second run: PASS. No-op. Idempotency confirmed.

Affected rows: exactly 1 (`AUG-NEW-02`, within the single
`calendar_pages` row for slug `august-2026-dubai-calendar`). Affected
columns: exactly 2 (`source_label_en`, `source_label_ru`).

WAL checkpoint after patch: `{ busy: 0, log: 0, checkpointed: 0 }`
(clean — no pending WAL frames).

Post-checkpoint DB MD5: `0d0bb71c7d553523b2b417ba6d185a10`

---

## 7 — Build & Deploy

No code, schema, or route logic changed — DB content only. The calendar
detail route has no `revalidate` export and no `generateStaticParams`
entries, matching the fully-static rendering behavior already established
in the prior Mawlid hotfix (which required a rebuild for a DB-only change
to reach the live page). The same step was applied here:

```
npm run build   → success, no new errors
pm2 reload guidex-production --update-env → online, 0 unstable restarts
```

---

## 8 — Live EN QA

URL: `https://guidex-consulting.ae/calendar/august-2026-dubai-calendar`

(Verified via direct `curl`, not the WebFetch tool — WebFetch's 15-minute
per-URL cache had already served this exact page during the earlier
read-only investigation and returned stale content on first check.)

| Check | Result |
|---|---|
| HTTP 200 | PASS |
| `28 August 2026` present | PASS |
| `25 August 2026` / `Expected on 25 August` absent | PASS |
| Old label `UAE Government Media Office · Cabinet Resolution No. 27/2024` absent | PASS |
| New label `UAE Government Portal · Cabinet Resolution No. 27/2024` present | PASS |
| Source href → exact u.ae URL | PASS |
| CTA label `Official UAE public holidays` present | PASS |
| Brief prose `The UAE Government Media Office confirmed on 7 August 2026...` intact | PASS |

**PASS.**

---

## 9 — Live RU QA

URL: `https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar`

| Check | Result |
|---|---|
| HTTP 200 | PASS |
| `28 августа` present | PASS |
| `25 августа` absent | PASS |
| Old label as a standalone source-label string absent | PASS |
| New label `Правительство ОАЭ · Постановление Кабинета № 27/2024` present | PASS |
| Source href → exact u.ae URL | PASS |
| CTA label `Праздники ОАЭ (официально)` present | PASS |
| Brief prose `Медиа-офис правительства ОАЭ подтвердил 7 августа 2026 года...` intact (this is prose, not a link label — correctly preserved) | PASS |

**PASS.**

---

## 10 — Regression Check

- `AUG-NEW-02` still appears correctly on the August 2026 calendar. PASS
- Date did not revert to 25 August. PASS
- Other August items (`AUG-NEW-01`, `AUG-NEW-03`, and all 15 IDs) unmodified — spot-checked `source_label_en` on `AUG-NEW-01` (`Etihad Arena: official + Yas Bay`) and `AUG-NEW-03` (`Platinumlist + The National UAE`), both unchanged. PASS
- EN/RU pages render, HTTP 200 both. PASS
- Source-label component (`components/calendar/CalendarBriefSection.tsx`) renders normally for unrelated items — no shared-state or template regression observed. PASS
- No unexpected repository files or DB rows changed: `git status` on server shows only the pre-existing untracked scratch files also present before this session; DB row count for August unchanged at 15; no duplicate IDs. PASS

---

## 11 — Local `data/guides.db` Drift

Local repository DB still reads `date=2026-08-25`, `confidence=expected`,
predating **both** the date-confirmation hotfix and this label hotfix —
it was never touched by either. Coincidentally its `source_label_en`
already reads `UAE Government Portal · Cabinet Resolution No. 27/2024`
(the pre-both-hotfixes value), so no new inconsistency was introduced by
this task.

- Does it participate in the production deploy process? **No.** `data/guides.db` is git-ignored (`.gitignore` lines 51–54) and production is patched exclusively via SSH-executed scripts targeting `GUIDEX_DB_PATH=/var/www/guidex/data/guides.db` on the server — the local file is never pushed, pulled, or synced automatically in either direction.
- Does it present an immediate deployment hazard? **No**, given the above. It remains a **pre-existing** staleness item (missing both the 25→28 Aug date confirmation and unrelated to this label fix) that a future session should refresh via `./scripts/db-backup-from-server.sh` — but that script currently points at the decommissioned Cloudways host and needs its `SERVER`/`SERVER_DB` updated to the UpCloud target before it will work. Flagged as a separate follow-up, not addressed in this micro-hotfix.

---

## 12 — Files Changed

- `scripts/patch-aug-new-02-source-label-fix.ts` (new)
- `docs/content-drafts/seo/6d-aug-new-02-source-label-fix-01.md` (this file)
- `PROJECT_STATE.md`, `SESSION_LOG.md`, `CHECKPOINTS.md`, `NEW_CHAT_TRANSFER.txt` (memory maintenance)

No application code, schema, route, or component files changed.

---

## 13 — Git

- Branch: `main`
- Starting HEAD: `991b501`
- Implementation commit: `e6ef153` — `fix: AUG-NEW-02 source-label-url mismatch micro-hotfix (6D-AUG-NEW-02-SOURCE-LABEL-FIX-01)`
- Pushed to `origin/main` before production pull, per established workflow (code source of truth = GitHub, production pulls from GitHub).
- Documentation commit: this session, pushed separately.
- Production HEAD after `git pull --ff-only`: `e6ef153` (clean fast-forward, no conflicts).

---

## 14 — Production Health

- `pm2` status: `guidex-production` online, 0 unstable restarts after reload.
- No rollback required.
- Pre-patch production backup retained at `/var/www/guidex/backups/local/guides.db.pre-aug-new-02-source-label-fix-2026-08-07T13-15-03`.

---

## 15 — Remaining Issues

- `scripts/db-backup-from-server.sh` (and by extension the documented backup workflow) references the decommissioned Cloudways host. Needs updating to the UpCloud target (`85.9.203.69`, `/var/www/guidex/data/guides.db`) in a future session — this was worked around manually via direct `scp` for this hotfix's rehearsal step, not fixed at the source.
- Local `data/guides.db` remains stale (pre-dates both August hotfixes). Refresh recommended once the backup script is repaired.
- Freshness Architecture Revision 02 remains PLAN ONLY, as before — not affected by this micro-hotfix.
