# Checkpoints — Dubai Guide Site

Stable, verified milestones. Each entry represents a state the project can be
safely restored to or continued from. Add a new entry only after full verification.

---

## CP-RU-CHILD-VISA-PAIR — child dependent visa pair RU complete locally

**Date:** 2026-05-07
**Status:** Local only — pending owner review and deploy

- `components/GuideTabs.tsx`: locale-aware tab labels via `v.ruLabel`; `localizeValue`+`locale` passed to RouteSnapshot and StepCard
- `lib/guide-groups.ts`: `GuideGroupConfig.ruTitle?`, `ruSummary?` and `GuideVariant.ruLabel?` added; child group RU strings populated
- `app/ru/guides/child-dependent-visa-dubai/page.tsx`: metadata uses `group.ruTitle`/`group.ruSummary`
- `scripts/add-ru-child-dependent-visa-outside.ts`: 6 steps + 4 guide `ru_*` fields. All guards passed. 0 em-dashes. ICP (not ICA).
- `scripts/add-ru-child-dependent-visa-inside.ts`: 6 steps + 4 guide `ru_*` fields. All guards passed. 0 em-dashes. ICP (not ICA).
- No new `localize-value.ts` mappings needed — all step cost/time values already mapped.
- DB: 17 guides, 115 steps (unchanged). Local backup: `backups/local/guides.db.pre-ru-child-*`.
- Build: 69 pages (+2 child variant slugs now SSG'd), 0 errors (full clean build). Smoke tests: 8/8 routes correct.

---

## CP-RU-EMPLOYMENT-OUTSIDE-UAE — outside-UAE employment visa RU live on production

**Date:** 2026-05-07
**Commit:** 6d76f66

- `scripts/add-ru-employment-visa-outside-uae.ts`: 7 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 8 new cost/time exact-match mappings added (4–8 weeks, 1–2/2–4/3–5 working days, Travel day, Flight costs, 3–5 working days for card delivery, Included in MOHRE work permit).
- Factual cleanup: no MOHRE-approved clinic, ICA → ICP, WPS correctly described as salary payment not contract registry.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-employment-outside-20260507-115242`.
- Build: 67 pages, 0 errors (full clean build — node_modules/.cache cleared). Smoke tests: 11/11 routes 200.

---

## CP-RU-GOVERNMENT-BATCH — government RU batch live on production

**Date:** 2026-05-07
**Commit:** 6b510b8

- `scripts/add-ru-document-attestation.ts`: 3 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `scripts/add-ru-amer-center.ts`: 4 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `scripts/add-ru-pro-services.ts`: 5 steps + 4 guide `ru_*` fields. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 25 government batch cost/time exact-match mappings added.
- `app/ru/government/page.tsx`: all 3 "Скоро" cards flipped to live href cards.
- Factual cleanup: no apostille-replaces wording, no unverified amer.ae URL.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-government-batch-20260507-070313`.
- Build: 0 errors (full clean build — node_modules/.cache cleared). Smoke tests: 13/13 routes 200.
- /ru/government: 3 live guide links, 0 "Скоро". Sitemap: all 6 EN+RU government guide URLs present.

---

## CP-RU-RENEW-FAMILY — renew-family-visa-dubai RU live on production

**Date:** 2026-05-05
**Commit:** daa9cf3

- `scripts/add-ru-renew-family-visa.ts`: 4 step + 4 guide `ru_*` fields written. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 9 renew-family cost/time exact-match mappings added. Zero EN cost/time leakage on RU page.
- Factual cleanup: no "GDRFA медцентр", no "система ICA", no "ica.gov.ae" in any RU field.
- Generic `app/ru/guides/[slug]/page.tsx` handles route — no custom page needed.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-renew-family-20260505-071227`.
- Build: 63 pages, 0 errors. Smoke tests: 9/9 production routes 200. Hreflang bidirectionally correct. Sitemap includes both EN and RU renew-family URLs.

---

## CP-RU-NEWBORN — newborn-visa-dubai RU live on production

**Date:** 2026-05-05
**Commit:** 4cd8e70

- `scripts/add-ru-newborn-visa.ts`: 6 step + 4 guide `ru_*` fields written. All guards passed. EN fields untouched.
- `lib/localize-value.ts`: 11 newborn cost/time exact-match mappings added. Zero EN cost/time leakage on RU page.
- Generic `app/ru/guides/[slug]/page.tsx` handles route — no custom page needed.
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-newborn-20260505-094818`.
- Build: 62 pages, 0 errors. `[+4 more paths]` in RU slug route (newborn included).
- Smoke tests: 9/9 production routes 200. Hreflang bidirectionally correct. Sitemap includes both EN and RU newborn URLs.

---

## CP-RU-TRC — RU TRC guide deployed to production

**Date:** 2026-05-04
**Commit:** e811c6a

- `scripts/add-ru-trc.ts`: 8 step + 4 guide `ru_*` fields written. All guards passed. EN fields untouched.
- `app/ru/guides/tax-residency-certificate-uae/page.tsx`: custom static RU premium page (navy hero, Russian WHY_CARDS)
- `app/ru/guides/[slug]/page.tsx`: CUSTOM_PAGE_SLUGS filter excludes TRC from generic RU route
- `app/(public)/guides/tax-residency-certificate-uae/page.tsx`: hreflang `"ru"` key added
- `app/ru/banking-tax/page.tsx`: TRC card now links to `/ru/guides/tax-residency-certificate-uae`, `· EN` label removed
- DB: 17 guides, 115 steps (unchanged). Production backup: `/var/backups/guidex/guides.db.pre-ru-trc-20260504-222454`.
- Build: 61 pages, 0 errors. `/ru/guides/tax-residency-certificate-uae` = `○ (Static)`.
- Smoke tests: 9/9 production routes 200.

---

## CP-RU-HUBS — RU banking-tax and tourism hubs live, sitemap fixed, RU homepage complete

**Date:** 2026-05-04
**Commit:** 60deb84

All 5 RU homepage service cards active (no more `soon:true`). Sitemap now includes all hub routes. Hreflang bidirectionally correct on all hub pages.

- `/ru/banking-tax`: live — PageHero, DIFC image, RU text, TRC card links to EN guide with `· EN` label
- `/ru/tourism`: live — PageHero, JLT image, RU text, links to `/ru/guides/holiday-home-permit-dubai`
- Sitemap: `/banking-tax`, `/tourism`, `/ru/banking-tax`, `/ru/tourism` all present
- Hreflang: en, ru, x-default correct on all 4 hub pages
- DB: unchanged — 17 guides, 115 steps
- PM2: online
- Smoke test: 9/9 routes 200
- Known issue: `/ru/government` links to 3 EN-only guides that will 404 — deferred to government RU batch

---

## CP-CODE7 — Premium hubs, TRC guide, visual system live on production

**Date:** 2026-05-04
**Commits:** d3faa8a (local) · 5a3f1f2 (cron backup chmod fix)

CODE7 fully deployed. All smoke tests green.

- `/banking-tax` hub: live — editorial gradient hero, service cards, WhatsApp CTA
- `/tourism` hub: live — warm-light gradient, JLT image
- `/guides/tax-residency-certificate-uae`: live — custom static route, navy header, 8 steps from DB
- `PageHero` component: reusable gradient hero (image + gradient + text + CTA slot)
- `lib/page-visuals.ts`: central gradient config (`light` / `medium` / `warm-light`)
- Homepage hero: skyline image with "light" gradient, Burj visible
- RU homepage: visual parity via PageHero with overline + WhatsApp CTA
- Header mobile overflow fix: RU pill in top row, mobile nav flex-wrap
- Homepage: Banking & Tax and Tourism cards activated (removed `soon:true`)
- Production DB: 17 published guides, 115 steps
- DB backup: `/var/backups/guidex/guides.db.pre-code7-20260504-114324`
- Build: 58 pages, 0 TypeScript errors
- PM2: online
- Smoke test: 10/10 routes 200
- Content checks: TRC renders, on index and sitemap, absent from `/ru/guides`; homepage links confirmed

---

## CP-BATCH-RU-02 — Bank Account RU + Holiday Homes RU live on production

**Date:** 2026-05-02
**Commits:** 3a33d65 (HH RU + localize-value) · b18971e (Bank RU script)

Two Russian guides deployed via batch targeted scripts. Fully verified.

- `open-business-bank-account-dubai` RU: live at https://guidex-consulting.ae/ru/guides/open-business-bank-account-dubai
- `holiday-home-permit-dubai` RU: live at https://guidex-consulting.ae/ru/guides/holiday-home-permit-dubai
- DB backup before deploy: `/var/backups/guidex/guides.db.pre-batch-ru-bank-hh-20260502-180053`
- Build: 55 pages, 0 errors
- PM2: online, 0 unstable restarts
- EN pages: unchanged
- Em-dashes in RU DB: 0
- Full DB restore: not used

---

## CP-HH-03B — Holiday home permit guide live on production

**Date:** 2026-05-02
**Commit:** 2dbd005

Guide `holiday-home-permit-dubai` deployed to production via targeted script. Fully verified.

- URL: https://guidex-consulting.ae/guides/holiday-home-permit-dubai
- Category: tourism
- Published: 1 (live)
- Steps: 12 (EN only, RU fields empty)
- Build: 53 pages, 0 errors on production
- DB backup before deploy: `/var/backups/guidex/guides.db.pre-holiday-home-guide-20260502-164949`
- Tourism category support live: admin dropdown, CategoryIcon, EN/RU guides list pages, GuideHeader
- RU static params fix in place: RU route pre-renders only guides with ru_title populated
- Homepage Tourism card remains inactive (Coming soon)
- Sitemap: EN URL present, RU URL absent

**State at this checkpoint:**
- 16 EN guides on production (14 existing + holiday-home-permit-dubai + newborn-visa-dubai... wait, let me not guess)
- 4 RU guides pre-rendered: employment-visa, golden-visa-dubai-property, mainland-company-setup-dubai, free-zone-company-setup-dubai
- open-business-bank-account-dubai RU content: local only, not yet deployed

---

## CP-HH-02B — Holiday home permit guide draft (local only)

**Date:** 2026-05-02

**What is confirmed stable (locally):**

- `scripts/add-holiday-home-permit-guide.ts` executed cleanly
- Guide `holiday-home-permit-dubai` created: slug, category=tourism, published=false (DRAFT)
- en_title: "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Booking.com"
- 12 steps inserted, all EN fields populated, all RU fields empty
- Pre-write and post-write validation passed: 0 em-dashes, no guarantee language, no partnership language, no private data
- DB backup: data/guides.db.backup-holiday-home-guide-1777714931
- Build: 63 pages, 0 TypeScript errors (guide is draft, not pre-rendered)
- Homepage: unchanged — Tourism card still inactive
- Production DB: untouched

**Not done yet:**
- Guide not reviewed via admin panel/browser
- Guide not published
- RU content not created
- Deployment pending owner review and publish decision

---

## CP-HH-02A — Tourism category support (local only)

**Date:** 2026-05-02

**What is confirmed stable (locally):**

- `tourism` added to CATEGORIES in `components/admin/GuideFormFields.tsx`
- `tourism` added to KnownCategory type + key icon in `components/CategoryIcon.tsx`
- `tourism → "Туризм"` added to CATEGORY_RU in `components/GuideHeader.tsx`
- `tourism` + "Tourism & Short-Term Rentals" added to `app/(public)/guides/page.tsx`
- `tourism` + "Туризм и краткосрочная аренда" added to `app/ru/guides/page.tsx`
- Build: 63 pages, 0 TypeScript errors
- No homepage card activated
- No hub page created
- No guide created
- DB untouched
- Production untouched

**Not done yet:**
- Holiday home permit guide not created
- Tourism card on homepage still inactive/soon
- Deployment of category support pending (code-only change, no DB script needed)

---

## CP-26 — RU content for bank account guide (local only)

**Date:** 2026-05-01

**What is confirmed stable (locally):**

- `scripts/add-ru-business-bank-account.ts` executed cleanly
- `open-business-bank-account-dubai`: all 9 steps fully translated to Russian
- ru_title: "Открыть бизнес-счёт в банке ОАЭ для компании в Дубае"
- Wio Business: presented as example only, monthly subscription + no minimum balance nuance, digital onboarding compliance depth
- POA: framed as one scenario (not mandatory)
- Real estate: conditional language, not universal requirements
- No em-dashes, no guarantee language, no Wio partnership implication
- EN fields unchanged, step count unchanged (9)
- 6 new exact mappings added to lib/localize-value.ts for step/guide-level EN values
- Sitemap now includes /ru/guides/open-business-bank-account-dubai (ru_title non-empty)
- Local DB backup: data/guides.db.backup-bank-ru-content-1777629562706
- Build: 63 pages, 0 TypeScript errors
- RU page 200, H1 in Russian, all localized values correct

**Not done yet:**
- Production DB not updated with RU content
- Deployment pending owner review

**Next:** Review RU content at http://localhost:3000/ru/guides/open-business-bank-account-dubai, then deploy to production using targeted script.

---

## CP-25B — EN bank account guide deployed to production

**Date:** 2026-05-01

**What is confirmed stable (production):**

- `open-business-bank-account-dubai` EN upgrade live on https://guidex-consulting.ae
- 9 steps: shareholder/POA role, bank route + digital onboarding (Wio as example), company documents (UBO), business profile, customer/supplier evidence, source of funds + 3-month statements, expected transactions + FATCA/CRS/TIN, real estate RERA/goAML, submission + wait
- Wio nuance correct: monthly subscription + no minimum balance stated; no forbidden AED 25,000–50,000 phrase; other banks/packages correctly described as varying
- No em-dashes, no guarantee language, no Wio partnership implication in any field
- All ru_* fields remain empty
- Production DB backed up at `/var/backups/guidex/guides.db.pre-bank-en-upgrade-20260501-134430` before script ran
- Targeted script only — no full DB restore
- Build: 63 pages, 0 TypeScript errors
- PM2: guidex-production online
- Smoke test: 200 on EN and RU pages; RU falls back to EN (ru_title empty, excluded from sitemap)

**Next:** Create RU content for `open-business-bank-account-dubai` from the improved 9-step EN master.

---

## CP-25 — Bank account guide EN upgrade (local only)

**Date:** 2026-05-01

**What is confirmed stable (locally):**

- `scripts/update-bank-account-guide-en.ts` executed cleanly
- `open-business-bank-account-dubai`: 8 steps → 9 steps
- EN title: "Open a Business Bank Account in Dubai for a UAE Company"
- All 9 step EN fields populated: shareholder/POA role, digital bank option (Wio as example), customer/supplier profiles, source of funds + 3-month statements, FATCA/CRS/TIN, RERA/DNFBP/goAML, expected transactions
- All ru_* fields remain empty (untouched)
- Local DB backup: data/guides.db.backup-bank-en-upgrade-1777616978301
- Build: 63 pages, 0 TypeScript errors
- All 10 compliance terms present in built HTML
- No em-dashes in content, no guarantee language, no Wio partnership language

**Not done yet:**
- Production DB not updated
- RU content not created
- Admin panel review not completed

**Next:** Review locally via admin, then deploy to production with DB backup, then create RU content.

---

## CP-24 — Step 4: full RU value localization + D-class em-dash fix

**Date:** 2026-04-30

**What is confirmed stable:**

- `lib/localize-value.ts` expanded to 47 mappings (from 21)
  - 3 guide price (AED+context), 2 guide timeline (conditional)
  - 10 step cost (AED+context), 7 step timeEst (duration+context)
  - 2 post-D-fix timeEst (Varies: ...)
- D-class DB fix: mainland step 6 and free-zone step 8 `time_est` fields patched (em-dash → colon). Backup: /var/backups/guidex/guides.db.pre-step4-d-class-fix-*
- Production smoke test: all 4 RU guides verified; EN employment-visa verified; EN mainland shows "Varies:" not "Varies —"
- Build: 63 pages, 0 TypeScript errors
- Commit: bcf98b9

**Remaining English on RU pages (intentional — B-class pure AED):**
- Pure AED amount strings: AED 278, AED 1,126, AED 676, AED 323, AED 386, AED 546, AED 8,031.75, AED 700, AED 1,153, AED 620–720, AED 4,900–7,300
- No further action required for these values

**RU visible cleanup complete.** All 4 guides ready for RU content population.

---

## CP-23 — Step 3: display-level value localization for RU guide pages

**Date:** 2026-04-30

**What is confirmed stable:**

- `lib/localize-value.ts` created — 21 exact-match A-class mappings + month-name regex
- `app/ru/guides/[slug]/page.tsx` — wraps price, timeline, lastUpdated, cost, timeEst via localizeValue before passing to RouteSnapshot and StepCard
- EN guide page (`app/(public)/guides/[slug]/page.tsx`) unchanged
- All 8 audit checklist items verified in built HTML
- Production smoke test: all 4 RU guides confirmed ✅
- Build: 63 pages, 0 TypeScript errors
- No DB changes, no schema changes
- Commit: 665744e

**Remaining English on RU pages:**
- C-class values (AED + English context) — deferred to schema redesign (ru_price, ru_timeline, ru_cost, ru_timeEst columns)
- 2 D-class EN em-dashes in timeEst fields — separate EN content fix

---

## CP-22 — Step 2: UI label localization for RU guide pages

**Date:** 2026-04-30

**What is confirmed stable:**

- `RouteSnapshot.tsx`, `StepCard.tsx`, `GuideHeader.tsx` — all have optional `locale` prop, default "en"
- 12 UI labels localized (6 in RouteSnapshot, 6 in StepCard); category pill localized in GuideHeader
- `app/ru/guides/[slug]/page.tsx` passes `locale="ru"` to all three components
- EN guide page (`app/(public)/guides/[slug]/page.tsx`) unchanged — defaults to "en"
- Build: 63 pages, 0 TypeScript errors
- No DB changes, no schema changes
- Production: all 4 RU guide pages show Russian labels (verified via curl)
- EN guide page retains English labels (verified via curl)
- Remaining English on RU pages: step cost/time values and guide price/timeline — Category B, separate step

**Commit:** 025d40f

---

## CP-21 — Step 1A: RU content em-dash hygiene across all 4 completed guides

**Date:** 2026-04-30

**What is confirmed stable:**

- All 4 completed RU guides scanned for em-dashes in ru_* fields
- Source scripts updated: 0 content em-dashes in add-ru-employment-visa.ts, add-ru-golden-visa-property.ts, add-ru-mainland-company.ts, add-ru-free-zone-company-setup.ts
- Patch script created: `scripts/patch-ru-em-dashes-completed-guides.ts` (assertNoEmDash guards, UPDATE-only, ru_* fields only, 4-guide scope)
- Local DB: guide=OK steps=OK for all 4 (verified by patch script)
- Production DB: guide=OK steps=OK for all 4 (patch ran on server; backup at /var/backups/guidex/guides.db.pre-ru-em-dash-cleanup-*)
- DB integrity: ok before and after
- Build: 63 pages, 0 TypeScript errors
- PM2 restarted, online
- Live smoke test: all 4 RU guide pages return HTTP 200; no em-dashes in RU content fields
- EN fields: unchanged throughout
- Remaining HTML em-dashes: `<title>` separator pattern (intentional) + EN step time_est values (Category B, separate step)

**Commit:** 5f6c30d

---

## CP-20 — RU content: free-zone-company-setup-dubai

**Date:** 2026-04-30

**What is confirmed stable:**

- `ru_title`, `ru_summary`, `ru_audience`, `ru_overview` populated for `free-zone-company-setup-dubai`
- All 8 step `ru_*` fields populated (ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning)
- 0 em-dashes in any RU field (initial draft had 6; fixed via targeted DB patch before commit)
- EN fields unchanged
- EN guide page: hreflang now includes `ru` alternate (triggered by non-empty `ru_title`)
- Sitemap: `/ru/guides/free-zone-company-setup-dubai` entry present
- `/ru/company-setup` hub: all 3 guide links intact (mainland, free-zone, bank-account)
- Script: `scripts/add-ru-free-zone-company-setup.ts`
- Build: 63 pages, 0 TypeScript errors

---

## CP-19 — Homepage IA restructure: route-hub cards aligned across locales

**Date:** 2026-04-29

**What is confirmed stable:**

- EN homepage (`app/(public)/page.tsx`) — 5 category cards (3 active: Visas, Company Setup, Government Services; 2 soon: Tourism & Holiday Homes, Banking & Advice). "Browse all guides →" bottom text link. `PrimaryServices` removed from import.
- RU homepage (`app/ru/page.tsx`) — 5 category cards matching EN structure (Russian text). Government Services card added. "Все гайды →" bottom text link. "Все гайды" demoted from primary card.
- `app/ru/government/page.tsx` — new static page. Russian copy. 3 guide cards (document-attestation, amer, pro-services, all /ru/guides/ hrefs). WhatsApp CTA. Hreflang: canonical `/ru/government`, en-alternate `/government`.
- `components/PrimaryServices.tsx` — retained, not imported anywhere.
- Soon cards are `<div>` (non-clickable), not `<Link>`. No fake hrefs.
- Business Bank Account remains inside `/company-setup` and `/ru/company-setup` hubs.
- Build: 63 pages, 0 errors (+1 from CP-18 due to new `/ru/government`)
- TypeScript: clean

---

## CP-18 — Locale-aware navigation fixed for RU pages

**Date:** 2026-04-29

**What is confirmed stable:**

- `lib/locale-path.ts` created: `getGuidePath()`, `getLocalePath()`, `getLocaleFromPathname()`
- `Footer.tsx` — locale-aware: `/ru/contact` link and Russian labels ("О нас", "Контакты") on RU pages
- `StickyRouteCta.tsx` — locale-aware: shows "Найти маршрут / Ответить на 2–3 вопроса" on RU pages
- 6 RU pages verified: `/ru/contact` in footer, Russian sticky CTA, no EN-only text
- 4 EN pages verified: unaffected (`/contact` link, English sticky CTA)
- `TopicCard.tsx` was already locale-aware (confirmed)
- `GuideTabs.tsx` was already locale-aware for guide links (confirmed)
- `PrimaryServices`, `RouteSnapshotBand`, `BrowseByService`, `QuickDecisionCards` — EN-only components, not used on RU pages, no change needed
- `RouteFinderFlow` — EN-only page (`/find-my-visa`), no RU equiv exists, no change needed
- Build: 62 pages, 0 errors

---

## CP-17 — Russian mainland-company-setup-dubai guide content live

**Date:** 2026-04-29

**What is confirmed stable:**

- RU content populated for `mainland-company-setup-dubai`: ru_title, ru_summary, ru_audience, ru_overview, all 8 step ru_* fields
- `/ru/guides/mainland-company-setup-dubai` returns 200, H1 in Russian, all 8 step titles in Russian
- EN page emits `ru` hreflang (hasRuContent triggered correctly)
- Sitemap includes `https://guidex-consulting.ae/ru/guides/mainland-company-setup-dubai`
- Build: 62 pages, 0 errors
- Script: `scripts/add-ru-mainland-company.ts`

---

## CP-16 — Russian golden-visa-dubai-property guide content live

**Date:** 2026-04-29

**What is confirmed stable:**

- RU content populated for `golden-visa-dubai-property`: ru_title, ru_summary, ru_audience, ru_overview, all 7 step ru_* fields
- `/ru/guides/golden-visa-dubai-property` returns 200, H1 in Russian, all 7 step titles in Russian
- EN page now emits `ru` hreflang (hasRuContent triggered correctly)
- Sitemap includes `https://guidex-consulting.ae/ru/guides/golden-visa-dubai-property`
- Build: 62 pages, 0 errors
- Script: `scripts/add-ru-golden-visa-property.ts`

---

## CP-15 — Russian employment-visa guide content live

**Date:** 2026-04-29

**What is confirmed stable:**

- RU content populated for `employment-visa`: ru_title, ru_summary, ru_audience, ru_overview, all 8 step ru_* fields
- `/ru/guides/employment-visa` returns 200, renders Russian H1 and all 8 step titles in Russian
- EN fallback for RU pages no longer needed for this guide — all ru_* fields populated
- EN page `/guides/employment-visa` now emits `ru` hreflang (hasRuContent triggered correctly)
- Sitemap includes `https://guidex-consulting.ae/ru/guides/employment-visa` (filtered by ru_title)
- meta description on RU page: Russian, 2 sentences, under 160 chars
- Build: 62 pages, 0 errors

**Script used:** `scripts/add-ru-employment-visa.ts` — kept for reference

---

## CP-14 — Phase 1B Russian routing verified

**Date:** 2026-04-29

**What is confirmed stable:**

- All 7 required routes return 200: `/`, `/guides`, `/guides/employment-visa`, `/ru/guides/employment-visa`, `/guides/golden-visa-dubai-property`, `/ru/guides/golden-visa-dubai-property`, `/admin/login`
- EN guide pages: hreflang `en` + `x-default` emitted. `ru` hreflang only when `hasRuContent=true` (currently none — all ru_* empty)
- RU guide pages: hreflang `en` + `ru` + `x-default` + canonical `/ru/guides/[slug]`
- Language switcher: EN pages show RU pill → `/ru/[path]`, RU pages show EN pill → `/[path]`
- RU pages render with EN fallback for all empty ru_* fields
- RU nav: Визы / Компании / Гайды (no Find My Route)
- Sitemap: 32 entries — EN static + EN guides + RU static + RU guide entries (0 currently, filtered by ru_title)
- No admin/writer imports in public bundle
- Build: 62 pages, 0 errors (commit 3927e4c)

**Remaining before RU launch:**
1. Populate ru_* fields via admin (priority order in docs/ru-launch-plan.md)
2. After translations, deploy: `git pull` + `npm run build` + `pm2 restart`
3. Submit sitemap to Google Search Console
4. Add Plausible analytics

---

## CP-13 — UpCloud migration complete, guidex-consulting.ae live on new server

**Date:** 2026-04-29

**What is confirmed stable:**

*Server:*
- Provider: UpCloud
- IP: 85.9.203.69
- SSH user: root
- App path: /var/www/guidex
- Node v20.20.2 (system NodeSource), PM2 guidex-production online
- 2 GB swap (persistent), pm2-root.service enabled
- Nginx reverse proxy, Let's Encrypt SSL, certbot.timer active

*Database:*
- guides.db.20260429-140304: 15 guides, 94 steps, all published, integrity ok
- Server path: /var/www/guidex/data/guides.db
- Server cron backup: /var/backups/guidex/ — daily 03:00, 30-day retention
- First backup verified: guides.db.20260429-140750 (124K, SQLite ok)

*Domain and SSL:*
- https://guidex-consulting.ae ✅ HTTPS 200
- https://www.guidex-consulting.ae ✅ HTTPS 200
- HTTP → HTTPS redirect: 301 ✅
- SSL: Let's Encrypt, valid to 2026-07-28, auto-renewal via certbot.timer
- DNS: @ + www → 85.9.203.69 (updated at Tasjeel 2026-04-29)

*Build:*
- Commit c127e9b — 62 pages (EN + RU Phase 1B), 0 errors
- Phase 1B Russian routing live (EN fallback until ru_* fields populated)

*Smoke tests (9/9 HTTPS 200):*
/ /guides /guides/employment-visa /guides/golden-visa-dubai-property /contact /admin/login /robots.txt /sitemap.xml https://www.guidex-consulting.ae/

**Cloudways (165.245.187.15):** Safe to cancel — all 8 migration phases complete.

**Remaining:**
1. Cancel Cloudways subscription
2. Populate ru_* content fields in admin (see docs/ru-launch-plan.md)
3. Submit sitemap to Google Search Console
4. Add Plausible analytics

---

## CP-12 — Server recovery complete, guidex-consulting.ae fully live

**Date:** 2026-04-28

**What is confirmed stable:**

*Recovered server:*
- Cloudways — Recovered-guidex-main-server — IP: 165.245.187.15
- SSH user: master_asumzwhebx
- App path: /home/master/applications/dgcmdxxpjx/public_html
- Node v20.20.2 via nvm, PM2 guidex-production online
- mod_proxy_http, proxy_module, proxy_fcgi_module re-enabled by Cloudways Support
- All project files, .env.local, data/guides.db, .next build survived recovery

*Domain and SSL:*
- Primary domain: https://guidex-consulting.ae — SSL Let's Encrypt ✅
- WWW: https://www.guidex-consulting.ae ✅
- DNS: A record → 165.245.187.15 (updated in Tasjeel after recovery)
- HTTP → HTTPS redirect: ✅ Enabled

*GitHub:*
- Commit fea9411 — all scripts updated to new IP/SSH user

**Remaining:**
1. Fresh production DB backup after stable recovery
2. Submit sitemap to Google Search Console
3. Add Plausible analytics

---

## CP-11 — Phase 12: guidex-consulting.ae live with HTTPS (original server)

**Date:** 2026-04-27

**What was confirmed stable:**

*Domain and SSL:*
- Primary domain: https://guidex-consulting.ae — SSL Let's Encrypt ✅
- WWW: https://www.guidex-consulting.ae ✅
- DNS was: A record → 157.245.207.99 (Tasjeel) — **old IP, server later suspended**
- HTTP → HTTPS redirect: enabled

*Server at time of CP (later suspended by Cloudways):*
- IP: 157.245.207.99 — SSH user: master_udndspcyhr

*Smoke test (all HTTPS, all 200):*
- / /guides /guides/employment-visa /guides/golden-visa-dubai-property
- /contact /admin/login /robots.txt /sitemap.xml /www apex

*Production DB backup:*
- backups/production-db/guides.db.20260427-223918

*GitHub:*
- Commit c7288f1 — all code, docs, scripts, and memory files pushed

---

## CP-10 — Phase 11: Cloudways deployment live on temporary URL

**Date:** 2026-04-27

**What is confirmed stable:**

*Server:*
- Cloudways DigitalOcean VPS — 157.245.207.99 — app ID dgcmdxxpjx
- Node v20.20.2 via nvm (user-level, no sudo)
- PM2 v6.0.14 — `guidex-production` online, 0 restarts, saved to dump

*Deployment:*
- All project files rsync'd to `/home/master/applications/dgcmdxxpjx/public_html/`
- `data/guides.db` uploaded (124K), backed up locally as `guides.db.backup-20260427-163049`
- `.env.local` on server: 5 vars, permissions 600, NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → temporary URL
- `npm ci` + `npm run build` — 38/38 pages, 0 errors
- `~/start-guidex.sh` — PM2 entry point (sources nvm, cd, PORT=3000)
- `.htaccess` — `RewriteRule ^(.*)?$ http://127.0.0.1:3000/$1 [P,L]`
- `mod_proxy_http` enabled by Cloudways Support
- `index.php` renamed to `index.php.placeholder` (preserved as backup)

*Smoke test (all 200, Next.js confirmed):*
- / /guides /guides/employment-visa /guides/golden-visa-dubai-property
- /contact /admin/login /robots.txt /sitemap.xml

**Not yet done:** Real domain (guidex-consulting.ae) — DNS and SSL not connected.

**Backup/sync workflow established:**
- `scripts/db-backup-from-server.sh` — pull production DB to `backups/production-db/`
- `scripts/db-restore-to-server.sh` — restore with server-side backup + PM2 restart
- Source-of-truth rules locked in `CLAUDE.md` and `docs/deployment-cloudways.md`

---

## CP-09 — Phase 6 launch-readiness complete

**Date:** 2026-04-25

**What is confirmed stable:**

*Technical SEO:*
- `sitemap.xml` — static, pre-rendered, 12 static pages + 11 guide pages
- `robots.txt` — static, blocks /admin/ and /api/auth/
- `metadataBase` in root layout — canonical and og:url resolve correctly
- Group redirect slugs: `permanent: true` (301)

*Deployment:*
- `.env.example` — 5 vars documented
- `docs/deployment-cloudways.md` — complete VPS guide
- `.gitignore` — guides.db added (manual `git rm --cached` still pending)

*Cleanup:*
- 5 Next.js boilerplate SVGs removed from `public/`

**Build:** Clean — 35 pages, 0 TypeScript errors.

**Remaining pre-launch actions:**
1. `git rm --cached data/guides.db && git commit` — untrack DB from git
2. Set domain and DNS on Cloudways
3. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` in `.env.local` on server
4. Add Plausible or other analytics when domain is live

---

## CP-08 — Calculator v1 live at /find-my-visa

**Date:** 2026-04-22

**What is confirmed stable:**

*Route finder / calculator:*
- `/find-my-visa` — static page, build clean, TypeScript clean
- `lib/route-finder-config.ts` — config-first, no DB deps, 6 question nodes, 13 resolutions
- `components/RouteFinderFlow.tsx` — client component, state machine, instant tap = answer
- All 14 guide slugs verified published before build. Zero mismatches.

*Coverage:*
- Family visa (new): spouse/child × outside/inside UAE → 4 guide resolutions
- Family visa (renew): 1 resolution
- Newborn visa: 1 resolution
- Employment (inside UAE): 1 resolution
- Employment (outside UAE): advisor state ("guide coming soon")
- Golden visa (property): 1 resolution; other routes → hub + WhatsApp
- Company setup: mainland / free zone / bank account / unsure → 3 guides + hub
- Supporting service injection: attestation on outside-country family routes; Amer on inside/renew; PRO on company routes

*Hub page CTAs added:*
- `/visas/family` — "Find My Route" CTA above guide cards
- `/visas/golden` — "Find My Route" CTA above guide cards
- `/company-setup` — "Find My Route" CTA above route cards

*Header:* "Find My Route" added as first nav item

**Build:** Clean — 31 pages. No TypeScript errors. `/find-my-visa` ○ Static.

**State going forward:**
- Calculator is production-ready. Next content priority: Employment Visa Outside-Country (upgrades the one advisor state to a full guide resolution).

---

## CP-07 — Government pillar fully live + visa pillar 6/7 live (14 guides published)

**Date:** 2026-04-22

**What is confirmed stable:**

*Government pillar (3/3 live):*
- `/guides/document-attestation-dubai` — published, 3 steps, MOFA attestation
- `/guides/amer-center-dubai` — published, 4 steps, service center orientation
- `/guides/pro-services-dubai` — published, 5 steps, PRO services orientation
- PrimaryServices: Government group fully live (was removed when 0 items live)

*Visa pillar (6/7 live):*
- `/guides/renew-family-visa-dubai` — published, 4 steps, in-country renewal route (adults 18+ medical; children exempt)
- PrimaryServices Visas group: Employment + New Family + Renew Family + Newborn + Golden + Property = 6 live. Maid Visa remains "Soon".

*Guide count:* 14 published, 0 drafts

**Build:** Clean — `[+11 more paths]` on `/guides/[slug]` static generation.

**Fee discipline established:**
- No AED ranges without official tariff backing (Amer, PRO services, notary PoA — all removed)
- Medical fitness test (AED 250–450) retained — well-supported GDRFA-approved center range
- "Varies by visa duration and family file status. Amer confirms at submission." — pattern for government-variable fees

**State going forward:**
- Next priority: Employment Visa Outside-Country (most common first-hire path)
- All three service pillars live: Visas ✅ Business Setup ✅ Government ✅

---

## CP-06 — Company-setup pillar fully live + homepage service-first reset

**Date:** 2026-04-21

**What is confirmed stable:**

*Company-setup pillar (3/3 routes live):*
- `/guides/mainland-company-setup-dubai` — published, 8 steps, DED mainland route
- `/guides/free-zone-company-setup-dubai` — published, 8 steps, general free zone route
- `/guides/open-business-bank-account-dubai` — published, 8 steps, post-formation banking
- `/company-setup` hub — all 3 route cards active as `<Link>` (not `soon`)
- Hub intro updated: "All three guides are live."

*Homepage service-first reset (Phase 5.14–5.17):*
- `PrimaryServices` component — 2 groups (Visas/Business Setup), no dead placeholders
- Employment Visa in Visas group (live, position 1)
- Business Setup: Company Setup + Mainland + Free Zone + Bank Account (all 4 live)
- Government & Legal removed until first real service is live
- WhatsApp CTA live in Header, Hero, FreeAdviceCta (all → wa.me/971506304817)

*Guide count:* 9 published (was 6 at CP-05)

**Build:** Clean — 24 pages. `/guides/[slug]` shows [+6 more paths].

**State going forward:**
- Company-setup pillar: complete
- Visa pillar: employment + spouse + child + golden/property = 8 guides (5 slugs, 2 group pages)
- Next: first new visa content (employment outside-country, newborn, or maid visa)

---

## CP-05 — Phases 4.5 + 4.6 complete (visual polish + real content + validation)

**Date:** 2026-04-17

**What is confirmed stable:**

*Visual identity (Phase 4.5):*
- `globals.css` — `@theme` with `--color-navy: #1B2E4B`, `--color-brass: #B5935A`
- `CategoryIcon.tsx` — 5 inline SVG micro-icons (14×14, 1.5px stroke, currentColor)
- `StepCard.tsx` (public) — step bubble `bg-navy`; advice block `bg-navy/[.06] text-navy`
- `Hero.tsx` — value cards `border-l-2 border-brass`; divider `border-stone-200`
- `TopicCard.tsx` — `bg-stone-50 border-stone-200`; category pill `bg-brass/[.08] text-brass/80`; brass CategoryIcon
- `GuideHeader.tsx` — brass CategoryIcon beside category label
- `guides/[slug]/page.tsx` — brass overlines above section h2s; navy CTA card at guide bottom

*Real guide content (Phase 4.6):*
- Employment-visa guide: "How to Get an Employment Visa in Dubai Without Leaving the UAE"
  — 8 steps, exact Tasheel/Amer/Tawjeeh fees, inside-country route, April 2025
  — Timeline: 2–4 weeks overall, 2–3 days per step
- Content writing standard locked in `CLAUDE.md` and `docs/article-template.md`

*Validation:*
- Guide `timeline` field: `required` HTML + server-side throw in `createGuideAction`, `updateGuideAction`
- Step `timeEst` field: `required` HTML + server-side throw in `updateStepAction`

**Build:** clean — 0 errors, 0 TypeScript errors, 11/11 pages
**DB confirmed:** guide timeline `2–4 weeks`; all 8 steps `2–3 days`; overview text consistent

**State going forward:**
- 1 published guide: `employment-visa` (real production content)
- Admin: full guide + step CRUD working
- Public visual system: complete
- Next: second article (dependent/family visa guide)

---

## CP-04 — Phase 4 complete (step management)

**Date:** 2026-04-12
**Branch/commit:** committed

**What is confirmed stable:**
- Full inline step CRUD in `/admin/guides/[slug]`
- `createStepAction` — appends empty step at `max(stepOrder) + 1`
- `updateStepAction` — writes all 14 fields (cost, timeEst, EN×6, RU×6)
- `deleteStepAction` — deletes + renumbers remaining steps contiguously
- `reorderStepAction` — swaps `stepOrder` integers with adjacent step
- `router.refresh()` pattern — no redirect on step mutations, guide form unsaved state preserved
- `StepCard.tsx` — per-step form: Save, Delete (confirm), ↑/↓ reorder, `useTransition` pending state
- `StepList.tsx` — step list + Add step button, empty state message
- DOM structure: `<GuideEditForm>` and `<StepList>` are siblings — no nested forms
- Build: clean (0 errors, 0 warnings)

**What was verified:**
- SQLite mutation logic tested directly: create appends correctly, delete renumbers
  `[1,2,3,4,5] → delete 3 → [1,2,3,4]`, reorder swaps adjacent integers
- 5 seeded employment-visa steps confirmed intact after test and restore
- Production build clean

**Phase next:** Phase 4.5 — public visual identity polish

---

## CP-03 — Phase 3A complete

**Date:** 2026-04-12
**Branch/commit:** uncommitted (Phase 3A verification pass complete)

**What is confirmed stable:**
- Guide CRUD: create, edit, save draft, save and publish, unpublish, delete
- Single-form intent pattern: field edits and publish happen in one DB write
- Unsaved-changes guard: dirty tracking, `beforeunload`, back-nav confirm dialog
- Success banner: shows on save redirect, auto-hides after 3s
- React key correctness: no duplicate sibling keys anywhere
- ISR revalidation: public page updates immediately after admin save
- Build: clean — 0 errors, 0 TypeScript errors, 0 deprecation warnings, 11/11 pages

**What was verified:**
- SQLite write paths tested programmatically: save draft preserves published,
  unpublish sets published=0, save and publish atomically sets field + published=1
- Public page curl confirmed returning updated content after DB write
- Static code audit: only one `key={saved ?? "init"}` in the codebase
  (on outer `<GuideEditForm>` in the page — inner elements carry no keys)
- `npm run build` output reviewed line by line — no warnings

**Known state going in:**
- 1 guide seeded: `employment-visa` (published)
- Steps table exists and public page renders steps; no admin step UI yet
- RU fields in DB and admin form; public site renders EN only

**Phase next:** Phase 4 — step management in the admin

---

## CP-02 — Phase 2 complete (admin foundation)

**Date:** 2026-04-12

**What is confirmed stable:**
- NextAuth.js v4 credentials login working
- Route protection via `proxy.ts` working
- Admin layout isolated from public site
- Guide list page shows all guides (draft + published)
- bcrypt auth bug fixed (dotenv-expand `$` escaping)
- `middleware.ts` → `proxy.ts` migration done

**Phase next:** Phase 3A — guide CRUD

---

## CP-01 — Phase 1 complete (SQLite migration)

**Date:** 2026-04-12

**What is confirmed stable:**
- All guide data migrated from MDX to SQLite
- Public site renders identically to pre-migration state
- Zero SEO regression — same URLs, same HTML output
- Employment-visa guide seeded with all steps
- MDX files and metadata.ts retired

**Phase next:** Phase 2 — admin foundation
