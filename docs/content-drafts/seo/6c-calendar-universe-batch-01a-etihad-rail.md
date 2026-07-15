# Phase 6C-CALENDAR-UNIVERSE-BATCH-01A-ETIHAD-RAIL — Implementation Report

**Phase:** 6C-CALENDAR-UNIVERSE-BATCH-01A-ETIHAD-RAIL
**Date:** 2026-07-15
**Status:** COMPLETE — local DB written, build passes, QA passed, ready to commit

---

## A. Phase summary

| Field | Value |
|-------|-------|
| Phase | 6C-CALENDAR-UNIVERSE-BATCH-01A-ETIHAD-RAIL |
| Status | COMPLETE (local, pre-commit) |
| Date | 2026-07-15 |
| Branch | main |
| DB write | LOCAL ONLY ✓ |
| Production deploy | NONE — not requested ✓ |
| Build | PASS — 0 TypeScript errors, 92 static pages ✓ |

---

## B. What was created

### New guide: `etihad-rail-uae`

| Field | Value |
|-------|-------|
| Slug | `etihad-rail-uae` |
| Category | `living` |
| Published | `true` (1) |
| EN Title | How to Book and Ride Etihad Rail in the UAE |
| RU Title | Как купить билет и поехать на поезде Etihad Rail в ОАЭ |
| Price | AED 55–150 per trip (Comfort and Premium, 50% launch discount active July 2026; regular fares AED 109–299) |
| Timeline | 1 hour 45 minutes (Abu Dhabi to Fujairah, non-stop) |
| Last Updated | July 2026 |
| Steps | 5 |
| RU Content | Full — all fields translated |
| hasRuContent | true |

### Steps

| # | EN Title | RU Title |
|---|----------|----------|
| 1 | Check routes and timetable | Проверьте маршруты и расписание |
| 2 | Choose class and fare | Выберите класс и тариф |
| 3 | Book your seat | Купите билет |
| 4 | Get to your station | Доберитесь до станции |
| 5 | Check in and board | Пройдите на посадку |

---

## C. Code files modified

| File | Change |
|------|--------|
| `app/(en)/(public)/guides/[slug]/page.tsx` | Added `etihad-rail-uae` entry to `SOURCE_NOTES` |
| `app/ru/guides/[slug]/page.tsx` | Added `etihad-rail-uae` entry to `SOURCE_NOTES_RU` |
| `lib/related-guides.ts` | Added `etihad-rail-uae` entry → points to `document-attestation-dubai`, `employment-visa`, `amer-center-dubai` |

---

## D. Source verification

Primary sources used:

| Source | Content | Reliability |
|--------|---------|-------------|
| The National (July 1, 2026) | Full timetable, fare tiers, station names, booking opening date, fleet size | T1 — editorial |
| Etihad Rail official press / WAM.ae | Service launch June 30, 2026; station opening milestones Sep 30 / Dec 30, 2026; Mar 30, 2027 | T1 — government |

Key facts locked from sources:
- **Service launch:** June 30, 2026
- **Route:** Abu Dhabi (Mohamed bin Zayed City) ↔ Fujairah (Al Hilal City)
- **Journey time:** 1 hour 45 minutes, non-stop
- **Departures from Abu Dhabi:** 8:19am, 1:53pm, 6:39pm
- **Departures from Fujairah:** 5:34am, 10:59am, 5:28pm
- **Comfort Class fares (50% discount):** Standard AED 55 / Value AED 65 / Flex AED 75
- **Comfort Class fares (regular):** Standard AED 109 / Value AED 119 / Flex AED 149
- **Premium Class fares (50% discount):** Standard AED 120 / Value AED 130 / Flex AED 150
- **Premium Class fares (regular):** Standard AED 239 / Value AED 259 / Flex AED 299
- **Children (0–17):** AED 28 Comfort / AED 60 Premium
- **Seniors (60+):** AED 44 Comfort / AED 96 Premium
- **Infants (under 2):** Free
- **Fleet:** 13 trains, up to 400 passengers each
- **Comfort amenities:** USB/universal charging, free Wi-Fi, food/drink trolley
- **Premium amenities:** Reclining wide seats, headrests, legroom, complimentary snacks/drinks, Wi-Fi
- **Booking:** etihad-rail.ae, mobile app (Android/iOS), station counter/kiosk

**Future expansion confirmed:**
- Sep 30, 2026: Dubai (Jumeirah Golf Estates) + Al Dhaid (Sharjah) stations
- Dec 30, 2026: Al Dhafra stations (multiple)
- Mar 30, 2027: Sharjah station
- Full network: 11 cities/regions across UAE

---

## E. QA results

### EN route: `/guides/etihad-rail-uae`

| Check | Result |
|-------|--------|
| HTTP status | 200 ✓ |
| Title | "How to Book and Ride Etihad Rail in the UAE — Guidex Consulting" ✓ |
| Meta description | Contains "1 hour 45 minutes" and "June 30, 2026" ✓ |
| Canonical | `https://guidex-consulting.ae/guides/etihad-rail-uae` ✓ |
| hreflang en | Present ✓ |
| hreflang ru | Present (RU URL in payload) ✓ |
| hreflang x-default | Present ✓ |
| BreadcrumbList schema | ✓ |
| Article schema | ✓ |
| HowTo schema | ✓ (5 HowToStep entries) |
| Steps rendered | 5 ✓ |
| Timetable (8:19am) | Present ✓ |
| Fare AED 55 | Present ✓ |
| Premium AED 120 | Present ✓ |
| Children AED 28 | Present ✓ |
| Sep 30 2026 Dubai | Present ✓ |
| June 30 2026 launch | Present ✓ |
| Related guides | document-attestation-dubai visible ✓ |
| Source note | "Checked July 2026" present ✓ |

### RU route: `/ru/guides/etihad-rail-uae`

| Check | Result |
|-------|--------|
| HTTP status | 200 ✓ |
| RU Title | "Как купить билет и поехать на поезде Etihad Rail в ОАЭ — Guidex Consulting" ✓ |
| RU Meta description | In Russian, contains service date ✓ |
| RU Canonical | `https://guidex-consulting.ae/ru/guides/etihad-rail-uae` ✓ |
| hreflang en/ru in payload | ✓ |
| Steps rendered | 5 ✓ |
| Russian station names | "Мохамед бин Зайед Сити" present ✓ |
| Fare AED 55 in RU | Present ✓ |
| RU Source note | "Проверено июль 2026" present ✓ |

---

## F. SEO notes

- **Primary keyword target:** "Etihad Rail Dubai" / "Etihad Rail UAE" / "how to book Etihad Rail" / "UAE train service"
- **Title length:** 50 chars (within optimal 50–60 char range)
- **Category:** `living` — appropriate for transport/practical UAE life
- **Schema:** BreadcrumbList + Article + HowTo (5 steps) — full structured data set
- **Internal linking:** RELATED_GUIDES band shows `document-attestation-dubai`, `employment-visa`, `amer-center-dubai`
- **Bilingual:** Both EN and RU fully populated → hreflang active in both directions
- **Note for monitoring:** Sep 30, 2026 Dubai station opening requires update to Step 1 timetable and overview

---

## G. Files changed (for commit)

**Code files:**
- `app/(en)/(public)/guides/[slug]/page.tsx`
- `app/ru/guides/[slug]/page.tsx`
- `lib/related-guides.ts`

**DB:** Local `data/guides.db` — NOT committed (gitignored)

**Docs:**
- `docs/content-drafts/seo/6c-calendar-universe-batch-01a-etihad-rail.md` (this file)

**Memory files:**
- `PROJECT_STATE.md`
- `SESSION_LOG.md`

---

## H. Safety confirmation

| Check | Status |
|-------|--------|
| No production DB write | CONFIRMED ✓ |
| No db-restore-to-server.sh run | CONFIRMED ✓ |
| No deploy | CONFIRMED ✓ |
| No schema / migrations | CONFIRMED ✓ |
| No admin / auth / proxy changes | CONFIRMED ✓ |
| No environment variable or secret changes | CONFIRMED ✓ |
| No manual PM2 stop/start | CONFIRMED ✓ |
| No git add . | CONFIRMED ✓ |
| .env.local not committed | CONFIRMED ✓ |
| data/guides.db not committed | CONFIRMED ✓ |
| Build passes 0 TS errors | CONFIRMED ✓ |
| 92 static pages generated | CONFIRMED ✓ |

---

## I. Next action (Batch 01B)

Per `6c-calendar-universe-implementation-backlog.md`, next Batch 1 items:
1. Add Mawlid Al Nabawi Aug 24-25 to August 2026 calendar (P0 — 6 weeks away)
2. Add July 2026 missing concerts (4 items: Michael Lives Forever, Dystinct & Issam Najjar, Indie Soulfest, Jul 18 events)
3. Add August 2026 missing concerts (6+ items: Rasha Rizk, SB Girls, Thaalam Beats, Sonu Nigam)
4. Create draft DSF 2026 event page (`/events/dubai-shopping-festival-2026`)
5. Add Etihad Rail Sep 30, 2026 milestone to September calendar
