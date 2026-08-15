import type { Evaluation } from "@/lib/types";
import { SectionLabel } from "./ui";

export default function ExposureMap({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const { exposures, primary } = evaluation;

  return (
    <section className="panel mt-8 p-5 sm:p-7">
      <SectionLabel aside="Analytical, not advisory">
        Exposures to watch
      </SectionLabel>
      <p className="mt-0 mb-5 max-w-[70ch] text-[0.85rem] leading-relaxed text-muted">
        If “{primary.label}” becomes more likely, these are the financial
        objects most often cited as sensitive. Directional notes are structural
        associations. They are not recommendations to buy, sell, or size a
        position.
      </p>

      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7">
        <table className="w-full min-w-[640px] border-collapse text-left text-[0.82rem]">
          <thead>
            <tr className="border-b border-ink/15 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
              <th className="py-2.5 pr-3 font-medium">Exposure</th>
              <th className="py-2.5 pr-3 font-medium">Sensitivity</th>
              <th className="py-2.5 pr-3 font-medium">If primary becomes more likely</th>
              <th className="py-2.5 font-medium">Relevance</th>
            </tr>
          </thead>
          <tbody>
            {exposures.map((row) => (
              <tr key={row.id} className="align-top border-b border-stroke">
                <td className="py-3.5 pr-3 font-medium whitespace-nowrap">
                  {row.name}
                </td>
                <td className="py-3.5 pr-3 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-muted">
                  {row.sensitivity}
                </td>
                <td className="py-3.5 pr-3 text-muted">{row.ifMoreLikely}</td>
                <td className="py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-muted">
                  {row.relevance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
