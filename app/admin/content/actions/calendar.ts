"use server";

import {
  createCalendarDraft,
  updateCalendarDraft,
  publishCalendar,
  archiveCalendar,
} from "@/lib/db/news-events-calendar-admin";
import type { CalendarInput } from "@/lib/admin-validation/news-events-calendar";
import { redirect } from "next/navigation";

export type CalendarActionState = {
  errors: string[];
  warnings: string[];
};

function fd(formData: FormData, key: string): string {
  return (formData.get(key) as string | null) ?? "";
}

function fdn(formData: FormData, key: string): number {
  return formData.get(key) === "1" ? 1 : 0;
}

function buildCalendarInput(formData: FormData): CalendarInput {
  const yearRaw = parseInt(fd(formData, "year"), 10);
  const monthRaw = parseInt(fd(formData, "month"), 10);
  return {
    slug:                fd(formData, "slug").trim(),
    calendar_type:       fd(formData, "calendar_type"),
    year:                isNaN(yearRaw) ? 0 : yearRaw,
    month:               isNaN(monthRaw) || monthRaw < 1 ? undefined : monthRaw,
    en_title:            fd(formData, "en_title"),
    en_summary:          fd(formData, "en_summary"),
    en_body:             fd(formData, "en_body"),
    en_notes:            fd(formData, "en_notes"),
    en_seo_title:        fd(formData, "en_seo_title"),
    en_meta_description: fd(formData, "en_meta_description"),
    ru_published:        fdn(formData, "ru_published"),
    ru_title:            fd(formData, "ru_title"),
    ru_summary:          fd(formData, "ru_summary"),
    ru_body:             fd(formData, "ru_body"),
    ru_notes:            fd(formData, "ru_notes"),
    ru_seo_title:        fd(formData, "ru_seo_title"),
    ru_meta_description: fd(formData, "ru_meta_description"),
    ru_image_alt:        fd(formData, "ru_image_alt"),
    image_path:          fd(formData, "image_path").trim(),
    image_alt:           fd(formData, "image_alt"),
    dates_json:          fd(formData, "dates_json").trim() || "[]",
    has_islamic_dates:   fdn(formData, "has_islamic_dates"),
    official_source_url: fd(formData, "official_source_url").trim(),
    last_verified_date:  fd(formData, "last_verified_date").trim(),
    featured_homepage:   fdn(formData, "featured_homepage"),
  };
}

export async function saveCalendarDraftAction(
  _prevState: CalendarActionState,
  formData: FormData,
): Promise<CalendarActionState> {
  const id = fd(formData, "_id").trim();
  const input = buildCalendarInput(formData);

  const result = id ? updateCalendarDraft(id, input) : createCalendarDraft(input);

  if (!result.ok) {
    return { errors: result.errors, warnings: result.warnings };
  }

  redirect(`/admin/content/calendar/${id || result.id}?saved=${Date.now()}`);
}

export async function publishCalendarAction(
  _prevState: CalendarActionState,
  formData: FormData,
): Promise<CalendarActionState> {
  const id = fd(formData, "_id").trim();
  if (!id) return { errors: ["Missing calendar page id."], warnings: [] };

  const result = publishCalendar(id);
  if (!result.ok) return { errors: result.errors, warnings: result.warnings };

  redirect(`/admin/content/calendar/${id}?saved=${Date.now()}`);
}

export async function archiveCalendarAction(
  _prevState: CalendarActionState,
  formData: FormData,
): Promise<CalendarActionState> {
  const id = fd(formData, "_id").trim();
  if (!id) return { errors: ["Missing calendar page id."], warnings: [] };

  const result = archiveCalendar(id);
  if (!result.ok) return { errors: result.errors, warnings: result.warnings };

  redirect(`/admin/content/calendar/${id}?saved=${Date.now()}`);
}
