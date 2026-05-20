// Server-compatible — no "use client" needed

import Link from "next/link";

const MONTHS_FULL_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTHS_SHORT_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_GENITIVE_RU = [
  "января","февраля","марта","апреля","мая","июня",
  "июля","августа","сентября","октября","ноября","декабря",
];
const MONTHS_SHORT_RU = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];

function getMonthName(isoMonth: string, locale: "en" | "ru"): string | null {
  const m = parseInt(isoMonth.split("-")[1], 10) - 1;
  if (isNaN(m) || m < 0 || m > 11) return null;
  return locale === "ru" ? MONTHS_GENITIVE_RU[m] : MONTHS_FULL_EN[m];
}

// Generate day numbers between two ISO dates (inclusive), clamped to 14 days max
function buildDateRange(start: string, end?: string): string[] {
  const from = new Date(start);
  const to = end ? new Date(end) : from;
  const days: string[] = [];
  const cur = new Date(from);
  let count = 0;
  while (cur <= to && count < 14) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
    count++;
  }
  return days;
}

function formatDayLabel(iso: string, locale: "en" | "ru"): string {
  const [, m, d] = iso.split("-").map(Number);
  return locale === "ru"
    ? `${d} ${MONTHS_SHORT_RU[m - 1]}`
    : `${MONTHS_SHORT_EN[m - 1]} ${d}`;
}

interface Props {
  locale: "en" | "ru";
  contentType: "news" | "event" | "calendar";
  calendarBase: string;      // "/calendar" or "/ru/calendar"
  calendarMonth?: string;    // "2026-05" — if present, links to that month
  highlightStart?: string;   // ISO date — start of highlight range
  highlightEnd?: string;     // ISO date — end of highlight range (optional)
}

export default function CalendarContextCta({
  locale,
  contentType,
  calendarBase,
  calendarMonth,
  highlightStart,
  highlightEnd,
}: Props) {
  const isRu = locale === "ru";
  const mName = calendarMonth ? getMonthName(calendarMonth, locale) : null;
  const monthLink = calendarMonth
    ? `${calendarBase}?month=${calendarMonth}`
    : calendarBase;

  const title = isRu
    ? "В календаре Дубая"
    : contentType === "event"
    ? "This event is on Dubai Calendar"
    : contentType === "calendar"
    ? "Related Dubai Calendar dates"
    : "Linked to Dubai Calendar";

  const description = isRu
    ? contentType === "event"
      ? "Смотрите это событие в контексте других дат, праздников и дедлайнов Дубая."
      : contentType === "calendar"
      ? "Связанные даты и события в календаре Дубая."
      : "Эта дата связана с событиями и важными напоминаниями в Дубае."
    : contentType === "event"
    ? "See this event alongside other Dubai dates, holidays and deadlines."
    : contentType === "calendar"
    ? "Browse related dates and events in the Dubai Calendar."
    : "This update is linked to key Dubai dates and reminders.";

  const primaryLabel = isRu
    ? mName ? `Все даты ${mName}` : "Открыть календарь"
    : mName ? `See all ${mName} dates` : "Open Dubai Calendar";

  return (
    <div className="border border-stone-200 rounded-2xl px-4 py-4 mb-5 bg-stone-50/30">
      {/* Label */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-brass flex-shrink-0" aria-hidden="true" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {isRu ? "Календарь Дубая" : "Dubai Calendar"}
        </span>
      </div>

      {/* Title */}
      <p className="text-[14px] font-semibold text-gray-900 mb-1 leading-snug">
        {title}
      </p>

      {/* Description */}
      <p className="text-[12px] text-gray-500 leading-snug mb-3">
        {description}
      </p>

      {/* Date highlight strip */}
      {highlightStart && (() => {
        const days = buildDateRange(highlightStart, highlightEnd);
        return (
          <div className="flex flex-wrap gap-1 mb-3">
            {days.map((iso) => (
              <span
                key={iso}
                className="text-[12px] font-semibold text-white bg-navy px-2.5 py-1 rounded-full"
              >
                {formatDayLabel(iso, locale)}
              </span>
            ))}
          </div>
        );
      })()}

      {/* CTAs */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href={monthLink}
          className="text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {primaryLabel}
        </Link>
        {calendarMonth && (
          <Link
            href={calendarBase}
            className="text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity whitespace-nowrap"
          >
            {isRu ? "Открыть календарь" : "Open calendar"} →
          </Link>
        )}
      </div>
    </div>
  );
}
