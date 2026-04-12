"use server";

import { db } from "@/lib/db/connection";
import { guides } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidateGuide } from "@/lib/revalidate";
import { redirect } from "next/navigation";

// ── Helpers ──────────────────────────────────────────────────────────────────

function now() {
  return new Date().toISOString();
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Actions ──────────────────────────────────────────────────────────────────

/** Creates a new guide as a draft. Redirects to /admin/guides on success. */
export async function createGuideAction(formData: FormData) {
  const enTitle = str(formData, "enTitle");
  const slug    = str(formData, "slug") || slugify(enTitle);
  const n       = now();

  db.insert(guides).values({
    id:          randomUUID(),
    slug,
    category:    str(formData, "category") || "visas",
    published:   false,
    price:       str(formData, "price"),
    timeline:    str(formData, "timeline"),
    lastUpdated: str(formData, "lastUpdated"),
    createdAt:   n,
    updatedAt:   n,
    enTitle,
    enSummary:   str(formData, "enSummary"),
    enAudience:  str(formData, "enAudience"),
    enOverview:  str(formData, "enOverview"),
    ruTitle:     str(formData, "ruTitle"),
    ruSummary:   str(formData, "ruSummary"),
    ruAudience:  str(formData, "ruAudience"),
    ruOverview:  str(formData, "ruOverview"),
  }).run();

  revalidateGuide(slug);
  redirect("/admin/guides");
}

/** Saves all editable fields of an existing guide. Redirects back to edit page. */
export async function updateGuideAction(formData: FormData) {
  const id       = str(formData, "id");
  const prevSlug = str(formData, "prevSlug");
  const enTitle  = str(formData, "enTitle");
  const slug     = str(formData, "slug") || slugify(enTitle) || prevSlug;
  const intent   = str(formData, "intent"); // "draft" | "publish"

  db.update(guides)
    .set({
      slug,
      category:    str(formData, "category") || "visas",
      price:       str(formData, "price"),
      timeline:    str(formData, "timeline"),
      lastUpdated: str(formData, "lastUpdated"),
      updatedAt:   now(),
      ...(intent === "publish" ? { published: true } : {}),
      enTitle,
      enSummary:   str(formData, "enSummary"),
      enAudience:  str(formData, "enAudience"),
      enOverview:  str(formData, "enOverview"),
      ruTitle:     str(formData, "ruTitle"),
      ruSummary:   str(formData, "ruSummary"),
      ruAudience:  str(formData, "ruAudience"),
      ruOverview:  str(formData, "ruOverview"),
    })
    .where(eq(guides.id, id))
    .run();

  // If slug changed, revalidate the old path so it no longer serves stale content
  if (slug !== prevSlug) {
    revalidateGuide(prevSlug);
  }
  revalidateGuide(slug);
  // Use a unique timestamp so the URL changes on every save.
  // A changed URL forces React to remount the form, which correctly
  // re-applies defaultValue from the freshly-written SQLite row.
  redirect(`/admin/guides/${slug}?saved=${Date.now()}`);
}

/**
 * Toggles published status.
 * Hidden field "published" carries the NEW target value ("true" / "false").
 */
export async function setPublishedAction(formData: FormData) {
  const id        = str(formData, "id");
  const slug      = str(formData, "slug");
  const published = str(formData, "published") === "true";

  db.update(guides)
    .set({ published, updatedAt: now() })
    .where(eq(guides.id, id))
    .run();

  revalidateGuide(slug);
  redirect(`/admin/guides/${slug}?saved=${Date.now()}`);
}

/** Permanently deletes a guide and its steps (cascade). Redirects to guide list. */
export async function deleteGuideAction(formData: FormData) {
  const id   = str(formData, "id");
  const slug = str(formData, "slug");

  db.delete(guides).where(eq(guides.id, id)).run();

  revalidateGuide(slug);
  redirect("/admin/guides");
}
