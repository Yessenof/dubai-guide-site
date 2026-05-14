"use client";

import { useActionState } from "react";
import {
  publishNewsAction,
  archiveNewsAction,
  type NewsActionState,
} from "@/app/admin/content/actions/news";

const INITIAL: NewsActionState = { errors: [], warnings: [] };

interface Props {
  postId: string;
  status: string;
  publishErrors: string[];
  publishWarnings: string[];
}

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Published
      </span>
    );
  }
  if (status === "archived") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
        Archived
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
      Draft
    </span>
  );
}

export default function NewsStatusPanel({
  postId,
  status,
  publishErrors,
  publishWarnings,
}: Props) {
  const [publishState, publishAction] = useActionState(publishNewsAction, INITIAL);
  const [archiveState, archiveAction] = useActionState(archiveNewsAction, INITIAL);

  const canPublish = publishErrors.length === 0 && status !== "archived";
  const canArchive = status !== "archived";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Status
        </span>
        <StatusBadge status={status} />
      </div>

      {publishState.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
          {publishState.errors.map((e, i) => (
            <p key={i} className="text-xs text-red-700">
              {e}
            </p>
          ))}
        </div>
      )}

      {archiveState.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
          {archiveState.errors.map((e, i) => (
            <p key={i} className="text-xs text-red-700">
              {e}
            </p>
          ))}
        </div>
      )}

      {publishErrors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-red-600">Publish blocked:</p>
          <ul className="space-y-1">
            {publishErrors.map((e, i) => (
              <li key={i} className="text-xs text-red-600 flex gap-1.5">
                <span className="shrink-0 mt-0.5">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {publishErrors.length === 0 && publishWarnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          {publishWarnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-700">
              {w}
            </p>
          ))}
        </div>
      )}

      {status !== "archived" && (
        <form action={publishAction}>
          <input type="hidden" name="_id" value={postId} />
          <button
            type="submit"
            disabled={!canPublish}
            className={`w-full text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
              canPublish
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {status === "published" ? "Re-publish" : "Publish"}
          </button>
        </form>
      )}

      {canArchive && (
        <form action={archiveAction}>
          <input type="hidden" name="_id" value={postId} />
          <button
            type="submit"
            className="w-full text-xs font-medium text-gray-400 hover:text-gray-600 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Archive
          </button>
        </form>
      )}

      {status === "archived" && (
        <p className="text-xs text-gray-400 text-center">
          Archived — no further actions available.
        </p>
      )}
    </div>
  );
}
