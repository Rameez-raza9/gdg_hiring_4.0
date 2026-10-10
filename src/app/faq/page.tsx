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
  c: "Joining",
  q: "How do I join?",
  a: "Fill in the application form. It has three short steps: about you, your tracks, and why you want to join. We review applications and reach out by email."
},
{
  c: "Joining",
  q: "Is there a membership fee?",
  a: "Joining the community is free. If a specific event or workshop has a cost, it will be announced with the event details."
},
{
  c: "Joining",
  q: "Can first-year students apply?",
  a: "Yes. Every year is welcome, and many members start with no experience in their track."
},
{
  c: "Joining",
  q: "When will applications open and close?",
  a: "Application dates will be announced through the official GDGoC SVEC community channels. Follow our announcements to stay updated on deadlines."
},
{
  c: "Joining",
  q: "Is there an interview or selection round?",
  a: "The selection process will be communicated by the organizing team. Check the official recruitment announcement for details about any interviews, assessments, or additional rounds."
},
{
  c: "Joining",
  q: "How many roles can I apply for?",
  a: "You can apply for up to three roles across the Technical and Non-Technical wings. Your selections must include roles from both wings."
},
{
  c: "Joining",
  q: "Can I apply for roles in both Technical and Non-Technical wings?",
  a: "Yes. You must select roles from both wings. You can choose either one Technical role and two Non-Technical roles, or two Technical roles and one Non-Technical role."
},
{
  c: "Joining",
  q: "Can I select all three roles from the Technical wing?",
  a: "No. You cannot select all three roles from the Technical wing. Your application must include at least one Non-Technical role."
},
{
  c: "Joining",
  q: "Can I select all three roles from the Non-Technical wing?",
  a: "No. You cannot select all three roles from the Non-Technical wing. Your application must include at least one Technical role."
},
{
  c: "Joining",
  q: "Can I choose two Technical roles and one Non-Technical role?",
  a: "Yes. This is an allowed combination. You can select any two eligible Technical roles and one Non-Technical role."
},
{
  c: "Joining",
  q: "Can I choose one Technical role and two Non-Technical roles?",
  a: "Yes. This is an allowed combination. You can select one Technical role and any two eligible Non-Technical roles."
},
{
  c: "Joining",
  q: "Do my three role preferences have to be from different clusters?",
  a: "No. You may select roles from the same wing, provided your selections include at least one Technical role and at least one Non-Technical role. You cannot select all three from one wing."
},
{
  c: "Joining",
  q: "Can I edit my application after submitting it?",
  a: "If you need to update your application after submission, contact the organizing team through the official communication channels. Changes depend on the application process."
},
{
  c: "Joining",
  q: "What should I write in the 'Why do you want to join?' section?",
  a: "Explain your genuine interests, what you want to learn, why you selected your preferred roles, and how you hope to contribute to the community. Be specific and honest."
},
{
  c: "Joining",
  q: "Will beginners have an equal opportunity during selection?",
  a: "We encourage applicants with different experience levels. Demonstrating curiosity, commitment, willingness to learn, and an interest in contributing can help communicate your potential."
},
{
  c: "Joining",
  q: "Can I apply if I have other college responsibilities?",
  a: "Yes. You can apply while participating in other college activities. Consider your existing commitments and be prepared to manage your time and responsibilities effectively."
},
{
  c: "Joining",
  q: "What happens after I get selected?",
  a: "Selected applicants will receive further instructions from the organizing team regarding onboarding, communication channels, role assignments, and upcoming activities."
},
{
  c: "Joining",
  q: "Can I apply again if I am not selected?",
  a: "Future applications depend on the next recruitment cycle. You can continue developing your skills, participating in community activities open to you, and applying when recruitment reopens."
},
{
  c: "Joining",
  q: "Whom should I contact if I have trouble with the application form?",
  a: "Reach out through the official GDGoC SVEC communication channels and explain the issue. Include the relevant details so the team can guide you."
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
