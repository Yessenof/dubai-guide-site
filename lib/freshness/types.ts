// Domain types for freshness.db, kept deliberately aligned with the SQL CHECK
// constraints in scripts/freshness/migrations/0001_init.sql. Every union below
// is exported as a `const` array first so tests/freshness/schema.test.ts can
// diff it against the migration file's own CHECK (... IN (...)) lists —
// TS/SQL drift is a test failure, not a silent divergence.
//
// Scope: FRESH-00B (local schema + fixtures + validation). No transport/
// ingestion code lives here — see docs/architecture/freshness-revision-02-plan.md
// §16 for the target JSON/JSONL machine contract (Track B).

// ─── sources.source_kind ───────────────────────────────────────────────────

export const SOURCE_KINDS = [
  "government",
  "organizer",
  "venue",
  "ticketing",
  "media",
  "verified_social",
  "aggregator",
  "unverified_social",
] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

// ─── source_authority.authority_level ──────────────────────────────────────

export const AUTHORITY_LEVELS = ["primary", "secondary", "corroborating", "discovery_only"] as const;
export type AuthorityLevel = (typeof AUTHORITY_LEVELS)[number];

// ─── freshness_watchlist.entity_type ───────────────────────────────────────

export const ENTITY_TYPES = ["calendar_item", "event", "guide_field"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// ─── freshness_watchlist.check_frequency ───────────────────────────────────

export const CHECK_FREQUENCIES = ["daily", "weekly", "monthly", "quarterly", "manual_only"] as const;
export type CheckFrequency = (typeof CHECK_FREQUENCIES)[number];

// ─── freshness_watchlist.status ────────────────────────────────────────────

export const WATCHLIST_STATUSES = ["active", "resolved", "archived"] as const;
export type WatchlistStatus = (typeof WATCHLIST_STATUSES)[number];

// ─── freshness_observations.result ─────────────────────────────────────────

export const OBSERVATION_RESULTS = ["unchanged", "changed", "unreachable", "inconclusive"] as const;
export type ObservationResult = (typeof OBSERVATION_RESULTS)[number];

// ─── freshness_change_candidates.severity / freshness_alerts.severity ─────
// Same 3-value storage class, shared by both tables (Revision 02.1 §17).

export const SEVERITIES = ["info", "warning", "urgent"] as const;
export type Severity = (typeof SEVERITIES)[number];

// ─── freshness_change_candidates.verification_status ───────────────────────

export const VERIFICATION_STATUSES = [
  "pending",
  "conflict_hold",
  "approved",
  "rejected",
  "applied",
  "superseded",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

// ─── freshness_alerts.status ───────────────────────────────────────────────

export const ALERT_STATUSES = ["pending", "acknowledged", "resolved"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

// ─── source_role — app-level only, not a DB column (Revision 02.1 §6.1) ───
// Property of *how* a specific observation/candidate cites a source, not of
// the source itself. No SQL CHECK exists for this, so no drift test applies.

export const SOURCE_ROLES = [
  "announcement",
  "evidence",
  "official_reference",
  "legal_basis",
  "organizer",
  "venue",
  "ticketing",
  "booking",
  "corroboration",
  "discovery_lead",
] as const;
export type SourceRole = (typeof SOURCE_ROLES)[number];

// ─── Canonical operational severity (Revision 02.1 §17's explicit mapping) ─

export const OPERATIONAL_SEVERITIES = ["P0", "P1", "P2", "P3"] as const;
export type OperationalSeverity = (typeof OPERATIONAL_SEVERITIES)[number];

/**
 * Maps the DB's simplified 3-value `severity` storage class to the canonical
 * P0-P3 operational vocabulary, per Revision 02.1 §17. `urgent` collapses two
 * operational tiers (P0/P1 distinguished by proximity/impact, not stored
 * separately at MVP) — this returns both as the valid range for `urgent`.
 */
export function operationalSeverityRange(severity: Severity): OperationalSeverity[] {
  switch (severity) {
    case "urgent":
      return ["P0", "P1"];
    case "warning":
      return ["P2"];
    case "info":
      return ["P3"];
  }
}

// ─── Normalized observation contract (Revision 02.1 §16, internal only) ───
// This is the internal shape later ingestion (FRESH-02+) will produce from
// the MVP Markdown-parsing bridge or the future JSON/JSONL contract. FRESH-00B
// does not implement any parser — this type is the foundation validation.ts
// validates against, per this phase's brief §10.

export interface NormalizedObservationInput {
  schemaVersion?: number;
  runId?: string;
  observationId?: string;
  entityType?: string;
  entityRef?: string;
  factKey?: string;
  sourceRef?: string; // resolves to sources.id — required (§11: "missing source reference where required")
  observedValue?: string;
  observedAt?: string; // full ISO timestamp, required
  publishedAt?: string; // full ISO timestamp, optional
  effectiveAt?: string; // date-only OR full ISO timestamp, optional
  result?: string;
  evidenceRef?: string;
}

export interface ChangeCandidateInput {
  factKey?: string;
  oldValue?: string;
  proposedValue?: string;
  severity?: string;
  verificationStatus?: string;
}
