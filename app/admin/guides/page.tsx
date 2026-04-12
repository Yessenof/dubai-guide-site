import { getAllGuides } from "@/lib/db/writer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Guides — Admin" };

export default function AdminGuidesPage() {
  const guides = getAllGuides();

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Guides</h1>
        <Link
          href="/admin/guides/new"
          className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          + New guide
        </Link>
      </div>

      {/* Guides table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {guides.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-400">No guides yet.</p>
            <Link
              href="/admin/guides/new"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Create your first guide →
            </Link>
          </div>
        ) : (
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
                  Category
                </th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                  Updated
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr
                  key={guide.slug}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    {guide.enTitle}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                    {guide.slug}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 capitalize">
                    {guide.category}
                  </td>
                  <td className="px-5 py-3.5">
                    {guide.published ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {guide.lastUpdated}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/guides/${guide.slug}`}
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
