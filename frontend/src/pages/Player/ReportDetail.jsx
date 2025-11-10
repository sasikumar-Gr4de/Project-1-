import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Download,
  Calendar,
  Target,
  Award,
  TrendingUp,
  BarChart3,
  FileText,
  Activity,
  Zap,
} from "lucide-react";
import {
  formatDate,
  getScoreColor,
  getPillarColor,
} from "@/utils/helper.utils";
import api from "@/services/base.api";

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { currentReport, fetchReport, isLoading } = useUserStore();
  const [report, setReport] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [reportId]);

  const fetchReportData = async () => {
    try {
      // Fetch report details from new API
      const response = await api.get(`/reports/report/${reportId}`);
      if (response.data.success) {
        setReportData(response.data.data.report);
      }

      // Also try legacy fetch for compatibility
      await fetchReport(reportId);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      // Fallback to legacy method
      try {
        await fetchReport(reportId);
      } catch (legacyError) {
        console.error("Legacy fetch also failed:", legacyError);
      }
    }
  };

  useEffect(() => {
    if (currentReport) {
      setReport(currentReport);
    }
  }, [currentReport]);

  const handleDownload = () => {
    const pdfUrl = reportData?.pdf_url || report?.pdf_url;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Report Details</h1>
            <p className="text-muted-foreground">Loading report data...</p>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested report could not be found.
        </p>
        <Button asChild>
          <a href="/reports">Back to Reports</a>
        </Button>
      </div>
    );
  }

  // Use new report data if available, fallback to legacy
  const displayReport = reportData || report;
  const { summary_json, created_at } = displayReport || {};
  const score_json = summary_json || displayReport?.score_json || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Report</h1>
          <p className="text-muted-foreground">
            Detailed analysis from{" "}
            {player_data?.match_date
              ? formatDate(player_data.match_date)
              : "your match"}
          </p>
        </div>
        <Button onClick={handleDownload} disabled={!report.pdf_url}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="bg-linear-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(created_at)}
              </Badge>
              <h2 className="text-2xl font-bold mb-2">Overall GR4DE Score</h2>
              <p className="text-muted-foreground">
                Comprehensive performance assessment
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-6xl font-bold ${getScoreColor(
                  score_json.gr4de_score || score_json.overall_score
                )}`}
              >
                {score_json.gr4de_score || score_json.overall_score}
              </div>
              <div className="flex items-center space-x-1 mt-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">GR4DE Score</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Scores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(score_json)
          .filter(
            ([key]) =>
              [
                "technical_score",
                "tactical_score",
                "physical_score",
                "mental_score",
              ].includes(key) ||
              ["technical", "tactical", "physical", "mental"].includes(key)
          )
          .map(([pillar, score]) => {
            const pillarName = pillar.replace("_score", "");
            return (
              <Card key={pillar}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{pillarName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-bold ${getPillarColor(
                      pillarName
                    )}`}
                  >
                    {score}
                  </div>
                  <Progress value={score} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {getPillarDescription(pillarName)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Tempo Index */}
      {score_json.tempo_index && (
        <Card className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span>Tempo Index</span>
                </h3>
                <p className="text-muted-foreground">
                  Passing sequence efficiency and tempo control
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-500">
                  {score_json.tempo_index}
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-500">Sequence Rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span>Key Strengths</span>
            </CardTitle>
            <CardDescription>
              Areas where you performed exceptionally well
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {getStrengths(score_json).map((strength, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="font-medium">{strength.title}</span>
                    <p className="text-sm text-muted-foreground">
                      {strength.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Development Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span>Development Areas</span>
            </CardTitle>
            <CardDescription>
              Opportunities for improvement and growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {getDevelopmentAreas(score_json).map((area, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="font-medium">{area.title}</span>
                    <p className="text-sm text-muted-foreground">
                      {area.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Match Context */}
      {player_data && (
        <Card>
          <CardHeader>
            <CardTitle>Match Context</CardTitle>
            <CardDescription>Game details and conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Team Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Position:</span>{" "}
                    {player_data.position || "--"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Minutes:</span>{" "}
                    {player_data.minutes_played || "--"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Distance:</span>{" "}
                    {player_data.total_distance || "--"}m
                  </p>
                  <p>
                    <span className="text-muted-foreground">Sprints:</span>{" "}
                    {player_data.sprints || "--"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Game Conditions</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Competition:</span>{" "}
                    {player_data.competition || "--"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Result:</span>{" "}
                    {player_data.match_result || "--"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Training Recommendations</CardTitle>
          <CardDescription>
            Personalized exercises based on your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecommendations(score_json).map((rec, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-linear-to-r from-primary/5 to-transparent"
              >
                <h4 className="font-medium mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {rec.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{rec.focus}</Badge>
                  <Badge variant="secondary">{rec.duration}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const getPillarDescription = (pillar) => {
  const descriptions = {
    technical: "Ball control, passing, shooting technique",
    tactical: "Positioning, decision-making, game intelligence",
    physical: "Speed, endurance, strength, agility",
    mental: "Focus, resilience, leadership, composure",
  };
  return descriptions[pillar] || "";
};

const getStrengths = (scoreJson) => {
  const strengths = [];
  if (scoreJson.technical >= 80) {
    strengths.push({
      title: "Technical Excellence",
      description: "Superior ball control and execution under pressure",
    });
  }
  if (scoreJson.physical >= 80) {
    strengths.push({
      title: "Physical Dominance",
      description: "Excellent athletic performance and endurance",
    });
  }
  if (scoreJson.mental >= 80) {
    strengths.push({
      title: "Mental Fortitude",
      description: "Strong decision-making and composure in key moments",
    });
  }
  return strengths.length > 0
    ? strengths
    : [
        {
          title: "Solid Foundation",
          description: "Good overall performance with balanced skills",
        },
      ];
};

const getDevelopmentAreas = (scoreJson) => {
  const areas = [];
  if (scoreJson.tactical < 70) {
    areas.push({
      title: "Tactical Awareness",
      description: "Improve positioning and game understanding",
    });
  }
  if (scoreJson.technical < 70) {
    areas.push({
      title: "Technical Consistency",
      description: "Enhance precision in key technical actions",
    });
  }
  return areas.length > 0
    ? areas
    : [
        {
          title: "Fine-Tuning",
          description: "Minor adjustments to elevate elite performance",
        },
      ];
};

const getRecommendations = (scoreJson) => {
  return [
    {
      title: "Position-Specific Drills",
      description:
        "Exercises tailored to your position to enhance tactical awareness",
      focus: "Tactical",
      duration: "30 mins",
    },
    {
      title: "High-Intensity Interval Training",
      description: "Improve explosive power and recovery between sprints",
      focus: "Physical",
      duration: "45 mins",
    },
  ];
};

export default ReportDetail;
