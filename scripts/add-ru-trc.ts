// Adds Russian content to the existing tax-residency-certificate-uae guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-trc.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "tax-residency-certificate-uae";
const EXPECTED_STEPS = 8;
const DB_PATH        = path.join(process.cwd(), "data", "guides.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Content guards ────────────────────────────────────────────────────────────

const EM_DASH = "—";

function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM_DASH)) {
    console.error(`FAIL em-dash found in ${label}`);
    process.exit(1);
  }
}

function assertNoGuarantee(label: string, value: string): void {
  const lower = value.toLowerCase();
  const forbidden = [
    "гарантир",
    "100% одобрени",
    "guaranteed",
    "will be approved",
  ];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL guarantee language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

// ── RU guide content ──────────────────────────────────────────────────────────

const RU_GUIDE = {
  ru_title:
    "Сертификат налогового резидентства ОАЭ для физических лиц и компаний",
  ru_summary:
    "Помогаем оформить Tax Residency Certificate в ОАЭ через FTA и EmaraTax: " +
    "проверка кейса, подготовка документов и сопровождение подачи для резидентов, " +
    "компаний и инвесторов.",
  ru_audience:
    "Инвесторы, владельцы бизнеса, резиденты ОАЭ, компании free zone и mainland " +
    "с международными банковскими или налоговыми требованиями.",
  ru_overview:
    "Федеральная налоговая служба ОАЭ (FTA) выдаёт Tax Residency Certificate (TRC): " +
    "документ, подтверждающий налоговый статус физического лица или компании в ОАЭ. " +
    "Банки, иностранные налоговые органы и международные финансовые структуры требуют " +
    "TRC для KYC, CRS/FATCA, применения соглашений об избежании двойного налогообложения " +
    "и подтверждения резидентства. Guidex определяет правильный тип сертификата до подачи.\n\n" +
    "Физические лица подтверждают право на TRC по одному из трёх маршрутов квалификации, " +
    "основанных на фактическом пребывании в ОАЭ или на ОАЭ как основном месте жительства. " +
    "Компании подтверждают право через факт регистрации и ведения деятельности в стране. Выбор маршрута, " +
    "точность периода и полнота документов влияют на результат рассмотрения. Guidex " +
    "проверяет кейс, формирует досье и сопровождает подачу через EmaraTax.",
};

// ── RU step content ───────────────────────────────────────────────────────────

const RU_STEPS: Array<{
  ru_title:   string;
  ru_what:    string;
  ru_where:   string;
  ru_address: string;
  ru_advice:  string;
  ru_warning: string;
}> = [
  // Step 1
  {
    ru_title: "Определить цель сертификата",
    ru_what:
      "TRC бывает двух видов: для применения соглашения об избежании двойного " +
      "налогообложения с конкретной страной и для банковского KYC, CRS/FATCA и других " +
      "внутренних целей. Цель определяет тип сертификата и применимую правовую базу. " +
      "Guidex устанавливает правильный тип до начала подачи.",
    ru_where:   "Действий на этом этапе не требуется.",
    ru_address: "",
    ru_advice:
      "Если запрос поступил от иностранного банка или налогового органа, передайте " +
      "их письмо Guidex. Обычно в нём указана цель и нужный период.",
    ru_warning:
      "Сертификат, оформленный для неверной цели, не корректируется. " +
      "Требуется новая заявка и новые госпошлины.",
  },
  // Step 2
  {
    ru_title: "Подтвердить маршрут квалификации",
    ru_what:
      "Физические лица подходят по одному из трёх маршрутов: 183 или более дней " +
      "фактического пребывания в ОАЭ в любой 12-месячный период; от 90 до 182 дней в " +
      "сочетании с правом на проживание и постоянным адресом или работой в ОАЭ; ОАЭ как " +
      "основное место жительства и центр финансовых и личных интересов. Компании, как " +
      "правило, должны быть зарегистрированы в ОАЭ не менее 12 месяцев. Guidex оценивает " +
      "соответствие критериям до выбора маршрута.",
    ru_where:
      "Справка о въездах и выездах через ICA или GDRFA нужна при маршрутах, " +
      "основанных на подсчёте дней.",
    ru_address: "ICA: ica.gov.ae / GDRFA Dubai",
    ru_advice:
      "Маршрут 183 дней наиболее распространён и наиболее признаётся за рубежом " +
      "при применении налоговых соглашений. Профили с меньшим сроком пребывания " +
      "требуют детального анализа.",
    ru_warning:
      "Наличие резидентской визы ОАЭ само по себе не подтверждает право на TRC. " +
      "Сначала необходимо проверить данные о фактическом пребывании.",
  },
  // Step 3
  {
    ru_title: "Определить период сертификата",
    ru_what:
      "TRC охватывает один конкретный период продолжительностью до 12 месяцев. " +
      "Будущие периоды не покрываются. Если требуется несколько периодов, каждый " +
      "оформляется отдельной заявкой. Guidex согласует точный период с вами и " +
      "запрашивающей стороной до подачи.",
    ru_where:   "Действий не требуется. Guidex координирует.",
    ru_address: "",
    ru_advice:
      "Иностранные банки и налоговые органы, как правило, сами указывают нужный " +
      "период. Согласование до подачи исключает ненужную повторную заявку.",
    ru_warning:
      "Сертификат за неверный период не исправляется путём внесения поправок.",
  },
  // Step 4
  {
    ru_title: "Подготовить документы удостоверения личности и резидентства",
    ru_what:
      "Состав документов зависит от типа заявителя. Физическим лицам потребуются " +
      "действующий паспорт, Emirates ID, резидентская виза ОАЭ, подтверждение адреса " +
      "в ОАЭ; для маршрутов с подсчётом дней нужна справка о въездах и выездах. " +
      "Компаниям потребуются торговая лицензия, учредительные документы, подтверждение " +
      "наличия офиса, паспорт и Emirates ID уполномоченного подписанта, а при " +
      "необходимости и подтверждение реального управления компанией из ОАЭ. Guidex " +
      "формирует точный перечень для вашего кейса и проверяет все документы до подачи.",
    ru_where:
      "Справка о въездах и выездах через ICA или GDRFA для индивидуальных " +
      "маршрутов с подсчётом дней.",
    ru_address: "ICA: ica.gov.ae / GDRFA Dubai",
    ru_advice:
      "Guidex проверяет весь пакет до отправки в FTA. Пробелы и просроченные " +
      "документы выявляются до подачи, а не после.",
    ru_warning:
      "Просроченные Emirates ID или резидентские визы влекут отказ. " +
      "Продлите их до подачи досье.",
  },
  // Step 5
  {
    ru_title: "Подготовить финансовые или корпоративные документы",
    ru_what:
      "Состав документов зависит от маршрута и кейса. Наёмным сотрудникам, как " +
      "правило, нужна справка о зарплате или трудовой договор. Самозанятым и владельцам " +
      "бизнеса: торговая лицензия. Компаниям: учредительные документы, торговая " +
      "лицензия и подтверждение наличия офиса. Guidex уточняет точный перечень. " +
      "Требования варьируются: часть документов, ранее считавшихся обязательными, " +
      "в соответствии с обновлёнными правилами FTA от октября 2024 года больше " +
      "не является обязательной.",
    ru_where:   "Работодатель, корпоративные записи или орган регистрации бизнеса.",
    ru_address: "",
    ru_advice:
      "Требования изменились после обновления правил FTA в октябре 2024 года. " +
      "Guidex уточняет актуальный перечень для вашего маршрута до начала сбора документов.",
    ru_warning:
      "Отсутствие одного документа сбрасывает таймер рассмотрения FTA. " +
      "Guidex формирует полное досье до подачи.",
  },
  // Step 6
  {
    ru_title: "Подать через EmaraTax",
    ru_what:
      "Guidex готовит полное досье и сопровождает подачу через EmaraTax. При наличии " +
      "полномочий Guidex управляет процессом: выбирает правильный тип сертификата, тип " +
      "заявителя и период, загружает документы и производит оплату госпошлины.",
    ru_where:   "EmaraTax: сервис TRC от FTA.",
    ru_address: "trc.tax.gov.ae",
    ru_advice:
      "Полное досье проверяется до подачи. FTA не возвращает госпошлину при отказе.",
    ru_warning:
      "Госпошлина за подачу не возвращается даже при отказе в выдаче сертификата.",
  },
  // Step 7
  {
    ru_title: "Ответить на запрос FTA",
    ru_what:
      "Если FTA запросит дополнительные сведения, Guidex управляет подготовкой ответа. " +
      "Таймер рассмотрения перезапускается с момента получения FTA ответа. Хорошо " +
      "подготовленное первоначальное досье снижает вероятность запроса.",
    ru_where:   "EmaraTax: тот же портал.",
    ru_address: "trc.tax.gov.ae",
    ru_advice:
      "Большинство запросов связано с одним отсутствующим или неточным документом. " +
      "Guidex готовит досье, чтобы минимизировать вероятность запросов.",
    ru_warning:
      "Оставленный без ответа запрос может повлечь аннулирование заявки и " +
      "необходимость новой подачи.",
  },
  // Step 8
  {
    ru_title: "Получить сертификат",
    ru_what:
      "После одобрения цифровой TRC доступен в EmaraTax. Guidex передаёт его готовым " +
      "к предоставлению в запрашивающий банк или орган. Если требуется бумажная " +
      "заверенная копия, Guidex организует это в процессе подачи заявки.",
    ru_where:
      "EmaraTax для цифрового сертификата. Курьер FTA для бумажной копии " +
      "(только адреса в ОАЭ).",
    ru_address: "trc.tax.gov.ae",
    ru_advice:
      "Уточните у запрашивающей стороны, принимают ли они цифровой сертификат, " +
      "прежде чем заказывать бумажную копию. Большинство банков и налоговых органов " +
      "принимают цифровую версию.",
    ru_warning:
      "Бумажная копия доставляется только по адресам в ОАЭ. Для иностранных " +
      "получателей цифровой формат является правильным.",
  },
];

// ── Pre-write validation ──────────────────────────────────────────────────────

console.log("Running pre-write content validation...");

if (RU_STEPS.length !== EXPECTED_STEPS) {
  console.error(`FAIL step count: expected ${EXPECTED_STEPS}, got ${RU_STEPS.length}`);
  process.exit(1);
}

const guideFields: Record<string, string> = {
  ru_title:    RU_GUIDE.ru_title,
  ru_summary:  RU_GUIDE.ru_summary,
  ru_audience: RU_GUIDE.ru_audience,
  ru_overview: RU_GUIDE.ru_overview,
};

for (const [key, val] of Object.entries(guideFields)) {
  assertNoEmDash(`guide.${key}`, val);
  assertNoGuarantee(`guide.${key}`, val);
  if (!val.trim()) {
    console.error(`FAIL guide.${key} is empty`);
    process.exit(1);
  }
}

for (let i = 0; i < RU_STEPS.length; i++) {
  const s = RU_STEPS[i];
  const stepLabel = `step${i + 1}`;
  for (const [key, val] of Object.entries(s)) {
    assertNoEmDash(`${stepLabel}.${key}`, val);
    assertNoGuarantee(`${stepLabel}.${key}`, val);
  }
  if (!s.ru_title.trim()) {
    console.error(`FAIL ${stepLabel}.ru_title is empty`);
    process.exit(1);
  }
  if (!s.ru_what.trim()) {
    console.error(`FAIL ${stepLabel}.ru_what is empty`);
    process.exit(1);
  }
}

console.log(
  `Pre-write validation passed (${Object.keys(guideFields).length} guide fields, ` +
  `${RU_STEPS.length} steps).`
);

// ── Pre-write state ───────────────────────────────────────────────────────────

const guide = db
  .prepare(
    `SELECT id, slug, en_title, ru_title, published
     FROM guides WHERE slug = ?`
  )
  .get(SLUG) as {
    id: string;
    slug: string;
    en_title: string;
    ru_title: string;
    published: number;
  } | undefined;

if (!guide) {
  console.error(`FAIL guide '${SLUG}' not found in DB. Run scripts/add-en-trc.ts first.`);
  process.exit(1);
}

if (guide.published !== 1) {
  console.error(`FAIL guide is not published (published=${guide.published}). Check DB.`);
  process.exit(1);
}

const stepRows = db
  .prepare(
    `SELECT id, step_order, en_title, ru_title
     FROM steps WHERE guide_id = ? ORDER BY step_order`
  )
  .all(guide.id) as { id: string; step_order: number; en_title: string; ru_title: string }[];

if (stepRows.length !== EXPECTED_STEPS) {
  console.error(
    `FAIL step count mismatch: expected ${EXPECTED_STEPS}, found ${stepRows.length}. ` +
    `Cannot safely update.`
  );
  process.exit(1);
}

console.log(`\nBefore:`);
console.log(`  Guide slug:   ${guide.slug}`);
console.log(`  Guide ID:     ${guide.id}`);
console.log(`  EN title:     ${guide.en_title}`);
console.log(`  RU title:     ${guide.ru_title || "(empty)"}`);
console.log(`  Published:    ${guide.published}`);
console.log(`  Steps found:  ${stepRows.length}`);
console.log(`  RU steps:     ${stepRows.filter((r) => r.ru_title !== "").length} have ru_title`);

// ── Transaction: UPDATE ru_* only ────────────────────────────────────────────

const updateGuide = db.prepare(
  `UPDATE guides
   SET ru_title    = ?,
       ru_summary  = ?,
       ru_audience = ?,
       ru_overview = ?
   WHERE id = ?`
);

const updateStep = db.prepare(
  `UPDATE steps
   SET ru_title   = ?,
       ru_what    = ?,
       ru_where   = ?,
       ru_address = ?,
       ru_advice  = ?,
       ru_warning = ?
   WHERE id = ?`
);

db.transaction(() => {
  updateGuide.run(
    RU_GUIDE.ru_title,
    RU_GUIDE.ru_summary,
    RU_GUIDE.ru_audience,
    RU_GUIDE.ru_overview,
    guide.id,
  );

  for (let i = 0; i < stepRows.length; i++) {
    const row = stepRows[i];
    const ru  = RU_STEPS[i];
    updateStep.run(
      ru.ru_title,
      ru.ru_what,
      ru.ru_where,
      ru.ru_address,
      ru.ru_advice,
      ru.ru_warning,
      row.id,
    );
    console.log(`  Updated step ${row.step_order}: ${ru.ru_title}`);
  }
})();

// ── Post-write verification ───────────────────────────────────────────────────

const after = db
  .prepare(
    `SELECT id, slug, en_title, ru_title, ru_summary, ru_audience, ru_overview,
            published, category
     FROM guides WHERE slug = ?`
  )
  .get(SLUG) as {
    id: string; slug: string; en_title: string;
    ru_title: string; ru_summary: string; ru_audience: string; ru_overview: string;
    published: number; category: string;
  } | undefined;

if (!after) {
  console.error("FAIL post-write: guide not found.");
  process.exit(1);
}

const afterSteps = db
  .prepare(
    `SELECT step_order, en_title, ru_title, ru_what
     FROM steps WHERE guide_id = ? ORDER BY step_order`
  )
  .all(after.id) as {
    step_order: number; en_title: string; ru_title: string; ru_what: string;
  }[];

// Check counts
if (afterSteps.length !== EXPECTED_STEPS) {
  console.error(`FAIL post-write step count: expected ${EXPECTED_STEPS}, got ${afterSteps.length}`);
  process.exit(1);
}

// Check no ru_* fields are empty
if (!after.ru_title.trim()) {
  console.error("FAIL post-write: guide ru_title is empty.");
  process.exit(1);
}
if (!after.ru_summary.trim()) {
  console.error("FAIL post-write: guide ru_summary is empty.");
  process.exit(1);
}
if (!after.ru_overview.trim()) {
  console.error("FAIL post-write: guide ru_overview is empty.");
  process.exit(1);
}

for (const row of afterSteps) {
  if (!row.ru_title.trim()) {
    console.error(`FAIL post-write: step ${row.step_order} ru_title is empty.`);
    process.exit(1);
  }
  if (!row.ru_what.trim()) {
    console.error(`FAIL post-write: step ${row.step_order} ru_what is empty.`);
    process.exit(1);
  }
}

// Check EN fields untouched
if (after.en_title !== guide.en_title) {
  console.error(
    `FAIL post-write: en_title changed. Before: "${guide.en_title}", After: "${after.en_title}"`
  );
  process.exit(1);
}

// Em-dash check on all ru_* fields in DB
const EM_CHECK_FIELDS = [
  after.ru_title, after.ru_summary, after.ru_audience, after.ru_overview,
];
for (const afterStep of afterSteps) {
  EM_CHECK_FIELDS.push(afterStep.ru_title, afterStep.ru_what);
}
for (const val of EM_CHECK_FIELDS) {
  if (val.includes(EM_DASH)) {
    console.error(`FAIL post-write: em-dash found in RU DB content.`);
    process.exit(1);
  }
}

console.log("\nPost-write verification passed:");
console.log(`  Slug:          ${after.slug}`);
console.log(`  EN title:      ${after.en_title}`);
console.log(`  RU title:      ${after.ru_title}`);
console.log(`  Category:      ${after.category}`);
console.log(`  Published:     ${after.published}`);
console.log(`  Steps:         ${afterSteps.length}`);
console.log(`  RU steps done: ${afterSteps.filter((r) => r.ru_title !== "").length}`);
console.log(`  Em-dashes:     0`);

console.log(`\n${EXPECTED_STEPS} RU step titles:`);
for (const row of afterSteps) {
  console.log(`  ${row.step_order}. ${row.ru_title}`);
}

console.log("\nRU content added. EN fields untouched.");
console.log(`Preview: http://localhost:3000/ru/guides/${SLUG}`);

db.close();
