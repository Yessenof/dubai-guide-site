import Link from "next/link";

type SectionCard = {
  label: string;
  description: string;
  href?: string;
  phase?: string;
  status: "active" | "planned";
};

const SECTIONS: SectionCard[] = [
  {
    label: "News",
    description: "Dubai news posts — official announcements, visa rule changes, policy updates.",
    href: "/admin/content/news",
    status: "active",
  },
  {
    label: "Events",
    description: "Public holidays, government deadlines, major Dubai events.",
    href: "/admin/content/events",
    status: "active",
  },
  {
    label: "Calendar Visual Posts",
    description: "Monthly and yearly calendar pages with verified date lists.",
    href: "/admin/content/calendar",
    status: "active",
  },
  {
    label: "AI Draft Assistant",
    description: "Generate EN drafts and RU translations from structured inputs via Claude API.",
    phase: "Phase 4B",
    status: "planned",
  },
  {
    label: "Guides / Articles",
    description: "Step-by-step procedure guides — visas, company setup, government processes.",
    phase: "Phase 4E",
    status: "planned",
  },
  {
    label: "Media Library",
    description: "Uploaded images, alt-text management, and image path assignment.",
    phase: "Phase 4D",
    status: "planned",
  },
];

export default function ContentAdminDashboard() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Content Admin</h1>
      <p className="text-sm text-gray-500 mb-8">
        Manage all Guidex content types — news, events, and calendar posts.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div
            key={s.label}
            className={`rounded-lg border p-5 ${
              s.status === "active"
                ? "border-gray-200 bg-white"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`text-sm font-semibold ${
                  s.status === "active" ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {s.status === "planned" && s.phase && (
                <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-300 bg-gray-100 rounded px-1.5 py-0.5">
                  {s.phase}
                </span>
              )}
              {s.status === "active" && (
                <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
                  active
                </span>
              )}
            </div>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                s.status === "active" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {s.description}
            </p>
            {s.status === "active" && s.href && (
              <Link
                href={s.href}
                className="inline-flex items-center text-xs font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
              >
                Open
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
