import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import {
  searchItems,
  sortItems,
  paginateItems,
  getTotalPages,
} from "../../lib/utils";
import Pagination from "./Pagination";

export default function DataTable({
  columns,
  data,
  searchFields = [],
  onRowClick = null,
  actions = null,
  title = "",
  itemsPerPage = 10,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = useMemo(() => {
    return searchItems(data, searchQuery, searchFields);
  }, [data, searchQuery, searchFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return sortItems(filteredData, sortField, sortOrder);
  }, [filteredData, sortField, sortOrder]);

  // Paginate data
  const paginatedData = useMemo(() => {
    return paginateItems(sortedData, currentPage, itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = getTotalPages(sortedData.length, itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      {(title || searchFields.length > 0) && (
        <div className="p-4 border-b text-gray-300 border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          {searchFields.length > 0 && (
            <div className="relative flex-1 max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-gray-200 dark:text-gray-300"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm text-gray-200"
              />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border overflow-hidden text-gray-300 border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-100 dark:bg-gray-900">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left p-4 font-bold text-semiblod ${
                    col.sortable
                      ? "cursor-pointer hover:bg-gray-600 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable &&
                      sortField === col.key &&
                      (sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="text-left p-4 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`border-b border-gray-200 text-gray-200 dark:border-gray-800 dark:bg-gray-900 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      {col.render
                        ? col.render(
                            row[col.key],
                            row,
                            (currentPage - 1) * itemsPerPage + idx,
                          )
                        : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={`px-2 py-2 rounded text-xs font-semibold transition-colors ${
                              action.variant === "danger"
                                ? "p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400 hover:bg-red-500/30"
                                : action.variant === "success"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer p-2 rounded-lg"
                                  : "p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400 hover:bg-blue-500/30"
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="p-8 text-center text-gray-600 dark:text-gray-300"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
