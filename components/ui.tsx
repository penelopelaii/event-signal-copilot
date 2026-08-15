import { originLabel } from "@/lib/provenance";
import type { DataOrigin } from "@/lib/types";
import type { ReactNode } from "react";

export function SectionLabel({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 className="m-0 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">
        {children}
      </h2>
      {aside ? (
        <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
          {aside}
        </span>
      ) : null}
    </div>
  );
}

export function ProvenanceMark({ origin }: { origin?: DataOrigin }) {
  if (!origin) return null;
  return (
    <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">
      {originLabel(origin)}
    </span>
  );
}

export function ScoreBar({
  label,
  value,
  origin,
}: {
  label: string;
  value: number;
  origin?: DataOrigin;
}) {
  return (
    <li className="grid grid-cols-[minmax(7.2rem,1fr)_minmax(0,2fr)_2.4rem] items-center gap-3 py-1.5 text-[0.8rem] sm:text-[0.85rem]">
      <span className="leading-tight">
        {label}
        {origin ? (
          <span className="mt-0.5 block font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">
            {originLabel(origin)}
          </span>
        ) : null}
      </span>
      <span className="h-1 overflow-hidden bg-stroke">
        <span
          className="block h-full bg-ink"
          style={{ width: origin === "unavailable" ? "0%" : `${value}%` }}
        />
      </span>
      <span className="text-right font-mono text-xs tabular-nums text-muted">
        {origin === "unavailable" ? "—" : value}
      </span>
    </li>
  );
}

export function Metric({
  label,
  value,
  hint,
  origin,
}: {
  label: string;
  value: string;
  hint?: string;
  origin?: DataOrigin;
}) {
  return (
    <div className="flex flex-col gap-1 border border-stroke bg-panel px-3.5 py-3">
      <span className="flex items-baseline justify-between gap-2 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
        <span>{label}</span>
        <ProvenanceMark origin={origin} />
      </span>
      <span className="font-mono text-[1.15rem] tracking-[-0.03em] tabular-nums">
        {value}
      </span>
      {hint ? (
        <span className="text-[0.68rem] leading-snug text-muted">{hint}</span>
      ) : null}
    </div>
  );
}
