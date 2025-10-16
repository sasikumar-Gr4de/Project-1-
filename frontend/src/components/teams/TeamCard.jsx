import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Users,
  Trophy,
  Calendar,
  BarChart3,
  MapPin,
  Eye,
  Edit,
  Trash2,
  User,
  Building,
} from "lucide-react";
import TeamAvatar from "./TeamAvatar";
import TeamStatusBadge from "./TeamStatusBadge";

const TeamCard = ({ team, onEdit, onDelete, calculateAge }) => {
  const teamMetrics = {
    averageAge: team.players
      ? Math.round(
          team.players.reduce(
            (sum, player) => sum + calculateAge(player.date_of_birth),
            0
          ) / team.players.length
        )
      : 0,
    averageAbility: team.players
      ? Math.round(
          team.players.reduce(
            (sum, player) => sum + (player.overall_ability || 0),
            0
          ) / team.players.length
        )
      : 0,
    totalPlayers: team.players ? team.players.length : 0,
    matchesPlayed: team.players
      ? team.players.reduce(
          (sum, player) => sum + (player.matches_played || 0),
          0
        )
      : 0,
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TeamAvatar
              team={team}
              size="default"
              showStats
              playerCount={teamMetrics.totalPlayers}
            />
            <div>
              <h3 className="font-semibold text-white text-lg">{team.name}</h3>
              <TeamStatusBadge status={team.status} />
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-400">
            <User className="h-4 w-4 mr-2" />
            <span>Admin: {team.admin_name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Trophy className="h-4 w-4 mr-2" />
            <span>Tournament: {team.tournament}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Building className="h-4 w-4 mr-2" />
            <span>Organizer: {team.organizer}</span>
          </div>
          {team.location && (
            <div className="flex items-center text-sm text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{team.location}</span>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-700/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {teamMetrics.averageAbility}
            </div>
            <div className="text-xs text-gray-400">Avg Ability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {teamMetrics.averageAge}
            </div>
            <div className="text-xs text-gray-400">Avg Age</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {teamMetrics.totalPlayers}
            </div>
            <div className="text-xs text-gray-400">Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {teamMetrics.matchesPlayed}
            </div>
            <div className="text-xs text-gray-400">Matches</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link to={`/teams/${team.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(team)}
              className="text-gray-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(team)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
