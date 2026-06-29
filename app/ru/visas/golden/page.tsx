import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import SourceNote from "@/components/SourceNote";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Золотая виза ОАЭ — Guidex Consulting",
  description:
    "Golden Visa ОАЭ даёт 10-летнее резидентство без привязки к работодателю. Маршрут через недвижимость от AED 2 млн, зарегистрированную в DLD. Также доступны профессиональный, инвесторский маршруты и маршрут для талантов.",
  alternates: {
    canonical: `${BASE}/ru/visas/golden`,
    languages: {
      "en":        `${BASE}/visas/golden`,
      "ru":        `${BASE}/ru/visas/golden`,
      "x-default": `${BASE}/visas/golden`,
    },
  },
};

const liveGuides = [
  {
    title: "Золотая виза через недвижимость",
    description:
      "Готовая недвижимость стоимостью от AED 2 млн. Подача через ICA, медосмотр, Emirates ID, официальные сборы.",
    href: "/ru/guides/golden-visa-dubai-property",
    meta: "Недвижимость от AED 2 млн · 10-летняя виза",
  },
];

const advisorRoutes = [
  {
    title: "Профессиональный / старший специалист",
    description: "На основе зарплаты, профессии или квалификации. Обычно требуется определённый уровень дохода или признанная специальность.",
    meta: "На основе зарплаты · 10-летняя виза",
    waText: "Golden Visa — Professional route",
  },
  {
    title: "Бизнес-инвестор",
    description: "Для владельцев компаний или партнёров с квалифицированными инвестициями в лицензированный бизнес ОАЭ.",
    meta: "Инвестиционный маршрут · 10-летняя виза",
    waText: "Golden Visa — Business investor route",
  },
  {
    title: "Выдающийся талант",
    description: "Для деятелей искусства, спортсменов, учёных и отличников, номинированных утверждёнными органами ОАЭ.",
    meta: "Требуется номинация · 10-летняя виза",
    waText: "Golden Visa — Special talent route",
  },
];

export default function RuGoldenVisaHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Визы", item: `${BASE}/ru/visas` },
      { "@type": "ListItem", position: 3, name: "Золотая виза", item: `${BASE}/ru/visas/golden` },
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
        Золотая виза ОАЭ
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-4">
        Golden Visa ОАЭ даёт 10-летнее резидентство без привязки к работодателю. Маршрут через недвижимость открыт для владельцев freehold-объектов, зарегистрированных в DLD на сумму от AED 2 000 000. Профессиональный, инвесторский маршруты и маршрут для выдающихся талантов имеют отдельные критерии ICA.
      </p>

      <div className="mb-6">
        <SourceNote
          status="confirmed"
          note="Маршруты и пороговые значения Golden Visa основаны на официальных данных ICA и GDRFA. Инвестиционные категории и минимальные суммы периодически пересматриваются."
          sourceLabel="ICA · GDRFA · DLD"
          lastChecked="Проверено май 2026"
        />
      </div>

      <Link
        href="/ru/find-my-visa?flow=golden"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Найти маршрут золотой визы</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Ответить на 1–2 вопроса →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      {/* Live guide */}
      <div className="space-y-3 mb-6">
        {liveGuides.map((g) => (
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

      {/* Advisor routes */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Спросить об этих маршрутах
      </p>
      <div className="space-y-3 mb-8">
        {advisorRoutes.map((r) => (
          <a
            key={r.title}
            href={`${WHATSAPP_HREF}?text=${encodeURIComponent(`Hi, I'm interested in the ${r.waText}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-50 transition-all">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {r.title}
                </h2>
                <span className="text-[10px] font-semibold text-white bg-navy/70 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 uppercase tracking-wide">
                  WhatsApp
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {r.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {r.meta}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer CTA */}
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between w-full bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-gray-700 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold">Не знаете, какой маршрут подходит?</p>
          <p className="text-xs text-gray-400 mt-0.5">Опишите ситуацию в WhatsApp</p>
        </div>
        <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-lg">→</span>
      </a>
    </div>
  );
}
