"use server";

import {
  createNewsDraft,
  updateNewsDraft,
} from "@/lib/db/news-events-calendar-admin";
import type { NewsInput } from "@/lib/admin-validation/news-events-calendar";
import { redirect } from "next/navigation";

export type NewsActionState = {
  errors: string[];
  warnings: string[];
};

function fd(formData: FormData, key: string): string {
  return (formData.get(key) as string | null) ?? "";
}

function fdn(formData: FormData, key: string): number {
  return formData.get(key) === "1" ? 1 : 0;
}

function buildNewsInput(formData: FormData): NewsInput {
  return {
    slug:                fd(formData, "slug").trim(),
    category:            fd(formData, "category"),
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
    source_url:          fd(formData, "source_url"),
    source_label:        fd(formData, "source_label"),
    date_published:      fd(formData, "date_published"),
    date_updated:        fd(formData, "date_updated"),
    featured_homepage:   fdn(formData, "featured_homepage"),
    featured_digest:     fdn(formData, "featured_digest"),
    noindex:             fdn(formData, "noindex"),
  };
}

export async function saveNewsDraftAction(
  _prevState: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  const id = fd(formData, "_id").trim();
  const input = buildNewsInput(formData);

  const result = id ? updateNewsDraft(id, input) : createNewsDraft(input);

  if (!result.ok) {
    return { errors: result.errors, warnings: result.warnings };
  }

  redirect(`/admin/content/news/${id || result.id}?saved=${Date.now()}`);
}
