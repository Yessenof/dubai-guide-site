"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveEventDraftAction, type EventActionState } from "../actions/events";
import type { HubEvent } from "@/lib/db/schema";

type Props = {
  defaultValues?: HubEvent | null;
  savedTs?: string;
};

const INITIAL_STATE: EventActionState = { errors: [], warnings: [] };

const EVENT_CATEGORIES = [
  { value: "holiday",     label: "Holiday" },
  { value: "deadline",    label: "Deadline" },
  { value: "festival",    label: "Festival" },
  { value: "government",  label: "Government" },
  { value: "school",      label: "School" },
  { value: "dubai-event", label: "Dubai Event" },
];

const EVENT_COLOR_TYPES = [
  { value: "public-holiday", label: "Public Holiday" },
  { value: "important-date", label: "Important Date" },
  { value: "deadline",       label: "Deadline" },
  { value: "major-event",    label: "Major Event" },
];

const DATE_CONFIDENCE_VALUES = [
  { value: "confirmed",                        label: "Confirmed" },
  { value: "expected",                         label: "Expected" },
  { value: "subject_to_official_confirmation", label: "Subject to Official Confirmation" },
];

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
  "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

const labelCls = "block text-xs text-gray-500 mb-1.5";

const sectionCls =
  "text-xs font-medium uppercase tracking-widest text-gray-400 mb-4";

const cardCls = "bg-white rounded-2xl border border-gray-100 p-6 space-y-4";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        value="1"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-gray-800"
      />
      <span>
        <span className="text-sm text-gray-700">{label}</span>
        {hint && (
          <span className="block text-xs text-gray-400 mt-0.5">{hint}</span>
        )}
      </span>
    </label>
  );
}

export default function EventForm({ defaultValues: dv, savedTs }: Props) {
  const [state, formAction] = useActionState(saveEventDraftAction, INITIAL_STATE);
  const [showSaved, setShowSaved] = useState(false);

  // Auto-fill state
  const [slugVal, setSlugVal] = useState(dv?.slug ?? "");
  const [seoTitleVal, setSeoTitleVal] = useState(dv?.enSeoTitle ?? "");
  const [metaDescVal, setMetaDescVal] = useState(dv?.enMetaDescription ?? "");

  const slugEdited = useRef(!!dv?.slug);
  const seoEdited = useRef(!!dv?.enSeoTitle);
  const metaEdited = useRef(!!dv?.enMetaDescription);

  useEffect(() => {
    if (!savedTs) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 3000);
    return () => clearTimeout(t);
  }, [savedTs]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    if (!slugEdited.current) setSlugVal(toSlug(title));
    if (!seoEdited.current) setSeoTitleVal(title.slice(0, 60));
  }

  function handleSummaryChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!metaEdited.current) setMetaDescVal(e.target.value.slice(0, 160));
  }

  return (
    <div className="space-y-4">
      {showSaved && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
          Draft saved.
        </div>
      )}

      {state.errors.length > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm font-semibold text-red-700 mb-1.5">Cannot save:</p>
          <ul className="space-y-0.5">
            {state.errors.map((e) => (
              <li key={e} className="text-sm text-red-600">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.warnings.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-semibold text-amber-700 mb-1.5">Warnings:</p>
          <ul className="space-y-0.5">
            {state.warnings.map((w) => (
              <li key={w} className="text-sm text-amber-600">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {dv?.id && <input type="hidden" name="_id" value={dv.id} />}

        {/* ── Core ──────────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Core</p>
          <div className={cardCls}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className={labelCls}>
                  Slug *
                  <span className="ml-1 text-gray-400 font-normal normal-case tracking-normal">
                    (auto-fills from title when empty)
                  </span>
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  value={slugVal}
                  onChange={(e) => {
                    slugEdited.current = true;
                    setSlugVal(e.target.value);
                  }}
                  className={inputCls}
                  placeholder="uae-national-day-2026"
                />
              </div>
              <div>
                <label htmlFor="category" className={labelCls}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={dv?.category ?? "holiday"}
                  className={inputCls}
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="color_type" className={labelCls}>
                Color type
              </label>
              <select
                id="color_type"
                name="color_type"
                defaultValue={dv?.colorType ?? "important-date"}
                className={inputCls}
              >
                {EVENT_COLOR_TYPES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Event dates ───────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Event dates</p>
          <div className={cardCls}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_date_start" className={labelCls}>
                  Start date
                </label>
                <input
                  id="event_date_start"
                  name="event_date_start"
                  type="date"
                  defaultValue={dv?.eventDateStart ?? ""}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="event_date_end" className={labelCls}>
                  End date <span className="text-gray-400">(leave empty for single-day)</span>
                </label>
                <input
                  id="event_date_end"
                  name="event_date_end"
                  type="date"
                  defaultValue={dv?.eventDateEnd ?? ""}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date_confidence" className={labelCls}>
                  Date confidence
                </label>
                <select
                  id="date_confidence"
                  name="date_confidence"
                  defaultValue={dv?.dateConfidence ?? "confirmed"}
                  className={inputCls}
                >
                  {DATE_CONFIDENCE_VALUES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className={labelCls}>
                  Year
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  defaultValue={dv?.year ?? new Date().getFullYear()}
                  className={inputCls}
                  placeholder="2026"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Source ────────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Source</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="source_url" className={labelCls}>
                Source URL{" "}
                <span className="text-red-400">(required when date confidence is &ldquo;confirmed&rdquo;)</span>
              </label>
              <input
                id="source_url"
                name="source_url"
                type="text"
                defaultValue={dv?.sourceUrl ?? ""}
                className={inputCls}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* ── English content ───────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>English content</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="en_title" className={labelCls}>
                Title (EN) *
              </label>
              <input
                id="en_title"
                name="en_title"
                type="text"
                required
                defaultValue={dv?.enTitle ?? ""}
                onChange={handleTitleChange}
                className={inputCls}
                placeholder="UAE National Day 2026"
              />
            </div>
            <div>
              <label htmlFor="en_summary" className={labelCls}>
                Summary (EN)
              </label>
              <textarea
                id="en_summary"
                name="en_summary"
                rows={2}
                defaultValue={dv?.enSummary ?? ""}
                onChange={handleSummaryChange}
                className={inputCls}
                placeholder="1-2 sentences. Used as meta description on publish."
              />
            </div>
            <div>
              <label htmlFor="en_body" className={labelCls}>
                Body (EN)
              </label>
              <textarea
                id="en_body"
                name="en_body"
                rows={8}
                defaultValue={dv?.enBody ?? ""}
                className={inputCls}
                placeholder="Full event description. Required before publishing."
              />
            </div>
          </div>
        </div>

        {/* ── English SEO ───────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>English SEO</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="en_seo_title" className={labelCls}>
                SEO title (EN)
                <span className="ml-1 text-gray-400 font-normal normal-case tracking-normal">
                  (auto-fills from title when empty)
                </span>
              </label>
              <input
                id="en_seo_title"
                name="en_seo_title"
                type="text"
                value={seoTitleVal}
                onChange={(e) => {
                  seoEdited.current = true;
                  setSeoTitleVal(e.target.value);
                }}
                className={inputCls}
                placeholder="Under 60 characters."
              />
            </div>
            <div>
              <label htmlFor="en_meta_description" className={labelCls}>
                Meta description (EN)
                <span className="ml-1 text-gray-400 font-normal normal-case tracking-normal">
                  (auto-fills from summary when empty)
                </span>
              </label>
              <textarea
                id="en_meta_description"
                name="en_meta_description"
                rows={2}
                value={metaDescVal}
                onChange={(e) => {
                  metaEdited.current = true;
                  setMetaDescVal(e.target.value);
                }}
                className={inputCls}
                placeholder="Under 160 characters."
              />
            </div>
          </div>
        </div>

        {/* ── Russian content ───────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Russian content</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="ru_title" className={labelCls}>
                Title (RU)
              </label>
              <input
                id="ru_title"
                name="ru_title"
                type="text"
                defaultValue={dv?.ruTitle ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ru_summary" className={labelCls}>
                Summary (RU)
              </label>
              <textarea
                id="ru_summary"
                name="ru_summary"
                rows={2}
                defaultValue={dv?.ruSummary ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ru_body" className={labelCls}>
                Body (RU)
              </label>
              <textarea
                id="ru_body"
                name="ru_body"
                rows={8}
                defaultValue={dv?.ruBody ?? ""}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── Russian SEO ───────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Russian SEO</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="ru_seo_title" className={labelCls}>
                SEO title (RU)
              </label>
              <input
                id="ru_seo_title"
                name="ru_seo_title"
                type="text"
                defaultValue={dv?.ruSeoTitle ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ru_meta_description" className={labelCls}>
                Meta description (RU)
              </label>
              <textarea
                id="ru_meta_description"
                name="ru_meta_description"
                rows={2}
                defaultValue={dv?.ruMetaDescription ?? ""}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── Related content ───────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Related content</p>
          <div className={cardCls}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="related_guide_slug" className={labelCls}>
                  Related guide slug
                </label>
                <input
                  id="related_guide_slug"
                  name="related_guide_slug"
                  type="text"
                  defaultValue={dv?.relatedGuideSlug ?? ""}
                  className={inputCls}
                  placeholder="employment-visa"
                />
              </div>
              <div>
                <label htmlFor="related_news_slug" className={labelCls}>
                  Related news slug
                </label>
                <input
                  id="related_news_slug"
                  name="related_news_slug"
                  type="text"
                  defaultValue={dv?.relatedNewsSlug ?? ""}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Flags ─────────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Flags</p>
          <div className={cardCls}>
            <CheckboxField
              name="ru_published"
              label="Publish Russian version"
              hint="Requires ru_title and ru_seo_title to be filled."
              defaultChecked={!!dv?.ruPublished}
            />
            <CheckboxField
              name="schema_eligible"
              label="Schema eligible"
              hint="Enable only when date confidence is 'confirmed' and source URL is set."
              defaultChecked={dv ? !!dv.schemaEligible : true}
            />
            <CheckboxField
              name="featured_calendar"
              label="Feature on calendar"
              defaultChecked={dv ? !!dv.featuredCalendar : true}
            />
            <CheckboxField
              name="featured_homepage"
              label="Feature on homepage"
              defaultChecked={!!dv?.featuredHomepage}
            />
            <CheckboxField
              name="featured_digest"
              label="Include in digest"
              defaultChecked={!!dv?.featuredDigest}
            />
          </div>
        </div>

        {/* ── Tags ──────────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Tags</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="tags_json" className={labelCls}>
                Tags (JSON array)
              </label>
              <input
                id="tags_json"
                name="tags_json"
                type="text"
                defaultValue={dv?.tagsJson ?? "[]"}
                className={inputCls}
                placeholder={`["holiday","uae"]`}
              />
            </div>
          </div>
        </div>

        {/* ── Draft guidance + Actions ───────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Draft</span> saves freely with title and slug only.{" "}
            <span className="font-medium text-gray-700">Publish</span> requires source URL, SEO fields, and event body. Set schema eligible only when date confidence is confirmed.
          </div>
          <button
            type="submit"
            className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Save draft
          </button>
        </div>
      </form>
    </div>
  );
}
