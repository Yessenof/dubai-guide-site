import {
  extractJson,
  validateGeneratedDraftJson,
  normalizeGeneratedDraftForSave,
} from "./editor-schemas";
import type { GeneratedDraft } from "./editor-types";

// ── Parse result ──────────────────────────────────────────────────────────────

export type ImportParseResult =
  | { ok: true; draft: GeneratedDraft & { _forSave: true; ru_published: 0 } }
  | { ok: false; error: string };

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseImportedDraft(raw: string): ImportParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste the JSON package from Claude or ChatGPT." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(trimmed));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: `JSON parse error: ${msg}. Copy the full JSON block, including { and }.`,
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "Expected a JSON object. Got an array or primitive value." };
  }

  const obj = parsed as Record<string, unknown>;

  // Accept content_type (snake_case) as alias for contentType
  if (obj.content_type && !obj.contentType) {
    obj.contentType = obj.content_type;
  }

  const ct = String(obj.contentType ?? "");
  if (!["news", "event", "calendar"].includes(ct)) {
    const got = JSON.stringify(obj.contentType ?? null);
    return {
      ok: false,
      error: `Missing or invalid "contentType". Expected "news", "event", or "calendar". Got: ${got}.`,
    };
  }

  const draft = validateGeneratedDraftJson(obj, ct as "news" | "event" | "calendar");
  const normalized = normalizeGeneratedDraftForSave(draft);
  return { ok: true, draft: normalized };
}

// ── Prompt builder ────────────────────────────────────────────────────────────

const CONTENT_RULES = `Content rules (mandatory):
- No em-dashes (— or –) in any field. Replace with commas or rephrase.
- No markdown headers (# ## ###) in body text. Use plain paragraphs.
- No filler phrases ("In conclusion", "It is important to note that", "Furthermore").
- Dates must be in YYYY-MM-DD format.
- slug: lowercase kebab-case only, max 70 chars, no special characters.
- Russian fields: natural Russian, not word-for-word translation. Match the tone of the English.
- Output ONLY the raw JSON object. No explanation text before or after it.`;

const BASE_FIELDS = `  "slug": "kebab-case-slug-max-70-chars",
  "tags": ["tag1", "tag2"],
  "en_title": "English headline (max 80 chars)",
  "en_summary": "English summary / lead paragraph (max 300 chars)",
  "en_body": "Full English article body (plain paragraphs, no markdown headers)",
  "en_seo_title": "SEO page title (max 60 chars)",
  "en_meta_description": "Meta description for search engines (max 160 chars)",
  "ru_title": "Russian headline (max 100 chars)",
  "ru_summary": "Russian summary (max 300 chars)",
  "ru_body": "Full Russian body translation",
  "ru_seo_title": "Russian SEO title (max 60 chars)",
  "ru_meta_description": "Russian meta description (max 160 chars)",
  "source_url": "https://source-url-or-empty-string",
  "source_label": "official | government | media | other",
  "image_direction": "Art direction note for the featured image (describe style, no photos of people)",
  "image_prompt": "Detailed AI image generation prompt",
  "image_alt": "Alt text for the image (max 200 chars)",
  "publish_readiness": "ready | needs_review | incomplete",
  "missing_fields": ["list any fields that could not be filled"],
  "verification_notes": "Facts that need human verification before publishing"`;

const NEWS_SCHEMA = `{
  "contentType": "news",
  "category": "visa | company | tax | government | tourism | banking",
${BASE_FIELDS},
  "date_published": "YYYY-MM-DD",
  "date_updated": "YYYY-MM-DD"
}`;

const EVENT_SCHEMA = `{
  "contentType": "event",
  "category": "holiday | deadline | festival | government | school | dubai-event",
${BASE_FIELDS},
  "color_type": "public-holiday | important-date | deadline | major-event",
  "event_date_start": "YYYY-MM-DD",
  "event_date_end": "YYYY-MM-DD or empty string if single-day",
  "date_confidence": "confirmed | expected | subject_to_official_confirmation",
  "year": 2026,
  "schema_eligible": 0
}`;

const CALENDAR_SCHEMA = `{
  "contentType": "calendar",
  "category": "government",
${BASE_FIELDS},
  "calendar_type": "monthly | yearly | holidays | important_dates | ramadan | school",
  "year": 2026,
  "month": null,
  "dates_json": [
    {
      "date": "YYYY-MM-DD",
      "label_en": "English label",
      "label_ru": "Russian label",
      "type": "public-holiday | important-date | deadline | other",
      "confidence": "confirmed | expected | subject_to_official_confirmation",
      "source": "Source reference or URL"
    }
  ],
  "official_source_url": "https://official-source-url",
  "last_verified_date": "YYYY-MM-DD",
  "en_notes": "English editorial notes",
  "ru_notes": "Russian editorial notes",
  "has_islamic_dates": 0
}`;

export function buildImportPrompt(contentType: "news" | "event" | "calendar"): string {
  const schema =
    contentType === "news" ? NEWS_SCHEMA :
    contentType === "event" ? EVENT_SCHEMA :
    CALENDAR_SCHEMA;

  const typeLabel =
    contentType === "news" ? "News post" :
    contentType === "event" ? "Upcoming event / deadline" :
    "Calendar Visual Post";

  return `You are a bilingual (English + Russian) content editor for guidex-consulting.ae — a premium Dubai business and relocation procedures site. Readers are business owners, founders, and expats navigating UAE processes.

Task: Generate a structured ${typeLabel} draft as a single valid JSON object, using the source material I provide below.

${CONTENT_RULES}

Output exactly this JSON structure, filled with real content based on the source:

${schema}

---

Source material:
[PASTE YOUR TEXT, URL, OR NOTES HERE]`;
}
