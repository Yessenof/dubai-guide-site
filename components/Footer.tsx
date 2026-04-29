"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/locale-path";

export default function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isRu = locale === "ru";

  const contactHref = isRu ? "/ru/contact" : "/contact";
  const contactLabel = isRu ? "Контакты" : "Contact";
  const aboutLabel = isRu ? "О нас" : "About";

  return (
    <footer className="border-t border-gray-100 mt-10">
      <div className="max-w-2xl mx-auto px-5 py-6 flex items-center justify-between">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Guidex Consulting</p>
        <nav className="flex items-center gap-5">
          <Link href="/about"       className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{aboutLabel}</Link>
          <Link href={contactHref}  className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{contactLabel}</Link>
        </nav>
      </div>
    </footer>
  );
}
