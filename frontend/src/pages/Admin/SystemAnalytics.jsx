import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import AdminSection from "@/components/admin/AdminSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  FileText,
  Database,
  TrendingUp,
  Calendar,
  RefreshCw,
} from "lucide-react";

const SystemAnalytics = () => {
  const { fetchSystemAnalytics, isLoading } = useAdminStore();
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      const response = await fetchSystemAnalytics({ dateRange });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getDateRangeLabel = (range) => {
    const labels = {
      "24h": "Last 24 Hours",
      "7d": "Last 7 Days",
      "30d": "Last 30 Days",
    };
    return labels[range] || "Last 7 Days";
  };

  const calculateStats = () => {
    if (!analytics) return {};

    const userRegistrations = analytics.userRegistrations.length;
    const reportGenerations = analytics.reportGenerations.length;
    const dataUploads = analytics.dataUploads.length;

    const successfulReports = analytics.reportGenerations.filter(
      (report) => report.status === "generated"
    ).length;

    const successRate =
      reportGenerations > 0
        ? ((successfulReports / reportGenerations) * 100).toFixed(1)
        : 100;

    return {
      userRegistrations,
      reportGenerations,
      dataUploads,
      successRate: parseFloat(successRate),
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Orbitron']">
            System Analytics
          </h1>
          <p className="text-[#B0AFAF] mt-2 font-['Orbitron']">
            Platform performance and usage insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-[#1A1A1A] border border-[#343434] rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button
            onClick={loadAnalytics}
            disabled={isLoading}
            className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Date Range Info */}
      <AdminSection
        title="Analytics Overview"
        description={getDateRangeLabel(dateRange)}
        icon={Calendar}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#1A1A1A] border-[#343434]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#B0AFAF]">
                    User Registrations
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {formatNumber(stats.userRegistrations)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#343434]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#B0AFAF]">
                    Data Uploads
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {formatNumber(stats.dataUploads)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-[#0F0F0E]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#343434]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#B0AFAF]">
                    Reports Generated
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {formatNumber(stats.reportGenerations)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#343434]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#B0AFAF]">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.successRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminSection>

      {/* Activity Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        <AdminSection
          title="User Activity"
          description="User registrations over time"
          icon={Users}
        >
          <div className="h-64 flex items-center justify-center bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-[#B0AFAF] mx-auto mb-4" />
              <p className="text-[#B0AFAF]">
                User registration chart visualization
              </p>
              <p className="text-sm text-[#B0AFAF] mt-2">
                {formatNumber(analytics?.userRegistrations.length || 0)}{" "}
                registrations in period
              </p>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Report Generation"
          description="Reports generated over time"
          icon={FileText}
        >
          <div className="h-64 flex items-center justify-center bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-[#B0AFAF] mx-auto mb-4" />
              <p className="text-[#B0AFAF]">
                Report generation chart visualization
              </p>
              <p className="text-sm text-[#B0AFAF] mt-2">
                {formatNumber(analytics?.reportGenerations.length || 0)} reports
                generated
              </p>
            </div>
          </div>
        </AdminSection>
      </div>

      {/* Data Summary */}
      <AdminSection
        title="Data Summary"
        description="Detailed breakdown of platform activity"
        icon={Database}
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center p-6 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <Users className="w-8 h-8 text-[#60A5FA] mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.userRegistrations)}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-1">New Users</div>
          </div>

          <div className="text-center p-6 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <Database className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.dataUploads)}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-1">Data Uploads</div>
          </div>

          <div className="text-center p-6 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <FileText className="w-8 h-8 text-[#8B5CF6] mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.reportGenerations)}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-1">Reports</div>
          </div>
        </div>
      </AdminSection>
    </div>
  );
};

export default SystemAnalytics;
