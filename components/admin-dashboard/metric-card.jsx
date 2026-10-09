"use client";

import React from "react";
import { DotsVertical, ArrowUp } from "@untitledui/icons";

export function MetricCard({
  title,
  value,
  trend = "2.4%",
  trendPositive = true,
  chartType = "smooth", // "smooth", "wave", "undulating"
}) {
  // Preset SVG path configurations for sparklines matching screenshot
  const sparklineConfigs = {
    smooth: {
      line: "M0,45 C25,44 45,40 70,38 C95,36 115,35 140,32 C165,30 185,25 210,22 C235,28 255,20 280,14 L280,55 L0,55 Z",
      stroke: "M0,45 C25,44 45,40 70,38 C95,36 115,35 140,32 C165,30 185,25 210,22 C235,28 255,20 280,14",
    },
    wave: {
      line: "M0,42 C15,36 25,44 45,38 C60,42 75,34 95,38 C115,30 135,42 155,26 C175,18 195,28 215,22 C235,28 255,22 280,24 L280,55 L0,55 Z",
      stroke: "M0,42 C15,36 25,44 45,38 C60,42 75,34 95,38 C115,30 135,42 155,26 C175,18 195,28 215,22 C235,28 255,22 280,24",
    },
    undulating: {
      line: "M0,36 C35,38 55,28 85,26 C115,38 145,34 175,28 C205,30 235,36 255,30 C265,26 275,20 280,15 L280,55 L0,55 Z",
      stroke: "M0,36 C35,38 55,28 85,26 C115,38 145,34 175,28 C205,30 235,36 255,30 C265,26 275,20 280,15",
    },
  };

  const chart = sparklineConfigs[chartType] || sparklineConfigs.smooth;
  const gradientId = `spark-grad-${title.replace(/\s+/g, "").toLowerCase()}`;

  return (
    <div className="flex flex-col justify-between p-5 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-gray-300 transition-all">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50 transition-colors"
            aria-label="More options"
          >
            <DotsVertical className="size-4" />
          </button>
        </div>

        {/* Value and Trend */}
        <div className="flex items-baseline gap-2.5 mt-3">
          <span className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            {value}
          </span>
          <div
            className={`inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold ${
              trendPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            <ArrowUp className="size-3.5" />
            <span>{trend}</span>
          </div>
        </div>
      </div>

      {/* Sparkline Graphic */}
      <div className="w-full h-12 mt-4 overflow-hidden">
        <svg
          viewBox="0 0 280 55"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={chart.line} fill={`url(#${gradientId})`} />
          <path
            d={chart.stroke}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
