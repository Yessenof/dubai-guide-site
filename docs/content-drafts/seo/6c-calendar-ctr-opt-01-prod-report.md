# Production Report: 6C-CALENDAR-CTR-OPT-01-PROD
**Type:** GSC-driven title/meta CTR optimization — production deployment
**Date:** 2026-07-13
**Status:** COMPLETE

---

## 1. Phase Summary

Applied 8-field SQLite in-place update to production DB, zero-downtime deploy, and live QA verification for the GITEX Global 2026 event page and August 2026 calendar page.

**Local phase:** 6C-CALENDAR-CTR-OPT-01 (2026-07-12 LOCAL COMPLETE — see `6c-calendar-ctr-opt-01-report.md`)

---

## 2. Pre-Deploy Safety Checks

| Check | Result |
|---|---|
| Server backup created | ✓ `/var/www/guidex/backups/production-db/guides.db.pre-ctr-opt-01-20260713-185822` |
| Backup size | 852K |
| Backup MD5 | `794a296b6a1af846b26de7d409c328b9` |
| SQLite integrity check | `ok` |
| GITEX date in DB before update | `event_date_start: 2026-12-07`, `event_date_end: 2026-12-11` |
| October date safety scan | CLEAN |
| `date_confidence` | `confirmed` |

---

## 3. Production DB Update

**Method:** Narrowly scoped in-place SQLite UPDATE via SSH heredoc. `BEGIN TRANSACTION / COMMIT`. Explicit row count verification after each statement. After-state check for all 8 fields.

**Rows updated:**

| Table | Slug | Rows changed |
|---|---|---|
| `events` | `gitex-global-2026` | 1 |
| `calendar_pages` | `august-2026-dubai-calendar` | 1 |

**Fields updated (8 total):**

| Table | Slug | Field | New value |
|---|---|---|---|
| events | gitex-global-2026 | `en_seo_title` | "GITEX Global 2026: 7–11 December, Dubai" |
| events | gitex-global-2026 | `en_meta_description` | "GITEX Global 2026 runs 7–11 December at Expo City Dubai. Scale Summit on 7 Dec at DWTC. Visitor and business planning guide for Dubai attendees." |
| events | gitex-global-2026 | `ru_seo_title` | "GITEX Global 2026: 7–11 декабря, Дубай" |
| events | gitex-global-2026 | `ru_meta_description` | "GITEX Global 2026 проходит 7–11 декабря в Expo City Dubai. Scale Summit — 7 декабря на DWTC. Путеводитель для деловых гостей." |
| calendar_pages | august-2026-dubai-calendar | `en_seo_title` | "Dubai Events August 2026: Concerts & Festivals" |
| calendar_pages | august-2026-dubai-calendar | `en_meta_description` | "Dubai Summer Surprises through 30 Aug, Def Leppard at Coca-Cola Arena 2 Aug, DIHAD 24–26 Aug. Full August 2026 Dubai events and public holidays." |
| calendar_pages | august-2026-dubai-calendar | `ru_seo_title` | "Дубай, август 2026: концерты и DSS" |
| calendar_pages | august-2026-dubai-calendar | `ru_meta_description` | "Dubai Summer Surprises до 30 августа, Def Leppard — 2 августа, конференция DIHAD 24–26 августа. Все события и праздники в Дубае." |

**Fields NOT changed:**
- `en_title`, `en_body`, `en_summary`, `ru_title`, `ru_body`, `ru_summary` — content unchanged
- `event_date_start`, `event_date_end`, `date_confidence` — dates unchanged
- `status` — both remain published
- JSON-LD schema dates — unchanged (2026-12-07 → 2026-12-11)
- All canonical and hreflang tags — unchanged

---

## 4. Deploy

| Step | Result |
|---|---|
| Script | `bash scripts/deploy-zero-downtime.sh` |
| `git pull origin main` | clean (HEAD: d8a79bc) |
| `npm run build` | 41s — clean |
| `pm2 reload guidex-production --update-env` | graceful reload, ~1s |
| PM2 status after | `guidex-production | online | pid 648098 | 147.3mb` |
| Health check | `https://guidex-consulting.ae/` HTTP 200 ✓ |
| Deploy finished | Mon Jul 13 19:00:35 UTC 2026 |

---

## 5. Live QA — All 4 Routes

| Route | HTTP | Title | GITEX schema dates | Notes |
|---|---|---|---|---|
| `/events/gitex-global-2026` | 200 ✓ | "GITEX Global 2026: 7–11 December, Dubai — Guidex Consulting" ✓ | startDate=2026-12-07, endDate=2026-12-11 ✓ | EN ✓ |
| `/ru/events/gitex-global-2026` | 200 ✓ | "GITEX Global 2026: 7–11 декабря, Дубай — Guidex Consulting" ✓ | startDate=2026-12-07, endDate=2026-12-11 ✓ | RU ✓ |
| `/calendar/august-2026-dubai-calendar` | 200 ✓ | "Dubai Events August 2026: Concerts & Festivals — Guidex Consulting" ✓ | N/A (calendar page) | EN ✓ |
| `/ru/calendar/august-2026-dubai-calendar` | 200 ✓ | "Дубай, август 2026: концерты и DSS — Guidex Consulting" ✓ | N/A (calendar page) | RU ✓ |

**October safety scan on live HTML:** CLEAN on all 4 routes.

---

## 6. Title Length Verification (Production)

| Route | Full `<title>` | Chars |
|---|---|---|
| `/events/gitex-global-2026` | "GITEX Global 2026: 7–11 December, Dubai — Guidex Consulting" | 59 ✓ |
| `/ru/events/gitex-global-2026` | "GITEX Global 2026: 7–11 декабря, Дубай — Guidex Consulting" | 58 ✓ |
| `/calendar/august-2026-dubai-calendar` | "Dubai Events August 2026: Concerts & Festivals — Guidex Consulting" | 66 ✓ |
| `/ru/calendar/august-2026-dubai-calendar` | "Дубай, август 2026: концерты и DSS — Guidex Consulting" | 54 ✓ |

All titles within Google's ~65-char display limit. The "December 7–11" dates are now fully visible in the GITEX SERP title.

---

## 7. GSC Re-Indexing

No automated GSC API access. Manual submission required via GSC URL Inspection tool.

**Manual checklist — submit each URL:**

- [ ] `https://guidex-consulting.ae/events/gitex-global-2026`
- [ ] `https://guidex-consulting.ae/ru/events/gitex-global-2026`
- [ ] `https://guidex-consulting.ae/calendar/august-2026-dubai-calendar`
- [ ] `https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar`

**When:** Submit within 24 hours of deploy. GSC URL Inspection → "Request Indexing".

**Monitor in 3–5 days:** GITEX CTR target 0.15% → 2–3%. August calendar CTR target 1.57% → 3%+.

---

## 8. Safety Confirmations

- DB backup created and verified before any write ✓
- In-place narrowly scoped UPDATE only (not db-restore-to-server.sh) ✓
- 2 rows updated, 8 fields — exactly as approved ✓
- GITEX dates remain December 7–11 throughout (DB, JSON-LD, all 4 live pages) ✓
- October 13–17 not present anywhere in production HTML ✓
- Zero-downtime deploy (graceful PM2 reload, not stop/start) ✓
- No `.env.local` committed ✓
- No `data/guides.db` committed ✓
- No `git add .` used ✓
- Production HEAD: d8a79bc ✓

---

## 9. Expected Outcome

| Page | Before CTR | Target CTR | Rationale |
|---|---|---|---|
| /events/gitex-global-2026 | 0.15% (1 click / 672 imp) | 2–3% (~13–20 clicks) | Dates now visible in truncated SERP title |
| /calendar/august-2026-dubai-calendar | 1.57% (12 clicks / 766 imp) | 3%+ (~23+ clicks) | "Concerts & Festivals" matches query intent |

Monitor in next GSC export (28-day window mid-August).
