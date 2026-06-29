# 6C-VISAS-RAG-AUDIT-01 — Visa Content SEO/RAG/AEO Audit Report

**Date:** 2026-06-29  
**Phase:** 6C-VISAS-RAG-AUDIT-01  
**Type:** Research / Audit / Content Planning — NO code changes, NO DB writes, NO deploy  
**Status:** COMPLETE

---

## Executive Summary

The Guidex visa content ecosystem is **structurally sound but underweight on AI-extractable detail**. The guide-per-procedure model is correct and the step-level fee data is a real differentiator. However, AI systems and search engines hitting these pages today receive:

- No document checklist (what the applicant physically brings)
- No explicit inside/outside UAE distinction beyond the title
- No HowTo schema (steps are in the DOM but not in JSON-LD)
- No source notes on guide pages
- No common-mistakes section
- No parents visa page at all
- No investor visa detail page
- No emiratisation or company immigration hub

Six high-value pages could each be improved in 2–4 hours with the right additions and zero factual risk.

**Highest-value action in next phase:** Add document checklists, confirm key fee notes with source wording, add HowTo schema to the 3 employment/golden visa guides, and create a parents visa stub.

---

## 1. Found Routes and Files

### Hub pages (pure navigation — no extractable content)

| Route EN | Route RU | File |
|---|---|---|
| `/visas` | `/ru/visas` | `app/(en)/(public)/visas/page.tsx` / `app/ru/visas/page.tsx` |
| `/visas/golden` | `/ru/visas/golden` | `app/(en)/(public)/visas/golden/page.tsx` / `app/ru/visas/golden/page.tsx` |
| `/visas/family` | `/ru/visas/family` | `app/(en)/(public)/visas/family/page.tsx` / `app/ru/visas/family/page.tsx` |
| `/find-my-visa` | `/ru/find-my-visa` | `app/(en)/(public)/find-my-visa/page.tsx` (tool) |

### Group pages (tab wrapper — content comes from DB)

| Route EN | Route RU | Group key |
|---|---|---|
| `/guides/spouse-dependent-visa-dubai` | `/ru/guides/spouse-dependent-visa-dubai` | `spouse-dependent-visa-dubai` |
| `/guides/child-dependent-visa-dubai` | `/ru/guides/child-dependent-visa-dubai` | `child-dependent-visa-dubai` |

### DB guides — visa category (9 live guides)

| Slug | EN Title | Steps | Has RU |
|---|---|---|---|
| `employment-visa` | How to Get an Employment Visa in Dubai Without Leaving the UAE | 8 | Yes |
| `employment-visa-dubai-outside-uae` | How to Get an Employment Visa in Dubai from Outside the UAE | 7 | Yes |
| `golden-visa-dubai-property` | How to Get a Dubai Golden Visa Through Property (AED 2 Million Route) | 7 | Yes |
| `spouse-dependent-visa-dubai-inside-country` | How to Sponsor a Spouse Residence Visa in Dubai Without Leaving the UAE | 7 | Yes |
| `spouse-dependent-visa-dubai-outside-country` | How to Sponsor a Spouse Residence Visa in Dubai from Outside the UAE | 7 | Yes |
| `child-dependent-visa-dubai-inside-country` | How to Sponsor a Child Dependent Visa in Dubai from Inside the UAE | 6 | Yes |
| `child-dependent-visa-dubai-outside-country` | How to Sponsor a Child Dependent Visa in Dubai from Outside the UAE | 6 | Yes |
| `newborn-visa-dubai` | How to Get a UAE Residence Visa for a Newborn Born in Dubai | 6 | Yes |
| `renew-family-visa-dubai` | How to Renew a Family Residence Visa in Dubai | 4 | Yes |

### Related lib/config files

| File | Purpose |
|---|---|
| `lib/guide-groups.ts` | Group page config — titles, summaries, variant slugs, RU labels |
| `lib/route-finder-config.ts` | Find My Visa flow logic |
| `lib/db/reader.ts` | Public DB reads |
| `docs/content-drafts/seo/FULL_SEO_RAG_AUDIT_6C99A.md` | Prior audit — schema/sitemap gaps already documented |
| `docs/content-drafts/seo/GUIDE_RAG_AEO_GAP_LIST_6C99C.md` | Prior RAG gap list — HowTo schema, step anchors, source notes |

### Missing pages (no page exists)

| Topic | Current state | Gap severity |
|---|---|---|
| Parents visa | Not a page. Only mentioned in Golden Visa Step 7 as "parents can be sponsored" | HIGH |
| Investor / Partner visa | WhatsApp CTA only on `/visas/golden` hub | HIGH |
| Emirates ID renewal (standalone) | Referenced in guide steps but no dedicated page | MEDIUM |
| Visa cancellation | No page | MEDIUM |
| Off-plan / under-construction Golden Visa | Not covered — only ready property | MEDIUM |
| Medical fitness (standalone) | No page | LOW |
| Sponsorship transfer | No page | LOW |
| Company immigration / establishment card | No page | MEDIUM |

---

## 2. Page-by-Page Audit

---

### 2.1 — `/visas` — Visa Hub

**H1:** Dubai Visa Guides  
**Meta title:** Dubai Visa Guides — Guidex Consulting  
**Meta description:** Step-by-step Dubai visa guides with official government fees and timelines. Family visas, Golden Visa, employment visas, and more.

**What it does:**  
Navigation card grid linking to 4 routes: family visas, golden visa, employment visa (inside), employment visa (outside). Plus "Find My Route" button and footer WhatsApp CTA.

**What's good:**
- Clean, scannable card layout
- Covers 4 routes
- BreadcrumbList JSON-LD present
- Meta description is strong and practical
- RU version has equal content, correct hreflang

**SEO/RAG gaps:**
- Page has ZERO extractable text content for AI — it is pure navigation
- No H2 headings with any factual content
- No answer to "what visas can I get in Dubai?" anywhere on this page
- No schema beyond BreadcrumbList (no FAQPage, no ItemList)
- Hub lists only 4 routes — missing parents visa, investor visa, Emirates ID, cancellation
- No source note / last-checked date visible

**RU parity:** Equal — same 4 routes, same phrasing logic. Hreflang correct.

**Recommended fixes:**
- Add 2–3 short intro sentences below H1 that an AI could extract: "Dubai residence visas fall into three main categories: employment visas (employer-sponsored), family visas (spouse/child/parents), and long-term investor visas (Golden Visa). Each has a distinct process..."
- Add ItemList JSON-LD listing the 4 routes
- Add parents visa card pointing to new page when created

---

### 2.2 — `/visas/golden` — Golden Visa Hub

**H1:** Dubai Golden Visa  
**Meta title:** Dubai Golden Visa — Guidex Consulting  
**Meta description:** Long-term residency in Dubai for property owners and eligible applicants. Step-by-step guides with official fees and timelines.  
**SourceNote:** ICA · GDRFA · DLD, "Checked May 2026"

**What's good:**
- 4 routes clearly separated: property (live), professional, investor, special talent
- "Ask about these routes" WhatsApp section for non-property routes
- BreadcrumbList JSON-LD
- Source note present (correct status: "confirmed")
- RU parity: equal content, natural RU phrasing

**SEO/RAG gaps:**
- Page has no substantive extractable text — AI cannot answer "how do I get a Dubai golden visa?" from this page
- Meta description says "long-term residency for property owners and eligible applicants" — too vague; no AED 2M threshold mentioned
- No H2 with any factual content
- 3 of 4 routes are WhatsApp-only — creates thin impression
- Hub page does not mention any eligibility thresholds even briefly
- No FAQPage or HowToStep schema
- Property route is the only indexed content — but off-plan and mortgage variants are not covered anywhere

**RU parity:** Equal. Correct hreflang.

**Recommended fixes:**
- Add 3–4 sentence intro: "A Dubai Golden Visa gives 10-year UAE residency without employer sponsorship. The property route requires freehold ownership of AED 2 million or more registered with DLD. Professional salary and investor routes have separate thresholds set by ICA."
- Improve meta description to include "AED 2 million threshold"
- Add brief eligibility table or bullet list per route

---

### 2.3 — `/visas/family` — Family Visa Hub

**H1:** Family Residence Visas in Dubai  
**Meta title:** Family Residence Visas in Dubai — Guidex Consulting  
**Meta description:** Sponsor a spouse or child on a Dubai residence visa. Step-by-step guides for inside-UAE and outside-UAE routes, with exact government fees and timelines.  
**SourceNote:** ICA · GDRFA Dubai, "Checked May 2026"

**What's good:**
- Clear inside/outside UAE distinction on card labels
- Source note present
- Correctly links to GDRFA/Amer as the relevant body
- RU parity: equal content, natural RU

**SEO/RAG gaps:**
- Only 2 routes: spouse and child. No parents card, no newborn card, no renewal card
- No extractable text — pure navigation
- No eligibility summary ("who can sponsor?" — salary requirement, Ejari)
- No common document list for all family visas
- Marriage certificate attestation not mentioned on hub (it's a significant pre-step)
- Newborn visa and renewal guides exist in DB but are not linked from this hub

**RU parity:** Equal. Correct hreflang.

**Recommended fixes:**
- Add newborn visa and renewal cards to this hub
- Add 2–3 intro sentences: "To sponsor a family member in Dubai, the sponsor must hold a valid UAE residence visa with a minimum salary (typically AED 3,000 for spouse, AED 4,000–5,000 for children) and a signed Ejari tenancy contract. Marriage and birth certificates must be attested via UAE MOFA before applying."
- Add parents visa card when created

---

### 2.4 — `/guides/employment-visa` — Employment Visa (Inside UAE)

**H1 (from guide-groups):** How to Get an Employment Visa in Dubai Without Leaving the UAE  
**Meta title:** same  
**Meta summary:** How to get a UAE employment residence visa without leaving the country...  
**RU title:** Рабочая виза в Дубае: оформление через компанию без выезда из ОАЭ  

**Step flow (8 steps):**
1. Submit Offer Letter / Work Permit (Tasheel, AED 278)
2. Pay Labor Card Insurance + MOHRE Fee (AED 189 + AED 1,285/3,555)
3. Apply for Inside-Country Entry Permit (Amer, AED 1,126)
4. Change Visa Status (Amer, AED 676)
5. Medical Fitness Test (Amer-coordinated, AED 323)
6. Register for Emirates ID (Amer, AED 386)
7. Final Labor Card Submission (Tasheel/Tawjeeh, AED 78/152)
8. Residence Visa Issuance (Amer, AED 546)

**Total from steps:** Category 1/2: AED 278+189+1,285+1,126+676+323+386+78+546 = AED 4,887 approx. Category 3: AED ~7,157

**What's good:**
- Excellent step detail — most complete guide in the visa cluster
- Clear Tasheel/Amer/Tawjeeh routing per step
- Category 1/2 vs Category 3 distinction throughout
- Cost and time per step
- Advice and warnings on most steps
- RU parity complete — all 8 steps translated with natural Russian
- Overview is scannable and covers the flow well

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| No document checklist ("what to bring") | HIGH — most-asked follow-up question |
| No mention of what employee needs to physically hand to PRO | HIGH |
| No ILOE insurance / labor insurance mention | MEDIUM — practical Tasheel reality |
| No MB number (Tasheel identifier) mention | AMBER — practical only |
| No employer-side documents mentioned (trade licence, establishment card) | MEDIUM |
| No passport cover / white background photo specification | MEDIUM |
| No HowTo schema | HIGH — step-structured content gets no rich result |
| No visible source note on guide page | MEDIUM |
| Step 1 advice mentions "passport copy, photo" but no explicit checklist | MEDIUM |
| Absconding/violation committee not mentioned | AMBER — case-dependent |
| What happens if existing visa expired at Step 4 — warning exists but brief | MEDIUM |
| No common mistakes section | MEDIUM |
| "Inside UAE" distinction is in title but hub page does not explain why | MEDIUM |
| MOHRE = Ministry of Human Resources and Emiratisation — acronym not expanded on page | LOW |

**Photo notes applicable here (GREEN/AMBER):**
- Entry permit types (inside/outside UAE): GREEN — already covered in overview
- Change status step: GREEN — Step 4 covers this
- Emirates ID step: GREEN — Step 6 covers this
- Medical fitness step: GREEN — Step 5 covers this
- Tawjeeh for Cat 3: GREEN — Step 7 covers this
- Final labour contract: GREEN — Step 7 covers this
- ILOE insurance/fine: AMBER — practical note, not an official universal rule

**RU parity:** Full parity. 8 RU steps with natural editorial Russian. No EN fallback detected.

---

### 2.5 — `/guides/employment-visa-dubai-outside-uae` — Employment Visa (Outside UAE)

**H1:** How to Get an Employment Visa in Dubai from Outside the UAE  
**RU title:** Как получить рабочую визу в Дубае из-за рубежа

**Step flow (7 steps):**
1. Employer Submits MOHRE Work Permit (AED 200–600)
2. Employer Applies for Entry Permit (AED 1,200–2,000)
3. Travel to Dubai on Entry Permit (flight costs)
4. Complete Medical Fitness Test (AED 300–500)
5. Register for Emirates ID (AED 370)
6. Residence Visa Stamped (AED 1,500–2,500)
7. Labour Contract and Employment Card (included)

**What's good:**
- Clear structure: employer does Steps 1–2, you do Steps 3–7
- Correctly describes "you cannot start working until you enter"
- Total range AED 4,500–7,000 stated

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| Step costs are all ranges — less credible than inside UAE guide | MEDIUM |
| Step content missing en_advice, en_warning, en_what detail | HIGH — steps look hollow compared to inside UAE guide |
| No document checklist for what applicant brings on arrival | HIGH |
| No medical fitness location detail | MEDIUM |
| Step 6 "AED 1,500–2,500" is a very wide range without explanation | MEDIUM |
| No mention of Amer service center | HIGH — the outside-UAE post-arrival steps also go through Amer |
| Overview says "cannot start working until entry permit issued" — correct — but does not explain grace period | LOW |
| MOHRE/GDRFA/ICA not consistently named in steps | MEDIUM |
| HowTo schema absent | HIGH |
| RU content: summary and title present, but RU step content has not been verified at step level in this session — needs spot-check | MEDIUM |

**RU parity:** Title and summary confirmed. RU step content was not retrieved in this audit — requires spot-check in next phase.

---

### 2.6 — `/guides/golden-visa-dubai-property` — Golden Visa Property

**H1:** How to Get a Dubai Golden Visa Through Property (AED 2 Million Route)  
**RU title:** Золотая виза в Дубае через недвижимость от AED 2 000 000

**Step flow (7 steps):**
1. Confirm Property Qualifies (DLD, free)
2. Prepare Documents (free)
3. Obtain Valuation or Bank Confirmation (varies)
4. Submit Golden Visa Application (DLD, AED 8,031.75)
5. Medical Test (AED 700)
6. Emirates ID for 10 Years (ICP, AED 1,153)
7. Add Family Members (AED 5,774.50 + AED 318.75 per file)

**Total government fees (main applicant):** AED 9,884.75 (explicitly stated in overview)

**What's good:**
- Specific fee at Step 4: DLD (4,020) + permit (2,856.75) + admin (1,155) = 8,031.75
- 10-year Emirates ID correctly differentiated from 2-year
- DLD official 7–10 business day timeline stated
- RU parity: complete, natural Russian

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| Only covers ready/freehold property — off-plan and mortgage routes absent | HIGH |
| No document checklist | HIGH |
| Step 2 mentions documents but as prose not checklist | HIGH |
| No mention of property valuation process (who does it, how to arrange) | MEDIUM |
| No shared ownership / spouse co-ownership note | MEDIUM |
| Family member Step 7 costs are complex — "AED 5,774.50 + AED 318.75 per file + AED 100 per person" — confusing | MEDIUM |
| No mention of parents being sponsorable (user often searches "golden visa parents dubai") | HIGH |
| Photo notes re: fees (15,000 package, 17,000 over 65) — AMBER, do not add without source | AMBER |
| Golden Visa hub mentions "off-plan" in the context of <=2M property but no guide page covers this | HIGH |
| No common mistakes section | MEDIUM |
| No HowTo schema | HIGH |
| Step 3 (valuation) has no cost guidance | LOW |
| Property must be "freehold" — what is freehold vs leasehold not explained | MEDIUM |

**Photo notes applicable (AMBER — do not publish without source confirmation):**
- Total package cost ~15,000 / ~17,000 (>65): treat as indicative service-centre package, not government fee
- Paid 30% on off-plan: AMBER — no official source confirmed in this project
- NOC from bank for mortgage: AMBER — confirmed as practical requirement, not sourced here
- Shared ownership / marriage certificate MOFA attestation: AMBER

---

### 2.7 — `/guides/spouse-dependent-visa-dubai-outside-country` — Spouse Outside UAE

**Step flow (7 steps):** Attest → Family File → Entry Permit → Spouse Enters → Medical → Emirates ID → Finalize Residence

**What's good:**
- Clear outside-UAE narrative: sponsor does Steps 1–3 from Dubai; spouse does Steps 4–7 in Dubai
- Mention of salary requirement and Ejari in overview
- RU parity confirmed

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| Step costs are ranges: AED 300–400, 370–400, 500–600 — less precise than inside guide | MEDIUM |
| No document checklist | HIGH |
| "Minimum salary requirement" mentioned in overview but no figure given | HIGH |
| Ejari mentioned in overview but not in document checklist or step | MEDIUM |
| MOFA attestation Step 1: no mention of home country notarization sequence | MEDIUM |
| No mention of relationship proof for marriage certificate | LOW |
| No common mistakes section | MEDIUM |
| No HowTo schema | HIGH |

**Photo notes applicable:**
- Salary 10,500: RED — do not publish. High risk, not universally confirmed.
- Deposit 5,000: RED — do not publish. Not universally required.
- Ejari 2-bedroom: AMBER — practical note only, not a universal rule
- Sponsor passport + visa + Emirates ID + trade licence: GREEN — standard documents already referenced

---

### 2.8 — `/guides/spouse-dependent-visa-dubai-inside-country` — Spouse Inside UAE

**Step flow (7 steps):** Attest → Family File → Entry Permit (inside, AED 1,100) → Change Status (AED 640) → Medical (AED 320) → Emirates ID (AED 385) → Finalize (AED 510)

**What's good:**
- Inside-country route clearly differentiated — higher entry permit cost explained
- Change of status step correctly present
- RU parity confirmed

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| No document checklist | HIGH |
| "Total AED 2,700–3,200" range is wide — what drives the variance? Not explained | MEDIUM |
| Marriage certificate attestation is Step 1 but practical MOFA process not detailed | MEDIUM |
| No HowTo schema | HIGH |
| Amer = GDRFA typing center — users searching for "Amer" may not find this page | LOW |
| No common mistakes | MEDIUM |

---

### 2.9 — `/guides/child-dependent-visa-dubai-outside-country` — Child Outside UAE

**Step flow (6 steps):** Attest Birth Cert → Family File → Entry Permit (AED 439) → Child Enters → Emirates ID (AED 385) → Finalize (AED 510)  
**Total in Dubai: AED 1,586. No medical test.**

**What's good:**
- "No medical test" correctly stated
- Fee total precise
- Outside-UAE route clearly described

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| No document checklist | HIGH |
| Age limit for child not stated (under 18? 15 for boys in some cases?) | MEDIUM |
| Birth certificate attestation — country-specific sequence not explained | MEDIUM |
| Son over 15 eligibility nuance not addressed | MEDIUM |
| No HowTo schema | HIGH |

---

### 2.10 — `/guides/child-dependent-visa-dubai-inside-country` — Child Inside UAE

**Step flow (6 steps):** Attest → Family File → Entry Permit (AED 1,089) → Change Status (AED 639) → Emirates ID (AED 385) → Finalize (AED 510)  
**Total: AED 2,875. No medical test.**

**What's good:**
- Inside-country premium explained (higher entry permit)
- No medical test correctly stated

**SEO/RAG gaps:** Same as outside-country variant — document checklist, age limits, HowTo schema.

---

### 2.11 — `/guides/newborn-visa-dubai` — Newborn Visa

**Step flow (6 steps):** Register Birth (DHA) → Consulate Registration → Collect Passport → Apply UAE Visa (Amer) → Emirates ID → Collect

**What's good:**
- Hospital-first process clearly described
- Explains consulate passport is the bottleneck
- Note that biometrics not needed for under-15
- Government fees AED 900–1,500 clearly stated

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| Step 2–3 cost marked "Varies by nationality" — no examples | LOW |
| No mention of DHA Grace Period (30 days) consequence if missed | MEDIUM |
| No mention of what happens if parents have different nationalities | MEDIUM |
| Not linked from `/visas/family` hub | MEDIUM |
| HowTo schema absent | MEDIUM |
| No common mistakes | LOW |

**RU parity:** RU title/summary confirmed, full steps not retrieved in this session.

---

### 2.12 — `/guides/renew-family-visa-dubai` — Renewal

**Step flow (4 steps):** Check timing → Medical (adults 18+, AED 250–450) → Submit at Amer → Collect

**What's good:**
- Correctly distinguishes under-18 (no medical) from 18+ (medical required)
- Short and focused — renewal is simpler than new application

**SEO/RAG gaps:**

| Gap | Severity |
|---|---|
| Step 3 fee: "Amer confirms the combined total at submission" — no guidance | HIGH |
| No grace period after expiry mentioned (how many days can you overstay?) | HIGH |
| No mention of whether overstay fine applies | MEDIUM |
| No document checklist for renewal | MEDIUM |
| Not linked from `/visas/family` hub | MEDIUM |
| HowTo schema absent | LOW |
| "Under 18 exempt from medical" — true for family visas; but what about sons 15–18 who may be on individual visa? | MEDIUM |

---

## 3. EN/RU Parity Summary

| Guide | EN complete | RU complete | Parity | Notes |
|---|---|---|---|---|
| employment-visa | Yes (8 steps) | Yes (8 steps) | Full | Natural RU, no EN fallback detected |
| employment-visa-outside-uae | Yes (7 steps) | Step content not verified in full | Partial | RU title/summary confirmed; full step check needed |
| golden-visa-dubai-property | Yes (7 steps) | Yes (7 steps) | Full | Natural RU, all fields present |
| spouse-outside | Yes (7 steps) | Yes (7 steps) | Full | RU confirmed equal |
| spouse-inside | Yes (7 steps) | Yes (7 steps) | Full | RU confirmed equal |
| child-outside | Yes (6 steps) | Yes (6 steps) | Full | |
| child-inside | Yes (6 steps) | Yes (6 steps) | Full | |
| newborn-visa | Yes (6 steps) | Summary confirmed | Partial | Full RU steps not retrieved; check needed |
| renew-family-visa | Yes (4 steps) | Summary confirmed | Partial | Full RU steps not retrieved; check needed |
| Hub: /visas | Yes | Yes | Full | Equal navigation content |
| Hub: /visas/golden | Yes | Yes | Full | |
| Hub: /visas/family | Yes | Yes | Full | |

**Parity risk: LOW for guides 1–7. Spot-check guides 8–9 in next phase.**

---

## 4. SEO/RAG/AEO Issues by Priority

### Critical (do next)

| # | Issue | Page | Fix |
|---|---|---|---|
| C1 | No document checklist anywhere | All guides | Add checklist section per guide |
| C2 | No HowTo JSON-LD on any guide | All guides | Add via GuideTabs template or per-page |
| C3 | Hub pages have zero AI-extractable text | /visas, /visas/golden, /visas/family | Add 2–4 sentence intro paragraph per hub |
| C4 | No parents visa page | Nowhere | Create stub with AMBER phrasing |
| C5 | Inside/outside UAE distinction not explained on family hub | /visas/family | Add 2-sentence explanation |

### High (improve before scaling)

| # | Issue | Page | Fix |
|---|---|---|---|
| H1 | Outside UAE employment guide has hollow steps (no advice/warning) | employment-visa-outside-uae | Enrich step detail to match inside guide |
| H2 | Salary requirement for family sponsorship not stated anywhere | spouse guides, family hub | Add with AMBER source note ("typically AED 3,000+, verify with GDRFA") |
| H3 | Golden visa off-plan / mortgage route not covered | golden-visa-dubai-property, hub | Either add section to guide or add note "see advisor" |
| H4 | Renewal fee blank ("Amer confirms at counter") | renew-family-visa | Add at minimum range or note |
| H5 | No source note visible on guide pages | All guides | Either render source block from DB or add static source note per guide |
| H6 | newborn-visa, renew-family-visa not linked from family hub | /visas/family | Add cards |
| H7 | No mention of parents visa route on golden hub or main family hub | Both hubs | Add note linking to WhatsApp or future page |

### Medium (backlog)

| # | Issue | Fix needed |
|---|---|---|
| M1 | Overstay grace period / fine at renewal not mentioned | Add to renewal guide with source note |
| M2 | Age limits for child visa (son over 15) not stated | Add to child guides |
| M3 | Birth certificate attestation sequence not explained (varies by country) | Add practical note |
| M4 | "Freehold vs leasehold" not explained on golden visa | Add 1-sentence definition |
| M5 | Marriage certificate MOFA process not detailed | Add practical note to spouse guides |
| M6 | Golden visa family member sponsorship costs confusing | Simplify Step 7 cost note |
| M7 | Common mistakes section missing on all major guides | Add 2–4 bullets per guide |

---

## 5. Recommended Content Architecture

### Priority 1: Add to existing guides (low risk, high ROI)

**Document checklist format (add to employment-visa, golden-visa-dubai-property, spouse guides):**

```
## What to Prepare

**Employee provides to PRO before Tasheel:**
- Passport (original + copy)
- Passport-size photo (white background)
- Prior UAE visa page copy (if any)
- Signed offer letter

**Employer / PRO provides:**
- Trade licence
- Establishment card
- PRO card
- Sponsor original Emirates ID
```

**Common mistakes section (add to top 3 guides):**

```
## Common Mistakes

- Submitting a job title that does not match the visa exactly
- Starting the process before marriage certificate MOFA attestation is complete  
- Booking travel before residence stamp is in passport
```

### Priority 2: Hub page intro paragraphs (no risk)

Three hub pages need 2–4 extractable sentences. Example for `/visas/family`:

> To sponsor a spouse or child in Dubai, the sponsor must hold a valid UAE residence visa with a salary of at least AED 3,000 per month (for a spouse) or AED 4,000–5,000 per month (for children), depending on the dependent type. A signed Ejari tenancy contract is required. Marriage and birth certificates must be attested by UAE MOFA before submitting through Amer.
> 
> *(Source note: salary thresholds — verify with GDRFA before applying. Requirements may vary.)*

### Priority 3: New page — Parents Visa (create stub)

Route: `/visas/parents` (hub) + `/guides/parents-visa-dubai` (guide)

Checklist from notes (GREEN elements, safe to publish with source note):

**Sponsor documents (confirmed practical):**
- Valid Emirates ID (original)
- Passport
- Residence visa copy
- Trade licence or salary certificate
- Ejari (rental contract)

**Applicant documents:**
- Passport + photo
- Proof of relationship (birth certificate attested by MOFA)
- 3 months bank statements

**What to label AMBER (practical only, not universal law):**
- Salary requirement: notes show AED 10,500 — do NOT publish as a fixed threshold; phrase as "income requirements vary; GDRFA confirms eligibility at submission"
- Deposit: AED 5,000 shown in notes — do NOT publish; may be required in some cases but is not a universal fee
- Ejari 2-bedroom requirement: AMBER — practical guidance only

**What to label RED (do not use):**
- Partner/investor parent visa deposit of AED 3,060 — RED until sourced
- 48% share for partner visa — RED until sourced

---

## 6. AMER / Tasheel Notes — Addition Matrix

| Note | Source type | Risk | Add to which page | How to phrase |
|---|---|---|---|---|
| Tasheel: offer letter + work permit submission | GREEN | Low | employment-visa step 1 | Already in step — add document list |
| Change status (inside UAE entry permit) | GREEN | Low | employment-visa step 3–4 | Already covered |
| Emirates ID application via Amer | GREEN | Low | All relevant guides | Already in steps |
| Medical fitness via Amer-coordinated clinic | GREEN | Low | All relevant guides | Already in steps |
| Tawjeeh for Cat 3 final labour contract | GREEN | Low | employment-visa step 7 | Already in step |
| ILOE insurance / possible ILOE fine | AMBER | Medium | employment-visa | Add as separate note: "Some employers arrange ILOE (labour insurance). Confirm with your employer whether this applies to your contract." |
| MB number from Tasheel | AMBER | Low | employment-visa | Can add as practical note in step 1 advice |
| White background photo | GREEN | Low | employment-visa, spouse, child, golden | Add to document checklist |
| Sponsor original Emirates ID required | GREEN | Low | spouse, child, employment | Add to checklist |
| Establishment card + PRO card | GREEN (context) | Low | employment-visa overview | Add 1 sentence: "Your employer must hold a valid establishment card (immigration file) and PRO card to process visas." |
| Salary 10,500 for parents | RED | High | Do NOT add to parents page yet | Needs GDRFA official source |
| Deposit 5,000 for parents | RED | High | Do NOT add | Not universally required |
| Ejari 2-bedroom for parents | AMBER | Medium | Parents page | Add with caution note |
| Property GV below 65: ~15,000 total package | AMBER | High | Do NOT add as official fee | Service-centre package, not government fee |
| Above 65: ~17,000 | AMBER | High | Do NOT add | Same |
| Off-plan paid 30%: AED 2M value | AMBER | High | Golden visa note only | Phrase as "off-plan eligibility requires at least 30% paid — confirm requirements with DLD before applying" |
| NOC from bank for mortgage | AMBER | Low | golden-visa step 2 | Already mentioned in step 2 advice — strengthen |
| Shared ownership spouse | AMBER | Medium | golden-visa note | Add note: "Shared ownership with spouse may qualify — confirm with DLD" with MOFA attestation for marriage cert |
| Sponsorship transfer 2yr/3yr cost | AMBER | Medium | Do NOT add yet | Needs source; currently no sponsorship transfer guide |
| 48% share for partner visa | RED | High | Do NOT add | Internal operational note only |
| Absconding fee | RED | High | Do NOT add | Internal operational note only |
| GCC EID note | AMBER | Medium | Do NOT add yet | No relevant page for this |
| Ukraine visa 1 year only | RED | High | Do NOT add | Country-specific, not sourced |
| Violation committee | AMBER | High | employment-visa | Add as brief note at bottom: "Cases involving visa violations may be referred to the immigration violation committee before processing" |

---

## 7. What to Shorten

| Page | What to shorten | Why |
|---|---|---|
| employment-visa overview (EN) | Para 2 — current 3 sentences are solid; do not shorten | Actually fine — keep |
| golden-visa-dubai-property overview | "Total government fees ... AED 9,884.75, covering DLD fees, residency permit, admin fees, medical examination, and Emirates ID" — very good; keep | Keep |
| renew-family-visa Step 3 | "Counter staff enter both applications... confirm the total government fee, and collect payment" — verbose | Shorten to: "Submit both renewal at Amer. Government fee confirmed at counter." |
| spouse-outside overview | "The main delay is document attestation, which can take 2–3 weeks. The sponsor must meet minimum salary requirements and provide a valid tenancy contract (Ejari)." — this is good but passive | Strengthen: "Allow 2–3 weeks for MOFA attestation. The sponsor must meet GDRFA minimum salary requirements." |

---

## 8. What NOT to Touch

| Item | Reason |
|---|---|
| employment-visa step costs (confirmed per step) | Accurate and differentiating — do not change |
| golden-visa AED 9,884.75 total | Specific and confirmed — do not round |
| golden-visa DLD breakdown (4,020 + 2,856.75 + 1,155) | Keep exactly |
| "Category 3 carries a much higher MOHRE fee" warning | Important practical info — keep |
| employment-visa "2–4 weeks" timeline | Confirmed range |
| Medical fitness step warning about pre-existing conditions | Important legal caution — keep |
| newborn 30-day registration window | Specific and correct |
| "children under 18 exempt from medical" | Correct |
| All RU content already published | Do not change wording |
| All step costs already confirmed | Do not change |

---

## 9. Risk Register

| Addition | Risk level | Reason | Verdict |
|---|---|---|---|
| Document checklists (passports, photos, trade licence) | GREEN | Standard confirmed documents | Add |
| "White background photo" requirement | GREEN | Universal requirement | Add to checklists |
| ILOE insurance note | AMBER | Practical, employer-dependent | Add with "confirm with employer" caveat |
| Sponsor salary requirement (~AED 3,000 for spouse) | AMBER | Practical threshold, may vary | Add with "verify with GDRFA" caveat |
| Parents visa document list | AMBER | Documents confirmed, salary/deposit figures not | Add documents; do NOT add salary 10,500 or deposit 5,000 |
| Off-plan 30% threshold | AMBER | DLD policy but not sourced in this project | Add as "confirm with DLD" note only |
| Mortgage NOC requirement | AMBER | Already mentioned in Step 2 — strengthen slightly | Fine to mention, already in guide |
| Service-centre package fees (~15,000) | RED | These are bundled service prices, not government fees | Do NOT add as official government fees |
| Salary 10,500 for parents | RED | Specific threshold not confirmed from official source | Do NOT add |
| Deposit 5,000 for parents | RED | Not a universal official requirement | Do NOT add |
| Ukraine 1-year visa note | RED | Country-specific, unverified | Do NOT add |
| Absconding fee | RED | Internal operational note, not appropriate for public guide | Do NOT add |
| 48% share for partner visa | RED | Internal, not sourced | Do NOT add |

---

## 10. Proposed Next Phase

**Phase 6C-VISAS-CONTENT-01** — Practical: add document checklists + source notes + hub intros

Priority order:
1. `/guides/employment-visa` — add document checklist, ILOE note, common mistakes
2. `/guides/golden-visa-dubai-property` — add document checklist, off-plan/mortgage note, parents note
3. `/guides/spouse-dependent-visa-dubai-outside-country` — add checklist, MOFA attestation practical note, salary note with caveat
4. `/visas/family` hub — add intro paragraph, link newborn/renewal guides
5. `/visas/golden` hub — add intro paragraph with AED 2M threshold
6. `/visas` hub — add intro paragraph
7. `/guides/renew-family-visa-dubai` — add grace period note, fee guidance at Step 3

**Phase 6C-VISAS-CONTENT-02** — New pages
1. Parents visa guide stub (AMBER phrasing throughout)
2. Investor/Partner visa hub page (or WhatsApp flow improvement)

**Phase 6C-VISAS-SCHEMA-01** — HowTo JSON-LD
1. Add HowTo schema to top 3 guides (employment-visa, golden-visa, spouse-outside)

**Phase 6C-VISAS-CONTENT-03** — Outside UAE employment guide enrichment
1. Upgrade outside-UAE employment guide to match inside-UAE detail level
2. Add MOHRE/GDRFA detail per step, remove fee ranges in favour of specific costs where possible

---

## 11. Confirmation — What Was NOT Done

| Action | Status |
|---|---|
| DB writes | NONE |
| Schema changes | NONE |
| Admin access | NONE |
| AI Inbox access | NONE |
| Commits | NONE |
| Push | NONE |
| Deploy | NONE |
| Content edits | NONE — audit only |
| Fake data added | NONE |
