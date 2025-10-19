import React, { useState, useEffect } from "react";
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
  Trophy,
  Calendar,
  Users,
  Building,
  MapPin,
  Grid,
  Table,
  BarChart3,
  Clock,
  Award,
} from "lucide-react";

import TournamentForm from "@/components/tournaments/TournamentForm";
import DeleteTournamentModal from "@/components/tournaments/DeleteTournamentModal";
import TournamentStatusBadge from "@/components/tournaments/TournamentStatusBadge";
import TournamentAvatar from "@/components/tournaments/TournamentAvatar";
import DataTable from "@/components/common/DataTable";
import GridView from "@/components/common/GridView";
import MultiSelectFilter from "@/components/common/MultiSelectFilter";
import TournamentCard from "@/components/tournaments/TournamentCard";

import {
  TOURNAMENT_OPTIONS,
  ORGANIZER_OPTIONS,
  MATCH_STATUS_OPTIONS,
} from "@/utils/constants";

import Loading from "@/components/common/Loading";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for tournaments
  const mockTournaments = [
    {
      id: 1,
      name: "Premier League U18",
      organizer: "premier-league",
      location: "England",
      season: "2024/25",
      start_date: "2024-08-15",
      end_date: "2025-05-15",
      teams_count: 20,
      matches_played: 180,
      status: "upcoming",
      logo: "",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      description: "Premier League Under 18 Youth Tournament",
    },
    {
      id: 2,
      name: "FA Youth Cup",
      organizer: "fa",
      location: "England",
      season: "2023/24",
      start_date: "2023-09-01",
      end_date: "2024-05-30",
      teams_count: 64,
      matches_played: 63,
      status: "live",
      logo: "",
      created_at: "2023-08-20T09:30:00Z",
      updated_at: "2024-01-14T14:20:00Z",
      description: "Football Association Youth Cup Competition",
    },
    {
      id: 3,
      name: "Championship Youth League",
      organizer: "premier-league",
      location: "England & Wales",
      season: "2024/25",
      start_date: "2024-08-20",
      end_date: "2025-05-20",
      teams_count: 24,
      matches_played: 0,
      status: "upcoming",
      logo: "",
      created_at: "2024-01-13T14:20:00Z",
      updated_at: "2024-01-13T14:20:00Z",
      description: "EFL Championship Youth Development League",
    },
    {
      id: 4,
      name: "UEFA Youth League",
      organizer: "uefa",
      location: "Europe",
      season: "2023/24",
      start_date: "2023-09-19",
      end_date: "2024-04-22",
      teams_count: 32,
      matches_played: 45,
      status: "completed",
      logo: "",
      created_at: "2023-08-15T11:45:00Z",
      updated_at: "2024-04-22T18:30:00Z",
      description: "UEFA Youth League for academy teams",
    },
    {
      id: 5,
      name: "Local Development Cup",
      organizer: "local",
      location: "Manchester",
      season: "2024",
      start_date: "2024-03-01",
      end_date: "2024-06-30",
      teams_count: 8,
      matches_played: 12,
      status: "live",
      logo: "",
      created_at: "2024-02-15T10:00:00Z",
      updated_at: "2024-02-15T10:00:00Z",
      description: "Local youth development tournament",
    },
    {
      id: 6,
      name: "International Youth Festival",
      organizer: "fifa",
      location: "International",
      season: "2024",
      start_date: "2024-07-01",
      end_date: "2024-07-15",
      teams_count: 16,
      matches_played: 0,
      status: "upcoming",
      logo: "",
      created_at: "2024-01-10T16:20:00Z",
      updated_at: "2024-01-10T16:20:00Z",
      description: "International youth football festival",
    },
  ];

  const organizers = ORGANIZER_OPTIONS;
  const statusOptions = MATCH_STATUS_OPTIONS;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTournaments(mockTournaments);
      setFilteredTournaments(mockTournaments);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterTournaments();
  }, [searchTerm, selectedOrganizers, selectedStatus, tournaments]);

  const filterTournaments = () => {
    let filtered = tournaments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tournament.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Organizer filter
    if (selectedOrganizers.length > 0) {
      filtered = filtered.filter((tournament) =>
        selectedOrganizers.includes(tournament.organizer)
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (tournament) => tournament.status === selectedStatus
      );
    }

    setFilteredTournaments(filtered);
    setCurrentPage(1);
  };

  const handleAddTournament = () => {
    setSelectedTournament(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tournament) => {
    setSelectedTournament(tournament);
    setIsFormOpen(true);
  };

  const handleDelete = (tournament) => {
    setSelectedTournament(tournament);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTournament) {
      setTournaments(tournaments.filter((t) => t.id !== selectedTournament.id));
      setIsDeleteModalOpen(false);
      setSelectedTournament(null);
    }
  };

  const handleSaveTournament = (tournamentData) => {
    if (selectedTournament) {
      // Update existing tournament
      setTournaments(
        tournaments.map((t) =>
          t.id === selectedTournament.id
            ? {
                ...tournamentData,
                id: selectedTournament.id,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
    } else {
      // Add new tournament
      const newTournament = {
        ...tournamentData,
        id: Math.max(...tournaments.map((t) => t.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTournaments([...tournaments, newTournament]);
    }
    setIsFormOpen(false);
    setSelectedTournament(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Table columns configuration
  const tableColumns = [
    { key: "tournament", title: "Tournament", width: "25%" },
    { key: "details", title: "Details", width: "20%" },
    { key: "schedule", title: "Schedule", width: "20%" },
    { key: "metrics", title: "Metrics", width: "20%" },
    { key: "status", title: "Status", width: "10%" },
    { key: "actions", title: "Actions", width: "15%" },
  ];

  // Render table row
  const renderTableRow = (tournament, index) => {
    return (
      <tr
        key={tournament.id}
        className="border-b border-gray-700/50 hover:bg-gray-700/20"
      >
        <td className="py-4 px-6">
          <div className="flex items-center space-x-3">
            <TournamentAvatar
              tournament={tournament}
              size="md"
              showStats
              teamsCount={tournament.teams_count}
            />
            <div>
              <div className="font-medium text-white">{tournament.name}</div>
              <div className="text-sm text-gray-400">
                {tournament.description}
              </div>
              <div className="text-sm text-gray-400 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {tournament.location}
              </div>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="text-white">
            {ORGANIZER_OPTIONS.find((o) => o.value === tournament.organizer)
              ?.label || tournament.organizer}
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Season: {tournament.season}
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-blue-400">
              <Calendar className="h-3 w-3 mr-1" />
              Start: {formatDate(tournament.start_date)}
            </div>
            <div className="flex items-center text-sm text-green-400">
              <Calendar className="h-3 w-3 mr-1" />
              End: {formatDate(tournament.end_date)}
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-yellow-400">
              <Users className="h-3 w-3 mr-1" />
              Teams:{" "}
              <span className="font-medium ml-1">{tournament.teams_count}</span>
            </div>
            <div className="flex items-center text-sm text-purple-400">
              <BarChart3 className="h-3 w-3 mr-1" />
              Matches:{" "}
              <span className="font-medium ml-1">
                {tournament.matches_played}
              </span>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <TournamentStatusBadge status={tournament.status} />
        </td>
        <td className="py-4 px-6">
          <div className="flex justify-end space-x-2">
            <Link to={`/tournaments/${tournament.id}`}>
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
              onClick={() => handleEdit(tournament)}
              className="text-gray-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(tournament)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Render grid item for reusable GridView
  const renderGridItem = (tournament) => (
    <TournamentCard
      key={tournament.id}
      tournament={tournament}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formatDate={formatDate}
    />
  );

  // Empty state action for GridView
  const emptyAction = (
    <Button
      onClick={handleAddTournament}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Tournament
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
                <Trophy className="h-6 w-6 mr-3 text-yellow-400" />
                Tournament Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage tournaments, seasons, and competition schedules
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
                onClick={handleAddTournament}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
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
                    placeholder="Search tournaments by name, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full h-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400 hidden sm:block">
                    Showing {filteredTournaments.length} of {tournaments.length}{" "}
                    tournaments
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
                    options={organizers}
                    selectedValues={selectedOrganizers}
                    onChange={setSelectedOrganizers}
                    placeholder="Filter by organizers..."
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
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile counter */}
                <div className="text-sm text-gray-400 block sm:hidden w-full text-center pt-2">
                  Showing {filteredTournaments.length} of {tournaments.length}{" "}
                  tournaments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <GridView
            data={filteredTournaments}
            renderItem={renderGridItem}
            emptyMessage="No tournaments found"
            emptyIcon={Trophy}
            emptyAction={emptyAction}
            pageSize={8}
            columns={{
              sm: 1,
              md: 2,
              lg: 3,
              xl: 3,
              "2xl": 4,
            }}
            onPageChange={setCurrentPage}
          />
        ) : (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-0">
              <DataTable
                columns={tableColumns}
                data={filteredTournaments}
                pageSize={10}
                renderRow={renderTableRow}
                emptyMessage="No tournaments found matching your filters"
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modals */}
      <TournamentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTournament(null);
        }}
        onSave={handleSaveTournament}
        tournament={selectedTournament}
      />

      <DeleteTournamentModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTournament(null);
        }}
        onConfirm={confirmDelete}
        tournament={selectedTournament}
      />
    </div>
  );
};

export default Tournaments;
