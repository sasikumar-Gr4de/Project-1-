import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Footprints,
} from "lucide-react";

import { ALL_POSITIONS } from "@/utils/constants";
import PlayerAvatar from "@/components/players/PlayerAvatar";
import PlayerStatusBadge from "@/components/players/PlayerStatusBadge";

const PlayerCard = ({
  player,
  onEdit,
  onDelete,
  calculateAge,
  formatGameTime,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors group">
      <CardContent className="p-6">
        {/* Header with Avatar and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <PlayerAvatar
              player={player}
              size="lg"
              showAbility
              abilityScore={player.overall_ability}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                {player.name}
              </h3>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {player.nationality}
              </p>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActions(!showActions)}
              className="text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {showActions && (
              <div className="absolute right-0 top-8 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 w-32">
                <Link to={`/players/${player.id}`}>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-t-lg">
                    <Eye className="h-3 w-3 mr-2" />
                    View
                  </button>
                </Link>
                <button
                  onClick={() => {
                    onEdit(player);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(player);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status and Position */}
        <div className="flex justify-between items-center mb-4">
          <PlayerStatusBadge status={player.status} />
          <span className="text-sm font-medium text-white bg-blue-500/20 px-2 py-1 rounded">
            {ALL_POSITIONS.find((p) => p.value === player.primary_position)
              ?.label || player.primary_position}
          </span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-700/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {player.sense_score}
            </div>
            <div className="text-xs text-gray-400">Sense</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {player.matches_played}
            </div>
            <div className="text-xs text-gray-400">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.floor(player.game_time / 60)}h
            </div>
            <div className="text-xs text-gray-400">Played</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Club</span>
            <span className="text-white font-medium">
              {player.current_club}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Age</span>
            <span className="text-white font-medium">
              {calculateAge(player.date_of_birth)} years
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Foot</span>
            <span className="text-white font-medium flex items-center">
              <Footprints className="h-3 w-3 mr-1" />
              {player.preferred_foot}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
          <Link to={`/players/${player.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => onEdit(player)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
