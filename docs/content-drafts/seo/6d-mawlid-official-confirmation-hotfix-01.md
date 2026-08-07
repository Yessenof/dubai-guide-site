# Phase 6D-MAWLID-OFFICIAL-CONFIRMATION-HOTFIX-01
## Mawlid Al Nabi 2026 — Official UAE Date Confirmation

**Hotfix date:** 2026-08-07
**Phase tag:** 6D-MAWLID-OFFICIAL-CONFIRMATION-HOTFIX-01
**Status:** CLOSED — DEPLOYED — VERIFIED

---

## 1 — Old Production Fact (Pre-Hotfix)

| Field | Old value |
|---|---|
| ID | AUG-NEW-02 |
| date | `2026-08-25` |
| confidence | `expected` |
| source_status | `expected` |
| brief_en | "Expected on 25 August 2026 (12 Rabi Al Awwal 1448 AH), subject to official UAE confirmation..." |
| source_label_en | "UAE Government Portal · Cabinet Resolution No. 27/2024" |

The old record correctly described the date as provisional and hedged with "subject to official UAE confirmation" and "No official 2026 circular has been issued as of 4 August 2026."

---

## 2 — New Verified Fact (Post-Hotfix)

The UAE Government Media Office announced on 7 August 2026 (via official channels) that the paid public holiday for Prophet Muhammad's Birthday (Mawlid Al Nabi) will be observed on **Friday, 28 August 2026**, for both federal government employees and UAE private-sector workers. Work resumes Monday, 31 August 2026.

---

## 3 — Official Sources

**Source 1 (T1 — Current Announcement):**
- Authority: UAE Government Media Office
- Date: 7 August 2026
- Fact: Friday, 28 August 2026 is the paid public holiday
- Sectors: Federal government employees + UAE private-sector workers
- Corroborated by: Gulf News, Khaleej Times, Gulf Business, What's On, Time Out Dubai, Emirates 24/7 (all published 7 August 2026)

**Source 2 (Permanent Reference):**
- URL: https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays
- Authority: UAE Government Portal
- Note: Lists Islamic holidays by Hijri date ("12 Rabi' Awwal") without Gregorian date conversion. Does not conflict with Source 1 — describes the religious date, not the specific Gregorian observance date.

---

## 4 — Source Precedence Decision

Two official sources were examined:

| Source | What it describes | Gregorian date for 2026 |
|---|---|---|
| u.ae public holidays page | Islamic calendar reference — "12 Rabi' Awwal" | Not specified (Hijri date only) |
| UAE Government Media Office announcement (7 Aug 2026) | Employee public holiday observance date | 28 August 2026 |

These are NOT conflicting. They describe different things:
- u.ae: the Hijri calendar date of the religious observance
- UAE Gov Media Office: the specific Gregorian date on which UAE employees receive the paid public holiday

**Decision:** The UAE Government Media Office announcement (7 August 2026) is the T1 current applicable source for the factual question "on which Gregorian date is the UAE paid public holiday being observed." No conflict required escalation.

The `source_url` and `cta_url` remain pointing to u.ae (most stable, most authoritative permanent reference). The `source_label_en` was updated to accurately reflect "UAE Government Media Office" as the announcing authority.

---

## 5 — Religious Date vs. Employee Holiday Distinction

The Hijri date 12 Rabi Al Awwal 1448 AH was originally astronomically estimated as approximately 25 August 2026. The actual UAE moon sighting established the month start later, making 12 Rabi Al Awwal fall on 28 August. The UAE Government Media Office declared 28 August as the official paid public holiday. No conflict between religious date and employee holiday date — they refer to the same event; the astronomical prediction was slightly off.

The Guidex record represents the **user-facing UAE public-holiday date** (28 August), not a prediction of the astronomical Hijri date.

---

## 6 — Reason Old Provisional Fact Became Stale

The original AUG-NEW-02 item was created with `confidence=expected` because the Hijri moon-sighting determines the exact Gregorian date, and no official announcement had been issued as of 4 August 2026. The UAE Government Media Office issued the official announcement on 7 August 2026 — three days after the content was authored.

---

## 7 — Exact DB Fields Changed

| Field | Old value | New value |
|---|---|---|
| `date` | `2026-08-25` | `2026-08-28` |
| `confidence` | `expected` | `confirmed` |
| `source_status` | `expected` | `confirmed` |
| `brief_en` | Provisional — 25 Aug, hedging language | Confirmed — 28 Aug, factual |
| `brief_ru` | Provisional — 25 августа, hedging | Confirmed — 28 августа, factual |
| `source_label_en` | "UAE Government Portal · Cabinet Resolution No. 27/2024" | "UAE Government Media Office · Cabinet Resolution No. 27/2024" |
| `source_label_ru` | "Правительство ОАЭ · Постановление Кабинета № 27/2024" | "Медиа-офис правительства ОАЭ · Постановление Кабинета № 27/2024" |
| `last_verified_date` (page) | `2026-05-28` | `2026-08-07` |

Fields preserved unchanged: `id`, `label_en`, `label_ru`, `short_label_en`, `short_label_ru`, `type`, `priority`, `detail_url`, `cta_type`, `cta_label_en`, `cta_label_ru`, `source_url`, `cta_url`, `emirate`, `risk_level`, `lifecycle`, `noindex_after`, `archive_action`.

---

## 8 — Patch Script

`scripts/patch-aug-mawlid-official-confirmation-2026.ts`

- Targets only `AUG-NEW-02` in `august-2026-dubai-calendar`
- Respects `GUIDEX_DB_PATH` env var
- Asserts old state (`date=2026-08-25`, `confidence=expected`) before mutation
- Verifies new state after write (all 7 changed fields checked)
- Verifies August count = 15 and no duplicate IDs
- Runs `PRAGMA integrity_check`
- Idempotent: second run detects already-applied state and skips

---

## 9 — Rehearsal

**Local dev DB rehearsal (first run):** PASS — all field assertions passed, August=15, integrity ok.
**Local dev DB rehearsal (second run):** PASS — no-op, integrity ok.

**Production server rehearsal DB (`/tmp/guidex-mawlid-rehearsal.db`):**
- First run: PASS — July=10, August=15, all field assertions, integrity ok.
- Second run: PASS — no-op, integrity ok.

---

## 10 — Idempotency

Confirmed. Second run output:
```
⚠  Already applied — date is 2026-08-28 and confidence is confirmed. No-op.
  July count:   10 (production baseline: 10)
  August count: 15 (expected 15)
✓ integrity_check: ok
```

---

## 11 — Production Backup

```
Path: /var/www/guidex/backups/local/guides.db.pre-mawlid-hotfix-production-20260807-164633
Size: 960K
MD5:  7085b33ec5f1cd5f8ea468bcf38f0ffd
integrity: ok
```

Additional script-created backup during production run:
```
/var/www/guidex/backups/local/guides.db.pre-mawlid-hotfix-2026-08-07T12-46-44
```

---

## 12 — Production Patch

Command:
```
GUIDEX_DB_PATH=/var/www/guidex/data/guides.db npx tsx scripts/patch-aug-mawlid-official-confirmation-2026.ts
```

First run: PASS. All field changes applied. July=10, August=15, integrity=ok.
Second run: PASS. No-op. Idempotency confirmed.

---

## 13 — DB Integrity

```
PRAGMA integrity_check: ok
July count: 10 (unchanged)
August count: 15 (unchanged)
Duplicate IDs: none
```

WAL checkpoint after patch:
```
{ busy: 0, log: 11, checkpointed: 11 }
```

Post-WAL-checkpoint MD5: `c09f358ff2b75ac7f87ecf87ca9805a9`

---

## 14 — July Preservation

July 2026 calendar: 10 items. Unchanged. Confirmed.

---

## 15 — August Preservation

August 2026 calendar: 15 items. Count unchanged. All 15 IDs preserved:
`AUG-01-DSS`, `AUG-02-DEFLEP`, `AUG-03-DIHAD`, `AUG-04-BACKSCH`, `AUG-05-MICHAEL`, `AUG-NEW-01`, `AUG-NEW-02`, `AUG-NEW-03`, `AUG-6D-01`, `AUG-6D-02`, `AUG-6D-03`, `AUG-6D-04`, `AUG-6D-07`, `AUG-6D-05`, `AUG-6D-06`.

Only `AUG-NEW-02` content changed. All other items preserved byte-for-byte.

---

## 16 — Build

```
npm run build: 92/92 static pages generated
TypeScript errors: 0
Duration: 39s
```

---

## 17 — PM2

```
pm2 reload guidex-production --update-env
Status: online
Unstable restarts: 0
Ready in: 156ms
```

---

## 18 — EN Live QA

URL: `https://guidex-consulting.ae/calendar/august-2026-dubai-calendar`

| Check | Result |
|---|---|
| HTTP 200 | PASS |
| noindex absent | PASS |
| canonical | `https://guidex-consulting.ae/calendar/august-2026-dubai-calendar` — PASS |
| hreflang (3 tags: en, ru, x-default) | PASS |
| '28 August 2026' in page | PASS |
| '25 August' in page | ABSENT — PASS |
| '2026-08-25' in page | ABSENT — PASS |
| 'subject to official' in page | ABSENT — PASS |
| 'no official circular' in page | ABSENT — PASS |
| 'Expected on 25 August' | ABSENT — PASS |
| Three consecutive days mention | PASS |
| 'Government Media Office' in page | PASS |
| Prophet label | PASS |
| JSON-LD types | Organization, WebSite, WebPage — PASS |
| Item renders on 2026-08-28 date | PASS |
| Item does NOT render on 2026-08-25 | PASS |

---

## 19 — RU Live QA

URL: `https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar`

| Check | Result |
|---|---|
| HTTP 200 | PASS |
| noindex absent | PASS |
| canonical | `https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar` — PASS |
| hreflang (3 tags: ru, en, x-default) | PASS |
| '28 августа' in page | PASS |
| '25 августа' absent | PASS |
| Stale provisional wording absent | PASS |
| Three days (три дня) mention | PASS |
| Медиа-офис / Media Office in RU | PASS |
| RU Mawlid label | PASS |
| JSON-LD types | Organization, WebSite, WebPage — PASS |

---

## 20 — Three-Day-Weekend Wording QA

The EN brief states:
> "Employees whose normal weekend is Saturday and Sunday will have three consecutive days off — Friday 28 August through Sunday 30 August — before work resumes on Monday, 31 August."

The RU brief states (translated):
> "For employees with normal Saturday and Sunday weekends, this means three consecutive days off — from 28 to 30 August — work resumes Monday, 31 August."

**QA answers:**
- A: Official UAE holiday date = Friday, 28 August 2026 ✓
- B: Sectors = federal government employees and UAE private-sector workers ✓
- C: Guidex implies 29/30 Aug are separate public holidays? NO ✓
- D: Three-day break condition correctly expressed (only for Sat-Sun weekend workers)? YES ✓
- E: Any live page claims 25 August is the confirmed UAE paid holiday? NO ✓

---

## 21 — Stale Reference Sweep (Live Pages)

| Page | '25 August' | '2026-08-25' | 'subject to official' | Result |
|---|---|---|---|---|
| EN August calendar | ABSENT | ABSENT | ABSENT | CLEAN |
| RU August calendar | ABSENT | ABSENT | ABSENT | CLEAN |
| Homepage | ABSENT | ABSENT | ABSENT | CLEAN |
| Calendar hub (/calendar) | ABSENT | ABSENT | FOUND × 4 | UNRELATED |

The 4 occurrences of "subject to official" on `/calendar` hub are the correct evergreen Islamic calendar disclaimer: "Islamic dates (Eid, Ramadan) are subject to official UAE moon-sighting announcements and may change." This is not a stale Mawlid-specific statement. No action required.

**No misleading currently-published UAE-holiday claim for 25 August exists on any live Guidex page.**

---

## 22 — JSON-LD

All calendar pages emit three JSON-LD blocks: Organization, WebSite, WebPage. No per-item event schema for calendar items (calendar hub pages use WebPage schema). No stale 25-August public-holiday representation in structured data.

---

## 23 — Sitemap / lastmod

August calendar lastmod after hotfix: `2026-08-07T12:46:44.000Z`
Total /calendar/ sitemap entries: 22 (11 EN + 11 RU) — unchanged.

---

## 24 — Logs / Stability

PM2 error log: empty. No exceptions, DB errors, or repeated restarts.
PM2 status: online, 0 unstable restarts, uptime > 2 minutes at QA time.

---

## 25 — Rollback Status

No rollback required. Pre-hotfix backup available at:
`/var/www/guidex/backups/local/guides.db.pre-mawlid-hotfix-production-20260807-164633`
`MD5: 7085b33ec5f1cd5f8ea468bcf38f0ffd`

---

## 26 — Implementation Commit

`7265b76` — `fix: confirm 2026 Mawlid UAE holiday date as August 28 (6D-MAWLID-HOTFIX-01)`

---

## 27 — Documentation Commit

(This file — committed separately after production QA.)

---

## 28 — Local / GitHub / Production Synchronization

| State | Commit |
|---|---|
| Local HEAD | `7265b76` + docs commit |
| GitHub origin/main | `7265b76` + docs commit |
| Production HEAD | `7265b76` (pulled before build) |

---

## 29 — GSC Readiness

August calendar marked READY for GSC Wave 1 submission.
URL: `https://guidex-consulting.ae/calendar/august-2026-dubai-calendar`
Do NOT submit yet. Owner submits during GSC Wave 1 (after freshness gate complete).

---

## 30 — Remaining Unrelated P1 Backlog

13 calendar items with empty brief_en + brief_ru remain (OCT-03-VAT, OCT-04-EINV priority). Not addressed in this hotfix. Deferred.

---

## 31 — Freshness Architecture NOT Implemented

The GUIDEX-FRESHNESS-SOURCE-MONITORING-ARCHITECTURE-PLAN-01 was NOT implemented in this task per explicit constraint. No freshness_watchlist, freshness_alerts, cron jobs, Telegram integration, or schema migrations were created.

---

## 32 — Architecture Revision 02 Readiness

This incident provides direct evidence for Architecture Revision 02:
- The AUG-NEW-02 provisional record (confidence=expected) existed correctly for 3 days (4–7 August)
- The official announcement appeared 3 days after authoring
- The monitoring system (when built) would have detected the UAE Government Media Office X announcement via WAM RSS or news scraping
- Human review confirmed the fact; this hotfix applied the correction
- The DETECT → ALERT → HUMAN REVIEW → APPROVED CORRECTION → QA → DEPLOY model worked correctly (manually in this case)

Architecture Revision 02 can begin once this hotfix documentation is committed and the owner reviews the architecture plan.
