import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Календарь праздников ОАЭ — Guidex Consulting",
  description:
    "Государственные праздники ОАЭ, Рамадан, школьные каникулы и ключевые даты для резидентов и бизнеса. Официальный календарь на 2025–2026 год.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/ru/calendar`,
  },
};

const placeholderCards = [
  { title: "Государственные праздники ОАЭ", meta: "2025–2026" },
  { title: "Этот месяц", meta: "Ключевые даты" },
  { title: "Рамадан и Ид", meta: "Зависит от лунного наблюдения" },
  { title: "Школьные каникулы", meta: "Календарь KHDA" },
];

export default function RuCalendarPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Главная
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Календарь ОАЭ
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Праздники и важные даты ОАЭ
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-7">
        Официальные праздники, Рамадан, школьные каникулы и ключевые сроки для резидентов и компаний.
      </p>

      <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3.5 mb-7">
        <p className="text-[12px] text-amber-800 leading-snug">
          Даты исламских праздников (Ид аль-Фитр, Ид аль-Адха, Рамадан) зависят от официального решения властей ОАЭ по наблюдению луны и могут быть изменены. Предварительные даты следует считать ориентировочными до официального подтверждения.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {placeholderCards.map((card) => (
          <div
            key={card.title}
            className="border border-stone-200 rounded-2xl p-5 bg-stone-50 opacity-60"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-[15px] font-semibold text-gray-700 leading-snug">
                {card.title}
              </h2>
              <span className="text-stone-300 text-xs font-medium bg-stone-200 px-2 py-1 rounded-full leading-none whitespace-nowrap">
                Скоро
              </span>
            </div>
            <span className="inline-block text-[11px] text-brass/60 bg-brass/[.06] px-2.5 py-1 rounded-full">
              {card.meta}
            </span>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-stone-200 rounded-2xl px-5 py-6 text-center mb-8">
        <p className="text-[13px] text-gray-400 leading-snug">
          Страницы календаря готовятся. Полные списки праздников и сводки по месяцам появятся здесь.
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <Link
          href="/ru/events"
          className="flex-1 flex items-center justify-between px-4 py-3.5 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          <span className="text-[14px] font-semibold text-gray-900 leading-tight">События</span>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
        </Link>
        <Link
          href="/ru/news"
          className="flex-1 flex items-center justify-between px-4 py-3.5 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          <span className="text-[14px] font-semibold text-gray-900 leading-tight">Обновления</span>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
        </Link>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Планируете с учётом праздника или дедлайна?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          Помогаем с расчётом сроков продления виз, подачей корпоративных заявок и разрешений.
        </p>
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
