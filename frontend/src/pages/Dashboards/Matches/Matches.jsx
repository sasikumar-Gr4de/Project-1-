import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddMatchModal from "@/components/modals/AddMatchModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useMatchesStore } from "@/store/matches.store";
import { useClubsStore } from "@/store/clubs.store";
import { Trophy, Edit, Trash2, Eye, CalendarDays, MapPin } from "lucide-react";
import { capitalize } from "@/utils/helper.utils";
import { formatDate } from "@/utils/formatter.util";
import { useToast } from "@/contexts/ToastContext";
import { Link } from "react-router-dom";

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
  const { toast } = useToast();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const { getAllMatches, createMatch, updateMatch, deleteMatch } =
    useMatchesStore();
  const { getAllClubsForSelect } = useClubsStore();

  useEffect(() => {
    fetchAllMatches();
    fetchClubs();
  }, []);

  const fetchAllMatches = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    search = ""
  ) => {
    setIsLoading(true);
    try {
      const filters = search ? { search } : {};
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
      toast({
        title: "Error",
        description: "Failed to fetch matches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const result = await getAllClubsForSelect();
      if (result.success === true) {
        setClubs(result.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

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
        toast({
          title: "Success",
          description: "Match added successfully",
          variant: "success",
        });
        fetchAllMatches(pagination.page, pagination.pageSize, searchTerm);
        setShowAddModal(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add match",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding match:", error);
      toast({
        title: "Error",
        description: "Failed to add match",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMatch = async (updatedData) => {
    try {
      const { match_id } = updatedData;
      const result = await updateMatch(match_id, updatedData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Match updated successfully",
          variant: "success",
        });
        fetchAllMatches(pagination.page, pagination.pageSize, searchTerm);
        setSelectedMatch(null);
        setShowAddModal(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update match",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating match:", error);
      toast({
        title: "Error",
        description: "Failed to update match",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMatch = async () => {
    try {
      const result = await deleteMatch(deleteModal.matchId);
      if (result.success === true) {
        toast({
          title: "Success",
          description: "Match deleted successfully",
          variant: "success",
        });
        fetchAllMatches(pagination.page, pagination.pageSize, searchTerm);
        setDeleteModal({ isOpen: false, matchId: "" });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete match",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting match:", error);
      toast({
        title: "Error",
        description: "Failed to delete match",
        variant: "destructive",
      });
    }
  };

  const handleEditMatch = (match) => {
    setSelectedMatch(match);
    setShowAddModal(true);
  };

  const formatScore = (match) => {
    if (match.match_status !== "completed") return "VS";
    return `${match.score_home || 0} - ${match.score_away || 0}`;
  };

  const getStatusVariant = (status) => {
    const variants = {
      completed: "default",
      ongoing: "destructive",
      scheduled: "secondary",
      postponed: "outline",
    };
    return variants[status] || "secondary";
  };

  const getAnalysisVariant = (status) => {
    const variants = {
      completed: "default",
      approved: "default",
      pending: "destructive",
      rejected: "outline",
    };
    return variants[status] || "secondary";
  };

  const getClubName = (clubId) => {
    const club = clubs.find((club) => club.club_id === clubId);
    return club ? club.club_name : "Unknown Club";
  };

  const ActionButton = ({
    icon: Icon,
    onClick,
    color = "primary",
    tooltip,
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`
        h-8 w-8 p-0 transition-all duration-200 rounded-md
        ${
          color === "primary"
            ? "bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 hover:border-primary/30"
            : color === "secondary"
            ? "bg-secondary/5 text-secondary border border-secondary/20 hover:bg-secondary/10 hover:border-secondary/30"
            : "bg-destructive/5 text-destructive border border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
        }
        shadow-sm hover:shadow-md
      `}
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  const matchColumns = [
    {
      header: "Match",
      accessor: "home_club_id",
      cell: ({ row }) => (
        <div className="flex items-center justify-between space-x-4 min-w-0">
          <div className="flex-1 text-right min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {getClubName(row.home_club_id)}
            </p>
            <p className="text-xs text-muted-foreground">Home</p>
          </div>

          <div className="flex flex-col items-center mx-2 shrink-0">
            <div className="px-2 py-1 bg-muted/50 rounded-md border border-border/40">
              <span className="font-bold text-sm text-foreground">
                {formatScore(row)}
              </span>
            </div>
            <Badge
              variant={getStatusVariant(row.match_status)}
              className="mt-1 text-xs font-medium bg-primary/10 text-primary border-primary/20"
            >
              {capitalize(row.match_status)}
            </Badge>
          </div>

          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {getClubName(row.away_club_id)}
            </p>
            <p className="text-xs text-muted-foreground">Away</p>
          </div>
        </div>
      ),
    },
    {
      header: "Competition",
      accessor: "competition",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Trophy className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-sm font-medium text-foreground/90 truncate">
            {row.competition}
          </span>
        </div>
      ),
    },
    {
      header: "Venue",
      accessor: "venue",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-sm text-foreground/90 truncate">
            {row.venue}
          </span>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessor: "match_date",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground/70" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground/90 whitespace-nowrap">
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
      header: "Analysis",
      accessor: "qa_status",
      cell: ({ row }) => (
        <Badge
          variant={getAnalysisVariant(row.qa_status)}
          className="text-xs font-medium bg-secondary/10 text-gray-300 border-secondary/20"
        >
          {capitalize(row.qa_status)}
        </Badge>
      ),
    },
  ];

  const matchActions = ({ row }) => (
    <div className="flex items-center space-x-2 transition-all duration-200">
      <Link to={`/matches/${row.match_id}`}>
        <ActionButton
          icon={Eye}
          onClick={() => console.log("View match", row)}
          color="secondary"
          tooltip="View match"
        />
      </Link>
      <ActionButton
        icon={Edit}
        onClick={() => handleEditMatch(row)}
        color="primary"
        tooltip="Edit match"
      />
      <ActionButton
        icon={Trash2}
        onClick={() => setDeleteModal({ isOpen: true, matchId: row.match_id })}
        color="destructive"
        tooltip="Delete match"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        data={matches}
        columns={matchColumns}
        title=""
        searchable={true}
        searchPlaceholder="Search matches..."
        actions={matchActions}
        isLoading={isLoading}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add Match"
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyStateTitle="No Matches Found"
        emptyStateDescription="Get started by adding your first football match to the system."
        tableHeight="500px"
      />

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
