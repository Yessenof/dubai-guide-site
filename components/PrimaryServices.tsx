import Link from "next/link";

type ServiceItem =
  | { label: string; href: string; external?: boolean; soon?: false }
  | { label: string; href?: undefined; soon: true };

type ServiceGroup = {
  category: string;
  hubHref?: string;
  dotClass: string;
  arrowClass: string;
  items: ServiceItem[];
};

const groups: ServiceGroup[] = [
  {
    category:  "Visas",
    hubHref:   "/visas",
    dotClass:  "bg-navy",
    arrowClass: "text-navy",
    items: [
      { label: "Employment Visa",   href: "/find-my-visa?flow=employment" },
      { label: "New Family Visa",   href: "/find-my-visa?flow=family-new" },
      { label: "Renew Family Visa", href: "/guides/renew-family-visa-dubai" },
      { label: "Newborn Visa",      href: "/guides/newborn-visa-dubai" },
      { label: "Golden Visa",       href: "/find-my-visa?flow=golden" },
      { label: "Maid Visa",         href: "https://wa.me/971506304817?text=Hi%2C%20I%20need%20help%20with%20a%20maid%20visa%20in%20Dubai", external: true },
    ],
  },
  {
    category:  "Business Setup",
    hubHref:   "/company-setup",
    dotClass:  "bg-brass",
    arrowClass: "text-brass",
    items: [
      { label: "Mainland Company",  href: "/guides/mainland-company-setup-dubai" },
      { label: "Free Zone Company", href: "/guides/free-zone-company-setup-dubai" },
      { label: "Bank Account",      href: "/guides/open-business-bank-account-dubai" },
    ],
  },
  {
    category:  "Government",
    hubHref:   "/government",
    dotClass:  "bg-stone-500",
    arrowClass: "text-stone-500",
    items: [
      { label: "Document Attestation", href: "/guides/document-attestation-dubai" },
      { label: "PRO Services",         href: "/guides/pro-services-dubai" },
      { label: "Amer Services",        href: "/guides/amer-center-dubai" },
    ],
  },
];

export default function PrimaryServices() {
  return (
    <section className="px-5 pb-10">
      <div className="max-w-2xl mx-auto space-y-5">
        {groups.map((group) => (
          <div key={group.category}>
            {/* Category header — links to hub if one exists */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${group.dotClass}`} />
                <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400">
                  {group.category}
                </p>
              </div>
              {group.hubHref && (
                <Link
                  href={group.hubHref}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors py-2.5 pl-4"
                >
                  All →
                </Link>
              )}
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-200">
              {group.items.map((item) =>
                item.soon ? (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-4 bg-stone-50"
                  >
                    <span className="text-[15px] text-gray-400">{item.label}</span>
                    <span className="text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-1 rounded-full leading-none">
                      Soon
                    </span>
                  </div>
                ) : item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-4 bg-white hover:bg-stone-50 transition-colors group"
                  >
                    <span className="text-[15px] font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                      {item.label}
                    </span>
                    <span className={`text-base transition-opacity group-hover:opacity-60 ${group.arrowClass}`}>
                      →
                    </span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-4 bg-white hover:bg-stone-50 transition-colors group"
                  >
                    <span className="text-[15px] font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                      {item.label}
                    </span>
                    <span className={`text-base transition-opacity group-hover:opacity-60 ${group.arrowClass}`}>
                      →
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
