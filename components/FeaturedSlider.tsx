"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── Unified carousel slide type ─────────────────────────────────────────────
// Built by the parent server component (page.tsx) from any content type.
// Every slide always has a bgImage — no more empty dark gradients.

export interface CarouselSlide {
  href:    string;
  title:   string;
  badge:   string;   // e.g. "Event", "News", "Calendar", "Visas guide"
  meta?:   string;   // date string, price range, etc.
  bgImage: string;   // path to background photo (always set)
  cta:     string;   // "View event →", "Read article →", "Read guide →"
}

interface Props {
  slides: CarouselSlide[];
  locale?: "en" | "ru";
  sectionLabel?: string;
  allHref?:      string;
  allText?:      string;
}

export default function FeaturedSlider({
  slides,
  locale = "en",
  sectionLabel,
  allHref,
  allText,
}: Props) {
  const [current, setCurrent] = useState(0);
  const pausedRef  = useRef(false);
  const touchXRef  = useRef<number | null>(null);
  const count = slides.length;

  const isRu = locale === "ru";
  const label   = sectionLabel ?? (isRu ? "Что важно знать" : "Key Dubai updates");
  const linkHref = allHref ?? (isRu ? "/ru/guides" : "/guides");
  const linkText = allText ?? (isRu ? "Все гайды →" : "All guides →");

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % count);
    }, 4500);
    return () => clearInterval(id);
  }, [count]);

  if (!slides.length) return null;

  const goNext = () => setCurrent((c) => (c + 1) % count);
  const goPrev = () => setCurrent((c) => (c - 1 + count) % count);

  return (
    <section aria-labelledby="featured-heading" className="px-5 pb-2">

      {/* Section header */}
      <div className="flex items-center justify-between mb-2 max-w-2xl mx-auto">
        <h2
          id="featured-heading"
          className="text-[11px] font-semibold uppercase tracking-widest text-gray-500"
        >
          {label}
        </h2>
        <Link
          href={linkHref}
          className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors"
        >
          {linkText}
        </Link>
      </div>

      {/* Slider */}
      <div className="max-w-2xl mx-auto">
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
          {/* Sliding track */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              width:     `${count * 100}%`,
              transform: `translateX(-${(current / count) * 100}%)`,
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={`${slide.href}-${i}`}
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / count}%` }}
              >
                <Link
                  href={slide.href}
                  className="block h-full"
                  tabIndex={i === current ? 0 : -1}
                >
                  {/* Background photo — all slides have an image */}
                  <Image
                    src={slide.bgImage}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) calc(100vw - 40px), 632px"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/10" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1">
                      {slide.badge}
                    </p>
                    <p
                      className="text-[20px] font-bold text-white leading-tight line-clamp-2 mb-2"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                    >
                      {slide.title}
                    </p>
                    <div className="flex items-end justify-between gap-2">
                      {slide.meta && (
                        <p className="text-[11px] text-white/65 truncate min-w-0 flex-1">
                          {slide.meta}
                        </p>
                      )}
                      <span className="flex-shrink-0 text-[13px] font-semibold text-white">
                        {slide.cta}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Prev arrow */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Progress dots */}
          {count > 1 && (
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  aria-label={`Slide ${i + 1}`}
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
