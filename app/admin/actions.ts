"use server";

import { db } from "@/lib/db/connection";
import { guides, steps } from "@/lib/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";
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

// ── Guide actions ─────────────────────────────────────────────────────────────

/** Creates a new guide as a draft. Redirects to /admin/guides on success. */
export async function createGuideAction(formData: FormData) {
  const enTitle  = str(formData, "enTitle");
  const timeline = str(formData, "timeline");
  if (!timeline) throw new Error("Timeline is required.");

  const slug = str(formData, "slug") || slugify(enTitle);
  const n    = now();

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
  const timeline = str(formData, "timeline");
  if (!timeline) throw new Error("Timeline is required.");

  const slug   = str(formData, "slug") || slugify(enTitle) || prevSlug;
  const intent = str(formData, "intent"); // "draft" | "publish"

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

  if (slug !== prevSlug) revalidateGuide(prevSlug);
  revalidateGuide(slug);
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

// ── Step actions ──────────────────────────────────────────────────────────────
// These actions do NOT redirect. The client calls router.refresh() after each
// one so the server-rendered step list refreshes without navigating away —
// preserving any unsaved edits in the guide form above.

/** Appends a new empty step to the guide. */
export async function createStepAction(formData: FormData) {
  const guideId = str(formData, "guideId");
  const slug    = str(formData, "slug");

  const maxRow = db
    .select({ maxOrder: sql<number>`max(${steps.stepOrder})` })
    .from(steps)
    .where(eq(steps.guideId, guideId))
    .get();

  const nextOrder = (maxRow?.maxOrder ?? 0) + 1;

  db.insert(steps).values({
    id:        randomUUID(),
    guideId,
    stepOrder: nextOrder,
    cost:      "",
    timeEst:   "",
    enTitle:   "", enWhat: "", enWhere: "", enAddress: "", enAdvice: "", enWarning: "",
    ruTitle:   "", ruWhat: "", ruWhere: "", ruAddress: "", ruAdvice: "", ruWarning: "",
  }).run();

  revalidateGuide(slug);
}

/** Saves all editable fields of a single step. */
export async function updateStepAction(formData: FormData) {
  const id      = str(formData, "id");
  const slug    = str(formData, "slug");
  const timeEst = str(formData, "timeEst");
  if (!timeEst) throw new Error("Step timeline (Estimated time) is required.");

  db.update(steps)
    .set({
      cost:      str(formData, "cost"),
      timeEst:   str(formData, "timeEst"),
      enTitle:   str(formData, "enTitle"),
      enWhat:    str(formData, "enWhat"),
      enWhere:   str(formData, "enWhere"),
      enAddress: str(formData, "enAddress"),
      enAdvice:  str(formData, "enAdvice"),
      enWarning: str(formData, "enWarning"),
      ruTitle:   str(formData, "ruTitle"),
      ruWhat:    str(formData, "ruWhat"),
      ruWhere:   str(formData, "ruWhere"),
      ruAddress: str(formData, "ruAddress"),
      ruAdvice:  str(formData, "ruAdvice"),
      ruWarning: str(formData, "ruWarning"),
    })
    .where(eq(steps.id, id))
    .run();

  revalidateGuide(slug);
}

/**
 * Deletes a step and renumbers the remaining steps contiguously.
 * e.g. deleting step 2 of [1,2,3,4] → [1,2,3]
 */
export async function deleteStepAction(formData: FormData) {
  const id      = str(formData, "id");
  const guideId = str(formData, "guideId");
  const slug    = str(formData, "slug");

  const target = db.select({ stepOrder: steps.stepOrder })
    .from(steps)
    .where(eq(steps.id, id))
    .get();

  if (!target) return;

  db.delete(steps).where(eq(steps.id, id)).run();

  // Shift every step after the deleted one down by one
  db.update(steps)
    .set({ stepOrder: sql`${steps.stepOrder} - 1` })
    .where(and(eq(steps.guideId, guideId), gt(steps.stepOrder, target.stepOrder)))
    .run();

  revalidateGuide(slug);
}

/**
 * Swaps stepOrder with the adjacent step.
 * direction: "up" moves the step earlier (lower stepOrder)
 *            "down" moves it later (higher stepOrder)
 */
export async function reorderStepAction(formData: FormData) {
  const id        = str(formData, "id");
  const guideId   = str(formData, "guideId");
  const slug      = str(formData, "slug");
  const direction = str(formData, "direction") as "up" | "down";

  const current = db.select({ stepOrder: steps.stepOrder })
    .from(steps)
    .where(eq(steps.id, id))
    .get();

  if (!current) return;

  const adjacentOrder = direction === "up"
    ? current.stepOrder - 1
    : current.stepOrder + 1;

  const adjacent = db.select({ id: steps.id })
    .from(steps)
    .where(and(eq(steps.guideId, guideId), eq(steps.stepOrder, adjacentOrder)))
    .get();

  if (!adjacent) return; // already first or last

  // Swap
  db.update(steps).set({ stepOrder: adjacentOrder }).where(eq(steps.id, id)).run();
  db.update(steps).set({ stepOrder: current.stepOrder }).where(eq(steps.id, adjacent.id)).run();

  revalidateGuide(slug);
}
