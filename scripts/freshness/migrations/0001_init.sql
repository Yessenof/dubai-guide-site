-- FRESH-00A — initial freshness.db schema
-- Six domain tables + schema_migrations, per docs/architecture/fresh-00-implementation-plan.md §7.
-- This file is applied only by scripts/freshness/migrate.ts, never by hand and never against guides.db.

CREATE TABLE schema_migrations (
  version     INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  applied_at  TEXT NOT NULL
);

CREATE TABLE sources (
  id                     TEXT PRIMARY KEY,
  source_entity          TEXT NOT NULL,
  source_kind            TEXT NOT NULL CHECK (source_kind IN
                            ('government','organizer','venue','ticketing','media',
                             'verified_social','aggregator','unverified_social')),
  canonical_hostnames    TEXT NOT NULL,              -- JSON array, validated in app code
  label_en               TEXT NOT NULL,
  label_ru               TEXT NOT NULL DEFAULT '',
  verified_social_handle TEXT NOT NULL DEFAULT '',
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

CREATE TABLE source_authority (
  id               TEXT PRIMARY KEY,
  source_id        TEXT NOT NULL REFERENCES sources(id),
  fact_class       TEXT NOT NULL,
  authority_level  TEXT NOT NULL CHECK (authority_level IN
                     ('primary','secondary','corroborating','discovery_only')),
  created_at       TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_source_authority ON source_authority(source_id, fact_class);

CREATE TABLE freshness_watchlist (
  id              TEXT PRIMARY KEY,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('calendar_item','event','guide_field')),
  entity_ref      TEXT NOT NULL,
  fact_key        TEXT NOT NULL,
  check_frequency TEXT NOT NULL CHECK (check_frequency IN
                    ('daily','weekly','monthly','quarterly','manual_only')),
  next_check_due  TEXT NOT NULL,                     -- date-only, 'YYYY-MM-DD'
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','resolved','archived')),
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_watchlist_identity ON freshness_watchlist(entity_type, entity_ref, fact_key);
CREATE INDEX idx_watchlist_due ON freshness_watchlist(status, next_check_due);

CREATE TABLE freshness_observations (
  id               TEXT PRIMARY KEY,
  watchlist_id     TEXT NOT NULL REFERENCES freshness_watchlist(id),
  observation_id   TEXT NOT NULL,                    -- idempotency key, machine-contract-derived
  run_id           TEXT NOT NULL DEFAULT '',
  source_id        TEXT REFERENCES sources(id),
  observed_value   TEXT NOT NULL DEFAULT '',
  observed_at      TEXT NOT NULL,
  published_at     TEXT NOT NULL DEFAULT '',
  effective_at     TEXT NOT NULL DEFAULT '',
  result           TEXT NOT NULL CHECK (result IN ('unchanged','changed','unreachable','inconclusive')),
  evidence_ref     TEXT NOT NULL DEFAULT '',
  created_at       TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_observations_observation_id ON freshness_observations(observation_id);
CREATE INDEX idx_observations_watchlist ON freshness_observations(watchlist_id, observed_at);

CREATE TABLE freshness_change_candidates (
  id                         TEXT PRIMARY KEY,
  watchlist_id               TEXT NOT NULL REFERENCES freshness_watchlist(id),
  triggering_observation_id  TEXT REFERENCES freshness_observations(id),
  fact_key                   TEXT NOT NULL,
  old_value                  TEXT NOT NULL DEFAULT '',
  proposed_value              TEXT NOT NULL,
  severity                   TEXT NOT NULL CHECK (severity IN ('info','warning','urgent')),
  verification_status        TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN
                                ('pending','conflict_hold','approved','rejected','applied','superseded')),
  reviewed_by                TEXT NOT NULL DEFAULT '',
  reviewed_at                TEXT NOT NULL DEFAULT '',
  applied_at                 TEXT NOT NULL DEFAULT '',
  closed_reason              TEXT NOT NULL DEFAULT '',
  created_at                 TEXT NOT NULL,
  updated_at                 TEXT NOT NULL
);
CREATE INDEX idx_candidates_watchlist ON freshness_change_candidates(watchlist_id);
CREATE INDEX idx_candidates_status ON freshness_change_candidates(verification_status);

CREATE TABLE freshness_alerts (
  id                   TEXT PRIMARY KEY,
  change_candidate_id  TEXT NOT NULL REFERENCES freshness_change_candidates(id),
  severity             TEXT NOT NULL CHECK (severity IN ('info','warning','urgent')),
  delivery_channel     TEXT NOT NULL DEFAULT '',
  delivered_at         TEXT NOT NULL DEFAULT '',
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','acknowledged','resolved')),
  created_at           TEXT NOT NULL
);
CREATE UNIQUE INDEX uq_alerts_candidate ON freshness_alerts(change_candidate_id);
CREATE INDEX idx_alerts_status ON freshness_alerts(status);
