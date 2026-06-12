# UAE VAT Registration Threshold Source Ledger

## Ledger status

```
ledger_status:           source_ledger
publish_status:          not_for_publish_yet
content_status:          source_verification_only
risk_level:              high
source_reliability:      official
verification_required:   true
last_reviewed:           2026-05-18
owner_review_required:   true
admin_status:            not_used
ai_inbox_status:         not_used
db_status:               not_touched
```

**Important distinctions:**
- VAT mandatory threshold: AED 375,000 — not the same as Corporate Tax natural person threshold (AED 1,000,000)
- VAT is FTA-administered; Corporate Tax is also FTA-administered but a separate regime — do not conflate
- Threshold test is based on taxable supplies and imports, not total company revenue or license category
- Non-resident businesses have separate rules — do not apply resident rules to non-resident scenarios

---

## Official sources

### Source A — FTA VAT Registration Topic Page

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA guidance on UAE VAT registration requirements, thresholds, and voluntary registration |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/taxes/Vat/vat.topics/registration.for.vat.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

#### Facts captured from this source

- A business must register for VAT if taxable supplies and imports exceed the mandatory registration threshold.
- **Mandatory registration threshold: AED 375,000.**
- The threshold test applies based on:
  - taxable supplies and imports over the **previous 12 months**, OR
  - expected taxable supplies/imports in the **next 30 days**
- A business may apply for voluntary VAT registration if taxable supplies/imports or taxable **expenses** exceed the voluntary registration threshold.
- **Voluntary registration threshold: AED 187,500.**

---

### Source B — FTA VAT Registration Service Page

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA VAT registration service — requirements, who must register, non-resident rules, application window |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/services/vat.registration.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

#### Facts captured from this source

- UAE resident businesses must register if taxable supplies and imports exceed AED 375,000 over the past 12 months or are expected to exceed the threshold within the next 30 days.
- Voluntary registration may apply if taxable supplies, imports, or taxable expenses exceed AED 187,500.
- **Non-resident businesses have special rules:** non-residents may be required to register if they make taxable supplies in the UAE, unless another UAE-registered party is responsible for accounting for VAT on those supplies.
- A person required to register must submit the VAT registration application within **30 days of being required to register**.
- The service page references a penalty framework for late registration. Any penalty amount must be verified from an official penalty source before it appears in published Guidex content.

---

### Source C — FTA VAT Deregistration Service Page (optional — future topic)

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | VAT deregistration rules — threshold scenarios for deregistering |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/services/vat.deregistration.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present_optional — future_related_topic |

**Note on Source C:** Captured for future reference only. VAT deregistration is a separate topic and must not be mixed into a registration threshold article unless clearly separated. Do not use this source to support registration claims.

---

### Source D — FTA VAT return filing deadline

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA guidance on when UAE VAT returns and payments are due |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/DataFolder/Files/Pdf/4-steps-file-vat-returns.pdf |
| Access date | 2026-05-19 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes — confirm PDF is still live and deadline unchanged |

#### Facts captured from this source

- UAE VAT returns must be submitted and VAT payment made **by the 28th day of the month following the end of each Tax Period** (or the next working day if the 28th falls on a non-working day).
- Tax Period is usually one calendar quarter for most registrants; monthly periods apply in specific circumstances.
- This is not a fixed annual public date — the deadline recurs every tax period end.
- This source is relevant for: (a) business reminders in the Guidex Calendar, (b) any content explaining VAT compliance obligations after registration.

**Calendar note:** VAT return deadlines are relative, not fixed annual public dates. In the Guidex Calendar, VAT return reminders should be framed as quarterly business reminders (e.g., 28 April, 28 July, 28 October, 28 January for quarter-end filers), clearly labeled as business compliance reminders rather than public regulatory deadlines for all readers.

---

## Claims allowed now

The following claims may appear in internal draft planning only. Publishing remains blocked pending owner review and a pre-publish source recheck.

1. UAE VAT mandatory registration threshold is AED 375,000.
2. UAE VAT voluntary registration threshold is AED 187,500.
3. For UAE resident businesses, mandatory registration applies if taxable supplies and imports exceed AED 375,000 over the previous 12 months or are expected to exceed it in the next 30 days.
4. Voluntary registration can apply when taxable supplies/imports or taxable expenses exceed AED 187,500.
5. VAT registration depends on taxable supplies/imports and business facts — not simply on having a company trade license.
6. Non-resident businesses may have different VAT registration rules and should be treated separately.
7. A business required to register must submit the VAT registration application within 30 days of being required to register.
8. The mandatory VAT threshold (AED 375,000) is not the same as the Corporate Tax natural person threshold (AED 1,000,000) — these are separate obligations under separate tax regimes.
9. Both mainland and free zone companies may be subject to VAT registration requirements depending on their taxable supplies and supply scope.

---

## Claims NOT allowed yet

The following statements must NOT appear in any Guidex draft, article, or calendar item until the specific source is captured and confirmed.

| Forbidden claim | Why blocked |
|---|---|
| "All UAE companies must register for VAT." | Only when taxable supplies/imports exceed the threshold — not automatic |
| "Free zone companies are exempt from VAT." | Incorrect as a blanket statement — designation, supply type, and customer matter |
| "VAT applies only to mainland companies." | Not accurate — free zone companies can have VAT obligations depending on supply scope |
| "Income / revenue counts toward the threshold." | Threshold is based on taxable supplies and imports — not all revenue qualifies; exempt or out-of-scope supplies do not count |
| "Penalty for late registration is X AED." | No official penalty amount source captured; reference to penalties must be generic until confirmed |
| "VAT registration is required immediately after company setup." | Not accurate — registration is triggered by threshold, not license |
| "VAT registration is automatic." | Not accurate — the business must apply within 30 days of becoming required |
| "VAT threshold is AED 1,000,000." | Incorrect — that is the Corporate Tax natural person threshold; VAT mandatory threshold is AED 375,000 |
| "VAT threshold is AED 1,500,000." | Not the current threshold |
| "This is tax advice." | Guidex is an information resource — always recommend verifying with a qualified tax adviser for specific situations |
| Legal/tax advice of any kind | Out of scope for Guidex content |
| Copy or close-paraphrase of FTA text | Not permitted — original writing required |

---

## Sources still needed

Complete this checklist before any related content moves to publish consideration.

**High priority — needed before any VAT threshold article publishes:**

- [ ] **FTA VAT registration topic page rechecked** — confirm the page at Source A still shows AED 375,000 / AED 187,500 thresholds. Check for any updates since 2026-05-18.
- [ ] **FTA VAT registration service page rechecked** — confirm Source B is still current. Check for any process changes.
- [ ] **Official penalty source** — if the article mentions late registration consequences, verify the exact penalty amount from FTA or the relevant Cabinet Decision before publishing any figure.
- [ ] **Official VAT User Guide** — FTA has published detailed VAT user guides. If a step-by-step registration process guide is created, capture the relevant user guide URL and version.

**Medium priority — needed to expand content scope:**

- [ ] **FTA VAT deregistration page** — for a separate deregistration guide (Source C already captured; full content treatment deferred).
- [ ] **FTA guidance on taxable supplies and place of supply** — needed if content explains which revenue types count toward the threshold.
- [ ] **EmaraTax registration process source** — if content includes a step-by-step guide to registering on EmaraTax, verify current steps from official source.
- [ ] **Free zone VAT treatment** — FTA guidance or user guide section on free zone designated zone rules, if a free zone VAT angle is included.

**Lower priority — enrichment only:**

- [ ] **Corporate Tax natural person threshold source** — for a comparison note clarifying that AED 375,000 and AED 1,000,000 are different obligations (prevents reader confusion).
- [ ] **FTA VAT registration timeline / backlog data** — only if a practical registration experience section is included.

---

## Calendar and reminder logic

VAT registration is not a fixed annual public date — it is an event-based obligation. Calendar items are business reminders, not public holidays or regulatory deadlines that apply to all businesses on the same day.

| # | Label EN | Label RU | Date logic | Type | Priority | Confidence | Source | Publish status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| A | UAE VAT threshold review reminder | Проверьте порог VAT в ОАЭ | Monthly or quarterly business review — no fixed public date | business_reminder | 2 | official_threshold_rule | FTA Source A + B | can_use_after_recheck | Soft reminder for growing businesses; label must be clearly a reminder, not a regulatory deadline |
| B | VAT registration trigger: mandatory | Обязательная регистрация VAT: порог достигнут | When business exceeds AED 375,000 over previous 12 months or expects to in next 30 days | tax_deadline | 1 | official | FTA Source B | can_use_after_recheck | Relative/event-based — not a fixed calendar date; must be labeled as a trigger event, not a date |
| C | VAT registration: voluntary threshold | Добровольная регистрация VAT: порог AED 187,500 | When taxable supplies/imports or taxable expenses exceed AED 187,500 | business_reminder | 3 | official | FTA Source A | can_use_after_recheck | Useful for new companies and SMEs as an early planning signal |

**Note on calendar treatment:** These items are business planning reminders, not public holidays or fixed-date regulatory deadlines that can be pinned to a specific date for all readers. If added to the Guidex calendar, they must be clearly labeled as business reminders and include a note that the actual trigger date depends on individual business circumstances.

---

## Content opportunities

These files will be created in future phases. Do not create them now.

| File | Type | Status | Unlock condition |
|---|---|---|---|
| `docs/content-drafts/guides/uae-vat-registration-threshold.md` | Guide draft | future | FTA sources rechecked; penalty source captured if penalty mentioned |
| `docs/content-drafts/calendar/uae-vat-threshold-business-reminder.md` | Calendar visual post | future | Guide draft approved; reminder framing reviewed |
| `docs/content-drafts/guide-updates/uae-company-setup-vat-registration-threshold.md` | Guide update | future | FTA sources rechecked; adds VAT registration note to existing company setup guide |
| `docs/content-drafts/source-ledgers/uae-vat-deregistration-sources.md` | Source ledger | future | Separate sprint — deregistration is a distinct topic |

**Duplication rule when created:**
- Guide: explains the threshold, who it applies to, how to monitor it, when to act — step-by-step readiness
- Guide update: adds a short note to the mainland company setup guide that VAT registration is separate and threshold-based
- Calendar reminder: soft business planning reminder, not a regulatory deadline — framing is advisory

---

## EN/RU title ideas

### Guide

**EN:** VAT registration in UAE: AED 375,000 threshold explained

**RU:** Регистрация VAT в ОАЭ: порог AED 375,000 простыми словами

### Calendar reminder

**EN:** UAE VAT threshold review reminder

**RU:** Напоминание: проверьте VAT-порог в ОАЭ

### Guide update

**EN:** When should a new UAE company register for VAT?

**RU:** Когда новой компании в ОАЭ нужна регистрация VAT?

---

## Guidex angle

This is not just a tax definition page. Guidex VAT threshold content should explain:

**When a new business owner should act:**
- Why company setup alone does not trigger VAT registration
- When monitoring should start — at what revenue stage a growing business should review its taxable supply position
- Why the 30-day forward-looking test matters for fast-growing businesses

**Who is affected:**
- Mainland companies — how taxable supplies are assessed
- Free zone companies — why free zone status does not automatically mean VAT exemption; designated zone rules, nature of supply, and customer type all matter
- Non-resident businesses — brief flag that rules differ; recommend specialist advice

**Practical preparation:**
- Why accounting records and invoicing systems matter from the start
- What "taxable supplies and imports" means in plain terms (versus exempt or out-of-scope)
- Why VAT registration and Corporate Tax are different obligations — different thresholds, different timelines, different processes
- When to engage a qualified tax adviser or registered tax agent

**How this connects to other Guidex content:**
- Company setup guides — VAT is a post-setup compliance step, not part of licensing
- Banking and accounting — accurate records are needed for threshold monitoring
- E-invoicing — once registered, VAT invoices will eventually be subject to e-invoicing requirements
- Business compliance calendar — VAT registration trigger and threshold review as recurring business reminders

---

## EN/RU wording guardrails

### Approved EN phrasings

- "The mandatory UAE VAT registration threshold is AED 375,000." ✓
- "The voluntary VAT registration threshold is AED 187,500." ✓
- "A UAE resident business must register for VAT if taxable supplies and imports exceed AED 375,000 in the previous 12 months or are expected to exceed it in the next 30 days." ✓
- "Voluntary registration is available when taxable supplies, imports, or taxable expenses exceed AED 187,500." ✓
- "VAT registration is not automatic — the business must apply within 30 days of being required to register." ✓
- "The VAT threshold (AED 375,000) is separate from the Corporate Tax threshold for natural persons (AED 1,000,000)." ✓
- "For complex situations — especially free zone companies or non-resident businesses — check with a qualified tax adviser." ✓

### Approved RU phrasings

- "Обязательный порог регистрации VAT в ОАЭ составляет AED 375,000." ✓
- "Добровольная регистрация возможна при достижении порога AED 187,500 по налогооблагаемым поставкам, импорту или расходам." ✓
- "Регистрация VAT не происходит автоматически — компания должна подать заявку в течение 30 дней с момента возникновения обязательства." ✓
- "Порог VAT (AED 375,000) — это не то же самое, что порог корпоративного налога для физических лиц (AED 1,000,000). Это разные обязательства." ✓
- "Для компаний в free zone и нерезидентов правила могут отличаться — рекомендуется консультация с налоговым консультантом." ✓
- "Новому бизнесу стоит следить за объёмом налогооблагаемых поставок с самого начала работы." ✓

### Phrasings to avoid

| Phrase | Why forbidden |
|---|---|
| "Every UAE company must register for VAT." | Threshold-based — not universal |
| "Free zone companies don't need VAT." | Oversimplified and inaccurate as a blanket statement |
| "VAT registration is required immediately after company setup." | Triggered by threshold, not by licensing |
| "VAT threshold is AED 1 million." | That is the Corporate Tax natural person threshold — not VAT |
| "Penalty is X AED." | No official penalty amount captured |
| "This is tax advice." | Guidex is not a tax adviser |
| "Все компании обязаны зарегистрироваться" | Untrue and misleading |
| "бесплатные зоны освобождены от VAT" | Incorrect generalisation |
| Any long em dash in RU text | Not used in Guidex RU content |

---

## Related content bank files

| File | Relationship |
|---|---|
| `docs/content-drafts/source-ledgers/uae-e-invoicing-2026-sources.md` | E-invoicing compliance content — once registered for VAT, companies will face e-invoicing requirements |
| `docs/content-drafts/verification/uae-e-invoicing-2026-deadline-conflict.md` | E-invoicing deadline conflict — separate compliance stream, related to VAT-registered businesses |
| Future: `docs/content-drafts/source-ledgers/uae-corporate-tax-sources.md` | Corporate Tax thresholds — must be kept clearly separate from VAT threshold in all content |
| Future: `docs/content-drafts/guide-updates/uae-company-setup-vat-registration-threshold.md` | Guide update — adds VAT registration note to existing mainland company setup guide |

---

*This is a source ledger — internal use only. Nothing in this file is published. No admin action. No DB write.*  
*Last updated: 2026-05-19 (Phase 6C-22) — Source D added: FTA VAT return deadline (28th day of month following tax period end). Total: 4 sources captured (registration topic, registration service, deregistration, return deadline). Penalty source not yet captured. Free zone and non-resident treatment deferred.*
