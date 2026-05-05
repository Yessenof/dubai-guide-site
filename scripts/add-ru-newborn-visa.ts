// Adds Russian content to the existing newborn-visa-dubai guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-newborn-visa.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "newborn-visa-dubai";
const EXPECTED_STEPS = 6;
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
    "Виза новорождённому в Дубае: свидетельство, паспорт, residence visa и Emirates ID",
  ru_summary:
    "Guidex помогает родителям пройти оформление документов для ребёнка, рождённого в ОАЭ: " +
    "свидетельство о рождении, паспорт, residence visa и Emirates ID через правильные " +
    "госорганы и центры.",
  ru_audience:
    "Для родителей в Дубае и ОАЭ, у которых родился ребёнок и нужно оформить документы " +
    "без ошибок, задержек и лишних визитов в разные инстанции.",
  ru_overview:
    "После рождения ребёнка в ОАЭ родителям нужно оформить несколько документов в правильной " +
    "последовательности: свидетельство о рождении, паспорт через консульство, затем residence " +
    "visa и Emirates ID. Ошибка в порядке шагов или документах может задержать весь процесс.\n\n" +
    "Guidex помогает проверить ситуацию семьи, подготовить документы и пройти маршрут через " +
    "нужные органы и центры, чтобы оформление было понятным и предсказуемым.",
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
    ru_title: "Зарегистрировать рождение в больнице",
    ru_what:
      "Обратитесь в отдел по работе с пациентами больницы. Они передают заявку в DHA " +
      "от вашего имени. Свидетельство о рождении ОАЭ готово в течение 1–3 рабочих дней.",
    ru_where:   "Отдел по работе с пациентами в больнице",
    ru_address: "В роддоме или больнице, где родился ребёнок",
    ru_advice:
      "Возьмите паспорта обоих родителей, Emirates ID и свидетельство о браке. " +
      "Если отец отсутствовал, некоторые больницы требуют письменное разрешение.",
    ru_warning:
      "Регистрацию нужно завершить в течение 30 дней с момента рождения. " +
      "При задержке начисляются дополнительные сборы и может потребоваться нотариальная процедура.",
  },
  // Step 2
  {
    ru_title: "Зарегистрировать ребёнка в консульстве",
    ru_what:
      "Обратитесь в посольство или консульство своей страны в ОАЭ для регистрации " +
      "рождения и оформления паспорта ребёнка.",
    ru_where:   "Посольство или консульство страны гражданства",
    ru_address: "Уточните адрес и требования для записи на сайте консульства",
    ru_advice:
      "Возьмите свидетельство о рождении ОАЭ, паспорта обоих родителей, свидетельство " +
      "о браке и документы, требуемые консульством. Большинство требует предварительной записи.",
    ru_warning:
      "Сроки оформления паспорта зависят от страны гражданства и загруженности консульства. " +
      "Уточните актуальные сроки напрямую перед тем, как планировать следующие шаги.",
  },
  // Step 3
  {
    ru_title: "Получить паспорт ребёнка",
    ru_what:
      "Заберите паспорт ребёнка из консульства после завершения оформления. Некоторые " +
      "страны выдают временный документ, другие оформляют полный паспорт сразу.",
    ru_where:   "Посольство или консульство страны гражданства",
    ru_address: "Тот же адрес, что и в шаге 2",
    ru_advice:
      "Для подачи на UAE residence visa нужен полноценный национальный паспорт, " +
      "не временный документ. Уточните в Amer, если есть сомнения.",
    ru_warning:
      "Не подавайте заявку на UAE residence visa до получения паспорта ребёнка. " +
      "Заявки без паспорта не рассматриваются.",
  },
  // Step 4
  {
    ru_title: "Подать заявку на UAE Residence Visa в Amer",
    ru_what:
      "Подайте заявку на UAE residence visa для ребёнка через центр обслуживания Amer. " +
      "Спонсором выступает один из родителей. Медосмотр для новорождённых не требуется.",
    ru_where:   "Центр обслуживания Amer",
    ru_address: "Любой офис Amer в Дубае",
    ru_advice:
      "Необходимые документы: паспорт ребёнка, свидетельство о рождении ОАЭ, паспорт " +
      "и Emirates ID спонсирующего родителя, свидетельство о браке. Берите оригиналы и копии. " +
      "Emirates ID можно оформить за тот же визит в Amer.",
    ru_warning: "",
  },
  // Step 5
  {
    ru_title: "Оформить Emirates ID",
    ru_what:
      "Подайте заявку на Emirates ID для ребёнка через Amer. Для детей до 15 лет " +
      "биометрия не требуется. Карта доставляется по почте.",
    ru_where:   "Центр обслуживания Amer",
    ru_address: "Любой офис Amer в Дубае",
    ru_advice:
      "Emirates ID и residence visa оформляются одновременно за один визит в Amer.",
    ru_warning: "",
  },
  // Step 6
  {
    ru_title: "Получить Residence Visa и Emirates ID",
    ru_what:
      "Заберите штамп UAE residence visa в паспорт ребёнка в Amer. Emirates ID " +
      "доставляется по почте отдельно. Проверьте срок действия визы.",
    ru_where:   "Центр обслуживания Amer (штамп визы); почта (Emirates ID)",
    ru_address: "Тот же офис Amer, где подавалась заявка",
    ru_advice:
      "Срок действия детской residence visa, как правило, совпадает со сроком окончания " +
      "визы спонсирующего родителя. Если виза родителя скоро истекает, рассмотрите " +
      "возможность её продления до подачи, чтобы ребёнок получил полный срок.",
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
    const row  = stepRows[i];
    const ru   = RU_STEPS[i];
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

const emDashInDb = (
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
  emDashInDb > 0 ||
  emDashInGuide > 0
) {
  console.error("FAIL post-write verification failed");
  console.error(`  ru_title empty:     ${!after.ru_title.trim()}`);
  console.error(`  EN title changed:   ${after.en_title !== guide.en_title}`);
  console.error(`  RU steps complete:  ${ruStepsDoneAfter}/${EXPECTED_STEPS}`);
  console.error(`  Em-dashes (steps):  ${emDashInDb}`);
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
