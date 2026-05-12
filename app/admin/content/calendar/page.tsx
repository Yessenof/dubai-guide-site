export default function CalendarAdminPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Calendar Visual Posts</h2>
      <p className="text-sm text-gray-500 mb-8">
        Monthly and yearly calendar pages with verified date lists for Dubai.
      </p>

      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
        <p className="text-sm font-medium text-gray-500 mb-2">Calendar admin coming next</p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Each calendar post is a visual page — a cover image with a structured
          HTML date list, not a full interactive calendar app. This section will
          support creating monthly and yearly posts, managing the{" "}
          <code className="text-xs bg-gray-100 rounded px-1">dates_json</code>{" "}
          field, uploading a cover image, and publishing with an Islamic dates
          disclaimer when required.
        </p>
      </div>
    </div>
  );
}
