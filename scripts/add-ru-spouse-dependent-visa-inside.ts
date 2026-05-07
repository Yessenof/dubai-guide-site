// Adds Russian content to the existing spouse-dependent-visa-dubai-inside-country guide.
// UPDATES ru_* fields only. Does NOT touch EN fields, published status, price, or timeline.
// Safe to re-run: subsequent runs overwrite the same ru_* fields.
// Run with: npx tsx scripts/add-ru-spouse-dependent-visa-inside.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG           = "spouse-dependent-visa-dubai-inside-country";
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
    "Виза супруге или супругу в Дубае из ОАЭ: status change и residence",
  ru_summary:
    "Для спонсоров, чей супруг или супруга уже находится в ОАЭ. " +
    "Все этапы оформляются через Amer без выезда из страны: " +
    "entry permit, смена статуса, medical fitness, Emirates ID и residence visa.",
  ru_audience:
    "Резиденты Дубая, работающие в частном секторе, free zone или государственном секторе, " +
    "спонсирующие супруга или супругу, которые уже находятся в ОАЭ.",
  ru_overview:
    "Если супруг или супруга уже находится в ОАЭ, весь процесс оформляется через сервисные центры Amer " +
    "без выезда из страны. Маршрут inside-country дороже outside-country: entry permit стоит значительно " +
    "больше, а дополнительный шаг по смене статуса добавляет расходы.\n\n" +
    "Суммарные государственные сборы составляют около AED 2,700–3,200 в зависимости от сборов typing center " +
    "и способа подачи. Основная задержка: аттестация свидетельства о браке, которую необходимо завершить " +
    "до начала процесса. Весь процесс занимает от 3 до 6 недель.",
};

// ── RU step content ───────────────────────────────────────────────────────────

const RU_STEPS = [
  {
    step_order: 1,
    ru_title:   "Аттестовать свидетельство о браке",
    ru_what:
      "Аттестуйте свидетельство о браке на родине и в UAE MOFA. " +
      "Это необходимо до начала подачи документов в Дубае.",
    ru_where:   "UAE MOFA",
    ru_address: "Любой центр MOFA или mofa.gov.ae",
    ru_advice:
      "Стандартная цепочка: нотариальное заверение, МИД страны выдачи, посольство ОАЭ, UAE MOFA. " +
      "Требуются версии на арабском и английском языках.",
    ru_warning:
      "Amer отклонит заявку, если свидетельство о браке не прошло полную аттестацию.",
  },
  {
    step_order: 2,
    ru_title:   "Открыть family file в Amer",
    ru_what:
      "Подайте документы спонсора и супруга или супруги в Amer " +
      "для открытия family sponsorship file.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Документы: паспорт спонсора, Emirates ID (оригинал), residence visa, " +
      "паспорт супруга или супруги, аттестованное свидетельство о браке, фото, Ejari и справка о доходах.",
    ru_warning:
      "Оригинал Emirates ID обязателен. Копия или цифровая версия не принимается.",
  },
  {
    step_order: 3,
    ru_title:   "Подать заявку на entry permit",
    ru_what:
      "Amer подаёт заявку на inside-country entry permit, позволяющий оформить residence " +
      "без выезда супруга или супруги из ОАЭ.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Текущая виза супруга или супруги должна быть действительна на момент подачи заявки.",
    ru_warning: "",
  },
  {
    step_order: 4,
    ru_title:   "Завершить смену статуса",
    ru_what:
      "Переведите текущий визовый статус супруга или супруги в процесс оформления residence " +
      "без выезда из ОАЭ.",
    ru_where:   "Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:  "",
    ru_warning: "",
  },
  {
    step_order: 5,
    ru_title:   "Пройти medical fitness test",
    ru_what:
      "Супруг или супруга проходит medical fitness test в approved Medical Fitness Center. " +
      "Внутри страны Amer или сервисный канал может помочь с оформлением заявки и направлением, " +
      "но сам медосмотр проходит в медицинском центре. " +
      "Результаты передаются электронно для дальнейшего оформления residence visa.",
    ru_where:   "Approved Medical Fitness Center",
    ru_address:
      "Medical Fitness Center в Дубае, указанный при оформлении заявки через Amer " +
      "или authorised service channel",
    ru_advice:
      "При себе: паспорт, данные заявки и документы, которые запросит центр. " +
      "Проверьте адрес и время визита до поездки.",
    ru_warning:
      "Residence visa не может быть оформлена без успешно пройденного medical fitness test.",
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
      "Укажите адрес доставки и актуальный номер телефона для обновлений от курьерской службы.",
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
      "Проверьте, нужен ли оригинал паспорта для вашей конкретной заявки. " +
      "Не планируйте поездки до завершения процесса и получения подтверждения residence status.",
    ru_warning:
      "Супруг или супруга должны оставаться в ОАЭ до получения residence visa.",
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
