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

import { signInWithGoogle } from "@/lib/firebase";

export function LoginModal({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate login delay
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    // Redirect to admin dashboard
    window.location.href = "/admin";
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { user, error: signInError } = await signInWithGoogle();
      if (signInError || !user) {
        throw new Error(signInError || "No user returned from Google sign in");
      }
      // Sync user profile to Turso database
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "GDG Member",
          email: user.email,
          photo_url: user.photoURL,
        }),
      });
      window.location.href = "/admin";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(message);
    } finally {
      setGoogleLoading(false);
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
            disabled={loading || googleLoading}
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

          {/* Google SSO Button Option */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <span className="relative bg-neutral-950 px-2 text-[11px] uppercase tracking-wider text-neutral-500">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2.5 h-10 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800/80 text-xs font-medium text-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign in with Google Workspace
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
