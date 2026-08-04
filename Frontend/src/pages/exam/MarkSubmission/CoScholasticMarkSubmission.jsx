import React, { useEffect, useMemo, useState } from "react";
import { Edit, Eye, FileText, Loader2, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";

import { useCoScholasticGradeSubmissionStore } from "../../../store/examManager/markSubmission/coScholasticGradeSubmission/coScholasticGradeSubmissionStore";

import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";
import { useClassStore } from "../../../store/master/class/classStore";
import { useClassMappingStore } from "../../../store/master/classMapping/classMappingStore";
import { useTermExamTimeTableStore } from "../../../store/examManager/termExamTimeTable/termExamTimeTableStore";

import {
  validateCoScholasticFilters,
  validateSaveCoScholasticGrades,
} from "../../../validations/examManager/markSubmission/coScholasticGradeSubmission/coScholasticGradeSubmissionValidation";

const GRADE_OPTIONS = [
  { value: "A_PLUS", label: "A+" },
  { value: "A", label: "A" },
  { value: "B_PLUS", label: "B+" },
  { value: "B", label: "B" },
  { value: "C_PLUS", label: "C+" },
  { value: "C", label: "C" },
  { value: "D_PLUS", label: "D+" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  {
    value: "NEEDS_IMPROVEMENT",
    label: "Needs Improvement",
  },
  {
    value: "NOT_ASSESSED",
    label: "Not Assessed",
  },
];

const RESULT_OPTIONS = [
  { value: "NOT_DECLARED", label: "Not Declared" },
  { value: "PASS", label: "Pass" },
  { value: "FAIL", label: "Fail" },
  { value: "PROMOTED", label: "Promoted" },
  { value: "DETAINED", label: "Detained" },
];

export default function CoScholasticMarkSubmission() {
  const [selected, setSelected] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);

  const [remarkModal, setRemarkModal] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [activeStudentSlug, setActiveStudentSlug] = useState(null);

  const [remarkData, setRemarkData] = useState({
    type: "",
    remark: "",
  });

  const {
    filters,
    configuration,
    submission,
    students,

    loading,
    submitLoading,
    lockLoading,

    setFilter,
    setFilters,
    clearGradeData,
    setStudentSelected,

    updateSubjectGrade,
    updateRemarkType,
    updateRemark,
    updatePresentDays,
    updateTotalDays,
    updateResult,

    fetchStudents,
    saveGrades,
    lockGrades,
  } = useCoScholasticGradeSubmissionStore();

  const {
    sessions = [],
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { boards = [], loading: boardLoading, fetchBoards } = useBoardStore();

  const { classes = [], loading: classLoading, fetchClasses } = useClassStore();

  const {
    mappings = [],
    loading: mappingLoading,
    fetchMappings,
  } = useClassMappingStore();

  const {
    termExams = [],
    loading: termExamLoading,
    fetchTermExams,
  } = useTermExamTimeTableStore();

  const selectedClass = filters.classTitle;
  const isLocked = Boolean(submission?.isLocked);

  const subjects = useMemo(() => {
    return Array.isArray(configuration?.subjects) ? configuration.subjects : [];
  }, [configuration]);

  const activeSessions = useMemo(() => {
    return sessions.filter(
      (item) => item.isActive !== false && item.status !== "inactive",
    );
  }, [sessions]);

  const activeBoards = useMemo(() => {
    return boards.filter(
      (item) => item.isActive !== false && item.status !== "inactive",
    );
  }, [boards]);

  const activeTermExams = useMemo(() => {
    return termExams.filter((item) => {
      const isActive = item.isActive !== false && item.status !== "inactive";

      const sessionMatches =
        !filters.academicYear ||
        item.sessionName === filters.academicYear ||
        item.session?.name === filters.academicYear;

      const boardMatches =
        !filters.board ||
        item.boardTitle === filters.board ||
        item.board?.title === filters.board;

      return isActive && sessionMatches && boardMatches;
    });
  }, [termExams, filters.academicYear, filters.board]);

  const activeClasses = useMemo(() => {
    return classes.filter(
      (item) => item.isActive !== false && item.status !== "inactive",
    );
  }, [classes]);

  const selectedClassMappings = useMemo(() => {
    return mappings.filter((item) => {
      const classTitle =
        item.classTitle ||
        item.class?.classTitle ||
        item.classData?.classTitle ||
        "";

      return classTitle === filters.classTitle;
    });
  }, [mappings, filters.classTitle]);

  const sectionOptions = useMemo(() => {
    const map = new Map();

    selectedClassMappings.forEach((mapping) => {
      const sections = Array.isArray(mapping.sections) ? mapping.sections : [];

      const sectionSlugs = Array.isArray(mapping.sectionSlugs)
        ? mapping.sectionSlugs
        : [];

      sections.forEach((item, index) => {
        const isString = typeof item === "string";

        const slug = isString
          ? sectionSlugs[index] || ""
          : item?.slug || item?.sectionSlug || sectionSlugs[index] || "";

        const title = isString
          ? item
          : item?.sectionTitle || item?.title || item?.section || "";

        if (!title) {
          return;
        }

        const key = slug || title;

        if (!map.has(key)) {
          map.set(key, {
            slug,
            title,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [selectedClassMappings]);

  const streamOptions = useMemo(() => {
    const map = new Map();

    selectedClassMappings.forEach((mapping) => {
      const streams = Array.isArray(mapping.streams) ? mapping.streams : [];

      const streamSlugs = Array.isArray(mapping.streamSlugs)
        ? mapping.streamSlugs
        : [];

      streams.forEach((item, index) => {
        const isString = typeof item === "string";

        const slug = isString
          ? streamSlugs[index] || ""
          : item?.slug || item?.streamSlug || streamSlugs[index] || "";

        const title = isString
          ? item
          : item?.streamTitle || item?.title || item?.stream || "";

        if (!title) {
          return;
        }

        const key = slug || title;

        if (!map.has(key)) {
          map.set(key, {
            slug,
            title,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [selectedClassMappings]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const sectionMatches =
        !filters.section || student.sectionTitle === filters.section;

      const streamMatches =
        !filters.stream || student.streamTitle === filters.stream;

      return sectionMatches && streamMatches;
    });
  }, [students, filters.section, filters.stream]);

  useEffect(() => {
    fetchSessions();
    fetchBoards();
  }, [fetchSessions, fetchBoards]);

  useEffect(() => {
    if (!filters.academicYear || !filters.board) {
      return;
    }

    fetchTermExams({
      session: filters.academicYear,
      board: filters.board,
    });

    fetchClasses({
      session: filters.academicYear,
      board: filters.board,
    });
  }, [filters.academicYear, filters.board, fetchTermExams, fetchClasses]);

  useEffect(() => {
    if (!filters.academicYear || !filters.board || !filters.classTitle) {
      return;
    }

    fetchMappings({
      session: filters.academicYear,
      board: filters.board,
      classTitle: filters.classTitle,
    });
  }, [filters.academicYear, filters.board, filters.classTitle, fetchMappings]);

  useEffect(() => {
    if (
      !filters.academicYear ||
      !filters.board ||
      !filters.termExamSlug ||
      !filters.classTitle
    ) {
      return;
    }

    handleLoadStudents();
  }, [
    filters.academicYear,
    filters.board,
    filters.termExamSlug,
    filters.classTitle,
    filters.stream,
  ]);

  useEffect(() => {
    setSelected([]);
  }, [
    filters.academicYear,
    filters.board,
    filters.termExamSlug,
    filters.classTitle,
  ]);

  const handleAcademicYearChange = (value) => {
    clearGradeData();

    setFilters({
      academicYear: value,
      board: "",
      termExamSlug: "",
      termExamTitle: "",
      classTitle: "",
      section: "",
      stream: "",
    });

    setSelected([]);
  };

  const handleBoardChange = (value) => {
    clearGradeData();

    setFilters({
      board: value,
      termExamSlug: "",
      termExamTitle: "",
      classTitle: "",
      section: "",
      stream: "",
    });

    setSelected([]);
  };

  const handleTermExamChange = (slug) => {
    const exam = activeTermExams.find((item) => item.slug === slug);

    clearGradeData();

    setFilters({
      termExamSlug: slug,
      termExamTitle: exam?.examTitle || exam?.title || "",
      classTitle: "",
      section: "",
      stream: "",
    });

    setSelected([]);
  };

  const handleClassChange = (value) => {
    clearGradeData();

    setFilters({
      classTitle: value,
      section: "",
      stream: "",
    });

    setSelected([]);
  };

  const handleSectionChange = (value) => {
    const section = sectionOptions.find(
      (item) => item.slug === value || item.title === value,
    );

    setFilter("section", section?.title || value || "");

    setSelected([]);
  };

  const handleStreamChange = (value) => {
    const stream = streamOptions.find(
      (item) => item.slug === value || item.title === value,
    );

    setFilter("stream", stream?.title || value || "");

    setSelected([]);
  };

  const handleLoadStudents = async () => {
    const validation = validateCoScholasticFilters({
      academicYear: filters.academicYear,

      board: filters.board,

      termExamSlug: filters.termExamSlug,

      classTitle: filters.classTitle,

      // Section is filtered locally, so existing entered values remain safe.
      section: null,

      stream: filters.stream || null,
    });

    if (!validation.success) {
      return false;
    }

    const success = await fetchStudents({
      ...validation.data,

      section: undefined,

      stream: validation.data.stream || undefined,
    });

    if (success) {
      setSelected([]);
    }

    return success;
  };

  const toggleAll = (event) => {
    const checked = event.target.checked;

    const visibleSlugs = filteredStudents.map((student) => student.studentSlug);

    if (checked) {
      setSelected((previous) => [...new Set([...previous, ...visibleSlugs])]);

      visibleSlugs.forEach((studentSlug) => {
        setStudentSelected(studentSlug, true);
      });

      return;
    }

    setSelected((previous) =>
      previous.filter((studentSlug) => !visibleSlugs.includes(studentSlug)),
    );

    visibleSlugs.forEach((studentSlug) => {
      setStudentSelected(studentSlug, false);
    });
  };

  const toggleOne = (studentSlug) => {
    const alreadySelected = selected.includes(studentSlug);

    setSelected((previous) =>
      alreadySelected
        ? previous.filter((slug) => slug !== studentSlug)
        : [...previous, studentSlug],
    );

    setStudentSelected(studentSlug, !alreadySelected);
  };

  const openRemark = (student, mode) => {
    setActiveStudentSlug(student.studentSlug);

    setViewMode(mode === "view");

    setRemarkData({
      type: student.remarkType || "",

      remark: student.remark || "",
    });

    setRemarkModal(true);
  };

  const saveRemark = () => {
    if (!activeStudentSlug) {
      return;
    }

    updateRemarkType(activeStudentSlug, remarkData.type);

    updateRemark(activeStudentSlug, remarkData.remark);

    setRemarkModal(false);
    setActiveStudentSlug(null);
  };

  const handleGradeChange = (studentSlug, classSubjectSlug, value) => {
    updateSubjectGrade(studentSlug, classSubjectSlug, value || null);
  };

  const buildStudentPayload = (selectedStudents) => {
    return selectedStudents.map((student) => ({
      studentSlug: student.studentSlug,

      academicMappingSlug: student.academicMappingSlug,

      overallStatus: student.overallStatus || "ASSESSED",

      remarkType: student.remarkType?.trim() || null,

      remark: student.remark?.trim() || null,

      presentDays:
        student.presentDays === "" ||
        student.presentDays === null ||
        student.presentDays === undefined
          ? null
          : Number(student.presentDays),

      totalDays:
        student.totalDays === "" ||
        student.totalDays === null ||
        student.totalDays === undefined
          ? null
          : Number(student.totalDays),

      result: student.result || "NOT_DECLARED",

      subjectGrades: subjects.map((subject) => {
        const value = student.subjectGrades?.[subject.classSubjectSlug] || {};

        const assessmentStatus = value.assessmentStatus || "ASSESSED";

        return {
          classSubjectSlug: subject.classSubjectSlug,

          grade:
            student.overallStatus !== "ASSESSED" ||
            assessmentStatus !== "ASSESSED"
              ? null
              : value.grade || null,

          assessmentStatus:
            student.overallStatus !== "ASSESSED"
              ? student.overallStatus
              : assessmentStatus,

          remarks: value.remarks?.trim() || null,
        };
      }),
    }));
  };

  const saveResult = async () => {
    if (isLocked) {
      toast.error("Grades are locked and cannot be edited");

      return;
    }

    if (!selected.length) {
      toast.error("Select at least one student");

      return;
    }

    if (!subjects.length) {
      toast.error("Co-Scholastic or Personality Traits subjects not found");

      return;
    }

    const selectedStudents = students.filter((student) =>
      selected.includes(student.studentSlug),
    );

    const payload = {
      academicYear: filters.academicYear,

      board: filters.board,

      termExamSlug: filters.termExamSlug,

      classTitle: filters.classTitle,

      section: filters.section || null,

      stream: filters.stream || null,

      students: buildStudentPayload(selectedStudents),
    };

    const validation = validateSaveCoScholasticGrades(payload);

    if (!validation.success) {
      toast.error(validation.message || "Invalid Co-Scholastic grade data");

      return;
    }

    const success = await saveGrades(validation.data);

    if (!success) {
      return;
    }

    setSelected([]);

    await fetchStudents({
      academicYear: filters.academicYear,

      board: filters.board,

      termExamSlug: filters.termExamSlug,

      classTitle: filters.classTitle,

      section: undefined,

      stream: filters.stream || undefined,
    });
  };

  const lockMarks = () => {
    if (!submission?.slug) {
      toast.error("Save grades before locking");

      return;
    }

    if (isLocked) {
      toast.error("Grades are already locked");

      return;
    }

    setShowLockModal(true);
  };

  const confirmLockMarks = async () => {
    if (!submission?.slug) {
      toast.error("Grade submission not found");

      return;
    }

    const success = await lockGrades(submission.slug);

    if (!success) {
      return;
    }

    setShowLockModal(false);
    setSelected([]);
  };

  const handlePdf = () => {
    if (!submission?.slug) {
      toast.error("Save grades before generating PDF");

      return;
    }

    toast.error("PDF generation API is not connected yet");
  };

  const handleTeacherWise = () => {
    toast.error("Teacher-wise view is not connected yet");
  };

  const selectedSectionValue =
    sectionOptions.find((item) => item.title === filters.section)?.slug || "";

  const selectedStreamValue =
    streamOptions.find((item) => item.title === filters.stream)?.slug || "";

  const allVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selected.includes(student.studentSlug));

  const columnCount = 9 + subjects.length;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          Co-Scholastic/Personality Traits & Remark
        </h1>

        <div className="flex gap-3">
          <select
            value={filters.academicYear}
            onChange={(event) => handleAcademicYearChange(event.target.value)}
            disabled={sessionLoading}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {sessionLoading ? "Loading..." : "Select Acad. Year"}
            </option>

            {activeSessions.map((session) => (
              <option
                key={session.slug}
                value={session.name || session.sessionName}
              >
                {session.name || session.sessionName}
              </option>
            ))}
          </select>

          <select
            value={filters.board}
            onChange={(event) => handleBoardChange(event.target.value)}
            disabled={!filters.academicYear || boardLoading}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {boardLoading ? "Loading..." : "Select Board"}
            </option>

            {activeBoards.map((board) => (
              <option key={board.slug} value={board.title || board.boardTitle}>
                {board.title || board.boardTitle}
              </option>
            ))}
          </select>

          <select
            value={filters.termExamSlug}
            onChange={(event) => handleTermExamChange(event.target.value)}
            disabled={
              !filters.academicYear || !filters.board || termExamLoading
            }
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-44 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {termExamLoading ? "Loading..." : "Select Exam"}
            </option>

            {activeTermExams.map((exam) => (
              <option key={exam.slug} value={exam.slug}>
                {exam.examTitle || exam.title}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(event) => handleClassChange(event.target.value)}
            disabled={
              !filters.academicYear ||
              !filters.board ||
              !filters.termExamSlug ||
              classLoading
            }
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {classLoading ? "Loading..." : "Select Class"}
            </option>

            {activeClasses.map((item) => (
              <option key={item.slug} value={item.classTitle}>
                {item.classTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* show after class selected */}

      {!selectedClass ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <FileText size={55} className="text-gray-600 mb-4" />

            <h2 className="text-xl font-semibold text-white">
              Select Class To View Students
            </h2>

            <p className="text-gray-400 mt-2">
              Please select academic year, board, exam and class to load student
              marks list.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl text-white mb-4">All Students</h2>

              <div className="flex gap-4">
                <select
                  value={selectedSectionValue}
                  onChange={(event) => handleSectionChange(event.target.value)}
                  disabled={mappingLoading || !sectionOptions.length}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {mappingLoading
                      ? "Loading..."
                      : sectionOptions.length
                        ? "Select Section"
                        : "No Section"}
                  </option>

                  {sectionOptions.map((section) => (
                    <option
                      key={section.slug || section.title}
                      value={section.slug || section.title}
                    >
                      {section.title}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStreamValue}
                  onChange={(event) => handleStreamChange(event.target.value)}
                  disabled={mappingLoading || !streamOptions.length}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {mappingLoading
                      ? "Loading..."
                      : streamOptions.length
                        ? "Select Stream"
                        : "No Stream"}
                  </option>

                  {streamOptions.map((stream) => (
                    <option
                      key={stream.slug || stream.title}
                      value={stream.slug || stream.title}
                    >
                      {stream.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={
                  isLocked || submitLoading || loading || !students.length
                }
                onClick={saveResult}
                className={`px-8 py-3 rounded-xl text-white flex gap-2 ${
                  isLocked || submitLoading || loading || !students.length
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 cursor-pointer"
                }`}
              >
                {submitLoading ? (
                  <Loader2 size={18} className="mt-1 animate-spin" />
                ) : (
                  <Save size={18} className="mt-1" />
                )}

                {submitLoading ? "Saving..." : "Save Result"}
              </button>

              <button
                onClick={handlePdf}
                className="bg-red-500 px-5 py-3 rounded-xl cursor-pointer hover:bg-red-600 text-white flex gap-2"
              >
                <FileText size={18} className="mt-1" />
                PDF
              </button>

              <button
                onClick={handleTeacherWise}
                className="bg-yellow-500 px-5 py-3 rounded-xl cursor-pointer hover:bg-yellow-600 text-white"
              >
                Teacher Wise
              </button>

              <button
                disabled={lockLoading || isLocked || !submission?.slug}
                onClick={lockMarks}
                className={`px-5 py-3 rounded-xl text-white flex gap-2 ${
                  lockLoading || isLocked || !submission?.slug
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700 cursor-pointer"
                }`}
              >
                {lockLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Lock size={18} />
                )}

                {isLocked
                  ? "Grades Locked"
                  : lockLoading
                    ? "Locking..."
                    : "Lock Marks"}
              </button>
            </div>
          </div>

          {/* table */}

          <div className="overflow-x-auto overflow-y-auto max-h-[650px] custom-scrollbar">
            <table className="w-full min-w-[1800px]">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-12 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        disabled={
                          isLocked || loading || !filteredStudents.length
                        }
                        onChange={toggleAll}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </div>
                  </th>

                  <th className="p-3 text-left text-gray-300">SN.</th>

                  <th className="p-3 text-left text-gray-300">Roll No.</th>

                  <th className="p-3 text-left text-gray-300">Section</th>

                  <th className="p-3 text-left text-gray-300 min-w-[180px]">
                    Student Name
                  </th>

                  {subjects.map((item) => (
                    <th
                      key={item.classSubjectSlug}
                      className="p-3 text-left text-gray-300 min-w-[150px] align-bottom"
                    >
                      <div>{item.subjectTitle}</div>

                      <div className="text-blue-400 mt-2 text-xs">
                        {item.subjectType}
                      </div>
                    </th>
                  ))}

                  <th className="p-3 text-center text-gray-300 min-w-[100px]">
                    Remark
                  </th>

                  <th className="p-3 text-center text-gray-300 min-w-[110px]">
                    Present Days
                  </th>

                  <th className="p-3 text-center text-gray-300 min-w-[110px]">
                    Total Days
                  </th>

                  <th className="p-3 text-center text-gray-300 min-w-[140px]">
                    Result
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columnCount} className="p-12 text-center">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <Loader2 size={24} className="animate-spin" />
                        Loading students...
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student.studentSlug}
                      className="border-t border-gray-800"
                    >
                      <td className="p-3 text-center align-middle">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(student.studentSlug)}
                            disabled={isLocked}
                            onChange={() => toggleOne(student.studentSlug)}
                            className="h-4 w-4 cursor-pointer"
                          />
                        </div>
                      </td>

                      <td className="p-3 text-gray-300">{index + 1}.</td>

                      <td className="p-3 text-gray-300">
                        {student.rollNumber ?? "-"}
                      </td>

                      <td className="p-3 text-gray-300">
                        {student.sectionTitle || "-"}
                      </td>

                      <td className="p-3 text-white">
                        {student.studentName || "-"}
                      </td>

                      {subjects.map((item) => (
                        <td
                          key={`${student.studentSlug}-${item.classSubjectSlug}`}
                          className="p-2 text-center"
                        >
                          <select
                            value={
                              student.subjectGrades?.[item.classSubjectSlug]
                                ?.grade || ""
                            }
                            disabled={isLocked}
                            onChange={(event) =>
                              handleGradeChange(
                                student.studentSlug,
                                item.classSubjectSlug,
                                event.target.value,
                              )
                            }
                            className={`w-[125px] bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-center ${
                              isLocked
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                            }`}
                          >
                            <option value="">Select Grade</option>

                            {GRADE_OPTIONS.map((grade) => (
                              <option key={grade.value} value={grade.value}>
                                {grade.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}

                      <td className="p-2 text-center">
                        {student.remark ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => openRemark(student, "view")}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              disabled={isLocked}
                              onClick={() => openRemark(student, "edit")}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={isLocked}
                            onClick={() => openRemark(student, "edit")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={student.presentDays ?? ""}
                          disabled={isLocked}
                          onChange={(event) =>
                            updatePresentDays(
                              student.studentSlug,
                              event.target.value,
                            )
                          }
                          className="w-20 bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-center disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={student.totalDays ?? ""}
                          disabled={isLocked}
                          onChange={(event) =>
                            updateTotalDays(
                              student.studentSlug,
                              event.target.value,
                            )
                          }
                          className="w-20 bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-center disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <select
                          value={student.result || "NOT_DECLARED"}
                          disabled={isLocked}
                          onChange={(event) =>
                            updateResult(
                              student.studentSlug,
                              event.target.value,
                            )
                          }
                          className="w-[125px] bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {RESULT_OPTIONS.map((result) => (
                            <option key={result.value} value={result.value}>
                              {result.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="p-12 text-center text-gray-400"
                    >
                      No students found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lock modal */}

      {showLockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[420px] shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500/20 p-4 rounded-full">
                <Lock size={40} className="text-yellow-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white text-center">
              Lock Marks?
            </h2>

            <p className="text-gray-400 text-center mt-3">
              Are you sure you want to lock marks? After locking, marks cannot
              be edited again.
            </p>

            <div className="flex gap-4 mt-8">
              <button
                disabled={lockLoading}
                onClick={() => setShowLockModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                disabled={lockLoading}
                onClick={confirmLockMarks}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {lockLoading && <Loader2 size={18} className="animate-spin" />}

                {lockLoading ? "Locking..." : "Yes, Lock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remark modal */}

      {remarkModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[450px]">
            <h2 className="text-xl font-semibold text-white mb-5">
              {viewMode ? "View Remark" : "Add Remark"}
            </h2>

            {viewMode ? (
              <div className="space-y-4">
                <p className="text-gray-300">Type : {remarkData.type || "-"}</p>

                <p className="text-gray-300">
                  Remark : {remarkData.remark || "-"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <select
                  value={remarkData.type}
                  onChange={(event) =>
                    setRemarkData((previous) => ({
                      ...previous,
                      type: event.target.value,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white"
                >
                  <option value="">Select Remark</option>

                  <option value="Excellent">Excellent</option>

                  <option value="Good">Good</option>

                  <option value="Need Improvement">Need Improvement</option>
                </select>

                <textarea
                  value={remarkData.remark}
                  onChange={(event) =>
                    setRemarkData((previous) => ({
                      ...previous,
                      remark: event.target.value,
                    }))
                  }
                  placeholder="Enter Remark"
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setRemarkModal(false);
                  setActiveStudentSlug(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg cursor-pointer"
              >
                Close
              </button>

              {!viewMode && (
                <button
                  onClick={saveRemark}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg cursor-pointer"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
