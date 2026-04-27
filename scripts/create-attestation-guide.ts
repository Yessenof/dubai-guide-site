/**
 * Creates the document-attestation-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-attestation-guide.ts
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

const SLUG = "document-attestation-dubai";

const existing = db.select().from(guides).where(eq(guides.slug, SLUG)).get();
if (existing) {
  console.error(`Guide '${SLUG}' already exists. Delete it first if you want to re-create it.`);
  process.exit(1);
}

const guideId = randomUUID();
const now = new Date().toISOString();

db.insert(guides)
  .values({
    id:          guideId,
    slug:        SLUG,
    category:    "government",
    published:   false,
    price:       "AED 150 per document (UAE MOFA government fee, standard processing). Home-country notarization and UAE Embassy fees vary by nationality — typically the equivalent of USD 50–200 total for the home-country chain.",
    timeline:    "2–6 weeks end-to-end. Home-country steps take 1–4 weeks depending on your country. UAE MOFA attestation takes 1–3 working days.",
    lastUpdated: "April 2026",
    createdAt:   now,
    updatedAt:   now,

    enTitle:
      "How to Get a Foreign Document Attested in the UAE",

    enSummary:
      "Step-by-step guide to attesting a foreign document — birth certificate, marriage certificate, or degree — for use in UAE government procedures or visa applications. Covers the full chain from home-country notarization to UAE MOFA attestation, with exact MOFA fees.",

    enAudience:
      "UAE residents and visa applicants who need to authenticate a foreign-issued document for use with a UAE authority — including dependent visa applications, company formation, or legal proceedings in the UAE.",

    enOverview:
      "Foreign documents must pass through a chain of authentication before UAE authorities will accept them. The standard chain has three stages: notarization and ministry authentication in the country where the document was issued, a stamp from the UAE Embassy or Consulate in that country, and final attestation by the UAE Ministry of Foreign Affairs (MOFA) inside the UAE.\n\nThe UAE MOFA step is the only stage handled inside the UAE, and the fees are fixed: AED 150 per document for standard processing (1–3 working days). The home-country stages vary by nationality and document type and are typically the slowest part. MOFA attestation can be completed online via the MOFA eServices portal or in person at a MOFA center in Dubai.",

    ruTitle:    "",
    ruSummary:  "",
    ruAudience: "",
    ruOverview: "",
  })
  .run();

console.log(`✓ Created guide: ${SLUG} (ID: ${guideId})`);

const guideSteps = [
  {
    stepOrder: 1,
    cost:      "Varies by country (typically equivalent to USD 20–80)",
    timeEst:   "1–3 working days",
    enTitle:   "Notarize the Document in Your Home Country",
    enWhat:
      "Have the original document notarized by a certified notary public in the country where it was issued. Notarization confirms that the document is genuine and the signatures are valid.",
    enWhere:   "Licensed notary public in the document's country of origin",
    enAddress: "Varies by country — contact a local notary or the document's issuing authority",
    enAdvice:
      "If your home country is a member of the Hague Apostille Convention, you may be able to get an apostille stamp instead of completing steps 1–3 separately. The UAE has accepted apostilles since 2021. An apostille from a Hague-member country replaces the home MFA and UAE Embassy chain — you go directly to UAE MOFA (step 4). Confirm with the UAE authority requesting your document whether an apostille is sufficient for your specific use case.",
    enWarning:
      "Some countries require authentication by the relevant issuing authority — such as the Ministry of Education for degrees or the civil registry for birth certificates — before a document is valid for international notarization. Check with your home country's relevant ministry before visiting a notary.",
  },
  {
    stepOrder: 2,
    cost:      "Varies by country (often free or a nominal government fee)",
    timeEst:   "1–5 working days",
    enTitle:   "Authenticate with Your Home Ministry of Foreign Affairs",
    enWhat:
      "Submit the notarized document to your home country's Ministry of Foreign Affairs (or equivalent authority) for authentication. This certifies that the notary's signature and seal are genuine.",
    enWhere:   "Ministry of Foreign Affairs (or equivalent) in your home country",
    enAddress: "Check your home country's official government portal for address and appointment requirements",
    enAdvice:
      "Some countries combine Ministry of Foreign Affairs authentication and UAE Embassy attestation into a single appointment or courier process. Confirm the current workflow with your home MFA before booking separately.",
    enWarning: "",
  },
  {
    stepOrder: 3,
    cost:      "Varies (typically equivalent to USD 30–100 per document)",
    timeEst:   "1–3 working days",
    enTitle:   "Get the UAE Embassy or Consulate Stamp",
    enWhat:
      "Take the MFA-authenticated document to the UAE Embassy or Consulate in your home country. The UAE Embassy stamps the document to confirm the home-country MFA authentication is genuine. This is the last home-country step.",
    enWhere:   "UAE Embassy or Consulate in your home country",
    enAddress: "Check the UAE Ministry of Foreign Affairs website (mofa.gov.ae) for the UAE Embassy address in your country",
    enAdvice:
      "Appointment availability and processing speed vary significantly by country. UAE Embassies in high-volume countries (India, Philippines, Egypt, Pakistan) often have longer wait times. Book early.",
    enWarning:
      "The UAE Embassy will reject a document that has not first been authenticated by the home country's Ministry of Foreign Affairs. Do not skip step 2.",
  },
  {
    stepOrder: 4,
    cost:      "AED 150 per document (standard, 1–3 working days). Express processing is available for a higher fee. Approved typing centers charge an additional service fee of AED 50–150.",
    timeEst:   "1–3 working days (standard); same-day or next-day (express)",
    enTitle:   "Submit to UAE MOFA for Final Attestation",
    enWhat:
      "Submit the UAE-Embassy-stamped document to the UAE Ministry of Foreign Affairs for final attestation. This is the step that makes the document legally recognized for use in the UAE.",
    enWhere:   "UAE Ministry of Foreign Affairs (MOFA) — online portal or in-person center",
    enAddress: "Online: mofa.gov.ae (eServices portal). In person: MOFA attestation center or any approved typing center in Dubai.",
    enAdvice:
      "The online eServices portal is the fastest route for most applicants: upload document scans, pay AED 150 online, then physically drop the original document at a MOFA center or approved typing center. Typing centers and PRO services can handle the full submission process on your behalf for an additional service fee — useful if you cannot visit in person.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "No additional fee",
    timeEst:   "Included in step 4 processing time",
    enTitle:   "Collect the Attested Document",
    enWhat:
      "Collect the document from the MOFA center or typing center once processing is complete. Verify the MOFA stamp is present before submitting the document to the requesting UAE authority.",
    enWhere:   "The MOFA center or typing center used for submission",
    enAddress: "Same location as used in step 4",
    enAdvice:
      "If the UAE authority also requires an Arabic translation of the document, have it translated by a UAE-certified legal translator after receiving the MOFA-attested original. Return to MOFA to have the Arabic translation attested separately — same AED 150 fee per page of translation.",
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
console.log(`  Category: government`);
sqlite.close();
