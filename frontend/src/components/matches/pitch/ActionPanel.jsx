import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Button } from "@/components/ui/card";
import { X } from "lucide-react";

const ActionPanel = ({
  selectedPlayer,
  actionState,
  cancelAction,
  enhancedPlayers,
}) => {
  if (!selectedPlayer) return null;

  const playerStats = enhancedPlayers[selectedPlayer.team]?.[selectedPlayer.id];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-600/50 mb-4">
          <CardContent className="p-4">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPlayer.team === "team_a"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                >
                  <span className="text-white font-bold text-lg">
                    {selectedPlayer.number}
                  </span>
                </motion.div>
                <div>
                  <motion.div
                    className="text-white font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedPlayer.name}
                  </motion.div>
                  <motion.div
                    className="text-yellow-300 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {actionState === "swapping"
                      ? "Select target player to swap with"
                      : selectedPlayer.fromBench
                      ? "Click on empty position to place player"
                      : "Click on position or player to move/swap"}
                  </motion.div>
                </div>
              </div>
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {actionState === "swapping" && (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600/20"
                    onClick={cancelAction}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Swap
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={cancelAction}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActionPanel;
