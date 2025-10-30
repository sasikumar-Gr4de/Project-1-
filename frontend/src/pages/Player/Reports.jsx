import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import DataTable from "@/components/common/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar } from "lucide-react";
import {
  formatDate,
  getBadgeVariant,
  getScoreColor,
} from "@/utils/helper.utils";

const Reports = () => {
  const { reports, pagination, isLoading, fetchReports, fetchReport } =
    useUserStore();

  useEffect(() => {
    fetchReports(pagination.page, pagination.pageSize);
  }, [pagination.page, pagination.pageSize]);

  const handlePageChange = (page) => {
    fetchReports(page, pagination.pageSize);
  };

  const handlePageSizeChange = (pageSize) => {
    fetchReports(1, pageSize);
  };

  const columns = [
    {
      header: "Date",
      accessor: "created_at",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{formatDate(row.created_at)}</span>
        </div>
      ),
    },
    {
      header: "GR4DE Score",
      accessor: "overall_score",
      cell: ({ row }) => (
        <div
          className={`text-lg font-bold ${getScoreColor(row.overall_score)}`}
        >
          {row.overall_score}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      badge: true,
    },
    {
      header: "Technical",
      accessor: "score_json.technical",
      cell: ({ row }) => (
        <span className={getScoreColor(row.score_json?.technical)}>
          {row.score_json?.technical || "--"}
        </span>
      ),
    },
    {
      header: "Tactical",
      accessor: "score_json.tactical",
      cell: ({ row }) => (
        <span className={getScoreColor(row.score_json?.tactical)}>
          {row.score_json?.tactical || "--"}
        </span>
      ),
    },
    {
      header: "Physical",
      accessor: "score_json.physical",
      cell: ({ row }) => (
        <span className={getScoreColor(row.score_json?.physical)}>
          {row.score_json?.physical || "--"}
        </span>
      ),
    },
    {
      header: "Mental",
      accessor: "score_json.mental",
      cell: ({ row }) => (
        <span className={getScoreColor(row.score_json?.mental)}>
          {row.score_json?.mental || "--"}
        </span>
      ),
    },
  ];

  const actions = ({ row }) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleViewReport(row.id)}
        className="h-8 w-8"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDownloadReport(row.id)}
        className="h-8 w-8"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );

  const handleViewReport = (reportId) => {
    window.open(`/reports/${reportId}`, "_blank");
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const response = await fetchReport(reportId);
      if (response.success && response.data.pdf_url) {
        window.open(response.data.pdf_url, "_blank");
      }
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-muted-foreground">
            View your performance reports and track progress
          </p>
        </div>
        <Button asChild>
          <a href="/upload">
            <Download className="w-4 h-4 mr-2" />
            New Analysis
          </a>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {reports.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {reports.filter((r) => r.status === "generated").length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-500">
              {reports.filter((r) => r.status === "generating").length}
            </div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-500">
              {reports.reduce(
                (max, report) => Math.max(max, report.overall_score || 0),
                0
              )}
            </div>
            <p className="text-sm text-muted-foreground">Best Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Reports</CardTitle>
          <CardDescription>
            All your generated GR4DE reports with detailed scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={reports}
            columns={columns}
            actions={actions}
            isLoading={isLoading}
            pagination={{
              page: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              totalPages: pagination.totalPages,
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            emptyStateTitle="No Reports Yet"
            emptyStateDescription="Upload your first match data to generate performance reports."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
