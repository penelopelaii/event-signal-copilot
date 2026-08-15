import { searchEvents } from "@/lib/live/polymarket/gamma";
import { UpstreamError } from "@/lib/live/polymarket/http";
import { flattenSearchResults } from "@/lib/live/polymarket/search";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return NextResponse.json(
      { error: "Enter at least two characters to search." },
      { status: 400 },
    );
  }

  try {
    const events = await searchEvents(query);
    return NextResponse.json({ results: flattenSearchResults(events) });
  } catch (error) {
    const status = error instanceof UpstreamError ? (error.status ?? 502) : 502;
    const message =
      error instanceof UpstreamError
        ? error.message
        : "Live search is temporarily unavailable.";
    return NextResponse.json({ error: message }, { status: status >= 400 ? status : 502 });
  }
}
