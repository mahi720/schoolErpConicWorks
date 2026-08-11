import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReconciliationSheet() {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("Select Month");
  const [year, setYear] = useState(String(currentYear));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const months = [
    "Select Month",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 7 }, (_, index) =>
    String(currentYear - 3 + index),
  );

  const reconciliationData = [
    {
      id: 1,
      employee: "DEVENDRA SINGH",
      department: "TEACHING",
      designation: "PRINCIPAL",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 2,
      employee: "SUNITA K",
      department: "TEACHING",
      designation: "PGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 3,
      employee: "SAVAREENA ILANGO",
      department: "TEACHING",
      designation: "PGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 4,
      employee: "RICHA KAUL",
      department: "TEACHING",
      designation: "PGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 5,
      employee: "KAJARI HAZRA",
      department: "TEACHING",
      designation: "PGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 6,
      employee: "SOWMINI RAMESH",
      department: "TEACHING",
      designation: "PGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 1,
      latePunch: 0,
    },
    {
      id: 7,
      employee: "SUDHA KUMARI",
      department: "TEACHING",
      designation: "PGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 8,
      employee: "PAMILA J S",
      department: "TEACHING",
      designation: "SR. TGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 1,
      latePunch: 1,
    },
    {
      id: 9,
      employee: "K M RAJSHIKHA SINGH",
      department: "TEACHING",
      designation: "TGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
    {
      id: 10,
      employee: "CHARLOTTE ANTONY",
      department: "TEACHING",
      designation: "TGT",
      totalWorkingDays: 31,
      daysPresent: 1,
      earlyPunch: 0,
      latePunch: 0,
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return reconciliationData;
    }

    return reconciliationData.filter((item) => {
      return (
        item.employee.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.designation.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const handleGo = async () => {
    try {
      setLoading(true);

      console.log({
        month,
        year,
      });

      // Yahan API call karna hai.
    } finally {
      setLoading(false);
    }
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
    console.log("No Punch Report", {
      month,
      year,
    });
    navigate("/hrm/attendance-management/no-punch-report");
  };

  const handleReport = (employee) => {
    console.log("Open employee report", employee);
    navigate("/hrm/attendance-management/reconciliation-report-sheet");
  };

  const selectClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-indigo-500";

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
            <div className="w-36">
              {/* <label className="block text-gray-400 text-xs mb-1.5">Year</label> */}

              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={selectClass}
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-44">
              {/* <label className="block text-gray-400 text-xs mb-1.5">
                Month
              </label> */}

              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className={selectClass}
              >
                {months.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* <button
              type="button"
              onClick={handleGo}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button> */}

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
                {month} {year}
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
          <table className="w-full min-w-[1150px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                  #
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
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16">
                    <div className="flex items-center justify-center">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />
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
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-medium">
                        {item.employee}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.department}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.designation}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.totalWorkingDays}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.daysPresent}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-medium ${
                          item.earlyPunch > 0
                            ? "bg-amber-500/10 text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        {item.earlyPunch}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-medium ${
                          item.latePunch > 0
                            ? "bg-red-500/10 text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {item.latePunch}
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

        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Total Employees:{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>
          </p>

          <p className="text-xs text-gray-500">
            Showing {month} {year} reconciliation
          </p>
        </div>
      </div>
    </div>
  );
}
