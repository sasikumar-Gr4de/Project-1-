// components/QuickActions.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Upload, FileText, Users, BarChart3, Zap } from "lucide-react";

const QuickActions = () => {
  const quickActions = [
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload Match Data",
      description: "Add new match video or event data",
      link: "/upload",
      color: "blue",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Generate Report",
      description: "Create new player performance report",
      link: "/reports/generate",
      color: "green",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Manage Players",
      description: "View and edit player profiles",
      link: "/players",
      color: "purple",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "View Analytics",
      description: "Deep dive into performance metrics",
      link: "/analytics",
      color: "yellow",
    },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400",
      green: "bg-green-500/20 text-green-400",
      purple: "bg-purple-500/20 text-purple-400",
      yellow: "bg-yellow-500/20 text-yellow-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          Quick Actions
        </CardTitle>
        <CardDescription className="text-gray-400">
          Frequently used tasks and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="p-3 sm:p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors group"
            >
              <div
                className={`p-2 rounded-lg ${getColorClass(
                  action.color
                )} w-fit mb-2`}
              >
                {action.icon}
              </div>
              <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                {action.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
