# Dubai Holiday Homes DET Permit Source Ledger

## Ledger status

```
ledger_status:           source_ledger
publish_status:          not_for_publish_yet
content_status:          source_verification_only
risk_level:              medium_high
source_reliability:      official_where_captured
verification_required:   true
last_reviewed:           2026-05-19
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
| Source type | media_research_signal — official_portal_blocked |
| Reliability | signals_only — official_verification_required |
| URL (DET service page) | https://www.dubaidet.gov.ae/en/our-services/for-consumers-and-students/apply-for-a-holiday-home-permit |
| URL status | HTTP 403 Forbidden — page inaccessible during Phase 6C-22 research sprint |
| Access date | 2026-05-19 (access failed) |
| Verification status | official_portal_blocked — media_research_signals_only |

**DET official portal status:** The DET service page at the URL above returned HTTP 403 Forbidden during both Phase 6C-22 and Phase 6C-23 research sprints. A second DET URL was also tried in Phase 6C-23: https://www.dubaidet.gov.ae/en/our-services/for-consumers-and-students/issue-a-new-holiday-homes-permit — also returned HTTP 403 Forbidden. Both DET service page URLs were inaccessible as of 2026-05-19. The portal entry point at `hhpermits.det.gov.ae` (Source A) remains the accessible official starting point but does not contain detailed fee/validity/document information.

**Media research signals captured (Phase 6C-22):**

The following figures appear in multiple UAE media and advisory sources. They are signals only — all figures must be verified directly from the official DET portal before any content publishes. Do not treat these as confirmed official facts.

| Signal | Signal source type | Confidence | Status in Guidex content |
|---|---|---|---|
| Application fee: AED 1,500 | media_research_signal | signal_only | BLOCKED — must verify from official portal |
| Knowledge fee: AED 10 | media_research_signal | signal_only | BLOCKED — must verify from official portal |
| Innovation fee: AED 10 | media_research_signal | signal_only | BLOCKED — must verify from official portal |
| Per-night charge: AED 10/bedroom (standard) | media_research_signal | signal_only | BLOCKED — must verify from official portal |
| Per-night charge: AED 15/bedroom (deluxe) | media_research_signal | signal_only | BLOCKED — must verify from official portal |

**Why these signals are not sufficient:**
- The DET portal page was inaccessible; figures cannot be cross-checked against the live official source.
- Fee structures for DET permits have changed historically — signals may reflect outdated amounts.
- All fee claims remain blocked until the official DET service page is read directly.

**Blocked until official page found:** All permit workflow content, all fee claims, all eligibility claims. The URL above should be retried when portal access is restored.

---

### Source D — Owner-managed versus operator-managed rules

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET |
| Purpose | Official DET source confirming whether owner-managed holiday home units are permitted and under what conditions |
| Source type | media_research_signal — official_source_not_yet_captured |
| Reliability | signals_only — official_verification_required |
| URL | Not yet captured — DET service page returned 403 (see Source C) |
| Access date | — |
| Verification status | media_research_signal — high priority |

**Research signal (Phase 6C-22):**
Holiday home units in Dubai may be managed directly by the property owner or through a licensed operator. The following signal was captured during Phase 6C-22 media research:

| Signal | Signal source type | Confidence | Status in Guidex content |
|---|---|---|---|
| An individual owner can manage up to 8 holiday home units independently without a separate trade license | media_research_signal | signal_only | BLOCKED — must verify from official DET source |
| Managing more than 8 units requires a holiday home operator trade license | media_research_signal | signal_only | BLOCKED — must verify from official DET source |

**Why this signal is not sufficient:**
- The specific DET rule for owner-managed units has not been captured from an official source.
- "Owner-managed is allowed" and "owner-managed is not allowed" are both blocked claims until this source is found.
- The 8-unit threshold is a research signal that appears consistently in UAE media and advisory content — but it must be confirmed from the official DET source, not media.
- Blanket claims either way could mislead property owners about their compliance obligations.

**Blocked until found:** Any claim about owner-managed eligibility, licensing requirements for owners vs operators, or the unit count threshold.

---

### Source E — Permit validity and renewal period

| Field | Value |
|---|---|
| Authority | Dubai Economy and Tourism — DET |
| Purpose | Official DET source confirming the permit validity period and renewal cycle for holiday home permits |
| Source type | media_research_signal — official_source_not_yet_captured |
| Reliability | signals_only — official_verification_required |
| URL | Not yet captured — DET service page returned 403 (see Source C) |
| Access date | — |
| Verification status | media_research_signal — high priority |

**Research signal (Phase 6C-22):**

| Signal | Signal source type | Confidence | Status in Guidex content |
|---|---|---|---|
| Holiday home permits are valid for approximately 1 year and require annual renewal | media_research_signal | signal_only | BLOCKED — must verify from official DET source |

**Why this signal is not sufficient:**
Permit renewal reminders are one of the most useful calendar items for property owners. The ~1-year validity signal appears in multiple UAE advisory and media sources, but it must be confirmed from the official DET portal before any renewal reminder can specify a validity period or renewal window.

**Blocked until found:** Any published claim that permits expire after a specific period; any renewal reminder date logic tied to a specific validity duration.

---

## Sources still needed

Complete these before publishing any content based on this ledger.

**High priority — required before any content publishes:**

- [~] **Official DET page or service card for holiday home permit application** — Two DET service page URLs tried: (1) https://www.dubaidet.gov.ae/en/our-services/for-consumers-and-students/apply-for-a-holiday-home-permit and (2) https://www.dubaidet.gov.ae/en/our-services/for-consumers-and-students/issue-a-new-holiday-homes-permit — both returned HTTP 403 Forbidden in both Phase 6C-22 and Phase 6C-23. Portal access remains blocked as of 2026-05-19. Fee signals captured (AED 1,500 + AED 10 + AED 10) but BLOCKED until official page readable. Next action: retry DET portal in a new browser session or check for DET press release with confirmed fee schedule.
- [~] **Official DET page or portal instructions for permit renewal** — Partially signalled: ~1-year annual renewal signal captured from media research. BLOCKED until official page confirms validity period from official source.
- [~] **Official DET source for permit validity / expiry period** — Signal captured (~1 year). BLOCKED until verified from official DET page.
- [~] **Official DET source for owner-managed unit rules** — Signal captured (up to 8 units owner-managed; beyond 8 requires operator trade license). BLOCKED until verified from official DET source.
- [ ] **Official DET source for operator/company licence requirements** — Required before any content discusses whether a trade or operator licence is needed. Do not publish either way without this.
- [~] **Official DET source for fees/documents/service times** — Fee signals captured (AED 1,500 application + per-night charges). BLOCKED until official portal page is readable.
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
*Last updated: 2026-05-19 (Phase 6C-22) — DET service page URL captured for Source C but returned HTTP 403 Forbidden; portal inaccessible. Media research signals captured for Sources C, D, and E: fee signals (AED 1,500 + AED 10 + AED 10 + per-night charges AED 10/15); owner-managed threshold signal (up to 8 units); permit validity signal (~1 year annual). All signals marked as BLOCKED pending official portal verification. Sources C/D/E status changed from source_needed to media_research_signal. All content opportunities remain blocked until owner review and source recheck.*
