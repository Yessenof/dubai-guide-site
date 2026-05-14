# AI-First Admin UX Plan

**Document type:** Product and UX planning  
**Status:** Draft — not approved for implementation  
**Created:** 2026-05-14  
**Updated:** 2026-05-14 — Added AI Inbox modes, manual input workflow, two-pass draft, Guidex AI editorial instruction pack  
**Scope:** `/admin/content` — News, Events, Calendar Visual Posts, and future content types

---

## 1. Current Admin State

The current `/admin/content` admin is a structured backend editor. It is safe, correct, and functional.

What exists today:
- `/admin/content/news` — News draft + publish + archive. Full field coverage. QA-verified.
- `/admin/content/events` — Events draft + publish + archive. Date confidence, date range, source, color, category. QA-verified.
- `/admin/content/calendar` — Calendar Visual Posts draft + publish + archive. dates_json editor, Islamic dates gate, last_verified_date, official_source_url. QA-verified.
- Old guide admin at `/admin/guides` — still the active guide editing workflow. Not replaced.

What the current admin is designed for:
- A technically literate owner who knows what every field means.
- Manual field-by-field data entry.
- Explicit control over every slug, category, SEO title, dates_json entry, and flag.
- An editor who is already writing final-quality copy before saving.

What the current admin is not designed for:
- Fast daily workflow. Pasting a URL and getting a draft in 10 seconds is not possible today.
- Non-technical contributors. Every field requires knowledge of the schema.
- RU content automation. Russian fields must be manually typed today.
- Multi-source input. There is no way to paste a PDF extract, screenshot note, or raw idea and have it classified and structured automatically.

The current admin is the **safe backend foundation**. It is not the final daily UX. The AI layer sits on top of it.

---

## 2. Why Structured Fields Still Matter

The current fields are not going away. They are the canonical schema — the single source of truth that the public site reads from, the QA scripts verify, and the publish gates enforce.

AI-generated content must be saved into these exact fields. The AI does not bypass the schema; it populates it faster.

Reasons to keep structured fields:
- **Publish validation is field-level.** The publish gate checks `en_seo_title`, `dates_json`, `official_source_url`, `last_verified_date` individually. An AI-generated value for each field must still pass the same validation as a manually typed value. This cannot be bypassed.
- **Override is essential.** AI will make mistakes on category, confidence level, slug format, and RU phrasing. The owner must be able to edit any field before publish.
- **Compliance content requires manual verification.** dates_json entries referencing government deadlines require human confirmation against an official source. AI can propose; human must confirm.
- **Audit trail.** Structured fields create a clear record of what was published and what the source was. Free-form AI chat logs do not.

Position of structured fields in the AI-first workflow:
- During draft creation: hidden behind "Advanced structured fields" — collapsed by default.
- After AI generates a draft: auto-expanded with AI-filled values visible and editable.
- Before publish: fully visible and editable — same as today.
- On publish: same validation gates — unchanged.

---

## 3. AI Inbox Input Modes

The AI Inbox is the front door to all content creation. It supports two input modes. Both modes feed the same downstream pipeline.

### Mode A — Daily Auto Digest

AI scans a pre-approved source list on a daily schedule or when the owner triggers it manually. Sources may include official UAE government feeds, curated media, free zone authority notices, and other approved channels defined in the source registry (Phase 4B-7).

Output: a digest card for each discovered item — not a saved draft. The owner reviews the cards and selects which items to develop further.

Trigger: manual button ("Run digest now") or scheduled (Phase 4B-6). Never autopublish.

### Mode B — Manual Owner Input

The owner or manager pastes any of the following directly into the AI Inbox input box:

- A URL (news article, official portal page, government notice, event listing)
- Copied text (WhatsApp message, Telegram post, email body, chat message)
- PDF extract (government announcement, compliance memo, legal update)
- Screenshot notes (OCR'd text, bullet points from an image)
- A personal idea (free-form description — "we should cover the new RTA parking rules")
- A competitor observation ("competitor is ranking for this — should we cover it?")
- A venue or event announcement (restaurant opening, festival, conference)
- A compliance update found during research

All of these are valid inputs. The AI classifies and processes them through the same editorial pipeline regardless of format.

### The shared pipeline

Both Mode A and Mode B produce the same type of output and flow through the same stages:

```
Input (auto digest or manual paste)
        ↓
AI classifies item — type, risk, source reliability, SEO opportunity
        ↓
Digest card generated — headline, summary, source, recommended action
        ↓
Owner selects items to develop
        ↓
AI generates structured draft (Pass 2)
        ↓
Owner refines via prompt or manual edit
        ↓
Preview (EN + RU panels)
        ↓
Save draft → Publish (same gates as today)
```

Mode A and Mode B are not separate systems. They share the same classification logic, the same card format, the same refinement UI, and the same save-to-draft action. The only difference is who initiates the input.

---

## 4. Manual Input UI Concept

This section describes the target UX for Mode B manual input. Not yet implemented.

### AI Inbox — Manual Input panel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI Inbox — Manual Input                                                    │
│─────────────────────────────────────────────────────────────────────────────│
│  Paste URL, text, source, idea, Telegram post, PDF notes, or screenshot    │
│  description                                                                │
│                                                                             │
│  [ large textarea — no character limit ]                                    │
│                                                                             │
│  Source type (optional):                                                    │
│  [ Auto detect ▾ ]                                                          │
│  Options: Auto detect / Official / Media / Telegram / Internal note /       │
│           Event listing / Venue / Other                                     │
│                                                                             │
│  Instructions (optional):                                                   │
│  [ e.g. "Make it short" / "Turn into event" / "Prepare RU also" /          │
│    "Check if this should update existing guide" / "Make it SEO stronger" ] │
│                                                                             │
│  Content type preference (optional):                                        │
│  [ Auto ▾ ]                                                                 │
│  Options: Auto / News / Event / Calendar Visual Post / Guide / Service /    │
│           Area Update / Ignore                                              │
│                                                                             │
│  [ Analyze input ]                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Output: AI-generated digest card

After "Analyze input" is clicked, AI returns one or more digest-style cards. Each card contains:

| Card field | Description |
|---|---|
| Headline suggestion | Short candidate title — not yet a final en_title |
| Short summary | 1–2 sentences — what this is about |
| Source link | Extracted or inferred URL |
| Source type | official / government / media / Telegram / internal / venue / other |
| Source reliability | high / medium / low / unverified |
| Suggested content type | News / Event / Calendar / Guide / Service / Area / Ignore |
| SEO opportunity | short note — e.g. "high search volume for 'RTA parking rules Dubai'" |
| Risk level | low / medium / high — see Section 9 for risk definitions |
| Verification needed | specific claims that need official source confirmation before publish |
| Recommended action | create News draft / create Event / update existing guide / monitor only / ignore |
| ☐ Select for drafting | checkbox — owner selects items to develop into drafts |

Cards marked as "Ignore" by the AI are shown at the bottom collapsed — owner can override the recommendation.

Multiple cards may be returned from one input (e.g., a URL about e-invoicing produces one News card and one Event card for the July 31 deadline).

---

## 5. Unified Intake Pipeline

Daily Auto Digest (Mode A) and Manual Input (Mode B) must not be separate systems with different logic, different UIs, or different paths to a published draft. They are two entry points into a single pipeline.

```
MODE A                          MODE B
Daily digest trigger            Owner pastes URL / text / idea
        │                               │
        └───────────────┬───────────────┘
                        ▼
              AI Inbox (classification engine)
              - type: News / Event / Calendar / Guide / Service / Area / Ignore
              - risk level: low / medium / high
              - source reliability
              - SEO opportunity
              - verification checklist
                        │
                        ▼
              Digest cards displayed to owner
              Owner selects which items to develop
                        │
                        ▼
              Pass 2 — AI draft generation
              Full structured fields generated
              (see Section 10 for field list)
                        │
                        ▼
              Draft refinement (chat prompt or manual edit)
                        │
                        ▼
              Structured editor (Advanced fields — all editable)
                        │
                        ▼
              Preview (EN + RU panels)
                        │
                        ▼
              Save draft
                        │
                        ▼
              Publish gate (same validation as today — no bypass)
                        │
                        ▼
              Published (/news/[slug], /events/[slug], /calendar/[slug])
```

The classification engine, the card format, the draft generation prompt, and the publish gate are identical for both modes. There is no "fast path" that bypasses any stage.

---

## 6. Two-Pass Draft Workflow

All AI-assisted content creation follows a two-pass model. Collapsing these into one step produces lower-quality output because the classification pass and the draft pass have different goals.

### Pass 1 — Discovery and selection

**Goal:** Surface what is worth covering. Filter out noise. Identify risk level before investing in a draft.

What happens:
- AI summarizes each input item into a digest card.
- Cards show: headline suggestion, source type, reliability, suggested content type, risk, recommended action.
- Owner reviews cards and selects which ones to develop.
- Items marked "Ignore" are filtered out — no draft is generated.
- Owner may override AI classification before proceeding ("change this from News to Event").

What does not happen in Pass 1:
- No full en_body is generated.
- No slug, SEO title, or meta description.
- No RU draft.
- No field pre-filling.
- No save to database.

### Pass 2 — Draft and refinement

**Goal:** Generate a publish-ready draft for a selected item, ready for human review and edit.

What happens:
- Owner clicks "Create draft" on a selected card.
- AI generates all structured fields for the target content type (see Section 10).
- Draft is displayed in the form with all fields pre-filled.
- Owner reviews the draft.
- Owner types a refinement prompt if needed.
- AI revises the specified fields based on the prompt.
- Only after the owner is satisfied: "Save draft" is clicked. The draft is saved to the database.

### Refinement prompt examples

The owner types a short instruction. AI revises only the relevant field(s).

| Prompt | What AI revises |
|---|---|
| "make it shorter" | en_body — tighten, remove filler |
| "make it stronger for SEO" | en_seo_title, en_meta_description, en_body — add keyword naturally |
| "remove hype" | en_title, en_body — remove superlatives, fake urgency |
| "add source caution" | en_body — add a note that this awaits official confirmation |
| "split into News + Event" | generates two separate cards — one News, one Event |
| "convert to Event instead of News" | reclassifies and regenerates for Event fields |
| "add WhatsApp CTA softly" | en_body — add one soft CTA line at the end |
| "prepare Russian version" | ru_title, ru_summary, ru_body, ru_seo_title, ru_meta_description |
| "make it more premium" | tone revision — remove informal phrasing, add calm authority |
| "simplify for mobile" | en_body — shorter paragraphs, max 3 lines each |
| "keep only practical details" | en_body — remove background, keep what to do and where |
| "check if existing guide should be updated instead" | AI compares against existing guide slugs and recommends update vs. new page |

Refinement does not auto-save. Owner reviews the revised output and clicks "Save draft" explicitly.

---

## 7. Final AI-First Create Flow (Single Item)

For items that the owner wants to draft directly — without going through the full digest card flow — the create page supports a single-item flow.

### Top panel — input

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Paste URL, source text, notes, or describe the content                     │
│                                                                             │
│  [ large textarea — no character limit ]                                    │
│                                                                             │
│  Content type:  [ Auto ▾ ]     Instructions (optional): [____________]      │
│                                                                             │
│  [ Generate draft ]                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Input accepted:**
- Paste a URL — AI fetches and summarizes the source (Phase 4B-5)
- Paste raw text — news excerpt, Telegram post, government notice, compliance update
- Paste PDF extract — compliance deadline text, official announcement
- Type a free-form idea — "write a news post about the ILOE penalty increase"
- Paste screenshot OCR notes — title + bullet points from a screenshot

**Content type selector:**
- Auto — AI classifies based on input
- News Post / Event / Calendar Visual Post / Guide (future) / Service (future) / Area Update (future)

**Instructions field:**
- Optional. Examples: "Use MOHRE as the official source." / "Keep it under 100 words." / "Prepare RU also."

**Generate draft button:**
- Calls the AI draft API. Returns all structured fields pre-filled. Does not save. Does not publish.

### Flow after generation

```
AI generates draft
        ↓
All fields pre-filled and visible
        ↓
Human reviews title, body, slug, category, dates, source, SEO
        ↓
Human types refinement prompt if needed (Section 6)
        ↓
Preview (EN + RU panels)
        ↓
Save draft → Publish gate (same as today)
```

---

## 8. AI Classification Rules

When content type is set to Auto, the AI uses the following signals. These same rules apply in both Mode A (digest) and Mode B (manual input).

| Type | Classification signals |
|---|---|
| **News Post** | Contains an announcement, update, regulatory change, new rule, deadline extension, government statement, business opening, or reported development. Time-sensitive. Single announcement. Not a repeating date. |
| **Event** | Contains a specific date or date range. A holiday, deadline, government event, ceremony, school term, application window, or public period. Has a clear start date. May have a date_confidence level. |
| **Calendar Visual Post** | Covers multiple dates across a month or year. A structured list of dates for a planning period. Not a single-event announcement. Appropriate as a scannable visual hub page. |
| **Guide** | Evergreen how-to or procedure. A process with steps. No time-sensitive date. Targets a repeated search query. Long-form. |
| **Service** | A paid execution offer — PRO services, business setup, visa filing. Not purely informational. Has a clear commercial action. |
| **Area Update** | Dubai life setup. Neighborhood, transport link, school, infrastructure, or community update. Geographic focus. |
| **Ignore** | Weak signal, duplicate of existing content, irrelevant to UAE/Dubai audience, too promotional without substance, unverifiable, or below Guidex quality threshold. |

**Default on ambiguity:** News Post. Reclassification is cheap — the owner changes the type and the AI regenerates the relevant fields.

**Never classify as Event when:**
- The date is in the past and there is no forward-facing planning value.
- The "date" is a publication date, not an event date.
- The source is unverified and the event details are too sparse to publish.

---

## 9. Guidex AI Editorial Instruction Pack

This section defines the base editorial instruction layer that governs all AI output inside the Guidex admin. It is the foundation of the system prompt for all AI draft, classification, and refinement calls.

This is not a style guide — it is an operational instruction set. Every AI call in the admin uses this as its base context.

---

### 9.1 Core Identity

Guidex is a premium, practical UAE and Dubai guidance hub. It helps people who are setting up companies, getting visas, navigating government procedures, and building their lives in Dubai. It is not a generic blog, not a mass content farm, and not a promotional agency.

Every piece of content must do one of these things:
- Help someone make a decision.
- Help someone take the next practical step.
- Surface a regulation, deadline, or procedure they need to know about.
- Connect them to the right official source or Guidex guide.

Content that does not serve at least one of these purposes should be classified as Ignore.

---

### 9.2 Writing Style Rules

These rules apply to all AI-generated EN body copy, titles, summaries, and SEO fields.

**Paragraphs:**
- Short mobile-first paragraphs. Maximum 3 sentences per paragraph.
- No walls of text. One idea per paragraph.
- Line breaks between paragraphs always.

**Sentences:**
- Short declarative sentences. Subject + verb + object.
- No long em-dashes in chains. Use a comma or a new sentence instead.
- No em-dash (—) at all unless quoting an official document verbatim.

**Tone:**
- Calm and authoritative. The reader may be anxious about a compliance deadline or visa issue. Guidex does not add to that anxiety.
- Facts first. Lead with the obligation, the change, or the deadline. Explain context second.
- No fake urgency. Never write "Act now before it's too late."
- No theatrical framing. Never write "This is a pivotal moment for UAE businesses."
- No hype. "The biggest regulatory change in UAE history" is not Guidex.
- No filler transitions. "Once complete, you will then proceed to" is not Guidex.

**Claims:**
- Specific numbers when available: AED 375,000, not "hundreds of thousands."
- Official terms: FTA, ICA, GDRFA, MOHRE, DED, DMCC, DIFC, ADGM. Spelled out once per page, abbreviated after.
- No invented jargon. Use the term the official authority uses.
- No "best in Dubai" or comparative superlatives unless directly quoting a verified ranking.
- No unsupported claims. If a penalty amount or deadline is not confirmed by an official source, say so.

**What not to write:**
- "In the ever-evolving landscape of UAE compliance..."
- "Navigating the complexities of Dubai's business environment..."
- "As one of the most dynamic cities in the world..."
- "Guidex is your trusted partner..."
- Any sentence that sounds like it was written to fill space.

---

### 9.3 Content Transformation Format

When AI receives raw input (URL, text, Telegram post, PDF extract, idea), it must output content in the Guidex action-brief format. This format applies to all content types.

**Action-brief structure (used inside en_body):**

1. **What happened / what changed** — one sentence, plain language. The fact, the update, or the development.
2. **Who is affected** — company type, visa type, free zone, nationality, income threshold — whoever this applies to specifically.
3. **Why it matters** — the practical consequence. What happens if you do nothing? What deadline is triggered?
4. **What to check** — the specific threshold, date, portal, or condition that applies to this reader.
5. **What to do next** — the concrete action. Register on FTA portal. Contact free zone authority. Check your license anniversary date.
6. **Risk or warning** — the most common mistake or missed step. Only include if genuinely useful and verifiable.
7. **Source status** — label the source: Official / Government / Media (verify before acting) / Unverified.
8. **Related Guidex guide or service** — link to the most relevant existing guide or service page if one exists.
9. **CTA if relevant** — one soft CTA line where appropriate. Never promotional. Example: "For company setup help, contact us via WhatsApp."

Not every item needs all 9 elements. A short venue opening may only need elements 1, 2, 5, and 7. A compliance deadline needs all 9.

---

### 9.4 SEO Generation Rules

For every draft, AI must also generate:

| Output | Rule |
|---|---|
| `slug` | Lowercase, hyphens, max 60 chars. Include the primary keyword. No stop words at start. No year unless essential. |
| `en_seo_title` | Under 60 chars. Specific, searchable. No "Ultimate Guide." No questions. Include location (Dubai / UAE) where relevant. |
| `en_meta_description` | Under 160 chars. 1–2 sentences. States what the page covers, the process type, notable specifics (fee, deadline, authority). No duplicate of title. |
| `category` | From the unified taxonomy (Section 12). One category per item. |
| `tags_json` | 3–6 tags. Official entity names, process names, audience type. No generic tags like "Dubai" alone. |
| Internal link suggestion | If an existing Guidex guide slug is directly relevant, suggest linking from en_body. |
| FAQ ideas | If the topic has 2+ common sub-questions, suggest them for a future FAQ section. |
| Search intent | Informational / navigational / transactional — label it in the card output. |
| `noindex` recommendation | Recommend noindex=1 if the content is thin, unverified, or a stub. Recommend noindex=0 only when content is complete and sources are confirmed. |
| Duplicate check | Before creating a new page, AI must check the suggested slug against existing slugs and warn if a similar page already exists. |
| Update vs. new page | If the topic is already covered by an existing guide or news post, AI must recommend updating that page rather than creating a duplicate. |

---

### 9.5 EN/RU Generation Rules

**English (always generated first):**
- EN is the canonical draft. All other fields derive from EN.
- EN body must be complete and factually reviewed before RU is generated.
- EN must stand alone as a full, publishable page.

**Russian (generated on request or when "Prepare RU also" is in instructions):**
- RU is a full translation and cultural adaptation — not a literal word-for-word translation.
- RU must read as natural Russian, not translated English.
- If an official UAE term has a commonly used Russian transliteration (e.g., "МОХРЕ", "ИКА"), use it. If not, use the English abbreviation the first time and explain it.
- `ru_published` is always set to `0` (false) after AI generation. Owner sets it to `1` only after reviewing the RU draft.
- No EN fallback in the public site. If `ru_title` or `ru_body` is empty, the RU page returns 404. AI must generate complete RU fields or leave them empty — never partially filled.
- If the AI-generated RU body is weaker than the EN body (e.g., significantly shorter, less specific, or missing key details), AI must flag this with a warning before saving.

**RU quality check (AI self-check before returning RU draft):**
- Is the RU body roughly the same length and depth as EN? If not, warn.
- Are all specific numbers, deadlines, and official names present in the RU body? If any are missing, flag them.
- Does the RU body use natural sentence structure for Russian, not calques from English? If not, flag.

---

### 9.6 Source Rules

These rules govern how AI treats different source types and what it includes in draft output.

| Source type | Trust level | How AI treats it |
|---|---|---|
| Official UAE government portal (FTA, ICA, GDRFA, MOHRE, MoF, DHA, MOEC, DED, free zone authority) | Highest | Use as primary source. Quote specific rule or deadline directly. Link to source page. |
| Federal Decree-Law / Cabinet Decision | Highest | Use as primary source. Reference by official name and number. |
| Government media (WAM, Khaleej Times on official announcements) | High | Use to support official claims. Cross-check with official portal. |
| Credible media (Gulf News, Reuters, Bloomberg) | Medium | Use for context and timing. Flag: "Reported — verify against official source before publishing." |
| Telegram channel / social media post | Low | Signal only. Never cite as the primary source. Must be confirmed officially before publishing. |
| Competitor PDF / advisory firm publication | Low | Use as topic signal only. No text, structure, or data to be copied. Must be verified officially. |
| Internal idea / observation | None | Starting point for research. Cannot be published without an official source. |

**Hard source rules (never violated):**
- Do not copy text, headlines, or structure from any external source.
- Do not closely paraphrase competitor content.
- Do not bypass paywalls.
- Do not scrape private or restricted Telegram channels.
- Do not fabricate source URLs or claim a source exists if it was not found.
- If a specific claim (penalty amount, deadline date, threshold figure) cannot be traced to an official source URL, it must be labeled: `[Needs official verification]` in the draft — not stated as fact.

---

### 9.7 Risk Classification

Every digest card and draft includes a risk label. This is an operational signal to the owner, not a legal assessment.

| Risk level | Definition | Examples | Required before publish |
|---|---|---|---|
| **Low** | Factual, soft, verifiable from a public source. Wrong information has low consequence. | Venue opening, festival, tourism event, general business tip | Standard human review |
| **Medium** | Important but consequence of error is manageable. May affect planning decisions. | Trade license timing, school enrollment window, general business news | Human review + source check |
| **High** | Consequences of error are significant. Legal, financial, compliance, or procedural. | Visa rules, tax deadlines, penalties, legal requirements, government procedures, Islamic dates, medical/health claims, fee amounts, public holiday confirmation | Human review + official source URL confirmed + owner sign-off |

**High-risk items cannot be published in the following states:**
- Source is media-only (no official URL confirmed).
- Penalty amount or threshold is from a non-official source.
- Date is "expected" and has not been confirmed on an official portal.
- The item relates to Islamic holiday dates and the official moon-sighting announcement has not been made.
- The item involves a visa, tax, or legal procedure and the rule is from a prior year without reconfirmation.

High risk does not mean "do not cover." It means "cover carefully, verify first, and label clearly."

---

## 10. AI-Generated Fields

For each content type, the AI generates all of the following fields as a starting point. Every field is editable before saving.

### All content types

| Field | AI action |
|---|---|
| `slug` | Generated from title — lowercase, hyphens, max 60 chars, no stop words |
| `category` | Classified from content signals — see taxonomy in Section 12 |
| `tags_json` | 3–6 relevant tags extracted from content |
| `en_title` | Specific, searchable — per Content Writing Standard in CLAUDE.md |
| `en_summary` | 1–2 sentences — meta description quality |
| `en_body` | Full body — Guidex action-brief format (Section 9.3) |
| `en_seo_title` | Under 60 chars |
| `en_meta_description` | Under 160 chars |
| `ru_title` | Draft translation — editable |
| `ru_summary` | Draft translation — editable |
| `ru_body` | Draft translation — editable |
| `ru_seo_title` | Draft translation — editable |
| `ru_meta_description` | Draft translation — editable |
| `source_label` | Classified: official / government / media / advisory |
| `source_url` | Extracted from input if a URL was pasted |
| Related guide slug | Matched against existing guide slug list |

### Event-specific

| Field | AI action |
|---|---|
| `event_date_start` | Extracted from input text — ISO 8601 |
| `event_date_end` | Extracted if range mentioned |
| `date_confidence` | Always `expected` unless an official source URL is confirmed — never auto-set to `confirmed` |
| `color_type` | Inferred: public holiday → `public-holiday`, deadline → `deadline`, government event → `important-date` |
| `year` | Extracted from date |

### Calendar Visual Post-specific

| Field | AI action |
|---|---|
| `dates_json` | Structured array — each entry has date, label_en, label_ru, type, confidence (`expected` by default), source |
| `calendar_type` | `monthly` or `yearly` based on content scope |
| `year` and `month` | Extracted from content |
| `has_islamic_dates` | Proposed as 1 if any Islamic holiday appears in the date list — owner confirms |
| `en_notes` | Islamic disclaimer drafted if `has_islamic_dates` is proposed as 1 |
| `official_source_url` | Extracted from input |

---

## 11. Manual Override Fields

All current form fields remain. They do not disappear. They are the canonical save mechanism.

In the AI-first UX, they move to a collapsible section labelled:

> **Advanced structured fields** — All fields are editable. AI-generated values are pre-filled. Changes here are saved to the database directly on "Save draft."

Behavior:
- Collapsed by default when creating a new draft via the AI panel.
- Auto-expanded after AI generates a draft so the owner can review field by field.
- Always visible and fully expanded on the edit page for an existing draft.
- No field is locked. Any AI value can be overwritten.
- The same publish validation gates apply regardless of how a field was populated.

Fields that will most often need manual review before publish:
- `slug` — AI may include words that reduce SEO clarity
- `date_confidence` — never auto-promote to `confirmed` without a verified official source URL
- `dates_json` — each entry requires source verification for compliance content
- `last_verified_date` — must be set manually after human verification
- `official_source_url` — AI can propose a domain but cannot verify the current page state
- `en_body` — AI drafts may include unverified penalty amounts or regulatory claims

---

## 12. Category and Taxonomy

The current admin uses narrow, schema-level category values per content type. These work but are too granular for a growing content library.

### Proposed unified category taxonomy

| Value | Label | Primary use |
|---|---|---|
| `visa` | Visa | Residency, employment, golden, dependent, digital nomad |
| `company` | Company & Business | Company setup, trade license, free zone, mainland |
| `tax` | Tax & Finance | Corporate tax, VAT, e-invoicing, accounting, audit |
| `government` | Government | Government procedures, Emirates ID, attestation |
| `banking` | Banking | Business and personal bank accounts |
| `property` | Property | Real estate, DLD, RERA, ownership, mortgage |
| `tourism` | Tourism | Holiday homes, DTCM permits, tourist visas, attractions |
| `public-holidays` | Public Holidays | UAE national and religious public holidays |
| `business-compliance` | Business Compliance | AML, ILOE, regulatory deadlines, compliance calendars |
| `schools` | Schools & Nursery | School enrollment, curriculum, private education, nursery |
| `dubai-life` | Dubai Life Setup | Neighborhoods, transport, utilities, cost of living |
| `transport` | Transport | RTA, driving license, Nol card, metro, road rules |
| `family` | Family | Newborn, child visa, spouse visa, family health |
| `pets` | Pets | Pet import, vaccination, residence with pets |
| `events` | Events | Dubai events, government ceremonies, international conferences |
| `other` | Other | Catch-all for unclassified content |

Implementation note: This taxonomy applies to News and Events at minimum. Calendar Visual Posts may use a subset. Guides use the existing 5-value taxonomy defined in CLAUDE.md and `GuideFormFields.tsx` — those are locked and not changed here. The broader taxonomy above applies to the new content types only.

---

## 13. RU and SEO Automation

### Russian content

Current state: All Russian fields must be manually typed. There is no AI assistance.

Target state: RU is AI-generated on request or when "Prepare RU also" is in the owner's instructions.

Rules:
- RU is generated after EN draft is reviewed — not simultaneously with the first pass.
- AI follows the Guidex RU writing rules from Section 9.5 and `content-style-guide-ru-en.md`.
- `ru_published` defaults to `0` — RU is never auto-published. Owner sets it to 1 explicitly.
- No EN fallback in the public site. If `ru_title` or `ru_body` is empty, the RU route returns 404. This rule does not change.
- AI-generated RU is a draft starting point — not publish-ready. Human must review before enabling `ru_published`.
- If `has_islamic_dates = 1`, the Islamic disclaimer in `ru_notes` is AI-translated from `en_notes` — owner confirms.

### SEO fields

Current state: `en_seo_title` and `en_meta_description` must be manually typed.

Target state: AI generates both from the EN body and title, per the SEO rules in Section 9.4.

Rules:
- SEO title: AI follows Guidex title rules — specific, searchable, no "Ultimate Guide" framing, under 60 chars.
- Meta description: 1–2 sentences, states the process type and key specifics, under 160 chars.
- RU SEO title and meta: AI-translated from EN SEO fields.
- Human can override all SEO fields before saving.
- Publish gate still enforces that SEO fields are non-empty — the AI default removes the most common publish blocker.

---

## 14. Daily Digest Example

This example illustrates how Mode A (auto digest) and Mode B (manual input) appear together in the AI Inbox in a single day.

---

**Daily UAE / Dubai Digest — 14 May 2026**

---

**Auto-found — Item 1**

**UAE Legal Update: Age of Full Legal Capacity Set to 18**

Summary: A new Cabinet Decision aligns UAE civil legal capacity with international norms. Previously 21.

Source: WAM (official news agency) / Source type: Government  
Source reliability: High — but requires Federal Decree-Law confirmation  
Suggested type: News Post  
Risk: **High** — legal/compliance claim. Penalty/age rules affect visa, employment, and contract law.  
SEO opportunity: "UAE legal age of majority" — low competition, moderate search volume  
Verification needed: Confirm Cabinet Decision number and effective date on official portal  
Recommended action: Create News draft — do not publish until official decree URL is confirmed  

☐ Select for drafting

---

**Auto-found — Item 2**

**The Macallan Event at Rose Bar — 19 May 2026**

Summary: Limited whisky tasting event at the Rose Bar, Grosvenor House. 19 May only.

Source: Event listing / Source type: Venue  
Source reliability: Medium — listing site, no official press release found  
Suggested type: Event  
Risk: **Low** — lifestyle/events content. No regulatory claim.  
SEO opportunity: Low. Niche audience. Consider if Guidex covers lifestyle events.  
Verification needed: Confirm date and venue contact  
Recommended action: Create Event entry if Guidex covers Dubai lifestyle events. Otherwise Ignore.  

☐ Select for drafting

---

**Manual input — Item 3**

Owner pasted: `https://[news-site]/le-piaf-opens-jumeirah-emirates-towers`

AI analysis:

**Le Piaf Restaurant Opens at Jumeirah Emirates Towers**

Summary: French restaurant Le Piaf has opened in Jumeirah Emirates Towers. Reservations open.

Source: Media article / Source type: Media  
Source reliability: Medium — media report, venue not yet confirmed via official JET communication  
Suggested type: **News + Event** — short News Post about the opening, plus an Event entry if a soft opening date is confirmed  
Risk: **Low** — lifestyle/venue content  
SEO opportunity: "French restaurant Dubai Emirates Towers" — moderate local search interest  
Verification needed: Confirm opening date and whether Guidex covers restaurant openings  
Recommended action: Create short News draft. Create Event only if confirmed opening date is available. Check: does Guidex cover lifestyle/dining? If not, Ignore.  

☐ Select for drafting

---

Owner selects Items 1 and 3 (skips Item 2). Clicks "Create draft" on Item 1. AI enters Pass 2 and generates the full News draft. Owner reviews, refines with: "add source caution at the end." AI revises. Owner saves draft. Item 1 is now in the News draft queue, status: draft, noindex: 1.

---

## 15. What Remains Manual

Even with full AI assistance, the following decisions and actions are always performed by the owner. They are not automatable and must not be automated.

| Action | Why it must be manual |
|---|---|
| Selecting which digest items to develop | Editorial judgement. AI surfaces options; human decides what matters. |
| Approving source reliability | Only the owner can decide whether a media or Telegram source is trustworthy enough for this specific claim. |
| Confirming official/legal/compliance claims | Penalty amounts, deadlines, visa rules, tax thresholds — all must be verified against a current official URL by a human. |
| Setting `date_confidence = confirmed` | This is a legal and reputational claim. AI never sets it. Owner sets it only after verifying the official source. |
| Setting `last_verified_date` | Owner sets this after personally checking the official source. Not inferrable from input. |
| Approving the RU draft | AI generates RU; owner reviews tone, accuracy, and completeness before enabling `ru_published`. |
| Setting `ru_published = 1` | Explicit owner decision. Never auto-set. |
| Removing noindex | Owner decision made after content quality review. AI recommends; owner decides. |
| Final publish | The publish button is always clicked by a human. There is no autopublish trigger in any phase. |
| Homepage feature flag | Whether a news post, event, or calendar page is featured on the homepage is always an explicit owner decision. |
| Deploy to production | A separate, explicitly approved action. AI cannot trigger a production deploy. |

---

## 16. Delete and Archive Policy

### Current policy (in effect)

Archive is the only removal action available in the admin. No hard delete exists. This is intentional — archived rows remain in the DB for audit and potential recovery. The public site never shows archived rows.

### Target policy (future)

| Action | Who | Trigger | Audit log |
|---|---|---|---|
| Archive | Owner | One-click in status panel | Not yet implemented — `updatedAt` timestamp serves as implicit record |
| Hard delete | Owner only | Explicit confirmation modal — "Type DELETE to confirm" | Required before implementing — must log id, slug, content type, and timestamp |

Rules for hard delete (not yet implemented — Phase 4B or later):
- Only available to the Owner role (not future Editor roles).
- Requires a typed confirmation — not a checkbox.
- Writes a deletion record to an audit log table before executing the DELETE.
- Not available for published rows — must archive first, then delete from archived state.
- Not available from the list page — only from the individual edit page.
- Never implemented as a bulk action.

Until an audit log table exists, hard delete is not implemented. Archive remains the only removal path.

---

## 17. Old Admin Transition

The old guide admin at `/admin/guides` remains the active workflow for creating and editing guides.

Do not delete or disable the old guide admin until:
- `/admin/content/guides` is built and QA-verified.
- All existing guide editing functionality (steps, publish, slug, bilingual fields) is confirmed working in the new admin.
- The owner has reviewed and approved the new guide edit workflow.

Current plan:
- The old admin stays indefinitely until a new guide admin is explicitly commissioned and approved.
- No changes are made to `app/admin/guides`, `app/admin/actions.ts`, or the guide-related components during Phase 4B.
- Phase 4B focuses only on adding AI draft assistance to News, Events, and Calendar Visual Posts — not guides.

---

## 18. Implementation Path

Each phase adds one capability. No phase skips ahead. No phase auto-publishes. Every phase requires a separate approved specification before any code is written.

| Phase | Name | Scope |
|---|---|---|
| **4B-1** | Manual input AI draft — News | "Generate draft" panel on `/admin/content/news/new`. Owner pastes input, AI returns pre-filled NewsForm fields. No RU. No auto-save. No publish. |
| **4B-2** | Manual input AI draft — Events | Same panel on `/admin/content/events/new`. Adds event_date_start, event_date_end, date_confidence (always `expected`), color_type, year. AI never sets `confirmed`. |
| **4B-3** | Manual input AI draft — Calendar Visual Posts | Same panel on `/admin/content/calendar/new`. Adds dates_json generation. AI never sets `last_verified_date`. |
| **4B-4** | AI chat refinement | Small refinement prompt panel on the edit page for news, events, and calendar. Owner types instruction. AI revises specific fields. No auto-save. |
| **4B-5** | Daily digest — manual trigger | AI Inbox page at `/admin/content/inbox`. Owner clicks "Run digest." AI scans approved source list, returns digest cards. Owner selects items. Selected items enter draft workflow. |
| **4B-6** | Scheduled daily digest | Automated daily run of the digest. Same output as 4B-5. Owner still selects from cards. No autopublish at any point. |
| **4B-7** | Source registry and reliability scoring | Admin page for managing approved source list. Each source has type, reliability tier, coverage area. Used by digest classification engine. |
| **4B-8** | Selected digest items become drafts | One-click flow: owner selects a digest card → AI generates full structured draft → pre-fills form → owner reviews → saves. Connects Mode A output to the structured editor. |

**Dependencies:**
- 4B-1 requires: Claude API key in `.env.local`, Anthropic SDK installed, new Server Action (no DB schema change).
- 4B-5 requires: source registry (or a static source list), AI Inbox route, card UI.
- 4B-6 requires: 4B-5 complete, cron or scheduled trigger infrastructure.
- 4B-7 requires: new DB table for sources.
- 4B-8 requires: 4B-5 and at least one of 4B-1/4B-2/4B-3 complete.

**What 4B never includes:** autopublish, hard delete without audit log, AI editing code, sitemap automation, production deploy trigger, bulk generation.

---

## 19. What Not to Do

The following capabilities are explicitly out of scope and must not be added without a separate approved specification:

| Capability | Reason |
|---|---|
| Autopublish | All content requires human approval before publish. No exception for AI-generated content. |
| Source monitoring / RSS auto-ingestion | No fully automated content ingestion. All digest runs are owner-triggered or scheduled with owner review before any draft is saved. |
| Hard delete | Audit log infrastructure does not exist yet. Archive is sufficient. |
| AI editing code | AI can draft copy. AI must not edit routes, components, DB schema, or server actions. |
| Sitemap automation | Sitemap is manually curated. AI-drafted pages are noindex until the owner explicitly removes noindex and approves sitemap inclusion. |
| Bulk AI generation | One draft at a time. No bulk processing of keyword lists or URL batches. |
| Production deploy of AI features | All Phase 4B features are local-only until a separate deploy approval is given. |
| AI-generated images | Out of scope. Images are manual file paths only. No DALL-E, Stable Diffusion, or any AI image generation. |
| Automatic RU publish | `ru_published` is always set manually by the owner. AI generates RU draft only. |
| External API publishing | No cross-posting to social media, newsletter platforms, or third-party services via API. |
| Scraping private/restricted channels | Telegram channels, gated forums, or paywalled sites must not be scraped. |

---

## Appendix A: Field-Level AI vs. Manual Decision Matrix

| Field | AI generates | Human reviews | Manual action required before publish |
|---|---|---|---|
| `slug` | Yes | Yes | If SEO clarity is poor |
| `category` | Yes | Yes | If misclassified |
| `tags_json` | Yes | Optional | No — not publish-gated |
| `en_title` | Yes | Yes | If vague or violates title rules |
| `en_summary` | Yes | Yes | If over 2 sentences or unclear |
| `en_body` | Yes | Yes | Always — verify facts, penalties, official terms |
| `en_seo_title` | Yes | Optional | If over 60 chars |
| `en_meta_description` | Yes | Optional | If over 160 chars |
| `ru_title` | Yes (on request) | Yes | Required if ru_published = 1 |
| `ru_body` | Yes (on request) | Yes | Required if ru_published = 1 |
| `ru_seo_title` | Yes (on request) | Optional | Required if ru_published = 1 |
| `source_url` | Extracted from input | Yes | Required for confirmed events |
| `source_label` | Yes | Optional | No — not publish-gated |
| `date_confidence` | Proposed as `expected` | Yes | **Never auto-set to `confirmed`** |
| `event_date_start` | Extracted from input | Yes | Required for event publish |
| `dates_json` | AI structures from input | Yes — each entry | Required for calendar publish |
| `official_source_url` | Extracted from input | Yes | Required for calendar publish |
| `last_verified_date` | **Never** | Owner only | Required for calendar publish |
| `image_path` | **Never** | Owner only | Required for calendar publish |
| `image_alt` | **Never** | Owner only | Required if image_path set |
| `has_islamic_dates` | Proposed — not confirmed | Owner confirms | Required before publish |
| `ru_published` | **Never** | Owner only | Owner sets explicitly |
| `noindex` | Default: 1 on all drafts | Owner sets to 0 | Owner decision on every publish |

---

## Appendix B: Digest Card Field Reference

| Card field | Source | Purpose |
|---|---|---|
| Headline suggestion | AI from input | Candidate title — not final |
| Short summary | AI from input | 1–2 sentences about what this is |
| Source link | Extracted or inferred | URL for verification |
| Source type | AI classified | official / media / Telegram / venue / other |
| Source reliability | AI assessed | high / medium / low / unverified |
| Suggested content type | AI classified | News / Event / Calendar / Guide / Service / Area / Ignore |
| SEO opportunity | AI assessed | Short note on search interest |
| Risk level | AI assessed | low / medium / high |
| Verification needed | AI listed | Specific unconfirmed claims |
| Recommended action | AI recommended | Create draft / update existing / monitor / ignore |
| Select for drafting | Owner action | Checkbox — triggers Pass 2 |

---

*This document is internal planning material. It does not represent committed product scope. Implementation of any Phase 4B capability requires a separate approved specification before code is written.*
