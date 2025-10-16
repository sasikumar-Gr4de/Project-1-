import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
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
  Calendar,
  Trophy,
  Grid,
  Table,
  Play,
} from "lucide-react";

import MatchForm from "../../components/matches/MatchForm";
import DeleteMatchModal from "../../components/matches/DeleteMatchModal";
import UploadVideoModal from "../../components/matches/UploadVideoModal";
import MatchStatusBadge from "../../components/matches/MatchStatusBadge";
import TeamAvatar from "../../components/teams/TeamAvatar";
import DataTable from "../../components/common/DataTable";
import GridView from "../../components/common/GridView";
import MultiSelectFilter from "../../components/common/MultiSelectFilter";
import MatchCard from "../../components/matches/MatchCard";

import {
  TOURNAMENT_OPTIONS,
  MATCH_STATUS_OPTIONS,
} from "../../utils/constants";

import Loading from "@/components/common/Loading";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournaments, setSelectedTournaments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for matches
  const mockMatches = [
    {
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
      video_url: null,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      team_a_id: 3,
      team_b_id: 4,
      team_a_name: "Rovers FC",
      team_b_name: "Athletic Youth",
      team_a_logo: "",
      team_b_logo: "",
      tournament_name: "championship",
      match_day: 2,
      match_date: "2024-03-20T18:30:00",
      status: "upcoming",
      team_a_score: 0,
      team_b_score: 0,
      video_url: null,
      created_at: "2024-01-16T09:00:00Z",
      updated_at: "2024-01-16T09:00:00Z",
    },
    {
      id: 3,
      team_a_id: 1,
      team_b_id: 3,
      team_a_name: "United Academy",
      team_b_name: "Rovers FC",
      team_a_logo: "",
      team_b_logo: "",
      tournament_name: "premier-league",
      match_day: 3,
      match_date: "2024-03-10T14:00:00",
      status: "completed",
      team_a_score: 3,
      team_b_score: 0,
      video_url: "https://example.com/match3-video.mp4",
      created_at: "2024-01-14T14:00:00Z",
      updated_at: "2024-01-14T14:00:00Z",
    },
    {
      id: 4,
      team_a_id: 2,
      team_b_id: 4,
      team_a_name: "City Youth",
      team_b_name: "Athletic Youth",
      team_a_logo:
        "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&h=150&fit=crop&crop=center",
      team_b_logo: "",
      tournament_name: "youth-league",
      match_day: 1,
      match_date: "2024-03-25T16:00:00",
      status: "live",
      team_a_score: 1,
      team_b_score: 1,
      video_url: null,
      created_at: "2024-01-17T11:00:00Z",
      updated_at: "2024-01-17T11:00:00Z",
    },
  ];

  const mockTeams = [
    {
      id: 1,
      name: "United Academy",
      team_mark: "",
    },
    {
      id: 2,
      name: "City Youth",
      team_mark:
        "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&h=150&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Rovers FC",
      team_mark: "",
    },
    {
      id: 4,
      name: "Athletic Youth",
      team_mark:
        "https://images.unsplash.com/photo-1614624532983-1fe21c1d4ae5?w=150&h=150&fit=crop&crop=center",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMatches(mockMatches);
      setTeams(mockTeams);
      setFilteredMatches(mockMatches);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterMatches();
  }, [searchTerm, selectedTournaments, selectedStatus, matches]);

  const filterMatches = () => {
    let filtered = matches;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.team_a_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.team_b_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.tournament_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tournament filter
    if (selectedTournaments.length > 0) {
      filtered = filtered.filter((match) =>
        selectedTournaments.includes(match.tournament_name)
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((match) => match.status === selectedStatus);
    }

    setFilteredMatches(filtered);
    setCurrentPage(1);
  };

  const handleAddMatch = () => {
    setSelectedMatch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (match) => {
    setSelectedMatch(match);
    setIsFormOpen(true);
  };

  const handleDelete = (match) => {
    setSelectedMatch(match);
    setIsDeleteModalOpen(true);
  };

  const handleUploadVideo = (match) => {
    setSelectedMatch(match);
    setIsUploadModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMatch) {
      setMatches(matches.filter((m) => m.id !== selectedMatch.id));
      setIsDeleteModalOpen(false);
      setSelectedMatch(null);
    }
  };

  const handleUploadVideoFile = (matchId, videoFile) => {
    // Simulate video upload
    setMatches(
      matches.map((match) =>
        match.id === matchId
          ? { ...match, video_url: URL.createObjectURL(videoFile) }
          : match
      )
    );
  };

  const handleSaveMatch = (matchData) => {
    if (selectedMatch) {
      // Update existing match
      setMatches(
        matches.map((m) =>
          m.id === selectedMatch.id
            ? {
                ...matchData,
                id: selectedMatch.id,
                updated_at: new Date().toISOString(),
                video_url: selectedMatch.video_url, // Preserve video
              }
            : m
        )
      );
    } else {
      // Add new match
      const newMatch = {
        ...matchData,
        id: Math.max(...matches.map((m) => m.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        video_url: null,
      };
      setMatches([...matches, newMatch]);
    }
    setIsFormOpen(false);
    setSelectedMatch(null);
  };

  // Table columns configuration
  const tableColumns = [
    { key: "match", title: "Match", width: "30%" },
    { key: "tournament", title: "Tournament", width: "15%" },
    { key: "date", title: "Date & Time", width: "15%" },
    { key: "score", title: "Score", width: "15%" },
    { key: "status", title: "Status", width: "10%" },
    { key: "actions", title: "Actions", width: "15%" },
  ];

  // Render table row
  const renderTableRow = (match, index) => {
    const canViewDetails = match.status !== "upcoming";

    const formatMatchDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <tr
        key={match.id}
        className="border-b border-gray-700/50 hover:bg-gray-700/20"
      >
        <td className="py-4 px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TeamAvatar
                team={{ team_mark: match.team_a_logo, name: match.team_a_name }}
                size="sm"
              />
              <span className="text-white text-sm font-medium">vs</span>
              <TeamAvatar
                team={{ team_mark: match.team_b_logo, name: match.team_b_name }}
                size="sm"
              />
            </div>
            <div>
              <div className="font-medium text-white text-sm">
                {match.team_a_name} vs {match.team_b_name}
              </div>
              <div className="text-xs text-gray-400">
                Matchday {match.match_day}
              </div>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="text-white text-sm">
            {TOURNAMENT_OPTIONS.find((t) => t.value === match.tournament_name)
              ?.label || match.tournament_name}
          </div>
        </td>
        <td className="py-4 px-6 text-white text-sm">
          {formatMatchDateTime(match.match_date)}
        </td>
        <td className="py-4 px-6">
          {match.status === "upcoming" ? (
            <span className="text-gray-400 text-sm">VS</span>
          ) : (
            <div className="text-white font-medium text-sm">
              {match.team_a_score} - {match.team_b_score}
            </div>
          )}
        </td>
        <td className="py-4 px-6">
          <MatchStatusBadge status={match.status} />
        </td>
        <td className="py-4 px-6">
          <div className="flex justify-end space-x-2">
            <Link to={`/matches/${match.id}`}>
              <Button
                variant="ghost"
                size="sm"
                disabled={!canViewDetails}
                className={`${
                  canViewDetails
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-gray-600 cursor-not-allowed"
                }`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(match)}
              className="text-gray-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(match)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {match.status === "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUploadVideo(match)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  // Render grid item for reusable GridView
  const renderGridItem = (match) => (
    <MatchCard
      key={match.id}
      match={match}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onUploadVideo={handleUploadVideo}
    />
  );

  // Empty state action for GridView
  const emptyAction = (
    <Button
      onClick={handleAddMatch}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Match
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
                <Calendar className="h-6 w-6 mr-3 text-blue-400" />
                Match Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage matches, scores, and match videos
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
                onClick={handleAddMatch}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Match
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
                    placeholder="Search matches by team names or tournament..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full h-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400 hidden sm:block">
                    Showing {filteredMatches.length} of {matches.length} matches
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
                    options={TOURNAMENT_OPTIONS}
                    selectedValues={selectedTournaments}
                    onChange={setSelectedTournaments}
                    placeholder="Filter by tournaments..."
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
                      {MATCH_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile counter */}
                <div className="text-sm text-gray-400 block sm:hidden w-full text-center pt-2">
                  Showing {filteredMatches.length} of {matches.length} matches
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <GridView
            data={filteredMatches}
            renderItem={renderGridItem}
            emptyMessage="No matches found"
            emptyIcon={Calendar}
            emptyAction={emptyAction}
            pageSize={8}
            columns={{
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              "2xl": 3,
            }}
            onPageChange={setCurrentPage}
          />
        ) : (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-0">
              <DataTable
                columns={tableColumns}
                data={filteredMatches}
                pageSize={10}
                renderRow={renderTableRow}
                emptyMessage="No matches found matching your filters"
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modals */}
      <MatchForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMatch(null);
        }}
        onSave={handleSaveMatch}
        match={selectedMatch}
        teams={teams}
      />

      <DeleteMatchModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMatch(null);
        }}
        onConfirm={confirmDelete}
        match={selectedMatch}
      />

      <UploadVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedMatch(null);
        }}
        onUpload={handleUploadVideoFile}
        match={selectedMatch}
      />
    </div>
  );
};

export default Matches;
