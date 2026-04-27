interface Props {
  heading?: string;
  linkLabel?: string;
  href?: string;
}

export default function CtaCard({
  heading = "Need help with this process?",
  linkLabel = "Contact us →",
  href = "/contact",
}: Props) {
  return (
    <div className="bg-navy rounded-2xl px-5 py-5">
      <p className="text-sm font-semibold text-white mb-2">{heading}</p>
      <a
        href={href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-brass hover:opacity-75 transition-opacity py-3 -mb-1"
      >
        {linkLabel}
      </a>
    </div>
  );
}
