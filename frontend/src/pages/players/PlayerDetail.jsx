import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Download,
  Share,
  Users,
  BarChart3,
  Trophy,
  Activity,
  Eye,
} from "lucide-react";
import PlayerAvatar from "@/components/players/PlayerAvatar";
import PlayerStatusBadge from "@/components/players/PlayerStatusBadge";
import AbilityRadarChart from "@/components/players/AbilityRadarChart";
import PerformanceMetrics from "@/components/players/PerformanceMetrics";
import MatchHistory from "@/components/players/MatchHistory";
import Loading from "@/components/common/Loading";

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, fetch from API
  const mockPlayer = {
    id: 1,
    name: "Marcus Johnson",
    date_of_birth: "2006-05-15",
    nationality: "England",
    current_club: "United Academy",
    primary_position: "ST",
    height_cm: 178,
    weight_kg: 72,
    preferred_foot: "Right",
    status: "active",
    profile_picture:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=300&h=300&fit=crop&crop=face",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    matches_played: 24,
    sense_score: 82,
    game_time: 1890,
    overall_ability: 78,
    // Additional detailed data
    abilities: {
      technical: 75,
      tactical: 82,
      physical: 70,
      mental: 85,
      creativity: 78,
    },
    stats: {
      goals: 15,
      assists: 8,
      passes_completed: 85,
      tackle_success: 72,
      shots_on_target: 68,
    },
    recent_matches: [
      {
        id: 1,
        date: "2024-01-20",
        opponent: "City Youth",
        result: "W 3-1",
        goals: 2,
        assists: 1,
        rating: 8.5,
      },
      {
        id: 2,
        date: "2024-01-15",
        opponent: "Rovers FC",
        result: "D 2-2",
        goals: 1,
        assists: 0,
        rating: 7.2,
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlayer(mockPlayer);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return <Loading overlay text="" color="blue" variant="gradient-spinner" />;
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Player Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The player you're looking for doesn't exist.
          </p>
          <Link to="/players">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Players
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/players">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Player Profile
                </h1>
                <p className="text-gray-400">
                  Detailed player information and analytics
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link to={`/players/${player.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Player
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Player Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Player Profile Card */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <PlayerAvatar
                    player={player}
                    size="xl"
                    showAbility
                    abilityScore={player.overall_ability}
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {player.name}
                </h2>
                <div className="flex justify-center mb-4">
                  <PlayerStatusBadge status={player.status} />
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Position</span>
                    <span className="text-white font-medium">
                      {player.primary_position}
                    </span>
                  </div>
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
                    <span className="text-gray-400">Nationality</span>
                    <span className="text-white font-medium">
                      {player.nationality}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Height</span>
                    <span className="text-white font-medium">
                      {player.height_cm}cm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Weight</span>
                    <span className="text-white font-medium">
                      {player.weight_kg}kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Preferred Foot</span>
                    <span className="text-white font-medium">
                      {player.preferred_foot}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Performance Overview
              </h3>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {player.sense_score}
                  </div>
                  <div className="text-sm text-gray-400">Sense Score</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {player.matches_played}
                  </div>
                  <div className="text-sm text-gray-400">Matches</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {player.stats?.goals || 0}
                  </div>
                  <div className="text-sm text-gray-400">Goals</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {player.stats?.assists || 0}
                  </div>
                  <div className="text-sm text-gray-400">Assists</div>
                </div>
              </div>

              {/* Ability Radar Chart */}
              <div className="h-64">
                <AbilityRadarChart abilities={player.abilities} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "performance", label: "Performance", icon: Activity },
              { id: "matches", label: "Match History", icon: Trophy },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceMetrics player={player} />
              <MatchHistory matches={player.recent_matches} />
            </div>
          )}

          {activeTab === "performance" && (
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Detailed Performance Metrics
                </h3>
                <div className="text-gray-400">
                  Performance charts and detailed metrics will be displayed
                  here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "matches" && (
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Complete Match History
                </h3>
                <div className="text-gray-400">
                  Full match history with detailed statistics will be displayed
                  here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Advanced Analytics
                </h3>
                <div className="text-gray-400">
                  Advanced analytics and insights will be displayed here.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerDetail;
