// Read-only access to freshness.db for FRESH-01. Never opens the DB for
// writing, never runs a migration, never issues a write PRAGMA. See §4/§6
// of the FRESH-01 brief. FRESH-01 is not a registry lifecycle phase — no
// INSERT/UPDATE/DELETE anywhere in this module.

import Database from "better-sqlite3";
import fs from "node:fs";
import { EngineSchemaError } from "./errors";
import { SourceRegistryEntry } from "./source-resolution";

const REQUIRED_TABLES = [
  "sources",
  "source_authority",
  "freshness_watchlist",
  "freshness_observations",
  "freshness_change_candidates",
  "freshness_alerts",
];

export function openFreshnessDbReadOnly(dbPath: string): Database.Database {
  if (!fs.existsSync(dbPath)) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: `freshness DB not found at "${dbPath}".`,
      evidence: { db_path: dbPath },
    });
  }
  try {
    return new Database(dbPath, { readonly: true, fileMustExist: true });
  } catch (err) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: `freshness DB at "${dbPath}" could not be opened read-only: ${(err as Error).message}`,
      evidence: { db_path: dbPath },
    });
  }
}

/** Throws EngineSchemaError if any required FRESH-00 registry table is missing. */
export function validateFreshnessSchema(db: Database.Database): void {
  const existing = new Set(
    (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as { name: string }[]).map((r) => r.name)
  );
  const missing = REQUIRED_TABLES.filter((t) => !existing.has(t));
  if (missing.length > 0) {
    throw new EngineSchemaError({
      rule_id: "ENGINE-SCHEMA",
      severity: "HARD_FAIL",
      message: `freshness DB is missing required table(s): ${missing.join(", ")}.`,
      evidence: { missing_tables: missing },
    });
  }
}

export function loadSourceRegistry(db: Database.Database): SourceRegistryEntry[] {
  const rows = db.prepare("SELECT source_entity, canonical_hostnames, label_en, label_ru FROM sources").all() as {
    source_entity: string;
    canonical_hostnames: string;
    label_en: string;
    label_ru: string;
  }[];

  return rows.map((r) => {
    let canonicalHostnames: string[] = [];
    try {
      const parsed = JSON.parse(r.canonical_hostnames);
      if (Array.isArray(parsed)) canonicalHostnames = parsed.filter((h): h is string => typeof h === "string");
    } catch {
      canonicalHostnames = [];
    }
    return {
      sourceEntity: r.source_entity,
      canonicalHostnames,
      labelEn: r.label_en,
      labelRu: r.label_ru,
    };
  });
}

export interface WatchlistEntry {
  id: string;
  entityType: string;
  entityRef: string;
  factKey: string;
  status: string;
}

export function loadActiveWatchlist(db: Database.Database): WatchlistEntry[] {
  const rows = db
    .prepare("SELECT id, entity_type, entity_ref, fact_key, status FROM freshness_watchlist WHERE status = 'active'")
    .all() as { id: string; entity_type: string; entity_ref: string; fact_key: string; status: string }[];
  return rows.map((r) => ({ id: r.id, entityType: r.entity_type, entityRef: r.entity_ref, factKey: r.fact_key, status: r.status }));
}

export interface ApprovedUnappliedCandidate {
  watchlistId: string;
  factKey: string;
  proposedValue: string;
  verificationStatus: string;
}

/** Change candidates that have been approved but not yet applied — used by EVENT-DATE-008. */
export function loadApprovedUnappliedCandidates(db: Database.Database): ApprovedUnappliedCandidate[] {
  const rows = db
    .prepare(
      `SELECT watchlist_id, fact_key, proposed_value, verification_status
         FROM freshness_change_candidates
        WHERE verification_status = 'approved'`
    )
    .all() as { watchlist_id: string; fact_key: string; proposed_value: string; verification_status: string }[];
  return rows.map((r) => ({
    watchlistId: r.watchlist_id,
    factKey: r.fact_key,
    proposedValue: r.proposed_value,
    verificationStatus: r.verification_status,
  }));
}
