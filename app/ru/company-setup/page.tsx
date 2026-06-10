import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import CtaCard from "@/components/CtaCard";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Открыть компанию в Дубае — Guidex Consulting",
  description:
    "Два маршрута: mainland (лицензия DED, торговля по всему ОАЭ) или свободная зона (100% иностранное владение, меньше затрат). Гайды с официальными сборами.",
  alternates: {
    canonical: `${BASE}/ru/company-setup`,
    languages: {
      "en":        `${BASE}/company-setup`,
      "ru":        `${BASE}/ru/company-setup`,
      "x-default": `${BASE}/company-setup`,
    },
  },
};

type Route =
  | { title: string; description: string; meta: string; href: string }
  | { title: string; description: string; meta: string; soon: true };

const routes: Route[] = [
  {
    title: "Регистрация компании Mainland",
    description:
      "Розница, услуги, B2B, госконтракты — любой бизнес, работающий с клиентами в ОАЭ. Лицензия DED. Требует физический офис.",
    meta: "Лицензия DED · Торговля по всему ОАЭ",
    href: "/ru/guides/mainland-company-setup-dubai",
  },
  {
    title: "Регистрация компании в свободной зоне",
    description:
      "Экспорт, digital, удалённый бизнес. 100% иностранное владение. Популярные зоны: IFZA, DMCC, JAFZA.",
    meta: "Лицензия зоны · 100% иностранное владение",
    href: "/ru/guides/free-zone-company-setup-dubai",
  },
  {
    title: "Банковский счёт для бизнеса",
    description:
      "Требуется после регистрации компании. Срок — 2–6 недель, минимальный остаток — AED 25,000–50,000.",
    meta: "Обязателен после лицензии · Шаг 2",
    href: "/ru/guides/open-business-bank-account-dubai",
  },
];

const compareRows = [
  {
    label:    "Продавать клиентам в ОАЭ",
    mainland: "Да — напрямую",
    freezone: "Нет — нужен локальный агент",
  },
  {
    label:    "Иностранное владение",
    mainland: "100% (с 2021)",
    freezone: "100%",
  },
  {
    label:    "Требование к офису",
    mainland: "Физический адрес обязателен",
    freezone: "Flexi-desk доступен",
  },
  {
    label:    "Типичная стоимость",
    mainland: "AED 12,000–25,000+",
    freezone: "AED 6,000–18,000+",
  },
  {
    label:    "Госконтракты",
    mainland: "Да",
    freezone: "Как правило нет",
  },
];

const processSteps = [
  "Выбрать правовую форму и вид деятельности",
  "Зарезервировать торговое наименование",
  "Подать заявку и получить первоначальное одобрение",
  "Подписать и зарегистрировать договор аренды офиса",
  "Оплатить государственные сборы и получить торговую лицензию",
  "Открыть банковский счёт",
  "Оформить инвесторские и рабочие визы",
];

export default function RuCompanySetupHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Регистрация компании", item: `${BASE}/ru/company-setup` },
    ],
  };
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Link
        href="/ru/guides"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Все гайды
      </Link>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category="company-setup" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Открытие компании
        </p>
      </div>

      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Открыть компанию в Дубае
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-6">
        Mainland (лицензия DED, торговля по всему ОАЭ) или свободная зона (100% иностранное владение). Оба маршрута с точными сборами.
      </p>

      <Link
        href="/ru/find-my-visa?flow=company"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Найти свой маршрут</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Mainland, свободная зона или счёт →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      {/* Route cards */}
      <div className="space-y-3 mb-12">
        {routes.map((route) => {
          const cardInner = (
            <>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {route.title}
                </h2>
                {"href" in route ? (
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                    →
                  </span>
                ) : (
                  <span className="flex-shrink-0 text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-1 rounded-full leading-none whitespace-nowrap">
                    Скоро
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {route.description}
              </p>
              <p className="text-[11px] text-gray-400">{route.meta}</p>
            </>
          );
          return "href" in route ? (
            <Link
              key={route.title}
              href={route.href}
              className="block group border border-stone-200 rounded-2xl p-5 bg-stone-50 hover:border-stone-300 hover:bg-stone-100 transition-all"
            >
              {cardInner}
            </Link>
          ) : (
            <div
              key={route.title}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
            >
              {cardInner}
            </div>
          );
        })}
      </div>

      {/* Compare section */}
      <div className="pt-10 border-t border-stone-200">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
          Mainland или свободная зона?
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-2">
          <div />
          <p className="text-[12px] font-semibold text-gray-700 text-center">Mainland</p>
          <p className="text-[12px] font-semibold text-gray-700 text-center">Free zone</p>
        </div>

        <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
          {compareRows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-3 bg-white px-4 py-3.5">
              <p className="text-[12px] text-gray-600 leading-snug">{row.label}</p>
              <p className="text-[12px] font-medium text-gray-800 text-center leading-snug">{row.mainland}</p>
              <p className="text-[12px] font-medium text-gray-800 text-center leading-snug">{row.freezone}</p>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-gray-500 mt-3">
          Клиенты в ОАЭ → mainland. Международный, digital или удалённый бизнес → свободная зона.
        </p>
      </div>

      {/* Process overview */}
      <div className="mt-10 pt-10 border-t border-stone-200">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
          Как выглядит процесс
        </h2>
        <ol className="space-y-3">
          {processSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy/10 text-navy text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-[14px] text-gray-800 leading-snug pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-[12px] text-gray-500 mt-5">
          Банковский счёт (шаг 6) — одинаковый процесс для mainland и свободной зоны.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-12">
        <CtaCard
          heading="Остались вопросы по регистрации?"
          linkLabel="Написать нам →"
          href="/ru/contact"
        />
      </div>

    </div>
  );
}
