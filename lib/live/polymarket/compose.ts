import { daysToResolution, formatFreshness } from "@/lib/format";
import type {
  CrossMarketSignal,
  EvaluationProvenance,
  EventProfile,
  FieldProvenance,
  LiveMarketPacket,
  Outcome,
  SignalQualityInput,
} from "@/lib/types";
import { fetchBook, fetchMidpoint, fetchPriceHistory, fetchSpread } from "./clob";
import { fetchEvent, fetchMarket } from "./gamma";
import { UpstreamError } from "./http";
import {
  DEPTH_BAND_PP,
  NEUTRAL,
  bookExtremes,
  freshnessMinutes,
  gammaLiquidityUsd,
  gammaVolumeUsd,
  historyChanges,
  inferCategory,
  mapDepth,
  mapLiquidity,
  mapOutcomes,
  midpointFromClob,
  resolutionMetadataComplete,
  selectPrimaryOutcome,
  spreadFromClob,
  twoWayNotionalDepth,
} from "./normalize";

function field(
  origin: FieldProvenance["origin"],
  note?: string,
  isFallback = origin === "unavailable",
  method?: string,
): FieldProvenance {
  return { origin, note, method, isFallback };
}

function withFallback<T>(
  value: T | null,
  fallback: T,
): { value: T; usedFallback: boolean } {
  if (value === null) return { value: fallback, usedFallback: true };
  return { value, usedFallback: false };
}

export async function composeLiveMarket(
  marketId: string,
  eventId?: string,
): Promise<LiveMarketPacket> {
  const market = await fetchMarket(marketId);
  if (!market.id) {
    throw new UpstreamError("Market response was missing an id", 502);
  }

  const parent = eventId ? await fetchEvent(eventId).catch(() => null) : null;
  const outcomesMeta = mapOutcomes(market);
  const primaryMeta = selectPrimaryOutcome(outcomesMeta);
  if (!primaryMeta?.tokenId) {
    throw new UpstreamError("Market is missing CLOB token IDs", 422);
  }

  const [bookResult, midResult, spreadResult, historyResult] = await Promise.allSettled([
    fetchBook(primaryMeta.tokenId),
    fetchMidpoint(primaryMeta.tokenId),
    fetchSpread(primaryMeta.tokenId),
    fetchPriceHistory(primaryMeta.tokenId),
  ]);

  const book = bookResult.status === "fulfilled" ? bookResult.value : null;
  const midPayload = midResult.status === "fulfilled" ? midResult.value : null;
  const spreadPayload = spreadResult.status === "fulfilled" ? spreadResult.value : null;
  const history = historyResult.status === "fulfilled" ? historyResult.value : null;

  const mid = midpointFromClob(midPayload);
  const extremes = bookExtremes(book);
  const spread = spreadFromClob(spreadPayload, extremes.bestBid, extremes.bestAsk);
  const implied = mid ?? primaryMeta.price;
  const depthDetail = twoWayNotionalDepth(book, mid ?? implied);
  const depthLevel = mapDepth(depthDetail?.twoWayNotionalDepth ?? null);
  const liquidityUsd = gammaLiquidityUsd(market);
  const volumeUsd = gammaVolumeUsd(market);
  const liquidityLevel = mapLiquidity(liquidityUsd);
  const bookTime = book?.timestamp ? true : false;
  const freshMin = freshnessMinutes(book, market.updatedAt);
  const changes = historyChanges(history, implied);
  const metadataComplete = resolutionMetadataComplete({
    question: market.question,
    description: market.description ?? parent?.description,
    resolutionSource: market.resolutionSource ?? parent?.resolutionSource,
    endDate: market.endDate ?? parent?.endDate,
  });

  const warnings: string[] = [];
  if (market.closed) warnings.push("This market is marked closed.");
  if (market.active === false) warnings.push("This market is not active.");
  if (!book) warnings.push("Order book was unavailable.");
  if (mid === null) warnings.push("CLOB midpoint was unavailable.");
  if (changes.change24hPp === null) warnings.push("Price history is incomplete.");

  const spreadResolved = withFallback(
    spread.value !== null ? spread.value * 100 : null,
    NEUTRAL.spreadPct,
  );
  const liquidityResolved = withFallback(liquidityLevel, NEUTRAL.liquidity);
  const depthResolved = withFallback(depthLevel, NEUTRAL.depth);
  const freshnessResolved = withFallback(freshMin, NEUTRAL.freshnessMinutes);
  const change24 = withFallback(changes.change24hPp, NEUTRAL.change24hPp);
  const change7 = withFallback(changes.change7dPp, NEUTRAL.change7dPp);
  const change30 = withFallback(changes.change30dPp, NEUTRAL.change30dPp);
  const vol7 = withFallback(changes.volatility7dPp, NEUTRAL.volatility7dPp);
  const clarity = withFallback(null, NEUTRAL.resolutionClarity);

  const provenance: EvaluationProvenance = {
    mode: "live",
    sourceLabel: "External event market",
    sourceDetail: "Read-only Gamma metadata and public CLOB market data",
    fields: {
      impliedProbability: field(
        implied !== null ? (mid !== null ? "live" : "derived") : "unavailable",
        mid !== null
          ? "CLOB midpoint treated as event-implied probability"
          : "Gamma outcome price used because midpoint was missing",
        implied === null,
      ),
      spread: field(
        spreadResolved.usedFallback ? "unavailable" : spread.origin,
        spread.origin === "derived" ? "best ask − best bid" : "Official CLOB spread",
        spreadResolved.usedFallback,
        spread.origin === "derived" ? "best ask − best bid" : "CLOB /spread",
      ),
      liquidity: field(
        liquidityResolved.usedFallback ? "unavailable" : "live",
        "Mapped from Gamma liquidity (USD), not volume",
        liquidityResolved.usedFallback,
        "Gamma liquidity field",
      ),
      volume: field(volumeUsd === null ? "unavailable" : "live"),
      depth: field(
        depthResolved.usedFallback ? "unavailable" : "derived",
        `Two-way notional depth within ±${DEPTH_BAND_PP}pp of midpoint`,
        depthResolved.usedFallback,
        "min(bid notional, ask notional) inside ±2pp",
      ),
      freshness: field(
        freshnessResolved.usedFallback
          ? "unavailable"
          : bookTime
            ? "live"
            : "derived",
        bookTime
          ? "Minutes since live order-book timestamp"
          : "Minutes since market updatedAt",
        freshnessResolved.usedFallback,
        bookTime ? "CLOB book timestamp" : "Gamma updatedAt",
      ),
      change24h: field(
        change24.usedFallback ? "unavailable" : "derived",
        "CLOB price history vs current midpoint",
        change24.usedFallback,
      ),
      change7d: field(
        change7.usedFallback ? "unavailable" : "derived",
        "CLOB price history vs current midpoint",
        change7.usedFallback,
      ),
      change30d: field(
        change30.usedFallback ? "unavailable" : "derived",
        "CLOB price history vs current midpoint",
        change30.usedFallback,
      ),
      stability: field(
        vol7.usedFallback ? "unavailable" : "derived",
        "Recent probability movement from CLOB price history",
        vol7.usedFallback,
        "7-day high−low of implied probability",
      ),
      resolutionClarity: field(
        "unavailable",
        "Metadata completeness is not resolution clarity. No structured clarity field is available from this source.",
        true,
        metadataComplete
          ? "Question, source, and date are present; that is not a clarity score"
          : "Resolution metadata incomplete",
      ),
      participation: field(
        "unavailable",
        "No defensible public participation count on this source",
        true,
      ),
      crossMarket: field(
        "unavailable",
        "A second independent source is not wired in this branch",
        true,
      ),
    },
  };

  const displayImplied = implied !== null ? implied * 100 : 0;
  const outcomes: Outcome[] = outcomesMeta.map((row, index) => {
    const isPrimary = row.label === primaryMeta.label && row.tokenId === primaryMeta.tokenId;
    let probability = row.price !== null ? row.price * 100 : 0;
    if (isPrimary && implied !== null) probability = implied * 100;
    if (!isPrimary && outcomesMeta.length === 2 && implied !== null) {
      probability = (1 - implied) * 100;
    }
    return {
      id: row.tokenId ?? `outcome-${index}`,
      label: row.label,
      impliedProbability: probability,
    };
  });

  const primary = outcomes.find((row) => row.label === primaryMeta.label) ?? outcomes[0];
  const title = parent?.title?.trim() || market.question?.trim() || "Untitled market";
  const question = market.question?.trim() || title;
  const resolutionDate = (market.endDate ?? parent?.endDate ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10);
  const created = market.createdAt ?? market.startDate ?? parent?.createdAt ?? parent?.startDate;
  const createdDate = created ? new Date(created) : null;
  const marketAgeDays =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? Math.max(0, Math.round((Date.now() - createdDate.getTime()) / 86_400_000))
      : 0;

  const event: EventProfile = {
    id: `live-${market.id}`,
    title,
    shortLabel: market.groupItemTitle?.trim() || primary.label,
    category: inferCategory(`${title} ${question} ${parent?.category ?? ""}`),
    resolutionDate,
    definition: market.description?.trim() || parent?.description?.trim() || question,
    resolutionCriteria:
      (market.resolutionSource ?? parent?.resolutionSource)?.trim() ||
      "Resolution criteria were not supplied by the live source beyond the market question.",
    primaryOutcomeId: primary.id,
    outcomes,
    change24hPp: change24.value,
    change7dPp: change7.value,
    change30dPp: change30.value,
    market: {
      spreadPct: spreadResolved.value,
      liquidity: liquidityResolved.value,
      volumeUsd: volumeUsd ?? 0,
      depth: depthResolved.value,
      freshnessMinutes: freshnessResolved.value,
      marketAgeDays,
      lastUpdateLabel:
        freshMin !== null ? formatFreshness(freshMin) : "Timestamp unavailable",
      participationIndex: NEUTRAL.participationIndex,
      concentrationIndex: NEUTRAL.concentrationIndex,
      volatility7dPp: vol7.value,
    },
    resolutionClarity: clarity.value,
    whatWouldChange: [
      "A material move in the live midpoint or order book",
      "Official information that bears on the stated resolution criteria",
      "A halt, close, or change in whether the market is accepting orders",
    ],
    synthetic: false,
  };

  const qualityInput: SignalQualityInput = {
    liquidity: liquidityResolved.value,
    spreadPct: spreadResolved.value,
    depth: depthResolved.value,
    freshnessMinutes: freshnessResolved.value,
    change24hPp: change24.value,
    change7dPp: change7.value,
    volatility7dPp: vol7.value,
    resolutionClarity: clarity.value,
    participationIndex: NEUTRAL.participationIndex,
    concentrationIndex: NEUTRAL.concentrationIndex,
    crossMarketDisagreementPp: NEUTRAL.crossMarketDisagreementPp,
    timeToResolutionDays: daysToResolution(resolutionDate),
  };

  const crossMarket: CrossMarketSignal = {
    eventId: event.id,
    primaryLabel: primary.label,
    primaryProbability: displayImplied,
    sources: [],
    agreement: "LOW",
    disagreementPp: 0,
    explanation:
      "Cross-market confirmation is unavailable in live mode. This branch has a single event-market source. Complementary Yes/No tokens on the same market are not independent confirmation.",
    synthetic: false,
    available: false,
  };

  return {
    event,
    qualityInput,
    provenance,
    crossMarket,
    warnings,
    depthDetail: depthDetail
      ? { ...depthDetail, bandPp: DEPTH_BAND_PP }
      : undefined,
    resolutionMetadataComplete: metadataComplete,
  };
}
