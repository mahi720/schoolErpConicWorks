import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DayWiseReportModal from "./DayWiseReportModal";

import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";
import { useClassStore } from "../../../store/master/class/classStore";

import { useStudentAttendanceReportStore } from "../../../store/academic/studentAttendance/studentAttendanceReportStore";

const getCurrentMonthValue = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getRollNumber = (student) => {
  if (student?.rollNumber === null || student?.rollNumber === undefined) {
    return "-";
  }

  return `${student.rollNumberPrefix || ""}${student.rollNumber}`;
};

export default function AttendanceReport() {
  const navigate = useNavigate();

  const [selectedSession, setSelectedSession] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  const [selectedGender, setSelectedGender] = useState("");
  const [selectedStreamSlug, setSelectedStreamSlug] = useState("");
  const [selectedSectionSlug, setSelectedSectionSlug] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const { classes, loading: classLoading, fetchClasses } = useClassStore();

  const {
    monthlyReport,
    studentDayWiseReport,

    loading,
    modalLoading,

    fetchMonthlyReport,
    fetchStudentDayWiseReport,

    clearMonthlyReport,
    clearStudentDayWiseReport,
  } = useStudentAttendanceReportStore();

  useEffect(() => {
    fetchSessions();
    fetchBoards();

    return () => {
      clearMonthlyReport();
      clearStudentDayWiseReport();
    };
  }, [
    fetchSessions,
    fetchBoards,
    clearMonthlyReport,
    clearStudentDayWiseReport,
  ]);

  useEffect(() => {
    setSelectedClass("");
    setSelectedSectionSlug("");
    setSelectedStreamSlug("");

    clearMonthlyReport();

    if (!selectedSession || !selectedBoard) {
      return;
    }

    fetchClasses({
      session: selectedSession,
      board: selectedBoard,
    });
  }, [selectedSession, selectedBoard, fetchClasses, clearMonthlyReport]);

  useEffect(() => {
    setSelectedSectionSlug("");
    setSelectedStreamSlug("");

    clearMonthlyReport();
  }, [selectedClass, clearMonthlyReport]);

  const students = monthlyReport?.students || [];

  /*
   * Student report response se hi unique section aur stream
   * dropdown options ban rahe hain.
   */
  const sectionOptions = useMemo(() => {
    const sectionMap = new Map();

    students.forEach((student) => {
      const section = student.section;

      if (!section?.slug) {
        return;
      }

      sectionMap.set(section.slug, section);
    });

    return Array.from(sectionMap.values());
  }, [students]);

  const streamOptions = useMemo(() => {
    const streamMap = new Map();

    students.forEach((student) => {
      const stream = student.stream;

      if (!stream?.slug) {
        return;
      }

      streamMap.set(stream.slug, stream);
    });

    return Array.from(streamMap.values());
  }, [students]);

  const reportFiltersReady = Boolean(
    selectedSession && selectedBoard && selectedClass && selectedMonth,
  );

  const loadMonthlyReport = async () => {
    if (!reportFiltersReady) {
      clearMonthlyReport();

      return false;
    }

    const [year, month] = selectedMonth.split("-");

    return fetchMonthlyReport({
      session: selectedSession,
      board: selectedBoard,
      classTitle: selectedClass,

      year: Number(year),
      month: Number(month),

      gender: selectedGender || undefined,
      sectionSlug: selectedSectionSlug || undefined,
      streamSlug: selectedStreamSlug || undefined,
    });
  };

  /*
   * Class/month select hone ke baad report load hogi.
   *
   * Gender, section aur stream backend filters hain,
   * isliye select change par report dobara fetch hogi.
   */
  useEffect(() => {
    if (!reportFiltersReady) {
      return;
    }

    loadMonthlyReport();
  }, [
    selectedSession,
    selectedBoard,
    selectedClass,
    selectedMonth,
    selectedGender,
    selectedSectionSlug,
    selectedStreamSlug,
  ]);

  const handleOpenStudentReport = async (student) => {
    if (!student?.academicMappingSlug) {
      return;
    }

    const [year, month] = selectedMonth.split("-");

    setSelectedStudent(student);
    setOpen(true);

    await fetchStudentDayWiseReport(student.academicMappingSlug, {
      year: Number(year),
      month: Number(month),
    });
  };

  const handleCloseStudentReport = () => {
    if (modalLoading) {
      return;
    }

    setOpen(false);
    setSelectedStudent(null);

    clearStudentDayWiseReport();
  };

  const classSummary = monthlyReport?.classSummary || {
    totalStudents: 0,
    totalAttendance: 0,
    totalPresent: 0,
    attendancePercentage: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl text-white font-bold">Attendance Reports</h1>

          <p
            onClick={() => navigate("/academic/attendance")}
            className="text-indigo-400 mt-2 cursor-pointer"
          >
            Back to Attendance
          </p>
        </div>

        <div className="bg-gray-900 p-3 rounded-2xl border border-gray-800 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <select
            value={selectedSession}
            disabled={sessionLoading}
            onChange={(event) => setSelectedSession(event.target.value)}
            className="input cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {sessionLoading ? "Loading..." : "Select Acad. Year"}
            </option>

            {sessions.map((session) => (
              <option key={session.slug} value={session.name}>
                {session.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBoard}
            disabled={boardLoading}
            onChange={(event) => setSelectedBoard(event.target.value)}
            className="input cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {boardLoading ? "Loading..." : "Select Board"}
            </option>

            {boards.map((board) => (
              <option key={board.slug} value={board.title}>
                {board.title}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            disabled={!selectedSession || !selectedBoard || classLoading}
            onChange={(event) => setSelectedClass(event.target.value)}
            className="input cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {classLoading ? "Loading..." : "Select Class"}
            </option>

            {classes.map((classItem) => (
              <option key={classItem.slug} value={classItem.classTitle}>
                {classItem.classTitle}
              </option>
            ))}
          </select>

          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="input cursor-pointer"
          />
        </div>
      </div>

      {selectedClass && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={selectedGender}
              onChange={(event) => setSelectedGender(event.target.value)}
              className="input cursor-pointer"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={selectedStreamSlug}
              onChange={(event) => setSelectedStreamSlug(event.target.value)}
              className="input cursor-pointer"
            >
              <option value="">All Streams</option>

              {streamOptions.map((stream) => (
                <option key={stream.slug} value={stream.slug}>
                  {stream.streamTitle?.trim() || "N/A"}
                </option>
              ))}
            </select>

            <select
              value={selectedSectionSlug}
              onChange={(event) => setSelectedSectionSlug(event.target.value)}
              className="input cursor-pointer"
            >
              <option value="">All Sections</option>

              {sectionOptions.map((section) => (
                <option key={section.slug} value={section.slug}>
                  {section.sectionTitle?.trim() || "-"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl cursor-pointer text-white flex items-center gap-2"
            >
              <FileSpreadsheet size={18} />
              Excel
            </button>

            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl cursor-pointer text-white flex items-center gap-2"
            >
              <FileText size={18} />
              PDF
            </button>
          </div>
        </div>
      )}

      {monthlyReport && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400">Total Students</p>

            <p className="mt-2 text-2xl text-white font-bold">
              {classSummary.totalStudents || 0}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400">Total Attendance</p>

            <p className="mt-2 text-2xl text-indigo-400 font-bold">
              {classSummary.totalAttendance || 0}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400">Total Present</p>

            <p className="mt-2 text-2xl text-green-400 font-bold">
              {classSummary.totalPresent || 0}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400">Avg. Attendance</p>

            <p className="mt-2 text-2xl text-amber-400 font-bold">
              {Number(classSummary.attendancePercentage || 0).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="max-h-[65vh] overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[1350px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {[
                  "SN.",
                  "Roll",
                  "Name",
                  "Stream",
                  "Section",
                  "Holidays",
                  "Sunday",
                  "Total Attendance",
                  "Total Present",
                  "Total Leave",
                  "Avg. Attendance",
                  "Report",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="p-4 text-gray-300 text-center whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={26} className="py-6 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400" />

                    <p className="mt-3 text-gray-400">
                      Loading attendance report...
                    </p>
                  </td>
                </tr>
              ) : !reportFiltersReady ? (
                <tr>
                  <td colSpan={20} className="py-6 text-center text-gray-400">
                    Select academic year, board, class and month.
                  </td>
                </tr>
              ) : !students.length ? (
                <tr>
                  <td colSpan={25} className="py-6 text-center text-gray-400">
                    No attendance report found.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr
                    key={student.academicMappingSlug}
                    className="border-t border-gray-800 text-center hover:bg-gray-800/40"
                  >
                    <td className="p-4 text-gray-300">{index + 1}.</td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {getRollNumber(student)}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {student.student?.studentName || "-"}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {student.stream?.streamTitle || "N/A"}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {student.section?.sectionTitle || "-"}
                    </td>

                    <td className="p-4 text-gray-300">
                      {student.totalHoliday || 0}
                    </td>

                    <td className="p-4 text-gray-300">
                      {student.totalSunday || 0}
                    </td>

                    <td className="p-4 text-gray-300">
                      {student.totalAttendance || 0}
                    </td>

                    <td className="p-4 text-green-400">
                      {student.totalPresent || 0}
                    </td>

                    <td className="p-4 text-gray-300">
                      {student.totalLeave || 0}
                    </td>

                    <td className="p-4 text-green-400 whitespace-nowrap">
                      {Number(student.attendancePercentage || 0).toFixed(2)}%
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleOpenStudentReport(student)}
                        className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700"
                      >
                        <CalendarDays size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DayWiseReportModal
        open={open}
        close={handleCloseStudentReport}
        loading={modalLoading}
        selectedStudent={selectedStudent}
        report={studentDayWiseReport}
      />
    </div>
  );
}
