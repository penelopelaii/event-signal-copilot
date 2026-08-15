/**
 * Raw Polymarket response shapes used by the adapter.
 * Official docs: https://docs.polymarket.com
 * Keep these out of UI components.
 */

export interface GammaSearchResponse {
  events?: GammaEvent[] | null;
  pagination?: { hasMore?: boolean; totalResults?: number };
}

export interface GammaEvent {
  id?: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  resolutionSource?: string | null;
  endDate?: string | null;
  startDate?: string | null;
  createdAt?: string | null;
  active?: boolean | null;
  closed?: boolean | null;
  liquidity?: number | null;
  volume?: number | null;
  category?: string | null;
  markets?: GammaMarket[] | null;
  tags?: Array<{ label?: string | null; slug?: string | null }> | null;
}

export interface GammaMarket {
  id?: string;
  question?: string | null;
  description?: string | null;
  resolutionSource?: string | null;
  slug?: string | null;
  conditionId?: string | null;
  endDate?: string | null;
  startDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  category?: string | null;
  groupItemTitle?: string | null;
  outcomes?: string | string[] | null;
  outcomePrices?: string | string[] | null;
  clobTokenIds?: string | string[] | null;
  liquidity?: string | number | null;
  liquidityNum?: number | null;
  volume?: string | number | null;
  volumeNum?: number | null;
  active?: boolean | null;
  closed?: boolean | null;
  archived?: boolean | null;
  enableOrderBook?: boolean | null;
}

export interface ClobOrderLevel {
  price: string;
  size: string;
}

export interface ClobBook {
  market?: string;
  asset_id?: string;
  timestamp?: string;
  bids?: ClobOrderLevel[];
  asks?: ClobOrderLevel[];
  last_trade_price?: string;
}

export interface ClobMidpoint {
  mid?: string;
  mid_price?: string;
}

export interface ClobSpread {
  spread?: string;
}

export interface ClobPricePoint {
  t?: number;
  p?: number;
}

export interface ClobPriceHistory {
  history?: ClobPricePoint[];
}
