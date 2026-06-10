import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Государственные услуги в Дубае — Guidex Consulting",
  description:
    "Аттестация документов, Amer, PRO услуги и другие процедуры для виз, компаний и официальных заявок в ОАЭ.",
  alternates: {
    canonical: `${BASE}/ru/government`,
    languages: {
      "en":        `${BASE}/government`,
      "ru":        `${BASE}/ru/government`,
      "x-default": `${BASE}/government`,
    },
  },
};

type GuideCard =
  | { title: string; description: string; meta: string; href: string }
  | { title: string; description: string; meta: string; soon: true };

const guides: GuideCard[] = [
  {
    title: "Аттестация документов",
    description:
      "MOFA, консульская легализация, переводы и подготовка документов для ОАЭ.",
    meta: "Документы · MOFA",
    href: "/ru/guides/document-attestation-dubai",
  },
  {
    title: "Amer Services",
    description:
      "Визовые заявки, Emirates ID, изменение статуса и резидентские процедуры через Amer.",
    meta: "Визы · Emirates ID",
    href: "/ru/guides/amer-center-dubai",
  },
  {
    title: "PRO услуги",
    description:
      "Сопровождение заявок, государственных процедур и документов для частных лиц и компаний.",
    meta: "PRO · Госуслуги",
    href: "/ru/guides/pro-services-dubai",
  },
];

export default function RuGovernmentHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Госуслуги", item: `${BASE}/ru/government` },
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
          <CategoryIcon category="government" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Госуслуги
        </p>
      </div>

      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Государственные услуги в Дубае
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-8">
        Аттестация документов, Amer, PRO услуги и другие процедуры для виз, компаний и официальных заявок в ОАЭ.
      </p>

      <div className="space-y-3">
        {guides.map((g) =>
          "soon" in g ? (
            <div
              key={g.title}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-400 leading-snug">
                  {g.title}
                </h2>
                <span className="flex-shrink-0 text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-1 rounded-full leading-none whitespace-nowrap mt-0.5">
                  Скоро
                </span>
              </div>
              <p className="text-[13px] text-gray-400 leading-snug mb-3">
                {g.description}
              </p>
              <span className="inline-block text-[11px] text-gray-400 bg-stone-100 px-2.5 py-1 rounded-full">
                {g.meta}
              </span>
            </div>
          ) : (
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
          )
        )}
      </div>

      <div className="mt-8 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Нужна помощь с госуслугами?</p>
        <p className="text-[12px] text-white/60 mb-3">Помогаем с аттестацией, подачей в GDRFA и государственными заявками.</p>
        <a
          href="https://wa.me/971506304817"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Получить консультацию →
        </a>
      </div>

    </div>
  );
}
