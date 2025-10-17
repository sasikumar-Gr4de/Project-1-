import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Play,
  Upload,
  Calendar,
  Trophy,
} from "lucide-react";
import TeamAvatar from "@/components/teams/TeamAvatar";
import MatchStatusBadge from "@/components/matches/MatchStatusBadge";

const MatchCard = ({ match, onEdit, onDelete, onUploadVideo }) => {
  const canViewDetails = match.status !== "upcoming";
  const canUploadVideo = match.status === "completed";

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMatchTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-4">
          <MatchStatusBadge status={match.status} />
          <div className="text-sm text-gray-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatMatchDate(match.match_date)}
          </div>
        </div>

        {/* Teams and Score */}
        <div className="flex items-center justify-between mb-4">
          {/* Team A */}
          <div className="flex items-center space-x-3 flex-1">
            <TeamAvatar
              team={{ team_mark: match.team_a_logo, name: match.team_a_name }}
              size="default"
            />
            <div className="text-right flex-1">
              <div className="font-semibold text-white text-sm">
                {match.team_a_name}
              </div>
              <div className="text-xs text-gray-400">Home</div>
            </div>
          </div>

          {/* Score */}
          <div className="mx-4">
            {match.status === "upcoming" ? (
              <div className="text-center">
                <div className="text-lg font-bold text-gray-300">VS</div>
                <div className="text-xs text-gray-400">
                  {formatMatchTime(match.match_date)}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {match.team_a_score} - {match.team_b_score}
                </div>
                <div className="text-xs text-gray-400">FT</div>
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-left flex-1">
              <div className="font-semibold text-white text-sm">
                {match.team_b_name}
              </div>
              <div className="text-xs text-gray-400">Away</div>
            </div>
            <TeamAvatar
              team={{ team_mark: match.team_b_logo, name: match.team_b_name }}
              size="default"
            />
          </div>
        </div>

        {/* Tournament Info */}
        <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
          <Trophy className="h-3 w-3 mr-1" />
          {match.tournament_name} • Matchday {match.match_day}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(match)}
              className="text-gray-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(match)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {canUploadVideo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUploadVideo(match)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Link to={`/matches/${match.id}`}>
            <Button
              variant="outline"
              size="sm"
              disabled={!canViewDetails}
              className={`border-gray-600 ${
                canViewDetails
                  ? "text-gray-300 hover:text-white hover:border-gray-500"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              {match.status === "live" ? (
                <Play className="h-4 w-4 mr-1" />
              ) : (
                <Eye className="h-4 w-4 mr-1" />
              )}
              {match.status === "live" ? "Live" : "Details"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
