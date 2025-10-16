import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";

const DataTable = ({
  columns,
  data,
  pageSize = 10,
  renderRow,
  emptyMessage = "No data found",
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-4 px-6 text-sm font-medium text-gray-400"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) =>
              renderRow(item, startIndex + index)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-
            {Math.min(startIndex + pageSize, data.length)} of {data.length}
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

export default DataTable;
