// Server-compatible — no "use client" directive
// Renders indexed expandable briefs for calendar date items that carry brief_en/brief_ru.
// All content is present in initial server HTML — no client fetch, no useEffect.
// Returns null when no items in the current locale have brief content.

import Link from "next/link";
import type { CalendarDateItem } from "@/lib/db/news-events-calendar";

interface Props {
  items: CalendarDateItem[];
  locale: "en" | "ru";
}

const SOURCE_STATUS: Record<string, { en: string; ru: string; cls: string }> = {
  confirmed: { en: "confirmed",  ru: "подтверждено", cls: "text-emerald-600" },
  expected:  { en: "expected",   ru: "ожидается",    cls: "text-amber-600"  },
};

const TYPE_PILL: Record<string, { en: string; ru: string; cls: string }> = {
  "deadline":       { en: "Deadline",       ru: "Дедлайн",    cls: "bg-orange-50 border-orange-200 text-orange-700" },
  "important-date": { en: "Important date", ru: "Важная дата", cls: "bg-amber-50 border-amber-200 text-amber-700"  },
  "public-holiday": { en: "Public holiday", ru: "Праздник",    cls: "bg-red-50 border-red-200 text-red-700"        },
  "other":          { en: "",               ru: "",             cls: ""                                              },
};

export default function CalendarBriefSection({ items, locale }: Props) {
  const isRu = locale === "ru";

  // Strict locale gate — no EN fallback on RU page
  const briefItems = items.filter(item =>
    isRu ? !!item.brief_ru : !!item.brief_en
  );

  if (briefItems.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="w-5 h-0.5 bg-brass rounded-full mb-2" />
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {isRu ? "Пояснения к датам" : "Key date notes"}
      </h2>
      <div className="space-y-2">
        {briefItems.map((item, i) => {
          const brief    = isRu ? item.brief_ru! : item.brief_en!;
          const label    = (isRu ? item.label_ru : item.label_en) || item.label_en;
          const whoFor   = isRu ? item.who_for_ru    : item.who_for_en;
          const whatToDo = isRu ? item.what_to_do_ru : item.what_to_do_en;
          const srcLabel = isRu ? item.source_label_ru : item.source_label_en;
          const ctaLabel = isRu ? item.cta_label_ru    : item.cta_label_en;
          const statusMeta = item.source_status ? SOURCE_STATUS[item.source_status] : null;
          const isExternalCta = !!item.cta_url && item.cta_url.startsWith("http");
          const typeMeta = TYPE_PILL[item.type] ?? TYPE_PILL["other"];

          return (
            <details
              key={i}
              className="border border-stone-200 rounded-xl bg-white overflow-hidden"
            >
              {/* ── Summary row ─────────────────────────────────────────────── */}
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none">
                <div className="flex items-start gap-3 px-4 py-3.5">
                  {/* Date block */}
                  <span className="flex-shrink-0 text-[11px] font-semibold text-gray-500 bg-stone-100 px-2 py-1 rounded-lg tabular-nums mt-0.5 whitespace-nowrap">
                    {item.date}
                  </span>
                  {/* Label + type pill */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                      {label}
                    </p>
                    {typeMeta.en && (
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${typeMeta.cls}`}>
                        {isRu ? typeMeta.ru : typeMeta.en}
                      </span>
                    )}
                  </div>
                  {/* Expand hint */}
                  <span className="flex-shrink-0 text-[12px] font-semibold text-navy mt-0.5 whitespace-nowrap">
                    {isRu ? "Детали" : "Show"} ›
                  </span>
                </div>
              </summary>

              {/* ── Expanded content ─────────────────────────────────────────── */}
              <div className="px-4 pb-4 pt-3 border-t border-stone-100">
                {/* Brief body */}
                <p className="text-[13px] text-gray-700 leading-[1.65]">
                  {brief}
                </p>

                {/* Who this is for */}
                {whoFor && (
                  <div className="mt-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      {isRu ? "Кого касается" : "Who this affects"}
                    </p>
                    <p className="text-[13px] text-gray-700 leading-snug">{whoFor}</p>
                  </div>
                )}

                {/* What to do */}
                {whatToDo && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      {isRu ? "Что сделать" : "What to do"}
                    </p>
                    <p className="text-[13px] text-gray-700 leading-snug">{whatToDo}</p>
                  </div>
                )}

                {/* Source line */}
                {(srcLabel || item.source_url) && (
                  <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold text-gray-400">
                      {isRu ? "Источник:" : "Source:"}
                    </span>
                    {item.source_url ? (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-medium text-brass hover:opacity-75 transition-opacity"
                      >
                        {srcLabel || (isRu ? "Официальный источник" : "Official source")} ↗
                      </a>
                    ) : (
                      <span className="text-[12px] text-gray-600">{srcLabel}</span>
                    )}
                    {statusMeta && (
                      <span className={`text-[10px] font-semibold ${statusMeta.cls}`}>
                        · {isRu ? statusMeta.ru : statusMeta.en}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA */}
                {item.cta_url && ctaLabel && (
                  <div className="mt-3.5">
                    {isExternalCta ? (
                      <a
                        href={item.cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy bg-stone-100 hover:bg-stone-200 transition-colors px-3 py-1.5 rounded-lg"
                      >
                        {ctaLabel} ↗
                      </a>
                    ) : (
                      <Link
                        href={item.cta_url}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy bg-stone-100 hover:bg-stone-200 transition-colors px-3 py-1.5 rounded-lg"
                      >
                        {ctaLabel} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
