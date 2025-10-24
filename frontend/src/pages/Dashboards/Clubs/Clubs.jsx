import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/common/DataTable";
import AddClubModal from "@/components/modals/AddClubModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import {
  Search,
  Edit,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Shield,
  TrashIcon,
} from "lucide-react";
import { useClubsStore } from "@/store/clubs.store";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    fetchAllClubs(1, newPageSize); // Reset to first page when changing page size
  };

  const handleAddClub = async (clubData) => {
    try {
      const result = await createClub(clubData);
      if (result.success) {
        const newClub = result.data;
        setClubs((prev) => [newClub, ...prev]);
        // Refresh to get updated pagination
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
      // Refresh to get updated pagination
      fetchAllClubs(pagination.page, pagination.pageSize);
    }
  };

  const handleEditClub = async (club) => {
    setSelectedClub(club);
    setShowAddModal(true);
  };

  // Default avatar component for clubs
  const DefaultAvatar = ({ className = "w-6 h-6" }) => (
    <div
      className={`${className} rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white`}
    >
      <Shield className="w-4 h-4" />
    </div>
  );

  // Table columns
  const clubColumns = [
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
        <Users className="w-4 h-4" />
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
      {/* Clubs Table */}
      <DataTable
        data={clubs}
        columns={clubColumns}
        title="All Clubs"
        actions={clubActions}
        isLoading={isLoading}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add New Club"
        searchPlaceholder="Search Clubs ... "
        // Pagination props
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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
