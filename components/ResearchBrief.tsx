import type { Evaluation } from "@/lib/types";
import { SectionLabel } from "./ui";

const SECTIONS: Array<{
  key: keyof Pick<
    Evaluation["brief"],
    | "pricedIn"
    | "whatChanged"
    | "whyTrust"
    | "whyCautious"
    | "crossMarket"
    | "exposures"
  >;
  label: string;
}> = [
  { key: "pricedIn", label: "What is priced in?" },
  { key: "whatChanged", label: "What changed?" },
  { key: "whyTrust", label: "Why trust the signal?" },
  { key: "whyCautious", label: "Why be cautious?" },
  { key: "crossMarket", label: "Cross-market view" },
  { key: "exposures", label: "Exposures to watch" },
];

export default function ResearchBrief({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const { brief, quality } = evaluation;

  return (
    <section className="panel mt-8 p-5 sm:p-7">
      <SectionLabel
        aside={
          evaluation.provenance.mode === "live"
            ? "Deterministic synthesis · live inputs"
            : "Deterministic synthesis · not an LLM"
        }
      >
        Research brief
      </SectionLabel>
      <p className="mt-0 mb-6 max-w-[70ch] text-[0.85rem] leading-relaxed text-muted">
        The brief is assembled from the event object, Signal Quality output,
        and cross-market comparison. It does not invent a forecast and it does
        not issue a trade.
      </p>

      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-stroke pb-4">
        <span className="font-mono text-[1.4rem] tracking-[-0.03em] tabular-nums">
          {quality.overall}
          <span className="text-[0.75rem] text-muted"> / 100</span>
        </span>
        <span className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted">
          {quality.label}
        </span>
      </div>

      <ol className="m-0 list-none space-y-6 p-0">
        {SECTIONS.map((section, index) => (
          <li key={section.key}>
            <p className="m-0 mb-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted">
              {String(index + 1).padStart(2, "0")} / {section.label}
            </p>
            <p className="m-0 max-w-[72ch] text-[0.92rem] leading-[1.65] text-ink/85">
              {brief[section.key]}
            </p>
          </li>
        ))}
        <li>
          <p className="m-0 mb-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted">
            07 / What would change the view?
          </p>
          <ul className="m-0 max-w-[72ch] list-disc space-y-1.5 pl-5 text-[0.92rem] leading-[1.6] text-ink/85">
            {brief.whatWouldChange.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      </ol>
    </section>
  );
}
