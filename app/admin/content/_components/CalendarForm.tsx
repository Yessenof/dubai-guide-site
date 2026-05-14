"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveCalendarDraftAction, type CalendarActionState } from "../actions/calendar";
import type { CalendarPage } from "@/lib/db/schema";

type Props = {
  defaultValues?: CalendarPage | null;
  savedTs?: string;
};

const INITIAL_STATE: CalendarActionState = { errors: [], warnings: [] };

const CALENDAR_TYPES = [
  { value: "monthly",         label: "Monthly" },
  { value: "yearly",          label: "Yearly" },
  { value: "holidays",        label: "Holidays" },
  { value: "important_dates", label: "Important Dates" },
  { value: "ramadan",         label: "Ramadan" },
  { value: "school",          label: "School" },
];

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
  "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

const labelCls = "block text-xs text-gray-500 mb-1.5";
const sectionCls = "text-xs font-medium uppercase tracking-widest text-gray-400 mb-4";
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

export default function CalendarForm({ defaultValues: dv, savedTs }: Props) {
  const [state, formAction] = useActionState(saveCalendarDraftAction, INITIAL_STATE);
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
                  placeholder="uae-public-holidays-2026"
                />
              </div>
              <div>
                <label htmlFor="calendar_type" className={labelCls}>
                  Calendar type
                </label>
                <select
                  id="calendar_type"
                  name="calendar_type"
                  defaultValue={dv?.calendarType ?? "monthly"}
                  className={inputCls}
                >
                  {CALENDAR_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className={labelCls}>
                  Year *
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
              <div>
                <label htmlFor="month" className={labelCls}>
                  Month (1–12, leave blank for yearly)
                </label>
                <input
                  id="month"
                  name="month"
                  type="number"
                  min={1}
                  max={12}
                  defaultValue={dv?.month ?? ""}
                  className={inputCls}
                  placeholder="Leave blank for yearly"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Verification & source ─────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Verification &amp; source</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="official_source_url" className={labelCls}>
                Official source URL <span className="text-red-400">(required before publishing)</span>
              </label>
              <input
                id="official_source_url"
                name="official_source_url"
                type="text"
                defaultValue={dv?.officialSourceUrl ?? ""}
                className={inputCls}
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="last_verified_date" className={labelCls}>
                Last verified date <span className="text-red-400">(required before publishing)</span>
              </label>
              <input
                id="last_verified_date"
                name="last_verified_date"
                type="date"
                defaultValue={dv?.lastVerifiedDate ?? ""}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── Image ─────────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Image</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="image_path" className={labelCls}>
                Image path <span className="text-red-400">(required before publishing)</span>
              </label>
              <input
                id="image_path"
                name="image_path"
                type="text"
                defaultValue={dv?.imagePath ?? ""}
                className={inputCls}
                placeholder="/images/calendar/uae-holidays-2026.jpg"
              />
            </div>
            <div>
              <label htmlFor="image_alt" className={labelCls}>
                Image alt (EN) <span className="text-gray-400">(required if image path is set)</span>
              </label>
              <input
                id="image_alt"
                name="image_alt"
                type="text"
                defaultValue={dv?.imageAlt ?? ""}
                className={inputCls}
                placeholder="UAE public holidays calendar 2026"
              />
            </div>
            <div>
              <label htmlFor="ru_image_alt" className={labelCls}>
                Image alt (RU) <span className="text-gray-400">(required if image path set and RU published)</span>
              </label>
              <input
                id="ru_image_alt"
                name="ru_image_alt"
                type="text"
                defaultValue={dv?.ruImageAlt ?? ""}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── Dates JSON ────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Dates JSON</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="dates_json" className={labelCls}>
                dates_json <span className="text-red-400">(required before publishing — at least 1 entry)</span>
              </label>
              <textarea
                id="dates_json"
                name="dates_json"
                rows={10}
                defaultValue={dv?.datesJson ?? "[]"}
                className={`${inputCls} font-mono text-xs`}
                placeholder={`[
  {
    "date": "2026-12-02",
    "label_en": "UAE National Day",
    "label_ru": "День ОАЭ",
    "type": "public-holiday",
    "confidence": "confirmed",
    "source": "https://..."
  }
]`}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Each entry: date, label_en, label_ru, type (public-holiday / important-date / deadline / other), confidence (confirmed / expected / subject_to_official_confirmation), source.
              </p>
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
                placeholder="UAE Public Holidays 2026"
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
                rows={10}
                defaultValue={dv?.enBody ?? ""}
                className={inputCls}
                placeholder="Full page content. Required before publishing."
              />
            </div>
            <div>
              <label htmlFor="en_notes" className={labelCls}>
                Notes (EN){" "}
                <span className="text-gray-400">(Islamic dates disclaimer goes here when has_islamic_dates is on)</span>
              </label>
              <textarea
                id="en_notes"
                name="en_notes"
                rows={3}
                defaultValue={dv?.enNotes ?? ""}
                className={inputCls}
                placeholder="Islamic holiday dates are subject to moon sighting. Dates may change."
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
              <label htmlFor="ru_title" className={labelCls}>Title (RU)</label>
              <input id="ru_title" name="ru_title" type="text" defaultValue={dv?.ruTitle ?? ""} className={inputCls} />
            </div>
            <div>
              <label htmlFor="ru_summary" className={labelCls}>Summary (RU)</label>
              <textarea id="ru_summary" name="ru_summary" rows={2} defaultValue={dv?.ruSummary ?? ""} className={inputCls} />
            </div>
            <div>
              <label htmlFor="ru_body" className={labelCls}>Body (RU)</label>
              <textarea id="ru_body" name="ru_body" rows={10} defaultValue={dv?.ruBody ?? ""} className={inputCls} />
            </div>
            <div>
              <label htmlFor="ru_notes" className={labelCls}>Notes (RU)</label>
              <textarea id="ru_notes" name="ru_notes" rows={3} defaultValue={dv?.ruNotes ?? ""} className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Russian SEO ───────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Russian SEO</p>
          <div className={cardCls}>
            <div>
              <label htmlFor="ru_seo_title" className={labelCls}>SEO title (RU)</label>
              <input id="ru_seo_title" name="ru_seo_title" type="text" defaultValue={dv?.ruSeoTitle ?? ""} className={inputCls} />
            </div>
            <div>
              <label htmlFor="ru_meta_description" className={labelCls}>Meta description (RU)</label>
              <textarea id="ru_meta_description" name="ru_meta_description" rows={2} defaultValue={dv?.ruMetaDescription ?? ""} className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Flags ─────────────────────────────────────────────────── */}
        <div>
          <p className={sectionCls}>Flags</p>
          <div className={cardCls}>
            <CheckboxField
              name="has_islamic_dates"
              label="Contains Islamic dates"
              hint='Requires "subject to moon sighting" in EN notes before publishing.'
              defaultChecked={!!dv?.hasIslamicDates}
            />
            <CheckboxField
              name="ru_published"
              label="Publish Russian version"
              hint="Requires ru_title and ru_body to be filled."
              defaultChecked={!!dv?.ruPublished}
            />
            <CheckboxField
              name="featured_homepage"
              label="Feature on homepage"
              defaultChecked={!!dv?.featuredHomepage}
            />
          </div>
        </div>

        {/* ── Draft guidance + Actions ───────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Draft</span> saves freely with title and slug only.{" "}
            <span className="font-medium text-gray-700">Publish</span> requires source URL, verified date, image path, image alt, SEO fields, and at least 1 date entry.
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
