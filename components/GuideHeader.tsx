import CategoryIcon from "@/components/CategoryIcon";

interface GuideFrontmatter {
  title:    string;
  summary:  string;
  category: string;
}

interface GuideHeaderProps {
  frontmatter: GuideFrontmatter;
}

export default function GuideHeader({ frontmatter }: GuideHeaderProps) {
  const { title, summary, category } = frontmatter;

  return (
    <div>
      {/* Category label */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category={category} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 capitalize">
          {category.replace(/-/g, " ")}
        </p>
      </div>

      {/* Title */}
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        {title}
      </h1>

      {/* Summary — 1–2 sentences, answer-first */}
      <p className="text-[15px] text-gray-600 leading-relaxed">{summary}</p>
    </div>
  );
}
