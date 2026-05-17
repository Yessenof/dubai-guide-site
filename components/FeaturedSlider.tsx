"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { GuideListItem } from "@/lib/db/reader";

const IMG_DIFC = "/images/hubs/difc-business-bay-glass-towers.webp";

// CSS gradients for slides 1+ (when no photo)
const SLIDE_GRADIENTS = [
  "linear-gradient(135deg, #1B2E4B 0%, #0A1628 100%)",
  "linear-gradient(135deg, #1C1917 0%, #2C2825 100%)",
];

function catLabel(cat: string): string {
  const MAP: Record<string, string> = {
    visas:           "Visas",
    "company-setup": "Company Setup",
    government:      "Government",
    living:          "Dubai Life",
    hiring:          "Hiring",
  };
  return MAP[cat] ?? cat.replace(/-/g, " ");
}

interface Props {
  guides: GuideListItem[];
}

export default function FeaturedSlider({ guides }: Props) {
  const [current, setCurrent] = useState(0);
  const pausedRef   = useRef(false);
  const touchXRef   = useRef<number | null>(null);
  const count = guides.length;

  // Auto-rotate every 4.5s, skip if paused
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % count);
    }, 4500);
    return () => clearInterval(id);
  }, [count]);

  if (!guides.length) return null;

  const goNext = () => setCurrent((c) => (c + 1) % count);
  const goPrev = () => setCurrent((c) => (c - 1 + count) % count);

  return (
    <section aria-labelledby="featured-heading" className="pb-2">

      {/* Section header */}
      <div className="flex items-center justify-between px-5 mb-2 max-w-2xl mx-auto">
        <h2
          id="featured-heading"
          className="text-[11px] font-semibold uppercase tracking-widest text-gray-500"
        >
          Dubai updates to know
        </h2>
        <Link
          href="/guides"
          className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors"
        >
          All guides →
        </Link>
      </div>

      {/* Slider */}
      <div className="px-5 max-w-2xl mx-auto">
        <div
          className="relative h-[215px] rounded-2xl overflow-hidden shadow-sm"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onTouchStart={(e) => { touchXRef.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchXRef.current === null) return;
            const diff = touchXRef.current - e.changedTouches[0].clientX;
            if (diff > 50) goNext();
            else if (diff < -50) goPrev();
            touchXRef.current = null;
          }}
        >

          {/* ── Sliding track ──────────────────────────────────────────────── */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              width:     `${count * 100}%`,
              transform: `translateX(-${(current / count) * 100}%)`,
            }}
          >
            {guides.map((guide, i) => (
              <div
                key={guide.slug}
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / count}%` }}
              >
                <Link
                  href={`/guides/${guide.slug}`}
                  className="block h-full"
                  tabIndex={i === current ? 0 : -1}
                >
                  {/* Background: photo for slide 0, CSS gradient for others */}
                  {i === 0 ? (
                    <>
                      <Image
                        src={IMG_DIFC}
                        alt={guide.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 672px) calc(100vw - 40px), 632px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/10" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: SLIDE_GRADIENTS[(i - 1) % SLIDE_GRADIENTS.length] }}
                    />
                  )}

                  {/* Content — pb-10 leaves room for the progress dots */}
                  <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1">
                      {catLabel(guide.category)} guide
                    </p>
                    <p
                      className="text-[20px] font-bold text-white leading-tight line-clamp-2 mb-2"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                    >
                      {guide.title}
                    </p>
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        {guide.price && (
                          <p className="text-[11px] text-white/65 truncate">{guide.price}</p>
                        )}
                        {guide.timeline && (
                          <p className="text-[11px] text-white/65 truncate">{guide.timeline}</p>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-[13px] font-semibold text-white">
                        Read guide →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* ── Prev arrow ─────────────────────────────────────────────────── */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous guide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* ── Next arrow ─────────────────────────────────────────────────── */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next guide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* ── Progress dots ───────────────────────────────────────────────── */}
          {count > 1 && (
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {guides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
