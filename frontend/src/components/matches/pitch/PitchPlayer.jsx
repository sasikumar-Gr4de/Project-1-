import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Target, ArrowLeftRight } from "lucide-react";
import { animations } from "@/utils/animations";

const PitchPlayer = React.memo(
  ({
    player,
    position,
    team,
    isHome = true,
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
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group ${
          isSelected
            ? "scale-110 z-50"
            : isSwapTarget
            ? "scale-105 z-40"
            : "z-30"
        } ${
          isSelected
            ? "ring-4 ring-yellow-400 shadow-2xl"
            : isSwapTarget
            ? "ring-4 ring-green-400 shadow-lg"
            : "hover:scale-105"
        }`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        onClick={() => handlePlayerSelect(player, team, false)}
        onMouseEnter={(e) => showTooltip(e, player, team, isHome)}
        onMouseLeave={hideTooltip}
        onMouseMove={(e) => showTooltip(e, player, team, isHome)}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex flex-col items-center relative">
          {/* Player Avatar with Number */}
          <motion.div
            className={`relative mb-2 transition-all duration-200 ${
              isHome
                ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20"
                : "ring-2 ring-red-400 shadow-lg shadow-red-500/20"
            } rounded-full p-0.5 bg-gradient-to-br from-gray-800 to-gray-900`}
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
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                isHome ? "bg-blue-500" : "bg-red-500"
              }`}
            >
              <span className="text-white font-bold text-lg">
                {player.number}
              </span>

              <AnimatePresence>
                {player.is_captain && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Award className="w-3 h-3 text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Goal indicator */}
              <AnimatePresence>
                {currentStats.goals > 0 && (
                  <motion.div
                    className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <motion.span
                      className="text-white text-xs font-bold"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ⚽
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Indicator */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
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
                  className="absolute -top-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <ArrowLeftRight className="w-3 h-3 text-gray-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Player Info */}
          <motion.div
            className="text-center bg-black/80 rounded-lg p-2 backdrop-blur-sm border border-white/10 min-w-[80px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-xs font-semibold text-white truncate mb-1">
              {player.name}
            </div>
            <div className="flex items-center justify-center space-x-1">
              <div
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isHome ? "bg-blue-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {playerStats?.rating}
              </div>
              <div className="text-xs text-gray-300 bg-gray-700 px-1.5 py-0.5 rounded">
                {player.position}
              </div>
            </div>
            {/* Match Stats */}
            <AnimatePresence>
              {(currentStats.goals > 0 || currentStats.assists > 0) && (
                <motion.div
                  className="flex justify-center space-x-1 mt-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {currentStats.goals > 0 && (
                    <motion.div
                      className="text-[10px] bg-green-500 text-white px-1 rounded"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      ⚽{currentStats.goals}
                    </motion.div>
                  )}
                  {currentStats.assists > 0 && (
                    <motion.div
                      className="text-[10px] bg-blue-500 text-white px-1 rounded"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        delay: 0.1,
                      }}
                    >
                      A{currentStats.assists}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {playerStats?.preferredPositions && (
              <div className="flex justify-center space-x-1 mt-1">
                {playerStats.preferredPositions
                  .slice(0, 2)
                  .map((pos, index) => (
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
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

export default PitchPlayer;
