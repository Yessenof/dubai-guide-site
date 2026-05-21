"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStepAction } from "@/app/(en)/admin/actions";
import StepCard from "@/components/admin/StepCard";
import type { Step } from "@/lib/db/schema";

interface Props {
  steps:   Step[];
  guideId: string;
  slug:    string;
}

export default function StepList({ steps, guideId, slug }: Props) {
  const router = useRouter();
  const [addPending, startAdd] = useTransition();

  function handleAddStep() {
    const fd = new FormData();
    fd.set("guideId", guideId);
    fd.set("slug",    slug);
    startAdd(async () => {
      await createStepAction(fd);
      router.refresh();
    });
  }

  return (
    <div className="mt-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Steps{steps.length > 0 && ` (${steps.length})`}
        </p>
        <button
          type="button"
          disabled={addPending}
          onClick={handleAddStep}
          className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {addPending ? "Adding…" : "+ Add step"}
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-10 text-center">
          <p className="text-sm text-gray-400">No steps yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Click "+ Add step" to create the first step.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              slug={slug}
              isFirst={i === 0}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
