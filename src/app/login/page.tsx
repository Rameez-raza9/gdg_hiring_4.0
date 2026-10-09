"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, G } from "@/components/dot";
import { signInWithGoogle, initAnalytics } from "@/lib/firebase";

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [focusPw, setFocusPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    initAnalytics();
  }, []);

  // The mascot covers its eyes while the password is hidden and being typed.
  const shy = focusPw && !show;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    setLoading(true);
    try {
      // Sync user to Turso
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data?.isAdmin || email.trim().toLowerCase() === "vinaysiddha19@gmail.com") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Couldn't sign in. Check your details and try again.");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { user, error: authError } = await signInWithGoogle();
      if (authError || !user) {
        setError(authError || "Google sign-in was canceled or failed.");
        setGoogleLoading(false);
        return;
      }

      // Sync user record to Turso
      let isAdmin = false;
      try {
        const syncRes = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.uid,
            name: user.displayName || user.email?.split("@")[0],
            email: user.email,
            photoUrl: user.photoURL,
          }),
        });
        const syncData = await syncRes.json();
        isAdmin = syncData?.isAdmin || (user.email?.trim().toLowerCase() === "vinaysiddha19@gmail.com");
      } catch (err) {
        console.error("Failed to sync user to database:", err);
        isAdmin = user.email?.trim().toLowerCase() === "vinaysiddha19@gmail.com";
      }

      if (isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="dot-glow">
      <div className="dot-grid flex min-h-screen items-center justify-center px-6 pb-32 pt-16">
        <div className="w-full max-w-md">
          <div className="relative z-10 -mb-8 flex justify-center">
            <Dot size={124} color={G.blue} shape="lean" shy={shy} still={shy} />
          </div>

          <div className="rounded-3xl border border-border bg-card p-7 pt-12 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-9 sm:pt-12">
            <h1 className="text-center text-3xl font-medium tracking-[-0.03em]">
              Welcome back
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Log in to your GDGoC SVEC account.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lead@svec.edu.in"
                  autoComplete="email"
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-sm font-medium">
                  Password
                  <Link
                    href="#"
                    className="text-xs font-normal text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </span>
                <span className="relative block">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusPw(true)}
                    onBlur={() => setFocusPw(false)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    className={cn(inputCls, "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </span>
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border border-green-300/60 bg-[#74E38A] py-3 text-sm font-medium text-neutral-950 transition hover:brightness-95 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 border-t border-dashed border-border" />
              <span className="flex gap-1.5">
                {[G.blue, G.red, G.yellow, G.green].map((c) => (
                  <i key={c} className="size-1.5 rounded-full" style={{ background: c }} />
                ))}
              </span>
              <span className="h-px flex-1 border-t border-dashed border-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 text-sm font-medium transition hover:border-foreground/30 disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Connecting with Google...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                    <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8.1z" />
                    <path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1-3.7 1-2.8 0-5.2-1.9-6-4.5H2.4v2.8A11 11 0 0 0 12 23z" />
                    <path fill="#FBBC04" d="M6 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.4a11 11 0 0 0 0 9.8L6 14.1z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/apply" className="text-foreground underline underline-offset-4">
                Apply now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
