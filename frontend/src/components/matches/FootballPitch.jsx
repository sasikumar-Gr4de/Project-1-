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
  Award,
  Shirt,
  Target,
  ArrowLeftRight,
  X,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Circle,
  Square,
  RotateCcw,
} from "lucide-react";
import TeamAvatar from "@/components/teams/TeamAvatar";

import { FORMATIONS } from "@/utils/constants";

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
  const [actionState, setActionState] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);

  // Timeline states
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formationHistory, setFormationHistory] = useState([]);

  const tooltipRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);
  const playbackIntervalRef = useRef(null);

  // Enhanced player data with match stats
  const enhancedPlayers = {
    team_a: {
      1: {
        name: "Harry Kane",
        rating: 8.2,
        position: "ST",
        preferredPositions: ["ST", "CF"],
        goals: 1,
        assists: 0,
        minutes: 90,
      },
      2: {
        name: "Kevin De Bruyne",
        rating: 8.0,
        position: "CAM",
        preferredPositions: ["CAM", "CM", "RW"],
        goals: 0,
        assists: 2,
        minutes: 90,
      },
      3: {
        name: "Virgil van Dijk",
        rating: 7.9,
        position: "CB",
        preferredPositions: ["CB"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      4: {
        name: "Alisson Becker",
        rating: 7.8,
        position: "GK",
        preferredPositions: ["GK"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      5: {
        name: "Trent Alexander",
        rating: 7.7,
        position: "RB",
        preferredPositions: ["RB", "RWB"],
        goals: 0,
        assists: 1,
        minutes: 90,
      },
      6: {
        name: "Rodri",
        rating: 7.8,
        position: "CDM",
        preferredPositions: ["CDM", "CM"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      7: {
        name: "Son Heung-min",
        rating: 7.9,
        position: "LW",
        preferredPositions: ["LW", "RW", "ST"],
        goals: 1,
        assists: 0,
        minutes: 90,
      },
      8: {
        name: "Joshua Kimmich",
        rating: 7.7,
        position: "CM",
        preferredPositions: ["CM", "CDM", "RB"],
        goals: 0,
        assists: 0,
        minutes: 67,
      },
      9: {
        name: "Ruben Dias",
        rating: 7.6,
        position: "CB",
        preferredPositions: ["CB"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      10: {
        name: "Ederson",
        rating: 7.5,
        position: "GK",
        preferredPositions: ["GK"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      11: {
        name: "Phil Foden",
        rating: 7.8,
        position: "RW",
        preferredPositions: ["RW", "CAM", "LW"],
        goals: 0,
        assists: 0,
        minutes: 45,
      },
      23: {
        name: "Bukayo Saka",
        rating: 7.6,
        position: "RW",
        preferredPositions: ["RW", "LW", "RWB"],
        goals: 0,
        assists: 1,
        minutes: 45,
      },
      24: {
        name: "Declan Rice",
        rating: 7.5,
        position: "CDM",
        preferredPositions: ["CDM", "CM"],
        goals: 0,
        assists: 0,
        minutes: 23,
      },
      25: {
        name: "Kyle Walker",
        rating: 7.4,
        position: "RB",
        preferredPositions: ["RB", "CB"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      26: {
        name: "John Stones",
        rating: 7.3,
        position: "CB",
        preferredPositions: ["CB", "CDM"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      27: {
        name: "Jack Grealish",
        rating: 7.2,
        position: "LW",
        preferredPositions: ["LW", "CAM"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
    },
    team_b: {
      12: {
        name: "Kylian Mbappé",
        rating: 8.3,
        position: "ST",
        preferredPositions: ["ST", "LW"],
        goals: 1,
        assists: 0,
        minutes: 90,
      },
      13: {
        name: "Erling Haaland",
        rating: 8.1,
        position: "ST",
        preferredPositions: ["ST"],
        goals: 0,
        assists: 0,
        minutes: 67,
      },
      14: {
        name: "Lionel Messi",
        rating: 8.0,
        position: "RW",
        preferredPositions: ["RW", "CAM", "ST"],
        goals: 0,
        assists: 1,
        minutes: 90,
      },
      15: {
        name: "N'Golo Kanté",
        rating: 7.8,
        position: "CDM",
        preferredPositions: ["CDM", "CM"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      16: {
        name: "Marquinhos",
        rating: 7.7,
        position: "CB",
        preferredPositions: ["CB"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      17: {
        name: "Manuel Neuer",
        rating: 7.6,
        position: "GK",
        preferredPositions: ["GK"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      18: {
        name: "Achraf Hakimi",
        rating: 7.7,
        position: "RB",
        preferredPositions: ["RB", "RWB"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      19: {
        name: "Federico Valverde",
        rating: 7.6,
        position: "CM",
        preferredPositions: ["CM", "RM", "CDM"],
        goals: 0,
        assists: 0,
        minutes: 90,
      },
      20: {
        name: "Theo Hernandez",
        rating: 7.5,
        position: "LB",
        preferredPositions: ["LB", "LWB"],
        goals: 0,
        assists: 0,
        minutes: 82,
      },
      21: {
        name: "Jan Oblak",
        rating: 7.4,
        position: "GK",
        preferredPositions: ["GK"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      22: {
        name: "Luis Diaz",
        rating: 7.7,
        position: "LW",
        preferredPositions: ["LW", "RW"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      28: {
        name: "Karim Benzema",
        rating: 7.9,
        position: "ST",
        preferredPositions: ["ST", "CF"],
        goals: 0,
        assists: 0,
        minutes: 23,
      },
      29: {
        name: "Luka Modric",
        rating: 7.8,
        position: "CM",
        preferredPositions: ["CM", "CAM"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      30: {
        name: "Antonio Rudiger",
        rating: 7.4,
        position: "CB",
        preferredPositions: ["CB"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      31: {
        name: "Vinicius Junior",
        rating: 7.9,
        position: "LW",
        preferredPositions: ["LW", "RW"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
      32: {
        name: "Thibaut Courtois",
        rating: 7.5,
        position: "GK",
        preferredPositions: ["GK"],
        goals: 0,
        assists: 0,
        minutes: 0,
      },
    },
  };

  // Initialize match data
  useEffect(() => {
    if (match) {
      // Start with initial lineups
      const initialLineups = {
        team_a: [
          {
            id: 1,
            name: "Harry Kane",
            position: "ST",
            preferredPositions: ["ST", "CF"],
            number: 1,
            is_captain: true,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 2,
            name: "Kevin De Bruyne",
            position: "CAM",
            preferredPositions: ["CAM", "CM", "RW"],
            number: 2,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 3,
            name: "Virgil van Dijk",
            position: "CB",
            preferredPositions: ["CB"],
            number: 3,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 4,
            name: "Alisson Becker",
            position: "GK",
            preferredPositions: ["GK"],
            number: 4,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 5,
            name: "Trent Alexander",
            position: "RB",
            preferredPositions: ["RB", "RWB"],
            number: 5,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 6,
            name: "Rodri",
            position: "CDM",
            preferredPositions: ["CDM", "CM"],
            number: 6,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 7,
            name: "Son Heung-min",
            position: "LW",
            preferredPositions: ["LW", "RW", "ST"],
            number: 7,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 8,
            name: "Joshua Kimmich",
            position: "CM",
            preferredPositions: ["CM", "CDM", "RB"],
            number: 8,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 9,
            name: "Ruben Dias",
            position: "CB",
            preferredPositions: ["CB"],
            number: 9,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 10,
            name: "Ederson",
            position: "GK",
            preferredPositions: ["GK"],
            number: 10,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 11,
            name: "Phil Foden",
            position: "RW",
            preferredPositions: ["RW", "CAM", "LW"],
            number: 11,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
        ],
        team_b: [
          {
            id: 12,
            name: "Kylian Mbappé",
            position: "ST",
            preferredPositions: ["ST", "LW"],
            number: 12,
            is_captain: true,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 13,
            name: "Erling Haaland",
            position: "ST",
            preferredPositions: ["ST"],
            number: 13,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 14,
            name: "Lionel Messi",
            position: "RW",
            preferredPositions: ["RW", "CAM", "ST"],
            number: 14,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 15,
            name: "N'Golo Kanté",
            position: "CDM",
            preferredPositions: ["CDM", "CM"],
            number: 15,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 16,
            name: "Marquinhos",
            position: "CB",
            preferredPositions: ["CB"],
            number: 16,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 17,
            name: "Manuel Neuer",
            position: "GK",
            preferredPositions: ["GK"],
            number: 17,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 18,
            name: "Achraf Hakimi",
            position: "RB",
            preferredPositions: ["RB", "RWB"],
            number: 18,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 19,
            name: "Federico Valverde",
            position: "CM",
            preferredPositions: ["CM", "RM", "CDM"],
            number: 19,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 20,
            name: "Theo Hernandez",
            position: "LB",
            preferredPositions: ["LB", "LWB"],
            number: 20,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 21,
            name: "Jan Oblak",
            position: "GK",
            preferredPositions: ["GK"],
            number: 21,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 22,
            name: "Luis Diaz",
            position: "LW",
            preferredPositions: ["LW", "RW"],
            number: 22,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
        ],
      };

      const initialSubstitutes = {
        team_a: [
          {
            id: 23,
            name: "Bukayo Saka",
            position: "RW",
            preferredPositions: ["RW", "LW", "RWB"],
            number: 23,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 24,
            name: "Declan Rice",
            position: "CDM",
            preferredPositions: ["CDM", "CM"],
            number: 24,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 25,
            name: "Kyle Walker",
            position: "RB",
            preferredPositions: ["RB", "CB"],
            number: 25,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 26,
            name: "John Stones",
            position: "CB",
            preferredPositions: ["CB", "CDM"],
            number: 26,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 27,
            name: "Jack Grealish",
            position: "LW",
            preferredPositions: ["LW", "CAM"],
            number: 27,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
        ],
        team_b: [
          {
            id: 28,
            name: "Karim Benzema",
            position: "ST",
            preferredPositions: ["ST", "CF"],
            number: 28,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 29,
            name: "Luka Modric",
            position: "CM",
            preferredPositions: ["CM", "CAM"],
            number: 29,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 30,
            name: "Antonio Rudiger",
            position: "CB",
            preferredPositions: ["CB"],
            number: 30,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 31,
            name: "Vinicius Junior",
            position: "LW",
            preferredPositions: ["LW", "RW"],
            number: 31,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
          {
            id: 32,
            name: "Thibaut Courtois",
            position: "GK",
            preferredPositions: ["GK"],
            number: 32,
            is_captain: false,
            stats: { goals: 0, assists: 0, minutes: 0 },
          },
        ],
      };

      setLineups(initialLineups);
      setSubstitutes(initialSubstitutes);

      // Initialize formation history
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

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 90) {
            setIsPlaying(false);
            return 90;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // FIXED: Proper player movement maintaining preferred positions
  const handlePlayerSelect = useCallback(
    (player, team, fromBench = false) => {
      if (selectedPlayer && selectedPlayer.team !== team) {
        resetSelection();
        return;
      }

      if (actionState === "swapping" && swapTarget) {
        handleSwapComplete(player, team, fromBench);
        return;
      }

      if (
        selectedPlayer &&
        selectedPlayer.id === player.id &&
        selectedPlayer.team === team
      ) {
        resetSelection();
      } else if (selectedPlayer) {
        if (fromBench && !selectedPlayer.fromBench) {
          handlePitchToBenchSwap(selectedPlayer, player, team);
        } else if (!fromBench && selectedPlayer.fromBench) {
          handleBenchToPitchSwap(selectedPlayer, player, team);
        } else if (!fromBench && !selectedPlayer.fromBench) {
          setSwapTarget({ player, team, fromBench: false });
          setActionState("swapping");
        } else if (fromBench && selectedPlayer.fromBench) {
          setSwapTarget({ player, team, fromBench: true });
          setActionState("swapping");
        }
      } else {
        setSelectedPlayer({
          ...player,
          team,
          fromBench,
          originalPreferredPositions:
            enhancedPlayers[team]?.[player.id]?.preferredPositions || [],
        });
        setActionState("selecting");
      }
    },
    [selectedPlayer, actionState, swapTarget]
  );

  // FIXED: Proper position selection with team validation
  const handlePositionSelect = useCallback(
    (position, team) => {
      if (!selectedPlayer) return;

      if (selectedPlayer.team !== team) {
        resetSelection();
        return;
      }

      if (actionState === "swapping" && swapTarget) {
        handleMoveToPosition(selectedPlayer, position.id, team);
        setSwapTarget(null);
        setActionState(null);
        return;
      }

      handleMoveToPosition(selectedPlayer, position.id, team);
    },
    [selectedPlayer, actionState, swapTarget]
  );

  // FIXED: Move player to position while maintaining original preferred positions
  const handleMoveToPosition = useCallback(
    (player, positionId, team) => {
      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      if (player.fromBench) {
        updatedSubstitutes[player.team] = updatedSubstitutes[
          player.team
        ].filter((p) => p.id !== player.id);
      } else {
        updatedLineups[player.team] = updatedLineups[player.team].filter(
          (p) => p.id !== player.id
        );
      }

      const playerWithOriginalData = {
        ...player,
        position: positionId,
        fromBench: false,
        preferredPositions: player.originalPreferredPositions ||
          enhancedPlayers[team]?.[player.id]?.preferredPositions || [
            positionId,
          ],
      };

      updatedLineups[team] = [
        ...updatedLineups[team].filter((p) => p.position !== positionId),
        playerWithOriginalData,
      ];

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);
      onPlayerMove?.(player.id, player.position, positionId);

      saveFormationSnapshot();

      resetSelection();
    },
    [lineups, substitutes, onPlayerMove, currentTime]
  );

  // FIXED: Pitch to Bench Swap - maintain original data
  const handlePitchToBenchSwap = useCallback(
    (pitchPlayer, benchPlayer, team) => {
      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      updatedLineups[team] = updatedLineups[team].filter(
        (p) => p.id !== pitchPlayer.id
      );
      updatedSubstitutes[team] = updatedSubstitutes[team].filter(
        (p) => p.id !== benchPlayer.id
      );

      const pitchPlayerWithOriginalData = {
        ...pitchPlayer,
        fromBench: true,
        preferredPositions: pitchPlayer.originalPreferredPositions ||
          enhancedPlayers[team]?.[pitchPlayer.id]?.preferredPositions || [
            pitchPlayer.position,
          ],
      };

      const benchPlayerWithOriginalData = {
        ...benchPlayer,
        position: pitchPlayer.position,
        fromBench: false,
        preferredPositions: benchPlayer.originalPreferredPositions ||
          enhancedPlayers[team]?.[benchPlayer.id]?.preferredPositions || [
            benchPlayer.position,
          ],
      };

      const benchIndex = substitutes[team].findIndex(
        (p) => p.id === benchPlayer.id
      );
      const newSubstitutes = [...substitutes[team]];
      newSubstitutes[benchIndex] = pitchPlayerWithOriginalData;

      updatedSubstitutes[team] = newSubstitutes;
      updatedLineups[team] = [
        ...updatedLineups[team],
        benchPlayerWithOriginalData,
      ];

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);

      saveFormationSnapshot();

      resetSelection();
    },
    [lineups, substitutes]
  );

  // FIXED: Bench to Pitch Swap - maintain original data
  const handleBenchToPitchSwap = useCallback(
    (benchPlayer, pitchPlayer, team) => {
      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      updatedSubstitutes[team] = updatedSubstitutes[team].filter(
        (p) => p.id !== benchPlayer.id
      );
      updatedLineups[team] = updatedLineups[team].filter(
        (p) => p.id !== pitchPlayer.id
      );

      const benchPlayerWithOriginalData = {
        ...benchPlayer,
        position: pitchPlayer.position,
        fromBench: false,
        preferredPositions: benchPlayer.originalPreferredPositions ||
          enhancedPlayers[team]?.[benchPlayer.id]?.preferredPositions || [
            benchPlayer.position,
          ],
      };

      const pitchPlayerWithOriginalData = {
        ...pitchPlayer,
        fromBench: true,
        preferredPositions: pitchPlayer.originalPreferredPositions ||
          enhancedPlayers[team]?.[pitchPlayer.id]?.preferredPositions || [
            pitchPlayer.position,
          ],
      };

      const benchIndex = substitutes[team].findIndex(
        (p) => p.id === benchPlayer.id
      );
      const newSubstitutes = [...substitutes[team]];
      newSubstitutes[benchIndex] = pitchPlayerWithOriginalData;

      updatedSubstitutes[team] = newSubstitutes;
      updatedLineups[team] = [
        ...updatedLineups[team],
        benchPlayerWithOriginalData,
      ];

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);

      saveFormationSnapshot();

      resetSelection();
    },
    [lineups, substitutes]
  );

  // FIXED: Complete swap
  const handleSwapComplete = useCallback(
    (targetPlayer, team, fromBench) => {
      if (!selectedPlayer || !swapTarget) return;

      if (selectedPlayer.team !== team) {
        resetSelection();
        return;
      }

      const updatedLineups = { ...lineups };
      const updatedSubstitutes = { ...substitutes };

      if (selectedPlayer.fromBench && !fromBench) {
        handleBenchToPitchSwap(selectedPlayer, targetPlayer, team);
      } else if (!selectedPlayer.fromBench && fromBench) {
        handlePitchToBenchSwap(selectedPlayer, targetPlayer, team);
      } else if (!selectedPlayer.fromBench && !fromBench) {
        updatedLineups[team] = updatedLineups[team].filter(
          (p) => p.id !== selectedPlayer.id && p.id !== targetPlayer.id
        );

        updatedLineups[team] = [
          ...updatedLineups[team],
          {
            ...selectedPlayer,
            position: targetPlayer.position,
            preferredPositions: selectedPlayer.originalPreferredPositions ||
              enhancedPlayers[team]?.[selectedPlayer.id]
                ?.preferredPositions || [selectedPlayer.position],
          },
          {
            ...targetPlayer,
            position: selectedPlayer.position,
            preferredPositions: targetPlayer.originalPreferredPositions ||
              enhancedPlayers[team]?.[targetPlayer.id]?.preferredPositions || [
                targetPlayer.position,
              ],
          },
        ];
      } else if (selectedPlayer.fromBench && fromBench) {
        updatedSubstitutes[team] = updatedSubstitutes[team].filter(
          (p) => p.id !== selectedPlayer.id && p.id !== targetPlayer.id
        );

        updatedSubstitutes[team] = [
          ...updatedSubstitutes[team],
          selectedPlayer,
          targetPlayer,
        ];
      }

      setLineups(updatedLineups);
      setSubstitutes(updatedSubstitutes);

      saveFormationSnapshot();

      resetSelection();
    },
    [selectedPlayer, swapTarget, lineups, substitutes]
  );

  // Save current formation state to history
  const saveFormationSnapshot = useCallback(() => {
    const snapshot = {
      time: currentTime,
      formations: { ...formations },
      lineups: JSON.parse(JSON.stringify(lineups)),
      substitutes: JSON.parse(JSON.stringify(substitutes)),
    };

    setFormationHistory((prev) => {
      const existingIndex = prev.findIndex((item) => item.time === currentTime);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = snapshot;
        return updated;
      }
      return [...prev, snapshot].sort((a, b) => a.time - b.time);
    });
  }, [currentTime, formations, lineups, substitutes]);

  // Jump to specific time in match
  const handleTimeJump = useCallback(
    (time) => {
      setCurrentTime(time);
      setIsPlaying(false);

      const snapshot = formationHistory
        .filter((item) => item.time <= time)
        .sort((a, b) => b.time - a.time)[0];

      if (snapshot) {
        setFormations(snapshot.formations);
        setLineups(snapshot.lineups);
        setSubstitutes(snapshot.substitutes);
      }
    },
    [formationHistory]
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
      saveFormationSnapshot();
    },
    [onFormationChange, saveFormationSnapshot]
  );

  const handleResetFormation = useCallback(() => {
    const initialLineups = {
      team_a: [
        {
          id: 1,
          name: "Harry Kane",
          position: "ST",
          preferredPositions: ["ST", "CF"],
          number: 1,
          is_captain: true,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 2,
          name: "Kevin De Bruyne",
          position: "CAM",
          preferredPositions: ["CAM", "CM", "RW"],
          number: 2,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 3,
          name: "Virgil van Dijk",
          position: "CB",
          preferredPositions: ["CB"],
          number: 3,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 4,
          name: "Alisson Becker",
          position: "GK",
          preferredPositions: ["GK"],
          number: 4,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 5,
          name: "Trent Alexander",
          position: "RB",
          preferredPositions: ["RB", "RWB"],
          number: 5,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 6,
          name: "Rodri",
          position: "CDM",
          preferredPositions: ["CDM", "CM"],
          number: 6,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 7,
          name: "Son Heung-min",
          position: "LW",
          preferredPositions: ["LW", "RW", "ST"],
          number: 7,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 8,
          name: "Joshua Kimmich",
          position: "CM",
          preferredPositions: ["CM", "CDM", "RB"],
          number: 8,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 9,
          name: "Ruben Dias",
          position: "CB",
          preferredPositions: ["CB"],
          number: 9,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 10,
          name: "Ederson",
          position: "GK",
          preferredPositions: ["GK"],
          number: 10,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 11,
          name: "Phil Foden",
          position: "RW",
          preferredPositions: ["RW", "CAM", "LW"],
          number: 11,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
      ],
      team_b: [
        {
          id: 12,
          name: "Kylian Mbappé",
          position: "ST",
          preferredPositions: ["ST", "LW"],
          number: 12,
          is_captain: true,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 13,
          name: "Erling Haaland",
          position: "ST",
          preferredPositions: ["ST"],
          number: 13,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 14,
          name: "Lionel Messi",
          position: "RW",
          preferredPositions: ["RW", "CAM", "ST"],
          number: 14,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 15,
          name: "N'Golo Kanté",
          position: "CDM",
          preferredPositions: ["CDM", "CM"],
          number: 15,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 16,
          name: "Marquinhos",
          position: "CB",
          preferredPositions: ["CB"],
          number: 16,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 17,
          name: "Manuel Neuer",
          position: "GK",
          preferredPositions: ["GK"],
          number: 17,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 18,
          name: "Achraf Hakimi",
          position: "RB",
          preferredPositions: ["RB", "RWB"],
          number: 18,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 19,
          name: "Federico Valverde",
          position: "CM",
          preferredPositions: ["CM", "RM", "CDM"],
          number: 19,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 20,
          name: "Theo Hernandez",
          position: "LB",
          preferredPositions: ["LB", "LWB"],
          number: 20,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 21,
          name: "Jan Oblak",
          position: "GK",
          preferredPositions: ["GK"],
          number: 21,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 22,
          name: "Luis Diaz",
          position: "LW",
          preferredPositions: ["LW", "RW"],
          number: 22,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
      ],
    };

    const initialSubstitutes = {
      team_a: [
        {
          id: 23,
          name: "Bukayo Saka",
          position: "RW",
          preferredPositions: ["RW", "LW", "RWB"],
          number: 23,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 24,
          name: "Declan Rice",
          position: "CDM",
          preferredPositions: ["CDM", "CM"],
          number: 24,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 25,
          name: "Kyle Walker",
          position: "RB",
          preferredPositions: ["RB", "CB"],
          number: 25,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 26,
          name: "John Stones",
          position: "CB",
          preferredPositions: ["CB", "CDM"],
          number: 26,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 27,
          name: "Jack Grealish",
          position: "LW",
          preferredPositions: ["LW", "CAM"],
          number: 27,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
      ],
      team_b: [
        {
          id: 28,
          name: "Karim Benzema",
          position: "ST",
          preferredPositions: ["ST", "CF"],
          number: 28,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 29,
          name: "Luka Modric",
          position: "CM",
          preferredPositions: ["CM", "CAM"],
          number: 29,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 30,
          name: "Antonio Rudiger",
          position: "CB",
          preferredPositions: ["CB"],
          number: 30,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 31,
          name: "Vinicius Junior",
          position: "LW",
          preferredPositions: ["LW", "RW"],
          number: 31,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
        {
          id: 32,
          name: "Thibaut Courtois",
          position: "GK",
          preferredPositions: ["GK"],
          number: 32,
          is_captain: false,
          stats: { goals: 0, assists: 0, minutes: 0 },
        },
      ],
    };

    setSubstitutes(initialSubstitutes);
    setLineups(initialLineups);
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
  }, []);

  // Tooltip management
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

  // Timeline Component
  const MatchTimeline = () => {
    const timelineMarkers = [0, 15, 30, 45, 60, 75, 90];
    const formationTimes = [
      ...new Set(formationHistory.map((item) => item.time)),
    ].sort((a, b) => a - b);

    return (
      <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
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
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 " />
                  )}
                  <span className="ml-2 text-xs">
                    {isPlaying ? "Pause" : "Play"}
                  </span>
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

              <div className="flex items-center space-x-2 text-white bg-gray-700/50 px-3 py-1 rounded-lg">
                <Clock className="h-4 w-4" />
                <span className="font-bold text-lg">{currentTime}'</span>
                <span className="text-gray-400 text-sm">/ 90'</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {enhancedPlayers.team_a[1].goals +
                  enhancedPlayers.team_a[7].goals}{" "}
                - {enhancedPlayers.team_b[12].goals}
              </div>
              <div className="text-sm text-gray-400">Final Score</div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="relative h-16 bg-gray-700/30 rounded-xl p-3 border border-gray-600/50">
            <div className="absolute inset-0 flex items-center">
              {/* Time markers */}
              {timelineMarkers.map((minute) => (
                <div
                  key={minute}
                  className="absolute flex flex-col items-center cursor-pointer "
                  style={{
                    left: `${(minute / 90) * 100}%`,
                    transform: `translate(-50%, 0)`,
                  }}
                  onClick={() => handleTimeJump(minute)}
                >
                  <div className="w-px h-4 bg-white/30"></div>
                  <span className="text-xs text-white/60 mt-1 hover:text-white transition-colors">
                    {minute}'
                  </span>
                </div>
              ))}

              {/* Formation change markers */}
              {formationTimes.map((time) => (
                <div
                  key={time}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                  style={{ left: `${(time / 90) * 100}%`, top: "50%" }}
                  onClick={() => handleTimeJump(time)}
                >
                  <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg border-2 border-white hover:scale-125 transition-transform" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Formation saved at {time}'
                  </div>
                </div>
              ))}

              {/* Current time indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-blue-400 rounded-full transform -translate-x-1/2 z-20 shadow-lg shadow-blue-400/50"
                style={{ left: `${(currentTime / 90) * 100}%` }}
              >
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-400 rounded-full border-2 border-gray-800 shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Formation History */}
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Formation History</div>
            <div className="flex flex-wrap gap-2">
              {formationTimes.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeJump(time)}
                  className={`text-xs ${
                    currentTime === time
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-700/50 text-gray-300 border-gray-600"
                  }`}
                >
                  {time}'{time === 0 && " (Start)"}
                  {time === 90 && " (End)"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Enhanced Bench Player Component
  const BenchPlayer = React.memo(({ player, team, isHome }) => {
    const playerStats = enhancedPlayers[team]?.[player.id];
    const isSelected =
      selectedPlayer?.id === player.id && selectedPlayer.team === team;
    const isSwapTarget =
      swapTarget?.player?.id === player.id && swapTarget.team === team;
    const currentStats = player.stats || { goals: 0, assists: 0, minutes: 0 };

    return (
      <div
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
      >
        {/* Action Indicators */}
        {isSelected && (
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-10">
            <Target className="w-3 h-3 text-gray-900" />
          </div>
        )}
        {isSwapTarget && (
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg z-10">
            <ArrowLeftRight className="w-3 h-3 text-gray-900" />
          </div>
        )}

        {/* Player Number Avatar */}
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative mr-3 shadow-lg ${
              isHome ? "bg-blue-500" : "bg-red-500"
            } ${isSelected ? "animate-pulse" : ""} border-2 ${
              isSelected ? "border-yellow-400" : "border-white/20"
            }`}
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
            {/* Match Stats */}
            {(currentStats.goals > 0 || currentStats.assists > 0) && (
              <div className="flex space-x-1 text-xs">
                {currentStats.goals > 0 && (
                  <div className="bg-green-500 text-white px-1 rounded">
                    ⚽{currentStats.goals}
                  </div>
                )}
                {currentStats.assists > 0 && (
                  <div className="bg-blue-500 text-white px-1 rounded">
                    A{currentStats.assists}
                  </div>
                )}
              </div>
            )}
          </div>
          {playerStats?.preferredPositions && (
            <div className="flex space-x-1 mt-1">
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

        <Shirt
          className={`h-4 w-4 ${isHome ? "text-blue-400" : "text-red-400"}`}
        />
      </div>
    );
  });

  // Professional Football Pitch with International Dimensions
  const PitchMarkings = () => (
    <div className="absolute inset-0 border-2 border-white/20 rounded-lg overflow-hidden">
      {/* Grass Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Outer Boundary */}
      <div className="absolute inset-2 border-2 border-white/20 rounded-lg"></div>

      {/* Half-way Line */}
      <div className="absolute top-1/2 left-2 right-2 border-t-2 border-white/20"></div>

      {/* Center Circle - 9.15m radius */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full"></div>

      {/* Center Spot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/60 rounded-full"></div>

      {/* Penalty Areas - 16.5m x 40.3m */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-20 border-2 border-white/20 border-t-0 rotate-180"></div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-48 h-20 border-2 border-white/20 border-b-0 rotate-180"></div>

      {/* Goal Areas - 5.5m x 18.3m */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-8 border-2 border-white/20 border-t-0 rotate-180"></div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-8 border-2 border-white/20 border-b-0 rotate-180"></div>

      {/* Penalty Spots - 11m from goal line */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>

      {/* Penalty Arcs - 9.15m radius */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-12 border-t-2 border-white/20 rounded-t-full overflow-hidden"></div>
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-12 border-b-2 border-white/20 rounded-b-full overflow-hidden"></div>

      {/* Goals */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/40"></div>
    </div>
  );

  // Pitch Player Component
  const PitchPlayer = React.memo(
    ({ player, position, team, isHome = true }) => {
      const playerStats = enhancedPlayers[team]?.[player.id];
      const isSelected =
        selectedPlayer?.id === player.id && selectedPlayer.team === team;
      const isSwapTarget =
        swapTarget?.player?.id === player.id && swapTarget.team === team;
      const currentStats = player.stats || { goals: 0, assists: 0, minutes: 0 };

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

                {/* Goal indicator */}
                {currentStats.goals > 0 && (
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">⚽</span>
                  </div>
                )}
              </div>

              {/* Action Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Target className="w-3 h-3 text-gray-900" />
                </div>
              )}
              {isSwapTarget && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
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
              {/* Match Stats */}
              {(currentStats.goals > 0 || currentStats.assists > 0) && (
                <div className="flex justify-center space-x-1 mt-1">
                  {currentStats.goals > 0 && (
                    <div className="text-[10px] bg-green-500 text-white px-1 rounded">
                      ⚽{currentStats.goals}
                    </div>
                  )}
                  {currentStats.assists > 0 && (
                    <div className="text-[10px] bg-blue-500 text-white px-1 rounded">
                      A{currentStats.assists}
                    </div>
                  )}
                </div>
              )}
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
          {Object.keys(FORMATIONS).map((formation) => (
            <SelectItem value={formation} key={`formation-${formation}`}>
              {formation}
            </SelectItem>
          ))}
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

      {/* Match Timeline */}
      <MatchTimeline />

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
              <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
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
              <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
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
