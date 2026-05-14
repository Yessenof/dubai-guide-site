// Server-side only. Never import from client components.
// Protected by being imported only from "use server" action files.

import {
  buildClassificationPrompt,
  buildDraftGenerationPrompt,
  buildRefinementPrompt,
  buildSystemPrompt,
  type ClassificationPromptInput,
  type DraftGenerationPromptInput,
  type RefinementPromptInput,
} from "./editor-prompts";
import {
  extractJson,
  validateClassificationJson,
  validateGeneratedDraftJson,
  validateRefinementJson,
} from "./editor-schemas";
import type {
  AiError,
  AiRuntimeStatus,
  ClassifyActionResult,
  GenerateDraftActionResult,
  RefineDraftActionResult,
} from "./editor-types";

// ── Daily rate limiter (in-memory, resets on process restart) ─────────────────

let _dailyCalls = 0;
let _dailyDate = "";

function checkAndIncrementDailyLimit(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (_dailyDate !== today) {
    _dailyCalls = 0;
    _dailyDate = today;
  }
  const limit = parseInt(process.env.AI_EDITOR_DAILY_LIMIT ?? "0", 10);
  if (limit > 0 && _dailyCalls >= limit) return false;
  _dailyCalls++;
  return true;
}

// ── Runtime status ────────────────────────────────────────────────────────────

export function getAiRuntimeStatus(): AiRuntimeStatus {
  if (process.env.AI_EDITOR_ENABLED !== "true") return "disabled";
  if (!process.env.ANTHROPIC_API_KEY?.trim()) return "missing_key";
  return "connected";
}

// ── Anthropic API caller (native fetch, no SDK dependency) ────────────────────

interface ClaudeCallResult {
  ok: true;
  content: string;
  inputTokens: number;
  outputTokens: number;
}

async function callClaudeJson(opts: {
  system: string;
  userMessage: string;
  maxOutputTokens: number;
  model: string;
}): Promise<ClaudeCallResult | AiError> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "AI service not configured.", errorCode: "api_key_missing" };
  }

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: opts.model,
        max_tokens: opts.maxOutputTokens,
        system: opts.system,
        messages: [{ role: "user", content: opts.userMessage }],
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("TimeoutError") || msg.includes("timeout") || msg.includes("aborted")) {
      return { ok: false, error: "AI took too long to respond. Try a shorter input.", errorCode: "timeout" };
    }
    console.error("[ai-runtime] fetch error", { message: msg.slice(0, 200) });
    return { ok: false, error: "AI request failed. Try again.", errorCode: "model_unavailable" };
  }

  if (res.status === 429) {
    return { ok: false, error: "AI service is busy. Wait 30 seconds and try again.", errorCode: "rate_limited" };
  }

  if (res.status >= 500) {
    return { ok: false, error: "AI service temporarily unavailable. Try again.", errorCode: "model_unavailable" };
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    console.error("[ai-runtime] Anthropic error", { status: res.status, body: bodyText.slice(0, 300) });
    return { ok: false, error: `AI service returned error ${res.status}. Try again.`, errorCode: "model_unavailable" };
  }

  let data: { content?: { type: string; text: string }[]; usage?: { input_tokens: number; output_tokens: number } };
  try {
    data = await res.json() as typeof data;
  } catch {
    return { ok: false, error: "AI returned an unreadable response.", errorCode: "invalid_json" };
  }

  const text = data.content?.[0]?.text ?? "";
  if (!text) {
    return { ok: false, error: "AI returned an empty response. Try again.", errorCode: "invalid_json" };
  }

  console.log("[ai-runtime]", {
    model: opts.model,
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
  });

  return {
    ok: true,
    content: text,
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
  };
}

// ── Pre-call guards ───────────────────────────────────────────────────────────

function preCallGuard(inputText: string): AiError | null {
  const status = getAiRuntimeStatus();

  if (status === "disabled") {
    return { ok: false, error: "AI runtime not enabled. Set AI_EDITOR_ENABLED=true to enable.", errorCode: "ai_disabled" };
  }
  if (status === "missing_key") {
    return { ok: false, error: "AI service not configured. Contact admin.", errorCode: "api_key_missing" };
  }
  if (!checkAndIncrementDailyLimit()) {
    return { ok: false, error: "Daily AI limit reached. Resets at midnight UTC.", errorCode: "daily_limit" };
  }

  const maxChars = parseInt(process.env.AI_EDITOR_MAX_INPUT_CHARS ?? "8000", 10);
  if (inputText.length > maxChars) {
    return {
      ok: false,
      error: `Input exceeds ${maxChars} character limit (currently ${inputText.length}). Trim the content and try again.`,
      errorCode: "input_too_long",
    };
  }

  return null;
}

function truncateInput(text: string): string {
  const maxChars = parseInt(process.env.AI_EDITOR_MAX_INPUT_CHARS ?? "8000", 10);
  return text.slice(0, maxChars);
}

function getClassifyModel(): string {
  return process.env.AI_EDITOR_CLASSIFY_MODEL?.trim() || "claude-haiku-4-5-20251001";
}

function getDraftModel(): string {
  return process.env.AI_EDITOR_DRAFT_MODEL?.trim() || "claude-sonnet-4-6";
}

function getMaxOutputTokens(): number {
  return parseInt(process.env.AI_EDITOR_MAX_OUTPUT_TOKENS ?? "4096", 10);
}

// ── classifyWithAi ────────────────────────────────────────────────────────────

export async function classifyWithAi(input: ClassificationPromptInput): Promise<ClassifyActionResult> {
  const guard = preCallGuard(input.mainInput);
  if (guard) return guard;

  const truncated = { ...input, mainInput: truncateInput(input.mainInput) };
  const callResult = await callClaudeJson({
    system: buildSystemPrompt(),
    userMessage: buildClassificationPrompt(truncated),
    maxOutputTokens: 512,
    model: getClassifyModel(),
  });

  if (!callResult.ok) return callResult;

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(callResult.content));
  } catch {
    return { ok: false, error: "AI returned an unexpected response format. Try again.", errorCode: "invalid_json" };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "AI output failed validation. Try again.", errorCode: "schema_invalid" };
  }

  try {
    const result = validateClassificationJson(parsed);
    return { ok: true, result };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown";
    console.error("[ai-runtime] classification schema error", { message: msg });
    return { ok: false, error: "AI classification output failed validation. Try again.", errorCode: "schema_invalid" };
  }
}

// ── generateDraftWithAi ───────────────────────────────────────────────────────

export async function generateDraftWithAi(input: DraftGenerationPromptInput): Promise<GenerateDraftActionResult> {
  const guard = preCallGuard(input.mainInput);
  if (guard) return guard;

  const truncated = { ...input, mainInput: truncateInput(input.mainInput) };
  const callResult = await callClaudeJson({
    system: buildSystemPrompt(),
    userMessage: buildDraftGenerationPrompt(truncated),
    maxOutputTokens: getMaxOutputTokens(),
    model: getDraftModel(),
  });

  if (!callResult.ok) return callResult;

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(callResult.content));
  } catch {
    return { ok: false, error: "AI returned an unexpected response format. Try again.", errorCode: "invalid_json" };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "AI output failed validation. Try again.", errorCode: "schema_invalid" };
  }

  try {
    const draft = validateGeneratedDraftJson(parsed, input.contentType);
    return { ok: true, draft };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown";
    console.error("[ai-runtime] draft schema error", { message: msg });
    return { ok: false, error: "AI draft output failed validation. Try again.", errorCode: "schema_invalid" };
  }
}

// ── refineDraftWithAi ─────────────────────────────────────────────────────────

export async function refineDraftWithAi(input: RefinementPromptInput): Promise<RefineDraftActionResult> {
  const draftJson = JSON.stringify(input.currentDraft);
  const guard = preCallGuard(draftJson + input.ownerPrompt);
  if (guard) return guard;

  const callResult = await callClaudeJson({
    system: buildSystemPrompt(),
    userMessage: buildRefinementPrompt(input),
    maxOutputTokens: getMaxOutputTokens(),
    model: getDraftModel(),
  });

  if (!callResult.ok) return callResult;

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(callResult.content));
  } catch {
    return { ok: false, error: "AI returned an unexpected response format. Try again.", errorCode: "invalid_json" };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "AI output failed validation. Try again.", errorCode: "schema_invalid" };
  }

  try {
    const result = validateRefinementJson(parsed, input.currentDraft.contentType);
    return {
      ok: true,
      draft: result.draft,
      changeSummary: result.changeSummary,
      fieldsChanged: result.fieldsChanged,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown";
    console.error("[ai-runtime] refinement schema error", { message: msg });
    return { ok: false, error: "AI refinement output failed validation. Try again.", errorCode: "schema_invalid" };
  }
}
