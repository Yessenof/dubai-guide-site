import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Dubai Guide",
  description: "Why Dubai Guide exists and who it's for.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
        About
      </p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Why this site exists.
      </h1>
      <div className="space-y-4 text-base text-gray-600 leading-relaxed">
        <p>
          Dubai&apos;s official processes — company setup, visas, hiring, relocation — involve
          multiple government authorities, specific documents, and steps that are not always
          clearly explained in one place.
        </p>
        <p>
          This site is a practical reference for people navigating those processes. Every guide
          is structured around what you need to do, where to go, what it costs, and how long it
          takes — with honest notes on what to watch out for.
        </p>
        <p>
          Guides are written in plain language and kept up to date as procedures change.
        </p>
      </div>
    </div>
  );
}
