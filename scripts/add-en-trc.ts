// Creates and publishes the tax-residency-certificate-uae guide locally (EN only).
// If the guide already exists, deletes and recreates it (idempotent).
// English only. All ru_* fields are left empty.
// published=true for local preview. No production action in this script.
// Run with: npx tsx scripts/add-en-trc.ts

import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";

const SLUG          = "tax-residency-certificate-uae";
const EXPECTED_STEPS = 8;
const DB_PATH       = path.join(process.cwd(), "data", "guides.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Content guards ────────────────────────────────────────────────────────────

const EM_DASH = "\u2014";

function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM_DASH)) {
    console.error(`FAIL em-dash found in ${label}: ${JSON.stringify(value)}`);
    process.exit(1);
  }
}

function assertNoGuarantee(label: string, value: string): void {
  const lower = value.toLowerCase();
  const forbidden = [
    "guaranteed approval",
    "approval guaranteed",
    "guarantee approval",
    "guarantees approval",
    "will be approved",
    "always approved",
  ];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL guarantee language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

function assertNoPublicFeeAmount(label: string, value: string): void {
  // Exact AED government fee amounts must not appear in public-facing DB fields.
  const forbidden = ["AED 50", "AED 500", "AED 1,000", "AED 1,750", "AED 250"];
  for (const p of forbidden) {
    if (value.includes(p)) {
      console.error(`FAIL exact public fee amount in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

// ── Guide-level content ───────────────────────────────────────────────────────

const GUIDE = {
  slug:        SLUG,
  category:    "government",
  published:   1,
  price:
    "Government fees depend on applicant type and certificate format. " +
    "Guidex confirms the cost before submission.",
  timeline:
    "Reviewed after a complete file is submitted. " +
    "Guidex advises on expected timing for your case.",
  lastUpdated: "May 2026",
  en_title:   "Tax Residency Certificate in UAE",
  en_summary:
    "Need UAE tax residency proof for a foreign bank, tax authority or international income? " +
    "Guidex reviews your case, prepares the file and guides the TRC process through FTA.",
  en_audience:
    "Investors, business owners, UAE residents and free zone or mainland companies with " +
    "international banking, foreign income, or cross-border tax reporting requirements.",
  en_overview:
    "The Federal Tax Authority issues the UAE Tax Residency Certificate (TRC), the document " +
    "that banks, foreign tax authorities and international income structures use to confirm UAE " +
    "tax residency. There are two legally distinct certificate types: one for invoking double tax " +
    "treaty benefits with a specific foreign country, and one for bank KYC, CRS/FATCA reporting " +
    "and other domestic purposes. Guidex identifies the correct type before anything is filed.\n\n" +
    "Individuals qualify under one of three eligibility routes based on physical presence in the " +
    "UAE or the UAE being their primary place of financial and personal interest. Companies qualify " +
    "based on incorporation and operational presence in the UAE. Route selection, period accuracy " +
    "and document completeness all affect the outcome. Guidex reviews the full case, prepares the " +
    "file and supports the submission through EmaraTax.",
};

// ── Step content ──────────────────────────────────────────────────────────────

const STEPS = [
  // ── Step 1 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Clarify why you need the TRC",
    en_what:
      "There are two distinct certificate types: one for invoking double tax treaty benefits " +
      "with a foreign country, one for bank KYC, CRS/FATCA reporting and other domestic purposes. " +
      "The purpose determines which legal framework applies. Guidex identifies the correct type " +
      "before anything is filed.",
    en_where:   "No action required at this stage.",
    en_address: "",
    en_advice:
      "If a foreign bank or tax authority made the request, share their letter. " +
      "It usually specifies the purpose and the period they need.",
    en_warning:
      "A certificate issued for the wrong purpose cannot be amended. " +
      "A new application and new fees apply.",
    cost:     "No government fee at this stage.",
    time_est: "Same day.",
  },
  // ── Step 2 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Confirm your eligibility route",
    en_what:
      "Individuals qualify under one of three routes: 183 or more days of physical presence " +
      "in any 12-month period; 90 to 182 days combined with a legal right to reside and a UAE " +
      "permanent address or active employment; or the UAE as the primary place of residence and " +
      "centre of financial and personal interests. Companies generally need to be established in " +
      "the UAE for at least 12 months. Guidex reviews the eligibility picture before committing " +
      "to a route.",
    en_where:   "An ICA or GDRFA entry/exit report is needed for day-count routes.",
    en_address: "ICA: ica.gov.ae / GDRFA Dubai",
    en_advice:
      "The 183-day route is the most straightforward and most accepted internationally " +
      "for tax treaty purposes. Shorter-presence profiles need closer review.",
    en_warning:
      "A UAE residence visa alone does not confirm TRC eligibility. " +
      "Physical presence records must be verified first.",
    cost:
      "Government fees depend on applicant type and certificate format. " +
      "Guidex confirms the cost before submission.",
    time_est: "1 to 2 days to collect entry/exit data.",
  },
  // ── Step 3 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Confirm the certificate period",
    en_what:
      "The TRC covers one specific period of up to 12 months. It cannot cover a future period. " +
      "If more than one period is needed, each requires a separate application. Guidex confirms " +
      "the exact period with you and the requesting party before anything is filed.",
    en_where:   "No action. Guidex coordinates.",
    en_address: "",
    en_advice:
      "Foreign banks and tax authorities usually specify the period. Confirming this before " +
      "submission prevents an avoidable second application.",
    en_warning:
      "A certificate for the wrong period cannot be corrected by amendment.",
    cost:
      "A separate government fee applies per application period. Guidex confirms before submission.",
    time_est: "Same day.",
  },
  // ── Step 4 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Prepare identity and residency documents",
    en_what:
      "Documents depend on whether you are applying as an individual or a company. " +
      "Individuals need a valid passport, Emirates ID, UAE residence visa, UAE address proof, " +
      "and an entry/exit report if applying under a day-count route. " +
      "Companies need a trade licence, incorporation documents, business premises proof, " +
      "authorised signatory passport and Emirates ID, and evidence of effective management " +
      "and control in the UAE if applicable. " +
      "Guidex confirms the exact list for your case and checks all documents before submission.",
    en_where:   "Entry/exit report from ICA or GDRFA for individual day-count routes.",
    en_address: "ICA: ica.gov.ae / GDRFA Dubai",
    en_advice:
      "Guidex reviews the full document set before the file goes to FTA. " +
      "Gaps and expired documents are caught before submission, not after.",
    en_warning:
      "Expired Emirates IDs or residence visas cause rejection. " +
      "Renew before the file is submitted.",
    cost:     "Small government fee for the entry/exit report. Guidex advises.",
    time_est: "1 to 3 days.",
  },
  // ── Step 5 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Prepare financial or business documents",
    en_what:
      "Documents here depend on your route and case. Employed individuals typically provide " +
      "a salary certificate or employment contract. Self-employed applicants and business owners " +
      "provide a trade licence. Companies provide incorporation documents, trade licence and " +
      "business premises proof. Guidex confirms the exact list. Requirements vary and some items " +
      "previously considered standard are no longer mandatory under the October 2024 FTA guidance.",
    en_where:   "Employer, company records, or business registration authority.",
    en_address: "",
    en_advice:
      "Requirements changed following the October 2024 FTA guidance update. Guidex confirms " +
      "the current document list for your specific route before you collect anything.",
    en_warning:
      "A missing document resets the FTA processing clock. " +
      "Guidex prepares the full file before submission.",
    cost:     "No government fee at this stage.",
    time_est: "1 to 3 days.",
  },
  // ── Step 6 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Submit through EmaraTax",
    en_what:
      "Guidex prepares the complete file and supports the EmaraTax submission. Where authorised, " +
      "Guidex can manage the submission process for you, selecting the correct certificate type, " +
      "applicant type and period, uploading all documents and handling fee payment at submission.",
    en_where:   "EmaraTax: FTA TRC service.",
    en_address: "trc.tax.gov.ae",
    en_advice:
      "The full file is reviewed before it is submitted. FTA does not refund fees on rejection.",
    en_warning:
      "The government submission fee is non-refundable even if the application is rejected.",
    cost:
      "Government fees depend on applicant type and certificate format. " +
      "Guidex confirms the cost before submission.",
    time_est: "Submission on the day the file is complete. FTA processes from receipt.",
  },
  // ── Step 7 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Respond to any FTA clarification",
    en_what:
      "If FTA requests additional information, Guidex manages the clarification response. " +
      "The processing clock restarts from FTA receipt of the response. A well-prepared initial " +
      "file reduces the likelihood of a clarification request.",
    en_where:   "EmaraTax: same portal.",
    en_address: "trc.tax.gov.ae",
    en_advice:
      "Most clarification requests arise from a single missing or unclear document. " +
      "Guidex prepares the file to minimise this.",
    en_warning:
      "An unanswered clarification can result in application cancellation and a new submission.",
    cost:     "No additional government fee for clarifications.",
    time_est: "Depends on the FTA request. Guidex responds promptly.",
  },
  // ── Step 8 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Receive the certificate",
    en_what:
      "Once approved, the digital TRC is available on EmaraTax. Guidex delivers it ready to " +
      "share with the requesting bank or authority. If a physical stamped copy is required, " +
      "Guidex arranges this during the application process.",
    en_where:
      "EmaraTax for the digital certificate. FTA courier for hard copy (UAE addresses only).",
    en_address: "trc.tax.gov.ae",
    en_advice:
      "Confirm with the requesting party whether they accept a digital certificate before " +
      "ordering a hard copy. Most banks and tax authorities accept the digital version.",
    en_warning:
      "Hard copy delivery is to UAE addresses only. " +
      "For foreign recipients, the digital version is the correct format.",
    cost:
      "Digital certificate: included in the main government fee. " +
      "Hard copy: additional government fee applies. Guidex advises.",
    time_est:
      "Digital: available immediately after approval. " +
      "Hard copy: additional business days after approval.",
  },
];

// ── Pre-write validation ──────────────────────────────────────────────────────

console.log("Running pre-write content validation...");

if (STEPS.length !== EXPECTED_STEPS) {
  console.error(`FAIL step count: expected ${EXPECTED_STEPS}, got ${STEPS.length}`);
  process.exit(1);
}

const guideFields: Record<string, string> = {
  price:       GUIDE.price,
  timeline:    GUIDE.timeline,
  en_title:    GUIDE.en_title,
  en_summary:  GUIDE.en_summary,
  en_audience: GUIDE.en_audience,
  en_overview: GUIDE.en_overview,
};

for (const [key, val] of Object.entries(guideFields)) {
  assertNoEmDash(`guide.${key}`, val);
  assertNoGuarantee(`guide.${key}`, val);
  assertNoPublicFeeAmount(`guide.${key}`, val);
}

for (let i = 0; i < STEPS.length; i++) {
  const s = STEPS[i];
  for (const [key, val] of Object.entries(s)) {
    assertNoEmDash(`step${i + 1}.${key}`, val);
    assertNoGuarantee(`step${i + 1}.${key}`, val);
    assertNoPublicFeeAmount(`step${i + 1}.${key}`, val);
  }
}

console.log(
  `Pre-write validation passed (${Object.keys(guideFields).length} guide fields, ${STEPS.length} steps).`
);

// ── Pre-write state ───────────────────────────────────────────────────────────

const before = db
  .prepare("SELECT id, en_title, published FROM guides WHERE slug = ?")
  .get(SLUG) as { id: string; en_title: string; published: number } | undefined;

if (before) {
  console.log(`\nBefore: guide '${SLUG}' exists (id: ${before.id}, published: ${before.published}).`);
  console.log("  Will delete and recreate (idempotent).");
} else {
  console.log(`\nBefore: guide '${SLUG}' does not exist. Creating fresh.`);
}

// ── Transaction ───────────────────────────────────────────────────────────────

const guideId = randomUUID();
const now     = new Date().toISOString();

const insertGuide = db.prepare(
  `INSERT INTO guides
     (id, slug, category, published, price, timeline, last_updated, created_at, updated_at,
      en_title, en_summary, en_audience, en_overview,
      ru_title, ru_summary, ru_audience, ru_overview)
   VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      '', '', '', '')`
);

const insertStep = db.prepare(
  `INSERT INTO steps
     (id, guide_id, step_order, cost, time_est,
      en_title, en_what, en_where, en_address, en_advice, en_warning,
      ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning)
   VALUES
     (?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      '', '', '', '', '', '')`
);

db.transaction(() => {
  if (before) {
    const deleted = db.prepare("DELETE FROM guides WHERE slug = ?").run(SLUG);
    console.log(`\nDeleted existing guide (${deleted.changes} row; steps cascade-deleted).`);
  }

  insertGuide.run(
    guideId,
    GUIDE.slug,
    GUIDE.category,
    GUIDE.published,
    GUIDE.price,
    GUIDE.timeline,
    GUIDE.lastUpdated,
    now,
    now,
    GUIDE.en_title,
    GUIDE.en_summary,
    GUIDE.en_audience,
    GUIDE.en_overview,
  );

  for (let i = 0; i < STEPS.length; i++) {
    const s = STEPS[i];
    insertStep.run(
      randomUUID(),
      guideId,
      i + 1,
      s.cost,
      s.time_est,
      s.en_title,
      s.en_what,
      s.en_where,
      s.en_address,
      s.en_advice,
      s.en_warning,
    );
    console.log(`  Step ${i + 1}: ${s.en_title}`);
  }
})();

// ── Post-write verification ───────────────────────────────────────────────────

const after = db
  .prepare(
    `SELECT id, slug, category, published,
            en_title, ru_title, ru_summary
     FROM guides WHERE slug = ?`
  )
  .get(SLUG) as {
    id: string; slug: string; category: string; published: number;
    en_title: string; ru_title: string; ru_summary: string;
  } | undefined;

if (!after) {
  console.error("FAIL post-write: guide not found after insert.");
  process.exit(1);
}

const stepRows = db
  .prepare(
    "SELECT step_order, en_title, ru_title FROM steps WHERE guide_id = ? ORDER BY step_order"
  )
  .all(after.id) as { step_order: number; en_title: string; ru_title: string }[];

if (stepRows.length !== EXPECTED_STEPS) {
  console.error(`FAIL post-write step count: expected ${EXPECTED_STEPS}, found ${stepRows.length}`);
  process.exit(1);
}

if (after.ru_title !== "" || after.ru_summary !== "") {
  console.error("FAIL post-write: RU guide fields are not empty.");
  process.exit(1);
}
for (const row of stepRows) {
  if (row.ru_title !== "") {
    console.error(`FAIL post-write: ru_title not empty for step ${row.step_order}`);
    process.exit(1);
  }
}

// Em-dash and fee amount check on DB values
const dbContent = db
  .prepare(
    `SELECT g.en_title, g.en_summary, g.en_audience, g.en_overview, g.price, g.timeline,
            s.en_title  AS s_title,  s.en_what, s.en_where, s.en_address,
            s.en_advice, s.en_warning, s.cost, s.time_est
     FROM guides g
     JOIN steps s ON s.guide_id = g.id
     WHERE g.slug = ?`
  )
  .all(SLUG) as Record<string, string>[];

const FEE_PATTERNS = ["AED 50", "AED 500", "AED 1,000", "AED 1,750", "AED 250"];

for (const row of dbContent) {
  for (const [key, val] of Object.entries(row)) {
    if (typeof val !== "string") continue;
    if (val.includes(EM_DASH)) {
      console.error(`FAIL post-write em-dash in DB field "${key}": ${JSON.stringify(val)}`);
      process.exit(1);
    }
    for (const p of FEE_PATTERNS) {
      if (val.includes(p)) {
        console.error(`FAIL post-write exact fee amount "${p}" in DB field "${key}"`);
        process.exit(1);
      }
    }
  }
}

if (after.category !== "government") {
  console.error(`FAIL post-write: expected category "government", got "${after.category}"`);
  process.exit(1);
}

if (after.published !== 1) {
  console.error("FAIL post-write: guide is not published (expected 1).");
  process.exit(1);
}

console.log("\nPost-write verification passed:");
console.log(`  Slug:        ${after.slug}`);
console.log(`  ID:          ${after.id}`);
console.log(`  Category:    ${after.category}`);
console.log(`  Published:   ${after.published} (live locally)`);
console.log(`  Steps:       ${stepRows.length}`);
console.log(`  RU fields:   empty`);
console.log(`  Em-dashes:   0`);
console.log(`  AED amounts: 0`);

console.log(`\n${EXPECTED_STEPS} step titles:`);
for (const row of stepRows) {
  console.log(`  ${row.step_order}. ${row.en_title}`);
}

console.log("\nGuide created and published locally.");
console.log(`Public: http://localhost:3000/guides/${SLUG}`);

db.close();
