import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/db/news-events-calendar";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Важные даты и события ОАЭ — Guidex Consulting",
  description:
    "Государственные праздники, важные сроки и ключевые даты для резидентов, инвесторов и предпринимателей в ОАЭ.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/ru/events`,
  },
};

const CONFIDENCE_BADGE_RU: Partial<Record<string, string>> = {
  expected:                        "ориентировочно",
  subject_to_official_confirmation: "ожидает подтверждения",
};

const CATEGORY_LABELS_RU: Record<string, string> = {
  holiday:       "Праздник",
  deadline:      "Срок",
  festival:      "Фестиваль",
  government:    "Госмероприятие",
  school:        "Школьные каникулы",
  "dubai-event": "Событие Дубая",
};

const categories = [
  "Праздники",
  "Важные даты",
  "Сроки",
  "События Дубая",
];

export default async function RuEventsPage() {
  const events = getPublishedEvents("ru");

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Главная
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        События ОАЭ
      </p>
      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-2">
        Важные даты и события ОАЭ
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        Государственные праздники, важные сроки и ключевые даты для резидентов, инвесторов и предпринимателей.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((chip) => (
          <span
            key={chip}
            className="inline-block text-[11px] text-gray-500 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full"
          >
            {chip}
          </span>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="border border-dashed border-stone-200 rounded-xl px-4 py-4 text-center mb-4">
          <p className="text-[12px] text-gray-400 leading-snug">
            Ключевые даты ОАЭ добавляются. Государственные праздники и важные сроки появятся здесь. Смотрите также календарь.
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5 mb-4">
          {events.map((event) => {
            const isSingleDay =
              !event.eventDateEnd || event.eventDateStart === event.eventDateEnd;
            const dateLabel = isSingleDay
              ? event.eventDateStart
              : `${event.eventDateStart} – ${event.eventDateEnd}`;
            const confidenceBadge = CONFIDENCE_BADGE_RU[event.dateConfidence];
            const catLabel =
              CATEGORY_LABELS_RU[event.category] ??
              (event.category.charAt(0).toUpperCase() + event.category.slice(1).replace(/-/g, " "));
            return (
              <li key={event.slug}>
                <Link
                  href={`/ru/events/${event.slug}`}
                  className="flex items-start gap-3 border border-stone-100 rounded-xl px-3 py-2.5 bg-stone-50/50 hover:border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  <span className="flex-shrink-0 text-[12px] font-medium text-gray-500 tabular-nums w-[88px] pt-0.5 leading-snug">
                    {dateLabel}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                      {event.title}
                      {confidenceBadge && (
                        <span className="ml-1.5 text-[10px] font-normal text-amber-600">
                          ({confidenceBadge})
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{catLabel}</p>
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0 mt-0.5">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/ru/calendar"
        className="flex items-center justify-between w-full mb-4 px-4 py-3 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
      >
        <div>
          <p className="text-[14px] font-semibold text-gray-900 leading-tight">Календарь ОАЭ</p>
          <p className="text-[12px] text-gray-500 leading-tight mt-0.5">Праздники и даты по месяцам</p>
        </div>
        <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
      </Link>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Планируете с учётом дедлайна?
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
