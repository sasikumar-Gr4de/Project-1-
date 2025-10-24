import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddMatchModal from "@/components/modals/AddMatchModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useMatchesStore } from "@/store/matches.store";
import { useClubsStore } from "@/store/clubs.store";
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
  const [matches, setMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    matchId: "",
  });
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const { getAllMatches, createMatch, updateMatch, deleteMatch } =
    useMatchesStore();
  const { getAllClubs } = useClubsStore();

  const fetchAllMatches = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    search = ""
  ) => {
    setIsLoading(true);
    try {
      const filters = {};
      if (search) {
        filters.search = search;
      }

      const result = await getAllMatches(page, pageSize, filters);
      if (result.success === true) {
        const { data, pagination: paginationData } = result.data;
        setMatches(data || []);
        setPagination({
          page: paginationData.page,
          pageSize: paginationData.pageSize,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const result = await getAllClubs();
      if (result.success === true) {
        setClubs(result.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  useEffect(() => {
    fetchAllMatches();
    fetchClubs();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAllMatches(newPage, pagination.pageSize, searchTerm);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchAllMatches(1, newPageSize, searchTerm);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchAllMatches(1, pagination.pageSize, value);
  };

  const handleAddMatch = async (matchData) => {
    try {
      const result = await createMatch(matchData);
      if (result.success) {
        fetchAllMatches(pagination.page, pagination.pageSize, searchTerm);
        setShowAddModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateMatch = async (updatedData) => {
    try {
      const { match_id } = updatedData;
      const result = await updateMatch(match_id, updatedData);
      if (result.success) {
        fetchAllMatches(pagination.page, pagination.pageSize, searchTerm);
        setSelectedMatch(null);
        setShowAddModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMatch = async () => {
    const result = await deleteMatch(deleteModal.matchId);
    const { success } = result;
    if (success === true) {
      fetchAllMatches(pagination.page, pagination.pageSize, searchTerm);
      setDeleteModal({ isOpen: false, matchId: "" });
    }
  };

  const handleEditMatch = async (match) => {
    setSelectedMatch(match);
    setShowAddModal(true);
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
      case "approved":
        return "default";
      case "pending":
        return "destructive";
      case "rejected":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Get club name by ID
  const getClubName = (clubId) => {
    const club = clubs.find((club) => club.club_id === clubId);
    return club ? club.club_name : "Unknown Club";
  };

  // Table columns
  const matchColumns = [
    {
      header: "Match",
      accessor: "home_club_id",
      cell: ({ row }) => (
        <div className="flex items-center justify-between space-x-4">
          {/* Home Team - Right Aligned */}
          <div className="flex-1 text-right mr-2">
            <p className="font-semibold text-foreground">
              {getClubName(row.home_club_id)}
            </p>
            <p className="text-sm text-muted-foreground">Home</p>
          </div>

          <div className="flex flex-col items-center mx-4">
            <div className="px-3 py-1 bg-muted rounded-lg">
              <span className="font-bold text-lg text-foreground">
                {formatScore(row)}
              </span>
            </div>
            <Badge
              variant={getStatusVariant(row.match_status)}
              className="mt-1 text-xs"
            >
              {capitalize(row.match_status)}
            </Badge>
          </div>

          <div className="flex-1 text-left ml-2">
            <p className="font-semibold text-foreground">
              {getClubName(row.away_club_id)}
            </p>
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
            <p className="text-xs text-muted-foreground">
              {new Date(row.match_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
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
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <DataTable
        data={matches}
        columns={matchColumns}
        title="All Matches"
        searchable={false}
        actions={matchActions}
        isLoading={isLoading}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add New Match"
        // Pagination props
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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
        clubs={clubs}
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
