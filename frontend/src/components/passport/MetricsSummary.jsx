// MetricsSummary.jsx - Updated with Upwork-style metrics
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Target, Users, Clock, Edit } from "lucide-react";

const MetricsSummary = ({
  playerId,
  isEditing = false,
  onEditToggle,
  detailed = false,
}) => {
  // Mock data - in real app, this would come from props or API
  const metrics = {
    overallScore: 87,
    lastMatchScore: 92,
    avgScore: 84,
    totalMatches: 47,
    trainingHours: 156,
    goals: 23,
    assists: 18,
    manOfTheMatch: 8,
    consistency: 94,
    improvement: 12,
    benchmarks: {
      speed: 88,
      endurance: 92,
      technique: 85,
      tactical: 79,
    },
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score) => {
    if (score >= 90)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 80) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (score >= 70)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  if (detailed) {
    return (
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Detailed Performance Analytics</span>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={onEditToggle}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Detailed metrics grid */}
            {Object.entries(metrics.benchmarks).map(([key, value]) => (
              <div
                key={key}
                className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]"
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {value}
                </div>
                <div className="text-gray-400 text-sm capitalize">{key}</div>
                <div className="w-full bg-[#343434] rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getScoreColor(value).replace(
                      "text-",
                      "bg-"
                    )}`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Performance Overview</span>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditToggle}
              className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Main Score - Like Upwork's "Job Success Score" */}
          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-gray-400 text-sm">GR4DE Score</span>
            </div>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                metrics.overallScore
              )} mb-1`}
            >
              {metrics.overallScore}
            </div>
            <Badge className={getScoreBadge(metrics.overallScore)}>
              {metrics.overallScore >= 90
                ? "Elite"
                : metrics.overallScore >= 80
                ? "Excellent"
                : "Good"}
            </Badge>
          </div>

          {/* Last Match Performance */}
          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-gray-400 text-sm">Last Match</span>
            </div>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                metrics.lastMatchScore
              )} mb-1`}
            >
              {metrics.lastMatchScore}
            </div>
            <div className="text-green-400 text-sm flex items-center justify-center">
              <TrendingUp className="w-3 h-3 mr-1" />+
              {metrics.lastMatchScore - metrics.avgScore}
            </div>
          </div>

          {/* Total Experience */}
          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-gray-400 text-sm">Matches</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {metrics.totalMatches}
            </div>
            <div className="text-gray-400 text-sm">Total Played</div>
          </div>

          {/* Training Commitment */}
          <div className="text-center p-4 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-gray-400 text-sm">Training</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {metrics.trainingHours}h
            </div>
            <div className="text-gray-400 text-sm">This Season</div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{metrics.goals}</div>
            <div className="text-gray-400 text-sm">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {metrics.assists}
            </div>
            <div className="text-gray-400 text-sm">Assists</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {metrics.manOfTheMatch}
            </div>
            <div className="text-gray-400 text-sm">MOTM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {metrics.consistency}%
            </div>
            <div className="text-gray-400 text-sm">Consistency</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSummary;
