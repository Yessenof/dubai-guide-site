/**
 * QA script — Phase 4B-2D: No-API import parser
 * Run: npx tsx scripts/qa-phase-4b2d-no-api-import.ts
 */

import { parseImportedDraft, buildImportPrompt } from "../lib/ai/import-parser";
import { extractJson, normalizeGeneratedDraftForSave, validateGeneratedDraftJson } from "../lib/ai/editor-schemas";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

function section(name: string) {
  console.log(`\n── ${name}`);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const VALID_NEWS = {
  contentType: "news",
  slug: "dubai-new-employment-visa-rule",
  category: "visa",
  tags: ["visa", "mohre"],
  en_title: "MOHRE Updates Employment Visa Processing Rules",
  en_summary: "The Ministry of Human Resources updated employment visa processing times effective June 2026.",
  en_body: "MOHRE announced a new processing timeline for employment visas across all sponsor categories.\n\nEmployers must now submit all documentation 30 days in advance.",
  en_seo_title: "Dubai Employment Visa Rule Update June 2026",
  en_meta_description: "MOHRE updated employment visa rules. New 30-day advance submission required for all employers.",
  ru_title: "MOHRE обновил правила оформления рабочих виз",
  ru_summary: "Министерство труда обновило сроки обработки рабочих виз с июня 2026 года.",
  ru_body: "MOHRE объявило о новых сроках обработки рабочих виз для всех категорий спонсоров.",
  ru_seo_title: "Обновление правил рабочих виз в Дубае 2026",
  ru_meta_description: "MOHRE обновил правила рабочих виз. Требуется подача документов за 30 дней.",
  source_url: "https://mohre.gov.ae/updates/visa-rules-2026",
  source_label: "official",
  date_published: "2026-05-10",
  date_updated: "2026-05-12",
  image_direction: "UAE government building, clean white background, no people.",
  image_prompt: "Modern UAE government ministry building exterior, daylight, architectural photo style.",
  image_alt: "MOHRE ministry building",
  publish_readiness: "needs_review",
  missing_fields: ["image_path"],
  verification_notes: "Confirm effective date with official MOHRE press release.",
};

const VALID_EVENT = {
  contentType: "event",
  slug: "uae-national-day-2026",
  category: "holiday",
  tags: ["national-day", "public-holiday"],
  en_title: "UAE National Day 2026",
  en_summary: "UAE National Day is celebrated on December 2, 2026. Public holiday for all sectors.",
  en_body: "The UAE National Day marks the founding of the federation in 1971. It is a mandatory public holiday.",
  en_seo_title: "UAE National Day 2026 Public Holiday",
  en_meta_description: "UAE National Day on December 2, 2026 is a public holiday for all sectors in the UAE.",
  ru_title: "Национальный день ОАЭ 2026",
  ru_summary: "Национальный день ОАЭ отмечается 2 декабря 2026 года. Государственный выходной для всех секторов.",
  ru_body: "Национальный день ОАЭ отмечает образование федерации в 1971 году.",
  ru_seo_title: "Национальный день ОАЭ 2026 выходной",
  ru_meta_description: "Национальный день ОАЭ 2 декабря 2026 года — государственный выходной для всех.",
  source_url: "https://u.ae/en/information-and-services/public-holidays-and-religious-occasions",
  source_label: "official",
  image_direction: "UAE flag, golden yellow and red on white, celebration graphic, minimal.",
  image_prompt: "UAE flag waving, national day celebration, clean minimal design.",
  image_alt: "UAE National Day flag",
  publish_readiness: "ready",
  missing_fields: [],
  verification_notes: "",
  color_type: "public-holiday",
  event_date_start: "2026-12-02",
  event_date_end: "2026-12-03",
  date_confidence: "confirmed",
  year: 2026,
  schema_eligible: 1,
};

const VALID_CALENDAR = {
  contentType: "calendar",
  slug: "uae-public-holidays-2026",
  category: "government",
  tags: ["holidays", "calendar"],
  en_title: "UAE Public Holidays 2026",
  en_summary: "Complete list of UAE public holidays for 2026 across all emirates.",
  en_body: "The UAE government has announced the following public holidays for 2026.",
  en_seo_title: "UAE Public Holidays 2026 — Full List",
  en_meta_description: "Complete UAE public holidays 2026 list including exact dates for all national and religious holidays.",
  ru_title: "Государственные праздники ОАЭ 2026",
  ru_summary: "Полный список государственных праздников ОАЭ на 2026 год.",
  ru_body: "Правительство ОАЭ объявило следующие государственные праздники на 2026 год.",
  ru_seo_title: "Государственные праздники ОАЭ 2026 — полный список",
  ru_meta_description: "Полный список государственных праздников ОАЭ 2026 с точными датами.",
  source_url: "https://u.ae/public-holidays-2026",
  source_label: "official",
  image_direction: "UAE calendar graphic, clean grid design with national colours.",
  image_prompt: "Clean minimal calendar grid design with UAE flag colours.",
  image_alt: "UAE 2026 public holidays calendar",
  publish_readiness: "needs_review",
  missing_fields: [],
  verification_notes: "Confirm Islamic holiday dates after official moon sighting announcements.",
  calendar_type: "yearly",
  year: 2026,
  month: null,
  dates_json: [
    { date: "2026-01-01", label_en: "New Year's Day", label_ru: "Новый год", type: "public-holiday", confidence: "confirmed", source: "u.ae" },
    { date: "2026-12-02", label_en: "National Day", label_ru: "Национальный день", type: "public-holiday", confidence: "confirmed", source: "u.ae" },
  ],
  official_source_url: "https://u.ae/en/public-holidays",
  last_verified_date: "2026-05-01",
  en_notes: "Islamic holidays subject to moon sighting — dates may shift by one day.",
  ru_notes: "Исламские праздники зависят от наблюдения луны.",
  has_islamic_dates: 0,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

section("parseImportedDraft — valid news JSON");
{
  const r = parseImportedDraft(JSON.stringify(VALID_NEWS));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.draft.contentType === "news", "contentType = news");
    assert(r.draft.en_title === VALID_NEWS.en_title, "en_title preserved");
    assert(r.draft.slug === VALID_NEWS.slug, "slug preserved");
    assert(r.draft.ru_published === 0, "ru_published forced to 0");
    assert((r.draft as { _forSave: true })._forSave === true, "_forSave = true");
  }
}

section("parseImportedDraft — valid event JSON");
{
  const r = parseImportedDraft(JSON.stringify(VALID_EVENT));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.draft.contentType === "event", "contentType = event");
    assert(r.draft.en_title === VALID_EVENT.en_title, "en_title preserved");
    assert(r.draft.ru_published === 0, "ru_published forced to 0");
  }
}

section("parseImportedDraft — valid calendar JSON");
{
  const r = parseImportedDraft(JSON.stringify(VALID_CALENDAR));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.draft.contentType === "calendar", "contentType = calendar");
    assert(r.draft.en_title === VALID_CALENDAR.en_title, "en_title preserved");
    assert(r.draft.ru_published === 0, "ru_published forced to 0");
  }
}

section("parseImportedDraft — fenced JSON (```json ... ```)");
{
  const fenced = "```json\n" + JSON.stringify(VALID_NEWS) + "\n```";
  const r = parseImportedDraft(fenced);
  assert(r.ok === true, "parses fenced JSON");
  if (r.ok) {
    assert(r.draft.contentType === "news", "contentType = news from fenced input");
  }
}

section("parseImportedDraft — fenced JSON without language tag");
{
  const fenced = "```\n" + JSON.stringify(VALID_NEWS) + "\n```";
  const r = parseImportedDraft(fenced);
  assert(r.ok === true, "parses fenced JSON without language tag");
}

section("parseImportedDraft — content_type (snake_case alias)");
{
  const obj = { ...VALID_NEWS, content_type: "news" };
  delete (obj as Record<string, unknown>).contentType;
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "accepts content_type as alias for contentType");
  if (r.ok) {
    assert(r.draft.contentType === "news", "contentType resolved from content_type");
  }
}

section("parseImportedDraft — empty input");
{
  const r = parseImportedDraft("");
  assert(r.ok === false, "fails on empty string");
  if (!r.ok) {
    assert(r.error.length > 0, "returns error message");
  }
}

section("parseImportedDraft — whitespace-only input");
{
  const r = parseImportedDraft("   \n   ");
  assert(r.ok === false, "fails on whitespace-only input");
}

section("parseImportedDraft — invalid JSON");
{
  const r = parseImportedDraft("this is not json at all");
  assert(r.ok === false, "fails on non-JSON input");
  if (!r.ok) {
    assert(r.error.includes("JSON"), "error message mentions JSON");
  }
}

section("parseImportedDraft — malformed JSON (truncated)");
{
  const r = parseImportedDraft('{"contentType": "news", "en_title":');
  assert(r.ok === false, "fails on truncated JSON");
}

section("parseImportedDraft — missing contentType");
{
  const obj = { ...VALID_NEWS } as Record<string, unknown>;
  delete obj.contentType;
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === false, "fails when contentType missing");
  if (!r.ok) {
    assert(r.error.includes("content_type"), "error message references content_type");
  }
}

section("parseImportedDraft — invalid contentType value");
{
  const r = parseImportedDraft(JSON.stringify({ ...VALID_NEWS, contentType: "guide" }));
  assert(r.ok === false, "fails on invalid contentType");
  if (!r.ok) {
    assert(r.error.includes("news") || r.error.includes("event") || r.error.includes("calendar"), "error lists valid values");
  }
}

section("parseImportedDraft — JSON array (not object)");
{
  const r = parseImportedDraft(JSON.stringify([VALID_NEWS]));
  assert(r.ok === false, "fails when root is an array");
  if (!r.ok) {
    assert(r.error.length > 0, "returns error message");
  }
}

section("parseImportedDraft — ru_published forced to 0 even if set to 1");
{
  const obj = { ...VALID_NEWS, ru_published: 1 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully despite ru_published=1 in input");
  if (r.ok) {
    assert(r.draft.ru_published === 0, "ru_published forced to 0 regardless of input");
  }
}

section("parseImportedDraft — slug normalization");
{
  const obj = { ...VALID_NEWS, slug: "UPPER CASE WITH Spaces & Symbols!" };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with non-normalized slug");
  if (r.ok) {
    assert(/^[a-z0-9-]+$/.test(r.draft.slug), "slug normalized to kebab-case");
    assert(r.draft.slug.length <= 70, "slug max 70 chars");
  }
}

section("parseImportedDraft — em-dash stripping in title");
{
  const obj = { ...VALID_NEWS, en_title: "Dubai Update — New Rules for Expats" };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with em-dash in title");
  if (r.ok) {
    assert(!r.draft.en_title.includes("—"), "em-dash stripped from en_title");
  }
}

section("parseImportedDraft — missing optional fields default gracefully");
{
  const minimal = {
    contentType: "news",
    en_title: "Minimal news draft",
    en_body: "Body text here.",
  };
  const r = parseImportedDraft(JSON.stringify(minimal));
  assert(r.ok === true, "parses with only required fields");
  if (r.ok) {
    assert(r.draft.contentType === "news", "contentType = news");
    assert(typeof r.draft.slug === "string", "slug is a string");
    assert(Array.isArray(r.draft.tags), "tags defaults to array");
  }
}

section("parseImportedDraft — admin-owned fields stripped/overridden");
{
  const obj = { ...VALID_NEWS, status: "published", ru_published: 1 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with admin-owned fields present in input");
  if (r.ok) {
    assert(r.draft.ru_published === 0, "ru_published = 0 regardless");
    // status is not a field on GeneratedDraft — not stored at all
    assert(!("status" in r.draft), "status field not present on draft (it is set by save action, not parser)");
  }
}

section("parseImportedDraft — calendar with dates_json");
{
  const r = parseImportedDraft(JSON.stringify(VALID_CALENDAR));
  assert(r.ok === true, "parses calendar with dates_json");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.dates_json.length === 2, "dates_json has 2 entries");
    assert(r.draft.dates_json[0].date === "2026-01-01", "first date preserved");
    assert(r.draft.dates_json[0].label_en === "New Year's Day", "label_en preserved");
  }
}

section("parseImportedDraft — event schema_eligible forced to 0 when no source_url");
{
  const obj = { ...VALID_EVENT, source_url: "", schema_eligible: 1 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses event with no source_url");
  if (r.ok && r.draft.contentType === "event") {
    assert(r.draft.schema_eligible === 0, "schema_eligible=0 when source_url empty");
  }
}

section("buildImportPrompt — returns non-empty strings for all types");
{
  for (const type of ["news", "event", "calendar"] as const) {
    const prompt = buildImportPrompt(type);
    assert(typeof prompt === "string" && prompt.length > 100, `${type}: prompt is non-empty string`);
    assert(prompt.includes(`"content_type": "${type}"`), `${type}: prompt contains content_type field (snake_case)`);
    assert(prompt.includes("PASTE YOUR TEXT"), `${type}: prompt has source material placeholder`);
    assert(prompt.includes("em-dash"), `${type}: prompt mentions em-dash rule`);
    assert(prompt.includes("JSON"), `${type}: prompt mentions JSON output format`);
  }
}

section("buildImportPrompt — news prompt includes date fields");
{
  const prompt = buildImportPrompt("news");
  assert(prompt.includes("date_published"), "news prompt includes date_published field");
  assert(prompt.includes("date_updated"), "news prompt includes date_updated field");
}

section("buildImportPrompt — event prompt includes event-specific fields");
{
  const prompt = buildImportPrompt("event");
  assert(prompt.includes("event_date_start"), "event prompt includes event_date_start");
  assert(prompt.includes("date_confidence"), "event prompt includes date_confidence");
  assert(prompt.includes("color_type"), "event prompt includes color_type");
}

section("buildImportPrompt — calendar prompt includes dates_json");
{
  const prompt = buildImportPrompt("calendar");
  assert(prompt.includes("dates_json"), "calendar prompt includes dates_json");
  assert(prompt.includes("calendar_type"), "calendar prompt includes calendar_type");
  assert(prompt.includes("has_islamic_dates"), "calendar prompt includes has_islamic_dates");
}

section("extractJson — strips ```json fences");
{
  const raw = "```json\n{\"a\": 1}\n```";
  const result = extractJson(raw);
  const parsed = JSON.parse(result);
  assert(parsed.a === 1, "extracts JSON from fenced block");
}

section("extractJson — passes through plain JSON");
{
  const raw = '{"a": 1}';
  const result = extractJson(raw);
  assert(result === raw, "plain JSON passes through unchanged");
}

// ── Phase 4B-2D-c: Alias normalization ───────────────────────────────────────

section("parseImportedDraft — camelCase aliases: enTitle / enSummary / enBody");
{
  const obj = {
    content_type: "news",
    enTitle: "Alias Title",
    enSummary: "Alias summary text.",
    enBody: "Alias body content for the article.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with enTitle/enSummary/enBody aliases");
  if (r.ok) {
    assert(r.draft.en_title === "Alias Title", "enTitle mapped to en_title");
    assert(r.draft.en_summary === "Alias summary text.", "enSummary mapped to en_summary");
    assert(r.draft.en_body === "Alias body content for the article.", "enBody mapped to en_body");
    assert(r.saveable === true, "saveable = true when core fields present via aliases");
    assert(r.coreErrors.length === 0, "no coreErrors when aliases fill required fields");
  }
}

section("parseImportedDraft — flat aliases: title / summary / body");
{
  const obj = {
    content_type: "news",
    title: "Flat Title",
    summary: "Flat summary text.",
    body: "Flat body content for the article.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with title/summary/body flat aliases");
  if (r.ok) {
    assert(r.draft.en_title === "Flat Title", "title mapped to en_title");
    assert(r.draft.en_summary === "Flat summary text.", "summary mapped to en_summary");
    assert(r.draft.en_body === "Flat body content for the article.", "body mapped to en_body");
    assert(r.saveable === true, "saveable = true with flat aliases");
  }
}

section("parseImportedDraft — Russian field aliases: ruTitle / ruSummary / ruBody");
{
  const obj = {
    content_type: "news",
    en_title: "RU alias test",
    en_summary: "Summary.",
    en_body: "Body text.",
    ruTitle: "Русский заголовок",
    ruSummary: "Краткое описание.",
    ruBody: "Основной текст на русском.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with ruTitle/ruSummary/ruBody aliases");
  if (r.ok) {
    assert(r.draft.ru_title === "Русский заголовок", "ruTitle mapped to ru_title");
    assert(r.draft.ru_summary === "Краткое описание.", "ruSummary mapped to ru_summary");
    assert(r.draft.ru_body === "Основной текст на русском.", "ruBody mapped to ru_body");
  }
}

section("parseImportedDraft — Russian field aliases: russian_title / russian_body");
{
  const obj = {
    content_type: "news",
    en_title: "RU snake_case alias test",
    en_summary: "Summary.",
    en_body: "Body text.",
    russian_title: "Заголовок из ChatGPT",
    russian_summary: "Описание.",
    russian_body: "Текст статьи.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with russian_title/russian_summary/russian_body aliases");
  if (r.ok) {
    assert(r.draft.ru_title === "Заголовок из ChatGPT", "russian_title mapped to ru_title");
    assert(r.draft.ru_summary === "Описание.", "russian_summary mapped to ru_summary");
    assert(r.draft.ru_body === "Текст статьи.", "russian_body mapped to ru_body");
  }
}

section("parseImportedDraft — tags alias: tagsJson");
{
  const obj = {
    content_type: "news",
    en_title: "Tags alias test",
    en_summary: "Summary.",
    en_body: "Body.",
    tagsJson: ["alias-tag", "another-tag"],
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with tagsJson alias");
  if (r.ok) {
    assert(Array.isArray(r.draft.tags), "tags is an array");
    assert(r.draft.tags.includes("alias-tag"), "tagsJson mapped to tags");
  }
}

section("parseImportedDraft — tags alias: tags_json");
{
  const obj = {
    content_type: "news",
    en_title: "Tags snake alias test",
    en_summary: "Summary.",
    en_body: "Body.",
    tags_json: ["snake-tag"],
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with tags_json alias");
  if (r.ok) {
    assert(Array.isArray(r.draft.tags), "tags is an array");
    assert(r.draft.tags.includes("snake-tag"), "tags_json mapped to tags");
  }
}

section("parseImportedDraft — SEO aliases: enSeoTitle / enMetaDescription");
{
  const obj = {
    content_type: "news",
    en_title: "SEO alias test",
    en_summary: "Summary.",
    en_body: "Body.",
    enSeoTitle: "SEO Title Alias",
    enMetaDescription: "Meta description alias text.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with enSeoTitle/enMetaDescription aliases");
  if (r.ok) {
    assert(r.draft.en_seo_title === "SEO Title Alias", "enSeoTitle mapped to en_seo_title");
    assert(r.draft.en_meta_description === "Meta description alias text.", "enMetaDescription mapped to en_meta_description");
  }
}

section("parseImportedDraft — SEO aliases: seo_title / meta_description (flat)");
{
  const obj = {
    content_type: "news",
    en_title: "Flat SEO alias test",
    en_summary: "Summary.",
    en_body: "Body.",
    seo_title: "Flat SEO Title",
    meta_description: "Flat meta description.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with seo_title/meta_description flat aliases");
  if (r.ok) {
    assert(r.draft.en_seo_title === "Flat SEO Title", "seo_title mapped to en_seo_title");
    assert(r.draft.en_meta_description === "Flat meta description.", "meta_description mapped to en_meta_description");
  }
}

// ── Phase 4B-2D-c: Completeness check ────────────────────────────────────────

section("parseImportedDraft — incomplete: missing en_title → saveable=false");
{
  const obj = {
    content_type: "news",
    en_summary: "Summary present.",
    en_body: "Body present.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully (structural ok)");
  if (r.ok) {
    assert(r.saveable === false, "saveable = false when en_title missing");
    assert(r.coreErrors.length > 0, "coreErrors non-empty");
    assert(r.coreErrors.some(e => e.includes("en_title")), "coreErrors mentions en_title");
  }
}

section("parseImportedDraft — incomplete: missing en_summary → saveable=false");
{
  const obj = {
    content_type: "news",
    en_title: "Title present.",
    en_body: "Body present.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully (structural ok)");
  if (r.ok) {
    assert(r.saveable === false, "saveable = false when en_summary missing");
    assert(r.coreErrors.some(e => e.includes("en_summary")), "coreErrors mentions en_summary");
  }
}

section("parseImportedDraft — incomplete: missing en_body → saveable=false");
{
  const obj = {
    content_type: "news",
    en_title: "Title present.",
    en_summary: "Summary present.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully (structural ok)");
  if (r.ok) {
    assert(r.saveable === false, "saveable = false when en_body missing");
    assert(r.coreErrors.some(e => e.includes("en_body")), "coreErrors mentions en_body");
  }
}

section("parseImportedDraft — incomplete: all core fields missing → 3 coreErrors");
{
  const obj = { content_type: "news" };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully (structural ok)");
  if (r.ok) {
    assert(r.saveable === false, "saveable = false");
    assert(r.coreErrors.length === 3, "exactly 3 coreErrors (en_title, en_summary, en_body)");
  }
}

section("parseImportedDraft — whitespace-only en_title treated as missing");
{
  const obj = {
    content_type: "news",
    en_title: "   ",
    en_summary: "Summary.",
    en_body: "Body.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.saveable === false, "saveable = false for whitespace-only en_title");
    assert(r.coreErrors.some(e => e.includes("en_title")), "coreErrors mentions en_title");
  }
}

section("parseImportedDraft — complete draft has saveable=true and empty coreErrors");
{
  const r = parseImportedDraft(JSON.stringify(VALID_NEWS));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.saveable === true, "saveable = true for complete draft");
    assert(r.coreErrors.length === 0, "coreErrors empty for complete draft");
  }
}

section("parseImportedDraft — status/published fields ignored (not in draft)");
{
  const obj = { ...VALID_NEWS, status: "published", published: true };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with status/published in input");
  if (r.ok) {
    assert(!("status" in r.draft), "status field absent from draft");
    assert(!("published" in r.draft), "published field absent from draft");
    assert(r.draft.ru_published === 0, "ru_published still forced to 0");
  }
}

section("parseImportedDraft — buildImportPrompt uses content_type (snake_case) in schema");
{
  for (const type of ["news", "event", "calendar"] as const) {
    const prompt = buildImportPrompt(type);
    // The schema block uses snake_case; "contentType" may appear in the CRITICAL_RULES warning only
    assert(prompt.includes(`"content_type": "${type}"`), `${type}: schema block contains "content_type": "${type}"`);
    assert(prompt.includes("en_title"), `${type}: prompt contains en_title`);
    assert(prompt.includes("en_summary"), `${type}: prompt contains en_summary`);
    assert(prompt.includes("en_body"), `${type}: prompt contains en_body`);
    assert(prompt.includes("REQUIRED"), `${type}: prompt marks required fields`);
  }
}

section("normalizeGeneratedDraftForSave — invariants");
{
  const draft = validateGeneratedDraftJson(VALID_NEWS, "news");
  const normalized = normalizeGeneratedDraftForSave(draft);
  assert(normalized.ru_published === 0, "ru_published = 0");
  assert(normalized._forSave === true, "_forSave = true");
  assert(typeof normalized.slug === "string" && normalized.slug.length > 0, "slug non-empty");
}

// ── Phase 4B-2E: Image field aliases ─────────────────────────────────────────

section("parseImportedDraft — image alias: imagePath → image_path");
{
  const obj = {
    ...VALID_NEWS,
    imagePath: "/images/mohre-building.jpg",
  };
  delete (obj as Record<string, unknown>).image_path;
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with imagePath alias");
  if (r.ok) {
    assert((r.draft as unknown as Record<string, unknown>).image_path === "/images/mohre-building.jpg", "imagePath mapped to image_path");
  }
}

section("parseImportedDraft — image alias: image_url → image_path");
{
  const obj = {
    ...VALID_NEWS,
    image_url: "/images/test.jpg",
  };
  delete (obj as Record<string, unknown>).image_path;
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with image_url alias");
  if (r.ok) {
    assert((r.draft as unknown as Record<string, unknown>).image_path === "/images/test.jpg", "image_url mapped to image_path");
  }
}

section("parseImportedDraft — image alias: imageUrl → image_path");
{
  const obj = {
    ...VALID_NEWS,
    imageUrl: "/images/test2.jpg",
  };
  delete (obj as Record<string, unknown>).image_path;
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with imageUrl alias");
  if (r.ok) {
    assert((r.draft as unknown as Record<string, unknown>).image_path === "/images/test2.jpg", "imageUrl mapped to image_path");
  }
}

section("parseImportedDraft — image alias: imageAlt → image_alt");
{
  const obj = {
    ...VALID_NEWS,
    imageAlt: "Alias alt text",
  };
  delete (obj as Record<string, unknown>).image_alt;
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with imageAlt alias");
  if (r.ok) {
    assert(r.draft.image_alt === "Alias alt text", "imageAlt mapped to image_alt");
  }
}

section("parseImportedDraft — image alias: ruImageAlt → ru_image_alt");
{
  const obj = {
    ...VALID_NEWS,
    ruImageAlt: "Русский альт",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses with ruImageAlt alias");
  if (r.ok) {
    assert(r.draft.ru_image_alt === "Русский альт", "ruImageAlt mapped to ru_image_alt");
  }
}

// ── Phase 4B-2E: file:// path detection ──────────────────────────────────────

section("parseImportedDraft — file:// image_path cleared + importWarnings populated");
{
  const obj = { ...VALID_NEWS, image_path: "file:///Users/batyr/Desktop/photo.jpg" };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert((r.draft as unknown as Record<string, unknown>).image_path === "", "file:// path cleared");
    assert(r.importWarnings.length > 0, "importWarnings non-empty for file:// path");
    assert(r.importWarnings.some(w => w.includes("file://")), "importWarnings mentions file://");
  }
}

section("parseImportedDraft — /images/ path accepted without warning");
{
  const obj = { ...VALID_NEWS, image_path: "/images/building.jpg" };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert((r.draft as unknown as Record<string, unknown>).image_path === "/images/building.jpg", "/images/ path preserved");
    assert(!r.importWarnings.some(w => w.includes("file://")), "no file:// warning for valid path");
  }
}

section("parseImportedDraft — importWarnings is empty array when no issues");
{
  const r = parseImportedDraft(JSON.stringify(VALID_NEWS));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(Array.isArray(r.importWarnings), "importWarnings is an array");
    assert(r.importWarnings.length === 0, "importWarnings empty for clean import");
  }
}

// ── Phase 4B-2E: SEO fallbacks ────────────────────────────────────────────────

section("parseImportedDraft — SEO fallback: en_seo_title from en_title when empty");
{
  const obj = {
    content_type: "news",
    en_title: "Dubai Employment Visa Update 2026",
    en_summary: "MOHRE updates processing rules.",
    en_body: "Full body text here.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.draft.en_seo_title.length > 0, "en_seo_title filled from en_title fallback");
    assert(r.draft.en_seo_title === "Dubai Employment Visa Update 2026".slice(0, 60), "en_seo_title is truncated en_title");
  }
}

section("parseImportedDraft — SEO fallback: en_meta_description from en_summary when empty");
{
  const obj = {
    content_type: "news",
    en_title: "Title",
    en_summary: "Summary for meta description fallback.",
    en_body: "Body.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.draft.en_meta_description.length > 0, "en_meta_description filled from en_summary fallback");
    assert(r.draft.en_meta_description === "Summary for meta description fallback.", "en_meta_description equals en_summary");
  }
}

section("parseImportedDraft — explicit SEO fields not overwritten by fallback");
{
  const obj = {
    content_type: "news",
    en_title: "Title",
    en_summary: "Summary.",
    en_body: "Body.",
    en_seo_title: "Custom SEO Title",
    en_meta_description: "Custom meta description.",
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok) {
    assert(r.draft.en_seo_title === "Custom SEO Title", "explicit en_seo_title not overwritten");
    assert(r.draft.en_meta_description === "Custom meta description.", "explicit en_meta_description not overwritten");
  }
}

// ── Phase 4B-2E: has_islamic_dates accepts true ───────────────────────────────

section("parseImportedDraft — has_islamic_dates: true (boolean) → 1");
{
  const obj = { ...VALID_CALENDAR, has_islamic_dates: true };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.has_islamic_dates === 1, "has_islamic_dates true → 1");
  }
}

section("parseImportedDraft — has_islamic_dates: 1 → 1");
{
  const obj = { ...VALID_CALENDAR, has_islamic_dates: 1 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.has_islamic_dates === 1, "has_islamic_dates 1 → 1");
  }
}

section("parseImportedDraft — has_islamic_dates: 0 → 0");
{
  const obj = { ...VALID_CALENDAR, has_islamic_dates: 0 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.has_islamic_dates === 0, "has_islamic_dates 0 → 0");
  }
}

// ── Phase 4B-2E: Islamic keyword auto-detection ───────────────────────────────

section("parseImportedDraft — Islamic keywords in title auto-set has_islamic_dates=1");
{
  const obj = {
    ...VALID_CALENDAR,
    en_title: "Eid Al-Adha 2026 UAE Public Holiday",
    has_islamic_dates: 0,
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.has_islamic_dates === 1, "Eid keyword auto-sets has_islamic_dates=1");
    assert(r.importWarnings.some(w => w.includes("Islamic")), "importWarnings mentions Islamic detection");
  }
}

section("parseImportedDraft — Ramadan keyword auto-sets has_islamic_dates=1");
{
  const obj = {
    ...VALID_CALENDAR,
    en_title: "Ramadan 2026 Calendar UAE",
    has_islamic_dates: 0,
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.has_islamic_dates === 1, "Ramadan keyword auto-sets has_islamic_dates=1");
  }
}

section("parseImportedDraft — Islamic detection: already has_islamic_dates=1 skips detection");
{
  const obj = {
    ...VALID_CALENDAR,
    en_title: "Eid Al-Adha 2026",
    has_islamic_dates: 1,
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.has_islamic_dates === 1, "has_islamic_dates stays 1");
    assert(!r.importWarnings.some(w => w.includes("auto-set")), "no auto-set warning when already set");
  }
}

// ── Phase 4B-2E: Yearly calendar month=null ───────────────────────────────────

section("parseImportedDraft — calendar yearly type: month forced to null");
{
  const obj = { ...VALID_CALENDAR, calendar_type: "yearly", month: 6 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.month === null, "yearly calendar: month forced to null even if set");
  }
}

section("parseImportedDraft — calendar monthly type: month preserved");
{
  const obj = { ...VALID_CALENDAR, calendar_type: "monthly", month: 6 };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.month === 6, "monthly calendar: month 6 preserved");
  }
}

// ── Phase 4B-2E: dates_json confidence values ─────────────────────────────────

section("parseImportedDraft — dates_json confidence values preserved");
{
  const obj = {
    ...VALID_CALENDAR,
    dates_json: [
      { date: "2026-06-05", label_en: "Arafah", label_ru: "Арафа", type: "public-holiday", confidence: "subject_to_official_confirmation", source: "u.ae" },
      { date: "2026-06-06", label_en: "Eid Al-Adha", label_ru: "Ид аль-Адха", type: "public-holiday", confidence: "expected", source: "u.ae" },
    ],
  };
  const r = parseImportedDraft(JSON.stringify(obj));
  assert(r.ok === true, "parses successfully");
  if (r.ok && r.draft.contentType === "calendar") {
    assert(r.draft.dates_json[0].confidence === "subject_to_official_confirmation", "subject_to_official_confirmation preserved");
    assert(r.draft.dates_json[1].confidence === "expected", "expected preserved");
  }
}

// ── Phase 4B-2E: prompt includes image fields and file:// warning ─────────────

section("buildImportPrompt — prompt includes image_path field");
{
  for (const type of ["news", "event", "calendar"] as const) {
    const prompt = buildImportPrompt(type);
    assert(prompt.includes("image_path"), `${type}: prompt includes image_path`);
    assert(prompt.includes("image_alt"), `${type}: prompt includes image_alt`);
    assert(prompt.includes("ru_image_alt"), `${type}: prompt includes ru_image_alt`);
  }
}

section("buildImportPrompt — prompt includes file:// warning rule");
{
  for (const type of ["news", "event", "calendar"] as const) {
    const prompt = buildImportPrompt(type);
    assert(prompt.includes("file://"), `${type}: prompt mentions file:// restriction`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(50)}`);
console.log(`QA Phase 4B-2D — No-API Import Parser`);
console.log(`Passed: ${passed}  |  Failed: ${failed}  |  Total: ${passed + failed}`);
if (failed > 0) {
  console.error(`\n${failed} test(s) FAILED`);
  process.exit(1);
} else {
  console.log(`\nAll ${passed} tests passed ✓`);
}
