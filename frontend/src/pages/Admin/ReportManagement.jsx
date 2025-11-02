// frontend/src/pages/Admin/ReportManagement.jsx
import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import DataTable from "@/components/common/DataTable";
import AdminSection from "@/components/admin/AdminSection";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Trash2,
  Eye,
} from "lucide-react";

const ReportManagement = () => {
  const { reports, fetchReports, deleteReport, regenerateReport, isLoading } =
    useAdminStore();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    await fetchReports(filters);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-[#10B981]";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  const columns = [
    {
      accessorKey: "users.player_name",
      header: "Player",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-white">
            {row.original.users?.player_name || "Unknown Player"}
          </div>
          <div className="text-xs text-[#B0AFAF]">
            {row.original.users?.position}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "player_data.match_date",
      header: "Match Date",
      cell: ({ row }) => (
        <span className="text-white text-sm">
          {row.original.player_data?.match_date
            ? new Date(row.original.player_data.match_date).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "overall_score",
      header: "Score",
      cell: ({ row }) => (
        <div
          className={`text-2xl font-bold ${getScoreColor(
            row.getValue("overall_score")
          )}`}
        >
          {row.getValue("overall_score") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "created_at",
      header: "Generated",
      cell: ({ row }) => (
        <span className="text-[#B0AFAF] text-sm">
          {new Date(row.getValue("created_at")).toLocaleDateString()}
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
          {row.original.pdf_url && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            >
              <Download className="w-3 h-3 mr-1" />
              PDF
            </Button>
          )}
          {row.original.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerateReport(row.original.id)}
              className="h-8 px-3 bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteReport(row.original.id)}
            className="h-8 px-3 bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/20"
          >
            <Trash2 className="w-3 h-3 mr-1" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Orbitron']">
            Report Management
          </h1>
          <p className="text-[#B0AFAF] mt-2 font-['Orbitron']">
            View and manage all generated performance reports
          </p>
        </div>
        <Button
          onClick={loadReports}
          disabled={isLoading}
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12"
        >
          <FileText className="w-5 h-5 mr-2" />
          Refresh Reports
        </Button>
      </div>

      {/* Filters */}
      <AdminSection
        title="Report Filters"
        description="Filter reports by status or search by player name"
        icon={Filter}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0AFAF] w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports by player name..."
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
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
                page: 1,
              }))
            }
            className="px-4 py-2 bg-[#1A1A1A] border border-[#343434] rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Status</option>
            <option value="generating">Generating</option>
            <option value="generated">Generated</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </AdminSection>

      {/* Reports Table */}
      <AdminSection
        title="Performance Reports"
        description="All generated player performance reports"
        icon={FileText}
      >
        <DataTable
          columns={columns}
          data={reports.items || []}
          isLoading={isLoading}
          pagination={reports.pagination}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) =>
            setFilters((prev) => ({ ...prev, limit: pageSize, page: 1 }))
          }
          emptyStateTitle="No Reports Found"
          emptyStateDescription="No reports match your current filters."
        />
      </AdminSection>
    </div>
  );
};

export default ReportManagement;
