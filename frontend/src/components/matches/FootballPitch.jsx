import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamAvatar from "@/components/teams/TeamAvatar";
import { Users, Download, RefreshCw } from "lucide-react";

// Import pitch components
import PitchMarkings from "./pitch/PitchMarkings";
import PitchPlayer from "./pitch/PitchPlayer";
import BenchPlayer from "./pitch/BenchPlayer";
import EmptySlot from "./pitch/EmptySlot";
import ActionPanel from "./pitch/ActionPanel";
import FormationSelector from "./pitch/FormationSelector";
import MatchTimeline from "./pitch/MatchTimeline";

// Import hooks
import { usePlayerMovement } from "./pitch/hooks/usePlayerMovement";
import { useTimeline } from "./pitch/hooks/useTimeline";
import { useFormationHistory } from "./pitch/hooks/useFormationHistory";

// Import constants and data
import { FORMATIONS } from "@/utils/constants";
import {
  enhancedPlayers,
  initialLineups,
  initialSubstitutes,
} from "./pitch/utils/playerData";

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

  // Refs
  const tooltipRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Initialize formation history first (it needs currentTime)
  const [formationHistory, setFormationHistory] = useState([]);

  // Initialize match data
  useEffect(() => {
    if (match) {
      setLineups(initialLineups);
      setSubstitutes(initialSubstitutes);

      setFormationHistory([
        {
          time: 0,
          formations: { team_a: "4-3-3", team_b: "4-3-3" },
          lineups: initialLineups,
          substitutes: initialSubstitutes,
        },
      ]);
    }
  }, [match]);

  // Now initialize timeline hook (it needs formationHistory)
  const {
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    handleTimeJump,
  } = useTimeline(formationHistory, setFormations, setLineups, setSubstitutes);

  // Now initialize formation history hook with currentTime
  const { saveFormationSnapshot } = useFormationHistory(
    currentTime,
    formations,
    lineups,
    substitutes,
    setFormationHistory
  );

  // Finally initialize player movement hook
  const { handlePlayerSelect, handlePositionSelect, resetSelection } =
    usePlayerMovement(
      lineups,
      setLineups,
      substitutes,
      setSubstitutes,
      selectedPlayer,
      setSelectedPlayer,
      actionState,
      setActionState,
      swapTarget,
      setSwapTarget,
      enhancedPlayers,
      saveFormationSnapshot,
      onPlayerMove
    );

  // Update player minutes when time changes
  useEffect(() => {
    const updatePlayerMinutes = () => {
      setLineups((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((team) => {
          updated[team] = updated[team].map((player) => ({
            ...player,
            stats: {
              ...player.stats,
              minutes: Math.min(currentTime, 90),
            },
          }));
        });
        return updated;
      });

      setSubstitutes((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((team) => {
          updated[team] = updated[team].map((player) => ({
            ...player,
            stats: {
              ...player.stats,
              minutes: player.stats.minutes,
            },
          }));
        });
        return updated;
      });
    };

    updatePlayerMinutes();
  }, [currentTime]);

  // Tooltip functions
  const showTooltip = (event, player, team, isHome) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    const playerStats = enhancedPlayers[team]?.[player.id];
    if (!playerStats || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    tooltip.innerHTML = createTooltipContent(player, playerStats, isHome);
    tooltip.style.display = "block";

    const rect = event.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.transform = "translate(-50%, -100%)";
  };

  const hideTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    tooltipTimeoutRef.current = setTimeout(() => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = "none";
      }
    }, 100);
  };

  const createTooltipContent = (player, playerStats, isHome) => {
    const currentStats = player.stats || { goals: 0, assists: 0, minutes: 0 };

    return `
      <div class="p-4 rounded-xl border shadow-2xl min-w-64 ${
        isHome
          ? "bg-gradient-to-br from-blue-900 to-blue-800 border-blue-600"
          : "bg-gradient-to-br from-red-900 to-red-800 border-red-600"
      }">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center ${
              isHome ? "bg-blue-500" : "bg-red-500"
            }">
              <span class="text-white font-bold text-lg">${player.number}</span>
            </div>
            <div>
              <h4 class="font-bold text-white text-sm">${player.name}</h4>
              <div class="flex items-center space-x-2 mt-1">
                <div class="text-xs text-gray-300">${player.position}</div>
                <div class="text-xs px-2 py-1 rounded-full ${
                  isHome ? "bg-blue-500" : "bg-red-500"
                } text-white font-bold">
                  ${playerStats.rating}
                </div>
              </div>
            </div>
          </div>
          ${
            player.is_captain
              ? '<div class="h-5 w-5 text-yellow-400">ⓒ</div>'
              : ""
          }
        </div>
        
        <!-- Match Stats -->
        <div class="grid grid-cols-3 gap-2 mb-3">
          <div class="text-center">
            <div class="text-white font-bold text-sm">${
              currentStats.goals
            }</div>
            <div class="text-gray-300 text-xs">Goals</div>
          </div>
          <div class="text-center">
            <div class="text-white font-bold text-sm">${
              currentStats.assists
            }</div>
            <div class="text-gray-300 text-xs">Assists</div>
          </div>
          <div class="text-center">
            <div class="text-white font-bold text-sm">${
              currentStats.minutes
            }'</div>
            <div class="text-gray-300 text-xs">Played</div>
          </div>
        </div>

        <div class="text-xs text-gray-300 mb-2">
          ${
            playerStats.preferredPositions
              ? `Preferred: ${playerStats.preferredPositions.join(", ")}`
              : ""
          }
        </div>
        <div class="text-xs text-yellow-300">
          Click to ${selectedPlayer ? "swap with" : "select"} player
        </div>
      </div>
    `;
  };

  const handleFormationChange = (team, newFormation) => {
    setFormations((prev) => ({ ...prev, [team]: newFormation }));
    onFormationChange?.(team, newFormation);
    saveFormationSnapshot();
  };

  const handleResetFormation = () => {
    // Reset to initial formations
    setLineups(initialLineups);
    setSubstitutes(initialSubstitutes);
    setFormations({ team_a: "4-3-3", team_b: "4-3-3" });
    setCurrentTime(0);
    setIsPlaying(false);
    resetSelection();

    setFormationHistory([
      {
        time: 0,
        formations: { team_a: "4-3-3", team_b: "4-3-3" },
        lineups: initialLineups,
        substitutes: initialSubstitutes,
      },
    ]);
  };

  const cancelAction = () => {
    resetSelection();
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Global Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[100] hidden pointer-events-none"
        style={{ display: "none" }}
      />

      {/* Match Timeline */}
      <MatchTimeline
        currentTime={currentTime}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handleTimeJump={handleTimeJump}
        formationHistory={formationHistory}
        enhancedPlayers={enhancedPlayers}
      />

      {/* Action Panel */}
      <ActionPanel
        selectedPlayer={selectedPlayer}
        actionState={actionState}
        cancelAction={cancelAction}
        enhancedPlayers={enhancedPlayers}
      />

      {/* Controls Header */}
      <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <FormationSelector
                team="team_a"
                teamName={match.team_a_name}
                formations={formations}
                handleFormationChange={handleFormationChange}
              />
              <div className="text-gray-400 font-bold text-lg">VS</div>
              <FormationSelector
                team="team_b"
                teamName={match.team_b_name}
                formations={formations}
                handleFormationChange={handleFormationChange}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                onClick={handleResetFormation}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Team A Section */}
        <div className="xl:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TeamAvatar
                  team={{
                    team_mark: match.team_a_logo,
                    name: match.team_a_name,
                  }}
                  size="sm"
                />
                <span className="ml-3 text-lg font-bold">
                  {match.team_a_name}
                </span>
                <span className="ml-auto px-3 py-1 bg-blue-500 rounded-full text-white text-sm font-bold">
                  {formations.team_a}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-2xl mx-auto"
                style={{
                  height: "500px",
                  width: "100%",
                  maxWidth: "800px",
                  background:
                    "linear-gradient(135deg, #0f3d0f 0%, #1a5c1a 100%)",
                }}
                layout
              >
                <PitchMarkings />

                {/* Players */}
                <AnimatePresence>
                  {FORMATIONS[formations.team_a]?.map((position) => {
                    const player = lineups.team_a?.find(
                      (p) => p.position === position.id
                    );
                    return player ? (
                      <PitchPlayer
                        key={position.id}
                        player={player}
                        position={position}
                        team="team_a"
                        isHome={true}
                        selectedPlayer={selectedPlayer}
                        swapTarget={swapTarget}
                        handlePlayerSelect={handlePlayerSelect}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                        enhancedPlayers={enhancedPlayers}
                      />
                    ) : (
                      <EmptySlot
                        key={position.id}
                        position={position}
                        team="team_a"
                        isHome={true}
                        selectedPlayer={selectedPlayer}
                        handlePositionSelect={handlePositionSelect}
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        {/* Team A Bench */}
        <div className="xl:col-span-1">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Substitutes
                <span className="ml-auto text-blue-400">
                  {substitutes.team_a?.length || 0} players
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence>
                  {substitutes.team_a?.map((player) => (
                    <BenchPlayer
                      key={player.id}
                      player={player}
                      team="team_a"
                      isHome={true}
                      selectedPlayer={selectedPlayer}
                      swapTarget={swapTarget}
                      handlePlayerSelect={handlePlayerSelect}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                      enhancedPlayers={enhancedPlayers}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Team B Section */}
        <div className="xl:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TeamAvatar
                  team={{
                    team_mark: match.team_b_logo,
                    name: match.team_b_name,
                  }}
                  size="sm"
                />
                <span className="ml-3 text-lg font-bold">
                  {match.team_b_name}
                </span>
                <span className="ml-auto px-3 py-1 bg-red-500 rounded-full text-white text-sm font-bold">
                  {formations.team_b}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-2xl mx-auto"
                style={{
                  height: "500px",
                  width: "100%",
                  maxWidth: "800px",
                  background:
                    "linear-gradient(135deg, #0f3d0f 0%, #1a5c1a 100%)",
                }}
                layout
              >
                <PitchMarkings />

                {/* Players */}
                <AnimatePresence>
                  {FORMATIONS[formations.team_b]?.map((position) => {
                    const player = lineups.team_b?.find(
                      (p) => p.position === position.id
                    );
                    return player ? (
                      <PitchPlayer
                        key={position.id}
                        player={player}
                        position={position}
                        team="team_b"
                        isHome={false}
                        selectedPlayer={selectedPlayer}
                        swapTarget={swapTarget}
                        handlePlayerSelect={handlePlayerSelect}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                        enhancedPlayers={enhancedPlayers}
                      />
                    ) : (
                      <EmptySlot
                        key={position.id}
                        position={position}
                        team="team_b"
                        isHome={false}
                        selectedPlayer={selectedPlayer}
                        handlePositionSelect={handlePositionSelect}
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        {/* Team B Bench */}
        <div className="xl:col-span-1">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2 text-red-400" />
                Substitutes
                <span className="ml-auto text-red-400">
                  {substitutes.team_b?.length || 0} players
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence>
                  {substitutes.team_b?.map((player) => (
                    <BenchPlayer
                      key={player.id}
                      player={player}
                      team="team_b"
                      isHome={false}
                      selectedPlayer={selectedPlayer}
                      swapTarget={swapTarget}
                      handlePlayerSelect={handlePlayerSelect}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                      enhancedPlayers={enhancedPlayers}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default FootballPitch;
