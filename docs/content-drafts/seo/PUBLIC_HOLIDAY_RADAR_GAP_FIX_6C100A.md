# Public Holiday Radar Gap Fix — Phase 6C-100A
## Date: 2026-06-09

---

## Why radar missed the Hijri New Year 2026 holiday

### Root cause

The June 2026 calendar page (`june-2026-dubai-calendar`) was imported before the Hijri New Year 1448 announcement was made. The announcement appeared around June 3, 2026 (based on The National article date). The calendar page was not revisited after import to check for new holiday announcements.

There is no automated or scheduled process to:
1. Watch FAHR/MoHRE news feeds for public holiday announcements
2. Match new announcements against existing calendar pages in the DB
3. Alert the owner when a confirmed public holiday falls within an already-published calendar range

The Hijri New Year is a recurring annual UAE public holiday that should have been pre-seeded in the June calendar as "upcoming" even before the specific date was confirmed.

### Secondary cause

The UAE public holiday list includes several Islamic holidays where exact annual dates are determined by the lunar calendar and announced by FAHR/MoHRE weeks or months in advance:
- Hijri New Year (1 Muharram) — typically late May to July depending on year
- Prophet's Birthday (12 Rabi' Al Awwal) — moves ~11 days earlier each Gregorian year
- Isra' Mi'raj (27 Rajab) — same drift
- Arafat Day / Eid Al Adha (9-13 Dhu al-Hijjah) — same drift

The current calendar import workflow treats each month as a standalone import event with no cross-check against the annual public holiday cycle.

---

## Required future source watchlist

### Tier 1 — Official sources (check within 24 hours of any public holiday announcement)

| Source | URL | What to monitor |
|---|---|---|
| FAHR news center | https://www.fahr.gov.ae/en/media-center/news/ | All holiday announcements for federal sector |
| MoHRE news center | https://www.mohre.gov.ae/en/media-center/news/ | Private sector holiday confirmations |
| DGHR (Dubai) | https://www.dghr.gov.ae/ | Dubai government holiday confirmations |
| Dubai Media Office | https://mediaoffice.ae/en/ | High-level Dubai government announcements |
| WAM (Emirates News Agency) | https://wam.ae/ | Official government wire — holiday circulars |
| UAE Government Portal | https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays | Annual public holiday list and updates |
| UAE Federal Legislation Portal | https://uaelegislation.gov.ae/ | Statutory holiday framework |

### Tier 2 — Media signals (use as trigger, verify against Tier 1)

| Source | URL | Reliability |
|---|---|---|
| Gulf News | https://gulfnews.com | Very high — consistently accurate, cites official sources by name |
| Khaleej Times | https://www.khaleejtimes.com | Very high — early reporting, cites authority |
| The National | https://www.thenationalnews.com | Very high — quality verification |
| Emirates247 | https://www.emirates247.com | High |
| Al Etihad | https://www.alettihad.ae | High (Arabic primary) |
| What's On UAE | https://whatson.ae | Medium — events, not compliance |
| Time Out Dubai | https://www.timeoutdubai.com | Medium — lifestyle angle |

---

## Daily search terms for public holiday radar

Run these searches when preparing or reviewing any calendar page covering the next 90 days:

```
"[month] UAE public holiday 2026"
"FAHR UAE holiday [month] 2026"
"MoHRE holiday [month] 2026"
"[Islamic holiday name] UAE 2026"
"Hijri New Year UAE [year]"
"Muharram UAE public holiday"
"Prophet's Birthday UAE 2026"
"Isra Mi'raj UAE 2026"
"Arafat Day UAE 2026"
"[month] long weekend UAE 2026"
```

---

## Annual Islamic public holiday checklist for calendar import

Every time a monthly calendar is imported, check whether the following annual holidays fall within or near the month:

| Holiday | Islamic date | Approx. 2026 date | Authority |
|---|---|---|---|
| UAE Founding Day | 2 Dec (Gregorian) | 2 Dec 2026 | Fixed |
| National Day | 3 Dec (Gregorian) | 3 Dec 2026 | Fixed |
| Commemoration Day | 1 Dec (Gregorian) | 1 Dec 2026 | Fixed |
| New Year's Day | 1 Jan (Gregorian) | 1 Jan 2027 | Fixed |
| Hijri New Year | 1 Muharram | ~Jun 15 2026 (1448) | FAHR + MoHRE |
| Prophet's Birthday | 12 Rabi' Al Awwal | ~Sep 4 2026 (1448) | FAHR + MoHRE |
| Isra' Mi'raj | 27 Rajab | ~Jan 27 2027 (1448) | FAHR + MoHRE |
| Arafat Day | 9 Dhu al-Hijjah | ~May 16 2027 (1448) | WAM |
| Eid Al Adha | 10-13 Dhu al-Hijjah | ~May 17-20 2027 (1448) | FAHR + MoHRE |
| Eid Al Fitr | 1 Shawwal | ~Mar 19-22 2026 confirmed | FAHR + MoHRE |

**Note:** Approximate Islamic dates shift ~11 days earlier per Gregorian year. Cross-check against Umm al-Qura calendar estimate before importing month.

---

## When to create an ACTION_REQUIRED pack

Create immediately when any of these signals appear:

1. FAHR announces a public holiday for a date within the next 90 days — even if month is not yet imported
2. MoHRE confirms a private sector holiday date
3. DGHR announces Dubai government holiday
4. WAM announces Eid start date (Arafat Day + Eid Al Adha follow automatically)
5. KHDA announces school holiday (separate from government holiday)
6. Any public holiday is transferred to a different day (e.g., holiday falls on weekend → moved to Thursday)
7. Any emergency/unplanned holiday is declared (national mourning, royal accession, etc.)

**Trigger threshold:** Within 90 days of holiday date → ACTION_REQUIRED. Beyond 90 days → WATCHLIST.

---

## How to prevent missing future holidays

### Step 1 — Pre-seed placeholder entries

When importing any monthly calendar, pre-seed all known annual public holidays for that month as `"confidence": "expected"` entries, even before the official announcement is made. Example:

```json
{
  "id": "JUL-27-ISLAMICNEWYEAR-PLACEHOLDER",
  "date": "2027-07-27",
  "label_en": "Hijri New Year 1449 — date to be confirmed",
  "type": "public-holiday",
  "confidence": "expected",
  "priority": 1
}
```

When FAHR confirms the exact date, update to `"confidence": "confirmed"` and adjust the date if it differs from the estimate.

### Step 2 — Post-import check

After any monthly calendar is published, set a reminder to re-check FAHR/MoHRE within 30 days for holiday announcements covering that period.

### Step 3 — Monthly radar pass

Before the first of each month, run the daily search terms against FAHR + Gulf News for the next 60 days. Note any confirmed holiday announcements and update calendar pages immediately.

### Step 4 — Satellite coverage

For holidays that affect multiple calendar months (e.g., an Eid window spanning two months), ensure the entry appears on ALL relevant month calendar pages, not just the month where the first day falls.

---

## Immediate fix for remaining 2026 holidays

After Phase 6C-100A production deploy, check whether the following are already in Guidex calendar DB:

| Holiday | Expected date | Calendar month page | Status |
|---|---|---|---|
| Prophet's Birthday 1448 | ~Sep 4, 2026 | september-2026-dubai-calendar | CHECK if present |
| UAE Commemoration Day | Dec 1, 2026 | december-2026-uae-calendar | CHECK if present |
| UAE National Day | Dec 2-3, 2026 | december-2026-uae-calendar | CHECK if present |

These should be verified and imported in a follow-up pass.
