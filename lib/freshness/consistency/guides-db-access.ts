// Read-only access to guides.db for FRESH-01. Never opens the DB for
// writing, never runs a migration, never issues a write PRAGMA. See §4/§5
// of the FRESH-01 brief.

import Database from "better-sqlite3";
import fs from "node:fs";
import { EngineSchemaError } from "./errors";

export interface CalendarPageRow {
  slug: string;
  status: string;
  ruPublished: boolean;
  officialSourceUrl: string;
  rawDatesJson: string;
}

export type CalendarItem = Record<string, unknown>;

export interface ParsedCalendarPage {
  slug: string;
  status: string;
  ruPublished: boolean;
  officialSourceUrl: string;
  items: CalendarItem[];
}

const REQUIRED_CALENDAR_PAGES_COLUMNS = ["slug", "status", "ru_published", "official_source_url", "dates_json"];

export function openGuidesDbReadOnly(dbPath: string): Database.Database {
  if (!fs.existsSync(dbPath)) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: `guides DB not found at "${dbPath}".`,
      evidence: { db_path: dbPath },
    });
  }
  try {
    return new Database(dbPath, { readonly: true, fileMustExist: true });
  } catch (err) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: `guides DB at "${dbPath}" could not be opened read-only: ${(err as Error).message}`,
      evidence: { db_path: dbPath },
    });
  }
}

/** Throws EngineSchemaError if calendar_pages is missing or missing a required column. */
export function validateGuidesSchema(db: Database.Database): void {
  const table = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'calendar_pages'")
    .get() as { name: string } | undefined;

  if (!table) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: 'guides DB is missing the required "calendar_pages" table.',
      evidence: { required_table: "calendar_pages" },
    });
  }

  const columns = (db.prepare("PRAGMA table_info(calendar_pages)").all() as { name: string }[]).map((c) => c.name);
  const missing = REQUIRED_CALENDAR_PAGES_COLUMNS.filter((c) => !columns.includes(c));
  if (missing.length > 0) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: `guides DB "calendar_pages" table is missing required column(s): ${missing.join(", ")}.`,
      evidence: { missing_columns: missing },
    });
  }
}

export function loadCalendarPageRows(db: Database.Database): CalendarPageRow[] {
  const rows = db
    .prepare("SELECT slug, status, ru_published, official_source_url, dates_json FROM calendar_pages ORDER BY slug ASC")
    .all() as { slug: string; status: string; ru_published: number; official_source_url: string; dates_json: string }[];

  return rows.map((r) => ({
    slug: r.slug,
    status: r.status,
    ruPublished: r.ru_published === 1,
    officialSourceUrl: r.official_source_url,
    rawDatesJson: r.dates_json,
  }));
}

/**
 * Parses every page's dates_json individually. A malformed page never
 * throws out of this function and never poisons other pages' evaluation —
 * it is reported as a HARD_FAIL finding and its items are excluded from
 * every other rule (§17: "do not partially trust corrupted page data").
 */
export function parseCalendarPages(rows: CalendarPageRow[]): {
  pages: ParsedCalendarPage[];
  malformed: EngineSchemaError[];
} {
  const pages: ParsedCalendarPage[] = [];
  const malformed: EngineSchemaError[] = [];

  for (const row of rows) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(row.rawDatesJson);
    } catch (err) {
      malformed.push(
        new EngineSchemaError({
          rule_id: "CAL-ITEM-SHAPE-009",
          severity: "HARD_FAIL",
          entity_type: "calendar_page",
          page_slug: row.slug,
          message: `dates_json on page "${row.slug}" is not valid JSON: ${(err as Error).message}`,
          evidence: { page_slug: row.slug },
        })
      );
      continue;
    }
    if (!Array.isArray(parsed)) {
      malformed.push(
        new EngineSchemaError({
          rule_id: "CAL-ITEM-SHAPE-009",
          severity: "HARD_FAIL",
          entity_type: "calendar_page",
          page_slug: row.slug,
          message: `dates_json on page "${row.slug}" did not parse to an array.`,
          evidence: { page_slug: row.slug },
        })
      );
      continue;
    }
    pages.push({
      slug: row.slug,
      status: row.status,
      ruPublished: row.ruPublished,
      officialSourceUrl: row.officialSourceUrl,
      items: parsed as CalendarItem[],
    });
  }

  return { pages, malformed };
}
