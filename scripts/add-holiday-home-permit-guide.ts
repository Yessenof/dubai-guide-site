// Creates and publishes the holiday-home-permit-dubai guide.
// If the guide already exists, deletes and recreates it (idempotent).
// English only. All ru_* fields are left empty.
// Run with: npx tsx scripts/add-holiday-home-permit-guide.ts

import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";

const SLUG = "holiday-home-permit-dubai";
const EXPECTED_STEPS = 12;
const DB_PATH = path.join(process.cwd(), "data", "guides.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Content guards ────────────────────────────────────────────────────────────

const EM_DASH = "—";

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

function assertNoPartnership(label: string, value: string): void {
  const lower = value.toLowerCase();
  const forbidden = [
    "guidex partner",
    "our partner det",
    "partner with airbnb",
    "partner with booking",
    "partner with det",
  ];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL partnership language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

function assertNoPrivateData(label: string, value: string): void {
  // Reject patterns that look like specific permit IDs, DEWA numbers, or account refs
  if (/HH-\d{4,}/i.test(value) || /DEWA-\d+/i.test(value)) {
    console.error(`FAIL potential private identifier in ${label}`);
    process.exit(1);
  }
}

// ── Guide-level content ───────────────────────────────────────────────────────

const GUIDE = {
  slug:        SLUG,
  category:    "tourism",
  published:   1,  // Published immediately on production run
  price:
    "From AED 370 for a 1-bedroom unit (AED 300 per bedroom + AED 50 classification + " +
    "AED 10 Knowledge + AED 10 Innovation). Final fee depends on bedroom count and portal calculation.",
  timeline:
    "DET lists 1 business day as the target service delivery time. Review, comments, " +
    "payment confirmation and record issuance can add additional days.",
  lastUpdated: "May 2026",
  en_title:
    "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Booking.com",
  en_summary:
    "Register or renew your Dubai apartment or villa as a legal holiday home through the " +
    "DET Holiday Homes portal before listing it on Airbnb, Booking.com or other short-term rental platforms.",
  en_audience:
    "Property owners and operators who want to add or renew a Dubai holiday home unit, " +
    "upload documents, complete classification and get the permit issued through the official HH portal.",
  en_overview:
    "Dubai requires any unit offered for short-term rental to be registered as a Holiday Home " +
    "through the DET HH Permits portal before it can be listed on any platform. The permit is " +
    "issued per unit, is valid for one year, and covers both new registrations and annual renewals " +
    "through the same portal.\n\n" +
    "The portal steps through six stages: unit information, document upload, DET review, " +
    "associated forms, payment, and record issuance. Once the permit is issued, the permit number " +
    "must appear on all platform listings and the unit is subject to Tourism Dirham collection " +
    "and remittance requirements.",
};

// ── Step content ──────────────────────────────────────────────────────────────

const STEPS = [
  // ── Step 1 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Choose Add New Unit or Renew",
    en_what:
      "The HH Permits portal has two starting paths: Add New Unit for a first-time registration " +
      "of a unit, and Renew for the annual renewal of an existing permit. Select the correct path " +
      "before filling any details. A unit never previously registered must use Add New Unit. " +
      "A unit with an active or expiring permit uses Renew.",
    en_where:   "DET Holiday Homes (HH Permits) portal",
    en_address: "HH Permits portal",
    en_advice:
      "Check the current status of any existing unit in the portal before starting. " +
      "Statuses include: Approved, About To Expire, Pending, Rejected, Renewal Under Review, " +
      "Approved Under Review, and Renewal Payment Pending Approval. " +
      "If the unit already appears under your account, use Renew rather than Add New Unit.",
    en_warning:
      "Starting an Add New Unit application for a unit that already has an active permit can " +
      "create duplicate portal records. Confirm the unit status in the portal before proceeding.",
    cost:     "No fee",
    time_est: "5 minutes",
  },
  // ── Step 2 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Open the HH Permits Portal",
    en_what:
      "Log in to the DET Holiday Homes portal. If you do not have an account, register before " +
      "starting the application. Individual owner and corporate applicant accounts follow " +
      "different registration paths.",
    en_where:   "DET Holiday Homes portal",
    en_address: "HH Permits portal",
    en_advice:
      "Register using Emirates ID details for individual applicants. Corporate applicants register " +
      "using company credentials. Many owner-managed units can be registered through an individual " +
      "owner account when the owner details match the title deed. A separate management company " +
      "is not always required. If a company or operator manages the unit, the company details, " +
      "trade licence and authorisation documents must match the application. " +
      "Keep your login accessible as the portal has multiple stages that may span several days.",
    en_warning:
      "Use the correct account type. Individual owner and company/operator accounts follow " +
      "different portal registration paths and may require different documents.",
    cost:     "No fee",
    time_est: "10 minutes for first-time registration; instant for returning users",
  },
  // ── Step 3 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Fill Unit Information",
    en_what:
      "Enter unit details in Stage 1 of the portal: unit type, number of bedrooms, building name, " +
      "and area. The portal uses the bedroom count to calculate the permit fee. Complete all " +
      "required fields before advancing to the document upload stage.",
    en_where:   "DET portal - Stage 1 of 6 (Unit Information)",
    en_address: "HH Permits portal",
    en_advice:
      "Bedroom count directly determines the fee: AED 300 per bedroom. Enter the count as shown " +
      "in the title deed or floor plan. If unsure how the portal classifies a studio, verify " +
      "with DET before submitting.",
    en_warning:
      "An incorrect bedroom count affects the calculated fee and may require correction before " +
      "the application can progress. Verify the count against the title deed or floor plan.",
    cost:     "No fee at this stage",
    time_est: "15-30 minutes",
  },
  // ── Step 4 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Set Permit Dates Carefully",
    en_what:
      "Enter the permit start and end dates where the portal requires them. Holiday home permits " +
      "are generally annual. For renewals, confirm the new start date follows the expiry of the " +
      "current permit without a gap in coverage. For operator-managed units, DET guidance states " +
      "the permit issue and expiry dates must match the Property Management Letter.",
    en_where:   "DET portal - Stage 1 of 6 (Unit Information)",
    en_address: "HH Permits portal",
    en_advice:
      "Cross-check dates against the title deed and any existing permit certificate before " +
      "confirming. Date entry errors are a common source of rejection or resubmission requests.",
    en_warning:
      "A unit listed on Airbnb or Booking.com without valid permit dates is not compliant " +
      "with DET regulations.",
    cost:     "No fee at this stage",
    time_est: "5 minutes",
  },
  // ── Step 5 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Upload Required Documents",
    en_what:
      "Upload required documents in Stage 2 of the portal. Common documents include: title deed " +
      "or official ownership proof, owner passport and Emirates ID, recent DEWA bill and the DEWA " +
      "number requested by the portal, unit photos (interior and exterior), floor plan, and NOC " +
      "from building management if required. A Property Management Letter or owner authorisation " +
      "may be required depending on applicant type and portal flow. Company applicants also need " +
      "a trade licence and the authorised signatory's passport and Emirates ID. " +
      "The portal validates file type and size.",
    en_where:   "DET portal - Stage 2 of 6 (Documents)",
    en_address: "HH Permits portal",
    en_advice:
      "Scan documents at high resolution. Save files as PDF or JPG before opening the upload " +
      "stage. Having all files ready before you start reduces the risk of a session timeout " +
      "mid-upload. DET guidance refers to the DEWA account number, not the premises number. " +
      "If the current portal wording differs, follow the instructions shown in the HH portal " +
      "at the time of application. If the applicant is not the property owner, or if a company " +
      "or operator manages the unit, check the current portal requirements for owner authorisation, " +
      "Property Management Letter, and any sub-letting permission that applies to the case.",
    en_warning:
      "Incomplete or low-quality uploads stall the application at the review stage. DET may " +
      "request resubmission, adding days to the timeline. Check whether your building requires " +
      "a NOC from the developer or building management before applying.",
    cost:     "No fee at this stage",
    time_est: "30-60 minutes",
  },
  // ── Step 6 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Review and Submit the Application",
    en_what:
      "Review all entered information and uploaded documents before submitting the application. " +
      "Confirm unit details, bedroom count, permit dates, and that all required documents are " +
      "present. Submit when ready.",
    en_where:   "DET portal - Stage 3 of 6 (Review)",
    en_address: "HH Permits portal",
    en_advice:
      "Double-check bedroom count, unit type, and document files before submitting. The portal " +
      "may show a review stage before advancing to further steps. Corrections are not possible " +
      "after submission.",
    en_warning:
      "Submitting with incorrect or missing documents may move the application into a comments " +
      "or resubmission state, adding time to the process.",
    cost:     "No fee",
    time_est: "15 minutes",
  },
  // ── Step 7 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Complete Unit Classification",
    en_what:
      "Complete classification when the portal makes the Associated Forms or classification step " +
      "available. DET classifies each unit as Deluxe or Standard based on a checklist covering " +
      "amenities, furnishing quality, and safety equipment. Classification determines the Tourism " +
      "Dirham rate that applies to every guest stay after the permit is issued.",
    en_where:   "DET portal - Stage 4 of 6 (Associated Forms)",
    en_address: "HH Permits portal",
    en_advice:
      "DET public guidance describes self-classification as part of the application flow. Follow " +
      "the current sequence shown in the HH portal. The checklist covers approximately 8 groups " +
      "of criteria including safety equipment (smoke detector, fire extinguisher, first aid kit), " +
      "furnishing quality, and general unit condition. Review the full checklist on the portal " +
      "before completing this section.",
    en_warning:
      "Classification determines the Tourism Dirham rate: AED 15 per room per night for Deluxe, " +
      "AED 10 per room per night for Standard. Review the criteria carefully before committing.",
    cost:     "AED 50 (classification fee, included in the total permit fee paid in Step 8)",
    time_est: "20-30 minutes",
  },
  // ── Step 8 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Check Official Fees",
    en_what:
      "Before paying, verify the total fee shown in Stage 5 of the portal. The standard formula " +
      "is AED 300 per bedroom plus AED 50 classification fee, AED 10 Knowledge fee, and AED 10 " +
      "Innovation fee. Confirm the portal total matches the expected amount before entering " +
      "payment details.",
    en_where:   "DET portal - Stage 5 of 6 (Pay Fees)",
    en_address: "HH Permits portal",
    en_advice:
      "Fee amounts are set by DET and may be updated. Verify the confirmed total in the portal " +
      "rather than relying solely on external sources or published figures.",
    en_warning:
      "The portal fee total is the controlling figure. Example amounts in external guidance " +
      "may not reflect current DET rates.",
    cost:
      "From AED 370 (1-bedroom). AED 670 for 2-bedroom, AED 970 for 3-bedroom. " +
      "Formula: AED 300 per bedroom + AED 50 classification + AED 10 Knowledge + AED 10 Innovation.",
    time_est: "5 minutes",
  },
  // ── Step 9 ─────────────────────────────────────────────────────────────────
  {
    en_title:   "Wait for DET Review or Comments",
    en_what:
      "After submission, DET reviews the application. Status shows as Pending. No action is " +
      "required unless DET requests additional information or documents via the portal.",
    en_where:   "DET portal (monitor for status changes)",
    en_address: "HH Permits portal",
    en_advice:
      "Check the portal regularly for comments or document requests. Respond to any DET request " +
      "promptly. Delayed responses extend the review timeline. DET may also contact you by " +
      "email or SMS.",
    en_warning:
      "If the status moves to Rejected, the portal provides a reason. Common causes include a " +
      "missing NOC, title deed mismatch, or incomplete document set. Address the stated reason " +
      "before resubmitting.",
    cost:     "No fee",
    time_est:
      "Variable. DET targets 1 business day for service delivery, but review, comments and " +
      "resubmissions can extend the timeline.",
  },
  // ── Step 10 ────────────────────────────────────────────────────────────────
  {
    en_title:   "Confirm Payment and Upload Receipt if Required",
    en_what:
      "Once DET approves the review stage, the portal advances to payment. Pay the permit fee " +
      "online in Stage 5. If the portal requires a payment receipt to be uploaded after payment, " +
      "download the receipt from your bank or payment provider and upload it.",
    en_where:   "DET portal - Stage 5 of 6 (Pay Fees)",
    en_address: "HH Permits portal",
    en_advice:
      "Payment is online only. No cash. Keep a copy of the payment confirmation. " +
      "Uploading payment proof or seeing a Pending Approval status does not mean the permit " +
      "is approved. Wait until the unit status shows Approved and the permit certificate " +
      "is available for download.",
    en_warning:
      "If Renewal Payment Pending Approval remains for several business days, check the portal " +
      "for any comments before contacting DET or HH support.",
    cost:     "From AED 370 (see Step 8 for full breakdown). Online payment only.",
    time_est: "15 minutes",
  },
  // ── Step 11 ────────────────────────────────────────────────────────────────
  {
    en_title:   "Wait for Payment Approval and Record Issuance",
    en_what:
      "After payment is confirmed, DET processes the final issuance. Status moves to Stage 6 " +
      "(Record Issuance). The permit certificate is issued digitally and available for download " +
      "from the portal. The unit status must show Approved before you rely on the permit for listing.",
    en_where:   "DET portal - Stage 6 of 6 (Record Issuance)",
    en_address: "HH Permits portal",
    en_advice:
      "Download the permit certificate as soon as it appears in the portal. Save a copy in a " +
      "secure location. The certificate includes the permit number required for all platform listings.",
    en_warning:
      "Do not list the unit on Airbnb or Booking.com until the unit status is Approved and " +
      "the permit certificate is downloadable from the portal.",
    cost:     "No additional fee",
    time_est: "1-3 business days after payment confirmation",
  },
  // ── Step 12 ────────────────────────────────────────────────────────────────
  {
    en_title:   "Print the Permit and Keep the Unit Ready for Guests",
    en_what:
      "Display the permit number in the unit as required by DET. Add the permit number to your " +
      "Airbnb, Booking.com, or other platform listing. Set up Tourism Dirham collection from " +
      "guests: AED 15 per room per night (Deluxe) or AED 10 per room per night (Standard), " +
      "remitted to DET on the required schedule.",
    en_where:   "Unit location and platform listing settings",
    en_address:
      "Platform-specific (Airbnb Host Dashboard, Booking.com Extranet) and DET Tourism Dirham portal",
    en_advice:
      "Set up Tourism Dirham remittance before your first guest checks in. Collecting and " +
      "remitting the Tourism Dirham is a separate ongoing regulatory obligation from the permit " +
      "itself. Holiday Homes 2.0 handles guest check-ins, check-outs, Tourism Dirham payments " +
      "and QR code functions where applicable. DET provides reporting and payment tools in the portal.",
    en_warning:
      "Airbnb and Booking.com require Dubai holiday home listings to display a valid permit " +
      "number. Listings without a valid permit number may be suspended by the platform.",
    cost:
      "No government fee. Tourism Dirham is collected from guests: AED 15 per room per night " +
      "(Deluxe) or AED 10 per room per night (Standard).",
    time_est: "1-2 hours",
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
  assertNoPartnership(`guide.${key}`, val);
  assertNoPrivateData(`guide.${key}`, val);
}

for (let i = 0; i < STEPS.length; i++) {
  const s = STEPS[i];
  for (const [key, val] of Object.entries(s)) {
    assertNoEmDash(`step${i + 1}.${key}`, val);
    assertNoGuarantee(`step${i + 1}.${key}`, val);
    assertNoPartnership(`step${i + 1}.${key}`, val);
    assertNoPrivateData(`step${i + 1}.${key}`, val);
  }
}

console.log(`Pre-write validation passed (${Object.keys(guideFields).length} guide fields, ${STEPS.length} steps).`);

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
const now = new Date().toISOString();

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
    const deleted = db
      .prepare("DELETE FROM guides WHERE slug = ?")
      .run(SLUG);
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
  .prepare("SELECT id, slug, category, published, en_title, ru_title, ru_summary FROM guides WHERE slug = ?")
  .get(SLUG) as {
    id: string; slug: string; category: string; published: number;
    en_title: string; ru_title: string; ru_summary: string;
  } | undefined;

if (!after) {
  console.error("FAIL post-write: guide not found after insert.");
  process.exit(1);
}

const stepRows = db
  .prepare("SELECT step_order, en_title, ru_title FROM steps WHERE guide_id = ? ORDER BY step_order")
  .all(after.id) as { step_order: number; en_title: string; ru_title: string }[];

if (stepRows.length !== EXPECTED_STEPS) {
  console.error(`FAIL post-write step count: expected ${EXPECTED_STEPS}, found ${stepRows.length}`);
  process.exit(1);
}

// RU fields must be empty
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

// Em-dash check on DB values
const dbContent = db
  .prepare(
    `SELECT g.en_title, g.en_summary, g.en_audience, g.en_overview, g.price, g.timeline,
            s.en_title as s_title, s.en_what, s.en_where, s.en_address, s.en_advice, s.en_warning,
            s.cost, s.time_est
     FROM guides g
     JOIN steps s ON s.guide_id = g.id
     WHERE g.slug = ?`
  )
  .all(SLUG) as Record<string, string>[];

for (const row of dbContent) {
  for (const [key, val] of Object.entries(row)) {
    if (typeof val === "string" && val.includes(EM_DASH)) {
      console.error(`FAIL post-write em-dash found in DB field "${key}": ${JSON.stringify(val)}`);
      process.exit(1);
    }
  }
}

// Category check
if (after.category !== "tourism") {
  console.error(`FAIL post-write: expected category "tourism", got "${after.category}"`);
  process.exit(1);
}

// Published must be 1
if (after.published !== 1) {
  console.error(`FAIL post-write: guide is not published (expected 1).`);
  process.exit(1);
}

console.log("\n✓ Post-write verification passed:");
console.log(`  Slug:      ${after.slug}`);
console.log(`  ID:        ${after.id}`);
console.log(`  Category:  ${after.category}`);
console.log(`  Published: ${after.published} (live)`);
console.log(`  Steps:     ${stepRows.length}`);
console.log(`  RU fields: empty`);
console.log(`  Em-dashes: 0`);

console.log("\n12 step titles:");
for (const row of stepRows) {
  console.log(`  ${row.step_order}. ${row.en_title}`);
}

console.log("\nGuide created and published.");
console.log("Admin: http://localhost:3000/admin/guides/holiday-home-permit-dubai");
console.log("Public: http://localhost:3000/guides/holiday-home-permit-dubai");

db.close();
