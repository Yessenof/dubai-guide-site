import type { CalendarPage } from "@/lib/db/schema";

interface DateEntry {
  date?: string;
  label_en?: string;
  label_ru?: string;
  type?: string;
  confidence?: string;
  source?: string;
}

function parseDates(datesJson: string): DateEntry[] {
  try {
    const parsed = JSON.parse(datesJson);
    if (Array.isArray(parsed)) return parsed as DateEntry[];
  } catch {
    // fall through
  }
  return [];
}

function colorDot(type: string | undefined): string {
  if (type === "public-holiday") return "bg-red-400";
  if (type === "important-date" || type === "deadline") return "bg-orange-400";
  return "bg-gray-300";
}

export default function CalendarPreview({ page }: { page: CalendarPage }) {
  const hasRuContent = page.ruTitle.trim() && page.ruBody.trim();
  const dates = parseDates(page.datesJson);
  const datesParseError = dates.length === 0 && page.datesJson.trim() && page.datesJson !== "[]";

  return (
    <div className="space-y-4">
      {/* EN Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
          EN Preview
        </span>

        {page.hasIslamicDates === 1 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <p className="text-xs text-amber-700">
              Islamic dates: ensure EN notes include &ldquo;subject to moon sighting&rdquo; disclaimer.
            </p>
          </div>
        )}

        {page.enTitle ? (
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {page.enTitle}
          </h2>
        ) : (
          <p className="text-sm italic text-gray-300">No title</p>
        )}

        {page.enSummary && (
          <p className="text-sm text-gray-600 leading-relaxed">{page.enSummary}</p>
        )}

        {/* Date list preview */}
        {datesParseError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
            <p className="text-xs text-red-700">dates_json parse error — check JSON syntax.</p>
          </div>
        )}

        {dates.length > 0 && (
          <div className="space-y-1.5 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 mb-2">{dates.length} date entries:</p>
            {dates.slice(0, 6).map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${colorDot(d.type)}`} />
                <span className="text-xs text-gray-600">
                  <span className="font-medium">{d.date || "?"}</span>
                  {d.label_en ? ` — ${d.label_en}` : ""}
                  {d.confidence && d.confidence !== "confirmed" ? (
                    <span className="ml-1 text-amber-600">({d.confidence.replace(/_/g, " ")})</span>
                  ) : null}
                </span>
              </div>
            ))}
            {dates.length > 6 && (
              <p className="text-xs text-gray-400">…and {dates.length - 6} more</p>
            )}
          </div>
        )}

        {page.enBody ? (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-6 whitespace-pre-wrap border-t border-gray-100 pt-3">
            {page.enBody}
          </p>
        ) : (
          <p className="text-xs italic text-gray-300">No body content yet</p>
        )}

        {page.enNotes && (
          <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-3 line-clamp-3">
            {page.enNotes}
          </p>
        )}
      </div>

      {/* RU Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
            RU Preview
          </span>
          {page.ruPublished ? (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              live
            </span>
          ) : page.ruTitle || page.ruBody ? (
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
              {page.ruTitle}
            </h2>
            {page.ruSummary && (
              <p className="text-sm text-gray-600 leading-relaxed">{page.ruSummary}</p>
            )}
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-6 whitespace-pre-wrap">
              {page.ruBody}
            </p>
          </>
        ) : (
          <p className="text-xs italic text-gray-300">No Russian content yet</p>
        )}
      </div>
    </div>
  );
}
