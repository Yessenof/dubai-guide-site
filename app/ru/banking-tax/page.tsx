import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Банкинг и налоги в Дубае — Guidex Consulting",
  description:
    "Сертификат налогового резидентства ОАЭ и корпоративный банковский счёт для резидентов, инвесторов и компаний с международными требованиями к отчётности.",
  alternates: {
    canonical: `${BASE}/ru/banking-tax`,
    languages: {
      "en":        `${BASE}/banking-tax`,
      "ru":        `${BASE}/ru/banking-tax`,
      "x-default": `${BASE}/banking-tax`,
    },
  },
};

const services = [
  {
    title: "Сертификат налогового резидентства ОАЭ",
    description:
      "Подтверждение налогового резидентства для иностранных банков, налоговых органов и международных деклараций о доходах. Выдаётся Федеральной налоговой службой через EmaraTax.",
    href: "/ru/guides/tax-residency-certificate-uae",
    meta: "FTA · EmaraTax",
  },
  {
    title: "Корпоративный банковский счёт",
    description:
      "Открытие счёта для компаний mainland и free zone. Требуется после регистрации. Guidex готовит досье и подбирает подходящий банк.",
    href: "/ru/guides/open-business-bank-account-dubai",
    meta: "Обязателен после регистрации",
  },
];

export default function RuBankingTaxHubPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        Главная
      </Link>

      <PageHero
        asset={{
          src: "/images/hubs/difc-business-bay-glass-towers.webp",
          alt: "Glass tower facades in Dubai's Business Bay financial district",
          tone: "cool",
        }}
        gradientStyle="medium"
        overline="Банкинг и налоги"
        heading="Банкинг и налоги в Дубае"
        subtext="Для резидентов, инвесторов и компаний с международными банковскими или налоговыми требованиями."
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
            <span className="text-[14px] text-gray-700 leading-snug">Инвесторы и предприниматели с международными доходами или активами</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Резиденты ОАЭ, которым нужно подтвердить налоговое резидентство для иностранного банка или налогового органа</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Компании, открывающие корпоративный счёт после получения лицензии</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Компании free zone и mainland с обязательствами по международной отчётности</span>
          </li>
        </ul>
      </div>

      <div className="pt-8 border-t border-stone-100 mb-10">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Как помогает Guidex
        </h2>
        <p className="text-[14px] text-gray-700 leading-snug mb-3">
          Мы изучаем ситуацию до подачи заявки, определяем правильный маршрут и готовим досье. При наличии полномочий ведём процесс с уполномоченным органом от вашего имени.
        </p>
        <p className="text-[14px] text-gray-600 leading-snug">
          Не уверены, какой документ нужен? Начните с бесплатного разбора ситуации.
        </p>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Не знаете, с чего начать?</p>
        <p className="text-[12px] text-white/60 mb-3">Разберём ситуацию и определим нужный документ и маршрут для вашего случая.</p>
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
