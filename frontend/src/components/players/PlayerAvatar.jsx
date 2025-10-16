// components/players/PlayerAvatar.jsx
import React from "react";
import { Users } from "lucide-react";

const PlayerAvatar = ({
  player,
  size = "md",
  showAbility = false,
  abilityScore = 0,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const abilityColors = {
    high: "from-green-500 to-emerald-600",
    medium: "from-yellow-500 to-orange-600",
    low: "from-red-500 to-pink-600",
  };

  const getAbilityColor = (score) => {
    if (score >= 80) return abilityColors.high;
    if (score >= 60) return abilityColors.medium;
    return abilityColors.low;
  };

  return (
    <div className="relative">
      <div
        className={`${
          sizeClasses[size]
        } rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 ${
          showAbility
            ? getAbilityColor(abilityScore)
            : "from-blue-500 to-purple-600"
        }`}
      >
        {player.profile_picture ? (
          <img
            src={player.profile_picture}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Users className="h-1/2 w-1/2 text-white" />
        )}
      </div>

      {showAbility && abilityScore > 0 && (
        <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full border-2 border-gray-700 px-1.5 py-0.5">
          <span className="text-xs font-bold text-white">{abilityScore}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;
