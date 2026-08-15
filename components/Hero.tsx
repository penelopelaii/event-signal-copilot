export default function Hero() {
  return (
    <header className="mb-10 border-b border-stroke pb-10 sm:mb-14 sm:pb-12">
      <p className="m-0 mb-4 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted">
        Research prototype &middot; synthetic data only
      </p>
      <h1 className="m-0 mb-5 text-[2rem] leading-[1.08] tracking-[-0.035em] font-medium sm:text-[2.55rem] sm:leading-[1.1]">
        Event Signal Copilot
      </h1>
      <p className="m-0 max-w-[58ch] text-[1.02rem] leading-[1.6] text-muted sm:text-[1.08rem]">
        A research prototype for evaluating when event-driven market signals
        are decision-useful.
      </p>
      <blockquote className="mt-8 mb-0 max-w-[62ch] border-l-2 border-ink pl-5">
        <p className="m-0 text-[1.02rem] leading-[1.6] tracking-[0.005em] text-ink">
          A probability is not automatically a reliable signal.
        </p>
      </blockquote>
      <p className="mt-5 mb-0 max-w-[62ch] text-[0.92rem] leading-[1.6] text-muted">
        The market already produced a probability. The harder question is
        whether that probability deserves to be trusted.
      </p>
    </header>
  );
}
