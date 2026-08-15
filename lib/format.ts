export function clamp(value: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, value));
}

export function roundScore(value: number): number {
  return Math.round(clamp(value));
}

export function formatPct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatImpliedPct(value: number): string {
  if (value > 0 && value < 1) return formatPct(value, 2);
  if (value < 10) return formatPct(value, 1);
  return formatPct(value, 0);
}

export function formatPp(value: number, digits = 0): string {
  const rounded = Number(value.toFixed(digits));
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(digits)}pp`;
}

export function formatUsdCompact(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function parseInstant(isoDate: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return new Date(`${isoDate}T00:00:00Z`);
  }
  return new Date(isoDate);
}

export function daysToResolution(isoDate: string, asOf = new Date()): number {
  const ms = parseInstant(isoDate).getTime() - asOf.getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function formatDays(days: number): string {
  if (days === 0) return "Same day";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function formatDate(isoDate: string): string {
  const date = parseInstant(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatFreshness(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 48) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}
