"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const WHATSAPP_HREF = "https://wa.me/971506304817";

const EN_NAV = [
  { label: "Find My Route",  href: "/find-my-visa" },
  { label: "Visas",          href: "/visas" },
  { label: "Company Setup",  href: "/company-setup" },
  { label: "Guides",         href: "/guides" },
];

const RU_NAV = [
  { label: "Найти маршрут",    href: "/ru/find-my-visa" },
  { label: "Визы",             href: "/ru/visas" },
  { label: "Компании",         href: "/ru/company-setup" },
  { label: "Гайды",            href: "/ru/guides" },
];

/** /ru → /   |   /ru/guides/foo → /guides/foo   |   / → /ru   |   /guides/foo → /ru/guides/foo */
function alternatePath(pathname: string): string {
  if (pathname === "/ru") return "/";
  if (pathname.startsWith("/ru/")) return pathname.slice(3);
  if (pathname === "/") return "/ru";
  return "/ru" + pathname;
}

export default function Header() {
  const pathname = usePathname();
  const isRu     = pathname === "/ru" || pathname.startsWith("/ru/");
  const navItems = isRu ? RU_NAV : EN_NAV;
  const logoHref = isRu ? "/ru" : "/";
  const altPath  = alternatePath(pathname);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">

      {/* Main row: logo left — RU pill + WhatsApp right (always visible) */}
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">

        <Link href={logoHref} className="flex-shrink-0 flex items-center">
          <Image
            src="/brand/logo-header.png"
            alt="Guidex Consulting"
            width={120}
            height={30}
            priority
          />
        </Link>

        {/* Desktop nav — fills middle space on sm+ */}
        <nav className="hidden sm:flex items-center gap-6 flex-1 px-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                isActive(href)
                  ? "text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right group: language pill + WhatsApp — always in top row */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link
            href={altPath}
            className="text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 rounded-full px-2.5 py-1"
          >
            {isRu ? "EN" : "RU"}
          </Link>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white text-[13px] font-semibold px-3.5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Mobile nav row: wraps naturally, no horizontal scroll */}
      <nav className="sm:hidden border-t border-gray-100">
        <div className="flex flex-wrap items-center px-4">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-2 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors ${
                isActive(href)
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

    </header>
  );
}
