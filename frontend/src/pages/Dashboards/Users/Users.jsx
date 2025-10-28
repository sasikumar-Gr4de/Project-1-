import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import EditUserModal from "@/components/modals/EditUserModal";
import { useUsersStore } from "@/store/users.store";
import {
  Mail,
  User,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { capitalize } from "@/utils/helper.utils";
import { useToast } from "@/contexts/ToastContext";
import { formatDate } from "@/utils/formatter.utils";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: "",
    userName: "",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    role: "",
    client_type: "",
    is_active: "",
  });

  const { getAllUsers, updateUser, deleteUser, activateUser, deactivateUser } =
    useUsersStore();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    search = "",
    filterParams = filters
  ) => {
    setIsLoading(true);
    try {
      const allFilters = { ...filterParams };
      if (search) allFilters.search = search;

      const result = await getAllUsers(page, pageSize, allFilters);

      if (result.success === true) {
        const { users: usersData, pagination: paginationData } = result.data;
        setUsers(usersData || []);
        setPagination({
          page: paginationData.page,
          pageSize: paginationData.pageSize,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchAllUsers(newPage, pagination.pageSize, searchTerm, filters);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchAllUsers(1, newPageSize, searchTerm, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchAllUsers(1, pagination.pageSize, searchTerm, newFilters);
  };

  const handleUpdateUser = async (userId, updateData) => {
    try {
      const result = await updateUser(userId, updateData);
      if (result.success) {
        toast({
          title: "Success",
          description: "User updated successfully",
          variant: "success",
        });
        fetchAllUsers(
          pagination.page,
          pagination.pageSize,
          searchTerm,
          filters
        );
        setEditModal({ isOpen: false, user: null });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      const result = user.is_active
        ? await deactivateUser(user.id)
        : await activateUser(user.id);

      if (result.success) {
        toast({
          title: "Success",
          description: `User ${
            user.is_active ? "deactivated" : "activated"
          } successfully`,
          variant: "success",
        });
        fetchAllUsers(
          pagination.page,
          pagination.pageSize,
          searchTerm,
          filters
        );
      } else {
        toast({
          title: "Error",
          description:
            result.error ||
            `Failed to ${user.is_active ? "deactivate" : "activate"} user`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          user.is_active ? "deactivate" : "activate"
        } user`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const result = await deleteUser(deleteModal.userId);
      if (result.success === true) {
        toast({
          title: "Success",
          description: "User deleted successfully",
          variant: "success",
        });
        fetchAllUsers(
          pagination.page,
          pagination.pageSize,
          searchTerm,
          filters
        );
        setDeleteModal({ isOpen: false, userId: "", userName: "" });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user) => {
    setEditModal({ isOpen: true, user });
  };

  const getRoleVariant = (role) => {
    const variants = {
      admin: "destructive",
      coach: "default",
      player: "secondary",
      parent: "outline",
      "data-reviewer": "default",
      annotator: "secondary",
    };
    return variants[role] || "secondary";
  };

  const getClientTypeVariant = (clientType) => {
    return clientType === "internal" ? "default" : "outline";
  };

  const UserAvatar = ({ user, className = "w-10 h-10" }) => {
    const gradientClass = `bg-gradient-to-br from-primary/80 to-primary/60`;

    return (
      <div
        className={`${className} rounded-full ${gradientClass} flex items-center justify-center text-primary-foreground shadow-sm border`}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : user?.full_name ? (
          <span className="text-sm font-semibold">
            {user.full_name
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

  const StatusBadge = ({ isActive, emailVerified }) => (
    <div className="flex flex-col space-y-1">
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={`text-xs font-medium ${
          isActive
            ? "bg-green-500/10 text-green-600 border border-green-500/20"
            : "bg-red-500/10 text-red-600 border border-red-500/20"
        }`}
      >
        {isActive ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        )}
        {isActive ? "Active" : "Inactive"}
      </Badge>
      <Badge
        variant={emailVerified ? "default" : "secondary"}
        className={`text-xs font-medium ${
          emailVerified
            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
            : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
        }`}
      >
        {emailVerified ? "Verified" : "Unverified"}
      </Badge>
    </div>
  );

  const ActionButton = ({
    icon: Icon,
    onClick,
    color = "primary",
    tooltip,
    size = "sm",
  }) => (
    <Button
      variant="ghost"
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

  const userColumns = [
    {
      header: "User",
      accessor: "full_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 min-w-0">
          <UserAvatar user={row} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm truncate">
              {row.full_name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Mail className="w-3 h-3 text-muted-foreground/70" />
              <span className="text-xs text-muted-foreground truncate">
                {row.email}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Role & Type",
      accessor: "role",
      cell: ({ row }) => (
        <div className="space-y-2">
          <Badge
            variant={getRoleVariant(row.role)}
            className="text-xs font-medium bg-primary/10 text-primary border border-primary/20"
          >
            <Shield className="w-3 h-3 mr-1" />
            {capitalize(row.role)}
          </Badge>
          {/* <Badge
            variant={getClientTypeVariant(row.client_type)}
            className="text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
          >
            {capitalize(row.client_type)}
          </Badge> */}
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "phone_number",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="w-3 h-3 text-muted-foreground/70" />
            <span className="text-xs text-foreground/90 truncate">
              {row.email}
            </span>
          </div>
          {row.phone_number && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {row.phone_number}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "is_active",
      cell: ({ row }) => (
        <StatusBadge
          isActive={row.is_active}
          emailVerified={row.email_verified}
        />
      ),
    },
    {
      header: "Last Activity",
      accessor: "last_login",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-muted-foreground/70" />
            <span className="text-xs text-foreground/90">
              {row.last_login ? formatDate(row.last_login) : "Never"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Joined {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },
  ];

  const userActions = ({ row }) => (
    <div className="flex items-center space-x-2 transition-all duration-200">
      <ActionButton
        icon={row.is_active ? XCircle : CheckCircle}
        onClick={() => handleStatusToggle(row)}
        color={row.is_active ? "destructive" : "primary"}
        tooltip={row.is_active ? "Deactivate user" : "Activate user"}
      />
      <ActionButton
        icon={Edit}
        onClick={() => handleEditUser(row)}
        color="primary"
        tooltip="Edit user"
      />
      <ActionButton
        icon={Trash2}
        onClick={() =>
          setDeleteModal({
            isOpen: true,
            userId: row.id,
            userName: row.full_name,
          })
        }
        color="destructive"
        tooltip="Delete user"
      />
    </div>
  );

  const FilterBar = () => {
    const activeFiltersCount = Object.values(filters).filter(
      (value) => value !== ""
    ).length;

    return (
      <Card className="w-full border-l-primary/20 shadow-sm hover:shadow-md transition-all duration-200 bg-linear-to-r from-card to-card/95 backdrop-blur-sm">
        <CardContent className="p-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Header Section */}
            <div className="flex items-center space-x-3">
              {/* <div className="p-2 rounded-lg bg-primary/10">
                <Filter className="w-5 h-5 text-primary" />
              </div> */}
              <div>
                {/* <h3 className="font-semibold text-foreground flex items-center gap-2">
                  User Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-primary/10 text-primary border-primary/20"
                    >
                      {activeFiltersCount} active
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Filter users by role, type, and status
                </p> */}
              </div>
            </div>

            {/* Filters Section */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Role Filter */}
              <div className="space-y-2">
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger id="role-filter" className="w-full">
                    <SelectValue placeholder="Filtter by roles..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">All Roles</SelectItem> */}
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="data-reviewer">Data Reviewer</SelectItem>
                    <SelectItem value="annotator">Annotator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Type Filter */}
              <div className="space-y-2">
                {/* <Label
                  htmlFor="client-type-filter"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Client Type
                </Label> */}
                <Select
                  value={filters.client_type}
                  onValueChange={(value) =>
                    handleFilterChange("client_type", value)
                  }
                >
                  <SelectTrigger id="client-type-filter" className="w-full">
                    <SelectValue placeholder="Filter by user types..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">All Types</SelectItem> */}
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                {/* <Label
                  htmlFor="status-filter"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  {filters.is_active === "true" ? (
                    <UserCheck className="w-4 h-4 text-green-600" />
                  ) : filters.is_active === "false" ? (
                    <UserX className="w-4 h-4 text-red-600" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                  Status
                </Label> */}
                <Select
                  value={filters.is_active}
                  onValueChange={(value) =>
                    handleFilterChange("is_active", value)
                  }
                >
                  <SelectTrigger id="status-filter" className="w-full">
                    <SelectValue placeholder="Filter by user status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">All Status</SelectItem> */}
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex items-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ role: "", client_type: "", is_active: "" });
                    fetchAllUsers(1, pagination.pageSize, searchTerm, {});
                  }}
                  className="flex-1 h-10 border-dashed hover:border-solid transition-all duration-200"
                  disabled={activeFiltersCount === 0}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {filters.role && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-700 border-blue-200"
                  >
                    Role: {capitalize(filters.role)}
                  </Badge>
                )}
                {filters.client_type && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/10 text-purple-700 border-purple-200"
                  >
                    Type: {capitalize(filters.client_type)}
                  </Badge>
                )}
                {filters.is_active && (
                  <Badge
                    variant="secondary"
                    className={
                      filters.is_active === "true"
                        ? "bg-green-500/10 text-green-700 border-green-200"
                        : "bg-red-500/10 text-red-700 border-red-200"
                    }
                  >
                    Status:{" "}
                    {filters.is_active === "true" ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-linear-to-r  rounded-lg ">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage system users, roles, and access permissions
          </p>
        </div>
        {/* <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <Shield className="w-8 h-8 text-primary" />
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {pagination.total}
            </div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Data Table */}
      <DataTable
        data={users}
        columns={userColumns}
        title=""
        searchable={true}
        searchPlaceholder="Search users by name or email..."
        actions={userActions}
        isLoading={isLoading}
        onAdd={null}
        addButtonText=""
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyStateTitle="No Users Found"
        emptyStateDescription="No users match your current filters. Try adjusting your search criteria."
        tableHeight="600px"
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        onSave={(updateData) => handleUpdateUser(editModal.user.id, updateData)}
        user={editModal.user}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, userId: "", userName: "" })
        }
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone and will permanently remove the user from the system.`}
      />
    </div>
  );
};

export default Users;
