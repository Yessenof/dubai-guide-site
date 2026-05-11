PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS news_posts (
  id                   TEXT    PRIMARY KEY,
  slug                 TEXT    UNIQUE NOT NULL,
  status               TEXT    NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft', 'published', 'archived')),
  category             TEXT    NOT NULL DEFAULT 'visa',
  tags_json            TEXT    NOT NULL DEFAULT '[]',
  en_title             TEXT    NOT NULL DEFAULT '',
  en_summary           TEXT    NOT NULL DEFAULT '',
  en_body              TEXT    NOT NULL DEFAULT '',
  en_seo_title         TEXT    NOT NULL DEFAULT '',
  en_meta_description  TEXT    NOT NULL DEFAULT '',
  ru_published         INTEGER NOT NULL DEFAULT 0,
  ru_title             TEXT    NOT NULL DEFAULT '',
  ru_summary           TEXT    NOT NULL DEFAULT '',
  ru_body              TEXT    NOT NULL DEFAULT '',
  ru_seo_title         TEXT    NOT NULL DEFAULT '',
  ru_meta_description  TEXT    NOT NULL DEFAULT '',
  source_url           TEXT    NOT NULL DEFAULT '',
  source_label         TEXT    NOT NULL DEFAULT 'media',
  image_path           TEXT    NOT NULL DEFAULT '',
  image_alt            TEXT    NOT NULL DEFAULT '',
  ru_image_alt         TEXT    NOT NULL DEFAULT '',
  date_published       TEXT    NOT NULL DEFAULT '',
  date_updated         TEXT    NOT NULL DEFAULT '',
  featured_homepage    INTEGER NOT NULL DEFAULT 0,
  featured_digest      INTEGER NOT NULL DEFAULT 0,
  noindex              INTEGER NOT NULL DEFAULT 0,
  related_guide_slug   TEXT    NOT NULL DEFAULT '',
  related_service_slug TEXT    NOT NULL DEFAULT '',
  related_tool_slug    TEXT    NOT NULL DEFAULT '',
  created_at           TEXT    NOT NULL,
  updated_at           TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id                   TEXT    PRIMARY KEY,
  slug                 TEXT    UNIQUE NOT NULL,
  status               TEXT    NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft', 'published', 'archived')),
  category             TEXT    NOT NULL DEFAULT 'holiday',
  color_type           TEXT    NOT NULL DEFAULT 'important-date',
  tags_json            TEXT    NOT NULL DEFAULT '[]',
  en_title             TEXT    NOT NULL DEFAULT '',
  en_summary           TEXT    NOT NULL DEFAULT '',
  en_body              TEXT    NOT NULL DEFAULT '',
  en_seo_title         TEXT    NOT NULL DEFAULT '',
  en_meta_description  TEXT    NOT NULL DEFAULT '',
  ru_published         INTEGER NOT NULL DEFAULT 0,
  ru_title             TEXT    NOT NULL DEFAULT '',
  ru_summary           TEXT    NOT NULL DEFAULT '',
  ru_body              TEXT    NOT NULL DEFAULT '',
  ru_seo_title         TEXT    NOT NULL DEFAULT '',
  ru_meta_description  TEXT    NOT NULL DEFAULT '',
  event_date_start     TEXT    NOT NULL DEFAULT '',
  event_date_end       TEXT    NOT NULL DEFAULT '',
  date_confidence      TEXT    NOT NULL DEFAULT 'confirmed'
                               CHECK (date_confidence IN (
                                 'confirmed',
                                 'expected',
                                 'subject_to_official_confirmation'
                               )),
  year                 INTEGER NOT NULL DEFAULT 0,
  source_url           TEXT    NOT NULL DEFAULT '',
  featured_homepage    INTEGER NOT NULL DEFAULT 0,
  featured_digest      INTEGER NOT NULL DEFAULT 0,
  featured_calendar    INTEGER NOT NULL DEFAULT 1,
  schema_eligible      INTEGER NOT NULL DEFAULT 1,
  related_guide_slug   TEXT    NOT NULL DEFAULT '',
  related_news_slug    TEXT    NOT NULL DEFAULT '',
  created_at           TEXT    NOT NULL,
  updated_at           TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_pages (
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

CREATE INDEX IF NOT EXISTS idx_news_posts_status ON news_posts (status);
CREATE INDEX IF NOT EXISTS idx_news_posts_date_published ON news_posts (date_published DESC);
CREATE INDEX IF NOT EXISTS idx_news_posts_featured_homepage ON news_posts (featured_homepage);
CREATE INDEX IF NOT EXISTS idx_news_posts_category ON news_posts (category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);
CREATE INDEX IF NOT EXISTS idx_events_date_start ON events (event_date_start);
CREATE INDEX IF NOT EXISTS idx_events_year ON events (year);
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);
CREATE INDEX IF NOT EXISTS idx_events_featured_calendar ON events (featured_calendar);
CREATE INDEX IF NOT EXISTS idx_calendar_pages_status ON calendar_pages (status);
CREATE INDEX IF NOT EXISTS idx_calendar_pages_year ON calendar_pages (year);
CREATE INDEX IF NOT EXISTS idx_calendar_pages_type ON calendar_pages (calendar_type);
CREATE INDEX IF NOT EXISTS idx_calendar_pages_month ON calendar_pages (year, month);
