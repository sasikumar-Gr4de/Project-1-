import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Star } from "lucide-react";

const MatchHistory = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No match data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
          Recent Matches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    vs {match.opponent}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-bold ${
                    match.result.startsWith("W")
                      ? "text-green-400"
                      : match.result.startsWith("L")
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {match.result}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>G: {match.goals}</span>
                  <span>A: {match.assists}</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    {match.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchHistory;
