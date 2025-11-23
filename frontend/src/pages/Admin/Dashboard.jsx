import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import AdminSection from "@/components/admin/AdminSection";
import QueueActivityList from "@/components/admin/QueueActivityList";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FileText,
  Activity,
  Database,
  TrendingUp,
  Server,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const {
    metrics,
    queue,
    fetchSystemMetrics,
    fetchQueue,
    retryJob,
    deleteJob,
    isLoading,
  } = useAdminStore();
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([fetchSystemMetrics(), fetchQueue({ limit: 5 })]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getQueueProgress = () => {
    if (!metrics?.queue) return {};

    const total = Object.values(metrics.queue).reduce(
      (sum, count) => sum + count,
      0
    );
    return {
      uploaded: (metrics.queue.uploaded / total) * 100,
      pending: (metrics.queue.pending / total) * 100,
      processing: (metrics.queue.processing / total) * 100,
      completed: (metrics.queue.completed / total) * 100,
      failed: (metrics.queue.failed / total) * 100,
    };
  };

  const progressData = getQueueProgress();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-placeholder text-lg mt-2 font-['Orbitron']">
            System overview and performance metrics
            {lastUpdated && (
              <span className="text-sm ml-2">
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={loadData}
          disabled={isLoading}
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <RefreshCw
            className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* System Health Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title="Total Users"
          value={formatNumber(metrics?.totalUsers)}
          subtitle={`${formatNumber(metrics?.activeUsers)} active this week`}
          icon={Users}
          variant="primary"
        />

        <AdminStatsCard
          title="Total Reports"
          value={formatNumber(metrics?.totalReports)}
          subtitle={`${formatNumber(metrics?.reportsThisWeek)} this week`}
          icon={FileText}
          variant="success"
        />

        <AdminStatsCard
          title="Data Entries"
          value={formatNumber(metrics?.totalDataEntries)}
          subtitle="Total match data uploaded"
          icon={Database}
          variant="warning"
        />

        <AdminStatsCard
          title="Success Rate"
          value={`${metrics?.successRate || "98.2"}%`}
          subtitle="Report generation success"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Queue Status and Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Queue Status */}
        <AdminSection
          title="Processing Queue Status"
          description="Current distribution of data processing jobs"
          icon={Activity}
        >
          <div className="space-y-6">
            {Object.entries(progressData).map(([status, value]) => (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={status} size="sm" />
                    <span className="text-white text-sm font-medium">
                      {metrics?.queue?.[status] || 0} jobs
                    </span>
                  </div>
                  <span className="text-placeholder text-sm">
                    {value ? value.toFixed(1) : 0}%
                  </span>
                </div>
                <Progress value={value} className="h-2 bg-[#343434]" />
              </div>
            ))}
          </div>

          {/* <div className="mt-6 p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-placeholder">Average Processing Time</span>
              <span className="text-white font-medium">
                {metrics?.avgProcessingTime || "15"} minutes
              </span>
            </div>
          </div> */}
        </AdminSection>

        {/* Recent Queue Activity */}
        <AdminSection
          title="Recent Queue Activity"
          description="Latest data processing jobs"
          icon={BarChart3}
          action={true}
          actionText="View All"
          onAction={() => (window.location.href = "/admin/queue")}
        >
          <QueueActivityList
            jobs={queue.items || []}
            onRetry={retryJob}
            onDelete={deleteJob}
            avgProcessingTime={metrics?.avgProcessingTime || 15}
            viewAllHref="/admin/queue"
            viewAllText="View All Jobs"
          />
        </AdminSection>
      </div>

      {/* System Performance */}
      <AdminSection
        title="System Performance"
        description="Platform health and resource utilization"
        icon={Server}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-primary">
              {metrics?.uptime || "99.9"}%
            </div>
            <div className="text-xs text-placeholder mt-1">Uptime</div>
          </div>

          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-[#10B981]">
              {metrics?.storageUsed || "2.1"}GB
            </div>
            <div className="text-xs text-placeholder mt-1">Storage Used</div>
          </div>

          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-[#F59E0B]">
              {queue.items?.length || 0}
            </div>
            <div className="text-xs text-placeholder mt-1">Active Jobs</div>
          </div>

          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-[#60A5FA]">
              {metrics?.successRate || "98.2"}%
            </div>
            <div className="text-xs text-placeholder mt-1">Success Rate</div>
          </div>
        </div>
      </AdminSection>
    </div>
  );
};

export default Dashboard;
