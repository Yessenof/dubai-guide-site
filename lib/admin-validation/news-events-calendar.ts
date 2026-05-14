/**
 * Validation layer for news_posts, events, and calendar_pages.
 * Pure TypeScript — no DB access. Called by Server Actions before any write.
 * Returns ValidationResult: errors block the action, warnings are advisory.
 */

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EM_DASH = "—";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(s: string): number {
  const matches = s.trim().match(/[.!?]+/g);
  return matches ? matches.length : 0;
}

function checkEmDash(input: Record<string, unknown>): string | null {
  const hasIt = Object.values(input).some(
    (v) => typeof v === "string" && v.includes(EM_DASH),
  );
  return hasIt ? `Em-dash (—) found. Use a comma, period, or new sentence instead.` : null;
}

function checkSlug(slug: string): string | null {
  if (!slug.trim()) return "slug is required.";
  if (!SLUG_PATTERN.test(slug))
    return "slug must be lowercase alphanumeric with hyphens only (e.g. golden-visa-rule-change-2026).";
  return null;
}

function checkIsoDate(field: string, value: string): string | null {
  if (!value.trim()) return `${field} is required.`;
  if (!ISO_DATE.test(value)) return `${field} must be a valid ISO 8601 date (YYYY-MM-DD).`;
  return null;
}

// ─── News ─────────────────────────────────────────────────────────────────────

const NEWS_CATEGORIES = [
  "visa",
  "company",
  "tax",
  "government",
  "tourism",
  "banking",
] as const;

const NEWS_SOURCE_LABELS = [
  "official",
  "government",
  "media",
  "other",
] as const;

export type NewsInput = Partial<{
  slug: string;
  category: string;
  tags_json: string;
  en_title: string;
  en_summary: string;
  en_body: string;
  en_seo_title: string;
  en_meta_description: string;
  ru_published: number;
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_seo_title: string;
  ru_meta_description: string;
  ru_image_alt: string;
  source_url: string;
  source_label: string;
  image_path: string;
  image_alt: string;
  date_published: string;
  date_updated: string;
  featured_homepage: number;
  featured_digest: number;
  noindex: number;
}>;

export function validateNewsDraft(input: NewsInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const slugErr = checkSlug(str(input.slug));
  if (slugErr) errors.push(slugErr);

  if (!str(input.en_title).trim()) errors.push("en_title is required.");

  const emDashErr = checkEmDash(input as Record<string, unknown>);
  if (emDashErr) errors.push(emDashErr);

  return { ok: errors.length === 0, errors, warnings };
}

export function validateNewsPublish(input: NewsInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const draft = validateNewsDraft(input);
  errors.push(...draft.errors);
  warnings.push(...draft.warnings);

  const enTitle = str(input.en_title);
  if (enTitle.length > 80)
    errors.push("en_title must be under 80 characters.");

  const enSummary = str(input.en_summary);
  if (!enSummary.trim()) {
    errors.push("en_summary is required.");
  } else {
    const sentences = countSentences(enSummary);
    if (sentences < 1) errors.push("en_summary must be at least 1 sentence.");
    if (sentences > 2)
      warnings.push("en_summary should be 1–2 sentences — currently longer.");
  }

  const wordCount = countWords(str(input.en_body));
  if (wordCount < 150)
    errors.push(`en_body must be at least 150 words (currently ~${wordCount}).`);

  if (!str(input.en_seo_title).trim()) errors.push("en_seo_title is required.");
  if (!str(input.en_meta_description).trim())
    errors.push("en_meta_description is required.");

  if (!str(input.source_url).trim())
    errors.push("source_url is required before publishing.");

  const sourceLabel = str(input.source_label);
  if (
    sourceLabel &&
    !NEWS_SOURCE_LABELS.includes(sourceLabel as (typeof NEWS_SOURCE_LABELS)[number])
  ) {
    errors.push(
      `source_label must be one of: ${NEWS_SOURCE_LABELS.join(", ")}.`,
    );
  }

  const category = str(input.category);
  if (
    category &&
    !NEWS_CATEGORIES.includes(category as (typeof NEWS_CATEGORIES)[number])
  ) {
    errors.push(`category must be one of: ${NEWS_CATEGORIES.join(", ")}.`);
  }

  const datePubErr = checkIsoDate("date_published", str(input.date_published));
  if (datePubErr) errors.push(datePubErr);

  const dateUpdErr = checkIsoDate("date_updated", str(input.date_updated));
  if (dateUpdErr) errors.push(dateUpdErr);

  if (num(input.ru_published) === 1) {
    if (!str(input.ru_title).trim())
      errors.push("ru_title is required when ru_published = 1.");
    if (!str(input.ru_body).trim())
      errors.push("ru_body is required when ru_published = 1.");
    if (!str(input.ru_seo_title).trim())
      errors.push("ru_seo_title is required when ru_published = 1.");
    if (!str(input.ru_meta_description).trim())
      errors.push("ru_meta_description is required when ru_published = 1.");
    if (str(input.image_path).trim() && !str(input.ru_image_alt).trim())
      errors.push(
        "ru_image_alt is required when image_path is set and ru_published = 1.",
      );
  }

  if (num(input.featured_homepage) === 1)
    warnings.push(
      "featured_homepage = 1: verify fewer than 3 other news posts are currently featured.",
    );

  return { ok: errors.length === 0, errors, warnings };
}

// ─── Events ───────────────────────────────────────────────────────────────────

const EVENT_CATEGORIES = [
  "holiday",
  "deadline",
  "festival",
  "government",
  "school",
  "dubai-event",
] as const;

const EVENT_COLOR_TYPES = [
  "public-holiday",
  "important-date",
  "deadline",
  "major-event",
] as const;

const DATE_CONFIDENCE_VALUES = [
  "confirmed",
  "expected",
  "subject_to_official_confirmation",
] as const;

export type EventInput = Partial<{
  slug: string;
  category: string;
  color_type: string;
  tags_json: string;
  en_title: string;
  en_summary: string;
  en_body: string;
  en_seo_title: string;
  en_meta_description: string;
  ru_published: number;
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_seo_title: string;
  ru_meta_description: string;
  event_date_start: string;
  event_date_end: string;
  date_confidence: string;
  year: number;
  source_url: string;
  schema_eligible: number;
  featured_homepage: number;
  featured_calendar: number;
  featured_digest: number;
  related_guide_slug: string;
  related_news_slug: string;
}>;

export function validateEventDraft(input: EventInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const slugErr = checkSlug(str(input.slug));
  if (slugErr) errors.push(slugErr);

  if (!str(input.en_title).trim()) errors.push("en_title is required.");

  const emDashErr = checkEmDash(input as Record<string, unknown>);
  if (emDashErr) errors.push(emDashErr);

  return { ok: errors.length === 0, errors, warnings };
}

export function validateEventPublish(input: EventInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const draft = validateEventDraft(input);
  errors.push(...draft.errors);
  warnings.push(...draft.warnings);

  const enSummary = str(input.en_summary);
  if (!enSummary.trim()) {
    errors.push("en_summary is required.");
  } else {
    const sentences = countSentences(enSummary);
    if (sentences < 1) errors.push("en_summary must be at least 1 sentence.");
    if (sentences > 2)
      warnings.push("en_summary should be 1–2 sentences — currently longer.");
  }

  if (!str(input.en_body).trim())
    errors.push("en_body is required (at least one paragraph).");
  if (!str(input.en_seo_title).trim()) errors.push("en_seo_title is required.");
  if (!str(input.en_meta_description).trim())
    errors.push("en_meta_description is required.");

  const dateStart = str(input.event_date_start);
  const dateEnd   = str(input.event_date_end);

  const dateStartErr = checkIsoDate("event_date_start", dateStart);
  if (dateStartErr) errors.push(dateStartErr);

  if (dateEnd.trim()) {
    if (!ISO_DATE.test(dateEnd)) {
      errors.push("event_date_end must be a valid ISO 8601 date (YYYY-MM-DD).");
    } else if (ISO_DATE.test(dateStart) && dateEnd < dateStart) {
      errors.push("event_date_end cannot be before event_date_start.");
    }
  }

  if (num(input.year) <= 0) errors.push("year must be a positive integer.");

  const confidence = str(input.date_confidence);
  if (
    !confidence ||
    !DATE_CONFIDENCE_VALUES.includes(
      confidence as (typeof DATE_CONFIDENCE_VALUES)[number],
    )
  ) {
    errors.push(
      `date_confidence must be one of: ${DATE_CONFIDENCE_VALUES.join(", ")}.`,
    );
  }

  const colorType = str(input.color_type);
  if (
    colorType &&
    !EVENT_COLOR_TYPES.includes(colorType as (typeof EVENT_COLOR_TYPES)[number])
  ) {
    errors.push(
      `color_type must be one of: ${EVENT_COLOR_TYPES.join(", ")}.`,
    );
  }

  const category = str(input.category);
  if (
    category &&
    !EVENT_CATEGORIES.includes(category as (typeof EVENT_CATEGORIES)[number])
  ) {
    errors.push(
      `category must be one of: ${EVENT_CATEGORIES.join(", ")}.`,
    );
  }

  if (confidence !== "confirmed" && num(input.schema_eligible) === 1) {
    errors.push(
      "schema_eligible must be 0 when date_confidence is not 'confirmed'.",
    );
  }

  if (confidence === "confirmed" && !str(input.source_url).trim()) {
    errors.push(
      "source_url is required when date_confidence is 'confirmed'.",
    );
  }

  if (confidence && confidence !== "confirmed") {
    const body = str(input.en_body).toLowerCase();
    const hasDisclaimer =
      body.includes("expected") ||
      body.includes("subject to") ||
      body.includes("provisional") ||
      body.includes("not yet confirmed");
    if (!hasDisclaimer)
      warnings.push(
        "Non-confirmed event: ensure en_body includes a plain-language disclaimer about date uncertainty.",
      );
  }

  if (num(input.ru_published) === 1) {
    if (!str(input.ru_title).trim())
      errors.push("ru_title is required when ru_published = 1.");
    if (!str(input.ru_seo_title).trim())
      errors.push("ru_seo_title is required when ru_published = 1.");
    if (!str(input.ru_meta_description).trim())
      errors.push("ru_meta_description is required when ru_published = 1.");
  }

  return { ok: errors.length === 0, errors, warnings };
}

// ─── Calendar pages ───────────────────────────────────────────────────────────

const CALENDAR_TYPES = [
  "monthly",
  "yearly",
  "holidays",
  "important_dates",
  "ramadan",
  "school",
] as const;

const ISLAMIC_DISCLAIMER = "subject to moon sighting";

export type CalendarInput = Partial<{
  slug: string;
  calendar_type: string;
  year: number;
  month: number;
  en_title: string;
  en_summary: string;
  en_body: string;
  en_notes: string;
  en_seo_title: string;
  en_meta_description: string;
  ru_published: number;
  ru_title: string;
  ru_summary: string;
  ru_body: string;
  ru_notes: string;
  ru_seo_title: string;
  ru_meta_description: string;
  ru_image_alt: string;
  image_path: string;
  image_alt: string;
  dates_json: string;
  has_islamic_dates: number;
  official_source_url: string;
  last_verified_date: string;
  featured_homepage: number;
}>;

export function validateCalendarDraft(input: CalendarInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const slugErr = checkSlug(str(input.slug));
  if (slugErr) errors.push(slugErr);

  if (!str(input.en_title).trim()) errors.push("en_title is required.");

  const emDashErr = checkEmDash(input as Record<string, unknown>);
  if (emDashErr) errors.push(emDashErr);

  return { ok: errors.length === 0, errors, warnings };
}

export function validateCalendarPublish(input: CalendarInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const draft = validateCalendarDraft(input);
  errors.push(...draft.errors);
  warnings.push(...draft.warnings);

  const enSummary = str(input.en_summary);
  if (!enSummary.trim()) {
    errors.push("en_summary is required.");
  } else {
    const sentences = countSentences(enSummary);
    if (sentences < 1) errors.push("en_summary must be at least 1 sentence.");
    if (sentences > 2)
      warnings.push("en_summary should be 1–2 sentences — currently longer.");
  }

  if (!str(input.en_body).trim())
    errors.push("en_body is required (at least one paragraph).");
  if (!str(input.en_seo_title).trim()) errors.push("en_seo_title is required.");
  if (!str(input.en_meta_description).trim())
    errors.push("en_meta_description is required.");

  const calType = str(input.calendar_type);
  if (
    !calType ||
    !CALENDAR_TYPES.includes(calType as (typeof CALENDAR_TYPES)[number])
  ) {
    errors.push(
      `calendar_type must be one of: ${CALENDAR_TYPES.join(", ")}.`,
    );
  }

  if (num(input.year) <= 0) errors.push("year must be a positive integer.");

  if (calType === "monthly") {
    const monthVal = num(input.month);
    if (monthVal < 1 || monthVal > 12)
      errors.push("month must be 1–12 for monthly calendar pages.");
  }

  const datesJsonStr = str(input.dates_json);
  if (!datesJsonStr.trim() || datesJsonStr === "[]") {
    errors.push("dates_json must contain at least one date entry.");
  } else {
    try {
      const parsed = JSON.parse(datesJsonStr);
      if (!Array.isArray(parsed) || parsed.length === 0)
        errors.push("dates_json must be a non-empty JSON array.");
    } catch {
      errors.push("dates_json is not valid JSON.");
    }
  }

  if (!str(input.image_path).trim())
    errors.push("image_path is required before publishing a calendar page.");
  if (str(input.image_path).trim() && !str(input.image_alt).trim())
    errors.push("image_alt is required when image_path is set.");

  if (!str(input.official_source_url).trim())
    errors.push("official_source_url is required.");

  const lastVerified = str(input.last_verified_date);
  if (!lastVerified.trim()) {
    errors.push("last_verified_date is required.");
  } else if (!ISO_DATE.test(lastVerified)) {
    errors.push(
      "last_verified_date must be a valid ISO 8601 date (YYYY-MM-DD).",
    );
  } else {
    const daysSince = (Date.now() - new Date(lastVerified).getTime()) / 86_400_000;
    const staleThreshold = calType === "monthly" ? 14 : 90;
    if (daysSince > staleThreshold) {
      warnings.push(
        `last_verified_date is ${Math.floor(daysSince)} days ago (threshold: ${staleThreshold} days). ` +
          `Verify dates against official source before publishing.`,
      );
    }
  }

  if (num(input.has_islamic_dates) === 1) {
    const notes = str(input.en_notes).toLowerCase();
    if (!notes.includes(ISLAMIC_DISCLAIMER)) {
      errors.push(
        `has_islamic_dates = 1: en_notes must include the phrase "${ISLAMIC_DISCLAIMER}".`,
      );
    }
  }

  if (num(input.ru_published) === 1) {
    if (!str(input.ru_title).trim())
      errors.push("ru_title is required when ru_published = 1.");
    if (!str(input.ru_body).trim())
      errors.push("ru_body is required when ru_published = 1.");
    if (!str(input.ru_seo_title).trim())
      errors.push("ru_seo_title is required when ru_published = 1.");
    if (!str(input.ru_meta_description).trim())
      errors.push("ru_meta_description is required when ru_published = 1.");
    if (str(input.image_path).trim() && !str(input.ru_image_alt).trim())
      errors.push(
        "ru_image_alt is required when image_path is set and ru_published = 1.",
      );
  }

  return { ok: errors.length === 0, errors, warnings };
}
