# UAE Corporate Tax Deadline Source Ledger

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

**Critical distinctions this ledger enforces:**
- Corporate Tax filing/payment deadline and Corporate Tax registration deadline are NOT the same topic
- There is no single universal filing date — the deadline depends on each registrant's Tax Period
- Corporate Tax natural person threshold (AED 1,000,000) is NOT the same as VAT mandatory threshold (AED 375,000)
- Free zone company treatment requires its own source — do not make blanket claims
- Penalty amounts require a separate official source before any figure appears in content

---

## Official sources

### Source A — FTA: Corporate Tax returns and payment deadline (nine-month rule)

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA guidance on Corporate Tax return filing and settlement timing — nine-month rule |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/media.centre/news/federal.tax.authority.urges.submission.of.corporate.tax.returns.and.settlement.of.corporate.tax.liabilities.within.nine.months.from.the.end.of.the.tax.period.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

#### Facts captured from this source

- Taxable Persons subject to Corporate Tax obligations must submit Corporate Tax returns and settle Corporate Tax payable **within nine months from the end of the relevant Tax Period**.
- Exempt Persons required to register must submit annual declarations **within nine months from the end of their financial year**.
- The deadline is relative to each registrant's Tax Period — there is no single universal filing date that applies to every UAE business on the same day.
- FTA encourages taxpayers to verify their Tax Period and resulting deadline directly through EmaraTax.

**Derived example (for planning use — not an official stated date):**
If a company's Tax Period ends on 31 December, nine months later falls on 30 September of the following year. This is a planning example, not a universal rule — it must always be presented as an example, not as the deadline for all companies.

---

### Source B — FTA: Natural person Corporate Tax registration

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA source on Corporate Tax registration obligation for natural persons conducting business in the UAE |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/media.centre/news/fta.urges.natural.persons.to.promptly.register.for.corporate.tax.before.the.end.of.march.2025.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

#### Facts captured from this source

- A UAE resident natural person who conducts business or business activity and whose **total turnover in a Gregorian calendar year exceeds AED 1,000,000** is a Taxable Person for Corporate Tax.
- They must register for Corporate Tax **no later than 31 March of the calendar year following** the year in which turnover exceeded AED 1,000,000.
- This is a registration deadline — it is not the Corporate Tax return filing or payment deadline.
- This threshold (AED 1,000,000) must not be confused with the VAT mandatory threshold (AED 375,000). They are separate obligations under separate tax regimes.

**2026 framing note (Phase 6C-22):** Source B uses 31 March 2025 as the example date for natural persons who crossed AED 1,000,000 in the 2024 calendar year. For content published in 2026, the forward-looking frame is: natural persons who crossed AED 1,000,000 in the **2025 calendar year** must register by **31 March 2026**. Natural persons crossing the threshold in **2026** must register by **31 March 2027**. Do not use the 2025 date as a "current" example in content drafted after May 2026 — it is now a historical anchor. Use the "31 March of the following year" rule generically and give the 2026/2027 example instead.

---

### Source C — FTA: Public clarification on natural person Corporate Tax registration timelines

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA clarification on Corporate Tax registration timelines, specifically for natural persons — supports the calendar-year logic |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/media.centre/news/federal.tax.authority.issues.public.clarification.on.registration.timelines.for.taxable.persons.for.corporate.tax.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

#### Facts captured from this source

- The first possible Tax Period for a natural person is the **2024 Gregorian calendar year**.
- Natural persons who met the AED 1,000,000 threshold in 2024 had a registration deadline of **31 March 2025**.
- This source confirms the calendar-year logic and helps distinguish natural person registration rules from juridical person (company) rules.
- Useful for establishing the precedent and illustrating the registration timeline to readers without inventing examples.

**2026 framing note (Phase 6C-22):** The 31 March 2025 date in this source is a historical anchor for the first cohort of natural persons subject to Corporate Tax. For content drafted in May 2026 or later, the relevant examples are: 2025 exceedance - register by 31 March 2026 (this deadline has already passed as of May 2026); 2026 exceedance - register by 31 March 2027. The existing guide draft `uae-corporate-tax-deadline-9-month-rule.md` references "31 March 2025" — this must be updated to use the generic rule formula before publish.

---

### Source D — FTA Decision No. 3 of 2024: Corporate Tax registration timelines

| Field | Value |
|---|---|
| Authority | Federal Tax Authority (FTA) — tax.gov.ae |
| Purpose | Official FTA Decision No. 3 of 2024 defining registration timeframes for Corporate Tax Taxable Persons |
| Source type | official |
| Reliability | official |
| URL | https://tax.gov.ae/en/content/federal.tax.authority.decision.no.3.of.2024.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

#### Facts captured from this source

- FTA Decision No. 3 of 2024 establishes formal timeframes for registration of Taxable Persons for Corporate Tax.
- Registration deadlines defined in this decision are separate from Corporate Tax return filing and payment deadlines.
- This source is the legal instrument underlying the registration timeline rules — useful as a legal reference in content, not as the primary reader-facing explanation.

---

## Claims allowed now

The following claims may appear in internal draft planning only. Publishing remains blocked pending owner review and a pre-publish source recheck.

1. UAE Corporate Tax return filing and payment are generally due within nine months from the end of the relevant Tax Period.
2. There is no single universal Corporate Tax filing date that applies to every UAE business on the same day — the deadline depends on each company's Tax Period.
3. For a company whose Tax Period ends on 31 December, the nine-month rule points to a 30 September deadline in the following year — this is a planning example, not a universal rule.
4. Taxable Persons should verify their specific Tax Period and deadline through EmaraTax.
5. Exempt Persons required to register must submit annual declarations within nine months from the end of their financial year.
6. UAE resident natural persons who conduct business activity and whose total turnover exceeds AED 1,000,000 in a Gregorian calendar year may be Taxable Persons for Corporate Tax.
7. Natural persons who crossed the AED 1,000,000 threshold must register for Corporate Tax no later than 31 March of the following calendar year.
8. Corporate Tax registration deadlines and Corporate Tax filing/payment deadlines are distinct obligations — do not conflate them.
9. The Corporate Tax natural person threshold (AED 1,000,000) is separate from and higher than the VAT mandatory threshold (AED 375,000).
10. Business owners should check their Tax Period and keep accurate accounting records from the start of their first Tax Period.

---

## Claims NOT allowed yet

The following statements must NOT appear in any Guidex draft, article, or calendar item until the specific source is captured and confirmed.

| Forbidden claim | Why blocked |
|---|---|
| "All UAE companies file by 30 September." | Deadline is relative to each company's Tax Period — 30 September only applies if Tax Period ends 31 December |
| "All UAE companies have the same Corporate Tax deadline." | Incorrect — depends on Tax Period |
| "Every company pays Corporate Tax." | Only Taxable Persons — exempt persons and Qualifying Free Zone Persons have different treatment |
| "Every UAE business must register for Corporate Tax immediately." | Registration timing depends on category and circumstances — does not apply universally |
| "Corporate Tax filing deadline and registration deadline are the same." | They are distinct obligations with different timeframes |
| "Corporate Tax threshold is AED 375,000." | That is the VAT threshold; Corporate Tax natural person threshold is AED 1,000,000 |
| "VAT and Corporate Tax thresholds are the same." | They are different obligations with different amounts |
| "Free zone companies are automatically exempt from Corporate Tax." | Incorrect as blanket statement — Qualifying Free Zone Person treatment requires specific source |
| "Qualifying Free Zone Persons have no filing obligations." | Incorrect — they may still need to file; do not state without official source |
| "Penalty for late filing is X AED." | No official penalty amount source captured |
| Legal or tax advice of any kind | Guidex is an information resource, not a tax adviser |
| Copy or close-paraphrase of FTA text | Not permitted — original writing required |
| Any article/calendar item with a universal deadline date for all companies | Blocked — deadline is company-specific |

---

## Sources still needed

Complete this checklist before any related content moves to publish consideration.

**High priority — needed before any Corporate Tax filing/payment article publishes:**

- [ ] **Source A rechecked** — confirm the nine-month rule page at the captured URL is still current before publishing any deadline content.
- [ ] **FTA EmaraTax Corporate Tax filing process source** — if content includes a step-by-step guide to filing on EmaraTax, verify current steps from official source.
- [ ] **Official penalty source** — if article mentions late filing or late payment consequences, capture the exact penalty framework from FTA or the relevant Cabinet Decision before publishing any figure.
- [ ] **Corporate Tax legislation or Tax Period definition source** — if a deeper guide explains what a Tax Period is and how it is set, the legal definition needs an official source (Federal Decree-Law No. 47 of 2022 or FTA guidance).

**Medium priority — needed to expand content scope:**

- [ ] **Qualifying Free Zone Person source** — if free zone companies are mentioned, capture the FTA guidance on Qualifying Free Zone Person conditions, filing obligations, and limitations.
- [ ] **Source B rechecked** — confirm natural person registration page is still current.
- [ ] **Source C rechecked** — confirm public clarification page is still current.
- [ ] **Source D rechecked** — confirm FTA Decision No. 3 of 2024 page is still accessible and the content is unchanged.
- [ ] **Ministry of Finance Corporate Tax overview page** — if legal background is included, capture the MoF overview URL for context.

**Lower priority — enrichment only:**

- [ ] **FTA Corporate Tax FAQ or user guide** — if detailed process explanation is included.
- [ ] **Accounting period alignment guidance** — if content explains how a company sets its first Tax Period.
- [ ] **FTA EmaraTax portal overview** — for a practical "where to check" note.

---

## Calendar and reminder logic

Corporate Tax filing/payment is relative to each company's Tax Period. There is no single public date that applies to all UAE businesses simultaneously. Calendar items should be framed as business reminders tied to a company's own timeline.

| # | Label EN | Label RU | Date logic | Type | Priority | Confidence | Source | Publish status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| A | Corporate Tax return: check your deadline | Corporate Tax: проверьте срок подачи декларации | Nine months after end of company's Tax Period — relative, not fixed | tax_deadline | 1 | official | FTA Source A | can_use_after_recheck | Must be labeled as company-specific reminder. Not a fixed date for all readers. |
| B | Corporate Tax example: December year-end | Пример: срок 30 сентября для компаний с отчётным годом до 31 декабря | 30 September following year — only if Tax Period ends 31 December | tax_deadline_example | 2 | derived_from_official_nine_month_rule | FTA Source A + calendar logic | can_use_as_example_with_clear_wording | Label must say "example" — not universal. Presented as a worked illustration. |
| C | Natural person Corporate Tax registration | Регистрация Corporate Tax для физических лиц | 31 March following the year AED 1M threshold crossed — registration deadline, not filing | business_reminder / tax_registration | 2 | official | FTA Source B + Source C | can_use_after_recheck | Applies only to natural persons conducting business — not to companies |
| D | Annual Tax Period review | Ежегодная проверка налогового периода и сроков | Annual business review — no fixed date | business_reminder | 3 | editorial_planning | Guidex planning + FTA rule | soft_reminder_only | Useful in Dubai Calendar as a general business planning prompt |

**Calendar framing note:** Items A and B are best presented together — A as the rule, B as the worked example. The calendar UI label for item B must make clear it is an example for companies with a December year-end, not the deadline for every reader.

---

## Content opportunities

These files will be created in future phases. Do not create them now.

| File | Type | Status | Unlock condition |
|---|---|---|---|
| `docs/content-drafts/guides/uae-corporate-tax-deadline-9-month-rule.md` | Guide draft | future | FTA sources rechecked; Tax Period definition source captured |
| `docs/content-drafts/calendar/uae-corporate-tax-deadline-reminder.md` | Calendar visual post | future | Guide draft approved; reminder framing reviewed |
| `docs/content-drafts/guide-updates/uae-company-setup-corporate-tax-deadline.md` | Guide update | future | FTA sources rechecked; adds Corporate Tax deadline note to company setup guide |
| `docs/content-drafts/guides/uae-corporate-tax-natural-person-registration.md` | Guide draft | future | Sources B + C rechecked; penalty source captured if mentioned |
| `docs/content-drafts/verification/uae-corporate-tax-penalty-sources.md` | Verification file | future | Only if penalty amounts are needed for a specific article |

**Duplication rule when created:**
- Main guide (9-month rule): explains the rule, the Tax Period dependency, the December year-end example, what business owners should do
- Natural person guide: separate article — freelancers, sole traders, individuals crossing AED 1M — distinct audience and rules
- Guide update: short note in the company setup guide flagging Corporate Tax deadline logic as a post-setup step
- Calendar: business reminder framing — advisory, not regulatory public deadline

---

## EN/RU title ideas

### Main guide (9-month rule)

**EN:** UAE Corporate Tax deadline: the 9-month filing rule explained

**RU:** Срок Corporate Tax в ОАЭ: правило 9 месяцев простыми словами

### Calendar reminder

**EN:** Corporate Tax deadline reminder for UAE businesses

**RU:** Напоминание о сроках Corporate Tax для бизнеса в ОАЭ

### Natural person guide

**EN:** Corporate Tax for freelancers and natural persons in UAE

**RU:** Corporate Tax для фрилансеров и физических лиц в ОАЭ

### Guide update (company setup cross-reference)

**EN:** What new UAE companies should know about Corporate Tax deadlines

**RU:** Что новой компании в ОАЭ нужно знать о сроках Corporate Tax

---

## Guidex angle

This is not just a tax news summary. Guidex Corporate Tax deadline content should explain:

**Why business owners cannot rely on one generic date:**
- The nine-month rule is relative — the filing deadline depends on when the company's Tax Period ends
- A company that started trading in January 2024 with a December year-end has a different effective deadline than one with a March or June year-end
- Business owners who assume one public date applies to everyone may miss their own deadline

**How the Tax Period works in practice:**
- What determines a company's Tax Period (first period, accounting year alignment)
- Why it matters to know the Tax Period from the start
- Why the December year-end example (30 September) is a useful anchor but not a universal rule

**The registration vs filing distinction:**
- Corporate Tax registration deadlines (FTA Decision No. 3 of 2024) are separate from filing and payment deadlines
- Business owners who confuse "I registered" with "I filed" risk missing the return and payment obligation

**Why VAT and Corporate Tax are different:**
- Different thresholds (AED 375,000 vs AED 1,000,000 for natural persons)
- Different administering frameworks within FTA
- Different registration triggers, filing frequencies, and processes
- Different applicability to free zone companies

**What business owners should prepare:**
- Accurate accounting records from the start of the first Tax Period
- A clear record of the Tax Period start and end date
- Financial statements ready before the nine-month window closes
- An accountant or registered tax agent engaged early enough to prepare the return

**How this connects to other Guidex content:**
- Company setup guides — Corporate Tax is a post-setup ongoing obligation
- VAT registration — often a parallel obligation for larger businesses
- E-invoicing — will apply to VAT-registered businesses and may intersect with Corporate Tax compliance
- Business compliance calendar — filing/payment reminder alongside other UAE tax dates

---

## EN/RU wording guardrails

### Approved EN phrasings

- "Corporate Tax returns and payment are generally due within nine months from the end of the relevant Tax Period." ✓
- "The deadline depends on the company's Tax Period — there is no single date that applies to all UAE businesses." ✓
- "For a company with a Tax Period ending on 31 December, the nine-month rule points to a 30 September deadline in the following year. This is an example, not a universal rule." ✓
- "Taxpayers should verify their Tax Period and deadline through EmaraTax." ✓
- "UAE resident natural persons conducting business with annual turnover above AED 1,000,000 may be required to register for Corporate Tax by 31 March of the following year." ✓
- "Corporate Tax registration and Corporate Tax return filing are different obligations with different timelines." ✓
- "The Corporate Tax threshold for natural persons (AED 1,000,000) is separate from the VAT mandatory registration threshold (AED 375,000)." ✓
- "For specific circumstances, confirm with a qualified tax adviser or registered tax agent." ✓

### Approved RU phrasings

- "Декларация и оплата Corporate Tax, как правило, подаются в течение девяти месяцев после окончания соответствующего налогового периода." ✓
- "Срок подачи зависит от налогового периода компании. Единой даты для всех компаний ОАЭ не существует." ✓
- "Например, если налоговый период компании заканчивается 31 декабря, правило девяти месяцев указывает на срок 30 сентября следующего года. Это пример, а не универсальное правило." ✓
- "Рекомендуется уточнить свой налоговый период и срок подачи через EmaraTax." ✓
- "Физические лица-резиденты ОАЭ, ведущие бизнес с годовым оборотом выше AED 1,000,000, могут быть обязаны зарегистрироваться по Corporate Tax до 31 марта следующего года." ✓
- "Регистрация по Corporate Tax и подача налоговой декларации — это разные обязательства с разными сроками." ✓
- "Порог Corporate Tax для физических лиц (AED 1,000,000) не совпадает с порогом обязательной регистрации VAT (AED 375,000)." ✓

### Phrasings to avoid

| Phrase | Why forbidden |
|---|---|
| "All UAE companies file by 30 September." | Only true for December year-end companies — not universal |
| "Corporate Tax deadline is the same for every business." | Incorrect — depends on Tax Period |
| "Free zone companies do not need to file." | Incorrect as blanket statement |
| "Corporate Tax threshold is AED 375,000." | That is the VAT threshold — not Corporate Tax |
| "VAT and Corporate Tax thresholds are the same." | They are different obligations with different amounts |
| "Penalty is X AED." | No official penalty amount captured |
| "This is tax advice." | Guidex is not a tax adviser |
| "Все компании обязаны подать до 30 сентября." | Incorrect — applies only to December year-end companies |
| "Порог Corporate Tax — AED 375,000." | Неверно — это порог VAT |
| Any long em dash in RU text | Not used in Guidex RU content |

---

## Related content bank files

| File | Relationship |
|---|---|
| `docs/content-drafts/source-ledgers/uae-vat-registration-threshold-sources.md` | VAT threshold — separate obligation, separate threshold (AED 375,000); must be distinguished clearly in any content that mentions both |
| `docs/content-drafts/source-ledgers/uae-e-invoicing-2026-sources.md` | E-invoicing — applies to VAT-registered businesses; intersects with Corporate Tax compliance via common business readiness themes |
| `docs/content-drafts/verification/uae-e-invoicing-2026-deadline-conflict.md` | E-invoicing deadline conflict tracking — related business compliance stream |
| Future: `docs/content-drafts/guide-updates/uae-company-setup-corporate-tax-deadline.md` | Guide update adding Corporate Tax deadline note to existing company setup guide |
| Future: `docs/content-drafts/guides/uae-vat-registration-threshold.md` | VAT registration guide — companion compliance topic, distinct from Corporate Tax |
| Future: `docs/content-drafts/guides/uae-accounting-records-readiness.md` | Accounting records guide — practical preparation layer for both VAT and Corporate Tax compliance |

---

*This is a source ledger — internal use only. Nothing in this file is published. No admin action. No DB write.*  
*Last updated: 2026-05-19 (Phase 6C-22) — four official FTA sources remain valid. 2026 framing notes added to Sources B and C: the "31 March 2025" historical anchor must not be used as a current example in content drafted after May 2026. Forward-looking claims should use the generic rule (31 March of the following year) with 2026/2027 as the working example. Penalty source not yet captured. Qualifying Free Zone Person treatment deferred. All content publishing blocked pending owner review.*
