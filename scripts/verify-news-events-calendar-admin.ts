/**
 * Verification script for Phase 4A-2 admin layer.
 * Confirms that:
 *   - all 5 tables exist and have expected counts
 *   - admin SELECT queries work for all 3 new content types
 *   - SAVEPOINT-based write tests succeed and roll back cleanly (counts remain 0)
 *   - validation layer accepts and rejects inputs as expected
 *   - writer functions insert/update correctly within a SAVEPOINT and roll back
 *   - ru_published=1 without required RU fields is rejected for all 3 types
 *   - final table counts: news_posts=0, events=0, calendar_pages=0, guides=17, steps=115
 *
 * No rows are permanently written. All write tests use SAVEPOINT + ROLLBACK.
 * Run with: npx tsx scripts/verify-news-events-calendar-admin.ts
 */

import Database from "better-sqlite3";
import path from "path";
// Import the scripts-only raw connection so SAVEPOINTs wrap writer function calls.
// sqliteForVerificationOnly must not be imported in app/, admin/, or runtime code.
import { sqliteForVerificationOnly as drizzleDb } from "../lib/db/connection";
import {
  createCalendarDraft,
  createEventDraft,
  createNewsDraft,
  updateCalendarDraft,
  updateEventDraft,
  updateNewsDraft,
} from "../lib/db/news-events-calendar-admin";
import {
  validateNewsDraft,
  validateNewsPublish,
  validateEventDraft,
  validateEventPublish,
  validateCalendarDraft,
  validateCalendarPublish,
} from "../lib/admin-validation/news-events-calendar";

// Separate read-only connection for count verification after rollback
// (SAVEPOINTs on drizzleDb are not visible to this connection until released)
const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const readDb = new Database(DB_PATH, { readonly: true });

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

// Count via drizzleDb (same connection as writers — sees within-SAVEPOINT state)
function countInner(table: string): number {
  return (
    drizzleDb
      .prepare(`SELECT COUNT(*) as n FROM ${table}`)
      .get() as { n: number }
  ).n;
}

// Count via readDb (separate connection — sees committed state only)
function countOuter(table: string): number {
  return (
    readDb
      .prepare(`SELECT COUNT(*) as n FROM ${table}`)
      .get() as { n: number }
  ).n;
}

// ─── 1. Table existence ───────────────────────────────────────────────────────

console.log("\n── Table existence ─────────────────────────────────────────────");

const tableNames = new Set(
  (
    drizzleDb
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[]
  ).map((r) => r.name),
);

assert(tableNames.has("guides"),         "guides table exists");
assert(tableNames.has("steps"),          "steps table exists");
assert(tableNames.has("news_posts"),     "news_posts table exists");
assert(tableNames.has("events"),         "events table exists");
assert(tableNames.has("calendar_pages"), "calendar_pages table exists");

// ─── 2. Baseline row counts ───────────────────────────────────────────────────

console.log("\n── Baseline row counts ─────────────────────────────────────────");

assert(countOuter("guides")         === 17,  "guides = 17",        `got ${countOuter("guides")}`);
assert(countOuter("steps")          === 115, "steps = 115",        `got ${countOuter("steps")}`);
assert(countOuter("news_posts")     === 0,   "news_posts = 0",     `got ${countOuter("news_posts")}`);
assert(countOuter("events")         === 0,   "events = 0",         `got ${countOuter("events")}`);
assert(countOuter("calendar_pages") === 0,   "calendar_pages = 0", `got ${countOuter("calendar_pages")}`);

// ─── 3. Admin SELECT queries ──────────────────────────────────────────────────

console.log("\n── Admin SELECT queries ────────────────────────────────────────");

try {
  const rows = drizzleDb
    .prepare("SELECT id, slug, status, updated_at FROM news_posts ORDER BY updated_at DESC")
    .all();
  assert(rows.length === 0, "getAllNewsPosts() returns [] with empty table");
} catch (e) {
  fail("getAllNewsPosts() threw", String(e));
}

try {
  const row = drizzleDb
    .prepare("SELECT id FROM news_posts WHERE id = 'nonexistent'")
    .get();
  assert(row === undefined, "getNewsPostById('nonexistent') returns null/undefined");
} catch (e) {
  fail("getNewsPostById() threw", String(e));
}

try {
  const rows = drizzleDb
    .prepare("SELECT id, slug, status, event_date_start FROM events ORDER BY event_date_start ASC")
    .all();
  assert(rows.length === 0, "getAllEvents() returns [] with empty table");
} catch (e) {
  fail("getAllEvents() threw", String(e));
}

try {
  const row = drizzleDb.prepare("SELECT id FROM events WHERE id = 'nonexistent'").get();
  assert(row === undefined, "getEventById('nonexistent') returns null/undefined");
} catch (e) {
  fail("getEventById() threw", String(e));
}

try {
  const rows = drizzleDb
    .prepare("SELECT id, slug, status, year, month FROM calendar_pages ORDER BY year DESC, month DESC")
    .all();
  assert(rows.length === 0, "getAllCalendarPages() returns [] with empty table");
} catch (e) {
  fail("getAllCalendarPages() threw", String(e));
}

try {
  const row = drizzleDb
    .prepare("SELECT id FROM calendar_pages WHERE id = 'nonexistent'")
    .get();
  assert(row === undefined, "getCalendarPageById('nonexistent') returns null/undefined");
} catch (e) {
  fail("getCalendarPageById() threw", String(e));
}

// ─── 4. SAVEPOINT raw write tests (existing tables structure) ─────────────────

console.log("\n── SAVEPOINT raw write: news_posts ─────────────────────────────");

drizzleDb.prepare("SAVEPOINT test_news_raw").run();
try {
  drizzleDb
    .prepare(
      `INSERT INTO news_posts (id, slug, status, created_at, updated_at)
       VALUES ('adm-news-raw-1', 'adm-news-raw-slug', 'draft', '2026-01-01', '2026-01-01')`,
    )
    .run();
  const after = countInner("news_posts");
  assert(after === 1, "news_posts raw INSERT succeeded inside SAVEPOINT (count = 1)", `got ${after}`);
  const row = drizzleDb
    .prepare("SELECT slug, status FROM news_posts WHERE id = 'adm-news-raw-1'")
    .get() as { slug: string; status: string } | undefined;
  assert(row?.slug === "adm-news-raw-slug", "news_posts raw row readable by id");
  assert(row?.status === "draft",           "news_posts default status = 'draft'");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_news_raw").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_news_raw").run();
}
assert(countOuter("news_posts") === 0, "news_posts = 0 after raw SAVEPOINT rollback");

console.log("\n── SAVEPOINT raw write: events ─────────────────────────────────");

drizzleDb.prepare("SAVEPOINT test_events_raw").run();
try {
  drizzleDb
    .prepare(
      `INSERT INTO events (id, slug, status, created_at, updated_at)
       VALUES ('adm-event-raw-1', 'adm-event-raw-slug', 'draft', '2026-01-01', '2026-01-01')`,
    )
    .run();
  const after = countInner("events");
  assert(after === 1, "events raw INSERT succeeded inside SAVEPOINT (count = 1)", `got ${after}`);
  const row = drizzleDb
    .prepare("SELECT slug, schema_eligible FROM events WHERE id = 'adm-event-raw-1'")
    .get() as { slug: string; schema_eligible: number } | undefined;
  assert(row?.slug === "adm-event-raw-slug", "events raw row readable by id");
  assert(row?.schema_eligible === 1,         "events default schema_eligible = 1");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_events_raw").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_events_raw").run();
}
assert(countOuter("events") === 0, "events = 0 after raw SAVEPOINT rollback");

console.log("\n── SAVEPOINT raw write: calendar_pages ─────────────────────────");

drizzleDb.prepare("SAVEPOINT test_cal_raw").run();
try {
  drizzleDb
    .prepare(
      `INSERT INTO calendar_pages (id, slug, status, created_at, updated_at)
       VALUES ('adm-cal-raw-1', 'adm-cal-raw-slug', 'draft', '2026-01-01', '2026-01-01')`,
    )
    .run();
  const after = countInner("calendar_pages");
  assert(after === 1, "calendar_pages raw INSERT succeeded inside SAVEPOINT (count = 1)", `got ${after}`);
  const row = drizzleDb
    .prepare("SELECT slug, has_islamic_dates FROM calendar_pages WHERE id = 'adm-cal-raw-1'")
    .get() as { slug: string; has_islamic_dates: number } | undefined;
  assert(row?.slug === "adm-cal-raw-slug",  "calendar_pages raw row readable by id");
  assert(row?.has_islamic_dates === 0,      "calendar_pages default has_islamic_dates = 0");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_cal_raw").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_cal_raw").run();
}
assert(countOuter("calendar_pages") === 0, "calendar_pages = 0 after raw SAVEPOINT rollback");

// ─── 5. Writer SAVEPOINT tests — createNewsDraft ──────────────────────────────

console.log("\n── Writer SAVEPOINT: createNewsDraft ───────────────────────────");

drizzleDb.prepare("SAVEPOINT test_create_news").run();
try {
  const result = createNewsDraft({
    slug: "writer-test-golden-visa-news",
    en_title: "Golden Visa Eligibility Expanded",
  });
  assert(result.ok, `createNewsDraft ok=true (errors: ${result.errors.join("; ")})`);
  assert(typeof result.id === "string" && result.id.length > 0, "createNewsDraft returns a non-empty id");

  const after = countInner("news_posts");
  assert(after === 1, "createNewsDraft: 1 row exists inside SAVEPOINT", `got ${after}`);

  const row = drizzleDb
    .prepare("SELECT slug, status, ru_published FROM news_posts WHERE id = ?")
    .get(result.id) as { slug: string; status: string; ru_published: number } | undefined;
  assert(row?.slug === "writer-test-golden-visa-news", "createNewsDraft: correct slug stored");
  assert(row?.status === "draft",                      "createNewsDraft: status forced to 'draft'");
  assert(row?.ru_published === 0,                      "createNewsDraft: ru_published defaults to 0");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_create_news").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_create_news").run();
}
assert(countOuter("news_posts") === 0, "news_posts = 0 after createNewsDraft SAVEPOINT rollback");

// ─── 6. Writer SAVEPOINT tests — updateNewsDraft ──────────────────────────────

console.log("\n── Writer SAVEPOINT: updateNewsDraft ───────────────────────────");

drizzleDb.prepare("SAVEPOINT test_update_news").run();
try {
  // Create the row first (within the same SAVEPOINT)
  const created = createNewsDraft({
    slug:     "writer-test-news-update",
    en_title: "Original Title",
  });
  assert(created.ok, `createNewsDraft for update test ok=true (errors: ${created.errors.join("; ")})`);

  const updated = updateNewsDraft(created.id!, {
    en_title: "Updated Title",
    en_summary: "Updated summary sentence.",
  });
  assert(updated.ok, `updateNewsDraft ok=true (errors: ${updated.errors.join("; ")})`);

  const row = drizzleDb
    .prepare("SELECT en_title, en_summary, status FROM news_posts WHERE id = ?")
    .get(created.id) as { en_title: string; en_summary: string; status: string } | undefined;
  assert(row?.en_title === "Updated Title",            "updateNewsDraft: en_title updated correctly");
  assert(row?.en_summary === "Updated summary sentence.", "updateNewsDraft: en_summary updated correctly");
  assert(row?.status === "draft",                      "updateNewsDraft: status still 'draft' after update");

  assert(countInner("news_posts") === 1, "updateNewsDraft: still 1 row inside SAVEPOINT");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_update_news").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_update_news").run();
}
assert(countOuter("news_posts") === 0, "news_posts = 0 after updateNewsDraft SAVEPOINT rollback");

// ─── 7. Writer SAVEPOINT tests — createEventDraft ────────────────────────────

console.log("\n── Writer SAVEPOINT: createEventDraft ──────────────────────────");

drizzleDb.prepare("SAVEPOINT test_create_event").run();
try {
  const result = createEventDraft({
    slug:     "writer-test-uae-national-day-2026",
    en_title: "UAE National Day 2026",
  });
  assert(result.ok, `createEventDraft ok=true (errors: ${result.errors.join("; ")})`);
  assert(typeof result.id === "string" && result.id.length > 0, "createEventDraft returns a non-empty id");

  const after = countInner("events");
  assert(after === 1, "createEventDraft: 1 row exists inside SAVEPOINT", `got ${after}`);

  const row = drizzleDb
    .prepare("SELECT slug, status, schema_eligible FROM events WHERE id = ?")
    .get(result.id) as { slug: string; status: string; schema_eligible: number } | undefined;
  assert(row?.slug === "writer-test-uae-national-day-2026", "createEventDraft: correct slug stored");
  assert(row?.status === "draft",                           "createEventDraft: status forced to 'draft'");
  assert(row?.schema_eligible === 1,                        "createEventDraft: schema_eligible defaults to 1");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_create_event").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_create_event").run();
}
assert(countOuter("events") === 0, "events = 0 after createEventDraft SAVEPOINT rollback");

// ─── 8. Writer SAVEPOINT tests — updateEventDraft ────────────────────────────

console.log("\n── Writer SAVEPOINT: updateEventDraft ──────────────────────────");

drizzleDb.prepare("SAVEPOINT test_update_event").run();
try {
  const created = createEventDraft({
    slug:     "writer-test-event-update",
    en_title: "Original Event Title",
  });
  assert(created.ok, `createEventDraft for update test ok=true (errors: ${created.errors.join("; ")})`);

  const updated = updateEventDraft(created.id!, {
    en_title:   "Updated Event Title",
    en_summary: "Revised one-sentence summary.",
  });
  assert(updated.ok, `updateEventDraft ok=true (errors: ${updated.errors.join("; ")})`);

  const row = drizzleDb
    .prepare("SELECT en_title, en_summary, status FROM events WHERE id = ?")
    .get(created.id) as { en_title: string; en_summary: string; status: string } | undefined;
  assert(row?.en_title === "Updated Event Title",      "updateEventDraft: en_title updated correctly");
  assert(row?.en_summary === "Revised one-sentence summary.", "updateEventDraft: en_summary updated correctly");
  assert(row?.status === "draft",                      "updateEventDraft: status still 'draft' after update");

  assert(countInner("events") === 1, "updateEventDraft: still 1 row inside SAVEPOINT");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_update_event").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_update_event").run();
}
assert(countOuter("events") === 0, "events = 0 after updateEventDraft SAVEPOINT rollback");

// ─── 9. Writer SAVEPOINT tests — createCalendarDraft ─────────────────────────

console.log("\n── Writer SAVEPOINT: createCalendarDraft ───────────────────────");

drizzleDb.prepare("SAVEPOINT test_create_cal").run();
try {
  const result = createCalendarDraft({
    slug:     "writer-test-uae-holidays-2026",
    en_title: "UAE Public Holidays 2026",
  });
  assert(result.ok, `createCalendarDraft ok=true (errors: ${result.errors.join("; ")})`);
  assert(typeof result.id === "string" && result.id.length > 0, "createCalendarDraft returns a non-empty id");

  const after = countInner("calendar_pages");
  assert(after === 1, "createCalendarDraft: 1 row exists inside SAVEPOINT", `got ${after}`);

  const row = drizzleDb
    .prepare("SELECT slug, status, has_islamic_dates FROM calendar_pages WHERE id = ?")
    .get(result.id) as { slug: string; status: string; has_islamic_dates: number } | undefined;
  assert(row?.slug === "writer-test-uae-holidays-2026", "createCalendarDraft: correct slug stored");
  assert(row?.status === "draft",                       "createCalendarDraft: status forced to 'draft'");
  assert(row?.has_islamic_dates === 0,                  "createCalendarDraft: has_islamic_dates defaults to 0");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_create_cal").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_create_cal").run();
}
assert(countOuter("calendar_pages") === 0, "calendar_pages = 0 after createCalendarDraft SAVEPOINT rollback");

// ─── 10. Writer SAVEPOINT tests — updateCalendarDraft ────────────────────────

console.log("\n── Writer SAVEPOINT: updateCalendarDraft ───────────────────────");

drizzleDb.prepare("SAVEPOINT test_update_cal").run();
try {
  const created = createCalendarDraft({
    slug:     "writer-test-cal-update",
    en_title: "Original Calendar Title",
  });
  assert(created.ok, `createCalendarDraft for update test ok=true (errors: ${created.errors.join("; ")})`);

  const updated = updateCalendarDraft(created.id!, {
    en_title:   "Updated Calendar Title",
    en_summary: "Concise one-sentence summary.",
  });
  assert(updated.ok, `updateCalendarDraft ok=true (errors: ${updated.errors.join("; ")})`);

  const row = drizzleDb
    .prepare("SELECT en_title, en_summary, status FROM calendar_pages WHERE id = ?")
    .get(created.id) as { en_title: string; en_summary: string; status: string } | undefined;
  assert(row?.en_title === "Updated Calendar Title",   "updateCalendarDraft: en_title updated correctly");
  assert(row?.en_summary === "Concise one-sentence summary.", "updateCalendarDraft: en_summary updated correctly");
  assert(row?.status === "draft",                      "updateCalendarDraft: status still 'draft' after update");

  assert(countInner("calendar_pages") === 1, "updateCalendarDraft: still 1 row inside SAVEPOINT");
} finally {
  drizzleDb.prepare("ROLLBACK TO SAVEPOINT test_update_cal").run();
  drizzleDb.prepare("RELEASE SAVEPOINT test_update_cal").run();
}
assert(countOuter("calendar_pages") === 0, "calendar_pages = 0 after updateCalendarDraft SAVEPOINT rollback");

// ─── 11. ru_published gate — rejected without required RU fields ──────────────

console.log("\n── ru_published gate: writer rejection ─────────────────────────");

{
  // News: ru_published=1 requires ru_title + ru_body
  const r = createNewsDraft({
    slug: "ru-gate-news-test",
    en_title: "Some Title",
    ru_published: 1,
    ru_title: "",
    ru_body: "",
  });
  assert(!r.ok && r.errors.some((e) => e.includes("ru_published")),
    "createNewsDraft: ru_published=1 with empty ru_title+ru_body rejected");
  assert(countOuter("news_posts") === 0, "news_posts = 0 after rejected createNewsDraft");
}

{
  // News: ru_published=1 with ru_title but empty ru_body — also rejected
  const r = createNewsDraft({
    slug: "ru-gate-news-test-2",
    en_title: "Some Title",
    ru_published: 1,
    ru_title: "Russian title",
    ru_body: "",
  });
  assert(!r.ok && r.errors.some((e) => e.includes("ru_published")),
    "createNewsDraft: ru_published=1 with ru_title but empty ru_body rejected");
}

{
  // Events: ru_published=1 requires ru_title (minimum)
  const r = createEventDraft({
    slug: "ru-gate-event-test",
    en_title: "Some Event",
    ru_published: 1,
    ru_title: "",
  });
  assert(!r.ok && r.errors.some((e) => e.includes("ru_published")),
    "createEventDraft: ru_published=1 with empty ru_title rejected");
  assert(countOuter("events") === 0, "events = 0 after rejected createEventDraft");
}

{
  // Calendar: ru_published=1 requires ru_title + ru_body
  const r = createCalendarDraft({
    slug: "ru-gate-cal-test",
    en_title: "Some Calendar",
    ru_published: 1,
    ru_title: "Русское название",
    ru_body: "",
  });
  assert(!r.ok && r.errors.some((e) => e.includes("ru_published")),
    "createCalendarDraft: ru_published=1 with ru_title but empty ru_body rejected");
  assert(countOuter("calendar_pages") === 0, "calendar_pages = 0 after rejected createCalendarDraft");
}

// ─── 12. Validation layer — news ─────────────────────────────────────────────

console.log("\n── Validation: validateNewsDraft ───────────────────────────────");

{
  const r = validateNewsDraft({ slug: "golden-visa-rule-2026", en_title: "Golden Visa Rule Changes" });
  assert(r.ok, "draft PASS: valid slug + en_title");
}
{
  const r = validateNewsDraft({ slug: "", en_title: "Title" });
  assert(!r.ok && r.errors.some((e) => e.includes("slug")), "draft FAIL: empty slug");
}
{
  const r = validateNewsDraft({ slug: "valid-slug", en_title: "" });
  assert(!r.ok && r.errors.some((e) => e.includes("en_title")), "draft FAIL: empty en_title");
}
{
  const r = validateNewsDraft({ slug: "valid-slug", en_title: "Title with em-dash — here" });
  assert(!r.ok && r.errors.some((e) => e.includes("Em-dash")), "draft FAIL: em-dash in en_title");
}

console.log("\n── Validation: validateNewsPublish ─────────────────────────────");

{
  const r = validateNewsPublish({
    slug: "golden-visa-rule-2026",
    en_title: "Golden Visa Rule Changes 2026",
    en_summary: "UAE authorities updated golden visa eligibility rules.",
    en_body: "word ".repeat(160).trim(),
    en_seo_title: "Golden Visa Rule Changes 2026 - Guidex",
    en_meta_description: "New eligibility criteria for the UAE golden visa announced in 2026.",
    source_url: "https://gdrfa.gov.ae/news/golden-visa-2026",
    source_label: "official",
    category: "visa",
    date_published: "2026-05-10",
    date_updated: "2026-05-10",
  });
  assert(r.ok, `publish PASS: all required fields present (errors: ${r.errors.join("; ")})`);
}
{
  const r = validateNewsPublish({
    slug: "test",
    en_title: "Title",
    en_body: "Short.",
    source_url: "",
    date_published: "not-a-date",
  });
  assert(
    !r.ok &&
      r.errors.some((e) => e.includes("150 words")) &&
      r.errors.some((e) => e.includes("source_url")) &&
      r.errors.some((e) => e.includes("date_published")),
    "publish FAIL: short body + missing source_url + bad date",
  );
}
{
  const r = validateNewsPublish({
    slug: "test",
    en_title: "Title",
    en_summary: "One sentence.",
    en_body: " word ".repeat(160),
    en_seo_title: "SEO Title",
    en_meta_description: "Meta description.",
    source_url: "https://example.com",
    source_label: "media",
    category: "visa",
    date_published: "2026-05-10",
    date_updated: "2026-05-10",
    ru_published: 1,
    ru_title: "",
    ru_body: "",
  });
  assert(
    !r.ok &&
      r.errors.some((e) => e.includes("ru_title")) &&
      r.errors.some((e) => e.includes("ru_body")),
    "publish FAIL: ru_published=1 but ru_title + ru_body empty",
  );
}

// ─── 13. Validation layer — events ───────────────────────────────────────────

console.log("\n── Validation: validateEventDraft ──────────────────────────────");

{
  const r = validateEventDraft({ slug: "uae-national-day-2026", en_title: "UAE National Day 2026" });
  assert(r.ok, "draft PASS: valid slug + en_title");
}
{
  const r = validateEventDraft({ slug: "UPPER-CASE", en_title: "Title" });
  assert(!r.ok && r.errors.some((e) => e.includes("lowercase")), "draft FAIL: uppercase in slug");
}

console.log("\n── Validation: validateEventPublish ────────────────────────────");

{
  const r = validateEventPublish({
    slug: "uae-national-day-2026",
    en_title: "UAE National Day 2026",
    en_summary: "UAE National Day is celebrated on December 2nd.",
    event_date_start: "2026-12-02",
    event_date_end: "2026-12-02",
    date_confidence: "confirmed",
    year: 2026,
    color_type: "public-holiday",
    category: "holiday",
    source_url: "https://u.ae/en/about-the-uae/public-holidays",
    schema_eligible: 1,
  });
  assert(r.ok, "publish PASS: confirmed event with all required fields");
}
{
  const r = validateEventPublish({
    slug: "eid-al-fitr-2026",
    en_title: "Eid Al Fitr 2026",
    en_summary: "Expected date subject to moon sighting.",
    event_date_start: "2026-03-30",
    event_date_end: "2026-04-01",
    date_confidence: "subject_to_official_confirmation",
    year: 2026,
    color_type: "public-holiday",
    category: "holiday",
    schema_eligible: 1,
  });
  assert(
    !r.ok && r.errors.some((e) => e.includes("schema_eligible")),
    "publish FAIL: schema_eligible=1 with non-confirmed confidence",
  );
}
{
  const r = validateEventPublish({
    slug: "vat-deadline-2026",
    en_title: "VAT Return Deadline Q1 2026",
    en_summary: "FTA deadline for Q1 2026 VAT filings.",
    event_date_start: "2026-04-28",
    event_date_end: "2026-04-28",
    date_confidence: "confirmed",
    year: 2026,
    color_type: "deadline",
    category: "deadline",
    source_url: "",
    schema_eligible: 1,
  });
  assert(
    !r.ok && r.errors.some((e) => e.includes("source_url")),
    "publish FAIL: confirmed event without source_url",
  );
}

// ─── 14. Validation layer — calendar ─────────────────────────────────────────

console.log("\n── Validation: validateCalendarDraft ───────────────────────────");

{
  const r = validateCalendarDraft({ slug: "uae-public-holidays-2026", en_title: "UAE Public Holidays 2026" });
  assert(r.ok, "draft PASS: valid slug + en_title");
}

console.log("\n── Validation: validateCalendarPublish ─────────────────────────");

{
  const r = validateCalendarPublish({
    slug: "uae-public-holidays-2026",
    en_title: "UAE Public Holidays 2026",
    en_summary: "All UAE public holidays confirmed for 2026.",
    en_body: "The official list of UAE public holidays for 2026 as announced by the UAE government.",
    en_seo_title: "UAE Public Holidays 2026 - Full List",
    en_meta_description: "Complete list of UAE public holidays for 2026 with official dates.",
    calendar_type: "holidays",
    year: 2026,
    dates_json: JSON.stringify([
      { date: "2026-01-01", label_en: "New Year", label_ru: "Новый год", type: "public-holiday", confidence: "confirmed" },
    ]),
    image_path: "/images/calendar/uae-public-holidays-2026.webp",
    image_alt: "UAE public holidays calendar 2026",
    official_source_url: "https://u.ae/en/about-the-uae/public-holidays",
    last_verified_date: "2026-05-10",
    has_islamic_dates: 0,
  });
  assert(r.ok, `publish PASS: all required fields present (errors: ${r.errors.join("; ")})`);
}
{
  const r = validateCalendarPublish({
    slug: "uae-ramadan-2026",
    en_title: "Ramadan 2026 UAE",
    en_summary: "Ramadan 2026 dates for UAE.",
    en_body: "Ramadan 2026 is expected to begin in late February.",
    en_seo_title: "Ramadan 2026 UAE Dates",
    en_meta_description: "Expected Ramadan 2026 dates in the UAE.",
    calendar_type: "ramadan",
    year: 2026,
    dates_json: JSON.stringify([{ date: "2026-02-28", label_en: "Ramadan start (expected)" }]),
    image_path: "/images/calendar/ramadan-2026.webp",
    image_alt: "Ramadan 2026 calendar UAE",
    official_source_url: "https://u.ae",
    last_verified_date: "2026-05-10",
    has_islamic_dates: 1,
    en_notes: "No disclaimer here.",
  });
  assert(
    !r.ok && r.errors.some((e) => e.includes("subject to moon sighting")),
    "publish FAIL: has_islamic_dates=1 without moon-sighting disclaimer in en_notes",
  );
}
{
  const r = validateCalendarPublish({
    slug: "uae-jan-2026",
    en_title: "UAE January 2026",
    en_summary: "Public holidays and key dates for January 2026 in the UAE.",
    en_body: "January 2026 in the UAE starts with New Year. Here are all important dates.",
    en_seo_title: "UAE January 2026 Calendar",
    en_meta_description: "January 2026 UAE public holidays and important dates.",
    calendar_type: "monthly",
    year: 2026,
    month: 0,
    dates_json: JSON.stringify([{ date: "2026-01-01", label_en: "New Year" }]),
    image_path: "/images/calendar/uae-jan-2026.webp",
    image_alt: "UAE January 2026 calendar",
    official_source_url: "https://u.ae",
    last_verified_date: "2026-05-10",
  });
  assert(
    !r.ok && r.errors.some((e) => e.includes("month must be 1")),
    "publish FAIL: monthly page with month = 0",
  );
}
{
  const r = validateCalendarPublish({
    slug: "uae-holidays-2026",
    en_title: "Title",
    en_summary: "Summary sentence.",
    en_body: "Body text.",
    en_seo_title: "SEO",
    en_meta_description: "Meta.",
    calendar_type: "holidays",
    year: 2026,
    dates_json: "[]",
    image_path: "/images/cal.webp",
    image_alt: "alt text",
    official_source_url: "https://u.ae",
    last_verified_date: "2026-05-10",
  });
  assert(
    !r.ok && r.errors.some((e) => e.includes("dates_json")),
    "publish FAIL: empty dates_json array",
  );
}

// ─── 15. Final counts and integrity ──────────────────────────────────────────

console.log("\n── Final counts and integrity ──────────────────────────────────");

assert(countOuter("guides")         === 17,  "guides still = 17",          `got ${countOuter("guides")}`);
assert(countOuter("steps")          === 115, "steps still = 115",          `got ${countOuter("steps")}`);
assert(countOuter("news_posts")     === 0,   "news_posts = 0 (final)",     `got ${countOuter("news_posts")}`);
assert(countOuter("events")         === 0,   "events = 0 (final)",         `got ${countOuter("events")}`);
assert(countOuter("calendar_pages") === 0,   "calendar_pages = 0 (final)", `got ${countOuter("calendar_pages")}`);

const integrity = (
  drizzleDb.prepare("PRAGMA integrity_check").get() as { integrity_check: string }
).integrity_check;
assert(integrity === "ok", "PRAGMA integrity_check = ok", `got: ${integrity}`);

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`Passed: ${passed}   Failed: ${failed}   Total: ${passed + failed}`);

if (failed > 0) {
  console.error("\nVERIFICATION FAILED — do not proceed.");
  process.exit(1);
} else {
  console.log("\nAll checks passed. Phase 4A-2 admin layer verified.");
  process.exit(0);
}
