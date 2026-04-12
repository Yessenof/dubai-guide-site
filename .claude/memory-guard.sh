#!/bin/bash
#
# memory-guard.sh
# Runs as a Claude Code Stop hook.
# Warns when source files were modified more recently than PROJECT_STATE.md.
# Exits 0 always — warns but never blocks.
#
# "Meaningful" source paths watched:
#   app/   components/   lib/   proxy.ts   next.config.ts   drizzle.config.ts
#
# Trivially excluded (never trigger the warning):
#   .next/   node_modules/   data/   .env*   *.log   public/

cd "$(dirname "$0")/.." || exit 0

MEMORY_FILE="PROJECT_STATE.md"

# If the memory file doesn't exist at all, warn loudly and exit
if [ ! -f "$MEMORY_FILE" ]; then
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════════╗"
  echo "  ║  WARNING: PROJECT_STATE.md is missing.                      ║"
  echo "  ║  Create it before this session ends.                        ║"
  echo "  ╚══════════════════════════════════════════════════════════════╝"
  echo ""
  exit 0
fi

# Find source files newer than PROJECT_STATE.md
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
  echo "  ╚══════════════════════════════════════════════════════════════╝"
  echo ""
fi

exit 0
