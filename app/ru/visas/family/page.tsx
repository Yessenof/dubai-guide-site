import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import SourceNote from "@/components/SourceNote";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Семейные визы в Дубае — Guidex Consulting",
  description:
    "Оформите визу для супруга или ребёнка в Дубае. Маршруты изнутри ОАЭ и из-за рубежа с официальными сборами и сроками.",
  alternates: {
    canonical: `${BASE}/ru/visas/family`,
    languages: {
      "en":        `${BASE}/visas/family`,
      "ru":        `${BASE}/ru/visas/family`,
      "x-default": `${BASE}/visas/family`,
    },
  },
};

const guides = [
  {
    title: "Виза для супруга в Дубае",
    description: "Изнутри ОАЭ или из-за рубежа. Подача через GDRFA и Amer, медосмотр, Emirates ID.",
    href: "/ru/guides/spouse-dependent-visa-dubai",
    meta: "Внутри или снаружи ОАЭ",
  },
  {
    title: "Виза для ребёнка в Дубае",
    description: "Изнутри ОАЭ или из-за рубежа. Подача через GDRFA и Amer, медосмотр, Emirates ID.",
    href: "/ru/guides/child-dependent-visa-dubai",
    meta: "Внутри или снаружи ОАЭ",
  },
  {
    title: "Виза для родителей в Дубае",
    description: "Как спонсировать маму или папу. Чеклист AMER: аттестация документов, Ejari, зарплата, медосмотр, Emirates ID.",
    href: "/ru/guides/parents-visa-dubai",
    meta: "Спонсирование родителей · Внутри или снаружи ОАЭ",
  },
  {
    title: "Виза для новорождённого в Дубае",
    description: "Резидентская виза для ребёнка, рождённого в Дубае. Регистрация DHA, консульство, оформление через Amer.",
    href: "/ru/guides/newborn-visa-dubai",
    meta: "Рождённые в Дубае · AED 900–1 500",
  },
  {
    title: "Продление семейной визы в Дубае",
    description: "Продление визы для супруга или ребёнка. Медосмотр для лиц от 18 лет. Сборы подтверждаются в Amer.",
    href: "/ru/guides/renew-family-visa-dubai",
    meta: "Продление · Внутри ОАЭ",
  },
];

export default function RuFamilyVisaHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Визы", item: `${BASE}/ru/visas` },
      { "@type": "ListItem", position: 3, name: "Семейные визы", item: `${BASE}/ru/visas/family` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Link
        href="/ru/visas"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Визы
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
        Семейные визы в Дубае
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-4">
        Виза для супруга или ребёнка в Дубае. Спонсор должен иметь действующую резидентскую визу ОАЭ и подписанный договор аренды Ejari. Свидетельства о браке и рождении должны пройти аттестацию MOFA ОАЭ до подачи через Amer. Требования к доходу подтверждаются в GDRFA при подаче.
      </p>

      <div className="mb-6">
        <SourceNote
          status="confirmed"
          note="Информация основана на официальных правилах ICA и GDRFA. Требования к документам могут изменяться. Уточняйте актуальные условия у PRO или в GDRFA перед подачей."
          sourceLabel="ICA · GDRFA Dubai"
          lastChecked="Проверено май 2026"
        />
      </div>

      <Link
        href="/ru/find-my-visa?flow=family-new"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Найти маршрут семейной визы</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Супруг или ребёнок · внутри или снаружи ОАЭ →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      <div className="space-y-3">
        {guides.map((g) => (
          <Link key={g.href} href={g.href} className="block group">
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {g.title}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {g.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {g.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
