/**
 * One-time seed: adds the employment-visa-dubai-outside-uae guide as a DRAFT.
 * Run with: npx tsx scripts/add-employment-visa-outside.ts
 *
 * Guide is created as published: false — owner must review fees and publish via admin.
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { guides, steps } from "../lib/db/schema";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema: { guides, steps } });

const now = new Date().toISOString();
const guideId = randomUUID();

// ── Guide ────────────────────────────────────────────────────────────────────
db.insert(guides).values({
  id:          guideId,
  slug:        "employment-visa-dubai-outside-uae",
  category:    "visas",
  published:   false,   // DRAFT — review fees via admin before publishing
  price:       "AED 4,500 – 7,000",
  timeline:    "4–8 weeks",
  lastUpdated: "April 2026",
  createdAt:   now,
  updatedAt:   now,

  enTitle:    "How to Get an Employment Visa in Dubai from Outside the UAE",
  enSummary:  "Step-by-step guide for employees applying from abroad. Your employer initiates the process in Dubai; you enter on an entry permit once it is approved.",
  enAudience: "Employees outside the UAE with a confirmed offer from a Dubai mainland employer.",
  enOverview: `The outside-UAE employment visa route applies when you are currently abroad and your employer is based on the Dubai mainland. Unlike the inside-UAE route, you cannot start working until an entry permit has been issued and you have physically entered the country.\n\nYour employer handles the MOHRE and GDRFA applications. Your role begins when the entry permit is issued — you book travel to Dubai, complete the medical test and Emirates ID registration on arrival, and then the residence visa is stamped. Total government fees typically range from AED 4,500 to AED 7,000 depending on your labour category. The full process takes 4–8 weeks from application to visa stamp.`,

  ruTitle:    "",
  ruSummary:  "",
  ruAudience: "",
  ruOverview: "",
}).run();

// ── Steps ────────────────────────────────────────────────────────────────────
const stepRows = [
  {
    stepOrder: 1,
    cost:      "AED 200 – 600",
    timeEst:   "2–4 working days",
    enTitle:   "Employer submits MOHRE work permit application",
    enWhat:    "Your employer files an initial work permit application with MOHRE (Ministry of Human Resources and Emiratisation) via Tasheel. You provide your passport copy, qualifications, and job offer letter. You do not need to be in the UAE for this step.",
    enWhere:   "MOHRE via Tasheel",
    enAddress: "Any Tasheel service center in Dubai",
    enAdvice:  "Your employer or their PRO handles this. Track progress by asking your employer for the MOHRE application reference number.",
    enWarning: "",
  },
  {
    stepOrder: 2,
    cost:      "AED 1,200 – 2,000",
    timeEst:   "3–5 working days",
    enTitle:   "Employer applies for entry permit",
    enWhat:    "After MOHRE approval, your employer applies for an entry permit at GDRFA via Tasheel. The entry permit is valid for 60 days from the issue date and is single-entry. It is sent to your employer — ask them to share a copy so you can book travel.",
    enWhere:   "GDRFA via Tasheel",
    enAddress: "Any Tasheel service center in Dubai",
    enAdvice:  "Book your flight only after the entry permit is in hand. Allow a buffer of 2–3 weeks before the entry permit expiry to complete all remaining steps after arrival.",
    enWarning: "Do not enter on a tourist visa and expect to convert to a work residence visa. The correct entry document is the entry permit issued through this step.",
  },
  {
    stepOrder: 3,
    cost:      "Flight costs (not government fee)",
    timeEst:   "Travel day",
    enTitle:   "Travel to Dubai on the entry permit",
    enWhat:    "Enter the UAE using the entry permit. Show it to immigration on arrival at Dubai International Airport. You will receive an entry stamp; this begins your 60-day window to complete the remaining steps.",
    enWhere:   "Dubai International Airport",
    enAddress: "Terminal 1, 2, or 3 — any immigration counter",
    enAdvice:  "Keep a printed and digital copy of the entry permit. Inform your employer of your arrival date so they can schedule the next steps promptly.",
    enWarning: "",
  },
  {
    stepOrder: 4,
    cost:      "AED 300 – 500",
    timeEst:   "1–2 working days",
    enTitle:   "Complete the medical fitness test",
    enWhat:    "Attend a medical fitness test at a MOHRE-approved clinic. The test covers a blood test, chest X-ray, and physical examination. Results are typically available within 24 hours.",
    enWhere:   "MOHRE-approved medical center",
    enAddress: "Any approved clinic in Dubai — your employer or PRO will direct you to a nearby one",
    enAdvice:  "Bring your original passport and entry permit stamp. Some clinics require a typed application form — your employer's PRO usually prepares this.",
    enWarning: "If the test reveals certain communicable diseases, the visa process cannot proceed. This is the standard UAE immigration screening requirement.",
  },
  {
    stepOrder: 5,
    cost:      "AED 370",
    timeEst:   "3–5 working days for card delivery",
    enTitle:   "Register for Emirates ID",
    enWhat:    "Visit an EIDA (Federal Authority for Identity) service center to register your biometrics (photo, fingerprints). The Emirates ID card is mailed to your employer's address or a registered PO box within a few days.",
    enWhere:   "EIDA (ICA) service center or Amer",
    enAddress: "Any ICA service center or Amer branch in Dubai",
    enAdvice:  "You can start the registration online at ICA.gov.ae and complete biometrics in person. Bring your passport and the medical test confirmation.",
    enWarning: "",
  },
  {
    stepOrder: 6,
    cost:      "AED 1,500 – 2,500",
    timeEst:   "3–5 working days",
    enTitle:   "Residence visa stamped in passport",
    enWhat:    "Your employer or PRO submits the residence visa application at GDRFA via Amer or Tasheel. Once approved, your passport is stamped with a 2-year residence visa tied to your employer's sponsorship.",
    enWhere:   "GDRFA via Amer or Tasheel",
    enAddress: "Any Amer branch or Tasheel center in Dubai",
    enAdvice:  "Your employer submits this and holds your passport during processing (typically 2–3 working days). You receive confirmation by SMS when the visa is ready.",
    enWarning: "The residence visa must be stamped before your entry permit 60-day window expires. If it expires before stamping, an overstay fine applies.",
  },
  {
    stepOrder: 7,
    cost:      "Included in MOHRE work permit",
    timeEst:   "1–2 working days",
    enTitle:   "Labour contract and employment card issued",
    enWhat:    "MOHRE registers the employment contract in the Wages Protection System and issues the labour card. This is largely handled by your employer's system. You should receive a copy of the registered contract.",
    enWhere:   "MOHRE (processed electronically)",
    enAddress: "No in-person visit required",
    enAdvice:  "Ask your employer for a copy of the registered MOHRE contract. It confirms your official employment record and salary as per the offer letter.",
    enWarning: "",
  },
];

for (const row of stepRows) {
  db.insert(steps).values({
    id:        randomUUID(),
    guideId:   guideId,
    stepOrder: row.stepOrder,
    cost:      row.cost,
    timeEst:   row.timeEst,
    enTitle:   row.enTitle,
    enWhat:    row.enWhat,
    enWhere:   row.enWhere,
    enAddress: row.enAddress,
    enAdvice:  row.enAdvice,
    enWarning: row.enWarning,
    ruTitle:   "",
    ruWhat:    "",
    ruWhere:   "",
    ruAddress: "",
    ruAdvice:  "",
    ruWarning: "",
  }).run();
}

console.log("✓ employment-visa-dubai-outside-uae guide created as DRAFT (id:", guideId, ")");
console.log("  Review and correct fees via admin panel, then publish.");
sqlite.close();
