/**
 * Public read-only queries for news_posts, events, calendar_pages.
 * Imported ONLY by public pages. Never import writer.ts here.
 *
 * EN gate:  status = 'published'
 * RU gate:  status = 'published' AND ru_published = 1
 * No EN fallback on RU routes — locale field returned as-is, never falls back.
 */

import { db } from "./connection";
import { newsPosts, eventsTable, calendarPages } from "./schema";
import { eq, and, desc, asc } from "drizzle-orm";

// ─── Locale ───────────────────────────────────────────────────────────────────

export type Locale = "en" | "ru";

// No fallback — returns the locale field as-is. Empty string is a valid RU result.
function field(locale: Locale, ru: string, en: string): string {
  return locale === "ru" ? ru : en;
}

// ─── Calendar date item ───────────────────────────────────────────────────────

export interface CalendarDateItem {
  date:       string;   // ISO 8601, e.g. "2026-12-02"
  label_en:   string;
  label_ru:   string;
  type:       "public-holiday" | "important-date" | "deadline" | "other";
  confidence: "confirmed" | "expected" | "subject_to_official_confirmation";
  source?:    string;   // URL, optional
  // Optional indexed brief fields — additive, backward compatible
  brief_en?:        string;
  brief_ru?:        string;
  who_for_en?:      string;
  who_for_ru?:      string;
  what_to_do_en?:   string;
  what_to_do_ru?:   string;
  source_label_en?: string;
  source_label_ru?: string;
  source_url?:      string;
  source_status?:   "confirmed" | "expected" | "monitoring";
  cta_type?:        "view_details" | "read_guide" | "open_event" | "open_source" | "add_calendar" | "ask_guidex";
  cta_url?:         string;
  cta_label_en?:    string;
  cta_label_ru?:    string;
  location_en?:     string;
  location_ru?:     string;
  risk_level?:      "low" | "medium" | "high";
  lifecycle?:       string;
  noindex_after?:   string;
  archive_action?:  string;
  detail_url?:      string;
}

function parseDatesJson(raw: string): CalendarDateItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("[calendar] dates_json is not an array — returning []");
      return [];
    }
    return parsed as CalendarDateItem[];
  } catch {
    console.warn("[calendar] dates_json parse failed:", raw.slice(0, 80));
    return [];
  }
}

// ─── News post interfaces ─────────────────────────────────────────────────────

export interface NewsPostSummary {
  slug:             string;
  category:         string;
  tagsJson:         string;
  title:            string;   // locale field, no fallback
  summary:          string;   // locale field, no fallback
  datePublished:    string;
  dateUpdated:      string;
  sourceLabel:      string;
  imagePath:        string;
  imageAlt:         string;   // locale field, no fallback
  featuredHomepage: number;
  featuredDigest:   number;
}

export interface NewsPostDetail extends NewsPostSummary {
  body:               string;   // locale field, no fallback
  seoTitle:           string;   // locale field, no fallback
  metaDescription:    string;   // locale field, no fallback
  sourceUrl:          string;
  noindex:            number;
  relatedGuideSlug:   string;
  relatedServiceSlug: string;
  relatedToolSlug:    string;
}

// ─── Event interfaces ─────────────────────────────────────────────────────────

export interface EventSummary {
  slug:             string;
  category:         string;
  colorType:        string;
  tagsJson:         string;
  title:            string;   // locale field, no fallback
  summary:          string;   // locale field, no fallback
  eventDateStart:   string;
  eventDateEnd:     string;
  dateConfidence:   string;   // never transformed — exposed as stored
  year:             number;
  featuredHomepage: number;
  featuredCalendar: number;
  featuredDigest:   number;
  schemaEligible:   number;
}

export interface EventDetail extends EventSummary {
  body:             string;   // locale field, no fallback
  seoTitle:         string;   // locale field, no fallback
  metaDescription:  string;   // locale field, no fallback
  sourceUrl:        string;
  relatedGuideSlug: string;
  relatedNewsSlug:  string;
}

// ─── Calendar page interfaces ─────────────────────────────────────────────────

export interface CalendarPageSummary {
  slug:             string;
  calendarType:     string;
  year:             number;
  month:            number | null;
  title:            string;   // locale field, no fallback
  summary:          string;   // locale field, no fallback
  imagePath:        string;
  imageAlt:         string;   // locale field, no fallback; may be "" for RU
  hasIslamicDates:  number;
  featuredHomepage: number;
  dates:            CalendarDateItem[];   // parsed from dates_json
}

export interface CalendarPageDetail extends CalendarPageSummary {
  body:              string;   // locale field, no fallback
  notes:             string;   // locale field, no fallback; may be "" for RU
  seoTitle:          string;   // locale field, no fallback
  metaDescription:   string;   // locale field, no fallback
  officialSourceUrl: string;
  lastVerifiedDate:  string;
}

// ─── News readers ─────────────────────────────────────────────────────────────

export function getPublishedNewsPosts(locale: Locale): NewsPostSummary[] {
  const where =
    locale === "ru"
      ? and(eq(newsPosts.status, "published"), eq(newsPosts.ruPublished, 1))
      : eq(newsPosts.status, "published");

  const rows = db
    .select({
      slug:             newsPosts.slug,
      category:         newsPosts.category,
      tagsJson:         newsPosts.tagsJson,
      enTitle:          newsPosts.enTitle,
      ruTitle:          newsPosts.ruTitle,
      enSummary:        newsPosts.enSummary,
      ruSummary:        newsPosts.ruSummary,
      datePublished:    newsPosts.datePublished,
      dateUpdated:      newsPosts.dateUpdated,
      sourceLabel:      newsPosts.sourceLabel,
      imagePath:        newsPosts.imagePath,
      imageAlt:         newsPosts.imageAlt,
      ruImageAlt:       newsPosts.ruImageAlt,
      featuredHomepage: newsPosts.featuredHomepage,
      featuredDigest:   newsPosts.featuredDigest,
    })
    .from(newsPosts)
    .where(where)
    .orderBy(desc(newsPosts.datePublished))
    .all();

  return rows
    .filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)
    .map((r) => ({
      slug:             r.slug,
      category:         r.category,
      tagsJson:         r.tagsJson,
      title:            field(locale, r.ruTitle, r.enTitle),
      summary:          field(locale, r.ruSummary, r.enSummary),
      datePublished:    r.datePublished,
      dateUpdated:      r.dateUpdated,
      sourceLabel:      r.sourceLabel,
      imagePath:        r.imagePath,
      imageAlt:         field(locale, r.ruImageAlt, r.imageAlt),
      featuredHomepage: r.featuredHomepage,
      featuredDigest:   r.featuredDigest,
    }));
}

export function getFeaturedNewsPosts(
  locale: Locale,
  limit: number = 3,
): NewsPostSummary[] {
  const where =
    locale === "ru"
      ? and(
          eq(newsPosts.status, "published"),
          eq(newsPosts.ruPublished, 1),
          eq(newsPosts.featuredHomepage, 1),
        )
      : and(
          eq(newsPosts.status, "published"),
          eq(newsPosts.featuredHomepage, 1),
        );

  const rows = db
    .select({
      slug:             newsPosts.slug,
      category:         newsPosts.category,
      tagsJson:         newsPosts.tagsJson,
      enTitle:          newsPosts.enTitle,
      ruTitle:          newsPosts.ruTitle,
      enSummary:        newsPosts.enSummary,
      ruSummary:        newsPosts.ruSummary,
      datePublished:    newsPosts.datePublished,
      dateUpdated:      newsPosts.dateUpdated,
      sourceLabel:      newsPosts.sourceLabel,
      imagePath:        newsPosts.imagePath,
      imageAlt:         newsPosts.imageAlt,
      ruImageAlt:       newsPosts.ruImageAlt,
      featuredHomepage: newsPosts.featuredHomepage,
      featuredDigest:   newsPosts.featuredDigest,
    })
    .from(newsPosts)
    .where(where)
    .orderBy(desc(newsPosts.datePublished))
    .limit(limit)
    .all();

  return rows
    .filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)
    .map((r) => ({
      slug:             r.slug,
      category:         r.category,
      tagsJson:         r.tagsJson,
      title:            field(locale, r.ruTitle, r.enTitle),
      summary:          field(locale, r.ruSummary, r.enSummary),
      datePublished:    r.datePublished,
      dateUpdated:      r.dateUpdated,
      sourceLabel:      r.sourceLabel,
      imagePath:        r.imagePath,
      imageAlt:         field(locale, r.ruImageAlt, r.imageAlt),
      featuredHomepage: r.featuredHomepage,
      featuredDigest:   r.featuredDigest,
    }));
}

export function getNewsPostBySlug(
  slug: string,
  locale: Locale,
): NewsPostDetail | null {
  const where =
    locale === "ru"
      ? and(
          eq(newsPosts.slug, slug),
          eq(newsPosts.status, "published"),
          eq(newsPosts.ruPublished, 1),
        )
      : and(eq(newsPosts.slug, slug), eq(newsPosts.status, "published"));

  const row = db.select().from(newsPosts).where(where).get();
  if (!row) return null;

  // Strict RU gate: both ru_title and ru_body must be non-empty
  if (locale === "ru" && (row.ruTitle.trim() === "" || row.ruBody.trim() === "")) return null;

  return {
    slug:               row.slug,
    category:           row.category,
    tagsJson:           row.tagsJson,
    title:              field(locale, row.ruTitle, row.enTitle),
    summary:            field(locale, row.ruSummary, row.enSummary),
    body:               field(locale, row.ruBody, row.enBody),
    seoTitle:           field(locale, row.ruSeoTitle, row.enSeoTitle),
    metaDescription:    field(locale, row.ruMetaDescription, row.enMetaDescription),
    datePublished:      row.datePublished,
    dateUpdated:        row.dateUpdated,
    sourceLabel:        row.sourceLabel,
    sourceUrl:          row.sourceUrl,
    imagePath:          row.imagePath,
    imageAlt:           field(locale, row.ruImageAlt, row.imageAlt),
    noindex:            row.noindex,
    featuredHomepage:   row.featuredHomepage,
    featuredDigest:     row.featuredDigest,
    relatedGuideSlug:   row.relatedGuideSlug,
    relatedServiceSlug: row.relatedServiceSlug,
    relatedToolSlug:    row.relatedToolSlug,
  };
}

// ─── Event readers ────────────────────────────────────────────────────────────

export function getPublishedEvents(locale: Locale): EventSummary[] {
  const where =
    locale === "ru"
      ? and(eq(eventsTable.status, "published"), eq(eventsTable.ruPublished, 1))
      : eq(eventsTable.status, "published");

  const rows = db
    .select({
      slug:             eventsTable.slug,
      category:         eventsTable.category,
      colorType:        eventsTable.colorType,
      tagsJson:         eventsTable.tagsJson,
      enTitle:          eventsTable.enTitle,
      ruTitle:          eventsTable.ruTitle,
      enSummary:        eventsTable.enSummary,
      ruSummary:        eventsTable.ruSummary,
      eventDateStart:   eventsTable.eventDateStart,
      eventDateEnd:     eventsTable.eventDateEnd,
      dateConfidence:   eventsTable.dateConfidence,
      year:             eventsTable.year,
      featuredHomepage: eventsTable.featuredHomepage,
      featuredCalendar: eventsTable.featuredCalendar,
      featuredDigest:   eventsTable.featuredDigest,
      schemaEligible:   eventsTable.schemaEligible,
    })
    .from(eventsTable)
    .where(where)
    .orderBy(asc(eventsTable.eventDateStart))
    .all();

  return rows
    .filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)
    .map((r) => ({
      slug:             r.slug,
      category:         r.category,
      colorType:        r.colorType,
      tagsJson:         r.tagsJson,
      title:            field(locale, r.ruTitle, r.enTitle),
      summary:          field(locale, r.ruSummary, r.enSummary),
      eventDateStart:   r.eventDateStart,
      eventDateEnd:     r.eventDateEnd,
      dateConfidence:   r.dateConfidence,
      year:             r.year,
      featuredHomepage: r.featuredHomepage,
      featuredCalendar: r.featuredCalendar,
      featuredDigest:   r.featuredDigest,
      schemaEligible:   r.schemaEligible,
    }));
}

export function getFeaturedEvents(
  locale: Locale,
  limit: number = 5,
): EventSummary[] {
  const where =
    locale === "ru"
      ? and(
          eq(eventsTable.status, "published"),
          eq(eventsTable.ruPublished, 1),
          eq(eventsTable.featuredHomepage, 1),
        )
      : and(
          eq(eventsTable.status, "published"),
          eq(eventsTable.featuredHomepage, 1),
        );

  const rows = db
    .select({
      slug:             eventsTable.slug,
      category:         eventsTable.category,
      colorType:        eventsTable.colorType,
      tagsJson:         eventsTable.tagsJson,
      enTitle:          eventsTable.enTitle,
      ruTitle:          eventsTable.ruTitle,
      enSummary:        eventsTable.enSummary,
      ruSummary:        eventsTable.ruSummary,
      eventDateStart:   eventsTable.eventDateStart,
      eventDateEnd:     eventsTable.eventDateEnd,
      dateConfidence:   eventsTable.dateConfidence,
      year:             eventsTable.year,
      featuredHomepage: eventsTable.featuredHomepage,
      featuredCalendar: eventsTable.featuredCalendar,
      featuredDigest:   eventsTable.featuredDigest,
      schemaEligible:   eventsTable.schemaEligible,
    })
    .from(eventsTable)
    .where(where)
    .orderBy(asc(eventsTable.eventDateStart))
    .limit(limit)
    .all();

  return rows
    .filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)
    .map((r) => ({
      slug:             r.slug,
      category:         r.category,
      colorType:        r.colorType,
      tagsJson:         r.tagsJson,
      title:            field(locale, r.ruTitle, r.enTitle),
      summary:          field(locale, r.ruSummary, r.enSummary),
      eventDateStart:   r.eventDateStart,
      eventDateEnd:     r.eventDateEnd,
      dateConfidence:   r.dateConfidence,
      year:             r.year,
      featuredHomepage: r.featuredHomepage,
      featuredCalendar: r.featuredCalendar,
      featuredDigest:   r.featuredDigest,
      schemaEligible:   r.schemaEligible,
    }));
}

export function getEventBySlug(
  slug: string,
  locale: Locale,
): EventDetail | null {
  const where =
    locale === "ru"
      ? and(
          eq(eventsTable.slug, slug),
          eq(eventsTable.status, "published"),
          eq(eventsTable.ruPublished, 1),
        )
      : and(eq(eventsTable.slug, slug), eq(eventsTable.status, "published"));

  const row = db.select().from(eventsTable).where(where).get();
  if (!row) return null;

  // Strict RU gate: both ru_title and ru_body must be non-empty
  if (locale === "ru" && (row.ruTitle.trim() === "" || row.ruBody.trim() === "")) return null;

  return {
    slug:             row.slug,
    category:         row.category,
    colorType:        row.colorType,
    tagsJson:         row.tagsJson,
    title:            field(locale, row.ruTitle, row.enTitle),
    summary:          field(locale, row.ruSummary, row.enSummary),
    body:             field(locale, row.ruBody, row.enBody),
    seoTitle:         field(locale, row.ruSeoTitle, row.enSeoTitle),
    metaDescription:  field(locale, row.ruMetaDescription, row.enMetaDescription),
    eventDateStart:   row.eventDateStart,
    eventDateEnd:     row.eventDateEnd,
    dateConfidence:   row.dateConfidence,
    year:             row.year,
    featuredHomepage: row.featuredHomepage,
    featuredCalendar: row.featuredCalendar,
    featuredDigest:   row.featuredDigest,
    schemaEligible:   row.schemaEligible,
    sourceUrl:        row.sourceUrl,
    relatedGuideSlug: row.relatedGuideSlug,
    relatedNewsSlug:  row.relatedNewsSlug,
  };
}

// ─── Calendar page readers ────────────────────────────────────────────────────

export function getPublishedCalendarPages(locale: Locale): CalendarPageSummary[] {
  const where =
    locale === "ru"
      ? and(
          eq(calendarPages.status, "published"),
          eq(calendarPages.ruPublished, 1),
        )
      : eq(calendarPages.status, "published");

  const rows = db
    .select({
      slug:             calendarPages.slug,
      calendarType:     calendarPages.calendarType,
      year:             calendarPages.year,
      month:            calendarPages.month,
      enTitle:          calendarPages.enTitle,
      ruTitle:          calendarPages.ruTitle,
      enSummary:        calendarPages.enSummary,
      ruSummary:        calendarPages.ruSummary,
      imagePath:        calendarPages.imagePath,
      imageAlt:         calendarPages.imageAlt,
      ruImageAlt:       calendarPages.ruImageAlt,
      hasIslamicDates:  calendarPages.hasIslamicDates,
      featuredHomepage: calendarPages.featuredHomepage,
      datesJson:        calendarPages.datesJson,
    })
    .from(calendarPages)
    .where(where)
    .orderBy(desc(calendarPages.year), asc(calendarPages.month))
    .all();

  return rows
    .filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)
    .map((r) => ({
      slug:             r.slug,
      calendarType:     r.calendarType,
      year:             r.year,
      month:            r.month,
      title:            field(locale, r.ruTitle, r.enTitle),
      summary:          field(locale, r.ruSummary, r.enSummary),
      imagePath:        r.imagePath,
      imageAlt:         field(locale, r.ruImageAlt, r.imageAlt),
      hasIslamicDates:  r.hasIslamicDates,
      featuredHomepage: r.featuredHomepage,
      dates:            parseDatesJson(r.datesJson),
    }));
}

export function getFeaturedCalendarPages(
  locale: Locale,
  limit: number = 3,
): CalendarPageSummary[] {
  const where =
    locale === "ru"
      ? and(
          eq(calendarPages.status, "published"),
          eq(calendarPages.ruPublished, 1),
          eq(calendarPages.featuredHomepage, 1),
        )
      : and(
          eq(calendarPages.status, "published"),
          eq(calendarPages.featuredHomepage, 1),
        );

  const rows = db
    .select({
      slug:             calendarPages.slug,
      calendarType:     calendarPages.calendarType,
      year:             calendarPages.year,
      month:            calendarPages.month,
      enTitle:          calendarPages.enTitle,
      ruTitle:          calendarPages.ruTitle,
      enSummary:        calendarPages.enSummary,
      ruSummary:        calendarPages.ruSummary,
      imagePath:        calendarPages.imagePath,
      imageAlt:         calendarPages.imageAlt,
      ruImageAlt:       calendarPages.ruImageAlt,
      hasIslamicDates:  calendarPages.hasIslamicDates,
      featuredHomepage: calendarPages.featuredHomepage,
      datesJson:        calendarPages.datesJson,
    })
    .from(calendarPages)
    .where(where)
    .orderBy(desc(calendarPages.year), asc(calendarPages.month))
    .limit(limit)
    .all();

  return rows
    .filter((r) => locale === "ru" ? r.ruTitle.trim() !== "" : true)
    .map((r) => ({
      slug:             r.slug,
      calendarType:     r.calendarType,
      year:             r.year,
      month:            r.month,
      title:            field(locale, r.ruTitle, r.enTitle),
      summary:          field(locale, r.ruSummary, r.enSummary),
      imagePath:        r.imagePath,
      imageAlt:         field(locale, r.ruImageAlt, r.imageAlt),
      hasIslamicDates:  r.hasIslamicDates,
      featuredHomepage: r.featuredHomepage,
      dates:            parseDatesJson(r.datesJson),
    }));
}

export function getCalendarPageBySlug(
  slug: string,
  locale: Locale,
): CalendarPageDetail | null {
  const where =
    locale === "ru"
      ? and(
          eq(calendarPages.slug, slug),
          eq(calendarPages.status, "published"),
          eq(calendarPages.ruPublished, 1),
        )
      : and(
          eq(calendarPages.slug, slug),
          eq(calendarPages.status, "published"),
        );

  const row = db.select().from(calendarPages).where(where).get();
  if (!row) return null;

  // Strict RU gate: both ru_title and ru_body must be non-empty
  if (locale === "ru" && (row.ruTitle.trim() === "" || row.ruBody.trim() === "")) return null;

  return {
    slug:              row.slug,
    calendarType:      row.calendarType,
    year:              row.year,
    month:             row.month,
    title:             field(locale, row.ruTitle, row.enTitle),
    summary:           field(locale, row.ruSummary, row.enSummary),
    body:              field(locale, row.ruBody, row.enBody),
    notes:             field(locale, row.ruNotes, row.enNotes),   // ru_notes may be "" — that's valid
    seoTitle:          field(locale, row.ruSeoTitle, row.enSeoTitle),
    metaDescription:   field(locale, row.ruMetaDescription, row.enMetaDescription),
    imagePath:         row.imagePath,
    imageAlt:          field(locale, row.ruImageAlt, row.imageAlt),   // ru_image_alt may be "" — valid if no image
    hasIslamicDates:   row.hasIslamicDates,
    officialSourceUrl: row.officialSourceUrl,
    lastVerifiedDate:  row.lastVerifiedDate,
    featuredHomepage:  row.featuredHomepage,
    dates:             parseDatesJson(row.datesJson),
  };
}
