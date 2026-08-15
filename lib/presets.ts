import { EXPOSURES_BY_EVENT } from "./exposures";
import type { EventPreset } from "./types";

/**
 * Synthetic event presets for v1.
 * All probabilities, market-quality fields, and secondary sources are fabricated.
 * They exist to show how Signal Quality and cross-market disagreement diverge
 * across event types — not to describe any live market.
 */

export const PRESETS: EventPreset[] = [
  {
    id: "fed",
    label: "Fed decision",
    blurb:
      "High liquidity, tight spread, clear resolution. Moderate cross-market disagreement on the cut.",
    event: {
      id: "fed",
      title: "September Fed Rate Decision",
      shortLabel: "Sep FOMC",
      category: "monetary_policy",
      resolutionDate: "2026-09-16",
      definition:
        "The FOMC decision at the September 15–16, 2026 meeting. The outcome space is the change in the federal funds target range relative to the prior meeting.",
      resolutionCriteria:
        "Resolved to the official FOMC statement for the September 2026 meeting. The primary outcome is a 25bp cut in the target range.",
      primaryOutcomeId: "cut_25",
      outcomes: [
        { id: "cut_50", label: "50bp cut", impliedProbability: 8 },
        { id: "cut_25", label: "25bp cut", impliedProbability: 64 },
        { id: "hold", label: "No change", impliedProbability: 28 },
        { id: "hike", label: "Hike", impliedProbability: 0 },
      ],
      change24hPp: 2.5,
      change7dPp: 11,
      change30dPp: 18,
      market: {
        spreadPct: 1.8,
        liquidity: "high",
        volumeUsd: 48_000_000,
        depth: "moderate",
        freshnessMinutes: 2,
        marketAgeDays: 74,
        lastUpdateLabel: "2 minutes ago",
        participationIndex: 84,
        concentrationIndex: 32,
        volatility7dPp: 16,
      },
      resolutionClarity: 88,
      whatWouldChange: [
        "The August CPI and PCE prints relative to the current path",
        "A material shift in FOMC speak between now and the blackout",
        "Labor-market data that reopens a hold-versus-cut debate",
        "A sudden financial-conditions event that changes the loss function",
      ],
      synthetic: true,
    },
    crossSources: [
      {
        id: "rates_futures",
        label: "Rates-implied",
        probability: 58,
        note: "Fed funds futures path, mapped onto a 25bp cut at this meeting.",
      },
      {
        id: "economist",
        label: "Economist consensus",
        probability: 54,
        note: "Survey share assigning a 25bp cut as the modal action.",
      },
      {
        id: "options",
        label: "Options-implied scenario",
        probability: 61,
        note: "Rates-option butterfly around the meeting, synthetic mapping.",
      },
    ],
    exposures: EXPOSURES_BY_EVENT.fed,
  },
  {
    id: "cpi",
    label: "CPI surprise",
    blurb:
      "Fast-moving print market. High freshness and confirmation, weaker stability around the release.",
    event: {
      id: "cpi",
      title: "August CPI Hot Print",
      shortLabel: "CPI",
      category: "macro_release",
      resolutionDate: "2026-09-11",
      definition:
        "Whether the August 2026 CPI (headline, seasonally adjusted, month-over-month) prints at or above 0.4%. The primary outcome is the hot-print tail, not the modal print.",
      resolutionCriteria:
        "Resolved to the BLS CPI release for August 2026. A print of 0.4% MoM or higher counts as the primary outcome.",
      primaryOutcomeId: "hot",
      outcomes: [
        { id: "hot", label: "≥ 0.4% MoM", impliedProbability: 41 },
        { id: "in_line", label: "0.2–0.3% MoM", impliedProbability: 44 },
        { id: "soft", label: "≤ 0.1% MoM", impliedProbability: 15 },
      ],
      change24hPp: 8,
      change7dPp: 6,
      change30dPp: 9,
      market: {
        spreadPct: 1.2,
        liquidity: "high",
        volumeUsd: 31_000_000,
        depth: "deep",
        freshnessMinutes: 1,
        marketAgeDays: 22,
        lastUpdateLabel: "1 minute ago",
        participationIndex: 80,
        concentrationIndex: 28,
        volatility7dPp: 26,
      },
      resolutionClarity: 92,
      whatWouldChange: [
        "The BLS release itself",
        "A revision to July CPI that changes the base",
        "Energy or shelter sub-components leaking through other data",
        "A shift in the Cleveland Fed nowcast immediately before the print",
      ],
      synthetic: true,
    },
    crossSources: [
      {
        id: "nowcast",
        label: "Nowcast / model",
        probability: 39,
        note: "Cleveland Fed-style nowcast mapped onto a ≥0.4% threshold.",
      },
      {
        id: "economist",
        label: "Economist consensus",
        probability: 38,
        note: "Share of survey respondents with a 0.4% or hotter forecast.",
      },
      {
        id: "breakevens",
        label: "Breakeven-implied",
        probability: 43,
        note: "Near-term inflation swaps, synthetic mapping onto the same tail.",
      },
    ],
    exposures: EXPOSURES_BY_EVENT.cpi,
  },
  {
    id: "etf",
    label: "ETF approval",
    blurb:
      "Moderate liquidity and a clear binary, with large probability swings around headlines.",
    event: {
      id: "etf",
      title: "Spot Crypto ETF Approval",
      shortLabel: "ETF",
      category: "regulatory",
      resolutionDate: "2026-10-18",
      definition:
        "Whether the SEC issues an approval order for a pending spot crypto ETF application on or before the stated deadline. Binary: approved vs. not approved in window.",
      resolutionCriteria:
        "Resolved to an official SEC approval order published by 18 October 2026. Delay, postponement, or denial in-window counts as not approved.",
      primaryOutcomeId: "approve",
      outcomes: [
        { id: "approve", label: "Approved in window", impliedProbability: 72 },
        { id: "deny", label: "Not approved in window", impliedProbability: 28 },
      ],
      change24hPp: 9,
      change7dPp: 18,
      change30dPp: 24,
      market: {
        spreadPct: 3.2,
        liquidity: "moderate",
        volumeUsd: 12_400_000,
        depth: "shallow",
        freshnessMinutes: 25,
        marketAgeDays: 41,
        lastUpdateLabel: "25 minutes ago",
        participationIndex: 58,
        concentrationIndex: 54,
        volatility7dPp: 28,
      },
      resolutionClarity: 84,
      whatWouldChange: [
        "An SEC comment letter or updated staff calendar",
        "A comparable product decision that is treated as precedent",
        "Issuer withdrawal or a material amendment to the filing",
        "A political or legal intervention that changes the timeline",
      ],
      synthetic: true,
    },
    crossSources: [
      {
        id: "options",
        label: "Options-implied scenario",
        probability: 61,
        note: "Listed-vol around related names, mapped onto an approval event.",
      },
      {
        id: "peer_etf",
        label: "Peer-product pricing",
        probability: 68,
        note: "Other filing-window markets on similar products.",
      },
      {
        id: "news_proxy",
        label: "Headline / flow proxy",
        probability: 80,
        note: "Attention-weighted proxy. Not a probability model.",
      },
    ],
    exposures: EXPOSURES_BY_EVENT.etf,
  },
  {
    id: "election",
    label: "Election",
    blurb:
      "High participation and a long path to resolution. Headline-sensitive, with room for noise.",
    event: {
      id: "election",
      title: "2026 House Majority",
      shortLabel: "House",
      category: "election",
      resolutionDate: "2026-11-03",
      definition:
        "Which party holds a majority of U.S. House seats after the 3 November 2026 general election. The primary outcome is a Republican majority.",
      resolutionCriteria:
        "Resolved to certified House membership once a majority is mathematically determined. Legal contests after certification are out of scope unless they change the majority.",
      primaryOutcomeId: "gop",
      outcomes: [
        { id: "gop", label: "Republican majority", impliedProbability: 53 },
        { id: "dem", label: "Democratic majority", impliedProbability: 45 },
        { id: "split", label: "No majority / contested", impliedProbability: 2 },
      ],
      change24hPp: -3,
      change7dPp: 4,
      change30dPp: -6,
      market: {
        spreadPct: 2.4,
        liquidity: "high",
        volumeUsd: 86_000_000,
        depth: "moderate",
        freshnessMinutes: 8,
        marketAgeDays: 220,
        lastUpdateLabel: "8 minutes ago",
        participationIndex: 92,
        concentrationIndex: 38,
        volatility7dPp: 24,
      },
      resolutionClarity: 68,
      whatWouldChange: [
        "A polling cluster that moves the toss-up map",
        "A funding or candidate shock in a small set of districts",
        "A national headline that reorders turnout assumptions",
        "Early voting data that is treated as a new information set",
      ],
      synthetic: true,
    },
    crossSources: [
      {
        id: "polls",
        label: "Polling aggregate",
        probability: 44,
        note: "Generic-ballot / district-model mapping onto House control.",
      },
      {
        id: "fund",
        label: "Fundamentals model",
        probability: 51,
        note: "Structural model using presidential approval and exposure.",
      },
      {
        id: "prediction_composite",
        label: "Other event venues",
        probability: 56,
        note: "Composite of other event-implied House-control markets.",
      },
    ],
    exposures: EXPOSURES_BY_EVENT.election,
  },
  {
    id: "regulatory",
    label: "Regulatory ruling",
    blurb:
      "Clear binary outcome, lower liquidity, and weak confirmation from other markets.",
    event: {
      id: "regulatory",
      title: "Appellate Ruling on Agency Rule",
      shortLabel: "Ruling",
      category: "legal",
      resolutionDate: "2026-09-30",
      definition:
        "Whether the appellate court upholds the agency’s rule in the pending case. Binary: upheld versus vacated or remanded in a way that blocks enforcement.",
      resolutionCriteria:
        "Resolved to the court’s opinion. A stay without a decision on the merits does not resolve. Vacatur or a blocking remand counts against the primary outcome.",
      primaryOutcomeId: "uphold",
      outcomes: [
        { id: "uphold", label: "Rule upheld", impliedProbability: 61 },
        { id: "vacate", label: "Vacated / blocked", impliedProbability: 39 },
      ],
      change24hPp: 1,
      change7dPp: 3,
      change30dPp: 7,
      market: {
        spreadPct: 7.4,
        liquidity: "thin",
        volumeUsd: 1_800_000,
        depth: "thin",
        freshnessMinutes: 180,
        marketAgeDays: 12,
        lastUpdateLabel: "3 hours ago",
        participationIndex: 28,
        concentrationIndex: 82,
        volatility7dPp: 8,
      },
      resolutionClarity: 86,
      whatWouldChange: [
        "The opinion itself",
        "Oral-argument signaling that lawyers treat as informative",
        "A related district-court or Supreme Court development",
        "Agency guidance that changes what ‘upheld’ economically means",
      ],
      synthetic: true,
    },
    crossSources: [
      {
        id: "legal_desk",
        label: "Legal consensus",
        probability: 44,
        note: "Informal expert split. Not a market.",
      },
      {
        id: "options",
        label: "Options-implied scenario",
        probability: 52,
        note: "Single-name event vol, weakly identified.",
      },
      {
        id: "credit",
        label: "Credit-implied",
        probability: 38,
        note: "Issuer spread move mapped onto rule survival. Loose mapping.",
      },
    ],
    exposures: EXPOSURES_BY_EVENT.regulatory,
  },
  {
    id: "recession",
    label: "Recession",
    blurb:
      "Long-horizon regime market. The definition is the binding constraint, not the quote.",
    event: {
      id: "recession",
      title: "U.S. Recession by End-2026",
      shortLabel: "Recession",
      category: "macro_regime",
      resolutionDate: "2026-12-31",
      definition:
        "Whether the United States is in an NBER-dated recession at any point on or before 31 December 2026. The dating lag is part of the event risk.",
      resolutionCriteria:
        "Resolved to an NBER Business Cycle Dating Committee announcement that places a peak on or before the end of 2026. Two consecutive GDP declines are not sufficient on their own.",
      primaryOutcomeId: "yes",
      outcomes: [
        { id: "yes", label: "Recession dated in-window", impliedProbability: 31 },
        { id: "no", label: "No NBER recession in-window", impliedProbability: 69 },
      ],
      change24hPp: 0.5,
      change7dPp: -2,
      change30dPp: 5,
      market: {
        spreadPct: 3.4,
        liquidity: "moderate",
        volumeUsd: 9_200_000,
        depth: "shallow",
        freshnessMinutes: 45,
        marketAgeDays: 160,
        lastUpdateLabel: "45 minutes ago",
        participationIndex: 62,
        concentrationIndex: 48,
        volatility7dPp: 6,
      },
      resolutionClarity: 38,
      whatWouldChange: [
        "A sequence of negative payroll and consumption prints",
        "A financial-conditions break that is treated as a turning point",
        "NBER communications, or a widely accepted alternative dating rule",
        "A policy response that changes the growth path before year-end",
      ],
      synthetic: true,
    },
    crossSources: [
      {
        id: "yield_curve",
        label: "Yield-curve implied",
        probability: 42,
        note: "Curve-based recession probability, different object and horizon.",
      },
      {
        id: "economist",
        label: "Economist consensus",
        probability: 24,
        note: "Survey share expecting an NBER recession by year-end.",
      },
      {
        id: "credit",
        label: "Credit-implied",
        probability: 36,
        note: "HY spread mapping onto recession odds. Loose.",
      },
    ],
    exposures: EXPOSURES_BY_EVENT.recession,
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export function findPreset(id: string): EventPreset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}

export function searchPresets(query: string): EventPreset[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRESETS;
  return PRESETS.filter((preset) => {
    const haystack = [
      preset.label,
      preset.blurb,
      preset.event.title,
      preset.event.definition,
      preset.event.category,
      ...preset.event.outcomes.map((row) => row.label),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
