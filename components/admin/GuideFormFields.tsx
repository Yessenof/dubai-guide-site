import type { Guide } from "@/lib/db/schema";

const CATEGORIES = [
  { value: "visas",          label: "Visas"          },
  { value: "company-setup",  label: "Company Setup"  },
  { value: "hiring",         label: "Hiring"         },
  { value: "living",         label: "Living"         },
  { value: "government",     label: "Government"     },
];

const field =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
  "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

const label = "block text-xs text-gray-500 mb-1.5";

const section =
  "text-xs font-medium uppercase tracking-widest text-gray-400 mb-4";

interface Props {
  defaults?: Partial<Guide>;
}

export default function GuideFormFields({ defaults = {} }: Props) {
  return (
    <div className="space-y-6">
      {/* ── Guide details ──────────────────────────────────────────── */}
      <div>
        <p className={section}>Guide details</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="enTitle" className={label}>English title *</label>
              <input
                id="enTitle" name="enTitle" type="text" required
                defaultValue={defaults.enTitle ?? ""}
                className={field}
                placeholder="How to Get an Employment Visa in Dubai"
              />
            </div>
            <div>
              <label htmlFor="slug" className={label}>Slug</label>
              <input
                id="slug" name="slug" type="text"
                defaultValue={defaults.slug ?? ""}
                className={field}
                placeholder="employment-visa  (auto-generated if empty)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className={label}>Category</label>
              <select
                id="category" name="category"
                defaultValue={defaults.category ?? "visas"}
                className={field}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className={label}>Estimated cost</label>
              <input
                id="price" name="price" type="text"
                defaultValue={defaults.price ?? ""}
                className={field}
                placeholder="AED 3,000 – 5,000"
              />
            </div>
            <div>
              <label htmlFor="timeline" className={label}>Timeline</label>
              <input
                id="timeline" name="timeline" type="text"
                defaultValue={defaults.timeline ?? ""}
                className={field}
                placeholder="3–5 weeks"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastUpdated" className={label}>Last updated</label>
              <input
                id="lastUpdated" name="lastUpdated" type="text"
                defaultValue={defaults.lastUpdated ?? ""}
                className={field}
                placeholder="April 2025"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── English content ────────────────────────────────────────── */}
      <div>
        <p className={section}>English content</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

          <div>
            <label htmlFor="enSummary" className={label}>Summary</label>
            <textarea
              id="enSummary" name="enSummary" rows={3}
              defaultValue={defaults.enSummary ?? ""}
              className={field}
              placeholder="Shown on guide cards and in meta description."
            />
          </div>

          <div>
            <label htmlFor="enAudience" className={label}>Who this is for</label>
            <input
              id="enAudience" name="enAudience" type="text"
              defaultValue={defaults.enAudience ?? ""}
              className={field}
              placeholder="Employees being sponsored by a UAE-based employer"
            />
          </div>

          <div>
            <label htmlFor="enOverview" className={label}>
              Overview{" "}
              <span className="text-gray-300 font-normal">
                (separate paragraphs with a blank line)
              </span>
            </label>
            <textarea
              id="enOverview" name="enOverview" rows={8}
              defaultValue={defaults.enOverview ?? ""}
              className={field}
              placeholder="First paragraph of the overview.&#10;&#10;Second paragraph of the overview."
            />
          </div>

        </div>
      </div>

      {/* ── Russian content ────────────────────────────────────────── */}
      <div>
        <p className={section}>Russian content</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

          <div>
            <label htmlFor="ruTitle" className={label}>Title (RU)</label>
            <input
              id="ruTitle" name="ruTitle" type="text"
              defaultValue={defaults.ruTitle ?? ""}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="ruSummary" className={label}>Summary (RU)</label>
            <textarea
              id="ruSummary" name="ruSummary" rows={3}
              defaultValue={defaults.ruSummary ?? ""}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="ruAudience" className={label}>Who this is for (RU)</label>
            <input
              id="ruAudience" name="ruAudience" type="text"
              defaultValue={defaults.ruAudience ?? ""}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="ruOverview" className={label}>Overview (RU)</label>
            <textarea
              id="ruOverview" name="ruOverview" rows={8}
              defaultValue={defaults.ruOverview ?? ""}
              className={field}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
