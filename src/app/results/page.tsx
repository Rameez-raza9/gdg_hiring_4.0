"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Dot } from "@/components/dot";
import { G } from "@/lib/brand";
import Countdown from "@/components/results/countdown";
import Reveal, { type Revealed } from "@/components/results/reveal";
import { useRelease } from "@/components/results/use-release";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

export default function ResultsPage() {
  const { remaining } = useRelease();
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Revealed | null>(null);

  const open = remaining !== null && remaining <= 0;

  useEffect(() => {
    if (open) document.title = "Your GDG 4.0 result";
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roll }),
      });
      const json = await res.json();
      if (res.ok) setResult(json as Revealed);
      else if (res.status === 403) setError("Results are not open yet. Give it a few seconds and try again.");
      else setError(json.error ?? "Something went wrong. Try again.");
    } catch {
      setError("Network problem. Check your connection and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="dot-glow">
      <div className="dot-grid flex min-h-screen items-center justify-center px-6 pb-40 pt-16">
        <div className="w-full max-w-4xl">
          {result ? (
            <Reveal result={result} />
          ) : remaining === null ? (
            <p className="text-center text-muted-foreground" role="status">Syncing the clock...</p>
          ) : !open ? (
            <Countdown remaining={remaining} />
          ) : (
            <div className="mx-auto max-w-md">
              <div className="relative z-10 -mb-8 flex justify-center">
                <Dot size={110} color={G.yellow} shape="round" />
              </div>
              <form
                onSubmit={submit}
                className="rounded-3xl border border-border bg-card p-7 pt-12 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-9 sm:pt-12"
                noValidate
              >
                <h1 className="text-center text-3xl font-medium tracking-[-0.03em]">Results are live</h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Enter the email and roll number you applied with.
                </p>
                <div className="mt-8 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Email</span>
                    <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Roll number</span>
                    <input className={field} value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="As on your application" autoComplete="off" />
                  </label>
                  {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading || !email || !roll}
                    className={cn(
                      "w-full rounded-xl border border-green-300/60 bg-[#74E38A] py-3 text-sm font-medium text-neutral-950 transition hover:brightness-95",
                      "disabled:opacity-60",
                    )}
                  >
                    {loading ? "Checking..." : "Reveal my result"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
