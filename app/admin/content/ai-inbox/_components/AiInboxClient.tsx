"use client";

import { useState, useTransition, useActionState } from "react";
import {
  classifyInputAction,
  generateDraftAction,
  refineDraftAction,
  saveGeneratedNewsDraftAction,
  saveGeneratedEventDraftAction,
  saveGeneratedCalendarDraftAction,
} from "../actions";
import { parseImportedDraft, buildImportPrompt } from "@/lib/ai/import-parser";
import type {
  AiInputType,
  AiRuntimeStatus,
  AiSaveActionState,
  ClassificationResult,
  GeneratedDraft,
  GeneratedNewsDraft,
  GeneratedEventDraft,
  GeneratedCalendarDraft,
} from "@/lib/ai/editor-types";

const INITIAL_SAVE_STATE: AiSaveActionState = { errors: [], warnings: [] };

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "input" | "classifying" | "classified" | "generating" | "draft" | "refining";
type ContentType3 = "news" | "event" | "calendar";
type DraftSource = "import" | "ai";

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
};

const RELIABILITY_LABELS: Record<string, string> = {
  "official":             "Official",
  "trusted_media":        "Trusted media",
  "public_social_signal": "Social signal",
  "internal_note":        "Internal note",
  "unknown":              "Unknown",
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function suggestedToContentType(s: string): ContentType3 {
  if (s === "event")    return "event";
  if (s === "calendar") return "calendar";
  return "news";
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AiInboxClient({
  saveError,
  runtimeStatus,
}: {
  saveError?: string;
  runtimeStatus: AiRuntimeStatus;
}) {
  const isConnected = runtimeStatus === "connected";

  // ── Phase + draft source ─────────────────────────────────────────────────
  const [phase,       setPhase]       = useState<Phase>("input");
  const [draftSource, setDraftSource] = useState<DraftSource>("import");

  // ── Import mode state ────────────────────────────────────────────────────
  const [importText,        setImportText]        = useState("");
  const [importError,       setImportError]       = useState<string | null>(null);
  const [importedDraft,     setImportedDraft]     = useState<(GeneratedDraft & { _forSave: true; ru_published: 0 }) | null>(null);
  const [importSaveable,    setImportSaveable]    = useState(true);
  const [importCoreErrors,  setImportCoreErrors]  = useState<string[]>([]);
  const [promptContentType, setPromptContentType] = useState<ContentType3>("news");
  const [promptCopied,      setPromptCopied]      = useState(false);

  // ── AI mode state ────────────────────────────────────────────────────────
  const [inputType,            setInputType]            = useState<AiInputType>("url");
  const [mainInput,            setMainInput]            = useState("");
  const [sourceUrl,            setSourceUrl]            = useState("");
  const [instruction,          setInstruction]          = useState("");
  const [aiClassification,    setAiClassification]    = useState<ClassificationResult | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType3>("news");
  const [aiDraft,             setAiDraft]             = useState<GeneratedDraft | null>(null);
  const [refinePrompt,        setRefinePrompt]        = useState("");
  const [changeSummary,       setChangeSummary]       = useState<string | null>(null);
  const [aiError,             setAiError]             = useState<string | null>(null);

  const [, startTransition] = useTransition();

  // ── Save action states ───────────────────────────────────────────────────
  const [newsSaveState,  newsSaveAction,  newsIsPending]  = useActionState(saveGeneratedNewsDraftAction,     INITIAL_SAVE_STATE);
  const [eventSaveState, eventSaveAction, eventIsPending] = useActionState(saveGeneratedEventDraftAction,    INITIAL_SAVE_STATE);
  const [calSaveState,   calSaveAction,   calIsPending]   = useActionState(saveGeneratedCalendarDraftAction, INITIAL_SAVE_STATE);

  // Safe helper: useActionState with redirect()-based server actions can leave
  // state as undefined when the action throws NEXT_REDIRECT instead of returning.
  const toErrorList = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter(Boolean).map(String) : [];

  const anySavePending = newsIsPending || eventIsPending || calIsPending;

  // ── Derived ──────────────────────────────────────────────────────────────
  const activeDraft: GeneratedDraft | null = draftSource === "ai" ? aiDraft : importedDraft;
  const draftJson = activeDraft ? JSON.stringify(activeDraft) : "";

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleParseImport() {
    setImportError(null);
    const result = parseImportedDraft(importText);
    if (!result.ok) {
      setImportError(result.error);
      return;
    }
    setImportedDraft(result.draft);
    setImportSaveable(result.saveable);
    setImportCoreErrors(result.coreErrors);
    setDraftSource("import");
    setPhase("draft");
  }

  async function handleCopyPrompt() {
    const prompt = buildImportPrompt(promptContentType);
    try {
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can select-all the textarea manually
    }
  }

  function handleAnalyzeWithAi() {
    if (!mainInput.trim()) return;
    setAiError(null);
    setDraftSource("ai");
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
      setDraftSource("ai");
      setChangeSummary(null);
      setPhase("draft");
    });
  }

  function handleRefineDraft() {
    if (!activeDraft || !refinePrompt.trim()) return;
    setAiError(null);
    setPhase("refining");
    startTransition(async () => {
      const res = await refineDraftAction({ currentDraft: activeDraft, ownerPrompt: refinePrompt });
      if (!res.ok) { setAiError(res.error); setPhase("draft"); return; }
      setAiDraft(res.draft);
      setDraftSource("ai");
      setChangeSummary(res.changeSummary);
      setRefinePrompt("");
      setPhase("draft");
    });
  }

  function reset() {
    setPhase("input");
    setDraftSource("import");
    setAiError(null);
    setAiClassification(null);
    setAiDraft(null);
    setImportedDraft(null);
    setImportSaveable(true);
    setImportCoreErrors([]);
    setImportText("");
    setImportError(null);
    setChangeSummary(null);
    setRefinePrompt("");
  }

  // ── Shared CSS ────────────────────────────────────────────────────────────

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 " +
    "placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

  // ── Runtime notice ────────────────────────────────────────────────────────

  const runtimeNotice = isConnected ? (
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800">
      <span className="font-semibold">AI runtime connected.</span>{" "}
      Paste a draft package directly, or use the AI analysis flow below.
    </div>
  ) : (
    <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-xs text-gray-600">
      <span className="font-semibold">Import mode active. No API required.</span>{" "}
      Use Claude Code or ChatGPT to generate a JSON draft, then paste it below.
    </div>
  );

  const errorBanner = aiError ? (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start justify-between gap-3">
      <span>{aiError}</span>
      <button onClick={() => setAiError(null)} className="text-red-400 hover:text-red-600 shrink-0 text-xs">Dismiss</button>
    </div>
  ) : null;

  // ── Render: spinner phases (AI only) ─────────────────────────────────────

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

  // ── Render: classified phase (AI only) ───────────────────────────────────

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

  // ── Render: draft + refining ──────────────────────────────────────────────

  if ((phase === "draft" || phase === "refining") && activeDraft) {
    const isRefining = phase === "refining";
    const draftType = activeDraft.contentType;
    const readiness = activeDraft.publish_readiness;
    const newsD  = draftType === "news"     ? (activeDraft as GeneratedNewsDraft)     : null;
    const eventD = draftType === "event"    ? (activeDraft as GeneratedEventDraft)    : null;
    const calD   = draftType === "calendar" ? (activeDraft as GeneratedCalendarDraft) : null;
    const confStyle: Record<string, string> = {
      "confirmed": "text-emerald-700 bg-emerald-50",
      "expected":  "text-amber-700 bg-amber-50",
      "subject_to_official_confirmation": "text-red-600 bg-red-50",
    };
    const allSaveErrors = [
      ...toErrorList(newsSaveState?.errors),
      ...toErrorList(eventSaveState?.errors),
      ...toErrorList(calSaveState?.errors),
    ];
    const draftLabel = draftSource === "import" ? "Imported Draft" : "AI Draft";
    // Disable save when an imported draft is missing required core fields.
    const saveDisabled = anySavePending || isRefining || (draftSource === "import" && !importSaveable);

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

        {draftSource === "import" && importCoreErrors.length > 0 && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 space-y-1.5">
            <p className="text-xs font-semibold text-red-700">Imported package is incomplete — fix in your AI tool before saving:</p>
            <ul className="space-y-0.5">
              {importCoreErrors.map((e, i) => (
                <li key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left: draft content */}
          <div className="space-y-4">

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium uppercase tracking-widest text-gray-400">{draftLabel}</span>
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2.5 py-0.5 capitalize">{draftType}</span>
                <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${READINESS_STYLES[readiness] ?? "text-gray-600 bg-gray-100 border-gray-200"}`}>
                  {READINESS_LABELS[readiness] ?? readiness}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Title</p>
                <p className="text-sm font-semibold text-gray-900">{activeDraft.en_title || <span className="text-red-500 italic">Empty</span>}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Slug</p>
                <p className="text-xs font-mono text-gray-600">{activeDraft.slug}</p>
              </div>
              {activeDraft.en_summary && (
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">EN Summary</p>
                  <p className="text-sm text-gray-600">{activeDraft.en_summary}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">EN Body</p>
              <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                {activeDraft.en_body.slice(0, 600)}{activeDraft.en_body.length > 600 ? "…" : ""}
              </p>
              {activeDraft.en_body.length > 600 && (
                <p className="text-[10px] text-gray-400">{activeDraft.en_body.length.toLocaleString()} chars total — full body saves to DB</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">SEO</p>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">SEO title ({activeDraft.en_seo_title.length}/60)</p>
                <p className="text-xs text-gray-700">{activeDraft.en_seo_title || <span className="text-gray-400 italic">Empty</span>}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Meta description ({activeDraft.en_meta_description.length}/160)</p>
                <p className="text-xs text-gray-700">{activeDraft.en_meta_description || <span className="text-gray-400 italic">Empty</span>}</p>
              </div>
            </div>

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

            {activeDraft.verification_notes?.trim() && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-amber-700">Verification required before publish</p>
                <p className="text-xs text-amber-800 leading-relaxed">{activeDraft.verification_notes}</p>
              </div>
            )}

            {activeDraft.missing_fields.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Missing before publish</p>
                <ul className="space-y-1">
                  {activeDraft.missing_fields.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="mt-0.5 w-3 h-3 rounded border border-gray-300 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Russian draft</p>
              {activeDraft.ru_title ? (
                <div className="space-y-2">
                  <div><p className="text-[10px] text-gray-400 mb-0.5">RU title</p><p className="text-sm font-semibold text-gray-700">{activeDraft.ru_title}</p></div>
                  {activeDraft.ru_summary && <div><p className="text-[10px] text-gray-400 mb-0.5">RU summary</p><p className="text-xs text-gray-600">{activeDraft.ru_summary}</p></div>}
                  <p className="text-[10px] text-gray-400">Full RU body saves to DB. ru_published stays off until you approve in the editor.</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No RU content in this draft.</p>
              )}
            </div>

            {(activeDraft.image_direction || activeDraft.tags.length > 0) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                {activeDraft.image_direction && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">Image direction</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{activeDraft.image_direction}</p>
                    {activeDraft.image_alt && <p className="text-[10px] text-gray-400 mt-1">Alt: {activeDraft.image_alt}</p>}
                  </div>
                )}
                {activeDraft.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDraft.tags.map((t) => <span key={t} className="text-xs font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: refine + save */}
          <div className="space-y-4">

            {/* AI classification summary (AI mode only) */}
            {draftSource === "ai" && aiClassification && (
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
                </div>
              </div>
            )}

            {/* Refine */}
            {isConnected ? (
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
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-2 opacity-60">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Refine with AI</p>
                <p className="text-xs text-gray-400">Connect AI runtime to refine. Edit manually in the Advanced Editor instead.</p>
                <button disabled className="w-full text-sm font-medium bg-gray-200 text-gray-400 rounded-xl px-4 py-2.5 cursor-not-allowed">Refine draft — AI not connected</button>
              </div>
            )}

            {/* Save */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Save draft</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Saves as status=draft. Complete remaining fields in the editor before publishing.
              </p>

              {draftType === "news" && (
                <form action={newsSaveAction}>
                  <input type="hidden" name="_draft_json" value={draftJson} />
                  <button type="submit" disabled={saveDisabled} className="w-full text-sm font-semibold bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left">
                    {newsIsPending ? "Saving…" : "Save as News draft →"}
                  </button>
                </form>
              )}
              {draftType === "event" && (
                <form action={eventSaveAction}>
                  <input type="hidden" name="_draft_json" value={draftJson} />
                  <button type="submit" disabled={saveDisabled} className="w-full text-sm font-semibold bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left">
                    {eventIsPending ? "Saving…" : "Save as Event draft →"}
                  </button>
                </form>
              )}
              {draftType === "calendar" && (
                <form action={calSaveAction}>
                  <input type="hidden" name="_draft_json" value={draftJson} />
                  <button type="submit" disabled={saveDisabled} className="w-full text-sm font-semibold bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left">
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
                      <button type="submit" disabled={saveDisabled} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors disabled:opacity-40">Force save as News</button>
                    </form>
                  )}
                  {draftType !== "event" && (
                    <form action={eventSaveAction}>
                      <input type="hidden" name="_draft_json" value={draftJson} />
                      <button type="submit" disabled={saveDisabled} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors disabled:opacity-40">Force save as Event</button>
                    </form>
                  )}
                  {draftType !== "calendar" && (
                    <form action={calSaveAction}>
                      <input type="hidden" name="_draft_json" value={draftJson} />
                      <button type="submit" disabled={saveDisabled} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-left transition-colors disabled:opacity-40">Force save as Calendar</button>
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

  // ── Render: input view ────────────────────────────────────────────────────

  const promptText = buildImportPrompt(promptContentType);

  return (
    <div className="space-y-4 max-w-2xl">
      {saveError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Save failed: {saveError}. Please try again or use the Advanced Editor.
        </div>
      )}
      {runtimeNotice}
      {errorBanner}

      {/* ── Import section (primary) ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Paste AI Draft Package</p>

        {/* Prompt builder (collapsible) */}
        <details className="border border-gray-100 rounded-xl overflow-hidden">
          <summary className="px-4 py-3 text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 transition-colors flex items-center justify-between">
            <span>Get prompt for Claude / ChatGPT</span>
            <span className="text-gray-400">▾</span>
          </summary>
          <div className="px-4 pb-4 pt-3 space-y-3 bg-gray-50">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Content type</label>
              <div className="flex gap-2">
                {(["news", "event", "calendar"] as ContentType3[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPromptContentType(t)}
                    className={`flex-1 text-xs font-medium rounded-lg px-3 py-1.5 border transition-colors ${
                      promptContentType === t
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              readOnly
              rows={8}
              value={promptText}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono text-gray-700 bg-white focus:outline-none resize-none leading-relaxed"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <button
              onClick={handleCopyPrompt}
              className={`text-xs font-medium px-4 py-2 rounded-lg border transition-colors ${
                promptCopied
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {promptCopied ? "Copied ✓" : "Copy prompt →"}
            </button>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Paste this prompt into Claude Code or ChatGPT, add your source material where indicated, then paste the JSON output below.
            </p>
          </div>
        </details>

        {/* Import textarea */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">
            AI Draft Package (JSON)
            <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">— paste the JSON from Claude or ChatGPT</span>
          </label>
          <textarea
            rows={10}
            value={importText}
            onChange={(e) => { setImportText(e.target.value); setImportError(null); }}
            className={inputCls}
            placeholder={'{\n  "contentType": "news",\n  "en_title": "...",\n  ...\n}'}
          />
          <p className="text-[10px] text-gray-400 mt-1">{importText.length.toLocaleString()} chars</p>
        </div>

        {importError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 leading-relaxed">
            <span className="font-semibold">Parse error: </span>{importError}
          </div>
        )}

        <button
          onClick={handleParseImport}
          disabled={!importText.trim()}
          className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Import draft →
        </button>
      </div>

      {/* ── AI section (connected mode only) ───────────────────────────────── */}
      {isConnected && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Analyze with AI</p>

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
                — paste URL, article, Telegram message, or notes
              </span>
            </label>
            <textarea
              rows={8}
              value={mainInput}
              onChange={(e) => setMainInput(e.target.value)}
              className={inputCls}
              placeholder={
                inputType === "url" ? "https://mohre.gov.ae/..." :
                inputType === "telegram-social" ? "Paste Telegram channel message here..." :
                "Paste the full article, announcement, or your notes here..."
              }
            />
            <p className="text-[10px] text-gray-400 mt-1">{mainInput.length.toLocaleString()} chars</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Source URL
              <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
            </label>
            <input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className={inputCls} placeholder="https://..." />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Owner instruction
              <span className="ml-1 font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className={inputCls}
              placeholder='e.g. "Focus on visa impact. Shorter body."'
            />
          </div>

          <button
            onClick={handleAnalyzeWithAi}
            disabled={!mainInput.trim()}
            className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Analyze with AI →
          </button>
        </div>
      )}
    </div>
  );
}
