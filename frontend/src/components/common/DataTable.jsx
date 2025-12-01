// DataTable.jsx - Improved for pixel-perfect responsiveness
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
import { Input } from "@/components/ui/input";

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
    ? externalPagination.limit
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
        <div className="hidden lg:block overflow-x-auto w-full">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead
              style={{
                backgroundColor: "var(--surface-1)",
                borderBottomColor: "var(--surface-2)",
              }}
            >
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`
                      h-12 px-4 text-left align-middle font-semibold text-white 
                      whitespace-nowrap text-xs md:text-sm uppercase tracking-wide
                      ${index === 0 ? "rounded-tl-xl pl-6" : ""}
                      ${
                        index === columns.length - 1 && !actions
                          ? "rounded-tr-xl pr-6"
                          : ""
                      }
                    `}
                  >
                    <div className="truncate">{column.header}</div>
                  </th>
                ))}
                {actions && (
                  <th className="h-12 px-4 text-left align-middle font-semibold text-white whitespace-nowrap text-xs md:text-sm uppercase tracking-wide rounded-tr-xl">
                    <div className="flex items-center justify-end space-x-2">
                      <Select disabled value={itemsPerPage.toString()}>
                        <SelectTrigger
                          className="w-20 h-8 text-xs"
                          style={{
                            borderColor: "var(--surface-2)",
                            backgroundColor: "var(--surface-0)",
                            color: "white",
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ borderBottomColor: "var(--surface-2)" }}>
              {skeletonRows.map((rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group transition-all duration-200 even:bg-[var(--surface-1)] text-sm"
                  style={{ backgroundColor: "var(--surface-0)" }}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`
                        px-4 py-3 align-middle text-xs md:text-sm
                        ${colIndex === 0 ? "rounded-tl-xl pl-6" : ""}
                        ${
                          colIndex === columns.length - 1 && !actions
                            ? "rounded-tr-xl pr-6"
                            : ""
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-3 rounded animate-pulse flex-1 max-w-[120px]"
                          style={{ backgroundColor: "var(--surface-2)" }}
                        ></div>
                      </div>
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 align-middle rounded-tr-xl whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2 opacity-50">
                        <div
                          className="w-6 h-6 rounded-md animate-pulse"
                          style={{ backgroundColor: "var(--surface-2)" }}
                        ></div>
                        <div
                          className="w-6 h-6 rounded-md animate-pulse"
                          style={{ backgroundColor: "var(--surface-2)" }}
                        ></div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet Skeleton */}
        <div className="hidden md:block lg:hidden">
          <div className="space-y-3 p-4">
            {skeletonRows.map((rowIndex) => (
              <div
                key={rowIndex}
                className="rounded-xl p-4 animate-pulse"
                style={{
                  backgroundColor: "var(--surface-1)",
                  borderColor: "var(--surface-2)",
                }}
              >
                <div className="space-y-3">
                  {columns.slice(0, 2).map((_, colIndex) => (
                    <div key={colIndex} className="space-y-2">
                      <div
                        className="h-3 rounded w-1/4"
                        style={{ backgroundColor: "var(--surface-2)" }}
                      ></div>
                      <div
                        className="h-4 rounded w-3/4"
                        style={{ backgroundColor: "var(--surface-2)" }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="block md:hidden">
          <div className="space-y-3 p-3">
            {skeletonRows.map((rowIndex) => (
              <div
                key={rowIndex}
                className="rounded-lg p-3 animate-pulse"
                style={{
                  backgroundColor: "var(--surface-1)",
                  borderColor: "var(--surface-2)",
                }}
              >
                <div className="space-y-2">
                  <div
                    className="h-3 rounded w-1/3"
                    style={{ backgroundColor: "var(--surface-2)" }}
                  ></div>
                  <div
                    className="h-4 rounded w-2/3"
                    style={{ backgroundColor: "var(--surface-2)" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl"
          style={{
            backgroundColor: "rgba(15, 15, 14, 0.5)",
            backdropFilter: "blur(4px)",
            borderColor: "var(--surface-2)",
          }}
        >
          <div className="text-center px-4">
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
    <div
      className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl min-h-[200px]"
      style={{
        backgroundColor: "var(--surface-1)",
        borderColor: "var(--surface-2)",
      }}
    >
      <div className="relative mb-4">
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 border"
          style={{
            background:
              "linear-gradient(to bottom right, var(--primary)/10, var(--accent-2)/5)",
            borderColor: "var(--primary)/20",
          }}
        >
          <Inbox
            className="w-6 h-6 md:w-8 md:h-8"
            style={{ color: "var(--primary)/60" }}
          />
        </div>
        <div
          className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Database
            className="w-2.5 h-2.5 md:w-3 md:h-3"
            style={{ color: "var(--ink)" }}
          />
        </div>
      </div>

      <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
        {emptyStateTitle}
      </h4>

      <p
        className="max-w-sm md:max-w-md mb-6 text-xs md:text-sm"
        style={{ color: "var(--muted-text)" }}
      >
        {searchTerm
          ? "No records match your search criteria. Try adjusting your search terms."
          : emptyStateDescription}
      </p>

      {onAdd && !searchTerm && (
        <Button
          onClick={onAdd}
          className="font-semibold text-sm px-4 py-2 h-9"
          style={{
            background:
              "linear-gradient(to right, var(--primary), var(--accent-2))",
            color: "var(--ink)",
          }}
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
          {addButtonText}
        </Button>
      )}
    </div>
  );

  // Empty search results state
  const EmptySearchState = () => (
    <div
      className="flex flex-col items-center justify-center py-8 px-6 text-center rounded-xl min-h-[200px]"
      style={{
        backgroundColor: "var(--surface-1)",
        borderColor: "var(--surface-2)",
      }}
    >
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: "var(--surface-2)" }}
      >
        <Search
          className="w-5 h-5 md:w-6 md:h-6"
          style={{ color: "var(--muted-text)" }}
        />
      </div>
      <h4 className="text-base md:text-lg font-semibold text-white mb-1">
        No results found
      </h4>
      <p
        className="mb-4 text-xs md:text-sm"
        style={{ color: "var(--muted-text)" }}
      >
        No records match "
        <span className="font-medium text-white">"{searchTerm}"</span>
      </p>
      <Button
        variant="outline"
        onClick={() => setSearchTerm("")}
        className="px-3 py-1.5 h-8 text-xs"
        style={{
          backgroundColor: "var(--surface-1)",
          borderColor: "var(--surface-2)",
          color: "white",
        }}
      >
        Clear search
      </Button>
    </div>
  );

  const displayData = isExternalPagination ? data : paginatedData;
  const displayTotal = isExternalPagination ? totalItems : filteredData.length;

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col w-full lg:flex-row items-start lg:items-center justify-between gap-4">
        {title && (
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {title}
            </h2>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          {searchable && (
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--muted-text)" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 h-9 text-sm rounded-lg"
                style={{
                  backgroundColor: "var(--surface-1)",
                  borderColor: "var(--surface-2)",
                  color: "white",
                  borderWidth: "1px",
                }}
              />
            </div>
          )}

          {/* Add Button */}
          {onAdd && (
            <Button
              onClick={onAdd}
              className="font-semibold text-sm px-3 py-2 h-9 min-w-[120px]"
              style={{
                background:
                  "linear-gradient(to right, var(--primary), var(--accent-2))",
                color: "var(--ink)",
              }}
              disabled={isLoading}
            >
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface-0)" }}
      >
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
            {/* Desktop Table (Large Screens) */}
            <div className="hidden lg:block overflow-x-auto w-full">
              <table className="w-full text-sm border-separate border-spacing-y-2 min-w-[800px]">
                <thead
                  style={{
                    backgroundColor: "var(--surface-1)",
                    borderBottomColor: "var(--surface-2)",
                  }}
                >
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={`
                          h-12 px-4 text-left align-middle font-semibold text-white 
                          whitespace-nowrap text-xs md:text-sm uppercase tracking-wide
                          ${index === 0 ? "rounded-tl-xl pl-6" : ""}
                          ${
                            index === columns.length - 1 && !actions
                              ? "rounded-tr-xl pr-6"
                              : ""
                          }
                        `}
                      >
                        <div className="truncate">{column.header}</div>
                      </th>
                    ))}
                    {actions && (
                      <th className="h-12 px-4 text-left align-middle font-semibold text-white whitespace-nowrap text-xs md:text-sm uppercase tracking-wide rounded-tr-xl">
                        <div className="flex items-center justify-end space-x-2">
                          <span
                            className="text-xs whitespace-nowrap hidden md:inline"
                            style={{ color: "var(--muted-text)" }}
                          >
                            Items
                          </span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger
                              className="w-16 md:w-20 h-8 text-xs"
                              style={{
                                borderColor: "var(--surface-2)",
                                backgroundColor: "var(--surface-0)",
                                color: "white",
                              }}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              style={{
                                backgroundColor: "var(--surface-1)",
                                borderColor: "var(--surface-2)",
                                color: "white",
                              }}
                            >
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody style={{ borderBottomColor: "var(--surface-2)" }}>
                  {displayData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="group transition-all duration-200 hover:bg-[var(--surface-1)] even:bg-[var(--surface-0)] text-sm"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`
                            px-4 py-3 align-middle text-xs md:text-sm
                            ${colIndex === 0 ? "rounded-tl-xl pl-6" : ""}
                            ${
                              colIndex === columns.length - 1 && !actions
                                ? "rounded-tr-xl pr-6"
                                : ""
                            }
                          `}
                        >
                          {column.cell ? (
                            column.cell({ row })
                          ) : column.accessor ? (
                            column.badge ? (
                              <Badge
                                variant={getBadgeVariant(row[column.accessor])}
                                className="whitespace-nowrap text-xs font-medium"
                              >
                                {row[column.accessor]}
                              </Badge>
                            ) : (
                              <span className="text-white whitespace-nowrap truncate block max-w-[200px]">
                                {row[column.accessor]}
                              </span>
                            )
                          ) : null}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3 align-middle rounded-tr-xl whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                            {actions({ row })}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet View (Medium Screens) */}
            <div className="hidden md:block lg:hidden">
              <div className="space-y-3 p-4">
                {displayData.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="rounded-xl p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    style={{
                      backgroundColor: "var(--surface-1)",
                      borderColor: "var(--surface-2)",
                    }}
                  >
                    {/* Main content */}
                    <div className="space-y-3">
                      {columns.slice(0, 2).map((column, colIndex) => (
                        <div
                          key={colIndex}
                          className="flex justify-between items-start"
                        >
                          <span
                            className="text-xs font-medium uppercase tracking-wide min-w-[100px]"
                            style={{ color: "var(--muted-text)" }}
                          >
                            {column.header}:
                          </span>
                          <div className="text-right flex-1 pl-4">
                            {column.cell ? (
                              column.cell({ row })
                            ) : column.accessor ? (
                              column.badge ? (
                                <Badge
                                  variant={getBadgeVariant(
                                    row[column.accessor]
                                  )}
                                  className="text-xs font-medium"
                                >
                                  {row[column.accessor]}
                                </Badge>
                              ) : (
                                <span className="text-white text-sm font-medium truncate block">
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
                      <div
                        className="pt-3"
                        style={{ borderTopColor: "var(--surface-2)" }}
                      >
                        <div className="space-y-2">
                          {columns.slice(2).map((column, colIndex) => (
                            <div
                              key={colIndex}
                              className="flex justify-between items-start"
                            >
                              <span
                                className="text-xs font-medium uppercase tracking-wide min-w-[100px]"
                                style={{ color: "var(--muted-text)" }}
                              >
                                {column.header}:
                              </span>
                              <div className="text-right flex-1 pl-4">
                                {column.cell ? (
                                  column.cell({ row })
                                ) : column.accessor ? (
                                  column.badge ? (
                                    <Badge
                                      variant={getBadgeVariant(
                                        row[column.accessor]
                                      )}
                                      className="text-xs font-medium"
                                    >
                                      {row[column.accessor]}
                                    </Badge>
                                  ) : (
                                    <span className="text-white text-sm truncate block">
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

                    {/* Actions for tablet */}
                    {actions && (
                      <div
                        className="pt-3"
                        style={{ borderTopColor: "var(--surface-2)" }}
                      >
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
            </div>

            {/* Mobile View (Small Screens) */}
            <div className="block md:hidden">
              <div className="space-y-3 p-3">
                {displayData.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="rounded-lg p-3 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                    style={{
                      backgroundColor: "var(--surface-1)",
                      borderColor: "var(--surface-2)",
                    }}
                  >
                    {/* Main content - stacked vertically */}
                    <div className="space-y-2">
                      {columns.slice(0, 2).map((column, colIndex) => (
                        <div key={colIndex} className="space-y-1">
                          <span
                            className="text-[10px] font-medium uppercase tracking-wide"
                            style={{ color: "var(--muted-text)" }}
                          >
                            {column.header}
                          </span>
                          <div className="text-sm">
                            {column.cell ? (
                              <div className="scale-75 origin-left">
                                {column.cell({ row })}
                              </div>
                            ) : column.accessor ? (
                              column.badge ? (
                                <Badge
                                  variant={getBadgeVariant(
                                    row[column.accessor]
                                  )}
                                  className="text-[10px] font-medium py-0 h-5"
                                >
                                  {row[column.accessor]}
                                </Badge>
                              ) : (
                                <span className="text-white text-sm font-medium truncate block">
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
                      <div
                        className="pt-2"
                        style={{ borderTopColor: "var(--surface-2)" }}
                      >
                        <div className="space-y-2">
                          {columns.slice(2).map((column, colIndex) => (
                            <div key={colIndex} className="space-y-1">
                              <span
                                className="text-[10px] font-medium uppercase tracking-wide"
                                style={{ color: "var(--muted-text)" }}
                              >
                                {column.header}
                              </span>
                              <div className="text-sm">
                                {column.cell ? (
                                  <div className="scale-75 origin-left">
                                    {column.cell({ row })}
                                  </div>
                                ) : column.accessor ? (
                                  column.badge ? (
                                    <Badge
                                      variant={getBadgeVariant(
                                        row[column.accessor]
                                      )}
                                      className="text-[10px] font-medium py-0 h-5"
                                    >
                                      {row[column.accessor]}
                                    </Badge>
                                  ) : (
                                    <span className="text-white text-sm truncate block">
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
                      <div
                        className="pt-2"
                        style={{ borderTopColor: "var(--surface-2)" }}
                      >
                        <div className="flex justify-end">
                          <div className="flex items-center gap-1 flex-wrap justify-end">
                            {actions({ row })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && displayTotal > 0 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl"
          style={{
            borderColor: "var(--surface-2)",
            backgroundColor: "var(--surface-1)",
          }}
        >
          {/* Results info */}
          <div
            className="text-xs md:text-sm"
            style={{ color: "var(--muted-text)" }}
          >
            <span className="font-medium text-white">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-white">
              {Math.min(currentPage * itemsPerPage, displayTotal)}
            </span>{" "}
            of <span className="font-medium text-white">{displayTotal}</span>{" "}
            {displayTotal === 1 ? "result" : "results"}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-1">
            {/* First Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="h-7 w-7 md:h-8 md:w-8 p-0"
              style={{
                borderColor: "var(--surface-2)",
                backgroundColor: "var(--surface-0)",
                color: "white",
              }}
            >
              <ChevronsLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="sr-only">First page</span>
            </Button>

            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 w-7 md:h-8 md:w-8 p-0"
              style={{
                borderColor: "var(--surface-2)",
                backgroundColor: "var(--surface-0)",
                color: "white",
              }}
            >
              <ChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
                className={`
                  h-7 w-7 md:h-8 md:w-8 p-0 min-w-7 md:min-w-8
                  ${page === "..." ? "border-0 cursor-default" : ""}
                  ${
                    currentPage === page
                      ? "border-primary"
                      : "border-[var(--surface-2)]"
                  }
                `}
                style={
                  page === "..."
                    ? {
                        color: "var(--muted-text)",
                        backgroundColor: "transparent",
                      }
                    : currentPage === page
                    ? {
                        backgroundColor: "var(--primary)",
                        color: "var(--ink)",
                        borderColor: "var(--primary)",
                      }
                    : { backgroundColor: "var(--surface-0)", color: "white" }
                }
              >
                <span className="text-xs md:text-sm">{page}</span>
              </Button>
            ))}

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 w-7 md:h-8 md:w-8 p-0"
              style={{
                borderColor: "var(--surface-2)",
                backgroundColor: "var(--surface-0)",
                color: "white",
              }}
            >
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="sr-only">Next page</span>
            </Button>

            {/* Last Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="h-7 w-7 md:h-8 md:w-8 p-0"
              style={{
                borderColor: "var(--surface-2)",
                backgroundColor: "var(--surface-0)",
                color: "white",
              }}
            >
              <ChevronsRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
