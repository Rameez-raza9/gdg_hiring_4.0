"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 220, damping: 18 } as const;
const BASE_SIZE = 96;

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export interface DotProps {
  className?: string;
  followCursor?: boolean;
  size?: number;
  color?: string;
}

// Helper hook for cursor gaze & natural blinking
function useDotGaze(followCursor: boolean = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (followCursor) return;
    let timer: ReturnType<typeof setTimeout>;
    const glance = () => {
      const center = Math.random() < 0.25;
      setLook(
        center ? { x: 0, y: 0 } : { x: randomBetween(-1, 1), y: randomBetween(-0.7, 0.7) }
      );
      timer = setTimeout(glance, randomBetween(1200, 2800));
    };
    timer = setTimeout(glance, 800);
    return () => clearTimeout(timer);
  }, [followCursor]);

  useEffect(() => {
    if (!followCursor) return;
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
      }, randomBetween(2000, 5000));
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return { ref, look, blink };
}

// ── 1. Dot 01: Google Blue Circle Dot (Classic Round) ──
export const Dot01 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { scale: [1, 1.05, 1] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 01 - Google Blue Circle"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="size-full fill-[#4285F4] stroke-[#4285F4]"
      >
        <circle cx="50" cy="50" r="42" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-3 w-3 rounded-full bg-neutral-950" />
          <div className="h-3 w-3 rounded-full bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot1 = Dot01;

// ── 2. Dot 02: Coral Red Droplet Dot (Determination) ──
export const Dot02 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [-4, 4, -4] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 02 - Coral Red Droplet"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="size-full fill-[#EA4335] stroke-[#EA4335]"
      >
        <path d="M50 14 C68 38, 84 56, 84 72 A34 34 0 0 1 16 72 C16 56, 32 38, 50 14 Z" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-[58%] flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-2.5 w-3 rounded-full bg-neutral-950" />
          <div className="h-2.5 w-3 rounded-full bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot2 = Dot02;

// ── 3. Dot 03: Emerald Green Sunflower Dot (12 Petals) ──
export const Dot03 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [0, 15, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 03 - Green Sunflower"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
        className="size-full origin-center fill-[#34A853] stroke-[#34A853]"
      >
        <circle cx="50" cy="50" r="32" />
        <circle cx="80.0" cy="50.0" r="11" />
        <circle cx="76.0" cy="65.0" r="11" />
        <circle cx="65.0" cy="76.0" r="11" />
        <circle cx="50.0" cy="80.0" r="11" />
        <circle cx="35.0" cy="76.0" r="11" />
        <circle cx="24.0" cy="65.0" r="11" />
        <circle cx="20.0" cy="50.0" r="11" />
        <circle cx="24.0" cy="35.0" r="11" />
        <circle cx="35.0" cy="24.0" r="11" />
        <circle cx="50.0" cy="20.0" r="11" />
        <circle cx="65.0" cy="24.0" r="11" />
        <circle cx="76.0" cy="35.0" r="11" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2" strokeLinecap="round">
            <path d="M2 7L5 3L8 7" />
          </svg>
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2" strokeLinecap="round">
            <path d="M2 7L5 3L8 7" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
export const Dot3 = Dot03;

// ── 4. Dot 04: Sunny Amber Clover Dot (4 Orbs) ──
export const Dot04 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [0, 360] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 04 - Amber Clover"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="size-full fill-[#FBBC04] stroke-[#FBBC04]"
      >
        <circle cx="50" cy="30" r="22" />
        <circle cx="70" cy="50" r="22" />
        <circle cx="50" cy="70" r="22" />
        <circle cx="30" cy="50" r="22" />
        <circle cx="50" cy="50" r="26" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2">
            <path d="M2 4Q5 8 8 4" />
          </svg>
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2">
            <path d="M2 4Q5 8 8 4" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
export const Dot4 = Dot04;

// ── 5. Dot 05: Indigo Squircle Dot (Modern Tech) ──
export const Dot05 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { scale: [1, 0.96, 1] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 05 - Indigo Squircle"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="size-full fill-[#6366F1] stroke-[#6366F1]"
      >
        <rect x="14" y="14" width="72" height="72" rx="28" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-3.5 w-2.5 rounded-sm bg-neutral-950" />
          <div className="h-3.5 w-2.5 rounded-sm bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot5 = Dot05;

// ── 6. Dot 06: Yellow Star / Triangle Dot ──
export const Dot06 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [0, 15, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 06 - Yellow Star"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
        className="size-full origin-center fill-[#FBBC04] stroke-[#FBBC04]"
      >
        <circle cx="50" cy="50" r="32" />
        <circle cx="80.0" cy="50.0" r="9" />
        <circle cx="71.2" cy="71.2" r="9" />
        <circle cx="50.0" cy="80.0" r="9" />
        <circle cx="28.8" cy="71.2" r="9" />
        <circle cx="20.0" cy="50.0" r="9" />
        <circle cx="28.8" cy="28.8" r="9" />
        <circle cx="50.0" cy="20.0" r="9" />
        <circle cx="71.2" cy="28.8" r="9" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-3 w-3 rounded-full bg-neutral-950" />
          <div className="h-3 w-3 rounded-full bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot6 = Dot06;

// ── 7. Dot 07: Sky Smile Flower Dot ──
export const Dot07 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [0, 15, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 07 - Sky Flower Smile"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.5 }}
        className="size-full origin-center fill-[#38BDF8] stroke-[#38BDF8]"
      >
        <circle cx="50" cy="50" r="22" />
        <circle cx="64.1" cy="64.1" r="20" />
        <circle cx="35.9" cy="64.1" r="20" />
        <circle cx="35.9" cy="35.9" r="20" />
        <circle cx="64.1" cy="35.9" r="20" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2" strokeLinecap="round">
            <path d="M2 4Q5 8 8 4" />
          </svg>
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2" strokeLinecap="round">
            <path d="M2 4Q5 8 8 4" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
export const Dot7 = Dot07;

// ── 8. Dot 08: Purple Diamond Octagon Dot (GenAI Intelligence) ──
export const Dot08 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { y: [0, -6, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 08 - Purple Diamond"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="size-full fill-[#A855F7] stroke-[#A855F7]"
      >
        <polygon points="50,14 84,36 84,72 50,94 16,72 16,36" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-[52%] flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-2.5 w-2.5 rotate-45 bg-neutral-950" />
          <div className="h-2.5 w-2.5 rotate-45 bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot8 = Dot08;

// ── 9. Dot 09: Crimson Red Hexagon Fighter Dot ──
export const Dot09 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [0, 15, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 09 - Red Hexagon"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.8 }}
        className="size-full origin-center fill-[#EA4335] stroke-[#EA4335]"
      >
        <circle cx="50" cy="50" r="32" />
        <circle cx="76.0" cy="35.0" r="14" />
        <circle cx="76.0" cy="65.0" r="14" />
        <circle cx="50.0" cy="80.0" r="14" />
        <circle cx="24.0" cy="65.0" r="14" />
        <circle cx="24.0" cy="35.0" r="14" />
        <circle cx="50.0" cy="20.0" r="14" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2" strokeLinecap="round">
            <path d="M2 3L5 7L8 3" />
          </svg>
          <svg viewBox="0 0 10 10" className="size-3 fill-none stroke-neutral-950" strokeWidth="2" strokeLinecap="round">
            <path d="M2 3L5 7L8 3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
export const Dot9 = Dot09;

// ── 10. Dot 10: Google Yellow Circle Dot with Slit Eyes ──
export const Dot10 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const jump = (size / BASE_SIZE) * 8;
  const bodyAnimation = { y: [0, -jump, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 10 - Google Yellow Circle"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 0.5, ease: "easeOut", repeat: Infinity, repeatDelay: 1.8 }}
        className="size-full fill-[#FBBC04] stroke-[#FBBC04]"
      >
        <circle cx="50" cy="50" r="40" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2.5"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-4 w-1.5 rounded-full bg-neutral-950" />
          <div className="h-4 w-1.5 rounded-full bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot10Alias = Dot10;

// ── 11. Dot 11: Google Green Multi-Orb Flower Cloud Dot ──
export const Dot11 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const bodyAnimation = { rotate: [0, 10, 0] };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Dot 11 - Google Green Flower Cloud"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        animate={bodyAnimation}
        transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
        className="size-full origin-center fill-[#34A853] stroke-[#34A853]"
      >
        <circle cx="50" cy="50" r="32" />
        <circle cx="75" cy="50" r="16" />
        <circle cx="50" cy="75" r="16" />
        <circle cx="25" cy="50" r="16" />
        <circle cx="50" cy="25" r="16" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-3 w-3 rounded-full bg-neutral-950" />
          <div className="h-3 w-3 rounded-full bg-neutral-950" />
        </motion.div>
      </div>
    </div>
  );
};
export const Dot11Alias = Dot11;

// ── 12. Dot 12: Google Blue Ghost/Blob Jumper Dot ──
export const Dot12 = ({ className, followCursor = true, size = BASE_SIZE }: DotProps) => {
  const { ref, look, blink } = useDotGaze(followCursor);
  const jump = (size / BASE_SIZE) * 10;
  const bodyAnimation = { y: [0, -jump, 0] };

  return (
    <motion.div
      ref={ref}
      animate={bodyAnimation}
      transition={{ duration: 0.45, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
      role="img"
      aria-label="Dot 12 - Google Blue Ghost Blob"
      style={{ width: size, height: size }}
      className={cn("relative cursor-pointer select-none", className)}
    >
      <svg viewBox="0 0 100 100" className="size-full fill-[#4285F4] stroke-[#4285F4]">
        <path
          d="M 50 16 C 28 16 16 32 16 54 C 16 68 20 78 28 82 C 34 85 40 76 50 76 C 60 76 66 85 72 82 C 80 78 84 68 84 54 C 84 32 72 16 50 16 Z"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="absolute left-1/2 top-[52%] flex size-24 items-center justify-center pointer-events-none"
        style={{ transform: `translate(-50%, -50%) scale(${size / BASE_SIZE})` }}
      >
        <motion.div
          className="flex items-center gap-2.5"
          animate={{ x: look.x * 6, y: look.y * 5, scaleY: blink ? 0.1 : 1 }}
          transition={{ ...spring, scaleY: { duration: 0.1 } }}
        >
          <div className="h-3.5 w-3.5 rounded-full bg-neutral-950" />
          <div className="h-3.5 w-3.5 rounded-full bg-neutral-950" />
        </motion.div>
      </div>
    </motion.div>
  );
};
export const Dot12Alias = Dot12;

// ── Google Dots Squad: 4 Primary Google Tracks ──
export const GoogleDotsSquad = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center gap-5 sm:gap-9", className)}>
      <div className="flex flex-col items-center gap-1.5">
        <Dot12 size={62} followCursor={true} />
        <span className="text-[10px] font-mono text-blue-400">#Web</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <Dot09 size={62} followCursor={true} />
        <span className="text-[10px] font-mono text-red-400">#Android</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <Dot10 size={62} followCursor={true} />
        <span className="text-[10px] font-mono text-amber-400">#Cloud</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <Dot11 size={62} followCursor={true} />
        <span className="text-[10px] font-mono text-emerald-400">#AI/ML</span>
      </div>
    </div>
  );
};

// ── The Complete All 12 Dots Interactive Parade ──
export const AllTwelveDotsShowcase = ({ className }: { className?: string }) => {
  const dotsList = [
    { Comp: Dot01, num: "01", name: "Alpha Blue", color: "text-blue-400" },
    { Comp: Dot02, num: "02", name: "Ruby Flame", color: "text-red-400" },
    { Comp: Dot03, num: "03", name: "Flora Green", color: "text-emerald-400" },
    { Comp: Dot04, num: "04", name: "Amber Clover", color: "text-amber-400" },
    { Comp: Dot05, num: "05", name: "Indigo Orbit", color: "text-indigo-400" },
    { Comp: Dot06, num: "06", name: "Sunny Star", color: "text-yellow-400" },
    { Comp: Dot07, num: "07", name: "Sky Smile", color: "text-sky-400" },
    { Comp: Dot08, num: "08", name: "Prism GenAI", color: "text-purple-400" },
    { Comp: Dot09, num: "09", name: "Crimson Hex", color: "text-rose-400" },
    { Comp: Dot10, num: "10", name: "Arcade Yellow", color: "text-amber-300" },
    { Comp: Dot11, num: "11", name: "Emerald Bloom", color: "text-green-400" },
    { Comp: Dot12, num: "12", name: "Nexus Jumper", color: "text-blue-500" },
  ];

  return (
    <div className={cn("w-full py-6", className)}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-4 items-center justify-items-center">
        {dotsList.map(({ Comp, num, name, color }) => (
          <div
            key={num}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-xs group hover:scale-105"
          >
            <Comp size={48} followCursor={true} />
            <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-slate-900 transition">
              Dot {num}
            </span>
            <span className={cn("text-[9px] truncate max-w-[65px] text-center", color)}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
