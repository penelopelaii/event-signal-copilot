import { QUALITY_THRESHOLDS } from "@/lib/signalQualityEngine";

export default function Methodology() {
  return (
    <section className="panel mt-8 p-5 sm:p-7">
      <h2 className="m-0 mb-6 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
        Methodology
      </h2>

      <h3 className="mb-3 mt-0 text-[1.05rem] font-medium tracking-[-0.02em]">
        Signal Quality is synthetic
      </h3>
      <p className="mt-0 mb-4 max-w-[70ch] text-[0.92rem] leading-[1.65] text-muted">
        The engine is not a probability forecasting model. It does not attempt
        to predict whether the event will occur. It evaluates whether the
        market-produced signal appears structurally informative given liquidity,
        spread, depth, freshness, stability, resolution clarity, participation,
        and cross-market confirmation.
      </p>
      <p className="mt-0 mb-6 max-w-[70ch] border-l-2 border-ink pl-4 text-[0.95rem] leading-[1.6] text-ink">
        Outcome probability is not signal quality. A market can show 80% while
        still being a weak signal if liquidity is poor, the spread is wide, or
        the resolution criteria are ambiguous.
      </p>

      <h3 className="mb-3 mt-0 text-[1.05rem] font-medium tracking-[-0.02em]">
        What is scored
      </h3>
      <ul className="mt-0 mb-6 max-w-[70ch] list-disc space-y-2 pl-5 text-[0.92rem] leading-[1.6] text-muted">
        <li>
          <span className="text-ink">Liquidity.</span> How much real two-way
          activity exists.
        </li>
        <li>
          <span className="text-ink">Spread.</span> How tight the market is
          relative to the quoted probability.
        </li>
        <li>
          <span className="text-ink">Depth.</span> Whether meaningful size can
          trade without moving the probability too far.
        </li>
        <li>
          <span className="text-ink">Freshness.</span> How recently the market
          appears to have incorporated information.
        </li>
        <li>
          <span className="text-ink">Stability.</span> Whether the path looks
          orderly or chaotically repriced.
        </li>
        <li>
          <span className="text-ink">Resolution clarity.</span> Whether the
          event is objectively resolvable.
        </li>
        <li>
          <span className="text-ink">Cross-market confirmation.</span> Whether
          other sources broadly agree — without treating agreement as truth.
        </li>
        <li>
          <span className="text-ink">Participation.</span> A synthetic proxy
          for breadth versus concentration.
        </li>
      </ul>

      <h3 className="mb-3 mt-0 text-[1.05rem] font-medium tracking-[-0.02em]">
        Labels
      </h3>
      <p className="mt-0 mb-4 max-w-[70ch] text-[0.82rem] leading-relaxed text-muted">
        Bands below are research heuristics for this prototype. They are not
        calibrated to historical hit rates.
      </p>
      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7">
        <table className="mb-2 w-full min-w-[420px] border-collapse text-left text-[0.82rem]">
          <thead>
            <tr className="border-b border-ink/15 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
              <th className="py-2.5 pr-3 font-medium">Score</th>
              <th className="py-2.5 font-medium">Label</th>
            </tr>
          </thead>
          <tbody>
            {QUALITY_THRESHOLDS.map((row) => (
              <tr key={row.label} className="border-b border-stroke">
                <td className="py-2.5 pr-3 font-mono tabular-nums">
                  {row.min}–{row.max}
                </td>
                <td className="py-2.5">{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
