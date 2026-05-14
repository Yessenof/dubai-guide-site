import AiInboxClient from "./_components/AiInboxClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Inbox — Content Admin" };

interface Props {
  searchParams: Promise<{ save_error?: string }>;
}

export default async function AiInboxPage({ searchParams }: Props) {
  const { save_error } = await searchParams;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">AI Inbox</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Paste any input — URL, article, note, event link — and get a classified, structured draft.
        </p>
      </div>
      <AiInboxClient saveError={save_error} />
    </div>
  );
}
