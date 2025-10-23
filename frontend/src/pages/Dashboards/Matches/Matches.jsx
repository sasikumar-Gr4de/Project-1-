import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddMatchModal from "@/components/modals/AddMatchModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { mockMatches, mockClubs } from "@/mock/data";
import {
  Search,
  Trophy,
  Edit,
  Trash2,
  Eye,
  CalendarDays,
  Building,
} from "lucide-react";
import { capitalize } from "@/utils/helper.utils";
import { formatDate } from "@/utils/formatter.util";

const Matches = () => {
  const [matches, setMatches] = useState(mockMatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    matchId: "",
  });
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Filter matches based on search
  const filteredMatches = matches.filter(
    (match) =>
      match.home_club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.away_club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.competition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    total: matches.length,
    completed: matches.filter((match) => match.match_status === "completed")
      .length,
    upcoming: matches.filter((match) => match.match_status === "scheduled")
      .length,
  };

  const handleAddMatch = (matchData) => {
    const homeClub = mockClubs.find(
      (club) => club.club_id === matchData.home_club_id
    );
    const awayClub = mockClubs.find(
      (club) => club.club_id === matchData.away_club_id
    );

    const newMatch = {
      ...matchData,
      match_id: `match-${Date.now()}`,
      home_club: homeClub?.club_name || "Unknown Club",
      away_club: awayClub?.club_name || "Unknown Club",
      home_score: matchData.score_home,
      away_score: matchData.score_away,
      league: matchData.competition,
      match_date: matchData.match_date,
      match_time: new Date(matchData.match_date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: matchData.match_status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMatches((prev) => [...prev, newMatch]);
  };

  const handleDeleteMatch = () => {
    setMatches((prev) =>
      prev.filter((match) => match.match_id !== deleteModal.matchId)
    );
    setDeleteModal({ isOpen: false, matchId: "" });
  };

  const handleEditMatch = (match) => {
    // Convert existing match data to match AddMatchModal structure
    const homeClub = mockClubs.find(
      (club) => club.club_name === match.home_club
    );
    const awayClub = mockClubs.find(
      (club) => club.club_name === match.away_club
    );

    const editData = {
      home_club_id: homeClub?.club_id || "",
      away_club_id: awayClub?.club_id || "",
      match_date: match.match_date,
      venue: match.venue,
      competition: match.league,
      match_status: match.status,
      score_home: match.home_score?.toString() || "",
      score_away: match.away_score?.toString() || "",
      duration_minutes: match.duration_minutes?.toString() || "",
      video_url: match.video_url || "",
      qa_status: match.qa_status || "pending",
      notes: match.notes || "",
    };

    setSelectedMatch({ ...match, ...editData });
    setShowAddModal(true);
  };

  const handleUpdateMatch = (updatedData) => {
    const homeClub = mockClubs.find(
      (club) => club.club_id === updatedData.home_club_id
    );
    const awayClub = mockClubs.find(
      (club) => club.club_id === updatedData.away_club_id
    );

    const updatedMatch = {
      ...updatedData,
      home_club: homeClub?.club_name || "Unknown Club",
      away_club: awayClub?.club_name || "Unknown Club",
      home_score: updatedData.score_home,
      away_score: updatedData.score_away,
      league: updatedData.competition,
      match_date: updatedData.match_date,
      match_time: new Date(updatedData.match_date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: updatedData.match_status,
      updated_at: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((match) =>
        match.match_id === selectedMatch.match_id
          ? { ...match, ...updatedMatch }
          : match
      )
    );
    setSelectedMatch(null);
  };

  // Format match score
  const formatScore = (match) => {
    if (match.match_status !== "completed") {
      return "VS";
    }
    return `${match.score_home || 0} - ${match.score_away || 0}`;
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "default";
      case "ongoing":
        return "destructive";
      case "scheduled":
        return "secondary";
      case "postponed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getAnalysisVarient = (status) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "destructive";
    }
  };

  // Table columns
  const matchColumns = [
    {
      header: "Match",
      accessor: "home_club",
      cell: ({ row }) => (
        <div className="flex items-center justify-between space-x-4">
          {/* Home Team - Right Aligned */}
          <div className="flex-1 text-right mr-2">
            <p className="font-semibold text-foreground">{row.home_club}</p>
            <p className="text-sm text-muted-foreground">Home</p>
          </div>

          <div className="flex flex-col items-center mx-4">
            <div className="px-3 py-1 bg-muted rounded-lg">
              <span className="font-bold text-lg text-foreground">
                {formatScore(row)}
              </span>
            </div>
            <Badge
              variant={getStatusVariant(row.status)}
              className="mt-1 text-xs"
            >
              {row.status}
            </Badge>
          </div>

          <div className="flex-1 text-left ml-2">
            <p className="font-semibold text-foreground">{row.away_club}</p>
            <p className="text-sm text-muted-foreground">Away</p>
          </div>
        </div>
      ),
    },
    {
      header: "Competition",
      accessor: "competition",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.competition}</span>
        </div>
      ),
    },
    {
      header: "Venue",
      accessor: "venue",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span>{row.venue}</span>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessor: "match_date",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {formatDate(new Date(row.match_date))}
            </p>
            <p className="text-xs text-muted-foreground">{row.match_time}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Analysis Status",
      accessor: "qa_status",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Badge
            variant={getAnalysisVarient(row.qa_status)}
            className="mt-1 text-xs"
          >
            {capitalize(row.qa_status)}
          </Badge>
        </div>
      ),
    },
  ];

  // Table actions
  const matchActions = ({ row }) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-blue-500/10 hover:text-blue-600"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditMatch(row)}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDeleteModal({ isOpen: true, matchId: row.match_id })}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search matches by teams, venue, or league..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-muted-foreground">
            Showing {filteredMatches.length} of {matches.length} matches
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <DataTable
        data={filteredMatches}
        columns={matchColumns}
        title="All Matches"
        searchable={false}
        actions={matchActions}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add New Match"
      />

      {/* Add/Edit Match Modal */}
      <AddMatchModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedMatch(null);
        }}
        onSave={selectedMatch ? handleUpdateMatch : handleAddMatch}
        match={selectedMatch}
        clubs={mockClubs}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, matchId: "" })}
        onConfirm={handleDeleteMatch}
        title="Delete Match"
        message="Are you sure you want to delete this match? This action cannot be undone and will remove all associated data."
      />
    </div>
  );
};

export default Matches;
