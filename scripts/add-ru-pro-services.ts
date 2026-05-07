// Adds Russian content to the existing pro-services-dubai guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-pro-services.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "pro-services-dubai";
const EXPECTED_STEPS = 5;
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
    "PRO services в Дубае: визы, лицензии и госуслуги для бизнеса",
  ru_summary:
    "Guidex помогает компаниям и предпринимателям с PRO services в Дубае: визы, лицензии, " +
    "government approvals, документы, Amer, MOFA и другие госуслуги.",
  ru_audience:
    "Для владельцев бизнеса, инвесторов и компаний в Дубае, которым нужен один " +
    "координатор для регулярных government services, визовых процессов и корпоративных " +
    "документов.",
  ru_overview:
    "PRO services помогают бизнесу проходить регулярные государственные процессы: визы " +
    "сотрудников, документы компании, обновления лицензии, согласования, MOFA, Amer и " +
    "другие сервисы. Ошибки в документах или сроках могут задержать работу компании.\n\n" +
    "Guidex берёт на себя координацию процесса, проверку документов и сопровождение " +
    "заявок, чтобы владелец бизнеса не тратил время на разные центры и порталы.",
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
    ru_title: "Определить задачи для PRO",
    ru_what:
      "PRO-сервисы берут на себя подачу в госорганы и административные задачи, требующие " +
      "физического присутствия или зарегистрированного представительства. Типичные задачи: " +
      "продление торговой лицензии, визы и разрешения на работу сотрудников, регистрация " +
      "в MOHRE, подача на аттестацию документов.",
    ru_where:   "Собственная оценка",
    ru_address:
      "Конкретный адрес не требуется. Просмотрите предстоящие государственные обязательства " +
      "и соотнесите их с функциями PRO.",
    ru_advice:
      "Задачи с полностью онлайн-вариантами (портал ICA, DED онлайн, приложение GDRFA) могут " +
      "не требовать PRO. PRO наиболее полезен при очном представительстве, пакетной обработке " +
      "виз сотрудников и транзакциях, требующих зарегистрированного представителя у стойки " +
      "госоргана.",
    ru_warning: "",
  },
  // Step 2
  {
    ru_title: "Найти надёжного PRO-провайдера",
    ru_what:
      "Изучите PRO-компании в Дубае и запросите письменные предложения по вашим конкретным " +
      "задачам. Перед подписанием подтвердите, что провайдер лицензирован на работу с " +
      "нужными госорганами.",
    ru_where:   "Рекомендации от других компаний, компании по регистрации бизнеса или поиск",
    ru_address: "Конкретный адрес на этом шаге не требуется.",
    ru_advice:
      "Уточните, с какими госорганами работает PRO-компания. Лицензия на корпоративные " +
      "процедуры не означает авторизацию на иммиграционные транзакции. Компании в свободных " +
      "зонах нуждаются в PRO, авторизованном их конкретной свободной зоной.",
    ru_warning:
      "Нелицензированные физические лица, предлагающие PRO-услуги неформально, не могут " +
      "законно представлять бизнес в госорганах. Используйте зарегистрированную " +
      "лицензированную PRO-компанию.",
  },
  // Step 3
  {
    ru_title: "Авторизовать PRO и заключить соглашение",
    ru_what:
      "Подпишите соглашение с PRO-компанией и предоставьте письменное разрешение на " +
      "представление ваших интересов. Для большинства транзакций достаточно письма о " +
      "полномочиях на официальном бланке компании. Некоторые госорганы требуют нотариальную " +
      "доверенность.",
    ru_where:   "Офис PRO-компании; нотариальный центр (если требуется доверенность)",
    ru_address:
      "Зависит от PRO-провайдера. Нотариальная доверенность: любой нотариальный центр или " +
      "бюро юридического перевода в Дубае.",
    ru_advice:
      "Храните подписанные копии всех выданных вами документов о полномочиях. До начала " +
      "работы подтвердите, какие госорганы и типы транзакций охватывает ваше разрешение.",
    ru_warning: "",
  },
  // Step 4
  {
    ru_title: "Передать документы PRO",
    ru_what:
      "Передайте оригиналы документов и необходимые копии для каждой транзакции. Ваш PRO " +
      "подтвердит точный список документов, займётся очередями у стоек и оформит подачу " +
      "от вашего имени.",
    ru_where:   "Ваш офис или офис PRO-компании",
    ru_address: "Нет конкретного адреса. Согласуйте способ передачи с провайдером.",
    ru_advice:
      "Сохраняйте копию каждого переданного документа. Фиксируйте, что передано, дату и " +
      "государственный номер ссылки после каждой подачи.",
    ru_warning: "",
  },
  // Step 5
  {
    ru_title: "Проверить и получить результаты",
    ru_what:
      "После завершения подачи и получения документа из госоргана PRO возвращает обработанные " +
      "документы вам. Проверьте каждый документ на точность до подачи или распространения.",
    ru_where:   "Ваш офис или офис PRO-компании",
    ru_address: "Нет конкретного адреса. PRO возвращает документы непосредственно вам.",
    ru_advice:
      "Сверьте выданный документ с вашим первоначальным запросом. Ошибки в именах, датах " +
      "или реквизитах лицензии на официальных документах могут быть трудоёмки и " +
      "дорогостоящи в исправлении.",
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
