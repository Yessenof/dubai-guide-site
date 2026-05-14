# Phase 4B-2 — AI Runtime Integration Plan

**Status:** Planning only. No code implemented yet.
**Scope:** Anthropic Claude API integration into `/admin/content/ai-inbox` only.
**Author:** Phase 4B-2A planning session, May 2026.

---

## 1. Executive Summary

### What Phase 4B-2 will add

- Real Anthropic Claude API calls behind `AI_EDITOR_ENABLED=true` feature flag
- Server-side `classifyInputAction` — replaces the current deterministic keyword classifier with an AI-powered classification that returns type, confidence, source reliability, risk level, detected dates, and reasoning
- Server-side `generateDraftAction` — takes the classified input and returns a fully structured EN + RU draft with SEO fields, slug, category, tags, image direction, missing fields checklist, and publish readiness assessment
- Server-side `refineDraftAction` — takes the current structured draft and an owner prompt, returns a revised draft with a change summary
- Updated `AiInboxClient` to show AI-generated content instead of the current placeholder draft preview
- Per-action token budgets and a daily call limiter enforced at the server action layer
- Admin-visible error states for: API key missing, model unavailable, input too long, rate limit hit, malformed output

### What Phase 4B-2 will NOT add

- No autopublish under any circumstances
- No background AI jobs or scheduled scans
- No Daily Digest live scanning (planned 4B-4)
- No image generation API (planned 4B-3)
- No Telegram live integration
- No public-facing AI endpoints
- No AI access to DB schema or code
- No AI access to production infrastructure
- No RU auto-publish (RU fields saved as draft only, `ru_published` remains 0)
- No DB schema changes (existing tables handle all AI output)
- No changes to sitemap, homepage, GTM/GA4, proxy.ts, or lib/auth.ts

### Why runtime integration must be server-side only

The Anthropic API key is a secret. Next.js Server Actions (`"use server"`) execute exclusively on the server — the API key never touches the client bundle. Any approach involving client-side fetch to the Anthropic API would expose the key in the browser. The pattern is: browser → Server Action → Anthropic API → structured response → browser renders result. The key exists only in server memory during the request.

### Why autopublish remains forbidden

The publish gates in `validateNewsPublish`, `validateEventPublish`, and `validateCalendarPublish` exist because UAE government policy content carries legal and reputational risk. Human review is the only acceptable publish trigger. The AI prepares; the owner decides. This is a permanent rule, not a temporary limitation.

---

## 2. Current Admin Architecture Recap

### Routes

| Route | Role |
|---|---|
| `/admin/content` | AI-first dashboard — hero block, draft counts, demoted manual links |
| `/admin/content/ai-inbox` | Primary editorial workflow — input → classify → draft → save |
| `/admin/content/news` | News draft library — list + "Create with AI" / "Advanced manual draft" |
| `/admin/content/events` | Events draft library |
| `/admin/content/calendar` | Calendar visual posts library |
| `/admin/content/news/[id]` | Advanced manual editor with amber warning notice |
| `/admin/content/events/[id]` | Advanced manual editor |
| `/admin/content/calendar/[id]` | Advanced manual editor |

### Key Files (Current State)

| File | Role |
|---|---|
| `app/admin/content/ai-inbox/page.tsx` | Server wrapper — reads `save_error` searchParam |
| `app/admin/content/ai-inbox/_components/AiInboxClient.tsx` | Client component — input phase + draft preview phase (currently placeholder) |
| `app/admin/content/ai-inbox/actions.ts` | Server actions — `saveAsNewsDraftAction`, `saveAsEventDraftAction`, `saveAsCalendarDraftAction` |
| `lib/db/news-events-calendar-admin.ts` | Writer functions — `createNewsDraft`, `createEventDraft`, `createCalendarDraft`, `updateNewsDraft`, etc. |
| `lib/admin-validation/news-events-calendar.ts` | Validation — `validateNewsDraft`, `validateNewsPublish`, `NewsInput`, `EventInput`, `CalendarInput` types |

### Current AiInboxClient Flow

1. **Input phase** (full width): type selector, textarea, source URL, owner instruction, "Classify & prepare draft" button
2. **Draft phase** (two-column): LEFT shows AI Draft Preview card + detected metadata + image direction + RU placeholder + missing fields. RIGHT shows Classification card + save action forms + override section + refinement placeholder (disabled).
3. Classification is currently a local deterministic keyword function. The draft preview is placeholder text. Both will be replaced by real AI calls in 4B-2.

### Existing Validation Gates (MUST NOT be weakened)

- `validateNewsDraft` — requires slug + en_title + no em-dashes
- `validateNewsPublish` — requires source_url, en_summary (1-2 sentences), en_body (≥150 words), en_seo_title, en_meta_description, valid category, valid dates
- `validateEventPublish` — requires source_url (when confirmed), en_body, SEO fields, valid date_confidence
- `validateCalendarPublish` — requires official_source_url, last_verified_date, image_path, image_alt, en_seo_title, en_meta_description, dates_json (≥1 entry), en_body

---

## 3. Recommended AI Provider and Runtime Approach

### Provider: Anthropic Claude API

**Rationale:** The project already runs on Claude Code (Anthropic). Using Claude as the editorial AI ensures consistency with the project toolchain, access to the latest models (Opus 4.7, Sonnet 4.6, Haiku 4.5), and a single vendor relationship. Claude's instruction-following for structured JSON output is well-suited to the editorial draft schema.

**Model recommendation:**
- Classification: `claude-haiku-4-5-20251001` — fast, low cost, sufficient for classify-only calls
- Draft generation: `claude-sonnet-4-6` — good balance of quality and cost for full EN+RU draft generation
- Refinement: `claude-sonnet-4-6` — same as draft generation
- Allow override via `AI_EDITOR_MODEL` env var so the owner can switch to Opus for higher-quality drafts if needed

### Environment Variables (planning only — do not add to code in this phase)

```
# Required for AI runtime
ANTHROPIC_API_KEY=sk-ant-...

# Feature flag — false by default, owner sets to true when ready
AI_EDITOR_ENABLED=true

# Model for classification (fast/cheap)
AI_EDITOR_CLASSIFY_MODEL=claude-haiku-4-5-20251001

# Model for draft generation and refinement
AI_EDITOR_DRAFT_MODEL=claude-sonnet-4-6

# Input safety limit in characters (prevents runaway token costs)
AI_EDITOR_MAX_INPUT_CHARS=8000

# Output token budget per action
AI_EDITOR_MAX_OUTPUT_TOKENS=4096

# Daily call ceiling across all AI actions (0 = unlimited)
AI_EDITOR_DAILY_LIMIT=100
```

### Usage Rules

- `ANTHROPIC_API_KEY` lives in `.env.local` locally and in Cloudways environment variables on production
- Never committed to git (`.env.local` is in `.gitignore`)
- Never passed to client components or included in any Next.js public variable (`NEXT_PUBLIC_*`)
- Accessed exclusively inside `"use server"` functions
- Never logged, never included in error messages shown to browser

### Runtime Wrapper Location

New file: `lib/ai/editor-runtime.ts`

This module:
- Reads `ANTHROPIC_API_KEY` from `process.env` at call time
- Returns a structured error if `AI_EDITOR_ENABLED !== "true"` or key is missing
- Wraps `@anthropic-ai/sdk` `messages.create()` call
- Enforces `AI_EDITOR_MAX_INPUT_CHARS` and `AI_EDITOR_MAX_OUTPUT_TOKENS`
- Parses JSON from `content[0].text` with a safe try/catch
- Never throws to the caller — returns `{ ok: false, error: string }` on failure

---

## 4. Runtime Security Rules

### Authentication Check

Every new AI server action must verify the caller is an authenticated admin session before making any API call. Pattern (using NextAuth):

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function classifyInputAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { ok: false, error: "Unauthorized." };
  // ... proceed
}
```

No AI action may be called from a public page or unauthenticated route.

### No Public AI Endpoint

No API route (`app/api/*`) should expose AI calls. All AI actions are Server Actions only — they execute in response to form submissions from authenticated admin pages.

### Input Sanitization

- Truncate `mainInput` to `AI_EDITOR_MAX_INPUT_CHARS` characters before sending to API
- Strip null bytes from all string inputs
- Do not pass file system paths, DB connection strings, or env variable names into prompts
- Reject inputs that contain `<script`, `javascript:`, or SQL injection patterns (log and return error, do not send to API)

### Output Validation

- Always parse AI output as JSON with `try/catch` — never `JSON.parse()` unguarded
- Validate required fields are present before accepting the output
- Reject any output containing em-dashes (`—`) in title, summary, or SEO fields
- Reject slug output that fails the existing `checkSlug()` validation
- Normalize all date strings to ISO 8601 (`YYYY-MM-DD`) before passing to DB
- Cap string field lengths: title ≤ 100 chars, SEO title ≤ 60 chars, meta description ≤ 160 chars, slug ≤ 80 chars

### Rate Limit Strategy

Phase 4B-2 MVP: simple in-memory daily counter per server process. For production hardening (4B-3+), move to SQLite-backed `ai_generation_logs` table.

```typescript
// lib/ai/editor-runtime.ts — MVP rate limit
let dailyCallCount = 0;
let dailyCallDate = "";

function checkDailyLimit(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (dailyCallDate !== today) { dailyCallCount = 0; dailyCallDate = today; }
  const limit = parseInt(process.env.AI_EDITOR_DAILY_LIMIT || "0");
  if (limit > 0 && dailyCallCount >= limit) return false;
  dailyCallCount++;
  return true;
}
```

Note: in-memory counter resets on PM2 restart. Acceptable for MVP; upgrade to DB-backed in 4B-4.

### No Secrets in Logs

- Never `console.log` the full prompt, API response, or any env variable value
- Log only: action name, content type, success/failure, token count (from API response usage)
- Use `console.error` for structured failures: `{ action, error: e.message }` — never `e.stack` in production

---

## 5. Cost and Token Control Strategy

### Per-Action Budgets

| Action | Input Char Limit | Max Output Tokens | Estimated Cost (Sonnet 4.6) |
|---|---|---|---|
| `classifyInputAction` | 8,000 chars | 512 tokens | ~$0.003 |
| `generateDraftAction` | 8,000 chars | 4,096 tokens | ~$0.025 |
| `refineDraftAction` | 12,000 chars (draft + prompt) | 4,096 tokens | ~$0.025 |

### Button Disable States

- All AI action buttons disabled when `AI_EDITOR_ENABLED !== "true"` (show "AI not connected" badge — already implemented in 4B-1 shell)
- Disable "Generate Draft" if mainInput is empty or under 10 characters
- Disable "Refine" if no generated draft exists in component state
- Disable all AI buttons during in-flight request (loading spinner state)
- Disable all AI buttons if daily limit is reached (show admin-visible error: "Daily AI limit reached. Resets midnight UTC.")

### Avoid Repeated Calls

- Generated draft stored in React state after first call — do not re-call classify on navigation within draft phase
- Refinement replaces draft in state — owner can refine multiple times but each is a separate explicit action
- No automatic re-classify on input change — only on explicit button click
- No background polling or useEffect-triggered AI calls

### No Background AI Calls

Phase 4B-2: zero background jobs, zero scheduled scanning, zero webhook triggers. All AI calls are explicit button-initiated actions by the authenticated owner.

---

## 6. AI Action Types

### A. `classifyInputAction`

**File:** `app/admin/content/ai-inbox/actions.ts`

**Input (FormData fields):**
```
inputType: string          // one of the 9 InputType values
mainInput: string          // raw text/URL/pasted content
sourceUrl: string          // optional source URL
ownerInstruction: string   // optional guidance from owner
```

**Returned shape:**
```typescript
type ClassifyResult = {
  ok: true;
  suggestedType: "news" | "event" | "calendar" | "guide-update" | "service" | "ignore";
  confidence: "high" | "medium" | "low";
  sourceReliability: "official" | "trusted_media" | "public_social_signal" | "internal_note" | "unknown";
  riskLevel: "high" | "medium" | "low";
  verificationRequired: boolean;
  reason: string;              // 1-2 sentence explanation
  detectedDates: string[];     // ISO 8601 dates found in input
  sourceNotes: string;         // e.g. "Domain is .gov.ae — classified as official"
} | {
  ok: false;
  error: string;
}
```

**Flow:**
1. Verify session
2. Check `AI_EDITOR_ENABLED`
3. Check daily limit
4. Truncate input to `AI_EDITOR_MAX_INPUT_CHARS`
5. Call `lib/ai/editor-runtime.ts` with classification prompt
6. Parse and validate JSON response
7. Return `ClassifyResult`

### B. `generateDraftAction`

**File:** `app/admin/content/ai-inbox/actions.ts`

**Input (FormData fields):**
```
inputType: string
mainInput: string
sourceUrl: string
ownerInstruction: string
suggestedType: string   // from classifyInputAction result
```

**Returned shape:**
```typescript
type GenerateDraftResult = {
  ok: true;
  contentType: "news" | "event" | "calendar";
  draft: NewsDraftOutput | EventDraftOutput | CalendarDraftOutput;
  publishReadiness: "ready" | "needs_review" | "incomplete";
  missingFields: string[];
  verificationNotes: string;
  imageDirection: string;
  imagePrompt: string;
} | {
  ok: false;
  error: string;
}
```

**Flow:**
1. Verify session
2. Check `AI_EDITOR_ENABLED`
3. Check daily limit (costs more tokens — counts as 1 call regardless)
4. Truncate input
5. Call `lib/ai/editor-runtime.ts` with draft generation prompt, schema-specific for `suggestedType`
6. Parse, validate, sanitize output
7. Return `GenerateDraftResult`

### C. `refineDraftAction`

**File:** `app/admin/content/ai-inbox/actions.ts`

**Input (FormData fields):**
```
currentDraft: string      // JSON-serialized current draft
ownerPrompt: string       // e.g. "shorten the body to 200 words and make the title more specific"
contentType: string       // "news" | "event" | "calendar"
```

**Returned shape:**
```typescript
type RefineDraftResult = {
  ok: true;
  draft: NewsDraftOutput | EventDraftOutput | CalendarDraftOutput;
  changeSummary: string;     // What was changed and why
  fieldsChanged: string[];   // e.g. ["en_title", "en_body", "en_seo_title"]
} | {
  ok: false;
  error: string;
}
```

**Flow:**
1. Verify session
2. Check `AI_EDITOR_ENABLED`
3. Check daily limit
4. Parse `currentDraft` JSON with `try/catch` (reject if invalid)
5. Combine current draft + owner prompt into refinement prompt
6. Call `lib/ai/editor-runtime.ts`
7. Parse, validate, sanitize output
8. Return `RefineDraftResult`

### D. `saveGeneratedDraftAction` (extends existing save actions)

The existing `saveAsNewsDraftAction`, `saveAsEventDraftAction`, `saveAsCalendarDraftAction` already work. For Phase 4B-2, extend them to also accept a pre-generated structured draft as hidden JSON input, so the AI Inbox can pass the full `NewsDraftOutput` directly without re-mapping every field from form inputs.

**New signature pattern:**
```typescript
export async function saveGeneratedNewsDraftAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { ok: false, error: "Unauthorized." };

  // Accept either: (a) structured draft JSON, or (b) individual form fields
  const draftJson = formData.get("_generated_draft") as string | null;
  let input: NewsInput;
  if (draftJson) {
    try { input = JSON.parse(draftJson) as NewsInput; }
    catch { return { ok: false, error: "Invalid draft JSON." }; }
  } else {
    input = buildNewsInput(formData);
  }

  // status always = draft, ru_published always = 0 — enforced here
  const result = createNewsDraft({ ...input, ru_published: 0 });
  if (!result.ok) return { errors: result.errors, warnings: result.warnings };
  redirect(`/admin/content/news/${result.id}?saved=ai-inbox`);
}
```

---

## 7. JSON Schema Design

### 7.1 Classification Result Schema

```typescript
// lib/ai/editor-schemas.ts

export interface AiClassificationResult {
  suggestedType: "news" | "event" | "calendar" | "guide-update" | "service" | "ignore";
  confidence: "high" | "medium" | "low";
  sourceReliability: "official" | "trusted_media" | "public_social_signal" | "internal_note" | "unknown";
  riskLevel: "high" | "medium" | "low";
  verificationRequired: boolean;
  reason: string;
  detectedDates: string[];     // ISO 8601 format, e.g. ["2026-12-02"]
  sourceNotes: string;
}

// Validation
function validateClassificationResult(raw: unknown): AiClassificationResult {
  if (!raw || typeof raw !== "object") throw new Error("Not an object");
  const r = raw as Record<string, unknown>;
  const validTypes = ["news","event","calendar","guide-update","service","ignore"];
  const validConf = ["high","medium","low"];
  const validRel = ["official","trusted_media","public_social_signal","internal_note","unknown"];
  const validRisk = ["high","medium","low"];
  if (!validTypes.includes(String(r.suggestedType))) throw new Error("Invalid suggestedType");
  if (!validConf.includes(String(r.confidence))) throw new Error("Invalid confidence");
  if (!validRel.includes(String(r.sourceReliability))) throw new Error("Invalid sourceReliability");
  if (!validRisk.includes(String(r.riskLevel))) throw new Error("Invalid riskLevel");
  return {
    suggestedType: r.suggestedType as AiClassificationResult["suggestedType"],
    confidence: r.confidence as AiClassificationResult["confidence"],
    sourceReliability: r.sourceReliability as AiClassificationResult["sourceReliability"],
    riskLevel: r.riskLevel as AiClassificationResult["riskLevel"],
    verificationRequired: Boolean(r.verificationRequired),
    reason: String(r.reason || "").slice(0, 500),
    detectedDates: Array.isArray(r.detectedDates)
      ? (r.detectedDates as unknown[]).map(String).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      : [],
    sourceNotes: String(r.sourceNotes || "").slice(0, 300),
  };
}
```

### 7.2 News Draft Output Schema

```typescript
export interface NewsDraftOutput {
  // Core
  slug: string;                    // kebab-case, max 80 chars
  category: "visa" | "company" | "tax" | "government" | "tourism" | "banking";
  tags: string[];                  // e.g. ["visa","uae","golden-visa"]

  // English content
  en_title: string;                // max 80 chars, no em-dashes
  en_summary: string;              // 1-2 sentences, max 300 chars
  en_body: string;                 // min 150 words when ready to publish

  // English SEO
  en_seo_title: string;            // max 60 chars
  en_meta_description: string;     // max 160 chars

  // Russian content (may be empty — never auto-publish)
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_seo_title: string;
  ru_meta_description: string;

  // Source
  source_url: string;
  source_label: "official" | "government" | "media" | "other";

  // Dates
  date_published: string;          // ISO 8601 or empty
  date_updated: string;            // ISO 8601 or empty

  // Image
  image_direction: string;         // text description for designer
  image_prompt: string;            // AI image generation prompt (for 4B-3)
  image_alt: string;               // suggested alt text

  // Publish readiness metadata (not saved to DB — used by UI only)
  publish_readiness: "ready" | "needs_review" | "incomplete";
  missing_fields: string[];
  verification_notes: string;
}
```

**Sanitization rules for News draft:**
- Strip em-dashes from title, summary, SEO title — replace with comma or colon
- `slug`: run through `slugify()` — lowercase, alphanumeric + hyphens only, max 80 chars
- `en_title`: truncate to 80 chars
- `en_seo_title`: truncate to 60 chars
- `en_meta_description`: truncate to 160 chars
- `category`: must be one of 6 allowed values — default to `"visa"` if unrecognized
- `source_label`: must be one of 4 allowed values — default to `"other"` if unrecognized
- `date_published` / `date_updated`: validate ISO 8601 with regex `^\d{4}-\d{2}-\d{2}$` — set to `""` if invalid
- `tags`: limit to 10 items, each max 30 chars, kebab-case only
- `ru_published`: always `0` — never set by AI output

### 7.3 Event Draft Output Schema

```typescript
export interface EventDraftOutput {
  // Core
  slug: string;
  category: "holiday" | "deadline" | "festival" | "government" | "school" | "dubai-event";
  color_type: "public-holiday" | "important-date" | "deadline" | "major-event";
  tags: string[];

  // Dates
  event_date_start: string;        // ISO 8601 or empty
  event_date_end: string;          // ISO 8601 or empty (omit for single-day)
  date_confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  year: number;

  // Source
  source_url: string;
  schema_eligible: 0 | 1;         // 1 only when date_confidence = "confirmed" and source_url set

  // English content
  en_title: string;
  en_summary: string;
  en_body: string;
  en_seo_title: string;
  en_meta_description: string;

  // Russian content
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_seo_title: string;
  ru_meta_description: string;

  // Image direction
  image_direction: string;
  image_prompt: string;
  image_alt: string;

  // Publish readiness metadata
  publish_readiness: "ready" | "needs_review" | "incomplete";
  missing_fields: string[];
  verification_notes: string;
}
```

**Schema_eligible rule:** AI must NOT set `schema_eligible: 1` unless `date_confidence` is `"confirmed"` and `source_url` is non-empty. The save action must enforce this regardless of AI output.

### 7.4 Calendar Visual Post Draft Output Schema

```typescript
export interface CalendarDraftOutput {
  // Core
  slug: string;
  calendar_type: "monthly" | "yearly" | "holidays" | "important_dates" | "ramadan" | "school";
  year: number;
  month: number | null;            // null for yearly

  // Verification
  official_source_url: string;
  last_verified_date: string;      // ISO 8601 or empty

  // Dates JSON — the core data payload
  dates_json: CalendarDateEntry[];

  // English content
  en_title: string;
  en_summary: string;
  en_body: string;
  en_seo_title: string;
  en_meta_description: string;
  en_notes: string;               // Islamic dates disclaimer if relevant

  // Russian content
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_seo_title: string;
  ru_meta_description: string;
  ru_notes: string;

  // Image
  image_path: string;             // suggested path — empty until actual upload
  image_alt: string;
  image_direction: string;
  image_prompt: string;

  // Publish readiness metadata
  publish_readiness: "ready" | "needs_review" | "incomplete";
  missing_fields: string[];
  verification_notes: string;
}

export interface CalendarDateEntry {
  date: string;                   // ISO 8601, e.g. "2026-12-02"
  label_en: string;
  label_ru: string;
  type: "public-holiday" | "important-date" | "deadline" | "other";
  confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  source: string;                 // URL or empty
}
```

**`dates_json` validation rules:**
- Must be an array (empty array is invalid — at least 1 entry required to publish)
- Each entry: `date` must match `^\d{4}-\d{2}-\d{2}$`
- Each entry: `type` must be one of 4 allowed values
- Each entry: `confidence` must be one of 3 allowed values
- Deduplicate by date field
- Sort by date ascending before saving

### 7.5 Refinement Result Schema

```typescript
export interface RefinementResult {
  draft: NewsDraftOutput | EventDraftOutput | CalendarDraftOutput;
  changeSummary: string;           // max 500 chars
  fieldsChanged: string[];         // e.g. ["en_title", "en_body"]
}
```

### 7.6 Fallback Behavior

If AI omits a required field: fill with `""` (string) or `[]` (array) or `0` (number).
If AI returns invalid type for a field: coerce to the expected type or use the default.
If AI output is not valid JSON: return `{ ok: false, error: "AI returned non-JSON output. Try again." }`.
If AI returns valid JSON but fails schema validation: return `{ ok: false, error: "AI output failed validation: [specific field error]." }`.

---

## 8. Prompt Architecture

### 8.1 System Prompt — Guidex Editorial AI

```
You are the editorial AI for Guidex — a premium Dubai knowledge hub for expats, business owners, and families navigating UAE procedures, events, and regulations.

Your role is to help prepare content drafts. You do NOT publish. The human owner makes all publish decisions.

TONE AND STYLE:
- Premium, practical, trustworthy.
- Facts first. Short declarative sentences.
- No em-dashes (—). Use commas, colons, or a new sentence instead.
- No theatrical framing ("This is a pivotal moment for...").
- No "best in Dubai" or superlative claims without an official source.
- No invented statistics or estimates presented as facts.
- Specific numbers when available: AED amounts, day counts, year durations, official fee schedules.
- Use official terms: MOHRE, ICA, GDRFA, Tasheel, Amer, Tawjeeh, FTA, CBUAE.

LANGUAGE RULES:
- English is the source of truth and primary language.
- Russian is the secondary language. RU must be natural idiomatic Russian — not a literal word-for-word translation. A native Russian speaker should find it natural and professional.
- Never auto-publish Russian. Return RU as a draft for human review.

SOURCE RELIABILITY RULES:
- Official government source (.gov.ae, u.ae): can support legal, procedural, and regulatory claims.
- Trusted media (The National, Khaleej Times, Gulf News, WAM, Reuters, Bloomberg): suitable for soft news, announcements, lifestyle. High-risk claims still require official source verification.
- Social/Telegram signal: draft lead only. Must warn: "Verification required before publish."
- Internal note / idea: draft seed only. Must list all missing fields.
- Unknown source: always set verificationRequired = true.

HIGH-RISK CONTENT RULES:
Topics that carry legal or reputational risk require special handling:
- Visa rules, residence requirements, permit conditions
- Tax rules, VAT, corporate tax, penalties
- Legal compliance, fines, bans, deportation
- Public holiday announcements before official confirmation
- Islamic dates (Eid, Ramadan) subject to moon sighting
- Government procedure costs and timelines
- Medical or financial advice

For high-risk content:
- Draft freely based on available information
- Always include verification_notes explaining what must be confirmed before publish
- Use hedged language when the source is not official: "Expected to be..." / "Subject to official confirmation."
- Never use confident declarative language for unconfirmed high-risk claims.

OUTPUT FORMAT:
Always respond with valid JSON only. No markdown. No explanatory text before or after the JSON object.
All string values in your output must be plain text with no HTML, no markdown, no em-dashes.
```

### 8.2 Classification Prompt

```
Classify the following content item for the Guidex Dubai content admin.

INPUT TYPE: {inputType}
SOURCE URL: {sourceUrl}
OWNER INSTRUCTION: {ownerInstruction}

CONTENT:
{mainInput}

Respond with a single JSON object matching this schema exactly:
{
  "suggestedType": "news" | "event" | "calendar" | "guide-update" | "service" | "ignore",
  "confidence": "high" | "medium" | "low",
  "sourceReliability": "official" | "trusted_media" | "public_social_signal" | "internal_note" | "unknown",
  "riskLevel": "high" | "medium" | "low",
  "verificationRequired": true | false,
  "reason": "1-2 sentence explanation of why this type was chosen.",
  "detectedDates": ["2026-12-02"],
  "sourceNotes": "Brief note about the source domain or input type reliability."
}

TYPE SELECTION GUIDE:
- news: announcement, rule change, government/media update, launch, policy change
- event: specific dated event, exhibition, festival, deadline, application window
- calendar: monthly/yearly holiday listing, compliance calendar, multi-date planning content
- guide-update: evergreen how-to, procedure change, step-by-step update
- service: paid service/execution offering (rare)
- ignore: duplicate, too promotional, unsupported, irrelevant, no UAE connection

Islamic holiday period names (Eid al Adha, Eid al Fitr, Ramadan) without a specific event listing should be classified as "calendar".
A specific dated exhibition, summit, or deadline should be classified as "event".
An official announcement of a rule change should be classified as "news".

HIGH-RISK TOPICS (set riskLevel: "high"):
visa rules, tax, legal compliance, public holidays before official confirmation, Islamic dates, government procedure costs, fees, penalties, bans, deportation.

Return JSON only. No other text.
```

### 8.3 Draft Generation Prompt

```
Generate a structured content draft for the Guidex Dubai admin system.

INPUT TYPE: {inputType}
SOURCE URL: {sourceUrl}
CONTENT TYPE: {contentType}
OWNER INSTRUCTION: {ownerInstruction}

CONTENT:
{mainInput}

Generate a complete draft matching the schema for content type: {contentType}

For type "news", return:
{
  "slug": "kebab-case-max-80-chars",
  "category": "visa" | "company" | "tax" | "government" | "tourism" | "banking",
  "tags": ["tag1", "tag2"],
  "en_title": "Title under 80 chars. No em-dashes.",
  "en_summary": "1-2 sentences. Under 300 chars. No em-dashes.",
  "en_body": "Full article body. Minimum 150 words. Short paragraphs. No em-dashes.",
  "en_seo_title": "Under 60 chars. No em-dashes.",
  "en_meta_description": "Under 160 chars.",
  "ru_title": "Russian title. Natural idiomatic Russian.",
  "ru_summary": "Russian summary.",
  "ru_body": "Russian body. Natural idiomatic Russian.",
  "ru_seo_title": "Russian SEO title under 60 chars.",
  "ru_meta_description": "Russian meta description under 160 chars.",
  "source_url": "{sourceUrl}",
  "source_label": "official" | "government" | "media" | "other",
  "date_published": "YYYY-MM-DD or empty",
  "date_updated": "YYYY-MM-DD or empty",
  "image_direction": "Description for designer: what kind of visual would work here.",
  "image_prompt": "AI image generation prompt for this content.",
  "image_alt": "Descriptive alt text for SEO and accessibility.",
  "publish_readiness": "ready" | "needs_review" | "incomplete",
  "missing_fields": ["source_url", "image_path"],
  "verification_notes": "What must be verified before publishing."
}

For type "event", return: [event schema as defined in section 7.3]
For type "calendar", return: [calendar schema as defined in section 7.4]

RULES:
- No em-dashes in any string field. Use commas, colons, or new sentences instead.
- Slug must be lowercase kebab-case, alphanumeric + hyphens only, max 80 chars.
- If source is social/Telegram/unknown, set publish_readiness: "incomplete" and list missing_fields: ["source_url", "source_verification"].
- If dates cannot be confirmed, set date_confidence: "subject_to_official_confirmation" (for events) or note it in verification_notes.
- For Islamic dates (Eid, Ramadan), always include in verification_notes: "Islamic dates subject to moon sighting. Confirm before publish."
- Return JSON only. No other text.
```

### 8.4 Refinement Prompt

```
Refine the following Guidex content draft based on the owner's instruction.

CONTENT TYPE: {contentType}
OWNER INSTRUCTION: {ownerPrompt}

CURRENT DRAFT:
{currentDraftJson}

Apply the owner's instruction to improve the draft. Keep all fields not mentioned in the instruction unchanged.
Return the full revised draft in the same JSON schema as the current draft, plus two additional fields:
- "changeSummary": "1-3 sentence summary of what was changed and why."
- "fieldsChanged": ["en_title", "en_body"]

RULES:
- No em-dashes in any string field.
- Keep slug unchanged unless explicitly asked to change it.
- Keep source_url unchanged unless explicitly asked.
- Do not set ru_published.
- Do not set status.
- Return JSON only.
```

### 8.5 Source Verification Prompt Placeholder

This prompt is reserved for Phase 4B-4 (Daily Digest + source scanning). In 4B-2, source verification is documented in `verification_notes` by the draft generation prompt. No live URL fetching is planned for 4B-2.

```
[RESERVED — Phase 4B-4]

Input: source_url, claim text
Output: { sourceVerified: boolean, sourceType: string, confidence: string, notes: string }
```

### 8.6 Image Direction Prompt

Integrated into draft generation prompt (see section 8.3 — `image_direction` and `image_prompt` fields). A standalone image direction action is reserved for 4B-3.

```
image_direction: "Describe the type of visual: photo, illustration, infographic, document screenshot. UAE context. No people. No stock photo clichés. Example: 'Clean infographic showing a 3-step visa renewal timeline on a white background with subtle Dubai skyline.'"
image_prompt: "Detailed AI image generation prompt for this specific content."
```

---

## 9. Source Reliability Model

### Labels and Definitions

| Label | Definition | Allowed Claims |
|---|---|---|
| `official` | UAE government domain (.gov.ae, u.ae, mohre.gov, gdrfa.gov, ica.gov, fta.gov, rta.ae, etc.) | Full legal, procedural, regulatory, fee claims |
| `trusted_media` | Established regional/international media (The National, Khaleej Times, Gulf News, WAM, Bloomberg, Reuters, Zawya, Arabian Business) | Soft news, announcements, business updates. High-risk claims still require official verification. |
| `public_social_signal` | Telegram channels, Twitter/X, LinkedIn posts, community groups | Draft lead only. Must warn: verification required. |
| `internal_note` | Owner's own notes, PDF summaries, screenshot annotations | Draft seed only. All facts need verification before publish. |
| `unknown` | Unrecognized domain, no URL, or unclear origin | Draft seed only. `verificationRequired: true` always. |

### Domain Detection Logic (in `editor-runtime.ts`)

```typescript
const GOV_DOMAINS = [
  "gov.ae", "u.ae", "mohre.gov", "gdrfa.gov", "ica.gov",
  "mof.gov", "fta.gov", "economy.gov", "tca.gov", "dm.gov",
  "rta.ae", "moccae.gov", "adm.gov", "dubailand.gov", "dcca.gov"
];

const MEDIA_DOMAINS = [
  "thenationalnews", "khaleejtimes", "gulfnews", "zawya",
  "arabianbusiness", "bloomberg", "reuters", "wam.ae"
];

function detectSourceReliability(sourceUrl: string, inputType: string): SourceReliability {
  const lower = sourceUrl.toLowerCase();
  if (GOV_DOMAINS.some(d => lower.includes(d))) return "official";
  if (MEDIA_DOMAINS.some(d => lower.includes(d))) return "trusted_media";
  if (inputType === "telegram-social") return "public_social_signal";
  if (["internal-idea", "screenshot-notes", "pdf-notes"].includes(inputType)) return "internal_note";
  if (sourceUrl.trim()) return "unknown";
  return "unknown";
}
```

This function runs before the AI call and is passed as context to the prompt. The AI confirms or overrides based on the full text analysis.

---

## 10. Risk Model

### High-Risk Topics (always `riskLevel: "high"`)

- Visa and residency permit rules, eligibility, requirements
- Tax regulations (VAT, corporate tax, excise, customs)
- Legal compliance, fines, bans, deportation, criminal liability
- Government procedure costs, processing timelines, official fees
- Public holidays (before official MOF/Cabinet announcement)
- Islamic dates (Eid, Ramadan, Hijri calendar) — always subject to moon sighting
- Medical, legal, or financial advice
- Prices or fees involving government entities
- Permit categories, license conditions, renewal deadlines

**For high-risk:** AI may draft. AI must warn. `verificationRequired: true`. Publisher must add `source_url` from official source before publish.

### Medium-Risk Topics (`riskLevel: "medium"`)

- Business announcements, corporate launches
- Venue/event information, exhibition details
- Market changes, real estate updates, community announcements
- Banking product updates, financial market news
- Confirmed events with official source but dynamic details (venue may change, etc.)

**For medium-risk:** AI may draft with normal confidence. Source URL recommended. Owner reviews before publish.

### Low-Risk Topics (`riskLevel: "low"`)

- Lifestyle content, cultural events, general Dubai living information
- Internal editorial ideas without factual claims
- Confirmed public holidays from official government sources
- General informational summaries of already-published official content

**For low-risk:** AI may draft confidently. Source URL still recommended but not blocking.

---

## 11. Content Type Routing Logic

The AI prompt receives this guide for type selection:

### News
Trigger words/patterns: announces, new rule, regulation, ministry, law, amendment, circular, policy update, visa rule, ICA/MOHRE/FTA/GDRFA/CBUAE announcement, government update, effective from [date] (when referring to a rule change).

### Event
Trigger patterns: specific exhibition, specific festival, specific deadline, specific summit, GITEX, Cityscape, Dubai Airshow, UAE National Day celebration event, apply by [date], cutoff [date], event date [date], last day to [action].

Note: "Eid al Adha", "Eid al Fitr", "Ramadan" without specific event details → classify as Calendar, not Event.

### Calendar Visual Post
Trigger patterns: public holidays [year], holiday calendar, compliance calendar, monthly calendar [month] [year], important dates [year], Ramadan schedule, school calendar, Eid holidays multi-date listing.

### Guide Update
Trigger patterns: how to [do X], step-by-step, procedure guide, process overview, requirements for, application process, complete guide to.

### Service
Rare. Used for paid service offering pages. Not covered in Phase 4B-2.

### Area / Dubai Life
Community, school zone, property area, relocation setup content. Not covered in Phase 4B-2.

### Ignore
Too promotional (ads, sales pitches), duplicate content, no UAE relevance, competitor content meant to be copied verbatim, content with no verifiable source.

---

## 12. Field Mapping to DB Tables

### news_posts Table ← `NewsDraftOutput`

| AI Output Field | DB Column | Notes |
|---|---|---|
| `slug` | `slug` | Validated by `checkSlug()` before write |
| `category` | `category` | Must be one of 6 allowed values |
| `tags` (array) | `tags_json` | Serialized as `JSON.stringify(tags)` |
| `en_title` | `en_title` | Max 80 chars |
| `en_summary` | `en_summary` | 1-2 sentences |
| `en_body` | `en_body` | ≥150 words before publish |
| `en_seo_title` | `en_seo_title` | Max 60 chars |
| `en_meta_description` | `en_meta_description` | Max 160 chars |
| `ru_title` | `ru_title` | Draft only |
| `ru_summary` | `ru_summary` | Draft only |
| `ru_body` | `ru_body` | Draft only |
| `ru_seo_title` | `ru_seo_title` | Draft only |
| `ru_meta_description` | `ru_meta_description` | Draft only |
| `source_url` | `source_url` | Required before publish |
| `source_label` | `source_label` | Must be one of 4 values |
| `date_published` | `date_published` | ISO 8601 |
| `date_updated` | `date_updated` | ISO 8601 |
| `image_alt` | `image_alt` | Suggested, not required for draft |
| `image_prompt` | — | UI only, not saved to DB |
| `image_direction` | — | UI only, not saved to DB |
| — | `status` | Always `"draft"` — hardcoded in writer |
| — | `ru_published` | Always `0` — hardcoded in writer |
| — | `noindex` | Default `0` — owner sets manually |
| — | `featured_homepage` | Default `0` — owner sets manually |
| — | `featured_digest` | Default `0` — owner sets manually |
| — | `image_path` | Empty — owner uploads manually |

### events Table ← `EventDraftOutput`

| AI Output Field | DB Column | Notes |
|---|---|---|
| `slug` | `slug` | Validated |
| `category` | `category` | Must be one of 6 allowed values |
| `color_type` | `color_type` | Must be one of 4 allowed values |
| `tags` (array) | `tags_json` | Serialized |
| `en_title` | `en_title` | |
| `en_summary` | `en_summary` | |
| `en_body` | `en_body` | |
| `en_seo_title` | `en_seo_title` | |
| `en_meta_description` | `en_meta_description` | |
| `ru_*` | `ru_*` | Draft only |
| `event_date_start` | `event_date_start` | ISO 8601 |
| `event_date_end` | `event_date_end` | ISO 8601 or empty |
| `date_confidence` | `date_confidence` | Must be one of 3 values |
| `year` | `year` | Number |
| `source_url` | `source_url` | Required for confirmed events |
| `schema_eligible` | `schema_eligible` | 1 only if confidence=confirmed AND source_url set |
| — | `status` | Always `"draft"` |
| — | `ru_published` | Always `0` |
| — | `featured_calendar` | Default `1` — AI may set this, owner confirms |
| — | `featured_homepage` | Default `0` |
| — | `featured_digest` | Default `0` |

### calendar_pages Table ← `CalendarDraftOutput`

| AI Output Field | DB Column | Notes |
|---|---|---|
| `slug` | `slug` | Validated |
| `calendar_type` | `calendar_type` | Must be one of 6 allowed values |
| `year` | `year` | Number |
| `month` | `month` | 1-12 or null |
| `dates_json` (array) | `dates_json` | Serialized as `JSON.stringify(dates)` |
| `official_source_url` | `official_source_url` | Required before publish |
| `last_verified_date` | `last_verified_date` | ISO 8601, required before publish |
| `en_title` | `en_title` | |
| `en_summary` | `en_summary` | |
| `en_body` | `en_body` | |
| `en_notes` | `en_notes` | Islamic dates disclaimer |
| `en_seo_title` | `en_seo_title` | |
| `en_meta_description` | `en_meta_description` | |
| `ru_*` | `ru_*` | Draft only |
| `image_alt` | `image_alt` | Suggested |
| — | `image_path` | Empty — owner uploads manually |
| — | `status` | Always `"draft"` |
| — | `ru_published` | Always `0` |
| — | `featured_homepage` | Default `0` |
| — | `has_islamic_dates` | Owner sets manually based on content |

**Critical invariant:** `status = "draft"` and `ru_published = 0` are set in the writer functions (`createNewsDraft`, `createEventDraft`, `createCalendarDraft`) and must never be overridden by AI output. The save action must strip these fields from AI output before passing to the writer, or the writer must ignore them.

---

## 13. Image Workflow Plan

### Phase 4B-2 Scope: Text Only

In Phase 4B-2, the AI generates two text fields for each content item:
- `image_direction`: a description for a human designer or photographer — e.g., "Clean infographic showing the 5-step process for renewing an employment visa. White background, subtle Dubai skyline watermark."
- `image_prompt`: a detailed prompt for an AI image generation tool — e.g., "Professional infographic, minimalist design, UAE government document with MOHRE logo, step-by-step arrows, no people, white background."

These are shown in the AI Inbox draft card (right panel) and are NOT saved to the DB. They are guidance for the owner to act on separately.

`image_path` and `image_alt` remain empty in the AI-generated draft. The owner adds them manually in the Advanced Editor after uploading the actual image.

### Phase 4B-3 Scope (Future — Not Phase 4B-2)

- Select AI image generation provider (Ideogram, DALL-E 3, Flux, Stability AI)
- Admin UI: "Generate image" button with `image_prompt` prefilled
- Generated image preview in admin
- One-click save to `/public/images/[type]/[slug].jpg`
- Auto-fill `image_path` and `image_alt` in the draft
- No external image URLs — only locally hosted images on the site

### Restrictions (permanent)

- No competitor screenshots or copyrighted images
- No stock photos of people
- No random illustration pulled from the web
- No external image CDN links in `image_path` — local paths only
- No AI image generation in 4B-2 without explicit approval

---

## 14. Daily Digest Plan Boundary

### What Daily Digest Will Be (4B-4 and beyond)

A scheduled admin workflow where:
1. A manually maintained list of approved sources (gov.ae feeds, WAM, select media) is scanned daily
2. AI classifies each item and generates a card summary
3. Admin sees a "Digest" inbox with checkbox selection
4. Owner checks/unchecks items, optionally adds instructions per item
5. One-click "Generate Draft" per selected item
6. Same save flow as manual AI Inbox

### What Phase 4B-2 Does NOT Touch

- No RSS/feed scraping
- No Telegram API integration
- No background jobs or cron-style scheduled functions
- No automatic AI calls without owner button click
- No Daily Digest inbox UI
- The "Daily Digest" card in `/admin/content` remains a placeholder with "coming soon" label

---

## 15. UI Changes Required in AiInboxClient

The current `AiInboxClient.tsx` (4B-1) has:
- Local deterministic classifier (keyword-based)
- Placeholder draft preview card
- Disabled "Refine" button
- "AI runtime not connected" badge on classify button

When runtime is enabled (`AI_EDITOR_ENABLED=true`), the following changes are needed:

### Input Phase Changes

```
[Classify & Prepare Draft] button:
  - Before: disabled with amber "AI runtime not connected" badge
  - After: enabled, shows loading spinner during API call
  - Error state: red banner with error message from classifyInputAction
```

### Between Classify and Generate

Add a new intermediate step between classify and generate (currently they are one action):
1. Owner clicks "Classify" → `classifyInputAction` runs → shows classification card with type/confidence/reliability/risk
2. Owner reviews classification → can override type in dropdown
3. Owner clicks "Generate Draft" → `generateDraftAction` runs with confirmed type → shows full draft preview

Or: combine classify + generate into one action if classify confidence is "high" (skip confirmation step). Show the classification result but proceed directly to draft. This is simpler for MVP.

**Recommendation for 4B-2B:** One-button flow with progress state: `classifying... → generating draft... → done`. Show classification result as part of the generated draft card.

### Draft Phase Changes (when AI runtime connected)

**LEFT COLUMN — AI Draft Preview card:**
- Tab switcher: `EN | RU`
- EN tab: en_title (editable inline or read-only), en_summary, en_body excerpt (first 300 chars with "show more")
- RU tab: ru_title, ru_summary, ru_body excerpt — with amber note "AI draft. Review before enabling Russian publish."
- Edit link: "Open in Advanced Editor" → links to `/admin/content/[type]/[id]?saved=ai-inbox` after save

**LEFT COLUMN — Classification card:**
- Suggested type badge, confidence dots (●●○ medium etc.), source reliability badge, risk badge
- Why: short reason from AI
- Detected dates: listed if present
- Source notes

**LEFT COLUMN — SEO Preview card:**
- en_seo_title preview (character count)
- en_meta_description preview (character count)
- Slug preview

**LEFT COLUMN — Image Direction card:**
- image_direction (text, for designer)
- image_prompt (text, for AI generation — visible but labeled "Phase 4B-3")
- image_alt suggestion

**LEFT COLUMN — Missing Fields checklist:**
- Dynamically generated from `missing_fields` array
- Each item with a red/amber dot
- "Ready to publish" badge if empty

**RIGHT COLUMN — Save actions:**
- Primary save button enabled only when `publish_readiness !== "incomplete"` OR owner explicitly accepts via checkbox "Save incomplete draft anyway"
- Save buttons disabled during in-flight request
- Success: redirect to edit page (`/admin/content/[type]/[id]?saved=ai-inbox`)

**RIGHT COLUMN — Refine prompt:**
- Now enabled (was disabled in 4B-1)
- Textarea: "Tell AI what to change..."
- "Refine Draft" button → `refineDraftAction`
- Shows `changeSummary` after refinement
- Shows `fieldsChanged` as a list

**RIGHT COLUMN — Override section:**
- `<details>` collapsible (same as 4B-1) — unchanged

### Loading States

```typescript
type AiPhase = "input" | "classifying" | "generating" | "draft" | "refining";
```

- `"classifying"`: spinner on button, textarea disabled, show "Analyzing with Claude..."
- `"generating"`: spinner on button, classification result shown, show "Generating draft..."
- `"refining"`: spinner on refine button, draft visible but overlaid with "Refining..."

---

## 16. Logging and Audit Plan

### Phase 4B-2 MVP: Minimal Server Logs

```typescript
// In each AI server action, after API call:
console.log(JSON.stringify({
  ts: new Date().toISOString(),
  action: "classifyInputAction",
  ok: result.ok,
  contentType: result.suggestedType || null,
  inputChars: mainInput.length,
  outputTokens: usage?.output_tokens || 0,
  error: result.ok ? null : result.error,
}));
// Never log: API key, full prompt, full response, owner input, draft content
```

### Future Tables (Phase 4B-4+)

```sql
-- ai_inbox_items: record of each AI Inbox submission
CREATE TABLE ai_inbox_items (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  input_type TEXT NOT NULL,
  source_url TEXT NOT NULL DEFAULT '',
  classify_result TEXT NOT NULL DEFAULT '{}',  -- JSON
  draft_result TEXT NOT NULL DEFAULT '{}',     -- JSON
  content_type TEXT NOT NULL DEFAULT '',
  saved_as_id TEXT NOT NULL DEFAULT '',        -- ID in news_posts/events/calendar_pages
  saved_as_table TEXT NOT NULL DEFAULT ''
);

-- ai_generation_logs: per-call log for cost tracking and daily limit
CREATE TABLE ai_generation_logs (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  action TEXT NOT NULL,            -- "classify" | "generate" | "refine"
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  ok INTEGER NOT NULL DEFAULT 0,
  error TEXT NOT NULL DEFAULT ''
);

-- ai_draft_versions: versioned draft history per content item
CREATE TABLE ai_draft_versions (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,        -- FK to news_posts.id / events.id / calendar_pages.id
  content_table TEXT NOT NULL,
  version INTEGER NOT NULL,
  draft_json TEXT NOT NULL,
  change_summary TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
```

These tables are NOT being created in Phase 4B-2. They are planned for 4B-4 when the audit trail becomes operationally important.

---

## 17. Error Handling Plan

### Error Catalogue

| Condition | User-visible message | Server action return |
|---|---|---|
| `AI_EDITOR_ENABLED !== "true"` | "AI runtime not connected. Enable in server config." | `{ ok: false, error: "ai_disabled" }` |
| `ANTHROPIC_API_KEY` missing | "AI service not configured. Contact admin." | `{ ok: false, error: "api_key_missing" }` |
| Daily limit reached | "Daily AI limit reached. Resets at midnight UTC." | `{ ok: false, error: "daily_limit" }` |
| Input too long | "Input exceeds {limit} characters. Trim the content and try again." | `{ ok: false, error: "input_too_long" }` |
| Model unavailable (Anthropic 503) | "AI service temporarily unavailable. Try again in a moment." | `{ ok: false, error: "model_unavailable" }` |
| Anthropic rate limit (429) | "AI service is busy. Wait 30 seconds and try again." | `{ ok: false, error: "rate_limited" }` |
| Anthropic timeout (>30s) | "AI took too long to respond. Try a shorter input." | `{ ok: false, error: "timeout" }` |
| Non-JSON AI response | "AI returned an unexpected response. Try again." | `{ ok: false, error: "invalid_json" }` |
| JSON fails schema validation | "AI output failed validation: {field}. Try again." | `{ ok: false, error: "schema_invalid" }` |
| Auth check fails | "Unauthorized." | `{ ok: false, error: "unauthorized" }` |
| Save validation fails | Same as existing error handling in `saveNewsDraftAction` etc. | Pass through from writer |

### Error Display in AiInboxClient

- Red banner at top of draft phase with the user-visible message
- "Try again" button visible to re-trigger the action
- If classify/generate failed mid-flow, return to input phase with error preserved

### Retry Safety

- Retrying classify/generate is always safe (no side effects — no DB writes)
- Retrying refine is safe if the current draft state is preserved in React state
- Save actions are idempotent for creates (new UUID per create) — retrying save creates a new draft; this is acceptable behavior and matches current flow

---

## 18. QA Plan for Phase 4B-2 Implementation

### New QA Script: `scripts/qa-phase-4b2-ai-runtime.ts`

```typescript
// Tests to implement when AI runtime is added:

// 1. AI disabled state
// When AI_EDITOR_ENABLED !== "true":
// - classifyInputAction returns { ok: false, error: "ai_disabled" }
// - generateDraftAction returns { ok: false, error: "ai_disabled" }
// - refineDraftAction returns { ok: false, error: "ai_disabled" }

// 2. Missing API key
// When ANTHROPIC_API_KEY is empty:
// - All AI actions return { ok: false, error: "api_key_missing" }

// 3. Input too long
// When mainInput.length > AI_EDITOR_MAX_INPUT_CHARS:
// - Actions return { ok: false, error: "input_too_long" }

// 4. Malformed JSON handling
// If AI returns non-JSON: action returns { ok: false, error: "invalid_json" }
// Use mock runtime that returns "not json" to test

// 5. Schema validation
// If AI returns JSON missing required fields: action returns { ok: false, error: "schema_invalid" }

// 6. Generated News draft save
// Mock AI returns valid NewsDraftOutput
// saveGeneratedNewsDraftAction saves to DB with status="draft", ru_published=0
// Verify: news_posts count increases by 1
// Verify: saved row has status="draft"
// Verify: saved row has ru_published=0
// Cleanup: delete test row

// 7. Generated Event draft save
// Same pattern as News

// 8. Generated Calendar draft save
// Same pattern — also verify dates_json is valid JSON array

// 9. Refinement flow
// Mock AI returns valid refinement result
// Verify: changeSummary is string, fieldsChanged is array

// 10. No publish via AI
// Verify no code path in AI actions calls publishNews/publishEvent/publishCalendar

// 11. ru_published always 0
// Even if AI output contains ru_published: 1, verify DB row has ru_published = 0

// 12. Public pages do not expose drafts
// Existing test in verify-news-events-calendar-admin.ts covers this — must still pass

// 13. Existing 399/399 QA scripts remain passing after AI runtime added
// Run all 5 existing QA scripts after Phase 4B-2B implementation

// 14. Build clean after Phase 4B-2B
// npm run build must pass, 86 pages (no new public routes expected)
```

### Auth Testing

- Manually test: unauthenticated HTTP POST to ai-inbox server action returns redirect to login (NextAuth handles this via middleware — verify proxy.ts still blocks `/admin/*`)

---

## 19. Deployment and Environment Plan

### Local Development (.env.local additions needed)

```bash
# Add to .env.local before testing Phase 4B-2
ANTHROPIC_API_KEY=sk-ant-api03-...
AI_EDITOR_ENABLED=true
AI_EDITOR_CLASSIFY_MODEL=claude-haiku-4-5-20251001
AI_EDITOR_DRAFT_MODEL=claude-sonnet-4-6
AI_EDITOR_MAX_INPUT_CHARS=8000
AI_EDITOR_MAX_OUTPUT_TOKENS=4096
AI_EDITOR_DAILY_LIMIT=50
```

Notes:
- Never commit `.env.local` (already in `.gitignore`)
- Keep a secure local backup of `.env.local` (already in `backups/env/`)
- The API key is separate from the Claude Code key used for development

### Production (Cloudways — separate phase)

```bash
# Add to Cloudways application environment variables
ANTHROPIC_API_KEY=sk-ant-api03-...   # Separate production key
AI_EDITOR_ENABLED=true
AI_EDITOR_CLASSIFY_MODEL=claude-haiku-4-5-20251001
AI_EDITOR_DRAFT_MODEL=claude-sonnet-4-6
AI_EDITOR_MAX_INPUT_CHARS=8000
AI_EDITOR_MAX_OUTPUT_TOKENS=4096
AI_EDITOR_DAILY_LIMIT=100
```

After adding env vars on Cloudways: must run `npm run build` and restart PM2.
This is a separate deploy step — NOT part of Phase 4B-2.

### DB Migration

No DB schema changes required for Phase 4B-2. Existing `news_posts`, `events`, `calendar_pages` tables handle all AI draft output. The future audit tables (`ai_generation_logs`, etc.) are Phase 4B-4 and will require a migration at that time.

### When to deploy

Phase 4B-2 can be deployed to production independently:
1. Push Phase 4B-2B + 4B-2C + 4B-2D commits to GitHub
2. SSH to Cloudways, `git pull`, `npm run build`, `pm2 restart app`
3. Set env vars in Cloudways dashboard
4. Test AI Inbox with one real input before announcing live

No public pages are affected. Only `/admin/content/ai-inbox` changes behavior when `AI_EDITOR_ENABLED=true`.

---

## 20. Implementation Phases Recommendation

### 4B-2B: AI Runtime Server Actions + Schemas (implement next)

Files:
- `lib/ai/editor-types.ts` — TypeScript type definitions for all AI inputs/outputs
- `lib/ai/editor-schemas.ts` — validation/parsing functions for AI output
- `lib/ai/editor-prompts.ts` — prompt template constants
- `lib/ai/editor-runtime.ts` — Anthropic API wrapper with error handling and rate limiting
- `app/admin/content/ai-inbox/actions.ts` — extend with `classifyInputAction`, `generateDraftAction`, `refineDraftAction`, `saveGeneratedNewsDraftAction`, `saveGeneratedEventDraftAction`, `saveGeneratedCalendarDraftAction`
- `scripts/qa-phase-4b2-ai-runtime.ts` — new QA script (mock runtime for tests)

**Deliverable:** All server-side AI logic implemented and QA-tested. UI shows "AI not connected" or loading state depending on `AI_EDITOR_ENABLED`. No UI changes yet.

### 4B-2C: AI Inbox UI Integration

Files:
- `app/admin/content/ai-inbox/_components/AiInboxClient.tsx` — full rewrite of draft phase to show AI-generated content, loading states, EN/RU tabs, SEO preview, image direction, refine prompt

**Deliverable:** Full AI Inbox UI flow works end-to-end when `AI_EDITOR_ENABLED=true`. Falls back to current deterministic classifier when disabled.

### 4B-2D: Save Generated Drafts Safely

Files:
- `app/admin/content/ai-inbox/actions.ts` — extend save actions to accept `_generated_draft` JSON payload
- Verify sanitization and invariants (status=draft, ru_published=0) enforced before every write

**Deliverable:** Complete Phase 4B-2 — AI Inbox classifies, generates, refines, and saves drafts correctly. Full QA pass. Build clean.

### 4B-3: Media and Image Workflow

- AI image direction text is already generated in 4B-2
- Add image generation API integration (provider TBD — needs owner approval)
- Admin "Generate image" button in edit pages and AI Inbox
- Image upload/save to `/public/images/` with path auto-fill

### 4B-4: Daily Digest Source System

- Approved source list management
- Daily scan/fetch (server-side only)
- Digest inbox cards with classification
- Checkbox batch selection
- One-click generate for selected items
- `ai_generation_logs` DB table for audit trail

### 4B-5: AI Draft History and Versioning

- `ai_inbox_items` and `ai_draft_versions` DB tables
- Edit page shows "AI draft history" panel
- Ability to restore a previous AI draft version
- Audit log of all AI generations per content item

---

## 21. Files Likely Touched in Implementation

### New Files (Phase 4B-2B)

| File | Purpose |
|---|---|
| `lib/ai/editor-types.ts` | TypeScript interfaces for all AI inputs and outputs |
| `lib/ai/editor-schemas.ts` | Validation and sanitization functions for AI JSON output |
| `lib/ai/editor-prompts.ts` | System prompt, classification prompt, generation prompt, refinement prompt as string constants |
| `lib/ai/editor-runtime.ts` | Anthropic SDK wrapper with env checks, rate limiting, JSON parsing, error normalization |
| `scripts/qa-phase-4b2-ai-runtime.ts` | QA script testing AI actions with mock runtime |

### Modified Files (Phase 4B-2B through 4B-2D)

| File | Changes |
|---|---|
| `app/admin/content/ai-inbox/actions.ts` | Add `classifyInputAction`, `generateDraftAction`, `refineDraftAction`, `saveGeneratedNewsDraftAction`, `saveGeneratedEventDraftAction`, `saveGeneratedCalendarDraftAction` |
| `app/admin/content/ai-inbox/_components/AiInboxClient.tsx` | Replace placeholder draft with AI-generated content, add loading states, EN/RU tabs, refine prompt, error states |
| `package.json` | Add `@anthropic-ai/sdk` dependency |

### Untouched in All 4B-2 Sub-phases

| Category | Files | Reason |
|---|---|---|
| Public pages | All `app/(public)/*` routes | AI is admin-only |
| DB schema | `lib/db/schema.ts` | No changes needed |
| Validation gates | `lib/admin-validation/*` | Must not be weakened |
| Writer functions | `lib/db/news-events-calendar-admin.ts` | Reused as-is |
| Auth | `lib/auth.ts`, `proxy.ts` | No changes needed |
| Public readers | `lib/db/reader.ts` | No changes needed |
| Sitemap | `app/sitemap.xml/*` | No changes |
| Homepage | `app/page.tsx` | No changes |
| GTM/GA4 | Any analytics files | No changes |
| Old guides admin | `app/admin/guides/*` | Not deleted |

---

## 22. Risks and Decisions Needed from Owner

Before implementing Phase 4B-2B, the owner should decide:

| Decision | Options | Recommendation |
|---|---|---|
| AI provider | Anthropic Claude (primary) vs OpenAI | Claude — already used for dev, single vendor |
| Classification model | Haiku 4.5 (fast/cheap) vs Sonnet 4.6 (better) | Haiku for classify, Sonnet for generate |
| Daily cost ceiling | Daily limit 50 / 100 / unlimited | Start with 50, increase once stable |
| Store AI generations? | Save prompt+output to DB vs log-only | Log-only for Phase 4B-2, DB in 4B-4 |
| Save RU draft immediately? | RU in draft on first save vs manual trigger | Save RU in draft (owner sees it in editor), ru_published=0 enforced |
| Image generation provider | Ideogram, DALL-E 3, Flux, Stability AI, manual only | Defer to Phase 4B-3 after seeing 4B-2 quality |
| Daily Digest source list | Manual owner-maintained list vs AI-suggested | Manual list first (safer), AI suggestions in 4B-4 |
| Production AI before public deploy? | Test on production admin before public site launches | Recommended — admin is gated behind auth |
| Classify + Generate: one click or two? | One-click (classify → generate in one action) vs two-click (separate steps) | One-click for MVP simplicity, unless owner wants to review classification first |

---

## 23. What Not to Touch (Permanent Restrictions)

The following are off-limits in all 4B-2 sub-phases:

- **Production server**: no SSH, no PM2 restart, no Cloudways admin
- **Production DB**: no direct DB writes, no migrations on production
- **Deploy**: no deployment until explicitly approved after 4B-2D QA
- **DB schema**: no changes to existing tables, no new tables (new tables deferred to 4B-4)
- **Sitemap**: no changes
- **Homepage**: no changes
- **GTM/GA4**: no changes
- **proxy.ts / lib/auth.ts**: no changes unless a blocking auth bug is found and reported first
- **Old admin** (`app/admin/guides/*`): not deleted, not modified
- **Autopublish**: no code path that calls `publishNews`, `publishEvent`, or `publishCalendar` from any AI action
- **Public AI endpoint**: no `app/api/` route that exposes AI calls publicly
- **Hardcoded secrets**: `ANTHROPIC_API_KEY` exists only in `.env.local` and Cloudways env — never in code
- **RU autopublish**: `ru_published` must always be `0` after any AI save action, regardless of AI output

---

## Appendix: Prompt Template Summary

### System Prompt Location
`lib/ai/editor-prompts.ts` → `GUIDEX_SYSTEM_PROMPT`

### Classification Prompt Location
`lib/ai/editor-prompts.ts` → `buildClassifyPrompt(inputType, mainInput, sourceUrl, ownerInstruction)`

### Draft Generation Prompts
`lib/ai/editor-prompts.ts` → `buildDraftPrompt(inputType, mainInput, sourceUrl, ownerInstruction, contentType)`

### Refinement Prompt
`lib/ai/editor-prompts.ts` → `buildRefinePrompt(currentDraftJson, ownerPrompt, contentType)`

### Runtime Wrapper
`lib/ai/editor-runtime.ts` → `callEditorAI(prompt: string, maxOutputTokens: number): Promise<{ ok: true; content: string } | { ok: false; error: string }>`

### Schema Validators
`lib/ai/editor-schemas.ts` → `parseClassificationResult`, `parseNewsDraft`, `parseEventDraft`, `parseCalendarDraft`, `parseRefinementResult`

---

*End of Phase 4B-2A Planning Document.*
*No code was changed. No DB was modified. No commit was made.*
*Ready for owner review and Phase 4B-2B implementation approval.*
