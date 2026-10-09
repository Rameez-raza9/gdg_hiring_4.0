"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, G } from "@/components/dot";

type Category = "General" | "Joining" | "Events" | "Projects";

const CATEGORY_COLOR: Record<Category, string> = {
  General: G.blue,
  Joining: G.red,
  Events: G.yellow,
  Projects: G.green,
};

const FAQS: { q: string; a: string; c: Category }[] = [
  {
    c: "General",
    q: "What is GDGoC SVEC?",
    a: "Google Developer Groups on Campus at Sri Vasavi Engineering College is a student-run community that learns Google technologies together through workshops, study jams, talks and hackathons.",
  },
  {
    c: "General",
    q: "Do I need to be a computer science student?",
    a: "No. Students from any branch are welcome. Non-technical tracks (Event Management, Public Relations & Outreach, Social Media & Marketing, Creative Design) don't need coding experience.",
  },
  {
    c: "General",
    q: "Which tracks can I follow?",
    a: "Technical: GenAI & AIML, Cloud & DevOps, Web and App, and Coding and Programming. Non-Technical: Event Management, Public Relations & Outreach, Social Media & Marketing, and Creative Design. You can pick up to three when you apply.",
  },
  {
    c: "Joining",
    q: "How do I join?",
    a: "Fill in the application form. It has three short steps: about you, your tracks, and why you want to join. We review applications and reach out by email.",
  },
  {
    c: "Joining",
    q: "Is there a membership fee?",
    a: "Joining the community is free. If a specific event or workshop has a cost, it will be announced with the event details.",
  },
  {
    c: "Joining",
    q: "Can first-year students apply?",
    a: "Yes. Every year is welcome, and many members start with no experience in their track.",
  },
  {
    c: "Events",
    q: "What kind of events do you run?",
    a: "Hands-on workshops, Cloud Study Jams, speaker sessions, coding contests and hackathons, usually on campus.",
  },
  {
    c: "Events",
    q: "Where do I hear about upcoming events?",
    a: "Event announcements go out by email to members and on our community page. Following our social accounts also works.",
  },
  {
    c: "Projects",
    q: "Can I build projects with the community?",
    a: "Yes. Members form small teams around track projects, get feedback from leads, and demo what they build at community events.",
  },
  {
    c: "Projects",
    q: "I'm a complete beginner. Where do I start?",
    a: "Pick one track, attend its next workshop, and ask your track lead for a first small project. Starting small is the plan.",
  },
];

function Item({ q, a, c, open, onToggle }: (typeof FAQS)[number] & { open: boolean; onToggle: () => void }) {
  const color = CATEGORY_COLOR[c];
  return (
    <div className="border-b border-border">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center gap-4 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 cursor-pointer"
        >
          <motion.span
            aria-hidden="true"
            animate={{ scale: open ? 1.5 : 1, backgroundColor: open ? color : "rgba(141,151,179,0.35)" }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="size-2.5 shrink-0 rounded-full"
          />
          <span className="flex-1 text-lg font-medium tracking-tight">{q}</span>
          <Plus
            className={cn(
              "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
              open && "rotate-45 text-foreground",
            )}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-[26px] pr-10 leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = FAQS.filter((f) => filter === "All" || f.c === filter);

  return (
    <div className="dot-glow">
      <div className="dot-grid">
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                Questions, answered.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Everything new members ask before applying. Can&apos;t find yours?
                Ask at the next event or on our community page.
              </p>
            </div>
            <div className="hidden pt-2 sm:block">
              <Dot size={110} color={G.green} shape="round" />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
            {(["All", "General", "Joining", "Events", "Projects"] as const).map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(c);
                    setOpenIndex(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition cursor-pointer",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {c !== "All" && (
                    <span
                      className="size-2 rounded-full"
                      style={{ background: CATEGORY_COLOR[c] }}
                      aria-hidden="true"
                    />
                  )}
                  {c}
                </button>
              );
            })}
          </div>

          <div className="mt-8 border-t border-border">
            {items.map((f, i) => (
              <Item
                key={f.q}
                {...f}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-xl font-medium tracking-tight">Ready to join?</p>
              <p className="mt-1 text-muted-foreground">It takes about three minutes.</p>
            </div>
            <Link
              href="/apply"
              className="rounded-xl border border-green-300/60 bg-[#74E38A] px-6 py-3 text-sm font-medium text-neutral-950 transition hover:brightness-95"
            >
              Apply now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
