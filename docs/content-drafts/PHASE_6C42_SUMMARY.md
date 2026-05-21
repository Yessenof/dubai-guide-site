# Phase 6C-42 — Public Content Display Standard — Summary

**Status:** COMPLETE — local validated, not yet committed/deployed  
**Date:** 2026-05-21  
**TypeScript:** 0 errors  
**Build:** 86 pages, 0 errors  
**Scope:** Standards definition + component audit + one targeted UI fix  

---

## Objective

Create a permanent, authoritative public content display standard for Guidex detail pages.
Apply any small, clearly-needed UI improvements discovered during the audit.
Validate that the current system complies with the standard.

---

## Files created

| File | Purpose |
|---|---|
| `docs/content-drafts/PUBLIC_CONTENT_DISPLAY_STANDARD.md` | Permanent display standard — 10 sections, component reference, pre-publish QA checklist |
| `docs/content-drafts/PHASE_6C42_SUMMARY.md` | This report |

---

## Files modified

| File | Change | Reason |
|---|---|---|
| `components/MarkdownBody.tsx` | HR (`---`) margin `my-1` → `my-3` | `my-1` (4px) was too tight for a visual section divider; `my-3` (12px) gives proper breathing room between body sections |

---

## Standard added

`PUBLIC_CONTENT_DISPLAY_STANDARD.md` defines 10 rules:

1. **First-screen rule** — exact element order for news/event/calendar/guide detail pages
2. **First paragraph SEO/RAG rule** — 6 required elements; must answer main intent in 10 seconds
3. **Bold usage rule** — 6 valid use cases; no bolding entire paragraphs; max 3–4 per 250 words
4. **Typography/readability rule** — full table of px values, colors, line heights, spacing locked to current system
5. **Table/card rule** — overflow-x-auto wrapper, responsive dates list, key facts above body
6. **Calendar context rule** — CalendarContextCta position (before body for events/calendar, after body for news); no duplicate CTAs
7. **RU content standard** — editorial adaptation not literal translation; no EN fallback; RU label verification list
8. **SEO/RAG/AEO rule** — 4 discovery modes; hreflang rules; never noindex published pages
9. **Public/internal separation rule** — list of what must never appear in rendered HTML
10. **Pre-publish visual QA checklist** — 25-point checklist: desktop, mobile, EN/RU parity, content integrity, SEO, CTA

---

## Component audit results

| Component | Status | Finding |
|---|---|---|
| `components/MarkdownBody.tsx` | Minor fix applied | HR `my-1` → `my-3`. All other rules already compliant: 15px body, 1.72 line height, border-t headings, rounded border tables, font-semibold bold. |
| `components/calendar/CalendarContextCta.tsx` | No changes needed | Correct structure: date pills, month link, secondary "Open calendar" link. No broken links. No duplicate CTAs. EN/RU labels correct. |
| `components/calendar/CalendarGrid.tsx` | No changes needed | Monday-first confirmed (rawFirstDay + 6) % 7 formula). Filter chips, legend, picker, side panel all functional. |
| `app/(en)/(public)/news/[slug]/page.tsx` | No changes needed | Source block before body; CalendarContextCta after body. 15px/1.6 summary. |
| `app/(en)/(public)/events/[slug]/page.tsx` | No changes needed | Source block before confidence notice; CalendarContextCta before body. 15px/1.6 summary. |
| `app/(en)/(public)/calendar/[slug]/page.tsx` | No changes needed | officialSourceUrl + lastVerifiedDate rendered. Islamic dates notice. CalendarContextCta before body. |
| `app/ru/news/[slug]/page.tsx` | No changes needed | RU labels correct. Source block present. CalendarContextCta after body. |
| `app/ru/events/[slug]/page.tsx` | No changes needed | RU labels correct. Source block present. |
| `app/ru/calendar/[slug]/page.tsx` | No changes needed | RU labels correct. officialSourceUrl + lastVerifiedDate rendered. |

---

## Validation results

| Check | Result |
|---|---|
| TypeScript | EXIT:0 — 0 errors |
| Build | 86 pages, 0 errors |
| Raw Markdown (4 routes) | 0 on all |
| robots: index, follow (4 routes) | Confirmed on all |
| Lang attributes (12 routes) | EN correct on all EN routes; RU correct on all /ru/* routes |
| HTTP status (12 routes) | 200 on all |

---

## Git status

**Modified (not staged):**
- `components/MarkdownBody.tsx` — HR margin fix

**Untracked (not staged):**
- `docs/content-drafts/PUBLIC_CONTENT_DISPLAY_STANDARD.md`
- `docs/content-drafts/PHASE_6C42_SUMMARY.md`

**Not staged (intentionally deferred):**
- `CHECKPOINTS.md`, `SESSION_LOG.md`, `PROJECT_STATE.md`, `NEW_CHAT_TRANSFER.txt` — pending separate doc-only commit

**Not committed, not pushed, not deployed.**

---

## What was not touched

- DB — no changes, no migrations, no imports
- Published content — no new records
- Admin panel — untouched
- Env / secrets / GTM / GA4 — untouched
- Routes — all URLs unchanged
- `proxy.ts` — untouched
- Long Weekend files — untouched
- Source ledgers — untouched

---

## Recommended next phase

**Option A — Phase 6C-43: Long Weekend VIRAL-01 content import**  
The Long Weekend guide, news, and calendar items are drafted and ready. Owner decision pending on: import path (news_posts vs. dedicated table), update cadence, and publication timing.

**Option B — Phase 6C-43: Memory files commit**  
CHECKPOINTS.md, SESSION_LOG.md, PROJECT_STATE.md, NEW_CHAT_TRANSFER.txt need a separate doc-only commit to capture the state after 6C-40A, 6C-40B, 6C-41, and 6C-42.

**Option C — Phase 6C-43: Admin functional test on production**  
One manual admin login → content edit view → verify UI loads correctly after the app/(en)/admin/ route-group move. No DB write required.

**Recommended commit scope for Phase 6C-42 (when approved):**
- `components/MarkdownBody.tsx`
- `docs/content-drafts/PUBLIC_CONTENT_DISPLAY_STANDARD.md`
- `docs/content-drafts/PHASE_6C42_SUMMARY.md`

Commit message: `docs: add public content display standard and apply HR spacing fix`
