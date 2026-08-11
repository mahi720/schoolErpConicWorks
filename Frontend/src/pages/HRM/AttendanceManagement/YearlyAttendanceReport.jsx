import React, { useEffect, useMemo, useState } from "react";

import { ArrowLeft, CalendarDays, Loader2, Search } from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useEmployeeAttendanceStore } from "../../../store/hrm/attendance/employeeAttendanceStore";

import { useSessionStore } from "../../../store/master/session/sessionStore";

import { attendanceYearlyReportSchema } from "../../../validations/hrm/attendance/employeeAttendanceValidation";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const raw = String(value).slice(0, 10);

  const [year, month, day] = raw.split("-");

  if (!year || !month || !day) {
    return raw;
  }

  return `${day}-${month}-${year}`;
};

const getAverageClass = (average) => {
  const value = Number(average || 0);

  if (value >= 75) {
    return "bg-green-500/15 text-green-400";
  }

  if (value >= 50) {
    return "bg-yellow-500/15 text-yellow-400";
  }

  return "bg-red-500/15 text-red-400";
};

export default function YearlyAttendanceReport() {
  const navigate = useNavigate();

  const [sessionSlug, setSessionSlug] = useState("");

  const { yearlyReport, reportLoading, fetchYearlyReport, clearYearlyReport } =
    useEmployeeAttendanceStore();

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  useEffect(() => {
    fetchSessions();

    return () => {
      clearYearlyReport();
    };
  }, [fetchSessions, clearYearlyReport]);

  const report = yearlyReport;

  const employees = report?.employees || [];

  const selectedSession = useMemo(
    () => sessions.find((item) => item.slug === sessionSlug) || null,
    [sessions, sessionSlug],
  );

  const handleAcademicYearChange = (event) => {
    setSessionSlug(event.target.value);

    clearYearlyReport();
  };

  const handleSearch = async () => {
    const validation = attendanceYearlyReportSchema.safeParse({
      sessionSlug,
    });

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Please select academic year",
      );

      return;
    }

    await fetchYearlyReport(validation.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-white cursor-pointer"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Yearly Attendance Report
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Employee attendance report based on academic year
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={sessionSlug}
            onChange={handleAcademicYearChange}
            disabled={sessionLoading || reportLoading}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-w-[250px] outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
          >
            <option value="">Select Academic Year</option>

            {sessions.map((session) => (
              <option key={session.slug} value={session.slug}>
                {session.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSearch}
            disabled={reportLoading || sessionLoading || !sessionSlug}
            className="bg-green-600 hover:bg-green-700 px-7 py-3 rounded-lg text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reportLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}

            {reportLoading ? "Loading..." : "GO"}
          </button>
        </div>
      </div>

      {selectedSession && !report && !reportLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <CalendarDays size={20} className="text-indigo-400" />

          <div>
            <p className="text-white font-medium">{selectedSession.name}</p>

            <p className="text-gray-500 text-sm mt-1">
              Click GO to generate attendance report
            </p>
          </div>
        </div>
      )}

      {reportLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={34} className="animate-spin text-indigo-400" />

            <p className="text-gray-400">Generating attendance report...</p>
          </div>
        </div>
      )}

      {!reportLoading && report && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-sm">Academic Year</p>

              <h3 className="text-xl font-semibold text-white mt-2">
                {report.academicYear?.name || "-"}
              </h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-sm">Academic Date Range</p>

              <h3 className="text-white mt-2 whitespace-nowrap">
                {formatDate(report.academicYear?.startDate)}
                {" - "}
                {formatDate(report.academicYear?.endDate)}
              </h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-sm">Total Calendar Days</p>

              <h3 className="text-2xl font-bold text-cyan-400 mt-2">
                {report.totalCalendarDays ?? 0}
              </h3>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-sm">Total Sunday Days</p>

              <h3 className="text-2xl font-bold text-yellow-400 mt-2">
                {report.totalSundayDays ?? 0}
              </h3>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[650px]">
              <table className="w-full min-w-[1750px]">
                <thead className="bg-gray-800 sticky top-0 z-10">
                  <tr>
                    {[
                      "SNo.",
                      "Employee",
                      "Department",
                      "Designation",
                      "Calendar Days",
                      "Sunday Days",
                      "Holiday Days",
                      "Working Days",
                      "Leave",
                      "Applicable Days",
                      "Present",
                      "Absent",
                      "Not Marked",
                      "Average",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="p-4 text-left text-gray-300 whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={14}
                        className="p-14 text-center text-gray-500"
                      >
                        No attendance report found for selected academic year
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee, index) => (
                      <tr
                        key={employee.employeeSlug}
                        className="border-t border-gray-800 hover:bg-gray-800/40"
                      >
                        <td className="p-4 text-gray-300">{index + 1}.</td>

                        <td className="p-4 whitespace-nowrap">
                          <div>
                            <p className="text-white font-medium">
                              {employee.employeeName}
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                              {employee.employeeId ||
                                employee.employeeCode ||
                                "-"}
                            </p>
                          </div>
                        </td>

                        <td className="p-4 text-gray-300 whitespace-nowrap">
                          {employee.department}
                        </td>

                        <td className="p-4 text-gray-300 whitespace-nowrap">
                          {employee.designation}
                        </td>

                        <td className="p-4">
                          <span className="bg-gray-700/60 text-gray-300 px-3 py-1.5 rounded-lg text-sm">
                            {employee.totalCalendarDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.totalSundayDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.totalHolidayDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.totalWorkingDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.totalLeaveDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.attendanceApplicableDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-green-500/15 text-green-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.presentDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.absentDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="bg-gray-500/15 text-gray-400 px-3 py-1.5 rounded-lg text-sm">
                            {employee.notMarkedDays}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getAverageClass(
                              employee.average,
                            )}`}
                          >
                            {Number(employee.average || 0).toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm leading-relaxed">
              Working Days = Calendar Days - Sundays - applicable Holidays.
              Leave Days are excluded separately while calculating employee
              applicable attendance days. Average is calculated from Present
              Days against Applicable Days.
            </p>
          </div>
        </>
      )}

      {!sessionSlug && !reportLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-14 text-center">
          <CalendarDays size={38} className="text-gray-600 mx-auto" />

          <p className="text-gray-400 mt-4">Select Academic Year</p>

          <p className="text-gray-600 text-sm mt-2">
            Select an academic year and click GO to view employee attendance
            report.
          </p>
        </div>
      )}
    </div>
  );
}
