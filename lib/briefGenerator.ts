import { QUALITY_COPY } from "./labels";
import { formatPp } from "./format";
import type {
  CrossMarketSignal,
  EventProfile,
  Exposure,
  Outcome,
  ResearchBrief,
  SignalQualityOutput,
} from "./types";

/**
 * Deterministic research-brief synthesis.
 * This is a template layer over engine output, not an LLM.
 * A later model can rewrite these sections; it should not recompute scores.
 */

function directionPhrase(changePp: number): string {
  if (changePp > 1.5) return "repriced higher";
  if (changePp < -1.5) return "repriced lower";
  return "was relatively little changed";
}

export function generateBrief(
  event: EventProfile,
  primary: Outcome,
  quality: SignalQualityOutput,
  cross: CrossMarketSignal,
  exposures: Exposure[],
): ResearchBrief {
  const otherOutcomes = event.outcomes
    .filter((row) => row.id !== primary.id)
    .sort((a, b) => b.impliedProbability - a.impliedProbability)
    .slice(0, 2)
    .map((row) => `${row.label} at ${row.impliedProbability.toFixed(0)}%`);

  const pricedIn = `The market-implied view on ${event.title} currently assigns ${primary.impliedProbability.toFixed(0)}% to “${primary.label}.”${
    otherOutcomes.length > 0
      ? ` Residual mass sits mainly in ${otherOutcomes.join(" and ")}.`
      : ""
  } That figure is a compressed market statement, not a validated forecast.`;

  const whatChanged = `Over 24 hours the primary outcome ${directionPhrase(event.change24hPp)} (${formatPp(event.change24hPp)}). The 7-day move is ${formatPp(event.change7dPp)}; the 30-day move is ${formatPp(event.change30dPp)}. ${
    Math.abs(event.change7dPp) >= 8
      ? "The path is large enough to ask whether the move is information, flow, or both."
      : "The recent path is moderate; the more useful question is whether the level itself is structurally reliable."
  }`;

  const whyTrust =
    quality.supporting.length > 0
      ? `${QUALITY_COPY[quality.label]} ${quality.supporting.slice(0, 2).join(" ")}`
      : `${QUALITY_COPY[quality.label]} No sub-score currently clears a high-confidence threshold.`;

  const cautionBits = [
    ...quality.weakening.slice(0, 2),
    ...quality.failureModes.slice(0, 2).map((mode) => mode.detail),
  ].slice(0, 3);

  const whyCautious =
    cautionBits.length > 0
      ? cautionBits.join(" ")
      : "No single weakening factor dominates, but synthetic scores are not a substitute for source-level due diligence.";

  const highExposures = exposures.filter((row) => row.relevance === "High");
  const named = (highExposures.length > 0 ? highExposures : exposures.slice(0, 3))
    .map((row) => row.name)
    .join(", ");

  const exposuresText = exposures.length
    ? `If “${primary.label}” becomes more likely, the exposures most sensitive on this map are ${named}. Directional notes are structural associations, not trade instructions.`
    : "No exposure map is attached to this event.";

  return {
    pricedIn,
    whatChanged,
    whyTrust,
    whyCautious,
    crossMarket: cross.explanation,
    exposures: exposuresText,
    whatWouldChange: event.whatWouldChange,
  };
}
