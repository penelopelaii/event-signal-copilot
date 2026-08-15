import { SEVERITY_LABELS } from "@/lib/labels";
import type { Evaluation, FailureSeverity } from "@/lib/types";
import { SectionLabel } from "./ui";

const TONE: Record<FailureSeverity, string> = {
  binding: "border-l-2 border-ink bg-inset",
  elevated: "border-l-2 border-warn",
  watch: "border-l border-stroke",
};

export default function FailureModes({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const modes = evaluation.quality.failureModes;

  return (
    <section className="panel p-5 sm:p-7">
      <SectionLabel aside="Structural annotations">
        Why this signal may be wrong
      </SectionLabel>
      <p className="mt-0 mb-5 max-w-[68ch] text-[0.85rem] leading-relaxed text-muted">
        Failure modes are research annotations, not trade flags. They describe
        how a quoted probability can fail as information even when the number
        looks precise.
      </p>

      {modes.length === 0 ? (
        <p className="m-0 border-l border-stroke py-2 pl-3 text-[0.85rem] text-muted">
          No binding structural failure modes under these synthetic assumptions.
          That is not evidence that the implied probability is correct.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {modes.map((mode) => (
            <li key={mode.id} className={`px-3 py-2.5 ${TONE[mode.severity]}`}>
              <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span>
                  <span className="mr-2 font-mono text-[0.72rem] text-ink">
                    {mode.code}
                  </span>
                  <strong className="font-medium">{mode.title}</strong>
                </span>
                <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                  {SEVERITY_LABELS[mode.severity]}
                </span>
              </span>
              <span className="mt-1 block max-w-[68ch] text-[0.78rem] leading-relaxed text-muted">
                {mode.detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
