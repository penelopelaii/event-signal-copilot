import type { DataMode } from "@/lib/types";

export default function DataModeSwitch({
  mode,
  onChange,
}: {
  mode: DataMode;
  onChange: (mode: DataMode) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5">
      {(
        [
          ["synthetic", "Synthetic"],
          ["live", "Live"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={`cursor-pointer border px-3 py-1.5 text-[0.78rem] transition-colors ${
            mode === value
              ? "border-ink bg-ink text-panel"
              : "border-stroke bg-panel text-muted hover:border-ink hover:text-ink"
          }`}
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
