// FRESH-01 — deterministic consistency engine CLI. Report-only, zero writes
// to either database.
//
// Usage:
//   npx tsx scripts/qa-consistency-check.ts --guides-db <path> --freshness-db <path> [--format text|json]
//
// Both --guides-db and --freshness-db are required and explicit — this CLI
// never defaults to data/guides.db or any other implicit path. No network,
// no SSH, no production access.
//
// Exit codes:
//   0  PASS / PASS_WITH_WARNINGS
//   1  BLOCKED  (one or more deterministic BLOCKING findings)
//   2  FAIL     (engine could not safely evaluate the corpus, or bad CLI usage)

import { runConsistencyCheck } from "../lib/freshness/consistency/engine";
import { ConsistencyReport, exitCodeForStatus } from "../lib/freshness/consistency/types";

interface CliArgs {
  guidesDbPath?: string;
  freshnessDbPath?: string;
  format: string;
}

function parseArgs(argv: string[]): CliArgs {
  let guidesDbPath: string | undefined;
  let freshnessDbPath: string | undefined;
  let format = "text";

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--guides-db") {
      guidesDbPath = argv[i + 1];
      i++;
    } else if (argv[i] === "--freshness-db") {
      freshnessDbPath = argv[i + 1];
      i++;
    } else if (argv[i] === "--format") {
      format = argv[i + 1];
      i++;
    }
  }

  return { guidesDbPath, freshnessDbPath, format };
}

function usageError(message: string): never {
  console.error(`[qa-consistency-check] ERROR: ${message}`);
  console.error(
    "Usage: npx tsx scripts/qa-consistency-check.ts --guides-db <path> --freshness-db <path> [--format text|json]"
  );
  process.exit(2);
}

function formatText(report: ConsistencyReport): string {
  const lines: string[] = [];
  lines.push("FRESH-01 CONSISTENCY CHECK");
  lines.push(`STATUS: ${report.status}`);
  lines.push("");
  lines.push(`HARD_FAIL: ${report.counts.hard_fail}`);
  lines.push(`BLOCKING: ${report.counts.blocking}`);
  lines.push(`WARNING: ${report.counts.warnings}`);
  lines.push(`INFO: ${report.counts.info}`);

  for (const f of report.findings) {
    lines.push("");
    const locator = [f.entity_type, f.entity_ref, f.page_slug ? `page=${f.page_slug}` : undefined].filter(Boolean).join(" ");
    lines.push(`[${f.rule_id}] ${f.severity}${locator ? " " + locator : ""}`);
    lines.push(f.message);
  }

  return lines.join("\n");
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (!args.guidesDbPath) usageError("Missing required --guides-db <path>.");
  if (!args.freshnessDbPath) usageError("Missing required --freshness-db <path>.");
  if (args.format !== "text" && args.format !== "json") {
    usageError(`Invalid --format "${args.format}" — must be "text" or "json".`);
  }

  const report = runConsistencyCheck({
    guidesDbPath: args.guidesDbPath!,
    freshnessDbPath: args.freshnessDbPath!,
  });

  if (args.format === "json") {
    // JSON mode: stdout carries only the JSON payload, per §16.
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    console.log(formatText(report));
  }

  process.exit(exitCodeForStatus(report.status));
}

main();
