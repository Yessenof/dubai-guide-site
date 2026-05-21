"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACTIVE_SECTIONS = [
  { label: "AI Inbox", href: "/admin/content/ai-inbox" },
  { label: "Dashboard", href: "/admin/content" },
  { label: "News", href: "/admin/content/news" },
  { label: "Events", href: "/admin/content/events" },
  { label: "Calendar Visual Posts", href: "/admin/content/calendar" },
];

const PLANNED_SECTIONS = [
  "Guides / Articles",
  "Services",
  "Dubai Life Setup",
  "Areas / Map Data",
  "Media Library",
  "SEO Review",
  "Audit Log",
];

export default function ContentAdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-48 shrink-0 border-r border-slate-700/50 pr-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
        Active
      </p>
      <ul className="space-y-0.5 mb-6">
        {ACTIVE_SECTIONS.map(({ label, href }) => {
          const isActive =
            href === "/admin/content"
              ? pathname === "/admin/content"
              : pathname === href || pathname.startsWith(href + "/");
          const isInbox = href === "/admin/content/ai-inbox";
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-1.5 rounded px-2 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-slate-800 font-medium text-slate-50"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {isInbox && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">
        Planned
      </p>
      <ul className="space-y-0.5">
        {PLANNED_SECTIONS.map((label) => (
          <li key={label} className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm text-slate-600">{label}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-600 bg-slate-800 rounded px-1 py-0.5">
              planned
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
