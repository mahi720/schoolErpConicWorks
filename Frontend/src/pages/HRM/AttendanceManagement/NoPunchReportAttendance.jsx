import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useEmployeeAttendanceStore } from "../../../store/HRM/attendance/employeeAttendanceStore";

const NoPunchReport = () => {
  const navigate = useNavigate();

  const currentDate = new Date();

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const [year, setYear] = useState(currentDate.getFullYear());

  const [exportLoading, setExportLoading] = useState(false);

  const { noPunchReport, noPunchLoading, fetchNoPunchReport } =
    useEmployeeAttendanceStore();

  const months = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "February",
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April",
    },
    {
      value: 5,
      label: "May",
    },
    {
      value: 6,
      label: "June",
    },
    {
      value: 7,
      label: "July",
    },
    {
      value: 8,
      label: "August",
    },
    {
      value: 9,
      label: "September",
    },
    {
      value: 10,
      label: "October",
    },
    {
      value: 11,
      label: "November",
    },
    {
      value: 12,
      label: "December",
    },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      {
        length: 11,
      },
      (_, index) => currentYear - 5 + index,
    );
  }, []);

  const selectClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50";

  const loadReport = async () => {
    await fetchNoPunchReport({
      month,
      year,
    });
  };

  useEffect(() => {
    loadReport();
  }, []);

  const noPunchData = noPunchReport?.records || [];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return noPunchData;
    }

    return noPunchData.filter((item) => {
      const employeeId = String(item.employeeId || "").toLowerCase();

      const employeeName = String(item.employeeName || "").toLowerCase();

      const date = String(item.attendanceDate || "").toLowerCase();

      const inTime = String(item.inTime || "").toLowerCase();

      const outTime = String(item.outTime || "").toLowerCase();

      return (
        employeeId.includes(keyword) ||
        employeeName.includes(keyword) ||
        date.includes(keyword) ||
        inTime.includes(keyword) ||
        outTime.includes(keyword)
      );
    });
  }, [search, noPunchData]);

  const handleGo = async () => {
    setSearch("");

    await loadReport();
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) {
      return null;
    }

    if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
      const [hoursValue, minutes] = value.split(":");

      const hours = Number(hoursValue);

      const period = hours >= 12 ? "PM" : "AM";

      const formattedHours = hours % 12 || 12;

      return `${String(formattedHours).padStart(2, "0")}:${minutes} ${period}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleExcelExport = async () => {
    try {
      setExportLoading(true);

      console.log("Export no punch report Excel", {
        month,
        year,
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handlePdfExport = async () => {
    try {
      setExportLoading(true);

      console.log("Export no punch report PDF", {
        month,
        year,
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-11 h-11 shrink-0 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-white cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl text-white font-semibold">
                No Punch Report
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Employees with missing in or out punch
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-3">
            <div className="w-44">
              <select
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
                disabled={noPunchLoading}
                className={selectClass}
              >
                {months.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-36">
              <select
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                disabled={noPunchLoading}
                className={selectClass}
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleGo}
              disabled={noPunchLoading}
              className="h-[42px] bg-blue-600 hover:bg-blue-700 px-5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {noPunchLoading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button>

            <button
              type="button"
              onClick={handleExcelExport}
              disabled={exportLoading || noPunchLoading}
              className="h-[42px] bg-emerald-600 hover:bg-emerald-700 px-4 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={16} />
              )}
              Excel
            </button>

            <button
              type="button"
              onClick={handlePdfExport}
              disabled={exportLoading || noPunchLoading}
              className="h-[42px] bg-rose-500 hover:bg-rose-600 px-4 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col rounded-lg md:flex-row md:items-center justify-between gap-4 mt-5 pt-5 border-t border-gray-800">
          <div className="relative w-full md:w-96">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employee..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
            <p className="text-indigo-300 text-sm">
              Showing:{" "}
              <span className="font-semibold">{filteredData.length}</span> No
              Punch Records
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee Id
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  In Time
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Out Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {noPunchLoading ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex justify-center">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-gray-500">
                    No punch records found for selected month
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const inTime = formatTime(item.inTime);

                  const outTime = formatTime(item.outTime);

                  return (
                    <tr
                      key={
                        item.slug ||
                        `${item.employeeSlug}-${item.attendanceDate}`
                      }
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}.
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300">
                        {item.employeeId}
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-200 font-medium">
                          {item.employeeName}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(item.attendanceDate)}
                      </td>

                      <td className="px-4 py-3">
                        {inTime ? (
                          <span className="inline-flex bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap">
                            {inTime}
                          </span>
                        ) : (
                          <span className="inline-flex bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-2.5 py-1 text-xs font-medium">
                            NA
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {outTime ? (
                          <span className="inline-flex bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap">
                            {outTime}
                          </span>
                        ) : (
                          <span className="inline-flex bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-2.5 py-1 text-xs font-medium">
                            NA
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>{" "}
            no punch records
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoPunchReport;
