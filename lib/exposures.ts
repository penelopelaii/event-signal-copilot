import type { Exposure } from "./types";

/**
 * Exposure maps are analytical, not advisory.
 * “If more likely” describes a common structural association.
 * It is not a recommendation to buy, sell, or hedge.
 */

export const EXPOSURES_BY_EVENT: {
  fed: Exposure[];
  cpi: Exposure[];
  etf: Exposure[];
  election: Exposure[];
  regulatory: Exposure[];
  recession: Exposure[];
} = {
  fed: [
    {
      id: "treasury_duration",
      name: "Treasury duration",
      sensitivity: "High",
      ifMoreLikely: "Generally supportive if a cut becomes more likely",
      relevance: "High",
    },
    {
      id: "usd",
      name: "USD",
      sensitivity: "Medium",
      ifMoreLikely: "Potential downward pressure if cut odds rise",
      relevance: "High",
    },
    {
      id: "growth_equities",
      name: "Growth equities",
      sensitivity: "Medium",
      ifMoreLikely: "Often supported by easier policy pricing",
      relevance: "High",
    },
    {
      id: "banks",
      name: "Banks",
      sensitivity: "Medium",
      ifMoreLikely: "Net interest margin path becomes more uncertain",
      relevance: "Medium",
    },
    {
      id: "gold",
      name: "Gold",
      sensitivity: "Medium",
      ifMoreLikely: "Typically supported by a lower real-rate path",
      relevance: "Medium",
    },
    {
      id: "btc",
      name: "BTC",
      sensitivity: "Medium",
      ifMoreLikely: "Liquidity-sensitive; association is noisy",
      relevance: "Low",
    },
  ],
  cpi: [
    {
      id: "real_rates",
      name: "Real rates",
      sensitivity: "High",
      ifMoreLikely: "A hot print is generally associated with a firmer real-rate path",
      relevance: "High",
    },
    {
      id: "usd",
      name: "USD",
      sensitivity: "High",
      ifMoreLikely: "Often firmer if inflation surprises to the upside",
      relevance: "High",
    },
    {
      id: "duration",
      name: "Treasury duration",
      sensitivity: "High",
      ifMoreLikely: "Typically pressured by a hotter inflation print",
      relevance: "High",
    },
    {
      id: "breakevens",
      name: "Inflation breakevens",
      sensitivity: "High",
      ifMoreLikely: "Tend to reprice with the surprise",
      relevance: "High",
    },
    {
      id: "growth_equities",
      name: "Growth equities",
      sensitivity: "Medium",
      ifMoreLikely: "Discount-rate pressure can dominate near the print",
      relevance: "Medium",
    },
    {
      id: "gold",
      name: "Gold",
      sensitivity: "Medium",
      ifMoreLikely: "Response depends on real rates more than the CPI print itself",
      relevance: "Low",
    },
  ],
  etf: [
    {
      id: "btc",
      name: "BTC",
      sensitivity: "High",
      ifMoreLikely: "Directly sensitive to approval odds and flow expectations",
      relevance: "High",
    },
    {
      id: "crypto_beta",
      name: "Broad crypto beta",
      sensitivity: "High",
      ifMoreLikely: "Often moves with the same approval narrative",
      relevance: "High",
    },
    {
      id: "btc_miners",
      name: "Listed miners / crypto equity",
      sensitivity: "High",
      ifMoreLikely: "Typically high-beta to the same event",
      relevance: "Medium",
    },
    {
      id: "usd",
      name: "USD",
      sensitivity: "Low",
      ifMoreLikely: "Limited direct link; second-order via risk appetite",
      relevance: "Low",
    },
    {
      id: "gold",
      name: "Gold",
      sensitivity: "Low",
      ifMoreLikely: "Occasional substitution narrative; weak structural link",
      relevance: "Low",
    },
  ],
  election: [
    {
      id: "policy_sensitive_equities",
      name: "Policy-sensitive equities",
      sensitivity: "High",
      ifMoreLikely: "Sector mix depends on which majority is being priced",
      relevance: "High",
    },
    {
      id: "usd",
      name: "USD",
      sensitivity: "Medium",
      ifMoreLikely: "Fiscal and trade-policy paths can reprice the dollar",
      relevance: "Medium",
    },
    {
      id: "rates",
      name: "Rates / term premium",
      sensitivity: "Medium",
      ifMoreLikely: "Deficit and Fed-independence narratives can move term premium",
      relevance: "High",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      sensitivity: "Medium",
      ifMoreLikely: "Regulatory path is majority-dependent",
      relevance: "Medium",
    },
    {
      id: "energy",
      name: "Energy",
      sensitivity: "Medium",
      ifMoreLikely: "Permitting and tax treatment are majority-sensitive",
      relevance: "Medium",
    },
    {
      id: "vol",
      name: "Index vol",
      sensitivity: "Medium",
      ifMoreLikely: "Headline density can keep event vol elevated into resolution",
      relevance: "Medium",
    },
  ],
  regulatory: [
    {
      id: "named_equity",
      name: "Named-company equity",
      sensitivity: "High",
      ifMoreLikely: "Directly exposed to the rule surviving appeal",
      relevance: "High",
    },
    {
      id: "sector_peers",
      name: "Sector peers",
      sensitivity: "Medium",
      ifMoreLikely: "Often reprice as a group if the rule is treated as precedent",
      relevance: "High",
    },
    {
      id: "credit_spreads",
      name: "Issuer credit",
      sensitivity: "Medium",
      ifMoreLikely: "Compliance cost and franchise risk can show up in spreads",
      relevance: "Medium",
    },
    {
      id: "legal_vol",
      name: "Event vol",
      sensitivity: "High",
      ifMoreLikely: "Binary legal outcomes concentrate vol into the decision window",
      relevance: "Medium",
    },
  ],
  recession: [
    {
      id: "equities",
      name: "Cyclical equities",
      sensitivity: "High",
      ifMoreLikely: "Generally pressured if recession odds rise",
      relevance: "High",
    },
    {
      id: "credit",
      name: "Credit spreads",
      sensitivity: "High",
      ifMoreLikely: "Typically widen with recession probability",
      relevance: "High",
    },
    {
      id: "duration",
      name: "Treasury duration",
      sensitivity: "High",
      ifMoreLikely: "Often supported by a lower growth/policy path",
      relevance: "High",
    },
    {
      id: "usd",
      name: "USD",
      sensitivity: "Medium",
      ifMoreLikely: "Path is regime-dependent (growth scare vs. dollar funding)",
      relevance: "Medium",
    },
    {
      id: "gold",
      name: "Gold",
      sensitivity: "Medium",
      ifMoreLikely: "Often supported if real rates fall with growth odds",
      relevance: "Medium",
    },
    {
      id: "btc",
      name: "BTC",
      sensitivity: "Medium",
      ifMoreLikely: "Liquidity-sensitive; recession association is unstable",
      relevance: "Low",
    },
  ],
};
