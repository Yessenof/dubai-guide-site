# Phase 6C-75 — June 2026 Calendar Production Import Report

**Date:** 2026-05-26 (import) / 2026-05-27 (report)
**Phase:** 6C-75
**Type:** Production import and deploy

---

## 1. Pushed Commits

Two approved docs-only commits pushed to origin/main before import:

| Commit | Message |
|--------|---------|
| `3242641` | docs: add june july event source radar and calendar density drafts |
| `925867a` | docs: prepare june 2026 calendar local import qa |

Both were docs-only (no code, no DB, no scripts touching production).
`origin/main` advanced from `0c6ea86` to `925867a`.

---

## 2. Production Preflight

| Check | Result |
|-------|--------|
| Server | UpCloud 85.9.203.69 — confirmed |
| App path | /var/www/guidex — confirmed |
| PM2 process | guidex-production — confirmed |
| Domain | https://guidex-consulting.ae — confirmed |
| git pull | Fast-forward to 925867a — clean |
| No pending unstaged changes | Confirmed (only `scripts/e-invoicing-indexed-brief-local-import-6c68.ts` untracked) |
| Duplicate slug check | No `june-2026-dubai-calendar` row in production DB before import |

---

## 3. Production DB Backup

| Field | Value |
|-------|-------|
| Backup path | `/var/backups/guidex/guides.db.pre-june-calendar-6c75-20260526-195604` |
| Backup size | 576K |
| Backup verified | Yes — non-zero, created before any DB write |

---

## 4. DB Counts Before / After

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| calendar_pages | 4 | 5 | +1 ✓ |
| news_posts | 3 | 3 | 0 ✓ |
| events | 1 | 1 | 0 ✓ |
| guides | 17 | 17 | 0 ✓ |

**Expected delta: calendar_pages +1. Actual delta: calendar_pages +1. Match confirmed.**

---

## 5. Created Row

| Field | Value |
|-------|-------|
| id | `adddc561-74dd-4541-9183-34802f2aedd6` |
| slug | `june-2026-dubai-calendar` |
| status | `published` |
| calendar_type | `monthly` |
| year / month | 2026 / 6 |
| ru_published | 1 |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| last_verified_date | 2026-05-26 |
| featured_homepage | 0 |
| Import script | `scripts/june-2026-calendar-local-import-6c74.ts` |
| Import warnings | 0 |

**dates_json items (5):**

| ID | Date | Type | Level |
|----|------|------|-------|
| JUN-01-VAT | 2026-06-01 | government_update | L2 |
| JUN-01-WPS | 2026-06-01 | compliance | L2 |
| JUN-04-RUMI | 2026-06-04 | venue_show | L1 |
| JUN-05-ACW | 2026-06-05 | event | L2 |
| JUN-11-BEACH | 2026-06-11 | venue_show | L1 |

---

## 6. Build and Deploy

| Step | Result |
|------|--------|
| pm2 stop guidex-production | OK |
| npm run build | Exit 0 — clean build |
| pm2 start guidex-production | Online — pid 172102 |
| Safe deploy rule followed | Yes — PM2 stopped before build |

---

## 7. Live Production QA

### 7.1 HTTP Routes

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

**12/12 routes: 200.**

### 7.2 Content Invariants

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| `<details>` blocks EN | 3 | 3 | PASS |
| `<details>` blocks RU | 3 | 3 | PASS |
| EN brief text in SSR | "Salik toll gate charges" | Found | PASS |
| RU brief text in SSR | "С 1 июня 2026" | Found | PASS |
| No EN fallback on RU | "тарифам на проезд" (RU) | Found | PASS |
| Source label: Salik | "Salik PJSC: official" | Found | PASS |
| Source label: MoHRE | "MoHRE: Ministerial" | Found | PASS |
| Source label: Cinema Akil | "Cinema Akil / Alserkal" | Found | PASS |
| CTA href: salik.ae | Present | Found | PASS |
| CTA href: mohre.gov.ae | Present | Found | PASS |
| CTA href: cinemaakil.com | Present | Found | PASS |
| No raw Markdown (##) | None | None | PASS |
| No raw JSON field names | None | None | PASS |
| No Emiratisation dup | None | None | PASS |

### 7.3 SEO / Robots

| Check | Result |
|-------|--------|
| EN page X-Robots-Tag | None set (index, follow by default) |
| RU page X-Robots-Tag | None set (index, follow by default) |
| `noindex` in HTML | Not present — pages are indexable |

### 7.4 CSS Asset

| Check | Result |
|-------|--------|
| CSS file | `/_next/static/chunks/0ac1tmhoyyo1o.css` |
| HTTP status | 200 |
| Content-Type | `text/css; charset=UTF-8` |
| Size | 70,483 bytes |
| No unstyled page | Page has Tailwind classes in HTML, styled correctly |

### 7.5 Existing Pages Unaffected

| Page | Check | Result |
|------|-------|--------|
| Homepage | Title renders correctly | PASS |
| /ru homepage | RU navigation renders | PASS |
| /calendar/uae-emiratisation-june-30-2026-reminder | Content intact | PASS |
| /calendar/uae-e-invoicing-2026-asp-deadline | Content intact | PASS |
| /calendar hub | June 2026 visible in listing | PASS |

---

## 8. What Was Not Touched

- news_posts: unchanged (3 rows)
- events: unchanged (1 row)
- guides: unchanged (17 rows)
- Existing 4 calendar pages: unchanged
- Schema / migrations: not modified
- env / secrets / GTM / GA4: not touched
- Admin / auth / proxy: not modified
- July calendar: not imported
- Any other calendar page: not imported
- Code files: not modified

---

## 9. Content Safety Summary

- Em dashes in imported content strings: 0
- Em dashes in rendered HTML title: in `— Guidex Consulting` site-wide title template only (not June content)
- No "all events" or "complete calendar" claim in any field
- No media-only items treated as official (all 5 items source-confirmed)
- No duplicate Emiratisation June 30 entry
- All source URLs present: salik.ae, mohre.gov.ae, dubaiopera.com, cinemaakil.com, coca-cola-arena.com

---

## 10. Sitemap Note

**Calendar pages are not in `/sitemap.xml`.** This is a pre-existing gap — none of the 4 existing calendar pages (may-2026-uae-calendar, uae-emiratisation-june-30-2026-reminder, etc.) appear in the sitemap either. The sitemap only lists guides, life-setup pages, and static hub pages. This was not introduced by Phase 6C-75.

Sitemap total: 54 URLs, 0 calendar pages.

**Follow-up task (separate phase):** Add published calendar_pages to the `app/sitemap.ts` generator so Googlebot discovers them without manual URL submission.

---

## 11. GSC Next Action

The June 2026 calendar page is now live at:
- EN: https://guidex-consulting.ae/calendar/june-2026-dubai-calendar
- RU: https://guidex-consulting.ae/ru/calendar/june-2026-dubai-calendar

**GSC actions (manual, owner-triggered):**
1. Submit `/calendar/june-2026-dubai-calendar` for URL indexing in Google Search Console (manual until sitemap is fixed)
2. Submit `/ru/calendar/june-2026-dubai-calendar` as a separate URL
3. Monitor GSC coverage report in 3-5 days for indexing confirmation
4. If FAHR announces Islamic New Year date, add JJ-06 as a follow-up import
5. Plan sitemap fix (add calendar_pages to sitemap.ts) as a separate phase

---

## 12. Phase Complete

**Phase 6C-75 complete. June 2026 calendar page is live on production.**

No production DB changes beyond the approved +1 calendar_pages row.
No deploy incidents. CSS clean. All 12 routes 200. All content invariants pass.
