"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { G } from "@/lib/brand";
import { Dot } from "@/components/dot";
import { TEAMS, type Outcome, type TeamName } from "@/lib/teams";

export type Revealed = {
  name: string;
  outcome: Outcome;
  team?: TeamName;
  role?: string;
  no?: number;
};

const BEATS = [
  { word: "BUILD", color: G.blue },
  { word: "LEARN", color: G.red },
  { word: "CONNECT", color: G.yellow },
  { word: "GROW", color: G.green },
];

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://chat.whatsapp.com/GDGoCSVEC2026";
const firstName = (n?: string) => (n?.trim() ? n.trim().split(/\s+/)[0] : "");

function Confetti() {
  const colors = [G.blue, G.red, G.yellow, G.green];
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 36 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "105vh", opacity: [1, 1, 0.6] }}
          transition={{ duration: 2.6 + (i % 5) * 0.4, delay: (i % 12) * 0.12, ease: "easeIn" }}
          className="absolute top-0 size-2.5 rounded-full"
          style={{ left: `${(i * 97) % 100}%`, background: colors[i % 4] }}
        />
      ))}
    </div>
  );
}

export default function Reveal({ result }: { result: Revealed }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? BEATS.length : 0); // 0..3 beats, 4 = result

  useEffect(() => {
    if (step >= BEATS.length) return;
    const id = setTimeout(() => setStep((s) => s + 1), 800);
    return () => clearTimeout(id);
  }, [step]);

  const done = step >= BEATS.length;
  const accepted = result.outcome === "Accepted";
  const team = result.team ? TEAMS[result.team] : null;
  const accent = accepted && team ? team.color : G.blue;

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="beats" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
            <div className="grid h-56 place-items-center" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.28 }}
                  className="text-7xl font-medium tracking-[-0.05em] sm:text-8xl"
                  style={{ color: BEATS[Math.min(step, 3)].color }}
                >
                  {BEATS[Math.min(step, 3)].word}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-3" aria-hidden="true">
              {BEATS.map((b, i) => (
                <span
                  key={b.word}
                  className="size-3.5 rounded-full transition-all duration-300"
                  style={{ background: i <= step ? b.color : "#243053", transform: i === step ? "scale(1.5)" : "scale(1)" }}
                />
              ))}
            </div>
            <button
              onClick={() => setStep(BEATS.length)}
              className="mt-10 text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              Skip animation
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {accepted && !reduce && <Confetti />}

            <div
              className="overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10"
              style={accepted ? { boxShadow: `0 0 0 1px ${accent}55, 0 30px 80px ${accent}22` } : undefined}
            >
              <div className="flex justify-center">
                <Dot size={132} color={accent} shape={team?.shape ?? "round"} still={!accepted} />
              </div>

              {accepted && team ? (
                <>
                  <p className="mt-6 text-sm text-muted-foreground">Welcome to GDG 4.0</p>
                  <h1 className="mt-2 text-balance text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                    Congratulations{result.name ? `, ${firstName(result.name)}` : ""}
                  </h1>
                  <div className="mt-8 rounded-2xl border border-border bg-background p-6 text-left">
                    <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="size-2.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
                      Your team
                    </p>
                    <p className="mt-2 text-3xl font-medium tracking-tight" style={{ color: accent }}>
                      {result.team}
                    </p>
                    {result.role && <p className="mt-1 text-lg">{result.role}</p>}
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{team.line}</p>
                    {result.no && (
                      <p className="mt-5 border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
                        Member #{String(result.no).padStart(3, "0")} of GDG 4.0
                      </p>
                    )}
                  </div>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-block rounded-xl border border-green-300/60 bg-[#74E38A] px-7 py-3.5 text-sm font-medium text-neutral-950 transition hover:brightness-95"
                  >
                    Join the WhatsApp group
                  </a>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Venue and timings for the first meet will be shared on WhatsApp and by email.
                  </p>
                </>
              ) : result.outcome === "Waitlist" ? (
                <>
                  <h1 className="mt-6 text-balance text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                    You are on the reserve bench{result.name ? `, ${firstName(result.name)}` : ""}
                  </h1>
                  <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
                    You made a strong impression. We have no open slot right now, but if one opens
                    we will contact you by email and WhatsApp. Keep an eye on both.
                  </p>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-block rounded-xl border border-border bg-background px-7 py-3.5 text-sm font-medium transition hover:border-foreground/30"
                  >
                    Join the WhatsApp updates group
                  </a>
                </>
              ) : (
                <>
                  <h1 className="mt-6 text-balance text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                    Thank you for taking part{result.name ? `, ${firstName(result.name)}` : ""}
                  </h1>
                  <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
                    You are not in this year&apos;s team, and we know that is not the news you
                    hoped for. Our events are open to everyone, and we would love to see you
                    at the next one. Applications open again next cycle.
                  </p>
                  <a
                    href="https://gdg.community.dev/gdg-on-campus-sri-vasavi-engineering-college-tadepalligudem-india/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-block rounded-xl border border-border bg-background px-7 py-3.5 text-sm font-medium transition hover:border-foreground/30"
                  >
                    See upcoming events
                  </a>
                </>
              )}
            </div>

            <Link href="/" className="mt-8 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Back to home
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
