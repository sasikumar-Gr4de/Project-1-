import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar, Activity } from "lucide-react";

const PerformanceMetrics = ({ metrics, tempoData, tier }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-placeholder text-center py-8">
            No performance data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayMetrics = tier === "basic" ? metrics.slice(0, 3) : metrics;

  return (
    <div className="space-y-6">
      {/* GR4DE Scores */}
      <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Award className="w-5 h-5 text-primary" />
            <span>GR4DE Performance Scores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayMetrics.map((metric, index) => (
              <div
                key={metric.metric_id}
                className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-border"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-xl">
                        {metric.gr4de_score}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary/30"
                      >
                        GR4DE Score
                      </Badge>
                    </div>
                    <p className="text-placeholder text-sm">
                      {metric.competition} •{" "}
                      {new Date(metric.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {tier === "pro" && metric.benchmarks && (
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {Math.round(metric.benchmarks.percentile_rank || 0)}th
                      Percentile
                    </Badge>
                    <p className="text-placeholder text-sm mt-1">
                      {metric.minutes} mins played
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tempo Analysis - Pro Tier Only */}
      {tier === "pro" && tempoData && tempoData.length > 0 && (
        <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Activity className="w-5 h-5 text-primary" />
              <span>Tempo Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {tempoData.slice(0, 3).map((tempo, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-[#1A1A1A] rounded-xl border border-border"
                >
                  <div className="text-3xl font-bold text-primary mb-2">
                    {tempo.tempo_index}
                  </div>
                  <p className="text-placeholder text-sm mb-1">Tempo Index</p>
                  <p className="text-placeholder text-xs">
                    Consistency: {tempo.consistency}%
                  </p>
                  <p className="text-placeholder text-xs mt-2">
                    {new Date(tempo.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceMetrics;
