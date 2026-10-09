"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { COOKIE_STORAGE_KEY } from "@/lib/constants";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "rejected") => {
    localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[1040px] -translate-x-1/2"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-white p-4 shadow-[var(--shadow-soft)] sm:h-[76px] sm:flex-row sm:items-center sm:gap-0 sm:p-0 sm:px-5">
            {/* Icon + title */}
            <div className="flex shrink-0 items-center gap-2 sm:pr-4">
              <Cookie
                size={20}
                className="shrink-0 text-text-primary"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap text-[14px] font-semibold text-text-primary">
                Cookie Time
              </span>
            </div>

            {/* Divider */}
            <div
              className="hidden h-8 w-px bg-[var(--border-color)] sm:mx-4 sm:block"
              aria-hidden="true"
            />

            {/* Copy */}
            <p className="flex-1 text-[14px] leading-snug text-text-secondary">
              We use cookies to enhance your experience. Learn more in our{" "}
              <a
                href="/cookie-policy"
                className="text-text-primary underline transition-colors hover:text-text-secondary"
              >
                Cookie Policy
              </a>
              .
            </p>

            {/* Buttons */}
            <div className="flex shrink-0 items-center gap-2 sm:ml-4">
              <button
                onClick={() => handleChoice("accepted")}
                className="rounded-lg border border-[var(--border-color)] bg-white px-4 py-2 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-outer"
              >
                Accept
              </button>
              <button
                onClick={() => handleChoice("rejected")}
                className="rounded-lg border border-[var(--border-color)] bg-white px-4 py-2 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-outer"
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
