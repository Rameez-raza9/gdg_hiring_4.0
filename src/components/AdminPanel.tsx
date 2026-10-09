"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconUsers,
  IconFileText,
  IconCalendarEvent,
  IconTrendingUp,
  IconCheck,
  IconX,
  IconSearch,
  IconBell,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Dot10 } from "@/components/AnimatedDots";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      tab: "Dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Applications",
      tab: "Applications",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Members",
      tab: "Members",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Events",
      tab: "Events",
      icon: (
        <IconCalendarEvent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Analytics",
      tab: "Analytics",
      icon: (
        <IconTrendingUp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      tab: "Profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      tab: "Settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Back to Site",
      href: "/",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-neutral-950 md:flex-row text-white",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-neutral-900 border-r border-neutral-800">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => link.tab && setActiveTab(link.tab)}
                  className={cn(
                    "rounded-lg px-2 cursor-pointer transition-colors",
                    activeTab === link.tab
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  <SidebarLink
                    link={{
                      label: link.label,
                      href: link.href || "#",
                      icon: link.icon,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "GDG Lead",
                href: "#",
                icon: (
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                    GD
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <AdminDashboardContent activeTab={activeTab} />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white text-black font-black flex items-center justify-center text-[10px]">
        G
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold tracking-tight whitespace-pre text-white"
      >
        GDGoC SVEC Admin
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white text-black font-black flex items-center justify-center text-[10px]">
        G
      </div>
    </a>
  );
};

const SAMPLE_APPLICATIONS = [
  {
    id: "APP-101",
    name: "Aravind Sharma",
    email: "aravind@svec.edu.in",
    roll: "22A81A0512",
    track: "Technical",
    role: "Web Development",
    year: "3rd Year",
    status: "Pending",
  },
  {
    id: "APP-102",
    name: "Sneha Reddy",
    email: "sneha.r@svec.edu.in",
    roll: "23A81A0545",
    track: "Non-Technical",
    role: "UI/UX & Product Design",
    year: "2nd Year",
    status: "Shortlisted",
  },
  {
    id: "APP-103",
    name: "Karthik Varma",
    email: "karthik.v@svec.edu.in",
    roll: "22A81A0589",
    track: "Technical",
    role: "AI / Machine Learning",
    year: "3rd Year",
    status: "Interviewed",
  },
  {
    id: "APP-104",
    name: "Divya Teja",
    email: "divya@svec.edu.in",
    roll: "24A81A0504",
    track: "Non-Technical",
    role: "Event Management",
    year: "1st Year",
    status: "Pending",
  },
];

const AdminDashboardContent = ({ activeTab }: { activeTab: string }) => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-neutral-950 p-4 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {activeTab === "Dashboard" ? "Overview & Hiring Portal" : activeTab}
          </h1>
          <p className="text-sm text-neutral-400">
            Sri Vasavi Engineering College — Campus Lead Administration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              placeholder="Search applicants, events..."
              className="h-9 w-64 rounded-lg bg-neutral-900 border border-neutral-800 pl-9 pr-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600"
            />
          </div>
          <button className="h-9 w-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer">
            <IconBell size={18} />
          </button>
          <div className="hidden sm:flex items-center pl-1">
            <Dot10 size={38} followCursor={true} />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Total Applicants
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">148</span>
            <span className="text-xs text-emerald-400 font-semibold">+24% this week</span>
          </div>
          <span className="text-xs text-neutral-500 mt-1 block">Active recruit cycle 2026</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Shortlisted
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">32</span>
            <span className="text-xs text-neutral-400 font-semibold">21.6% rate</span>
          </div>
          <span className="text-xs text-neutral-500 mt-1 block">Round 1 evaluation</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Active Members
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">250+</span>
            <span className="text-xs text-emerald-400 font-semibold">SVEC Chapter</span>
          </div>
          <span className="text-xs text-neutral-500 mt-1 block">Across CSE, ECE, AI/ML</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Workshops Hosted
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">20+</span>
            <span className="text-xs text-emerald-400 font-semibold">4.5★ avg</span>
          </div>
          <span className="text-xs text-neutral-500 mt-1 block">Study jams & bootcamps</span>
        </div>
      </div>

      {/* Main Table: Recent Hiring Applications */}
      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent GDGoC Applications
            </h2>
            <p className="text-xs text-neutral-400">
              Submitted candidates through the Formisch recruitment form
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-300 hover:text-white">
              Filter Track
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/90 text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {SAMPLE_APPLICATIONS.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{app.name}</div>
                    <div className="text-xs text-neutral-500">{app.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-neutral-400">{app.roll}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
                        app.track === "Technical"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      )}
                    >
                      {app.track}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-neutral-200">{app.role}</td>
                  <td className="py-3.5 px-4 text-xs text-neutral-400">{app.year}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        app.status === "Shortlisted" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        app.status === "Pending" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                        app.status === "Interviewed" && "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      )}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      title="Accept"
                      className="p-1 rounded-md bg-neutral-800 hover:bg-emerald-600/30 text-neutral-300 hover:text-emerald-400 transition-colors"
                    >
                      <IconCheck size={14} />
                    </button>
                    <button
                      title="Reject"
                      className="p-1 rounded-md bg-neutral-800 hover:bg-red-600/30 text-neutral-300 hover:text-red-400 transition-colors"
                    >
                      <IconX size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
