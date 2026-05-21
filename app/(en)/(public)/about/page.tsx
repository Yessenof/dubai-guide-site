import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Guidex Consulting",
  description: "Why Guidex Consulting exists and who it's for.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
        About
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 mb-6">
        Why this site exists.
      </h1>
      <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
        <p>
          Dubai&apos;s official processes — visas, company setup, hiring, relocation — span
          multiple government authorities with steps that are rarely explained clearly in one place.
        </p>
        <p>
          Every guide is structured around what you need to do, where to go, what it costs,
          and how long it takes — with direct notes on what to watch out for.
        </p>
        <p>
          Written in plain language. Kept up to date as procedures change.
        </p>
      </div>
    </div>
  );
}
