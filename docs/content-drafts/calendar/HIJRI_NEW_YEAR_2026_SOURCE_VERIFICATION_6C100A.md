# Hijri New Year 2026 — Source Verification
## Phase 6C-100A | Date: 2026-06-09

---

## Summary

**Holiday:** Hijri New Year 1448 AH (1 Muharram 1448)
**Date:** Monday, 15 June 2026
**Work resumes:** Tuesday, 16 June 2026
**Scope:** UAE federal government + private sector (FAHR + MoHRE); Dubai Government (DGHR); schools/universities (KHDA)
**Long weekend for Sat-Sun workers:** Yes — 3-day break (Sat 13 + Sun 14 + Mon 15 June)

**Item was MISSING from Guidex** local DB and production DB at phase start. June calendar page `june-2026-dubai-calendar` had no public holiday entry for June 15.

---

## Final source status

**MEDIA_CONFIRMED_OFFICIAL_ANNOUNCEMENT_CITED + OFFICIAL_SOCIAL_SIGNAL_FOUND**

Multiple tier-1 UAE newspapers (Gulf News, Khaleej Times, The National) confirmed this holiday 3-6 days before today (June 9), citing FAHR and MoHRE as the announcing authorities. UAE Media Office (@UAEmediaoffice on X/Twitter) also confirmed the holiday — this constitutes an official social signal from a government communications authority. No direct fahr.gov.ae or mohre.gov.ae press release URL was found via fetch (FAHR/MoHRE news sections appear JavaScript-rendered; specific article URLs could not be confirmed via curl/fetch).

**What this classification means:**
- MEDIA_CONFIRMED: Three independent tier-1 outlets confirmed the date
- OFFICIAL_ANNOUNCEMENT_CITED: Outlets specifically attribute the announcement to FAHR + MoHRE
- OFFICIAL_SOCIAL_SIGNAL_FOUND: UAE Media Office (@UAEmediaoffice) posted confirmation — this is a verified government social channel, not a private account
- NOT: DIRECT_PRESS_RELEASE_URL — no direct fahr.gov.ae/mohre.gov.ae article URL was verified

---

## Source table

| Source | Type | URL | Confirms | HTTP | Usable |
|---|---|---|---|---|---|
| Gulf News | Tier-1 UAE media (cited by FAHR/MoHRE joint announcement) | https://gulfnews.com/uae/uae-declares-monday-a-public-holiday-for-islamic-new-year-1.500562040 | June 15 public holiday, Hijri 1448, federal + private sector, return June 16 | 200 ✓ | YES — primary source_url |
| Khaleej Times | Tier-1 UAE media | https://www.khaleejtimes.com/uae/uae-announces-hijri-new-year-holiday-for-public-and-private-sectors-on-june-15 | "Monday, June 15, will be an official holiday marking the Islamic New Year 1448 for federal government entities and the private sector" | 200 ✓ | YES — corroboration |
| The National | Tier-1 UAE media (Abu Dhabi Media) | https://www.thenationalnews.com/news/uae/2026/06/03/islamic-new-year-holiday-announced-for-public-and-private-sector/ | "Islamic New Year holiday announced for public and private sectors" — article dated June 03, 2026 | 200 ✓ | YES — corroboration |
| FAHR official site | Official government authority | https://www.fahr.gov.ae/en/media-center/news/ | Site live (200); specific June 15 article URL not found via fetch; content JS-rendered | 200 ✓ | Partial — site confirmed, article URL not verified |
| MoHRE official site | Official government authority | https://www.mohre.gov.ae/en/media-center/news/ | Site live (200); specific June 15 article URL not found via fetch | 200 ✓ | Partial — site confirmed, article URL not verified |
| u.ae public holidays | Official UAE Government Portal | https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays | Confirms Hijri New Year is an annual UAE public holiday category; specific 2026 date JS-rendered | 200 ✓ | YES — legal framework confirming annual holiday status |
| Gulf News (Dubai DGHR) | Tier-1 UAE media | https://gulfnews.com/uae/dubai-announces-islamic-new-year-holiday-1.500567017 | Dubai Government holiday June 15 (DGHR) | 200 ✓ | YES — Dubai sector corroboration |

---

## Source risk assessment

| Risk | Level | Notes |
|---|---|---|
| Date is incorrect | Very low | Three independent tier-1 media confirm same date; holiday falls Monday after Sat-Sun weekend (calendar-consistent) |
| Scope overstated | Low | Gulf News specifically says "federal government entities and private sector establishments" — do not claim "all schools" unless KHDA cited specifically |
| Official URL missing | Medium | No direct FAHR/MoHRE press release URL verified. Mitigation: use Gulf News URL as source_url; state source as media_citing_official |
| Moon sighting change | Very low | UAE has pre-announced the date. Hijri New Year in UAE is pre-set by calendar, not subject to local moon sighting for public holiday scheduling |

---

## Exact date and wording allowed

**Date:** Monday, 15 June 2026

**Allowed claims:**
- UAE public holiday for Hijri New Year 1448 AH
- Applies to federal government entities (FAHR announcement)
- Applies to private sector establishments (MoHRE confirmation)
- Applies to Dubai Government (DGHR announcement)
- Work resumes Tuesday, 16 June for standard schedules
- 3-day break for those with Sat-Sun weekends
- Hijri New Year marks 1 Muharram, the first day of the Islamic calendar year

**Blocked claims (unless official source found):**
- All schools/universities closed (KHDA-specific — available in media but KHDA URL not verified)
- All shifts and essential services closed (they may follow separate arrangements)
- Public holiday falls on 1 Muharram exactly (pre-set calendar date; moon sighting didn't determine this specific announcement)
- Long weekend for "everyone" (Saturday-Sunday workers only)

---

## EN/RU notes

- EN: Official English name used: "Hijri New Year" (also acceptable: "Islamic New Year")
- RU: Use "исламский Новый год" or "Новый год хиджры" — both are established Russian equivalents
- Do not use "Мухаррам" as the holiday name in RU; use as explanatory context only
- RU body must be natural Russian, not direct translation

---

## Calendar import recommendation

**Status: PROCEED**

Add new entry to existing `june-2026-dubai-calendar` page's dates_json:
- id: JUN-15-HIJRI
- type: "public-holiday" (match existing pattern — hyphen, not underscore)
- date: 2026-06-15
- priority: 1 (above other June 15 entries)
- source_url: Gulf News URL

Update `has_islamic_dates` on the june-2026-dubai-calendar page to 1 (was 0).

---

## News import recommendation

**Status: PROCEED**

Create news post `uae-hijri-new-year-holiday-june-15-2026`:
- category: "government"
- noindex: 0 (standard — publish normally)
- source_label: "media_citing_official"
- source_url: Gulf News URL (primary)
- ru_published: 1
- date_published: 2026-06-09

Archival logic: Post can be set to noindex after June 16, 2026 (holiday past). Archive action: keep (as historical reference).

---

## Radar failure notes

This holiday was announced approximately June 3, 2026 (The National article date). Guidex had no mechanism to catch this. The daily radar docs exist but were not actively monitored for FAHR/MoHRE announcements. The June calendar page was imported before the holiday was announced.

Full radar gap analysis: `docs/content-drafts/seo/PUBLIC_HOLIDAY_RADAR_GAP_FIX_6C100A.md`
