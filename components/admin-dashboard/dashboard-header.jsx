"use client";

import React, { useState } from "react";
import { SearchLg, Calendar } from "@untitledui/icons";

export function DashboardHeader({
  userName = "Olivia",
  currentDate = "16 January, 2026",
  userAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  onSearch,
  onRangeChange,
}) {
  const [selectedRange, setSelectedRange] = useState("Custom");
  const timeRanges = ["Custom", "12 months", "30 days", "7 days", "24 hours"];

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    if (onRangeChange) onRangeChange(range);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Greeting & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3.5">
          <img
            src={userAvatar}
            alt={userName}
            className="size-11 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{currentDate}</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative flex items-center w-full sm:w-72">
          <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-xs focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/10 transition-all">
            <SearchLg className="size-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded shrink-0">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Filter Row: Time Controls & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Segmented Time Controls */}
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50/70 p-1 text-sm font-medium">
          {timeRanges.map((range) => {
            const isSelected = selectedRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => handleRangeSelect(range)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  isSelected
                    ? "bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>

        {/* Date Range Picker Display */}
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors self-start sm:self-auto"
        >
          <Calendar className="size-4 text-gray-500" />
          <span>Jan 10, 2026 – Jan 16, 2026</span>
        </button>
      </div>
    </div>
  );
}
