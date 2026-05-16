// ── Input types ───────────────────────────────────────────────────────────────

export type AiInputType =
  | "url"
  | "pasted-text"
  | "government-source"
  | "media-article"
  | "telegram-social"
  | "event-listing"
  | "pdf-notes"
  | "screenshot-notes"
  | "internal-idea";

// ── Classification types ──────────────────────────────────────────────────────

export type AiSuggestedType =
  | "news"
  | "event"
  | "calendar"
  | "guide_update"
  | "service"
  | "area_update"
  | "ignore";

export type SourceReliability =
  | "official"
  | "trusted_media"
  | "public_social_signal"
  | "internal_note"
  | "unknown";

export type RiskLevel = "low" | "medium" | "high";
export type Confidence = "high" | "medium" | "low";

export interface ClassificationResult {
  suggestedType: AiSuggestedType;
  confidence: Confidence;
  sourceReliability: SourceReliability;
  riskLevel: RiskLevel;
  verificationRequired: boolean;
  reason: string;
  detectedDates: string[];
  sourceNotes: string;
}

// ── Generated draft types ─────────────────────────────────────────────────────

export interface CalendarDateEntry {
  date: string;
  label_en: string;
  label_ru: string;
  type: "public-holiday" | "important-date" | "deadline" | "other";
  confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  source: string;
}

interface GeneratedDraftBase {
  slug: string;
  category: string;
  tags: string[];
  en_title: string;
  en_summary: string;
  en_body: string;
  en_seo_title: string;
  en_meta_description: string;
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_seo_title: string;
  ru_meta_description: string;
  source_url: string;
  source_label: string;
  image_path: string;
  image_direction: string;
  image_prompt: string;
  image_alt: string;
  ru_image_alt: string;
  publish_readiness: "ready" | "needs_review" | "incomplete";
  missing_fields: string[];
  verification_notes: string;
}

export interface GeneratedNewsDraft extends GeneratedDraftBase {
  contentType: "news";
  date_published: string;
  date_updated: string;
}

export interface GeneratedEventDraft extends GeneratedDraftBase {
  contentType: "event";
  color_type: string;
  event_date_start: string;
  event_date_end: string;
  date_confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  year: number;
  schema_eligible: 0 | 1;
}

export interface GeneratedCalendarDraft extends GeneratedDraftBase {
  contentType: "calendar";
  calendar_type: string;
  year: number;
  month: number | null;
  dates_json: CalendarDateEntry[];
  official_source_url: string;
  last_verified_date: string;
  en_notes: string;
  ru_notes: string;
  has_islamic_dates: 0 | 1;
}

export type GeneratedDraft =
  | GeneratedNewsDraft
  | GeneratedEventDraft
  | GeneratedCalendarDraft;

// ── Refinement result ─────────────────────────────────────────────────────────

export interface RefinementResult {
  draft: GeneratedDraft;
  changeSummary: string;
  fieldsChanged: string[];
}

// ── Runtime status ────────────────────────────────────────────────────────────

export type AiRuntimeStatus =
  | "connected"
  | "disabled"
  | "missing_key"
  | "local_preview";

// ── Action result types ───────────────────────────────────────────────────────

export type AiErrorCode =
  | "ai_disabled"
  | "api_key_missing"
  | "daily_limit"
  | "input_too_long"
  | "model_unavailable"
  | "rate_limited"
  | "timeout"
  | "invalid_json"
  | "schema_invalid"
  | "unauthorized";

export interface AiError {
  ok: false;
  error: string;
  errorCode: AiErrorCode;
}

export type ClassifyActionResult =
  | { ok: true; result: ClassificationResult }
  | AiError;

export type GenerateDraftActionResult =
  | { ok: true; draft: GeneratedDraft }
  | AiError;

export type RefineDraftActionResult =
  | { ok: true; draft: GeneratedDraft; changeSummary: string; fieldsChanged: string[] }
  | AiError;

// ── Save action state (for useActionState) ────────────────────────────────────

export interface AiSaveActionState {
  errors: string[];
  warnings: string[];
}
