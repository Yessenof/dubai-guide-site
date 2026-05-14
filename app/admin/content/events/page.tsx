import { getAllEvents } from "@/lib/db/news-events-calendar-admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events — Content Admin" };

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

function DateConfidenceBadge({ confidence }: { confidence: string }) {
  if (confidence === "confirmed") {
    return <span className="text-xs font-medium text-emerald-600">confirmed</span>;
  }
  if (confidence === "expected") {
    return <span className="text-xs font-medium text-amber-600">expected</span>;
  }
  return (
    <span className="text-xs font-medium text-red-500">subj. to confirm.</span>
  );
}

export default function EventsAdminPage() {
  const events = getAllEvents();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Public holidays, government deadlines, and major Dubai events.
          </p>
        </div>
        <Link
          href="/admin/content/events/new"
          className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          + Create draft
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {events.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-400">No events yet.</p>
            <Link
              href="/admin/content/events/new"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Create your first event →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Title
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Slug
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    RU
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Color
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Confidence
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Start
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    End
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Cal
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Updated
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                      event.status === "published"
                        ? "bg-emerald-50/30 hover:bg-emerald-50/50"
                        : event.status === "archived"
                          ? "opacity-55 hover:opacity-75"
                          : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs">
                      <span className="line-clamp-1">
                        {event.enTitle || (
                          <span className="italic text-gray-400">Untitled</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                      {event.slug}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {event.ruPublished ? (
                        <span className="text-xs font-medium text-emerald-600">
                          live
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 capitalize">
                      {event.category}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {event.colorType}
                    </td>
                    <td className="px-5 py-3.5">
                      <DateConfidenceBadge confidence={event.dateConfidence} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {event.eventDateStart || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {event.eventDateEnd || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {event.featuredCalendar ? (
                        <span className="text-xs text-emerald-600">✓</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {event.updatedAt.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/content/events/${event.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
