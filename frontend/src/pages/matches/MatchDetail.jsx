import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  ArrowLeft,
  Play,
  Video,
  Download,
  Share2,
  Calendar,
  Trophy,
  Users,
  BarChart3,
  Target,
  Zap,
  Crosshair,
  Shield,
  GitMerge,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Square,
  Flag,
} from "lucide-react";

import TeamAvatar from "../../components/teams/TeamAvatar";
import MatchStatusBadge from "../../components/matches/MatchStatusBadge";
import PlayerAvatar from "../../components/players/PlayerAvatar";
import Loading from "@/components/common/Loading";
import FootballPitch from "@/components/matches/FootballPitch";

const MatchDetail = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data with comprehensive match details
  const mockMatchDetail = {
    id: 1,
    team_a_id: 1,
    team_b_id: 2,
    team_a_name: "United Academy",
    team_b_name: "City Youth",
    team_a_logo: "",
    team_b_logo:
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&h=150&fit=crop&crop=center",
    tournament_name: "premier-league",
    match_day: 1,
    match_date: "2024-03-15T15:00:00",
    status: "completed",
    team_a_score: 2,
    team_b_score: 1,
    video_url: "https://example.com/match-video.mp4",

    // Match Statistics
    statistics: {
      possession: { team_a: 58, team_b: 42 },
      expectedGoals: { team_a: 2.3, team_b: 1.1 },
      senseImpactScore: { team_a: 85, team_b: 72 },
      totalShots: { team_a: 15, team_b: 8 },
      shotsOnTarget: { team_a: 6, team_b: 3 },
      passAccuracy: { team_a: 87, team_b: 78 },
      corners: { team_a: 5, team_b: 3 },
      fouls: { team_a: 12, team_b: 15 },
      offsides: { team_a: 2, team_b: 4 },
      yellowCards: { team_a: 2, team_b: 3 },
      redCards: { team_a: 0, team_b: 1 },
    },

    // Match Events
    events: [
      {
        id: 1,
        type: "goal",
        minute: 23,
        team: "team_a",
        player: "Marcus Johnson",
        assist: "Alex Turner",
        description: "Left-footed shot from outside the box",
      },
      {
        id: 2,
        type: "yellow_card",
        minute: 34,
        team: "team_b",
        player: "Liam Chen",
        description: "Late tackle",
      },
      {
        id: 3,
        type: "goal",
        minute: 51,
        team: "team_b",
        player: "Mohamed Hassan",
        assist: "Liam Chen",
        description: "Header from corner",
      },
      {
        id: 4,
        type: "substitution",
        minute: 65,
        team: "team_a",
        player_out: "Alex Turner",
        player_in: "James Wilson",
        description: "Tactical change",
      },
      {
        id: 5,
        type: "yellow_card",
        minute: 72,
        team: "team_a",
        player: "Sarah Williams",
        description: "Professional foul",
      },
      {
        id: 6,
        type: "goal",
        minute: 84,
        team: "team_a",
        player: "Marcus Johnson",
        assist: null,
        description: "Penalty kick",
      },
      {
        id: 7,
        type: "red_card",
        minute: 89,
        team: "team_b",
        player: "David Brown",
        description: "Second yellow card",
      },
    ],

    // Team Lineups
    lineups: {
      team_a: [
        {
          id: 1,
          name: "Marcus Johnson",
          position: "ST",
          number: 9,
          is_captain: true,
        },
        {
          id: 5,
          name: "Alex Turner",
          position: "CDM",
          number: 6,
          is_captain: false,
        },
        {
          id: 7,
          name: "Sarah Williams",
          position: "CB",
          number: 4,
          is_captain: false,
        },
        {
          id: 8,
          name: "James Wilson",
          position: "GK",
          number: 1,
          is_captain: false,
        },
        {
          id: 9,
          name: "Michael Brown",
          position: "RB",
          number: 2,
          is_captain: false,
        },
        {
          id: 10,
          name: "Thomas Green",
          position: "LB",
          number: 3,
          is_captain: false,
        },
        {
          id: 11,
          name: "Robert White",
          position: "CM",
          number: 8,
          is_captain: false,
        },
        {
          id: 12,
          name: "Daniel Black",
          position: "CM",
          number: 10,
          is_captain: false,
        },
        {
          id: 13,
          name: "Paul Gray",
          position: "RW",
          number: 7,
          is_captain: false,
        },
        {
          id: 14,
          name: "Kevin Blue",
          position: "LW",
          number: 11,
          is_captain: false,
        },
        {
          id: 15,
          name: "Steven Yellow",
          position: "CB",
          number: 5,
          is_captain: false,
        },
      ],
      team_b: [
        {
          id: 2,
          name: "Liam Chen",
          position: "CAM",
          number: 10,
          is_captain: true,
        },
        {
          id: 6,
          name: "Mohamed Hassan",
          position: "RW",
          number: 7,
          is_captain: false,
        },
        {
          id: 16,
          name: "David Brown",
          position: "CB",
          number: 4,
          is_captain: false,
        },
        {
          id: 17,
          name: "Chris Lee",
          position: "GK",
          number: 1,
          is_captain: false,
        },
        {
          id: 18,
          name: "Sam Wilson",
          position: "RB",
          number: 2,
          is_captain: false,
        },
        {
          id: 19,
          name: "Jordan Smith",
          position: "LB",
          number: 3,
          is_captain: false,
        },
        {
          id: 20,
          name: "Taylor Davis",
          position: "CDM",
          number: 6,
          is_captain: false,
        },
        {
          id: 21,
          name: "Morgan King",
          position: "CM",
          number: 8,
          is_captain: false,
        },
        {
          id: 22,
          name: "Casey Johnson",
          position: "LW",
          number: 11,
          is_captain: false,
        },
        {
          id: 23,
          name: "Riley Martinez",
          position: "ST",
          number: 9,
          is_captain: false,
        },
        {
          id: 24,
          name: "Jamie Garcia",
          position: "CB",
          number: 5,
          is_captain: false,
        },
      ],
    },

    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMatch(mockMatchDetail);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "goal":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "yellow_card":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "red_card":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "substitution":
        return <Swap className="h-4 w-4 text-blue-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case "goal":
        return "bg-green-500/20 border-green-500/30";
      case "yellow_card":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "red_card":
        return "bg-red-500/20 border-red-500/30";
      case "substitution":
        return "bg-blue-500/20 border-blue-500/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  };

  // Statistics configuration
  const statisticsConfig = [
    {
      key: "possession",
      label: "Possession",
      icon: GitMerge,
      format: "percentage",
    },
    {
      key: "expectedGoals",
      label: "Expected Goals (xG)",
      icon: Target,
      format: "decimal",
    },
    {
      key: "senseImpactScore",
      label: "Sense Impact",
      icon: Zap,
      format: "number",
    },
    {
      key: "totalShots",
      label: "Total Shots",
      icon: Crosshair,
      format: "number",
    },
    {
      key: "shotsOnTarget",
      label: "Shots on Target",
      icon: Target,
      format: "number",
    },
    {
      key: "passAccuracy",
      label: "Pass Accuracy",
      icon: GitMerge,
      format: "percentage",
    },
    { key: "corners", label: "Corners", icon: Square, format: "number" },
    { key: "fouls", label: "Fouls", icon: AlertTriangle, format: "number" },
    { key: "offsides", label: "Offsides", icon: Flag, format: "number" },
    {
      key: "yellowCards",
      label: "Yellow Cards",
      icon: AlertTriangle,
      format: "number",
    },
    { key: "redCards", label: "Red Cards", icon: XCircle, format: "number" },
  ];

  const formatStatValue = (value, format) => {
    switch (format) {
      case "percentage":
        return `${value}%`;
      case "decimal":
        return value.toFixed(1);
      default:
        return value;
    }
  };

  const StatRow = ({
    label,
    teamAValue,
    teamBValue,
    icon: Icon,
    format = "number",
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-3 w-1/3">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className="flex items-center justify-between w-2/3">
        <span className="text-lg font-bold text-white w-16 text-right">
          {formatStatValue(teamAValue, format)}
        </span>
        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${(teamAValue / (teamAValue + teamBValue)) * 100}%`,
              }}
            />
          </div>
        </div>
        <span className="text-lg font-bold text-white w-16 text-left">
          {formatStatValue(teamBValue, format)}
        </span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Loading
        overlay
        text="Loading match details..."
        color="blue"
        variant="gradient-spinner"
      />
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Match Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The match you're looking for doesn't exist.
          </p>
          <Link to="/matches">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matches
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/matches">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Matches
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Match Details</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <MatchStatusBadge status={match.status} />
                  <span className="text-gray-400 text-sm">
                    {formatMatchDate(match.match_date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {match.video_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Video
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {/* Team A */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <div className="text-right">
                <div className="font-bold text-white text-xl">
                  {match.team_a_name}
                </div>
                <div className="text-gray-400 text-sm">Home Team</div>
              </div>
              <TeamAvatar
                team={{ team_mark: match.team_a_logo, name: match.team_a_name }}
                size="xl"
              />
            </div>

            {/* Score */}
            <div className="mx-8 text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {match.team_a_score} - {match.team_b_score}
              </div>
              <div className="text-gray-400 flex items-center justify-center">
                <Trophy className="h-4 w-4 mr-1" />
                {match.tournament_name} • Matchday {match.match_day}
              </div>
            </div>

            {/* Team B */}
            <div className="flex items-center space-x-4 flex-1">
              <TeamAvatar
                team={{ team_mark: match.team_b_logo, name: match.team_b_name }}
                size="xl"
              />
              <div className="text-left">
                <div className="font-bold text-white text-xl">
                  {match.team_b_name}
                </div>
                <div className="text-gray-400 text-sm">Away Team</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1 text-white">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-blue-600"
            >
              <Zap className="h-4 w-4 mr-2" />
              Match Events
            </TabsTrigger>
            <TabsTrigger
              value="lineups"
              className="data-[state=active]:bg-blue-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Lineups
            </TabsTrigger>
          </TabsList>
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Statistics */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Match Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vertical Statistics Comparison */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-white">
                        {match.team_a_name}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {match.team_b_name}
                      </span>
                    </div>
                    {statisticsConfig.map((stat) => (
                      <StatRow
                        key={stat.key}
                        label={stat.label}
                        teamAValue={match.statistics[stat.key]?.team_a || 0}
                        teamBValue={match.statistics[stat.key]?.team_b || 0}
                        icon={stat.icon}
                        format={stat.format}
                      />
                    ))}
                  </div>

                  {/* Charts and Visualizations */}
                  <div className="space-y-6">
                    {/* Possession Chart */}
                    <Card className="bg-gray-700/30 border border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">
                          Possession Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between h-8 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 flex items-center justify-start pl-2 text-white text-sm font-medium"
                            style={{
                              width: `${match.statistics.possession.team_a}%`,
                            }}
                          >
                            {match.statistics.possession.team_a}%
                          </div>
                          <div
                            className="h-full bg-red-500 flex items-center justify-end pr-2 text-white text-sm font-medium"
                            style={{
                              width: `${match.statistics.possession.team_b}%`,
                            }}
                          >
                            {match.statistics.possession.team_b}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shots Comparison */}
                    <Card className="bg-gray-700/30 border border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">
                          Shots Comparison
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">
                              Total Shots
                            </span>
                            <div className="flex items-center space-x-4">
                              <span className="text-white font-bold">
                                {match.statistics.totalShots.team_a}
                              </span>
                              <span className="text-gray-400">-</span>
                              <span className="text-white font-bold">
                                {match.statistics.totalShots.team_b}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">
                              Shots on Target
                            </span>
                            <div className="flex items-center space-x-4">
                              <span className="text-white font-bold">
                                {match.statistics.shotsOnTarget.team_a}
                              </span>
                              <span className="text-gray-400">-</span>
                              <span className="text-white font-bold">
                                {match.statistics.shotsOnTarget.team_b}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance Summary */}
                    <Card className="bg-gray-700/30 border border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">
                          Performance Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-semibold text-white mb-2">
                              {match.team_a_name}
                            </h4>
                            <ul className="text-gray-300 space-y-1">
                              <li>
                                • Dominated possession with{" "}
                                {match.statistics.possession.team_a}%
                              </li>
                              <li>
                                • Higher xG of{" "}
                                {match.statistics.expectedGoals.team_a}
                              </li>
                              <li>
                                • Better pass accuracy (
                                {match.statistics.passAccuracy.team_a}%)
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-2">
                              {match.team_b_name}
                            </h4>
                            <ul className="text-gray-300 space-y-1">
                              <li>
                                • More aggressive with{" "}
                                {match.statistics.fouls.team_b} fouls
                              </li>
                              <li>• Better shot conversion rate</li>
                              <li>• Strong defensive pressure</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Match Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="h-5 w-5 mr-2" />
                  Match Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {match.events.map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${getEventColor(
                        event.type
                      )}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getEventIcon(event.type)}
                          <span className="text-white font-medium">
                            {event.minute}'
                          </span>
                        </div>
                        <div className="text-white">
                          {event.type === "goal" && (
                            <span>
                              <strong>{event.player}</strong>
                              {event.assist && ` (assist: ${event.assist})`}
                              {event.description && ` - ${event.description}`}
                            </span>
                          )}
                          {event.type === "yellow_card" && (
                            <span>
                              <strong>{event.player}</strong> - Yellow Card{" "}
                              {event.description && `- ${event.description}`}
                            </span>
                          )}
                          {event.type === "red_card" && (
                            <span>
                              <strong>{event.player}</strong> - Red Card{" "}
                              {event.description && `- ${event.description}`}
                            </span>
                          )}
                          {event.type === "substitution" && (
                            <span>
                              <strong>{event.player_out}</strong> ⬅️{" "}
                              <strong>{event.player_in}</strong>
                              {event.description && ` - ${event.description}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {event.team === "team_a"
                          ? match.team_a_name
                          : match.team_b_name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Lineups Tab */}

          <TabsContent value="lineups" className="space-y-6">
            <FootballPitch
              match={match}
              formation={{ team_a: "4-3-3", team_b: "4-2-3-1" }}
              onFormationChange={(team, newFormation) =>
                console.log(`Team ${team} formation changed to:`, newFormation)
              }
              onPlayerMove={(playerId, fromSlot, toSlot) =>
                console.log("Player moved:", playerId, fromSlot, toSlot)
              }
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Swap icon component
const Swap = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
  </svg>
);

export default MatchDetail;
