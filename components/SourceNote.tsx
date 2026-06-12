interface SourceNoteProps {
  note: string
  status: "confirmed" | "provisional"
  sourceLabel: string
  lastChecked: string
}

export default function SourceNote({ note, status, sourceLabel, lastChecked }: SourceNoteProps) {
  if (status === "provisional") {
    return (
      <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3">
        <p className="text-[12px] text-amber-800 leading-snug">{note}</p>
        <p className="text-[11px] text-amber-600 mt-1.5">
          {sourceLabel} · {lastChecked}
        </p>
      </div>
    );
  }

  return (
    <p className="text-[11px] text-gray-400 leading-snug">
      <span className="mr-1">●</span>
      {note}
      {" · "}
      <span className="whitespace-nowrap">{lastChecked}</span>
    </p>
  );
}
