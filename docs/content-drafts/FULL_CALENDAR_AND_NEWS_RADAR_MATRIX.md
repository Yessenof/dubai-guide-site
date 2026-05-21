# Full Calendar and News Radar Opportunity Matrix
# Phase 6C-32 — Dubai Guide Site (Guidex Consulting)

**Last updated:** 2026-05-20
**Horizon:** 2026-05-20 through 2027-Q2
**Scope:** UAE/Dubai/Abu Dhabi calendar, news radar, events, guides, Dubai Life Setup, offers, social, service paths
**Status of imported content:** Eid Al Adha 2026 (news + event + calendar) PUBLISHED to local DB — deploy pending

---

## P0 TECHNICAL LAUNCH BLOCKER

> **This blocker affects every item in this matrix. No SEO or RAG value from news/events/calendar can be realized until it is resolved.**

### Blocker: Hardcoded noindex in all three public route files

| Field | Detail |
|-------|--------|
| Affected files | `app/(public)/news/[slug]/page.tsx`, `app/(public)/events/[slug]/page.tsx`, `app/(public)/calendar/[slug]/page.tsx` |
| Issue | `robots: { index: false, follow: true }` is hardcoded in all three — DB `noindex` field is ignored at route level |
| Impact | All published news, event, and calendar pages are invisible to Google and AI crawlers regardless of DB state |
| Current status | Not fixed — code change required in a future phase |

### Required future code phase: Dynamic Index/Noindex Policy

| Rule | Logic |
|------|-------|
| EN page — can index | `status=published` AND `noindex=0` AND lifecycle allows (not past `noindex_after` date) |
| RU page — can index | `status=published` AND `ru_published=1` AND `noindex=0` AND lifecycle allows |
| Always noindex | `status=draft`, `status=archived`, `noindex=1`, past `noindex_after` date, no content |
| Offers | Noindex and archive after `valid_until` date |
| Calendar seed items | No detail page exists → must not create orphan SEO surface (noindex until detail page live) |
| No EN fallback on RU | If `ru_title` or `ru_body` empty → 404, not a thin page |
| Leaked drafts | If somehow a draft URL is accessible → must not index |

**Recommendation:** Resolve this blocker before the next content deploy. The entire news/events/calendar SEO surface is dead until this is fixed.

---

## Summary Index

| ID | Title EN (short) | Type | Category | Priority | Public Status | Imported |
|----|-----------------|------|----------|----------|---------------|---------|
| HOL-01 | Eid Al Adha 2026 | calendar+news+event | holidays | P0 | public_now | ✅ yes |
| HOL-02 | Islamic New Year 1448H | calendar+news | holidays | P1 | hold | no |
| HOL-03 | Mawlid Al-Nabi 1448H | calendar+news | holidays | P1 | hold | no |
| HOL-04 | Commemoration Day 2026 | calendar | holidays | P1 | future | no |
| HOL-05 | UAE National Day 2026 | calendar+news+event | holidays | P1 | future | no |
| HOL-06 | New Year 2027 | calendar | holidays | P2 | future | no |
| HOL-07 | Ramadan 1448H start | calendar+news | holidays | P1 | future | no |
| HOL-08 | Eid Al Fitr 2027 | calendar+news+event | holidays | P1 | future | no |
| HOL-09 | Eid Al Adha 2027 | calendar+news+event | holidays | P1 | future | no |
| HOL-10 | Long weekend bridge calculator | social+news | holidays | P1 | internal_only | no |
| DXB-01 | Cityscape Dubai 2026 | event+calendar | dubai-events | P2 | hold | no |
| DXB-02 | GITEX Global 2026 | event+calendar+offer | dubai-events | P1 | hold | no |
| DXB-03 | Dubai Fitness Challenge 2026 | event+social | dubai-events | P2 | hold | no |
| DXB-04 | Big 5 Dubai 2026 | event+calendar | dubai-events | P3 | hold | no |
| DXB-05 | Dubai Run 2026 | event+social | dubai-events | P3 | hold | no |
| DXB-06 | Dubai Shopping Festival 2026-27 | event+offer+social | dubai-events | P1 | future | no |
| DXB-07 | Dubai Marathon 2027 | event+calendar | dubai-events | P3 | future | no |
| DXB-08 | Dubai Food Festival 2027 | event+calendar | dubai-events | P3 | future | no |
| DXB-09 | Art Dubai 2027 | event+calendar | dubai-events | P3 | future | no |
| DXB-10 | Dubai World Cup 2027 | event+calendar | dubai-events | P3 | future | no |
| DXB-11 | Arabian Travel Market 2027 | event+calendar | dubai-events | P3 | future | no |
| AUH-01 | F1 Abu Dhabi Grand Prix 2026 | event+calendar+offer | abu-dhabi | P1 | hold | no |
| AUH-02 | ADIPEC 2026 | event+calendar | abu-dhabi | P2 | hold | no |
| AUH-03 | Abu Dhabi Art 2026 | event+calendar | abu-dhabi | P3 | hold | no |
| AUH-04 | Yas Island theme parks | guide+social | abu-dhabi | P3 | future | no |
| TAX-01 | Emiratisation mid-year quota (June 30) | calendar+news | compliance | P0 | news+itemA_owner_review_ready; itemB_hold | yes |
| TAX-02 | Corporate Tax FY2025 return (Sept 30) | calendar+news+guide | compliance | P0 | hold | no |
| TAX-03 | VAT quarterly returns 2026 | calendar | compliance | P1 | internal_only | no |
| TAX-04 | Emiratisation annual quota (Dec 31) | calendar+news | compliance | P1 | hold | no |
| TAX-05 | E-invoicing ASP deadline 2026 | calendar+news+guide | compliance | P0 | hold | no |
| TAX-06 | ESR annual filing | calendar | compliance | P2 | internal_only | no |
| TAX-07 | UBO annual update | calendar | compliance | P2 | internal_only | no |
| TAX-08 | Trade license renewal | life_setup+guide | compliance | P2 | future | no |
| PROP-01 | Rent renewal notice 90-day rule | life_setup+guide | property | P1 | future | no |
| PROP-02 | Ejari registration (10-day rule) | life_setup+guide | property | P1 | future | no |
| PROP-03 | RERA rental index 2026 | news+guide | property | P2 | hold | no |
| PROP-04 | DLD property transfer guide | guide | property | P2 | future | no |
| PROP-05 | Oqood off-plan registration | guide | property | P3 | future | no |
| DET-01 | DET holiday home permit renewal | life_setup+guide | tourism-property | P2 | future | no |
| DET-02 | DTCM STR compliance guide | guide | tourism-property | P2 | future | no |
| DET-03 | Tourism Dirham explained | guide+social | tourism-property | P3 | future | no |
| DET-04 | Holiday home income declaration | guide | tourism-property | P3 | future | no |
| DLS-01 | Pre-arrival visa planning module | life_setup+guide | dubai-life | P1 | future | no |
| DLS-02 | Emirates ID registration (0-30 days) | life_setup+guide | dubai-life | P1 | future | no |
| DLS-03 | Bank account opening (week 1) | life_setup+guide | dubai-life | P1 | future | no |
| DLS-04 | DEWA activation (before move-in) | life_setup+guide | dubai-life | P2 | future | no |
| DLS-05 | Driving license conversion (30-90 days) | life_setup+guide | dubai-life | P1 | future | no |
| DLS-06 | Health insurance activation | life_setup+guide | dubai-life | P1 | future | no |
| DLS-07 | Visa annual renewal reminder | life_setup+calendar | dubai-life | P1 | future | no |
| DLS-08 | Emirates ID renewal (before expiry) | life_setup+calendar | dubai-life | P1 | future | no |
| SCH-01 | School enrollment season Jan-Mar | calendar+guide | schools | P1 | future | no |
| SCH-02 | KHDA inspection results | news | schools | P2 | hold | no |
| SCH-03 | School fee cap decisions | news | schools | P2 | hold | no |
| SCH-04 | Back-to-school August planning | calendar+social | schools | P2 | future | no |
| SCH-05 | Summer programs June-August | calendar+social | schools | P3 | future | no |
| PET-01 | UAE pet import permit (MOCCAE) | guide+life_setup | pets | P2 | future | no |
| PET-02 | UAE pet vaccination requirements | guide | pets | P2 | future | no |
| PET-03 | Dubai Municipality pet registration | guide+life_setup | pets | P3 | future | no |
| PET-04 | Annual rabies vaccination reminder | life_setup+calendar | pets | P3 | future | no |
| TRN-01 | Dubai Metro new lines/expansion | news+monitor | transport | P2 | hold | no |
| TRN-02 | Etihad Rail passenger service | news+monitor | transport | P3 | hold | no |
| TRN-03 | Al Maktoum Airport expansion | news+monitor | transport | P2 | hold | no |
| TRN-04 | Salik system updates | news+guide | transport | P3 | hold | no |
| ATTR-01 | Dubai Creek Tower progress | news+monitor | attractions | P2 | hold | no |
| ATTR-02 | Palm Jebel Ali residential launch | news+monitor | attractions | P2 | hold | no |
| ATTR-03 | Wynn Marjan Island (RAK) | news+monitor | attractions | P2 | hold | no |
| ATTR-04 | Expo City Dubai events | calendar+event | attractions | P2 | hold | no |
| ATTR-05 | Dubai Islands development | news+monitor | attractions | P3 | hold | no |
| VIRAL-01 | UAE long weekend bridge calculator | calendar_page (yearly, month:null) | viral | P0 | import_path_decision_complete, preferred_path_calendar_reference | Phase 6C-45 |
| VIRAL-02 | UAE visa fee updates | news+guide | viral | P1 | hold | no |
| VIRAL-03 | Golden Visa expansion news | news+guide | viral | P1 | hold | no |
| VIRAL-04 | UAE real estate price index | news | viral | P2 | hold | no |
| VIRAL-05 | UAE global rankings | news+social | viral | P3 | hold | no |
| OFFER-01 | GITEX Global 2026 tickets | offer | offers | P2 | hold | no |
| OFFER-02 | F1 Abu Dhabi 2026 tickets | offer | offers | P2 | hold | no |
| OFFER-03 | DSF 2026-27 promotions | offer | offers | P2 | future | no |
| OFFER-04 | UAE attraction passes | offer | offers | P3 | future | no |
| SOC-01 | UAE long weekend dates 2026 | social+news | social | P0 | owner_review_ready | Phase 6C-40 — social hooks in VIRAL-01 guide |
| SOC-02 | Corporate tax: who pays? | social+guide | social | P1 | future | no |
| SOC-03 | Mainland vs free zone explained | social+guide | social | P1 | future | no |
| SOC-04 | Golden Visa: who qualifies 2026 | social+guide | social | P1 | future | no |
| SOC-05 | UAE weekend structure explained | social+guide | social | P2 | future | no |
| SOC-06 | How to check visa validity | social+guide | social | P1 | future | no |
| SVC-01 | Company setup consultation | service | service | P1 | future | no |
| SVC-02 | Visa assistance WhatsApp CTA | service | service | P1 | future | no |
| SVC-03 | Property investment consultation | service | service | P2 | future | no |
| SVC-04 | Tax advisory referral | service | service | P1 | future | no |
| SVC-05 | Document attestation guide+service | service+guide | service | P2 | future | no |

---

## Category 1: UAE Holidays and Islamic Dates

---

#### HOL-01 | Eid Al Adha 2026 (UAE Federal Holiday)

| Field | Value |
|-------|-------|
| title_ru_working | Ид аль-Адха 2026: федеральные выходные ОАЭ |
| type_candidate | calendar + news + event |
| emirate | UAE-wide |
| source_status | official_confirmed (FAHR, WAM) |
| source_urls | FAHR official announcement; WAM confirmation |
| date_type | fixed (confirmed, subject to moon sighting — already confirmed) |
| date_or_window | 2026-05-25 to 2026-05-29 (Eid begins 27 May) |
| calendar_public_status | **public_now** |
| detail_page_needed | yes |
| detail_url_now | yes — slug `uae-eid-al-adha-2026` (event) and `uae-eid-al-adha-2026-federal-holiday-long-break` (news) |
| CTA | read_news + read_event |
| SEO value | high |
| RAG/AEO value | high |
| viral/social value | medium |
| monetization | low |
| risk | low |
| blocked_claims | "9 days for everyone"; DGHR/KHDA unless official permalinks captured |
| next_action | Deploy to production (pending owner approval); resolve P0 noindex blocker first |
| priority | P0 |
| review_freq | Done — archive news and calendar after 2026-06-01 |
| expiry/archive | News: noindex_after 2026-06-01; Event: keep public (annual reference); Calendar: archive June 2026 |

---

#### HOL-02 | Islamic New Year 1448H (~17–18 July 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Исламский Новый год 1448 г. х. |
| type_candidate | calendar + news |
| emirate | UAE-wide |
| source_status | missing — official announcement expected ~2 weeks before date |
| source_urls | None yet. Expected from FAHR and UAE government channels |
| date_type | fixed (Islamic calendar — moon sighting) |
| date_or_window | ~2026-07-17 to 2026-07-18 |
| calendar_public_status | hold — add to public calendar only after FAHR/official confirmation |
| detail_page_needed | yes (short news post when confirmed) |
| detail_url_now | no |
| CTA | hidden until detail page live; then read_news |
| SEO value | medium |
| RAG/AEO value | medium |
| viral/social value | medium |
| monetization | none |
| risk | medium — do not publish date before official confirmation |
| blocked_claims | Do not state "holiday" until official circular confirms; may be public holiday for government only |
| next_action | Monitor FAHR from late June 2026; draft news post template ready to fill |
| priority | P1 |
| review_freq | Check weekly from July 1, 2026 |
| expiry/archive | Archive news after July 25, 2026; calendar item stays as historical reference |

---

#### HOL-03 | Mawlid Al-Nabi 1448H (~14–15 September 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Мавлид ан-Наби 1448 г. х. (День рождения Пророка) |
| type_candidate | calendar + news |
| emirate | UAE-wide |
| source_status | missing — official announcement expected ~2 weeks before |
| source_urls | None yet |
| date_type | fixed (Islamic calendar — moon sighting) |
| date_or_window | ~2026-09-14 to 2026-09-16 |
| calendar_public_status | hold — confirm via FAHR before public |
| detail_page_needed | yes (short news post when confirmed) |
| detail_url_now | no |
| CTA | hidden until confirmed |
| SEO value | medium |
| RAG/AEO value | medium |
| viral/social value | low |
| monetization | none |
| risk | medium — date is approximate, may shift by 1–2 days |
| blocked_claims | Do not confirm date until official UAE announcement |
| next_action | Monitor FAHR from Sept 1, 2026 |
| priority | P1 |
| review_freq | Weekly from Sept 1, 2026 |
| expiry/archive | Archive after Sept 22, 2026 |

---

#### HOL-04 | Commemoration Day 2026 (30 November)

| Field | Value |
|-------|-------|
| title_ru_working | День памяти мучеников ОАЭ 2026 |
| type_candidate | calendar |
| emirate | UAE-wide |
| source_status | official_confirmed (fixed annual date, no announcement required) |
| source_urls | Confirmed annually — no specific URL needed |
| date_type | fixed |
| date_or_window | 2026-11-30 |
| calendar_public_status | public_now (can add to calendar now as a fixed date) |
| detail_page_needed | no (calendar item only) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | low |
| RAG/AEO value | low |
| viral/social value | low |
| monetization | none |
| risk | low |
| blocked_claims | Do not add editorial commentary about the holiday's meaning |
| next_action | Add to calendar when calendar expanded beyond May 2026 |
| priority | P1 |
| review_freq | Annual |
| expiry/archive | Keep as annual fixed record |

---

#### HOL-05 | UAE National Day 2026 (2–3 December)

| Field | Value |
|-------|-------|
| title_ru_working | Национальный день ОАЭ 2026 |
| type_candidate | calendar + news + social |
| emirate | UAE-wide |
| source_status | official_confirmed (fixed annual date) |
| source_urls | Confirmed annually |
| date_type | fixed |
| date_or_window | 2026-12-02 to 2026-12-03 |
| calendar_public_status | public_now |
| detail_page_needed | yes (news post: holiday scope, fireworks, planning notes) |
| detail_url_now | no |
| CTA | hidden until news draft created |
| SEO value | high (high search volume annually) |
| RAG/AEO value | high |
| viral/social value | high |
| monetization | low |
| risk | low |
| blocked_claims | Do not state private sector holiday without official MoHRE confirmation (MoHRE typically aligns but must be confirmed annually) |
| next_action | Draft news post in October 2026; import when MoHRE confirmation received |
| priority | P1 |
| review_freq | Annual; check MoHRE/FAHR from October 2026 |
| expiry/archive | Archive news after Dec 10, 2026; calendar stays |

---

#### HOL-06 | New Year's Day 2027 (1 January)

| Field | Value |
|-------|-------|
| title_ru_working | Новый год 2027 в ОАЭ |
| type_candidate | calendar + social |
| emirate | UAE-wide |
| source_status | official_confirmed (fixed annual date) |
| source_urls | Confirmed — Jan 1 is statutory public holiday |
| date_type | fixed |
| date_or_window | 2027-01-01 |
| calendar_public_status | public_now (can add to calendar) |
| detail_page_needed | no (calendar item only; NYE guide/social is separate) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | low |
| RAG/AEO value | low |
| viral/social value | medium |
| monetization | none |
| risk | low |
| next_action | Add to calendar when 2027 calendar is built |
| priority | P2 |
| review_freq | Annual |
| expiry/archive | Keep |

---

#### HOL-07 | Ramadan 1448H Start (~6 February 2027)

| Field | Value |
|-------|-------|
| title_ru_working | Рамадан 2027 в ОАЭ: ориентировочные даты |
| type_candidate | calendar + news + guide |
| emirate | UAE-wide |
| source_status | missing — official announcement 1–2 days before |
| source_urls | None yet |
| date_type | fixed (moon sighting — approximate) |
| date_or_window | ~2027-02-06 to 2027-03-07 (30 days) |
| calendar_public_status | hold — confirm via official channels before public |
| detail_page_needed | yes (comprehensive Ramadan guide: working hours, dining, business impact) |
| detail_url_now | no |
| CTA | hidden until news/guide ready |
| SEO value | very high (high annual search volume) |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | medium (company setup, visa, and life setup queries peak before Ramadan) |
| risk | medium — dates approximate; working hours vary by sector and emirate |
| blocked_claims | Do not state specific working hours without MOHRE circular; do not state "all businesses close" |
| next_action | Start Ramadan guide draft Dec 2026; monitor official channels from Jan 2027 |
| priority | P1 |
| review_freq | Annual; monitor from Dec 2026 |
| expiry/archive | Archive working-hours news after Ramadan ends; keep guide public (annual) |

---

#### HOL-08 | Eid Al Fitr 2027 (~8–9 March 2027)

| Field | Value |
|-------|-------|
| title_ru_working | Ид аль-Фитр 2027: выходные ОАЭ |
| type_candidate | calendar + news + event |
| emirate | UAE-wide |
| source_status | missing — expected announcement 1–2 days before |
| source_urls | None yet |
| date_type | fixed (moon sighting — approximate) |
| date_or_window | ~2027-03-08 to 2027-03-12 |
| calendar_public_status | future |
| detail_page_needed | yes (same pattern as Eid Al Adha news+event+calendar) |
| detail_url_now | no |
| CTA | hidden until confirmed |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | low |
| risk | medium |
| blocked_claims | Do not confirm dates until official announcement |
| next_action | Build draft templates in Jan 2027 based on HOL-01 pattern |
| priority | P1 |
| review_freq | Monitor from Feb 2027 |
| expiry/archive | Archive after March 20, 2027 |

---

#### HOL-09 | Eid Al Adha 2027 (~17 May 2027)

| Field | Value |
|-------|-------|
| title_ru_working | Ид аль-Адха 2027: выходные ОАЭ |
| type_candidate | calendar + news + event |
| emirate | UAE-wide |
| source_status | missing — 12 months out |
| source_urls | None yet |
| date_type | fixed (moon sighting — approximate) |
| date_or_window | ~2027-05-17 |
| calendar_public_status | future |
| detail_page_needed | yes |
| detail_url_now | no |
| CTA | hidden |
| SEO value | very high (same as HOL-01) |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | low |
| risk | low (long lead time) |
| next_action | Reuse HOL-01 template structure; build from April 2027 |
| priority | P1 |
| review_freq | Annual |
| expiry/archive | Archive after June 2027 |

---

#### HOL-10 | UAE Long Weekend Bridge Planner (Meta-item)

| Field | Value |
|-------|-------|
| title_ru_working | Как выгодно использовать выходные в ОАЭ: длинные уикенды |
| type_candidate | social + news |
| emirate | UAE-wide |
| source_status | derived (from confirmed public holidays) |
| source_urls | Calculated from FAHR/public holiday schedule |
| date_type | relative (recalculated annually) |
| date_or_window | Full-year calculation for each year |
| calendar_public_status | internal_only — data feeds social posts, not a public calendar item |
| detail_page_needed | yes (dedicated page or guide: "UAE Long Weekends 2026–2027 — Your Complete Planning Guide") |
| detail_url_now | no |
| CTA | read_guide (when guide exists) |
| SEO value | very high (high-volume search; viral annually) |
| RAG/AEO value | very high |
| viral/social value | very high |
| monetization | medium (feeds travel planning, Yas Island, F1 tickets angle) |
| risk | low |
| blocked_claims | Do not include company-specific bridge days as "official"; only FAHR-confirmed public holidays count |
| next_action | Build dedicated guide page: "UAE Long Weekends 2026–2027" — list all bridge opportunities per holiday |
| priority | P1 |
| review_freq | Annual + whenever new holiday announced |
| expiry/archive | Update annually; keep public evergreen |

---

## Category 2: Dubai Events

---

#### DXB-01 | Cityscape Dubai 2026 (~September–October 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Cityscape Dubai 2026: выставка недвижимости |
| type_candidate | event + calendar |
| emirate | Dubai (DWTC) |
| source_status | media_signal — exact dates not yet announced on official site |
| source_urls | https://www.cityscape.com/cityscape-global/ — check for 2026 dates |
| date_type | range (approximate: typically September–October at DWTC) |
| date_or_window | Sept–Oct 2026 (TBC) |
| calendar_public_status | hold — add when organizer confirms |
| detail_page_needed | yes (event page: dates, who should attend, Dubai property context) |
| detail_url_now | no |
| CTA | hidden until confirmed |
| SEO value | high (property investors, company setup audience) |
| RAG/AEO value | medium |
| viral/social value | medium |
| monetization | high (property investment, company setup WhatsApp CTA) |
| risk | medium — event dates must be organizer-confirmed |
| blocked_claims | Do not state specific dates until organizer publishes |
| next_action | Monitor Cityscape official site monthly; capture dates when published |
| priority | P2 |
| review_freq | Monthly from July 2026 |
| expiry/archive | Archive after event; keep guide linkable |

---

#### DXB-02 | GITEX Global 2026 (October 2026, DWTC)

| Field | Value |
|-------|-------|
| title_ru_working | GITEX Global 2026: выставка технологий в Дубае |
| type_candidate | event + calendar + offer |
| emirate | Dubai (DWTC) |
| source_status | organizer_confirmed — GITEX is annually confirmed; 2026 dates expected ~October 13–17 |
| source_urls | https://www.gitex.com — check for 2026 registration |
| date_type | range |
| date_or_window | ~2026-10-13 to 2026-10-17 (TBC — confirm with organizer) |
| calendar_public_status | hold — add when GITEX publishes 2026 dates |
| detail_page_needed | yes (event page + ticket CTA + company setup angle for tech founders) |
| detail_url_now | no |
| CTA | hidden until dates confirmed; then details_coming, then read_event |
| SEO value | very high (global tech event; massive search volume) |
| RAG/AEO value | high |
| viral/social value | high |
| monetization | high (GITEX is key for company setup, free zone, visa queries) |
| risk | low (event reliably annual) |
| blocked_claims | Do not state specific dates until GITEX publishes; do not guarantee ticket prices |
| next_action | Monitor gitex.com from July 2026; draft event page template; ticket affiliate/CTA research |
| priority | P1 |
| review_freq | Monthly from July 2026 |
| expiry/archive | Archive after October 2026; keep company setup guide linkable |

---

#### DXB-03 | Dubai Fitness Challenge 2026 (October–November 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Дубайский фитнес-марафон 2026 |
| type_candidate | event + social |
| emirate | Dubai |
| source_status | media_signal — annually held; 2026 dates TBC |
| source_urls | https://www.dubaifitnesschallenge.com — check for 2026 dates |
| date_type | range (typically 30 days, starts late October) |
| date_or_window | ~2026-10-27 to 2026-11-25 |
| calendar_public_status | hold |
| detail_page_needed | no (social-first only; no guide needed) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | medium |
| RAG/AEO value | low |
| viral/social value | high (60 minutes of activity daily — widely shared) |
| monetization | low |
| risk | low |
| next_action | Monitor official site; use as social post only |
| priority | P2 |
| review_freq | Monthly from Sept 2026 |
| expiry/archive | Archive after November 2026 |

---

#### DXB-04 | Big 5 Dubai 2026 (November 2026, DWTC)

| Field | Value |
|-------|-------|
| title_ru_working | Big 5 Dubai 2026: строительная выставка |
| type_candidate | event + calendar |
| emirate | Dubai (DWTC) |
| source_status | media_signal |
| source_urls | https://www.thebig5.ae — check for 2026 dates |
| date_type | range (typically November at DWTC) |
| date_or_window | ~November 2026 |
| calendar_public_status | hold |
| detail_page_needed | no (monitor only; niche audience) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | low (niche) |
| RAG/AEO value | low |
| viral/social value | low |
| monetization | medium (construction/property setup angle) |
| risk | low |
| next_action | Monitor only |
| priority | P3 |
| review_freq | Quarterly |
| expiry/archive | Archive after November 2026 |

---

#### DXB-05 | Dubai Run 2026 (November 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Забег Дубай 2026 |
| type_candidate | event + social |
| emirate | Dubai (Sheikh Zayed Road / Downtown) |
| source_status | media_signal |
| source_urls | RTA / Dubai Run official channels |
| date_type | fixed (typically last Sunday of November) |
| date_or_window | ~2026-11-29 |
| calendar_public_status | hold |
| detail_page_needed | no |
| detail_url_now | no |
| CTA | hidden |
| SEO value | low |
| RAG/AEO value | low |
| viral/social value | medium |
| monetization | none |
| risk | low |
| next_action | Monitor RTA from October 2026 |
| priority | P3 |
| review_freq | Annual |
| expiry/archive | Archive after event |

---

#### DXB-06 | Dubai Shopping Festival 2026–27 (December 2026 – January 2027)

| Field | Value |
|-------|-------|
| title_ru_working | Дубайский торговый фестиваль 2026–27 |
| type_candidate | event + offer + social |
| emirate | Dubai |
| source_status | media_signal — DSF is annual; 2026-27 exact dates TBC |
| source_urls | https://www.visitdubai.com/en/dsf — check for 2026-27 dates |
| date_type | range |
| date_or_window | ~December 2026 – January 2027 (typically 4–5 weeks) |
| calendar_public_status | future |
| detail_page_needed | yes (event page + offers CTA) |
| detail_url_now | no |
| CTA | details_coming |
| SEO value | high |
| RAG/AEO value | medium |
| viral/social value | very high |
| monetization | medium (tourism, retail, dining) |
| risk | low |
| blocked_claims | Do not state specific discounts without retailer confirmation |
| next_action | Monitor Dubai Tourism from November 2026; draft DSF guide |
| priority | P1 |
| review_freq | Annual |
| expiry/archive | Archive after January 2027 |

---

#### DXB-07 to DXB-11 | Future Dubai Events (2027)

**DXB-07 Dubai Marathon 2027 (~January):** Annually first Sunday of January. Social + calendar. SEO: medium. Priority: P3. Monitor: Dubai Athletics from November 2026.

**DXB-08 Dubai Food Festival 2027 (~February–March):** Annual. Social + calendar. SEO: medium. Priority: P3.

**DXB-09 Art Dubai 2027 (~March):** DIFC venue. Annual. Niche art/culture audience. SEO: medium. Priority: P3.

**DXB-10 Dubai World Cup 2027 (~March, Meydan):** Horse racing. Major annual event. Social + event + calendar. High viral. SEO: high. Priority: P3.

**DXB-11 Arabian Travel Market 2027 (~May, DWTC):** Major travel trade show. Annual. B2B focus. SEO: medium. Priority: P3.

---

## Category 3: Abu Dhabi / Yas Island Events

> **Rule:** All Abu Dhabi items must be clearly labelled "Abu Dhabi" or "Yas Island" — never described as Dubai events.

---

#### AUH-01 | Formula 1 Abu Dhabi Grand Prix 2026 (~Late November–December 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Формула 1 Гран-при Абу-Даби 2026 (Яс Марина) |
| type_candidate | event + calendar + offer |
| emirate | Abu Dhabi (Yas Marina Circuit) |
| source_status | organizer_confirmed (F1 calendar annually published; 2026 exact dates TBC) |
| source_urls | https://www.formula1.com/en/racing/2026 — check for Abu Dhabi race date |
| date_type | fixed (announced by F1 in advance) |
| date_or_window | ~2026-11-27 to 2026-11-29 or ~Dec 2026 (TBC) |
| calendar_public_status | hold — add when F1 publishes 2026 calendar |
| detail_page_needed | yes (event page: Abu Dhabi F1 2026 — tickets, transport from Dubai, where to stay) |
| detail_url_now | no (existing draft: `events/formula-1-abu-dhabi-grand-prix-2026.md`) |
| CTA | read_event (when event page imported) |
| SEO value | very high |
| RAG/AEO value | high |
| viral/social value | very high |
| monetization | high (hotel, transport, experience packages) |
| risk | low |
| blocked_claims | Always label Abu Dhabi — not Dubai; do not guarantee ticket availability/prices |
| next_action | Import event draft (`formula-1-abu-dhabi-grand-prix-2026.md`) — check if draft is complete; confirm 2026 F1 calendar dates |
| priority | P1 |
| review_freq | Monthly from August 2026 |
| expiry/archive | Archive after race; keep Abu Dhabi travel guide linkable |

---

#### AUH-02 | ADIPEC 2026 (November 2026, Abu Dhabi)

| Field | Value |
|-------|-------|
| title_ru_working | ADIPEC 2026: нефтегазовая выставка Абу-Даби |
| type_candidate | event + calendar |
| emirate | Abu Dhabi (ADNEC) |
| source_status | organizer_confirmed (annual) |
| source_urls | https://www.adipec.com — check for 2026 dates |
| date_type | range (typically first or second week of November) |
| date_or_window | ~November 2026 |
| calendar_public_status | hold |
| detail_page_needed | no (niche B2B; monitor only unless energy company setup guide built) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | medium (niche) |
| RAG/AEO value | medium |
| viral/social value | low |
| monetization | medium (company setup for energy sector) |
| risk | low |
| next_action | Monitor only; flag if energy/oil sector guide planned |
| priority | P2 |
| review_freq | Annual |
| expiry/archive | Archive after November 2026 |

---

#### AUH-03 | Abu Dhabi Art 2026 (November 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Абу-Даби Арт 2026 |
| type_candidate | event + calendar |
| emirate | Abu Dhabi (Manarat Al Saadiyat) |
| source_status | organizer_confirmed (annual) |
| source_urls | https://www.abudhabiart.ae |
| date_type | range |
| date_or_window | ~November 2026 |
| calendar_public_status | hold |
| detail_page_needed | no |
| detail_url_now | no |
| CTA | hidden |
| SEO value | low (niche) |
| RAG/AEO value | low |
| viral/social value | medium |
| monetization | none |
| risk | low |
| next_action | Monitor only; social post if relevant |
| priority | P3 |
| review_freq | Annual |
| expiry/archive | Archive after event |

---

#### AUH-04 | Yas Island Theme Parks (Ongoing)

| Field | Value |
|-------|-------|
| title_ru_working | Парки развлечений острова Яс: Феррари Ворлд, Уорнер Брос, Яс Вотерворлд |
| type_candidate | guide + social |
| emirate | Abu Dhabi (Yas Island) |
| source_status | official_confirmed (parks are operational) |
| source_urls | https://www.ferrariworld.com, https://www.wbworldabudhabi.com, https://www.yaswaterworld.com |
| date_type | ongoing |
| date_or_window | Year-round |
| calendar_public_status | internal_only — no calendar item; guide only |
| detail_page_needed | yes (family day-trip guide: Dubai to Yas Island — all 3 parks, transport, tips) |
| detail_url_now | no |
| CTA | read_guide (when live) |
| SEO value | high (family travel; very high search volume) |
| RAG/AEO value | high |
| viral/social value | high |
| monetization | medium (affiliate/booking CTA) |
| risk | low |
| blocked_claims | Always label Abu Dhabi; do not give ticket prices without live source |
| next_action | Build Yas Island day-trip guide (high SEO value; family audience) |
| priority | P3 |
| review_freq | Annual |
| expiry/archive | Evergreen — update ticket prices annually |

---

## Category 4: Business, Compliance, and Tax Deadlines

---

#### TAX-01 | Emiratisation Mid-Year Quota Deadline (30 June 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Эмиратизация: контрольный срок 30 июня 2026 |
| type_candidate | calendar + news |
| emirate | UAE-wide (private sector, 50+ employees) |
| source_status | official_confirmed (MoHRE NAFIS programme policy) |
| source_urls | https://nafis.gov.ae; https://www.mohre.gov.ae |
| date_type | fixed |
| date_or_window | 2026-06-30 |
| calendar_public_status | draft_file_only — owner_review_required before import |
| detail_page_needed | yes — CREATED: `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` (Phase 6C-35) |
| detail_url_now | /news/uae-emiratisation-june-30-2026-deadline (planned — not yet imported) |
| CTA | WhatsApp (HR advisory CTA) |
| SEO value | high (B2B HR audience) |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | high (HR compliance, company setup, PRO services) |
| risk | high — legal/compliance claim; must cite MoHRE official source; do not state penalties without source |
| blocked_claims | Do not state specific fine amounts without MoHRE source; do not imply guaranteed penalties |
| next_action | Phase 6C-36 complete. Owner approves → import news + calendar Item A. Item B: HOLD — June 30 not confirmed for 20–49 band. Release Item B only when a 2026 MoHRE source confirms this band's deadline. |
| calendar_item_a | owner_review_ready — 50+ employees, 1% semi-annual, June 30 2026 confirmed |
| calendar_item_b | HOLD — 20–49 employees — June 30 2026 NOT confirmed from captured 2026-specific source |
| priority | P0 |
| review_freq | Quarterly (June 30, Sept 30, Dec 31, Mar 31) |
| expiry/archive | noindex_after: 2026-07-10; keep_public; link to TAX-04 (Dec 31) when created |
| phase_6c35_files | news: `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` | calendar: `docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md` | review: `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md` |

---

#### TAX-02 | Corporate Tax FY2025 Return Filing Deadline (30 September 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Корпоративный налог ОАЭ: подача декларации за 2025 год (до 30 сентября 2026) |
| type_candidate | calendar + news + guide |
| emirate | UAE-wide (all taxable entities) |
| source_status | official_confirmed (9-month rule from fiscal year end; FTA policy) |
| source_urls | https://tax.gov.ae (FTA); Federal Decree-Law No. 47 of 2022 |
| date_type | fixed |
| date_or_window | 2026-09-30 (for entities with Dec 31, 2025 fiscal year end) |
| calendar_public_status | hold — draft and verify before public |
| detail_page_needed | yes (news + guide: who must file, how to calculate, what counts as taxable profit, how to file on EmaraTax) |
| detail_url_now | no |
| CTA | WhatsApp (tax advisory CTA) |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | very high (tax advisory, accounting referral) |
| risk | high — tax claim; must cite FTA source; do not advise on specific liability |
| blocked_claims | Do not state specific tax amount for any company; do not advise "you owe X"; always recommend professional advice |
| next_action | Build Corporate Tax FY2025 guide with FTA sources; import by August 1, 2026 |
| priority | P0 |
| review_freq | Annual + monitor FTA for extensions/clarifications |
| expiry/archive | Archive news after Oct 10, 2026; keep guide evergreen |

---

#### TAX-03 | VAT Quarterly Return Deadlines 2026

| Field | Value |
|-------|-------|
| title_ru_working | НДС: квартальные декларации в ОАЭ 2026 |
| type_candidate | calendar |
| emirate | UAE-wide |
| source_status | official_confirmed (FTA) |
| source_urls | https://tax.gov.ae |
| date_type | fixed (28th of month following quarter end) |
| date_or_window | Q2: July 28 / Q3: October 28 / Q4: January 28, 2027 |
| calendar_public_status | internal_only — add to business compliance calendar when built; not a public calendar item |
| detail_page_needed | no (part of VAT guide; not a standalone news item) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | medium (evergreen compliance query) |
| RAG/AEO value | high |
| viral/social value | low |
| monetization | medium (accounting referral) |
| risk | medium — must note that registration type determines frequency |
| blocked_claims | Do not state deadlines apply to all businesses — only VAT-registered entities; monthly filers have different dates |
| next_action | Add to Business Compliance Calendar 2026-2027 when built |
| priority | P1 |
| review_freq | Quarterly |
| expiry/archive | Evergreen — update annually |

---

#### TAX-04 | Emiratisation Annual Quota Deadline (31 December 2026)

| Field | Value |
|-------|-------|
| title_ru_working | Эмиратизация: итоговый срок 31 декабря 2026 |
| type_candidate | calendar + news |
| emirate | UAE-wide |
| source_status | official_confirmed (MoHRE NAFIS) |
| source_urls | https://nafis.gov.ae |
| date_type | fixed |
| date_or_window | 2026-12-31 |
| calendar_public_status | hold |
| detail_page_needed | no (update to TAX-01 article; not separate) |
| detail_url_now | no |
| CTA | WhatsApp |
| SEO value | medium |
| RAG/AEO value | high |
| viral/social value | low |
| monetization | high |
| risk | high |
| blocked_claims | Same as TAX-01 |
| next_action | Recycle TAX-01 news post with updated date |
| priority | P1 |
| review_freq | Annual |
| expiry/archive | Archive after Jan 10, 2027 |

---

#### TAX-05 | E-invoicing ASP Integration Deadline 2026

| Field | Value |
|-------|-------|
| title_ru_working | Электронное выставление счетов в ОАЭ: дедлайн для крупного бизнеса 2026 |
| type_candidate | calendar + news + guide |
| emirate | UAE-wide (large businesses, Phase 1) |
| source_status | media_signal — FTA has announced framework; exact Phase 1 deadline requires official FTA source URL |
| source_urls | https://tax.gov.ae/en/e-invoicing.aspx (check for confirmed dates) |
| date_type | fixed (Phase 1 deadline TBC — confirm with FTA) |
| date_or_window | 2026 (exact date from FTA required) |
| calendar_public_status | hold — existing draft in `news/uae-e-invoicing-2026-asp-deadline-update.md`; import when owner approves |
| detail_page_needed | yes (draft exists) |
| detail_url_now | no — not imported yet |
| CTA | WhatsApp (tech/compliance CTA) |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | high (accounting software referral, compliance advisory) |
| risk | high — must use confirmed FTA source; date must be verified |
| blocked_claims | Do not state "all businesses must comply" — Phase 1 targets large businesses first |
| next_action | Owner decision required — three e-invoicing files ready for import (owner_review_ready since Phase 6C-25) |
| priority | P0 |
| review_freq | Monthly — FTA announcements |
| expiry/archive | Archive news after deadline; keep guide evergreen |

---

#### TAX-06 | ESR Annual Filing

| Field | Value |
|-------|-------|
| title_ru_working | Требования к экономическому присутствию (ESR) в ОАЭ: ежегодная отчётность |
| type_candidate | calendar |
| emirate | UAE-wide (relevant business activities) |
| source_status | official_confirmed (MoF policy) |
| source_urls | https://mof.gov.ae/economic-substance-requirements |
| date_type | relative (12 months after fiscal year end) |
| date_or_window | Varies by fiscal year end |
| calendar_public_status | internal_only |
| detail_page_needed | no (part of compliance guide) |
| detail_url_now | no |
| CTA | hidden |
| SEO value | medium |
| RAG/AEO value | high |
| viral/social value | none |
| monetization | medium |
| risk | high — must not advise on specific compliance; recommend professional review |
| next_action | Include in Business Compliance Calendar when built |
| priority | P2 |
| review_freq | Annual |
| expiry/archive | Evergreen |

---

#### TAX-07 | UBO Annual Update Requirement

| Field | Value |
|-------|-------|
| title_ru_working | Реестр конечных бенефициаров (UBO) в ОАЭ: ежегодное обновление |
| type_candidate | calendar |
| emirate | UAE-wide (mainland companies) |
| source_status | official_confirmed (Cabinet Resolution No. 58/2020) |
| source_urls | Ministry of Economy / MOEC |
| date_type | relative (annual update requirement) |
| date_or_window | Varies by company anniversary date |
| calendar_public_status | internal_only |
| detail_page_needed | no |
| detail_url_now | no |
| CTA | hidden |
| SEO value | medium |
| RAG/AEO value | medium |
| viral/social value | none |
| monetization | medium |
| risk | medium |
| next_action | Include in Business Compliance Calendar |
| priority | P2 |
| review_freq | Annual |
| expiry/archive | Evergreen |

---

#### TAX-08 | Trade License Renewal (Relative Reminder)

| Field | Value |
|-------|-------|
| title_ru_working | Продление торговой лицензии в Дубае: ежегодный срок |
| type_candidate | life_setup + guide |
| emirate | Dubai / UAE |
| source_status | official_confirmed (DED / DET / free zone authorities) |
| source_urls | https://www.dubaided.gov.ae |
| date_type | relative (1 year from issue date) |
| date_or_window | Relative: 30–60 days before expiry |
| calendar_public_status | internal_only (feeds Dubai Life Setup module) |
| detail_page_needed | yes (guide: how to renew a Dubai mainland trade license — DED process, fees, documents) |
| detail_url_now | no |
| CTA | read_guide + WhatsApp |
| SEO value | very high (evergreen; searched constantly) |
| RAG/AEO value | very high |
| viral/social value | low |
| monetization | very high (PRO services, company setup advisors) |
| risk | medium — fees and requirements may change; must cite DED source |
| next_action | Build DED trade license renewal guide (high priority — T2-01 in source sprint backlog) |
| priority | P2 |
| review_freq | When DED updates fees (typically annual) |
| expiry/archive | Evergreen |

---

## Category 5: Property — DLD, RERA, Ejari, Rent

---

#### PROP-01 | 90-Day Rent Increase Notice Rule

| Field | Value |
|-------|-------|
| title_ru_working | Правило 90 дней: уведомление об изменении арендной платы в Дубае |
| type_candidate | life_setup + guide |
| emirate | Dubai |
| source_status | official_confirmed (RERA Law No. 26 of 2007 as amended) |
| source_urls | https://www.rera.gov.ae |
| date_type | relative (90 days before lease end) |
| date_or_window | Relative |
| calendar_public_status | internal_only (feeds life_setup reminders) |
| detail_page_needed | yes (guide: how rent increases work in Dubai — RERA rental index, 90-day notice, dispute process) |
| detail_url_now | no |
| CTA | read_guide |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | medium (legal advisory referral) |
| risk | medium — rental law details must be accurate; cite RERA |
| blocked_claims | Do not state specific rent increase % without checking current RERA index; do not give legal advice |
| next_action | Build RERA rental index + 90-day notice guide |
| priority | P1 |
| review_freq | When RERA updates rental index (typically annual) |
| expiry/archive | Evergreen — update when RERA releases new index |

---

#### PROP-02 | Ejari Registration 10-Day Rule

| Field | Value |
|-------|-------|
| title_ru_working | Регистрация Ejari в течение 10 дней: как и зачем |
| type_candidate | life_setup + guide |
| emirate | Dubai |
| source_status | official_confirmed (Dubai tenancy law) |
| source_urls | https://ejari.gov.ae |
| date_type | relative (within 10 business days of signing lease) |
| date_or_window | Relative |
| calendar_public_status | internal_only |
| detail_page_needed | yes (guide: what is Ejari, how to register, fees, why required) |
| detail_url_now | no |
| CTA | read_guide |
| SEO value | very high (high search volume from expats) |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | medium |
| risk | low — straightforward official process |
| next_action | Build Ejari guide (high SEO value; frequently searched by new Dubai residents) |
| priority | P1 |
| review_freq | When Ejari process/fees change |
| expiry/archive | Evergreen |

---

#### PROP-03 | RERA Rental Index 2026 Update

| Field | Value |
|-------|-------|
| title_ru_working | Индекс арендной платы RERA 2026: актуальные данные |
| type_candidate | news + guide |
| emirate | Dubai |
| source_status | media_signal — RERA updates index annually; 2026 update TBC |
| source_urls | https://dubailand.gov.ae/en/eservices/rental-index |
| date_type | unknown (RERA publishes updates without fixed schedule) |
| date_or_window | 2026 (TBC) |
| calendar_public_status | hold |
| detail_page_needed | yes (news post when published; link to live DLD index tool) |
| detail_url_now | no |
| CTA | read_news (when live) |
| SEO value | high |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | medium |
| risk | medium — cite DLD/RERA directly; do not reproduce index without permission |
| next_action | Monitor DLD rental index portal monthly |
| priority | P2 |
| review_freq | Monthly |
| expiry/archive | Update news when index changes; keep guide evergreen |

---

#### PROP-04 | DLD Property Transfer Process (Guide)

| Field | Value |
|-------|-------|
| title_ru_working | Переоформление недвижимости в Дубае: процесс и сборы DLD |
| type_candidate | guide |
| emirate | Dubai |
| source_status | official_confirmed (DLD) |
| source_urls | https://dubailand.gov.ae |
| date_type | ongoing (process guide) |
| date_or_window | Evergreen |
| calendar_public_status | internal_only (no calendar item; guide only) |
| detail_page_needed | yes |
| detail_url_now | no |
| CTA | read_guide + WhatsApp |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | high (property transfer, real estate advisory) |
| risk | medium — fees subject to change |
| next_action | Build DLD transfer guide |
| priority | P2 |
| review_freq | When DLD updates fees |
| expiry/archive | Evergreen |

---

#### PROP-05 | Oqood Off-Plan Property Registration

| Field | Value |
|-------|-------|
| title_ru_working | Регистрация недвижимости на стадии строительства: Oqood в Дубае |
| type_candidate | guide |
| emirate | Dubai |
| source_status | official_confirmed (RERA / DLD) |
| source_urls | https://dubailand.gov.ae/en/eservices/oqood |
| date_type | ongoing |
| date_or_window | Evergreen |
| calendar_public_status | internal_only |
| detail_page_needed | yes |
| detail_url_now | no |
| CTA | read_guide + WhatsApp |
| SEO value | high |
| RAG/AEO value | high |
| viral/social value | low |
| monetization | high |
| risk | medium |
| next_action | Build Oqood guide |
| priority | P3 |
| review_freq | Annual |
| expiry/archive | Evergreen |

---

## Category 6: DET, Holiday Homes, Tourism Property

---

#### DET-01 | DET Holiday Home Permit Annual Renewal

| Field | Value |
|-------|-------|
| title_ru_working | Продление разрешения на краткосрочную аренду в Дубае (DET) |
| type_candidate | life_setup + guide |
| emirate | Dubai |
| source_status | official_confirmed (DET — Dubai Economy and Tourism, formerly DTCM) |
| source_urls | https://dubaihotels.visitdubai.com |
| date_type | relative (annual from issue date) |
| date_or_window | Relative |
| calendar_public_status | internal_only (feeds DLS holiday home owner module) |
| detail_page_needed | yes (guide: how to renew DET holiday home permit) |
| detail_url_now | no |
| CTA | read_guide + WhatsApp |
| SEO value | high |
| RAG/AEO value | high |
| viral/social value | low |
| monetization | high (PRO services, property management referral) |
| risk | medium — permit conditions may change |
| next_action | Build DET permit guide (holiday home owner audience is high-value) |
| priority | P2 |
| review_freq | Annual / when DET updates requirements |
| expiry/archive | Evergreen |

---

#### DET-02 to DET-04 | Holiday Home Compliance Items

**DET-02 DTCM STR Compliance Guide:** How to legally operate a short-term rental in Dubai. Official source: DET. High monetization (PRO + property management referral). Priority P2.

**DET-03 Tourism Dirham Fee Explained:** AED 10–20/night. Official source: DET. Social-first + guide. SEO: medium. Priority P3.

**DET-04 Holiday Home Income Declaration:** UAE corporate/income tax implications for holiday home income. High-risk claim; must not give tax advice. Source: FTA + DET. Refer to tax professional. Priority P3.

---

## Category 7: Dubai Life Setup — Relative Reminders

---

#### DLS-01 | Pre-Arrival: Visa Planning Module

| Field | Value |
|-------|-------|
| title_ru_working | До приезда в Дубай: какую визу выбрать |
| type_candidate | life_setup + guide |
| emirate | Dubai / UAE |
| source_status | official_confirmed (ICA, GDRFA, MOHRE) |
| source_urls | https://icp.gov.ae; https://gdrfad.gov.ae |
| date_type | relative (before departure) |
| date_or_window | Before arrival |
| calendar_public_status | internal_only |
| detail_page_needed | yes (guide: visa options for Dubai — employment, investor, remote work, tourist, golden) |
| detail_url_now | yes (employment visa guide exists; expand) |
| CTA | read_guide + WhatsApp |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | very high |
| risk | medium — visa rules change; always cite official ICA/GDRFA source |
| next_action | Build visa comparison guide or Life Setup hub; existing employment visa guide is foundation |
| priority | P1 |
| review_freq | Quarterly |
| expiry/archive | Evergreen — update when visa categories change |

---

#### DLS-02 | Emirates ID Registration (Days 0–30)

| Field | Value |
|-------|-------|
| title_ru_working | Оформление Emirates ID: пошаговый гид для новых резидентов |
| type_candidate | life_setup + guide |
| emirate | Dubai / UAE |
| source_status | official_confirmed (ICA) |
| source_urls | https://icp.gov.ae |
| date_type | relative (within 30 days of residence visa stamping) |
| date_or_window | 0–30 days after visa |
| calendar_public_status | internal_only |
| detail_page_needed | yes (guide: how to get Emirates ID — ICA app, biometrics, fees, timeline) |
| detail_url_now | no |
| CTA | read_guide |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | medium |
| risk | low |
| next_action | Build Emirates ID registration guide |
| priority | P1 |
| review_freq | When ICA changes process |
| expiry/archive | Evergreen |

---

#### DLS-03 | Bank Account Opening (Week 1)

| Field | Value |
|-------|-------|
| title_ru_working | Как открыть счёт в банке в ОАЭ: гид для резидентов |
| type_candidate | life_setup + guide |
| emirate | Dubai / UAE |
| source_status | derived (Central Bank of UAE + major bank requirements) |
| source_urls | https://www.centralbank.ae |
| date_type | relative (first week after arrival) |
| date_or_window | Week 1 |
| calendar_public_status | internal_only |
| detail_page_needed | yes (guide: how to open a bank account in UAE — requirements, documents, best banks) |
| detail_url_now | no |
| CTA | read_guide |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | medium (banking referral) |
| risk | medium — requirements vary by bank; do not recommend specific bank |
| next_action | Build UAE bank account guide |
| priority | P1 |
| review_freq | Annual |
| expiry/archive | Evergreen |

---

#### DLS-04 to DLS-08 | Additional Life Setup Items

**DLS-04 DEWA Activation (Before Move-in):** Electricity + water connection. Official source: DEWA app. SEO: high. Monetization: low. Priority P2.

**DLS-05 Driving License Conversion (30–90 days):** RTA process for eligible nationality holders. Official source: RTA. SEO: very high. Monetization: medium. Priority P1. Existing guide candidates.

**DLS-06 Health Insurance Activation:** Employer-sponsored vs personal. DHA mandatory in Dubai. SEO: high. Monetization: high (insurance referral). Risk: medium. Priority P1.

**DLS-07 Visa Annual Renewal Reminder:** Relative — 60 days before expiry. GDRFA / Amer / Tasheel. Feeds life_setup calendar. Priority P1.

**DLS-08 Emirates ID Renewal (Before Expiry):** ICA process. Relative. SEO: very high. Priority P1.

---

## Category 8: Schools and Family (KHDA)

---

#### SCH-01 | School Enrollment Season (January–March)

| Field | Value |
|-------|-------|
| title_ru_working | Запись в школу в Дубае: сроки подачи заявлений |
| type_candidate | calendar + guide |
| emirate | Dubai (KHDA-regulated private schools) |
| source_status | official_confirmed (KHDA annual cycle) |
| source_urls | https://www.khda.gov.ae |
| date_type | range (annually January–March for September intake) |
| date_or_window | January–March annually |
| calendar_public_status | future (add when 2027 school year enrollment opens) |
| detail_page_needed | yes (guide: how to enroll a child in a Dubai private school — KHDA, curriculum types, fees) |
| detail_url_now | no |
| CTA | read_guide |
| SEO value | very high (family audience; high search volume) |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | medium (education advisory) |
| risk | medium — do not recommend specific schools; cite KHDA ratings |
| blocked_claims | Do not give specific school fee amounts without source; do not guarantee enrollment |
| next_action | Build Dubai private schools enrollment guide; link to KHDA school ratings tool |
| priority | P1 |
| review_freq | Annual (January each year) |
| expiry/archive | Update annually |

---

#### SCH-02 to SCH-05 | Additional Schools Items

**SCH-02 KHDA Inspection Results:** Annual ratings published by KHDA. news + SEO. Source: khda.gov.ae. Priority P2.

**SCH-03 School Fee Cap Decisions:** KHDA/KHDA PCA decides annually (typically March–April). news. Source: KHDA. Priority P2.

**SCH-04 Back-to-School August Planning:** Calendar + social. Fixed (September intake). social. SEO: high. Priority P2.

**SCH-05 Summer Programs June–August:** Calendar + social. DCC, GEMS, third-party camps. Source: organizers. Priority P3.

---

## Category 9: Pet Relocation and Registration

---

#### PET-01 | UAE Pet Import — MOCCAE Permit

| Field | Value |
|-------|-------|
| title_ru_working | Ввоз домашних животных в ОАЭ: разрешение MOCCAE |
| type_candidate | guide + life_setup |
| emirate | UAE-wide |
| source_status | official_confirmed (Ministry of Climate Change and Environment — MOCCAE) |
| source_urls | https://www.moccae.gov.ae/en/services/import-export-service/import-pets-to-uae.aspx |
| date_type | relative (before travel) |
| date_or_window | Before arrival |
| calendar_public_status | internal_only |
| detail_page_needed | yes (guide: how to bring your pet to Dubai/UAE — MOCCAE permit, microchip, vaccinations, quarantine) |
| detail_url_now | no |
| CTA | read_guide |
| SEO value | high |
| RAG/AEO value | very high |
| viral/social value | medium |
| monetization | medium |
| risk | medium — requirements differ by species, nationality, departure country |
| blocked_claims | Do not state "no quarantine required" without MOCCAE confirmation per specific case |
| next_action | Build UAE pet import guide (popular query; niche but high-intent) |
| priority | P2 |
| review_freq | Annual (MOCCAE updates periodically) |
| expiry/archive | Evergreen |

---

#### PET-02 to PET-04 | Additional Pet Items

**PET-02 Vaccination Requirements:** Rabies, core vaccines required. MOCCAE source. Part of PET-01 guide. Priority P2.

**PET-03 Dubai Municipality Pet Registration:** Annual registration for dogs/cats. Source: Dubai Municipality. SEO: medium. Priority P3.

**PET-04 Annual Rabies Vaccination Reminder:** Relative calendar reminder for existing pet owners. Internal only — feeds DLS calendar. Priority P3.

---

## Category 10: Transport and Infrastructure

---

#### TRN-01 | Dubai Metro Expansion

| Field | Value |
|-------|-------|
| title_ru_working | Расширение метро Дубая: обновления 2026 |
| type_candidate | news + monitor |
| emirate | Dubai (RTA) |
| source_status | media_signal — RTA announces expansion phases; Blue Line under development |
| source_urls | https://rta.ae — check RTA news |
| date_type | unknown (phased delivery TBD) |
| date_or_window | TBD |
| calendar_public_status | hold — add only when RTA confirms opening date |
| detail_page_needed | yes (news post when any new station or line opens) |
| detail_url_now | no |
| CTA | read_news (when live) |
| SEO value | high |
| RAG/AEO value | high |
| viral/social value | high |
| monetization | low |
| risk | medium — do not state delivery dates without RTA confirmation |
| blocked_claims | Do not state Blue Line opening date without official RTA source |
| next_action | Monitor RTA news feed |
| priority | P2 |
| review_freq | Monthly |
| expiry/archive | Archive news after each opening; keep Dubai transport guide evergreen |

---

#### TRN-02 to TRN-04 | Additional Transport Items

**TRN-02 Etihad Rail Passenger Service:** Freight operational; passenger TBD. media_signal. Do not state passenger launch date without official announcement. Priority P3.

**TRN-03 Al Maktoum Airport (DWC) Expansion:** Large-scale project. media_signal. Do not state completion date without UAE government announcement. Priority P2.

**TRN-04 Salik System Updates:** New gates, zone changes. RTA source. news. Priority P3.

---

## Category 11: New Attractions and Mega Projects

---

#### ATTR-01 | Dubai Creek Tower Progress

| Field | Value |
|-------|-------|
| title_ru_working | Башня Дубайский Крик: ход строительства 2026 |
| type_candidate | news + monitor |
| emirate | Dubai (Dubai Creek Harbour) |
| source_status | media_signal — construction ongoing; official milestones from Emaar/RTA |
| source_urls | https://www.dubaicreetower.com (check); Emaar official channels |
| date_type | unknown |
| date_or_window | Completion TBD (multi-year project) |
| calendar_public_status | hold |
| detail_page_needed | yes (news when milestone announced) |
| detail_url_now | no |
| CTA | read_news |
| SEO value | high |
| RAG/AEO value | high |
| viral/social value | very high |
| monetization | medium (property investment angle) |
| risk | medium — do not state height/opening date without Emaar source |
| blocked_claims | Do not confirm it will be "tallest building in the world" without official confirmed specs |
| next_action | Monitor Emaar announcements quarterly |
| priority | P2 |
| review_freq | Quarterly |
| expiry/archive | Keep as live project monitor |

---

#### ATTR-02 to ATTR-05 | Additional Attraction Items

**ATTR-02 Palm Jebel Ali Residential Launch:** Nakheel / PJA. media_signal. High-intent property investor audience. news + property guide CTA. Priority P2.

**ATTR-03 Wynn Marjan Island (Ras Al Khaimah):** Note: this is RAK, not Dubai. Must be labelled RAK clearly. Casino and resort. media_signal. High viral/social. Priority P2.

**ATTR-04 Expo City Dubai Events:** Ongoing events, exhibitions, GITEX co-location. organizer_confirmed for specific events. calendar + event. Priority P2.

**ATTR-05 Dubai Islands Development:** Formerly known as Deira Islands. Shoreline Developers / Dubai Properties. media_signal. news + property angle. Priority P3.

---

## Category 12: Viral UAE / Dubai / Abu Dhabi News

---

#### VIRAL-01 | UAE Long Weekend Bridge Calculator (2026)

| Field | Value |
|-------|-------|
| title_ru_working | Длинные уикенды в ОАЭ 2026–2027: полный список |
| type_candidate | calendar_pages, calendarType: `"yearly"`, month: null — confirmed safe; no code/schema change needed |
| emirate | UAE-wide |
| source_status | FAHR-verified; source ledger exists (Phase 6C-40) |
| source_urls | FAHR public holiday schedule (updated with each announcement) |
| date_type | derived |
| date_or_window | Full calendar year 2026 (2027 dates not yet confirmed) |
| calendar_public_status | import_path_decision_complete — preferred_path_calendar_reference — DO NOT IMPORT AS NEWS |
| target_url | /calendar/uae-long-weekends-2026-2027 |
| detail_page_needed | yes — renders at /calendar/[slug] after import |
| detail_url_now | no (pending D-1–D-5 owner decisions) |
| CTA | CalendarContextCta (date pills) + WhatsApp |
| SEO value | very high (massive annual search; viral every time holiday announced) |
| RAG/AEO value | very high (AI assistants are asked this constantly) |
| viral/social value | very high |
| monetization | medium (travel, F1 tickets, Yas Island angle) |
| risk | low |
| blocked_claims | Eid Al Adha excluded from datesJson (already in may-2026-uae-calendar); 2027 dates not confirmed; Islamic New Year / Prophet Birthday not confirmed — do not include |
| datesJson_scope | 4 items: New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3 |
| owner_decisions_open | D-1 through D-5 (D-6 resolved by code inspection) |
| next_action | Owner reviews import map (docs/content-drafts/reviews/uae-long-weekends-calendar-reference-import-map.md) + approves D-1–D-5; then import via /admin/content |
| priority | P0 |
| review_freq | Every time new holiday is officially announced |
| expiry/archive | Update annually; keep evergreen |
| Phase 6C-43 update | 2026-05-21 — Import path decision completed. Recommended: calendar_pages with calendarType "annual". Draft: docs/content-drafts/guides/uae-long-weekends-2026-2027.md. 6 owner decisions required before import. Status: import_path_pending. |
| Phase 6C-45 update | 2026-05-21 — CORRECTION: calendarType must be "yearly" (not "annual" — invalid value). Code inspection confirmed: month: null is fully safe across all rendering paths. D-6 resolved. Import map created at docs/content-drafts/reviews/uae-long-weekends-calendar-reference-import-map.md. Eid Al Adha excluded from datesJson. Status: import_path_decision_complete. |

---

#### VIRAL-02 to VIRAL-05 | Other Viral News Signals

**VIRAL-02 UAE Visa Fee / Category Updates:** news. Monitor ICA and MoHRE. media_signal initially. High RAG/AEO. Priority P1.

**VIRAL-03 Golden Visa Expansion / New Categories:** news + guide. Monitor ICA. media_signal. Very high SEO. Build Golden Visa eligibility guide. Priority P1.

**VIRAL-04 UAE Real Estate Price Index Updates:** news. Dubai Land Department / ValuStrat / CBRE. media_signal. High property audience. Priority P2.

**VIRAL-05 UAE Global Rankings (logistics, expat, quality of life, fintech):** social. Monitor World Bank, Mercer, IMD, GSCI. Lower SEO but strong social signal. Priority P3.

---

## Category 13: Offers and Deals

> **Rule:** All offers must include `valid_from`, `valid_until`, and `expires_at`. Noindex and archive after `valid_until`. Never show offer on calendar after expiry.

---

#### OFFER-01 | GITEX Global 2026 — Tickets and Registration

| Field | Value |
|-------|-------|
| title_ru_working | GITEX Global 2026: билеты и регистрация |
| type_candidate | offer |
| emirate | Dubai (DWTC) |
| source_status | hold — depends on DXB-02 (GITEX event page) being live first |
| source_urls | https://www.gitex.com (registration) |
| date_type | range |
| date_or_window | valid_from: TBC / valid_until: event date / expires_at: event last day |
| calendar_public_status | hold — add only when GITEX dates confirmed and event page live |
| detail_page_needed | no (offer item links to GITEX event page) |
| detail_url_now | no |
| CTA | read_event (links to GITEX event page) |
| SEO value | medium |
| RAG/AEO value | low |
| viral/social value | medium |
| monetization | low (no affiliate; brand positioning) |
| risk | low |
| next_action | Depends on DXB-02; do not create before event page confirmed |
| priority | P2 |
| review_freq | Monthly from July 2026 |
| expiry/archive | Noindex after GITEX ends; archive offer item |

---

#### OFFER-02 | F1 Abu Dhabi Grand Prix 2026 — Tickets

| Field | Value |
|-------|-------|
| title_ru_working | Билеты на Формула-1 в Абу-Даби 2026 |
| type_candidate | offer |
| emirate | Abu Dhabi (Yas Marina) |
| source_status | hold — depends on AUH-01 event page |
| source_urls | https://www.yasmarinacircuit.com/en/f1 |
| date_type | range |
| date_or_window | valid_from: when tickets go on sale / valid_until: race date |
| calendar_public_status | hold |
| detail_page_needed | no (links to AUH-01 event page) |
| detail_url_now | no |
| CTA | read_event |
| SEO value | high |
| RAG/AEO value | medium |
| viral/social value | high |
| monetization | medium |
| risk | low |
| next_action | Import AUH-01 first; then link ticket CTA |
| priority | P2 |
| review_freq | Monthly from August 2026 |
| expiry/archive | Noindex after race; archive |

---

#### OFFER-03 to OFFER-04 | Other Offers

**OFFER-03 DSF 2026-27 Promotions:** Offer. valid_from: DSF start / valid_until: DSF end. Source: Dubai Tourism official. Do not list specific retailer discounts without source. Noindex after DSF ends. Priority P2.

**OFFER-04 UAE Attraction Passes (Dubai Pass, etc.):** Offer. ongoing/seasonal. Source: operator. Do not guarantee discount amounts. Noindex if expired. Priority P3.

---

## Category 14: Social-First Explainers

> These are short-form content pieces designed for social media, AI assistant discovery, and high-intent search queries. Each needs a matching guide or news post to be safe to publish.

---

#### SOC-01 | UAE Long Weekends — Social Explainer

| Field | Value |
|-------|-------|
| title_ru_working | Длинные уикенды в ОАЭ: как планировать отдых |
| type_candidate | social + news |
| emirate | UAE-wide |
| source_status | derived (from HOL-10 research) |
| date_type | annual |
| calendar_public_status | internal_only |
| detail_page_needed | yes (VIRAL-01 guide) |
| CTA | read_guide |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | very high |
| monetization | medium |
| next_action | Build VIRAL-01 guide; then social posts pull from it |
| priority | P0 |

---

#### SOC-02 | UAE Corporate Tax — Who Pays It?

| Field | Value |
|-------|-------|
| title_ru_working | Корпоративный налог в ОАЭ: кто платит? |
| type_candidate | social + guide |
| emirate | UAE-wide |
| source_status | official_confirmed (FTA) |
| detail_page_needed | yes (existing or new Corporate Tax guide) |
| CTA | read_guide + WhatsApp |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | very high |
| risk | high — must not advise on specific liability; cite FTA |
| next_action | Build or extend Corporate Tax guide; social post pulls key facts |
| priority | P1 |

---

#### SOC-03 | Mainland vs Free Zone — Explained

| Field | Value |
|-------|-------|
| title_ru_working | Материковая компания vs свободная зона в ОАЭ: что выбрать |
| type_candidate | social + guide |
| emirate | UAE |
| source_status | derived (DED + DIFC + ADGM + free zone authorities) |
| detail_page_needed | yes (comparison guide — existing mainland and free zone guides cover this partially) |
| CTA | read_guide + WhatsApp |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | high |
| monetization | very high |
| risk | medium — avoid "always choose X" framing |
| next_action | Build comparison guide |
| priority | P1 |

---

#### SOC-04 | Golden Visa — Who Qualifies in 2026

| Field | Value |
|-------|-------|
| title_ru_working | Золотая виза ОАЭ 2026: кто имеет право |
| type_candidate | social + guide |
| emirate | UAE |
| source_status | official_confirmed (ICA + General Directorate of Residency and Foreigners Affairs) |
| source_urls | https://icp.gov.ae/en/goldenresidency |
| detail_page_needed | yes (existing golden-visa-dubai-property guide covers one path; need comprehensive guide) |
| CTA | read_guide + WhatsApp |
| SEO value | very high |
| RAG/AEO value | very high |
| viral/social value | very high |
| monetization | very high |
| risk | medium — criteria may expand/change; always cite ICA |
| next_action | Expand golden visa guide to cover all 6+ categories |
| priority | P1 |

---

#### SOC-05 to SOC-06 | Additional Social Explainers

**SOC-05 UAE Weekend Structure:** Friday–Saturday vs Saturday–Sunday. government vs private. Social. Source: MOHRE/FAHR. SEO: medium. Priority P2.

**SOC-06 How to Check Visa Validity:** GDRFA Dubai app / ICA ICP app. Social. Source: ICA/GDRFA. SEO: very high. Priority P1.

---

## Category 15: Service and Monetization Opportunities

---

#### SVC-01 | Company Setup Consultation CTA

| Field | Value |
|-------|-------|
| title_ru_working | Открытие компании в Дубае: бесплатная консультация |
| type_candidate | service |
| emirate | Dubai / UAE |
| source_status | n/a (internal service CTA) |
| detail_page_needed | no (CTA button; appears on relevant guides and event pages) |
| CTA | WhatsApp |
| monetization | very high |
| risk | low |
| next_action | Ensure WhatsApp CTA appears on: mainland guide, free zone guide, GITEX event page, corporate tax guide |
| priority | P1 |

---

#### SVC-02 | Visa Assistance — WhatsApp CTA

| Field | Value |
|-------|-------|
| title_ru_working | Помощь с оформлением визы в ОАЭ |
| type_candidate | service |
| emirate | Dubai / UAE |
| detail_page_needed | no (appears on visa-related guides) |
| CTA | WhatsApp |
| monetization | very high |
| next_action | Ensure CTA on: employment visa, golden visa, spouse/child dependent visa guides |
| priority | P1 |

---

#### SVC-03 to SVC-05 | Other Service Paths

**SVC-03 Property Investment Consultation:** CTA on property and Cityscape content. monetization: high. Priority P2.

**SVC-04 Tax Advisory Referral:** CTA on corporate tax, VAT, e-invoicing content. monetization: very high. Risk: must not give tax advice directly. Priority P1.

**SVC-05 Document Attestation Guide + Service:** Existing guide covers process. Service CTA for readers who need professional help. monetization: medium. Priority P2.

---

## Opportunity Cluster Summary

### Cluster A — Immediate (within 2 weeks)
| ID | Item | Why urgent |
|----|------|-----------|
| HOL-01 | Eid Al Adha 2026 | Imported — deploy to production now (holiday is May 25) |
| TAX-01 | Emiratisation mid-year quota | Phase 6C-36 QA done. News + Item A: owner_review_ready. Item B: HOLD. |
| VIRAL-01 | Long weekend guide 2026 | Highest SEO ROI — build and publish immediately |
| P0 blocker | noindex fix | All content invisible until this is resolved |

### Cluster B — Next 60 Days (June–July 2026)
| ID | Item | Why |
|----|------|-----|
| TAX-02 | Corporate Tax FY2025 deadline | Sept 30 deadline — build now, publish by Aug 1 |
| TAX-05 | E-invoicing deadline | Owner-review-ready since Phase 6C-25; import now |
| HOL-02 | Islamic New Year (~July 17) | Monitor + draft template; quick win when official |
| SOC-04 | Golden Visa expansion | High viral; expand existing guide |
| DXB-02 | GITEX 2026 | Monitor; draft template when dates confirmed |

### Cluster C — Q3 2026 (July–September 2026)
| ID | Item | Why |
|----|------|-----|
| HOL-03 | Mawlid Al-Nabi (~Sept 15) | Monitor from Sept 1 |
| AUH-01 | F1 Abu Dhabi 2026 | Confirm dates; import existing draft |
| DXB-01 | Cityscape Dubai 2026 | Monitor; event page + property CTA |
| PROP-01 | Rent renewal guide | Evergreen; high traffic |
| SCH-01 | School enrollment guide | High family audience value |

### Cluster D — Q4 2026 (October–December 2026)
| ID | Item | Why |
|----|------|-----|
| HOL-04 | Commemoration Day Nov 30 | Calendar item |
| HOL-05 | UAE National Day Dec 2–3 | News + event; high search volume |
| DXB-06 | Dubai Shopping Festival | Event + offer launch |
| TAX-04 | Emiratisation Dec 31 quota | Recycle TAX-01 content |

---

*Matrix version: 1.2 — Phase 6C-36 (2026-05-20). TAX-01 updated: news + calendar Item A → owner_review_ready; calendar Item B → HOLD (June 30 not confirmed for 20–49 band). Review and update when new official sources captured.*
