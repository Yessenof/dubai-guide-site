/**
 * Phase 4A-4b QA: News publish + archive gates
 *
 * Tests: publish blocked (missing fields), valid publish with date auto-fill,
 * archive from published, publish blocked for archived, archive from draft,
 * code inspection checks, DB integrity, cleanup.
 * All created rows are deleted — final counts must match baseline.
 *
 * Run: npx tsx scripts/qa-phase-4a4b-news-publish.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import {
  createNewsDraft,
  publishNews,
  archiveNews,
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

const TODAY = new Date().toISOString().slice(0, 10);

const FULL_BODY =
  "This news article provides important information about recent changes to UAE visa regulations. " +
  "The UAE government has announced significant updates that affect expatriates living and working in Dubai. " +
  "The new regulations include updated processing times for employment visas, revised fee structures for " +
  "residence permits, and new requirements for medical fitness tests. Employers are required to register " +
  "with the Ministry of Human Resources and Emiratisation before sponsoring new employees. The changes " +
  "take effect from January 2026 and apply to all mainland companies. Free zone companies should consult " +
  "their zone authority for specific requirements. Business owners and HR managers should review the updated " +
  "guidelines to ensure compliance. The penalties for non-compliance include fines and potential suspension " +
  "of labour permits. All applications must now be submitted through the ICP smart services portal. For the " +
  "latest guidance, consult the official MOHRE website or a licensed immigration consultant. Companies with " +
  "more than 50 employees should also check for Emiratisation quota requirements.";

// ── Baseline ──────────────────────────────────────────────────────────────────

section("Baseline counts");
assert(countTable("news_posts") === 0, "news_posts starts at 0");
assert(getAllNewsPosts().length === 0, "getAllNewsPosts() returns []");

// ── Publish blocked: minimal draft ────────────────────────────────────────────

section("Publish blocked — minimal draft (missing publish-required fields)");

const minimalCreate = createNewsDraft({
  slug: "qa-publish-minimal",
  en_title: "Minimal Draft for Publish Gate Test",
});
assert(minimalCreate.ok, "create minimal draft ok", minimalCreate.errors.join("; "));

if (!minimalCreate.ok || !minimalCreate.id) {
  console.error("Minimal draft create failed — aborting.");
  process.exit(1);
}
createdIds.push(minimalCreate.id);
const minimalId = minimalCreate.id;

const pubBlocked = publishNews(minimalId);
assert(!pubBlocked.ok, "publishNews on minimal draft returns ok=false");
assert(pubBlocked.errors.length > 0, "publish blocked returns non-empty errors");
assert(
  pubBlocked.errors.some((e) => e.includes("en_summary") || e.includes("en_body") || e.includes("source_url")),
  "blocked errors reference missing publish-required fields",
  pubBlocked.errors.join("; "),
);
assert(
  getNewsPostById(minimalId)?.status === "draft",
  "status unchanged (still draft) after blocked publish",
);

// ── Publish blocked: archived post ────────────────────────────────────────────

section("Publish blocked — archived post");

const fullCreate = createNewsDraft({
  slug: "qa-publish-full-draft",
  en_title: "Full Draft for Publish and Archive QA",
  en_summary: "This draft tests the full publish and archive workflow.",
  en_body: FULL_BODY,
  en_seo_title: "Full Draft Publish QA",
  en_meta_description: "QA test for the full publish and archive workflow.",
  category: "visa",
  source_url: "https://example.com/qa-source",
  source_label: "official",
  featured_homepage: 0,
  featured_digest: 0,
  noindex: 0,
  ru_published: 0,
});
assert(fullCreate.ok, "create full draft ok", fullCreate.errors.join("; "));

if (!fullCreate.ok || !fullCreate.id) {
  console.error("Full draft create failed — aborting.");
  process.exit(1);
}
createdIds.push(fullCreate.id);
const fullId = fullCreate.id;

// Archive it, then try to publish
const archiveFirst = archiveNews(fullId);
assert(archiveFirst.ok, "archive full draft ok");
assert(
  getNewsPostById(fullId)?.status === "archived",
  "status = archived after archiveNews",
);

const pubBlockedArchived = publishNews(fullId);
assert(!pubBlockedArchived.ok, "publishNews on archived post returns ok=false");
assert(
  pubBlockedArchived.errors.some(
    (e) => e.toLowerCase().includes("archived") || e.toLowerCase().includes("permanent"),
  ),
  "error mentions archived",
  pubBlockedArchived.errors.join("; "),
);
assert(
  getNewsPostById(fullId)?.status === "archived",
  "status still archived after blocked publish",
);

// ── Valid publish — date auto-fill ────────────────────────────────────────────

section("Valid publish — dates auto-filled from empty");

const noDateCreate = createNewsDraft({
  slug: "qa-publish-no-dates",
  en_title: "Full Draft Without Dates for Auto-Fill Test",
  en_summary: "This draft tests date auto-fill on publish.",
  en_body: FULL_BODY,
  en_seo_title: "No-Dates Publish QA",
  en_meta_description: "QA test for date auto-fill on publish.",
  category: "visa",
  source_url: "https://example.com/qa-dates",
  source_label: "official",
  featured_homepage: 0,
  featured_digest: 0,
  noindex: 0,
  ru_published: 0,
});
assert(noDateCreate.ok, "create no-date draft ok", noDateCreate.errors.join("; "));

if (!noDateCreate.ok || !noDateCreate.id) {
  console.error("No-date draft create failed — aborting.");
  process.exit(1);
}
createdIds.push(noDateCreate.id);
const noDateId = noDateCreate.id;

assert(
  getNewsPostById(noDateId)?.datePublished === "",
  "datePublished starts empty",
);
assert(
  getNewsPostById(noDateId)?.dateUpdated === "",
  "dateUpdated starts empty",
);

const pubResult = publishNews(noDateId);
assert(pubResult.ok, "publishNews on full draft ok", pubResult.errors.join("; "));
assert(pubResult.errors.length === 0, "no errors on valid publish");

const pubRow = getNewsPostById(noDateId);
assert(pubRow?.status === "published", "status = published after publishNews");
assert(
  pubRow?.datePublished === TODAY,
  `datePublished auto-filled to today (${TODAY})`,
  pubRow?.datePublished,
);
assert(
  pubRow?.dateUpdated === TODAY,
  `dateUpdated auto-filled to today (${TODAY})`,
  pubRow?.dateUpdated,
);

// ── List reflects published status ────────────────────────────────────────────

section("List view reflects published status");

const allPosts = getAllNewsPosts();
const publishedCount = allPosts.filter((p) => p.status === "published").length;
assert(publishedCount === 1, "getAllNewsPosts returns 1 published row");
assert(
  allPosts.find((p) => p.id === noDateId)?.status === "published",
  "list shows correct status for published row",
);

// ── Archive from published ─────────────────────────────────────────────────────

section("Archive from published");

const archivePublished = archiveNews(noDateId);
assert(archivePublished.ok, "archiveNews on published post ok");
assert(archivePublished.errors.length === 0, "no errors on archive");
assert(
  getNewsPostById(noDateId)?.status === "archived",
  "status = archived after archiveNews from published",
);

// ── Valid publish — dates already filled ──────────────────────────────────────

section("Valid publish — existing dates preserved");

const withDateCreate = createNewsDraft({
  slug: "qa-publish-with-dates",
  en_title: "Full Draft With Explicit Dates",
  en_summary: "This draft tests that explicit dates are preserved on publish.",
  en_body: FULL_BODY,
  en_seo_title: "With-Dates Publish QA",
  en_meta_description: "QA test for explicit date preservation on publish.",
  category: "company",
  source_url: "https://example.com/qa-explicit-dates",
  source_label: "government",
  date_published: "2026-04-01",
  date_updated: "2026-04-15",
  featured_homepage: 0,
  featured_digest: 0,
  noindex: 0,
  ru_published: 0,
});
assert(withDateCreate.ok, "create with-date draft ok", withDateCreate.errors.join("; "));

if (!withDateCreate.ok || !withDateCreate.id) {
  console.error("With-date draft create failed — aborting.");
  process.exit(1);
}
createdIds.push(withDateCreate.id);
const withDateId = withDateCreate.id;

const pubWithDate = publishNews(withDateId);
assert(pubWithDate.ok, "publishNews with explicit dates ok", pubWithDate.errors.join("; "));

const withDateRow = getNewsPostById(withDateId);
assert(
  withDateRow?.datePublished === "2026-04-01",
  "existing datePublished preserved (not overwritten)",
  withDateRow?.datePublished,
);
assert(
  withDateRow?.dateUpdated === "2026-04-15",
  "existing dateUpdated preserved (not overwritten)",
  withDateRow?.dateUpdated,
);
assert(withDateRow?.status === "published", "status = published");

// ── Archive from draft ─────────────────────────────────────────────────────────

section("Archive from draft");

const archiveDraftCreate = createNewsDraft({
  slug: "qa-archive-from-draft",
  en_title: "Draft to Be Archived Directly",
});
assert(
  archiveDraftCreate.ok,
  "create draft-to-archive ok",
  archiveDraftCreate.errors.join("; "),
);

if (!archiveDraftCreate.ok || !archiveDraftCreate.id) {
  console.error("Archive-from-draft create failed — aborting.");
  process.exit(1);
}
createdIds.push(archiveDraftCreate.id);
const archiveDraftId = archiveDraftCreate.id;

const archiveDraftResult = archiveNews(archiveDraftId);
assert(archiveDraftResult.ok, "archiveNews on draft ok");
assert(
  getNewsPostById(archiveDraftId)?.status === "archived",
  "status = archived after archiveNews from draft",
);

// ── DB count checks ────────────────────────────────────────────────────────────

section("DB counts mid-test");
assert(
  countTable("news_posts") === createdIds.length,
  `news_posts = ${createdIds.length} (all created rows present)`,
);

// ── Code inspection ────────────────────────────────────────────────────────────

section("Code inspection: NewsStatusPanel");

const panelCode = readFileSync(
  join(process.cwd(), "app/admin/content/_components/NewsStatusPanel.tsx"),
  "utf-8",
);
assert(
  panelCode.includes("publishNewsAction"),
  "NewsStatusPanel imports publishNewsAction",
);
assert(
  panelCode.includes("archiveNewsAction"),
  "NewsStatusPanel imports archiveNewsAction",
);
assert(
  panelCode.includes("useActionState"),
  "NewsStatusPanel uses useActionState",
);
assert(
  panelCode.includes("no further actions"),
  "archived state shows no-further-actions message",
);
assert(
  !panelCode.includes("image_upload") && !panelCode.includes("ImageUpload"),
  "no image upload in NewsStatusPanel",
);

section("Code inspection: actions/news.ts");

const actionCode = readFileSync(
  join(process.cwd(), "app/admin/content/actions/news.ts"),
  "utf-8",
);
assert(
  actionCode.includes("publishNewsAction"),
  "actions/news.ts exports publishNewsAction",
);
assert(
  actionCode.includes("archiveNewsAction"),
  "actions/news.ts exports archiveNewsAction",
);
assert(
  actionCode.includes("publishNews("),
  "publishNewsAction calls publishNews writer",
);
assert(
  actionCode.includes("archiveNews("),
  "archiveNewsAction calls archiveNews writer",
);

section("Code inspection: edit page grid layout");

const editPageCode = readFileSync(
  join(process.cwd(), "app/admin/content/news/[id]/page.tsx"),
  "utf-8",
);
assert(
  editPageCode.includes("grid"),
  "edit page uses grid layout",
);
assert(
  editPageCode.includes("NewsStatusPanel"),
  "edit page renders NewsStatusPanel",
);
assert(
  editPageCode.includes("NewsPreview"),
  "edit page renders NewsPreview",
);
assert(
  editPageCode.includes("validateNewsPublish"),
  "edit page pre-computes validateNewsPublish",
);

section("Code inspection: NewsForm unchanged (no publish/archive buttons)");

const formCode = readFileSync(
  join(process.cwd(), "app/admin/content/_components/NewsForm.tsx"),
  "utf-8",
);
assert(
  !formCode.includes("publishNewsAction") && !formCode.includes("archiveNewsAction"),
  "NewsForm does not import publish/archive actions",
);
assert(
  !formCode.includes("value=\"publish\"") && !formCode.includes("Publish now"),
  "NewsForm has no publish button",
);
assert(
  !formCode.includes("archive"),
  "NewsForm has no archive button",
);

section("Code inspection: list page visual distinction");

const listCode = readFileSync(
  join(process.cwd(), "app/admin/content/news/page.tsx"),
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

// ── Cleanup ───────────────────────────────────────────────────────────────────

section("Cleanup: delete all created rows");

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
