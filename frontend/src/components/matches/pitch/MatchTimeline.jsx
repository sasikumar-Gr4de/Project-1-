import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { animations } from "@/utils/animations";

const MatchTimeline = React.memo(
  ({
    currentTime,
    isPlaying,
    setIsPlaying,
    handleTimeJump,
    formationHistory,
    enhancedPlayers,
  }) => {
    const timelineMarkers = [0, 15, 30, 45, 60, 75, 90];
    const formationTimes = [
      ...new Set(formationHistory.map((item) => item.time)),
    ].sort((a, b) => a - b);

    return (
      <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <motion.div
            className="flex items-center justify-between mb-4"
            {...animations.timeline.slideIn}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeJump(0)}
                  disabled={currentTime === 0}
                  className="h-8 w-8 p-0 text-white"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-8 text-white"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isPlaying ? "pause" : "play"}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span className="ml-2 text-xs">
                        {isPlaying ? "Pause" : "Play"}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeJump(90)}
                  disabled={currentTime === 90}
                  className="h-8 w-8 p-0 text-white"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <motion.div
                className="flex items-center space-x-2 text-white bg-gray-700/50 px-3 py-1 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Clock className="h-4 w-4" />
                <span className="font-bold text-lg">{currentTime}'</span>
                <span className="text-gray-400 text-sm">/ 90'</span>
              </motion.div>
            </div>

            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-2xl font-bold text-white">
                {enhancedPlayers.team_a[1].goals +
                  enhancedPlayers.team_a[7].goals}{" "}
                - {enhancedPlayers.team_b[12].goals}
              </div>
              <div className="text-sm text-gray-400">Final Score</div>
            </motion.div>
          </motion.div>

          {/* Animated Timeline Bar */}
          <div className="relative h-16 bg-gray-700/30 rounded-xl p-3 border border-gray-600/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {/* Progress Background */}
              <motion.div
                className="absolute top-0 bottom-0 bg-blue-500/20 rounded-l-xl timeline-progress"
                initial={{ width: 0 }}
                animate={{ width: `${(currentTime / 90) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Time markers */}
              {timelineMarkers.map((minute) => (
                <motion.div
                  key={minute}
                  className="absolute flex flex-col items-center cursor-pointer"
                  style={{
                    left: `${(minute / 90) * 100}%`,
                    transform: "translate(-50%, 0)",
                  }}
                  onClick={() => handleTimeJump(minute)}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-px h-4 bg-white/30"></div>
                  <motion.span
                    className="text-xs text-white/60 mt-1 hover:text-white transition-colors"
                    whileHover={{ color: "#ffffff" }}
                  >
                    {minute}'
                  </motion.span>
                </motion.div>
              ))}

              {/* Formation change markers */}
              <AnimatePresence>
                {formationTimes.map((time) => (
                  <motion.div
                    key={time}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                    style={{ left: `${(time / 90) * 100}%`, top: "50%" }}
                    onClick={() => handleTimeJump(time)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <motion.div
                      className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg border-2 border-white"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(234, 179, 8, 0.7)",
                          "0 0 0 10px rgba(234, 179, 8, 0)",
                          "0 0 0 0 rgba(234, 179, 8, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Formation saved at {time}'
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Current time indicator */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-blue-400 rounded-full transform -translate-x-1/2 z-20 shadow-lg shadow-blue-400/50"
                style={{ left: `${(currentTime / 90) * 100}%` }}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <motion.div
                  className="absolute -top-2 -left-2 w-5 h-5 bg-blue-400 rounded-full border-2 border-gray-800 shadow-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Formation History */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-sm text-gray-400 mb-2">Formation History</div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {formationTimes.map((time) => (
                  <motion.div
                    key={time}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeJump(time)}
                      className={`text-xs ${
                        currentTime === time
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-700/50 text-gray-300 border-gray-600"
                      }`}
                      // whileHover={{ scale: 1.05 }}
                      // whileTap={{ scale: 0.95 }}
                    >
                      {time}'{time === 0 && " (Start)"}
                      {time === 90 && " (End)"}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }
);

export default MatchTimeline;
