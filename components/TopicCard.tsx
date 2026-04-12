import Link from "next/link";

interface TopicCardProps {
  title: string;
  summary: string;
  price: string;
  timeline: string;
  slug: string;
  category?: string;
}

export default function TopicCard({
  title,
  summary,
  price,
  timeline,
  slug,
  category,
}: TopicCardProps) {
  return (
    <Link href={`/guides/${slug}`} className="block group">
      <div className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:bg-gray-50/50 transition-all bg-white">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
            {title}
          </h3>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
            →
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {summary}
        </p>
        <div className="flex items-center gap-2.5 flex-wrap">
          {category && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
              {category}
            </span>
          )}
          <span className="text-xs text-gray-400">{price}</span>
          <span className="text-gray-200 text-xs">·</span>
          <span className="text-xs text-gray-400">{timeline}</span>
        </div>
      </div>
    </Link>
  );
}
