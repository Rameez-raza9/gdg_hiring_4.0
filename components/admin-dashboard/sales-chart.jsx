"use client";

import React, { useState } from "react";
import { ArrowUp } from "@untitledui/icons";

export function SalesChart({
  title = "Sales",
  value = "$8,422.60",
  trend = "3.2%",
  trendContext = "vs last 30 days",
}) {
  const [activeTab, setActiveTab] = useState("30 days");
  const tabs = ["12 months", "30 days", "7 days", "24 hours"];

  // Days 1 to 30 data points for generating the exact curve and fine vertical bar columns
  const points = [
    { day: 1, y: 72 },
    { day: 2, y: 71 },
    { day: 3, y: 71 },
    { day: 4, y: 70 },
    { day: 5, y: 70 },
    { day: 6, y: 69 },
    { day: 7, y: 68 },
    { day: 8, y: 67 },
    { day: 9, y: 69 },
    { day: 10, y: 71 },
    { day: 11, y: 70 },
    { day: 12, y: 68 },
    { day: 13, y: 65 },
    { day: 14, y: 63 },
    { day: 15, y: 62 },
    { day: 16, y: 60 },
    { day: 17, y: 57 },
    { day: 18, y: 53 },
    { day: 19, y: 54 },
    { day: 20, y: 56 },
    { day: 21, y: 53 },
    { day: 22, y: 50 },
    { day: 23, y: 47 },
    { day: 24, y: 44 },
    { day: 25, y: 42 },
    { day: 26, y: 39 },
    { day: 27, y: 38 },
    { day: 28, y: 37 },
    { day: 29, y: 38 },
    { day: 30, y: 38 },
  ];

  // SVG dimensions
  const width = 800;
  const height = 180;
  const xStep = width / (points.length - 1);

  // Build SVG path
  const pathD = points.reduce((acc, pt, i) => {
    const x = i * xStep;
    const y = (pt.y / 100) * height;
    return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, "");

  const xAxisLabels = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  return (
    <div className="w-full p-6 rounded-xl border border-gray-200 bg-white shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <div className="mt-1">
            <span className="text-3xl font-semibold text-gray-900 tracking-tight">
              {value}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-sm">
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600">
              <ArrowUp className="size-3.5" />
              {trend}
            </span>
            <span className="text-gray-500 font-normal">{trendContext}</span>
          </div>
        </div>

        {/* Time Tabs */}
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50/70 p-1 text-sm font-medium">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  isSelected
                    ? "bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Graphic with vertical barcode-like grid lines matching screenshot */}
      <div className="w-full mt-6 pt-2">
        <div className="w-full h-44 relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            {/* Fine vertical histogram/candlestick bars underneath the line */}
            {points.map((pt, i) => {
              const x = i * xStep;
              const y = (pt.y / 100) * height;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={height}
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeOpacity="0.12"
                />
              );
            })}

            {/* Main Purple Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* X-Axis Ticks */}
        <div className="flex justify-between items-center px-1 mt-3 text-xs text-gray-400 font-medium">
          {xAxisLabels.map((val) => (
            <span key={val}>{val}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
