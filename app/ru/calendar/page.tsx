import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedCalendarPages } from "@/lib/db/news-events-calendar";

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

const MONTH_NAMES_RU = [
  "", "янв", "фев", "мар", "апр", "май", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

const TYPE_LABELS_RU: Record<string, string> = {
  monthly:         "Ежемесячный",
  yearly:          "Годовой",
  holidays:        "Праздники",
  important_dates: "Важные даты",
  ramadan:         "Рамадан",
};

export default async function RuCalendarPage() {
  const pages = getPublishedCalendarPages("ru");

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Главная
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        Календарь ОАЭ
      </p>
      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-2">
        Праздники и важные даты ОАЭ
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        Официальные праздники, Рамадан, школьные каникулы и ключевые сроки для резидентов и компаний.
      </p>

      <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-[12px] text-amber-800 leading-snug">
          Даты исламских праздников (Ид аль-Фитр, Ид аль-Адха, Рамадан) зависят от официального решения
          властей ОАЭ по наблюдению луны и могут быть изменены. Предварительные даты следует считать
          ориентировочными до официального подтверждения.
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="border border-dashed border-stone-200 rounded-xl px-4 py-4 text-center mb-4">
          <p className="text-[12px] text-gray-400 leading-snug">
            Страницы календаря готовятся. Полные списки праздников и сводки по месяцам появятся здесь.
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5 mb-4">
          {pages.map((page) => {
            const monthName = page.month ? MONTH_NAMES_RU[page.month] ?? String(page.month) : null;
            const periodLabel = monthName ? `${page.year} · ${monthName}` : `${page.year}`;
            const typeLabel = TYPE_LABELS_RU[page.calendarType] ?? page.calendarType;
            const dateCount = page.dates.length;
            return (
              <li key={page.slug}>
                <Link
                  href={`/ru/calendar/${page.slug}`}
                  className="flex items-start justify-between gap-3 border border-stone-100 rounded-xl px-3 py-2.5 bg-stone-50/50 hover:border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-brass">
                        {typeLabel}
                      </span>
                      <span className="text-gray-300 text-[10px]">·</span>
                      <span className="text-[11px] text-gray-400">{periodLabel}</span>
                      {page.hasIslamicDates === 1 && (
                        <>
                          <span className="text-gray-300 text-[10px]">·</span>
                          <span className="text-[10px] text-amber-600">исламские даты</span>
                        </>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                      {page.title}
                    </p>
                    {page.summary && (
                      <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                        {page.summary}
                      </p>
                    )}
                    {dateCount > 0 && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        {dateCount} {dateCount === 1 ? "дата" : dateCount < 5 ? "даты" : "дат"}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0 mt-0.5">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex gap-2.5 mb-5">
        <Link
          href="/ru/events"
          className="flex-1 flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          <span className="text-[13px] font-semibold text-gray-800 leading-tight">События</span>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
        </Link>
        <Link
          href="/ru/news"
          className="flex-1 flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          <span className="text-[13px] font-semibold text-gray-800 leading-tight">Обновления</span>
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
