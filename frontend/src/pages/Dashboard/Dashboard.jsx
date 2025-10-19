import React from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentPlayers from "@/components/dashboard/RecentPlayers";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import TopPerformers from "@/components/dashboard/TopPerformers";
import SystemStatus from "@/components/dashboard/SystemStatus";
import { useAuthStore } from "@/store/auth.store";

const Dashboard = () => {
  // Mock data
  const dashboardStats = {
    totalPlayers: 247,
    matchesProcessed: 1248,
    reportsGenerated: 543,
    accuracyRate: 98.2,
  };

  const { user } = useAuthStore();

  return (
    <div className="min-h-screen text-white">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Welcome back, {user["full_name"]}
        </h1>
        <p className="text-gray-400 text-lg">
          Here's what's happening with your players today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <StatsGrid stats={dashboardStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RecentPlayers />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PerformanceMetrics />
          <TopPerformers />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
