"use client";

import { useEffect, useState } from "react";

const screens = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
};

/**
 * Checks whether a particular Tailwind CSS viewport size applies.
 */
export const useBreakpoint = (size) => {
    const [matches, setMatches] = useState(
        typeof window !== "undefined" ? window.matchMedia(`(min-width: ${screens[size]})`).matches : true
    );

    useEffect(() => {
        const breakpoint = window.matchMedia(`(min-width: ${screens[size]})`);
        setMatches(breakpoint.matches);

        const handleChange = (event) => setMatches(event.matches);

        breakpoint.addEventListener("change", handleChange);
        return () => breakpoint.removeEventListener("change", handleChange);
    }, [size]);

    return matches;
};
