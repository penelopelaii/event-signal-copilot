import { encodeQuery, publicGet } from "./http";
import type { GammaEvent, GammaMarket, GammaSearchResponse } from "./types";

const GAMMA = "https://gamma-api.polymarket.com";

/** Search cache: discovery can be a bit stale. */
const SEARCH_REVALIDATE_SECONDS = 45;
const MARKET_REVALIDATE_SECONDS = 30;
const EVENT_REVALIDATE_SECONDS = 60;

export async function searchEvents(query: string): Promise<GammaEvent[]> {
  const qs = encodeQuery({
    q: query,
    events_status: "active",
    limit_per_type: 15,
    search_profiles: false,
    keep_closed_markets: 0,
  });
  const data = await publicGet<GammaSearchResponse>(
    `${GAMMA}/public-search?${qs}`,
    SEARCH_REVALIDATE_SECONDS,
  );
  return data.events ?? [];
}

export async function fetchMarket(id: string): Promise<GammaMarket> {
  return publicGet<GammaMarket>(
    `${GAMMA}/markets/${encodeURIComponent(id)}`,
    MARKET_REVALIDATE_SECONDS,
  );
}

export async function fetchEvent(id: string): Promise<GammaEvent> {
  return publicGet<GammaEvent>(
    `${GAMMA}/events/${encodeURIComponent(id)}`,
    EVENT_REVALIDATE_SECONDS,
  );
}
