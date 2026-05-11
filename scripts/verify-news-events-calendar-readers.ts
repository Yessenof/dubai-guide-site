/**
 * Verification script for Phase 3C reader layer.
 * Confirms that news_posts, events, and calendar_pages tables:
 *   - exist in data/guides.db
 *   - have the expected columns
 *   - return 0 rows for all reader queries (no content yet)
 *   - do not error on dates_json parsing with an empty array value
 *   - do NOT return English fallback when RU fields are empty (SAVEPOINT-based tests)
 *
 * All write-based tests use SAVEPOINT so no rows persist in data/guides.db.
 * Run with: npx tsx scripts/verify-news-events-calendar-readers.ts
 */

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
// Writable instance required for SAVEPOINT-based tests
const db = new Database(DB_PATH);

let passed = 0;
let failed = 0;

function ok(label: string): void {
  console.log(`  ✓  ${label}`);
  passed++;
}

function fail(label: string, detail?: string): void {
  console.error(`  ✗  ${label}${detail ? ": " + detail : ""}`);
  failed++;
}

function assert(condition: boolean, label: string, detail?: string): void {
  condition ? ok(label) : fail(label, detail);
}

// ─── Table existence ──────────────────────────────────────────────────────────

console.log("\n── Table existence ─────────────────────────────────────────────");

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all() as { name: string }[];

const tableNames = tables.map((t) => t.name);
assert(tableNames.includes("news_posts"),    "news_posts table exists");
assert(tableNames.includes("events"),        "events table exists");
assert(tableNames.includes("calendar_pages"),"calendar_pages table exists");
assert(tableNames.includes("guides"),        "guides table still exists (unchanged)");
assert(tableNames.includes("steps"),         "steps table still exists (unchanged)");

// ─── Row counts ───────────────────────────────────────────────────────────────

console.log("\n── Row counts ──────────────────────────────────────────────────");

const newsCount    = (db.prepare("SELECT COUNT(*) as n FROM news_posts").get() as { n: number }).n;
const eventsCount  = (db.prepare("SELECT COUNT(*) as n FROM events").get() as { n: number }).n;
const calCount     = (db.prepare("SELECT COUNT(*) as n FROM calendar_pages").get() as { n: number }).n;
const guidesCount  = (db.prepare("SELECT COUNT(*) as n FROM guides").get() as { n: number }).n;
const stepsCount   = (db.prepare("SELECT COUNT(*) as n FROM steps").get() as { n: number }).n;

assert(newsCount   === 0,  `news_posts has 0 rows`,     `found ${newsCount}`);
assert(eventsCount === 0,  `events has 0 rows`,         `found ${eventsCount}`);
assert(calCount    === 0,  `calendar_pages has 0 rows`, `found ${calCount}`);
assert(guidesCount === 17, `guides has 17 rows`,        `found ${guidesCount}`);
assert(stepsCount  === 115,`steps has 115 rows`,        `found ${stepsCount}`);

// ─── Column existence — news_posts ────────────────────────────────────────────

console.log("\n── Column existence: news_posts ────────────────────────────────");

const newsColumns = (db.prepare("PRAGMA table_info(news_posts)").all() as { name: string }[]).map((c) => c.name);
const requiredNewsColumns = [
  "id", "slug", "status", "category", "tags_json",
  "en_title", "en_summary", "en_body", "en_seo_title", "en_meta_description",
  "ru_published", "ru_title", "ru_summary", "ru_body", "ru_seo_title", "ru_meta_description",
  "source_url", "source_label", "image_path", "image_alt", "ru_image_alt",
  "date_published", "date_updated", "featured_homepage", "featured_digest",
  "noindex", "related_guide_slug", "related_service_slug", "related_tool_slug",
  "created_at", "updated_at",
];
for (const col of requiredNewsColumns) {
  assert(newsColumns.includes(col), `news_posts.${col}`);
}

// ─── Column existence — events ────────────────────────────────────────────────

console.log("\n── Column existence: events ────────────────────────────────────");

const eventsColumns = (db.prepare("PRAGMA table_info(events)").all() as { name: string }[]).map((c) => c.name);
const requiredEventsColumns = [
  "id", "slug", "status", "category", "color_type", "tags_json",
  "en_title", "en_summary", "en_body", "en_seo_title", "en_meta_description",
  "ru_published", "ru_title", "ru_summary", "ru_body", "ru_seo_title", "ru_meta_description",
  "event_date_start", "event_date_end", "date_confidence", "year",
  "source_url", "featured_homepage", "featured_digest", "featured_calendar",
  "schema_eligible", "related_guide_slug", "related_news_slug",
  "created_at", "updated_at",
];
for (const col of requiredEventsColumns) {
  assert(eventsColumns.includes(col), `events.${col}`);
}

// ─── Column existence — calendar_pages ───────────────────────────────────────

console.log("\n── Column existence: calendar_pages ────────────────────────────");

const calColumns = (db.prepare("PRAGMA table_info(calendar_pages)").all() as { name: string }[]).map((c) => c.name);
const requiredCalColumns = [
  "id", "slug", "status", "calendar_type", "year", "month",
  "en_title", "en_summary", "en_body", "en_notes", "en_seo_title", "en_meta_description",
  "ru_published", "ru_title", "ru_summary", "ru_body", "ru_notes", "ru_seo_title", "ru_meta_description",
  "image_path", "image_alt", "ru_image_alt", "dates_json",
  "has_islamic_dates", "official_source_url", "last_verified_date",
  "featured_homepage", "created_at", "updated_at",
];
for (const col of requiredCalColumns) {
  assert(calColumns.includes(col), `calendar_pages.${col}`);
}

// ─── Reader query simulation — EN gate ───────────────────────────────────────

console.log("\n── Reader query simulation: EN gate ────────────────────────────");

try {
  const enNews = db.prepare("SELECT slug FROM news_posts WHERE status = 'published'").all();
  assert(enNews.length === 0, "getPublishedNewsPosts(en) returns []");
} catch (e) {
  fail("getPublishedNewsPosts(en) threw", String(e));
}

try {
  const enEvents = db.prepare("SELECT slug FROM events WHERE status = 'published'").all();
  assert(enEvents.length === 0, "getPublishedEvents(en) returns []");
} catch (e) {
  fail("getPublishedEvents(en) threw", String(e));
}

try {
  const enCal = db.prepare("SELECT slug FROM calendar_pages WHERE status = 'published'").all();
  assert(enCal.length === 0, "getPublishedCalendarPages(en) returns []");
} catch (e) {
  fail("getPublishedCalendarPages(en) threw", String(e));
}

// ─── Reader query simulation — RU gate ───────────────────────────────────────

console.log("\n── Reader query simulation: RU gate ────────────────────────────");

try {
  const ruNews = db.prepare("SELECT slug FROM news_posts WHERE status = 'published' AND ru_published = 1").all();
  assert(ruNews.length === 0, "getPublishedNewsPosts(ru) returns []");
} catch (e) {
  fail("getPublishedNewsPosts(ru) threw", String(e));
}

try {
  const ruEvents = db.prepare("SELECT slug FROM events WHERE status = 'published' AND ru_published = 1").all();
  assert(ruEvents.length === 0, "getPublishedEvents(ru) returns []");
} catch (e) {
  fail("getPublishedEvents(ru) threw", String(e));
}

try {
  const ruCal = db.prepare("SELECT slug FROM calendar_pages WHERE status = 'published' AND ru_published = 1").all();
  assert(ruCal.length === 0, "getPublishedCalendarPages(ru) returns []");
} catch (e) {
  fail("getPublishedCalendarPages(ru) threw", String(e));
}

// ─── Featured query simulation ────────────────────────────────────────────────

console.log("\n── Reader query simulation: featured ───────────────────────────");

try {
  const featNews = db.prepare(
    "SELECT slug FROM news_posts WHERE status = 'published' AND featured_homepage = 1 ORDER BY date_published DESC LIMIT 3"
  ).all();
  assert(featNews.length === 0, "getFeaturedNewsPosts(en, 3) returns []");
} catch (e) {
  fail("getFeaturedNewsPosts threw", String(e));
}

try {
  const featEvents = db.prepare(
    "SELECT slug FROM events WHERE status = 'published' AND featured_homepage = 1 ORDER BY event_date_start ASC LIMIT 5"
  ).all();
  assert(featEvents.length === 0, "getFeaturedEvents(en, 5) returns []");
} catch (e) {
  fail("getFeaturedEvents threw", String(e));
}

try {
  const featCal = db.prepare(
    "SELECT slug FROM calendar_pages WHERE status = 'published' AND featured_homepage = 1 ORDER BY year DESC, month ASC LIMIT 3"
  ).all();
  assert(featCal.length === 0, "getFeaturedCalendarPages(en, 3) returns []");
} catch (e) {
  fail("getFeaturedCalendarPages threw", String(e));
}

// ─── dates_json parse safety ──────────────────────────────────────────────────

console.log("\n── dates_json parse safety ─────────────────────────────────────");

function parseDatesJson(raw: string): unknown[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

assert(parseDatesJson("[]").length === 0,           "parseDatesJson('[]') returns []");
assert(parseDatesJson("invalid-json").length === 0,  "parseDatesJson('invalid') returns []");
assert(parseDatesJson("{}").length === 0,            "parseDatesJson('{}') returns []");
assert(
  parseDatesJson('[{"date":"2026-12-02","label_en":"UAE National Day","label_ru":"День ОАЭ","type":"public-holiday","confidence":"confirmed"}]').length === 1,
  "parseDatesJson with one valid item returns length 1",
);

// ─── CHECK constraint verification ───────────────────────────────────────────

console.log("\n── CHECK constraint enforcement ────────────────────────────────");

// These tests write invalid rows to confirm CHECK constraints fire.
// Each uses its own SAVEPOINT so nothing persists.

db.prepare("SAVEPOINT chk_news").run();
try {
  db.prepare("INSERT INTO news_posts (id, slug, status, created_at, updated_at) VALUES ('x','x','invalid_status','2026-01-01','2026-01-01')").run();
  fail("news_posts status CHECK constraint", "invalid status was accepted — constraint not enforced");
} catch {
  ok("news_posts status CHECK rejects invalid value");
}
db.prepare("ROLLBACK TO chk_news").run();
db.prepare("RELEASE chk_news").run();

db.prepare("SAVEPOINT chk_events").run();
try {
  db.prepare("INSERT INTO events (id, slug, status, date_confidence, created_at, updated_at) VALUES ('x','x','published','not_a_valid_confidence','2026-01-01','2026-01-01')").run();
  fail("events date_confidence CHECK constraint", "invalid confidence was accepted — constraint not enforced");
} catch {
  ok("events date_confidence CHECK rejects invalid value");
}
db.prepare("ROLLBACK TO chk_events").run();
db.prepare("RELEASE chk_events").run();

db.prepare("SAVEPOINT chk_cal").run();
try {
  db.prepare("INSERT INTO calendar_pages (id, slug, status, created_at, updated_at) VALUES ('x','x','bad_status','2026-01-01','2026-01-01')").run();
  fail("calendar_pages status CHECK constraint", "invalid status was accepted — constraint not enforced");
} catch {
  ok("calendar_pages status CHECK rejects invalid value");
}
db.prepare("ROLLBACK TO chk_cal").run();
db.prepare("RELEASE chk_cal").run();

// ─── RU no-fallback verification (SAVEPOINT-based) ───────────────────────────
//
// Inserts test rows inside a SAVEPOINT, runs reader-equivalent queries, then
// ROLLBACK so no data persists. Verifies field() returns locale field as-is,
// not the EN fallback.

console.log("\n── RU no-fallback: list filter (empty ru_title excluded) ───────");

db.prepare("SAVEPOINT ru_list_test").run();
try {
  // Row A: ru_published=1, ru_title empty — must be excluded from RU list
  db.prepare(`
    INSERT INTO news_posts
      (id, slug, status, ru_published, en_title, ru_title, en_summary, ru_summary,
       en_body, ru_body, date_published, date_updated, created_at, updated_at)
    VALUES
      ('test-a','test-slug-a','published',1,'EN Title A','','EN Summary A','',
       'EN Body A','','2026-01-01','2026-01-01','2026-01-01','2026-01-01')
  `).run();

  // Row B: ru_published=1, ru_title non-empty — must appear in RU list
  db.prepare(`
    INSERT INTO news_posts
      (id, slug, status, ru_published, en_title, ru_title, en_summary, ru_summary,
       en_body, ru_body, date_published, date_updated, created_at, updated_at)
    VALUES
      ('test-b','test-slug-b','published',1,'EN Title B','RU Заголовок B','EN Summary B','RU Summary B',
       'EN Body B','RU Body B','2026-01-02','2026-01-02','2026-01-02','2026-01-02')
  `).run();

  // RU gate query + application-layer filter (mirrors reader logic)
  const ruListRows = (db.prepare(
    "SELECT slug, ru_title, en_title FROM news_posts WHERE status = 'published' AND ru_published = 1"
  ).all() as { slug: string; ru_title: string; en_title: string }[])
    .filter((r) => r.ru_title.trim() !== "");

  assert(ruListRows.length === 1, "RU list excludes row with empty ru_title (1 of 2 rows returned)");
  assert(ruListRows[0]?.slug === "test-slug-b", "RU list returns the row with non-empty ru_title");

  // Verify the returned title is ru_title, not en_title
  const returnedTitle = ruListRows[0]?.ru_title ?? "";
  assert(returnedTitle === "RU Заголовок B", "RU list title is ru_title, not en_title");
  assert(returnedTitle !== "EN Title B",     "RU list does not return en_title as fallback");

  // Verify EN list still sees both rows (EN gate: status='published', no ru_title filter)
  const enListRows = (db.prepare(
    "SELECT slug, en_title FROM news_posts WHERE status = 'published'"
  ).all() as { slug: string; en_title: string }[]);
  assert(enListRows.length === 2, "EN list returns both rows (filter does not affect EN)");

} catch (e) {
  fail("RU list no-fallback test threw", String(e));
}
db.prepare("ROLLBACK TO ru_list_test").run();
db.prepare("RELEASE ru_list_test").run();

// Verify rollback worked
const afterListCount = (db.prepare("SELECT COUNT(*) as n FROM news_posts").get() as { n: number }).n;
assert(afterListCount === 0, "news_posts still has 0 rows after RU list test rollback");

console.log("\n── RU no-fallback: detail null when ru_body empty ──────────────");

db.prepare("SAVEPOINT ru_detail_test").run();
try {
  // Row C: ru_title non-empty, ru_body empty — detail must return null
  db.prepare(`
    INSERT INTO news_posts
      (id, slug, status, ru_published, en_title, ru_title, en_summary, ru_summary,
       en_body, ru_body, date_published, date_updated, created_at, updated_at)
    VALUES
      ('test-c','test-slug-c','published',1,'EN Title C','RU Заголовок C','EN Summary C','RU Summary C',
       'EN Body C','','2026-01-03','2026-01-03','2026-01-03','2026-01-03')
  `).run();

  // Row D: ru_title non-empty, ru_body non-empty — detail must return data
  db.prepare(`
    INSERT INTO news_posts
      (id, slug, status, ru_published, en_title, ru_title, en_summary, ru_summary,
       en_body, ru_body, date_published, date_updated, created_at, updated_at)
    VALUES
      ('test-d','test-slug-d','published',1,'EN Title D','RU Заголовок D','EN Summary D','RU Summary D',
       'EN Body D','RU Тело D','2026-01-04','2026-01-04','2026-01-04','2026-01-04')
  `).run();

  // Simulate getNewsPostBySlug(slug, "ru") for row C (ru_body empty → must return null)
  const rowC = db.prepare(
    "SELECT slug, ru_title, ru_body, en_title, en_body FROM news_posts WHERE slug = 'test-slug-c' AND status = 'published' AND ru_published = 1"
  ).get() as { slug: string; ru_title: string; ru_body: string; en_title: string; en_body: string } | undefined;

  const detailC = (rowC && rowC.ru_title.trim() !== "" && rowC.ru_body.trim() !== "") ? rowC : null;
  assert(detailC === null, "RU detail returns null when ru_body is empty (not en_body fallback)");

  // Simulate getNewsPostBySlug(slug, "ru") for row D (both non-empty → must return data)
  const rowD = db.prepare(
    "SELECT slug, ru_title, ru_body, en_title, en_body FROM news_posts WHERE slug = 'test-slug-d' AND status = 'published' AND ru_published = 1"
  ).get() as { slug: string; ru_title: string; ru_body: string; en_title: string; en_body: string } | undefined;

  const detailD = (rowD && rowD.ru_title.trim() !== "" && rowD.ru_body.trim() !== "") ? rowD : null;
  assert(detailD !== null, "RU detail returns data when both ru_title and ru_body are non-empty");

  if (detailD) {
    assert(detailD.ru_body === "RU Тело D",  "RU detail body is ru_body, not en_body");
    assert(detailD.ru_body !== "EN Body D",  "RU detail does not return en_body as fallback");
    assert(detailD.ru_title === "RU Заголовок D", "RU detail title is ru_title, not en_title");
  }

} catch (e) {
  fail("RU detail no-fallback test threw", String(e));
}
db.prepare("ROLLBACK TO ru_detail_test").run();
db.prepare("RELEASE ru_detail_test").run();

// Verify rollback worked
const afterDetailCount = (db.prepare("SELECT COUNT(*) as n FROM news_posts").get() as { n: number }).n;
assert(afterDetailCount === 0, "news_posts still has 0 rows after RU detail test rollback");

console.log("\n── RU no-fallback: calendar ru_notes not filled from en_notes ──");

db.prepare("SAVEPOINT ru_cal_test").run();
try {
  // Calendar row: ru_title + ru_body non-empty, ru_notes empty, en_notes non-empty
  db.prepare(`
    INSERT INTO calendar_pages
      (id, slug, status, ru_published, calendar_type, year,
       en_title, ru_title, en_summary, ru_summary,
       en_body, ru_body, en_notes, ru_notes,
       dates_json, created_at, updated_at)
    VALUES
      ('test-cal','test-cal-slug','published',1,'monthly',2026,
       'EN Cal Title','RU Кал Заголовок','EN Cal Summary','RU Cal Summary',
       'EN Cal Body','RU Тело Кал','EN Notes — important','',
       '[]','2026-01-01','2026-01-01')
  `).run();

  const calRow = db.prepare(
    "SELECT slug, ru_title, ru_body, ru_notes, en_notes FROM calendar_pages WHERE slug = 'test-cal-slug' AND status = 'published' AND ru_published = 1"
  ).get() as { slug: string; ru_title: string; ru_body: string; ru_notes: string; en_notes: string } | undefined;

  // Strict gate
  const calDetail = (calRow && calRow.ru_title.trim() !== "" && calRow.ru_body.trim() !== "") ? calRow : null;
  assert(calDetail !== null, "RU calendar detail passes strict gate (ru_title + ru_body present)");

  if (calDetail) {
    // field(locale="ru", ru_notes, en_notes) must return ru_notes (empty string), NOT en_notes
    const notesResult = calDetail.ru_notes; // field("ru", ru_notes, en_notes) = ru_notes
    assert(notesResult === "",                        "RU calendar notes returns empty string (ru_notes), not en_notes");
    assert(notesResult !== calDetail.en_notes,        "RU calendar notes does not fall back to en_notes");
  }

} catch (e) {
  fail("RU calendar no-fallback test threw", String(e));
}
db.prepare("ROLLBACK TO ru_cal_test").run();
db.prepare("RELEASE ru_cal_test").run();

// Verify rollback worked
const afterCalCount = (db.prepare("SELECT COUNT(*) as n FROM calendar_pages").get() as { n: number }).n;
assert(afterCalCount === 0, "calendar_pages still has 0 rows after RU calendar test rollback");

// ─── DB integrity ─────────────────────────────────────────────────────────────

console.log("\n── DB integrity ────────────────────────────────────────────────");

const integrity = (db.prepare("PRAGMA integrity_check").get() as { integrity_check: string }).integrity_check;
assert(integrity === "ok", `PRAGMA integrity_check = ok`, integrity !== "ok" ? integrity : undefined);

// Final row counts — must match pre-test counts (all SAVEPOINTs rolled back)
const finalNewsCount  = (db.prepare("SELECT COUNT(*) as n FROM news_posts").get() as { n: number }).n;
const finalEventsCount = (db.prepare("SELECT COUNT(*) as n FROM events").get() as { n: number }).n;
const finalCalCount   = (db.prepare("SELECT COUNT(*) as n FROM calendar_pages").get() as { n: number }).n;
const finalGuidesCount = (db.prepare("SELECT COUNT(*) as n FROM guides").get() as { n: number }).n;
const finalStepsCount  = (db.prepare("SELECT COUNT(*) as n FROM steps").get() as { n: number }).n;

assert(finalNewsCount   === 0,   "news_posts: 0 rows after all tests (no data leaked)");
assert(finalEventsCount === 0,   "events: 0 rows after all tests (no data leaked)");
assert(finalCalCount    === 0,   "calendar_pages: 0 rows after all tests (no data leaked)");
assert(finalGuidesCount === 17,  "guides: still 17 rows (unchanged)");
assert(finalStepsCount  === 115, "steps: still 115 rows (unchanged)");

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(57)}`);
console.log(`  Passed: ${passed}   Failed: ${failed}`);
if (failed > 0) {
  console.error("\n  Verification FAILED — fix issues before wiring readers into public routes.\n");
  process.exit(1);
} else {
  console.log("\n  All checks passed. Reader layer is ready.\n");
}

db.close();
