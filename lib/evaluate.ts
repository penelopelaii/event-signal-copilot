import { evaluateCrossMarket } from "./crossMarket";
import { generateBrief } from "./briefGenerator";
import { maskUnavailableEvidence, measureCoverage } from "./dataCoverage";
import { daysToResolution } from "./format";
import { syntheticProvenance } from "./provenance";
import { evaluateSignalQuality } from "./signalQualityEngine";
import type { Evaluation, EventPreset, LiveMarketPacket } from "./types";

export function evaluatePreset(
  preset: EventPreset,
  asOf = new Date(),
): Evaluation {
  const { event, crossSources, exposures } = preset;
  const primary = event.outcomes.find((row) => row.id === event.primaryOutcomeId);
  if (!primary) {
    throw new Error(`Preset ${preset.id} is missing its primary outcome.`);
  }

  const days = daysToResolution(event.resolutionDate, asOf);
  const crossMarket = evaluateCrossMarket(event, crossSources);
  const quality = evaluateSignalQuality({
    liquidity: event.market.liquidity,
    spreadPct: event.market.spreadPct,
    depth: event.market.depth,
    freshnessMinutes: event.market.freshnessMinutes,
    change24hPp: event.change24hPp,
    change7dPp: event.change7dPp,
    volatility7dPp: event.market.volatility7dPp,
    resolutionClarity: event.resolutionClarity,
    participationIndex: event.market.participationIndex,
    concentrationIndex: event.market.concentrationIndex,
    crossMarketDisagreementPp: crossMarket.disagreementPp,
    timeToResolutionDays: days,
  });
  const provenance = syntheticProvenance();
  const coverage = measureCoverage(provenance);
  const brief = generateBrief(
    event,
    primary,
    quality,
    crossMarket,
    exposures,
    provenance,
    coverage,
  );

  return {
    event,
    primary,
    daysToResolution: days,
    quality,
    crossMarket,
    exposures,
    brief,
    provenance,
    coverage,
  };
}

export function evaluateLive(
  packet: LiveMarketPacket,
  asOf = new Date(),
): Evaluation {
  const { event, qualityInput, provenance, crossMarket } = packet;
  const primary = event.outcomes.find((row) => row.id === event.primaryOutcomeId);
  if (!primary) {
    throw new Error(`Live market ${event.id} is missing its primary outcome.`);
  }

  const days = daysToResolution(event.resolutionDate, asOf);
  const rawQuality = evaluateSignalQuality({
    ...qualityInput,
    timeToResolutionDays: days,
  });
  const coverage = measureCoverage(provenance);
  const quality = maskUnavailableEvidence(rawQuality, provenance);
  const brief = generateBrief(
    event,
    primary,
    quality,
    crossMarket,
    [],
    provenance,
    coverage,
  );

  return {
    event,
    primary,
    daysToResolution: days,
    quality,
    crossMarket,
    exposures: [],
    brief,
    provenance,
    coverage,
    depthDetail: packet.depthDetail,
    resolutionMetadataComplete: packet.resolutionMetadataComplete,
  };
}
