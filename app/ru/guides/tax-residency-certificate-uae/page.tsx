import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedGuideBySlug } from "@/lib/db/reader";
import StepCard from "@/components/StepCard";
import { localizeValue } from "@/lib/localize-value";
import { GuideCta } from "@/components/GuideCta";
import type { Metadata } from "next";

const WHATSAPP_HREF = "https://wa.me/971506304817";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SLUG = "tax-residency-certificate-uae";

export const metadata: Metadata = {
  title: "Сертификат налогового резидентства ОАЭ — Guidex Consulting",
  description:
    "Оформление Tax Residency Certificate в ОАЭ через FTA и EmaraTax: проверка кейса, подготовка документов и сопровождение подачи для резидентов, компаний и инвесторов.",
  alternates: {
    canonical: `${BASE}/ru/guides/${SLUG}`,
    languages: {
      "en":        `${BASE}/guides/${SLUG}`,
      "ru":        `${BASE}/ru/guides/${SLUG}`,
      "x-default": `${BASE}/guides/${SLUG}`,
    },
  },
};

const WHY_CARDS = [
  {
    heading: "Маршрут квалификации подтверждается до подачи",
    body: "Существует несколько маршрутов квалификации и типов заявителей. Мы определяем правильный для вашей ситуации до начала работы.",
  },
  {
    heading: "Полное досье с первого раза",
    body: "Неполные заявки задерживают рассмотрение. Мы проверяем каждый документ против требований FTA до отправки.",
  },
  {
    heading: "EmaraTax под нашим управлением",
    body: "При наличии полномочий Guidex ведёт процесс подачи в EmaraTax. Вам не нужно разбираться с порталом самостоятельно.",
  },
];

export default function RuTrcPage() {
  const guide = getPublishedGuideBySlug(SLUG, "ru");
  if (!guide) notFound();

  const overviewParagraphs = guide.overview.split("\n\n").filter(Boolean);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Все гайды", item: `${BASE}/ru/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${BASE}/ru/guides/${SLUG}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/ru/guides/${SLUG}` },
    url: `${BASE}/ru/guides/${SLUG}`,
    inLanguage: "ru",
    dateModified: guide.updatedAt,
    publisher: { "@type": "Organization", name: "Guidex Consulting", url: BASE },
  };

  const howToSchema = guide.steps.length >= 2 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.summary,
    step: guide.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.what,
    })),
  } : null;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-5 pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-5 -mx-1">
        <Link
          href="/ru/guides"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          ← Все гайды
        </Link>
        <Link
          href="/ru/banking-tax"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          Банкинг и налоги
        </Link>
      </div>

      {/* Navy premium header block */}
      <div className="bg-navy rounded-2xl px-5 py-8 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-3">
          Федеральная налоговая служба · EmaraTax
        </p>
        <h1 className="text-[26px] font-bold text-white leading-snug mb-4">
          {guide.title}
        </h1>
        <p className="text-[15px] text-white/80 leading-relaxed mb-5">
          {guide.summary}
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-white/80 leading-snug">Для инвесторов, предпринимателей и резидентов ОАЭ с международными финансовыми связями</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-white/80 leading-snug">Проверяем правильный маршрут квалификации до подачи</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-white/80 leading-snug">Досье подготовлено и проверено Guidex перед отправкой в EmaraTax</span>
          </li>
        </ul>
      </div>

      {/* CTA block */}
      <div className="flex gap-2.5 mb-6">
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={SLUG}
          ctaType="whatsapp"
          locale="ru"
          isExternal
          className="flex-1 text-center text-[13px] font-semibold bg-navy text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Разобрать мой кейс
        </GuideCta>
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={SLUG}
          ctaType="whatsapp"
          locale="ru"
          isExternal
          className="flex-1 text-center text-[13px] font-semibold text-navy border-2 border-navy/20 py-3 rounded-xl hover:border-navy/40 transition-colors"
        >
          Написать в WhatsApp
        </GuideCta>
      </div>

      {/* Two-stat strip */}
      <div className="flex items-center gap-px bg-stone-200 rounded-xl overflow-hidden mb-10">
        <div className="flex-1 bg-stone-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Орган</p>
          <p className="text-[13px] font-semibold text-gray-800 leading-tight">Федеральная налоговая служба</p>
        </div>
        <div className="flex-1 bg-stone-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Процесс</p>
          <p className="text-[13px] font-semibold text-gray-800 leading-tight">Рассматривается после полного досье</p>
        </div>
      </div>

      {/* Why Guidex */}
      <div className="mb-10">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
          Почему клиенты выбирают Guidex для TRC
        </h2>
        <div className="space-y-3">
          {WHY_CARDS.map((c) => (
            <div key={c.heading} className="border border-stone-200 rounded-xl px-4 py-4 bg-stone-50">
              <p className="text-[14px] font-semibold text-gray-900 mb-1.5">{c.heading}</p>
              <p className="text-[13px] text-gray-600 leading-snug">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      {guide.steps.length > 0 && (
        <div className="mb-10" id="steps">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Пошагово
          </h2>
          {guide.steps.map((step) => (
            <StepCard
              key={step.id}
              number={step.stepOrder}
              title={step.title}
              what={step.what}
              where={step.where}
              address={step.address}
              cost={localizeValue(step.cost, "ru")}
              time={localizeValue(step.timeEst, "ru")}
              advice={step.advice}
              warning={step.warning || undefined}
              locale="ru"
            />
          ))}
        </div>
      )}

      {/* Fees and timeline */}
      <div className="mt-10 pt-8 border-t border-stone-100">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Стоимость и сроки
        </h2>
        <p className="text-[14px] text-gray-700 leading-relaxed mb-3">
          Государственные пошлины зависят от типа заявителя и формата сертификата. Guidex уточняет стоимость до подачи.
        </p>
        <p className="text-[14px] text-gray-700 leading-relaxed">
          Рассматривается после подачи полного досье. Guidex консультирует по ожидаемым срокам для вашего кейса.
        </p>
      </div>

      {/* Overview */}
      {overviewParagraphs.length > 0 && (
        <div className="mt-10 pt-8 border-t border-stone-100">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Обзор
          </h2>
          {overviewParagraphs.map((text, i) => (
            <p key={i} className="text-[15px] text-gray-600 leading-relaxed mb-4 last:mb-0">
              {text}
            </p>
          ))}
        </div>
      )}

      {/* Final CTA */}
      <div className="mt-10 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Готовы начать оформление TRC?</p>
        <p className="text-[12px] text-white/60 mb-3">Проверим право на получение, подготовим досье и возьмём на себя процесс с FTA.</p>
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={SLUG}
          ctaType="whatsapp"
          locale="ru"
          isExternal
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Написать в WhatsApp →
        </GuideCta>
      </div>

    </div>
  );
}
