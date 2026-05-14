"use client";

import { useState } from "react";
import {
  saveAsNewsDraftAction,
  saveAsEventDraftAction,
  saveAsCalendarDraftAction,
} from "../actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type InputType =
  | "url"
  | "pasted-text"
  | "government-source"
  | "media-article"
  | "telegram-social"
  | "event-listing"
  | "pdf-notes"
  | "screenshot-notes"
  | "internal-idea";

type ContentType = "news" | "event" | "calendar" | "guide-update" | "service" | "ignore";
type SourceReliability = "official" | "trusted-media" | "social-signal" | "internal-note" | "unknown";
type RiskLevel = "low" | "medium" | "high";
type Confidence = "high" | "medium" | "low";

interface Classification {
  type: ContentType;
  typeConfidence: Confidence;
  sourceReliability: SourceReliability;
  risk: RiskLevel;
  verificationRequired: boolean;
  why: string;
}

interface DraftFields {
  slug: string;
  enTitle: string;
  enSummary: string;
  enBody: string;
  sourceUrl: string;
  category: string;
  imageDirection: string;
  datesDetected: string[];
  missingFields: string[];
}

const INPUT_TYPE_OPTIONS: { value: InputType; label: string }[] = [
  { value: "url",               label: "URL" },
  { value: "government-source", label: "Government source" },
  { value: "media-article",     label: "Media article" },
  { value: "event-listing",     label: "Event listing" },
  { value: "pasted-text",       label: "Pasted text" },
  { value: "telegram-social",   label: "Telegram / social signal" },
  { value: "pdf-notes",         label: "PDF notes" },
  { value: "screenshot-notes",  label: "Screenshot notes" },
  { value: "internal-idea",     label: "Internal idea / note" },
];

// ── Deterministic classifier ──────────────────────────────────────────────────

function classify(inputType: InputType, text: string, sourceUrl: string): Classification {
  const lower = (text + " " + sourceUrl).toLowerCase();

  // Content type detection
  let type: ContentType = "news";
  let typeConfidence: Confidence = "medium";
  let why = "";

  const calendarKw   = ["calendar", "monthly calendar", "yearly calendar", "compliance calendar", "holiday calendar", "public holidays 20", "al adha", "al fitr"];
  const eventKw      = ["deadline", "public holiday", "eid", "national day", "exhibition", "expo", "festival", "apply by", "effective from", "cutoff", "event date", "last day to"];
  const newsKw       = ["mohre", "gdrfa", "ica", "fta", "ministry", "announces", "new rule", "new law", "regulation", "visa rule", "amendment", "circular", "policy update"];
  const guideKw      = ["how to", "step-by-step", "procedure", "process", "guide", "apply for", "requirements for"];

  if (inputType === "event-listing") {
    type = "event"; typeConfidence = "high"; why = "Input type is 'Event listing'.";
  } else if (calendarKw.some((k) => lower.includes(k))) {
    type = "calendar"; typeConfidence = "high"; why = "Calendar keywords detected in input.";
  } else if (eventKw.some((k) => lower.includes(k))) {
    type = "event";
    typeConfidence = (lower.includes("deadline") || lower.includes("public holiday")) ? "high" : "medium";
    why = "Event-type keywords detected (deadline, public holiday, or dated event).";
  } else if (guideKw.some((k) => lower.includes(k))) {
    type = "guide-update"; typeConfidence = "medium"; why = "How-to / procedural content detected.";
  } else if (newsKw.some((k) => lower.includes(k))) {
    type = "news"; typeConfidence = "medium"; why = "News-type keywords detected (regulation, ministry, or announcement).";
  } else if (["internal-idea", "screenshot-notes"].includes(inputType)) {
    type = "news"; typeConfidence = "low"; why = "Internal note — type unclear, defaulting to News. Please verify.";
  } else {
    type = "news"; typeConfidence = "low"; why = "No strong signal detected. Defaulting to News. Please verify the type manually.";
  }

  // Source reliability
  const govDomains   = ["gov.ae", "u.ae", "mohre.gov", "gdrfa.gov", "ica.gov", "mof.gov", "fta.gov", "economy.gov", "tca.gov", "dm.gov", "rta.ae", "moccae.gov", "adm.gov", "dubailand.gov"];
  const mediaDomains = ["thenationalnews", "khaleejtimes", "gulfnews", "zawya", "arabianbusiness", "bloomberg", "reuters", "wam.ae"];
  let sourceReliability: SourceReliability = "unknown";
  const urlLower = sourceUrl.toLowerCase();

  if (govDomains.some((d) => urlLower.includes(d))) {
    sourceReliability = "official";
  } else if (mediaDomains.some((d) => urlLower.includes(d))) {
    sourceReliability = "trusted-media";
  } else if (inputType === "telegram-social") {
    sourceReliability = "social-signal";
  } else if (["internal-idea", "screenshot-notes", "pdf-notes"].includes(inputType)) {
    sourceReliability = "internal-note";
  } else if (sourceUrl.trim()) {
    sourceReliability = "unknown";
  }

  // Risk
  const highRiskKw = ["penalty", "fine", "criminal", "jail", "deportation", "banned", "blacklist", "illegal", "tax evasion", "violat"];
  const lowRiskKw  = ["exhibition", "festival", "expo", "public holiday", "eid", "national day"];
  let risk: RiskLevel = "medium";
  if (highRiskKw.some((k) => lower.includes(k)) || sourceReliability === "social-signal") {
    risk = "high";
  } else if (lowRiskKw.some((k) => lower.includes(k)) && sourceReliability !== "unknown") {
    risk = "low";
  }

  const verificationRequired = risk === "high" || sourceReliability === "unknown" || sourceReliability === "social-signal";

  return { type, typeConfidence, sourceReliability, risk, verificationRequired, why };
}

// ── Draft preparer ────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}

function prepareDraft(inputType: InputType, text: string, sourceUrl: string, c: Classification): DraftFields {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0]?.slice(0, 100) || "";

  // Try title from URL path
  let titleFromUrl = "";
  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl.startsWith("http") ? sourceUrl : "https://" + sourceUrl);
      const last = url.pathname.split("/").filter(Boolean).pop() || "";
      titleFromUrl = last.replace(/[-_]/g, " ").replace(/\.\w+$/, "");
      titleFromUrl = titleFromUrl.charAt(0).toUpperCase() + titleFromUrl.slice(1);
    } catch { /* ignore */ }
  }

  const rawTitle = firstLine || titleFromUrl || "Draft (AI title generation pending)";
  const slug = slugify(rawTitle) || "ai-draft-" + Date.now().toString(36).slice(-6);

  // Dates
  const dateRx = /\b(\d{1,2}[\s\-\/]\w+[\s\-\/]\d{4}|\w+ \d{1,2},? \d{4}|\d{4}-\d{2}-\d{2})\b/g;
  const datesDetected = [...new Set(text.match(dateRx) || [])].slice(0, 5);

  // Category guess
  const lower = text.toLowerCase();
  let category = c.type === "event" ? "holiday" : "visa";
  if (lower.includes("company") || lower.includes("business") || lower.includes("license") || lower.includes("freezone") || lower.includes("free zone")) category = "company";
  else if (lower.includes("tax") || lower.includes("vat") || lower.includes(" fta ") || lower.includes("e-invoice")) category = "tax";
  else if (lower.includes("tourism") || lower.includes("hotel") || lower.includes("attraction") || lower.includes("visit")) category = "tourism";
  else if (lower.includes("banking") || lower.includes(" bank ") || lower.includes("account") || lower.includes("transfer")) category = "banking";
  else if (lower.includes("hiring") || lower.includes("labour") || lower.includes("employment") || lower.includes("mohre") || lower.includes("worker")) category = c.type === "event" ? "government" : "visa";

  // Image direction
  const directions: Record<ContentType, string> = {
    "news":         "Clean editorial graphic: UAE official seal or government building. No stock photos of people. White / neutral background.",
    "event":        "Event milestone visual: UAE flag, official colours, or dated milestone graphic. Clean and minimal.",
    "calendar":     "Calendar grid visual with UAE branding, verified dates highlighted. Premium minimal design.",
    "guide-update": "Process-step illustration: clean icon set or flowchart on white background.",
    "service":      "Service card visual: clean branded graphic, no people.",
    "ignore":       "No image needed.",
  };

  // Missing fields
  const missing: string[] = [];
  if (!sourceUrl) missing.push("source_url — required for publish");
  if (c.type === "event" && datesDetected.length === 0) missing.push("event_date_start — no date detected in input");
  if (c.type === "calendar") missing.push("image_path — required before calendar page can publish");
  missing.push("SEO title — AI generation pending");
  missing.push("Meta description — AI generation pending");
  missing.push("RU translation — AI generation pending");
  if (c.verificationRequired) missing.push("Source verification — high-risk or unknown source requires human check");

  return {
    slug,
    enTitle:        rawTitle,
    enSummary:      lines[1]?.slice(0, 200) || "",
    enBody:         text.slice(0, 1200),
    sourceUrl,
    category,
    imageDirection: directions[c.type],
    datesDetected,
    missingFields:  missing,
  };
}

// ── Helper UI ─────────────────────────────────────────────────────────────────

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  "news":         "News",
  "event":        "Event",
  "calendar":     "Calendar Visual Post",
  "guide-update": "Guide update",
  "service":      "Service page",
  "ignore":       "Ignore",
};

const CONFIDENCE_DOTS: Record<Confidence, string> = {
  "high":   "●●●",
  "medium": "●●○",
  "low":    "●○○",
};

const RELIABILITY_COLORS: Record<SourceReliability, string> = {
  "official":      "text-emerald-700 bg-emerald-50",
  "trusted-media": "text-blue-700 bg-blue-50",
  "social-signal": "text-amber-700 bg-amber-50",
  "internal-note": "text-gray-600 bg-gray-100",
  "unknown":       "text-red-600 bg-red-50",
};

const RISK_COLORS: Record<RiskLevel, string> = {
  "low":    "text-emerald-700 bg-emerald-50",
  "medium": "text-amber-700 bg-amber-50",
  "high":   "text-red-700 bg-red-50",
};

const RELIABILITY_LABELS: Record<SourceReliability, string> = {
  "official":      "Official",
  "trusted-media": "Trusted media",
  "social-signal": "Social signal",
  "internal-note": "Internal note",
  "unknown":       "Unknown",
};

// ── Main component ────────────────────────────────────────────────────────────

export default function AiInboxClient({ saveError }: { saveError?: string }) {
  const [inputType,  setInputType]  = useState<InputType>("url");
  const [mainInput,  setMainInput]  = useState("");
  const [sourceUrl,  setSourceUrl]  = useState("");
  const [instruction, setInstruction] = useState("");
  const [phase,      setPhase]      = useState<"input" | "draft">("input");
  const [classification, setClassification] = useState<Classification | null>(null);
  const [draftFields,    setDraftFields]    = useState<DraftFields | null>(null);

  function handleClassify() {
    if (!mainInput.trim()) return;
    const c = classify(inputType, mainInput, sourceUrl);
    const d = prepareDraft(inputType, mainInput, sourceUrl, c);
    setClassification(c);
    setDraftFields(d);
    setPhase("draft");
  }

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
    "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

  const canSaveAsNews     = classification?.type === "news"     || classification?.type === "guide-update";
  const canSaveAsEvent    = classification?.type === "event";
  const canSaveAsCalendar = classification?.type === "calendar";

  // ── Input phase ──────────────────────────────────────────────────────────

  if (phase === "input") {
    return (
      <div className="space-y-4 max-w-2xl">

        {saveError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            Save failed: {saveError}. Please try again or use the Advanced Editor.
          </div>
        )}

        {/* AI runtime notice */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">AI runtime not connected.</span>{" "}
          This screen uses a deterministic local classifier to suggest content type, source reliability, and draft structure.
          Real AI generation (titles, summaries, SEO, RU translation) is Phase 4B-2.
        </div>

        {/* Input panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Input
          </p>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Input type</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as InputType)}
              className={inputCls}
            >
              {INPUT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Main input
              <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">
                — paste URL, article text, Telegram message, PDF notes, or idea
              </span>
            </label>
            <textarea
              rows={10}
              value={mainInput}
              onChange={(e) => setMainInput(e.target.value)}
              className={inputCls}
              placeholder={
                inputType === "url"
                  ? "https://mohre.gov.ae/..."
                  : inputType === "telegram-social"
                  ? "Paste Telegram channel message here..."
                  : inputType === "event-listing"
                  ? "Event name, date, location, organiser..."
                  : "Paste the full article, announcement, or your notes here..."
              }
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Source URL
              <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">
                (optional — helps classify source reliability)
              </span>
            </label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Owner instruction
              <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">
                (optional — guide draft focus)
              </span>
            </label>
            <textarea
              rows={2}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className={inputCls}
              placeholder='e.g. "Make it shorter, focus on visa impact, prepare RU version too."'
            />
            <p className="text-xs text-gray-400 mt-1">
              Will be applied when AI runtime is connected (Phase 4B-2).
            </p>
          </div>

          <button
            onClick={handleClassify}
            disabled={!mainInput.trim()}
            className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Classify & prepare draft →
          </button>
        </div>
      </div>
    );
  }

  // ── Draft phase ───────────────────────────────────────────────────────────

  if (!classification || !draftFields) return null;

  return (
    <div className="space-y-4">

      {/* Back */}
      <button
        onClick={() => setPhase("input")}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Back to input
      </button>

      {/* AI runtime notice */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
        <span className="font-semibold">AI runtime not connected.</span>{" "}
        Draft fields below are deterministic placeholders — titles, summaries, SEO, and RU translation require AI generation (Phase 4B-2).
        Save now to create a minimal draft, then complete in the Advanced Editor.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">

        {/* Left: Draft preview */}
        <div className="space-y-4">

          {/* Content type header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                AI Draft Preview
              </span>
              <span className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2.5 py-0.5">
                {CONTENT_TYPE_LABELS[classification.type]}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Title</p>
                <p className="text-sm font-semibold text-gray-900">{draftFields.enTitle}</p>
                <p className="text-[10px] text-amber-600 mt-0.5">AI generation pending — will be improved with runtime</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Slug</p>
                <p className="text-xs font-mono text-gray-600">{draftFields.slug}</p>
              </div>
              {draftFields.enSummary && (
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Summary</p>
                  <p className="text-sm text-gray-600">{draftFields.enSummary}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Body excerpt (from input)</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {draftFields.enBody.slice(0, 300)}{draftFields.enBody.length > 300 ? "…" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Detected metadata</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-400 mb-0.5">Category</p>
                <p className="text-gray-700 font-medium capitalize">{draftFields.category}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Source URL</p>
                {draftFields.sourceUrl ? (
                  <p className="text-gray-700 font-mono truncate">{draftFields.sourceUrl}</p>
                ) : (
                  <p className="text-red-500">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">SEO title</p>
                <p className="text-amber-600">AI generation pending</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Meta description</p>
                <p className="text-amber-600">AI generation pending</p>
              </div>
            </div>
            {draftFields.datesDetected.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs mb-1">Dates detected in input</p>
                <div className="flex flex-wrap gap-1.5">
                  {draftFields.datesDetected.map((d) => (
                    <span key={d} className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image direction */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Image direction</p>
            <p className="text-sm text-gray-600 leading-relaxed">{draftFields.imageDirection}</p>
            <p className="text-xs text-amber-600">
              AI image workflow will suggest specific visual prompts (Phase 4B-3). Manual image path is an advanced override.
            </p>
          </div>

          {/* RU draft */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Russian version</p>
            <p className="text-sm text-gray-400 italic">RU translation will be generated by AI runtime (Phase 4B-2).</p>
            <p className="text-xs text-gray-400">
              ru_published remains off until you review and approve the RU version. English will publish independently.
            </p>
          </div>

          {/* Missing fields */}
          {draftFields.missingFields.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Missing before publish</p>
              <ul className="space-y-1">
                {draftFields.missingFields.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="mt-0.5 w-3 h-3 rounded border border-gray-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Classification + Save */}
        <div className="space-y-4">

          {/* Classification card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Classification</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Type</span>
                <span className="text-xs font-semibold text-gray-800">
                  {CONTENT_TYPE_LABELS[classification.type]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Confidence</span>
                <span className="text-xs font-mono text-gray-600">
                  {CONFIDENCE_DOTS[classification.typeConfidence]} {classification.typeConfidence}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Source</span>
                <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${RELIABILITY_COLORS[classification.sourceReliability]}`}>
                  {RELIABILITY_LABELS[classification.sourceReliability]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Risk</span>
                <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${RISK_COLORS[classification.risk]}`}>
                  {classification.risk.charAt(0).toUpperCase() + classification.risk.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Verification</span>
                <span className={`text-[10px] font-semibold ${classification.verificationRequired ? "text-red-600" : "text-emerald-600"}`}>
                  {classification.verificationRequired ? "Required" : "Not required"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 border-t border-gray-100 pt-2 leading-relaxed">
              {classification.why}
            </p>
          </div>

          {/* Save actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Save draft</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Saves a minimal draft. Complete all fields in the Advanced Editor before publishing.
            </p>

            {/* Save as News */}
            <form action={saveAsNewsDraftAction}>
              <input type="hidden" name="slug"       value={draftFields.slug} />
              <input type="hidden" name="en_title"   value={draftFields.enTitle} />
              <input type="hidden" name="en_body"    value={draftFields.enBody} />
              <input type="hidden" name="source_url" value={draftFields.sourceUrl} />
              <input type="hidden" name="category"   value={draftFields.category} />
              <button
                type="submit"
                className={`w-full text-sm font-medium rounded-xl px-4 py-2.5 transition-colors text-left ${
                  canSaveAsNews
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!canSaveAsNews}
                title={!canSaveAsNews ? "Classification suggests this is not a News post" : undefined}
              >
                Save as News draft →
              </button>
            </form>

            {/* Save as Event */}
            <form action={saveAsEventDraftAction}>
              <input type="hidden" name="slug"       value={draftFields.slug} />
              <input type="hidden" name="en_title"   value={draftFields.enTitle} />
              <input type="hidden" name="en_body"    value={draftFields.enBody} />
              <input type="hidden" name="source_url" value={draftFields.sourceUrl} />
              <input type="hidden" name="category"   value={draftFields.category === "holiday" ? "holiday" : "government"} />
              <button
                type="submit"
                className={`w-full text-sm font-medium rounded-xl px-4 py-2.5 transition-colors text-left ${
                  canSaveAsEvent
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!canSaveAsEvent}
                title={!canSaveAsEvent ? "Classification suggests this is not an Event" : undefined}
              >
                Save as Event draft →
              </button>
            </form>

            {/* Save as Calendar */}
            <form action={saveAsCalendarDraftAction}>
              <input type="hidden" name="slug"     value={draftFields.slug} />
              <input type="hidden" name="en_title" value={draftFields.enTitle} />
              <input type="hidden" name="en_body"  value={draftFields.enBody} />
              <button
                type="submit"
                className={`w-full text-sm font-medium rounded-xl px-4 py-2.5 transition-colors text-left ${
                  canSaveAsCalendar
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!canSaveAsCalendar}
                title={!canSaveAsCalendar ? "Classification suggests this is not a Calendar post" : undefined}
              >
                Save as Calendar Visual Post →
              </button>
            </form>

            {/* Override: save to any type */}
            <details className="mt-1">
              <summary className="text-[10px] text-gray-400 cursor-pointer select-none hover:text-gray-600">
                Override classification and save as different type
              </summary>
              <div className="mt-2 space-y-2">
                <form action={saveAsNewsDraftAction}>
                  <input type="hidden" name="slug"       value={draftFields.slug} />
                  <input type="hidden" name="en_title"   value={draftFields.enTitle} />
                  <input type="hidden" name="en_body"    value={draftFields.enBody} />
                  <input type="hidden" name="source_url" value={draftFields.sourceUrl} />
                  <input type="hidden" name="category"   value={draftFields.category} />
                  <button type="submit" className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors">
                    Force save as News
                  </button>
                </form>
                <form action={saveAsEventDraftAction}>
                  <input type="hidden" name="slug"       value={draftFields.slug} />
                  <input type="hidden" name="en_title"   value={draftFields.enTitle} />
                  <input type="hidden" name="en_body"    value={draftFields.enBody} />
                  <input type="hidden" name="source_url" value={draftFields.sourceUrl} />
                  <input type="hidden" name="category"   value="holiday" />
                  <button type="submit" className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors">
                    Force save as Event
                  </button>
                </form>
                <form action={saveAsCalendarDraftAction}>
                  <input type="hidden" name="slug"     value={draftFields.slug} />
                  <input type="hidden" name="en_title" value={draftFields.enTitle} />
                  <input type="hidden" name="en_body"  value={draftFields.enBody} />
                  <button type="submit" className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors">
                    Force save as Calendar
                  </button>
                </form>
              </div>
            </details>

            <button
              onClick={() => setPhase("input")}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-left pt-1"
            >
              ← Discard and start over
            </button>
          </div>

          {/* Refinement prompt — disabled */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-2 opacity-60">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Refine with AI</p>
            <textarea
              rows={3}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-300 bg-white cursor-not-allowed"
              placeholder='e.g. "Make it shorter, add Dubai SEO keywords, make RU more natural."'
            />
            <button
              disabled
              className="w-full text-sm font-medium bg-gray-200 text-gray-400 rounded-xl px-4 py-2.5 cursor-not-allowed"
            >
              Refine draft — AI not connected
            </button>
            <p className="text-xs text-gray-400">Available when AI runtime is connected (Phase 4B-2).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
