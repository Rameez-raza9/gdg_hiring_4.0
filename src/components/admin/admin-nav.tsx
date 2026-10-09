"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CheckSquare, ClipboardCheck, Inbox, LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { G } from "@/lib/brand";

const ITEMS: { href: string; label: string; Icon: LucideIcon; color: string }[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, color: G.blue },
  { href: "/admin/applications", label: "Applications", Icon: Inbox, color: G.red },
  { href: "/admin/reviews", label: "Reviews", Icon: ClipboardCheck, color: G.yellow },
  { href: "/admin/attendance", label: "Attendance", Icon: CheckSquare, color: G.green },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart3, color: G.blue },
  { href: "/admin/users", label: "Users", Icon: Users, color: G.red },
];

export default function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {ITEMS.map(({ href, label, Icon, color }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <span
              className="grid size-7 place-items-center rounded-full transition-transform group-hover:scale-110"
              style={{ background: active ? color : `${color}20`, color: active ? "#ffffff" : color }}
            >
              <Icon className="size-3.5" strokeWidth={2.4} />
            </span>
            {label}
            {label === "Applications" && newCount > 0 && (
              <span className="ml-auto rounded-full bg-foreground/10 px-2 py-0.5 text-xs tabular-nums">
                {newCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
