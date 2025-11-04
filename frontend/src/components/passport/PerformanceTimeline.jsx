import React, { useState } from "react";
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
  Calendar,
  Award,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PerformanceTimeline = ({ timeline, metrics }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("12months");

  // Use provided timeline or build from metrics
  const displayTimeline =
    timeline && timeline.length > 0
      ? timeline
      : buildTimelineFromMetrics(metrics);

  const displayItems = expanded ? displayTimeline : displayTimeline.slice(0, 5);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "metric":
        return <Award className="w-4 h-4" />;
      case "report":
        return <FileText className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case "metric":
        return "bg-primary/20 text-primary border-primary/30";
      case "report":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-[#343434] text-[#B0AFAF] border-[#343434]";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to build timeline from metrics if not provided
  function buildTimelineFromMetrics(metrics = []) {
    if (!metrics || metrics.length === 0) return [];

    return metrics
      .map((metric) => ({
        type: "metric",
        date: metric.date,
        title: "Match Performance",
        description: `GR4DE Score: ${metric.gr4de_score} | ${
          metric.competition || "Match"
        }`,
        data: metric,
        sortDate: new Date(metric.date),
      }))
      .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
  }

  if (!displayTimeline || displayTimeline.length === 0) {
    return (
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Performance Timeline
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            Your performance history will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-[#B0AFAF] mx-auto mb-4 opacity-50" />
            <p className="text-[#B0AFAF] text-lg">No performance data yet</p>
            <p className="text-sm text-[#B0AFAF] mt-2">
              Match metrics and reports will appear in your timeline
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
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Performance Timeline
            </CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Your performance history and key milestones
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-[#1A1A1A] border border-[#343434] text-white text-sm rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 px-3 py-2 transition-all duration-300"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((event, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 border rounded-xl bg-[#1A1A1A] border-[#343434] hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getEventColor(
                    event.type
                  )} transition-all duration-300 group-hover:scale-110`}
                >
                  {getEventIcon(event.type)}
                </div>
                {index < displayItems.length - 1 && (
                  <div className="flex-1 w-0.5 bg-[#343434] mt-2"></div>
                )}
              </div>

              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[#B0AFAF] mt-1">
                      {event.description}
                    </p>
                    {event.data?.competition && (
                      <Badge
                        variant="outline"
                        className="mt-2 bg-[#343434] text-[#B0AFAF] border-[#343434] text-xs"
                      >
                        {event.data.competition}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-[#B0AFAF]">
                      {formatDate(event.date)}
                    </div>
                    {event.data?.gr4de_score && (
                      <div
                        className={`text-xl font-bold ${getScoreColor(
                          event.data.gr4de_score
                        )}`}
                      >
                        {event.data.gr4de_score}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional metrics */}
                {event.type === "metric" && event.data && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 pt-3 border-t border-[#343434]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {event.data.minutes || "--"}
                      </div>
                      <div className="text-xs text-[#B0AFAF]">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {event.data.gps_summary?.distance_m
                          ? `${(
                              event.data.gps_summary.distance_m / 1000
                            ).toFixed(1)}km`
                          : "--"}
                      </div>
                      <div className="text-xs text-[#B0AFAF]">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {event.data.event_summary?.passes_completed || "--"}
                      </div>
                      <div className="text-xs text-[#B0AFAF]">Passes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {event.data.source
                          ? event.data.source.charAt(0).toUpperCase() +
                            event.data.source.slice(1)
                          : "--"}
                      </div>
                      <div className="text-xs text-[#B0AFAF]">Source</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show more/less button */}
        {displayTimeline.length > 5 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setExpanded(!expanded)}
              className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434] hover:border-primary transition-all duration-300"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show More ({displayTimeline.length - 5} more)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceTimeline;
