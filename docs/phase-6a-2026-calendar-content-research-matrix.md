# Phase 6A — 2026 Calendar & Content Research Matrix

**Document type:** Content planning, research architecture, launch readiness system  
**Status:** Internal planning — not approved for publishing  
**Created:** 2026-05-18  
**Author:** Internal — Guidex content strategy  
**Phase:** 6A — Content Research Foundation  

---

> **Hard rule — read before acting**
>
> This document is internal planning only. No text, no dates, no claims from this document go live on the public site without:
> - official source verification
> - editorial review
> - explicit owner publish approval
>
> Do not invent confirmed dates. Do not copy or paraphrase external PDFs.  
> Do not publish any Islamic holiday date without UAE official moon-sighting confirmation.  
> Do not publish any compliance claim without a linked official government source.

---

## 1. Phase Purpose and Launch Rule

### Why this phase exists

The Dubai Calendar is now live locally as a prototype. The homepage and RU homepage are redesigned around it. Detail pages promote the calendar. Deep links work. Save-to-phone UX exists.

**The system is ready. The content is not.**

Publishing the redesigned homepage/calendar system without real content will:
- serve an empty or demo-data calendar to real users
- produce thin pages that harm search rankings
- create false expectations if dates are wrong or unverified
- expose Guidex to reputational risk on compliance topics

Phase 6A establishes the research system, content matrix, and editorial standards that must be in place before any public launch.

### Hard launch gate

The new homepage and calendar system must NOT be pushed, deployed, or published until ALL of the following are true:

- [ ] EN and RU homepage visually approved by owner on production preview
- [ ] Calendar UI approved — grid, agenda, filters, picker all tested on real mobile device
- [ ] Calendar content model finalised — category types, priorities, confidence values stable
- [ ] First real 2026 research matrix is prepared (this document, filled)
- [ ] First wave of draft content exists — minimum 10 real calendar items, 3 news posts, 3 events
- [ ] Source verification status tracked per item — no item marked "confirmed" without an official URL recorded
- [ ] High-risk legal/tax/compliance claims have official UAE government source attached
- [ ] No English fallback appears on any RU public route
- [ ] Build passes clean — 0 TypeScript errors, 86+/86 pages, all QA scripts green
- [ ] Owner gives explicit written approval to push/deploy/publish

---

## 2. Calendar Content Priority Model

Priority determines which content gets researched, drafted, and published first.

### Priority 1 — Must have before launch

These are the minimum viable content items. Without them the calendar is not useful.

- UAE official public holidays 2026 (confirmed government sources only)
- Ramadan period and Eid dates — marked `subject_to_official_confirmation` until UAE moon-sighting announcement
- Hard government/compliance/tax deadlines with official source confirmed
- Major official UAE government announcements with date impact
- Visa/company deadlines that directly affect Guidex's core audience (residents, business owners)

### Priority 2 — Include in first content wave

- Major Dubai/UAE events with confirmed dates (GITEX, Cityscape, ATM, etc.)
- Real estate and investment events
- Business exhibitions and conferences
- School/family planning dates (KHDA academic calendar)
- Important news updates with date-based impact

### Priority 3 — Later content waves

- Lifestyle and entertainment events
- Soft planning reminders and evergreen notes
- Guide update triggers with calendar connection
- Lower-urgency relocation and family planning content

**Rule:** The calendar must first become the most reliable source for important dates. Not a random events list.

---

## 3. Source Reliability Model

Every content item must have a source type assigned before it is saved to the DB.

### Source types

| Type | Code | Description | Sufficient alone? |
|---|---|---|---|
| Official government source | `official` | UAE Cabinet, Dubai Government, FTA, ICP, GDRFA, DLD, KHDA, DHA, MOHRE, Emirates Media Council, official event organizers | Yes for factual/date claims |
| Government legislation | `government` | Federal Decree-Law, Cabinet Decision, Ministerial Decision text | Yes — add decree reference |
| Trusted media | `media` | Khaleej Times, Gulf News, The National, Reuters, AP | Signal only — not sufficient for compliance claims |
| Official event organizer | `organizer` | DWTC, GITEX official site, Cityscape official site, etc. | Yes for event dates |
| Partner PDF / uploaded document | `pdf_partner` | Owner-supplied PDF, white-label compliance calendar, advisory firm publication | Signal/source map only — verify officially |
| Social/Telegram signal | `social_signal` | UAE community channels, Telegram groups, X/Twitter | Lead only — never final authority |
| Owner / internal editorial note | `internal` | Owner instruction, known-to-be-true operational fact | Editorial lead — verify if high-risk |

### Source reliability matrix for content decisions

| Topic class | Minimum source required | Notes |
|---|---|---|
| Islamic holiday dates | Official UAE Cabinet/Dubai Government moon-sighting announcement | Never publish a specific date without official UAE confirmation |
| Public holidays (non-Islamic) | UAE Government Portal or official gazette | New Year / National Day / Commemoration Day are fixed and safe |
| Tax/compliance deadlines | FTA, Ministry of Finance, Federal Decree-Law | Any specific penalty or deadline amount needs official URL |
| Visa rules | ICP or GDRFA official portal | Rules vary by visa type and emirate |
| Company/license rules | DED, relevant free zone authority | Each free zone has its own rules |
| Events (conferences, exhibitions) | Official organizer website | Dates from media are acceptable signals but verify on organizer site |
| School dates | KHDA official academic calendar | Do not use media reports alone |
| Real estate events | Official organizer or DLD/RERA | |
| General planning reminders | Internal editorial — lower risk | Can be published with disclaimer |

---

## 4. Research Workflow

### Step-by-step research process

1. **Identify the topic** from this matrix or owner instruction
2. **Classify priority** (1/2/3) and content type (news/event/calendar/guide)
3. **Find the official source first** — do not start from media
4. **Record source URL, page title, and access date** in the item's source_url field
5. **Classify date confidence**: `confirmed` / `expected` / `subject_to_official_confirmation` / `source_signal_only`
6. **Draft EN title and summary** — facts first, no filler
7. **Draft RU title and summary** — natural Russian, not literal translation
8. **Create admin draft** — status=draft, ru_published=0, robots noindex
9. **Owner review** — editorial check before any publish decision
10. **Publish only after** — all high-risk claims verified, owner approves

### Date confidence values (must be assigned to every calendar item)

| Value | Meaning | Visible UI treatment |
|---|---|---|
| `confirmed` | Official UAE government source confirms the specific date | Show date plainly |
| `expected` | Date estimated from prior-year pattern — no official announcement yet | Show with "(expected)" label |
| `subject_to_official_confirmation` | Date depends on UAE moon-sighting or ministerial decision | Show amber notice: depends on official announcement |
| `source_signal_only` | Date from media/PDF only — not yet verified officially | Internal only — do not show on public calendar |

---

## 5. 2026 Research Source Checklist

Research must start from official sources. This checklist tracks what needs to be opened and verified.

### Official / general

- [ ] UAE Government Portal — uae.gov.ae — public holidays 2026 official list
- [ ] UAE Cabinet — uaecabinet.ae — official decrees and announcements
- [ ] Dubai Media Office — mediaoffice.ae — major Dubai announcements
- [ ] Dubai Government — dubai.ae — emirate-specific dates and services
- [ ] UAE National Emergency Crisis and Disaster Management Authority — ncema.gov.ae (if relevant for any seasonal events)

### Tax / business / compliance

- [ ] Federal Tax Authority — tax.gov.ae
  - [ ] Corporate Tax section — filing deadlines, registration requirements
  - [ ] VAT section — registration threshold, return schedule, deregistration
  - [ ] Excise Tax section — registration triggers
  - [ ] E-invoicing / Fatoora section — phase dates, ASP requirements
- [ ] Ministry of Finance — mof.gov.ae
  - [ ] E-invoicing announcements and implementation timeline
  - [ ] CT and VAT policy updates
- [ ] Ministry of Economy (MOEI) — moec.gov.ae
  - [ ] AML/DNFBP compliance requirements
  - [ ] goAML registration and annual reporting
- [ ] Emirates Media Council — emc.gov.ae
  - [ ] Media permit requirements for sponsored content

### Company / licensing / labor

- [ ] DED Dubai — ded.gov.ae — trade license renewal rules
- [ ] MOHRE — mohre.gov.ae — labor file, establishment card, ILOE confirmation
- [ ] iloe.ae — ILOE registration, penalty confirmation
- [ ] Individual free zone portals — DMCC, ADGM, DIFC, JAFZA, IFZA, Meydan, etc.
  - [ ] Audit submission deadlines for each zone
  - [ ] License renewal rules per zone

### Identity / visa / residency

- [ ] ICP — icp.gov.ae — residency visa, Emirates ID, Golden Visa, Digital Nomad Visa rules
- [ ] GDRFA Dubai — gdrfad.gov.ae — visa rules specific to Dubai
- [ ] DHA — dha.gov.ae — medical insurance requirements (Dubai)

### Dubai life / residents

- [ ] KHDA — khda.gov.ae — 2026–2027 school academic calendar
- [ ] DLD — dubailand.gov.ae or dup.ae — property registration, Ejari
- [ ] RERA — rpdubai.gov.ae — real estate regulation updates
- [ ] Dubai REST — dubairest.ae — Ejari and real estate services
- [ ] DEWA — dewa.gov.ae — utilities relevant to move-in reminders

### Events

- [ ] Dubai World Trade Centre — dwtc.com — 2026 event calendar
- [ ] GITEX Global — gitex.com — GITEX 2026 dates
- [ ] Cityscape Global — cityscape.ae — Cityscape 2026 dates
- [ ] Arabian Travel Market — arabiantravelmarket.com — ATM 2026 dates (usually May)
- [ ] Dubai Airshow — dubaiairshow.aero — check if 2026 or 2027 (biennial)
- [ ] Dubai Food Festival — dubaifoodfestival.com — 2026/2027 dates
- [ ] Dubai Shopping Festival — mydsf.ae — 2026/2027 dates
- [ ] Dubai Opera — dubaiopera.com — 2026 season schedule
- [ ] Expo City Dubai — expocitydubai.com — ongoing events

---

## 6. Content Type Decision Rules

When a researched item is ready to be created, apply these rules to determine its content type.

### A. News post

Create a news post when:
- There is a new or updated official announcement
- A rule, threshold, or policy has changed
- A public holiday date is officially confirmed for the first time
- A deadline has been extended, reduced, or modified
- A major government service change affects residents or companies

Do NOT create news for: describing existing rules as if they are new, repackaging evergreen guide content, summarizing a PDF.

### B. Event

Create an event when:
- There is a dated occasion with a specific start date (and optional end date)
- It has a confirmed organizer or authority
- Users might plan around it, attend, or register
- An external link to a ticket/registration page may exist

Do NOT create an event for: rolling compliance obligations without a fixed date, general reminders, evergreen planning notes.

### C. Calendar visual post

Create a calendar visual post when:
- A date or period is useful for planning but does not need a full event page
- The item is a recurring annual reminder without a single organizing body
- The item is a rolling compliance obligation (license renewal, visa check)
- The content clusters multiple related dates into one monthly/quarterly view

### D. Guide update

Create a guide update (not a new page) when:
- An existing Guidex guide has a new fee, new step, or changed process
- A compliance change affects the steps in an existing guide
- A deadline mentioned in a guide has changed

### E. New guide

Create a new guide when:
- The topic is evergreen (useful beyond a specific date)
- The search query is specific and recurring
- Users need step-by-step instructions
- The topic is not covered by any existing Guidex guide

### F. Dubai Life Setup update

Create a Dubai Life Setup update when:
- The item affects first 30 days in Dubai, relocation, family arrival, school setup, or home setup
- It has a date-relevant trigger (school year starts, summer move-in peak season, etc.)

### G. Discard / hold

Hold an item when:
- Source is media-only for a compliance claim
- Date is uncertain and not helpful without official confirmation
- Topic is not relevant to Guidex's core audience
- The item duplicates an existing guide or event without adding new information

---

## 7. Calendar Item Fields (Planning Model)

DB changes are NOT part of this phase. This defines the data shape for planning purposes — to be reviewed before any schema change is proposed.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Auto-increment primary key |
| `content_type` | text | "news", "event", "calendar_visual_post", "guide_update" |
| `source_content_id` | integer | FK to news_posts.id / events.id etc. if linked |
| `slug` | text | Unique per locale |
| `title_en` | text | EN display title |
| `title_ru` | text | RU display title — natural Russian |
| `short_label_en` | text | Short calendar chip label in EN (e.g. "Eid Al Fitr") |
| `short_label_ru` | text | Short calendar chip label in RU |
| `summary_en` | text | 1–2 sentences — meta description quality |
| `summary_ru` | text | 1–2 sentences in natural Russian |
| `body_en` | text | Full article body (newline-delimited paragraphs) |
| `body_ru` | text | Full RU body |
| `date_start` | text | ISO date "YYYY-MM-DD" |
| `date_end` | text | ISO date if multi-day; null if single day |
| `month` | integer | 1–12, for calendar month indexing |
| `year` | integer | Calendar year |
| `category_type` | text | "holiday", "event", "business_event", "government_deadline", "tax_deadline", "aml_deadline", "real_estate_event", "relocation", "family_school", "news_update", "guide_update", "calendar_visual_post" |
| `priority` | integer | 1/2/3 (matches priority model above) |
| `date_confidence` | text | "confirmed", "expected", "subject_to_official_confirmation", "source_signal_only" |
| `source_url` | text | Official source URL |
| `source_label` | text | "official", "government", "media", "organizer", "pdf_partner", "internal" |
| `source_reliability` | text | Same as source_label — for editorial filtering |
| `verification_required` | integer | 0/1 — 1 means must be checked before publish |
| `last_verified_date` | text | ISO date of last source check |
| `detail_url_en` | text | EN detail page URL if one exists |
| `detail_url_ru` | text | RU detail page URL if one exists |
| `external_url` | text | Ticket/registration/source external link |
| `external_cta_en` | text | External CTA label EN (e.g. "Buy tickets") |
| `external_cta_ru` | text | External CTA label RU |
| `is_external` | integer | 0/1 — 1 means item links out, not to detail page |
| `has_islamic_dates` | integer | 0/1 — 1 triggers moon-sighting notice on detail page |
| `status` | text | "draft", "review", "published" |
| `ru_published` | integer | 0/1 — 1 only when RU content is complete and verified |
| `seo_title_en` | text | Override for `<title>` tag EN |
| `seo_title_ru` | text | Override for `<title>` tag RU |
| `meta_description_en` | text | Meta description EN |
| `meta_description_ru` | text | Meta description RU |
| `calendar_notes` | text | Internal editorial notes — not published |

**Future fields to consider (not yet in schema):**

For guides: `calendar_relevant` (0/1), `calendar_month`, `calendar_category` — would enable CalendarContextCta on guide pages without hardcoding.

---

## 8. EN/RU Draft Package Requirements

Every content item submitted for creation must include all of the following. Incomplete items go back to draft.

### Required fields for every draft

```
content_type:           [news|event|calendar_visual_post|guide]
slug:                   [url-safe, unique]
status:                 draft
ru_published:           0
title_en:               [specific, searchable, no "Ultimate Guide" framing]
title_ru:               [natural Russian — not literal translation]
summary_en:             [1–2 sentences, meta description quality, under 155 chars]
summary_ru:             [1–2 sentences, natural Russian]
body_en:                [full body — paragraphs separated by double newline]
body_ru:                [full RU body — must be independently readable]
seo_title_en:           [H1-quality title for search]
seo_title_ru:           [H1-quality RU title for search]
meta_description_en:    [under 155 chars]
meta_description_ru:    [under 155 chars]
source_url:             [official source URL]
source_label:           [official|government|media|organizer|internal]
source_reliability:     [official|trusted|signal_only]
verification_required:  [0|1]
last_verified_date:     [YYYY-MM-DD]
date_start:             [YYYY-MM-DD or null]
date_end:               [YYYY-MM-DD or null]
date_confidence:        [confirmed|expected|subject_to_official_confirmation]
category_type:          [from fixed list above]
priority:               [1|2|3]
has_islamic_dates:      [0|1]
is_external:            [0|1]
external_url:           [if is_external=1]
external_cta_en:        [if is_external=1]
external_cta_ru:        [if is_external=1]
```

### RU quality rules

- RU body must be independently readable — not a literal translation
- Natural Russian sentence structure — not "calque" from English
- Intentional English allowed: Guidex, WhatsApp, GITEX, Dubai Opera, AED, FTA, DLD, MOHRE, ICP, GDRFA, DTCM, DMCC, DIFC, ADGM, KHDA, DHA, DEWA
- Everything else must be Russian
- No awkward translit — use established Russian terms for common concepts
- No long em dashes in visible body text — use colon, comma, or period

### Body structure every article must follow

1. **Who it affects** — 1 sentence: exact audience (e.g. "Mainland companies with a financial year ending December 31")
2. **Key dates** — specific dates or date ranges with confidence label
3. **What to do** — concrete steps, not vague guidance
4. **Source note** — "Based on [Authority], [Document/Page], verified [date]"
5. **Related Guidex links** — 1–3 internal links to related guides or calendar pages

---

## 9. Topic Clusters for 2026

The 2026 calendar is organized into these research clusters. Each cluster has its own research lead, source checklist, and batch assignment.

| Cluster | Research focus | Content types | Batch |
|---|---|---|---|
| UAE Public Holidays | Official UAE government holiday list, Islamic holiday announcements | Calendar items, Events | 1 |
| Ramadan/Eid System | UAE moon-sighting, working hours, date ranges | Calendar visual posts, Events | 1 |
| Business Compliance | Tax, VAT, AML, e-invoicing, audit — see PDF breakdown below | Events, Calendar items, Guides | 2 |
| Visa/Residency | Renewal windows, Emirates ID, ICP announcements | Calendar items, Guides | 2 |
| Company Operations | License renewal, establishment card, labor file, Ejari | Calendar items, Guides | 2 |
| Dubai Major Events | GITEX, Cityscape, ATM, Dubai Airshow, exhibitions | Events | 3 |
| Real Estate | DLD announcements, RERA, Cityscape, market updates | Events, News | 3 |
| Family/School | KHDA academic calendar, admissions, summer | Calendar items | 4 |
| Relocation/First 30 Days | Move-in peak, summer arrivals, setup reminders | Calendar items | 4 |
| Guide Updates | Existing guides needing date/compliance refresh | Guide updates | 5 |

---

## 10. Uploaded PDF Breakdown — Content Opportunities

**Source document used:** "UAE Business Compliance Calendar 2026" (competitor/partner PDF)  
**Treatment:** Source map only — no text, structure, or headings copied  
**Cross-reference:** See also `docs/content-brief-uae-business-compliance-calendar-2026-2027.md` for full analysis

For each topic below: draft status = `not_started`. All verification = required before publish.

---

### Corporate Tax cluster

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| How to Register for Corporate Tax in the UAE | Как зарегистрироваться в системе корпоративного налога ОАЭ | Guide | corporate tax registration UAE | корпоративный налог ОАЭ регистрация | Calendar item: rolling (3 months from incorporation) | FTA tax.gov.ae | High | 1 |
| UAE Corporate Tax Return: When and How to File | Корпоративный налог ОАЭ: сроки подачи декларации | Guide + Event | UAE corporate tax return deadline | декларация корпоративного налога ОАЭ | Event: 9 months after FY end | FTA tax.gov.ae | High | 1 |
| UAE Corporate Tax Payment: Timing by Financial Year | Оплата корпоративного налога ОАЭ: расчёт по финансовому году | Guide | UAE corporate tax payment deadline | срок уплаты корпоративного налога ОАЭ | Calendar item: by FY end | FTA | High | 1 |
| FTA Portal Profile Update: What to Check After Renewal | Обновление профиля на портале FTA после продления лицензии | Guide | FTA portal update UAE | обновление профиля FTA | Calendar reminder: rolling | FTA (20-day rule) | Medium | 2 |
| UAE Corporate Tax Deregistration: Who Qualifies and How | Дерегистрация по корпоративному налогу ОАЭ | Guide | corporate tax deregistration UAE | дерегистрация корпоративный налог | Calendar item: triggered | FTA | High | 2 |

---

### VAT cluster

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| UAE VAT Registration: When the AED 375,000 Threshold Applies | Регистрация НДС в ОАЭ: порог AED 375,000 | Guide | VAT registration UAE threshold | НДС ОАЭ регистрация порог | Calendar: rolling (threshold triggered) | FTA | High | 1 |
| UAE VAT Deregistration: Process and Timing | Дерегистрация НДС в ОАЭ: процедура и сроки | Guide | VAT deregistration UAE | дерегистрация НДС ОАЭ | Calendar: rolling | FTA | High | 2 |
| UAE VAT Returns: Deadlines for Monthly, Quarterly, and Annual Filers | Декларации НДС в ОАЭ: сроки подачи | Calendar visual post | UAE VAT return deadline | декларация НДС ОАЭ сроки | Event/Calendar: quarterly rolling | FTA | High | 1 |
| UAE VAT Compliance Checklist for Small Businesses | Чеклист по НДС для малого бизнеса в ОАЭ | Guide | UAE VAT compliance SME | НДС ОАЭ чеклист малый бизнес | Calendar: evergreen | FTA + advisory | Medium | 2 |

---

### Accounting and audit cluster

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| Is Audit Mandatory for Mainland Companies in Dubai? | Обязателен ли аудит для mainland компаний в Дубае? | Guide | audit requirements mainland UAE | аудит требования mainland ОАЭ | Calendar: rolling by FY | Federal Decree-Law 32 of 2021 / MOHAP | High | 2 |
| DMCC Audit Submission Deadline: What Members Need to Know | Дедлайн аудита DMCC: что нужно знать участникам | Event + Guide | DMCC audit deadline | аудит DMCC срок подачи | Event: June 30 annually (verify) | DMCC portal dmcc.ae | High | 1 |
| DIFC Audit Requirements and Filing Deadline | Требования к аудиту DIFC и сроки подачи | Event + Guide | DIFC audit deadline | аудит DIFC требования | Event: June 30 (verify on DIFC portal) | DIFC Registrar difc.ae | High | 1 |
| ADGM Audit Requirements by Company Type | Требования к аудиту в ADGM | Guide | ADGM audit requirements | аудит ADGM | Calendar: rolling (9 months after FY) | ADGM adgm.com | High | 2 |
| UAE Qualifying Free Zone Company and the Audit Requirement | Квалифицированная компания свободной зоны ОАЭ: аудит | Guide | QFZP audit UAE corporate tax | QFZP аудит ОАЭ | Calendar: linked to CT return | FTA | High | 2 |

---

### Company operations cluster

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| How to Renew a Trade License in Dubai: Mainland Step-by-Step | Продление торговой лицензии в Дубае: пошаговая инструкция | Guide | trade license renewal Dubai | продление торговой лицензии Дубай | Calendar: rolling annual | DED ded.gov.ae | High | 1 |
| Free Zone License Renewal: How Timelines Differ by Zone | Продление лицензии в свободной зоне ОАЭ | Guide | free zone license renewal UAE | продление лицензии свободная зона | Calendar: rolling (zone-specific) | Individual free zone portals | High | 1 |
| Establishment Card Renewal in Dubai: Who Needs It and When | Продление карты предприятия в Дубае | Guide | establishment card renewal Dubai | карта предприятия Дубай продление | Calendar: rolling | MOHRE | Medium | 2 |
| Ejari for Commercial Premises: Registration and Renewal | Ejari для коммерческой недвижимости в Дубае | Guide | Ejari commercial Dubai | Ejari коммерческая недвижимость | Calendar: renewal triggered | RERA / Dubai REST | Medium | 2 |
| What to Update at Your Bank After Visa or License Renewal | Что обновить в банке после продления визы или лицензии | Calendar visual post | bank update UAE after visa renewal | обновление данных в банке ОАЭ | Calendar reminder: evergreen | Internal (no official penalty — general guidance) | Low | 3 |

---

### Visa and HR cluster

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| UAE Residence Visa Renewal: When and How | Продление визы резидента ОАЭ: когда и как | Guide | UAE residence visa renewal | продление визы резидента ОАЭ | Calendar: rolling (every 2 years) | ICP icp.gov.ae | High | 1 |
| Golden Visa Renewal: Process and Timing | Продление Золотой визы ОАЭ | Guide | UAE Golden Visa renewal | Золотая виза ОАЭ продление | Calendar: rolling (every 10 years) | ICP | High | 2 |
| Digital Nomad Visa UAE: Annual Renewal Guide | Виза цифрового кочевника ОАЭ: ежегодное продление | Guide | UAE digital nomad visa renewal | виза цифрового кочевника ОАЭ продление | Calendar: rolling annual | ICP | High | 2 |
| UAE ILOE Unemployment Insurance: How to Register After Your Visa | ILOE в ОАЭ: как зарегистрироваться после получения визы | Guide | ILOE UAE registration | ILOE ОАЭ регистрация безработица | Calendar: triggered by visa activation | ILOE.ae / MOHRE | Medium | 2 |
| Dubai Medical Insurance: What Residents and Employees Need | Медицинская страховка в Дубае: для резидентов и сотрудников | Guide | medical insurance Dubai mandatory | медицинская страховка Дубай обязательная | Calendar: annual renewal | DHA dha.gov.ae | Medium | 2 |

---

### E-invoicing cluster (highest urgency for large businesses)

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| UAE E-Invoicing 2026–2027: What Every Business Needs to Know | Электронное выставление счетов в ОАЭ 2026–2027 | Guide + Event | UAE e-invoicing 2026 2027 | электронные счета ОАЭ 2026 | Event: July 31 2026 (large businesses ASP) + Jan 1 2027 go-live | MoF mof.gov.ae + FTA | Highest | 1 |
| Who Qualifies as a Large Business for UAE E-Invoicing? | Крупный бизнес для целей электронных счетов ОАЭ | Guide | UAE e-invoicing large business threshold | крупный бизнес электронные счета ОАЭ | Links to e-invoicing event items | MoF / FTA | Highest | 1 |
| How to Choose an ASP for UAE E-Invoicing | Как выбрать ASP для электронных счетов в ОАЭ | Guide | UAE e-invoicing ASP selection | ASP электронные счета ОАЭ | Links to July 2026 deadline | MoF | Highest | 1 |
| UAE E-Invoicing for SMEs: What to Prepare Before 2027 | Электронные счета для малого бизнеса ОАЭ: что подготовить | Guide | UAE e-invoicing SME 2027 | электронные счета малый бизнес ОАЭ | Event: March 2027 ASP + July 2027 go-live | MoF / FTA | Highest | 1 |
| Why Excel Is Not Enough for UAE E-Invoicing Compliance | Почему Excel не подойдёт для электронных счетов в ОАЭ | Guide | UAE e-invoicing accounting system | электронные счета ОАЭ учётная система | Links to e-invoicing hub | MoF / FTA | High | 2 |

---

### AML/DNFBP cluster

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| UAE AML Compliance for DNFBP: What Companies Must Do | AML-комплаенс для DNFBP в ОАЭ | Guide | UAE AML DNFBP compliance | AML комплаенс DNFBP ОАЭ | Event: Jan 1–31 annual risk assessment window | MOEI moec.gov.ae + goAML | High | 1 |
| goAML UAE Registration: Step-by-Step for DNFBP | Регистрация в goAML: пошаговая инструкция для DNFBP | Guide | goAML UAE registration | goAML ОАЭ регистрация | Calendar: triggered | MOEI + goAML portal | High | 1 |
| UAE Annual AML Risk Assessment: Who Submits and When | Ежегодная оценка AML рисков в ОАЭ | Event + Guide | UAE AML risk assessment annual | оценка AML рисков ОАЭ ежегодная | Event: January 1–31 window (confirm with MOEI) | MOEI | High | 1 |

---

### Media and compliance edge cases

| EN title idea | RU title idea | Content type | Target keyword EN | Target keyword RU | Calendar relevance | Source needed | Risk level | Priority |
|---|---|---|---|---|---|---|---|---|
| Related Party Transactions in UAE Corporate Tax: Disclosure Rules | Операции со связанными лицами в корпоративном налоге ОАЭ | Guide | UAE related party transactions corporate tax | связанные лица корпоративный налог ОАЭ | Linked to CT return | FTA | High | 2 |
| UAE Excise Tax Registration: Who Needs It | Регистрация акцизного налога ОАЭ: кому нужна | Guide | UAE excise tax registration | акцизный налог ОАЭ регистрация | Calendar: triggered | FTA | Medium | 3 |
| UAE Media Permit: Do You Need One for Sponsored Content? | Медиа-разрешение ОАЭ: нужно ли оно для рекламных материалов | Guide | UAE media permit sponsored content | медиа-разрешение ОАЭ | Calendar: triggered | Emirates Media Council emc.gov.ae | Medium | 3 |

---

## 11. Initial 2026 Research Matrix

**Conventions:**
- Date: "To research" = no official source checked yet; use placeholder only
- Confidence: all Islamic dates = `subject_to_official_confirmation` until UAE announcement
- Status: all = `not_started` at this phase

| ID | Topic | Category | Priority | Date / Range | Date Confidence | Content Type | EN Title Idea | RU Title Idea | Audience | Source Needed | Official Source Required? | Calendar Item? | Detail Page? | Related Guide/Page | Risk | EN Status | RU Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H01 | UAE New Year's Day 2026 | holiday | 1 | 2026-01-01 | confirmed | Calendar item | UAE Public Holidays 2026: New Year | Праздники ОАЭ 2026: Новый год | All residents and businesses | UAE Government Portal | Yes | Yes | No | — | Low | not_started | not_started | Fixed date — safe |
| H02 | UAE Eid Al Fitr 2026 | holiday | 1 | To research — Q1 2026 | subject_to_official_confirmation | Calendar item + Event | Eid Al Fitr 2026 UAE: Expected Dates | Ид аль-Фитр 2026 ОАЭ: ожидаемые даты | All residents | UAE Cabinet / Dubai Media Office | Yes | Yes | Yes | — | High | not_started | not_started | Moon-sighting dependent — never publish specific date without official UAE announcement |
| H03 | UAE Arafat Day / Eve of Eid Al Adha 2026 | holiday | 1 | To research — Q2 2026 | subject_to_official_confirmation | Calendar item + Event | Arafat Day UAE 2026 | День Арафат ОАЭ 2026 | All residents | UAE Cabinet | Yes | Yes | Yes | — | High | not_started | not_started | Lunar calendar — confirm via UAE official announcement only |
| H04 | UAE Eid Al Adha 2026 | holiday | 1 | To research — Q2 2026 | subject_to_official_confirmation | Calendar item + Event | Eid Al Adha 2026 UAE: Dates and Public Holiday | Ид аль-Адха 2026 ОАЭ: даты и выходные | All residents | UAE Cabinet / Dubai Media Office | Yes | Yes | Yes | — | High | not_started | not_started | Multi-day — exact days require official confirmation |
| H05 | Al Hijri New Year 2026 (Islamic New Year) | holiday | 2 | To research — expected Q2/Q3 2026 | subject_to_official_confirmation | Calendar item | Islamic New Year UAE 2026 | Исламский Новый год ОАЭ 2026 | All residents | UAE Government Portal | Yes | Yes | No | — | Medium | not_started | not_started | Public holiday — confirm from official gazette |
| H06 | Prophet's Birthday (Mawlid Al Nabawi) 2026 | holiday | 2 | To research — expected Q3 2026 | subject_to_official_confirmation | Calendar item | Prophet's Birthday UAE 2026 | День рождения Пророка ОАЭ 2026 | All residents | UAE Government Portal | Yes | Yes | No | — | Medium | not_started | not_started | Moon-sighting dependent — confirm via official announcement |
| H07 | UAE Commemoration Day 2026 | holiday | 1 | 2026-12-01 | confirmed | Calendar item | UAE Commemoration Day 2026 | День памяти ОАЭ 2026 | All residents | UAE Government Portal | Yes | Yes | No | — | Low | not_started | not_started | Fixed date |
| H08 | UAE National Day 2026 | holiday | 1 | 2026-12-02 to 2026-12-03 | confirmed | Calendar item + Event | UAE National Day 2026 | Национальный день ОАЭ 2026 | All residents | UAE Government Portal / Dubai Media Office | Yes | Yes | Yes | — | Low | not_started | not_started | Fixed dates — major public occasion |
| H09 | Ramadan 2026 Working Hours Period | holiday | 1 | To research — expected late Feb / early Mar 2026 | subject_to_official_confirmation | Calendar item | Ramadan 2026 in the UAE: Working Hours and Key Dates | Рамадан 2026 в ОАЭ: рабочее время и важные даты | Residents and businesses | UAE Cabinet + MOHRE | Yes | Yes | Yes | — | High | not_started | not_started | Working hours change by ministerial decision each year — verify with MOHRE |
| E01 | GITEX GLOBAL 2026 | event | 1 | To research — typically October, DWTC | expected | Event | GITEX GLOBAL 2026 Dubai: Dates and Registration | GITEX GLOBAL 2026 Дубай: даты и регистрация | Business / tech / startups | GITEX official site gitex.com | Yes | Yes | Yes | Company setup, tech | Low | not_started | not_started | Biennial check: confirm 2026 is a GITEX year |
| E02 | Cityscape Global 2026 | event | 2 | To research — typically September, DWTC | expected | Event | Cityscape Global 2026 Dubai | Cityscape Global 2026 Дубай | Investors, real estate, developers | Cityscape official site | Yes | Yes | Yes | Company setup, real estate | Low | not_started | not_started | Confirm 2026 edition dates on official site |
| E03 | Arabian Travel Market 2026 | event | 2 | To research — typically May, DWTC | expected | Event | Arabian Travel Market 2026 Dubai | Arabian Travel Market 2026 Дубай | Tourism, hospitality, travel | ATM official site | Yes | Yes | Yes | Tourism, holiday homes | Low | not_started | not_started | ATM 2026 likely already passed — check exact dates |
| E04 | Dubai Airshow 2026 or 2027 | event | 2 | To research — biennial (2025 / 2027?) | expected | Event | Dubai Airshow: Next Edition Dates | Dubai Airshow: следующая выставка | Aviation, defence, business | dubaiairshow.aero | Yes | Yes | No | — | Low | not_started | not_started | Confirm if 2026 or 2027 — biennial event |
| E05 | Dubai Shopping Festival 2026–2027 | event | 2 | To research — typically Jan, for ~30 days | expected | Event | Dubai Shopping Festival 2026–2027 | Шопинг-фестиваль в Дубае 2026–2027 | Residents, tourists | mydsf.ae | Yes | Yes | Yes | Tourism | Low | not_started | not_started | Usually Jan–Feb; confirm exact dates |
| E06 | Dubai Food Festival 2026 | event | 3 | To research — typically Feb/Mar | expected | Event | Dubai Food Festival 2026 | Dubai Food Festival 2026 | Residents, families, tourists | dubaifoodfestival.com | Yes | Yes | No | — | Low | not_started | not_started | Lifestyle/P3 event |
| E07 | Dubai Opera 2026–2027 Season | event | 3 | To research — year-round programme | expected | Event | Dubai Opera 2026–2027 Season Highlights | Сезон Dubai Opera 2026–2027 | Residents, culture audience | dubaiopera.com | Yes | Yes | No | — | Low | not_started | not_started | Use as is_external=1 with ticket CTA |
| E08 | GITEX Africa / other GITEX side events | event | 3 | To research | expected | Event | To research | To research | Tech / startups | gitex.com | Yes | No | No | — | Low | not_started | not_started | Lower priority — check if relevant |
| B01 | UAE E-Invoicing ASP Deadline (Large Businesses) | government_deadline | 1 | Expected 2026-07-31 | expected | Event + Guide | UAE E-Invoicing ASP Deadline July 2026: Large Business Obligations | Дедлайн выбора ASP для электронных счетов ОАЭ: июль 2026 | Large businesses (revenue ≥AED 50M) | MoF mof.gov.ae + FTA | Yes — verify on MoF portal before any publish | Yes | Yes | E-invoicing guide (new) | Highest | not_started | not_started | Highest urgency — deadline may be ~2 months away |
| B02 | UAE E-Invoicing Go-Live (Large Businesses) | government_deadline | 1 | Expected 2027-01-01 | expected | Event | UAE E-Invoicing Go-Live January 2027: Large Business Readiness | Запуск электронных счетов ОАЭ: 1 января 2027 | Large businesses | MoF + FTA | Yes | Yes | Yes | E-invoicing guide | Highest | not_started | not_started | Forward-looking — publish as 2026 planning item |
| B03 | UAE E-Invoicing ASP Deadline (SMEs) | government_deadline | 1 | Expected 2027-03-31 | expected | Event | UAE E-Invoicing for SMEs: ASP Deadline March 2027 | Электронные счета ОАЭ для малого бизнеса: дедлайн март 2027 | SMEs (revenue <AED 50M) | MoF + FTA | Yes | Yes | Yes | E-invoicing guide | Highest | not_started | not_started | Awareness now, publish as 2027 planning |
| B04 | UAE E-Invoicing Go-Live (SMEs) | government_deadline | 1 | Expected 2027-07-01 | expected | Event | UAE E-Invoicing Go-Live July 2027: SME Obligations | Запуск электронных счетов для малого бизнеса ОАЭ: июль 2027 | SMEs | MoF + FTA | Yes | Yes | Yes | E-invoicing guide | Highest | not_started | not_started | Forward-looking planning item |
| B05 | UAE Corporate Tax Return (FY Dec 31 companies) | tax_deadline | 1 | Expected 2026-09-30 | expected | Event + Calendar | UAE Corporate Tax Return Deadline September 2026 | Срок подачи корпоративной налоговой декларации: сентябрь 2026 | Mainland and FZ companies with Dec 31 FY | FTA tax.gov.ae | Yes | Yes | Yes | Corporate tax guide (new) | High | not_started | not_started | 9-month rule — verify on FTA; most common FY is Dec 31 |
| B06 | UAE Corporate Tax Natural Persons Deadline (2027) | tax_deadline | 1 | Expected 2027-03-31 | expected | Event | UAE Corporate Tax Registration Deadline for Individuals: March 2027 | Срок регистрации физических лиц по корпоративному налогу ОАЭ: март 2027 | Natural persons with UAE income >AED 1M | FTA | Yes | Yes | Yes | Corporate tax guide | High | not_started | not_started | 2026 deadline already passed — frame as 2027 |
| B07 | AML/DNFBP Annual Risk Assessment Window 2027 | aml_deadline | 1 | Expected 2027-01-01 to 2027-01-31 | expected | Event + Guide | UAE AML Annual Risk Assessment: January 2027 Window | Ежегодная оценка AML рисков в ОАЭ: январь 2027 | DNFBP entities (real estate, accountants, lawyers, etc.) | MOEI moec.gov.ae + goAML | Yes | Yes | Yes | AML guide (new) | High | not_started | not_started | 2026 window already passed — plan 2027 now |
| B08 | DMCC Audit Submission Deadline | government_deadline | 1 | Expected 2026-06-30 | expected | Event | DMCC Annual Audit Submission Deadline 2026 | Дедлайн сдачи аудита DMCC 2026 | DMCC member companies | DMCC portal dmcc.ae | Yes | Yes | Yes | Audit guide (new) | High | not_started | not_started | Verify on DMCC portal — may already be very close |
| B09 | DIFC Audit Submission Deadline | government_deadline | 1 | Expected 2026-06-30 | expected | Event | DIFC Annual Audit Submission Deadline 2026 | Дедлайн аудита DIFC 2026 | DIFC-registered companies | DIFC Registrar difc.ae | Yes | Yes | Yes | Audit guide | High | not_started | not_started | Verify on DIFC portal |
| B10 | UAE VAT Quarterly Return Q2 2026 | tax_deadline | 2 | To research — late July 2026 | expected | Calendar item | UAE VAT Return Deadline Q2 2026 | Декларация НДС за Q2 2026 в ОАЭ | VAT-registered businesses | FTA | Yes | Yes | No | VAT guide (new) | High | not_started | not_started | Quarterly rolling — verify exact FTA schedule |
| B11 | UAE VAT Quarterly Return Q3 2026 | tax_deadline | 2 | To research — late October 2026 | expected | Calendar item | UAE VAT Return Deadline Q3 2026 | Декларация НДС за Q3 2026 в ОАЭ | VAT-registered businesses | FTA | Yes | Yes | No | VAT guide | High | not_started | not_started | Rolling quarterly — confirm from FTA |
| V01 | UAE Residence Visa Renewal Reminder | relocation | 1 | Rolling — individual expiry date | confirmed (evergreen) | Calendar item | When and How to Renew Your UAE Residence Visa | Как и когда продлить визу резидента ОАЭ | All residents | ICP icp.gov.ae | Yes | Yes | Yes | Employment visa guide (existing) | High | not_started | not_started | Evergreen rolling — link to existing guide |
| V02 | Emirates ID Renewal Reminder | relocation | 1 | Rolling — linked to visa expiry | confirmed (evergreen) | Calendar item | Emirates ID Renewal: What Changes in 2026 | Продление Emirates ID: что нужно знать | All residents | ICP | Yes | Yes | No | Employment visa guide | Medium | not_started | not_started | Usually linked to visa renewal |
| V03 | Golden Visa Renewal Reminder | relocation | 2 | Rolling — every 10 years | confirmed (evergreen) | Calendar item | UAE Golden Visa Renewal: Process and Timeline | Продление Золотой визы ОАЭ: процедура и сроки | Golden Visa holders | ICP | Yes | Yes | Yes | Golden visa guide (existing) | High | not_started | not_started | Long cycle — link to existing guide |
| V04 | UAE Digital Nomad Visa Renewal Reminder | relocation | 2 | Rolling — annual | confirmed (evergreen) | Calendar item | Digital Nomad Visa UAE: Annual Renewal Guide | Виза цифрового кочевника ОАЭ: ежегодное продление | Remote workers / digital nomads | ICP | Yes | Yes | Yes | — | High | not_started | not_started | Growing audience — new guide needed |
| C01 | Dubai Trade License Renewal Reminder | government_deadline | 1 | Rolling — annual from issue date | confirmed (evergreen) | Calendar item | Dubai Trade License Renewal: How It Works | Продление торговой лицензии в Дубае | Mainland business owners | DED ded.gov.ae | Yes | Yes | Yes | Company setup guide (existing) | High | not_started | not_started | No fixed universal date — individual reminders |
| C02 | Free Zone License Renewal Reminder | government_deadline | 1 | Rolling — varies by zone | confirmed (evergreen) | Calendar item | Free Zone License Renewal: What to Expect in Each Zone | Продление лицензии свободной зоны | Free zone company owners | Individual zone portals | Yes | Yes | Yes | Company setup guide | High | not_started | not_started | Zone-specific — cannot publish universal date |
| C03 | ILOE Registration After Work Visa | government_deadline | 2 | Rolling — triggered by visa | confirmed (evergreen) | Calendar item | UAE ILOE Unemployment Insurance: Registration After Visa Activation | Регистрация в ILOE после получения визы | Employees, PRO managers | iloe.ae + MOHRE | Yes | Yes | Yes | Employment visa guide | Medium | not_started | not_started | Penalty claim needs official URL |
| C04 | Medical Insurance Renewal Reminder | government_deadline | 2 | Rolling — annual | confirmed (evergreen) | Calendar item | Dubai Medical Insurance: What Mandatory Coverage Means | Обязательная медицинская страховка в Дубае | All residents | DHA dha.gov.ae | Yes | Yes | No | — | Medium | not_started | not_started | Emirate-specific rules — Dubai only |
| F01 | KHDA Academic Year 2026–2027 Start | family_school | 1 | To research — typically Sep 2026 | expected | Calendar item | Dubai School Year 2026–2027: Start Dates and Planning | Учебный год 2026–2027 в Дубае: когда начинается | Families with school-age children | KHDA khda.gov.ae | Yes | Yes | Yes | — | Medium | not_started | not_started | KHDA publishes academic calendar each year — verify early |
| F02 | Dubai School Admissions 2026 Season | family_school | 2 | To research — typically Nov–Feb | expected | Calendar item | Dubai Private School Admissions 2026–2027: When to Apply | Поступление в частные школы Дубая 2026–2027 | Relocating families, existing residents | KHDA + individual school websites | Yes | Yes | Yes | Dubai Life Setup guide | Medium | not_started | not_started | KHDA coordinates, but schools set own timelines |
| F03 | Summer School Holiday Period 2026 | family_school | 2 | To research — typically Jul–Aug | expected | Calendar item | Dubai School Summer Holiday 2026: Dates and Planning | Летние каникулы в Дубае 2026 | Families | KHDA | Yes | Yes | No | — | Low | not_started | not_started | Good for relocation timing content |
| P01 | Cityscape Real Estate Exhibition 2026 | real_estate_event | 2 | To research — typically Sep, DWTC | expected | Event | Cityscape Global 2026 Dubai: Real Estate Exhibition | Cityscape Global 2026 Дубай: выставка недвижимости | Investors, buyers, developers | Cityscape official site | Yes | Yes | Yes | Company setup | Low | not_started | not_started | Same as E02 — confirm |
| P02 | DLD Property Ownership Transfer Process Reminder | real_estate_event | 2 | Evergreen | confirmed (evergreen) | Calendar item | DLD Property Transfer: What to Check in 2026 | Регистрация сделок с недвижимостью в DLD 2026 | Property buyers/sellers | DLD dubailand.gov.ae | Yes | Yes | No | — | Medium | not_started | not_started | Evergreen — link to future property guide |
| P03 | RERA Rental Index and Market Update | real_estate_event | 2 | Rolling — published periodically | expected | News | Dubai Rental Index 2026: Key Updates | Рентный индекс Дубая 2026: главное | Tenants, landlords, investors | RERA rpdubai.gov.ae | Yes | Yes | No | — | Medium | not_started | not_started | Only when RERA publishes official update |
| T01 | Dubai Tourism Summer Campaign 2026 | event | 3 | To research — summer 2026 | expected | Calendar item | Dubai Summer: What's On in 2026 | Лето в Дубае 2026: события и программы | Tourists, local families | DTCM visitdubai.com | No (lower risk) | Yes | No | Tourism guide | Low | not_started | not_started | Lifestyle / P3 priority |
| T02 | Holiday Home Permit Renewal Reminder | government_deadline | 2 | Rolling — annual | confirmed (evergreen) | Calendar item | Dubai Holiday Home Permit: Renewal Process | Продление разрешения на краткосрочную аренду в Дубае | Holiday home owners | DTCM / DET | Yes | Yes | Yes | Holiday home guide (planned) | Medium | not_started | not_started | Links to planned holiday home guide |
| G01 | Guide Update: Employment Visa — MOHRE Fee Changes | guide_update | 1 | To research — check current fees | to_research | Guide update | — | — | All employers | MOHRE | Yes | No | No | Employment visa guide (existing) | High | not_started | not_started | Verify current fees before any update |
| G02 | Guide Update: Company Setup — Corporate Tax Section | guide_update | 1 | Evergreen update needed | to_research | Guide update | — | — | Company founders | FTA | Yes | No | No | Company setup guides (existing) | High | not_started | not_started | Add CT registration step to existing mainland/FZ guides |

---

## 12. Content Production Batches

### Batch 1 — Calendar foundation (before launch)

Target: minimum viable calendar content

- UAE public holidays 2026 (all confirmed fixed dates — New Year, Commemoration Day, National Day)
- Eid dates (expected, clearly marked `subject_to_official_confirmation`)
- Ramadan working hours reminder
- 3–5 major events (GITEX, National Day events, school year start)

Acceptance: at least 8 calendar items live, all with official source or correct confidence label

### Batch 2 — Business compliance (first month after launch)

Target: the highest-value audience for Guidex monetisation

- E-invoicing guide and event items (July 2026 deadline — urgent)
- Corporate Tax return reminder (September 2026 deadline)
- AML/DNFBP guide and 2027 event item
- DMCC/DIFC audit deadline events
- VAT return reminders
- ILOE registration guide

Acceptance: all claims verified against official sources, penalty amounts sourced

### Batch 3 — Dubai major events (first month after launch)

Target: events calendar that brings repeat visitors

- GITEX GLOBAL 2026
- Cityscape Global
- Dubai Shopping Festival
- Dubai Food Festival
- Dubai Opera season highlights

Acceptance: all dates from official organizer sites, is_external=1 where applicable

### Batch 4 — Relocation and family (second month)

Target: high-intent Guidex audience — people moving to Dubai

- KHDA school year and admissions calendar
- Visa renewal reminders
- Emirates ID reminder
- Summer planning items
- First 30 days Dubai Life Setup calendar connection

Acceptance: KHDA source confirmed, visa guide links active

### Batch 5 — Guide updates and calendar connections (ongoing)

Target: bring existing guides into the calendar system

- Update company setup guides with CT registration steps
- Add CalendarContextCta to guides with date/deadline relevance (pending schema field addition)
- Update employment visa guide with ILOE and insurance steps
- Add calendar_relevant=1 to qualified guides

Acceptance: schema field model finalized and approved before any DB change

---

## 13. Verification Rules

### High-risk topics — official source required before any publish

All of the following require a confirmed official UAE government URL in `source_url` before the item status can be changed from `draft` to `published`:

- Any specific date for an Islamic holiday
- Any specific AED penalty amount
- Tax filing deadlines and return windows
- Visa renewal rules and duration
- Company/license renewal mandatory timelines
- E-invoicing phase dates
- AML/DNFBP reporting requirements
- Free zone-specific audit deadlines
- Emirates ID processing rules
- Any claim starting with "failure to comply will result in..."

### Medium-risk — official source preferred, media accepted with caveat

- Exhibition and conference dates (official organizer site preferred)
- School year start/end (KHDA preferred)
- Government service announcements (verify before publish but media acceptable for event dates)

### Low-risk — internal editorial approval sufficient

- General planning reminders without compliance implications
- Evergreen lifestyle planning tips
- "What to expect during Ramadan" cultural guidance (non-legal, non-financial)
- Internal navigation content

### Source decay rule

Every published item with a source_url must be re-verified:
- Within 30 days of any related government announcement
- Every 90 days for compliance/tax items
- Annually for all public holiday items
- Before any sitemap inclusion or schema markup addition

---

## 14. No-Publish Launch Gate

The following checklist must be completed before the redesigned homepage/calendar goes live. Each item must be verified by the owner.

### Technical readiness

- [ ] TypeScript: 0 errors
- [ ] QA scripts: all pass (current minimum: 591/591)
- [ ] Production build: all pages compile clean
- [ ] No broken internal links in calendar CTAs
- [ ] Calendar deep links work: `?month=YYYY-MM` and `?date=YYYY-MM-DD`
- [ ] Save-to-phone modal opens and closes correctly on iOS Safari and Android Chrome

### Content readiness

- [ ] Minimum 8 calendar items in DB with status=published
- [ ] All published calendar items: `date_confidence` assigned
- [ ] All Islamic holiday items: amber notice rendered correctly
- [ ] All published items: official `source_url` recorded
- [ ] No item marked `confirmed` without official URL in record
- [ ] At least 1 published news post
- [ ] At least 1 published event

### EN/RU parity

- [ ] All public RU routes: no English fallback for any content field
- [ ] RU calendar items: natural Russian body text verified
- [ ] RU news/event detail pages: tested on device
- [ ] RU homepage: renders correctly

### Design review

- [ ] Homepage renders correctly on iPhone 14 Safari
- [ ] Calendar grid renders on Android Chrome
- [ ] CalendarContextCta renders correctly on news/event detail pages
- [ ] SaveCalendarCta modal tested on iOS and Android

### Owner approval

- [ ] Owner has reviewed EN homepage on preview
- [ ] Owner has reviewed RU homepage on preview
- [ ] Owner has reviewed calendar page (month view) on mobile
- [ ] Owner has reviewed at least one news detail and one event detail page
- [ ] Owner gives explicit written deploy approval

---

## 15. SEO and RAG Writing Rules

All new content produced for Phase 6A and beyond must follow these rules.

### Structure

- Facts first: answer the practical question in the first 2 sentences
- Short paragraphs: maximum 3 sentences on mobile
- No walls of text
- Numbered or bulleted lists for multi-step processes
- Bold only for the most important number or date in a section — not for decoration

### Tone

- Calm, factual, direct — the reader is already stressed about compliance
- No fake urgency: "Act now before it's too late" is not Guidex
- No exaggerated claims: "the most important compliance event in UAE history" is not Guidex
- No AI filler: "In the rapidly evolving landscape of UAE regulations..." is not Guidex

### Language rules

- Short declarative sentences: subject + verb + object
- No long em dashes in body text — use colon, comma, or new sentence
- Numbers are specific: AED 375,000, not "hundreds of thousands"
- Official terms used as-is: FTA, ICP, GDRFA, DMCC, ADGM, goAML, MOHRE, DLD, KHDA, DHA, DEWA
- Spell out on first mention, abbreviate after
- No invented jargon — use the term the authority uses

### SEO integration

- One clear keyword focus per page
- Keywords appear naturally in H1 and first paragraph
- No keyword stuffing — one instance per section is sufficient
- Entity-rich content: authority names, service names, place names, AED amounts, day counts
- No hidden text, no invisible keywords

### RAG / AI discoverability

- Clear factual structure: who, what, when, where, official source
- Every article has an identifiable topic entity and a clear answer
- Internal links connect related items — calendar, guide, news, event
- Content clusters around UAE holidays, Dubai events, business deadlines — not scattered fragments

### Originality rule

- No text from external PDFs, competitor documents, or advisory publications
- No paraphrase of competitor language or structure
- Every sentence must be original to Guidex
- Official government text can be quoted briefly if clearly attributed — do not reproduce verbatim in full

---

## 16. What NOT to Do (Permanent Rules)

- Do not push, deploy, or publish without explicit owner approval
- Do not modify DB outside of approved admin workflow
- Do not run schema migrations without a separate approved prompt
- Do not create fake confirmed dates — use `expected` or `subject_to_official_confirmation`
- Do not copy or paraphrase text from external PDFs or competitor materials
- Do not publish Islamic holiday dates without UAE official moon-sighting confirmation
- Do not publish penalty amounts without an official UAE government source URL
- Do not write RU as a literal translation of EN — RU must be natural and independently readable
- Do not use long em dashes in visible body or UI text
- Do not add content to production without owner review

---

## 17. Next Phases After 6A

| Phase | Description | Dependencies |
|---|---|---|
| 6B | Source verification sprint — open official sources for all Priority 1 items and record URLs | Phase 6A matrix complete |
| 6C | Draft production — create first wave of calendar items in admin (status=draft, noindex) | Phase 6B sources verified for at least 8 items |
| 6D | EN/RU review — owner reviews first drafts in admin before any publish | Phase 6C drafts ready |
| 6E | First publish wave — mark first 8+ items as published, build passes, QA passes | Phase 6D approved |
| 6F | Launch gate — complete no-publish checklist above, push, deploy, publish | Phase 6E complete + owner approval |
| 7A | Guide calendar connection — add calendar_relevant field to guides schema, connect CalendarContextCta | Phase 6E stable |
| 7B | E-invoicing guide cluster — priority research and production | Phase 6B sources for e-invoicing confirmed |
| 7C | Corporate Tax guide cluster | Phase 6B sources confirmed |
| 7D | Dubai Life Setup integration — connect school/family/relocation dates to Dubai Life Setup pages | Phase 6E stable |

---

*This document is internal planning only. No text from this document is published to the public site without a separate content development, verification, and editorial approval pass.*

*Last updated: 2026-05-18*
