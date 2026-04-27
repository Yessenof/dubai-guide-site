import Link from "next/link";

interface DecisionCard {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Inline SVGs at 20×20 — same stroke weight as CategoryIcon but slightly larger for card context.
// All use currentColor so they inherit the brass tint applied by the parent span.
const cards: DecisionCard[] = [
  {
    label: "Sponsor my spouse",
    href: "/guides/spouse-dependent-visa-dubai",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="7.5" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1.5 18c0-3.314 2.686-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 18c0-2.761 1.567-5 3.5-5s3.5 2.239 3.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Bring my child to Dubai",
    href: "/guides/child-dependent-visa-dubai",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 18c0-3.590 2.910-6.5 6.5-6.5s6.5 2.910 6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="11.5" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Newborn visa",
    href: "/guides",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 3V1.5M7 4L6 2.5M13 4L14 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Get a Golden Visa",
    href: "/visas/golden",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Employment visa",
    href: "/guides/employment-visa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7V5.5A3 3 0 0 1 13 5.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Set up a company",
    href: "/company-setup",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 17V7.5H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.5 7.5H18.5M10 4V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="6" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function QuickDecisionCards() {
  return (
    <section className="px-5 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            What do you need?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-4 py-3.5 hover:border-stone-300 hover:bg-stone-50 transition-all min-h-[56px]"
            >
              <span className="flex-shrink-0 text-brass/70 group-hover:text-brass transition-colors">
                {card.icon}
              </span>
              <span className="text-[13px] font-medium text-gray-700 leading-snug group-hover:text-gray-900 transition-colors">
                {card.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
