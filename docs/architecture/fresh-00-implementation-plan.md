# GUIDEX — FRESH-00 IMPLEMENTATION PLAN

## DATA & SAFETY FOUNDATION — PLAN + LOCAL REHEARSAL DESIGN ONLY

Status: PLAN-ONLY. No production, DB, code, cron, or deploy changes. Written under the approved architecture baseline `docs/architecture/freshness-revision-02-plan.md` (commit `89e33f8`, "Revision 02.1"). This is the one permitted file write for this turn, followed by exactly one docs-only commit.

`IMPLEMENTATION PERFORMED DURING FRESH-00 PLANNING: NONE`

---

## 1. Verdict

`READY FOR FRESH-00 IMPLEMENTATION`

One scope nuance is noted, not a blocker (see §3.1): the approved architecture's phase table (Revision 02.1 §37) describes FRESH-00 as ending with the schema **UpCloud-deployed**. This planning turn's own instructions are explicit that "the production DB is not created in this planning turn." These are not in contradiction — Revision 02.1 §37 describes what FRESH-00 *delivers by the time Track A is done with it*; this document treats "design + local schema + local rehearsal" as this plan's deliverable, and "deploy `freshness.db` to UpCloud" as the first concrete, separately-approved step of FRESH-00 *implementation* (still local-machine-initiated, still no automation wired — matching Revision 02.1 §37's own "no automation wired yet" qualifier for FRESH-00). No architecture text is reinterpreted or changed.

---

## 2. Verified baseline

| Item | Value |
|---|---|
| Branch | `main` |
| Local HEAD | `89e33f8fb5ee95f54d55608bdd73919f0cd4930e` |
| origin/main | `89e33f8fb5ee95f54d55608bdd73919f0cd4930e` |
| Working tree | clean |
| Architecture document commit | `89e33f8` (title: "GUIDEX — FRESHNESS ARCHITECTURE REVISION 02.1", 963 lines, read in full for this plan) |

---

## 3. FRESH-00 exact scope

Per the approved architecture (Revision 02.1 §37) and this turn's instructions, FRESH-00 delivers:

1. Isolated `data/freshness.db` schema — 6 domain tables + 1 migration-tracking table (§7).
2. A deterministic, versioned migration mechanism (§18 below) — not Drizzle Kit, not ad hoc `CREATE TABLE IF NOT EXISTS`.
3. Source registry primitives (`sources`, `source_authority`) sufficient to seed the 7 existing R02 HOLD items + the L1/L2 sources already named in routine docs, as **local fixtures**, not a production write (Revision 02.1 §11.3 item 2 calls this "a backfill, not new discovery capability" — FRESH-00 builds the mechanism and the fixture data; the actual production backfill, which reads live `guides.db`/routine-doc data, is excluded per this turn's non-scope list, §4).
4. Watch-target/fact, observation, change-candidate, and alert primitives — the exact schema from Revision 02.1 §17, translated into this project's Drizzle/TypeScript conventions (§8-§12).
5. Idempotency constraints and enum/state constraints on every table where the architecture specifies them (§13, §15).
6. A DB integrity/backup contract for **local** development use (§17) — production backup wiring (`server-cron-backup.sh` extension) is explicitly deferred per this turn's own §25 instruction.
7. Repeatable test fixtures (§20-§21) — including the AUG-NEW-02 regression pair — validated against the schema's own constraints, not against a rule engine (the rule engine is FRESH-01, §4).
8. A designed (not executed) local rehearsal sequence (§19 below), to be run in the approved implementation turn.

### 3.1 Scope nuance carried from §1

FRESH-00's *local* deliverable (this plan's target) does not include the UpCloud deployment step that Revision 02.1 §37 folds into "FRESH-00." Deployment to UpCloud is proposed as FRESH-00's first implementation sub-step (still no automation, still matching §37's "no automation wired yet"), sequenced immediately after local rehearsal passes, in a turn the owner explicitly approves — not silently bundled into "planning."

---

## 4. Explicit non-scope

Directly from this turn's brief, all confirmed still correct after reading the architecture in full:

- R01/R02 routine integration, GitHub relay, repository-scoped credential (Revision 02.1 §18 — explicitly gated on owner sign-off, not a FRESH-00 decision).
- Daily monitoring, automatic due-list generation (T0), live source fetching (T1), the full multi-rule consistency engine (T3) — all FRESH-01/FRESH-02/FRESH-03 per Revision 02.1 §37.
- Telegram alerts / any alert delivery channel (FRESH-04).
- systemd/cron wiring on UpCloud (FRESH-02+).
- Automated consistency scan against production `guides.db` (FRESH-01 builds the script; FRESH-00 only builds the schema it will write into).
- Production watchlist backfill (reading real `calendar_pages`/`events` rows into `freshness_watchlist`) — local fixtures only at FRESH-00.
- Production correction of any kind.
- JSON/JSONL machine-contract migration (Revision 02.1 §16 — Track B priority 1, after Track A's gate).
- Guide-field freshness (Revision 02.1 §46 — still honestly out of scope, unsolved by any near-term phase).
- Any Phase 6E content work.

---

## 5. Existing DB/tooling findings

Verified read-only against the current repo state (not from memory):

| Area | Finding |
|---|---|
| `data/` layout | Contains only `guides.db` + WAL files + ~40 ad hoc `guides.db.backup-*`/`guides.db.pre-*` snapshot files from patch scripts. Nothing else. |
| `.gitignore` | Ignores `data/guides.db`, `-shm`, `-wal`, `data/guides.db.backup-*`. **Does not** match the `.pre-*` naming variant several scripts also use (`git check-ignore -v` confirms exit code 1 — untracked by luck, not by pattern). FRESH-00 must add explicit `data/freshness.db*` entries rather than assume existing globs cover it (§17). |
| DB connection pattern | `lib/db/connection.ts` — single module-level singleton, `new Database(DB_PATH)`, `pragma("journal_mode = WAL")`, `pragma("foreign_keys = ON")`, wrapped in `drizzle(sqlite, {schema})`. `GUIDEX_DB_PATH` is **not** read here — it's hardcoded to `data/guides.db`. `GUIDEX_DB_PATH` is instead an override pattern used only inside standalone patch scripts that open their own raw connection. |
| Drizzle | `drizzle.config.ts` exists and points at `lib/db/schema.ts` / `./data/guides.db`, but **no `drizzle/` migrations directory exists anywhere in the repo** — Drizzle Kit has never actually been run. Real schema changes go through a hand-written raw-SQL file (`scripts/migrate-add-news-events-calendar.sql`, `CREATE TABLE IF NOT EXISTS` + indexes, no version tracking), applied manually. |
| Schema style | `lib/db/schema.ts` uses `text("id").primaryKey()` (app-generated string IDs, never integer autoincrement), `text()` timestamp columns (not Drizzle's `timestamp` mode), booleans as `integer(col, {mode:"boolean"})`, and every text column gets `.notNull().default("")` instead of nullable. CHECK constraints exist only at the raw-SQL level, not expressed in `schema.ts` (this Drizzle sqlite-core version has no first-class CHECK helper). |
| Patch script convention | Raw `better-sqlite3`, `GUIDEX_DB_PATH` env override, own `pragma()` calls, `copyFileSync` backup-before-write to `backups/local/`, post-write `SELECT`-and-assert verification, `pragma("integrity_check")` asserted `=== "ok"` at the end, app-level "already present, skip" idempotency (no `INSERT OR IGNORE`/`ON CONFLICT` in the sampled scripts), no explicit `db.transaction(...)` wrapping. |
| Backup scripts | `db-backup-from-upcloud.sh`, `db-restore-to-upcloud.sh`, `deploy/scripts/server-cron-backup.sh` all hard-code the literal filename `guides.db` in multiple places — no generic multi-DB loop exists. Adding `freshness.db` support means parameterizing or duplicating, not a one-line change. Confirmed out of scope for this turn (§4). |
| Test infrastructure | **None.** No `jest`/`vitest`/`mocha`/`ava`/`tap` dependency, no `test` script in `package.json`. `playwright` is a devDependency but has no config and no spec files — unused. Verification today is one-off `scripts/verify-*.ts`/`scripts/qa-*.ts` files run manually. |
| Validation library | **None.** No `zod`/`valibot`/`ajv`/`yup`. `lib/admin-validation/news-events-calendar.ts` and `lib/ai/editor-schemas.ts` both hand-write validators: regex constants, small coercion helpers, functions returning `string \| null` or `{ok, errors, warnings}`, literal-union arrays for enums. |
| Script execution | Every script (60+ files) is run ad hoc via `npx tsx scripts/<name>.ts`. **No `db:*`/`migrate:*`/`backup:*` npm scripts exist anywhere** — nothing in `scripts/` is wired into `package.json`. |
| `next.config.ts` | Confirmed: `serverExternalPackages: ["better-sqlite3"]` present. |

---

## 6. Chosen migration approach

Four options evaluated (per this turn's §18 instruction):

| Option | Verdict |
|---|---|
| A. Hand-written versioned SQL migrations, no runner | Matches the closest existing precedent (`migrate-add-news-events-calendar.sql`) but inherits its main weakness: `CREATE TABLE IF NOT EXISTS` has no version tracking, so there's no reliable way to know which migrations have run against a given file. |
| B. Drizzle Kit dedicated config | Already configured (`drizzle.config.ts`) but has zero actual usage anywhere in the project's history — no `drizzle/` folder exists. Introducing real Drizzle Kit usage now, for one isolated file, means exercising a tool nobody on this project has actually run, with its own diffing/snapshot behavior to learn under production risk. Rejected for FRESH-00 on the same "don't introduce unnecessary new tooling" grounds Revision 02.1 §20 used to reject systemd over cron. |
| **C. Deterministic TypeScript migration runner + hand-written versioned `.sql` files + a `schema_migrations` tracking table** | **Chosen.** Closest to the project's real, proven pattern (raw SQL DDL, deterministic TS script, assert-before/verify-after discipline) while fixing option A's one real gap — repeatability is now provable (`SELECT version FROM schema_migrations`), not assumed. |
| D. Other project pattern | No other pattern exists to draw from — options A-C exhaust the credible choices found in the repo. |

`freshness.db` migrations are never entangled with `guides.db`'s (no shared runner, no shared config, no shared migration-tracking table) — `guides.db` keeps its existing raw-SQL, no-version-tracking convention untouched, exactly as Revision 02.1 §19 requires ("Drizzle Kit migrations are finally usable here... scoped only to `freshness.db`, never retroactively to `guides.db`" — this plan goes one step more conservative than even that: not Drizzle Kit, a lighter deterministic runner, for the reasons in row B above).

---

## 7. Proposed schema

Six domain tables, matching Revision 02.1 §17 exactly in shape, plus one migration-tracking table. No table beyond these six is proposed — a generic `freshness_audit_events` table (named as an option in this turn's §6) is deliberately **not** added: `freshness_observations` is already an append-only evidence log (§10), and `freshness_change_candidates` already carries its own review audit columns (`reviewed_by`, `reviewed_at`, `closed_reason`) per Revision 02.1 §17's own design intent ("this three-way split is what makes manual-hotfix reconciliation representable"). Adding a seventh generic audit table would duplicate that trail without adding information — rejected per this turn's "do not inflate the schema unnecessarily" instruction (§6).

```sql
-- 0001_init.sql

CREATE TABLE schema_migrations (
  version     INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  applied_at  TEXT NOT NULL
);

CREATE TABLE sources (
  id                     TEXT PRIMARY KEY,
  source_entity          TEXT NOT NULL,
  source_kind            TEXT NOT NULL CHECK (source_kind IN
                            ('government','organizer','venue','ticketing','media',
                             'verified_social','aggregator','unverified_social')),
  canonical_hostnames    TEXT NOT NULL,              -- JSON array, validated in app code (§14)
  label_en               TEXT NOT NULL,
  label_ru               TEXT NOT NULL DEFAULT '',
  verified_social_handle TEXT NOT NULL DEFAULT '',
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

CREATE TABLE source_authority (
  id               TEXT PRIMARY KEY,
  source_id        TEXT NOT NULL REFERENCES sources(id),
  fact_class       TEXT NOT NULL,
  authority_level  TEXT NOT NULL CHECK (authority_level IN
                     ('primary','secondary','corroborating','discovery_only')),
  created_at       TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_source_authority ON source_authority(source_id, fact_class);

CREATE TABLE freshness_watchlist (
  id              TEXT PRIMARY KEY,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('calendar_item','event','guide_field')),
  entity_ref      TEXT NOT NULL,
  fact_key        TEXT NOT NULL,
  check_frequency TEXT NOT NULL CHECK (check_frequency IN
                    ('daily','weekly','monthly','quarterly','manual_only')),
  next_check_due  TEXT NOT NULL,                     -- date-only, 'YYYY-MM-DD' (§14)
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','resolved','archived')),
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_watchlist_identity ON freshness_watchlist(entity_type, entity_ref, fact_key);
CREATE INDEX idx_watchlist_due ON freshness_watchlist(status, next_check_due);

CREATE TABLE freshness_observations (
  id               TEXT PRIMARY KEY,
  watchlist_id     TEXT NOT NULL REFERENCES freshness_watchlist(id),
  observation_id   TEXT NOT NULL,                    -- idempotency key, §16's machine contract
  run_id           TEXT NOT NULL DEFAULT '',
  source_id        TEXT REFERENCES sources(id),
  observed_value   TEXT NOT NULL DEFAULT '',
  observed_at      TEXT NOT NULL,
  published_at     TEXT NOT NULL DEFAULT '',
  effective_at     TEXT NOT NULL DEFAULT '',
  result           TEXT NOT NULL CHECK (result IN ('unchanged','changed','unreachable','inconclusive')),
  evidence_ref     TEXT NOT NULL DEFAULT '',
  created_at       TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_observations_observation_id ON freshness_observations(observation_id);
CREATE INDEX idx_observations_watchlist ON freshness_observations(watchlist_id, observed_at);

CREATE TABLE freshness_change_candidates (
  id                         TEXT PRIMARY KEY,
  watchlist_id               TEXT NOT NULL REFERENCES freshness_watchlist(id),
  triggering_observation_id  TEXT REFERENCES freshness_observations(id),
  fact_key                   TEXT NOT NULL,
  old_value                  TEXT NOT NULL DEFAULT '',
  proposed_value              TEXT NOT NULL,
  severity                   TEXT NOT NULL CHECK (severity IN ('info','warning','urgent')),
  verification_status        TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN
                                ('pending','conflict_hold','approved','rejected','applied','superseded')),
  reviewed_by                TEXT NOT NULL DEFAULT '',
  reviewed_at                TEXT NOT NULL DEFAULT '',
  applied_at                 TEXT NOT NULL DEFAULT '',
  closed_reason              TEXT NOT NULL DEFAULT '',
  created_at                 TEXT NOT NULL,
  updated_at                 TEXT NOT NULL
);
CREATE INDEX idx_candidates_watchlist ON freshness_change_candidates(watchlist_id);
CREATE INDEX idx_candidates_status ON freshness_change_candidates(verification_status);

CREATE TABLE freshness_alerts (
  id                   TEXT PRIMARY KEY,
  change_candidate_id  TEXT NOT NULL REFERENCES freshness_change_candidates(id),
  severity             TEXT NOT NULL CHECK (severity IN ('info','warning','urgent')),
  delivery_channel     TEXT NOT NULL DEFAULT '',
  delivered_at         TEXT NOT NULL DEFAULT '',
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','acknowledged','resolved')),
  created_at           TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_alerts_candidate ON freshness_alerts(change_candidate_id);
CREATE INDEX idx_alerts_status ON freshness_alerts(status);
```

**Deviation from the architecture doc's SQL sketch, and why:** Revision 02.1 §17 writes timestamp defaults as `DEFAULT (datetime('now'))`. This plan does not use that default — see §14 (Temporal Semantics) for the reasoning: it would produce a different string format than every other table in this project's actual `guides.db` schema, breaking cross-table sort/parse consistency for no benefit.

**CHECK constraints kept to single-column enums only**, matching the one precedent that exists in this repo (`scripts/migrate-add-news-events-calendar.sql`'s `CHECK (status IN (...))` style). Cross-column invariants (e.g. "`applied_at` must be set when `verification_status='applied'`") are recommended as **application-layer validation** in `lib/freshness/validation.ts`, not SQL CHECK — SQLite supports table-level CHECK expressions, but no existing script in this project uses one, and introducing the pattern here for FRESH-00 would be exactly the kind of one-off convention CLAUDE.md's "don't overengineer" rule warns against. Flagged as revisitable in FRESH-01 if application-layer enforcement proves insufficient.

---

## 8. Source model

Four dimensions, per Revision 02.1 §6.1 — `source_entity` (identity), `source_kind` (type), `authority_level` (per fact-class, via `source_authority`), `source_role` (per-citation, not stored as a table — it's a property of *how* a specific `freshness_observations`/`freshness_change_candidates` row cites a source, not of the source itself, so it lives as context in `evidence_ref`/application logic, not as a fifth column bolted onto `sources`). This matches the architecture's explicit warning against collapsing these dimensions back into one field (§6.1: "Do not collapse these back into one `source_level` column") — FRESH-00's schema keeps them structurally separate: `sources.source_kind` (one value per source) vs. `source_authority.authority_level` (one value per source **per fact_class**, via a join table, so the same source can be `primary` for one fact class and `discovery_only` for another).

`canonical_hostnames` is stored as a JSON-encoded array in a TEXT column (matching the project's existing `dates_json`-style convention for structured data inside SQLite TEXT columns) rather than a normalized child table — justified because hostnames are read as a whole set on every lookup (never queried individually), so a normalized table would add a join with no query benefit at this scale. Validated on write via `lib/freshness/validation.ts` (§24), not a DB constraint (SQLite has no native JSON-array-shape CHECK).

---

## 9. Watch/fact model

Stable identity contract, resolving this turn's §8 open question concretely: **`(entity_type, entity_ref, fact_key)` as three separate columns**, not a single composite string. The architecture's own schema (Revision 02.1 §17) already decomposed it this way; this plan keeps that decomposition rather than the single-string form suggested as an example in this turn's brief (`"guide:<slug>:<fact-key>"`), because separate columns are directly indexable/queryable without string-parsing, and the `UNIQUE(entity_type, entity_ref, fact_key)` index (§7) enforces the identity contract at the DB level rather than relying on convention alone.

Per-type `entity_ref` convention (must be fixed now — changing it later invalidates uniqueness history):

| `entity_type` | `entity_ref` convention | `fact_key` example |
|---|---|---|
| `calendar_item` | The calendar item's stable id as already used in `dates_json` (e.g. `"AUG-NEW-02"`) | `"date"`, `"source_status"` |
| `event` | The `events` table's primary key (string id), no added prefix — `entity_type` already disambiguates | `"date_start"`, `"venue"` |
| `guide_field` | The guide's slug (e.g. `"employment-visa"`) | `"step-3.cost"` — composite fact_key carries the field-level distinction; not built at FRESH-00 (guide-field freshness is out of scope, §4) but the convention is fixed now so it doesn't need to be invented under time pressure later |

---

## 10. Observation model

`freshness_observations` is append-only — no `UPDATE` statements are ever issued against it in any script this plan proposes, matching Revision 02.1 §17's explicit design intent ("the raw evidence log... never edited"). `observation_id` is the idempotency key (§13), independent of the row's own `id` primary key, because `observation_id` is defined by the *machine contract* (Revision 02.1 §16 — currently the MVP Markdown-parsing bridge, later JSON/JSONL) and must be derivable identically on a re-run of the same ingestion input, whereas the row `id` is FRESH-00-internal and only needs to be unique, not re-derivable.

---

## 11. Change-candidate model

`freshness_change_candidates` separates *evidence* (`triggering_observation_id`, nullable — a consistency-engine-generated candidate, FRESH-01, has no single triggering observation) from *decision* (`verification_status`, `reviewed_by`, `reviewed_at`) from *outcome* (`applied_at`, `closed_reason`). This three-way split inside one table (rather than the observation/candidate/alert three-table split alone) is what makes Revision 02.1 §45's manual-hotfix reconciliation representable without deleting anything: closing a candidate as `superseded_by_manual_hotfix` is one `UPDATE` on `verification_status`/`closed_reason`/`reviewed_at`, and the row remains queryable history forever.

---

## 12. Alert/review model

`freshness_alerts` is a pure delivery record, one row per candidate (`UNIQUE(change_candidate_id)`, §7) — re-running the (not-yet-built, FRESH-04) alert-generation step against an already-alerted candidate is a no-op by constraint, not by application logic remembering to check first. `status` (`pending`/`acknowledged`/`resolved`) tracks delivery/human-attention state, distinct from `freshness_change_candidates.verification_status` (approval state) — Revision 02.1 §31's "silence is never approval" rule is enforced structurally: an alert can sit `pending` indefinitely while its candidate also sits `pending`, and nothing in this schema ever auto-transitions either field.

---

## 13. Audit/reconciliation model

No separate table (§7's rejection of a generic `freshness_audit_events` table). The audit trail is the union of:
- `freshness_observations` (immutable evidence log, one row per observation, never deleted or edited);
- `freshness_change_candidates`'s own lifecycle columns (`reviewed_by`, `reviewed_at`, `applied_at`, `closed_reason`) — a full decision history per candidate;
- `schema_migrations` (which migrations ran, when) — infrastructure-level audit, not domain-level.

**Worked reconciliation example** (AUG-NEW-02, per Revision 02.1 §41/§45), demonstrating the schema supports it without new tables:

```
-- before hotfix
freshness_change_candidates: id=c1, watchlist_id=w1, verification_status='conflict_hold',
  proposed_value='label=UAE Government Media Office', old_value='label=UAE Government Portal'

-- owner applies the approved hotfix to guides.db (existing patch-script pattern, unchanged)

-- reconciliation step (a FRESH-05 patch-script extension, not built at FRESH-00 — schema only)
UPDATE freshness_change_candidates
SET verification_status = 'superseded', closed_reason = 'superseded_by_manual_hotfix',
    reviewed_by = 'owner', reviewed_at = '<now>', updated_at = '<now>'
WHERE id = 'c1';

UPDATE freshness_watchlist
SET next_check_due = '<next cadence date per §22 of the architecture>', updated_at = '<now>'
WHERE id = 'w1';

-- freshness_observations rows referencing w1 are untouched — full history preserved
```

---

## 14. State machines

**`freshness_watchlist.status`**: `active → resolved`, `active → archived`, `resolved → archived`. No `resolved → active` or `archived → *` transition is proposed — reopening a resolved/archived fact means creating a new watchlist row (matching the append-only bias of the rest of this schema), not reviving an old one. Enforced at the application layer (§7's CHECK is single-column enum only, not a transition-aware constraint — SQLite CHECK cannot see the previous row value on `UPDATE`).

**`freshness_observations.result`**: no transitions — each row is a terminal fact about one observation event, never updated after insert.

**`freshness_change_candidates.verification_status`**: `pending → conflict_hold`, `pending → approved`, `conflict_hold → approved`, `conflict_hold → rejected`, `pending → rejected`, `approved → applied`, and `{pending, conflict_hold, approved} → superseded` (manual hotfix, §13). `rejected`, `applied`, and `superseded` are terminal — no transition out of any of them is proposed. Enforced at the application layer for the same reason as above.

**`freshness_alerts.status`**: `pending → acknowledged`, `pending → resolved`, `acknowledged → resolved`. No transition back to `pending`.

---

## 15. Idempotency model

| Concern | Mechanism |
|---|---|
| Duplicate observation import (same ingestion run processed twice) | `UNIQUE(observation_id)` on `freshness_observations` — a second insert with the same `observation_id` fails at the DB level, not just app-level convention |
| Duplicate watchlist row for the same fact | `UNIQUE(entity_type, entity_ref, fact_key)` on `freshness_watchlist` |
| Duplicate alert for the same candidate | `UNIQUE(change_candidate_id)` on `freshness_alerts` |
| Duplicate change candidate from the same trigger | **Not** enforced by a DB unique constraint (a candidate can legitimately arise from a consistency-engine rule with no single triggering observation, so `triggering_observation_id` is nullable and can't carry a uniqueness index alone). App-level check instead: before inserting a new candidate for a `(watchlist_id, fact_key)` pair, check for an existing row with `verification_status IN ('pending','conflict_hold')` and update/skip rather than insert a duplicate open candidate — same "already present, skip" idiom the existing patch scripts already use (§5) |
| Migration re-run | `schema_migrations` tracks applied `version`s; `migrate.ts` skips any version already recorded (§18) |

---

## 16. Temporal semantics

| Field | Type | Convention |
|---|---|---|
| `observed_at`, `published_at`, `effective_at` (when a full timestamp is known), `reviewed_at`, `applied_at`, `delivered_at`, `created_at`, `updated_at` | Full timestamp, TEXT | `new Date().toISOString()` — UTC, `T`/`Z` format — written by application code at insert/update time, matching the actual convention already used across the rest of this project's schema (verified in §5; **not** SQLite's `DEFAULT (datetime('now'))`, which produces `YYYY-MM-DD HH:MM:SS` with no `T`/`Z` and would silently mix two timestamp formats across `freshness.db` vs. `guides.db`) |
| `next_check_due`, and `effective_at` when it represents a pure calendar date rather than a moment (e.g. a holiday date, not "when we observed it") | Date-only, TEXT | Plain `'YYYY-MM-DD'`, no time component, no timezone conversion applied. This directly satisfies this turn's §14 requirement ("UAE timezone-sensitive event dates must not accidentally shift because of UTC conversion") — a date-only field is never constructed by slicing a `Date` object that was built from a UAE-local wall-clock date without explicit handling; it is written and compared as a naive calendar-date string throughout |

---

## 17. Proposed repository files

Not created in this turn (per §1's constraint) — exact paths for the approved implementation turn:

```text
lib/freshness/
  schema.ts          -- Drizzle table defs, matching lib/db/schema.ts conventions
  connection.ts       -- module-level singleton, mirrors lib/db/connection.ts exactly
  types.ts             -- TS types: WatchTarget, Observation, ChangeCandidate, Alert,
                          MachineContract record shape (Revision 02.1 §16)
  validation.ts        -- hand-written validators, mirrors lib/admin-validation style

scripts/freshness/
  migrations/
    0001_init.sql       -- schema from §7
  migrate.ts             -- applies pending migrations, records into schema_migrations
  integrity-check.ts      -- PRAGMA integrity_check wrapper, standalone-callable
  seed-fixtures.ts        -- seeds a local/test DB with the source registry + AUG-NEW-02
                              fixture pair (§20-21) — never targets a production path

tests/freshness/
  fixtures/
    sources-seed.json
    aug-new-02-bad.json
    aug-new-02-good.json
    (additional fixture files per §21)
  schema.test.ts        -- migration applies cleanly to an empty DB; constraints enforced
  idempotency.test.ts    -- duplicate observation_id / watchlist identity / alert rejected
  lifecycle.test.ts       -- state-machine transitions (§14) allowed/rejected as designed
  fixtures.test.ts        -- fixture data inserts cleanly and round-trips (not a rule-engine test)
```

`data/freshness.db` itself is never checked in (gitignored, §25) and is not one of these files — it is generated by running `migrate.ts` locally.

Also required (a `.gitignore` edit, not a new file): extend the existing SQLite block (lines 50-58) with `data/freshness.db`, `data/freshness.db-shm`, `data/freshness.db-wal`, `data/freshness.db.backup-*` — the current `guides.db`-specific globs do not cover a same-named `freshness.db` file (§5).

---

## 18. Proposed package scripts

Not added in this turn. Recommended for the implementation turn, though explicitly **optional/non-blocking** — this project has zero precedent for wiring scripts into `package.json` (§5: every one of 60+ scripts is run via bare `npx tsx`), and the future UpCloud cron entries (FRESH-02+) will call `npx tsx scripts/freshness/*.ts` directly, exactly as `server-cron-backup.sh` calls its script directly rather than through npm. Adding these is a convenience, not a requirement:

```json
"freshness:migrate": "tsx scripts/freshness/migrate.ts",
"freshness:integrity": "tsx scripts/freshness/integrity-check.ts",
"freshness:test": "tsx --test tests/freshness/**/*.test.ts"
```

---

## 19. Test strategy

**`node:test`, invoked via `tsx --test`** — this is Revision 02.1 §32's own explicit recommendation ("zero new dependency... matches the 'no unnecessary infrastructure' instruction"), and independently confirmed as the right choice by this turn's own repo research: `tsx` is already a devDependency, no test runner exists to conflict with or migrate away from, and Playwright (the one test-adjacent dependency present) is unconfigured and unrelated (E2E, not unit/schema testing). No new dependency is added.

---

## 20. Fixture inventory

| Fixture | Proves | File |
|---|---|---|
| Pre-fix AUG-NEW-02 record (label="UAE Government Media Office", url=u.ae, not a registered match) | The registry data model can represent a genuine mismatch — **not** that a detection rule catches it (that's FRESH-01) | `aug-new-02-bad.json` |
| Post-fix AUG-NEW-02 record (label="UAE Government Portal", url=u.ae, registered match) | Same data model represents the corrected state cleanly | `aug-new-02-good.json` |
| Duplicate observation (same `observation_id` twice) | `UNIQUE(observation_id)` rejects the second insert | inline in `idempotency.test.ts` |
| Stale/duplicate `run_id` | Schema permits multiple observations sharing a `run_id` without collision (only `observation_id` is unique) | inline in `idempotency.test.ts` |
| Expected → confirmed date transition (two observations, same watchlist row, differing `result`) | Append-only observation log correctly accumulates without needing an `UPDATE` | inline in `schema.test.ts` |
| Confirmed event, later date change | Same as above, for the "confirmed doesn't stop monitoring" case (Revision 02.1 §9/§22) | inline in `schema.test.ts` |
| Conflicting credible sources (two `primary`-authority observations, differing value) | `verification_status='conflict_hold'` is representable and distinct from `pending` | inline in `lifecycle.test.ts` |
| Source URL redirect / evidence vs. CTA URL differing | `source_role` context (§8) doesn't force `source_url = cta_url` — schema doesn't encode a false equality constraint | `sources-seed.json` + narrative test |
| Malformed machine artifact | Out of FRESH-00 scope for the *parser* (FRESH-02), but the target `freshness_observations` shape it must produce is exactly what `schema.test.ts` validates against | `schema.test.ts` |
| Annual-edition collision (same title, two occurrences) | Two distinct `entity_ref` values can coexist for what looks like "the same" event — schema doesn't collapse them | inline in `schema.test.ts` |
| Manual-hotfix reconciliation | The worked example in §13 executes cleanly against the real schema | `lifecycle.test.ts` |
| Unreachable source | `result='unreachable'` is a valid, representable observation outcome | inline in `schema.test.ts` |
| EN/RU source-label identity mismatch | `sources.label_en`/`label_ru` can independently diverge from what a record claims — schema doesn't enforce equality (that's a FRESH-01 rule, not a constraint) | `sources-seed.json` |

No fixture in this list requires real HTML or a network call — every one is a JSON/SQL data shape, matching this turn's own §21 guidance ("do not need full real HTML fixtures in FRESH-00 unless useful").

---

## 21. Local rehearsal sequence

Designed here, **executed only in the approved implementation turn** (per Amendment 2). Every step targets a disposable path — never `data/freshness.db`, never any production path:

```
1. Create a disposable DB: /tmp/freshness-rehearsal-<timestamp>.db
2. Run scripts/freshness/migrate.ts against it — applies 0001_init.sql, records version 1
3. Run scripts/freshness/integrity-check.ts — expect "ok"
4. Inspect schema: sqlite3 <path> ".schema" — confirm all 6 tables + schema_migrations,
   all indexes, all CHECK constraints present as designed in §7
5. Run scripts/freshness/seed-fixtures.ts — inserts sources-seed.json's source/authority
   rows + the AUG-NEW-02 bad/good fixture pair as watchlist+observation rows
6. Insert a second watchlist row manually, confirm UNIQUE(entity_type, entity_ref, fact_key)
   rejects a duplicate
7. Insert an observation, then re-insert the same observation_id — confirm UNIQUE rejects it
8. Create a change candidate from that observation, transition it pending -> conflict_hold
   -> approved -> applied (§14) — confirm each transition succeeds
9. Attempt an invalid transition (e.g. rejected -> approved) at the application layer —
   confirm validation.ts rejects it (schema itself can't prevent this, per §14)
10. Run the manual-hotfix reconciliation worked example from §13 end-to-end
11. Run scripts/freshness/integrity-check.ts again — expect "ok"
12. Run tests/freshness/**/*.test.ts via node:test — all fixtures pass
13. Delete the disposable DB
```

No `guides.db`, no `data/freshness.db`, no SSH, no production path is touched at any step.

---

## 22. Backup/rollback strategy

**Local rehearsal DB**: fully disposable (`/tmp`) — no backup needed, "rollback" is deleting the file and re-running `migrate.ts` from scratch.

**Production `freshness.db` backup**: explicitly deferred. Per this turn's own §25 instruction ("Do not modify `server-cron-backup.sh` yet if that belongs to a later production rollout phase") and Revision 02.1 §19's table (backup extension listed as "extended, not built in this doc-only pass"), FRESH-00 does not touch `server-cron-backup.sh`, `db-backup-from-upcloud.sh`, or `db-restore-to-upcloud.sh`. That work is scoped to the UpCloud-deployment sub-step named in §3.1, not this local-foundation plan.

**Migration rollback**: no `down.sql` files are planned. SQLite `CREATE TABLE`/`CREATE INDEX` migrations are not reliably reversible in general (matching Revision 02.1's own observation that this project already prefers restore-from-backup over scripted down-migrations for `guides.db`). For local dev, "rollback" = delete-and-recreate (§21 step 13). For the future production file, rollback = restore from the same timestamped-backup pattern already proven for `guides.db` — not a new mechanism.

---

## 23. Security boundaries

FRESH-00 (this plan's scope — local schema, local rehearsal) requires **zero** of: SSH key, GitHub push credential, Telegram bot token, Anthropic API key, production DB credentials. Every path touched in §21's rehearsal sequence is a `/tmp` file. `GUIDEX_DB_PATH`-style overrides, if used in `scripts/freshness/migrate.ts` (matching the existing patch-script convention, §5), only ever point at local/disposable paths during this phase — never wired to a production value until the explicitly-approved UpCloud-deployment sub-step (§3.1), which itself still requires no new credential type beyond SSH access the owner already has for `guides.db` (the repository-scoped GitHub credential is FRESH-03 only, per Revision 02.1 §18/§48, and is not touched by this plan).

---

## 24. Validation library recommendation

Continue the project's existing hand-written approach (`lib/admin-validation/news-events-calendar.ts`, `lib/ai/editor-schemas.ts` style: regex constants, small coercion helpers, functions returning `string | null` or `{ok, errors}`) — no new dependency (`zod` etc.) for `lib/freshness/validation.ts` at FRESH-00's scale (six tables, a handful of enums, no deeply nested structures yet). This should be revisited, not assumed forever, if Track B's JSON/JSONL machine contract (Revision 02.1 §16) grows complex enough that hand-written validation becomes the bottleneck — that is a Track B decision, not a FRESH-00 one.

---

## 25. No `guides.db` changes

Confirmed: nothing in this plan touches `lib/db/schema.ts`, `lib/db/connection.ts`, `lib/db/reader.ts`, `lib/db/writer.ts`, or any existing migration file. `lib/freshness/*` is a fully parallel module tree with its own connection singleton (§17) — it does not import from or extend `lib/db/*` in any way. The `.gitignore` edit proposed in §17 only adds new lines for `freshness.db*`; it does not modify the existing `guides.db*` lines.

---

## 26. No public application dependency

Nothing under `app/` is touched or proposed. `lib/freshness/*` is never imported by any route, layout, or component — public pages continue to import only from `lib/db/reader.ts` (CLAUDE.md's locked rule), and would render identically whether or not `data/freshness.db` exists on disk. This is a structural guarantee, not a runtime check: the isolation comes from `lib/freshness/*` having zero inbound imports from `app/`, not from a conditional existence check.

---

## 27. Acceptance criteria

FRESH-00 implementation (the approved next turn) passes when:

- [ ] `migrate.ts` bootstraps a fresh empty DB deterministically (same schema every run).
- [ ] All 6 domain tables + `schema_migrations` exist with the exact columns/CHECK constraints in §7.
- [ ] `UNIQUE(entity_type, entity_ref, fact_key)`, `UNIQUE(observation_id)`, `UNIQUE(change_candidate_id)`, `UNIQUE(source_id, fact_class)` all enforced and tested (§15).
- [ ] All 4 state-machine transition sets (§14) allowed/rejected as designed, tested in `lifecycle.test.ts`.
- [ ] Duplicate observation import is a no-op, not a duplicate row (§21 step 7).
- [ ] Manual-hotfix reconciliation worked example (§13) runs end-to-end against the real schema.
- [ ] All fixtures in §20 load and validate.
- [ ] `PRAGMA integrity_check` returns `ok` after the full rehearsal sequence.
- [ ] Local disposable rehearsal (§21) passes in full, on a `/tmp` path only.
- [ ] Zero changes to `guides.db`, `lib/db/*`, or any `app/` file.
- [ ] `git status` after implementation shows only the files listed in §17 (plus the `.gitignore` edit) — nothing else.
- [ ] No production change of any kind (confirmed by the same read-only git/SSH verification pattern used to close this planning turn).

---

## 28. Risks

| Severity | Risk | Mitigation |
|---|---|---|
| P1 | `.gitignore`'s existing `guides.db.backup-*`-only pattern doesn't cover `freshness.db` artifacts — a stray local DB or backup file could get committed by accident | New explicit `.gitignore` lines proposed in §17, applied before the first local DB is ever created, not after |
| P1 | `entity_ref` convention (§9) is being fixed now, before any real data exists — if it's wrong, every future watchlist row inherits the mistake | Convention deliberately kept minimal and consistent with what the architecture doc already implies (calendar item ids as already used in `dates_json`, DB primary keys for events) rather than inventing a new format; low cost to revise before FRESH-00 has written any real rows, high cost after |
| P2 | `node:test` + `tsx --test` combination has version-sensitive flag behavior across Node releases | Verify the project's actual Node version against `tsx --test` compatibility as the first step of the implementation turn, before writing test files against it |
| P2 | Cross-column state invariants (e.g. `applied_at` required when `verification_status='applied'`) are enforced only at the application layer, not the DB | Explicitly documented as a deliberate scope decision (§7), revisitable in FRESH-01 if application-layer enforcement is bypassed by a future script that writes directly via raw SQL instead of through `validation.ts` |
| P3 | Drizzle Kit remains configured-but-unused after FRESH-00 too (this plan chose option C over option B in §6) | Not a defect — `drizzle.config.ts` continues to describe `guides.db` only; `freshness.db`'s Drizzle schema (`lib/freshness/schema.ts`) is query-builder-only, same relationship `lib/db/schema.ts` already has to real migrations today |

No P0 risk identified — nothing in this plan's scope touches production, `guides.db`, or any credential.

---

## 29. FRESH-01 handoff

Per Revision 02.1 §37, FRESH-01 delivers `scripts/qa-consistency-check.ts` (expanded rule classes, Revision 02.1 §15) running against a **local copy** of production data, verified against the fixture suite this plan builds. Concretely, FRESH-01 consumes from FRESH-00:

- The `sources`/`source_authority` schema and seed data (§8, §20) — FRESH-01's registry-lookup rule (Revision 02.1 §7) reads these tables directly.
- The `aug-new-02-bad.json`/`aug-new-02-good.json` fixture pair (§20) — FRESH-01's acceptance test is exactly "the bad fixture is flagged, the good fixture is not," using the fixtures this plan defines, not new ones.
- The `freshness_change_candidates` table (§7, §11) — FRESH-01's consistency engine writes candidates into it; FRESH-00 does not write to it except via the manual worked example (§13) and test fixtures.

FRESH-01 does **not** need FRESH-00 to have deployed anything to UpCloud first — it can run entirely against a local copy of `guides.db` (read-only) and a local `freshness.db`, matching this plan's own local-only scope. The UpCloud deployment sub-step (§3.1) can therefore be sequenced either before or after FRESH-01 without blocking it — a scheduling flexibility worth noting for the owner, not a claim about which order is better.

---

## 30. Estimated implementation batch size

| File | Est. LOC |
|---|---|
| `lib/freshness/schema.ts` | ~170 |
| `lib/freshness/connection.ts` | ~25 |
| `lib/freshness/types.ts` | ~120 |
| `lib/freshness/validation.ts` | ~150 |
| `scripts/freshness/migrations/0001_init.sql` | ~110 |
| `scripts/freshness/migrate.ts` | ~80 |
| `scripts/freshness/integrity-check.ts` | ~40 |
| `scripts/freshness/seed-fixtures.ts` | ~140 |
| `tests/freshness/fixtures/*.json` (3-4 files) | ~80 combined |
| `tests/freshness/schema.test.ts` | ~100 |
| `tests/freshness/idempotency.test.ts` | ~80 |
| `tests/freshness/lifecycle.test.ts` | ~90 |
| `tests/freshness/fixtures.test.ts` | ~90 |
| `.gitignore` edit | ~4 |
| **Total** | **~13 files, ~1,280 LOC** |

### Recommendation: two checkpoints, not one commit

Split FRESH-00 implementation into two verifiable checkpoints:

**Checkpoint 1 — schema + migrations** (`lib/freshness/schema.ts`, `connection.ts`, `scripts/freshness/migrations/0001_init.sql`, `migrate.ts`, `integrity-check.ts`, `.gitignore` edit — roughly 430 LOC). Independently verifiable on its own: create a disposable DB, migrate, run `integrity_check`, inspect `.schema` — no fixtures or tests required to prove this checkpoint works.

**Checkpoint 2 — fixtures + tests** (`lib/freshness/types.ts`, `validation.ts`, `scripts/freshness/seed-fixtures.ts`, all of `tests/freshness/` — roughly 850 LOC). Depends on checkpoint 1 already being verified; adds the fixture data, the validators the tests exercise, and the actual test suite proving §27's acceptance criteria.

This mirrors the project's established habit (both August hotfixes, the two-turn plan-then-approve pattern already used for Revision 02 itself) of keeping each reviewable unit small enough to verify in isolation before building on top of it. Whether the two checkpoints land as two commits in the same approved implementation turn, or as two separately-approved turns, is the owner's call — this plan recommends the split exists either way, since checkpoint 1 alone gives an early, low-risk verification point before the larger fixtures+tests batch is written.

---

## 31. What FRESH-00 does not claim

Per this turn's §34 instruction, stated explicitly: FRESH-00 completion does not mean monitoring is live, R02 is integrated, alerts are delivered, the consistency engine is deployed, a production `freshness.db` exists, or the Track A gate (Revision 02.1 §37/§38) is satisfied. It means: a schema exists, is migratable, is tested against representative fixtures, and is provably isolated from `guides.db` and the public application. Phase 6E remains blocked until all of FRESH-00 through FRESH-05 are complete (Revision 02.1 §38) — this document advances exactly one of those six phases.

---

## 32. Implementation performed

`NONE`

---

**FRESH-00 IMPLEMENTATION PLAN COMPLETE — AWAITING EXPLICIT IMPLEMENTATION APPROVAL.**
