// Adds Russian content to the existing spouse-dependent-visa-dubai-outside-country guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-spouse-dependent-visa-outside.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "spouse-dependent-visa-dubai-outside-country";
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
    "mohre clinic",
    "mohre-approved",
    "одобренной mohre",
  ];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL forbidden phrase in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

// ── RU guide content ──────────────────────────────────────────────────────────

const RU_GUIDE = {
  ru_title:
    "Виза супруге или супругу в Дубае из-за пределов ОАЭ: entry permit и residence",
  ru_summary:
    "Для спонсоров, чей супруг или супруга находится за пределами ОАЭ. " +
    "Супруг или супруга въезжает по entry permit, после чего оформляются medical fitness, Emirates ID и residence visa.",
  ru_audience:
    "Резиденты Дубая, работающие в частном секторе, free zone или государственном секторе, " +
    "спонсирующие супруга или супругу, которые сейчас за пределами ОАЭ.",
  ru_overview:
    "Для спонсоров, чей супруг или супруга находится за пределами ОАЭ, процесс начинается с аттестации " +
    "свидетельства о браке и подачи заявки на entry permit через Amer. После въезда в ОАЭ супруг или супруга " +
    "проходит medical fitness, оформляет Emirates ID и завершает получение residence visa.\n\n" +
    "Суммарные государственные сборы составляют около AED 1,800–2,200. Основная задержка связана с " +
    "аттестацией документов за рубежом: закладывайте от 2 до 3 недель на этот этап. " +
    "Спонсор должен соответствовать требованиям по минимальной заработной плате и предоставить " +
    "действующий договор аренды (Ejari).",
};

// ── RU step content ───────────────────────────────────────────────────────────

const RU_STEPS = [
  {
    step_order: 1,
    ru_title:   "Аттестовать свидетельство о браке",
    ru_what:
      "Аттестуйте свидетельство о браке на родине и в UAE MOFA. " +
      "Это необходимо до начала визового процесса.",
    ru_where:   "UAE MOFA (финальный этап)",
    ru_address: "mofa.gov.ae или любой авторизованный typing center",
    ru_advice:
      "Стандартная цепочка: нотариальное заверение на родине, МИД страны выдачи, посольство ОАЭ, UAE MOFA.",
    ru_warning:
      "Неаттестованное свидетельство о браке не принимается в Amer или GDRFA.",
  },
  {
    step_order: 2,
    ru_title:   "Открыть family file в Amer",
    ru_what:
      "Подайте документы в Amer для открытия family sponsorship file.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Документы: паспорт спонсора, Emirates ID (оригинал), residence visa, " +
      "аттестованное свидетельство о браке, паспорт супруга или супруги, фото, Ejari и справка о доходах " +
      "(salary certificate для free zone или госсектора; трудовой договор для частного сектора).",
    ru_warning:
      "Оригинал Emirates ID обязателен. Копия или цифровая версия не принимается.",
  },
  {
    step_order: 3,
    ru_title:   "Подать заявку на entry permit",
    ru_what:
      "Подайте заявку на entry permit для супруга или супруги через Amer. " +
      "После одобрения супруг или супруга может въехать в ОАЭ.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Entry permit выдаётся в электронном виде. " +
      "Паспорт супруга или супруги должен быть действителен не менее 6 месяцев.",
    ru_warning: "",
  },
  {
    step_order: 4,
    ru_title:   "Супруг или супруга въезжает в ОАЭ",
    ru_what:
      "Супруг или супруга въезжает в Дубай по entry permit.",
    ru_where:   "Аэропорт Дубая",
    ru_address: "Международный аэропорт Дубая (DXB)",
    ru_advice:
      "Сохраните цифровую копию и распечатку entry permit. " +
      "Некоторые авиакомпании проверяют его при регистрации на рейс.",
    ru_warning: "",
  },
  {
    step_order: 5,
    ru_title:   "Пройти medical fitness test",
    ru_what:
      "Супруг или супруга проходит медосмотр в аккредитованном Medical Fitness Center. " +
      "Результаты передаются в иммиграционные органы в электронном виде.",
    ru_where:   "Аккредитованный Medical Fitness Center",
    ru_address: "Одобренный Dubai Health центр в Дубае (Salem, Smart Salem или аналогичный)",
    ru_advice:
      "Запись через Amer или напрямую в центр. При себе: паспорт и копия entry permit.",
    ru_warning:
      "Residence visa не может быть оформлена до получения положительных результатов медосмотра.",
  },
  {
    step_order: 6,
    ru_title:   "Подать заявку на Emirates ID",
    ru_what:
      "Подайте заявку на Emirates ID в Amer и пройдите биометрическую регистрацию " +
      "(fingerprint, фото, подпись).",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Укажите корректный адрес доставки для курьера.",
    ru_warning: "",
  },
  {
    step_order: 7,
    ru_title:   "Завершить оформление residence visa",
    ru_what:
      "Подайте финальное заявление на оформление residence visa через Amer. " +
      "После одобрения residence status обновляется в системе, " +
      "а Emirates ID становится основным документом резидента.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Residence visa выдаётся в электронном виде и привязывается к Emirates ID.",
    ru_warning: "",
  },
];

// ── Guards ────────────────────────────────────────────────────────────────────

for (const [k, v] of Object.entries(RU_GUIDE)) {
  assertNoEmDash(`guide.${k}`, v);
  assertNoGuarantee(`guide.${k}`, v);
}
for (const step of RU_STEPS) {
  for (const [k, v] of Object.entries(step)) {
    if (typeof v === "string") {
      assertNoEmDash(`step${step.step_order}.${k}`, v);
      assertNoGuarantee(`step${step.step_order}.${k}`, v);
    }
  }
}

// ── Lookup guide ──────────────────────────────────────────────────────────────

const guide = db
  .prepare("SELECT id FROM guides WHERE slug = ?")
  .get(SLUG) as { id: number } | undefined;

if (!guide) {
  console.error(`FAIL guide not found: ${SLUG}`);
  process.exit(1);
}

const steps = db
  .prepare("SELECT id, step_order FROM steps WHERE guide_id = ? ORDER BY step_order")
  .all(guide.id) as { id: number; step_order: number }[];

if (steps.length !== EXPECTED_STEPS) {
  console.error(`FAIL expected ${EXPECTED_STEPS} steps, found ${steps.length}`);
  process.exit(1);
}

// ── Write ─────────────────────────────────────────────────────────────────────

const updateGuide = db.prepare(`
  UPDATE guides SET
    ru_title    = @ru_title,
    ru_summary  = @ru_summary,
    ru_audience = @ru_audience,
    ru_overview = @ru_overview,
    updated_at  = CURRENT_TIMESTAMP
  WHERE slug = ?
`);

const updateStep = db.prepare(`
  UPDATE steps SET
    ru_title   = @ru_title,
    ru_what    = @ru_what,
    ru_where   = @ru_where,
    ru_address = @ru_address,
    ru_advice  = @ru_advice,
    ru_warning = @ru_warning
  WHERE id = @id
`);

db.transaction(() => {
  updateGuide.run(RU_GUIDE, SLUG);

  for (const ruStep of RU_STEPS) {
    const dbStep = steps.find((s) => s.step_order === ruStep.step_order);
    if (!dbStep) {
      console.error(`FAIL step_order ${ruStep.step_order} not found`);
      process.exit(1);
    }
    updateStep.run({ ...ruStep, id: dbStep.id });
  }
})();

// ── Verify ────────────────────────────────────────────────────────────────────

const written = db
  .prepare("SELECT ru_title, ru_summary, ru_audience, ru_overview FROM guides WHERE slug = ?")
  .get(SLUG) as { ru_title: string; ru_summary: string; ru_audience: string; ru_overview: string };

if (!written.ru_title || !written.ru_summary || !written.ru_audience || !written.ru_overview) {
  console.error("FAIL guide ru_* fields not written");
  process.exit(1);
}

const emptySteps = db
  .prepare("SELECT ru_title FROM steps WHERE guide_id = ? AND (ru_title IS NULL OR ru_title = '')")
  .all(guide.id);

if (emptySteps.length > 0) {
  console.error(`FAIL ${emptySteps.length} step(s) missing ru_title`);
  process.exit(1);
}

console.log(`OK ${SLUG}: guide ru_* written, ${steps.length} steps updated`);
db.close();
