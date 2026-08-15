import { CATEGORY_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import type { Evaluation } from "@/lib/types";
import { SectionLabel } from "./ui";

export default function EventDefinition({ evaluation }: { evaluation: Evaluation }) {
  const { event, primary, daysToResolution, provenance } = evaluation;

  return (
    <section className="panel mb-8 p-5 sm:p-7">
      <SectionLabel aside="Event definition">What is the event?</SectionLabel>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="m-0 text-[1.35rem] font-medium tracking-[-0.03em] leading-tight sm:text-[1.5rem]">
            {event.title}
          </h3>
          <p className="mt-2 mb-0 font-mono text-[0.72rem] tracking-[0.1em] uppercase text-muted">
            {CATEGORY_LABELS[event.category]}
          </p>
        </div>
        <div className="text-right">
          <p className="m-0 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Resolution
          </p>
          <p className="mt-1 mb-0 font-mono text-[0.95rem] tabular-nums">
            {formatDate(event.resolutionDate)}
          </p>
          <p className="mt-0.5 mb-0 text-[0.72rem] text-muted">
            {daysToResolution} day{daysToResolution === 1 ? "" : "s"} remaining
          </p>
        </div>
      </div>

      <p className="mt-0 mb-4 max-w-[74ch] text-[0.92rem] leading-[1.65] text-ink/85">
        {event.definition}
      </p>
      <p className="mt-0 mb-6 max-w-[74ch] text-[0.82rem] leading-relaxed text-muted">
        <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase">
          Resolution criteria.
        </span>{" "}
        {event.resolutionCriteria}
      </p>

      <div className="grid gap-px bg-stroke sm:grid-cols-3">
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Primary outcome
          </p>
          <p className="m-0 text-[0.95rem] font-medium">{primary.label}</p>
        </div>
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Outcome space
          </p>
          <p className="m-0 text-[0.95rem]">
            {event.outcomes.map((row) => row.label).join(" · ")}
          </p>
        </div>
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Source
          </p>
          <p className="m-0 text-[0.95rem]">{provenance.sourceLabel}</p>
        </div>
      </div>
    </section>
  );
}
