"use client";

import React, { PropsWithChildren, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionProps } from "motion/react";
import {
  Folder,
  Search,
  Inbox,
  Settings,
  Command,
  Compass,
  LucideIcon,
  Home,
  Users,
  Calendar,
  Sparkles,
  HelpCircle,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/LoginModal";
import DropdownMenu11 from "@/components/DropdownMenu11";

export interface AppleDockProps extends VariantProps<typeof appleDockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 42;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const appleDockVariants = cva(
  "supports-backdrop-blur:bg-neutral-900/50 supports-backdrop-blur:dark:bg-black/60 mx-auto flex h-auto w-max items-end justify-center gap-2 sm:gap-4 rounded-3xl border border-neutral-800/90 bg-neutral-950/85 px-4 py-2.5 backdrop-blur-2xl shadow-2xl",
);

export const AppleDock = React.forwardRef<HTMLDivElement, AppleDockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "bottom",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // If direct AppleDockIcon
        if (child.type === AppleDockIcon) {
          return React.cloneElement(child as React.ReactElement<AppleDockIconProps>, {
            mouseX,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification,
            distance: iconDistance,
          });
        }

        // If wrapped in <a> tag or <div>
        const innerProps = (child.props as { children?: React.ReactNode })?.children;
        if (React.isValidElement(innerProps) && innerProps.type === AppleDockIcon) {
          return React.cloneElement(child, {
            children: React.cloneElement(innerProps as React.ReactElement<AppleDockIconProps>, {
              mouseX,
              size: iconSize,
              magnification: iconMagnification,
              disableMagnification,
              distance: iconDistance,
            }),
          } as unknown as Partial<typeof child.props>);
        }

        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(appleDockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

AppleDock.displayName = "AppleDock";

export interface AppleDockIconProps extends Omit<
  MotionProps & React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  label?: string;
  name?: string;
  isActive?: boolean;
  props?: PropsWithChildren;
}

export const AppleDockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  label,
  name,
  isActive,
  ...props
}: AppleDockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(7, size * 0.22);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, targetSize, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="group relative flex flex-col items-center select-none">
      {/* Floating macOS Tooltip Bubble above icon on hover */}
      {label && (
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-neutral-900/95 border border-neutral-700/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50">
          {label}
        </span>
      )}

      {/* Spring Magnifying Icon */}
      <motion.div
        ref={ref}
        style={{ width: scaleSize, height: scaleSize, padding }}
        className={cn(
          "flex aspect-square cursor-pointer items-center justify-center rounded-2xl transition-all duration-150 shadow-md",
          isActive && "ring-2 ring-white/90 shadow-white/10 scale-105",
          disableMagnification && "hover:bg-muted-foreground transition-colors",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-center w-full h-full">{children}</div>
      </motion.div>

      {/* Clear Visible Name Underneath the Icon */}
      {name && (
        <span
          className={cn(
            "text-[10px] font-medium tracking-tight mt-1 transition-colors leading-none",
            isActive ? "text-white font-bold" : "text-neutral-400 group-hover:text-neutral-200"
          )}
        >
          {name}
        </span>
      )}

      {/* macOS Active Dot Indicator */}
      {isActive && (
        <span className="h-1 w-1 rounded-full bg-white shadow-sm mt-0.5" />
      )}
    </div>
  );
};

AppleDockIcon.displayName = "AppleDockIcon";

export default function AppleDockDemo({
  activeTab,
  onSelectTab,
}: {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}) {
  type IconData = {
    tabKey: string;
    IconComponent: LucideIcon;
    bgColor: string;
    textColor: string;
    name: string;
    label: string;
    href?: string;
  };

  const dockIcons: IconData[] = [
    {
      tabKey: "home",
      IconComponent: Home,
      bgColor: "bg-blue-500/15 hover:bg-blue-500/30",
      textColor: "text-blue-400",
      name: "Home",
      label: "Home • GDGoC SVEC",
      href: "#",
    },
    {
      tabKey: "wings",
      IconComponent: Folder,
      bgColor: "bg-emerald-500/15 hover:bg-emerald-500/30",
      textColor: "text-emerald-400",
      name: "Wings",
      label: "Wings • 6 Divisions",
      href: "#wings",
    },
    {
      tabKey: "team",
      IconComponent: Users,
      bgColor: "bg-orange-400/15 hover:bg-orange-400/30",
      textColor: "text-orange-400",
      name: "Team",
      label: "Team • Core Organizers",
      href: "/team-01",
    },
    {
      tabKey: "events",
      IconComponent: Calendar,
      bgColor: "bg-purple-500/15 hover:bg-purple-500/30",
      textColor: "text-purple-400",
      name: "Events",
      label: "Events • Study Jams",
      href: "#events",
    },
    {
      tabKey: "faqs",
      IconComponent: HelpCircle,
      bgColor: "bg-amber-300/15 hover:bg-amber-300/30",
      textColor: "text-amber-300",
      name: "FAQs",
      label: "FAQs • Hiring Answers",
      href: "#faqs",
    },
    {
      tabKey: "apply",
      IconComponent: Inbox,
      bgColor: "bg-teal-400/15 hover:bg-teal-400/30",
      textColor: "text-teal-400",
      name: "Apply",
      label: "Apply • Join GDGoC '26",
      href: "#apply",
    },
    {
      tabKey: "admin",
      IconComponent: Settings,
      bgColor: "bg-red-500/15 hover:bg-red-500/30",
      textColor: "text-red-400",
      name: "Admin",
      label: "Admin • Campus Lead Portal",
      href: "/admin",
    },
  ];

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-end gap-3 max-w-full overflow-x-auto py-1 px-1">
        {/* GDG Chapter Logo Emblem */}
        <a
          href="/"
          onClick={(e) => {
            if (onSelectTab) {
              e.preventDefault();
              onSelectTab("home");
            }
          }}
          className="hidden lg:flex items-center gap-2.5 rounded-3xl border border-neutral-800 bg-neutral-950/85 px-4 h-[66px] backdrop-blur-2xl shadow-2xl transition hover:border-neutral-700 cursor-pointer"
          title="GDGoC SVEC Chapter"
        >
          <img
            src="/logo.jpeg"
            alt="GDGoC SVEC Logo"
            className="h-8 w-8 rounded-full object-cover shadow"
          />
          <div className="text-left">
            <div className="text-xs font-bold tracking-tight text-white leading-tight">
              GDGoC <span className="text-[#4285F4]">SVEC</span>
            </div>
            <div className="text-[10px] text-neutral-400 leading-tight">
              Tadepalligudem
            </div>
          </div>
        </a>

        {/* Magnifying Apple Dock with Visible Names & Tooltips */}
        <AppleDock iconMagnification={58} iconDistance={140} direction="bottom">
          {dockIcons.map(({ tabKey, IconComponent, bgColor, textColor, name, label, href }) => {
            const isSelected = activeTab === tabKey;
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  if (onSelectTab && tabKey !== "admin") {
                    e.preventDefault();
                    onSelectTab(tabKey);
                  }
                }}
                className="cursor-pointer"
              >
                <AppleDockIcon
                  className={cn(bgColor, textColor)}
                  name={name}
                  label={label}
                  isActive={isSelected}
                  aria-label={label}
                >
                  <IconComponent className="w-5 h-5" />
                </AppleDockIcon>
              </a>
            );
          })}
        </AppleDock>

        {/* Quick Utilities: Language Switcher + Team Login */}
        <div className="hidden md:flex items-center gap-2 rounded-3xl border border-neutral-800 bg-neutral-950/85 px-3 h-[66px] backdrop-blur-2xl shadow-2xl">
          <DropdownMenu11 />
          <LoginModal
            trigger={
              <button
                className="flex items-center gap-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition cursor-pointer"
                title="Team Login"
              >
                <LogIn size={13} className="text-emerald-400" />
                <span>Login</span>
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
