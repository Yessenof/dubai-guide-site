# Phase 6C-62 / 6C-62B — Corrected First Import Batch Recommendation

**Phase:** 6C-62B (corrects 6C-62)
**Date updated:** 2026-05-25
**Purpose:** Identify the safest next calendar items to import — with already-live items removed and duplicate risks flagged

---

## Already-Live Items — Do NOT Reimport

These items were marked as "to import" or "owner review" in Phase 6C-62 but are already live in production. Do not import them again.

| ID | Item | Live URL | Robots | Action |
|---|---|---|---|---|
| HOL-01 | Eid Al Adha 2026 (news + event + calendar) | `/news/uae-eid-al-adha-2026-federal-holiday-long-break`, `/events/uae-eid-al-adha-2026`, `/calendar/may-2026-uae-calendar` | index, follow | Monitor. Archive news after June 1, 2026. |
| TAX-01A | Emiratisation June 30 (news + calendar) | `/news/uae-emiratisation-june-30-2026-deadline`, `/calendar/uae-emiratisation-june-30-2026-reminder` | index, follow | Monitor. noindex_after July 10, 2026. |
| VIRAL-01 | UAE Long Weekends 2026–27 | `/calendar/uae-long-weekends-2026-2027` | index, follow | Monitor GSC. Phase 6C-50 DB write for copy drift fix. |
| May 2026 | May 2026 UAE Calendar | `/calendar/may-2026-uae-calendar` | index, follow | Live. Part of Eid package. |

---

## Noindex Status — Corrected

The Phase 6C-62 "P0 noindex blocker" was stale. Live check (2026-05-25):

- All 6 individual content pages: **index, follow**
- `/calendar` and `/ru/calendar` listing pages: `noindex, follow` — product decision, not a blocker

This does not delay any import.

---

## HOL-04 and HOL-05 — Duplicate Risk, Do NOT Import Standalone

**Phase 6C-62 recommended importing HOL-04 (Commemoration Day) and HOL-05 (National Day) as Tier A items. This is incorrect.**

**Why:**
Both dates are already represented in the live Long Weekends 2026-2027 datesJson:
- Commemoration Day: `{"date": "2026-12-01", ..., "detail_url": "/calendar/uae-long-weekends-2026-2027"}` (confidence: "expected")
- National Day: `{"date": "2026-12-02", "date_end": "2026-12-03", ..., "detail_url": "/calendar/uae-long-weekends-2026-2027"}` (confidence: "expected")

Importing standalone calendar_pages for these same dates would create **duplicate entries** in the calendar agenda view — the same holiday appearing twice in the same date range, linking to two different URLs.

**Phase 6C-63 clarification:** The Long Weekends datesJson has Commemoration Day stored as `2026-12-01` (Dec 1). This is correct. Nov 30 is the national occasion/observance date; Dec 1 is the public holiday/day-off date per Cabinet Resolution 27/2024. The Phase 6C-62B claim that Dec 1 was a data error is retracted. The Phase 6C-50 DB write should soften label language and fix `--` style only — no date change.

**Correct path for HOL-04/HOL-05:**
1. Plan a **December 2026 monthly calendar page** (parallel to the May 2026 pattern for Eid) — groups Dec 1-3 as a cluster
2. When that page is ready, update Long Weekends datesJson `detail_url` for both entries to point to the December page
3. Correct the Commemoration Day date from Dec 1 to Nov 30 in the same DB write
4. This is a coordinated multi-step operation, not a standalone import

**Owner decision needed:** Should December 2026 be a monthly calendar page (same pattern as May 2026), or should HOL-04/HOL-05 stay permanently inside the Long Weekends yearly reference? This decision determines Phase 6C-63 scope.

---

## Corrected First Import Batch

Items that are genuinely new (not yet in production) and safe to import next.

---

### Tier A — After Owner Decision on HOL-04/HOL-05

No pure Tier A items exist right now. The two candidates (HOL-04, HOL-05) require the December 2026 page decision first.

If owner decides **December 2026 monthly calendar page**, Phase 6C-63 first action is:
1. Build December 2026 monthly calendar page (groups Dec 1-3 holidays)
2. Update Long Weekends datesJson to point both entries to the December page
3. Soften label language + fix `--` style in same write (no date change — Dec 1 is correct)
4. Import December 2026 calendar page to production

---

### Tier B — After Owner Approval (Sources Confirmed, Drafts Exist)

#### B1 — TAX-05C + TAX-05A | E-invoicing Package

| Field | Value |
|---|---|
| **Items** | TAX-05C (Oct 30 ASP deadline) + TAX-05A (Jul 1 pilot start) |
| **Dates** | Jul 1, 2026 + Oct 30, 2026 |
| **Source** | MoF official permalink (Phase 6C-23): https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ |
| **Source status** | official_permalink_captured — recheck before import |
| **Risk** | High (compliance + threshold-specific) |
| **Draft** | `docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md` exists |
| **Import condition** | Owner approves draft → recheck MoF URL is still live → import as a 2-item paired package |
| **CTA** | WhatsApp (compliance advisory) |
| **Scope guard** | Applies ONLY to businesses with annual revenue ≥ AED 50M. SME deadline is March 31, 2027. Do not state "all UAE businesses." |
| **Recheck required** | Verify https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ is still live at time of import |
| **Import checklist** | ✓ Official permalink captured ✓ Draft exists ✓ Recheck URL before import ✓ Owner approval required |

---

### Tier C — After Source Capture (Next 30–60 Days)

#### C1 — DXB-02 | GITEX Global 2026

| Field | Value |
|---|---|
| **Date** | ~Oct 13–17 (estimated from historical pattern — NOT confirmed) |
| **Source needed** | Official 2026 dates from gitex.com |
| **Check from** | July 2026 |
| **Venue** | Dubai Exhibition Centre, Expo City Dubai (confirmed Phase 6C-25) |
| **Import triggers** | gitex.com publishes 2026 dates → capture → build event page → owner approval → import |

---

#### C2 — AUH-01 | F1 Abu Dhabi Grand Prix 2026

| Field | Value |
|---|---|
| **Date** | ~Nov 27–29 (estimated) |
| **Source needed** | Official 2026 F1 calendar from formula1.com |
| **Check from** | August 2026 |
| **Draft exists** | `events/formula-1-abu-dhabi-grand-prix-2026.md` — verify completeness |
| **Note** | Always label Abu Dhabi / Yas Island — not Dubai |

---

#### C3 — TAX-02 | Corporate Tax FY2025 Return Reminder

| Field | Value |
|---|---|
| **Date** | 2026-09-30 (example for Dec 31 year-end entities) |
| **Source** | FTA nine-month rule — captured in corporate-tax-deadline-sources.md |
| **Blocker** | Guide draft not yet written; penalty source not captured |
| **Build first** | Corporate Tax FY2025 guide, target: ready by August 1, 2026 |
| **Calendar label** | Must say "example for December year-end entities" — not a universal date |

---

## Items Excluded from All Batches and Why

| ID | Item | Reason |
|---|---|---|
| HOL-01 | Eid Al Adha package | ALREADY LIVE — do not reimport |
| TAX-01A | Emiratisation June 30 (50+ employees) | ALREADY LIVE — do not reimport |
| VIRAL-01 | Long Weekends 2026–27 | ALREADY LIVE — do not reimport |
| HOL-04 | Commemoration Day | In Long Weekends datesJson — duplicate risk if imported standalone |
| HOL-05 | National Day | In Long Weekends datesJson — duplicate risk if imported standalone |
| HOL-02 | Islamic New Year | No official FAHR date yet — HOLD |
| HOL-03 | Mawlid | No official FAHR date yet — HOLD |
| TAX-01B | Emiratisation 20–49 band | June 30 not confirmed from 2026-specific source — very high risk |
| TAX-04 | Emiratisation Dec 31 | Follow-up to TAX-01A; not standalone — already live anyway |
| DXB-01 | Cityscape Dubai | Organizer dates not published |
| DXB-03–06 | Other Dubai events | Dates TBC from organizers |
| AUH-02–03 | ADIPEC, Abu Dhabi Art | Dates TBC; niche audience |
| TAX-06/07 | ESR, UBO | Internal-only; no public calendar value |
| PROP-01/02 | Rent/Ejari rules | Relative dates; not standalone calendar items |
| DLS-07/08 | Visa/ID renewal | Relative; belong in Life Setup product |
| HOL-07–09 | 2027 Islamic holidays | Too far out; dates unconfirmed |

---

## Recommended Sequence for Phase 6C-63

```
Decision gate (owner):
  → Approve December 2026 monthly calendar page approach for HOL-04/HOL-05?
  → If yes: plan December 2026 page → coordinated import with Long Weekends update

Content sprint:
  1. Owner reviews TAX-05C/A e-invoicing drafts → approve → recheck URL → import
  2. Monitor gitex.com from July 2026 (GITEX dates)
  3. Monitor formula1.com from August 2026 (F1 Abu Dhabi dates)
  4. Build Corporate Tax FY2025 guide by August 1, 2026

DB maintenance (approved separately):
  5. Phase 6C-50 DB write: fix Long Weekends copy drift + soften Commemoration Day label (no date change — Dec 1 confirmed correct per Phase 6C-63)
```

---

*Corrected planning document — Phase 6C-62B — 2026-05-25. Not for publish. No admin action. No DB write.*
