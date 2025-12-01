// Reports.jsx - Updated to display more fields from server response
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
  Trophy,
  Zap,
  BarChart3,
  DownloadIcon,
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
      // Transform the data to match the expected format
      const transformedReports = dashboardData.recentReports.map((report) => ({
        id: report.id,
        title: `Performance Assessment vs ${
          report.report_data?.match_metadata?.opponent || "Unknown"
        }`,
        match_date: report.match_date,
        overall_score:
          report.gr4de_score ||
          report.report_data?.scoring_metrics?.gr4de_score ||
          0,
        tempo_index: report.tempo_index || 0,
        category_scores: {
          technical:
            report.report_data?.scoring_metrics?.pillars?.technical || 0,
          tactical: report.report_data?.scoring_metrics?.pillars?.tactical || 0,
          physical: report.report_data?.scoring_metrics?.pillars?.physical || 0,
          mental: report.report_data?.scoring_metrics?.pillars?.mental || 0,
        },
        // Include additional fields from server response
        match_result: report.report_data?.match_metadata?.result,
        minutes_played: report.report_data?.match_metadata?.minutes_played,
        position: report.report_data?.match_metadata?.position_played,
        formation: report.report_data?.match_metadata?.formation,
        competition: report.report_data?.match_metadata?.competition,
        opponent: report.report_data?.match_metadata?.opponent,
        final_score: report.report_data?.match_metadata?.final_score,
        jersey_number: report.report_data?.match_metadata?.jersey_number,
        venue: report.report_data?.match_metadata?.venue,

        // Performance metrics
        technical_score: report.report_data?.technical_metrics?.score,
        tactical_score: report.report_data?.tactical_metrics?.score,
        physical_score: report.report_data?.physical_metrics?.score,
        mental_score: report.report_data?.mental_metrics?.score,

        // Percentiles
        technical_percentile: report.report_data?.technical_metrics?.percentile,
        tactical_percentile: report.report_data?.tactical_metrics?.percentile,
        physical_percentile: report.report_data?.physical_metrics?.percentile,
        mental_percentile: report.report_data?.mental_metrics?.percentile,

        // Key highlights
        key_strength:
          report.report_data?.insights?.[0]?.title || "No insights available",
        key_strength_category:
          report.report_data?.insights?.[0]?.category || "N/A",

        // Include original data for reference
        original_data: report,
      }));
      console.log(transformedReports);
      setReports(transformedReports);
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
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Elite";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Work";
  };

  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case "win":
        return "bg-green-500/20 text-green-400";
      case "draw":
        return "bg-yellow-500/20 text-yellow-400";
      case "loss":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatPercentile = (percentile) => {
    if (!percentile) return "N/A";
    return `Top ${100 - percentile}%`;
  };

  // Define columns for DataTable
  const reportColumns = [
    {
      header: "Match Details",
      accessor: "title",
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-200">
                {row.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-(--muted-text) mt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {row.match_date
                      ? new Date(row.match_date).toLocaleDateString()
                      : "Date not available"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span className="capitalize">
                    {row.position?.replace("_", " ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Info Row */}
          <div className="flex items-center space-x-4 text-sm">
            <Badge
              variant="outline"
              className={getResultColor(row.match_result)}
            >
              {row.final_score || "N/A"}
              {/* {row.match_result || "N/A"} */}
            </Badge>
            {/* <span className="text-white font-medium"></span> */}
            <span className="text-(--muted-text)">•</span>
            <span className="text-(--muted-text)">
              {row.competition?.replace("_", " ") || "N/A"}
            </span>
            <span className="text-(--muted-text)">•</span>
            <span className="text-(--muted-text)">
              {row.minutes_played || 0} min
            </span>
          </div>

          {/* Additional Match Info */}
          <div className="col-span-2 pt-2 border-t border-(--surface-2)">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-(--muted-text)">Formation:</span>
                <span className="text-white">{row.formation || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--muted-text)">Venue:</span>
                <span className="text-white capitalize">
                  {row.venue || "N/A"}
                </span>
              </div>
              {row.jersey_number && (
                <div className="flex justify-between">
                  <span className="text-(--muted-text)">Jersey:</span>
                  <span className="text-white">#{row.jersey_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Insight */}
          {/* {row.key_strength && (
            <div className="mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-medium text-primary">
                    Key Strength:
                  </span>
                  <p className="text-sm text-white mt-0.5">
                    {row.key_strength}
                  </p>
                </div>
              </div>
            </div>
          )} */}
        </div>
      ),
    },
    {
      header: "Performance Score",
      accessor: "overall_score",
      cell: ({ row }) => (
        <div className="text-center space-y-2">
          <div className="relative">
            <div
              className={`text-4xl font-bold bg-linear-to-r ${getScoreColor(
                row.overall_score
              )} bg-clip-text text-transparent`}
            >
              {row.overall_score}
            </div>
            <div className="absolute -top-1 -right-2">
              <Badge
                variant={getScoreBadgeVariant(row.overall_score)}
                className="text-xs"
              >
                {getScoreLabel(row.overall_score)}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <BarChart3 className="w-4 h-4 text-(--muted-text)" />
              <span className="text-sm text-(--muted-text)">Tempo Index:</span>
              <span className="text-sm font-medium text-white">
                {row.tempo_index || 0}
              </span>
            </div>
            {row.technical_percentile && (
              <div className="text-xs text-(--muted-text)">
                Technical: {formatPercentile(row.technical_percentile)}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Pillar Analysis",
      accessor: "category_scores",
      cell: ({ row }) => (
        <div className="space-y-3 min-w-[200px]">
          {row.category_scores &&
            Object.entries(row.category_scores).map(([category, score]) => {
              const percentile = row[`${category}_percentile`];
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white capitalize">
                        {category.replace("_", " ")}
                      </span>
                      {percentile && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          {formatPercentile(percentile)}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-bold text-white">
                      {score}/100
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={score}
                      className={`h-2 ${getScoreColor(score)} rounded-full`}
                    />
                    <div
                      className="absolute top-0 h-2 bg-white/30 rounded-full"
                      style={{ width: `${percentile || 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ),
    },
    {
      header: "Match Statistics",
      accessor: "match_stats",
      cell: ({ row }) => {
        const technical =
          row.original_data?.report_data?.technical_metrics?.details;
        const physical =
          row.original_data?.report_data?.physical_metrics?.details;

        return (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Technical Stats */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                Technical
              </div>
              {technical?.passing && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-(--muted-text)">Pass Acc:</span>
                    <span className="text-white font-medium">
                      {technical.passing.completion_rate?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--muted-text)">Key Passes:</span>
                    <span className="text-white font-medium">
                      {technical.passing.key_passes || 0}
                    </span>
                  </div>
                </div>
              )}
              {technical?.shooting && (
                <div className="flex justify-between">
                  <span className="text-(--muted-text)">Shots:</span>
                  <span className="text-white font-medium">
                    {technical.shooting.total_shots || 0}
                  </span>
                </div>
              )}
            </div>

            {/* Physical Stats */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[var(--color-blue)] uppercase tracking-wider">
                Physical
              </div>
              {physical?.distance && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-(--muted-text)">Distance:</span>
                    <span className="text-white font-medium">
                      {(physical.distance.total_distance_km || 0).toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--muted-text)">Sprints:</span>
                    <span className="text-white font-medium">
                      {physical.intensity?.sprint_count || 0}
                    </span>
                  </div>
                </div>
              )}
              {physical?.speed && (
                <div className="flex justify-between">
                  <span className="text-(--muted-text)">Max Speed:</span>
                  <span className="text-white font-medium">
                    {physical.speed.max_speed_kmh?.toFixed(1) || 0} km/h
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  // Define actions for DataTable
  const reportActions = ({ row }) => [
    <div
      key="actions-column"
      className="flex flex-col space-y-2 min-w-[120px] text-center"
    >
      {/* Watch Video Button */}
      <Button
        key="view"
        asChild
        size="sm"
        className="w-full h-8 bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-200 text-black text-xs"
      >
        <Link to={`/reports/${row.id}`}>
          <Eye className="w-3 h-3 mr-1" />
          Watch Video
        </Link>
      </Button>

      {/* Download PDF Button */}
      <Button
        key="export"
        size="sm"
        className="w-full h-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 hover:text-white transition-all duration-200 text-xs"
        onClick={() => handleExport(row)}
      >
        <Download className="w-3 h-3 mr-1" />
        Export PDF
      </Button>
    </div>,
  ];

  const handleExport = (report) => {
    // Implement export functionality
    console.log("Export report:", report.id);
    // Add actual export logic here
  };

  // Calculate stats from reports
  const calculateStats = () => {
    if (reports.length === 0) {
      return {
        totalReports: 0,
        averageScore: 0,
        averageTempo: 0,
        topPercentile: "N/A",
      };
    }

    const totalScore = reports.reduce(
      (acc, report) => acc + report.overall_score,
      0
    );
    const totalTempo = reports.reduce(
      (acc, report) => acc + (report.tempo_index || 0),
      0
    );

    // Calculate average percentile
    const validPercentiles = reports
      .map((r) => r.technical_percentile)
      .filter((p) => p);
    const avgPercentile =
      validPercentiles.length > 0
        ? Math.round(
            validPercentiles.reduce((a, b) => a + b, 0) /
              validPercentiles.length
          )
        : 0;

    return {
      totalReports: reports.length,
      averageScore: Math.round(totalScore / reports.length),
      averageTempo: Math.round(totalTempo / reports.length),
      topPercentile: avgPercentile > 0 ? `Top ${100 - avgPercentile}%` : "N/A",
    };
  };

  const stats = calculateStats();

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
          value={stats.totalReports}
          description="All time assessments"
          icon={FileText}
          gradient="from-[var(--color-blue-light)] to-[var(--color-blue)]"
          valueColor="text-white"
          className="text-sm"
        />

        <StatsCard
          title="Average GR4DE"
          value={stats.averageScore}
          description="Overall performance"
          icon={Target}
          gradient="from-primary to-secondary"
          valueColor="text-primary"
          className="text-sm"
        />

        <StatsCard
          title="Avg Tempo"
          value={stats.averageTempo}
          description="Tempo index average"
          icon={TrendingUp}
          gradient="from-[var(--color-orange-light)] to-[var(--color-orange)]"
          valueColor="text-(--color-orange-light)"
          className="text-sm"
        />

        <StatsCard
          title="Percentile"
          value={stats.topPercentile}
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
        // searchPlaceholder="Search by opponent, position, or competition..."
      />
    </div>
  );
};

export default Reports;
