import { getAllNewsPosts } from "@/lib/db/news-events-calendar-admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "News — Content Admin" };

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

export default function NewsAdminListPage() {
  const posts = getAllNewsPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">News draft library</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Official announcements, visa rule changes, and policy updates.
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
            href="/admin/content/news/new"
            className="text-sm font-medium text-slate-400 border border-slate-700 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Advanced manual draft
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
        {posts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-500">No news posts yet.</p>
            <Link
              href="/admin/content/news/new"
              className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create your first draft →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">RU</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Source</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Published</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className={`border-b border-slate-700/30 last:border-0 transition-colors ${
                    post.status === "published"
                      ? "bg-emerald-950/10 hover:bg-emerald-950/20"
                      : post.status === "archived"
                        ? "opacity-50 hover:opacity-70"
                        : "hover:bg-slate-800/50"
                  }`}
                >
                  <td className="px-5 py-3.5 font-medium max-w-xs">
                    <Link
                      href={`/admin/content/news/${post.id}`}
                      className="line-clamp-1 text-slate-200 hover:text-white transition-colors"
                    >
                      {post.enTitle || (
                        <span className="italic text-slate-500">Untitled</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {post.ruPublished ? (
                      <span className="text-xs font-medium text-emerald-400">live</span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {post.sourceUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <span>✓</span>
                        <span className="capitalize text-slate-400">{post.sourceLabel}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">No source</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {post.datePublished || (
                      <span className="text-slate-600">not set</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {post.updatedAt.slice(0, 10)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/content/news/${post.id}`}
                      className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
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
