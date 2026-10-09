"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Rocket, Wrench, Zap, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

export const title = "Collapsible Changelog";

type ChangeType = "feature" | "improvement" | "fix" | "breaking";

type Release = {
  version: string;
  date: string;
  changes: { type: ChangeType; description: string }[];
};

const releases: Release[] = [
  {
    version: "v1.0.0",
    date: "October 2026",
    changes: [
      {
        type: "feature",
        description: "Official launch of GDGoC SVEC Chapter website with 2,426+ members.",
      },
      {
        type: "feature",
        description: "Formisch & Valibot recruitment portal with multi-step validation.",
      },
      {
        type: "improvement",
        description: "Interactive 3D Book Fold effect for Web, Android, Cloud, AI & Design Wings.",
      },
      {
        type: "feature",
        description: "Admin panel dashboard with applicant tracking and status actions.",
      },
    ],
  },
];

const changeConfig: Record<
  ChangeType,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  feature: {
    label: "Feature",
    icon: Rocket,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  improvement: {
    label: "Improvement",
    icon: Zap,
    className: "bg-teal-400/10 text-teal-400 border-teal-400/20",
  },
  fix: {
    label: "Fix",
    icon: Bug,
    className: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  },
  breaking: {
    label: "Breaking",
    icon: Wrench,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function CollapsibleChangelog() {
  const [openVersions, setOpenVersions] = useState<Set<string>>(
    new Set([releases[0].version])
  );

  const toggle = (version: string) => {
    setOpenVersions((prev) => {
      const next = new Set(prev);
      next.has(version) ? next.delete(version) : next.add(version);
      return next;
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-2">
      {releases.map((release) => {
        const isOpen = openVersions.has(release.version);
        return (
          <Collapsible
            key={release.version}
            open={isOpen}
            onOpenChange={() => toggle(release.version)}
          >
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden backdrop-blur-sm">
              <CollapsibleTrigger className="w-full flex justify-between items-center px-4 py-3 h-auto rounded-none hover:bg-neutral-800/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white text-sm">
                    {release.version}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {release.date}
                  </span>
                  <span className="text-[10px] rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5">
                    Current Release
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 text-neutral-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="border-t border-neutral-800 px-4 py-3 space-y-2.5">
                  {release.changes.map((change, idx) => {
                    const config = changeConfig[change.type];
                    const Icon = config.icon;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start gap-1 sm:gap-3"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "mt-0.5 shrink-0 gap-1 text-[11px] px-2 py-0.5",
                            config.className
                          )}
                        >
                          <Icon className="size-3" />
                          {config.label}
                        </Badge>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {change.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
