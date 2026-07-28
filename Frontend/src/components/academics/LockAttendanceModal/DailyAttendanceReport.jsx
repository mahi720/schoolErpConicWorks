import React, { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";

import { useStudentAttendanceReportStore } from "../../../store/academic/studentAttendance/studentAttendanceReportStore";

const getCurrentDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const [year, month, day] = date.split("-").map(Number);

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return parsedDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    })
    .replaceAll("/", "-");
};

const getDay = (date) => {
  if (!date) {
    return "-";
  }

  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
};

// const getWorkingDayValue = (item) => {
//   if (item?.totalWorkingDays !== undefined && item?.totalWorkingDays !== null) {
//     return Number(item.totalWorkingDays);
//   }

//   if (item?.workingDay !== undefined && item?.workingDay !== null) {
//     return Number(item.workingDay);
//   }

//   if (item?.isWorkingDay !== undefined && item?.isWorkingDay !== null) {
//     return item.isWorkingDay ? 1 : 0;
//   }

//   return 0;
// };

export default function DailyAttendanceReport() {
  const navigate = useNavigate();

  const [selectedSession, setSelectedSession] = useState("");

  const [selectedBoard, setSelectedBoard] = useState("");

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const { dailyReport, loading, fetchDailyReport, clearDailyReport } =
    useStudentAttendanceReportStore();

  useEffect(() => {
    fetchSessions();
    fetchBoards();

    return () => {
      clearDailyReport();
    };
  }, [fetchSessions, fetchBoards, clearDailyReport]);

  const filtersReady = Boolean(
    selectedSession && selectedBoard && selectedDate,
  );

  useEffect(() => {
    if (!filtersReady) {
      clearDailyReport();

      return;
    }

    fetchDailyReport({
      session: selectedSession,
      board: selectedBoard,
      attendanceDate: selectedDate,
    });
  }, [
    selectedSession,
    selectedBoard,
    selectedDate,
    filtersReady,
    fetchDailyReport,
    clearDailyReport,
  ]);

  /*
   * Backend mein report array ka naam rows/classes/data
   * kuch bhi ho, component handle kar lega.
   */
  const reportRows = useMemo(() => {
    if (Array.isArray(dailyReport?.rows)) {
      return dailyReport.rows;
    }

    if (Array.isArray(dailyReport?.classes)) {
      return dailyReport.classes;
    }

    if (Array.isArray(dailyReport?.report)) {
      return dailyReport.report;
    }

    if (Array.isArray(dailyReport?.data)) {
      return dailyReport.data;
    }

    return [];
  }, [dailyReport]);

  const calculatedSummary = useMemo(() => {
    return reportRows.reduce(
      (summary, item) => {
        summary.enrolled += Number(item?.enrolled ?? 0);

        summary.present += Number(item?.present ?? 0);

        summary.absent += Number(item?.absent ?? 0);

        summary.holiday += Number(item?.holiday ?? 0);

        summary.halfDay += Number(item?.halfDay ?? 0);

        return summary;
      },
      {
        enrolled: 0,
        present: 0,
        absent: 0,
        halfDay: 0,
        holiday: 0,
      },
    );
  }, [reportRows]);

  const backendSummary =
    dailyReport?.summary ||
    dailyReport?.classSummary ||
    dailyReport?.totals ||
    {};

  const backendTotals = dailyReport?.totals || {};

  const totalEnrolled = Number(
    backendTotals.enrolled ?? calculatedSummary.enrolled,
  );

  const totalPresent = Number(
    backendTotals.present ?? calculatedSummary.present,
  );

  const totalAbsent = Number(backendTotals.absent ?? calculatedSummary.absent);

  const totalHoliday = Number(
    backendTotals.holiday ?? calculatedSummary.holiday,
  );

  const reportDate =
    dailyReport?.attendanceDate || dailyReport?.date || selectedDate;

  const totalHalfDay = Number(
    backendTotals.halfDay ?? calculatedSummary.halfDay,
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Daily Attendance Report
          </h1>

          <p
            onClick={() => navigate("/academic/attendance")}
            className="text-indigo-400 mt-2 cursor-pointer"
          >
            Back to Attendance
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedSession}
            disabled={sessionLoading}
            onChange={(event) => setSelectedSession(event.target.value)}
            className="
              bg-gray-800
              border border-gray-700
              rounded-xl
              p-3
              text-white
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
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
            className="
              bg-gray-800
              border border-gray-700
              rounded-xl
              p-3
              text-white
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
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

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="
              bg-gray-800
              border border-gray-700
              rounded-xl
              p-3
              text-white
            "
          />

          <button
            type="button"
            className="
              px-5 py-3
              rounded-xl
              bg-green-500
              text-white
              flex gap-2
              cursor-pointer
              hover:bg-green-600
            "
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button
            type="button"
            className="
              px-5 py-3
              rounded-xl
              bg-red-500
              text-white
              flex gap-2
              cursor-pointer
              hover:bg-red-600
            "
          >
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Report table */}

      <div
        className="
          bg-gray-900
          border border-gray-800
          rounded-xl
          p-6
        "
      >
        <div className="max-h-[70vh] overflow-x-auto overflow-y-auto custom-scrollbar">
          <table
            className="
              w-full
              min-w-[900px]
              border-collapse
              text-center
              text-white
            "
          >
            <tbody>
              {/* First row */}

              <tr>
                <th className="border border-gray-700 p-3">Date</th>

                <th colSpan="5" className="border border-gray-700 p-3">
                  {formatDate(reportDate)}
                </th>

                <th className="border border-gray-700 p-3">Day</th>

                <th className="border border-gray-700 p-3">
                  {getDay(reportDate)}
                </th>
              </tr>

              {/* Heading */}

              <tr className="bg-gray-800">
                {[
                  "Class",
                  "Section",
                  "Stream",
                  "Total Students",
                  "Present",
                  "Absent",
                  "Half Day",
                  "Holiday",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border border-gray-700 p-3 whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>

              {/* Loading */}

              {loading ? (
                <tr>
                  <td colSpan={7} className="border border-gray-700 py-16">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400" />

                    <p className="mt-3 text-gray-400">
                      Loading daily attendance report...
                    </p>
                  </td>
                </tr>
              ) : !filtersReady ? (
                <tr>
                  <td
                    colSpan={26}
                    className="border border-gray-700 py-20 text-gray-400"
                  >
                    Select academic year, board and date.
                  </td>
                </tr>
              ) : !reportRows.length ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-700 py-16 text-gray-400"
                  >
                    No daily attendance report found.
                  </td>
                </tr>
              ) : (
                reportRows.map((item, index) => (
                  <tr
                    key={
                      item.mappingSlug ||
                      item.academicMappingSlug ||
                      item.classSlug ||
                      `${item.className}-${item.section}-${item.stream}-${index}`
                    }
                  >
                    <td className="border border-gray-700 p-3">
                      {item.class?.classTitle ||
                        item.classTitle ||
                        item.className ||
                        "-"}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {item.section?.sectionTitle ||
                        item.sectionTitle ||
                        item.section ||
                        "-"}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {item.stream?.streamTitle ||
                        item.streamTitle ||
                        item.stream ||
                        "N/A"}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {Number(item?.enrolled ?? 0)}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {Number(item.totalPresent ?? item.present ?? 0)}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {Number(item.totalAbsent ?? item.absent ?? 0)}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {Number(item?.halfDay ?? 0)}
                    </td>

                    <td className="border border-gray-700 p-3">
                      {Number(item.totalHoliday ?? item.holiday ?? 0)}
                    </td>
                  </tr>
                ))
              )}

              {/* Total */}

              {!loading && filtersReady && reportRows.length > 0 && (
                <tr className="font-bold">
                  <td colSpan="3" className="border border-gray-700 p-3">
                    Total
                  </td>

                  <td className="border border-gray-700 p-3">
                    {totalEnrolled}
                  </td>

                  <td className="border border-gray-700 p-3">{totalPresent}</td>

                  <td className="border border-gray-700 p-3">{totalAbsent}</td>

                  <td className="border border-gray-700 p-3">{totalHalfDay}</td>

                  <td className="border border-gray-700 p-3">{totalHoliday}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
