# Dubai Holiday Homes DET Permit Source Ledger

## Ledger status

```
ledger_status:           source_ledger
publish_status:          not_for_publish_yet
content_status:          source_verification_only
risk_level:              medium_high
source_reliability:      official_where_captured
verification_required:   true
last_reviewed:           2026-05-18
owner_review_required:   true
admin_status:            not_used
ai_inbox_status:         not_used
db_status:               not_touched
```

**Topics covered in this ledger:**
- A. Dubai Holiday Homes portal (DET)
- B. Holiday home permit QR code / display compliance notice
- C. Holiday home permit classification, rules, or official service card (source needed)
- D. Owner-managed versus operator-managed context (source needed)
- E. Permit expiry and renewal reminder logic (source needed for validity period)
- F. Future tourism and property content opportunities

**Important risk note:** Holiday home permitting carries regulatory, property, and commercial sensitivity. Permit fees, validity periods, owner-managed versus operator-managed rules, and building/community approval requirements are all governed by DET/DTCM regulation and specific unit details. Guidex is an information resource — not a legal adviser or compliance consultant. All content based on this ledger must direct readers to the official DET Holiday Homes portal and qualified professional advice for their specific situation. No content may be published without owner review and source recheck.

---

## Official sources

---

### Source A — DET Holiday Homes portal

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET (hhpermits.det.gov.ae) |
| Purpose | Official portal for Dubai Holiday Homes permit workflows |
| Source type | official |
| Reliability | official |
| URL | https://hhpermits.det.gov.ae/HolidayHomes/welcome.aspx |
| Access date | 2026-05-18 |
| Verification status | captured_url_present |

**Captured facts:**
- This is the official portal for Dubai Holiday Homes permit workflows.
- It is the correct starting point for holiday home unit registration, permit management, renewal, and owner/operator workflows.
- The portal can support future Guidex guide and calendar reminder content as a verified official source.
- Do not invent fees, document lists, expiry rules, owner/operator rules, or unit eligibility criteria unless directly visible and readable on the official portal.

**Important constraint:** This URL captures the portal entry point. The specific permit workflow, fees, required documents, and validity period must be read from the portal itself at time of publishing — not assumed from prior research signals.

**Recheck before publish:** Yes — confirm URL resolves; confirm portal is still active and has not migrated to a new DET domain.

---

### Source B — DET Holiday Homes QR code / display compliance notice

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET (hhpermits.det.gov.ae or linked DET notice) |
| Purpose | Compliance notice for licensed holiday home units regarding QR code display |
| Source type | official_if_visible_on_portal |
| Reliability | official_if_visible_on_portal |
| URL | https://hhpermits.det.gov.ae/HolidayHomes/welcome.aspx (portal — QR notice location to be confirmed) |
| Access date | 2026-05-18 |
| Verification status | source_capture_needed — exact URL for the notice not yet confirmed |

**Research signal:**
The official DET Holiday Homes portal has communicated that licensed individuals and operators are required to display the holiday home unit QR code beneath the DEWA premise plaque. This signal appears in DET portal operational notices.

**Why this signal is not yet sufficient for publish:**
- The exact URL and stable permalink for the QR code notice has not been separately confirmed.
- The portal welcome page may carry a general notice that changes without a stable anchor URL.
- The specific placement requirement ("beneath the DEWA premise plaque") needs to be quoted or closely paraphrased from the official source — not from secondary research.
- Mandatory compliance claims must come from an official DET source with a stable URL, not a portal notice that may change.

**What the signal is useful for:**
- Editorial planning: QR code display is a real compliance topic for licensed holiday home operators.
- Future content: a "holiday home permit compliance checklist" or calendar reminder can be planned.
- Do not publish any QR code placement claim as mandatory until the exact official source URL is captured and recorded in this ledger.

**Recheck before publish:** Yes — find and record the exact DET URL or notice permalink for the QR code requirement. Do not publish without it.

---

### Source C — DET holiday home permit regulations / service card

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET |
| Purpose | Official DET source for holiday home permit rules, classification, application process, fees, and documents |
| Source type | source_needed |
| Reliability | official_when_found |
| URL | Not yet captured |
| Access date | — |
| Verification status | source_needed — high priority |

**What is needed:**
- An official DET page, service card, or portal instructions page explaining:
  - What permits are required to operate a holiday home in Dubai
  - What unit types or classifications are eligible
  - What the application process looks like
  - What documents are required
  - What fees apply (if published officially)
  - What the permit validity period is

**Why this matters:**
Without this source, a guide cannot describe the permit process. Any permit workflow, fee, or eligibility claim is blocked until this source is found and recorded.

**Where to look:**
- `hhpermits.det.gov.ae` inner pages after login or registration flow
- `dubailand.gov.ae` if DLD and DET co-publish holiday home rules
- `visitdubai.com/en` if Visit Dubai publishes operator instructions
- UAE government service card aggregators (government.ae or similar)

**Blocked until found:** All permit workflow content, all fee claims, all eligibility claims.

---

### Source D — Owner-managed versus operator-managed rules

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET |
| Purpose | Official DET source confirming whether owner-managed holiday home units are permitted and under what conditions |
| Source type | source_needed |
| Reliability | official_when_found |
| URL | Not yet captured |
| Access date | — |
| Verification status | source_needed — high priority |

**Research signal:**
Holiday home units in Dubai may be managed directly by the property owner or through a licensed operator. The rules governing owner-managed units — whether a trade licence is required, what the eligibility conditions are, and whether any building or community approval applies — are a key question for property owners.

**Why this signal is not sufficient:**
- The specific DET rule for owner-managed units has not been captured from an official source.
- "Owner-managed is allowed" and "owner-managed is not allowed" are both blocked claims until this source is found.
- Blanket claims either way could mislead property owners about their compliance obligations.

**Blocked until found:** Any claim about owner-managed eligibility, licensing requirements for owners vs operators, or building approval.

---

### Source E — Permit validity and renewal period

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET |
| Purpose | Official DET source confirming the permit validity period and renewal cycle for holiday home permits |
| Source type | source_needed |
| Reliability | official_when_found |
| URL | Not yet captured |
| Access date | — |
| Verification status | source_needed — high priority |

**Why this matters:**
Permit renewal reminders are one of the most useful calendar items for property owners. Without knowing the official validity period, a renewal reminder cannot have a meaningful date logic (e.g., "renew 60 days before expiry" requires knowing the expiry cycle). All permit renewal reminder date logic is editorial planning only until this source is captured.

**Blocked until found:** Specific permit renewal date logic published as confirmed; any claim that permits expire after a specific period.

---

## Sources still needed

Complete these before publishing any content based on this ledger.

**High priority — required before any content publishes:**

- [ ] **Official DET page or service card for holiday home permit application** — Required before any guide describes the permit workflow, application steps, or eligibility. Record: exact URL, page title, access date.
- [ ] **Official DET page or portal instructions for permit renewal** — Required before any renewal reminder or renewal guide section is published. Record: exact URL, access date.
- [ ] **Official DET source for permit validity / expiry period** — Required before any calendar reminder specifies a renewal window. Record: exact validity duration from official source.
- [ ] **Official DET source for owner-managed unit rules** — Required before any content claims owner-managed units are or are not permitted. Record: exact URL and official language.
- [ ] **Official DET source for operator/company licence requirements** — Required before any content discusses whether a trade or operator licence is needed. Do not publish either way without this.
- [ ] **Official DET source for fees/documents/service times** — Required if guide includes any permit cost or document list. Read directly from official portal before publish.
- [ ] **Official QR code display notice with stable URL** — Required before any content says QR code display is mandatory. Record: exact URL, direct quote or close paraphrase, access date.

**Medium priority — needed to expand content scope:**

- [ ] **DET holiday home classification standards** — If guide discusses unit type requirements, star ratings, or quality standards for holiday homes.
- [ ] **Building or community approval source** — If content discusses whether developer or owners association approval is needed before listing a property.
- [ ] **Dubai REST / DLD source if connecting property ownership** — If guide connects holiday home permits to DLD ownership records or title deed data.
- [ ] **DEWA premise number source** — If the QR code compliance section mentions DEWA premise as an identifier.
- [ ] **Visit Dubai / DET tourism campaign source** — If connecting seasonal demand or tourism periods to holiday home income planning. Do not conflate tourism calendar with permit requirements.

---

## Claims allowed now

The following may be used in internal draft planning. They must not appear in published content without owner review and source recheck.

1. Dubai has an official Holiday Homes permit portal under DET at `hhpermits.det.gov.ae`.
2. Holiday home permits and related workflows should be checked through the official DET portal.
3. Holiday home permit renewal reminders can be planned as relative reminders tied to each unit's permit expiry date — not one fixed public date.
4. QR code display can be tracked as a potential compliance reminder only after the official notice URL is captured and rechecked.
5. This content is relevant for property owners, investors, holiday home operators, and Dubai Life Setup / Tourism and Holiday Homes hub planning.
6. The topic requires official-source verification before any permit workflow, fee, or eligibility claim is published.

---

## Claims blocked

The following must NOT appear in any Guidex draft, article, calendar item, or published content until the specific official source is captured, rechecked, and confirmed.

| Blocked claim | Why blocked |
|---|---|
| "Any Dubai property can become a holiday home" | Eligibility not confirmed — not all property types or communities may qualify |
| "Owner-managed units are allowed" | Source D not captured — owner-managed rules not confirmed |
| "No company licence is needed for owners" | Source D not captured — licensing requirement not confirmed |
| "A company licence is always required" | Source D not captured — cannot confirm either way |
| "Permit fee is X AED" | Source C not captured — fees not confirmed from official source |
| "Permit validity is X years/months" | Source E not captured — validity period not confirmed |
| "QR code must be placed beneath the DEWA plaque" | Source B exact URL not captured — placement rule is a research signal only |
| "Building or community approval is not required" | No official source captured for this assertion |
| "Building or community approval is required" | No official source captured — cannot confirm either way |
| "Permit expires on a specific public date" | Permit is unit-specific, not a fixed public expiry date |
| "Document list is X, Y, Z" | Source C not captured — document requirements not confirmed |
| "This is legal advice" | Out of scope for Guidex entirely |
| Any content published before owner review | Blocked by default for all content based on this ledger |

---

## Calendar and reminder logic

The following reminders are relative (tied to each unit's permit expiry date), not fixed public-date reminders. Plan calendar items accordingly.

| Reminder | Date logic | Type | Priority | Confidence | Source | Publish status | Notes |
|---|---|---|---|---|---|---|---|
| A. Holiday home permit renewal | Relative to each unit's permit expiry | tourism_property_reminder | 1 | source_needed_for_exact_validity | DET portal + permit validity source needed | blocked_until_validity_source | Useful for owners/operators; do not publish a specific renewal window until validity source is captured |
| B. QR / display compliance check | After permit issuance or before guest operations begin | tourism_property_reminder | 2 | source_needed_if_qr_notice_not_exact_url | DET portal notice if exact URL captured | source_check_required | Do not publish as mandatory until official notice URL is recorded |
| C. Unit account / document review | Before renewal or before peak tourism season | tourism_property_reminder | 2 | editorial_planning | Official portal source | soft_reminder_only | Useful before DSF, DSS, and high-tourism periods |
| D. Tourism peak season reminder | Before major Dubai tourism periods | tourism_property_reminder | 3 | editorial_planning | Visit Dubai event calendar + DET source needed | soft_reminder_only | Connect to Dubai Calendar, DSF, DSS and major events |

**Key planning rule:** No holiday home permit reminder has a single public date. Each reminder must be tied to the individual unit's permit status and expiry. Do not publish a fixed-date permit reminder as if it applies to all units.

---

## Content opportunities

All items below are planned only. Do not create these files now. They are unlocked once the sources above are captured, rechecked, and owner review is confirmed.

| File | Type | Status | Unlock condition |
|---|---|---|---|
| `docs/content-drafts/guides/dubai-holiday-home-permit-owner-guide.md` | Guide draft | Not yet created | Sources A + C + D captured; QR notice source if compliance discussed; owner review |
| `docs/content-drafts/calendar/dubai-holiday-home-permit-renewal-reminders.md` | Calendar visual / reminder post | Not yet created | Permit validity source captured; guide draft approved; confirm relative reminder logic |
| `docs/content-drafts/guide-updates/dubai-tourism-holiday-homes-hub.md` | Guide update / hub page | Not yet created | At least one holiday home guide published; tourism calendar source available |
| `docs/content-drafts/verification/dubai-holiday-home-permit-owner-managed-rules.md` | Verification file | Not yet created | Create when owner-managed research signal needs formal editorial decision tracking |
| `docs/content-drafts/source-ledgers/dubai-holiday-home-fees-documents-sources.md` | Source ledger | Not yet created | Needed if a separate fees/docs ledger is warranted before publishing specific permit cost claims |

---

## EN/RU title ideas

### Holiday home permit guide

**EN:** Dubai holiday home permit: what owners should verify before renting short-term

**RU:** Разрешение holiday home в Дубае: что владельцу проверить перед краткосрочной арендой

### Calendar / reminder post

**EN:** Dubai holiday home permit renewal reminders

**RU:** Напоминания по продлению разрешения holiday home в Дубае

### Verification file

**EN:** Dubai holiday home owner-managed rules: source check

**RU:** Правила owner-managed holiday home в Дубае: проверка источников

### Tourism hub / guide update

**EN:** Tourism and holiday homes in Dubai: permit and calendar planning

**RU:** Туризм и holiday homes в Дубае: разрешения и календарное планирование

---

## Guidex angle

This is not generic property news.

Guidex should explain:

- **What a property owner should verify before using a unit as a holiday home.** The official DET portal is the starting point. Guidex explains where to go, what questions to ask, and what the permit process involves — without inventing fees, timelines, or eligibility rules that must come from official sources.
- **Why permit and renewal reminders should be tied to each unit's actual permit expiry.** Holiday home permits are unit-specific. A reminder set relative to the permit expiry date is useful; a generic public-date reminder is not. Guidex Calendar should support this relative logic once the validity period is confirmed from an official source.
- **How holiday homes connect to tourism seasons, DSF, DSS, major Dubai events, and property income planning.** For owners using their property as a short-term rental, peak seasons drive income. Guidex can help connect permit readiness with tourism calendar awareness — without giving financial advice.
- **How DET permits connect to DLD ownership, DEWA premise details, building or community rules, and guest readiness.** Holiday home compliance is not just a DET permit. It may also involve developer or owners association approval, DEWA setup, and DLD title deed details. Guidex should flag these connections without overstating what it knows from official sources.
- **Why owner-managed versus operator-managed claims must be official-source based.** This is one of the most common questions from property owners. Guidex can plan this content but must not publish any claim about owner-managed eligibility until the DET official source is captured.
- **When owners should use the official DET portal or seek professional help.** Guidex directs users to the official portal for permit workflows and to qualified professionals for compliance questions beyond what official sources cover.

---

## What not to write

### Forbidden phrasing

| Bad | Better |
|---|---|
| "Any Dubai property can become a holiday home." | "Check the official DET Holiday Homes portal to confirm whether your unit is eligible." |
| "No company licence is needed." | "Owner-managed and operator-managed rules need official-source confirmation before publishing." |
| "A company licence is always required." | "Licensing requirements depend on your permit type — check the official DET portal." |
| "Permit fee is X AED." | "Fees are subject to official DET portal — check before applying." |
| "Permit validity is exactly X years." | "Permit validity should be confirmed from the official DET source before publishing any renewal reminder." |
| "QR code must be placed exactly here." | "QR code display requirements should be checked directly on the DET portal." |
| "This is legal advice." | "For compliance or legal questions, use official channels or qualified professional advice." |
| "Guidex treats this as a confirmed workflow." | "Guidex treats this as a verification-first topic — all workflow claims require official source." |

---

## RU wording guardrails

### Approved terms

| EN term | RU approved form |
|---|---|
| holiday home | holiday home (краткосрочная аренда) |
| DET permit | разрешение DET |
| property owner | владелец недвижимости |
| operator | оператор |
| permit renewal | продление разрешения |
| unit | unit (объект / апартаменты) |
| DEWA premise | объект DEWA |
| QR code | QR-код |
| tourism in Dubai | туризм в Дубае |
| calendar reminder | напоминание в календаре |
| short-term rental | краткосрочная аренда |
| Dubai Shopping Festival | Dubai Shopping Festival (ДШФ) |
| Dubai Summer Surprises | Dubai Summer Surprises (ДСС) |
| peak season | высокий сезон |
| guest readiness | готовность к приёму гостей |

### Avoid

- Literal translation that sounds unnatural in Russian
- English fallback where a natural Russian equivalent already exists and has been used
- Long em dashes (use comma, colon, or restructure the sentence)
- Legal or compliance advice framing
- Blanket claims about owner-managed rules without official source
- Specific fees, validity periods, or document lists without official source captured

---

## Related files

| File | Relationship |
|---|---|
| `docs/content-drafts/source-ledgers/dubai-rental-index-ejari-rent-renewal-sources.md` | Sibling property source ledger — long-term rental and Ejari; holiday homes is a separate permit regime |
| `docs/content-drafts/source-ledgers/eid-al-adha-2026-sources.md` | Existing event source ledger — major holiday periods are relevant to holiday home demand planning |
| `docs/content-drafts/calendar/may-2026-uae-calendar.md` | Existing calendar draft — tourism event awareness feeds into holiday home planning content |
| Future: Visit Dubai / DSF / DSS source ledger | Tourism event calendar source needed for seasonal demand content connected to holiday homes |
| Future: `docs/content-drafts/source-ledgers/dubai-holiday-home-fees-documents-sources.md` | Dedicated fees/documents ledger if permit cost and document detail warrants a separate source ledger |
| Future: DET fees/documents source ledger | Needed before publishing any permit application checklist with fees or document list |
| Future: Dubai Life Setup property guide | Holiday home permit awareness may feed into Dubai Life Setup for property owners |

---

*This is a source ledger — internal use only. Nothing in this file is published. No admin action. No DB write.*
*Last updated: 2026-05-18 — One official DET portal URL captured (Source A). QR code notice signal recorded but exact URL not confirmed (Source B). Sources C, D, and E are source-needed entries blocking all permit workflow, fee, eligibility, owner-managed, and renewal content. All content opportunities blocked until owner review and source recheck.*
