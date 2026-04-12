/**
 * Admin read/write queries — imported ONLY by admin routes.
 * Never import this in public pages.
 */
import { db } from "./connection";
import { guides } from "./schema";
import { type Guide } from "./schema";
import { desc, eq } from "drizzle-orm";

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
