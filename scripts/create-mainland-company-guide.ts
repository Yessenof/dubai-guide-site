/**
 * Creates the mainland-company-setup-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-mainland-company-guide.ts
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

const SLUG = "mainland-company-setup-dubai";

// Guard: do not overwrite if already exists
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
    price:       "AED 12,000–25,000+ (government fees only)",
    timeline:    "2–4 weeks (without external approvals)",
    lastUpdated: "April 2026",
    createdAt:   now,
    updatedAt:   now,

    enTitle:
      "How to Set Up a Mainland Company in Dubai",

    enSummary:
      "A step-by-step guide to forming a DED-licensed mainland company in Dubai. Covers trade name reservation, initial approval, Ejari registration, and license issuance with government fees. Not applicable to regulated sectors without accounting for additional authority approvals.",

    enAudience:
      "Business owners and entrepreneurs forming a DED-licensed mainland company in Dubai under a commercial, professional, or industrial license. Regulated sectors such as health, education, and financial services require additional authority approvals not covered by this guide.",

    enOverview:
      "A Dubai mainland company is licensed by DED (Dubai Economy and Tourism) and can trade with customers across the UAE, including government entities and local businesses. Since 2021, most activities allow 100% foreign ownership without a local sponsor. Your license type (commercial, professional, or industrial) is determined by your business activity.\n\nThe process runs in three phases: name reservation and initial approval (1–3 business days), office setup and Ejari registration (1–5 business days), and license application and fee payment (1–3 business days). Government fees range from AED 12,000 to AED 25,000+, not including office rent. Regulated activities such as health, education, or food businesses require external authority approvals that add 4–10 weeks.",

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
    timeEst:   "1 day",
    enTitle:   "Choose Your Business Activity",
    enWhat:
      "Search the DED activity list and identify the activity code that matches your business. The activity determines your license type (commercial, professional, or industrial) and whether additional approvals from other government bodies are required before DED can issue your license.",
    enWhere:   "DED (Dubai Economy and Tourism)",
    enAddress: "dedubai.gov.ae — search Business Activities",
    enAdvice:
      "If your activity falls under a regulated sector — health, education, food, real estate brokerage, or financial services — check the DED portal for the external approval requirement before starting. Regulated activities add 4–10 weeks to the total timeline.",
    enWarning:
      "Selecting the wrong activity requires a license amendment after issuance. Amendments cost AED 5,000–10,000+. Confirm your activity code with a DED consultant or PRO before proceeding if you are unsure.",
  },
  {
    stepOrder: 2,
    cost:      "No fee at this stage",
    timeEst:   "1 day",
    enTitle:   "Choose Your Legal Structure",
    enWhat:
      "Select the legal form for your company. For most SMEs: LLC (minimum 2 shareholders, up to 50, liability limited to share capital), Sole Establishment (single owner, unlimited personal liability), or Civil Company (for licensed professionals such as lawyers, engineers, and doctors). The legal structure affects your documents, fees, and liability exposure.",
    enWhere:   "DED (Dubai Economy and Tourism)",
    enAddress: "dedubai.gov.ae",
    enAdvice:
      "An LLC requires a Memorandum of Association notarized by a UAE notary (AED 1,500–4,000). A Sole Establishment skips this and is simpler and cheaper to form. Choose an LLC if you have co-founders or plan to bring in investors at any stage.",
    enWarning: "",
  },
  {
    stepOrder: 3,
    cost:      "AED 620–720",
    timeEst:   "1–2 business days",
    enTitle:   "Reserve Your Trade Name",
    enWhat:
      "Reserve your company name through the DED portal or a service center. The name must not duplicate an existing registered company, must not include government or authority references, and should be consistent with your approved business activity.",
    enWhere:   "DED (Dubai Economy and Tourism)",
    enAddress: "dedubai.gov.ae → Trade Name Reservation, or any DED service center",
    enAdvice:
      "Prepare two or three alternative names before submitting — rejections are common for popular terms. The DED system automatically generates an Arabic transliteration of your name; review it before confirming, as it appears on the license.",
    enWarning: "",
  },
  {
    stepOrder: 4,
    cost:      "AED 100–1,000 (varies by activity)",
    timeEst:   "1–3 business days",
    enTitle:   "Get Initial Approval",
    enWhat:
      "Submit your trade name, business activity, legal structure, and shareholder passport copies to DED for initial approval. Initial approval is not a license. It is a government confirmation that you can proceed to set up your office and collect the remaining documents.",
    enWhere:   "DED (Dubai Economy and Tourism)",
    enAddress: "dedubai.gov.ae, or any DED service center",
    enAdvice:
      "The initial approval certificate is valid for 6 months. Use this window to sign your office lease and apply for any required external approvals. If it lapses, you must reapply and pay the fee again.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "AED 220 registration fee (office rent is separate)",
    timeEst:   "1–2 business days after signing the lease",
    enTitle:   "Register Your Office Lease",
    enWhat:
      "Sign a commercial lease for your Dubai office, shop, or warehouse, then register the lease through the Ejari system. Ejari registration is mandatory — DED will not accept a license application without a registered commercial lease.",
    enWhere:   "Real Estate Regulatory Agency (RERA)",
    enAddress: "ejari.gov.ae, or any Ejari-registered typing center",
    enAdvice:
      "Confirm with your landlord that the premises type (office, retail, warehouse) matches your DED business activity before signing. The Ejari address and premises classification must align with what DED approved in your initial approval.",
    enWarning:
      "Flexi-desks and co-working memberships are not accepted by DED for most mainland licenses. A dedicated commercial space with an exclusive lease agreement is required.",
  },
  {
    stepOrder: 6,
    cost:      "AED 500–15,000+ depending on the authority",
    timeEst:   "4–10 weeks",
    enTitle:   "Obtain External Approvals",
    enWhat:
      "If your activity is regulated, apply for approval from the relevant government authority before DED can issue your license. Health activities require DHA approval. Education requires KHDA. Food businesses require Dubai Municipality. Real estate brokerage requires RERA. Most commercial and professional activities skip this step entirely.",
    enWhere:   "Relevant government authority (DHA, KHDA, Dubai Municipality, RERA, etc.)",
    enAddress: "Varies by authority — the DED portal lists which approvals apply to your activity",
    enAdvice:
      "Submit external approval applications as soon as your initial approval is issued, not after your Ejari is ready. These approvals take weeks and run in parallel with office setup.",
    enWarning:
      "DED cannot issue your license until all required external approvals are received. This is the most common cause of timeline overruns for regulated businesses.",
  },
  {
    stepOrder: 7,
    cost:      "AED 8,000–20,000+ (license fee varies by activity and structure)",
    timeEst:   "1–3 business days after submission",
    enTitle:   "Submit the License Application",
    enWhat:
      "Upload all required documents to the DED portal and pay the license fee. Required documents: initial approval certificate, Ejari registration, shareholder passport copies, MOA (for LLC, notarized), and external approvals if applicable.",
    enWhere:   "DED (Dubai Economy and Tourism)",
    enAddress: "dedubai.gov.ae",
    enAdvice:
      "For LLC structures, the MOA must be notarized by a UAE notary before submission. Any documents not in Arabic or English must include a DED-certified translation. Verify the documents checklist on the DED portal for your specific activity before submitting.",
    enWarning:
      "The license fee paid at this step is non-refundable if your application is rejected due to incomplete or mismatched documents. Review everything before submitting.",
  },
  {
    stepOrder: 8,
    cost:      "Included in Step 7",
    timeEst:   "1–3 business days after payment",
    enTitle:   "Receive Your Trade License",
    enWhat:
      "DED issues your trade license once all documents are verified and fees are cleared. Download the license from the DED portal. The license is valid for one year and must be renewed before the expiry date each year.",
    enWhere:   "DED (Dubai Economy and Tourism)",
    enAddress: "dedubai.gov.ae",
    enAdvice:
      "After receiving the license, your next steps are: open a business bank account (allow 2–6 weeks), obtain an establishment card from ICA (required before applying for employee or investor visas), and register for VAT if your annual revenue is expected to exceed AED 375,000.",
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
