import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Users,
  User,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const RecentPlayers = () => {
  const recentPlayers = [
    {
      id: 1,
      name: "Marcus Johnson",
      age: 17,
      position: "Forward",
      team: "United Academy",
      lastMatch: "2024-01-15",
      overallScore: 87,
      trend: "up",
    },
    {
      id: 2,
      name: "Liam Chen",
      age: 16,
      position: "Midfielder",
      team: "City Youth",
      lastMatch: "2024-01-14",
      overallScore: 92,
      trend: "up",
    },
    {
      id: 3,
      name: "Sarah Williams",
      age: 18,
      position: "Defender",
      team: "Rovers FC",
      lastMatch: "2024-01-13",
      overallScore: 78,
      trend: "down",
    },
    {
      id: 4,
      name: "James Rodriguez",
      age: 17,
      position: "Goalkeeper",
      team: "Athletic Youth",
      lastMatch: "2024-01-12",
      overallScore: 85,
      trend: "up",
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 m-2 text-blue-400" />
            Recent Players
          </CardTitle>
          <CardDescription className="text-gray-400">
            Recently analyzed players and their performance scores
          </CardDescription>
        </div>
        <Link to="/players">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                    {player.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {player.age}y • {player.position} • {player.team}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="text-sm sm:text-lg font-bold text-white">
                      {player.overallScore}
                    </span>
                    {getTrendIcon(player.trend)}
                  </div>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    Overall Score
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPlayers;
