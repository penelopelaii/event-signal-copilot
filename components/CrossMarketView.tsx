import { AGREEMENT_LABELS } from "@/lib/labels";
import { formatPct } from "@/lib/format";
import type { Evaluation } from "@/lib/types";
import { SectionLabel } from "./ui";

export default function CrossMarketView({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const { crossMarket, primary } = evaluation;
  const rows = [
    {
      id: "event",
      label: "Event-implied probability",
      probability: crossMarket.primaryProbability,
      note: `Primary outcome: ${primary.label}`,
    },
    ...crossMarket.sources,
  ];
  const max = Math.max(...rows.map((row) => row.probability), 1);

  return (
    <section className="panel p-5 sm:p-7">
      <SectionLabel aside="Disagreement, not a winner">
        Cross-market view
      </SectionLabel>
      <p className="mt-0 mb-5 max-w-[68ch] text-[0.85rem] leading-relaxed text-muted">
        Secondary sources are synthetic in v1. The point is to expose whether
        other markets and data objects rhyme with the event-implied reading —
        not to declare one of them correct.
      </p>

      <div className="mb-5 grid gap-px bg-stroke sm:grid-cols-2">
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Agreement
          </p>
          <p className="m-0 font-mono text-[1.35rem] tracking-[-0.03em]">
            {AGREEMENT_LABELS[crossMarket.agreement]}
          </p>
        </div>
        <div className="bg-panel px-4 py-3">
          <p className="m-0 mb-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
            Disagreement
          </p>
          <p className="m-0 font-mono text-[1.35rem] tracking-[-0.03em] tabular-nums">
            {crossMarket.disagreementPp}pp
          </p>
        </div>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7">
        <table className="mb-5 w-full min-w-[520px] border-collapse text-left text-[0.82rem]">
          <thead>
            <tr className="border-b border-ink/15 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
              <th className="py-2.5 pr-3 font-medium">Source</th>
              <th className="py-2.5 pr-3 font-medium">Implied</th>
              <th className="py-2.5 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={`align-top border-b border-stroke ${
                  index === 0 ? "bg-inset" : ""
                }`}
              >
                <td
                  className={`py-3 pr-3 whitespace-nowrap ${
                    index === 0 ? "border-l-2 border-ink pl-2.5 font-medium" : ""
                  }`}
                >
                  {row.label}
                </td>
                <td className="py-3 pr-3">
                  <span className="mb-1.5 block font-mono tabular-nums">
                    {formatPct(row.probability)}
                  </span>
                  <span className="block h-1 w-28 overflow-hidden bg-stroke sm:w-36">
                    <span
                      className="block h-full bg-ink"
                      style={{ width: `${(row.probability / max) * 100}%` }}
                    />
                  </span>
                </td>
                <td className="py-3 text-[0.78rem] text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="m-0 max-w-[70ch] border-l-2 border-ink pl-4 text-[0.9rem] leading-[1.6]">
        {crossMarket.explanation}
      </p>
    </section>
  );
}
