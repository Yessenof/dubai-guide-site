// Proves the FRESH-00A schema itself — migration bootstraps deterministically,
// all tables/indexes exist, CHECK-constrained columns reject invalid values,
// and the TS domain unions in lib/freshness/types.ts stay in sync with the
// SQL CHECK lists in scripts/freshness/migrations/0001_init.sql (this phase's
// brief §8: "A mismatch between TS enums/unions and SQL enum values must be
// testable/detectable").

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createTempDir,
  runMigration,
  runIntegrityCheck,
  freshTestDb,
  openDb,
  testId,
  nowIso,
  REPO_ROOT_FOR_TESTS,
  insertWatchlistRow,
  insertObservation,
  cleanupAllTestDbs,
} from "./test-helpers";

after(cleanupAllTestDbs);
import {
  SOURCE_KINDS,
  AUTHORITY_LEVELS,
  ENTITY_TYPES,
  CHECK_FREQUENCIES,
  WATCHLIST_STATUSES,
  OBSERVATION_RESULTS,
  SEVERITIES,
  VERIFICATION_STATUSES,
  ALERT_STATUSES,
} from "../../lib/freshness/types";

const REQUIRED_TABLES = [
  "schema_migrations",
  "sources",
  "source_authority",
  "freshness_watchlist",
  "freshness_observations",
  "freshness_change_candidates",
  "freshness_alerts",
];

describe("migration bootstrap", () => {
  test("bootstraps a fresh empty DB deterministically with all tables + indexes", () => {
    const dir = createTempDir("bootstrap");
    const dbPath = path.join(dir, "freshness.db");
    const out = runMigration(dbPath);
    assert.match(out, /applying version 1/);
    assert.match(out, /integrity_check: ok/);

    const db = openDb(dbPath);
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((r: any) => r.name);
    for (const t of REQUIRED_TABLES) {
      assert.ok(tables.includes(t), `expected table ${t} to exist`);
    }
    db.close();
  });

  test("re-running migrate.ts against an already-migrated DB is idempotent", () => {
    const dir = createTempDir("rerun");
    const dbPath = path.join(dir, "freshness.db");
    runMigration(dbPath);
    const secondRun = runMigration(dbPath);
    assert.match(secondRun, /up to date at version 1. Nothing to apply/);
    assert.match(secondRun, /integrity_check: ok/);

    const db = openDb(dbPath);
    const count = db.prepare("SELECT COUNT(*) as n FROM schema_migrations").get() as { n: number };
    assert.equal(count.n, 1, "schema_migrations must record exactly one applied migration");
    db.close();
  });

  test("integrity-check.ts reports ok and all required tables/indexes present", () => {
    const dbPath = freshTestDb("integrity");
    const out = runIntegrityCheck(dbPath);
    assert.match(out, /integrity_check: ok/);
    assert.match(out, /foreign_key_check violations: 0/);
    assert.match(out, /all checks passed/);
  });
});

describe("TS/SQL enum parity", () => {
  function parseCheckEnums(sql: string): Record<string, Record<string, string[]>> {
    const tables: Record<string, Record<string, string[]>> = {};
    const tableRegex = /CREATE TABLE (\w+) \(([\s\S]*?)\n\);/g;
    let tm: RegExpExecArray | null;
    while ((tm = tableRegex.exec(sql))) {
      const tableName = tm[1];
      const body = tm[2];
      const colRegex = /(\w+)\s+TEXT[^,]*?CHECK\s*\(\s*\1\s+IN\s*\(([^)]+)\)\)/g;
      let cm: RegExpExecArray | null;
      const cols: Record<string, string[]> = {};
      while ((cm = colRegex.exec(body))) {
        const colName = cm[1];
        const values = cm[2]
          .split(",")
          .map((v) => v.trim().replace(/^'|'$/g, ""))
          .filter(Boolean);
        cols[colName] = values;
      }
      tables[tableName] = cols;
    }
    return tables;
  }

  const migrationSql = fs.readFileSync(
    path.join(REPO_ROOT_FOR_TESTS, "scripts", "freshness", "migrations", "0001_init.sql"),
    "utf8"
  );
  const parsed = parseCheckEnums(migrationSql);

  test("sources.source_kind matches SOURCE_KINDS", () => {
    assert.deepEqual(parsed.sources.source_kind, [...SOURCE_KINDS]);
  });

  test("source_authority.authority_level matches AUTHORITY_LEVELS", () => {
    assert.deepEqual(parsed.source_authority.authority_level, [...AUTHORITY_LEVELS]);
  });

  test("freshness_watchlist.entity_type matches ENTITY_TYPES", () => {
    assert.deepEqual(parsed.freshness_watchlist.entity_type, [...ENTITY_TYPES]);
  });

  test("freshness_watchlist.check_frequency matches CHECK_FREQUENCIES", () => {
    assert.deepEqual(parsed.freshness_watchlist.check_frequency, [...CHECK_FREQUENCIES]);
  });

  test("freshness_watchlist.status matches WATCHLIST_STATUSES", () => {
    assert.deepEqual(parsed.freshness_watchlist.status, [...WATCHLIST_STATUSES]);
  });

  test("freshness_observations.result matches OBSERVATION_RESULTS", () => {
    assert.deepEqual(parsed.freshness_observations.result, [...OBSERVATION_RESULTS]);
  });

  test("freshness_change_candidates.severity matches SEVERITIES", () => {
    assert.deepEqual(parsed.freshness_change_candidates.severity, [...SEVERITIES]);
  });

  test("freshness_change_candidates.verification_status matches VERIFICATION_STATUSES", () => {
    assert.deepEqual(parsed.freshness_change_candidates.verification_status, [...VERIFICATION_STATUSES]);
  });

  test("freshness_alerts.severity matches SEVERITIES", () => {
    assert.deepEqual(parsed.freshness_alerts.severity, [...SEVERITIES]);
  });

  test("freshness_alerts.status matches ALERT_STATUSES", () => {
    assert.deepEqual(parsed.freshness_alerts.status, [...ALERT_STATUSES]);
  });
});

describe("CHECK constraint enforcement", () => {
  test("invalid source_kind is rejected at the DB level", () => {
    const dbPath = freshTestDb("check-source-kind");
    const db = openDb(dbPath);
    assert.throws(() => {
      db
        .prepare(
          `INSERT INTO sources (id, source_entity, source_kind, canonical_hostnames, label_en, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(testId("src"), "Bogus Source", "not_a_kind", "[]", "Bogus", nowIso(), nowIso());
    }, /CHECK constraint failed/);
    db.close();
  });

  test("invalid observation result is rejected at the DB level", () => {
    const dbPath = freshTestDb("check-result");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "DSF-2026", factKey: "date" });
    assert.throws(() => {
      db
        .prepare(
          `INSERT INTO freshness_observations
             (id, watchlist_id, observation_id, observed_at, result, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(testId("obs"), watchlistId, testId("obsid"), nowIso(), "probably_fine", nowIso());
    }, /CHECK constraint failed/);
    db.close();
  });

  test("invalid verification_status is rejected at the DB level", () => {
    const dbPath = freshTestDb("check-verification-status");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "DSF-2026", factKey: "date" });
    assert.throws(() => {
      db
        .prepare(
          `INSERT INTO freshness_change_candidates
             (id, watchlist_id, fact_key, proposed_value, severity, verification_status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(testId("cand"), watchlistId, "date", "2026-12-01", "urgent", "half_approved", nowIso(), nowIso());
    }, /CHECK constraint failed/);
    db.close();
  });
});

describe("append-only observation log and entity identity", () => {
  test("expected -> confirmed date transition accumulates as two observation rows, never an UPDATE", () => {
    const dbPath = freshTestDb("expected-confirmed");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "DXB-HOLIDAY-01", factKey: "date" });

    insertObservation(db, watchlistId, { observedValue: "2026-06-15 (expected)", result: "unchanged" });
    insertObservation(db, watchlistId, { observedValue: "2026-06-16 (confirmed)", result: "changed" });

    const rows = db
      .prepare("SELECT observed_value, result FROM freshness_observations WHERE watchlist_id = ? ORDER BY observed_at")
      .all(watchlistId) as { observed_value: string; result: string }[];
    assert.equal(rows.length, 2);
    assert.equal(rows[0].observed_value, "2026-06-15 (expected)");
    assert.equal(rows[1].observed_value, "2026-06-16 (confirmed)");
    db.close();
  });

  test("confirmed watchlist row keeps accepting new observations — confirmed never means stop monitoring", () => {
    const dbPath = freshTestDb("confirmed-keeps-monitoring");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, {
      entityRef: "CONCERT-CONFIRMED-01",
      factKey: "date_start",
      checkFrequency: "weekly",
    });
    insertObservation(db, watchlistId, { observedValue: "2026-09-10", result: "unchanged" });
    insertObservation(db, watchlistId, { observedValue: "2026-09-10", result: "unchanged" });
    insertObservation(db, watchlistId, { observedValue: "2026-10-01", result: "changed" });

    const row = db.prepare("SELECT status FROM freshness_watchlist WHERE id = ?").get(watchlistId) as {
      status: string;
    };
    assert.equal(row.status, "active", "watchlist row must remain active/monitorable after confirmation");

    const count = db
      .prepare("SELECT COUNT(*) as n FROM freshness_observations WHERE watchlist_id = ?")
      .get(watchlistId) as { n: number };
    assert.equal(count.n, 3);
    db.close();
  });

  test("annual-edition collision: same title, two distinct entity_ref values coexist without colliding", () => {
    const dbPath = freshTestDb("annual-edition");
    const db = openDb(dbPath);
    const edition2026 = insertWatchlistRow(db, { entityRef: "dubai-shopping-festival-2026", factKey: "date_start" });
    const edition2027 = insertWatchlistRow(db, { entityRef: "dubai-shopping-festival-2027", factKey: "date_start" });
    assert.notEqual(edition2026, edition2027);

    insertObservation(db, edition2026, { observedValue: "2026-12-15" });
    insertObservation(db, edition2027, { observedValue: "2027-12-14" });

    const obs2026 = db
      .prepare("SELECT observed_value FROM freshness_observations WHERE watchlist_id = ?")
      .all(edition2026) as { observed_value: string }[];
    const obs2027 = db
      .prepare("SELECT observed_value FROM freshness_observations WHERE watchlist_id = ?")
      .all(edition2027) as { observed_value: string }[];
    assert.equal(obs2026.length, 1);
    assert.equal(obs2027.length, 1);
    assert.notEqual(obs2026[0].observed_value, obs2027[0].observed_value);
    db.close();
  });

  test("duplicate (entity_type, entity_ref, fact_key) is rejected — editions must use distinct entity_ref", () => {
    const dbPath = freshTestDb("annual-edition-dup");
    const db = openDb(dbPath);
    insertWatchlistRow(db, { entityRef: "dubai-shopping-festival-2026", factKey: "date_start" });
    assert.throws(() => {
      insertWatchlistRow(db, { entityRef: "dubai-shopping-festival-2026", factKey: "date_start" });
    }, /UNIQUE constraint failed/);
    db.close();
  });

  test("result='unreachable' is a valid, representable observation outcome", () => {
    const dbPath = freshTestDb("unreachable");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "SOURCE-DOWN-01", factKey: "date" });
    insertObservation(db, watchlistId, { result: "unreachable", observedValue: "" });
    const row = db
      .prepare("SELECT result FROM freshness_observations WHERE watchlist_id = ?")
      .get(watchlistId) as { result: string };
    assert.equal(row.result, "unreachable");
    db.close();
  });
});

