import { useCallback } from "react";

export const usePlayerMovement = (
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
) => {
  const resetSelection = useCallback(() => {
    setSelectedPlayer(null);
    setActionState(null);
    setSwapTarget(null);
  }, [setSelectedPlayer, setActionState, setSwapTarget]);

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
    [
      lineups,
      substitutes,
      enhancedPlayers,
      saveFormationSnapshot,
      resetSelection,
      onPlayerMove,
      setLineups,
      setSubstitutes,
    ]
  );

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
    [
      lineups,
      substitutes,
      enhancedPlayers,
      saveFormationSnapshot,
      resetSelection,
      setLineups,
      setSubstitutes,
    ]
  );

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
    [
      lineups,
      substitutes,
      enhancedPlayers,
      saveFormationSnapshot,
      resetSelection,
      setLineups,
      setSubstitutes,
    ]
  );

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
    [
      selectedPlayer,
      swapTarget,
      lineups,
      substitutes,
      handleBenchToPitchSwap,
      handlePitchToBenchSwap,
      enhancedPlayers,
      saveFormationSnapshot,
      resetSelection,
      setLineups,
      setSubstitutes,
    ]
  );

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
    [
      selectedPlayer,
      actionState,
      swapTarget,
      resetSelection,
      handleSwapComplete,
      handlePitchToBenchSwap,
      handleBenchToPitchSwap,
      enhancedPlayers,
      setSelectedPlayer,
      setActionState,
      setSwapTarget,
    ]
  );

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
    [
      selectedPlayer,
      actionState,
      swapTarget,
      resetSelection,
      handleMoveToPosition,
      setSwapTarget,
      setActionState,
    ]
  );

  return {
    handlePlayerSelect,
    handlePositionSelect,
    handleMoveToPosition,
    resetSelection,
    handlePitchToBenchSwap,
    handleBenchToPitchSwap,
    handleSwapComplete,
  };
};
