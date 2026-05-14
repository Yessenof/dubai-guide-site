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
