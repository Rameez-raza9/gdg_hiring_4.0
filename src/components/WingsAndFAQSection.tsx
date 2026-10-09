"use client";

import React, { useState } from "react";
import BookCardDemo, { BookCover } from "@/components/BookCardDemo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Code2,
  Terminal,
  Cloud,
  Cpu,
  Palette,
  Megaphone,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  Dot12,
  Dot11,
  Dot10,
  Dot09,
  Dot08,
  Dot07,
  Dot06,
  Dot05,
  Dot03,
} from "@/components/AnimatedDots";
import { cn } from "@/lib/utils";

const WINGS: {
  id: string;
  name: string;
  category: "Technical" | "Non-Technical";
  icon: any;
  book: BookCover;
  details: string;
}[] = [
  {
    id: "web",
    name: "Web Engineering",
    category: "Technical",
    icon: Code2,
    details:
      "Specializes in modern JavaScript/TypeScript, Next.js App Router, SSR paradigms, Web Vitals optimization, and robust fullstack APIs.",
    book: {
      title: "Web Engineering",
      tagline: "Modern Web, Production Scale",
      credit: "TECH WING • GDGOC SVEC",
      genre: "Fullstack & Frontend",
      gradient: "from-blue-600 to-cyan-400",
      excerpt:
        "We build and maintain production-grade web systems for the college community. Master Next.js 16, Turbopack, Tailwind CSS, and headless UI architectures.",
      lead: "Wing Leads: Front-end Core & Fullstack Devs",
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
  },
  {
    id: "android",
    name: "Android & Mobile",
    category: "Technical",
    icon: Terminal,
    details:
      "Focuses on native Android development with Kotlin & Jetpack Compose, as well as multiplatform engineering using Flutter.",
    book: {
      title: "Android & Flutter",
      tagline: "Mobile First, Seamless UX",
      credit: "TECH WING • GDGOC SVEC",
      genre: "Mobile Development",
      gradient: "from-emerald-500 to-teal-400",
      excerpt:
        "From Kotlin coroutines to state-driven Jetpack Compose layouts and Flutter widgets. We publish college-wide campus apps directly onto Google Play.",
      lead: "Wing Leads: Native Kotlin & Flutter Specialists",
      tags: ["Kotlin", "Compose", "Flutter", "Material 3"],
    },
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    category: "Technical",
    icon: Cloud,
    details:
      "Guides students through Google Cloud Platform (GCP), Firebase, Docker containerization, CI/CD pipelines, and Cloud Study Jams.",
    book: {
      title: "Cloud & GCP",
      tagline: "Infrastructure, Serverless & Scale",
      credit: "TECH WING • GDGOC SVEC",
      genre: "Cloud Architecture",
      gradient: "from-amber-500 to-orange-400",
      excerpt:
        "Deploy serverless Cloud Run services, configure Cloud Functions, orchestrate Firebase databases, and complete Google Cloud Arcade quests with free credits.",
      lead: "Wing Leads: GCP Certified Facilitators",
      tags: ["GCP", "Docker", "Firebase", "DevOps"],
    },
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    category: "Technical",
    icon: Cpu,
    details:
      "Covers Gemini API, multimodal agents, TensorFlow, RAG architectures, and computer vision projects for student problem solving.",
    book: {
      title: "AI & Gemini",
      tagline: "Multimodal Models, Intelligent Agents",
      credit: "TECH WING • GDGOC SVEC",
      genre: "Artificial Intelligence",
      gradient: "from-purple-500 to-indigo-400",
      excerpt:
        "Harness Google AI Studio, Gemini 2.0/1.5 Flash models, agentic workflows, embeddings, and prompt engineering to develop real-world generative applications.",
      lead: "Wing Leads: ML Researchers & GenAI Builders",
      tags: ["Gemini API", "TensorFlow", "Python", "LangChain"],
    },
  },
  {
    id: "design",
    name: "UI/UX & Creative",
    category: "Non-Technical",
    icon: Palette,
    details:
      "Crafts design systems, event branding, posters, Figma interactive prototypes, and follows Material Design 3 guidelines.",
    book: {
      title: "UI/UX & Creative",
      tagline: "Aesthetics, Emotion & Usability",
      credit: "CREATIVE WING • GDGOC SVEC",
      genre: "Product & Graphic Design",
      gradient: "from-rose-500 to-pink-400",
      excerpt:
        "The creative voice of the chapter. We design brand guidelines, prototype user journeys in Figma, construct micro-interactions, and publish social media motion graphics.",
      lead: "Wing Leads: Lead Designers & Brand Strategists",
      tags: ["Figma", "Material You", "Illustrator", "Motion"],
    },
  },
  {
    id: "pr",
    name: "PR & Event Operations",
    category: "Non-Technical",
    icon: Megaphone,
    details:
      "Handles community outreach, hackathon logistics, speaker invitations, sponsorships, and cross-college developer partnerships.",
    book: {
      title: "PR & Operations",
      tagline: "Community, Hackathons & Outreach",
      credit: "OPERATIONS WING • GDGOC SVEC",
      genre: "Event & Outreach Ops",
      gradient: "from-sky-500 to-blue-600",
      excerpt:
        "The heartbeat of GDGoC SVEC. We coordinate multi-track hackathons, manage venue logistics, run social campaigns, and invite industry speakers from Google.",
      lead: "Wing Leads: Community Managers & PR Leads",
      tags: ["Event Logistics", "Public Relations", "Outreach"],
    },
  },
];

const HIRING_FAQS = [
  {
    value: "eligibility",
    question: "Who can apply for GDGoC SVEC recruitment 2026?",
    answer:
      "All students currently enrolled at Sri Vasavi Engineering College (from 1st year to 4th year across any branch including CSE, AIML, AIDS, ECE, EEE, MECH, CIVIL) are eligible to apply. We welcome applicants with both technical and non-technical skills.",
  },
  {
    value: "prerequisites",
    question: "Do I need previous coding experience or projects to apply?",
    answer:
      "Not necessarily! We evaluate curiosity, consistency, and problem-solving passion. For Technical wings (Web, Android, Cloud, AI), basic fundamentals or curiosity to learn are valued. For Non-Technical wings (Design, PR, Operations), creativity, writing, and leadership skills are prioritized.",
  },
  {
    value: "multiple-wings",
    question: "Can I apply to multiple wings or domains?",
    answer:
      "You select your primary track (Technical or Non-Technical) and preferred role during the Formisch recruitment application. You will also have the opportunity during the interaction round to express interest in secondary wings.",
  },
  {
    value: "process",
    question: "What is the selection and evaluation process?",
    answer:
      "1. Application Screening: Review of your Formisch form responses and motivation.\n2. Domain Task / Portfolio Check: A brief hands-on mini task or showcase of your past work.\n3. Informal Peer Discussion: A conversational interview with wing leads to assess culture fit and teamwork.",
  },
  {
    value: "time-commitment",
    question: "What is the expected time commitment for a core wing member?",
    answer:
      "Approximately 3 to 5 hours per week. Activities include organizing weekend study jams, collaborating on team builds, and attending community planning syncs.",
  },
  {
    value: "perks",
    question: "What are the perks of becoming a GDGoC SVEC team member?",
    answer:
      "Access to official Google Cloud credits, direct mentorship from Google Developer Experts (GDEs), verified certificates & GDG badges, hackathon organization experience, and valuable alumni referrals.",
  },
];

export function WingsAndFAQSection() {
  const [selectedWing, setSelectedWing] = useState(WINGS[0]);

  return (
    <div className="w-full space-y-24 py-16 px-4 sm:px-8">
      {/* ── SECTION 1: ABOUT WINGS & INTERACTIVE 3D FOLD BOOK ── */}
      <section id="wings" className="mx-auto max-w-6xl">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <Sparkles size={12} className="text-amber-400" />
            Chapter Wings & Divisions
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Explore Our Specialized Wings
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Drag the cover or click the interactive 3D dossier below to open each wing&apos;s curriculum, leads, and mission.
          </p>
        </div>

        {/* Wing Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {WINGS.map((wing) => {
            const Icon = wing.icon;
            const isSelected = selectedWing.id === wing.id;
            return (
              <button
                key={wing.id}
                onClick={() => setSelectedWing(wing)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium border transition-all cursor-pointer",
                  isSelected
                    ? "border-white bg-white text-black shadow-lg"
                    : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700"
                )}
              >
                <Icon size={15} />
                <span>{wing.name}</span>
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-md font-semibold",
                    isSelected ? "bg-black/10 text-black" : "bg-neutral-800 text-neutral-400"
                  )}
                >
                  {wing.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive 3D Book Stage */}
        <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/40 to-neutral-950 p-6 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Wing Summary Column */}
          <div className="flex-1 space-y-4 max-w-md text-left z-10">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {selectedWing.id === "web" && <Dot05 size={68} followCursor={true} />}
                {selectedWing.id === "android" && <Dot09 size={68} followCursor={true} />}
                {selectedWing.id === "cloud" && <Dot10 size={68} followCursor={true} />}
                {selectedWing.id === "ai" && <Dot08 size={68} followCursor={true} />}
                {selectedWing.id === "design" && <Dot07 size={68} followCursor={true} />}
                {selectedWing.id === "pr" && <Dot06 size={68} followCursor={true} />}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Wing Mascot • SVEC
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {selectedWing.name}
                </h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-300">
              {selectedWing.details}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {selectedWing.book.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-xs text-neutral-300 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="pt-4">
              <a
                href="#apply"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-4 hover:text-neutral-300"
              >
                Apply to join {selectedWing.name} →
              </a>
            </div>
          </div>

          {/* Interactive 3D Book Fold Effect */}
          <div className="flex-1 flex justify-center items-center w-full z-10">
            <BookCardDemo key={selectedWing.id} book={selectedWing.book} />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: SHADCN ACCORDION RECRUITMENT & HIRING FAQS ── */}
      <section id="faqs" className="mx-auto max-w-3xl pt-8 border-t border-neutral-900">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative group flex items-center justify-center">
            <Dot03 size={76} followCursor={true} />
            <div className="absolute -top-3.5 -right-24 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-lg backdrop-blur-md whitespace-nowrap animate-bounce">
              Ask us anything! 💬
            </div>
          </div>
        </div>

        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <HelpCircle size={12} className="text-blue-400" />
            Hiring & Recruitment FAQs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Everything you need to know about joining GDGoC SVEC, interviews, wings, and selection criteria.
          </p>
        </div>

        {/* Shadcn Accordion Component */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 sm:p-8 backdrop-blur-sm">
          <Accordion
            type="single"
            collapsible
            defaultValue="eligibility"
            className="w-full space-y-2"
          >
            {HIRING_FAQS.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value}>
                <AccordionTrigger className="text-sm sm:text-base font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="whitespace-pre-line text-neutral-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
