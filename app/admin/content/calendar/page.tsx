import { getAllCalendarPages } from "@/lib/db/news-events-calendar-admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Calendar — Content Admin" };

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Published
      </span>
    );
  }
  if (status === "archived") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
        Archived
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
      Draft
    </span>
  );
}

function datesCount(datesJson: string): number {
  try {
    const parsed = JSON.parse(datesJson);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function CalendarAdminPage() {
  const pages = getAllCalendarPages();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Calendar visual posts</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monthly and yearly calendar pages with verified date lists.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/content/ai-inbox"
            className="text-sm font-semibold bg-white text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Create with AI
          </Link>
          <Link
            href="/admin/content/calendar/new"
            className="text-sm font-medium text-slate-400 border border-slate-700 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Advanced manual draft
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
        {pages.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-500">No calendar pages yet.</p>
            <Link
              href="/admin/content/calendar/new"
              className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create your first calendar page →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">RU</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Type</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Year</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Dates</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Image</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Verified</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const count = datesCount(page.datesJson);
                return (
                  <tr
                    key={page.id}
                    className={`border-b border-slate-700/30 last:border-0 transition-colors ${
                      page.status === "published"
                        ? "bg-emerald-950/10 hover:bg-emerald-950/20"
                        : page.status === "archived"
                          ? "opacity-50 hover:opacity-70"
                          : "hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium max-w-xs">
                      <Link
                        href={`/admin/content/calendar/${page.id}`}
                        className="line-clamp-1 text-slate-200 hover:text-white transition-colors"
                      >
                        {page.enTitle || (
                          <span className="italic text-slate-500">Untitled</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {page.ruPublished ? (
                        <span className="text-xs font-medium text-emerald-400">live</span>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 capitalize">
                      {page.calendarType}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {page.year || "—"}
                      {page.month ? `/${String(page.month).padStart(2, "0")}` : ""}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {count > 0 ? (
                        <span className="font-medium text-slate-300">{count}</span>
                      ) : (
                        <span className="text-red-400">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {page.imagePath ? (
                        page.imageAlt ? (
                          <span className="text-emerald-400 font-medium">Set</span>
                        ) : (
                          <span className="text-amber-400">Path, no alt</span>
                        )
                      ) : (
                        <span className="text-red-400">Missing</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {page.lastVerifiedDate || (
                        <span className="text-red-400">Not set</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {page.updatedAt.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/content/calendar/${page.id}`}
                        className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
