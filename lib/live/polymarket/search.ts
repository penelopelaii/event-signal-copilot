import type { LiveSearchResult } from "@/lib/types";
import { gammaLiquidityUsd, gammaVolumeUsd, mapOutcomes, parseNumber, selectPrimaryOutcome } from "./normalize";
import type { GammaEvent } from "./types";

export function flattenSearchResults(events: GammaEvent[]): LiveSearchResult[] {
  const rows: LiveSearchResult[] = [];

  for (const event of events) {
    const markets = event.markets ?? [];
    for (const market of markets) {
      if (!market.id) continue;
      if (market.closed === true || market.active === false) continue;

      const outcomes = mapOutcomes(market);
      const primary = selectPrimaryOutcome(outcomes);
      const implied =
        primary?.price ??
        parseNumber(outcomes[0]?.price ?? null);

      rows.push({
        marketId: String(market.id),
        eventId: String(event.id ?? ""),
        eventTitle: event.title?.trim() || market.question?.trim() || "Untitled event",
        question: market.question?.trim() || event.title?.trim() || "Untitled market",
        impliedProbability: implied !== null ? implied * 100 : null,
        endDate: market.endDate ?? event.endDate ?? null,
        volumeUsd: gammaVolumeUsd(market) ?? parseNumber(event.volume ?? null),
        liquidityUsd: gammaLiquidityUsd(market) ?? parseNumber(event.liquidity ?? null),
        active: true,
        closed: false,
      });
    }
  }

  return rows.slice(0, 24);
}
