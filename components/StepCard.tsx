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
    <div className="relative pl-10 pb-6 last:pb-0 before:content-[''] before:absolute before:left-3.5 before:top-8 before:bottom-0 before:w-px before:bg-gray-100 last:before:hidden">
      {/* Step number bubble */}
      <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
        <span className="text-xs font-semibold text-white tabular-nums">
          {number}
        </span>
      </div>

      {/* Step title */}
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-2 pt-0.5">
        {title}
      </h3>

      {/* Card */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        {/* What to do */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">{what}</p>
        </div>

        {/* Where / Address */}
        <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 mb-0.5">Where to go</p>
            <p className="text-xs text-gray-700 leading-snug">{where}</p>
          </div>
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 mb-0.5">Address / portal</p>
            <p className="text-xs text-gray-700 leading-snug">{address}</p>
          </div>
        </div>

        {/* Cost / Time */}
        <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 mb-0.5">Est. cost</p>
            <p className="text-sm font-semibold text-gray-900">{cost}</p>
          </div>
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 mb-0.5">Est. time</p>
            <p className="text-sm text-gray-700">{time}</p>
          </div>
        </div>

        {/* Advice */}
        <div className="border-t border-gray-100 px-4 py-3 bg-blue-50/60">
          <p className="text-xs font-medium text-blue-600 mb-1">Advice</p>
          <p className="text-sm text-gray-700 leading-relaxed">{advice}</p>
        </div>

        {/* Warning */}
        {warning && (
          <div className="border-t border-gray-100 px-4 py-3 bg-amber-50/60">
            <p className="text-xs font-medium text-amber-600 mb-1">Note</p>
            <p className="text-sm text-gray-700 leading-relaxed">{warning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
