import React, { useEffect, useMemo, useState } from "react";

import {
  Eye,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Search,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useStudentStore } from "../../store/academic/addNewStudent/studentStore";
import { useBoardStore } from "../../store/master/board/boardStore";
import { useClassStore } from "../../store/master/class/classStore";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

export default function InactiveStudents() {
  const navigate = useNavigate();
  const [boardsFetched, setBoardsFetched] = useState(false);
  const [classesFetchedForBoard, setClassesFetchedForBoard] = useState("");

  const [filters, setFilters] = useState({
    board: "",
    currentClass: "",
    search: "",
  });

  const {
    inactiveStudents,
    inactiveLoading,
    submitLoading,
    fetchInactiveStudents,
    restoreStudent,
  } = useStudentStore();

  const { boards = [], loading: boardLoading, fetchBoards } = useBoardStore();

  const { classes = [], loading: classLoading, fetchClasses } = useClassStore();

  /*
   * Initial data
   */

  // useEffect(() => {
  //   fetchBoards();
  // }, [fetchBoards]);

  /*
   * Board change par class list
   */

  // useEffect(() => {
  //   if (!filters.board) return;

  //   fetchClasses({
  //     board: filters.board,
  //   });

  //   setFilters((prev) => {
  //     if (!prev.currentClass) return prev;

  //     return {
  //       ...prev,
  //       currentClass: "",
  //     };
  //   });
  // }, [filters.board, fetchClasses]);

  const handleBoardDropdownOpen = async () => {
    if (boardsFetched || boardLoading) return;

    const success = await fetchBoards();

    if (success !== false) {
      setBoardsFetched(true);
    }
  };

  const handleClassDropdownOpen = async () => {
    if (!filters.board || classLoading) return;

    if (classesFetchedForBoard === filters.board) {
      return;
    }

    const success = await fetchClasses({
      board: filters.board,
    });

    if (success !== false) {
      setClassesFetchedForBoard(filters.board);
    }
  };

  const handleBoardChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      board: value,
      currentClass: "",
    }));

    setClassesFetchedForBoard("");
  };

  /*
   * Backend filtering
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInactiveStudents({
        ...(filters.board && {
          board: filters.board,
        }),

        ...(filters.currentClass && {
          currentClass: filters.currentClass,
        }),

        ...(filters.search.trim() && {
          search: filters.search.trim(),
        }),
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [
    filters.board,
    filters.currentClass,
    filters.search,
    fetchInactiveStudents,
  ]);

  const activeBoards = useMemo(() => {
    return boards.filter(
      (item) => item.isActive !== false && item.status !== "inactive",
    );
  }, [boards]);

  const activeClasses = useMemo(() => {
    return classes.filter(
      (item) => item.isActive !== false && item.status !== "inactive",
    );
  }, [classes]);

  /*
   * Local fallback filtering
   */
  const students = Array.isArray(inactiveStudents) ? inactiveStudents : [];
  const filteredStudents = useMemo(() => {
    const studentList = Array.isArray(students) ? students : [];

    const searchText = filters.search.trim().toLowerCase();

    return studentList.filter((student) => {
      const matchesBoard = !filters.board || student.board === filters.board;

      const matchesClass =
        !filters.currentClass || student.currentClass === filters.currentClass;

      const matchesSearch =
        !searchText ||
        [
          student.admissionNumber,
          student.studentName,
          student.fatherName,
          student.motherName,
          student.phone,
          student.email,
          student.aadhaarNumber,
          student.apaarId,
          student.penNumber,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchText),
        );

      return matchesBoard && matchesClass && matchesSearch;
    });
  }, [students, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRestore = async (student) => {
    const confirmRestore = window.confirm(
      `Are you sure you want to restore "${student.studentName}"?`,
    );

    if (!confirmRestore) return;

    await restoreStudent(student.slug);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Inactive Students</h1>

          <p className="mt-1 text-gray-400">
            View and restore deleted students
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white cursor-pointer"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white cursor-pointer"
          >
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {/* Board */}
            <select
              value={filters.board}
              onMouseDown={handleBoardDropdownOpen}
              onFocus={handleBoardDropdownOpen}
              onChange={(e) => handleBoardChange(e.target.value)}
              disabled={boardLoading}
              className="w-56 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white disabled:opacity-60"
            >
              <option value="">
                {boardLoading ? "Loading boards..." : "Select Board"}
              </option>

              {activeBoards.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>

            {/* Class */}
            <select
              value={filters.currentClass}
              onMouseDown={handleClassDropdownOpen}
              onFocus={handleClassDropdownOpen}
              onChange={(e) =>
                handleFilterChange("currentClass", e.target.value)
              }
              disabled={!filters.board || classLoading}
              className="w-56 bg-gray-800 cursor-pointer border border-gray-700 rounded-xl p-3 text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {!filters.board
                  ? "Select Board First"
                  : classLoading
                    ? "Loading classes..."
                    : "Select Class"}
              </option>

              {activeClasses.map((item) => (
                <option key={item.slug} value={item.classTitle}>
                  {item.classTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search by Name, Father Name"
              className="w-72 bg-gray-800 border border-gray-700 rounded-xl pl-10 p-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Horizontal + vertical custom scrollbar */}
        <div className="overflow-auto max-h-[65vh] custom-scrollbar">
          <table className="w-full min-w-[1500px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  SN.
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Adm no.
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Student Name
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Father Name
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  DOB
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Board
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Class
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Academic Year
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Category
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Gender
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Phone
                </th>

                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Inactive Date
                </th>

                <th className="p-4 text-center text-gray-300 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {inactiveLoading ? (
                <tr>
                  <td colSpan={13} className="p-16">
                    <div className="flex items-center justify-center text-gray-400">
                      <Loader2 size={22} className="animate-spin mr-2" />
                      Loading inactive students...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-16 text-center text-gray-400">
                    No inactive students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr
                    key={student.slug}
                    className="border-t border-gray-800 hover:bg-gray-800/30"
                  >
                    <td className="p-4 text-white">{index + 1}.</td>

                    <td className="p-4 text-white">
                      {student.admissionNumber || "-"}
                    </td>

                    <td className="p-4 text-white whitespace-nowrap font-medium">
                      {student.studentName || "-"}
                    </td>

                    <td className="p-4 text-white whitespace-nowrap">
                      {student.fatherName || "-"}
                    </td>

                    <td className="p-4 text-white whitespace-nowrap">
                      {formatDate(student.dob)}
                    </td>

                    <td className="p-4 text-white">{student.board || "-"}</td>

                    <td className="p-4 text-white">
                      {student.currentClass || "-"}
                    </td>

                    <td className="p-4 text-white whitespace-nowrap">
                      {student.currentSession || "-"}
                    </td>

                    <td className="p-4 text-white">
                      {student.category || "-"}
                    </td>

                    <td className="p-4 text-white">{student.gender || "-"}</td>

                    <td className="p-4 text-white whitespace-nowrap">
                      {student.phone || "-"}
                    </td>

                    <td className="p-4 text-red-300 whitespace-nowrap">
                      {formatDate(student.deletedAt)}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-row gap-2 items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/academic/student-profile/${student.slug}`,
                            )
                          }
                          className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white cursor-pointer"
                          title="View Student"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRestore(student)}
                          disabled={submitLoading}
                          className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Restore Student"
                        >
                          {submitLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <RotateCcw size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
