import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Users,
  Calendar,
  MapPin,
  Footprints,
  Grid,
  Table,
  BarChart3,
  Clock,
} from "lucide-react";

import PlayerForm from "@/components/players/PlayerForm";
import DeletePlayerModal from "@/components/players/DeletePlayerModal";
import PlayerStatusBadge from "@/components/players/PlayerStatusBadge";
import PlayerAvatar from "@/components/players/PlayerAvatar";
import DataTable from "@/components/common/DataTable";
import MultiSelectFilter from "@/components/common/MultiSelectFilter";
import PlayerCard from "@/components/players/PlayerCard";
import Loading from "@/components/common/Loading";
import GridView from "@/components/common/GridView";

import { ALL_POSITIONS, STATUS_OPTIONS } from "@/utils/constants";

import { calculateAge } from "@/utils/calculations";
import { formatGameTime } from "@/utils/formatters";
import { usePlayersStore } from "@/store/players.store";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
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

  const { getAllPlayers, addNewPlayer, updatePlayer } = usePlayersStore();

  // Fetch players on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllPlayers();
        setPlayers(data);
        const teams = Array.from(
          new Set(data.map((player) => player.current_club))
        ).map((team) => ({ label: team, value: team }));
        console.log("Derived teams:", teams);
        setTeams(teams);
        setFilteredPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [getAllPlayers]);

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

  const handleSavePlayer = async (playerData) => {
    if (selectedPlayer) {
      // Update existing player
      const res = await updatePlayer(selectedPlayer.id, playerData);
      const { success, data } = res;

      if (success) {
        setPlayers(
          players.map((p) => (p.id === selectedPlayer.id ? { ...data } : p))
        );
      }
    } else {
      // Add new player
      const res = await addNewPlayer(playerData);
      const { success, data } = res;
      if (success) {
        setPlayers([...players, data]);
      }
    }
    setIsFormOpen(false);
    setSelectedPlayer(null);
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
          <div className="flex items-center text-sm  text-blue-400">
            <BarChart3 className="h-3 w-3 mr-1" />
            Sense:{" "}
            <span className="font-medium ml-1">{player.sense_score}</span>
          </div>
          <div className="flex items-center text-sm  text-green-400">
            <Calendar className="h-3 w-3 mr-1" />
            Matches:{" "}
            <span className="font-medium ml-1">{player.matches_played}</span>
          </div>
          <div className="flex items-center text-sm  text-yellow-400">
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

  // Render grid item for reusable GridView
  const renderGridItem = (player) => (
    <PlayerCard
      key={player.id}
      player={player}
      onEdit={handleEdit}
      onDelete={handleDelete}
      calculateAge={calculateAge}
      formatGameTime={formatGameTime}
    />
  );

  // Empty state action for GridView
  const emptyAction = (
    <Button
      onClick={handleAddPlayer}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Player
    </Button>
  );

  if (isLoading) {
    return <Loading overlay text="" color="blue" variant="cyberpunk-scan" />;
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
          <GridView
            data={filteredPlayers}
            renderItem={renderGridItem}
            emptyMessage="No players found"
            emptyIcon={Users}
            emptyAction={emptyAction}
            pageSize={12}
            columns={{
              sm: 1,
              md: 2,
              lg: 3,
              xl: 4,
              "2xl": 4,
            }}
            onPageChange={setCurrentPage}
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

export default Players;
