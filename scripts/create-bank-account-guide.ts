/**
 * Creates the open-business-bank-account-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-bank-account-guide.ts
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

const SLUG = "open-business-bank-account-dubai";

const existing = db.select().from(guides).where(eq(guides.slug, SLUG)).get();
if (existing) {
  console.error(`Guide '${SLUG}' already exists. Delete it first if you want to re-create it.`);
  process.exit(1);
}

const guideId = randomUUID();
const now = new Date().toISOString();

// ── Insert guide ──────────────────────────────────────────────────────────────
db.insert(guides)
  .values({
    id:          guideId,
    slug:        SLUG,
    category:    "company-setup",
    published:   false,
    price:       "No government fee. Minimum average monthly balance of AED 25,000–50,000 required (varies by bank and account tier).",
    timeline:    "2–6 weeks (varies by bank, compliance review, and business activity)",
    lastUpdated: "April 2026",
    createdAt:   now,
    updatedAt:   now,

    enTitle:
      "How to Open a Business Bank Account in Dubai",

    enSummary:
      "A guide to opening a UAE business bank account after company formation. Covers document preparation, bank selection, compliance review, and account activation for mainland and free zone companies. Approval timelines and minimum balance requirements vary by bank and business activity.",

    enAudience:
      "Mainland and free zone company owners who have received their UAE trade license and need a business bank account. This guide covers the standard commercial bank account opening route. It does not cover personal banking, freelance accounts, or regulated financial institutions.",

    enOverview:
      "A UAE business bank account is required to operate commercially, receive payments, and pay employees. Applications are processed by the bank's internal compliance team — the bank determines eligibility, required documents, and approval timeline. Government approval is not part of this process.\n\nMost applications take 2–6 weeks from submission to activation. No government fee applies. The main ongoing cost is the minimum average monthly balance the bank requires you to maintain — typically AED 25,000–50,000, though some SME-tier accounts have lower thresholds. Approval is not guaranteed: banks can decline applications without providing a reason.",

    ruTitle:    "",
    ruSummary:  "",
    ruAudience: "",
    ruOverview: "",
  })
  .run();

console.log(`✓ Created guide: ${SLUG} (ID: ${guideId})`);

// ── Insert steps ──────────────────────────────────────────────────────────────
const guideSteps = [
  {
    stepOrder: 1,
    cost:      "No fee",
    timeEst:   "1 day (document collection)",
    enTitle:   "Prepare Your Company Documents",
    enWhat:
      "Gather the core incorporation documents the bank will require. These are issued when your trade license is granted. Have certified copies ready — most banks require originals or certified copies, not photocopies.",
    enWhere:   "Your free zone authority or DED (documents already in your possession from company formation)",
    enAddress: "Free zone portal or DED/DET online services",
    enAdvice:
      "Standard requirements across most UAE banks: trade license, certificate of incorporation, memorandum and articles of association, share certificate, and establishment card. Prepare at least two certified copy sets before approaching any bank.",
    enWarning: "",
  },
  {
    stepOrder: 2,
    cost:      "No fee",
    timeEst:   "1–2 days (research)",
    enTitle:   "Choose the Right Bank",
    enWhat:
      "Select a UAE-licensed bank that accepts your business type, ownership structure, and nationalities. Not all banks accept all business activities, free zone licenses, or shareholder nationalities. Eligibility criteria vary.",
    enWhere:   "UAE-licensed commercial bank",
    enAddress: "Bank website or nearest business banking branch",
    enAdvice:
      "Emirates NBD, Mashreq, RAKBANK, and ADCB are commonly used by SMEs. Some banks have dedicated SME units with faster processing. If your free zone has a preferred banking partner, check that option first — onboarding is often quicker.",
    enWarning: "",
  },
  {
    stepOrder: 3,
    cost:      "No fee",
    timeEst:   "1–3 days",
    enTitle:   "Prepare Supporting Business Documents",
    enWhat:
      "Compile documents that demonstrate your business is active or has a credible operating plan. Banks use these for compliance and KYC review. Requirements vary by bank, business activity, and your company's trading history.",
    enWhere:   "Internal — your own business records",
    enAddress: "N/A",
    enAdvice:
      "Common supporting documents: signed client contracts or invoices, proof of office (tenancy contract or flexi-desk agreement), business plan, and existing personal bank statements. Prepare what you have — banks generally request what is relevant to your stage.",
    enWarning:
      "If your company has no trading history, some banks will ask for a detailed business plan or projected financials. New companies without invoices or contracts may face stricter review or rejection at certain banks.",
  },
  {
    stepOrder: 4,
    cost:      "No fee at most banks. Some charge an account opening fee of AED 0–500.",
    timeEst:   "1 day (submission)",
    enTitle:   "Submit the Bank Application",
    enWhat:
      "Submit your application through the bank's business banking channel — online portal, relationship manager, or branch. Provide all company and supporting documents at the point of submission.",
    enWhere:   "UAE commercial bank",
    enAddress: "Bank's business banking portal or nearest branch",
    enAdvice:
      "Submit complete documentation at the first attempt. Incomplete applications extend review time. If the bank assigns a relationship manager, use them as your point of contact before formal submission — they can flag missing items early.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "No fee",
    timeEst:   "1–3 weeks (varies by bank, activity, and nationality)",
    enTitle:   "Complete Compliance Review",
    enWhat:
      "The bank's compliance and KYC team reviews your application. They verify shareholder identity, business activity, source of funds, and regulatory flags. This is where most delays occur.",
    enWhere:   "Internal bank process — no action required unless the bank contacts you",
    enAddress: "N/A",
    enAdvice:
      "Respond to any follow-up document requests within 24–48 hours to avoid losing your application slot. Keep your phone and email active — compliance teams contact applicants directly and timelines reset if you do not respond promptly.",
    enWarning:
      "Approval is not guaranteed. Banks can and do decline applications without providing a reason. If declined, you can apply to another bank. There is no cross-bank record of rejections.",
  },
  {
    stepOrder: 6,
    cost:      "No fee",
    timeEst:   "1–2 hours (meeting itself, if required)",
    enTitle:   "Attend the Bank Meeting if Required",
    enWhat:
      "Some banks require an in-person meeting with one or more shareholders before approving the account. This is a standard due diligence step. Not all banks require it.",
    enWhere:   "UAE commercial bank branch",
    enAddress: "Bank's designated branch (confirmed by your relationship manager)",
    enAdvice:
      "Bring original identification documents and your trade license. Be prepared to explain your business model, expected revenue, and source of initial capital. The conversation is brief — typically 20–40 minutes.",
    enWarning:
      "If a shareholder is based outside the UAE, check whether the bank requires physical presence or accepts a Power of Attorney. Not all banks accept a POA at this stage.",
  },
  {
    stepOrder: 7,
    cost:      "No fee at this stage (minimum balance required at funding — see Step 8)",
    timeEst:   "1–5 business days after final compliance approval",
    enTitle:   "Receive Approval and Activate the Account",
    enWhat:
      "Once compliance review is complete and any meeting requirements are satisfied, the bank issues approval and opens the account. You receive your account number, IBAN, and online banking access.",
    enWhere:   "UAE commercial bank",
    enAddress: "Bank's portal or branch (activation method varies)",
    enAdvice:
      "Confirm the account number, IBAN, and online banking credentials before leaving or closing the activation call. Request the bank's fee schedule so you understand transaction charges, international transfer fees, and monthly maintenance costs.",
    enWarning: "",
  },
  {
    stepOrder: 8,
    cost:      "Minimum average monthly balance: AED 25,000–50,000 (varies by bank and account tier; some SME accounts have lower thresholds)",
    timeEst:   "Same day (funding); full functionality active within 1 business day",
    enTitle:   "Fund the Account",
    enWhat:
      "Deposit the required minimum balance to activate full account functionality. Transfer from a personal account or your company's initial capital. The exact minimum varies by bank and account type.",
    enWhere:   "UAE commercial bank",
    enAddress: "Bank branch (cash deposit) or IBAN transfer (online)",
    enAdvice:
      "Keep the balance above the minimum for the first 3–6 months while the account builds a track record. Most banks apply a monthly penalty fee if the balance falls below the required minimum.",
    enWarning:
      "Confirm the exact minimum balance requirement before funding. The figure varies by bank and account tier. Some banks quote an average monthly balance rather than an end-of-day balance — confirm which method applies to your account.",
  },
];

for (const step of guideSteps) {
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

console.log(`✓ Inserted ${guideSteps.length} steps`);
console.log(`✓ Guide saved as DRAFT (published: false)`);
console.log(`  Slug:     ${SLUG}`);
console.log(`  ID:       ${guideId}`);
console.log(`  Category: company-setup`);
sqlite.close();
