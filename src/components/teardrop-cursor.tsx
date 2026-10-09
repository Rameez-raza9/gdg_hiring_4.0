"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { G } from "@/lib/brand";

/**
 * A teardrop that leads the pointer. Its tail always trails behind the
 * direction of travel, and three smaller drops (red, yellow, green) lag behind.
 * Enabled only for fine pointers (mouse / trackpad) and when motion is allowed.
 */

const DROP_PATH =
  "M12 1.5 C12 1.5 4.5 10 4.5 15 a7.5 7.5 0 0 0 15 0 C19.5 10 12 1.5 12 1.5Z";

const INTERACTIVE = "a,button,[role='button'],[role='tab'],input,textarea,select,label,summary";

function Drop({
  x,
  y,
  rot,
  scale,
  color,
  stiffness,
  damping,
  opacity,
  ring,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rot: MotionValue<number>;
  scale: number | MotionValue<number>;
  color: string;
  stiffness: number;
  damping: number;
  opacity: number;
  ring?: boolean;
}) {
  const sx = useSpring(x, { stiffness, damping, mass: 0.4 });
  const sy = useSpring(y, { stiffness, damping, mass: 0.4 });
  const sr = useSpring(rot, { stiffness: stiffness * 0.4, damping: damping * 0.6 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x: sx, y: sy, opacity }}
    >
      {/* body centre (12,15) sits exactly on the pointer */}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{
          rotate: sr,
          scale,
          marginLeft: -12,
          marginTop: -15,
          transformOrigin: "12px 15px",
        }}
      >
        <path
          d={DROP_PATH}
          fill={color}
          stroke={ring ? "rgba(255,255,255,0.9)" : "none"}
          strokeWidth={ring ? 1.2 : 0}
        />
      </motion.svg>
    </motion.div>
  );
}

export default function TeardropCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rot = useMotionValue(-45); // resting pose: tip up-left, like a pointer
  const mainScale = useSpring(1, { stiffness: 300, damping: 18 });

  const last = useRef({ x: 0, y: 0 });
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Check if device supports hover/pointing (desktop/laptop mouse or trackpad)
    const isTouchOnly = window.matchMedia("(pointer: coarse) and (hover: none)").matches;
    if (isTouchOnly) return;
    setEnabled(true);

    const turnTo = (target: number) => {
      const cur = rot.get();
      const diff = ((target - cur + 540) % 360) - 180; // shortest way round
      rot.set(cur + diff);
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        setVisible(true);
        document.documentElement.classList.add("drop-cursor");
      }
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);

      if (Math.hypot(dx, dy) > 3) {
        // tip points away from travel, so the tail trails behind
        turnTo((Math.atan2(dy, dx) * 180) / Math.PI - 90);
      }
      clearTimeout(idle.current);
      idle.current = setTimeout(() => turnTo(-45), 140);

      const el = e.target as Element | null;
      mainScale.set(el?.closest?.(INTERACTIVE) ? 1.7 : 1);
    };
    const onDown = () => mainScale.set(0.8);
    const onUp = () => mainScale.set(1);
    const onLeave = () => {
      setVisible(false);
      document.documentElement.classList.remove("drop-cursor");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("drop-cursor");
      clearTimeout(idle.current);
    };
  }, [visible, x, y, rot, mainScale]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* trail: back to front */}
      <Drop x={x} y={y} rot={rot} scale={0.42} color={G.green} stiffness={70} damping={16} opacity={0.7} />
      <Drop x={x} y={y} rot={rot} scale={0.56} color={G.yellow} stiffness={110} damping={18} opacity={0.8} />
      <Drop x={x} y={y} rot={rot} scale={0.72} color={G.red} stiffness={170} damping={20} opacity={0.9} />
      <Drop x={x} y={y} rot={rot} scale={mainScale} color={G.blue} stiffness={650} damping={38} opacity={1} ring />
    </div>
  );
}
