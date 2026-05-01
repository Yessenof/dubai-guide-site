// Upgrades EN content for open-business-bank-account-dubai.
// Rewrites guide-level EN fields and replaces 8 steps with 9.
// All ru_* fields are left empty (untouched).
// Run locally only. No production changes.

import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const SLUG = "open-business-bank-account-dubai";
const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const BACKUP_PATH = path.join(
  process.cwd(),
  "data",
  `guides.db.backup-bank-en-upgrade-${Date.now()}`
);

// ── Backup ────────────────────────────────────────────────────────────────────
fs.copyFileSync(DB_PATH, BACKUP_PATH);
console.log(`Backup created: ${path.basename(BACKUP_PATH)}`);

const db = new Database(DB_PATH);

// ── Guard: slug must exist ────────────────────────────────────────────────────
const existing = db
  .prepare("SELECT id, en_title FROM guides WHERE slug = ?")
  .get(SLUG) as { id: string; en_title: string } | undefined;

if (!existing) {
  console.error(`Guide not found: ${SLUG}`);
  process.exit(1);
}

const beforeStepCount = (
  db
    .prepare("SELECT COUNT(*) as c FROM steps WHERE guide_id = ?")
    .get(existing.id) as { c: number }
).c;

console.log(`Before: "${existing.en_title}" — ${beforeStepCount} steps`);

// ── Content ───────────────────────────────────────────────────────────────────

const GUIDE_FIELDS = {
  en_title:
    "Open a Business Bank Account in Dubai for a UAE Company",

  en_summary:
    "Step-by-step guide to opening a corporate bank account in Dubai after company formation. " +
    "Covers what UAE banks actually check: shareholders, business model, source of funds, " +
    "customer and supplier profiles, and expected transaction volumes. " +
    "Approval depends on the bank's compliance review.",

  en_audience:
    "Founders and company owners with a UAE mainland or free zone trade license who need a " +
    "corporate bank account. Covers consulting, trading, e-commerce, and real estate companies. " +
    "Relevant whether the shareholder applies directly or through an authorized representative.",

  en_overview:
    "A UAE trade license does not automatically open a business bank account. " +
    "Banks run their own KYC and compliance review: they verify who owns the company, what it does, " +
    "where funds come from, who the customers and suppliers are, and what transaction volumes to expect. " +
    "Some business activities, such as real estate, trigger additional compliance steps. " +
    "Approval depends on the bank's internal compliance decision, not on the government.\n\n" +
    "No government fee applies. Most traditional banks require a minimum average monthly balance, " +
    "typically AED 25,000–50,000. Some digital banks operate without a minimum balance requirement. " +
    "The process typically takes 2–6 weeks from submission to account activation. " +
    "Approval is not guaranteed: banks can decline applications without providing a reason, " +
    "and a rejection at one bank does not affect eligibility at another.",

  price:
    "No government fee. Traditional banks typically require a minimum average monthly balance " +
    "of AED 25,000–50,000. Some digital banks have no minimum balance requirement.",
};

interface Step {
  cost: string;
  time_est: string;
  en_title: string;
  en_what: string;
  en_where: string;
  en_address: string;
  en_advice: string;
  en_warning: string;
}

const STEPS: Step[] = [
  // ── Step 1 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee",
    time_est: "1 day",
    en_title: "Confirm Your Company Profile and Applicant Role",
    en_what:
      "Confirm your company type, trade license category, and who will submit the application. " +
      "The company owner or shareholder can apply directly. " +
      "If a representative handles the process, the bank will ask whether they hold a Power of Attorney.",
    en_where: "Your own records (trade license, MOA, share certificate)",
    en_address: "DED/DET portal or free zone authority portal",
    en_advice:
      "Check whether your trade license activity is accepted by the bank before submitting. " +
      "Not all banks accept all business activities or all free zone licenses. " +
      "Any shareholder holding 25% or more of the company will need to provide identity documents, " +
      "even if they are not the applicant.",
    en_warning:
      "Freelance licenses and personal banking accounts are outside the scope of a corporate bank " +
      "account application. Confirm your license type before proceeding.",
  },

  // ── Step 2 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee at this stage",
    time_est: "1–2 days",
    en_title: "Choose the Bank Route and Understand Digital Onboarding",
    en_what:
      "Select whether to apply through a traditional UAE bank or a digital bank. " +
      "Traditional banks include Emirates NBD, Mashreq, RAKBANK, and ADCB. " +
      "Wio Business is one example of a UAE-licensed digital bank with a fully online " +
      "onboarding process and no minimum balance requirement.",
    en_where: "Bank website or business banking branch",
    en_address: "Bank's business banking portal or nearest branch",
    en_advice:
      "Consider what account features your business needs before choosing: multi-currency accounts " +
      "(AED, USD, EUR, GBP), cheque book, debit or virtual cards, salary payments (WPS), payment " +
      "gateway, POS terminal, or international transfers. " +
      "If your free zone has a preferred banking partner, onboarding through that channel is often faster.",
    en_warning:
      "Wio Business is not a partner of Guidex. Account approval is determined entirely by the " +
      "bank's compliance team, regardless of which bank or onboarding channel you use.",
  },

  // ── Step 3 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee",
    time_est: "1–2 days",
    en_title: "Prepare Company, Shareholder, and Authority Documents",
    en_what:
      "Collect the core company and identity documents the bank will require. " +
      "The base set is consistent across most UAE banks, though specific requirements vary by " +
      "bank type and whether the applicant is the shareholder or an authorized representative.",
    en_where: "Your own records, free zone authority, or DED",
    en_address: "Free zone portal or DED/DET online services",
    en_advice:
      "Standard documents required at most UAE banks: trade license, memorandum of association (MOA), " +
      "certificate of incorporation (for free zone companies), shareholding structure or share " +
      "certificate, establishment card, passport copies and Emirates IDs for all shareholders holding " +
      "25% or more, and proof of address. " +
      "If a representative is applying under a Power of Attorney, include the notarized and attested " +
      "POA document. " +
      "Prepare certified copies: most banks require originals or certified copies, not photocopies.",
    en_warning:
      "Expired documents will result in immediate rejection. " +
      "Check that your trade license and all identity documents are valid before submission.",
  },

  // ── Step 4 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee",
    time_est: "1–2 days",
    en_title: "Build the Business Profile the Bank Can Understand",
    en_what:
      "Prepare a clear description of what your company actually does: the specific services or " +
      "products, sectors served, and any related or partner companies. " +
      "Banks need more than a license category to assess your business.",
    en_where: "Your own records, company website, LinkedIn",
    en_address: "N/A",
    en_advice:
      "For consultancy businesses, be specific: state the exact services offered (for example, " +
      "IT consulting, financial advisory, marketing strategy, or HR management), the sectors you " +
      "serve, and your professional background. " +
      "Banks may ask for your company website, LinkedIn profile, or CV. " +
      "If your company has subsidiaries or partner companies, list them by name, country, and industry.",
    en_warning:
      "Banks may ask whether your business operates from an independent office or from a flexi desk, " +
      "virtual office, or coworking space. " +
      "Answer honestly: the response must match your registered license type and office package.",
  },

  // ── Step 5 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee",
    time_est: "1–2 days",
    en_title: "Prepare Customer and Supplier Evidence",
    en_what:
      "Banks ask for profiles of your top customers and top suppliers: name, country, website, " +
      "and a supporting document such as an invoice, contract, or receipt. " +
      "Prepare profiles for up to five customers and up to five suppliers.",
    en_where: "Your own business records",
    en_address: "N/A",
    en_advice:
      "If your company has no customers yet, prepare an alternative: a business plan or " +
      "description of your expected first customer, any signed or near-signed contracts or leads, " +
      "and your company website or LinkedIn profile. " +
      "If your business model involves no suppliers, for example a pure consulting or service firm, " +
      "state this clearly. " +
      "One supporting document per customer or supplier is better than none.",
    en_warning:
      "Customer and supplier documentation is one of the most common causes of application delays. " +
      "Gather contracts, invoices, or receipts before starting the application, not after.",
  },

  // ── Step 6 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee",
    time_est: "1–2 days",
    en_title: "Explain Source of Funds and Provide Bank History",
    en_what:
      "The bank needs to understand where the money in your business account is coming from. " +
      "Prepare documentation showing that the origin of your initial capital is legitimate and traceable.",
    en_where: "Your personal or company bank",
    en_address: "Your existing bank's online portal or nearest branch",
    en_advice:
      "Common sources of funds accepted by UAE banks: shareholder personal savings, revenue from " +
      "existing business activity, funds from family or close associates (with a written explanation), " +
      "and advance payments from buyers or clients. " +
      "Typical supporting documents: last 3 months of personal or company bank statements (files must " +
      "not be password-protected), salary payslips or salary transfer records if funds come from " +
      "employment, and sale documents or contracts if funds come from a previous business transaction.",
    en_warning:
      "A personal bank statement showing a sudden large inflow without explanation will attract " +
      "scrutiny during compliance review. " +
      "Prepare a brief written explanation of the origin of your initial capital before the bank " +
      "requests it.",
  },

  // ── Step 7 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee",
    time_est: "1 day",
    en_title: "Prepare Expected Transaction and Tax Information",
    en_what:
      "Banks ask about expected account activity to assess your compliance profile and determine " +
      "the right account tier. " +
      "Prepare estimates for annual turnover, monthly deposits and withdrawals, percentage of cash " +
      "transactions, and which banking services you need.",
    en_where: "Your own financial projections",
    en_address: "N/A",
    en_advice:
      "Prepare estimates for: annual turnover, monthly incoming and outgoing payments, percentage " +
      "of cash versus digital transactions, local and international transfer volumes, and whether " +
      "you need salary payments (WPS), cheque books, debit or virtual cards, a payment gateway, " +
      "POS terminals, or a multi-currency account. " +
      "Tax residency questions are standard compliance under FATCA and CRS rules. " +
      "Have your Tax Identification Number (TIN) ready if you hold one in any country.",
    en_warning:
      "If any shareholder is a U.S. citizen or U.S. tax resident, the bank will ask additional " +
      "questions under FATCA compliance requirements. " +
      "This does not prevent account opening but adds a step to the review process.",
  },

  // ── Step 8 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee (regulatory registration costs are separate)",
    time_est: "Varies by regulatory status",
    en_title: "Handle Compliance Checks for Real Estate and Regulated Activities",
    en_what:
      "Real estate businesses face additional compliance questions during bank onboarding. " +
      "If your company holds a real estate license or operates as a broker, agent, or developer, " +
      "the bank may ask about your RERA license, your AML and KYC process, and your goAML " +
      "registration status.",
    en_where: "RERA (Dubai Land Department) / UAE Ministry of Economy goAML portal",
    en_address: "Dubai Land Department portal / UAE Ministry of Economy goAML portal",
    en_advice:
      "Real estate firms and brokers in the UAE are classified as Designated Non-Financial " +
      "Businesses and Professions (DNFBPs) under UAE AML regulations, and banks apply additional " +
      "scrutiny to this category. " +
      "Having a valid RERA license and awareness of your goAML registration status will reduce " +
      "delays and show the bank that your compliance readiness is in order.",
    en_warning:
      "This guide does not provide legal or compliance advice. " +
      "If you are unsure whether your business activity requires RERA registration or goAML " +
      "reporting obligations, consult a UAE compliance professional before your bank application.",
  },

  // ── Step 9 ──────────────────────────────────────────────────────────────────
  {
    cost: "No fee at most banks. Some charge an account opening fee of up to AED 500.",
    time_est: "2–6 weeks from submission (varies by bank and compliance review)",
    en_title: "Submit, Answer Bank Questions, and Wait for the Decision",
    en_what:
      "Submit your completed application through the bank's business banking channel. " +
      "The review progresses through stages: document review, compliance review, and a final " +
      "decision. " +
      "The bank may contact you at any point by phone, app, SMS, or WhatsApp with requests for " +
      "additional documents.",
    en_where: "UAE commercial bank or digital bank onboarding platform",
    en_address: "Bank's business banking portal or nearest branch",
    en_advice:
      "Respond to any bank request within 24–48 hours: delayed responses can reset the review " +
      "period. " +
      "Once approved, a digital account and virtual card are typically available first, with " +
      "physical cards and cheque books issued separately. " +
      "Deposit the required minimum balance promptly to unlock full account functionality, and " +
      "request the bank's fee schedule before completing setup.",
    en_warning:
      "Approval is not guaranteed. " +
      "Banks can decline without providing a reason, and a rejection at one bank does not affect " +
      "your eligibility at another. " +
      "Each bank has its own compliance criteria.",
  },
];

// ── Pre-write validation ──────────────────────────────────────────────────────

const EM_DASH = "—";

function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM_DASH)) {
    console.error(`FAIL em-dash in ${label}: ${JSON.stringify(value)}`);
    process.exit(1);
  }
}

function assertNoGuaranteeLang(label: string, value: string): void {
  const lower = value.toLowerCase();
  const patterns = [
    "guaranteed approval",
    "guarantee approval",
    "will approve",
    "guarantees approval",
    "approval guaranteed",
    "open in 3 days guaranteed",
  ];
  for (const p of patterns) {
    if (lower.includes(p)) {
      console.error(`FAIL guarantee language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

function assertNoWioPartnership(label: string, value: string): void {
  const lower = value.toLowerCase();
  const forbidden = ["our partner wio", "partner with wio", "guidex partner wio", "wio partner guidex"];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL Wio partnership language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

console.log("\nRunning pre-write validation...");

for (const [key, val] of Object.entries(GUIDE_FIELDS)) {
  assertNoEmDash(`guide.${key}`, val);
  assertNoGuaranteeLang(`guide.${key}`, val);
  assertNoWioPartnership(`guide.${key}`, val);
}

for (let i = 0; i < STEPS.length; i++) {
  const step = STEPS[i];
  for (const [key, val] of Object.entries(step)) {
    assertNoEmDash(`step${i + 1}.${key}`, val);
    assertNoGuaranteeLang(`step${i + 1}.${key}`, val);
    assertNoWioPartnership(`step${i + 1}.${key}`, val);
  }
}

console.log("Pre-write validation passed.");

// ── Transaction ───────────────────────────────────────────────────────────────

db.transaction(() => {
  // Update guide-level EN fields only (leave ru_* and non-EN fields untouched)
  db.prepare(
    `UPDATE guides SET
       en_title    = ?,
       en_summary  = ?,
       en_audience = ?,
       en_overview = ?,
       price       = ?
     WHERE slug = ?`
  ).run(
    GUIDE_FIELDS.en_title,
    GUIDE_FIELDS.en_summary,
    GUIDE_FIELDS.en_audience,
    GUIDE_FIELDS.en_overview,
    GUIDE_FIELDS.price,
    SLUG
  );

  // Delete all existing steps for this guide
  const deleted = db
    .prepare("DELETE FROM steps WHERE guide_id = ?")
    .run(existing.id);
  console.log(`\nDeleted ${deleted.changes} existing step(s).`);

  // Insert 9 new steps with ru_* fields explicitly empty
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

  for (let i = 0; i < STEPS.length; i++) {
    const s = STEPS[i];
    insertStep.run(
      randomUUID(),
      existing.id,
      i + 1,
      s.cost,
      s.time_est,
      s.en_title,
      s.en_what,
      s.en_where,
      s.en_address,
      s.en_advice,
      s.en_warning
    );
    console.log(`  Inserted step ${i + 1}: "${s.en_title}"`);
  }
})();

// ── Post-write verification ───────────────────────────────────────────────────

console.log("\n--- Post-write verification ---");

const afterGuide = db
  .prepare("SELECT en_title, en_summary, ru_title FROM guides WHERE slug = ?")
  .get(SLUG) as { en_title: string; en_summary: string; ru_title: string };

const afterStepCount = (
  db
    .prepare("SELECT COUNT(*) as c FROM steps WHERE guide_id = ?")
    .get(existing.id) as { c: number }
).c;

const ruEmptyCheck = db
  .prepare(
    `SELECT COUNT(*) as c FROM steps
     WHERE guide_id = ?
       AND (ru_title != '' OR ru_what != '' OR ru_where != '' OR ru_address != '' OR ru_advice != '' OR ru_warning != '')`
  )
  .get(existing.id) as { c: number };

const emDashCheck = db
  .prepare(
    `SELECT COUNT(*) as c FROM steps
     WHERE guide_id = ?
       AND (en_title LIKE '%—%' OR en_what LIKE '%—%' OR en_where LIKE '%—%'
            OR en_advice LIKE '%—%' OR en_warning LIKE '%—%' OR cost LIKE '%—%' OR time_est LIKE '%—%')`
  )
  .get(existing.id) as { c: number };

const guideEmDash = (
  afterGuide.en_title +
  afterGuide.en_summary
).includes(EM_DASH);

console.log(`Title after:      "${afterGuide.en_title}"`);
console.log(`Summary after:    "${afterGuide.en_summary.slice(0, 80)}..."`);
console.log(`ru_title after:   "${afterGuide.ru_title}" (should be empty)`);
console.log(`Step count after: ${afterStepCount} (expected 9)`);
console.log(`RU fields empty:  ${ruEmptyCheck.c === 0 ? "YES" : "NO — FAIL"}`);
console.log(`Em-dash in steps: ${emDashCheck.c === 0 ? "none (clean)" : `${emDashCheck.c} rows — FAIL`}`);
console.log(`Em-dash in guide: ${!guideEmDash ? "none (clean)" : "FOUND — FAIL"}`);

if (afterStepCount !== 9) {
  console.error(`\nFAIL: expected 9 steps, got ${afterStepCount}`);
  process.exit(1);
}

if (ruEmptyCheck.c !== 0) {
  console.error("\nFAIL: ru_* fields are not empty");
  process.exit(1);
}

if (emDashCheck.c !== 0 || guideEmDash) {
  console.error("\nFAIL: em-dash found in content");
  process.exit(1);
}

console.log(`\nAfter: "${afterGuide.en_title}" — ${afterStepCount} steps`);
console.log("All checks passed.");
