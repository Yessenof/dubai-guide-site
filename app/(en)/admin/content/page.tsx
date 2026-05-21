import Link from "next/link";
import { getAllNewsPosts, getAllEvents, getAllCalendarPages } from "@/lib/db/news-events-calendar-admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editorial — Content Admin" };

export default function ContentAdminDashboard() {
  const news      = getAllNewsPosts();
  const events    = getAllEvents();
  const calendars = getAllCalendarPages();

  const newsDrafts      = news.filter((p) => p.status === "draft").length;
  const newsPublished   = news.filter((p) => p.status === "published").length;
  const eventDrafts     = events.filter((e) => e.status === "draft").length;
  const eventPublished  = events.filter((e) => e.status === "published").length;
  const calDrafts       = calendars.filter((c) => c.status === "draft").length;
  const calPublished    = calendars.filter((c) => c.status === "published").length;

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Editorial</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-first content operation for the Dubai procedures hub.
        </p>
      </div>

      {/* AI Inbox — primary CTA */}
      <div className="rounded-2xl bg-gray-900 text-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Primary workflow
            </p>
            <h2 className="text-base font-semibold">Create with AI</h2>
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Paste a URL, government update, media article, Telegram note, event link,
              PDF note, or your own idea. Guidex AI will classify it and prepare a structured draft.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 rounded px-2 py-0.5">
                AI runtime not connected — local classifier active
              </span>
            </div>
          </div>
          <Link
            href="/admin/content/ai-inbox"
            className="shrink-0 rounded-xl bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 hover:bg-gray-100 transition-colors"
          >
            Open AI Inbox →
          </Link>
        </div>
      </div>

      {/* Daily Digest — planned */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Daily Digest
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Scan approved sources → collect official / media / social signals → select items
              → AI prepares drafts → human approves.
            </p>
          </div>
          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-gray-300 bg-gray-200 rounded px-2 py-0.5 ml-4">
            Not connected
          </span>
        </div>
      </div>

      {/* Draft Libraries */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Draft libraries
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/content/news"
            className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">News</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {newsDrafts} draft{newsDrafts !== 1 ? "s" : ""} · {newsPublished} published
            </p>
          </Link>
          <Link
            href="/admin/content/events"
            className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">Events</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {eventDrafts} draft{eventDrafts !== 1 ? "s" : ""} · {eventPublished} published
            </p>
          </Link>
          <Link
            href="/admin/content/calendar"
            className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">Calendar Visual Posts</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {calDrafts} draft{calDrafts !== 1 ? "s" : ""} · {calPublished} published
            </p>
          </Link>
        </div>
      </div>

      {/* Advanced manual editor — demoted */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Advanced — manual editor
        </p>
        <p className="text-xs text-gray-400 mb-3">
          Use only for corrections, overrides, emergency edits, or final review.
          The AI Inbox is the recommended starting point for new content.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/content/news/new"
            className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Manual news draft
          </Link>
          <Link
            href="/admin/content/events/new"
            className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Manual event draft
          </Link>
          <Link
            href="/admin/content/calendar/new"
            className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Manual calendar draft
          </Link>
        </div>
      </div>

      {/* Planned sections */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Planned content types
        </p>
        <div className="space-y-1.5">
          {["Guides / Articles", "Services", "Dubai Life Setup", "Areas / Map Data", "Media Library"].map((label) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-300 bg-gray-100 rounded px-1.5 py-0.5">
                planned
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
