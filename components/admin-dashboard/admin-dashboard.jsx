"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { MetricCard } from "./metric-card";
import { SalesChart } from "./sales-chart";
import { OrdersSummary } from "./orders-summary";

export function AdminDashboard({ onBackToHome }) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-3 sm:p-6 lg:p-8 flex justify-center text-gray-900 font-sans antialiased">
      {/* Framed Window Container matching Screenshot */}
      <div className="w-full max-w-[1480px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[940px]">
        {/* Left Sidebar */}
        <Sidebar activeItem={activeNav} onItemSelect={setActiveNav} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-6 p-6 lg:p-8 bg-white min-w-0 overflow-y-auto">
          {/* Header Area with Welcome & Search & Filters */}
          <DashboardHeader
            userName="Olivia"
            currentDate="16 January, 2026"
            onSearch={setSearchQuery}
          />

          {/* Three Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricCard
              title="Sales"
              value="$2,114.40"
              trend="2.4%"
              trendPositive={true}
              chartType="smooth"
            />
            <MetricCard
              title="Orders"
              value="24"
              trend="8.6%"
              trendPositive={true}
              chartType="wave"
            />
            <MetricCard
              title="Average order value"
              value="$88.10"
              trend="6.0%"
              trendPositive={true}
              chartType="undulating"
            />
          </div>

          {/* Large Main Sales Chart */}
          <SalesChart
            title="Sales"
            value="$8,422.60"
            trend="3.2%"
            trendContext="vs last 30 days"
          />

          {/* Bottom Orders Card */}
          <OrdersSummary initialOrders={24} />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
