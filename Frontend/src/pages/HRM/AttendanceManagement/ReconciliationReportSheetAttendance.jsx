import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckSquare,
  Edit3,
  Loader2,
  Lock,
  Search,
  Unlock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReconciliationReportSheet() {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("August");
  const [year, setYear] = useState(String(currentYear));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const employee = {
    fullName: "DEVENDRA SINGH",
    department: "TEACHING",
    designation: "PRINCIPAL",
    employeeStatus: "Transferred",
  };

  const months = [
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

  const attendanceData = [
    {
      id: 1,
      date: "21-07-2026",
      inTime: "07:57 AM",
      outTime: "",
      status: "P",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 2,
      date: "22-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 3,
      date: "23-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 4,
      date: "24-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 5,
      date: "25-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 6,
      date: "26-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "Sunday",
    },
    {
      id: 7,
      date: "27-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 8,
      date: "28-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 9,
      date: "29-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 10,
      date: "30-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 11,
      date: "31-07-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 12,
      date: "01-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 13,
      date: "02-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "Sunday",
    },
    {
      id: 14,
      date: "03-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 15,
      date: "04-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 16,
      date: "05-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 17,
      date: "06-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 18,
      date: "07-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 19,
      date: "08-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "",
    },
    {
      id: 20,
      date: "09-08-2026",
      inTime: "",
      outTime: "",
      status: "A",
      leave: "-",
      locked: false,
      holiday: "Sunday",
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return attendanceData;
    }

    return attendanceData.filter((item) => {
      return (
        item.date.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.leave.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const allSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedRows.includes(item.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((previous) =>
        previous.filter((id) => !filteredData.some((item) => item.id === id)),
      );

      return;
    }

    setSelectedRows((previous) => [
      ...new Set([...previous, ...filteredData.map((item) => item.id)]),
    ]);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });
  };

  const handleGo = async () => {
    try {
      setLoading(true);

      console.log({
        month,
        year,
      });

      // Yahan selected employee ke reconciliation report ki API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    console.log("Edit attendance row", row);

    // Yahan AttendanceModal open karna hai.
  };

  const handleLock = () => {
    console.log("Lock selected rows", selectedRows);

    // Yahan bulk lock API call karna hai.
  };

  const selectClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-11 h-11 shrink-0 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-white cursor-pointer"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>

              <h1 className="text-2xl font-semibold text-white">
                Reconciliation Report Sheet
              </h1>
            </div>

            <div className="mt-3 ml-14">
              <p className="text-gray-200 font-medium">{employee.fullName}</p>

              <p className="text-gray-500 text-sm mt-1">
                {employee.department} | {employee.designation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2.5 rounded-lg text-sm">
              {employee.employeeStatus}
            </span>

            <button
              type="button"
              onClick={handleLock}
              disabled={selectedRows.length === 0}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock size={16} />
              Lock
            </button>

            <div className="w-56">
              <label className="block text-gray-400 text-xs mb-1.5">
                Month
              </label>

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

            <div className="w-44">
              <label className="block text-gray-400 text-xs mb-1.5">Year</label>

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

            <button
              type="button"
              onClick={handleGo}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
              <p className="text-indigo-300 text-sm">
                Month:{" "}
                <span className="font-medium">
                  {String(months.indexOf(month) + 1).padStart(2, "0")}/{year}
                </span>
              </p>
            </div>

            {selectedRows.length > 0 && (
              <div className="bg-gray-800 rounded-lg px-3 py-2">
                <p className="text-gray-400 text-sm">
                  Selected:{" "}
                  <span className="text-white font-medium">
                    {selectedRows.length}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search date or status..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  Sr No
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  In/Out Time
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Leave
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Locked
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16">
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
                  <td colSpan={8} className="py-14 text-center text-gray-500">
                    No reconciliation records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.date}
                    </td>

                    <td className="px-4 py-3">
                      {item.holiday ? (
                        <span className="inline-flex bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md px-2.5 py-1 text-xs font-medium">
                          {item.holiday}
                        </span>
                      ) : item.inTime || item.outTime ? (
                        <div className="flex items-center gap-2 text-sm">
                          {item.inTime ? (
                            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md px-2 py-1">
                              {item.inTime}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}

                          <span className="text-gray-600">-</span>

                          {item.outTime ? (
                            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md px-2 py-1">
                              {item.outTime}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">- -</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.status === "P" ? (
                        <span className="inline-flex items-center justify-center min-w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-xs font-semibold">
                          P
                        </span>
                      ) : item.status === "A" ? (
                        <span className="inline-flex items-center justify-center min-w-7 h-7 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs font-semibold">
                          A
                        </span>
                      ) : item.status === "HD" ? (
                        <span className="inline-flex items-center justify-center px-2 h-7 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-xs font-semibold">
                          HD
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400 text-center">
                      {item.leave || "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.locked ? (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-2.5 py-1 text-xs font-medium">
                          <Lock size={12} />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md px-2.5 py-1 text-xs font-medium">
                          <Unlock size={12} />
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          disabled={item.locked}
                          title={
                            item.locked
                              ? "Attendance is locked"
                              : "Edit Attendance"
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 cursor-pointer transition-colors disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        >
                          <Edit3 size={16} />
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
            Total Records:{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>
          </p>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">
              Present:{" "}
              <span className="text-emerald-400 font-medium">
                {filteredData.filter((item) => item.status === "P").length}
              </span>
            </span>

            <span className="text-gray-500">
              Absent:{" "}
              <span className="text-red-400 font-medium">
                {filteredData.filter((item) => item.status === "A").length}
              </span>
            </span>

            <span className="text-gray-500">
              Locked:{" "}
              <span className="text-cyan-400 font-medium">
                {filteredData.filter((item) => item.locked).length}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
