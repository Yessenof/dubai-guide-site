// FRESH-01 — deterministic consistency engine domain types.
//
// Report-only: nothing in this module (or anything that consumes it) may
// write to guides.db or freshness.db. See scripts/qa-consistency-check.ts
// and lib/freshness/consistency/engine.ts for the read-only entrypoints.

export const CONSISTENCY_SEVERITIES = ["INFO", "WARNING", "BLOCKING", "HARD_FAIL"] as const;
export type ConsistencySeverity = (typeof CONSISTENCY_SEVERITIES)[number];

// Lower rank sorts first — HARD_FAIL and BLOCKING surface above WARNING/INFO
// in both text and JSON output (§13 of the FRESH-01 brief).
const SEVERITY_RANK: Record<ConsistencySeverity, number> = {
  HARD_FAIL: 0,
  BLOCKING: 1,
  WARNING: 2,
  INFO: 3,
};
export function severityRank(s: ConsistencySeverity): number {
  return SEVERITY_RANK[s];
}

export const CONSISTENCY_RULE_IDS = [
  "SRC-IDENTITY-001",
  "SRC-IDENTITY-002",
  "SRC-REGISTRY-GAP-003",
  "SRC-COMPOUND-006",
  "EVENT-SCHEMA-007",
  "EVENT-DATE-008",
  "CAL-ITEM-SHAPE-009",
  "CAL-DATE-010",
  "RU-PAIR-011",
  "ENTITY-REVIEW-014",
  "MISSING-EVIDENCE-METADATA-015",
] as const;
export type ConsistencyRuleId = (typeof CONSISTENCY_RULE_IDS)[number];

/**
 * "ENGINE-SCHEMA" is not one of the 11 approved content rules (§9) — it
 * covers engine-level structural failures (§17/§18: malformed dates_json,
 * a required table missing from either database) that happen before any
 * content rule can safely run at all. Kept distinct from the content rule
 * union so callers can tell "a rule found a problem" apart from "the engine
 * could not evaluate the corpus."
 */
export type FindingRuleId = ConsistencyRuleId | "ENGINE-SCHEMA";

export interface ConsistencyFinding {
  rule_id: FindingRuleId;
  severity: ConsistencySeverity;
  entity_type?: string;
  entity_ref?: string;
  page_slug?: string;
  field?: string;
  message: string;
  expected?: unknown;
  actual?: unknown;
  evidence?: Record<string, unknown>;
}

export const REPORT_STATUSES = ["PASS", "PASS_WITH_WARNINGS", "BLOCKED", "FAIL"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface ConsistencyCounts {
  info: number;
  warnings: number;
  blocking: number;
  hard_fail: number;
}

export interface ConsistencyReport {
  status: ReportStatus;
  counts: ConsistencyCounts;
  findings: ConsistencyFinding[];
}

/** Maps a ConsistencyReport.status to the CLI exit code required by §3 of the brief. */
export function exitCodeForStatus(status: ReportStatus): 0 | 1 | 2 {
  switch (status) {
    case "PASS":
    case "PASS_WITH_WARNINGS":
      return 0;
    case "BLOCKED":
      return 1;
    case "FAIL":
      return 2;
  }
}

/** Pure aggregation: findings -> counts -> status. No I/O, no ordering side effects. */
export function buildReport(findings: ConsistencyFinding[]): ConsistencyReport {
  const counts: ConsistencyCounts = { info: 0, warnings: 0, blocking: 0, hard_fail: 0 };
  for (const f of findings) {
    if (f.severity === "INFO") counts.info++;
    else if (f.severity === "WARNING") counts.warnings++;
    else if (f.severity === "BLOCKING") counts.blocking++;
    else if (f.severity === "HARD_FAIL") counts.hard_fail++;
  }

  let status: ReportStatus;
  if (counts.hard_fail > 0) status = "FAIL";
  else if (counts.blocking > 0) status = "BLOCKED";
  else if (counts.warnings > 0) status = "PASS_WITH_WARNINGS";
  else status = "PASS";

  return { status, counts, findings: sortFindings(findings) };
}

const EMPTY = "";

/**
 * Stable, deterministic finding order per §13: severity rank, then rule_id,
 * entity_type, entity_ref, page_slug, field, message — all treated as empty
 * string when absent so ordering never depends on `undefined` comparison
 * semantics (which are not stable across engines/versions).
 */
export function sortFindings(findings: ConsistencyFinding[]): ConsistencyFinding[] {
  return [...findings].sort((a, b) => {
    const byRank = severityRank(a.severity) - severityRank(b.severity);
    if (byRank !== 0) return byRank;
    const byRule = a.rule_id.localeCompare(b.rule_id);
    if (byRule !== 0) return byRule;
    const byEntityType = (a.entity_type ?? EMPTY).localeCompare(b.entity_type ?? EMPTY);
    if (byEntityType !== 0) return byEntityType;
    const byEntityRef = (a.entity_ref ?? EMPTY).localeCompare(b.entity_ref ?? EMPTY);
    if (byEntityRef !== 0) return byEntityRef;
    const byPageSlug = (a.page_slug ?? EMPTY).localeCompare(b.page_slug ?? EMPTY);
    if (byPageSlug !== 0) return byPageSlug;
    const byField = (a.field ?? EMPTY).localeCompare(b.field ?? EMPTY);
    if (byField !== 0) return byField;
    return a.message.localeCompare(b.message);
  });
}
