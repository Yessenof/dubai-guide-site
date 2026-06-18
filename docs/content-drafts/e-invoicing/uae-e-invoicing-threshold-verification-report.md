# Phase 6C-CONTENT-01 — UAE E-invoicing Threshold Verification

**Date:** 2026-06-16 | **Mode:** Verification-only, local files only. No deploy, no commit, no push, no DB writes, no admin/AI Inbox use.

---

## 1. Executive summary

The suspected discrepancy is real and is **currently live on production**. Guidex's October 2026 monthly calendar page states the UAE e-invoicing ASP appointment threshold as **AED 150 million+**. Guidex's own dedicated e-invoicing calendar page and news post — linked directly from that same October page — state the threshold as **AED 50 million+**, for the identical 30 October 2026 deadline. Both pages are published and publicly served right now (verified live via curl, see Section 4).

Three official UAE Ministry of Finance (MoF) sources were checked directly today. All three are consistent with **AED 50 million**. None state AED 150 million. The AED 150 million figure traces back to an internal extraction from a non-official third-party PDF, which had already self-flagged itself as unverified ("verify AED amount (150M vs 50M)") — that flag was never resolved before the figure was imported to production.

**Conclusion: AED 50 million+ is the officially supported threshold. AED 150 million+ has no official-source backing and is a live accuracy error on the October 2026 calendar page.** The 30 October 2026 deadline date itself is correct and consistent everywhere it appears — only the threshold figure is wrong, and only on the October monthly calendar page.

---

## 2. Current suspected issue

Guidex content may state the e-invoicing ASP threshold as AED 150M+ in some places while independent research found AED 50M+ for the same 30 Oct 2026 deadline — a tax/compliance trust risk if a reader sees two different numbers for the same rule on the same site.

This was already flagged internally as a P0 open item in `docs/content-drafts/calendar-research/` (research dated 2026-06-16, recheck-by 2026-07-01) and in `docs/content-drafts/calendar-research/uae-events-research-2026-source-ledger.md` (line 225), but had not yet been checked against a primary MoF/FTA source before this phase.

---

## 3. Official sources checked

Full detail in `docs/content-drafts/e-invoicing/uae-e-invoicing-threshold-source-ledger.md`. Summary:

| # | Source | Authority | Result |
|---|---|---|---|
| 1 | mof.gov.ae — amendment announcement (10 May 2026) | MoF | **AED 50 million**, ASP deadline 30 Oct 2026, go-live 1 Jan 2027 — clear, high confidence |
| 2 | mof.gov.ae — eInvoicing initiative page (accessed today, updated today) | MoF | Confirms regulatory framework and decision numbers; no contradicting newer amendment; timeline is image-only so no threshold text extractable |
| 3 | mof.gov.ae — Cabinet Resolution 106/2025 fines announcement | MoF | Confirms penalty amounts (not threshold-relevant, included for completeness) |
| 4 | tax.gov.ae (FTA) | FTA | No e-invoicing threshold page found — MoF is the lead authority, not FTA |

No official source stating AED 150 million was found.

---

## 4. All repository mentions found

301 matching lines across the repo for the searched terms. Grouped by location below; duplicate EN/RU pairs and near-identical repeated lines within the same file are merged into one row with a line range.

| File | Lines | Claim (paraphrased) | Claim type | Value | Public/Internal | EN/RU parity issue | Risk |
|---|---|---|---|---|---|---|---|
| `scripts/october-2026-calendar-import-6c90.ts` | 5-6, 9, 11-12, 55, 71, 74, 78, 83, 89, 102, 105, 198-205, 218-219, 375 | OCT-04-EINV cross-ref item: "ASP appointment deadline for large businesses (AED 150M+, 30 October)" | threshold + deadline + calendar item | **AED 150M+** | **Public — imported to production DB** | No (EN/RU both wrong identically) | **HIGH — live, contradicted by official source and by Guidex's own other page** |
| `docs/content-drafts/calendar/october-2026-dubai-calendar.md` | 50, 55, 213-214, 243 | Same claim, source draft for the script above | threshold + deadline + draft content | AED 150M+ | Internal draft (origin of the live error) | No | High — root draft for the live error |
| `docs/content-drafts/compliance/PDF_MAKE_FORTUNE_2026_EXTRACTION_MATRIX.md` | 373, 392, 406, 511 | PDF extraction: "E-Invoicing — Phase A ASP Deadline (Large Businesses ≥ AED 150M)"; self-flagged "Threshold may differ from PDF — verify AED amount (150M vs 50M)" | source note / internal note | AED 150M+ (self-flagged unverified) | Internal-only, non-official PDF source | N/A | Medium — likely root cause; flag was never resolved before propagating to the live draft above |
| `docs/content-drafts/daily-radar/6C93A-calendar-import-candidate-pack.md` | 165 | "Threshold: businesses with annual taxable supplies ≥ AED 150M. Verify exact amount before import." | internal note | AED 150M+ (self-flagged unverified) | Internal-only | N/A | Medium — unresolved verification flag, same as above |
| `docs/content-drafts/PHASE_6C90_OCTOBER_2026_CALENDAR_LOCAL_IMPORT_QA.md` | 36-37, 40-41, 87 | QA report recording the AED 150M label as passing local QA | internal note (QA record) | AED 150M+ | Internal-only | No | Medium — QA process did not catch the threshold error |
| `docs/content-drafts/PHASE_6C91_OCTOBER_2026_CALENDAR_PRODUCTION_IMPORT_REPORT.md` | 103 | Production import report recording the AED 150M label as imported live | internal note (deploy record) | AED 150M+ | Internal-only (but documents the live error) | No | Medium — confirms when/how the error reached production |
| `scripts/e-invoicing-indexed-brief-local-import-6c68.ts` | 40-240 (news post + calendar items A/B/C) | News post + dedicated calendar page: ASP deadline extended 31 Jul → 30 Oct 2026, applies to revenue ≥ AED 50 million, go-live 1 Jan 2027, SME deadlines 31 Mar / 1 Jul 2027 | threshold + deadline + metadata | **AED 50M+** | **Public — imported to production DB** | No (EN/RU consistent) | None — confirmed correct by official source |
| `docs/content-drafts/PHASE_6C24_SUMMARY.md`, `PHASE_6C64_E_INVOICING_FRESHNESS_RECHECK_AND_IMPORT_DECISION.md`, `PHASE_6C71A_E_INVOICING_SOURCE_RECHECK_IMPORT_READINESS.md`, `reviews/e-invoicing-2026-owner-review.md` | multiple | Internal verification/QA trail confirming AED 50M against the same official MoF source used in this phase | source note / internal note | AED 50M+ (confirmed) | Internal-only | N/A | None — correct, and already provenance-tracked |
| `docs/content-drafts/calendar-research/uae-events-research-2026-candidates.csv`, `-source-ledger.md`, `-priority-list.md`, `event-page-draft-plan-2026.md`, `news-watchlist-2026.md` | multiple (dated 2026-06-16) | Today's research pass — already flags the 150M vs 50M conflict as P0, recommends recheck by 2026-07-01, cites non-official advisory signals favoring 50M | internal note | Flags conflict, does not resolve it | Internal-only | N/A | None — this phase resolves the flag these files raised |
| Local DB (not a file): draft event `uae-e-invoicing-asp-deadline-july-2026` | — (DB row, referenced in `NOVEMBER_2026_LOCAL_IMPORT_SCHEMA_AUDIT_6C94C.md:135` and `uae-events-research-2026-source-ledger.md:225`) | Draft event still dated 31 July 2026, the deadline that was superseded by the 30 Oct 2026 extension | deadline (stale, unpublished) | 31 July 2026 (superseded) | **Draft, unpublished — not public** | N/A | Low — not live, but should be corrected or deleted in a future DB-touching phase |
| `docs/phase-6a-2026-calendar-content-research-matrix.md`, `docs/phase-5d-connected-calendar-content-bank-plan.md`, `docs/content-brief-uae-business-compliance-calendar-2026-2027.md`, `docs/ai-first-admin-ux-plan.md`, `docs/phase-5e-calendar-ux-product-design.md` | multiple | Early planning docs, mostly pre-dating the May 2026 deadline extension; cite AED 50M (correct threshold) but some still reference "31 July 2026" as the live deadline (correct at time of writing, superseded since) | calendar item / metadata (planning stage) | AED 50M+; some stale "31 Jul" planning dates | Internal-only, never published as-is | N/A | None — superseded planning docs, no live exposure |
| `scripts/import-high-value-event-pages-{production-6c97f,local-6c97e}.ts`, `docs/seo-rag/CONTENT_TRUST_RULES.md`, `docs/phase-5d-connected-calendar-content-bank-plan.md` (generic mentions) | multiple | Generic references to "e-invoicing compliance" with no specific threshold/date claimed | metadata / general content | None (no figure stated) | Mixed (some public guide content) | N/A | None — no claim to verify |
| `lib/localize-value.ts`, `scripts/add-ru-document-attestation.ts`, `scripts/create-attestation-guide.ts`, `scripts/create-pro-services-guide.ts`, `scripts/import-uae-calendar-batch-2b-*.ts` | multiple | "AED 150" mentions are unrelated — MOFA document attestation fees and concert ticket prices, not e-invoicing | unrelated (false-positive match on "150") | N/A | Public, but unrelated to e-invoicing | N/A | None — false positives, excluded from further analysis |

---

## 5. Threshold comparison table

| Claim | Where found | Official source status | Affected deadline | Confidence |
|---|---|---|---|---|
| **AED 150M+** | Live: October 2026 monthly calendar page (production). Internal: October calendar draft, PDF extraction matrix, daily-radar candidate pack, two QA/import reports. | **Not supported by any official MoF/FTA source checked.** Traces to an unresolved flag from a non-official PDF extraction. | 30 October 2026 ASP appointment | High confidence this figure is wrong |
| **AED 50M+** | Live: dedicated e-invoicing calendar page + news post (production). Internal: multiple verification reports (6C-23/24/64/71A), today's research pass. | **Confirmed** by official MoF amendment announcement (10 May 2026), stated explicitly as "entities with annual revenues exceeding AED 50 million." | 30 October 2026 ASP appointment (extended from 31 July 2026); 1 January 2027 mandatory go-live | High |

---

## 6. Deadline comparison table

| Date | Where found | Official source status | Notes |
|---|---|---|---|
| 31 July 2026 | Historical/original ASP deadline, correctly referenced as superseded context on the live AED-50M page ("extended... from 31 July 2026"). Also the stale date on an unpublished draft event in the DB. | **Confirmed as the original (now superseded) deadline.** | No live page incorrectly presents 31 July as still current. |
| 30 October 2026 | Live on both the correct (AED 50M) page and the incorrect (AED 150M) page. | **Confirmed.** Official MoF source: ASP deadline extended to this date. | Date itself is correct everywhere — the live problem is only the AED threshold attached to it on the October monthly page. |
| 1 January 2027 | Live on the AED-50M page. | **Confirmed.** Mandatory go-live for the ≥AED 50M category. | Not contradicted anywhere in the repo. |
| 31 March 2027 / 1 July 2027 | SME deadlines, live on the AED-50M page only. | Sourced to "MoF Electronic Invoicing Guidelines V-1.0, February 2026" in the existing draft — not independently re-fetched in this pass (no public MoF PDF URL located today for this guideline). | Not in scope of the 150M/50M conflict; flagged here only for completeness — treat as **provisional** until a direct PDF/URL is located and checked. |

---

## 7. Claim classification matrix

| Claim | Classification |
|---|---|
| ASP threshold = AED 50 million+ (live e-invoicing calendar page + news post) | **CONFIRMED** |
| ASP threshold = AED 150 million+ (live October monthly calendar page) | **BLOCKED** — contradicted by official source; must not remain live as worded |
| ASP deadline = 30 October 2026 | **CONFIRMED** (date, independent of which threshold figure it's paired with) |
| Mandatory go-live = 1 January 2027 (≥AED 50M category) | **CONFIRMED** |
| SME ASP deadline 31 March 2027 / go-live 1 July 2027 | **PROVISIONAL** — consistent with existing draft sourcing, not independently re-confirmed against a fetchable official URL this pass |
| Government entity ASP 31 March 2027 / go-live 1 October 2027 (mentioned in older planning docs only, not live) | **PROVISIONAL** — not checked this pass, not currently live anywhere |
| Penalty amounts (AED 5,000/month; AED 100/invoice capped 5,000/month; AED 1,000/day) | **CONFIRMED** via Cabinet Resolution 106/2025 announcement |
| "32 approved ASPs" | **CONFIRMED as of 10 May 2026** per MoF source, but is a point-in-time figure already flagged stale in prior phases — re-confirm count before any publish that cites a specific number |
| Draft event `uae-e-invoicing-asp-deadline-july-2026` (31 July 2026, unpublished) | **BLOCKED** — superseded date, not live, should not be published as-is |

No genuine **CONFLICT** between two official sources was found — all official MoF sources checked agree with each other. The conflict is entirely internal (Guidex content vs. Guidex content), with one side backed by an official source and the other side backed by nothing official.

---

## 8. EN/RU parity issues

None found in the threshold figures themselves — wherever AED 150M appears, it appears identically wrong in both EN and RU (`scripts/october-2026-calendar-import-6c90.ts` lines 202-203, and the source draft). Wherever AED 50M appears, it appears identically correct in both EN and RU. The error is a single shared figure reused across both locales, not a translation-introduced discrepancy.

---

## 9. Recommended action

1. Correct the October 2026 monthly calendar page's OCT-04-EINV cross-reference item so it states **AED 50 million+** instead of AED 150 million+, in both EN and RU — to match the dedicated e-invoicing page it links to and the confirmed official MoF figure.
2. This is a **DB content correction** (the live `calendar_pages` row for October 2026), which is explicitly out of scope for this verification-only phase regardless of owner approval, per this phase's hard constraints ("No DB changes"). Recommend opening a narrowly-scoped follow-up phase whose only purpose is this one-field correction.
3. Update the source draft `docs/content-drafts/calendar/october-2026-dubai-calendar.md` to AED 50M now (safe, local-file-only, done in this phase — see Section 12), so any future re-import does not reintroduce the error.
4. Resolve the unverified-flag PDF extraction note (`PDF_MAKE_FORTUNE_2026_EXTRACTION_MATRIX.md`) by recording that AED 50M is now confirmed, AED 150M is not supported — prevents this number from being copied into a future draft again.
5. Delete or correct the stale unpublished draft event `uae-e-invoicing-asp-deadline-july-2026` (31 July 2026) in a future DB-touching phase — low priority since it is not public, but it is dead weight that could confuse a future content pass.
6. Re-confirm the "32 approved ASPs" count and the SME/government PDF-guideline-sourced dates against a fetchable official URL before either is used in any new public content.

---

## 10. Blocked claims

- AED 150 million as the e-invoicing ASP threshold — blocked, no official source found, contradicted by all three official MoF sources checked.
- SME ASP deadline (31 March 2027) and SME go-live (1 July 2027) — provisional only; sourced to a guideline document, not an independently re-fetched official URL this pass. Do not present as fully confirmed until a direct official URL/PDF is located.
- Government entity e-invoicing dates (31 March 2027 ASP / 1 October 2027 go-live, mentioned only in older internal planning docs, never published) — not checked this pass, blocked until verified.
- The unpublished 31 July 2026 draft event — blocked from publishing as-is; superseded.

---

## 11. Proposed wording if confirmed

For the live October 2026 calendar page correction (EN), once a DB-touching phase is approved:

> "E-invoicing Phase A: ASP appointment deadline for large businesses (AED 50M+, 30 October)"

RU equivalent (natural editorial Russian, not literal):

> "E-invoicing, Фаза A: дедлайн назначения ASP для крупных компаний (от 50 млн дирхамов, 30 октября)"

Both phrasings match the wording and status level (confirmed, not provisional) already used on the live AED-50M page, and carry no claim beyond what the MoF source states.

---

## 12. Files safe to update now

These are local, internal, non-public draft/source files. Updated in this phase to prevent the AED 150M error from being reused in any future import:

- `docs/content-drafts/calendar/october-2026-dubai-calendar.md` — AED 150M → AED 50M (EN + RU), 4 locations
- `scripts/october-2026-calendar-import-6c90.ts` — AED 150M → AED 50M (EN + RU), all locations — **note: editing this script does not change the already-imported production DB row; it only prevents the error from being reused if this script is ever re-run**

(See Section 14 for confirmation that no DB, admin, or production file was touched.)

## 13. Files requiring owner approval before live update

- **Production DB**, `calendar_pages` table, October 2026 row, item `OCT-04-EINV` (`label_en` / `label_ru` fields) — currently live with AED 150M+. Requires explicit owner approval **and** a separate phase scoped to allow DB writes (this phase's hard constraints forbid DB changes even with approval).
- Local DB draft event `uae-e-invoicing-asp-deadline-july-2026` — requires owner decision (correct the date vs. delete the unpublished draft) and, again, a DB-write-capable phase.

## 14. No-deploy confirmation

No files outside `docs/content-drafts/e-invoicing/` were modified by this phase except the two listed in Section 12, both of which are pre-production source/script files, not live pages. No production server access occurred. No `git commit` or `git push` was run. No DB connection was opened. No admin or AI Inbox route was used. No schema file was touched.
