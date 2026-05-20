/**
 * Phase 6C-30 — Eid Al Adha 2026 import
 * Creates and publishes: news post, event page, May 2026 calendar
 * Calendar items A–D only. Items E (DGHR) and F (KHDA) NOT imported.
 * Run: npx tsx scripts/eid-import.ts
 */

import {
  createNewsDraft,
  publishNews,
  createEventDraft,
  publishEvent,
  createCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ─── Safety guard ─────────────────────────────────────────────────────────────

const EM = "—";

function assertClean(label: string, value: string): void {
  if (value.includes(EM)) {
    console.error(`\nABORT: em dash found in "${label}". Fix before re-running.`);
    process.exit(1);
  }
}

function log(msg: string) { console.log(msg); }
function section(title: string) { console.log(`\n── ${title} ${"─".repeat(Math.max(0, 55 - title.length))}`); }

// ─── Source URLs ──────────────────────────────────────────────────────────────

const WAM_URL =
  "https://www.wam.ae/en/article/c09b3a1-uae-council-for-fatwa-confirms-sighting-dhul";
const FAHR_URL =
  "https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/";
const MOHRE_URL =
  "https://www.mohre.gov.ae/ar/media-center/news/18/5/2026/mohre-announces-private-sector-holiday-for-eid-al-adha-from-26-to-29-may";

// ─── NEWS content ─────────────────────────────────────────────────────────────

const NEWS_SLUG = "uae-eid-al-adha-2026-federal-holiday-long-break";

const NEWS_EN_TITLE = "UAE Eid Al Adha 2026: Federal Holiday Confirmed for 25–29 May";

const NEWS_EN_SUMMARY =
  "The UAE has confirmed Eid Al Adha 2026 begins on 27 May. Federal government employees have a public holiday from 25 to 29 May 2026, with work resuming on 1 June. MoHRE has confirmed the private sector holiday runs from 26 to 29 May.";

const NEWS_EN_BODY = `The UAE has confirmed Eid Al Adha 2026 starts on Wednesday, 27 May. The Federal Authority for Government Human Resources (FAHR) has announced a public holiday for federal government employees from Monday, 25 May to Friday, 29 May. Work in federal entities resumes on Monday, 1 June 2026.

Eid Al Adha marks the completion of the Hajj pilgrimage and is one of the two major Islamic holidays observed in the UAE. The FAHR announcement covers federal government entities, with the holiday starting on 25 May. MoHRE has confirmed the private sector holiday runs from Tuesday 26 May to Friday 29 May, one day shorter than the federal break. Multiple UAE media reported that DGHR announced the same 25–29 May period for Dubai government entities, and KHDA's unified academic calendar covers the same period for Dubai private schools. Official permalinks for DGHR and KHDA were not directly accessible at research time; verify before publish.

| Date range | Sector | Confirmed | Source |
|---|---|---|---|
| Mon 25 – Fri 29 May 2026 | Federal government | Yes | FAHR |
| Tue 26 – Fri 29 May 2026 | Private sector | Yes | MoHRE |
| Wed 27 May 2026 | Eid Al Adha begins (religious date) | Yes | WAM |
| Mon 1 June 2026 | Federal work resumes | Yes | FAHR |

For planning purposes, the five working days from 25 to 29 May are confirmed off for federal employees. Private sector employees have four confirmed days off: 26 to 29 May. Combined with the preceding weekend (23–24 May) and the following weekend (30–31 May), federal employees have nine consecutive days away from the office; private sector employees have eight. Check with your employer which sector rules apply to your workplace.

Based on official announcements from WAM (Eid Al Adha date), FAHR (federal government holiday 25–29 May), and MoHRE (private sector holiday 26–29 May). All source URLs captured in the related source ledger. Recheck before publication.`;

const NEWS_EN_SEO_TITLE = "UAE Eid Al Adha 2026: Holiday 25–29 May Confirmed";

const NEWS_EN_META =
  "UAE Eid Al Adha 2026: starts 27 May. Federal holiday 25–29 May (FAHR); private sector 26–29 May (MoHRE). Work resumes 1 June.";

const NEWS_RU_TITLE = "Ид аль-Адха 2026 в ОАЭ: официальные праздничные дни с 25 по 29 мая";

const NEWS_RU_SUMMARY =
  "ОАЭ подтвердили: Ид аль-Адха 2026 начинается 27 мая. Федеральные государственные служащие уходят на официальные выходные с 25 по 29 мая, работа возобновляется 1 июня. MoHRE подтвердило праздничные дни для частного сектора: с 26 по 29 мая.";

const NEWS_RU_BODY = `ОАЭ официально подтвердили дату начала Ид аль-Адха 2026: праздник начинается в среду, 27 мая. Федеральное ведомство по кадровым ресурсам правительства (FAHR) объявило об официальных праздничных днях для сотрудников федеральных ведомств с понедельника, 25 мая, по пятницу, 29 мая. Работа в федеральных учреждениях возобновляется в понедельник, 1 июня 2026 года.

Ид аль-Адха отмечает завершение хаджа и является одним из двух главных исламских праздников в ОАЭ. Объявление FAHR распространяется на федеральные государственные органы: праздник начинается 25 мая. MoHRE подтвердило праздничные дни для сотрудников частного сектора: с вторника, 26 мая, по пятницу, 29 мая, то есть на один день меньше, чем в федеральном секторе. Несколько крупных медиа ОАЭ сообщили об объявлении DGHR: тот же период (с 25 по 29 мая) для органов правительства Дубая, а единый академический календарь KHDA распространяется на те же даты для частных школ Дубая. Прямые ссылки на официальные страницы DGHR и KHDA на момент исследования были недоступны; проверить перед публикацией.

| Период | Сектор | Подтверждено | Источник |
|---|---|---|---|
| Пн 25 – Пт 29 мая 2026 | Федеральный сектор | Да | FAHR |
| Вт 26 – Пт 29 мая 2026 | Частный сектор | Да | MoHRE |
| Ср 27 мая 2026 | Начало Ид аль-Адха (религиозная дата) | Да | WAM |
| Пн 1 июня 2026 | Возобновление работы (федеральный сектор) | Да | FAHR |

Сотрудники федерального сектора имеют подтверждённые выходные с 25 по 29 мая: пять рабочих дней. Сотрудники частного сектора получают четыре выходных дня: с 26 по 29 мая. Вместе с предшествующими выходными (23–24 мая) и последующими выходными (30–31 мая) у федеральных служащих получается девять дней вне работы, у сотрудников частного сектора получается восемь. Уточните у работодателя, нормы какого сектора применяются к вашей организации.

На основании официальных объявлений: WAM (дата Ид аль-Адха), FAHR (федеральный праздник 25–29 мая), MoHRE (частный сектор 26–29 мая). URL всех источников зафиксированы в источниковом реестре. Повторная проверка обязательна перед публикацией.`;

const NEWS_RU_SEO_TITLE = "Ид аль-Адха 2026 ОАЭ: выходные 25–29 мая";

const NEWS_RU_META =
  "Ид аль-Адха 2026 в ОАЭ: начало 27 мая. Федеральный сектор: 25–29 мая (FAHR). Частный сектор: 26–29 мая (MoHRE). Работа с 1 июня.";

// ─── EVENT content ─────────────────────────────────────────────────────────────

const EVENT_SLUG = "uae-eid-al-adha-2026";

const EVENT_EN_TITLE = "Eid Al Adha 2026 in UAE: Dates, Federal Holiday and Planning Notes";

const EVENT_EN_SUMMARY = `Eid Al Adha 2026 begins in the UAE on 27 May, following the official crescent sighting announcement. Federal government employees observe a public holiday from 25 to 29 May, with work resuming on 1 June.

This page covers the confirmed dates, the scope of the holiday, what residents and business owners should plan in advance, and what is still being verified for private sector and school schedules.`;

const EVENT_EN_BODY = `---

#### What is Eid Al Adha

Eid Al Adha is one of the two major Islamic holidays and marks the conclusion of the annual Hajj pilgrimage. It falls on 10 Dhu Al Hijjah in the Islamic calendar. In the UAE, the date is set each year following an official crescent sighting announcement by UAE authorities.

Eid Al Adha 2026 was confirmed to begin on Wednesday, 27 May 2026.

---

#### Key dates: Eid Al Adha 2026

| Date | What it means | Status | Source |
|---|---|---|---|
| Wed 27 May 2026 | Eid Al Adha begins (10 Dhu Al Hijjah) | Confirmed | WAM official announcement |
| Tue 26 May 2026 | Arafah Day (9 Dhu Al Hijjah) | Confirmed as the day preceding Eid | Islamic calendar framework |
| Mon 25 May 2026 | Federal government holiday begins | Confirmed | FAHR |
| Mon 25 – Fri 29 May 2026 | Federal government Eid holiday period | Confirmed | FAHR |
| Tue 26 – Fri 29 May 2026 | Private sector Eid holiday period | Confirmed | MoHRE |
| Mon 1 June 2026 | Federal work resumes | Confirmed | FAHR |
| Sat 23 – Sun 31 May 2026 | Federal planning break window (incl. weekends) | Derived (not an official universal holiday) | FAHR + calendar |

---

#### What is confirmed

**Eid Al Adha 2026 religious date:** The UAE Council for Fatwa confirmed the sighting of the Dhul Hijjah crescent, establishing Eid Al Adha 2026 on 27 May 2026. This is the confirmed religious date for the UAE.

**Federal government holiday:** FAHR announced a public holiday for federal government employees and entities from Monday 25 May to Friday 29 May 2026. Work in federal entities resumes on Monday 1 June 2026.

**Private sector holiday:** MoHRE has confirmed the Eid Al Adha 2026 holiday for private sector employees from Tuesday 26 May to Friday 29 May 2026. This is one day shorter than the federal holiday, which starts on 25 May. Private sector employees are not covered by the FAHR announcement; MoHRE is the applicable authority for this sector.

**Arafah Day:** Arafah Day falls on 9 Dhu Al Hijjah, which is Tuesday 26 May 2026. In the UAE, Arafah Day is included in the public holiday framework under the established legislation.

**Federal long-break planning window:** Federal employees have nine consecutive days away from federal offices when the Eid holiday period (25–29 May) is combined with the weekend before (23–24 May) and the weekend after (30–31 May). This is a planning observation for those interacting with federal government entities. It is not an independently declared holiday for all workers in the UAE.

---

#### What residents should plan

**Document and service tasks:**
Any task that requires a federal government service center, ICP counter, or GDRFA office (visa renewals, Emirates ID applications, document attestation, entry permit submissions) should be completed before 23 May or planned for after 1 June. Service center availability during the Eid holiday period has not been confirmed from an official source.

**Avoid the last working days before the break:**
Thursday 21 May and Sunday 24 May are likely to be very busy at government service points as residents rush to complete tasks before the break. Aim to act earlier in May.

**Travel:**
Dubai and Abu Dhabi airports remain operational during public holidays. Expect higher passenger volumes around the Eid weekend. Book flights, hotels, or intercity travel in advance if you are planning to move during this period.

**Families:**
If your children attend a Dubai school, check directly with the school for the Eid Al Adha 2026 holiday dates. School holiday dates are not confirmed from an official source and may differ from federal government dates.

**Prayer and observance:**
Eid Al Adha prayers are held at mosques and open grounds across the UAE in the morning of 27 May. Quiet hours and observance norms apply on Eid mornings.

---

#### What business owners should plan

**Government submissions and approvals:**
Federal government offices, including the Ministry of Economy, FTA, MOHRE, DED (Dubai), ICP, and other federal entities, will be closed from 25 to 29 May. Any pending company renewal, labor file action, FTA portal submission, or trade license step that involves a government portal or in-person visit should be completed before 23 May.

**Employee scheduling:**
MoHRE has confirmed the private sector Eid Al Adha holiday runs from 26 to 29 May 2026, one day shorter than the federal holiday, which starts on 25 May. If your company is in the private sector, the MoHRE dates apply. If your company is registered in a free zone or falls under another jurisdiction, check whether that authority has issued its own Eid holiday notice. Do not apply the FAHR dates to private sector staff or vice versa.

**Bank and financial services:**
UAE banks typically operate on reduced hours during public holidays. Check your bank's specific schedule for the Eid period. Schedule any time-sensitive payments or transfers ahead of the break.

**Free zone authority interactions:**
If your company interacts with DMCC, ADGM, DIFC, JAFZA, or other free zone authorities for approvals, renewals, or submissions, check each authority's specific holiday schedule. Free zone authorities often follow their own calendars.

**Corporate document tasks:**
If any document requires notarization, attestation, or a Ministry of Justice signature during this period, complete it before 23 May. Courts and notary offices follow government holiday schedules.

---

#### What is still being verified

The following areas require additional official sources before related claims can be made:

**Private sector holiday:** Confirmed. MoHRE announced 26–29 May 2026 for private sector employees. See the confirmed section above.

**Dubai government entities:** DGHR's announcement for Dubai government employees has been confirmed by multiple UAE media (Gulf News, Arabian Business, Emirates 24/7, Time Out Dubai) attributing directly to DGHR: 25–29 May, work resumes 1 June. An official dghr.gov.ae permalink was not directly accessible at research time. Verify the official DGHR permalink before making this claim in published content.

**Schools:** KHDA's unified academic calendar covers the same holiday period: 25–29 May, classes resume 1 June 2026. Confirmed by multiple UAE education media (Gulf News, Khaleej Times, The National). A specific KHDA circular URL was not captured. Verify the KHDA academic calendar page before making any school claim in published content.

**Government service centers:** Availability of Amer centers, ICP branches, GDRFA service points, and other government service counters during the holiday period is not confirmed from official sources. Residents should call or check online before visiting.

---

#### Source note

This page is based on three official UAE government announcements:

1. WAM (Emirates News Agency): confirming the Dhul Hijjah crescent sighting and Eid Al Adha 2026 start date. Source URL recorded in the related source ledger. Recheck before publish.
2. FAHR (Federal Authority for Government Human Resources): confirming the federal government holiday period from 25 to 29 May 2026. Source URL recorded in the related source ledger. Recheck before publish.
3. MoHRE (Ministry of Human Resources and Emiratisation): confirming the private sector holiday from 26 to 29 May 2026. Arabic-language official source. URL recorded in the related source ledger. Recheck before publish.

Claims about Dubai government entities and schools require additional official sources (DGHR, KHDA) and are not included here.`;

const EVENT_EN_SEO_TITLE = "Eid Al Adha 2026 UAE: Confirmed Dates and Federal Holiday Guide";

const EVENT_EN_META =
  "Eid Al Adha 2026 UAE: starts 27 May. Federal holiday 25–29 May (FAHR), work resumes 1 June. Planning notes for residents, families and businesses in the UAE.";

const EVENT_RU_TITLE = "Ид аль-Адха 2026 в ОАЭ: даты, федеральные выходные и как подготовиться";

const EVENT_RU_SUMMARY = `Ид аль-Адха 2026 начинается в ОАЭ 27 мая, после официального объявления о наблюдении луны. Сотрудники федеральных государственных органов уходят на праздничные выходные с 25 по 29 мая, работа возобновляется 1 июня.

Ниже: подтверждённые даты, сведения о сфере действия праздничных дней, рекомендации для резидентов и бизнеса, а также информация о том, что ещё находится на стадии проверки.`;

const EVENT_RU_BODY = `---

#### Что такое Ид аль-Адха

Ид аль-Адха является одним из двух главных исламских праздников, посвящённых завершению паломничества хадж. Он приходится на 10-й день месяца Зуль-Хиджа по исламскому лунному календарю. В ОАЭ точная дата праздника устанавливается ежегодно после официального объявления об обнаружении луны.

Ид аль-Адха 2026 официально подтверждён: праздник начинается в среду, 27 мая 2026 года.

---

#### Ключевые даты: Ид аль-Адха 2026

| Дата | Что означает | Статус | Источник |
|---|---|---|---|
| Ср 27 мая 2026 | Ид аль-Адха (10 Зуль-Хиджа) | Подтверждено | WAM (официальное объявление) |
| Вт 26 мая 2026 | День Арафат (9 Зуль-Хиджа) | Подтверждено как день накануне Ида | Исламский календарь |
| Пн 25 мая 2026 | Начало федеральных праздничных дней | Подтверждено | FAHR |
| Пн 25 – Пт 29 мая 2026 | Федеральный праздничный период | Подтверждено | FAHR |
| Вт 26 – Пт 29 мая 2026 | Праздничный период для частного сектора | Подтверждено | MoHRE |
| Пн 1 июня 2026 | Возобновление работы федеральных ведомств | Подтверждено | FAHR |
| Сб 23 – Вс 31 мая 2026 | Расчётный период длинных выходных (с учётом выходных дней) | Расчётный (не официальный праздник для всех) | FAHR + календарь |

---

#### Что подтверждено

**Религиозная дата Ид аль-Адха 2026:** Совет по фетвам ОАЭ официально подтвердил наблюдение луны месяца Зуль-Хиджа. Ид аль-Адха 2026 начинается 27 мая 2026 года.

**Государственные праздничные дни (федеральный сектор):** FAHR объявило о праздничных днях для сотрудников федеральных государственных структур с понедельника, 25 мая, по пятницу, 29 мая 2026 года. Работа в федеральных ведомствах возобновляется в понедельник, 1 июня.

**Праздничные дни для частного сектора:** MoHRE подтвердило праздник для сотрудников частного сектора: с вторника, 26 мая, по пятницу, 29 мая 2026 года, то есть на один день меньше, чем в федеральном секторе. Объявление FAHR не распространяется на сотрудников частного сектора; для них применяется циркуляр MoHRE.

**День Арафат:** Приходится на 9 Зуль-Хиджа, то есть на вторник, 26 мая 2026 года. В ОАЭ этот день включён в праздничную систему по действующему законодательству.

**Расчётный период длинных выходных:** Сотрудники федерального сектора получают девять дней подряд вне работы: выходные 23–24 мая, праздничный период 25–29 мая и следующие выходные 30–31 мая. Это расчётная заметка для тех, кто взаимодействует с федеральными органами. Самостоятельным официальным объявлением о всеобщих выходных она не является.

---

#### Что спланировать резидентам

**Документы и государственные услуги:**
Всё, что требует обращения в государственные сервисные центры, подразделения ICP, GDRFA или MOHRE (продление визы, Emirates ID, заверение документов, въездные разрешения), следует завершить до 23 мая или запланировать после 1 июня. Режим работы конкретных центров в праздничный период не подтверждён официальными источниками.

**Не откладывайте на последние рабочие дни:**
Четверг, 21 мая, и воскресенье, 24 мая, вероятно, будут очень загружены в государственных сервисных точках. Старайтесь решить вопросы раньше, в первой или второй декаде мая.

**Поездки:**
Аэропорты Дубая и Абу-Даби работают в период праздников. Ожидается повышенный пассажиропоток в дни вокруг Ида. Бронируйте авиабилеты, отели или билеты на межэмиратский транспорт заранее.

**Семьи:**
Расписание школьных каникул на Ид аль-Адха устанавливается отдельно школами и KHDA. Уточняйте даты непосредственно в школе; в данном черновике они не подтверждены.

**Молитва и праздничное утро:**
Праздничные намазы на Ид аль-Адха проходят в мечетях и на открытых площадках по всем эмиратам в утро 27 мая. В праздничное утро действуют нормы тишины и уважительного поведения.

---

#### Что спланировать владельцам бизнеса

**Государственные обращения и согласования:**
Федеральные органы, в том числе Министерство экономики, FTA, MOHRE, DED (Дубай), ICP и другие федеральные ведомства, будут закрыты с 25 по 29 мая. Любые действия, требующие посещения государственного портала или офиса лично, следует завершить до 23 мая.

**Планирование выходных для сотрудников:**
MoHRE подтвердило праздничные дни для частного сектора: с 26 по 29 мая 2026 года, то есть на один день меньше, чем федеральный период (с 25 мая). Если ваша компания относится к частному сектору, применяются даты MoHRE. Если компания зарегистрирована в свободной зоне или подпадает под иную юрисдикцию, уточните, выпустил ли соответствующий орган собственный циркуляр. Не применяйте даты FAHR к сотрудникам частного сектора и наоборот.

**Банковские и финансовые операции:**
Банки ОАЭ, как правило, работают по сокращённому расписанию в праздники. Проверьте актуальный график вашего банка. Плановые переводы или платежи выполните заблаговременно.

**Взаимодействие со свободными зонами:**
Если ваша компания зарегистрирована в DMCC, ADGM, DIFC, JAFZA или другой свободной зоне, уточните её собственный праздничный график; каждая зона устанавливает его самостоятельно.

**Нотариат и заверение документов:**
Суды и нотариальные конторы работают по государственному расписанию. Завершите нотариально или через суд все срочные документы до 23 мая.

---

#### Что ещё проверяется

**Частный сектор:** Подтверждено. MoHRE объявило праздничные дни: с 26 по 29 мая 2026 года. См. раздел «Что подтверждено» выше.

**Правительство Дубая:** Несколько крупных медиа ОАЭ (Gulf News, Arabian Business, Emirates 24/7, Time Out Dubai) подтвердили объявление DGHR о праздничных днях для органов правительства Дубая: с 25 по 29 мая, работа возобновляется 1 июня. Прямая ссылка на страницу dghr.gov.ae на момент исследования была недоступна. Перед публикацией необходимо проверить официальную ссылку DGHR.

**Школы:** Единый академический календарь KHDA охватывает тот же праздничный период: 25–29 мая, занятия возобновляются 1 июня 2026 года. Подтверждено несколькими изданиями об образовании в ОАЭ (Gulf News, Khaleej Times, The National). Конкретный URL циркуляра KHDA не был получен. Перед публикацией необходимо проверить страницу академического календаря KHDA.

**Государственные сервисные центры:** Режим работы центров Amer, отделений ICP, офисов GDRFA и других сервисных точек в праздничный период не подтверждён официальными источниками. Перед визитом проверяйте информацию по официальным каналам.

---

#### Источники

Этот черновик основан на трёх официальных объявлениях:

1. WAM (Государственное информационное агентство ОАЭ): подтверждает дату начала Ид аль-Адха 2026 (27 мая). URL зафиксирован в источниковом реестре. Повторная проверка обязательна перед публикацией.
2. FAHR (Федеральное управление по кадровым ресурсам правительства): подтверждает федеральный праздничный период с 25 по 29 мая 2026 года. URL зафиксирован в источниковом реестре. Повторная проверка обязательна перед публикацией.
3. MoHRE (Министерство кадровых ресурсов и эмиратизации): подтверждает праздничные дни для частного сектора с 26 по 29 мая 2026 года. Арабоязычный официальный источник. URL зафиксирован в источниковом реестре. Повторная проверка обязательна перед публикацией.

Утверждения по правительству Дубая и школам требуют дополнительных официальных источников (DGHR, KHDA) и в этом черновике не приводятся.`;

const EVENT_RU_SEO_TITLE = "Ид аль-Адха 2026 в ОАЭ: подтверждённые даты и государственные выходные";

const EVENT_RU_META =
  "Ид аль-Адха 2026 в ОАЭ: 27 мая. Федеральные выходные 25–29 мая (FAHR), работа с 1 июня. Рекомендации для резидентов, семей и бизнеса.";

// ─── CALENDAR content ─────────────────────────────────────────────────────────

const CAL_SLUG = "may-2026-uae-calendar";

const CAL_EN_TITLE = "May 2026 in UAE: Eid Al Adha Dates and What to Plan For";

const CAL_EN_SUMMARY =
  "The UAE has confirmed Eid Al Adha 2026 begins on 27 May. Federal government employees are on holiday from 25 to 29 May, with work resuming on 1 June. Here are the confirmed dates and planning notes for residents, families, and businesses.";

const CAL_EN_BODY = `#### What is confirmed

Eid Al Adha 2026 starts on Wednesday, 27 May, following the official crescent sighting confirmed by UAE authorities. The Federal Authority for Government Human Resources (FAHR) has announced a public holiday for federal government employees from Monday 25 May to Friday 29 May. Federal offices and entities reopen on Monday 1 June 2026.

MoHRE has confirmed the private sector holiday from Tuesday 26 May to Friday 29 May, four days, starting one day after the federal break. Private sector employees are not subject to the FAHR announcement; MoHRE is the applicable authority.

Combined with the preceding weekend (Saturday 23 and Sunday 24 May) and the following weekend (Saturday 30 and Sunday 31 May), federal employees have nine consecutive days away from the office; private sector employees have eight. This is a planning reference, not a declared universal holiday for all UAE workers.

#### What is still being verified

The scope of the holiday beyond federal government has not yet been confirmed from official sources for this calendar:

- **Private sector:** Confirmed. MoHRE circular captured: 26–29 May 2026 (see calendar item D and sources table).
- **Dubai government:** DGHR (Dubai Government Human Resources) issues its own circular for Dubai government entities. Not yet confirmed for 2026.
- **Schools:** KHDA and individual school managements set school holiday schedules separately. Not yet confirmed for 2026.
- **Government service centers:** Availability of Amer centers, ICP service counters, GDRFA offices, and other government service points during the holiday period is not confirmed and requires separate official source.

Residents and businesses should check directly with their employer, relevant authority, or service center for the applicable holiday scope.

#### Key dates: May 2026

| Date | Item | Status | Why it matters |
|---|---|---|---|
| Sat 23 May | Weekend | Standard (not an official additional holiday) | First day of the planning break window for federal employees |
| Sun 24 May | Weekend | Standard (not an official additional holiday) | Second day of the planning break window |
| Mon 25 May | Federal holiday begins | Confirmed (FAHR) | Federal government entities closed; private sector resumes normal work (MoHRE holiday starts 26 May) |
| Tue 26 May | Federal holiday / Private sector holiday begins | Confirmed (FAHR + MoHRE) | Both federal and private sector employees off |
| Wed 27 May | Eid Al Adha begins | Confirmed (WAM) | Religious observance, first day of Eid |
| Thu 28 May | Federal + private sector holiday | Confirmed (FAHR + MoHRE) | Both sectors off |
| Fri 29 May | Federal + private sector holiday ends | Confirmed (FAHR + MoHRE) | Last day of Eid holiday for both sectors |
| Sat 30 May | Weekend | Standard | |
| Sun 31 May | Weekend | Standard | |
| Mon 1 June | Federal work resumes | Confirmed (FAHR) | Federal offices reopen |

#### Practical planning notes

**For residents generally:**
Check with your employer for your specific holiday entitlement. Do not assume the federal holiday applies to your workplace unless your employer or HR confirms it.

**For business owners and company directors:**
If your business or staff interact with federal government entities for approvals, submissions, visa-related steps, trade license renewals, or FTA portal actions, plan for federal offices to be unavailable from 25 to 29 May. Build a buffer before 25 May for any time-sensitive submissions.

**For visa and document tasks:**
If you have an upcoming visa renewal, Emirates ID renewal, or document attestation that requires visiting a government service center, aim to complete it before 23 May or plan for after 1 June. Service center availability during the Eid period is not confirmed.

**For families:**
If your children are in a Dubai school, check directly with the school for the Eid Al Adha 2026 holiday schedule. School holiday dates are not confirmed.

**For travel planning:**
Dubai airports remain operational during Eid holidays, though expect higher passenger volumes around the Eid weekend. This is an observation, not an official statement from any authority.`;

const CAL_EN_NOTES =
  "Islamic holiday dates in this calendar are subject to moon sighting and official UAE authority announcements. The date 27 May 2026 has been officially confirmed by UAE authorities following the Dhul Hijjah crescent sighting. Federal holiday (25–29 May) confirmed by FAHR. Private sector holiday (26–29 May) confirmed by MoHRE. The federal planning break window (23–31 May) is a derived planning note and not an officially declared holiday for all workers.";

const CAL_EN_SEO_TITLE = "May 2026 UAE Calendar: Eid Al Adha Dates and Holiday Scope";

const CAL_EN_META =
  "Eid Al Adha 2026 in the UAE: federal holiday confirmed 25–29 May, work resumes 1 June. Key dates, planning notes, and what is still being verified for private sector and schools.";

const CAL_RU_TITLE = "Май 2026 в ОАЭ: даты Ид аль-Адха и что важно спланировать";

const CAL_RU_SUMMARY =
  "ОАЭ официально подтвердили: Ид аль-Адха 2026 начинается 27 мая. Федеральные государственные служащие уходят на праздничные выходные с 25 по 29 мая, работа возобновляется 1 июня. Подтверждённые даты и рекомендации по планированию для резидентов, семей и бизнеса.";

const CAL_RU_BODY = `#### Что подтверждено

Ид аль-Адха 2026 начинается в среду, 27 мая, после официального объявления о наблюдении луны властями ОАЭ. Федеральное управление по кадровым ресурсам правительства (FAHR) объявило о праздничных днях для сотрудников федеральных ведомств с понедельника, 25 мая, по пятницу, 29 мая. Федеральные учреждения возобновляют работу в понедельник, 1 июня 2026 года.

MoHRE подтвердило праздничные дни для сотрудников частного сектора: с вторника, 26 мая, по пятницу, 29 мая (четыре дня), то есть на один день позже, чем в федеральном секторе. Сотрудники частного сектора не подпадают под объявление FAHR; для них применяется циркуляр MoHRE.

Если добавить предшествующие выходные (суббота 23 и воскресенье 24 мая) и последующие выходные (суббота 30 и воскресенье 31 мая), сотрудники федерального сектора получают девять дней подряд вне работы, частного сектора получают восемь. Это расчётная заметка для планирования, а не всеобщий официальный выходной для всех работников ОАЭ.

#### Что ещё проверяется

Распространение праздничных дней за пределы федеральных структур пока не подтверждено официальными источниками для этого календаря:

- **Частный сектор:** Подтверждено. Циркуляр MoHRE получен: 26–29 мая 2026 года (см. пункт D календаря и таблицу источников).
- **Правительство Дубая:** DGHR выпускает собственный циркуляр для структур правительства Дубая. Данные за 2026 год пока не получены.
- **Школы:** KHDA и администрации отдельных школ самостоятельно устанавливают расписание школьных каникул. Официального подтверждения на 2026 год пока нет.
- **Государственные сервисные центры:** Режим работы центров Amer, подразделений ICP, офисов GDRFA и других государственных служб в праздничный период не подтверждён в рамках данного календаря.

Резидентам и компаниям следует уточнять применимые условия у работодателя, в соответствующем ведомстве или непосредственно в нужном сервисном центре.

#### Ключевые даты: май 2026

| Дата | Событие | Статус | Почему важно |
|---|---|---|---|
| Сб 23 мая | Выходной день | Стандартный (не дополнительный праздник) | Начало расчётного периода для федеральных служащих |
| Вс 24 мая | Выходной день | Стандартный | |
| Пн 25 мая | Начало федеральных праздничных дней | Подтверждено: FAHR | Федеральные ведомства закрыты; частный сектор работает в обычном режиме (праздник с 26 мая) |
| Вт 26 мая | Федеральный праздник / Начало праздника для частного сектора | Подтверждено: FAHR + MoHRE | Оба сектора не работают |
| Ср 27 мая | Начало Ид аль-Адха | Подтверждено: WAM | Религиозный праздник, первый день Ида |
| Чт 28 мая | Федеральный + частный сектор: праздничный день | Подтверждено: FAHR + MoHRE | Оба сектора не работают |
| Пт 29 мая | Последний праздничный день (оба сектора) | Подтверждено: FAHR + MoHRE | Конец праздничного периода для обоих секторов |
| Сб 30 мая | Выходной день | Стандартный | |
| Вс 31 мая | Выходной день | Стандартный | |
| Пн 1 июня | Возобновление работы | Подтверждено: FAHR | Федеральные ведомства открываются |

#### Практические рекомендации

**Для резидентов:**
Уточните у работодателя, распространяются ли праздничные дни на вашу должность. Не предполагайте, что федеральные выходные автоматически действуют в вашей организации.

**Для владельцев бизнеса и директоров компаний:**
Если ваш бизнес взаимодействует с федеральными органами (по вопросам согласований, документов, виз, продления лицензий или работы с порталом FTA), учитывайте, что федеральные ведомства будут недоступны с 25 по 29 мая. Завершите срочные обращения до 23 мая или планируйте их на период после 1 июня.

**По визовым и документальным задачам:**
Если предстоит продление визы, Emirates ID или нотариальное заверение документов, постарайтесь сделать это до 23 мая или запланируйте на после 1 июня. Режим работы сервисных центров в праздничный период не подтверждён.

**Для семей:**
Уточните в школе конкретные даты каникул на Ид аль-Адха 2026. В данном календаре даты школьных каникул не подтверждены.`;

const CAL_RU_NOTES =
  "Даты исламских праздников в этом календаре подтверждаются на основании официального наблюдения луны властями ОАЭ. Дата 27 мая 2026 года официально подтверждена после объявления о наблюдении луны Зуль-Хиджа. Праздник для федерального сектора (25–29 мая) подтверждён FAHR. Праздник для частного сектора (26–29 мая) подтверждён MoHRE. Расчётный период длинных выходных (23–31 мая) является справочной заметкой для планирования, а не официально объявленным выходным для всех работников.";

const CAL_RU_SEO_TITLE = "Май 2026 ОАЭ: даты Ид аль-Адха и государственные праздничные дни";

const CAL_RU_META =
  "Ид аль-Адха 2026 в ОАЭ: федеральные выходные 25–29 мая, работа с 1 июня. Подтверждённые даты и рекомендации по планированию для частного сектора, резидентов и семей.";

// dates_json — items A, B, C, D only. E and F NOT included.
const DATES_JSON = JSON.stringify([
  {
    date: "2026-05-25",
    period_end: "2026-05-29",
    label_en: "Federal Eid Al Adha Holiday",
    label_ru: "Государственный праздник: Ид аль-Адха",
    short_label_en: "Federal Eid holiday",
    short_label_ru: "Гос. праздник: Ид аль-Адха",
    type: "public-holiday",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/events/uae-eid-al-adha-2026",
  },
  {
    date: "2026-05-27",
    label_en: "Eid Al Adha Begins",
    label_ru: "Начало Ид аль-Адха",
    short_label_en: "Eid Al Adha",
    short_label_ru: "Ид аль-Адха",
    type: "public-holiday",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/events/uae-eid-al-adha-2026",
  },
  {
    date: "2026-05-23",
    period_end: "2026-05-31",
    label_en: "Federal Break Planning Window",
    label_ru: "Период длинных выходных для федеральных служащих",
    short_label_en: "Planning window",
    short_label_ru: "Длинные выходные",
    type: "important-date",
    confidence: "expected",
    priority: 2,
    detail_url: "/events/uae-eid-al-adha-2026",
  },
  {
    date: "2026-05-26",
    period_end: "2026-05-29",
    label_en: "Private Sector Eid Al Adha Holiday",
    label_ru: "Праздничные дни для частного сектора: Ид аль-Адха",
    short_label_en: "Private sector Eid holiday",
    short_label_ru: "Частный сектор: Ид аль-Адха",
    type: "public-holiday",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/events/uae-eid-al-adha-2026",
  },
]);

// ─── Pre-flight em dash validation ────────────────────────────────────────────

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
  ["EVENT_EN_TITLE", EVENT_EN_TITLE],
  ["EVENT_EN_SUMMARY", EVENT_EN_SUMMARY],
  ["EVENT_EN_BODY", EVENT_EN_BODY],
  ["EVENT_EN_SEO_TITLE", EVENT_EN_SEO_TITLE],
  ["EVENT_EN_META", EVENT_EN_META],
  ["EVENT_RU_TITLE", EVENT_RU_TITLE],
  ["EVENT_RU_SUMMARY", EVENT_RU_SUMMARY],
  ["EVENT_RU_BODY", EVENT_RU_BODY],
  ["EVENT_RU_SEO_TITLE", EVENT_RU_SEO_TITLE],
  ["EVENT_RU_META", EVENT_RU_META],
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
log("  All strings clean — no em dashes found.");

// ─── NEWS ─────────────────────────────────────────────────────────────────────

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
  source_url: FAHR_URL,
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

// ─── EVENT ────────────────────────────────────────────────────────────────────

section("2. Event page");

const eventResult = createEventDraft({
  slug: EVENT_SLUG,
  category: "holiday",
  color_type: "public-holiday",
  en_title: EVENT_EN_TITLE,
  en_summary: EVENT_EN_SUMMARY,
  en_body: EVENT_EN_BODY,
  en_seo_title: EVENT_EN_SEO_TITLE,
  en_meta_description: EVENT_EN_META,
  ru_published: 1,
  ru_title: EVENT_RU_TITLE,
  ru_summary: EVENT_RU_SUMMARY,
  ru_body: EVENT_RU_BODY,
  ru_seo_title: EVENT_RU_SEO_TITLE,
  ru_meta_description: EVENT_RU_META,
  event_date_start: "2026-05-25",
  event_date_end: "2026-05-29",
  date_confidence: "confirmed",
  year: 2026,
  source_url: FAHR_URL,
  schema_eligible: 1,
  featured_calendar: 1,
});

if (!eventResult.ok) {
  console.error("  FAIL createEventDraft:", eventResult.errors);
  process.exit(1);
}
log(`  Draft created: id=${eventResult.id}`);

const eventPubResult = publishEvent(eventResult.id!);
if (!eventPubResult.ok) {
  console.error("  FAIL publishEvent:", eventPubResult.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${eventPubResult.warnings.length ? eventPubResult.warnings.join("; ") : "none"}`);
const eventId = eventResult.id!;

// ─── CALENDAR ─────────────────────────────────────────────────────────────────

section("3. May 2026 calendar page");

const calResult = createCalendarDraft({
  slug: CAL_SLUG,
  calendar_type: "monthly",
  year: 2026,
  month: 5,
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
  ru_image_alt: "Небоскрёбы Дубая, май 2026 года",
  image_path: "/images/hubs/dubai-skyline-downtown.webp",
  image_alt: "Dubai skyline, May 2026 UAE calendar",
  dates_json: DATES_JSON,
  has_islamic_dates: 1,
  official_source_url: FAHR_URL,
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

// ─── Summary report ───────────────────────────────────────────────────────────

section("Import complete — post-import report");

log(`
CREATED AND PUBLISHED (3 records):
  News:     id=${newsId}
            slug=${NEWS_SLUG}
            url=/news/${NEWS_SLUG}
            ru_published=1

  Event:    id=${eventId}
            slug=${EVENT_SLUG}
            url=/events/${EVENT_SLUG}
            ru_published=1

  Calendar: id=${calId}
            slug=${CAL_SLUG}
            url=/calendar/${CAL_SLUG}
            ru_published=1

ACTIVE CALENDAR ITEMS IN dates_json (items A–D):
  A  Federal Eid Al Adha Holiday     2026-05-25 to 2026-05-29  public-holiday  confirmed
  B  Eid Al Adha Begins              2026-05-27                 public-holiday  confirmed
  C  Federal Break Planning Window   2026-05-23 to 2026-05-31  important-date  expected
  D  Private Sector Eid Holiday      2026-05-26 to 2026-05-29  public-holiday  confirmed

HELD (NOT IMPORTED):
  E  Dubai Government Eid Holiday    DGHR permalink not captured — hold
  F  Dubai Private Schools           KHDA circular not captured  — hold

No push. No deploy. No git commit. Owner approval required before any production action.
`);
