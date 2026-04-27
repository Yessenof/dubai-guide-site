# Above-the-Fold Priority Audit

Last updated: 2026-04-21

---

## Viewport Reference

| Device | Viewport height | Available after header (56px) |
|---|---|---|
| iPhone SE (375×667) | 667px | **611px** |
| iPhone 14 (390×844) | 844px | **788px** |
| iPhone 14 Pro Max (430×932) | 932px | **876px** |
| Desktop 1280px | 800px typical | **744px** |

The critical viewport for this site is **375×667** — the smallest common iPhone. Every above-the-fold decision is made for this size first.

---

## Current Homepage Section Map

Sections in render order, with estimated pixel heights at 375px:

| # | Section | Est. height (375px) | Cumulative |
|---|---|---|---|
| 1 | Hero | ~330px | 330px |
| 2 | QuickDecisionCards | ~270px | 600px |
| 3 | RouteSnapshotBand | ~680px | 1280px |
| 4 | HowItWorks | ~200px | 1480px |
| 5 | Featured Guides (3 cards) | ~540px | 2020px |
| 6 | CtaCard | ~100px | 2120px |

**What is above the fold on iPhone SE (611px available):**
- All of Hero (~330px)
- ~281px of QuickDecisionCards — that is the section heading (50px) plus 2 rows of 2 cards (~160px) = **4 cards visible**, 2 cut off below

**What is above the fold on iPhone 14 (788px available):**
- All of Hero (~330px)
- All of QuickDecisionCards (~270px) — leaving ~188px → section heading of RouteSnapshotBand is partially visible

---

## Hero Height Analysis

Current Hero (`pt-12 pb-10 px-5`) breakdown at 375px:

| Element | Estimated height |
|---|---|
| `pt-12` top padding | 48px |
| Eyebrow "Dubai Guide" label | 20px |
| `mb-4` gap | 16px |
| h1 "Dubai Visas and Procedures — Step by Step" (2 lines at 28px) | ~72px |
| `mb-4` gap | 16px |
| Subheadline paragraph (2–3 lines at 15px leading-relaxed) | ~72px |
| `mb-7` gap | 28px |
| Topic pills row (1 row wrapping to 2, gap-2) | ~60px |
| `mb-8` gap | 32px |
| CTA button + secondary link row | ~72px |
| `pb-10` bottom padding | 40px |
| **Total** | **~476px** |

Wait — this exceeds the 611px available viewport by itself when including the section heading of QuickDecisionCards. Let me restate: at 375px, the Hero alone is consuming ~476px, leaving only ~135px for QuickDecisionCards content, meaning only the section heading and first row of 2 cards are visible.

**The Hero is too tall. It is consuming 78% of the iPhone SE viewport before a single tappable route card appears.**

---

## Hero Element-by-Element Audit

| Element | Keep? | Reason |
|---|---|---|
| Eyebrow "Dubai Guide" | **Remove** | The logo says "Dubai Guide." This label is redundant and adds 36px (element + gap) before the h1. |
| h1 "Dubai Visas and Procedures — Step by Step" | **Keep** | Clear, searchable, establishes scope. Can tighten font from 28px to 24px to save ~12px per line. |
| Subheadline paragraph | **Shorten** | Currently 2–3 lines. Should be 1 line max (≤60 chars). Cut to: "Official fees and process — in plain English." |
| Topic pills (Visas, Company Setup, Hiring…) | **Remove** | All 5 pills link to `/guides`. They add no routing value — they go to the same destination as the "Browse All Guides" CTA already below them. They consume ~92px (element + gap) for zero navigation differentiation. |
| "Browse All Guides" primary CTA | **Keep but reconsider** | On a homepage where QuickDecisionCards immediately below are the action layer, this CTA may be redundant. The user's next action should be a card tap, not "Browse All Guides." Consider removing and letting QuickDecisionCards carry all the action weight. |
| "Find My Route →" secondary CTA | **Remove** | Links to `/guides` — same destination as the primary CTA. Two CTAs to the same URL is a design error. |

**Result of removing the four flagged elements:**

| Element | Height saved |
|---|---|
| Eyebrow label + mb-4 | ~36px |
| Topic pills + mb-8 | ~92px |
| Secondary CTA ("Find My Route →") | ~36px |
| Reduce top/bottom padding pt-12→pt-8, pb-10→pb-4 | ~64px |
| Shorten subheadline to 1 line | ~36px |
| **Total recovered** | **~264px** |

Compressed Hero target height: **~212px**

With 212px Hero + 56px header = 268px used. On iPhone SE: **343px available** for QuickDecisionCards — enough for all 6 cards (~270px) plus the section heading.

---

## QuickDecisionCard Audit

| Card | Current href | Status |
|---|---|---|
| Sponsor my spouse | `/guides/spouse-dependent-visa-dubai` | ✅ live group page |
| Bring my child to Dubai | `/guides/child-dependent-visa-dubai` | ✅ live group page |
| Newborn visa | `/guides` | ⚠️ no guide — safe fallback but a dead card |
| Get a Golden Visa | `/visas/golden` | ✅ live hub |
| Employment visa | `/guides/employment-visa` | ✅ live guide |
| Find my route | `/guides` | ⚠️ no calculator — dead card |

**Two of six cards are placeholders.** They tap through to the generic guide list, which is a mismatch of expectation and destination.

**Recommendation:**
- Replace "Newborn visa" with "Set up a company" → `/company-setup` (when hub + first guide are live) or hold the slot empty (show 5 cards in a different layout)
- Replace "Find my route" with "Open a bank account" → `/company-setup/bank-account` (when guide is live) or hold
- Do not ship placeholder cards to ad traffic. Users who tap "Newborn visa" and land on `/guides` lose confidence immediately.

**Interim option:** Reduce to 4 cards (2×2 grid) showing only live destinations. Smaller grid, no dead cards, cleaner above-the-fold view.

---

## Section Priority Scoring

Scored for three user types:
- **Ad traffic** — arrives from paid search or social, specific intent, fast
- **SEO organic** — arrives from Google on a specific query, moderate intent  
- **Direct/return** — knows the site, browsing for updates

| Section | Ad traffic | SEO organic | Direct | Overall priority | Fold position |
|---|---|---|---|---|---|
| Hero (compressed) | High | High | Low | **High** | Above fold |
| QuickDecisionCards | **Critical** | Medium | High | **Critical** | Above fold |
| RouteSnapshotBand | Low | **High** | Medium | Medium | Below fold |
| HowItWorks | **None** | Low | Low | **Low** | Well below fold |
| Featured Guides | Low | **High** | Medium | Medium | Below fold |
| CtaCard | Low | Low | Medium | Low | Footer |

---

## Recommended Homepage Order

```
1. [Compressed] Hero            → identity, 1-line subhead, single CTA or no CTA
2. QuickDecisionCards           → primary action layer, all cards live destinations
3. RouteSnapshotBand            → discovery layer for deeper users
4. Featured Guides (3 cards)    → read-more layer
5. HowItWorks                   → trust layer (moved here from position 4)
6. CtaCard                      → footer-level conversion
```

**Key change from current order:** HowItWorks moves from position 4 to position 5, below Featured Guides.

Rationale: HowItWorks answers "why trust this site?" — a question that arises after a user has seen what the guides contain, not before. Showing trust signals before showing the product ("Real process, real costs" before showing any guide content) is the wrong sequence for ad traffic. Users from search know what they want; they need to see the guide list before they need reassurance about the site's credibility.

---

## Above-the-Fold Target State

At 375×667 (iPhone SE), with compressed Hero:

```
[56px]  Header: Dubai Guide | Visas | Guides
[212px] Hero: h1 + 1-line subhead (+ optional single CTA)
[20px]  Section heading "What do you need?"
[180px] QuickDecisionCards row 1 + row 2 (4 cards, 2×2)
------- fold at 611px -------
[60px]  QuickDecisionCards row 3 (2 cards, partially visible → scroll invitation)
```

Result: User sees identity (h1), then immediately sees 4 tappable route cards. Two more cards tease below the fold, inviting scroll. No wasted space. No decorative pills. No duplicate CTAs.

---

## What to Demote or Remove

| Element | Action |
|---|---|
| Hero eyebrow label "Dubai Guide" | **Remove** |
| Hero topic pills (5 pills, all → /guides) | **Remove** |
| Hero secondary CTA "Find My Route →" | **Remove** |
| Hero padding | Reduce: `pt-12 pb-10` → `pt-8 pb-5` |
| Hero subheadline | Shorten to 1 line |
| Hero primary CTA | Optional — consider removing entirely if QuickDecisionCards carry the action |
| HowItWorks position | Move from position 4 to position 5 (after Featured Guides) |
| "Newborn visa" card | Replace when newborn guide ships; hold or remove until then |
| "Find my route" card | Replace when calculator ships; hold or remove until then |

---

## Next Implementation Step

**Implement the Hero compression.** This is the single highest-ROI change available: it pushes QuickDecisionCards from "partially visible" to "fully visible" on an iPhone SE without changing any content, URLs, or guide data.

Exact changes:
1. Remove the "Dubai Guide" eyebrow `<p>` element
2. Remove the topic pills `<div>` (the `flex flex-wrap gap-2 mb-8` block)
3. Remove the "Find My Route →" secondary `<Link>`
4. Reduce h1 font from `text-[28px]` to `text-[24px]`
5. Shorten subheadline to one line: `"Official government fees and process — in plain English."`
6. Change padding from `pt-12 pb-10` to `pt-8 pb-5`
7. Change subheadline margin from `mb-7` to `mb-5`

After that: decide whether the primary CTA "Browse All Guides" also gets removed (since QuickDecisionCards are the action layer).
