import type {
  CoverageLabel,
  DataCoverage,
  EvaluationProvenance,
  FieldProvenance,
  SignalQualityOutput,
  SubScores,
} from "./types";

/**
 * Evidence coverage is separate from Signal Quality.
 *
 * Signal Quality is the engine output given whatever numeric input it received.
 * Coverage asks whether those inputs were observed or defensibly derived.
 *
 * Neutral fallbacks may be passed into the engine for type compatibility.
 * They do not count as evidence and must not raise coverage.
 */

export const COVERAGE_DIMENSIONS: Array<keyof SubScores> = [
  "liquidity",
  "spread",
  "depth",
  "freshness",
  "stability",
  "resolutionClarity",
  "crossMarket",
  "participation",
];

const DIMENSION_LABELS: Record<keyof SubScores, string> = {
  liquidity: "liquidity",
  spread: "spread",
  depth: "depth",
  freshness: "freshness",
  stability: "stability",
  resolutionClarity: "resolution clarity",
  crossMarket: "cross-market confirmation",
  participation: "participation",
};

const SUPPORTING_PREFIX: Record<keyof SubScores, string> = {
  liquidity: "Strong two-way activity",
  spread: "Tight spread",
  depth: "Usable depth",
  freshness: "Fresh updates",
  stability: "Relative stability",
  resolutionClarity: "Clear resolution criteria",
  crossMarket: "Cross-market confirmation",
  participation: "Broad participation",
};

const WEAKENING_PREFIX: Record<keyof SubScores, string> = {
  liquidity: "Limited two-way activity",
  spread: "A wide spread",
  depth: "Shallow depth",
  freshness: "Stale updates",
  stability: "Recent repricing",
  resolutionClarity: "Resolution ambiguity",
  crossMarket: "Other sources do not corroborate",
  participation: "Narrow or concentrated participation",
};

const FAILURE_DIMENSION: Record<string, keyof SubScores> = {
  thin_liquidity: "liquidity",
  wide_spread: "spread",
  low_depth: "depth",
  stale_market: "freshness",
  reflexive_pricing: "stability",
  event_definition_risk: "resolutionClarity",
  ambiguous_resolution: "resolutionClarity",
  cross_market_disagreement: "crossMarket",
  single_source_dependence: "crossMarket",
  unconfirmed_jump: "crossMarket",
  low_participation: "participation",
  high_concentration: "participation",
};

export function isEvidence(field: FieldProvenance | undefined): boolean {
  if (!field || field.isFallback || field.origin === "unavailable") return false;
  return field.origin === "live" || field.origin === "derived" || field.origin === "synthetic";
}

export function coverageLabel(score: number): CoverageLabel {
  if (score >= 80) return "High coverage";
  if (score >= 60) return "Moderate coverage";
  return "Low coverage";
}

export function measureCoverage(provenance: EvaluationProvenance): DataCoverage {
  const unavailable: string[] = [];
  let observedCount = 0;

  for (const key of COVERAGE_DIMENSIONS) {
    const field = provenance.fields[key];
    if (isEvidence(field)) {
      observedCount += 1;
    } else {
      unavailable.push(DIMENSION_LABELS[key]);
    }
  }

  const expectedCount = COVERAGE_DIMENSIONS.length;
  const dataCoverage = Math.round((observedCount / expectedCount) * 100);

  return {
    dataCoverage,
    coverageLabel: coverageLabel(dataCoverage),
    isProvisional: observedCount < expectedCount,
    observedCount,
    expectedCount,
    unavailable,
  };
}

/**
 * Hide engine copy that was produced from unavailable fallbacks.
 * Does not change the numeric overall score.
 */
export function maskUnavailableEvidence(
  quality: SignalQualityOutput,
  provenance: EvaluationProvenance,
): SignalQualityOutput {
  const unavailable = new Set<keyof SubScores>(
    COVERAGE_DIMENSIONS.filter((key) => !isEvidence(provenance.fields[key])),
  );
  if (unavailable.size === 0) return quality;

  const supporting = quality.supporting.filter((line) => {
    return !COVERAGE_DIMENSIONS.some(
      (key) => unavailable.has(key) && line.startsWith(SUPPORTING_PREFIX[key]),
    );
  });
  const weakening = quality.weakening.filter((line) => {
    return !COVERAGE_DIMENSIONS.some(
      (key) => unavailable.has(key) && line.startsWith(WEAKENING_PREFIX[key]),
    );
  });
  const failureModes = quality.failureModes.filter((mode) => {
    const dimension = FAILURE_DIMENSION[mode.id];
    return !dimension || !unavailable.has(dimension);
  });

  return { ...quality, supporting, weakening, failureModes };
}
