"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { motion } from "motion/react";
import {
  Dot01,
  Dot02,
  Dot04,
  Dot05,
  Dot06,
  Dot07,
  Dot08,
  Dot10,
} from "@/components/AnimatedDots";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip-linkedin-team01)">
      <path d="M13.633 13.633h-2.37V9.92c0-.885-.017-2.025-1.234-2.025-1.235 0-1.424.965-1.424 1.96v3.778h-2.37V5.998H8.51v1.043h.031a2.5 2.5 0 0 1 2.246-1.233c2.403 0 2.846 1.58 2.846 3.637zM3.56 4.954a1.376 1.376 0 1 1 0-2.751 1.376 1.376 0 0 1 0 2.751m1.185 8.679H2.372V5.998h2.373zM14.815.001H1.18A1.17 1.17 0 0 0 0 1.154v13.691A1.17 1.17 0 0 0 1.18 16h13.635A1.17 1.17 0 0 0 16 14.845V1.153A1.17 1.17 0 0 0 14.815 0" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip-linkedin-team01">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export type TeamMember = {
  name: string;
  role: string;
  sub: string;
  initials: string;
  gradient: string;
  dot: React.ComponentType<{ size?: number; followCursor?: boolean; className?: string }>;
  dotName: string;
  socials: {
    website: string;
    linkedin: string;
    github?: string;
  };
};

export const gdgTeamData: TeamMember[] = [
  {
    name: "Vinay Kumar Siddha",
    role: "GDGoC Organizer & Chapter Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "VS",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    dot: Dot01,
    dotName: "Dot 01 (Blue Alpha)",
    socials: {
      website: "https://gdg.community.dev/gdg-on-campus-sri-vasavi-engineering-college-tadepalligudem-india/",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Jitendra Sri Talabattula",
    role: "GenAI & AIML Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "JT",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    dot: Dot08,
    dotName: "Dot 08 (Purple Prism)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Muppana Shanmukha",
    role: "Cloud & DevOps Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "MS",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    dot: Dot10,
    dotName: "Dot 10 (Yellow Arcade)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Rama Manikanta Guna",
    role: "Public Relations & Outreach Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "RG",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    dot: Dot04,
    dotName: "Dot 04 (Amber Clover)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Kota Sri Sai Mahalsa",
    role: "Event Management Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "KM",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    dot: Dot02,
    dotName: "Dot 02 (Ruby Flame)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Anya Sree Kadali",
    role: "Non-Technical Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "AK",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    dot: Dot07,
    dotName: "Dot 07 (Sky Smile)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Sai Prakash Arimilli",
    role: "GenAI & AIML Co-Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "SA",
    gradient: "from-violet-600 via-purple-600 to-pink-500",
    dot: Dot05,
    dotName: "Dot 05 (Indigo Orbit)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Rameez Raza",
    role: "Social Media & Marketing Lead",
    sub: "Sri Vasavi Engineering College",
    initials: "RR",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    dot: Dot06,
    dotName: "Dot 06 (Sunny Star)",
    socials: {
      website: "#",
      linkedin: "#",
      github: "#",
    },
  },
];

const Team = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center gap-12 md:gap-16">
        {/* Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4"
        >
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold tracking-wider uppercase border-neutral-700 bg-neutral-900 text-neutral-300">
              Core Leadership
            </Badge>
            <span className="text-xs font-mono text-emerald-400">
              GDGoC SVEC 2026
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Meet the Leaders Behind <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC04] bg-clip-text text-transparent">
              GDGoC SVEC
            </span>
          </h2>
          <p className="text-sm sm:text-base font-normal text-neutral-400 max-w-xl">
            Passionate student organizers steering technical wings, AI study jams, cloud hack sprints, and campus community outreach.
          </p>
        </motion.div>

        {/* 8 Organizers Avatar Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {gdgTeamData.map((member, index) => {
            const MascotDot = member.dot;
            return (
              <motion.div
                key={member.name}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group relative rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-md hover:border-neutral-700 hover:bg-neutral-900/70 transition-all duration-300 flex flex-col items-center text-center justify-between space-y-6 shadow-xl"
              >
                {/* Top: Animated Mascot Badge */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {member.dotName.split(" ")[0]}
                  </span>
                  <div className="shrink-0 scale-90">
                    <MascotDot size={36} followCursor={true} />
                  </div>
                </div>

                {/* Avatar Monogram in place of plain image */}
                <div className="relative my-2">
                  <div
                    className={`h-28 w-28 rounded-3xl bg-gradient-to-tr ${member.gradient} p-[2px] shadow-2xl group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="h-full w-full rounded-[22px] bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-tr ${member.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <span className="text-3xl font-extrabold tracking-tight text-white z-10">
                        {member.initials}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 z-10 mt-1 uppercase">
                        SVEC Lead
                      </span>
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="w-full flex flex-col items-center gap-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    {member.sub}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80 w-full justify-center">
                  <a
                    href={member.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition"
                    title="Community Portfolio"
                  >
                    <Globe size={15} />
                  </a>
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon size={15} />
                  </a>
                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition"
                      title="GitHub Profile"
                    >
                      <GithubIcon size={15} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
