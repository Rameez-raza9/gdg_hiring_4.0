"use client";

import { useState, type FormEvent } from "react";
import { EMAIL_PLACEHOLDER } from "@/lib/constants";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="w-full max-w-[350px]">
        <div className="flex items-center gap-2 rounded-[10px] border border-[var(--accent-border)] px-4 py-3 bg-accent-10">
          <span className="text-lg" aria-hidden="true">
            🎉
          </span>
          <span className="text-sm font-medium text-text-primary">
            You&apos;re in! Check your email for next steps.
          </span>
        </div>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className="w-full max-w-[350px]">
      {/* Speech-bubble notch */}
      <div className="relative">
        <div
          className="absolute -top-[6px] left-5 z-10 h-3 w-3 rotate-45 border-l border-t border-[var(--border-color)] bg-white"
          aria-hidden="true"
        />

        <form
          onSubmit={handleSubmit}
          className="relative flex h-[46px] items-center rounded-[10px] border border-[var(--border-color)] bg-white shadow-[var(--shadow-soft)]"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={EMAIL_PLACEHOLDER}
            className="h-full flex-1 rounded-l-[10px] bg-transparent px-4 text-[14px] text-text-primary placeholder:text-text-secondary focus:outline-none"
            aria-label="College email address"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="mr-1.5 shrink-0 rounded-lg px-4 py-1.5 text-[14px] font-medium text-text-primary transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: "var(--accent)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {status === "loading" ? "Joining…" : "Join now"}
          </button>
        </form>
      </div>

      {status === "error" && (
        <p className="mt-1.5 text-xs text-red-500" role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
