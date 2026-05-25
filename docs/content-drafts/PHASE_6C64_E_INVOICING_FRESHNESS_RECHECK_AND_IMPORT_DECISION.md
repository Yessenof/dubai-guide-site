# Phase 6C-64 — E-Invoicing Package Freshness Recheck and Import Decision

**Date:** 2026-05-25
**Phase:** 6C-64
**Scope:** Source freshness recheck + import path decision only — no DB write, no import, no code change, no deploy

---

## Files Inspected

| File | Type | Prior status |
|---|---|---|
| `docs/content-drafts/news/uae-e-invoicing-2026-asp-deadline-update.md` | News draft | owner_review_ready (Phase 6C-25) |
| `docs/content-drafts/guides/uae-e-invoicing-2026-business-readiness.md` | Guide draft | owner_review_ready (Phase 6C-25) |
| `docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md` | Calendar visual post (5 items) | owner_review_ready (Phase 6C-25) |
| `docs/content-drafts/reviews/e-invoicing-2026-owner-review.md` | Owner review | ready — Phase 6C-25 |
| `docs/content-drafts/source-ledgers/uae-e-invoicing-2026-sources.md` | Source ledger | updated Phase 6C-23 |
| `docs/content-drafts/verification/uae-e-invoicing-2026-deadline-conflict.md` | Verification file | FULLY RESOLVED — Phase 6C-23 |
| `docs/content-drafts/PHASE_6C24_SUMMARY.md` | Phase summary | created Phase 6C-24 |
| `docs/content-drafts/PHASE_6C25_SUMMARY.md` | Phase summary | created Phase 6C-25 |
| `docs/content-drafts/CONTENT_AUDIT_MATRIX.md` | Audit matrix | Files 8–10 audited — 4/5 each |
| `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` | Calendar seed matrix | TAX-05A/C at OWNER_REVIEW |

---

## 1. Internal Status at Start of Phase 6C-64

### Package status coming in

| File | EN | RU | Sources | Blocked claims | Lifecycle | Calendar fields | Owner review | Prior score |
|---|---|---|---|---|---|---|---|---|
| News draft | ✓ | ✓ | 4 official | ✓ | Not defined | Ref table only | Required | 4/5 |
| Guide draft | ✓ | ✓ | 4 official | ✓ | Not defined | N/A | Required | 4/5 |
| Calendar post | ✓ | ✓ | 3 official | ✓ (risk notes) | compliance_deadline | Full (5 items) | Required | 4/5 |

### Missing fields identified before freshness recheck

| Field | File | Status |
|---|---|---|
| `lifecycle` | News draft | Not defined — should be `time_sensitive_news`, noindex_after 2027-01-15 |
| `lifecycle` | Guide draft | Not defined — should be `compliance_evergreen`, recheck_annually: true |
| EN SEO title | News draft | ~76 chars — slightly over 65 guideline (acceptable for news; owner confirms) |
| EN SEO title | Guide draft | ~69 chars — slightly over 65 guideline (owner confirms) |
| ASP count | All 3 files | "32 providers as of May 2026" — stale; pre-publish recheck required |
| Free zone scope | All 3 files | Correctly blocked — no official source; "not confirmed" language is safe |

---

## 2. Official Source Freshness Recheck

Recheck performed 2026-05-25 via WebFetch on all primary source URLs.

### Source recheck table

| Source | URL | HTTP | Page title | Key finding | Claim status |
|---|---|---|---|---|---|
| MoF amendment (10 May 2026) | https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ | 200 — LIVE | "Ministry of Finance announces targeted amendments to eInvoicing system decisions" | 30 Oct 2026 confirmed for large businesses (>= AED 50M). 1 Jan 2027 mandatory unchanged. No further amendments visible. | **CONFIRMED — recheck passed** |
| WAM parallel | https://www.wam.ae/en/article/c055277-mof-announces-targeted-amendments-einvoicing | Page loaded | Emirates News Agency header | Body text not extracted (JavaScript-rendered content). Page exists; dates not confirmable from fetch. | **SIGNAL ONLY — not confirmable via WebFetch; MoF article is primary** |
| Cabinet Resolution 106/2025 | https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-cabinet-resolution-on-administrative-fines-related-to-electronic-invoicing-system/ | 200 — LIVE | "Ministry of Finance announces the issuance of Cabinet Resolution on Administrative Fines Related to Electronic Invoicing System" | All 4 fine amounts confirmed: AED 5,000/month (non-implementation/ASP), AED 100/invoice capped AED 5,000/month, AED 100/credit note capped AED 5,000/month, AED 1,000/day (malfunction/data notification failures). | **CONFIRMED — recheck passed** |
| MoF ASP accreditation page | https://mof.gov.ae/en/services/accreditation-of-einvoicing-service-providers/ | 200 — LIVE | Accreditation page | **Critical finding:** This URL is the APPLICATION page for providers seeking accreditation — not a public directory of approved ASPs. No ASP count visible. "32 providers" figure cannot be confirmed from this URL. | **STALE CLAIM — ASP count pre-publish update required from a different source** |
| MoF e-invoicing landing page | https://mof.gov.ae/en/about-us/initiatives/einvoicing/ | 200 — LIVE | Last updated 25/05/2026 | Ministerial Resolution No. (66) of 2026 amending MD 244 of 2025 referenced on page (confirms the amendment exists). Timeline dates are in an image file (not extractable). | **LIVE — amendment confirmed; deadline table in image only** |
| MoF Guidelines V-1.0 PDF | https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoicing-Guidelines_V-1.0-23Feb2026.pdf | 200 — LIVE | Binary PDF (1.8MB) | PDF accessible; binary content not extractable by WebFetch. Document exists and is the same URL. Dates from prior research remain valid from this source. | **ACCESSIBLE — dates from Phase 6C-18/23 research valid** |

### Post-May 10 amendment check

MoF news page scanned (2026-05-25). Articles from May 11 onwards:
- **May 11, 2026** — "Ministry of Finance hosts 2nd awareness event on eInvoicing system in collaboration with Federal Tax Authority and Dubai Chambers" — an awareness session, NOT a deadline amendment
- **May 14, 19, 23, 25, 2026** — unrelated to e-invoicing (GCC meeting, IMF cooperation, treasury bond auction, procurement award)

**Verdict: No further amendments to e-invoicing deadlines detected since May 10, 2026.**

---

## 3. Fact Safety Audit

### Claim-by-claim verdict

| Claim | Source | Status |
|---|---|---|
| ASP deadline for large businesses (>= AED 50M): 30 October 2026 | MoF amendment 10 May 2026 — LIVE | **ALLOWED** |
| Original ASP deadline was 31 July 2026 (now extended) | MoF amendment 10 May 2026 — LIVE | **ALLOWED** |
| Applies to businesses with annual revenue >= AED 50 million | MoF Guidelines V-1.0 + amendment | **ALLOWED** |
| Mandatory implementation: 1 January 2027 (large businesses) | MoF amendment 10 May 2026 — LIVE | **ALLOWED — unchanged** |
| Pilot programme opens 1 July 2026, voluntary adoption from that date | MoF Guidelines V-1.0 (Feb 2026) | **ALLOWED — no amendment to this date detected; pre-publish recheck advised** |
| SME (< AED 50M) ASP deadline: 31 March 2027 | MoF Guidelines V-1.0 | **ALLOWED** |
| SME mandatory implementation: 1 July 2027 | MoF Guidelines V-1.0 | **ALLOWED** |
| Government entities ASP: 31 March 2027, mandatory: 1 October 2027 | MoF Guidelines V-1.0 | **ALLOWED** |
| Fine: AED 5,000/month for failure to implement or appoint ASP | Cabinet Resolution 106/2025 — LIVE | **ALLOWED — must cite Cabinet Resolution 106/2025** |
| Fine: AED 100/invoice, capped AED 5,000/month | Cabinet Resolution 106/2025 — LIVE | **ALLOWED — must cite Cabinet Resolution 106/2025** |
| Voluntary pilot adopters exempt from fines | Cabinet Resolution 106/2025 — LIVE | **ALLOWED** |
| "32 approved ASPs as of May 2026" | MoF ASP page — STALE; accreditation application URL, not public directory | **ALLOWED WITH CAVEAT — must be updated pre-publish to current count from official list** |
| Amendment reference: Ministerial Decision No. 244 of 2025, amended by Ministerial Resolution No. 66 of 2026 | MoF landing page 25/05/2026 — LIVE | **ALLOWED — reference confirmed** |
| Free zone companies must comply | Not confirmed from any official source | **BLOCKED — "not confirmed from reviewed official guidance" language only** |
| "All UAE businesses must implement by 1 January 2027" | Incorrect framing | **BLOCKED — only large businesses; SMEs have 1 July 2027** |
| "The deadline was 31 July 2026" without stating it was extended | Incomplete | **BLOCKED — must always state it was extended to 30 October 2026** |
| "Excel is no longer allowed" | MoF guidance does not use this framing | **BLOCKED** |
| Penalty amounts without citing Cabinet Resolution 106/2025 | Source required | **BLOCKED unless source cited** |
| Legal or tax advice of any kind | Out of scope | **BLOCKED** |

### Critical stale-claim action required

The "32 providers" figure in all three draft files must be updated before any publish. The URL previously used to source this count (`mof.gov.ae/en/services/accreditation-of-einvoicing-service-providers/`) is the accreditation APPLICATION page, not a public approved-provider directory. The count must be sourced from a live public list of approved ASPs before any reference to a specific number is published.

**Interim fix:** Replace "32 providers" with "a list of accredited service providers is published at mof.gov.ae — check the current list before selecting a provider." This wording is in the draft as a backup and is safe to use without a specific number.

---

## 4. EN/RU Quality Status

| Dimension | News draft | Guide draft | Calendar post |
|---|---|---|---|
| EN body complete | ✓ | ✓ | ✓ |
| RU body complete | ✓ | ✓ | ✓ |
| Em dashes EN | Clean (Phase 6C-25) | Clean (Phase 6C-25) | Clean (Phase 6C-25) |
| Em dashes RU | Clean (Phase 6C-25) | Clean (Phase 6C-25) | Clean (Phase 6C-25) |
| Meta descriptions | ✓ under 160 chars | ✓ under 160 chars | N/A |
| SEO title EN | ~76 chars — advisory only | ~69 chars — advisory only | N/A |
| Target keywords EN/RU | ✓ | ✓ | N/A |
| RAG summary | ✓ | ✓ | N/A |
| Blocked claims table | ✓ | ✓ | ✓ risk notes |
| Adviser note | ✓ | ✓ | N/A |
| Scope guards | ✓ | ✓ | ✓ scope_note on each item |

EN/RU parity: confirmed across all three files. No new issues found.

---

## 5. Guide Model Assessment

**The business readiness guide does NOT fit the current `guides` table schema.**

The `guides` table is designed for step-by-step process guides: title, summary, price, timeline, "who this is for", overview, and chronological steps (separate `steps` table with step number, what to do, where to go, address, cost, time, advice, warning).

The e-invoicing business readiness guide (`uae-e-invoicing-2026-business-readiness.md`) is:
- A deadline breakdown + readiness checklist
- Structured around business categories and revenue thresholds
- Not a government process with sequential physical steps
- No "where to go" / address / service centre fields applicable
- No "estimated price" or "estimated timeline" per step

Forcing it into the `guides` schema would require:
- Artificial steps created purely to satisfy the schema (wrong)
- Blank required fields (incomplete)
- Loss of the deadline table structure (content degraded)

**Verdict:** The guide must remain file-based OR be imported into `news_posts` (same pattern as the Long Weekends guide decision in Phase 6C-40).

If imported as `news_posts`:
- URL becomes `/news/uae-e-invoicing-2026-business-readiness`
- All calendar item `detail_url_en/ru` currently set to `/guides/uae-e-invoicing-2026-business-readiness` must be updated before import
- The news draft and the guide would be two separate `news_posts` entries

---

## 6. Calendar Integration Assessment

### Duplicate check

Queried `calendar_pages` table state (from prior research, 4 records total):
- Long Weekends 2026-2027 (yearly, datesJson: 4 items — New Year, Eid Al Fitr, Commemoration Day, National Day)
- May 2026 UAE Calendar (monthly)
- Emiratisation June 30 reminder (important_dates)
- One additional record

**No e-invoicing dates exist in any current calendar_pages record.** No duplicates. Clear to import.

### Recommended calendar structure

| Item | Date | Label EN | Confidence | Import priority |
|---|---|---|---|---|
| A — Pilot starts | 2026-07-01 | UAE e-invoicing pilot starts (voluntary adoption open) | official_baseline_confirmed — recheck before publish | 2 |
| B — Large business ASP deadline | 2026-10-30 | E-invoicing: large business ASP deadline | official_permalink_confirmed — recheck before publish | 1 |
| C — Large business mandatory | 2027-01-01 | E-invoicing mandatory: large businesses | official_baseline_confirmed — recheck before publish | 3 (future year; can include in same import) |

Items D (SME ASP, 2027-03-31) and E (SME mandatory, 2027-07-01): future year — hold for Q4 2026/Q1 2027 planning.

### Calendar page structure (when imported)

| Field | Value |
|---|---|
| `calendar_type` | `important_dates` |
| `slug` | `uae-e-invoicing-2026-deadlines` |
| `en_title` | UAE E-Invoicing 2026: Key Deadlines |
| `year` | 2026 |
| `has_islamic_dates` | false |
| `official_source_url` | https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ |
| `status` | draft (do not publish without owner approval) |

### detail_url decision

If the news post is imported first (before the guide):
- Calendar items A, B, C: `detail_url_en: /news/uae-e-invoicing-2026-asp-deadline-update`
- Calendar items A, B, C: `detail_url_ru: /ru/news/uae-e-invoicing-2026-asp-deadline-update`

If the guide is later imported as `news_posts`:
- Update calendar items' detail_url to point to the guide's news URL

### CTA rule

- News post: `WhatsApp` CTA — compliance content, high advisory value, target audience is business owners
- Calendar page: `detail_url` links only; no external CTA unless owner decides otherwise
- No `hidden` CTA needed — detail pages will exist once news post is imported

### Homepage carousel priority

**Yes — carousel-eligible.** The news article is time-sensitive compliance content (Oct 30, 2026 is ~5 months out). Recommended carousel placement alongside or after the Emiratisation piece.

### noindex / archive behavior

| Content | Lifecycle | noindex_after | archive_action |
|---|---|---|---|
| News post | `time_sensitive_news` | 2027-01-15 (after mandatory implementation date) | keep_public |
| Calendar page | `compliance_deadline` | never | keep_public |
| Guide (if imported as news_posts) | `compliance_evergreen` | never | keep_public |

---

## 7. Import Path Decision

### Option B — Recommended: Import news post + calendar page first. Hold guide.

**What to import:**
1. `news_posts` — the news article (`uae-e-invoicing-2026-asp-deadline-update`) as slug `uae-e-invoicing-2026-asp-deadline-update`
2. `calendar_pages` — new important_dates page (`uae-e-invoicing-2026-deadlines`) with items A (Jul 1), B (Oct 30), and C (Jan 1, 2027) in datesJson

**What to hold:**
- The business readiness guide — does not fit `guides` schema; keep file-based until owner decides the right content type (news_posts or future reference model)

**What NOT to do:**
- Do not import the guide into the `guides` table (schema mismatch, artificial steps)
- Do not use `/guides/uae-e-invoicing-2026-business-readiness` as the detail_url in calendar items unless the guide is actually imported there — use the news post URL instead

**Pre-import checklist:**

- [ ] Owner approves both drafts (news post + calendar page)
- [ ] Recheck MoF amendment article is still live at time of import (confirm 30 Oct 2026 unchanged)
- [ ] Update "32 providers" in news draft to wording without a specific count, OR source current count from official approved-ASP directory
- [ ] Update calendar items' `detail_url_en/ru` to use the news post URL (not `/guides/...`)
- [ ] Confirm pilot start date (1 Jul 2026) not amended by any later MoF announcement
- [ ] Owner decides: should the guide eventually be imported as `news_posts`? If yes, a second import phase is needed.
- [ ] Import news post as status `draft` in DB — do not set `is_published: 1` until after owner final review
- [ ] Import calendar page as status `draft` — set `is_published: 1` only after owner final check

---

## 8. Production Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| 30 Oct 2026 date becomes incorrect due to further amendment | Low | Source confirmed live 2026-05-25; no amendment detected; recheck at import time |
| "All businesses" overclaiming | Low | Revenue threshold stated on every claim; scope guards in all three files |
| Free zone scope claim | Low | Blocked in all three files; "not confirmed" language only |
| ASP count stale | Medium | "32 providers" must be updated pre-publish; safe interim wording available |
| Guide in wrong DB table | High if forced | Do NOT import guide into guides table; hold file-based |
| Calendar items linking to non-existent guide URL | Medium if not fixed | Must update detail_url to news post URL before import |
| Penalty amounts without citation | Low | Cabinet Resolution 106/2025 cited in all files |
| Legal/tax advice tone | Low | Adviser note and scope disclaimers present throughout |

---

## 9. Documents Updated This Phase

| Document | Change |
|---|---|
| `docs/content-drafts/reviews/e-invoicing-2026-owner-review.md` | Phase 6C-64 freshness recheck section added; ASP count stale finding noted; import path decision added |
| `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` | TAX-05A and TAX-05C: source recheck date updated to 2026-05-25; sources confirmed live; import decision noted |

---

## 10. What Was Not Touched

- DB: not touched
- Admin panel: not touched
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Code: not touched
- No imports, no deployments

---

## Final Q&A

| Question | Answer |
|---|---|
| Are official sources still live and sufficient? | Yes. MoF amendment article (primary source) confirmed live 2026-05-25. Cabinet Resolution 106/2025 confirmed live. MoF landing page confirmed live (updated 25/05/2026). No further amendments detected since May 10, 2026. |
| Are e-invoicing drafts still fact-safe? | Yes. All deadline claims remain backed by confirmed live official sources. One stale claim: "32 providers" — must be updated pre-publish (or removed from specific count). |
| Which claims are allowed? | 30 Oct 2026 ASP deadline (large businesses >= AED 50M); 1 Jan 2027 mandatory (large businesses); Jul 1, 2026 pilot start; SME dates Mar 31/Jul 1 2027; fine amounts from Cabinet Resolution 106/2025 (with citation); pilot adopters exempt from fines; white-label mechanism introduced by the amendment. |
| Which claims remain blocked? | "All UAE businesses by 1 Jan 2027"; "free zone companies must comply"; "Excel is no longer allowed"; specific ASP count without current source; legal/tax advice of any kind; penalty amounts without citing Cabinet Resolution 106/2025. |
| Should the next phase be local import QA? | Yes — after owner approves. Pre-import actions: update ASP count wording; update calendar detail_url to news post URL; add lifecycle fields to news draft and guide draft. Then local import QA for news post + calendar page. |
| If yes, import which content types first? | **Option B:** (1) news_posts — news article; (2) calendar_pages — new important_dates page with items A, B, C. Hold the guide file-based. |
| Is the guide safe for the current guides model, or should it remain file-based? | **Remain file-based.** The guides table is steps-based (step number, where to go, address, cost, time). The e-invoicing business readiness guide is a deadline breakdown + readiness checklist — no process steps apply. Forcing it into the guides table would require artificial steps and degrade content quality. Owner should decide whether to import it as news_posts (same pattern as Long Weekends guide) or hold for a future reference content type. |

---

*Internal planning document — Phase 6C-64 — 2026-05-25. Not for publish. No admin action. No DB write.*
