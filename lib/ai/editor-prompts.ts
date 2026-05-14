import type { AiInputType, AiSuggestedType, GeneratedDraft } from "./editor-types";

// ── System prompt ─────────────────────────────────────────────────────────────

export function buildSystemPrompt(): string {
  return `You are the editorial AI for Guidex — a premium Dubai knowledge hub for expats, business owners, and families navigating UAE procedures, events, and regulations.

Your role is to help prepare content drafts. You do NOT publish. The human owner makes all publish decisions.

TONE AND STYLE:
- Premium, practical, trustworthy.
- Facts first. Short declarative sentences.
- No long em-dashes (—). Use commas, colons, or a new sentence instead.
- No theatrical framing ("This is a pivotal moment for...").
- No "best in Dubai" or superlative claims without an official source.
- No invented statistics or estimates presented as facts.
- Specific numbers when available: AED amounts, day counts, year durations, official fee schedules.
- Use official terms: MOHRE, ICA, GDRFA, Tasheel, Amer, Tawjeeh, FTA, CBUAE, DLD, RTA.

LANGUAGE RULES:
- English is the source of truth and primary language.
- Russian is the secondary language. RU must be natural idiomatic Russian, not a literal word-for-word translation. A native Russian speaker must find it natural and professional.
- Never auto-publish Russian. Return RU as a draft for human review.

SOURCE RELIABILITY RULES:
- Official government source (.gov.ae, u.ae): supports legal, procedural, and regulatory claims.
- Trusted media (The National, Khaleej Times, Gulf News, WAM, Reuters, Bloomberg): suitable for soft news and announcements. High-risk claims still need official verification.
- Social/Telegram signal: draft lead only. Always warn: verification required before publish.
- Internal note/idea: draft seed only. List all missing fields.
- Unknown source: always set verificationRequired true.

HIGH-RISK TOPICS (must warn, hedge language, set verificationRequired true):
- Visa and residency permit rules, eligibility, conditions
- Tax regulations: VAT, corporate tax, excise, customs, penalties
- Legal compliance, fines, bans, deportation, criminal liability
- Government procedure costs, processing timelines, official fees
- Public holidays before official announcement
- Islamic dates subject to moon sighting (Eid al Adha, Eid al Fitr, Ramadan start/end)
- Medical, legal, or financial advice

For high-risk content: draft freely but use hedged language ("Expected to be...", "Subject to official confirmation.") and include verification_notes explaining what must be confirmed before publish.

CONTENT ROUTING RULES:
- news: announcement, rule change, government/media update, launch, policy change, regulatory development
- event: specific dated event, exhibition, festival, deadline, application window, summit, public event
- calendar: monthly/yearly holiday listing, compliance calendar, multi-date planning, public holiday schedule, Ramadan/Eid multi-date period
- guide_update: evergreen how-to, procedure change, step-by-step update
- service: paid service offering (rare)
- area_update: community, relocation, school zone, property area update
- ignore: duplicate, too promotional, no UAE relevance, unsupported, competitor copy

NOTE: "Eid al Adha" and "Eid al Fitr" without a specific event URL should be classified as calendar, not event.

OUTPUT FORMAT:
Always respond with valid JSON only. No markdown. No code fences. No explanatory text before or after the JSON object. All string values must be plain text with no HTML, no markdown, no em-dashes.`;
}

// ── Classification prompt ─────────────────────────────────────────────────────

export interface ClassificationPromptInput {
  inputType: AiInputType;
  mainInput: string;
  sourceUrl: string;
  ownerInstruction: string;
}

export function buildClassificationPrompt(input: ClassificationPromptInput): string {
  const sourceNote = input.sourceUrl.trim()
    ? `Source URL: ${input.sourceUrl.trim()}`
    : "Source URL: (none provided)";

  const instructionNote = input.ownerInstruction.trim()
    ? `Owner instruction: ${input.ownerInstruction.trim()}`
    : "";

  return `Classify the following content item for the Guidex Dubai admin system.

Input type: ${input.inputType}
${sourceNote}
${instructionNote}

Content:
${input.mainInput}

Respond with a single JSON object matching this schema exactly:

{
  "suggestedType": "news" | "event" | "calendar" | "guide_update" | "service" | "area_update" | "ignore",
  "confidence": "high" | "medium" | "low",
  "sourceReliability": "official" | "trusted_media" | "public_social_signal" | "internal_note" | "unknown",
  "riskLevel": "high" | "medium" | "low",
  "verificationRequired": true | false,
  "reason": "1-2 sentence explanation of why this type was chosen.",
  "detectedDates": ["YYYY-MM-DD"],
  "sourceNotes": "Brief note about the source domain or input type reliability."
}

TYPE SELECTION GUIDE:
- news: announcement, rule change, government/media reported development, regulatory update
- event: specific dated exhibition, festival, deadline, summit, government event, application window
- calendar: multi-date holiday listing, compliance calendar, Ramadan/Eid period schedule, monthly/yearly date overview
- guide_update: evergreen how-to, step-by-step process, procedure explanation
- ignore: promotional, duplicate, off-topic, no UAE relevance

HIGH-RISK TOPICS — set riskLevel "high":
visa rules, tax, legal compliance, public holidays before official confirmation, Islamic dates, government fees and penalties.

LOW-RISK TOPICS — set riskLevel "low":
confirmed public holidays from official sources, general lifestyle content, cultural events from verified sources.

Return JSON only. No other text.`;
}

// ── Draft generation prompts ──────────────────────────────────────────────────

export interface DraftGenerationPromptInput {
  inputType: AiInputType;
  mainInput: string;
  sourceUrl: string;
  ownerInstruction: string;
  contentType: "news" | "event" | "calendar";
  sourceReliability: string;
  riskLevel: string;
  detectedDates: string[];
}

export function buildDraftGenerationPrompt(input: DraftGenerationPromptInput): string {
  const sourceNote = input.sourceUrl.trim()
    ? `Source URL: ${input.sourceUrl.trim()}`
    : "Source URL: (none provided)";

  const instructionNote = input.ownerInstruction.trim()
    ? `Owner instruction: ${input.ownerInstruction.trim()}`
    : "";

  const datesNote = input.detectedDates.length > 0
    ? `Detected dates from classification: ${input.detectedDates.join(", ")}`
    : "";

  const riskWarning = input.riskLevel === "high"
    ? `\nRISK LEVEL: HIGH. Use hedged language for unconfirmed facts. Set verificationRequired and include detailed verification_notes.\n`
    : "";

  const schema = contentTypeSchema(input.contentType);

  return `Generate a structured content draft for the Guidex Dubai admin system.

Input type: ${input.inputType}
Content type to generate: ${input.contentType}
Source reliability: ${input.sourceReliability}
${sourceNote}
${datesNote}
${instructionNote}
${riskWarning}
Content:
${input.mainInput}

Generate a complete draft matching this JSON schema exactly:

${schema}

RULES:
- No em-dashes (—) in any string field. Use commas, colons, or new sentences instead.
- Slug must be lowercase kebab-case, alphanumeric and hyphens only, max 70 characters.
- en_title max 80 characters.
- en_seo_title max 60 characters.
- en_meta_description max 160 characters.
- en_summary: 1-2 sentences, max 300 characters.
- en_body: minimum 150 words. Short paragraphs. Practical, facts-first writing.
- RU fields: natural idiomatic Russian, not literal translation. Professional tone.
- tags: array of lowercase kebab-case strings, max 10 items.
- source_url: use the provided source URL or empty string if none.
- date fields: YYYY-MM-DD format or empty string.
- For Islamic dates or unconfirmed public holidays: always add "Islamic dates subject to moon sighting. Confirm before publish." to verification_notes.
- If source is social signal or unknown: set publish_readiness "incomplete", add source_url to missing_fields.
- Set publish_readiness "ready" only if all required fields are filled and source is official or trusted_media.

Return JSON only. No other text.`;
}

function contentTypeSchema(contentType: "news" | "event" | "calendar"): string {
  if (contentType === "news") {
    return `{
  "contentType": "news",
  "slug": "kebab-case string, max 70 chars",
  "category": "visa" | "company" | "tax" | "government" | "tourism" | "banking",
  "tags": ["array of kebab-case strings"],
  "en_title": "string, max 80 chars, no em-dashes",
  "en_summary": "string, 1-2 sentences, max 300 chars",
  "en_body": "string, minimum 150 words",
  "en_seo_title": "string, max 60 chars",
  "en_meta_description": "string, max 160 chars",
  "ru_title": "string in natural Russian",
  "ru_summary": "string in natural Russian",
  "ru_body": "string in natural Russian, minimum 150 words",
  "ru_seo_title": "string in natural Russian, max 60 chars",
  "ru_meta_description": "string in natural Russian, max 160 chars",
  "source_url": "string (URL or empty string)",
  "source_label": "official" | "government" | "media" | "other",
  "date_published": "YYYY-MM-DD or empty string",
  "date_updated": "YYYY-MM-DD or empty string",
  "image_direction": "string: describe visual type and style for designer",
  "image_prompt": "string: detailed AI image generation prompt",
  "image_alt": "string: descriptive alt text",
  "publish_readiness": "ready" | "needs_review" | "incomplete",
  "missing_fields": ["array of field name strings missing before publish"],
  "verification_notes": "string: what must be verified before publishing"
}`;
  }

  if (contentType === "event") {
    return `{
  "contentType": "event",
  "slug": "kebab-case string, max 70 chars",
  "category": "holiday" | "deadline" | "festival" | "government" | "school" | "dubai-event",
  "color_type": "public-holiday" | "important-date" | "deadline" | "major-event",
  "tags": ["array of kebab-case strings"],
  "en_title": "string, max 80 chars, no em-dashes",
  "en_summary": "string, 1-2 sentences, max 300 chars",
  "en_body": "string, minimum 100 words",
  "en_seo_title": "string, max 60 chars",
  "en_meta_description": "string, max 160 chars",
  "ru_title": "string in natural Russian",
  "ru_summary": "string in natural Russian",
  "ru_body": "string in natural Russian",
  "ru_seo_title": "string in natural Russian, max 60 chars",
  "ru_meta_description": "string in natural Russian, max 160 chars",
  "source_url": "string (URL or empty string)",
  "source_label": "official" | "government" | "media" | "other",
  "event_date_start": "YYYY-MM-DD or empty string",
  "event_date_end": "YYYY-MM-DD or empty string (omit for single-day event)",
  "date_confidence": "confirmed" | "expected" | "subject_to_official_confirmation",
  "year": number,
  "schema_eligible": 0 | 1,
  "image_direction": "string: describe visual type and style for designer",
  "image_prompt": "string: detailed AI image generation prompt",
  "image_alt": "string: descriptive alt text",
  "publish_readiness": "ready" | "needs_review" | "incomplete",
  "missing_fields": ["array of field name strings missing before publish"],
  "verification_notes": "string: what must be verified before publishing"
}

IMPORTANT for events:
- schema_eligible must be 0 unless date_confidence is "confirmed" AND source_url is non-empty.
- For Islamic holidays: set date_confidence "subject_to_official_confirmation".`;
  }

  // calendar
  return `{
  "contentType": "calendar",
  "slug": "kebab-case string, max 70 chars",
  "calendar_type": "monthly" | "yearly" | "holidays" | "important_dates" | "ramadan" | "school",
  "year": number,
  "month": number (1-12) | null (null for yearly calendars),
  "category": "government",
  "tags": ["array of kebab-case strings"],
  "en_title": "string, max 80 chars, no em-dashes",
  "en_summary": "string, 1-2 sentences, max 300 chars",
  "en_body": "string, minimum 100 words",
  "en_notes": "string: Islamic dates disclaimer if relevant, otherwise empty string",
  "en_seo_title": "string, max 60 chars",
  "en_meta_description": "string, max 160 chars",
  "ru_title": "string in natural Russian",
  "ru_summary": "string in natural Russian",
  "ru_body": "string in natural Russian",
  "ru_notes": "string in natural Russian",
  "ru_seo_title": "string in natural Russian, max 60 chars",
  "ru_meta_description": "string in natural Russian, max 160 chars",
  "source_url": "string (URL or empty string)",
  "source_label": "official" | "government" | "media" | "other",
  "official_source_url": "string (official government URL or empty string)",
  "last_verified_date": "YYYY-MM-DD or empty string",
  "has_islamic_dates": 0 | 1,
  "dates_json": [
    {
      "date": "YYYY-MM-DD",
      "label_en": "string",
      "label_ru": "string in natural Russian",
      "type": "public-holiday" | "important-date" | "deadline" | "other",
      "confidence": "confirmed" | "expected" | "subject_to_official_confirmation",
      "source": "URL or empty string"
    }
  ],
  "image_direction": "string: describe visual type and style for designer",
  "image_prompt": "string: detailed AI image generation prompt",
  "image_alt": "string: descriptive alt text",
  "publish_readiness": "ready" | "needs_review" | "incomplete",
  "missing_fields": ["array of field name strings missing before publish"],
  "verification_notes": "string: what must be verified before publishing"
}

IMPORTANT for calendar:
- dates_json must contain at least 1 entry if dates are known. Use an empty array only if no dates are known.
- For Islamic holidays: set has_islamic_dates 1 and add moon-sighting disclaimer to en_notes.
- For Islamic dates: set confidence "subject_to_official_confirmation".`;
}

// ── Refinement prompt ─────────────────────────────────────────────────────────

export interface RefinementPromptInput {
  currentDraft: GeneratedDraft;
  ownerPrompt: string;
}

export function buildRefinementPrompt(input: RefinementPromptInput): string {
  const draftJson = JSON.stringify(input.currentDraft, null, 2);

  return `Refine the following Guidex content draft based on the owner's instruction.

Content type: ${input.currentDraft.contentType}
Owner instruction: ${input.ownerPrompt}

Current draft:
${draftJson}

Apply the owner's instruction to improve the draft. Keep all fields not mentioned in the instruction unchanged unless they need updating to stay consistent (e.g., updating en_seo_title if en_title changed).

Return a single JSON object with this structure:
{
  "draft": { /* the full revised draft in the same schema as the current draft */ },
  "changeSummary": "1-3 sentence summary of what was changed and why.",
  "fieldsChanged": ["en_title", "en_body"]
}

RULES:
- No em-dashes in any string field.
- Keep slug unchanged unless explicitly asked.
- Keep source_url unchanged unless explicitly asked.
- Never set ru_published, status, noindex, featured_homepage, or featured_digest.
- Return JSON only. No other text.`;
}
