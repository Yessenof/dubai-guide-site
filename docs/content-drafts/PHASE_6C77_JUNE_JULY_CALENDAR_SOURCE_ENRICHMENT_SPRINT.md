# Phase 6C-77 — June/July 2026 Calendar Source Enrichment Sprint

**Date:** 2026-05-27
**Phase:** 6C-77
**Type:** Source scan and docs-only update — no DB, no deploy, no import

---

## 1. Context

June 2026 calendar page went live in Phase 6C-75 with 5 items covering ~33% of days. Calendar detail pages were added to sitemap in Phase 6C-76. Phase 6C-77 target: find source-safe items to push June toward 60-70% date coverage, and enrich July draft before import.

---

## 2. Baseline Check

| Route | Status |
|-------|--------|
| /calendar/june-2026-dubai-calendar | 200 |
| /ru/calendar/june-2026-dubai-calendar | 200 |
| /calendar/may-2026-uae-calendar | 200 |
| /calendar | 200 |
| / | 200 |
| /ru | 200 |

Live June page confirmed: 5 items visible (JUN-01-VAT, JUN-01-WPS, JUN-04-RUMI, JUN-05-ACW, JUN-11-BEACH). Production baseline stable.

---

## 3. Source Scan Results

### 3.1 June 2026 — confirmed new items

| ID | Date | Item | Source | Level | Status |
|----|------|------|--------|-------|--------|
| JUN-06-RESET | Jun 6 | RE:SET at Dubai Opera | dubaiopera.com (official) | L1 | Ready pending owner show-type verification |
| JUN-15-MALLATHON | Jun 15-Sep 15 | Dubai Mallathon 2026 (9 malls) | mediaoffice.ae + dubaimallathon.ae (both official) | L2 | Ready for import (Batch A) |
| JUN-20-BASSI | Jun 20 | Bassi Live at Dubai Opera | dubaiopera.com + platinumlist + whatson.ae | L1 | Ready for import (Batch A) |
| JUN-24-ORCH | Jun 24 | UAE National Orchestra Season Finale | dubaiopera.com + platinumlist + whatson.ae | L1 | Ready for import (Batch A) |

**Also confirmed (not added — low consumer priority):** NYO Ensembles / National Youth Choirs at Dubai Opera Studio on Jun 6. Youth event at secondary venue — skipped for now.

### 3.2 June 2026 — items remaining on hold

| Item | Reason |
|------|--------|
| Islamic New Year / Al Hijra (~Jun 15-16) | FAHR has not announced. Moon-sighting — permanent HOLD until fahr.gov.ae publishes. |
| DWTC B2B trade shows (Jun) | INDEX Jun 2-4, MOVE Jun 9-10, China Home Life Jun 17-19, World Police Summit Jun 23-25 — all confirmed B2B/trade, not consumer-facing |
| Emirati min wage June 30 | Cross-page duplication risk with uae-emiratisation-june-30-2026-reminder — owner decision |

### 3.3 July 2026 — source scan findings

| Item | Status | Finding |
|------|--------|---------|
| DSS July 3 - Aug 30 | CONFIRMED | Zawya DFRE official press release. Jul 3 anchor date is solid. |
| Modesh World 2026 specific dates | NOT ANNOUNCED | DWTC shows only 2025 page. No 2026 Modesh World page published. Use Jul 3 DSS anchor only. |
| Beat the Heat DXB 2026 | HOLD | July 4-13 dates are from 2025 (Season 4). No 2026 dates or lineup announced. beattheheatdxb.ae shows no 2026 listing. |
| Muntazah Al Khairan (CCA Jul 3-4) | signal_only | Platinumlist only — no official CCA confirmation found |
| Timur Bey 2 (CCA Jul 9) | signal_only | Spotify only — no official CCA confirmation |

**July import readiness:** Current July draft (JUL-03-DSS + JUL-03-MODESH) is safe but thin. Do NOT import July until DSS sub-events are confirmed and brief quality is verified.

---

## 4. Coverage Update

### June 2026

| Metric | Value |
|--------|-------|
| Production items | 5 (Phase 6C-75) |
| Production coverage | ~33% (~10/30 days) |
| Phase 6C-77 Batch A candidates | 3 items: JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH |
| Phase 6C-77 Batch B (pending verify) | 1 item: JUN-06-RESET |
| Projected post-Batch A coverage | ~83% (~25/30 days) |
| Remaining gap | Jun 12-14 (3 days) |
| On hold | Islamic New Year (~Jun 15-16) |

JUN-15-MALLATHON is the single highest-impact item — fills 16 days in one import.

### July 2026

| Metric | Value |
|--------|-------|
| Current draft items | 2 (JUL-03-DSS, JUL-03-MODESH) |
| Confirmed new items | 0 |
| Coverage | ~33% (DSS runs full season but sub-events not announced) |
| Import readiness | NOT READY — wait for DFRE DSS schedule (~late June) |

---

## 5. Files Updated

| File | Change |
|------|--------|
| `docs/content-drafts/calendar/june-2026-dubai-calendar.md` | Added 4 enrichment candidates (Items 6-9), updated hold items, added coverage table, updated pre-import checklists |
| `docs/content-drafts/calendar/july-2026-dubai-calendar.md` | Fixed `calendar_type` from `events` to `monthly`; updated Beat the Heat / Modesh World status; updated enrichment table |
| `docs/content-drafts/source-ledgers/june-july-2026-calendar-event-sources.md` | Created — source ledger for all Phase 6C-77 items |
| `docs/content-drafts/PHASE_6C77_JUNE_JULY_CALENDAR_SOURCE_ENRICHMENT_SPRINT.md` | Created — this file |

---

## 6. Key Decisions

| Decision | Rationale |
|----------|-----------|
| JUN-15-MALLATHON elevated to Batch A (highest priority) | Official government source, fills 16-day gap, free public event, strong resident relevance |
| JUN-06-RESET held pending owner verification | Show is confirmed on official Dubai Opera site but genre/format unknown — risk of misclassifying |
| Beat the Heat DXB 2026: HOLD | The July 4-13 date range that was in progress was the 2025 edition. No 2026 announcement exists. |
| July calendar_type fixed to `monthly` | June had same bug (fixed in 6C-74B). July draft had `events` — corrected before any import |
| NYO Ensembles (Jun 6, Dubai Opera Studio) skipped | Youth event at secondary venue — low consumer priority for current enrichment batch |
| CCA July concerts: signal_only | Muntazah Al Khairan (Platinumlist) and Timur Bey 2 (Spotify) — no official CCA confirmation |

---

## 7. What Was Not Touched

- Production DB: not touched
- Code: not modified
- app/sitemap.ts: not modified
- Any live page: not modified
- Production server: not accessed
- No import scripts written
- No local DB changes

---

## 8. Next Steps

### Immediate (owner approval needed)

1. **Approve June enrichment Batch A import** (JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH) — these 3 items push June to ~83% coverage
2. **Verify RE:SET at Dubai Opera** — check dubaiopera.com for show type/genre, then decide on JUN-06-RESET import

### Near-term

3. **Write proper Russian labels and brief for Batch A items** before import script
4. **Run em dash scan** on all new label and brief strings before any DB write
5. **Write import script** for June enrichment batch

### Monitor (no action until triggered)

6. **FAHR announcement for Islamic New Year** — check fahr.gov.ae when news drops
7. **DFRE DSS sub-event schedule** (~late June) — triggers Beat the Heat DXB and Modesh World updates
8. **DWTC Modesh World 2026 page** — check dwtc.com/en/events/ from late June
9. **CCA official event listings** — check coca-cola-arena.com for Muntazah Al Khairan and Timur Bey 2 confirmation

---

## 9. Phase Complete

Phase 6C-77 docs-only sprint complete. No DB, no code, no deploy.

Source scan identified 4 confirmed June enrichment candidates (3 Batch A, 1 pending verification). July calendar corrected and status-updated. All source findings documented. Commit follows.
