/**
 * Admin read/write queries for news_posts, events, calendar_pages.
 * Imported ONLY by admin routes and server actions.
 * Never import this file in public pages.
 */
import { randomUUID } from "crypto";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "./connection";
import { calendarPages, eventsTable, newsPosts } from "./schema";
import { type CalendarPage, type HubEvent, type NewsPost } from "./schema";
import {
  validateCalendarDraft,
  validateEventDraft,
  validateNewsDraft,
  validateNewsPublish,
  type CalendarInput,
  type EventInput,
  type NewsInput,
} from "@/lib/admin-validation/news-events-calendar";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface WriteResult {
  ok: boolean;
  id?: string;
  errors: string[];
  warnings: string[];
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function nowIso(): string {
  return new Date().toISOString();
}

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function n(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const x = parseInt(v, 10);
    return isNaN(x) ? 0 : x;
  }
  return 0;
}

function uniqueConstraintError(slug: string): WriteResult {
  return {
    ok: false,
    errors: [`Slug "${slug}" is already taken by another row.`],
    warnings: [],
  };
}

// ─── News reads ───────────────────────────────────────────────────────────────

/** Returns ALL news posts including drafts and archived, ordered by most recently updated. */
export function getAllNewsPosts(): NewsPost[] {
  return db.select().from(newsPosts).orderBy(desc(newsPosts.updatedAt)).all();
}

/** Returns a single news post by id — includes drafts and archived. */
export function getNewsPostById(id: string): NewsPost | null {
  return (
    db.select().from(newsPosts).where(eq(newsPosts.id, id)).get() ?? null
  );
}

// ─── News writes ──────────────────────────────────────────────────────────────

export function newsRowToInput(row: NewsPost): NewsInput {
  return {
    slug: row.slug,
    category: row.category,
    tags_json: row.tagsJson,
    en_title: row.enTitle,
    en_summary: row.enSummary,
    en_body: row.enBody,
    en_seo_title: row.enSeoTitle,
    en_meta_description: row.enMetaDescription,
    ru_published: row.ruPublished,
    ru_title: row.ruTitle,
    ru_summary: row.ruSummary,
    ru_body: row.ruBody,
    ru_seo_title: row.ruSeoTitle,
    ru_meta_description: row.ruMetaDescription,
    ru_image_alt: row.ruImageAlt,
    source_url: row.sourceUrl,
    source_label: row.sourceLabel,
    image_path: row.imagePath,
    image_alt: row.imageAlt,
    date_published: row.datePublished,
    date_updated: row.dateUpdated,
    featured_homepage: row.featuredHomepage,
    featured_digest: row.featuredDigest,
    noindex: row.noindex,
  };
}

function newsInputToPatch(
  input: NewsInput,
): Partial<typeof newsPosts.$inferInsert> {
  const p: Partial<typeof newsPosts.$inferInsert> = {};
  if (input.slug !== undefined)                p.slug              = input.slug;
  if (input.category !== undefined)            p.category          = input.category;
  if (input.tags_json !== undefined)           p.tagsJson          = input.tags_json;
  if (input.en_title !== undefined)            p.enTitle           = input.en_title;
  if (input.en_summary !== undefined)          p.enSummary         = input.en_summary;
  if (input.en_body !== undefined)             p.enBody            = input.en_body;
  if (input.en_seo_title !== undefined)        p.enSeoTitle        = input.en_seo_title;
  if (input.en_meta_description !== undefined) p.enMetaDescription = input.en_meta_description;
  if (input.ru_published !== undefined)        p.ruPublished       = input.ru_published;
  if (input.ru_title !== undefined)            p.ruTitle           = input.ru_title;
  if (input.ru_summary !== undefined)          p.ruSummary         = input.ru_summary;
  if (input.ru_body !== undefined)             p.ruBody            = input.ru_body;
  if (input.ru_seo_title !== undefined)        p.ruSeoTitle        = input.ru_seo_title;
  if (input.ru_meta_description !== undefined) p.ruMetaDescription = input.ru_meta_description;
  if (input.ru_image_alt !== undefined)        p.ruImageAlt        = input.ru_image_alt;
  if (input.source_url !== undefined)          p.sourceUrl         = input.source_url;
  if (input.source_label !== undefined)        p.sourceLabel       = input.source_label;
  if (input.image_path !== undefined)          p.imagePath         = input.image_path;
  if (input.image_alt !== undefined)           p.imageAlt          = input.image_alt;
  if (input.date_published !== undefined)      p.datePublished     = input.date_published;
  if (input.date_updated !== undefined)        p.dateUpdated       = input.date_updated;
  if (input.featured_homepage !== undefined)   p.featuredHomepage  = input.featured_homepage;
  if (input.featured_digest !== undefined)     p.featuredDigest    = input.featured_digest;
  if (input.noindex !== undefined)             p.noindex           = input.noindex;
  return p;
}

/** Creates a new news post as a draft. Calls draft validation before writing. */
export function createNewsDraft(input: NewsInput): WriteResult {
  if (n(input.ru_published) === 1) {
    if (!s(input.ru_title).trim() || !s(input.ru_body).trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title and ru_body."],
        warnings: [],
      };
    }
  }

  const validation = validateNewsDraft(input);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const id = randomUUID();
  const ts = nowIso();

  try {
    db.insert(newsPosts).values({
      id,
      slug:               s(input.slug),
      status:             "draft",
      category:           s(input.category) || "visa",
      tagsJson:           s(input.tags_json) || "[]",
      enTitle:            s(input.en_title),
      enSummary:          s(input.en_summary),
      enBody:             s(input.en_body),
      enSeoTitle:         s(input.en_seo_title),
      enMetaDescription:  s(input.en_meta_description),
      ruPublished:        n(input.ru_published),
      ruTitle:            s(input.ru_title),
      ruSummary:          s(input.ru_summary),
      ruBody:             s(input.ru_body),
      ruSeoTitle:         s(input.ru_seo_title),
      ruMetaDescription:  s(input.ru_meta_description),
      ruImageAlt:         s(input.ru_image_alt),
      sourceUrl:          s(input.source_url),
      sourceLabel:        s(input.source_label) || "media",
      imagePath:          s(input.image_path),
      imageAlt:           s(input.image_alt),
      datePublished:      s(input.date_published),
      dateUpdated:        s(input.date_updated),
      featuredHomepage:   n(input.featured_homepage),
      featuredDigest:     n(input.featured_digest),
      noindex:            n(input.noindex),
      relatedGuideSlug:   "",
      relatedServiceSlug: "",
      relatedToolSlug:    "",
      createdAt:          ts,
      updatedAt:          ts,
    }).run();
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return uniqueConstraintError(s(input.slug));
    }
    throw e;
  }

  return { ok: true, id, errors: [], warnings: validation.warnings };
}

/**
 * Updates an existing news post draft. Merges input with the existing row,
 * runs draft validation on the merged state, then writes only the provided fields.
 * Status is always forced to "draft" — use a separate publish action to change status.
 */
export function updateNewsDraft(id: string, input: NewsInput): WriteResult {
  const existing = getNewsPostById(id);
  if (!existing) {
    return { ok: false, errors: [`News post not found: ${id}`], warnings: [] };
  }

  const merged: NewsInput = { ...newsRowToInput(existing), ...input };

  if (n(merged.ru_published) === 1) {
    if (!s(merged.ru_title).trim() || !s(merged.ru_body).trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title and ru_body."],
        warnings: [],
      };
    }
  }

  const validation = validateNewsDraft(merged);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const patch = newsInputToPatch(input);
  try {
    db.update(newsPosts)
      .set({ ...patch, status: "draft", updatedAt: nowIso() })
      .where(eq(newsPosts.id, id))
      .run();
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return uniqueConstraintError(s(input.slug ?? existing.slug));
    }
    throw e;
  }

  return { ok: true, id, errors: [], warnings: validation.warnings };
}

/**
 * Publishes a draft news post. Runs full publish validation.
 * Auto-fills empty date_published / date_updated with today before validating.
 * Archived posts cannot be published.
 */
export function publishNews(id: string): WriteResult {
  const existing = getNewsPostById(id);
  if (!existing) {
    return { ok: false, errors: [`News post not found: ${id}`], warnings: [] };
  }
  if (existing.status === "archived") {
    return {
      ok: false,
      errors: ["Cannot publish an archived post. Archive is permanent in this phase."],
      warnings: [],
    };
  }

  if (existing.ruPublished === 1) {
    if (!existing.ruTitle.trim() || !existing.ruBody.trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title and ru_body."],
        warnings: [],
      };
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const datePublished = existing.datePublished.trim() || today;
  const dateUpdated   = existing.dateUpdated.trim()   || today;

  const input: NewsInput = {
    ...newsRowToInput(existing),
    date_published: datePublished,
    date_updated:   dateUpdated,
  };

  const validation = validateNewsPublish(input);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  db.update(newsPosts)
    .set({ status: "published", datePublished, dateUpdated, updatedAt: nowIso() })
    .where(eq(newsPosts.id, id))
    .run();

  return { ok: true, id, errors: [], warnings: validation.warnings };
}

/** Archives a news post (draft or published). Status becomes "archived" permanently in this phase. */
export function archiveNews(id: string): WriteResult {
  const existing = getNewsPostById(id);
  if (!existing) {
    return { ok: false, errors: [`News post not found: ${id}`], warnings: [] };
  }

  db.update(newsPosts)
    .set({ status: "archived", updatedAt: nowIso() })
    .where(eq(newsPosts.id, id))
    .run();

  return { ok: true, id, errors: [], warnings: [] };
}

// ─── Events reads ─────────────────────────────────────────────────────────────

/** Returns ALL events including drafts and archived, ordered by event_date_start ASC. */
export function getAllEvents(): HubEvent[] {
  return db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.eventDateStart))
    .all();
}

/** Returns a single event by id — includes drafts and archived. */
export function getEventById(id: string): HubEvent | null {
  return (
    db.select().from(eventsTable).where(eq(eventsTable.id, id)).get() ?? null
  );
}

// ─── Events writes ────────────────────────────────────────────────────────────

function eventsRowToInput(row: HubEvent): EventInput {
  return {
    slug:               row.slug,
    category:           row.category,
    color_type:         row.colorType,
    tags_json:          row.tagsJson,
    en_title:           row.enTitle,
    en_summary:         row.enSummary,
    en_body:            row.enBody,
    en_seo_title:       row.enSeoTitle,
    en_meta_description: row.enMetaDescription,
    ru_published:       row.ruPublished,
    ru_title:           row.ruTitle,
    ru_summary:         row.ruSummary,
    ru_body:            row.ruBody,
    ru_seo_title:       row.ruSeoTitle,
    ru_meta_description: row.ruMetaDescription,
    event_date_start:   row.eventDateStart,
    event_date_end:     row.eventDateEnd,
    date_confidence:    row.dateConfidence,
    year:               row.year,
    source_url:         row.sourceUrl,
    schema_eligible:    row.schemaEligible,
    featured_homepage:  row.featuredHomepage,
    featured_calendar:  row.featuredCalendar,
    featured_digest:    row.featuredDigest,
  };
}

function eventInputToPatch(
  input: EventInput,
): Partial<typeof eventsTable.$inferInsert> {
  const p: Partial<typeof eventsTable.$inferInsert> = {};
  if (input.slug !== undefined)                p.slug              = input.slug;
  if (input.category !== undefined)            p.category          = input.category;
  if (input.color_type !== undefined)          p.colorType         = input.color_type;
  if (input.tags_json !== undefined)           p.tagsJson          = input.tags_json;
  if (input.en_title !== undefined)            p.enTitle           = input.en_title;
  if (input.en_summary !== undefined)          p.enSummary         = input.en_summary;
  if (input.en_body !== undefined)             p.enBody            = input.en_body;
  if (input.en_seo_title !== undefined)        p.enSeoTitle        = input.en_seo_title;
  if (input.en_meta_description !== undefined) p.enMetaDescription = input.en_meta_description;
  if (input.ru_published !== undefined)        p.ruPublished       = input.ru_published;
  if (input.ru_title !== undefined)            p.ruTitle           = input.ru_title;
  if (input.ru_summary !== undefined)          p.ruSummary         = input.ru_summary;
  if (input.ru_body !== undefined)             p.ruBody            = input.ru_body;
  if (input.ru_seo_title !== undefined)        p.ruSeoTitle        = input.ru_seo_title;
  if (input.ru_meta_description !== undefined) p.ruMetaDescription = input.ru_meta_description;
  if (input.event_date_start !== undefined)    p.eventDateStart    = input.event_date_start;
  if (input.event_date_end !== undefined)      p.eventDateEnd      = input.event_date_end;
  if (input.date_confidence !== undefined)     p.dateConfidence    = input.date_confidence;
  if (input.year !== undefined)                p.year              = input.year;
  if (input.source_url !== undefined)          p.sourceUrl         = input.source_url;
  if (input.schema_eligible !== undefined)     p.schemaEligible    = input.schema_eligible;
  if (input.featured_homepage !== undefined)   p.featuredHomepage  = input.featured_homepage;
  if (input.featured_calendar !== undefined)   p.featuredCalendar  = input.featured_calendar;
  if (input.featured_digest !== undefined)     p.featuredDigest    = input.featured_digest;
  return p;
}

/** Creates a new event as a draft. Calls draft validation before writing. */
export function createEventDraft(input: EventInput): WriteResult {
  if (n(input.ru_published) === 1) {
    if (!s(input.ru_title).trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title."],
        warnings: [],
      };
    }
  }

  const validation = validateEventDraft(input);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const id = randomUUID();
  const ts = nowIso();

  try {
    db.insert(eventsTable).values({
      id,
      slug:             s(input.slug),
      status:           "draft",
      category:         s(input.category) || "holiday",
      colorType:        s(input.color_type) || "important-date",
      tagsJson:         s(input.tags_json) || "[]",
      enTitle:          s(input.en_title),
      enSummary:        s(input.en_summary),
      enBody:           s(input.en_body),
      enSeoTitle:       s(input.en_seo_title),
      enMetaDescription: s(input.en_meta_description),
      ruPublished:      n(input.ru_published),
      ruTitle:          s(input.ru_title),
      ruSummary:        s(input.ru_summary),
      ruBody:           s(input.ru_body),
      ruSeoTitle:       s(input.ru_seo_title),
      ruMetaDescription: s(input.ru_meta_description),
      eventDateStart:   s(input.event_date_start),
      eventDateEnd:     s(input.event_date_end),
      dateConfidence:   s(input.date_confidence) || "confirmed",
      year:             n(input.year),
      sourceUrl:        s(input.source_url),
      featuredHomepage: n(input.featured_homepage),
      featuredDigest:   n(input.featured_digest),
      featuredCalendar: input.featured_calendar !== undefined ? n(input.featured_calendar) : 1,
      schemaEligible:   input.schema_eligible !== undefined ? n(input.schema_eligible) : 1,
      relatedGuideSlug: "",
      relatedNewsSlug:  "",
      createdAt:        ts,
      updatedAt:        ts,
    }).run();
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return uniqueConstraintError(s(input.slug));
    }
    throw e;
  }

  return { ok: true, id, errors: [], warnings: validation.warnings };
}

/**
 * Updates an existing event draft. Merges input with the existing row,
 * runs draft validation on the merged state, then writes only the provided fields.
 * Status is always forced to "draft".
 */
export function updateEventDraft(id: string, input: EventInput): WriteResult {
  const existing = getEventById(id);
  if (!existing) {
    return { ok: false, errors: [`Event not found: ${id}`], warnings: [] };
  }

  const merged: EventInput = { ...eventsRowToInput(existing), ...input };

  if (n(merged.ru_published) === 1) {
    if (!s(merged.ru_title).trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title."],
        warnings: [],
      };
    }
  }

  const validation = validateEventDraft(merged);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const patch = eventInputToPatch(input);
  try {
    db.update(eventsTable)
      .set({ ...patch, status: "draft", updatedAt: nowIso() })
      .where(eq(eventsTable.id, id))
      .run();
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return uniqueConstraintError(s(input.slug ?? existing.slug));
    }
    throw e;
  }

  return { ok: true, id, errors: [], warnings: validation.warnings };
}

// ─── Calendar reads ───────────────────────────────────────────────────────────

/** Returns ALL calendar pages including drafts and archived, ordered by year DESC then month DESC. */
export function getAllCalendarPages(): CalendarPage[] {
  return db
    .select()
    .from(calendarPages)
    .orderBy(desc(calendarPages.year), desc(calendarPages.month))
    .all();
}

/** Returns a single calendar page by id — includes drafts and archived. */
export function getCalendarPageById(id: string): CalendarPage | null {
  return (
    db
      .select()
      .from(calendarPages)
      .where(eq(calendarPages.id, id))
      .get() ?? null
  );
}

// ─── Calendar writes ──────────────────────────────────────────────────────────

function calendarRowToInput(row: CalendarPage): CalendarInput {
  return {
    slug:                row.slug,
    calendar_type:       row.calendarType,
    year:                row.year,
    month:               row.month ?? undefined,
    en_title:            row.enTitle,
    en_summary:          row.enSummary,
    en_body:             row.enBody,
    en_notes:            row.enNotes,
    en_seo_title:        row.enSeoTitle,
    en_meta_description: row.enMetaDescription,
    ru_published:        row.ruPublished,
    ru_title:            row.ruTitle,
    ru_summary:          row.ruSummary,
    ru_body:             row.ruBody,
    ru_notes:            row.ruNotes,
    ru_seo_title:        row.ruSeoTitle,
    ru_meta_description: row.ruMetaDescription,
    ru_image_alt:        row.ruImageAlt,
    image_path:          row.imagePath,
    image_alt:           row.imageAlt,
    dates_json:          row.datesJson,
    has_islamic_dates:   row.hasIslamicDates,
    official_source_url: row.officialSourceUrl,
    last_verified_date:  row.lastVerifiedDate,
    featured_homepage:   row.featuredHomepage,
  };
}

function calendarInputToPatch(
  input: CalendarInput,
): Partial<typeof calendarPages.$inferInsert> {
  const p: Partial<typeof calendarPages.$inferInsert> = {};
  if (input.slug !== undefined)                p.slug              = input.slug;
  if (input.calendar_type !== undefined)       p.calendarType      = input.calendar_type;
  if (input.year !== undefined)                p.year              = input.year;
  if (input.month !== undefined)               p.month             = input.month;
  if (input.en_title !== undefined)            p.enTitle           = input.en_title;
  if (input.en_summary !== undefined)          p.enSummary         = input.en_summary;
  if (input.en_body !== undefined)             p.enBody            = input.en_body;
  if (input.en_notes !== undefined)            p.enNotes           = input.en_notes;
  if (input.en_seo_title !== undefined)        p.enSeoTitle        = input.en_seo_title;
  if (input.en_meta_description !== undefined) p.enMetaDescription = input.en_meta_description;
  if (input.ru_published !== undefined)        p.ruPublished       = input.ru_published;
  if (input.ru_title !== undefined)            p.ruTitle           = input.ru_title;
  if (input.ru_summary !== undefined)          p.ruSummary         = input.ru_summary;
  if (input.ru_body !== undefined)             p.ruBody            = input.ru_body;
  if (input.ru_notes !== undefined)            p.ruNotes           = input.ru_notes;
  if (input.ru_seo_title !== undefined)        p.ruSeoTitle        = input.ru_seo_title;
  if (input.ru_meta_description !== undefined) p.ruMetaDescription = input.ru_meta_description;
  if (input.ru_image_alt !== undefined)        p.ruImageAlt        = input.ru_image_alt;
  if (input.image_path !== undefined)          p.imagePath         = input.image_path;
  if (input.image_alt !== undefined)           p.imageAlt          = input.image_alt;
  if (input.dates_json !== undefined)          p.datesJson         = input.dates_json;
  if (input.has_islamic_dates !== undefined)   p.hasIslamicDates   = input.has_islamic_dates;
  if (input.official_source_url !== undefined) p.officialSourceUrl = input.official_source_url;
  if (input.last_verified_date !== undefined)  p.lastVerifiedDate  = input.last_verified_date;
  if (input.featured_homepage !== undefined)   p.featuredHomepage  = input.featured_homepage;
  return p;
}

/** Creates a new calendar page as a draft. Calls draft validation before writing. */
export function createCalendarDraft(input: CalendarInput): WriteResult {
  if (n(input.ru_published) === 1) {
    if (!s(input.ru_title).trim() || !s(input.ru_body).trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title and ru_body."],
        warnings: [],
      };
    }
  }

  const validation = validateCalendarDraft(input);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const id = randomUUID();
  const ts = nowIso();

  try {
    db.insert(calendarPages).values({
      id,
      slug:               s(input.slug),
      status:             "draft",
      calendarType:       s(input.calendar_type) || "monthly",
      year:               n(input.year),
      month:              input.month !== undefined ? n(input.month) : null,
      enTitle:            s(input.en_title),
      enSummary:          s(input.en_summary),
      enBody:             s(input.en_body),
      enNotes:            s(input.en_notes),
      enSeoTitle:         s(input.en_seo_title),
      enMetaDescription:  s(input.en_meta_description),
      ruPublished:        n(input.ru_published),
      ruTitle:            s(input.ru_title),
      ruSummary:          s(input.ru_summary),
      ruBody:             s(input.ru_body),
      ruNotes:            s(input.ru_notes),
      ruSeoTitle:         s(input.ru_seo_title),
      ruMetaDescription:  s(input.ru_meta_description),
      ruImageAlt:         s(input.ru_image_alt),
      imagePath:          s(input.image_path),
      imageAlt:           s(input.image_alt),
      datesJson:          s(input.dates_json) || "[]",
      hasIslamicDates:    n(input.has_islamic_dates),
      officialSourceUrl:  s(input.official_source_url),
      lastVerifiedDate:   s(input.last_verified_date),
      featuredHomepage:   n(input.featured_homepage),
      createdAt:          ts,
      updatedAt:          ts,
    }).run();
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return uniqueConstraintError(s(input.slug));
    }
    throw e;
  }

  return { ok: true, id, errors: [], warnings: validation.warnings };
}

/**
 * Updates an existing calendar page draft. Merges input with the existing row,
 * runs draft validation on the merged state, then writes only the provided fields.
 * Status is always forced to "draft".
 */
export function updateCalendarDraft(
  id: string,
  input: CalendarInput,
): WriteResult {
  const existing = getCalendarPageById(id);
  if (!existing) {
    return {
      ok: false,
      errors: [`Calendar page not found: ${id}`],
      warnings: [],
    };
  }

  const merged: CalendarInput = { ...calendarRowToInput(existing), ...input };

  if (n(merged.ru_published) === 1) {
    if (!s(merged.ru_title).trim() || !s(merged.ru_body).trim()) {
      return {
        ok: false,
        errors: ["ru_published = 1 requires non-empty ru_title and ru_body."],
        warnings: [],
      };
    }
  }

  const validation = validateCalendarDraft(merged);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const patch = calendarInputToPatch(input);
  try {
    db.update(calendarPages)
      .set({ ...patch, status: "draft", updatedAt: nowIso() })
      .where(eq(calendarPages.id, id))
      .run();
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return uniqueConstraintError(s(input.slug ?? existing.slug));
    }
    throw e;
  }

  return { ok: true, id, errors: [], warnings: validation.warnings };
}
