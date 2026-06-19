# Phase 6C-EVENTS-DB-01 — GITEX Global 2026 DB Accuracy Patch: Final Report

**Date:** 2026-06-18/19  
**Status:** Complete — production patched and verified  
**Mode:** DB write (local and production). No code deploy, no commit, no push.

---

## Backup paths

| Location | Path | MD5 |
|---|---|---|
| Server | `/var/www/guidex/data/guides.db.pre-gitex-db-accuracy-fix-6c-events-db-01-20260618-231118` | `6a0700ba3b7b6f822950ad402184e010` |
| Local | `backups/production-db/guides.db.pre-gitex-db-accuracy-fix-6c-events-db-01-20260618-231118` | `6a0700ba3b7b6f822950ad402184e010` |
| Local dev | `data/guides.db.pre-gitex-db-accuracy-fix-6c-events-db-01-20260618-231118` | local copy |

MD5 match between server and local backup: ✓

---

## DB row and fields patched

| Table | Slug | Fields changed |
|---|---|---|
| `events` | `gitex-global-2026` | `en_title`, `en_summary`, `en_body`, `en_meta_description`, `ru_title`, `ru_summary`, `ru_body`, `ru_meta_description`, `updated_at` |

Rowcount affected: **1** ✓

---

## Old claim summary → New wording

### Title fields

| Field | Old | New |
|---|---|---|
| `en_title` | "GITEX Global 2026 at Expo City Dubai: Dates, Venue and What to Plan" | "GITEX Global 2026: Dates, Venue and What to Plan" |
| `ru_title` | "GITEX Global 2026 в Expo City Dubai: даты, площадка и что спланировать" | "GITEX Global 2026: даты, площадки и что спланировать" |

### Summary fields

| Field | Key change |
|---|---|
| `en_summary` | Removed whole-event Expo City claim; added Summit at DWTC (7 Dec); removed "first edition outside DWTC" claim; replaced 6,800+/200,000+ with "held pending official 2026 confirmation" |
| `ru_summary` | Same corrections in natural Russian |

### Meta description fields

| Field | Key change |
|---|---|
| `en_meta_description` | Removed 6,800+/200,000+; added venue split ("Main expo... Expo City Dubai; Scale Summit... DWTC") |
| `ru_meta_description` | Same corrections in natural Russian |

### Body fields — 8 targeted replacements each (EN and RU)

| Location | Old claim | New wording |
|---|---|---|
| Quick answer opener | Whole event at Expo City Dubai | Two-sentence venue split: Summit at DWTC (7 Dec), main expo at Expo City Dubai (8–11 Dec) |
| Venue bullet | Single venue: Expo City Dubai | Split into "Summit venue (7 Dec)" and "Main expo venue (8–11 Dec)" |
| Key facts table — Venue row | Single row: Expo City Dubai | Two rows: Summit venue (DWTC) + Main expo venue (Expo City Dubai) |
| Key facts table — Expected visitors | 200,000+ from 180+ countries | "Not yet confirmed for 2026" |
| Key facts table — Companies exhibiting | 6,800+ | "Not yet confirmed for 2026" |
| Key facts table — Venue history | "First GITEX outside DWTC since 1981" | "Main GITEX Expo moves outside DWTC for the first time; Scale Summit remains at DWTC" |
| What is GITEX section | "the full event moves to... Expo City Dubai" | "the main exhibition moves to... Expo City Dubai. The Scale Summit on 7 December remains at Dubai World Trade Centre." |
| Source note | Scale figures from gitex.com official (implied confirmed) | Figures shown on gitex.com are not confirmed for 2026; Guidex holding until official 2026 source confirms them |

### Fields NOT changed

- `en_seo_title` (retained — references main expo venue at Expo City Dubai, accurate)
- `ru_seo_title` (retained — neutral wording, accurate)
- `event_date_start`: 2026-12-07 ✓ unchanged
- `event_date_end`: 2026-12-11 ✓ unchanged
- `source_url` ✓ unchanged
- All other non-content fields ✓ unchanged

---

## Confirmations

- **Unsupported 200,000/6,800 claims removed:** ✓ Zero hits for these phrases on live /events/gitex-global-2026 and /ru/events/gitex-global-2026
- **Venue wording corrected:** ✓ "Scale Summit at Dubai World Trade Centre (7 Dec)" and "Main expo at Expo City Dubai (8–11 Dec)" confirmed present on live pages
- **"First GITEX outside DWTC since 1981" removed:** ✓ Zero hits
- **Dec 7–11 dates unchanged:** ✓ event_date_start/end not touched
- **F1 row untouched:** ✓ F1 updated_at unchanged (2026-06-07T21:45:02.519Z)
- **No unrelated DB rows changed:** ✓ verified by timestamp query
- **No deploy / no build / no code change:** ✓
- **No commit / no push:** ✓
- **No admin / no AI Inbox / no schema changes:** ✓

---

## Cache flush

**ISR file cache deleted:** Both EN and RU GITEX event page ISR files deleted from `.next/server/app/`  
**PM2 reload:** `pm2 reload guidex-production` — graceful, zero downtime, no rebuild  
**PM2 status:** online, 113.8 MB  
**ISR regenerated:** New ISR files written at 05:42 from patched DB — confirmed free of all stale phrases

---

## Live QA results

| Route | HTTP | Stale phrases | DWTC wording | Expo City present |
|---|---|---|---|---|
| `/events/gitex-global-2026` | 200 ✓ | NONE ✓ | ✓ | ✓ |
| `/ru/events/gitex-global-2026` | 200 ✓ | NONE ✓ | ✓ | ✓ |
| `/events/formula-1-abu-dhabi-grand-prix-2026` | 200 ✓ | — | — | — |
| `/` `/ru` `/calendar` `/ru/calendar` | 200 ✓ | — | — | — |
| `/calendar/december-2026-uae-calendar` `/ru/...` | 200 ✓ | — | — | — |
| `/events` `/ru/events` | 200 ✓ | — | — | — |
| `/sitemap.xml` | 200 ✓ | — | — | — |

F1: Yas Marina Circuit present ✓, "Dubai Grand Prix" absent ✓, abudhabigp.com source present ✓

---

## Note on JSON-LD location field in live QA

The JSON-LD `location` field returns `null` on the live production site — expected. The `VENUE_BY_SLUG` lookup table is in the event page template (from Phase 6C-EVENTS-CTR-01), which has not been deployed to production yet. The JSON-LD location will appear once CTR-01 + DB-01 are committed and deployed together.

---

## Next recommended step

Final build and git audit, then **single commit + zero-downtime deploy for both 6C-EVENTS-CTR-01 and 6C-EVENTS-DB-01 together**.

Files to stage:
```
app/(en)/(public)/events/[slug]/page.tsx        ← CTR-01 template
app/ru/events/[slug]/page.tsx                   ← CTR-01 template
NEW_CHAT_TRANSFER.txt
PROJECT_STATE.md
SESSION_LOG.md
docs/content-drafts/events/
```
