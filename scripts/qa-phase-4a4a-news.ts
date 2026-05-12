/**
 * Phase 4A-4a QA: News admin draft workflow
 *
 * Tests the full create/update/delete lifecycle, all validation paths,
 * RU gate rejection, field persistence, and code-level feature checks.
 * Creates a real draft row, verifies it, updates it, then deletes it.
 * Final DB counts must be identical to initial counts.
 *
 * Run: npx tsx scripts/qa-phase-4a4a-news.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import {
  createNewsDraft,
  updateNewsDraft,
  getNewsPostById,
  getAllNewsPosts,
} from "@/lib/db/news-events-calendar-admin";
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

// ── Baseline ──────────────────────────────────────────────────────────────────

section("Baseline counts");
assert(countTable("news_posts") === 0, "news_posts starts at 0");
assert(getAllNewsPosts().length === 0, "getAllNewsPosts() returns []");

// ── Validation: draft required fields ─────────────────────────────────────────

section("Validation: draft required fields");

{
  const r = createNewsDraft({});
  assert(!r.ok, "empty input rejected");
  assert(
    r.errors.some((e) => e.toLowerCase().includes("slug")),
    "error mentions slug",
  );
}

{
  const r = createNewsDraft({ slug: "UPPERCASE-INVALID" });
  assert(!r.ok, "uppercase slug rejected");
  assert(
    r.errors.some((e) => e.toLowerCase().includes("slug")),
    "error mentions slug format",
  );
}

{
  const r = createNewsDraft({ slug: "valid-slug" });
  assert(!r.ok, "slug-only input rejected (missing en_title)");
  assert(
    r.errors.some((e) => e.includes("en_title")),
    "error mentions en_title",
  );
}

{
  // em-dash is the Unicode character U+2014
  const r = createNewsDraft({
    slug: "em-dash-test",
    en_title: "Title with em—dash",
  });
  assert(!r.ok, "em-dash in en_title rejected");
  assert(
    r.errors.some(
      (e) => e.toLowerCase().includes("em-dash") || e.includes("—"),
    ),
    "error references em-dash",
  );
}

assert(
  countTable("news_posts") === 0,
  "no rows written after all rejected creates",
);

// ── Validation: RU gate rejection ─────────────────────────────────────────────

section("Validation: RU gate rejection");

{
  const r = createNewsDraft({
    slug: "ru-gate-test",
    en_title: "RU Gate Test",
    ru_published: 1,
    ru_title: "",
    ru_body: "",
  });
  assert(!r.ok, "ru_published=1 with empty ru_title+ru_body rejected");
  assert(
    r.errors.some((e) => e.includes("ru_published")),
    "error references ru_published gate",
  );
}

{
  const r = createNewsDraft({
    slug: "ru-gate-test-2",
    en_title: "RU Gate Test 2",
    ru_published: 1,
    ru_title: "Zagolovok",
    ru_body: "",
  });
  assert(!r.ok, "ru_published=1 with ru_title but empty ru_body rejected");
}

assert(
  countTable("news_posts") === 0,
  "no rows written after RU gate rejections",
);

// ── Create valid draft ────────────────────────────────────────────────────────

section("Create valid draft");

const createResult = createNewsDraft({
  slug: "test-news-draft-delete-me",
  en_title: "Test News Draft for QA",
  en_summary: "A test news draft created during Phase 4A-4a QA.",
  en_body: "This is a QA test body. It will be deleted after the test run completes.",
  en_seo_title: "Test News Draft QA",
  en_meta_description: "QA test draft for news admin.",
  category: "visa",
  source_label: "media",
  date_published: "2026-05-12",
  date_updated: "2026-05-12",
  featured_homepage: 0,
  featured_digest: 0,
  noindex: 0,
  ru_published: 0,
});

assert(
  createResult.ok,
  "createNewsDraft with valid input succeeds",
  createResult.errors.join("; "),
);
assert(
  typeof createResult.id === "string" && createResult.id.length > 0,
  "create returns a non-empty id",
);
assert(createResult.errors.length === 0, "no errors on create");

if (!createResult.ok || !createResult.id) {
  console.error("\n\nCreate failed — aborting remaining tests.");
  process.exit(1);
}

createdIds.push(createResult.id);
const testId = createResult.id;

assert(countTable("news_posts") === 1, "news_posts count = 1 after create");

// ── Verify created row fields ─────────────────────────────────────────────────

section("Verify created row fields");

const row = getNewsPostById(testId);
assert(row !== null, "row readable by getNewsPostById");

if (row) {
  assert(row.slug === "test-news-draft-delete-me", "slug stored correctly");
  assert(row.enTitle === "Test News Draft for QA", "en_title stored correctly");
  assert(
    row.enSummary === "A test news draft created during Phase 4A-4a QA.",
    "en_summary stored correctly",
  );
  assert(row.status === "draft", "status forced to draft");
  assert(row.ruPublished === 0, "ru_published defaults to 0");
  assert(row.category === "visa", "category stored correctly");
  assert(row.sourceLabel === "media", "source_label stored correctly");
  assert(row.datePublished === "2026-05-12", "date_published stored correctly");
  assert(row.noindex === 0, "noindex stored as 0");
  assert(row.featuredHomepage === 0, "featured_homepage stored as 0");
  assert(row.featuredDigest === 0, "featured_digest stored as 0");
  assert(row.createdAt.length > 0, "createdAt is set");
  assert(row.updatedAt.length > 0, "updatedAt is set");
  assert(
    row.relatedGuideSlug === "",
    "relatedGuideSlug defaults to empty string",
  );
}

// ── List reflects the draft ────────────────────────────────────────────────────

section("List view reflects created draft");

const allPosts = getAllNewsPosts();
assert(allPosts.length === 1, "getAllNewsPosts returns 1 row");
assert(
  allPosts[0].slug === "test-news-draft-delete-me",
  "list contains correct slug",
);
assert(allPosts[0].status === "draft", "list shows draft status");

// ── Update draft ──────────────────────────────────────────────────────────────

section("Update draft (simulates edit form save)");

const prevUpdatedAt = row?.updatedAt;

const updateResult = updateNewsDraft(testId, {
  en_title: "Updated Test News Draft",
  en_summary: "Updated summary for QA.",
  en_body: "Updated body content for QA testing. Still a local-only test row.",
  en_seo_title: "Updated QA News Draft",
  en_meta_description: "Updated QA meta description.",
  source_url: "https://example.com/source",
  source_label: "official",
  noindex: 1,
  featured_homepage: 0,
  featured_digest: 0,
});

assert(
  updateResult.ok,
  "updateNewsDraft succeeds",
  updateResult.errors.join("; "),
);
assert(updateResult.id === testId, "update returns same id");
assert(updateResult.errors.length === 0, "no errors on update");
assert(countTable("news_posts") === 1, "still 1 row after update (no duplicate)");

// ── Verify updated fields ──────────────────────────────────────────────────────

section("Verify updated row fields");

const updatedRow = getNewsPostById(testId);
assert(updatedRow !== null, "updated row readable by id");

if (updatedRow) {
  assert(
    updatedRow.enTitle === "Updated Test News Draft",
    "en_title updated correctly",
  );
  assert(
    updatedRow.enSummary === "Updated summary for QA.",
    "en_summary updated correctly",
  );
  assert(
    updatedRow.sourceUrl === "https://example.com/source",
    "source_url updated correctly",
  );
  assert(
    updatedRow.sourceLabel === "official",
    "source_label updated correctly",
  );
  assert(updatedRow.noindex === 1, "noindex updated to 1");
  assert(updatedRow.status === "draft", "status remains draft after update");
  assert(
    updatedRow.slug === "test-news-draft-delete-me",
    "slug unchanged after partial update",
  );
  assert(
    updatedRow.datePublished === "2026-05-12",
    "date_published preserved (not overwritten by partial update)",
  );
  assert(
    updatedRow.category === "visa",
    "category preserved (not in update input)",
  );
  assert(
    updatedRow.updatedAt !== prevUpdatedAt,
    "updatedAt timestamp advanced after update",
  );
}

// ── Update: reject em-dash in updated field ────────────────────────────────────

section("Update: reject em-dash in updated en_title");

const badUpdate = updateNewsDraft(testId, {
  en_title: "Title with em—dash",
});
assert(!badUpdate.ok, "update with em-dash in en_title rejected");
assert(
  badUpdate.errors.some(
    (e) => e.toLowerCase().includes("em-dash") || e.includes("—"),
  ),
  "error mentions em-dash",
);

const rowAfterBadUpdate = getNewsPostById(testId);
assert(
  rowAfterBadUpdate?.enTitle === "Updated Test News Draft",
  "en_title unchanged after rejected update",
);

// ── Update: RU gate on existing row ───────────────────────────────────────────

section("Update: RU gate rejection on existing row");

const ruGateUpdate = updateNewsDraft(testId, {
  ru_published: 1,
  ru_title: "",
  ru_body: "",
});
assert(!ruGateUpdate.ok, "update ru_published=1 with empty ru fields rejected");
assert(
  ruGateUpdate.errors.some((e) => e.includes("ru_published")),
  "error references ru_published gate",
);
assert(
  getNewsPostById(testId)?.ruPublished === 0,
  "ruPublished unchanged after rejected RU gate update",
);

// ── Update: nonexistent id ────────────────────────────────────────────────────

section("Update: nonexistent id rejected");

const missingUpdate = updateNewsDraft("00000000-0000-0000-0000-000000000000", {
  en_title: "Should not save",
});
assert(!missingUpdate.ok, "update with nonexistent id returns ok=false");
assert(
  missingUpdate.errors.some(
    (e) => e.includes("not found") || e.includes("00000000"),
  ),
  "error mentions not found",
);

// ── Code inspection: feature absence checks ────────────────────────────────────

section("Feature absence checks (code inspection)");

const formCode = readFileSync(
  join(process.cwd(), "app/admin/content/_components/NewsForm.tsx"),
  "utf-8",
);

assert(
  !formCode.includes("value=\"publish\"") && !formCode.includes("Publish now"),
  "no publish button in NewsForm",
);
assert(!formCode.includes("archive"), "no archive button in NewsForm");
assert(
  !formCode.includes("related_guide_slug"),
  "related_guide_slug not in NewsForm form fields",
);
assert(
  !formCode.includes("related_service_slug"),
  "related_service_slug not in NewsForm form fields",
);
assert(
  !formCode.includes("related_tool_slug"),
  "related_tool_slug not in NewsForm form fields",
);
assert(
  !formCode.includes("image_upload") && !formCode.includes("ImageUpload"),
  "no image upload in NewsForm",
);
assert(formCode.includes("Save draft"), "Save draft button present");
assert(
  formCode.includes("useActionState"),
  "form uses useActionState (not direct DB call)",
);

const actionCode = readFileSync(
  join(process.cwd(), "app/admin/content/actions/news.ts"),
  "utf-8",
);

const actionImportsDb = actionCode.includes("from \"drizzle") ||
  actionCode.includes("from 'drizzle") ||
  actionCode.includes("from \"better-sqlite3") ||
  actionCode.includes("sqliteForVerification");
assert(!actionImportsDb, "action does not import raw db or drizzle directly");
assert(
  actionCode.includes("createNewsDraft"),
  "action calls createNewsDraft writer",
);
assert(
  actionCode.includes("updateNewsDraft"),
  "action calls updateNewsDraft writer",
);
assert(
  !actionCode.includes("publishNews") && !actionCode.includes("status = \"published\""),
  "action has no publish logic",
);

const listCode = readFileSync(
  join(process.cwd(), "app/admin/content/news/page.tsx"),
  "utf-8",
);
assert(listCode.includes("getAllNewsPosts"), "list page uses getAllNewsPosts");
assert(!listCode.includes("from \"@/lib/db/writer\""), "list does not import old writer");

// ── Old admin files unchanged ──────────────────────────────────────────────────

section("Old admin files unchanged (git diff check)");

const changedFiles = execSync("git diff --name-only HEAD 2>/dev/null || git status --short 2>/dev/null")
  .toString()
  .trim();

assert(
  !changedFiles.includes("app/admin/guides"),
  "app/admin/guides/* not modified",
);
assert(!changedFiles.includes("proxy.ts"), "proxy.ts not modified");
assert(!changedFiles.includes("lib/auth.ts"), "lib/auth.ts not modified");
assert(!changedFiles.includes("sitemap"), "sitemap not modified");
assert(!changedFiles.includes("homepage"), "homepage not modified");

// ── Cleanup ───────────────────────────────────────────────────────────────────

section("Cleanup: delete test rows");

for (const id of createdIds) {
  raw.prepare("DELETE FROM news_posts WHERE id = ?").run(id);
}

assert(countTable("news_posts") === 0, "news_posts = 0 after cleanup");

// ── Final DB integrity ─────────────────────────────────────────────────────────

section("Final DB counts and integrity");

const guides = countTable("guides");
const steps  = countTable("steps");
const events = countTable("events");
const cals   = countTable("calendar_pages");
const news   = countTable("news_posts");

assert(guides === 17,  `guides = 17 (got ${guides})`);
assert(steps  === 115, `steps = 115 (got ${steps})`);
assert(news   === 0,   `news_posts = 0 (got ${news})`);
assert(events === 0,   `events = 0 (got ${events})`);
assert(cals   === 0,   `calendar_pages = 0 (got ${cals})`);

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
