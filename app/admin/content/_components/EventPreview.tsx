import type { HubEvent } from "@/lib/db/schema";

export default function EventPreview({ event }: { event: HubEvent }) {
  const hasRuContent = event.ruTitle.trim() && event.ruBody.trim();
  const isNonConfirmed = event.dateConfidence !== "confirmed";

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
          EN Preview
        </span>
        {isNonConfirmed && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <p className="text-xs text-amber-700">
              Date confidence: {event.dateConfidence.replace(/_/g, " ")}. Verify body includes uncertainty disclaimer.
            </p>
          </div>
        )}
        {event.enTitle ? (
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {event.enTitle}
          </h2>
        ) : (
          <p className="text-sm italic text-gray-300">No title</p>
        )}
        {event.eventDateStart && (
          <p className="text-xs text-gray-500">
            {event.eventDateStart}
            {event.eventDateEnd ? ` — ${event.eventDateEnd}` : ""}
          </p>
        )}
        {event.enSummary && (
          <p className="text-sm text-gray-600 leading-relaxed">{event.enSummary}</p>
        )}
        {event.enBody ? (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-6 whitespace-pre-wrap">
            {event.enBody}
          </p>
        ) : (
          <p className="text-xs italic text-gray-300">No body content yet</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
            RU Preview
          </span>
          {event.ruPublished ? (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              live
            </span>
          ) : event.ruTitle || event.ruBody ? (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              saved, not published
            </span>
          ) : (
            <span className="text-xs text-gray-400">not published</span>
          )}
        </div>
        {hasRuContent ? (
          <>
            <h2 className="text-base font-semibold text-gray-900 leading-snug">
              {event.ruTitle}
            </h2>
            {event.ruSummary && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.ruSummary}
              </p>
            )}
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-6 whitespace-pre-wrap">
              {event.ruBody}
            </p>
          </>
        ) : (
          <p className="text-xs italic text-gray-300">No Russian content yet</p>
        )}
      </div>
    </div>
  );
}
