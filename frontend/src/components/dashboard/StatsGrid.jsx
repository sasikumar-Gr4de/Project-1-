import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Users, PlayCircle, FileText, Target, TrendingUp } from "lucide-react";

const StatsGrid = ({ stats }) => {
  const statItems = [
    {
      key: "totalPlayers",
      label: "Total Players",
      value: stats.totalPlayers,
      icon: Users,
      color: "blue",
      trend: "+12% from last month",
    },
    {
      key: "matchesProcessed",
      label: "Matches Processed",
      value: stats.matchesProcessed,
      icon: PlayCircle,
      color: "green",
      trend: "+8% from last month",
    },
    {
      key: "reportsGenerated",
      label: "Reports Generated",
      value: stats.reportsGenerated,
      icon: FileText,
      color: "purple",
      trend: "+15% from last month",
    },
    {
      key: "accuracyRate",
      label: "Accuracy Rate",
      value: `${stats.accuracyRate}%`,
      icon: Target,
      color: "yellow",
      trend: "+2.1% improvement",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400",
      green: "bg-green-500/20 text-green-400",
      purple: "bg-purple-500/20 text-purple-400",
      yellow: "bg-yellow-500/20 text-yellow-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.key}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-400 truncate">
                    {item.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-lg ${getColorClasses(
                    item.color
                  )}`}
                >
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>{item.trend}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
