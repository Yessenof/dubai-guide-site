import Link from "next/link";

const topics = [
  { label: "Company Setup", href: "/guides" },
  { label: "Visas", href: "/guides" },
  { label: "Hiring", href: "/guides" },
  { label: "Relocation", href: "/guides" },
  { label: "Government", href: "/guides" },
];

const valueItems = [
  { id: "01", label: "Full process", note: "Every step, in order" },
  { id: "02", label: "Cost per step", note: "Estimated AED amounts" },
  { id: "03", label: "Timeline", note: "Per step and overall" },
  { id: "04", label: "Warnings", note: "Common mistakes flagged" },
];

export default function Hero() {
  return (
    <section className="pt-12 pb-10 px-5">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
          Dubai
        </p>
        <h1 className="text-[28px] font-semibold text-gray-900 leading-snug mb-4">
          The complete guide to living and working in Dubai.
        </h1>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-7 max-w-md">
          Step-by-step guides for company setup, visas, hiring, and relocation.
          Every guide shows the full process with real costs, timelines, and
          honest warnings.
        </p>

        {/* Topic pills — immediately show the scope of the site */}
        <div className="flex flex-wrap gap-2 mb-8">
          {topics.map((topic) => (
            <Link
              key={topic.label}
              href={topic.href}
              className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {topic.label}
            </Link>
          ))}
        </div>

        {/* What every guide includes */}
        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
            Every guide includes
          </p>
          <div className="grid grid-cols-2 gap-2">
            {valueItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3.5"
              >
                <span className="text-xs font-mono text-gray-300 mt-0.5 flex-shrink-0 tabular-nums">
                  {item.id}
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
