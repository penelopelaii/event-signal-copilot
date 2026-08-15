export type EventCategory =
  | "monetary_policy"
  | "macro_release"
  | "election"
  | "regulatory"
  | "legal"
  | "corporate"
  | "macro_regime";

export type LiquidityLevel = "high" | "moderate" | "low" | "thin";
export type DepthLevel = "deep" | "moderate" | "shallow" | "thin";
export type Sensitivity = "High" | "Medium" | "Low";
export type Relevance = "High" | "Medium" | "Low";
export type AgreementLevel = "HIGH" | "MEDIUM" | "LOW";
export type FailureSeverity = "binding" | "elevated" | "watch";

export type QualityLabel =
  | "Strong Signal"
  | "Moderately Strong"
  | "Mixed Signal"
  | "Weak Signal"
  | "Not Decision-Useful";

export interface Outcome {
  id: string;
  label: string;
  impliedProbability: number;
}

export interface MarketSignal {
  spreadPct: number;
  liquidity: LiquidityLevel;
  volumeUsd: number;
  depth: DepthLevel;
  freshnessMinutes: number;
  marketAgeDays: number;
  lastUpdateLabel: string;
  participationIndex: number;
  concentrationIndex: number;
  volatility7dPp: number;
}

export interface EventProfile {
  id: string;
  title: string;
  shortLabel: string;
  category: EventCategory;
  resolutionDate: string;
  definition: string;
  resolutionCriteria: string;
  primaryOutcomeId: string;
  outcomes: Outcome[];
  change24hPp: number;
  change7dPp: number;
  change30dPp: number;
  market: MarketSignal;
  resolutionClarity: number;
  whatWouldChange: string[];
  synthetic: true;
}

export interface SignalQualityInput {
  liquidity: LiquidityLevel;
  spreadPct: number;
  depth: DepthLevel;
  freshnessMinutes: number;
  change24hPp: number;
  change7dPp: number;
  volatility7dPp: number;
  resolutionClarity: number;
  participationIndex: number;
  concentrationIndex: number;
  crossMarketDisagreementPp: number;
  timeToResolutionDays: number;
}

export interface SubScores {
  liquidity: number;
  spread: number;
  depth: number;
  freshness: number;
  stability: number;
  resolutionClarity: number;
  crossMarket: number;
  participation: number;
}

export interface FailureMode {
  id: string;
  code: string;
  title: string;
  detail: string;
  severity: FailureSeverity;
}

export interface SignalQualityOutput {
  overall: number;
  label: QualityLabel;
  subscores: SubScores;
  supporting: string[];
  weakening: string[];
  failureModes: FailureMode[];
  summary: string;
  thresholdsSynthetic: true;
}

export interface CrossMarketSource {
  id: string;
  label: string;
  probability: number;
  note: string;
}

export interface CrossMarketSignal {
  eventId: string;
  primaryLabel: string;
  primaryProbability: number;
  sources: CrossMarketSource[];
  agreement: AgreementLevel;
  disagreementPp: number;
  explanation: string;
  synthetic: true;
}

export interface Exposure {
  id: string;
  name: string;
  sensitivity: Sensitivity;
  ifMoreLikely: string;
  relevance: Relevance;
}

export interface ResearchBrief {
  pricedIn: string;
  whatChanged: string;
  whyTrust: string;
  whyCautious: string;
  crossMarket: string;
  exposures: string;
  whatWouldChange: string[];
}

export interface EventPreset {
  id: string;
  label: string;
  blurb: string;
  event: EventProfile;
  crossSources: CrossMarketSource[];
  exposures: Exposure[];
}

export interface Evaluation {
  event: EventProfile;
  primary: Outcome;
  daysToResolution: number;
  quality: SignalQualityOutput;
  crossMarket: CrossMarketSignal;
  exposures: Exposure[];
  brief: ResearchBrief;
}
