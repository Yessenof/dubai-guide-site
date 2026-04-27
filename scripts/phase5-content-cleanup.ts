/**
 * Phase 5 — Guide content compression and cleanup.
 * Tightens summary, audience, overview, price, timeline, and step text
 * across all 15 published guides. Does NOT change slugs, fees, or process nuance.
 */
import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "data", "guides.db"));
db.pragma("journal_mode = WAL");

const now = new Date().toISOString();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function updateGuide(slug: string, fields: {
  price?: string;
  timeline?: string;
  en_summary?: string;
  en_audience?: string;
  en_overview?: string;
}) {
  const sets = Object.entries(fields).map(([k]) => `${k} = ?`).join(", ");
  const vals = Object.values(fields);
  const r = db.prepare(`UPDATE guides SET ${sets}, updated_at = ? WHERE slug = ?`)
    .run(...vals, now, slug);
  if (r.changes === 0) throw new Error(`Guide not found: ${slug}`);
  console.log(`✓ guide  ${slug}`);
}

function getStepId(slug: string, order: number): string {
  const guide = db.prepare(`SELECT id FROM guides WHERE slug = ?`).get(slug) as { id: string } | undefined;
  if (!guide) throw new Error(`Guide not found: ${slug}`);
  const step = db.prepare(`SELECT id FROM steps WHERE guide_id = ? AND step_order = ?`).get(guide.id, order) as { id: string } | undefined;
  if (!step) throw new Error(`Step ${order} not found in ${slug}`);
  return step.id;
}

function updateStep(slug: string, order: number, fields: {
  en_title?: string;
  en_what?: string;
  en_where?: string;
  en_address?: string;
  en_advice?: string;
  en_warning?: string;
}) {
  const stepId = getStepId(slug, order);
  const sets = Object.entries(fields).map(([k]) => `${k} = ?`).join(", ");
  const vals = Object.values(fields);
  db.prepare(`UPDATE steps SET ${sets} WHERE id = ?`).run(...vals, stepId);
  console.log(`✓ step   ${slug} #${order}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. amer-center-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("amer-center-dubai", {
  price: "Service fee + applicable UAE government fee per transaction. Total varies by service — see the guide for your specific procedure.",
  timeline: "1–5 working days. Walk-in: 30–90 min wait; appointment: 10–20 min.",
  en_summary: "How Amer service centers work in Dubai — how to book, what documents to bring, and what to expect at the counter for residency transactions.",
  en_audience: "Residents and visa applicants completing a personal residency or visa transaction at an Amer center in Dubai.",
  en_overview: `Amer is a network of service centers operated by the General Directorate of Residency and Foreigners Affairs (GDRFA) in Dubai. Amer centers handle personal residency and immigration transactions: new and renewed residence visas, Emirates ID, entry permits, status changes, and family file updates. Employer-side labor transactions (work permits, labor contracts, offer letter submissions) go through Tasheel, not Amer.

Transactions are processed by GDRFA or the Federal Authority for Identity and Citizenship (ICA). Amer charges a service fee per transaction in addition to the applicable UAE government fee. Most applications are processed within 1–5 working days. Appointments are available online; walk-ins are accepted at all branches.`,
});

// Step 1: remove verbose address sentence
updateStep("amer-center-dubai", 1, {
  en_address: "Any Amer branch in Dubai — select nearest when booking at amer.ae",
});

// Step 3: remove "confirm the total before paying" (obvious)
updateStep("amer-center-dubai", 3, {
  en_advice: "Most Amer branches accept card payment. Bring cash as a backup — some counters are cash-only.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. child-dependent-visa-dubai-inside-country
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("child-dependent-visa-dubai-inside-country", {
  en_summary: "Sponsor a child residence visa in Dubai when the child is already in the UAE. Entry permit, status change, Emirates ID, and residence issuance — no medical test required.",
  en_overview: `Sponsors whose child is already inside the UAE complete all submissions through Amer service centers. The inside-country route costs more than the outside-country route because the entry permit fee is higher and an extra change of status step is required. No medical test is required on the standard child route.

Total government fees are approximately AED 2,875, covering file opening, entry permit, change of status, Emirates ID, and residence issuance. Attestation costs abroad are additional and vary by country. Allow 3–6 weeks overall — document attestation is usually the longest step.`,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. child-dependent-visa-dubai-outside-country
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("child-dependent-visa-dubai-outside-country", {
  en_summary: "Sponsor a child residence visa in Dubai when the child is outside the UAE. Entry permit, Emirates ID, and residence issuance — no medical test required.",
  en_overview: `Sponsors whose child is still outside the UAE apply for an entry permit through Amer; the child enters Dubai on it, and Emirates ID and residence are completed after arrival. No medical test is required on the standard child route.

Total government fees in Dubai are approximately AED 1,586, covering file opening, entry permit, Emirates ID, and residence issuance. Attestation costs abroad are additional and vary by country. Allow 3–6 weeks overall — document attestation is usually the longest step.`,
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. document-attestation-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("document-attestation-dubai", {
  price: "AED 150 (UAE MOFA, standard processing). Home-country and UAE Embassy fees vary by nationality.",
  timeline: "2–6 weeks end-to-end. UAE MOFA step: 1–3 working days.",
  en_summary: "How to attest a foreign document (birth certificate, marriage certificate, or degree) for use in UAE visa or government procedures. Covers the home-country-to-MOFA chain with exact MOFA fees.",
});

// Step 2: remove "this is the step that makes it legally recognized" filler
updateStep("document-attestation-dubai", 2, {
  en_what: "Submit the fully authenticated document to the UAE Ministry of Foreign Affairs for final attestation.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. employment-visa (inside UAE)
// ─────────────────────────────────────────────────────────────────────────────

// Step 2: fix informal "It's" and tighten
updateStep("employment-visa", 2, {
  en_advice: "Labour category is based on job title and qualification, not salary. Confirm with your employer before submission.",
});

// Step 5: remove "Arrive early — clinics are busy" (obvious)
updateStep("employment-visa", 5, {
  en_advice: "Bring your passport, entry permit copy, and a passport-size photo.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. employment-visa-dubai-outside-uae
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("employment-visa-dubai-outside-uae", {
  en_summary: "For employees currently outside the UAE. Your employer initiates the process in Dubai; you enter on an entry permit once it is approved.",
  en_overview: `The outside-UAE employment visa route applies when you are currently abroad and your employer is on the Dubai mainland. You cannot start working until an entry permit is issued and you have physically entered the country.

Your employer handles the MOHRE and GDRFA applications. Your role begins when the entry permit is issued — you book travel, complete the medical test and Emirates ID on arrival, and the residence visa is then stamped. Total government fees typically range from AED 4,500 to AED 7,000 depending on your labour category. The full process takes 4–8 weeks from application to visa stamp.`,
});

// Standardize step titles to title case
updateStep("employment-visa-dubai-outside-uae", 1, {
  en_title: "Employer Submits MOHRE Work Permit",
});
updateStep("employment-visa-dubai-outside-uae", 2, {
  en_title: "Employer Applies for Entry Permit",
});
updateStep("employment-visa-dubai-outside-uae", 3, {
  en_title: "Travel to Dubai on the Entry Permit",
});
updateStep("employment-visa-dubai-outside-uae", 4, {
  en_title: "Complete the Medical Fitness Test",
  en_warning: "If the test reveals certain communicable diseases, the visa process cannot proceed.",
});
updateStep("employment-visa-dubai-outside-uae", 5, {
  en_title: "Register for Emirates ID",
  en_what: "Visit an ICA (Federal Authority for Identity and Citizenship) service center or Amer branch to register your biometrics (photo, fingerprints). The Emirates ID card is mailed within a few days.",
});
updateStep("employment-visa-dubai-outside-uae", 6, {
  en_title: "Residence Visa Stamped in Passport",
});
updateStep("employment-visa-dubai-outside-uae", 7, {
  en_title: "Labour Contract and Employment Card Issued",
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. free-zone-company-setup-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("free-zone-company-setup-dubai", {
  en_summary: "How to form a free zone company in the UAE. Covers zone selection, license type, visa quota, and document submission. Exact costs vary by zone and package.",
  en_audience: "Business owners forming a UAE free zone company for export, consultancy, digital, or remote work. Covers the general process for most zones. Not applicable to DIFC, ADGM, or zone-specific regulated financial activities.",
});

// Step 6 WARNING: tighten "submitted and processed" → "submitted"
updateStep("free-zone-company-setup-dubai", 6, {
  en_warning: "Most free zones do not refund fees once the application is submitted. Confirm the exact package, activity, and visa quota before paying.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. mainland-company-setup-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("mainland-company-setup-dubai", {
  en_summary: "How to form a DED-licensed mainland company in Dubai. Covers trade name reservation, initial approval, Ejari registration, and license issuance. Regulated sectors require additional approvals not covered here.",
  en_audience: "Business owners forming a DED-licensed mainland company in Dubai under a commercial, professional, or industrial license. Regulated sectors (health, education, financial services) require additional approvals not covered by this guide.",
});

// Step 1 WARNING: remove trailing "if you are unsure"
updateStep("mainland-company-setup-dubai", 1, {
  en_warning: "Selecting the wrong activity requires a license amendment after issuance — AED 5,000–10,000+. Confirm your activity code with a DED consultant or PRO before proceeding.",
});

// Step 4: tighten definition of initial approval
updateStep("mainland-company-setup-dubai", 4, {
  en_what: "Submit your trade name, business activity, legal structure, and shareholder passport copies to DED for initial approval. Initial approval is not a license — it confirms you can proceed to set up your office and prepare remaining documents.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. newborn-visa-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("newborn-visa-dubai", {
  en_summary: "How UAE resident parents in Dubai register a newborn and apply for the baby's UAE residence visa. Covers hospital birth registration, consulate passport, and Amer visa application.",
  en_audience: "UAE resident parents whose child was born in Dubai, applying for the newborn's birth registration and UAE residence visa. Not applicable for children born overseas.",
});

// Step 3: rewrite advice — remove the long question form
updateStep("newborn-visa-dubai", 3, {
  en_advice: "Most UAE visa applications require a full national passport, not a temporary travel document. Confirm with Amer if in doubt.",
});

// Step 5: remove "confirm with your branch" (standard procedure, not a real tip)
updateStep("newborn-visa-dubai", 5, {
  en_advice: "Emirates ID and residence visa applications are filed together at Amer in a single visit.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. open-business-bank-account-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("open-business-bank-account-dubai", {
  price: "No government fee. Minimum average monthly balance: AED 25,000–50,000 (varies by bank and account tier).",
  en_summary: "How to open a UAE business bank account after company formation. Covers document preparation, bank selection, compliance review, and activation. Timelines (2–6 weeks) and minimum balance requirements vary by bank.",
  en_audience: "Mainland and free zone company owners with a UAE trade license who need a business bank account. Not applicable to personal banking, freelance accounts, or regulated financial institutions.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. pro-services-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("pro-services-dubai", {
  price: "Set by provider — not government-regulated. Typically per-transaction or monthly retainer. Request written quotes before committing.",
  timeline: "PRO engagement: 1–3 working days to set up. Transaction timelines depend on the relevant government department.",
  en_summary: "What PRO services cover in Dubai, when to engage one, and how the engagement workflow operates.",
  en_audience: "Business owners and individuals in Dubai who need government documents, license filings, or visa applications handled through a professional PRO service.",
});

// Step 1: trim WHAT — too similar to overview, remove the duplicated list
updateStep("pro-services-dubai", 1, {
  en_what: "PRO services handle government submissions and administrative tasks requiring physical presence or registered authorization at government offices. Common tasks include trade license renewals, employee visa and work permit applications, MOHRE registrations, and document attestation submissions.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. renew-family-visa-dubai
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("renew-family-visa-dubai", {
  price: "AED 250–450 (medical test, adults 18+ only; children under 18 exempt). Visa and EID fees confirmed at Amer.",
  timeline: "Medical results: 1–3 working days. Amer processing: 2–5 working days. EID delivered by post within 5–10 working days.",
  en_summary: "How to renew a UAE family residence visa for a spouse or child already living in the UAE. Covers medical fitness eligibility (adults 18+ only), Amer submission, and Emirates ID renewal.",
  en_audience: "Sponsors in Dubai renewing a family residence visa for a spouse or child currently in the UAE on a valid or recently expired visa.",
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. spouse-dependent-visa-dubai-inside-country
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("spouse-dependent-visa-dubai-inside-country", {
  en_overview: `For sponsors whose spouse is already in the UAE — the residence process runs entirely in-country via Amer service centers. All submissions go through Amer: family file, entry permit, change of status, medical, Emirates ID, and residence stamping.

Total government fees are approximately AED 2,700–3,200 depending on typing center charges and processing options. The process takes 3–6 weeks. The main delay is marriage certificate attestation, which must be completed before starting.`,
});

// Step 3 advice: make imperative rather than conditional
updateStep("spouse-dependent-visa-dubai-inside-country", 3, {
  en_advice: "The spouse's current visa must be valid when this application is submitted.",
});

// Step 4 advice: remove non-advice "This step replaces..."
updateStep("spouse-dependent-visa-dubai-inside-country", 4, {
  en_advice: "",
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. spouse-dependent-visa-dubai-outside-country
// ─────────────────────────────────────────────────────────────────────────────

updateGuide("spouse-dependent-visa-dubai-outside-country", {
  en_overview: `When your spouse is outside the UAE, the process starts with marriage certificate attestation, then an entry permit application through Amer. Once your spouse enters Dubai, Emirates ID and residence are completed.

Total government fees are approximately AED 1,800–2,200. The main delay is document attestation, which can take 2–3 weeks. The sponsor must meet minimum salary requirements and provide a valid tenancy contract (Ejari).`,
});

// Step 7 warning: remove "Make sure all previous steps are completed correctly" (useless)
updateStep("spouse-dependent-visa-dubai-outside-country", 7, {
  en_warning: "",
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. golden-visa-dubai-property — already well-written, minor tweak only
// ─────────────────────────────────────────────────────────────────────────────
// No changes needed — guide is clean and tight.

// ─────────────────────────────────────────────────────────────────────────────

db.close();
console.log("\nPhase 5 content cleanup complete.");
