// SkillsBadges.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Star, TrendingUp, Target } from "lucide-react";

const SkillsBadges = ({ skills = [], badges = [], isEditing = false }) => {
  const [newSkill, setNewSkill] = useState("");

  const defaultSkills = [
    { name: "Technical Ability", level: 85, category: "technical" },
    { name: "Tactical Awareness", level: 78, category: "tactical" },
    { name: "Physical Fitness", level: 92, category: "physical" },
    { name: "Mental Strength", level: 81, category: "mental" },
  ];

  const defaultBadges = [
    {
      name: "Top Performer",
      icon: Star,
      color: "text-yellow-400",
      earned: "2024-10-15",
    },
    {
      name: "Most Improved",
      icon: TrendingUp,
      color: "text-green-400",
      earned: "2024-09-20",
    },
    {
      name: "Goal Scorer",
      icon: Target,
      color: "text-red-400",
      earned: "2024-11-05",
    },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;
  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      // Add skill logic here
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillName) => {
    // Remove skill logic here
  };

  const getSkillColor = (level) => {
    if (level >= 90) return "bg-green-500";
    if (level >= 80) return "bg-blue-500";
    if (level >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Skills & Badges</span>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills Section */}
        <div>
          <h4 className="font-semibold text-white mb-4">Player Skills</h4>
          <div className="space-y-4">
            {displaySkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">{skill.name}</span>
                    <span className="text-gray-400 text-sm">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-[#343434] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getSkillColor(
                        skill.level
                      )} transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex space-x-2 mt-4">
              <Input
                placeholder="Add new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
              <Button
                onClick={handleAddSkill}
                className="bg-primary text-[#0F0F0E] hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div>
          <h4 className="font-semibold text-white mb-4">Achievement Badges</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={index}
                  className="bg-[#1A1A1A] border border-[#343434] rounded-lg p-3 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-[#262626] rounded-full flex items-center justify-center">
                      <IconComponent className={`w-6 h-6 ${badge.color}`} />
                    </div>
                  </div>
                  <h5 className="text-white text-sm font-medium mb-1">
                    {badge.name}
                  </h5>
                  <p className="text-gray-400 text-xs">
                    Earned {new Date(badge.earned).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsBadges;
