/**
 * Public read-only queries — imported ONLY by public pages.
 * Never import writer.ts here.
 */
import { db } from "./connection";
import { guides, steps } from "./schema";
import { eq, asc } from "drizzle-orm";

export interface GuideListItem {
  slug:     string;
  title:    string;
  summary:  string;
  price:    string;
  timeline: string;
  category: string;
}

export interface StepData {
  id:        string;
  stepOrder: number;
  cost:      string;
  timeEst:   string;
  title:     string;
  what:      string;
  where:     string;
  address:   string;
  advice:    string;
  warning:   string;
}

export interface GuideData {
  slug:        string;
  category:    string;
  price:       string;
  timeline:    string;
  lastUpdated: string;
  title:       string;
  summary:     string;
  audience:    string;
  overview:    string;
  steps:       StepData[];
}

export function getAllPublishedGuides(): GuideListItem[] {
  return db
    .select({
      slug:     guides.slug,
      title:    guides.enTitle,
      summary:  guides.enSummary,
      price:    guides.price,
      timeline: guides.timeline,
      category: guides.category,
    })
    .from(guides)
    .where(eq(guides.published, true))
    .all();
}

export function getPublishedGuideBySlug(slug: string): GuideData | null {
  const guide = db
    .select()
    .from(guides)
    .where(eq(guides.slug, slug))
    .get();

  if (!guide || !guide.published) return null;

  const guideSteps = db
    .select()
    .from(steps)
    .where(eq(steps.guideId, guide.id))
    .orderBy(asc(steps.stepOrder))
    .all();

  return {
    slug:        guide.slug,
    category:    guide.category,
    price:       guide.price,
    timeline:    guide.timeline,
    lastUpdated: guide.lastUpdated,
    title:       guide.enTitle,
    summary:     guide.enSummary,
    audience:    guide.enAudience,
    overview:    guide.enOverview,
    steps: guideSteps.map((s) => ({
      id:        s.id,
      stepOrder: s.stepOrder,
      cost:      s.cost,
      timeEst:   s.timeEst,
      title:     s.enTitle,
      what:      s.enWhat,
      where:     s.enWhere,
      address:   s.enAddress,
      advice:    s.enAdvice,
      warning:   s.enWarning,
    })),
  };
}
