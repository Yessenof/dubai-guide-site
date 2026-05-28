# Phase 6C-82 — July 2026 Calendar Production Import Report

**Date:** 2026-05-28
**Phase:** 6C-82
**Type:** Production import — calendar_pages +1
**Preceded by:** Phase 6C-81 (local import QA, commit 81d21a9)

---

## 1. Summary

| Item | Result |
|------|--------|
| Production import | SUCCESS |
| Operation | CREATE (new row — slug did not exist) |
| Row slug | `july-2026-dubai-calendar` |
| Row ID (production) | `48233336-4d9c-442a-b990-23287a97c34d` |
| Status | published |
| 13-route live QA | PASS — all 200 |
| Content invariants (22 checks) | PASS |
| EN robots | index, follow |
| RU robots | index, follow |
| CSS | 200 text/css |
| Sitemap EN+RU | PASS |
| June page unaffected | PASS (4 `<details>`, Mallathon brief confirmed) |
| E-invoicing page unaffected | PASS |
| News/events/guides changed | NO |
| Production DB delta | calendar_pages 5→6, all others unchanged |
| em dash violations | 0 |
| Deploy sequence | pm2 stop → npm run build → pm2 start |

---

## 2. Preflight Results

### 2.1 Git status on production server

```
HEAD: 81d21a9  docs: prepare july calendar local import qa
```

Server was behind (at `5bac54d`). `git pull origin main` was run to sync commits `c4b41ca` and `81d21a9`. Fast-forward with no conflicts. Script `scripts/july-2026-calendar-import-6c81.ts` confirmed present after pull.

### 2.2 Production DB state before import

| Table | Count before | Count after |
|-------|-------------|------------|
| calendar_pages | 5 | 6 |
| news_posts | 3 | 3 |
| events | 1 | 1 |
| guides | 17 | 17 |

### 2.3 Slug pre-flight

`july-2026-dubai-calendar` confirmed NOT present in production DB before import. Safe to CREATE.

### 2.4 Content safety scan

Em dash in script: appears only as `const EM = "—"` (the guard constant) and in an exclusion log comment — neither reaches the DB. All 13 public strings are em-dash clean (confirmed by script's own assertClean checks).

"Timur Bey" appears only in the excluded-items console.log summary — not in any DB-bound string.

---

## 3. Production DB Backup

| Field | Value |
|-------|-------|
| Backup path | `/var/backups/guidex/guides.db.pre-july-calendar-6c82-20260528-193114` |
| Backup size | 616K |
| Created | 2026-05-28 19:31:14 (server time) |

---

## 4. Import Execution

Script: `scripts/july-2026-calendar-import-6c81.ts`

Output:
```
All strings clean -- no em dashes found.
Slug "july-2026-dubai-calendar" not found -- safe to create.
3 items, no duplicates. IDs: JUL-03-DSS, JUL-03-MODESH, JUL-03-KHAIR.
Draft created. id=48233336-4d9c-442a-b990-23287a97c34d  Warnings: none
Published. Warnings: none
```

---

## 5. Dates_JSON Items Imported

| ID | Date | Label EN | Type | Level | Source |
|----|------|----------|------|-------|--------|
| JUL-03-DSS | 2026-07-03 | Dubai Summer Surprises 2026 opens (3 July to 30 August) | retail_offer | L2 (EN+RU brief, ~130 words EN) | DFRE / Visit Dubai official |
| JUL-03-MODESH | 2026-07-03 | Modesh World opens at Dubai World Trade Centre (within DSS) | family | L1 (no brief) | DWTC / DFRE annual |
| JUL-03-KHAIR | 2026-07-03 | Muntazah Al Khairan: Theatrical Comedy at Dubai Opera (3-4 July, within DSS) | entertainment | L1 (no brief) | Platinumlist (authorized Dubai Opera partner) |

---

## 6. Deploy Sequence

```
pm2 stop guidex-production        ✓ stopped
npm run build                      ✓ success (no errors)
pm2 start guidex-production        ✓ online (pid 187226, 128MB mem)
```

---

## 7. Live Production QA — 13 Routes

| Route | Status |
|-------|--------|
| GET /calendar/july-2026-dubai-calendar | 200 |
| GET /ru/calendar/july-2026-dubai-calendar | 200 |
| GET /calendar?month=2026-07 | 200 |
| GET /ru/calendar?month=2026-07 | 200 |
| GET /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| GET /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| GET /calendar/june-2026-dubai-calendar | 200 |
| GET /ru/calendar/june-2026-dubai-calendar | 200 |
| GET /calendar | 200 |
| GET /ru/calendar | 200 |
| GET / | 200 |
| GET /ru | 200 |
| GET /sitemap.xml | 200 |

All 13: 200 OK.

---

## 8. Content Invariants — 22 Checks

| Check | Result |
|-------|--------|
| EN `<details>` count = 1 | PASS |
| EN DSS brief present in initial HTML | PASS |
| EN Modesh World label | PASS |
| EN Muntazah Al Khairan label | PASS |
| EN Beat the Heat not standalone | PASS (named within DSS brief only) |
| EN Timur Bey absent | PASS |
| EN RE:SET absent | PASS |
| EN e-invoicing Jul 1 not duplicated | PASS |
| EN DSS CTA href (visitdubai.com) | PASS |
| EN no raw JSON field names | PASS |
| EN no raw Markdown | PASS |
| EN en_notes (DFRE official programme note) | PASS |
| RU `<details>` count = 1 | PASS |
| RU DSS brief present | PASS |
| RU Modesh World label | PASS |
| RU Muntazah Al Khairan label | PASS |
| RU no EN fallback in brief | PASS |
| RU Timur Bey absent | PASS |
| RU no raw Markdown | PASS |
| RU ru_notes (официальная программа DFRE) | PASS |
| EN title set | PASS |
| RU title set | PASS |

---

## 9. SEO and Sitemap

| Check | Value |
|-------|-------|
| EN `<title>` | July 2026 Dubai calendar: Dubai Summer Surprises opens 3 July — Guidex Consulting |
| RU `<title>` | Дубай, июль 2026: Dubai Summer Surprises открывается 3 июля — Guidex Consulting |
| EN meta description | July 2026 in Dubai: Dubai Summer Surprises (DSS) runs 3 July to 30 August with mall discounts, Modesh... |
| RU meta description | Июль 2026 в Дубае: фестиваль Dubai Summer Surprises с 3 июля по 30 августа, скидки в моллах, Modesh... |
| EN robots | index, follow |
| RU robots | index, follow |
| Sitemap EN | `https://guidex-consulting.ae/calendar/july-2026-dubai-calendar` — PRESENT |
| Sitemap RU | `https://guidex-consulting.ae/ru/calendar/july-2026-dubai-calendar` — PRESENT |
| CSS | `/_next/static/chunks/0ac1tmhoyyo1o.css` — 200 text/css |

---

## 10. Coverage

| Metric | Value |
|--------|-------|
| Days in July | 31 |
| DSS umbrella span in July | Jul 3–31 = 29 days |
| Jul 2 (gap) | 1 day — no confirmed source-safe item |
| Jul 1 (e-invoicing) | Live at `uae-e-invoicing-2026-asp-deadline` — not duplicated in July calendar |
| Calendar-only coverage | **93.5%** (29/31 days) |
| Combined with e-invoicing Jul 1 | **97%** (30/31 days) |
| Owner 60-70% source-safe target | **Exceeded** |

---

## 11. Excluded Items (Hold / Signal-Only)

| Item | Status | Monitor |
|------|--------|---------|
| Beat the Heat DXB Season 5 | HOLD | beattheheatdxb.ae from ~mid-June 2026 |
| Modesh World 2026 specific dates | HOLD | dwtc.com/en/events/ from ~mid-June 2026 |
| Great Dubai Summer Sale 2026 phase dates | HOLD | DFRE / visitdubai.com from ~Jul 10-17 |
| Timur Bey 2 at CCA Jul 9 | signal_only | coca-cola-arena.com / Platinumlist |
| Cinema Akil summer 2026 programme | Not yet announced | cinemaakil.com from early June 2026 |
| Expo City Dubai July | Confirmed no events | Recheck August |
| Islamic New Year (~Jun 15-16) | HOLD | fahr.gov.ae |

---

## 12. Existing Pages Unaffected

| Check | Result |
|-------|--------|
| June 2026 calendar — Mallathon brief | PASS |
| June 2026 calendar — `<details>` count | PASS (4, unchanged) |
| E-invoicing page renders | PASS |
| news_posts count | 3 (unchanged) |
| events count | 1 (unchanged) |
| guides count | 17 (unchanged) |

---

## 13. What Was Not Touched

- Code: not modified
- Schema/migrations: not changed
- Env/secrets: not touched
- Admin/auth/proxy: not touched
- news_posts: unchanged
- events: unchanged
- guides: unchanged
- Any other calendar_pages rows: unchanged

---

## 14. GSC Next Action

- Submit `/calendar/july-2026-dubai-calendar` for URL inspection in Google Search Console
- Submit `/ru/calendar/july-2026-dubai-calendar` for URL inspection
- Monitor indexing for both EN and RU versions over next 7-14 days

---

## 15. Phase Commits

| Commit | Message |
|--------|---------|
| 81d21a9 | docs: prepare july calendar local import qa (Phase 6C-81) |
| c4b41ca | docs: enrich july dss summer calendar candidates (Phase 6C-80) |
| Phase 6C-82 report commit | docs: report july calendar production import |
