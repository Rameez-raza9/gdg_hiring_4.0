"use client";

import Link from "next/link";
import { G } from "@/lib/brand";
import { split, useRelease } from "@/components/results/use-release";

/** Slim banner for the top of the home page: ticks down, then says results are live. */
export default function ReleaseBanner() {
  const { remaining } = useRelease();
  if (remaining === null) return null;

  const live = remaining <= 0;
  const t = split(remaining);
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock = `${t.days > 0 ? `${t.days}d ` : ""}${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;

  return (
    <Link
      href="/results"
      className="flex items-center justify-center gap-3 border-b border-border bg-card px-4 py-2.5 text-sm transition hover:bg-card/70"
    >
      <span className="size-2 animate-pulse rounded-full" style={{ background: live ? G.green : G.yellow }} aria-hidden="true" />
      {live ? (
        <span>GDG 4.0 results are live. <span className="underline underline-offset-4">See yours</span></span>
      ) : (
        <span>
          GDG 4.0 results drop at 12:00 AM{" "}
          <span className="ml-1 font-medium tabular-nums">{clock}</span>
        </span>
      )}
    </Link>
  );
}
