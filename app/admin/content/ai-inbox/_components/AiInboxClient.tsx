"use client";

import { useState, useTransition, useActionState } from "react";
import {
  classifyInputAction,
  generateDraftAction,
  refineDraftAction,
  saveGeneratedNewsDraftAction,
  saveGeneratedEventDraftAction,
  saveGeneratedCalendarDraftAction,
  saveAsNewsDraftAction,
  saveAsEventDraftAction,
  saveAsCalendarDraftAction,
  INITIAL_SAVE_STATE,
} from "../actions";
import type {
  AiInputType,
  AiRuntimeStatus,
  ClassificationResult,
  GeneratedDraft,
  GeneratedNewsDraft,
  GeneratedEventDraft,
  GeneratedCalendarDraft,
} from "@/lib/ai/editor-types";

// ── Phase / content type ──────────────────────────────────────────────────────

type Phase = "input" | "classifying" | "classified" | "generating" | "draft" | "refining";
type ContentType3 = "news" | "event" | "calendar";

// ── Local classifier types (disabled mode only) ───────────────────────────────

type LConf = "high" | "medium" | "low";
type LRisk = "low" | "medium" | "high";
type LSourceRel = "official" | "trusted-media" | "social-signal" | "internal-note" | "unknown";
type LContentType = "news" | "event" | "calendar" | "guide-update" | "service" | "ignore";

interface LocalClassification {
  type: LContentType;
  typeConfidence: LConf;
  sourceReliability: LSourceRel;
  risk: LRisk;
  verificationRequired: boolean;
  why: string;
}

interface LocalDraftFields {
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

// ── Constants ─────────────────────────────────────────────────────────────────

const INPUT_TYPE_OPTIONS: { value: AiInputType; label: string }[] = [
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

// ── Type helpers ──────────────────────────────────────────────────────────────

function suggestedToContentType(s: string): ContentType3 {
  if (s === "event")    return "event";
  if (s === "calendar") return "calendar";
  return "news";
}

// ── Local deterministic classifier (disabled mode) ────────────────────────────

function localClassify(inputType: AiInputType, text: string, sourceUrl: string): LocalClassification {
  const lower = (text + " " + sourceUrl).toLowerCase();

  let type: LContentType = "news";
  let typeConfidence: LConf = "medium";
  let why = "";

  const calendarKw = ["calendar", "monthly calendar", "yearly calendar", "compliance calendar", "holiday calendar", "public holidays 20", "al adha", "al fitr"];
  const eventKw    = ["deadline", "public holiday", "eid", "national day", "exhibition", "expo", "festival", "apply by", "effective from", "cutoff", "event date", "last day to"];
  const newsKw     = ["mohre", "gdrfa", "ica", "fta", "ministry", "announces", "new rule", "new law", "regulation", "visa rule", "amendment", "circular", "policy update"];
  const guideKw    = ["how to", "step-by-step", "procedure", "process", "guide", "apply for", "requirements for"];

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
    type = "news"; typeConfidence = "medium"; why = "News-type keywords detected.";
  } else if (["internal-idea", "screenshot-notes"].includes(inputType)) {
    type = "news"; typeConfidence = "low"; why = "Internal note — type unclear, defaulting to News.";
  } else {
    type = "news"; typeConfidence = "low"; why = "No strong signal detected. Defaulting to News.";
  }

  const govDomains   = ["gov.ae", "u.ae", "mohre.gov", "gdrfa.gov", "ica.gov", "mof.gov", "fta.gov", "economy.gov", "tca.gov", "dm.gov", "rta.ae", "moccae.gov", "adm.gov", "dubailand.gov"];
  const mediaDomains = ["thenationalnews", "khaleejtimes", "gulfnews", "zawya", "arabianbusiness", "bloomberg", "reuters", "wam.ae"];
  let sourceReliability: LSourceRel = "unknown";
  const urlLower = sourceUrl.toLowerCase();

  if (govDomains.some((d) => urlLower.includes(d)))        sourceReliability = "official";
  else if (mediaDomains.some((d) => urlLower.includes(d))) sourceReliability = "trusted-media";
  else if (inputType === "telegram-social")                 sourceReliability = "social-signal";
  else if (["internal-idea", "screenshot-notes", "pdf-notes"].includes(inputType)) sourceReliability = "internal-note";

  const highRiskKw = ["penalty", "fine", "criminal", "jail", "deportation", "banned", "blacklist", "illegal", "tax evasion", "violat"];
  const lowRiskKw  = ["exhibition", "festival", "expo", "public holiday", "eid", "national day"];
  let risk: LRisk = "medium";
  if (highRiskKw.some((k) => lower.includes(k)) || sourceReliability === "social-signal") {
    risk = "high";
  } else if (lowRiskKw.some((k) => lower.includes(k)) && sourceReliability !== "unknown") {
    risk = "low";
  }

  return { type, typeConfidence, sourceReliability, risk, verificationRequired: risk === "high" || sourceReliability === "unknown" || sourceReliability === "social-signal", why };
}

function localSlugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}

function localPrepareDraft(_inputType: AiInputType, text: string, sourceUrl: string, c: LocalClassification): LocalDraftFields {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0]?.slice(0, 100) || "";

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
  const slug = localSlugify(rawTitle) || "ai-draft-" + Date.now().toString(36).slice(-6);

  const dateRx = /\b(\d{1,2}[\s\-\/]\w+[\s\-\/]\d{4}|\w+ \d{1,2},? \d{4}|\d{4}-\d{2}-\d{2})\b/g;
  const datesDetected = [...new Set(text.match(dateRx) || [])].slice(0, 5);

  const lower = text.toLowerCase();
  let category = c.type === "event" ? "holiday" : "visa";
  if (lower.includes("company") || lower.includes("business") || lower.includes("license") || lower.includes("freezone")) category = "company";
  else if (lower.includes("tax") || lower.includes("vat") || lower.includes(" fta ")) category = "tax";
  else if (lower.includes("tourism") || lower.includes("hotel") || lower.includes("attraction")) category = "tourism";
  else if (lower.includes("banking") || lower.includes(" bank ") || lower.includes("account")) category = "banking";

  const directions: Record<LContentType, string> = {
    "news":         "Clean editorial graphic: UAE official seal or government building. No stock photos of people. White / neutral background.",
    "event":        "Event milestone visual: UAE flag, official colours, or dated milestone graphic. Clean and minimal.",
    "calendar":     "Calendar grid visual with UAE branding, verified dates highlighted. Premium minimal design.",
    "guide-update": "Process-step illustration: clean icon set or flowchart on white background.",
    "service":      "Service card visual: clean branded graphic, no people.",
    "ignore":       "No image needed.",
  };

  const missing: string[] = [];
  if (!sourceUrl) missing.push("source_url — required for publish");
  if (c.type === "event" && datesDetected.length === 0) missing.push("event_date_start — no date detected in input");
  if (c.type === "calendar") missing.push("image_path — required before calendar page can publish");
  missing.push("SEO title — AI generation pending");
  missing.push("Meta description — AI generation pending");
  missing.push("RU translation — AI generation pending");
  if (c.verificationRequired) missing.push("Source verification — high-risk or unknown source requires human check");

  return { slug, enTitle: rawTitle, enSummary: lines[1]?.slice(0, 200) || "", enBody: text.slice(0, 1200), sourceUrl, category, imageDirection: directions[c.type], datesDetected, missingFields: missing };
}

// ── UI constants ──────────────────────────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  "low":    "text-emerald-700 bg-emerald-50",
  "medium": "text-amber-700 bg-amber-50",
  "high":   "text-red-700 bg-red-50",
};

const RELIABILITY_COLORS: Record<string, string> = {
  "official":             "text-emerald-700 bg-emerald-50",
  "trusted_media":        "text-blue-700 bg-blue-50",
  "public_social_signal": "text-amber-700 bg-amber-50",
  "internal_note":        "text-gray-600 bg-gray-100",
  "unknown":              "text-red-600 bg-red-50",
  "trusted-media":        "text-blue-700 bg-blue-50",
  "social-signal":        "text-amber-700 bg-amber-50",
  "internal-note":        "text-gray-600 bg-gray-100",
};

const RELIABILITY_LABELS: Record<string, string> = {
  "official":             "Official",
  "trusted_media":        "Trusted media",
  "public_social_signal": "Social signal",
  "internal_note":        "Internal note",
  "unknown":              "Unknown",
  "trusted-media":        "Trusted media",
  "social-signal":        "Social signal",
  "internal-note":        "Internal note",
};

const READINESS_STYLES: Record<string, string> = {
  "ready":        "text-emerald-700 bg-emerald-50 border-emerald-200",
  "needs_review": "text-amber-700 bg-amber-50 border-amber-200",
  "incomplete":   "text-red-700 bg-red-50 border-red-200",
};

const READINESS_LABELS: Record<string, string> = {
  "ready":        "Ready to review",
  "needs_review": "Needs review",
  "incomplete":   "Incomplete",
};

const AI_TYPE_LABELS: Record<string, string> = {
  "news": "News", "event": "Event", "calendar": "Calendar post",
  "guide_update": "Guide update", "service": "Service", "area_update": "Area update", "ignore": "Ignore",
};

const CONFIDENCE_DOTS: Record<string, string> = {
  "high": "●●●", "medium": "●●○", "low": "●○○",
};

const LOCAL_CONTENT_TYPE_LABELS: Record<string, string> = {
  "news": "News", "event": "Event", "calendar": "Calendar Visual Post",
  "guide-update": "Guide update", "service": "Service page", "ignore": "Ignore",
};

// ── Main component ────────────────────────────────────────────────────────────

export default function AiInboxClient({
  saveError,
  runtimeStatus,
}: {
  saveError?: string;
  runtimeStatus: AiRuntimeStatus;
}) {
  const isConnected = runtimeStatus === "connected";

  // Input state
  const [inputType,    setInputType]   = useState<AiInputType>("url");
  const [mainInput,    setMainInput]   = useState("");
  const [sourceUrl,    setSourceUrl]   = useState("");
  const [instruction,  setInstruction] = useState("");

  // Phase
  const [phase,    setPhase]   = useState<Phase>("input");
  const [aiError,  setAiError] = useState<string | null>(null);

  // AI mode state
  const [aiClassification,    setAiClassification]    = useState<ClassificationResult | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType3>("news");
  const [aiDraft,             setAiDraft]             = useState<GeneratedDraft | null>(null);
  const [refinePrompt,        setRefinePrompt]        = useState("");
  const [changeSummary,       setChangeSummary]       = useState<string | null>(null);

  // Local mode state (disabled mode)
  const [localClass, setLocalClass] = useState<LocalClassification | null>(null);
  const [localDraft, setLocalDraft] = useState<LocalDraftFields | null>(null);

  // Transition for AI calls
  const [, startTransition] = useTransition();

  // Save action states (AI path)
  const [newsSaveState,  newsSaveAction,  newsIsPending]  = useActionState(saveGeneratedNewsDraftAction,     INITIAL_SAVE_STATE);
  const [eventSaveState, eventSaveAction, eventIsPending] = useActionState(saveGeneratedEventDraftAction,    INITIAL_SAVE_STATE);
  const [calSaveState,   calSaveAction,   calIsPending]   = useActionState(saveGeneratedCalendarDraftAction, INITIAL_SAVE_STATE);

  const anySavePending = newsIsPending || eventIsPending || calIsPending;

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleAnalyzeWithAi() {
    if (!mainInput.trim()) return;
    setAiError(null);
    setPhase("classifying");
    startTransition(async () => {
      const res = await classifyInputAction({ inputType, mainInput, sourceUrl, ownerInstruction: instruction });
      if (!res.ok) { setAiError(res.error); setPhase("input"); return; }
      setAiClassification(res.result);
      setSelectedContentType(suggestedToContentType(res.result.suggestedType));
      setPhase("classified");
    });
  }

  function handleGenerateDraft() {
    if (!aiClassification) return;
    setAiError(null);
    setPhase("generating");
    startTransition(async () => {
      const res = await generateDraftAction({
        inputType, mainInput, sourceUrl, ownerInstruction: instruction,
        contentType: selectedContentType,
        sourceReliability: aiClassification.sourceReliability,
        riskLevel: aiClassification.riskLevel,
        detectedDates: aiClassification.detectedDates,
      });
      if (!res.ok) { setAiError(res.error); setPhase("classified"); return; }
      setAiDraft(res.draft);
      setChangeSummary(null);
      setPhase("draft");
    });
  }

  function handleRefineDraft() {
    if (!aiDraft || !refinePrompt.trim()) return;
    setAiError(null);
    setPhase("refining");
    startTransition(async () => {
      const res = await refineDraftAction({ currentDraft: aiDraft, ownerPrompt: refinePrompt });
      if (!res.ok) { setAiError(res.error); setPhase("draft"); return; }
      setAiDraft(res.draft);
      setChangeSummary(res.changeSummary);
      setRefinePrompt("");
      setPhase("draft");
    });
  }

  function handleLocalClassify() {
    if (!mainInput.trim()) return;
    const c = localClassify(inputType, mainInput, sourceUrl);
    const d = localPrepareDraft(inputType, mainInput, sourceUrl, c);
    setLocalClass(c);
    setLocalDraft(d);
    setPhase("draft");
  }

  function reset() {
    setPhase("input");
    setAiError(null);
    setAiClassification(null);
    setAiDraft(null);
    setLocalClass(null);
    setLocalDraft(null);
    setChangeSummary(null);
    setRefinePrompt("");
  }

  // ── Shared CSS ───────────────────────────────────────────────────────────────

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
    "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

  const draftJson = aiDraft ? JSON.stringify(aiDraft) : "";

  // ── Sub-elements ─────────────────────────────────────────────────────────────

  const runtimeNotice = isConnected ? (
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800">
      <span className="font-semibold">AI runtime connected.</span>{" "}
      Classify with AI, then generate a full bilingual draft — titles, SEO, RU translation, all fields.
    </div>
  ) : (
    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
      <span className="font-semibold">
        {runtimeStatus === "missing_key" ? "AI runtime not configured." : "AI runtime not connected."}
      </span>{" "}
      {runtimeStatus === "missing_key"
        ? "Set ANTHROPIC_API_KEY and AI_EDITOR_ENABLED=true in .env.local to enable AI generation."
        : "Set AI_EDITOR_ENABLED=true to enable real AI generation."}{" "}
      Using deterministic local classifier as preview.
    </div>
  );

  const errorBanner = aiError ? (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start justify-between gap-3">
      <span>{aiError}</span>
      <button onClick={() => setAiError(null)} className="text-red-400 hover:text-red-600 shrink-0 text-xs">Dismiss</button>
    </div>
  ) : null;

  const inputForm = (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Input</p>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Input type</label>
        <select value={inputType} onChange={(e) => setInputType(e.target.value as AiInputType)} className={inputCls}>
          {INPUT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5">
          Main input
          <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">
            — paste URL, article, Telegram message, PDF notes, or idea
          </span>
        </label>
        <textarea
          rows={10}
          value={mainInput}
          onChange={(e) => setMainInput(e.target.value)}
          className={inputCls}
          placeholder={
            inputType === "url" ? "https://mohre.gov.ae/..." :
            inputType === "telegram-social" ? "Paste Telegram channel message here..." :
            inputType === "event-listing" ? "Event name, date, location, organiser..." :
            "Paste the full article, announcement, or your notes here..."
          }
        />
        <p className="text-[10px] text-gray-400 mt-1">{mainInput.length.toLocaleString()} chars</p>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5">
          Source URL
          <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">(optional — improves source reliability detection)</span>
        </label>
        <input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className={inputCls} placeholder="https://..." />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5">
          Owner instruction
          <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">(optional — guide AI focus)</span>
        </label>
        <textarea
          rows={2}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className={inputCls}
          placeholder='e.g. "Focus on visa impact. Shorter body. Prepare RU version too."'
        />
      </div>

      {isConnected ? (
        <button
          onClick={handleAnalyzeWithAi}
          disabled={!mainInput.trim()}
          className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Analyze with AI →
        </button>
      ) : (
        <button
          onClick={handleLocalClassify}
          disabled={!mainInput.trim()}
          className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Classify locally →
        </button>
      )}
    </div>
  );

  // ── Render: input phase ──────────────────────────────────────────────────────

  if (phase === "input") {
    return (
      <div className="space-y-4 max-w-2xl">
        {saveError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            Save failed: {saveError}. Please try again or use the Advanced Editor.
          </div>
        )}
        {runtimeNotice}
        {errorBanner}
        {inputForm}
      </div>
    );
  }

  // ── Render: spinner phases ───────────────────────────────────────────────────

  if (phase === "classifying" || phase === "generating") {
    const msg = phase === "classifying" ? "Analyzing input with AI..." : "Generating full draft...";
    return (
      <div className="space-y-4 max-w-2xl">
        {runtimeNotice}
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">{msg}</p>
          <p className="text-xs text-gray-400">Usually 5–20 seconds.</p>
        </div>
      </div>
    );
  }

  // ── Render: classified phase (AI mode) ───────────────────────────────────────

  if (phase === "classified" && aiClassification) {
    const isNonGeneratable = ["guide_update", "service", "area_update", "ignore"].includes(aiClassification.suggestedType);

    return (
      <div className="space-y-4 max-w-2xl">
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to input</button>
        {runtimeNotice}
        {errorBanner}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">AI Classification</p>
            <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${
              aiClassification.confidence === "high"   ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
              aiClassification.confidence === "medium" ? "text-amber-700 bg-amber-50 border-amber-200" :
                                                         "text-gray-600 bg-gray-100 border-gray-200"
            }`}>
              {CONFIDENCE_DOTS[aiClassification.confidence]} {aiClassification.confidence} confidence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400 mb-0.5">Suggested type</p>
              <p className="text-gray-800 font-semibold">{AI_TYPE_LABELS[aiClassification.suggestedType] ?? aiClassification.suggestedType}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Source reliability</p>
              <span className={`inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 ${RELIABILITY_COLORS[aiClassification.sourceReliability] ?? "text-gray-600 bg-gray-100"}`}>
                {RELIABILITY_LABELS[aiClassification.sourceReliability] ?? aiClassification.sourceReliability}
              </span>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Risk level</p>
              <span className={`inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 ${RISK_COLORS[aiClassification.riskLevel] ?? "text-gray-600 bg-gray-100"}`}>
                {aiClassification.riskLevel.charAt(0).toUpperCase() + aiClassification.riskLevel.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Verification</p>
              <span className={`text-xs font-semibold ${aiClassification.verificationRequired ? "text-red-600" : "text-emerald-600"}`}>
                {aiClassification.verificationRequired ? "Required" : "Not required"}
              </span>
            </div>
          </div>

          {aiClassification.reason && (
            <p className="text-xs text-gray-500 border-t border-gray-100 pt-3 leading-relaxed">{aiClassification.reason}</p>
          )}
          {aiClassification.sourceNotes && (
            <p className="text-xs text-gray-400 leading-relaxed">{aiClassification.sourceNotes}</p>
          )}
          {aiClassification.detectedDates.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-400">Detected dates:</span>
              {aiClassification.detectedDates.map((d) => (
                <span key={d} className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">{d}</span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Generate draft as</p>

          {isNonGeneratable && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              AI suggested &ldquo;{AI_TYPE_LABELS[aiClassification.suggestedType]}&rdquo; — not directly saveable. Select the best fit below.
            </div>
          )}
          {aiClassification.suggestedType === "ignore" && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              AI recommends ignoring this input (duplicate, off-topic, or no UAE relevance). You can still generate a draft if you disagree.
            </div>
          )}

          <div className="flex gap-2">
            {(["news", "event", "calendar"] as ContentType3[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedContentType(t)}
                className={`flex-1 text-xs font-medium rounded-xl px-3 py-2.5 border transition-colors ${
                  selectedContentType === t
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateDraft}
            className="w-full text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Generate {selectedContentType} draft →
          </button>
        </div>
      </div>
    );
  }

  // ── Render: draft + refining phases ─────────────────────────────────────────

  const isRefining = phase === "refining";

  if ((phase === "draft" || phase === "refining") && (aiDraft || localDraft)) {

    // ── AI draft view (connected mode) ───────────────────────────────────────

    if (isConnected && aiDraft) {
      const draftType = aiDraft.contentType;
      const readiness = aiDraft.publish_readiness;
      const newsD = draftType === "news"     ? (aiDraft as GeneratedNewsDraft)     : null;
      const eventD = draftType === "event"   ? (aiDraft as GeneratedEventDraft)    : null;
      const calD   = draftType === "calendar"? (aiDraft as GeneratedCalendarDraft) : null;
      const confStyle: Record<string, string> = {
        "confirmed": "text-emerald-700 bg-emerald-50",
        "expected":  "text-amber-700 bg-amber-50",
        "subject_to_official_confirmation": "text-red-600 bg-red-50",
      };
      const allSaveErrors = [...newsSaveState.errors, ...eventSaveState.errors, ...calSaveState.errors];

      return (
        <div className="space-y-4">
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to input</button>
          {runtimeNotice}
          {errorBanner}

          {isRefining && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <p className="text-xs text-blue-700">Refining draft...</p>
            </div>
          )}
          {changeSummary && !isRefining && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 text-xs text-blue-700">
              <span className="font-semibold">Refined: </span>{changeSummary}
            </div>
          )}
          {allSaveErrors.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Save failed: {allSaveErrors.join("; ")}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">

            {/* Left: draft content */}
            <div className="space-y-4">

              {/* Header */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium uppercase tracking-widest text-gray-400">AI Draft</span>
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2.5 py-0.5 capitalize">{draftType}</span>
                  <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${READINESS_STYLES[readiness] ?? "text-gray-600 bg-gray-100 border-gray-200"}`}>
                    {READINESS_LABELS[readiness] ?? readiness}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Title</p>
                  <p className="text-sm font-semibold text-gray-900">{aiDraft.en_title || <span className="text-red-500 italic">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Slug</p>
                  <p className="text-xs font-mono text-gray-600">{aiDraft.slug}</p>
                </div>
                {aiDraft.en_summary && (
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Summary</p>
                    <p className="text-sm text-gray-600">{aiDraft.en_summary}</p>
                  </div>
                )}
              </div>

              {/* EN Body */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">EN Body</p>
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                  {aiDraft.en_body.slice(0, 600)}{aiDraft.en_body.length > 600 ? "…" : ""}
                </p>
                {aiDraft.en_body.length > 600 && (
                  <p className="text-[10px] text-gray-400">{aiDraft.en_body.length.toLocaleString()} chars total — full body saves to DB</p>
                )}
              </div>

              {/* SEO */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">SEO</p>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">SEO title ({aiDraft.en_seo_title.length}/60)</p>
                  <p className="text-xs text-gray-700">{aiDraft.en_seo_title || <span className="text-gray-400 italic">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Meta description ({aiDraft.en_meta_description.length}/160)</p>
                  <p className="text-xs text-gray-700">{aiDraft.en_meta_description || <span className="text-gray-400 italic">Empty</span>}</p>
                </div>
              </div>

              {/* News metadata */}
              {newsD && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">News metadata</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-gray-400 mb-0.5">Category</p><p className="text-gray-700 font-medium">{newsD.category}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Source label</p><p className="text-gray-700">{newsD.source_label}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Date published</p><p className="text-gray-700 font-mono">{newsD.date_published || "—"}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Date updated</p><p className="text-gray-700 font-mono">{newsD.date_updated || "—"}</p></div>
                  </div>
                </div>
              )}

              {/* Event metadata */}
              {eventD && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Event metadata</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-gray-400 mb-0.5">Category</p><p className="text-gray-700 font-medium">{eventD.category}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Color type</p><p className="text-gray-700">{eventD.color_type}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Start date</p><p className="text-gray-700 font-mono">{eventD.event_date_start || "—"}</p></div>
                    <div><p className="text-gray-400 mb-0.5">End date</p><p className="text-gray-700 font-mono">{eventD.event_date_end || "—"}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Date confidence</p><p className="text-gray-700">{eventD.date_confidence}</p></div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Schema eligible</p>
                      <p className={eventD.schema_eligible ? "text-emerald-600 font-semibold" : "text-gray-500"}>{eventD.schema_eligible ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar metadata */}
              {calD && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Calendar metadata</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-gray-400 mb-0.5">Calendar type</p><p className="text-gray-700 font-medium">{calD.calendar_type}</p></div>
                    <div><p className="text-gray-400 mb-0.5">Year / Month</p><p className="text-gray-700">{calD.year}{calD.month != null ? ` / ${calD.month}` : " (yearly)"}</p></div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Islamic dates</p>
                      <p className={calD.has_islamic_dates ? "text-amber-600" : "text-gray-500"}>{calD.has_islamic_dates ? "Yes — moon sighting applies" : "No"}</p>
                    </div>
                    <div><p className="text-gray-400 mb-0.5">Dates in list</p><p className="text-gray-700 font-semibold">{calD.dates_json.length}</p></div>
                  </div>
                  {calD.en_notes && (
                    <div><p className="text-[10px] text-gray-400 mb-0.5">EN Notes</p><p className="text-xs text-gray-600">{calD.en_notes}</p></div>
                  )}
                  {calD.dates_json.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">First 3 dates</p>
                      <div className="space-y-1">
                        {calD.dates_json.slice(0, 3).map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="font-mono text-gray-600">{d.date}</span>
                            <span className="text-gray-500">{d.label_en}</span>
                            <span className={`text-[10px] rounded px-1.5 py-0.5 ${confStyle[d.confidence] ?? "text-gray-600 bg-gray-100"}`}>{d.confidence}</span>
                          </div>
                        ))}
                        {calD.dates_json.length > 3 && <p className="text-[10px] text-gray-400">+{calD.dates_json.length - 3} more</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Verification notes */}
              {aiDraft.verification_notes?.trim() && (
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-amber-700">Verification required before publish</p>
                  <p className="text-xs text-amber-800 leading-relaxed">{aiDraft.verification_notes}</p>
                </div>
              )}

              {/* Missing fields */}
              {aiDraft.missing_fields.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Missing before publish</p>
                  <ul className="space-y-1">
                    {aiDraft.missing_fields.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="mt-0.5 w-3 h-3 rounded border border-gray-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* RU draft */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Russian draft</p>
                {aiDraft.ru_title ? (
                  <div className="space-y-2">
                    <div><p className="text-[10px] text-gray-400 mb-0.5">RU title</p><p className="text-sm font-semibold text-gray-700">{aiDraft.ru_title}</p></div>
                    {aiDraft.ru_summary && <div><p className="text-[10px] text-gray-400 mb-0.5">RU summary</p><p className="text-xs text-gray-600">{aiDraft.ru_summary}</p></div>}
                    <p className="text-[10px] text-gray-400">Full RU body saves to DB. ru_published stays off until you approve in the editor.</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No RU content generated.</p>
                )}
              </div>

              {/* Image + Tags */}
              {(aiDraft.image_direction || aiDraft.tags.length > 0) && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                  {aiDraft.image_direction && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">Image direction</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{aiDraft.image_direction}</p>
                      {aiDraft.image_alt && <p className="text-[10px] text-gray-400 mt-1">Alt: {aiDraft.image_alt}</p>}
                    </div>
                  )}
                  {aiDraft.tags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {aiDraft.tags.map((t) => <span key={t} className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">{t}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: classification + refine + save */}
            <div className="space-y-4">

              {/* Classification summary */}
              {aiClassification && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Source analysis</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Source</span>
                      <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${RELIABILITY_COLORS[aiClassification.sourceReliability] ?? "text-gray-600 bg-gray-100"}`}>
                        {RELIABILITY_LABELS[aiClassification.sourceReliability] ?? aiClassification.sourceReliability}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Risk</span>
                      <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${RISK_COLORS[aiClassification.riskLevel] ?? "text-gray-600 bg-gray-100"}`}>
                        {aiClassification.riskLevel.charAt(0).toUpperCase() + aiClassification.riskLevel.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Verification</span>
                      <span className={`text-xs font-semibold ${aiClassification.verificationRequired ? "text-red-600" : "text-emerald-600"}`}>
                        {aiClassification.verificationRequired ? "Required" : "Not required"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Refine */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Refine with AI</p>
                <textarea
                  rows={3}
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  disabled={isRefining}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder='e.g. "Shorter body. Focus on employer obligations. Improve RU title."'
                />
                <button
                  onClick={handleRefineDraft}
                  disabled={isRefining || !refinePrompt.trim()}
                  className="w-full text-sm font-medium bg-gray-900 text-white rounded-xl px-4 py-2.5 transition-colors hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isRefining ? "Refining…" : "Refine draft →"}
                </button>
              </div>

              {/* Save */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Save draft</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Saves as status=draft. Complete remaining fields in the editor before publishing.
                </p>

                {draftType === "news" && (
                  <form action={newsSaveAction}>
                    <input type="hidden" name="_draft_json" value={draftJson} />
                    <button type="submit" disabled={anySavePending || isRefining} className="w-full text-sm font-semibold bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left">
                      {newsIsPending ? "Saving…" : "Save as News draft →"}
                    </button>
                  </form>
                )}
                {draftType === "event" && (
                  <form action={eventSaveAction}>
                    <input type="hidden" name="_draft_json" value={draftJson} />
                    <button type="submit" disabled={anySavePending || isRefining} className="w-full text-sm font-semibold bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left">
                      {eventIsPending ? "Saving…" : "Save as Event draft →"}
                    </button>
                  </form>
                )}
                {draftType === "calendar" && (
                  <form action={calSaveAction}>
                    <input type="hidden" name="_draft_json" value={draftJson} />
                    <button type="submit" disabled={anySavePending || isRefining} className="w-full text-sm font-semibold bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left">
                      {calIsPending ? "Saving…" : "Save as Calendar draft →"}
                    </button>
                  </form>
                )}

                <details className="mt-1">
                  <summary className="text-[10px] text-gray-400 cursor-pointer select-none hover:text-gray-600">
                    Save as different type (override)
                  </summary>
                  <div className="mt-2 space-y-2">
                    {draftType !== "news" && (
                      <form action={newsSaveAction}>
                        <input type="hidden" name="_draft_json" value={draftJson} />
                        <button type="submit" disabled={anySavePending} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors disabled:opacity-40">Force save as News</button>
                      </form>
                    )}
                    {draftType !== "event" && (
                      <form action={eventSaveAction}>
                        <input type="hidden" name="_draft_json" value={draftJson} />
                        <button type="submit" disabled={anySavePending} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors disabled:opacity-40">Force save as Event</button>
                      </form>
                    )}
                    {draftType !== "calendar" && (
                      <form action={calSaveAction}>
                        <input type="hidden" name="_draft_json" value={draftJson} />
                        <button type="submit" disabled={anySavePending} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors disabled:opacity-40">Force save as Calendar</button>
                      </form>
                    )}
                  </div>
                </details>

                <button onClick={reset} className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-left pt-1">
                  ← Discard and start over
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── Local draft view (disabled mode) ────────────────────────────────────────

    if (!isConnected && localDraft && localClass) {
      const canSaveAsNews     = localClass.type === "news"     || localClass.type === "guide-update";
      const canSaveAsEvent    = localClass.type === "event";
      const canSaveAsCalendar = localClass.type === "calendar";

      const lRelColors: Record<string, string> = {
        "official": "text-emerald-700 bg-emerald-50", "trusted-media": "text-blue-700 bg-blue-50",
        "social-signal": "text-amber-700 bg-amber-50", "internal-note": "text-gray-600 bg-gray-100", "unknown": "text-red-600 bg-red-50",
      };
      const lRiskColors: Record<string, string> = {
        "low": "text-emerald-700 bg-emerald-50", "medium": "text-amber-700 bg-amber-50", "high": "text-red-700 bg-red-50",
      };
      const lRelLabels: Record<string, string> = {
        "official": "Official", "trusted-media": "Trusted media", "social-signal": "Social signal",
        "internal-note": "Internal note", "unknown": "Unknown",
      };

      return (
        <div className="space-y-4">
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to input</button>
          {runtimeNotice}

          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
            <span className="font-semibold">Local preview only.</span>{" "}
            Draft fields are deterministic placeholders. Save now for a minimal draft, then complete in the Advanced Editor.
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-gray-400">Draft Preview</span>
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2.5 py-0.5">
                    {LOCAL_CONTENT_TYPE_LABELS[localClass.type]}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Title</p>
                  <p className="text-sm font-semibold text-gray-900">{localDraft.enTitle}</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">AI generation pending — connect AI runtime for real titles</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Slug</p>
                  <p className="text-xs font-mono text-gray-600">{localDraft.slug}</p>
                </div>
                {localDraft.enSummary && (
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Summary (from input)</p>
                    <p className="text-sm text-gray-600">{localDraft.enSummary}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Body excerpt</p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {localDraft.enBody.slice(0, 300)}{localDraft.enBody.length > 300 ? "…" : ""}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Detected metadata</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-gray-400 mb-0.5">Category</p><p className="text-gray-700 font-medium capitalize">{localDraft.category}</p></div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Source URL</p>
                    {localDraft.sourceUrl ? <p className="text-gray-700 font-mono truncate">{localDraft.sourceUrl}</p> : <p className="text-red-500">Not provided</p>}
                  </div>
                  <div><p className="text-gray-400 mb-0.5">SEO title</p><p className="text-amber-600">AI generation pending</p></div>
                  <div><p className="text-gray-400 mb-0.5">Meta description</p><p className="text-amber-600">AI generation pending</p></div>
                </div>
                {localDraft.datesDetected.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Dates detected</p>
                    <div className="flex flex-wrap gap-1.5">
                      {localDraft.datesDetected.map((d) => <span key={d} className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">{d}</span>)}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Image direction</p>
                <p className="text-sm text-gray-600 leading-relaxed">{localDraft.imageDirection}</p>
              </div>

              {localDraft.missingFields.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Missing before publish</p>
                  <ul className="space-y-1">
                    {localDraft.missingFields.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="mt-0.5 w-3 h-3 rounded border border-gray-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Classification</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Type</span>
                    <span className="text-xs font-semibold text-gray-800">{LOCAL_CONTENT_TYPE_LABELS[localClass.type]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence</span>
                    <span className="text-xs font-mono text-gray-600">{CONFIDENCE_DOTS[localClass.typeConfidence]} {localClass.typeConfidence}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Source</span>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${lRelColors[localClass.sourceReliability]}`}>
                      {lRelLabels[localClass.sourceReliability]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Risk</span>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${lRiskColors[localClass.risk]}`}>
                      {localClass.risk.charAt(0).toUpperCase() + localClass.risk.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Verification</span>
                    <span className={`text-[10px] font-semibold ${localClass.verificationRequired ? "text-red-600" : "text-emerald-600"}`}>
                      {localClass.verificationRequired ? "Required" : "Not required"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-2 leading-relaxed">{localClass.why}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Save draft</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Saves a minimal draft. Complete all fields in the Advanced Editor before publishing.
                </p>

                <form action={saveAsNewsDraftAction}>
                  <input type="hidden" name="slug"       value={localDraft.slug} />
                  <input type="hidden" name="en_title"   value={localDraft.enTitle} />
                  <input type="hidden" name="en_body"    value={localDraft.enBody} />
                  <input type="hidden" name="source_url" value={localDraft.sourceUrl} />
                  <input type="hidden" name="category"   value={localDraft.category} />
                  <button type="submit" disabled={!canSaveAsNews} className={`w-full text-sm font-medium rounded-xl px-4 py-2.5 transition-colors text-left ${canSaveAsNews ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                    Save as News draft →
                  </button>
                </form>

                <form action={saveAsEventDraftAction}>
                  <input type="hidden" name="slug"       value={localDraft.slug} />
                  <input type="hidden" name="en_title"   value={localDraft.enTitle} />
                  <input type="hidden" name="en_body"    value={localDraft.enBody} />
                  <input type="hidden" name="source_url" value={localDraft.sourceUrl} />
                  <input type="hidden" name="category"   value={localDraft.category === "holiday" ? "holiday" : "government"} />
                  <button type="submit" disabled={!canSaveAsEvent} className={`w-full text-sm font-medium rounded-xl px-4 py-2.5 transition-colors text-left ${canSaveAsEvent ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                    Save as Event draft →
                  </button>
                </form>

                <form action={saveAsCalendarDraftAction}>
                  <input type="hidden" name="slug"     value={localDraft.slug} />
                  <input type="hidden" name="en_title" value={localDraft.enTitle} />
                  <input type="hidden" name="en_body"  value={localDraft.enBody} />
                  <button type="submit" disabled={!canSaveAsCalendar} className={`w-full text-sm font-medium rounded-xl px-4 py-2.5 transition-colors text-left ${canSaveAsCalendar ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                    Save as Calendar Visual Post →
                  </button>
                </form>

                <details className="mt-1">
                  <summary className="text-[10px] text-gray-400 cursor-pointer select-none hover:text-gray-600">Override and save as different type</summary>
                  <div className="mt-2 space-y-2">
                    <form action={saveAsNewsDraftAction}>
                      <input type="hidden" name="slug" value={localDraft.slug} />
                      <input type="hidden" name="en_title" value={localDraft.enTitle} />
                      <input type="hidden" name="en_body" value={localDraft.enBody} />
                      <input type="hidden" name="source_url" value={localDraft.sourceUrl} />
                      <input type="hidden" name="category" value={localDraft.category} />
                      <button type="submit" className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors">Force save as News</button>
                    </form>
                    <form action={saveAsEventDraftAction}>
                      <input type="hidden" name="slug" value={localDraft.slug} />
                      <input type="hidden" name="en_title" value={localDraft.enTitle} />
                      <input type="hidden" name="en_body" value={localDraft.enBody} />
                      <input type="hidden" name="source_url" value={localDraft.sourceUrl} />
                      <input type="hidden" name="category" value="holiday" />
                      <button type="submit" className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors">Force save as Event</button>
                    </form>
                    <form action={saveAsCalendarDraftAction}>
                      <input type="hidden" name="slug" value={localDraft.slug} />
                      <input type="hidden" name="en_title" value={localDraft.enTitle} />
                      <input type="hidden" name="en_body" value={localDraft.enBody} />
                      <button type="submit" className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors">Force save as Calendar</button>
                    </form>
                  </div>
                </details>

                <button onClick={reset} className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-left pt-1">← Discard and start over</button>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-2 opacity-60">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Refine with AI</p>
                <textarea rows={3} disabled className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-300 bg-white cursor-not-allowed" placeholder="Available when AI runtime is connected." />
                <button disabled className="w-full text-sm font-medium bg-gray-200 text-gray-400 rounded-xl px-4 py-2.5 cursor-not-allowed">Refine draft — AI not connected</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}
