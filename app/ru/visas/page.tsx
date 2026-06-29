import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Визы в Дубае — Guidex Consulting",
  description:
    "Пошаговые руководства по всем основным визам ОАЭ: семейная виза, золотая виза, рабочая виза. Официальные сборы и сроки.",
  alternates: {
    canonical: `${BASE}/ru/visas`,
    languages: {
      "en":        `${BASE}/visas`,
      "ru":        `${BASE}/ru/visas`,
      "x-default": `${BASE}/visas`,
    },
  },
};

const hubs = [
  {
    title: "Семейные визы",
    description: "Виза для супруга или ребёнка. Маршруты изнутри ОАЭ и из-за рубежа.",
    href: "/ru/visas/family",
    meta: "Супруг · Ребёнок",
  },
  {
    title: "Золотая виза",
    description: "10-летнее резидентство без привязки к работодателю. Через недвижимость, бизнес или профессиональный статус.",
    href: "/ru/visas/golden",
    meta: "Гайд по недвижимости готов",
  },
  {
    title: "Рабочая виза — внутри ОАЭ",
    description: "Смена статуса без выезда из ОАЭ. Только для работодателей на материковой части Дубая.",
    href: "/ru/guides/employment-visa",
    meta: "Внутри ОАЭ · AED 4,900–7,300 · 2–4 недели",
  },
  {
    title: "Рабочая виза — из-за рубежа",
    description: "Работодатель запускает процесс в Дубае, пока вы находитесь за границей. Въезд по разрешению после одобрения.",
    href: "/ru/guides/employment-visa-dubai-outside-uae",
    meta: "Из-за рубежа · AED 4,500–7,000 · 4–8 недель",
  },
];

export default function RuVisasHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Визы", item: `${BASE}/ru/visas` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Главная
      </Link>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category="visas" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Визы
        </p>
      </div>

      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Визы в Дубае
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-6">
        Визы резидента ОАЭ делятся на три основных категории: рабочие визы (от работодателя, материк или фризона), семейные визы (спонсирование резидентом ОАЭ) и долгосрочные инвесторские визы (Golden Visa, 10 лет без привязки к работодателю). Каждая категория имеет отдельный процесс, разные государственные органы и собственные сборы.
      </p>

      <Link
        href="/ru/find-my-visa"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Найти свой маршрут</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Ответить на 2–3 вопроса →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      <div className="space-y-3">
        {hubs.map((hub) => (
          <Link key={hub.href} href={hub.href} className="block group">
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {hub.title}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {hub.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {hub.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Не знаете, какой визовый маршрут вам подходит?</p>
        <p className="text-[12px] text-white/60 mb-3">Разберём вашу ситуацию и определим правильный маршрут до начала процесса.</p>
        <a
          href="https://wa.me/971506304817"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Написать в WhatsApp →
        </a>
      </div>
    </div>
  );
}
