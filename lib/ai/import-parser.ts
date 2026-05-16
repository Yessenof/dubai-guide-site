import {
  extractJson,
  validateGeneratedDraftJson,
  normalizeGeneratedDraftForSave,
} from "./editor-schemas";
import type { GeneratedDraft, GeneratedCalendarDraft } from "./editor-types";

// ── Parse result ──────────────────────────────────────────────────────────────

export type ImportParseResult =
  | {
      ok: true;
      draft: GeneratedDraft & { _forSave: true; ru_published: 0 };
      saveable: boolean;    // false when core required fields are empty
      coreErrors: string[]; // human-readable list of missing required fields
      importWarnings: string[]; // non-fatal issues (file:// path, auto-detected flags)
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

  // Image fields
  if (!out.image_path) out.image_path = out.imagePath ?? out.image_url ?? out.imageUrl;
  if (!out.image_alt)  out.image_alt  = out.imageAlt  ?? out.enImageAlt ?? out.en_image_alt;
  if (!out.ru_image_alt) out.ru_image_alt = out.ruImageAlt ?? out.ru_image_alt_text;

  // Tags
  if (!out.tags) out.tags = out.tagsJson ?? out.tags_json;

  return out;
}

// ── SEO fallbacks ─────────────────────────────────────────────────────────────
// Fill empty SEO fields from core content fields so import drafts are never
// left with blank SEO when the AI didn't generate separate SEO fields.

function applySeoFallbacks(obj: Record<string, unknown>): Record<string, unknown> {
  const out = { ...obj };
  if (!String(out.en_seo_title ?? "").trim()) {
    out.en_seo_title = String(out.en_title ?? "").slice(0, 60);
  }
  if (!String(out.en_meta_description ?? "").trim()) {
    out.en_meta_description = String(out.en_summary ?? "").slice(0, 160);
  }
  if (!String(out.ru_seo_title ?? "").trim()) {
    out.ru_seo_title = String(out.ru_title ?? "").slice(0, 60);
  }
  if (!String(out.ru_meta_description ?? "").trim()) {
    out.ru_meta_description = String(out.ru_summary ?? "").slice(0, 160);
  }
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

// ── Islamic date auto-detection ───────────────────────────────────────────────
// Scans text content of a calendar draft for Islamic calendar keywords.

const ISLAMIC_KEYWORDS = /\b(eid|arafah|ramadan|hijri|dhul\s*hijjah|moon\s*sighting)\b/i;

function detectIslamicDates(draft: GeneratedDraft): boolean {
  if (draft.contentType !== "calendar") return false;
  const calDraft = draft as GeneratedCalendarDraft;
  const texts = [
    draft.en_title,
    draft.en_summary,
    draft.en_body,
    draft.ru_title ?? "",
    ...calDraft.dates_json.map((d) => `${d.label_en} ${d.label_ru}`),
  ];
  return ISLAMIC_KEYWORDS.test(texts.join(" "));
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

  const withAliases = normalizeAliases(parsed as Record<string, unknown>);

  const ct = String(withAliases.contentType ?? "");
  if (!["news", "event", "calendar"].includes(ct)) {
    const got = JSON.stringify(withAliases.contentType ?? null);
    return {
      ok: false,
      error: `Missing or invalid "content_type". Expected "news", "event", or "calendar". Got: ${got}.`,
    };
  }

  const withSeo = applySeoFallbacks(withAliases);
  const draft = validateGeneratedDraftJson(withSeo, ct as "news" | "event" | "calendar");
  const normalized = normalizeGeneratedDraftForSave(draft);
  const coreErrors = checkImportCompleteness(normalized);

  // Collect non-fatal import warnings and apply corrections
  const importWarnings: string[] = [];
  const mutableDraft = normalized as unknown as Record<string, unknown>;

  // file:// image path detection: clear path + warn owner
  const imagePath = String(mutableDraft.image_path ?? "").trim();
  if (imagePath.startsWith("file://")) {
    mutableDraft.image_path = "";
    importWarnings.push(
      "Image path uses file:// (local file). Local paths cannot be served by the site. " +
      "Move the file to public/images/ and use a /images/... path instead.",
    );
  }

  // Islamic date auto-detection for calendar drafts
  if (normalized.contentType === "calendar" && !mutableDraft.has_islamic_dates) {
    if (detectIslamicDates(normalized)) {
      mutableDraft.has_islamic_dates = 1;
      importWarnings.push("Islamic keywords detected in content — has_islamic_dates auto-set to 1.");
    }
  }

  return {
    ok: true,
    draft: normalized,
    saveable: coreErrors.length === 0,
    coreErrors,
    importWarnings,
  };
}

// ── Prompt builder ────────────────────────────────────────────────────────────

const CRITICAL_RULES = `CRITICAL OUTPUT RULES — follow exactly:
1. Return ONLY a raw JSON object. No explanation, no markdown, no code fences.
2. Use ONLY the exact snake_case field names shown below. Do NOT use camelCase.
3. Do NOT leave en_title, en_summary, or en_body empty. Fill them with real content.
4. Do NOT include any of these fields: status, published, ru_published.
5. Use "content_type": "news" | "event" | "calendar" — not "contentType".
6. No em-dashes (— or –) in any field. Replace with commas or rephrase.
7. No markdown headers (# ## ###) in body text. Use plain paragraphs.
8. Dates in YYYY-MM-DD format only.
9. slug: lowercase kebab-case only, max 70 chars.
10. Russian fields: natural Russian, not word-for-word translation.
11. image_path: use /images/... paths only. Do NOT use file:// paths or absolute local paths. Leave empty string if no image is available.`;

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
  "image_path": "/images/filename.jpg or empty string — do NOT use file:// paths",
  "image_direction": "Art direction for the featured image (describe style, no photos of people)",
  "image_prompt": "Detailed AI image generation prompt",
  "image_alt": "Alt text for the image (max 200 chars)",
  "ru_image_alt": "Alt text in Russian (max 200 chars)",
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
