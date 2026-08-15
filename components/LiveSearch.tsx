import { formatDate, formatImpliedPct, formatUsdCompact } from "@/lib/format";
import type { LiveSearchResult } from "@/lib/types";

interface Props {
  query: string;
  results: LiveSearchResult[];
  activeId: string | null;
  loading: boolean;
  error: string | null;
  onQuery: (value: string) => void;
  onSelect: (row: LiveSearchResult) => void;
}

export default function LiveSearch({
  query,
  results,
  activeId,
  loading,
  error,
  onQuery,
  onSelect,
}: Props) {
  return (
    <section className="panel mb-8 p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="m-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
          Live event search
        </h2>
        <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
          External event market · read-only
        </span>
      </div>

      <label className="mb-4 block">
        <span className="sr-only">Search live events</span>
        <input
          type="search"
          value={query}
          placeholder="Search live events — Fed, election, ETF, recession"
          onChange={(event) => onQuery(event.target.value)}
          autoComplete="off"
        />
      </label>

      {loading ? (
        <p className="m-0 text-[0.85rem] text-muted">Searching live markets…</p>
      ) : error ? (
        <p className="m-0 border-l-2 border-ink pl-3 text-[0.85rem] text-ink">
          {error}
        </p>
      ) : query.trim().length < 2 ? (
        <p className="m-0 max-w-[68ch] text-[0.85rem] text-muted">
          Enter a query to search active event markets. Synthetic presets remain
          available in Synthetic mode and do not require a network.
        </p>
      ) : results.length === 0 ? (
        <p className="m-0 text-[0.85rem] text-muted">
          No active markets matched that query.
        </p>
      ) : (
        <ul className="m-0 list-none divide-y divide-stroke p-0">
          {results.map((row) => {
            const active = activeId === row.marketId;
            return (
              <li key={row.marketId}>
                <button
                  type="button"
                  className={`w-full cursor-pointer px-0 py-3 text-left transition-colors ${
                    active ? "bg-inset" : "hover:bg-inset/60"
                  }`}
                  onClick={() => onSelect(row)}
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-[0.92rem] font-medium tracking-[-0.02em]">
                      {row.question}
                    </span>
                    <span className="font-mono text-[0.85rem] tabular-nums">
                      {row.impliedProbability === null
                        ? "—"
                        : formatImpliedPct(row.impliedProbability)}
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-muted">
                    {row.eventTitle}
                    {row.endDate ? ` · ${formatDate(row.endDate)}` : ""}
                    {row.closed ? " · Closed" : row.active ? " · Active" : ""}
                    {row.liquidityUsd !== null
                      ? ` · Liq ${formatUsdCompact(row.liquidityUsd)}`
                      : row.volumeUsd !== null
                        ? ` · Vol ${formatUsdCompact(row.volumeUsd)}`
                        : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
