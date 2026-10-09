"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const greetings = [
  { text: "Connect. Learn. Grow.", color: "text-blue-500" },
  { text: "2,426+ Community Members", color: "text-orange-400" },
  { text: "Google Cloud & GenAI Hub", color: "text-emerald-400" },
  { text: "Where Innovation Meets Passion", color: "text-sky-400" },
];

const AnimatedTextRoller = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
      <p className="text-xl sm:text-2xl text-foreground font-medium text-white">
        GDGoC SVEC —
      </p>
      <div className="overflow-hidden h-8 text-center sm:text-left">
        <div
          className="transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${index * 2}rem)` }}
        >
          {greetings.map((g, i) => (
            <p
              key={i}
              className={cn(
                "h-8 flex items-center justify-center sm:justify-start text-xl sm:text-2xl font-bold font-mono",
                g.color
              )}
            >
              {g.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedTextRoller;
