// src/components/matches/PlayerTimeSelection.jsx
import { useState } from "react";
import { Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PlayerTimeSelection = ({ homePlayers, awayPlayers, matchDuration, onUpdate }) => {
  const [playerTimes, setPlayerTimes] = useState({});

  const handleTimeChange = (playerId, minutes) => {
    const newPlayerTimes = {
      ...playerTimes,
      [playerId]: Math.min(Math.max(0, minutes), matchDuration)
    };
    setPlayerTimes(newPlayerTimes);
    onUpdate(newPlayerTimes);
  };

  const PlayerTimeInput = ({ player, team }) => (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-bold">
            {player.full_name?.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium">{player.full_name}</div>
          <div className="text-xs text-muted-foreground">
            {player.position} • #{player.jersey_number}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          max={