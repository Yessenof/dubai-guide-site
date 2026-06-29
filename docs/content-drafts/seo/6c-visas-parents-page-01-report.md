# Phase 6C-VISAS-PARENTS-PAGE-01 — Report

**Date:** 2026-06-29  
**Status:** LOCAL COMPLETE — deploy pending owner approval  
**Type:** New guide page — local only, no deploy, no push

---

## Plan summary

Created a new guide page `parents-visa-dubai` using the prepared draft and confirmed AMER service-centre data. Inserted guide record + 7 steps into DB, added related guides, source notes, and family hub cards for EN + RU.

---

## DB backup path

`data/guides.db.backup-pre-parents-visa-page-01-2026-06-29-23-16-30`

(A second backup was created automatically by the script at `2026-06-29-23-35-28`.)

---

## Files changed

| File | Change type |
|---|---|
| `scripts/create-parents-visa-guide-01.py` | New — DB insert script |
| `lib/related-guides.ts` | Updated — added `parents-visa-dubai` entry |
| `app/(en)/(public)/guides/[slug]/page.tsx` | Updated — added SOURCE_NOTES entry |
| `app/ru/guides/[slug]/page.tsx` | Updated — added SOURCE_NOTES_RU entry |
| `app/(en)/(public)/visas/family/page.tsx` | Updated — added parents visa guide card |
| `app/ru/visas/family/page.tsx` | Updated — added RU parents visa guide card |
| `docs/content-drafts/seo/6c-visas-parents-page-01-report.md` | New — this report |
| `data/guides.db` | Modified locally (gitignored) |

---

## DB guide slug created

`parents-visa-dubai`

Guide ID: `e1b42a7b-34c1-4cad-978b-b7d503f576b6`

Published: `1`

Steps: 7

---

## EN/RU routes

| Route | Status (local) |
|---|---|
| `/guides/parents-visa-dubai` | HTTP 200 |
| `/ru/guides/parents-visa-dubai` | HTTP 200 |
| `/visas/family` | HTTP 200 |
| `/ru/visas/family` | HTTP 200 |

---

## AMER data added

| Data point | Where used | Framing |
|---|---|---|
| Open file fee AED 283.15 | Step 3 cost field + overview fee paragraph | Amer notes |
| Entry permit outside AED 439.90 / inside AED 1,089.90 | Step 4 cost + advice | Amer notes |
| Change of status AED 698.90 | Step 4 advice + overview | Amer notes |
| Medical AED 372.50 | Step 5 cost | Amer notes |
| Emirates ID 1yr AED 286.50 / 2yr AED 386.50 | Step 6 cost + advice | Amer notes |
| Stamping 1yr AED 409.90 / 2yr AED 510 | Step 7 cost + advice | Amer notes |
| Salary reference AED 10,500 | Step 2 advice + overview | "Amer notes reviewed by Guidex...reviewed case by case at GDRFA" |
| Deposit reference AED 5,000 | Step 3 advice + overview | "Amer notes reference...reviewed case by case at GDRFA" |
| Cancellation inside AED 189.90 / outside AED 289.90 | Overview fee paragraph | Amer notes |
| Modification AED 372 / replacement EID AED 486.12 | Overview fee paragraph | Amer notes |
| Update mobile AED 105 / violation committee AED 289.90 | Overview fee paragraph | Amer notes |
| Two-bedroom Ejari requirement | Step 2 advice + overview | Amer notes |
| 3-month bank statement | Step 2 + overview | Document requirement |
| Sponsor birth certificate MOFA attestation chain | Step 1 + overview | Process requirement |

---

## Internal links / hub cards added

| Location | Addition |
|---|---|
| `/visas/family` (EN hub) | "Parents Visa Dubai: Sponsor Mother or Father" card with href `/guides/parents-visa-dubai` |
| `/ru/visas/family` (RU hub) | "Виза для родителей в Дубае" card with href `/ru/guides/parents-visa-dubai` |
| Guide detail related section | `renew-family-visa-dubai`, `golden-visa-dubai-property`, `employment-visa` via RELATED_GUIDES |
| Guide detail source note | "AMER · GDRFA Dubai — reviewed case by case at GDRFA" (EN + RU) |

---

## EN/RU parity

All fields populated in both languages. RU is natural editorial Russian:

| EN | RU |
|---|---|
| "Amer notes reviewed by Guidex" | "по данным AMER, предоставленным Guidex" |
| "reviewed case by case at GDRFA" | "рассматриваются в каждом случае индивидуально в GDRFA" |
| "not published statutory thresholds" | "не являются официальными пороговыми значениями" |
| "for reference only -- confirm at counter" | "только для ориентира -- уточняйте в центре" |
| "health insurance cost varies by category" | "страховка обязательна, стоимость зависит от категории" |

No English fallback detected in RU route.

---

## Build result

90/90 static pages (was 88 — 2 new: `/guides/parents-visa-dubai` + `/ru/guides/parents-visa-dubai`). 0 TypeScript errors.

---

## Local QA result

| Check | Result |
|---|---|
| HTTP 200 on all 4 routes | ✓ |
| Guide appears in EN family hub | ✓ Parents Visa Dubai |
| Guide appears in RU family hub | ✓ Виза для родителей в Дубае |
| AMER fee note AED 283.15 visible | ✓ |
| AED 10,500 framed as Amer note + GDRFA review | ✓ "Amer notes reviewed by Guidex...reviewed case by case" |
| AED 5,000 framed as case-by-case note | ✓ |
| HowTo JSON-LD generated | ✓ (7 steps ≥ 2 threshold) |
| Source note "AMER · GDRFA Dubai" rendered | ✓ |
| RU no EN fallback | ✓ CLEAN |
| "guaranteed" forbidden phrase | ✓ count 0 |
| "always required" forbidden phrase | ✓ count 0 |
| Related guides section renders | ✓ |

---

## Confirmed

- No deploy
- No push
- No schema changes (guide template renders dynamically from existing schema)
- No migrations
- No admin / AI Inbox / auth / proxy changes
- No manual PM2 stop/start
- Existing confirmed content not removed

---

## Production deploy script needed

A production equivalent must be created before deploying. The local script inserts with `var/www` safety gate. Production script: `scripts/create-parents-visa-guide-01-production.py` (same content, targeting `/var/www/guidex/data/guides.db`).
