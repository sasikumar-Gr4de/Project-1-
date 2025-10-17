// components/TopPerformers.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Crown } from "lucide-react";

const TopPerformers = () => {
  const topPlayers = [
    {
      id: 2,
      name: "Liam Chen",
      position: "Midfielder",
      overallScore: 92,
    },
    {
      id: 1,
      name: "Marcus Johnson",
      position: "Forward",
      overallScore: 87,
    },
    {
      id: 4,
      name: "James Rodriguez",
      position: "Goalkeeper",
      overallScore: 85,
    },
  ];

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Crown className="h-5 w-5 mr-2 text-yellow-400" />
          Top Performers
        </CardTitle>
        <CardDescription className="text-gray-400">
          Players with highest overall scores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white text-sm truncate">
                    {player.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {player.position}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {player.overallScore}
                </div>
                <div className="text-xs text-gray-400">Score</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
