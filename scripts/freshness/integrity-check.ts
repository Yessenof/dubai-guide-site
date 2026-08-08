// Read-only integrity check for freshness.db.
//
// Usage: npx tsx scripts/freshness/integrity-check.ts --db <path>
//
// Never defaults to a database path — the caller must always name the
// target explicitly. Refuses any path whose basename is "guides.db".

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const GUIDES_DB_BASENAME = "guides.db";

const REQUIRED_TABLES = [
  "schema_migrations",
  "sources",
  "source_authority",
  "freshness_watchlist",
  "freshness_observations",
  "freshness_change_candidates",
  "freshness_alerts",
];

const REQUIRED_INDEXES = [
  "uq_source_authority",
  "uq_watchlist_identity",
  "idx_watchlist_due",
  "uq_observations_observation_id",
  "idx_observations_watchlist",
  "idx_candidates_watchlist",
  "idx_candidates_status",
  "uq_alerts_candidate",
  "idx_alerts_status",
];

function fail(message: string): never {
  console.error(`[freshness:integrity] ERROR: ${message}`);
  process.exit(1);
}

function parseDbPath(argv: string[]): string {
  const flagIndex = argv.indexOf("--db");
  if (flagIndex === -1 || !argv[flagIndex + 1]) {
    fail(
      "No --db <path> argument given. This command never defaults to a database path. " +
        "Example: npx tsx scripts/freshness/integrity-check.ts --db data/freshness.db"
    );
  }
  return argv[flagIndex + 1];
}

function assertNotGuidesDb(dbPath: string): void {
  if (path.basename(dbPath) === GUIDES_DB_BASENAME) {
    fail(`Refusing to inspect a path named "${GUIDES_DB_BASENAME}". This command is for freshness.db only.`);
  }
}

function main(): void {
  const dbPath = parseDbPath(process.argv.slice(2));
  assertNotGuidesDb(dbPath);
  const resolvedPath = path.resolve(dbPath);

  if (!fs.existsSync(resolvedPath)) {
    fail(`Database file does not exist: ${resolvedPath}`);
  }

  console.log(`[freshness:integrity] target: ${resolvedPath}`);

  const sqlite = new Database(resolvedPath, { readonly: true });
  let failures = 0;

  try {
    const integrity = sqlite.pragma("integrity_check", { simple: true });
    console.log(`[freshness:integrity] integrity_check: ${integrity}`);
    if (integrity !== "ok") failures++;

    const fkViolations = sqlite.pragma("foreign_key_check") as unknown[];
    console.log(`[freshness:integrity] foreign_key_check violations: ${fkViolations.length}`);
    if (fkViolations.length > 0) failures++;

    const tableRows = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all() as { name: string }[];
    const tableNames = new Set(tableRows.map((r) => r.name));
    for (const table of REQUIRED_TABLES) {
      const present = tableNames.has(table);
      console.log(`[freshness:integrity] table ${table}: ${present ? "present" : "MISSING"}`);
      if (!present) failures++;
    }

    const indexRows = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type = 'index'")
      .all() as { name: string }[];
    const indexNames = new Set(indexRows.map((r) => r.name));
    for (const index of REQUIRED_INDEXES) {
      const present = indexNames.has(index);
      console.log(`[freshness:integrity] index ${index}: ${present ? "present" : "MISSING"}`);
      if (!present) failures++;
    }

    if (tableNames.has("schema_migrations")) {
      const migrations = sqlite
        .prepare("SELECT version, name, applied_at FROM schema_migrations ORDER BY version ASC")
        .all() as { version: number; name: string; applied_at: string }[];
      console.log(`[freshness:integrity] schema_migrations: ${migrations.length} applied`);
      for (const m of migrations) {
        console.log(`  - v${m.version} ${m.name} @ ${m.applied_at}`);
      }
      if (migrations.length === 0) failures++;
    }
  } finally {
    sqlite.close();
  }

  if (failures > 0) {
    fail(`${failures} check(s) failed.`);
  }

  console.log("[freshness:integrity] all checks passed.");
}

main();
