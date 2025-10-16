import React from "react";
import { cn } from "../../lib/utils";
import { Users, Shield } from "lucide-react";

const TeamAvatar = ({
  team,
  size = "default",
  showStats = false,
  playerCount = 0,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const textSizes = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold",
          sizeClasses[size],
          "border-2 border-white/20 shadow-lg"
        )}
      >
        {team.team_mark ? (
          <img
            src={team.team_mark}
            alt={team.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Shield className={cn(size === "sm" ? "h-4 w-4" : "h-6 w-6")} />
        )}
      </div>

      {showStats && (
        <div className="absolute -bottom-1 -right-1 bg-gray-800 border-2 border-white rounded-full px-1.5 py-0.5">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3 text-gray-400" />
            <span className={cn("text-white font-medium", textSizes[size])}>
              {playerCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAvatar;
