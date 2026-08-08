// Shared test utilities for tests/freshness/*.test.ts.
//
// Every DB used by these tests lives under os.tmpdir(), never under this
// repo's data/ directory, and is bootstrapped through the real migration
// runner (scripts/freshness/migrate.ts) — never a hand-maintained schema
// copy. See docs/architecture/freshness-revision-02-plan.md and this
// phase's brief §6/§7.
//
// Perf note: running `npx tsx scripts/freshness/migrate.ts` as a subprocess
// per test would be correct but slow (60+ process spawns). Instead this
// module runs the real migration once per process into a template DB, then
// clones that already-migrated file into a fresh, uniquely-named temp
// directory per test via freshTestDb(). Every test still gets its own
// disposable, uncollidable DB path — the schema inside it was produced by
// the real migration runner, not reimplemented.

import Database from "better-sqlite3";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

const createdTestDirs: string[] = [];

export function createTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `guidex-freshness-test-${prefix}-`));
  createdTestDirs.push(dir);
  return dir;
}

/**
 * Removes every temp directory created via createTempDir()/freshTestDb() in
 * this process, including the migration template dir. Call once per test
 * file from a top-level `after()` hook so disposable DBs never linger under
 * the OS tmpdir (this phase's brief §6: "cleaned up afterward").
 */
export function cleanupAllTestDbs(): void {
  for (const dir of createdTestDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  templateDbPath = null;
}

/** Runs the real migration runner (scripts/freshness/migrate.ts) against dbPath. */
export function runMigration(dbPath: string): string {
  return execFileSync("npx", ["tsx", "scripts/freshness/migrate.ts", "--db", dbPath], {
    cwd: REPO_ROOT,
    stdio: "pipe",
  }).toString();
}

/** Runs the real integrity checker (scripts/freshness/integrity-check.ts) against dbPath. */
export function runIntegrityCheck(dbPath: string): string {
  return execFileSync("npx", ["tsx", "scripts/freshness/integrity-check.ts", "--db", dbPath], {
    cwd: REPO_ROOT,
    stdio: "pipe",
  }).toString();
}

let templateDbPath: string | null = null;

/** Migrates a template DB once per test process; safe to call repeatedly. */
export function getMigratedTemplate(): string {
  if (templateDbPath && fs.existsSync(templateDbPath)) return templateDbPath;

  const dir = createTempDir("template");
  const dest = path.join(dir, "freshness.db");
  runMigration(dest);

  // Force a full WAL checkpoint before the file is ever copied, so clones
  // (plain fs.copyFileSync of the main db file) are never missing rows that
  // are still sitting in an un-checkpointed -wal file.
  const sqlite = new Database(dest);
  sqlite.pragma("wal_checkpoint(TRUNCATE)");
  sqlite.close();

  templateDbPath = dest;
  return dest;
}

/** Returns a fresh, uniquely-pathed, already-migrated disposable DB file. */
export function freshTestDb(prefix = "case"): string {
  const template = getMigratedTemplate();
  const dir = createTempDir(prefix);
  const dest = path.join(dir, "freshness.db");
  fs.copyFileSync(template, dest);
  return dest;
}

export function openDb(dbPath: string): Database.Database {
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  return sqlite;
}

let idCounter = 0;
/** Deterministic-enough unique id for test rows — no uuid dependency needed. */
export function testId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export const REPO_ROOT_FOR_TESTS = REPO_ROOT;

// ─── Shared row-insert helpers ─────────────────────────────────────────────
// Minimal, direct better-sqlite3 inserts — no repository/service layer, per
// this phase's brief §36 ("acceptable for focused schema behavior tests to
// use better-sqlite3 directly through existing connection helpers").

export function insertWatchlistRow(
  db: Database.Database,
  opts: { entityRef: string; factKey: string; entityType?: string; checkFrequency?: string; nextCheckDue?: string }
): string {
  const id = testId("wl");
  db.prepare(
    `INSERT INTO freshness_watchlist
       (id, entity_type, entity_ref, fact_key, check_frequency, next_check_due, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`
  ).run(
    id,
    opts.entityType ?? "calendar_item",
    opts.entityRef,
    opts.factKey,
    opts.checkFrequency ?? "weekly",
    opts.nextCheckDue ?? "2026-09-01",
    nowIso(),
    nowIso()
  );
  return id;
}

export function insertObservation(
  db: Database.Database,
  watchlistId: string,
  opts: { observedValue?: string; result?: string; sourceId?: string | null; observationId?: string }
): string {
  const id = testId("obs");
  db.prepare(
    `INSERT INTO freshness_observations
       (id, watchlist_id, observation_id, source_id, observed_value, observed_at, result, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    watchlistId,
    opts.observationId ?? testId("obsid"),
    opts.sourceId ?? null,
    opts.observedValue ?? "",
    nowIso(),
    opts.result ?? "unchanged",
    nowIso()
  );
  return id;
}

export function insertSource(
  db: Database.Database,
  opts: { sourceEntity: string; sourceKind: string; canonicalHostnames: string[]; labelEn: string; labelRu?: string }
): string {
  const id = testId("src");
  db.prepare(
    `INSERT INTO sources (id, source_entity, source_kind, canonical_hostnames, label_en, label_ru, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    opts.sourceEntity,
    opts.sourceKind,
    JSON.stringify(opts.canonicalHostnames),
    opts.labelEn,
    opts.labelRu ?? "",
    nowIso(),
    nowIso()
  );
  return id;
}

export function insertSourceAuthority(
  db: Database.Database,
  opts: { sourceId: string; factClass: string; authorityLevel: string }
): string {
  const id = testId("auth");
  db.prepare(
    `INSERT INTO source_authority (id, source_id, fact_class, authority_level, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, opts.sourceId, opts.factClass, opts.authorityLevel, nowIso());
  return id;
}

export function insertChangeCandidate(
  db: Database.Database,
  watchlistId: string,
  opts: {
    factKey: string;
    oldValue?: string;
    proposedValue: string;
    severity: string;
    verificationStatus?: string;
    triggeringObservationId?: string | null;
  }
): string {
  const id = testId("cand");
  db.prepare(
    `INSERT INTO freshness_change_candidates
       (id, watchlist_id, triggering_observation_id, fact_key, old_value, proposed_value, severity, verification_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    watchlistId,
    opts.triggeringObservationId ?? null,
    opts.factKey,
    opts.oldValue ?? "",
    opts.proposedValue,
    opts.severity,
    opts.verificationStatus ?? "pending",
    nowIso(),
    nowIso()
  );
  return id;
}

export function insertAlert(
  db: Database.Database,
  changeCandidateId: string,
  opts: { severity: string; status?: string }
): string {
  const id = testId("alert");
  db.prepare(
    `INSERT INTO freshness_alerts (id, change_candidate_id, severity, status, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, changeCandidateId, opts.severity, opts.status ?? "pending", nowIso());
  return id;
}
