import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useToast } from "@/contexts/ToastContext";
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
} from "lucide-react";

const PassportManager = () => {
  const { users, fetchUsers, isLoading } = useAdminStore();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    verification: "all",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      await fetchUsers();
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
  };

  const getVerificationBadge = (user) => {
    // This would come from the user's verification status in a real implementation
    console.log(user)
    const status = "verified";

    switch (status) {
      case "verified":
        return {
          label: "Verified",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: CheckCircle,
        };
      case "pending":
        return {
          label: "Pending",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: Clock,
        };
      default:
        return {
          label: "Unverified",
          color: "bg-[var(--surface-2)] text-[var(--muted-text)] border-[var(--surface-2)]",
          icon: XCircle,
        };
    }
  };

  const filteredUsers =
    users.items?.filter((user) => {
      if (
        filters.search &&
        !user.player_name?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.status !== "all" && user.status !== filters.status) {
        return false;
      }
      // Verification filter would be implemented with real data
      return true;
    }) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Passport Management
          </h1>
          <p className="text-[var(--muted-text)] text-lg mt-2 font-['Orbitron']">
            Manage player passports and verification status
          </p>
        </div>
        <Button className="bg-linear-to-r from-primary to-[var(--accent-2)] text-[var(--ink)] hover:from-[var(--accent-2)] hover:to-primary font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <AdminSection
        title="Filters & Search"
        description="Filter players by status, verification, or search by name"
        icon={Filter}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
              <Input
                placeholder="Search players..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-[var(--surface-0)] border-[var(--surface-2)] text-foreground placeholder:text-[var(--muted-text)]"
              />
            </div>
          </div>

            <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
              <SelectTrigger className="bg-[var(--surface-0)] border-[var(--surface-2)] text-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface-1)] border-[var(--surface-2)] text-foreground">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.verification}
              onValueChange={(value) =>
                handleFilterChange("verification", value)
              }
            >
              <SelectTrigger className="bg-[var(--surface-0)] border-[var(--surface-2)] text-foreground">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface-1)] border-[var(--surface-2)] text-foreground">
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </AdminSection>

  
      {/* Users Grid */}
      <div className="grid gap-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[var(--surface-1)] border-[var(--surface-2)]"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--surface-2)] rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--surface-2)] rounded w-1/4"></div>
                    <div className="h-3 bg-[var(--surface-2)] rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const verification = getVerificationBadge(user);
            const IconComponent = verification.icon;

            return (
              <Card
                key={user.id}
                className="bg-[var(--surface-1)] border-[var(--surface-2)] hover:border-primary/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-linear-to-br from-primary to-[var(--accent-2)] rounded-full flex items-center justify-center shadow-lg">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.player_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--surface-0)]"
                          />
                        ) : (
                          <User className="w-6 h-6 text-[var(--ink)]" />
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <h3 className="font-semibold text-white">
                          {user.player_name || "Unnamed Player"}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-[var(--muted-text)] mt-1">
                          <span>{user.email}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {user.position || "No position"}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Verification Status */}
                      <Badge className={verification.color}>
                        <div className="flex items-center space-x-1">
                          <IconComponent className="w-3 h-3" />
                          <span>{verification.label}</span>
                        </div>
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/player/${user.id}/passport`}>
                            <FileText className="w-4 h-4 mr-1" />
                            View Passport
                          </a>
                        </Button>
                        <Button size="sm" asChild>
                          <a href={`/admin/verifications?user=${user.id}`}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
      // Empty state
      <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
            <CardContent className="p-12 text-center">
          <User className="w-16 h-16 text-[var(--muted-text)] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No players found
              </h3>
              <p className="text-[var(--muted-text)]">
                {filters.search ||
                filters.status !== "all" ||
                filters.verification !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No players have been registered yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PassportManager;
