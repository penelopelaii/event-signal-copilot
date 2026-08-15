export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

const DEFAULT_TIMEOUT_MS = 8_000;

export async function publicGet<T>(
  url: string,
  revalidateSeconds: number,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "force-cache",
      next: { revalidate: revalidateSeconds },
      signal: controller.signal,
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) {
      throw new UpstreamError(
        `Upstream returned ${response.status}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof UpstreamError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new UpstreamError("Upstream request timed out");
    }
    throw new UpstreamError("Upstream request failed");
  } finally {
    clearTimeout(timer);
  }
}

export function encodeQuery(params: Record<string, string | number | boolean>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return search.toString();
}
