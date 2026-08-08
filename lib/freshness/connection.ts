import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "freshness.db");

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("busy_timeout = 5000");

export const db = drizzle(sqlite, { schema });

// SCRIPTS ONLY — never imported from app/, admin/, or any runtime code.
// lib/freshness/* has zero inbound imports from app/: public pages continue
// to use only lib/db/reader.ts, per CLAUDE.md's locked architecture rule.
// Assumes scripts/freshness/migrate.ts has already been run against
// data/freshness.db — this module does not run migrations itself.
export { sqlite as sqliteForVerificationOnly };
