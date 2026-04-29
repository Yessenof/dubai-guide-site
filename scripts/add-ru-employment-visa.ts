/**
 * One-time script: populate ru_* fields for employment-visa (inside-country route).
 * Run: npx tsx scripts/add-ru-employment-visa.ts
 */

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data/guides.db");
const db = new Database(DB_PATH);

const GUIDE_SLUG = "employment-visa";

// ── Guide-level RU content ──────────────────────────────────────────────────

const ru_title =
  "Рабочая виза в Дубае: оформление через компанию без выезда из ОАЭ";

const ru_summary =
  "Как оформить рабочую резидентскую визу в Дубае без выезда из страны. " +
  "Полный процесс через Tasheel, Amer и Tawjeeh — от AED 4 900 до 7 300 в зависимости от категории труда.";

const ru_audience =
  "Сотрудники, уже находящиеся в ОАЭ на любом визовом статусе и спонсируемые компанией на материке Дубая.";

const ru_overview =
  "Маршрут внутри страны позволяет получить резидентскую визу ОАЭ без выезда. " +
  "Все визиты в сервисные центры выполняет PRO вашего работодателя: Tasheel — для подачи документов в MOHRE, " +
  "Amer — для оформления резидентства и Emirates ID, Tawjeeh — для финального трудового договора у сотрудников категории 3.\n\n" +
  "Общие государственные сборы составляют AED 4 900–7 300 в зависимости от категории труда: " +
  "категория 3 (ограниченно квалифицированные) оплачивает более высокий сбор MOHRE, чем категории 1/2. " +
  "Процесс занимает около 2–4 недель. От вас потребуется предоставить документы вовремя и пройти медицинское освидетельствование.";

// ── Step-level RU content ───────────────────────────────────────────────────

const steps: Record<
  number,
  {
    ru_title: string;
    ru_what: string;
    ru_where: string;
    ru_address: string;
    ru_advice: string;
    ru_warning: string;
  }
> = {
  1: {
    ru_title: "Подача оффера, трудовой карты и разрешения на работу",
    ru_what:
      "PRO вашего работодателя подаёт подписанный оффер и заявку на разрешение на работу в Tasheel, " +
      "регистрируя трудовой договор в MOHRE.",
    ru_where: "Сервисный центр Tasheel",
    ru_address: "Любое отделение Tasheel в Дубае",
    ru_advice:
      "Подготовьте заранее: подписанный оффер, копию паспорта, фото и страницу действующей визы ОАЭ. " +
      "Должность в документах должна точно совпадать с должностью в визе.",
    ru_warning: "",
  },
  2: {
    ru_title: "Оплата страховки трудовой карты и сбора MOHRE",
    ru_what:
      "Два платежа в Tasheel: страховка трудовой карты (AED 189) и сбор MOHRE — " +
      "AED 1 285 для категории 1/2, AED 3 555 для категории 3.",
    ru_where: "Сервисный центр Tasheel",
    ru_address: "Любое отделение Tasheel в Дубае",
    ru_advice:
      "Категория труда определяется по должности и квалификации, а не по зарплате. " +
      "Уточните категорию у работодателя до подачи документов.",
    ru_warning:
      "Категория 3 предполагает значительно более высокий сбор MOHRE. " +
      "Если вы считаете, что ваша должность относится к квалифицированным — обсудите это с работодателем до подачи. " +
      "Пересмотр категории после оформления крайне затруднён.",
  },
  3: {
    ru_title: "Подача заявки на въездное разрешение внутри страны",
    ru_what:
      "Работодатель подаёт заявку на inside-country entry permit через Amer — " +
      "это разрешает смену статуса на рабочий резидентский без выезда из ОАЭ.",
    ru_where: "Сервисный центр Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Все последующие шаги зависят от этого одобрения. " +
      "PRO должен отслеживать статус и уведомить вас сразу после получения разрешения.",
    ru_warning: "",
  },
  4: {
    ru_title: "Смена визового статуса",
    ru_what:
      "Текущий визовый статус официально меняется на рабочий резидентский в Amer. " +
      "Этот шаг обязателен перед медицинским освидетельствованием и оформлением Emirates ID.",
    ru_where: "Сервисный центр Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Возьмите копию действующей визы и штамп въезда в ОАЭ. " +
      "Если виза уже истекла — сообщите работодателю до этого шага.",
    ru_warning: "",
  },
  5: {
    ru_title: "Прохождение медицинского освидетельствования",
    ru_what:
      "Анализ крови и рентген лёгких в одобренной ICA клинике, координируется через Amer. " +
      "Результаты передаются в миграционную службу электронно.",
    ru_where: "Сервисный центр Amer (координирует запись в клинику)",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Возьмите паспорт, копию entry permit и фотографию формата паспорта.",
    ru_warning:
      "Ряд заболеваний влияет на право получения визы ОАЭ. " +
      "При наличии хронических заболеваний проконсультируйтесь с юристом до начала процесса.",
  },
  6: {
    ru_title: "Подача заявки на Emirates ID",
    ru_what:
      "Подача заявки на Emirates ID и биометрическая регистрация (отпечатки пальцев и фото) " +
      "в центре Amer. Выдаётся карта сроком на 2 года.",
    ru_where: "Сервисный центр Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Отслеживайте доставку карты через приложение ICA. " +
      "Сохраняйте квитанцию о регистрации до получения физической карты.",
    ru_warning: "",
  },
  7: {
    ru_title: "Финальная подача трудового договора",
    ru_what:
      "Финальная подача трудового договора для завершения регистрации в MOHRE. " +
      "Квалифицированные сотрудники (категория 1/2) — через Tasheel, " +
      "ограниченно квалифицированные (категория 3) — через Tawjeeh.",
    ru_where: "Tasheel (категория 1/2) или Tawjeeh (категория 3)",
    ru_address: "Любое отделение Tasheel или Tawjeeh в Дубае",
    ru_advice:
      "Уточните у работодателя, какой сервисный центр нужен — Tasheel и Tawjeeh работают в разных сетях.",
    ru_warning: "",
  },
  8: {
    ru_title: "Получение резидентской визы",
    ru_what:
      "PRO подаёт заявку на выдачу резидентской визы в Amer. " +
      "После одобрения рабочая виза ОАЭ проставляется в паспорт.",
    ru_where: "Сервисный центр Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "Паспорт будет удерживаться на время проставления визы — не бронируйте поездки, пока он не возвращён.",
    ru_warning:
      "Паспорт должен быть действителен не менее 12 месяцев. " +
      "GDRFA может отказать по паспортам с близким сроком истечения.",
  },
};

// ── Execute updates ─────────────────────────────────────────────────────────

db.transaction(() => {
  // Guide-level
  const guideUpdate = db.prepare(`
    UPDATE guides
    SET ru_title = ?, ru_summary = ?, ru_audience = ?, ru_overview = ?, updated_at = datetime('now')
    WHERE slug = ?
  `);
  const guideResult = guideUpdate.run(
    ru_title,
    ru_summary,
    ru_audience,
    ru_overview,
    GUIDE_SLUG
  );
  console.log(`Guide updated: ${guideResult.changes} row(s)`);

  // Steps
  const stepUpdate = db.prepare(`
    UPDATE steps
    SET ru_title = ?, ru_what = ?, ru_where = ?, ru_address = ?, ru_advice = ?, ru_warning = ?
    WHERE guide_id = (SELECT id FROM guides WHERE slug = ?) AND step_order = ?
  `);

  for (const [orderStr, content] of Object.entries(steps)) {
    const order = Number(orderStr);
    const result = stepUpdate.run(
      content.ru_title,
      content.ru_what,
      content.ru_where,
      content.ru_address,
      content.ru_advice,
      content.ru_warning,
      GUIDE_SLUG,
      order
    );
    console.log(`  Step ${order}: ${result.changes} row(s) — ${content.ru_title}`);
  }
})();

// Verify
const guide = db.prepare("SELECT ru_title FROM guides WHERE slug = ?").get(GUIDE_SLUG) as { ru_title: string };
const stepCount = (db.prepare("SELECT count(*) as n FROM steps WHERE guide_id = (SELECT id FROM guides WHERE slug = ?) AND ru_title != ''").get(GUIDE_SLUG) as { n: number }).n;

console.log(`\nVerification:`);
console.log(`  ru_title: ${guide.ru_title}`);
console.log(`  Steps with ru_title: ${stepCount}/8`);

db.close();
console.log("\nDone.");
