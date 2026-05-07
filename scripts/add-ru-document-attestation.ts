// Adds Russian content to the existing document-attestation-dubai guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-document-attestation.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "document-attestation-dubai";
const EXPECTED_STEPS = 3;
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
    "Аттестация документов в Дубае: MOFA, переводы и легализация для ОАЭ",
  ru_summary:
    "Guidex помогает подготовить документы для использования в ОАЭ: проверяем маршрут " +
    "легализации, перевод, MOFA attestation и требования конкретного органа или банка.",
  ru_audience:
    "Для резидентов, семей, предпринимателей и компаний, которым нужно использовать " +
    "иностранные или местные документы в ОАЭ без ошибок в цепочке легализации.",
  ru_overview:
    "Для использования документа в ОАЭ часто требуется правильная цепочка: заверение " +
    "в стране выдачи, перевод, MOFA attestation и подача в нужный орган. Ошибка на одном " +
    "этапе может привести к отказу или повторной подаче.\n\n" +
    "Guidex помогает определить правильный маршрут для вашего документа, проверить " +
    "требования и подготовить пакет так, чтобы его приняли в банке, госоргане, " +
    "университете или при визовом процессе.",
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
    ru_title: "Пройти аутентификацию в стране выдачи документа",
    ru_what:
      "Иностранный документ должен пройти цепочку аутентификации в стране выдачи до " +
      "подачи в UAE MOFA. Стандартная цепочка: нотариальное заверение, затем МИД страны " +
      "выдачи, затем UAE Embassy или консульство в вашей стране.",
    ru_where:   "Нотариус, МИД страны выдачи, UAE Embassy в стране выдачи",
    ru_address:
      "Обратитесь к порталу МИД вашей страны для актуальных инструкций. Адрес UAE Embassy " +
      "находится на mofa.gov.ae.",
    ru_advice:
      "Уточните цепочку в стране выдачи до начала процесса. Для использования документа " +
      "в ОАЭ обычно требуется аутентификация в стране выдачи, затем аттестация в UAE Embassy " +
      "или консульстве, если она применима, и финальная MOFA attestation в ОАЭ. Если в вашей " +
      "стране используется apostille, не считайте его автоматической заменой всей цепочки для " +
      "ОАЭ: сначала проверьте требования у органа, который запросил документ.",
    ru_warning:
      "UAE MOFA отклонит документ, который не прошёл аутентификацию в стране выдачи. " +
      "Не подавайте в MOFA без завершения этого шага.",
  },
  // Step 2
  {
    ru_title: "Подать документ в UAE MOFA",
    ru_what:
      "Подайте полностью аутентифицированный документ в Министерство иностранных дел ОАЭ " +
      "для финальной аттестации.",
    ru_where:   "Портал UAE MOFA eServices или очный центр MOFA",
    ru_address:
      "Онлайн: mofa.gov.ae. Очно: центр аттестации MOFA или авторизованный typing center " +
      "в Дубае.",
    ru_advice:
      "Онлайн через eServices: самый быстрый маршрут для большинства заявителей. Загрузите " +
      "сканы, оплатите AED 150 онлайн, затем физически сдайте оригинал в центр MOFA или " +
      "авторизованный typing center. Typing centers и PRO-сервисы могут оформить подачу " +
      "за дополнительную сервисную плату.",
    ru_warning: "",
  },
  // Step 3
  {
    ru_title: "Получить аттестованный документ",
    ru_what:
      "Заберите документ в центре MOFA или typing center после завершения обработки. " +
      "Проверьте наличие штампа MOFA до подачи документа в запрашивающий орган ОАЭ.",
    ru_where:   "Центр MOFA или typing center, использованный для подачи",
    ru_address: "То же место, что и на шаге 2",
    ru_advice:
      "Если орган ОАЭ также требует перевод на арабский язык, закажите его у " +
      "сертифицированного юридического переводчика ОАЭ после получения аттестованного " +
      "оригинала. Арабский перевод аттестуется в MOFA отдельно: AED 150 за страницу.",
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
