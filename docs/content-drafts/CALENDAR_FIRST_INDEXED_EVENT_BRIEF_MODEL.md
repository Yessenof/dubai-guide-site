# Guidex Calendar-First Indexed Event Brief Model

**Version:** 1.0
**Created:** 2026-05-25 (Phase 6C-64)
**Status:** Internal model — approved for planning and future implementation
**Scope:** Permanent architectural decision — governs all future calendar content decisions

---

## Strategic Intent

Guidex is a calendar intelligence platform, not a blog. The default should NOT be "create a full article for every event." The default should be "is this event important enough to leave the calendar, or can it live inside the monthly page as a well-written indexed brief?"

This model ensures:
- Calendar pages rank as primary content destinations, not index pages
- Google and AI crawlers find structured, source-backed content directly in monthly pages
- Service CTAs live near the date, not buried inside thin articles
- Users get their answer inside the calendar without unnecessary navigation
- Major topics still get full pages when they genuinely deserve them

---

## The Three Content Levels

### Level 1 — Calendar Cell

**What it is:** The visible item inside a calendar grid or agenda list. Labels only. No body copy.

**Fields:**
- Short label EN (≤ 40 characters)
- Short label RU (≤ 45 characters)
- Date or date range
- Type/category (drives color and icon)
- Confidence indicator (confirmed / expected / monitoring)

**Behaviour:**
- On desktop: clicking opens the Level 2 brief inline or expands below the row
- On mobile: tapping opens the brief as a bottom sheet or inline accordion
- If a Level 3 detail page exists: brief contains a link to it
- If no detail page: brief is the entire content destination

**Examples:**
- "E-invoicing ASP deadline (large biz)" on 2026-10-30
- "UAE National Day" on 2026-12-02
- "GITEX Global opens" on 2026-10-13

---

### Level 2 — Indexed Expandable Event Brief

**What it is:** An 80–180 word structured brief rendered inside the monthly calendar page. It is the content destination for lower-priority events that do not warrant a separate article.

**Key rule:** Brief content MUST be server-rendered in the initial HTML response. It must not require a client-side fetch or JavaScript to appear in the DOM. Accordion/expand state is a UI behaviour, not a data-loading pattern.

**Fields:**

| Field | Requirement |
|---|---|
| `title_en` / `title_ru` | Short descriptive title — semantic H3 or H4 |
| `date_start` / `date_end` | ISO date |
| `location_en` / `location_ru` | UAE-wide, Dubai, Abu Dhabi, etc. |
| `summary_en` / `summary_ru` | 80–180 words. What it is, why it matters, any key fact. No invented claims. |
| `who_it_matters_for_en` / `ru` | 1 sentence. E.g. "Business owners with annual revenue above AED 50 million." |
| `what_to_do_en` / `ru` | 1–2 action sentences. E.g. "Confirm your revenue category. Select an ASP before 30 October." |
| `source_status` | confirmed / official_baseline / expected / media_signal |
| `source_label_en` / `ru` | Short plain-text citation. E.g. "UAE Ministry of Finance, 10 May 2026." |
| `source_url` | Official URL for the claim |
| `cta_type` | One of: view_details / read_guide / open_event / open_source / add_calendar / ask_guidex |
| `cta_url` | URL for the CTA. Internal `/news/slug` or `/guides/slug` or external |
| `cta_label_en` / `ru` | Button label |
| `related_detail_url` | Internal URL if a full page exists — optional |
| `lifecycle` | compliance_deadline / major_event / public_holiday / etc. |
| `noindex_after` | ISO date or `never` |
| `archive_action` | keep_public / noindex_keep / archive |

**Word count target:** 80–180 words per language. Enough to be useful as a standalone answer in Google snippets and AI responses. Not so long it replaces a full guide.

**What brief copy must NOT do:**
- Invent facts not backed by the source
- State penalty amounts without citing the official resolution
- Claim universal applicability when scope is limited
- Give legal or tax advice
- Use legal/tax advice tone
- Duplicate text that appears elsewhere on the same page
- Hide the actual answer behind "click to read more on our guide page" if no guide exists

**HTML implementation requirements (for future code phase):**
- Brief must be in initial HTML (SSR — not fetched after hydration)
- Expand/collapse uses CSS or progressive-enhancement JS, not data fetch
- `<details><summary>` as accessible fallback when JS is disabled
- Title rendered as H3 or H4 (semantic heading, crawlable)
- Source label and URL visible in rendered HTML (not tooltip-only)
- CTA uses `<a href>` not `<button onclick>`

---

### Level 3 — Full Detail Page

**What it is:** A standalone page at its own URL (`/news/slug`, `/events/slug`, `/guides/slug`, `/calendar/slug`) with full article treatment.

**When Level 3 is required — all of the following must apply:**

| Criterion | Explanation |
|---|---|
| High organic search demand | Confirmed by keyword context or content type (major holidays, major events, major compliance topics have clear search volume) |
| Evergreen or long-read value | Content that stays useful weeks or months after the date, not just a date reminder |
| Source-backed complexity | The topic has enough official-source complexity that 80–180 words is genuinely insufficient |
| Monetization or service path | A WhatsApp CTA, advisory referral, or commercial service path exists |
| Authority or viral potential | High social share potential, or builds domain authority |
| OR: Major annual event needing dedicated indexable presence | GITEX, F1, Eid, Ramadan, Expo — these are destination searches |

**If only 1–2 of the above apply:** use a brief (Level 2), not a full page.

---

## Decision Matrix: Brief vs Full Page

### Create ONLY a calendar brief (Level 2) — do not create a full page

| Situation | Reason |
|---|---|
| Simple date reminder — no action required | VAT quarterly filing date for registered filers; no explanation needed |
| Low search demand event | Niche trade shows, small community events, local seminars |
| Date confirmed but source-backed complexity is low | E.g. New Year's Day — one confirmed date, no guide needed |
| Event already covered in an existing guide or news post | Commemoration Day (already inside Long Weekends page), holiday already in Eid guide |
| Media-signal-only date | Dates not confirmed from official sources — brief says "expected" |
| Unverified or estimated date | Brief clearly labels it as monitoring / expected |
| Short one-off deadline with self-contained answer | "Voluntary pilot phase for e-invoicing opens July 1" — 2 sentences is enough |
| Follow-up to an already-live article | Dec 31 Emiratisation deadline → update existing news post, not a new page |
| Government holiday with only a date, no planning value | Islamic New Year — 1 day off, limited guide value vs Eid |
| Duplicate of existing detail page content | If news/event page covers it, brief links there; no separate brief needed |

### Create a full detail page (Level 3) — do NOT keep as brief only

| Situation | Example |
|---|---|
| Major Islamic holiday with long-weekend planning angle | Eid Al Adha, Eid Al Fitr, Ramadan — high search, evergreen |
| Confirmed major international event | GITEX Global, F1 Abu Dhabi Grand Prix — destination searches |
| Complex compliance deadline with explanation and service path | E-invoicing ASP deadline, Corporate Tax filing, Emiratisation quota |
| High-authority government policy update | UAE Emiratisation news, FTA Corporate Tax changes |
| Monetizable life setup topic | Company setup steps, visa applications, Ejari renewal |
| Viral/high-social-reach event | UAE National Day if scope is confirmed and content is rich |
| Evergreen relocation and life guide topics | Dubai life setup cluster, employment visa, trade license |
| Topic with strong internal-linking demand | Any topic cross-linked from multiple other pages |

---

## Calendar Brief Content Rules

### Factual safety

Every brief follows the same source hierarchy as full articles:
- Claims must be backed by FAHR, MoF, FTA, u.ae, WAM, or equivalent official authority
- Source label must be visible in the brief
- Confidence: `confirmed` = official source captured; `expected` = official date known but scope pending; `monitoring` = estimated from prior-year pattern
- No fake `confirmed` status for expected or monitoring items

### Copy discipline

- No em dashes in EN or RU body (same rule as full articles)
- No theatrical framing ("This is the most important deadline of the year")
- No filler transitions
- Specific numbers when available (AED amounts, day counts)
- Official body names used correctly (FAHR, MoF, FTA, MOHRE, MoHRE, ICA, GDRFA)
- Adviser note when appropriate for compliance items: "Confirm your revenue category with a qualified adviser"
- No penalty amounts without Cabinet Resolution / FTA decision citation

### EN/RU parity

Both `summary_en` and `summary_ru` must be present before any import. RU is not optional for Level 2 briefs. RU brief follows the same factual safety rules.

---

## CTA Rules

### When a full detail page exists

| Situation | CTA label EN | CTA label RU | URL |
|---|---|---|---|
| Detail page is a news post | View details | Читать подробнее | `/news/slug` |
| Detail page is a guide | Read guide | Читать гайд | `/guides/slug` |
| Detail page is an event page | Open event page | Открыть событие | `/events/slug` |
| Detail page is another calendar page | View calendar | Открыть календарь | `/calendar/slug` |

### When no full detail page exists

| Situation | CTA label EN | CTA label RU | URL |
|---|---|---|---|
| Official source URL captured | Open official source | Открыть источник | External URL (new tab) |
| Guidex service path relevant | Ask Guidex | Написать в Guidex | WhatsApp link |
| Date is exportable | Add to calendar | Добавить в календарь | .ics / Google Calendar link |
| Brief is the destination | (no button — brief is self-contained) | — | — |

### Forbidden CTA patterns

| Forbidden | Reason |
|---|---|
| "Read full article" when no article exists | Creates dead expectation; damages trust |
| "Learn more" with no URL | Meaningless |
| "Click here" | Non-descriptive; bad for accessibility and SEO |
| Button-only navigation (no `<a href>`) | Not crawlable; breaks without JS |
| "Subscribe to find out" | Not appropriate for a calendar platform |

---

## Monthly Calendar Page SEO/RAG Structure

Each monthly calendar page (`/calendar/october-2026-uae-calendar`) should follow this structure:

```
H1: Dubai Calendar — October 2026
[1-2 sentence month summary with key events named]

## Key dates in October 2026
[Scannable bulleted or tabular key dates list — good for featured snippets]

## Calendar
[Visual calendar grid — Level 1 cells]

## Event briefs
[Server-rendered Level 2 briefs, one per significant date]
  H3: [Event title]
    [Summary: 80-180 words]
    [Who it matters for]
    [What to do]
    [Source: official label]
    [CTA button]

## Related guides and news
[Cross-links to relevant Level 3 pages]

## About these dates
[Source note and confidence explanation]

## FAQ (optional — when useful)
[2-4 Q&A pairs for quick-answer SEO]
```

**Page-level metadata:**
- `<title>`: Dubai Calendar — October 2026 | Key Dates and Events | Guidex
- `<meta description>`: [Unique, includes top 1-2 events by name and date, ≤ 160 chars]
- `<h1>`: Dubai Calendar — October 2026
- `<main>` wraps all content
- Calendar grid inside `<section aria-label="Calendar">`
- Each brief inside `<article>` or `<section>` with its own heading

**Robots:**
- Monthly calendar pages: `index, follow`
- The `/calendar` index listing page: `noindex, follow` (product decision — already live)

---

## Brief Content Schema (Data Model)

Each item in `dates_json` that has a Level 2 brief extends the existing schema with brief fields. Existing items that do not have a brief omit these fields.

### Current dates_json item structure (existing)

```json
{
  "date": "2026-10-30",
  "label_en": "E-invoicing: large business ASP deadline",
  "label_ru": "Е-инвойсы: срок выбора ASP (крупный бизнес)",
  "short_label_en": "E-invoicing ASP deadline (large)",
  "short_label_ru": "Срок ASP: крупный бизнес",
  "type": "tax_deadline",
  "confidence": "expected",
  "priority": 1,
  "detail_url": "/news/uae-e-invoicing-2026-asp-deadline-update"
}
```

### Extended dates_json item structure (with Level 2 brief)

```json
{
  "date": "2026-10-30",
  "label_en": "E-invoicing: large business ASP deadline",
  "label_ru": "Е-инвойсы: срок выбора ASP (крупный бизнес)",
  "short_label_en": "E-invoicing ASP deadline (large)",
  "short_label_ru": "Срок ASP: крупный бизнес",
  "type": "tax_deadline",
  "confidence": "expected",
  "priority": 1,
  "detail_url": "/news/uae-e-invoicing-2026-asp-deadline-update",

  "brief_en": "The UAE Ministry of Finance has set 30 October 2026 as the deadline for large businesses to appoint an Accredited Service Provider (ASP) under the UAE e-invoicing programme. This follows an amendment announced on 10 May 2026, which extended the original 31 July 2026 deadline. Mandatory electronic invoicing for large businesses begins 1 January 2027. The pilot programme and voluntary adoption are open from 1 July 2026. Voluntary participants during the pilot phase are exempt from fines.",
  "brief_ru": "Министерство финансов ОАЭ установило 30 октября 2026 года как крайний срок для крупного бизнеса по выбору аккредитованного поставщика услуг (ASP) в рамках программы электронных инвойсов. Срок был продлён с 31 июля 2026 года по итогам поправки, объявленной 10 мая 2026 года. Обязательный переход на электронные инвойсы для крупного бизнеса начинается 1 января 2027 года.",

  "who_for_en": "Businesses with annual revenue of AED 50 million or above.",
  "who_for_ru": "Компании с годовой выручкой от AED 50 млн.",

  "what_to_do_en": "Confirm your revenue category. Select an ASP from the official MoF list before 30 October 2026. Consult a qualified adviser to confirm which deadline applies to your business.",
  "what_to_do_ru": "Подтвердите категорию по выручке. Выберите ASP из официального списка МФ до 30 октября 2026 года. Проконсультируйтесь с квалифицированным советником для подтверждения применимых сроков.",

  "source_label_en": "UAE Ministry of Finance, 10 May 2026",
  "source_label_ru": "Министерство финансов ОАЭ, 10 мая 2026",
  "source_url": "https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/",
  "source_status": "official_permalink_confirmed",

  "cta_type": "view_details",
  "cta_url": "/news/uae-e-invoicing-2026-asp-deadline-update",
  "cta_label_en": "View details",
  "cta_label_ru": "Читать подробнее",

  "location_en": "UAE-wide",
  "location_ru": "ОАЭ",
  "emirate": null,
  "risk_level": "high",
  "lifecycle": "compliance_deadline",
  "noindex_after": "never",
  "archive_action": "keep_public"
}
```

### Schema extension rules

- Items WITHOUT a brief: continue using existing structure (no brief fields)
- Items WITH a brief: add all `brief_en`, `brief_ru`, `who_for_en/ru`, `what_to_do_en/ru`, `source_label_en/ru`, `source_url`, `source_status`, `cta_type`, `cta_url`, `cta_label_en/ru`, `location_en/ru`, `emirate`, `risk_level`, `lifecycle`, `noindex_after`, `archive_action`
- `detail_url` remains: if a Level 3 page exists, `detail_url` is the canonical link
- `cta_url` may differ from `detail_url` — CTA can point to external source if no internal page exists
- Both `brief_en` and `brief_ru` must be present together. No partial-language briefs.
- `risk_level` drives admin display: `high` shows a warning indicator in admin view

---

## 2026 Candidate Classification

Applying the Level 1 / Level 2 / Level 3 / Hold framework to the Phase 6C-62 calendar seed matrix.

| ID | Item | Classification | Rationale |
|---|---|---|---|
| HOL-01 | Eid Al Adha 2026 | **Level 3 — ALREADY LIVE** | High search, evergreen, monetizable, confirmed official source |
| HOL-02 | Islamic New Year 1448H | **Level 2 — brief only** | Hold until FAHR confirms date; once confirmed: 1-day holiday, brief is sufficient |
| HOL-03 | Mawlid An-Nabi 1448H | **Level 2 — brief only** | Same as HOL-02; hold until confirmed |
| HOL-04 | Commemoration Day 2026 | **Level 2 — brief (inside December monthly page or Long Weekends)** | Date is Dec 1 (expected); no standalone page needed; brief covers who it affects, that scope is pending FAHR |
| HOL-05 | National Day 2026 | **Level 2 → Level 3 if FAHR confirms scope** | After FAHR Nov 2026 announcement: high social, could get full page. Until then: brief inside December monthly page |
| HOL-06 | New Year 2027 | **Level 1 — cell only** | Fixed date, no explanation needed; 1 line |
| DXB-01 | Cityscape Dubai | **Level 2 — brief** (after dates confirmed) | B2B niche; good brief value; not enough demand for standalone article |
| DXB-02 | GITEX Global 2026 | **Level 3 — FULL PAGE** | Already drafted; major annual event; high search; monetizable |
| DXB-03 | Dubai Fitness Challenge | **Level 2 — brief** | Community event; good brief value; not evergreen |
| DXB-04 | Big 5 Dubai | **Level 2 — brief** (niche) | Trade show; brief for B2B readers; not high general search |
| DXB-05 | Dubai Run | **Level 2 — brief** | Annual community event; brief sufficient |
| DXB-06 | Dubai Shopping Festival | **Level 3 — FULL PAGE** | Very high consumer demand; evergreen; monetizable (retail + hotel) |
| AUH-01 | F1 Abu Dhabi 2026 | **Level 3 — FULL PAGE** | Already drafted; major event; high search; monetizable |
| TAX-01A | Emiratisation June 30 (50+) | **Level 3 — ALREADY LIVE** | Live news + calendar item; high compliance demand |
| TAX-01B | Emiratisation June 30 (20–49) | **Level 2 — brief** (once confirmed) | HOLD until source captured; brief when ready |
| TAX-02 | Corporate Tax Sept 30 | **Level 3 — FULL PAGE** | Complex 9-month rule; needs explanation; monetizable (tax advisory) |
| TAX-03 | VAT quarterly returns | **Level 2 — brief** (internal planning only now) | Not for general public calendar; brief when Business Compliance Calendar is built |
| TAX-04 | Emiratisation Dec 31 | **Level 2 — brief** | Follow-up to TAX-01A; update existing article; not a standalone page |
| TAX-05A | E-invoicing pilot Jul 1 | **Level 2 — brief** | Supporting item to TAX-05C; brief inside October or July monthly page |
| TAX-05C | E-invoicing ASP deadline Oct 30 | **Level 3 — FULL PAGE** | Already drafted (news + guide); complex compliance; monetizable (ASP advisory) |
| TAX-05D | E-invoicing mandatory Jan 1, 2027 | **Level 2 — brief** | Supporting item to TAX-05C; brief inside e-invoicing calendar page or Jan 2027 monthly |
| TAX-06 | ESR Annual Filing | **Level 2 — brief** (internal only) | Internal planning only; brief in Business Compliance Calendar when built |
| TAX-07 | UBO Annual Update | **Level 2 — brief** (internal only) | Same as TAX-06 |
| VIRAL-01 | UAE Long Weekends 2026-27 | **Level 3 — ALREADY LIVE** | Evergreen yearly reference; high viral potential; live |

**Classification summary:**
- Level 3 (full page): HOL-01, DXB-02, DXB-06, AUH-01, TAX-01A, TAX-02, TAX-05C, VIRAL-01 — 8 items (4 already live)
- Level 2 (brief): HOL-02, HOL-03, HOL-04, HOL-05 (until confirmed), DXB-01, DXB-03, DXB-04, DXB-05, TAX-01B, TAX-03, TAX-04, TAX-05A, TAX-05D, TAX-06, TAX-07 — 15 items
- Level 1 (cell only): HOL-06 — 1 item
- Hold: HOL-05 (until FAHR Nov 2026), TAX-01B (until source captured), HOL-02/03 (until FAHR confirms)

---

## How Accordion/Brief Content Stays Indexable

The question Googlebot and AI crawlers ask is: **Is the text in the initial HTML response?**

### Correct implementation (SSR-safe)

```html
<!-- Brief is fully rendered in server HTML -->
<article class="calendar-brief" id="brief-2026-10-30-e-invoicing">
  <details>
    <summary>
      <h3>E-invoicing: Large Business ASP Deadline — 30 October 2026</h3>
    </summary>
    <div class="brief-body">
      <p>The UAE Ministry of Finance has set 30 October 2026 as the deadline...</p>
      <p><strong>Who this affects:</strong> Businesses with annual revenue of AED 50 million or above.</p>
      <p><strong>What to do:</strong> Confirm your revenue category. Select an ASP from the official MoF list before 30 October 2026.</p>
      <p class="source-note">Source: UAE Ministry of Finance, 10 May 2026.</p>
      <a href="/news/uae-e-invoicing-2026-asp-deadline-update" class="cta-link">View details</a>
    </div>
  </details>
</article>
```

**Why this works:**
- `<details>/<summary>` is a safe accessible baseline when the full brief content is already present in the server-rendered HTML. The key SEO rule is that the brief text, source label and CTA links exist in the initial HTML response, not that they are loaded after user interaction.
- All text is in the initial HTML response — no JS required to render it
- H3 heading inside `<summary>` is indexed normally
- `<a href>` link is crawlable
- Source note is plain text in the DOM

### What NOT to do

```jsx
// BAD — content not in initial HTML
const [expanded, setExpanded] = useState(false)
const [brief, setBrief] = useState(null)

useEffect(() => {
  if (expanded) {
    fetch('/api/brief/2026-10-30-e-invoicing')
      .then(r => r.json())
      .then(d => setBrief(d))
  }
}, [expanded])
```

This pattern loads content after hydration. Googlebot's initial crawl sees empty content. The brief is invisible to search engines and AI indexers.

### Correct Next.js pattern

Brief content lives in the `dates_json` column. The Next.js server component reads it at build/request time and renders all briefs in the HTML. The calendar page is statically generated (SSG) or server-rendered. The expand/collapse is CSS-driven or uses native `<details>`.

---

## Impact on Next Calendar Import Batch

### Immediate (Phase 6C-65 candidate)

The next import batch should now account for this model:

| Item | Prior plan | Revised plan (with this model) |
|---|---|---|
| TAX-05C + TAX-05A (e-invoicing) | Import as news + calendar page | Import news_post (TAX-05C article) + calendar_pages important_dates page with items A, B, C. Item A (Jul 1) gets a Level 2 brief in the datesJson. Item B (Oct 30) links to the news post. Item C (Jan 1, 2027) gets a Level 2 brief. |
| HOL-04 + HOL-05 (December holidays) | Inside Long Weekends or December monthly page | Build December 2026 monthly page (after FAHR Nov announcement); HOL-04 gets Level 2 brief; HOL-05 gets Level 2 brief → upgrade to Level 3 if FAHR scope is rich enough |
| GITEX 2026 | Level 3 full page when dates confirmed | Still Level 3 — has draft; import after dates confirmed |
| F1 Abu Dhabi 2026 | Level 3 full page | Still Level 3 — has draft |
| Islamic New Year HOL-02 | Hold | Hold; when FAHR confirms → Level 2 brief inside correct monthly page |

### Monthly calendar page strategy

Monthly calendar pages are the primary content surface. Each monthly page should be planned as:
1. **Grid/agenda** — Level 1 cells for all confirmed dates that month
2. **Indexed briefs** — Level 2 for qualifying events
3. **Cross-links** — links to Level 3 pages for major topics

Rather than: article → links back to calendar.
The calendar is the content. Articles are supplementary.

---

## Future Code Phase Recommendation

**Phase tag:** `CALENDAR_BRIEF_UI`
**Prerequisites:** Owner approval of this model; at least one monthly calendar page with planned brief content

### Data changes

| Change | Scope | Risk |
|---|---|---|
| Extend `dates_json` item schema with brief fields | No schema migration — `dates_json` is a JSON text column; new fields are additive | Low |
| Validate existing `dates_json` items still render correctly without brief fields | Read existing items, confirm no breakage | Low |
| No new DB table needed | Brief content lives in `dates_json` | Zero migration risk |

### UI components

| Component | Description | SSR requirement |
|---|---|---|
| `CalendarCell` | Level 1 cell — label, date, type, confidence dot | Must be server-rendered |
| `CalendarBrief` | Level 2 expandable brief — renders all fields from extended schema | Must render full content in initial HTML. Use `<details>/<summary>` or CSS-hidden content, never client-fetch |
| `BriefCTA` | CTA component — renders `<a href>` based on `cta_type` and `cta_url` | Must use `<a>` not `<button>` |
| `SourceLabel` | Source attribution — plain text with optional `<a>` to source_url | Must be visible in initial HTML |
| `ConfidenceBadge` | "Confirmed" / "Expected" / "Monitoring" badge | Can be client-enhanced but label must be in initial HTML |

### QA checklist before production deploy

- [ ] Disable JavaScript in browser — all brief text must still be visible in page source
- [ ] Crawl `/calendar/[month-slug]` with curl — brief content must appear in response body
- [ ] Google Search Console URL Inspection — check "Rendered HTML" matches initial HTML for all brief content
- [ ] Check `<h3>` / `<h4>` headings appear in HTML source (not generated by JS)
- [ ] Check `<a href>` links appear in HTML source (not button-onclick)
- [ ] RU content present in initial HTML (not loaded after language toggle)
- [ ] Mobile: briefs are accessible by touch without horizontal scroll
- [ ] Verify `detail_url` links return HTTP 200 before deploy

### EN/RU handling

- Both `brief_en` and `brief_ru` are stored in `dates_json`
- The calendar page reads the current locale from the URL (`/calendar/slug` = EN, `/ru/calendar/slug` = RU)
- The server component renders only the language-appropriate brief
- No client-side language switching for brief content (SSR only)
- If `brief_ru` is empty string: do not show the brief on the RU page; show cell-only

### No duplicate agenda risk

The Level 2 brief lives inside the `dates_json` of a specific `calendar_pages` row. The Level 3 detail page exists at a separate URL. They are different content surfaces. The agenda view shows the Level 1 cell + opens the Level 2 brief. The Level 3 page is reached via CTA link inside the brief.

There is no duplicate risk as long as the same date does not appear in two separate `calendar_pages` rows. The existing rule against adding a standalone calendar_pages row for dates already in the Long Weekends `dates_json` continues to apply.

---

*Internal model document — Phase 6C-64 — 2026-05-25. Not for publish. No admin action. No DB write. No code.*
