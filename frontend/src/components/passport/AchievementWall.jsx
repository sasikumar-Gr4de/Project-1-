// AchievementWall.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Target, TrendingUp, Users, Clock } from "lucide-react";

const AchievementWall = ({ achievements = [], stats = {} }) => {
  const defaultStats = {
    totalMatches: 47,
    goals: 23,
    assists: 18,
    manOfTheMatch: 8,
    avgRating: 4.7,
    trainingHours: 156,
  };

  const defaultAchievements = [
    {
      title: "Top Scorer",
      description: "Finished as top scorer in league",
      icon: Trophy,
      date: "2024-11-15",
      type: "gold",
    },
    {
      title: "Perfect Attendance",
      description: "Completed all training sessions this month",
      icon: Award,
      date: "2024-10-31",
      type: "silver",
    },
    {
      title: "Fitness Milestone",
      description: "Reached 95% fitness score for 4 consecutive weeks",
      icon: Target,
      date: "2024-10-20",
      type: "bronze",
    },
  ];

  const displayStats = { ...defaultStats, ...stats };
  const displayAchievements =
    achievements.length > 0 ? achievements : defaultAchievements;

  const getAchievementColor = (type) => {
    switch (type) {
      case "gold":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "silver":
        return "bg-gray-400/20 text-gray-300 border-gray-400/30";
      case "bronze":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Achievement Wall
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-white">
              {displayStats.totalMatches}
            </div>
            <div className="text-gray-400 text-sm">Matches</div>
          </div>
          <div className="text-center p-3 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-white">
              {displayStats.goals}
            </div>
            <div className="text-gray-400 text-sm">Goals</div>
          </div>
          <div className="text-center p-3 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-white">
              {displayStats.assists}
            </div>
            <div className="text-gray-400 text-sm">Assists</div>
          </div>
          <div className="text-center p-3 bg-[#1A1A1A] rounded-lg border border-[#343434]">
            <div className="text-2xl font-bold text-white">
              {displayStats.avgRating}
            </div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="font-semibold text-white mb-3">Recent Achievements</h4>
          <div className="space-y-3">
            {displayAchievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-[#1A1A1A] rounded-lg border border-[#343434]"
                >
                  <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="text-white text-sm font-medium">
                        {achievement.title}
                      </h5>
                      <Badge
                        className={`text-xs ${getAchievementColor(
                          achievement.type
                        )}`}
                      >
                        {achievement.type}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {achievement.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementWall;
