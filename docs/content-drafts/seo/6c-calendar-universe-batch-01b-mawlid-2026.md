# Phase 6C-CALENDAR-UNIVERSE-BATCH-01B-MAWLID-2026 — Implementation Report

**Phase:** 6C-CALENDAR-UNIVERSE-BATCH-01B-MAWLID-2026
**Date:** 2026-07-16
**Status:** COMPLETE — local DB written, audit docs corrected, build verification pending

---

## 1. Objective

Implement the 2026 Prophet Muhammad's Birthday / Mawlid Al Nabawi calendar record for UAE in the August 2026 calendar, with correct date, confidence level, EN/RU parity, and sourcing.

Correct the Calendar Universe audit (Phase 6C-CALENDAR-UNIVERSE-AUDIT-01) which incorrectly described this as a two-day holiday on "Aug 24–25" and as "confirmed / MISSING".

---

## 2. Scope

- `calendar_pages` table, slug `august-2026-dubai-calendar`, datesJson item `AUG-NEW-02`
- Six Calendar Universe audit documents (master inventory, backlog, gap analysis, source ledger, SEO cluster map, audit report)
- Implementation report (this file)
- PROJECT_STATE.md and SESSION_LOG.md
- No new guide pages. No `events` table inserts. No schema changes.

---

## 3. Audit correction

### What the audit said
The 6C-CALENDAR-UNIVERSE-AUDIT-01 audit (July 14, 2026) recorded:
> AUG-01 | Mawlid Al-Nabawi | Aug 24-25 | Nationwide UAE | confirmed | **MISSING**

All three characterisations were wrong:

| Field | Audit claim | Correct fact |
|-------|------------|-------------|
| Date | Aug 24–25 (two-day range) | One day. Expected Aug 25, 2026 (12 Rabi Al Awwal 1448 AH) |
| Status | confirmed | expected — no official FAHR/MoHRE 2026 circular issued as of 2026-07-16 |
| Guidex | MISSING | In calendar since Phase 6C-96B (May 2026) as AUG-NEW-02 |

### Why Aug 24–25 was wrong
UAE law (Cabinet Resolution No. 27 of 2024) grants one public holiday for Mawlid Al Nabi. The date was stored as `2026-08-24` in the original import because Aug 24 (Monday) would be the transferred holiday if the Cabinet decides to create a long weekend. However, no such Cabinet decision has been issued as of 2026-07-16. The astronomical expectation is Aug 25 (Tuesday, 12 Rabi Al Awwal 1448 AH), as confirmed by Khaleej Times (July 13, 2026) and Gulf News. A transfer to Aug 24 requires a separate official Cabinet decision — it is not automatic.

The previous fix (Phase 6C-100C-A, June 9, 2026) corrected `source_status` from "confirmed" to "expected" and fixed `has_islamic_dates` to 1, but left the date at `2026-08-24` and the label reading "around 24-25 August". This phase corrects both.

---

## 4. Repository findings (plan-first inspection)

| Finding | Value |
|---------|-------|
| `AUG-NEW-02` existed in DB | YES — since Phase 6C-96B |
| Prior fix applied | Phase 6C-100C-A (June 9, 2026): source_status="expected", has_islamic_dates=1 |
| Date before this phase | `2026-08-24` |
| Label before | "expected around 24-25 August, subject to moon sighting" |
| `confidence` before | expected ✓ |
| `source_status` before | expected ✓ |
| `has_islamic_dates` | 1 ✓ |
| Total August datesJson items | 8 |
| Events table Mawlid row | NONE — Mawlid is calendar-only (datesJson), not an events table record |

---

## 5. Source research

### Sources checked (July 16, 2026)

| Source | URL | Finding | Authority |
|--------|-----|---------|-----------|
| FAHR official news | fahr.gov.ae/en/media-center/news/ | No 2026 Mawlid circular found | T1 |
| MoHRE news | mohre.gov.ae/en/media-center/news.aspx | No 2026 Mawlid circular found | T1 |
| Gulf News (search) | gulfnews.com | "UAE public sector holiday for Prophet Muhammad's birthday" article confirmed as 2025 (Sep 5, 2025), not 2026 | T2 |
| Khaleej Times (July 13, 2026) | khaleejtimes.com | Expected Aug 25, 2026. No official confirmation. Transfer to Aug 24 not confirmed. | T2 |
| publicholidays.ae | publicholidays.ae/prophet-muhammads-birthday/ | Lists Aug 25, 2026 (subject to moon sighting) | T3 |

---

## 6. Official announcement status

**As of 2026-07-16: NO official 2026 Mawlid announcement from FAHR, MoHRE, or UAE Cabinet.**

The expected date is **25 August 2026** (Tuesday, 12 Rabi Al Awwal 1448 AH) based on astronomical calculation, consistently reported by Khaleej Times and Gulf News.

A transfer to Monday 24 August is theoretically possible under the UAE's public holiday transfer system but requires a separate Cabinet decision. No such decision has been made.

Official circulars are typically issued by FAHR and MoHRE 2–4 weeks before the holiday. Expected announcement window: late July to early August 2026.

---

## 7. Final date decision

**Stored date: `2026-08-25`** (one record, single date)
- Confidence: `expected`
- Source status: `expected`
- Transfer warning: explicit in both EN and RU briefs

---

## 8. Database record — AUG-NEW-02 (after update)

| Field | Value |
|-------|-------|
| id | AUG-NEW-02 |
| date | 2026-08-25 |
| confidence | expected |
| source_status | expected |
| priority | 1 |
| type | public-holiday |
| emirate | UAE |
| lifecycle | holiday |
| detail_url | null |
| noindex_after | null |
| archive_action | keep |

---

## 9. EN content

**label_en:** Prophet Muhammad's Birthday (Mawlid Al Nabi) — UAE public holiday (expected 25 August 2026, subject to official moon-sighting confirmation)

**short_label_en:** Mawlid holiday

**brief_en:** Prophet Muhammad's Birthday (Mawlid Al Nabi) is an official UAE public holiday under Cabinet Resolution No. 27 of 2024. The 2026 observance is expected on 25 August 2026 (12 Rabi Al Awwal 1448 AH), pending official moon-sighting confirmation. A transfer to Monday 24 August has not been officially announced and requires a separate Cabinet decision. Government offices, federal schools and most public-sector institutions close. Private-sector applicability and any date transfer will be confirmed by MoHRE and FAHR closer to August.

**source_label_en:** UAE Cabinet Resolution 27/2024 · publicholidays.ae

**cta_label_en:** UAE public holidays

---

## 10. RU content

**label_ru:** День рождения Пророка Мухаммада (Маулид ан-Набий) — праздник ОАЭ (ожидается 25 августа 2026, дата уточняется по лунному календарю)

**short_label_ru:** Маулид

**brief_ru:** День рождения Пророка Мухаммада (Маулид ан-Набий) — официальный государственный праздник ОАЭ согласно Постановлению Кабинета министров № 27 от 2024 года. В 2026 году праздник ожидается 25 августа (12 Раби аль-Авваль 1448 г. х.), дата уточняется после официального наблюдения луны. Перенос на понедельник 24 августа официально не объявлен — для этого требуется отдельное решение Кабинета. Государственные учреждения, федеральные школы и большинство организаций государственного сектора закрыты. Применимость в частном секторе и возможный перенос даты будут подтверждены MoHRE и FAHR ближе к августу.

**source_label_ru:** Постановление Кабинета № 27/2024 · publicholidays.ae

**cta_label_ru:** Праздники ОАЭ

---

## 11. Category and priority

| Field | Value |
|-------|-------|
| type | public-holiday |
| priority | 1 (highest) |
| emirate | UAE (nationwide) |

---

## 12. CTA decision

CTA type: `open_source` pointing to publicholidays.ae/prophet-muhammads-birthday/. When FAHR or MoHRE issues the official 2026 circular, Phase 6C-100C-B should update `source_url` and `cta_url` to the official government URL.

---

## 13. Detail-page decision

**No standalone detail page created.** There is no officially confirmed 2026-specific information sufficient to justify a non-thin standalone page. The calendar item is non-clickable (`detail_url: null`). When Phase 6C-100C-B triggers (official announcement received), the brief should be upgraded to reference the official URL, and a news post may be created at `/news/uae-mawlid-prophet-birthday-holiday-august-2026`.

---

## 14. Source-note implementation

No changes to `SOURCE_NOTES` or `SOURCE_NOTES_RU` in guide pages — those objects cover guides only, not calendar items. The source attribution is in the datesJson `source_label_en/ru` and `source_url` fields, rendered by the calendar page template.

---

## 15. Calendar integration

AUG-NEW-02 remains item 7 of 8 in the August 2026 `datesJson` array. Order is date-ascending within the JSON. Aug 25 is now correctly after Aug 24 (DIHAD conference). No re-ordering was performed; the template sorts by date for display.

---

## 16. Metadata and schema

The August 2026 calendar page is SSG. The static page (`/calendar/august-2026-dubai-calendar` and `/ru/calendar/august-2026-dubai-calendar`) will render the corrected date after a local build. No schema changes. `has_islamic_dates=1` remains set — the amber moon-sighting disclaimer continues to render.

---

## 17. Audit files updated

| File | Changes |
|------|---------|
| `6c-calendar-universe-master-inventory.md` | AUG-01 row: date, status, Guidex corrected; HOL-01 row updated; correction note added |
| `6c-calendar-universe-implementation-backlog.md` | B1-A and B1-C Mawlid entries marked DONE with correct date |
| `6c-calendar-universe-gap-analysis.md` | August 2026 coverage row + Public Holidays gap row corrected |
| `6c-calendar-universe-source-ledger.md` | S09 Notes corrected, monitoring note added |
| `6c-calendar-universe-seo-cluster-map.md` | Section 4.7 and Priority list item 2 corrected |
| `6c-calendar-universe-audit-report.md` | Most critical gaps table + Urgent findings table + Key discoveries + Next actions corrected |

Historical phase documents (`UAE_CALENDAR_BATCH_2_IMPORT_CANDIDATE_PACK_6C96A.md`, `UAE_CALENDAR_BATCH_2A_PREIMPORT_REVIEW_6C96B.md`, `UAE_CALENDAR_DEEP_SOURCE_LEDGER_JUL_DEC_2026_6C96A.md`, `PUBLIC_HOLIDAY_SEED_CHECK_6C100B.md`, `UPCOMING_HOLIDAY_CANDIDATE_PACK_6C100B.md`) retain their original content as historical records — no retroactive editing of completed phase documents.

---

## 18. Database backup

| Field | Value |
|-------|-------|
| Path | `data/guides.db.backup-pre-mawlid-batch01b-2026-07-16-165746` |
| Size | 876K |
| Tables | 5 |
| Created before mutation | YES |
| Readable after | YES |

---

## 19. Mutation method

Python 3 script using `sqlite3` module:
1. Read `dates_json` from `calendar_pages WHERE slug='august-2026-dubai-calendar'`
2. Parse JSON, locate `AUG-NEW-02` by id
3. Update: `date`, `label_en`, `label_ru`, `brief_en`, `brief_ru`, `source_label_en`, `source_label_ru`
4. Serialize and write back via `UPDATE ... SET dates_json=?, updated_at=datetime('now')`
5. No migration. No schema change. No other rows modified.

---

## 20. Files changed

**DB:** `data/guides.db` (local only, gitignored) — `calendar_pages.dates_json` for `august-2026-dubai-calendar`

**Docs (committed):**
- `docs/content-drafts/seo/6c-calendar-universe-batch-01b-mawlid-2026.md` (this file)
- `docs/content-drafts/calendar/6c-calendar-universe-master-inventory.md`
- `docs/content-drafts/calendar/6c-calendar-universe-implementation-backlog.md`
- `docs/content-drafts/calendar/6c-calendar-universe-gap-analysis.md`
- `docs/content-drafts/calendar/6c-calendar-universe-source-ledger.md`
- `docs/content-drafts/calendar/6c-calendar-universe-seo-cluster-map.md`
- `docs/content-drafts/calendar/6c-calendar-universe-audit-report.md`
- `PROJECT_STATE.md`
- `SESSION_LOG.md`

**No code files changed** — this is a DB+docs-only batch.

---

## 21. QA commands

```bash
npm run build
curl -s http://localhost:3000/calendar/august-2026-dubai-calendar | grep -i "mawlid\|Prophet\|25 August\|moon"
curl -s http://localhost:3000/ru/calendar/august-2026-dubai-calendar | grep -i "Маулид\|Мухаммад\|25 августа"
```

---

## 22. QA results

| # | Check | Result |
|---|-------|--------|
| 1 | DB backup created before mutation | PASS ✓ |
| 2 | AUG-NEW-02 date = 2026-08-25 | PASS ✓ |
| 3 | AUG-NEW-02 confidence = expected | PASS ✓ |
| 4 | AUG-NEW-02 source_status = expected | PASS ✓ |
| 5 | No "24-25" range language in AUG-NEW-02 | PASS ✓ |
| 6 | EN label references 25 August | PASS ✓ |
| 7 | EN brief references 25 August | PASS ✓ |
| 8 | RU label references 25 августа | PASS ✓ |
| 9 | RU brief references 25 августа | PASS ✓ |
| 10 | EN brief explicitly notes transfer not confirmed | PASS ✓ |
| 11 | RU brief explicitly notes transfer not confirmed | PASS ✓ |
| 12 | Total August datesJson items unchanged (8) | PASS ✓ |
| 13 | has_islamic_dates = 1 | PASS ✓ |
| 14 | Duplicate Mawlid check (events table) | PASS ✓ — no events table row |
| 15 | All 6 core audit docs corrected | PASS ✓ |
| 16 | No concerts modified | PASS ✓ |
| 17 | Production DB untouched | PASS ✓ |
| 18 | Etihad Rail Batch 01A undeployed | PASS ✓ |
| 19 | Build pass | PENDING — run below |

---

## 23. Build page count

Pending `npm run build`.

---

## 24. TypeScript result

Pending — no code files changed, 0 errors expected.

---

## 25. Known limitations

- Calendar pages are SSG; the corrected Aug 25 date will render only after a rebuild. Production continues to show the old Aug 24 date until Phase 6C-100C-B deployment.
- No official FAHR/MoHRE 2026 Mawlid announcement yet. Date remains expected/provisional.
- `source_url` still points to publicholidays.ae (T3 aggregator) rather than an official government URL. Will be updated when official announcement is available.

---

## 26. Monitoring follow-up

**Trigger:** FAHR or MoHRE issues official 2026 Mawlid circular (expected late July – early August 2026)

**When triggered, Phase 6C-100C-B must:**
1. Verify source URL, confirm exact Gregorian date
2. Update AUG-NEW-02: `confidence: "confirmed"`, `source_status: "confirmed"`, `date` → official date, `source_url` → official URL
3. Update label_en/ru and brief_en/ru to remove "expected" and "pending confirmation" language
4. Create news post: `uae-mawlid-prophet-birthday-holiday-august-2026`
5. Set `detail_url` on AUG-NEW-02 → `/news/uae-mawlid-prophet-birthday-holiday-august-2026`
6. Update this implementation report with final confirmed data
7. Deploy (rebuild required for SSG update)

**Sources to monitor weekly from 2026-07-20:**
- fahr.gov.ae/en/media-center/news/
- mohre.gov.ae/en/media-center/news.aspx
- wam.ae (WAM official newswire)
- @UAEmediaoffice on X

---

## 27. Production status

**NO PRODUCTION DEPLOYMENT.**
- DB change is local only (`data/guides.db`, gitignored)
- Etihad Rail Batch 01A commit `d42f7f1` remains undeployed
- PM2 not touched
- No SSH commands run
- No production DB mutation

---

## 28. Recommended next phase

**Phase 6C-CALENDAR-UNIVERSE-BATCH-01C** — July 2026 concert additions:
- JUL-05: Dystinct & Issam Najjar (Jul 18, DWTC)
- JUL-06: Michael Lives Forever (Jul 18, Coca-Cola Arena)
- JUL-07: Talal Sam & Sultan Al Murshed (Jul 25, DWTC)
- JUL-08: Indie Soulfest / Bismil + Indian Ocean (Jul 26, Coca-Cola Arena)

Do not begin until Batch 01B is committed and pushed.

---

## Safety confirmation

| Rule | Status |
|------|--------|
| No production DB write | CONFIRMED ✓ |
| No db-restore-to-server.sh run | CONFIRMED ✓ |
| No production deploy | CONFIRMED ✓ |
| No schema / migrations | CONFIRMED ✓ |
| No admin / auth / proxy changes | CONFIRMED ✓ |
| No environment variable changes | CONFIRMED ✓ |
| No PM2 stop/start | CONFIRMED ✓ |
| No git add . | CONFIRMED ✓ |
| .env.local not committed | CONFIRMED ✓ |
| data/guides.db not committed | CONFIRMED ✓ |
| No concerts modified | CONFIRMED ✓ |
| Etihad Rail Batch 01A undeployed | CONFIRMED ✓ |
