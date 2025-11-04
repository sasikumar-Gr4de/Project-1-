import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Eye, Filter } from "lucide-react";

const ReportLibrary = ({ reports }) => {
  const [filter, setFilter] = useState("all");

  const filteredReports =
    reports?.filter((report) => {
      if (filter === "all") return true;
      return report.report_type === filter;
    }) || [];

  const getReportTypeColor = (type) => {
    switch (type) {
      case "weekly":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "monthly":
        return "bg-primary/20 text-primary border-primary/30";
      case "season":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-(--surface-2) text-(--muted-text) border-(--surface-2)";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPeriod = (start, end) => {
    const startDate = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endDate = new Date(end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startDate} - ${endDate}`;
  };

  const handleDownload = (report) => {
    if (report.pdf_url) {
      const link = document.createElement("a");
      link.href = report.pdf_url;
      link.download = `GR4DE_Report_${report.period_start}_${report.period_end}.pdf`;
      link.click();
    }
  };

  const handleView = (report) => {
    if (report.pdf_url) {
      window.open(report.pdf_url, "_blank");
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Report Library
          </CardTitle>
          <CardDescription className="text-(--muted-text)">
            Your performance reports will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-(--muted-text) mx-auto mb-4 opacity-50" />
            <p className="text-(--muted-text) text-lg">No reports available</p>
            <p className="text-sm text-(--muted-text) mt-2">
              Performance reports will be generated after match analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-(--surface-1) border-(--surface-2)">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Report Library
            </CardTitle>
            <CardDescription className="text-(--muted-text)">
              Access your complete performance report history
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-(--muted-text)" />
            {/* <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-(--surface-0) border border-(--surface-2) text-foreground text-sm rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 px-3 py-2 transition-all duration-300"
            >
              <option value="all">All Reports</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="season">Season</option>
            </select> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReports.map((report, index) => (
            <div
              key={report.report_id}
              className="flex items-center justify-between p-4 border rounded-xl bg-(--surface-0) border-(--surface-2) hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-(--accent-2) rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-(--ink)" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                      GR4DE{" "}
                      {report.report_type.charAt(0).toUpperCase() +
                        report.report_type.slice(1)}{" "}
                      Report
                    </h3>
                    <Badge className={getReportTypeColor(report.report_type)}>
                      {report.report_type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-(--muted-text) mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatPeriod(report.period_start, report.period_end)}
                      </span>
                    </div>
                    <span>•</span>
                    <span>Generated {formatDate(report.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(report)}
                  className="bg-(--surface-2) border-(--surface-2) text-foreground hover:bg-(--surface-3) hover:border-primary transition-all duration-300"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(report)}
                  className="bg-linear-to-r from-primary to-(--accent-2) text-(--ink) hover:from-(--accent-2) hover:to-primary font-semibold transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-(--surface-2)">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {reports.filter((r) => r.report_type === "weekly").length}
              </div>
              <div className="text-sm text-(--muted-text)">Weekly Reports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {reports.filter((r) => r.report_type === "monthly").length}
              </div>
              <div className="text-sm text-(--muted-text)">Monthly Reports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {reports.filter((r) => r.report_type === "season").length}
              </div>
              <div className="text-sm text-(--muted-text)">Season Reports</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportLibrary;
