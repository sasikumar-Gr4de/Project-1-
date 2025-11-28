import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Activity } from "lucide-react";

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
          <div className="grid grid-cols-2 gap-5 px-5">
            {displayMetrics.map((metric, index) => (
              <Card
                className="bg-(--surface-0) border-0 "
                key={metric.metric_id}
              >
                <CardHeader className="pb-1">
                  {/* <CardTitle
                    className={`text-base font-bold bg-linear-to-r ${color} bg-clip-text text-transparent`}
                  >
                    {name}
                  </CardTitle> */}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-center items-center">
                    <div className="text-center w-48 h-48 rounded-full p-1 bg-linear-to-b from-primary bg-green-700">
                      <div className="w-full h-full rounded-full bg-(--surface-0) flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold bg-linear-to-r from-primary to-primary-300 text-transparent bg-clip-text font-['Orbitron']">
                          {metric.gr4de_score}
                        </div>
                        <div className="text-xs text-placeholder font-bold mt-1">
                          GR4DE Score
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-placeholder text-sm">
                        {metric.competition} <br />
                        <span className="text-xs">
                          {new Date(metric.date).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="text-placeholder">
                        {tier === "pro" && metric.benchmarks && (
                          <div className="text-right">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {Math.round(
                                metric.benchmarks.percentile_rank || 0
                              )}
                              th Percentile
                            </Badge>
                            <p className="text-placeholder text-xs mt-1">
                              {metric.minutes} mins played
                            </p>
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              // <div
              //   key={metric.metric_id}
              //   className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-border"
              // >
              //   <div className="flex items-center space-x-4">
              //     <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              //       <Award className="w-6 h-6 text-primary" />
              //     </div>
              //     <div>
              //       <div className="flex items-center space-x-2">
              //         <span className="text-white font-bold text-xl">
              //           {metric.gr4de_score}
              //         </span>
              //         <Badge
              //           variant="outline"
              //           className="bg-primary/20 text-primary border-primary/30"
              //         >
              //           GR4DE Score
              //         </Badge>
              //       </div>
              //       <p className="text-placeholder text-sm">
              //         {metric.competition} •{" "}
              //         {new Date(metric.date).toLocaleDateString()}
              //       </p>
              //     </div>
              //   </div>

              //   {tier === "pro" && metric.benchmarks && (
              //     <div className="text-right">
              //       <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              //         {Math.round(metric.benchmarks.percentile_rank || 0)}th
              //         Percentile
              //       </Badge>
              //       <p className="text-placeholder text-sm mt-1">
              //         {metric.minutes} mins played
              //       </p>
              //     </div>
              //   )}
              // </div>
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
            <div className="">
              {tempoData.slice(0, 3).map((tempo, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start justify-center w-full"
                >
                  {/* Bar Label and Value */}
                  <div className="flex justify-between items-center w-full mb-2">
                    <div className="text-placeholder font-bold truncate px-2">
                      Tempo Index
                    </div>
                    <div
                      className={`text-lg text-primary font-bold font-['Orbitron'] `}
                    >
                      {/* Consistency: {tempo.consistency}% */}
                      {tempo.tempo_index}
                    </div>
                  </div>
                  <div className={`w-full h-3 rounded-lg relative flex`}>
                    {/* Rest of the chart (unfilled portion) */}
                    <div
                      className={`w-full h-full bg-placeholder rounded-lg absolute top-0 left-0`}
                    />
                    <div
                      className={`h-full bg-primary rounded-lg transition-all duration-1000 ease-out relative z-10`}
                      style={{
                        width: `${tempo.tempo_index}%`,
                        minWidth: "4px",
                      }}
                    />
                  </div>
                  <div className="text-placeholder font-bold truncate px-2 py-1">
                    Consistency: {tempo.consistency}%
                  </div>
                </div>
                // <div
                //   key={index}
                //   className="text-center p-4 bg-[#1A1A1A] rounded-xl border border-border"
                // >
                //   <div className="text-3xl font-bold text-primary mb-2">
                //     {tempo.tempo_index}
                //   </div>
                //   <p className="text-placeholder text-sm mb-1">Tempo Index</p>
                //   <p className="text-placeholder text-xs">
                //     Consistency: {tempo.consistency}%
                //   </p>
                //   <p className="text-placeholder text-xs mt-2">
                //     {new Date(tempo.date).toLocaleDateString()}
                //   </p>
                // </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceMetrics;
