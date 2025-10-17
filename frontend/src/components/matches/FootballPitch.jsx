import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Download,
  RefreshCw,
  Star,
  Award,
  Shirt,
  Target,
  ArrowLeftRight,
  X,
  Check,
} from "lucide-react";
import TeamAvatar from "@/components/teams/TeamAvatar";

const FootballPitch = ({
  match,
  formation: initialFormation,
  onFormationChange,
  onPlayerMove,
}) => {
  const [formations, setFormations] = useState({
    team_a: initialFormation?.team_a || "4-3-3",
    team_b: initialFormation?.team_b || "4-3-3",
  });
  const [lineups, setLineups] = useState({ team_a: [], team_b: [] });
  const [substitutes, setSubstitutes] = useState({ team_a: [], team_b: [] });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actionState, setActionState] = useState(null); // 'selecting', 'moving', 'swapping'
  const [swapTarget, setSwapTarget] = useState(null);

  // Use ref for tooltip to avoid re-renders
  const tooltipRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Formation configurations
  const FORMATIONS = {
    "4-3-3": [
      { id: "GK", x: 50, y: 92, label: "GK" },
      { id: "RB", x: 82, y: 75, label: "RB" },
      { id: "RCB", x: 65, y: 78, label: "RCB" },
      { id: "LCB", x: 35, y: 78, label: "LCB" },
      { id: "LB", x: 18, y: 75, label: "LB" },
      { id: "RCM", x: 72, y: 55, label: "RCM" },
      { id: "CM", x: 50, y: 58, label: "CM" },
      { id: "LCM", x: 28, y: 55, label: "LCM" },
      { id: "RW", x: 78, y: 30, label: "RW" },
      { id: "ST", x: 50, y: 25, label: "ST" },
      { id: "LW", x: 22, y: 30, label: "LW" },
    ],
    "4-4-2": [
      { id: "GK", x: 50, y: 92, label: "GK" },
      { id: "RB", x: 82, y: 75, label: "RB" },
      { id: "RCB", x: 65, y: 78, label: "RCB" },
      { id: "LCB", x: 35, y: 78, label: "LCB" },
      { id: "LB", x: 18, y: 75, label: "LB" },
      { id: "RM", x: 78, y: 55, label: "RM" },
      { id: "RCM", x: 62, y: 58, label: "RCM" },
      { id: "LCM", x: 38, y: 58, label: "LCM" },
      { id: "LM", x: 22, y: 55, label: "LM" },
      { id: "RST", x: 62, y: 30, label: "RST" },
      { id: "LST", x: 38, y: 30, label: "LST" },
    ],
    "4-2-3-1": [
      { id: "GK", x: 50, y: 92, label: "GK" },
      { id: "RB", x: 82, y: 75, label: "RB" },
      { id: "RCB", x: 65, y: 78, label: "RCB" },
      { id: "LCB", x: 35, y: 78, label: "LCB" },
      { id: "LB", x: 18, y: 75, label: "LB" },
      { id: "RDMF", x: 60, y: 62, label: "RDMF" },
      { id: "LDMF", x: 40, y: 62, label: "LDMF" },
      { id: "RW", x: 75, y: 45, label: "RW" },
      { id: "CAM", x: 50, y: 48, label: "CAM" },
      { id: "LW", x: 25, y: 45, label: "LW" },
      { id: "ST", x: 50, y: 30, label: "ST" },
    ],
  };

  // Enhanced player data - ALL players start in substitutes
  const enhancedPlayers = {
    team_a: {
      1: {
        name: "Harry Kane",
        rating: 8.2,
        position: "ST",
        preferredPositions: ["ST", "CF"],
        age: 24,
        nationality: "English",
        value: "€45M",
        goals: 15,
        assists: 7,
        speed: 84,
        shooting: 89,
        passing: 82,
        dribbling: 81,
        defense: 45,
        physical: 83,
      },
      2: {
        name: "Kevin De Bruyne",
        rating: 8.0,
        position: "CAM",
        preferredPositions: ["CAM", "CM", "RW"],
        age: 23,
        nationality: "Belgian",
        value: "€40M",
        goals: 12,
        assists: 10,
        speed: 76,
        shooting: 86,
        passing: 93,
        dribbling: 87,
        defense: 64,
        physical: 78,
      },
      3: {
        name: "Virgil van Dijk",
        rating: 7.9,
        position: "CB",
        preferredPositions: ["CB"],
        age: 28,
        nationality: "Dutch",
        value: "€35M",
        goals: 2,
        assists: 1,
        speed: 78,
        shooting: 60,
        passing: 75,
        dribbling: 72,
        defense: 89,
        physical: 86,
      },
      4: {
        name: "Alisson Becker",
        rating: 7.8,
        position: "GK",
        preferredPositions: ["GK"],
        age: 26,
        nationality: "Brazilian",
        value: "€32M",
        goals: 0,
        assists: 0,
        speed: 65,
        shooting: 40,
        passing: 75,
        dribbling: 55,
        defense: 88,
        physical: 82,
      },
      5: {
        name: "Trent Alexander",
        rating: 7.7,
        position: "RB",
        preferredPositions: ["RB", "RWB"],
        age: 22,
        nationality: "English",
        value: "€38M",
        goals: 3,
        assists: 12,
        speed: 82,
        shooting: 75,
        passing: 86,
        dribbling: 80,
        defense: 78,
        physical: 75,
      },
      6: {
        name: "Rodri",
        rating: 7.8,
        position: "CDM",
        preferredPositions: ["CDM", "CM"],
        age: 26,
        nationality: "Spanish",
        value: "€32M",
        goals: 3,
        assists: 8,
        speed: 65,
        shooting: 72,
        passing: 86,
        dribbling: 78,
        defense: 85,
        physical: 88,
      },
      7: {
        name: "Son Heung-min",
        rating: 7.9,
        position: "LW",
        preferredPositions: ["LW", "RW", "ST"],
        age: 25,
        nationality: "Korean",
        value: "€36M",
        goals: 14,
        assists: 8,
        speed: 89,
        shooting: 85,
        passing: 78,
        dribbling: 86,
        defense: 45,
        physical: 72,
      },
      8: {
        name: "Joshua Kimmich",
        rating: 7.7,
        position: "CM",
        preferredPositions: ["CM", "CDM", "RB"],
        age: 27,
        nationality: "German",
        value: "€34M",
        goals: 4,
        assists: 9,
        speed: 74,
        shooting: 75,
        passing: 87,
        dribbling: 80,
        defense: 82,
        physical: 78,
      },
      9: {
        name: "Ruben Dias",
        rating: 7.6,
        position: "CB",
        preferredPositions: ["CB"],
        age: 25,
        nationality: "Portuguese",
        value: "€30M",
        goals: 1,
        assists: 1,
        speed: 72,
        shooting: 55,
        passing: 70,
        dribbling: 68,
        defense: 87,
        physical: 84,
      },
      10: {
        name: "Ederson",
        rating: 7.5,
        position: "GK",
        preferredPositions: ["GK"],
        age: 28,
        nationality: "Brazilian",
        value: "€28M",
        goals: 0,
        assists: 1,
        speed: 68,
        shooting: 45,
        passing: 82,
        dribbling: 60,
        defense: 85,
        physical: 80,
      },
      11: {
        name: "Phil Foden",
        rating: 7.8,
        position: "RW",
        preferredPositions: ["RW", "CAM", "LW"],
        age: 21,
        nationality: "English",
        value: "€42M",
        goals: 11,
        assists: 7,
        speed: 82,
        shooting: 80,
        passing: 84,
        dribbling: 88,
        defense: 52,
        physical: 68,
      },
    },
    team_b: {
      12: {
        name: "Kylian Mbappé",
        rating: 8.3,
        position: "ST",
        preferredPositions: ["ST", "LW"],
        age: 22,
        nationality: "French",
        value: "€50M",
        goals: 18,
        assists: 6,
        speed: 96,
        shooting: 88,
        passing: 80,
        dribbling: 91,
        defense: 38,
        physical: 76,
      },
      13: {
        name: "Erling Haaland",
        rating: 8.1,
        position: "ST",
        preferredPositions: ["ST"],
        age: 21,
        nationality: "Norwegian",
        value: "€48M",
        goals: 16,
        assists: 4,
        speed: 89,
        shooting: 91,
        passing: 70,
        dribbling: 78,
        defense: 45,
        physical: 88,
      },
      14: {
        name: "Lionel Messi",
        rating: 8.0,
        position: "RW",
        preferredPositions: ["RW", "CAM", "ST"],
        age: 34,
        nationality: "Argentinian",
        value: "€35M",
        goals: 11,
        assists: 14,
        speed: 80,
        shooting: 88,
        passing: 91,
        dribbling: 93,
        defense: 38,
        physical: 65,
      },
      15: {
        name: "N'Golo Kanté",
        rating: 7.8,
        position: "CDM",
        preferredPositions: ["CDM", "CM"],
        age: 30,
        nationality: "French",
        value: "€28M",
        goals: 2,
        assists: 4,
        speed: 82,
        shooting: 65,
        passing: 78,
        dribbling: 75,
        defense: 87,
        physical: 85,
      },
      16: {
        name: "Marquinhos",
        rating: 7.7,
        position: "CB",
        preferredPositions: ["CB"],
        age: 27,
        nationality: "Brazilian",
        value: "€32M",
        goals: 1,
        assists: 2,
        speed: 76,
        shooting: 58,
        passing: 74,
        dribbling: 70,
        defense: 86,
        physical: 82,
      },
      17: {
        name: "Manuel Neuer",
        rating: 7.6,
        position: "GK",
        preferredPositions: ["GK"],
        age: 35,
        nationality: "German",
        value: "€25M",
        goals: 0,
        assists: 0,
        speed: 62,
        shooting: 42,
        passing: 78,
        dribbling: 62,
        defense: 86,
        physical: 78,
      },
      18: {
        name: "Achraf Hakimi",
        rating: 7.7,
        position: "RB",
        preferredPositions: ["RB", "RWB"],
        age: 23,
        nationality: "Moroccan",
        value: "€36M",
        goals: 2,
        assists: 6,
        speed: 90,
        shooting: 72,
        passing: 76,
        dribbling: 82,
        defense: 78,
        physical: 80,
      },
      19: {
        name: "Federico Valverde",
        rating: 7.6,
        position: "CM",
        preferredPositions: ["CM", "RM", "CDM"],
        age: 23,
        nationality: "Uruguayan",
        value: "€34M",
        goals: 5,
        assists: 7,
        speed: 84,
        shooting: 78,
        passing: 80,
        dribbling: 79,
        defense: 75,
        physical: 82,
      },
      20: {
        name: "Theo Hernandez",
        rating: 7.5,
        position: "LB",
        preferredPositions: ["LB", "LWB"],
        age: 24,
        nationality: "French",
        value: "€32M",
        goals: 3,
        assists: 5,
        speed: 88,
        shooting: 74,
        passing: 72,
        dribbling: 80,
        defense: 76,
        physical: 78,
      },
      21: {
        name: "Jan Oblak",
        rating: 7.4,
        position: "GK",
        preferredPositions: ["GK"],
        age: 28,
        nationality: "Slovenian",
        value: "€26M",
        goals: 0,
        assists: 0,
        speed: 60,
        shooting: 38,
        passing: 70,
        dribbling: 58,
        defense: 84,
        physical: 76,
      },
      22: {
        name: "Luis Diaz",
        rating: 7.7,
        position: "LW",
        preferredPositions: ["LW", "RW"],
        age: 25,
        nationality: "Colombian",
        value: "€33M",
        goals: 9,
        assists: 6,
        speed: 87,
        shooting: 78,
        passing: 74,
        dribbling: 85,
        defense: 48,
        physical: 72,
      },
    },
  };

  useEffect(() => {
    if (match) {
      // Start with all players in substitutes
      const allPlayers = {
        team_a: Object.keys(enhancedPlayers.team_a).map((id) => ({
          id: parseInt(id),
          name: enhancedPlayers.team_a[id].name,
          position: enhancedPlayers.team_a[id].position,
          number: parseInt(id),
          is_captain: parseInt(id) === 1,
        })),
        team_b: Object.keys(enhancedPlayers.team_b).map((id) => ({
          id: parseInt(id),
          name: enhancedPlayers.team_b[id].name,
          position: enhancedPlayers.team_b[id].position,
          number: parseInt(id),
          is_captain: parseInt(id) === 12,
        })),
      };

      setSubstitutes(allPlayers);
      setLineups({ team_a: [], team_b: [] });
    }
  }, [match]);

  // Click-based system handlers
  const handlePlayerSelect = useCallback(
    (player, team, fromBench = false) => {
      if (actionState === "swapping" && swapTarget) {
        // Complete swap
        handleSwapComplete(player, team, fromBench);
        return;
      }

      if (
        selectedPlayer &&
        selectedPlayer.id === player.id &&
        selectedPlayer.team === team
      ) {
        // Deselect if same player clicked again
        setSelectedPlayer(null);
        setActionState(null);
      } else if (selectedPlayer) {
        // Already have a selected player - initiate swap or move
        if (fromBench && !selectedPlayer.fromBench) {
          // Move from pitch to bench
          handleMovePlayer(selectedPlayer, player, team, true);
        } else if (!fromBench && selectedPlayer.fromBench) {
          // Move from bench to pitch
          handleMoveToPosition(selectedPlayer, player.position, team);
        } else if (!fromBench && !selectedPlayer.fromBench) {
          // Pitch player to pitch position - initiate swap
          setSwapTarget({ player, team, position: player.position });
          setActionState("swapping");
        }
      } else {
        // Select new player
        setSelectedPlayer({ ...player, team, fromBench });
        setActionState("selecting");
      }
    },
    [selectedPlayer, actionState, swapTarget]
  );

  const handlePositionSelect = useCallback(
    (position, team) => {
      if (!selectedPlayer) return;

      if (actionState === "swapping" && swapTarget) {
        // Cancel swap and move to empty position
        handleMoveToPosition(selectedPlayer, position.id, team);
        setSwapTarget(null);
        setActionState(null);
        return;
      }

      if (selectedPlayer.fromBench) {
        // Move from bench to empty position
        handleMoveToPosition(selectedPlayer, position.id, team);
      } else {
        // Move pitch player to empty position
        handleMoveToPosition(selectedPlayer, position.id, selectedPlayer.team);
      }
    },
    [selectedPlayer, actionState, swapTarget]
  );

  const handleMoveToPosition = useCallback(
    (player, positionId, team) => {
      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      // Remove from current position
      if (player.fromBench) {
        updatedSubstitutes[player.team] = updatedSubstitutes[
          player.team
        ].filter((p) => p.id !== player.id);
      } else {
        updatedLineups[player.team] = updatedLineups[player.team].filter(
          (p) => p.id !== player.id
        );
      }

      // Add to new position
      updatedLineups[team] = [
        ...updatedLineups[team].filter((p) => p.position !== positionId),
        { ...player, position: positionId, fromBench: false },
      ];

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);
      onPlayerMove?.(player.id, player.position, positionId);

      resetSelection();
    },
    [lineups, substitutes, onPlayerMove]
  );

  const handleSwapComplete = useCallback(
    (targetPlayer, team, fromBench) => {
      if (!selectedPlayer || !swapTarget) return;

      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      // Remove both players from current positions
      if (selectedPlayer.fromBench) {
        updatedSubstitutes[selectedPlayer.team] = updatedSubstitutes[
          selectedPlayer.team
        ].filter((p) => p.id !== selectedPlayer.id);
      } else {
        updatedLineups[selectedPlayer.team] = updatedLineups[
          selectedPlayer.team
        ].filter((p) => p.id !== selectedPlayer.id);
      }

      if (fromBench) {
        updatedSubstitutes[team] = updatedSubstitutes[team].filter(
          (p) => p.id !== targetPlayer.id
        );
      } else {
        updatedLineups[team] = updatedLineups[team].filter(
          (p) => p.id !== targetPlayer.id
        );
      }

      // Swap positions
      updatedLineups[selectedPlayer.team] = [
        ...updatedLineups[selectedPlayer.team].filter(
          (p) => p.position !== swapTarget.position
        ),
        { ...targetPlayer, position: swapTarget.position, fromBench: false },
      ];

      updatedLineups[team] = [
        ...updatedLineups[team].filter(
          (p) => p.position !== targetPlayer.position
        ),
        {
          ...selectedPlayer,
          position: targetPlayer.position,
          fromBench: false,
        },
      ];

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);
      resetSelection();
    },
    [selectedPlayer, swapTarget, lineups, substitutes]
  );

  const handleMovePlayer = useCallback(
    (fromPlayer, toPlayer, team, toBench = false) => {
      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      // Remove from player from current position
      if (fromPlayer.fromBench) {
        updatedSubstitutes[fromPlayer.team] = updatedSubstitutes[
          fromPlayer.team
        ].filter((p) => p.id !== fromPlayer.id);
      } else {
        updatedLineups[fromPlayer.team] = updatedLineups[
          fromPlayer.team
        ].filter((p) => p.id !== fromPlayer.id);
      }

      if (toBench) {
        // Move to bench
        updatedSubstitutes[team] = [
          ...updatedSubstitutes[team].filter((p) => p.id !== fromPlayer.id),
          { ...fromPlayer, fromBench: true },
        ];

        // Move target player to fromPlayer's position if it was on pitch
        if (!toPlayer.fromBench) {
          updatedLineups[team] = [
            ...updatedLineups[team].filter((p) => p.id !== toPlayer.id),
            { ...toPlayer, position: fromPlayer.position },
          ];
        }
      }

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);
      resetSelection();
    },
    [lineups, substitutes]
  );

  const resetSelection = useCallback(() => {
    setSelectedPlayer(null);
    setActionState(null);
    setSwapTarget(null);
  }, []);

  const cancelAction = useCallback(() => {
    resetSelection();
  }, []);

  const handleFormationChange = useCallback(
    (team, newFormation) => {
      setFormations((prev) => ({ ...prev, [team]: newFormation }));
      onFormationChange?.(team, newFormation);
    },
    [onFormationChange]
  );

  const handleResetFormation = useCallback(() => {
    const allPlayers = {
      team_a: Object.keys(enhancedPlayers.team_a).map((id) => ({
        id: parseInt(id),
        name: enhancedPlayers.team_a[id].name,
        position: enhancedPlayers.team_a[id].position,
        number: parseInt(id),
        is_captain: parseInt(id) === 1,
      })),
      team_b: Object.keys(enhancedPlayers.team_b).map((id) => ({
        id: parseInt(id),
        name: enhancedPlayers.team_b[id].name,
        position: enhancedPlayers.team_b[id].position,
        number: parseInt(id),
        is_captain: parseInt(id) === 12,
      })),
    };

    setSubstitutes(allPlayers);
    setLineups({ team_a: [], team_b: [] });
    setFormations({ team_a: "4-3-3", team_b: "4-3-3" });
    resetSelection();
  }, []);

  // Tooltip management without state changes
  const showTooltip = useCallback((event, player, team, isHome) => {
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
  }, []);

  const hideTooltip = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    tooltipTimeoutRef.current = setTimeout(() => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = "none";
      }
    }, 100);
  }, []);

  const createTooltipContent = (player, playerStats, isHome) => {
    return `
      <div class="p-4 rounded-xl border shadow-2xl min-w-64 ${
        isHome
          ? "bg-gradient-to-br from-blue-900 to-blue-800 border-blue-600"
          : "bg-gradient-to-br from-red-900 to-red-800 border-red-600"
      }">
        <!-- Tooltip content same as before -->
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
        <div class="text-xs text-gray-300 mb-2">
          Click to ${selectedPlayer ? "swap with" : "select"} player
        </div>
      </div>
    `;
  };

  // Pitch Player Component
  const PitchPlayer = React.memo(
    ({ player, position, team, isHome = true }) => {
      const playerStats = enhancedPlayers[team]?.[player.id];
      const isSelected =
        selectedPlayer?.id === player.id && selectedPlayer.team === team;
      const isSwapTarget =
        swapTarget?.player?.id === player.id && swapTarget.team === team;

      return (
        <div
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group ${
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
        >
          <div className="flex flex-col items-center relative">
            {/* Player Avatar with Number */}
            <div
              className={`relative mb-2 transition-all duration-200 ${
                isHome
                  ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20"
                  : "ring-2 ring-red-400 shadow-lg shadow-red-500/20"
              } rounded-full p-0.5 bg-gradient-to-br from-gray-800 to-gray-900 ${
                isSelected ? "animate-pulse" : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                  isHome ? "bg-blue-500" : "bg-red-500"
                }`}
              >
                <span className="text-white font-bold text-lg">
                  {player.number}
                </span>

                {player.is_captain && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-3 h-3 text-gray-900" />
                  </div>
                )}
              </div>

              {/* Action Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-gray-900" />
                </div>
              )}
              {isSwapTarget && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="w-3 h-3 text-gray-900" />
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="text-center bg-black/80 rounded-lg p-2 backdrop-blur-sm border border-white/10 min-w-[80px]">
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
              {playerStats?.preferredPositions && (
                <div className="flex justify-center space-x-1 mt-1">
                  {playerStats.preferredPositions.slice(0, 2).map((pos) => (
                    <div
                      key={pos}
                      className="text-[10px] bg-gray-600 text-gray-300 px-1 rounded"
                    >
                      {pos}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  );

  // Empty Slot Component
  const EmptySlot = React.memo(({ position, team, isHome }) => {
    const isSelected =
      selectedPlayer &&
      !selectedPlayer.fromBench &&
      selectedPlayer.team === team;

    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-200 cursor-pointer ${
          isSelected
            ? "border-yellow-400 bg-yellow-400/20 scale-110 ring-4 ring-yellow-400/30 z-40 hover:scale-115"
            : "border-dashed border-white/20 text-white/40 hover:border-white/40 hover:bg-white/5 hover:scale-105 z-30"
        }`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        onClick={() => handlePositionSelect(position, team)}
      >
        <div className="text-center">
          <div className="font-semibold">{position.label}</div>
          <div className="text-[10px] opacity-60">
            {isSelected ? "Click to move" : "Empty"}
          </div>
        </div>
      </div>
    );
  });

  // Modern Bench Player Component
  const BenchPlayer = React.memo(({ player, team, isHome }) => {
    const playerStats = enhancedPlayers[team]?.[player.id];
    const isSelected =
      selectedPlayer?.id === player.id && selectedPlayer.team === team;
    const isSwapTarget =
      swapTarget?.player?.id === player.id && swapTarget.team === team;

    return (
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
          isSelected
            ? "ring-2 ring-yellow-400 bg-yellow-400/20 scale-105"
            : isSwapTarget
            ? "ring-2 ring-green-400 bg-green-400/20 scale-105"
            : "hover:scale-[1.02] hover:bg-gray-700/50"
        } ${
          isHome
            ? "bg-blue-900/20 border border-blue-700/30"
            : "bg-red-900/20 border border-red-700/30"
        } backdrop-blur-sm relative`}
        onClick={() => handlePlayerSelect(player, team, true)}
        onMouseEnter={(e) => showTooltip(e, player, team, isHome)}
        onMouseLeave={hideTooltip}
        onMouseMove={(e) => showTooltip(e, player, team, isHome)}
      >
        {/* Action Indicators */}
        {isSelected && (
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <Target className="w-3 h-3 text-gray-900" />
          </div>
        )}
        {isSwapTarget && (
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
            <Swap className="w-3 h-3 text-gray-900" />
          </div>
        )}

        {/* Player Number Avatar */}
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative mr-3 ${
              isHome ? "bg-blue-500" : "bg-red-500"
            } shadow-lg ${isSelected ? "animate-pulse" : ""}`}
          >
            <span className="text-white font-bold text-sm">
              {player.number}
            </span>
          </div>
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
            {playerStats?.preferredPositions && (
              <div className="flex space-x-1">
                {playerStats.preferredPositions.slice(0, 2).map((pos) => (
                  <div
                    key={pos}
                    className="text-[10px] bg-gray-600 text-gray-300 px-1 rounded"
                  >
                    {pos}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Shirt
          className={`h-4 w-4 ${isHome ? "text-blue-400" : "text-red-400"}`}
        />
      </div>
    );
  });

  // Action Panel Component
  const ActionPanel = () => {
    if (!selectedPlayer) return null;

    const playerStats =
      enhancedPlayers[selectedPlayer.team]?.[selectedPlayer.id];

    return (
      <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-600/50 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedPlayer.team === "team_a"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              >
                <span className="text-white font-bold text-lg">
                  {selectedPlayer.number}
                </span>
              </div>
              <div>
                <div className="text-white font-bold">
                  {selectedPlayer.name}
                </div>
                <div className="text-yellow-300 text-sm">
                  {actionState === "swapping"
                    ? "Select target player to swap with"
                    : selectedPlayer.fromBench
                    ? "Click on empty position to place player"
                    : "Click on position or player to move/swap"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {actionState === "swapping" && (
                <Button
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600/20"
                  onClick={cancelAction}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Swap
                </Button>
              )}
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={cancelAction}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Professional Football Pitch
  const PitchMarkings = () => (
    <div className="absolute inset-0 border-2 border-white/20 rounded-lg overflow-hidden">
      {/* Grass Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Outer Boundary */}
      <div className="absolute inset-2 border-2 border-white/20 rounded-lg"></div>

      {/* Center Line */}
      <div className="absolute top-1/2 left-2 right-2 border-t-2 border-white/20"></div>

      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full"></div>

      {/* Center Spot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full"></div>

      {/* Penalty Areas */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white/20 border-t-0"></div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white/20 border-b-0"></div>

      {/* Goal Areas */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-6 border-2 border-white/20 border-t-0"></div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 border-2 border-white/20 border-b-0"></div>

      {/* Goals */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/40"></div>
    </div>
  );

  const FormationSelector = ({ team, teamName }) => (
    <div className="flex items-center space-x-3">
      <span className="text-white text-sm font-medium">{teamName}</span>
      <Select
        value={formations[team]}
        onValueChange={(value) => handleFormationChange(team, value)}
      >
        <SelectTrigger className="w-28 bg-gray-800 border-gray-600 text-white text-xs hover:bg-gray-700">
          <SelectValue placeholder="Formation" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600 text-white">
          <SelectItem value="4-3-3">4-3-3</SelectItem>
          <SelectItem value="4-4-2">4-4-2</SelectItem>
          <SelectItem value="4-2-3-1">4-2-3-1</SelectItem>
        </SelectContent>
      </Select>
      <div
        className={`px-3 py-1 rounded-full text-xs font-bold ${
          team === "team_a" ? "bg-blue-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {formations[team]}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Global Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[100] hidden pointer-events-none"
        style={{ display: "none" }}
      />

      {/* Action Panel */}
      <ActionPanel />

      {/* Controls Header */}
      <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <FormationSelector team="team_a" teamName={match.team_a_name} />
              <div className="text-gray-400 font-bold text-lg">VS</div>
              <FormationSelector team="team_b" teamName={match.team_b_name} />
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
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl mx-auto"
                style={{
                  height: "500px",
                  width: "100%",
                  maxWidth: "800px",
                  background:
                    "linear-gradient(135deg, #0f3d0f 0%, #1a5c1a 100%)",
                }}
              >
                <PitchMarkings />

                {/* Players */}
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
                    />
                  ) : (
                    <EmptySlot
                      key={position.id}
                      position={position}
                      team="team_a"
                      isHome={true}
                    />
                  );
                })}
              </div>
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
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {substitutes.team_a?.map((player) => (
                  <BenchPlayer
                    key={player.id}
                    player={player}
                    team="team_a"
                    isHome={true}
                  />
                ))}
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
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl mx-auto"
                style={{
                  height: "500px",
                  width: "100%",
                  maxWidth: "800px",
                  background:
                    "linear-gradient(135deg, #0f3d0f 0%, #1a5c1a 100%)",
                }}
              >
                <PitchMarkings />

                {/* Players */}
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
                    />
                  ) : (
                    <EmptySlot
                      key={position.id}
                      position={position}
                      team="team_b"
                      isHome={false}
                    />
                  );
                })}
              </div>
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
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {substitutes.team_b?.map((player) => (
                  <BenchPlayer
                    key={player.id}
                    player={player}
                    team="team_b"
                    isHome={false}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FootballPitch;
