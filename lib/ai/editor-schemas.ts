import type {
  AiSuggestedType,
  CalendarDateEntry,
  ClassificationResult,
  Confidence,
  GeneratedCalendarDraft,
  GeneratedDraft,
  GeneratedEventDraft,
  GeneratedNewsDraft,
  RefinementResult,
  RiskLevel,
  SourceReliability,
} from "./editor-types";

// ── String helpers ────────────────────────────────────────────────────────────

export function normalizeSlug(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

export function stripLongEmDashes(value: unknown): string {
  return String(value ?? "").replace(/—/g, ",").replace(/–/g, "-");
}

export function sanitizeText(value: unknown, maxLen?: number): string {
  let s = String(value ?? "");
  s = stripLongEmDashes(s);
  // strip any markdown fences that might have leaked through
  s = s.replace(/^```[a-z]*\n?/gm, "").replace(/^```$/gm, "");
  if (maxLen) s = s.slice(0, maxLen);
  return s.trim();
}

export function sanitizeStringArray(value: unknown, maxItems = 10, maxItemLen = 40): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, maxItems)
    .map((v) => String(v ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, maxItemLen))
    .filter(Boolean);
}

function str(v: unknown): string {
  return String(v ?? "");
}

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return isFinite(n) ? n : fallback;
}

function validateIsoDate(value: unknown): string {
  const s = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

// ── Strip AI-generated markdown fences from JSON strings ──────────────────────

export function extractJson(raw: string): string {
  const s = raw.trim();
  // Strip ```json ... ``` or ``` ... ```
  const fenced = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) return fenced[1].trim();
  return s;
}

// ── Classification result validation ─────────────────────────────────────────

const VALID_SUGGESTED_TYPES: AiSuggestedType[] = [
  "news", "event", "calendar", "guide_update", "service", "area_update", "ignore",
];
const VALID_CONFIDENCE: Confidence[] = ["high", "medium", "low"];
const VALID_RELIABILITY: SourceReliability[] = [
  "official", "trusted_media", "public_social_signal", "internal_note", "unknown",
];
const VALID_RISK: RiskLevel[] = ["low", "medium", "high"];

export function validateClassificationJson(raw: unknown): ClassificationResult {
  const r = raw as Record<string, unknown>;

  const suggestedType = VALID_SUGGESTED_TYPES.includes(str(r.suggestedType) as AiSuggestedType)
    ? (str(r.suggestedType) as AiSuggestedType)
    : "news";

  const confidence = VALID_CONFIDENCE.includes(str(r.confidence) as Confidence)
    ? (str(r.confidence) as Confidence)
    : "low";

  const sourceReliability = VALID_RELIABILITY.includes(str(r.sourceReliability) as SourceReliability)
    ? (str(r.sourceReliability) as SourceReliability)
    : "unknown";

  const riskLevel = VALID_RISK.includes(str(r.riskLevel) as RiskLevel)
    ? (str(r.riskLevel) as RiskLevel)
    : "medium";

  const detectedDates = Array.isArray(r.detectedDates)
    ? (r.detectedDates as unknown[]).map(String).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    : [];

  return {
    suggestedType,
    confidence,
    sourceReliability,
    riskLevel,
    verificationRequired: Boolean(r.verificationRequired) || riskLevel === "high" || sourceReliability === "unknown" || sourceReliability === "public_social_signal",
    reason: sanitizeText(r.reason, 500),
    detectedDates,
    sourceNotes: sanitizeText(r.sourceNotes, 300),
  };
}

// ── News draft validation ─────────────────────────────────────────────────────

const VALID_NEWS_CATEGORIES = ["visa", "company", "tax", "government", "tourism", "banking"];
const VALID_SOURCE_LABELS = ["official", "government", "media", "other"];

function validateNewsBase(r: Record<string, unknown>): Omit<GeneratedNewsDraft, "contentType"> {
  const category = VALID_NEWS_CATEGORIES.includes(str(r.category)) ? str(r.category) : "government";
  const sourceLabel = VALID_SOURCE_LABELS.includes(str(r.source_label)) ? str(r.source_label) : "other";
  const publishReadiness = ["ready", "needs_review", "incomplete"].includes(str(r.publish_readiness))
    ? (str(r.publish_readiness) as GeneratedNewsDraft["publish_readiness"])
    : "incomplete";

  return {
    slug: normalizeSlug(r.slug) || "ai-draft",
    category,
    tags: sanitizeStringArray(r.tags),
    en_title: sanitizeText(r.en_title, 80),
    en_summary: sanitizeText(r.en_summary, 300),
    en_body: sanitizeText(r.en_body),
    en_seo_title: sanitizeText(r.en_seo_title, 60),
    en_meta_description: sanitizeText(r.en_meta_description, 160),
    ru_title: sanitizeText(r.ru_title, 100),
    ru_summary: sanitizeText(r.ru_summary, 300),
    ru_body: sanitizeText(r.ru_body),
    ru_seo_title: sanitizeText(r.ru_seo_title, 60),
    ru_meta_description: sanitizeText(r.ru_meta_description, 160),
    source_url: sanitizeText(r.source_url, 500),
    source_label: sourceLabel,
    date_published: validateIsoDate(r.date_published),
    date_updated: validateIsoDate(r.date_updated),
    image_path: sanitizeText(r.image_path, 500),
    image_direction: sanitizeText(r.image_direction, 500),
    image_prompt: sanitizeText(r.image_prompt, 500),
    image_alt: sanitizeText(r.image_alt, 200),
    ru_image_alt: sanitizeText(r.ru_image_alt, 200),
    publish_readiness: publishReadiness,
    missing_fields: Array.isArray(r.missing_fields) ? (r.missing_fields as unknown[]).map(String).filter(Boolean) : [],
    verification_notes: sanitizeText(r.verification_notes, 1000),
  };
}

// ── Event draft validation ────────────────────────────────────────────────────

const VALID_EVENT_CATEGORIES = ["holiday", "deadline", "festival", "government", "school", "dubai-event"];
const VALID_COLOR_TYPES = ["public-holiday", "important-date", "deadline", "major-event"];
const VALID_DATE_CONFIDENCE = ["confirmed", "expected", "subject_to_official_confirmation"];

// ── Calendar draft validation ─────────────────────────────────────────────────

const VALID_CALENDAR_TYPES = ["monthly", "yearly", "holidays", "important_dates", "ramadan", "school"];

function validateCalendarDates(raw: unknown): CalendarDateEntry[] {
  if (!Array.isArray(raw)) return [];
  const VALID_DATE_TYPES = ["public-holiday", "important-date", "deadline", "other"];
  const VALID_CONF = ["confirmed", "expected", "subject_to_official_confirmation"];
  return (raw as unknown[])
    .slice(0, 100)
    .map((entry) => {
      const e = entry as Record<string, unknown>;
      const date = validateIsoDate(e.date);
      if (!date) return null;
      return {
        date,
        label_en: sanitizeText(e.label_en, 100),
        label_ru: sanitizeText(e.label_ru, 100),
        type: VALID_DATE_TYPES.includes(str(e.type))
          ? (str(e.type) as CalendarDateEntry["type"])
          : "other",
        confidence: VALID_CONF.includes(str(e.confidence))
          ? (str(e.confidence) as CalendarDateEntry["confidence"])
          : "expected",
        source: sanitizeText(e.source, 300),
      } satisfies CalendarDateEntry;
    })
    .filter((e): e is CalendarDateEntry => e !== null);
}

// ── Master draft validator ────────────────────────────────────────────────────

export function validateGeneratedDraftJson(
  raw: unknown,
  expectedType: "news" | "event" | "calendar",
): GeneratedDraft {
  const r = raw as Record<string, unknown>;
  const contentType = (["news", "event", "calendar"].includes(str(r.contentType))
    ? str(r.contentType)
    : expectedType) as "news" | "event" | "calendar";

  if (contentType === "news") {
    return {
      contentType: "news",
      ...validateNewsBase(r),
      date_published: validateIsoDate(r.date_published),
      date_updated: validateIsoDate(r.date_updated),
    } satisfies GeneratedNewsDraft;
  }

  if (contentType === "event") {
    const base = validateNewsBase(r);
    const category = VALID_EVENT_CATEGORIES.includes(str(r.category)) ? str(r.category) : "dubai-event";
    const colorType = VALID_COLOR_TYPES.includes(str(r.color_type)) ? str(r.color_type) : "important-date";
    const dateConf = VALID_DATE_CONFIDENCE.includes(str(r.date_confidence))
      ? (str(r.date_confidence) as GeneratedEventDraft["date_confidence"])
      : "expected";
    const hasSource = !!base.source_url.trim();
    const schemaEligible = (dateConf === "confirmed" && hasSource) ? 1 : 0;
    return {
      contentType: "event",
      ...base,
      category,
      color_type: colorType,
      event_date_start: validateIsoDate(r.event_date_start),
      event_date_end: validateIsoDate(r.event_date_end),
      date_confidence: dateConf,
      year: num(r.year, new Date().getFullYear()),
      schema_eligible: schemaEligible,
    } satisfies GeneratedEventDraft;
  }

  // calendar
  const base = validateNewsBase(r);
  const calendarType = VALID_CALENDAR_TYPES.includes(str(r.calendar_type)) ? str(r.calendar_type) : "yearly";
  const monthRaw = r.month;
  const month = (calendarType === "yearly" || monthRaw === null || monthRaw === undefined)
    ? null
    : Math.min(12, Math.max(1, num(monthRaw, 0))) || null;

  return {
    contentType: "calendar",
    ...base,
    category: "government",
    calendar_type: calendarType,
    year: num(r.year, new Date().getFullYear()),
    month,
    dates_json: validateCalendarDates(r.dates_json),
    official_source_url: sanitizeText(r.official_source_url, 500),
    last_verified_date: validateIsoDate(r.last_verified_date),
    en_notes: sanitizeText(r.en_notes, 1000),
    ru_notes: sanitizeText(r.ru_notes, 1000),
    has_islamic_dates: (r.has_islamic_dates === 1 || r.has_islamic_dates === true) ? 1 : 0,
  } satisfies GeneratedCalendarDraft;
}

// ── Refinement result validator ───────────────────────────────────────────────

export function validateRefinementJson(
  raw: unknown,
  expectedType: "news" | "event" | "calendar",
): RefinementResult {
  const r = raw as Record<string, unknown>;
  const draft = validateGeneratedDraftJson(r.draft ?? {}, expectedType);
  return {
    draft,
    changeSummary: sanitizeText(r.changeSummary, 500),
    fieldsChanged: Array.isArray(r.fieldsChanged)
      ? (r.fieldsChanged as unknown[]).map(String).filter(Boolean)
      : [],
  };
}

// ── Normalize draft for DB save ───────────────────────────────────────────────

// Strips any AI-generated fields that must never be set by AI.
// Forces status = draft and ru_published = 0 at the input level.
export function normalizeGeneratedDraftForSave(draft: GeneratedDraft): GeneratedDraft & {
  _forSave: true;
  ru_published: 0;
} {
  return {
    ...draft,
    _forSave: true as const,
    ru_published: 0,
    // Ensure slug is normalized
    slug: normalizeSlug(draft.slug) || "ai-draft-" + Date.now().toString(36).slice(-6),
  };
}
