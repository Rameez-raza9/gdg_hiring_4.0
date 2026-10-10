"use client";

import React from "react";
import { Dot, G, type Shape } from "@/components/dot";

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  color: string;
  shape: Shape;
  github?: string;
  linkedin?: string;
};

export const TEAM: TeamMember[] = [
{
  name: "Rameez Raza Sheik",
  role: "GDGoC Organizer & Chapter Lead",
  bio: "Leads the GDGoC chapter at Sri Vasavi Engineering College, setting its vision and guiding the developer community.",
  color: G.blue,
  shape: "lean",
  github: "#",
  linkedin: "https://www.linkedin.com/in/rameezraza/",
},
{
  name: "Kota Sri Sai Mahalsa",
  role: "Event Management Lead",
  bio: "Coordinates chapter events, manages event logistics, and helps deliver engaging and well-organized developer experiences.",
  color: G.green,
  shape: "round",
  github: "https://github.com/mahalsa303",
  linkedin: "https://www.linkedin.com/in/kota-sri-sai-mahalsa-6169a6367/",
},
{
  name: "Jitendra Sri Talabattula",
  role: "GenAI & AIML Lead",
  bio: "Leads Generative AI and AIML initiatives, helping students explore intelligent applications and emerging AI technologies.",
  color: G.red,
  shape: "round",
  github: "https://github.com/jitendrasri",
  linkedin: "https://www.linkedin.com/in/jitendrasritalabattula/",
},
{
  name: "Muppana Shanmukha",
  role: "Cloud & DevOps Lead",
  bio: "Guides cloud computing and DevOps initiatives, promoting deployment workflows, infrastructure automation, and modern cloud practices.",
  color: G.yellow,
  shape: "squircle",
  github: "#",
  linkedin: "https://www.linkedin.com/in/muppana-shanmukha-baa221366/",
},
{
  name: "Rama Manikanta Guna",
  role: "Public Relations & Outreach Lead",
  bio: "Builds community relationships, coordinates outreach initiatives, and strengthens connections with students and external partners.",
  color: G.green,
  shape: "tall",
  github: "#",
  linkedin: "https://www.linkedin.com/in/ramamanikantaguna/",
},

{
  name: "Anya Sree Kadali",
  role: "Non-Technical Lead",
  bio: "Supports non-technical chapter initiatives, member coordination, and community engagement to keep the team connected.",
  color: G.blue,
  shape: "squircle",
  github: "#",
  linkedin: "https://www.linkedin.com/in/anya-sree-kadali-091b82311/",
},
{
  name: "Sai Prakash Arimilli",
  role: "GenAI & AIML Co-Lead",
  bio: "Co-leads AI and machine learning initiatives, collaborating on learning sessions and practical Generative AI projects.",
  color: G.yellow,
  shape: "lean",
  github: "#",
  linkedin: "https://www.linkedin.com/in/venkata-sai-durga-prakash-arimilli-2131812ba/",
},
{
  name: "Tejas Sainadh Kabotula",
  role: "Creative Design Lead",
  bio: "Shapes the chapter's visual identity through creative design, promotional graphics, and consistent community branding.",
  color: G.red,
  shape: "tall",
  github: "https://github.com/TejasKabotula",
  linkedin: "https://www.linkedin.com/in/tejas-sainadh-kumar-kabotula/",
},
];

export default function TeamSection({ members = TEAM }: { members?: TeamMember[] }) {
  return (
    <section id="team" className="relative scroll-mt-8 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-balance text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
            The people behind the dots
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Students who organise, teach and build at Sri Vasavi Engineering College. Say hi at the next event.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <li
              key={`${m.role}-${i}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ background: m.color }}
              />
              <Dot
                size={84}
                color={m.color}
                shape={m.shape}
                delay={(i * 0.43) % 2.4}
              />
              <h3 className="mt-6 text-lg font-medium tracking-tight">{m.name}</h3>
              <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: m.color }}
                  aria-hidden="true"
                />
                {m.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {m.bio}
              </p>
              <div className="mt-5 flex gap-2">
                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on GitHub`}
                    className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                  >
                    <GithubIcon className="size-4" />
                  </a>
                )}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                  >
                    <LinkedinIcon className="size-4" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
