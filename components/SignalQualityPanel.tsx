import { QUALITY_COPY, SUBSCORE_META } from "@/lib/labels";
import type { Evaluation } from "@/lib/types";
import { ScoreBar, SectionLabel } from "./ui";

export default function SignalQualityPanel({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const { quality, provenance, coverage } = evaluation;
  const fieldOrigin = (key: string) => provenance.fields[key]?.origin;

  return (
    <section className="panel-focus p-5 sm:p-7">
      <SectionLabel aside="Deterministic engine">Signal quality</SectionLabel>

      <div className="mb-5 bg-ink px-4 py-4 text-panel sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <p className="m-0 mb-2 font-mono text-[0.65rem] tracking-[0.12em] uppercase text-white/55">
              Overall · synthetic 0–100
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[2.4rem] font-medium tracking-[-0.04em] leading-none sm:text-[2.6rem]">
                {quality.overall}
              </span>
              <span className="text-[0.8rem] text-white/60">/ 100</span>
            </div>
          </div>
          <span className="border border-white/25 px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.08em] uppercase text-white/80">
            {quality.label}
          </span>
        </div>
      </div>

      <div className="mb-5 grid gap-px bg-stroke sm:grid-cols-2">
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Data coverage
          </p>
          <p className="m-0 font-mono text-[1.35rem] tracking-[-0.03em] tabular-nums">
            {coverage.dataCoverage}%
          </p>
          <p className="mt-1 mb-0 text-[0.72rem] text-muted">
            {coverage.coverageLabel} · {coverage.observedCount}/{coverage.expectedCount} dimensions
          </p>
        </div>
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Evidence status
          </p>
          <p className="m-0 text-[1.05rem] font-medium tracking-[-0.02em]">
            {coverage.isProvisional ? "Provisional" : "Complete"}
          </p>
          <p className="mt-1 mb-0 text-[0.72rem] text-muted">
            {coverage.isProvisional
              ? "The score is the model output from currently available evidence. Missing dimensions are not treated as observed."
              : "Every scored dimension has specified evidence."}
          </p>
        </div>
      </div>

      <p className="mt-0 mb-5 max-w-[62ch] text-[0.9rem] leading-[1.6] text-ink/80">
        {quality.summary} {QUALITY_COPY[quality.label]}
      </p>

      <p className="mt-0 mb-3 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
        Thresholds are synthetic and not empirically calibrated
      </p>

      <ul className="mb-6 list-none p-0">
        {SUBSCORE_META.map((row) => (
          <ScoreBar
            key={row.key}
            label={row.label}
            value={quality.subscores[row.key]}
            origin={fieldOrigin(row.key)}
          />
        ))}
      </ul>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 mt-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
            Supporting
          </h3>
          {quality.supporting.length > 0 ? (
            <ul className="m-0 list-none space-y-2 p-0">
              {quality.supporting.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-ink bg-inset px-3 py-2 text-[0.78rem] leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 border-l border-stroke px-3 py-2 text-[0.78rem] text-muted">
              No sub-score currently clears the supporting threshold.
            </p>
          )}
        </div>
        <div>
          <h3 className="mb-2 mt-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
            Weakening
          </h3>
          {quality.weakening.length > 0 ? (
            <ul className="m-0 list-none space-y-2 p-0">
              {quality.weakening.map((item) => (
                <li
                  key={item}
                  className="border-l border-ink/40 px-3 py-2 text-[0.78rem] leading-relaxed text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 border-l border-stroke px-3 py-2 text-[0.78rem] text-muted">
              No sub-score currently sits in the weakening band.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
