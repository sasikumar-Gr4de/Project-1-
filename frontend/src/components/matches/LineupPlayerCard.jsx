import { useState } from "react";
import { Trash2, Clock, MapPin, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FOOTBALL_POSITIONS, POSITION_CATEGORIES } from "@/utils/constants";

const LineupPlayerCard = ({
  player,
  onRemove,
  onUpdate,
  matchDuration,
  index,
  teamType,
}) => {
  const [startTime, setStartTime] = useState(player.start_time || 0);
  const [endTime, setEndTime] = useState(player.end_time || matchDuration);
  const [position, setPosition] = useState(player.position || "");

  const handleTimeChange = (field, value) => {
    const time = parseInt(value) || 0;

    if (field === "start_time") {
      setStartTime(time);
      onUpdate(player.player_id, { start_time: time });
    } else {
      setEndTime(time);
      onUpdate(player.player_id, { end_time: time });
    }
  };

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    onUpdate(player.player_id, { position: newPosition });
  };

  const playingTime = endTime - startTime;
  const selectedPosition = FOOTBALL_POSITIONS.find(
    (pos) => pos.abbreviation === position
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Player Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            {player.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={player.full_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{player.full_name}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>#{player.jersey_number}</span>
              <span>•</span>
              <span>{player.nationality}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(player.player_id)}
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Position Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground flex items-center space-x-2">
          <MapPin className="h-3 w-3" />
          <span>Position</span>
        </label>
        <Select value={position} onValueChange={handlePositionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="">Select position</SelectItem>

            {/* Goalkeepers */}
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-border">
              Goalkeepers
            </div>
            {POSITION_CATEGORIES.GOALKEEPER.map((pos) => (
              <TooltipProvider key={pos.abbreviation}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={pos.abbreviation}>
                      {pos.abbreviation} - {pos.position}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{pos.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Defenders */}
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-border mt-1">
              Defenders
            </div>
            {POSITION_CATEGORIES.DEFENDERS.map((pos) => (
              <TooltipProvider key={pos.abbreviation}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={pos.abbreviation}>
                      {pos.abbreviation} - {pos.position}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{pos.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Midfielders */}
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-border mt-1">
              Midfielders
            </div>
            {POSITION_CATEGORIES.MIDFIELDERS.map((pos) => (
              <TooltipProvider key={pos.abbreviation}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={pos.abbreviation}>
                      {pos.abbreviation} - {pos.position}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{pos.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Forwards */}
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-border mt-1">
              Forwards
            </div>
            {POSITION_CATEGORIES.FORWARDS.map((pos) => (
              <TooltipProvider key={pos.abbreviation}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={pos.abbreviation}>
                      {pos.abbreviation} - {pos.position}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{pos.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </SelectContent>
        </Select>

        {/* Position Description */}
        {selectedPosition && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded flex items-start space-x-2">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{selectedPosition.description}</span>
          </div>
        )}
      </div>

      {/* Playing Time */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>Playing Time (minutes)</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Start</label>
            <Input
              type="number"
              min="0"
              max={matchDuration}
              value={startTime}
              onChange={(e) => handleTimeChange("start_time", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">End</label>
            <Input
              type="number"
              min="0"
              max={matchDuration}
              value={endTime}
              onChange={(e) => handleTimeChange("end_time", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Playing Time Summary */}
        {playingTime > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total playing time:</span>
            <Badge variant="secondary" className="font-mono">
              {playingTime} min
            </Badge>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {startTime >= endTime && (
        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
          End time must be after start time
        </div>
      )}
    </div>
  );
};

export default LineupPlayerCard;
