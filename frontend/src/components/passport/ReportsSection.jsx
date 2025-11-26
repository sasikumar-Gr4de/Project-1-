import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

const ReportsSection = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return (
      <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="w-5 h-5 text-primary" />
            <span>Analysis Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-placeholder text-center py-8">
            No reports available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <FileText className="w-5 h-5 text-primary" />
          <span>Analysis Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.slice(0, 5).map((report) => (
            <div
              key={report.report_id}
              className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-border"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium capitalize">
                    {report.report_type} Report
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-placeholder">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(report.period_start).toLocaleDateString()} -{" "}
                      {new Date(report.period_end).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {report.pdf_url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A]"
                  onClick={() => window.open(report.pdf_url, "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
