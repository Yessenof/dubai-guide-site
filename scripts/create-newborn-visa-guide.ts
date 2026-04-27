/**
 * Creates the newborn-visa-dubai guide as a DRAFT.
 * Run with: npx tsx scripts/create-newborn-visa-guide.ts
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

const SLUG = "newborn-visa-dubai";

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
    category:    "visas",
    published:   false,
    price:       "AED 900–1,500 (UAE government fees for residence visa and Emirates ID; varies by family file status). Consulate and birth registration fees are additional and vary by nationality.",
    timeline:    "4–10 weeks from birth (depends on consulate passport speed)",
    lastUpdated: "April 2026",
    createdAt:   now,
    updatedAt:   now,

    enTitle:
      "How to Get a UAE Residence Visa for a Newborn Born in Dubai",

    enSummary:
      "Step-by-step guide for UAE resident parents registering a baby born in Dubai and applying for the newborn's UAE residence visa. Covers birth registration, consulate registration, passport, and UAE visa application through Amer.",

    enAudience:
      "UAE resident parents whose child was born in Dubai, applying for the newborn's birth registration and UAE residence visa. This guide covers the standard route for babies born inside the UAE — not children brought from overseas.",

    enOverview:
      "A baby born in Dubai to UAE resident parents must be registered with the hospital authority within 30 days of birth. Once the UAE birth certificate is issued, the parents register the child at their home country's consulate and apply for the child's passport. UAE residence can only be applied for after the child has a valid passport.\n\nUAE residence and Emirates ID are applied for through Amer service centers. Total UAE government fees are approximately AED 900–1,500, depending on whether a family file already exists and the visa duration selected. The slowest part is the consulate passport. Processing times vary by nationality and consulate workload.",

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
    cost:      "AED 50–100 (birth certificate fee; often included in hospital discharge process)",
    timeEst:   "1–3 working days",
    enTitle:   "Register the Birth at the Hospital",
    enWhat:
      "Report the birth to the hospital's patient affairs department. They submit the registration to the Dubai Health Authority (DHA) on your behalf. The UAE birth certificate is issued within 1–3 working days.",
    enWhere:   "Hospital patient affairs office (submits to Dubai Health Authority)",
    enAddress: "At the hospital where the child was born",
    enAdvice:
      "Bring both parents' passports, Emirates IDs, and the marriage certificate to the hospital registration desk. If the father is not present, some hospitals require a signed authorization.",
    enWarning:
      "Birth registration must be completed within 30 days of the birth. Late registration incurs additional fees and may require a legal affidavit.",
  },
  {
    stepOrder: 2,
    cost:      "Varies by nationality (typically equivalent to USD 50–200)",
    timeEst:   "1–5 working days (registration visit); passport takes 2–8 weeks",
    enTitle:   "Register with Your Home Country's Consulate",
    enWhat:
      "Visit your home country's embassy or consulate in the UAE to register the child's birth for nationality purposes. This establishes the child's nationality and begins the passport application process.",
    enWhere:   "Your home country's embassy or consulate in the UAE",
    enAddress: "Check your embassy's official website for address and appointment requirements",
    enAdvice:
      "Bring the UAE birth certificate, both parents' passports, marriage certificate, and any nationality-specific documents the consulate requires. Some consulates accept walk-ins; most require an advance appointment.",
    enWarning:
      "Consulate appointment availability and passport processing times vary significantly by nationality and workload. Confirm the current timeline directly with your consulate before planning next steps.",
  },
  {
    stepOrder: 3,
    cost:      "Included in Step 2 consulate fees",
    timeEst:   "2–8 weeks from initial consulate registration (varies by nationality)",
    enTitle:   "Collect the Child's Passport",
    enWhat:
      "Collect the child's passport from your home country's embassy or consulate after processing is complete. Some countries issue an emergency travel document first; others issue the full passport in one step.",
    enWhere:   "Your home country's embassy or consulate in the UAE",
    enAddress: "Same location as Step 2",
    enAdvice:
      "Confirm with Amer or the ICA portal whether a temporary travel document is accepted for UAE visa applications, or whether a full national passport is required. Most UAE applications require a full passport.",
    enWarning:
      "Do not submit the UAE residence visa application until the child has a valid passport in hand. Applications without a passport cannot be processed.",
  },
  {
    stepOrder: 4,
    cost:      "AED 252 (family file, if not already open) + AED 510 (residence visa issuance) — approximately AED 762–1,014 depending on whether a family file exists",
    timeEst:   "2–5 working days",
    enTitle:   "Apply for UAE Residence Visa at Amer",
    enWhat:
      "Submit the newborn's UAE residence visa application through an Amer service center or the ICA portal. The sponsoring parent is the applicant. No medical test is required for newborns and young children on the standard family sponsorship route.",
    enWhere:   "Amer service center",
    enAddress: "Any Amer branch in Dubai",
    enAdvice:
      "Required documents typically include: child's passport, UAE birth certificate, sponsoring parent's passport and Emirates ID, and marriage certificate. Bring originals and copies. Emirates ID can be applied for simultaneously at the same Amer visit.",
    enWarning: "",
  },
  {
    stepOrder: 5,
    cost:      "AED 385 (Emirates ID fee)",
    timeEst:   "5–10 working days for card delivery after application",
    enTitle:   "Apply for Emirates ID",
    enWhat:
      "File the Emirates ID application for the newborn. For children under 15, no biometric appointment is required — the EID is processed and delivered by post.",
    enWhere:   "Amer service center (files with ICA on your behalf)",
    enAddress: "Any Amer branch in Dubai — no separate ICA visit required",
    enAdvice:
      "Emirates ID and residence visa applications are filed together at Amer in a single visit. Confirm with your branch that both can be submitted at the same time.",
    enWarning: "",
  },
  {
    stepOrder: 6,
    cost:      "No additional fee",
    timeEst:   "2–5 working days (visa stamp); 5–10 working days (Emirates ID delivered by post)",
    enTitle:   "Collect Residence Visa and Emirates ID",
    enWhat:
      "Once processing is complete, collect the visa stamp in the child's passport from Amer. The Emirates ID is delivered by post separately. Check the visa validity to confirm it matches the expected duration.",
    enWhere:   "Amer service center (visa stamp); post delivery (Emirates ID)",
    enAddress: "The same Amer branch used for the application",
    enAdvice:
      "The child's residence visa validity typically matches the sponsoring parent's visa expiry. If the parent's visa is due for renewal soon, consider renewing it first so the child's visa gets a full term.",
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
console.log(`  Category: visas`);
sqlite.close();
