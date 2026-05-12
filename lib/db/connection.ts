import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

// SCRIPTS ONLY — do not import this in app/, admin/, or any runtime code.
// Public pages, server actions, and writer functions must use `db` (Drizzle).
// This export exists solely for local verification scripts that need to
// manage SAVEPOINTs on the same connection that Drizzle writers use.
export { sqlite as sqliteForVerificationOnly };
