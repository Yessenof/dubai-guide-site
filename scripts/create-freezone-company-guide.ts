/**
 * Creates the free-zone-company-setup-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-freezone-company-guide.ts
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

const SLUG = "free-zone-company-setup-dubai";

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
    price:       "AED 6,000–20,000+ per year (varies by free zone and package)",
    timeline:    "1–2 weeks (varies by free zone)",
    lastUpdated: "April 2026",
    createdAt:   now,
    updatedAt:   now,

    enTitle:
      "How to Set Up a Free Zone Company in Dubai",

    enSummary:
      "A step-by-step guide to forming a free zone company in the UAE. Covers free zone selection, license type, visa quota, document submission, and fee payment. Exact costs and timelines vary by zone — confirm specifics with your chosen free zone authority.",

    enAudience:
      "Business owners and entrepreneurs forming a UAE free zone company for export-focused, consultancy, digital, or remote businesses. This guide covers the general formation process applicable to most free zones. It does not cover DIFC, ADGM, or zone-specific regulated financial activities.",

    enOverview:
      "A UAE free zone company offers 100% foreign ownership and a simpler formation process than mainland. Free zone authorities — IFZA, DMCC, JAFZA, RAKEZ, and others — each set their own activity lists, office packages, and pricing. The zone you choose determines your annual cost, visa quota, and what your business is licensed to do.\n\nFormation typically takes 1–5 business days once documents are submitted and fees are paid. Total first-year costs range from AED 6,000 to AED 20,000+, depending on the zone, office package, and number of licensed activities. A business bank account and establishment card are required after formation. Both depend on having the trade license and incorporation documents in hand.",

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
    timeEst:   "1–2 days (research)",
    enTitle:   "Choose Your Free Zone",
    enWhat:
      "Select the free zone that fits your business activity, target market, and budget. Not all free zones accept all license types or activities. Costs, visa quotas, and physical office requirements vary significantly between zones.",
    enWhere:   "Free zone authority of your chosen zone",
    enAddress: "Each zone has its own portal — visit the zone's official website",
    enAdvice:
      "Match the free zone to your business activity first, then compare costs and visa options. IFZA, RAKEZ, and SHAMS are commonly used by SMEs for consultancy and trading. DMCC suits commodities and crypto. JAFZA suits logistics and import/export with a JAFZA address requirement.",
    enWarning: "",
  },
  {
    stepOrder: 2,
    cost:      "No fee at this stage",
    timeEst:   "1 day",
    enTitle:   "Choose License Type and Activity",
    enWhat:
      "Select the license type that matches your business: commercial (trading), professional or consultancy (services), or industrial (manufacturing). Then specify your business activity from the zone's approved list. The activity list varies by free zone — confirm your intended activity is available before proceeding.",
    enWhere:   "Free zone authority",
    enAddress: "Zone's official portal or customer service",
    enAdvice:
      "Most free zones allow multiple activities under one license for an additional fee. Confirm whether your intended combination is available in your chosen zone, and at what cost, before committing to the zone.",
    enWarning: "",
  },
  {
    stepOrder: 3,
    cost:      "Included in license package price",
    timeEst:   "1 day",
    enTitle:   "Choose Package and Visa Quota",
    enWhat:
      "Select the office arrangement and visa allocation for your company. Most free zones offer flexi-desk (shared or virtual address), dedicated desk, and full private office options. Each tier sets the maximum number of residency visas you can apply for on behalf of investors and employees.",
    enWhere:   "Free zone authority",
    enAddress: "Zone's official portal",
    enAdvice:
      "Choose your visa quota based on how many people you realistically need to sponsor in the first 12 months. Upgrading your package after setup is possible but costs more than planning ahead. Some entry-level packages cap you at one or two visas.",
    enWarning:
      "If you plan to hire employees before the end of your first license year, confirm the visa quota before paying. Downgrading to a smaller visa allocation after payment is generally not possible.",
  },
  {
    stepOrder: 4,
    cost:      "AED 100–500 (varies by zone; often included in the application fee)",
    timeEst:   "1–2 business days",
    enTitle:   "Reserve the Company Name",
    enWhat:
      "Submit your preferred company name to the free zone authority for approval. The name must not duplicate an existing company, must not include government or authority references, and must comply with UAE naming rules.",
    enWhere:   "Free zone authority",
    enAddress: "Zone's official portal",
    enAdvice:
      "Prepare two or three alternative names before submitting. Rules on trademarked terms and abbreviations vary by zone. Check the zone's naming guidelines before submitting to avoid a rejection that delays your timeline.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "Application fee: AED 500–2,000 (varies by zone; often included in package price)",
    timeEst:   "1–3 business days for review",
    enTitle:   "Submit Application Documents",
    enWhat:
      "Upload your incorporation documents to the free zone portal. Required documents typically include: shareholder passport copies, passport-size photos, and proof of residential address (utility bill or bank statement, usually within 3 months). Some zones require a business plan or an NOC if a shareholder is currently on a UAE visa.",
    enWhere:   "Free zone authority",
    enAddress: "Zone's official portal or customer service office",
    enAdvice:
      "Prepare a clean, legible set of passport scans before starting. Some free zones require documents to be attested or notarized — check the zone's document requirements before uploading to avoid rejection.",
    enWarning:
      "Documents not in English or Arabic typically require a certified translation. Confirm the zone's language requirements before submitting.",
  },
  {
    stepOrder: 6,
    cost:      "AED 6,000–20,000+ (total first-year package: license + office + registration fees, varies by zone)",
    timeEst:   "Payment processed same day",
    enTitle:   "Pay the Setup Fees",
    enWhat:
      "Pay the license fee, office package cost, and any registration charges to complete your application. Some free zones consolidate all fees into one invoice; others bill license and office fees separately.",
    enWhere:   "Free zone authority",
    enAddress: "Zone's payment portal (online)",
    enAdvice:
      "Request an itemized fee breakdown before paying. Common components: license fee, registration fee, office package, and establishment card. Confirm whether UAE VAT (5%) applies to any component.",
    enWarning:
      "Most free zones do not refund fees once the application is submitted and processed. Confirm the exact package, activity, and visa quota before making payment.",
  },
  {
    stepOrder: 7,
    cost:      "Included in Step 6",
    timeEst:   "1–5 business days after payment",
    enTitle:   "Receive License and Documents",
    enWhat:
      "Once fees are cleared and documents approved, the free zone issues your trade license and incorporation pack. Documents typically include: trade license, certificate of incorporation, memorandum and articles of association, and share certificate.",
    enWhere:   "Free zone authority",
    enAddress: "Zone's portal (download) or counter collection",
    enAdvice:
      "Download and save all incorporation documents immediately. You will need them for bank account opening, visa applications, and any supplier or client contracts. Keep at least one set of certified copies.",
    enWarning: "",
  },
  {
    stepOrder: 8,
    cost:      "Establishment card: AED 800–1,500 (varies by zone). Bank account: no setup fee, but minimum monthly balance of AED 25,000–50,000 typically required.",
    timeEst:   "Establishment card: 3–7 business days. Bank account: 2–6 weeks.",
    enTitle:   "Complete Post-License Steps",
    enWhat:
      "After receiving the license, obtain your establishment card from the free zone authority (required before applying for investor or employee visas) and open a business bank account. Both require your trade license and incorporation documents.",
    enWhere:   "Free zone authority (establishment card); UAE commercial bank (bank account)",
    enAddress: "Zone's portal or office; bank branch or online application",
    enAdvice:
      "Start the bank account process as soon as the license is issued — it takes longer than any other post-formation step. Some free zones have preferred banking partners that offer a faster account-opening process; check with your zone before approaching banks independently.",
    enWarning: "",
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
