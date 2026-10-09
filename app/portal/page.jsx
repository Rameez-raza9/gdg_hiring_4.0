"use client";

import React, { useState } from "react";
import AdminDashboard from "@/components/admin-dashboard/admin-dashboard";
import AdminPortal from "@/components/AdminPortal";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("dashboard"); // "dashboard" | "recruitment"

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Floating Mini Switcher for previewing both Untitled UI Dashboard & Recruitment Operations */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <button
            onClick={() => router.push("/")}
            className="hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </button>
          <span>•</span>
          <span className="text-gray-900 font-semibold">Admin Panel</span>
        </div>

        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode("dashboard")}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "dashboard"
                ? "bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/80"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Dashboard UI (Screenshot)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("recruitment")}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "recruitment"
                ? "bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/80"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Recruitment Stations
          </button>
        </div>
      </div>

      {/* Render View */}
      <div className="flex-1 w-full">
        {viewMode === "dashboard" ? (
          <AdminDashboard onBackToHome={() => router.push("/")} />
        ) : (
          <div className="max-w-[1400px] mx-auto p-4 sm:p-6">
            <AdminPortal onBackToForm={() => setViewMode("dashboard")} />
          </div>
        )}
      </div>
    </div>
  );
}
