// Deterministic migration runner for freshness.db.
//
// Usage: npx tsx scripts/freshness/migrate.ts --db <path>
//
// Never defaults to a database path — the caller must always name the
// target explicitly. Refuses any path whose basename is "guides.db" so it
// can never be pointed at the production content database by accident.

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const GUIDES_DB_BASENAME = "guides.db";
const MIGRATIONS_DIR = path.join(process.cwd(), "scripts", "freshness", "migrations");

function fail(message: string): never {
  console.error(`[freshness:migrate] ERROR: ${message}`);
  process.exit(1);
}

function parseDbPath(argv: string[]): string {
  const flagIndex = argv.indexOf("--db");
  if (flagIndex === -1 || !argv[flagIndex + 1]) {
    fail(
      "No --db <path> argument given. This runner never defaults to a database path. " +
        "Example: npx tsx scripts/freshness/migrate.ts --db data/freshness.db"
    );
  }
  return argv[flagIndex + 1];
}

function assertNotGuidesDb(dbPath: string): void {
  if (path.basename(dbPath) === GUIDES_DB_BASENAME) {
    fail(
      `Refusing to run: target path "${dbPath}" has basename "${GUIDES_DB_BASENAME}". ` +
        "This runner is for freshness.db only and must never touch the guides database."
    );
  }
}

interface MigrationFile {
  version: number;
  name: string;
  sql: string;
}

function loadMigrations(): MigrationFile[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fail(`Migrations directory not found: ${MIGRATIONS_DIR}`);
  }

  const pattern = /^(\d+)_.+\.sql$/;
  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));
  const migrations: MigrationFile[] = [];
  const seenVersions = new Set<number>();

  for (const file of files) {
    const match = file.match(pattern);
    if (!match) {
      fail(`Migration file "${file}" does not match the required "NNNN_name.sql" convention.`);
    }
    const version = Number.parseInt(match[1], 10);
    if (seenVersions.has(version)) {
      fail(`Duplicate migration version ${version} found (file "${file}").`);
    }
    seenVersions.add(version);
    migrations.push({
      version,
      name: file,
      sql: fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"),
    });
  }

  migrations.sort((a, b) => a.version - b.version);

  migrations.forEach((m, i) => {
    const expected = i + 1;
    if (m.version !== expected) {
      fail(
        "Migration versions must be contiguous starting at 1 with no gaps. " +
          `Expected version ${expected}, found ${m.version} ("${m.name}").`
      );
    }
  });

  return migrations;
}

function schemaMigrationsTableExists(sqlite: Database.Database): boolean {
  const row = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'")
    .get();
  return Boolean(row);
}

function getAppliedVersions(sqlite: Database.Database): number[] {
  if (!schemaMigrationsTableExists(sqlite)) return [];
  const rows = sqlite
    .prepare("SELECT version FROM schema_migrations ORDER BY version ASC")
    .all() as { version: number }[];
  return rows.map((r) => r.version);
}

function main(): void {
  const dbPath = parseDbPath(process.argv.slice(2));
  assertNotGuidesDb(dbPath);

  const resolvedPath = path.resolve(dbPath);
  console.log(`[freshness:migrate] target: ${resolvedPath}`);

  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fail(`Parent directory does not exist: ${dir}. Create it explicitly before running migrate.`);
  }

  const migrations = loadMigrations();
  if (migrations.length === 0) {
    fail("No migration files found.");
  }

  const sqlite = new Database(resolvedPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");

  const applied = getAppliedVersions(sqlite);
  const appliedSet = new Set(applied);

  // Corruption guard: recorded versions themselves must be contiguous from 1.
  applied.forEach((v, i) => {
    const expected = i + 1;
    if (v !== expected) {
      sqlite.close();
      fail(
        "schema_migrations is corrupted: expected contiguous versions starting at 1, " +
          `found ${JSON.stringify(applied)}.`
      );
    }
  });

  const maxApplied = applied.length > 0 ? Math.max(...applied) : 0;
  const pending = migrations.filter((m) => m.version > maxApplied);

  for (const m of pending) {
    if (appliedSet.has(m.version)) {
      sqlite.close();
      fail(
        `Migration version ${m.version} ("${m.name}") is already recorded as applied — refusing duplicate application.`
      );
    }
  }

  if (pending.length === 0) {
    console.log(`[freshness:migrate] up to date at version ${maxApplied}. Nothing to apply.`);
    const check = sqlite.pragma("integrity_check", { simple: true });
    sqlite.close();
    console.log(`[freshness:migrate] integrity_check: ${check}`);
    if (check !== "ok") process.exit(1);
    return;
  }

  for (const migration of pending) {
    console.log(`[freshness:migrate] applying version ${migration.version}: ${migration.name}`);
    const applyTx = sqlite.transaction(() => {
      sqlite.exec(migration.sql);
      sqlite
        .prepare("INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)")
        .run(migration.version, migration.name, new Date().toISOString());
    });

    try {
      applyTx();
    } catch (err) {
      sqlite.close();
      fail(`Migration "${migration.name}" failed and was rolled back: ${(err as Error).message}`);
    }
    console.log(`[freshness:migrate] applied version ${migration.version}.`);
  }

  const check = sqlite.pragma("integrity_check", { simple: true });
  console.log(`[freshness:migrate] integrity_check: ${check}`);
  sqlite.close();

  if (check !== "ok") {
    fail(`integrity_check did not return "ok" after migration: ${check}`);
  }

  console.log(`[freshness:migrate] done. version = ${pending[pending.length - 1].version}.`);
}

main();
