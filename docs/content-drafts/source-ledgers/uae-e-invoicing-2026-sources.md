# UAE E-Invoicing 2026 Source Ledger

## Ledger status

```
ledger_status:           source_ledger
publish_status:          not_for_publish_yet
content_status:          source_verification_only
risk_level:              high
source_reliability:      official_baseline_plus_secondary_amendment_signals
verification_required:   true
last_reviewed:           2026-05-18
owner_review_required:   true
admin_status:            not_used
ai_inbox_status:         not_used
db_status:               not_touched
```

**Critical flag:** The ASP appointment deadline for large businesses exists in TWO versions — the February 2026 MoF baseline (31 July 2026) and secondary media signals reporting an extension (30 October 2026). This conflict must be resolved with an official MoF source before any Guidex content publishes a deadline date.

---

## Official baseline source

### Source A — UAE Ministry of Finance Electronic Invoicing Guidelines

| Field | Value |
|---|---|
| Authority | UAE Ministry of Finance (mof.gov.ae) |
| Document | UAE Electronic Invoicing Guidelines V-1.0 |
| Document date | 23 February 2026 |
| Purpose | Official MoF guideline establishing the UAE electronic invoicing programme — pilot start, voluntary phase, mandatory rollout by business category |
| Source type | official |
| Reliability | official |
| URL | https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoicing-Guidelines_V-1.0-23Feb2026.pdf |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — official_baseline_source — recheck_before_publish |
| Re-check before publish | Yes — verify this is still the latest version; check for amendments |

#### Facts captured from this source

**Programme start and voluntary phase:**

- UAE electronic invoicing pilot programme starts on **1 July 2026**.
- Voluntary electronic invoicing can be implemented from **1 July 2026**.

**Rollout timeline by category (as per February 2026 guideline):**

| Category | ASP appointment deadline | Mandatory implementation |
|---|---|---|
| Annual revenue ≥ AED 50,000,000 (large businesses) | 31 July 2026 | 1 January 2027 |
| Annual revenue < AED 50,000,000 (SMEs) | 31 March 2027 | 1 July 2027 |
| Government entities | 31 March 2027 | 1 October 2027 |

**Readiness steps described in the guideline:**
1. Understand requirements
2. Select an Accredited Service Provider (ASP)
3. Test invoice exchange and reporting
4. Go live

**Important caveat:** This is the February 2026 baseline. Secondary sources report the large-business ASP deadline may have been extended to 30 October 2026. The table above reflects the original guideline — not necessarily the current official position.

---

## Possible amendment signals — NOT final until official source captured

These are secondary signals only. Do not treat as confirmed. Do not publish any revised deadline date based on these signals alone.

### Signal A — Khaleej Times report

| Field | Value |
|---|---|
| Source | Khaleej Times |
| Source type | trusted_media_signal |
| URL | https://www.khaleejtimes.com/business/uae-extends-e-invoicing-service-provider-deadline-to-october-2026 |
| Access date | 2026-05-18 |
| Reported claim | UAE extended the e-invoicing service provider (ASP) appointment deadline to October 2026 |
| Reliability | trusted_media_signal |
| Verification status | source_signal_only — official_mof_confirmation_required |
| Publish allowed | No — media signal only, not an official MoF announcement |

### Signal B — Other secondary signals

Multiple tax advisory, legal, and technology websites report a revised ASP appointment deadline of **30 October 2026** for large businesses (annual revenue ≥ AED 50 million). Sources include professional services firms and B2B software providers.

These signals are consistent with each other, which increases the likelihood that an amendment exists — but:
- No official MoF circular or amended guideline has been captured yet
- Secondary sources may all be referencing the same unofficial announcement
- Guidex must hold the `source_signal_only` classification until an official MoF document is captured

**Status of revised deadline:** `source_signal_only` — do not publish as confirmed.

---

## Claims allowed now

These statements may appear in internal draft planning only. None may be published without owner review and a pre-publish source recheck.

1. The UAE has an official electronic invoicing programme governed by the Ministry of Finance.
2. The pilot programme starts on 1 July 2026, according to the February 2026 MoF guideline.
3. Voluntary electronic invoicing can be implemented from 1 July 2026.
4. The February 2026 MoF guideline sets out a phased rollout based on annual revenue and entity type.
5. The baseline February 2026 guideline gives 31 July 2026 as the ASP appointment deadline for businesses with annual revenue equal to or above AED 50 million — but this date may have been amended.
6. Secondary sources report a possible extension of the large-business ASP deadline to 30 October 2026; this requires official MoF confirmation before Guidex publishes it as a date.
7. Mandatory implementation for large businesses is 1 January 2027 per the February 2026 guideline — subject to recheck for amendments.
8. SME (annual revenue below AED 50 million) and government entity deadlines are later (2027) and appear less likely to have been amended at this stage.
9. Business owners should check their annual revenue category and identify whether they fall under the large-business or SME threshold.
10. The implementation process involves selecting an Accredited Service Provider (ASP), testing invoice exchange and reporting, and going live.

---

## Claims NOT allowed yet

The following statements must NOT appear in any Guidex draft, article, or calendar item until the specific source is captured and confirmed.

| Forbidden claim | Why blocked |
|---|---|
| "The ASP deadline is 30 October 2026." | Official MoF amendment not yet captured — only secondary signals |
| "The ASP deadline is 31 July 2026." | Baseline from February 2026 guideline — may have been superseded; do not state as current |
| "All UAE businesses must implement e-invoicing by 1 January 2027." | Only applies to large businesses (≥ AED 50M revenue); SMEs have a later date; governments have a later date |
| "SMEs have the same deadline as large businesses." | Incorrect per MoF guideline — SME mandatory date is 1 July 2027 |
| "Penalties for non-compliance are [amount]." | No official penalty source captured |
| "Excel is illegal / Excel is no longer allowed." | Overstated; the guideline does not frame it this way — requires careful sourcing |
| "Every invoice is covered." | Exclusions and scope limitations exist — not captured in detail yet |
| "All UAE companies must comply." | Revenue threshold and entity type determine applicability |
| Legal or tax advice of any kind | Guidex is an information resource, not a legal/tax adviser |
| Copy or close paraphrase of MoF guideline text | Not permitted — original writing required |
| Any article/calendar item with a definitive deadline date | Blocked until ASP deadline conflict resolved with official MoF source |

---

## Sources still needed

Complete this checklist before moving any related content to publish consideration.

**High priority — blocks publication of any deadline date:**

- [ ] **Official MoF amendment or updated guideline** — confirming whether the ASP appointment deadline for large businesses has been officially extended to 30 October 2026. Look for: updated MoF PDF, ministerial decision, official announcement on mof.gov.ae or uaecabinet.ae.
- [ ] **Current official MoF e-invoicing landing page** — check mof.gov.ae for a dedicated e-invoicing section with the current timeline. URL to record if found.
- [ ] **Official ASP list/register** — check mof.gov.ae for a published list of Accredited Service Providers. If available, record URL — useful for any business readiness guide.
- [ ] **EmaraTax / FTA guidance on ASP onboarding** — check tax.gov.ae or emaratax.gov.ae for any guidance on the e-invoicing registration or onboarding process.

**Medium priority — needed before expanding content scope:**

- [ ] **Ministerial Decision No. 243 of 2025** — legal basis for e-invoicing mandate. Source URL needed.
- [ ] **Ministerial Decision No. 244 of 2025** — related regulatory instrument. Source URL needed.
- [ ] **Cabinet Decision No. 106 of 2025** — reported as establishing the penalty framework. Capture URL if publicly available.
- [ ] **Peppol/PINT-AE specification** — technical standard for invoice exchange. Needed only if a technical business readiness guide is created.
- [ ] **MoF FAQ page or e-invoicing FAQ document** — if published, useful for identifying common business questions to address.

**Lower priority — enrichment only:**

- [ ] **FTA / EmaraTax business guidance** — any advisory on VAT interaction with e-invoicing
- [ ] **Free zone applicability** — does the mandate cover free zone entities? Check for MoF clarification.
- [ ] **Audit / accounting system compatibility notes** — MoF or FTA guidance on ERP/accounting system readiness, if any

---

## Calendar items planning

These items may become calendar entries once the deadline conflict is resolved and sources are confirmed.

| # | Label EN | Label RU | Date | Type | Priority | Confidence | Source | Publish status |
|---|---|---|---|---|---|---|---|---|
| A | UAE e-invoicing pilot starts | Пилотный запуск электронных инвойсов в ОАЭ | 2026-07-01 | business_deadline | 1 | official_baseline_confirmed | MoF guideline Feb 2026 | can_use_after_recheck |
| B | Voluntary e-invoicing: go live from | Добровольное внедрение: старт | 2026-07-01 | business_deadline | 2 | official_baseline_confirmed | MoF guideline Feb 2026 | can_use_after_recheck |
| C | Large business ASP appointment deadline | Срок выбора ASP (крупный бизнес) | 2026-07-31 OR 2026-10-30 | tax_deadline | 1 | conflict_requires_official_latest_source | MoF baseline + secondary signal | blocked_until_official_amendment_captured |
| D | Large business mandatory e-invoicing | Обязательное внедрение (крупный бизнес) | 2027-01-01 | business_deadline | 1 | official_baseline_confirmed_recheck_amendments | MoF guideline Feb 2026 | recheck_before_publish |
| E | SME ASP appointment deadline | Срок выбора ASP (МСБ) | 2027-03-31 | business_deadline | 1 | official_baseline_confirmed | MoF guideline Feb 2026 | future_year |
| F | SME mandatory e-invoicing | Обязательное внедрение (МСБ) | 2027-07-01 | business_deadline | 1 | official_baseline_confirmed | MoF guideline Feb 2026 | future_year |
| G | Government entities mandatory e-invoicing | Обязательное внедрение (госорганы) | 2027-10-01 | government_deadline | 1 | official_baseline_confirmed | MoF guideline Feb 2026 | future_year |

**Note on item C (large business ASP deadline):** This is the highest-priority item to resolve. Until an official MoF source confirms the current deadline date, item C must stay at `blocked`. Items A and B (pilot start / voluntary phase — both 1 July 2026) are safe to plan around as they appear in the official baseline and no amendment signals have been observed for those dates.

---

## Content opportunities

These files will be created in future phases. Do not create them now.

| File | Type | Status | Unlock condition |
|---|---|---|---|
| `docs/content-drafts/verification/uae-e-invoicing-2026-deadline-conflict.md` | Source verification pack | future | Research sprint — MoF amendment search |
| `docs/content-drafts/news/uae-e-invoicing-2026-asp-deadline-update.md` | News draft | future | Official amendment source captured |
| `docs/content-drafts/guides/uae-e-invoicing-2026-business-readiness.md` | Guide draft | future | Official ASP list + penalty source captured |
| `docs/content-drafts/calendar/uae-e-invoicing-2026-deadlines.md` | Calendar visual post | future | ASP deadline conflict resolved |
| `docs/content-drafts/guide-updates/uae-company-setup-e-invoicing-readiness.md` | Guide update | future | MoF amendment confirmed + penalty source captured |

**Duplication rule when created:**
- News draft: "what changed and what the official date is" — announcement angle
- Guide: "what businesses should prepare before rollout" — step-by-step readiness angle
- Calendar: deadline dates in visual date context — planning angle
- Guide update: adds an e-invoicing note to the existing mainland company setup guide — cross-reference angle

---

## EN/RU title ideas

### News

**EN:** UAE e-invoicing 2026: ASP deadline update and what businesses should verify

**RU:** Электронные инвойсы в ОАЭ 2026: срок выбора ASP и что бизнесу нужно проверить

### Guide

**EN:** UAE e-invoicing 2026: what companies should prepare before rollout

**RU:** Электронные инвойсы в ОАЭ 2026: что компаниям подготовить заранее

### Calendar visual post

**EN:** UAE e-invoicing 2026 deadlines

**RU:** Дедлайны по электронным инвойсам в ОАЭ 2026

---

## Guidex angle

This is not just tax news. The Guidex e-invoicing content should explain:

**Who is affected:**
- Which businesses are in scope by revenue category (≥ AED 50M, < AED 50M, government)
- Why deadline depends on which category a business falls into
- What "annual revenue" means in this context — and whether it is based on turnover, taxable supplies, or another measure (check MoF guideline)

**What business owners should understand:**
- What an ASP (Accredited Service Provider) is in plain terms — the software/platform that handles compliant e-invoice exchange
- What EmaraTax and tax registration details are needed before onboarding an ASP
- Why accounting systems, ERP integrations, and existing invoice data need to be reviewed before the rollout
- What "mandatory" means — and what "voluntary" means in the pilot phase

**What is still unresolved:**
- The ASP deadline date for large businesses (31 July vs 30 October 2026) must be clearly flagged as requiring verification
- Penalties for non-compliance are not yet sourced
- Free zone applicability is not yet confirmed

**How this connects to other Guidex content:**
- Company setup guides — new businesses should factor e-invoicing into launch planning
- VAT compliance — e-invoicing intersects with existing VAT obligations
- Accounting and bookkeeping — invoice data, ASP onboarding, ERP compatibility
- Business operations calendar — key deadlines alongside other UAE compliance dates

---

## EN/RU wording guardrails

### Approved EN phrasings

- "The UAE Ministry of Finance has published an electronic invoicing guideline." ✓
- "The pilot programme starts on 1 July 2026." ✓
- "Voluntary e-invoicing can be implemented from 1 July 2026." ✓
- "The February 2026 MoF guideline sets a deadline of [date] for businesses with annual revenue of AED 50 million or above." ✓ (with date noted as baseline — verify for amendments)
- "Secondary sources report a possible extension to 30 October 2026. Guidex is verifying against official MoF sources before publishing a confirmed date." ✓
- "Mandatory implementation for larger businesses is 1 January 2027 per the February 2026 guideline." ✓
- "Business owners should identify their revenue category, review their invoicing systems, and consult with an ASP before the deadline." ✓

### Approved RU phrasings

- "Министерство финансов ОАЭ опубликовало официальное руководство по электронным инвойсам." ✓
- "Пилотная программа стартует 1 июля 2026 года." ✓
- "Добровольное внедрение электронных инвойсов возможно с 1 июля 2026 года." ✓
- "Согласно руководству МФ ОАЭ от февраля 2026 года, крупный бизнес (выручка от AED 50 млн) должен выбрать ASP до [дата]." ✓ (с оговоркой о возможных поправках)
- "Ряд источников сообщает о переносе срока выбора ASP на 30 октября 2026 года. Guidex проверяет эту информацию по официальным источникам МФ ОАЭ." ✓
- "Обязательное внедрение для крупного бизнеса — 1 января 2027 года согласно текущему руководству." ✓
- "Владельцам бизнеса рекомендуется определить свою категорию по выручке, проверить систему выставления счетов и начать переговоры с ASP заблаговременно." ✓

### Phrasings to avoid

| Phrase | Why forbidden |
|---|---|
| "All UAE companies must be ready by January 2027." | Only large businesses; SMEs have 2027-07-01; framing is wrong |
| "The deadline is definitely October 30." | Not yet confirmed by official MoF source |
| "The deadline is 31 July 2026." | Baseline only — may be superseded; do not state as current without checking |
| "Excel is no longer allowed." | Overstated; the guideline does not use this framing |
| "Penalties are X AED." | No official penalty source captured |
| "Every business transaction is covered." | Scope exclusions exist and are not fully researched |
| "е-инвойсинг" as the only RU term | Natural Russian term is "электронные инвойсы" or "электронное выставление счетов" |
| Any long em dash in RU text | Not used in Guidex RU content |
| Legal or tax advice language | Guidex does not give legal/tax advice |

---

## Related draft files

| File | Status | Relationship |
|---|---|---|
| `docs/content-drafts/news/uae-e-invoicing-2026-asp-deadline-update.md` | future — not yet created | Primary news draft — this ledger supplies source verification |
| `docs/content-drafts/calendar/uae-e-invoicing-2026-deadlines.md` | future — not yet created | Calendar visual post — will use calendar items A, B, C, D above |
| `docs/content-drafts/guides/uae-e-invoicing-2026-business-readiness.md` | future — not yet created | Business readiness guide — requires ASP list + penalty sources |
| `docs/content-drafts/guide-updates/uae-company-setup-e-invoicing-readiness.md` | future — not yet created | Update to existing company setup guide — adds e-invoicing readiness note |
| `docs/content-drafts/verification/uae-e-invoicing-2026-deadline-conflict.md` | created 2026-05-18 | Verification file tracking the ASP deadline conflict resolution — see cross-link below |

---

## Related verification file

**Deadline conflict verification:**
`docs/content-drafts/verification/uae-e-invoicing-2026-deadline-conflict.md`

This file tracks the unresolved conflict between:
- Baseline MoF guideline (February 2026): ASP appointment deadline **31 July 2026** for large businesses
- Secondary media signals (Khaleej Times, Gulf News, professional services firms): reported extension to **30 October 2026**

All deadline-dependent content remains blocked until the official MoF amendment is captured and recorded in that file. When the conflict is resolved, update calendar item C in this ledger from `conflict_requires_official_latest_source` to `confirmed`.

---

*This is a source ledger — internal use only. Nothing in this file is published. No admin action. No DB write.*  
*Last updated: 2026-05-18 — MoF baseline source URL captured. ASP deadline conflict (31 July vs 30 October 2026) not yet resolved. All publication blocked until official MoF amendment source confirmed.*
