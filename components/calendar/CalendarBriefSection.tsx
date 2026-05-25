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
        {isRu ? "Подробнее" : "Details"}
      </h2>
      <div className="space-y-2">
        {briefItems.map((item, i) => {
          const brief    = isRu ? item.brief_ru! : item.brief_en!;
          // Label falls back to EN only for display label (consistent with dates list pattern)
          const label    = (isRu ? item.label_ru : item.label_en) || item.label_en;
          const whoFor   = isRu ? item.who_for_ru    : item.who_for_en;
          const whatToDo = isRu ? item.what_to_do_ru : item.what_to_do_en;
          const srcLabel = isRu ? item.source_label_ru : item.source_label_en;
          const ctaLabel = isRu ? item.cta_label_ru    : item.cta_label_en;
          const statusMeta = item.source_status ? SOURCE_STATUS[item.source_status] : null;
          const isExternalCta = !!item.cta_url && item.cta_url.startsWith("http");

          return (
            <details
              key={i}
              className="border border-stone-200 rounded-xl bg-white overflow-hidden"
            >
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="flex-shrink-0 text-[12px] font-medium text-gray-400 tabular-nums w-[88px]">
                  {item.date}
                </span>
                <span className="text-[13px] font-medium text-gray-800 flex-1 leading-snug">
                  {label}
                </span>
                <span className="text-[12px] text-gray-300 flex-shrink-0" aria-hidden="true">›</span>
              </summary>

              <div className="px-4 pb-4 pt-3 border-t border-stone-100">
                {/* Brief body */}
                <p className="text-[13px] text-gray-700 leading-[1.65]">
                  {brief}
                </p>

                {/* Who this is for */}
                {whoFor && (
                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                      {isRu ? "Для кого" : "Who this is for"}
                    </p>
                    <p className="text-[12px] text-gray-600 leading-snug">{whoFor}</p>
                  </div>
                )}

                {/* What to do */}
                {whatToDo && (
                  <div className="mt-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                      {isRu ? "Что делать" : "What to do"}
                    </p>
                    <p className="text-[12px] text-gray-600 leading-snug">{whatToDo}</p>
                  </div>
                )}

                {/* Source line */}
                {(srcLabel || item.source_url) && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-medium text-gray-400">
                      {isRu ? "Источник:" : "Source:"}
                    </span>
                    {item.source_url ? (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-brass hover:opacity-75 transition-opacity"
                      >
                        {srcLabel || (isRu ? "Официальный источник" : "Official source")} ↗
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-500">{srcLabel}</span>
                    )}
                    {statusMeta && (
                      <span className={`text-[10px] font-medium ${statusMeta.cls}`}>
                        · {isRu ? statusMeta.ru : statusMeta.en}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA */}
                {item.cta_url && ctaLabel && (
                  <div className="mt-3">
                    {isExternalCta ? (
                      <a
                        href={item.cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-navy hover:opacity-75 transition-opacity"
                      >
                        {ctaLabel} ↗
                      </a>
                    ) : (
                      <Link
                        href={item.cta_url}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-navy hover:opacity-75 transition-opacity"
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
