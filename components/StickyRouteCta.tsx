"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Routes where the sticky CTA must not appear
const HIDDEN_ON = ["/find-my-visa"];

// Scroll distance (px) before the bar becomes visible
const SCROLL_THRESHOLD = 100;

export default function StickyRouteCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    // Check immediately — handles page load while already scrolled
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    /*
     * sm:hidden       — mobile only; desktop nav already shows "Find My Route"
     * z-40            — below the sticky header (z-50)
     * pb-[env]        — clears the iPhone home indicator / bottom safe area
     * translate-y-full → translate-y-0 — slides up from below instead of snapping in
     */
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-200 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <Link
        href="/find-my-visa"
        className="flex items-center justify-between gap-4 bg-navy px-5 py-3 text-white"
      >
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-tight">
            Find My Route
          </p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">
            Answer 2–3 quick questions
          </p>
        </div>
        <span className="text-base text-white/80 flex-shrink-0">→</span>
      </Link>
    </div>
  );
}
