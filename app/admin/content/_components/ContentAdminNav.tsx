"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACTIVE_SECTIONS = [
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
    <nav className="w-48 shrink-0 border-r border-gray-100 pr-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Active
      </p>
      <ul className="space-y-0.5 mb-6">
        {ACTIVE_SECTIONS.map(({ label, href }) => {
          const isActive =
            href === "/admin/content"
              ? pathname === "/admin/content"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Planned
      </p>
      <ul className="space-y-0.5">
        {PLANNED_SECTIONS.map((label) => (
          <li key={label} className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-300 bg-gray-100 rounded px-1 py-0.5">
              planned
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
