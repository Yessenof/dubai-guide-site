const items = [
  {
    label: "Official sources only",
    description: "Fees and steps are traced to GDRFA, ICA, MOHRE, DED, and Amer — not estimated.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Step by step",
    description: "Each guide tells you exactly where to go, what to bring, and what it costs.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="2.5" rx="1.25" fill="currentColor" opacity="0.3" />
        <rect x="2" y="8.75" width="12" height="2.5" rx="1.25" fill="currentColor" opacity="0.6" />
        <rect x="2" y="13.5" width="8" height="2.5" rx="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Always free",
    description: "No paywalls, no sales pitches, no hidden upsells.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10.5L9 12.5L13.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="px-5 pb-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            How it works
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="flex-shrink-0 text-brass mt-0.5">{item.icon}</span>
              <div>
                <p className="text-[14px] font-semibold text-gray-800">{item.label}</p>
                <p className="text-[13px] text-gray-600 leading-relaxed mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
