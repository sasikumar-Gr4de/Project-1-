// Dashboard.jsx - Updated with beautiful harmonized design
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
  Users,
  Activity,
  Zap,
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Orbitron'] animate-pulse bg-[#262626] rounded-lg w-64 h-10"></h1>
            <p className="text-[#B0AFAF] mt-2 font-['Orbitron'] animate-pulse bg-[#262626] rounded w-48 h-4"></p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[#262626] border-[#343434]"
            >
              <CardContent className="p-6">
                <div className="h-4 bg-[#343434] rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-[#343434] rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { user, recentReports, progressData, benchmarks } = localData || {};
  const latestReport = recentReports?.[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold  font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent font-obitron">
            Welcome back, {user?.player_name}!
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
            Here's your latest performance overview and insights
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300 font-['Inter']"
        >
          <a href="/upload">
            <Upload className="w-5 h-5 mr-2" />
            Upload New Data
          </a>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* GR4DE Score */}
        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              GR4DE Score
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center shadow-lg">
              <Award className="h-5 w-5 text-[#0F0F0E]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-['Inter']">
              {latestReport?.overall_score ? (
                <span className={getScoreColor(latestReport.overall_score)}>
                  {latestReport.overall_score}
                </span>
              ) : (
                <span className="text-[#B0AFAF]">--</span>
              )}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              {latestReport ? "Latest assessment" : "No reports yet"}
            </p>
          </CardContent>
        </Card>

        {/* Total Reports */}
        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Total Reports
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-['Inter']">
              {recentReports?.length || 0}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              {recentReports?.length
                ? "All time reports"
                : "No reports generated"}
            </p>
          </CardContent>
        </Card>

        {/* Progress Trend */}
        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Progress Trend
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary font-['Inter']">
              {progressData?.length > 1 ? "+" : ""}
              {progressData?.length > 1
                ? (
                    progressData[progressData.length - 1].overall_score -
                    progressData[0].overall_score
                  ).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              Since{" "}
              {progressData?.[0]
                ? formatDate(progressData[0].created_at)
                : "start"}
            </p>
          </CardContent>
        </Card>

        {/* Benchmark Rank */}
        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Benchmark Rank
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-['Inter']">
              {benchmarks ? "Top 25%" : "--"}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              {user?.position} •{" "}
              {user?.date_of_birth
                ? calculateAge(user.date_of_birth) + " years"
                : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports & Progress Chart */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Reports */}
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white font-['Inter'] flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Recent Reports
            </CardTitle>
            <CardDescription className="text-[#B0AFAF] font-['Inter']">
              Your latest performance assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports?.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-xl bg-[#1A1A1A] border-[#343434] hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(
                          report.overall_score
                        ).replace(
                          "text-",
                          "bg-"
                        )} bg-opacity-20 border-2 ${getScoreColor(
                          report.overall_score
                        ).replace("text-", "border-")} border-opacity-30`}
                      >
                        <Award
                          className={`w-6 h-6 ${getScoreColor(
                            report.overall_score
                          )}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white font-['Inter'] group-hover:text-primary transition-colors">
                          GR4DE Report
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-[#B0AFAF] mt-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-['Inter']">
                            {formatDate(report.created_at)}
                          </span>
                          {index === 0 && (
                            <Badge className="bg-primary text-[#0F0F0E] text-xs font-['Inter']">
                              Latest
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${getScoreColor(
                          report.overall_score
                        )} font-['Inter']`}
                      >
                        {report.overall_score}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs bg-[#343434] text-[#B0AFAF] border-[#343434] font-['Inter']"
                      >
                        Overall
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-[#B0AFAF] mx-auto mb-4 opacity-50" />
                <p className="text-[#B0AFAF] font-['Inter'] text-lg">
                  No reports yet
                </p>
                <p className="text-sm text-[#B0AFAF] mt-2 font-['Inter']">
                  Upload your first match data to get started
                </p>
                <Button
                  asChild
                  className="mt-6 bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl font-['Inter']"
                >
                  <a href="/upload">Upload Your First Data</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white font-['Inter'] flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Progress Overview
            </CardTitle>
            <CardDescription className="text-[#B0AFAF] font-['Inter']">
              Your score progression over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressData?.length > 0 ? (
              <div className="space-y-6">
                {progressData.slice(-6).map((data, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white font-['Inter']">
                        {formatDate(data.created_at)}
                      </span>
                      <span
                        className={`font-bold ${getScoreColor(
                          data.overall_score
                        )} font-['Inter']`}
                      >
                        {data.overall_score}
                      </span>
                    </div>
                    <Progress
                      value={data.overall_score}
                      className="h-3 bg-[#343434] rounded-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-[#B0AFAF] mx-auto mb-4 opacity-50" />
                <p className="text-[#B0AFAF] font-['Inter'] text-lg">
                  No progress data available
                </p>
                <p className="text-sm text-[#B0AFAF] mt-2 font-['Inter']">
                  Upload more data to see your progress
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-linear-to-br from-primary/10 to-[#94D44A]/5 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-6 h-6 text-[#0F0F0E]" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-['Inter'] group-hover:text-primary transition-colors">
                  Upload Match Data
                </h3>
                <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter']">
                  Upload video and GPS data for analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-[#60A5FA]/10 to-[#3B82F6]/5 border-[#60A5FA]/20 hover:border-[#60A5FA]/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-['Inter'] group-hover:text-[#60A5FA] transition-colors">
                  View Benchmarks
                </h3>
                <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter']">
                  Compare your performance with peers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-[#8B5CF6]/10 to-[#7C3AED]/5 border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-['Inter'] group-hover:text-[#8B5CF6] transition-colors">
                  All Reports
                </h3>
                <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter']">
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
