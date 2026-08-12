import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  FileText,
  Loader2,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useEmployeeAttendanceStore } from "../../../store/hrm/attendance/employeeAttendanceStore";

const months = [
  {
    value: "1",
    label: "January",
  },
  {
    value: "2",
    label: "February",
  },
  {
    value: "3",
    label: "March",
  },
  {
    value: "4",
    label: "April",
  },
  {
    value: "5",
    label: "May",
  },
  {
    value: "6",
    label: "June",
  },
  {
    value: "7",
    label: "July",
  },
  {
    value: "8",
    label: "August",
  },
  {
    value: "9",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

export default function ReconciliationSheet() {
  const navigate = useNavigate();

  const today = new Date();

  const currentYear = today.getFullYear();

  const currentMonth = String(today.getMonth() + 1);

  const [month, setMonth] = useState(currentMonth);

  const [year, setYear] = useState(String(currentYear));

  const [search, setSearch] = useState("");

  const {
    monthlyReport,
    monthlyReportLoading,
    fetchMonthlyReport,
    clearMonthlyReport,
  } = useEmployeeAttendanceStore();

  const years = useMemo(
    () =>
      Array.from(
        {
          length: 7,
        },
        (_, index) => String(currentYear - 3 + index),
      ),
    [currentYear],
  );

  const selectedMonth = useMemo(
    () => months.find((item) => item.value === month) || null,
    [month],
  );

  const employees = monthlyReport?.employees || [];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return employees;
    }

    return employees.filter((item) => {
      const employeeName = String(item.employeeName || "").toLowerCase();

      const employeeId = String(
        item.employeeId || item.employeeCode || "",
      ).toLowerCase();

      const department = String(item.department || "").toLowerCase();

      const designation = String(item.designation || "").toLowerCase();

      return (
        employeeName.includes(keyword) ||
        employeeId.includes(keyword) ||
        department.includes(keyword) ||
        designation.includes(keyword)
      );
    });
  }, [employees, search]);

  const loadMonthlyReport = async (
    selectedYear = year,
    selectedMonthValue = month,
  ) => {
    await fetchMonthlyReport({
      year: Number(selectedYear),

      month: Number(selectedMonthValue),
    });
  };

  useEffect(() => {
    loadMonthlyReport(String(currentYear), currentMonth);

    return () => {
      clearMonthlyReport();
    };
  }, []);

  const handleGo = async () => {
    await loadMonthlyReport();
  };

  const handlePdf = () => {
    console.log("Download PDF", {
      month,
      year,
    });
  };

  const handleAttendanceSheet = () => {
    console.log("Attendance Sheet", {
      month,
      year,
    });
  };

  const handleNoPunchReport = () => {
    navigate("/hrm/attendance-management/no-punch-report", {
      state: {
        year: Number(year),

        month: Number(month),
      },
    });
  };

  const handleReport = (employee) => {
    navigate("/hrm/attendance-management/reconciliation-report-sheet", {
      state: {
        employeeSlug: employee.employeeSlug,

        employee,

        year: Number(year),

        month: Number(month),
      },
    });
  };

  const selectClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-11 h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-white cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-white">
                Reconciliation Sheet
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View employee monthly attendance reconciliation details
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="w-28">
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                disabled={monthlyReportLoading}
                className={selectClass}
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-40">
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                disabled={monthlyReportLoading}
                className={selectClass}
              >
                {months.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleGo}
              disabled={monthlyReportLoading}
              className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {monthlyReportLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
            </button>

            <button
              type="button"
              onClick={handlePdf}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <FileText size={16} />
              PDF
            </button>

            <button
              type="button"
              onClick={handleAttendanceSheet}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <ClipboardList size={16} />
              Attendance Sheet
            </button>

            <button
              type="button"
              onClick={handleNoPunchReport}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <ClipboardList size={16} />
              No Punch Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">
                Employee Attendance Summary
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {monthlyReport?.monthName || selectedMonth?.label}{" "}
                {monthlyReport?.year || year}
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-310px)] custom-scrollbar">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Department
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Designation
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Total Days
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Total Working Days
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Days Present
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Early Punch
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Late Punch
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 w-24">
                  Report
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {monthlyReportLoading ? (
                <tr>
                  <td colSpan={9} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />

                      <p className="text-gray-500 text-sm">
                        Loading monthly report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-14 text-center text-gray-500"
                  >
                    No reconciliation records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.employeeSlug}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}.
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-medium">
                        {item.employeeName}
                      </p>

                      {(item.employeeId || item.employeeCode) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.employeeId || item.employeeCode}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.department}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.designation}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.totalDays ?? 0}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.totalWorkingDays ?? 0}
                    </td>

                    <td className="px-4 py-3 text-sm text-center">
                      <span className="inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400">
                        {item.presentDays ?? 0}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-medium ${
                          Number(item.earlyPunch || 0) > 0
                            ? "bg-amber-500/10 text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        {item.earlyPunch ?? 0}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-medium ${
                          Number(item.latePunch || 0) > 0
                            ? "bg-red-500/10 text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {item.latePunch ?? 0}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleReport(item)}
                          title="View Report"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 cursor-pointer transition-colors"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            Total Employees:{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>
          </p>

          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300">
              {monthlyReport?.monthName || selectedMonth?.label}{" "}
              {monthlyReport?.year || year}
            </span>{" "}
            reconciliation
          </p>
        </div>
      </div>
    </div>
  );
}
