import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Users,
  Calendar,
  MapPin,
  Ruler,
  Scale,
  Footprints,
  Grid,
  Table,
  Image,
  BarChart3,
  Clock,
} from "lucide-react";

import PlayerForm from "../../components/players/PlayerForm";
import DeletePlayerModal from "../../components/players/DeletePlayerModal";
import PlayerStatusBadge from "../../components/players/PlayerStatusBadge";
import PlayerAvatar from "../../components/players/PlayerAvatar";
import DataTable from "../../components/common/DataTable";
import MultiSelectFilter from "../../components/common/MultiSelectFilter";
import PlayerCard from "../../components/players/PlayerCard";

import {
  DETAILED_POSITIONS,
  ALL_POSITIONS,
  STATUS_OPTIONS,
} from "../../utils/constants";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Enhanced mock data with additional fields
  const mockPlayers = [
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
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      matches_played: 24,
      sense_score: 82,
      game_time: 1890,
      overall_ability: 78,
    },
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
      created_at: "2024-01-14T09:30:00Z",
      updated_at: "2024-01-14T09:30:00Z",
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
      created_at: "2024-01-13T14:20:00Z",
      updated_at: "2024-01-13T14:20:00Z",
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
      created_at: "2024-01-12T11:45:00Z",
      updated_at: "2024-01-12T11:45:00Z",
      matches_played: 22,
      sense_score: 79,
      game_time: 1980,
      overall_ability: 81,
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
      created_at: "2024-01-11T08:15:00Z",
      updated_at: "2024-01-11T08:15:00Z",
      matches_played: 20,
      sense_score: 84,
      game_time: 1650,
      overall_ability: 76,
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
      created_at: "2024-01-10T16:45:00Z",
      updated_at: "2024-01-10T16:45:00Z",
      matches_played: 16,
      sense_score: 73,
      game_time: 1280,
      overall_ability: 72,
    },
  ];

  const teams = Array.from(new Set(mockPlayers.map((p) => p.current_club))).map(
    (club) => ({
      value: club,
      label: club,
    })
  );

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlayers(mockPlayers);
      setFilteredPlayers(mockPlayers);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [searchTerm, selectedPositions, selectedStatus, selectedTeams, players]);

  const filterPlayers = () => {
    let filtered = players;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.current_club
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Position filter (multiple select)
    if (selectedPositions.length > 0) {
      filtered = filtered.filter((player) =>
        selectedPositions.includes(player.primary_position)
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((player) => player.status === selectedStatus);
    }

    // Team filter (multiple select)
    if (selectedTeams.length > 0) {
      filtered = filtered.filter((player) =>
        selectedTeams.includes(player.current_club)
      );
    }

    setFilteredPlayers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Missing functions - Added here
  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (player) => {
    setSelectedPlayer(player);
    setIsFormOpen(true);
  };

  const handleDelete = (player) => {
    setSelectedPlayer(player);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPlayer) {
      setPlayers(players.filter((p) => p.id !== selectedPlayer.id));
      setIsDeleteModalOpen(false);
      setSelectedPlayer(null);
    }
  };

  const handleSavePlayer = (playerData) => {
    if (selectedPlayer) {
      // Update existing player
      setPlayers(
        players.map((p) =>
          p.id === selectedPlayer.id
            ? {
                ...playerData,
                id: selectedPlayer.id,
                updated_at: new Date().toISOString(),
                // Preserve performance data if not in form
                matches_played: selectedPlayer.matches_played,
                sense_score: selectedPlayer.sense_score,
                game_time: selectedPlayer.game_time,
                overall_ability: selectedPlayer.overall_ability,
              }
            : p
        )
      );
    } else {
      // Add new player
      const newPlayer = {
        ...playerData,
        id: Math.max(...players.map((p) => p.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        // Default performance data for new players
        matches_played: 0,
        sense_score: 0,
        game_time: 0,
        overall_ability: 0,
      };
      setPlayers([...players, newPlayer]);
    }
    setIsFormOpen(false);
    setSelectedPlayer(null);
  };

  // Calculate age function
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

  // Format game time to hours and minutes
  const formatGameTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Table columns configuration
  const tableColumns = [
    { key: "player", title: "Player", width: "25%" },
    { key: "position", title: "Position", width: "15%" },
    { key: "club", title: "Club", width: "15%" },
    { key: "metrics", title: "Metrics", width: "20%" },
    { key: "status", title: "Status", width: "10%" },
    { key: "actions", title: "Actions", width: "15%" },
  ];

  // Render table row
  const renderTableRow = (player, index) => (
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
            <div className="text-sm text-gray-400 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {player.nationality}
            </div>
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
      <td className="py-4 px-6 text-white">{player.current_club}</td>
      <td className="py-4 px-6">
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <BarChart3 className="h-3 w-3 mr-1 text-blue-400" />
            Sense:{" "}
            <span className="font-medium ml-1">{player.sense_score}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-3 w-3 mr-1 text-green-400" />
            Matches:{" "}
            <span className="font-medium ml-1">{player.matches_played}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-3 w-3 mr-1 text-yellow-400" />
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
            onClick={() => handleEdit(player)}
            className="text-gray-400 hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(player)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Users className="h-6 w-6 mr-3 text-blue-400" />
                Player Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your team's player profiles and information
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={handleAddPlayer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filters */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search and View Toggle */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search players by name, club, or nationality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full h-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400 hidden sm:block">
                    Showing {filteredPlayers.length} of {players.length} players
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-blue-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "table"
                          ? "bg-blue-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Table className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-select Filters - Single Row */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex-1 min-w-0">
                  <MultiSelectFilter
                    options={ALL_POSITIONS}
                    selectedValues={selectedPositions}
                    onChange={setSelectedPositions}
                    placeholder="Filter by positions..."
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <MultiSelectFilter
                    options={teams}
                    selectedValues={selectedTeams}
                    onChange={setSelectedTeams}
                    placeholder="Filter by teams..."
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile counter */}
                <div className="text-sm text-gray-400 block sm:hidden w-full text-center pt-2">
                  Showing {filteredPlayers.length} of {players.length} players
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <PlayersGridView
            players={filteredPlayers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            calculateAge={calculateAge}
            formatGameTime={formatGameTime}
            onAddPlayer={handleAddPlayer}
          />
        ) : (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-0">
              <DataTable
                columns={tableColumns}
                data={filteredPlayers}
                pageSize={10}
                renderRow={renderTableRow}
                emptyMessage="No players found matching your filters"
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modals */}
      <PlayerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPlayer(null);
        }}
        onSave={handleSavePlayer}
        player={selectedPlayer}
      />

      <DeletePlayerModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPlayer(null);
        }}
        onConfirm={confirmDelete}
        player={selectedPlayer}
      />
    </div>
  );
};

// Enhanced Grid View Component
const PlayersGridView = ({
  players,
  onEdit,
  onDelete,
  calculateAge,
  formatGameTime,
  onAddPlayer,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onEdit={onEdit}
          onDelete={onDelete}
          calculateAge={calculateAge}
          formatGameTime={formatGameTime}
        />
      ))}

      {players.length === 0 && (
        <div className="col-span-full">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No players found
              </h3>
              <p className="text-gray-400 mb-4">
                Get started by adding your first player
              </p>
              <Button
                onClick={onAddPlayer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Players;
