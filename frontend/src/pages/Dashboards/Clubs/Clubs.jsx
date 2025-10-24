import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import AddClubModal from "@/components/modals/AddClubModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import {
  Edit,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Shield,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useClubsStore } from "@/store/clubs.store";
import { Badge } from "@/components/ui/badge";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, clubId: "" });
  const [selectedClub, setSelectedClub] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const { getAllClubs, createClub, updateClub, deleteClub } = useClubsStore();

  const fetchAllClubs = async (
    page = pagination.page,
    pageSize = pagination.pageSize
  ) => {
    setIsLoading(true);
    try {
      const result = await getAllClubs(page, pageSize);
      if (result.success === true) {
        const { data, pagination: paginationData } = result.data;
        setClubs(data || []);
        setPagination({
          page: paginationData.page,
          pageSize: paginationData.pageSize,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClubs();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAllClubs(newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchAllClubs(1, newPageSize);
  };

  const handleAddClub = async (clubData) => {
    try {
      const result = await createClub(clubData);
      if (result.success) {
        const newClub = result.data;
        setClubs((prev) => [newClub, ...prev]);
        fetchAllClubs(pagination.page, pagination.pageSize);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateClub = async (updatedData) => {
    try {
      const { club_id } = updatedData;
      const result = await updateClub(club_id, updatedData);
      if (result.success) {
        setClubs((prev) =>
          prev.map((club) =>
            club.club_id === club_id
              ? {
                  ...club,
                  ...updatedData,
                  updated_at: new Date().toISOString(),
                }
              : club
          )
        );
        setSelectedClub(null);
        setShowAddModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteClub = async () => {
    const result = await deleteClub(deleteModal.clubId);
    const { success } = result;
    if (success === true) {
      setClubs((prev) =>
        prev.filter((club) => club.club_id !== deleteModal.clubId)
      );
      setDeleteModal({ isOpen: false, clubId: "" });
      fetchAllClubs(pagination.page, pagination.pageSize);
    }
  };

  const handleEditClub = async (club) => {
    setSelectedClub(club);
    setShowAddModal(true);
  };

  // Beautiful gradient avatars for clubs
  const ClubAvatar = ({ club, className = "w-8 h-8" }) => {
    const gradientClass = club?.club_id
      ? `bg-gradient-to-br from-primary/80 to-primary/60`
      : `bg-gradient-to-br from-green-500/80 to-green-600/60`;

    return (
      <div
        className={`${className} rounded-full ${gradientClass} flex items-center justify-center text-primary-foreground shadow-sm border border-primary/20`}
      >
        {club?.mark_url ? (
          <img
            src={club.mark_url}
            alt={club.club_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Shield className="w-4 h-4" />
        )}
      </div>
    );
  };

  // Beautiful always-visible action buttons
  const ActionButton = ({
    icon: Icon,
    onClick,
    variant = "ghost",
    color = "primary",
    size = "sm",
    tooltip,
  }) => (
    <Button
      variant={variant}
      size={size}
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

  // Enhanced table columns with compact design
  const clubColumns = [
    {
      header: "Club",
      accessor: "club_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 min-w-0">
          <ClubAvatar club={row} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm truncate">
              {row.club_name}
            </p>
            {row.location && (
              <p className="text-xs text-muted-foreground truncate">
                {row.location}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Founded",
      accessor: "founded_year",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-sm font-medium text-foreground/90">
            {row.founded_year || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Players",
      accessor: "player_count",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground/70" />
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20"
          >
            {row.player_count || 0}
          </Badge>
        </div>
      ),
    },
    {
      header: "Matches",
      accessor: "match_count",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Trophy className="w-3.5 h-3.5 text-muted-foreground/70" />
          <Badge
            variant="outline"
            className="text-xs font-medium bg-background border-border/40"
          >
            {row.match_count || 0}
          </Badge>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <Badge
          variant="default"
          className="text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        >
          Active
        </Badge>
      ),
    },
  ];

  // Beautiful always-visible actions
  const clubActions = ({ row }) => (
    <div className="flex items-center space-x-2 transition-all duration-200">
      <ActionButton
        icon={Edit}
        onClick={() => handleEditClub(row)}
        color="primary"
        tooltip="Edit club"
      />
      <ActionButton
        icon={Users}
        onClick={() => console.log("View players", row)}
        color="secondary"
        tooltip="View players"
      />
      <ActionButton
        icon={Trash2}
        onClick={() => setDeleteModal({ isOpen: true, clubId: row.club_id })}
        color="destructive"
        tooltip="Delete club"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Clubs
          </h1>
          <p className="text-muted-foreground">
            Manage football clubs and their information
          </p>
        </div>
      </div>

      {/* Clubs Table */}
      <DataTable
        data={clubs}
        columns={clubColumns}
        title=""
        actions={clubActions}
        isLoading={isLoading}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add Club"
        searchable={true}
        searchPlaceholder="Search clubs..."
        // Pagination props
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyStateTitle="No Clubs Found"
        emptyStateDescription="Get started by adding your first football club to the system."
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
