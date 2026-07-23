import React, { useEffect, useMemo, useState } from "react";

import { FileSpreadsheet, Loader2, RefreshCw } from "lucide-react";

import { useSessionStore } from "../../store/master/session/sessionStore";

import { useStudentAcademicMappingStore } from "../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

import AssignSectionModal from "../../components/academics/stream&SectionManager/AssignSectionModal";
import AssignStreamModal from "../../components/academics/stream&SectionManager/AssignStreamModal";
import AssignRollNumberModal from "../../components/academics/rollNumberManagar/GenerateRollNumbersModal";
import EditRollNumberModal from "../../components/academics/rollNumberManagar/EditRollNumberModal";

export default function StreamSectionManager() {
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);

  const [showRollNumberModal, setShowRollNumberModal] = useState(false);

  const [showEditRollNumberModal, setShowEditRollNumberModal] = useState(false);

  const [selectedRollStudent, setSelectedRollStudent] = useState(null);
  /*
  |--------------------------------------------------------------------------
  | Stores
  |--------------------------------------------------------------------------
  */

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const {
    boards,
    unmappedStudents,
    mappedStudents,

    setupLoading,
    studentLoading,
    mappedStudentLoading,
    submitLoading,

    fetchAcademicSetup,
    fetchUnmappedStudents,
    fetchMappedStudents,
    updateStudentRollNumber,
    resetStudentLists,
  } = useStudentAcademicMappingStore();

  /*
  |--------------------------------------------------------------------------
  | Filter States
  |--------------------------------------------------------------------------
  */

  const [selectedSession, setSelectedSession] = useState("");

  const [selectedBoard, setSelectedBoard] = useState("");

  const [selectedClass, setSelectedClass] = useState("");

  const [selectedSectionFilter, setSelectedSectionFilter] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | Selected Student States
  |--------------------------------------------------------------------------
  */

  const [selectedStudentSlugs, setSelectedStudentSlugs] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | Initial Session Fetch
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    fetchSessions();

    resetStudentLists();

    return () => {
      resetStudentLists();
    };
  }, [fetchSessions, resetStudentLists]);

  /*
  |--------------------------------------------------------------------------
  | Derived Board
  |--------------------------------------------------------------------------
  */

  const selectedBoardData = useMemo(() => {
    return boards.find((board) => board.title === selectedBoard);
  }, [boards, selectedBoard]);

  /*
  |--------------------------------------------------------------------------
  | Class Options
  |--------------------------------------------------------------------------
  */

  const classOptions = useMemo(() => {
    return selectedBoardData?.classes || [];
  }, [selectedBoardData]);

  /*
  |--------------------------------------------------------------------------
  | Selected Class Data
  |--------------------------------------------------------------------------
  */

  const selectedClassData = useMemo(() => {
    return classOptions.find(
      (classItem) => classItem.classTitle === selectedClass,
    );
  }, [classOptions, selectedClass]);

  /*
  |--------------------------------------------------------------------------
  | Section And Stream Options
  |--------------------------------------------------------------------------
  */

  const sectionOptions = selectedClassData?.sections || [];
  const streamOptions = selectedClassData?.streams || [];

  /*
  |--------------------------------------------------------------------------
  | Normalize Unmapped Students
  |--------------------------------------------------------------------------
  |
  | Ye data Student table se aa raha hai.
  |
  */

  const normalizedUnmappedStudents = useMemo(() => {
    return unmappedStudents.map((student) => ({
      id: student.id,
      rowSlug: `student-${student.slug}`,

      studentSlug: student.slug,
      mappingSlug: null,

      admissionNumber: student.admissionNumber || "-",

      studentName: student.studentName || "-",

      fatherName: student.fatherName || "-",

      className: student.currentClass?.classTitle || selectedClass || "-",

      classSlug: student.currentClass?.slug || student.currentClassSlug || null,

      board: student.board?.title || selectedBoard || "-",

      session: student.currentSession?.name || selectedSession || "-",

      rollNumberPrefix: null,
      rollNumber: null,
      formattedRollNumber: "-",

      sectionSlug: null,
      sectionName: "-",

      streamSlug: null,
      streamName: "-",

      status: student.status || "active",
      isActive: student.isActive ?? true,

      profileImage: student.profileImage || null,

      isMapped: false,
    }));
  }, [unmappedStudents, selectedClass, selectedBoard, selectedSession]);

  /*
  |--------------------------------------------------------------------------
  | Normalize Mapped Students
  |--------------------------------------------------------------------------
  |
  | Ye data StudentAcademicRollSectionStreamMapping table se aa raha hai.
  |
  */

  const normalizedMappedStudents = useMemo(() => {
    return mappedStudents.map((mapping) => ({
      id: mapping.id,
      rowSlug: `mapping-${mapping.slug}`,

      studentSlug: mapping.student?.slug || mapping.studentSlug,

      mappingSlug: mapping.slug,

      admissionNumber: mapping.student?.admissionNumber || "-",

      studentName: mapping.student?.studentName || "-",

      fatherName: mapping.student?.fatherName || "-",

      className: mapping.class?.classTitle || "-",

      classSlug: mapping.class?.slug || mapping.classSlug || null,

      board: mapping.board?.title || "-",

      session: mapping.session?.name || "-",

      rollNumberPrefix: mapping.rollNumberPrefix || "",

      rollNumber: mapping.rollNumber ?? null,

      formattedRollNumber:
        mapping.formattedRollNumber ||
        (mapping.rollNumber !== null && mapping.rollNumber !== undefined
          ? `${mapping.rollNumberPrefix || ""}${mapping.rollNumber}`
          : "-"),

      sectionSlug: mapping.section?.slug || mapping.sectionSlug || null,

      sectionName:
        mapping.section?.title ||
        mapping.section?.sectionName ||
        mapping.section?.name ||
        "-",

      streamSlug: mapping.stream?.slug || mapping.streamSlug || null,

      streamName:
        mapping.stream?.title ||
        mapping.stream?.streamName ||
        mapping.stream?.name ||
        "-",

      status: mapping.status,
      isActive: mapping.isActive,

      profileImage: mapping.student?.profileImage || null,

      isMapped: true,
    }));
  }, [mappedStudents]);

  /*
  |--------------------------------------------------------------------------
  | Combined Students
  |--------------------------------------------------------------------------
  |
  | Pehle mapped student, uske baad unmapped students.
  |
  */

  const combinedStudents = useMemo(() => {
    if (!selectedSession || !selectedBoard || !selectedClass) {
      return [];
    }

    return [...normalizedMappedStudents, ...normalizedUnmappedStudents];
  }, [
    normalizedMappedStudents,
    normalizedUnmappedStudents,
    selectedSession,
    selectedBoard,
    selectedClass,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Section Filtered Students
  |--------------------------------------------------------------------------
  */

  const filteredStudents = useMemo(() => {
    if (selectedSectionFilter === "all") {
      return combinedStudents;
    }

    if (selectedSectionFilter === "unassigned") {
      return combinedStudents.filter((student) => !student.sectionSlug);
    }

    return combinedStudents.filter(
      (student) => student.sectionSlug === selectedSectionFilter,
    );
  }, [combinedStudents, selectedSectionFilter]);

  const selectedStudents = useMemo(() => {
    return combinedStudents.filter((student) =>
      selectedStudentSlugs.includes(student.studentSlug),
    );
  }, [combinedStudents, selectedStudentSlugs]);

  const selectedMappedStudents = useMemo(() => {
    return selectedStudents.filter(
      (student) => student.isMapped && student.isActive && student.mappingSlug,
    );
  }, [selectedStudents]);

  const selectedUnmappedStudents = useMemo(() => {
    return selectedStudents.filter((student) => !student.isMapped);
  }, [selectedStudents]);

  // this function for select all then all butons are enable

  const activeSelectedStudents = useMemo(() => {
    return selectedStudents.filter((student) => student.isActive !== false);
  }, [selectedStudents]);

  const canAssignSection =
    activeSelectedStudents.length > 0 &&
    selectedClass &&
    sectionOptions.length > 0 &&
    !submitLoading;

  const canAssignStream =
    activeSelectedStudents.length > 0 &&
    selectedClass &&
    streamOptions.length > 0 &&
    !submitLoading;

  const canAssignRollNumber =
    activeSelectedStudents.length > 0 && selectedClass && !submitLoading;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  const tableLoading = studentLoading || mappedStudentLoading;

  /*
  |--------------------------------------------------------------------------
  | Selected Students
  |--------------------------------------------------------------------------
  */

  const hasSelectedStudents = selectedStudentSlugs.length > 0;

  // const allVisibleStudentsSelected =
  //   filteredStudents.length > 0 &&
  //   filteredStudents.every((student) =>
  //     selectedStudentSlugs.includes(student.studentSlug),
  //   );

  /*
  |--------------------------------------------------------------------------
  | Session Change
  |--------------------------------------------------------------------------
  */

  const handleSessionChange = async (event) => {
    const sessionName = event.target.value;

    setSelectedSession(sessionName);
    setSelectedBoard("");
    setSelectedClass("");
    setSelectedSectionFilter("all");
    setSelectedStudentSlugs([]);

    resetStudentLists();

    if (!sessionName) {
      return;
    }

    await fetchAcademicSetup(sessionName);
  };

  /*
  |--------------------------------------------------------------------------
  | Board Change
  |--------------------------------------------------------------------------
  */

  const handleBoardChange = (event) => {
    const boardTitle = event.target.value;

    setSelectedBoard(boardTitle);
    setSelectedClass("");
    setSelectedSectionFilter("all");
    setSelectedStudentSlugs([]);

    resetStudentLists();
  };

  /*
  |--------------------------------------------------------------------------
  | Class Change
  |--------------------------------------------------------------------------
  */

  const handleClassChange = async (event) => {
    const classTitle = event.target.value;

    setSelectedClass(classTitle);
    setSelectedSectionFilter("all");
    setSelectedStudentSlugs([]);

    resetStudentLists();

    if (!selectedSession || !selectedBoard || !classTitle) {
      return;
    }

    const filters = {
      session: selectedSession,
      board: selectedBoard,
      classTitle,
    };

    /*
     * Before mapping:
     * Student table se unmapped students.
     *
     * After mapping:
     * Mapping table se mapped students.
     */

    await Promise.all([
      fetchUnmappedStudents(filters),

      fetchMappedStudents({
        ...filters,
        status: "all",
      }),
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | Refresh Student List
  |--------------------------------------------------------------------------
  */

  const handleRefreshStudents = async () => {
    if (!selectedSession || !selectedBoard || !selectedClass) {
      return;
    }

    const filters = {
      session: selectedSession,
      board: selectedBoard,
      classTitle: selectedClass,
    };

    setSelectedStudentSlugs([]);

    await Promise.all([
      fetchUnmappedStudents(filters),

      fetchMappedStudents({
        ...filters,
        status: "all",
      }),
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | Select Single Student
  |--------------------------------------------------------------------------
  */

  const handleSelectStudent = (studentSlug) => {
    setSelectedStudentSlugs((previous) => {
      const alreadySelected = previous.includes(studentSlug);

      if (alreadySelected) {
        return previous.filter((slug) => slug !== studentSlug);
      }

      return [...previous, studentSlug];
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Select All Visible Students
  |--------------------------------------------------------------------------
  */

  const selectableStudents = useMemo(() => {
    return filteredStudents.filter((student) => student.isActive !== false);
  }, [filteredStudents]);

  const allVisibleStudentsSelected =
    selectableStudents.length > 0 &&
    selectableStudents.every((student) =>
      selectedStudentSlugs.includes(student.studentSlug),
    );

  const handleSelectAll = () => {
    const visibleStudentSlugs = selectableStudents.map(
      (student) => student.studentSlug,
    );

    if (allVisibleStudentsSelected) {
      setSelectedStudentSlugs((previous) =>
        previous.filter((slug) => !visibleStudentSlugs.includes(slug)),
      );

      return;
    }

    setSelectedStudentSlugs((previous) => [
      ...new Set([...previous, ...visibleStudentSlugs]),
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | Export Placeholder
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    console.log("Export students:", filteredStudents);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Stream & Section Manager
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Filter students by academic year, board and class
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={!filteredStudents.length}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl text-white cursor-pointer transition-colors"
          >
            <FileSpreadsheet size={18} />
            Export To Excel
          </button>
        </div>

        {/* Filters */}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Session */}

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Academic Year
              </label>

              <select
                value={selectedSession}
                onChange={handleSessionChange}
                disabled={sessionLoading}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {sessionLoading ? "Loading sessions..." : "Select Acad. Year"}
                </option>

                {sessions.map((session) => (
                  <option key={session.slug} value={session.name}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Board */}

            <div>
              <label className="block mb-2 text-sm text-gray-400">Board</label>

              <select
                value={selectedBoard}
                onChange={handleBoardChange}
                disabled={!selectedSession || setupLoading}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {setupLoading ? "Loading boards..." : "Select Board"}
                </option>

                {boards.map((board) => (
                  <option key={board.slug} value={board.title}>
                    {board.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}

            <div>
              <label className="block mb-2 text-sm text-gray-400">Class</label>

              <select
                value={selectedClass}
                onChange={handleClassChange}
                disabled={!selectedBoard}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select Class</option>

                {classOptions.map((classItem) => (
                  <option key={classItem.slug} value={classItem.classTitle}>
                    {classItem.classTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRefreshStudents}
                disabled={
                  !selectedSession ||
                  !selectedBoard ||
                  !selectedClass ||
                  tableLoading
                }
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl text-white cursor-pointer transition-colors"
              >
                {tableLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                Refresh Students
              </button>
            </div>
          </div>
        </div>

        {/* Student Counts */}

        {/* {selectedClass && !tableLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Total Students</p>

              <p className="mt-1 text-2xl font-bold text-white">
                {combinedStudents.length}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Mapped Students</p>

              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {normalizedMappedStudents.length}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Unmapped Students</p>

              <p className="mt-1 text-2xl font-bold text-amber-400">
                {normalizedUnmappedStudents.length}
              </p>
            </div>
          </div>
        )} */}
      </div>

      {/* Selected Student Action Placeholder */}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-gray-400">
          {hasSelectedStudents
            ? `${selectedStudentSlugs.length} student(s) selected`
            : "Select students to assign section, stream and roll number"}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowStreamModal(true)}
            disabled={!canAssignStream}
            className={`px-5 py-3 rounded-xl text-white transition-all ${
              canAssignStream
                ? "bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            Assign Stream
          </button>

          <button
            type="button"
            onClick={() => setShowSectionModal(true)}
            disabled={!canAssignSection}
            className={`px-5 py-3 rounded-xl text-white transition-all ${
              canAssignSection
                ? "bg-pink-500 hover:bg-pink-600 cursor-pointer"
                : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            Assign Section
          </button>

          <button
            type="button"
            onClick={() => setShowRollNumberModal(true)}
            disabled={!canAssignRollNumber}
            className={`px-5 py-3 rounded-xl text-white transition-all ${
              canAssignRollNumber
                ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            Assign Roll Number
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[65vh] custom-scrollbar">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left text-gray-300">
                  <input
                    type="checkbox"
                    checked={allVisibleStudentsSelected}
                    disabled={!selectableStudents.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </th>

                <th className="p-4 text-left text-gray-300">SN.</th>

                <th className="p-4 text-left text-gray-300">Admission No.</th>

                <th className="p-4 text-left text-gray-300">Roll Number</th>

                <th className="p-4 text-left text-gray-300">Student Name</th>

                <th className="p-4 text-left text-gray-300">Class</th>

                <th className="p-4 text-left text-gray-300">Stream</th>

                <th className="p-4 text-left text-gray-300">
                  <div className="flex items-center justify-between gap-3">
                    <span>Section</span>

                    <select
                      value={selectedSectionFilter}
                      onChange={(event) =>
                        setSelectedSectionFilter(event.target.value)
                      }
                      disabled={!selectedClass}
                      className="min-w-36 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none disabled:opacity-60"
                    >
                      <option value="all">All Sections</option>

                      <option value="unassigned">Unassigned</option>

                      {sectionOptions.map((section) => (
                        <option key={section.slug} value={section.slug}>
                          {section.title || section.sectionName || section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>

                <th className="p-4 text-left text-gray-300">Mapping Status</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}

              {tableLoading && (
                <tr>
                  <td colSpan={10} className="p-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Loader2
                        size={30}
                        className="animate-spin text-indigo-400"
                      />

                      <span>Loading students...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Select Filters */}

              {!tableLoading && !selectedClass && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-gray-400">
                    Select academic year, board and class to view students.
                  </td>
                </tr>
              )}

              {/* Empty Students */}

              {!tableLoading && selectedClass && !filteredStudents.length && (
                <tr>
                  <td colSpan={10} className="p-12 text-center">
                    <p className="text-gray-300 font-medium">
                      No students found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      No students are available for the selected filters.
                    </p>
                  </td>
                </tr>
              )}

              {/* Student Rows */}

              {!tableLoading &&
                selectedSession &&
                selectedBoard &&
                selectedClass &&
                filteredStudents.map((student, index) => {
                  const isSelected = selectedStudentSlugs.includes(
                    student.studentSlug,
                  );

                  return (
                    <tr
                      key={student.rowSlug}
                      className={`border-t border-gray-800 transition-colors ${
                        isSelected ? "bg-indigo-500/10" : "hover:bg-gray-800/30"
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={student.isActive === false}
                          onChange={() =>
                            handleSelectStudent(student.studentSlug)
                          }
                          title={
                            student.isActive === false
                              ? "Inactive mapping cannot be selected"
                              : "Select student"
                          }
                          className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>

                      {/* Other td fields */}

                      <td className="p-4 text-white">{index + 1}.</td>

                      <td className="p-4 whitespace-nowrap text-white">
                        {student.admissionNumber}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <EditableRollNumberCell
                          student={student}
                          onUpdate={async (formattedRollNumber) => {
                            const success = await updateStudentRollNumber({
                              mappingSlug: student.mappingSlug,

                              formattedRollNumber,
                            });

                            return success;
                          }}
                        />
                      </td>

                      <td className="p-4 text-white font-medium whitespace-nowrap">
                        {student.studentName}
                      </td>

                      <td className="p-4 text-white whitespace-nowrap">
                        {student.className}
                      </td>

                      <td className="p-4 text-indigo-400 whitespace-nowrap">
                        {student.streamName}
                      </td>

                      <td className="p-4 text-pink-400 font-medium whitespace-nowrap">
                        {student.sectionName}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            student.isMapped
                              ? student.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {student.isMapped
                            ? student.isActive
                              ? "Mapped"
                              : "Inactive"
                            : "Not Mapped"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <AssignSectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        sections={sectionOptions}
        selectedStudents={activeSelectedStudents}
        session={selectedSession}
        board={selectedBoard}
        classTitle={selectedClass}
        onSuccess={async () => {
          await handleRefreshStudents();

          setSelectedStudentSlugs([]);
          setShowSectionModal(false);
        }}
      />

      <AssignStreamModal
        isOpen={showStreamModal}
        onClose={() => setShowStreamModal(false)}
        streams={streamOptions}
        selectedStudents={activeSelectedStudents}
        onSuccess={async () => {
          await fetchMappedStudents({
            session: selectedSession,
            board: selectedBoard,
            classTitle: selectedClass,
            status: "all",
          });

          setSelectedStudentSlugs([]);
          setShowStreamModal(false);
        }}
      />

      <AssignRollNumberModal
        isOpen={showRollNumberModal}
        onClose={() => setShowRollNumberModal(false)}
        selectedStudents={activeSelectedStudents}
        session={selectedSession}
        board={selectedBoard}
        classTitle={selectedClass}
        onSuccess={async () => {
          await fetchMappedStudents({
            session: selectedSession,

            board: selectedBoard,

            classTitle: selectedClass,

            status: "all",
          });

          setSelectedStudentSlugs([]);

          setShowRollNumberModal(false);
        }}
      />

      <EditRollNumberModal
        isOpen={showEditRollNumberModal}
        onClose={() => {
          setShowEditRollNumberModal(false);

          setSelectedRollStudent(null);
        }}
        student={selectedRollStudent}
        onSuccess={async () => {
          await fetchMappedStudents({
            session: selectedSession,
            board: selectedBoard,
            classTitle: selectedClass,
            status: "all",
          });

          setShowEditRollNumberModal(false);

          setSelectedRollStudent(null);
        }}
      />
    </div>
  );
}

function EditableRollNumberCell({ student, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const [value, setValue] = useState(
    student.formattedRollNumber === "-"
      ? ""
      : student.formattedRollNumber || "",
  );

  const [saving, setSaving] = useState(false);

  const inputRef = React.useRef(null);

  const saveInProgressRef = React.useRef(false);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setValue(
      student.formattedRollNumber === "-"
        ? ""
        : student.formattedRollNumber || "",
    );
  }, [student.formattedRollNumber, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();

      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!student.isMapped || student.isActive === false || saving) {
      return;
    }

    setValue(
      student.formattedRollNumber === "-"
        ? ""
        : student.formattedRollNumber || "",
    );

    setIsEditing(true);
  };

  const handleCancel = () => {
    setValue(
      student.formattedRollNumber === "-"
        ? ""
        : student.formattedRollNumber || "",
    );

    setIsEditing(false);
  };

  const handleSave = async () => {
    if (saveInProgressRef.current || saving) {
      return;
    }

    const normalizedValue = value.trim();

    const oldValue =
      student.formattedRollNumber === "-"
        ? ""
        : String(student.formattedRollNumber || "").trim();

    if (!normalizedValue) {
      handleCancel();
      return;
    }

    if (normalizedValue === oldValue) {
      setIsEditing(false);
      return;
    }

    if (!/^(.*?)(\d+)$/.test(normalizedValue)) {
      return;
    }

    saveInProgressRef.current = true;

    setSaving(true);

    const success = await onUpdate(normalizedValue);

    setSaving(false);

    saveInProgressRef.current = false;

    if (success) {
      setValue(normalizedValue);
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      await handleSave();
    }

    if (event.key === "Escape") {
      event.preventDefault();

      handleCancel();
    }
  };

  if (!student.isMapped) {
    return <span className="text-gray-500">-</span>;
  }

  if (isEditing) {
    return (
      <div className="relative min-w-32">
        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={saving}
          onChange={(event) => setValue(event.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-36 rounded-lg border border-indigo-500 bg-gray-800 px-3 py-2 text-indigo-300 outline-none disabled:opacity-60"
          placeholder="UKG-001"
        />

        {saving && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 size={15} className="animate-spin text-indigo-400" />
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onDoubleClick={handleStartEdit}
      title="Double-click to edit roll number"
      className="cursor-text whitespace-nowrap rounded-lg px-2 py-1 font-medium text-indigo-400 transition-colors hover:bg-indigo-500/10"
    >
      {student.formattedRollNumber || "-"}
    </button>
  );
}
