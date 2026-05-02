import CategoryIcon from "@/components/CategoryIcon";

interface GuideFrontmatter {
  title:    string;
  summary:  string;
  category: string;
}

interface GuideHeaderProps {
  frontmatter: GuideFrontmatter;
  locale?: "en" | "ru";
}

const CATEGORY_RU: Record<string, string> = {
  "visas":               "Визы",
  "visa":                "Визы",
  "company-setup":       "Компании",
  "business-setup":      "Компании",
  "government":          "Госуслуги",
  "government-services": "Госуслуги",
  "hiring":              "Найм",
  "living":              "Проживание",
  "tourism":             "Туризм",
};

export default function GuideHeader({ frontmatter, locale = "en" }: GuideHeaderProps) {
  const { title, summary, category } = frontmatter;

  const categoryLabel =
    locale === "ru"
      ? (CATEGORY_RU[category] ?? category.replace(/-/g, " "))
      : category.replace(/-/g, " ");

  return (
    <div>
      {/* Category label */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category={category} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 capitalize">
          {categoryLabel}
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
