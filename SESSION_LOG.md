# Session Log — Dubai Guide Site

Reverse chronological. One entry per meaningful implementation step.
Trivial edits (typos, comment fixes) do not get entries.

---

## 2026-05-04 — Fix /ru/government 404 links — local only, not yet deployed

`app/ru/government/page.tsx`: all 3 guide cards converted from broken `/ru/guides/...` links to `soon: true` non-link cards. "Скоро" pill pattern matches RU homepage. No broken links. DB unchanged. Build: 60 pages, 0 errors. 7/7 local smoke tests 200. Not committed, not deployed.

---

## 2026-05-04 — RU hub parity batch deployed (60deb84) — all smoke tests green

`/ru/banking-tax` and `/ru/tourism` live on production. Sitemap fixed (4 hub URLs added). Canonical + hreflang added to all 4 hub pages. RU homepage no longer has any `soon:true` cards. 9/9 smoke tests 200. DB unchanged (17 guides, 115 steps).

TRC card on `/ru/banking-tax` links to EN guide with `· EN` meta label — honest, no fake RU link.

Known issue carried forward: `/ru/government` links to 3 guides with no RU content (will 404 from that hub). Fix deferred to government guide RU translation batch.

---

## 2026-05-04 — CODE7: Deployed to production — all smoke tests green

CODE7 fully live on production at `guidex-consulting.ae`. 10/10 smoke tests 200. All content checks passed.

- TRC inserted to production DB via `npx tsx scripts/add-en-trc.ts` (17 guides, 115 steps)
- `npm run build` — 58 pages, 0 TypeScript errors
- PM2 restarted — `guidex-production` online
- Smoke tests: `/`, `/ru`, `/banking-tax`, `/tourism`, `/guides/tax-residency-certificate-uae`, bank-account, holiday-home, employment-visa, `/ru/guides`, `/sitemap.xml` — all 200
- Content checks: TRC renders, appears on `/guides` index and sitemap, absent from `/ru/guides`; homepage links to `/banking-tax` and `/tourism` confirmed
- Production DB backup: `/var/backups/guidex/guides.db.pre-code7-20260504-114324`

---

## 2026-05-04 — CODE7: Premium hubs, TRC page, visual system, homepage hero, RU parity — committed

Phase complete. All CODE7 local work committed as `d3faa8a feat: add premium hubs and TRC service page`. Not pushed, not deployed.

**What was built:**
- `/banking-tax` hub page — editorial gradient hero, service cards, who-it's-for, WhatsApp CTA
- `/tourism` hub page — same structure, warm-light gradient, JLT image
- `/guides/tax-residency-certificate-uae` — custom static route bypassing `[slug]`, navy premium header block, TRC-specific CTAs, no RouteSnapshot, steps from DB
- `components/PageHero.tsx` — reusable editorial gradient hero (image + gradient + text + children CTA slot)
- `lib/page-visuals.ts` — central gradient config (`light` / `medium` / `warm-light`)
- `components/Header.tsx` — mobile overflow fix: RU pill moved to top row, mobile nav uses flex-wrap
- `components/Hero.tsx` — updated to use PageHero with downtown skyline image
- `app/(public)/page.tsx` — Banking & Tax and Tourism cards activated (removed `soon:true`)
- `app/(public)/guides/[slug]/page.tsx` — `CUSTOM_PAGE_SLUGS` filter excludes TRC from `generateStaticParams`
- `app/ru/page.tsx` — RU hero refactored to PageHero for visual parity
- `scripts/add-en-trc.ts` — one-shot script that inserted TRC guide + 8 steps into local DB (not re-run)
- 3 hub images in `public/images/hubs/`: Business Bay (banking-tax), JLT sunset (tourism), Dubai dusk Burj (homepage/RU)
- `SESSION_LOG.md` updated

**Gradient values:**
- `light` (homepage + RU): `from-white via-white/75 to-white/25`
- `medium` (banking-tax): `from-white via-white/95 to-white/40`
- `warm-light` (tourism): `from-white via-white/90 to-white/50`

**Images:**
- `difc-business-bay-glass-towers.webp` — 131KB, Pexels 19689942
- `jlt-dubai-towers-sunset-reflection.webp` — 140KB, Pexels 29353238
- `dubai-skyline-downtown.webp` — 122KB, Pexels 5087047 (960×1200, dusk Burj+Downtown)

**Build:** 58 pages, 0 TS errors. All 7 routes 200.

**Not done yet:** push to GitHub, deploy to Cloudways, RU translations for TRC/banking-tax/tourism, business bank account guide, add `banking-tax` DB category.

---

## 2026-05-03 — CODE7-EN: TRC guide (EN) inserted locally, homepage Banking & Tax card activated

New guide `tax-residency-certificate-uae` inserted via `scripts/add-en-trc.ts`. Category: government. Published: true (local only). 8 steps. All ru_* fields empty. All guards passed (em-dash, guarantee, AED fee amounts). Homepage EN card renamed from "Banking & Advice" to "Banking & Tax" with href to TRC page. Build: 56 pages, 0 TS errors. Local verification complete. Not pushed, not deployed, not committed.

**Files changed:**
- `scripts/add-en-trc.ts` (new)
- `app/(public)/page.tsx` (Banking & Tax card activated)
- `data/guides.db` (local only — guide + 8 steps inserted)

**Local backup:** `data/guides.db.backup-trc-en-1777805265`

---

## 2026-05-03 — CP-LOCALE-FIX-01: Fixed all 5 RU listing locale bugs locally

Fixed all 5 confirmed bugs from CP-LOCALE-AUDIT-01 in two files. Build clean. Local verification complete. Not pushed.

**Files changed:**
- `app/ru/guides/page.tsx` — added `ruSlugSet` filter (BUG-1), replaced English `RU_GROUP_ENTRIES` with hardcoded Russian (BUG-5)
- `components/TopicCard.tsx` — added `LABELS`, `CATEGORY_RU`, `localizeValue()` calls (BUG-2, BUG-3, BUG-4)

**Verification:**
- Build: 55 pages, 0 TS errors
- `/ru/guides`: shows 8 cards (6 RU-complete DB + 2 Russian group entries), all RU labels, zero EN bleed-through
- `/guides`: EN regression clean — Fee/Time still English, all 14 EN guides listed, zero Russian labels
- `/sitemap.xml`: 200, unchanged

**Status:** Local only. Awaiting owner review before commit.

---

## 2026-05-02 — CP-BATCH-RU-02: Bank Account RU + Holiday Homes RU deployed to production

Batch production deploy. Two targeted scripts run on production. Both passed all guards. Build: 55 pages, 0 errors. PM2 restarted, online. All 4 URLs return 200. Both RU URLs in sitemap. EN pages unchanged. No full DB restore used.

**Scripts run:**
1. `scripts/add-ru-business-bank-account.ts` — 1 guide + 9 steps updated
2. `scripts/add-ru-holiday-home-permit-guide.ts` — 1 guide + 12 steps updated

**Production state:**
- DB backup: `/var/backups/guidex/guides.db.pre-batch-ru-bank-hh-20260502-180053`
- Production HEAD: `b18971e`
- Build: 55 pages, 0 errors
- PM2: online, 0 unstable restarts
- `open-business-bank-account-dubai`: ru_title populated, 9/9 RU steps
- `holiday-home-permit-dubai`: ru_title populated, 12/12 RU steps
- EN fields: unchanged on both guides
- Em-dashes in RU DB content: 0
- Integrity check: ok
- `/tourism` hub: 404 (not created)
- Homepage Tourism card: inactive

**Live:**
- https://guidex-consulting.ae/ru/guides/open-business-bank-account-dubai
- https://guidex-consulting.ae/ru/guides/holiday-home-permit-dubai

---

## 2026-05-02 — CP-BATCH-RU-01: Bank RU script verified locally, ready for batch production deploy

Verified `scripts/add-ru-business-bank-account.ts` against all content rules. Script run locally: 1 guide + 9 steps updated, all guards passed, 0 em-dashes. EN title unchanged. Build: 55 pages, 0 errors. All 4 URLs return 200. Both RU URLs in sitemap. Script committed. Ready to batch with Holiday Homes RU in one production maintenance session.

**Changes:**
- `scripts/add-ru-business-bank-account.ts` committed (local run only, no production change)
- `docs/bank-account-guide-upgrade-audit.md` updated with RU status
- `docs/ru-guide-value-localization-audit.md` committed (research doc)

**Production: untouched. Local only.**

---

## 2026-05-02 — CP-HH-RU-02A: Russian content phrase polish for holiday-home-permit-dubai

Patched 5 weak phrases in `scripts/add-ru-holiday-home-permit-guide.ts`. Script rerun: 1 guide + 12 steps updated, all guards passed, 0 em-dashes. Build: 55 pages, 0 errors. RU page 200. Sitemap includes `/ru/guides/holiday-home-permit-dubai`. Ready for production deploy.

**Changes:**
- `scripts/add-ru-holiday-home-permit-guide.ts`: Step 1 ru_what (Add New Unit / Renew phrasing), Step 2 ru_advice (portal login note), Step 4 ru_advice (date errors), Step 7 ru_advice (DET classification self-service), Step 12 ru_advice (Tourism Dirham obligation)

**Production: untouched. Local only.**

---

## 2026-05-02 — CP-HH-RU-01: Russian content for holiday-home-permit-dubai (local only)

Created `scripts/add-ru-holiday-home-permit-guide.ts`. Wrote RU content for all guide-level fields and all 12 steps. Updated `lib/localize-value.ts` with 16 new HH-specific mappings.

**Changes:**
- `scripts/add-ru-holiday-home-permit-guide.ts` created: UPDATE-only script, targets RU fields only, does not touch EN fields or published status, transaction with full post-write verification
- `lib/localize-value.ts`: 9 new timeEst mappings + 5 new cost mappings + 2 guide-level price/timeline mappings
- DB: ru_title, ru_summary, ru_audience, ru_overview populated; all 12 steps have ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning
- DB backup: `data/guides.db.backup-holiday-home-ru-content-1777742571`

**Verification:**
- Script guards: em-dash (caught and fixed 1 in script + 1 in localize-value.ts), guarantee, partnership, private data — all pass
- DB: 12/12 steps have ru_title, ru_what, ru_advice, ru_warning; em-dash count in RU DB fields = 0
- Build: 55 pages, 0 errors (+1 RU holiday home guide now pre-rendered)
- Sitemap: /ru/guides/holiday-home-permit-dubai now included locally
- RU page: correct H1 in Russian, 12 Russian step titles, no EN body fallback, 2 em-dashes (standard title separator only)
- EN guide: unchanged, still 200
- Bank pages (local): unchanged

**Production: untouched. Local only.**

---

## 2026-05-02 — CP-HH-03B: Holiday home permit guide deployed to production

Targeted script `scripts/add-holiday-home-permit-guide.ts` run on production. Guide is live at https://guidex-consulting.ae/guides/holiday-home-permit-dubai.

**Deployment sequence:**
- Commit `2dbd005` pushed to `origin/main`
- Production pulled: `git pull origin main` on `root@85.9.203.69:/var/www/guidex`
- Production DB backed up: `/var/backups/guidex/guides.db.pre-holiday-home-guide-20260502-164949`
- Script run: guide created fresh (did not exist on production), `published=1`, 12 steps, all guards passed, em-dash=0, RU fields empty
- Production build: 53 pages, 0 errors (EN holiday guide included, RU holiday guide absent — correct, no ru_title)
- PM2 restarted: `guidex-production` online, 0 unstable restarts

**Smoke tests passed:**
- `https://guidex-consulting.ae/guides/holiday-home-permit-dubai` → 200, correct H1 and meta
- `/guides` → 200, Tourism section present, holiday home link present
- `/ru/guides/employment-visa` → 200 (RU pages intact)
- `/` → 200, Tourism card still inactive/Coming soon, no direct link to guide
- Sitemap: `/guides/holiday-home-permit-dubai` present, `/ru/guides/holiday-home-permit-dubai` absent

**No full DB restore used. No bank/RU files deployed.**

---

## 2026-05-02 — CP-HH-02E: Holiday home permit guide final content QA polish (local only)

Final pre-review pass on `scripts/add-holiday-home-permit-guide.ts`. Guide remains DRAFT.

**Changes (7 targeted edits):**
1. All `tourism.gov.ae` en_address values replaced with `HH Permits portal` (10 steps, replace_all)
2. Step 2 address: `tourism.gov.ae (HH Permits section)` → `HH Permits portal`
3. Step 2 warning (was empty): account type caution added
4. Step 3 warning (was empty): bedroom count caution added
5. Step 5 advice: tenant/non-owner cautious note appended ("If the applicant is not the property owner, or if a company or operator manages the unit, check current portal requirements...")
6. Step 6 warning (was empty): submission risk caution added
7. Step 8 warning (was empty): portal fee controls caution added

**All 12 warnings now non-empty.**
**Zero `tourism.gov.ae` in any en_address field.**

**DB backup:** data/guides.db.backup-holiday-home-final-polish-1777717040
**Build:** 63 pages, 0 errors. **Production:** untouched. **Git pushed:** no.

---

## 2026-05-02 — CP-HH-02D: Holiday home permit guide EN accuracy polish (local only)

Applied 8 accuracy and wording fixes to `scripts/add-holiday-home-permit-guide.ts` and reran locally. Guide remains DRAFT.

**Fixes applied:**
1. Step 5: Property Management Letter added to document list with cautious wording ("may be required depending on applicant type and portal flow")
2. Step 2 advice: owner-managed vs operator-managed note added ("A separate management company is not always required...")
3. Step 5 what + advice: DEWA wording updated to "recent DEWA bill and the DEWA number requested by the portal"; added account-vs-premises number caution
4. Step 4 what: "Permits are valid for one year" replaced with "Holiday home permits are generally annual"; added Property Management Letter date-matching note for operator-managed units
5. Step 6 title changed to "Review and Submit the Application"; what and advice rewritten to be safe about portal stage labeling
6. Step 7 what: classification timing made portal-sequence-safe; advice added DET public guidance note
7. Step 10 advice: payment-pending status clarified as not meaning approved; new warning added for Renewal Payment Pending Approval persistence
8. Step 11 what: added "unit status must show Approved before you rely on the permit"; new warning: do not list until status is Approved
9. Step 12 advice: added "Holiday Homes 2.0 handles guest check-ins, check-outs, Tourism Dirham payments and QR code functions where applicable"

**DB backup:** data/guides.db.backup-holiday-home-polish-1777716404
**Build:** 63 pages, 0 errors. **Production:** untouched. **Git pushed:** no.

---

## 2026-05-02 — CP-HH-02B: Holiday home permit guide created as draft (local only)

Created guide `holiday-home-permit-dubai` via `scripts/add-holiday-home-permit-guide.ts`. Draft only, not published.

**Script:** `scripts/add-holiday-home-permit-guide.ts`
- Pre-write validation: em-dash, guarantee language, partnership language, private data
- Transaction: delete-if-exists then insert guide + 12 steps
- Post-write verification: step count = 12, RU fields empty, em-dashes = 0, category = tourism, published = 0

**Guide fields:**
- en_title: "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Booking.com"
- slug: holiday-home-permit-dubai
- category: tourism
- published: false (DRAFT)
- price: From AED 370 for a 1-bedroom unit...
- timeline: DET lists 1 business day target...

**12 steps created:**
1. Choose Add New Unit or Renew
2. Open the HH Permits Portal
3. Fill Unit Information
4. Set Permit Dates Carefully
5. Upload Required Documents
6. Review Before Submission
7. Complete Unit Classification
8. Check Official Fees
9. Wait for DET Review or Comments
10. Confirm Payment and Upload Receipt if Required
11. Wait for Payment Approval and Record Issuance
12. Print the Permit and Keep the Unit Ready for Guests

**DB backup:** data/guides.db.backup-holiday-home-guide-1777714931
**Build:** 63 pages, 0 errors (guide is draft, not pre-rendered yet; will be 64 pages after publish)
**Production:** untouched. **Git pushed:** no. **Homepage:** unchanged (Tourism card still inactive).

**Admin URL:** http://localhost:3000/admin/guides/holiday-home-permit-dubai
**Public URL (after publish):** http://localhost:3000/guides/holiday-home-permit-dubai

---

## 2026-05-02 — CP-HH-02A: Tourism category support added (local only)

Added `tourism` category value across all relevant frontend files. No guide created, no DB changes, no homepage card activated, no hub page created.

**Files changed (5):**
- `components/admin/GuideFormFields.tsx` — added `{ value: "tourism", label: "Tourism & Short-Term Rentals" }` to CATEGORIES
- `components/CategoryIcon.tsx` — added `"tourism"` to KnownCategory type + key SVG icon (14×14, 1.5px stroke)
- `components/GuideHeader.tsx` — added `"tourism" → "Туризм"` to CATEGORY_RU map
- `app/(public)/guides/page.tsx` — added `"tourism"` to CATEGORY_ORDER + `"Tourism & Short-Term Rentals"` to CATEGORY_LABELS
- `app/ru/guides/page.tsx` — added `"tourism"` to CATEGORY_ORDER + `"Туризм и краткосрочная аренда"` to CATEGORY_LABELS

**Build:** 63 pages, 0 TypeScript errors, 0 warnings.
**DB:** untouched. **Production:** untouched. **Homepage:** no change (Tourism card remains inactive/soon).

**Next:** Create holiday home permit guide via admin panel (slug: `holiday-home-permit-dubai`, category: `tourism`).

---

## 2026-05-01 — CP-HH-01: Holiday Home Permit guide — research and content plan

Created `docs/holiday-home-permit-guide-plan.md` — planning document only, no code/DB/production changes.

**Document covers (10 sections):**
- Executive Summary: "holiday home permit Dubai" / "Airbnb permit Dubai" — high-intent, underserved, neutral slot
- Official Source Findings: DET portal, fee formula (AED 300/bedroom + AED 70 = AED 370 for 1-bed), permit duration 1 year, Tourism Dirham rates (AED 15 Deluxe / AED 10 Standard), 7 unit statuses
- Screenshot Workflow Findings: 6-stage portal flow (Unit Information → Documents → Review → Associated Forms → Pay Fees → Record Issuance)
- SEO/Competitor Gap: underserved by real estate blogs and DET portal pages; AI answer gap
- IA and Naming: new `tourism` category required, slug `holiday-home-permit-dubai`, URL `/guides/holiday-home-permit-dubai`
- Recommended Guide Structure: 12 steps from qualification check through Tourism Dirham setup
- Privacy and Legal Cautions: never publish permit numbers, owner names, unit numbers, DEWA numbers, payment refs
- Future Web App Opportunities: fee calculator, document checklist, classification checker, renewal reminder, Tourism Dirham tracker
- Implementation Plan: 4-phase, ~2 hours total effort
- Exact Next Single Action: add `tourism` to CATEGORIES constant in GuideFormFields.tsx

**No implementation.** No DB changes. No scripts. No production changes.

---

## 2026-05-01 — CP-26: RU content for bank account guide (local only)

Added RU content for `open-business-bank-account-dubai` via `scripts/add-ru-business-bank-account.ts`.

**Changes:**
- ru_title: "Открыть бизнес-счёт в банке ОАЭ для компании в Дубае"
- ru_summary, ru_audience, ru_overview: populated
- All 9 steps: ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning populated
- EN fields: unchanged
- Wio Business: example only (not partner), monthly subscription + no minimum balance nuance present, digital onboarding compliance depth mentioned
- POA: one scenario only (not mandatory) — owner/shareholder can apply directly
- Real estate: conditional language ("may ask", "depending on exact activity")
- No em-dashes, no guarantee language, no Wio partnership implication

**Value localization (6 new mappings in lib/localize-value.ts):**
- "No fee (regulatory registration costs are separate)" → Russian
- "No government fee. Bank package, monthly subscription..." → Russian
- "Allow additional weeks if RERA or goAML registration is required." → Russian
- "2–6 weeks from submission (varies by bank and compliance review)" → Russian
- "2–6 weeks (varies by bank, compliance review, and business activity)" → Russian
- Guide price long text → Russian

**Verification:** 9 steps RU complete, 0 em-dashes, EN unchanged, sitemap now includes /ru/guides/open-business-bank-account-dubai, build 63 pages 0 errors.

**Not deployed:** local only. Production DB untouched.

---

## 2026-05-01 — CP-25B: EN bank account guide deployed to production

Deployed upgraded EN content for `open-business-bank-account-dubai` to production via targeted script only.

**Process:**
- Committed `scripts/update-bank-account-guide-en.ts` + docs to GitHub
- SSH into UpCloud (85.9.203.69), git pull origin main
- Production DB backed up at `/var/backups/guidex/guides.db.pre-bank-en-upgrade-20260501-134430`
- Ran `npx tsx scripts/update-bank-account-guide-en.ts` on production server
- Post-write verification: step count = 9, RU empty, 0 em-dashes, integrity_check = ok
- `npm run build` on production: 63 pages, 0 errors
- PM2 restarted: guidex-production online
- Smoke test: EN page 200, H1 correct, 9 steps visible, Wio nuance correct, no guarantee language

**No full DB restore used.** Targeted script only.

---

## 2026-05-01 — Bank account guide EN upgrade (local only)

Upgraded EN content for `open-business-bank-account-dubai` via `scripts/update-bank-account-guide-en.ts`.

**Changes:**
- en_title: "How to Open a Business Bank Account in Dubai" → "Open a Business Bank Account in Dubai for a UAE Company"
- en_summary, en_audience, en_overview, price: fully rewritten
- Steps: 8 → 9 (delete-and-reinsert; all ru_* fields explicitly set to empty string)

**New steps:**
1. Confirm Your Company Profile and Applicant Role
2. Choose the Bank Route and Understand Digital Onboarding
3. Prepare Company, Shareholder, and Authority Documents
4. Build the Business Profile the Bank Can Understand
5. Prepare Customer and Supplier Evidence
6. Explain Source of Funds and Provide Bank History
7. Prepare Expected Transaction and Tax Information
8. Handle Compliance Checks for Real Estate and Regulated Activities
9. Submit, Answer Bank Questions, and Wait for the Decision

**Content covers:** shareholder/POA role types, digital bank option (Wio as example only), customer/supplier profiles, source of funds + 3-month bank statements, FATCA/CRS/TIN, RERA/DNFBP/goAML, expected transaction estimates.

**QA assertions passed:** no em-dashes, no guarantee language, no Wio partnership language, step count = 9, RU empty, build 63 pages 0 errors.

**Local DB backup:** data/guides.db.backup-bank-en-upgrade-1777616978301

**No code changes. No production changes. No RU content.**

CP-25 added.

---

## 2026-04-30 — Bank account guide upgrade audit

Reviewed Wio Business onboarding screenshots (user-provided) and audited the current `open-business-bank-account-dubai` EN guide for content gaps.

**Current state:** 8 steps, all EN fields populated, all RU fields empty. Guide is structurally sound but compliance-thin. Missing: customer/supplier profiles, source of funds detail, 3-month bank statement requirement, RERA warning, CV/LinkedIn, digital bank options, shareholder role types.

**Wio Business evidence:** Shows structured onboarding for applicant role (shareholder/POA/employee), top 5 customers, top 5 suppliers, 3-month bank statements (not password-protected), subsidiary disclosure, consultancy service description, regulated/RERA activity, source of funds declaration, and CV/LinkedIn. Guide covers none of these explicitly.

**Recommendation:** Upgrade EN master guide first (8 → 9 steps). New Step 4 dedicated to source of funds. Step 3 rewritten to cover KYC compliance package (customers, suppliers, bank statements, CV). Steps 5–9 correspond to current 4–8.

**No code, DB, or content changes made in this step.** Audit only.

Audit document: `docs/bank-account-guide-upgrade-audit.md`

---

## 2026-04-30 — Step 4: full RU value localization + D-class em-dash fix

**lib/localize-value.ts expanded** from 21 to 47 mappings, covering:
- 3 guide price strings (AED+English context): "AED 9,884.75 (main applicant)" etc.
- 2 guide timeline conditionals: "(without external approvals)", "(varies by free zone)"
- 10 step cost AED+context strings (employment-visa steps 2/7, golden step 7, mainland steps 4/5/7, free-zone steps 4/5/6)
- 7 step timeEst duration+context strings ("for review", "after payment", "after submission", etc.)
- 2 post-D-fix timeEst mappings ("Varies: 4–10+...", "Varies: bank account...")

**D-class DB patch** (`scripts/patch-d-class-timeest-em-dashes.ts`): removed em-dash from 2 EN `time_est` fields. Applied locally and on production (backup at /var/backups/guidex/guides.db.pre-step4-d-class-fix-*). Verified: mainland step 6 and free-zone step 8 now use colon on both EN and RU pages.

**Build:** 63 pages, 0 errors. **Production smoke test:** all 4 RU guides show Russian values; EN employment-visa shows English; D-class em-dash gone from EN mainland. Commit: bcf98b9. CP-24 added.

**Remaining English on RU pages (intentional, B-class pure AED):**
- AED 278, AED 1,126, AED 676, AED 323, AED 386, AED 546 (employment-visa steps)
- AED 8,031.75, AED 700, AED 1,153 (golden-visa steps)
- AED 620–720 (mainland step 3)
- AED 4,900 – 7,300 (employment-visa guide price)
These are internationally understood in a Dubai financial context — no mapping needed.

---

## 2026-04-30 — Step 3: display-level value localization for RU guide pages

Created `lib/localize-value.ts` with 21 exact-match A-class mappings (cost + timeEst strings) and a month-name regex for `lastUpdated`. Helper returns original value unchanged for any unmatched or B/C-class string.

Updated `app/ru/guides/[slug]/page.tsx` to wrap guide.price, guide.timeline, guide.lastUpdated, step.cost, and step.timeEst via `localizeValue("ru")` before passing to RouteSnapshot and StepCard. EN guide page not touched.

Verified via built HTML: "2–4 недели", "2–3 дня", "Апрель 2025/2026", "Бесплатно", "По необходимости", "Без сборов", "Без сборов на этом этапе", "Зависит от сектора", "Включено в шаг 6/7", "Включено в стоимость пакета", "Оплата в тот же день" all present on correct RU pages. AED amounts and C-class values unchanged.

Production smoke test: all 4 RU guides confirmed. Build: 63 pages, 0 errors. Commit: 665744e. CP-23 added.

Remaining English on RU pages: C-class values (AED + English context strings) — deferred to schema redesign. D-class EN em-dashes ("Varies — 4–10+ weeks", "Varies — bank account may take 2–6 weeks") — separate EN content fix.

---

## 2026-04-30 — Step 2: UI label localization for RU guide pages

Added `locale?: "en" | "ru"` prop (default "en") to:
- `components/RouteSnapshot.tsx` — 6 label pairs in LABELS dict
- `components/StepCard.tsx` — 6 label pairs in LABELS dict
- `components/GuideHeader.tsx` — category map (5 category slugs → Russian)

Updated `app/ru/guides/[slug]/page.tsx` to pass `locale="ru"` to GuideHeader, RouteSnapshot, and every StepCard.

EN guide page (`app/(public)/guides/[slug]/page.tsx`) not touched — defaults work.

Build: 63 pages, 0 TypeScript errors. No DB changes. No schema changes.

Production smoke test: all 4 RU guide pages return HTTP 200 with all 8 Russian label types confirmed. EN employment-visa page retains English labels.

Still not fixed (Category B): step cost/time values ("No fee", "1 day"), guide price/timeline values — English DB values, separate step.

CP-22 added.

---

## 2026-04-30 — Step 1A: RU content em-dash hygiene pass (all 4 guides)

Removed all content em-dashes from the 4 completed RU guides.

**Before:**
- employment-visa: guide-level pos 180, steps 2/3/4/7/8 affected
- golden-visa-dubai-property: guide-level pos 133, steps 1/3/7 affected
- mainland-company-setup-dubai: guide-level pos 660, steps 1/3/4/5/6 affected
- free-zone-company-setup-dubai: guide-level clean (prev patched locally), steps clean locally; production had em-dashes

**After:** guide=OK steps=OK for all 4 on both local and production DB.

**Files changed:**
- `scripts/add-ru-employment-visa.ts` — 9 content em-dashes removed
- `scripts/add-ru-golden-visa-property.ts` — 6 content em-dashes removed
- `scripts/add-ru-mainland-company.ts` — 11 content em-dashes removed
- `scripts/add-ru-free-zone-company-setup.ts` — 7 content em-dashes removed
- `scripts/patch-ru-em-dashes-completed-guides.ts` — NEW targeted patch script with assertNoEmDash guards

**Replacements used:** comma, colon, parentheses, sentence split. No meaning removed.

**Production backup:** `/var/backups/guidex/guides.db.pre-ru-em-dash-cleanup-YYYYMMDD-HHMMSS`
**Build:** 63 pages, 0 errors. PM2 restarted, online.

Remaining em-dashes in HTML: `<title>` separator (intentional) + EN `time_est` values (Category B, not in scope).

CP-21 added.

---

## 2026-04-30 — RU guide quality audit (no code/DB changes)

Produced comprehensive audit of all 4 live RU guide pages. Output: `docs/ru-guide-quality-audit.md`.

**Key findings:**

- **Category A (code fix):** 12 UI labels hardcoded in English across `RouteSnapshot.tsx` (6 labels) and `StepCard.tsx` (6 labels). Category pill in `GuideHeader.tsx` also has no locale mapping. Fix: add `locale` prop, translate labels, pass from `app/ru/guides/[slug]/page.tsx`.

- **Category B (schema/content fix):** 6 DB fields have no `ru_*` equivalents — `price`, `timeline`, `lastUpdated`, `category` (guide level) and `cost`, `timeEst` (step level). Values show in English on all RU pages. Recommended fix: display-level mapping for category; rewrite EN-only duration words in content.

- **Category C (CRITICAL — em-dashes):** `free-zone-company-setup-dubai` has em-dashes in production DB (Step 1 ru_advice, Step 2 ru_what, ru_overview). Script file `scripts/add-ru-free-zone-company-setup.ts` was never updated after local DB patch — source still contains em-dashes. Both script file AND production DB must be fixed.

- SEO quality: employment-visa 4/5, golden-visa 3.5/5, mainland-company-setup 3.5/5, free-zone 3/5 (em-dash penalty).

**No code, no DB, no deploy in this step.**

Next: Step 1 — fix em-dashes in free-zone script file + production DB patch.

---

## 2026-04-30 — RU content: free-zone-company-setup-dubai

Populated all RU fields for the free zone company setup guide. 8/8 steps.

**Script:** `scripts/add-ru-free-zone-company-setup.ts`

**Guide-level fields set:**
- `ru_title`: Открыть компанию в free zone в Дубае: лицензия, визы и банковский счёт
- `ru_summary`: 4-sentence meta with zone selection warning, cost range (AED 6k–20k+)
- `ru_audience`: Non-residents, online business, consulting, international trade, holding
- `ru_overview`: 2 paragraphs. Para 1: free zone overview + zone selection risk. Para 2: timeline + post-license steps (establishment card, bank, visas, VAT, CT)

**Steps populated:**
1. Выбор free zone
2. Выбор типа лицензии и вида деятельности
3. Выбор пакета и визовой квоты
4. Резервирование названия компании
5. Подача заявки и документов
6. Оплата сборов за регистрацию
7. Получение лицензии и учредительных документов
8. Первые шаги после получения лицензии

**Em-dash fix:** Initial version had 6 em-dashes across steps 1/2/3/5/8 and overview. Fixed via targeted DB patch before commit. Final count: 0.

**Verified:**
- /ru/guides/free-zone-company-setup-dubai: 200, Russian H1, all 8 step H3 titles in Russian, 0 em-dashes
- /guides/free-zone-company-setup-dubai: EN unchanged, hreflang now includes ru
- Sitemap: /ru/guides/free-zone-company-setup-dubai entry present
- /ru/company-setup: all 3 guide links intact (mainland, free-zone, bank-account)
- Build: 63 pages, 0 TypeScript errors

CP-20 added.

---

## 2026-04-30 — Visual/UX smoke test after commit 1948214

All 8 routes 200. No code changes. Findings recorded below.

Passed: EN homepage 5 cards render correctly; soon cards are non-clickable divs with no href; "Browse all guides →" present; RouteSnapshotBand renders (12 AED mentions); PrimaryServices not in HTML; RU homepage has Скоро badges, Government card, /ru/government link, "Все гайды →" bottom link; /ru/government: Russian H1 and copy, all 3 guide links to /ru/guides/..., hreflang canonical /ru/government + en-alternate /government, language switcher points to /government; Business Bank Account inside both /company-setup and /ru/company-setup; soon cards have no href on either locale; no EN /guides/ bleed on RU pages.

One structural difference confirmed as intentional: EN homepage has 5 sections (Hero + Cards + RouteSnapshotBand + HowItWorks + FreeAdviceCta); RU has 3 (Hero + Cards + WhatsApp CTA). Not a bug.

Density note: RouteSnapshotBand adds 4 more guide cards after the 5 category cards on EN only. Page total is shorter than old PrimaryServices (which had 12 item rows). Recommend keeping band for now; flag for removal if EN/RU parity becomes a priority.

---

## 2026-04-29 — Homepage IA restructure: route-hub cards on EN and RU

Replaced EN homepage `PrimaryServices` list with 5 category cards matching RU's route-hub structure.

**Files changed:**
- `app/(public)/page.tsx` — removed `PrimaryServices`; added 5 inline `ServiceCard` entries (3 active, 2 soon); kept `RouteSnapshotBand`, `HowItWorks`, `FreeAdviceCta`, "Browse all guides →"
- `app/ru/page.tsx` — removed "Все гайды" primary card; added Государственные услуги card; added 2 soon cards (Туризм и аренда, Банкинг и консультации); added "Все гайды →" bottom text link
- `app/ru/government/page.tsx` — new file; mirrors EN government hub structure; Russian copy; 3 guide cards; WhatsApp CTA; hreflang: `ru` canonical `/ru/government`, `en` alternate `/government`

**Not changed:**
- `components/PrimaryServices.tsx` — retained (not imported anywhere after this change)
- All guide article pages — untouched
- All hub pages (`/visas`, `/company-setup`, `/government`, `/ru/visas`, `/ru/company-setup`) — untouched
- DB, sitemap logic, brand — untouched

**Verified:**
- `PrimaryServices` not imported anywhere in `app/` or `components/`
- Build: 63 pages, 0 errors (new page: `/ru/government`)
- TypeScript: clean

CP-19 added.

---

## 2026-04-29 — Fix: locale-aware navigation for RU pages

Full audit of all public components generating guide/service links.

**Bugs found and fixed:**
- `Footer.tsx` — `/contact` → `/ru/contact` on RU pages; English labels → Russian ("О нас", "Контакты")
- `StickyRouteCta.tsx` — English "Find My Route" / "Answer 2–3 quick questions" → Russian on RU pages

**New helper:** `lib/locale-path.ts`
- `getGuidePath(slug, locale)` — `/guides/slug` or `/ru/guides/slug`
- `getLocalePath(path, locale)` — prefixes `/ru` when locale=ru
- `getLocaleFromPathname(pathname)` — detects locale from URL

**Audit findings — already correct (no changes):**
- `TopicCard.tsx` — already locale-aware (locale prop, /ru/guides/ prefix)
- `GuideTabs.tsx` — guidesHref already locale-aware; /find-my-visa stays EN (no RU equiv)
- `Header.tsx` — already locale-aware (language switcher, RU_NAV/EN_NAV)
- All RU-specific page-level links correct (hardcoded /ru/ in ru/ directory pages)

**Audit findings — EN-only, not on RU pages (no fix needed):**
- `PrimaryServices.tsx` — EN homepage only
- `RouteSnapshotBand.tsx` — EN homepage only
- `BrowseByService.tsx` — unused
- `QuickDecisionCards.tsx` — unused
- `RouteFinderFlow.tsx` — on /find-my-visa (EN-only page, no /ru/find-my-visa)

**Verified:**
- 6 RU pages: /ru/contact in footer, "Найти маршрут" in sticky CTA, no English sticky text
- 4 EN pages: unaffected (/contact link, English sticky CTA)
- Language switcher EN links on RU pages confirmed correct (Header alternatePath() behavior)
- Build: 62 pages, 0 errors

CP-18 added.

---

## 2026-04-29 — Russian content: mainland-company-setup-dubai guide fully populated

Created `scripts/add-ru-mainland-company.ts` — populates all ru_* fields for mainland-company-setup-dubai.

- ru_title: "Открыть mainland компанию в Дубае: лицензия DED и полный процесс"
- ru_summary: 3 sentences — route, AED 12 000–25 000+ slab, Ejari/trade license
- ru_audience: DED-licensed company founders, excludes regulated sectors
- ru_overview: 2 paragraphs — what mainland means + 3-phase process + post-license steps (establishment card, MOHRE, VAT, bank account)
- All 8 step ru_* fields populated; keywords woven in: DED, trade name reservation, initial approval, Ejari, MoA, local service agent, establishment card, immigration file, MOHRE, VAT, corporate tax, trade license

Verified:
- `/ru/guides/mainland-company-setup-dubai` 200, Russian H1, all 8 step titles in Russian, meta in Russian
- `/guides/mainland-company-setup-dubai` emits `ru` hreflang
- Sitemap: both EN and RU entries present
- Build: 62 pages, 0 errors

CP-17 added.

---

## 2026-04-29 — Russian content: golden-visa-dubai-property guide fully populated

Created `scripts/add-ru-golden-visa-property.ts` — populates all ru_* fields for golden-visa-dubai-property.

- ru_title: "Золотая виза в Дубае через недвижимость от AED 2 000 000"
- ru_summary: 3 sentences, covers route, AED 2M threshold, DLD/GDRFA, AED 9 885 slab
- ru_audience: freehold owners at AED 2M+ threshold, no employer required
- ru_overview: 2 paragraphs — eligibility + cost/timeline
- All 7 step ru_* fields populated (title, what, where, address, advice, warning)
- Keywords woven in: золотая виза в Дубае через недвижимость, DLD, GDRFA, title deed, Oqood, mortgage NOC, property valuation certificate, Emirates ID, freehold, AED 2 000 000

Verified:
- `/ru/guides/golden-visa-dubai-property` 200, Russian H1, all 7 step titles in Russian, meta in Russian
- `/guides/golden-visa-dubai-property` now emits `ru` hreflang
- Sitemap: both EN and RU entries present
- Build: 62 pages, 0 errors

CP-16 added.

---

## 2026-04-29 — Russian content: employment-visa guide fully populated

Created `scripts/add-ru-employment-visa.ts` — populates all ru_* fields for employment-visa.

- ru_title: "Рабочая виза в Дубае: оформление через компанию без выезда из ОАЭ"
- ru_summary: 2 sentences, includes price range (AED 4 900–7 300), service centers
- ru_audience: exact reader description in Russian
- ru_overview: 2 paragraphs — route explanation + cost/timeline/reader role
- All 8 step ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning fields populated
- Russian style: short sentences, no em dashes, official terms (MOHRE, Tasheel, Amer, GDRFA, Tawjeeh, entry permit, change status, Emirates ID) used naturally
- Target keywords woven in: рабочая виза в Дубае, рабочая резидентская виза, стоимость, сроки

Verified:
- `/ru/guides/employment-visa` 200, H1 in Russian, all 8 step titles in Russian, meta description in Russian
- `/guides/employment-visa` now emits `ru` hreflang (hasRuContent=true triggered correctly)
- Sitemap: `https://guidex-consulting.ae/ru/guides/employment-visa` present
- Build: 62 pages, 0 errors

CP-15 added.

---

## 2026-04-29 — Phase 1B Russian routing: full verification pass

Discovered Phase 1B was already fully implemented in commit 5149a84. Ran complete spec verification:

- All 7 routes return 200: `/`, `/guides`, `/guides/employment-visa`, `/ru/guides/employment-visa`, `/guides/golden-visa-dubai-property`, `/ru/guides/golden-visa-dubai-property`, `/admin/login`
- EN guide hreflang: `en` + `x-default` only (no `ru` — correct, all ru_title empty so hasRuContent=false)
- RU guide hreflang: `en` + `ru` + `x-default` + canonical `/ru/guides/[slug]`
- Language switcher: EN→RU and RU→EN links both correct via alternatePath()
- RU nav: Визы / Компании / Гайды (no Find My Route — correct per spec)
- EN fallback: RU pages render EN h1 for empty ru_title (correct)
- Sitemap: 32 entries — EN static (12) + EN guides (11, minus 4 redirect slugs) + RU static (9) + RU guides (0, filtered by ru_title)
- No admin/writer imports in public bundle
- CP-14 added to CHECKPOINTS.md
- NEW_CHAT_TRANSFER.txt rewritten: UpCloud server details, correct git hash (3927e4c), Phase 1B verified status

---

## 2026-04-29 — Post-migration cleanup: UpCloud docs and scripts

- Created `docs/deployment-upcloud.md` — authoritative runbook with IP filled in (85.9.203.69), all OVH placeholders removed
- Removed `docs/deployment-ovh.md` (superseded)
- Created `scripts/db-backup-from-upcloud.sh` — clean backup script, IP hardcoded
- Created `scripts/db-restore-to-upcloud.sh` — clean restore script, IP hardcoded
- `scripts/db-backup-from-ovh.sh` and `db-restore-to-ovh.sh` — updated to deprecated with backwards-compat default of UpCloud IP
- `PROJECT_STATE.md` — updated deployment target, deployment notes, removed all OVH/Cloudways stale references

---

## 2026-04-29 — UpCloud migration: HTTPS live, DNS switched, all smoke tests pass

Full migration from Cloudways (165.245.187.15) to UpCloud (85.9.203.69) complete.

Steps completed:
- 2 GB swap created (fallocate, permanent via /etc/fstab)
- Repo cloned from GitHub at c127e9b, data/ dir created
- .env.local uploaded (scp), chmod 600, all 5 keys verified present without printing values
- DB uploaded (guides.db.20260429-140304): integrity ok, 15 guides, 94 steps
- npm ci + npm run build: 62 pages, 0 errors
- PM2 started via ecosystem.config.js (guidex-production), pm2 save, pm2-root.service enabled
- Port 3000 → 200 confirmed from server
- Nginx config deployed, nginx -t passes, nginx reload
- Pre-DNS smoke tests: 8/8 routes 200 by IP + Host header
- DNS: @ + www → 85.9.203.69 updated at Tasjeel
- Certbot SSL issued: guidex-consulting.ae + www, valid to 2026-07-28, certbot.timer active
- Post-DNS smoke tests: 9/9 HTTPS routes 200, HTTP→HTTPS 301 confirmed

Cloudways still live — do NOT cancel until cron backup (Phase 8) is done.

Phase 8: cron backup installed (0 3 * * *), first backup verified (guides.db.20260429-140750, 124K, SQLite ok).
All 8 phases complete. Cloudways safe to cancel.

---

## 2026-04-29 — OVH migration: DB verified, migration prep committed

DB backup `guides.db.20260429-140304` pulled from Cloudways and verified:
- `PRAGMA integrity_check;` → ok
- 15 guides, 94 steps, all published=1
- All key slugs present

This is the source DB for the OVH migration. Cloudways remains live (do not cancel until OVH is live and DNS has switched). Waiting on: OVH server IP + SSH root access.

All OVH migration assets committed in `5149a84`:
- `ecosystem.config.js`, `deploy/nginx/guidex-consulting.ae`, `deploy/scripts/server-cron-backup.sh`
- `scripts/ovh-server-setup.sh`, `scripts/db-backup-from-ovh.sh`, `scripts/db-restore-to-ovh.sh`
- `docs/deployment-ovh.md` — full 9-phase runbook

**Next:** Provide OVH IP → Phase 1 server setup → Phase 2 clone/env → Phase 3 DB upload → Phase 4 PM2 → Phase 5 Nginx → Phase 6 smoke tests → Phase 7 DNS+SSL

---

## 2026-04-28 — Phase 1B: Russian public routing infrastructure

**Build result:** 62 pages, 0 TypeScript errors, 0 build errors. Up from 38 pages (EN only).

**New RU routes (all static or SSG):**
- `/ru` — Russian homepage
- `/ru/guides` — all published guides, localized (EN fallback where ru_* empty)
- `/ru/guides/[slug]` — 15 static pages, EN fallback content until translated
- `/ru/guides/spouse-dependent-visa-dubai` — tab group page (locale-aware)
- `/ru/guides/child-dependent-visa-dubai` — tab group page (locale-aware)
- `/ru/visas` — Russian visa hub
- `/ru/visas/family` — Russian family visa hub
- `/ru/visas/golden` — Russian golden visa hub
- `/ru/company-setup` — Russian company setup hub
- `/ru/contact` — Russian contact page

**Infrastructure changes:**
- `lib/db/reader.ts` — added `Locale` type, field-level `pick()` helper, locale params (default 'en') to all public query functions, `hasRuContent: boolean` on GuideData, `getRuPublishedGuidesSlugs()` for sitemap
- `components/Header.tsx` — locale detection from `usePathname`, RU nav items, EN/RU language switcher pill (desktop + mobile), locale-aware logo link and active state
- `components/GuideTabs.tsx` — added `locale?: Locale` prop, `STRINGS` map for translated UI labels, locale-aware breadcrumb links
- `components/TopicCard.tsx` — added `locale?: 'en'|'ru'` prop, href prefix switches to `/ru/guides/` when locale is 'ru'
- `app/sitemap.ts` — added RU static pages + RU guide entries (filtered to slugs where ru_title non-empty)
- `app/(public)/guides/[slug]/page.tsx` — added hreflang alternates to generateMetadata (ru only added when guide.hasRuContent is true)
- `app/(public)/page.tsx` — added metadata with hreflang alternates (EN/RU/x-default)
- `app/ru/layout.tsx` — new RU layout wrapping same Header/Footer/StickyRouteCta as EN

**Fallback behavior:** All RU routes use field-level EN fallback. If `ru_title` is empty, the EN title renders. Same per field. No blank pages possible.

**Sitemap:** RU guide entries only appear for slugs where `ru_title` non-empty. Currently 0 (no translations yet). Will grow automatically as admin fills ru_* fields.

**Not yet committed — pending owner QA review.**

---

## 2026-04-28 — Strategic planning docs created (RU/EN SEO strategy + platform roadmap)

**Five planning documents created:**

1. `docs/platform-roadmap.md` — 8-phase forward roadmap with Russian as Phase 1 (business decision). Locked URL design: EN = `/guides/[slug]`, RU = `/ru/guides/[slug]`, no `/en/` prefix ever. Phase 1 implementation plan with routing, language switcher, hreflang/canonical, and first 12 pages to translate.

2. `docs/seo-keyword-map-ru-en.md` — Keyword map for 5 clusters: A=Visa, B=Company setup, C=Bank account, D=Government, E=Relocation. Each keyword has language, priority label, page type, and target URL. Both EN and RU Cyrillic keywords. No invented search volumes.

3. `docs/content-style-guide-ru-en.md` — Writing rules for all content fields. Em dash ban, short sentences, costs/timelines first, theatrical framing ban, AI verbosity ban. Bad/good examples in both English and Russian. RU-specific rules: do not translate English, use terms Russian professionals use, fees formatted "AED 2 500", lowercase "вы".

4. `docs/ru-launch-plan.md` — Page-by-page plan for the 12 minimum RU launch pages. Each entry: RU URL, primary keyword, secondary keywords, title direction, meta description direction, content notes. Go/no-go criteria checklist included.

5. `docs/content-audit-ai-tone.md` — Audit of all 15 published EN guides. Em dashes found in 11/15 guides. Priority fix queue: bank account (worst), mainland company, free zone, child visa summary, employment outside-UAE, then minor instances. One audience self-reference in mainland guide. No theatrical framing or AI verbosity remaining (prior pass cleaned those).

**Memory files updated:** ROADMAP.md (forward phases added), PROJECT_STATE.md (next step updated to Phase 1 RU routing).

---

## 2026-04-28 — Cloudways server recovery (new IP, new SSH user)

**Problem:** Cloudways suspended/deleted the original server (157.245.207.99). Site went down.
**Resolution:** Cloudways recovered the application onto a new server.

**New server facts:**
- IP: 165.245.187.15 (was: 157.245.207.99)
- SSH user: master_asumzwhebx (was: master_udndspcyhr)
- Server name: Recovered-guidex-main-server
- App path: /home/master/applications/dgcmdxxpjx/public_html (unchanged)

**Recovery steps:**
- Confirmed app files, .env.local, data/guides.db, and .next build survived restore
- Cloudways Support re-enabled proxy_module, proxy_http_module, proxy_fcgi_module
- DNS A record updated in Tasjeel: guidex-consulting.ae → 165.245.187.15
- HTTP → HTTPS redirect confirmed working (301)
- Site smoke-tested: all HTTPS routes 200

**Files updated:** All scripts, docs/deployment-cloudways.md, PROJECT_STATE.md,
CHECKPOINTS.md, NEW_CHAT_TRANSFER.txt — old IP/SSH user replaced throughout.

---

## 2026-04-27 — Real domain launch + final smoke test (Phase 12)

**guidex-consulting.ae is LIVE.**

**Steps completed:**
- DNS A record set in Tasjeel: guidex-consulting.ae → 157.245.207.99; www CNAME → apex
- Cloudways primary domain: guidex-consulting.ae; additional: www.guidex-consulting.ae
- Server .env.local updated: NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → https://guidex-consulting.ae (Python-safe update, backup created first)
- `npm run build` on server — rebuild required for NEXT_PUBLIC_SITE_URL bake-in
- PM2 restarted with --update-env
- SSL Let's Encrypt installed for guidex-consulting.ae + www.guidex-consulting.ae
- Production DB backed up locally: backups/production-db/guides.db.20260427-223918

**Final smoke test (all HTTPS — 200):**
- https://guidex-consulting.ae/ ✅
- https://guidex-consulting.ae/guides ✅
- https://guidex-consulting.ae/guides/employment-visa ✅
- https://guidex-consulting.ae/guides/golden-visa-dubai-property ✅
- https://guidex-consulting.ae/contact ✅
- https://guidex-consulting.ae/admin/login ✅
- https://guidex-consulting.ae/robots.txt ✅
- https://guidex-consulting.ae/sitemap.xml ✅
- https://www.guidex-consulting.ae/ ✅

**Homepage confirmed:** Next.js Guidex (title: "Guidex Consulting — Step-by-step guides for living and working in Dubai")

**Remaining item:** HTTP → HTTPS redirect not yet enabled (Cloudways panel toggle). HTTP returns 200 instead of 301.

---

## 2026-04-27 — Admin auth debug + fix (production)

**Problem:** Admin login returned "Invalid email or password" despite bcrypt compare being true.
**Root cause:** `reset-admin-credentials.sh` wrote the bcrypt hash with bare `$` signs to `.env.local`. The debug script read the file directly (bypassing dotenv-expand) so bcrypt compared true. But Next.js loads `.env.local` through `dotenv-expand`, which treats `$<letters>` as env var references and expands them to empty string — corrupting the hash.
**Fix:** `runtime-env-diag.sh` — used `@next/env loadEnvConfig` to confirm corruption, re-escaped every `$` as `\$` in .env.local, PM2 restarted, NextAuth callback returned success.

**Rule confirmed:** bcrypt hashes in .env.local MUST escape `$` as `\$`. This is now documented in CLAUDE.md.

---

## 2026-04-27 — Backup/sync workflow + deployment docs (Phase 11 completion)

**Files created/updated:**
- `scripts/db-backup-from-server.sh` — pulls production DB to `backups/production-db/` with timestamp + latest symlink
- `scripts/db-restore-to-server.sh` — restores local backup to server; requires typed `YES`; creates server-side timestamped backup first; restarts PM2
- `backups/production-db/.gitkeep` — directory tracked in git; actual `.db*` files excluded
- `.gitignore` — added `data/guides.db.backup-*` and `backups/production-db/*.db*`
- `docs/deployment-cloudways.md` — full rewrite: accurate server paths, source-of-truth rules, PM2 commands, domain-switch procedure, troubleshooting
- `CLAUDE.md` — added "Deployment and Source-of-Truth Rules (locked)" section

**Rules established:**
- Cloudways is runtime only — not source of truth
- Code → GitHub; production DB → local backups; secrets → out-of-band
- Never overwrite production DB without server-side backup (enforced by restore script)
- NEXT_PUBLIC_* domain change requires rebuild — documented in deploy doc

---

## 2026-04-27 — Production deployment to Cloudways (Phase 11)

**Server:** Cloudways DigitalOcean VPS — 157.245.207.99 — app ID dgcmdxxpjx
**Temporary URL:** https://phpstack-1618074-6379172.cloudwaysapps.com/

**Steps completed:**
- nvm v0.40.1 installed under master user; Node v20.20.2 (LTS) + PM2 v6.0.14 installed
- rsync: 150 files uploaded to `/home/master/applications/dgcmdxxpjx/public_html/`
- `data/guides.db` uploaded (124K), permissions 664
- `.env.local` created on server with 5 production vars (NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → temporary Cloudways URL), permissions 600
- `npm ci`: 428 packages, 0 errors
- `npm run build`: 38/38 pages, 0 TypeScript errors, 0 build errors
- PM2 started via `~/start-guidex.sh` (sources nvm, cd to app, PORT=3000); 0 restarts, 0 errors
- `pm2 save` completed
- `.htaccess` written: `RewriteRule ^(.*)?$ http://127.0.0.1:3000/$1 [P,L]`
- Cloudways Support enabled `mod_proxy_http` — Apache reverse proxy now live
- Cloudways placeholder `index.php` renamed to `index.php.placeholder` (backup: `index.php.bak`)
- Cloudways Nginx cache purged from control panel

**Smoke test result (all 200):**
- / → Guidex Next.js homepage (html lang="en", inter font, logo-header.png) ✅
- /guides ✅ | /guides/employment-visa ✅ | /guides/golden-visa-dubai-property ✅
- /contact ✅ | /admin/login ✅ | /robots.txt ✅ | /sitemap.xml ✅

**Response headers confirm Next.js:** `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`

---

## 2026-04-26 — Guidex Consulting brand integration (Phase 10)

**Assets:** Resized from `/Users/batyr/Desktop/GUIDEX/logos/` → `public/brand/` (logo-header.png 480×120, logo-header-dark.png 480×120, logo-mobile-compact.png 330×110, android-chrome-192×192, android-chrome-512×512). Used Pillow for RGBA-preserving favicon resize (sips strips alpha). Created multi-size ICO (16/32/48px) using Python struct writer.

**Files changed:**
- `components/Header.tsx` — replaced "Dubai Guide" text with `<Image src="/brand/logo-header.png" width={120} height={30} priority />`
- `components/Footer.tsx` — © Guidex Consulting
- `app/layout.tsx` — title → "Guidex Consulting — …"
- `app/(public)/find-my-visa/page.tsx` — metadata title + eyebrow label
- `app/admin/layout.tsx` — admin brand label
- 9 other page files — all `— Dubai Guide` metadata suffixes → `— Guidex Consulting`
- `app/(public)/about/page.tsx` — description updated
- `app/favicon.ico` — replaced with Guidex icon (3-size ICO: 16/32/48px, RGBA)
- `app/icon.png` — Guidex transparent icon 192×192 (Next.js metadata icon)
- `app/apple-icon.png` — Guidex favicon-master 180×180

**Build:** 38 pages, 0 errors. "Dubai Guide" text: 0 remaining occurrences. Added `app/manifest.ts` → `/manifest.webmanifest` (android-chrome icons wired). All logos re-saved as RGB (no unused alpha) for 5–9% additional size reduction. Missing assets added: `logo-wordmark.png` (57KB, 480×160), `icon-g-transparent.png` (62KB, 256×256).

---

## 2026-04-25 — Full launch-prep audit + guide list / calculator / visas hub fixes

**Bugs found and fixed:**

1. **guides/page.tsx — redirect slug duplication (HIGH):** All 15 DB guides were shown in the list including the 4 individual spouse/child slugs that redirect to group pages. Users saw 4 duplicate family visa cards with redirect links. Fix: filter out REDIRECT_SLUGS, inject 2 synthetic group-page entries (spouse + child group), sort within each category alphabetically by slug.

2. **RouteFinderFlow.tsx — calculator linked to redirect slugs (MEDIUM):** "View Step-by-Step Guide →" button for family visa results linked to `/guides/spouse-dependent-visa-dubai-outside-country` etc., causing an extra redirect hop. Fix: import GROUP_HREFS from lib/guide-groups, resolve canonical group URLs before falling back to /guides/${slug}.

3. **visas/page.tsx — outside-UAE employment visa missing (MEDIUM):** The /visas hub only showed the inside-UAE employment visa guide. Users outside the UAE had no entry point to the outside-UAE guide from this hub. Fix: split into two separate cards — "Employment Visa — Inside UAE" and "Employment Visa — From Abroad".

4. **lib/guide-groups.ts — added GROUP_HREFS and REDIRECT_SLUGS exports:** Centralised data for the above fixes. GROUP_HREFS maps variant slugs to canonical group page URLs. REDIRECT_SLUGS is the Set used for filtering in the guide list.

**Build:** Clean — 35 pages, 0 TypeScript errors.

**Other audit findings (not fixed — owner action or future):**
- data/guides.db still tracked in git (needs `git rm --cached data/guides.db`)
- Contact page social handles (instagram.com/dubaiguide, facebook.com/dubaiguide) need owner verification
- ROADMAP.md severely stale (still shows Phase 7 as "Sitemap — future")
- BrowseByService.tsx and QuickDecisionCards.tsx are unused leftover components (safe to delete or keep)
- No analytics yet (non-blocking for soft launch)

---

## 2026-04-25 — Phase 6 launch-readiness audit and implementation

**Technical SEO:**
- `app/sitemap.ts` — dynamic sitemap (12 static pages + 11 guide pages; 4 redirect slugs excluded)
- `app/robots.ts` — allows `/`, blocks `/admin/` and `/api/auth/`, links to sitemap
- `app/layout.tsx` — `metadataBase` added (fixes canonical + og:url)
- `next.config.ts` — 4 group-guide redirects changed from `permanent: false` → `permanent: true`

**Deployment readiness:**
- `.env.example` — documents 5 required env vars including `NEXT_PUBLIC_SITE_URL`
- `docs/deployment-cloudways.md` — full VPS deploy guide (git/rsync, npm install, build, PM2, nginx, DB backup, re-deploy workflow)
- `.gitignore` — `data/guides.db` added (was missing; only WAL sidecars were excluded)
- Manual action still required: `git rm --cached data/guides.db` (pending user approval)

**Cleanup:**
- `public/` — 5 Next.js boilerplate SVGs removed (file, globe, next, vercel, window)

**Build result:** Clean — 35 pages, 0 TypeScript errors. sitemap.xml and robots.txt both static ○.

**Verdict:** Ready for soft launch. Blocking items: `git rm --cached data/guides.db` + domain/DNS.

---

## 2026-04-25 — Phase 5 guide content compression

Script: `scripts/phase5-content-cleanup.ts` — 34 DB writes (9 guide rows, 25 step rows) across 14 of 15 guides. golden-visa-dubai-property was already clean.

**Price/Timeline fields shortened (were multi-sentence paragraphs):**
- amer-center-dubai, document-attestation-dubai, open-business-bank-account-dubai, pro-services-dubai, renew-family-visa-dubai

**Summaries compressed (removed "A step-by-step guide to..." / "A practical guide to..." openers):**
- amer-center-dubai, child x2, document-attestation-dubai, employment-visa-dubai-outside-uae, free-zone-company-setup-dubai, mainland-company-setup-dubai, newborn-visa-dubai, open-business-bank-account-dubai, pro-services-dubai, renew-family-visa-dubai

**Audiences tightened:**
- amer-center-dubai, free-zone-company-setup-dubai, mainland-company-setup-dubai, newborn-visa-dubai, open-business-bank-account-dubai, renew-family-visa-dubai

**Overviews rewritten (removed "This route is for..." / "To sponsor...from outside" openers):**
- child x2, spouse x2, employment-visa-dubai-outside-uae

**Step-level changes:**
- employment-visa-dubai-outside-uae: all 7 step titles standardized to title case; EIDA → ICA; Step 4 warning trimmed
- employment-visa (inside): Step 2 advice — informal "It's" fixed, reworded; Step 5 advice — "Arrive early — clinics are busy" removed
- mainland-company-setup-dubai: Step 1 warning trimmed; Step 4 what — definition of initial approval tightened
- newborn-visa-dubai: Step 3 advice — long question form rewritten; Step 5 advice — "confirm with branch" removed
- spouse-dependent-visa-dubai-inside-country: Step 3 advice — conditional → imperative; Step 4 advice — non-advice removed
- spouse-dependent-visa-dubai-outside-country: Step 7 warning — useless "make sure all previous steps..." removed
- document-attestation-dubai: Step 2 what — "this is the step that makes it legally recognized" filler removed
- amer-center-dubai: Step 1 address — shortened; Step 3 advice — "confirm the total before paying" removed
- pro-services-dubai: Step 1 what — trimmed to remove duplicate of overview
- free-zone-company-setup-dubai: Step 6 warning — "submitted and processed" → "submitted"

## 2026-04-24 — Phase 4 copy compression + premium visibility pass

**Copy compressed:**
- `Hero.tsx`: subtitle "Official steps and real government fees — no guesswork" → "Official fees and exact steps — no guesswork"; text-gray-500 → text-gray-600
- `HowItWorks.tsx`: item 2 description — removed "No jargon, no vague overviews." opener (echoed the label)
- `FreeAdviceCta.tsx`: heading "Need help with your specific situation?" → "Not sure which route applies?"; body removed echo of "no jargon/no sales pitch" — now action-oriented
- `about/page.tsx`: 3 paragraphs tightened — removed "This site is a practical reference" framing; last para condensed to 2 sentences
- `visas/family/page.tsx`: card descriptions shortened — removed sub-item lists (GDRFA, Amer, medicals, Emirates ID enumerated twice); hub summary de-duplicated "both inside-UAE and outside-UAE"
- `government/page.tsx`: hub description "the government-facing layer behind most visa and business procedures" → "The three services that underpin most visa and company filings"
- `company-setup/page.tsx`: 3 route card descriptions compressed; processSteps intro paragraph removed; compare note "If your customers are UAE businesses..." → "UAE customers → mainland. International, digital, or remote → free zone."
- `GuideTabs.tsx` + `guides/[slug]/page.tsx`: footer CTA body "We handle the paperwork and government submissions for you" → "We manage government submissions, medicals, and filings on your behalf"
- `RouteFinderFlow.tsx`: "Talk to an expert on WhatsApp →" → "Ask an expert on WhatsApp →"; advisor CTA "Contact Us on WhatsApp →" → "Message Us on WhatsApp →"

**Visibility improved:**
- All hub card descriptions: text-gray-500 → text-gray-600 (visas, family, government)
- Company hub card descriptions: text-sm text-gray-500 leading-relaxed → text-[13px] text-gray-600 leading-snug
- Company hub compare row labels: text-gray-500 → text-gray-600
- Company hub process step text: text-gray-700 → text-gray-800
- Company hub footnotes: text-xs text-gray-400 → text-[12px] text-gray-500

**Golden hub polished:**
- `visas/golden/page.tsx`: hub description "5 or 10-year" → "10-year" (more decisive); section label "Other Routes — Ask Us Directly" → "Ask about these routes"; WhatsApp badge style: gray pill → navy/70 with white text (more visible, clearly actionable)

## 2026-04-23 — Phase 3 UX redesign complete

**Employment visa outside UAE — published and wired:**
- `scripts/publish-employment-visa-outside.ts` ran: `employment-visa-dubai-outside-uae` set to published=1
- `lib/route-finder-config.ts`: `r-employment-outside` changed from advisor to guide resolution with `guideSlug: "employment-visa-dubai-outside-uae"`
- `"employment-visa-dubai-outside-uae"` added to `CALCULATOR_GUIDE_SLUGS`

**Golden visa hub — rebuilt as 4-route hub:**
- `app/(public)/visas/golden/page.tsx`: 1-guide thin page → proper 4-route hub
- Property route: live guide link
- Professional, Business Investor, Special Talent: WhatsApp CTA cards with pre-filled message
- Footer: "Not sure which route?" WhatsApp advisor CTA

**Mobile visibility pass:**
- `components/RouteSnapshotBand.tsx`: audience text `text-gray-500` → `text-gray-600`
- `components/HowItWorks.tsx`: description text `text-gray-500` → `text-gray-600`
- `components/TopicCard.tsx`: summary text `text-gray-500` → `text-gray-600`

**Maid Visa — dead-end removed:**
- `components/PrimaryServices.tsx`: "Soon" div → WhatsApp link with pre-filled "maid visa" context
- Added `external?: boolean` to `ServiceItem` type; external items render as `<a target="_blank">`

**Tap target fix:**
- `components/PrimaryServices.tsx`: "All →" links `py-1` → `py-2.5 pl-4`

## 2026-04-23 — Full-site QA sweep pass 2 (11 issues, all fixed)

**Clickability fixes:**

`components/GuideTabs.tsx`:
- Replaced lone "← All guides" (18px tap target) with breadcrumb+calculator row matching guide detail pages
- Both links get `px-1 py-3` — consistent with [slug]/page.tsx pattern
- Tab switch buttons: `py-2` (36px) → `py-3` (44px minimum)

`app/(public)/visas/page.tsx`, `visas/family/page.tsx`, `visas/golden/page.tsx`, `company-setup/page.tsx`:
- All back links: no padding (18px) → `py-3 -mt-1` (42px, preserving visual rhythm)

**Content duplication fixes:**

`app/(public)/page.tsx`:
- Removed "Guides" section (7th homepage section showing 3 recent TopicCards)
- Removed `TopicCard` import and `getRecentPublishedGuides` call
- Added single "Browse all guides →" link with `py-3` tap target
- RouteSnapshotBand already provides guide discovery — second card list was redundant, likely overlapping
- Homepage now has 6 logical sections instead of 7

`components/HowItWorks.tsx`:
- Item 1 "Real process, real costs / Government fees and timelines from official sources" → "Official sources only / Fees and steps are traced to GDRFA, ICA, MOHRE, DED, and Amer — not estimated."
- Previous text repeated Hero's "Official steps, real government fees" claim exactly
- New text names the specific authorities — genuinely different information from the Hero

**Consistency fixes:**

`app/(public)/find-my-visa/page.tsx`:
- H1: "Find Your Route" → "Find My Route" — now matches header nav, mobile header, sticky CTA, homepage card

`components/RouteFinderFlow.tsx`:
- Step counter: `state.answers.length + 1` → `startFlow ? state.answers.length : state.answers.length + 1`
- When startFlow pre-answers Q1, user's first visible question is Q2 — now correctly shows "Step 1"
- Without startFlow, normal flow: Q2 = Step 2, Q3 = Step 3 (unchanged)

Build: 31/31 clean.

---

## 2026-04-23 — Full-site QA sweep and cleanup pass

**Issues found and fixed (5 of 10):**

`components/GuideHeader.tsx`:
- Removed `import Link` and the "← All guides" back link
- The guide page's own breadcrumb row (added in discoverability pass) already handles this
- Duplicate back links on every guide page — eliminated

`components/FreeAdviceCta.tsx`:
- Heading: "Not sure which route applies to you?" → "Need help with your specific situation?"
- Previous heading was the exact same question the calculator answers — two consecutive homepage sections competing for the same user need
- Now clearly positioned as human escalation (WhatsApp), not route selection (calculator)

`components/Header.tsx`:
- Added mobile-only "Find My Route" link between logo and WhatsApp button
- Uses `self-stretch flex items-center` — full 56px (h-14) tap area across the header height
- Marked `sm:hidden` — desktop nav already shows the full link set
- Mobile users previously had ZERO navigation beyond logo and WhatsApp on any non-homepage page
- Active state uses same `isActive()` logic as desktop nav

`app/(public)/guides/[slug]/page.tsx`:
- Breadcrumb link tap targets: `py-2` (34px) → `py-3` (42px)
- Below the 44px minimum — fixed

`components/CtaCard.tsx`:
- Link: `text-xs` with no padding (18px tap target) → `text-sm py-3 -mb-1` (~42px tap target)
- Used on every guide detail page and /company-setup as the bottom CTA
- Previously effectively untappable on mobile

**Issues found but NOT fixed (5 remaining):**
- Issue 6: RouteSnapshot "Where to start" previews step 1 content which reappears in full below — intentional design, leave
- Issue 7: "Property Visa" alongside "Golden Visa" in PrimaryServices — minor, acceptable shortcut for property-route users
- Issue 8: /visas and /visas/family both have calculator CTAs in sequence — separate pages, not competing
- Issue 9: CtaCard uses `<a>` for internal links instead of `<Link>` — minor perf, not UX
- Issue 10: RouteSnapshotBand links employment-visa directly while PrimaryServices routes it to route finder — different sections with different purposes

Build: 31/31 clean.

---

## 2026-04-23 — Route-selection UX reset

**What changed:**

`components/RouteFinderFlow.tsx`:
- Added `startFlow?: string` prop
- Added `buildInitialState(startFlow)` — finds matching Q1 option, initializes FlowState at Q2 with Q1 pre-answered
- `useState` changed to lazy initializer `() => buildInitialState(startFlow)`
- Back from Q2 correctly returns to Q1 (Q1 answer is in state.answers); reset goes to Q1 unconditionally

`app/(public)/find-my-visa/page.tsx`:
- Now async with `searchParams: Promise<{ flow?: string }>`
- Reads `flow` param, passes as `startFlow` to RouteFinderFlow
- Page is now ƒ (dynamic) — appropriate for a tool page reading URL params

`components/PrimaryServices.tsx` — 4 link changes (ambiguous → route finder with pre-selected flow):
- Employment Visa: `/guides/employment-visa` → `/find-my-visa?flow=employment`
- New Family Visa: `/visas/family` → `/find-my-visa?flow=family-new`
- Golden Visa: `/visas/golden` → `/find-my-visa?flow=golden`
- Company Setup: `/company-setup` → `/find-my-visa?flow=company`
- Kept direct: Renew, Newborn, Property Visa, Mainland, Free Zone, Bank Account, Government items (all unambiguous)

`app/(public)/page.tsx`:
- Brass card headline: "Not sure where to start?" → "Find My Route"
- Now one label for the tool everywhere (nav, sticky CTA, guide pages, homepage card)

`app/(public)/guides/[slug]/page.tsx`:
- Added `py-2 px-1` to both breadcrumb links — fixes 18px tap target → ~44px on mobile

Build: 31/31 clean. `/find-my-visa` now ƒ (dynamic).

---

## 2026-04-22 — Calculator discoverability pass

**What changed:**

`app/(public)/page.tsx`:
- Added inline calculator entry section between PrimaryServices and FreeAdviceCta
- Brass-bordered card ("Not sure where to start? / Answer 2–3 questions") — visible on initial page load, both desktop and mobile
- Fixes: homepage had zero in-page calculator presence; FreeAdviceCta was absorbing unsure users with WhatsApp instead of sending them to self-serve tool first

`app/(public)/visas/page.tsx`:
- Added slim "Not sure which visa applies to you? Find your route" link above hub cards
- Same stone-50 bordered pattern as /visas/family and /visas/golden

`app/(public)/guides/[slug]/page.tsx`:
- Added `import Link from "next/link"`
- Added breadcrumb+calculator row at top of every guide detail page
- "← All guides" (left) + "Find my route →" (right in brass)
- Gives users an escape route if they landed on the wrong guide

Build: 31/31 pages, clean.

---

## 2026-04-22 — Sticky mobile CTA QA polish

**What changed:**

`components/StickyRouteCta.tsx`:
- Removed `if (!visible) return null` — bar is always in the DOM after pathname check
- Bar now slides in via `translate-y-full → translate-y-0` with `transition-transform duration-200`
- Replaces snap-in with a smooth slide-up; feels native rather than pop-up

`app/(public)/layout.tsx`:
- `pb-16` → `pb-20` — 80px bottom padding on main (was 64px)
- 64px gave only ~4px clearance above the bar's edge; 80px gives a comfortable 20px buffer

Build: 31/31 pages, clean.

---

## 2026-04-22 — Sticky mobile CTA

**What changed:**

`components/StickyRouteCta.tsx` (new):
- Mobile-only sticky bottom bar linking to `/find-my-visa`
- Hidden on `/find-my-visa` itself via `HIDDEN_ON` list + `usePathname()`
- Appears after 100px scroll via `useEffect` + scroll listener (`passive: true`)
- `position: fixed; bottom: 0` — zero CLS (out of document flow)
- `sm:hidden` — desktop nav already shows "Find My Route"
- `z-40` — below sticky header (`z-50`)
- `env(safe-area-inset-bottom)` — iPhone home indicator safe area

`app/(public)/layout.tsx`:
- Added `StickyRouteCta` import and render after `<Footer />`
- Added `pb-16 sm:pb-0` to `<main>` — prevents footer from hiding under bar on mobile

Build: 31/31 pages, clean.

---

## 2026-04-22 — Calculator v1 QA + polish pass

**What changed:**

`lib/route-finder-config.ts`:
- `whatsappHref` added to `RouteFinderConfig` interface + object — WhatsApp URL now lives in config, not component
- `ctaLabel?: string` added to `HubResolution` — hub CTA button text is now config-controlled per resolution
- Q2-emp-loc options: "I am in the UAE" / "I am outside the UAE" → "In the UAE" / "Outside the UAE" (shorter, mobile-friendly)
- Q2-golden question: "What is the basis for your Golden Visa?" → "How are you applying for a Golden Visa?" (removes bureaucratic "basis")
- Q2-golden option: "I am a professional, executive, or investor" → "...or senior talent" (removes ambiguous "investor")
- Q2-golden option: "I am not sure" → "I am not sure which route applies to me" (clearer prompt)
- Q2-company options: free zone parenthetical "(zone-based, simpler)" → "(100% ownership, export-focused)" (honest differentiator); mainland gains parenthetical "(DED-licensed, trade anywhere in the UAE)"
- r-family-outside fact 1: "Your family member applies from outside the UAE" (restated what user said) → "Your family member travels to Dubai after the entry permit is approved" (new information: the mechanism)
- r-family-inside fact 1: "Your family member is already in the UAE" (restated) → "No departure required — your family member stays in the UAE throughout" (the key benefit)
- r-employment-inside fact 1: "You are already in the UAE on any visa status" (restated) → "This route applies to mainland Dubai employers only — free zone employees follow a different process" (eligibility gate)
- r-employment-outside heading: removed em-dash from "... — Guide Coming Soon"; new heading "Employment Visa: Outside UAE Route" + body trimmed
- r-hub-company: added `ctaLabel: "Compare Your Options →"` (more specific than the generic "See All Routes →")

`components/RouteFinderFlow.tsx`:
- `WHATSAPP_HREF` constant removed from component; now reads `ROUTE_FINDER_CONFIG.whatsappHref`
- `BackLink` and `ResetLink` inner component functions removed (React anti-pattern); replaced with `backButton` and `resetButton` JSX variables
- Empty `h-8` container on Q1 removed; back+progress row now renders only when `hasAnswers` is true (eliminates 32px wasted space on first question)
- Back button tap target: `py-1` (28px) → `py-3` (44px minimum) in both question and result states
- Reset button tap target: `py-2` → `py-3`
- Secondary CTA `py-1` → `py-2` for slightly better tap area
- Hub CTA now uses `resolution.ctaLabel ?? "See All Routes →"` — config-driven per resolution

**Build:** Clean — 31 pages, TypeScript clean, /find-my-visa ○ Static.

**Mobile UX flag (owner decision needed):** "Find My Route" is in the `hidden sm:flex` nav — invisible on mobile viewports. Discovery on mobile is via hub page CTAs only. Recommend adding a visible entry point on the homepage (PrimaryServices or Hero) in a future pass.

---

## 2026-04-22 — Calculator v1 implemented (/find-my-visa live)

**What was built:**
- `lib/route-finder-config.ts` — full config: 6 question nodes, 13 resolution states, supporting service injection
- `components/RouteFinderFlow.tsx` — `'use client'` generic renderer; manages question stack + context state
- `app/(public)/find-my-visa/page.tsx` — static SSR page; pre-fetches all 14 guide slugs server-side
- `components/Header.tsx` — "Find My Route" added as first nav item
- `app/(public)/visas/family/page.tsx` — "Find My Route" CTA added above guide cards
- `app/(public)/visas/golden/page.tsx` — "Find My Route" CTA added above guide cards
- `app/(public)/company-setup/page.tsx` — "Find My Route" CTA added above route cards

**Architecture:**
- Config (no DB deps) imported directly by the client component
- Guide data (price/timeline/title) fetched server-side via `getPublishedGuidesForBand`; passed to client as `Record<string, CalcGuideData>`
- Context carries `familyType` (spouse/child) from Q2 to resolve the correct slug at the result card
- `guideSlugByContext` pattern handles the family inside/outside resolution split
- No public API endpoint. No hardcoded fees. No email gate.

**Route coverage:**
- family-new (spouse/child × outside/inside) → 4 guide resolutions
- family-renew → 1 guide resolution
- newborn → 1 guide resolution
- employment inside UAE → 1 guide resolution
- employment outside UAE → advisor (guide coming soon)
- golden property → 1 guide resolution
- golden professional/unsure → hub resolution
- mainland/freezone/bankaccount → 3 guide resolutions
- company unsure → hub resolution
- other/advisor → catch-all

**Build:** Clean — 31 pages, TypeScript passed, `/find-my-visa` ○ Static.

**Mismatch check:** Zero mismatches. All 14 DB slugs confirmed published before build.

---

## 2026-04-22 — Calculator spec v2 (route-finder-calculator-spec-v1.md rewritten)

**What changed:** Full strategic audit of current 14-guide coverage against calculator v1 feasibility. Spec rewritten from scratch with implementation-ready config, complete Q1→Q3 question tree, all resolution states, supporting service injection logic, and company setup sub-tree (absent in v1.0).

**Key decisions:**
- Q1 options: family-new / family-renew / newborn / employment / golden / company / other (7 top-level paths)
- Max 3 questions before result — hard limit
- Employment outside UAE: resolves to advisor (no guide yet) — does not fail silently
- Golden Visa: only property route (AED 2M) resolves to guide; all other golden routes → hub + WhatsApp
- Company setup added to Q1 — covered 3 guides + hub
- Supporting service injection: attestation appears on outside-country family routes; Amer on inside-country; PRO on company routes
- Pre-fetch all guide data server-side at page load (max 11 slugs) — no client-side fee fetching
- `guideSlugByContext` pattern for family inside/outside: single resolution record uses Q2 context (spouse/child) to pick correct slug

**Files changed:**
- `docs/route-finder-calculator-spec-v1.md` — complete rewrite (v2.0)

**Implementation readiness verdict:** Ready to build. All prerequisites met (14 guides live, fees audited, config fully defined, mobile interaction spec in interaction-patterns-mobile-first.md Pattern 4). Next step: create `lib/route-finder-config.ts` + `/find-my-visa` page + `RouteFinderFlow` component.

---

## 2026-04-22 — renew-family-visa-dubai published (pricing pass)

**Pricing fix:** "UAE government fees apply" replaced with "Residence visa renewal and Emirates ID fees vary by visa duration and family file status" — names the actual drivers of variation (duration and whether the family file needs updating), which is more useful than a generic disclaimer. Step 3 cost updated to match. Medical test fee (AED 250–450) retained as-is — well-supported range for GDRFA-approved centers.

**What changed:**
- `data/guides.db` — guide-level price and step 3 cost revised; published = 1
- `components/PrimaryServices.tsx` — Renew Family Visa: soon → href "/guides/renew-family-visa-dubai"

**Build result:** Clean. `[+11 more paths]` — renew-family-visa-dubai confirmed in generateStaticParams (was +10 before).

**Visas group in PrimaryServices now:** Employment Visa (live) + New Family Visa (live) + Renew Family Visa (live) + Newborn Visa (live) + Golden Visa (live) + Property Visa (live) + Maid Visa (soon). 6/7 live — only Maid Visa remaining as Soon.

---

## 2026-04-22 — Draft guide: renew-family-visa-dubai (4 steps, visas category)

**Scope:** In-country renewal of an existing family residence visa for a spouse or child already living in the UAE. Starts from checking renewal timing, covers medical fitness test for adults 18+ (children under 18 exempt), Amer submission, and EID delivery by post. Does NOT cover: first-time applications, outside-country re-entry, attestation (not needed at renewal), sponsor visa complications.

**Key distinction from first-time guides:** No entry permit, no change of status, no attestation of marriage/birth certificates, no Tasheel steps. Simpler route — medical (adults only) then Amer.

**What changed:**
- `scripts/create-renew-family-visa-guide.ts` (new) — one-time insertion script
- `data/guides.db` — 1 guide row + 4 step rows. Self-audit found 1 em-dash in step 2 advice; fixed.

**Guide details:**
- ID: 1faf6935-03c4-48c8-b53f-8835d91ddb9c
- Slug: renew-family-visa-dubai
- Category: visas
- Published: false (draft)
- Price: "AED 250–450 for medical fitness test (adults 18+ only). UAE government fees for visa + EID confirmed at Amer counter."
- Timeline: "4–7 working days for medical results plus Amer processing. Emirates ID by post 5–10 working days after visa approval."
- Steps: 4

**Step sequence:**
1. Check Renewal Timing and Requirements — no cost — 5–10 min
2. Complete Medical Fitness Test (adults 18+ only) — AED 250–450 — 1–3 working days for ICA upload
3. Submit Renewal at Amer — govt fees + Amer service fee — 30–60 min visit, 2–5 days processing
4. Collect Renewed Visa and Emirates ID — no fee — 2–5 days visa; 5–10 days EID by post

**Publish decision:** Draft. Medical fitness test fee (AED 250–450) is a well-known range for GDRFA-approved centers; other fees are honestly deferred to Amer counter. Recommend owner review before publishing.

**Build result:** Clean. `[+10 more paths]` unchanged — draft correctly excluded.

---

## 2026-04-22 — pro-services-dubai published (fee confidence pass)

**Fee fix:** Removed AED 150–350 range from step 3 cost (Dubai notary fees vary by center type and document complexity; range could be low for complex PoAs). Replaced with: "Notarized power of attorney: notary fees apply if required. Confirm the exact cost with the notary center before proceeding." Guide-level price was already clean.

**What changed:**
- `data/guides.db` — step 3 cost revised; published = 1
- `components/PrimaryServices.tsx` — PRO Services: soon → href "/guides/pro-services-dubai"

**Build result:** Clean. `[+10 more paths]` — PRO guide confirmed in generateStaticParams (was +9 before).

**Government group in PrimaryServices now:** Document Attestation (live) + Amer Services (live) + PRO Services (live). All 3 items live. Government pillar complete.

---

## 2026-04-22 — Draft guide: pro-services-dubai (5 steps, government category)

**Scope:** Service-provider orientation guide. Explains what PRO services are, which government tasks they handle (license renewals, employee visa processing, MOHRE registrations, DED/free zone filings, attestation), how to find and vet a provider, and how the engagement workflow runs. Explicitly notes PRO fees are set by the provider, not government-regulated. Does not cover any specific visa/license procedure in detail.

**What changed:**
- `scripts/create-pro-services-guide.ts` (new) — one-time insertion script
- `data/guides.db` — 1 guide row + 5 step rows inserted. Self-audit found 5 em-dash issues and 1 sentence-count issue; all fixed.

**Guide details:**
- ID: 815e003d-c999-431a-baed-313c8fb8687c
- Slug: pro-services-dubai
- Category: government
- Published: false (draft)
- Price: "PRO service fees are set by the provider and are not government-regulated. Request written quotes from at least two providers before committing."
- Timeline: "PRO engagement typically 1–3 working days to set up. Transaction timelines depend on government department."
- Steps: 5

**Step sequence:**
1. Identify Tasks for PRO Handling — no cost — 30–60 min assess
2. Find a Reputable PRO Provider — no cost — 1–3 working days
3. Authorize and Engage Your PRO — LoA free; notarized PoA AED 150–350 — same-day to 2 days
4. Provide Documents to Your PRO — no additional fee — same-day handover
5. Review and Collect Outcomes — no fee — varies by transaction

**Publish decision:** Draft. Structure and content are clean. Notary PoA fee (AED 150–350) is a reasonable estimate for Dubai notary centers. Keep as draft for owner review of fee estimate before live indexing.

**Build result:** Clean. `[+9 more paths]` unchanged — draft correctly excluded from generateStaticParams.

---

## 2026-04-22 — amer-center-dubai published (fee confidence pass)

**Fee fix:** Removed AED 30–220 range (no official Amer tariff to back it; range was too wide to be useful and specific enough to be wrong). Replaced with honest structural wording: "Amer charges a typing/service fee per transaction in addition to the applicable UAE government fee." Step 3 cost updated to match. Em-dash also removed from price field.

**What changed:**
- `data/guides.db` — price field and step 3 cost revised; published = 1
- `components/PrimaryServices.tsx` — Amer Services: soon → href "/guides/amer-center-dubai"

**Build result:** Clean. `[+9 more paths]` — Amer guide confirmed in generateStaticParams (was +8 before).

**Government group in PrimaryServices now:** Document Attestation (live) + Amer Services (live) + PRO Services (soon). Two live items — group has real substance.

---

## 2026-04-22 — Draft guide: amer-center-dubai (4 steps, government category)

**Scope:** Service-center orientation guide. Covers how to use Amer centers for personal residency transactions (residence visas, Emirates ID, entry permits, status changes). Explicitly distinguishes Amer (personal residency) from Tasheel (employer/labor). Does not cover any single visa in full procedural detail — those live in dedicated guides. 4 steps: Book appointment → Gather documents → Visit Amer → Collect outcome.

**What changed:**
- `scripts/create-amer-center-guide.ts` (new) — one-time insertion script with existence guard
- `data/guides.db` — 1 guide row + 4 step rows inserted. Self-audit applied 7 fixes: em-dashes removed from overview, step 1 address, step 2 warning, step 3 advice; step 1/3/4 what fields compressed to 2 sentences.

**Guide details:**
- ID: 9b7f6b00-5f52-46d7-aa63-0badb30ea3e5
- Slug: amer-center-dubai
- Category: government
- Published: false (draft)
- Price: "Amer service fee varies by transaction (typically AED 30–220). UAE government fees are additional."
- Timeline: "1–5 working days for most transactions. Walk-in wait 30–90 minutes; appointment 10–20 minutes."
- Steps: 4

**Step sequence:**
1. Book Your Appointment — no booking fee — available within 1–3 working days
2. Gather Your Documents — AED 2–5 photocopies if needed — 15–30 min prep
3. Visit the Amer Center — AED 30–220 service fee + govt fees — 30–90 min total
4. Collect Your Outcome — no fee — 1–5 working days processing

**Publish decision:** Draft. Amer service fee range (AED 30–220) is an estimate based on known Amer pricing — Amer does not publish a single official tariff list. Guide structure is clean and SEO-ready; recommend owner review of fee range before publishing.

**Build result:** Clean. `[+8 more paths]` unchanged — draft correctly excluded from generateStaticParams.

---

## 2026-04-22 — document-attestation-dubai published (scope-tightened to 3 steps)

**Scope tightening decision:** Original 5-step structure overclaimed procedural authority for home-country steps (steps 1–3 in draft said "varies by country" in a step-card format that implies follow-in-order certainty). Restructured to 3 steps: Step 1 is an honest prerequisite framework (home-country chain overview + apostille decision point), Step 2 is the detailed UAE MOFA step (the only Dubai-specific, fee-certain part), Step 3 is collection.

**What changed:**
- `data/guides.db` — guide restructured from 5 steps to 3 steps; published = 1
- `components/PrimaryServices.tsx` — Government group added (3 items: Document Attestation live, PRO Services soon, Amer Services soon)

**Guide details:**
- Slug: document-attestation-dubai
- Category: government (first published guide in this category)
- Published: true
- Price: "AED 150 per document (UAE MOFA government fee, standard processing). Home-country fees vary by nationality."
- Timeline: "2–6 weeks end-to-end. Home-country 1–4 weeks; UAE MOFA 1–3 working days."
- Steps: 3

**Step sequence:**
1. Complete Home-Country Authentication — varies USD 20–80 (notary) + USD 30–100 (UAE Embassy) — 1–4 weeks
2. Submit to UAE MOFA — AED 150 standard — 1–3 working days
3. Collect the Attested Document — no fee — included in step 2

**Build result:** Clean. `[+8 more paths]` — attestation guide confirmed in generateStaticParams (was +7 before).

---

## 2026-04-22 — Draft guide: document-attestation-dubai (5 steps, government category)

**Scope:** Full attestation chain for foreign-issued personal and educational documents intended for UAE use. Standard route: notarization in home country → home Ministry of Foreign Affairs authentication → UAE Embassy stamp → UAE MOFA final attestation. Apostille route (for Hague Convention countries) covered in step 1 advice. Does not cover country-specific home-country procedures in detail.

**What changed:**
- `scripts/create-attestation-guide.ts` (new) — one-time insertion script with existence guard
- `data/guides.db` — 1 new guide row + 5 step rows inserted. Self-audit applied 8 fixes: em-dashes removed from summary, audience, step 1 address, step 4 where; step 2/3/4 titles shortened to ≤6 words; step 3 filler sentence removed.

**Guide details:**
- ID: c2731133-30a0-40d7-9cd8-2970358a2284
- Slug: document-attestation-dubai
- Category: government (first live guide in this category)
- Published: false (draft)
- Price: "AED 150 per document (UAE MOFA government fee, standard processing). Home-country fees vary by nationality — typically USD 50–200 total for home-country chain."
- Timeline: "2–6 weeks end-to-end. Home-country steps 1–4 weeks; UAE MOFA 1–3 working days."

**Step sequence:**
1. Notarize the Document in Your Home Country — varies USD 20–80 — 1–3 working days
2. Get Home Ministry Authentication — varies (often free) — 1–5 working days
3. Get UAE Embassy Stamp — varies USD 30–100 — 1–3 working days
4. Submit to UAE MOFA — AED 150 (standard) — 1–3 working days
5. Collect the Attested Document — no fee — included in step 4

**Publish decision:** Draft. Steps 1–3 describe home-country processes that vary by nationality and cannot be fully verified. Step 4 (MOFA fee AED 150) is confirmed. Recommend owner review before publishing; guide is structurally clean and procedurally accurate.

**Build result:** Clean. `[+7 more paths]` unchanged — draft correctly excluded from generateStaticParams.

---

## 2026-04-22 — newborn-visa-dubai published (fee audit pass)

**Audit result:** One wording error found in overview — "and the visa duration selected" removed (dependent visa duration is tied to sponsor's visa, not a user-selected option). Fees (Step 4: AED 510–762, Step 5: AED 385) confirmed as consistent with known Amer/ICA structures. No child-dependent-visa logic found (no attestation, no entry permit — correctly scoped to UAE birth).

**What changed:**
- `data/guides.db` — overview wording fix; `published = 1`
- `components/PrimaryServices.tsx` — Newborn Visa: `soon: true` → `href: "/guides/newborn-visa-dubai"`

**Guide details:**
- Slug: newborn-visa-dubai
- Published: true
- Price: "AED 900–1,500 (UAE government fees for residence visa and Emirates ID; varies by family file status). Consulate and birth registration fees are additional and vary by nationality."
- Timeline: "4–10 weeks from birth (depends on consulate passport speed)"

**Build result:** Clean — 25 pages. `[+7 more paths]` confirms newborn guide in generateStaticParams (was +6 before).

---

## 2026-04-21 — Draft guide: newborn-visa-dubai (6 steps, visas category)

**Scope:** Baby born IN Dubai to UAE resident parents. Starts from birth registration — not from foreign birth certificate attestation. No entry permit, no change of status. Distinct from both child dependent visa guides.

**What changed:**
- `scripts/create-newborn-visa-guide.ts` (new) — one-time insertion script with existence guard
- `data/guides.db` — 1 new guide row + 6 step rows inserted. Step 4 cost arithmetic error found and fixed in self-audit.

**Guide details:**
- ID: 754b7cf6-d2bd-4fb4-82e0-acf62961f69a
- Slug: newborn-visa-dubai
- Category: visas
- Published: false (draft)
- Price: "AED 900–1,500 (UAE government fees for residence visa and Emirates ID; varies by family file status). Consulate and birth registration fees are additional and vary by nationality."
- Timeline: "4–10 weeks from birth (depends on consulate passport speed)"
- Steps: 6

**Step sequence:**
1. Register the Birth at the Hospital — AED 50–100 — 1–3 working days
2. Register with Your Home Country's Consulate — varies — 1–5 days (+ 2–8 weeks for passport)
3. Collect the Child's Passport — included in Step 2 — 2–8 weeks
4. Apply for UAE Residence Visa at Amer — AED 510–762 — 2–5 working days
5. Apply for Emirates ID — AED 385 — 5–10 working days
6. Collect Residence Visa and Emirates ID — No fee — 2–5 working days

**Publish recommendation:** Owner review first. Fee values are estimated from known Amer/ICA structures — not confirmed from official newborn-specific sources. Guide is procedurally accurate but should be validated before publishing.

**Build result:** Clean — 24 pages. Draft excluded from generateStaticParams ([+6 paths] unchanged).

---

## 2026-04-21 — Bank account guide published + company-setup pillar fully live

**Audit fixes applied before publish (6 changes):**
- `en_summary`: reduced 3→2 sentences, removed "A guide to" opener
- `en_audience`: reduced 3→2 sentences
- Step 3 `en_where`: "Internal — your own business records" → "Your own business records" (removed em-dash)
- Step 4 `cost`: "AED 0–500" → "up to AED 500" (cleaner phrasing)
- Step 5 `en_where`: "Internal bank process — no action required..." → parenthetical form (removed em-dash)
- Step 8 `en_advice`: removed "builds a track record" (ongoing-operations drift)

**Published:** `open-business-bank-account-dubai` (`published = 1`)

**Files changed:**
- `data/guides.db` — guide published, 6 field fixes
- `app/(public)/company-setup/page.tsx` — Bank Account card: `soon: true` → `href: "/guides/open-business-bank-account-dubai"`. Hub intro updated: "All three guides are live."
- `components/PrimaryServices.tsx` — Bank Account: `soon: true` → live link

**Final guide fields:**
- Price: "No government fee. Minimum average monthly balance of AED 25,000–50,000 required (varies by bank and account tier)."
- Timeline: "2–6 weeks (varies by bank, compliance review, and business activity)"
- Published: true

**Build result:** Clean — 24 pages. [+6 more paths] confirms bank account guide in generateStaticParams.

**Company Setup pillar: FULLY LIVE**
- /company-setup hub — all 3 route cards active
- /guides/mainland-company-setup-dubai ✅
- /guides/free-zone-company-setup-dubai ✅
- /guides/open-business-bank-account-dubai ✅
- PrimaryServices Business Setup: all 3 live + Bank Account now live (4/4 live)

---

## 2026-04-21 — PrimaryServices v2: Employment Visa added, Government & Legal removed

**What changed:**
- `components/PrimaryServices.tsx` — Employment Visa added as first item in Visas group (live, → /guides/employment-visa). Government & Legal group removed entirely (was 5 items, all soon — hurt trust more than helped).

**Visas group now (7 items, 4 live):** Employment Visa → New Family Visa → Renew Family Visa (soon) → Newborn Visa (soon) → Golden Visa → Property Visa → Maid Visa (soon)
**Business Setup unchanged:** Company Setup → Mainland Company → Free Zone Company → Bank Account (soon)
**Government & Legal:** Removed. Returns when first real service is live.
**Build result:** Clean — 23 pages.

---

## 2026-04-21 — Homepage polish pass + WhatsApp CTA live

**What changed:**
- `components/Header.tsx` — WHATSAPP_HREF set to `https://wa.me/971506304817`. Added `target="_blank" rel="noopener noreferrer"` to WA link.
- `components/Hero.tsx` — WHATSAPP_HREF set live. Added WhatsApp SVG icon to CTA button. "Official process" → "Official steps" (tighter). Added `target="_blank"`.
- `components/FreeAdviceCta.tsx` — WHATSAPP_HREF set live. Added `target="_blank" rel="noopener noreferrer"`.
- `components/PrimaryServices.tsx` — Soon rows: `bg-white` → `bg-stone-50` (live/soon now clearly distinct). Dividers: `divide-stone-100` → `divide-stone-200` (more visible). Category label: `text-[11px]` → `text-[12px]`. Business Setup: added "Mainland Company" (live) + "Free Zone Company" (live) — now 3 live + 1 soon, matching Visas group weight.

**Business Setup now:** Company Setup hub + Mainland + Free Zone (all live) + Bank Account (soon).
**WhatsApp href:** `https://wa.me/971506304817` — same number in all 3 files.
**Build result:** Clean — 23 pages.

---

## 2026-04-21 — Homepage hard reset v3: service-first IA, WhatsApp header, new section order

**What changed:**
- `components/Header.tsx` — WhatsApp green pill button added (right side). Nav hidden on mobile (hidden sm:flex). TODO comment for actual number in file.
- `components/Hero.tsx` — H1 expanded to "Dubai Visas, Company Setup, and Government Services" (28px, up from 24px). Subheadline contrast improved (gray-600 vs gray-500). CTA changed from "Browse All Guides" → "Get Free Advice" (navy, links to /contact as WA placeholder). Removed `Link` import.
- `components/PrimaryServices.tsx` (new) — Full-width stacked service rows, 3 groups (Visas/navy, Business Setup/brass, Government & Legal/slate), 13 service items total, 4 live + 9 soon.
- `components/FreeAdviceCta.tsx` (new) — Navy card CTA block with WhatsApp green button. "Not sure which route applies to you?" Positioned after services.
- `app/(public)/page.tsx` — New section order: Hero → PrimaryServices → FreeAdviceCta → HowItWorks → RouteSnapshotBand → Featured Guides. Removed QuickDecisionCards and BrowseByService imports.
- `docs/homepage-hard-reset-v3.md` (new) — IA decision record.
- `docs/mobile-header-reset.md` (new) — Header decision record.

**Sections retired from homepage (components kept in codebase):**
- `QuickDecisionCards` — replaced by PrimaryServices
- `BrowseByService` — replaced by PrimaryServices

**Sections demoted (still present, lower in page):**
- `RouteSnapshotBand` — position 5 (was position 3)
- Featured Guides — position 6 (was position 5)

**Build result:** Clean — 23 pages. / remains static (○).

---

## 2026-04-21 — Draft guide: open-business-bank-account-dubai (8 steps, company-setup category)

**What changed:**
- `scripts/create-bank-account-guide.ts` (new) — one-time insertion script with existence guard.
- `data/guides.db` — 1 new guide row + 8 step rows inserted.

**Guide details:**
- ID: 31f0f98e-61d5-41df-952d-1409f5801e87
- Slug: open-business-bank-account-dubai
- Category: company-setup
- Published: false (draft)
- Price: "No government fee. Minimum average monthly balance of AED 25,000–50,000 required (varies by bank and account tier)."
- Timeline: "2–6 weeks (varies by bank, compliance review, and business activity)"

**Step sequence:**
1. Prepare Your Company Documents — No fee — 1 day
2. Choose the Right Bank — No fee — 1–2 days
3. Prepare Supporting Business Documents — No fee — 1–3 days
4. Submit the Bank Application — No fee / AED 0–500 — 1 day
5. Complete Compliance Review — No fee — 1–3 weeks
6. Attend the Bank Meeting if Required — No fee — 1–2 hours if required
7. Receive Approval and Activate the Account — No fee — 1–5 business days
8. Fund the Account — AED 25,000–50,000 min balance — same day

**Build result:** Clean. Draft not in generateStaticParams ([+5 paths] unchanged).

---

## 2026-04-21 — Free zone guide published + company-setup hub fully activated

**What changed:**
- `data/guides.db` — free-zone-company-setup-dubai published (`published = 1`).
- `app/(public)/company-setup/page.tsx` — Free Zone Setup route card converted from `soon: true` `<div>` to live `<Link href="/guides/free-zone-company-setup-dubai">`. Hub hero paragraph updated to reflect both guides live.

**Build result:** Clean — 23 pages. `/guides/[slug]` now shows [+5 more paths] confirming free zone guide in generateStaticParams.

**Company Setup pillar (2 of 3 routes live):**
- Mainland Company Setup → live
- Free Zone Company Setup → live
- Business Bank Account → coming soon

---

## 2026-04-21 — Draft guide: free-zone-company-setup-dubai (8 steps, company-setup category)

**What changed:**
- `scripts/create-freezone-company-guide.ts` (new) — one-time insertion script. Guard against re-running.
- `data/guides.db` — 1 new guide row + 8 step rows inserted.

**Guide details:**
- ID: ab3862e6-00b4-4b73-806d-277b19b38aeb
- Slug: free-zone-company-setup-dubai
- Category: company-setup
- Published: false (draft)
- Price: "AED 6,000–20,000+ per year (varies by free zone and package)"
- Timeline: "1–2 weeks (varies by free zone)"
- Steps: 8

**Step sequence:**
1. Choose Your Free Zone — No fee — 1–2 days (research)
2. Choose License Type and Activity — No fee at this stage — 1 day
3. Choose Package and Visa Quota — Included in package price — 1 day
4. Reserve the Company Name — AED 100–500 — 1–2 business days
5. Submit Application Documents — AED 500–2,000 (often included) — 1–3 business days
6. Pay the Setup Fees — AED 6,000–20,000+ — same day
7. Receive License and Documents — Included in Step 6 — 1–5 business days
8. Complete Post-License Steps — establishment card + bank account — 2–6 weeks for bank

**Build result:** Clean — 23/23 pages. Draft not exposed on public site.

---

## 2026-04-21 — Company Setup pillar fully live: publish + hub activation + nav + QDC

**What changed:**
- `data/guides.db` — mainland-company-setup-dubai published (`published = 1`).
- `app/(public)/company-setup/page.tsx` — Mainland Setup route card converted from coming-soon `<div>` to live `<Link href="/guides/mainland-company-setup-dubai">`. Added discriminated union type `Route`. Hub hero paragraph updated: "The mainland guide is live. Free zone and bank account guides are in progress." Free zone and Bank Account cards remain non-interactive with "Guide coming soon" badge.
- `components/Header.tsx` — "Company Setup" added between Visas and Guides: `[Visas | Company Setup | Guides]`. Active state: activates on `/company-setup` and any `/company-setup/*` path.
- `components/QuickDecisionCards.tsx` — "Find my route" → "Set up a company", href `/guides` → `/company-setup`. Icon updated to building SVG matching CategoryIcon company-setup style.

**Build result:** Clean — 23 pages. `/guides/[slug]` now shows [+4 more paths] (was [+3]) confirming mainland guide is in generateStaticParams.

**Company Setup pillar coverage (fully live):**
| Surface | What | Status |
|---|---|---|
| Header | Company Setup nav item | ✅ |
| Homepage QDC | "Set up a company" card → /company-setup | ✅ |
| BrowseByService | Company Setup → /company-setup | ✅ |
| /company-setup hub | Mainland card live, freezone + bank = soon | ✅ |
| /guides/mainland-company-setup-dubai | Public guide, 8 steps | ✅ |

---

## 2026-04-21 — Draft guide: mainland-company-setup-dubai (8 steps, company-setup category)

**What changed:**
- `scripts/create-mainland-company-guide.ts` (new) — one-time insertion script for the mainland company setup guide. Guard against re-running if slug exists.
- `data/guides.db` — 1 new guide row + 8 step rows inserted.

**Guide details:**
- ID: 2a0e5966-50fa-4f9f-8eff-aa5e22763c70
- Slug: mainland-company-setup-dubai
- Category: company-setup
- Published: false (draft)
- Price: "AED 12,000–25,000+ (government fees only)"
- Timeline: "2–4 weeks (without external approvals)"
- Steps: 8

**Step sequence:**
1. Choose Your Business Activity — No fee — 1 day
2. Choose Your Legal Structure — No fee at this stage — 1 day
3. Reserve Your Trade Name — AED 620–720 — 1–2 business days
4. Get Initial Approval — AED 100–1,000 — 1–3 business days
5. Register Your Office Lease — AED 220 + office rent — 1–2 business days
6. Obtain External Approvals — AED 500–15,000+ — 4–10 weeks (conditional step)
7. Submit the License Application — AED 8,000–20,000+ — 1–3 business days
8. Receive Your Trade License — Included in Step 7 — 1–3 business days

**Writing standard compliance:**
- Step 6 (external approvals) is conditional — "what" field opens with the condition and closes with "Most commercial and professional activities skip this step entirely."
- No em-dashes in any field
- All costs use official UAE fee ranges sourced from DED process
- Audience explicitly excludes regulated sectors

**Build result:** Clean — 22/22 pages. Draft not exposed on public site.

---

## 2026-04-21 — /company-setup hub: real product pillar (coming-soon routes)

**What changed:**
- `app/(public)/company-setup/page.tsx` (new) — static hub page. 5 sections: hub hero, 3 route cards, mainland-vs-freezone compare table, process overview (7 steps), CtaCard. All 3 route cards ("Mainland Setup", "Free Zone Setup", "Business Bank Account") are non-interactive `<div>` with "Guide coming soon" badge — no dead ends. Compare block is a 3-col grid table (label | Mainland | Free zone) covering 5 differentiators. Process overview is a numbered list with navy/10 step bubbles.
- `components/BrowseByService.tsx` — "Company Setup" updated from `soon: true` to `href: "/company-setup"` — now a live link.

**Why the page earns its keep before guides exist:**
- Compare table answers the primary decision (mainland vs free zone) with 5 concrete differentiators
- Process overview shows the full 7-step sequence that applies to both routes
- Bank account card explains the AED 25–50k balance requirement and 2–6 week timeline
- Zero filler sentences — every paragraph contains specific, actionable information

**Build result:** Clean — 22/22 pages. `/company-setup` renders as `○` (static).

---

## 2026-04-21 — BrowseByService section: broader service map on homepage

**What changed:**
- `components/BrowseByService.tsx` (new) — directory-style service section. Stone-50 full-section background (distinct surface from white card sections). Three groups: Visas, Business Setup, Government & Legal. Live items are `<Link>` at `text-gray-700 hover:text-gray-900`. Coming-soon items are non-interactive `<span>` at `text-gray-400` with a `bg-stone-200` "Soon" pill. No icons (intentional — icons are QDC's visual signature). 3-column grid on sm+, stacked on mobile.
- `app/(public)/page.tsx` — inserted BrowseByService after RouteSnapshotBand. Moved HowItWorks from position 4 to position 6 (after Featured Guides), per above-the-fold audit.

**Final homepage layer order:**
1. Hero — identity
2. QuickDecisionCards — fast action (primary, above fold)
3. RouteSnapshotBand — route comparison (specific routes)
4. BrowseByService — full service map (directory, stone-50 surface)
5. Featured Guides — read more (TopicCards)
6. HowItWorks — trust signals (moved later per audit)
7. CtaCard — conversion

**Service map destinations:**
| Service | Destination |
|---|---|
| Employment Visa | `/guides/employment-visa` ✅ |
| Family Visas | `/visas/family` ✅ |
| Golden Visa | `/visas/golden` ✅ |
| Maid Visa | Soon (non-link) |
| Newborn Visa | Soon (non-link) |
| Company Setup | Soon (non-link) |
| Bank Account | Soon (non-link) |
| Amer Services | Soon (non-link) |
| Attestation | Soon (non-link) |
| Legal Translation | Soon (non-link) |
| POA | Soon (non-link) |
| DLD Services | Soon (non-link) |

**Build result:** Clean — 21/21 pages.

---

## 2026-04-21 — Header nav cleanup: Visas | Guides, About/Contact to footer

**What changed:**
- `components/Header.tsx` — converted to `"use client"` to use `usePathname`. Nav reduced from `Guides | About | Contact` to `Visas | Guides`. Active state: active link gets `text-gray-900 font-medium`, inactive gets `text-gray-500 hover:text-gray-900`. Active logic: `pathname === href || pathname.startsWith(href + "/")`. Visas activates on `/visas` and all `/visas/*`. Guides activates on `/guides` and all `/guides/*`.
- `components/Footer.tsx` (new) — minimal footer: `© year Dubai Guide` left, `About | Contact` right. `text-xs text-gray-400`, border-t border-gray-100, py-6.
- `app/(public)/layout.tsx` — added `<Footer />` import and render below `<main>`.

**Active state verified across routes:**
- `/` → neither item active ✅
- `/visas` → Visas active ✅
- `/visas/family` → Visas active ✅
- `/visas/golden` → Visas active ✅
- `/guides` → Guides active ✅
- `/guides/[slug]` → Guides active ✅

**Build result:** Clean — 21/21 pages.

---

## 2026-04-21 — Hero compression: above-the-fold audit pass

**What changed:**
- `components/Hero.tsx` — removed eyebrow label ("Dubai Guide"), removed topic pills (5 pills all → /guides), removed secondary CTA ("Find My Route →" → /guides). Shortened h1 from `text-[28px]` to `text-[24px]`. Shortened subheadline from 2 lines to 1: "Official government fees and process — in plain English." Tightened padding from `pt-12 pb-10` to `pt-8 pb-5`. Reduced subheadline margin from `mb-7` to `mb-5`. Kept: h1, subheadline, primary CTA "Browse All Guides" → /guides.

**Above-the-fold result at 375px (iPhone SE, 611px below header):**
- Hero compressed: ~222px
- All 6 QuickDecisionCards + their section heading: ~275px
- Total: ~497px — **all 6 cards fully visible with ~114px to spare before fold**

**Build result:** Clean — 21/21 pages.

---

## 2026-04-20 — Phase 3: Visa hub pages (/visas, /visas/family, /visas/golden)

**What changed:**
- `app/(public)/visas/page.tsx` (new) — parent visa hub; static; lists Family, Golden, Employment as stone-50 cards with brass badges. Breadcrumb: ← All guides.
- `app/(public)/visas/family/page.tsx` (new) — static; lists spouse + child group pages as cards. Breadcrumb: ← Visas.
- `app/(public)/visas/golden/page.tsx` (new) — static; lists golden-via-property guide card + "more routes coming" note. Breadcrumb: ← Visas.
- `components/QuickDecisionCards.tsx` — "Get a Golden Visa" href updated from `/guides/golden-visa-dubai-property` → `/visas/golden`. Spouse/child cards kept at group pages (already act as focused hubs with inside/outside tabs).

**Verified (Step 1 — launch cleanup):**
- All 6 QuickDecisionCard destinations return 200 ✅
- RouteSnapshotBand shows 4 cards (all 4 BAND_SLUGS published) ✅
- No unpublished destination exposed from homepage ✅
- Group pages + redirects correct ✅

**Verified (Step 2 — sticky tabs):**
- GuideTabs sticky tab bar already live: `sticky top-14 z-10 bg-white -mx-5 px-5 py-3` ✅ (Phase 5.1, no change needed)

**Build result:** Clean — 21/21 pages. `/visas`, `/visas/family`, `/visas/golden` all render as `○` (static).

**Final live navigation flow from homepage:**
- "Sponsor my spouse" → `/guides/spouse-dependent-visa-dubai` (inside/outside tabs)
- "Bring my child to Dubai" → `/guides/child-dependent-visa-dubai` (inside/outside tabs)
- "Get a Golden Visa" → `/visas/golden` → `/guides/golden-visa-dubai-property`
- "Employment visa" → `/guides/employment-visa`
- "Newborn visa" / "Find my route" → `/guides` (safe fallback — no guide yet)

---

## 2026-04-20 — Phase 2.9: Featured Guides section (3 most recent, "See all →")

**What changed:**
- `lib/db/reader.ts` — added `getRecentPublishedGuides(limit)`: published only, sorted by `updatedAt` desc, hard limit passed by caller.
- `app/(public)/page.tsx` — replaced `getAllPublishedGuides()` with `getRecentPublishedGuides(3)`; replaced bare `<h2>` heading with brass overline + uppercase label pattern; added `border-t border-stone-100` separator from HowItWorks; added "See all guides →" brass text link below the 3 cards.

**Homepage layer logic (verified):**
1. QuickDecisionCards — quick decide
2. RouteSnapshotBand — compare routes (cost + timeline)
3. HowItWorks — understand the product
4. Featured Guides (3 cards + "See all →") — read full guides

**Build result:** Clean — 18/18 pages.

---

## 2026-04-20 — Phase 2 homepage upgrades: Hero, HowItWorks, CtaCard

**What changed:**
- `components/Hero.tsx` — Rewritten: h1 → "Dubai Visas and Procedures — Step by Step"; new subheadline (official process focus); topic pills reordered (Visas first); removed 4-item "Every guide includes" value grid; added primary CTA (navy, "Browse All Guides") + secondary CTA (brass text, "Find My Route →").
- `components/HowItWorks.tsx` (new) — 3-item vertical list with brass SVG icons: "Real process, real costs", "Step by step", "Always free". Added to homepage between RouteSnapshotBand and guide list.
- `components/CtaCard.tsx` (new) — Shared navy CTA card extracted from inline use in slug page and GuideTabs. Props: `heading`, `linkLabel`, `href` — all optional with defaults. Homepage uses custom heading "Have questions about your situation?".
- `app/(public)/page.tsx` — Replaced inline social links footer section with `<CtaCard>`.
- `app/(public)/guides/[slug]/page.tsx` — Replaced inline navy CTA block with `<CtaCard />`.
- `components/GuideTabs.tsx` — Replaced inline navy CTA block with `<CtaCard />`.

**Build result:** Clean — 18/18 pages.

**Next step:** Phase 2.9 — Featured Guides section (3 most recent, "See all →" link)

---

## 2026-04-20 — Launch skeleton complete: 6 guides published, sticky tabs, link audit

**What changed:**
- `data/guides.db` — 5 draft guides published (published=1); `last_updated` on child-inside corrected from ISO timestamp to "April 2026"
- `components/QuickDecisionCards.tsx` — Golden Visa card href corrected to `/guides/golden-visa-dubai-property` (held at `/guides` briefly during publish window; restored after guide went live)
- `components/GuideTabs.tsx` — Variant tab bar wrapped in sticky container: `sticky top-14 z-10 bg-white -mx-5 px-5 py-3 border-b border-stone-100`. The `-mx-5 px-5` bleed ensures the white background covers full column width when tabs stick. `top-14` matches public Header `h-14` (56px).

**Build result:** Clean — 18/18 pages. `generateStaticParams` now outputs 6 guide slugs (up from 1).

**Homepage audit — all QuickDecisionCard destinations return 200:**
| Card | Destination | Status |
|---|---|---|
| Sponsor my spouse | /guides/spouse-dependent-visa-dubai | ✅ 200 |
| Bring my child to Dubai | /guides/child-dependent-visa-dubai | ✅ 200 |
| Newborn visa | /guides | ✅ 200 (fallback — guide not yet written) |
| Get a Golden Visa | /guides/golden-visa-dubai-property | ✅ 200 |
| Employment visa | /guides/employment-visa | ✅ 200 |
| Find my route | /guides | ✅ 200 (fallback — calculator not yet built) |

**RouteSnapshotBand:** Expanded from 1 card to 4 cards automatically on publish — no code change needed.

**Launch skeleton definition met:**
- ✅ 6 published guides
- ✅ Group pages render published content
- ✅ Homepage Quick Decision Cards all point to live pages
- ✅ RouteSnapshotBand shows 4 routes with cost/timeline
- ✅ No broken links

**Next step:** Build hub pages (/visas/family, /visas/golden) or move to next UX improvement

---

## 2026-04-20 — QuickDecisionCards added to homepage

**What changed:**
- `components/QuickDecisionCards.tsx` (new) — 6-card 2-col grid; each card: 20px inline SVG icon (brass/70, no external lib), short label (≤4 words), white bg + stone-200 border at rest, stone-50 + stone-300 border on hover; min-height 56px for touch targets; all SVGs drawn on 20×20 viewport matching CategoryIcon stroke weight (1.5px, round caps). Cards are static — no DB dependency.
- `app/(public)/page.tsx` — imports QuickDecisionCards; renders between Hero and RouteSnapshotBand.

**Card destinations (current):**
| Card | Destination | Status |
|---|---|---|
| Sponsor my spouse | /guides/spouse-dependent-visa-dubai | Group page live |
| Bring my child to Dubai | /guides/child-dependent-visa-dubai | Group page live |
| Newborn visa | /guides | Guide not yet built |
| Get a Golden Visa | /guides/golden-visa-dubai-property | Draft — redirects when published |
| Employment visa | /guides/employment-visa | Published |
| Find my route | /guides | Calculator not yet built |

**Build result:** Clean — 0 TypeScript errors, 13/13 pages.

**Homepage order confirmed:** Hero (3231) → QuickDecision (6056) → RouteSnapshotBand (11113) → Guides (12522) — verified by byte position in HTML output.

**Next step:** Run /guide-content-qa on 5 draft guides, publish them — RouteSnapshotBand fills to 4 cards; golden visa and child/spouse QuickDecisionCards start routing to real content.

---

## 2026-04-20 — RouteSnapshotBand added to homepage; RouteSnapshot truncation tightened

**What changed:**
- `components/RouteSnapshot.tsx` — replaced word-boundary truncation with `truncateToSentence()`: finds the first sentence-ending `.!?` within [40, 150] chars, falls back to word boundary. "Where to start" on employment-visa guide now shows the full clean sentence instead of a mid-clause cut.
- `lib/db/reader.ts` — added `BandGuideItem` interface and `getPublishedGuidesForBand(slugs: string[])`: single DB query using `and + inArray` from drizzle-orm; returns guide-level fields only (no steps); respects published filter.
- `components/RouteSnapshotBand.tsx` (new) — section component; renders 1-col mobile / 2-col tablet+ grid; each card shows category, title (line-clamp-2), cost/timeline 2-col grid, audience (line-clamp-2), "Full guide →" link; slug→href mapping handles group guide URLs directly (no redirect hop for child/spouse slugs); returns null if no published guides match.
- `app/(public)/page.tsx` — imports RouteSnapshotBand and getPublishedGuidesForBand; `BAND_SLUGS` constant defines the 4 target routes; band renders between Hero and the existing guide list.

**Build result:** Clean — 0 TypeScript errors, 13/13 pages.

**Current state:** Band shows 1 card (employment-visa is the only published guide). The other 3 slugs (child, spouse, golden visa) are drafts — they'll appear automatically when published, no code change needed.

**What this enables:**
- Ad-traffic users see price/timeline for published routes without scrolling into the guide list
- Band is zero-maintenance: publishes a guide → it appears in the band automatically
- `RouteSnapshotBand` card design uses existing tokens (stone-50, border-stone-200, navy, brass) — no new CSS
- When all 4 target guides are published, the band shows a 2x2 grid on desktop

**Next step:** Run /guide-content-qa on 5 draft guides, publish them — band fills to 4 cards immediately

---

## 2026-04-20 — RouteSnapshot.tsx built and integrated on guide + group pages

**What changed:**
- `components/RouteSnapshot.tsx` (new) — fast-answer block: estimated cost, timeline, best for, where to start (step 1 what, truncated), step titles preview (first 4), "See all N steps ↓" anchor link, last updated date. Works in server and client component contexts (pure props, no server APIs).
- `components/GuideHeader.tsx` — stripped metadata grid (cost/timeline/audience/lastUpdated). Now renders: back link, category icon + label, h1, summary only. Interface reduced to `{ title, summary, category }`.
- `app/(public)/guides/[slug]/page.tsx` — imports RouteSnapshot, passes all guide fields; `GuideHeader` call updated to 3-field props; steps container gets `id="steps"` for anchor navigation.
- `components/GuideTabs.tsx` — imports RouteSnapshot; replaces inline metadata grid + lastUpdated with `<RouteSnapshot activeGuide.* />` that switches per active tab; steps container gets `id="steps"`.

**Build result:** Clean — 0 TypeScript errors, 13/13 pages.

**What this enables:**
- Ad-traffic users see cost/timeline/best-for/step-preview before the overview paragraphs on both individual guide pages and group guide pages
- "See all N steps ↓" anchor link works on both page types (targets `id="steps"`)
- RouteSnapshot switches live with the tab on group guide pages (client state update)
- Component is ready to be reused for the homepage Route Snapshot Band (Phase 2, Task 2.10 equivalent) — same props interface, same rendering

**Next step:** Run /guide-content-qa on 5 draft guides, then publish

---

## 2026-04-20 — Hybrid homepage and route page design system created

**What changed:**
- Created 3 new design blueprint docs:
  - `docs/homepage-blueprint-v2.md` — 8-section homepage with Route Snapshot Band as the fast-answer layer for ad traffic; replaces v1 as build reference
  - `docs/hybrid-route-page-blueprint.md` — 3 page-type patterns (group guide, individual guide, hub page); Route Snapshot Block defined as new component bridging fast and deep modes; sticky tab bar behavior specified
  - `docs/interaction-patterns-mobile-first.md` — 10 concrete patterns (touch targets, sticky tab, calculator flow, filter, CTA card, scroll behavior); build-ready CSS specs included

**Key design decisions:**
- Route Snapshot Block is the single highest-impact addition: one new component, inserted between guide header and overview, delivers cost/timeline/step-preview for ad traffic without changing the deep-content layer
- Sticky tab bar required for group guide pages — users mid-scroll must be able to switch variants
- No animations on any mobile interactive element (tab switch, calculator questions, filter) — instant transitions only
- Section 3 of homepage (Route Snapshot Band) is new — FamilyVisa.ae hides costs behind a calculator; we show them openly on the homepage

**Next step:** Execute Phase 1 guide publishing, then implement the Route Snapshot Block (highest ROI, lowest risk change)

---

## 2026-04-20 — Strategic planning complete: 10 planning documents created

**What changed:**
- Created 10 planning/strategy documents in `docs/`:
  1. `familyvisa-competitor-matrix.md` — 23-point structured analysis of FamilyVisa.ae
  2. `familyvisa-topic-inventory.md` — full topic map with USE NOW / VERIFY FIRST / DO NOT USE tiers
  3. `site-ia-upgrade-plan.md` — upgraded IA with hub URL structure and guide list upgrade plan
  4. `service-hub-architecture.md` — hub page component pattern and 9-section design spec
  5. `route-finder-calculator-spec-v1.md` — config-first calculator spec with TypeScript pseudocode
  6. `homepage-restructure-plan.md` — 7-section homepage plan with Phase 1 launchable subset
  7. `seo-vs-ux-balance-rules.md` — 10 explicit product rules governing SEO/UX tradeoffs
  8. `anti-copy-friction-plan.md` — anti-copy measures ranked by impact; calculator server-side as primary
  9. `content-migration-and-gap-plan.md` — current content state + 4-tier priority roadmap
  10. `implementation-roadmap-master.md` — 10-phase phased build plan from skeleton to Russian

**No code changes in this session block (pure planning).**

**Next step:** Phase 1 — run `/guide-content-qa` on 5 draft guides, publish them

---

## 2026-04-20 — Dubai Golden Visa property guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `golden-visa-dubai-property`
  - Title: "How to Get a Dubai Golden Visa Through Property (AED 2 Million Route)"
  - Category: visas | Price: AED 9,884.75 (main applicant) | Timeline: 4–8 weeks | Last updated: April 2026
  - 7 steps: property check → doc prep → valuation (if required) → DLD application → medical → Emirates ID → family sponsorship
  - Guide ID: b881b20c-e0df-45e3-b800-7dff8aa62269
  - Kept strictly separate from salary / entrepreneur / retirement Golden Visa routes

**Assumptions flagged:**
- Step 4 bundles DLD fees (AED 4,020) + residency permit (AED 2,856.75) + admin fees (AED 1,155) = AED 8,031.75 at submission. Actual timing of each fee may differ — confirm with DLD.
- Timeline "4–8 weeks" is an estimate; official DLD timelines are not specified in source material.
- Off-plan/mortgaged files noted as needing confirmation; not presented as universally approved.

**What was verified:**
- published=0 (draft)
- 7 steps with correct order, costs, and time_est
- Cost math: 8,031.75 + 700 + 1,153 = 9,884.75 ✓

**Next step:** Owner reviews in admin, runs /guide-content-qa, publishes if approved

---

## 2026-04-19 — Spouse visa group page created

**What changed:**
- `lib/guide-groups.ts` — added `spouse-dependent-visa-dubai` group config (same structure as child group)
- `app/(public)/guides/spouse-dependent-visa-dubai/page.tsx` (new) — identical pattern to child group page, GROUP_KEY adjusted
- `next.config.ts` — added two 307 redirects for spouse individual slugs → group URL with `?route=` param

**What was NOT changed:**
- `GuideTabs.tsx` — untouched
- `reader.ts` — untouched (`getGuideGroup` reused as-is)
- `StepCard.tsx` — untouched
- Any guide content — untouched

**What was verified:**
- Build: clean (0 errors, 13/13 pages)
- `/guides/spouse-dependent-visa-dubai` listed as ƒ (dynamic) in build output
- Both group pages (`child` and `spouse`) coexist correctly

**Routing:**
- `/guides/spouse-dependent-visa-dubai` → spouse group page, default Outside tab
- `/guides/spouse-dependent-visa-dubai?route=inside` → Inside tab
- `/guides/spouse-dependent-visa-dubai-outside-country` → 307 → `?route=outside`
- `/guides/spouse-dependent-visa-dubai-inside-country` → 307 → `?route=inside`

---

## 2026-04-19 — Spouse inside-country visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `spouse-dependent-visa-dubai-inside-country`
  - Title: "How to Sponsor a Spouse Residence Visa in Dubai Without Leaving the UAE"
  - Category: visas | Price: AED 2,700 – 3,200 | Timeline: 3–6 weeks | Last updated: April 2026
  - 7 steps: attestation → family file → inside-country entry permit → change of status → medical → Emirates ID → residence
  - Guide ID: f2e9ac9a-6194-44ce-bcfd-65a7f8c96961

**What was verified:**
- published=0 (draft)
- 7 steps with correct order, costs, and time_est

**Next step:** Owner reviews in admin, runs /guide-content-qa, publishes if approved

---

## 2026-04-19 — Spouse outside-country visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `spouse-dependent-visa-dubai-outside-country`
  - Title: "How to Sponsor a Spouse Residence Visa in Dubai from Outside the UAE"
  - Category: visas | Price: AED 1,800 – 2,200 | Timeline: 3–6 weeks | Last updated: April 2026
  - 7 steps: attestation → family file → entry permit → spouse arrival → medical → Emirates ID → residence
  - Medical step included (Step 5) — spouse route requires medical fitness test; correct distinction from child route
  - Sponsor-proof rule in Step 2: salary cert for free zone/government, labour contract for private sector
  - Guide ID: 5b394aa0-fbfe-4036-8ab7-20cee0e5c3dd

**What was verified:**
- published=0 (draft)
- 7 steps confirmed with correct step_order, costs, and time_est
- All field values match the spec exactly

**Next step:** Owner reviews in admin at /admin/guides/spouse-dependent-visa-dubai-outside-country, runs /guide-content-qa, then publishes if approved

---

## 2026-04-18 — Tab-based group guide page implemented

**What changed:**
- `lib/guide-groups.ts` (new) — `GUIDE_GROUPS` constant mapping parent slug to variant config (title, summary, category, variants array with slug/label/routeKey)
- `lib/db/reader.ts` — added `getGuideGroup(slugs[])` — fetches multiple guides without published check (group pages are not subject to individual publish gating)
- `app/(public)/guides/child-dependent-visa-dubai/page.tsx` (new) — server component, reads `?route=` from searchParams, calls `getGuideGroup`, renders `<GuideTabs>`; static route takes precedence over `[slug]` in Next.js
- `components/GuideTabs.tsx` (new) — client component; `useState(defaultRoute)` for instant tab switching; `router.replace(..., { scroll: false })` updates URL without page reload; renders static title/category/summary then dynamic price/timeline/audience/overview/steps per active tab; reuses `<StepCard>` unchanged
- `next.config.ts` — added two `permanent: false` redirects: old child slug URLs → parent group URL with `?route=` query param

**What was NOT changed:**
- `app/(public)/guides/[slug]/page.tsx` — untouched
- `components/StepCard.tsx` — untouched
- Guide content in DB — untouched
- Published status of any guide — untouched

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors, 12/12 pages)
- `employment-visa` remains static (●); group page is dynamic (ƒ) as expected
- Group page at `/guides/child-dependent-visa-dubai` — confirmed in build output

**Next step:** Start dev server, review tab UI, publish child guides when ready

---

## 2026-04-18 — Both child visa guides aligned and cleaned

**What changed:**
- Step titles standardized across both guides: "Open Family File at Amer", "Apply for Entry Permit", "Finalize Residence Visa" (dropped "the", "Child", "Inside-Country" qualifiers from titles — distinctions moved to WHAT text)
- WHERE field standardized: outside guide "Amer service center" → "Amer"; Step 1 "Varies by country; UAE MOFA for final step" → "UAE MOFA (final step)" in both
- Step 1 time_est standardized: "1–4 weeks (varies by country)" → "1–4 weeks (varies)" in both
- Step 1 WHAT aligned: both guides now use identical description of the attestation chain
- Step 1 ADVICE aligned: identical phrasing; em dash removed
- Step 2 doc list aligned: both guides now list same docs (Emirates ID original, passport, residence visa, child docs, white-background photo, Ejari, proof of income with sector split)
- Step 2 WARNING standardized: "Bring the original Emirates ID card. A copy or digital version is not accepted."
- Step 5 WHAT: removed "This fee covers a 2-year card" from outside WHAT; moved 2-year note to ADVICE in both
- Step 5 ADVICE aligned: "The Emirates ID is issued for 2 years. Track card dispatch via the ICA app." (both)
- Step 5 time_est standardized: "2–3 days (card delivered in 5–10 days)" (both)
- Step 6 ADVICE added to inside: "The child's passport is held briefly during stamping. Do not plan travel until it is returned."
- Step 6 WARNING sharpened in outside: vague "adequate remaining validity" → specific "6 months beyond intended expiry" (matching inside)
- Outside guide: audience updated to include "government sector" (was omitted despite Step 2 mentioning it)
- Outside guide: summary updated to remove "for private sector and free zone sponsors" suffix; added "No medical test required"
- Outside guide: overview em dash removed (para 2)
- Inside guide: summary updated to add "Covers document attestation" to coverage list
- Inside Step 3 WHAT: clarified entry permit is "inside-country" variant (moved qualifier from title to WHAT)
- Inside Step 4 ADVICE removed: "Change of status must be completed before..." was obvious sequencing info
- Inside Step 1 cost: fixed from "0" to "Varies by country" (was incorrect)
- Inside steps 2–6 cost: fixed from raw floats ("252.0") to proper text strings ("AED 252")

**What was verified:**
- Outside: 6 steps, all WHERE = "Amer" (except Step 1 = "UAE MOFA (final step)", Step 4 = "UAE port of entry")
- Inside: 6 steps, all WHERE = "Amer" (except Step 1 = "UAE MOFA (final step)")
- Both guides: published=0 (draft)

**Next step:** Owner reviews both drafts in admin, runs /guide-content-qa on each, then publishes if approved

---

## 2026-04-18 — Inside-country child dependent visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `child-dependent-visa-dubai-inside-country`
  - Title: "How to Sponsor a Child Dependent Visa in Dubai from Inside the UAE"
  - Category: visas | Price: AED 2,875 (govt fees, excl. attestation) | Timeline: 3–6 weeks
  - 6 steps: attestation → family file → inside-country entry permit → change of status → Emirates ID → residence
  - No medical step — correct for standard child route
  - Sponsor-proof rule in Step 2: salary cert for free zone/govt, labour contract for private sector
  - Change of status step (Step 4, AED 639) distinguishes this from the outside-country route
  - Attestation step cost set to 0 (external/varies by country — excluded from guide total)

**What was verified:**
- Guide inserted as published=0 (draft, not live on public site)
- 6 steps confirmed with correct step_order, costs, and time_est
- Guide ID: 77b500b7-7ea3-4635-b102-fa4674b4dad8

**Next step:** Owner reviews both child visa drafts in admin, runs /guide-content-qa on each, then publishes if approved

---

## 2026-04-18 — Child dependent visa guide created (draft)

**What changed:**
- DB: new guide inserted as draft — `child-dependent-visa-dubai-outside-country`
  - Title: "How to Sponsor a Child Dependent Visa in Dubai from Outside the UAE"
  - Category: visas | Price: AED 1,586 (govt fees, excl. attestation) | Timeline: 3–6 weeks
  - 6 steps: attestation → family file → entry permit → child arrival → Emirates ID → residence
  - No medical step — correct for standard child route
  - Private sector/free zone sponsor document split noted in Step 2 advice
  - Attestation country-variance noted in Step 1 warning and overview

**What was verified:**
- Guide inserted as published=0 (draft, not live on public site)
- 6 steps confirmed in DB with correct order, costs, and non-empty timeEst
- employment-visa guide unchanged (still published)

**Correction applied (2026-04-18):** Guide was accidentally published; unpublished back to draft.
Step 2 sponsor-proof advice updated: salary certificate for free zone/government sector, labour contract for private sector, partner/investor noted as separate case.

**Next step:** Owner reviews draft in admin, runs /guide-content-qa, then publishes if approved

---

## 2026-04-17 — guide-content-qa skill created

**What changed:**
- `.claude/commands/guide-content-qa.md` (new) — Claude Code slash command skill
  that audits any guide draft against the project's locked content writing standard;
  reads from SQLite when given a slug, or audits pasted content; produces structured
  verdict (STRONG / NEEDS TIGHTENING / NEEDS REWRITE) with key issues, exact
  problem quotes, example rewrites, and final publish recommendation

**What was verified:**
- Skill file parses correctly (markdown, no syntax issues)
- Manual audit of `employment-visa` using the skill's DB read logic: verdict STRONG
- Three minor issues found: Step 5 `where` parenthetical, summary 3 chars over soft 160-char limit

**Next step:** Second article — Dependent / Family Visa guide (children)

---

## 2026-04-17 — Claude Project knowledge pack created

**What changed:**
- `CLAUDE_PROJECT_KB.md` (new) — full knowledge base snapshot for uploading into
  a Claude Project: stack, architecture, schema, phases, live guide content with
  step table, visual design system, content writing standard, validation rules,
  open decisions, next step, memory workflow
- `CLAUDE_PROJECT_CHAT_BRIEF.txt` (new) — paste-ready chat starter (~200 words)
  for a new conversation inside the Claude Project
- `CLAUDE_PROJECT_INSTRUCTIONS.txt` (new) — suggested Claude Project Instructions
  text: tells Claude to trust repo files, not invent architecture, preserve hard
  rules, flag open decisions, follow content writing standard
- `.claude/memory-guard.sh` — added Check 2: warns when PROJECT_STATE.md is
  newer than CLAUDE_PROJECT_KB.md (KB may be stale); also updated Check 1 warning
  to mention CLAUDE_PROJECT_KB.md in the update list
- `CLAUDE.md` — added CLAUDE_PROJECT_KB.md to the memory maintenance file table

**What was verified:**
- Build: clean (0 errors, 11/11 pages)
- Guard script: bash syntax clean (exits 0, two independent checks)

**Next step:** Second article — Dependent / Family Visa guide (children)

---

## 2026-04-17 — Full project-state sync and handoff hardening

**What changed:**
- `PROJECT_STATE.md` — complete rewrite: accurate phase status table, current guide
  content documented, real blockers, category taxonomy flagged as not owner-approved
- `ROADMAP.md` — fixed duplicate "Current Phase" headings; moved Phase 4.5 and 4.6
  to Completed with accurate descriptions; added "Current Priority" section with
  next content task (dependent visa guide)
- `DECISIONS.md` — category taxonomy entry changed from "locked" to "defined but
  not owner-approved as final" per explicit owner instruction
- `CHECKPOINTS.md` — added CP-05 (Phase 4.5 + 4.6 verified stable); corrected
  CP-04 branch/commit note from "uncommitted" to "committed"
- `HANDOFF_PROMPT.md` — complete rewrite: accurate dates, Phase 4.5 + 4.6 listed,
  real guide content described, 10 rules list including new timeline and writing standard rules
- `NEW_CHAT_TRANSFER.txt` — complete rewrite: accurate phase table, current content
  state, correct next step, all 10 rules
- `SEO_STRATEGY.md` — content quality bar updated: required timeline/timeEst
  fields flagged, writing standard reference added

**What was NOT changed (already accurate):**
- `CLAUDE.md` — content writing standard was already correct
- `docs/article-template.md` — already updated in previous session
- `SESSION_LOG.md` — entries were accurate

**Next step:** Second article — Dependent / Family Visa guide (children)

---

## 2026-04-13 — Content writing standard + final visual polish

**What changed:**
- `CLAUDE.md` — added "Content Writing Standard (locked)" section: field-level
  rules (title, summary, overview, steps), style rules (no theatrical framing, no
  em-dashes, no filler), SEO rules for content. Binding rule for all future guides.
- `docs/article-template.md` — rewrote to align field specs with writing standard
  (summary 1–2 sentences, overview 2 paragraphs, step what 1–2 sentences);
  updated example outline to use real employment-visa guide as reference;
  removed the old loose "3–6 sentences" overview spec
- `app/(public)/guides/[slug]/page.tsx` — replaced plain "Need help?" text link
  with a small navy card (bg-navy, rounded-2xl, brass link text). Clear premium
  CTA anchor at the bottom of every guide.
- `components/TopicCard.tsx` — card surface: `bg-white border-gray-100` →
  `bg-stone-50 border-stone-200 hover:stone-100`; category pill: `bg-gray-100
  text-gray-400` → `bg-brass/[.08] text-brass/80`

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors)
- Rendered HTML: `bg-navy`, `text-brass`, `bg-brass` tokens all present
- CLAUDE.md writing standard now enforces field-level length limits for all future guides

**Next step:** Owner decides — Phase 5 (RU), Phase 7 (sitemap), or more guide content

---

## 2026-04-13 — Real employment-visa guide + timeline required

**What changed:**
- `scripts/update-employment-visa.ts` (new) — replaced seeded sample with real production
  content: title "How to Get an Employment Visa in Dubai Without Leaving the UAE",
  inside-country route, 8 steps with exact Tasheel/Amer/Tawjeeh fees, SEO-focused
  summary and overview, addresses as "Any [center] branch in Dubai"
- DB: guide timeline updated to `2–4 weeks`; all 8 step `time_est` set to `2–3 days`;
  overview text "4–6 weeks" corrected to "2–4 weeks"
- `components/admin/GuideFormFields.tsx` — `timeline` field: added `required` + label `*`
- `components/admin/StepCard.tsx` — `timeEst` field: added `required` + label `*`,
  placeholder updated to `2–3 days`
- `app/admin/actions.ts` — server-side guards: `createGuideAction` and
  `updateGuideAction` throw if `timeline` empty; `updateStepAction` throws if
  `timeEst` empty

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors)
- DB confirmed: guide timeline = `2–4 weeks`, all 8 steps = `2–3 days`
- Public page HTML: `2–4 weeks` ×2, `2–3 days` ×16 (8 steps, rendered twice each)
- Overview body text consistent with guide timeline field

**Next step:** Owner decides — Phase 5 (RU public rendering), Phase 7 (sitemap/structured data), or more content

---

## 2026-04-12 — Phase 4.5: public visual identity polish

**What changed:**
- `app/globals.css` — `@theme` block with `--color-navy: #1B2E4B` and `--color-brass: #B5935A`
- `components/CategoryIcon.tsx` (new) — 5 inline SVG micro-icons (14×14, 1.5px stroke,
  round caps, currentColor): visas/passport, company-setup/building, hiring/person,
  living/house, government/seal
- `components/StepCard.tsx` — step number bubble: `bg-gray-900` → `bg-navy`;
  advice block: `bg-blue-50/60 text-blue-600` → `bg-navy/[.06] text-navy`
- `components/Hero.tsx` — value cards: added `border-l-2 border-brass` left accent;
  section divider: `border-gray-100` → `border-stone-200`
- `components/TopicCard.tsx` — category pill now inline-flex with brass CategoryIcon
  left of text; hyphen-to-space display fix for compound category names
- `components/GuideHeader.tsx` — category label wrapped in flex row with brass
  CategoryIcon; hyphen-to-space fix
- `app/(public)/guides/[slug]/page.tsx` — brass overline (`w-6 h-0.5 bg-brass`)
  above Overview and Steps h2 labels; section border: `border-stone-200`

**What was verified:**
- Production build: clean (0 errors, 0 TypeScript errors)
- Rendered HTML confirmed: `bg-navy`, `bg-brass`, `border-l-2 border-brass`,
  `aria-hidden="true"` SVGs, `<svg width="14"` all present in page output
- Header brand mark correctly skipped per scope

**Next step:** Checkpoint commit for Phase 4 + 4.5, then Phase 5 or 7 (owner decides)

---

## 2026-04-12 — Memory sync + Phase 4.5 design plan

**What changed:**
- Fixed all stale references across PROJECT_STATE.md, HANDOFF_PROMPT.md,
  NEW_CHAT_TRANSFER.txt (removed "step management not built", updated next step)
- Added CP-04 to CHECKPOINTS.md
- Added Phase 4.5 scope to ROADMAP.md

**What was verified:**
- All memory files internally consistent
- No stale "Phase 4 is next" references remaining

**Next step:** Implement Phase 4.5 visual polish after owner approval of plan

---

## 2026-04-12 — Phase 4: inline step CRUD

**What changed:**
- `lib/db/writer.ts` — added `getStepsByGuideId(guideId)`
- `app/admin/actions.ts` — added `createStepAction`, `updateStepAction`,
  `deleteStepAction` (with contiguous renumber), `reorderStepAction` (swap)
- `components/admin/StepCard.tsx` (new) — client component, per-step form with
  all 14 fields (cost, timeEst, EN×6, RU×6), Save/Delete/Up/Down buttons
- `components/admin/StepList.tsx` (new) — client component, step list + Add step
- `app/admin/guides/[slug]/page.tsx` — fetches steps, renders `<StepList>` as
  sibling below `<GuideEditForm>` (no nested forms)
- Step actions use `router.refresh()` pattern — no redirect, guide form unsaved
  state is fully preserved across step mutations

**What was verified:**
- Production build clean (0 errors, 0 TypeScript errors)
- SQLite mutations tested: create appends at max+1, delete renumbers remaining
  contiguously, reorder swaps adjacent stepOrder integers
- 5 seeded steps for employment-visa confirmed present after restore

**Next step:** Checkpoint commit, then Phase 5 or Phase 7 (owner decides)

---

## 2026-04-12 — Memory system and Phase 3A checkpoint

**What changed:**
- Created project-memory workflow: `NEW_CHAT_TRANSFER.txt`, `SESSION_LOG.md`,
  `CHECKPOINTS.md`, `PROJECT_STATE.md`, `DECISIONS.md`, `ROADMAP.md`,
  `SEO_STRATEGY.md`, `HANDOFF_PROMPT.md`
- Added Claude Code hook in `.claude/settings.json` + `.claude/memory-guard.sh`
  to warn when source files change without memory file updates
- Updated `CLAUDE.md` with project-memory maintenance rule, category taxonomy,
  language rules, React key rule

**What was verified:**
- Production build: clean (0 errors, 0 warnings, 11/11 pages)
- SQLite write paths: save draft, unpublish, save and publish — all confirmed correct
- React key audit: no duplicate sibling keys anywhere in the codebase
- Public page reads fresh data from SQLite after a DB write

**Next step:** Phase 4 — step management in the admin

---

## 2026-04-12 — Fix duplicate React key warning

**What changed:**
- Removed `key={savedTs}` from `<SavedBanner>` inside `GuideEditForm`
- Removed `key={savedTs ?? "init"}` from `<form>` inside `GuideEditForm`
- Removed now-unnecessary `useEffect` that manually cleared dirty state
- Root cause: both siblings had value `savedTs` when it was set — collided

**What was verified:**
- Static code audit: only one `key={saved ?? "init"}` remains, on the outer
  `<GuideEditForm>` in the page — inner elements carry no keys
- Production build: clean

**Next step:** Phase 3A verification pass + checkpoint

---

## 2026-04-12 — Fix owner-workflow publish bug (Phase 3A complete)

**What changed:**
- Merged separate Publish form into the main edit form using `name="intent"`
  (`value="draft"` and `value="publish"` submit buttons)
- `updateGuideAction` now reads `intent` and spreads `{ published: true }` when
  `intent === "publish"`
- Unpublish remains a safe standalone form (no field data at risk)
- Created `components/admin/GuideEditForm.tsx` (client component):
  dirty tracking via `useRef` + `useState`, `beforeunload` guard, back-nav
  confirm dialog, "Unsaved changes" indicator
- Simplified `app/admin/guides/[slug]/page.tsx` to thin server component
- Updated `CLAUDE.md` with Admin QA Rules section

**What was verified:**
- Publish no longer discards unsaved field edits
- Save draft preserves published state correctly

**Next step:** Fix the React key bug introduced by this change

---

## 2026-04-12 — Fix stale defaultValue after save redirect

**What changed:**
- `updateGuideAction` redirects to `/admin/guides/${slug}?saved=${Date.now()}`
  (timestamp forces URL change on every save)
- Edit page passes `key={saved ?? "init"}` to `<GuideEditForm>` so the
  component fully remounts when the URL changes
- Added `SavedBanner` component (3s auto-hide green success banner)

**What was verified:**
- After saving, the edit form shows the newly saved values (not stale inputs)
- DB write was always correct — this was a React rendering issue only

**Next step:** Fix publish discarding unsaved changes

---

## 2026-04-12 — Phase 3A: Guide CRUD

**What changed:**
- `app/admin/guides/new/page.tsx` + `createGuideAction`
- `app/admin/guides/[slug]/page.tsx` + `updateGuideAction`, `setPublishedAction`,
  `deleteGuideAction`
- `components/admin/GuideFormFields.tsx` (shared field inputs, server component)
- `components/admin/DeleteGuideButton.tsx`
- `lib/revalidate.ts` — calls `revalidatePath` for guide + list + home after save
- ISR on-demand revalidation wired to every save action

**What was verified:**
- Create guide → appears in guide list → publishes to public site
- Edit guide → public page updates after save
- Delete guide → redirects to list, public page gone

**Next step:** Fix stale defaultValue on same-URL redirect

---

## 2026-04-12 — Rename middleware.ts → proxy.ts

**What changed:**
- Renamed `middleware.ts` to `proxy.ts` (Next.js 16 convention)

**What was verified:**
- Build no longer shows deprecation warning
- Route protection still works

---

## 2026-04-12 — Fix bcrypt hash corruption by dotenv-expand

**What changed:**
- Escaped all `$` as `\$` in `ADMIN_PASSWORD_HASH` in `.env.local`
- Added `scripts/debug-auth.ts` — reads `.env.local` raw, bypasses dotenv-expand,
  calls `bcryptjs.compare()` for diagnosis

**What was verified:**
- `debug-auth.ts` confirmed hash length 60, `starts with $2b$: true`
- Admin login works correctly

---

## 2026-04-12 — Phase 2: Admin foundation

**What changed:**
- `lib/auth.ts` — NextAuth.js v4 + CredentialsProvider + bcryptjs
- `app/admin/layout.tsx` — isolated layout, no public Header
- `app/admin/login/page.tsx` — credentials form with `signIn`
- `app/admin/guides/page.tsx` — lists all guides (draft + published)
- `proxy.ts` — route protection for `/admin/guides` and subpaths
- `scripts/generate-hash.ts` — generates bcrypt hash for `.env.local`

**What was verified:**
- Login works with correct credentials
- Wrong credentials show error
- `/admin/guides` redirects to login when unauthenticated

**Next step:** Phase 3A — guide CRUD

---

## 2026-04-12 — Phase 1: SQLite migration

**What changed:**
- Installed `better-sqlite3`, `drizzle-orm`, `drizzle-kit`, `@types/better-sqlite3`
- `lib/db/schema.ts` — Drizzle schema (guides + steps, bilingual flat columns)
- `lib/db/connection.ts` — SQLite singleton (WAL mode, FK enforcement)
- `lib/db/reader.ts` — public read-only queries
- `lib/db/writer.ts` — admin queries
- `scripts/seed.ts` — seeded employment-visa guide from old MDX
- Updated public guide page to render from DB
- Deleted MDX files, `metadata.ts`, `@next/mdx` config
- Added `serverExternalPackages: ["better-sqlite3"]` to `next.config.ts`

**What was verified:**
- Public site output identical before and after migration
- Employment-visa guide renders correctly from SQLite
- Build clean, zero SEO regression

**Next step:** Phase 2 — admin foundation
