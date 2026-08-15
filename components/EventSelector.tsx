import { PRESETS, searchPresets } from "@/lib/presets";
import type { EventPreset } from "@/lib/types";

interface Props {
  query: string;
  activeId: string;
  onQuery: (value: string) => void;
  onSelect: (id: string) => void;
}

export default function EventSelector({
  query,
  activeId,
  onQuery,
  onSelect,
}: Props) {
  const matches = searchPresets(query);
  const active = PRESETS.find((preset) => preset.id === activeId);

  return (
    <section className="panel mb-8 p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="m-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
          Event selector
        </h2>
        <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
          Synthetic presets
        </span>
      </div>

      <label className="mb-4 block">
        <span className="sr-only">Search events</span>
        <input
          type="search"
          value={query}
          placeholder="Search events, categories, outcomes"
          onChange={(event) => onQuery(event.target.value)}
          autoComplete="off"
        />
      </label>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {matches.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`cursor-pointer border px-3 py-1.5 text-[0.78rem] transition-colors ${
              activeId === preset.id
                ? "border-ink bg-ink text-panel"
                : "border-stroke bg-panel text-muted hover:border-ink hover:text-ink"
            }`}
            onClick={() => onSelect(preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {matches.length === 0 ? (
        <p className="m-0 text-[0.85rem] text-muted">
          No presets match that query. Clear the search to see the full set.
        </p>
      ) : (
        <PresetNote preset={active} />
      )}
    </section>
  );
}

function PresetNote({ preset }: { preset: EventPreset | undefined }) {
  if (!preset) return null;
  return (
    <p className="m-0 max-w-[72ch] border-l border-ink/30 pl-3 text-[0.82rem] leading-relaxed text-muted">
      {preset.blurb}
    </p>
  );
}
