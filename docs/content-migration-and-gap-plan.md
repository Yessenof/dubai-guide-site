# Content Migration and Gap Plan

Version: 1.0 — April 2026

This maps our current content state against the full topic inventory,
identifies what we can create quickly, what needs verification, and what to postpone.

---

## Current Content State

| Guide | Status | Route | Published |
|---|---|---|---|
| employment-visa | Complete | Inside UAE (status change) | ✅ Published |
| child-dependent-visa-dubai-outside-country | Draft | Outside UAE entry permit | 0 (draft) |
| child-dependent-visa-dubai-inside-country | Draft | Inside UAE status change | 0 (draft) |
| spouse-dependent-visa-dubai-outside-country | Draft | Outside UAE entry permit | 0 (draft) |
| spouse-dependent-visa-dubai-inside-country | Draft | Inside UAE status change | 0 (draft) |
| golden-visa-dubai-property | Draft | DLD property investor route | 0 (draft) |

Group pages (tab system):
- `/guides/child-dependent-visa-dubai` — live (links to both child drafts)
- `/guides/spouse-dependent-visa-dubai` — live (links to both spouse drafts)

---

## Priority 1: Guides Ready for QA + Publish (Existing Content)

These guides exist as drafts and need:
1. `/guide-content-qa` run by owner
2. Any corrections made
3. Owner publishes via admin

| Guide | Next action | Blocking anything? |
|---|---|---|
| child-dependent-visa-dubai-outside-country | Run /guide-content-qa, publish | Child group page shows draft content |
| child-dependent-visa-dubai-inside-country | Run /guide-content-qa, publish | Child group page shows draft content |
| spouse-dependent-visa-dubai-outside-country | Run /guide-content-qa, publish | Spouse group page shows draft content |
| spouse-dependent-visa-dubai-inside-country | Run /guide-content-qa, publish | Spouse group page shows draft content |
| golden-visa-dubai-property | Run /guide-content-qa, verify fees, publish | Golden visa hub (when built) |

---

## Priority 2: Can Create Now — Source Material Strong

These guides can be written using:
- Existing project writing standard
- Official process knowledge that is well-established
- Fee data from official sources (GDRFA/DLD/ICA published or project source material)

| Guide | Slug | Notes |
|---|---|---|
| Family visa renewal (spouse) | `spouse-dependent-visa-dubai-renewal` | Renewal is a distinct 4-step process; shorter than new application |
| Family visa renewal (child) | `child-dependent-visa-dubai-renewal` | Same as above for child |
| Employment visa outside UAE | `employment-visa-dubai-outside-country` | Employee exits UAE for medical + stamping; different from inside-country |
| Emirates ID renewal | `emirates-id-renewal-dubai` | FAIC/ICP process; separate from visa renewal |
| Ejari registration | `ejari-registration-dubai` | RERA process; required document for many sponsorship applications |
| Newborn visa Dubai | `newborn-visa-dubai` | Two-phase process: birth cert attestation + Dubai registration |

---

## Priority 3: Needs Official Source Verification Before Writing

These topics require confirming fees, thresholds, or process details from official UAE sources before any content is published. Writing before verification risks publishing incorrect eligibility rules.

| Topic | Slug (proposed) | What needs verifying |
|---|---|---|
| Golden Visa — professional route | `golden-visa-dubai-professional` | AED 30K/month salary threshold — verify with ICA/GDRFA current requirements |
| Golden Visa — company owner | `golden-visa-dubai-company-owner` | AED 2M capital, 2-year audit requirement — verify with ICA |
| Golden Visa — bank deposit | `golden-visa-dubai-bank-deposit` | AED 2M deposit, eligible account types, participating banks |
| Retirement visa (property) | `retirement-visa-dubai-property` | AED 1M minimum, age 55+ requirement — verify from ICA/GDRFA |
| Investor visa (property) | `investor-visa-dubai-property` | AED 750K minimum — verify from ICA; may have changed or been discontinued |
| Domestic worker visa | `domestic-worker-visa-dubai` | AED 25K household income threshold — verify from MOHRE |
| Parents sponsorship visa | `parent-dependent-visa-dubai` | Income requirements for sponsoring parents — higher than child/spouse |

**Verification approach:**
- Check official GDRFA portal (gdrfa.gov.ae)
- Check ICA portal (ica.gov.ae)
- Check DLD for property-related thresholds
- Check MOHRE for employment/domestic worker rules
- Flag any threshold that cannot be confirmed with a source note in the guide

---

## Priority 4: Future Expansion (Phase 3/4)

These are valid topics with good search demand but require more content effort or are outside current scope.

| Topic | Slug (proposed) | Why postpone |
|---|---|---|
| Mainland LLC company setup | `company-setup-mainland-dubai` | Requires deep knowledge of DED process and fee tiers |
| Free zone company setup | `company-setup-freezone-dubai` | Many free zones; may need per-zone guides or a comparison hub |
| Trade license renewal | `trade-license-renewal-dubai` | Annual process; needs DED source verification |
| Freelance permit | `freelance-permit-dubai` | Multiple issuers (DED, free zones); complex to cover correctly |
| MOFA attestation standalone | `document-attestation-uae` | Currently covered in guide advice fields; standalone guide needs more depth |
| Power of Attorney in UAE | `power-of-attorney-dubai` | Legal service area; informational guide only; needs careful scoping |
| Dubai driving license | `dubai-driving-license` | `living` category; high search volume; clear process |
| Ejari / Tenancy contract | Already in Priority 2 | — |

---

## Content That Appears on Competitor but We Should NOT Create

| Topic | Reason |
|---|---|
| "Amer Services" booking page | We are a content site, not a service provider |
| "Legal Translation Services" | Service provider content; not a guide topic |
| "POA drafting service" | Requires legal credentials; thin guide version is risky |
| "DLD Services" as a service page | Covered adequately in golden visa property guide |
| "Compare our fees vs. government fees" | Implies we offer a service — we do not |

---

## Content Accuracy Framework

Every published guide must declare what its fee/process data is based on:

**Tier A — Officially verified:**
- Fee confirmed against DLD, GDRFA, ICA, MOHRE official portal or official document
- Process confirmed against official UAE government source
- Mark in guide with: `last_updated` field set to month/year of verification

**Tier B — Project source material:**
- Fee provided directly by owner based on first-hand knowledge
- Process logic consistent with known official procedure
- Should be upgraded to Tier A before site reaches significant traffic

**Tier C — Estimated / Approximate:**
- Fee is stated as approximate (AED X approx.) where exact figure is unclear
- Should always be flagged in guide content with "approximately" or "check with [authority]"
- Must not be presented as an exact verified amount

**Current guide status:**
| Guide | Tier | Notes |
|---|---|---|
| employment-visa | B-A | Fees from owner source, consistent with MOHRE/Tasheel rates |
| child guides | B | Fees from owner source; verify against GDRFA before Tier A |
| spouse guides | B | Same as child |
| golden-visa-dubai-property | A | DLD fees from official DLD source material; timeline official |

---

## Launch-Ready Skeleton vs. Full Expansion

### Skeleton (Can launch with this)

A launchable skeleton for the site requires:
- 3–5 published guides (we have 1 published + 5 ready for QA)
- Homepage updated to reflect content depth
- Guide list works (already working)
- At least 1 group page live with published child guides behind it

**Target: Launch skeleton after publishing the 4 family/dependent guides + golden visa property guide.**
That gives 6 published guides, which is enough for a credible content site.

### Full Expansion (Phase 2/3)

After skeleton launch:
1. Build service hub pages (`/visas/family`, `/visas/golden`)
2. Write Priority 2 guides (renewal, newborn, outside-country employment)
3. Build route finder calculator
4. Verify and write Priority 3 guides (professional golden visa, retirement, etc.)
5. Build company setup section
6. Build living in Dubai section

---

## Gap Summary

| Gap type | Count | Next action |
|---|---|---|
| Drafts needing QA + publish | 5 | Owner runs /guide-content-qa |
| Topics ready to write | 6 | Write and QA |
| Topics needing verification before writing | 7 | Verify against official sources |
| Future expansion topics | 10+ | Phase 3/4 planning |
| Topics explicitly out of scope | 5 | Do not create |
