# Phase 6C-37 — Emiratisation A-Only Local Import and Launch QA

**Date:** 2026-05-20
**Phase:** 6C-37
**Type:** Local import, route QA, production readiness assessment
**Scope:** TAX-01 — UAE Emiratisation June 30 2026 (news + Calendar Item A only)

---

## Phase objective

1. Recheck MoHRE source URLs live before import
2. Import news draft + Calendar Item A (50+ employees) to local DB only
3. Run EN/RU route QA, robots/index check, content safety check
4. Produce this readiness report

**Item B (20–49 employees) was NOT imported. It remains held.**

---

## Hard restrictions (enforced — zero deviations)

- No Calendar Item B imported
- No new drafts created
- No code touched
- No schema/migrations touched
- No admin used
- No AI Inbox used
- No push performed
- No deploy performed
- No commit performed
- No production touched
- No unsupported employment/compliance claims added
- No AED contribution amount wording changed

---

## Task 1 — MoHRE source recheck

Both URLs rechecked live on 2026-05-20.

| # | URL | HTTP | Content verdict |
|---|-----|------|-----------------|
| 1 | https://mohre.gov.ae/en/media-center/news/7/5/2026/mohre-30-june-deadline-for-achieving-emiratisation-targets-for-first-half-of-2026 | 200 | Confirms June 30 2026 deadline for 50+ employee companies; confirms 1% semi-annual growth in skilled jobs; confirms contributions from 1 July 2026. Does NOT mention 20–49 band at all. |
| 2 | https://mohre.gov.ae/en/labour-care/emiratisation/emiratisation-targets | 200 | Confirms 20–49 employee threshold (1 UAE national in skilled job). Does NOT state June 30 2026 as the deadline for this band. |

**Source recheck verdict:** PASS. Both URLs live and unchanged. Source 1 fully supports all claims in news draft and Calendar Item A. Item B hold validated from both sources — no 2026-specific June 30 date confirmed for the 20–49 band.

---

## Task 2 — Local import

Import performed using `scripts/emiratisation-june30-import.ts` following the `eid-import.ts` pattern.

### Pre-flight em dash validation

All 22 string constants validated clean before any DB write. Zero em dashes found.

### Records created

| Record | ID | Slug | Status |
|--------|----|------|--------|
| News post | 26cf9c7b-5480-4524-9ee3-b44837595aae | uae-emiratisation-june-30-2026-deadline | published |
| Calendar page | 9a5404e5-4116-41ee-aa0a-c5fac832d626 | uae-emiratisation-june-30-2026-reminder | published |

### News post DB fields confirmed

| Field | Value |
|-------|-------|
| status | published |
| category | government |
| source_label | official |
| noindex | 0 |
| ru_published | 1 |
| en_seo_title | 56 chars |
| en_meta_description | 140 chars |
| ru_seo_title | 62 chars |
| ru_meta_description | 138 chars |
| date_published | 2026-05-20 |

### Calendar page DB fields confirmed

| Field | Value |
|-------|-------|
| status | published |
| calendar_type | important_dates |
| year | 2026 |
| month | NULL (not monthly) |
| ru_published | 1 |
| dates_json item count | 1 (Item A only — 2026-06-30, compliance_deadline, confirmed) |
| has_islamic_dates | 0 |

**Item B confirmed absent from dates_json.**

---

## Task 3 — Route and content QA

### Route QA

| Route | HTTP | robots |
|-------|------|--------|
| /news/uae-emiratisation-june-30-2026-deadline | 200 | index, follow |
| /ru/news/uae-emiratisation-june-30-2026-deadline | 200 | index, follow |
| /calendar/uae-emiratisation-june-30-2026-reminder | 200 | index, follow |
| /ru/calendar/uae-emiratisation-june-30-2026-reminder | 200 | index, follow |

### Regression checks

| Check | Result |
|-------|--------|
| Unknown slug → 404 | PASS |
| /guides/employment-visa → 200 | PASS |
| /news/uae-eid-al-adha-2026-federal-holiday-long-break → 200 | PASS |

### DB record counts (before/after import)

| Table | Before | After |
|-------|--------|-------|
| guides (published) | 17 | 17 — unchanged |
| news_posts (published) | 1 | 2 — +1 Emiratisation |
| calendar_pages (published) | 1 | 2 — +1 Emiratisation Item A |

### Content safety checks

| Check | Result | Notes |
|-------|--------|-------|
| No em dash in rendered EN page body | PASS | Em dash found in `<title>` only — site standard template suffix "— Guidex Consulting", not article content |
| No em dash in rendered RU page body | PASS | Same — template only |
| June 30 2026 asserted for 50+ employees only | PASS | Confirmed in EN and RU body |
| Item B date NOT asserted as fact | PASS | "June 30 2026" appears in "What not to assume" section only — explicitly tells reader NOT to assume it applies to 20–49 band |
| Item B visible on calendar page | PASS | en_notes field contains disclaimer: "Calendar Item B (20 to 49 employees) is not included: the June 30 2026 date for that band has not been confirmed" — editorial transparency, not an assertion |
| No AED contribution amount stated | PASS | "financial contributions begin" only — no AED figure |
| No free zone claim | PASS — absent | |
| No "all companies" overgeneralization | PASS — absent | |
| No penalty amount stated | PASS — absent | |

---

## Active calendar items

| Item | Band | Date | Status | DB |
|------|------|------|--------|----|
| Item A | 50+ employees | 2026-06-30 | published_local | id=9a5404e5-4116-41ee-aa0a-c5fac832d626 |

## Held calendar items

| Item | Band | Blocked claim | Hold reason |
|------|------|---------------|-------------|
| Item B | 20–49 employees | June 30 2026 deadline for this band | No 2026-specific MoHRE source confirms June 30 for the 20–49 band. MoHRE targets page confirms the threshold (1 UAE national in skilled job) exists but names no 2026 deadline date for this band. |

**Item B must NOT be imported until a MoHRE 2026 announcement explicitly states June 30 applies to the 20–49 employee band.**

---

## Claims allowed (as published)

| Claim | Source |
|-------|--------|
| June 30 2026 is the deadline for companies with 50+ employees | MoHRE news, 7 May 2026 — rechecked live 2026-05-20 |
| 50+ employee companies must achieve 1% semi-annual growth in Emiratisation rate in skilled jobs | MoHRE Emiratisation targets page — rechecked live 2026-05-20 |
| Financial contributions begin from 1 July 2026 for non-compliant 50+ employee companies | MoHRE Emiratisation targets page |
| Companies with 20–49 employees have a separate Emiratisation requirement (1 UAE national in skilled job) | MoHRE Emiratisation targets page |
| The applicable 2026 deadline for the 20–49 band should be verified with MoHRE | Source gap acknowledged |
| Next cycle: 31 December 2026 | MoHRE |

## Claims blocked (must not appear)

| Blocked claim | Reason |
|---------------|--------|
| "Companies with 20–49 employees have a June 30 2026 deadline" | NOT confirmed from captured 2026-specific MoHRE source |
| "The Emiratisation contribution is AED X" | 2026 semi-annual amount not captured from official source |
| "All UAE companies must meet Emiratisation targets" | Scope limited to private sector mainland; specific thresholds apply |
| "Free zone companies must meet Emiratisation targets" | Scope for free zones not confirmed |
| "Penalty for missing Emiratisation is X" | No official penalty source captured |

---

## Validation results

| Check | Result |
|-------|--------|
| No code changed | PASS |
| No DB changed beyond intended records | PASS |
| No admin/AI Inbox/push/deploy/commit | PASS |
| No unsupported employment/compliance claims | PASS |
| No AED figure in published content | PASS |
| Item B NOT in DB | PASS |
| EN news route 200, robots: index follow | PASS |
| RU news route 200, robots: index follow | PASS |
| EN calendar route 200, robots: index follow | PASS |
| RU calendar route 200, robots: index follow | PASS |
| Existing guides unaffected (17 published) | PASS |
| Existing news unaffected (Eid still live) | PASS |
| em_dash in article body — EN | PASS |
| em_dash in article body — RU | PASS |
| dates_json item count = 1 (Item A only) | PASS |
| DB record count verified | PASS |
| MoHRE URL 1 live and content unchanged | PASS |
| MoHRE URL 2 live and content unchanged | PASS |
| Import script pre-flight: 22 strings clean | PASS |

---

## Production readiness verdict

**News post: READY for production deploy.**
**Calendar Item A: READY for production deploy.**
**Calendar Item B: NOT READY — HOLD.**

All local QA checks pass. No content safety issues. Both MoHRE source URLs live and unchanged. No em dashes in article body. All robots: index, follow. No regression in existing content.

---

## Exact production approval prompt

When owner is ready to push to production, use this prompt:

> **Phase 6C-38 — Emiratisation Production Deploy**
> Push local DB records to production and verify live:
> - News slug: `uae-emiratisation-june-30-2026-deadline` (id=26cf9c7b)
> - Calendar slug: `uae-emiratisation-june-30-2026-reminder` (id=9a5404e5)
> - Do NOT import Calendar Item B.
> - After deploy: verify both EN and RU routes return 200 on production, robots: index follow.
> - Do NOT commit or push code — DB restore script only.
> - On 2026-07-10: set noindex=1 on news post, add archive note referencing TAX-04.

---

## Git status (2026-05-20 — Phase 6C-37)

**Modified (tracked — not yet committed):**
- CHECKPOINTS.md
- NEW_CHAT_TRANSFER.txt
- PROJECT_STATE.md
- SESSION_LOG.md
- docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md (db_status updated)
- docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md (status updated)

**Untracked (not yet committed):**
- scripts/emiratisation-june30-import.ts
- docs/content-drafts/PHASE_6C37_EMIRATISATION_LOCAL_IMPORT_QA.md (this file)
- docs/content-drafts/reviews/ (directory)
- docs/content-drafts/PHASE_6C35_SUMMARY.md
- docs/content-drafts/PHASE_6C36_SUMMARY.md
- docs/content-drafts/events/gitex-global-2026.md
- docs/content-model-decision-news-events-calendar.md
- docs/global-uae-hub-plan.md
- :tmp-brand-assets/
- backups/env/
- backups/local/
- data/

---

## What was not touched

- No code (app/, components/, lib/, proxy.ts, next.config.ts)
- No database schema or migrations
- No admin panel
- No AI Inbox
- No git operations
- No production server
- No existing guides
- No other news/calendar records
- No Calendar Item B

---

## Final report answers

**Was MoHRE source rechecked live?**
Yes. Both MoHRE URLs returned HTTP 200 on 2026-05-20. Source 1 content confirms June 30 2026 for 50+ employees. Source 2 confirms 20–49 threshold exists but states no June 30 date for that band. Item B hold validated from both sources.

**Was news imported locally?**
Yes. Slug `uae-emiratisation-june-30-2026-deadline`, id=26cf9c7b-5480-4524-9ee3-b44837595aae, status=published, noindex=0.

**Was only Item A imported locally?**
Yes. Calendar slug `uae-emiratisation-june-30-2026-reminder`, id=9a5404e5-4116-41ee-aa0a-c5fac832d626, dates_json contains 1 item only (2026-06-30, compliance_deadline, confirmed). Item B is absent from the DB.

**Is Item B still held?**
Yes. Item B (20–49 employees) was not imported and must not be imported until a 2026-specific MoHRE source explicitly confirms June 30 applies to that band.

**Are EN/RU pages locally safe and indexable?**
Yes. All 4 routes return 200. All 4 return robots: index, follow. No em dashes in article body. No unsupported claims. No AED figure. No Item B asserted as fact.

**Can this proceed to production launch?**
Yes — for news + Item A only. Local QA complete. Source rechecked. No blockers. Production deploy requires only running the DB restore script to push the two new records. Use Phase 6C-38 prompt above.

---

*Phase 6C-37 complete — 2026-05-20*
