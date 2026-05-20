/**
 * Phase 6C-37 — UAE Emiratisation June 30 2026 import
 * Creates and publishes: news post + calendar page (Item A only)
 *
 * Item B (20-49 employees) is NOT imported — held pending 2026-specific source.
 * Blocked claim: June 30 2026 is not confirmed for the 20-49 band.
 *
 * Sources verified live 2026-05-20 (HTTP 200):
 *   Source 1: MoHRE news 7 May 2026 — confirms June 30 for 50+ employees
 *   Source 2: MoHRE Emiratisation targets page — confirms thresholds, no June 30 for 20-49
 *
 * Run: npx tsx scripts/emiratisation-june30-import.ts
 */

import {
  createNewsDraft,
  publishNews,
  createCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// Safety constants
const EM = "—"; // em dash (U+2014)

function assertClean(label: string, value: string): void {
  if (value.includes(EM)) {
    console.error(`\nABORT: em dash found in "${label}". Fix before re-running.`);
    process.exit(1);
  }
}

function log(msg: string) { console.log(msg); }
function section(title: string) { console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`); }

// Source URLs
const MOHRE_NEWS_URL =
  "https://mohre.gov.ae/en/media-center/news/7/5/2026/mohre-30-june-deadline-for-achieving-emiratisation-targets-for-first-half-of-2026";

// ---- NEWS content -------------------------------------------------------

const NEWS_SLUG = "uae-emiratisation-june-30-2026-deadline";

const NEWS_EN_TITLE =
  "MoHRE Confirms 30 June 2026 Emiratisation Deadline for Private-Sector Companies";

const NEWS_EN_SUMMARY =
  "MoHRE has confirmed 30 June 2026 as the semi-annual Emiratisation deadline for private-sector companies with 50 or more employees. Companies that do not meet the target face financial contributions starting from 1 July 2026.";

const NEWS_EN_BODY = `MoHRE has confirmed 30 June 2026 as the deadline for private-sector companies to achieve their first-half 2026 Emiratisation targets. The announcement was published by MoHRE on 7 May 2026. Companies that miss the deadline face financial contributions starting from 1 July 2026.

For companies with 50 or more employees, the requirement is to achieve 1% semi-annual growth in their Emiratisation rate in skilled jobs, equivalent to the annual 2% growth target, for the first half of 2026. This is the threshold for which the 30 June 2026 deadline is confirmed in MoHRE's official communications. Separate Emiratisation requirements apply to companies with 20 to 49 employees. These companies are required to have at least one UAE national in a skilled job. The applicable 2026 deadline for this band should be verified directly with MoHRE, as the captured 2026-specific source does not clearly state June 30 applies to this category.

Before 30 June, companies with 50 or more employees should verify their current Emiratisation headcount in skilled jobs and confirm their progress toward the 1% growth target. The specific financial contribution amount for failure to meet the semi-annual target has not been confirmed by MoHRE in a format suitable for Guidex to report. Verify the current contribution schedule with MoHRE or a qualified HR adviser before taking decisions based on a specific figure.

This deadline applies to private-sector companies. Scope for free zone companies has not been confirmed from an official MoHRE source. If your company operates in a free zone, check your obligations directly with MoHRE.

The June 30 target covers the first half of 2026. A second Emiratisation cycle ends on 31 December 2026 for the full-year target. Companies that do not meet the mid-year target should take action before the December deadline.

Emiratisation counting is based on UAE nationals in skilled jobs. The exact categories of roles that count as skilled jobs should be confirmed with MoHRE or from the official Emiratisation targets page before conducting any internal compliance assessment.

#### What business owners should check

- Confirm whether your company has 50 or more employees. The June 30 2026 deadline is confirmed for this band.
- If your company has 50 or more employees, verify your current number of UAE national employees in skilled jobs and your progress toward the 1% growth target.
- If your company has 20 to 49 employees, check the current applicable 2026 Emiratisation deadline directly with MoHRE. The June 30 2026 date has not been confirmed for this band from the sources reviewed for this article.
- Confirm your company type is in scope (private sector).
- If operating in a free zone, check your Emiratisation obligations directly with MoHRE.
- Confirm the financial contribution schedule for the 2026 semi-annual target with MoHRE if you anticipate missing the deadline.

#### What not to assume

- That free zone companies are exempt. Scope for free zone companies has not been confirmed from an official source in either direction.
- The exact financial contribution amount. Historical contribution rates exist but a 2026 semi-annual specific amount has not been confirmed by Guidex from an official source.
- That any role qualifies. The definition of skilled jobs for Emiratisation counting should be verified with MoHRE for your specific workforce.
- That companies with 20 to 49 employees have a June 30 2026 deadline. Separate requirements apply to this band, but the June 30 2026 date for this category was not confirmed from the 2026-specific MoHRE source reviewed for this article.
- That companies with fewer than 20 employees have Emiratisation obligations. No official source reviewed for this article confirms obligations for sub-20 employee companies.

Two official MoHRE sources support this article. The MoHRE news page published 7 May 2026 confirms the 30 June 2026 deadline for the first-half Emiratisation targets for private-sector companies. This source is the basis for the June 30 deadline as it applies to companies with 50 or more employees. The MoHRE Emiratisation targets page confirms the 1% semi-annual growth requirement for companies with 50 or more employees, and also confirms that a separate Emiratisation threshold exists for companies with 20 to 49 employees (1 UAE national in a skilled job). The 2026-specific deadline for the 20-49 band is not clearly stated in the captured sources. The article accordingly directs readers in this band to check directly with MoHRE.

This article is an information resource. It is not HR or legal advice. For advice on your specific company situation, consult MoHRE or a qualified HR adviser.`;

const NEWS_EN_SEO_TITLE = "UAE Emiratisation Deadline: 30 June 2026, MoHRE Confirms";

const NEWS_EN_META =
  "MoHRE: 30 June 2026 Emiratisation deadline for private-sector companies with 50 or more employees. Financial contributions from 1 July 2026.";

// RU

const NEWS_RU_TITLE =
  "MoHRE подтвердил срок Emiratisation: 30 июня 2026 для компаний частного сектора";

const NEWS_RU_SUMMARY =
  "MoHRE подтвердил 30 июня 2026 года как полугодовой срок по Emiratisation для компаний частного сектора с 50 и более сотрудниками. Компании, не выполнившие целевые показатели, несут финансовые обязательства с 1 июля 2026 года.";

const NEWS_RU_BODY = `MoHRE подтвердил 30 июня 2026 года как срок для компаний частного сектора по выполнению полугодовых целей Emiratisation. Официальное сообщение было опубликовано MoHRE 7 мая 2026 года. Компании, не выполнившие целевые показатели, несут финансовые обязательства с 1 июля 2026 года.

Для компаний с 50 и более сотрудниками требование предполагает рост доли граждан ОАЭ на квалифицированных должностях на 1% в первом полугодии, что соответствует годовому целевому показателю в 2%. Именно для этой категории срок 30 июня 2026 года подтверждён официальными материалами MoHRE. Для компаний с 20 до 49 сотрудников действует отдельное требование по Emiratisation: как минимум один гражданин ОАЭ должен быть трудоустроен на квалифицированной должности. Применимый срок 2026 года для этой категории следует уточнить непосредственно в MoHRE, поскольку захваченный источник 2026 года не подтверждает явно применимость даты 30 июня к компаниям с 20-49 сотрудниками.

До 30 июня компаниям с 50 и более сотрудниками следует проверить текущее количество граждан ОАЭ на квалифицированных позициях и оценить прогресс в достижении нормы 1% роста. Конкретная сумма финансовых взносов за несоблюдение полугодового срока в 2026 году не подтверждена MoHRE в виде, пригодном для публикации на Guidex. Рекомендуем уточнить актуальный размер взносов непосредственно в MoHRE или у квалифицированного HR-консультанта.

Данный срок распространяется на компании частного сектора. Применимость требований к компаниям в свободных зонах официально не подтверждена в доступных источниках MoHRE. Если ваша компания зарегистрирована в свободной зоне, уточните свои обязательства по Emiratisation непосредственно в MoHRE.

Срок 30 июня охватывает первое полугодие 2026 года. Следующий контрольный период заканчивается 31 декабря 2026 года для выполнения годовых показателей. Компании, не выполнившие цели за первое полугодие, должны принять меры до декабрьского срока.

Учёт в рамках Emiratisation ведётся по гражданам ОАЭ, занятым на квалифицированных должностях. Конкретный перечень должностей, включаемых в расчёт, следует уточнить в MoHRE или на официальной странице целей Emiratisation до проведения внутренней оценки соответствия требованиям.

#### Что проверить владельцам бизнеса

- Уточните, есть ли в вашей компании 50 и более сотрудников. Именно для этой категории подтверждён срок 30 июня 2026.
- Если в компании 50 и более сотрудников, проверьте текущее количество граждан ОАЭ на квалифицированных должностях и прогресс в достижении нормы 1% роста.
- Если в вашей компании 20-49 сотрудников, уточните применимый срок Emiratisation 2026 года непосредственно в MoHRE. Дата 30 июня 2026 для этой категории не подтверждена источниками, рассмотренными для данной статьи.
- Убедитесь, что тип вашей компании входит в сферу действия требований (частный сектор).
- Если компания работает в свободной зоне, уточните обязательства по Emiratisation непосредственно в MoHRE.
- Уточните в MoHRE размер финансовых взносов за 2026 год, если вы предполагаете не выполнить целевые показатели до срока.

#### Что не следует предполагать

- Что компании в свободных зонах освобождены от требований. Применимость к свободным зонам не подтверждена официальным источником ни в одном из направлений.
- Конкретную сумму финансовых взносов. Guidex не публикует исторические ставки в качестве подтверждённых данных для 2026 года.
- Что любая должность учитывается при подсчёте. Перечень квалифицированных должностей следует уточнить в MoHRE.
- Что для компаний с 20-49 сотрудниками срок составляет 30 июня 2026. Для данной категории действуют отдельные требования, но дата 30 июня 2026 для этой группы не подтверждена в 2026-специфичном источнике MoHRE, рассмотренном для данной статьи.
- Что компании менее 20 сотрудников не имеют обязательств. Источники MoHRE не подтверждают обязательства для компаний с менее чем 20 сотрудниками.

Данная статья основана на двух официальных источниках MoHRE. Новость MoHRE от 7 мая 2026 года подтверждает срок 30 июня 2026 для компаний частного сектора. Этот источник является основанием для даты 30 июня применительно к компаниям с 50 и более сотрудниками. Страница целей Emiratisation на сайте MoHRE подтверждает показатель 1% роста за полугодие для компаний с 50+ сотрудниками, а также наличие отдельного порога для компаний с 20-49 сотрудниками (1 гражданин ОАЭ на квалифицированной должности). Срок 2026 года для категории 20-49 сотрудников в захваченных источниках не указан явно. Статья соответственно направляет читателей из этой категории уточнять срок в MoHRE.

Данная статья является информационным ресурсом. Она не является юридической или HR-консультацией. По вопросам, касающимся конкретной ситуации вашей компании, обращайтесь в MoHRE или к квалифицированному HR-специалисту.`;

const NEWS_RU_SEO_TITLE = "Срок Emiratisation 30 июня 2026: требования MoHRE для компаний";

const NEWS_RU_META =
  "MoHRE: срок Emiratisation 30 июня 2026 для компаний частного сектора с 50+ сотрудниками. Финансовые взносы с 1 июля 2026 при несоблюдении.";

// ---- CALENDAR content (Item A only) ------------------------------------

const CAL_SLUG = "uae-emiratisation-june-30-2026-reminder";

const CAL_EN_TITLE =
  "UAE Emiratisation 30 June 2026: Deadline for 50+ Employee Companies";

const CAL_EN_SUMMARY =
  "30 June 2026 is the Emiratisation quota deadline for private-sector mainland companies with 50 or more employees. Companies that miss this deadline become subject to financial contributions from 1 July 2026.";

const CAL_EN_BODY = `30 June 2026 is the end of the Q2 2026 Emiratisation quota period for private-sector mainland companies with 50 or more employees. Companies in this category must meet a 1% semi-annual Emiratisation quota by this date. Non-compliant companies become subject to financial contributions from 1 July 2026. Free zone companies follow a separate framework.

Separate Emiratisation requirements apply to companies with 20 to 49 employees. The applicable 2026 deadline for that band should be verified with MoHRE.

Source: MoHRE official announcement, 7 May 2026. For full details, see the linked article.`;

const CAL_EN_NOTES =
  "Scope: private-sector mainland companies with 50 or more employees only. Calendar Item B (20 to 49 employees) is not included: the June 30 2026 date for that band has not been confirmed from a 2026-specific official source.";

const CAL_EN_SEO_TITLE =
  "Emiratisation Deadline 30 June 2026: Private-Sector Companies 50+";

const CAL_EN_META =
  "UAE Emiratisation Q2 2026 deadline: 30 June 2026 for private-sector companies with 50 or more employees. 1% semi-annual quota. Contributions from 1 July 2026.";

// RU

const CAL_RU_TITLE =
  "Срок Emiratisation 30 июня 2026: квота для компаний с 50+ сотрудниками";

const CAL_RU_SUMMARY =
  "30 июня 2026 года истекает квота по Emiratisation для компаний частного сектора материкового ОАЭ с 50 и более сотрудниками. Компании, не выполнившие норму к этой дате, несут финансовые обязательства с 1 июля 2026 года.";

const CAL_RU_BODY = `30 июня 2026 года завершается расчётный период Q2 2026 по программе Emiratisation для компаний частного сектора материкового ОАЭ с численностью 50 и более сотрудников. Компании данной категории обязаны выполнить квоту в 1% на полугодие к этой дате. При невыполнении квоты к 30 июня финансовые взносы начисляются с 1 июля 2026 года. Для компаний в свободных зонах действует отдельный регулятив.

Для компаний с 20-49 сотрудниками действуют отдельные требования. Актуальный срок следует уточнить в MoHRE.

Источник: официальное сообщение MoHRE от 7 мая 2026 года. Подробнее см. в связанной статье.`;

const CAL_RU_NOTES =
  "Сфера действия: только компании частного сектора материкового ОАЭ с 50 и более сотрудниками. Пункт B (20-49 сотрудников) не включён: дата 30 июня 2026 для этой категории не подтверждена 2026-специфичным официальным источником.";

const CAL_RU_SEO_TITLE =
  "Срок Emiratisation 30 июня 2026: компании с 50+ сотрудниками";

const CAL_RU_META =
  "Срок Emiratisation Q2 2026: 30 июня для компаний частного сектора с 50 и более сотрудниками. Квота 1% за полугодие. Взносы с 1 июля 2026.";

// dates_json — Item A ONLY. Item B is NOT included.
const DATES_JSON = JSON.stringify([
  {
    date: "2026-06-30",
    label_en: "Emiratisation deadline: 50+ employee companies",
    label_ru: "Срок Emiratisation: компании с 50+ сотрудниками",
    short_label_en: "Emiratisation deadline (50+)",
    short_label_ru: "Срок Emiratisation (50+)",
    type: "compliance_deadline",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/news/uae-emiratisation-june-30-2026-deadline",
  },
]);

// ---- Pre-flight em dash validation ----------------------------------------

section("Pre-flight em dash validation");

const ALL_STRINGS: Array<[string, string]> = [
  ["NEWS_EN_TITLE", NEWS_EN_TITLE],
  ["NEWS_EN_SUMMARY", NEWS_EN_SUMMARY],
  ["NEWS_EN_BODY", NEWS_EN_BODY],
  ["NEWS_EN_SEO_TITLE", NEWS_EN_SEO_TITLE],
  ["NEWS_EN_META", NEWS_EN_META],
  ["NEWS_RU_TITLE", NEWS_RU_TITLE],
  ["NEWS_RU_SUMMARY", NEWS_RU_SUMMARY],
  ["NEWS_RU_BODY", NEWS_RU_BODY],
  ["NEWS_RU_SEO_TITLE", NEWS_RU_SEO_TITLE],
  ["NEWS_RU_META", NEWS_RU_META],
  ["CAL_EN_TITLE", CAL_EN_TITLE],
  ["CAL_EN_SUMMARY", CAL_EN_SUMMARY],
  ["CAL_EN_BODY", CAL_EN_BODY],
  ["CAL_EN_NOTES", CAL_EN_NOTES],
  ["CAL_EN_SEO_TITLE", CAL_EN_SEO_TITLE],
  ["CAL_EN_META", CAL_EN_META],
  ["CAL_RU_TITLE", CAL_RU_TITLE],
  ["CAL_RU_SUMMARY", CAL_RU_SUMMARY],
  ["CAL_RU_BODY", CAL_RU_BODY],
  ["CAL_RU_NOTES", CAL_RU_NOTES],
  ["CAL_RU_SEO_TITLE", CAL_RU_SEO_TITLE],
  ["CAL_RU_META", CAL_RU_META],
];

for (const [label, value] of ALL_STRINGS) {
  assertClean(label, value);
}
log("  All strings clean -- no em dashes found.");

// ---- 1. News post --------------------------------------------------------

section("1. News post");

const newsResult = createNewsDraft({
  slug: NEWS_SLUG,
  category: "government",
  en_title: NEWS_EN_TITLE,
  en_summary: NEWS_EN_SUMMARY,
  en_body: NEWS_EN_BODY,
  en_seo_title: NEWS_EN_SEO_TITLE,
  en_meta_description: NEWS_EN_META,
  ru_published: 1,
  ru_title: NEWS_RU_TITLE,
  ru_summary: NEWS_RU_SUMMARY,
  ru_body: NEWS_RU_BODY,
  ru_seo_title: NEWS_RU_SEO_TITLE,
  ru_meta_description: NEWS_RU_META,
  source_url: MOHRE_NEWS_URL,
  source_label: "official",
  date_published: "2026-05-20",
  date_updated: "2026-05-20",
  noindex: 0,
});

if (!newsResult.ok) {
  console.error("  FAIL createNewsDraft:", newsResult.errors);
  process.exit(1);
}
log(`  Draft created: id=${newsResult.id}`);

const newsPubResult = publishNews(newsResult.id!);
if (!newsPubResult.ok) {
  console.error("  FAIL publishNews:", newsPubResult.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${newsPubResult.warnings.length ? newsPubResult.warnings.join("; ") : "none"}`);
const newsId = newsResult.id!;

// ---- 2. Calendar page (Item A only) ------------------------------------

section("2. Calendar page -- Item A (50+ employees) ONLY");

const calResult = createCalendarDraft({
  slug: CAL_SLUG,
  calendar_type: "important_dates",
  year: 2026,
  en_title: CAL_EN_TITLE,
  en_summary: CAL_EN_SUMMARY,
  en_body: CAL_EN_BODY,
  en_notes: CAL_EN_NOTES,
  en_seo_title: CAL_EN_SEO_TITLE,
  en_meta_description: CAL_EN_META,
  ru_published: 1,
  ru_title: CAL_RU_TITLE,
  ru_summary: CAL_RU_SUMMARY,
  ru_body: CAL_RU_BODY,
  ru_notes: CAL_RU_NOTES,
  ru_seo_title: CAL_RU_SEO_TITLE,
  ru_meta_description: CAL_RU_META,
  ru_image_alt: "Деловой квартал Дубая, срок Emiratisation июнь 2026",
  image_path: "/images/hubs/dubai-skyline-downtown.webp",
  image_alt: "Dubai business district, Emiratisation compliance deadline June 2026",
  dates_json: DATES_JSON,
  has_islamic_dates: 0,
  official_source_url: MOHRE_NEWS_URL,
  last_verified_date: "2026-05-20",
  featured_homepage: 0,
});

if (!calResult.ok) {
  console.error("  FAIL createCalendarDraft:", calResult.errors);
  process.exit(1);
}
log(`  Draft created: id=${calResult.id}`);

const calPubResult = publishCalendar(calResult.id!);
if (!calPubResult.ok) {
  console.error("  FAIL publishCalendar:", calPubResult.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${calPubResult.warnings.length ? calPubResult.warnings.join("; ") : "none"}`);
const calId = calResult.id!;

// ---- Summary report ----------------------------------------------------

section("Import complete -- post-import report");

log(`
CREATED AND PUBLISHED (2 records):

  News:     id=${newsId}
            slug=${NEWS_SLUG}
            url=/news/${NEWS_SLUG}
            ru_url=/ru/news/${NEWS_SLUG}
            ru_published=1
            category=government
            source_label=official
            noindex=0

  Calendar: id=${calId}
            slug=${CAL_SLUG}
            url=/calendar/${CAL_SLUG}
            ru_url=/ru/calendar/${CAL_SLUG}
            ru_published=1
            calendar_type=important_dates
            year=2026

ACTIVE CALENDAR ITEMS in dates_json (Item A ONLY):
  A  Emiratisation deadline (50+ employees)   2026-06-30   compliance_deadline   confirmed
     detail_url=/news/uae-emiratisation-june-30-2026-deadline

HELD (NOT IMPORTED):
  B  Emiratisation deadline (20-49 employees)  HOLD -- 2026 date not confirmed for this band

SOURCE VERIFICATION:
  Source 1: MoHRE news 7 May 2026 -- HTTP 200 -- confirmed June 30 for 50+ band
  Source 2: MoHRE targets page -- HTTP 200 -- confirms thresholds, no June 30 for 20-49 band
  Item B hold: VALIDATED (Source 1 does not mention 20-49 employees at all)

No push. No deploy. No git commit. Owner production approval required.
`);
