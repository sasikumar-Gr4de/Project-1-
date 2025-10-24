import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Database,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const DataTable = ({
  data = [],
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  actions,
  title,
  onAdd,
  addButtonText = "Add New",
  isLoading = true,
  emptyStateTitle = "No Data Available",
  emptyStateDescription = "There are no records to display. Get started by adding your first entry.",
  // Pagination props
  pagination: externalPagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  // Use external pagination if provided, otherwise use internal
  const isExternalPagination = !!externalPagination;
  const currentPage = isExternalPagination
    ? externalPagination.page
    : internalPage;
  const itemsPerPage = isExternalPagination
    ? externalPagination.pageSize
    : internalPageSize;
  const totalItems = isExternalPagination
    ? externalPagination.total
    : data.length;
  const totalPages = isExternalPagination
    ? externalPagination.totalPages
    : Math.ceil(totalItems / itemsPerPage);

  const filteredData = useMemo(() => {
    if (!searchTerm || isExternalPagination) return data;

    return data.filter((item) =>
      columns.some(
        (col) =>
          col.accessor &&
          String(item[col.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns, isExternalPagination]);

  const paginatedData = useMemo(() => {
    if (isExternalPagination) {
      return data; // Data is already paginated from backend
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [data, filteredData, currentPage, itemsPerPage, isExternalPagination]);

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
    const newPageSize = Number(value);

    if (isExternalPagination) {
      onPageSizeChange?.(newPageSize);
    } else {
      setInternalPageSize(newPageSize);
      setInternalPage(1);
    }
  };

  const goToPage = (page) => {
    if (page === "..." || page < 1 || page > totalPages) return;

    if (isExternalPagination) {
      onPageChange?.(page);
    } else {
      setInternalPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
      case "approved":
      case "verified":
        return "default";
      case "inactive":
      case "pending":
      case "draft":
        return "secondary";
      case "injured":
      case "rejected":
      case "cancelled":
      case "banned":
        return "destructive";
      case "warning":
      case "attention":
        return "outline";
      default:
        return "outline";
    }
  };

  // Loading State
  const TableLoadingState = () => (
    <div className="w-full py-16">
      <LoadingSpinner
        size="lg"
        color="primary"
        text="Loading data..."
        centered={true}
        fullWidth={true}
      />
    </div>
  );

  // No Data State
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
        {emptyStateTitle}
      </h3>

      <p className="text-muted-foreground max-w-md mb-6 text-lg">
        {searchTerm
          ? "No records match your search criteria. Try adjusting your search terms."
          : emptyStateDescription}
      </p>
    </div>
  );

  // Empty search results state
  const EmptySearchState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h4 className="text-lg font-semibold text-foreground mb-2">
        No results found
      </h4>
      <p className="text-muted-foreground mb-4">
        No records match "<span className="font-medium">{searchTerm}</span>"
      </p>
      <Button
        variant="outline"
        onClick={() => setSearchTerm("")}
        className="px-4 py-2"
      >
        Clear search
      </Button>
    </div>
  );

  const displayData = isExternalPagination ? data : paginatedData;
  const displayTotal = isExternalPagination ? totalItems : filteredData.length;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
        <div className="text-2xl font-bold text-foreground">{title}</div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2 order-2 sm:order-1">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Show
            </span>
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              entries
            </span>
          </div>

          {/* Add Button */}
          {onAdd && (
            <Button
              onClick={onAdd}
              className="bg-primary hover:bg-primary/90 order-1 sm:order-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Search Section */}
      {searchable && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isExternalPagination) {
                  setInternalPage(1);
                }
              }}
              className="pl-10"
            />
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {isLoading ? (
              <div className="flex items-center">Loading...</div>
            ) : displayTotal === 0 ? (
              "No records found"
            ) : (
              `Found ${displayTotal} record${displayTotal !== 1 ? "s" : ""}`
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-auto">
        {isLoading ? (
          <TableLoadingState />
        ) : displayTotal === 0 ? (
          searchTerm && !isExternalPagination ? (
            <EmptySearchState />
          ) : (
            <NoDataState />
          )
        ) : (
          <>
            {/* Table */}
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {column.header}
                    </th>
                  ))}
                  {actions && (
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-4 align-middle">
                        {column.cell ? (
                          column.cell({
                            row,
                          })
                        ) : column.accessor ? (
                          column.badge ? (
                            <Badge
                              variant={getBadgeVariant(row[column.accessor])}
                              className="whitespace-nowrap"
                            >
                              {row[column.accessor]}
                            </Badge>
                          ) : (
                            <span className="whitespace-nowrap">
                              {row[column.accessor]}
                            </span>
                          )
                        ) : null}
                      </td>
                    ))}
                    {actions && (
                      <td className="p-4 align-middle">
                        <div className="flex flex-wrap gap-2">
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

      {/* Pagination - Only show if there's data and not loading */}
      {!isLoading && displayTotal > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          {/* Results info */}
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, displayTotal)}
            </span>{" "}
            of <span className="font-medium">{displayTotal}</span> entries
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-1">
            {/* First Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0"
            >
              <ChevronsLeft className="w-4 h-4" />
              <span className="sr-only">First page</span>
            </Button>

            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                disabled={page === "..."}
                className={
                  page === "..."
                    ? "h-9 w-9 p-0 cursor-default"
                    : "h-9 w-9 p-0 min-w-9"
                }
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
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Next page</span>
            </Button>

            {/* Last Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0"
            >
              <ChevronsRight className="w-4 h-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Mobile pagination info */}
      {!isLoading && displayTotal > 0 && (
        <div className="block sm:hidden text-center text-sm text-muted-foreground mt-4">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default DataTable;
