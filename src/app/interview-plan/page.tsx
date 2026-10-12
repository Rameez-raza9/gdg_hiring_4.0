"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  HeartHandshake,
  Layers,
  Smile,
  ShieldCheck,
  Compass,
  MessageSquare,
  Code2,
  Calendar,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SiteFooter from "@/components/site-footer";

type Stage = {
  letter: string;
  letterColor: string;
  letterBg: string;
  badgeColor: string;
  title: string;
  headline: string;
  overview: string;
  questions: {
    text: string;
    advice: string;
  }[];
  scenarios?: {
    track: string;
    prompt: string;
    whatWeLookFor: string;
  }[];
  tips: string[];
};

const STAGES: Stage[] = [
  {
    letter: "G",
    letterColor: "#4285F4",
    letterBg: "rgba(66, 133, 244, 0.12)",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "GAUGE",
    headline: "Know the candidate · Getting to know you",
    overview:
      "We begin with a warm, casual conversation to understand who you are, what you enjoy doing, and what sparked your interest in GDGoC SVEC.",
    questions: [
      {
        text: "Introduce yourself and tell me about something you've built or organized.",
        advice:
          "Keep it relaxed and personal. Talk about a mini-project you built, a hackathon you participated in, a campus initiative you contributed to, or an event you helped run. We want to hear what excites you!",
      },
      {
        text: "Why do you want to join GDG, and what can you contribute?",
        advice:
          "Tell us why you want to be a part of the chapter and which cluster you're excited about (Web, Mobile, AI/ML, Cloud, Design, or Non-Tech). Share what energy or skills you'd love to bring to the team.",
      },
    ],
    tips: [
      "Be yourself — no memorized scripts or formal elevator pitches needed.",
      "Focus on genuine passion and things you've actually worked on.",
      "Share what you're excited to learn just as much as what you already know.",
    ],
  },
  {
    letter: "D",
    letterColor: "#EA4335",
    letterBg: "rgba(234, 67, 53, 0.12)",
    badgeColor: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    title: "DEMONSTRATE",
    headline: "Test your thinking · Seeing how your mind works",
    overview:
      "We explore how you approach challenges and solve problems in real-time. There are no trick questions or textbook tests — we care about your curiosity and practical reasoning.",
    questions: [
      {
        text: "We will give you one role-specific scenario and ask how you would handle it.",
        advice:
          "We'll describe a common campus situation related to your track. Take a moment to think, outline 2–3 practical steps, and talk us through your ideas.",
      },
      {
        text: "Example: “You have 48 hours to promote a GDG event, but registrations are low. What would you do?”",
        advice:
          "Think about creative grassroots distribution: engaging WhatsApp community teasers, classroom visits, collaborating with class representatives, or running interactive contests.",
      },
      {
        text: "For technical applicants: Explain a project or solve a small conceptual problem.",
        advice:
          "We may ask you to explain the inner workings of a project you listed on your application. Be ready to explain your tech stack choices, how you debugged a tough problem, or how components connect.",
      },
    ],
    scenarios: [
      {
        track: "Non-Tech / PR & Outreach",
        prompt: "You have 48 hours to promote a GDG event, but registrations are low. What would you do?",
        whatWeLookFor: "Grassroots mobilization, personal classroom announcements, creative teaser media, and word-of-mouth outreach.",
      },
      {
        track: "Web & Mobile Development",
        prompt: "Walk us through how you would architect a real-time event check-in app for 500+ attendees with spotty campus Wi-Fi.",
        whatWeLookFor: "Local-first storage, optimistic UI updates, QR scanning validation, and graceful offline handling.",
      },
      {
        track: "AI & Machine Learning",
        prompt: "How would you build an assistant to answer SVEC campus queries accurately without hallucinations?",
        whatWeLookFor: "Grounding responses using verified campus handbooks (RAG architecture), strict system prompts, and citation fallbacks.",
      },
      {
        track: "Cloud & DevOps",
        prompt: "A workshop live demo server crashes 10 minutes into the hands-on session. What is your immediate response?",
        whatWeLookFor: "Staying calm, communicating a brief buffer with attendees, switching to backup pre-built sandbox environments.",
      },
      {
        track: "UI/UX & Creative Design",
        prompt: "The core team needs a full poster & social banner set in 4 hours for a surprise Google speaker. How do you prioritize?",
        whatWeLookFor: "Leveraging the GDG brand system, prioritizing 1:1 Instagram & WhatsApp banner sizes first, and iterative polish.",
      },
    ],
    tips: [
      "Think out loud! Hearing your thought process is far more valuable than a 'perfect' answer.",
      "Feel free to ask clarifying questions before jumping in.",
      "Practical, realistic solutions are always preferred over abstract buzzwords.",
    ],
  },
  {
    letter: "G",
    letterColor: "#34A853",
    letterBg: "rgba(52, 168, 83, 0.12)",
    badgeColor: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
    title: "GROW TOGETHER",
    headline: "Assess commitment · Mutual fit & culture",
    overview:
      "Community is a team sport. We ensure this role fits seamlessly with your academic semester and helps you achieve your personal goals.",
    questions: [
      {
        text: "How many hours per week can you realistically commit?",
        advice:
          "Be honest about your coursework, lab timings, exams, or other commitments. We value consistent members who dedicate 4–6 hours weekly over someone who overpromises and disappears.",
      },
      {
        text: "How would you handle a disagreement or missed deadline?",
        advice:
          "Show team-first empathy and proactive communication: letting your lead know before a deadline passes, asking for help early, and focusing on solutions rather than blame.",
      },
      {
        text: "What do you want to achieve with GDG over the next six months?",
        advice:
          "Tell us what you want to get out of this experience! Whether it's shipping a marquee open-source project, mentoring peers, delivering tech talks, or building lifelong connections.",
      },
    ],
    tips: [
      "Be honest about your college schedule — academics always come first.",
      "Show how you handle team communication when unexpected blockers arise.",
      "Prepare 1–2 questions for us! The last few minutes are reserved for your questions to the panel.",
    ],
  },
];

export default function InterviewPlanPage() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-85">
            <img
              src="/assets/logos/main_logo.jpeg"
              alt="GDGoC SVEC"
              className="size-8 rounded-xl object-contain border border-border shadow-xs"
            />
            <span className="font-bold text-sm tracking-tight text-foreground">GDGoC SVEC Hiring 4.0</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/faq"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition hidden sm:inline-block"
            >
              Hiring FAQ
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:brightness-105 shadow-xs"
            >
              <span>Apply for Core Team</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-6 py-10 w-full flex-1">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="size-3" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Interview Process Guide</span>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl border border-border bg-card/70 p-6 sm:p-10 shadow-sm backdrop-blur-sm relative overflow-hidden mb-12">
          <div className="pointer-events-none absolute -right-12 -top-12 size-72 rounded-full bg-[#4285F4]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 size-72 rounded-full bg-[#34A853]/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              <Sparkles className="size-3.5 text-[#FBBC04]" />
              <span>Applicant Preparation Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              How your interview is going to be.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              We want you to feel confident and relaxed. Our interview is a friendly ~45-minute conversation with fellow student builders — no high-pressure interrogations or trick questions. Here is exactly how the conversation will flow from start to finish.
            </p>

            {/* Stage Quick Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-blue-600 dark:text-blue-400">
                <span className="size-2 rounded-full bg-[#4285F4]" />
                Stage 1: G — GAUGE (Know You)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-red-600 dark:text-red-400">
                <span className="size-2 rounded-full bg-[#EA4335]" />
                Stage 2: D — DEMONSTRATE (Your Thinking)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1 text-green-600 dark:text-green-400">
                <span className="size-2 rounded-full bg-[#34A853]" />
                Stage 3: G — GROW TOGETHER (Mutual Fit)
              </span>
            </div>
          </div>
        </div>

        {/* What to Expect Overview Cards */}
        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <Smile className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Friendly & Peer-to-Peer</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              You will be speaking with fellow SVEC students who love building. It is a collaborative conversation, not an exam.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Zero Trick Questions</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              We care about your genuine curiosity, initiative, and how you solve problems, rather than memorized textbook facts.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="size-9 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-3">
              <HeartHandshake className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">A Two-Way Street</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              You will also have dedicated time to interview us, ask about chapter culture, and see if GDGoC SVEC is the right home for you.
            </p>
          </div>
        </section>

        {/* The Three Stages Walkthrough */}
        <div className="space-y-10">
          {STAGES.map((stage) => (
            <section
              key={stage.title}
              className="rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-sm relative overflow-hidden"
            >
              {/* Stage Header */}
              <div className="flex items-start gap-4 sm:gap-5 border-b border-border/80 pb-6">
                <div
                  className="size-16 sm:size-20 rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl shrink-0 border border-border shadow-xs"
                  style={{ background: stage.letterBg, color: stage.letterColor }}
                >
                  {stage.letter}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", stage.badgeColor)}>
                      Stage {stage.title === "GAUGE" ? "1" : stage.title === "DEMONSTRATE" ? "2" : "3"} &bull; {stage.title}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {stage.headline}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                    {stage.overview}
                  </p>
                </div>
              </div>

              {/* Questions Walkthrough */}
              <div className="mt-7 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <MessageSquare className="size-3.5 text-primary" />
                  <span>What We Will Discuss</span>
                </h3>

                <div className="space-y-3.5">
                  {stage.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="rounded-2xl border border-border bg-background/60 p-5"
                    >
                      <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        &ldquo;{q.text}&rdquo;
                      </p>
                      <div className="mt-3 flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed rounded-xl bg-card p-3.5 border border-border">
                        <Lightbulb className="size-4 text-[#FBBC04] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground font-semibold">How to approach this:</strong> {q.advice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenario Bank in Stage 2 (D) */}
              {stage.scenarios && (
                <div className="mt-7 rounded-2xl border border-border bg-background p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Layers className="size-3.5 text-[#EA4335]" />
                      <span>Role-Specific Scenario Examples</span>
                    </h4>
                    <span className="text-[11px] text-muted-foreground">Select track to preview</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {stage.scenarios.map((sc, i) => (
                      <button
                        key={sc.track}
                        type="button"
                        onClick={() => setSelectedScenarioIndex(i)}
                        className={cn(
                          "rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer",
                          selectedScenarioIndex === i
                            ? "bg-foreground text-background font-semibold"
                            : "border border-border bg-card text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {sc.track}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5 text-foreground leading-relaxed">
                    <span className="font-bold text-red-600 dark:text-red-400 block text-xs uppercase tracking-wide mb-1">
                      Sample Scenario for {stage.scenarios[selectedScenarioIndex].track}:
                    </span>
                    <p className="text-base sm:text-lg font-semibold mb-2.5">
                      &ldquo;{stage.scenarios[selectedScenarioIndex].prompt}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground border-t border-red-500/20 pt-2.5">
                      <strong className="text-foreground">What a great response sounds like:</strong> {stage.scenarios[selectedScenarioIndex].whatWeLookFor}
                    </p>
                  </div>
                </div>
              )}

              {/* Tips for Candidate */}
              <div className="mt-7 border-t border-dashed border-border pt-5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Tips for this part of the conversation:
                </h4>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {stage.tips.map((tip, tipIdx) => (
                    <div
                      key={tipIdx}
                      className="flex items-start gap-2.5 rounded-xl bg-secondary/50 p-3.5 text-xs text-foreground"
                    >
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Day-of Interview Checklist */}
        <section className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="size-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Interview Day Checklist</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6">
            Everything you need before your interview session:
          </p>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {[
              {
                id: "chk-1",
                label: "College ID Card",
                desc: "Carry your Sri Vasavi Engineering College ID or roll number verification.",
              },
              {
                id: "chk-2",
                label: "Links / Portfolio Ready",
                desc: "Have links to your GitHub, Figma, Behance, or live project demos handy to share.",
              },
              {
                id: "chk-3",
                label: "Comfortable Attire",
                desc: "Wear normal comfortable college clothes — no suits, blazers, or formals required.",
              },
              {
                id: "chk-4",
                label: "Questions for Us",
                desc: "Jot down 1–2 things you are curious about regarding GDGoC SVEC culture and events.",
              },
            ].map((item) => {
              const checked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    "flex items-start gap-3.5 rounded-2xl border p-4 transition cursor-pointer select-none",
                    checked ? "border-green-500/40 bg-green-500/5" : "border-border bg-background/50 hover:bg-muted/40",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                      checked ? "border-green-600 bg-green-600 text-white" : "border-border bg-background",
                    )}
                  >
                    {checked && <Check className="size-3.5" strokeWidth={3} />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground block">{item.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 block leading-relaxed">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ready to apply CTA */}
        <section className="mt-12 rounded-3xl border border-primary/30 bg-primary/10 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Ready to take the next step?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Applications take only about 3 minutes. Pick your tracks, tell us why you want to build with us, and we will see you at the interview!
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 cursor-pointer"
              >
                <span>Submit Your Application</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50"
              >
                <span>Read Recruitment FAQ</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <SiteFooter /> */}
    </div>
  );
}
