"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateGuideAction, setPublishedAction, deleteGuideAction } from "@/app/(en)/admin/actions";
import GuideFormFields from "@/components/admin/GuideFormFields";
import SavedBanner from "@/components/admin/SavedBanner";
import Link from "next/link";
import type { Guide } from "@/lib/db/schema";

interface Props {
  guide:   Guide;
  savedTs: string | undefined;
  slug:    string;
}

export default function GuideEditForm({ guide, savedTs, slug }: Props) {
  const router  = useRouter();
  const isDirty = useRef(false);
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    isDirty.current = true;
    setDirty(true);
  }

  // Warn before browser unload (tab close, hard navigation)
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty.current) return;
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  function handleBack(e: React.MouseEvent) {
    if (isDirty.current) {
      e.preventDefault();
      const ok = window.confirm("You have unsaved changes. Leave without saving?");
      if (ok) router.push("/admin/guides");
    }
  }

  return (
    <div>
      {/*
        savedTs is truthy only after a save redirect.
        No key needed here — the whole component is already remounted by the
        key={saved ?? "init"} on <GuideEditForm> in the page, so SavedBanner
        always starts with visible=true after a save.
      */}
      {savedTs && <SavedBanner />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/guides"
            onClick={handleBack}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← All guides
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 mt-1">Edit guide</h1>
        </div>

        <div className="flex items-center gap-3">
          {guide.published && (
            <Link
              href={`/guides/${slug}`}
              target="_blank"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              View on site →
            </Link>
          )}

          {/* Unpublish — separate form, safe (no field data to lose) */}
          {guide.published && (
            <form action={setPublishedAction}>
              <input type="hidden" name="id"        value={guide.id} />
              <input type="hidden" name="slug"      value={slug}     />
              <input type="hidden" name="published" value="false"    />
              <button
                type="submit"
                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Unpublish
              </button>
            </form>
          )}

          {/* Delete */}
          <form
            action={deleteGuideAction}
            onSubmit={(e) => {
              if (!window.confirm("Delete this guide permanently?")) e.preventDefault();
            }}
          >
            <input type="hidden" name="id"   value={guide.id} />
            <input type="hidden" name="slug" value={slug}     />
            <button
              type="submit"
              className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/*
        No key on this form — the page puts key={saved ?? "init"} on <GuideEditForm>
        itself, so the entire component (and therefore this form) remounts on every
        successful save. That remount is what resets defaultValue attrs to the
        freshly-saved DB values. A redundant inner key would collide with the
        SavedBanner's implicit position key and cause the duplicate-key warning.
      */}
      <form action={updateGuideAction} onChange={markDirty}>
        <input type="hidden" name="id"       value={guide.id} />
        <input type="hidden" name="prevSlug" value={slug}     />

        <GuideFormFields defaults={guide} />

        <div className="mt-6 flex items-center justify-between">
          {dirty ? (
            <span className="text-xs text-amber-600">Unsaved changes</span>
          ) : (
            <span />
          )}

          <div className="flex gap-3">
            {/* Save draft — preserves current published state */}
            <button
              type="submit"
              name="intent"
              value="draft"
              className="text-sm text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Save draft
            </button>

            {/* Save and publish — only shown for drafts; sets published: true in the same DB write */}
            {!guide.published && (
              <button
                type="submit"
                name="intent"
                value="publish"
                className="text-sm font-semibold bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
              >
                Save and publish
              </button>
            )}

            {/* Already published — just save all fields */}
            {guide.published && (
              <button
                type="submit"
                name="intent"
                value="draft"
                className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
              >
                Save changes
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
