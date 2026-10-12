"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Layers,
  Inbox,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, PageHeader, btnPrimary, btnGhost } from "@/components/admin/ui";

type Phase = {
  letter: string;
  letterColor: string;
  letterBg: string;
  badgeColor: string;
  title: string;
  duration: string;
  timeRange: string;
  subtitle: string;
  description: string;
  questions: {
    text: string;
    note?: string;
  }[];
  scenarios?: {
    track: string;
    prompt: string;
  }[];
  evaluationPoints: string[];
};

const PHASES: Phase[] = [
  {
    letter: "G",
    letterColor: "#4285F4",
    letterBg: "rgba(66, 133, 244, 0.12)",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    title: "GAUGE",
    duration: "5 min",
    timeRange: "Minutes 0–5",
    subtitle: "Know the candidate",
    description:
      "Break the ice, understand the candidate's authentic background, their drive to build, and why they want to represent Google Developer Groups on campus.",
    questions: [
      {
        text: "Introduce yourself and tell me about something you've built or organized.",
        note: "Look for concrete personal ownership rather than just passive course assignments.",
      },
      {
        text: "Why do you want to join GDG, and what can you contribute?",
        note: "Assess whether they understand the community spirit and what distinct skills they bring to the table.",
      },
    ],
    evaluationPoints: [
      "Clarity of communication & self-expression",
      "Authentic enthusiasm for peer learning & community",
      "Evidence of proactive initiative or past creations",
    ],
  },
  {
    letter: "D",
    letterColor: "#EA4335",
    letterBg: "rgba(234, 67, 53, 0.12)",
    badgeColor: "border-red-500/30 bg-red-500/10 text-red-400",
    title: "DEMONSTRATE",
    duration: "5 min",
    timeRange: "Minutes 5–10",
    subtitle: "Test their thinking",
    description:
      "Move beyond prepared introductions into real-world scenario handling and technical depth. Test how they think on their feet under ambiguity or tight deadlines.",
    questions: [
      {
        text: "Give them one role-specific scenario and ask how they would handle it.",
        note: "Use the scenario bank below based on whether the candidate is applying for Technical, Design, or Non-Technical roles.",
      },
      {
        text: "Example: “You have 48 hours to promote a GDG event, but registrations are low. What would you do?”",
        note: "Great candidates offer creative distribution strategies, direct outreach, classroom visits, and student incentives.",
      },
      {
        text: "For technical applicants, ask them to explain a project or solve a small conceptual problem.",
        note: "Test architectural intuition, trade-off understanding, and debugging methodology.",
      },
    ],
    scenarios: [
      {
        track: "Non-Tech / PR / Outreach",
        prompt: "You have 48 hours to promote a GDG event, but registrations are low. What would you do?",
      },
      {
        track: "Web & Mobile Development",
        prompt: "Walk us through how you would architect a real-time event check-in app for 500+ attendees with flaky Wi-Fi.",
      },
      {
        track: "AI & Machine Learning",
        prompt: "How would you fine-tune or prompt an open-weight model to answer SVEC campus queries accurately without hallucination?",
      },
      {
        track: "Cloud & DevOps",
        prompt: "A workshop live demo server crashes 10 minutes into the hands-on session. What is your immediate response?",
      },
      {
        track: "UI/UX & Branding",
        prompt: "The core team needs a full poster & social banner set in 4 hours for a surprise Google speaker. How do you prioritize?",
      },
    ],
    evaluationPoints: [
      "Structured problem solving & logical agility",
      "Calmness when presented with time-bound friction",
      "Practical execution depth over buzzwords",
    ],
  },
  {
    letter: "G",
    letterColor: "#34A853",
    letterBg: "rgba(52, 168, 83, 0.12)",
    badgeColor: "border-green-500/30 bg-green-500/10 text-green-400",
    title: "GROW TOGETHER",
    duration: "5 min",
    timeRange: "Minutes 10–15",
    subtitle: "Assess commitment",
    description:
      "Assess reliability, conflict management, semester workload capacity, and alignment with GDGoC SVEC's 6-month chapter vision.",
    questions: [
      {
        text: "How many hours per week can you realistically commit?",
        note: "Verify their exam schedule, lab commitments, or other club roles to ensure genuine availability.",
      },
      {
        text: "How would you handle a disagreement or missed deadline?",
        note: "Listen for empathy, proactive escalation, and focusing on solutions rather than finger-pointing.",
      },
      {
        text: "What do you want to achieve with GDG over the next six months?",
        note: "Understand their personal goals — do they want to mentor others, build marquee projects, or lead events?",
      },
    ],
    evaluationPoints: [
      "Honesty regarding weekly time dedication (5–8 hrs/wk ideal)",
      "Collaborative maturity & healthy conflict resolution",
      "Personal growth mindset & alignment with chapter roadmap",
    ],
  },
];

export default function AdminInterviewPlanPage() {
  const TOTAL_SECONDS = 15 * 60;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, secondsLeft]);

  const elapsed = TOTAL_SECONDS - secondsLeft;
  const activePhaseIndex =
    elapsed < 5 * 60 ? 0 : elapsed < 10 * 60 ? 1 : 2;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleCheck = (id: string) => {
    setCheckedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(TOTAL_SECONDS);
  };

  const copyPlanScript = () => {
    const text = `GDG 4.0 — 15-Minute Interview Plan

[G] 0–5 MIN · GAUGE · Know the candidate
- Introduce yourself and tell me about something you've built or organized.
- Why do you want to join GDG, and what can you contribute?

[D] 5–10 MIN · DEMONSTRATE · Test their thinking
- Give them one role-specific scenario and ask how they would handle it.
- Example: "You have 48 hours to promote a GDG event, but registrations are low. What would you do?"
- For technical applicants, ask them to explain a project or solve a small conceptual problem.

[G] 10–15 MIN · GROW TOGETHER · Assess commitment
- How many hours per week can you realistically commit?
- How would you handle a disagreement or missed deadline?
- What do you want to achieve with GDG over the next six months?
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="15-Minute Interview Plan"
        description="Standardized G-D-G rubric and live countdown timer for GDGoC SVEC 2026 core team interviews."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyPlanScript}
              className={cn(btnGhost, "text-xs cursor-pointer")}
            >
              {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Copied" : "Copy Script"}</span>
            </button>
            <Link
              href="/admin/reviews"
              className={cn(btnPrimary, "text-xs cursor-pointer")}
            >
              <ClipboardCheck className="size-3.5" />
              <span>Open Scoring Board</span>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Interactive Stopwatch Timer Card */}
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Live Interview Stopwatch
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keep the candidate interview on track. Active phase advances every 5 minutes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl font-extrabold tracking-tight tabular-nums px-4 py-1.5 rounded-xl bg-background border border-border shadow-inner">
                {formatTime(secondsLeft)}
              </div>

              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer",
                  timerRunning
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-primary text-white hover:brightness-105",
                )}
              >
                {timerRunning ? (
                  <>
                    <Pause className="size-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" /> Start Timer
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="rounded-xl border border-border bg-background p-2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Reset timer to 15:00"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>

          {/* 3-Stage Progress Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {PHASES.map((p, idx) => {
              const isActive = activePhaseIndex === idx;
              const isPast = activePhaseIndex > idx;
              return (
                <div key={p.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={cn(isActive ? "text-foreground font-bold" : "text-muted-foreground")}>
                      {p.letter} &bull; {p.title}
                    </span>
                    <span className="text-muted-foreground tabular-nums">{p.duration}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-secondary">
                    <div
                      className={cn("h-full transition-all duration-300", isActive && "animate-pulse")}
                      style={{
                        background: p.letterColor,
                        width: isPast ? "100%" : isActive ? `${Math.min(100, Math.max(0, ((elapsed - idx * 300) / 300) * 100))}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 3-Phase Cards */}
        <div className="space-y-6">
          {PHASES.map((phase, phaseIdx) => {
            const isActive = activePhaseIndex === phaseIdx;
            return (
              <Card
                key={phase.title}
                className={cn(
                  "p-6 transition-all duration-300",
                  isActive ? "border-primary/60 ring-2 ring-primary/10 shadow-md" : "",
                )}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/80 pb-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="size-14 sm:size-16 rounded-2xl flex flex-col items-center justify-center font-black text-2xl shrink-0 border border-border"
                      style={{ background: phase.letterBg, color: phase.letterColor }}
                    >
                      <span>{phase.letter}</span>
                      <span className="text-[9px] font-bold tracking-tight uppercase opacity-85">
                        {phase.duration}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", phase.badgeColor)}>
                          {phase.timeRange}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {phase.subtitle}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {phase.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions Checklist */}
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <HelpCircle className="size-3.5 text-primary" />
                    <span>Questions to Ask</span>
                  </h3>

                  <div className="space-y-2.5">
                    {phase.questions.map((q, qIdx) => {
                      const qId = `admin-${phase.letter}-${qIdx}`;
                      const isChecked = Boolean(checkedQuestions[qId]);
                      return (
                        <div
                          key={qId}
                          onClick={() => toggleCheck(qId)}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-3.5 transition cursor-pointer select-none",
                            isChecked
                              ? "border-green-500/40 bg-green-500/5 text-foreground"
                              : "border-border bg-background/50 hover:bg-muted/40",
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 size-4.5 rounded-md border flex items-center justify-center shrink-0",
                              isChecked
                                ? "border-green-600 bg-green-600 text-white"
                                : "border-border bg-background",
                            )}
                          >
                            {isChecked && <Check className="size-3" strokeWidth={3} />}
                          </div>

                          <div className="flex-1">
                            <p className={cn("text-xs sm:text-sm font-semibold", isChecked && "line-through text-muted-foreground")}>
                              {q.text}
                            </p>
                            {q.note && (
                              <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                                <strong className="font-medium text-foreground/80">Evaluation focus:</strong> {q.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scenarios (Phase D) */}
                {phase.scenarios && (
                  <div className="mt-5 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Layers className="size-3.5 text-[#EA4335]" />
                        <span>Scenario Bank by Track</span>
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {phase.scenarios.map((sc, i) => (
                        <button
                          key={sc.track}
                          type="button"
                          onClick={() => setSelectedScenarioIndex(i)}
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                            selectedScenarioIndex === i
                              ? "bg-foreground text-background font-semibold"
                              : "border border-border bg-card text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {sc.track}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-foreground leading-relaxed">
                      <span className="font-bold text-red-400 block mb-0.5">
                        Prompt for {phase.scenarios[selectedScenarioIndex].track}:
                      </span>
                      &ldquo;{phase.scenarios[selectedScenarioIndex].prompt}&rdquo;
                    </div>
                  </div>
                )}

                {/* Evaluation Criteria */}
                <div className="mt-5 border-t border-dashed border-border pt-4">
                  <div className="flex flex-wrap gap-2">
                    {phase.evaluationPoints.map((point) => (
                      <div
                        key={point}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/60 px-2.5 py-1 text-[11px] text-foreground font-medium"
                      >
                        <CheckCircle2 className="size-3 text-primary shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
