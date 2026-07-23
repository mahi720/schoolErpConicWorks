import React, { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  FileSpreadsheet,
  FileText,
  List,
  Trash2,
  RotateCcw,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AddStudentModal from "../../components/academics/addNewStudent/AddNewStudentComponent";

import { useStudentStore } from "../../store/academic/addNewStudent/studentStore";
import { useBoardStore } from "../../store/master/board/boardStore";
import { useSessionStore } from "../../store/master/session/sessionStore";
import { useClassStore } from "../../store/master/class/classStore";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

export default function AllStudents() {
  const navigate = useNavigate();

  const [showStudentModal, setShowStudentModal] = useState(false);

  const [editStudent, setEditStudent] = useState(null);

  const [boardsFetched, setBoardsFetched] = useState(false);
  const [sessionsFetched, setSessionsFetched] = useState(false);
  const [classesFetchedForBoard, setClassesFetchedForBoard] = useState("");

  const [filters, setFilters] = useState({
    board: "",
    currentClass: "",
    currentSession: "",
    category: "",
    sponsorshipType: "",
    gender: "",
    search: "",
  });

  const {
    students,
    loading,
    submitLoading,
    fetchStudents,
    deleteStudent,
    restoreStudent,
  } = useStudentStore();

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { classes, loading: classLoading, fetchClasses } = useClassStore();

  const handleBoardDropdownOpen = async () => {
    if (boardsFetched || boardLoading) return;

    const success = await fetchBoards();

    if (success !== false) {
      setBoardsFetched(true);
    }
  };

  const handleSessionDropdownOpen = async () => {
    if (sessionsFetched || sessionLoading) return;

    const success = await fetchSessions();

    if (success !== false) {
      setSessionsFetched(true);
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
   * Initial master data
   */
  /*
   * Initial master data
   */

  // useEffect(() => {
  //   fetchBoards();
  //   fetchSessions();
  // }, [fetchBoards, fetchSessions]);

  /*
   * Selected board ke classes fetch
   */

  // useEffect(() => {
  //   if (!filters.board) return;

  //   fetchClasses({
  //     board: filters.board,
  //   });

  //   setFilters((prev) => ({
  //     ...prev,
  //     currentClass: "",
  //   }));
  // }, [filters.board, fetchClasses]);

  /*
   * Students fetch — initial + filters
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents({
        ...(filters.board && {
          board: filters.board,
        }),

        ...(filters.currentClass && {
          currentClass: filters.currentClass,
        }),

        ...(filters.currentSession && {
          currentSession: filters.currentSession,
        }),

        ...(filters.category && {
          category: filters.category,
        }),

        ...(filters.sponsorshipType && {
          sponsorshipType: filters.sponsorshipType,
        }),

        ...(filters.gender && {
          gender: filters.gender,
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
    filters.currentSession,
    filters.category,
    filters.sponsorshipType,
    filters.gender,
    filters.search,
    fetchStudents,
  ]);

  const activeBoards = useMemo(
    () =>
      boards.filter(
        (item) => item.isActive !== false && item.status !== "inactive",
      ),
    [boards],
  );

  const activeSessions = useMemo(
    () => sessions.filter((item) => item.isActive !== false),
    [sessions],
  );

  const activeClasses = useMemo(
    () =>
      classes.filter(
        (item) => item.isActive !== false && item.status !== "inactive",
      ),
    [classes],
  );

  /*
   * Backend search/filter implementation pending ho
   * to ye local filtering bhi data ko filter karega.
   */
  const filteredStudents = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesBoard = !filters.board || student.board === filters.board;

      const matchesClass =
        !filters.currentClass || student.currentClass === filters.currentClass;

      const matchesSession =
        !filters.currentSession ||
        student.currentSession === filters.currentSession;

      const matchesCategory =
        !filters.category || student.category === filters.category;

      const matchesSponsorship =
        !filters.sponsorshipType ||
        student.sponsorshipType === filters.sponsorshipType;

      const matchesGender =
        !filters.gender || student.gender === filters.gender;

      const matchesSearch =
        !searchText ||
        [
          student.admissionNumber,
          student.studentName,
          student.fatherName,
          student.motherName,
          student.phone,
          student.motherPhone,
          student.email,
          student.aadhaarNumber,
          student.apaarId,
          student.penNumber,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchText),
        );

      return (
        matchesBoard &&
        matchesClass &&
        matchesSession &&
        matchesCategory &&
        matchesSponsorship &&
        matchesGender &&
        matchesSearch
      );
    });
  }, [students, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCreateModal = () => {
    setEditStudent(null);
    setShowStudentModal(true);
  };

  const openEditModal = (student) => {
    setEditStudent(student);
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setEditStudent(null);
  };

  const handleDelete = async (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${student.studentName}"?`,
    );

    if (!confirmDelete) return;

    await deleteStudent(student.slug);
  };

  const handleRestore = async (student) => {
    const confirmRestore = window.confirm(
      `Are you sure you want to restore "${student.studentName}"?`,
    );

    if (!confirmRestore) return;

    await restoreStudent(student.slug);
  };

  const isInactive = (student) => {
    return (
      student.isActive === false ||
      student.status === "inactive" ||
      Boolean(student.deletedAt)
    );
  };

  const refreshStudents = async () => {
    await fetchStudents({
      status: "all",

      ...(filters.board && {
        board: filters.board,
      }),

      ...(filters.currentClass && {
        currentClass: filters.currentClass,
      }),

      ...(filters.currentSession && {
        currentSession: filters.currentSession,
      }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Students</h1>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Add New Student
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
          >
            Namelist
          </button>

          <button
            type="button"
            className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer"
          >
            <List size={18} />
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 cursor-pointer"
          >
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Board */}
          <select
            value={filters.board}
            onMouseDown={handleBoardDropdownOpen}
            onFocus={handleBoardDropdownOpen}
            onChange={(e) => handleBoardChange(e.target.value)}
            disabled={boardLoading}
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white disabled:opacity-60"
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
            onChange={(e) => handleFilterChange("currentClass", e.target.value)}
            disabled={!filters.board || classLoading}
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="bg-gray-800 border border-gray-700 cursor-pointer rounded-xl p-3 text-white"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>

          {/* Search */}
          <div className="relative xl:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Name, Father Name, Phone etc."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 p-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Academic year */}
          <select
            value={filters.currentSession}
            onMouseDown={handleSessionDropdownOpen}
            onFocus={handleSessionDropdownOpen}
            onChange={(e) =>
              handleFilterChange("currentSession", e.target.value)
            }
            disabled={sessionLoading}
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white disabled:opacity-60"
          >
            <option value="">
              {sessionLoading
                ? "Loading academic years..."
                : "Select Academic Year"}
            </option>

            {activeSessions.map((session) => (
              <option key={session.slug} value={session.name}>
                {session.name}
              </option>
            ))}
          </select>

          {/* Sponsorship */}
          <select
            value={filters.sponsorshipType}
            onChange={(e) =>
              handleFilterChange("sponsorshipType", e.target.value)
            }
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
          >
            <option value="">Select Sponsorship</option>
            <option value="Self/Parent">Self/Parent</option>
            <option value="RTE">RTE</option>
            <option value="Others">Others</option>
          </select>

          {/* Gender */}
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Both horizontal and vertical custom scrollbar */}
        <div className="overflow-auto max-h-[65vh] custom-scrollbar">
          <table className="w-full min-w-[1750px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {[
                  "SN.",
                  "Adm no.",
                  "Adm date",
                  "Student Name",
                  "Father Name",
                  "DOB",
                  "Board",
                  "Class",
                  "Academic Year",
                  "Category",
                  "Gender",
                  "Phone",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left text-gray-300 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="p-16">
                    <div className="flex items-center justify-center text-gray-400">
                      <Loader2 size={22} className="animate-spin mr-2" />
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-16 text-center text-gray-400">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const inactive = isInactive(student);

                  return (
                    <tr
                      key={student.slug}
                      className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                    >
                      <td className="p-4 text-white">{index + 1}.</td>

                      <td className="p-4 text-white">
                        {student.admissionNumber || "-"}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {formatDate(student.admissionDate)}
                      </td>

                      <td className="p-4 text-white whitespace-nowrap font-medium">
                        {student.studentName || "-"}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {student.fatherName || "-"}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
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

                      <td className="p-4 text-white">
                        {student.gender || "-"}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {student.phone || "-"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            inactive
                              ? "bg-red-500/15 border border-red-500/30 text-red-400"
                              : "bg-green-500/15 border border-green-500/30 text-green-400"
                          }`}
                        >
                          {inactive ? "Inactive" : "Active"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-row gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/academic/student-profile/${student.slug}`,
                              )
                            }
                            className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer"
                            title="View Student"
                          >
                            <Eye size={16} />
                          </button>

                          {!inactive && (
                            <button
                              type="button"
                              onClick={() => openEditModal(student)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400 hover:bg-blue-500/40 disabled:opacity-50"
                              title="Edit Student"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {inactive ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(student)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 cursor-pointer hover:bg-emerald-500/40 disabled:opacity-50"
                              title="Restore Student"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(student)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer hover:bg-red-500/40 disabled:opacity-50"
                              title="Delete Student"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddStudentModal
        isOpen={showStudentModal}
        onClose={closeStudentModal}
        editStudent={editStudent}
        // onSaved={refreshStudents}
      />
    </div>
  );
}
