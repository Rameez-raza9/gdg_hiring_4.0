"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const G = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
} as const;

export const SHAPES = {
  lean: "M40 14 C56 10 64 28 76 44 C90 62 86 84 64 86 L36 86 C14 86 10 66 22 46 C30 32 28 18 40 14Z",
  round: "M50 10 C78 10 90 30 90 54 C90 78 72 90 50 90 C28 90 10 78 10 54 C10 30 22 10 50 10Z",
  squircle: "M30 12 L70 12 C84 12 90 18 90 32 L90 68 C90 82 84 88 70 88 L30 88 C16 88 10 82 10 68 L10 32 C10 18 16 12 30 12Z",
  tall: "M50 8 C70 8 80 26 80 48 C80 72 74 90 50 90 C26 90 20 72 20 48 C20 26 30 8 50 8Z",
} as const;

export type Shape = keyof typeof SHAPES;

const spring = { type: "spring", stiffness: 220, damping: 18 } as const;
const BASE_SIZE = 96;
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export interface DotProps {
  className?: string;
  size?: number;
  color?: string;
  shape?: Shape;
  /** stagger for the jump loop (seconds) */
  delay?: number;
  /** tooltip shown on hover */
  label?: string;
  /** eyes track the pointer; false = idle glances */
  followCursor?: boolean;
  /** eyes closed (e.g. while typing a password) */
  shy?: boolean;
  /** disable the periodic jump */
  still?: boolean;
}

export const Dot = ({
  className,
  size = BASE_SIZE,
  color = G.blue,
  shape = "lean",
  delay = 0,
  label,
  followCursor = true,
  shy = false,
  still = false,
}: DotProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (followCursor) return;
    let timer: ReturnType<typeof setTimeout>;
    const glance = () => {
      setLook(
        Math.random() < 0.25
          ? { x: 0, y: 0 }
          : { x: rand(-1, 1), y: rand(-0.7, 0.7) },
      );
      timer = setTimeout(glance, rand(1200, 2800));
    };
    timer = setTimeout(glance, 800);
    return () => clearTimeout(timer);
  }, [followCursor]);

  useEffect(() => {
    if (!followCursor) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const s = Math.min(d / 160, 1);
      setLook({ x: (dx / d) * s, y: (dy / d) * s });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [followCursor]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        timer = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, rand(2000, 5000));
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const jump = (size / BASE_SIZE) * 10;
  const closed = blink || shy;

  return (
    <div
      className={cn("group relative", className)}
      style={{ width: size, height: size }}
    >
      {label && (
        <span
          className={cn(
            "pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap",
            "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background",
            "translate-y-1 opacity-0 transition duration-200",
            "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          {label}
        </span>
      )}
      <motion.div
        ref={ref}
        animate={still ? undefined : { y: [0, -jump, 0] }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 2.4,
          delay,
        }}
        whileHover={{ scale: 1.08 }}
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
          className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pt-3"
          style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
        >
          <motion.div
            className="flex items-center gap-2.5"
            animate={{
              x: shy ? 0 : look.x * 6,
              y: shy ? 2 : look.y * 5,
              scaleY: closed ? 0.1 : 1,
            }}
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

export default Dot;
