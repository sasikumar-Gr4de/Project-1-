// pages/Players.jsx
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
} from "lucide-react";
import PlayerForm from "../../components/players/PlayerForm";
import DeletePlayerModal from "../../components/players/DeletePlayerModal";
import PlayerStatusBadge from "../../components/players/PlayerStatusBadge";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data with profile pictures
  const mockPlayers = [
    {
      id: 1,
      name: "Marcus Johnson",
      date_of_birth: "2006-05-15",
      nationality: "England",
      current_club: "United Academy",
      primary_position: "Forward",
      height_cm: 178,
      weight_kg: 72,
      preferred_foot: "Right",
      status: "active",
      profile_picture:
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop&crop=face",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Liam Chen",
      date_of_birth: "2007-08-22",
      nationality: "England",
      current_club: "City Youth",
      primary_position: "Midfielder",
      height_cm: 172,
      weight_kg: 68,
      preferred_foot: "Left",
      status: "active",
      profile_picture: null, // No profile picture
      created_at: "2024-01-14T09:30:00Z",
      updated_at: "2024-01-14T09:30:00Z",
    },
    {
      id: 3,
      name: "Sarah Williams",
      date_of_birth: "2005-12-03",
      nationality: "Wales",
      current_club: "Rovers FC",
      primary_position: "Defender",
      height_cm: 165,
      weight_kg: 58,
      preferred_foot: "Right",
      status: "injured",
      profile_picture:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
      created_at: "2024-01-13T14:20:00Z",
      updated_at: "2024-01-13T14:20:00Z",
    },
    {
      id: 4,
      name: "James Rodriguez",
      date_of_birth: "2006-03-18",
      nationality: "Spain",
      current_club: "Athletic Youth",
      primary_position: "Goalkeeper",
      height_cm: 185,
      weight_kg: 78,
      preferred_foot: "Right",
      status: "active",
      profile_picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      created_at: "2024-01-12T11:45:00Z",
      updated_at: "2024-01-12T11:45:00Z",
    },
  ];

  const positions = [
    "All Positions",
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
  ];

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
  }, [searchTerm, selectedPosition, players]);

  const filterPlayers = () => {
    let filtered = players;

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

    if (selectedPosition !== "all") {
      filtered = filtered.filter(
        (player) => player.primary_position === selectedPosition
      );
    }

    setFilteredPlayers(filtered);
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

  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setIsFormOpen(true);
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
      };
      setPlayers([...players, newPlayer]);
    }
    setIsFormOpen(false);
    setSelectedPlayer(null);
  };

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
        {/* Filters and Search */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
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
                <Select
                  onValueChange={(value) => setSelectedPosition(value)}
                  defaultValue={selectedPosition}
                >
                  <SelectTrigger className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>

                  <SelectContent className="bg-gray-800 border border-gray-600 text-white">
                    {positions.map((position) => (
                      <SelectItem
                        key={position}
                        value={position === "All Positions" ? "all" : position}
                      >
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">
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
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <PlayersGridView
            players={filteredPlayers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            calculateAge={calculateAge}
            onAddPlayer={handleAddPlayer}
          />
        ) : (
          <PlayersTableView
            players={filteredPlayers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            calculateAge={calculateAge}
            onAddPlayer={handleAddPlayer}
          />
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

// Grid View Component
const PlayersGridView = ({
  players,
  onEdit,
  onDelete,
  calculateAge,
  onAddPlayer,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onEdit={onEdit}
          onDelete={onDelete}
          calculateAge={calculateAge}
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

// Table View Component
const PlayersTableView = ({
  players,
  onEdit,
  onDelete,
  calculateAge,
  onAddPlayer,
}) => {
  const [showActions, setShowActions] = useState(null);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Player
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Position
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Club
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Age
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Nationality
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <PlayerAvatar player={player} size="md" />
                      <div>
                        <div className="font-medium text-white">
                          {player.name}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Ruler className="h-3 w-3 mr-1" />
                          {player.height_cm}cm • {player.weight_kg}kg
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white">{player.primary_position}</div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Footprints className="h-3 w-3 mr-1" />
                      {player.preferred_foot}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {player.current_club}
                  </td>
                  <td className="py-4 px-6 text-white">
                    {calculateAge(player.date_of_birth)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-white">
                      <MapPin className="h-3 w-3 mr-1" />
                      {player.nationality}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <PlayerStatusBadge status={player.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(player)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(player)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {players.length === 0 && (
          <div className="p-12 text-center">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Player Avatar Component
const PlayerAvatar = ({ player, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden`}
    >
      {player.profile_picture ? (
        <img
          src={player.profile_picture}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <Users className="h-1/2 w-1/2 text-white" />
      )}
    </div>
  );
};

// Player Card Component (for grid view)
const PlayerCard = ({ player, onEdit, onDelete, calculateAge }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
      <CardContent className="p-6">
        {/* Header with Avatar and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <PlayerAvatar player={player} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
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
                <button
                  onClick={() => {
                    onEdit(player);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-t-lg"
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

        {/* Status */}
        <div className="mb-4">
          <PlayerStatusBadge status={player.status} />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Club</span>
            <span className="text-sm text-white font-medium">
              {player.current_club}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Position</span>
            <span className="text-sm text-white font-medium">
              {player.primary_position}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Age</span>
            <span className="text-sm text-white font-medium">
              {calculateAge(player.date_of_birth)} years
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Height</span>
            <span className="text-sm text-white font-medium flex items-center">
              <Ruler className="h-3 w-3 mr-1" />
              {player.height_cm}cm
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Weight</span>
            <span className="text-sm text-white font-medium flex items-center">
              <Scale className="h-3 w-3 mr-1" />
              {player.weight_kg}kg
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Preferred Foot</span>
            <span className="text-sm text-white font-medium flex items-center">
              <Footprints className="h-3 w-3 mr-1" />
              {player.preferred_foot}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => onEdit(player)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Players;
