import { NextResponse } from "next/server";
import { releaseAtMs } from "@/lib/release";

export const dynamic = "force-dynamic";

// The browser uses this to sync its countdown to the SERVER clock.
export function GET() {
  return NextResponse.json(
    { now: Date.now(), releaseAt: releaseAtMs() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
