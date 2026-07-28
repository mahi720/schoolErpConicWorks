import React, { useEffect, useMemo, useState } from "react";

import { Search, Eye, Plus, ClipboardPlus, Loader2 } from "lucide-react";

import AddHealthInfoModal from "../../components/academics/StudentHealthManagementModal/AddHealthInfoModal";
import AddOtherInfoModal from "../../components/academics/StudentHealthManagementModal/AddOtherInfoModal";

import { useStudentHealthManagementStore } from "../../store/academic/studentHealthManagement/studentHealthManagementStore";

const formatDate = (date) => {
  if (!date) {
    return "NA";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB");
};

const getSessionName = (session) => {
  return session?.name || session?.title || "";
};

const getBoardTitle = (board) => {
  return board?.title || board?.name || "";
};

const getClassTitle = (classItem) => {
  return classItem?.classTitle || classItem?.title || "";
};

const getSectionTitle = (section) => {
  return section?.title || section?.name || "";
};

export default function StudentHealthManagement() {
  const [healthModal, setHealthModal] = useState(false);
  const [otherModal, setOtherModal] = useState(false);
  const [showOtherInfoModal, setShowOtherInfoModal] = useState(false);
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const {
    students,
    sessions,
    boards,
    classes,
    sections,

    selectedStudent,

    loading,
    filterLoading,
    submitLoading,

    currentAcademicYear,
    filters,

    setFilter,
    setSelectedStudent,
    resetDependentFilters,

    fetchSessions,
    fetchBoards,
    fetchClasses,
    fetchSections,
    fetchStudents,
  } = useStudentHealthManagementStore();

  useEffect(() => {
    const initializePage = async () => {
      await Promise.all([fetchSessions(), fetchBoards()]);

      await fetchStudents();
    };

    initializePage();
  }, [fetchSessions, fetchBoards, fetchStudents]);

  useEffect(() => {
    if (!filters.academicYear && currentAcademicYear) {
      setFilter("academicYear", currentAcademicYear);
    }
  }, [currentAcademicYear, filters.academicYear, setFilter]);

  useEffect(() => {
    if (filters.academicYear && filters.board) {
      fetchClasses();
    }
  }, [filters.academicYear, filters.board, fetchClasses]);

  useEffect(() => {
    if (filters.academicYear && filters.board && filters.classTitle) {
      fetchSections();
    }
  }, [filters.academicYear, filters.board, filters.classTitle, fetchSections]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchStudents();
      },
      filters.search ? 500 : 0,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    filters.academicYear,
    filters.board,
    filters.classTitle,
    filters.section,
    filters.category,
    filters.search,
    fetchStudents,
  ]);

  const categoryOptions = useMemo(() => {
    return ["General", "OBC", "SC", "ST", "EWS"];
  }, []);

  const handleAcademicYearChange = (event) => {
    const value = event.target.value;

    setFilter("academicYear", value);

    resetDependentFilters(["board", "classTitle", "section"]);
  };

  const handleBoardChange = (event) => {
    const value = event.target.value;

    setFilter("board", value);

    resetDependentFilters(["classTitle", "section"]);
  };

  const handleClassChange = (event) => {
    const value = event.target.value;

    setFilter("classTitle", value);

    resetDependentFilters(["section"]);
  };

  const handleSectionChange = (event) => {
    setFilter("section", event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilter("category", event.target.value);
  };

  const handleSearchChange = (event) => {
    setFilter("search", event.target.value);
  };

  const openHealthModal = (student) => {
    setSelectedStudent(student);
    setHealthModal(true);
  };

  const closeHealthModal = () => {
    setHealthModal(false);
    setSelectedStudent(null);
  };

  const openOtherModal = (student) => {
    setSelectedStudent(student);
    setOtherModal(true);
  };

  const closeOtherModal = () => {
    setOtherModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Student Health Management
        </h1>

        <p className="text-gray-400 mt-1">Manage students health records</p>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="grid grid-cols-6 gap-4">
          <select
            value={filters.academicYear}
            onChange={handleAcademicYearChange}
            disabled={filterLoading}
            className="input cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select Acad. Year</option>

            {sessions.map((session) => {
              const sessionName = getSessionName(session);

              return (
                <option key={session.slug || sessionName} value={sessionName}>
                  {sessionName}
                </option>
              );
            })}
          </select>

          <select
            value={filters.board}
            onChange={handleBoardChange}
            disabled={filterLoading || !filters.academicYear}
            className="input cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select Board</option>

            {boards.map((board) => {
              const boardTitle = getBoardTitle(board);

              return (
                <option key={board.slug || boardTitle} value={boardTitle}>
                  {boardTitle}
                </option>
              );
            })}
          </select>

          <select
            value={filters.classTitle}
            onChange={handleClassChange}
            disabled={filterLoading || !filters.academicYear || !filters.board}
            className="input cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select Class</option>

            {classes.map((classItem) => {
              const classTitle = getClassTitle(classItem);

              return (
                <option key={classItem.slug || classTitle} value={classTitle}>
                  {classTitle}
                </option>
              );
            })}
          </select>

          <select
            value={filters.section}
            onChange={(event) => setFilter("section", event.target.value)}
            disabled={
              filterLoading ||
              !filters.academicYear ||
              !filters.board ||
              !filters.classTitle
            }
            className="input cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select Section</option>

            {sections.map((section) => (
              <option key={section.slug} value={section.title}>
                {section.title}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="input cursor-pointer"
          >
            <option value="">Select Category</option>

            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search student..."
              className="input w-full !pl-12 pr-4"
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-auto max-h-[500px] custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              {[
                "SN.",
                "Adm No.",
                "Board Reg.",
                // "Student ID",
                "Student",
                "Father",
                "Parent",
                "DOB",
                "Board",
                "Class",
                "Section",
                "Phone",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="p-4 text-left text-gray-300 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="p-10 text-center">
                  <div className="flex items-center justify-center gap-3 text-gray-400">
                    <Loader2 size={22} className="animate-spin" />
                    Loading students...
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={13} className="p-10 text-center text-gray-400">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((item, i) => {
                const student = item;
                return (
                  <tr
                    key={item.mappingSlug || student.slug}
                    className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <td className="td">{i + 1}.</td>

                    <td className="td">{student.admissionNumber || "NA"}</td>

                    <td className="td">
                      {student.boardRegistrationNumber ||
                        student.boardRegNumber ||
                        "NA"}
                    </td>

                    {/* <td className="td">
                      {student.studentId ||
                        student.studentCode ||
                        student.slug ||
                        "NA"}
                    </td> */}

                    <td className="td font-semibold text-white">
                      {student.studentName || "N/A"}
                    </td>

                    <td className="td">{student.fatherName || "N/A"}</td>

                    <td className="td">
                      {student.parentName ||
                        student.guardianName ||
                        student.motherName ||
                        "NA"}
                    </td>

                    <td className="td">
                      {formatDate(student.dateOfBirth || student.dob)}
                    </td>

                    <td className="td">{item.board || "NA"}</td>

                    <td className="td">{item.classTitle || "NA"}</td>

                    <td className="td">{item.section || "NA"}</td>

                    <td className="td">
                      {student.phone ||
                        student.phoneNumber ||
                        student.mobileNumber ||
                        "N/A"}
                    </td>

                    {/* Actions */}

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg">
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStudent(item);
                            setShowHealthModal(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 cursor-pointer rounded-lg"
                        >
                          <ClipboardPlus
                            title={
                              item?.healthAssessment?.exists
                                ? "Edit Health Info"
                                : "Add Health Info"
                            }
                            size={16}
                          />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStudent(item);
                            setShowOtherInfoModal(true);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer p-2 rounded-lg"
                        >
                          <Plus
                            title={
                              item?.otherInformation?.exists
                                ? "Edit Other Info"
                                : "Add Other Info"
                            }
                            size={16}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AddHealthInfoModal
        open={showHealthModal}
        close={() => {
          setShowHealthModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        academicYear={selectedStudent?.academicYear}
        assessmentSlug={selectedStudent?.healthAssessmentSlug}
        isEdit={selectedStudent?.hasHealthAssessment}
        onSuccess={async () => {
          await fetchStudents();
          setShowHealthModal(false);
          setSelectedStudent(null);
        }}
      />

      <AddOtherInfoModal
        open={showOtherInfoModal}
        close={() => {
          setShowOtherInfoModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        academicYear={selectedStudent?.academicYear}
        otherInformationSlug={selectedStudent?.otherInformationSlug}
        isEdit={selectedStudent?.hasOtherInformation}
        onSuccess={async () => {
          await fetchStudents();
          setShowOtherInfoModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
