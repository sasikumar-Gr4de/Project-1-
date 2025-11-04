import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import DataTable from "@/components/common/DataTable";
import AdminSection from "@/components/admin/AdminSection";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Filter, Mail, Ban, CheckCircle } from "lucide-react";

const UserManagement = () => {
  const { users, fetchUsers, updateUserStatus, isLoading } = useAdminStore();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    role: "all",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    await fetchUsers(filters);
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { variant: "primary", label: "Admin" },
      player: { variant: "default", label: "Player" },
      coach: { variant: "secondary", label: "Coach" },
    };

    const config = roleConfig[role] || roleConfig.player;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      accessorKey: "player_name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          {!row.avatar_url ? (
            <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-full flex items-center justify-center">
              <span className="text-[#0F0F0E] text-sm font-bold">
                {row.player_name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          ) : (
            <img
              src={row.avatar_url}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-medium text-white">
              {row.player_name || "Unknown User"}
            </div>
            <div className="text-xs text-[#B0AFAF]">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => getRoleBadge(row.role),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.status} />,
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.position || "Not set"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-[#B0AFAF] text-sm">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "tier_plan",
      header: "Plan",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.tier_plan}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-3">
            <Mail className="w-3 h-3 mr-1" />
            Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={() =>
              handleStatusUpdate(
                row.id,
                row.status === "active" ? "suspended" : "active"
              )
            }
          >
            {row.status === "active" ? (
              <>
                <Ban className="w-3 h-3 mr-1" />
                Suspend
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Activate
              </>
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-[#B0AFAF] mt-2 font-['Orbitron']">
            Manage player accounts and permissions
          </p>
        </div>
        <Button
          onClick={loadUsers}
          disabled={isLoading}
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12"
        >
          <Users className="w-5 h-5 mr-2" />
          Refresh Users
        </Button>
      </div>

      {/* Filters */}
      <AdminSection
        title="Filters & Search"
        description="Filter users by role, status, or search by name/email"
        icon={Filter}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0AFAF] w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#343434] rounded-lg text-white placeholder-[#B0AFAF] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value, page: 1 }))
            }
          >
            <SelectTrigger className="w-[150px] bg-[#1A1A1A] border border-[#343434] rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              {/* <SelectItem value="inactive">Inactive</SelectItem> */}
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.role}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, role: value, page: 1 }))
            }
          >
            <SelectTrigger className="w-[150px] bg-[#1A1A1A] border border-[#343434] rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminSection>

      {/* Users Table */}
      {/* <AdminSection
        title="User Accounts"
        description="All registered users in the system"
        icon={Users}
      > */}
      <DataTable
        columns={columns}
        data={users.items || []}
        isLoading={isLoading}
        pagination={users.pagination}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setFilters((prev) => ({ ...prev, limit: pageSize, page: 1 }))
        }
        emptyStateTitle="No Users Found"
        emptyStateDescription="No users match your current filters."
      />
      {/* </AdminSection> */}
    </div>
  );
};

export default UserManagement;
