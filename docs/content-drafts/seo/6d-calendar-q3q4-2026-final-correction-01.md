# Phase 6D-CALENDAR-Q3Q4-2026-FINAL-CORRECTION-01 — Correction Report

**Phase:** 6D-CALENDAR-Q3Q4-2026-FINAL-CORRECTION-01  
**Date completed:** 2026-08-06  
**Status:** COMPLETE — all 9 corrections applied, build verified, docs updated  
**Production deployed:** NO  

---

## 1. Objective

This correction phase identified and fixed factual errors in the Phase 6D documentation and database that were not caught before the original audit report was committed. It also corrects the characterisation of 13 stub-level calendar items that had been mislabelled as a "Russian brief gap" when in fact both `brief_en` and `brief_ru` are empty for all 13.

---

## 2. Scope

| ID | Correction type | Target |
|----|----------------|--------|
| C1 | DB data fix | DEC-04-GITEX: label/brief venue inaccuracy (split venue) |
| C2 | DB data fix | OCT-06-MARX: dead Platinumlist 404 URL → CCA official |
| C3 | Doc fix | Audit report: F1 race date "Dec 5-7" → "race day Sunday Dec 6" |
| C4 | Doc fix | Audit report: GITEX venue description — add Scale Summit/DWTC split |
| C5 | Doc fix | Audit report + CSV: October count "+11 new" → "+12 new", pre-6D "15" → "14" |
| C6 | Doc fix | Audit report: 13 stub items correctly characterised as brief_en + brief_ru both empty |
| C7 | Doc fix | Audit report: remove false "pages fall back to EN" claim for brief section |
| C8 | CSV update | 6d-monthly-coverage-summary.csv: October row corrected |
| C9 | CSV update | 6d-site-audit-defect-matrix.csv: defects D6–D9 + G3 added |

---

## 3. DB Correction — DEC-04-GITEX (C1)

**Defect D7:** The calendar item `DEC-04-GITEX` in `december-2026-uae-calendar.dates_json` had `label_en` stating "at Expo City Dubai (7-11 December)". This is misleading: GITEX Global 2026 opens with **GITEX Scale Summit on 7 December at Dubai World Trade Centre (DWTC)**; the main GITEX Global Expo runs **8-11 December at Expo City Dubai** (Dubai Exhibition Centre). The GITEX event page (`/events/gitex-global-2026`) was already correct; only the calendar item was wrong.

**Fix applied via:** `scripts/patch-6d-final-correction-01.ts`

**Pre-fix label_en:** `GITEX Global 2026 at Expo City Dubai (7-11 December) -- first edition at new venue`

**Post-fix label_en:** `GITEX Global 2026 (7-11 December) — Scale Summit Dec 7 at DWTC; main expo Dec 8-11 at Expo City Dubai`

**Post-fix label_ru:** `GITEX Global 2026 (7-11 декабря) — Scale Summit 7 дек. в DWTC; основная выставка 8-11 дек. в Expo City Dubai`

**Post-fix brief_en:** Two-venue structure correctly described. Scale Summit Dec 7 at DWTC named first; main expo Dec 8-11 at Expo City Dubai (Dubai Exhibition Centre) named second. First-edition-at-new-venue claim retained (accurate for main expo venue).

**Post-fix brief_ru:** Russian translation of above. Not a copy of EN — written in natural Russian.

**Verified:** DB query post-patch confirmed new label/brief values. Build 92/92. Integrity check ok.

---

## 4. DB Correction — OCT-06-MARX (C2)

**Defect D6:** `OCT-06-MARX` had `source_url` and `cta_url` both set to `https://dubai.platinumlist.net/event-tickets/105069/richard-marx-live-at-coca-cola-arena-in-dubai` which returns HTTP 404. Users clicking the "Tickets from AED 225" button on the calendar brief were sent to a dead page.

**Fix applied via:** `scripts/patch-6d-final-correction-01.ts`

**Pre-fix URL:** `https://dubai.platinumlist.net/event-tickets/105069/richard-marx-live-at-coca-cola-arena-in-dubai` (404)

**Post-fix source_url:** `https://coca-cola-arena.com/music/1837/richard-marx` (T1 — CCA official venue page)

**Post-fix cta_url:** `https://coca-cola-arena.com/music/1837/richard-marx`

**Post-fix source_label_en:** `Coca-Cola Arena (official)` (Platinumlist reference removed)

**Post-fix source_label_ru:** `Coca-Cola Arena (официально)`

**cta_type:** remains `ticket` — CCA official page hosts ticket sales for this event.

**cta_label_en/ru:** unchanged — `Tickets from AED 225` / `Билеты от AED 225`

**Verified:** DB query post-patch confirmed new URL. Build 92/92. Integrity check ok.

---

## 5. Doc Fix — F1 Race Date in Audit Report (C3)

**Defect D9:** `6d-calendar-q3q4-2026-audit.md` line 91 stated "Race Dec 5-7; Yasalam Dec 3-6" for Formula 1 Abu Dhabi GP 2026. This is wrong. The race is on **Sunday 6 December 2026** only. The F1 GP *weekend* runs Dec 4-6 (practice Dec 4-5, qualifying Dec 5, race Dec 6). Yasalam concerts started Dec 3.

**DB state was always correct:** `DEC-03-F1` has `date: 2026-12-04`, `period_end: 2026-12-06`. The error was in documentation only.

**Fix:** Audit report table row updated to: "F1 GP weekend Dec 4-6; race day Sunday Dec 6; Yasalam concerts Dec 3-5"

---

## 6. Doc Fix — GITEX Venue Description in Audit Report (C4)

**Fix:** Audit report table row for GITEX updated from "Dec 7-11 at Expo City Dubai" to "Dec 7 Scale Summit at DWTC; Dec 8-11 main expo at Expo City Dubai". GSC Wave table entry updated to reflect the split and the calendar item correction.

---

## 7. Doc Fix — October Count Reconciliation (C5)

**Defect D8:** The audit report stated "October 2026 (26 total; was 15 pre-6D)" and "Net new Phase 6D October: +11 new items + 2 date corrections". The correct counts, verified from DB:

- Pre-6D October items: **14** (OCT-01 through OCT-R2, OCT-DFC, OCT-NEW-01 through OCT-NEW-05)
- Phase 6D new October items: **12** (5 in Batch-02: OCT-6D-01/02/03/04/05 + 7 in Batch-03: OCT-NEW-DHF/MARILYNE/MUNAWAR/GILLIGAN/ACHKAR/GIPSY/MELADZE)
- Total October items: **26** ✓ (unchanged — 14 + 12 = 26)

**Total Phase 6D new items across all months:** Aug 7 + Sep 4 + Oct 12 + Nov 2 + Dec 1 = **26 new items**

**Fixes applied to:**
- `6d-calendar-q3q4-2026-audit.md`: lines 154, 173, 241, 332, 504
- `6d-monthly-coverage-summary.csv`: October row (existing_confirmed 15→14, added_phase_6d 11→12)

---

## 8. Doc Fix — 13 Stub Items Correctly Characterised (C6, C7)

**Defect G3:** The original audit report described "13 pre-6D items with empty `brief_ru`" and stated "pages fall back to EN". Both claims are wrong.

**Actual DB state (verified by reading all 13 items):**
- All 13 items have `brief_en` **and** `brief_ru` both empty (empty string or field absent)
- `CalendarBriefSection.tsx` line 30-31: `isRu ? !!item.brief_ru : !!item.brief_en` — strict locale gate
- These items are filtered out of the expandable-brief section on **both** EN and RU pages
- There is no EN fallback rendered for these items on the RU page (the brief section simply does not appear)

**The 13 items (by ID):**
- Aug: AUG-02-DEFLEP, AUG-03-DIHAD
- Sep: SEP-01-MEE, SEP-02-IPS, SEP-03-AIM, SEP-05-PLME, SEP-06-SEAMLESS, SEP-07-FOREX
- Oct: OCT-01-BEAUTY, OCT-03-VAT, OCT-04-EINV
- Nov: NOV-GFMFG
- Dec: DEC-ENS

**Note on NOV-GFMFG and DEC-ENS:** These two items also use the old schema format (no `source_label_en`, no `cta_type`, no `cta_url` fields — only `source_label` and `source_url`). They predate the current CalendarDateItem schema additions. They are functional (label and source URL present) but lack the richer brief/CTA structure.

**Classification:** P1 content backlog. Each item requires adding `brief_en` + `brief_ru` using only verified facts. Not a Phase 6D regression. Must not be filled with EN text copied into the RU field.

**Fixes applied to:** `6d-calendar-q3q4-2026-audit.md` sections 7 (EN/RU parity result), 12 (monthly completion gate table and pre-existing gap note).

---

## 9. Production Safety — July DB Mismatch

**Known invariant (NOT a Phase 6D defect — pre-existing):**

Local `data/guides.db` has **6 July 2026 items**. Production DB has **10 July 2026 items** (JUL-NEW-04/05/06/07 were added in Phase 6C Batch-01C via a handoff patch run directly on the production server; those 4 items were never synced to local).

**Production deployment invariant:**
1. NEVER replace production DB with local DB by `scp data/guides.db` — this would destroy the 4 July production items
2. Always run Phase 6D patch scripts **against the live production DB** via SSH
3. The correct deployment sequence is:
   a. SSH to Cloudways server
   b. Create timestamped server-side backup: `cp data/guides.db data/guides.db.backup-$(date +%Y%m%d-%H%M%S)`
   c. Run each Phase 6D patch script against the server DB in order:
      - `scripts/patch-6d-calendar-batch-01.ts`
      - `scripts/patch-6d-calendar-batch-02.ts`
      - `scripts/patch-6d-calendar-batch-03-sep-oct.ts`
      - `scripts/patch-6d-final-correction-01.ts`
   d. Verify July slug still has 10 items after patching: `SELECT COUNT(*) FROM calendar_pages WHERE slug='july-2026-dubai-calendar'` should return the embedded item count (July is one row with dates_json)
   e. Run npm run build; pm2 restart
4. Phase 6D scripts only target slugs: `august-2026-dubai-calendar`, `september-2026-dubai-calendar`, `october-2026-dubai-calendar`, `november-2026-dubai-calendar`, `december-2026-uae-calendar` — July is untouched

**This deployment must be approved separately before execution.** This report stops before production deployment.

---

## 10. GSC Canonical Route Verification

All Wave 1 and Wave 2 GSC URLs confirmed as valid Next.js static routes:

| Route | Source | Confirmed |
|-------|--------|-----------|
| `/calendar/october-2026-dubai-calendar` | SSG — generateStaticParams | ✓ in 92-page build |
| `/calendar/september-2026-dubai-calendar` | SSG — generateStaticParams | ✓ in 92-page build |
| `/calendar/august-2026-dubai-calendar` | SSG — generateStaticParams | ✓ in 92-page build |
| `/calendar/november-2026-dubai-calendar` | SSG — generateStaticParams | ✓ in 92-page build |
| `/calendar/december-2026-uae-calendar` | SSG — generateStaticParams | ✓ in 92-page build |
| `/events/gitex-global-2026` | SSG — generateStaticParams | ✓ in 92-page build |

No noindex flags were set on these routes. Canonical is self-referencing (default Next.js behaviour). hreflang: each EN calendar route has an RU mirror at `/ru/calendar/[slug]`.

---

## 11. Build QA

| Check | Result |
|-------|--------|
| `npm run build` pages | 92/92 ✓ |
| TypeScript errors | 0 ✓ |
| DB integrity_check pre-patch | ok ✓ |
| DB integrity_check post-patch | ok ✓ |
| DEC-04-GITEX label corrected | ✓ verified DB query |
| OCT-06-MARX URL corrected | ✓ verified DB query |
| Audit report F1 race date | ✓ corrected to "race day Sunday Dec 6" |
| Audit report GITEX venue | ✓ corrected to Split venue description |
| October count corrections | ✓ all occurrences updated |
| Monthly coverage CSV Oct row | ✓ existing_confirmed=14, added_phase_6d=12 |
| Defect matrix CSV | ✓ D6–D9, G3 added |

---

## 12. Files Changed in This Correction Phase

**DB patches (via `scripts/patch-6d-final-correction-01.ts`):**
- `data/guides.db` — October: OCT-06-MARX source/cta URL updated; December: DEC-04-GITEX label + brief corrected

**New script:**
- `scripts/patch-6d-final-correction-01.ts`

**Documentation corrected:**
- `docs/content-drafts/seo/6d-calendar-q3q4-2026-audit.md`
- `docs/content-drafts/seo/data/6d-monthly-coverage-summary.csv`
- `docs/content-drafts/seo/data/6d-site-audit-defect-matrix.csv`

**New documentation:**
- `docs/content-drafts/seo/6d-calendar-q3q4-2026-final-correction-01.md` (this file)

**Memory files (to be updated):**
- `PROJECT_STATE.md`
- `SESSION_LOG.md`

---

## 13. Commit

**Planned commit message:** `fix: reconcile Phase 6D facts and deployment safety (6D-FINAL-CORRECTION-01)`

**Production deployment:** NOT performed. Requires separate approval.

---

## 14. Open Items / P1 Backlog

| Item | Priority | Notes |
|------|----------|-------|
| Add brief_en + brief_ru for 13 stub items | P1 | Content backlog. Must use only verified facts per item. OCT-03-VAT and OCT-04-EINV are highest priority (regulatory deadlines, most actionable). |
| Production deployment | P1 | Run patch scripts in order on production DB. Requires owner approval. Verify July count unchanged after deploy. |
| GSC manual URL submission | Wave 1 ready | Submit 5 calendar URLs + GITEX event page after production deploy. |
| OCT-03-VAT brief — regulatory copy | P1 | VAT Q3 deadline. Source: FTA official. Facts are in the label. |
| OCT-04-EINV brief — regulatory copy | P1 | E-invoicing Phase A ASP deadline for AED 50M+ businesses. Source: Ministry of Finance / FTA. |
