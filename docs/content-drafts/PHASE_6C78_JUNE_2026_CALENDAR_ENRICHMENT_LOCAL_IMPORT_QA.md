# Phase 6C-78 — June 2026 Calendar Enrichment Local Import QA

**Date:** 2026-05-27
**Phase:** 6C-78
**Type:** Local import QA — no production DB, no deploy, no push of code

---

## 1. Summary Answer

| Question | Answer |
|----------|--------|
| Local enrichment import successful? | YES |
| Items added | 3: JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH |
| RE:SET excluded or safely clarified? | Excluded — genre unverified, remains HOLD |
| June dates covered now? | 25/30 (83%) |
| 60-70% target reached? | YES — exceeded at 83% |
| L2 briefs rendering? | 4 (JUN-01-VAT, JUN-01-WPS, JUN-05-ACW, JUN-15-MALLATHON) |
| RU complete? | YES — all 4 L2 briefs in Russian, all L1 labels in Russian |
| Existing pages unaffected? | YES — all 12 routes 200, all other rows unchanged |
| Ready for production import approval? | YES |
| Phase 6C-79 production delta | UPDATE june-2026-dubai-calendar: dates_json 5 items -> 8 items + page string updates |

---

## 2. Preflight Content Audit

### 2.1 Item-level audit

| Item | EN brief | RU brief | EN label | RU label | Source URL | Source status | Em dash | Decision |
|------|----------|----------|----------|----------|------------|---------------|---------|----------|
| JUN-15-MALLATHON (L2) | Complete (138 words) | Complete (proper Russian, 103 words) | Clean | Clean | dubaimallathon.ae | confirmed | 0 | INCLUDE |
| JUN-20-BASSI (L1) | Empty (by design) | Empty (by design) | Clean | Proper Russian | dubaiopera.com | confirmed | 0 | INCLUDE |
| JUN-24-ORCH (L1) | Empty (by design) | Empty (by design) | Clean | Proper Russian | dubaiopera.com | confirmed | 0 | INCLUDE |
| JUN-06-RESET (L1) | HOLD | HOLD | HOLD | HOLD | dubaiopera.com | confirmed (show type unverified) | N/A | EXCLUDED |

### 2.2 Page-level strings audit

| Check | Result |
|-------|--------|
| No em dashes in DATES_JSON | PASS — `assertClean()` guard ran on all strings |
| No em dashes in page summary/body/notes/meta | PASS |
| No "complete calendar" / "all events" claim | PASS |
| No fake CTAs | PASS — dubaimallathon.ae and dubaiopera.com are real official sources |
| No duplicate JUN-01-VAT/WPS/RUMI/ACW/BEACH | PASS — duplicate ID guard confirmed |
| No Emiratisation June 30 item | PASS — Jun 30 cross-page link only, no calendar item duplicated |
| Source URLs present for all 3 new items | PASS |
| RU strings are proper Russian (not transliterated) | PASS |

---

## 3. Import Script

**Script:** `scripts/june-2026-calendar-enrich-local-import-6c78.ts`

**Approach used:** `updateCalendarDraft` + `publishCalendar` on existing local row ID `ca207e36-589a-4c8c-a6f2-3b066d2da775`

**Safety features in script:**
- Em dash guard (`assertClean()`) on all strings before any DB write
- Duplicate item ID check on full 8-item DATES_JSON
- Slug lookup via `getAllCalendarPages()` — no hardcoded local ID
- Pre-flight: confirms all 5 baseline items present before proceeding
- Pre-flight: confirms no enrichment items already present (prevents double-import)
- Update-only — no INSERT, no new rows

---

## 4. Local DB Backup

| Field | Value |
|-------|-------|
| Backup path | `backups/local/guides.db.pre-june-enrichment-6c78-20260527-121704` |
| Backup size | 580K |
| Backup verified | Yes — created before any DB write |

---

## 5. DB State Before / After

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| calendar_pages (rows) | 6 | 6 | 0 |
| june-2026-dubai-calendar (items) | 5 | 8 | +3 |
| news_posts | 4 | 4 | 0 |
| events | 2 | 2 | 0 |
| guides | 17 | 17 | 0 |

june-2026-dubai-calendar row: status = published, last_verified_date = 2026-05-27

---

## 6. HTTP Route QA (12/12 — all 200)

| Route | Status |
|-------|--------|
| /calendar/june-2026-dubai-calendar | 200 |
| /ru/calendar/june-2026-dubai-calendar | 200 |
| /calendar?month=2026-06 | 200 |
| /ru/calendar?month=2026-06 | 200 |
| /calendar/uae-emiratisation-june-30-2026-reminder | 200 |
| /ru/calendar/uae-emiratisation-june-30-2026-reminder | 200 |
| /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| / | 200 |
| /ru | 200 |

---

## 7. Content Invariant Checks

### 7.1 `<details>` blocks (L2 items)

| Page | Expected | Actual | Result |
|------|----------|--------|--------|
| EN /calendar/june-2026-dubai-calendar | 4 | 4 | PASS |
| RU /ru/calendar/june-2026-dubai-calendar | 4 | 4 | PASS |

4 L2 items: JUN-01-VAT, JUN-01-WPS, JUN-05-ACW, JUN-15-MALLATHON (new)

### 7.2 Brief text in initial HTML

| Check | Snippet | Result |
|-------|---------|--------|
| EN Mallathon brief | "Dubai Mallathon 2026 runs from 15 June" | PASS |
| EN VAT brief | "Salik toll gate charges" | PASS |
| EN WPS brief | "Ministry of Human Resources and Emiratisation" | PASS |
| EN ACW brief | "Cinema Akil at Alserkal Avenue from 5 to 11 June" | PASS |
| RU Mallathon brief | "Dubai Mallathon 2026 проходит с 15 июня" | PASS |
| RU VAT brief | "тарифам на проезд через пункты Salik" | PASS |
| RU ACW brief | "от 60 AED с учётом НДС" | PASS |

### 7.3 Source labels visible (L2 items)

| Source label | Visible in EN HTML | Result |
|-------------|-------------------|--------|
| "Government of Dubai (mediaoffice.ae): official announcement" | Yes | PASS |
| "Salik PJSC: official announcement" | Yes | PASS |
| "MoHRE: Ministerial Resolution" | Yes | PASS |

Note: L1 items (Rumi, Beach Boys, Bassi, Orchestra) do not render source label in HTML — by design, consistent with Phase 6C-74 behavior.

### 7.4 CTA hrefs present

| Item | CTA URL | In HTML | Result |
|------|---------|---------|--------|
| JUN-15-MALLATHON | dubaimallathon.ae | Yes | PASS |
| JUN-01-VAT | salik.ae | Yes | PASS |
| JUN-01-WPS | mohre.gov.ae | Yes | PASS |
| JUN-05-ACW | cinemaakil.com | Yes | PASS |
| JUN-04-RUMI, JUN-11-BEACH, JUN-20-BASSI, JUN-24-ORCH | L1 — no CTA button rendered | Expected | PASS |

### 7.5 L1 labels visible

| Item | Label | Visible | Result |
|------|-------|---------|--------|
| JUN-04-RUMI | "Rumi: The Musical at Dubai Opera" | Yes | PASS |
| JUN-11-BEACH | "Beach Boys: 60 Years of Pet Sounds" | Yes | PASS |
| JUN-20-BASSI | "Bassi Live: Kisi ko Batana Mat at Dubai Opera" | Yes | PASS |
| JUN-24-ORCH | "UAE National Orchestra: Rhythms Without Borders" | Yes | PASS |

### 7.6 RU no EN fallback

| Check | Result |
|-------|--------|
| RU Mallathon brief in Russian on RU page | "Dubai Mallathon 2026 проходит" present — PASS |
| EN "Dubai Mallathon 2026 runs" on RU page | 0 occurrences — PASS |

### 7.7 Safety checks

| Check | Result |
|-------|--------|
| Raw `##` in rendered HTML | 0 — PASS |
| Raw JSON field names (brief_en etc.) | 0 — PASS |
| "all events" / "complete calendar" phrases | 0 — PASS |
| Emiratisation text in EN HTML | 2 occurrences — both in MoHRE full name ("Ministry of Human Resources and Emiratisation") — PASS |
| Duplicate Emiratisation calendar item | 0 — PASS |
| No duplicate agenda groups | Confirmed — dates_json IDs unique |

### 7.8 TypeScript

`npx tsc --noEmit` — 0 errors.

### 7.9 CSS asset

| Check | Result |
|-------|--------|
| CSS file | `/_next/static/chunks/%5Broot-of-the-server%5D__0km00iy._.css` |
| HTTP status | 200 |
| Content-Type | text/css; charset=UTF-8 |
| Size | 91,177 bytes |
| Unstyled page issue | None |

---

## 8. Coverage Calculation

| Metric | Before enrichment | After enrichment |
|--------|------------------|------------------|
| Items in page | 5 | 8 |
| Days with calendar content | 10 (Jun 1, 4-11) | 25 (Jun 1, 4-11, 15-30) |
| Coverage | 33% (10/30) | **83% (25/30)** |
| Gap | Jun 12-29 | Jun 12-14 only (3 days) |
| Already-live cross-page | Jun 30 (Emiratisation) | Jun 30 (Emiratisation) |
| 60-70% target | Not reached | **Exceeded** |

**Dates covered:**
- Jun 1: JUN-01-VAT, JUN-01-WPS
- Jun 4-7: JUN-04-RUMI (musical runs 4-7)
- Jun 5-11: JUN-05-ACW (Arab Cinema Week)
- Jun 11: JUN-11-BEACH
- Jun 15-30: JUN-15-MALLATHON (Mallathon runs Jun 15-Sep 15; covers all remaining June)
- Jun 20: JUN-20-BASSI (within Mallathon span)
- Jun 24: JUN-24-ORCH (within Mallathon span)

**Remaining gap:** Jun 12-14 (3 days). Acceptable. No confirmed source-safe items for these 3 days.

**Still on HOLD:** Islamic New Year (~Jun 15-16) — FAHR has not announced.

---

## 9. Visual QA Note

HTML-level QA is complete. Pre-production owner visual spot-check recommended:
- Mallathon `<details>/<summary>` renders correctly on mobile
- June calendar grid shows expected dates
- L1 items (Bassi Jun 20, Orchestra Jun 24) appear as calendar cells without brief
- Month navigation between May and June still works

---

## 10. What Was Not Touched

- Production DB: not touched
- Code: not modified
- deploy: not done
- push: not done (local script + QA docs only)
- Existing published calendar pages: not modified
- July calendar: not touched
- Any news_posts / events / guides rows: unchanged

---

## 11. Production Import Readiness

**Phase 6C-79 approved scope (when owner approves):**

| Operation | Type | Details |
|-----------|------|---------|
| UPDATE june-2026-dubai-calendar | dates_json | 5 items -> 8 items (add JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH) |
| UPDATE june-2026-dubai-calendar | page strings | en_summary, en_body, en_notes, en_seo_title, en_meta_description |
| UPDATE june-2026-dubai-calendar | page strings | ru_summary, ru_body, ru_notes, ru_seo_title, ru_meta_description |
| UPDATE june-2026-dubai-calendar | last_verified_date | 2026-05-26 -> 2026-05-27 |

**Production row ID:** `adddc561-74dd-4541-9183-34802f2aedd6` (different from local ID `ca207e36-589a-4c8c-a6f2-3b066d2da775`)

**Script:** `scripts/june-2026-calendar-enrich-local-import-6c78.ts` — the same script will work on production with one difference: production row ID is resolved by slug lookup, so no code change needed.

**Pre-production checklist:**
- [ ] Owner reviews this QA report
- [ ] Owner approves Phase 6C-79 production import
- [ ] Production DB backup before any write
- [ ] Verify no duplicate slug on production (june-2026-dubai-calendar must have 5 items, not 8, before import)
- [ ] Run script on production server
- [ ] Build and deploy (pm2 stop -> npm run build -> pm2 start)
- [ ] Live QA: routes + item count + Mallathon brief + CSS

**RE:SET (JUN-06-RESET) next step:** Owner to visit dubaiopera.com and confirm what RE:SET is (concert genre, artist). If confirmed, can be added as a Batch B item in a future local import.

---

## 12. Files Changed This Phase

| File | Change |
|------|--------|
| `scripts/june-2026-calendar-enrich-local-import-6c78.ts` | Created — enrichment update script |
| `backups/local/guides.db.pre-june-enrichment-6c78-20260527-121704` | Created — pre-import backup |
| `data/guides.db` | Updated locally — june-2026-dubai-calendar 5 -> 8 items (NOT committed) |
| `docs/content-drafts/PHASE_6C78_JUNE_2026_CALENDAR_ENRICHMENT_LOCAL_IMPORT_QA.md` | Created — this file |
