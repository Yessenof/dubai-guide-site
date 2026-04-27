interface StepCardProps {
  number: number;
  title: string;
  what: string;
  where: string;
  address: string;
  cost: string;
  time: string;
  advice: string;
  warning?: string;
}

export default function StepCard({
  number,
  title,
  what,
  where,
  address,
  cost,
  time,
  advice,
  warning,
}: StepCardProps) {
  return (
    <div className="relative pl-10 pb-7 last:pb-0 before:content-[''] before:absolute before:left-3.5 before:top-8 before:bottom-0 before:w-px before:bg-stone-100 last:before:hidden">
      {/* Step number bubble */}
      <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-navy flex items-center justify-center">
        <span className="text-xs font-bold text-white tabular-nums">{number}</span>
      </div>

      {/* Step title */}
      <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2.5 pt-0.5">
        {title}
      </h3>

      {/* Card */}
      <div className="rounded-2xl border border-stone-100 bg-white overflow-hidden">
        {/* What to do */}
        <div className="px-4 py-3.5">
          <p className="text-[14px] text-gray-700 leading-relaxed">{what}</p>
        </div>

        {/* Where / Address */}
        <div className="border-t border-stone-100 grid grid-cols-2 divide-x divide-stone-100">
          <div className="px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Where to go</p>
            <p className="text-[13px] text-gray-700 leading-snug">{where}</p>
          </div>
          <div className="px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Address / portal</p>
            <p className="text-[13px] text-gray-700 leading-snug">{address}</p>
          </div>
        </div>

        {/* Cost / Time */}
        <div className="border-t border-stone-100 grid grid-cols-2 divide-x divide-stone-100">
          <div className="px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Est. cost</p>
            <p className="text-[14px] font-bold text-gray-900">{cost}</p>
          </div>
          <div className="px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Est. time</p>
            <p className="text-[13px] font-medium text-gray-700">{time}</p>
          </div>
        </div>

        {/* Advice */}
        <div className="border-t border-stone-100 px-4 py-3 bg-navy/[.05]">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-navy mb-1">Advice</p>
          <p className="text-[13px] text-gray-700 leading-relaxed">{advice}</p>
        </div>

        {/* Warning */}
        {warning && (
          <div className="border-t border-stone-100 px-4 py-3 bg-amber-50/70">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-1">Note</p>
            <p className="text-[13px] text-gray-700 leading-relaxed">{warning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
