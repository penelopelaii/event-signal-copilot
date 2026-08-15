import type {
  AgreementLevel,
  CrossMarketSignal,
  CrossMarketSource,
  EventProfile,
} from "./types";

/**
 * Cross-market confirmation is a comparison layer, not a referee.
 * It exposes disagreement. It does not decide which source is correct.
 *
 * Future adapters (FRED, Treasury yields, rates futures, options-implied
 * metrics, economist surveys) should implement CrossMarketAdapter and feed
 * this function the same shape.
 */

export function agreementFromDisagreement(disagreementPp: number): AgreementLevel {
  if (disagreementPp <= 6) return "HIGH";
  if (disagreementPp <= 12) return "MEDIUM";
  return "LOW";
}

export function evaluateCrossMarket(
  event: EventProfile,
  sources: CrossMarketSource[],
): CrossMarketSignal {
  const primary = event.outcomes.find((row) => row.id === event.primaryOutcomeId);
  if (!primary) {
    throw new Error(`Primary outcome ${event.primaryOutcomeId} missing on ${event.id}`);
  }

  const deltas = sources.map((source) =>
    Math.abs(source.probability - primary.impliedProbability),
  );
  const disagreementPp = deltas.length > 0 ? Math.max(...deltas) : 0;
  const agreement = agreementFromDisagreement(disagreementPp);

  const above = sources.filter((source) => source.probability > primary.impliedProbability);
  const below = sources.filter((source) => source.probability < primary.impliedProbability);
  const meanOther =
    sources.length === 0
      ? primary.impliedProbability
      : sources.reduce((sum, source) => sum + source.probability, 0) / sources.length;

  let explanation: string;
  if (sources.length === 0) {
    explanation =
      "No secondary sources are attached to this event. The event-implied probability is currently a single-source reading.";
  } else if (agreement === "HIGH") {
    explanation = `Secondary sources cluster within ${disagreementPp.toFixed(0)} percentage points of the event-implied ${primary.impliedProbability.toFixed(0)}% on “${primary.label}.” Agreement is high; that does not make the shared view correct.`;
  } else if (meanOther < primary.impliedProbability - 4) {
    explanation = `Event markets are pricing a materially higher probability (${primary.impliedProbability.toFixed(0)}%) than ${below.map((s) => s.label.toLowerCase()).slice(0, 2).join(" and ") || "other sources"}. The gap is ${disagreementPp.toFixed(0)} percentage points. None of these sources is treated as ground truth.`;
  } else if (meanOther > primary.impliedProbability + 4) {
    explanation = `Event markets are pricing a materially lower probability (${primary.impliedProbability.toFixed(0)}%) than ${above.map((s) => s.label.toLowerCase()).slice(0, 2).join(" and ") || "other sources"}. The gap is ${disagreementPp.toFixed(0)} percentage points. The research task is to explain the disagreement, not to pick a winner.`;
  } else {
    explanation = `Sources do not collapse to a single number. The widest gap versus the event-implied ${primary.impliedProbability.toFixed(0)}% is ${disagreementPp.toFixed(0)} percentage points. That dispersion is the finding.`;
  }

  return {
    eventId: event.id,
    primaryLabel: primary.label,
    primaryProbability: primary.impliedProbability,
    sources,
    agreement,
    disagreementPp: Math.round(disagreementPp),
    explanation,
    synthetic: true,
  };
}
