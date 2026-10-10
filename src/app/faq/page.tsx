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
  // ── Projects ──
  {
    c: "Projects",
    q: "What kind of projects can members build at GDGoC SVEC?",
    a: "Members can explore AI-powered applications, web and mobile applications, cloud-based solutions, automation tools, and creative digital experiences that address practical problems.",
  },
  {
    c: "Projects",
    q: "Do GDGoC SVEC projects focus on solving real-world problems?",
    a: "The community encourages innovation through practical solutions. Members can identify problems in their campus or local community and explore how technology and creativity can help address them.",
  },
  {
    c: "Projects",
    q: "Can I build AI-powered applications as part of a project?",
    a: "Yes. Members interested in AI and Machine Learning can explore ideas involving Generative AI, intelligent applications, language models, and other relevant AI technologies, depending on project scope and team guidance.",
  },
  {
    c: "Projects",
    q: "Can I work on web development or mobile app projects?",
    a: "Yes. Members can explore website development, interactive web applications, mobile applications, UI/UX design, and related technologies based on their interests and available project opportunities.",
  },
  {
    c: "Projects",
    q: "Can projects involve cloud computing and deployment?",
    a: "Yes. Suitable projects can include cloud infrastructure, application hosting, deployment workflows, automation, and CI/CD practices to help members understand how applications are delivered and maintained.",
  },
  {
    c: "Projects",
    q: "Can I contribute to a project through design instead of coding?",
    a: "Yes. Design contributions may include user research, wireframes, UI/UX design, prototypes, visual assets, usability improvements, and documentation that support the overall project.",
  },
  {
    c: "Projects",
    q: "How can I identify a good project idea?",
    a: "Start by identifying a problem, understanding who experiences it, researching existing solutions, and defining a small feature that your team can realistically build and test.",
  },
  {
    c: "Projects",
    q: "Can I collaborate with members from different clusters?",
    a: "Yes. Cross-cluster collaboration can combine AI, web development, cloud, programming, design, marketing, outreach, and event management skills to build more complete solutions.",
  },
  {
    c: "Projects",
    q: "What is the role of a project lead?",
    a: "A project lead helps coordinate tasks, clarify goals, support collaboration, monitor progress, and guide the team toward completing agreed deliverables. Responsibilities depend on the project structure.",
  },
  {
    c: "Projects",
    q: "How should we manage tasks in a team project?",
    a: "Define the project goal, divide the work into manageable tasks, assign responsibilities, agree on milestones, communicate regularly, and track progress using suitable collaboration tools.",
  },
  {
    c: "Projects",
    q: "Can I use Google technologies in my project?",
    a: "Yes. Depending on the project requirements, members can explore relevant Google technologies and developer tools, such as Gemini, Google Cloud, Firebase, or other suitable services.",
  },
  {
    c: "Projects",
    q: "How can I document my contributions to a project?",
    a: "Keep track of the tasks you complete, technologies you use, problems you solve, and results you achieve. Use clear documentation and version control where appropriate to make your contributions easier to understand.",
  },
  {
    c: "Projects",
    q: "Can a project start as a small prototype?",
    a: "Yes. Starting with a minimum viable prototype helps a team test its idea, gather feedback, identify problems early, and improve the solution incrementally.",
  },
  {
    c: "Projects",
    q: "How can we evaluate whether our project is successful?",
    a: "Define the problem and intended outcomes first. Then evaluate whether the solution addresses the problem, works as expected, meets user needs, and improves through testing and feedback.",
  },
  {
    c: "Projects",
    q: "Can I continue developing a project after an event or hackathon?",
    a: "Yes. You can continue improving a project by refining its features, fixing issues, gathering feedback, improving documentation, and exploring further development opportunities with your team.",
  },

  // ── Events ──
  {
    c: "Events",
    q: "What types of events does GDGoC SVEC organize?",
    a: "GDGoC SVEC organizes technology workshops, hands-on bootcamps, hackathons, coding challenges, design-focused sessions, career development activities, and community-building events.",
  },
  {
    c: "Events",
    q: "What is Hackelerate?",
    a: "Hackelerate is a GDGoC SVEC organizer-led innovation hackathon where students identify real-world campus or community challenges and develop practical solutions using technology and Google tools.",
  },
  {
    c: "Events",
    q: "What is ThinkX: From RAG to LLM?",
    a: "ThinkX is a technical learning session focused on Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs), helping participants understand how retrieved information can improve context-aware AI applications.",
  },
  {
    c: "Events",
    q: "What is WEBX?",
    a: "WEBX is a web development learning experience that explores how programming logic, website structure, visual layout, and interactive features work together to create user-friendly web applications.",
  },
  {
    c: "Events",
    q: "What is DeployX: Dev to Deploy?",
    a: "DeployX introduces participants to development and deployment workflows, including version control, CI/CD concepts, automation tools, and practical deployment demonstrations.",
  },
  {
    c: "Events",
    q: "What is PixelX?",
    a: "PixelX focuses on UI/UX design, user research, design thinking, wireframing, prototyping, usability, and creating meaningful digital experiences.",
  },
  {
    c: "Events",
    q: "What is the AI & Career Builder Bootcamp?",
    a: "The AI & Career Builder Bootcamp introduces students to AI, Machine Learning, Generative AI, Google AI tools, career paths, resume building, GitHub profiles, learning resources, and practical activities.",
  },
  {
    c: "Events",
    q: "Are GDGoC SVEC events only about coding?",
    a: "No. Events can cover AI, cloud computing, web development, deployment, UI/UX design, career development, innovation, and community building. The focus depends on the particular event.",
  },
  {
    c: "Events",
    q: "Can I attend an event if I am unfamiliar with its topic?",
    a: "Many introductory sessions welcome beginners, while advanced workshops may require prior knowledge. Check the event description for prerequisites before registering.",
  },
  {
    c: "Events",
    q: "Where can I find the details of previous GDGoC SVEC events?",
    a: "Visit the official GDGoC SVEC community page on GDG Community Dev and explore its past event listings for descriptions, themes, dates, and other available details.",
  },
  {
    c: "Events",
    q: "Are there events for students interested in AI and Generative AI?",
    a: "Yes. Published chapter activities include AI-focused learning sessions and the AI & Career Builder Bootcamp. Future AI events and their registration details will be announced through official channels.",
  },
  {
    c: "Events",
    q: "Can non-technical members contribute to events?",
    a: "Yes. Event planning, coordination, creative design, social media, marketing, and outreach are important contributions that help events reach participants and run effectively.",
  },
  {
    c: "Events",
    q: "Will upcoming events be announced on the GDG Community Dev page?",
    a: "The official GDGoC SVEC page lists chapter events. Check the page regularly for upcoming events, registration information, and updates.",
  },

  // ── Joining & General ──
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
    c: "Joining",
    q: "When will applications open and close?",
    a: "Application dates will be announced through the official GDGoC SVEC community channels. Follow our announcements to stay updated on deadlines.",
  },
  {
    c: "Joining",
    q: "Is there an interview or selection round?",
    a: "The selection process will be communicated by the organizing team. Check the official recruitment announcement for details about any interviews, assessments, or additional rounds.",
  },
  {
    c: "Joining",
    q: "How many roles can I apply for?",
    a: "You can apply for up to three roles across the Technical and Non-Technical wings. Your selections must include roles from both wings.",
  },
  {
    c: "Joining",
    q: "Can I choose two Technical roles and one Non-Technical role?",
    a: "Yes. This is an allowed combination. You can select any two eligible Technical roles and one Non-Technical role.",
  },
  {
    c: "Joining",
    q: "What should I write in the 'Why do you want to join?' section?",
    a: "Explain your genuine interests, what you want to learn, why you selected your preferred roles, and how you hope to contribute to the community. Be specific and honest.",
  },
  {
    c: "General",
    q: "What is GDGoC SVEC?",
    a: "Google Developer Groups on Campus at Sri Vasavi Engineering College is a student-run technology community supported by Google Developers, focused on building, learning, and growing together.",
  },
  {
    c: "General",
    q: "Where is GDGoC SVEC based?",
    a: "We are based at Sri Vasavi Engineering College in Pedatadepalli, Tadepalligudem, West Godavari District, Andhra Pradesh.",
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
      <div className="dot-grid min-h-screen">
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:pt-24">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl text-foreground">
                Questions, answered.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Everything new members ask before applying. Can&apos;t find yours?
                Ask at the next event or contact chapter lead vinaysiddha19@gmail.com.
              </p>
            </div>
            <div className="hidden pt-2 sm:block">
              <Dot size={110} color={G.green} shape="round" />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
            {(["All", "Projects", "Events", "Joining", "General"] as const).map((c) => {
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
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition cursor-pointer font-medium",
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
              <p className="text-xl font-medium tracking-tight text-foreground">Ready to join?</p>
              <p className="mt-1 text-muted-foreground">It takes about three minutes.</p>
            </div>
            <Link
              href="/apply"
              className="rounded-xl border border-green-300/60 bg-[#74E38A] px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:brightness-95"
            >
              Apply now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
