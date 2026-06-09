# Mawlid 2026 Status Fix — Phase 6C-100C-A
## Date: 2026-06-09 | Status: PRODUCTION COMPLETE
## Commit: 21092df | Deploy: 2026-06-09 18:04 UTC

---

## Phase summary

Two DB consistency bugs found in Phase 6C-100B (audit) were fixed in this phase:

1. `august-2026-dubai-calendar.has_islamic_dates = 0` → fixed to `1`
2. `AUG-NEW-02.source_status = "confirmed"` → fixed to `"expected"`

Mawlid confidence intentionally remains `"expected"` — FAHR/MoHRE has not yet issued the official 2026 announcement. This is correct behaviour.

---

## Production DB backup

| Field | Value |
|---|---|
| Backup path | `/var/backups/guidex/guides.db.pre-mawlid-flags-6c100ca-20260609-155216` |
| Backup size | 788K |
| Tables | 5 |
| Script-side backup | `/var/www/guidex/backups/local/guides.db.pre-mawlid-flags-6c100ca-2026-06-09T18-03-35` |

---

## Values: before vs after

| Field | Before | After |
|---|---|---|
| `august-2026-dubai-calendar.has_islamic_dates` | 0 | **1** |
| `AUG-NEW-02.source_status` | "confirmed" | **"expected"** |
| `AUG-NEW-02.confidence` | "expected" | "expected" (unchanged) |
| `AUG-NEW-02.date` | 2026-08-24 | 2026-08-24 (unchanged) |
| Total dates in August | 8 | 8 (unchanged) |
| Other August items | — | unchanged |

---

## Script used

`scripts/fix-august-mawlid-flags-6c100ca.ts`

Idempotent. Assertion-guarded on:
- AUG-NEW-02 exists
- Confidence must be "expected" before running (guards against running after FAHR confirms Mawlid)
- Total date count unchanged
- Other items unchanged

---

## Deploy / rebuild

| Field | Value |
|---|---|
| Deploy needed | YES — `has_islamic_dates` controls a visible amber disclaimer on the SSG calendar page |
| Deploy command | `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"` |
| Build time | 51s |
| PM2 reload | ~1s |
| PM2 status post-deploy | online, 146.6MB |
| Commit at deploy | 21092df |

Why rebuild was needed: Both EN (`app/(en)/(public)/calendar/[slug]/page.tsx:143`) and RU (`app/ru/calendar/[slug]/page.tsx:137`) calendar templates render an amber disclaimer box when `page.hasIslamicDates === 1`. These pages are SSG (prerendered at build time). A DB-only change would not update the static HTML without a rebuild.

---

## Live QA results (10/10 pass)

| # | Check | Expected | Actual | Pass |
|---|---|---|---|---|
| 1 | EN August calendar route | 200 | 200 | PASS |
| 2 | RU August calendar route | 200 | 200 | PASS |
| 3 | Sitemap | 200 | 200 | PASS |
| 4 | EN Islamic disclaimer visible | moon-sighting text | 4 matches | PASS |
| 5 | RU Islamic disclaimer visible | amber + исламских праздник | present | PASS |
| 6 | Mawlid not described as "officially confirmed" | 0 matches | 0 | PASS |
| 7 | Mawlid present in EN calendar | present | 3 matches | PASS |
| 8 | RU Mawlid text present | Маулид / Пророк / лунн | present | PASS |
| 9 | RU no EN fallback ("Mawlid Al Nabi") | 0 | 0 | PASS |
| 10 | No duplicate AUG-NEW-02 | 1 | 1 | PASS |

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| No migrations | Confirmed |
| No schema changes | Confirmed |
| No admin | Confirmed |
| No AI Inbox | Confirmed |
| No unrelated DB writes | Confirmed — only has_islamic_dates + source_status changed |
| No new content import | Confirmed |
| No new news post | Confirmed |
| No source_status upgrade to "confirmed" | Confirmed — set to "expected" |
| No fake official source claim | Confirmed |
| No old PM2 stop/build/start | Confirmed — zero-downtime deploy only |
| No destructive commands | Confirmed |

---

## Source status explanation (why "expected" not "confirmed")

Mawlid Al Nabi 1448 AH (Prophet Muhammad's Birthday) is expected around August 24-25, 2026 based on astronomical calculation (12 Rabi Al Awwal 1448 AH). As of June 9, 2026:

- No direct FAHR or MoHRE press release confirming the exact 2026 Mawlid date was found
- MoHRE news feed (checked June 9): no Mawlid 2026 announcement
- Gulf News lists it as "Tuesday, August 25, 2026 (pending moon sighting confirmation)"
- publicholidays.ae (tier-3 aggregator) lists August 25 without an official source citation

The holiday is a statutory UAE public holiday (Cabinet Resolution No. 27 of 2024), so its existence is confirmed. The exact date is not yet officially confirmed for 2026.

`confidence: "expected"` + `source_status: "expected"` is now internally consistent and accurate.

---

## Follow-up: 6C-100C-B trigger

**When:** FAHR and/or MoHRE issues the official Mawlid 2026 circular (expected ~late July 2026 to early August 2026)

**Watch from:** July 26, 2026 (30 days before expected holiday)

**Sources to monitor weekly:**
- `fahr.gov.ae/en/media-center/news/` — official holiday circular
- `mohre.gov.ae/en/media-center/news.aspx` — private sector confirmation
- `gulfnews.com` — first media signal
- `khaleejtimes.com` — corroboration
- UAE Media Office `@UAEmediaoffice` on X

**When signal found, Phase 6C-100C-B must:**
1. Verify source URL returns 200 and confirms the exact date
2. Classify as READY_OFFICIAL (if FAHR URL found) or MEDIA_CONFIRMED_OFFICIAL_CITED (if only media)
3. Update AUG-NEW-02: `confidence: "confirmed"`, `source_status: "confirmed"`, `source_url` → official URL
4. Create news post: `uae-mawlid-prophet-birthday-holiday-august-2026`
5. Set `detail_url` on AUG-NEW-02 to `/news/uae-mawlid-prophet-birthday-holiday-august-2026`
6. Deploy (rebuild for SSG update)

---

## Files changed/created

| File | Change |
|---|---|
| `scripts/fix-august-mawlid-flags-6c100ca.ts` | Created — fix script |
| `docs/content-drafts/calendar/MAWLID_2026_STATUS_FIX_6C100C_A.md` | Created — this report |
| `PROJECT_STATE.md` | Updated |
| `SESSION_LOG.md` | Updated |

---

*Phase 6C-100C-A complete. Return to Phase 6C-99E next.*
