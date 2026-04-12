import Link from "next/link";

interface GuideFrontmatter {
  title:       string;
  summary:     string;
  price:       string;
  timeline:    string;
  audience:    string;
  category:    string;
  lastUpdated: string;
}

interface GuideHeaderProps {
  frontmatter: GuideFrontmatter;
}

export default function GuideHeader({ frontmatter }: GuideHeaderProps) {
  const { title, summary, price, timeline, audience, category, lastUpdated } =
    frontmatter;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/guides"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-7"
      >
        ← All guides
      </Link>

      {/* Category label */}
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3 capitalize">
        {category}
      </p>

      {/* Title */}
      <h1 className="text-[26px] font-semibold text-gray-900 leading-snug mb-4">
        {title}
      </h1>

      {/* Summary */}
      <p className="text-[15px] text-gray-500 leading-relaxed mb-7">{summary}</p>

      {/* Metadata grid — gap-px on bg-gray-100 creates clean cell dividers */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden">
        <div className="bg-white px-4 py-3.5">
          <p className="text-xs text-gray-400 mb-1">Estimated cost</p>
          <p className="text-sm font-semibold text-gray-900">{price}</p>
        </div>
        <div className="bg-white px-4 py-3.5">
          <p className="text-xs text-gray-400 mb-1">Timeline</p>
          <p className="text-sm font-semibold text-gray-900">{timeline}</p>
        </div>
        <div className="bg-white px-4 py-3.5 col-span-2">
          <p className="text-xs text-gray-400 mb-1">Who this is for</p>
          <p className="text-sm text-gray-700">{audience}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">Last updated: {lastUpdated}</p>
    </div>
  );
}
