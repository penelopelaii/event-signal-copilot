import type { LiveMarketPacket, LiveSearchResult } from "@/lib/types";

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || "Live request failed.");
  }
  return payload;
}

export async function searchLiveMarkets(query: string): Promise<LiveSearchResult[]> {
  const response = await fetch(`/api/live/search?q=${encodeURIComponent(query)}`);
  const payload = await readJson<{ results: LiveSearchResult[] }>(response);
  return payload.results;
}

export async function fetchLiveMarket(
  marketId: string,
  eventId?: string,
): Promise<LiveMarketPacket> {
  const params = new URLSearchParams({ id: marketId });
  if (eventId) params.set("eventId", eventId);
  const response = await fetch(`/api/live/market?${params.toString()}`);
  return readJson<LiveMarketPacket>(response);
}
