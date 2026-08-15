import { composeLiveMarket } from "@/lib/live/polymarket/compose";
import { UpstreamError } from "@/lib/live/polymarket/http";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = params.get("id")?.trim() ?? "";
  const eventId = params.get("eventId")?.trim() || undefined;

  if (!id) {
    return NextResponse.json({ error: "A market id is required." }, { status: 400 });
  }

  try {
    const packet = await composeLiveMarket(id, eventId);
    return NextResponse.json(packet);
  } catch (error) {
    const status = error instanceof UpstreamError ? (error.status ?? 502) : 502;
    const message =
      error instanceof UpstreamError
        ? error.message
        : "Live market data is temporarily unavailable.";
    return NextResponse.json({ error: message }, { status: status >= 400 && status < 600 ? status : 502 });
  }
}
