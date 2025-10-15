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
} from "lucide-react";
import PlayerForm from "../../components/players/PlayerForm";
import DeletePlayerModal from "../../components/players/DeletePlayerModal";
import PlayerStatusBadge from "../../components/players/PlayerStatusBadge";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search players by name, club, or nationality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {positions.map((position) => (
                    <option
                      key={position}
                      value={position === "All Positions" ? "all" : position}
                    >
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-400">
                Showing {filteredPlayers.length} of {players.length} players
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={handleEdit}
              onDelete={handleDelete}
              calculateAge={calculateAge}
            />
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No players found
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || selectedPosition !== "all"
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first player"}
              </p>
              <Button
                onClick={handleAddPlayer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
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

// Player Card Component
const PlayerCard = ({ player, onEdit, onDelete, calculateAge }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {player.name}
            </h3>
            <p className="text-sm text-gray-400 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {player.nationality}
            </p>
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
