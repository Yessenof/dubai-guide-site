// Server-compatible — no "use client" needed

import Link from "next/link";

const MONTHS_FULL_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTHS_GENITIVE_RU = [
  "января","февраля","марта","апреля","мая","июня",
  "июля","августа","сентября","октября","ноября","декабря",
];
// Nominative/accusative — used after "за" in CTA: "за май 2026"
const MONTHS_NOMINATIVE_RU = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь",
];
const MONTHS_SHORT_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_SHORT_RU = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];

// Badge label: genitive ("мая 2026") or full EN ("May 2026")
function monthDisplayName(isoMonth: string, locale: "en" | "ru"): string {
  const m = parseInt(isoMonth.slice(5, 7), 10) - 1;
  if (isNaN(m) || m < 0 || m > 11) return isoMonth;
  const year = isoMonth.slice(0, 4);
  return locale === "ru"
    ? `${MONTHS_GENITIVE_RU[m]} ${year}`
    : `${MONTHS_FULL_EN[m]} ${year}`;
}

// CTA label: nominative after "за" ("за май 2026")
function ctaMonthRu(isoMonth: string): string {
  const m = parseInt(isoMonth.slice(5, 7), 10) - 1;
  if (isNaN(m) || m < 0 || m > 11) return isoMonth;
  return `${MONTHS_NOMINATIVE_RU[m]} ${isoMonth.slice(0, 4)}`;
}

function expandDateRange(start: string, end?: string): string[] {
  const from = new Date(start);
  const to = end ? new Date(end) : from;
  const dates: string[] = [];
  const cur = new Date(from);
  while (cur <= to && dates.length < 9) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function formatChip(iso: string, locale: "en" | "ru"): string {
  const parts = iso.split("-");
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return locale === "ru"
    ? `${d} ${MONTHS_SHORT_RU[m]}`
    : `${MONTHS_SHORT_EN[m]} ${d}`;
}

interface Props {
  locale: "en" | "ru";
  calendarBase: string;       // "/calendar" or "/ru/calendar"
  calendarMonth?: string;     // "2026-05" — if absent, links to base
  range?: { start: string; end?: string };  // for events — auto-expanded into chips
  dateItems?: { date: string }[];           // for calendar pages — formatted as chips
  yearBadge?: string;         // e.g., "2026" for yearly pages without a single month
}

export default function CalendarMiniPreview({
  locale,
  calendarBase,
  calendarMonth,
  range,
  dateItems,
  yearBadge,
}: Props) {
  const isRu = locale === "ru";
  const href = calendarMonth ? `${calendarBase}?month=${calendarMonth}` : calendarBase;
  const monthName = calendarMonth ? monthDisplayName(calendarMonth, locale) : null;

  const chips: string[] = [];
  if (range) {
    expandDateRange(range.start, range.end).forEach(iso => chips.push(formatChip(iso, locale)));
  } else if (dateItems) {
    [...dateItems].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).forEach(item => chips.push(formatChip(item.date, locale)));
  }

  const ctaLabel = isRu
    ? calendarMonth ? `Открыть календарь за ${ctaMonthRu(calendarMonth)}` : "Открыть календарь Дубая"
    : monthName ? `Open ${monthName} calendar` : "Open Dubai Calendar";

  return (
    <Link
      href={href}
      className="group block border border-stone-200 rounded-2xl px-4 py-4 mb-5 bg-stone-50/30 hover:shadow-sm hover:border-stone-300 transition-all"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brass flex-shrink-0" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {isRu ? "Календарь Дубая" : "Dubai Calendar"}
          </span>
        </div>
        {(monthName ?? yearBadge) && (
          <span className="text-[11px] font-semibold text-navy bg-stone-200 px-2 py-0.5 rounded-full">
            {monthName ?? yearBadge}
          </span>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {chips.map((chip, i) => (
            <span
              key={i}
              className="text-[12px] font-semibold text-white bg-navy px-2.5 py-1 rounded-full"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <p className="text-[13px] font-semibold text-navy group-hover:opacity-80 transition-opacity">
        {ctaLabel} →
      </p>
    </Link>
  );
}
