"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateStepAction,
  deleteStepAction,
  reorderStepAction,
} from "@/app/(en)/admin/actions";
import type { Step } from "@/lib/db/schema";

interface Props {
  step:    Step;
  slug:    string;
  isFirst: boolean;
  isLast:  boolean;
}

const field =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
  "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

const label = "block text-xs text-gray-500 mb-1.5";

const sectionLabel =
  "text-xs font-medium uppercase tracking-widest text-gray-400 mb-3";

export default function StepCard({ step, slug, isFirst, isLast }: Props) {
  const router = useRouter();
  const [savePending,    startSave]    = useTransition();
  const [deletePending,  startDelete]  = useTransition();
  const [reorderPending, startReorder] = useTransition();

  const isPending = savePending || deletePending || reorderPending;

  function handleSave(formData: FormData) {
    startSave(async () => {
      await updateStepAction(formData);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete step ${step.stepOrder}? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set("id",      step.id);
    fd.set("guideId", step.guideId);
    fd.set("slug",    slug);
    startDelete(async () => {
      await deleteStepAction(fd);
      router.refresh();
    });
  }

  function handleReorder(direction: "up" | "down") {
    const fd = new FormData();
    fd.set("id",        step.id);
    fd.set("guideId",   step.guideId);
    fd.set("slug",      slug);
    fd.set("direction", direction);
    startReorder(async () => {
      await reorderStepAction(fd);
      router.refresh();
    });
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 transition-opacity ${isPending ? "opacity-50" : ""}`}>

      {/* Step header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Step {step.stepOrder}
          {step.enTitle && (
            <span className="normal-case tracking-normal font-normal text-gray-500 ml-2">
              — {step.enTitle}
            </span>
          )}
        </span>

        {/* Reorder + delete controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isFirst || isPending}
            onClick={() => handleReorder("up")}
            className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast || isPending}
            onClick={() => handleReorder("down")}
            className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↓
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit form — standalone, never nested inside the guide form */}
      <form action={handleSave}>
        <input type="hidden" name="id"   value={step.id} />
        <input type="hidden" name="slug" value={slug}    />

        <div className="space-y-5">

          {/* Shared fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Estimated cost</label>
              <input
                name="cost" type="text"
                defaultValue={step.cost}
                className={field}
                placeholder="AED 220"
              />
            </div>
            <div>
              <label className={label}>Estimated time *</label>
              <input
                name="timeEst" type="text" required
                defaultValue={step.timeEst}
                className={field}
                placeholder="2–3 days"
              />
            </div>
          </div>

          {/* English content */}
          <div>
            <p className={sectionLabel}>English</p>
            <div className="space-y-3">
              <div>
                <label className={label}>Title</label>
                <input
                  name="enTitle" type="text"
                  defaultValue={step.enTitle}
                  className={field}
                  placeholder="Submit the application"
                />
              </div>
              <div>
                <label className={label}>What to do</label>
                <textarea
                  name="enWhat" rows={2}
                  defaultValue={step.enWhat}
                  className={field}
                  placeholder="Describe what the applicant needs to do."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Where to go</label>
                  <input
                    name="enWhere" type="text"
                    defaultValue={step.enWhere}
                    className={field}
                    placeholder="GDRFA / MOHRE / Amer Centre"
                  />
                </div>
                <div>
                  <label className={label}>Address or URL</label>
                  <input
                    name="enAddress" type="text"
                    defaultValue={step.enAddress}
                    className={field}
                    placeholder="Baniyas Rd, Deira / gdrfad.gov.ae"
                  />
                </div>
              </div>
              <div>
                <label className={label}>Advice</label>
                <textarea
                  name="enAdvice" rows={2}
                  defaultValue={step.enAdvice}
                  className={field}
                  placeholder="Practical tip for this step."
                />
              </div>
              <div>
                <label className={label}>
                  Warning{" "}
                  <span className="text-gray-300 font-normal">(optional — leave blank to hide)</span>
                </label>
                <textarea
                  name="enWarning" rows={2}
                  defaultValue={step.enWarning}
                  className={field}
                  placeholder="Common mistake or caveat."
                />
              </div>
            </div>
          </div>

          {/* Russian content */}
          <div>
            <p className={sectionLabel}>Russian</p>
            <div className="space-y-3">
              <div>
                <label className={label}>Title (RU)</label>
                <input
                  name="ruTitle" type="text"
                  defaultValue={step.ruTitle}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>What to do (RU)</label>
                <textarea
                  name="ruWhat" rows={2}
                  defaultValue={step.ruWhat}
                  className={field}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Where to go (RU)</label>
                  <input
                    name="ruWhere" type="text"
                    defaultValue={step.ruWhere}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>Address or URL (RU)</label>
                  <input
                    name="ruAddress" type="text"
                    defaultValue={step.ruAddress}
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className={label}>Advice (RU)</label>
                <textarea
                  name="ruAdvice" rows={2}
                  defaultValue={step.ruAdvice}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Warning (RU)</label>
                <textarea
                  name="ruWarning" rows={2}
                  defaultValue={step.ruWarning}
                  className={field}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Save button */}
        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {savePending ? "Saving…" : "Save step"}
          </button>
        </div>
      </form>
    </div>
  );
}
