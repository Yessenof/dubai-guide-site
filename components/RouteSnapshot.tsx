interface StepPreview {
  title: string;
  what: string;
}

interface RouteSnapshotProps {
  price: string;
  timeline: string;
  audience: string;
  steps: StepPreview[];
  lastUpdated: string;
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const sentenceEnd = /[.!?]/g;
  let match: RegExpExecArray | null;
  while ((match = sentenceEnd.exec(text)) !== null) {
    if (match.index >= 20 && match.index < maxLen) {
      return text.slice(0, match.index + 1);
    }
  }
  const cutAt = text.lastIndexOf(" ", maxLen - 1);
  return (cutAt > 0 ? text.slice(0, cutAt) : text.slice(0, maxLen)) + "…";
}

export default function RouteSnapshot({
  price,
  timeline,
  audience,
  steps,
  lastUpdated,
}: RouteSnapshotProps) {
  const audienceTruncated = truncate(audience, 85);
  const startTruncated = truncate(steps[0]?.what ?? "", 90);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-px bg-stone-100 rounded-2xl overflow-hidden">

        {/* Row 1: Cost + Timeline — the two primary answers */}
        <div className="bg-white px-4 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Gov. fee</p>
          <p className="text-[17px] font-bold text-navy leading-none">{price}</p>
        </div>
        <div className="bg-white px-4 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Timeline</p>
          <p className="text-[17px] font-bold text-navy leading-none">{timeline}</p>
        </div>

        {/* Row 2: For + Steps count */}
        <div className="bg-white px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">For</p>
          <p className="text-[12px] text-gray-700 leading-snug">{audienceTruncated}</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Steps</p>
          <p className="text-[17px] font-bold text-navy leading-none">{steps.length}</p>
        </div>

        {/* Row 3: Start — first action */}
        {startTruncated && (
          <div className="bg-white px-4 py-3 col-span-2 border-t border-stone-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Start</p>
            <p className="text-[12px] text-gray-700 leading-snug">{startTruncated}</p>
          </div>
        )}

      </div>

      <p className="text-[10px] text-gray-400 mt-2.5">Last updated: {lastUpdated}</p>
    </div>
  );
}
