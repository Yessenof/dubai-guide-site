// Adds Russian content to the existing renew-family-visa-dubai guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-renew-family-visa.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "renew-family-visa-dubai";
const EXPECTED_STEPS = 4;
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
    "Продление семейной визы в Дубае: residence visa и Emirates ID для членов семьи",
  ru_summary:
    "Guidex помогает продлить family residence visa в Дубае: проверяем документы спонсора " +
    "и членов семьи, готовим подачу через Amer и сопровождаем renewal до обновления визы " +
    "и Emirates ID.",
  ru_audience:
    "Для резидентов Дубая, которые хотят продлить визу супруги, супруга, ребёнка или другого " +
    "зависимого члена семьи без ошибок, просрочек и лишних визитов.",
  ru_overview:
    "Продление family residence visa в Дубае важно начинать до окончания текущей визы. Нужно " +
    "проверить срок визы спонсора, документы зависимого члена семьи, Emirates ID, медицинские " +
    "требования, если они применяются, и корректно пройти подачу через Amer.\n\n" +
    "Guidex помогает заранее проверить документы, выбрать правильный маршрут renewal и " +
    "провести процесс так, чтобы семья не столкнулась с задержками, штрафами или повторными визитами.",
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
    ru_title: "Проверить сроки и требования для продления",
    ru_what:
      "Уточните дату окончания визы и нужен ли зависимому члену семьи медицинский осмотр. " +
      "Для лиц от 18 лет осмотр обязателен до подачи в Amer; дети до 18 лет освобождены.",
    ru_where:   "Собственные документы",
    ru_address: "Дата окончания визы указана в паспорте или доступна в приложении ICA.",
    ru_advice:
      "Подавайте не менее чем за две недели до окончания визы. Опоздание может повлечь " +
      "штрафы за просрочку и дополнительные шаги. Спонсором при подаче должен выступать " +
      "резидент ОАЭ.",
    ru_warning:
      "Если виза спонсора истекла или изменилась, свяжитесь с GDRFA или Amer до начала " +
      "продления визы зависимого. Для renewal нужна актуальная документация по визе спонсора.",
  },
  // Step 2
  {
    ru_title: "Пройти медицинский осмотр",
    ru_what:
      "Пройдите медицинский осмотр в аккредитованном Medical Fitness Center в Дубае: анализ " +
      "крови и рентген грудной клетки. Результат передаётся электронно и становится доступен " +
      "для обработки заявки в Amer.",
    ru_where:   "Аккредитованный Medical Fitness Center",
    ru_address:
      "Любой доступный Medical Fitness Center в Дубае, например Dubai Health, Salem или Smart " +
      "Salem. Перед визитом проверьте запись, адрес и требования.",
    ru_advice:
      "Возьмите оригинал паспорта зависимого. Некоторые центры также требуют Emirates ID и фото. " +
      "Уточните требования при записи.",
    ru_warning:
      "Этот шаг пропускается только если зависимому нет 18 лет. Взрослые, у которых результат " +
      "медосмотра ещё не доступен в системе, не могут завершить renewal в Amer.",
  },
  // Step 3
  {
    ru_title: "Подать renewal в Amer",
    ru_what:
      "Подайте заявки на продление визы и Emirates ID в центре обслуживания Amer. Сотрудник " +
      "оформляет заявления, подтверждает сумму государственного сбора и принимает оплату. " +
      "Результат медосмотра должен быть доступен в системе к этому моменту.",
    ru_where:   "Центр обслуживания Amer",
    ru_address: "Любой офис Amer в Дубае",
    ru_advice:
      "Возьмите паспорт и Emirates ID зависимого (оригиналы и копии), паспорт и Emirates ID " +
      "спонсора (оригиналы и копии), одно свежее фото (белый фон, 35x45мм). Оба заявления " +
      "можно подать за один визит в Amer.",
    ru_warning: "",
  },
  // Step 4
  {
    ru_title: "Получить продлённую визу и Emirates ID",
    ru_what:
      "Заберите штамп продлённой визы в паспорт зависимого в том же Amer. Emirates ID " +
      "доставляется по почте отдельно, повторный визит не нужен.",
    ru_where:   "Центр обслуживания Amer (штамп визы); почта (Emirates ID)",
    ru_address: "Тот же офис Amer, где подавалась заявка",
    ru_advice:
      "Отслеживайте статус заявки через номер заявки, канал Amer или соответствующий государственный портал.",
    ru_warning: "",
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
  .get(SLUG) as
  | { id: string; slug: string; en_title: string; ru_title: string; published: number }
  | undefined;

if (!guide) {
  console.error(`FAIL guide not found: ${SLUG}`);
  process.exit(1);
}
if (!guide.published) {
  console.error(`FAIL guide is not published: ${SLUG}`);
  process.exit(1);
}

const stepRows = db
  .prepare(`SELECT id, step_order FROM steps WHERE guide_id = ? ORDER BY step_order`)
  .all(guide.id) as Array<{ id: string; step_order: number }>;

if (stepRows.length !== EXPECTED_STEPS) {
  console.error(`FAIL step count in DB: expected ${EXPECTED_STEPS}, got ${stepRows.length}`);
  process.exit(1);
}

const ruStepsDoneBefore = (
  db
    .prepare(`SELECT COUNT(*) as cnt FROM steps WHERE guide_id = ? AND ru_title != ''`)
    .get(guide.id) as { cnt: number }
).cnt;

console.log(`\nBefore:`);
console.log(`  Guide slug:   ${guide.slug}`);
console.log(`  Guide ID:     ${guide.id}`);
console.log(`  EN title:     ${guide.en_title}`);
console.log(`  RU title:     ${guide.ru_title || "(empty)"}`);
console.log(`  Published:    ${guide.published}`);
console.log(`  Steps found:  ${stepRows.length}`);
console.log(`  RU steps:     ${ruStepsDoneBefore} have ru_title`);

// ── Write ─────────────────────────────────────────────────────────────────────

const write = db.transaction(() => {
  db.prepare(
    `UPDATE guides
     SET ru_title = ?, ru_summary = ?, ru_audience = ?, ru_overview = ?, updated_at = ?
     WHERE slug = ?`
  ).run(
    RU_GUIDE.ru_title,
    RU_GUIDE.ru_summary,
    RU_GUIDE.ru_audience,
    RU_GUIDE.ru_overview,
    new Date().toISOString(),
    SLUG,
  );

  for (let i = 0; i < stepRows.length; i++) {
    const row = stepRows[i];
    const ru  = RU_STEPS[i];
    db.prepare(
      `UPDATE steps
       SET ru_title = ?, ru_what = ?, ru_where = ?, ru_address = ?,
           ru_advice = ?, ru_warning = ?
       WHERE id = ?`
    ).run(
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
});

write();

// ── Post-write verification ───────────────────────────────────────────────────

const after = db
  .prepare(
    `SELECT slug, en_title, ru_title, category, published
     FROM guides WHERE slug = ?`
  )
  .get(SLUG) as
  | { slug: string; en_title: string; ru_title: string; category: string; published: number }
  | undefined;

if (!after) {
  console.error("FAIL post-write guide not found");
  process.exit(1);
}

const ruStepsDoneAfter = (
  db
    .prepare(`SELECT COUNT(*) as cnt FROM steps WHERE guide_id = ? AND ru_title != ''`)
    .get(guide.id) as { cnt: number }
).cnt;

const emDashInSteps = (
  db
    .prepare(
      `SELECT COUNT(*) as cnt FROM steps
       WHERE guide_id = ?
         AND (ru_title LIKE '%—%' OR ru_what LIKE '%—%' OR ru_where LIKE '%—%'
           OR ru_address LIKE '%—%' OR ru_advice LIKE '%—%' OR ru_warning LIKE '%—%')`
    )
    .get(guide.id) as { cnt: number }
).cnt;

const emDashInGuide = (
  db
    .prepare(
      `SELECT COUNT(*) as cnt FROM guides
       WHERE slug = ?
         AND (ru_title LIKE '%—%' OR ru_summary LIKE '%—%'
           OR ru_audience LIKE '%—%' OR ru_overview LIKE '%—%')`
    )
    .get(SLUG) as { cnt: number }
).cnt;

if (
  !after.ru_title.trim() ||
  after.en_title !== guide.en_title ||
  ruStepsDoneAfter !== EXPECTED_STEPS ||
  emDashInSteps > 0 ||
  emDashInGuide > 0
) {
  console.error("FAIL post-write verification failed");
  console.error(`  ru_title empty:     ${!after.ru_title.trim()}`);
  console.error(`  EN title changed:   ${after.en_title !== guide.en_title}`);
  console.error(`  RU steps complete:  ${ruStepsDoneAfter}/${EXPECTED_STEPS}`);
  console.error(`  Em-dashes (steps):  ${emDashInSteps}`);
  console.error(`  Em-dashes (guide):  ${emDashInGuide}`);
  process.exit(1);
}

console.log(`\nPost-write verification passed:`);
console.log(`  Slug:          ${after.slug}`);
console.log(`  EN title:      ${after.en_title}`);
console.log(`  RU title:      ${after.ru_title}`);
console.log(`  Category:      ${after.category}`);
console.log(`  Published:     ${after.published}`);
console.log(`  Steps:         ${stepRows.length}`);
console.log(`  RU steps done: ${ruStepsDoneAfter}`);
console.log(`  Em-dashes:     0`);

const ruStepTitles = db
  .prepare(
    `SELECT step_order, ru_title FROM steps WHERE guide_id = ? ORDER BY step_order`
  )
  .all(guide.id) as Array<{ step_order: number; ru_title: string }>;

console.log(`\n${ruStepsDoneAfter} RU step titles:`);
for (const r of ruStepTitles) {
  console.log(`  ${r.step_order}. ${r.ru_title}`);
}

console.log(`\nRU content added. EN fields untouched.`);
console.log(`Preview: http://localhost:3000/ru/guides/${SLUG}`);
