import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddPlayerModal from "@/components/modals/AddPlayerModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { mockPlayers, mockClubs } from "@/mock/data";
import {
  Search,
  Calendar,
  MapPin,
  Ruler,
  Scale,
  Shirt,
  Edit,
  Trash2,
  Eye,
  User,
} from "lucide-react";

const Players = () => {
  const [players, setPlayers] = useState(mockPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playerId: "",
  });
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Filter players based on search
  const filteredPlayers = players.filter(
    (player) =>
      player.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    total: players.length,
    active: players.filter((player) => player.status === "Active").length,
    clubs: new Set(players.map((player) => player.current_club)).size,
  };

  const handleAddPlayer = (playerData) => {
    const club = mockClubs.find(
      (club) => club.club_id === playerData.current_club
    );

    const newPlayer = {
      ...playerData,
      player_id: `player-${Date.now()}`,
      club_name: club?.club_name || "Unknown Club",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const handleDeletePlayer = () => {
    setPlayers((prev) =>
      prev.filter((player) => player.player_id !== deleteModal.playerId)
    );
    setDeleteModal({ isOpen: false, playerId: "" });
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setShowAddModal(true);
  };

  const handleUpdatePlayer = (updatedData) => {
    const club = mockClubs.find(
      (club) => club.club_id === updatedData.current_club
    );

    const updatedPlayer = {
      ...updatedData,
      club_name: club?.club_name || "Unknown Club",
      updated_at: new Date().toISOString(),
    };

    setPlayers((prev) =>
      prev.map((player) =>
        player.player_id === selectedPlayer.player_id
          ? { ...player, ...updatedPlayer }
          : player
      )
    );
    setSelectedPlayer(null);
  };

  // Calculate age from date of birth
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

  // Default avatar component for players
  const DefaultAvatar = ({ className = "w-12 h-12", name }) => (
    <div
      className={`${className} rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold shadow-sm`}
    >
      {name ? (
        <span className="text-lg">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      ) : (
        <User className="w-6 h-6" />
      )}
    </div>
  );

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "injured":
        return "destructive";
      case "suspended":
        return "outline";
      case "inactive":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Table columns
  const playerColumns = [
    {
      header: "Player",
      accessor: "full_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
          {row.avatar_url ? (
            <img
              src={row.avatar_url}
              alt={row.full_name}
              className="w-12 h-12 rounded-full object-cover border shadow-sm"
            />
          ) : (
            <DefaultAvatar name={row.full_name} />
          )}
          <div>
            <p className="font-semibold text-foreground">{row.full_name}</p>
            <p className="text-sm text-muted-foreground">
              #{row.jersey_number}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Position",
      accessor: "position",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-medium">
          {row.position}
        </Badge>
      ),
    },
    {
      header: "Club",
      accessor: "current_club",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Shirt className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{row.current_club}</span>
        </div>
      ),
    },
    {
      header: "Age",
      accessor: "date_of_birth",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{calculateAge(row.date_of_birth)}</span>
        </div>
      ),
    },
    {
      header: "Nationality",
      accessor: "nationality",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{row.nationality}</span>
        </div>
      ),
    },
    {
      header: "Height",
      accessor: "height_cm",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          <span>{row.height_cm} cm</span>
        </div>
      ),
    },
    {
      header: "Weight",
      accessor: "weight_kg",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <span>{row.weight_kg} kg</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.status)} className="font-medium">
          {row.status}
        </Badge>
      ),
    },
  ];

  // Table actions
  const playerActions = ({ row }) => (
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
        onClick={() => handleEditPlayer(row)}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          setDeleteModal({ isOpen: true, playerId: row.player_id })
        }
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
              placeholder="Search players by name, position, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
        {/* <div className="flex items-center space-x-3">
          <div className="text-sm text-muted-foreground">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
        </div> */}
      </div>

      {/* Players Table */}
      <DataTable
        data={filteredPlayers}
        columns={playerColumns}
        title="All Players"
        searchable={false}
        actions={playerActions}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add New Player"
      />

      {/* Add/Edit Player Modal */}
      <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPlayer(null);
        }}
        onSave={selectedPlayer ? handleUpdatePlayer : handleAddPlayer}
        player={selectedPlayer}
        clubs={mockClubs}
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

export default Players;
