import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WA   = "https://wa.me/971506304817";
const IMG  = "/images/hubs/jlt-dubai-towers-sunset-reflection.webp";

export const metadata: Metadata = {
  title: "Dubai Life Setup — Plan Your Move and First Steps | Guidex",
  description:
    "Know what to do before you arrive, in your first week, first 30 days, and every year after. Visas, company setup, Ejari, family, property and more.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/life-setup`,
    languages: {
      en:          `${BASE}/life-setup`,
      ru:          `${BASE}/ru/life-setup`,
      "x-default": `${BASE}/life-setup`,
    },
  },
};

type Task = { label: string; href?: string };

type Stage = {
  id:            string;
  num:           string;
  timeframe:     string;
  heading:       string;
  summary:       string;
  tasks:         Task[];
  calendarNote?: string;
  ctaLabel:      string;
  ctaHref:       string;
};

const STAGES: Stage[] = [
  {
    id:        "before-arrival",
    num:       "1",
    timeframe: "30–90 days before landing",
    heading:   "Before arrival",
    summary:
      "Decide your visa route, start document attestation, and research schools or pet requirements. Most official steps happen after you land — but these cannot wait.",
    tasks: [
      { label: "Choose your visa route — employment, investor, golden, or self-sponsored", href: "/guides/employment-visa" },
      { label: "Get foreign documents attested — degree, marriage certificate, birth certificate", href: "/guides/document-attestation-dubai" },
      { label: "Research mainland vs free zone if you plan to open a company", href: "/guides/mainland-company-setup-dubai" },
      { label: "Research schools if moving with children — check KHDA for rated private school options" },
      { label: "Check MOCCAE requirements if bringing a pet — allow at least 3 months before travel" },
    ],
    ctaLabel: "Ask us about your visa route →",
    ctaHref:  WA,
  },
  {
    id:        "arrival-week",
    num:       "2",
    timeframe: "Days 0–7",
    heading:   "Arrival week",
    summary:
      "Verify your entry stamp, get a SIM, activate DEWA, and book Emirates ID biometrics. These four tasks open every other step — do not delay them.",
    tasks: [
      { label: "Verify your entry stamp type and validity at the airport or port of entry" },
      { label: "Get a UAE SIM card — e& (Etisalat) or du, from any mall or airport outlet" },
      { label: "Activate DEWA for electricity and water at your accommodation" },
      { label: "Book Emirates ID biometrics at an Amer centre or ICA office", href: "/guides/amer-center-dubai" },
      { label: "Open a personal bank account — requirements vary by bank; book early" },
    ],
    ctaLabel: "Need help with your first week? Ask us →",
    ctaHref:  WA,
  },
  {
    id:        "first-30-days",
    num:       "3",
    timeframe: "Days 1–30",
    heading:   "First 30 days",
    summary:
      "Register Ejari within 30 days of moving in, receive your Emirates ID, and activate health insurance. Founders: register with MoHRE and set up WPS.",
    tasks: [
      { label: "Register Ejari — required within 30 days of tenancy start (Dubai Land Department)" },
      { label: "Receive and verify your Emirates ID card (ICP — icp.gov.ae)" },
      { label: "Activate mandatory health insurance — required in Dubai under Dubai Health Authority rules" },
      { label: "Open a business bank account if you hold a company licence", href: "/guides/open-business-bank-account-dubai" },
      { label: "Register with MoHRE and set up WPS if you are hiring employees" },
    ],
    ctaLabel: "Need help with your first 30 days? Ask us →",
    ctaHref:  WA,
  },
  {
    id:        "first-90-days",
    num:       "4",
    timeframe: "Days 31–90",
    heading:   "First 90 days",
    summary:
      "Your first compliance deadlines arrive now. VAT threshold monitoring, Corporate Tax registration, driving licence exchange, and family visas.",
    tasks: [
      { label: "Monitor your VAT registration threshold (Federal Tax Authority — federal.ae)" },
      { label: "Register for Corporate Tax with the Federal Tax Authority (FTA)" },
      { label: "Exchange your driving licence if your home country is eligible — check RTA Dubai" },
      { label: "Apply for family and dependent visas if not yet done", href: "/guides/spouse-dependent-visa-dubai-inside-country" },
      { label: "Check Emiratisation requirements if your company has 50 or more employees", href: "/calendar/uae-emiratisation-june-30-2026-reminder" },
    ],
    calendarNote: "Emiratisation: June 30 and December 31 deadlines for companies with 50 or more employees.",
    ctaLabel: "Questions about compliance deadlines? Ask us →",
    ctaHref:  WA,
  },
  {
    id:        "annual",
    num:       "5",
    timeframe: "Every year",
    heading:   "Annual obligations",
    summary:
      "Renew visa and Emirates ID before expiry, trade licence 30–60 days early, and Corporate Tax return within 9 months of your Tax Period end.",
    tasks: [
      { label: "Visa renewal — start at least 60 days before expiry (GDRFA or ICA Amer centre)", href: "/guides/amer-center-dubai" },
      { label: "Emirates ID renewal — tied to your visa renewal (ICP — icp.gov.ae)" },
      { label: "Trade licence renewal — 30–60 days before expiry (DED for mainland; your free zone authority)" },
      { label: "Corporate Tax return — file within 9 months of your Tax Period end (FTA)" },
      { label: "Ejari renewal — before your new tenancy period starts (Dubai Land Department)" },
      { label: "DET holiday home permit renewal — annual from permit issue date", href: "/guides/holiday-home-permit-dubai" },
      { label: "Emiratisation mid-year and year-end compliance check", href: "/calendar/uae-emiratisation-june-30-2026-reminder" },
    ],
    calendarNote: "Check the Dubai Life Calendar for upcoming UAE deadlines and public holidays.",
    ctaLabel: "Open Dubai Life Calendar →",
    ctaHref:  "/calendar",
  },
];

type RouteCard = {
  title:       string;
  description: string;
  links:       { label: string; href: string }[];
  ctaLabel:    string;
  ctaHref:     string;
};

const ROUTES: RouteCard[] = [
  {
    title:       "Family and school",
    description: "Moving with children? School applications in Dubai open 6–12 months before the academic year. Start before you fly.",
    links: [
      { label: "Child dependent visa",   href: "/guides/child-dependent-visa-dubai-outside-country" },
      { label: "Spouse dependent visa",  href: "/guides/spouse-dependent-visa-dubai-outside-country" },
      { label: "Family visa renewal",    href: "/guides/renew-family-visa-dubai" },
    ],
    ctaLabel: "Ask about family setup →",
    ctaHref:  WA,
  },
  {
    title:       "Business owner",
    description: "Founders face company setup, banking, MoHRE registration, and VAT and Corporate Tax obligations — all in the first 30 days.",
    links: [
      { label: "Mainland company setup",  href: "/guides/mainland-company-setup-dubai" },
      { label: "Free zone company setup", href: "/guides/free-zone-company-setup-dubai" },
      { label: "Business bank account",   href: "/guides/open-business-bank-account-dubai" },
      { label: "PRO services",            href: "/guides/pro-services-dubai" },
    ],
    ctaLabel: "Ask about business setup →",
    ctaHref:  WA,
  },
  {
    title:       "Property owner",
    description: "Register Ejari before tenancy starts and check the Dubai rental index before any renewal. Short-term rental requires a DET permit.",
    links: [
      { label: "Holiday home permit guide", href: "/guides/holiday-home-permit-dubai" },
    ],
    ctaLabel: "Ask about property compliance →",
    ctaHref:  WA,
  },
  {
    title:       "Pet owner",
    description: "MOCCAE requires a health certificate, rabies vaccination, and microchip before your pet can enter the UAE. Allow at least 3 months before travel.",
    links: [],
    ctaLabel: "Ask about pet import →",
    ctaHref:  WA,
  },
  {
    title:       "Holiday home",
    description: "To legally list a Dubai property on Airbnb or Booking.com, you need a DET holiday homes permit. Check current requirements at the DET portal.",
    links: [
      { label: "Holiday home permit guide", href: "/guides/holiday-home-permit-dubai" },
    ],
    ctaLabel: "Read the permit guide →",
    ctaHref:  "/guides/holiday-home-permit-dubai",
  },
  {
    title:       "Investor",
    description: "A ready property worth AED 2,000,000 or more may qualify for a 10-year golden visa. Full eligibility criteria in the guide.",
    links: [
      { label: "Golden Visa — property route", href: "/guides/golden-visa-dubai-property" },
      { label: "Tax residency certificate",    href: "/guides/tax-residency-certificate-uae" },
    ],
    ctaLabel: "Read the golden visa guide →",
    ctaHref:  "/guides/golden-visa-dubai-property",
  },
  {
    title:       "Renewal for residents",
    description: "Visa, Emirates ID, or trade licence expiring in the next 60 days? Start the renewal now — do not wait until the last week.",
    links: [
      { label: "Family visa renewal",         href: "/guides/renew-family-visa-dubai" },
      { label: "Amer centres — what to expect", href: "/guides/amer-center-dubai" },
    ],
    ctaLabel: "Ask about your renewal →",
    ctaHref:  WA,
  },
];

export default function LifeSetupPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-12">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-2"
      >
        ← Home
      </Link>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-8 h-[268px] sm:h-[330px]">
        <Image
          src={IMG}
          alt="Dubai towers at sunset — Dubai Life Setup guide"
          fill
          className="object-cover"
          sizes="(max-width: 672px) calc(100vw - 40px), 632px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-2">
            Dubai Life Setup
          </p>
          <h1
            className="text-[24px] sm:text-[28px] font-bold text-white leading-snug mb-2"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
          >
            Plan your life in Dubai
          </h1>
          <p className="text-[13px] text-white/75 leading-snug mb-5 max-w-sm">
            What to prepare before arrival, what to do in your first week, and what to stay on top of every year.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#timeline"
              className="text-[13px] font-semibold bg-white text-navy px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Start with the timeline
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-white border border-white/35 px-4 py-2 rounded-xl hover:border-white/65 transition-colors"
            >
              Ask Guidex →
            </a>
          </div>
        </div>
      </div>

      {/* ── First-screen answer (SEO/RAG) ───────────────────────────────────── */}
      <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
        Dubai Life Setup helps newcomers, families, business owners, investors, and property owners
        plan exactly what to do before arrival, in the first 7 days, in the first 30 days, and every year after.
        Each stage links to the relevant official guides.
      </p>

      {/* ── Timeline ─────────────────────────────────────────────────────────── */}
      <div id="timeline">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-3" />
        <h2 className="text-[20px] font-bold text-gray-900 mb-1">
          Your timeline
        </h2>
        <p className="text-[13px] text-gray-500 mb-6">
          Five stages — from before you land to your annual obligations.
        </p>

        <div className="space-y-4 mb-14">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center">
                  {stage.num}
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  {stage.timeframe}
                </p>
              </div>

              <h3 className="text-[17px] font-bold text-gray-900 mb-2">
                {stage.heading}
              </h3>

              <p className="text-[13px] text-gray-600 leading-snug mb-4">
                {stage.summary}
              </p>

              <ul className="space-y-2 mb-4">
                {stage.tasks.map((task, i) =>
                  task.href ? (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-brass text-[13px] mt-0.5 leading-none">→</span>
                      <Link
                        href={task.href}
                        className="text-[13px] text-navy hover:underline leading-snug"
                      >
                        {task.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-400" />
                      <span className="text-[13px] text-gray-700 leading-snug">{task.label}</span>
                    </li>
                  )
                )}
              </ul>

              {stage.calendarNote && (
                <p className="text-[12px] text-gray-500 bg-white border border-stone-200 rounded-xl px-3 py-2.5 mb-4">
                  {stage.calendarNote}
                </p>
              )}

              {stage.ctaHref.startsWith("http") ? (
                <a
                  href={stage.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[13px] font-semibold text-navy hover:opacity-70 transition-opacity"
                >
                  {stage.ctaLabel}
                </a>
              ) : (
                <Link
                  href={stage.ctaHref}
                  className="inline-flex items-center text-[13px] font-semibold text-navy hover:opacity-70 transition-opacity"
                >
                  {stage.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Route cards ──────────────────────────────────────────────────────── */}
      <div id="routes">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-3" />
        <h2 className="text-[20px] font-bold text-gray-900 mb-1">
          Your situation
        </h2>
        <p className="text-[13px] text-gray-500 mb-6">
          Choose the path that fits your reason for being in Dubai.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-14">
          {ROUTES.map((route) => (
            <div
              key={route.title}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50 flex flex-col"
            >
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                {route.title}
              </h3>
              <p className="text-[13px] text-gray-600 leading-snug mb-4 flex-1">
                {route.description}
              </p>

              {route.links.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {route.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-navy hover:underline"
                      >
                        → {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {route.ctaHref.startsWith("http") ? (
                <a
                  href={route.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                >
                  {route.ctaLabel}
                </a>
              ) : (
                <Link
                  href={route.ctaHref}
                  className="self-start text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                >
                  {route.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <div className="bg-navy rounded-2xl px-6 py-6">
        <p className="text-[16px] font-bold text-white mb-1">
          Have a question about setting up in Dubai?
        </p>
        <p className="text-[13px] text-white/60 mb-4">
          Ask us on WhatsApp — we help with visas, company setup, and your first steps.
        </p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brass hover:opacity-75 transition-opacity"
        >
          Ask Guidex on WhatsApp →
        </a>
      </div>

    </div>
  );
}
