/**
 * One-time script: populate ru_* fields for golden-visa-dubai-property.
 * Run: npx tsx scripts/add-ru-golden-visa-property.ts
 */

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data/guides.db");
const db = new Database(DB_PATH);

const GUIDE_SLUG = "golden-visa-dubai-property";

// ── Guide-level RU content ──────────────────────────────────────────────────

const ru_title =
  "Золотая виза в Дубае через недвижимость от AED 2 000 000";

const ru_summary =
  "Как получить 10-летнюю золотую визу ОАЭ через владение недвижимостью. " +
  "Порог — AED 2 000 000, оформление через DLD и GDRFA. " +
  "Государственные сборы около AED 9 885 для основного заявителя.";

const ru_audience =
  "Владельцы freehold-недвижимости в Дубае с title deed стоимостью от AED 2 000 000, " +
  "желающие получить 10-летнюю резидентскую визу инвестора без привязки к работодателю.";

const ru_overview =
  "Маршрут через недвижимость даёт 10-летнюю возобновляемую визу инвестора. " +
  "Подходит владельцам freehold-объектов, зарегистрированных в Dubai Land Department (DLD) " +
  "на сумму от AED 2 000 000. Несколько объектов можно суммировать. " +
  "Спонсорство работодателя не требуется.\n\n" +
  "Государственные сборы для основного заявителя — около AED 9 885: " +
  "сборы DLD, разрешение на резидентство, административные расходы, " +
  "медицинское освидетельствование и Emirates ID. " +
  "После одобрения основной визы можно спонсировать членов семьи. " +
  "Официальный срок обработки файла DLD — 7–10 рабочих дней.";

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
    ru_title: "Проверка соответствия недвижимости требованиям",
    ru_what:
      "Убедитесь, что объект является freehold, зарегистрирован в Dubai Land Department " +
      "и оценён на сумму от AED 2 000 000.",
    ru_where: "Dubai Land Department",
    ru_address: "Приложение Dubai REST или dubailand.gov.ae",
    ru_advice:
      "Несколько объектов можно суммировать для достижения порога. " +
      "Для off-plan или ипотечных объектов могут потребоваться дополнительные документы — " +
      "уточните в DLD до подачи.",
    ru_warning: "",
  },
  2: {
    ru_title: "Подготовка документов инвестора",
    ru_what:
      "Подготовьте все необходимые документы перед подачей заявки в DLD.",
    ru_where: "Без визита в офис",
    ru_address: "Подготовка перед обращением в DLD или через приложение Dubai REST",
    ru_advice:
      "Необходимо: копия паспорта, личное фото, title deed или электронный сертификат " +
      "права собственности (Oqood), копия Emirates ID и действующего резидентского разрешения " +
      "(если уже находитесь в ОАЭ). При ипотеке добавьте mortgage NOC от банка.",
    ru_warning: "",
  },
  3: {
    ru_title: "Получение оценки недвижимости или подтверждения от банка",
    ru_what:
      "При необходимости закажите официальный property valuation certificate " +
      "или NOC от банка, подтверждающий детали владения.",
    ru_where: "Аккредитованный оценщик DLD или ваш банк",
    ru_address:
      "Оценочная компания, аккредитованная DLD, или отделение ипотечного банка",
    ru_advice:
      "Требуется не для всех файлов. Уточните в DLD, нужна ли оценка для вашего типа " +
      "объекта — прежде чем её заказывать.",
    ru_warning: "",
  },
  4: {
    ru_title: "Подача заявки на золотую визу",
    ru_what:
      "Подайте заявку инвестора через DLD. DLD обрабатывает файл и передаёт его " +
      "в GDRFA для одобрения резидентства.",
    ru_where: "Dubai Land Department",
    ru_address: "Приложение Dubai REST или сервисный центр DLD",
    ru_advice:
      "Стоимость AED 8 031.75 включает: сборы DLD (AED 4 020), " +
      "подтверждение разрешения на резидентство (AED 2 856.75) " +
      "и административные сборы (AED 1 155).",
    ru_warning: "",
  },
  5: {
    ru_title: "Прохождение медицинского освидетельствования",
    ru_what:
      "Пройдите медицинский осмотр в одобренном центре. " +
      "Результаты направляются в GDRFA электронно.",
    ru_where: "Одобренный медицинский центр",
    ru_address: "Любой одобренный медицинский центр в Дубае",
    ru_advice: "Возьмите паспорт и копию визы или entry permit.",
    ru_warning:
      "Резидентство не может быть выдано без медицинского допуска.",
  },
  6: {
    ru_title: "Оформление Emirates ID на 10 лет",
    ru_what:
      "Пройдите биометрическую регистрацию (отпечатки пальцев и фото) " +
      "для получения 10-летнего Emirates ID в сервисном канале ICP.",
    ru_where: "Emirates ID / ICP",
    ru_address:
      "Любой одобренный ICP типинг-центр или сервисный центр в Дубае",
    ru_advice:
      "10-летний Emirates ID выдаётся исключительно обладателям золотой визы.",
    ru_warning: "",
  },
  7: {
    ru_title: "Добавление членов семьи после одобрения",
    ru_what:
      "После проставления резидентской визы подайте отдельные заявки на спонсирование " +
      "членов семьи: супруга/-и, детей или родителей.",
    ru_where: "Сервисный центр Amer",
    ru_address: "Любое отделение Amer в Дубае",
    ru_advice:
      "На каждого члена семьи — отдельный файл. " +
      "Стоимость: AED 5 774.50 за разрешение на резидентство, " +
      "AED 318.75 за открытие файла, AED 100 за каждого спонсируемого.",
    ru_warning: "",
  },
};

// ── Execute updates ─────────────────────────────────────────────────────────

db.transaction(() => {
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
const guide = db
  .prepare("SELECT ru_title FROM guides WHERE slug = ?")
  .get(GUIDE_SLUG) as { ru_title: string };
const stepCount = (
  db
    .prepare(
      "SELECT count(*) as n FROM steps WHERE guide_id = (SELECT id FROM guides WHERE slug = ?) AND ru_title != ''"
    )
    .get(GUIDE_SLUG) as { n: number }
).n;

console.log(`\nVerification:`);
console.log(`  ru_title: ${guide.ru_title}`);
console.log(`  Steps with ru_title: ${stepCount}/7`);

db.close();
console.log("\nDone.");
