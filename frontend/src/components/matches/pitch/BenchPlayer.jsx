import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Target, ArrowLeftRight } from "lucide-react";

const BenchPlayer = React.memo(
  ({
    player,
    team,
    isHome,
    selectedPlayer,
    swapTarget,
    handlePlayerSelect,
    showTooltip,
    hideTooltip,
    enhancedPlayers,
  }) => {
    const playerStats = enhancedPlayers[team]?.[player.id];
    const isSelected =
      selectedPlayer?.id === player.id && selectedPlayer.team === team;
    const isSwapTarget =
      swapTarget?.player?.id === player.id && swapTarget.team === team;
    const currentStats = player.stats || { goals: 0, assists: 0, minutes: 0 };

    return (
      <motion.div
        className={`flex items-center p-3 rounded-lg m-1 cursor-pointer transition-all duration-200 group border ${
          isSelected
            ? "ring-2 ring-yellow-400 bg-yellow-400/20 scale-105 border-yellow-400/50"
            : isSwapTarget
            ? "ring-2 ring-green-400 bg-green-400/20 scale-105 border-green-400/50"
            : "hover:scale-[1.02] hover:bg-gray-700/50 border-gray-600/50"
        } ${
          isHome ? "bg-blue-900/20" : "bg-red-900/20"
        } backdrop-blur-sm relative`}
        onClick={() => handlePlayerSelect(player, team, true)}
        onMouseEnter={(e) => showTooltip(e, player, team, isHome)}
        onMouseLeave={hideTooltip}
        onMouseMove={(e) => showTooltip(e, player, team, isHome)}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Action Indicators */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Target className="w-3 h-3 text-gray-900" />
            </motion.div>
          )}
          {isSwapTarget && (
            <motion.div
              className="absolute -top-2 -left-2 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <ArrowLeftRight className="w-3 h-3 text-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Number Avatar */}
        <div className="relative">
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative mr-3 shadow-lg ${
              isHome ? "bg-blue-500" : "bg-red-500"
            } border-2 ${isSelected ? "border-yellow-400" : "border-white/20"}`}
            animate={
              isSelected
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <span className="text-white font-bold text-sm">
              {player.number}
            </span>
          </motion.div>
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {player.name}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isHome ? "bg-blue-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {playerStats?.rating}
            </div>
            <div className="text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
              {player.position}
            </div>
            {/* Match Stats */}
            {(currentStats.goals > 0 || currentStats.assists > 0) && (
              <div className="flex space-x-1 text-xs">
                {currentStats.goals > 0 && (
                  <motion.div
                    className="bg-green-500 text-white px-1 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    ⚽{currentStats.goals}
                  </motion.div>
                )}
                {currentStats.assists > 0 && (
                  <motion.div
                    className="bg-blue-500 text-white px-1 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                  >
                    A{currentStats.assists}
                  </motion.div>
                )}
              </div>
            )}
          </div>
          {playerStats?.preferredPositions && (
            <div className="flex space-x-1 mt-1">
              {playerStats.preferredPositions.slice(0, 2).map((pos, index) => (
                <motion.div
                  key={pos}
                  className="text-[10px] bg-gray-600 text-gray-300 px-1 rounded"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {pos}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Shirt
          className={`h-4 w-4 ${isHome ? "text-blue-400" : "text-red-400"}`}
        />
      </motion.div>
    );
  }
);

export default BenchPlayer;
