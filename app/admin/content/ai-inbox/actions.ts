"use server";

import { redirect } from "next/navigation";
import {
  createNewsDraft,
  createEventDraft,
  createCalendarDraft,
} from "@/lib/db/news-events-calendar-admin";
import {
  classifyWithAi,
  generateDraftWithAi,
  refineDraftWithAi,
} from "@/lib/ai/editor-runtime";
import { normalizeGeneratedDraftForSave } from "@/lib/ai/editor-schemas";
import type {
  AiInputType,
  AiSaveActionState,
  ClassifyActionResult,
  GenerateDraftActionResult,
  GeneratedDraft,
  GeneratedNewsDraft,
  GeneratedEventDraft,
  GeneratedCalendarDraft,
  RefineDraftActionResult,
} from "@/lib/ai/editor-types";

// ── AI actions (called programmatically from AiInboxClient via startTransition) ──

export async function classifyInputAction(input: {
  inputType: AiInputType;
  mainInput: string;
  sourceUrl: string;
  ownerInstruction: string;
}): Promise<ClassifyActionResult> {
  return classifyWithAi(input);
}

export async function generateDraftAction(input: {
  inputType: AiInputType;
  mainInput: string;
  sourceUrl: string;
  ownerInstruction: string;
  contentType: "news" | "event" | "calendar";
  sourceReliability: string;
  riskLevel: string;
  detectedDates: string[];
}): Promise<GenerateDraftActionResult> {
  return generateDraftWithAi(input);
}

export async function refineDraftAction(input: {
  currentDraft: GeneratedDraft;
  ownerPrompt: string;
}): Promise<RefineDraftActionResult> {
  return refineDraftWithAi(input);
}

// ── Field mappers (AI draft → writer input types) ─────────────────────────────

function tagsToJson(tags: string[]): string {
  return JSON.stringify(Array.isArray(tags) ? tags : []);
}

function newsInputFromDraft(draft: GeneratedNewsDraft) {
  return {
    slug: draft.slug,
    category: draft.category,
    tags_json: tagsToJson(draft.tags),
    en_title: draft.en_title,
    en_summary: draft.en_summary,
    en_body: draft.en_body,
    en_seo_title: draft.en_seo_title,
    en_meta_description: draft.en_meta_description,
    ru_title: draft.ru_title,
    ru_summary: draft.ru_summary,
    ru_body: draft.ru_body,
    ru_seo_title: draft.ru_seo_title,
    ru_meta_description: draft.ru_meta_description,
    source_url: draft.source_url,
    source_label: draft.source_label,
    date_published: draft.date_published,
    date_updated: draft.date_updated,
    image_alt: draft.image_alt,
    image_path: "",       // never set by AI — owner uploads
    ru_image_alt: "",     // owner fills after review
    ru_published: 0,      // always 0 — AI never publishes RU
    featured_homepage: 0,
    featured_digest: 0,
    noindex: 0,
  };
}

function eventInputFromDraft(draft: GeneratedEventDraft) {
  return {
    slug: draft.slug,
    category: draft.category,
    color_type: draft.color_type,
    tags_json: tagsToJson(draft.tags),
    en_title: draft.en_title,
    en_summary: draft.en_summary,
    en_body: draft.en_body,
    en_seo_title: draft.en_seo_title,
    en_meta_description: draft.en_meta_description,
    ru_title: draft.ru_title,
    ru_summary: draft.ru_summary,
    ru_body: draft.ru_body,
    ru_seo_title: draft.ru_seo_title,
    ru_meta_description: draft.ru_meta_description,
    source_url: draft.source_url,
    event_date_start: draft.event_date_start,
    event_date_end: draft.event_date_end,
    date_confidence: draft.date_confidence,
    year: draft.year,
    schema_eligible: draft.schema_eligible,
    ru_published: 0,      // always 0
    featured_homepage: 0,
    featured_calendar: 1,
    featured_digest: 0,
  };
}

function calendarInputFromDraft(draft: GeneratedCalendarDraft) {
  return {
    slug: draft.slug,
    calendar_type: draft.calendar_type,
    year: draft.year,
    month: draft.month ?? undefined,
    tags_json: tagsToJson(draft.tags),
    en_title: draft.en_title,
    en_summary: draft.en_summary,
    en_body: draft.en_body,
    en_notes: draft.en_notes,
    en_seo_title: draft.en_seo_title,
    en_meta_description: draft.en_meta_description,
    ru_title: draft.ru_title,
    ru_summary: draft.ru_summary,
    ru_body: draft.ru_body,
    ru_notes: draft.ru_notes,
    ru_seo_title: draft.ru_seo_title,
    ru_meta_description: draft.ru_meta_description,
    dates_json: JSON.stringify(Array.isArray(draft.dates_json) ? draft.dates_json : []),
    official_source_url: draft.official_source_url || draft.source_url,
    last_verified_date: draft.last_verified_date,
    image_path: "",       // owner uploads
    image_alt: draft.image_alt,
    ru_image_alt: "",
    has_islamic_dates: draft.has_islamic_dates,
    ru_published: 0,      // always 0
    featured_homepage: 0,
  };
}

// ── Save generated draft actions (useActionState + redirect pattern) ───────────

const INITIAL_SAVE_STATE: AiSaveActionState = { errors: [], warnings: [] };
export { INITIAL_SAVE_STATE };

export async function saveGeneratedNewsDraftAction(
  _prevState: AiSaveActionState,
  formData: FormData,
): Promise<AiSaveActionState> {
  const draftJson = formData.get("_draft_json") as string | null;
  if (!draftJson?.trim()) return { errors: ["Missing draft data."], warnings: [] };

  let draft: GeneratedDraft;
  try {
    draft = JSON.parse(draftJson) as GeneratedDraft;
  } catch {
    return { errors: ["Invalid draft data. Try regenerating."], warnings: [] };
  }

  if (draft.contentType !== "news") {
    return { errors: [`Expected news draft, got ${draft.contentType}.`], warnings: [] };
  }

  const safe = normalizeGeneratedDraftForSave(draft) as ReturnType<typeof normalizeGeneratedDraftForSave> & { contentType: "news" };
  const input = newsInputFromDraft(safe as GeneratedNewsDraft);
  const result = createNewsDraft(input);

  if (!result.ok) return { errors: result.errors, warnings: result.warnings };
  redirect(`/admin/content/news/${result.id}?saved=ai-inbox`);
}

export async function saveGeneratedEventDraftAction(
  _prevState: AiSaveActionState,
  formData: FormData,
): Promise<AiSaveActionState> {
  const draftJson = formData.get("_draft_json") as string | null;
  if (!draftJson?.trim()) return { errors: ["Missing draft data."], warnings: [] };

  let draft: GeneratedDraft;
  try {
    draft = JSON.parse(draftJson) as GeneratedDraft;
  } catch {
    return { errors: ["Invalid draft data. Try regenerating."], warnings: [] };
  }

  if (draft.contentType !== "event") {
    return { errors: [`Expected event draft, got ${draft.contentType}.`], warnings: [] };
  }

  const safe = normalizeGeneratedDraftForSave(draft) as ReturnType<typeof normalizeGeneratedDraftForSave> & { contentType: "event" };
  const input = eventInputFromDraft(safe as GeneratedEventDraft);
  const result = createEventDraft(input);

  if (!result.ok) return { errors: result.errors, warnings: result.warnings };
  redirect(`/admin/content/events/${result.id}?saved=ai-inbox`);
}

export async function saveGeneratedCalendarDraftAction(
  _prevState: AiSaveActionState,
  formData: FormData,
): Promise<AiSaveActionState> {
  const draftJson = formData.get("_draft_json") as string | null;
  if (!draftJson?.trim()) return { errors: ["Missing draft data."], warnings: [] };

  let draft: GeneratedDraft;
  try {
    draft = JSON.parse(draftJson) as GeneratedDraft;
  } catch {
    return { errors: ["Invalid draft data. Try regenerating."], warnings: [] };
  }

  if (draft.contentType !== "calendar") {
    return { errors: [`Expected calendar draft, got ${draft.contentType}.`], warnings: [] };
  }

  const safe = normalizeGeneratedDraftForSave(draft) as ReturnType<typeof normalizeGeneratedDraftForSave> & { contentType: "calendar" };
  const input = calendarInputFromDraft(safe as GeneratedCalendarDraft);
  const result = createCalendarDraft(input);

  if (!result.ok) return { errors: result.errors, warnings: result.warnings };
  redirect(`/admin/content/calendar/${result.id}?saved=ai-inbox`);
}

// ── Legacy minimal save actions (backward compat — kept for fallback override) ──

export async function saveAsNewsDraftAction(formData: FormData) {
  const slug       = (formData.get("slug") as string)       || "";
  const en_title   = (formData.get("en_title") as string)   || "";
  const en_body    = (formData.get("en_body") as string)     || "";
  const source_url = (formData.get("source_url") as string)  || "";
  const category   = (formData.get("category") as string)    || "visa";

  const result = createNewsDraft({ slug, en_title, en_body, source_url, category });
  if (result.ok && result.id) redirect(`/admin/content/news/${result.id}?saved=ai-inbox`);
  redirect(`/admin/content/ai-inbox?save_error=${encodeURIComponent(result.errors.join("; "))}`);
}

export async function saveAsEventDraftAction(formData: FormData) {
  const slug       = (formData.get("slug") as string)       || "";
  const en_title   = (formData.get("en_title") as string)   || "";
  const en_body    = (formData.get("en_body") as string)     || "";
  const source_url = (formData.get("source_url") as string)  || "";
  const category   = (formData.get("category") as string)    || "holiday";

  const result = createEventDraft({ slug, en_title, en_body, source_url, category });
  if (result.ok && result.id) redirect(`/admin/content/events/${result.id}?saved=ai-inbox`);
  redirect(`/admin/content/ai-inbox?save_error=${encodeURIComponent(result.errors.join("; "))}`);
}

export async function saveAsCalendarDraftAction(formData: FormData) {
  const slug     = (formData.get("slug") as string)     || "";
  const en_title = (formData.get("en_title") as string) || "";
  const en_body  = (formData.get("en_body") as string)  || "";

  const result = createCalendarDraft({ slug, en_title, en_body });
  if (result.ok && result.id) redirect(`/admin/content/calendar/${result.id}?saved=ai-inbox`);
  redirect(`/admin/content/ai-inbox?save_error=${encodeURIComponent(result.errors.join("; "))}`);
}
