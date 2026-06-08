/**
 * Public read-only queries — imported ONLY by public pages.
 * Never import writer.ts here.
 */
import { db } from "./connection";
import { guides, steps } from "./schema";
import { eq, asc, desc, and, inArray } from "drizzle-orm";

// ─── Locale support ──────────────────────────────────────────────────────────

export type Locale = "en" | "ru";

/** Field-level locale pick with EN fallback when RU field is empty. */
function pick(locale: Locale, ru: string, en: string): string {
  return locale === "ru" && ru.trim() !== "" ? ru : en;
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

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
  slug:          string;
  category:      string;
  price:         string;
  timeline:      string;
  lastUpdated:   string;
  updatedAt:     string;    // ISO timestamp of last admin save — used for dateModified in Article schema
  title:         string;
  summary:       string;
  audience:      string;
  overview:      string;
  hasRuContent:  boolean;   // true when ru_title is non-empty — used for hreflang decisions
  steps:         StepData[];
}

export interface BandGuideItem {
  slug:     string;
  title:    string;
  summary:  string;
  audience: string;
  price:    string;
  timeline: string;
  category: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getPublishedGuidesForBand(
  slugs: string[],
  locale: Locale = "en",
): BandGuideItem[] {
  if (slugs.length === 0) return [];
  const rows = db
    .select({
      slug:       guides.slug,
      enTitle:    guides.enTitle,
      ruTitle:    guides.ruTitle,
      enSummary:  guides.enSummary,
      ruSummary:  guides.ruSummary,
      enAudience: guides.enAudience,
      ruAudience: guides.ruAudience,
      price:      guides.price,
      timeline:   guides.timeline,
      category:   guides.category,
    })
    .from(guides)
    .where(and(eq(guides.published, true), inArray(guides.slug, slugs)))
    .all();

  return rows.map((r) => ({
    slug:     r.slug,
    title:    pick(locale, r.ruTitle, r.enTitle),
    summary:  pick(locale, r.ruSummary, r.enSummary),
    audience: pick(locale, r.ruAudience, r.enAudience),
    price:    r.price,
    timeline: r.timeline,
    category: r.category,
  }));
}

export function getRecentPublishedGuides(limit: number): GuideListItem[] {
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
    .orderBy(desc(guides.updatedAt))
    .limit(limit)
    .all();
}

/** Like getRecentPublishedGuides but returns locale-aware fields.
 *  For "ru": filters to guides with non-empty ru_title, returns RU fields. */
export function getRecentPublishedGuidesLocale(
  limit: number,
  locale: Locale = "en",
): GuideListItem[] {
  if (locale !== "ru") return getRecentPublishedGuides(limit);

  const rows = db
    .select({
      slug:      guides.slug,
      enTitle:   guides.enTitle,
      ruTitle:   guides.ruTitle,
      enSummary: guides.enSummary,
      ruSummary: guides.ruSummary,
      price:     guides.price,
      timeline:  guides.timeline,
      category:  guides.category,
    })
    .from(guides)
    .where(eq(guides.published, true))
    .orderBy(desc(guides.updatedAt))
    .all();

  return rows
    .filter((r) => r.ruTitle.trim() !== "")
    .slice(0, limit)
    .map((r) => ({
      slug:     r.slug,
      title:    r.ruTitle,
      summary:  r.ruSummary,
      price:    r.price,
      timeline: r.timeline,
      category: r.category,
    }));
}

export function getAllPublishedGuides(locale: Locale = "en"): GuideListItem[] {
  const rows = db
    .select({
      slug:      guides.slug,
      enTitle:   guides.enTitle,
      ruTitle:   guides.ruTitle,
      enSummary: guides.enSummary,
      ruSummary: guides.ruSummary,
      price:     guides.price,
      timeline:  guides.timeline,
      category:  guides.category,
    })
    .from(guides)
    .where(eq(guides.published, true))
    .all();

  return rows.map((r) => ({
    slug:     r.slug,
    title:    pick(locale, r.ruTitle, r.enTitle),
    summary:  pick(locale, r.ruSummary, r.enSummary),
    price:    r.price,
    timeline: r.timeline,
    category: r.category,
  }));
}

/** Returns slugs of published guides that have a non-empty ru_title. */
export function getRuPublishedGuidesSlugs(): string[] {
  const rows = db
    .select({ slug: guides.slug, ruTitle: guides.ruTitle })
    .from(guides)
    .where(eq(guides.published, true))
    .all();
  return rows
    .filter((r) => r.ruTitle.trim() !== "")
    .map((r) => r.slug);
}

export function getGuideGroup(
  slugs: string[],
  locale: Locale = "en",
): GuideData[] {
  return slugs.flatMap((slug) => {
    const guide = db.select().from(guides).where(eq(guides.slug, slug)).get();
    if (!guide) return [];
    const guideSteps = db
      .select()
      .from(steps)
      .where(eq(steps.guideId, guide.id))
      .orderBy(asc(steps.stepOrder))
      .all();
    const data: GuideData = {
      slug:         guide.slug,
      category:     guide.category,
      price:        guide.price,
      timeline:     guide.timeline,
      lastUpdated:  guide.lastUpdated,
      updatedAt:    guide.updatedAt,
      hasRuContent: guide.ruTitle.trim() !== "",
      title:        pick(locale, guide.ruTitle, guide.enTitle),
      summary:      pick(locale, guide.ruSummary, guide.enSummary),
      audience:     pick(locale, guide.ruAudience, guide.enAudience),
      overview:     pick(locale, guide.ruOverview, guide.enOverview),
      steps: guideSteps.map((s) => ({
        id:        s.id,
        stepOrder: s.stepOrder,
        cost:      s.cost,
        timeEst:   s.timeEst,
        title:     pick(locale, s.ruTitle, s.enTitle),
        what:      pick(locale, s.ruWhat, s.enWhat),
        where:     pick(locale, s.ruWhere, s.enWhere),
        address:   pick(locale, s.ruAddress, s.enAddress),
        advice:    pick(locale, s.ruAdvice, s.enAdvice),
        warning:   pick(locale, s.ruWarning, s.enWarning),
      })),
    };
    return [data];
  });
}

export function getPublishedGuideBySlug(
  slug: string,
  locale: Locale = "en",
): GuideData | null {
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
    slug:         guide.slug,
    category:     guide.category,
    price:        guide.price,
    timeline:     guide.timeline,
    lastUpdated:  guide.lastUpdated,
    updatedAt:    guide.updatedAt,
    hasRuContent: guide.ruTitle.trim() !== "",
    title:        pick(locale, guide.ruTitle, guide.enTitle),
    summary:      pick(locale, guide.ruSummary, guide.enSummary),
    audience:     pick(locale, guide.ruAudience, guide.enAudience),
    overview:     pick(locale, guide.ruOverview, guide.enOverview),
    steps: guideSteps.map((s) => ({
      id:        s.id,
      stepOrder: s.stepOrder,
      cost:      s.cost,
      timeEst:   s.timeEst,
      title:     pick(locale, s.ruTitle, s.enTitle),
      what:      pick(locale, s.ruWhat, s.enWhat),
      where:     pick(locale, s.ruWhere, s.enWhere),
      address:   pick(locale, s.ruAddress, s.enAddress),
      advice:    pick(locale, s.ruAdvice, s.enAdvice),
      warning:   pick(locale, s.ruWarning, s.enWarning),
    })),
  };
}
