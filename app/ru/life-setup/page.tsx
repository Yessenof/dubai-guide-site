import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WA   = "https://wa.me/971506304817";
const IMG  = "/images/hubs/jlt-dubai-towers-sunset-reflection.webp";

export const metadata: Metadata = {
  title: "Переезд в Дубай — первые шаги и план действий | Guidex",
  description:
    "Что подготовить до прилёта, что сделать в первую неделю, первый месяц и каждый год. Визы, компании, Ejari, семья и недвижимость — в правильном порядке.",
  robots: { index: true, follow: true },
  openGraph: {
    title:       "Переезд в Дубай — первые шаги и план действий | Guidex",
    description: "Что подготовить до прилёта, что сделать в первую неделю, первый месяц и каждый год. Визы, компании, Ejari, семья и недвижимость — в правильном порядке.",
    url:         `${BASE}/ru/life-setup`,
    siteName:    "Guidex Consulting",
    locale:      "ru_RU",
    type:        "website",
  },
  twitter: { card: "summary" },
  alternates: {
    canonical: `${BASE}/ru/life-setup`,
    languages: {
      en:          `${BASE}/life-setup`,
      ru:          `${BASE}/ru/life-setup`,
      "x-default": `${BASE}/life-setup`,
    },
  },
};

type Task = { label: string; href?: string };

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
      "Определитесь с визой, начните апостилирование документов, изучите школы и требования к ввозу питомцев. Большинство официальных шагов — уже после приезда, но эти нельзя откладывать.",
    tasks: [
      { label: "Выберите визовый маршрут: рабочая, инвесторская, золотая или самоспонсируемая виза", href: "/ru/guides/employment-visa" },
      { label: "Заверьте иностранные документы: диплом, свидетельство о браке, свидетельство о рождении", href: "/ru/guides/document-attestation-dubai" },
      { label: "Изучите разницу между mainland и free zone, если планируете открыть компанию", href: "/ru/guides/mainland-company-setup-dubai" },
      { label: "Выберите школу, если едете с детьми — ознакомьтесь с базой KHDA по частным школам Дубая" },
      { label: "Уточните требования MOCCAE к ввозу питомца — начните не позднее чем за 3 месяца до перелёта" },
    ],
    ctaLabel: "Написать о вашем визовом маршруте →",
    ctaHref:  WA,
  },
  {
    id:        "pervye-7-dnej",
    num:       "2",
    timeframe: "Первые 7 дней",
    heading:   "Первая неделя",
    summary:
      "Проверьте въездной штамп, оформите SIM-карту, подключите DEWA и запишитесь на биометрию Emirates ID. Эти четыре шага открывают всё остальное.",
    tasks: [
      { label: "Проверьте тип и срок действия въездного штампа в аэропорту или порту въезда" },
      { label: "Оформите SIM-карту — e& (Etisalat) или du, в любом торговом центре или в аэропорту" },
      { label: "Подключите DEWA — электричество и вода по адресу вашего жилья" },
      { label: "Запишитесь на биометрию Emirates ID в центре Amer или в офисе ICA", href: "/ru/guides/amer-center-dubai" },
      { label: "Откройте личный банковский счёт — требования у банков разные, записывайтесь заранее" },
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
      "Зарегистрируйте Ejari в течение 30 дней после заселения, получите Emirates ID и оформите медицинскую страховку. Если открываете бизнес — зарегистрируйтесь в MoHRE и настройте WPS.",
    tasks: [
      { label: "Зарегистрируйте Ejari — обязательно в течение 30 дней с даты въезда (Земельный департамент Дубая)" },
      { label: "Получите и проверьте карту Emirates ID (ICP — icp.gov.ae)" },
      { label: "Оформите обязательную медицинскую страховку — требование Управления здравоохранения Дубая" },
      { label: "Откройте корпоративный банковский счёт при наличии лицензии компании", href: "/ru/guides/open-business-bank-account-dubai" },
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
      "Первые дедлайны по соответствию: порог НДС, Corporate Tax, обмен водительского удостоверения и визы для членов семьи.",
    tasks: [
      { label: "Следите за порогом регистрации по НДС (Федеральное налоговое ведомство — federal.ae)" },
      { label: "Зарегистрируйтесь по Corporate Tax в Федеральном налоговом ведомстве (FTA)" },
      { label: "Обменяйте водительское удостоверение, если ваша страна входит в список RTA Дубая" },
      { label: "Подайте на визы для членов семьи, если ещё не сделали этого", href: "/ru/guides/spouse-dependent-visa-dubai-inside-country" },
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
      "Продлевайте визу и Emirates ID до истечения срока, торговую лицензию — за 30–60 дней до окончания, декларацию по Corporate Tax — в течение 9 месяцев после завершения налогового периода.",
    tasks: [
      { label: "Продление визы — начните не позднее чем за 60 дней до истечения (GDRFA или центр Amer)", href: "/ru/guides/amer-center-dubai" },
      { label: "Продление Emirates ID — привязано к продлению визы (ICP — icp.gov.ae)" },
      { label: "Продление торговой лицензии — за 30–60 дней до окончания (DED или ваша свободная зона)" },
      { label: "Декларация по Corporate Tax — в течение 9 месяцев после завершения налогового периода (FTA)" },
      { label: "Продление Ejari — до начала нового срока аренды (Земельный департамент Дубая)" },
      { label: "Продление разрешения DET на посуточную аренду — ежегодно с даты выдачи", href: "/ru/guides/holiday-home-permit-dubai" },
      { label: "Проверка соответствия Emiratisation — июнь и декабрь", href: "/ru/calendar/uae-emiratisation-june-30-2026-reminder" },
    ],
    calendarNote: "Следите за дедлайнами и праздниками в Календаре ОАЭ.",
    ctaLabel: "Открыть Календарь ОАЭ →",
    ctaHref:  "/ru/calendar",
  },
];

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
      { label: "Виза для ребёнка",          href: "/ru/guides/child-dependent-visa-dubai-outside-country" },
      { label: "Виза для супруга / супруги", href: "/ru/guides/spouse-dependent-visa-dubai-outside-country" },
      { label: "Продление семейной визы",    href: "/ru/guides/renew-family-visa-dubai" },
    ],
    ctaLabel: "Написать о переезде с семьёй →",
    ctaHref:  WA,
  },
  {
    title:       "Бизнес-владелец",
    description: "Предпринимателям предстоит регистрация компании, банковский счёт, оформление в MoHRE и обязательства по НДС и Corporate Tax — всё в первые 30 дней.",
    links: [
      { label: "Mainland-компания",   href: "/ru/guides/mainland-company-setup-dubai" },
      { label: "Компания во free zone", href: "/ru/guides/free-zone-company-setup-dubai" },
      { label: "Корпоративный счёт",   href: "/ru/guides/open-business-bank-account-dubai" },
      { label: "PRO-сервисы",          href: "/ru/guides/pro-services-dubai" },
    ],
    ctaLabel: "Написать об открытии бизнеса →",
    ctaHref:  WA,
  },
  {
    title:       "Владелец недвижимости",
    description: "Арендодатель обязан зарегистрировать Ejari до начала аренды и проверить индекс аренды перед продлением договора. Посуточная аренда требует разрешения DET.",
    links: [
      { label: "Разрешение DET на посуточную аренду", href: "/ru/guides/holiday-home-permit-dubai" },
    ],
    ctaLabel: "Написать о соответствии требованиям →",
    ctaHref:  WA,
  },
  {
    title:       "С питомцем",
    description: "MOCCAE требует справку о здоровье, прививку от бешенства и чип до ввоза питомца в ОАЭ. На оформление уходит от 3 месяцев.",
    links: [],
    ctaLabel: "Написать о ввозе питомца →",
    ctaHref:  WA,
  },
  {
    title:       "Посуточная аренда",
    description: "Для законного размещения квартиры на Airbnb или Booking.com в Дубае нужно разрешение DET Holiday Homes. Актуальные требования — на портале DET.",
    links: [
      { label: "Гайд: разрешение DET", href: "/ru/guides/holiday-home-permit-dubai" },
    ],
    ctaLabel: "Читать гайд →",
    ctaHref:  "/ru/guides/holiday-home-permit-dubai",
  },
  {
    title:       "Инвестор",
    description: "Готовая недвижимость стоимостью от 2 000 000 дирхамов может дать право на Golden Visa сроком на 10 лет. Подробные условия — в гайде.",
    links: [
      { label: "Золотая виза через недвижимость", href: "/ru/guides/golden-visa-dubai-property" },
      { label: "Сертификат налогового резидента", href: "/ru/guides/tax-residency-certificate-uae" },
    ],
    ctaLabel: "Читать гайд о золотой визе →",
    ctaHref:  "/ru/guides/golden-visa-dubai-property",
  },
  {
    title:       "Продление для резидентов",
    description: "Виза, Emirates ID или торговая лицензия истекает в течение 60 дней? Начните продление сейчас — не откладывайте до последней недели.",
    links: [
      { label: "Продление семейной визы",      href: "/ru/guides/renew-family-visa-dubai" },
      { label: "Центры Amer — как это работает", href: "/ru/guides/amer-center-dubai" },
    ],
    ctaLabel: "Написать о продлении →",
    ctaHref:  WA,
  },
];

export default function LifeSetupRuPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-12">

      {/* Back */}
      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-2"
      >
        ← На главную
      </Link>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-8 h-[268px] sm:h-[330px]">
        <Image
          src={IMG}
          alt="Башни Дубая на закате — переезд и первые шаги"
          fill
          className="object-cover"
          sizes="(max-width: 672px) calc(100vw - 40px), 632px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-2">
            Переезд и первые шаги
          </p>
          <h1
            className="text-[24px] sm:text-[28px] font-bold text-white leading-snug mb-2"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
          >
            Переезд и первые шаги в Дубае
          </h1>
          <p className="text-[13px] text-white/75 leading-snug mb-5 max-w-sm">
            Короткий план: что подготовить до прилёта, что сделать в первую неделю и что не забыть позже.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#plan"
              className="text-[13px] font-semibold bg-white text-navy px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Начать с плана
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-white border border-white/35 px-4 py-2 rounded-xl hover:border-white/65 transition-colors"
            >
              Написать в Guidex →
            </a>
          </div>
        </div>
      </div>

      {/* ── Первый экран / SEO-ответ ─────────────────────────────────────────── */}
      <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
        Этот раздел помогает заранее понять, что подготовить до прилёта, какие шаги закрыть
        в первую неделю, что проверить в первый месяц и какие напоминания поставить на будущее.
        Каждый этап ведёт к актуальным официальным гайдам.
      </p>

      {/* ── План действий ────────────────────────────────────────────────────── */}
      <div id="plan">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-3" />
        <h2 className="text-[20px] font-bold text-gray-900 mb-1">
          Ваш план действий
        </h2>
        <p className="text-[13px] text-gray-500 mb-6">
          Пять этапов — от подготовки до прилёта до ежегодных обязательств.
        </p>

        <div className="space-y-4 mb-14">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center">
                  {stage.num}
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  {stage.timeframe}
                </p>
              </div>

              <h3 className="text-[17px] font-bold text-gray-900 mb-2">
                {stage.heading}
              </h3>

              <p className="text-[13px] text-gray-600 leading-snug mb-4">
                {stage.summary}
              </p>

              <ul className="space-y-2 mb-4">
                {stage.tasks.map((task, i) =>
                  task.href ? (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-brass text-[13px] mt-0.5 leading-none">→</span>
                      <Link
                        href={task.href}
                        className="text-[13px] text-brass font-medium underline underline-offset-2 decoration-brass/30 hover:decoration-brass leading-snug transition-colors"
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

              {stage.calendarNote && (
                <p className="text-[12px] text-gray-500 bg-white border border-stone-200 rounded-xl px-3 py-2.5 mb-4">
                  {stage.calendarNote}
                </p>
              )}

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
      </div>

      {/* ── Маршруты ─────────────────────────────────────────────────────────── */}
      <div id="marshrut">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-3" />
        <h2 className="text-[20px] font-bold text-gray-900 mb-1">
          Ваш маршрут
        </h2>
        <p className="text-[13px] text-gray-500 mb-6">
          Выберите ситуацию, которая описывает вас.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-14">
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
                        className="text-[13px] text-brass font-medium underline underline-offset-2 decoration-brass/30 hover:decoration-brass transition-colors"
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
      </div>

      {/* ── Нижний CTA ───────────────────────────────────────────────────────── */}
      <div className="bg-navy rounded-2xl px-6 py-6">
        <p className="text-[16px] font-bold text-white mb-1">
          Есть вопрос по переезду в Дубай?
        </p>
        <p className="text-[13px] text-white/60 mb-4">
          Напишите нам в WhatsApp — помогаем с визами, открытием компании и первыми шагами.
        </p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brass hover:opacity-75 transition-opacity"
        >
          Написать в Guidex →
        </a>
      </div>

    </div>
  );
}
