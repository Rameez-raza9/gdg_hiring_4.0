"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, LogIn, AlertCircle, Plus, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { G } from "@/lib/brand";
import { TRACK_GROUPS } from "@/lib/brand";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { sfx } from "@/lib/audio";
import {
  Dot01, Dot02, Dot03, Dot04, Dot05, Dot06, Dot07, Dot08, Dot09, Dot10, Dot11, Dot12
} from "@/components/AnimatedDots";

const BRANCHES = [
  "CSE",
  "CSE-AI",
  "AIML",
  "IT",
  "AI & DS",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "Other",
];

const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];
const STEPS = ["About you", "Your tracks", "Clubs & Links", "Why join"];
const MAX_TRACKS = 3;

const OTHER_CLUBS_LIST = [
  "MMLSC SVEC",
  "AWS Community Clubs SVEC",
  "SVAN",
  "TEDx Vasavi",
  "Dance Club",
  "Photography Club",
];

const CLUB_ROLES = ["Member", "Associate", "Lead"];

export type ExtraLink = {
  label: string;
  url: string;
};

type Form = {
  name: string;
  email: string;
  phone: string;
  roll: string;
  branch: string;
  year: string;
  tracks: string[];
  otherClubs: string[];
  otherClubCustom: string;
  clubRole: string;
  github: string;
  linkedin: string;
  portfolio: string;
  extraLinks: ExtraLink[];
  why: string;
  link: string;
};

const EMPTY: Form = {
  name: "",
  email: "",
  phone: "",
  roll: "",
  branch: "",
  year: "",
  tracks: [],
  otherClubs: [],
  otherClubCustom: "",
  clubRole: "Member",
  github: "",
  linkedin: "",
  portfolio: "",
  extraLinks: [],
  why: "",
  link: "",
};

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 text-foreground";

function FieldHeaderDot({ dotIndex = 1 }: { dotIndex?: number }) {
  const size = 32;
  switch (dotIndex) {
    case 1: return <Dot01 size={size} />;
    case 2: return <Dot02 size={size} />;
    case 3: return <Dot03 size={size} />;
    case 4: return <Dot04 size={size} />;
    case 5: return <Dot05 size={size} />;
    case 6: return <Dot06 size={size} />;
    case 7: return <Dot07 size={size} />;
    case 8: return <Dot08 size={size} />;
    case 9: return <Dot09 size={size} />;
    case 10: return <Dot10 size={size} />;
    case 11: return <Dot11 size={size} />;
    case 12: return <Dot12 size={size} />;
    default: return <Dot01 size={size} />;
  }
}

function Field({
  label,
  error,
  dotIndex,
  tooltip,
  children,
}: {
  label: string;
  error?: string;
  dotIndex?: number;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dotIndex && (
            <div className="flex shrink-0 items-center justify-center p-0.5 rounded-full bg-slate-50 border border-slate-200">
              <FieldHeaderDot dotIndex={dotIndex} />
            </div>
          )}
          <span className="text-sm font-semibold text-foreground tracking-tight">{label}</span>
        </div>
        {tooltip && (
          <span className="group relative cursor-help text-xs text-muted-foreground">
            <HelpCircle className="size-3.5 inline mr-1 text-slate-400" />
            <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-48 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
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
      sfx.playSuccess();
      setCurrentUser(user);
      setF((prev) => ({
        ...prev,
        name: prev.name || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    } catch (err: unknown) {
      console.error("Google sign in error:", err);
      sfx.playError();
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

  const addExtraLink = () => {
    sfx.playPop();
    setF((p) => ({
      ...p,
      extraLinks: [...p.extraLinks, { label: "Project", url: "" }],
    }));
  };

  const updateExtraLink = (idx: number, field: "label" | "url", val: string) => {
    setF((p) => {
      const next = [...p.extraLinks];
      next[idx] = { ...next[idx], [field]: val };
      return { ...p, extraLinks: next };
    });
  };

  const removeExtraLink = (idx: number) => {
    sfx.playPop();
    setF((p) => ({
      ...p,
      extraLinks: p.extraLinks.filter((_, i) => i !== idx),
    }));
  };

  const toggleClub = (club: string) => {
    sfx.playPop();
    setF((p) => {
      const exists = p.otherClubs.includes(club);
      return {
        ...p,
        otherClubs: exists
          ? p.otherClubs.filter((c) => c !== club)
          : [...p.otherClubs, club],
      };
    });
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

    if (step === 1) {
      if (f.tracks.length === 0) e.tracks = "Pick at least one track.";
    }

    if (step === 2) {
      if (!f.github.trim()) e.github = "GitHub profile link is mandatory.";
      if (!f.linkedin.trim()) e.linkedin = "LinkedIn profile link is mandatory.";
      if (!f.portfolio.trim()) e.portfolio = "Portfolio / project showcase link is mandatory.";
    }

    if (step === 3) {
      if (f.why.trim().length < 20) e.why = "Write at least a couple of sentences on your motivation.";
    }

    setErrors(e);
    const valid = Object.keys(e).length === 0;
    if (valid) {
      sfx.playSuccess();
    } else {
      sfx.playError();
    }
    return valid;
  };

  const next = async () => {
    if (!validate()) return;
    if (step < 3) return setStep(step + 1);

    // Final Submission
    setSending(true);
    setGeneralError("");

    // Consolidate all clubs
    const finalClubs = [...f.otherClubs];
    if (f.otherClubCustom.trim()) {
      finalClubs.push(f.otherClubCustom.trim());
    }

    const payload = {
      ...f,
      otherClubs: finalClubs,
      link: f.portfolio || f.github || f.linkedin,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        sfx.playError();
        setGeneralError(data?.error || "Wait some time and try again.");
        setSending(false);
        return;
      }
      sfx.playSuccess();
      setSending(false);
      setDone(true);
    } catch (err) {
      console.error("Apply error:", err);
      sfx.playError();
      setGeneralError("Wait some time and try again.");
      setSending(false);
    }
  };

  const toggleTrack = (t: string) => {
    sfx.playPop();
    const has = f.tracks.includes(t);
    if (!has && f.tracks.length >= MAX_TRACKS) {
      setErrors((p) => ({ ...p, tracks: `You can pick up to ${MAX_TRACKS} tracks.` }));
      sfx.playError();
      return;
    }
    set("tracks", has ? f.tracks.filter((x) => x !== t) : [...f.tracks, t]);
  };

  return (
    <div className="dot-glow">
      <div className="dot-grid min-h-screen">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1fr_1.1fr] lg:pt-24">
          {/* Left: copy + official logo */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logos/main_logo.jpeg"
                alt="GDGoC SVEC Logo"
                className="size-11 rounded-xl object-contain border border-border shadow-sm"
              />
              <span className="font-bold text-lg text-foreground tracking-tight">GDGoC SVEC Hiring 4.0</span>
            </div>

            <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl text-foreground">
              Join the crowd.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Four steps to tell us who you are, which tracks you love, your club involvements,
              and your links to build with Google on campus.
            </p>
            <div className="mt-10 flex items-end gap-1">
              <Dot01 size={86} />
              <Dot02 size={96} />
              <Dot03 size={86} />
              <Dot04 size={92} />
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Need reviewer or admin access?{" "}
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
                    To maintain verified student records and deliver status updates to your email, please sign in with your Google account first.
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
                  <Dot01 size={64} />
                  <Dot02 size={64} />
                  <Dot03 size={64} />
                  <Dot04 size={64} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Application Submitted! 🎉</h2>
                <p className="mx-auto mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
                  Thanks, {f.name.split(" ")[0]}. A confirmation email has been sent to <strong>{f.email}</strong> with your WhatsApp updates community link.
                </p>
                <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800">
                  Check your inbox for interview updates and recruitment schedules!
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

                {/* Progress Indicators with Dot Mascots */}
                <ol className="mb-8 flex items-center" aria-label="Progress">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex flex-1 items-center last:flex-none" aria-current={i === step ? "step" : undefined}>
                      <span className="flex items-center gap-2">
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
                        <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>
                          {s}
                        </span>
                      </span>
                      {i < STEPS.length - 1 && (
                        <span aria-hidden="true" className="mx-2.5 h-px flex-1 border-t border-dashed border-border" />
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
                    {/* STEP 0: Personal & Academic Details */}
                    {step === 0 && (
                      <>
                        <Field label="Full Name" error={errors.name} dotIndex={1} tooltip="Enter your name as printed on college ID">
                          <input
                            className={inputCls}
                            value={f.name}
                            onChange={(e) => set("name", e.target.value)}
                            onBlur={() => { f.name.length >= 2 ? sfx.playSuccess() : sfx.playError(); }}
                            placeholder="As on your college ID"
                            autoComplete="name"
                          />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="College Email" error={errors.email} dotIndex={2}>
                            <input
                              type="email"
                              className={inputCls}
                              value={f.email}
                              onChange={(e) => set("email", e.target.value)}
                              onBlur={() => { /^\S+@\S+\.\S+$/.test(f.email) ? sfx.playSuccess() : sfx.playError(); }}
                              placeholder="student@svec.edu.in"
                              autoComplete="email"
                            />
                          </Field>
                          <Field label="Phone (WhatsApp)" dotIndex={3}>
                            <input
                              type="tel"
                              className={inputCls}
                              value={f.phone}
                              onChange={(e) => set("phone", e.target.value)}
                              placeholder="+91"
                              autoComplete="tel"
                            />
                          </Field>
                        </div>

                        <Field label="Roll Number" error={errors.roll} dotIndex={4}>
                          <input
                            className={inputCls}
                            value={f.roll}
                            onChange={(e) => set("roll", e.target.value.toUpperCase())}
                            onBlur={() => { f.roll.trim() ? sfx.playSuccess() : sfx.playError(); }}
                            placeholder="e.g. 23A81A0501"
                          />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="Branch / Department" error={errors.branch} dotIndex={5} tooltip="Now includes CSE-AI and AIML">
                            <select
                              className={inputCls}
                              value={f.branch}
                              onChange={(e) => { set("branch", e.target.value); sfx.playPop(); }}
                            >
                              <option value="">Select branch</option>
                              {BRANCHES.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Year of Study" error={errors.year} dotIndex={6}>
                            <select
                              className={inputCls}
                              value={f.year}
                              onChange={(e) => { set("year", e.target.value); sfx.playPop(); }}
                            >
                              <option value="">Select year</option>
                              {YEARS.map((y, idx) => (
                                <option key={y} value={idx + 1}>{y}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      </>
                    )}

                    {/* STEP 1: Track Selection */}
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

                    {/* STEP 2: Other Clubs & Mandatory Links */}
                    {step === 2 && (
                      <div className="space-y-6">
                        {/* Campus Clubs Checkboxes */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FieldHeaderDot dotIndex={7} />
                            <label className="text-sm font-semibold text-foreground">
                              Are you currently in any other campus clubs?
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            Select all that apply at Sri Vasavi Engineering College:
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {OTHER_CLUBS_LIST.map((club) => {
                              const checked = f.otherClubs.includes(club);
                              return (
                                <button
                                  key={club}
                                  type="button"
                                  onClick={() => toggleClub(club)}
                                  className={cn(
                                    "flex items-center gap-2.5 rounded-xl border p-3 text-left transition text-xs font-medium cursor-pointer",
                                    checked
                                      ? "border-primary bg-primary/10 text-foreground"
                                      : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                                  )}
                                >
                                  <div className={cn("size-4 rounded border flex items-center justify-center", checked ? "bg-primary border-primary text-white" : "border-slate-300")}>
                                    {checked && <Check className="size-3" strokeWidth={3} />}
                                  </div>
                                  <span>{club}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-3">
                            <input
                              type="text"
                              className={inputCls}
                              value={f.otherClubCustom}
                              onChange={(e) => set("otherClubCustom", e.target.value)}
                              placeholder="Other club / society name (if any)"
                            />
                          </div>
                        </div>

                        {/* Role in Other Clubs */}
                        <Field label="What is your current role in those clubs?" dotIndex={8}>
                          <select
                            className={inputCls}
                            value={f.clubRole}
                            onChange={(e) => { set("clubRole", e.target.value); sfx.playPop(); }}
                          >
                            {CLUB_ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </Field>

                        {/* Mandatory Links: GitHub, LinkedIn, Portfolio */}
                        <div className="border-t border-dashed border-border pt-5 space-y-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Profile Links (Mandatory)
                          </p>

                          <Field label="GitHub Profile URL (Mandatory)" error={errors.github} dotIndex={9}>
                            <input
                              type="url"
                              className={inputCls}
                              value={f.github}
                              onChange={(e) => set("github", e.target.value)}
                              onBlur={() => { f.github.trim() ? sfx.playSuccess() : sfx.playError(); }}
                              placeholder="https://github.com/username"
                            />
                          </Field>

                          <Field label="LinkedIn Profile URL (Mandatory)" error={errors.linkedin} dotIndex={10}>
                            <input
                              type="url"
                              className={inputCls}
                              value={f.linkedin}
                              onChange={(e) => set("linkedin", e.target.value)}
                              onBlur={() => { f.linkedin.trim() ? sfx.playSuccess() : sfx.playError(); }}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </Field>

                          <Field label="Portfolio / Project Link (Mandatory)" error={errors.portfolio} dotIndex={11}>
                            <input
                              type="url"
                              className={inputCls}
                              value={f.portfolio}
                              onChange={(e) => set("portfolio", e.target.value)}
                              onBlur={() => { f.portfolio.trim() ? sfx.playSuccess() : sfx.playError(); }}
                              placeholder="https://yourportfolio.dev or project URL"
                            />
                          </Field>
                        </div>

                        {/* Dynamic Extra Links with + Button */}
                        <div className="border-t border-dashed border-border pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Additional Links / Demos
                            </span>
                            <button
                              type="button"
                              onClick={addExtraLink}
                              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                            >
                              <Plus className="size-3.5" /> Add more link
                            </button>
                          </div>

                          {f.extraLinks.map((link, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => updateExtraLink(idx, "label", e.target.value)}
                                placeholder="Label (e.g. Behance, Hackerrank)"
                                className={cn(inputCls, "w-1/3 text-xs py-2")}
                              />
                              <input
                                type="url"
                                value={link.url}
                                onChange={(e) => updateExtraLink(idx, "url", e.target.value)}
                                placeholder="https://"
                                className={cn(inputCls, "flex-1 text-xs py-2")}
                              />
                              <button
                                type="button"
                                onClick={() => removeExtraLink(idx)}
                                className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Statement of Interest */}
                    {step === 3 && (
                      <Field label="Why do you want to join GDGoC SVEC?" error={errors.why} dotIndex={12} tooltip="Write at least 20 characters explaining your interest">
                        <textarea
                          rows={6}
                          className={inputCls}
                          value={f.why}
                          onChange={(e) => set("why", e.target.value)}
                          onBlur={() => { f.why.trim().length >= 20 ? sfx.playSuccess() : sfx.playError(); }}
                          placeholder="Tell us what you're excited to learn, build, or contribute to GDGoC SVEC..."
                        />
                      </Field>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => { sfx.playPop(); setStep(step - 1); }}
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
                    ) : step === 3 ? (
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
