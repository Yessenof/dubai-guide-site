#!/bin/bash
#
# memory-guard.sh
# Runs as a Claude Code Stop hook.
# Two checks — both warn only, never block (exits 0 always).
#
# Check 1: Source files newer than PROJECT_STATE.md
#   → means project state may need updating
#
# Check 2: PROJECT_STATE.md newer than CLAUDE_PROJECT_KB.md
#   → means the Claude Project knowledge base is stale
#
# Source paths watched:
#   app/   components/   lib/   proxy.ts   next.config.ts   drizzle.config.ts
#
# Excluded:
#   .next/   node_modules/   data/   .env*   *.log   public/

cd "$(dirname "$0")/.." || exit 0

MEMORY_FILE="PROJECT_STATE.md"
KB_FILE="CLAUDE_PROJECT_KB.md"

# ── Check 0: PROJECT_STATE.md must exist ─────────────────────────────────────
if [ ! -f "$MEMORY_FILE" ]; then
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════════╗"
  echo "  ║  WARNING: PROJECT_STATE.md is missing.                      ║"
  echo "  ║  Create it before this session ends.                        ║"
  echo "  ╚══════════════════════════════════════════════════════════════╝"
  echo ""
  exit 0
fi

# ── Check 1: Source files newer than PROJECT_STATE.md ────────────────────────
NEWER=$(find app components lib proxy.ts next.config.ts drizzle.config.ts \
  -newer "$MEMORY_FILE" \
  -not -path "*/.next/*" \
  -not -path "*/node_modules/*" \
  -not -name "*.log" \
  2>/dev/null | head -8)

if [ -n "$NEWER" ]; then
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════════╗"
  echo "  ║  PROJECT MEMORY CHECK                                        ║"
  echo "  ║  Source files changed since PROJECT_STATE.md was updated.   ║"
  echo "  ║                                                              ║"
  while IFS= read -r f; do
    printf  "  ║    • %-56s║\n" "$f"
  done <<< "$NEWER"
  echo "  ║                                                              ║"
  echo "  ║  If this was a meaningful step, update before finishing:    ║"
  echo "  ║    PROJECT_STATE.md   SESSION_LOG.md   CHECKPOINTS.md       ║"
  echo "  ║    CLAUDE_PROJECT_KB.md                                     ║"
  echo "  ╚══════════════════════════════════════════════════════════════╝"
  echo ""
fi

# ── Check 2: PROJECT_STATE.md newer than CLAUDE_PROJECT_KB.md ────────────────
if [ -f "$KB_FILE" ] && [ "$MEMORY_FILE" -nt "$KB_FILE" ]; then
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════════╗"
  echo "  ║  CLAUDE PROJECT KB CHECK                                     ║"
  echo "  ║  PROJECT_STATE.md is newer than CLAUDE_PROJECT_KB.md.       ║"
  echo "  ║  The Claude Project knowledge base may be stale.            ║"
  echo "  ║                                                              ║"
  echo "  ║  If meaningful changes were made, update:                   ║"
  echo "  ║    CLAUDE_PROJECT_KB.md                                     ║"
  echo "  ╚══════════════════════════════════════════════════════════════╝"
  echo ""
fi

exit 0
