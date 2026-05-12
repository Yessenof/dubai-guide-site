export default function NewsAdminPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">News</h2>
      <p className="text-sm text-gray-500 mb-8">
        Dubai news posts — official announcements, visa rule changes, policy updates.
      </p>

      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-8 py-12 text-center">
        <p className="text-sm font-medium text-gray-500 mb-2">News admin coming next</p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          This section will list all news posts with draft/published status, allow
          creating new drafts, editing existing posts, and publishing. Inline RU
          translation fields and a "Generate RU draft" action via Claude API are
          planned for Phase 4B.
        </p>
      </div>
    </div>
  );
}
