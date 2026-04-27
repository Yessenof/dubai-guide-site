/**
 * Creates the renew-family-visa-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-renew-family-visa-guide.ts
 */
import Database from "better-sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const SLUG = "renew-family-visa-dubai";

const existing = db.prepare("SELECT id FROM guides WHERE slug = ?").get(SLUG);
if (existing) {
  console.error(`Guide '${SLUG}' already exists. Delete it first if you want to re-create it.`);
  process.exit(1);
}

const guideId = randomUUID();
const now = new Date().toISOString();

db.prepare(`
  INSERT INTO guides (
    id, slug, category, published, price, timeline, last_updated, created_at, updated_at,
    en_title, en_summary, en_audience, en_overview,
    ru_title, ru_summary, ru_audience, ru_overview
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '')
`).run(
  guideId,
  SLUG,
  "visas",
  0,
  "AED 250–450 for the medical fitness test (adults 18+ only; children under 18 are exempt). UAE government fees apply for the renewed residence visa and Emirates ID. Amer confirms the combined total at the counter.",
  "4–7 working days for medical results plus Amer processing in most cases. Emirates ID is delivered by post within 5–10 working days after visa approval.",
  "April 2026",
  now,
  now,
  "How to Renew a Family Residence Visa in Dubai",
  "Step-by-step guide to renewing a family residence visa for a spouse or child already holding UAE residence. Covers medical fitness test eligibility, Amer submission, and Emirates ID renewal for dependents already living inside the UAE.",
  "UAE residents renewing an existing family residence visa for a spouse or child currently living in the UAE. This guide covers the standard in-country renewal route for dependents already holding a valid or recently expired UAE residence visa.",
  `Family residence visas for dependents in the UAE must be renewed before they expire. The renewal route is shorter than the original application: no entry permit, no change of status, and no re-attestation of existing marriage or birth certificates. Renewal is processed through Amer service centers by the sponsoring UAE resident.\n\nDependents aged 18 and older must complete a medical fitness test at a GDRFA-approved center before submitting the renewal at Amer. Children under 18 are exempt from the medical test. UAE government fees for the renewed residence visa and Emirates ID are confirmed at the Amer counter. The renewed Emirates ID is delivered by post separately after the visa is issued.`
);

console.log(`✓ Created guide: ${SLUG} (ID: ${guideId})`);

const guideSteps = [
  {
    stepOrder: 1,
    cost:      "No cost",
    timeEst:   "5–10 minutes",
    enTitle:   "Check Renewal Timing and Requirements",
    enWhat:
      "Confirm the visa expiry date and whether the dependent requires a medical fitness test. Adults 18 and older must complete the medical test before submitting at Amer; children under 18 are exempt.",
    enWhere:   "Your own records",
    enAddress: "N/A. Visa expiry date is stamped in the passport or available on the ICA app.",
    enAdvice:
      "Submit the renewal at least two weeks before the visa expiry date. Late submissions may trigger overstay fees and additional processing steps. The sponsoring UAE resident must be the applicant.",
    enWarning:
      "If the sponsor's own residence visa has expired or changed, contact GDRFA or an Amer center before beginning the dependent's renewal. The renewal requires current sponsor visa documentation.",
  },
  {
    stepOrder: 2,
    cost:      "AED 250–450 (fee varies by approved medical center)",
    timeEst:   "1–3 working days for results to be uploaded to the ICA system",
    enTitle:   "Complete Medical Fitness Test",
    enWhat:
      "Attend a GDRFA-approved medical center for a blood test and chest X-ray. The result is linked to the ICA system and is required before Amer can process the residence renewal.",
    enWhere:   "GDRFA-approved medical fitness center",
    enAddress: "Any GDRFA-approved medical fitness center in Dubai. A list of approved centers is available at gdrfad.gov.ae.",
    enAdvice:
      "Bring the dependent's passport (original). Some centers also require the Emirates ID and a recent passport photo — confirm what is needed when booking.",
    enWarning:
      "Skip this step only if the dependent is under 18. Adults whose medical fitness result is not yet in the ICA system cannot complete the Amer renewal submission.",
  },
  {
    stepOrder: 3,
    cost:      "UAE government fees for residence visa renewal and Emirates ID. Amer confirms the combined total and service fee at the counter.",
    timeEst:   "Counter visit 30–60 minutes. Residence visa processed within 2–5 working days.",
    enTitle:   "Submit Renewal at Amer",
    enWhat:
      "Submit the visa renewal and Emirates ID renewal at an Amer service center. Counter staff enter both applications into the ICA system simultaneously, confirm the total government fee, and collect payment (medical fitness results must be in the ICA system before this step).",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "Bring the dependent's passport and Emirates ID (originals and copies), the sponsor's passport and Emirates ID (originals and copies), and one recent passport photo (white background, 35x45mm). Both visa and EID renewals can be submitted in a single Amer visit.",
    enWarning: "",
  },
  {
    stepOrder: 4,
    cost:      "No additional fee",
    timeEst:   "Visa stamp: 2–5 working days after Amer submission. Emirates ID: delivered by post within 5–10 working days after visa approval.",
    enTitle:   "Collect Renewed Visa and Emirates ID",
    enWhat:
      "Return to the Amer branch to collect the visa stamp in the dependent's passport once processing is complete. The updated Emirates ID is delivered by post separately and does not require a return visit.",
    enWhere:   "Amer service center (visa stamp); post delivery (Emirates ID)",
    enAddress: "Same Amer branch used for submission",
    enAdvice:
      "Track the application status using the reference number from the Amer receipt. Check via the ICA app or ica.gov.ae.",
    enWarning: "",
  },
];

for (const step of guideSteps) {
  db.prepare(`
    INSERT INTO steps (
      id, guide_id, step_order, cost, time_est,
      en_title, en_what, en_where, en_address, en_advice, en_warning,
      ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '')
  `).run(
    randomUUID(), guideId,
    step.stepOrder, step.cost, step.timeEst,
    step.enTitle, step.enWhat, step.enWhere, step.enAddress, step.enAdvice, step.enWarning
  );
}

console.log(`✓ Inserted ${guideSteps.length} steps`);
console.log(`✓ Guide saved as DRAFT (published: false)`);
console.log(`  Slug:     ${SLUG}`);
console.log(`  ID:       ${guideId}`);
console.log(`  Category: visas`);
db.close();
