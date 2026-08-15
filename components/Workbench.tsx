"use client";

import { useEffect, useMemo, useState } from "react";

import CrossMarketView from "@/components/CrossMarketView";
import DataModeSwitch from "@/components/DataModeSwitch";
import EventDefinition from "@/components/EventDefinition";
import EventSelector from "@/components/EventSelector";
import ExposureMap from "@/components/ExposureMap";
import FailureModes from "@/components/FailureModes";
import LiveSearch from "@/components/LiveSearch";
import MarketSignalPanel from "@/components/MarketSignalPanel";
import ResearchBrief from "@/components/ResearchBrief";
import SignalQualityPanel from "@/components/SignalQualityPanel";
import { evaluateLive, evaluatePreset } from "@/lib/evaluate";
import { fetchLiveMarket, searchLiveMarkets } from "@/lib/live/client";
import { DEFAULT_PRESET, findPreset } from "@/lib/presets";
import type { DataMode, Evaluation, LiveSearchResult } from "@/lib/types";

export default function Workbench() {
  const [mode, setMode] = useState<DataMode>("synthetic");
  const [activeId, setActiveId] = useState(DEFAULT_PRESET.id);
  const [query, setQuery] = useState("");

  const [liveQuery, setLiveQuery] = useState("");
  const [liveResults, setLiveResults] = useState<LiveSearchResult[]>([]);
  const [liveSearchLoading, setLiveSearchLoading] = useState(false);
  const [liveSearchError, setLiveSearchError] = useState<string | null>(null);
  const [liveMarketId, setLiveMarketId] = useState<string | null>(null);
  const [liveEvaluation, setLiveEvaluation] = useState<Evaluation | null>(null);
  const [liveMarketLoading, setLiveMarketLoading] = useState(false);
  const [liveMarketError, setLiveMarketError] = useState<string | null>(null);
  const [liveWarnings, setLiveWarnings] = useState<string[]>([]);

  const syntheticEvaluation = useMemo(() => {
    const preset = findPreset(activeId) ?? DEFAULT_PRESET;
    return evaluatePreset(preset);
  }, [activeId]);

  useEffect(() => {
    if (mode !== "live") return;
    const q = liveQuery.trim();
    if (q.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLiveSearchLoading(true);
      try {
        const results = await searchLiveMarkets(q);
        if (!controller.signal.aborted) {
          setLiveResults(results);
          setLiveSearchError(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLiveResults([]);
          setLiveSearchError(
            error instanceof Error
              ? error.message
              : "Live search is temporarily unavailable.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLiveSearchLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [liveQuery, mode]);

  const visibleLiveResults = liveQuery.trim().length < 2 ? [] : liveResults;
  const visibleLiveError = liveQuery.trim().length < 2 ? null : liveSearchError;

  async function handleLiveSelect(row: LiveSearchResult) {
    setLiveMarketId(row.marketId);
    setLiveMarketLoading(true);
    setLiveMarketError(null);
    try {
      const packet = await fetchLiveMarket(row.marketId, row.eventId || undefined);
      setLiveEvaluation(evaluateLive(packet));
      setLiveWarnings(packet.warnings);
    } catch (error) {
      setLiveEvaluation(null);
      setLiveWarnings([]);
      setLiveMarketError(
        error instanceof Error
          ? error.message
          : "Live market data is temporarily unavailable.",
      );
    } finally {
      setLiveMarketLoading(false);
    }
  }

  const evaluation = mode === "synthetic" ? syntheticEvaluation : liveEvaluation;

  return (
    <>
      <div className="mb-3">
        <DataModeSwitch
          mode={mode}
          onChange={(next) => {
            setMode(next);
            setLiveMarketError(null);
          }}
        />
      </div>

      {mode === "synthetic" ? (
        <EventSelector
          query={query}
          activeId={activeId}
          onQuery={setQuery}
          onSelect={setActiveId}
        />
      ) : (
        <LiveSearch
          query={liveQuery}
          results={visibleLiveResults}
          activeId={liveMarketId}
          loading={liveSearchLoading && liveQuery.trim().length >= 2}
          error={visibleLiveError}
          onQuery={setLiveQuery}
          onSelect={handleLiveSelect}
        />
      )}

      {mode === "live" && liveMarketLoading ? (
        <p className="mb-8 border-l border-ink/30 pl-3 text-[0.85rem] text-muted">
          Loading live market metadata and public order-book data…
        </p>
      ) : null}

      {mode === "live" && liveMarketError ? (
        <p className="mb-8 border-l-2 border-ink pl-3 text-[0.85rem]">
          {liveMarketError}
        </p>
      ) : null}

      {mode === "live" && liveWarnings.length > 0 && evaluation ? (
        <p className="mb-8 max-w-[72ch] border-l border-ink/30 pl-3 text-[0.8rem] text-muted">
          {liveWarnings.join(" ")}
        </p>
      ) : null}

      {evaluation ? (
        <>
          <EventDefinition evaluation={evaluation} />
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <MarketSignalPanel evaluation={evaluation} />
            <SignalQualityPanel evaluation={evaluation} />
          </div>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <FailureModes evaluation={evaluation} />
            <CrossMarketView evaluation={evaluation} />
          </div>
          <ExposureMap evaluation={evaluation} />
          <ResearchBrief evaluation={evaluation} />
        </>
      ) : mode === "live" ? (
        <p className="mb-8 max-w-[68ch] text-[0.9rem] leading-relaxed text-muted">
          Select a live market to run the existing Signal Quality Engine on
          normalized public data. Missing fields stay marked unavailable.
        </p>
      ) : null}
    </>
  );
}
