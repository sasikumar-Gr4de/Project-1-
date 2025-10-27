import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddPlayerModal from "@/components/modals/AddPlayerModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { usePlayersStore } from "@/store/players.store";
import { useClubsStore } from "@/store/clubs.store";
import {
  Calendar,
  MapPin,
  Ruler,
  Scale,
  Edit,
  Trash2,
  Eye,
  User,
  Footprints,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { capitalize } from "@/utils/helper.utils";
import RatingDisplay from "@/components/common/RatingDisplay";
import { useToast } from "@/contexts/ToastContext";
import { calculateAge } from "@/utils/helper.utils";

const ClubDetail = () => {
  const { id: clubId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [club, setClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playerId: "",
  });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const { getAllPlayers, updatePlayer, deletePlayer } = usePlayersStore();
  const { getClubById } = useClubsStore();

  useEffect(() => {
    if (clubId) {
      fetchClubPlayers();
      fetchClubInfo();
    }
  }, [clubId]);

  const fetchClubPlayers = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    search = ""
  ) => {
    setIsLoading(true);
    try {
      const filters = search
        ? { search, current_club: clubId }
        : { current_club: clubId };
      const result = await getAllPlayers(page, pageSize, filters);

      if (result.success === true) {
        const { data, pagination: paginationData } = result.data;
        setPlayers(data || []);
        setPagination({
          page: paginationData.page,
          pageSize: paginationData.pageSize,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch club players",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching club players:", error);
      toast({
        title: "Error",
        description: "Failed to fetch club players",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubInfo = async () => {
    try {
      const result = await getClubById(clubId);
      if (result.success === true) {
        const currentClub = result.data;
        setClub(currentClub || null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch club info",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching club info:", error);
    }
  };

  const handlePageChange = (newPage) => {
    fetchClubPlayers(newPage, pagination.pageSize, searchTerm);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchClubPlayers(1, newPageSize, searchTerm);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    fetchClubPlayers(1, pagination.pageSize, searchValue);
  };

  const handleUpdatePlayer = async (updatedData) => {
    try {
      const { player_id } = updatedData;
      const result = await updatePlayer(player_id, updatedData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Player updated successfully",
          variant: "success",
        });
        fetchClubPlayers(pagination.page, pagination.pageSize, searchTerm);
        setSelectedPlayer(null);
        setShowEditModal(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update player",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating player:", error);
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlayer = async () => {
    try {
      const result = await deletePlayer(deleteModal.playerId);
      if (result.success === true) {
        toast({
          title: "Success",
          description: "Player deleted successfully",
          variant: "success",
        });
        fetchClubPlayers(pagination.page, pagination.pageSize, searchTerm);
        setDeleteModal({ isOpen: false, playerId: "" });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete player",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting player:", error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    }
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setShowEditModal(true);
  };

  const getStatusVariant = (status) => {
    const variants = {
      active: "default",
      injured: "destructive",
      suspended: "outline",
      inactive: "secondary",
    };
    return variants[status?.toLowerCase()] || "secondary";
  };

  const PlayerAvatar = ({ player, className = "w-10 h-10" }) => {
    const gradientClass = `bg-gradient-to-br from-primary/80 to-primary/60`;

    return (
      <div
        className={`${className} rounded-full ${gradientClass} flex items-center justify-center text-primary-foreground shadow-sm border`}
      >
        {player?.avatar_url ? (
          <img
            src={player.avatar_url}
            alt={player.full_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : player?.full_name ? (
          <span className="text-sm font-semibold">
            {player.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        ) : (
          <User className="w-5 h-5 border-primary/20" />
        )}
      </div>
    );
  };

  const ClubHeader = () => {
    if (!club) return null;
    console.log("Rendering ClubHeader for club:", club);
    return (
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {club?.mark_url ? (
              <img
                src={club.mark_url}
                alt={club.club_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {club.club_name}
              </h1>
              {club.location && (
                <p className="text-muted-foreground flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{club.location}</span>
                </p>
              )}
              {club.founded_year && (
                <p className="text-muted-foreground flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>Founded {club.founded_year}</span>
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <Badge variant="secondary" className="text-sm font-medium">
              {pagination.total} Players
            </Badge>
          </div>
        </div>
      </div>
    );
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

  const playerColumns = [
    {
      header: "Player",
      accessor: "full_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 min-w-0">
          <PlayerAvatar player={row} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm truncate">
              {row.full_name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-secondary/10 text-foreground border border-secondary/20"
              >
                {row.position}
              </Badge>
              <span className="text-xs text-muted-foreground">
                #{row.jersey_number}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Sense Score",
      accessor: "score",
      cell: ({ row }) => <RatingDisplay rating={row.sense_score || 0} />,
    },
    {
      header: "Age",
      accessor: "date_of_birth",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-sm font-medium text-foreground/90">
            {calculateAge(row.date_of_birth)}
          </span>
        </div>
      ),
    },
    {
      header: "Nationality",
      accessor: "nationality",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-sm text-foreground/90 truncate">
            {row.nationality}
          </span>
        </div>
      ),
    },
    {
      header: "Physical",
      accessor: "height_cm",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Ruler className="w-3 h-3 text-muted-foreground/70" />
            <span className="text-xs text-foreground/90">
              {row.height_cm} cm
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className="w-3 h-3 text-muted-foreground/70" />
            <span className="text-xs text-foreground/90">
              {row.weight_kg} kg
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Footprints className="w-3 h-3 text-muted-foreground/70" />
            <span className="text-xs text-foreground/90">
              {row.preferred_foot}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row.status)}
          className="text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        >
          {capitalize(row.status)}
        </Badge>
      ),
    },
  ];

  const playerActions = ({ row }) => (
    <div className="flex items-center space-x-2 transition-all duration-200">
      <ActionButton
        icon={Eye}
        onClick={() => navigate(`/players/${row.player_id}`)}
        color="secondary"
        tooltip="View player details"
      />
      <ActionButton
        icon={Edit}
        onClick={() => handleEditPlayer(row)}
        color="primary"
        tooltip="Edit player"
      />
      <ActionButton
        icon={Trash2}
        onClick={() =>
          setDeleteModal({ isOpen: true, playerId: row.player_id })
        }
        color="destructive"
        tooltip="Delete player"
      />
    </div>
  );

  if (!clubId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Club Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The club you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/clubs")}>
            Back to Clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard/clubs")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Clubs
      </Button>

      {/* Club Header */}
      <ClubHeader />

      {/* Players Table */}
      <DataTable
        data={players}
        columns={playerColumns}
        title="Team Players"
        searchable={true}
        searchPlaceholder="Search players..."
        onSearch={handleSearch}
        actions={playerActions}
        isLoading={isLoading}
        onAdd={null} // Disable add functionality in club detail
        addButtonText=""
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyStateTitle="No Players Found"
        emptyStateDescription={`No players found for ${
          club?.club_name || "this club"
        }. Players will appear here once they are added to the club.`}
        tableHeight="500px"
      />

      {/* Edit Player Modal */}
      <AddPlayerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPlayer(null);
        }}
        onSave={handleUpdatePlayer}
        player={selectedPlayer}
        clubs={club ? [club] : []} // Only show current club in dropdown
        isEditMode={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, playerId: "" })}
        onConfirm={handleDeletePlayer}
        title="Delete Player"
        message="Are you sure you want to delete this player? This action cannot be undone and will remove all associated data."
      />
    </div>
  );
};

export default ClubDetail;
