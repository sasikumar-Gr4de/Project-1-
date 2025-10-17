import { useCallback } from "react";

export const usePlayerMovement = (
  lineups,
  substitutes,
  selectedPlayer,
  actionState,
  swapTarget,
  enhancedPlayers,
  saveFormationSnapshot,
  resetSelection,
  onPlayerMove
) => {
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
    ]
  );

  return {
    handleMoveToPosition,
    handlePitchToBenchSwap,
    // ... other movement functions
  };
};
