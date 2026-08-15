import type {
  AgreementLevel,
  DepthLevel,
  EventCategory,
  FailureSeverity,
  LiquidityLevel,
  QualityLabel,
} from "./types";

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  monetary_policy: "Monetary policy",
  macro_release: "Macro release",
  election: "Election",
  regulatory: "Regulatory",
  legal: "Legal",
  corporate: "Corporate",
  macro_regime: "Macro regime",
};

export const LIQUIDITY_LABELS: Record<LiquidityLevel, string> = {
  high: "High",
  moderate: "Moderate",
  low: "Low",
  thin: "Thin",
};

export const DEPTH_LABELS: Record<DepthLevel, string> = {
  deep: "Deep",
  moderate: "Moderate",
  shallow: "Shallow",
  thin: "Thin",
};

export const AGREEMENT_LABELS: Record<AgreementLevel, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const SEVERITY_LABELS: Record<FailureSeverity, string> = {
  binding: "Binding",
  elevated: "Elevated",
  watch: "Watch",
};

export const QUALITY_COPY: Record<QualityLabel, string> = {
  "Strong Signal":
    "Market-structure conditions look informative enough to treat the implied probability as a usable research input.",
  "Moderately Strong":
    "The signal is usable, but at least one structural factor still limits how much weight it should carry.",
  "Mixed Signal":
    "Some market-quality factors support the reading; others are weak enough that the probability should be treated as provisional.",
  "Weak Signal":
    "The implied probability is visible, but the market that produced it does not look structurally reliable.",
  "Not Decision-Useful":
    "The quoted probability should not be treated as an information-bearing signal under these conditions.",
};

export const SUBSCORE_META: Array<{
  key:
    | "liquidity"
    | "spread"
    | "depth"
    | "freshness"
    | "stability"
    | "resolutionClarity"
    | "crossMarket"
    | "participation";
  label: string;
}> = [
  { key: "liquidity", label: "Liquidity" },
  { key: "spread", label: "Spread" },
  { key: "depth", label: "Depth" },
  { key: "freshness", label: "Freshness" },
  { key: "stability", label: "Stability" },
  { key: "resolutionClarity", label: "Resolution clarity" },
  { key: "crossMarket", label: "Cross-market" },
  { key: "participation", label: "Participation" },
];
