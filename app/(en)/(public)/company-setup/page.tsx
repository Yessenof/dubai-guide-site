import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import CtaCard from "@/components/CtaCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Up a Company in Dubai — Guidex Consulting",
  description:
    "Two routes: mainland (DED-licensed, trade anywhere in the UAE) or free zone (100% ownership, lower cost, export-focused). Guides with exact government fees and timelines.",
};

type Route =
  | { title: string; description: string; meta: string; href: string }
  | { title: string; description: string; meta: string; soon: true };

const routes: Route[] = [
  {
    title: "Mainland Company Setup",
    description:
      "Retail, services, B2B, government contracts — any business selling to UAE customers. DED-licensed. Physical office required.",
    meta: "DED-licensed · Trade anywhere in the UAE",
    href: "/guides/mainland-company-setup-dubai",
  },
  {
    title: "Free Zone Company Setup",
    description:
      "Export, digital, or remote businesses. 100% foreign ownership. Most common: IFZA, DMCC, JAFZA.",
    meta: "Zone-licensed · 100% foreign ownership",
    href: "/guides/free-zone-company-setup-dubai",
  },
  {
    title: "Business Bank Account",
    description:
      "Required after company formation. Expect 2–6 weeks and a monthly balance requirement of AED 25,000–50,000.",
    meta: "Required after licensing · Step 2 of setup",
    href: "/guides/open-business-bank-account-dubai",
  },
];

const compareRows = [
  {
    label: "Sell to UAE customers",
    mainland: "Yes — directly",
    freezone: "No — needs a local agent",
  },
  {
    label: "Foreign ownership",
    mainland: "100% (since 2021)",
    freezone: "100%",
  },
  {
    label: "Office requirement",
    mainland: "Physical address required",
    freezone: "Flexi-desk available",
  },
  {
    label: "Typical setup cost",
    mainland: "AED 12,000–25,000+",
    freezone: "AED 6,000–18,000+",
  },
  {
    label: "Government contracts",
    mainland: "Yes",
    freezone: "Generally no",
  },
];

const processSteps = [
  "Choose your legal structure and business activity",
  "Reserve your trade name",
  "Submit your application and get initial approval",
  "Sign and register your office lease",
  "Pay government fees and receive your trade license",
  "Open a business bank account",
  "Apply for investor and employee visas",
];

export default function CompanySetupHubPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      {/* Back */}
      <Link
        href="/guides"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← All guides
      </Link>

      {/* Category */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category="company-setup" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Company Setup
        </p>
      </div>

      {/* Hub hero */}
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Set Up a Company in Dubai
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-6">
        Mainland (DED-licensed, trade anywhere in the UAE) or free zone (100% foreign ownership, export-focused). Both routes covered with exact fees.
      </p>

      {/* Find My Route CTA */}
      <Link
        href="/find-my-visa?flow=company"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Find My Setup Route</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Mainland, free zone, or bank account →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      {/* Route cards */}
      <div className="space-y-3 mb-12">
        {routes.map((route) => {
          const cardInner = (
            <>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {route.title}
                </h2>
                {"href" in route ? (
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                    →
                  </span>
                ) : (
                  <span className="flex-shrink-0 text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-1 rounded-full leading-none whitespace-nowrap">
                    Guide coming soon
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {route.description}
              </p>
              <p className="text-[11px] text-gray-400">{route.meta}</p>
            </>
          );
          return "href" in route ? (
            <Link
              key={route.title}
              href={route.href}
              className="block group border border-stone-200 rounded-2xl p-5 bg-stone-50 hover:border-stone-300 hover:bg-stone-100 transition-all"
            >
              {cardInner}
            </Link>
          ) : (
            <div
              key={route.title}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
            >
              {cardInner}
            </div>
          );
        })}
      </div>

      {/* Compare section */}
      <div className="pt-10 border-t border-stone-200">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
          Mainland or free zone?
        </h2>

        {/* Column headers */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div />
          <p className="text-[12px] font-semibold text-gray-700 text-center">Mainland</p>
          <p className="text-[12px] font-semibold text-gray-700 text-center">Free zone</p>
        </div>

        {/* Comparison rows */}
        <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
          {compareRows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-3 bg-white px-4 py-3.5">
              <p className="text-[12px] text-gray-600 leading-snug">{row.label}</p>
              <p className="text-[12px] font-medium text-gray-800 text-center leading-snug">{row.mainland}</p>
              <p className="text-[12px] font-medium text-gray-800 text-center leading-snug">{row.freezone}</p>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-gray-500 mt-3">
          UAE customers → mainland. International, digital, or remote → free zone.
        </p>
      </div>

      {/* Process overview */}
      <div className="mt-10 pt-10 border-t border-stone-200">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
          What the process looks like
        </h2>
        <ol className="space-y-3">
          {processSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy/10 text-navy text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-[14px] text-gray-800 leading-snug pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-[12px] text-gray-500 mt-5">
          Bank account (step 6) is the same process for mainland and free zone companies.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-12">
        <CtaCard
          heading="Have questions about your setup?"
          linkLabel="Contact us →"
          href="/contact"
        />
      </div>

    </div>
  );
}
