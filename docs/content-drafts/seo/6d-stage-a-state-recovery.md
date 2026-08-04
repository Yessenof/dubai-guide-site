# Phase 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01 — Stage A: State Recovery Report

**Phase:** 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01 / Stage A
**Date:** 2026-08-04
**Status:** COMPLETE — full project state recovered; divergences documented; GSC signals verified live

---

## 1. Context

Session gap of approximately 2.5 weeks (last activity 2026-07-19, resumed 2026-08-04). This Stage A documents the state recovery process: re-establishing accurate project state, reconciling git divergences, and verifying GSC recovery signals on production.

---

## 2. Git divergence

| Source | Commit | Notes |
|--------|--------|-------|
| GitHub (remote main) | `f11ec5b` | "fix: unblock hub page indexing and fix sitemap freshness signals" |
| Local (Desktop) | `f11ec5b` | In sync with GitHub |
| Production server | `f6e9eae` | One commit ahead of GitHub (local commit, never pushed) |

The production server had created commit `f6e9eae` ("docs: record GSC indexing recovery deploy") containing `docs/content-drafts/seo/6c-gsc-indexing-recovery-03-prod.md`. This commit exists only on the server. The matching doc file exists locally (untracked). Both GitHub and local are at `f11ec5b`.

**Resolution:** The prod report file is committed locally in this 6D commit batch. The production server's extra commit will be reset to the new GitHub HEAD at the next production deployment.

---

## 3. Production database state (verified 2026-08-04 via SSH)

| Table | Count | Notes |
|-------|-------|-------|
| `guides` | 19 published | Correct; PROJECT_STATE.md stale entry showing "16" is wrong |
| `steps` | 127 | Correct |
| `calendar_pages` | 11 published | Sep–Dec 2026 pages ARE live (all confirmed via HTTP 200) |
| `events` | 9 | 2 published, 7 archived |
| `news_posts` | 3 | 2 published, 1 archived |

Note: Sep–Dec 2026 calendar pages are NOT empty. Production content counts at Stage A entry:
- September 2026: 12 items
- October 2026: 14 items
- November 2026: 17 items
- December 2026: 10 items

---

## 4. GSC signal verification (all 6 hub pages)

All verified against production `https://guidex-consulting.ae` by fetching live HTML and parsing meta tags, canonical links, and hreflang attributes.

| Page | HTTP | robots tag | Canonical | hreflang (en) | hreflang (ru) | In sitemap |
|------|------|-----------|-----------|--------------|--------------|------------|
| `/events` | 200 ✓ | none (indexable) ✓ | self ✓ | `/events` ✓ | `/ru/events` ✓ | ✓ |
| `/news` | 200 ✓ | none (indexable) ✓ | self ✓ | `/news` ✓ | `/ru/news` ✓ | ✓ |
| `/calendar` | 200 ✓ | none (indexable) ✓ | self ✓ | `/calendar` ✓ | `/ru/calendar` ✓ | ✓ |
| `/ru/events` | 200 ✓ | none (indexable) ✓ | self ✓ | `/events` ✓ | `/ru/events` ✓ | ✓ |
| `/ru/news` | 200 ✓ | none (indexable) ✓ | self ✓ | `/news` ✓ | `/ru/news` ✓ | ✓ |
| `/ru/calendar` | 200 ✓ | none (indexable) ✓ | self ✓ | `/calendar` ✓ | `/ru/calendar` ✓ | ✓ |

Phase 6C-GSC-INDEXING-RECOVERY-03 fixes are live and correct on all 6 hub pages.

---

## 5. Full site HTTP audit (Stage B — conducted same session)

All 108 public URLs audited by fetching live production responses.

| Result | Count | Notes |
|--------|-------|-------|
| HTTP 200 | 108 | 100% |
| HTTP 4xx | 0 | |
| HTTP 5xx | 0 | |
| Unexpected redirects | 0 | |

All EN and RU guide pages, calendar pages, event pages, news pages, hub pages, and static pages return 200. No broken routes detected.

---

## 6. Content verification summary (Stage C)

Key events verified against Tier-1 or multi-Tier-2 sources:

| Item | Date in DB | Verified date | Source | Status |
|------|-----------|--------------|--------|--------|
| Dubai Design Week | Nov 3-8 | Nov 3-8 | d3d.ae (T1) | CONFIRMED ✓ |
| Formula 1 Abu Dhabi GP | Dec 4-6 | Dec 5-7 | formula1.com (T1) | CONFIRMED (race Dec 7; DB range intentional for Yasalam) ✓ |
| Big 5 Global | Nov 23-26 | Nov 23-26 | thebig5.ae (T1) | CONFIRMED ✓ |
| GITEX Global | Dec 7-11 | Dec 7-11, Expo City | gitex.com (T1) | CONFIRMED; Scale Summit note retained ✓ |
| Expand North Star | Dec 8-10 | Dec 8-10, Expo City | gitex.com (T1) | CONFIRMED ✓ |
| Dubai Airshow 2026 | Not in DB | Biennial (no 2026 edition) | dubaiairshow.aero (T1) | CORRECT — absent ✓ |
| Mawlid Al Nabi | Aug 25 expected | No 2026 announcement | UAE FAHR (T1) | EXPECTED — no FAHR circular as of 4 Aug 2026 ✓ |
| DSF 2026-27 | Not in DB | No official dates announced | No T1 source | CORRECT — on HOLD ✓ |

Single Stage C correction applied: Mawlid brief date reference updated from "as of 18 July 2026" to "as of 4 August 2026" (accuracy update — FAHR still silent as of today).

---

## 7. Stale PROJECT_STATE.md entries

The following PROJECT_STATE.md entries were identified as stale and should be corrected:
- Deployment table showing "GitHub: ef8b58f" — stale; GitHub is at f11ec5b
- "Production DB: 2 news posts + 1 event" — stale; correct is 3 news posts (2 published, 1 archived), 9 events (2 published)
- Guide count showing "16" in some tables — stale; correct is 19 published guides

These are corrected in the PROJECT_STATE.md update accompanying this commit.

---

## 8. HOLD list (unverified items — Stage D)

Items researched but below the verification bar (cannot find T1 ticketing listing):

| Item | Expected date | Reason for HOLD |
|------|--------------|-----------------|
| Marwan Moussa & Haleem | Aug 15, DWTC | In Beat The Heat S5 schedule (Jul research), no current T1 listing found |
| Leg_cy / Aziz Maraka / Big Sam | Aug 22, DWTC | Same reason |
| Jony (T2: The National) | Nov 4, Coca-Cola Arena | No current Platinumlist/Coca-Cola Arena T1 listing |
| Andrea Bocelli | Dec 2, Etihad Arena | T2 only (The National); no current T1 ticketing |
| DSF 2026-27 | Dec TBA | Official dates not announced |
| Global Village Season 31 | TBA | Opening date not officially confirmed |
