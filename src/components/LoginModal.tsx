"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { Dot10 } from "@/components/AnimatedDots";

export function LoginModal({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "User not found or account deactivated");
      }

      // Store in session storage
      sessionStorage.setItem("gdg_admin_authorized", "true");
      sessionStorage.setItem("gdg_admin_name", data.user.name);
      sessionStorage.setItem("gdg_admin_email", data.user.email);
      sessionStorage.setItem("gdg_admin_role", data.user.role);
      if (data.user.photo_url) {
        sessionStorage.setItem("gdg_admin_photo", data.user.photo_url);
      } else {
        sessionStorage.removeItem("gdg_admin_photo");
      }

      window.location.href = "/admin";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            className="text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-full px-4 h-9 cursor-pointer"
          >
            Login
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] border-neutral-800 bg-neutral-950 p-6 sm:p-8 text-white shadow-2xl">
        <DialogHeader className="space-y-2 text-center items-center">
          {/* Interactive Mascot */}
          <div className="mb-1">
            <Dot10 size={54} followCursor={true} />
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            GDGoC Portal Login
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-xs max-w-xs mx-auto">
            Log in to manage workshops, review member applications, or access the admin panel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="login-email" className="text-xs text-neutral-300">
              College Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="lead@svec.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-900 border-neutral-800 focus-visible:ring-neutral-400 text-white placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-xs text-neutral-300">
                Password
              </Label>
              <a
                href="#"
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Forgot?
              </a>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-900 border-neutral-800 focus-visible:ring-neutral-400 text-white placeholder:text-neutral-600"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-white text-black hover:bg-neutral-200 font-semibold rounded-lg mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Login to Portal
                <ArrowRight size={15} />
              </>
            )}
          </Button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <span className="relative bg-neutral-950 px-2 text-[11px] uppercase tracking-wider text-neutral-500">
              Or
            </span>
          </div>

          <a
            href="/login"
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800/80 text-xs font-medium text-neutral-200 transition-colors"
          >
            Team 1-Click Login Page
            <ArrowRight size={14} className="text-neutral-400" />
          </a>
        </form>
      </DialogContent>
    </Dialog>
  );
}
