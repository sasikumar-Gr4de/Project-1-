import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Database, Inbox } from "lucide-react";

const DataTable = ({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  actions,
  title,
  onAdd,
  addButtonText = "Add New",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      columns.some(
        (col) =>
          col.accessor &&
          String(item[col.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page !== "..." && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
      case "approved":
        return "default";
      case "inactive":
      case "pending":
        return "secondary";
      case "injured":
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Default avatar component
  const DefaultAvatar = ({ type = "player", className = "w-10 h-10" }) => {
    const baseClasses =
      "rounded-full flex items-center justify-center text-white font-semibold";

    if (type === "club") {
      return (
        <div
          className={`${baseClasses} ${className} bg-linear-to-br from-blue-500 to-blue-600`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }

    return (
      <div
        className={`${baseClasses} ${className} bg-linear-to-br from-green-500 to-green-600`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0112 0c0 .-. 0 0 0 0h-.a5. 5 0 00-4.546-2.916A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  // Default video component
  const DefaultVideoIcon = ({ className = "w-10 h-10" }) => (
    <div
      className={`${className} rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
    >
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );

  // Beautiful No Data State with current color palette
  const NoDataState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-2 border border-border/50">
          <Inbox className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Database className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3">
        No Data Available
      </h3>

      <p className="text-muted-foreground max-w-md mb-6 text-lg">
        {searchTerm
          ? "No records match your search criteria. Try adjusting your search terms."
          : "There are no records to display. Get started by adding your first entry."}
      </p>
      {/* 
      {onAdd && !searchTerm && (
        <Button
          onClick={onAdd}
          className="bg-primary hover:bg-primary/90 px-8 py-3 h-auto text-lg"
          size="sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          {addButtonText}
        </Button>
      )} */}

      {searchTerm && (
        <Button
          variant="outline"
          onClick={() => setSearchTerm("")}
          className="px-6 py-2 h-auto"
        >
          Clear Search
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="text-xl font-bold text-foreground">{title}</div>
        <div className="flex items-center space-x-4">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          {onAdd && (
            <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      <div>
        {searchable && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredData.length === 0
                ? "No records found"
                : `Found ${filteredData.length} record${
                    filteredData.length !== 1 ? "s" : ""
                  }`}
            </div>
          </div>
        )}

        <div className="rounded-sm border">
          <div className="relative w-full overflow-auto">
            {filteredData.length === 0 ? (
              <NoDataState />
            ) : (
              <>
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                        >
                          {column.header}
                        </th>
                      ))}
                      {actions && (
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        {columns.map((column, colIndex) => (
                          <td key={colIndex} className="p-4 align-middle">
                            {column.cell ? (
                              column.cell({
                                row,
                                DefaultAvatar,
                                DefaultVideoIcon,
                              })
                            ) : column.accessor ? (
                              column.badge ? (
                                <Badge
                                  variant={getBadgeVariant(
                                    row[column.accessor]
                                  )}
                                >
                                  {row[column.accessor]}
                                </Badge>
                              ) : (
                                row[column.accessor]
                              )
                            ) : null}
                          </td>
                        ))}
                        {actions && (
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              {actions({ row })}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Pagination - Only show if there's data */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  disabled={page === "..."}
                  className={page === "..." ? "cursor-default" : ""}
                >
                  {page}
                </Button>
              ))}

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Icons
const ChevronLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default DataTable;
