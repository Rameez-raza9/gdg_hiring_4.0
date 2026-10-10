"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Dot (your component, extended: color, shape, delay, label)          */
/* ------------------------------------------------------------------ */

const spring = { type: "spring", stiffness: 220, damping: 18 } as const;
const BASE_SIZE = 96;

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const SHAPES = {
  lean: "M40 14 C56 10 64 28 76 44 C90 62 86 84 64 86 L36 86 C14 86 10 66 22 46 C30 32 28 18 40 14Z",
  round: "M50 10 C78 10 90 30 90 54 C90 78 72 90 50 90 C28 90 10 78 10 54 C10 30 22 10 50 10Z",
  squircle: "M30 12 L70 12 C84 12 90 18 90 32 L90 68 C90 82 84 88 70 88 L30 88 C16 88 10 82 10 68 L10 32 C10 18 16 12 30 12Z",
  tall: "M50 8 C70 8 80 26 80 48 C80 72 74 90 50 90 C26 90 20 72 20 48 C20 26 30 8 50 8Z",
} as const;

type Shape = keyof typeof SHAPES;

export interface DotProps {
  className?: string;
  followCursor?: boolean;
  size?: number;
  color?: string;
  shape?: Shape;
  delay?: number;
  label?: string;
}

export const Dot = ({
  className,
  followCursor = true,
  size = BASE_SIZE,
  color = "#4285F4",
  shape = "lean",
  delay = 0,
  label,
}: DotProps) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // idle glances (only when not following the cursor)
  useEffect(() => {
    if (reduceMotion || followCursor) return;
    let timer: ReturnType<typeof setTimeout>;
    const glance = () => {
      const center = Math.random() < 0.25;
      setLook(
        center
          ? { x: 0, y: 0 }
          : { x: randomBetween(-1, 1), y: randomBetween(-0.7, 0.7) },
      );
      timer = setTimeout(glance, randomBetween(1200, 2800));
    };
    timer = setTimeout(glance, 800);
    return () => clearTimeout(timer);
  }, [reduceMotion, followCursor]);

  // eyes follow the pointer
  useEffect(() => {
    if (reduceMotion || !followCursor) return;
    const onMove = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const strength = Math.min(distance / 160, 1);
      setLook({ x: (dx / distance) * strength, y: (dy / distance) * strength });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, followCursor]);

  // blink
  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        timer = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, randomBetween(2000, 5000));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const jump = (size / BASE_SIZE) * 10;

  return (
    <div className={cn("group relative", className)} style={{ width: size, height: size }}>
      {label && (
        <span
          className={cn(
            "pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap",
            "rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white shadow-lg",
            "translate-y-1 opacity-0 transition duration-200",
            "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          {label}
        </span>
      )}
      <motion.div
        ref={ref}
        animate={reduceMotion ? undefined : { y: [0, -jump, 0] }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 2.4,
          delay,
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        role="img"
        aria-label={label ? `${label} dot` : "Animated dot"}
        className="relative size-full"
      >
        <svg viewBox="0 0 100 100" aria-hidden="true" className="size-full">
          <path
            d={SHAPES[shape]}
            fill={color}
            stroke={color}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pt-3 pointer-events-none"
          style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
        >
          <motion.div
            className="flex items-center gap-2.5"
            animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
            transition={{ ...spring, scaleY: { duration: 0.1 } }}
          >
            <div className="size-2.5 rounded-full bg-gray-950" />
            <div className="size-2.5 rounded-full bg-gray-950" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The crowd: 12 dots, one per track, in Google colors                 */
/* ------------------------------------------------------------------ */

const BLUE = "#4285F4";
const RED = "#EA4335";
const YELLOW = "#FBBC04";
const GREEN = "#34A853";

type Member = { label: string; color: string; shape: Shape; size: number };

// back row -> front row (3 + 4 + 5 = 12)
const ROWS: Member[][] = [
  [
    { label: "Gemini", color: BLUE, shape: "tall", size: 92 },
    { label: "Open Source", color: RED, shape: "round", size: 108 },
    { label: "Cybersecurity", color: GREEN, shape: "squircle", size: 92 },
  ],
  [
    { label: "Android", color: GREEN, shape: "lean", size: 100 },
    { label: "Web", color: YELLOW, shape: "round", size: 112 },
    { label: "Cloud", color: BLUE, shape: "squircle", size: 104 },
    { label: "UI / UX", color: RED, shape: "tall", size: 96 },
  ],
  [
    { label: "Flutter", color: BLUE, shape: "round", size: 96 },
    { label: "AI / ML", color: RED, shape: "lean", size: 108 },
    { label: "Firebase", color: YELLOW, shape: "squircle", size: 120 },
    { label: "Kotlin", color: GREEN, shape: "tall", size: 100 },
    { label: "DevOps", color: BLUE, shape: "lean", size: 92 },
  ],
];

const STATS = [
  { value: "12", label: "Specialized tracks" },
  { value: "2,426+", label: "Active members" },
  { value: "20+", label: "Events hosted" },
];

export interface DotsHeroProps {
  onNavigateTab?: (tab: string) => void;
  showHeader?: boolean;
}

export const DotsHero = ({ onNavigateTab, showHeader = false }: DotsHeroProps) => {
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
      className="relative isolate overflow-hidden bg-[#FAFAF7] text-neutral-950 rounded-b-3xl sm:rounded-b-[40px] shadow-2xl"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(10,10,10,0.09) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Optional Nav (shown if showHeader is true, otherwise clean top) */}
      {showHeader && (
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <a
            href="#"
            onClick={(e) => {
              if (onNavigateTab) {
                e.preventDefault();
                onNavigateTab("home");
              }
            }}
            className="flex items-center gap-2.5 text-lg font-semibold tracking-tight cursor-pointer"
          >
            <img src="/assets/logos/main_logo.jpeg" alt="GDGoC SVEC" className="size-8 rounded-lg object-contain border border-neutral-200 shadow-xs" />
            <span>GDGoC SVEC</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-neutral-600 md:flex">
            <a
              href="#events"
              onClick={(e) => {
                if (onNavigateTab) {
                  e.preventDefault();
                  onNavigateTab("events");
                }
              }}
              className="hover:text-neutral-950 cursor-pointer"
            >
              Events
            </a>
            <a
              href="#team"
              onClick={(e) => {
                if (onNavigateTab) {
                  e.preventDefault();
                  onNavigateTab("team");
                }
              }}
              className="hover:text-neutral-950 cursor-pointer"
            >
              Team
            </a>
            <a
              href="#wings"
              onClick={(e) => {
                if (onNavigateTab) {
                  e.preventDefault();
                  onNavigateTab("wings");
                }
              }}
              className="hover:text-neutral-950 cursor-pointer"
            >
              Wings
            </a>
            <a
              href="#faqs"
              onClick={(e) => {
                if (onNavigateTab) {
                  e.preventDefault();
                  onNavigateTab("faqs");
                }
              }}
              className="hover:text-neutral-950 cursor-pointer"
            >
              FAQs
            </a>
          </nav>
          <a
            href="https://gdg.community.dev/gdg-on-campus-sri-vasavi-engineering-college-tadepalligudem-india/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:border-neutral-300"
          >
            Join the community
          </a>
        </header>
      )}

      {/* Copy */}
      <div className={cn("mx-auto max-w-3xl px-6 pb-10 text-center", showHeader ? "pt-10 sm:pt-14" : "pt-14 sm:pt-20")}>
        <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-7xl">
          Twelve tracks. One campus. Everyone building.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-neutral-600">
          Workshops, study jams and hackathons run by students at Sri Vasavi
          Engineering College. Pick a track, meet people who build, and ship
          something real.
        </p>

        <div className="mx-auto mt-9 w-full max-w-md">
          {done ? (
            <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
              You&apos;re in. Check your inbox for the next event.
            </p>
          ) : (
            <>
              <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-neutral-950/20">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Enter your college email"
                  aria-label="College email"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-neutral-400"
                />
                <button
                  onClick={submit}
                  className="rounded-lg border border-green-300/60 bg-[#74E38A] px-4 py-2.5 text-sm font-medium transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 cursor-pointer text-neutral-900"
                >
                  Join now
                </button>
              </div>
              {error && (
                <p role="alert" className="mt-2 text-left text-sm text-red-600">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-xs text-neutral-600">
          <span>Interested in leading a track?</span>
          <button
            onClick={() => onNavigateTab?.("apply")}
            className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-[#4285F4] transition cursor-pointer"
          >
            Apply for Core Team →
          </button>
        </div>

        <dl className="mx-auto mt-9 flex max-w-sm justify-center divide-x divide-neutral-200">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 px-4 sm:px-5">
              <dd className="text-2xl sm:text-3xl font-medium tracking-tight">{s.value}</dd>
              <dt className="mt-1 text-xs text-neutral-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* The crowd */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center pt-8 pb-10">
        <div className="origin-bottom scale-[0.62] sm:scale-90 lg:scale-100">
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
        <div className="-mt-1 h-px w-full max-w-3xl bg-neutral-950/80" />
      </div>
    </section>
  );
};

export default DotsHero;
