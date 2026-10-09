"use client";

import React, { useState } from "react";
import {
  BarChart01,
  LayersThree01,
  File06,
  Calendar,
  PieChart01,
  CheckSquare,
  Users01,
  SearchSm,
  ChevronRight,
  ChevronSelectorVertical
} from "@untitledui/icons";

export function Sidebar({ activeItem = "Dashboard", onItemSelect }) {
  const [currentActive, setCurrentActive] = useState(activeItem);

  const handleSelect = (item) => {
    setCurrentActive(item);
    if (onItemSelect) onItemSelect(item);
  };

  const generalItems = [
    { name: "Dashboard", icon: BarChart01 },
    { name: "Projects", icon: LayersThree01 },
    { name: "Documents", icon: File06 },
    { name: "Calendar", icon: Calendar },
  ];

  const untitledItems = [
    { name: "Reporting", icon: PieChart01 },
    { name: "Tasks", icon: CheckSquare, badge: "8" },
    { name: "Users", icon: Users01 },
  ];

  const teams = [
    {
      name: "Catalog",
      iconBg: "bg-indigo-600 text-white font-bold text-xs",
      iconText: "C",
      shortcut: "⌘1",
    },
    {
      name: "Warpspeed",
      iconBg: "bg-black text-white font-bold text-xs",
      iconText: "W",
      shortcut: "⌘2",
    },
    {
      name: "Boltshift",
      iconBg: "bg-blue-600 text-white font-bold text-xs",
      iconText: "⚡",
      shortcut: "⌘3",
    },
    {
      name: "Sisyphus",
      iconBg: "bg-emerald-600 text-white font-bold text-xs",
      iconText: "S",
      shortcut: "⌘4",
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-gray-200 bg-white p-4 h-full min-h-[920px]">
      <div className="flex flex-col gap-6">
        {/* Top Logo and Search */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center shadow-xs">
              <div className="size-3.5 rounded-full border-2 border-white/90 bg-white/20" />
            </div>
            <span className="font-semibold text-gray-900 text-base tracking-tight">
              Untitled UI
            </span>
          </div>
          <button
            type="button"
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <SearchSm className="size-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col gap-5">
          {/* GENERAL */}
          <div>
            <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              General
            </p>
            <div className="flex flex-col gap-0.5">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentActive === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelect(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      isActive
                        ? "bg-gray-50 text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`size-5 ${isActive ? "text-gray-900" : "text-gray-500"}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* UNTITLED UI */}
          <div>
            <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              Untitled UI
            </p>
            <div className="flex flex-col gap-0.5">
              {untitledItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentActive === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelect(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      isActive
                        ? "bg-gray-50 text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`size-5 ${isActive ? "text-gray-900" : "text-gray-500"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* YOUR TEAMS */}
          <div>
            <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              Your teams
            </p>
            <div className="flex flex-col gap-1">
              {teams.map((team) => (
                <button
                  key={team.name}
                  type="button"
                  onClick={() => handleSelect(team.name)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`size-5 rounded-full flex items-center justify-center shrink-0 ${team.iconBg}`}
                    >
                      {team.iconText}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded border border-gray-200 bg-gray-50 text-gray-500">
                      {team.shortcut}
                    </span>
                    <ChevronRight className="size-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          className="w-full flex items-center justify-between p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left bg-white shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Caitlyn King"
                className="size-9 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">Caitlyn King</p>
              <p className="text-[11px] text-gray-500 truncate">caitlyn@untitledui.com</p>
            </div>
          </div>
          <ChevronSelectorVertical className="size-4 text-gray-400 shrink-0 ml-1" />
        </button>
      </div>
    </aside>
  );
}
