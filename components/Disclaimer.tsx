export default function Disclaimer() {
  return (
    <section className="panel mt-8 p-5 sm:p-7">
      <h2 className="m-0 mb-4 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
        Disclaimer
      </h2>
      <div className="max-w-[74ch] space-y-3 text-[0.82rem] leading-relaxed text-muted">
        <p className="m-0">
          This is a research prototype. Signal Quality scores are synthetic and
          not empirically calibrated. Event probabilities in v1 come from
          synthetic presets; later versions may attach external market sources
          through server-side adapters.
        </p>
        <p className="m-0">
          This product does not predict outcomes. It does not execute trades.
          It does not provide investment advice. Nothing here is a
          recommendation to buy, sell, or hold any instrument.
        </p>
        <p className="m-0">
          Market signals may be noisy, illiquid, manipulated, stale, or
          structurally unreliable. A quoted probability can be precise and
          still fail as information.
        </p>
      </div>
    </section>
  );
}
