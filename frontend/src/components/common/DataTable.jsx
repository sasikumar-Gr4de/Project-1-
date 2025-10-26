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
  const [mobileActionMenu, setMobileActionMenu] = useState(null);

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
        size="md"
        color="primary"
        text="Loading data..."
        centered={true}
        fullWidth={true}
      />
    </div>
  );

  // No Data State
  const NoDataState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 rounded-lg border border-border/50">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-linear-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-2 border border-primary/20">
          <Inbox className="w-8 h-8 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Database className="w-3 h-3 text-primary-foreground" />
        </div>
      </div>

      <h4 className="text-xl font-semibold text-foreground mb-3">
        {emptyStateTitle}
      </h4>

      <p className="text-muted-foreground max-w-md mb-6 text-sm">
        {searchTerm
          ? "No records match your search criteria. Try adjusting your search terms."
          : emptyStateDescription}
      </p>

      {onAdd && !searchTerm && (
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {addButtonText}
        </Button>
      )}
    </div>
  );

  // Empty search results state
  const EmptySearchState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-lg border border-border/50">
      <div className="w-14 h-14 bg-muted/30 rounded-full flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-muted-foreground" />
      </div>
      <h4 className="text-md font-semibold text-foreground mb-2">
        No results found
      </h4>
      <p className="text-muted-foreground mb-4 text-sm">
        No records match "
        <span className="font-medium text-foreground">{searchTerm}</span>"
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
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col w-full sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          {/* <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {!isLoading && displayTotal > 0 && (
            <p className="text-sm text-muted-foreground">
              {displayTotal} {displayTotal === 1 ? "record" : "records"} found
            </p>
          )} */}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Items per page selector */}
          {/* Add Button */}
          {onAdd && (
            <Button
              onClick={onAdd}
              className="bg-primary hover:bg-primary/90 order-1 sm:order-2 w-full sm:w-auto h-9"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Search Section */}
      {/* {searchable && (
        <div className="relative max-w-md">
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
            className="pl-10 h-11 bg-background border-border/60 focus:border-primary/50"
          />
        </div>
      )} */}

      <div className="relative w-full rounded-lg bg-background">
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
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-muted border-b border-border/60">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={
                          index === 0
                            ? "h-15 pl-3 text-left align-middle font-semibold text-foreground whitespace-nowrap text-sm uppercase tracking-wide rounded-tl-lg"
                            : "h-15 px-6 text-left align-middle font-semibold text-foreground whitespace-nowrap text-sm uppercase tracking-wide"
                        }
                      >
                        {column.header}
                      </th>
                    ))}
                    {actions && (
                      <th className="h-15 px-3 text-left align-middle font-semibold text-foreground whitespace-nowrap text-sm uppercase tracking-wide w-20 rounded-tr-lg ">
                        <div className="flex items-center space-x-2 order-2 sm:order-1">
                          <span className="text-sm whitespace-nowrap">
                            Items per page
                          </span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-9 border-white focus:border-primary text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
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
                <tbody className="divide-y divide-border/40 bg-muted/50 border-b border-border/60">
                  {displayData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="group transition-all duration-200 hover:bg-muted/90 even:bg-muted/5 text-sx"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={
                            colIndex === 0
                              ? "p-6 align-middle text-sx rounded-tl-lg whitespace-nowrap rounded-bl-lg"
                              : "p-6 align-middle whitespace-nowrap text-sx"
                          }
                        >
                          {column.cell ? (
                            column.cell({ row })
                          ) : column.accessor ? (
                            column.badge ? (
                              <Badge
                                variant={getBadgeVariant(row[column.accessor])}
                                className="whitespace-nowrap text-sx font-medium"
                              >
                                {row[column.accessor]}
                              </Badge>
                            ) : (
                              <span className="text-foreground whitespace-nowrap">
                                {row[column.accessor]}
                              </span>
                            )
                          ) : null}
                        </td>
                      ))}
                      {actions && (
                        <td className="p-6 align-middle rounded-tr-lg whitespace-nowrap rounded-br-lg">
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
                  className="bg-card border border-border/40 rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Main content */}
                  <div className="space-y-2">
                    {columns.slice(0, 2).map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex justify-between items-start"
                      >
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {column.header}:
                        </span>
                        <div className="text-right max-w-[60%]">
                          {column.cell ? (
                            column.cell({ row })
                          ) : column.accessor ? (
                            column.badge ? (
                              <Badge
                                variant={getBadgeVariant(row[column.accessor])}
                                className="text-xs font-medium"
                              >
                                {row[column.accessor]}
                              </Badge>
                            ) : (
                              <span className="text-foreground text-sm font-medium truncate block">
                                {row[column.accessor]}
                              </span>
                            )
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional fields with show more */}
                  {columns.length > 2 && (
                    <div className="pt-2 border-t border-border/20">
                      <div className="space-y-2">
                        {columns.slice(2).map((column, colIndex) => (
                          <div
                            key={colIndex}
                            className="flex justify-between items-start"
                          >
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
                                    className="text-xs font-medium"
                                  >
                                    {row[column.accessor]}
                                  </Badge>
                                ) : (
                                  <span className="text-foreground text-sm truncate block">
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
                    <div className="pt-3 border-t border-border/20">
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

      {/* Pagination - Only show if there's data and not loading */}
      {!isLoading && displayTotal > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-15 p-3 border-border/60 bg-muted/50 rounded-lg">
          {/* Results info */}
          <div className="text-md text-muted-foreground">
            {" "}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, displayTotal)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{displayTotal}</span>{" "}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-1">
            {/* First Page Button */}
            <Button
              variant="outline"
              size="md"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-0 bg-transparent"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
              <span className="sr-only">First page</span>
            </Button>

            {/* Previous Button */}
            <Button
              variant="outline"
              size="md"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-0 bg-transparent"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={currentPage === page ? "link" : "outline"}
                size="md"
                onClick={() => goToPage(page)}
                disabled={page === "..."}
                className={
                  page === "..."
                    ? "h-8 w-8 p-0 border-0 cursor-default text-muted-foreground bg-transparent"
                    : "h-8 w-8 p-0 min-w-8 border-0 bg-transparent"
                }
              >
                {page}
              </Button>
            ))}

            {/* Next Button */}
            <Button
              variant="outline"
              size="md"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-0 bg-transparent"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="sr-only">Next page</span>
            </Button>

            {/* Last Page Button */}
            <Button
              variant="outline"
              size="md"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-0 bg-transparent"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Mobile pagination info */}
      {!isLoading && displayTotal > 0 && totalPages > 1 && (
        <div className="block sm:hidden text-center text-sm text-muted-foreground pt-4 border-t border-border/40">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default DataTable;
