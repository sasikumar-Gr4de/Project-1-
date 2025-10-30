// Reports.jsx - Updated with platform color palette
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Calendar,
  Download,
  Eye,
  TrendingUp,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const Reports = () => {
  const { dashboardData, fetchDashboard, isLoading } = useUserStore();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  useEffect(() => {
    if (dashboardData?.recentReports) {
      setReports(dashboardData.recentReports);
    }
  }, [dashboardData]);

  const getScoreColor = (score) => {
    if (score >= 90) return "from-primary to-[#94D44A]";
    if (score >= 80) return "from-[#60A5FA] to-[#3B82F6]";
    if (score >= 70) return "from-[#F59E0B] to-[#D97706]";
    return "from-[#EF4444] to-[#DC2626]";
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    if (score >= 70) return "outline";
    return "destructive";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Elite";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Work";
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent animate-pulse">
              Performance Reports
            </h1>
            <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron'] animate-pulse">
              Loading your reports...
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[#262626] border-[#343434]"
            >
              <CardContent className="p-6">
                <div className="h-6 bg-[#343434] rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-[#343434] rounded w-full"></div>
                  <div className="h-4 bg-[#343434] rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold  font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Performance Reports
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
            Track your progress and analyze performance trends
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Total Reports
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Inter']">
              {reports.length}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              All time assessments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Average Score
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5 text-[#0F0F0E]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-['Inter']">
              {reports.length > 0
                ? Math.round(
                    reports.reduce(
                      (acc, report) => acc + report.overall_score,
                      0
                    ) / reports.length
                  )
                : 0}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Trend
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F59E0B] font-['Inter']">
              +8%
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              Since last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter']">
              Percentile
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] font-['Inter']">
              Top 25%
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter']">
              Among peers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white font-['Inter']">
            Recent Assessments
          </CardTitle>
          <CardDescription className="text-[#B0AFAF] text-lg font-['Inter']">
            Your latest performance evaluations and reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-[#343434] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2 font-['Inter']">
                No Reports Available
              </h3>
              <p className="text-[#B0AFAF] font-['Inter']">
                Your performance reports will appear here once assessments are
                completed.
              </p>
            </div>
          ) : (
            reports.map((report, index) => (
              <div
                key={report.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-[#1A1A1A] rounded-xl border border-[#343434] hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex-1 space-y-4 lg:space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors duration-200 font-['Inter']">
                        {report.title || `Performance Assessment #${index + 1}`}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-[#B0AFAF] font-['Inter']">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {report.date
                              ? new Date(report.date).toLocaleDateString()
                              : "Date not available"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{report.position || "General Assessment"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score Display - Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold bg-linear-to-r ${getScoreColor(
                            report.overall_score
                          )} bg-clip-text text-transparent font-['Inter']`}
                        >
                          {report.overall_score}
                        </div>
                        <Badge
                          variant={getScoreBadgeVariant(report.overall_score)}
                          className="mt-1 font-['Inter']"
                        >
                          {getScoreLabel(report.overall_score)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    {report.category_scores &&
                      Object.entries(report.category_scores).map(
                        ([category, score]) => (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white font-medium capitalize font-['Inter']">
                                {category.replace("_", " ")}
                              </span>
                              <span className="text-[#B0AFAF] font-['Inter']">
                                {score}/100
                              </span>
                            </div>
                            <Progress
                              value={score}
                              className={`h-2 ${getScoreColor(
                                score
                              )} rounded-full`}
                            />
                          </div>
                        )
                      )}
                  </div>

                  {/* Score Display - Mobile */}
                  <div className="lg:hidden flex items-center justify-between pt-4 border-t border-[#343434]">
                    <div className="text-left">
                      <div
                        className={`text-2xl font-bold bg-linear-to-r ${getScoreColor(
                          report.overall_score
                        )} bg-clip-text text-transparent font-['Inter']`}
                      >
                        {report.overall_score}
                      </div>
                      <Badge
                        variant={getScoreBadgeVariant(report.overall_score)}
                        className="mt-1 font-['Inter']"
                      >
                        {getScoreLabel(report.overall_score)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 lg:space-x-3 lg:ml-6 lg:pl-6 lg:border-l lg:border-[#343434] mt-4 lg:mt-0">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-[#343434] bg-[#262626] text-white hover:bg-[#343434] hover:text-white font-['Inter']"
                  >
                    <Link to={`/reports/${report.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#343434] bg-[#262626] text-white hover:bg-[#343434] hover:text-white font-['Inter']"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
