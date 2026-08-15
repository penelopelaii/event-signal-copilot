import { encodeQuery, publicGet } from "./http";
import type { ClobBook, ClobMidpoint, ClobPriceHistory, ClobSpread } from "./types";

const CLOB = "https://clob.polymarket.com";

/** Book / midpoint / spread should feel current without polling every render. */
const BOOK_REVALIDATE_SECONDS = 15;
const HISTORY_REVALIDATE_SECONDS = 120;

export async function fetchBook(tokenId: string): Promise<ClobBook> {
  const qs = encodeQuery({ token_id: tokenId });
  return publicGet<ClobBook>(`${CLOB}/book?${qs}`, BOOK_REVALIDATE_SECONDS);
}

export async function fetchMidpoint(tokenId: string): Promise<ClobMidpoint> {
  const qs = encodeQuery({ token_id: tokenId });
  return publicGet<ClobMidpoint>(`${CLOB}/midpoint?${qs}`, BOOK_REVALIDATE_SECONDS);
}

export async function fetchSpread(tokenId: string): Promise<ClobSpread> {
  const qs = encodeQuery({ token_id: tokenId });
  return publicGet<ClobSpread>(`${CLOB}/spread?${qs}`, BOOK_REVALIDATE_SECONDS);
}

export async function fetchPriceHistory(
  tokenId: string,
  lookbackDays = 30,
): Promise<ClobPriceHistory> {
  const startTs = Math.floor(Date.now() / 1000) - lookbackDays * 86_400;
  const qs = encodeQuery({
    market: tokenId,
    startTs,
    fidelity: 60,
  });
  return publicGet<ClobPriceHistory>(
    `${CLOB}/prices-history?${qs}`,
    HISTORY_REVALIDATE_SECONDS,
  );
}
