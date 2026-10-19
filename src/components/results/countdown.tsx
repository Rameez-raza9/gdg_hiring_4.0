"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { G } from "@/lib/brand";
import { Dot } from "@/components/dot";
import { sfx } from "@/lib/audio";
import { split } from "./use-release";

const UNITS = [
  { key: "days", label: "Days", color: G.blue },
  { key: "hours", label: "Hours", color: G.red },
  { key: "minutes", label: "Minutes", color: G.yellow },
  { key: "seconds", label: "Seconds", color: G.green },
] as const;

const CROWD = [
  { c: G.red, s: "lean", z: 92 }, { c: G.blue, s: "squircle", z: 104 }, { c: G.yellow, s: "round", z: 98 },
  { c: G.green, s: "tall", z: 108 }, { c: G.yellow, s: "tall", z: 96 }, { c: G.green, s: "lean", z: 102 },
  { c: G.blue, s: "round", z: 94 }, { c: G.red, s: "squircle", z: 100 },
] as const;

export default function Countdown({ remaining }: { remaining: number }) {
  const reduce = useReducedMotion();
  const t = split(remaining);
  const units = t.days > 0 ? UNITS : UNITS.slice(1);
  const lastSec = useRef<number | null>(null);

  // Resume audio context automatically on any interaction (click, tap, scroll, key)
  useEffect(() => {
    const unlock = () => {
      sfx.resume();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("scroll", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, []);

  // Tick every second by default
  useEffect(() => {
    if (lastSec.current !== null && lastSec.current !== t.seconds) {
      sfx.playTick(t.seconds % 2 === 0);
    }
    lastSec.current = t.seconds;
  }, [t.seconds]);

  return (
    <div className="text-center">
      <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full" style={{ background: G.yellow }} aria-hidden="true" />
        Happy Vijayadashami from GDGoC SVEC
      </p>

      <h1 className="mx-auto mt-8 max-w-3xl text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-7xl">
        The results drop at midnight.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
        Everyone gets theirs at the same moment. Keep this page open and your
        result will unlock right here.
      </p>

      <div
        className="mx-auto mt-12 flex max-w-2xl justify-center gap-3 sm:gap-4"
        role="timer"
        aria-label="Time until results"
      >
        {units.map((u) => {
          const v = String(t[u.key]).padStart(2, "0");
          return (
            <div key={u.key} className="flex-1 rounded-2xl border border-border bg-card px-2 py-5 sm:px-4 sm:py-7">
              <motion.div
                key={v}
                initial={reduce ? false : { y: -8, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="text-5xl font-medium tabular-nums tracking-[-0.04em] sm:text-7xl"
              >
                {v}
              </motion.div>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <span className="size-1.5 rounded-full" style={{ background: u.color }} aria-hidden="true" />
                {u.label}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Release time: 12:00 AM IST, Tuesday 20 October 2026
      </p>

      <div className="mt-14 flex flex-wrap items-end justify-center gap-1" aria-hidden="true">
        {CROWD.map((d, i) => (
          <Dot key={i} size={d.z} color={d.c} shape={d.s} delay={(i * 0.37) % 2.4} />
        ))}
      </div>
      <div className="mx-auto h-px w-full max-w-3xl bg-foreground/60" />
    </div>
  );
}
