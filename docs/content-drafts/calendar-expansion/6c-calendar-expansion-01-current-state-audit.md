# Phase 6C-CALENDAR-EXPANSION-01 — Current State Audit

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-01 — November/December 2026 Calendar & Event Expansion Planning  
**Mode:** Planning and draft only. No DB writes, no imports, no deploy, no commit.

---

## 1. Live event detail pages

| Slug | Status | Dates | Notes |
|---|---|---|---|
| `eid-al-adha-2026` | published | 2026-05-25–29 | Past event, already archived |
| `dubai-design-week-2026` | published | 2026-11-03–08 | November. Downtown Design (4–8 Nov) should be mentioned inside this page — not separately listed |
| `big-5-global-dubai-2026` | published | 2026-11-23–26 | November. Full detail page live |
| `formula-1-abu-dhabi-grand-prix-2026` | published | 2026-12-03–06 | December. JSON-LD enriched post 6C-EVENTS-CTR-01-PROD |
| `gitex-global-2026` | published | 2026-12-07–11 | December. DB accuracy patched (6C-EVENTS-DB-01), JSON-LD enriched. Expand North Star should be folded in as a section |

**Total: 5 live event pages. 2 in November, 2 in December, 1 past.**

---

## 2. Live calendar pages — November and December 2026

### November 2026 (`november-2026-dubai-calendar`)

**Current items (14 total):**

| Date | Item | Gap? |
|---|---|---|
| 2026-11-01 | Dubai Ride 2026 — opens Dubai Fitness Challenge | Partial gap: DFC starts 31 Oct, not 1 Nov. Also missing full 30x30 window (through 29 Nov) |
| 2026-11-02 | ADIPEC 2026 (2–5 Nov), Abu Dhabi | Live ✓ |
| 2026-11-03 | Dubai Design Week 2026 (3–8 Nov) — includes Downtown Design note | Live ✓ |
| 2026-11-04 | Sharjah International Book Fair (4–15 Nov) | Live ✓ |
| 2026-11-13 | ANOTR live at FIVE LUXE JBR | Live ✓ |
| 2026-11-14 | When Chai Met Toast, Dubai | Live ✓ |
| 2026-11-20 | Anuv Jain, Expo City Dubai | Live ✓ |
| 2026-11-21 | KEINEMUSIK, Bab Al Shams Arena | Live ✓ |
| 2026-11-21 | OFFLIMITS Music Festival, Yas Island, Abu Dhabi | Live ✓ |
| 2026-11-22 | Dubai Run 2026 | Live ✓ |
| 2026-11-23 | Big 5 Global (23–26 Nov) | Live ✓ |
| 2026-11-27 | Atif Aslam, Coca-Cola Arena | Live ✓ |
| 2026-11-27 | Hiba Tawaji & Ibrahim Maalouf, Dubai Opera | Live ✓ |
| 2026-11-27 | Tarkan, Etihad Arena, Abu Dhabi | Live ✓ |

**Confirmed November gaps:**
- DP World Tour Championship 2026 (12–15 Nov) — MISSING. Confirmed. Official source: europeantour.com.
- Dubai FinTech Summit 2026 (2–3 Nov) — MISSING. Confirmed. Official source: difc.com + dubaifintechsummit.com.
- Dubai Fitness Challenge full window (31 Oct–29 Nov) — DFC start date is wrong (1 Nov shown, official start is 31 Oct). Full 30-day window not stated.
- Frieze Abu Dhabi 2026 (20–22 Nov) — MISSING. Provisional (needs frieze.com or abudhabiart.ae confirmation).
- ILT20 Season 5 start (22 Nov) — MISSING. Provisional (needs ilt20.com confirmation).

### December 2026 (`december-2026-uae-calendar`)

**Current items (7 total):**

| Date | Item | Gap? |
|---|---|---|
| 2026-12-01 | UAE Commemoration Day | Live ✓ |
| 2026-12-02 | UAE National Day (2–3 Dec) | Live ✓ |
| 2026-12-03 | F1 Yasalam: Lewis Capaldi & Zara Larsson | Live ✓ |
| 2026-12-04 | F1 Abu Dhabi Grand Prix (4–6 Dec) | Live ✓ |
| 2026-12-05 | F1 Yasalam: Imagine Dragons | Live ✓ |
| 2026-12-07 | GITEX Global 2026 (7–11 Dec) | Live ✓ |
| 2026-12-14 | UAE school winter break begins | Live ✓ |

**Confirmed December gaps:**
- UAE Corporate Tax 31 December 2026 deadline (March 2026 year-end) — MISSING. FTA statutory rule confirmed.
- UAE Emiratisation H2 2026 deadline (31 December) — MISSING. MoHRE policy confirmed.
- Dubai Shopping Festival 32nd edition — MISSING. Date not yet officially confirmed. Hold.
- Expand North Star 2026 (8–10 Dec) — Missing as standalone and should be a section inside GITEX page. No standalone calendar item needed.
- ILT20 Season 5 (continues through 20 Dec) — provisional pending ilt20.com confirmation.
- New Year's Eve Dubai 2026 — too early (program not announced). Recheck mid-November.

---

## 3. Candidates already researched (from research files)

| Candidate | Research priority | Source status | November/December relevance |
|---|---|---|---|
| DP World Tour Championship 2026 | P0 (for detail page) | Confirmed — europeantour.com | November 12–15 |
| Global Village Season 31 | P0 | Expected — month only, no exact date | October–December (open season) |
| Dubai Shopping Festival 32nd | P0 | Hold — no official date | December start expected |
| Emiratisation H2 2026 deadline | P1 | Confirmed — MoHRE rule | December 31 |
| Corporate Tax Dec 2026 deadline | P1 | Confirmed — FTA 9-month rule | December 31 |
| ILT20 Season 5 | P1 | Provisional — secondary sources only | November 22 – December 20 |
| Dubai FinTech Summit 2026 | P1 | Confirmed — DIFC/organizer | November 2–3 |
| Frieze Abu Dhabi 2026 | P2 | Provisional — media signal | November 20–22 |
| Dubai Fitness Challenge correction | P1 | Confirmed — official organizer | October 31 – November 29 |
| New Year's Eve Dubai 2026 | Hold | No program announced | December 31 |
| Expand North Star 2026 | Fold-in | Confirmed — expandnorthstar.com | December 8–10 (GITEX fold-in) |
| Downtown Design 2026 | Fold-in | Confirmed — downtowndesign.com | November 4–8 (Design Week fold-in) |

---

## 4. Missing detail pages

| Event | Recommended slug | Status |
|---|---|---|
| DP World Tour Championship 2026 | `dp-world-tour-championship-2026` | Not built. Ready to draft. |
| Global Village Dubai Season 31 | `global-village-dubai-season-31-2026` | Not built. Draft skeleton ready; date field blocked. |
| Dubai Shopping Festival 2026–2027 | `dubai-shopping-festival-2026-2027` | Not built. Skeleton only; date field blocked. |
| ILT20 Season 5 2026 | `ilt20-season-5-2026` | Not built. Provisional — verify ilt20.com first. |
| Dubai FinTech Summit 2026 | `dubai-fintech-summit-2026` | Not built. Could be built; lower priority. |
| Frieze Abu Dhabi 2026 | `frieze-abu-dhabi-2026` | Not built. Hold — organizer source required. |

---

## 5. Direct external links that should become Guidex detail pages

These are calendar items currently linking to external sources where a Guidex detail page would be better:

| Calendar item | Current link | Recommended action |
|---|---|---|
| Dubai Design Week (Nov calendar) | Links to `dubai-design-week-2026` ✓ | Already linked — no action |
| Big 5 Global (Nov calendar) | Links to `big-5-global-dubai-2026` ✓ | Already linked — no action |
| F1 Abu Dhabi GP (Dec calendar) | Links to `formula-1-abu-dhabi-grand-prix-2026` ✓ | Already linked — no action |
| GITEX Global (Dec calendar) | Links to `gitex-global-2026` ✓ | Already linked — no action |
| DP World Tour Championship | No calendar item exists | Build detail page + calendar item |
| Dubai FinTech Summit | No calendar item exists | Build calendar item; detail page optional |
| Global Village Season 31 | No presence at all | Build detail page + calendar item once date confirmed |
| Dubai Shopping Festival | No presence at all | Build detail page + calendar item once DFRE announces dates |
| Emiratisation H2 deadline | No December calendar item | Add calendar item; link to Guidex company-setup guide cluster |
| Corporate Tax Dec deadline | No December calendar item | Add calendar item; link to FTA |

---

## 6. EN/RU parity gaps

| Area | EN | RU | Gap |
|---|---|---|---|
| November 2026 calendar page | 14 items | Assumed RU counterpart exists (separate `ru/calendar/november-2026-dubai-calendar`) | Any new items added to EN must be added to RU simultaneously |
| December 2026 calendar page | 7 items | Same | Same |
| DP World Tour Championship | Not built | Not built | No gap yet; build EN+RU together |
| Global Village Season 31 | Not built | Not built | No gap yet; build EN+RU together |
| Dubai Shopping Festival | Not built | Not built | No gap yet; build EN+RU together |
| GITEX page: Expand North Star fold-in | Not yet added | Not yet added | Add EN+RU together when approved |
| Dubai Design Week: Downtown Design fold-in | Not yet added | Not yet added | Add EN+RU together when approved |

---

## 7. Risks and blockers

| Risk | Impact | Status |
|---|---|---|
| Global Village Season 31 exact opening date not confirmed | Cannot publish exact date; can draft general content | Blocked on date only — body content safe to draft |
| DSF 32nd edition dates not confirmed | Cannot publish any date-specific content | Blocked — skeleton draft only |
| ILT20 Season 5 not verified on ilt20.com | Cannot publish season dates | Blocked — secondary sources only so far |
| Frieze Abu Dhabi not confirmed on official organizer channel | Cannot publish as confirmed | Provisional — calendar-only, no detail page until organizer confirmed |
| Dubai FinTech Summit previously rescheduled | Reconfirm before publishing | Minor risk — requires a final check before use |
| New Year's Eve Dubai program not announced | Cannot publish venue/program list | Recheck mid-November |
| Emiratisation H2 penalty figure (AED 108,000/year) | Must source from MoHRE.gov.ae directly | Do not cite from Gulf News summary alone |
| Corporate Tax Dec deadline | Applies only to March 2026 year-end companies | Risk of overgeneralizing — framing must be precise |
