import { useState, useEffect } from "react";
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
  Activity,
  User,
} from "lucide-react";
import { formatDate, getScoreColor, calculateAge } from "@/utils/helper.utils";
import StatsCard from "@/components/common/StatsCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { dashboardData, fetchDashboard, isLoading, error } = useUserStore();
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

  // Handle player profile not found
  if (error?.includes("Player profile not found")) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              Welcome!
            </h1>
            <p className="text-placeholder text-lg mt-2 font-['Orbitron']">
              Complete your player profile to get started
            </p>
          </div>
        </div>

        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardContent className="p-12 text-center">
            <User className="w-24 h-24 text-placeholder mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Player Profile Required
            </h3>
            <p className="text-placeholder mb-6 max-w-md mx-auto">
              You need to complete your player profile before you can access the
              dashboard features.
            </p>
            <Button
              asChild
              className="bg-linear-to-r from-primary to-[#94D44A] text-black hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-8 py-3"
            >
              <a href="/passport">Complete Player Profile</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Orbitron'] animate-pulse bg-(--surface-1) rounded-lg w-64 h-10"></h1>
            <p className="text-placeholder mt-2 font-['Orbitron'] animate-pulse bg-(--surface-1) rounded w-48 h-4"></p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-(--surface-1) border-(--surface-2)"
            >
              <CardContent className="p-6">
                <div className="h-4 bg-(--surface-2) rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-(--surface-2) rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { user, recentReports, progressData, benchmarks } = localData || {};
  const latestReport = recentReports?.[0];

  // Calculate player name from identity data
  const playerName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.player_name || "Player";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Welcome back, {playerName}!
          </h1>
          <p className="text-placeholder text-lg mt-2 font-['Orbitron']">
            Here's your latest performance overview and insights
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-primary to-[#94D44A] text-black hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
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
        <StatsCard
          title="GR4DE Score"
          value={
            latestReport?.summary_json?.overall_score ? (
              <span
                className={getScoreColor(
                  latestReport.summary_json.overall_score
                )}
              >
                {latestReport.summary_json.overall_score}
              </span>
            ) : null
          }
          description={latestReport ? "Latest assessment" : "No reports yet"}
          icon={Award}
          gradient="from-primary to-secondary"
          valueColor="text-placeholder"
          className="text-sm"
        />

        {/* Total Reports */}
        <StatsCard
          title="Total Reports"
          value={recentReports?.length || 0}
          description={
            recentReports?.length ? "All time reports" : "No reports generated"
          }
          icon={Award}
          gradient="from-[var(--color-blue-light)] to-[var(--color-blue)]"
          valueColor="text-[var(--color-blue-light)]"
          className="text-sm"
        />

        {/* Progress Trend */}
        <StatsCard
          title="Progress Trend"
          value={`${progressData?.length > 1 ? "+" : ""}
              ${
                progressData?.length > 1
                  ? (
                      (progressData[progressData.length - 1]?.gr4de_score ||
                        0) - (progressData[0]?.gr4de_score || 0)
                    ).toFixed(1)
                  : "0"
              }`}
          description={`Since ${
            progressData?.[0]?.date ? formatDate(progressData[0].date) : "start"
          }`}
          icon={TrendingUp}
          gradient="from-[var(--color-orange-light)] to-[var(--color-orange)]"
          valueColor="text-[var(--color-orange-light)]"
          className="text-sm"
        />

        {/* Benchmark Rank */}
        <StatsCard
          title="Progress Trend"
          value={benchmarks ? "Top 25%" : "--"}
          description={`Since ${user?.position || "--"} • ${
            user?.date_of_birth
              ? calculateAge(user.date_of_birth) + " years"
              : "--"
          }`}
          icon={Target}
          gradient="from-[var(--color-orange-light)] to-[var(--color-orange)]"
          valueColor="text-[var(--color-orange-light)]"
          className="text-sm"
        />
      </div>

      {/* Recent Reports & Progress Chart */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Reports */}
        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Recent Reports
            </CardTitle>
            <CardDescription className="text-placeholder">
              Your latest performance assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports?.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div
                    key={report.report_id}
                    className="flex items-center justify-between p-4 border rounded-xl bg-(--surface-0) border-(--surface-2) hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(
                          report.summary_json?.overall_score || 0
                        ).replace(
                          "text-",
                          "bg-"
                        )} bg-opacity-20 border-2 ${getScoreColor(
                          report.summary_json?.overall_score || 0
                        ).replace("text-", "border-")} border-opacity-30`}
                      >
                        <Award
                          className={`w-6 h-6 ${getScoreColor(
                            report.summary_json?.overall_score || 0
                          )}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-primary transition-colors">
                          {report.report_type || "GR4DE Report"}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-placeholder mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(report.created_at)}</span>
                          {index === 0 && (
                            <Badge className="bg-primary text-secondary-foreground text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${getScoreColor(
                          report.summary_json?.overall_score || 0
                        )}`}
                      >
                        {report.summary_json?.overall_score || "--"}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs bg-(--surface-2) text-placeholder border-(--surface-2)"
                      >
                        Overall
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-placeholder mx-auto mb-4 opacity-50" />
                <p className="text-placeholder text-lg">No reports yet</p>
                <p className="text-sm text-placeholder mt-2">
                  Upload your first match data to get started
                </p>
                <Button
                  asChild
                  className="mt-6 bg-linear-to-r from-primary to-[#94D44A] text-black hover:from-secondary hover:to-primary font-semibold rounded-xl"
                >
                  <Link to="/upload">Upload Your First Data</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Progress Overview
            </CardTitle>
            <CardDescription className="text-placeholder">
              Your score progression over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressData?.length > 0 ? (
              <div className="space-y-6">
                {progressData.slice(-6).map((data, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">
                        {formatDate(data.date)}
                      </span>
                      <span
                        className={`font-bold ${getScoreColor(
                          data.gr4de_score
                        )}`}
                      >
                        {data.gr4de_score}
                      </span>
                    </div>
                    <Progress
                      value={data.gr4de_score}
                      max={100}
                      className="h-3 bg-(--surface-2) rounded-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-placeholder mx-auto mb-4 opacity-50" />
                <p className="text-placeholder text-lg">
                  No progress data available
                </p>
                <p className="text-sm text-placeholder mt-2">
                  Upload more data to see your progress
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/upload">
          <Card className="bg-linear-to-br from-primary/10 to-primary/8 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                    Upload Match Data
                  </h3>
                  <p className="text-sm text-placeholder mt-1">
                    Upload video and GPS data for analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/benchmarks">
          <Card className="bg-linear-to-br from-(--color-blue-light)/10 to-(--color-blue-light)/5 border-(--color-blue-light)/20 hover:border-(--color-blue-light)/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-linear-to-br from-(--color-blue-light) to-(--color-blue-light) rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-(--color-blue-light) transition-colors">
                    View Benchmarks
                  </h3>
                  <p className="text-sm text-placeholder mt-1">
                    Compare your performance with peers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/reports">
          <Card className="bg-linear-to-br from-(--color-purple-light)/10 to-(--color-purple)//5 border-(--color-purple-light)/20 hover:border-(--color-purple-light)/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-linear-to-br from-(--color-purple-light) to-(--color-purple) rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-(--color-purple-light) transition-colors">
                    All Reports
                  </h3>
                  <p className="text-sm text-placeholder mt-1">
                    Access your complete report history
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
