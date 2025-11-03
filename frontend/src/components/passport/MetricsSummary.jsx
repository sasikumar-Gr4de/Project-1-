import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  TrendingUp,
  Zap,
  Gauge,
  Target,
  Calendar,
} from "lucide-react";
import { passportService } from "@/services/passport.service";

const MetricsSummary = ({ playerId }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("4weeks");

  useEffect(() => {
    fetchMetricsSummary();
  }, [playerId, period]);

  const fetchMetricsSummary = async () => {
    try {
      setIsLoading(true);
      const response = await passportService.getMetricsSummary(
        playerId,
        period
      );
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "1week":
        return "Last 7 Days";
      case "4weeks":
        return "Last 4 Weeks";
      case "3months":
        return "Last 3 Months";
      case "1year":
        return "Last 12 Months";
      default:
        return "Last 4 Weeks";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Performance Metrics
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            Loading performance summary...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-[#343434] rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Performance Metrics
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            No metrics data available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-[#B0AFAF] mx-auto mb-4 opacity-50" />
            <p className="text-[#B0AFAF] text-lg">No metrics data</p>
            <p className="text-sm text-[#B0AFAF] mt-2">
              Performance metrics will appear after match analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Performance Metrics
            </CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              {getPeriodLabel()} performance summary
            </CardDescription>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#1A1A1A] border border-[#343434] text-white text-sm rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 px-3 py-2 transition-all duration-300"
          >
            <option value="1week">1 Week</option>
            <option value="4weeks">4 Weeks</option>
            <option value="3months">3 Months</option>
            <option value="1year">1 Year</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Matches */}
          <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white group-hover:text-[#60A5FA] transition-colors">
              {summary.totalMatches}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-2">Total Matches</div>
          </div>

          {/* Average Score */}
          <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Target className="w-6 h-6 text-[#0F0F0E]" />
            </div>
            <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
              {summary.avgScore}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-2">Avg GR4DE Score</div>
          </div>

          {/* Average Minutes */}
          <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white group-hover:text-[#F59E0B] transition-colors">
              {summary.avgMinutes}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-2">Avg Minutes</div>
          </div>

          {/* Total Distance */}
          <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
              {summary.totalDistance
                ? `${(summary.totalDistance / 1000).toFixed(0)}km`
                : "--"}
            </div>
            <div className="text-sm text-[#B0AFAF] mt-2">Total Distance</div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {/* Best Score */}
          <div className="p-4 border-2 border-[#343434] rounded-xl bg-[#1A1A1A] hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                Best GR4DE Score
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Peak Performance
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {summary.bestScore}
            </div>
            <Progress
              value={summary.bestScore}
              className="h-2 bg-[#343434] rounded-full mt-2"
            />
          </div>

          {/* Improvement */}
          <div className="p-4 border-2 border-[#343434] rounded-xl bg-[#1A1A1A] hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                Performance Trend
              </span>
              <div className="flex items-center space-x-1">
                <TrendingUp
                  className={`w-4 h-4 ${
                    summary.improvement > 0
                      ? "text-green-400"
                      : summary.improvement < 0
                      ? "text-red-400"
                      : "text-[#B0AFAF]"
                  }`}
                />
                <Badge
                  className={
                    summary.improvement > 0
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : summary.improvement < 0
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-[#343434] text-[#B0AFAF] border-[#343434]"
                  }
                >
                  {summary.improvement > 0 ? "+" : ""}
                  {summary.improvement}
                </Badge>
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                summary.improvement > 0
                  ? "text-green-400"
                  : summary.improvement < 0
                  ? "text-red-400"
                  : "text-[#B0AFAF]"
              }`}
            >
              {summary.improvement > 0 ? "+" : ""}
              {summary.improvement} pts
            </div>
            <div className="text-xs text-[#B0AFAF] mt-1">
              Since period start
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSummary;
