// The 11 approved FRESH-01 deterministic rules (§9 of the brief).
// URL-NORM-013 is explicitly out of scope and does not appear here (§10).
//
// Every rule function is pure: (corpus data in) -> (ConsistencyFinding[] out).
// No I/O, no DB access, no AI, no web lookups.

import { isValidIsoDate } from "../validation";
import { ParsedCalendarPage, CalendarItem } from "./guides-db-access";
import { ApprovedUnappliedCandidate, WatchlistEntry } from "./freshness-db-access";
import { resolveByUrl, resolveByLabel, textContainsRegisteredLabel, SourceRegistryEntry } from "./source-resolution";
import { ConsistencyFinding } from "./types";

export interface RuleContext {
  pages: ParsedCalendarPage[];
  registry: SourceRegistryEntry[];
  activeWatchlist: WatchlistEntry[];
  approvedUnappliedCandidates: ApprovedUnappliedCandidate[];
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function str(item: CalendarItem, key: string): string {
  const v = item[key];
  return typeof v === "string" ? v : "";
}

function nonEmpty(item: CalendarItem, key: string): boolean {
  return str(item, key).trim() !== "";
}

function itemId(item: CalendarItem): string | undefined {
  const v = item.id;
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

interface Located {
  item: CalendarItem;
  slug: string;
  index: number;
}

function* iterateItems(pages: ParsedCalendarPage[]): Generator<Located> {
  for (const page of pages) {
    for (let index = 0; index < page.items.length; index++) {
      const item = page.items[index];
      // items must be objects — a stray primitive in the array is a shape
      // problem, not something any rule below can safely introspect.
      if (item && typeof item === "object" && !Array.isArray(item)) {
        yield { item: item as CalendarItem, slug: page.slug, index };
      }
    }
  }
}

// ─── CAL-ITEM-SHAPE-009 ─────────────────────────────────────────────────────

export function calItemShape(pages: ParsedCalendarPage[]): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];
  const withId: { id: string; slug: string; index: number }[] = [];

  for (const { item, slug, index } of iterateItems(pages)) {
    const id = itemId(item);
    if (!id) {
      findings.push({
        rule_id: "CAL-ITEM-SHAPE-009",
        severity: "BLOCKING",
        entity_type: "calendar_item",
        page_slug: slug,
        field: "id",
        message: `Calendar item at index ${index} on page "${slug}" is missing a persisted id.`,
        evidence: { index },
      });
    } else {
      withId.push({ id, slug, index });
    }
  }

  const byExact = new Map<string, typeof withId>();
  for (const entry of withId) {
    const bucket = byExact.get(entry.id) ?? [];
    bucket.push(entry);
    byExact.set(entry.id, bucket);
  }
  for (const [id, group] of byExact) {
    if (group.length > 1) {
      findings.push({
        rule_id: "CAL-ITEM-SHAPE-009",
        severity: "BLOCKING",
        entity_type: "calendar_item",
        entity_ref: id,
        message: `Calendar item id "${id}" is duplicated exactly across ${group.length} item(s).`,
        evidence: { locations: group.map((g) => ({ slug: g.slug, index: g.index })) },
      });
    }
  }

  const byLower = new Map<string, typeof withId>();
  for (const entry of withId) {
    const key = entry.id.toLowerCase();
    const bucket = byLower.get(key) ?? [];
    bucket.push(entry);
    byLower.set(key, bucket);
  }
  for (const [lower, group] of byLower) {
    const distinctExact = new Set(group.map((g) => g.id));
    if (distinctExact.size > 1) {
      findings.push({
        rule_id: "CAL-ITEM-SHAPE-009",
        severity: "BLOCKING",
        entity_type: "calendar_item",
        entity_ref: lower,
        message: `Calendar item ids differ only by case, which is treated as a duplicate: ${[...distinctExact].sort().join(", ")}.`,
        evidence: { locations: group.map((g) => ({ slug: g.slug, index: g.index })) },
      });
    }
  }

  return findings;
}

// ─── CAL-DATE-010 ───────────────────────────────────────────────────────────

export function calDateShape(pages: ParsedCalendarPage[]): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];

  for (const { item, slug, index } of iterateItems(pages)) {
    const entityRef = itemId(item);
    const base = { entity_type: "calendar_item", entity_ref: entityRef, page_slug: slug };

    const dateRaw = item.date;
    let dateValid = false;
    if (dateRaw !== undefined) {
      dateValid = typeof dateRaw === "string" && isValidIsoDate(dateRaw);
      if (!dateValid) {
        findings.push({
          rule_id: "CAL-DATE-010",
          severity: "BLOCKING",
          ...base,
          field: "date",
          message: `Calendar item ${entityRef ?? `at index ${index} on "${slug}"`} has a malformed or impossible "date" value.`,
          actual: dateRaw,
        });
      }
    }

    const endField = item.date_end !== undefined ? "date_end" : item.period_end !== undefined ? "period_end" : undefined;
    if (endField) {
      const endRaw = item[endField];
      const endValid = typeof endRaw === "string" && isValidIsoDate(endRaw);
      if (!endValid) {
        findings.push({
          rule_id: "CAL-DATE-010",
          severity: "BLOCKING",
          ...base,
          field: endField,
          message: `Calendar item ${entityRef ?? `at index ${index} on "${slug}"`} has a malformed or impossible "${endField}" value.`,
          actual: endRaw,
        });
      } else if (dateValid && typeof dateRaw === "string" && (endRaw as string) < dateRaw) {
        findings.push({
          rule_id: "CAL-DATE-010",
          severity: "BLOCKING",
          ...base,
          field: endField,
          message: `Calendar item ${entityRef ?? `at index ${index} on "${slug}"`} has "${endField}" (${endRaw}) earlier than "date" (${dateRaw}).`,
          expected: `>= ${dateRaw}`,
          actual: endRaw,
        });
      }
    }
  }

  return findings;
}

// ─── EVENT-SCHEMA-007 ───────────────────────────────────────────────────────

export function eventSchema(pages: ParsedCalendarPage[]): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];

  for (const { item, slug, index } of iterateItems(pages)) {
    const entityRef = itemId(item);
    const base = { entity_type: "calendar_item", entity_ref: entityRef, page_slug: slug };
    const label = entityRef ?? `index ${index} on "${slug}"`;

    if (!nonEmpty(item, "date")) {
      findings.push({
        rule_id: "EVENT-SCHEMA-007",
        severity: "BLOCKING",
        ...base,
        field: "date",
        message: `Calendar item ${label} is missing the required "date" field.`,
      });
    }
    if (!nonEmpty(item, "label_en")) {
      findings.push({
        rule_id: "EVENT-SCHEMA-007",
        severity: "BLOCKING",
        ...base,
        field: "label_en",
        message: `Calendar item ${label} is missing the required "label_en" field.`,
      });
    }
    if (!nonEmpty(item, "type")) {
      findings.push({
        rule_id: "EVENT-SCHEMA-007",
        severity: "BLOCKING",
        ...base,
        field: "type",
        message: `Calendar item ${label} is missing the required "type" field.`,
      });
    }

    const hasSourceEvidence =
      nonEmpty(item, "source_url") || nonEmpty(item, "source_label") || nonEmpty(item, "source_label_en") || nonEmpty(item, "source");
    if (!hasSourceEvidence) {
      findings.push({
        rule_id: "EVENT-SCHEMA-007",
        severity: "WARNING",
        ...base,
        field: "source",
        message: `Calendar item ${label} has no source/evidence field populated (source, source_label, source_label_en, or source_url).`,
      });
    }
  }

  return findings;
}

// ─── RU-PAIR-011 ────────────────────────────────────────────────────────────

const RU_PAIR_FIELDS: [string, string][] = [
  ["label_en", "label_ru"],
  ["short_label_en", "short_label_ru"],
  ["brief_en", "brief_ru"],
  ["who_for_en", "who_for_ru"],
  ["what_to_do_en", "what_to_do_ru"],
  ["cta_label_en", "cta_label_ru"],
  ["location_en", "location_ru"],
  ["source_label_en", "source_label_ru"],
];

export function ruPairing(pages: ParsedCalendarPage[]): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];

  for (const page of pages) {
    if (!page.ruPublished) continue;
    page.items.forEach((rawItem, index) => {
      if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) return;
      const item = rawItem as CalendarItem;
      const entityRef = itemId(item);
      const label = entityRef ?? `index ${index} on "${page.slug}"`;

      for (const [enField, ruField] of RU_PAIR_FIELDS) {
        if (nonEmpty(item, enField) && !nonEmpty(item, ruField)) {
          findings.push({
            rule_id: "RU-PAIR-011",
            severity: "WARNING",
            entity_type: "calendar_item",
            entity_ref: entityRef,
            page_slug: page.slug,
            field: ruField,
            message: `Calendar item ${label} on a RU-published page has "${enField}" populated but "${ruField}" is empty.`,
          });
        }
      }
    });
  }

  return findings;
}

// ─── Source rules: SRC-IDENTITY-001/002, SRC-REGISTRY-GAP-003, SRC-COMPOUND-006, ENTITY-REVIEW-014 ─────

export function sourceRules(pages: ParsedCalendarPage[], registry: SourceRegistryEntry[]): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];

  for (const { item, slug, index } of iterateItems(pages)) {
    const entityRef = itemId(item);
    const base = { entity_type: "calendar_item", entity_ref: entityRef, page_slug: slug };
    const label = entityRef ?? `index ${index} on "${slug}"`;

    const sourceUrl = str(item, "source_url").trim();
    const sourceLabelEn = str(item, "source_label_en").trim();
    const sourceLabelRu = str(item, "source_label_ru").trim();
    const legacySource = str(item, "source").trim();

    // SRC-REGISTRY-GAP-003: a cited source_url whose hostname isn't registered.
    let urlResolution: ReturnType<typeof resolveByUrl> | undefined;
    if (sourceUrl !== "") {
      urlResolution = resolveByUrl(sourceUrl, registry);
      if (urlResolution.status === "UNKNOWN") {
        findings.push({
          rule_id: "SRC-REGISTRY-GAP-003",
          severity: "WARNING",
          ...base,
          field: "source_url",
          message: `Calendar item ${label} cites source_url "${sourceUrl}", whose hostname is not registered in the freshness source registry.`,
          actual: sourceUrl,
        });
      }
    }

    // SRC-IDENTITY-001: source_url identity vs. the record's claimed label.
    const claimedLabel = sourceLabelEn !== "" ? sourceLabelEn : "";
    if (sourceUrl !== "" && claimedLabel !== "" && urlResolution) {
      const labelResolution = resolveByLabel(claimedLabel, registry);
      if (urlResolution.status === "KNOWN" && labelResolution.status === "KNOWN") {
        if (urlResolution.sourceEntity !== labelResolution.sourceEntity) {
          findings.push({
            rule_id: "SRC-IDENTITY-001",
            severity: "BLOCKING",
            ...base,
            field: "source_label_en",
            message: `Calendar item ${label}: source_url resolves to registered entity "${urlResolution.sourceEntity}", but source_label_en "${claimedLabel}" resolves to a different registered entity "${labelResolution.sourceEntity}".`,
            expected: urlResolution.sourceEntity,
            actual: labelResolution.sourceEntity,
          });
        }
      } else if (urlResolution.status === "KNOWN" && labelResolution.status !== "KNOWN") {
        findings.push({
          rule_id: "SRC-IDENTITY-001",
          severity: "WARNING",
          ...base,
          field: "source_label_en",
          message: `Calendar item ${label}: source_url resolves to registered entity "${urlResolution.sourceEntity}", but source_label_en "${claimedLabel}" does not deterministically resolve to any registered entity — human review needed, not a confirmed contradiction.`,
        });
      } else if (urlResolution.status !== "KNOWN" && labelResolution.status === "KNOWN") {
        findings.push({
          rule_id: "SRC-IDENTITY-001",
          severity: "WARNING",
          ...base,
          field: "source_url",
          message: `Calendar item ${label}: source_label_en "${claimedLabel}" resolves to registered entity "${labelResolution.sourceEntity}", but source_url "${sourceUrl}" does not deterministically resolve to any registered entity — human review needed, not a confirmed contradiction.`,
        });
      }
    }

    // SRC-IDENTITY-002: source_label_en vs source_label_ru resolving to different entities.
    if (sourceLabelEn !== "" && sourceLabelRu !== "") {
      const enResolution = resolveByLabel(sourceLabelEn, registry);
      const ruResolution = resolveByLabel(sourceLabelRu, registry);
      if (enResolution.status === "KNOWN" && ruResolution.status === "KNOWN" && enResolution.sourceEntity !== ruResolution.sourceEntity) {
        findings.push({
          rule_id: "SRC-IDENTITY-002",
          severity: "BLOCKING",
          ...base,
          field: "source_label_ru",
          message: `Calendar item ${label}: source_label_en resolves to registered entity "${enResolution.sourceEntity}", but source_label_ru resolves to a different registered entity "${ruResolution.sourceEntity}".`,
          expected: enResolution.sourceEntity,
          actual: ruResolution.sourceEntity,
        });
      }
    }

    // SRC-COMPOUND-006 / ENTITY-REVIEW-014 on the legacy free-text `source` field.
    if (legacySource !== "") {
      const matchedEntities = [...new Set(registry.filter((e) => textContainsRegisteredLabel(legacySource, e)).map((e) => e.sourceEntity))];

      if (matchedEntities.length >= 2) {
        findings.push({
          rule_id: "SRC-COMPOUND-006",
          severity: "WARNING",
          ...base,
          field: "source",
          message: `Calendar item ${label} has a compound source label ("${legacySource}") matching ${matchedEntities.length} distinct registered entities (${matchedEntities.join(", ")}); it cannot map deterministically to one source.`,
          evidence: { matched_entities: matchedEntities },
        });
      } else if (matchedEntities.length === 0 && sourceUrl === "") {
        findings.push({
          rule_id: "ENTITY-REVIEW-014",
          severity: "WARNING",
          ...base,
          field: "source",
          message: `Calendar item ${label} has a free-text source ("${legacySource}") that cannot be deterministically resolved to a registered source entity, and no source_url is present to cross-check — flagged for human review.`,
        });
      }
    }
  }

  return findings;
}

// ─── EVENT-DATE-008 ─────────────────────────────────────────────────────────

export function eventDateRegistryContradiction(
  pages: ParsedCalendarPage[],
  activeWatchlist: WatchlistEntry[],
  approvedUnappliedCandidates: ApprovedUnappliedCandidate[]
): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];

  const itemById = new Map<string, { item: CalendarItem; slug: string }>();
  for (const { item, slug } of iterateItems(pages)) {
    const id = itemId(item);
    if (id) itemById.set(id, { item, slug });
  }

  const watchlistByKey = new Map<string, WatchlistEntry>();
  for (const w of activeWatchlist) {
    if (w.entityType === "calendar_item") watchlistByKey.set(`${w.entityRef}::${w.factKey}`, w);
  }

  for (const candidate of approvedUnappliedCandidates) {
    if (candidate.factKey !== "date") continue;
    const watchlist = [...watchlistByKey.values()].find((w) => w.id === candidate.watchlistId);
    if (!watchlist) continue;

    const located = itemById.get(watchlist.entityRef);
    if (!located) continue;

    const persistedDate = str(located.item, "date");
    if (persistedDate === "" || candidate.proposedValue === "") continue;
    if (!isValidIsoDate(persistedDate) || !isValidIsoDate(candidate.proposedValue)) continue;
    if (persistedDate === candidate.proposedValue) continue;

    findings.push({
      rule_id: "EVENT-DATE-008",
      severity: "WARNING",
      entity_type: "calendar_item",
      entity_ref: watchlist.entityRef,
      page_slug: located.slug,
      field: "date",
      message: `Calendar item ${watchlist.entityRef}: persisted date "${persistedDate}" differs from an approved-but-unapplied freshness change candidate proposing "${candidate.proposedValue}".`,
      expected: candidate.proposedValue,
      actual: persistedDate,
    });
  }

  return findings;
}

// ─── MISSING-EVIDENCE-METADATA-015 ──────────────────────────────────────────

export function missingEvidenceMetadata(pages: ParsedCalendarPage[], activeWatchlist: WatchlistEntry[]): ConsistencyFinding[] {
  const findings: ConsistencyFinding[] = [];

  const itemById = new Map<string, { item: CalendarItem; slug: string }>();
  for (const { item, slug } of iterateItems(pages)) {
    const id = itemId(item);
    if (id) itemById.set(id, { item, slug });
  }

  const trackedIds = new Set(activeWatchlist.filter((w) => w.entityType === "calendar_item").map((w) => w.entityRef));

  for (const id of trackedIds) {
    const located = itemById.get(id);
    if (!located) continue;

    const hasEvidence =
      nonEmpty(located.item, "source_url") ||
      nonEmpty(located.item, "source_label") ||
      nonEmpty(located.item, "source_label_en") ||
      nonEmpty(located.item, "source");

    if (!hasEvidence) {
      findings.push({
        rule_id: "MISSING-EVIDENCE-METADATA-015",
        severity: "WARNING",
        entity_type: "calendar_item",
        entity_ref: id,
        page_slug: located.slug,
        field: "source",
        message: `Calendar item ${id} is under active freshness tracking but has no persisted source/evidence field, so it cannot be safely monitored or reviewed.`,
      });
    }
  }

  return findings;
}

// ─── Orchestration ──────────────────────────────────────────────────────────

export function runAllRules(ctx: RuleContext): ConsistencyFinding[] {
  return [
    ...calItemShape(ctx.pages),
    ...calDateShape(ctx.pages),
    ...eventSchema(ctx.pages),
    ...ruPairing(ctx.pages),
    ...sourceRules(ctx.pages, ctx.registry),
    ...eventDateRegistryContradiction(ctx.pages, ctx.activeWatchlist, ctx.approvedUnappliedCandidates),
    ...missingEvidenceMetadata(ctx.pages, ctx.activeWatchlist),
  ];
}
