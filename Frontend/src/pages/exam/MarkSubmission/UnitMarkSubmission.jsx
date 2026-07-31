import React, { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";

import { usePeriodicTestMarkSubmissionStore } from "../../../store/examManager/markSubmission/periodicTestMarkSubmission/periodicTestMarkSubmissionStore";

import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";
import { useClassStore } from "../../../store/master/class/classStore";
import { useClassSubjectStore } from "../../../store/master/addSubjectToClass/classSubjectStore";
import { useClassMappingStore } from "../../../store/master/classMapping/classMappingStore";
import { usePeriodicTestStore } from "../../../store/examManager/periodicTestTimeTable/periodicTestTimeTableStore";

import {
  validatePeriodicTestMarkFilters,
  validatePeriodicTestMarks,
} from "../../../validations/examManager/markSubmission/periodicTestMarkSubmission/periodicTestMarkSubmissionValidation";

export default function UnitMarkSubmission() {
  const [selected, setSelected] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);

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
    resetDependentFilters,
    setStudentSelected,
    toggleAllStudents,
    updateStudentMark,

    fetchStudents,
    saveMarks,
    lockMarks,
  } = usePeriodicTestMarkSubmissionStore();

  const {
    sessions = [],
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { boards = [], loading: boardLoading, fetchBoards } = useBoardStore();

  const { classes = [], loading: classLoading, fetchClasses } = useClassStore();

  const {
    classSubjects = [],
    loading: subjectLoading,
    fetchClassSubjects,
  } = useClassSubjectStore();

  const {
    mappings = [],
    loading: mappingLoading,
    fetchMappings,
  } = useClassMappingStore();

  const {
    periodicTests = [],
    loading: periodicTestLoading,
    fetchPeriodicTests,
  } = usePeriodicTestStore();

  const isLocked = Boolean(submission?.isLocked);

  const selectedClass = filters.classTitle;

  const maxMarks = Number(configuration?.maxMarks || submission?.maxMarks || 0);

  const minMarks = Number(configuration?.minMarks || submission?.minMarks || 0);

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

  const activePeriodicTests = useMemo(() => {
    return periodicTests.filter((item) => {
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
  }, [periodicTests, filters.academicYear, filters.board]);

  const activeClasses = useMemo(() => {
    return classes.filter(
      (item) => item.isActive !== false && item.status !== "inactive",
    );
  }, [classes]);

  const subjectOptions = useMemo(() => {
    const uniqueSubjects = new Map();

    classSubjects.forEach((item) => {
      const subjectTitle =
        item.subjectTitle || item.subject?.subjectTitle || item.subject || "";

      if (!subjectTitle) {
        return;
      }

      const studyMode = item.studyType || item.studyMode || "";

      const streamSlug = item.streamSlug || item.stream?.slug || "";

      const streamTitle = item.streamTitle || item.stream?.streamTitle || "";

      const key = `${subjectTitle}-${studyMode}-${streamSlug}`;

      if (!uniqueSubjects.has(key)) {
        uniqueSubjects.set(key, {
          slug: item.slug,
          subjectTitle,
          studyMode,
          streamSlug,
          streamTitle,
          label: streamTitle
            ? `${subjectTitle} (${formatStudyMode(studyMode)} - ${streamTitle})`
            : `${subjectTitle} (${formatStudyMode(studyMode)})`,
        });
      }
    });

    return Array.from(uniqueSubjects.values());
  }, [classSubjects]);

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
    const uniqueSections = new Map();

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

        if (!uniqueSections.has(key)) {
          uniqueSections.set(key, {
            slug,
            title,
          });
        }
      });
    });

    return Array.from(uniqueSections.values());
  }, [selectedClassMappings]);

  const streamOptions = useMemo(() => {
    const uniqueStreams = new Map();

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

        if (!uniqueStreams.has(key)) {
          uniqueStreams.set(key, {
            slug,
            title,
          });
        }
      });
    });

    return Array.from(uniqueStreams.values());
  }, [selectedClassMappings]);

  useEffect(() => {
    fetchSessions();
    fetchBoards();
  }, [fetchSessions, fetchBoards]);

  useEffect(() => {
    if (!filters.academicYear || !filters.board) {
      return;
    }

    fetchPeriodicTests({
      academicYear: filters.academicYear,
      board: filters.board,
    });

    fetchClasses({
      session: filters.academicYear,
      board: filters.board,
    });
  }, [filters.academicYear, filters.board, fetchPeriodicTests, fetchClasses]);

  useEffect(() => {
    if (!filters.academicYear || !filters.board || !filters.classTitle) {
      return;
    }

    fetchClassSubjects({
      session: filters.academicYear,
      board: filters.board,
      classTitle: filters.classTitle,
    });

    fetchMappings({
      session: filters.academicYear,
      board: filters.board,
      classTitle: filters.classTitle,
    });
  }, [
    filters.academicYear,
    filters.board,
    filters.classTitle,
    fetchClassSubjects,
    fetchMappings,
  ]);

  useEffect(() => {
    setSelected([]);
  }, [
    filters.academicYear,
    filters.board,
    filters.periodicTestTitle,
    filters.classTitle,
    filters.subjectTitle,
    filters.studyMode,
    filters.section,
  ]);

  useEffect(() => {
    if (
      !filters.academicYear ||
      !filters.board ||
      !filters.periodicTestTitle ||
      !filters.classTitle ||
      !filters.classSubjectSlug ||
      !filters.subjectTitle ||
      !filters.studyMode
    ) {
      return;
    }

    handleLoadStudents();
  }, [
    filters.academicYear,
    filters.board,
    filters.periodicTestTitle,
    filters.classTitle,
    filters.classSubjectSlug,
    filters.subjectTitle,
    filters.studyMode,
    // filters.section,
    filters.stream,
  ]);

  const handleAcademicYearChange = (value) => {
    setFilter("academicYear", value);

    resetDependentFilters([
      "board",
      "periodicTestTitle",
      "classTitle",
      "classSubjectSlug",
      "subjectTitle",
      "studyMode",
      "section",
      "stream",
    ]);

    setSelected([]);
  };

  const handleBoardChange = (value) => {
    setFilter("board", value);

    resetDependentFilters([
      "periodicTestTitle",
      "classTitle",
      "classSubjectSlug",
      "subjectTitle",
      "studyMode",
      "section",
      "stream",
    ]);

    setSelected([]);
  };

  const handlePeriodicTestChange = (value) => {
    setFilter("periodicTestTitle", value);

    resetDependentFilters([
      "classTitle",
      "classSubjectSlug",
      "subjectTitle",
      "studyMode",
      "section",
      "stream",
    ]);

    setSelected([]);
  };

  const handleClassChange = (value) => {
    setFilter("classTitle", value);

    resetDependentFilters([
      "classSubjectSlug",
      "subjectTitle",
      "studyMode",
      "section",
      "stream",
    ]);

    setSelected([]);
  };

  const handleSubjectChange = (classSubjectSlug) => {
    const selectedSubject = subjectOptions.find(
      (item) => item.slug === classSubjectSlug,
    );

    resetDependentFilters(["section", "stream"]);

    setFilters({
      classSubjectSlug: selectedSubject?.slug || "",
      subjectTitle: selectedSubject?.subjectTitle || "",
      studyMode: selectedSubject?.studyMode || "",
    });

    setSelected([]);
  };

  const handleSectionChange = (value) => {
    const selectedSection = sectionOptions.find(
      (item) => item.slug === value || item.title === value,
    );

    setFilter("section", selectedSection?.title || "");

    setSelected([]);
  };

  const handleStreamChange = (value) => {
    const selectedStream = streamOptions.find(
      (item) => item.slug === value || item.title === value,
    );

    resetDependentFilters([]);

    setFilter("stream", selectedStream?.title || "");

    setSelected([]);
  };

  const handleLoadStudents = async () => {
    const validation = validatePeriodicTestMarkFilters(filters);

    if (!validation.success) {
      return false;
    }

    const success = await fetchStudents();

    if (!success) {
      return false;
    }

    setSelected([]);

    return true;
  };

  const toggleAll = (event) => {
    const checked = event.target.checked;

    const visibleStudentSlugs = filteredStudents.map(
      (student) => student.studentSlug,
    );

    if (checked) {
      setSelected((previous) => [
        ...new Set([...previous, ...visibleStudentSlugs]),
      ]);

      visibleStudentSlugs.forEach((studentSlug) => {
        setStudentSelected(studentSlug, true);
      });

      return;
    }

    setSelected((previous) =>
      previous.filter((slug) => !visibleStudentSlugs.includes(slug)),
    );

    visibleStudentSlugs.forEach((studentSlug) => {
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

  const handleMarksChange = (studentSlug, value) => {
    if (value === "") {
      updateStudentMark(studentSlug, "obtainedMarks", "");

      return;
    }

    const marks = Number(value);

    if (Number.isNaN(marks)) {
      return;
    }

    if (marks < 0) {
      return;
    }

    if (maxMarks && marks > maxMarks) {
      toast.error(`Marks cannot exceed ${maxMarks}`);

      return;
    }

    updateStudentMark(studentSlug, "obtainedMarks", value);
  };

  const saveResult = async () => {
    if (isLocked) {
      toast.error("Marks are locked and cannot be edited");

      return;
    }

    if (!selected.length) {
      toast.error("Select at least one student");

      return;
    }

    const selectedStudents = students.filter((student) =>
      selected.includes(student.studentSlug),
    );

    const studentsForValidation = selectedStudents.map((student) => ({
      ...student,
      studentName: student.studentName,
      markStatus: student.markStatus || "PRESENT",
    }));

    const validation = validatePeriodicTestMarks({
      filters,
      students: studentsForValidation,
      maxMarks,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);

      return;
    }

    const studentsPayload = selectedStudents.map((student) => ({
      studentSlug: student.studentSlug,
      academicMappingSlug: student.academicMappingSlug,
      obtainedMarks:
        student.markStatus === "PRESENT" ? Number(student.obtainedMarks) : null,
      markStatus: student.markStatus || "PRESENT",
      remarks: student.remarks?.trim() || null,
    }));

    const payload = {
      academicYear: filters.academicYear,
      board: filters.board,
      periodicTestTitle: filters.periodicTestTitle,
      classTitle: filters.classTitle,
      classSubjectSlug: filters.classSubjectSlug,
      subjectTitle: filters.subjectTitle,
      studyMode: filters.studyMode || undefined,
      section: filters.section || null,
      stream: filters.stream || null,
      students: studentsPayload,
    };

    const success = await saveMarks(payload);

    if (!success) {
      return;
    }

    setSelected([]);

    await fetchStudents();
  };

  const handleLockMarks = () => {
    if (!submission?.slug) {
      toast.error("Save marks before locking");

      return;
    }

    if (isLocked) {
      toast.error("Marks are already locked");

      return;
    }

    setShowLockModal(true);
  };

  const confirmLockMarks = async () => {
    if (!submission?.slug) {
      toast.error("Mark submission not found");

      return;
    }

    const success = await lockMarks(submission.slug);

    if (!success) {
      return;
    }

    setShowLockModal(false);
    setSelected([]);
  };

  const handlePdf = () => {
    if (!submission?.slug) {
      toast.error("Save marks before generating PDF");

      return;
    }

    toast.error("PDF generation API is not connected yet");
  };

  const handleTeacherWise = () => {
    toast.error("Teacher-wise view is not connected yet");
  };

  const selectedSubjectValue = filters.classSubjectSlug || "";

  const selectedSectionValue =
    sectionOptions.find((item) => item.title === filters.section)?.slug || "";

  const selectedStreamValue =
    streamOptions.find((item) => item.title === filters.stream)?.slug || "";

  const filteredStudents = useMemo(() => {
    if (!filters.section) {
      return students;
    }

    return students.filter((student) => {
      const studentSection =
        student.sectionTitle ||
        student.section ||
        student.academicMapping?.sectionTitle ||
        student.academicMapping?.section?.sectionTitle ||
        "";

      return studentSection === filters.section;
    });
  }, [students, filters.section]);

  const allStudentsSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selected.includes(student.studentSlug));

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          Periodic / Unit Test Mark Submission
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
            value={filters.periodicTestTitle}
            onChange={(event) => handlePeriodicTestChange(event.target.value)}
            disabled={
              !filters.academicYear || !filters.board || periodicTestLoading
            }
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-44 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {periodicTestLoading ? "Loading..." : "Select Exam"}
            </option>

            {activePeriodicTests.map((test) => (
              <option key={test.slug} value={test.testTitle}>
                {test.testTitle}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(event) => handleClassChange(event.target.value)}
            disabled={
              !filters.academicYear ||
              !filters.board ||
              !filters.periodicTestTitle ||
              classLoading
            }
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {classLoading ? "Loading..." : "Select Class"}
            </option>

            {activeClasses.map((classItem) => (
              <option key={classItem.slug} value={classItem.classTitle}>
                {classItem.classTitle}
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
                  value={selectedSubjectValue}
                  onChange={(event) => handleSubjectChange(event.target.value)}
                  disabled={subjectLoading}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {subjectLoading ? "Loading..." : "Select Subject"}
                  </option>

                  {subjectOptions.map((subject) => (
                    <option
                      key={`${subject.slug}-${subject.studyMode}`}
                      value={subject.slug}
                    >
                      {subject.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStreamValue}
                  onChange={(event) => handleStreamChange(event.target.value)}
                  disabled={
                    mappingLoading ||
                    !filters.classTitle ||
                    !streamOptions.length
                  }
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-48 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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

                <select
                  value={selectedSectionValue}
                  onChange={(event) => handleSectionChange(event.target.value)}
                  disabled={
                    mappingLoading ||
                    !filters.classTitle ||
                    !sectionOptions.length
                  }
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {mappingLoading ? "Loading..." : "Select Section"}
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
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={
                  isLocked ||
                  submitLoading ||
                  loading ||
                  !filteredStudents.length
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
                onClick={handleLockMarks}
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
                  ? "Marks Locked"
                  : lockLoading
                    ? "Locking..."
                    : "Lock Marks"}
              </button>
            </div>
          </div>

          {/* table */}

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
            <table className="w-full min-w-[900px] table-fixed">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-16 text-center">
                    <input
                      type="checkbox"
                      checked={allStudentsSelected}
                      disabled={isLocked || loading || !filteredStudents.length}
                      onChange={toggleAll}
                    />
                  </th>

                  <th className="p-4 text-left text-gray-300">SN.</th>

                  <th className="p-4 text-left text-gray-300">Roll No</th>

                  <th className="p-4 text-left text-gray-300">Section</th>

                  <th className="p-4 text-left text-gray-300">Student Name</th>

                  <th className="p-4 text-center text-gray-300">
                    Marks{" "}
                    {configuration && (
                      <div className="flex justify-end gap-5 text-sm text-gray-400">
                        <span>
                          Max Marks:{" "}
                          <span className="font-semibold text-white">
                            {maxMarks}
                          </span>
                        </span>

                        <span>
                          Min Marks:{" "}
                          <span className="font-semibold text-white">
                            {minMarks}
                          </span>
                        </span>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
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
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(student.studentSlug)}
                          disabled={isLocked}
                          onChange={() => toggleOne(student.studentSlug)}
                        />
                      </td>

                      <td className="p-4 text-gray-300">{index + 1}.</td>

                      <td className="p-4 text-gray-300">
                        {student.rollNumber ?? student.rollNo ?? "-"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {student.sectionTitle || student.section || "-"}
                      </td>

                      <td className="p-4 text-white">
                        {student.studentName || "-"}
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks || undefined}
                          step="0.01"
                          value={student.obtainedMarks ?? ""}
                          disabled={isLocked}
                          onChange={(event) =>
                            handleMarksChange(
                              student.studentSlug,
                              event.target.value,
                            )
                          }
                          className={`border rounded-lg px-4 py-2 text-white w-28 text-center ${
                            isLocked
                              ? "bg-gray-700 border-gray-700 cursor-not-allowed"
                              : "bg-gray-800 border-gray-700"
                          }`}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      {filters.subjectTitle
                        ? "No students found for the selected filters."
                        : "Select subject to load students."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* modal */}

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
    </div>
  );
}

const formatStudyMode = (value) => {
  if (!value) {
    return "Theory";
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};
