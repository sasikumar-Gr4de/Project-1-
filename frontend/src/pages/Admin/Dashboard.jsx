import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  FileText,
  Upload,
  BarChart3,
  Target,
  Award,
  Calendar,
} from "lucide-react";
import { formatDate, getScoreColor, calculateAge } from "@/utils/helper.utils";

const Dashboard = () => {
  const { dashboardData, fetchDashboard, isLoading } = useUserStore();
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    if (dashboardData) {
      setLocalData(dashboardData);
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-[#B0AFAF]">Loading your performance data...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[#262626] border-[#404040]"
            >
              <CardContent className="p-6">
                <div className="h-4 bg-[#404040] rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-[#404040] rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { user, recentReports, progressData, benchmarks } = localData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.player_name}!
          </h1>
          <p className="text-[#B0AFAF]">
            Here's your latest performance overview
          </p>
        </div>
        <Button asChild className="bg-[#A8E55C] text-black hover:bg-[#94D44A]">
          <a href="/upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload New Data
          </a>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* GR4DE Score */}
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              GR4DE Score
            </CardTitle>
            <Award className="h-4 w-4 text-[#A8E55C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {recentReports?.[0]?.overall_score ? (
                <span className={getScoreColor(recentReports[0].overall_score)}>
                  {recentReports[0].overall_score}
                </span>
              ) : (
                "--"
              )}
            </div>
            <p className="text-xs text-[#B0AFAF]">
              {recentReports?.[0] ? "Latest assessment" : "No reports yet"}
            </p>
          </CardContent>
        </Card>

        {/* Total Reports */}
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-[#A8E55C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {recentReports?.length || 0}
            </div>
            <p className="text-xs text-[#B0AFAF]">
              {recentReports?.length
                ? "All time reports"
                : "No reports generated"}
            </p>
          </CardContent>
        </Card>

        {/* Progress Trend */}
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Progress Trend
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#A8E55C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#A8E55C]">
              {progressData?.length > 1 ? "+" : ""}
              {progressData?.length > 1
                ? (
                    progressData[progressData.length - 1].overall_score -
                    progressData[0].overall_score
                  ).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-[#B0AFAF]">
              Since{" "}
              {progressData?.[0]
                ? formatDate(progressData[0].created_at)
                : "start"}
            </p>
          </CardContent>
        </Card>

        {/* Benchmark Rank */}
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Benchmark Rank
            </CardTitle>
            <Target className="h-4 w-4 text-[#A8E55C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {benchmarks ? "Top 25%" : "--"}
            </div>
            <p className="text-xs text-[#B0AFAF]">
              {user?.position} •{" "}
              {user?.date_of_birth
                ? calculateAge(user.date_of_birth) + " years"
                : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports & Progress Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reports */}
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader>
            <CardTitle className="text-white">Recent Reports</CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Your latest performance assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports?.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-[#1A1A1A] border-[#404040]"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getScoreColor(
                          report.overall_score
                        ).replace("text-", "bg-")}`}
                      />
                      <div>
                        <p className="font-medium text-white">GR4DE Report</p>
                        <p className="text-sm text-[#B0AFAF]">
                          {formatDate(report.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${getScoreColor(
                          report.overall_score
                        )}`}
                      >
                        {report.overall_score}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs bg-[#333333] text-white border-[#404040]"
                      >
                        Overall
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#B0AFAF] mx-auto mb-4" />
                <p className="text-[#B0AFAF]">No reports yet</p>
                <Button
                  asChild
                  className="mt-4 bg-[#A8E55C] text-black hover:bg-[#94D44A]"
                >
                  <a href="/upload">Upload Your First Data</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader>
            <CardTitle className="text-white">Progress Overview</CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Your score progression over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressData?.length > 0 ? (
              <div className="space-y-4">
                {progressData.slice(-6).map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">
                        {formatDate(data.created_at)}
                      </span>
                      <span
                        className={`font-medium ${getScoreColor(
                          data.overall_score
                        )}`}
                      >
                        {data.overall_score}
                      </span>
                    </div>
                    <Progress
                      value={data.overall_score}
                      className="h-2 bg-[#404040]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-[#B0AFAF] mx-auto mb-4" />
                <p className="text-[#B0AFAF]">No progress data available</p>
                <p className="text-sm text-[#B0AFAF] mt-2">
                  Upload more data to see your progress
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#A8E55C]/10 border-[#A8E55C]/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Upload className="w-8 h-8 text-[#A8E55C]" />
              <div>
                <h3 className="font-semibold text-white">Upload Match Data</h3>
                <p className="text-sm text-[#B0AFAF]">
                  Upload video and GPS data for analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#A8E55C]/10 border-[#A8E55C]/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-[#A8E55C]" />
              <div>
                <h3 className="font-semibold text-white">View Benchmarks</h3>
                <p className="text-sm text-[#B0AFAF]">
                  Compare your performance with peers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#A8E55C]/10 border-[#A8E55C]/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-[#A8E55C]" />
              <div>
                <h3 className="font-semibold text-white">All Reports</h3>
                <p className="text-sm text-[#B0AFAF]">
                  Access your complete report history
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
