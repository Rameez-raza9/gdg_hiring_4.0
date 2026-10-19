"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps a countdown synced to the SERVER clock (not the device clock).
 * Returns ms remaining (null until the first sync), re-syncing every 30s.
 */
export function useRelease() {
  const [releaseAt, setReleaseAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const offset = useRef(0); // serverNow - clientNow

  useEffect(() => {
    let alive = true;
    const sync = async () => {
      try {
        const t0 = Date.now();
        const res = await fetch("/api/release", { cache: "no-store" });
        const j = (await res.json()) as { now: number; releaseAt: number };
        const rtt = Date.now() - t0;
        if (!alive) return;
        offset.current = j.now + rtt / 2 - Date.now();
        setReleaseAt(j.releaseAt);
      } catch {
        /* keep ticking with the last known offset */
      }
    };
    sync();
    const id = setInterval(sync, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (releaseAt === null) return;
    const tick = () => setRemaining(releaseAt - (Date.now() + offset.current));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [releaseAt]);

  return { remaining };
}

export function split(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
