# UAE / Dubai 2026 Calendar Seed Matrix

**Phase:** 6C-62
**Date created:** 2026-05-25
**Scope:** All 2026 calendar candidates from the FULL_CALENDAR_AND_NEWS_RADAR_MATRIX + source ledgers
**Horizon:** May 2026 through Q1 2027
**Purpose:** Single source of truth for calendar import decisions — one row per candidate item

---

## Noindex Status — Corrected (Phase 6C-62B, 2026-05-25)

**Phase 6C-62 stated a P0 noindex blocker across all routes. This was stale. Live production check found:**

| Route | HTTP | Robots |
|---|---|---|
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | **index, follow** |
| `/events/uae-eid-al-adha-2026` | 200 | **index, follow** |
| `/calendar/may-2026-uae-calendar` | 200 | **index, follow** |
| `/news/uae-emiratisation-june-30-2026-deadline` | 200 | **index, follow** |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | **index, follow** |
| `/calendar/uae-long-weekends-2026-2027` | 200 | **index, follow** |
| `/calendar` | 200 | noindex, follow |
| `/ru/calendar` | 200 | noindex, follow |

**Conclusion:** All individual news/events/calendar detail pages are `index, follow`. The `/calendar` and `/ru/calendar` index listing pages are `noindex, follow` — this is a separate product decision, not a technical blocker on content indexing. The P0 blocker language in Phase 6C-62 is stale and must not be used to justify delaying imports.

---

## Calendar Readiness Classification

| Code | Meaning |
|---|---|
| **ALREADY_LIVE** | Live in production — do NOT reimport |
| **IMPORT_READY** | Confirmed official date, no blockers, can import now (if no duplicate risk) |
| **OWNER_REVIEW** | Draft or plan complete, awaiting owner approval before import |
| **SOURCE_NEEDED** | Official date or source URL not yet captured |
| **HOLD** | Intentional hold — date unconfirmed, policy block, or dependency unresolved |
| **INTERNAL_ONLY** | Not for public calendar; feeds internal planning or Life Setup product only |
| **DUPLICATE_RISK** | Date already represented in an existing live calendar entry; standalone import would create duplicate |
| **FUTURE_2027** | 2027 date; out of scope for 2026 first-import pass |

---

## Summary Classification Table

| ID | Title EN (short) | Date | Month | Category | Calendar Readiness | Risk | CTA Rule | Priority |
|---|---|---|---|---|---|---|---|---|
| HOL-01 | Eid Al Adha 2026 | 2026-05-25 to 05-29 | May | holidays | **ALREADY_LIVE** | low | read_news + read_event | done |
| HOL-02 | Islamic New Year 1448H | ~2026-07-17 | Jul | holidays | **HOLD** | medium | hidden | P1 |
| HOL-03 | Mawlid Al-Nabi 1448H | ~2026-09-14 | Sep | holidays | **HOLD** | medium | hidden | P1 |
| HOL-04 | Commemoration Day 2026 | 2026-11-30 | Nov | holidays | **DUPLICATE_RISK** | medium | hidden | P1 |
| HOL-05 | UAE National Day 2026 | 2026-12-02 to 12-03 | Dec | holidays | **DUPLICATE_RISK** | medium | hidden | P1 |
| HOL-06 | New Year's Day 2027 | 2027-01-01 | Jan | holidays | **IMPORT_READY** | low | hidden | P2 |
| HOL-07 | Ramadan 1448H | ~2027-02-06 | Feb | holidays | **FUTURE_2027** | medium | hidden | P1 |
| HOL-08 | Eid Al Fitr 2027 | ~2027-03-08 | Mar | holidays | **FUTURE_2027** | medium | hidden | P1 |
| HOL-09 | Eid Al Adha 2027 | ~2027-05-17 | May | holidays | **FUTURE_2027** | low | hidden | P1 |
| HOL-10 | Long Weekend Planner (meta) | N/A | N/A | holidays | **INTERNAL_ONLY** | low | read_guide (when live) | P1 |
| DXB-01 | Cityscape Dubai 2026 | Sep–Oct TBC | Sep–Oct | dubai-events | **SOURCE_NEEDED** | medium | hidden | P2 |
| DXB-02 | GITEX Global 2026 | ~Oct 13–17 TBC | Oct | dubai-events | **SOURCE_NEEDED** | low | hidden | P1 |
| DXB-03 | Dubai Fitness Challenge 2026 | ~Oct 27–Nov 25 | Oct–Nov | dubai-events | **SOURCE_NEEDED** | low | hidden | P2 |
| DXB-04 | Big 5 Dubai 2026 | ~Nov TBC | Nov | dubai-events | **SOURCE_NEEDED** | low | hidden | P3 |
| DXB-05 | Dubai Run 2026 | ~Nov 29 TBC | Nov | dubai-events | **SOURCE_NEEDED** | low | hidden | P3 |
| DXB-06 | Dubai Shopping Festival 2026–27 | Dec–Jan TBC | Dec | dubai-events | **SOURCE_NEEDED** | low | hidden | P1 |
| DXB-07 | Dubai Marathon 2027 | ~Jan TBC | Jan | dubai-events | **FUTURE_2027** | low | hidden | P3 |
| DXB-08 | Dubai Food Festival 2027 | ~Feb–Mar TBC | Feb | dubai-events | **FUTURE_2027** | low | hidden | P3 |
| DXB-09 | Art Dubai 2027 | ~Mar TBC | Mar | dubai-events | **FUTURE_2027** | low | hidden | P3 |
| DXB-10 | Dubai World Cup 2027 | ~Mar TBC | Mar | dubai-events | **FUTURE_2027** | low | hidden | P3 |
| DXB-11 | Arabian Travel Market 2027 | ~May TBC | May | dubai-events | **FUTURE_2027** | low | hidden | P3 |
| AUH-01 | F1 Abu Dhabi Grand Prix 2026 | ~Nov 27–29 TBC | Nov | abu-dhabi | **SOURCE_NEEDED** | low | read_event (when imported) | P1 |
| AUH-02 | ADIPEC 2026 | ~Nov TBC | Nov | abu-dhabi | **SOURCE_NEEDED** | low | hidden | P2 |
| AUH-03 | Abu Dhabi Art 2026 | ~Nov TBC | Nov | abu-dhabi | **SOURCE_NEEDED** | low | hidden | P3 |
| TAX-01A | Emiratisation June 30 (50+ employees) | 2026-06-30 | Jun | compliance | **ALREADY_LIVE** | high | WhatsApp | done |
| TAX-01B | Emiratisation June 30 (20–49 employees) | 2026-06-30 (unconfirmed) | Jun | compliance | **HOLD** | very high | — | P0 |
| TAX-02 | Corporate Tax FY2025 return (Sept 30) | 2026-09-30 | Sep | compliance | **SOURCE_NEEDED** | high | WhatsApp | P0 |
| TAX-03 | VAT Q2 return (Jul 28) | 2026-07-28 | Jul | compliance | **INTERNAL_ONLY** | medium | hidden | P1 |
| TAX-03b | VAT Q3 return (Oct 28) | 2026-10-28 | Oct | compliance | **INTERNAL_ONLY** | medium | hidden | P1 |
| TAX-04 | Emiratisation annual (Dec 31) | 2026-12-31 | Dec | compliance | **HOLD** | high | — | P1 |
| TAX-05A | E-invoicing pilot start | 2026-07-01 | Jul | compliance | **OWNER_REVIEW** | medium | hidden | P0 |
| TAX-05C | E-invoicing ASP deadline (large biz) | 2026-10-30 | Oct | compliance | **OWNER_REVIEW** | high | WhatsApp | P0 |
| TAX-05D | E-invoicing mandatory (large biz) | 2027-01-01 | Jan | compliance | **FUTURE_2027** | high | hidden | P0 |
| TAX-06 | ESR Annual Filing | Relative | — | compliance | **INTERNAL_ONLY** | high | hidden | P2 |
| TAX-07 | UBO Annual Update | Relative | — | compliance | **INTERNAL_ONLY** | medium | hidden | P2 |
| TAX-08 | Trade License Renewal | Relative | — | compliance | **INTERNAL_ONLY** | medium | read_guide | P2 |
| PROP-01 | Rent renewal 90-day notice | Relative | — | property | **INTERNAL_ONLY** | medium | read_guide | P1 |
| PROP-02 | Ejari registration 10-day | Relative | — | property | **INTERNAL_ONLY** | medium | read_guide | P1 |
| DLS-07 | Visa annual renewal reminder | Relative | — | dubai-life | **INTERNAL_ONLY** | medium | read_guide | P1 |
| DLS-08 | Emirates ID renewal reminder | Relative | — | dubai-life | **INTERNAL_ONLY** | medium | read_guide | P1 |
| PET-04 | Annual rabies vaccination | Relative | — | pets | **INTERNAL_ONLY** | low | hidden | P3 |
| SCH-01 | School enrollment season | Jan–Mar | Jan–Mar | schools | **SOURCE_NEEDED** | medium | hidden | P1 |
| SCH-04 | Back-to-school August | ~Aug | Aug | schools | **SOURCE_NEEDED** | low | hidden | P2 |
| ATTR-04 | Expo City Dubai events | Ongoing | — | attractions | **SOURCE_NEEDED** | low | hidden | P2 |
| VIRAL-01 | UAE Long Weekends 2026–27 | Yearly | — | viral | **ALREADY_LIVE** | low | read_guide | done |

---

## Detailed Item Specs

### HOL-01 — Eid Al Adha 2026

| Field | Value |
|---|---|
| **id** | HOL-01 |
| **title_en** | Eid Al Adha 2026: UAE Federal Holiday |
| **title_ru_draft** | Ид аль-Адха 2026: федеральные выходные ОАЭ |
| **date_start** | 2026-05-25 |
| **date_end** | 2026-05-29 |
| **month** | May |
| **location** | UAE-wide |
| **category** | holidays |
| **type** | calendar + news + event |
| **source_type** | official |
| **source_url** | FAHR official announcement; WAM confirmation |
| **source_status** | official_confirmed |
| **risk** | low |
| **calendar_readiness** | IMPORTED |
| **detail_page_needed** | yes — exists |
| **detail_url** | /news/uae-eid-al-adha-2026-federal-holiday-long-break + /events/uae-eid-al-adha-2026 |
| **cta_rule** | read_news + read_event |
| **en_copy** | published |
| **ru_copy** | published |
| **seo_rag** | high |
| **social** | medium |
| **monetization** | low |
| **notes** | Deployed. News noindex_after 2026-06-01. Event keeps public (annual ref). |
| **next_action** | Monitor; archive news after June 1, 2026 |

---

### HOL-02 — Islamic New Year 1448H

| Field | Value |
|---|---|
| **id** | HOL-02 |
| **title_en** | Islamic New Year 1448H (UAE Public Holiday) |
| **title_ru_draft** | Исламский Новый год 1448 г. х.: выходной в ОАЭ |
| **date_start** | ~2026-07-17 |
| **date_end** | ~2026-07-18 |
| **month** | Jul |
| **location** | UAE-wide |
| **category** | holidays |
| **type** | calendar + news |
| **source_type** | official (not yet captured) |
| **source_url** | Expected: fahr.gov.ae — no URL yet |
| **source_status** | missing — official announcement expected ~2 weeks before date |
| **risk** | medium |
| **calendar_readiness** | HOLD |
| **detail_page_needed** | yes — short news post when confirmed |
| **detail_url** | none |
| **cta_rule** | hidden until detail page live; then read_news |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | medium |
| **social** | medium |
| **monetization** | none |
| **notes** | Do not publish date before official FAHR/WAM confirmation. May be government sector only — do not call it "holiday for all" until circular confirms. |
| **next_action** | Monitor FAHR weekly from July 1, 2026; draft news template ready to fill |

---

### HOL-03 — Mawlid Al-Nabi 1448H

| Field | Value |
|---|---|
| **id** | HOL-03 |
| **title_en** | Prophet's Birthday 2026 (UAE Public Holiday) |
| **title_ru_draft** | Мавлид ан-Наби 1448 г. х.: выходной в ОАЭ |
| **date_start** | ~2026-09-14 |
| **date_end** | ~2026-09-16 |
| **month** | Sep |
| **location** | UAE-wide |
| **category** | holidays |
| **type** | calendar + news |
| **source_type** | official (not yet captured) |
| **source_url** | Expected: fahr.gov.ae — no URL yet |
| **source_status** | missing |
| **risk** | medium |
| **calendar_readiness** | HOLD |
| **detail_page_needed** | yes — short news post when confirmed |
| **detail_url** | none |
| **cta_rule** | hidden until confirmed |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | medium |
| **social** | low |
| **monetization** | none |
| **notes** | Date is approximate — may shift by 1–2 days. Do not confirm until official UAE announcement. |
| **next_action** | Monitor FAHR weekly from Sept 1, 2026 |

---

### HOL-04 — Commemoration Day 2026

| Field | Value |
|---|---|
| **id** | HOL-04 |
| **title_en** | UAE Commemoration Day 2026 |
| **title_ru_draft** | День памяти мучеников ОАЭ 2026 |
| **date_start** | 2026-11-30 |
| **date_end** | 2026-11-30 |
| **month** | Nov |
| **location** | UAE-wide |
| **category** | holidays |
| **type** | calendar |
| **source_type** | official |
| **source_url** | Fixed annual public holiday — confirmed by FAHR annual schedule |
| **source_status** | official_confirmed (fixed annual date) |
| **risk** | medium |
| **calendar_readiness** | DUPLICATE_RISK |
| **detail_page_needed** | no |
| **detail_url** | currently links to `/calendar/uae-long-weekends-2026-2027` (via datesJson) |
| **cta_rule** | hidden |
| **en_copy** | exists inside Long Weekends datesJson |
| **ru_copy** | exists inside Long Weekends datesJson |
| **seo_rag** | low |
| **social** | low |
| **monetization** | none |
| **notes** | **DUPLICATE RISK (Phase 6C-62B):** Commemoration Day is already inside the Long Weekends 2026-2027 datesJson with `detail_url: "/calendar/uae-long-weekends-2026-2027"`. Adding a standalone calendar_page would create two entries for the same date in the calendar agenda. Do NOT import standalone. **Phase 6C-63 clarification:** The Long Weekends datesJson stores the date as `2026-12-01` (Dec 1) — this is CORRECT. Nov 30 is the national occasion/observance date; Dec 1 is the public holiday/day-off date per Cabinet Resolution 27/2024. The Phase 6C-62B "data error" claim (Dec 1 should be Nov 30) was incorrect and is retracted. No date correction needed in Phase 6C-50. |
| **next_action** | Decision required: (a) leave as Long Weekends reference only, OR (b) build a December 2026 monthly calendar page that groups Dec 1-3 holidays cleanly and update Long Weekends datesJson to point to it. Option (b) is the recommended path but requires owner decision and a DB write. Do not import standalone until this decision is made. |

---

### HOL-05 — UAE National Day 2026

| Field | Value |
|---|---|
| **id** | HOL-05 |
| **title_en** | UAE National Day 2026 (55th Anniversary) |
| **title_ru_draft** | Национальный день ОАЭ 2026 |
| **date_start** | 2026-12-02 |
| **date_end** | 2026-12-03 |
| **month** | Dec |
| **location** | UAE-wide |
| **category** | holidays |
| **type** | calendar + news + social |
| **source_type** | official |
| **source_url** | Fixed annual public holiday — confirmed by FAHR annual schedule |
| **source_status** | official_confirmed (fixed annual date) |
| **risk** | medium |
| **calendar_readiness** | DUPLICATE_RISK |
| **detail_page_needed** | yes — news post: holiday scope, fireworks, planning notes |
| **detail_url** | currently links to `/calendar/uae-long-weekends-2026-2027` (via datesJson) |
| **cta_rule** | hidden (until news draft created) |
| **en_copy** | not started (news post) |
| **ru_copy** | not started |
| **seo_rag** | high |
| **social** | high |
| **monetization** | low |
| **notes** | **DUPLICATE RISK (Phase 6C-62B):** National Day (Dec 2–3) is already inside the Long Weekends 2026-2027 datesJson with `detail_url: "/calendar/uae-long-weekends-2026-2027"` and confidence "expected" (FAHR scope pending). Adding a standalone calendar_page for this date would create two entries in the calendar agenda for the same dates. Do NOT import standalone. |
| **next_action** | Same decision path as HOL-04: plan December 2026 monthly calendar page first. News post drafted October 2026 when FAHR confirms private sector scope. Update Long Weekends datesJson `detail_url` to point to December page at the same time. Coordinated operation — not standalone import. |

---

### HOL-06 — New Year's Day 2027

| Field | Value |
|---|---|
| **id** | HOL-06 |
| **title_en** | New Year's Day 2027 (UAE Public Holiday) |
| **title_ru_draft** | Новый год 2027 в ОАЭ: выходной день |
| **date_start** | 2027-01-01 |
| **date_end** | 2027-01-01 |
| **month** | Jan |
| **location** | UAE-wide |
| **category** | holidays |
| **type** | calendar + social |
| **source_type** | official |
| **source_url** | Fixed statutory public holiday — Jan 1 confirmed annually |
| **source_status** | official_confirmed |
| **risk** | low |
| **calendar_readiness** | IMPORT_READY |
| **detail_page_needed** | no |
| **detail_url** | none |
| **cta_rule** | hidden |
| **en_copy** | ready |
| **ru_copy** | ready |
| **seo_rag** | low |
| **social** | medium |
| **monetization** | none |
| **notes** | 2027 date — import when 2027 calendar section is built. |
| **next_action** | Import when 2027 calendar build begins. |

---

### TAX-01A — Emiratisation June 30 (50+ employees)

| Field | Value |
|---|---|
| **id** | TAX-01A |
| **title_en** | Emiratisation Quota Deadline: June 30, 2026 (50+ Employees) |
| **title_ru_draft** | Эмиратизация: контрольный срок 30 июня 2026 (50+ сотрудников) |
| **date_start** | 2026-06-30 |
| **date_end** | 2026-06-30 |
| **month** | Jun |
| **location** | UAE-wide (private sector, 50+ employees) |
| **category** | compliance |
| **type** | calendar + news |
| **source_type** | official |
| **source_url** | https://nafis.gov.ae; https://www.mohre.gov.ae |
| **source_status** | official_confirmed |
| **risk** | high |
| **calendar_readiness** | ALREADY_LIVE |
| **detail_page_needed** | yes — LIVE at `/news/uae-emiratisation-june-30-2026-deadline` |
| **detail_url** | /news/uae-emiratisation-june-30-2026-deadline (live, index, follow) |
| **cta_rule** | WhatsApp (HR advisory CTA) |
| **en_copy** | published |
| **ru_copy** | published |
| **seo_rag** | very high |
| **social** | medium |
| **monetization** | high (HR compliance, PRO services) |
| **notes** | **ALREADY LIVE (Phase 6C-62B):** News post + calendar item both live and `index, follow`. Do not reimport. Monitor GSC for indexing. Item B (20–49 employees) remains HOLD — June 30 not confirmed for this band from a 2026-specific source. |
| **next_action** | Monitor GSC. Archive after 2026-07-10 (noindex_after). |

---

### TAX-01B — Emiratisation June 30 (20–49 employees)

| Field | Value |
|---|---|
| **id** | TAX-01B |
| **title_en** | Emiratisation Quota Deadline: June 30, 2026 (20–49 Employees) |
| **title_ru_draft** | Эмиратизация: контрольный срок 30 июня 2026 (20–49 сотрудников) |
| **date_start** | 2026-06-30 |
| **date_end** | 2026-06-30 |
| **month** | Jun |
| **location** | UAE-wide (private sector, 20–49 employees) |
| **category** | compliance |
| **type** | calendar + news |
| **source_type** | official (not confirmed for this band) |
| **source_url** | No 2026-specific source captured for 20–49 band |
| **source_status** | unconfirmed for 2026 |
| **risk** | very high |
| **calendar_readiness** | HOLD |
| **detail_page_needed** | yes (update to TAX-01A article when source captured) |
| **detail_url** | none |
| **cta_rule** | blocked |
| **en_copy** | blocked |
| **ru_copy** | blocked |
| **seo_rag** | high |
| **social** | medium |
| **monetization** | high |
| **notes** | June 30 2026 deadline for 20–49 employee band is NOT confirmed from a 2026-specific official source. Do not publish any claim about this band's deadline until a 2026 MoHRE circular or NAFIS source is captured. |
| **next_action** | Monitor MoHRE/NAFIS for 2026-specific 20–49 band guidance. Release only when confirmed. |

---

### TAX-02 — Corporate Tax FY2025 Return (Sept 30)

| Field | Value |
|---|---|
| **id** | TAX-02 |
| **title_en** | UAE Corporate Tax FY2025 Return: September 30 Deadline (Example) |
| **title_ru_draft** | Corporate Tax ОАЭ за 2025 год: срок подачи декларации (30 сентября — пример) |
| **date_start** | 2026-09-30 |
| **date_end** | 2026-09-30 |
| **month** | Sep |
| **location** | UAE-wide (December year-end entities) |
| **category** | compliance |
| **type** | calendar + news + guide |
| **source_type** | official |
| **source_url** | https://tax.gov.ae (9-month rule — Source A in corporate-tax-deadline-sources.md) |
| **source_status** | official_confirmed (nine-month rule; Sept 30 is derived example for Dec 31 year-end) |
| **risk** | high |
| **calendar_readiness** | SOURCE_NEEDED |
| **detail_page_needed** | yes — guide + news post (not yet drafted) |
| **detail_url** | none |
| **cta_rule** | WhatsApp (tax advisory) |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | very high |
| **social** | high |
| **monetization** | very high |
| **notes** | Sept 30 is an EXAMPLE for companies with Dec 31 year-end — not a universal date. Calendar item must be labeled as "example deadline" or "check your own deadline." Do not state as universal. FTA source captured; guide draft not yet written. Penalty source not captured. |
| **next_action** | Build Corporate Tax FY2025 guide with FTA sources. Target import by August 1, 2026. |

---

### TAX-03 — VAT Quarterly Returns 2026

| Field | Value |
|---|---|
| **id** | TAX-03 |
| **title_en** | VAT Quarterly Return Deadlines 2026 (UAE) |
| **title_ru_draft** | НДС в ОАЭ: квартальные декларации 2026 |
| **date_start** | Q2: 2026-07-28; Q3: 2026-10-28; Q4: 2027-01-28 |
| **date_end** | — |
| **month** | Jul / Oct / Jan |
| **location** | UAE-wide (VAT-registered quarterly filers) |
| **category** | compliance |
| **type** | calendar |
| **source_type** | official |
| **source_url** | https://tax.gov.ae |
| **source_status** | official_confirmed |
| **risk** | medium |
| **calendar_readiness** | INTERNAL_ONLY |
| **detail_page_needed** | no — part of VAT guide, not standalone news |
| **detail_url** | none |
| **cta_rule** | hidden |
| **en_copy** | N/A |
| **ru_copy** | N/A |
| **seo_rag** | medium |
| **social** | low |
| **monetization** | medium |
| **notes** | Applies only to VAT-registered quarterly filers — not all UAE businesses. Monthly filers have different dates. Not appropriate as a standalone public calendar item without full business compliance calendar context. |
| **next_action** | Add to Business Compliance Calendar when built. Not for current public calendar import. |

---

### TAX-04 — Emiratisation Annual Quota (Dec 31)

| Field | Value |
|---|---|
| **id** | TAX-04 |
| **title_en** | Emiratisation Annual Quota Deadline: December 31, 2026 |
| **title_ru_draft** | Эмиратизация: итоговый срок 31 декабря 2026 |
| **date_start** | 2026-12-31 |
| **date_end** | 2026-12-31 |
| **month** | Dec |
| **location** | UAE-wide |
| **category** | compliance |
| **type** | calendar + news |
| **source_type** | official |
| **source_url** | https://nafis.gov.ae |
| **source_status** | official_confirmed |
| **risk** | high |
| **calendar_readiness** | HOLD |
| **detail_page_needed** | no — update to TAX-01A article |
| **detail_url** | none |
| **cta_rule** | WhatsApp |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | medium |
| **social** | low |
| **monetization** | high |
| **notes** | Import TAX-01A first. Dec 31 item should be a follow-up update to the same news post, not a separate article. Same risk caveats as TAX-01 (no specific fines). |
| **next_action** | Revisit after TAX-01A is imported and live. Recycle TAX-01 post with updated Dec 31 date in Q4 2026. |

---

### TAX-05A — E-invoicing Pilot Start (Jul 1, 2026)

| Field | Value |
|---|---|
| **id** | TAX-05A |
| **title_en** | UAE E-Invoicing: Pilot Programme Starts July 1, 2026 |
| **title_ru_draft** | Электронные инвойсы в ОАЭ: старт пилотной программы 1 июля 2026 |
| **date_start** | 2026-07-01 |
| **date_end** | 2026-07-01 |
| **month** | Jul |
| **location** | UAE-wide |
| **category** | compliance |
| **type** | calendar + news |
| **source_type** | official |
| **source_url** | https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoicing-Guidelines_V-1.0-23Feb2026.pdf |
| **source_status** | official_baseline_confirmed (MoF guideline Feb 2026); no amendment to this date |
| **risk** | medium |
| **calendar_readiness** | OWNER_REVIEW |
| **detail_page_needed** | no (pilot start note — part of e-invoicing news/guide) |
| **detail_url** | /calendar/uae-e-invoicing-2026-asp-deadline (when created) |
| **cta_rule** | hidden |
| **en_copy** | draft exists (see calendar/uae-e-invoicing-2026-asp-deadline.md) |
| **ru_copy** | draft exists |
| **seo_rag** | high |
| **social** | medium |
| **monetization** | high |
| **notes** | Jul 1 is the voluntary start date AND pilot start — applies to all businesses, not just large. Safer than TAX-05C because no deadline conflict. Recheck MoF guideline URL is still current before import. |
| **next_action** | Owner review → import alongside TAX-05C as part of e-invoicing calendar package. |

---

### TAX-05C — E-invoicing ASP Deadline (Oct 30, 2026)

| Field | Value |
|---|---|
| **id** | TAX-05C |
| **title_en** | UAE E-Invoicing ASP Deadline: October 30, 2026 (Large Businesses) |
| **title_ru_draft** | Электронные инвойсы ОАЭ: срок выбора ASP 30 октября 2026 (крупный бизнес) |
| **date_start** | 2026-10-30 |
| **date_end** | 2026-10-30 |
| **month** | Oct |
| **location** | UAE-wide (annual revenue ≥ AED 50M) |
| **category** | compliance |
| **type** | calendar + news + guide |
| **source_type** | official |
| **source_url** | https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ |
| **source_status** | official_permalink_captured (Phase 6C-23, 2026-05-19) — confirmed; recheck before import |
| **risk** | high |
| **calendar_readiness** | OWNER_REVIEW |
| **detail_page_needed** | yes — draft exists: `docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md` |
| **detail_url** | /calendar/uae-e-invoicing-2026-asp-deadline (when imported) |
| **cta_rule** | WhatsApp (compliance advisory) |
| **en_copy** | draft complete |
| **ru_copy** | draft complete |
| **seo_rag** | very high |
| **social** | medium |
| **monetization** | high |
| **notes** | Applies ONLY to large businesses (annual revenue ≥ AED 50M). SME deadline is March 31, 2027. Do not state "all UAE businesses." Fine for non-compliance: AED 5,000/month (Cabinet Resolution 106 of 2025). Recheck MoF source URL is still live before import. |
| **next_action** | Owner review → recheck MoF URL → import. |

---

### TAX-05D — E-invoicing Mandatory (Large Biz, Jan 1, 2027)

| Field | Value |
|---|---|
| **id** | TAX-05D |
| **title_en** | UAE E-Invoicing Mandatory: January 1, 2027 (Large Businesses) |
| **title_ru_draft** | Обязательный e-invoicing в ОАЭ: 1 января 2027 (крупный бизнес) |
| **date_start** | 2027-01-01 |
| **date_end** | 2027-01-01 |
| **month** | Jan |
| **location** | UAE-wide (annual revenue ≥ AED 50M) |
| **category** | compliance |
| **type** | calendar |
| **source_type** | official |
| **source_url** | https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ |
| **source_status** | official_confirmed — unchanged by May 2026 amendment |
| **risk** | high |
| **calendar_readiness** | FUTURE_2027 |
| **detail_page_needed** | no standalone — part of e-invoicing guide |
| **detail_url** | none |
| **cta_rule** | hidden |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | high |
| **social** | medium |
| **monetization** | high |
| **notes** | Import together with TAX-05C as a paired calendar package. Both 2026 (Oct 30 ASP) and 2027 (Jan 1 mandatory) dates should appear together. |
| **next_action** | Import alongside TAX-05C when owner approves. |

---

### DXB-01 — Cityscape Dubai 2026

| Field | Value |
|---|---|
| **id** | DXB-01 |
| **title_en** | Cityscape Dubai 2026 |
| **title_ru_draft** | Cityscape Dubai 2026: выставка недвижимости |
| **date_start** | TBC (Sep–Oct 2026) |
| **date_end** | TBC |
| **month** | Sep–Oct |
| **location** | Dubai (DWTC) |
| **category** | dubai-events |
| **type** | event + calendar |
| **source_type** | media_signal |
| **source_url** | https://www.cityscape.com/cityscape-global/ |
| **source_status** | dates not confirmed; check organizer site |
| **risk** | medium |
| **calendar_readiness** | SOURCE_NEEDED |
| **detail_page_needed** | yes (event page when dates confirmed) |
| **detail_url** | none |
| **cta_rule** | hidden until organizer confirms |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | high |
| **social** | medium |
| **monetization** | high (property investors, company setup) |
| **notes** | Do not state specific dates until organizer publishes. |
| **next_action** | Monitor cityscape.com monthly from July 2026. |

---

### DXB-02 — GITEX Global 2026

| Field | Value |
|---|---|
| **id** | DXB-02 |
| **title_en** | GITEX Global 2026, Dubai |
| **title_ru_draft** | GITEX Global 2026: технологическая выставка в Дубае |
| **date_start** | ~2026-10-13 |
| **date_end** | ~2026-10-17 |
| **month** | Oct |
| **location** | Dubai (DWTC) |
| **category** | dubai-events |
| **type** | event + calendar + offer |
| **source_type** | organizer (dates TBC for 2026) |
| **source_url** | https://www.gitex.com |
| **source_status** | annual event confirmed; 2026 exact dates not yet published by GITEX |
| **risk** | low |
| **calendar_readiness** | SOURCE_NEEDED |
| **detail_page_needed** | yes (event page + ticket CTA + company setup angle) |
| **detail_url** | none |
| **cta_rule** | hidden → details_coming → read_event (when confirmed) |
| **en_copy** | not started |
| **ru_copy** | not started |
| **seo_rag** | very high |
| **social** | high |
| **monetization** | high (free zone, company setup, visa) |
| **notes** | Venue confirmed: Dubai Exhibition Centre, Expo City Dubai (captured Phase 6C-25). Dates ~Oct 13–17 are estimated from historical pattern — not confirmed. |
| **next_action** | Monitor gitex.com monthly from July 2026; draft event page template now. |

---

### AUH-01 — Formula 1 Abu Dhabi Grand Prix 2026

| Field | Value |
|---|---|
| **id** | AUH-01 |
| **title_en** | Formula 1 Abu Dhabi Grand Prix 2026 |
| **title_ru_draft** | Формула 1 Гран-при Абу-Даби 2026 (Яс Марина) |
| **date_start** | ~2026-11-27 |
| **date_end** | ~2026-11-29 |
| **month** | Nov |
| **location** | Abu Dhabi (Yas Marina Circuit) — NOT Dubai |
| **category** | abu-dhabi |
| **type** | event + calendar + offer |
| **source_type** | organizer |
| **source_url** | https://www.formula1.com/en/racing/2026 |
| **source_status** | annual event confirmed; 2026 exact race weekend dates not captured |
| **risk** | low |
| **calendar_readiness** | SOURCE_NEEDED |
| **detail_page_needed** | yes — event page: tickets, transport from Dubai, where to stay |
| **detail_url** | existing draft: `events/formula-1-abu-dhabi-grand-prix-2026.md` (check if complete) |
| **cta_rule** | read_event (when imported) |
| **en_copy** | draft exists (check completeness) |
| **ru_copy** | not started |
| **seo_rag** | very high |
| **social** | very high |
| **monetization** | high (hotel, transport, experience packages) |
| **notes** | Always label as Abu Dhabi / Yas Island — never describe as Dubai event. Do not guarantee ticket prices. Existing draft file exists — verify completeness before import. |
| **next_action** | Confirm 2026 F1 calendar dates at formula1.com. Review existing draft. Import event when dates confirmed. |

---

### VIRAL-01 — UAE Long Weekends 2026–27

| Field | Value |
|---|---|
| **id** | VIRAL-01 |
| **title_en** | UAE Long Weekends 2026–2027: Your Complete Planning Guide |
| **title_ru_draft** | Длинные выходные в ОАЭ 2026–2027: полный список |
| **date_start** | N/A (yearly reference page, month: null) |
| **date_end** | N/A |
| **month** | null (yearly) |
| **location** | UAE-wide |
| **category** | viral |
| **type** | calendar_page (yearly) |
| **source_type** | derived (from FAHR/official public holiday schedule) |
| **source_url** | Calculated from confirmed public holidays |
| **source_status** | published — live in production |
| **risk** | low |
| **calendar_readiness** | ALREADY_LIVE |
| **detail_page_needed** | yes — live at `/calendar/uae-long-weekends-2026-2027` |
| **detail_url** | /calendar/uae-long-weekends-2026-2027 (live, index, follow) |
| **cta_rule** | read_guide |
| **en_copy** | published (body has double-hyphen drift — Phase 6C-50 DB write pending) |
| **ru_copy** | published (draft notes had internal language — Phase 6C-50 DB write pending) |
| **seo_rag** | very high |
| **social** | very high |
| **monetization** | medium |
| **notes** | **ALREADY LIVE (Phase 6C-62B):** Published as `uae-long-weekends-2026-2027`, `index, follow`. datesJson contains 4 entries: New Year 2026 (Jan 1), Eid Al Fitr 2026 (Mar 19–22), Commemoration Day (Dec 1 — note: stored as Dec 1, correct date is Nov 30), National Day (Dec 2–3). Body has copy drift (double hyphens) — Phase 6C-50 DB write planned. Do not reimport. |
| **next_action** | Monitor GSC. Phase 6C-50 DB write to fix copy drift. Correct Commemoration Day date from Dec 1 to Nov 30 in same write. |

---

## Items Classified INTERNAL_ONLY (Not for Public Calendar)

These items feed internal planning, Life Setup product pages, or business compliance calendars. They are not appropriate for the public calendar as standalone items at this stage.

| ID | Description | Future path |
|---|---|---|
| TAX-03 | VAT quarterly returns | Business Compliance Calendar when built |
| TAX-06 | ESR Annual Filing | Business Compliance Calendar |
| TAX-07 | UBO Annual Update | Business Compliance Calendar |
| TAX-08 | Trade license renewal | Dubai Life Setup module + guide |
| PROP-01 | 90-day rent renewal notice | Dubai Life Setup + guide |
| PROP-02 | Ejari 10-day registration | Dubai Life Setup + guide |
| DLS-07 | Visa annual renewal | Dubai Life Setup annual reminders module |
| DLS-08 | Emirates ID renewal | Dubai Life Setup annual reminders module |
| PET-04 | Annual rabies vaccination | Dubai Life Setup (pets module) |
| HOL-10 | Long weekend bridge planner | Feeds social posts; feeds VIRAL-01 content |

---

## Items Out of Scope for 2026 First Import Pass (2027 or Distant Future)

| ID | Description | Earliest import |
|---|---|---|
| HOL-07 | Ramadan 1448H | Dec 2026 (draft); Jan 2027 (import) |
| HOL-08 | Eid Al Fitr 2027 | Jan 2027 template; Mar 2027 import |
| HOL-09 | Eid Al Adha 2027 | Apr 2027 |
| DXB-07–11 | 2027 Dubai events | 2026 Q4 planning |
| TAX-05E/F | E-invoicing SME + govt deadlines | 2027 |

---

*Internal planning document — Phase 6C-62 — 2026-05-25. Not for publish. No admin action. No DB write.*
