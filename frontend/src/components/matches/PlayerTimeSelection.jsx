// src/components/matches/PlayerTimeSelection.jsx
import { useState, useEffect } from "react";
import { Users, Clock, Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PlayerTimeSelection = ({
  homePlayers,
  awayPlayers,
  matchDuration,
  existingTimes = {},
  onUpdate,
}) => {
  const [playerTimes, setPlayerTimes] = useState(existingTimes);

  useEffect(() => {
    setPlayerTimes(existingTimes);
  }, [existingTimes]);

  const handleTimeChange = (playerId, field, value) => {
    const numericValue = parseInt(value) || 0;
    const clampedValue = Math.min(Math.max(0, numericValue), matchDuration);

    const newPlayerTimes = {
      ...playerTimes,
      [playerId]: {
        ...playerTimes[playerId],
        [field]: clampedValue,
      },
    };

    // Auto-calculate duration
    if (field === "start" && newPlayerTimes[playerId]?.end !== undefined) {
      const start = clampedValue;
      const end = newPlayerTimes[playerId].end;
      newPlayerTimes[playerId].duration = Math.max(0, end - start);
    } else if (
      field === "end" &&
      newPlayerTimes[playerId]?.start !== undefined
    ) {
      const start = newPlayerTimes[playerId].start;
      const end = clampedValue;
      newPlayerTimes[playerId].duration = Math.max(0, end - start);
    }

    setPlayerTimes(newPlayerTimes);
    onUpdate(newPlayerTimes);
  };

  const handleFullMatch = (playerId) => {
    handleTimeChange(playerId, "start", 0);
    handleTimeChange(playerId, "end", matchDuration);
  };

  const handleSubstitute = (playerId, startMinute) => {
    handleTimeChange(playerId, "start", startMinute);
    handleTimeChange(playerId, "end", matchDuration);
  };

  const PlayerTimeInput = ({ player, team }) => {
    const times = playerTimes[player.player_id] || {};

    return (
      <div className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold">
                {player.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {player.full_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {player.position} • #{player.jersey_number}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFullMatch(player.player_id)}
              className="h-7 text-xs"
            >
              Full Match
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Start Time */}
          <div className="space-y-1">
            <Label
              htmlFor={`start-${player.player_id}`}
              className="text-xs flex items-center gap-1"
            >
              <Play className="h-3 w-3" />
              Start (min)
            </Label>
            <Input
              id={`start-${player.player_id}`}
              type="number"
              min="0"
              max={matchDuration}
              value={times.start || ""}
              onChange={(e) =>
                handleTimeChange(player.player_id, "start", e.target.value)
              }
              className="h-8 text-sm"
              placeholder="0"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1">
            <Label
              htmlFor={`end-${player.player_id}`}
              className="text-xs flex items-center gap-1"
            >
              <Square className="h-3 w-3" />
              End (min)
            </Label>
            <Input
              id={`end-${player.player_id}`}
              type="number"
              min="0"
              max={matchDuration}
              value={times.end || ""}
              onChange={(e) =>
                handleTimeChange(player.player_id, "end", e.target.value)
              }
              className="h-8 text-sm"
              placeholder={matchDuration}
            />
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Duration
            </Label>
            <div className="h-8 flex items-center justify-center border border-border rounded-md bg-muted/50 text-sm">
              {times.duration || 0} min
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1 mt-2">
          {[0, 45, 60, 75].map((minute) => (
            <Button
              key={minute}
              variant="outline"
              size="sm"
              onClick={() => handleSubstitute(player.player_id, minute)}
              className="h-6 text-xs flex-1"
              disabled={minute >= matchDuration}
            >
              {minute}'
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const setAllFullMatch = () => {
    const allPlayers = [...homePlayers, ...awayPlayers];
    const fullTimes = allPlayers.reduce((acc, player) => {
      acc[player.player_id] = {
        start: 0,
        end: matchDuration,
        duration: matchDuration,
      };
      return acc;
    }, {});
    setPlayerTimes(fullTimes);
    onUpdate(fullTimes);
  };

  const clearAllTimes = () => {
    setPlayerTimes({});
    onUpdate({});
  };

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            Match Duration: {matchDuration} minutes
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={setAllFullMatch}
            className="gap-1"
          >
            <Play className="h-3 w-3" />
            Set All Full Match
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllTimes}
            className="gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Team */}
        <div>
          <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
            <Users className="h-4 w-4" />
            Home Team Players
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {homePlayers.map((player) => (
              <PlayerTimeInput
                key={player.player_id}
                player={player}
                team="home"
              />
            ))}
          </div>
        </div>

        {/* Away Team */}
        <div>
          <h4 className="font-semibold mb-3 text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Away Team Players
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {awayPlayers.map((player) => (
              <PlayerTimeInput
                key={player.player_id}
                player={player}
                team="away"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {
              Object.values(playerTimes).filter((t) => t.start !== undefined)
                .length
            }
          </div>
          <div className="text-xs text-muted-foreground">
            Players Configured
          </div>
        </div>
        <div className="p-3 border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {
              Object.values(playerTimes).filter(
                (t) => t.start === 0 && t.end === matchDuration
              ).length
            }
          </div>
          <div className="text-xs text-muted-foreground">
            Full Match Players
          </div>
        </div>
        <div className="p-3 border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {
              Object.values(playerTimes).filter(
                (t) => t.start !== undefined && t.start > 0
              ).length
            }
          </div>
          <div className="text-xs text-muted-foreground">Substitutes</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerTimeSelection;
