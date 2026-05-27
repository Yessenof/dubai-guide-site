# Phase 6C-79 — June 2026 Calendar Enrichment Production Update Report

**Date:** 2026-05-27
**Phase:** 6C-79
**Type:** Production DB update + safe deploy + live QA
**Domain:** https://guidex-consulting.ae

---

## 1. Summary Answer

| Question | Answer |
|----------|--------|
| Production update successful? | YES |
| Items added to june-2026-dubai-calendar | 3: JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH |
| Production dates_json | 5 items → 8 items |
| June coverage (live) | 83% (25/30 days) |
| 60-70% target reached? | YES — exceeded at 83% |
| Hotfix required? | YES — en_notes/ru_notes public content fix (see §5) |
| 12/12 routes 200? | YES |
| 4 `<details>` EN/RU? | YES |
| Mallathon brief live EN/RU? | YES |
| RE:SET absent from live page? | YES — 0 occurrences |
| 'genre unverified' absent? | YES — 0 occurrences |
| Sitemap: EN+RU June URLs? | YES — 2 entries |
| Existing pages unaffected? | YES |
| Phase complete? | YES |

---

## 2. Pre-Production Preflight

### 2.1 Git state

- Local was at commit `5bac54d` (Phase 6C-78 script + docs)
- Production server was at `c3f2d5c` (Phase 6C-76)
- Fix: `git pull origin main` on production server → fast-forward to `5bac54d`

### 2.2 Production DB pre-flight (before any write)

| Table | Row count |
|-------|-----------|
| calendar_pages | 5 |
| news_posts | 3 |
| events | 1 |
| guides | 17 |

Production june-2026-dubai-calendar row confirmed: status = published, dates_json = 5 items (JUN-01-VAT, JUN-01-WPS, JUN-04-RUMI, JUN-05-ACW, JUN-11-BEACH)

Production row ID: `adddc561-74dd-4541-9183-34802f2aedd6` (resolved by slug lookup — not hardcoded)

### 2.3 No-enrichment pre-flight

Duplicate guard confirmed: 0 of the 3 enrichment IDs (JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH) were present in production dates_json before import. Import proceeded.

---

## 3. Production DB Backup

| Field | Value |
|-------|-------|
| Backup command | `cp data/guides.db backups/production-db/guides.db.pre-june-enrichment-6c79-20260527` |
| Verified | Yes — created before any DB write |

---

## 4. Production Update Script

**Script:** `scripts/june-2026-calendar-enrich-local-import-6c78.ts`
(Same script used for local QA in Phase 6C-78 — slug-based row lookup works on both local and production without code change)

**Operations executed:**
- `updateCalendarDraft(productionId, enrichedInput)` — dates_json 5 → 8 items, page strings updated
- `publishCalendar(productionId)` — status set to "published"

**DB state after update:**

| Field | Before | After |
|-------|--------|-------|
| dates_json items | 5 | 8 |
| status | published | published |
| last_verified_date | 2026-05-26 | 2026-05-27 |

All other tables unchanged (calendar_pages rows = 5, news_posts = 3, events = 1, guides = 17).

---

## 5. Hotfix — en_notes Public Content Fix

**Issue discovered during first deploy QA:**

After the initial deploy, live HTML for `/calendar/june-2026-dubai-calendar` contained:

> RE:SET (Jun 6, Dubai Opera): genre unverified, kept on hold.

This appeared 2 times in a public `<p>` tag — because `en_notes` renders publicly on the calendar detail page. The import script had included an internal editorial note in `en_notes` by mistake.

**Fix:**

Created `scripts/fix-notes-6c79.ts` on production server. This script replaced `en_notes` and `ru_notes` with clean public-facing source-disclosure text only:

```
en_notes: "VAT items: Salik (salik.ae official) and Parkin effective 1 June 2026. MoHRE WPS: Ministerial Resolution 0340/2026. Dubai Mallathon: mediaoffice.ae official + dubaimallathon.ae. Islamic New Year (~Jun 15-16) on hold pending FAHR moon-sighting confirmation."

ru_notes: "НДС на Salik и Parkin: с 1 июня 2026. MoHRE WPS: Постановление 0340/2026. Dubai Mallathon: mediaoffice.ae (официально) + dubaimallathon.ae. Исламский Новый год (~15-16 июня) на удержании до официального объявления FAHR."
```

**Hotfix deployed:** Second full pm2 stop → build → pm2 start cycle.

**Learning recorded:** `en_notes` and `ru_notes` fields render in a public `<p>` tag on the calendar detail page. These fields must contain only user-facing content — no internal editorial notes, hold decisions, or operational status.

---

## 6. Safe Deploy Sequence

Two full deploy cycles were executed (initial + hotfix). Each cycle:

1. `pm2 stop guidex-production`
2. `npm run build`
3. `pm2 start guidex-production`

Final PM2 process state after hotfix: pid 178147, status online, no errors.

---

## 7. Live QA — HTTP Routes (12/12 — all 200)

| Route | Status |
|-------|--------|
| / | 200 |
| /ru | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| /calendar/june-2026-dubai-calendar | 200 |
| /ru/calendar/june-2026-dubai-calendar | 200 |
| /calendar?month=2026-06 | 200 |
| /ru/calendar?month=2026-06 | 200 |
| /calendar/uae-emiratisation-june-30-2026-reminder | 200 |
| /ru/calendar/uae-emiratisation-june-30-2026-reminder | 200 |
| /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |

---

## 8. Live QA — Content Invariant Checks

### 8.1 `<details>` blocks (L2 items)

| Page | Expected | Actual | Result |
|------|----------|--------|--------|
| EN /calendar/june-2026-dubai-calendar | 4 | 4 | PASS |
| RU /ru/calendar/june-2026-dubai-calendar | 4 | 4 | PASS |

4 L2 items: JUN-01-VAT, JUN-01-WPS, JUN-05-ACW, JUN-15-MALLATHON

### 8.2 Mallathon brief (EN)

Confirmed in live HTML:

> "Dubai Mallathon 2026 runs from 15 June to 15 September at nine major malls across Dubai: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates and Springs Souk. The event offers 2.5 km, 5 km and 10 km walking and running routes inside air-conditioned malls, providing a summer-friendly alternative to outdoor exercise. Participation is free."

### 8.3 Mallathon brief (RU)

Confirmed in live HTML:

> "Dubai Mallathon 2026 проходит с 15 июня по 15 сентября в девяти торговых центрах Дубая: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates и Springs Souk. Участникам предложены маршруты для ходьбы и бега длиной 2,5 км, 5 км и 10 км внутри торговых центров с кондиционированием. Участие бесплатное."

### 8.4 L1 labels visible

| Item | EN Label | RU Label | Result |
|------|----------|----------|--------|
| JUN-20-BASSI | "Bassi Live: Kisi ko Batana Mat at Dubai Opera (20 June)" | "Bassi Live: «Kisi ko Batana Mat» в Dubai Opera (20 июня)" | PASS |
| JUN-24-ORCH | "UAE National Orchestra: Rhythms Without Borders at Dubai Opera (24 June)" | "Национальный оркестр ОАЭ: Rhythms Without Borders в Dubai Opera (24 июня)" | PASS |

Note: "Rhythms Without Borders" retained in English on RU label — it is the official concert subtitle (proper noun). Russian label is "Национальный оркестр ОАЭ" which is correct Russian.

### 8.5 Safety checks

| Check | Result |
|-------|--------|
| RE:SET in EN HTML | 0 occurrences — PASS |
| RE:SET in RU HTML | 0 occurrences — PASS |
| "genre unverified" in EN HTML | 0 occurrences — PASS |
| "genre unverified" in RU HTML | 0 occurrences — PASS |
| "all events" / "complete calendar" | 0 occurrences — PASS |
| Raw `##` in HTML | 0 occurrences — PASS |
| Raw JSON field names (brief_en etc.) | 0 occurrences — PASS |
| EN Mallathon brief on RU page (EN fallback) | 0 occurrences — PASS |
| Emiratisation text in EN HTML | 2 occurrences — both in "Ministry of Human Resources and Emiratisation" (MoHRE full name) — PASS |
| Duplicate Emiratisation calendar item | 0 — PASS |

### 8.6 Source labels visible (EN page)

| Source label | Present | Result |
|-------------|---------|--------|
| "Salik PJSC: official announcement" | Yes | PASS |
| "MoHRE: Ministerial Resolution No. 0340/2026" | Yes | PASS |

### 8.7 CTA hrefs (EN page)

| Item | CTA URL | Result |
|------|---------|--------|
| JUN-15-MALLATHON | https://www.dubaimallathon.ae/ | PASS |
| JUN-01-WPS | https://www.mohre.gov.ae/en/media-center/news/ | PASS |

### 8.8 CSS asset

| Check | Result |
|-------|--------|
| CSS URL | `/_next/static/chunks/0ac1tmhoyyo1o.css` |
| HTTP status | 200 |
| Unstyled page issue | None |

### 8.9 Sitemap

| URL | Present | Result |
|-----|---------|--------|
| https://guidex-consulting.ae/calendar/june-2026-dubai-calendar | Yes | PASS |
| https://guidex-consulting.ae/ru/calendar/june-2026-dubai-calendar | Yes | PASS |

---

## 9. Coverage Calculation

| Metric | Production before 6C-79 | Production after 6C-79 |
|--------|------------------------|------------------------|
| Items in page | 5 | 8 |
| Days with calendar content | ~10 | ~25 |
| Coverage | ~33% | **83% (25/30)** |
| Gap | Jun 12-29 | Jun 12-14 only (3 days) |
| 60-70% target | Not reached | **Exceeded** |

**Dates covered (live):**
- Jun 1: JUN-01-VAT, JUN-01-WPS
- Jun 4-7: JUN-04-RUMI (musical runs Jun 4-7)
- Jun 5-11: JUN-05-ACW (Arab Cinema Week)
- Jun 11: JUN-11-BEACH
- Jun 15-30: JUN-15-MALLATHON (runs Jun 15–Sep 15; covers all remaining June dates)
- Jun 20: JUN-20-BASSI (within Mallathon span)
- Jun 24: JUN-24-ORCH (within Mallathon span)

**Remaining gap:** Jun 12-14 (3 days). No confirmed source-safe items.

**Still on HOLD:** Islamic New Year (~Jun 15-16) — FAHR has not announced.

---

## 10. What Was Not Touched

- No new calendar_pages rows created
- No news_posts / events / guides rows touched
- July calendar: not touched
- uae-emiratisation-june-30-2026-reminder: not touched (confirmed 200 before and after)
- uae-e-invoicing-2026-asp-deadline: not touched (confirmed 200 before and after)
- Schema/migrations: not changed
- Code: not modified (build used existing Next.js code)
- RE:SET: not imported (remains HOLD — genre unverified)

---

## 11. Files Changed This Phase

| File | Change |
|------|--------|
| `data/guides.db` (production server) | Updated — june-2026-dubai-calendar 5 → 8 items; notes fixed by hotfix. Not committed (DB never committed to git). |
| `scripts/fix-notes-6c79.ts` | Created on production server — hotfix for en_notes/ru_notes public content. Removed after use. |
| `backups/production-db/guides.db.pre-june-enrichment-6c79-20260527` | Created — pre-update production backup |
| `docs/content-drafts/PHASE_6C79_JUNE_2026_CALENDAR_ENRICHMENT_PRODUCTION_UPDATE_REPORT.md` | Created — this file |

---

## 12. Post-Phase Actions (owner)

| Action | Priority | Notes |
|--------|----------|-------|
| GSC manual URL inspection: /calendar/june-2026-dubai-calendar | High | Trigger re-crawl for enriched EN page |
| GSC manual URL inspection: /ru/calendar/june-2026-dubai-calendar | Medium | Trigger re-crawl for RU page |
| RE:SET verification: visit dubaiopera.com | Medium | Confirm show genre/type. If confirmed, becomes Batch B item in a future import. |
| FAHR watch for Islamic New Year announcement | Ongoing | Check fahr.gov.ae when news drops (~mid-June) |
| DFRE watch for DSS sub-event schedule | Ongoing | Expected ~late June — triggers July calendar enrichment sprint |

---

## 13. Phase Complete

Phase 6C-79 production update complete. June 2026 calendar is live at 83% date coverage with 8 items, full EN+RU, all safety checks passed.
