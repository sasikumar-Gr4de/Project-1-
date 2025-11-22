// Reports.jsx - Updated to use DataTable component
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";

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
    if (score >= 90) return "from-primary to-(--accent-2)";
    if (score >= 80) return "from-(--color-blue-light) to-(--color-blue)";

    return "from-(--color-orange-light) to-(--color-orange)";
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

  // Define columns for DataTable
  const reportColumns = [
    {
      header: "Assessment",
      accessor: "title",
      cell: ({ row }) => (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-200">
            {row.title || `Performance Assessment`}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-(--muted-text)">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {row.date
                  ? new Date(row.date).toLocaleDateString()
                  : "Date not available"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{row.position || "General Assessment"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Overall Score",
      accessor: "overall_score",
      cell: ({ row }) => (
        <div className="text-right">
          <div
            className={`text-3xl font-bold bg-linear-to-r ${getScoreColor(
              row.overall_score
            )} bg-clip-text text-transparent`}
          >
            {row.overall_score}
          </div>
          <Badge
            variant={getScoreBadgeVariant(row.overall_score)}
            className="mt-1"
          >
            {getScoreLabel(row.overall_score)}
          </Badge>
        </div>
      ),
    },
    {
      header: "Category Scores",
      accessor: "category_scores",
      cell: ({ row }) => (
        <div className="space-y-3 min-w-[200px]">
          {row.category_scores &&
            Object.entries(row.category_scores).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium capitalize">
                    {category.replace("_", " ")}
                  </span>
                  <span className="text-(--muted-text)">{score}/100</span>
                </div>
                <Progress
                  value={score}
                  className={`h-2 ${getScoreColor(score)} rounded-full`}
                />
              </div>
            ))}
        </div>
      ),
    },
  ];

  // Define actions for DataTable
  const reportActions = ({ row }) => [
    <Button
      key="view"
      asChild
      variant="outline"
      size="sm"
      className="border-(--surface-2) bg-(--surface-1) text-white hover:bg-(--surface-2) hover:text-white"
    >
      <Link to={`/reports/${row.id}`}>
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </Link>
    </Button>,
    <Button
      key="export"
      variant="outline"
      size="sm"
      className="border-(--surface-2) bg-(--surface-1) text-white hover:bg-(--surface-2) hover:text-white"
    >
      <Download className="w-4 h-4 mr-2" />
      Export
    </Button>,
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent animate-pulse">
              Performance Reports
            </h1>
            <p className="text-(--muted-text) text-lg mt-2 font-['Orbitron'] animate-pulse">
              Loading your reports...
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-(--surface-1) border-(--surface-2)"
            >
              <CardContent className="p-6">
                <div className="h-6 bg-(--surface-2) rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-(--surface-2) rounded w-full"></div>
                  <div className="h-4 bg-(--surface-2) rounded w-3/4"></div>
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
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Performance Reports
          </h1>
          <p className="text-(--muted-text) text-lg mt-2 font-['Orbitron']">
            Track your progress and analyze performance trends
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 lg:grid-cols-4">
        <StatsCard
          title="Total Reports"
          value={reports.length}
          description="All time assessments"
          icon={FileText}
          gradient="from-[var(--color-blue-light)] to-[var(--color-blue)]"
          valueColor="text-white"
          className="text-sm"
        />

        <StatsCard
          title="Average Score"
          value={
            reports.length > 0
              ? Math.round(
                  reports.reduce(
                    (acc, report) => acc + report.overall_score,
                    0
                  ) / reports.length
                )
              : 0
          }
          description="Overall performance"
          icon={Target}
          gradient="from-primary to-secondary"
          valueColor="text-primary"
          className="text-sm"
        />

        <StatsCard
          title="Average Score"
          value="+8%"
          description="Since last quarter"
          icon={TrendingUp}
          gradient="from-[var(--color-orange-light)] to-[var(--color-orange)]"
          valueColor="text-(--color-orange-light)"
          className="text-sm"
        />

        <StatsCard
          title="Percentile"
          value=" Top 25%"
          description="Among peers"
          icon={Users}
          gradient="from-[var(--color-purple-light)] to-[var(--color-purple)]"
          valueColor="text-[var(--color-blue-light)]"
          className="text-sm"
        />
      </div>

      <DataTable
        data={reports}
        columns={reportColumns}
        actions={reportActions}
        isLoading={isLoading}
        emptyStateTitle="No Reports Available"
        emptyStateDescription="Your performance reports will appear here once assessments are completed."
        searchable={false}
      />
    </div>
  );
};

export default Reports;
