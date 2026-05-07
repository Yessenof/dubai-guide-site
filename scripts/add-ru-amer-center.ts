// Adds Russian content to the existing amer-center-dubai guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-amer-center.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "amer-center-dubai";
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
    "Amer Center в Дубае: визы, Emirates ID и услуги GDRFA",
  ru_summary:
    "Guidex помогает пройти процессы через Amer Center в Дубае: family visa, residence visa, " +
    "Emirates ID, entry permit, renewal и связанные услуги GDRFA.",
  ru_audience:
    "Для резидентов, семей и компаний в Дубае, которым нужно оформить или обновить визовые " +
    "документы через Amer без лишних ошибок и повторных визитов.",
  ru_overview:
    "Amer Center в Дубае обслуживает личные резидентские и визовые транзакции, связанные " +
    "с GDRFA: подача заявок, renewal, family visa, Emirates ID и другие процессы. " +
    "Работодательские транзакции (разрешения на работу, трудовые договоры) проходят через " +
    "Tasheel, а не через Amer.\n\n" +
    "Guidex помогает понять, какой маршрут подходит именно вашему кейсу, подготовить " +
    "документы и пройти процесс через Amer аккуратно и быстрее.",
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
    ru_title: "Записаться на приём",
    ru_what:
      "Запишитесь через официальный канал GDRFA Dubai или выбранного Amer Center, если " +
      "запись доступна, чтобы сократить время ожидания. Посещение без записи возможно во " +
      "многих отделениях, но в часы пик очередь может быть дольше.",
    ru_where:   "Официальный канал GDRFA Dubai или выбранный Amer Center",
    ru_address: "Любой офис Amer в Дубае. Перед визитом проверьте адрес, часы работы и доступность записи.",
    ru_advice:
      "Если ближайшее отделение не принимает запись или нет свободного времени, проверьте " +
      "другие центры Amer. При срочном вопросе часто быстрее приехать лично с полным " +
      "пакетом документов.",
    ru_warning: "",
  },
  // Step 2
  {
    ru_title: "Подготовить документы",
    ru_what:
      "Подготовьте оригиналы и копии всех необходимых документов до визита. Стандартный " +
      "пакет: паспорт (оригинал и копия), Emirates ID (оригинал и копия), одно свежее фото " +
      "(белый фон, 35x45 мм), паспорт и Emirates ID спонсора (там, где применимо).",
    ru_where:   "Собственные документы",
    ru_address: "Готовьтесь дома до визита. В центрах Amer есть сервис копирования.",
    ru_advice:
      "Документы зависят от конкретной транзакции. Для family visa нужны свидетельство о " +
      "браке или рождении (с аттестацией, если иностранного выпуска). Для смены статуса: " +
      "текущая страница визы и документы о трудоустройстве. Уточните требования до визита.",
    ru_warning:
      "Отсутствующие документы означают незавершённую заявку. Amer вернёт её без обработки.",
  },
  // Step 3
  {
    ru_title: "Посетить центр Amer",
    ru_what:
      "Возьмите талон очереди и дождитесь вызова. Сотрудник оформляет заявку, подтверждает " +
      "итоговую сумму сбора, принимает оплату и выдаёт номер заявки и квитанцию.",
    ru_where:   "Центр обслуживания Amer",
    ru_address:
      "Любой офис Amer в Дубае. Крупные отделения: Al Barsha (рядом с Mall of the Emirates), " +
      "Bur Dubai, Deira.",
    ru_advice:
      "Большинство отделений Amer принимают оплату картой. Возьмите наличные на всякий случай.",
    ru_warning: "",
  },
  // Step 4
  {
    ru_title: "Получить результат",
    ru_what:
      "После подачи заявка обрабатывается в течение 1–5 рабочих дней. Вернитесь в то же " +
      "отделение Amer за визовым штампом после одобрения. Emirates ID доставляется по " +
      "почте отдельно. Повторный визит не нужен.",
    ru_where:   "Центр Amer (визовый штамп) или почта (Emirates ID)",
    ru_address: "То же отделение Amer, что использовалось при подаче, или указанное в квитанции",
    ru_advice:
      "Отслеживайте статус заявки по номеру из квитанции шага 3 через соответствующий " +
      "государственный портал или канал Amer.",
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
