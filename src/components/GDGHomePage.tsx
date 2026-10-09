"use client";

import React, { useState } from "react";
import HiringApplicationModal from "@/components/HiringApplicationModal";
import { LoginModal } from "@/components/LoginModal";
import { WingsAndFAQSection } from "@/components/WingsAndFAQSection";
import AppleDockDemo from "@/components/AppleDock";
import DotsHero from "@/components/DotsHero";
import CollapsibleChangelog from "@/components/CollapsibleChangelog";
import DropdownMenu11 from "@/components/DropdownMenu11";
import Team from "@/components/shadcn-space/blocks/team-01/team";
import {
  Code2,
  Users,
  Calendar,
  Send,
  ExternalLink,
} from "lucide-react";
import {
  Dot01,
  Dot04,
  Dot05,
  Dot08,
  Dot09,
  Dot10,
  Dot12,
} from "@/components/AnimatedDots";

const RECENT_EVENTS = [
  {
    title: "Google Cloud Arcade Event 2026",
    date: "15 Jul 2026",
    tag: "Google Cloud Arcade",
    status: "External Registration",
    details: "Hands-on lab quests on Cloud Run, Kubernetes, and BigQuery with free Google Cloud skills boost credits and digital badges.",
    dot: Dot10,
  },
  {
    title: "Wonder of Wonders 2026: Andhra Pradesh",
    date: "4 Jul 2026",
    tag: "State Flagship Event",
    status: "State Meetup",
    details: "Largest inter-campus developer summit uniting GDG chapters across AP with industry keynotes from Google Developer Experts.",
    dot: Dot04,
  },
  {
    title: "AI & Career Builder Bootcamp",
    date: "15 May 2026",
    tag: "Free Registration",
    status: "Hands-on Bootcamp",
    details: "Intensive 3-day workshop introducing Gemini 2.0 API, Prompt Engineering, and building multimodal applications.",
    dot: Dot08,
  },
  {
    title: "Squid Game: Season 2 Tech Challenge",
    date: "17 Mar 2026",
    tag: "Interactive Hack Sprint",
    status: "Competitive Event",
    details: "Fast-paced algorithmic and problem-solving relay race testing clean code, time complexity, and rapid prototyping.",
    dot: Dot09,
  },
];

type TabType = "home" | "wings" | "team" | "events" | "faqs" | "apply";

export default function GDGHomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-neutral-800 selection:text-white pb-32">
      {/* ── Apple Dock Navigation with Tab Switching (Floating at Bottom) ── */}
      <AppleDockDemo activeTab={activeTab} onSelectTab={(t) => setActiveTab(t as TabType)} />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: OVERVIEW & NEW UNIQUE HERO SECTION ─────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "home" && (
        <main className="space-y-16">
          {/* ── DOTS HERO SECTION: 12-TRACK CROWD & COMMUNITY ACTION ── */}
          <DotsHero onNavigateTab={(t) => setActiveTab(t as TabType)} showHeader={false} />

          {/* ── QUICK ACTION TAB CARDS ── */}
          <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Explore Community Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Everything happening at GDGoC SVEC
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab("wings")}
                className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-blue-500/50 transition-all text-left flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Code2 size={20} />
                  </div>
                  <Dot05 size={34} followCursor={true} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    Specialized Wings →
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Explore 3D dossiers for Web, Android, Cloud, AI, Design & PR.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("team")}
                className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-emerald-500/50 transition-all text-left flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <Dot01 size={34} followCursor={true} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Core Organizers →
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Meet the 8 student leads with custom avatars & LinkedIn.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-amber-500/50 transition-all text-left flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <Dot10 size={34} followCursor={true} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    Flagship Events →
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Google Cloud Arcade quests and state-level hack sprints.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("apply")}
                className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-teal-500/50 transition-all text-left flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Send size={20} />
                  </div>
                  <Dot12 size={34} followCursor={true} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                    Join GDGoC SVEC →
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Recruitment is live! Apply for technical and creative roles.
                  </p>
                </div>
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: SPECIALIZED WINGS & 3D FOLD DOSSIER ────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "wings" && (
        <section className="py-8">
          <WingsAndFAQSection />
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: CORE ORGANIZERS & CREATIVE MINDS (WITH AVATARS) ─────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "team" && (
        <section className="py-8">
          <Team />
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 4: RECENT EVENTS & STUDY JAMS ─────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "events" && (
        <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="mb-1">
              <Dot04 size={68} followCursor={true} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Community Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Flagship Events & Study Jams
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Hands-on Google Cloud quests, AI career bootcamps, and state developer meetups hosted by GDGoC SVEC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECENT_EVENTS.map((event) => {
              const EventDot = event.dot;
              return (
                <div
                  key={event.title}
                  className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between space-y-5 hover:border-neutral-700 transition-all shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                        {event.date}
                      </span>
                      <h3 className="text-xl font-bold text-white leading-snug">
                        {event.title}
                      </h3>
                      <span className="inline-block text-[11px] rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-neutral-300">
                        {event.tag}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <EventDot size={48} followCursor={true} />
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-neutral-300">
                    {event.details}
                  </p>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">{event.status}</span>
                    <a
                      href="https://gdg.community.dev/gdg-on-campus-sri-vasavi-engineering-college-tadepalligudem-india/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white inline-flex items-center gap-1 transition"
                    >
                      View on Portal <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 5: HIRING & RECRUITMENT FAQS ───────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "faqs" && (
        <section className="py-8">
          <WingsAndFAQSection />
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 6: DEDICATED RECRUITMENT APPLICATION STATION ───────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "apply" && (
        <section className="py-12 px-4 sm:px-8 max-w-3xl mx-auto space-y-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <Dot12 size={80} followCursor={true} />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Recruitment 2026 Live
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Join the Core Team at GDGoC SVEC
            </h2>
            <p className="text-sm text-neutral-400 max-w-md">
              Whether you build with code (Web, Android, Cloud, AI) or create with words and visuals (Design, PR, Operations), there&apos;s a place for you!
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-2xl flex flex-col items-center space-y-6">
            <div className="space-y-2 text-left w-full max-w-md">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Eligibility: All branches & years (SVEC Tadepalligudem)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>Perks: Google Cloud Credits, verified badges, mentoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Evaluation: Formisch application + portfolio/interview</span>
              </div>
            </div>

            <HiringApplicationModal />
          </div>
        </section>
      )}

      {/* ── BOTTOM SECTION: COLLAPSIBLE CHANGELOG (VERSION 1) ── */}
      <section className="border-t border-neutral-900 bg-neutral-950 py-16 px-4 sm:px-8 mt-16">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Platform Releases
            </span>
            <h3 className="text-2xl font-bold text-white">
              Release Notes & Changelog
            </h3>
            <p className="text-xs text-neutral-400">
              Track platform updates and chapter milestones.
            </p>
          </div>
          <CollapsibleChangelog />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-4 sm:px-8 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl flex flex-col items-center space-y-6">
          {/* Peeking Mascot & Cheer */}
          <div className="flex items-center gap-3">
            <Dot12 size={46} followCursor={true} />
            <span className="text-xs text-neutral-400 font-medium">
              See you at the next GDG study jam & hackathon! 🚀
            </span>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-900">
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="font-semibold text-white">GDGoC SVEC</span> — Sri Vasavi Engineering College, Tadepalligudem, AP, India
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu11 />
              <span>•</span>
              <LoginModal
                trigger={
                  <button className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Team Login
                  </button>
                }
              />
              <span>•</span>
              <a href="/admin" className="text-neutral-400 hover:text-white transition-colors">
                Admin Portal
              </a>
              <span>•</span>
              <a
                href="https://gdg.community.dev/gdg-on-campus-sri-vasavi-engineering-college-tadepalligudem-india/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Official Community Portal ↗
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
