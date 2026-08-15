export default function Toolkit() {
  return (
    <section className="panel mt-8 p-5 sm:p-7">
      <h2 className="m-0 mb-6 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
        Market Structure Research Toolkit
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        <article className="border-l border-ink/30 py-1 pl-4">
          <span className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            PrivatePerp Risk Engine
          </span>
          <strong className="block text-[0.98rem] font-medium tracking-[-0.02em]">
            When should a perp stop being a perp?
          </strong>
          <p className="mt-2 mb-0 text-[0.82rem] leading-relaxed text-muted">
            Continuous margining, mark reliability, liquidation, mechanism
            switching.
          </p>
        </article>
        <article className="border-l border-ink/30 py-1 pl-4">
          <span className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            Listing Readiness Simulator
          </span>
          <strong className="block text-[0.98rem] font-medium tracking-[-0.02em]">
            What market structure can an asset support before listing?
          </strong>
          <p className="mt-2 mb-0 text-[0.82rem] leading-relaxed text-muted">
            Observability, liquidity, hedgeability, settlement, mechanism
            choice.
          </p>
        </article>
        <article className="border-l-2 border-ink py-1 pl-4">
          <span className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            Event Signal Copilot
          </span>
          <strong className="block text-[0.98rem] font-medium tracking-[-0.02em]">
            When is an event-driven market signal actually worth trusting?
          </strong>
          <p className="mt-2 mb-0 text-[0.82rem] leading-relaxed text-muted">
            Price discovery, information quality, liquidity, cross-market
            confirmation.
          </p>
        </article>
      </div>
    </section>
  );
}
