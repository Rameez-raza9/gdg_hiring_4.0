"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, LogIn, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, G } from "@/components/dot";
import { TRACK_GROUPS } from "@/lib/brand";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const BRANCHES = ["CSE", "IT", "AI & DS", "ECE", "EEE", "Mechanical", "Civil", "Other"];
const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];
const STEPS = ["About you", "Your tracks", "Why join"];
const MAX_TRACKS = 3;

type Form = {
  name: string;
  email: string;
  phone: string;
  roll: string;
  branch: string;
  year: string;
  tracks: string[];
  why: string;
  link: string;
};

const EMPTY: Form = {
  name: "", email: "", phone: "", roll: "", branch: "", year: "",
  tracks: [], why: "", link: "",
};

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 text-foreground";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-sm text-red-500 font-medium">
          {error}
        </span>
      )}
    </label>
  );
}

export default function ApplyPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [applicationsOpen, setApplicationsOpen] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Check applications_open setting
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setApplicationsOpen(data?.applications_open ?? true);
      })
      .catch(() => setApplicationsOpen(true))
      .finally(() => setLoadingSettings(false));
  }, []);

  // Monitor Google Authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
      if (user) {
        setF((prev) => ({
          ...prev,
          name: prev.name || user.displayName || "",
          email: prev.email || user.email || "",
        }));
      }
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthError("");
    setGoogleLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      if (error || !user) {
        throw new Error(error || "Wait some time and try again.");
      }
      setCurrentUser(user);
      setF((prev) => ({
        ...prev,
        name: prev.name || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    } catch (err: unknown) {
      console.error("Google sign in error:", err);
      setAuthError("Failed to sign in. Wait some time and try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
    setGeneralError("");
  };

  const validate = () => {
    const e: typeof errors = {};
    if (step === 0) {
      if (f.name.trim().length < 2) e.name = "Enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid college email.";
      if (!f.roll.trim()) e.roll = "Enter your roll number.";
      if (!f.branch) e.branch = "Choose your branch.";
      if (!f.year) e.year = "Choose your year.";
    }
    if (step === 1 && f.tracks.length === 0) e.tracks = "Pick at least one track.";
    if (step === 2 && f.why.trim().length < 20) e.why = "Write at least a couple of sentences.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    if (step < 2) return setStep(step + 1);

    setSending(true);
    setGeneralError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setGeneralError(data?.error || "Wait some time and try again.");
        setSending(false);
        return;
      }
      setSending(false);
      setDone(true);
    } catch (err) {
      console.error("Apply error:", err);
      setGeneralError("Wait some time and try again.");
      setSending(false);
    }
  };

  const toggleTrack = (t: string) => {
    const has = f.tracks.includes(t);
    if (!has && f.tracks.length >= MAX_TRACKS) {
      setErrors((p) => ({ ...p, tracks: `You can pick up to ${MAX_TRACKS} tracks.` }));
      return;
    }
    set("tracks", has ? f.tracks.filter((x) => x !== t) : [...f.tracks, t]);
  };

  return (
    <div className="dot-glow">
      <div className="dot-grid min-h-screen">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1fr_1.1fr] lg:pt-24">
          {/* Left: copy + mascot */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl text-foreground">
              Join the crowd.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Three short steps. Tell us who you are, which tracks you like,
              and why you want to build with us.
            </p>
            <div className="mt-10 flex items-end gap-1">
              <Dot size={96} color={G.blue} shape="lean" />
              <Dot size={112} color={G.red} shape="round" delay={0.6} />
              <Dot size={92} color={G.yellow} shape="tall" delay={1.2} />
              <Dot size={100} color={G.green} shape="squircle" delay={1.8} />
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Need admin access?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-4">
                Log in to portal
              </Link>
            </p>
          </div>

          {/* Right: form or login gate */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-9">
            {!loadingSettings && !applicationsOpen ? (
              <div className="py-12 text-center space-y-4">
                <AlertCircle className="size-12 text-amber-500 mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">Applications Closed</h2>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                  Applications for this recruitment cycle are currently closed by the GDGoC SVEC core team.
                  Please check back next cycle or follow our upcoming events!
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium transition hover:border-foreground/30 text-foreground"
                >
                  Return to Home
                </Link>
              </div>
            ) : !currentUser ? (
              /* Google Authentication Gate Before Applying */
              <div className="py-8 text-center space-y-5">
                <div className="size-14 rounded-2xl bg-blue-50 text-primary mx-auto flex items-center justify-center border border-blue-100">
                  <LogIn className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Sign in with Google to Apply</h2>
                  <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                    To maintain verified student records and send your application updates, please sign in with your Google account first.
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                    {authError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-border bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-primary" />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <svg className="size-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            ) : done ? (
              <div className="py-10 text-center">
                <div className="mb-6 flex justify-center gap-2" aria-hidden="true">
                  {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
                    <motion.span
                      key={c}
                      initial={{ y: 0 }}
                      animate={{ y: [0, -22, 0] }}
                      transition={{ duration: 0.5, delay: i * 0.12, repeat: 2, repeatDelay: 0.6 }}
                      className="size-4 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Application Submitted! 🎉</h2>
                <p className="mx-auto mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
                  Thanks, {f.name.split(" ")[0]}. A confirmation email has been sent to <strong>{f.email}</strong> with the WhatsApp community link.
                </p>
                <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800">
                  Check your inbox for further updates and interview schedules!
                </div>
                <Link
                  href="/"
                  className="mt-8 inline-block rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium transition hover:border-foreground/30 text-foreground"
                >
                  Back to home
                </Link>
              </div>
            ) : (
              <>
                {/* User indicator */}
                <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground pb-4 border-b border-border">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500" />
                    Signed in as <strong className="text-foreground">{currentUser.email}</strong>
                  </span>
                  <button
                    onClick={() => auth.signOut()}
                    className="hover:underline text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {generalError && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                    {generalError}
                  </div>
                )}

                {/* progress dots */}
                <ol className="mb-8 flex items-center" aria-label="Progress">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex flex-1 items-center last:flex-none" aria-current={i === step ? "step" : undefined}>
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "grid size-6 place-items-center rounded-full border text-xs font-medium transition-colors",
                            i < step && "border-transparent bg-green-500 text-white",
                            i === step && "border-primary bg-primary text-white",
                            i > step && "border-border text-muted-foreground bg-secondary",
                          )}
                        >
                          {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                        </span>
                        <span className={cn("hidden text-sm sm:block", i === step ? "text-foreground font-semibold" : "text-muted-foreground")}>
                          {s}
                        </span>
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="mx-3 h-px flex-1 border-t border-dashed border-border"
                        />
                      )}
                    </li>
                  ))}
                </ol>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {step === 0 && (
                      <>
                        <Field label="Full name" error={errors.name}>
                          <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="As on your college ID" autoComplete="name" />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="College Email" error={errors.email}>
                            <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="student@svec.edu.in" autoComplete="email" />
                          </Field>
                          <Field label="Phone (WhatsApp)">
                            <input type="tel" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91" autoComplete="tel" />
                          </Field>
                        </div>
                        <Field label="Roll number" error={errors.roll}>
                          <input className={inputCls} value={f.roll} onChange={(e) => set("roll", e.target.value.toUpperCase())} placeholder="e.g. 23A81A0501" />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="Branch / Department" error={errors.branch}>
                            <select className={inputCls} value={f.branch} onChange={(e) => set("branch", e.target.value)}>
                              <option value="">Select branch</option>
                              {BRANCHES.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Year of study" error={errors.year}>
                            <select className={inputCls} value={f.year} onChange={(e) => set("year", e.target.value)}>
                              <option value="">Select year</option>
                              {YEARS.map((y, idx) => (
                                <option key={y} value={idx + 1}>{y}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Pick up to {MAX_TRACKS} tracks you&apos;d like to participate in.
                          </p>
                          {errors.tracks && (
                            <p role="alert" className="mt-1.5 text-sm text-red-500 font-medium">
                              {errors.tracks}
                            </p>
                          )}
                        </div>

                        {TRACK_GROUPS.map((g) => (
                          <div key={g.group} className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {g.group}
                            </h3>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {g.tracks.map((t) => {
                                const on = f.tracks.includes(t.id);
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => toggleTrack(t.id)}
                                    className={cn(
                                      "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer",
                                      on
                                        ? "border-primary bg-primary/10 text-foreground"
                                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                                    )}
                                  >
                                    <span
                                      className="size-3 rounded-full shrink-0"
                                      style={{ background: t.color }}
                                      aria-hidden="true"
                                    />
                                    <span className="flex-1 text-sm font-medium">{t.label}</span>
                                    {on && <Check className="size-4 text-primary" strokeWidth={2.5} />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {step === 2 && (
                      <>
                        <Field label="Why do you want to join GDGoC SVEC?" error={errors.why}>
                          <textarea
                            rows={4}
                            className={inputCls}
                            value={f.why}
                            onChange={(e) => set("why", e.target.value)}
                            placeholder="Tell us what you're excited to learn, build, or contribute..."
                          />
                        </Field>
                        <Field label="Portfolio, GitHub, or LinkedIn (optional)">
                          <input
                            type="url"
                            className={inputCls}
                            value={f.link}
                            onChange={(e) => set("link", e.target.value)}
                            placeholder="https://"
                          />
                        </Field>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer font-medium"
                    >
                      &larr; Back
                    </button>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={next}
                    disabled={sending}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105 cursor-pointer disabled:opacity-50"
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Submitting...
                      </span>
                    ) : step === 2 ? (
                      "Submit application"
                    ) : (
                      "Continue &rarr;"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
