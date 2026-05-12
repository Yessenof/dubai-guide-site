export default function EventsAdminPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Events</h2>
      <p className="text-sm text-gray-500 mb-8">
        Public holidays, government deadlines, and major Dubai events.
      </p>

      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
        <p className="text-sm font-medium text-gray-500 mb-2">Events admin coming next</p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          This section will list all events with start/end dates, category, and
          schema eligibility. Supports creating and editing drafts, setting date
          confidence ("confirmed" vs. "subject to official confirmation"), and
          publishing once all required fields are verified.
        </p>
      </div>
    </div>
  );
}
