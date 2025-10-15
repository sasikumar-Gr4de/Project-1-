import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

const PerformanceMetrics = () => {
  const performanceMetrics = [
    { name: "Passing Accuracy", value: 87, percentile: 92, trend: 2.1 },
    { name: "Defensive Actions", value: 73, percentile: 78, trend: -1.2 },
    { name: "Shot Efficiency", value: 91, percentile: 95, trend: 3.4 },
    { name: "Aerial Duels", value: 68, percentile: 65, trend: 0.8 },
    { name: "Progressive Runs", value: 82, percentile: 88, trend: 4.2 },
  ];

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-400";
    if (trend < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Key Metrics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Average performance across all players
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300 truncate">
                    {metric.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {metric.percentile}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
              <div
                className={`flex items-center ml-3 ${getTrendColor(
                  metric.trend
                )}`}
              >
                {getTrendIcon(metric.trend)}
                <span className="text-xs ml-1">
                  {metric.trend > 0 ? "+" : ""}
                  {metric.trend}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
