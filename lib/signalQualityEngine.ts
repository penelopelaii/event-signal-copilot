import { roundScore } from "./format";
import type {
  DepthLevel,
  FailureMode,
  LiquidityLevel,
  QualityLabel,
  SignalQualityInput,
  SignalQualityOutput,
  SubScores,
} from "./types";

/**
 * Signal Quality Engine
 *
 * Deterministic, synthetic scoring. This is not a forecasting model.
 * It does not estimate whether the event will occur.
 *
 * Outcome probability ≠ signal quality.
 * A market can quote 80% while remaining a weak signal if liquidity is thin,
 * the spread is wide, or the resolution criteria are ambiguous.
 *
 * Thresholds and weights are research heuristics, not empirically calibrated.
 */

const LIQUIDITY_SCORE: Record<LiquidityLevel, number> = {
  high: 91,
  moderate: 68,
  low: 42,
  thin: 18,
};

const DEPTH_SCORE: Record<DepthLevel, number> = {
  deep: 90,
  moderate: 78,
  shallow: 44,
  thin: 20,
};

const WEIGHTS: Record<keyof SubScores, number> = {
  liquidity: 0.16,
  spread: 0.14,
  depth: 0.13,
  freshness: 0.12,
  stability: 0.12,
  resolutionClarity: 0.13,
  crossMarket: 0.12,
  participation: 0.08,
};

function scoreSpread(spreadPct: number): number {
  return roundScore(100 - spreadPct * 9.5);
}

function scoreFreshness(minutes: number): number {
  if (minutes <= 2) return 96;
  if (minutes <= 15) return 90;
  if (minutes <= 60) return 82;
  if (minutes <= 240) return 64;
  if (minutes <= 1440) return 38;
  if (minutes <= 4320) return 20;
  return 8;
}

function scoreStability(
  change24hPp: number,
  change7dPp: number,
  volatility7dPp: number,
): number {
  const jump = Math.abs(change24hPp) * 2.6;
  const drift = Math.abs(change7dPp) * 1.2;
  const vol = volatility7dPp * 1.1;
  return roundScore(100 - jump - drift - vol);
}

function scoreCrossMarket(disagreementPp: number): number {
  return roundScore(100 - disagreementPp * 2.6);
}

function scoreParticipation(
  participationIndex: number,
  concentrationIndex: number,
): number {
  return roundScore(
    participationIndex * 0.65 + (100 - concentrationIndex) * 0.35,
  );
}

function qualityLabel(score: number): QualityLabel {
  if (score >= 85) return "Strong Signal";
  if (score >= 70) return "Moderately Strong";
  if (score >= 50) return "Mixed Signal";
  if (score >= 30) return "Weak Signal";
  return "Not Decision-Useful";
}

function collectFailureModes(
  input: SignalQualityInput,
  scores: SubScores,
): FailureMode[] {
  const modes: FailureMode[] = [];

  if (input.liquidity === "thin" || input.liquidity === "low") {
    modes.push({
      id: "thin_liquidity",
      code: "F1",
      title: "Thin liquidity",
      detail:
        "Two-way activity is limited. The quoted probability may reflect a small set of prints rather than a continuously informed book.",
      severity: input.liquidity === "thin" ? "binding" : "elevated",
    });
  }

  if (input.spreadPct >= 3.5) {
    modes.push({
      id: "wide_spread",
      code: "F2",
      title: "Wide spread",
      detail: `The ${input.spreadPct.toFixed(1)}% spread is large relative to the implied probability, so the tradable signal is coarser than the headline number suggests.`,
      severity: input.spreadPct >= 6 ? "binding" : "elevated",
    });
  }

  if (input.depth === "shallow" || input.depth === "thin") {
    modes.push({
      id: "low_depth",
      code: "F3",
      title: "Low depth",
      detail:
        "Meaningful size would move the implied probability. The displayed price is more of a quote than a capacity-backed view.",
      severity: input.depth === "thin" ? "binding" : "elevated",
    });
  }

  if (input.crossMarketDisagreementPp >= 12) {
    modes.push({
      id: "cross_market_disagreement",
      code: "F4",
      title: "Cross-market disagreement",
      detail: `Secondary sources differ from the event-implied probability by ${input.crossMarketDisagreementPp.toFixed(0)} percentage points. The gap is a research object, not a verdict on which source is correct.`,
      severity: input.crossMarketDisagreementPp >= 18 ? "binding" : "elevated",
    });
  } else if (input.crossMarketDisagreementPp >= 8) {
    modes.push({
      id: "single_source_dependence",
      code: "F5",
      title: "Single-source dependence",
      detail:
        "Confirmation exists but is incomplete. Treating this market as the sole information source would overstate how widely the view is shared.",
      severity: "watch",
    });
  }

  if (input.resolutionClarity < 70) {
    modes.push({
      id: "event_definition_risk",
      code: "F6",
      title: "Event definition risk",
      detail:
        "Resolution criteria leave room for interpretation. Part of the quoted probability may be pricing definitional ambiguity rather than the underlying state of the world.",
      severity: input.resolutionClarity < 50 ? "binding" : "elevated",
    });
  }

  if (input.resolutionClarity < 55) {
    modes.push({
      id: "ambiguous_resolution",
      code: "F7",
      title: "Ambiguous resolution criteria",
      detail:
        "An objective, timely resolver is not clearly specified. That weakens the information content of any implied probability, even if trading is active.",
      severity: "binding",
    });
  }

  if (Math.abs(input.change24hPp) >= 6 && input.crossMarketDisagreementPp >= 8) {
    modes.push({
      id: "unconfirmed_jump",
      code: "F8",
      title: "Sudden probability jump without confirmation",
      detail: `The implied probability moved ${Math.abs(input.change24hPp).toFixed(0)}pp in 24 hours without matching confirmation from other sources.`,
      severity: "elevated",
    });
  }

  if (scores.participation < 50) {
    modes.push({
      id: "low_participation",
      code: "F9",
      title: "Low participation",
      detail:
        "The participation proxy is weak. Price may be set by a narrow group of accounts rather than a diversified information set.",
      severity: scores.participation < 35 ? "elevated" : "watch",
    });
  }

  if (input.concentrationIndex >= 60) {
    modes.push({
      id: "high_concentration",
      code: "F10",
      title: "High concentration",
      detail:
        "Open interest or flow appears concentrated. A single participant can move the implied probability without a corresponding change in public information.",
      severity: input.concentrationIndex >= 75 ? "elevated" : "watch",
    });
  }

  if (input.freshnessMinutes >= 120) {
    modes.push({
      id: "stale_market",
      code: "F11",
      title: "Stale market",
      detail:
        "The book has not updated recently enough to assume it has incorporated the latest public information.",
      severity: input.freshnessMinutes >= 1440 ? "binding" : "elevated",
    });
  }

  if (scores.stability < 55 && input.timeToResolutionDays > 45) {
    modes.push({
      id: "reflexive_pricing",
      code: "F12",
      title: "Reflexive / self-referential pricing",
      detail:
        "A long-dated, headline-sensitive market can reprice on its own last move. Some of the probability path may be flow and attention, not new information.",
      severity: "watch",
    });
  }

  return modes;
}

function supportingFactors(scores: SubScores): string[] {
  const rows: Array<[keyof SubScores, string, string]> = [
    ["liquidity", "Strong two-way activity", "supports treating the quote as more than a thin print."],
    ["spread", "Tight spread", "keeps the implied probability close to a tradable midpoint."],
    ["depth", "Usable depth", "suggests size can transact without immediately invalidating the signal."],
    ["freshness", "Fresh updates", "indicate the market is still incorporating information."],
    ["stability", "Relative stability", "reduces the chance that the reading is a transient dislocation."],
    ["resolutionClarity", "Clear resolution criteria", "limit the share of the price that is definitional risk."],
    ["crossMarket", "Cross-market confirmation", "shows the view is not isolated to a single venue."],
    ["participation", "Broad participation", "lowers the odds that a concentrated book is setting the price."],
  ];

  return rows
    .filter(([key]) => scores[key] >= 75)
    .map(([, title, rest]) => `${title} ${rest}`);
}

function weakeningFactors(scores: SubScores): string[] {
  const rows: Array<[keyof SubScores, string]> = [
    ["liquidity", "Limited two-way activity weakens how much information the quote can carry."],
    ["spread", "A wide spread makes the headline probability coarser than it appears."],
    ["depth", "Shallow depth means modest flow can move the implied probability."],
    ["freshness", "Stale updates raise the chance that public information is not yet in the price."],
    ["stability", "Recent repricing looks chaotic relative to the event's information arrival."],
    ["resolutionClarity", "Resolution ambiguity can inflate or distort the implied probability."],
    ["crossMarket", "Other sources do not corroborate the same probability."],
    ["participation", "Narrow or concentrated participation reduces signal diversity."],
  ];

  return rows.filter(([key]) => scores[key] < 60).map(([, text]) => text);
}

function buildSummary(
  scores: SubScores,
  supporting: string[],
  weakening: string[],
): string {
  const strongest = (Object.entries(scores) as Array<[keyof SubScores, number]>)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key);

  const weakest = (Object.entries(scores) as Array<[keyof SubScores, number]>)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([key]) => key);

  const names: Record<keyof SubScores, string> = {
    liquidity: "liquidity",
    spread: "tight spreads",
    depth: "depth",
    freshness: "freshness",
    stability: "stability",
    resolutionClarity: "resolution clarity",
    crossMarket: "cross-market confirmation",
    participation: "participation",
  };

  const supportClause =
    supporting.length > 0
      ? `${strongest.map((key) => names[key]).join(" and ")} support the signal`
      : "few structural factors clearly support the signal";

  const weakClause =
    weakening.length > 0
      ? `${weakest.map((key) => names[key]).join(" and ")} reduce confidence`
      : "no single factor is an obvious drag";

  return `${supportClause.charAt(0).toUpperCase()}${supportClause.slice(1)}, but ${weakClause}.`;
}

export function evaluateSignalQuality(
  input: SignalQualityInput,
): SignalQualityOutput {
  const subscores: SubScores = {
    liquidity: LIQUIDITY_SCORE[input.liquidity],
    spread: scoreSpread(input.spreadPct),
    depth: DEPTH_SCORE[input.depth],
    freshness: scoreFreshness(input.freshnessMinutes),
    stability: scoreStability(
      input.change24hPp,
      input.change7dPp,
      input.volatility7dPp,
    ),
    resolutionClarity: roundScore(input.resolutionClarity),
    crossMarket: scoreCrossMarket(input.crossMarketDisagreementPp),
    participation: scoreParticipation(
      input.participationIndex,
      input.concentrationIndex,
    ),
  };

  const weighted = (Object.keys(WEIGHTS) as Array<keyof SubScores>).reduce(
    (sum, key) => sum + subscores[key] * WEIGHTS[key],
    0,
  );
  const overall = roundScore(weighted);
  const supporting = supportingFactors(subscores);
  const weakening = weakeningFactors(subscores);

  return {
    overall,
    label: qualityLabel(overall),
    subscores,
    supporting,
    weakening,
    failureModes: collectFailureModes(input, subscores),
    summary: buildSummary(subscores, supporting, weakening),
    thresholdsSynthetic: true,
  };
}

export const QUALITY_THRESHOLDS = [
  { min: 85, max: 100, label: "Strong Signal" as const },
  { min: 70, max: 84, label: "Moderately Strong" as const },
  { min: 50, max: 69, label: "Mixed Signal" as const },
  { min: 30, max: 49, label: "Weak Signal" as const },
  { min: 0, max: 29, label: "Not Decision-Useful" as const },
];
