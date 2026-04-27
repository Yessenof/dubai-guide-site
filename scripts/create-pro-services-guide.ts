/**
 * Creates the pro-services-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-pro-services-guide.ts
 */
import Database from "better-sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const SLUG = "pro-services-dubai";

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
  "government",
  0,
  "PRO service fees are set by the provider and are not government-regulated. Most companies charge per transaction or a monthly retainer for ongoing work. Request written quotes from at least two providers before committing.",
  "PRO engagement typically takes 1–3 working days to set up. Government processing times for specific transactions depend on the department and current workload.",
  "April 2026",
  now,
  now,
  "How to Use a PRO Service in Dubai",
  "A practical guide to using PRO services in Dubai for government document handling and administrative filings. Explains what PRO services cover, when to engage one, and how the engagement workflow operates.",
  "Business owners and individuals in Dubai who need government documents, license filings, or visa applications handled through a professional PRO service.",
  `A PRO (Public Relations Officer) handles government submissions and administrative paperwork on behalf of businesses and individuals in Dubai. PRO services cover tasks requiring physical presence at government offices or registered authorization: trade license renewals, employee visa and work permit processing, MOHRE registrations, DED and free zone authority filings, and document attestation submissions.\n\nMost businesses engage an external PRO service company on a per-transaction or monthly retainer basis. PRO fees are set by the provider and are not government-regulated. Processing timelines for each transaction depend on the relevant government department and current workload — see individual guides for specific timelines.`
);

console.log(`✓ Created guide: ${SLUG} (ID: ${guideId})`);

const guideSteps = [
  {
    stepOrder: 1,
    cost:      "No cost",
    timeEst:   "30–60 minutes to assess",
    enTitle:   "Identify Tasks for PRO Handling",
    enWhat:
      "PRO services handle government submissions and administrative tasks requiring physical presence at government offices or registered authorization. Common tasks: trade license renewals, employee visa and work permit applications, MOHRE registrations, DED and free zone authority filings, and document attestation submissions.",
    enWhere:   "Your own assessment",
    enAddress: "N/A — review your upcoming government filings and match them to PRO service scope",
    enAdvice:
      "Tasks with fully online options (ICA portal, DED online service, GDRFA app) may not need a PRO. PRO services add the most value for in-person government submissions, batch employee visa processing, and transactions requiring a registered company representative at government counters.",
    enWarning: "",
  },
  {
    stepOrder: 2,
    cost:      "No cost to research and request quotes",
    timeEst:   "1–3 working days to collect and compare quotes",
    enTitle:   "Find a Reputable PRO Provider",
    enWhat:
      "Research PRO service companies in Dubai and request written quotes for your specific tasks. Confirm they are licensed to handle transactions with the relevant government departments before committing.",
    enWhere:   "Referrals from other businesses, business setup companies, or direct search",
    enAddress: "N/A — no specific location required for this step",
    enAdvice:
      "Confirm which government departments the PRO company is authorized to handle. A PRO licensed for company formation filings may not be authorized for immigration transactions, and vice versa. Free zone companies need a PRO authorized by their specific free zone authority.",
    enWarning:
      "Unlicensed individuals offering PRO services informally cannot legally represent a business at government departments. Use a registered, licensed PRO company.",
  },
  {
    stepOrder: 3,
    cost:      "Letter of authorization: no cost to issue. Notarized power of attorney: AED 150–350 at a notary center (if required by the specific government department).",
    timeEst:   "Same-day to 2 working days",
    enTitle:   "Authorize and Engage Your PRO",
    enWhat:
      "Sign a service agreement with the chosen PRO company and provide written authorization for them to act on behalf of your business. For most transactions, a company letter of authorization on official letterhead is sufficient. Some government departments require a notarized power of attorney.",
    enWhere:   "PRO company office; notary center (if power of attorney required)",
    enAddress: "Varies by PRO provider. Notarized power of attorney: any notary center or legal translation office in Dubai.",
    enAdvice:
      "Keep a signed copy of all authorization documents you issue. Confirm which specific government departments and transaction types your authorization covers before the PRO begins work.",
    enWarning: "",
  },
  {
    stepOrder: 4,
    cost:      "No additional fee beyond the agreed service charge",
    timeEst:   "Document handover: same-day. Government processing time varies by transaction — see the guide for your specific procedure.",
    enTitle:   "Provide Documents to Your PRO",
    enWhat:
      "Hand over the original documents and required copies for each transaction. Your PRO will confirm the exact document list per submission, manage government counter queues, and process the filing on your behalf.",
    enWhere:   "Your office or PRO company office",
    enAddress: "N/A — agree a handover method with your provider (in person or courier)",
    enAdvice:
      "Retain a photocopy of every document you provide. Record what was submitted, the date, and the government reference number after each submission.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "No additional fee",
    timeEst:   "Varies by transaction — see individual guides for government processing timelines.",
    enTitle:   "Review and Collect Outcomes",
    enWhat:
      "Once the PRO completes the filing and collects the government-issued outcome, they return the processed documents to you. Review each document for accuracy before filing or distributing.",
    enWhere:   "Your office or PRO company office",
    enAddress: "N/A — the PRO returns documents directly to you",
    enAdvice:
      "Cross-check the issued document against your original request. Errors in names, dates, or license details on official documents can be time-consuming and costly to correct.",
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
console.log(`  Category: government`);
db.close();
