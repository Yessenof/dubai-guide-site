import NewsForm from "@/app/admin/content/_components/NewsForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create News Draft — Content Admin" };

export default function NewNewsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/content/news"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← News
        </Link>
        <span className="text-xs text-gray-300">/</span>
        <h2 className="text-sm font-semibold text-gray-700">Create draft</h2>
      </div>
      <NewsForm />
    </div>
  );
}
