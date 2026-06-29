# Phase 6C-VISAS-AMER-DATA-INTEGRATION-01 — Report

**Date:** 2026-06-29  
**Phase:** 6C-VISAS-AMER-DATA-INTEGRATION-01  
**Type:** Local content optimization — DB + production scripts only  
**Status:** LOCAL COMPLETE — deploy pending owner approval

---

## Summary

Integrated AMER service-centre practical data from owner-provided photos into existing visa guides. All additions are phrased as AMER practical/filing notes, not as universal UAE law. No schema changes. No hub page changes. No push. No deploy.

---

## DB backup path

`data/guides.db.backup-pre-amer-data-integration-01-2026-06-29-17-29-55`

(A second backup was created by the script itself at runtime.)

---

## Files changed

| File | Change type |
|---|---|
| `scripts/update-visa-amer-data-01-local.py` | New — local DB update script |
| `scripts/update-visa-amer-data-01-production.py` | New — production DB update script |
| `docs/content-drafts/guides/parents-visa-dubai-draft.md` | New — parents visa content draft |
| `docs/content-drafts/seo/6c-visas-amer-data-integration-01-report.md` | New — this report |
| `data/guides.db` | Modified locally (gitignored — applied via Python script) |

No hub page TSX files changed in this phase.

---

## DB guide slugs changed

| Slug | What changed |
|---|---|
| `employment-visa` | Overview +1 para (stamping checklist + ILOE note); Steps 3, 5, 8 advice updated |
| `golden-visa-dubai-property` | Overview +2 paras (joint ownership, AMER fees); Steps 2, 4, 7 advice updated |

---

## AMER data added by page

### employment-visa

**Overview (new paragraph):**
- Full stamping appointment document list (PRO role at Amer Step 8)
- ILOE arrears fine: AED 400/year collected at Amer

**Step 3 (Entry permit inside):**
- MB number (MOHRE labor number) requirement to open Amer file

**Step 5 (Medical):**
- Email address and mobile number required at medical clinic

**Step 8 (Stamping):**
- Full Amer counter checklist: sponsor Emirates ID, passport copy, e-visa confirmation, EID application reference, Tawjeeh sign-off, signed final contract, ILOE insurance
- ILOE arrears fine: AED 400/year at this stage

---

### golden-visa-dubai-property

**Overview (new para 1 — joint ownership):**
- Shared freehold with spouse: higher-percentage partner applies
- MOFA-attested marriage certificate required

**Overview (new para 2 — AMER fees):**
- Amer package: ~AED 15,000 below age 65 / AED 17,000 above age 65
- Labeled as Amer service-centre notes, not official government fee

**Step 2 (Prepare docs):**
- Expanded from 2 cases to 4 cases: ready freehold, off-plan, mortgage, joint ownership with spouse
- Off-plan: minimum 30% of purchase price paid + statement of account
- Mortgage: title deed + instalment plan + bank NOC
- Joint ownership: higher-share partner applies + MOFA marriage certificate

**Step 4 (Submit application):**
- Amer package fee note: AED 15,000 / AED 17,000 by age
- Labeled as Amer centre quotes, not official fee

**Step 7 (Family sponsorship):**
- Parent-specific AMER requirements: salary AED 10,500, two-bedroom Ejari, 3-month bank statement, sponsor birth certificate attested by MOFA, proof of relationship, refundable deposit AED 5,000
- Labeled as "Amer notes may list" and "reviewed case by case at GDRFA"

---

## AMER data intentionally kept for future page / backlog

| Data point | Reason not published |
|---|---|
| **Parents visa full flow** | No guide page exists; too much for golden-visa Step 7 alone. Content draft at `docs/content-drafts/guides/parents-visa-dubai-draft.md` |
| **Sponsorship transfer 2yr: AED 559.9 / 3yr: AED 659.9** | No employment-visa cancellation/transfer section exists; would create a new scope without a clear page |
| **Partner/investor deposit AED 3,060** | Too case-specific (investor partner, not standard employment) |
| **48% share threshold for partner visa** | Complex co-ownership eligibility; risk of misapplication without full context |
| **Ukraine visa 1 year only (AED 410)** | Country-specific, not relevant to any current guide; risk of creating misleading country-specific content |
| **Absconding fee: AED 445** | Negative/compliance context; no current guide covers this |
| **Retirement/dependence Golden Visa (1M, 55 y/o, 5yr: AED 2,259.90)** | Separate route; belongs in a dedicated retirement visa guide or golden visa hub expansion |
| **GCC EID: AED 286** | Operational detail; not relevant to any current guide |
| **Violation committee fee: AED 289.9 / 326.5** | Compliance context; no current guide covers violations |
| **Update mobile number: AED 105** | Operational, not guide-level content |

---

## EN/RU parity

All overview additions and step advice updates were written in both EN and RU. Russian was written as natural editorial Russian, not literal translation. Key phrasing:

| EN | RU |
|---|---|
| "Amer notes may list" | "AMER может запросить" |
| "reviewed case by case at GDRFA" | "определяется индивидуально в GDRFA" |
| "Amer centres typically quote" | "сервисные центры AMER, как правило, называют" |
| "actual cost varies" | "фактическая стоимость зависит" |
| "higher registered ownership percentage" | "доля собственности выше" |

---

## Build result

88/88 static pages, 0 TypeScript errors. Build time ~37s.

---

## Local QA result

All routes: HTTP 200

| Route | Status |
|---|---|
| `/guides/employment-visa` | 200 |
| `/ru/guides/employment-visa` | 200 |
| `/guides/golden-visa-dubai-property` | 200 |
| `/ru/guides/golden-visa-dubai-property` | 200 |

Content presence checks (EN): all 8 new data points confirmed in page HTML.  
Content presence checks (RU): all 6 RU equivalents confirmed. No EN fallback detected.

Page word counts: employment-visa 4,186 words / golden-visa 3,828 words — within acceptable range.

---

## Confirmed

- No deploy
- No push
- No schema changes
- No migrations
- No admin / AI Inbox / auth / proxy changes
- No manual PM2 stop/start
- DB backup created: `data/guides.db.backup-pre-amer-data-integration-01-2026-06-29-17-29-55`
- No existing confirmed content removed
- EN/RU parity maintained

---

## Next step (pending owner approval)

Deploy via:
```bash
# On server:
git pull origin main
python3 scripts/update-visa-amer-data-01-production.py
bash scripts/deploy-zero-downtime.sh
```
