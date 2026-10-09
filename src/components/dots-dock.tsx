"use client";

import { createContext, useContext, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { CircleHelp, House, LogIn, Sparkles, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { G } from "@/components/dot";

/* ---------- dock primitives (with context and magnification) ---------- */

const DockContext = createContext<{
  mouseX: MotionValue<number>;
  size: number;
  magnification: number;
  distance: number;
} | null>(null);

function Dock({
  children,
  size = 44,
  magnification = 64,
  distance = 130,
  className,
}: {
  children: React.ReactNode;
  size?: number;
  magnification?: number;
  distance?: number;
  className?: string;
}) {
  const mouseX = useMotionValue(Infinity);
  return (
    <DockContext.Provider value={{ mouseX, size, magnification, distance }}>
      <motion.nav
        aria-label="Primary"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "flex h-[64px] w-max items-end gap-2.5 rounded-3xl border border-slate-200/80 bg-white/90 px-3 pb-2.5 pt-2",
          "shadow-[0_12px_36px_rgba(0,0,0,0.08)] backdrop-blur-xl",
          className,
        )}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
}

function DockItem({
  href,
  label,
  color,
  Icon,
  active,
}: {
  href: string;
  label: string;
  color: string;
  Icon: LucideIcon;
  active: boolean;
}) {
  const ctx = useContext(DockContext)!;
  const ref = useRef<HTMLDivElement>(null);

  const offset = useTransform(ctx.mouseX, (val) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - b.x - b.width / 2;
  });
  const sizeT = useTransform(
    offset,
    [-ctx.distance, 0, ctx.distance],
    [ctx.size, ctx.magnification, ctx.size],
  );
  const width = useSpring(sizeT, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="group relative aspect-square"
    >
      <span
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap",
          "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background",
          "translate-y-1 opacity-0 transition duration-150 group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        {label}
      </span>
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className="flex size-full items-center justify-center rounded-full text-[#0a0f1c] outline-none ring-offset-2 ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-foreground"
        style={{ backgroundColor: color }}
      >
        <Icon className="size-[46%]" strokeWidth={2.4} />
      </Link>
      {/* active dot */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </motion.div>
  );
}

/* ---------- the site dock ---------- */

const ITEMS = [
  { href: "/", label: "Home", color: G.blue, Icon: House },
  { href: "/#team", label: "Team", color: G.yellow, Icon: Users },
  { href: "/faq", label: "FAQ", color: G.green, Icon: CircleHelp },
  { href: "/apply", label: "Apply now", color: G.red, Icon: Sparkles },
  { href: "/login", label: "Login", color: "#eef1f8", Icon: LogIn },
] as const;

export default function DotsDock() {
  const pathname = usePathname();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto">
        <Dock>
          {ITEMS.map((item) => (
            <DockItem
              key={item.label}
              {...item}
              active={pathname === item.href.split("#")[0] && !item.href.includes("#")}
            />
          ))}
        </Dock>
      </div>
    </div>
  );
}
