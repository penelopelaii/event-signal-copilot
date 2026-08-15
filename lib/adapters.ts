import type { CrossMarketSource, EventProfile, MarketSignal } from "./types";

/**
 * API-ready adapters.
 *
 * v1 uses synthetic presets only. These interfaces exist so later
 * integrations (Polymarket, Kalshi, FRED, Treasury yields, rates futures,
 * options-implied metrics) can be added without rewriting the UI.
 *
 * Any live integration must be fetched from a server-side route.
 * Do not put API keys in frontend code.
 */

export interface EventMarketAdapter {
  id: string;
  label: string;
  /** Venue-specific event/market identifier, not a user-facing title. */
  fetchEvent(ref: string): Promise<EventProfile | null>;
  fetchMarketSignal(ref: string): Promise<Partial<MarketSignal> | null>;
}

export interface CrossMarketAdapter {
  id: string;
  label: string;
  fetchImpliedProbability(ref: string): Promise<CrossMarketSource | null>;
}

async function unavailable(): Promise<null> {
  return null;
}

export const polymarketAdapter: EventMarketAdapter = {
  id: "polymarket",
  label: "Polymarket (live, read-only via /api/live)",
  fetchEvent: unavailable,
  fetchMarketSignal: unavailable,
};

export const kalshiAdapter: EventMarketAdapter = {
  id: "kalshi",
  label: "Kalshi (not wired)",
  fetchEvent: unavailable,
  fetchMarketSignal: unavailable,
};

export const fredAdapter: CrossMarketAdapter = {
  id: "fred",
  label: "FRED (not wired)",
  fetchImpliedProbability: unavailable,
};

export const treasuryAdapter: CrossMarketAdapter = {
  id: "treasury_yields",
  label: "Treasury yields (not wired)",
  fetchImpliedProbability: unavailable,
};

export const ratesFuturesAdapter: CrossMarketAdapter = {
  id: "rates_futures",
  label: "Rates futures (not wired)",
  fetchImpliedProbability: unavailable,
};

export const optionsImpliedAdapter: CrossMarketAdapter = {
  id: "options_implied",
  label: "Options-implied (not wired)",
  fetchImpliedProbability: unavailable,
};

export const EVENT_MARKET_ADAPTERS: EventMarketAdapter[] = [
  polymarketAdapter,
  kalshiAdapter,
];

export const CROSS_MARKET_ADAPTERS: CrossMarketAdapter[] = [
  fredAdapter,
  treasuryAdapter,
  ratesFuturesAdapter,
  optionsImpliedAdapter,
];
