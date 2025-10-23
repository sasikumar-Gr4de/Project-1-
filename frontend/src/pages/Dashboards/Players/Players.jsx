import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddPlayerModal from "@/components/modals/AddPlayerModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { mockPlayers } from "@/mock/data";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Shirt,
  Scale,
  Ruler,
  Trophy,
  Edit,
  Trash2,
  Eye,
  User,
  Target,
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
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.club_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    total: players.length,
    active: players.filter((player) => player.status === "active").length,
    clubs: new Set(players.map((player) => player.club_name)).size,
  };

  const handleAddPlayer = (playerData) => {
    const newPlayer = {
      ...playerData,
      player_id: `player-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "active",
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
    setPlayers((prev) =>
      prev.map((player) =>
        player.player_id === selectedPlayer.player_id
          ? { ...player, ...updatedData, updated_at: new Date().toISOString() }
          : player
      )
    );
    setSelectedPlayer(null);
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

  // Stats Cards
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Table columns
  const playerColumns = [
    {
      header: "Player",
      accessor: "name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
          {row.avatar_url ? (
            <img
              src={row.avatar_url}
              alt={row.name}
              className="w-12 h-12 rounded-full object-cover border shadow-sm"
            />
          ) : (
            <DefaultAvatar name={row.name} />
          )}
          <div>
            <p className="font-semibold text-foreground">{row.name}</p>
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
      accessor: "club_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Shirt className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{row.club_name}</span>
        </div>
      ),
    },
    {
      header: "Age",
      accessor: "age",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{row.age}</span>
        </div>
      ),
    },
    {
      header: "Height",
      accessor: "height",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          <span>{row.height} cm</span>
        </div>
      ),
    },
    {
      header: "Weight",
      accessor: "weight",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <span>{row.weight} kg</span>
        </div>
      ),
    },
    {
      header: "Goals",
      accessor: "goals",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold">{row.goals || 0}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      badge: true,
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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Players</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all players in your organization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Players"
          value={stats.total}
          icon={User}
          color="blue"
        />
        <StatCard
          title="Active Players"
          value={stats.active}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Clubs"
          value={stats.clubs}
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Search Section */}
      <Card className="bg-card border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search players by name, position, or club..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPlayers.length} of {players.length} players
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
