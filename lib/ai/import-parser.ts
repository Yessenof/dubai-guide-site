import {
  extractJson,
  validateGeneratedDraftJson,
  normalizeGeneratedDraftForSave,
} from "./editor-schemas";
import type { GeneratedDraft } from "./editor-types";

// ── Parse result ──────────────────────────────────────────────────────────────

export type ImportParseResult =
  | {
      ok: true;
      draft: GeneratedDraft & { _forSave: true; ru_published: 0 };
      saveable: boolean;    // false when core required fields are empty
      coreErrors: string[]; // human-readable list of missing required fields
    }
  | { ok: false; error: string };

// ── Field alias normalizer ────────────────────────────────────────────────────
// Maps camelCase and alternative field names produced by external AIs into
// the internal snake_case schema. Does not overwrite fields already set.

function normalizeAliases(obj: Record<string, unknown>): Record<string, unknown> {
  const out = { ...obj };

  // content type
  if (!out.contentType && out.content_type) out.contentType = out.content_type;

  // English core fields
  if (!out.en_title)   out.en_title   = out.enTitle   ?? out.title;
  if (!out.en_summary) out.en_summary = out.enSummary ?? out.summary;
  if (!out.en_body)    out.en_body    = out.enBody    ?? out.body;

  // English SEO
  if (!out.en_seo_title) {
    out.en_seo_title = out.enSeoTitle ?? out.seo_title ?? out.seoTitle;
  }
  if (!out.en_meta_description) {
    out.en_meta_description =
      out.enMetaDescription ?? out.meta_description ?? out.metaDescription;
  }

  // Russian fields
  if (!out.ru_title)   out.ru_title   = out.ruTitle   ?? out.russian_title;
  if (!out.ru_summary) out.ru_summary = out.ruSummary ?? out.russian_summary;
  if (!out.ru_body)    out.ru_body    = out.ruBody    ?? out.russian_body;
  if (!out.ru_seo_title) {
    out.ru_seo_title = out.ruSeoTitle ?? out.russian_seo_title;
  }
  if (!out.ru_meta_description) {
    out.ru_meta_description =
      out.ruMetaDescription ?? out.russian_meta_description;
  }

  // Tags
  if (!out.tags) out.tags = out.tagsJson ?? out.tags_json;

  return out;
}

// ── Core field completeness check ─────────────────────────────────────────────
// Returns a list of human-readable errors for fields that must be non-empty
// before an imported draft is safe to save.

function checkImportCompleteness(draft: GeneratedDraft): string[] {
  const errors: string[] = [];
  if (!draft.en_title?.trim())   errors.push("Imported package is missing en_title");
  if (!draft.en_summary?.trim()) errors.push("Imported package is missing en_summary");
  if (!draft.en_body?.trim())    errors.push("Imported package is missing en_body");
  return errors;
}

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

  const obj = normalizeAliases(parsed as Record<string, unknown>);

  const ct = String(obj.contentType ?? "");
  if (!["news", "event", "calendar"].includes(ct)) {
    const got = JSON.stringify(obj.contentType ?? null);
    return {
      ok: false,
      error: `Missing or invalid "content_type". Expected "news", "event", or "calendar". Got: ${got}.`,
    };
  }

  const draft = validateGeneratedDraftJson(obj, ct as "news" | "event" | "calendar");
  const normalized = normalizeGeneratedDraftForSave(draft);
  const coreErrors = checkImportCompleteness(normalized);

  return {
    ok: true,
    draft: normalized,
    saveable: coreErrors.length === 0,
    coreErrors,
  };
}

// ── Prompt builder ────────────────────────────────────────────────────────────

const CRITICAL_RULES = `CRITICAL OUTPUT RULES — follow exactly:
1. Return ONLY a raw JSON object. No explanation, no markdown, no code fences.
2. Use ONLY the exact snake_case field names shown below. Do NOT use camelCase.
3. Do NOT leave en_title, en_summary, or en_body empty. Fill them with real content.
4. Do NOT include any of these fields: status, published, ru_published, image_path.
5. Use "content_type": "news" | "event" | "calendar" — not "contentType".
6. No em-dashes (— or –) in any field. Replace with commas or rephrase.
7. No markdown headers (# ## ###) in body text. Use plain paragraphs.
8. Dates in YYYY-MM-DD format only.
9. slug: lowercase kebab-case only, max 70 chars.
10. Russian fields: natural Russian, not word-for-word translation.`;

const BASE_FIELDS = `  "content_type": "[see valid values above]",
  "slug": "kebab-case-slug-max-70-chars",
  "category": "[see valid values for content type]",
  "tags": ["tag1", "tag2"],
  "en_title": "English headline — REQUIRED, must not be empty (max 80 chars)",
  "en_summary": "English summary — REQUIRED, must not be empty (max 300 chars)",
  "en_body": "Full English article body — REQUIRED, must not be empty (plain paragraphs)",
  "en_seo_title": "SEO page title (max 60 chars)",
  "en_meta_description": "Meta description for search engines (max 160 chars)",
  "ru_title": "Russian headline (max 100 chars)",
  "ru_summary": "Russian summary (max 300 chars)",
  "ru_body": "Full Russian body translation",
  "ru_seo_title": "Russian SEO title (max 60 chars)",
  "ru_meta_description": "Russian meta description (max 160 chars)",
  "source_url": "https://source-url-or-empty-string",
  "source_label": "official | government | media | other",
  "image_direction": "Art direction for the featured image (describe style, no photos of people)",
  "image_prompt": "Detailed AI image generation prompt",
  "image_alt": "Alt text for the image (max 200 chars)",
  "publish_readiness": "ready | needs_review | incomplete",
  "missing_fields": ["list any fields you could not fill"],
  "verification_notes": "Facts that need human verification before publishing"`;

const NEWS_SCHEMA = `{
  "content_type": "news",
  "category": "visa | company | tax | government | tourism | banking",
${BASE_FIELDS},
  "date_published": "YYYY-MM-DD",
  "date_updated": "YYYY-MM-DD"
}`;

const EVENT_SCHEMA = `{
  "content_type": "event",
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
  "content_type": "calendar",
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

${CRITICAL_RULES}

Output exactly this JSON structure, filled with real content based on the source:

${schema}

---

Source material:
[PASTE YOUR TEXT, URL, OR NOTES HERE]`;
}
