import React, { useCallback } from "react";

const TooltipManager = React.memo(
  ({ tooltipRef, tooltipTimeoutRef, selectedPlayer, enhancedPlayers }) => {
    const showTooltip = useCallback(
      (event, player, team, isHome) => {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }

        const playerStats = enhancedPlayers[team]?.[player.id];
        if (!playerStats || !tooltipRef.current) return;

        const tooltip = tooltipRef.current;
        tooltip.innerHTML = createTooltipContent(
          player,
          playerStats,
          isHome,
          selectedPlayer
        );
        tooltip.style.display = "block";

        const rect = event.currentTarget.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = "translate(-50%, -100%)";
      },
      [tooltipRef, tooltipTimeoutRef, enhancedPlayers, selectedPlayer]
    );

    const hideTooltip = useCallback(() => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      tooltipTimeoutRef.current = setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      }, 100);
    }, [tooltipRef, tooltipTimeoutRef]);

    const createTooltipContent = (
      player,
      playerStats,
      isHome,
      selectedPlayer
    ) => {
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

    return {
      showTooltip,
      hideTooltip,
    };
  }
);

export default TooltipManager;
