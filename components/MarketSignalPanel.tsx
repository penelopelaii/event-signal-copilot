import { DEPTH_LABELS, LIQUIDITY_LABELS } from "@/lib/labels";
import {
  formatDays,
  formatFreshness,
  formatImpliedPct,
  formatPp,
  formatUsdCompact,
} from "@/lib/format";
import type { Evaluation } from "@/lib/types";
import { Metric, SectionLabel } from "./ui";

export default function MarketSignalPanel({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const { event, primary, daysToResolution, provenance, depthDetail } = evaluation;
  const fields = provenance.fields;
  const ranked = [...event.outcomes].sort(
    (a, b) => b.impliedProbability - a.impliedProbability,
  );

  return (
    <section className="panel p-5 sm:p-7">
      <SectionLabel
        aside={
          provenance.mode === "live"
            ? "Live and derived market fields"
            : "Synthetic market fields"
        }
      >
        Market-implied view
      </SectionLabel>

      <p className="mt-0 mb-5 max-w-[62ch] text-[0.82rem] leading-relaxed text-muted">
        Event-implied probability is what the market currently compresses into
        a number. It is not, by itself, a quality judgment.
      </p>

      <h3 className="mb-3 mt-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
        Event-implied probability
      </h3>
      <ul className="mb-6 list-none p-0">
        {ranked.map((outcome) => {
          const active = outcome.id === primary.id;
          return (
            <li
              key={outcome.id}
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-stroke py-2.5 text-[0.88rem] last:border-b-0 ${
                active ? "font-medium" : "text-muted"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-[7.5rem] shrink-0 sm:w-40">{outcome.label}</span>
                <span className="h-1 min-w-0 flex-1 overflow-hidden bg-stroke">
                  <span
                    className={`block h-full ${active ? "bg-ink" : "bg-ink/35"}`}
                    style={{ width: `${outcome.impliedProbability}%` }}
                  />
                </span>
              </span>
              <span className="font-mono tabular-nums text-ink">
                {formatImpliedPct(outcome.impliedProbability)}
                {active && fields.impliedProbability ? (
                  <span className="ml-2 font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">
                    {fields.impliedProbability.origin}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>

      <h3 className="mb-3 mt-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
        Market context
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Metric
          label="7d change"
          value={
            fields.change7d?.origin === "unavailable"
              ? "Unavailable"
              : formatPp(event.change7dPp)
          }
          hint={
            fields.change24h?.origin === "unavailable"
              ? "24h / 30d history unavailable"
              : `24h ${formatPp(event.change24hPp)} · 30d ${formatPp(event.change30dPp)}`
          }
          origin={fields.change7d?.origin}
        />
        <Metric
          label="Spread"
          value={
            fields.spread?.origin === "unavailable"
              ? "Unavailable"
              : `${event.market.spreadPct.toFixed(1)}%`
          }
          hint={fields.spread?.note ?? "Quoted width"}
          origin={fields.spread?.origin}
        />
        <Metric
          label="Liquidity"
          value={
            fields.liquidity?.origin === "unavailable"
              ? "Unavailable"
              : LIQUIDITY_LABELS[event.market.liquidity]
          }
          hint={
            fields.volume?.origin === "unavailable"
              ? "Volume unavailable"
              : `${formatUsdCompact(event.market.volumeUsd)} volume`
          }
          origin={fields.liquidity?.origin}
        />
        <Metric
          label="Depth"
          value={
            fields.depth?.origin === "unavailable"
              ? "Unavailable"
              : DEPTH_LABELS[event.market.depth]
          }
          hint={
            depthDetail
              ? `Two-way notional ${formatUsdCompact(depthDetail.twoWayNotionalDepth)} within ±${depthDetail.bandPp}pp (thinner side)`
              : (fields.depth?.note ?? "Size without moving the quote")
          }
          origin={fields.depth?.origin}
        />
        <Metric
          label="Time to resolution"
          value={formatDays(daysToResolution)}
          hint={`Market age ${event.market.marketAgeDays}d`}
        />
        <Metric
          label="Freshness"
          value={
            fields.freshness?.origin === "unavailable"
              ? "Unavailable"
              : formatFreshness(event.market.freshnessMinutes)
          }
          hint={event.market.lastUpdateLabel}
          origin={fields.freshness?.origin}
        />
      </div>
    </section>
  );
}
