// Deterministic source-resolution layer for FRESH-01.
//
// Allowed evidence only (§12 of the brief): explicit registry source id,
// exact configured alias/label, exact normalized hostname where the
// registry explicitly maps it. No fuzzy matching, no embeddings, no AI,
// no web lookups, no organization-name guessing.

export interface SourceRegistryEntry {
  sourceEntity: string;
  canonicalHostnames: string[];
  labelEn: string;
  labelRu: string;
}

export type SourceResolution =
  | { status: "KNOWN"; sourceEntity: string }
  | { status: "UNKNOWN" }
  | { status: "AMBIGUOUS"; sourceEntities: string[] };

export function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function hostnameOwnedBy(hostname: string, canonicalHostnames: string[]): boolean {
  return canonicalHostnames.some((registered) => {
    const h = registered.toLowerCase();
    return hostname === h || hostname.endsWith(`.${h}`);
  });
}

/** Resolves a URL to a registered source entity by exact/subdomain hostname match. */
export function resolveByUrl(url: string, registry: SourceRegistryEntry[]): SourceResolution {
  const hostname = hostnameOf(url);
  if (!hostname) return { status: "UNKNOWN" };

  const owners = registry.filter((entry) => hostnameOwnedBy(hostname, entry.canonicalHostnames));
  const distinctEntities = [...new Set(owners.map((o) => o.sourceEntity))];

  if (distinctEntities.length === 0) return { status: "UNKNOWN" };
  if (distinctEntities.length === 1) return { status: "KNOWN", sourceEntity: distinctEntities[0] };
  return { status: "AMBIGUOUS", sourceEntities: distinctEntities };
}

/** Resolves a display label to a registered source entity by exact label_en/label_ru match. */
export function resolveByLabel(label: string, registry: SourceRegistryEntry[]): SourceResolution {
  if (!label || label.trim() === "") return { status: "UNKNOWN" };

  const owners = registry.filter((entry) => entry.labelEn === label || (entry.labelRu !== "" && entry.labelRu === label));
  const distinctEntities = [...new Set(owners.map((o) => o.sourceEntity))];

  if (distinctEntities.length === 0) return { status: "UNKNOWN" };
  if (distinctEntities.length === 1) return { status: "KNOWN", sourceEntity: distinctEntities[0] };
  return { status: "AMBIGUOUS", sourceEntities: distinctEntities };
}

/**
 * Free-text label containment check used only by SRC-COMPOUND-006: does
 * `text` contain the *entire, exact* registered label_en of `entry` as a
 * substring? Deliberately not fuzzy — a compound-source finding must be
 * backed by two complete, independently registered labels appearing in the
 * same free-text field, never a partial-word guess.
 */
export function textContainsRegisteredLabel(text: string, entry: SourceRegistryEntry): boolean {
  return entry.labelEn.length > 0 && text.includes(entry.labelEn);
}
