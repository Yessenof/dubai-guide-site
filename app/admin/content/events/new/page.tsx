import EventForm from "@/app/admin/content/_components/EventForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Event Draft — Content Admin" };

export default function NewEventPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/content/events"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Events
        </Link>
        <span className="text-xs text-gray-300">/</span>
        <h2 className="text-sm font-semibold text-gray-700">Create draft</h2>
      </div>
      <EventForm />
    </div>
  );
}
