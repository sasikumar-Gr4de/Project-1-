import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
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
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Users,
  Trophy,
  Building,
  Grid,
  Table,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react";

import TeamForm from "../../components/teams/TeamForm";
import DeleteTeamModal from "../../components/teams/DeleteTeamModal";
import TeamStatusBadge from "../../components/teams/TeamStatusBadge";
import TeamAvatar from "../../components/teams/TeamAvatar";
import DataTable from "../../components/common/DataTable";
import GridView from "../../components/common/GridView";
import MultiSelectFilter from "../../components/common/MultiSelectFilter";
import TeamCard from "../../components/teams/TeamCard";

import {
  TOURNAMENT_OPTIONS,
  ORGANIZER_OPTIONS,
  TEAM_STATUS_OPTIONS,
} from "../../utils/constants";

import { calculateAge } from "../../utils/calculate";
import Loading from "@/components/common/Loading";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournaments, setSelectedTournaments] = useState([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for teams
  const mockTeams = [
    {
      id: 1,
      name: "United Academy",
      admin_name: "John Smith",
      tournament: "premier-league",
      organizer: "premier-league",
      location: "Manchester, UK",
      team_mark: "https://images.unsplash.com/photo-1614624532983-1fe21c1d4ae5?w=150&h=150&fit=crop&crop=center",
      status: "active",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      players: [
        {
          id: 1,
          name: "Marcus Johnson",
          date_of_birth: "2006-05-15",
          overall_ability: 78,
          matches_played: 24,
        },
        {
          id: 5,
          name: "Alex Turner",
          date_of_birth: "2006-07-11",
          overall_ability: 76,
          matches_played: 20,
        },
      ],
    },
    {
      id: 2,
      name: "City Youth",
      admin_name: "Sarah Wilson",
      tournament: "premier-league",
      organizer: "premier-league",
      location: "Manchester, UK",
      team_mark: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&h=150&fit=crop&crop=center",
      status: "active",
      created_at: "2024-01-14T09:30:00Z",
      updated_at: "2024-01-14T09:30:00Z",
      players: [
        {
          id: 2,
          name: "Liam Chen",
          date_of_birth: "2007-08-22",
          overall_ability: 74,
          matches_played: 18,
        },
        {
          id: 6,
          name: "Mohamed Hassan",
          date_of_birth: "2005-11-25",
          overall_ability: 72,
          matches_played: 16,
        },
      ],
    },
    {
      id: 3,
      name: "Rovers FC",
      admin_name: "Mike Johnson",
      tournament: "championship",
      organizer: "fa",
      location: "Blackburn, UK",
      team_mark: "",
      status: "active",
      created_at: "2024-01-13T14:20:00Z",
      updated_at: "2024-01-13T14:20:00Z",
      players: [
        {
          id: 3,
          name: "Sarah Williams",
          date_of_birth: "2005-12-03",
          overall_ability: 69,
          matches_played: 15,
        },
      ],
    },
    {
      id: 4,
      name: "Athletic Youth",
      admin_name: "Carlos Ruiz",
      tournament: "youth-league",
      organizer: "local",
      location: "Bilbao, Spain",
      team_mark: "https://images.unsplash.com/photo-1614624532983-1fe21c1d4ae5?w=150&h=150&fit=crop&crop=center",
      status: "inactive",
      created_at: "2024-01-12T11:45:00Z",
      updated_at: "2024-01-12T11:45:00Z",
      players: [
        {
          id: 4,
          name: "James Rodriguez",
          date_of_birth: "2006-03-18",
          overall_ability: 81,
          matches_played: 22,
        },
      ],
    },
  ];

  const tournaments = TOURNAMENT_OPTIONS;
  const organizers = ORGANIZER_OPTIONS;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTeams(mockTeams);
      setFilteredTeams(mockTeams);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchTerm, selectedTournaments, selectedOrganizers, selectedStatus, teams]);

  const filterTeams = () => {
    let filtered = teams;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tournament filter
    if (selectedTournaments.length > 0) {
      filtered = filtered.filter((team) =>
        selectedTournaments.includes(team.tournament)
      );
    }

    // Organizer filter
    if (selectedOrganizers.length > 0) {
      filtered = filtered.filter((team) =>
        selectedOrganizers.includes(team.organizer)
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((team) => team.status === selectedStatus);
    }

    setFilteredTeams(filtered);
    setCurrentPage(1);
  };

  const handleAddTeam = () => {
    setSelectedTeam(null);
    setIsFormOpen(true);
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setIsFormOpen(true);
  };

  const handleDelete = (team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTeam) {
      setTeams(teams.filter((t) => t.id !== selectedTeam.id));
      setIsDeleteModalOpen(false);
      setSelectedTeam(null);
    }
  };

  const handleSaveTeam = (teamData) => {
    if (selectedTeam) {
      // Update existing team
      setTeams(
        teams.map((t) =>
          t.id === selectedTeam.id
            ? {
                ...teamData,
                id: selectedTeam.id,
                updated_at: new Date().toISOString(),
                players: selectedTeam.players, // Preserve players
              }
            : t
        )
      );
    } else {
      // Add new team
      const newTeam = {
        ...teamData,
        id: Math.max(...teams.map((t) => t.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        players: [], // Empty players array for new team
      };
      setTeams([...teams, newTeam]);
    }
    setIsFormOpen(false);
    setSelectedTeam(null);
  };

  // Table columns configuration
  const tableColumns = [
    { key: "team", title: "Team", width: "25%" },
    { key: "admin", title: "Admin", width: "15%" },
    { key: "tournament", title: "Tournament", width: "15%" },
    { key: "metrics", title: "Metrics", width: "20%" },
    { key: "status", title: "Status", width: "10%" },
    { key: "actions", title: "Actions", width: "15%" },
  ];

  // Render table row
  const renderTableRow = (team, index) => {
    const playerCount = team.players ? team.players.length : 0;
    const averageAbility = team.players && team.players.length > 0 ? 
      Math.round(team.players.reduce((sum, player) => sum + (player.overall_ability || 0), 0) / team.players.length) : 0;

    return (
      <tr
        key={team.id}
        className="border-b border-gray-700/50 hover:bg-gray-700/20"
      >
        <td className="py-4 px-6">
          <div className="flex items-center space-x-3">
            <TeamAvatar
              team={team}
              size="md"
              showStats
              playerCount={playerCount}
            />
            <div>
              <div className="font-medium text-white">{team.name}</div>
              <div className="text-sm text-gray-400 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {team.location}
              </div>
            </div>
          </div>
        </td>
        <td className="py-4 px-6 text-white">{team.admin_name}</td>
        <td className="py-4 px-6">
          <div className="text-white">
            {TOURNAMENT_OPTIONS.find((t) => t.value === team.tournament)?.label || team.tournament}
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <Building className="h-3 w-3 mr-1" />
            {ORGANIZER_OPTIONS.find((o) => o.value === team.organizer)?.label || team.organizer}
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-blue-400">
              <BarChart3 className="h-3 w-3 mr-1" />
              Ability: <span className="font-medium ml-1">{averageAbility}</span>
            </div>
            <div className="flex items-center text-sm text-green-400">
              <Users className="h-3 w-3 mr-1" />
              Players: <span className="font-medium ml-1">{playerCount}</span>
            </div>
            <div className="flex items-center text-sm text-yellow-400">
              <Calendar className="h-3 w-3 mr-1" />
              Matches: <span className="font-medium ml-1">
                {team.players ? team.players.reduce((sum, player) => sum + (player.matches_played || 0), 0) : 0}
              </span>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <TeamStatusBadge status={team.status} />
        </td>
        <td className="py-4 px-6">
          <div className="flex justify-end space-x-2">
            <Link to={`/teams/${team.id}`}>
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
              onClick={() => handleEdit(team)}
              className="text-gray-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(team)}
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
  const renderGridItem = (team) => (
    <TeamCard
      key={team.id}
      team={team}
      onEdit={handleEdit}
      onDelete={handleDelete}
      calculateAge={calculateAge}
    />
  );

  // Empty state action for GridView
  const emptyAction = (
    <Button
      onClick={handleAddTeam}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Team
    </Button>
  );

  if (isLoading) {
    return <Loading overlay text="" color="blue" variant="gradient-spinner" />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Trophy className="h-6 w-6 mr-3 text-blue-400" />
                Team Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your teams, tournaments, and player assignments
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
                onClick={handleAddTeam}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
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
                    placeholder="Search teams by name, admin, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full h-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400 hidden sm:block">
                    Showing {filteredTeams.length} of {teams.length} teams
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
                    options={tournaments}
                    selectedValues={selectedTournaments}
                    onChange={setSelectedTournaments}
                    placeholder="Filter by tournaments..."
                    className="w-full"
                  />
                </div>

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
                      {TEAM_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile counter */}
                <div className="text-sm text-gray-400 block sm:hidden w-full text-center pt-2">
                  Showing {filteredTeams.length} of {teams.length} teams
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <GridView
            data={filteredTeams}
            renderItem={renderGridItem}
            emptyMessage="No teams found"
            emptyIcon={Trophy}
            emptyAction={emptyAction}
            pageSize={8}
            columns={{
              sm: 1,
              md: 2,
              lg: 3,
              xl: 4,
              "2xl": 4
            }}
            onPageChange={setCurrentPage}
          />
        ) : (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-0">
              <DataTable
                columns={tableColumns}
                data={filteredTeams}
                pageSize={10}
                renderRow={renderTableRow}
                emptyMessage="No teams found matching your filters"
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modals */}
      <TeamForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTeam(null);
        }}
        onSave={handleSaveTeam}
        team={selectedTeam}
      />

      <DeleteTeamModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTeam(null);
        }}
        onConfirm={confirmDelete}
        team={selectedTeam}
      />
    </div>
  );
};

export default Teams;