# 6C-VISAS-RAG-AUDIT-01 — Implementation Plan

**Date:** 2026-06-29  
**Type:** Planning document — NO deploy in this phase  
**Companion:** `6c-visas-rag-audit-01-report.md`

---

## Scope

This plan covers the exact changes to make in the next implementation phase.  
Nothing is edited until owner approves a specific sub-phase.

---

## Sub-Phase 6C-VISAS-CONTENT-01 — Practical Additions (DB updates)

### Target guides (DB updates via admin API)

All updates are to `en_overview`, `ru_overview`, or step `en_advice`/`en_what` fields.  
No schema changes. No new columns. No new pages.

---

### 1. `employment-visa` — Document Checklist + ILOE Note + Common Mistakes

**What to add to `en_overview` (append below existing 2 paragraphs):**

```
### What to Prepare

The employee provides to the PRO before Tasheel Step 1:
- Passport (original + copy)
- Passport-size photo with white background
- Signed offer letter
- Copy of current UAE visa page (if you have an existing visa)

The employer/PRO provides:
- Company trade licence
- Establishment card
- PRO card
- Sponsor's original Emirates ID

### Common Mistakes

- Job title in offer letter does not match intended visa category — causes rejection at MOHRE
- Starting without a valid establishment card in place — the employer must have an active immigration file
- Booking travel or committing to a start date before the residence visa is stamped in the passport
```

**What to add to Step 1 advice (append):**
> Some employers process ILOE (Involuntary Loss of Employment) insurance at the Tasheel stage. Confirm with your PRO whether this applies to your employment contract.

**RU equivalents:** Must be equal in facts and intent. Natural editorial Russian — not literal translation.

**Risk level:** GREEN (documents) + AMBER (ILOE note — phrased as employer-dependent, not universal)

---

### 2. `golden-visa-dubai-property` — Document Checklist + Off-Plan Note + Parents Note

**What to add to `en_overview` (append after existing 2 paragraphs):**

```
### What to Prepare

For a ready freehold property:
- Passport (original + copy)
- Passport-size photo (white background)
- Title deed or e-certificate of title from DLD
- Emirates ID and residence permit copy (if UAE resident)
- Bank NOC if the property carries a mortgage

For off-plan property: confirm current DLD requirements before applying. As a general reference, off-plan eligibility typically requires the property to be registered with DLD at a value of AED 2M or above and a minimum percentage paid — check with DLD for the exact threshold and required documents.

For shared ownership with a spouse: MOFA-attested marriage certificate required. Confirm ownership percentage eligibility with DLD.

### Parents After Golden Visa

Once your own Golden Visa is issued, you can apply to sponsor eligible family members including parents. Step 7 covers the sponsorship process. Each parent requires a separate sponsorship file.

### Common Mistakes

- Submitting an off-plan file without first confirming DLD eligibility
- Ordering a valuation report before confirming DLD requires one (not always needed)
- Starting family sponsorship files before the main visa is stamped
```

**Step 2 advice (append):**
> For mortgaged properties, contact your bank early — the NOC process can take 5–10 working days.

**RU equivalents:** Equal in facts and intent.

**Risk level:** GREEN (ready property checklist) + AMBER (off-plan, shared ownership — phrased with "confirm with DLD") + GREEN (parents mention)

---

### 3. `spouse-dependent-visa-dubai-outside-country` — Checklist + MOFA Detail + Salary Note

**What to add to `en_overview` (append):**

```
### What to Prepare

Sponsor (in Dubai):
- Valid Emirates ID (original)
- Passport copy
- Residence visa copy
- Valid Ejari tenancy contract
- Proof of income (salary certificate or trade licence if self-employed)

Applicant (spouse):
- Passport (original)
- Passport-size photo (white background)
- MOFA-attested marriage certificate

### Marriage Certificate Attestation

The marriage certificate must be attested in sequence:
1. Notarize in the country of issue
2. Authenticate at the relevant foreign ministry
3. UAE Embassy stamp (in the country of issue)
4. UAE MOFA attestation (in the UAE)

This sequence varies by country. Allow 2–4 weeks before starting the Amer application.

### Salary and Eligibility

GDRFA eligibility for spousal sponsorship depends on the sponsor's income and accommodation. Exact thresholds are confirmed at submission — verify with GDRFA or a registered PRO before starting.

### Common Mistakes

- Starting the Amer process before MOFA attestation is fully complete
- Using a translated marriage certificate without the full attestation chain
```

**RU equivalents:** Equal facts. RU phrasing: natural editorial, not translated literally.

**Risk level:** GREEN (documents, MOFA sequence) + AMBER (salary note — no specific threshold published, phrased as "confirm with GDRFA")

---

### 4. `spouse-dependent-visa-dubai-inside-country` — Checklist

**What to add to `en_overview` (append):**

```
### What to Prepare

Same documents as the outside-country route. Both sponsor and spouse must be present for some Amer steps — confirm with the Amer center at booking.

The inside-country entry permit (Step 3) is more expensive than the outside route. This is normal — it allows the spouse to avoid travel.
```

**Risk level:** GREEN

---

### 5. `renew-family-visa-dubai` — Grace Period + Fee Guidance

**What to add to `en_overview` (append after existing 2 paragraphs):**

```
### Timing and Overstay

UAE residence visas can typically be renewed within 30 days after expiry without a fine — confirm the current grace period with GDRFA or your Amer center, as this can change. Overstaying beyond the grace period may result in a fine before renewal is accepted.

### Renewal Fees (Indicative)

Combined residence renewal and Emirates ID fees are confirmed at the Amer counter. As a reference point, the individual components (residence visa issuance + Emirates ID) are similar to the original issuance fees paid when the visa was first processed. Amer will quote the exact total before taking payment.
```

**Step 3 update (en_what append):**
> Ask the counter staff to confirm the total before payment — fees vary depending on visa duration (1, 2, or 3 years) and whether the Emirates ID requires update.

**Risk level:** AMBER (grace period — phrased as "typically, confirm with GDRFA") + GREEN (renewal fee framing — no specific numbers added, just process description)

---

### Hub page intro paragraphs

#### `/visas` and `/ru/visas`

**What to add below H1 (currently: "Official fees and exact steps for every major Dubai residency route."):**

Proposed addition (2–3 sentences):

> Dubai residence visas fall into three main categories: employment visas (employer-sponsored, mainland or free zone), family visas (sponsored by an existing UAE resident), and long-term investor visas (Golden Visa — 10 years, no employer required). Each category has a distinct process, different government bodies, and separate fee structures.

**RU:** Equal in intent. Natural editorial Russian.

**Risk:** GREEN — factual and general.

---

#### `/visas/family` and `/ru/visas/family`

**What to add below H1:**

> To sponsor a spouse or child in Dubai, the sponsor must hold a valid UAE residence visa and a signed Ejari tenancy contract. Income requirements are assessed by GDRFA at submission. Marriage and birth certificates must be attested by UAE MOFA before applying through Amer.
>
> *Eligibility thresholds vary. Verify with GDRFA or a registered PRO before starting.*

**Also:** Add card links to `newborn-visa-dubai` and `renew-family-visa-dubai` in the guides array in the hub TSX file.

**Risk:** GREEN (facts) + AMBER for income threshold caveat

---

#### `/visas/golden` and `/ru/visas/golden`

**What to add below H1:**

> The Dubai Golden Visa grants 10-year UAE residency without employer sponsorship. The property route is open to freehold property owners with a registered DLD value of AED 2 million or above. Professional salary and investor routes have separate eligibility criteria set by ICA.

**Also:** Improve meta description to include "AED 2 million threshold" and "10-year no-employer residency."

**Risk:** GREEN

---

## Sub-Phase 6C-VISAS-CONTENT-02 — New Pages

### Parents Visa Stub (Priority 1)

**Route:** `/visas/parents` (hub) + `/guides/parents-visa-dubai` (guide stub)

**What to include in guide (AMBER phrasing throughout):**

**Overview:**
> A parent of a UAE resident can be sponsored for a family residence visa. The sponsor must hold a valid UAE residence visa and provide proof of adequate income and accommodation. Eligibility criteria and required income levels are assessed by GDRFA at the time of application — confirm thresholds with a registered PRO before starting.

**Documents (GREEN — standard, safe to publish):**

Sponsor:
- Original Emirates ID
- Passport + residence visa copy
- Proof of income (salary certificate, trade licence, or labour contract)
- Ejari tenancy contract (in the sponsor's name)

Applicant (parent):
- Passport (original + copy)
- Passport-size photo (white background)
- Birth certificate or equivalent proof of relationship — attested by UAE MOFA

**Additional for parent:**
- 3 months bank statements (practical requirement — confirm with your PRO)

**What NOT to add:**
- AED 10,500 salary threshold — AMBER, not officially sourced
- AED 5,000 deposit — AMBER, not a universal requirement
- Ejari 2-bedroom rule — AMBER, practical only

**Risk:** AMBER overall. All specific thresholds replaced with "confirm with GDRFA."

---

### Investor/Partner Visa Page

**Route:** Keep as WhatsApp CTA for now. Not enough sourced content to create a standalone guide.

**What to add to `/visas/golden` hub:** Brief bullet describing investor route eligibility ("Company owners or partners with a qualifying investment in a licensed UAE business. Exact investment thresholds confirmed by ICA — describe your situation below.")

---

## Sub-Phase 6C-VISAS-SCHEMA-01 — HowTo JSON-LD

### Target guides for HowTo schema (first batch)

- `employment-visa` (inside UAE, 8 steps)
- `golden-visa-dubai-property` (7 steps)
- `spouse-dependent-visa-dubai-outside-country` (7 steps)

**HowTo schema format per guide:**

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get an Employment Visa in Dubai Without Leaving the UAE",
  "description": "Full inside-country employment visa process through Tasheel and Amer.",
  "totalTime": "P14D",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "AED",
    "value": "4900"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Submit Offer Letter, Labor Card, and Work Permit",
      "text": "Your employer's PRO submits your signed offer letter and work permit application at Tasheel...",
      "url": "https://guidex-consulting.ae/guides/employment-visa#step-1"
    }
  ]
}
```

**Note:** Step URL anchors (`#step-1`) require adding `id="step-{N}"` to each StepCard — a small template change, no DB migration.

**Implementation:** Add HowTo JSON-LD to each guide page template that has step content. Can be generated from DB step data.

---

## Sub-Phase 6C-VISAS-CONTENT-03 — Outside UAE Employment Guide Enrichment

The `employment-visa-dubai-outside-uae` guide has weaker step content than the inside guide. Target improvements:

1. Steps 4–6 (medical, EID, residence): Add Amer service center as the "where" for each post-arrival step
2. Refine fee ranges — where a single fee is confirmed, replace range with specific value
3. Add document checklist to overview (same structure as employment-visa inside)
4. Add Step 1 and Step 2 with more MOHRE/GDRFA detail (currently very thin)

---

## EN/RU Parity Checklist

For every content addition in Phase 6C-VISAS-CONTENT-01:

- [ ] EN addition written first
- [ ] RU version reviewed for natural editorial Russian (not literal translation)
- [ ] RU must be equal in facts and intent
- [ ] No EN-language terms left in RU without explanation where needed (e.g., Amer, Tasheel, GDRFA — these are proper nouns, acceptable in RU)
- [ ] RU visa terminology: use established terms (резидентская виза, Emirates ID, entry permit — keep EN proper nouns)
- [ ] Salary notes: RU must not state a specific AED figure if EN avoids it

---

## QA Checklist (before each sub-phase deploy)

- [ ] npm run build — 88+ pages, 0 TypeScript errors
- [ ] `/guides/employment-visa` live page renders new checklist section
- [ ] `/guides/golden-visa-dubai-property` live page renders new checklist
- [ ] `/visas/family` hub shows newborn + renewal cards
- [ ] `/visas/golden` hub meta description includes "AED 2 million"
- [ ] `/ru/` equivalents render equal content in Russian
- [ ] No `  --` double-space artifacts in new text
- [ ] No em dashes (—) in any new DB strings (admin API guard)
- [ ] All NEW sentences avoid hard salary/fee claims (AMBER items use caveat wording)
- [ ] Source note remains where present (do not remove existing SourceNote components)
- [ ] No fake percentages, attendance numbers, company names, performer names added
- [ ] Google Rich Results Test run on employment-visa after HowTo schema added

---

## Build Checklist

- [ ] Run `npm run build` locally before committing any guide content
- [ ] Check page count matches or exceeds current (88)
- [ ] Confirm no TypeScript errors
- [ ] Confirm no compilation errors
- [ ] Deploy only via `bash scripts/deploy-zero-downtime.sh`
- [ ] Do not manually restart PM2

---

## Explicit Confirmation

**No deploy in this planning phase.**  
This document is audit output only. No code, DB, or content changes have been made.

All implementation in sub-phases requires separate owner approval before DB writes and before any deploy.

---

## Prioritized Execution Order

| Phase | Task | Effort | Risk | Value |
|---|---|---|---|---|
| 6C-VISAS-CONTENT-01 / Step 1 | Add document checklist to `employment-visa` | 1h | GREEN | Very high |
| 6C-VISAS-CONTENT-01 / Step 2 | Add document checklist to `golden-visa-dubai-property` | 1h | GREEN | Very high |
| 6C-VISAS-CONTENT-01 / Step 3 | Add checklist + MOFA detail to spouse guides | 1h | GREEN | High |
| 6C-VISAS-CONTENT-01 / Step 4 | Hub intros (3 hubs, 2 sentences each) | 0.5h | GREEN | High |
| 6C-VISAS-CONTENT-01 / Step 5 | Add newborn + renewal cards to family hub | 0.5h | GREEN | Medium |
| 6C-VISAS-CONTENT-01 / Step 6 | Grace period + fee framing to renewal guide | 0.5h | AMBER | Medium |
| 6C-VISAS-CONTENT-02 | Parents visa stub page | 2h | AMBER | High |
| 6C-VISAS-SCHEMA-01 | HowTo JSON-LD on top 3 guides | 3h | GREEN | High |
| 6C-VISAS-CONTENT-03 | Enrich outside-UAE employment guide | 2h | GREEN | Medium |
