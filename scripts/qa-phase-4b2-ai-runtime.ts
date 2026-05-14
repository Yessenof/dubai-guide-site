/**
 * Phase 4B-2 QA: AI runtime MVP — offline tests
 *
 * Tests all pure-function layers of the AI editor runtime:
 *   - getAiRuntimeStatus() gating
 *   - extractJson() markdown fence stripping
 *   - validateClassificationJson() schema + coercion
 *   - validateGeneratedDraftJson() for news / event / calendar
 *   - validateRefinementJson()
 *   - normalizeGeneratedDraftForSave() publish safety invariants
 *   - normalizeSlug / sanitizeText / sanitizeStringArray
 *   - newsInputFromDraft / eventInputFromDraft / calendarInputFromDraft field mapping
 *
 * No API key required. No DB writes. Zero side-effects.
 *
 * Run: npx tsx scripts/qa-phase-4b2-ai-runtime.ts
 */

import {
  extractJson,
  validateClassificationJson,
  validateGeneratedDraftJson,
  validateRefinementJson,
  normalizeGeneratedDraftForSave,
  normalizeSlug,
  sanitizeText,
  sanitizeStringArray,
} from "@/lib/ai/editor-schemas";
import { getAiRuntimeStatus } from "@/lib/ai/editor-runtime";

// ── Helpers ────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string, detail?: string) {
  if (cond) {
    console.log(`  ✓  ${msg}`);
    passed++;
  } else {
    console.error(`  ✗  FAIL: ${msg}${detail ? `  (${detail})` : ""}`);
    failed++;
  }
}

function section(title: string) {
  const line = "-".repeat(Math.max(0, 60 - title.length));
  console.log(`\n-- ${title} ${line}`);
}

// ── Runtime status ─────────────────────────────────────────────────────────────

section("getAiRuntimeStatus()");

const originalEnabled = process.env.AI_EDITOR_ENABLED;
const originalKey     = process.env.ANTHROPIC_API_KEY;

// disabled (flag not set)
delete process.env.AI_EDITOR_ENABLED;
delete process.env.ANTHROPIC_API_KEY;
assert(getAiRuntimeStatus() === "disabled", "returns 'disabled' when AI_EDITOR_ENABLED not set");

// missing key
process.env.AI_EDITOR_ENABLED = "true";
assert(getAiRuntimeStatus() === "missing_key", "returns 'missing_key' when key absent but flag set");

// connected
process.env.ANTHROPIC_API_KEY = "sk-test-fake-key";
assert(getAiRuntimeStatus() === "connected", "returns 'connected' when both flag and key are present");

// restore
process.env.AI_EDITOR_ENABLED = originalEnabled ?? "";
process.env.ANTHROPIC_API_KEY = originalKey ?? "";
if (!originalEnabled) delete process.env.AI_EDITOR_ENABLED;
if (!originalKey)     delete process.env.ANTHROPIC_API_KEY;

// ── extractJson ────────────────────────────────────────────────────────────────

section("extractJson()");

assert(
  extractJson('{"a":1}') === '{"a":1}',
  "plain JSON passes through unchanged",
);
assert(
  extractJson('```json\n{"a":1}\n```') === '{"a":1}',
  "strips ```json … ``` fences",
);
assert(
  extractJson('```\n{"a":1}\n```') === '{"a":1}',
  "strips plain ``` fences",
);
assert(
  extractJson('  ```json\n{"a":1}\n```  ').includes('"a"'),
  "handles leading/trailing whitespace around fenced block",
);

// ── normalizeSlug ──────────────────────────────────────────────────────────────

section("normalizeSlug()");

assert(normalizeSlug("Hello World!") === "hello-world", "normalises spaces and strips special chars");
assert(normalizeSlug("  --test-- ") === "test", "strips leading/trailing hyphens");
assert(normalizeSlug("a".repeat(100)).length <= 70, "truncates to 70 chars");
assert(normalizeSlug("") === "", "empty string returns empty string");
assert(normalizeSlug("UPPER CASE") === "upper-case", "lowercases");

// ── sanitizeText ───────────────────────────────────────────────────────────────

section("sanitizeText()");

assert(sanitizeText("Hello — world") === "Hello , world", "replaces em-dashes");
assert(sanitizeText("Hello – world") === "Hello - world", "replaces en-dashes");
assert(sanitizeText("```json\n{}\n```") === "{}", "strips markdown fences");
assert(sanitizeText("test", 4) === "test", "respects maxLen exactly");
assert(sanitizeText("hello world", 5) === "hello", "truncates at maxLen");

// ── sanitizeStringArray ────────────────────────────────────────────────────────

section("sanitizeStringArray()");

const tags = sanitizeStringArray(["hello", "World!", "  UAE  ", "very-long-tag-that-exceeds-max"], 10, 15);
assert(tags.includes("hello"), "normalises lowercase tag");
assert(tags.includes("world"), "strips non-alphanumeric from tag");
assert(!tags.some((t) => t.length > 15), "respects maxItemLen");
assert(sanitizeStringArray(null).length === 0, "null returns empty array");
assert(sanitizeStringArray("not-an-array").length === 0, "non-array returns empty array");
assert(sanitizeStringArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10).length === 10, "respects maxItems");

// ── validateClassificationJson ─────────────────────────────────────────────────

section("validateClassificationJson() — valid input");

const rawClassify = {
  suggestedType: "news",
  confidence: "high",
  sourceReliability: "official",
  riskLevel: "low",
  verificationRequired: false,
  reason: "Government announcement from official source.",
  detectedDates: ["2025-06-01", "2025-12-31"],
  sourceNotes: "Source is u.ae domain.",
};

const classified = validateClassificationJson(rawClassify);
assert(classified.suggestedType === "news",     "suggestedType preserved");
assert(classified.confidence === "high",         "confidence preserved");
assert(classified.sourceReliability === "official", "sourceReliability preserved");
assert(classified.riskLevel === "low",           "riskLevel preserved");
assert(!classified.verificationRequired,         "verificationRequired=false when low-risk official");
assert(classified.detectedDates.length === 2,    "two valid ISO dates detected");
assert(classified.reason.length > 0,             "reason preserved");

section("validateClassificationJson() — coercion / defaults");

const badClassify = {
  suggestedType: "made_up_type",
  confidence: "super-confident",
  sourceReliability: "random",
  riskLevel: "extreme",
  verificationRequired: false,
  reason: 12345,
  detectedDates: ["not-a-date", "2025-01-01", "also-bad"],
  sourceNotes: null,
};

const coerced = validateClassificationJson(badClassify);
assert(coerced.suggestedType === "news",     "invalid suggestedType defaults to 'news'");
assert(coerced.confidence === "low",         "invalid confidence defaults to 'low'");
assert(coerced.sourceReliability === "unknown", "invalid sourceReliability defaults to 'unknown'");
assert(coerced.riskLevel === "medium",       "invalid riskLevel defaults to 'medium'");
assert(coerced.verificationRequired === true, "verificationRequired forced true when source=unknown");
assert(coerced.detectedDates.length === 1,   "only valid ISO date passes through");
assert(coerced.detectedDates[0] === "2025-01-01", "valid date is '2025-01-01'");

section("validateClassificationJson() — high risk forces verificationRequired");

const highRisk = validateClassificationJson({ ...rawClassify, riskLevel: "high", verificationRequired: false });
assert(highRisk.verificationRequired === true, "high riskLevel forces verificationRequired=true");

// ── validateGeneratedDraftJson — news ─────────────────────────────────────────

section("validateGeneratedDraftJson() — news draft");

const rawNews = {
  contentType: "news",
  slug: "dubai-visa-update-2025",
  category: "visa",
  tags: ["visa", "uae", "mohre"],
  en_title: "Dubai Visa Rules Updated for 2025",
  en_summary: "MOHRE has announced new visa processing requirements for employers.",
  en_body: "A".repeat(200),
  en_seo_title: "Dubai Visa Rules 2025",
  en_meta_description: "New UAE visa rules announced by MOHRE for 2025 applications.",
  ru_title: "Обновление правил визы Дубая 2025",
  ru_summary: "MOHRE объявил новые требования.",
  ru_body: "Б".repeat(200),
  ru_seo_title: "Визовые правила ОАЭ 2025",
  ru_meta_description: "Новые правила визы ОАЭ от MOHRE.",
  source_url: "https://mohre.gov.ae/news",
  source_label: "official",
  date_published: "2025-06-01",
  date_updated: "2025-06-02",
  image_direction: "UAE official graphic",
  image_prompt: "Modern Dubai skyline with government seal",
  image_alt: "Dubai government building",
  publish_readiness: "ready",
  missing_fields: [],
  verification_notes: "",
};

const newsDraft = validateGeneratedDraftJson(rawNews, "news");
assert(newsDraft.contentType === "news",                      "contentType=news");
assert(newsDraft.slug === "dubai-visa-update-2025",           "slug preserved");
assert(newsDraft.category === "visa",                         "category preserved");
assert(newsDraft.tags.length === 3,                           "3 tags");
assert(newsDraft.en_title === "Dubai Visa Rules Updated for 2025", "en_title preserved (within 80 chars)");
assert((newsDraft as import("@/lib/ai/editor-types").GeneratedNewsDraft).date_published === "2025-06-01", "date_published preserved");

section("validateGeneratedDraftJson() — news bad slug → normalized");

const badSlugNews = validateGeneratedDraftJson({ ...rawNews, slug: "INVALID SLUG!!!", category: "bad-cat" }, "news");
assert(/^[a-z0-9-]+$/.test(badSlugNews.slug),  "slug normalised to kebab-case");
assert(badSlugNews.category === "government",   "invalid category defaults to 'government'");

// ── validateGeneratedDraftJson — event ────────────────────────────────────────

section("validateGeneratedDraftJson() — event draft");

const rawEvent = {
  ...rawNews,
  contentType: "event",
  category: "holiday",
  color_type: "public-holiday",
  event_date_start: "2025-12-01",
  event_date_end:   "2025-12-03",
  date_confidence:  "confirmed",
  year: 2025,
  schema_eligible: 1,
};

const eventDraft = validateGeneratedDraftJson(rawEvent, "event");
assert(eventDraft.contentType === "event",  "contentType=event");

const ev = eventDraft as import("@/lib/ai/editor-types").GeneratedEventDraft;
assert(ev.event_date_start === "2025-12-01", "event_date_start preserved");
assert(ev.event_date_end   === "2025-12-03", "event_date_end preserved");
assert(ev.date_confidence  === "confirmed",  "date_confidence preserved");
assert(ev.schema_eligible  === 1,            "schema_eligible=1 when confirmed+source_url");

section("validateGeneratedDraftJson() — event schema_eligible forced 0 without source_url");

const noSourceEvent = validateGeneratedDraftJson({ ...rawEvent, source_url: "" }, "event");
const noSrcEv = noSourceEvent as import("@/lib/ai/editor-types").GeneratedEventDraft;
assert(noSrcEv.schema_eligible === 0, "schema_eligible forced 0 when source_url empty");

section("validateGeneratedDraftJson() — event schema_eligible forced 0 when not confirmed");

const expectedEvent = validateGeneratedDraftJson({ ...rawEvent, date_confidence: "expected" }, "event");
const expEv = expectedEvent as import("@/lib/ai/editor-types").GeneratedEventDraft;
assert(expEv.schema_eligible === 0, "schema_eligible forced 0 when date_confidence != confirmed");

// ── validateGeneratedDraftJson — calendar ─────────────────────────────────────

section("validateGeneratedDraftJson() — calendar draft");

const rawCalendar = {
  ...rawNews,
  contentType: "calendar",
  calendar_type: "holidays",
  year: 2025,
  month: null,
  dates_json: [
    { date: "2025-01-01", label_en: "New Year", label_ru: "Новый год", type: "public-holiday", confidence: "confirmed", source: "https://u.ae" },
    { date: "bad-date",   label_en: "Invalid",  label_ru: "Плохая дата", type: "other", confidence: "expected", source: "" },
    { date: "2025-12-02", label_en: "National Day", label_ru: "День нации", type: "public-holiday", confidence: "confirmed", source: "https://u.ae" },
  ],
  official_source_url: "https://u.ae/public-holidays",
  last_verified_date: "2025-05-01",
  en_notes: "Islamic dates subject to moon sighting.",
  ru_notes: "Исламские даты уточняются.",
  has_islamic_dates: 1,
};

const calDraft = validateGeneratedDraftJson(rawCalendar, "calendar");
assert(calDraft.contentType === "calendar", "contentType=calendar");

const cal = calDraft as import("@/lib/ai/editor-types").GeneratedCalendarDraft;
assert(cal.calendar_type === "holidays",      "calendar_type preserved");
assert(cal.year === 2025,                     "year preserved");
assert(cal.month === null,                    "month=null preserved");
assert(cal.has_islamic_dates === 1,           "has_islamic_dates=1 preserved");
assert(cal.dates_json.length === 2,           "bad date entry stripped, 2 valid entries remain");
assert(cal.dates_json[0].date === "2025-01-01", "first valid date preserved");
assert(cal.last_verified_date === "2025-05-01", "last_verified_date preserved");

section("validateGeneratedDraftJson() — calendar month clamped");

const clampedCal = validateGeneratedDraftJson({ ...rawCalendar, month: 99 }, "calendar");
const clampedC = clampedCal as import("@/lib/ai/editor-types").GeneratedCalendarDraft;
assert(clampedC.month === 12, "month clamped to 12 max");

const clampedCal2 = validateGeneratedDraftJson({ ...rawCalendar, month: 0 }, "calendar");
const clampedC2 = clampedCal2 as import("@/lib/ai/editor-types").GeneratedCalendarDraft;
assert(clampedC2.month === 1, "month=0 clamps up to 1 (minimum valid month)");

// ── validateRefinementJson ─────────────────────────────────────────────────────

section("validateRefinementJson()");

const rawRefinement = {
  draft: { ...rawNews, contentType: "news" },
  changeSummary: "Updated title to be more specific — and improved meta description.",
  fieldsChanged: ["en_title", "en_meta_description"],
};

const refined = validateRefinementJson(rawRefinement, "news");
assert(refined.draft.contentType === "news",          "nested draft contentType preserved");
assert(refined.changeSummary.includes("Updated"),     "changeSummary preserved");
assert(refined.fieldsChanged.length === 2,            "fieldsChanged array preserved");
assert(!refined.changeSummary.includes("—"),          "em-dashes stripped from changeSummary");

// ── normalizeGeneratedDraftForSave ────────────────────────────────────────────

section("normalizeGeneratedDraftForSave() — publish safety invariants");

const newsToSave = validateGeneratedDraftJson(rawNews, "news");
const saved = normalizeGeneratedDraftForSave(newsToSave);

assert(saved.ru_published === 0,    "ru_published always 0 regardless of AI output");
assert(saved._forSave === true,     "_forSave marker set");
assert(/^[a-z0-9-]+$/.test(saved.slug), "slug still valid kebab-case after normalize");

section("normalizeGeneratedDraftForSave() — bad slug gets fallback");

const draftWithBadSlug = validateGeneratedDraftJson({ ...rawNews, slug: "" }, "news");
const savedBad = normalizeGeneratedDraftForSave(draftWithBadSlug);
assert(savedBad.slug.startsWith("ai-draft"), "empty slug gets ai-draft-<hash> fallback");

section("normalizeGeneratedDraftForSave() — ru_published stays 0 even if AI set it to 1");

// Manually inject ru_published=1 to simulate AI trying to auto-publish
const tampered = { ...newsToSave, ru_published: 1 } as typeof newsToSave & { ru_published: number };
const savedTampered = normalizeGeneratedDraftForSave(tampered as typeof newsToSave);
assert(savedTampered.ru_published === 0, "ru_published forced to 0 even if AI injected 1");

// ── em-dash stripping in sanitized fields ─────────────────────────────────────

section("Em-dash stripping across all text fields");

const emDashNews = validateGeneratedDraftJson({
  ...rawNews,
  en_title: "UAE — New Visa Rules",
  en_summary: "The Ministry — MOHRE — has announced changes.",
  en_body: "Key change — effective June 2025.",
  ru_title: "ОАЭ — Новые визовые правила",
}, "news");

assert(!emDashNews.en_title.includes("—"),   "em-dash stripped from en_title");
assert(!emDashNews.en_summary.includes("—"), "em-dash stripped from en_summary");
assert(!emDashNews.en_body.includes("—"),    "em-dash stripped from en_body");
assert(!emDashNews.ru_title.includes("—"),   "em-dash stripped from ru_title");

// ── Field length enforcement ───────────────────────────────────────────────────

section("Field length enforcement");

const longNews = validateGeneratedDraftJson({
  ...rawNews,
  en_title:            "A".repeat(200),
  en_seo_title:        "B".repeat(200),
  en_meta_description: "C".repeat(300),
  en_summary:          "D".repeat(500),
  source_url:          "E".repeat(600),
}, "news");

assert(longNews.en_title.length <= 80,             "en_title capped at 80");
assert(longNews.en_seo_title.length <= 60,         "en_seo_title capped at 60");
assert(longNews.en_meta_description.length <= 160, "en_meta_description capped at 160");
assert(longNews.en_summary.length <= 300,          "en_summary capped at 300");
assert(longNews.source_url.length <= 500,          "source_url capped at 500");

// ── contentType fallback ───────────────────────────────────────────────────────

section("contentType fallback to expectedType");

const noContentType = validateGeneratedDraftJson({ ...rawNews, contentType: "garbage" }, "event");
assert(noContentType.contentType === "event", "falls back to expectedType when contentType invalid");

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"=".repeat(64)}`);
console.log(`Phase 4B-2 AI Runtime QA: ${passed} passed, ${failed} failed`);
console.log("=".repeat(64));

if (failed > 0) {
  process.exit(1);
}
