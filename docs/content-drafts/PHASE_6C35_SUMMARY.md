# Phase 6C-35 Summary
# TAX-01 — Emiratisation June 30 2026: Source-Safe Content Package

**Date:** 2026-05-20
**Phase:** 6C-35
**Type:** Content drafts only — no code, no DB, no import, no publish, no push, no deploy, no commit

---

## Objective

Build a source-safe content package for the Emiratisation June 30 2026 compliance window (TAX-01). High-risk topic: employment law, government compliance targets, financial consequences. Hard requirement: do not publish or import content that makes unsupported claims about AED contribution amounts, free zone scope, blanket company obligations, or specific penalties.

---

## Phase Outcome

**All tasks complete. Content package created. Status: draft_file_only — owner review required before any import action.**

---

## Files Created

| File | Type | Key facts |
|---|---|---|
| `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md` | News draft | EN + RU complete; 2 MoHRE sources cited; no blocked claims; owner review required |
| `docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md` | Calendar items | 2 items (50+ employees, 20–49 employees); EN + RU complete; no blocked claims |
| `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md` | Owner review | Factual safety audit complete; HOLD status — 2 owner decisions required |
| `docs/content-drafts/PHASE_6C35_SUMMARY.md` | Phase summary | This file |

---

## Files Updated (surgical updates)

| File | Change |
|---|---|
| `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` | TAX-01 row status: `hold` → `draft_file_only`. Detail block updated. Cluster A updated. Version: 1.1. |
| `docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md` | Emiratisation item updated to reflect draft created. Phase 6C-35 queue update summary added. |
| `docs/content-drafts/SOURCE_RESEARCH_QUEUE.md` | Emiratisation status updated to `draft_created`. Phase 6C-35 source queue update added. |
| `docs/content-drafts/CONTENT_AUDIT_MATRIX.md` | Phase 6C-35 audit addition section added (files 11 and 12). |

---

## Source Readiness (Task 1)

Verification file checked: `docs/content-drafts/verification/uae-emiratisation-30-june-2026-source-check.md`
Decision: **`can_proceed_to_draft`** — confirmed.

| Source | Type | Status |
|---|---|---|
| MoHRE news 7 May 2026 — June 30 deadline announcement | official_mohre_news | stable_url_captured — recheck_before_publish |
| MoHRE Emiratisation targets page — two thresholds | official_mohre_guidance | stable_url_captured — recheck_before_publish |

---

## Content Package Details

### News draft

- **Slug:** `uae-emiratisation-june-30-2026-deadline`
- **EN SEO title:** "UAE Emiratisation Deadline: 30 June 2026, MoHRE Confirms" (57 chars)
- **EN meta description:** 155 chars (under 160 limit)
- **RU SEO title:** "Срок Emiratisation 30 июня 2026: требования MoHRE для компаний" (62 chars)
- **RU meta description:** 158 chars (under 160 limit)
- **EN summary:** 2 sentences, no em dash
- **RU summary:** 2 sentences, no em dash
- **EN body:** 6 paragraphs — deadline, two thresholds, what to check, free zone scope note, December cycle, skilled jobs note
- **RU body:** 6 paragraphs — structural parity with EN
- **EN/RU key facts tables:** All rows cite source
- **Lifecycle:** compliance_deadline / noindex_after: 2026-07-10 / archive_action: keep_public
- **archive_note:** "After noindex: add note referencing December 31 2026 Emiratisation cycle (TAX-04). Link to TAX-04 article when built."

### Calendar items

Two items created. Not merged — different threshold requirements.

**Item A — 50+ employee companies:**
- Date: 2026-06-30
- Type: compliance_deadline
- EN label: "Emiratisation deadline (50+)"
- RU label: "Срок Emiratisation (50+)"
- Scope note on item: mainland private sector only
- Links to: news slug

**Item B — 20–49 employee companies:**
- Date: 2026-06-30 (to be verified at publish — phase-in date for this threshold must be confirmed)
- Type: compliance_deadline
- EN label: "Emiratisation deadline (20–49)"
- RU label: "Срок Emiratisation (20–49)"
- Scope note on item: mainland private sector only
- Links to: news slug

---

## Owner Review Summary

Two decisions required before import. Package is otherwise CLEAN.

### Decision 1 — Financial contributions framing

**What the drafts say:** "Companies that miss the deadline face financial contributions starting from 1 July 2026." AED amounts are explicitly blocked and redirected to MoHRE.

**Recommendation:** Keep as written — accurate, clearly attributed, useful to readers. Removing the 1 July contributions fact would weaken the article without improving accuracy.

### Decision 2 — 20–49 employee threshold activation date

**What the drafts say:** Drafts state the June 30 deadline applies to the 20–49 employee band, with a note that the phase-in date for this threshold must be verified at publish.

**Action:** Owner to confirm June 30 2026 is the correct date for the 20–49 band. If a different date applies, update Item B in the calendar before import.

---

## Pre-Import Checklist (post-owner-approval)

- [ ] Owner resolves Decision 1 (financial contributions framing)
- [ ] Owner resolves Decision 2 (20–49 band activation date)
- [ ] Recheck MoHRE news URL (7 May 2026) is still live
- [ ] Recheck MoHRE Emiratisation targets page is still live
- [ ] Confirm June 30 deadline has not been extended or cancelled
- [ ] If contribution amounts now published by MoHRE, update article before import
- [ ] Change both file `publish_status` from `not_for_publish_yet` to `owner_review_ready`
- [ ] Import news draft; verify in DB before proceeding to calendar
- [ ] Import calendar item A; verify on live calendar page
- [ ] Import calendar item B only after Decision 2 resolved
- [ ] Verify `robots: index, follow` on both EN and RU pages after publish
- [ ] On 2026-07-10: set news `noindex: 1`, add archive note referencing TAX-04 (December 31 cycle)

---

## Blocked Claims — Phase Gate Verification

All of the following were verified ABSENT from all publishable copy in this phase:

| Blocked claim | Verified absent |
|---|---|
| AED contribution amounts | ABSENT |
| Free zone companies in scope | ABSENT — explicitly stated "not confirmed" |
| Blanket "all companies must comply" | ABSENT — always scoped to 20+ employee private-sector mainland |
| Specific penalty amounts | ABSENT |
| Legal or HR advice | ABSENT — standard disclaimer present |
| MoHRE text copied verbatim | ABSENT |
| Skilled jobs definition enumerated | ABSENT — correctly redirected to MoHRE |

---

## Hard Restrictions — Phase Gate Verification

| Restriction | Status |
|---|---|
| No code changes | CONFIRMED |
| No DB changes | CONFIRMED |
| No admin UI use | CONFIRMED |
| No AI Inbox use | CONFIRMED |
| No import / publish | CONFIRMED |
| No push / deploy / commit | CONFIRMED |
| No env / secrets / GTM / GA4 changes | CONFIRMED |
| No unsupported claims about fines, contributions, free zones | CONFIRMED |
| No content created without official source support | CONFIRMED — two MoHRE sources cited |

---

## Connection to Adjacent Content

| Content | Connection |
|---|---|
| TAX-04 — Emiratisation Dec 31 2026 | Archive note in TAX-01 news body references TAX-04. Build TAX-04 by recycling TAX-01 with updated date and headline when October 2026 approaches. |
| Guidex service path | Path A (WhatsApp HR advisory) + Path G (HR/compliance referral). CTA wired in news draft. |
| MoHRE source ledger | `docs/content-drafts/source-ledgers/uae-mohre-compliance-2026-sources.md` — remains accurate; no changes needed. |

---

## Next Steps After Phase 6C-35

| Priority | Action |
|---|---|
| 1 | Owner reviews this package — resolve 2 decisions — approve for import |
| 2 | Pre-publish source recheck (both MoHRE URLs) |
| 3 | Admin import: news draft → calendar items A and B |
| 4 | Phase 6C-36 or VIRAL-01: UAE Long Weekend Guide 2026–2027 (highest SEO ROI, evergreen) |
| 5 | Phase TAX-02: Corporate Tax FY2025 return (Sept 30 2026 deadline — begin by Aug 1) |
| 6 | Monitor DGHR/KHDA for Eid items E and F (official permalinks still pending) |

---

## Git Status After Phase 6C-35

No commit in this phase. Files created/updated are doc-only. Per CLAUDE.md, memory files must be committed after meaningful steps — that commit should bundle Phase 6C-35 files together with SESSION_LOG, PROJECT_STATE, CHECKPOINTS, and NEW_CHAT_TRANSFER updates.

**Untracked files added this phase:**
- `docs/content-drafts/news/uae-emiratisation-june-30-2026-deadline.md`
- `docs/content-drafts/calendar/uae-emiratisation-june-30-2026-reminder.md`
- `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md`
- `docs/content-drafts/PHASE_6C35_SUMMARY.md`

**Modified files:**
- `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md`
- `docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md`
- `docs/content-drafts/SOURCE_RESEARCH_QUEUE.md`
- `docs/content-drafts/CONTENT_AUDIT_MATRIX.md`

---

*Phase 6C-35 complete — 2026-05-20. No code. No DB. No import. No publish. Owner review required.*
