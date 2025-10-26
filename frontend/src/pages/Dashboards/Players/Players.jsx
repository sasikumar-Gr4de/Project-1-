import { useState, useEffect } from "react";
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
  Shirt,
  Edit,
  Trash2,
  Eye,
  User,
  Footprints,
} from "lucide-react";
import { capitalize } from "@/utils/helper.utils";
import RatingDisplay from "@/components/common/RatingDisplay";
import { useToast } from "@/contexts/ToastContext";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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

  const { getAllPlayers, createPlayer, updatePlayer, deletePlayer } =
    usePlayersStore();
  const { getAllClubsForSelect } = useClubsStore();

  useEffect(() => {
    fetchAllPlayers();
    fetchClubs();
  }, []);

  const fetchAllPlayers = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    search = ""
  ) => {
    setIsLoading(true);
    try {
      const filters = search ? { search } : {};
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
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast({
        title: "Error",
        description: "Failed to fetch players",
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
    fetchAllPlayers(newPage, pagination.pageSize, searchTerm);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchAllPlayers(1, newPageSize, searchTerm);
  };

  const handleAddPlayer = async (playerData) => {
    try {
      const result = await createPlayer(playerData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Player added successfully",
          variant: "success",
        });
        fetchAllPlayers(pagination.page, pagination.pageSize, searchTerm);
        setShowAddModal(false);
        setSelectedPlayer(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add player",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding player:", error);
      toast({
        title: "Error",
        description: "Failed to add player",
        variant: "destructive",
      });
    }
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
        fetchAllPlayers(pagination.page, pagination.pageSize, searchTerm);
        setSelectedPlayer(null);
        setShowAddModal(false);
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
        fetchAllPlayers(pagination.page, pagination.pageSize, searchTerm);
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
    setShowAddModal(true);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
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

  const getClubName = (clubId) => {
    const club = clubs.find((club) => club.club_id === clubId);
    return club ? club.club_name : "Unknown Club";
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
        className={`${className} rounded-full ${gradientClass} flex items-center justify-center text-primary-foreground shadow-sm border border-primary/20`}
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
          <User className="w-5 h-5" />
        )}
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
      header: "Club",
      accessor: "current_club",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Shirt className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-sm text-foreground/90 truncate">
            {getClubName(row.current_club)}
          </span>
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
        onClick={() => console.log("View player", row)}
        color="secondary"
        tooltip="View player"
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

  return (
    <div className="space-y-6">
      <DataTable
        data={players}
        columns={playerColumns}
        title=""
        searchable={true}
        searchPlaceholder="Search players..."
        actions={playerActions}
        isLoading={isLoading}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add Player"
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyStateTitle="No Players Found"
        emptyStateDescription="Get started by adding your first football player to the system."
        tableHeight="500px"
      />

      <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPlayer(null);
        }}
        onSave={selectedPlayer ? handleUpdatePlayer : handleAddPlayer}
        player={selectedPlayer}
        clubs={clubs}
      />

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

export default Players;
