import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WA   = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Переезд в Дубай — первые шаги и план действий | Guidex",
  description:
    "Что подготовить до прилёта, что сделать в первую неделю, первый месяц и каждый год. Визы, компании, Ejari, семья и недвижимость — в правильном порядке.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/ru/life-setup`,
    languages: {
      en:          `${BASE}/life-setup`,
      ru:          `${BASE}/ru/life-setup`,
      "x-default": `${BASE}/life-setup`,
    },
  },
};

// ── Task ──────────────────────────────────────────────────────────────────────

type Task = { label: string; href?: string };

// ── Stage ─────────────────────────────────────────────────────────────────────

type Stage = {
  id:            string;
  num:           string;
  timeframe:     string;
  heading:       string;
  summary:       string;
  tasks:         Task[];
  calendarNote?: string;
  ctaLabel:      string;
  ctaHref:       string;
};

const STAGES: Stage[] = [
  {
    id:        "do-priljota",
    num:       "1",
    timeframe: "За 30–90 дней до прилёта",
    heading:   "До прилёта",
    summary:
      "Определитесь с визой, начните апостилирование документов, заранее изучите школы и требования к ввозу питомцев. Большинство официальных шагов происходит уже после приезда.",
    tasks: [
      { label: "Выберите визовый маршрут: рабочая, инвесторская, золотая или самоспонсируемая виза", href: "/ru/guides/employment-visa" },
      { label: "Заверьте иностранные документы: диплом, свидетельство о браке, свидетельство о рождении", href: "/ru/guides/document-attestation-dubai" },
      { label: "Изучите различие mainland и free zone, если планируете открыть компанию", href: "/ru/guides/mainland-company-setup-dubai" },
      { label: "Подберите школу, если едете с детьми — ознакомьтесь с базой KHDA по частным школам" },
      { label: "Уточните требования MOCCAE к ввозу питомца — начните за 3 месяца до перелёта" },
    ],
    ctaLabel: "Напишите нам о вашем визовом маршруте →",
    ctaHref:  WA,
  },
  {
    id:        "pervye-7-dnej",
    num:       "2",
    timeframe: "Первые 7 дней",
    heading:   "Первая неделя",
    summary:
      "Проверьте штамп в паспорте, оформите SIM-карту, подключите DEWA и запишитесь на биометрию Emirates ID. Не откладывайте.",
    tasks: [
      { label: "Проверьте тип и срок действия въездного штампа в аэропорту" },
      { label: "Оформите SIM-карту — e& (Etisalat) или du, в любом торговом центре или аэропорту" },
      { label: "Подключите DEWA (электричество и вода) для своего жилья" },
      { label: "Запишитесь на биометрию Emirates ID в центре Amer или в офисе ICA", href: "/ru/guides/amer-center-dubai" },
      { label: "Откройте личный банковский счёт — требования у банков различаются, записывайтесь заранее" },
    ],
    ctaLabel: "Нужна помощь в первую неделю? Напишите нам →",
    ctaHref:  WA,
  },
  {
    id:        "pervyj-mesyac",
    num:       "3",
    timeframe: "Первые 30 дней",
    heading:   "Первый месяц",
    summary:
      "Зарегистрируйте Ejari в течение 30 дней после заселения, получите Emirates ID и оформите медицинскую страховку. Предприниматели: зарегистрируйтесь в MoHRE и настройте WPS.",
    tasks: [
      { label: "Зарегистрируйте Ejari — обязательно в течение 30 дней с даты въезда (Земельный департамент Дубая)" },
      { label: "Получите и проверьте карту Emirates ID (ICP — icp.gov.ae)" },
      { label: "Оформите обязательную медицинскую страховку — требование Дубая (Управление здравоохранения Дубая)" },
      { label: "Откройте корпоративный банковский счёт, если у вас есть лицензия компании", href: "/ru/guides/open-business-bank-account-dubai" },
      { label: "Зарегистрируйтесь в MoHRE и настройте WPS, если нанимаете сотрудников" },
    ],
    ctaLabel: "Нужна помощь в первый месяц? Напишите нам →",
    ctaHref:  WA,
  },
  {
    id:        "pervye-90-dnej",
    num:       "4",
    timeframe: "Первые 90 дней",
    heading:   "Первые 90 дней",
    summary:
      "Первые дедлайны по соответствию требованиям: мониторинг порога НДС, регистрация по Corporate Tax, обмен водительского удостоверения и визы для членов семьи.",
    tasks: [
      { label: "Следите за порогом регистрации по НДС (Федеральное налоговое ведомство — federal.ae)" },
      { label: "Зарегистрируйтесь по Corporate Tax в Федеральном налоговом ведомстве (FTA)" },
      { label: "Обменяйте водительское удостоверение, если ваша страна входит в список RTA Дубая" },
      { label: "Подайте на визы для членов семьи, если не сделали этого раньше", href: "/ru/guides/spouse-dependent-visa-dubai-inside-country" },
      { label: "Проверьте обязательства по Emiratisation, если в компании 50 и более сотрудников", href: "/ru/calendar/uae-emiratisation-june-30-2026-reminder" },
    ],
    calendarNote: "Emiratisation: дедлайны 30 июня и 31 декабря для компаний с 50 и более сотрудниками.",
    ctaLabel: "Есть вопросы по дедлайнам? Напишите нам →",
    ctaHref:  WA,
  },
  {
    id:        "ezhegodn",
    num:       "5",
    timeframe: "Каждый год",
    heading:   "Ежегодные обязанности",
    summary:
      "Продлевайте визу и Emirates ID до истечения срока, торговую лицензию — за 30–60 дней до окончания, налоговую декларацию по Corporate Tax — в течение 9 месяцев после окончания налогового периода.",
    tasks: [
      { label: "Продление визы — начните не позднее чем за 60 дней до окончания (GDRFA или Amer)", href: "/ru/guides/amer-center-dubai" },
      { label: "Продление Emirates ID — привязано к продлению визы (ICP — icp.gov.ae)" },
      { label: "Продление торговой лицензии — за 30–60 дней до окончания (DED или ваша свободная зона)" },
      { label: "Декларация по Corporate Tax — подайте в течение 9 месяцев после окончания налогового периода (FTA)" },
      { label: "Продление Ejari — до начала нового срока аренды (Земельный департамент Дубая)" },
      { label: "Продление разрешения DET на посуточную аренду — ежегодно с даты выдачи", href: "/ru/guides/holiday-home-permit-dubai" },
      { label: "Проверка соответствия требованиям Emiratisation — июнь и декабрь", href: "/ru/calendar/uae-emiratisation-june-30-2026-reminder" },
    ],
    calendarNote: "Следите за сроками в Календаре Дубая.",
    ctaLabel: "Открыть Календарь Дубая →",
    ctaHref:  "/ru/calendar",
  },
];

// ── Route cards ───────────────────────────────────────────────────────────────

type RouteCard = {
  title:       string;
  description: string;
  links:       { label: string; href: string }[];
  ctaLabel:    string;
  ctaHref:     string;
};

const ROUTES: RouteCard[] = [
  {
    title:       "Семья и школа",
    description: "Переезжаете с детьми? Заявки в частные школы Дубая открываются за 6–12 месяцев до учебного года. Начните до отъезда.",
    links: [
      { label: "Виза для ребёнка",                     href: "/ru/guides/child-dependent-visa-dubai-outside-country" },
      { label: "Виза для супруга/супруги",              href: "/ru/guides/spouse-dependent-visa-dubai-outside-country" },
      { label: "Продление семейной визы",               href: "/ru/guides/renew-family-visa-dubai" },
    ],
    ctaLabel: "Написать о переезде с семьёй →",
    ctaHref:  WA,
  },
  {
    title:       "Бизнес-владелец",
    description: "Предпринимателям предстоит регистрация компании, банковский счёт, оформление в MoHRE и НДС / Corporate Tax — всё в первые 30 дней.",
    links: [
      { label: "Mainland-компания",  href: "/ru/guides/mainland-company-setup-dubai" },
      { label: "Компания в free zone", href: "/ru/guides/free-zone-company-setup-dubai" },
      { label: "Корпоративный счёт",  href: "/ru/guides/open-business-bank-account-dubai" },
      { label: "PRO-сервисы",         href: "/ru/guides/pro-services-dubai" },
    ],
    ctaLabel: "Написать об открытии бизнеса →",
    ctaHref:  WA,
  },
  {
    title:       "Владелец недвижимости",
    description: "Landlord обязан зарегистрировать Ejari до начала аренды и проверить индекс аренды перед продлением договора. Посуточная аренда требует разрешения DET.",
    links: [
      { label: "Разрешение DET на посуточную аренду", href: "/ru/guides/holiday-home-permit-dubai" },
    ],
    ctaLabel: "Написать о соответствии требованиям →",
    ctaHref:  WA,
  },
  {
    title:       "С питомцем",
    description: "MOCCAE требует справку о здоровье, прививку от бешенства и чип до ввоза питомца в ОАЭ. Оформление занимает от 3 месяцев.",
    links: [],
    ctaLabel: "Написать о ввозе питомца →",
    ctaHref:  WA,
  },
  {
    title:       "Посуточная аренда",
    description: "Для законного размещения квартиры на Airbnb или Booking.com в Дубае нужно разрешение DET Holiday Homes. Уточните актуальные требования на портале DET.",
    links: [
      { label: "Гайд: разрешение DET", href: "/ru/guides/holiday-home-permit-dubai" },
    ],
    ctaLabel: "Читать гайд →",
    ctaHref:  "/ru/guides/holiday-home-permit-dubai",
  },
  {
    title:       "Инвестор",
    description: "Готовая недвижимость стоимостью от 2 000 000 дирхамов может дать право на золотую визу сроком на 10 лет. Подробные условия — в гайде.",
    links: [
      { label: "Золотая виза через недвижимость",    href: "/ru/guides/golden-visa-dubai-property" },
      { label: "Сертификат налогового резидента",    href: "/ru/guides/tax-residency-certificate-uae" },
    ],
    ctaLabel: "Читать гайд о золотой визе →",
    ctaHref:  "/ru/guides/golden-visa-dubai-property",
  },
  {
    title:       "Продление для резидентов",
    description: "Виза, Emirates ID или торговая лицензия истекают в течение 60 дней? Начните процесс продления сейчас. Не откладывайте до последней недели.",
    links: [
      { label: "Продление семейной визы",     href: "/ru/guides/renew-family-visa-dubai" },
      { label: "Центры Amer — как это работает", href: "/ru/guides/amer-center-dubai" },
    ],
    ctaLabel: "Написать о продлении →",
    ctaHref:  WA,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LifeSetupRuPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      {/* Back */}
      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← На главную
      </Link>

      {/* Hero */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-brass mb-2">
        Переезд и первые шаги
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Обустройство в Дубае
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-8">
        Что подготовить до прилёта, что сделать в первую неделю, первый месяц и каждый год.
        Визы, компании, Ejari, семья и недвижимость — в правильном порядке.
      </p>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
      <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
        Ваш план действий
      </h2>

      <div className="space-y-4 mb-12">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
          >
            {/* Stage header */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center">
                {stage.num}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {stage.timeframe}
              </p>
            </div>

            {/* Stage title */}
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">
              {stage.heading}
            </h3>

            {/* One-line answer */}
            <p className="text-[13px] text-gray-600 leading-snug mb-4">
              {stage.summary}
            </p>

            {/* Task list */}
            <ul className="space-y-2 mb-4">
              {stage.tasks.map((task, i) =>
                task.href ? (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 text-brass text-[13px] mt-0.5 leading-none">→</span>
                    <Link
                      href={task.href}
                      className="text-[13px] text-navy hover:underline leading-snug"
                    >
                      {task.label}
                    </Link>
                  </li>
                ) : (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span className="text-[13px] text-gray-700 leading-snug">{task.label}</span>
                  </li>
                )
              )}
            </ul>

            {/* Calendar note */}
            {stage.calendarNote && (
              <p className="text-[12px] text-gray-500 bg-white border border-stone-200 rounded-xl px-3 py-2.5 mb-4">
                {stage.calendarNote}
              </p>
            )}

            {/* Stage CTA */}
            {stage.ctaHref.startsWith("http") ? (
              <a
                href={stage.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[13px] font-semibold text-navy hover:opacity-70 transition-opacity"
              >
                {stage.ctaLabel}
              </a>
            ) : (
              <Link
                href={stage.ctaHref}
                className="inline-flex items-center text-[13px] font-semibold text-navy hover:opacity-70 transition-opacity"
              >
                {stage.ctaLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* ── Route cards ───────────────────────────────────────────────────── */}
      <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
      <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
        Ваш маршрут
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-12">
        {ROUTES.map((route) => (
          <div
            key={route.title}
            className="border border-stone-200 rounded-2xl p-5 bg-stone-50 flex flex-col"
          >
            <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
              {route.title}
            </h3>
            <p className="text-[13px] text-gray-600 leading-snug mb-4 flex-1">
              {route.description}
            </p>

            {route.links.length > 0 && (
              <ul className="space-y-1.5 mb-4">
                {route.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-navy hover:underline"
                    >
                      → {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {route.ctaHref.startsWith("http") ? (
              <a
                href={route.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
              >
                {route.ctaLabel}
              </a>
            ) : (
              <Link
                href={route.ctaHref}
                className="self-start text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
              >
                {route.ctaLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-sm font-semibold text-white mb-1">
          Есть вопрос по обустройству в Дубае?
        </p>
        <p className="text-[13px] text-white/60 mb-3">
          Напишите нам в WhatsApp — помогаем с визами, открытием компании и первыми шагами.
        </p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brass hover:opacity-75 transition-opacity py-1"
        >
          Написать в Guidex →
        </a>
      </div>

    </div>
  );
}
