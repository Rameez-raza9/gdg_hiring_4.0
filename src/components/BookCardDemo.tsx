"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type ValueAnimationTransition,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface BookCover {
  title: string;
  tagline: string;
  credit: string;
  genre: string;
  gradient: string;
  excerpt?: string;
  lead?: string;
  tags?: string[];
}

export interface BookCardProps {
  book?: BookCover;
}

const defaultBook: BookCover = {
  title: "Web Engineering Wing",
  tagline: "Modern Web, Infinite Scale",
  credit: "GDGOC SVEC TECH WING",
  genre: "Frontend & Fullstack",
  gradient: "from-blue-500 to-sky-400",
  excerpt:
    "Master Next.js App Router, React 19, TypeScript, and high-performance modern web architectures with Google standards.",
  lead: "Lead: Alex Morgan (4th Year CSE)",
  tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
};

const W = 224;
const H = 320;
const HIDDEN = "polygon(0px 0px, 0px 0px, 0px 0px)";
const OPEN_THRESHOLD = 0.5;
const HINT: [number, number] = [W - 44, H - 30];

const turnEase = { duration: 0.7, ease: [0.3, 0.1, 0.2, 1] } as const;
const hintSpring = { type: "spring", stiffness: 260, damping: 22 } as const;
const shiftSpring = { type: "spring", stiffness: 140, damping: 22 } as const;
const tween = { duration: 0.2, ease: "easeOut" } as const;

type Point = [number, number];

function constrain(rawX: number, rawY: number): Point {
  let x = rawX;
  let y = Math.min(rawY, H);
  let d = Math.hypot(x, y - H);
  if (d > W) {
    x = (x / d) * W;
    y = H + ((y - H) / d) * W;
  }
  const diagonal = Math.hypot(W, H);
  d = Math.hypot(x, y);
  if (d > diagonal) {
    x = (x / d) * diagonal;
    y = (y / d) * diagonal;
  }
  return [x, y];
}

function clipHalf(
  polygon: Point[],
  nx: number,
  ny: number,
  k: number,
  keepCorner: boolean,
) {
  const side = ([x, y]: Point) => x * nx + y * ny - k;
  const inside = (value: number) => (keepCorner ? value > 0 : value <= 0);
  const out: Point[] = [];
  polygon.forEach((a, i) => {
    const b = polygon[(i + 1) % polygon.length];
    const sa = side(a);
    const sb = side(b);
    if (inside(sa)) out.push(a);
    if (inside(sa) !== inside(sb)) {
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  });
  return out;
}

function toPolygon(points: Point[]) {
  if (points.length < 3) return HIDDEN;
  return `polygon(${points
    .map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`)
    .join(", ")})`;
}

interface Fold {
  coverClip: string;
  flapClip: string;
  flapTransform: string;
  underShade: string;
  flapShade: string;
}

const CLOSED: Fold = {
  coverClip: "none",
  flapClip: HIDDEN,
  flapTransform: "none",
  underShade: "none",
  flapShade: "none",
};

function computeFold(rawX: number, rawY: number): Fold {
  const [x, y] = constrain(rawX, rawY);
  const vx = W - x;
  const vy = H - y;
  const distance = Math.hypot(vx, vy);
  if (distance < 0.5) return CLOSED;

  const nx = vx / distance;
  const ny = vy / distance;
  const k = ((W + x) / 2) * nx + ((H + y) / 2) * ny;

  const page: Point[] = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ];
  const cover = clipHalf(page, nx, ny, k, false);
  const corner = clipHalf(page, nx, ny, k, true);
  const flap = corner.map(([px, py]): Point => {
    const s = px * nx + py * ny - k;
    return [px - 2 * s * nx, py - 2 * s * ny];
  });

  const a = 2 * nx * nx - 1;
  const b = 2 * nx * ny;
  const c = -2 * nx * ny;
  const d = 1 - 2 * ny * ny;
  const e = W * (1 - 2 * nx * nx) + 2 * k * nx;
  const f = -2 * nx * ny * W + 2 * k * ny;

  const angle = (Math.atan2(nx, -ny) * 180) / Math.PI;
  const depth = Math.min(1, distance / 80);
  const underLength = W * Math.abs(nx) + H * Math.abs(ny);
  const underStop = k - ((W / 2) * nx + (H / 2) * ny) + underLength / 2;
  const flapLength = 2 * W * Math.abs(nx) + H * Math.abs(ny);
  const flapStop = -(k - (H / 2) * ny) + flapLength / 2;

  return {
    coverClip: toPolygon(cover),
    flapClip: toPolygon(flap),
    flapTransform: `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`,
    underShade: `linear-gradient(${angle}deg, rgba(0,0,0,${0.3 * depth}) ${underStop}px, rgba(0,0,0,0) ${underStop + 36}px)`,
    flapShade: `linear-gradient(${angle + 180}deg, rgba(0,0,0,${0.35 * depth}) ${flapStop}px, rgba(0,0,0,0) ${flapStop + 72}px)`,
  };
}

function useFoldStyle(fold: MotionValue<Fold>, key: keyof Fold) {
  return useTransform(fold, (value) => value[key]);
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  origin: Point;
  scale: number;
  startOpen: boolean;
}

export default function BookCardDemo({ book = defaultBook }: BookCardProps) {
  const reduce = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const interacted = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const px = useMotionValue(W);
  const py = useMotionValue(H);
  const shift = useMotionValue(-W / 2);

  const fold = useTransform([px, py], ([x, y]: number[]) => computeFold(x, y));
  const coverClip = useFoldStyle(fold, "coverClip");
  const flapClip = useFoldStyle(fold, "flapClip");
  const flapTransform = useFoldStyle(fold, "flapTransform");
  const underShade = useFoldStyle(fold, "underShade");
  const flapShade = useFoldStyle(fold, "flapShade");

  const moveCorner = (
    target: Point,
    transition: ValueAnimationTransition<number>,
    liftY?: number,
  ) => {
    const [x, y] = constrain(px.get(), py.get());
    px.set(x);
    py.set(y);
    animate(px, target[0], transition);
    animate(
      py,
      liftY === undefined ? [y, target[1]] : [y, liftY, target[1]],
      transition,
    );
  };

  const settle = (open: boolean, lift = false) => {
    setIsOpen(open);
    moveCorner(
      open ? [-W, H] : [W, H],
      reduce ? tween : turnEase,
      lift && !reduce ? H * 0.72 : undefined,
    );
    animate(shift, open ? 0 : -W / 2, reduce ? tween : shiftSpring);
  };

  useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => {
      if (interacted.current) return;
      animate(px, [W, HINT[0], HINT[0], W], {
        duration: 1.6,
        times: [0, 0.3, 0.6, 1],
      });
      animate(py, [H, HINT[1], HINT[1], H], {
        duration: 1.6,
        times: [0, 0.3, 0.6, 1],
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [reduce, px, py]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    interacted.current = true;
    stage.setPointerCapture(event.pointerId);
    const [x, y] = constrain(px.get(), py.get());
    px.stop();
    py.stop();
    px.set(x);
    py.set(y);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: isOpen ? [-W, H] : [x, y],
      scale: stage.getBoundingClientRect().width / (W * 2),
      startOpen: isOpen,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    px.set(state.origin[0] + (event.clientX - state.startX) / state.scale);
    py.set(state.origin[1] + (event.clientY - state.startY) / state.scale);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    const [x] = constrain(px.get(), py.get());
    const open = state.startOpen
      ? x < -W * OPEN_THRESHOLD
      : x < W * OPEN_THRESHOLD;
    settle(open);
  };

  const handleHover = (
    event: PointerEvent<HTMLDivElement>,
    entering: boolean,
  ) => {
    if (event.pointerType !== "mouse" || drag.current || isOpen) return;
    moveCorner(entering ? HINT : [W, H], reduce ? tween : hintSpring);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") settle(!isOpen, true);
    else if (event.key === "ArrowLeft" && !isOpen) settle(true, true);
    else if (event.key === "ArrowRight" && isOpen) settle(false, true);
    else return;
    interacted.current = true;
    event.preventDefault();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 overflow-x-clip py-4">
      <div
        ref={stageRef}
        role="button"
        tabIndex={0}
        aria-pressed={isOpen}
        aria-label={`${book.title}. Drag the cover to ${isOpen ? "close" : "open"} it, or press Enter.`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={(event) => handleHover(event, true)}
        onPointerLeave={(event) => handleHover(event, false)}
        onKeyDown={handleKeyDown}
        className="relative h-80 w-md origin-top scale-80 sm:scale-95 cursor-grab touch-none rounded-2xl outline-none select-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-8 focus-visible:ring-offset-neutral-950 active:cursor-grabbing"
      >
        <motion.div style={{ x: shift }} className="absolute inset-0">
          <div className="absolute top-0 left-1/2 h-80 w-56">
            {/* Page block edge */}
            <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-r-xl bg-neutral-800 ring-1 ring-white/10" />

            {/* First page inside */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-r-xl bg-neutral-900 p-5 ring-1 ring-white/10 text-white">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/40 to-transparent" />
              <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                {book.genre}
              </span>
              <p className="mt-2 text-base leading-tight font-bold text-white">
                {book.title}
              </p>
              <p className="mt-0.5 text-[10px] text-neutral-400">
                {book.credit}
              </p>
              <div
                className={cn(
                  "mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r",
                  book.gradient,
                )}
              />
              {book.excerpt && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-300">
                  {book.excerpt}
                </p>
              )}
              {book.lead && (
                <p className="mt-2 text-[10px] font-medium text-emerald-400">
                  {book.lead}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-800">
                <span>Wing Syllabus</span>
                <span className="tabular-nums">2026 Edition</span>
              </div>
            </div>

            {/* Shadow the lifted cover casts on the page */}
            <motion.div
              aria-hidden
              style={{ backgroundImage: underShade }}
              className="pointer-events-none absolute inset-0 rounded-r-xl"
            />

            {/* Front of the cover, clipped at the fold */}
            <motion.div
              style={{ clipPath: coverClip }}
              className="absolute inset-0 overflow-hidden rounded-l-sm rounded-r-2xl bg-neutral-950 ring-1 ring-white/15 ring-inset"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-20",
                  book.gradient,
                )}
              />
              <div
                className={cn(
                  "absolute -top-20 -right-16 size-48 rounded-full bg-gradient-to-br opacity-35 blur-3xl",
                  book.gradient,
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 via-white/10 to-transparent" />

              <div className="absolute inset-x-5 top-5 flex flex-col text-[10px] tracking-widest text-white/60 uppercase">
                {book.tagline.split(", ").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>

              <span className="absolute top-20 left-5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white ring-1 ring-white/20">
                {book.genre}
              </span>

              <div className="absolute inset-x-5 bottom-5 flex flex-col gap-1.5">
                <div
                  className={cn(
                    "h-0.5 w-8 rounded-full bg-gradient-to-r",
                    book.gradient,
                  )}
                />
                <p className="text-xl leading-tight font-bold tracking-tight text-white">
                  {book.title}
                </p>
                <p className="text-[10px] tracking-widest text-neutral-400 uppercase">
                  {book.credit}
                </p>
              </div>
            </motion.div>

            {/* Inside of the cover, folded over the fold line */}
            <motion.div
              style={{ clipPath: flapClip }}
              className="pointer-events-none absolute inset-0"
            >
              <motion.div
                style={{ transform: flapTransform, transformOrigin: "0 0" }}
                className="absolute inset-0 overflow-hidden rounded-l-2xl rounded-r-sm bg-neutral-950"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-bl opacity-15",
                    book.gradient,
                  )}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[10px] tracking-widest text-white/50 uppercase">
                  {book.tagline.split(", ").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                aria-hidden
                style={{ backgroundImage: flapShade }}
                className="absolute inset-y-0 -left-56 w-md"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <p className="text-[11px] text-neutral-400 font-medium" aria-live="polite">
        {isOpen ? "← Drag cover back to close" : "Drag the corner or click to open wing dossier →"}
      </p>
    </div>
  );
}
