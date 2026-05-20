# Phase 6C-36 Summary — Emiratisation Final QA and Item B Hold Correction

**Date:** 2026-05-20
**Phase:** 6C-36
**Type:** Editorial QA, source correction, hold classification
**Scope:** TAX-01 Emiratisation June 30 2026 content package (Phase 6C-35 output)

---

## Phase objective

Apply owner decisions from Phase 6C-35 owner review. Resolve two open decisions:

1. **Decision 1 (contributions framing):** Accept cautious framing without AED amount — ACCEPTED
2. **Decision 2 (20-49 band activation date):** Confirm or hold the claim that June 30 2026 applies to companies with 20-49 employees — HOLD APPLIED

Key correction: The Phase 6C-35 package implied both bands (50+ and 20-49 employees) had a confirmed June 30 2026 deadline. Source analysis in Phase 6C-36 established that:

- MoHRE news (7 May 2026): confirms June 30 2026 deadline — primarily for the 50+ employee band
- MoHRE Emiratisation targets page: confirms the 20-49 threshold exists (1 UAE national in skilled job) but does NOT state June 30 2026 as the deadline for this band
- January 2024 MoHRE announcement: confirms 20-49 band exists since beginning of programme — this is NOT a 2026 deadline confirmation

Result: Calendar Item B (20-49 band) reclassified to HOLD. News draft refocused to assert June 30 only for 50+ employees.

---

## Hard restrictions (enforced — zero deviations)

- No code touched
- No DB touched
- No admin used
- No AI Inbox used
- No import performed
- No publish performed
- No push performed
- No deploy performed
- No commit performed
- No unsupported employment/compliance claims added

---

## Files reviewed (read-only)

| File | Purpose |
|------|---------|
| `docs/content-drafts/source-ledgers/uae-mohre-compliance-2026-sources.md` | Source gate hierarchy — confirmed two thresholds, June 30 from 7 May MoHRE news supports 50+ band primarily |
| `docs/content-drafts/verification/uae-emiratisation-30-june-2026-source-check.md` | Verification decision from Phase 6C-22 — owner direction in Phase 6C-36 overrides for 20-49 band |

---

## Files modified

| File | Change summary |
|------|---------------|
| `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` | Major restructure: June 30 asserted for 50+ only; 20-49 softened to "verify with MoHRE"; EN/RU meta under 160 chars; all publishable em dashes removed; status → owner_review_ready |
| `docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md` | Item A confirmed (50+ band); Item B fully reclassified to hold_source_pending; file metadata updated |
| `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md` | Phase 6C-36 final decision section added; both decisions resolved; import recommendation table; pre-import checklist |
| `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` | TAX-01 row: draft_file_only → news+itemA_owner_review_ready; itemB_hold; version 1.1 → 1.2 |
| `docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md` | TAX-01 entry: reflect Item B HOLD, import sequence news + Item A only |
| `docs/content-drafts/SOURCE_RESEARCH_QUEUE.md` | Emiratisation entry: draft_created → news+itemA_owner_review_ready, itemB_hold |
| `docs/content-drafts/CONTENT_AUDIT_MATRIX.md` | Phase 6C-36 update note added for files 11 and 12 |

---

## Source decision

| Band | Threshold | June 30 2026 status | Action |
|------|-----------|--------------------|----|
| 50+ employees | 1% semi-annual growth in skilled jobs | CONFIRMED — MoHRE news 7 May 2026 | Publish |
| 20-49 employees | 1 UAE national in skilled job | NOT CONFIRMED for June 30 2026 | HOLD |
| Under 20 employees | No obligation confirmed | N/A | Do not mention |

---

## Calendar Item A — final status

```
item:                uae-emiratisation-june-30-2026-a-50-plus
publish_status:      owner_review_ready — recheck_source_before_import
band:                50+ employees
deadline:            30 June 2026
source:              MoHRE news 7 May 2026 + MoHRE Emiratisation targets page — both captured 2026-05-19
confidence:          source_confirmed
scope_note:          Item B (20–49 employees) is held — June 30 2026 not confirmed for that band
```

**Item A is importable after owner approval and source recheck.**

---

## Calendar Item B — final status

```
item:                uae-emiratisation-june-30-2026-b-20-49
publish_status:      hold — source_pending — do_not_import
band:                20-49 employees
date_start:          NOT CONFIRMED FOR 2026 — hold
confidence:          source_pending — 2026_deadline_not_confirmed_for_this_band
blocked_claim:       "30 June 2026 applicability to the 20–49 employee band is not confirmed from the captured official source"
```

**Item B must NOT be imported until a 2026-specific official MoHRE source explicitly confirms June 30 applies to companies with 20-49 employees.**

---

## Claims allowed (EN and RU)

| Claim | Source |
|-------|--------|
| June 30 2026 is the deadline for companies with 50+ employees | MoHRE news, 7 May 2026 |
| 50+ employee companies must achieve 1% semi-annual growth in Emiratisation rate in skilled jobs | MoHRE Emiratisation targets page |
| Financial contributions begin from 1 July 2026 for non-compliant 50+ employee companies | MoHRE Emiratisation targets page |
| Companies with 20-49 employees have a separate Emiratisation requirement (1 UAE national in skilled job) | MoHRE Emiratisation targets page |
| The applicable 2026 deadline for the 20-49 band should be verified with MoHRE | Source gap acknowledged |
| Next cycle: 31 December 2026 | MoHRE |

---

## Claims blocked (must not appear in published copy)

| Blocked claim | Reason |
|---------------|--------|
| "Companies with 20-49 employees have a June 30 2026 deadline" | NOT CONFIRMED from captured 2026-specific MoHRE source — BLOCKED per Phase 6C-36 |
| "The Emiratisation contribution is AED X" | 2026 semi-annual amount not captured from official 2026-specific source |
| "All UAE companies must meet Emiratisation targets" | Scope limited to private sector; specific thresholds apply |
| "Free zone companies must meet Emiratisation targets" | Scope for free zone companies not confirmed |
| "Free zone companies are exempt" | Not confirmed in either direction |
| "All roles count toward Emiratisation" | Skilled job definition must be verified |
| "Penalty for missing Emiratisation is X" | No official penalty source captured for 2026 semi-annual |

---

## Owner import recommendation

| Item | Status | Action |
|------|--------|--------|
| News draft | owner_review_ready | Import after owner approval + source recheck |
| Calendar Item A (50+ band) | owner_review_ready | Import after owner approval + source recheck |
| Calendar Item B (20-49 band) | HOLD | Do NOT import until 2026-specific source confirms June 30 for this band |

**Import sequence:**
1. Owner approves
2. Recheck both MoHRE URLs are live and unchanged
3. Import news draft → verify in DB
4. Import Calendar Item A → verify in DB
5. Verify robots: index, follow on both EN and RU pages after publish
6. On 2026-07-10: set noindex: 1, add archive note referencing TAX-04 (December 31 article)

---

## Validation results

| Check | Result |
|-------|--------|
| No code changed | PASS |
| No DB changed | PASS |
| No admin/AI Inbox/import/publish used | PASS |
| No push/deploy/commit | PASS |
| No unsupported employment/compliance claims | PASS |
| EN meta description under 160 chars | PASS — 140 chars |
| RU meta description under 160 chars | PASS — 138 chars |
| No long em dash in publishable EN copy | PASS — all publishable sections clean |
| No long em dash in publishable RU copy | PASS — all publishable sections clean |
| EN summary 1-2 sentences | PASS |
| RU summary 1-2 sentences | PASS |
| RU natural and complete | PASS — RU matches EN scope throughout |
| Blocked claim for 20-49 band explicit | PASS — "30 June 2026 applicability to the 20–49 employee band is not confirmed from the captured official source" |
| News draft publish_status | PASS — owner_review_ready |
| Calendar Item A publish_status | PASS — owner_review_ready — recheck_source_before_import |
| Calendar Item B publish_status | PASS — hold — source_pending — do_not_import |

---

## Em dash fix record

**Publishable em dashes fixed in Phase 6C-36 (news draft):**

| Line | Section | Fix applied |
|------|---------|------------|
| EN quick answer | 20-49 mention | Em dash → period |
| EN "what to check" | 50+ deadline item | Em dash → period |
| EN "what not to assume" | 20-49 band item | Em dash → period |
| EN source note | Two em dashes | Both → periods |
| RU quick answer | 20-49 mention | Em dash → period |
| RU "what to check" | 50+ deadline item | Em dash → period |
| RU key facts table | 20-49 row | Em dash → period |
| RU source note | Two em dashes | Both → periods |
| RU RAG/AEO | 20-49 requirements | Em dash → period |

**Remaining em dashes in news draft (all internal — acceptable):**
- Metadata code blocks (lines 15-16, 34, 42): internal
- CTA guidance (line 169): internal
- Blocked claims section (lines 291, 297): internal
- Admin import notes (line 317): internal
- Footer status lines (lines 332-334): internal

---

## Git status (2026-05-20)

**Modified (tracked — pending commit):**
- CHECKPOINTS.md
- NEW_CHAT_TRANSFER.txt
- PROJECT_STATE.md
- SESSION_LOG.md
- docs/content-drafts/source-ledgers/uae-mohre-compliance-2026-sources.md
- docs/content-drafts/verification/uae-emiratisation-30-june-2026-source-check.md
- (and other prior-session files)

**Untracked (new in this phase — pending add + commit):**
- docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md
- docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md
- docs/content-drafts/reviews/ (directory)
- docs/content-drafts/PHASE_6C35_SUMMARY.md (Phase 6C-35)
- docs/content-drafts/PHASE_6C36_SUMMARY.md (this file)
- Multiple planning docs from Phase 6C-32

---

## What was not touched

- No code (app/, components/, lib/, proxy.ts, next.config.ts)
- No database (data/guides.db)
- No admin panel
- No AI Inbox
- No git operations (no push, no commit, no deploy)
- No production server
- No existing guide drafts
- No other cluster content (e-invoicing, VAT, corporate tax, Eid content)

---

## Final report answers

**Is the news draft owner-review-ready?**
Yes. `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` is `owner_review_ready`. June 30 2026 is asserted only for companies with 50 or more employees. The 20-49 band is mentioned with an explicit direction to verify with MoHRE.

**Is calendar Item A import-ready?**
Owner review ready. Item A (50+ employees, 30 June 2026) can be imported after: (1) owner approval, (2) both MoHRE source URLs rechecked as live and unchanged.

**Is calendar Item B held?**
Yes. Item B (20-49 employees, June 30 2026) is `hold — source_pending — do_not_import`. It must not be imported until a 2026-specific official MoHRE source explicitly confirms that June 30 applies to companies with 20-49 employees.

**What exact claim is blocked?**
"30 June 2026 applicability to the 20–49 employee band is not confirmed by the captured official source."

**Can we proceed to import only news + Item A after owner approval?**
Yes. After owner approval and source recheck, import the news draft and Calendar Item A only. Do not import Calendar Item B.

---

## Recommended next phase

After owner approves and import is done:

**VIRAL-01 — UAE Long Weekend Guide 2026-2027**
- Highest SEO/ROI opportunity
- Evergreen content
- No source risk (public holiday dates are official and stable)
- No compliance claims

*Status: Phase 6C-36 final QA complete — 2026-05-20*
