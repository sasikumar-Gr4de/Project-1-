import React from "react";

const TournamentAvatar = ({
  tournament,
  size = "md",
  showStats = false,
  teamsCount = 0,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-xl",
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorClass = (organizer) => {
    const colors = {
      "premier-league": "bg-purple-500",
      fa: "bg-red-500",
      uefa: "bg-blue-500",
      fifa: "bg-green-500",
      local: "bg-yellow-500",
    };
    return colors[organizer] || "bg-gray-500";
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} ${getColorClass(
          tournament.organizer
        )} rounded-lg flex items-center justify-center text-white font-bold ${
          textSizes[size]
        }`}
      >
        {tournament.logo ? (
          <img
            src={tournament.logo}
            alt={tournament.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          getInitials(tournament.name)
        )}
      </div>
      {showStats && (
        <div className="absolute -bottom-1 -right-1 bg-gray-800 border-2 border-gray-700 rounded-full px-2 py-1 min-w-[24px] text-center">
          <span className="text-xs font-bold text-yellow-400">
            {teamsCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default TournamentAvatar;
