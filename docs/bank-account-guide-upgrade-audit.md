# Bank Account Guide Upgrade Audit
**Date:** 2026-04-30
**Guide slug:** open-business-bank-account-dubai
**Scope:** Audit + EN upgrade implemented locally (2026-05-01). No production changes.
**Evidence basis:** Wio Business corporate account onboarding screenshots (user-provided).

---

## EN Upgrade Status (2026-05-01)

EN content upgrade implemented locally via `scripts/update-bank-account-guide-en.ts`.

| Item | Before | After |
|------|--------|-------|
| en_title | How to Open a Business Bank Account in Dubai | Open a Business Bank Account in Dubai for a UAE Company |
| Step count | 8 | 9 |
| RU fields | Empty | Still empty (untouched) |
| Em-dashes in content | 0 (clean) | 0 (clean) |
| Build | 63 pages, 0 errors | 63 pages, 0 errors |

New step structure:
1. Confirm Your Company Profile and Applicant Role
2. Choose the Bank Route and Understand Digital Onboarding
3. Prepare Company, Shareholder, and Authority Documents
4. Build the Business Profile the Bank Can Understand
5. Prepare Customer and Supplier Evidence
6. Explain Source of Funds and Provide Bank History
7. Prepare Expected Transaction and Tax Information
8. Handle Compliance Checks for Real Estate and Regulated Activities
9. Submit, Answer Bank Questions, and Wait for the Decision

Script assertions passed: no em-dashes, no guarantee language, no Wio partnership language, step count = 9, RU fields = empty.

**Next:** Review EN guide via local admin panel. Then deploy to production with DB backup. Then create RU content.

---

## 1. Executive Summary

The current EN guide is structurally sound but content-thin on compliance. It reads as a generic procedural article rather than a practical compliance preparation tool. The Wio Business onboarding screenshots reveal that real bank onboarding goes significantly deeper than the current guide describes — structured customer/supplier questionnaires, source of funds declarations, 3-month bank statements, CV/LinkedIn, and regulated activity checks.

**Recommendation: Upgrade EN master guide first, then create RU content from the improved EN.**

The current guide's 8 steps can be restructured into 9 steps by splitting the "Prepare Supporting Documents" step into two focused steps: one for KYC/compliance documents (customer and supplier profiles, bank statements) and one for source of funds. This adds genuine, non-obvious value that the current guide lacks entirely.

---

## 2. Current Guide State

### Guide-level fields

| Field | Current value |
|-------|--------------|
| slug | open-business-bank-account-dubai |
| category | company-setup |
| published | yes |
| price | No government fee. Minimum average monthly balance: AED 25,000–50,000 (varies by bank and account tier). |
| timeline | 2–6 weeks (varies by bank, compliance review, and business activity) |
| last_updated | April 2026 |
| en_title | How to Open a Business Bank Account in Dubai |
| en_summary | How to open a UAE business bank account after company formation. Covers document preparation, bank selection, compliance review, and activation. Timelines (2–6 weeks) and minimum balance requirements vary by bank. |
| en_audience | Mainland and free zone company owners with a UAE trade license who need a business bank account. Not applicable to personal banking, freelance accounts, or regulated financial institutions. |
| en_overview | 2 paragraphs — bank's internal compliance team owns the process; 2–6 weeks; no government fee; minimum balance AED 25,000–50,000; approval not guaranteed. |

### RU fields

All empty. `ru_title`, `ru_summary`, `ru_audience`, `ru_overview` are all `""`.

No RU content exists yet. Full population needed after EN upgrade.

### Current step structure (8 steps)

| Step | Title | Cost | TimeEst | Quality flag |
|------|-------|------|---------|-------------|
| 1 | Prepare Your Company Documents | No fee | 1 day | Thin — too generic |
| 2 | Choose the Right Bank | No fee | 1–2 days | Decent. Mentions Emirates NBD, RAKBANK, Mashreq, ADCB. No digital banks. |
| 3 | Prepare Supporting Business Documents | No fee | 1–3 days | **Critical gap** — vague. Missing customer/supplier profiles, bank statements, CV, subsidiaries. |
| 4 | Submit the Bank Application | No fee / up to AED 500 | 1 day | Adequate |
| 5 | Complete Compliance Review | No fee | 1–3 weeks | Mentions KYC, source of funds — but surface level |
| 6 | Attend the Bank Meeting if Required | No fee | 1–2 hours | Decent. POA mention in warning. |
| 7 | Receive Approval and Activate the Account | No fee at this stage | 1–5 business days | Adequate |
| 8 | Fund the Account | AED 25,000–50,000 minimum balance | Same day | Good — clear and specific |

### Structural problems

1. **Step 3 does everything and does none of it well.** It bundles KYC supporting documents, business plan, client contracts, and personal bank statements into one generic step with no structure.

2. **No mention of customer/supplier profiles.** The Wio onboarding asks for up to 5 top customers (name, country, website, supporting docs) and up to 5 top suppliers — same format. The current guide mentions "signed client contracts or invoices" but doesn't explain that banks want a structured profile of who you sell to and who you buy from.

3. **No mention of bank statements for the last 3 months.** Personal or company. The "not password protected" requirement is a real practical detail missing from the guide.

4. **Source of funds** mentioned once in Step 5 in passing — not explained, not given its own treatment.

5. **CV and LinkedIn** — not mentioned at all.

6. **Subsidiary/partner company disclosure** — not mentioned.

7. **RERA and regulated activity** — not mentioned. Critical warning for real estate companies.

8. **Digital bank onboarding** — not mentioned. Wio Business, Mashreq NEO, and similar digital-first options are practically relevant but absent.

9. **Consultancy services description** — not mentioned. Banks commonly ask "what services does your company provide?" for consulting businesses. Current guide doesn't help the reader prepare this.

10. **Shareholder role types** — not mentioned. The bank distinguishes between shareholder, partner with POA, employee with POA, and freelancer. This affects what documents are required for who.

---

## 3. Wio Business Onboarding Insights

Source: user-provided screenshots of Wio Business corporate account application flow.

These insights reflect the kind of compliance depth that digital-first banks (and most UAE banks) now require. Wio is used here as a concrete, real-world evidence base — not as a partner, sponsor, or guaranteed approval path.

### 3a. Applicant role

Bank onboarding asks for the applicant's role:
- Shareholder / Owner
- Partner with Power of Attorney
- Employee with Power of Attorney
- Freelancer

**Guide implication:** The current guide mentions POA only once, in a warning in Step 6 (bank meeting). This needs to move earlier — the applicant must know their role affects what identity documents and authorisation documents the bank needs from day one.

### 3b. Customer profile

Bank asks for up to 5 top customers:
- Customer name
- Customer location / country
- Customer website
- Supporting documents: receipts, invoices, contracts
- Option: business has no customers yet

**Guide implication:** This is entirely absent from the current guide. A reader who hasn't mapped their top customers before the bank application is unprepared. The guide should tell them to prepare this list before applying.

### 3c. Supplier profile

Bank asks for up to 5 top suppliers:
- Supplier name
- Supplier location / country
- Supplier website
- Supporting documents: receipts, invoices, contracts
- Option: business has no suppliers

**Guide implication:** Same gap as customers. Not mentioned at all.

### 3d. Bank statements

Bank asks for last 3 months of bank statements:
- Personal or company
- Files must not be password-protected

**Guide implication:** Step 3 mentions "existing personal bank statements" once without explaining why or what format. The 3-month requirement and the password-protection issue are both missing.

### 3e. Subsidiaries and partner companies

Bank asks about up to 3 subsidiaries or partner companies:
- Company name
- Industry
- Country of incorporation
- Option: no subsidiaries

**Guide implication:** Not mentioned. Holdings companies, group structures, and freelancers with multiple licenses need to be aware of this.

### 3f. Consultancy services

Bank asks for a description of what consultancy services the company offers.

**Guide implication:** Not mentioned. Consulting businesses (IT, marketing, finance, management consulting) — common in Dubai free zones — are a large audience for this guide and they will face this question.

### 3g. Regulated / real estate activity

Bank asks specifically about RERA licensing for real estate activity.

**Guide implication:** Not mentioned at all. This is a critical warning: a real estate company without a RERA license cannot open a bank account for real estate transactions. The guide should flag this.

### 3h. Source of funds

Bank asks for source of funds declaration.
Supporting documentation: bank statements showing salary, payslips, salary transfer proof.

**Guide implication:** Mentioned vaguely in Step 5 — "source of funds" appears once as a KYC item without explanation. A shareholder contributing capital needs to show where that capital came from. Readers don't know this.

### 3i. CV and LinkedIn

Bank may ask for CV or LinkedIn profile.

**Guide implication:** Not mentioned. This surprises most applicants. It belongs in the supporting documents step.

---

## 4. SEO Opportunity EN / RU

### Current EN coverage

The current title "How to Open a Business Bank Account in Dubai" covers the primary intent query. The page covers the basic process but lacks depth on the compliance and KYC topics that are increasingly the dominant search questions from people who have already been declined or warned.

**Missed intent clusters:**

| Cluster | Current coverage | Gap |
|---------|-----------------|-----|
| What documents does a UAE bank need? | Step 1/3 — generic | No KYC checklist depth |
| Why was my bank application rejected? | Step 5 warning | No root cause explanation |
| Do I need a RERA license for a bank account? | Not mentioned | Complete gap |
| What is source of funds for UAE bank? | Step 5 one line | No explanation |
| Does a trade license guarantee a bank account? | Overview — yes | Good, but not prominent enough |
| Wio Business account UAE documents | Not mentioned | Complete gap |
| Business bank account for free zone company | Step 2 advice | Thin |
| Business bank account for consultancy Dubai | Not mentioned | Gap |

### Primary EN keyword targets

- open business bank account in Dubai
- UAE corporate bank account
- business bank account UAE
- company bank account Dubai
- UAE bank account documents
- trade license bank account UAE
- KYC bank account UAE
- source of funds UAE bank

### Primary RU keyword

**открыть бизнес счёт в банке ОАЭ**

This is the head term. High-intent from Russian-speaking founders and employees in Dubai who need to act, not just learn.

### Secondary RU keywords

- открыть корпоративный счёт в Дубае
- банковский счёт для компании в ОАЭ
- открыть счёт для компании в Дубае
- счёт в банке ОАЭ для free zone компании
- счёт в банке ОАЭ для mainland компании
- корпоративный банковский счёт Дубай
- Wio Business account UAE
- Wio Business документы
- compliance банка ОАЭ
- source of funds UAE bank
- RERA license bank account Dubai

### Semantic entities to include naturally

KYC · AML · UBO · source of funds · source of wealth · bank statements · personal bank statement · company bank statement · invoices · contracts · receipts · top customers · top suppliers · CV · LinkedIn profile · Power of Attorney · shareholder · subsidiary · partner company · trade license · MOA · certificate of incorporation · share certificate · establishment card · Emirates ID · UAE residence visa · RERA license · real estate activity · consultancy services · free zone · mainland · digital bank · Wio Business · Mashreq · Emirates NBD · RAKBANK · ADCB

---

## 5. Recommended EN Guide Upgrade

### Title

**Current:** How to Open a Business Bank Account in Dubai  
**Proposed:** How to Open a Business Bank Account in Dubai: Documents, Compliance, and What Banks Actually Check

The proposed title signals compliance depth — it targets the intent cluster that existing guides miss. The colon format is familiar and SEO-safe.

### Summary (meta description)

**Proposed:** Step-by-step guide to opening a UAE corporate bank account after company formation. Covers the full compliance checklist — customer and supplier profiles, source of funds, bank statements, RERA requirements — and what banks actually verify before approving.

### Audience

**Proposed:** Mainland and free zone company owners and shareholders with a UAE trade license who need a business bank account. Also relevant to partners with Power of Attorney handling the application. Not applicable to personal banking or regulated financial institutions.

### Overview

Para 1: A UAE trade license does not guarantee a bank account. Banks run an internal KYC and AML compliance review that goes well beyond verifying your company documents. They check who your customers and suppliers are, where your funds come from, whether your business activity is regulated (e.g. real estate), and whether your company's profile makes commercial sense. Digital-first banks like Wio Business and traditional banks like Emirates NBD, RAKBANK, and Mashreq all follow this process — the specific questions differ, but the compliance logic is the same.

Para 2: The application itself takes 1 day to submit. The compliance review takes 1–3 weeks. Total timeline is 2–6 weeks from submission to account activation. No government fee applies. The main ongoing cost is the minimum average monthly balance — typically AED 25,000–50,000, though some SME-tier accounts have lower thresholds. Approval is not guaranteed: banks can decline without providing a reason.

---

## 6. Recommended EN Step Structure (9 steps)

**Change from current 8:** Add one new step (Step 4) dedicated to source of funds. Expand Step 3 to cover customer/supplier profiles, bank statements, CV, and subsidiaries. Steps 5–9 correspond to current Steps 4–8.

| # | Title | What changes vs. current |
|---|-------|--------------------------|
| 1 | Prepare Your Company Incorporation Documents | Minor: add shareholder role types (shareholder / POA holder) |
| 2 | Choose a Bank — Traditional or Digital | Expanded: add Wio Business and digital bank options |
| 3 | Build Your KYC Compliance Package | **Rewritten**: customers, suppliers, bank statements, CV/LinkedIn, subsidiaries |
| 4 | Prepare Your Source of Funds Documentation | **New step**: salary transfers, payslips, personal bank statements |
| 5 | Submit the Bank Application | Minor changes from current Step 4 |
| 6 | Complete the Compliance Review | Expanded from current Step 5 |
| 7 | Attend the Due Diligence Meeting | Minor changes from current Step 6 |
| 8 | Receive Approval and Activate the Account | Unchanged from current Step 7 |
| 9 | Fund the Account | Unchanged from current Step 8 |

### Step 3 detailed design — Build Your KYC Compliance Package

**What:** Compile the documents that prove your business model is real and your commercial relationships are traceable. Banks need more than your trade license — they need to understand who you sell to, who you buy from, and whether your profile makes sense for your stated business activity.

**What to prepare:**
- Top customers (up to 5): name, country, website or contact, and at least one supporting document (invoice, contract, receipt)
- Top suppliers (up to 5): name, country, website or contact, and at least one supporting document
- Last 3 months of bank statements (personal if company is new, company if trading) — must not be password-protected
- CV or LinkedIn profile for each shareholder (some banks ask for this)
- List of any subsidiaries or partner companies (name, country, industry)

**Advice:** If your company has no customers or suppliers yet, prepare a clear description of your intended business activities and your first expected customer relationship. Banks accept "no customers yet" but expect a credible business plan or at least a pipeline explanation.

**Warning for consultancy businesses:** Banks ask what specific services your company provides. "General trading" or "consultancy" without specifics can trigger additional review. Prepare a one-paragraph description of your service offering.

**Warning for real estate companies:** If your business activity includes real estate, the bank will require your RERA license before opening an account for real estate transactions. A trade license alone is not sufficient. Apply for RERA registration before the bank application.

### Step 4 detailed design — Prepare Your Source of Funds Documentation

**What:** The bank will ask where the capital in your business account is coming from. For a new company, this is typically the personal funds of the shareholders. You need to show that your source of funds is legitimate and traceable.

**What to prepare:**
- Personal bank statements for the last 3 months showing the origin of your initial capital
- Salary payslips or salary transfer records if the funds come from employment income
- If funds come from a previous business sale or investment, a supporting document explaining the source
- A written source of funds declaration if the bank provides one

**Advice:** This applies to all shareholders who are contributing capital to the company. If there are multiple shareholders, each may need to provide their own source of funds documentation.

**Warning:** Source of funds review is a common reason for delays and rejections. A personal bank statement that shows a sudden large inflow without explanation will attract scrutiny. Prepare a brief written explanation of the origin of your initial capital before the application.

---

## 7. RU Guide Plan

**Do not populate RU until EN upgrade is complete and live.**

After the EN upgrade, create RU content following the standard pattern:
- `ru_title`, `ru_summary`, `ru_audience`, `ru_overview` — full translation
- Per-step: `ru_title`, `ru_what`, `ru_where`, `ru_address`, `ru_advice`, `ru_warning`

Primary RU keyword target: **открыть бизнес счёт в банке ОАЭ**

The RU guide should feel like advice from a compliance consultant, not a procedural checklist. Russian-speaking readers of this guide are typically founders or their assistants preparing for a bank application that has real financial consequences. The compliance sections (customer/supplier profiles, source of funds) will be the highest-value part of the RU guide.

---

## 8. Compliance and Risk Warnings

These must appear in the upgraded guide. None are in the current version adequately.

| Warning | Where |
|---------|-------|
| A trade license does not guarantee bank approval | Overview (prominent) and Step 5 |
| RERA license required for real estate activity | Step 3 (warning field) |
| Source of funds scrutiny — large unexplained inflows cause rejections | Step 4 (warning field) |
| Bank statements must not be password-protected | Step 3 (advice field) |
| Approval not guaranteed — banks can decline without reason | Step 5 (existing, keep) |
| Wio Business is one example — other banks have similar checks | Step 3 (advice field) |
| Do not imply Guidex is partnered with Wio or guarantees approval | N/A — house rule |

---

## 9. Future Web App Hub Opportunities

The improved guide supports the Guidex product direction as a web app hub:

**Route finder integration:** Users coming from `/find-my-visa` or a company setup route could land on this guide as the final step of the business setup route. A "Prepare your bank application file" CTA at the bottom of the guide fits naturally.

**Bank compliance checklist tool:** A future interactive checklist component — "Is your bank application file ready?" — could be embedded above the steps. It would walk the user through the same categories the guide describes (customers, suppliers, source of funds, bank statements, CV) and let them check off what they have.

**Wio Business route page:** A future `/guides/wio-business-account-dubai` or `/company-setup/digital-bank-account` page could reference Wio specifically as the example digital bank, while this guide remains general-purpose. This keeps the main guide bank-agnostic and creates a natural internal link opportunity.

**Application preparation service CTA:** The WhatsApp CTA at the bottom ("Ask an expert") is correct for now. A future "We help prepare your bank compliance file" CTA — specific to this guide — would outperform a generic WhatsApp prompt.

---

## 10. DB and Schema Constraints

| Item | Current | Recommended |
|------|---------|-------------|
| Step count | 8 | 9 |
| Schema change needed | No | No |
| New DB columns needed | No | No |
| Fields available per step | en_title, en_what, en_where, en_address, en_advice, en_warning, ru_* equivalents, cost, time_est | All sufficient |

**Risk of adding one step:** Low. The guide already has 8 steps. The new Step 4 (source of funds) is a natural split of the existing Step 3. Adding one step row via a script is the same pattern used for all other guides. No schema change required.

**Safest update method:** Create a script (`scripts/update-bank-account-guide.ts`) that:
1. Guards against double-run (checks existing step count)
2. Updates all existing step rows by `step_order` using `JOIN` on `guide_id`
3. Inserts the new Step 4 with correct `step_order`
4. Renumbers current steps 4–8 to 5–9 before inserting
5. Updates guide-level fields (en_title, en_summary, en_audience, en_overview)
6. Runs a post-write verification

Alternatively: update via admin panel (8 existing steps) + add one new step via the "Add step" button. Admin panel is safe for content-only changes.

---

## 11. Top 10 Content Improvements

1. **"Trade license alone is not enough"** — make this the first sentence of the overview, not buried in Step 5.
2. **Customer and supplier profiles** — add as the primary content of Step 3. This is the single biggest gap.
3. **Source of funds as its own step** — currently one line in Step 5. Deserves dedicated treatment with document examples.
4. **3-month bank statements requirement** — specific and actionable. Not mentioned anywhere.
5. **RERA license warning** — real estate companies face account rejection without it. Complete gap.
6. **Digital bank option** (Wio Business as example) — in Step 2. Wio is a real digital bank operating in UAE with a documented onboarding flow. Adds credibility and relevance.
7. **CV/LinkedIn mention** — surprises applicants. One line in Step 3 advice field.
8. **Shareholder role types** — needed from the first step. Affects what ID and authorisation docs are required.
9. **Consultancy services description** — one paragraph explanation is what banks ask for. Add to Step 3.
10. **"No customers yet" scenario** — currently one line. Needs more explicit guidance: prepare business plan, pipeline, or projected customer profile.

---

## 12. Exact Next Single Action

**Create `scripts/update-bank-account-guide.ts`** with the full EN content upgrade:
- Updated guide-level fields (en_title, en_summary, en_audience, en_overview)
- 9 steps replacing current 8 (rewrite steps 1–3, add new step 4, minor updates to steps 5–9, renumber)
- Zero em-dashes in any field
- All advice and warning fields filled per the CLAUDE.md content standard
- QA check (em-dash scan, sentence count in what fields, no invented addresses, no AED ranges without evidence)

Save as draft first. Review in admin panel. Publish only after owner review.

**Do not create RU content until EN upgrade is live and reviewed.**
