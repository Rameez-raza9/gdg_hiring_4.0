import { NextResponse } from "next/server";
import { releaseAtMs } from "@/lib/release";
import type { ResultEntry } from "@/lib/teams";
// SERVER ONLY: never import this file's data from a client component.
import raw from "@/data/results.json";

export const dynamic = "force-dynamic";

const results = raw as ResultEntry[];
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");

let index: Map<string, ResultEntry> | null = null;
const lookup = () => {
  if (!index) index = new Map(results.map((r) => [norm(r.email), r]));
  return index;
};

// Best-effort rate limit (per server instance).
const hits = new Map<string, { n: number; t: number }>();
const limited = (ip: string) => {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > 20;
};

export async function POST(req: Request) {
  const releaseAt = releaseAtMs();

  // 1. Time gate, checked on the server. Nothing is returned before release.
  if (Date.now() < releaseAt) {
    return NextResponse.json({ locked: true, releaseAt, now: Date.now() }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many tries. Wait a minute and try again." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as { email?: string; roll?: string } | null;
  if (!body?.email || !body?.roll) {
    return NextResponse.json({ error: "Enter your email and roll number." }, { status: 400 });
  }

  // 2. Both email AND roll number must match. If no match, return "Not selected".
  const entry = lookup().get(norm(body.email));
  if (!entry || norm(entry.roll) !== norm(body.roll)) {
    return NextResponse.json(
      { name: entry?.name || "", outcome: "Not selected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // 3. Only this person's own result is returned.
  const { name, outcome } = entry;
  return NextResponse.json({ name, outcome }, { headers: { "Cache-Control": "no-store" } });
}
