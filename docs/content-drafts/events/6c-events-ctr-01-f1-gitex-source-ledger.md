# Phase 6C-EVENTS-CTR-01 — Source Ledger

**Date:** 2026-06-18  
**Purpose:** Document what was verified, from which official source, and what action was taken.

---

## Formula 1 Abu Dhabi Grand Prix 2026

**Official source checked:** https://www.abudhabigp.com/en/  
**Source status:** Live, 200 OK, official race promoter site  
**Source authority:** Abu Dhabi Motorsport Management / Formula 1® Etihad Airways Abu Dhabi Grand Prix

| Claim | Source says | DB says | Match? | Action |
|---|---|---|---|---|
| Event name | "Formula 1® Etihad Airways Abu Dhabi Grand Prix 2026" | "Formula 1 Abu Dhabi Grand Prix 2026..." (without Etihad sponsor) | ✓ Compatible | No change — marketing title without sponsor is acceptable |
| Dates | Dec 3–6, 2026 | 2026-12-03 to 2026-12-06 | ✓ | None |
| Venue | Yas Marina Circuit, Yas Island, Abu Dhabi | Body says "Yas Marina Circuit, Yas Island, Abu Dhabi" | ✓ | Added to JSON-LD |
| Yasalam Dec 3 (Thu) | Zara Larsson and Lewis Capaldi | Lewis Capaldi + Zara Larsson | ✓ | None |
| Yasalam Dec 5 (Sat) | Imagine Dragons | Imagine Dragons | ✓ | None |
| Dec 4/6 concerts | "more artists on the way" | "not yet announced" | ✓ | None |
| Race day | Not specified on homepage | Dec 6 (Sunday) | Consistent with standard pattern | None |
| Organizer | Abu Dhabi Motorsport Management (implied by abudhabigp.com domain) | Not in DB | N/A | Added to JSON-LD as "Abu Dhabi Motorsport Management" |

**Verdict: All F1 facts in DB are confirmed accurate. No DB correction needed.**

---

## GITEX Global 2026

**Official source checked:** https://www.gitex.com/gitex-global-2026  
**Source status:** Live, 200 OK, official DWTC/GITEX organizer page  
**Source authority:** GITEX / Dubai World Trade Centre (contact: gitexsales@dwtc.com)

| Claim | Source says | DB says | Match? | Action |
|---|---|---|---|---|
| Event name | "GITEX GLOBAL 2026" | "GITEX Global 2026..." | ✓ | None |
| Dates | Dec 7–11, 2026 | 2026-12-07 to 2026-12-11 | ✓ | None |
| Summit date | Dec 7 (Scale Summit) | Dec 7 ✓ | ✓ | None |
| Summit venue | **Dubai World Trade Centre** | DB implies Expo City Dubai | ❌ **Mismatch** | Flag for DB fix |
| Main expo dates | Dec 8–11 | Dec 8–11 ✓ | ✓ | None |
| Main expo venue | Expo City Dubai (Dubai Exhibition Centre) | Dubai Exhibition Centre, Expo City Dubai | ✓ | Added to JSON-LD (Expo City Dubai as primary location) |
| 200,000+ visitors | Not confirmed for 2026 (placeholder numbers on page) | In meta description | ⚠️ Unconfirmed | Flag for DB review |
| 6,800+ companies | Not confirmed for 2026 (placeholder numbers on page) | In body | ⚠️ Unconfirmed | Flag for DB review |
| "First GITEX outside DWTC since 1981" | No — Summit is still at DWTC | In body | ❌ **Partially wrong** | Flag for DB fix |
| Source URL | https://www.gitex.com/gitex-global-2026 | Same | ✓ | None |
| Organizer | DWTC (gitexsales@dwtc.com) | Not in DB | N/A | Added to JSON-LD as "Dubai World Trade Centre" |

**Verdict: Two DB content corrections required (Summit venue, DWTC claim). DB locked this phase — flagged for owner action.**

---

## Source ledger summary

| Event | Source verified? | Facts OK? | DB correction needed? |
|---|---|---|---|
| F1 Abu Dhabi GP 2026 | ✓ | ✓ All confirmed | None |
| GITEX Global 2026 | ✓ | ⚠️ Two issues | Yes (Summit venue + DWTC claim + 2026 numbers) |

---

## GITEX DB correction required (owner action)

**Priority: Medium — affects factual accuracy of published page**

1. **Summit venue**: Body text implies Summit (Dec 7) is at Expo City Dubai. Official source: DWTC. Body should clarify "Scale Summit on Dec 7 at Dubai World Trade Centre; main expo Dec 8–11 at Dubai Exhibition Centre, Expo City Dubai."

2. **"First GITEX outside DWTC since 1981"**: This claim is inaccurate — the Scale Summit remains at DWTC. The correct framing is: "First time the main GITEX Expo is held outside DWTC, moving to Expo City Dubai."

3. **2026 visitor/company numbers**: 200,000+ and 6,800+ appear to be historical (2025) figures reused. Official 2026 page shows placeholder text. Consider adding a qualifier "expected" or removing until confirmed.
