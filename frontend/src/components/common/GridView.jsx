import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const GridView = ({
  data,
  renderItem,
  emptyMessage = "No data found",
  emptyIcon = Users,
  emptyAction,
  pageSize = 12,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    "2xl": 4,
  },
  onPageChange,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  if (data.length === 0) {
    const EmptyIcon = emptyIcon;

    return (
      <div className={className}>
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-12 text-center">
            <EmptyIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {emptyMessage}
            </h3>
            {emptyAction && <div className="mt-4">{emptyAction}</div>}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Grid Content */}
      <div
        className={`grid gap-6 ${gridColumns[columns.sm] || "grid-cols-1"} ${
          columns.md ? `md:${gridColumns[columns.md]}` : ""
        } ${columns.lg ? `lg:${gridColumns[columns.lg]}` : ""} ${
          columns.xl ? `xl:${gridColumns[columns.xl]}` : ""
        } ${columns["2xl"] ? `2xl:${gridColumns[columns["2xl"]]}` : ""}`}
      >
        {paginatedData.map((item, index) => (
          <div key={item.id || index}>
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-
            {Math.min(startIndex + pageSize, data.length)} of {data.length}{" "}
            items
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="border-gray-600 text-gray-300"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-600 text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      currentPage === pageNum
                        ? "bg-blue-600"
                        : "border-gray-600 text-gray-300"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-600 text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="border-gray-600 text-gray-300"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridView;
