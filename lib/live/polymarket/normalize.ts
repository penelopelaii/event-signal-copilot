import type { EventCategory } from "@/lib/types";
import type { ClobBook, ClobMidpoint, ClobPriceHistory, ClobSpread, GammaMarket } from "./types";

/**
 * Neutral engine fallbacks.
 *
 * The Signal Quality Engine requires a complete numeric input.
 * When a live field is missing, the adapter supplies these values and
 * marks them unavailable. They are not observed market data.
 *
 * Chosen so each affected sub-score lands near the middle of 0–100
 * rather than implying a strong or weak reading.
 */
export const NEUTRAL = {
  liquidity: "moderate" as const,
  spreadPct: 5.3,
  depth: "shallow" as const,
  freshnessMinutes: 720,
  change24hPp: 0,
  change7dPp: 0,
  change30dPp: 0,
  volatility7dPp: 45,
  resolutionClarity: 50,
  participationIndex: 50,
  concentrationIndex: 50,
  crossMarketDisagreementPp: 19,
};

/** Two-way size counted inside this band around midpoint. */
export const DEPTH_BAND_PP = 2;

export function parseJsonArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseTimestamp(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const asNumber = Number(raw);
  if (Number.isFinite(asNumber) && asNumber > 0) {
    const ms = asNumber > 1e12 ? asNumber : asNumber * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function mapOutcomes(market: GammaMarket): Array<{
  label: string;
  price: number | null;
  tokenId: string | null;
}> {
  const labels = parseJsonArray(market.outcomes);
  const prices = parseJsonArray(market.outcomePrices);
  const tokenIds = parseJsonArray(market.clobTokenIds);

  if (labels.length === 0) return [];

  return labels.map((label, index) => ({
    label,
    price: parseNumber(prices[index] ?? null),
    tokenId: tokenIds[index] ?? null,
  }));
}

/**
 * Official Gamma docs: correlate outcomes / prices / token IDs by index.
 * Index 0 is Yes and index 1 is No when those labels are present.
 * We still match on the returned label rather than trusting position alone.
 */
export function selectPrimaryOutcome(
  outcomes: Array<{ label: string; price: number | null; tokenId: string | null }>,
) {
  if (outcomes.length === 0) return null;
  const yes = outcomes.find((row) => /^yes$/i.test(row.label.trim()));
  return yes ?? outcomes[0];
}

export function midpointFromClob(payload: ClobMidpoint | null): number | null {
  if (!payload) return null;
  return parseNumber(payload.mid ?? payload.mid_price ?? null);
}

export function spreadFromClob(
  payload: ClobSpread | null,
  bestBid: number | null,
  bestAsk: number | null,
): { value: number | null; origin: "live" | "derived" | "unavailable" } {
  const official = parseNumber(payload?.spread ?? null);
  if (official !== null) return { value: official, origin: "live" };
  if (bestBid !== null && bestAsk !== null && bestAsk >= bestBid) {
    return { value: bestAsk - bestBid, origin: "derived" };
  }
  return { value: null, origin: "unavailable" };
}

export function bookExtremes(book: ClobBook | null): {
  bestBid: number | null;
  bestAsk: number | null;
} {
  if (!book) return { bestBid: null, bestAsk: null };
  const bids = (book.bids ?? [])
    .map((row) => parseNumber(row.price))
    .filter((n): n is number => n !== null);
  const asks = (book.asks ?? [])
    .map((row) => parseNumber(row.price))
    .filter((n): n is number => n !== null);
  return {
    bestBid: bids.length ? Math.max(...bids) : null,
    bestAsk: asks.length ? Math.min(...asks) : null,
  };
}

export function notionalInBand(
  levels: Array<{ price: string; size: string }> | undefined,
  mid: number,
): number {
  const band = DEPTH_BAND_PP / 100;
  const lo = mid - band;
  const hi = mid + band;
  let total = 0;
  for (const level of levels ?? []) {
    const price = parseNumber(level.price);
    const size = parseNumber(level.size);
    if (price === null || size === null) continue;
    if (price >= lo && price <= hi) total += price * size;
  }
  return total;
}

/**
 * Two-way notional depth within ±2pp of midpoint.
 *
 * notional = price × size at each eligible level.
 * twoWayNotionalDepth = min(bidNotional, askNotional)
 *
 * The weaker side is the constraint: a one-sided book is not two-way depth.
 */
export function twoWayNotionalDepth(
  book: ClobBook | null,
  mid: number | null,
): {
  bidNotionalDepth: number;
  askNotionalDepth: number;
  twoWayNotionalDepth: number;
} | null {
  if (!book || mid === null) return null;
  const bidNotionalDepth = notionalInBand(book.bids, mid);
  const askNotionalDepth = notionalInBand(book.asks, mid);
  return {
    bidNotionalDepth,
    askNotionalDepth,
    twoWayNotionalDepth: Math.min(bidNotionalDepth, askNotionalDepth),
  };
}

export function mapLiquidity(liquidityUsd: number | null) {
  if (liquidityUsd === null) return null;
  if (liquidityUsd >= 1_000_000) return "high" as const;
  if (liquidityUsd >= 250_000) return "moderate" as const;
  if (liquidityUsd >= 50_000) return "low" as const;
  return "thin" as const;
}

/**
 * Adapter-only mapping from two-way notional depth into the existing
 * depth ordinal. This does not change engine weights.
 *
 * Thresholds are in notional units (price × size), not share count.
 */
export function mapDepth(twoWayNotional: number | null) {
  if (twoWayNotional === null) return null;
  if (twoWayNotional >= 50_000) return "deep" as const;
  if (twoWayNotional >= 15_000) return "moderate" as const;
  if (twoWayNotional >= 3_000) return "shallow" as const;
  return "thin" as const;
}

export function freshnessMinutes(
  book: ClobBook | null,
  updatedAt: string | null | undefined,
  asOf = new Date(),
): number | null {
  const bookTime = parseTimestamp(book?.timestamp ?? null);
  const marketTime = parseTimestamp(updatedAt ?? null);
  const source = bookTime ?? marketTime;
  if (!source) return null;
  return Math.max(0, Math.round((asOf.getTime() - source.getTime()) / 60_000));
}

export function historyChanges(
  history: ClobPriceHistory | null,
  current: number | null,
  asOf = new Date(),
): {
  change24hPp: number | null;
  change7dPp: number | null;
  change30dPp: number | null;
  volatility7dPp: number | null;
} {
  const points = (history?.history ?? [])
    .filter((row): row is { t: number; p: number } => {
      return typeof row.t === "number" && typeof row.p === "number";
    })
    .sort((a, b) => a.t - b.t);

  if (points.length < 2 || current === null) {
    return {
      change24hPp: null,
      change7dPp: null,
      change30dPp: null,
      volatility7dPp: null,
    };
  }

  const nowSec = Math.floor(asOf.getTime() / 1000);
  const change = (targetAgoSec: number, toleranceSec: number): number | null => {
    const target = nowSec - targetAgoSec;
    let best: { t: number; p: number } | null = null;
    for (const point of points) {
      if (Math.abs(point.t - target) <= toleranceSec) {
        if (!best || Math.abs(point.t - target) < Math.abs(best.t - target)) {
          best = point;
        }
      }
    }
    return best ? (current - best.p) * 100 : null;
  };

  const weekPoints = points.filter((point) => point.t >= nowSec - 7 * 86_400);
  const prices = weekPoints.map((point) => point.p);
  const volatility7dPp =
    prices.length >= 3 ? (Math.max(...prices) - Math.min(...prices)) * 100 : null;

  return {
    change24hPp: change(86_400, 6 * 3600),
    change7dPp: change(7 * 86_400, 24 * 3600),
    change30dPp: change(30 * 86_400, 3 * 86_400),
    volatility7dPp,
  };
}

export function inferCategory(text: string): EventCategory {
  const hay = text.toLowerCase();
  if (/\bfed\b|fomc|rate cut|rate hike|federal funds/.test(hay)) return "monetary_policy";
  if (/\bcpi\b|inflation|pce|payroll|jobs report/.test(hay)) return "macro_release";
  if (/election|president|senate|house majority|midterm/.test(hay)) return "election";
  if (/\betf\b|sec approval|regulatory|regulation/.test(hay)) return "regulatory";
  if (/court|ruling|lawsuit|supreme court|appellate/.test(hay)) return "legal";
  if (/recession|nber/.test(hay)) return "macro_regime";
  if (/earnings|ipo|company/.test(hay)) return "corporate";
  return "other";
}

/** Metadata completeness is not resolution clarity. */
export function resolutionMetadataComplete(input: {
  question?: string | null;
  description?: string | null;
  resolutionSource?: string | null;
  endDate?: string | null;
}): boolean {
  return Boolean(
    input.question?.trim() &&
      input.resolutionSource?.trim() &&
      input.endDate,
  );
}

export function gammaLiquidityUsd(market: GammaMarket): number | null {
  return parseNumber(market.liquidityNum ?? market.liquidity ?? null);
}

export function gammaVolumeUsd(market: GammaMarket): number | null {
  return parseNumber(market.volumeNum ?? market.volume ?? null);
}
