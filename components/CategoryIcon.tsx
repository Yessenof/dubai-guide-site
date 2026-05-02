/**
 * CategoryIcon — inline SVG micro-illustrations for guide categories.
 * 14×14 viewport, 1.5px stroke, round caps/joins, currentColor fill=none.
 * All five icons drawn on the same visual grid — consistent weight across the set.
 */

type KnownCategory =
  | "visas"
  | "company-setup"
  | "hiring"
  | "living"
  | "government"
  | "tourism";

const icons: Record<KnownCategory, React.ReactNode> = {
  // Passport / travel document: rounded booklet + photo circle + two data lines
  visas: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2.75" y="1.75" width="8.5" height="10.5" rx="1.25"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7" cy="5.75" r="1.5"
        stroke="currentColor" strokeWidth="1.5" />
      <line x1="4.5" y1="9" x2="9.5" y2="9"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.5" y1="10.75" x2="7.5" y2="10.75"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Office building: flat-top commercial form with a column + two windows
  "company-setup": (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 12.5V5H11.5V12.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 5H12.5M7 2V5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4.25" y="7" width="2" height="2" rx="0.5"
        stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.75" y="7" width="2" height="2" rx="0.5"
        stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),

  // Person: head circle + shoulder arc
  hiring: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="4.5" r="2.5"
        stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 13C1.5 10.015 4.025 7.5 7 7.5C9.975 7.5 12.5 10.015 12.5 13"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Residential house: pitched roof + rectangular body + centered door
  living: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1.5 7.5L7 2.5L12.5 7.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 7.5V12.5H11V7.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="9.5" width="3" height="3" rx="0.5"
        stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),

  // Official seal: two concentric circles + four cardinal tick marks
  government: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5"
        stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="2.5"
        stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="2" x2="7" y2="4.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="9.5" x2="7" y2="12"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="7" x2="4.5" y2="7"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9.5" y1="7" x2="12" y2="7"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Key: circle head + diagonal shaft + two teeth
  tourism: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="4.75" cy="4.75" r="2.5"
        stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.5" y1="6.5" x2="12" y2="12"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="9.5" x2="10" y2="11"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.5" y1="11" x2="11.5" y2="12.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

interface Props {
  category: string;
}

export default function CategoryIcon({ category }: Props) {
  const icon = icons[category as KnownCategory];
  return icon ? <>{icon}</> : null;
}
