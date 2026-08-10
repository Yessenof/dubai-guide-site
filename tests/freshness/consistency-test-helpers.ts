// Disposable guides.db-shaped fixtures for tests/freshness/consistency.test.ts.
//
// Every DB built here lives under os.tmpdir(), never under this repo's
// data/ directory (§6/§21 of the FRESH-01 brief: "Tests must primarily use
// disposable fixtures"). The calendar_pages CREATE TABLE below is copied
// verbatim from `sqlite3 data/guides.db ".schema calendar_pages"` — it is a
// disposable test fixture, not a migration, and is never applied to a real
// database.

import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CALENDAR_PAGES_DDL = `
CREATE TABLE calendar_pages (
  id                   TEXT    PRIMARY KEY,
  slug                 TEXT    UNIQUE NOT NULL,
  status               TEXT    NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft', 'published', 'archived')),
  calendar_type        TEXT    NOT NULL DEFAULT 'monthly',
  year                 INTEGER NOT NULL DEFAULT 0,
  month                INTEGER,
  en_title             TEXT    NOT NULL DEFAULT '',
  en_summary           TEXT    NOT NULL DEFAULT '',
  en_body              TEXT    NOT NULL DEFAULT '',
  en_notes             TEXT    NOT NULL DEFAULT '',
  en_seo_title         TEXT    NOT NULL DEFAULT '',
  en_meta_description  TEXT    NOT NULL DEFAULT '',
  ru_published         INTEGER NOT NULL DEFAULT 0,
  ru_title             TEXT    NOT NULL DEFAULT '',
  ru_summary           TEXT    NOT NULL DEFAULT '',
  ru_body              TEXT    NOT NULL DEFAULT '',
  ru_notes             TEXT    NOT NULL DEFAULT '',
  ru_seo_title         TEXT    NOT NULL DEFAULT '',
  ru_meta_description  TEXT    NOT NULL DEFAULT '',
  image_path           TEXT    NOT NULL DEFAULT '',
  image_alt            TEXT    NOT NULL DEFAULT '',
  ru_image_alt         TEXT    NOT NULL DEFAULT '',
  dates_json           TEXT    NOT NULL DEFAULT '[]',
  has_islamic_dates    INTEGER NOT NULL DEFAULT 0,
  official_source_url  TEXT    NOT NULL DEFAULT '',
  last_verified_date   TEXT    NOT NULL DEFAULT '',
  featured_homepage    INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT    NOT NULL,
  updated_at           TEXT    NOT NULL
);
`;

const createdDirs: string[] = [];

export function createGuidesTestDb(prefix = "guides"): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `guidex-consistency-test-${prefix}-`));
  createdDirs.push(dir);
  const dbPath = path.join(dir, "guides.db");
  const db = new Database(dbPath);
  db.exec(CALENDAR_PAGES_DDL);
  db.close();
  return dbPath;
}

export function cleanupAllGuidesTestDbs(): void {
  for (const dir of createdDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

let pageCounter = 0;

export function insertCalendarPage(
  dbPath: string,
  opts: {
    slug?: string;
    status?: string;
    ruPublished?: boolean;
    officialSourceUrl?: string;
    datesJson: string; // raw text — callers may pass deliberately malformed JSON
  }
): string {
  pageCounter += 1;
  const slug = opts.slug ?? `test-calendar-page-${pageCounter}`;
  const id = `page-${pageCounter}`;
  const now = new Date().toISOString();

  const db = new Database(dbPath);
  db.prepare(
    `INSERT INTO calendar_pages
       (id, slug, status, ru_published, official_source_url, dates_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, slug, opts.status ?? "published", opts.ruPublished ? 1 : 0, opts.officialSourceUrl ?? "", opts.datesJson, now, now);
  db.close();

  return slug;
}

export function sha256OfFile(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}
