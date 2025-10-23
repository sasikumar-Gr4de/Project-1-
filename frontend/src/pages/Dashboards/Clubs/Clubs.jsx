import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/common/DataTable";
import AddClubModal from "@/components/modals/AddClubModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { mockClubs } from "@/mock/data";
import {
  Search,
  Edit,
  BarChart3,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Shield,
  TrashIcon,
} from "lucide-react";
import { formatDate } from "@/utils/formatter.util";

const Clubs = () => {
  const [clubs, setClubs] = useState(mockClubs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, clubId: "" });
  const [selectedClub, setSelectedClub] = useState(null);

  // Filter clubs based on search
  const filteredClubs = clubs.filter(
    (club) =>
      club.club_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    total: clubs.length,
    active: clubs.filter((club) => club.status === "active").length,
    locations: new Set(clubs.map((club) => club.location)).size,
  };

  const handleAddClub = (clubData) => {
    const newClub = {
      ...clubData,
      club_id: `club-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "active",
      player_count: 0,
      match_count: 0,
    };
    setClubs((prev) => [...prev, newClub]);
  };

  const handleDeleteClub = () => {
    setClubs((prev) =>
      prev.filter((club) => club.club_id !== deleteModal.clubId)
    );
    setDeleteModal({ isOpen: false, clubId: "" });
  };

  const handleEditClub = (club) => {
    setSelectedClub(club);
    setShowAddModal(true);
  };

  const handleUpdateClub = (updatedData) => {
    setClubs((prev) =>
      prev.map((club) =>
        club.club_id === selectedClub.club_id
          ? { ...club, ...updatedData, updated_at: new Date().toISOString() }
          : club
      )
    );
    setSelectedClub(null);
  };

  // Default avatar component for clubs
  const DefaultAvatar = ({ className = "w-10 h-10" }) => (
    <div
      className={`${className} rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white`}
    >
      <Shield className="w-5 h-5" />
    </div>
  );

  // Table columns
  const clubColumns = [
    {
      header: "Club ID",
      accessor: "club_id",
    },
    {
      header: "Club",
      accessor: "club_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          {row.mark_url ? (
            <img
              src={row.mark_url}
              alt={row.club_name}
              className="w-10 h-10 rounded-full object-cover border shadow-sm"
            />
          ) : (
            <DefaultAvatar />
          )}
          <div>
            <p className="font-medium text-foreground">{row.club_name}</p>
            {/* <p className="text-xs text-muted-foreground">{row.club_id}</p> */}
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      header: "Founded",
      accessor: "founded_year",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{row.founded_year}</span>
        </div>
      ),
    },
    {
      header: "Players",
      accessor: "player_count",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{row.player_count || 0}</span>
        </div>
      ),
    },
    {
      header: "Matches",
      accessor: "match_count",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-muted-foreground" />
          <span>{row.match_count || 0}</span>
        </div>
      ),
    },

    {
      header: "Created",
      accessor: "created_at",
      cell: ({ row }) => {
        formatDate(new Date(row.created_at));
      },
    },
  ];

  // Table actions
  const clubActions = ({ row }) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditClub(row)}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-blue-500/10 hover:text-blue-600"
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDeleteModal({ isOpen: true, clubId: row.club_id })}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {/* <Card className="bg-card border-border/50 shadow-card">
        <CardContent className="p-6"> */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search clubs by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Clubs Table */}
      <DataTable
        data={filteredClubs}
        columns={clubColumns}
        title="All Clubs"
        searchable={false}
        actions={clubActions}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add New Club"
      />

      {/* Add/Edit Club Modal */}
      <AddClubModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedClub(null);
        }}
        onSave={selectedClub ? handleUpdateClub : handleAddClub}
        club={selectedClub}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, clubId: "" })}
        onConfirm={handleDeleteClub}
        title="Delete Club"
        message="Are you sure you want to delete this club? This action cannot be undone and will remove all associated data."
      />
    </div>
  );
};

export default Clubs;
