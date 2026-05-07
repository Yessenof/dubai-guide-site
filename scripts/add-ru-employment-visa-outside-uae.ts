// Adds Russian content to the existing employment-visa-dubai-outside-uae guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-employment-visa-outside-uae.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "employment-visa-dubai-outside-uae";
const EXPECTED_STEPS = 7;
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
    "Как получить рабочую визу в Дубае из-за рубежа",
  ru_summary:
    "Для кандидатов, находящихся за пределами ОАЭ. Работодатель инициирует процесс в Дубае; " +
    "вы въезжаете по entry permit после его одобрения.",
  ru_audience:
    "Сотрудники за пределами ОАЭ с подтверждённым предложением от работодателя на материковом Дубае.",
  ru_overview:
    "Этот маршрут применяется, если вы находитесь за рубежом, а ваш работодатель зарегистрирован " +
    "на материковой части Дубая. Приступить к работе можно только после въезда в страну по entry permit.\n\n" +
    "Работодатель ведёт заявки в MOHRE и GDRFA. Ваша активная роль начинается с получения entry permit: " +
    "вы бронируете перелёт, проходите медосмотр и регистрируетесь для Emirates ID после приезда, " +
    "затем в паспорт ставится штамп residence visa. Общие государственные сборы обычно составляют " +
    "от AED 4,500 до AED 7,000 в зависимости от категории труда. Весь процесс занимает 4–8 недель.",
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
    ru_title: "Работодатель подаёт разрешение на работу в MOHRE",
    ru_what:
      "Работодатель подаёт заявку на первоначальное разрешение на работу в MOHRE " +
      "(Министерство кадров и эмиратизации) через Tasheel. Вам нужно предоставить копию " +
      "паспорта, документы об образовании и оффер-лэтер. Присутствие в ОАЭ на этом этапе " +
      "не требуется.",
    ru_where:   "MOHRE через Tasheel",
    ru_address: "Любой центр Tasheel в Дубае",
    ru_advice:
      "Работодатель или его PRO самостоятельно управляет этим процессом. " +
      "Уточните у работодателя номер заявки MOHRE для отслеживания статуса.",
    ru_warning: "",
  },
  // Step 2
  {
    ru_title: "Работодатель подаёт заявку на entry permit",
    ru_what:
      "После одобрения MOHRE работодатель подаёт заявку на entry permit в GDRFA через " +
      "Tasheel. Entry permit действителен 60 дней с даты выдачи и однократный. Он " +
      "отправляется работодателю. Попросите копию для бронирования билетов.",
    ru_where:   "GDRFA через Tasheel",
    ru_address: "Любой центр Tasheel в Дубае",
    ru_advice:
      "Бронируйте авиабилет только после получения entry permit. Оставьте запас " +
      "2–3 недели до истечения срока entry permit для завершения всех оставшихся " +
      "этапов после приезда.",
    ru_warning:
      "Не въезжайте по туристической визе в расчёте на её конвертацию в рабочий " +
      "вид на жительство. Правильный въездной документ для этого маршрута: entry permit, " +
      "полученный на этом шаге.",
  },
  // Step 3
  {
    ru_title: "Въезд в Дубай по entry permit",
    ru_what:
      "Въедьте в ОАЭ по entry permit. Предъявите его при пограничном контроле в аэропорту " +
      "Дубая. Вы получите въездной штамп; с этого момента начинается 60-дневный период " +
      "для завершения оставшихся этапов.",
    ru_where:   "Международный аэропорт Дубая",
    ru_address: "Терминал 1, 2 или 3, любой пункт паспортного контроля",
    ru_advice:
      "Сохраните распечатанную и цифровую копии entry permit. Сообщите работодателю " +
      "дату приезда, чтобы он мог оперативно запланировать следующие шаги.",
    ru_warning: "",
  },
  // Step 4
  {
    ru_title: "Пройти medical fitness test",
    ru_what:
      "Пройдите medical fitness test в approved Medical Fitness Center в Дубае. " +
      "Обычно проверка включает анализ крови и рентген грудной клетки. " +
      "Результат передаётся электронно и становится доступен для дальнейшего оформления residence visa.",
    ru_where:   "Approved Medical Fitness Center",
    ru_address:
      "Medical Fitness Center в Дубае, например Dubai Health, Salem или Smart Salem. " +
      "Конкретный центр обычно подсказывает работодатель или PRO.",
    ru_advice:
      "Возьмите оригинал паспорта, entry permit и данные заявки. " +
      "В некоторых центрах могут потребоваться фото или дополнительные документы. " +
      "Работодатель или PRO обычно помогает подготовить форму.",
    ru_warning:
      "Если medical fitness result не одобрен, процесс residence visa не может быть завершён.",
  },
  // Step 5
  {
    ru_title: "Оформить Emirates ID и биометрию",
    ru_what:
      "Оформите Emirates ID application и пройдите биометрию, если она требуется. " +
      "Процесс связан с residence visa application; карту Emirates ID доставляют после одобрения и выпуска.",
    ru_where:   "ICP service center или авторизованный канал подачи",
    ru_address:
      "ICP service center или authorised typing/service channel, указанный в вашей заявке. " +
      "В Дубае работодатель или PRO подскажет правильный маршрут.",
    ru_advice:
      "Используйте актуальные данные из заявки и возьмите паспорт, entry permit " +
      "и подтверждение medical fitness result. " +
      "Если биометрия уже была ранее сдана, личный визит может не потребоваться.",
    ru_warning: "",
  },
  // Step 6
  {
    ru_title: "Получить штамп residence visa в паспорте",
    ru_what:
      "Работодатель или PRO подаёт заявку на residence visa в GDRFA через Amer или " +
      "Tasheel. После одобрения в паспорт ставится штамп 2-летней residence visa, " +
      "привязанной к спонсорству работодателя.",
    ru_where:   "GDRFA через Amer или Tasheel",
    ru_address: "Любое отделение Amer или центр Tasheel в Дубае",
    ru_advice:
      "Работодатель подаёт эту заявку и временно держит ваш паспорт при обработке " +
      "(как правило, 2–3 рабочих дня). Подтверждение о готовности визы приходит по SMS.",
    ru_warning:
      "Штамп residence visa должен быть получен до истечения 60-дневного окна entry permit. " +
      "При просрочке применяется штраф за нарушение сроков пребывания.",
  },
  // Step 7
  {
    ru_title: "Завершить оформление трудового договора и work permit",
    ru_what:
      "После завершения визовых этапов работодатель финализирует трудовой договор " +
      "и work permit в системе MOHRE. Зарплата должна выплачиваться через WPS после начала работы, " +
      "но WPS не является местом регистрации договора.",
    ru_where:   "MOHRE, обрабатывается работодателем электронно",
    ru_address: "Личное присутствие не требуется",
    ru_advice:
      "Запросите у работодателя копию зарегистрированного трудового договора MOHRE " +
      "и данные work permit. Это подтверждает официальные условия трудоустройства и зарплаты.",
    ru_warning:
      "Не начинайте работу до завершения нужных разрешений и подтверждения статуса у работодателя.",
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
