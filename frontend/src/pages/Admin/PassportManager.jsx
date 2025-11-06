// PassportManager.jsx - Updated with DataTable
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useToast } from "@/contexts/ToastContext";
import DataTable from "@/components/common/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AdminSection from "@/components/admin/AdminSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  User,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Filter,
  Eye,
  Shield,
} from "lucide-react";

const PassportManager = () => {
  const { users, fetchUsers, isLoading } = useAdminStore();
  const { toast } = useToast();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    verification: "all",
  });

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page, pagination.limit]);

  const loadUsers = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const data = await fetchUsers(params);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const getVerificationBadge = (user) => {
    // This would come from the user's verification status in a real implementation
    // For now, using a mock status based on user data
    const status = user.is_verified
      ? "verified"
      : user.verification_status === "pending"
      ? "pending"
      : "unverified";

    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Inactive
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Archived
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  // DataTable columns configuration
  const columns = [
    {
      header: "Player",
      accessor: "player_name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-full flex items-center justify-center">
            {row.avatar_url ? (
              <img
                src={row.avatar_url}
                alt={row.player_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#0F0F0E]"
              />
            ) : (
              <User className="w-5 h-5 text-[#0F0F0E]" />
            )}
          </div>
          <div>
            <div className="font-medium text-white">
              {row.player_name || "Unnamed Player"}
            </div>
            <div className="text-sm text-gray-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Position",
      accessor: "position",
      cell: ({ row }) => (
        <span className="text-white capitalize">
          {row.position || "No position"}
        </span>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: ({ row }) => (
        <span className="text-white capitalize">{row.role}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => getStatusBadge(row.status),
    },
    {
      header: "Verification",
      accessor: "verification",
      cell: ({ row }) => getVerificationBadge(row),
    },
    {
      header: "Joined",
      accessor: "created_at",
      cell: ({ row }) => (
        <span className="text-gray-400">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  // DataTable actions
  const actions = ({ row }) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="bg-[#262626] border-[#343434] text-white hover:bg-[#343434]"
      >
        <a href={`/player/${row.id}/passport`}>
          <Eye className="w-4 h-4" />
        </a>
      </Button>
      <Button
        size="sm"
        asChild
        className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
      >
        <a href={`/admin/verifications?user=${row.id}`}>
          <Shield className="w-4 h-4" />
        </a>
      </Button>
    </div>
  );

  // Stats calculation
  const stats = {
    total: pagination.total,
    active: users.items?.filter((user) => user.status === "active").length || 0,
    verified: users.items?.filter((user) => user.is_verified).length || 0,
    pending:
      users.items?.filter((user) => user.verification_status === "pending")
        .length || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Passport Management
          </h1>
          <p className="text-gray-400 text-lg mt-2 font-['Orbitron']">
            Manage player passports and verification status
          </p>
        </div>
        <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-[#262626] border-[#343434]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Players
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Verified</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.verified}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <AdminSection
        title="Filters & Search"
        description="Filter players by status, verification, or search by name"
        icon={Filter}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search players..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-[#343434] text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#343434] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-[#343434] text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.verification}
            onValueChange={(value) => handleFilterChange("verification", value)}
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#343434] text-white">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-[#343434] text-white">
              <SelectItem value="all">All Verification</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminSection>

      {/* DataTable */}
      <DataTable
        data={users.items || []}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        }}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onPageSizeChange={(limit) =>
          setPagination((prev) => ({ ...prev, limit, page: 1 }))
        }
        emptyStateTitle="No players found"
        emptyStateDescription={
          filters.search ||
          filters.status !== "all" ||
          filters.verification !== "all"
            ? "Try adjusting your filters to see more results."
            : "No players have been registered yet."
        }
      />
    </div>
  );
};

export default PassportManager;
