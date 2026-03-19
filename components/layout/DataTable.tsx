//components/layout/DataTable.tsx
"use client";

import { useState, useMemo, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search, X ,Pencil ,Trash2 } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => ReactNode;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  initialPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  showRecordInfo?: boolean;
  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onEdit,
  onDelete,
  actions,
  searchPlaceholder = "Search...",
  searchKeys = [],
  pageSize = 5,
  initialPage = 1,
  showSearch = true,
  showPagination = true,
  showRecordInfo = true,
  className = "",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim() || searchKeys.length === 0) return data;

    return data.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Record Info */}
          {showRecordInfo && (
            <div className="text-sm text-muted-foreground">
              {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className={`bg-card border border-border rounded-xl overflow-x-auto ${className}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-3 sm:px-4 py-3 font-medium text-muted-foreground
                    ${column.hideOnMobile ? 'hidden sm:table-cell' : ''}
                    ${column.hideOnTablet ? 'hidden md:table-cell' : ''}
                    ${column.className || ''}
                  `}
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete || actions) && (
                <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`
                        px-3 sm:px-4 py-3
                        ${column.hideOnMobile ? 'hidden sm:table-cell' : ''}
                        ${column.hideOnTablet ? 'hidden md:table-cell' : ''}
                        ${column.className || ''}
                      `}
                    >
                      {column.cell
                        ? column.cell(item)
                        : String(item[column.key as keyof T] ?? '')}
                    </td>
                  ))}
                  {(onEdit || onDelete || actions) && (
                    <td className="px-3 sm:px-4 py-3 text-right">
                      {actions ? (
                        actions(item)
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded hover:bg-muted text-primary"
                              aria-label="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 rounded hover:bg-muted text-accent"
                              aria-label="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + ((onEdit || onDelete || actions) ? 1 : 0)}
                  className="px-3 sm:px-4 py-8 text-center text-muted-foreground"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}