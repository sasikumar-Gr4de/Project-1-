// frontend/src/pages/Admin/QueueManagement.jsx
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import DataTable from "@/components/common/DataTable";
import AdminSection from "@/components/admin/AdminSection";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Play, Trash2, Eye, Filter, Activity } from "lucide-react";

const QueueManagement = () => {
  const { queue, fetchQueue, retryJob, deleteJob, isLoading } = useAdminStore();
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadQueue();
  }, [filters]);

  const loadQueue = async () => {
    await fetchQueue(filters);
  };

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const columns = [
    {
      accessorKey: "users.player_name",
      header: "Player",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-white">
            {row.users?.player_name || "Unknown Player"}
          </div>
          <div className="text-xs text-[#B0AFAF]">{row.users?.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "match_date",
      header: "Match Date",
      cell: ({ row }) => (
        <span className="text-white text-sm">
          {new Date(row?.match_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row?.position || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row?.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Submitted",
      cell: ({ row }) => (
        <span className="text-[#B0AFAF] text-sm">
          {new Date(row?.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20 hover:bg-[#60A5FA]/20"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          {row.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => retryJob(row.id)}
              className="h-8 px-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            >
              <Play className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteJob(row.id)}
            className="h-8 px-3 bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/20"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const statusFilters = [
    { value: "all", label: "All Status", count: queue.pagination?.total || 0 },
    {
      value: "uploaded",
      label: "Uploaded",
      count:
        queue.items?.filter((item) => item.status === "uploaded").length || 0,
    },
    {
      value: "pending",
      label: "Pending",
      count:
        queue.items?.filter((item) => item.status === "pending").length || 0,
    },
    {
      value: "processing",
      label: "Processing",
      count:
        queue.items?.filter((item) => item.status === "processing").length || 0,
    },
    {
      value: "completed",
      label: "Completed",
      count:
        queue.items?.filter((item) => item.status === "completed").length || 0,
    },
    {
      value: "failed",
      label: "Failed",
      count:
        queue.items?.filter((item) => item.status === "failed").length || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Orbitron']">
            Queue Management
          </h1>
          <p className="text-[#B0AFAF] mt-2 font-['Orbitron']">
            Monitor and manage data processing jobs
          </p>
        </div>
        <Button
          onClick={loadQueue}
          disabled={isLoading}
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12"
        >
          <RefreshCw
            className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Status Filters */}
      <AdminSection
        title="Queue Status Filters"
        description="Filter jobs by processing status"
        icon={Filter}
      >
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={filters.status === filter.value ? "default" : "outline"}
              onClick={() => handleStatusFilter(filter.value)}
              className={`flex items-center space-x-2 ${
                filters.status === filter.value
                  ? "bg-primary text-[#0F0F0E] border-primary"
                  : "bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626]"
              }`}
            >
              <span>{filter.label}</span>
              <Badge
                variant={
                  filters.status === filter.value ? "secondary" : "outline"
                }
                className="ml-1"
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </AdminSection>

      {/* Queue Table */}
      {/* <AdminSection
        title="Processing Queue"
        description="All data processing jobs in the system"
        icon={Activity}
      > */}
      <DataTable
        columns={columns}
        data={queue.items || []}
        isLoading={isLoading}
        pagination={queue.pagination}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setFilters((prev) => ({ ...prev, limit: pageSize, page: 1 }))
        }
        emptyStateTitle="No Jobs in Queue"
        emptyStateDescription="There are no data processing jobs in the queue at the moment."
      />
      {/* </AdminSection> */}
    </div>
  );
};

export default QueueManagement;
