"use client";

import { useMemo, useState } from "react";

import CrossMarketView from "@/components/CrossMarketView";
import EventDefinition from "@/components/EventDefinition";
import EventSelector from "@/components/EventSelector";
import ExposureMap from "@/components/ExposureMap";
import FailureModes from "@/components/FailureModes";
import MarketSignalPanel from "@/components/MarketSignalPanel";
import ResearchBrief from "@/components/ResearchBrief";
import SignalQualityPanel from "@/components/SignalQualityPanel";
import { evaluatePreset } from "@/lib/evaluate";
import { DEFAULT_PRESET, findPreset } from "@/lib/presets";

export default function Workbench() {
  const [activeId, setActiveId] = useState(DEFAULT_PRESET.id);
  const [query, setQuery] = useState("");

  const evaluation = useMemo(() => {
    const preset = findPreset(activeId) ?? DEFAULT_PRESET;
    return evaluatePreset(preset);
  }, [activeId]);

  return (
    <>
      <EventSelector
        query={query}
        activeId={activeId}
        onQuery={setQuery}
        onSelect={setActiveId}
      />
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
  );
}
