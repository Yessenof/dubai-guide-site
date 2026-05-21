"use server";

import {
  createEventDraft,
  updateEventDraft,
  publishEvent,
  archiveEvent,
} from "@/lib/db/news-events-calendar-admin";
import type { EventInput } from "@/lib/admin-validation/news-events-calendar";
import { redirect } from "next/navigation";

export type EventActionState = {
  errors: string[];
  warnings: string[];
};

function fd(formData: FormData, key: string): string {
  return (formData.get(key) as string | null) ?? "";
}

function fdn(formData: FormData, key: string): number {
  return formData.get(key) === "1" ? 1 : 0;
}

function buildEventInput(formData: FormData): EventInput {
  return {
    slug:                fd(formData, "slug").trim(),
    category:            fd(formData, "category"),
    color_type:          fd(formData, "color_type"),
    tags_json:           fd(formData, "tags_json").trim() || "[]",
    en_title:            fd(formData, "en_title"),
    en_summary:          fd(formData, "en_summary"),
    en_body:             fd(formData, "en_body"),
    en_seo_title:        fd(formData, "en_seo_title"),
    en_meta_description: fd(formData, "en_meta_description"),
    ru_published:        fdn(formData, "ru_published"),
    ru_title:            fd(formData, "ru_title"),
    ru_summary:          fd(formData, "ru_summary"),
    ru_body:             fd(formData, "ru_body"),
    ru_seo_title:        fd(formData, "ru_seo_title"),
    ru_meta_description: fd(formData, "ru_meta_description"),
    event_date_start:    fd(formData, "event_date_start"),
    event_date_end:      fd(formData, "event_date_end"),
    date_confidence:     fd(formData, "date_confidence"),
    year:                parseInt(fd(formData, "year"), 10) || 0,
    source_url:          fd(formData, "source_url"),
    schema_eligible:     fdn(formData, "schema_eligible"),
    featured_homepage:   fdn(formData, "featured_homepage"),
    featured_calendar:   fdn(formData, "featured_calendar"),
    featured_digest:     fdn(formData, "featured_digest"),
    related_guide_slug:  fd(formData, "related_guide_slug"),
    related_news_slug:   fd(formData, "related_news_slug"),
  };
}

export async function saveEventDraftAction(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const id = fd(formData, "_id").trim();
  const input = buildEventInput(formData);

  const result = id ? updateEventDraft(id, input) : createEventDraft(input);

  if (!result.ok) {
    return { errors: result.errors, warnings: result.warnings };
  }

  redirect(`/admin/content/events/${id || result.id}?saved=${Date.now()}`);
}

export async function publishEventAction(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const id = fd(formData, "_id").trim();
  if (!id) return { errors: ["Missing event id."], warnings: [] };

  const result = publishEvent(id);
  if (!result.ok) return { errors: result.errors, warnings: result.warnings };

  redirect(`/admin/content/events/${id}?saved=${Date.now()}`);
}

export async function archiveEventAction(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const id = fd(formData, "_id").trim();
  if (!id) return { errors: ["Missing event id."], warnings: [] };

  const result = archiveEvent(id);
  if (!result.ok) return { errors: result.errors, warnings: result.warnings };

  redirect(`/admin/content/events/${id}?saved=${Date.now()}`);
}
