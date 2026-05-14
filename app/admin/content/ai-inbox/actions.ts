"use server";

import { redirect } from "next/navigation";
import {
  createNewsDraft,
  createEventDraft,
  createCalendarDraft,
} from "@/lib/db/news-events-calendar-admin";

export async function saveAsNewsDraftAction(formData: FormData) {
  const slug       = (formData.get("slug") as string)        || "";
  const en_title   = (formData.get("en_title") as string)    || "";
  const en_body    = (formData.get("en_body") as string)     || "";
  const source_url = (formData.get("source_url") as string)  || "";
  const category   = (formData.get("category") as string)    || "visa";

  const result = createNewsDraft({ slug, en_title, en_body, source_url, category });
  if (result.ok && result.id) {
    redirect(`/admin/content/news/${result.id}?saved=ai-inbox`);
  }
  redirect(`/admin/content/ai-inbox?save_error=${encodeURIComponent(result.errors.join("; "))}`);
}

export async function saveAsEventDraftAction(formData: FormData) {
  const slug       = (formData.get("slug") as string)        || "";
  const en_title   = (formData.get("en_title") as string)    || "";
  const en_body    = (formData.get("en_body") as string)     || "";
  const source_url = (formData.get("source_url") as string)  || "";
  const category   = (formData.get("category") as string)    || "holiday";

  const result = createEventDraft({ slug, en_title, en_body, source_url, category });
  if (result.ok && result.id) {
    redirect(`/admin/content/events/${result.id}?saved=ai-inbox`);
  }
  redirect(`/admin/content/ai-inbox?save_error=${encodeURIComponent(result.errors.join("; "))}`);
}

export async function saveAsCalendarDraftAction(formData: FormData) {
  const slug     = (formData.get("slug") as string)     || "";
  const en_title = (formData.get("en_title") as string) || "";
  const en_body  = (formData.get("en_body") as string)  || "";

  const result = createCalendarDraft({ slug, en_title, en_body });
  if (result.ok && result.id) {
    redirect(`/admin/content/calendar/${result.id}?saved=ai-inbox`);
  }
  redirect(`/admin/content/ai-inbox?save_error=${encodeURIComponent(result.errors.join("; "))}`);
}
