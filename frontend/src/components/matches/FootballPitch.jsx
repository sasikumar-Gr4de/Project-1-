import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamAvatar from "@/components/teams/TeamAvatar";
import { Users, Download, RefreshCw } from "lucide-react";

// Import reusable components
import PitchMarkings from "./pitch/PitchMarkings";
import PitchPlayer from "./PitchPlayer";
import BenchPlayer from "./BenchPlayer";
import EmptySlot from "./EmptySlot";
import ActionPanel from "./ActionPanel";
import FormationSelector from "./FormationSelector";
import MatchTimeline from "./MatchTimeline";
import TooltipManager from "./TooltipManager";

// Import hooks
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useTimeline } from "./hooks/useTimeline";
import { useFormationHistory } from "./hooks/useFormationHistory";

// Import constants and data
import { FORMATIONS } from "@/utils/constants";
import {
  enhancedPlayers,
  initialLineups,
  initialSubstitutes,
} from "./utils/playerData";

const FootballPitch = ({
  match,
  formation: initialFormation,
  onFormationChange,
  onPlayerMove,
}) => {
  // State management
  const [formations, setFormations] = useState({
    team_a: initialFormation?.team_a || "4-3-3",
    team_b: initialFormation?.team_b || "4-3-3",
  });

  const [lineups, setLineups] = useState({ team_a: [], team_b: [] });
  const [substitutes, setSubstitutes] = useState({ team_a: [], team_b: [] });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actionState, setActionState] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);

  // Custom hooks
  const { currentTime, isPlaying, setIsPlaying, handleTimeJump } = useTimeline(
    formationHistory,
    setFormations,
    setLineups,
    setSubstitutes
  );

  const { formationHistory, saveFormationSnapshot } = useFormationHistory(
    currentTime,
    formations,
    lineups,
    substitutes
  );

  const {
    handleMoveToPosition,
    handlePitchToBenchSwap,
    handleBenchToPitchSwap,
    handleSwapComplete,
  } = usePlayerMovement(
    lineups,
    substitutes,
    selectedPlayer,
    actionState,
    swapTarget,
    enhancedPlayers,
    saveFormationSnapshot,
    resetSelection,
    onPlayerMove
  );

  // Initialize match data
  useEffect(() => {
    if (match) {
      setLineups(initialLineups);
      setSubstitutes(initialSubstitutes);
      // Initialize formation history...
    }
  }, [match]);

  // Reset selection function
  const resetSelection = useCallback(() => {
    setSelectedPlayer(null);
    setActionState(null);
    setSwapTarget(null);
  }, []);

  // Handle formation change
  const handleFormationChange = useCallback(
    (team, newFormation) => {
      setFormations((prev) => ({ ...prev, [team]: newFormation }));
      onFormationChange?.(team, newFormation);
      saveFormationSnapshot();
    },
    [onFormationChange, saveFormationSnapshot]
  );

  // Main render
  return (
    <div className="space-y-6">
      <TooltipManager />

      <MatchTimeline
        currentTime={currentTime}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handleTimeJump={handleTimeJump}
        formationHistory={formationHistory}
        enhancedPlayers={enhancedPlayers}
      />

      <ActionPanel
        selectedPlayer={selectedPlayer}
        actionState={actionState}
        cancelAction={resetSelection}
        enhancedPlayers={enhancedPlayers}
      />

      {/* Controls and Pitch Layout */}
      {/* ... rest of the layout using the new components */}
    </div>
  );
};

export default FootballPitch;
