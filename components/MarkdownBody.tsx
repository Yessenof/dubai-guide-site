// Minimal safe Markdown renderer for the subset used in news/event/calendar bodies.
// Handles: h2–h4, **bold**, pipe tables, bullet lists, --- (styled divider), paragraphs.
// No external dependencies. Server-compatible (no "use client").

import type { ReactNode } from "react";

// ─── Inline formatter ─────────────────────────────────────────────────────────

function parseInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-gray-900">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

// ─── Table renderer ───────────────────────────────────────────────────────────

function renderTable(block: string): ReactNode {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (lines.length < 2) return null;

  const header = lines[0].split("|").filter(Boolean).map((s) => s.trim());
  const dataRows = lines.slice(2).map((l) =>
    l.split("|").filter(Boolean).map((s) => s.trim())
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full text-[14px] border-collapse min-w-[340px]">
        <thead>
          <tr className="bg-stone-50">
            {header.map((h, i) => (
              <th
                key={i}
                className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 px-3 py-2.5 border-b border-stone-200 whitespace-nowrap"
              >
                {parseInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} className={ri % 2 !== 0 ? "bg-stone-50/50" : "bg-white"}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2.5 border-b border-stone-100 text-gray-700 align-top leading-snug last:border-b-0"
                >
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownBody({ content, className }: Props) {
  const blocks = content.split("\n\n").filter((b) => b.trim());

  const nodes: ReactNode[] = blocks.map((block, idx) => {
    const b = block.trim();

    // Soft horizontal rule
    if (/^[-*_]{3,}$/.test(b)) {
      return <div key={idx} className="h-px bg-stone-100 my-1" />;
    }

    // h4 — section heading with subtle top border
    if (b.startsWith("#### ")) {
      return (
        <h4
          key={idx}
          className="text-[15px] font-semibold text-gray-900 leading-snug pt-5 border-t border-stone-100 first:pt-0 first:border-t-0"
        >
          {parseInline(b.slice(5))}
        </h4>
      );
    }

    // h3
    if (b.startsWith("### ")) {
      return (
        <h3
          key={idx}
          className="text-[17px] font-semibold text-gray-900 leading-snug pt-6 border-t border-stone-200 first:pt-0 first:border-t-0"
        >
          {parseInline(b.slice(4))}
        </h3>
      );
    }

    // h2
    if (b.startsWith("## ")) {
      return (
        <h2
          key={idx}
          className="text-[19px] font-semibold text-gray-900 leading-snug pt-7 border-t-2 border-stone-200 first:pt-0 first:border-t-0"
        >
          {parseInline(b.slice(3))}
        </h2>
      );
    }

    // Table — detect any line starting with |
    const bLines = b.split("\n");
    if (bLines.some((l) => l.trim().startsWith("|"))) {
      return <div key={idx}>{renderTable(b)}</div>;
    }

    // Bullet list — all non-empty lines start with "- " or "* "
    const nonEmpty = bLines.filter((l) => l.trim());
    if (
      nonEmpty.length > 0 &&
      nonEmpty.every((l) => /^[*-] /.test(l.trim()))
    ) {
      return (
        <ul
          key={idx}
          className="list-disc list-outside ml-4 space-y-2 text-[15px] text-gray-700 leading-[1.72]"
        >
          {nonEmpty.map((l, i) => (
            <li key={i}>{parseInline(l.trim().slice(2))}</li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-[15px] text-gray-700 leading-[1.72]">
        {parseInline(bLines.join(" "))}
      </p>
    );
  });

  return (
    <div className={["space-y-4", className].filter(Boolean).join(" ")}>
      {nodes.filter(Boolean)}
    </div>
  );
}
