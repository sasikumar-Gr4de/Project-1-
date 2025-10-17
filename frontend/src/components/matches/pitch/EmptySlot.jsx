import React from "react";
import { motion } from "framer-motion";

const EmptySlot = React.memo(
  ({ position, team, isHome, selectedPlayer, handlePositionSelect }) => {
    const isSelected =
      selectedPlayer &&
      !selectedPlayer.fromBench &&
      selectedPlayer.team === team;

    return (
      <motion.div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-200 cursor-pointer ${
          isSelected
            ? "border-yellow-400 bg-yellow-400/20 scale-110 ring-4 ring-yellow-400/30 z-40"
            : "border-dashed border-white/20 text-white/40 hover:border-white/40 hover:bg-white/5 z-30"
        }`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        onClick={() => handlePositionSelect(position, team)}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isSelected
            ? {
                scale: [1, 1.1, 1],
                backgroundColor: [
                  "rgba(250, 204, 21, 0.2)",
                  "rgba(250, 204, 21, 0.3)",
                  "rgba(250, 204, 21, 0.2)",
                ],
              }
            : {}
        }
        // transition={isSelected ? { duration: 1, repeat: Infinity } : {}}
      >
        <div className="text-center">
          <div className="font-semibold">{position.label}</div>
          <div className="text-[10px] opacity-60">
            {isSelected ? "Click to move" : "Empty"}
          </div>
        </div>
      </motion.div>
    );
  }
);

export default EmptySlot;
