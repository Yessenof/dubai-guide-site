# Hijri New Year 2026 — Local QA Report & Production Approval Prompt
## Phase 6C-100A | Date: 2026-06-09

---

## Status: LOCAL QA COMPLETE — AWAITING OWNER APPROVAL FOR PRODUCTION

---

## 1. What was done (local only)

| Action | Status |
|---|---|
| Source verification docs created | Done |
| Import plan doc created | Done |
| Radar gap fix doc created | Done |
| Import script created (`scripts/hijri-new-year-2026-local-import-6c100a.ts`) | Done |
| Local DB backed up | Done → `backups/local/guides.db.pre-hijri-6c100a-2026-06-09T12-26-49` |
| JUN-15-HIJRI added to `june-2026-dubai-calendar` dates_json | Done |
| `has_islamic_dates` set to 1 on `june-2026-dubai-calendar` | Done |
| News post `uae-hijri-new-year-holiday-june-15-2026` inserted | Done |
| `npm run build` passed | Done — 88 pages, 0 TypeScript errors |
| Local QA (19-item checklist) passed | Done — all 19 items pass |
| Production DB write | NOT done |
| Deploy / push / commit | NOT done |

---

## 2. Source quality

**Classification:** MEDIA_CONFIRMED_OFFICIAL_ANNOUNCEMENT_CITED + OFFICIAL_SOCIAL_SIGNAL_FOUND

| Source | Status | Notes |
|---|---|---|
| Gulf News | 200 ✓ | Used as source_url; cites FAHR + MoHRE joint announcement |
| Khaleej Times | 200 ✓ | Corroboration |
| The National | 200 ✓ | Corroboration; article dated June 03 |
| FAHR official | 200 (no direct article URL) | Site live; JS-rendered; article URL not verified |
| MoHRE official | 200 (no direct article URL) | Site live; JS-rendered; article URL not verified |
| u.ae official portal | 200 ✓ | Legal framework confirmed |
| Gulf News / DGHR | 200 ✓ | Dubai Government holiday confirmed |

No direct FAHR/MoHRE press release URL found. Three independent tier-1 sources all confirm June 15, 2026. Source standard: MEDIA_CONFIRMED_OFFICIAL_ANNOUNCEMENT_CITED — sufficient for production import.

---

## 3. What was imported (local DB)

### Calendar update: `june-2026-dubai-calendar`

- `dates_json`: 8 entries → 9 entries
- New entry at position 0 (priority 1 public holiday first):
  ```json
  {
    "id": "JUN-15-HIJRI",
    "date": "2026-06-15",
    "label_en": "UAE public holiday: Hijri New Year 1448 AH",
    "label_ru": "Выходной в ОАЭ: исламский Новый год 1448 г.х.",
    "type": "public-holiday",
    "confidence": "confirmed",
    "priority": 1,
    "detail_url": "/news/uae-hijri-new-year-holiday-june-15-2026",
    "source_url": "https://gulfnews.com/uae/uae-declares-monday-a-public-holiday-for-islamic-new-year-1.500562040"
  }
  ```
- `has_islamic_dates`: 0 → 1
- `updated_at`: 2026-06-09 12:26:49
- All 8 original entries preserved

### News post: `uae-hijri-new-year-holiday-june-15-2026`

| Field | Value |
|---|---|
| id | d1b310e7-7097-4cf9-9391-aca501db126b |
| status | published |
| category | government |
| noindex | 0 |
| ru_published | 1 |
| featured_homepage | 0 |
| featured_digest | 0 |
| source_label | media_citing_official |
| source_url | Gulf News URL |
| date_published | 2026-06-09 |
| en_seo_title | UAE Hijri New Year Holiday 2026: Monday 15 June Confirmed |
| ru_seo_title | Выходной на исламский Новый год 2026 в ОАЭ: подтверждён понедельник, 15 июня |

---

## 4. Local QA checklist results (19/19 pass)

| # | Check | Result |
|---|---|---|
| 1 | JUN-15-HIJRI at position 0 in dates_json | PASS |
| 2 | type: "public-holiday", priority: 1, confidence: "confirmed" | PASS |
| 3 | source_url → Gulf News URL | PASS |
| 4 | detail_url → /news/uae-hijri-new-year-holiday-june-15-2026 | PASS |
| 5 | brief_en and brief_ru present and accurate | PASS |
| 6 | has_islamic_dates = 1 on june-2026-dubai-calendar | PASS |
| 7 | News post exists with correct slug | PASS |
| 8 | News post status = published | PASS |
| 9 | News post ru_published = 1 | PASS |
| 10 | News post source_url = Gulf News URL | PASS |
| 11 | No duplicate JUN-15-HIJRI entries (1 only) | PASS |
| 12 | All 8 original June entries preserved (now 9 total) | PASS |
| 13 | Build passes — 88 pages, 0 TS errors | PASS |
| 14 | /news/uae-hijri-new-year-holiday-june-15-2026 returns 200 | PASS |
| 15 | /ru/news/uae-hijri-new-year-holiday-june-15-2026 returns 200 | PASS |
| 16 | /calendar/june-2026-dubai-calendar returns 200, shows June 15 holiday | PASS |
| 17 | /ru/calendar/june-2026-dubai-calendar returns 200 | PASS |
| 18 | No production DB write | PASS |
| 19 | No deploy | PASS |

---

## 5. What the pages render

- `/news/uae-hijri-new-year-holiday-june-15-2026` — EN news page, NewsArticle JSON-LD, title "UAE Hijri New Year Holiday 2026: Monday 15 June Confirmed"
- `/ru/news/uae-hijri-new-year-holiday-june-15-2026` — RU news page, NewsArticle JSON-LD, title "Выходной на исламский Новый год 2026 в ОАЭ: подтверждён понедельник, 15 июня"
- `/calendar/june-2026-dubai-calendar` — June 2026 calendar with "Hijri New Year holiday" at top of June 15 entries (public-holiday type, priority 1)
- `/ru/calendar/june-2026-dubai-calendar` — RU calendar with "исламский Новый год" label

---

## 6. Hard-stop compliance

| Rule | Status |
|---|---|
| No production DB write | Confirmed |
| No deploy | Confirmed |
| No push | Confirmed |
| No commit | Confirmed |
| No migrations | Confirmed |
| No schema changes | Confirmed |
| No unrelated changes | Confirmed |

---

## 7. Urgency

Holiday: Monday 15 June 2026 — 6 days away. If production deploy happens today (June 9), the calendar and news post will be live 6 days before the holiday. Recommended to approve and deploy immediately.

---

## 8. Production approval prompt

**To approve production deploy of Phase 6C-100A:**

PHASE 6C-100A APPROVED — deploy Hijri New Year 2026 to production.

Deploy command: `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"`

DB restore command: `bash scripts/db-restore-to-server.sh` (run before deploy)

Commit must include:
- `docs/content-drafts/calendar/HIJRI_NEW_YEAR_2026_SOURCE_VERIFICATION_6C100A.md`
- `docs/content-drafts/calendar/HIJRI_NEW_YEAR_2026_IMPORT_PLAN_6C100A.md`
- `docs/content-drafts/calendar/HIJRI_NEW_YEAR_2026_PRODUCTION_REPORT_6C100A.md`
- `docs/content-drafts/seo/PUBLIC_HOLIDAY_RADAR_GAP_FIX_6C100A.md`
- `scripts/hijri-new-year-2026-local-import-6c100a.ts`
- `PROJECT_STATE.md`
- `SESSION_LOG.md`

DB write on production: Must run `scripts/hijri-new-year-2026-local-import-6c100a.ts` against production DB via restore script, OR push local DB to server.

The recommended approach is:
1. Backup production DB: `bash scripts/db-backup-from-server.sh`
2. Run local import script against the production DB backup
3. Restore to server: `bash scripts/db-restore-to-server.sh`
4. Commit + push docs + scripts + memory files
5. Deploy: SSH command above

STRICTLY FORBIDDEN: no migrations, no schema changes, no admin panel changes, no unrelated file changes, no destructive commands.

---

## 9. Files created this phase

| File | Purpose |
|---|---|
| `docs/content-drafts/calendar/HIJRI_NEW_YEAR_2026_SOURCE_VERIFICATION_6C100A.md` | Source quality verification |
| `docs/content-drafts/calendar/HIJRI_NEW_YEAR_2026_IMPORT_PLAN_6C100A.md` | Full import plan with exact content |
| `docs/content-drafts/calendar/HIJRI_NEW_YEAR_2026_PRODUCTION_REPORT_6C100A.md` | This file |
| `docs/content-drafts/seo/PUBLIC_HOLIDAY_RADAR_GAP_FIX_6C100A.md` | Radar gap root cause + prevention strategy |
| `scripts/hijri-new-year-2026-local-import-6c100a.ts` | Import script (local and production) |

---

## 10. Radar gap — post-phase actions required

After production deploy, check:
- Prophet's Birthday 1448 (~Sep 4, 2026) — verify present in september calendar
- UAE Commemoration Day (Dec 1, 2026) — verify present in december calendar
- UAE National Day (Dec 2-3, 2026) — verify present in december calendar

Full prevention strategy: `docs/content-drafts/seo/PUBLIC_HOLIDAY_RADAR_GAP_FIX_6C100A.md`
