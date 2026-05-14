import {
  getCalendarPageById,
  calendarRowToInput,
} from "@/lib/db/news-events-calendar-admin";
import { validateCalendarPublish } from "@/lib/admin-validation/news-events-calendar";
import CalendarForm from "@/app/admin/content/_components/CalendarForm";
import CalendarStatusPanel from "@/app/admin/content/_components/CalendarStatusPanel";
import CalendarPreview from "@/app/admin/content/_components/CalendarPreview";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params:       Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

function parseDatesCount(datesJson: string): number {
  try {
    const parsed = JSON.parse(datesJson);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const page = getCalendarPageById(id);
  return { title: `Edit: ${page?.enTitle || id} — Calendar Admin` };
}

export default async function EditCalendarPage({ params, searchParams }: Props) {
  const { id }    = await params;
  const { saved } = await searchParams;

  const page = getCalendarPageById(id);
  if (!page) notFound();

  const input = calendarRowToInput(page);
  const pubValidation = validateCalendarPublish(input);

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
        <span className="text-xs font-mono text-gray-500">{page.slug}</span>
      </div>

      <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
        <span className="font-semibold">Advanced Manual Editor.</span>{" "}
        Use{" "}
        <a href="/admin/content/ai-inbox" className="underline font-medium">AI Inbox</a>{" "}
        for new content. This form is for corrections, overrides, and final review only.
      </div>

      <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-xs">
        <span className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full ${
          page.status === "published" ? "text-emerald-700 bg-emerald-50"
            : page.status === "archived" ? "text-gray-400 bg-gray-100"
            : "text-gray-500 bg-gray-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            page.status === "published" ? "bg-emerald-500"
              : page.status === "archived" ? "bg-gray-300"
              : "bg-gray-400"
          }`} />
          {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
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
        <CalendarForm
          key={saved ?? "init"}
          defaultValues={page}
          savedTs={saved}
        />
        <div className="space-y-4">
          <CalendarStatusPanel
            calendarId={page.id}
            status={page.status}
            hasIslamicDates={page.hasIslamicDates}
            datesJsonCount={parseDatesCount(page.datesJson)}
            lastVerifiedDate={page.lastVerifiedDate}
            imagePath={page.imagePath}
            imageAlt={page.imageAlt}
            publishErrors={pubValidation.errors}
            publishWarnings={pubValidation.warnings}
          />
          <CalendarPreview page={page} />
        </div>
      </div>
    </div>
  );
}
