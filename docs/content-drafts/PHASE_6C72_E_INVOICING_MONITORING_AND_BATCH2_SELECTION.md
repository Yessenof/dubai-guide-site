# Phase 6C-72 — E-Invoicing Post-Import Monitoring and Batch 2 Calendar Selection

**Date:** 2026-05-26
**Phase:** 6C-72
**Scope:** Documentation only — no code, no DB, no imports, no publish, no deploy, no push

---

## 1. E-Invoicing Post-Import Monitoring Results

Checked ~24 hours after Phase 6C-71B production import.

### 1a. Route status — 10/10 pass

| Route | Status |
|-------|--------|
| `/calendar/uae-e-invoicing-2026-asp-deadline` | 200 ✓ |
| `/ru/calendar/uae-e-invoicing-2026-asp-deadline` | 200 ✓ |
| `/news/uae-e-invoicing-2026-asp-deadline-update` | 200 ✓ |
| `/ru/news/uae-e-invoicing-2026-asp-deadline-update` | 200 ✓ |
| `/calendar?month=2026-07` | 200 ✓ |
| `/ru/calendar?month=2026-07` | 200 ✓ |
| `/calendar?month=2026-10` | 200 ✓ |
| `/ru/calendar?month=2026-10` | 200 ✓ |
| `/` | 200 ✓ |
| `/ru` | 200 ✓ |

### 1b. Content invariants — all pass

| Check | Result |
|-------|--------|
| Robots: no X-Robots-Tag on `/calendar/uae-e-invoicing-2026-asp-deadline` | absent = index, follow ✓ |
| Robots: no X-Robots-Tag on `/news/uae-e-invoicing-2026-asp-deadline-update` | absent = index, follow ✓ |
| `<details>` count EN calendar | 3 ✓ |
| `<details>` count RU calendar | 3 ✓ |
| EN brief text renders ("30 October 2026 is the deadline") | ✓ |
| RU brief text renders (Министерство финансов / 30 октября 2026) | ✓ |
| No EN fallback on RU (Электронные инвойсы в ОАЭ 2026 renders) | ✓ |
| Source label visible ("Official source") | ✓ |
| CTA href → `/news/uae-e-invoicing-2026-asp-deadline-update` | ✓ |
| Stale "32 providers" absent on news page | 0 ✓ |
| Raw JSON field names absent | 0 ✓ |
| Raw Markdown absent | 0 ✓ |
| CSS: `0ac1tmhoyyo1o.css` — 200 text/css | ✓ |

**E-invoicing is stable. No issues detected.**

---

## 2. GSC Monitoring Checklist — Owner Action Required

### URLs to submit for indexing NOW (URL Inspection → Request Indexing)

1. `https://guidex-consulting.ae/calendar/uae-e-invoicing-2026-asp-deadline`
2. `https://guidex-consulting.ae/ru/calendar/uae-e-invoicing-2026-asp-deadline`
3. `https://guidex-consulting.ae/news/uae-e-invoicing-2026-asp-deadline-update`
4. `https://guidex-consulting.ae/ru/news/uae-e-invoicing-2026-asp-deadline-update`

### Monitoring schedule

**24 hours after submission (check 2026-05-27):**
- [ ] All 4 URLs show "URL is on Google" or "Discovered — currently not indexed"
- [ ] No "noindex" signal detected by GSC
- [ ] No "Blocked by robots.txt" signal
- [ ] No "Redirect error" or "Not found (404)" signal

**48 hours (2026-05-28):**
- [ ] EN news page indexed or in crawl queue
- [ ] EN calendar page indexed or in crawl queue
- [ ] Canonical selected by Google matches the URL (not a redirect)
- [ ] Mobile usability: no issues flagged

**72 hours (2026-05-29):**
- [ ] RU pages showing as discovered or indexed
- [ ] Both EN pages showing as indexed (or confirm crawl queue with no errors)
- [ ] Sitemap: confirm `https://guidex-consulting.ae/sitemap.xml` includes both new slugs

**If any page shows "Discovered — not indexed" after 72h:**
- Check if the page appears in the sitemap
- Check rendered HTML via GSC URL Inspection → View Tested Page
- Confirm `<title>` and `<meta description>` are populated
- Confirm there is no noindex in the `<head>` (should not be — but verify)

**If "noindex detected" appears:**
- Report immediately — this would be a code-level issue in the calendar/news page template
- Do not attempt a code fix without owner approval

---

## 3. Status Updates — Already-Live Items

The following items from the Phase 6C-69 first 30 candidates are now already live in production. Do not reimport.

| Item | Status |
|------|--------|
| Long Weekends 2026-2027 (VIRAL-01) | already_live — do not reimport |
| Emiratisation June 30 2026 (TAX-01A) | already_live — do not reimport |
| Eid Al Adha 2026 news post | already_live — do not reimport |
| E-invoicing pilot TAX-05A (Jul 1 2026) | already_live — do not reimport |
| E-invoicing ASP deadline TAX-05C (Oct 30 2026) | already_live — do not reimport |
| E-invoicing mandatory TAX-05D (Jan 1 2027) | already_live — do not reimport |

---

## 4. Batch 2 Candidate Analysis — Key Findings

**Event drafts already exist:**
- `docs/content-drafts/events/gitex-global-2026.md` — draft exists ✓
- `docs/content-drafts/events/formula-1-abu-dhabi-grand-prix-2026.md` — draft exists ✓
- Guide draft exists: `docs/content-drafts/guides/uae-corporate-tax-deadline-9-month-rule.md` ✓

These three items are further along than the 30-candidate list indicated — they can move to owner review faster.

**Source readiness summary:**
- T2 (source confirmed, content not written): 19 items — DWTC sources, DFC, DDW, Downtown Design, F1, GITEX
- T3 HOLD (source needed): Islamic New Year, DSF, Global Village, Ramadan
- T3 MONITOR: National Day scope (date known, FAHR 2026 holiday scope pending)

---

## 5. Top 3 to Prepare First

### 1 — Corporate Tax FY2025 deadline
**Why first:** Sep 30 2026 deadline requires 8-week minimum SEO lead time. That window opens NOW for an August 1 2026 publish target. Guide draft exists. FTA sources captured. If this slips past August, we lose the pre-deadline search window entirely.

**What's needed:** Owner review of existing guide draft (`uae-corporate-tax-deadline-9-month-rule.md`); create calendar topic page `uae-corporate-tax-fy2025-deadline`; recheck FTA source URLs before import.

**Level:** L3 topic calendar page + existing guide draft as companion content.

### 2 — GITEX Global 2026
**Why second:** Event draft exists. Sources confirmed (gitex.com + Dubai Exhibition Centre, both checked 2026-05-19). Dec 8-11 expo + Dec 7 summit. Business/founder/investor audience — strongest Guidex alignment of all events. Publish by October 1 to capture pre-GITEX search traffic.

**What's needed:** Owner review of existing event draft (`gitex-global-2026.md`); source recheck immediately before import; create Dec 2026 monthly calendar page with GITEX items.

**Level:** L3 standalone event page + L1/L2 items in Dec monthly.

### 3 — Dubai Fitness Challenge 2026
**Why third:** Covers Oct 31–Nov 29. Source confirmed with 5 sub-event dates (Dubai Ride Nov 1, Stand Up Paddle Nov 7-8, Dubai Run Nov 22, Dubai Yoga Nov 29). One draft creates the event page AND populates both Oct and Nov monthly calendar pages. Strongest resident lifestyle angle.

**What's needed:** Create event draft `dubai-fitness-challenge-2026.md`; add to Oct and Nov monthly pages when those are created; recheck DFC site before import.

**Level:** L2 event page + L1 sub-event items in Oct/Nov monthly pages.

---

## 6. Top 10 Batch 2 Items — Ranked

| Rank | Item | Date | Level | Prep status | Publish by | Month unlocked |
|------|------|------|-------|------------|-----------|----------------|
| 1 | Corporate Tax FY2025 deadline | Sep 30 2026 | L3 topic page | Guide draft exists; FTA sources captured | Aug 1 2026 | Sep monthly |
| 2 | GITEX Global 2026 | Dec 7-11 2026 | L3 event page | Event draft exists; sources confirmed | Oct 1 2026 | Dec monthly |
| 3 | Dubai Fitness Challenge 2026 | Oct 31-Nov 29 | L2 event page | Source confirmed; draft not written | Sep 1 2026 | Oct + Nov monthly |
| 4 | Formula 1 Abu Dhabi GP 2026 | Dec 4-6 2026 | L3 event page | Event draft exists; 3 sources confirmed | Nov 1 2026 | Dec monthly |
| 5 | Arabian Travel Market 2026 | Aug 17-20 2026 | L1 monthly item | DWTC source confirmed; no draft needed | Jul 15 2026 | Aug monthly (first new monthly) |
| 6 | Dubai Design Week 2026 | Nov 3-8 2026 | L2 monthly item | DDW source confirmed; draft not written | Sep 1 2026 | Nov monthly |
| 7 | Big 5 Global 2026 | Nov 23-26 2026 | L2 monthly item | DWTC source confirmed; draft not written | Sep 1 2026 | Nov monthly |
| 8 | International Property Show 2026 | Sep 7-9 2026 | L1 monthly item | DWTC source confirmed; no draft needed | Jul 15 2026 | Sep monthly |
| 9 | Emiratisation Dec 31 2026 | Dec 31 2026 | L3 topic page | MoHRE/NAFIS confirmed; draft not written | Oct 1 2026 | Dec monthly |
| 10 | WETEX 2026 | Oct 20-22 2026 | L2 monthly item | DWTC source confirmed; draft not written | Aug 15 2026 | Oct monthly |

---

## 7. Which Items Need Full Pages

| Item | Why full page |
|------|--------------|
| Corporate Tax FY2025 deadline | Standalone topic: multiple audience segments (founders, employees, accountants), 9-month rule requires explanation, high-value keyword |
| GITEX Global 2026 | Standalone event page: venue, dates, business planning notes, connection to company setup / Golden Visa / banking content |
| Formula 1 Abu Dhabi GP 2026 | Standalone event page: travel planning from Dubai, multiple date items (practice, qualifying, race), Abu Dhabi location label required |
| Dubai Fitness Challenge 2026 | Standalone event page: 30-day citywide event, multiple sub-events, resident planning content |
| Emiratisation Dec 31 2026 | Standalone topic: compliance deadline, recycles TAX-01 content pattern, distinct audience from June 30 page |

---

## 8. Which Items Are Calendar Brief Only

These should be Level 1 or Level 2 items in monthly calendar pages — no standalone page needed now.

| Item | Level | Reason |
|------|-------|--------|
| Arabian Travel Market 2026 | L1 | Trade-only; DWTC listing sufficient |
| International Property Show 2026 | L1 | Trade-only; limited public-facing angle |
| Private Label Middle East 2026 | L1 | Trade-only; low Guidex audience relevance |
| Beautyworld Middle East 2026 | L1 | Trade-only; calendar-only unless beauty/retail business angle develops |
| WETEX 2026 | L2 | Business relevance (sustainability, energy) — brief with external CTA; no standalone page needed at launch |
| Dubai Design Week 2026 | L2 | Design/property angle — brief in Nov monthly; standalone page only if design content cluster grows |
| Downtown Design Dubai 2026 | L1 | Runs alongside DDW; L1 cell with external link |
| Big 5 Global 2026 | L2 | Construction/property brief; standalone only if content cluster expands |
| Dubai Ride, Stand Up Paddle, Dubai Run, Dubai Yoga | L1 | Sub-events of DFC; cell items pointing to DFC event page |
| New Year 2027 | L1 | Fixed statutory holiday; Jan 2027 monthly |
| Commemoration Day Dec 1 2026 | L1 | Date confirmed; scope pending FAHR announcement |
| Abu Dhabi GP items in Dec monthly | L2 | Cross-ref to standalone event page with Abu Dhabi location label |

---

## 9. Which Items Are Blocked by Source Risk

| Item | Block reason | Watch from |
|------|-------------|-----------|
| Islamic New Year 1448H | No FAHR announcement issued | Late May 2026 |
| Mawlid An-Nabi 1448H | No FAHR announcement issued | July 2026 |
| National Day 2026 holiday scope | Date confirmed; FAHR 2026 scope circular pending | October 2026 |
| Commemoration Day 2026 scope | Date confirmed; FAHR 2026 scope pending | October 2026 |
| Dubai Shopping Festival 2026/2027 | Official dates not yet confirmed | September 2026 |
| Global Village Season 31 | Official opening date not yet confirmed | July 2026 |
| Ramadan 1448H 2027 | FAHR/WAM announcement expected January 2027 | December 2026 |
| Eid Al Fitr 2027 | Moon-sighting confirmation | February 2027 |
| VAT return reminders | Only if official FTA cycle source captured | As needed |

---

## 10. Month Coverage — Before and After Batch 2

| Month | Before Batch 2 | After Batch 2 (projected) |
|-------|---------------|--------------------------|
| Jun 2026 | No monthly page | Still needs monthly page; Islamic New Year on hold |
| Jul 2026 | No monthly page | E-invoicing pilot cross-ref; Islamic New Year on hold |
| Aug 2026 | No monthly page | **ATM Aug 17-20 (1 item)** — first new monthly created |
| Sep 2026 | No monthly page | **IPS Sep 7-9; Private Label Sep 15-17; Corp Tax Sep 30 cross-ref (3 items)** |
| Oct 2026 | No monthly page | **Beautyworld Oct 6-8; WETEX Oct 20-22; E-invoicing ASP cross-ref; DFC Oct 31 (4 items)** |
| Nov 2026 | No monthly page | **DFC (5 sub-events), Design Week, Downtown Design, Big 5 (9+ items) — busiest month** |
| Dec 2026 | No monthly page | **F1 Abu Dhabi GP, GITEX Summit, GITEX Expo, National Day L1, Emiratisation Dec 31 (5+ items)** |
| Jan 2027 | No monthly page | **New Year 2027, E-invoicing mandatory cross-ref (2 items)** |

**Fastest path to a live-looking calendar:** Aug monthly page first (just 1 ATM item + month context = fast to create). Sep and Oct monthly pages are also small. Nov and Dec are dense and should be prepared together with their event drafts.

---

## 11. What Was Not Touched

- No production DB
- No imports
- No code changes
- No schema changes
- No admin or AI Inbox
- No publish or push

---

## 12. Git Status

Uncommitted files present:
- `CHECKPOINTS.md`, `PROJECT_STATE.md`, `SESSION_LOG.md`, `NEW_CHAT_TRANSFER.txt` (modified memory files)
- Various doc files modified during Phases 6C-69/69B/69C (source ledgers, drafts)
- Untracked: Phase 6C-71A/71B docs, Phase 6C-72 docs (this phase)
- Untracked: `scripts/e-invoicing-indexed-brief-local-import-6c68.ts` (created during Phase 6C-68, used on production via SCP)

A single commit is recommended to capture:
1. Memory files (CHECKPOINTS, PROJECT_STATE, SESSION_LOG, NEW_CHAT_TRANSFER)
2. Import script (the Phase 6C-68 import script — now used on production)
3. Phase 6C-71A/71B/72 report docs
4. Batch 2 candidates doc

**This commit requires separate owner approval. Do not commit until approved.**

---

## 13. Answers to Final Report Questions

**Is e-invoicing stable after production import?**
Yes. All 10 monitored routes return 200. Both EN and RU pages render correctly. 3 `<details>` blocks present on each calendar page. Stale "32 providers" text absent. CSS intact. No issues.

**What must owner check in GSC?**
Submit 4 URLs via URL Inspection → Request Indexing. Monitor for 24h/48h/72h using the checklist in Section 2. Key risk to watch: any "noindex detected" signal (should not appear — routes are `index, follow`).

**Which 8-12 candidates are best for Batch 2?**
Top 10 listed in Section 6. Corporate Tax, GITEX, DFC, F1, ATM, Design Week, Big 5, IPS, Emiratisation Dec 31, WETEX.

**Which 3 should be prepared first?**
1. Corporate Tax FY2025 deadline — P0, Aug 1 target, existing draft
2. GITEX Global 2026 — existing draft, Oct 1 target
3. Dubai Fitness Challenge 2026 — strongest resident event, Sep 1 target

**Which items need full pages?**
Corporate Tax, GITEX, F1 Abu Dhabi GP, Dubai Fitness Challenge, Emiratisation Dec 31.

**Which items can be indexed briefs only?**
ATM, IPS, Private Label, Beautyworld, WETEX, Dubai Design Week, Downtown Design, Big 5, DFC sub-events, New Year 2027, Commemoration Day (when FAHR confirms scope).

**Which items are blocked by source risk?**
Islamic New Year, Mawlid, National Day scope, Commemoration Day scope, DSF, Global Village, Ramadan, Eid Al Fitr 2027.

**What is the fastest safe path to make 2026-2027 calendar look alive?**
1. Create Aug 2026 monthly page with ATM — fastest to build (1 L1 item, DWTC source confirmed, no draft needed)
2. Create Sep 2026 monthly page with IPS + Private Label (2 L1 items, both DWTC source confirmed)
3. Prepare Corporate Tax topic page — highest SEO value, existing guide draft to adapt
4. Owner reviews GITEX and F1 event drafts — both exist, sources confirmed, ready for source recheck
5. Draft DFC event page and create Oct/Nov monthly pages together

Monthly pages are quick: each page needs title, summary, body (~3 paragraphs), and dates_json items. The content already exists in source ledgers and candidate docs. Admin import is straightforward once drafts are approved.

---

**Phase 6C-72 complete. Documentation only. No code. No DB. No imports. No push. No deploy.**
