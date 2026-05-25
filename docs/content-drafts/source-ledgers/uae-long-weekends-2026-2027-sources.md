# UAE Public Holidays 2026-2027 Source Ledger

## Ledger status

```
ledger_type:           source_ledger
topic:                 UAE public holidays 2026-2027 — federal and private sector holiday dates
status:                source_ledger
publish_status:        not_for_publish_yet
risk_level:            medium_high
verification_required: true
last_reviewed:         2026-05-25
owner_review_required: true
recheck_schedule:      every_fahr_announcement + 2026-11-01 (National Day/Commemoration scope)
```

---

## Source summary

Three official FAHR announcements are captured for 2026 federal holiday dates. Islamic calendar dates for the rest of 2026 and all of 2027 are monitoring-only — no FAHR confirmation yet. Fixed-date holidays (Commemoration Day, National Day, New Year) are governed by Cabinet Resolution No. 27 of 2024 but their 2026 holiday scope has not yet been announced by FAHR. This ledger documents what is confirmed, what is monitoring, and what is blocked.

---

## Captured official sources

---

### Source 1 — FAHR New Year 2026 Announcement

| Field | Value |
|---|---|
| Authority | FAHR — Federal Authority for Government Human Resources |
| Purpose | Confirms New Year 2026 holiday date for UAE federal government entities |
| Claim it supports | Federal government holiday: Thursday 1 January 2026. Federal employees worked remotely on Friday 2 January 2026 (not a full public holiday). |
| Source type | official |
| Reliability | official |
| URL | https://www.fahr.gov.ae/en/news/fahr-announces-new-year-2026-holiday-for-the-federal-government/ |
| Access date | 2026-05-20 |
| HTTP status | 200 — verified |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

**Exact claim confirmed on page:** "FAHR announced that the New Year 2026 holiday for the federal government will be on Thursday, 1 January 2026. Work on Friday, 2 January 2026, will be conducted remotely for federal government employees, except for those whose nature of work requires otherwise."

**Scope:** Federal government entities only. Private sector New Year 2026 holiday: MoHRE announcement not separately captured in this ledger.

**Long weekend impact:** Thursday holiday + remote Friday + Saturday-Sunday weekend = 4-day break window for federal employees. Friday was not an official public holiday — remote working arrangement only.

---

### Source 2 — FAHR Eid Al Fitr 2026 Announcement

| Field | Value |
|---|---|
| Authority | FAHR — Federal Authority for Government Human Resources |
| Purpose | Confirms Eid Al Fitr 2026 holiday dates for UAE federal government entities |
| Claim it supports | Federal government holiday: Thursday 19 March to Sunday 22 March 2026. Work resumes Monday 23 March 2026. |
| Source type | official |
| Reliability | official |
| URL | https://www.fahr.gov.ae/en/news/eid-al-fitr-holiday-in-the-federal-government-from-19-to-22-march-2026/ |
| Governing framework | Cabinet Resolution No. (27) of 2024 concerning official holidays in the UAE |
| Access date | 2026-05-20 |
| HTTP status | 200 — verified |
| Verification status | captured_url_present — recheck_before_publish |
| Re-check before publish | Yes |

**Exact claim confirmed on page:** "The Eid Al-Fitr holiday for the UAE federal government for the year 1447 AH will commence on Thursday, 19 March 2026, and continue until Sunday, 22 March 2026. Official working hours will resume on Monday, 23 March 2026."

**Scope:** Federal government entities only. Private sector Eid Al Fitr 2026: MoHRE URL not captured in this ledger. A MoHRE announcement exists but the URL has not been directly verified.

**Long weekend impact:** Holiday ran Thursday to Sunday — the break ends on Sunday naturally. 4-day break for federal sector. No bridge day needed as Sunday is already the last day before return to work Monday.

**Note on dates:** This holiday is past (March 2026). Included for historical completeness and to support an evergreen 2026 overview guide.

---

### Source 3 — FAHR Eid Al Adha 2026 Announcement

| Field | Value |
|---|---|
| Authority | FAHR — Federal Authority for Government Human Resources |
| Purpose | Confirms Eid Al Adha 2026 holiday dates for UAE federal government entities |
| Claim it supports | Federal government holiday: Monday 25 May to Friday 29 May 2026. Work resumes Monday 1 June 2026. |
| Source type | official |
| Reliability | official |
| URL | https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/ |
| Access date | 2026-05-18 (previously captured; verified 2026-05-20) |
| HTTP status | 200 — verified |
| Verification status | captured_url_present — recheck_before_publish |
| Previously captured | Yes — in eid-al-adha-2026-sources.md (Phase 6C-22) |
| Re-check before publish | Yes |

**Scope:** Federal government entities (FAHR). Private sector: MoHRE confirmed Tuesday 26 May to Friday 29 May 2026 (Arabic source — see eid-al-adha-2026-sources.md).

**Long weekend impact:** Federal: 5-day holiday + preceding Sat-Sun (23-24 May) = 9-day planning window. Private sector: 4-day holiday + preceding Sat-Sun = 8-day window.

**Status on production:** Published to live site as part of Phase 6C-34. See `/news/uae-eid-al-adha-2026-federal-holiday-long-break` and `/calendar/may-2026-uae-calendar`.

---

### Source 4 — WAM Eid Al Fitr 2026 crescent sighting

| Field | Value |
|---|---|
| Authority | WAM — Emirates News Agency (state news agency) |
| Purpose | Confirms Eid Al Fitr 2026 start date in UAE via crescent sighting |
| Claim it supports | Eid Al Fitr 2026 begins Thursday 19 March in UAE — confirmed by UAE Council for Fatwa |
| Source type | official |
| Reliability | official |
| URL | Not separately captured in this ledger — FAHR Eid Al Fitr announcement (Source 2) is the primary confirmed source |
| Access date | N/A |
| Verification status | not_separately_captured — FAHR URL is primary |
| Re-check before publish | Use FAHR URL as primary |

---

### Source 5 — Cabinet Resolution No. 27 of 2024 (governing framework)

| Field | Value |
|---|---|
| Authority | UAE Cabinet |
| Purpose | Establishes the official UAE public holiday framework governing all holiday announcements |
| Claim it supports | UAE official holiday framework — all FAHR holiday announcements are issued under this Resolution |
| Source type | government |
| Reliability | official |
| URL | Referenced in FAHR Eid Al Fitr 2026 announcement (Source 2). Direct URL via uaelegislation.gov.ae returning 403 as of 2026-05-20. |
| Access date | 2026-05-20 |
| Verification status | confirmed_via_fahr_reference — direct_url_inaccessible (403) |
| Re-check before publish | Note: cite as "Cabinet Resolution No. (27) of 2024" per FAHR's own reference in its announcements. Do not cite a direct legislation URL until accessible. |

**Confirmed via FAHR page text:** "The Authority's circular was issued pursuant to Cabinet Resolution No. (27) of 2024 concerning official holidays in the UAE."

---

### Source 6 — u.ae Public Holidays Framework Page

| Field | Value |
|---|---|
| Authority | UAE Government official portal |
| Purpose | Lists recurring UAE public holidays by Islamic calendar anchor and fixed dates |
| Claim it supports | Framework listing of UAE recurring public holidays — fixed and Islamic calendar |
| Source type | government |
| Reliability | official |
| URL | https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays |
| Access date | 2026-05-20 |
| HTTP status | 200 — verified |
| Verification status | confirmed — renders via JavaScript, text not easily extracted by curl but page confirmed live |
| Re-check before publish | Yes — confirm the page lists Commemoration Day and National Day as official holidays |

**Holiday types confirmed by framework (from agent research):**
- New Year Day: 1 January
- Eid Al Fitr: 29 Ramadan to 3 Shawwal (scope confirmed per FAHR annual announcement)
- Arafah Day and Eid Al Adha: 9-12 Dhu Al Hijjah (scope confirmed per FAHR annual announcement)
- Hijri New Year: 1 Muharram
- Prophet Muhammad's Birthday: 12 Rabi' Al-Awwal
- Commemoration Day: 1 December (fixed)
- National Day: 2-3 December (fixed)

---

## 2026 holiday status by date

| Holiday | Date | Day(s) of week | Federal sector status | Private sector status | Source status |
|---------|------|---------------|----------------------|----------------------|---------------|
| New Year 2026 | Jan 1 | Thursday | Confirmed: 1 day + remote Fri | Not captured | FAHR URL ✓ |
| Eid Al Fitr 2026 | Mar 19-22 | Thu-Sun | Confirmed: 4 days | Not captured | FAHR URL ✓ |
| Eid Al Adha 2026 | May 25-29 | Mon-Fri | Confirmed: 5 days | Confirmed: Tue 26-Fri 29 (MoHRE Arabic) | FAHR + MoHRE URLs ✓ |
| Islamic New Year 1448H | ~Jun 16-17 | ~Tue-Wed | Monitoring — no FAHR announcement | Monitoring | Not yet confirmed |
| Mawlid An-Nabi 1448H | ~Aug 25 | ~Tue | Monitoring — no FAHR announcement | Monitoring | Not yet confirmed |
| Commemoration Day | Dec 1 | Tuesday | Fixed date by statute; FAHR 2026 scope not yet announced | Fixed date by statute; MoHRE 2026 scope not yet announced | Framework ✓; 2026-specific announcement pending |
| National Day | Dec 2-3 | Wed-Thu | Fixed dates by statute; FAHR 2026 scope not yet announced | Fixed dates by statute; MoHRE 2026 scope not yet announced | Framework ✓; 2026-specific announcement pending |

---

## 2027 holiday status

All 2027 Islamic holiday dates are provisional (moon-dependent). No FAHR 2027 announcements exist as of May 2026.

| Holiday | Estimated date | Day of week | Status |
|---------|---------------|-------------|--------|
| New Year 2027 | Jan 1 | Friday | Fixed date; FAHR 2027 announcement expected Nov-Dec 2026 |
| Eid Al Fitr 2027 | ~Mar 8-11 | ~Sun-Wed | Provisional — moon-dependent |
| Eid Al Adha 2027 | ~May 15-19 | ~Sat-Wed | Provisional — moon-dependent |
| Islamic New Year 1449H | ~Jun 5-7 | ~Sat-Mon | Provisional — moon-dependent |
| Mawlid An-Nabi 1449H | ~Aug 14-17 | ~Fri-Mon | Provisional — moon-dependent |
| Commemoration Day | Dec 1 | Wednesday | Fixed date by statute; FAHR 2027 announcement expected Nov 2027 |
| National Day | Dec 2-3 | Thu-Fri | Fixed dates by statute; FAHR 2027 announcement expected Nov 2027 |

**Important:** Estimated Islamic holiday dates for 2027 are derived from Islamic calendar converters. They must not be published as confirmed without official FAHR/WAM announcements. Moon-sighting can shift dates by 1-2 days from estimates.

---

## Long weekend analysis: confirmed 2026 dates

| Holiday | Period | Days off (federal) | Long weekend? | Notes |
|---------|--------|--------------------|---------------|-------|
| New Year 2026 | Jan 1 (Thu) | 1 day + remote Fri | Effective 4-day window | Remote Fri + Sat-Sun. Remote ≠ public holiday. |
| Eid Al Fitr 2026 | Mar 19-22 (Thu-Sun) | 4 days | Yes — naturally ends Sunday | Already a 4-day break; no bridge needed |
| Eid Al Adha 2026 | May 25-29 (Mon-Fri) | 5 days | Yes — extends full week | With preceding Sat-Sun = 9-day planning window for federal sector |

---

## Long weekend analysis: monitoring 2026 dates

| Holiday | Estimated period | Day(s) | Long weekend potential | What to watch |
|---------|-----------------|--------|----------------------|---------------|
| Islamic New Year 1448H | ~Jun 16-17 | ~Tue-Wed | Low — mid-week standalone | FAHR announcement expected ~2 weeks before date |
| Mawlid An-Nabi 1448H | ~Aug 25 | ~Tue | Low — mid-week standalone | FAHR announcement expected ~2 weeks before date |
| Commemoration Day + National Day | Dec 1-3 | Tue-Thu | Medium — bridge-dependent | If FAHR adds Friday Dec 4 as bridge: 6-day break. Without bridge: 3 holidays + gap before Sat-Sun. Watch FAHR November announcement. |

---

## Claims allowed now

The following claims may appear in draft content. Publishing requires owner review.

1. New Year 2026: Federal government holiday on Thursday 1 January 2026. Federal employees worked remotely on Friday 2 January (not a full public holiday).
2. Eid Al Fitr 2026: Federal government holiday from Thursday 19 March to Sunday 22 March 2026. Work resumed Monday 23 March. Source: FAHR.
3. Eid Al Adha 2026: Federal government holiday from Monday 25 May to Friday 29 May 2026. Private sector (MoHRE): Tuesday 26 May to Friday 29 May 2026.
4. Commemoration Day is 1 December (fixed date by UAE statute per Cabinet Resolution 27/2024). The 2026 holiday scope for federal and private sector has not yet been announced by FAHR or MoHRE. **Phase 6C-63 note:** Nov 30 is the national occasion/observance date; Dec 1 is the public holiday/day-off date. The Long Weekends datesJson correctly stores `2026-12-01`. A Phase 6C-62B claim that this was a data error (should be Nov 30) has been retracted. No date correction is needed. The Phase 6C-50 DB write should soften label language and fix `--` style only.
5. UAE National Day is 2-3 December (fixed dates by UAE statute). The 2026 holiday scope has not yet been announced by FAHR or MoHRE.
6. New Year 2027 falls on Friday 1 January 2027. The 2027 holiday scope has not yet been announced by FAHR.
7. Islamic calendar holidays (Islamic New Year, Mawlid, Eid Al Fitr 2027, Eid Al Adha 2027) are confirmed annually by UAE authorities following moon sighting. Estimated dates exist but must not be presented as confirmed.
8. The UAE public holiday framework is governed by Cabinet Resolution No. (27) of 2024.

---

## Claims not allowed

- Any Islamic holiday date for 2026-2027 presented as confirmed before FAHR/WAM official announcement
- Private sector Eid Al Fitr 2026 dates without MoHRE URL captured
- "FAHR confirmed National Day 2026 holiday period" — no announcement yet
- "Commemoration Day 2026 is a public holiday with X days off" — scope not announced
- "New Year 2027 is a public holiday" — FAHR 2027 announcement pending
- Day-of-week analysis presented as "confirmed" for Islamic dates (only for fixed-date statutory holidays)
- "Everyone gets X days off" for any holiday — scope differs by sector
- "All government services are closed" without individual authority confirmation

---

## Sources still needed before publish

| Item | Status | Action |
|------|--------|--------|
| MoHRE Eid Al Fitr 2026 private sector dates | Not captured | Find and verify MoHRE Arabic announcement URL for Eid Al Fitr 2026 |
| FAHR Commemoration Day 2026 announcement | Pending — expected Nov 2026 | Monitor fahr.gov.ae/en/news from October 2026 |
| FAHR National Day 2026 announcement | Pending — expected Nov 2026 | Monitor fahr.gov.ae/en/news from October 2026 |
| FAHR Islamic New Year 1448H 2026 announcement | Pending — expected ~2 weeks before date (~June 2026) | Monitor fahr.gov.ae/en/news from late May 2026 |
| FAHR Mawlid 1448H 2026 announcement | Pending — expected ~August 2026 | Monitor fahr.gov.ae/en/news from July 2026 |
| Cabinet Resolution 27/2024 direct URL | Portal returning 403 | Try again; cite via FAHR reference in the interim |

---

## Related draft files

| File | Status | Relationship |
|------|--------|-------------|
| `docs/content-drafts/guides/uae-long-weekends-2026-2027.md` | draft_file_only — created Phase 6C-40 | Primary guide — this ledger supplies source verification |
| `docs/content-drafts/reviews/uae-long-weekends-2026-2027-owner-review.md` | draft_file_only — created Phase 6C-40 | Owner review for the guide |
| `docs/content-drafts/source-ledgers/eid-al-adha-2026-sources.md` | existing ledger | Eid Al Adha 2026 detailed source ledger (Source 3 above) |

---

## Recheck schedule

| Trigger | Action |
|---------|--------|
| ~June 2026 | Check FAHR and WAM for Islamic New Year 1448H announcement. Update source ledger. |
| ~August 2026 | Check FAHR and WAM for Mawlid An-Nabi 1448H announcement. Update source ledger. |
| October-November 2026 | Check FAHR for Commemoration Day and National Day 2026 holiday scope announcement. |
| November-December 2026 | Check FAHR for New Year 2027 announcement. |
| 2027 as Islamic holidays approach | Check FAHR and WAM for 2027 Eid Al Fitr, Eid Al Adha, Islamic New Year, Mawlid confirmations. |

---

*This is a source ledger — internal use only. Nothing in this file is published. No admin action. No DB write.*
*Created: 2026-05-20 (Phase 6C-40). Updated: 2026-05-25 (Phase 6C-63 — Commemoration Day date semantic clarification). Captures FAHR New Year 2026 (URL verified), Eid Al Fitr 2026 (URL verified), Eid Al Adha 2026 (from prior ledger), and UAE holiday framework (u.ae). All other 2026-2027 holiday dates are monitoring-only.*
