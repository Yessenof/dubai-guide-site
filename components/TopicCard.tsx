import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import { localizeValue } from "@/lib/localize-value";

const LABELS = {
  en: { fee: "Fee",       time: "Time" },
  ru: { fee: "Стоимость", time: "Срок" },
};

const CATEGORY_RU: Record<string, string> = {
  "visas":         "Визы",
  "company-setup": "Регистрация компании",
  "government":    "Госуслуги",
  "hiring":        "Найм",
  "living":        "Жизнь в Дубае",
  "tourism":       "Туризм и краткосрочная аренда",
};

interface TopicCardProps {
  title: string;
  summary: string;
  price: string;
  timeline: string;
  slug: string;
  category?: string;
  locale?: "en" | "ru";
}

export default function TopicCard({
  title,
  summary,
  price,
  timeline,
  slug,
  category,
  locale = "en",
}: TopicCardProps) {
  const prefix         = locale === "ru" ? "/ru/guides" : "/guides";
  const L              = LABELS[locale];
  const displayPrice    = locale === "ru" ? localizeValue(price, "ru")    : price;
  const displayTimeline = locale === "ru" ? localizeValue(timeline, "ru") : timeline;
  const categoryLabel   = category
    ? locale === "ru"
      ? (CATEGORY_RU[category] ?? category.replace(/-/g, " "))
      : category.replace(/-/g, " ")
    : undefined;

  return (
    <Link href={`${prefix}/${slug}`} className="block group">
      <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">

        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
            {title}
          </h3>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
            →
          </span>
        </div>

        <p className="text-[13px] text-gray-600 leading-snug mb-3.5 line-clamp-2">
          {summary}
        </p>

        {/* Quick-answer stats — the primary data users want */}
        <div className="flex items-center gap-px bg-stone-200 rounded-xl overflow-hidden mb-3">
          <div className="flex-1 bg-stone-50 group-hover:bg-stone-100 transition-colors px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{L.fee}</p>
            <p className="text-[13px] font-bold text-navy leading-tight">{displayPrice}</p>
          </div>
          <div className="flex-1 bg-stone-50 group-hover:bg-stone-100 transition-colors px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{L.time}</p>
            <p className="text-[13px] font-semibold text-gray-700 leading-tight">{displayTimeline}</p>
          </div>
        </div>

        {category && (
          <span className="inline-flex items-center gap-1 text-xs text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
            <span className="text-brass flex-shrink-0">
              <CategoryIcon category={category} />
            </span>
            {categoryLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
