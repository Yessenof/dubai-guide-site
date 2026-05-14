import {
  getEventById,
  eventsRowToInput,
} from "@/lib/db/news-events-calendar-admin";
import { validateEventPublish } from "@/lib/admin-validation/news-events-calendar";
import EventForm from "@/app/admin/content/_components/EventForm";
import EventStatusPanel from "@/app/admin/content/_components/EventStatusPanel";
import EventPreview from "@/app/admin/content/_components/EventPreview";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params:       Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);
  return { title: `Edit: ${event?.enTitle || id} — Events Admin` };
}

export default async function EditEventPage({ params, searchParams }: Props) {
  const { id }    = await params;
  const { saved } = await searchParams;

  const event = getEventById(id);
  if (!event) notFound();

  const input = eventsRowToInput(event);
  const pubValidation = validateEventPublish(input);

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
        <span className="text-xs font-mono text-gray-500">{event.slug}</span>
      </div>

      <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
        <span className="font-semibold">Advanced Manual Editor.</span>{" "}
        Use{" "}
        <a href="/admin/content/ai-inbox" className="underline font-medium">AI Inbox</a>{" "}
        for new content. This form is for corrections, overrides, and final review only.
      </div>

      <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-xs">
        <span className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full ${
          event.status === "published" ? "text-emerald-700 bg-emerald-50"
            : event.status === "archived" ? "text-gray-400 bg-gray-100"
            : "text-gray-500 bg-gray-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            event.status === "published" ? "bg-emerald-500"
              : event.status === "archived" ? "bg-gray-300"
              : "bg-gray-400"
          }`} />
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
        {pubValidation.errors.length > 0 ? (
          <span className="text-gray-400">
            {pubValidation.errors.length} publish requirement{pubValidation.errors.length !== 1 ? "s" : ""} not met — see right panel
          </span>
        ) : (
          <span className="text-emerald-600 font-medium">Ready to publish</span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <EventForm
          key={saved ?? "init"}
          defaultValues={event}
          savedTs={saved}
        />
        <div className="space-y-4">
          <EventStatusPanel
            eventId={event.id}
            status={event.status}
            dateConfidence={event.dateConfidence}
            publishErrors={pubValidation.errors}
            publishWarnings={pubValidation.warnings}
          />
          <EventPreview event={event} />
        </div>
      </div>
    </div>
  );
}
