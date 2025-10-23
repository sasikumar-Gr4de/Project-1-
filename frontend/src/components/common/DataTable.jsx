import React, { useState, useMemo } from "react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import { Badge } from "@/components/common/ui/badge";

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
  const [itemsPerPage] = useState(10);

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

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {onAdd && (
          <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
            {addButtonText}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {searchable && (
          <div className="mb-4">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />
          </div>
        )}

        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                    >
                      {column.header}
                    </th>
                  ))}
                  {actions && (
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
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
                          column.cell({ row })
                        ) : column.accessor ? (
                          column.badge ? (
                            <Badge
                              variant={getBadgeVariant(row[column.accessor])}
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
                        <div className="flex space-x-2">{actions({ row })}</div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
