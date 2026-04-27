"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ROUTE_FINDER_CONFIG,
  type CalcGuideData,
  type GuideResolution,
  type Resolution,
} from "@/lib/route-finder-config";
import { GROUP_HREFS } from "@/lib/guide-groups";

interface Props {
  guideDataMap: Record<string, CalcGuideData>;
  /** Q1 option value to pre-select. Skips Q1. */
  startFlow?: string;
}

interface AnswerRecord {
  questionId: string;
  value: string;
  contextKey?: string;
}

type Phase = "question" | "loading" | "result";

interface FlowState {
  currentId: string;
  answers: AnswerRecord[];
  context: Record<string, string>;
  phase: Phase;
}

function buildInitialState(startFlow: string | undefined): FlowState {
  if (!startFlow) {
    return { currentId: ROUTE_FINDER_CONFIG.startQuestion, answers: [], context: {}, phase: "question" };
  }
  const q1 = ROUTE_FINDER_CONFIG.questions[ROUTE_FINDER_CONFIG.startQuestion];
  const option = q1?.options.find((o) => o.value === startFlow);
  if (!option) {
    return { currentId: ROUTE_FINDER_CONFIG.startQuestion, answers: [], context: {}, phase: "question" };
  }
  return {
    currentId: option.next,
    answers: [{ questionId: ROUTE_FINDER_CONFIG.startQuestion, value: option.value, contextKey: option.contextKey }],
    context: option.contextKey ? { [option.contextKey]: option.value } : {},
    phase: "question",
  };
}

export default function RouteFinderFlow({ guideDataMap, startFlow }: Props) {
  const [state, setState] = useState<FlowState>(() => buildInitialState(startFlow));
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const whatsappHref = ROUTE_FINDER_CONFIG.whatsappHref;

  function handleOption(option: { value: string; next: string; contextKey?: string }) {
    const newContext = option.contextKey
      ? { ...state.context, [option.contextKey]: option.value }
      : state.context;
    const newAnswers = [
      ...state.answers,
      { questionId: state.currentId, value: option.value, contextKey: option.contextKey },
    ];
    const isNextQuestion = option.next in ROUTE_FINDER_CONFIG.questions;

    if (isNextQuestion) {
      setState({ currentId: option.next, answers: newAnswers, context: newContext, phase: "question" });
    } else {
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      setState({ currentId: option.next, answers: newAnswers, context: newContext, phase: "loading" });
      loadingTimer.current = setTimeout(() => {
        setState((s) => ({ ...s, phase: "result" }));
      }, 1100);
    }
  }

  function handleBack() {
    if (loadingTimer.current) { clearTimeout(loadingTimer.current); loadingTimer.current = null; }
    if (state.answers.length === 0) return;
    const prev = [...state.answers];
    const last = prev.pop()!;
    const newContext = { ...state.context };
    if (last.contextKey) delete newContext[last.contextKey];
    setState({ currentId: last.questionId, answers: prev, context: newContext, phase: "question" });
  }

  function handleReset() {
    if (loadingTimer.current) { clearTimeout(loadingTimer.current); loadingTimer.current = null; }
    setState({ currentId: ROUTE_FINDER_CONFIG.startQuestion, answers: [], context: {}, phase: "question" });
  }

  function resolveGuideSlug(resolution: GuideResolution): string | undefined {
    if (resolution.guideSlug) return resolution.guideSlug;
    if (resolution.contextSlugMap) {
      const val = state.context[resolution.contextSlugMap.contextKey];
      if (val) return resolution.contextSlugMap.slugs[val];
    }
    return undefined;
  }

  // ─── Loading interstitial ─────────────────────────────────────────────────

  if (state.phase === "loading") {
    return (
      <div className="px-6 py-14 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full border-[2.5px] border-stone-200 border-t-navy animate-spin mb-6" />
        <p className="text-[17px] font-semibold text-gray-900 mb-1.5">Finding your route…</p>
        <p className="text-[13px] text-gray-400 max-w-[200px] leading-relaxed">
          Matching your answers to the right route
        </p>
      </div>
    );
  }

  // ─── Question screen ──────────────────────────────────────────────────────

  if (state.phase === "question" && state.currentId in ROUTE_FINDER_CONFIG.questions) {
    const question = ROUTE_FINDER_CONFIG.questions[state.currentId];
    const hasAnswers = state.answers.length > 0;
    const stepNumber = startFlow ? state.answers.length : state.answers.length + 1;
    const filledSegments = Math.min(state.answers.length, 3);

    return (
      <div>
        {/* Progress bar + nav row */}
        <div className="px-5 pt-5">
          <div className="flex gap-1.5 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                  i < filledSegments ? "bg-navy" : "bg-stone-200"
                }`}
              />
            ))}
          </div>

          {hasAnswers && (
            <div className="flex items-center justify-between mb-1">
              <button
                type="button"
                onClick={handleBack}
                style={{ touchAction: "manipulation" }}
                className="text-[13px] text-gray-400 hover:text-gray-700 py-2 pr-3 -ml-0.5 flex items-center gap-1 select-none"
              >
                ← Back
              </button>
              <span className="text-[11px] font-medium text-gray-300 uppercase tracking-wide">
                Step {stepNumber}
              </span>
            </div>
          )}
        </div>

        {/* Question + options */}
        <div className="px-5 pb-6 pt-3">
          <h2 className="text-[21px] font-bold text-gray-900 leading-snug mb-6">
            {question.text}
          </h2>

          <div className="space-y-2.5">
            {question.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOption(option)}
                style={{ touchAction: "manipulation" }}
                className="w-full text-left px-4 py-4 rounded-xl border-2 border-stone-100 bg-white hover:border-stone-300 hover:bg-stone-50 active:bg-stone-100 flex items-center gap-3 select-none group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900 leading-snug pointer-events-none">
                    {option.label}
                  </p>
                  {option.sublabel && (
                    <p className="text-[12px] text-gray-400 mt-0.5 leading-snug pointer-events-none">
                      {option.sublabel}
                    </p>
                  )}
                </div>
                <div
                  className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center flex-shrink-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <span className="text-[12px] text-gray-400 pointer-events-none leading-none">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Result screens ───────────────────────────────────────────────────────

  const resolution: Resolution | undefined = ROUTE_FINDER_CONFIG.resolutions[state.currentId];

  if (!resolution) {
    return (
      <div className="p-6 text-center">
        <p className="text-[14px] text-gray-500">
          No result found.{" "}
          <button
            type="button"
            onClick={handleReset}
            className="text-brass underline"
            style={{ touchAction: "manipulation" }}
          >
            Start over
          </button>
        </p>
      </div>
    );
  }

  // Shared reset footer
  const resetFooter = (
    <div className="border-t border-stone-100">
      <button
        type="button"
        onClick={handleReset}
        style={{ touchAction: "manipulation" }}
        className="w-full text-center text-[12px] text-gray-300 hover:text-gray-500 py-3 select-none"
      >
        Start over
      </button>
    </div>
  );

  // ── Guide result ──────────────────────────────────────────────────────────

  if (resolution.type === "guide") {
    const slug = resolveGuideSlug(resolution);
    const guide = slug ? guideDataMap[slug] : undefined;

    return (
      <div>
        {/* Navy header */}
        <div className="bg-navy px-6 pt-5 pb-6">
          <button
            type="button"
            onClick={handleBack}
            style={{ touchAction: "manipulation" }}
            className="text-[12px] text-white/40 hover:text-white/70 mb-4 flex items-center gap-1 select-none -ml-0.5"
          >
            ← Back
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
            Your route
          </p>
          <h2 className="text-[18px] font-bold text-white leading-snug mb-1">
            {guide?.title ?? "Route found"}
          </h2>
          {guide?.summary && (
            <p className="text-[13px] text-white/60 leading-snug mt-1">{guide.summary}</p>
          )}
        </div>

        {/* Cost + timeline bar */}
        {guide && (
          <div className="grid grid-cols-2 border-b border-stone-100">
            <div className="px-5 py-4 border-r border-stone-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Est. cost
              </p>
              <p className="text-[17px] font-bold text-navy">{guide.price}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Timeline
              </p>
              <p className="text-[17px] font-bold text-navy">{guide.timeline}</p>
            </div>
          </div>
        )}

        {/* Main CTA — visible before key facts */}
        <div className="px-6 pt-5 pb-4">
          {slug ? (
            <Link
              href={GROUP_HREFS[slug] ?? `/guides/${slug}`}
              className="block w-full text-center bg-navy text-white text-[15px] font-bold py-3.5 rounded-xl"
            >
              View Step-by-Step Guide →
            </Link>
          ) : (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-navy text-white text-[15px] font-bold py-3.5 rounded-xl"
            >
              Contact Us →
            </a>
          )}
        </div>

        {/* Key facts — detail below the action */}
        {resolution.keyFacts.length > 0 && (
          <div className="px-6 pb-4 border-t border-stone-100 pt-4">
            <ul className="space-y-2">
              {resolution.keyFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-700 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass flex-shrink-0 mt-[5px]" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Secondary actions */}
        <div className="px-6 pb-6 space-y-0 border-t border-stone-100 pt-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[13px] text-gray-400 hover:text-gray-600 py-2"
          >
            Ask an expert on WhatsApp →
          </a>

          {resolution.supportingServices.length > 0 && (
            <div className="pt-3 border-t border-stone-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {resolution.supportingNote ?? "You may also need:"}
              </p>
              {resolution.supportingServices.map((serviceSlug) => {
                const service = guideDataMap[serviceSlug];
                if (!service) return null;
                return (
                  <Link
                    key={serviceSlug}
                    href={`/guides/${serviceSlug}`}
                    className="flex items-center gap-1.5 text-[13px] text-brass hover:opacity-70 py-1"
                  >
                    <span>→</span>
                    <span>{service.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {resetFooter}
      </div>
    );
  }

  // ── Hub result ────────────────────────────────────────────────────────────

  if (resolution.type === "hub") {
    return (
      <div>
        <div className="bg-navy px-6 pt-5 pb-6">
          <button
            type="button"
            onClick={handleBack}
            style={{ touchAction: "manipulation" }}
            className="text-[12px] text-white/40 hover:text-white/70 mb-4 flex items-center gap-1 select-none -ml-0.5"
          >
            ← Back
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
            Your next step
          </p>
          <h2 className="text-[18px] font-bold text-white leading-snug">
            {resolution.heading}
          </h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-[14px] text-gray-600 leading-relaxed">{resolution.body}</p>
        </div>

        <div className="px-6 pb-6 space-y-2">
          <Link
            href={resolution.hubUrl}
            className="block w-full text-center bg-navy text-white text-[15px] font-bold py-3.5 rounded-xl"
          >
            {resolution.ctaLabel ?? "See All Routes →"}
          </Link>
          {resolution.whatsapp && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[13px] text-gray-400 hover:text-gray-600 py-2"
            >
              Ask an expert on WhatsApp →
            </a>
          )}
        </div>

        {resetFooter}
      </div>
    );
  }

  // ── Advisor result ────────────────────────────────────────────────────────

  return (
    <div>
      <div className="bg-navy px-6 pt-5 pb-6">
        <button
          type="button"
          onClick={handleBack}
          style={{ touchAction: "manipulation" }}
          className="text-[12px] text-white/40 hover:text-white/70 mb-4 flex items-center gap-1 select-none -ml-0.5"
        >
          ← Back
        </button>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
          Next step
        </p>
        <h2 className="text-[18px] font-bold text-white leading-snug">
          {resolution.heading}
        </h2>
      </div>

      <div className="px-6 py-5">
        <p className="text-[14px] text-gray-600 leading-relaxed">{resolution.body}</p>
      </div>

      <div className="px-6 pb-6">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-navy text-white text-[15px] font-bold py-3.5 rounded-xl"
        >
          Message Us on WhatsApp →
        </a>
      </div>

      {resetFooter}
    </div>
  );
}
