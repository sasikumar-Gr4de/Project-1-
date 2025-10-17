import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  MapPin,
  Award,
} from "lucide-react";
import TournamentAvatar from "./TournamentAvatar";
import TournamentStatusBadge from "./TournamentStatusBadge";

const TournamentCard = ({ tournament, onEdit, onDelete, formatDate }) => {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <TournamentAvatar
            tournament={tournament}
            size="lg"
            showStats
            teamsCount={tournament.teams_count}
          />
          <TournamentStatusBadge status={tournament.status} />
        </div>

        {/* Tournament Info */}
        <div className="space-y-3 mb-4">
          <h3 className="font-semibold text-white text-lg truncate">
            {tournament.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {tournament.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Award className="h-4 w-4 mr-2" />
              <span>Season: {tournament.season}</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {formatDate(tournament.start_date)} -{" "}
                {formatDate(tournament.end_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-center text-yellow-400 mb-1">
              <Users className="h-4 w-4 mr-1" />
            </div>
            <div className="text-2xl font-bold text-white">
              {tournament.teams_count}
            </div>
            <div className="text-xs text-gray-400">Teams</div>
          </div>
          <div className="text-center p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-center text-purple-400 mb-1">
              <Award className="h-4 w-4 mr-1" />
            </div>
            <div className="text-2xl font-bold text-white">
              {tournament.matches_played}
            </div>
            <div className="text-xs text-gray-400">Matches</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between space-x-2">
          <Link to={`/tournaments/${tournament.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(tournament)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(tournament)}
            className="border-gray-600 text-red-400 hover:bg-red-950/20 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
