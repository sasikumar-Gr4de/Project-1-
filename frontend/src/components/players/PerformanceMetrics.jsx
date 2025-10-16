import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Target, Crosshair, Zap, Brain, Heart } from "lucide-react";

const PerformanceMetrics = ({ player }) => {
  const metrics = [
    {
      icon: Target,
      label: "Shooting Accuracy",
      value: player.stats?.shots_on_target || 0,
      max: 100,
      color: "text-red-400",
    },
    {
      icon: Crosshair,
      label: "Pass Completion",
      value: player.stats?.passes_completed || 0,
      max: 100,
      color: "text-blue-400",
    },
    {
      icon: Zap,
      label: "Tackle Success",
      value: player.stats?.tackle_success || 0,
      max: 100,
      color: "text-green-400",
    },
    {
      icon: Brain,
      label: "Decision Making",
      value: 78,
      max: 100,
      color: "text-purple-400",
    },
    {
      icon: Heart,
      label: "Stamina",
      value: 85,
      max: 100,
      color: "text-yellow-400",
    },
  ];

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-400" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const percentage = (metric.value / metric.max) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-sm text-gray-300">
                      {metric.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: metric.color
                        .replace("text-", "bg-")
                        .split("-")[1],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
