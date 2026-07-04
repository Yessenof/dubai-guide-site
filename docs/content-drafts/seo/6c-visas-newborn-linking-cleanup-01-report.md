# Phase 6C-VISAS-NEWBORN-LINKING-CLEANUP-01 — Report

**Date:** 2026-07-01  
**Production commit at start:** `39954ed`  
**Status:** LOCAL COMPLETE — no deploy, no push

---

## Dead slugs found

In `lib/related-guides.ts`, key `newborn-visa-dubai`:

| Slot | Old slug | Status |
|---|---|---|
| 1 | `child-dependent-dubai-inside` | MISSING — slug does not exist in DB |
| 2 | `spouse-dependent-dubai-inside` | MISSING — slug does not exist in DB |
| 3 | `renew-family-visa-dubai` | OK — kept |

Both dead slugs were legacy short-form names that never existed in the DB. `getPublishedGuidesForBand` returned nothing for them, so the newborn guide was rendering only 1 related guide instead of 3.

---

## Replacement slugs used

| Slot | New slug | DB status | Title |
|---|---|---|---|
| 1 | `spouse-dependent-visa-dubai-inside-country` | Published ✓ | How to Sponsor a Spouse Residence Visa in Dubai Without Leaving the UAE |
| 2 | `spouse-dependent-visa-dubai-outside-country` | Published ✓ | How to Sponsor a Spouse Residence Visa in Dubai from Outside the UAE |
| 3 | `renew-family-visa-dubai` | Published ✓ | How to Renew a Family Residence Visa in Dubai (unchanged) |

Note: The EN direct URLs for these slugs return 308 (permanent redirect to group pages in `next.config.ts`) — this is expected project behaviour. The related-guides band uses the slug to query the DB title/summary and renders the correct href; the 308 redirect at the browser level is harmless and consistent with how the rest of the site links to these guides.

---

## Files changed

| File | Change |
|---|---|
| `lib/related-guides.ts` | Replaced 2 dead slugs in `newborn-visa-dubai` entry |

No DB writes. No other files changed.

---

## Build result

90/90 static pages, 0 TypeScript errors.

---

## Local QA result

| Route | Status |
|---|---|
| `/guides/newborn-visa-dubai` | 200 ✓ |
| `/ru/guides/newborn-visa-dubai` | 200 ✓ |
| `/guides/spouse-dependent-visa-dubai-inside-country` | 308 → group page ✓ (expected) |
| `/ru/guides/spouse-dependent-visa-dubai-inside-country` | 200 ✓ |
| `/guides/spouse-dependent-visa-dubai-outside-country` | 308 → group page ✓ (expected) |
| `/ru/guides/spouse-dependent-visa-dubai-outside-country` | 200 ✓ |
| `/guides/renew-family-visa-dubai` | 200 ✓ |
| `/ru/guides/renew-family-visa-dubai` | 200 ✓ |
| `/visas/family` | 200 ✓ |
| `/ru/visas/family` | 200 ✓ |

Content checks:
- Newborn EN related section: 3 guides visible — "Sponsor a Spouse...Inside", "Sponsor a Spouse...Outside", "Renew a Family" ✓
- Newborn RU related section: 3 guides visible in Russian ✓
- Dead slug names absent from rendered output ✓
- RU no English fallback ✓
- No new content claims added ✓

---

## Confirmed

- No DB writes
- No deploy
- No push
- No schema changes
- No migrations
- No admin / AI Inbox / auth / proxy changes
- No manual PM2 stop/start
- No new visa requirements, fees, salary, deposit or AMER claims added
