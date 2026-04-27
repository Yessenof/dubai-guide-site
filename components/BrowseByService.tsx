import Link from "next/link";

type ServiceItem =
  | { label: string; href: string; soon?: false }
  | { label: string; href?: undefined; soon: true };

type ServiceGroup = {
  category: string;
  items: ServiceItem[];
};

const groups: ServiceGroup[] = [
  {
    category: "Visas",
    items: [
      { label: "Employment Visa",  href: "/guides/employment-visa" },
      { label: "Family Visas",     href: "/visas/family" },
      { label: "Golden Visa",      href: "/visas/golden" },
      { label: "Maid Visa",        soon: true },
      { label: "Newborn Visa",     soon: true },
    ],
  },
  {
    category: "Business Setup",
    items: [
      { label: "Company Setup",    href: "/company-setup" },
      { label: "Bank Account",     soon: true },
    ],
  },
  {
    category: "Government & Legal",
    items: [
      { label: "Amer Services",      soon: true },
      { label: "Attestation",        soon: true },
      { label: "Legal Translation",  soon: true },
      { label: "POA",                soon: true },
      { label: "DLD Services",       soon: true },
    ],
  },
];

export default function BrowseByService() {
  return (
    <section className="bg-stone-50 px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Browse by Service
          </p>
        </div>

        <div className="flex flex-col gap-7 sm:grid sm:grid-cols-3 sm:gap-8">
          {groups.map((group) => (
            <div key={group.category}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {group.category}
              </p>
              <ul className="space-y-2.5">
                {group.items.map((item) =>
                  item.soon ? (
                    <li key={item.label} className="flex items-center gap-2">
                      <span className="text-[14px] text-gray-400">{item.label}</span>
                      <span className="text-[10px] font-medium text-gray-400 bg-stone-200 px-1.5 py-0.5 rounded-full leading-none">
                        Soon
                      </span>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-[14px] text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
