// Adds Russian content to the existing child-dependent-visa-dubai-inside-country guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-child-dependent-visa-inside.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "child-dependent-visa-dubai-inside-country";
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
    "Виза ребёнку в Дубае из ОАЭ: status change и residence",
  ru_summary:
    "Для спонсоров, чей ребёнок уже находится в ОАЭ. " +
    "Все этапы оформляются через Amer без выезда ребёнка из страны.",
  ru_audience:
    "Резиденты Дубая, работающие в частном секторе, free zone или государственном секторе, " +
    "спонсирующие ребёнка, который уже находится в ОАЭ.",
  ru_overview:
    "Если ребёнок уже находится в ОАЭ, все этапы оформляются через сервисные центры Amer " +
    "без выезда из страны. Маршрут inside-country дороже outside-country: " +
    "entry permit стоит больше, а дополнительный шаг по смене статуса добавляет расходы. " +
    "Медицинский осмотр на стандартном детском маршруте не требуется.\n\n" +
    "Суммарные государственные сборы составляют около AED 2,875 и включают открытие family file, " +
    "entry permit, смену статуса, Emirates ID и residence visa. " +
    "Расходы на аттестацию документов за рубежом оплачиваются отдельно и зависят от страны. " +
    "Закладывайте от 3 до 6 недель в целом: " +
    "аттестация свидетельства о рождении, как правило, самый долгий этап.",
};

// ── RU step content ───────────────────────────────────────────────────────────

const RU_STEPS = [
  {
    step_order: 1,
    ru_title:   "Аттестовать свидетельство о рождении",
    ru_what:
      "Аттестуйте свидетельство о рождении ребёнка для использования в ОАЭ. " +
      "Процесс различается в зависимости от страны, но как правило включает нотариальное заверение, " +
      "апостиль или легализацию в МИД, штамп посольства ОАЭ и финальную аттестацию через MOFA.",
    ru_where:   "UAE MOFA (финальный этап)",
    ru_address: "mofa.gov.ae или любой typing center для аттестации MOFA",
    ru_advice:
      "Начните с этого шага. Если документ не на арабском или английском, " +
      "перед аттестацией в MOFA потребуется сертифицированный перевод.",
    ru_warning:
      "Требования различаются в зависимости от страны. " +
      "Уточните цепочку аттестации в посольстве ОАЭ в стране, " +
      "где выдано свидетельство о рождении, прежде чем начинать.",
  },
  {
    step_order: 2,
    ru_title:   "Открыть family file в Amer",
    ru_what:
      "Спонсор подаёт документы в сервисный центр Amer для открытия " +
      "family file ребёнка и регистрации зависимости.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "При себе иметь: Emirates ID спонсора (оригинальная карта), паспорт и residence visa; " +
      "аттестованное свидетельство о рождении ребёнка, его паспорт и фото на белом фоне; " +
      "Ejari или договор аренды; справку о доходах " +
      "(salary certificate для free zone или госсектора; трудовой договор для частного сектора).",
    ru_warning:
      "Оригинал Emirates ID обязателен. Копия или цифровая версия не принимается.",
  },
  {
    step_order: 3,
    ru_title:   "Подать заявку на entry permit",
    ru_what:
      "Amer подаёт заявку на entry permit (inside-country) в ICP. " +
      "После одобрения ребёнок может перейти к смене статуса без выезда из ОАЭ.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:  "",
    ru_warning: "",
  },
  {
    step_order: 4,
    ru_title:   "Завершить смену статуса",
    ru_what:
      "Подайте заявку на смену статуса в Amer. " +
      "Это переводит текущий визовый статус ребёнка в процесс оформления residence visa.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:  "",
    ru_warning: "",
  },
  {
    step_order: 5,
    ru_title:   "Подать заявку на Emirates ID",
    ru_what:
      "Подайте заявку на Emirates ID через Amer или authorised service channel. " +
      "Биометрия требуется не всем детям: обычно fingerprint и signature нужны только заявителям от 15 лет. " +
      "Для младших детей заявка обычно оформляется по документам и фото.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Срок Emirates ID обычно связан со сроком residence visa. " +
      "Отслеживать доставку карты можно через ICP или канал, указанный в заявке.",
    ru_warning: "",
  },
  {
    step_order: 6,
    ru_title:   "Завершить оформление residence visa",
    ru_what:
      "Завершите оформление residence visa через Amer. " +
      "После одобрения residence status обновляется в системе, " +
      "а Emirates ID становится основным документом резидента.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Проверьте, нужен ли оригинал паспорта для вашей конкретной заявки. " +
      "Не планируйте поездки до завершения процесса и получения подтверждения residence status.",
    ru_warning:
      "Проверьте срок действия паспорта ребёнка перед подачей. " +
      "Паспорт должен быть действителен не менее 6 месяцев " +
      "после предполагаемой даты истечения residence visa.",
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

const writtenSteps = db
  .prepare("SELECT ru_title FROM steps WHERE guide_id = ? AND (ru_title IS NULL OR ru_title = '')")
  .all(guide.id);

if (writtenSteps.length > 0) {
  console.error(`FAIL ${writtenSteps.length} step(s) missing ru_title`);
  process.exit(1);
}

console.log(`OK ${SLUG}: guide ru_* written, ${steps.length} steps updated`);
db.close();
