import { type ReactNode } from "react";
import { SITE_URL } from "@/lib/constants";

interface BrowserFrameProps {
  children: ReactNode;
  url?: string;
}

export default function BrowserFrame({
  children,
  url = SITE_URL,
}: BrowserFrameProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-10">
      <div className="overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-white shadow-[var(--shadow-soft)]">
        {/* ── Title bar ── */}
        <div className="flex h-12 items-center border-b border-[var(--border-color)] bg-bg-outer px-4">
          {/* Traffic lights */}
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="h-3 w-3 rounded-full bg-[#E0E0E0]" />
            <div className="h-3 w-3 rounded-full bg-[#E0E0E0]" />
            <div className="h-3 w-3 rounded-full bg-[#E0E0E0]" />
          </div>

          {/* Back / Forward */}
          <div
            className="ml-4 flex items-center gap-1.5 text-text-secondary"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* URL pill */}
          <div className="mx-auto flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-white px-3 py-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-text-secondary"
              aria-hidden="true"
            >
              <circle
                cx="6"
                cy="6"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M1.5 6H10.5M6 1.5C7.5 3 8 4.5 8 6C8 7.5 7.5 9 6 10.5M6 1.5C4.5 3 4 4.5 4 6C4 7.5 4.5 9 6 10.5"
                stroke="currentColor"
                strokeWidth="0.8"
              />
            </svg>
            <span className="text-[12px] text-text-secondary">{url}</span>
          </div>

          {/* Right icons */}
          <div
            className="flex items-center gap-2.5 text-text-secondary"
            aria-hidden="true"
          >
            {/* Share */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M4.5 5.5L7 3M7 3L9.5 5.5M7 3V9.5M3 8.5V10.5C3 11.05 3.45 11.5 4 11.5H10C10.55 11.5 11 11.05 11 10.5V8.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Plus */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 3V11M3 7H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Tabs */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="2"
                y="4"
                width="8"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M5 4V3C5 2.45 5.45 2 6 2H11C11.55 2 12 2.45 12 3V8C12 8.55 11.55 9 11 9H10"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* ── Page content ── */}
        <div className="bg-white">{children}</div>
      </div>
    </div>
  );
}
