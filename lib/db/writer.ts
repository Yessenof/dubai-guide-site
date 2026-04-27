/**
 * Admin read/write queries — imported ONLY by admin routes.
 * Never import this in public pages.
 */
import { db } from "./connection";
import { guides, steps } from "./schema";
import { type Guide, type Step } from "./schema";
import { asc, desc, eq } from "drizzle-orm";

/** Returns all steps for a guide, ordered by stepOrder ASC. */
export function getStepsByGuideId(guideId: string): Step[] {
  return db
    .select()
    .from(steps)
    .where(eq(steps.guideId, guideId))
    .orderBy(asc(steps.stepOrder))
    .all();
}

/** Returns a single guide by slug (includes drafts). */
export function getGuideBySlug(slug: string): Guide | null {
  return db.select().from(guides).where(eq(guides.slug, slug)).get() ?? null;
}

export interface AdminGuideListItem {
  slug:        string;
  enTitle:     string;
  category:    string;
  published:   boolean;
  lastUpdated: string;
  updatedAt:   string;
}

/** Returns ALL guides including drafts, ordered by most recently updated. */
export function getAllGuides(): AdminGuideListItem[] {
  return db
    .select({
      slug:        guides.slug,
      enTitle:     guides.enTitle,
      category:    guides.category,
      published:   guides.published,
      lastUpdated: guides.lastUpdated,
      updatedAt:   guides.updatedAt,
    })
    .from(guides)
    .orderBy(desc(guides.updatedAt))
    .all();
}
