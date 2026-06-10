import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Туризм и Holiday Homes в Дубае — Guidex Consulting",
  description:
    "Разрешение holiday home и краткосрочная аренда в Дубае: регистрация DTCM, оформление лицензии и соответствие требованиям для Airbnb и Booking.com.",
  alternates: {
    canonical: `${BASE}/ru/tourism`,
    languages: {
      "en":        `${BASE}/tourism`,
      "ru":        `${BASE}/ru/tourism`,
      "x-default": `${BASE}/tourism`,
    },
  },
};

const services = [
  {
    title: "Разрешение Holiday Home",
    description:
      "Зарегистрируйте объект для краткосрочной аренды через DTCM. Обязательно до размещения на любой платформе, включая Airbnb и Booking.com.",
    href: "/ru/guides/holiday-home-permit-dubai",
    meta: "DTCM · Краткосрочная аренда",
  },
];

export default function RuTourismHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Туризм и аренда", item: `${BASE}/ru/tourism` },
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
        Главная
      </Link>

      <PageHero
        asset={{
          src: "/images/hubs/jlt-dubai-towers-sunset-reflection.webp",
          alt: "JLT residential towers in Dubai at sunset with water reflection",
          tone: "warm",
        }}
        gradientStyle="warm-light"
        overline="Туризм и аренда"
        heading="Туризм и Holiday Homes в Дубае"
        subtext="Разрешения, лицензии и соответствие требованиям для владельцев недвижимости и операторов краткосрочной аренды."
      />

      <div className="space-y-3 mb-10">
        {services.map((s) => (
          <Link key={s.href} href={s.href} className="block group">
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {s.title}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {s.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {s.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-8 border-t border-stone-100 mb-8">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Кому это нужно
        </h2>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Владельцы недвижимости, размещающие объекты на Airbnb, Booking.com и других платформах</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Инвесторы, формирующие портфель краткосрочной аренды в Дубае</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Владельцы с действующим разрешением, которым нужно продление или обновление</span>
          </li>
        </ul>
      </div>

      <div className="pt-8 border-t border-stone-100 mb-10">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Как помогает Guidex
        </h2>
        <p className="text-[14px] text-gray-700 leading-snug mb-3">
          Мы сопровождаем регистрацию в DTCM, готовим документы и оформляем продление. Для новых операторов определяем правильный тип разрешения до начала процесса.
        </p>
        <p className="text-[13px] text-gray-500 leading-snug">
          Гайды по продлению holiday home, краткосрочной аренде и туристическим лицензиям добавляются.
        </p>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Оформляете первый holiday home?</p>
        <p className="text-[12px] text-white/60 mb-3">Возьмём разрешение DTCM и поможем правильно оформить объект.</p>
        <a
          href={WHATSAPP_HREF}
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
