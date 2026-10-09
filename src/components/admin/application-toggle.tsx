"use client";

import { useEffect, useState } from "react";
import { Check, Lock, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApplicationToggle() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setOpen(data?.applications_open ?? true);
      })
      .catch((err) => console.error("Error loading settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async () => {
    if (updating) return;
    setUpdating(true);
    setMessage("");
    const nextState = !open;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applications_open: nextState }),
      });
      const data = await res.json();
      setOpen(nextState);
      setMessage(nextState ? "Applications opened" : "Applications closed");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating settings:", err);
      setMessage("Failed to update. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2.5 rounded-full animate-pulse",
            open ? "bg-green-500" : "bg-red-500",
          )}
        />
        <span className="text-xs font-semibold text-foreground">
          Recruitment: {open ? "Accepting Applications" : "Form Closed"}
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={updating}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer disabled:opacity-60",
          open
            ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
        )}
      >
        {updating ? (
          <Loader2 className="size-3 animate-spin" />
        ) : open ? (
          <>
            <Lock className="size-3" />
            Close Form
          </>
        ) : (
          <>
            <Unlock className="size-3" />
            Open Form
          </>
        )}
      </button>

      {message && (
        <span className="text-xs font-medium text-muted-foreground animate-fade-in">
          {message}
        </span>
      )}
    </div>
  );
}
