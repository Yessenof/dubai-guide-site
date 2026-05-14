/**
 * Phase 4A-5 QA: Events admin full workflow
 *
 * 19 assertions covering: draft CRUD, validation gaps, publish gates,
 * archive gates, date confidence rules, RU gate, DB integrity.
 * All created rows are deleted — final counts must match baseline.
 *
 * Run: npx tsx scripts/qa-phase-4a5-events.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import {
  createEventDraft,
  updateEventDraft,
  publishEvent,
  archiveEvent,
  getEventById,
  getAllEvents,
} from "@/lib/db/news-events-calendar-admin";
import {
  validateEventPublish,
} from "@/lib/admin-validation/news-events-calendar";
import { sqliteForVerificationOnly as raw } from "@/lib/db/connection";

// ── Helpers ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const createdIds: string[] = [];

function assert(cond: boolean, msg: string, detail?: string) {
  if (cond) {
    console.log(`  ✓  ${msg}`);
    passed++;
  } else {
    console.error(`  ✗  FAIL: ${msg}${detail ? `  (${detail})` : ""}`);
    failed++;
  }
}

function section(title: string) {
  const line = "-".repeat(Math.max(0, 60 - title.length));
  console.log(`\n-- ${title} ${line}`);
}

function countTable(table: string): number {
  return (
    raw.prepare(`SELECT COUNT(*) as c FROM ${table}`).get() as { c: number }
  ).c;
}

// ── 1. Baseline ───────────────────────────────────────────────────────────────

const baselineNews   = countTable("news_posts");
const baselineEvents = countTable("events");
const baselineCals   = countTable("calendar_pages");

section("1. Baseline");
assert(countTable("events") === baselineEvents, `events baseline = ${baselineEvents}`);

// ── 2. createEventDraft — valid minimal input ─────────────────────────────────

section("2. createEventDraft — valid minimal input");

const minCreate = createEventDraft({
  slug: "qa-event-minimal",
  en_title: "QA Minimal Event Draft",
});
assert(minCreate.ok, "createEventDraft with slug + en_title succeeds", minCreate.errors.join("; "));

if (!minCreate.ok || !minCreate.id) {
  console.error("Minimal create failed — aborting.");
  process.exit(1);
}
createdIds.push(minCreate.id);
const minId = minCreate.id;

// ── 3. createEventDraft — em-dash in title blocked ────────────────────────────

section("3. createEventDraft — em-dash blocked");

const emDashCreate = createEventDraft({
  slug: "qa-event-emdash",
  en_title: "Bad Title — with em-dash",
});
assert(
  !emDashCreate.ok && emDashCreate.errors.some((e) => e.includes("Em-dash")),
  "createEventDraft with em-dash in title fails with em-dash error",
  emDashCreate.errors.join("; "),
);

// ── 4. createEventDraft — invalid slug blocked ────────────────────────────────

section("4. createEventDraft — invalid slug blocked");

const badSlugCreate = createEventDraft({
  slug: "Invalid Slug With Spaces",
  en_title: "Slug Test",
});
assert(
  !badSlugCreate.ok && badSlugCreate.errors.some((e) => e.includes("slug")),
  "createEventDraft with invalid slug fails with slug error",
  badSlugCreate.errors.join("; "),
);

// ── 5. createEventDraft — missing en_title blocked ────────────────────────────

section("5. createEventDraft — missing en_title blocked");

const noTitleCreate = createEventDraft({
  slug: "qa-event-notitle",
  en_title: "",
});
assert(
  !noTitleCreate.ok && noTitleCreate.errors.some((e) => e.includes("en_title")),
  "createEventDraft with empty en_title fails",
  noTitleCreate.errors.join("; "),
);

// ── 6. createEventDraft — duplicate slug fails ────────────────────────────────

section("6. createEventDraft — duplicate slug fails");

const dupCreate = createEventDraft({
  slug: "qa-event-minimal",
  en_title: "Duplicate Slug Attempt",
});
assert(
  !dupCreate.ok && dupCreate.errors.some((e) => e.toLowerCase().includes("slug") || e.includes("taken")),
  "createEventDraft with duplicate slug returns error",
  dupCreate.errors.join("; "),
);

// ── 7. updateEventDraft — updates field, stays draft ─────────────────────────

section("7. updateEventDraft — updates field, stays draft");

const updatedSummary = "Updated summary for QA test.";
const updateResult = updateEventDraft(minId, { en_summary: updatedSummary });
assert(
  updateResult.ok,
  "updateEventDraft with valid change succeeds",
  updateResult.errors.join("; "),
);

const afterUpdate = getEventById(minId);
assert(
  afterUpdate?.enSummary === updatedSummary && afterUpdate.status === "draft",
  "updated field written to DB, status remains draft",
  `summary="${afterUpdate?.enSummary}" status="${afterUpdate?.status}"`,
);

// ── 8. updateEventDraft — missing id fails ────────────────────────────────────

section("8. updateEventDraft — non-existent id fails");

const updateMissing = updateEventDraft("nonexistent-id-abc", { en_summary: "test" });
assert(
  !updateMissing.ok && updateMissing.errors.length > 0,
  "updateEventDraft with non-existent id returns error",
  updateMissing.errors.join("; "),
);

// ── 9. validateEventPublish — single-day event passes date check ──────────────

section("9. validateEventPublish — single-day (no event_date_end) allowed");

const singleDayInput = {
  slug: "qa-single-day",
  en_title: "Single-Day Event",
  en_summary: "A one-day event for QA.",
  en_body: "This event occurs on a single day. No end date needed.",
  en_seo_title: "Single-Day Event QA",
  en_meta_description: "A single-day QA event.",
  event_date_start: "2026-12-02",
  event_date_end: "",
  date_confidence: "confirmed",
  year: 2026,
  source_url: "https://example.com/event",
  schema_eligible: 1,
  color_type: "public-holiday",
  category: "holiday",
  ru_published: 0,
};
const singleDayResult = validateEventPublish(singleDayInput);
assert(
  !singleDayResult.errors.some((e) => e.includes("event_date_end")),
  "validateEventPublish does not require event_date_end for single-day event",
  singleDayResult.errors.join("; "),
);

// ── 10. validateEventPublish — end before start fails ─────────────────────────

section("10. validateEventPublish — end date before start date fails");

const badDateOrderResult = validateEventPublish({
  ...singleDayInput,
  event_date_start: "2026-12-05",
  event_date_end:   "2026-12-02",
});
assert(
  badDateOrderResult.errors.some((e) => e.includes("event_date_end") && e.includes("before")),
  "validateEventPublish fails when end date is before start date",
  badDateOrderResult.errors.join("; "),
);

// ── 11. publishEvent — minimal draft blocked ──────────────────────────────────

section("11. publishEvent — minimal draft missing required fields");

const pubBlocked = publishEvent(minId);
assert(
  !pubBlocked.ok && pubBlocked.errors.length > 0,
  "publishEvent on minimal draft returns ok=false with errors",
  pubBlocked.errors.join("; "),
);
assert(
  getEventById(minId)?.status === "draft",
  "status unchanged (still draft) after blocked publish",
);

// ── 12. publishEvent — archived event blocked ─────────────────────────────────

section("12. publishEvent — archived event blocked");

const archForGate = createEventDraft({
  slug: "qa-event-to-archive",
  en_title: "Event to Archive for Gate Test",
});
if (!archForGate.ok || !archForGate.id) {
  console.error("Archive-for-gate create failed — aborting.");
  process.exit(1);
}
createdIds.push(archForGate.id);
archiveEvent(archForGate.id);

const pubArchived = publishEvent(archForGate.id);
assert(
  !pubArchived.ok && pubArchived.errors.some((e) => e.toLowerCase().includes("archived")),
  "publishEvent on archived event returns error mentioning archived",
  pubArchived.errors.join("; "),
);

// ── 13. publishEvent — schema_eligible=1 with non-confirmed blocked ────────────

section("13. publishEvent — schema_eligible=1 with non-confirmed confidence blocked");

const nonConfCreate = createEventDraft({
  slug: "qa-event-nonconfirmed",
  en_title: "Expected Date Event for QA",
});
if (!nonConfCreate.ok || !nonConfCreate.id) {
  console.error("Non-confirmed create failed — aborting.");
  process.exit(1);
}
createdIds.push(nonConfCreate.id);

updateEventDraft(nonConfCreate.id, {
  en_summary: "An event with an expected date.",
  en_body: "This event is expected to occur on the given date. Subject to confirmation.",
  en_seo_title: "Expected Date Event",
  en_meta_description: "QA test event with expected date.",
  event_date_start: "2026-04-01",
  date_confidence: "expected",
  year: 2026,
  schema_eligible: 1,
});

const pubNonConf = publishEvent(nonConfCreate.id);
assert(
  !pubNonConf.ok && pubNonConf.errors.some((e) => e.includes("schema_eligible")),
  "publishEvent fails when schema_eligible=1 and date_confidence is not confirmed",
  pubNonConf.errors.join("; "),
);

// ── 14. publishEvent — confirmed + no source_url blocked ─────────────────────

section("14. publishEvent — confirmed date_confidence requires source_url");

const noSrcCreate = createEventDraft({
  slug: "qa-event-no-source",
  en_title: "Confirmed Event Without Source URL",
});
if (!noSrcCreate.ok || !noSrcCreate.id) {
  console.error("No-source create failed — aborting.");
  process.exit(1);
}
createdIds.push(noSrcCreate.id);

updateEventDraft(noSrcCreate.id, {
  en_summary: "A confirmed event missing its source URL.",
  en_body: "This is a confirmed event. The source URL is required for confirmed events.",
  en_seo_title: "Confirmed Event No Source",
  en_meta_description: "QA test for confirmed event missing source URL.",
  event_date_start: "2026-12-02",
  date_confidence: "confirmed",
  year: 2026,
  source_url: "",
  schema_eligible: 0,
  color_type: "public-holiday",
  category: "holiday",
});

const pubNoSrc = publishEvent(noSrcCreate.id);
assert(
  !pubNoSrc.ok && pubNoSrc.errors.some((e) => e.includes("source_url")),
  "publishEvent fails when date_confidence=confirmed and source_url is empty",
  pubNoSrc.errors.join("; "),
);

// ── 15. validateEventPublish — ru_published=1 requires ru_title ───────────────

section("15. validateEventPublish — ru_published=1 requires ru_title");

const ruGateResult = validateEventPublish({
  slug: "qa-event-ru-gate",
  en_title: "Event with Russian Gate Check",
  en_summary: "A one-line summary for the RU gate test.",
  en_body: "This event tests the Russian publish gate validation.",
  en_seo_title: "RU Gate Event",
  en_meta_description: "QA test for Russian publish gate.",
  event_date_start: "2026-12-02",
  date_confidence: "confirmed",
  year: 2026,
  source_url: "https://example.com/ru-gate",
  schema_eligible: 0,
  color_type: "public-holiday",
  category: "holiday",
  ru_published: 1,
  ru_title: "",
  ru_seo_title: "Заголовок SEO",
  ru_meta_description: "Описание.",
});
assert(
  !ruGateResult.ok && ruGateResult.errors.some((e) => e.includes("ru_title")),
  "validateEventPublish fails when ru_published=1 and ru_title is empty",
  ruGateResult.errors.join("; "),
);

// ── 16. publishEvent — valid complete event publishes ─────────────────────────

section("16. publishEvent — valid complete event (single-day, no end date)");

const fullCreate = createEventDraft({
  slug: "qa-event-full-valid",
  en_title: "UAE National Day 2026 QA",
  en_summary: "UAE celebrates its 55th National Day on 2 December 2026.",
  en_body: "UAE National Day is a public holiday celebrated across the country. Government offices, banks, and most businesses are closed.",
  en_seo_title: "UAE National Day 2026",
  en_meta_description: "UAE National Day falls on 2 December 2026. Public holiday.",
  event_date_start: "2026-12-02",
  event_date_end: "",
  date_confidence: "confirmed",
  year: 2026,
  source_url: "https://u.ae/en/information-and-services/public-holidays",
  schema_eligible: 1,
  color_type: "public-holiday",
  category: "holiday",
  featured_calendar: 1,
  featured_homepage: 0,
  featured_digest: 0,
  ru_published: 0,
});
assert(fullCreate.ok, "create full valid event draft ok", fullCreate.errors.join("; "));

if (!fullCreate.ok || !fullCreate.id) {
  console.error("Full valid create failed — aborting.");
  process.exit(1);
}
createdIds.push(fullCreate.id);
const fullId = fullCreate.id;

const pubResult = publishEvent(fullId);
assert(
  pubResult.ok,
  "publishEvent on full valid event succeeds",
  pubResult.errors.join("; "),
);

// ── 17. getAllEvents — reflects published status ───────────────────────────────

section("17. getAllEvents — list reflects published status");

const allEvents = getAllEvents();
const publishedCount = allEvents.filter((e) => e.status === "published").length;
assert(
  publishedCount === 1 && allEvents.find((e) => e.id === fullId)?.status === "published",
  "getAllEvents returns 1 published row with correct id",
  `published=${publishedCount}`,
);

// ── 18. archiveEvent — archives a draft ──────────────────────────────────────

section("18. archiveEvent — archives a draft");

const archResult = archiveEvent(minId);
assert(
  archResult.ok && getEventById(minId)?.status === "archived",
  "archiveEvent on draft sets status to archived",
  archResult.errors.join("; "),
);

// ── 19. archiveEvent — non-existent id fails ─────────────────────────────────

section("19. archiveEvent — non-existent id fails");

const archMissing = archiveEvent("does-not-exist-xyz");
assert(
  !archMissing.ok && archMissing.errors.length > 0,
  "archiveEvent with non-existent id returns error",
  archMissing.errors.join("; "),
);

// ── Code inspection ────────────────────────────────────────────────────────────

section("Code inspection: EventStatusPanel");

const panelCode = readFileSync(
  join(process.cwd(), "app/admin/content/_components/EventStatusPanel.tsx"),
  "utf-8",
);
assert(
  panelCode.includes("publishEventAction") && panelCode.includes("archiveEventAction"),
  "EventStatusPanel imports publishEventAction and archiveEventAction",
);
assert(
  panelCode.includes("useActionState"),
  "EventStatusPanel uses useActionState",
);
assert(
  panelCode.includes("no further actions"),
  "archived state shows no-further-actions message",
);
assert(
  panelCode.includes("DateConfidenceBadge") || panelCode.includes("dateConfidence"),
  "EventStatusPanel shows date confidence",
);

section("Code inspection: actions/events.ts");

const actionCode = readFileSync(
  join(process.cwd(), "app/admin/content/actions/events.ts"),
  "utf-8",
);
assert(
  actionCode.includes("publishEventAction") && actionCode.includes("archiveEventAction"),
  "actions/events.ts exports publishEventAction and archiveEventAction",
);
assert(
  actionCode.includes("publishEvent(") && actionCode.includes("archiveEvent("),
  "actions call publishEvent and archiveEvent writer functions",
);

section("Code inspection: events edit page grid layout");

const editPageCode = readFileSync(
  join(process.cwd(), "app/admin/content/events/[id]/page.tsx"),
  "utf-8",
);
assert(
  editPageCode.includes("grid") && editPageCode.includes("EventStatusPanel"),
  "edit page uses grid layout and renders EventStatusPanel",
);
assert(
  editPageCode.includes("validateEventPublish"),
  "edit page pre-computes validateEventPublish",
);

section("Code inspection: events list page visual distinction");

const listCode = readFileSync(
  join(process.cwd(), "app/admin/content/events/page.tsx"),
  "utf-8",
);
assert(
  listCode.includes("published") && listCode.includes("emerald"),
  "list page applies emerald styling for published rows",
);
assert(
  listCode.includes("archived") && listCode.includes("opacity"),
  "list page applies opacity styling for archived rows",
);
assert(
  listCode.includes("DateConfidenceBadge") || listCode.includes("ConfidenceBadge"),
  "list page shows confidence badge column",
);

section("Code inspection: eventsRowToInput is exported");

const writerCode = readFileSync(
  join(process.cwd(), "lib/db/news-events-calendar-admin.ts"),
  "utf-8",
);
assert(
  writerCode.includes("export function eventsRowToInput"),
  "eventsRowToInput is exported from writer module",
);
assert(
  writerCode.includes("export function publishEvent") && writerCode.includes("export function archiveEvent"),
  "publishEvent and archiveEvent are exported from writer module",
);

// ── Cleanup ───────────────────────────────────────────────────────────────────

section("Cleanup: delete all created rows");

for (const id of createdIds) {
  raw.prepare("DELETE FROM events WHERE id = ?").run(id);
}

// ── Final DB integrity ─────────────────────────────────────────────────────────

section("Final DB counts and integrity");

const guides = countTable("guides");
const steps  = countTable("steps");
const events = countTable("events");
const cals   = countTable("calendar_pages");
const news   = countTable("news_posts");

assert(guides === 17,             `guides = 17 (got ${guides})`);
assert(steps  === 115,            `steps = 115 (got ${steps})`);
assert(news   === baselineNews,   `news_posts = ${baselineNews} (got ${news})`);
assert(events === baselineEvents, `events = ${baselineEvents} after cleanup (got ${events})`);
assert(cals   === baselineCals,   `calendar_pages = ${baselineCals} (got ${cals})`);

const integrity = (
  raw.prepare("PRAGMA integrity_check").get() as { integrity_check: string }
).integrity_check;
assert(integrity === "ok", "PRAGMA integrity_check = ok");

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`
${"─".repeat(60)}
Passed: ${passed}   Failed: ${failed}   Total: ${passed + failed}
`);

if (failed > 0) {
  process.exit(1);
}
