"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, complete the progress bar
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger progress immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, anchor links, mailto, tel, or download
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        target.hasAttribute("download")
      ) {
        return;
      }

      // If it's navigating to a different path
      const currentUrl = window.location.pathname + window.location.search;
      if (href !== currentUrl) {
        setIsNavigating(true);
        setProgress(25);

        // Incremental trickling progress
        setTimeout(() => setProgress((p) => (p === 25 ? 65 : p)), 180);
        setTimeout(() => setProgress((p) => (p === 65 ? 85 : p)), 500);
      }
    };

    // Also listen to custom navigation events
    const handleStart = () => {
      setIsNavigating(true);
      setProgress(35);
      setTimeout(() => setProgress((p) => (p === 35 ? 75 : p)), 200);
    };

    const handleStop = () => {
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
    };

    window.addEventListener("gdg-nav-start", handleStart);
    window.addEventListener("gdg-nav-stop", handleStop);
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("gdg-nav-start", handleStart);
      window.removeEventListener("gdg-nav-stop", handleStop);
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="pointer-events-none fixed left-0 top-0 z-[99999] h-[3px] w-full overflow-hidden bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] shadow-[0_0_8px_rgba(66,133,244,0.7)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

/** Helper to programmatically start the top loader before router.push */
export function triggerPageLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("gdg-nav-start"));
  }
}

export function stopPageLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("gdg-nav-stop"));
  }
}
