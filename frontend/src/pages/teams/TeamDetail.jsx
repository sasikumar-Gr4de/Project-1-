import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Users,
  Trophy,
  Building,
  MapPin,
  User,
  BarChart3,
  Calendar,
  Clock,
  Plus,
  Search,
  Trash2,
  Eye,
  Footprints,
} from "lucide-react";

import TeamAvatar from "@/components/teams/TeamAvatar";
import TeamStatusBadge from "@/components/teams/TeamStatusBadge";
import PlayerAvatar from "@/components/players/PlayerAvatar";
import PlayerStatusBadge from "@/components/players/PlayerStatusBadge";
import DataTable from "@/components/common/DataTable";
import MultiSelectFilter from "@/components/common/MultiSelectFilter";
import { calculateAge } from "@/utils/calculations";
import { ALL_POSITIONS, STATUS_OPTIONS } from "@/utils/constants";
import Loading from "@/components/common/Loading";

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isManagePlayers, setIsManagePlayers] = useState(false);

  // Mock data - in real app, this would come from API
  const mockTeams = [
    {
      id: 1,
      name: "United Academy",
      admin_name: "John Smith",
      tournament: "premier-league",
      organizer: "premier-league",
      location: "Manchester, UK",
      team_mark: "",
      status: "active",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      players: [
        {
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
            "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop&crop=face",
          matches_played: 24,
          sense_score: 82,
          game_time: 1890,
          overall_ability: 78,
        },
        {
          id: 5,
          name: "Alex Turner",
          date_of_birth: "2006-07-11",
          nationality: "Scotland",
          current_club: "United Academy",
          primary_position: "CDM",
          height_cm: 175,
          weight_kg: 70,
          preferred_foot: "Right",
          status: "active",
          profile_picture: null,
          matches_played: 20,
          sense_score: 84,
          game_time: 1650,
          overall_ability: 76,
        },
      ],
    },
  ];

  const mockAllPlayers = [
    {
      id: 2,
      name: "Liam Chen",
      date_of_birth: "2007-08-22",
      nationality: "England",
      current_club: "City Youth",
      primary_position: "CAM",
      height_cm: 172,
      weight_kg: 68,
      preferred_foot: "Left",
      status: "active",
      profile_picture: null,
      matches_played: 18,
      sense_score: 76,
      game_time: 1420,
      overall_ability: 74,
    },
    {
      id: 3,
      name: "Sarah Williams",
      date_of_birth: "2005-12-03",
      nationality: "Wales",
      current_club: "Rovers FC",
      primary_position: "CB",
      height_cm: 165,
      weight_kg: 58,
      preferred_foot: "Right",
      status: "injured",
      profile_picture:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
      matches_played: 15,
      sense_score: 71,
      game_time: 1120,
      overall_ability: 69,
    },
    {
      id: 4,
      name: "James Rodriguez",
      date_of_birth: "2006-03-18",
      nationality: "Spain",
      current_club: "Athletic Youth",
      primary_position: "GK",
      height_cm: 185,
      weight_kg: 78,
      preferred_foot: "Right",
      status: "active",
      profile_picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      matches_played: 22,
      sense_score: 79,
      game_time: 1980,
      overall_ability: 81,
    },
    {
      id: 6,
      name: "Mohamed Hassan",
      date_of_birth: "2005-11-25",
      nationality: "Egypt",
      current_club: "City Youth",
      primary_position: "RW",
      height_cm: 170,
      weight_kg: 65,
      preferred_foot: "Left",
      status: "suspended",
      profile_picture:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      matches_played: 16,
      sense_score: 73,
      game_time: 1280,
      overall_ability: 72,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundTeam = mockTeams.find((t) => t.id === parseInt(id));
      setTeam(foundTeam);
      setAllPlayers(mockAllPlayers);
      setAvailablePlayers(
        mockAllPlayers.filter(
          (player) =>
            !foundTeam?.players?.some(
              (teamPlayer) => teamPlayer.id === player.id
            )
        )
      );
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const formatGameTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const addPlayerToTeam = (player) => {
    if (!team) return;

    const updatedTeam = {
      ...team,
      players: [...team.players, player],
    };
    setTeam(updatedTeam);
    setAvailablePlayers(availablePlayers.filter((p) => p.id !== player.id));
  };

  const removePlayerFromTeam = (player) => {
    if (!team) return;

    const updatedTeam = {
      ...team,
      players: team.players.filter((p) => p.id !== player.id),
    };
    setTeam(updatedTeam);
    setAvailablePlayers([...availablePlayers, player]);
  };

  // Team metrics calculations
  const teamMetrics = team
    ? {
        averageAge:
          team.players.length > 0
            ? Math.round(
                team.players.reduce(
                  (sum, player) => sum + calculateAge(player.date_of_birth),
                  0
                ) / team.players.length
              )
            : 0,
        averageAbility:
          team.players.length > 0
            ? Math.round(
                team.players.reduce(
                  (sum, player) => sum + (player.overall_ability || 0),
                  0
                ) / team.players.length
              )
            : 0,
        totalPlayers: team.players.length,
        totalMatches: team.players.reduce(
          (sum, player) => sum + (player.matches_played || 0),
          0
        ),
        totalGameTime: team.players.reduce(
          (sum, player) => sum + (player.game_time || 0),
          0
        ),
      }
    : null;

  // Filter available players
  const filteredAvailablePlayers = availablePlayers.filter((player) => {
    const matchesSearch =
      searchTerm === "" ||
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      selectedPositions.length === 0 ||
      selectedPositions.includes(player.primary_position);

    const matchesStatus =
      selectedStatus === "all" || player.status === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  // Table columns for team players
  const teamPlayersColumns = [
    { key: "player", title: "Player", width: "30%" },
    { key: "position", title: "Position", width: "15%" },
    { key: "metrics", title: "Metrics", width: "25%" },
    { key: "status", title: "Status", width: "10%" },
    { key: "actions", title: "Actions", width: "20%" },
  ];

  const renderTeamPlayerRow = (player, index) => (
    <tr
      key={player.id}
      className="border-b border-gray-700/50 hover:bg-gray-700/20"
    >
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <PlayerAvatar
            player={player}
            size="md"
            showAbility
            abilityScore={player.overall_ability}
          />
          <div>
            <div className="font-medium text-white">{player.name}</div>
            <div className="text-sm text-gray-400">{player.nationality}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="text-white">
          {ALL_POSITIONS.find((p) => p.value === player.primary_position)
            ?.label || player.primary_position}
        </div>
        <div className="text-sm text-gray-400 flex items-center">
          <Footprints className="h-3 w-3 mr-1" />
          {player.preferred_foot}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-blue-400">
            <BarChart3 className="h-3 w-3 mr-1" />
            Sense:{" "}
            <span className="font-medium ml-1">{player.sense_score}</span>
          </div>
          <div className="flex items-center text-sm text-green-400">
            <Calendar className="h-3 w-3 mr-1" />
            Matches:{" "}
            <span className="font-medium ml-1">{player.matches_played}</span>
          </div>
          <div className="flex items-center text-sm text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Played:{" "}
            <span className="font-medium ml-1">
              {formatGameTime(player.game_time)}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <PlayerStatusBadge status={player.status} />
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-end space-x-2">
          <Link to={`/players/${player.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePlayerFromTeam(player)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  // Table columns for available players
  const availablePlayersColumns = [
    { key: "player", title: "Player", width: "30%" },
    { key: "position", title: "Position", width: "15%" },
    { key: "current_club", title: "Current Club", width: "20%" },
    { key: "metrics", title: "Metrics", width: "20%" },
    { key: "actions", title: "Actions", width: "15%" },
  ];

  const renderAvailablePlayerRow = (player, index) => (
    <tr
      key={player.id}
      className="border-b border-gray-700/50 hover:bg-gray-700/20"
    >
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <PlayerAvatar
            player={player}
            size="md"
            showAbility
            abilityScore={player.overall_ability}
          />
          <div>
            <div className="font-medium text-white">{player.name}</div>
            <div className="text-sm text-gray-400">{player.nationality}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="text-white">
          {ALL_POSITIONS.find((p) => p.value === player.primary_position)
            ?.label || player.primary_position}
        </div>
      </td>
      <td className="py-4 px-6 text-white">{player.current_club}</td>
      <td className="py-4 px-6">
        <div className="space-y-1">
          <div className="text-sm text-blue-400">
            Ability:{" "}
            <span className="font-medium">{player.overall_ability}</span>
          </div>
          <div className="text-sm text-green-400">
            Sense: <span className="font-medium">{player.sense_score}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <Button
          size="sm"
          onClick={() => addPlayerToTeam(player)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <Loading
        overlay
        text="Loading team..."
        color="blue"
        variant="gradient-spinner"
      />
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Team Not Found</h2>
          <p className="text-gray-400 mb-4">
            The team you're looking for doesn't exist.
          </p>
          <Link to="/teams">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
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
              <Link to="/teams">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teams
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <TeamAvatar
                  team={team}
                  size="lg"
                  showStats
                  playerCount={team.players.length}
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">{team.name}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <TeamStatusBadge status={team.status} />
                    <span className="text-gray-400 text-sm">
                      {team.players.length} players
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsManagePlayers(!isManagePlayers)}
              className={
                isManagePlayers
                  ? "bg-gray-600 hover:bg-gray-700  text-teal-50"
                  : "bg-blue-600 hover:bg-blue-700  text-teal-50"
              }
            >
              <Users className="h-4 w-4 mr-2" />
              {isManagePlayers ? "View Team" : "Manage Players"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isManagePlayers ? (
          /* Team Overview */
          <div className="space-y-6">
            {/* Team Info Card */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center  text-teal-50">
                  <Users className="h-5 w-5 mr-2" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span>Team Admin</span>
                    </div>
                    <div className="text-white font-medium">
                      {team.admin_name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>Tournament</span>
                    </div>
                    <div className="text-white font-medium">
                      {team.tournament}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Building className="h-4 w-4 mr-2" />
                      <span>Organizer</span>
                    </div>
                    <div className="text-white font-medium">
                      {team.organizer}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Location</span>
                    </div>
                    <div className="text-white font-medium">
                      {team.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Metrics */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center  text-teal-50">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400">
                      {teamMetrics.averageAbility}
                    </div>
                    <div className="text-sm text-gray-400">Average Ability</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-green-400">
                      {teamMetrics.averageAge}
                    </div>
                    <div className="text-sm text-gray-400">Average Age</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400">
                      {teamMetrics.totalPlayers}
                    </div>
                    <div className="text-sm text-gray-400">Total Players</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400">
                      {teamMetrics.totalMatches}
                    </div>
                    <div className="text-sm text-gray-400">Total Matches</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Players */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between  text-teal-50">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Players ({team.players.length})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={teamPlayersColumns}
                  data={team.players}
                  pageSize={10}
                  renderRow={renderTeamPlayerRow}
                  emptyMessage="No players in this team"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Manage Players */
          <div className="space-y-6">
            {/* Current Team Players */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-teal-50">
                  <Users className="h-5 w-5 mr-2" />
                  Current Team Players ({team.players.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={teamPlayersColumns}
                  data={team.players}
                  pageSize={5}
                  renderRow={renderTeamPlayerRow}
                  emptyMessage="No players in this team"
                />
              </CardContent>
            </Card>

            {/* Available Players */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-betwee text-teal-50">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Available Players ({availablePlayers.length})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search available players..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <MultiSelectFilter
                        options={ALL_POSITIONS}
                        selectedValues={selectedPositions}
                        onChange={setSelectedPositions}
                        placeholder="Filter by positions..."
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          {/* <SelectItem value="all">All Status</SelectItem> */}
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Available Players Table */}
                <DataTable
                  columns={availablePlayersColumns}
                  data={filteredAvailablePlayers}
                  pageSize={10}
                  renderRow={renderAvailablePlayerRow}
                  emptyMessage="No available players found"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamDetail;
