/**
 * One-time content update: replaces seeded employment-visa guide with
 * real production content based on Tasheel/Amer/Tawjeeh price sheet.
 * Run with: npx tsx scripts/update-employment-visa.ts
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { guides, steps } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema: { guides, steps } });

// ── Find the guide ────────────────────────────────────────────────────────────
const existing = db
  .select()
  .from(guides)
  .where(eq(guides.slug, "employment-visa"))
  .get();

if (!existing) {
  console.error("Guide 'employment-visa' not found in DB. Run seed.ts first.");
  process.exit(1);
}

const guideId = existing.id;
const now = new Date().toISOString();

// ── Update guide fields ───────────────────────────────────────────────────────
db.update(guides)
  .set({
    category:    "visas",
    published:   true,
    price:       "AED 4,900 – 7,300",
    timeline:    "4–6 weeks",
    lastUpdated: "April 2025",
    updatedAt:   now,

    enTitle:
      "How to Get an Employment Visa in Dubai Without Leaving the UAE",

    enSummary:
      "A step-by-step guide to obtaining a UAE employment residence visa through the inside-country route — for employees already in the UAE who are changing employers or adjusting visa status without departing. Covers work permit, status change, medical, Emirates ID, and residence issuance, with exact government fees from Tasheel, Amer, and Tawjeeh.",

    enAudience:
      "Employees already in the UAE on any visa status, being sponsored by a Dubai-based employer on the mainland. Not applicable to free zone employment without mainland residency.",

    enOverview:
      "The inside-country employment visa route lets you obtain UAE residence without leaving the country. Your employer's PRO drives the process through three government-authorised service centers: Tasheel (MOHRE labor submissions), Amer (ICA residency and Emirates ID), and Tawjeeh (for limited-skilled labor card finalisation).\n\nThe process runs in a strict sequence: work permit and labor card first, then entry permit amendment, then status change, then medical and Emirates ID registration, then final labor card submission, and finally residence visa issuance. Each step depends on the previous one being approved before you proceed.\n\nTotal government fees range from AED 4,900 to AED 7,300 depending on your labor category. Category 1 and 2 (professional and skilled) workers pay lower MOHRE fees. Category 3 (limited skilled) workers pay significantly more at the MOHRE stage. Your employer covers most or all of these costs under UAE law — confirm the arrangement before signing your offer letter.\n\nThe timeline is approximately 4–6 weeks from work permit submission to visa stamping. Your role is to provide documents promptly, attend the medical appointment, and show up for biometrics. Your employer's PRO handles all government counter visits.",
  })
  .where(eq(guides.id, guideId))
  .run();

console.log("✓ Updated guide fields");

// ── Delete existing steps ─────────────────────────────────────────────────────
db.delete(steps).where(eq(steps.guideId, guideId)).run();
console.log("✓ Deleted old steps");

// ── Insert 8 real steps ───────────────────────────────────────────────────────
const newSteps = [
  {
    stepOrder: 1,
    cost:      "AED 278",
    timeEst:   "1–3 business days",
    enTitle:   "Submit Offer Letter, Labor Card, and Work Permit",
    enWhat:
      "Your employer's PRO submits your offer letter and initiates the labor card and work permit application at a Tasheel service center. This is the opening submission that registers your employment contract with the Ministry of Human Resources and Emiratisation (MOHRE).",
    enWhere:   "Tasheel service center",
    enAddress: "Any Tasheel branch in Dubai",
    enAdvice:
      "Your employer handles this step — your job is to provide a complete set of documents before they visit: signed offer letter, passport copy, passport photo, and any prior UAE visa page. Ensure the job title on the offer letter exactly matches what will appear on your visa.",
    enWarning: "",
  },
  {
    stepOrder: 2,
    cost:      "AED 189 insurance + AED 1,285 (Cat 1/2) or AED 3,555 (Cat 3) labor fee",
    timeEst:   "Same day as Step 1",
    enTitle:   "Pay Labor Card Insurance and MOHRE Labor Fee",
    enWhat:
      "Two separate payments are made at Tasheel in the same visit: the labor card insurance (AED 189, mandatory for all) and the MOHRE labor fee, which depends on your job category. Category 1 and 2 workers — professionals and skilled roles — pay AED 1,285. Category 3 — limited skilled roles — pay AED 3,555.",
    enWhere:   "Tasheel service center",
    enAddress: "Any Tasheel branch in Dubai",
    enAdvice:
      "Ask your employer which labor category applies to your role before the process begins. The category is set by MOHRE based on job title and qualification, not by salary.",
    enWarning:
      "Category 3 carries a significantly higher MOHRE fee. If you believe your role qualifies as skilled but has been categorised as limited skilled, raise this with your employer before submission — reclassification is difficult after the fact.",
  },
  {
    stepOrder: 3,
    cost:      "AED 1,126",
    timeEst:   "3–5 business days",
    enTitle:   "Apply for Inside-Country Entry Permit",
    enWhat:
      "Your employer applies for an inside-country entry permit on your behalf at an Amer service center. This is the residency amendment that allows you to transition to employment residence without departing the UAE.",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "This step is the pivot of the inside-country route. Approval times vary — your employer's PRO should track the application and notify you as soon as it is approved, since the remaining steps can only begin once this clears.",
    enWarning: "",
  },
  {
    stepOrder: 4,
    cost:      "AED 676",
    timeEst:   "1–2 business days",
    enTitle:   "Change Visa Status",
    enWhat:
      "Once the entry permit is approved, your current visa status is formally amended to employment residence. This status change is processed at an Amer center and is a required gateway before medical testing and Emirates ID registration can proceed.",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "Keep a clear copy of your current visa page and UAE entry stamp — the Amer typing center will need these. If your existing visa has already expired, inform your employer immediately so they can advise on the correct procedure.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "AED 323",
    timeEst:   "Results within 1–2 business days",
    enTitle:   "Complete Medical Fitness Test",
    enWhat:
      "Attend a medical fitness examination coordinated through an Amer center. The standard test includes a blood draw and a chest X-ray. Results are submitted electronically to immigration authorities.",
    enWhere:   "Amer service center (coordinates the clinic appointment)",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "Arrive early — approved clinics can be busy, especially in the morning. Bring your original passport, entry permit copy, and passport-size photo. Results are typically ready within 24 hours.",
    enWarning:
      "Results go directly to immigration and are not shared with your employer. Certain medical conditions may affect visa eligibility under UAE law. If you have a pre-existing condition, seek legal advice before starting the process.",
  },
  {
    stepOrder: 6,
    cost:      "AED 386",
    timeEst:   "Registration same day; card delivered by post in 5–10 business days",
    enTitle:   "Register for Emirates ID",
    enWhat:
      "Submit your Emirates ID application and complete biometric enrollment — fingerprints and a digital photo — at an Amer typing center. This fee covers a 2-year Emirates ID.",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "Track your card production status via the ICA app (UAE Pass) or the ICA website. You will receive a notification when the card is dispatched. Until it arrives, keep a printed copy of your registration receipt as proof of pending identity registration.",
    enWarning: "",
  },
  {
    stepOrder: 7,
    cost:      "AED 78 (skilled, via Tasheel) or AED 152 (limited skilled, via Tawjeeh)",
    timeEst:   "1–2 business days",
    enTitle:   "Final Labor Card Submission",
    enWhat:
      "The finalized labor contract and card are submitted to complete your MOHRE registration. Skilled workers (Category 1/2) complete this at a Tasheel center. Limited skilled workers (Category 3) go through a Tawjeeh center instead.",
    enWhere:   "Tasheel (skilled) or Tawjeeh (limited skilled)",
    enAddress: "Any Tasheel or Tawjeeh branch in Dubai",
    enAdvice:
      "Your employer's PRO will know which service center applies to your category. Confirm before visiting to avoid a wasted trip — Tasheel and Tawjeeh are separate networks.",
    enWarning: "",
  },
  {
    stepOrder: 8,
    cost:      "AED 546",
    timeEst:   "3–5 business days",
    enTitle:   "Residence Visa Issuance",
    enWhat:
      "The final step. Your employer's PRO submits the residence visa issuance application at an Amer center. Once approved, your UAE employment residence visa is stamped into your passport.",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "Your passport will be held briefly during the stamping process. Avoid booking international travel until you have it back in hand. Once the visa is stamped, photograph it immediately as a backup.",
    enWarning:
      "Ensure your passport has at least 12 months of validity remaining before submitting. Applications on passports close to expiry may be rejected by GDRFA, causing delays and additional fees.",
  },
];

for (const step of newSteps) {
  db.insert(steps)
    .values({
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
    })
    .run();
}

console.log(`✓ Inserted ${newSteps.length} steps`);
console.log("✓ employment-visa guide updated with real production content");
sqlite.close();
