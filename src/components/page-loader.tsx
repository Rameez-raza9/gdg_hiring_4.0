"use client";

import { cn } from "@/lib/utils";

export function PageLoader({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center p-6 text-center smooth-fade-in",
        className
      )}
    >
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Google color pulse background */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#4285F4]/15 via-[#FBBC04]/10 to-[#34A853]/15 blur-xl animate-pulse" />

        {/* Emblem box */}
        <div className="relative size-16 rounded-2xl border border-border bg-card p-3 shadow-sm flex items-center justify-center">
          <img
            src="/assets/logos/main_logo.jpeg"
            alt="GDGoC SVEC"
            className="size-10 object-contain rounded-lg"
          />
        </div>
      </div>

      {/* 4 Google Brand Quad-Color Animated Jumping Dots */}
      <div className="flex items-center gap-2 mb-3" aria-label="Loading animation">
        <span
          className="size-2.5 rounded-full animate-bounce"
          style={{ background: "#4285F4", animationDelay: "0ms" }}
        />
        <span
          className="size-2.5 rounded-full animate-bounce"
          style={{ background: "#EA4335", animationDelay: "150ms" }}
        />
        <span
          className="size-2.5 rounded-full animate-bounce"
          style={{ background: "#FBBC04", animationDelay: "300ms" }}
        />
        <span
          className="size-2.5 rounded-full animate-bounce"
          style={{ background: "#34A853", animationDelay: "450ms" }}
        />
      </div>

      <p className="text-sm font-medium text-foreground tracking-tight">{message}</p>
      <p className="mt-1 text-xs text-muted-foreground">Google Developer Groups on Campus</p>
    </div>
  );
}
