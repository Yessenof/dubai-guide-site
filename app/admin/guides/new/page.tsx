import { createGuideAction } from "@/app/admin/actions";
import GuideFormFields from "@/components/admin/GuideFormFields";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Guide — Admin" };

export default function AdminNewGuidePage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/guides"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← All guides
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 mt-1">New guide</h1>
        </div>
      </div>

      {/* Form */}
      <form action={createGuideAction}>
        <GuideFormFields />

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Create guide
          </button>
        </div>
      </form>
    </div>
  );
}
