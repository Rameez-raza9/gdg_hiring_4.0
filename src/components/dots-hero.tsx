"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dot, G } from "@/components/dot";
import { TRACK_GROUPS } from "@/lib/brand";

/* ------------------------------------------------------------------ */
/* The crowd: 8 tracks (Technical in back row, Non-Technical in front) */
/* ------------------------------------------------------------------ */

const SIZES = [
  [100, 116, 108, 98],
  [104, 96, 114, 106],
];

const ROWS = TRACK_GROUPS.map((g, gi) =>
  g.tracks.map((t, i) => ({
    label: t.label,
    color: t.color,
    shape: t.shape,
    size: SIZES[gi][i],
  })),
);

const STATS = [
  { value: "8", label: "Active tracks" },
  { value: "2,426+", label: "Active members" },
  { value: "20+", label: "Events hosted" },
];

const DotsHero = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid college email.");
      return;
    }
    setError("");
    try {
      await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setDone(true);
  };

  let index = 0;

  return (
    <section
      className="relative isolate overflow-hidden bg-white text-foreground dot-grid"
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <span className="grid grid-cols-2 gap-[3px]" aria-hidden="true">
            <i className="size-2.5 rounded-full" style={{ background: G.blue }} />
            <i className="size-2.5 rounded-full" style={{ background: G.red }} />
            <i className="size-2.5 rounded-full" style={{ background: G.yellow }} />
            <i className="size-2.5 rounded-full" style={{ background: G.green }} />
          </span>
          GDGoC SVEC
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link href="/#team" className="hover:text-foreground">Team</Link>
          <Link href="/faq" className="hover:text-foreground">FAQ</Link>
          <Link href="/login" className="hover:text-foreground">Login</Link>
        </nav>
        <Link
          href="/apply"
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:border-foreground/30"
        >
          Apply now
        </Link>
      </header>

      {/* Copy */}
      <div className="mx-auto max-w-3xl px-6 pb-10 pt-14 text-center sm:pt-20">
        <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-7xl">
          Eight tracks. One campus. Everyone building.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Workshops, study jams and hackathons run by students at Sri Vasavi
          Engineering College. Pick a technical or non-technical track, meet people who build, and ship
          something real.
        </p>

        <div className="mx-auto mt-9 w-full max-w-md">
          {done ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 text-center">
              ✓ Application link has been sent to your email! Check your inbox to apply.
            </div>
          ) : (
            <>
              <div className="flex items-center rounded-xl border border-border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Enter your college email"
                  aria-label="College email"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
                />
                <button
                  onClick={submit}
                  className="rounded-lg bg-primary px-4 text-white py-2.5 text-sm font-medium transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground cursor-pointer shadow-xs"
                >
                  Apply now
                </button>
              </div>
              {error && (
                <p role="alert" className="mt-2 text-left text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        <dl className="mx-auto mt-10 flex max-w-sm justify-center divide-x divide-border">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 px-4 sm:px-6">
              <dd className="text-2xl sm:text-3xl font-medium tracking-tight">{s.value}</dd>
              <dt className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* The crowd */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center pt-10">
        <div className="origin-bottom scale-[0.58] sm:scale-90 lg:scale-100">
          {ROWS.map((row, r) => (
            <div
              key={r}
              className={cn(
                "flex items-end justify-center -space-x-3",
                r > 0 && "-mt-9",
              )}
              style={{ zIndex: r }}
            >
              {row.map((m) => {
                const delay = (index++ * 0.37) % 2.4;
                return (
                  <Dot
                    key={m.label}
                    label={m.label}
                    color={m.color}
                    shape={m.shape}
                    size={m.size}
                    delay={delay}
                  />
                );
              })}
            </div>
          ))}
        </div>
        {/* ground line */}
        <div className="-mt-1 h-px w-full max-w-3xl bg-slate-300" />
      </div>
    </section>
  );
};

export default DotsHero;
