import CalendarForm from "@/app/admin/content/_components/CalendarForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Calendar Draft — Content Admin" };

export default function NewCalendarPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/content/calendar"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Calendar
        </Link>
        <span className="text-xs text-gray-300">/</span>
        <span className="text-xs text-gray-500">Create draft</span>
      </div>
      <CalendarForm />
    </div>
  );
}
