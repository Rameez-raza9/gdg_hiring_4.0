"use client";

import React, { useState } from "react";

export function OrdersSummary({ initialOrders = 24, onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("All orders");
  const filters = ["All orders", "Paid", "Refunded"];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  return (
    <div className="w-full p-6 rounded-xl border border-gray-200 bg-white shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Orders</span>

        {/* Filter Segmented Control */}
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50/70 p-1 text-sm font-medium">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterClick(filter)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  isSelected
                    ? "bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <span className="text-3xl font-semibold text-gray-900 tracking-tight">
          {initialOrders}
        </span>
      </div>
    </div>
  );
}
