// Updates only ru_* fields for holiday-home-permit-dubai.
// Does not touch EN fields, step count, published status, or other guides.
// Run with: npx tsx scripts/add-ru-holiday-home-permit-guide.ts

import Database from "better-sqlite3";
import path from "path";

const SLUG = "holiday-home-permit-dubai";
const EXPECTED_STEPS = 12;
const DB_PATH = path.join(process.cwd(), "data", "guides.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Content guards ────────────────────────────────────────────────────────────

const EM_DASH = "—";

function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM_DASH)) {
    console.error(`FAIL em-dash found in ${label}: ${JSON.stringify(value)}`);
    process.exit(1);
  }
}

function assertNoGuarantee(label: string, value: string): void {
  const lower = value.toLowerCase();
  const forbidden = [
    "guaranteed approval",
    "approval guaranteed",
    "guarantee approval",
    "guarantees approval",
    "will be approved",
    "always approved",
    "гарантировано одобрение",
    "одобрение гарантировано",
    "всегда одобряет",
  ];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL guarantee language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

function assertNoPartnership(label: string, value: string): void {
  const lower = value.toLowerCase();
  const forbidden = [
    "guidex partner",
    "our partner det",
    "partner with airbnb",
    "partner with booking",
    "partner with det",
    "партнёр det",
    "партнер det",
    "наш партнёр",
  ];
  for (const p of forbidden) {
    if (lower.includes(p)) {
      console.error(`FAIL partnership language in ${label}: "${p}"`);
      process.exit(1);
    }
  }
}

function assertNoPrivateData(label: string, value: string): void {
  if (/HH-\d{4,}/i.test(value) || /DEWA-\d+/i.test(value)) {
    console.error(`FAIL potential private identifier in ${label}`);
    process.exit(1);
  }
}

// ── Guide-level RU content ────────────────────────────────────────────────────

const RU_GUIDE = {
  ru_title:
    "Разрешение Holiday Home в Дубае: регистрация или продление для Airbnb и Booking.com",
  ru_summary:
    "Зарегистрируйте или продлите квартиру или виллу в Дубае как Holiday Home " +
    "через портал DET / HH Permits перед размещением на Airbnb, Booking.com " +
    "или других платформах краткосрочной аренды.",
  ru_audience:
    "Владельцы недвижимости и операторы, которые хотят добавить или продлить " +
    "Holiday Home unit в Дубае, загрузить документы, пройти классификацию " +
    "и получить разрешение через официальный HH portal.",
  ru_overview:
    "Любая квартира или вилла в Дубае, которую сдают посуточно через Airbnb, " +
    "Booking.com или аналогичные платформы, должна быть зарегистрирована как " +
    "Holiday Home через портал DET / HH Permits до размещения объявления. " +
    "Разрешение выдаётся на каждый юнит отдельно и, как правило, действует один год. " +
    "Через тот же портал подаются как первичные регистрации (Add New Unit), " +
    "так и ежегодные продления (Renew).\n\n" +
    "Процесс состоит из шести этапов: данные юнита, загрузка документов, " +
    "проверка DET, классификация, оплата и выпуск записи. Сроки зависят от " +
    "скорости проверки, наличия комментариев от DET и подтверждения оплаты. " +
    "После выдачи разрешения номер разрешения указывается во всех объявлениях " +
    "на платформах.",
};

// ── Step RU content ───────────────────────────────────────────────────────────

const RU_STEPS = [
  // ── Step 1 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Выбрать Add New Unit или Renew",
    ru_what:
      "На портале HH Permits доступны два пути. Add New Unit используется для первичной " +
      "регистрации юнита, Renew используется для продления действующего или истекающего " +
      "разрешения. Выберите нужный путь до заполнения каких-либо данных. Юнит, который " +
      "ещё не регистрировался, проходит регистрацию через Add New Unit. Юнит с действующим или истекающим " +
      "разрешением использует Renew.",
    ru_where:   "Портал DET Holiday Homes (HH Permits)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Перед началом проверьте текущий статус юнита в портале. Возможные статусы: " +
      "Approved, About To Expire, Pending, Rejected, Renewal Under Review, " +
      "Approved Under Review, Renewal Payment Pending Approval. " +
      "Если юнит уже отображается в вашем аккаунте, используйте Renew, а не Add New Unit.",
    ru_warning:
      "Запуск заявки Add New Unit для юнита с действующим разрешением может создать " +
      "дублирующие записи в портале. Сначала проверьте статус юнита в портале.",
  },
  // ── Step 2 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Открыть портал HH Permits",
    ru_what:
      "Войдите в портал DET Holiday Homes (HH Permits). Если аккаунта нет, " +
      "зарегистрируйтесь до начала заявки. Для физических лиц и компаний " +
      "регистрация проходит по разным путям.",
    ru_where:   "Портал DET Holiday Homes",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Физические лица регистрируются с данными Emirates ID. Компании используют " +
      "корпоративные данные. Многие владельцы могут зарегистрировать юнит через " +
      "личный аккаунт, если данные владельца совпадают с title deed. Отдельная " +
      "управляющая компания не всегда обязательна. Если юнитом управляет компания " +
      "или оператор, данные компании, trade licence и документы на уполномоченное " +
      "лицо должны соответствовать заявке. Держите логин доступным: портал проходится " +
      "в несколько этапов, которые могут занять несколько дней.",
    ru_warning:
      "Используйте аккаунт правильного типа. Физические лица и компании/операторы " +
      "регистрируются по разным путям и могут использовать разные документы.",
  },
  // ── Step 3 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Заполнить данные юнита",
    ru_what:
      "Введите данные юнита на первом этапе портала (Stage 1): тип юнита, количество " +
      "спален, название здания и район. Количество спален используется для расчёта " +
      "сбора. Заполните все обязательные поля до перехода к загрузке документов.",
    ru_where:   "Портал DET, Этап 1 из 6 (Unit Information)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Количество спален напрямую определяет сбор: AED 300 за каждую спальню. " +
      "Указывайте количество, как в title deed или плане юнита. Если неясно, как " +
      "портал классифицирует студию, уточните в DET до подачи заявки.",
    ru_warning:
      "Неверное количество спален изменит расчётный сбор и может потребовать " +
      "корректировки до продолжения заявки. Сверяйтесь с title deed или планом юнита.",
  },
  // ── Step 4 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Аккуратно указать даты разрешения",
    ru_what:
      "Укажите даты начала и окончания разрешения там, где портал запрашивает эти данные. " +
      "Разрешения Holiday Home обычно действуют один год. При продлении убедитесь, что " +
      "новая дата начала следует сразу за окончанием текущего разрешения без перерыва. " +
      "Для юнитов под управлением оператора требования DET могут предусматривать " +
      "совпадение дат разрешения с датами Property Management Letter.",
    ru_where:   "Портал DET, Этап 1 из 6 (Unit Information)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Сверьте даты с title deed и действующим разрешением перед подтверждением. " +
      "Ошибки в датах часто становятся причиной отказа или запроса на повторную подачу.",
    ru_warning:
      "Юнит, размещённый на Airbnb или Booking.com с истёкшими или неверными датами " +
      "разрешения, не соответствует требованиям DET.",
  },
  // ── Step 5 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Загрузить необходимые документы",
    ru_what:
      "Загрузите документы на втором этапе портала (Stage 2). Основные документы: " +
      "title deed или официальное подтверждение права собственности, паспорт и Emirates ID " +
      "владельца, свежий счёт DEWA и номер DEWA, запрашиваемый порталом, фотографии юнита " +
      "(интерьер и экстерьер), план юнита, NOC от управляющей компании здания при " +
      "необходимости. Если юнитом управляет оператор, может потребоваться " +
      "Property Management Letter или документ о наделении полномочиями от владельца. " +
      "Если заявителем является компания: trade licence, паспорт и Emirates ID " +
      "уполномоченного лица. Портал проверяет формат и размер файлов.",
    ru_where:   "Портал DET, Этап 2 из 6 (Documents)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Сканируйте документы с высоким разрешением. Подготовьте все файлы в формате " +
      "PDF или JPG до начала загрузки, чтобы снизить риск прерывания сессии. " +
      "DET может указывать DEWA account number, а не DEWA premise number. Если " +
      "формулировка на портале отличается, следуйте текущим инструкциям HH portal. " +
      "Если заявитель не является владельцем или юнитом управляет компания, уточните " +
      "актуальные требования портала по документам на уполномоченного.",
    ru_warning:
      "Неполный или некачественный пакет документов задержит заявку на этапе проверки. " +
      "DET может запросить повторную подачу, что увеличит сроки. Заранее уточните, " +
      "требует ли ваше здание NOC от застройщика или управляющей компании.",
  },
  // ── Step 6 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Проверить заявку перед отправкой",
    ru_what:
      "Проверьте все введённые данные и загруженные документы перед отправкой. " +
      "Убедитесь, что данные юнита, количество спален, даты разрешения и все нужные " +
      "документы на месте. Отправьте заявку после проверки.",
    ru_where:   "Портал DET, Этап 3 из 6 (Review)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Ещё раз проверьте количество спален, тип юнита и прикреплённые файлы перед " +
      "отправкой. Портал может показывать этап проверки перед переходом к следующим " +
      "шагам. Внесение изменений после отправки невозможно.",
    ru_warning:
      "Подача с неверными или недостающими документами может перевести заявку в статус " +
      "комментариев или повторной подачи и увеличить срок обработки.",
  },
  // ── Step 7 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Пройти классификацию юнита",
    ru_what:
      "Пройдите классификацию, когда портал открывает этап Associated Forms или этап " +
      "классификации. DET присваивает каждому юниту категорию Deluxe или Standard по " +
      "чеклисту: оснащённость, качество мебели и оборудование безопасности. Категория " +
      "определяет ставку Tourism Dirham для каждого гостевого ночлега.",
    ru_where:   "Портал DET, Этап 4 из 6 (Associated Forms)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "По инструкциям DET классификация проходит самостоятельно в рамках подачи заявки. " +
      "Следуйте текущей последовательности в HH portal. " +
      "Чеклист охватывает примерно 8 групп критериев: оборудование безопасности " +
      "(дымовой извещатель, огнетушитель, аптечка), качество мебели и общее " +
      "состояние юнита. Изучите чеклист в портале до начала заполнения.",
    ru_warning:
      "Категория напрямую влияет на ставку Tourism Dirham: AED 15 за номер в сутки " +
      "для Deluxe, AED 10 для Standard. Внимательно проверьте критерии перед " +
      "подтверждением категории.",
  },
  // ── Step 8 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Проверить официальные сборы",
    ru_what:
      "До оплаты убедитесь в правильности итоговой суммы на пятом этапе портала " +
      "(Stage 5). Стандартная формула: AED 300 за каждую спальню + AED 50 (классификация) " +
      "+ AED 10 (Knowledge fee) + AED 10 (Innovation fee). Сверьте итог в портале " +
      "с ожидаемой суммой до ввода платёжных данных.",
    ru_where:   "Портал DET, Этап 5 из 6 (Pay Fees)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Суммы сборов устанавливает DET и могут изменяться. Ориентируйтесь на сумму " +
      "в портале, а не на внешние источники или публикации.",
    ru_warning:
      "Итоговая сумма в портале является точной. Примерные цифры из внешних источников " +
      "могут не соответствовать актуальным ставкам DET.",
  },
  // ── Step 9 ─────────────────────────────────────────────────────────────────
  {
    ru_title:   "Дождаться проверки DET или комментариев",
    ru_what:
      "После подачи заявки DET проводит проверку. Статус отображается как Pending. " +
      "Никаких действий не требуется, пока DET не запросит дополнительные документы " +
      "или информацию через портал.",
    ru_where:   "Портал DET (следите за изменениями статуса)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Регулярно проверяйте портал на наличие комментариев или запросов. Отвечайте " +
      "на запросы DET оперативно. Задержка с ответом увеличивает срок проверки. " +
      "DET также может уведомить по email или SMS.",
    ru_warning:
      "Если статус переходит в Rejected, портал показывает причину. Частые причины: " +
      "отсутствие NOC, несоответствие данных в title deed, неполный пакет документов. " +
      "Устраните указанную причину до повторной подачи.",
  },
  // ── Step 10 ────────────────────────────────────────────────────────────────
  {
    ru_title:   "Подтвердить оплату и загрузить квитанцию при необходимости",
    ru_what:
      "После того как DET завершит проверку, портал переходит к оплате. Оплатите " +
      "сбор онлайн на этапе 5 (Stage 5). Если портал требует загрузить квитанцию, " +
      "скачайте подтверждение из банка или платёжного сервиса и загрузите в портал.",
    ru_where:   "Портал DET, Этап 5 из 6 (Pay Fees)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Оплата только онлайн, наличные не принимаются. Сохраните подтверждение оплаты. " +
      "Загрузка квитанции или статус Pending Approval не означают одобрение. " +
      "Дождитесь статуса Approved и возможности скачать сертификат разрешения.",
    ru_warning:
      "Если статус Renewal Payment Pending Approval сохраняется несколько рабочих " +
      "дней, проверьте портал на наличие комментариев до обращения в поддержку " +
      "DET или HH.",
  },
  // ── Step 11 ────────────────────────────────────────────────────────────────
  {
    ru_title:   "Дождаться подтверждения оплаты и выпуска записи",
    ru_what:
      "После подтверждения оплаты DET завершает выпуск разрешения. Статус переходит " +
      "на этап 6 (Record Issuance). Сертификат разрешения выдаётся в электронном виде " +
      "и доступен для скачивания в портале. Статус юнита должен отображаться как " +
      "Approved, прежде чем использовать разрешение для размещения на платформах.",
    ru_where:   "Портал DET, Этап 6 из 6 (Record Issuance)",
    ru_address: "Портал HH Permits",
    ru_advice:
      "Скачайте сертификат разрешения сразу после его появления в портале. Сохраните " +
      "копию в надёжном месте. В сертификате указан номер разрешения, который нужно " +
      "добавить во все объявления на платформах.",
    ru_warning:
      "Не размещайте юнит на Airbnb или Booking.com, пока статус не станет Approved " +
      "и сертификат разрешения не будет доступен для скачивания в портале.",
  },
  // ── Step 12 ────────────────────────────────────────────────────────────────
  {
    ru_title:   "Распечатать разрешение и подготовить юнит к гостям",
    ru_what:
      "Разместите номер разрешения в юните согласно требованиям DET. Добавьте номер " +
      "разрешения в объявление на Airbnb, Booking.com или другой платформе. Настройте " +
      "сбор Tourism Dirham с гостей: AED 15 за номер в сутки (Deluxe) или AED 10 за " +
      "номер в сутки (Standard) с перечислением в DET по установленному графику.",
    ru_where:   "Местоположение юнита и настройки объявления на платформе",
    ru_address:
      "Платформы (Airbnb Host Dashboard, Booking.com Extranet) и портал DET Tourism Dirham",
    ru_advice:
      "Настройте перечисление Tourism Dirham до первого заезда гостей. Сбор и " +
      "перечисление Tourism Dirham являются отдельным регуляторным обязательством, " +
      "не связанным с самим разрешением. Holiday Homes 2.0 помогает с регистрацией " +
      "заезда и выезда гостей, оплатой Tourism Dirham и функцией QR-кода там, " +
      "где применимо. DET предоставляет инструменты отчётности и оплаты в портале.",
    ru_warning:
      "Airbnb и Booking.com требуют указать действующий номер разрешения Holiday Home " +
      "в объявлении. Объявления без действующего номера разрешения могут быть " +
      "приостановлены платформой.",
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
  assertNoPartnership(`guide.${key}`, val);
  assertNoPrivateData(`guide.${key}`, val);
}

for (let i = 0; i < RU_STEPS.length; i++) {
  const s = RU_STEPS[i];
  for (const [key, val] of Object.entries(s)) {
    assertNoEmDash(`step${i + 1}.${key}`, val);
    assertNoGuarantee(`step${i + 1}.${key}`, val);
    assertNoPartnership(`step${i + 1}.${key}`, val);
    assertNoPrivateData(`step${i + 1}.${key}`, val);
  }
  if (!s.ru_title || !s.ru_what || !s.ru_advice || !s.ru_warning) {
    console.error(`FAIL step ${i + 1}: ru_title, ru_what, ru_advice, ru_warning must all be non-empty`);
    process.exit(1);
  }
}

console.log(`Pre-write validation passed (${Object.keys(guideFields).length} guide fields, ${RU_STEPS.length} steps).`);

// ── Pre-write state ───────────────────────────────────────────────────────────

const guide = db
  .prepare("SELECT id, en_title, published, ru_title FROM guides WHERE slug = ?")
  .get(SLUG) as { id: string; en_title: string; published: number; ru_title: string } | undefined;

if (!guide) {
  console.error(`FAIL: guide '${SLUG}' not found. Run add-holiday-home-permit-guide.ts first.`);
  process.exit(1);
}

console.log(`\nBefore: guide '${SLUG}' found.`);
console.log(`  EN title: ${guide.en_title}`);
console.log(`  Published: ${guide.published}`);
console.log(`  Current ru_title: "${guide.ru_title}" (${guide.ru_title ? "non-empty" : "empty"})`);

const stepsBefore = db
  .prepare("SELECT id, step_order, en_title FROM steps WHERE guide_id = ? ORDER BY step_order")
  .all(guide.id) as { id: string; step_order: number; en_title: string }[];

if (stepsBefore.length !== EXPECTED_STEPS) {
  console.error(`FAIL: expected ${EXPECTED_STEPS} steps, found ${stepsBefore.length}`);
  process.exit(1);
}

console.log(`  Step count: ${stepsBefore.length} (correct)`);

// ── Transaction: update RU fields only ───────────────────────────────────────

const updateGuide = db.prepare(
  `UPDATE guides
   SET ru_title = ?, ru_summary = ?, ru_audience = ?, ru_overview = ?
   WHERE id = ?`
);

const updateStep = db.prepare(
  `UPDATE steps
   SET ru_title = ?, ru_what = ?, ru_where = ?, ru_address = ?, ru_advice = ?, ru_warning = ?
   WHERE id = ?`
);

let guideRowsChanged = 0;
let stepRowsChanged = 0;

db.transaction(() => {
  const guideResult = updateGuide.run(
    RU_GUIDE.ru_title,
    RU_GUIDE.ru_summary,
    RU_GUIDE.ru_audience,
    RU_GUIDE.ru_overview,
    guide.id,
  );
  guideRowsChanged = guideResult.changes;

  for (let i = 0; i < stepsBefore.length; i++) {
    const step = stepsBefore[i];
    const s = RU_STEPS[i];
    const stepResult = updateStep.run(
      s.ru_title,
      s.ru_what,
      s.ru_where,
      s.ru_address,
      s.ru_advice,
      s.ru_warning,
      step.id,
    );
    stepRowsChanged += stepResult.changes;
    console.log(`  Step ${step.step_order}: ${s.ru_title}`);
  }
})();

console.log(`\nRows changed: guide=${guideRowsChanged}, steps=${stepRowsChanged}`);

// ── Post-write verification ───────────────────────────────────────────────────

const after = db
  .prepare("SELECT id, slug, en_title, ru_title, ru_summary, published FROM guides WHERE slug = ?")
  .get(SLUG) as {
    id: string; slug: string; en_title: string; ru_title: string;
    ru_summary: string; published: number;
  } | undefined;

if (!after) {
  console.error("FAIL post-write: guide not found.");
  process.exit(1);
}

// EN title must be unchanged
const EXPECTED_EN_TITLE = "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Booking.com";
if (after.en_title !== EXPECTED_EN_TITLE) {
  console.error(`FAIL post-write: EN title changed. Got: "${after.en_title}"`);
  process.exit(1);
}

// RU title must be non-empty
if (!after.ru_title.trim()) {
  console.error("FAIL post-write: ru_title is empty after update.");
  process.exit(1);
}

// Published must be unchanged
if (after.published !== guide.published) {
  console.error(`FAIL post-write: published changed from ${guide.published} to ${after.published}`);
  process.exit(1);
}

const stepsAfter = db
  .prepare(
    `SELECT step_order, en_title, ru_title, ru_what, ru_advice, ru_warning
     FROM steps WHERE guide_id = ? ORDER BY step_order`
  )
  .all(after.id) as {
    step_order: number; en_title: string; ru_title: string;
    ru_what: string; ru_advice: string; ru_warning: string;
  }[];

if (stepsAfter.length !== EXPECTED_STEPS) {
  console.error(`FAIL post-write step count: expected ${EXPECTED_STEPS}, got ${stepsAfter.length}`);
  process.exit(1);
}

let emDashCount = 0;
for (const row of stepsAfter) {
  if (!row.ru_title.trim()) {
    console.error(`FAIL post-write: ru_title empty for step ${row.step_order}`);
    process.exit(1);
  }
  if (!row.ru_what.trim()) {
    console.error(`FAIL post-write: ru_what empty for step ${row.step_order}`);
    process.exit(1);
  }
  if (!row.ru_advice.trim()) {
    console.error(`FAIL post-write: ru_advice empty for step ${row.step_order}`);
    process.exit(1);
  }
  if (!row.ru_warning.trim()) {
    console.error(`FAIL post-write: ru_warning empty for step ${row.step_order}`);
    process.exit(1);
  }
  for (const val of [row.ru_title, row.ru_what, row.ru_advice, row.ru_warning]) {
    if (val.includes(EM_DASH)) emDashCount++;
  }
}

// Em-dash check on guide RU fields
for (const val of [after.ru_title, after.ru_summary]) {
  if (val.includes(EM_DASH)) emDashCount++;
}

if (emDashCount > 0) {
  console.error(`FAIL post-write: ${emDashCount} em-dash(es) found in RU content.`);
  process.exit(1);
}

console.log("\n✓ Post-write verification passed:");
console.log(`  Slug:         ${after.slug}`);
console.log(`  EN title:     ${after.en_title}`);
console.log(`  RU title:     ${after.ru_title}`);
console.log(`  Published:    ${after.published} (unchanged)`);
console.log(`  Steps:        ${stepsAfter.length}`);
console.log(`  Em-dashes:    0`);
console.log(`  Guide rows:   ${guideRowsChanged}`);
console.log(`  Step rows:    ${stepRowsChanged}`);

console.log("\n12 RU step titles:");
for (const row of stepsAfter) {
  console.log(`  ${row.step_order}. ${row.ru_title}`);
}

console.log("\nRU content written. Local only - production unchanged.");
console.log("Local preview: http://localhost:3000/ru/guides/holiday-home-permit-dubai");

db.close();
