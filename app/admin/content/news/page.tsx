import { getAllNewsPosts } from "@/lib/db/news-events-calendar-admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "News — Content Admin" };

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

export default function NewsAdminListPage() {
  const posts = getAllNewsPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">News</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            UAE/Dubai regulatory updates and announcements.
          </p>
        </div>
        <Link
          href="/admin/content/news/new"
          className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          + Create draft
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-400">No news posts yet.</p>
            <Link
              href="/admin/content/news/new"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Create your first draft →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">RU</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Source</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Published</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className={`border-b border-gray-100 last:border-0 transition-colors ${
                    post.status === "published"
                      ? "bg-emerald-50/30 hover:bg-emerald-50/50"
                      : post.status === "archived"
                        ? "opacity-55 hover:opacity-75"
                        : "hover:bg-gray-50/60"
                  }`}
                >
                  <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs">
                    <span className="line-clamp-1">
                      {post.enTitle || (
                        <span className="italic text-gray-400">Untitled</span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {post.ruPublished ? (
                      <span className="text-xs font-medium text-emerald-600">live</span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {post.sourceUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                        <span className="text-emerald-500">✓</span>
                        <span className="capitalize text-gray-500">{post.sourceLabel}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">No source</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {post.datePublished || (
                      <span className="text-gray-300">not set</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {post.updatedAt.slice(0, 10)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/content/news/${post.id}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
