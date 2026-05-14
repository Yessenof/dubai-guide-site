import { getAllCalendarPages } from "@/lib/db/news-events-calendar-admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Calendar — Content Admin" };

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Published
      </span>
    );
  }
  if (status === "archived") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
        Archived
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
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
          <h2 className="text-lg font-semibold text-gray-900">Calendar Visual Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Monthly and yearly calendar pages with verified date lists.
          </p>
        </div>
        <Link
          href="/admin/content/calendar/new"
          className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          + Create draft
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {pages.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-400">No calendar pages yet.</p>
            <Link
              href="/admin/content/calendar/new"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Create your first calendar page →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">RU</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Year</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Dates</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Image</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Verified</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const count = datesCount(page.datesJson);
                return (
                  <tr
                    key={page.id}
                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                      page.status === "published"
                        ? "bg-emerald-50/30 hover:bg-emerald-50/50"
                        : page.status === "archived"
                          ? "opacity-55 hover:opacity-75"
                          : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs">
                      <span className="line-clamp-1">
                        {page.enTitle || (
                          <span className="italic text-gray-400">Untitled</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {page.ruPublished ? (
                        <span className="text-xs font-medium text-emerald-600">live</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 capitalize">
                      {page.calendarType}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {page.year || "—"}
                      {page.month ? `/${String(page.month).padStart(2, "0")}` : ""}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {count > 0 ? (
                        <span className="font-medium text-gray-700">{count}</span>
                      ) : (
                        <span className="text-red-400">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {page.imagePath ? (
                        page.imageAlt ? (
                          <span className="text-emerald-700 font-medium">Set</span>
                        ) : (
                          <span className="text-amber-600">Path, no alt</span>
                        )
                      ) : (
                        <span className="text-red-400">Missing</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {page.lastVerifiedDate || (
                        <span className="text-red-400">Not set</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {page.updatedAt.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/content/calendar/${page.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
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
