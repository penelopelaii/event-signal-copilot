import type { EvaluationProvenance, FieldProvenance } from "./types";

export const SYNTHETIC_FIELD_KEYS = [
  "impliedProbability",
  "spread",
  "liquidity",
  "volume",
  "depth",
  "freshness",
  "change24h",
  "change7d",
  "change30d",
  "stability",
  "resolutionClarity",
  "participation",
  "crossMarket",
] as const;

export function syntheticProvenance(): EvaluationProvenance {
  const fields: Record<string, FieldProvenance> = {};
  for (const key of SYNTHETIC_FIELD_KEYS) {
    fields[key] = { origin: "synthetic" };
  }
  return {
    mode: "synthetic",
    sourceLabel: "Synthetic preset",
    fields,
  };
}

export function originLabel(origin: FieldProvenance["origin"]): string {
  switch (origin) {
    case "live":
      return "Live";
    case "derived":
      return "Derived";
    case "unavailable":
      return "Unavailable";
    default:
      return "Synthetic";
  }
}
