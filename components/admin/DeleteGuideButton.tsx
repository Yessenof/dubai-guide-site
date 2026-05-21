"use client";

import { deleteGuideAction } from "@/app/(en)/admin/actions";

interface Props {
  id:   string;
  slug: string;
}

export default function DeleteGuideButton({ id, slug }: Props) {
  return (
    <form
      action={deleteGuideAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${slug}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id"   value={id}   />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="text-sm text-red-500 hover:text-red-700 transition-colors"
      >
        Delete
      </button>
    </form>
  );
}
