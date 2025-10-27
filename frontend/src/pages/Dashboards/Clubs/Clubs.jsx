import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import AddClubModal from "@/components/modals/AddClubModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { Edit, Calendar, Users, Trophy, Shield, Trash2 } from "lucide-react";
import { useClubsStore } from "@/store/clubs.store";
import { useToast } from "@/contexts/ToastContext";
import { Link } from "react-router-dom";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, clubId: "" });
  const [selectedClub, setSelectedClub] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const { getAllClubs, createClub, updateClub, deleteClub } = useClubsStore();

  useEffect(() => {
    fetchAllClubs();
  }, []);

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
      toast({
        title: "Error",
        description: "Failed to fetch clubs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        toast({
          title: "Success",
          description: "Club added successfully",
          variant: "success",
        });
        fetchAllClubs(pagination.page, pagination.pageSize);
        setShowAddModal(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add club",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding club:", error);
      toast({
        title: "Error",
        description: "Failed to add club",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClub = async (updatedData) => {
    try {
      const { club_id } = updatedData;
      const result = await updateClub(club_id, updatedData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Club updated successfully",
          variant: "success",
        });
        fetchAllClubs(pagination.page, pagination.pageSize);
        setSelectedClub(null);
        setShowAddModal(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update club",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating club:", error);
      toast({
        title: "Error",
        description: "Failed to update club",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClub = async () => {
    try {
      const result = await deleteClub(deleteModal.clubId);
      if (result.success === true) {
        toast({
          title: "Success",
          description: "Club deleted successfully",
          variant: "success",
        });
        fetchAllClubs(pagination.page, pagination.pageSize);
        setDeleteModal({ isOpen: false, clubId: "" });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete club",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting club:", error);
      toast({
        title: "Error",
        description: "Failed to delete club",
        variant: "destructive",
      });
    }
  };

  const handleEditClub = (club) => {
    setSelectedClub(club);
    setShowAddModal(true);
  };

  const ClubAvatar = ({ club, className = "w-8 h-8" }) => {
    const gradientClass = club?.mark_url
      ? `bg-gradient-to-br from-transparent to-transparent`
      : `bg-gradient-to-br from-primary/80 to-primary/60`;

    return (
      <div
        className={`${className} rounded-full ${gradientClass} flex items-center justify-center text-primary-foreground shadow-sm`}
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
            variant="primary"
            className="text-xs font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20"
          >
            {row.players?.length || 0}
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
            className="text-xs font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20"
          >
            {(row.matches_home?.length || 0) + (row.matches_away?.length || 0)}
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

  const clubActions = ({ row }) => (
    <div className="flex items-center space-x-2 transition-all duration-200">
      <ActionButton
        icon={Edit}
        onClick={() => handleEditClub(row)}
        color="primary"
        tooltip="Edit club"
      />
      <Link to={`/clubs/${row.club_id}`}>
        <ActionButton
          icon={Users}
          onClick={() => console.log("View players", row)}
          color="secondary"
          tooltip="View players"
        />
      </Link>
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
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyStateTitle="No Clubs Found"
        emptyStateDescription="Get started by adding your first football club to the system."
      />

      <AddClubModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedClub(null);
        }}
        onSave={selectedClub ? handleUpdateClub : handleAddClub}
        club={selectedClub}
      />

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
