import EventForm from "@/app/(en)/admin/content/_components/EventForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Advanced Manual Draft — Events Admin" };

export default function NewEventPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/content/events"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Events
        </Link>
        <span className="text-xs text-gray-300">/</span>
        <h2 className="text-sm font-semibold text-gray-700">Advanced manual draft</h2>
      </div>

      <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
        <span className="font-semibold">Advanced Manual Editor.</span>{" "}
        Recommended workflow: start in{" "}
        <Link href="/admin/content/ai-inbox" className="underline font-medium">
          AI Inbox
        </Link>{" "}
        to classify and prepare a draft first. Use this form only for corrections, overrides,
        emergency edits, or final review.
      </div>

      <EventForm />
    </div>
  );
}
