# Guide Schema Eligibility Matrix — Phase 6C-99C
## Date: 2026-06-08 | LOCAL ONLY — NO DEPLOY

---

## Summary

All 17 published guides are procedural, have RU content, and have full step data.
All 17 are eligible for Article + HowTo schema.
No FAQPage schema added (no visible FAQ blocks on any guide page).

---

## Eligibility matrix

| Slug | Category | Guide type | Steps | RU | RU steps | Article | HowTo | Risk | Reason |
|---|---|---|---|---|---|---|---|---|---|
| `free-zone-company-setup-dubai` | company-setup | procedural / business setup | 8 | yes | 8/8 | ✓ | ✓ | medium | Visa fees and timelines may vary; content is process-oriented not legal advice |
| `mainland-company-setup-dubai` | company-setup | procedural / business setup | 8 | yes | 8/8 | ✓ | ✓ | medium | Same as above |
| `open-business-bank-account-dubai` | company-setup | procedural / compliance | 9 | yes | 9/9 | ✓ | ✓ | medium | Bank-specific steps; content clearly states variation |
| `amer-center-dubai` | government | procedural / government | 4 | yes | 4/4 | ✓ | ✓ | low | Process explanation, no fixed fee claims |
| `document-attestation-dubai` | government | procedural / government | 3 | yes | 3/3 | ✓ | ✓ | low | Clear official process, limited fee exposure |
| `pro-services-dubai` | government | procedural / government | 5 | yes | 5/5 | ✓ | ✓ | low | Explains the service model, no false claims |
| `tax-residency-certificate-uae` | government | procedural / tax | 8 | yes | 8/8 | ✓ | ✓ | high | Tax/legal topic but content is accurate and process-only; no legal certainty claimed |
| `holiday-home-permit-dubai` | tourism | procedural / compliance | 12 | yes | 12/12 | ✓ | ✓ | medium | Permit fees visible and accurate per DET; 12-step process |
| `child-dependent-visa-dubai-inside-country` | visas | procedural / visa | 6 | yes | 6/6 | ✓ | ✓ | medium | Visa process; fees stated as government fees |
| `child-dependent-visa-dubai-outside-country` | visas | procedural / visa | 6 | yes | 6/6 | ✓ | ✓ | medium | Same |
| `employment-visa` | visas | procedural / visa | 8 | yes | 8/8 | ✓ | ✓ | medium | Reference implementation; well-structured |
| `employment-visa-dubai-outside-uae` | visas | procedural / visa | 7 | yes | 7/7 | ✓ | ✓ | medium | Same |
| `golden-visa-dubai-property` | visas | procedural / visa | 7 | yes | 7/7 | ✓ | ✓ | high | AED 2M threshold property; fees and steps are accurate |
| `newborn-visa-dubai` | visas | procedural / visa | 6 | yes | 6/6 | ✓ | ✓ | medium | Multiple external steps (consulate); content correctly notes variation |
| `renew-family-visa-dubai` | visas | procedural / visa | 4 | yes | 4/4 | ✓ | ✓ | medium | Standard renewal; accurate and structured |
| `spouse-dependent-visa-dubai-inside-country` | visas | procedural / visa | 7 | yes | 7/7 | ✓ | ✓ | medium | Same |
| `spouse-dependent-visa-dubai-outside-country` | visas | procedural / visa | 7 | yes | 7/7 | ✓ | ✓ | medium | Same |

---

## Pages excluded from schema

| Page | Why excluded |
|---|---|
| `/guides/child-dependent-visa-dubai` | Tab-based hub page (GuideTabs component) — renders two guides simultaneously. Not a single Article/HowTo. Requires separate analysis. |
| `/guides/spouse-dependent-visa-dubai` | Same. Tab-based hub page for inside/outside variants. |

---

## FAQPage eligibility

No guide pages currently have a visible FAQ block. All Q&A-style content is embedded in the overview text or step advice fields. FAQPage schema requires explicit Q&A markup visible to the user. Not applicable in this phase.

---

## Article schema fields

| Field | Source | Notes |
|---|---|---|
| `@type` | `Article` | Standard article type — appropriate for procedural guides |
| `headline` | `guide.title` | EN title on EN page, RU title on RU page |
| `description` | `guide.summary` | Meta description-level text |
| `mainEntityOfPage` | `{ "@type": "WebPage", "@id": canonical URL }` | Standard pattern |
| `url` | Canonical URL | EN: `/guides/{slug}`, RU: `/ru/guides/{slug}` |
| `inLanguage` | `"en"` or `"ru"` | Per locale |
| `dateModified` | `guide.updatedAt` | ISO timestamp from DB `updated_at` column |
| `publisher` | `{ "@type": "Organization", "name": "Guidex Consulting", "url": BASE }` | Matches OrgSchema |

**Fields intentionally omitted:**
- `author`: Not in DB. No author attribution system.
- `datePublished`: `last_updated` is human text ("April 2026"), not ISO. `created_at` is admin entry time, not editorial publication date.
- `image`: No stable image URLs attached to guides.

---

## HowTo schema fields

| Field | Source | Notes |
|---|---|---|
| `@type` | `HowTo` | All 17 guides are step-by-step procedural |
| `name` | `guide.title` | Per locale |
| `description` | `guide.summary` | Per locale |
| `step[]` | `guide.steps` | Each step as HowToStep |
| `HowToStep.name` | `step.title` | Per locale |
| `HowToStep.text` | `step.what` | Per locale |

**Fields intentionally omitted:**
- `totalTime`: `timeline` is human text ("2–4 weeks"), not ISO 8601 duration. Cannot safely use.
- `estimatedCost`: `price` is human text ("AED 4,900–7,300"). Cannot safely use.
- `supply`/`tool`: Not in DB.
- `HowToStep.url`: No stable step anchor IDs in the current template. Not added to avoid fake URLs.
