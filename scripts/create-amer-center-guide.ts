/**
 * Creates the amer-center-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-amer-center-guide.ts
 */
import Database from "better-sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const SLUG = "amer-center-dubai";

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
  "Amer service fee varies by transaction (typically AED 30–220). UAE government fees are additional and depend on the specific visa type or service applied for.",
  "1–5 working days for most transactions after submission. Walk-in counter wait is 30–90 minutes; appointment reduces this to 10–20 minutes.",
  "April 2026",
  now,
  now,
  "How to Use an Amer Center in Dubai",
  "A practical guide to using Amer service centers in Dubai for personal residency transactions. Covers how to book, what documents to bring, and what to expect at the counter.",
  "UAE residents and visa applicants who need to complete a personal residency transaction at an Amer center in Dubai, including residence visa applications, renewals, Emirates ID, and entry permits.",
  `Amer is a network of service centers operated by the General Directorate of Residency and Foreigners Affairs (GDRFA) in Dubai. Amer centers handle personal residency and immigration transactions on behalf of the UAE government: new and renewed residence visas, Emirates ID, entry permits, status changes, and family file updates. Employer-side labor transactions (work permits, labor contracts, offer letter submissions) go through Tasheel — not Amer.\n\nTransactions submitted at Amer are processed by GDRFA or the Federal Authority for Identity and Citizenship (ICA). Amer charges a service fee per transaction in addition to the applicable UAE government fee. Most applications are processed within 1–5 working days of submission. Appointments are available online but walk-ins are also accepted at all branches.`
);

console.log(`✓ Created guide: ${SLUG} (ID: ${guideId})`);

const guideSteps = [
  {
    stepOrder: 1,
    cost:      "No booking fee",
    timeEst:   "Appointments typically available within 1–3 working days",
    enTitle:   "Book Your Appointment",
    enWhat:
      "Book an appointment via amer.ae or the GDRFA Dubai app, or visit as a walk-in. Appointments reduce counter wait time significantly. Walk-ins are accepted at all Amer branches but peak-hour wait can reach 60–90 minutes.",
    enWhere:   "amer.ae (online booking) or GDRFA Dubai app",
    enAddress: "Book online at amer.ae — select your nearest Amer branch in Dubai when booking",
    enAdvice:
      "Multiple Amer branches operate across Dubai including Al Barsha, Bur Dubai, and Deira. If your nearest branch has no availability, check other branches. Walk-in is the fastest option if you need to visit the same day.",
    enWarning: "",
  },
  {
    stepOrder: 2,
    cost:      "AED 2–5 per page for photocopies at Amer, if needed",
    timeEst:   "15–30 minutes to prepare",
    enTitle:   "Gather Your Documents",
    enWhat:
      "Prepare originals and photocopies of all required documents before your visit. The standard set for most Amer transactions: valid passport (original and copy), Emirates ID (original and copy), one recent passport photo (white background, 35x45mm), and the sponsor's passport and Emirates ID where applicable.",
    enWhere:   "Your own records",
    enAddress: "Prepare at home before your visit. Amer centers have on-site photocopy counters if needed.",
    enAdvice:
      "Transaction-specific documents vary. Dependent visa applications require the marriage or birth certificate (attested if foreign-issued). Status changes require the current visa page and relevant employment documents. Check the guide for your specific transaction for a complete document list.",
    enWarning:
      "Missing documents result in an incomplete application — Amer staff will return it without processing. Confirm exact requirements for your transaction before visiting.",
  },
  {
    stepOrder: 3,
    cost:      "AED 30–220 Amer service fee per transaction, plus applicable UAE government fees. The combined total varies by transaction type and visa duration.",
    timeEst:   "Counter transaction 15–30 minutes once called. Total branch time 30–90 minutes including wait (less with appointment).",
    enTitle:   "Visit the Amer Center",
    enWhat:
      "Take a queue ticket at the entrance and wait to be called. Present your documents to the counter staff. They enter the application into the GDRFA or ICA system, confirm the total fee, and collect payment. You receive a reference number and payment receipt at the end of the transaction.",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai. Major branches: Al Barsha (near Mall of the Emirates), Bur Dubai, and Deira.",
    enAdvice:
      "Most Amer branches accept card payment. Bring cash as a backup — some counters are cash-only. The staff will present a fee breakdown before payment; confirm the total before paying.",
    enWarning: "",
  },
  {
    stepOrder: 4,
    cost:      "No additional fee",
    timeEst:   "1–5 working days for most transactions. Emirates ID takes an additional 5–10 working days after residence visa approval and is delivered by post.",
    enTitle:   "Collect Your Outcome",
    enWhat:
      "After submission, your application is processed by GDRFA or ICA. Return to the same Amer branch to collect the visa stamp in your passport once approved. Emirates ID is mailed separately by ICA and does not require a return visit.",
    enWhere:   "Amer center (visa stamp collection) or post delivery (Emirates ID)",
    enAddress: "Same Amer branch used for submission, or the branch noted on your receipt",
    enAdvice:
      "Track your application status using the reference number from step 3. Check via the ICA app, ica.gov.ae, or by calling the Amer center directly.",
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
