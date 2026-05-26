"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { CalendarDateItemExtended } from "@/lib/calendar-mock-data";
import {
  itemCategoryType,
  itemPriority,
  itemColor,
  itemBadgeLabel,
  itemShortLabel,
  itemLabel,
  itemCtaLabel,
  filterMatchesCat,
} from "@/lib/calendar-helpers";

// ─── Label dictionaries ───────────────────────────────────────────────────────

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const MONTHS_GENITIVE_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const MONTHS_SHORT_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_SHORT_RU = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];

const DAY_HEADERS_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const DAY_HEADERS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKDAYS_RU = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

// Simplified 5-filter set — no horizontal scroll on mobile
const FILTERS_EN = [
  { key: "all",      label: "All" },
  { key: "holidays", label: "Holidays" },
  { key: "events",   label: "Events" },
  { key: "business", label: "Business" },
  { key: "property", label: "Property" },
];
const FILTERS_RU = [
  { key: "all",      label: "Все" },
  { key: "holidays", label: "Праздники" },
  { key: "events",   label: "События" },
  { key: "business", label: "Бизнес" },
  { key: "property", label: "Недвижимость" },
];

// ─── Adaptive legend ──────────────────────────────────────────────────────────

function getLegendItems(filter: string, locale: "en" | "ru") {
  const isRu = locale === "ru";
  const H = { label: isRu ? "Праздник"      : "Holiday",  color: "#22C55E" };
  const E = { label: isRu ? "Событие"       : "Event",    color: "#3B82F6" };
  const B = { label: isRu ? "Бизнес"        : "Business", color: "#1B2E4B" };
  const T = { label: isRu ? "Налог"         : "Tax",      color: "#EF4444" };
  const D = { label: isRu ? "Дедлайн"       : "Deadline", color: "#F59E0B" };
  const P = { label: isRu ? "Недвижимость"  : "Property", color: "#1B2E4B" };
  const U = { label: isRu ? "Обновление"    : "Update",   color: "#6B7280" };
  const O = { label: isRu ? "Другое"        : "Other",    color: "#6B7280" };

  switch (filter) {
    case "holidays": return [H];
    case "events":   return [E, U];
    case "business": return [B, T, D];
    case "property": return [P];
    default:         return [H, E, B, T, D, O];
  }
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function buildGridCells(year: number, month: number): Array<number | null> {
  // Monday-first: shift Sunday(0) → 6, Monday(1) → 0, ..., Saturday(6) → 5
  const rawFirstDay = new Date(year, month - 1, 1).getDay();
  const firstDay = (rawFirstDay + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayISO(): string {
  const t = new Date();
  return isoDate(t.getFullYear(), t.getMonth() + 1, t.getDate());
}

function getMonthAtOffset(baseYear: number, baseMonth: number, offset: number): [number, number] {
  const d = new Date(baseYear, baseMonth - 1 + offset, 1);
  return [d.getFullYear(), d.getMonth() + 1];
}

function formatShortDate(iso: string, locale: "en" | "ru"): string {
  const [, m, d] = iso.split("-").map(Number);
  return locale === "ru"
    ? `${d} ${MONTHS_GENITIVE_RU[m - 1]}`
    : `${MONTHS_SHORT_EN[m - 1]} ${d}`;
}

function formatLongDate(iso: string, locale: "en" | "ru"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return locale === "ru"
    ? `${d} ${MONTHS_GENITIVE_RU[m - 1]} ${y}`
    : `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

function dayHeadingLabel(iso: string, locale: "en" | "ru"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return locale === "ru"
    ? `${WEEKDAYS_RU[dow]}, ${d} ${MONTHS_GENITIVE_RU[m - 1]} ${y}`
    : `${WEEKDAYS_EN[dow]}, ${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

// ─── Grid-expanded item type ─────────────────────────────────────────────────
// Extended item with an internal _cellDate for range-expanded entries.
// _cellDate is the date this item occupies in the grid (different from item.date
// for mid-range days); item.date always holds the original event start date.
type GridItem = CalendarDateItemExtended & { _cellDate?: string };

// Expand multi-day items so they appear on every date in their range within the
// given month. Single-day items are passed through unchanged.
function expandRanges(
  items: CalendarDateItemExtended[],
  year: number,
  month: number
): GridItem[] {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const result: GridItem[] = [];

  for (const item of items) {
    if (!item.period_end) {
      const prefix = `${year}-${String(month).padStart(2, "0")}`;
      if (item.date.startsWith(prefix)) result.push(item);
      continue;
    }
    const start = new Date(item.date);
    const end = new Date(item.period_end);
    const from = start < monthStart ? monthStart : start;
    const to = end > monthEnd ? monthEnd : end;
    if (from > to) continue;
    const cur = new Date(from);
    while (cur <= to) {
      const iso = isoDate(cur.getFullYear(), cur.getMonth() + 1, cur.getDate());
      result.push({ ...item, _cellDate: iso });
      cur.setDate(cur.getDate() + 1);
    }
  }
  return result;
}

// Group agenda items by detail_url. Items without a detail_url are kept as
// individual entries. Returns an array of either single items or item groups.
function groupByDetailUrl(
  items: CalendarDateItemExtended[]
): (CalendarDateItemExtended | CalendarDateItemExtended[])[] {
  const groups = new Map<string, CalendarDateItemExtended[]>();
  const order: string[] = [];

  for (const item of items) {
    const key = item.detail_url ?? `__solo__${item.date}__${item.label_en}`;
    if (!groups.has(key)) {
      order.push(key);
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return order.map((key) => {
    const g = groups.get(key)!;
    return g.length === 1 ? g[0] : g;
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  items: CalendarDateItemExtended[];
  locale: "en" | "ru";
  // Optional initial state — used when navigating from a dated detail page
  initialYear?: number;
  initialMonth?: number;
  initialDate?: string;  // "YYYY-MM-DD" — pre-selects that day
}

export default function CalendarGrid({ items, locale, initialYear, initialMonth, initialDate }: Props) {
  const isRu = locale === "ru";
  const currentTodayISO = todayISO();
  const today = new Date();

  const [year, setYear] = useState(initialYear ?? today.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDate ?? null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(initialYear ?? today.getFullYear());

  const filters = isRu ? FILTERS_RU : FILTERS_EN;
  const monthNames = isRu ? MONTHS_RU : MONTHS_EN;
  const monthsShort = isRu ? MONTHS_SHORT_RU : MONTHS_SHORT_EN;
  const dayHeaders = isRu ? DAY_HEADERS_RU : DAY_HEADERS_EN;

  const legend = getLegendItems(activeFilter, locale);

  // Items whose start date falls in the current month — used for agenda lists
  const allMonthItems = useMemo(() => {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    return items.filter((item) => item.date.startsWith(prefix));
  }, [items, year, month]);

  // Agenda items after active filter — used for full-month agenda and highlights
  const filteredMonthItems = useMemo(() => {
    if (activeFilter === "all") return allMonthItems;
    return allMonthItems.filter((item) =>
      filterMatchesCat(activeFilter, itemCategoryType(item))
    );
  }, [allMonthItems, activeFilter]);

  // Range-expanded items for the grid — multi-day items appear on every date
  const gridExpandedItems = useMemo(
    () => expandRanges(items, year, month),
    [items, year, month]
  );

  // Filtered grid items (for grid display + selected-day agenda)
  const filteredGridItems = useMemo(() => {
    if (activeFilter === "all") return gridExpandedItems;
    return gridExpandedItems.filter((item) =>
      filterMatchesCat(activeFilter, itemCategoryType(item))
    );
  }, [gridExpandedItems, activeFilter]);

  // Items grouped by cell date (respects _cellDate for range expansions),
  // sorted by priority within each day
  const itemsByDate = useMemo(() => {
    const map = new Map<string, GridItem[]>();
    for (const item of filteredGridItems) {
      const key = (item as GridItem)._cellDate ?? item.date;
      const list = map.get(key) ?? [];
      list.push(item as GridItem);
      map.set(key, list);
    }
    for (const [date, list] of map) {
      map.set(date, list.slice().sort((a, b) => itemPriority(a) - itemPriority(b)));
    }
    return map;
  }, [filteredGridItems]);

  // Selected day items
  const selectedItems = useMemo(
    () => (selectedDay ? (itemsByDate.get(selectedDay) ?? []) : []),
    [selectedDay, itemsByDate]
  );

  // Desktop side panel: up to 6 items for the current month
  const monthHighlights = useMemo(
    () =>
      filteredMonthItems
        .slice()
        .sort((a, b) => {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return itemPriority(a) - itemPriority(b);
        })
        .slice(0, 6),
    [filteredMonthItems]
  );

  // Full month agenda (date asc, priority asc within same date)
  const sortedMonthItems = useMemo(
    () =>
      filteredMonthItems.slice().sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return itemPriority(a) - itemPriority(b);
      }),
    [filteredMonthItems]
  );

  // Grouped agenda — items sharing a detail_url collapse into one card
  const groupedMonthItems = useMemo(
    () => groupByDetailUrl(sortedMonthItems),
    [sortedMonthItems]
  );
  const groupedHighlights = useMemo(
    () => groupByDetailUrl(monthHighlights),
    [monthHighlights]
  );

  const gridCells = useMemo(() => buildGridCells(year, month), [year, month]);

  // Month navigation helpers
  function navigateTo(offset: number) {
    const [ny, nm] = getMonthAtOffset(year, month, offset);
    setYear(ny);
    setMonth(nm);
    setSelectedDay(null);
  }

  function prevMonth() { navigateTo(-1); }
  function nextMonth() { navigateTo(+1); }

  function shortMonthAt(offset: number): string {
    const [, m] = getMonthAtOffset(year, month, offset);
    return monthsShort[m - 1];
  }

  function openPicker() {
    setPickerYear(year);
    setShowPicker(true);
  }

  function selectPickerMonth(m: number) {
    setYear(pickerYear);
    setMonth(m);
    setSelectedDay(null);
    setShowPicker(false);
  }

  function goToToday() {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth() + 1);
    setSelectedDay(null);
    setShowPicker(false);
  }

  return (
    <div>

      {/* ── Month navigation — all 5 positions visible on mobile ─────────── */}
      <div className="flex items-center justify-between gap-1 mb-3">

        {/* Left group: prev arrow + ghost -2 + ghost -1 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={prevMonth}
            aria-label={isRu ? "Предыдущий месяц" : "Previous month"}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 text-gray-500 hover:border-stone-300 hover:text-gray-900 transition-colors text-[14px] flex-shrink-0"
          >
            ←
          </button>
          <button
            onClick={() => navigateTo(-2)}
            className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors cursor-pointer px-0.5 py-1 flex-shrink-0"
          >
            {shortMonthAt(-2)}
          </button>
          <button
            onClick={() => navigateTo(-1)}
            className="text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-0.5 py-1 flex-shrink-0"
          >
            {shortMonthAt(-1)}
          </button>
        </div>

        {/* Current month — centered, tappable to open picker */}
        <button
          onClick={() => (showPicker ? setShowPicker(false) : openPicker())}
          className="flex-1 flex items-center justify-center gap-1 px-1 py-1 rounded-lg hover:bg-stone-50 transition-colors"
          aria-label={isRu ? "Выбрать месяц и год" : "Pick month and year"}
        >
          <span className="text-[18px] font-bold text-gray-900 whitespace-nowrap leading-tight">
            {monthNames[month - 1]} {year}
          </span>
          <span className="text-[10px] text-gray-400 leading-none mt-0.5" aria-hidden="true">
            {showPicker ? "▲" : "▼"}
          </span>
        </button>

        {/* Right group: ghost +1 + ghost +2 + next arrow */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => navigateTo(+1)}
            className="text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-0.5 py-1 flex-shrink-0"
          >
            {shortMonthAt(+1)}
          </button>
          <button
            onClick={() => navigateTo(+2)}
            className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors cursor-pointer px-0.5 py-1 flex-shrink-0"
          >
            {shortMonthAt(+2)}
          </button>
          <button
            onClick={nextMonth}
            aria-label={isRu ? "Следующий месяц" : "Next month"}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 text-gray-500 hover:border-stone-300 hover:text-gray-900 transition-colors text-[14px] flex-shrink-0"
          >
            →
          </button>
        </div>
      </div>

      {/* ── Month / year picker panel ──────────────────────────────────────── */}
      {showPicker && (
        <div className="mb-3 rounded-2xl border border-stone-200 bg-white shadow-sm p-4">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setPickerYear((y) => y - 1)}
              aria-label={isRu ? "Предыдущий год" : "Previous year"}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-stone-200 text-gray-500 hover:border-stone-300 hover:text-gray-900 transition-colors text-[14px]"
            >
              ←
            </button>
            <span className="text-[16px] font-bold text-gray-900">{pickerYear}</span>
            <button
              onClick={() => setPickerYear((y) => y + 1)}
              aria-label={isRu ? "Следующий год" : "Next year"}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-stone-200 text-gray-500 hover:border-stone-300 hover:text-gray-900 transition-colors text-[14px]"
            >
              →
            </button>
          </div>

          {/* Month grid 3×4 */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {monthsShort.map((name, i) => {
              const isActive = pickerYear === year && i + 1 === month;
              return (
                <button
                  key={i}
                  onClick={() => selectPickerMonth(i + 1)}
                  className={`text-[14px] py-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-navy text-white font-bold"
                      : "font-medium text-gray-700 hover:bg-stone-100"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <button
            onClick={goToToday}
            className="text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            {isRu ? "← Сегодня" : "← Today"}
          </button>
        </div>
      )}

      {/* ── Filter chips — flex-wrap, no horizontal scroll ─────────────────── */}
      <div className="flex flex-wrap gap-1.5 pb-1 mb-3">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key === activeFilter ? "all" : f.key)}
            className={`text-[12px] font-medium px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap ${
              activeFilter === f.key
                ? "bg-navy text-white border-navy"
                : "bg-white text-gray-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Adaptive legend ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {isRu ? "Обозначения:" : "Legend:"}
        </span>
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[12px] text-gray-500">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: l.color }}
            />
            {l.label}
          </span>
        ))}
      </div>

      {/* ── Desktop: two-column layout ─────────────────────────────────────── */}
      <div className="md:grid md:grid-cols-[1fr_288px] md:gap-6 md:items-start">

        {/* Left: month grid */}
        <div>
          {/* Day header row */}
          <div className="grid grid-cols-7 mb-1">
            {dayHeaders.map((h) => (
              <div
                key={h}
                className="text-center text-[12px] font-semibold text-gray-500 py-1.5"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-px bg-stone-100 rounded-xl overflow-hidden border border-stone-100">
            {gridCells.map((cell, i) => {
              if (cell === null) {
                return <div key={i} className="bg-white h-[64px] md:h-[86px]" />;
              }

              const iso = isoDate(year, month, cell);
              const dayItems = itemsByDate.get(iso) ?? [];
              const isToday = iso === currentTodayISO;
              const isSelected = iso === selectedDay;

              // Pill/dot logic per blueprint scenarios A-F
              const p1Items = dayItems.filter((x) => itemPriority(x) === 1);
              const p2Items = dayItems.filter((x) => itemPriority(x) === 2);
              const p3Items = dayItems.filter((x) => itemPriority(x) === 3);

              let pillItem: CalendarDateItemExtended | null = null;
              let dotItems: CalendarDateItemExtended[] = [];
              let overflowCount = 0;

              if (p1Items.length > 0) {
                pillItem = p1Items[0];
                const others = [...p1Items.slice(1), ...p2Items, ...p3Items];
                dotItems = others.slice(0, 2);
                overflowCount = Math.max(0, others.length - 2);
              } else if (p2Items.length === 1 && p3Items.length === 0) {
                pillItem = p2Items[0];
              } else if (p2Items.length + p3Items.length > 0) {
                const all = [...p2Items, ...p3Items];
                dotItems = all.slice(0, 3);
                overflowCount = Math.max(0, all.length - 3);
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : iso)}
                  className={`relative bg-white h-[64px] md:h-[86px] flex flex-col items-center pt-2 pb-1.5 transition-colors cursor-pointer ${
                    isSelected ? "bg-navy/[0.04]" : "hover:bg-stone-50"
                  }`}
                >
                  {/* Day number */}
                  <span
                    className={`text-[15px] font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-1 leading-none ${
                      isToday
                        ? "bg-navy text-white font-bold"
                        : isSelected
                        ? "text-brass font-bold"
                        : dayItems.length > 0
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {cell}
                  </span>

                  {/* Indicators */}
                  <div className="flex flex-col items-center gap-0.5 w-full px-1">
                    {pillItem && (
                      <div
                        className="w-full text-center text-[9px] font-bold text-white rounded-sm px-0.5 py-[2px] leading-tight truncate"
                        style={{ backgroundColor: itemColor(pillItem) }}
                      >
                        {itemShortLabel(pillItem, locale)}
                      </div>
                    )}
                    {dotItems.length > 0 && (
                      <div className="flex items-center gap-[3px] justify-center">
                        {dotItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                            style={{ backgroundColor: itemColor(item) }}
                          />
                        ))}
                        {overflowCount > 0 && (
                          <span className="text-[9px] text-gray-400 leading-none">
                            +{overflowCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile: selected day agenda */}
          {selectedDay && (
            <div className="md:hidden mt-5">
              <div className="border-b border-stone-100 pb-2.5 mb-3">
                <p className="text-[16px] font-bold text-gray-900 leading-snug">
                  {dayHeadingLabel(selectedDay, locale)}
                </p>
              </div>
              {selectedItems.length === 0 ? (
                <p className="text-[14px] text-gray-400 py-2">
                  {isRu
                    ? "В этот день событий нет."
                    : "No events or deadlines on this day."}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedItems.map((item, i) => (
                    <AgendaCard key={i} item={item} locale={locale} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile: no selection — "This month" mini list */}
          {!selectedDay && groupedHighlights.length > 0 && (
            <div className="md:hidden mt-5">
              <div className="w-5 h-0.5 bg-brass rounded-full mb-2.5" />
              <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {isRu ? "В этом месяце в Дубае" : "This month in Dubai"}
              </p>
              <div className="space-y-1.5">
                {groupedHighlights.map((entry, i) =>
                  Array.isArray(entry) ? (
                    <GroupedAgendaRow key={i} items={entry} locale={locale} />
                  ) : (
                    <AgendaRow key={i} item={entry} locale={locale} />
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column: desktop side panel */}
        <div className="hidden md:block">
          {selectedDay ? (
            <>
              <div className="border-b border-stone-100 pb-2.5 mb-3">
                <p className="text-[16px] font-bold text-gray-900 leading-snug">
                  {dayHeadingLabel(selectedDay, locale)}
                </p>
              </div>
              {selectedItems.length === 0 ? (
                <p className="text-[14px] text-gray-400">
                  {isRu
                    ? "В этот день событий нет."
                    : "No events or deadlines on this day."}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedItems.map((item, i) => (
                    <AgendaCard key={i} item={item} locale={locale} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-5 h-0.5 bg-brass rounded-full mb-2.5" />
              <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {isRu ? "В этом месяце в Дубае" : "This month in Dubai"}
              </p>
              {groupedHighlights.length === 0 ? (
                <p className="text-[14px] text-gray-400">
                  {isRu ? "Нет событий в этом месяце." : "No events this month."}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {groupedHighlights.map((entry, i) =>
                    Array.isArray(entry) ? (
                      <GroupedAgendaCard key={i} items={entry} locale={locale} compact />
                    ) : (
                      <AgendaCard key={i} item={entry} locale={locale} compact />
                    )
                  )}
                </div>
              )}
              {groupedHighlights.length > 0 && (
                <p className="text-[12px] text-gray-400 mt-3">
                  {isRu
                    ? "Нажмите на день, чтобы увидеть детали."
                    : "Tap a day to see details."}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Full month agenda ─────────────────────────────────────────────── */}
      {groupedMonthItems.length > 0 && (
        <div className="mt-8">
          <div className="w-5 h-0.5 bg-brass rounded-full mb-2.5" />
          <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {isRu ? "Все даты месяца" : "All dates this month"}
          </p>
          <div className="space-y-1.5">
            {groupedMonthItems.map((entry, i) =>
              Array.isArray(entry) ? (
                <GroupedAgendaRow key={i} items={entry} locale={locale} />
              ) : (
                <AgendaRow key={i} item={entry} locale={locale} />
              )
            )}
          </div>
        </div>
      )}

      {/* Empty month state */}
      {sortedMonthItems.length === 0 && (
        <div className="mt-6 border border-dashed border-stone-200 rounded-xl px-4 py-6 text-center">
          <p className="text-[14px] text-gray-400">
            {isRu
              ? `Нет событий в ${monthNames[month - 1].toLowerCase()} ${year}. Попробуйте «Все» или другой месяц.`
              : `No events in ${monthNames[month - 1]} ${year}. Try "All" or check another month.`}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── AgendaCard ───────────────────────────────────────────────────────────────

function AgendaCard({
  item,
  locale,
  compact = false,
}: {
  item: CalendarDateItemExtended;
  locale: "en" | "ru";
  compact?: boolean;
}) {
  const isRu = locale === "ru";
  const color = itemColor(item);
  const badge = itemBadgeLabel(item, locale);
  const label = itemLabel(item, locale);
  const cta = itemCtaLabel(item, locale);

  const confidence = item.confidence;
  const showConfidence = confidence !== "confirmed";
  let confidenceText = "";
  let confidenceIsStrong = false;
  if (confidence === "expected") {
    confidenceText = isRu ? "Ожидается" : "Expected";
  } else if (confidence === "subject_to_official_confirmation") {
    confidenceText = isRu ? "Ожидается, лунный календарь" : "Subject to moon sighting";
    confidenceIsStrong = true;
  }

  const isExternalItem = item.is_external === true;
  const ctaUrlStr = item.cta_url as string | undefined;
  const externalCtaHref = !item.detail_url && ctaUrlStr?.startsWith("http") ? ctaUrlStr : null;
  const href = item.detail_url
    ? isExternalItem
      ? item.detail_url
      : isRu ? `/ru${item.detail_url}` : item.detail_url
    : externalCtaHref;
  const useExternal = isExternalItem || !!externalCtaHref;

  return (
    <div className="border border-stone-100 rounded-xl px-4 py-3 bg-white">
      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="text-[11px] font-bold text-white px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color }}
        >
          {badge}
        </span>
        {showConfidence && (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
              confidenceIsStrong
                ? "text-amber-700 bg-amber-50 border-amber-200"
                : "text-gray-500 bg-stone-50 border-stone-200"
            }`}
          >
            {confidenceText}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-[15px] font-semibold text-gray-900 leading-snug mb-1.5">
        {label}
      </p>

      {/* Date range for multi-day items */}
      {!compact && item.period_end && (
        <p className="text-[13px] text-gray-500 mb-1.5">
          {formatLongDate(item.date, locale)} – {formatLongDate(item.period_end, locale)}
        </p>
      )}

      {/* CTA */}
      {href && (
        useExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            {cta} ↗
          </a>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            {cta}
          </Link>
        )
      )}
    </div>
  );
}

// ─── GroupedAgendaCard ────────────────────────────────────────────────────────

function GroupedAgendaCard({
  items,
  locale,
  compact = false,
}: {
  items: CalendarDateItemExtended[];
  locale: "en" | "ru";
  compact?: boolean;
}) {
  const isRu = locale === "ru";
  const sorted = items.slice().sort((a, b) => {
    const pd = itemPriority(a) - itemPriority(b);
    if (pd !== 0) return pd;
    return a.date < b.date ? -1 : 1;
  });
  const primary = sorted[0];
  const color = itemColor(primary);
  const badge = itemBadgeLabel(primary, locale);
  const cta = itemCtaLabel(primary, locale);
  const isExternalItem = primary.is_external === true;
  const primaryCtaUrl = primary.cta_url as string | undefined;
  const externalCtaHref = !primary.detail_url && primaryCtaUrl?.startsWith("http") ? primaryCtaUrl : null;
  const href = primary.detail_url
    ? isExternalItem
      ? primary.detail_url
      : isRu ? `/ru${primary.detail_url}` : primary.detail_url
    : externalCtaHref;
  const useExternal = isExternalItem || !!externalCtaHref;

  // Date range: span from earliest start to latest end
  const allStarts = items.map((i) => i.date);
  const allEnds = items.map((i) => i.period_end ?? i.date);
  const minDate = allStarts.reduce((a, b) => (a < b ? a : b));
  const maxEnd = allEnds.reduce((a, b) => (a > b ? a : b));
  const rangeLabel =
    minDate === maxEnd
      ? formatShortDate(minDate, locale)
      : `${formatShortDate(minDate, locale)} – ${formatShortDate(maxEnd, locale)}`;

  // In compact mode: show short labels, cap at 3 sub-items with overflow count
  const COMPACT_LIMIT = 3;
  const displayItems = compact ? sorted.slice(0, COMPACT_LIMIT) : sorted;
  const overflowCount = compact ? Math.max(0, sorted.length - COMPACT_LIMIT) : 0;

  return (
    <div className="border border-stone-100 rounded-xl px-4 py-3 bg-white">
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="text-[11px] font-bold text-white px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color }}
        >
          {badge}
        </span>
      </div>
      {!compact && (
        <p className="text-[12px] text-gray-500 mb-1.5">{rangeLabel}</p>
      )}
      <div className="space-y-0.5 mb-2">
        {displayItems.map((item, i) => {
          const start = formatShortDate(item.date, locale);
          const end = item.period_end ? formatShortDate(item.period_end, locale) : null;
          const dateStr = end && end !== start ? `${start} – ${end}` : start;
          // Compact mode: use short label for density; full mode: use full label
          const labelText = compact ? itemShortLabel(item, locale) : itemLabel(item, locale);
          return (
            <p key={i} className="text-[13px] text-gray-700 leading-snug">
              <span className="text-gray-400 text-[12px]">{dateStr}:</span>{" "}
              {labelText}
            </p>
          );
        })}
        {overflowCount > 0 && (
          <p className="text-[11px] text-gray-400">+{overflowCount} more</p>
        )}
      </div>
      {href && (
        useExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            {cta} ↗
          </a>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            {cta}
          </Link>
        )
      )}
    </div>
  );
}

// ─── GroupedAgendaRow ─────────────────────────────────────────────────────────

function GroupedAgendaRow({
  items,
  locale,
}: {
  items: CalendarDateItemExtended[];
  locale: "en" | "ru";
}) {
  const isRu = locale === "ru";
  const sorted = items.slice().sort((a, b) => {
    const pd = itemPriority(a) - itemPriority(b);
    if (pd !== 0) return pd;
    return a.date < b.date ? -1 : 1;
  });
  const primary = sorted[0];
  const color = itemColor(primary);
  const badge = itemBadgeLabel(primary, locale);
  const cta = itemCtaLabel(primary, locale);
  const isExternalItem2 = primary.is_external === true;
  const primaryCtaUrl2 = primary.cta_url as string | undefined;
  const externalCtaHref2 = !primary.detail_url && primaryCtaUrl2?.startsWith("http") ? primaryCtaUrl2 : null;
  const href = primary.detail_url
    ? isExternalItem2
      ? primary.detail_url
      : isRu ? `/ru${primary.detail_url}` : primary.detail_url
    : externalCtaHref2;
  const useExternal2 = isExternalItem2 || !!externalCtaHref2;

  const allStarts = items.map((i) => i.date);
  const allEnds = items.map((i) => i.period_end ?? i.date);
  const minDate = allStarts.reduce((a, b) => (a < b ? a : b));
  const maxEnd = allEnds.reduce((a, b) => (a > b ? a : b));
  const rangeLabel =
    minDate === maxEnd
      ? formatShortDate(minDate, locale)
      : `${formatShortDate(minDate, locale)} – ${formatShortDate(maxEnd, locale)}`;

  return (
    <div className="flex items-start gap-3 border border-stone-100 rounded-xl px-3.5 py-3 bg-stone-50/50 hover:bg-stone-50 transition-colors">
      {/* Date range */}
      <span className="text-[12px] font-semibold text-gray-500 tabular-nums flex-shrink-0 w-[52px] pt-0.5 leading-snug">
        {rangeLabel}
      </span>
      {/* Badge */}
      <span
        className="text-[10px] font-bold text-white px-2 py-[3px] rounded-full flex-shrink-0 uppercase tracking-wide mt-0.5"
        style={{ backgroundColor: color }}
      >
        {badge}
      </span>
      {/* Sub-items + CTA */}
      <div className="flex-1 min-w-0">
        <div className="space-y-0.5 mb-1.5">
          {sorted.map((item, i) => {
            const start = formatShortDate(item.date, locale);
            const end = item.period_end ? formatShortDate(item.period_end, locale) : null;
            const dateStr = end && end !== start ? `${start} – ${end}` : start;
            return (
              <p key={i} className="text-[13px] font-medium text-gray-800 leading-snug">
                <span className="text-gray-400 text-[12px] font-normal">{dateStr}:</span>{" "}
                {itemLabel(item, locale)}
              </p>
            );
          })}
        </div>
        {href && (
          useExternal2 ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity"
            >
              {cta} ↗
            </a>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity"
            >
              {cta}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

// ─── AgendaRow ────────────────────────────────────────────────────────────────

function AgendaRow({
  item,
  locale,
}: {
  item: CalendarDateItemExtended;
  locale: "en" | "ru";
}) {
  const isRu = locale === "ru";
  const color = itemColor(item);
  const badge = itemBadgeLabel(item, locale);
  const label = itemLabel(item, locale);
  const cta = itemCtaLabel(item, locale);
  const isExternalItem = item.is_external === true;
  const ctaUrlStr = item.cta_url as string | undefined;
  const externalCtaHref = !item.detail_url && ctaUrlStr?.startsWith("http") ? ctaUrlStr : null;
  const href = item.detail_url
    ? isExternalItem
      ? item.detail_url
      : isRu ? `/ru${item.detail_url}` : item.detail_url
    : externalCtaHref;
  const useExternal = isExternalItem || !!externalCtaHref;

  const dateLabel = formatShortDate(item.date, locale);

  return (
    <div className="flex items-start gap-3 border border-stone-100 rounded-xl px-3.5 py-3 bg-stone-50/50 hover:bg-stone-50 transition-colors">
      {/* Date */}
      <span className="text-[12px] font-semibold text-gray-500 tabular-nums flex-shrink-0 w-[52px] pt-0.5">
        {dateLabel}
      </span>
      {/* Badge */}
      <span
        className="text-[10px] font-bold text-white px-2 py-[3px] rounded-full flex-shrink-0 uppercase tracking-wide mt-0.5"
        style={{ backgroundColor: color }}
      >
        {badge}
      </span>
      {/* Title + CTA */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-gray-900 leading-snug">
          {label}
        </p>
        {href && (
          useExternal ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity mt-1"
            >
              {cta} ↗
            </a>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity mt-1"
            >
              {cta}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
