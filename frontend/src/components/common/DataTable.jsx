// DataTable.jsx - Updated with platform color palette
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
  isLoading = false,
  emptyStateTitle = "No Data Available",
  emptyStateDescription = "There are no records to display. Get started by adding your first entry.",
  pagination: externalPagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

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
      return data;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [data, filteredData, currentPage, itemsPerPage, isExternalPagination]);

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

  // Skeleton Rows for Loading State
  const TableSkeleton = () => {
    const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => i);

    return (
      <div className="relative min-h-[400px]">
        {/* Desktop Skeleton */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead className="bg-[#262626] border-b border-[#343434]">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={
                      index === 0
                        ? "h-15 pl-3 text-left align-middle font-semibold text-white whitespace-nowrap text-sm uppercase tracking-wide rounded-tl-xl"
                        : "h-15 px-6 text-left align-middle font-semibold text-white whitespace-nowrap text-sm uppercase tracking-wide"
                    }
                  >
                    {column.header}
                  </th>
                ))}
                {actions && (
                  <th className="h-15 px-3 text-left align-middle font-semibold text-white whitespace-nowrap text-sm uppercase tracking-wide w-20 rounded-tr-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm whitespace-nowrap text-[#B0AFAF]">
                        Items per page
                      </span>
                      <Select disabled value={itemsPerPage.toString()}>
                        <SelectTrigger className="w-20 h-9 border-[#343434] bg-[#1A1A1A] text-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343434] bg-[#1A1A1A] border-b border-[#343434]">
              {skeletonRows.map((rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group transition-all duration-200 even:bg-[#262626] text-sm"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={
                        colIndex === 0
                          ? "p-6 align-middle text-sm rounded-tl-xl whitespace-nowrap rounded-bl-xl"
                          : "p-6 align-middle whitespace-nowrap text-sm"
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <div className="h-4 bg-[#343434] rounded animate-pulse flex-1 max-w-[120px]"></div>
                        {colIndex === 0 && (
                          <div className="w-6 h-6 bg-[#343434] rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </td>
                  ))}
                  {actions && (
                    <td className="p-6 align-middle rounded-tr-xl whitespace-nowrap rounded-br-xl">
                      <div className="flex items-center space-x-2 opacity-50">
                        <div className="w-8 h-8 bg-[#343434] rounded-md animate-pulse"></div>
                        <div className="w-8 h-8 bg-[#343434] rounded-md animate-pulse"></div>
                        <div className="w-8 h-8 bg-[#343434] rounded-md animate-pulse"></div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-[#0F0F0E]/50 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#343434]">
          <div className="text-center">
            <LoadingSpinner
              type="pulse"
              size="lg"
              text="Loading data..."
              centered={true}
              color="primary"
            />
          </div>
        </div>
      </div>
    );
  };

  // No Data State
  const NoDataState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#262626] rounded-xl border border-[#343434] min-h-[200px]">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-linear-to-br from-primary/10 to-[#94D44A]/5 rounded-full flex items-center justify-center mb-2 border border-primary/20">
          <Inbox className="w-8 h-8 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Database className="w-3 h-3 text-[#0F0F0E]" />
        </div>
      </div>

      <h4 className="text-xl font-semibold text-white mb-3 font-['Inter']">
        {emptyStateTitle}
      </h4>

      <p className="text-[#B0AFAF] max-w-md mb-6 text-sm font-['Inter']">
        {searchTerm
          ? "No records match your search criteria. Try adjusting your search terms."
          : emptyStateDescription}
      </p>

      {onAdd && !searchTerm && (
        <Button
          onClick={onAdd}
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold font-['Inter']"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addButtonText}
        </Button>
      )}
    </div>
  );

  // Empty search results state
  const EmptySearchState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#262626] rounded-xl border border-[#343434] min-h-[200px]">
      <div className="w-14 h-14 bg-[#343434] rounded-full flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-[#B0AFAF]" />
      </div>
      <h4 className="text-md font-semibold text-white mb-2 font-['Inter']">
        No results found
      </h4>
      <p className="text-[#B0AFAF] mb-4 text-sm font-['Inter']">
        No records match "
        <span className="font-medium text-white">"{searchTerm}"</span>
      </p>
      <Button
        variant="outline"
        onClick={() => setSearchTerm("")}
        className="px-4 py-2 bg-[#262626] border-[#343434] text-white hover:bg-[#343434] font-['Inter']"
      >
        Clear search
      </Button>
    </div>
  );

  const displayData = isExternalPagination ? data : paginatedData;
  const displayTotal = isExternalPagination ? totalItems : filteredData.length;

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col w-full sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">{/* Optional title */}</div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Add Button */}
          {onAdd && (
            <Button
              onClick={onAdd}
              className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold order-1 sm:order-2 w-full sm:w-auto h-9 font-['Inter']"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      <div className="relative w-full rounded-xl bg-[#0F0F0E]">
        {isLoading ? (
          <TableSkeleton />
        ) : displayTotal === 0 ? (
          searchTerm && !isExternalPagination ? (
            <EmptySearchState />
          ) : (
            <NoDataState />
          )
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-[#262626] border-b border-[#343434]">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={
                          index === 0
                            ? "h-15 pl-3 text-left align-middle font-semibold text-white whitespace-nowrap text-sm uppercase tracking-wide rounded-tl-xl font-['Inter']"
                            : "h-15 px-6 text-left align-middle font-semibold text-white whitespace-nowrap text-sm uppercase tracking-wide font-['Inter']"
                        }
                      >
                        {column.header}
                      </th>
                    ))}
                    {actions && (
                      <th className="h-15 px-3 text-left align-middle font-semibold text-white whitespace-nowrap text-sm uppercase tracking-wide w-20 rounded-tr-xl font-['Inter']">
                        <div className="flex items-center space-x-2 order-2 sm:order-1">
                          <span className="text-sm whitespace-nowrap text-[#B0AFAF] font-['Inter']">
                            Items per page
                          </span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-9 border-[#343434] bg-[#1A1A1A] text-white text-sm focus:border-primary font-['Inter']">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#262626] border-[#343434] text-white font-['Inter']">
                              <SelectItem value="5" className="font-['Inter']">
                                5
                              </SelectItem>
                              <SelectItem value="10" className="font-['Inter']">
                                10
                              </SelectItem>
                              <SelectItem value="20" className="font-['Inter']">
                                20
                              </SelectItem>
                              <SelectItem value="50" className="font-['Inter']">
                                50
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#343434] bg-[#1A1A1A] border-b border-[#343434]">
                  {displayData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="group transition-all duration-200 hover:bg-[#262626] even:bg-[#1A1A1A] text-sm font-['Inter']"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={
                            colIndex === 0
                              ? "p-6 align-middle text-sm rounded-tl-xl whitespace-nowrap rounded-bl-xl"
                              : "p-6 align-middle whitespace-nowrap text-sm"
                          }
                        >
                          {column.cell ? (
                            column.cell({ row })
                          ) : column.accessor ? (
                            column.badge ? (
                              <Badge
                                variant={getBadgeVariant(row[column.accessor])}
                                className="whitespace-nowrap text-sm font-medium font-['Inter']"
                              >
                                {row[column.accessor]}
                              </Badge>
                            ) : (
                              <span className="text-white whitespace-nowrap font-['Inter']">
                                {row[column.accessor]}
                              </span>
                            )
                          ) : null}
                        </td>
                      ))}
                      {actions && (
                        <td className="p-6 align-middle rounded-tr-xl whitespace-nowrap rounded-br-xl">
                          <div className="flex items-center whitespace-nowrap gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                            {actions({ row })}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3 p-4">
              {displayData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="bg-[#262626] border border-[#343434] rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Main content */}
                  <div className="space-y-2">
                    {columns.slice(0, 2).map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex justify-between items-start"
                      >
                        <span className="text-xs font-medium text-[#B0AFAF] uppercase tracking-wide font-['Inter']">
                          {column.header}:
                        </span>
                        <div className="text-right max-w-[60%]">
                          {column.cell ? (
                            column.cell({ row })
                          ) : column.accessor ? (
                            column.badge ? (
                              <Badge
                                variant={getBadgeVariant(row[column.accessor])}
                                className="text-xs font-medium font-['Inter']"
                              >
                                {row[column.accessor]}
                              </Badge>
                            ) : (
                              <span className="text-white text-sm font-medium truncate block font-['Inter']">
                                {row[column.accessor]}
                              </span>
                            )
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional fields */}
                  {columns.length > 2 && (
                    <div className="pt-2 border-t border-[#343434]">
                      <div className="space-y-2">
                        {columns.slice(2).map((column, colIndex) => (
                          <div
                            key={colIndex}
                            className="flex justify-between items-start"
                          >
                            <span className="text-xs font-medium text-[#B0AFAF] uppercase tracking-wide font-['Inter']">
                              {column.header}:
                            </span>
                            <div className="text-right max-w-[60%]">
                              {column.cell ? (
                                column.cell({ row })
                              ) : column.accessor ? (
                                column.badge ? (
                                  <Badge
                                    variant={getBadgeVariant(
                                      row[column.accessor]
                                    )}
                                    className="text-xs font-medium font-['Inter']"
                                  >
                                    {row[column.accessor]}
                                  </Badge>
                                ) : (
                                  <span className="text-white text-sm truncate block font-['Inter']">
                                    {row[column.accessor]}
                                  </span>
                                )
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions for mobile */}
                  {actions && (
                    <div className="pt-3 border-t border-[#343434]">
                      <div className="flex justify-end">
                        <div className="flex items-center gap-2">
                          {actions({ row })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && displayTotal > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-4 border-[#343434] bg-[#262626] rounded-xl">
          {/* Results info */}
          <div className="text-sm text-[#B0AFAF] font-['Inter']">
            <span className="font-medium text-white">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-white">
              {Math.min(currentPage * itemsPerPage, displayTotal)}
            </span>{" "}
            of <span className="font-medium text-white">{displayTotal}</span>{" "}
            results
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-1">
            {/* First Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-[#343434] bg-[#1A1A1A] text-white hover:bg-[#343434]"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
              <span className="sr-only">First page</span>
            </Button>

            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-[#343434] bg-[#1A1A1A] text-white hover:bg-[#343434]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
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
                    ? "h-8 w-8 p-0 border-0 cursor-default text-[#B0AFAF] bg-transparent font-['Inter']"
                    : `h-8 w-8 p-0 min-w-8 font-['Inter'] ${
                        currentPage === page
                          ? "bg-primary text-[#0F0F0E] border-primary"
                          : "border-[#343434] bg-[#1A1A1A] text-white hover:bg-[#343434]"
                      }`
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
              className="h-8 w-8 p-0 border-[#343434] bg-[#1A1A1A] text-white hover:bg-[#343434]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="sr-only">Next page</span>
            </Button>

            {/* Last Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-[#343434] bg-[#1A1A1A] text-white hover:bg-[#343434]"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
