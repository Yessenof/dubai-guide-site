# Phase 6C-46 — UAE Long Weekends Calendar Reference Local Import QA

**Status:** COMPLETE — local import successful; all QA passes  
**Date:** 2026-05-21  
**Record created:** `a6d4d59b-d09a-4282-a908-1f87ba9fab51`  
**No push. No deploy. No commit. Owner production approval required.**

---

## 1. Pre-import source check

| Claim | Source status | Safe to publish? |
|---|---|---|
| New Year 2026 (Jan 1) — federal holiday | FAHR URL confirmed (HTTP 200) | Yes |
| Eid Al Fitr 2026 (Mar 19-22) — federal holiday | FAHR URL confirmed (HTTP 200) | Yes |
| Eid Al Adha 2026 (May 25-29) — federal holiday | FAHR URL confirmed — EXCLUDED from datesJson (already in may-2026-uae-calendar) | N/A — excluded |
| Commemoration Day (Dec 1) — fixed statutory date | UAE law (Cabinet Resolution 27/2024); 2026 FAHR scope pending | Yes — labeled "expected" |
| National Day (Dec 2-3) — fixed statutory dates | UAE law; 2026 FAHR scope pending | Yes — labeled "expected" |
| Islamic New Year (~Jun 16-17) | NOT confirmed — monitoring only | NOT in datesJson |
| Mawlid An-Nabi (~Aug 25) | NOT confirmed — monitoring only | NOT in datesJson |
| 2027 dates | NOT confirmed — monitoring only | NOT in datesJson |

**Blocked claims confirmed absent from body content:**
- No "everyone gets X days" claims
- No "FAHR confirmed National Day 2026 scope" claim
- No Islamic monitoring dates presented as confirmed
- No "9-day break" as FAHR official declaration (described as a derived planning window)
- Remote working day (Fri Jan 2) correctly distinguished from public holiday

**Eid Al Adha exclusion confirmed:** Not in datesJson. Body text correctly references Eid Al Adha as a past confirmed date and links to `/calendar/may-2026-uae-calendar` for those dates.

---

## 2. Local import — field mapping result

| Field | Value | Status |
|---|---|---|
| id | `a6d4d59b-d09a-4282-a908-1f87ba9fab51` | Created |
| slug | `uae-long-weekends-2026-2027` | Clean |
| calendarType | `yearly` | Correct — "annual" never used |
| year | `2026` | Correct |
| month | `null` | Correct — yearly page |
| status | `published` | Published locally |
| ruPublished | `1` | Enabled |
| hasIslamicDates | `0` | Correct — all Gregorian confirmed/statutory dates |
| featuredHomepage | `0` | As specified by import map |
| officialSourceUrl | FAHR Eid Al Adha 2026 announcement URL | Set |
| lastVerifiedDate | `2026-05-21` | Set |

**Import script:** `scripts/long-weekend-calendar-import.ts` (untracked)

**Pre-flight assertions (9/9 passed):**
- status = published ✓
- calendarType = yearly ✓
- month = null ✓
- year = 2026 ✓
- ruPublished = 1 ✓
- hasIslamicDates = 0 ✓
- featuredHomepage = 0 ✓
- datesJson has 4 items ✓
- No Eid Al Adha in datesJson ✓

**Publishing warning:** `en_summary should be 1–2 sentences — currently longer.` (advisory only — summary has 3 sentences covering confirmed/monitoring scope; acceptable for this reference page; not a blocking error)

---

## 3. datesJson imported

| # | Date | label_en | type | confidence | detail_url |
|---|---|---|---|---|---|
| 1 | 2026-01-01 | New Year 2026 -- Federal Holiday (FAHR confirmed) | holiday | confirmed | /calendar/uae-long-weekends-2026-2027 |
| 2 | 2026-03-19 to 2026-03-22 | Eid Al Fitr 2026 -- Federal Holiday (FAHR confirmed) | holiday | confirmed | /calendar/uae-long-weekends-2026-2027 |
| 3 | 2026-12-01 | Commemoration Day -- Federal Holiday (date statutory; 2026 scope pending FAHR) | holiday | expected | /calendar/uae-long-weekends-2026-2027 |
| 4 | 2026-12-02 to 2026-12-03 | UAE National Day -- Federal Holiday (dates statutory; 2026 scope pending FAHR) | holiday | expected | /calendar/uae-long-weekends-2026-2027 |

**Excluded:** Eid Al Adha May 25-29 — already in `may-2026-uae-calendar` with `detail_url: "/calendar/may-2026-uae-calendar"`

---

## 4. Route QA

| Route | HTTP | lang | robots | Notes |
|---|---|---|---|---|
| `/calendar/uae-long-weekends-2026-2027` | 200 | `en` | `index, follow` | |
| `/ru/calendar/uae-long-weekends-2026-2027` | 200 | `ru` | `index, follow` | RU fully in Russian — no EN fallback |
| `/calendar` | 200 | — | — | Calendar list page — no breakage |
| `/ru/calendar` | 200 | — | — | RU calendar list — no breakage |
| `/` (homepage) | 200 | — | — | Carousel: 7 slides — see carousel section |
| `/ru` (RU homepage) | 200 | — | — | Carousel: long-weekends slide present |

---

## 5. EN detail page QA

| Check | Result |
|---|---|
| lang="en" | ✓ |
| robots: index, follow | ✓ |
| Title | "UAE Public Holidays 2026-2027: Confirmed Dates and Long Weekends — Guidex Consulting" |
| Meta description | "UAE public holidays 2026-2027: confirmed FAHR dates for New Year, Eid Al Fitr, Eid Al Adha. Which long weekends are confirmed and which to monitor." |
| Raw Markdown (## / ###) in HTML | 0 — clean |
| Source trust block (fahr.gov.ae) | Present ✓ |
| lastVerifiedDate visible | "· verified 2026-05-21" ✓ |
| hasIslamicDates amber disclaimer | Absent ✓ (hasIslamicDates=0) |
| "Islamic calendar" in body text | Present — body correctly labels monitoring dates as not confirmed ✓ |
| CalendarContextCta → `/calendar` | href="/calendar" ✓ (month=null → links to /calendar base) |
| Eid Al Adha May datesJson in page | Absent from datesJson; present in body text as historical reference ✓ |

---

## 6. RU detail page QA

| Check | Result |
|---|---|
| lang="ru" | ✓ |
| robots: index, follow | ✓ |
| Title (RU) | "Праздники ОАЭ 2026-2027: подтверждённые даты и длинные выходные — Guidex Consulting" |
| Meta description (RU) | "Праздники ОАЭ 2026-2027: подтверждённые даты FAHR -- Новый год, Ид аль-Фитр, Ид аль-Адха. Какие длинные выходные подтверждены, а какие ждать объявления." |
| Raw Markdown in HTML | 0 — clean |
| RU content present | "Праздники", "Новый год", "подтверждённые", "FAHR" ✓ |
| No EN fallback | ✓ |
| Source trust block | Present ✓ |
| CalendarContextCta → `/ru/calendar` | href="/ru/calendar" ✓ |

---

## 7. Calendar integration QA

| Check | Result |
|---|---|
| Eid Al Adha May 25-29 — only from may-2026-uae-calendar | ✓ — count=1 in May calendar page; `uae-long-weekends` does not appear in may-2026-uae-calendar HTML |
| No duplicate CalendarGrid group for May | ✓ — no `uae-long-weekends-2026-2027` detail_url appears in may-2026-uae-calendar |
| Calendar list page (/calendar) — New Year / Eid Al Fitr / Commemoration / National Day in RSC payload | ✓ — dates present in list page payload |
| Calendar list page — no mock data | 0 mock refs ✓ |
| Calendar list page — no broken rendering | 200 ✓ |
| RU calendar list page — no broken rendering | 200 ✓ |
| Yearly page with month: null — calendar list does not break | ✓ — list page only uses datesJson dates |

---

## 8. Homepage carousel effect

**Carousel order (local, 7 slides):**

| # | Type | Title | URL |
|---|---|---|---|
| 1 | Event | Eid Al Adha 2026 in UAE: Dates, Federal Holiday and Planning | /events/uae-eid-al-adha-2026 |
| 2 | News | UAE Eid Al Adha 2026: Federal Holiday Confirmed for 25-29 May | /news/uae-eid-al-adha-2026-federal-holiday-long-break |
| 3 | News | MoHRE Confirms 30 June 2026 Emiratisation Deadline for Private... | /news/uae-emiratisation-june-30-2026-deadline |
| 4 | Calendar | UAE Emiratisation 30 June 2026: Deadline for 50+ Employee Companies | /calendar/uae-emiratisation-june-30-2026-reminder |
| 5 | Calendar | UAE Public Holidays 2026-2027: Confirmed Dates and Long Weekends | /calendar/uae-long-weekends-2026-2027 |
| 6 | Calendar | May 2026 in UAE: Eid Al Adha Dates and What to Plan For | /calendar/may-2026-uae-calendar |
| 7 | Guide | How to Get an Employment Visa in Dubai... | /guides/employment-visa |

**Note:** Long Weekend page enters the carousel as a calPage regardless of featuredHomepage=0. The `featuredHomepage` flag is not currently used to filter the carousel — all published calPages enter the pool. This is expected behavior. 7 slides is within the 5-8 target. The Long Weekend page at slot 5 is appropriate and relevant content.

**RU carousel:** Long Weekend slide confirmed present (1 match for "uae-long-weekends" in /ru HTML).

---

## 9. Source safety status

| Claim in content | Source | Status |
|---|---|---|
| New Year 2026 = Jan 1, federal holiday | FAHR URL (HTTP 200 verified 2026-05-20) | Safe |
| Eid Al Fitr 2026 = Mar 19-22, federal holiday | FAHR URL (HTTP 200 verified 2026-05-20) | Safe |
| Eid Al Adha 2026 = May 25-29, federal holiday (body text only) | FAHR URL (HTTP 200 verified 2026-05-18) | Safe |
| Commemoration Day = Dec 1 (date fixed) | UAE law / Cabinet Resolution 27/2024 | Safe — labeled "expected" not "confirmed" |
| National Day = Dec 2-3 (dates fixed) | UAE law / Cabinet Resolution 27/2024 | Safe — labeled "expected" not "confirmed" |
| Dec bridge day depends on FAHR announcement | Stated as pending | Safe — no false certainty |
| 2026 Islamic calendar monitoring dates | Labeled as estimates, not confirmed | Safe |
| 2027 dates | Labeled as provisional and monitoring-only | Safe |

---

## 10. Robots / index status

- `calendarRobots()` returns `INDEX` for all published calendar pages — no `noindex` field exists
- EN and RU pages: `robots: index, follow` confirmed in HTML
- This page will be indexable immediately upon production import and publish

---

## 11. Validation results

- **em dash pre-flight:** 0 em dashes in all 13 content strings ✓
- **slug duplicate guard:** No existing record — safe to import ✓
- **datesJson pre-flight:** 4 items, no Eid Al Adha date ✓
- **createCalendarDraft:** ok=true ✓
- **publishCalendar:** ok=true; 1 advisory warning (summary length) ✓
- **Post-import assertions (9/9):** All pass ✓
- **Route QA (6 routes):** All 200 ✓
- **Raw Markdown:** 0 in EN, 0 in RU ✓
- **No mock data:** 0 ✓

---

## 12. Git status

- **Branch:** main — 1 commit ahead of origin/main (Phase 6C-45 docs commit ced3b5c)
- **No code files modified** — import only touched data/guides.db
- **Untracked:** `scripts/long-weekend-calendar-import.ts` (new import script)
- **Unstaged modified:** CHECKPOINTS.md, SESSION_LOG.md, PROJECT_STATE.md, NEW_CHAT_TRANSFER.txt (memory files), docs/ (source ledgers, drafts)
- **Not staged, not committed:** data/guides.db (gitignored)

---

## 13. DB state after import

| slug | status | calendarType | month | year |
|---|---|---|---|---|
| uae-business-compliance-calendar-2026-2027 | draft | yearly | null | 2026 |
| may-2026-uae-calendar | published | monthly | 5 | 2026 |
| uae-emiratisation-june-30-2026-reminder | published | important_dates | null | 2026 |
| **uae-long-weekends-2026-2027** | **published** | **yearly** | **null** | **2026** |

---

## Final report answers

| Question | Answer |
|---|---|
| Was local import successful? | **Yes** — id=a6d4d59b-d09a-4282-a908-1f87ba9fab51, status=published, all 9 assertions pass |
| Is Long Weekend safe as a calendar_pages yearly reference? | **Yes** — calendarType="yearly", month=null, all rendering paths confirmed |
| Are only 4 datesJson items imported? | **Yes** — Jan 1, Mar 19-22, Dec 1, Dec 2-3 only |
| Is Eid Al Adha excluded? | **Yes** — no May 25-29 date in datesJson; confirmed by pre-flight guard and post-import assertion |
| Are EN/RU pages clean and indexable? | **Yes** — both 200, correct lang, robots: index follow, no raw Markdown, no EN fallback on RU |
| Is it ready for production import? | **Yes — pending owner approval for production deploy** |

---

## Production readiness verdict

**READY FOR PRODUCTION.** All local QA passes. No issues found.

**Production import sequence:**
1. SSH to production — `root@85.9.203.69`
2. `cd /var/www/guidex`
3. `npx tsx scripts/long-weekend-calendar-import.ts`
4. Verify routes: `/calendar/uae-long-weekends-2026-2027` and `/ru/...` → 200, index, follow
5. Verify carousel: slide 5 = Long Weekend reference ✓
6. Verify May calendar: no duplicate Eid Al Adha group ✓
7. Add to Google Search Console indexing queue (2 URLs: EN + RU)

**Owner approval needed:** Production import and deploy.

---

## What was NOT touched

- No code files modified
- No schema or migration changes
- No push to GitHub
- No deployment to production
- No admin or AI Inbox usage
- No env/secrets/GTM/GA4
