import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "@/services/base.api";
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
} from "lucide-react";
import {
  formatDate,
  getScoreColor,
  getPillarColor,
} from "@/utils/helper.utils";

const ReportDetail = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await userAPI.getReport(reportId);
      if (response.success) {
        setReport(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (report?.pdf_url) {
      window.open(report.pdf_url, "_blank");
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

  const { score_json, player_data, created_at } = report;

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
                  score_json.overall_score
                )}`}
              >
                {score_json.overall_score}
              </div>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">
                  +5 from last report
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Scores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(score_json)
          .filter(([key]) =>
            ["technical", "tactical", "physical", "mental"].includes(key)
          )
          .map(([pillar, score]) => (
            <Card key={pillar}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium capitalize flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{pillar}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getPillarColor(pillar)}`}>
                  {score}
                </div>
                <Progress value={score} className="mt-2" />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span>Top Strengths</span>
            </CardTitle>
            <CardDescription>
              Areas where you excel compared to peers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {score_json.strengths?.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Priorities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <span>Development Priorities</span>
            </CardTitle>
            <CardDescription>Areas to focus on for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {score_json.priorities?.map((priority, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">{priority}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Action Plan</CardTitle>
          <CardDescription>
            Personalized training recommendations based on your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Immediate Focus (1-2 weeks)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• High-intensity interval training for stamina</li>
                  <li>
                    • Position-specific drills for{" "}
                    {score_json.priorities?.[0]?.toLowerCase()}
                  </li>
                  <li>• Video analysis of decision-making moments</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  Long-term Development (4-6 weeks)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Strength and conditioning program</li>
                  <li>• Technical skill refinement sessions</li>
                  <li>• Competitive match practice</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Details */}
      {player_data && (
        <Card>
          <CardHeader>
            <CardTitle>Match Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <span className="font-medium">Match Date:</span>
                <p>{formatDate(player_data.match_date)}</p>
              </div>
              <div>
                <span className="font-medium">Video Analysis:</span>
                <p>{player_data.video_file ? "Available" : "Not provided"}</p>
              </div>
              <div>
                <span className="font-medium">GPS Data:</span>
                <p>{player_data.gps_file ? "Available" : "Not provided"}</p>
              </div>
              {player_data.notes && (
                <div className="md:col-span-3">
                  <span className="font-medium">Additional Notes:</span>
                  <p className="text-muted-foreground">{player_data.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportDetail;
