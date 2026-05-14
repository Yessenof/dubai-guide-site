/**
 * QA: Phase 4A-6 — Calendar Visual Posts admin workflow
 * Run: npx tsx scripts/qa-phase-4a6-calendar.ts
 */

import Database from "better-sqlite3";
import path from "path";
import { readFileSync } from "fs";

// Direct DB access for QA only — never use in app code
const raw = new Database(path.join(process.cwd(), "data/guides.db"));
export const sqliteForVerificationOnly = raw;

import {
  createCalendarDraft,
  updateCalendarDraft,
  publishCalendar,
  archiveCalendar,
  getCalendarPageById,
  getAllCalendarPages,
  calendarRowToInput,
} from "../lib/db/news-events-calendar-admin";

import {
  validateCalendarDraft,
  validateCalendarPublish,
  type CalendarInput,
} from "../lib/admin-validation/news-events-calendar";

// ─── Helpers ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const createdIds: string[] = [];

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  PASS: ${label}`);
    passed++;
  } else {
    console.error(`  FAIL: ${label}`);
    failed++;
  }
}

function cleanup() {
  for (const id of createdIds) {
    raw.prepare("DELETE FROM calendar_pages WHERE id = ?").run(id);
  }
}

function validPublishInput(overrides: Partial<CalendarInput> = {}): CalendarInput {
  return {
    slug:                "qa-cal-publish-test",
    calendar_type:       "yearly",
    year:                2026,
    en_title:            "UAE Business Compliance Calendar 2026",
    en_summary:          "Key deadlines for companies operating in the UAE.",
    en_body:             "This calendar covers corporate tax, VAT, and licensing deadlines for 2026.",
    en_notes:            "",
    en_seo_title:        "UAE Business Compliance Calendar 2026",
    en_meta_description: "Key tax, licensing, and visa deadlines for companies in the UAE.",
    image_path:          "/images/calendar/compliance-2026.jpg",
    image_alt:           "UAE compliance calendar 2026",
    dates_json:          JSON.stringify([
      {
        date:       "2026-07-31",
        label_en:   "E-Invoicing ASP Deadline",
        label_ru:   "",
        type:       "deadline",
        confidence: "expected",
        source:     "https://mof.gov.ae",
      },
    ]),
    has_islamic_dates:   0,
    official_source_url: "https://tax.gov.ae",
    last_verified_date:  new Date().toISOString().slice(0, 10),
    ru_published:        0,
    ru_title:            "",
    ru_body:             "",
    ...overrides,
  };
}

// ─── Section 1: Baseline — getAllCalendarPages ───────────────────────────────

console.log("\n[1] Baseline — getAllCalendarPages");
{
  const pages = getAllCalendarPages();
  assert(Array.isArray(pages), "getAllCalendarPages returns an array");
}

// ─── Section 2: createCalendarDraft — basic create ──────────────────────────

console.log("\n[2] createCalendarDraft — basic create");
let draftId = "";
{
  const result = createCalendarDraft({
    slug:     "qa-cal-basic-draft",
    en_title: "QA Calendar Draft",
    year:     2026,
  });
  assert(result.ok, "createCalendarDraft succeeds with slug + en_title + year");
  assert(typeof result.id === "string" && result.id.length > 0, "returns a valid id");
  if (result.id) {
    draftId = result.id;
    createdIds.push(draftId);
  }

  const row = getCalendarPageById(draftId);
  assert(row !== null, "getCalendarPageById finds the created row");
  assert(row?.status === "draft", "status is 'draft' on create");
  assert(row?.slug === "qa-cal-basic-draft", "slug is stored correctly");
  assert(row?.enTitle === "QA Calendar Draft", "en_title is stored correctly");
  assert(row?.datesJson === "[]", "dates_json defaults to []");
}

// ─── Section 3: createCalendarDraft — validation failures ───────────────────

console.log("\n[3] createCalendarDraft — validation failures");
{
  const r1 = createCalendarDraft({ en_title: "No slug" });
  assert(!r1.ok, "createCalendarDraft fails without slug");
  assert(r1.errors.some((e) => e.includes("slug")), "error mentions slug");

  const r2 = createCalendarDraft({ slug: "qa-cal-no-title" });
  assert(!r2.ok, "createCalendarDraft fails without en_title");
  assert(r2.errors.some((e) => e.includes("en_title")), "error mentions en_title");

  const r3 = createCalendarDraft({ slug: "INVALID SLUG!", en_title: "Bad" });
  assert(!r3.ok, "createCalendarDraft fails with invalid slug");
}

// ─── Section 4: updateCalendarDraft ─────────────────────────────────────────

console.log("\n[4] updateCalendarDraft");
{
  const r1 = updateCalendarDraft(draftId, { en_title: "Updated Calendar Title" });
  assert(r1.ok, "updateCalendarDraft succeeds");

  const row = getCalendarPageById(draftId);
  assert(row?.enTitle === "Updated Calendar Title", "en_title is updated in DB");
  assert(row?.status === "draft", "status remains draft after update");

  const r2 = updateCalendarDraft("nonexistent-id-xyz", { en_title: "X" });
  assert(!r2.ok, "updateCalendarDraft fails for nonexistent id");
}

// ─── Section 5: validateCalendarDraft ───────────────────────────────────────

console.log("\n[5] validateCalendarDraft");
{
  const v1 = validateCalendarDraft({ slug: "test-cal", en_title: "Test" });
  assert(v1.ok, "validateCalendarDraft passes with slug + en_title");

  const v2 = validateCalendarDraft({ slug: "", en_title: "Test" });
  assert(!v2.ok, "validateCalendarDraft fails empty slug");

  const v3 = validateCalendarDraft({ slug: "test", en_title: "" });
  assert(!v3.ok, "validateCalendarDraft fails empty en_title");

  const v4 = validateCalendarDraft({ slug: "test", en_title: "Title with — em dash" });
  assert(!v4.ok, "validateCalendarDraft fails em-dash in content");
}

// ─── Section 6: validateCalendarPublish — required fields ───────────────────

console.log("\n[6] validateCalendarPublish — required fields");
{
  const base = validPublishInput();
  const v1 = validateCalendarPublish(base);
  assert(v1.ok, "validateCalendarPublish passes with all required fields");

  const v2 = validateCalendarPublish({ ...base, en_summary: "" });
  assert(!v2.ok, "fails without en_summary");
  assert(v2.errors.some((e) => e.includes("en_summary")), "error mentions en_summary");

  const v3 = validateCalendarPublish({ ...base, en_body: "" });
  assert(!v3.ok, "fails without en_body");

  const v4 = validateCalendarPublish({ ...base, en_seo_title: "" });
  assert(!v4.ok, "fails without en_seo_title");

  const v5 = validateCalendarPublish({ ...base, en_meta_description: "" });
  assert(!v5.ok, "fails without en_meta_description");

  const v6 = validateCalendarPublish({ ...base, official_source_url: "" });
  assert(!v6.ok, "fails without official_source_url");

  const v7 = validateCalendarPublish({ ...base, last_verified_date: "" });
  assert(!v7.ok, "fails without last_verified_date");

  const v8 = validateCalendarPublish({ ...base, image_path: "" });
  assert(!v8.ok, "fails without image_path");

  const v9 = validateCalendarPublish({ ...base, image_path: "/img/x.jpg", image_alt: "" });
  assert(!v9.ok, "fails when image_path set but image_alt empty");
}

// ─── Section 7: validateCalendarPublish — dates_json rules ──────────────────

console.log("\n[7] validateCalendarPublish — dates_json rules");
{
  const base = validPublishInput();

  const v1 = validateCalendarPublish({ ...base, dates_json: "" });
  assert(!v1.ok, "fails when dates_json is empty string");

  const v2 = validateCalendarPublish({ ...base, dates_json: "[]" });
  assert(!v2.ok, "fails when dates_json is empty array");

  const v3 = validateCalendarPublish({ ...base, dates_json: "not json" });
  assert(!v3.ok, "fails when dates_json is invalid JSON");
  assert(v3.errors.some((e) => e.includes("valid JSON")), "error mentions JSON");

  const v4 = validateCalendarPublish({ ...base, dates_json: JSON.stringify([{ date: "2026-12-02", label_en: "Test" }]) });
  assert(v4.ok, "passes with valid non-empty dates_json");
}

// ─── Section 8: validateCalendarPublish — Islamic dates rule ────────────────

console.log("\n[8] validateCalendarPublish — Islamic dates rule");
{
  const base = validPublishInput();

  const v1 = validateCalendarPublish({ ...base, has_islamic_dates: 1, en_notes: "" });
  assert(!v1.ok, "fails when has_islamic_dates=1 but en_notes missing disclaimer");
  assert(v1.errors.some((e) => e.includes("moon sighting")), "error mentions moon sighting");

  const v2 = validateCalendarPublish({
    ...base,
    has_islamic_dates: 1,
    en_notes: "Islamic holiday dates are subject to moon sighting and may change.",
  });
  assert(v2.ok, "passes when has_islamic_dates=1 and en_notes includes disclaimer");

  const v3 = validateCalendarPublish({ ...base, has_islamic_dates: 0, en_notes: "" });
  assert(v3.ok, "passes when has_islamic_dates=0 even with empty en_notes");
}

// ─── Section 9: validateCalendarPublish — calendar_type + year + month ───────

console.log("\n[9] validateCalendarPublish — calendar_type, year, month");
{
  const base = validPublishInput();

  const v1 = validateCalendarPublish({ ...base, calendar_type: "invalid-type" });
  assert(!v1.ok, "fails with invalid calendar_type");
  assert(v1.errors.some((e) => e.includes("calendar_type")), "error mentions calendar_type");

  const v2 = validateCalendarPublish({ ...base, year: 0 });
  assert(!v2.ok, "fails with year = 0");

  const v3 = validateCalendarPublish({ ...base, calendar_type: "monthly", month: 0 });
  assert(!v3.ok, "fails when monthly + month = 0");

  const v4 = validateCalendarPublish({ ...base, calendar_type: "monthly", month: 6 });
  assert(v4.ok, "passes when monthly + month = 6");

  const v5 = validateCalendarPublish({ ...base, calendar_type: "yearly", month: undefined });
  assert(v5.ok, "passes when yearly + no month");
}

// ─── Section 10: validateCalendarPublish — ru_published gate ────────────────

console.log("\n[10] validateCalendarPublish — ru_published gate");
{
  const base = validPublishInput();

  const v1 = validateCalendarPublish({
    ...base,
    ru_published: 1,
    ru_title:    "",
    ru_body:     "",
    ru_seo_title:     "",
    ru_meta_description: "",
  });
  assert(!v1.ok, "fails when ru_published=1 and RU fields empty");
  assert(v1.errors.some((e) => e.includes("ru_title")), "error mentions ru_title");

  const v2 = validateCalendarPublish({
    ...base,
    ru_published:        1,
    ru_title:            "RU Title",
    ru_body:             "RU body content here.",
    ru_seo_title:        "RU SEO Title",
    ru_meta_description: "RU meta description here.",
    ru_image_alt:        "RU image alt text",
  });
  assert(v2.ok, "passes when ru_published=1 and all RU fields filled (incl. ru_image_alt)");
}

// ─── Section 11: publishCalendar — gates ────────────────────────────────────

console.log("\n[11] publishCalendar — gates");
{
  const r1 = publishCalendar("nonexistent-id-xyz");
  assert(!r1.ok, "publishCalendar fails for nonexistent id");

  // Create a minimal draft — will fail publish validation (missing required fields)
  const r2 = createCalendarDraft({ slug: "qa-cal-pub-test-draft", en_title: "Pub Test", year: 2026 });
  assert(r2.ok, "created draft for publish gate test");
  if (r2.id) createdIds.push(r2.id);

  const r3 = publishCalendar(r2.id!);
  assert(!r3.ok, "publishCalendar blocks minimal draft (missing required publish fields)");
  assert(r3.errors.length > 0, "returns errors for incomplete draft");
}

// ─── Section 12: publishCalendar — full valid publish ───────────────────────

console.log("\n[12] publishCalendar — full valid publish");
let publishId = "";
{
  const input = validPublishInput({ slug: "qa-cal-full-publish" });
  const cr = createCalendarDraft(input);
  assert(cr.ok, "created calendar draft for full publish test");
  if (cr.id) {
    publishId = cr.id;
    createdIds.push(publishId);
  }

  // Update with all required publish fields (already set via validPublishInput)
  const ur = updateCalendarDraft(publishId, input);
  assert(ur.ok, "updated draft with all publish fields");

  const pr = publishCalendar(publishId);
  assert(pr.ok, `publishCalendar succeeds: errors=${JSON.stringify(pr.errors)}`);

  const row = getCalendarPageById(publishId);
  assert(row?.status === "published", "status is 'published' in DB");
}

// ─── Section 13: publishCalendar — archived gate ────────────────────────────

console.log("\n[13] publishCalendar — archived gate");
{
  // Archive the published page from section 12
  const ar = archiveCalendar(publishId);
  assert(ar.ok, "archiveCalendar succeeds on published page");

  const row1 = getCalendarPageById(publishId);
  assert(row1?.status === "archived", "status is 'archived' after archiveCalendar");

  const r2 = publishCalendar(publishId);
  assert(!r2.ok, "publishCalendar blocked on archived page");
  assert(r2.errors.some((e) => e.includes("archived")), "error mentions archived");
}

// ─── Section 14: archiveCalendar ────────────────────────────────────────────

console.log("\n[14] archiveCalendar");
{
  const cr = createCalendarDraft({ slug: "qa-cal-archive-test", en_title: "Archive Test", year: 2026 });
  assert(cr.ok, "created draft for archive test");
  if (cr.id) createdIds.push(cr.id);

  const ar = archiveCalendar(cr.id!);
  assert(ar.ok, "archiveCalendar succeeds on draft");

  const row = getCalendarPageById(cr.id!);
  assert(row?.status === "archived", "status is 'archived' in DB");

  const r2 = archiveCalendar("nonexistent-xyz");
  assert(!r2.ok, "archiveCalendar fails for nonexistent id");
}

// ─── Section 15: calendarRowToInput export ───────────────────────────────────

console.log("\n[15] calendarRowToInput — export and round-trip");
{
  const row = getCalendarPageById(draftId);
  assert(row !== null, "found row for round-trip test");

  if (row) {
    const input = calendarRowToInput(row);
    assert(typeof input.slug === "string", "calendarRowToInput returns slug");
    assert(typeof input.en_title === "string", "calendarRowToInput returns en_title");
    assert(typeof input.dates_json === "string", "calendarRowToInput returns dates_json");
    assert(typeof input.official_source_url === "string", "calendarRowToInput returns official_source_url");
    assert(typeof input.last_verified_date === "string", "calendarRowToInput returns last_verified_date");
  }
}

// ─── Section 16: slug uniqueness constraint ──────────────────────────────────

console.log("\n[16] Slug uniqueness");
{
  const r1 = createCalendarDraft({ slug: "qa-cal-unique", en_title: "First", year: 2026 });
  assert(r1.ok, "first create with unique slug succeeds");
  if (r1.id) createdIds.push(r1.id);

  const r2 = createCalendarDraft({ slug: "qa-cal-unique", en_title: "Second", year: 2026 });
  assert(!r2.ok, "second create with same slug fails");
  assert(r2.errors.some((e) => e.includes("already taken")), "error mentions already taken");
}

// ─── Section 17: staleness warning ───────────────────────────────────────────

console.log("\n[17] validateCalendarPublish — staleness warning");
{
  const base = validPublishInput();

  const v1 = validateCalendarPublish({ ...base, last_verified_date: "2024-01-01" });
  assert(!v1.ok || v1.warnings.some((w) => w.includes("days ago")), "staleness warning fires for old date");
}

// ─── Section 18: DB integrity — fields stored correctly ─────────────────────

console.log("\n[18] DB integrity — all fields round-trip");
{
  const datesPayload = JSON.stringify([
    { date: "2026-12-02", label_en: "National Day", label_ru: "День нации", type: "public-holiday", confidence: "confirmed", source: "https://uaegov.ae" },
    { date: "2026-07-31", label_en: "E-Invoicing Deadline", label_ru: "", type: "deadline", confidence: "expected", source: "" },
  ]);

  const input: CalendarInput = {
    slug:                "qa-cal-integrity",
    calendar_type:       "yearly",
    year:                2026,
    month:               undefined,
    en_title:            "Integrity Test Calendar",
    en_summary:          "Summary for integrity test.",
    en_body:             "Body for integrity test.",
    en_notes:            "No Islamic dates.",
    en_seo_title:        "Integrity Test SEO Title",
    en_meta_description: "Integrity test meta.",
    ru_title:            "RU Title",
    ru_body:             "",
    ru_notes:            "",
    image_path:          "/img/test.jpg",
    image_alt:           "Test image",
    dates_json:          datesPayload,
    has_islamic_dates:   0,
    official_source_url: "https://test.gov.ae",
    last_verified_date:  "2026-05-01",
    featured_homepage:   1,
    ru_published:        0,
  };

  const cr = createCalendarDraft(input);
  assert(cr.ok, "integrity test draft created");
  if (cr.id) createdIds.push(cr.id);

  const row = getCalendarPageById(cr.id!);
  assert(row?.calendarType === "yearly", "calendarType stored");
  assert(row?.year === 2026, "year stored");
  assert(row?.enSummary === "Summary for integrity test.", "enSummary stored");
  assert(row?.enNotes === "No Islamic dates.", "enNotes stored");
  assert(row?.imagePath === "/img/test.jpg", "imagePath stored");
  assert(row?.imageAlt === "Test image", "imageAlt stored");
  assert(row?.officialSourceUrl === "https://test.gov.ae", "officialSourceUrl stored");
  assert(row?.lastVerifiedDate === "2026-05-01", "lastVerifiedDate stored");
  assert(row?.featuredHomepage === 1, "featuredHomepage stored");

  const parsed = JSON.parse(row?.datesJson ?? "[]");
  assert(Array.isArray(parsed) && parsed.length === 2, "dates_json stored and parseable");
}

// ─── Section 19: code inspection checks ─────────────────────────────────────

console.log("\n[19] Code inspection");
{
  const writerSrc = readFileSync("lib/db/news-events-calendar-admin.ts", "utf8");
  assert(writerSrc.includes("export function calendarRowToInput"), "calendarRowToInput is exported");
  assert(writerSrc.includes("export function publishCalendar"), "publishCalendar is exported");
  assert(writerSrc.includes("export function archiveCalendar"), "archiveCalendar is exported");
  assert(writerSrc.includes("validateCalendarPublish"), "validateCalendarPublish is imported and used");

  const actionsSrc = readFileSync("app/admin/content/actions/calendar.ts", "utf8");
  assert(actionsSrc.includes("saveCalendarDraftAction"), "saveCalendarDraftAction defined");
  assert(actionsSrc.includes("publishCalendarAction"), "publishCalendarAction defined");
  assert(actionsSrc.includes("archiveCalendarAction"), "archiveCalendarAction defined");
  assert(actionsSrc.includes('"use server"'), "actions file has use server directive");

  const formSrc = readFileSync("app/admin/content/_components/CalendarForm.tsx", "utf8");
  assert(formSrc.includes("useActionState"), "CalendarForm uses useActionState");
  assert(formSrc.includes("dates_json"), "CalendarForm has dates_json textarea");
  assert(formSrc.includes("has_islamic_dates"), "CalendarForm has has_islamic_dates flag");
  assert(formSrc.includes("official_source_url"), "CalendarForm has official_source_url field");
  assert(formSrc.includes("last_verified_date"), "CalendarForm has last_verified_date field");
  assert(formSrc.includes('"use client"'), "CalendarForm has use client directive");

  const panelSrc = readFileSync("app/admin/content/_components/CalendarStatusPanel.tsx", "utf8");
  assert(panelSrc.includes("publishCalendarAction"), "CalendarStatusPanel uses publishCalendarAction");
  assert(panelSrc.includes("archiveCalendarAction"), "CalendarStatusPanel uses archiveCalendarAction");
  assert(panelSrc.includes("moon sighting"), "CalendarStatusPanel has Islamic dates warning");
  assert(panelSrc.includes('"use client"'), "CalendarStatusPanel has use client directive");

  const previewSrc = readFileSync("app/admin/content/_components/CalendarPreview.tsx", "utf8");
  assert(previewSrc.includes("parseDates"), "CalendarPreview parses dates_json");
  assert(previewSrc.includes("colorDot"), "CalendarPreview has color mapping");
  assert(!previewSrc.includes('"use client"'), "CalendarPreview is a server component");
}

// ─── Section 20: updateCalendarDraft — partial update preserves other fields ─

console.log("\n[20] updateCalendarDraft — partial update");
{
  const cr = createCalendarDraft({
    slug:     "qa-cal-partial",
    en_title: "Partial Update Test",
    year:     2026,
    en_body:  "Original body",
  });
  assert(cr.ok, "created draft for partial update test");
  if (cr.id) createdIds.push(cr.id);

  const ur = updateCalendarDraft(cr.id!, { en_body: "Updated body" });
  assert(ur.ok, "updateCalendarDraft with partial fields succeeds");

  const row = getCalendarPageById(cr.id!);
  assert(row?.enBody === "Updated body", "en_body updated");
  assert(row?.enTitle === "Partial Update Test", "en_title preserved");
  assert(row?.slug === "qa-cal-partial", "slug preserved");
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

cleanup();

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Phase 4A-6 QA: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
