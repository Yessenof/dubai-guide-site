/**
 * Phase 6C-CALENDAR-EXPANSION-04B -- Approved P0 Import (Local QA)
 * LOCAL ONLY -- refuses to run on production server paths.
 *
 * Run: npx tsx scripts/import-calendar-expansion-04b-local.ts
 *
 * Writes:
 *   events INSERT:      expand-north-star-2026  (Dec 8-10, Expo City Dubai, EN+RU, published)
 *   calendar_pages:     DEC-ENS appended to december-2026-uae-calendar
 *   calendar_pages:     NOV-GFMFG appended to november-2026-dubai-calendar
 *   calendar_pages:     has_islamic_dates fixed on august-2026-dubai-calendar (0 -> 1)
 *   calendar_pages:     AUG-NEW-02 source_status fixed (confirmed -> expected)
 *
 * Rollback:
 *   sqlite3 data/guides.db "DELETE FROM events WHERE slug='expand-north-star-2026';"
 *   cp data/guides.db.pre-calendar-expansion-04b-TIMESTAMP data/guides.db
 */

import path from "path";
import fs from "fs";
import {
  getAllCalendarPages,
  getAllEvents,
  createEventDraft,
  publishEvent,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Local-only safety gate ------------------------------------------------

const DB_PATH = path.resolve(process.cwd(), "data", "guides.db");
const PRODUCTION_PATHS = ["/var/www/", "/var/app/", "/srv/www/"];
for (const p of PRODUCTION_PATHS) {
  if (DB_PATH.includes(p)) {
    console.error(`\nABORT: Production path detected: ${DB_PATH}`);
    console.error("  This script is LOCAL ONLY.");
    process.exit(1);
  }
}

// ---- Helpers ---------------------------------------------------------------

function log(msg: string) { console.log(msg); }
function section(t: string) { console.log(`\n-- ${t} ${"-".repeat(Math.max(0, 55 - t.length))}`); }
function abort(msg: string): never { console.error(`\nABORT: ${msg}`); process.exit(1); }

section("Phase 6C-CALENDAR-EXPANSION-04B -- Local Import QA");
log(`  DB path:   ${DB_PATH}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Backup ----------------------------------------------------------------

section("Creating local DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);
const TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-04b-${TS}`;
fs.copyFileSync(DB_PATH, BACKUP_PATH);
if (fs.statSync(BACKUP_PATH).size === 0) abort("Backup is empty.");
log(`  Backup: ${BACKUP_PATH}  PASS`);

// ---- Constants -------------------------------------------------------------

const ENS_SLUG   = "expand-north-star-2026";
const DEC_SLUG   = "december-2026-uae-calendar";
const NOV_SLUG   = "november-2026-dubai-calendar";
const AUG_SLUG   = "august-2026-dubai-calendar";

// ---- Event content: Expand North Star 2026 ---------------------------------

const ENS_EN_SEO   = "Expand North Star 2026: Dubai -- 8-10 December at Expo City";
const ENS_EN_META  = "Expand North Star 2026 takes place 8-10 December at Dubai Exhibition Centre, Expo City Dubai, co-located with GITEX Global. The world's largest startup and investor event.";
const ENS_EN_TITLE = "Expand North Star 2026 -- 8 to 10 December, Dubai Exhibition Centre";
const ENS_EN_SUMM  = "Expand North Star 2026 is the world's largest startup and investor event, taking place 8-10 December at Dubai Exhibition Centre, Expo City Dubai, co-located with GITEX Global. Organised by DWTC and the Dubai Chamber of Digital Economy.";
const ENS_EN_BODY  = `## Quick answer

Expand North Star 2026 runs **8-10 December** at **Dubai Exhibition Centre, Expo City Dubai**, co-located with GITEX Global (7-11 December).

- **Dates:** 8-10 December 2026
- **Venue:** Dubai Exhibition Centre, Expo City Dubai
- **What it is:** World's largest startup and investor event
- **Organiser:** DWTC / Dubai Chamber of Digital Economy
- **Source:** expandnorthstar.com

---

## Key facts

| Item | Details |
|------|---------|
| Dates | 8-10 December 2026 |
| Venue | Dubai Exhibition Centre, Expo City Dubai |
| Co-located with | GITEX Global 2026 (7-11 December, same venue) |
| What it is | Startup and investor pitching, deals, networking |
| Organiser | DWTC / Dubai Chamber of Digital Economy |
| Metro | Dubai Metro Red Line, Expo City station |
| Source | expandnorthstar.com (official) |

---

## What is Expand North Star

Expand North Star is a startup, investor, and entrepreneur event that runs alongside GITEX Global at the Dubai Exhibition Centre, Expo City Dubai. It focuses on early-stage startups, venture capital, investor access, and corporate-startup matchmaking.

In 2026, the event transitions fully to Dubai Exhibition Centre (DEC) at Expo City Dubai, entering its next phase of growth with GITEX. The two events are co-located: a single access arrangement typically covers both. Confirm registration categories on expandnorthstar.com.

---

## Why this matters for Guidex readers

Expand North Star week in early December is a high-density period for the startup and investment community in Dubai.

For founders and business operators based in, or relocating to, the UAE, this event concentrates a significant portion of the MENA investor and accelerator community in one place. People attending Expand North Star often combine it with:

- Initial consultations for company formation in Dubai
- Bank account meetings (UAE banking requires in-person visits)
- Free zone and mainland registration discussions
- Corporate tax and VAT planning meetings
- Investor meetings arranged around the event

The 8-10 December window sits inside the broader GITEX week (7-11 December). Anyone planning both should block the 7-11 December range as their target visit.

---

## Getting there

Expo City Dubai is served by the Dubai Metro Red Line (Expo City station). Journey time from central Dubai is approximately 35-40 minutes. Parking is available on-site.

December is peak season in Dubai. Book accommodation early. Hotels across Sheikh Zayed Road and near Expo City fill quickly in the first two weeks of December.

---

## Calendar connection

See the **[December 2026 UAE Calendar](/calendar/december-2026-uae-calendar)** for a full list of December events -- including GITEX Global 2026 (7-11 December), UAE National Day long weekend (1-3 December), and the F1 Abu Dhabi Grand Prix (3-6 December).

---

## Source note

Dates (8-10 December 2026) and venue (Dubai Exhibition Centre, Expo City Dubai) confirmed from expandnorthstar.com (official organiser site, rechecked June 25, 2026). Co-location with GITEX confirmed from the same source. No speaker names, ticket prices, pod counts, or investment volumes are claimed.`;

const ENS_RU_SEO   = "Expand North Star 2026: Дубай -- 8-10 декабря в Expo City";
const ENS_RU_META  = "Expand North Star 2026 пройдёт 8-10 декабря в Dubai Exhibition Centre, Expo City Dubai, совместно с GITEX Global. Крупнейшее в мире мероприятие для стартапов и инвесторов.";
const ENS_RU_TITLE = "Expand North Star 2026 -- 8-10 декабря в Dubai Exhibition Centre";
const ENS_RU_SUMM  = "Expand North Star 2026 -- крупнейшее в мире мероприятие для стартапов и инвесторов, которое пройдёт 8-10 декабря в Dubai Exhibition Centre, Expo City Dubai, совместно с GITEX Global. Организаторы -- DWTC и Dubai Chamber of Digital Economy.";
const ENS_RU_BODY  = `## Коротко

Expand North Star 2026 проходит **8-10 декабря** в **Dubai Exhibition Centre, Expo City Dubai** -- совместно с GITEX Global (7-11 декабря).

- **Даты:** 8-10 декабря 2026
- **Площадка:** Dubai Exhibition Centre, Expo City Dubai
- **Что это:** Крупнейшее в мире мероприятие для стартапов и инвесторов
- **Организатор:** DWTC / Dubai Chamber of Digital Economy
- **Источник:** expandnorthstar.com

---

## Ключевые факты

| Параметр | Детали |
|----------|--------|
| Даты | 8-10 декабря 2026 |
| Площадка | Dubai Exhibition Centre, Expo City Dubai |
| Совместно с | GITEX Global 2026 (7-11 декабря, та же площадка) |
| Формат | Питчинг стартапов, встречи с инвесторами, нетворкинг |
| Организатор | DWTC / Dubai Chamber of Digital Economy |
| Метро | Красная линия Dubai Metro, станция Expo City |
| Официальный источник | expandnorthstar.com |

---

## Что такое Expand North Star

Expand North Star -- это мероприятие для стартапов, инвесторов и предпринимателей, которое проходит параллельно с GITEX Global в Dubai Exhibition Centre, Expo City Dubai. Основной фокус -- стартапы ранних стадий, венчурный капитал, доступ к инвесторам и корпоративный нетворкинг.

В 2026 году мероприятие полностью переходит в Dubai Exhibition Centre (DEC) в Expo City Dubai. Оба события -- Expand North Star и GITEX -- проходят на одной площадке; как правило, один билет охватывает оба. Уточняйте категории регистрации на expandnorthstar.com.

---

## Почему это важно для аудитории Guidex

Неделя Expand North Star в начале декабря -- период высокой деловой концентрации в Дубае для стартап-сообщества.

Для основателей и предпринимателей, работающих или переезжающих в ОАЭ, это событие собирает значительную часть инвесторов и акселераторов Ближнего Востока в одном месте. Участники часто совмещают поездку с:

- первичными консультациями по регистрации компании в Дубае
- встречами в банке (открытие счёта в ОАЭ требует личного визита)
- визитами в фризоны и консультациями по материковой регистрации
- планированием в области корпоративного налога и НДС
- инвесторскими встречами, организованными вокруг мероприятия

Период 8-10 декабря входит в более широкую неделю GITEX (7-11 декабря). Для тех, кто планирует оба мероприятия, целевой диапазон поездки -- 7-11 декабря.

---

## Как добраться

Expo City Dubai связан с центром Дубая Красной линией Dubai Metro (станция Expo City). Время в пути от центра города -- около 35-40 минут. На площадке есть парковка.

Декабрь -- высокий сезон в Дубае. Жильё нужно бронировать заблаговременно. Отели вдоль Sheikh Zayed Road и вблизи Expo City заполняются в первые две недели декабря.

---

## Связь с календарём

Смотрите **[Декабрьский Календарь ОАЭ 2026](/ru/calendar/december-2026-uae-calendar)** -- полный список событий декабря, включая GITEX Global 2026 (7-11 декабря), праздники Дня Нации (1-3 декабря) и Гран-при Формулы-1 Абу-Даби (3-6 декабря).

---

## Примечание об источниках

Даты (8-10 декабря 2026) и площадка (Dubai Exhibition Centre, Expo City Dubai) подтверждены на официальном сайте организатора expandnorthstar.com (проверено 25 июня 2026). Совместное проведение с GITEX подтверждено из того же источника. Имена спикеров, стоимость билетов и количество участников не указаны.`;

// ---- Pre-flight: em dash check ---------------------------------------------

section("Pre-flight: em dash check");
const EM = "—";
const ALL_STRINGS: Array<[string, string]> = [
  ["ENS_EN_SEO",   ENS_EN_SEO],
  ["ENS_EN_META",  ENS_EN_META],
  ["ENS_EN_TITLE", ENS_EN_TITLE],
  ["ENS_EN_SUMM",  ENS_EN_SUMM],
  ["ENS_EN_BODY",  ENS_EN_BODY],
  ["ENS_RU_SEO",   ENS_RU_SEO],
  ["ENS_RU_META",  ENS_RU_META],
  ["ENS_RU_TITLE", ENS_RU_TITLE],
  ["ENS_RU_SUMM",  ENS_RU_SUMM],
  ["ENS_RU_BODY",  ENS_RU_BODY],
];
for (const [label, value] of ALL_STRINGS) {
  if (value.includes(EM)) abort(`Em dash found in "${label}". Use -- instead.`);
}
log("  All strings clean -- no em dashes.  PASS");

// ---- Pre-flight: slug existence check -------------------------------------

section("Pre-flight: slug existence check");
const existingEvents = getAllEvents();
const existingCals   = getAllCalendarPages();

const ensExists = existingEvents.find(e => e.slug === ENS_SLUG);
if (ensExists) {
  log(`  NOTE: Event "${ENS_SLUG}" already exists. Will skip INSERT.`);
} else {
  log(`  OK: "${ENS_SLUG}" not in DB -- safe to create.`);
}

const decPage = existingCals.find(p => p.slug === DEC_SLUG);
if (!decPage) abort(`Calendar page "${DEC_SLUG}" not found.`);
log(`  Calendar "${DEC_SLUG}" found. id=${decPage.id}  PASS`);

const novPage = existingCals.find(p => p.slug === NOV_SLUG);
if (!novPage) abort(`Calendar page "${NOV_SLUG}" not found.`);
log(`  Calendar "${NOV_SLUG}" found. id=${novPage.id}  PASS`);

const augPage = existingCals.find(p => p.slug === AUG_SLUG);
if (!augPage) abort(`Calendar page "${AUG_SLUG}" not found.`);
log(`  Calendar "${AUG_SLUG}" found. id=${augPage.id}  PASS`);

// ---- Insert: Expand North Star 2026 ----------------------------------------

section("Insert Event: expand-north-star-2026");

let ensId: string | null = null;

if (ensExists) {
  ensId = ensExists.id;
  log(`  SKIP: Already exists. id=${ensId}  status=${ensExists.status}`);
} else {
  const ensResult = createEventDraft({
    slug:                ENS_SLUG,
    category:            "dubai-event",
    color_type:          "major-event",
    tags_json:           JSON.stringify(["tech", "startup", "investor", "expo-city", "gitex"]),
    en_title:            ENS_EN_TITLE,
    en_summary:          ENS_EN_SUMM,
    en_body:             ENS_EN_BODY,
    en_seo_title:        ENS_EN_SEO,
    en_meta_description: ENS_EN_META,
    ru_published:        1,
    ru_title:            ENS_RU_TITLE,
    ru_summary:          ENS_RU_SUMM,
    ru_body:             ENS_RU_BODY,
    ru_seo_title:        ENS_RU_SEO,
    ru_meta_description: ENS_RU_META,
    event_date_start:    "2026-12-08",
    event_date_end:      "2026-12-10",
    date_confidence:     "confirmed",
    year:                2026,
    source_url:          "https://www.expandnorthstar.com/",
    featured_homepage:   0,
    featured_digest:     0,
    featured_calendar:   1,
    schema_eligible:     1,
    related_guide_slug:  "",
    related_news_slug:   "",
  });

  if (!ensResult.ok) abort(`createEventDraft failed: ${JSON.stringify(ensResult.errors)}`);
  ensId = ensResult.id!;
  log(`  Draft created. id=${ensId}`);

  const ensPub = publishEvent(ensId);
  if (!ensPub.ok) abort(`publishEvent failed: ${JSON.stringify(ensPub.errors)}`);
  log(`  Published. Warnings: ${ensPub.warnings.length ? ensPub.warnings.join("; ") : "none"}`);
}

// ---- Append DEC-ENS to December 2026 calendar ------------------------------

section("Append DEC-ENS to december-2026-uae-calendar");

const decFresh = getAllCalendarPages().find(p => p.slug === DEC_SLUG)!;
const decItems = JSON.parse(decFresh.datesJson) as Array<Record<string, unknown>>;

// Sanitize pre-existing em dashes in inherited items (e.g. DEC-CTAX, DEC-EMIR)
// These were written before the em-dash guard was enforced; updateCalendarDraft rejects them.
function sanitizeEmDash(s: unknown): unknown {
  if (typeof s !== "string") return s;
  return s.replace(/—/g, " --");
}
const decItemsCleaned = decItems.map(item =>
  Object.fromEntries(Object.entries(item).map(([k, v]) => [k, sanitizeEmDash(v)]))
);

const decEnsAlready = decItemsCleaned.find(x => x["id"] === "DEC-ENS");
if (decEnsAlready) {
  log("  SKIP: DEC-ENS already in December calendar.");
} else {
  decItemsCleaned.push({
    id:           "DEC-ENS",
    date:         "2026-12-08",
    date_end:     "2026-12-10",
    type:         "trade_show",
    label_en:     "Expand North Star 2026 at Dubai Exhibition Centre, Expo City Dubai (8-10 December) -- co-located with GITEX Global, world's largest startup and investor event",
    label_ru:     "Expand North Star 2026 в Dubai Exhibition Centre, Expo City Dubai (8-10 декабря) -- совместно с GITEX Global, крупнейшее мероприятие для стартапов и инвесторов",
    confidence:   "confirmed",
    source_label: "expandnorthstar.com",
    source_url:   "https://www.expandnorthstar.com/",
    source_status:"confirmed",
    detail_url:   `/events/${ENS_SLUG}`,
  });

  const decUpd = updateCalendarDraft(decFresh.id, { dates_json: JSON.stringify(decItemsCleaned) });
  if (!decUpd.ok) abort(`updateCalendarDraft December failed: ${JSON.stringify(decUpd.errors)}`);

  const decPub = publishCalendar(decFresh.id);
  if (!decPub.ok) abort(`publishCalendar December failed: ${JSON.stringify(decPub.errors)}`);
  log(`  DEC-ENS appended + em-dash cleanup in existing items + published. Warnings: ${decPub.warnings.length ? decPub.warnings.join("; ") : "none"}`);
}

// ---- Append NOV-GFMFG to November 2026 calendar ---------------------------

section("Append NOV-GFMFG to november-2026-dubai-calendar");

const novFresh = getAllCalendarPages().find(p => p.slug === NOV_SLUG)!;
const novItems = JSON.parse(novFresh.datesJson) as Array<Record<string, unknown>>;
const novItemsCleaned = novItems.map(item =>
  Object.fromEntries(Object.entries(item).map(([k, v]) => [k, sanitizeEmDash(v)]))
);

const novGfmfgAlready = novItemsCleaned.find(x => x["id"] === "NOV-GFMFG");
if (novGfmfgAlready) {
  log("  SKIP: NOV-GFMFG already in November calendar.");
} else {
  novItemsCleaned.push({
    id:           "NOV-GFMFG",
    date:         "2026-11-03",
    date_end:     "2026-11-05",
    type:         "trade_show",
    label_en:     "Gulfood Manufacturing 2026 at Dubai World Trade Centre (3-5 November) -- 2,500+ global exhibitors in F&B processing, packaging, ingredients and automation",
    label_ru:     "Gulfood Manufacturing 2026 в Dubai World Trade Centre (3-5 ноября) -- международная выставка пищевого производства и упаковки",
    confidence:   "confirmed",
    source_label: "gulfoodmanufacturing.com",
    source_url:   "https://www.gulfoodmanufacturing.com/",
    source_status:"confirmed",
    detail_url:   "",
  });

  const novUpd = updateCalendarDraft(novFresh.id, { dates_json: JSON.stringify(novItemsCleaned) });
  if (!novUpd.ok) abort(`updateCalendarDraft November failed: ${JSON.stringify(novUpd.errors)}`);

  const novPub = publishCalendar(novFresh.id);
  if (!novPub.ok) abort(`publishCalendar November failed: ${JSON.stringify(novPub.errors)}`);
  log(`  NOV-GFMFG appended + em-dash cleanup + published. Warnings: ${novPub.warnings.length ? novPub.warnings.join("; ") : "none"}`);
}

// ---- Fix August calendar has_islamic_dates bug -----------------------------

section("Fix august-2026-dubai-calendar: has_islamic_dates bug");

const augFresh = getAllCalendarPages().find(p => p.slug === AUG_SLUG)!;
const augHasIslamic = (augFresh as Record<string, unknown>)["hasIslamicDates"];
log(`  Current has_islamic_dates: ${augHasIslamic}`);

if (augHasIslamic === 1 || augHasIslamic === true) {
  log("  SKIP: has_islamic_dates already 1.");
} else {
  const augUpd = updateCalendarDraft(augFresh.id, { has_islamic_dates: 1 });
  if (!augUpd.ok) abort(`updateCalendarDraft August has_islamic_dates failed: ${JSON.stringify(augUpd.errors)}`);

  const augPub = publishCalendar(augFresh.id);
  if (!augPub.ok) abort(`publishCalendar August failed: ${JSON.stringify(augPub.errors)}`);
  log(`  has_islamic_dates set to 1 and published.  PASS`);
}

// ---- Fix AUG-NEW-02 source_status bug --------------------------------------

section("Fix AUG-NEW-02 source_status: confirmed -> expected");

const augFresh2 = getAllCalendarPages().find(p => p.slug === AUG_SLUG)!;
const augItems  = JSON.parse(augFresh2.datesJson) as Array<Record<string, unknown>>;
const augNew02Idx = augItems.findIndex(x => x["id"] === "AUG-NEW-02");

if (augNew02Idx === -1) abort("AUG-NEW-02 not found in august calendar dates_json.");

const augNew02 = augItems[augNew02Idx];
const currentSourceStatus = augNew02["source_status"];
log(`  AUG-NEW-02 current source_status: "${currentSourceStatus}"`);

if (currentSourceStatus === "expected") {
  log("  SKIP: source_status already 'expected'.");
} else {
  augItems[augNew02Idx] = { ...augNew02, source_status: "expected" };

  const augUpd2 = updateCalendarDraft(augFresh2.id, { dates_json: JSON.stringify(augItems) });
  if (!augUpd2.ok) abort(`updateCalendarDraft AUG-NEW-02 source_status failed: ${JSON.stringify(augUpd2.errors)}`);

  const augPub2 = publishCalendar(augFresh2.id);
  if (!augPub2.ok) abort(`publishCalendar August source_status fix failed: ${JSON.stringify(augPub2.errors)}`);
  log(`  AUG-NEW-02 source_status set to 'expected' and published.  PASS`);
}

// ---- Post-import verification -----------------------------------------------

section("Post-import verification");

const verEvents = getAllEvents();
const verCals   = getAllCalendarPages();
let anyFail = false;

// Check event
const ensRow = verEvents.find(e => e.slug === ENS_SLUG);
if (!ensRow || ensRow.status !== "published") {
  console.error(`  FAIL: ${ENS_SLUG} not published.`);
  anyFail = true;
} else {
  log(`  ${ENS_SLUG}: status=${ensRow.status}  id=${ensRow.id}  dates=${ensRow.eventDateStart}/${ensRow.eventDateEnd}  PASS`);
}

// Check December calendar DEC-ENS
const verDecPage = verCals.find(p => p.slug === DEC_SLUG);
if (verDecPage) {
  const verDecItems = JSON.parse(verDecPage.datesJson) as Array<Record<string, unknown>>;
  const decEns = verDecItems.find(x => x["id"] === "DEC-ENS");
  if (!decEns) {
    console.error("  FAIL: DEC-ENS not in December calendar.");
    anyFail = true;
  } else {
    log(`  DEC-ENS in December: date=${decEns["date"]} detail_url=${decEns["detail_url"]}  PASS`);
  }
  // Check no NYE item was accidentally added
  const dceNye = verDecItems.find(x => String(x["id"]).includes("NYE"));
  if (dceNye) {
    console.error("  FAIL: NYE item found in December calendar -- should NOT be there.");
    anyFail = true;
  } else {
    log("  No NYE item in December calendar.  PASS");
  }
}

// Check November calendar NOV-GFMFG
const verNovPage = verCals.find(p => p.slug === NOV_SLUG);
if (verNovPage) {
  const verNovItems = JSON.parse(verNovPage.datesJson) as Array<Record<string, unknown>>;
  const novGfmfg = verNovItems.find(x => x["id"] === "NOV-GFMFG");
  if (!novGfmfg) {
    console.error("  FAIL: NOV-GFMFG not in November calendar.");
    anyFail = true;
  } else {
    log(`  NOV-GFMFG in November: date=${novGfmfg["date"]}  PASS`);
  }
}

// Check August has_islamic_dates
const verAugPage = verCals.find(p => p.slug === AUG_SLUG);
if (verAugPage) {
  const augHasIsl = (verAugPage as Record<string, unknown>)["hasIslamicDates"];
  if (augHasIsl !== 1 && augHasIsl !== true) {
    console.error(`  FAIL: has_islamic_dates still ${augHasIsl}.`);
    anyFail = true;
  } else {
    log(`  August has_islamic_dates=${augHasIsl}  PASS`);
  }
  // Check AUG-NEW-02 source_status
  const verAugItems = JSON.parse(verAugPage.datesJson) as Array<Record<string, unknown>>;
  const verAugNew02 = verAugItems.find(x => x["id"] === "AUG-NEW-02");
  if (!verAugNew02) {
    console.error("  FAIL: AUG-NEW-02 not found.");
    anyFail = true;
  } else if (verAugNew02["source_status"] !== "expected") {
    console.error(`  FAIL: AUG-NEW-02 source_status="${verAugNew02["source_status"]}" expected="expected".`);
    anyFail = true;
  } else {
    log(`  AUG-NEW-02 source_status="expected"  PASS`);
  }
}

// Guard: confirm no January 2027 page was accidentally created
const janPage = verCals.find(p => p.slug === "january-2027-uae-calendar");
if (janPage) {
  console.error("  FAIL: january-2027-uae-calendar was created -- should NOT be in this phase.");
  anyFail = true;
} else {
  log("  No January 2027 page created.  PASS");
}

// Guard: confirm no ADIPEC event was accidentally created
const adipecRow = verEvents.find(e => e.slug === "adipec-2026-abu-dhabi");
if (adipecRow) {
  console.error("  FAIL: adipec-2026-abu-dhabi was created -- NOT approved in this phase.");
  anyFail = true;
} else {
  log("  No ADIPEC detail page created.  PASS");
}

if (anyFail) abort("Verification failed. See FAIL lines above.");

// ---- Summary ---------------------------------------------------------------

section("Local import complete -- summary");
log(`
DB PATH: ${DB_PATH}
BACKUP:  ${BACKUP_PATH}

EVENTS INSERTED AND PUBLISHED (1):

  ENS:  id=${ensId}
        slug=${ENS_SLUG}
        url=/events/${ENS_SLUG}
        ru_url=/ru/events/${ENS_SLUG}
        dates=2026-12-08 to 2026-12-10
        venue=Dubai Exhibition Centre, Expo City Dubai
        category=company  color_type=major-event

CALENDAR ITEMS APPENDED (2):

  DEC-ENS    -> december-2026-uae-calendar  (Dec 8-10, detail_url=/events/${ENS_SLUG})
  NOV-GFMFG  -> november-2026-dubai-calendar  (Nov 3-5, no detail page)

CALENDAR BUG FIXES (2):

  august-2026-dubai-calendar: has_islamic_dates -> 1
  august-2026-dubai-calendar: AUG-NEW-02.source_status -> "expected"

NOT IMPORTED (as per approved scope):

  - January 2027 calendar page
  - NYE Dec 31 expected item
  - ADIPEC detail page
  - Global Village opening date
  - DSF dates
  - ILT20
  - Frieze

ROLLBACK:
  sqlite3 data/guides.db "DELETE FROM events WHERE slug='${ENS_SLUG}';"
  cp "${BACKUP_PATH}" data/guides.db
`);
