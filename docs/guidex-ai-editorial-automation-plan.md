# Guidex AI Editorial Automation — Strategic Architecture Plan

Status: Planning only — no code, no DB, no routes, no deployment until approved
Last updated: 2026-05-12

---

## 1. Executive Summary

Guidex is growing from a guide library into a full UAE knowledge hub: guides, services, news, events, calendar visual posts, Dubai Life Setup, area pages, tools, checklists, directories, and homepage modules. Managing all of this manually at scale is unsustainable.

The goal is an AI-powered editorial automation system that reduces manual editorial work by 80–90% while keeping quality, accuracy, SEO safety, and human control over every publication decision.

**This is not an auto-blog generator.** It is an editorial command system with eight stages:

```
Monitor → Classify → Draft → Enrich → Check → Preview → Approve → Publish
```

At each stage, AI handles the mechanical work. A human controls the gate. The system starts with AI-assisted drafts and moves gradually toward limited autopublish — only for low-risk content types, only after the system proves its quality, and never for legal, visa, tax, or official rule claims.

The system covers every content type Guidex produces:

| Content type | Guidex route |
|---|---|
| News / Updates | `/news`, `/ru/news` |
| Events | `/events`, `/ru/events` |
| Calendar Visual Posts | `/calendar`, `/ru/calendar` |
| Guides / Articles | `/guides/[slug]`, `/ru/guides/[slug]` |
| Dubai Life Setup | `/life-setup/...` |
| Area / Map Data | `/life-setup/areas/[slug]` |
| Homepage Modules | `/` slot assignments |
| Service Pages | future |

---

## 2. Core Principle

**AI can prepare 80–90% of editorial work. Human approval controls sensitive publishing.**

This principle has two parts:

**What AI owns:** Classification, drafting, enrichment, SEO preparation, translation draft, duplicate checking, source attribution, related link suggestions, warnings, and preview generation.

**What humans own:** Every publish decision, every RU publish decision, every homepage slot assignment, every source reliability judgment, and all content touching legal, visa, tax, official rule, or pricing claims.

The system must not start with full autopublish. It starts with AI-assisted drafts where a human approves everything. Over time, as the system proves consistent quality on specific low-risk content types, limited autopublish is added cautiously. The default posture is: **AI proposes, human publishes.**

---

## 3. Automation Levels

Five levels from fully manual to limited autopublish. The system grows through these levels deliberately, not all at once.

### Level 1 — Manual Input (target: MVP)

Manager pastes text, a link, a screenshot, an image, or a raw prompt into the AI Inbox. AI prepares a structured draft. Human reviews the draft, edits freely, and publishes manually.

No monitoring. No automatic source checking. Pure input-to-draft assistance.

### Level 2 — Assisted Monitoring (Phase 8)

AI checks a defined set of registered sources on a schedule and surfaces potential updates in a "Suggestions" queue. A human reviews the suggestions and chooses which ones to turn into drafts. Nothing becomes a draft automatically.

Reduces discovery work. Human still controls what enters the drafting pipeline.

### Level 3 — Auto-Draft (Phase 9)

AI checks sources and creates draft entries automatically. Drafts land in a "Pending Review" queue with `status = draft`. Nothing is published without human review and approval.

Reduces drafting work. Human still controls every publish decision.

### Level 4 — Controlled Publish Queue (future)

AI prepares complete content — all fields, EN + RU drafts, SEO, source, warnings — and places it in a publish queue with a confidence score and a list of warnings. A manager can approve quickly ("one-tap approve") for content that passes all automated quality gates.

Human approval is still required. The approval friction is lower because the pre-checks are done.

### Level 5 — Limited Autopublish (future, restricted)

Only for specific low-risk content types after the system demonstrates consistent quality across hundreds of approved items. Explicit owner decision required before any content type enters autopublish.

**Never for:** visa rule changes, tax/legal/compliance claims, public holiday confirmations, Islamic holiday date announcements, government process changes, pricing claims, property prices, medical/legal/financial-sensitive content, or RU pages unless strict automated RU quality checks pass and are owner-approved.

---

## 4. What Can Be Automated

The following tasks are safe for AI handling, with human review of the output:

**Discovery and monitoring:**
- News discovery from registered sources
- Official source monitoring (government portals, agency announcements)
- Media source monitoring (trusted UAE/Dubai media)
- Source summarization and key-fact extraction
- Duplicate detection against existing content

**Classification and organisation:**
- Content type classification (news vs event vs calendar post vs guide update vs area data)
- Topic clustering (visa, property, tax, tourism, school, government)
- Urgency scoring (breaking vs scheduled vs evergreen)
- Homepage slot suggestion ("this belongs in the news feed" / "this warrants a featured card")
- WhatsApp CTA suggestion (which CTA template fits this content)

**Draft preparation:**
- EN draft (structured fields: title, summary, body, SEO title, meta description)
- RU draft (translated from EN, marked as draft, ru_published = 0 until human approves)
- Slug suggestions (clean, SEO-appropriate, no duplicates)
- Tags and category suggestions
- Related guides identification (by topic matching against existing guide slugs)
- Related services identification
- Related tool/checklist identification
- Source URL and source label population
- Date extraction from source (for events: start date, end date, confidence level)
- Calendar visual post planning (identify which months/year a set of dates belongs to)
- Event extraction from government announcements or media
- Image alt text in EN and RU
- Image prompt suggestion (for human to approve before generation)

**SEO preparation:**
- SEO title (distinct from display title, within character limit)
- Meta description (under 160 characters, factual, no keyword stuffing)
- Canonical path recommendation
- Sitemap eligibility recommendation
- noindex recommendation if draft, thin, or incomplete
- FAQ suggestion (only where genuinely useful)
- Internal link suggestions (to existing guides, events, news, area pages)

**Maintenance:**
- Last reviewed date update suggestions
- Existing content staleness detection (price ranges, dates, process steps that may have changed)
- Area/map data update suggestions (new schools, roads, community changes)

---

## 5. What Must Not Be Fully Automated at First

The following require explicit human review and approval before publishing, regardless of automation level:

**Official and legal content:**
- Confirmed public holiday announcements (must cite official UAE government source)
- Visa rule changes (ICP, GDRFA, MOHRE — any process or fee change)
- Tax and compliance changes (FTA, EmaraTax, VAT, corporate tax)
- DLD, RTA, Dubai Economy rule changes
- KHDA or school-related official policy changes
- Medical, legal, or financial-sensitive content of any kind

**Pricing and property:**
- Pricing claims (government fees, service fees, visa fees)
- Property price ranges (DLD, RERA data — must be sourced and reviewed)
- Rent ranges (must be RERA-sourced with review date)

**Publishing and deployment:**
- RU page publishing (`ru_published = 1`) — always requires human approval
- Sitemap and indexing changes — always requires human decision
- Homepage priority slot assignments
- Production deployments — never automated
- DB schema migrations — never automated
- Deletion of any content
- Archiving of any content

**Calendar-specific:**
- Islamic holiday date confirmation (must be officially announced by UAE authorities)
- Public holiday day-off announcements
- Any calendar entry marked `date_confidence = confirmed` — must have source

---

## 6. Source Monitoring System

### Source Registry (future — architecture only, not implemented in this task)

A Source Registry is a managed list of monitored sources, each with defined reliability, check frequency, and allowed content types. Monitoring runs against this registry, not against arbitrary URLs.

**Source types:**

| Type | Description |
|---|---|
| `official_government` | UAE federal or emirate government portal — highest reliability |
| `semi_official` | Official agency social media, press release — high reliability, confirm via portal |
| `official_portal` | Service portal (ICA, MOHRE, DLD online) — high reliability for process info |
| `trusted_media` | Gulf News, Khaleej Times, Arabian Business, The National — medium reliability |
| `internal_manual` | Manager-submitted input — reliability determined by manager |
| `social_news_signal` | Twitter/X, LinkedIn, Reddit — low reliability, requires verification |
| `user_submitted` | Future — very low reliability, always requires verification |

**Source categories:**

| Category | Monitored entities |
|---|---|
| ICP / Visa | ICP portal, GDRFA, MOI visa services |
| MOHRE | Ministry of Human Resources — employment, labour |
| DLD / Property | Dubai Land Department, RERA, Dubai REST, DLD Cube |
| FTA / Tax | Federal Tax Authority, EmaraTax portal |
| RTA | Roads and Transport Authority |
| Dubai Economy | DED, Dubai Economy and Tourism |
| DET / Holiday Homes | Department of Economy and Tourism — holiday home permits |
| KHDA / Schools | Knowledge and Human Development Authority |
| UAE Public Holidays | UAE Government official holiday announcements |
| Banking / Compliance | CBUAE, local bank announcements |
| Real Estate / Property | RERA quarterly rent index, DLD transaction data |
| Tourism / Events | Dubai Calendar, Dubai Tourism, Expo City |
| Dubai Life Setup | Community announcements, area news, infrastructure |

**Source record fields:**

```
source_name               Human-readable name
source_url                Primary URL to check
source_type               official_government | semi_official | official_portal | trusted_media | internal_manual | social_news_signal | user_submitted
category                  From category list above
language                  en | ar | both
check_frequency           daily | weekly | monthly | manual_only
reliability_level         high | medium | low
last_checked_at           ISO timestamp
last_change_detected_at   ISO timestamp
notes                     Free text — caveats, quirks, history
allowed_content_types     news | event | calendar_post | guide_update | area_update | homepage_module
requires_human_review     always | when_flagged | never (never = only for lowest-risk update types)
```

---

## 7. AI Inbox

The AI Inbox is the central intake point for all new content. A manager can submit any of the following:

**Input types:**
- Pasted source URL (article, government announcement, portal page)
- Copied text (news article, official statement, press release)
- Uploaded screenshot (government website, social media post, calendar image)
- Uploaded image (calendar poster, event flyer)
- Calendar image (JPEG/PNG of a UAE holiday calendar)
- Government update (pasted announcement text)
- Media article (pasted or linked news item)
- Manager note or prompt ("Dubai added a new visa type — draft a news update")
- Raw idea ("Create a calendar post for Eid Al Adha 2026")
- Area update ("JVC got a new Carrefour in Q1 2026 — update the JVC area page")
- Existing page update request ("The employment visa fee changed — update step 3")
- Social trend signal (topic to investigate, not a source)

**AI Inbox output — for each submission, AI returns:**

| Field | Description |
|---|---|
| `suggested_content_type` | news / event / calendar_post / guide_update / area_update / homepage_module / multiple |
| `confidence_score` | 0–100 — how confident AI is in the classification |
| `source_classification` | official_government / semi_official / trusted_media / unverified |
| `urgency` | breaking / scheduled / evergreen / low |
| `seo_opportunity` | high / medium / low / none |
| `recommended_action` | create_new / update_existing / split_multiple / discard |
| `draft_content` | Structured fields for the recommended content type |
| `related_content` | Existing Guidex pages this connects to |
| `warnings` | List of flags (unconfirmed date, pricing claim, legal claim, thin content, etc.) |
| `approval_required` | always / standard / expedited |

If the input generates `multiple` content types (e.g. a holiday announcement that creates a news post + an event entry + a calendar post), the Inbox proposes each as a linked draft set and the manager selects which to proceed with.

---

## 8. Content Classification Logic

### Decision table

| Input signal | Recommended content type |
|---|---|
| Agency/government rule change, fee change, process update | News (+ possible Guide Update) |
| Date-specific holiday, deadline, school term, government event | Event |
| Collection of dates for a month or year, with visual image | Calendar Visual Post |
| Evergreen how-to process, step-by-step procedure | Guide / Article |
| Paid execution offer, concierge service | Service Page |
| Dubai area or community information, lifestyle, housing | Area / Map Data Update |
| Setup checklist, decision tool, calculator logic | Tool / Checklist |
| Short high-priority item for home page | Homepage Module Suggestion |
| Change to an existing Guidex page (outdated fact, new fee, new step) | Existing Content Update |
| General trend or topic idea without a source | Draft Investigation Note |

### Conflict handling

If one source contains multiple content opportunities, AI proposes multiple linked drafts and the manager selects which to create. AI must avoid creating thin duplicates — each proposed content item must have unique purpose and sufficient standalone value.

**Example — UAE public holiday announcement:**

A GDRFA announcement for Eid Al Adha 2026 dates can generate:
- One **News** post: "Eid Al Adha 2026 — Official Dates Announced"
- One **Event** entry: "Eid Al Adha 2026" with `date_confidence = confirmed` (only after official announcement)
- One **Calendar Visual Post**: "UAE Public Holidays Q3 2026" update

Each is created only if it has unique value. A thin news post that only repeats the event entry with no additional context should not be created.

---

## 9. Editorial Transformation Rules

AI must not simply rewrite news articles. It must convert raw information into a **Guidex action brief** — content that is useful for a person living in, moving to, or doing business in Dubai.

For every piece of source content, AI must identify and structure:

| Output field | Description |
|---|---|
| What changed | Factual statement of the change or announcement |
| Who is affected | Specific audience: employed residents, business owners, property buyers, etc. |
| What to do next | Actionable step (apply, renew, check, wait for official confirmation, etc.) |
| Documents or steps involved | Named documents, portals, service centers |
| Risk / warning | What happens if ignored or missed |
| Official/source status | Confirmed / expected / unconfirmed |
| Related Guidex guides | Existing guide slugs |
| Whether a service CTA is relevant | Yes / No — and which CTA |
| Whether this belongs in calendar or events | Yes / No — and which type |
| Whether existing content needs updating | Specific page(s) and field(s) |

See §9A for full copyright, originality, and source compliance rules.

---

## 9A. Source, Copyright and Originality Rules

These rules apply to every AI-assisted content action: drafting, updating, translating, summarising, and classifying. They are non-negotiable and must be enforced at the system level before any draft reaches the approval queue.

### 1. No copying or close paraphrasing of media articles

AI must not reproduce article text, copy headlines verbatim (unless the headline is an official/public statement from a government body), or closely paraphrase source article structure. The Guidex output must be an original document serving a distinct purpose — not a reworded version of the source.

If a media source article has no actionable information for a Dubai resident beyond what already exists on Guidex, AI must recommend `discard` and explain why.

### 2. Transform — do not rewrite

AI must convert raw source information into a **Guidex action brief**. The transformation requires extracting and structuring:

| What to produce | Description |
|---|---|
| What changed | Factual statement of the change or announcement |
| Who is affected | Specific audience: employed residents, business owners, property buyers, etc. |
| What to do next | Actionable step: apply, renew, wait for confirmation, check document, etc. |
| Risks and warnings | Consequences of missing or ignoring the update |
| Documents and steps | Named documents, portals, service centres involved |
| Related Guidex guides | Existing guide slugs — link, do not reproduce |
| Calendar or event impact | Does this create or update an event or calendar post? |
| Service relevance | Is a Guidex WhatsApp CTA or service page relevant? |

The Guidex output is a different document with a different structure and a different purpose than the source. It is not a news summary — it is an action brief for a Dubai resident or business owner.

### 3. Rules for media sources

- Use only short factual references (a specific fact, a figure, a date) — not article passages
- Do not reproduce the article's structure or sectioning
- Do not copy headlines exactly unless the headline is an official government or agency statement
- Always attach `source_url` and `source_label` to every piece of media-derived content
- `source_label = media` — distinguishes from official government sources

### 4. Rules for official government sources

- Cite the official URL — `source_url` is required; no sourceless official claims
- Do not claim more than the source states — if the announcement is preliminary or subject to confirmation, mark accordingly
- If the source is ambiguous or contradictory, mark the draft as `needs_human_review = true` and flag the ambiguity explicitly
- Do not interpret government announcements beyond what is clearly stated
- Do not combine two partial sources to imply a confirmed fact neither source confirms alone

### 5. Source monitoring compliance

When AI checks external sources (Phase 8+), it must respect:

- **Website terms of service** — do not access sources in ways that violate their terms
- **robots.txt and access limitations** — respect crawl rules where they apply
- **No paywall bypassing** — do not access paywalled content through any workaround
- **No scraping private or restricted data** — monitor only publicly accessible pages
- **No user-generated content without signal** — do not treat forum posts or social comments as primary sources

Sources that require bypassing access controls must be removed from the Source Registry and flagged for manual review.

### 6. Source trace — required for every AI-drafted item

Every draft produced by AI must carry a complete source trace in the audit log:

| Trace field | Description |
|---|---|
| `source_url` | The URL of the primary source |
| `source_type` | official_government / semi_official / trusted_media / internal_manual / etc. |
| `date_checked` | ISO timestamp when the source was accessed |
| `extracted_facts` | The specific facts AI extracted from the source (stored, not inferred) |
| `generated_draft_id` | Link to the draft created from this source trace |
| `editor_approval` | User ID and timestamp of the editor who reviewed and approved |

The source trace is stored permanently — it cannot be deleted when the content is published or archived.

### 7. Duplicate and update-existing-page decision

Before creating any new page, AI must run a duplicate/update check:

1. **Does an existing Guidex page already cover this topic?** If yes: propose an update to the existing page (before/after diff), not a new page.
2. **Is the proposed new page thin** — does it say the same thing as an existing page with minor variation? If yes: recommend `discard` or `merge_with_existing`.
3. **Is this one source generating multiple items that overlap?** If yes: each proposed item must have unique standalone value. Flag items that are thin duplicates of each other.
4. **Would creating this page create a duplicate slug or near-duplicate title?** If yes: flag before draft is shown to manager.

Avoid multiple Guidex pages saying the same thing. Thin duplicate pages harm SEO and editorial quality.

### 8. Autopublish restriction for media-derived content

Autopublish must never be allowed for content derived from media sources (newspapers, news websites, agency feeds) unless all of the following conditions are met:

- The content type has been explicitly approved for autopublish by the owner (in writing)
- The AI output is original, factual, and short — not a news summary or rewrite
- The output is demonstrably low-risk (no legal, visa, tax, pricing, or official process claims)
- The source is classified as `trusted_media` or above in the Source Registry
- The content has passed all automated quality gates including originality and source compliance checks

This condition is not expected to be met in Phase 1–12. Media-derived content requires human review indefinitely until the system proves consistent quality at scale.

### 9. AI-generated image rules

These apply to any image produced by or through an AI generation tool (Midjourney, DALL-E, Stable Diffusion, etc.):

| Forbidden | Reason |
|---|---|
| Fake government logos or seals | Implies official endorsement; misleading |
| Fake official documents or certificates | Could be mistaken for real government documents |
| Misleading residency or visa certificates | Deceptive; potential legal risk |
| Fake legal or cadastral maps | Implies boundary accuracy that does not exist |
| Calendar visuals designed to look like official UAE government publications | Must be clearly Guidex editorial design — not imitations of official calendars |

**Required for any AI-generated image used on site:**
- Clearly identifiable as a Guidex editorial visual in style
- Human approval before use — AI may suggest the prompt, human approves the output
- No use of real government visual identity (colour schemes, fonts, logos) in a way that implies official status
- No real people without rights clearance

---

## 10. News Automation Workflow

```
Source found / submitted
        ↓
AI extracts facts (who, what, when, who is affected, what to do)
        ↓
Duplicate check — does similar content already exist?
        ↓ (if yes)
Update existing article? — propose diff, not new article
        ↓ (if no, or new angle)
Create draft — all required fields
        ↓
EN draft prepared
        ↓
RU draft prepared (ru_published = 0 — never auto-set to 1)
        ↓
Source URL + source label populated
        ↓
Related guides suggested
        ↓
Homepage slot / digest suggestion made
        ↓
Warnings list generated (pricing claims, unconfirmed dates, etc.)
        ↓
Editor previews full draft
        ↓
Manager approves EN
        ↓
Manager separately approves RU (ru_published = 1)
        ↓
Publish
```

**Required fields for every news post:**

```
slug                    Clean, no duplicates, SEO-appropriate
category                visa | company | tax | government | tourism | banking
status                  draft | published | archived
en_title                Specific, searchable, under 70 characters
en_summary              1–2 sentences, meta-description quality
en_body                 Structured: what changed, who affected, what to do, source
en_seo_title            May differ from display title
en_meta_description     Under 160 characters
ru_title                Translated, not copied
ru_summary              Translated
ru_body                 Complete — no missing facts vs EN
ru_seo_title
ru_meta_description
ru_published            0 until human approves separately
source_url              Required — no sourceless news
source_label            media | official | government | internal
date_published          ISO date — when the news is dated (not publish timestamp)
date_updated            ISO date — when Guidex last updated this post
tags_json               Array of topic tags
related_guide_slug      Optional — existing guide slug
related_service_slug    Optional
featured_homepage       0 by default — human sets to 1
featured_digest         0 by default — human sets to 1
noindex                 0 for published content; 1 for thin/incomplete
```

---

## 11. Events Automation Workflow

**Event types AI can identify and extract:**

| Type | Confidence gate |
|---|---|
| Public holiday (official announced) | `confirmed` — only after UAE government announcement |
| Islamic holiday (Eid, Ramadan, etc.) | `subject_to_official_confirmation` until officially announced |
| Government/agency deadline | `confirmed` with official source |
| School term start/end | `confirmed` with KHDA or school cycle source |
| Tax/company/visa deadline | `confirmed` with FTA/DLD/ICA source |
| Dubai major public event | `expected` until official calendar published |
| Tourism/holiday home deadline | `confirmed` with DET source |

**Required fields for every event:**

```
slug
category                holiday | deadline | festival | government | school | dubai-event
status
color_type              public-holiday (red) | important-date-deadline (orange)
en_title
en_summary
en_body
en_seo_title
en_meta_description
ru_published
ru_title
ru_summary
ru_body
event_date_start        ISO date
event_date_end          ISO date (same as start if one-day event)
date_confidence         confirmed | expected | subject_to_official_confirmation
year                    Integer
source_url              Required
featured_calendar       1 by default for events (human can set to 0)
schema_eligible         1 if date_confidence = confirmed
related_guide_slug
related_news_slug
```

**Rules:**
- `date_confidence = confirmed` only with an official source and confirmed date
- `expected` means likely based on prior year pattern or advance notice — no official confirmation yet
- `subject_to_official_confirmation` for Islamic dates until UAE moon-sighting authority announces
- Red (`public-holiday`) = day off / public holiday only
- Orange (`important-date-deadline`) = deadline, business-critical date, school term
- No colour used for ambiguous dates
- No `schema_eligible = 1` until date is confirmed

---

## 12. Calendar Visual Posts Workflow

**Important:** The Guidex calendar at MVP is not a full calendar application. It is an SEO-friendly visual content item — a page that presents a curated set of dates with a visual image, an HTML date list, and contextual information. It is indexable content, not a live app.

**What a calendar visual post is:**
- A standalone page for a specific time period (month, quarter, year) or topic (Ramadan 2026, UAE Public Holidays 2026)
- Contains a visual calendar image (uploaded by manager)
- Contains a mandatory HTML date list (not image-only — required for accessibility and SEO)
- Dates marked red (day off / public holiday) or orange (important date / deadline)
- Islamic date disclaimer if any dates depend on moon-sighting

**Required fields:**

```
slug
calendar_type           monthly | yearly | holidays | important_dates | ramadan
year                    Integer
month                   Integer (1–12) or null for yearly/topic posts
en_title
en_summary
en_body                 Contextual information about this period's dates
en_notes                Optional editorial notes
en_seo_title
en_meta_description
ru_published
ru_title / ru_summary / ru_body / ru_notes
image_path              Required — no image-only page allowed (must have HTML list too)
image_alt               EN alt text for image
ru_image_alt            RU alt text
dates_json              Array of date objects with label, date, type (red/orange), confirmed flag
has_islamic_dates       0 or 1 — triggers Islamic date disclaimer on page
official_source_url     Required if any date is marked confirmed
last_verified_date      Required — shown on page
featured_homepage       0 by default
```

**Rules:**
- `image_path` + HTML date list from `dates_json` are both required — image-only page is forbidden
- Red dates = confirmed day off / public holiday only
- Orange dates = important date / deadline / notable period
- Islamic dates require the amber disclaimer block on the page
- No fake confirmed dates — `confirmed` flag in `dates_json` only with official source
- Do not claim the page is a "live" or "real-time" calendar
- `last_verified_date` must be set and shown on page — content without a review date is not eligible for indexing

**AI workflow for calendar posts:**
1. Manager submits a source (government announcement, prior year data, calendar image)
2. AI extracts dates, labels, and confidence levels from the source
3. AI proposes `dates_json` structure with red/orange markup and confirmed flags
4. AI drafts EN body (contextual: what these dates mean for residents and businesses)
5. AI drafts RU body
6. AI flags any Islamic dates for disclaimer
7. Manager reviews dates against source, adjusts, approves
8. Manager uploads calendar image
9. Manager publishes EN; then separately approves RU

---

## 13. Media and Image Automation

### MVP approach (manual)

At MVP, `image_path` is a text field — manager uploads the file via server or asset management and pastes the path. No automated media pipeline required for Phase 1.

### Future Media Library

A proper Media Library is planned for Phase 10. It will include:

| Feature | Description |
|---|---|
| Image upload | Direct upload from admin UI |
| File size warning | Flag images over 500KB before upload |
| WebP guidance | Recommend WebP format, warn on JPEG/PNG over size limit |
| Image assignment | Assign image to news post, event, calendar post, area page, or homepage module |
| Image alt text (EN) | AI-generated suggestion, human-editable |
| Image alt text (RU) | AI-generated suggestion, human-editable |
| Credit / source field | Attribution for licensed or sourced images |
| Preview before publish | Image shown in context before confirming |

### Image generation

- AI may suggest prompts for image generation (Midjourney, DALL-E, etc.)
- Human must approve generated visuals before any use on the site
- Forbidden: images that look like official government documents or logos
- Forbidden: images that imply fake legal map boundaries
- Forbidden: images of real people without rights clearance
- All generated images must be clearly identifiable as illustrations, not official documents

### Calendar images

Calendar images are often official-style monthly/yearly visual calendars. Rules:
- Source attribution required if taken from official UAE government materials
- If AI-generated, must be clearly designed (not an imitation of official government calendars)
- Must be accompanied by the HTML date list — the image is supplementary, not the content itself

---

## 14. Area and Map Data Automation

### What AI can help update in Dubai Life Setup area pages

Area data (`lib/life-setup/areas-config.ts` or future DB equivalent) degrades faster than guide content — schools open and close, roads change, malls expand, communities grow. AI can help surface update opportunities.

**AI-assisted area update inputs:**
- Raw community notes from manager ("Al Barsha got a new Carrefour Express in Q1 2026")
- News article mentioning a community development
- KHDA school list update
- New metro line or station announcement (RTA)
- New road/interchange (RTA)
- Property/lifestyle article mentioning an area
- Manager prompt ("Check if JVC commute notes are still accurate")

**AI area update output:**
- Specific tab ID to update (`commute` / `schools` / `shopping` / `setup` / etc.)
- Proposed change text (1–3 sentences)
- Source URL
- Proposed `lastReviewed` date
- Warning if change contradicts existing content (before/after diff)

**Area content rules (enforced by AI warnings):**
- No unsupported nationality claims ("popular with Russians") — descriptive framing only
- No fake live property prices — ranges only, sourced, with review date
- No exact prices without source and `lastReviewed` date
- Property notes must carry disclaimer: "Property values change; verify with a licensed agent"
- Map boundaries remain simplified lifestyle guidance — AI must not suggest changes to SVG shape that imply legal precision
- AI can suggest a map label change (area name display), but not boundary changes

**Workflow:**
1. Manager submits area update input
2. AI identifies which area and which tab section is affected
3. AI proposes updated text with before/after diff
4. AI attaches source and flags any rule violations
5. Manager reviews, edits, approves
6. `lastReviewed` date updated
7. If area page is already indexed, no noindex change needed — update is published in place

---

## 15. Existing Content Update Workflow

AI must be able to propose changes to existing Guidex content — guides, news posts, area pages, events, calendar posts — safely, with full traceability.

```
Trigger: source change detected / manager submits update request
        ↓
AI identifies existing page (by slug, topic match, or manager-specified)
        ↓
AI proposes specific field-level change (not whole-page rewrite)
        ↓
Before/after diff generated for every changed field
        ↓
Source attached (URL + label)
        ↓
SEO impact check (does title/meta change? does canonical change?)
        ↓
EN/RU impact check (does change affect RU content? is RU still accurate?)
        ↓
Preview rendered with proposed changes
        ↓
Human reviews diff and preview
        ↓
Human approves specific changes (can approve partial — accept some fields, reject others)
        ↓
Changes saved — previous version stored in audit log
        ↓
Publish (or save as draft if major changes need more review)
```

**Hardcoded content flag:**

If a page's content is hardcoded in a `.tsx` file (not managed via DB or config), the system must flag:

> "This content is not yet managed by the admin system. It must be migrated to a managed content model before admin editing is possible. Do not edit the `.tsx` file through the admin — changes will be overwritten on next deploy."

This flag prevents the admin from becoming a source of confusion when some content is in the DB and some is in code.

---

## 16. EN/RU Automation Rules

These rules apply to every content type without exception.

| Rule | Detail |
|---|---|
| EN is always prepared first | EN publish gate: `status = published` |
| RU is always a separate approval | RU publish gate: `status = published` AND `ru_published = 1` |
| No English fallback on RU routes | If RU fields are empty, the RU page returns 404, not EN content |
| `ru_published = 0` is the default | AI never sets `ru_published = 1`. Only a human can |
| RU completeness check | AI must warn if `ru_body` is shorter than 80% of `en_body` word count — likely missing facts |
| RU natural language check | RU must be natural Russian. AI must not leave transliterated English terms where Russian equivalents exist |
| Brand names | WhatsApp, Google, RERA, MOHRE, ICA, DLD may remain in Latin in RU content — these are brand names, not untranslated words |
| No mixed-language sentences | Do not mix EN and RU within a single sentence except for proper nouns and brand names |
| If RU incomplete | `ru_published` stays 0; RU draft is saved; human is warned with a checklist of missing or weak fields |
| Fact parity check | AI must flag if the RU body omits a fact, warning, or step present in the EN body |

---

## 17. SEO Automation Rules

Before any content reaches the approval queue, AI runs an SEO readiness check. The output is a checklist of passes and failures, shown to the manager before publish.

| Check | Pass condition |
|---|---|
| One clear search intent | Title and body address a single topic and user need |
| Title not overloaded | No more than one primary keyword phrase; under 70 characters |
| Meta description clear | Under 160 characters, factual, matches body content |
| No keyword stuffing | Keyword density is natural |
| No thin content | Body has substantive value, not just a headline and source link |
| No duplicate page | No existing Guidex page targets the same query |
| No image-only page | HTML content exists independent of image |
| No fake live data | No claims of "live" or "real-time" data unless system supports it |
| No fake reviews/ratings | No manufactured social proof |
| Source attribution | `source_url` and `source_label` populated |
| Internal links | At least 2 internal links suggested |
| FAQ relevance | FAQ included only if it adds genuine value (not boilerplate) |
| Last reviewed | Set for all area and property content |
| Canonical path | Correct canonical URL |
| Sitemap eligibility | Index only when content quality gate is passed |
| noindex recommendation | Flag if draft, thin, or incomplete |

---

## 18. Quality and Safety Checks

AI runs this full checklist before placing any item in the approval queue. Results are shown to the manager — not hidden.

| Check | What AI verifies |
|---|---|
| Source check | Is source URL accessible, identifiable, and classified? |
| Fact check | Do facts in draft match source? Flag any mismatch |
| Date confidence check | Is `date_confidence` level justified by source? |
| Duplicate check | Does an existing Guidex page cover this? |
| Thin content check | Is body substantive or just a restatement of the title? |
| RU completeness check | Is `ru_body` complete relative to `en_body`? |
| No fallback check | Is `ru_published = 0` if RU is incomplete? |
| No em-dash check | No em-dashes in any field (project style rule) |
| Unsupported claim check | Flag pricing claims, nationality claims, legal claims without source |
| Source label check | `source_label` matches actual source type |
| Internal links check | At least 2 internal links present |
| CTA check | WhatsApp CTA is present and appropriate |
| Preview check | Page renders correctly in preview |
| Image alt check | `image_alt` and `ru_image_alt` are populated if image is used |
| Calendar HTML list check | `dates_json` is populated if this is a calendar post |
| Islamic date disclaimer check | `has_islamic_dates = 1` triggers disclaimer in preview |
| Source compliance check | Source access did not bypass robots.txt, paywall, or terms of service |
| Originality check | Draft is structurally and substantively original — not a rewrite or close paraphrase of source |
| Duplicate / update-existing decision | Confirmed: this should create a new page, not update an existing one |
| No copied headline or body structure | EN title and body structure are not reproduced from the media source |

---

## 19. Autopublish Policy

### Phase 1–6: No autopublish

Every item requires explicit human approval before publishing. AI never publishes.

### Future limited autopublish (Level 5 — restricted)

Autopublish may be considered only for:
- Low-risk internal digest cards (not public-facing articles)
- Non-sensitive event reminders already confirmed by official source and previously approved
- `last_reviewed` date bumps on content where no facts changed
- Simple "latest update" rotation on homepage (rotating a pre-approved post into the featured slot)
- Social draft generation (copy for social posts, not website publish)

**Autopublish is permanently forbidden for:**

| Content type | Reason |
|---|---|
| Visa rule changes | Legal, process, and fee accuracy required |
| Tax / compliance changes | FTA rules; financial accuracy required |
| Public holiday confirmation | Official government announcement required |
| Islamic holiday dates | Moon-sighting confirmation required |
| Government application process changes | MOHRE, ICA, DLD process accuracy |
| Fee / pricing claims | Source and review date required |
| Property prices | RERA sourcing required |
| Medical / legal / financial-sensitive content | Liability |
| RU page publishing | Separate human approval gate always required |
| Any content on a new content type | Must be proven safe first |

**Staging requirement:** Before any content type is eligible for autopublish, it must have at least 50 approved, published items with zero quality rollbacks. Owner must explicitly approve the content type for autopublish in writing.

---

## 20. Human Roles and Approvals

### Roles

| Role | Description |
|---|---|
| Owner / Admin | Full system access; defines autopublish policy; approves production settings; can delete and archive |
| Manager | Reviews and approves drafts; publishes content; manages media; approves RU publishing; assigns homepage slots |
| Editor | Creates drafts; requests AI assistance; edits content; cannot publish or approve |
| AI Assistant | Suggests, classifies, drafts, translates, rewrites, runs SEO and safety checks, generates previews; **cannot publish, delete, deploy, change code, change schema, or change routes** |

### Approval matrix

| Action | Owner | Manager | Editor | AI |
|---|---|---|---|---|
| Publish EN content | ✓ | ✓ | — | — |
| Publish RU content (`ru_published = 1`) | ✓ | ✓ | — | — |
| Archive content | ✓ | ✓ | — | — |
| Delete content | ✓ | — | — | — |
| Assign homepage slot | ✓ | ✓ | — | — |
| Approve autopublish rules | ✓ | — | — | — |
| Create / edit draft | ✓ | ✓ | ✓ | suggests only |
| Request AI draft | ✓ | ✓ | ✓ | — |
| Deploy to production | ✓ | — | — | — |
| DB migration | ✓ | — | — | — |
| Change code / schema / routes | ✓ | — | — | — |

---

## 21. Audit Log and Rollback

### Every action is logged

| Field | Description |
|---|---|
| `created_by` | User ID of creator |
| `created_at` | Timestamp |
| `edited_by` | User ID of last editor |
| `edited_at` | Timestamp |
| `ai_prompt_used` | Hash or ID of AI prompt template used |
| `ai_output_version` | Version of AI response (for debugging) |
| `source_url` | Source used for this version |
| `approved_by` | User ID of approver |
| `published_at` | Timestamp |
| `archived_at` | Timestamp |
| `fields_changed` | Array of field names changed in this edit |
| `diff_before` | Snapshot of fields before change |
| `diff_after` | Snapshot of fields after change |

### Rollback rules

- Previous content version is always stored — never silently overwritten
- Manager can restore any previous version within the audit log
- Restoring a version requires confirmation (not one-click)
- Homepage slot rollback: revert to previous slot assignment; previous content returns to its position
- Bad content rollback: archive the bad item, restore previous version; do not delete (audit trail must be preserved)
- **AI must never silently overwrite content** — every AI-proposed change requires a diff + approval

---

## 22. Technical Architecture Options

### Option A — Human-only admin first

All content creation is manual. No AI runtime. Admin UI provides structured fields, validation, preview, and publish workflow. AI is not integrated.

**Pros:** Safest, fastest to build, no Claude API dependency, no prompt engineering required.
**Cons:** All editorial work remains manual. Does not scale with content volume.
**When to use:** Phase 1–6 (MVP admin through manual publishing workflow).

### Option B — Admin + AI draft assistant

Admin UI includes an "AI Help" button per content item. Manager provides raw input; AI fills structured fields; human edits and approves. Claude API called server-side on demand.

**Pros:** Best first AI integration. Low risk — AI only helps, never publishes. Measurable quality improvement per item.
**Cons:** Requires Claude API integration, server-side API route, prompt safety layer, response logging.
**When to use:** Phase 7 (AI draft assistant).

### Option C — Source monitor + auto-draft

Source Registry is active. AI checks sources on schedule. Drafts appear in "Pending Review" queue automatically. Human approves or discards.
**Pros:** Scalable content discovery. Reduces monitoring effort significantly.
**Cons:** Complex to build safely. Requires source reliability system, duplicate detection, rate limiting, and robust error handling.
**When to use:** Phase 8–9.

### Option D — Limited autopublish

Specific low-risk content types are auto-published after passing all quality gates.
**Pros:** Maximum automation for proven-safe content.
**Cons:** High risk if quality gates are insufficient. Requires extensive audit log and rollback capability.
**When to use:** Phase 13 — only after owner approval per content type, after 50+ zero-rollback approvals.

### Recommendation

**A → B → C → limited D** in strict sequence. Do not skip phases. Each phase must demonstrate quality before the next is built.

---

## 23. Runtime Dependencies

When AI is integrated into the admin (Phase 7+), the following infrastructure is required:

| Dependency | Purpose |
|---|---|
| Claude API key | Server-side only — never exposed to browser |
| Server-side API route or Server Action | Proxy for Claude API calls from admin UI |
| Strict system prompt | Defines AI role, rules, output format, and what it must refuse |
| Prompt version logging | Every prompt template has a version ID — logged with each AI call |
| Response logging | Every AI response is stored — linked to content item and audit log |
| User permission check | AI endpoint only accessible to authenticated admin users |
| Rate limits | Per-user and per-day limits to prevent abuse and runaway API costs |
| Source fetcher | Fetch and extract readable text from source URLs |
| HTML/article extraction | Parse article text from source HTML (readability algorithm or equivalent) |
| Duplicate detection | Compare proposed content against existing slugs and body text similarity |
| Preview pipeline | Render proposed content as it would appear on the live page |
| Human approval flow | UI gate: AI output → human review → approve / reject / edit → save |

**No runtime AI implementation is in scope for this planning document.**

---

## 24. Implementation Phases

| Phase | Name | Description |
|---|---|---|
| 1 | Unified admin architecture document | Audit old admin/auth. Define unified content admin shell. No code yet. |
| 2 | Old admin / auth audit | Map what current admin does. Identify what must be replaced. Define migration path. |
| 3 | Unified content admin shell | New admin shell with auth, navigation, and role system. Old admin remains in place. |
| 4 | News / Event / Calendar Visual Post CRUD | Create, edit, delete for the three new content types. Drizzle + writer.ts. |
| 5 | Preview and validation gates | Pre-publish quality checklist. EN/RU completeness. No-em-dash. Source label. |
| 6 | Manual content publishing workflow | Full end-to-end: draft → validate → preview → approve → publish. Human only. |
| 7 | AI draft assistant | Claude API integration. AI Inbox. On-demand draft generation. Human approval required. |
| 8 | Source registry and assisted monitoring | Source Registry data model. Suggestion queue. Human selects what becomes a draft. |
| 9 | Auto-draft queue | Sources checked automatically. Drafts created automatically. Human approves. |
| 10 | Media library | Image upload, alt text, WebP, assignment, preview. |
| 11 | Dubai Life Setup area/map data admin | Area tab editing, map label management, `lastReviewed` workflow. |
| 12 | Existing guides/services migration | Move guide content from hardcoded routes to fully admin-managed. |
| 13 | Limited autopublish | Only after owner approval per content type. Only after 50+ zero-rollback approvals. |
| 14 | Old admin removal | After feature parity confirmed. Old admin deprecated and removed. |

---

## 25. MVP Recommendation

**Build Phase 3–6 first. No AI runtime. No autopublish. No old admin deletion.**

### MVP admin includes:

- One unified admin shell (new, separate from old admin — old admin stays in place)
- Content type switcher (News / Events / Calendar Visual Posts — later: Guides, Areas)
- News CRUD: all required fields, validation, EN/RU fields, save-as-draft, publish
- Events CRUD: all required fields, date_confidence selector, color_type, source
- Calendar Visual Post CRUD: dates_json editor, image_path, has_islamic_dates, last_verified_date
- Validation gates: pre-publish checklist (source present, no thin content, RU completeness if ru_published = 1)
- EN/RU workflow: publish EN first, approve RU separately
- Preview: render content as it will appear on the live page
- Manual image_path (no media library at MVP)
- No AI runtime calls
- No old admin deletion
- No homepage editor
- No sitemap automation

### After MVP is stable — Phase 7:

- AI draft assistant added inside the new admin
- Manager pastes source → AI fills fields → human edits and approves
- No change to publishing flow — AI only assists the draft stage

---

## 26. What Must Not Be Built Now

This is a strict exclusion list for the planning and early build phases.

| Item | Reason |
|---|---|
| Full autopublish | Not until Phase 13 — after proven quality at scale |
| Full calendar app | Guidex calendar is content, not an app. No interactive date picker, no user events |
| Live data claims | No real-time feeds, no "live" labels on static content |
| Paid APIs | No Google Maps, no paid news feeds, no data APIs without owner approval |
| Scraping without source rules | No scraping without a Source Registry entry and reliability classification |
| Copying content | No reproduction of source articles — editorial transformation required |
| Old admin deletion | Old admin stays until new admin has full feature parity — Phase 14 |
| Guide content migration | Guides remain in current DB structure — not migrated until Phase 12 |
| Homepage editor | No UI for homepage slot management — owner approves changes manually until Phase 9+ |
| Media generation pipeline | No automated image generation pipeline — human uploads images at MVP |
| Production deploy automation | Never automated — always manual SSH deploy sequence |
| DB schema changes in this planning task | Architecture only — no migrations |

---

## 27. Exact Next Step After Approval

### Immediate next step: Phase 1 — Unified Admin Architecture Document

Before writing any admin code, create `docs/unified-admin-architecture-plan.md` covering:

1. Current old admin audit — what it does, what files it touches, what it must continue to support
2. Why a new admin shell is needed — route separation, bundle isolation, future content types
3. Proposed new admin route structure (`/admin/v2/` or a clean `/admin/` replacement)
4. Auth scope — whether current NextAuth.js setup can serve the new admin or needs updating
5. Content type routing (News, Events, Calendar Visual Post, future: Areas, Guides)
6. Writer.ts extension plan — what new DB write functions are needed
7. Component directory plan (`components/admin-v2/` — isolated from public components)
8. Migration path — how old admin routes are preserved while new admin is built in parallel
9. Feature parity checklist — what new admin must do before old admin can be removed

**After Phase 1 document is reviewed and approved:** Begin Phase 2 (old admin audit) — read-only investigation, no changes to old admin files.

**After Phase 2:** Begin Phase 3 build (unified admin shell) — new routes, new components, no modification to old admin.

Do not begin any admin code before Phase 1 document is approved.

---

## Appendix — Key Decision Summary

| Decision | Choice | Reason |
|---|---|---|
| Automation start point | Level 1 (manual input → AI draft) | Safety — build trust before adding automation |
| First autopublish | Never in Phase 1–12 | Quality must be proven at scale first |
| AI engine | Claude API (Anthropic) | Existing workflow, existing model knowledge |
| Source monitoring | Deferred to Phase 8 | Source Registry design must come before monitoring |
| RU autopublish | Never | Always requires explicit human gate |
| Old admin | Preserved until Phase 14 | Feature parity must be confirmed before removal |
| Media library | Phase 10 | Manual `image_path` sufficient for MVP |
| Calendar type | Content pages, not live app | SEO-indexable content, not interactive calendar |
| Map data admin | Phase 11 | Dubai Life Setup must ship first |
| Paid APIs | Never | Project constraint |
