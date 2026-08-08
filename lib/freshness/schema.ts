import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// Query-builder definitions only — matching lib/db/schema.ts's convention of
// leaving CHECK constraints to the raw-SQL migration (drizzle-orm/sqlite-core
// has no first-class CHECK helper). The authoritative constraints live in
// scripts/freshness/migrations/0001_init.sql.

export const sources = sqliteTable("sources", {
  id:                   text("id").primaryKey(),
  sourceEntity:         text("source_entity").notNull(),
  sourceKind:           text("source_kind").notNull(),
  canonicalHostnames:   text("canonical_hostnames").notNull(),
  labelEn:              text("label_en").notNull(),
  labelRu:              text("label_ru").notNull().default(""),
  verifiedSocialHandle: text("verified_social_handle").notNull().default(""),
  createdAt:            text("created_at").notNull(),
  updatedAt:            text("updated_at").notNull(),
});

export const sourceAuthority = sqliteTable("source_authority", {
  id:             text("id").primaryKey(),
  sourceId:       text("source_id").notNull().references(() => sources.id),
  factClass:      text("fact_class").notNull(),
  authorityLevel: text("authority_level").notNull(),
  createdAt:      text("created_at").notNull(),
});

export const freshnessWatchlist = sqliteTable("freshness_watchlist", {
  id:             text("id").primaryKey(),
  entityType:     text("entity_type").notNull(),
  entityRef:      text("entity_ref").notNull(),
  factKey:        text("fact_key").notNull(),
  checkFrequency: text("check_frequency").notNull(),
  nextCheckDue:   text("next_check_due").notNull(),
  status:         text("status").notNull().default("active"),
  createdAt:      text("created_at").notNull(),
  updatedAt:      text("updated_at").notNull(),
});

export const freshnessObservations = sqliteTable("freshness_observations", {
  id:            text("id").primaryKey(),
  watchlistId:   text("watchlist_id").notNull().references(() => freshnessWatchlist.id),
  observationId: text("observation_id").notNull(),
  runId:         text("run_id").notNull().default(""),
  sourceId:      text("source_id").references(() => sources.id),
  observedValue: text("observed_value").notNull().default(""),
  observedAt:    text("observed_at").notNull(),
  publishedAt:   text("published_at").notNull().default(""),
  effectiveAt:   text("effective_at").notNull().default(""),
  result:        text("result").notNull(),
  evidenceRef:   text("evidence_ref").notNull().default(""),
  createdAt:     text("created_at").notNull(),
});

export const freshnessChangeCandidates = sqliteTable("freshness_change_candidates", {
  id:                      text("id").primaryKey(),
  watchlistId:             text("watchlist_id").notNull().references(() => freshnessWatchlist.id),
  triggeringObservationId: text("triggering_observation_id").references(() => freshnessObservations.id),
  factKey:                 text("fact_key").notNull(),
  oldValue:                text("old_value").notNull().default(""),
  proposedValue:           text("proposed_value").notNull(),
  severity:                text("severity").notNull(),
  verificationStatus:      text("verification_status").notNull().default("pending"),
  reviewedBy:              text("reviewed_by").notNull().default(""),
  reviewedAt:              text("reviewed_at").notNull().default(""),
  appliedAt:               text("applied_at").notNull().default(""),
  closedReason:            text("closed_reason").notNull().default(""),
  createdAt:               text("created_at").notNull(),
  updatedAt:               text("updated_at").notNull(),
});

export const freshnessAlerts = sqliteTable("freshness_alerts", {
  id:                text("id").primaryKey(),
  changeCandidateId: text("change_candidate_id").notNull().references(() => freshnessChangeCandidates.id),
  severity:          text("severity").notNull(),
  deliveryChannel:   text("delivery_channel").notNull().default(""),
  deliveredAt:       text("delivered_at").notNull().default(""),
  status:            text("status").notNull().default("pending"),
  createdAt:         text("created_at").notNull(),
});

export type Source = typeof sources.$inferSelect;
export type SourceAuthorityRow = typeof sourceAuthority.$inferSelect;
export type FreshnessWatchlistRow = typeof freshnessWatchlist.$inferSelect;
export type FreshnessObservation = typeof freshnessObservations.$inferSelect;
export type FreshnessChangeCandidate = typeof freshnessChangeCandidates.$inferSelect;
export type FreshnessAlert = typeof freshnessAlerts.$inferSelect;
