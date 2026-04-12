/**
 * One-time seed script: inserts the employment-visa guide into data/guides.db.
 * Run with: npx tsx scripts/seed.ts
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
  slug:        "employment-visa",
  category:    "visas",
  published:   true,
  price:       "AED 3,000 – 5,000",
  timeline:    "3–5 weeks",
  lastUpdated: "April 2025",
  createdAt:   now,
  updatedAt:   now,
  enTitle:    "How to Get an Employment Visa in Dubai",
  enSummary:  "A complete step-by-step guide to obtaining a UAE employment visa. Covers the full process from entry permit to visa stamping, for employees being sponsored by a UAE-based employer.",
  enAudience: "Employees being sponsored by a UAE-based employer",
  enOverview: "The UAE employment visa process runs through your employer. Your company initiates the process by applying for an entry permit on your behalf. Once you arrive in the UAE, you complete a medical fitness test, register for your Emirates ID, and then receive your residence visa stamped in your passport.\n\nThe full process typically takes 3–5 weeks from entry permit approval to visa stamping. Your employer's PRO (Public Relations Officer) or HR team usually handles the government submissions — your role is to provide documents and attend appointments on time.",
  ruTitle:    "",
  ruSummary:  "",
  ruAudience: "",
  ruOverview: "",
}).run();

// ── Steps ────────────────────────────────────────────────────────────────────
const stepsData = [
  {
    stepOrder: 1,
    cost:      "AED 220",
    timeEst:   "2–4 business days",
    enTitle:   "Entry permit application",
    enWhat:    "Your employer submits an entry permit application to MOHRE or the relevant free zone authority. You do not need to be in the UAE for this step.",
    enWhere:   "Ministry of Human Resources and Emiratisation (MOHRE) or free zone authority",
    enAddress: "mohre.gov.ae or your free zone portal",
    enAdvice:  "Ensure your employment contract is signed and attested before your employer applies. Delays here usually come from missing documents.",
    enWarning: "The entry permit is valid for 60 days from issue. You must enter the UAE and begin the visa process before it expires.",
  },
  {
    stepOrder: 2,
    cost:      "Free",
    timeEst:   "Day of arrival",
    enTitle:   "Enter the UAE on your entry permit",
    enWhat:    "Travel to the UAE using your entry permit. Present the permit at immigration on arrival. This activates the visa process clock.",
    enWhere:   "Dubai International Airport (DXB) or other UAE port of entry",
    enAddress: "Physical border / airport immigration",
    enAdvice:  "Print or save a digital copy of your entry permit before travel. Some airlines may ask to see it before boarding.",
    enWarning: "If you are already in the UAE on a visit visa, your employer may need to process a status change instead of a new entry permit.",
  },
  {
    stepOrder: 3,
    cost:      "AED 300 – 350",
    timeEst:   "Same day to 1 business day",
    enTitle:   "Medical fitness test",
    enWhat:    "Complete a medical fitness test at a MOHRE-approved clinic. The test typically includes a blood test and chest X-ray.",
    enWhere:   "MOHRE-approved medical fitness center",
    enAddress: "Multiple approved clinics across Dubai — check mohre.gov.ae for the nearest location",
    enAdvice:  "Bring your original passport and a copy of your entry permit. Results are usually ready within 24 hours.",
    enWarning: "Certain medical conditions can affect visa eligibility. Results are submitted directly to immigration authorities.",
  },
  {
    stepOrder: 4,
    cost:      "AED 370 – 400 (includes card issuance fees)",
    timeEst:   "1–2 business days for registration; card arrives in 5–10 business days",
    enTitle:   "Emirates ID biometrics registration",
    enWhat:    "Register your biometrics (fingerprints and photo) at an ICA-approved typing center or FAHR service center. Your Emirates ID card will be produced and mailed to you.",
    enWhere:   "Federal Authority for Identity, Citizenship, Customs and Port Security (ICA)",
    enAddress: "ICA service centers or approved typing centers across Dubai",
    enAdvice:  "You can track your Emirates ID card production status on the ICA website. Your employer's PRO often handles the form submission.",
    enWarning: "Do not lose your Emirates ID card. Replacement carries additional fees and takes time to reissue.",
  },
  {
    stepOrder: 5,
    cost:      "AED 650 – 1,200 (varies by visa duration and type)",
    timeEst:   "3–5 business days",
    enTitle:   "Residence visa stamping",
    enWhat:    "Your employer submits the final visa stamping application to the General Directorate of Residency and Foreigners Affairs (GDRFA). Your passport will be stamped with the UAE residence visa.",
    enWhere:   "General Directorate of Residency and Foreigners Affairs (GDRFA)",
    enAddress: "gdrfad.gov.ae or GDRFA service centers in Dubai",
    enAdvice:  "Your passport will be held briefly during stamping. Ensure you do not have urgent travel during this window.",
    enWarning: "If your passport expiry is within 6 months, renew it before starting this process — GDRFA requires at least 6 months validity.",
  },
];

for (const step of stepsData) {
  db.insert(steps).values({
    id:        randomUUID(),
    guideId,
    stepOrder: step.stepOrder,
    cost:      step.cost,
    timeEst:   step.timeEst,
    enTitle:   step.enTitle,
    enWhat:    step.enWhat,
    enWhere:   step.enWhere,
    enAddress: step.enAddress,
    enAdvice:  step.enAdvice,
    enWarning: step.enWarning,
    ruTitle:   "",
    ruWhat:    "",
    ruWhere:   "",
    ruAddress: "",
    ruAdvice:  "",
    ruWarning: "",
  }).run();
}

console.log(`✓ Seeded guide: employment-visa (id: ${guideId})`);
console.log("✓ Seeded 5 steps");
sqlite.close();
