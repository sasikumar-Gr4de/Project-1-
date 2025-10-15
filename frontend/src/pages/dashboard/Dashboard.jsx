// Dashboard.jsx
import React, { useState } from "react";
import StatsGrid from "../../components/dashboard/StatsGrid";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentPlayers from "../../components/dashboard/RecentPlayers";
import PerformanceMetrics from "../../components/dashboard/PerformanceMetrics";
import TopPerformers from "../../components/dashboard/TopPerformers";
import SystemStatus from "../../components/dashboard/SystemStatus";

const Dashboard = () => {
  // Mock data
  const dashboardStats = {
    totalPlayers: 247,
    matchesProcessed: 1248,
    reportsGenerated: 543,
    accuracyRate: 98.2,
  };

  return (
    <main className="flex-1 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Coach!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your players today.
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={dashboardStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <RecentPlayers />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <PerformanceMetrics />
            <TopPerformers />
            <SystemStatus />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
