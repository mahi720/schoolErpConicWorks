import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ArrowLeft, Edit, Loader2, Lock, Search, Unlock } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import AttendanceModal from "../../../components/HRM/Attendance/AttendanceModal";

import { useEmployeeAttendanceStore } from "../../../store/hrm/attendance/employeeAttendanceStore";
import ConfirmModal from "../../../components/HRM/Attendance/ConfirmModal";

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

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const raw = String(value).slice(0, 10);

  const [year, month, day] = raw.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
};

const formatTime = (value) => {
  if (!value) {
    return "-";
  }

  const time = String(value).slice(0, 5);

  const [hourString, minuteString] = time.split(":");

  const hour = Number(hourString);

  if (Number.isNaN(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";

  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minuteString} ${suffix}`;
};

const getRowKey = (item) => {
  return item.attendanceSlug || item.date;
};

const getStatusShortName = (status, row) => {
  if (row?.isSunday || row?.isHoliday) {
    return "H";
  }

  switch (status) {
    case "PRESENT":
      return "P";

    case "ABSENT":
      return "A";

    case "LEAVE":
      return "L";

    case "HOLIDAY":
      return "H";

    case "NOT_MARKED":
      return "-";

    default:
      return "-";
  }
};

const getStatusClass = (status, row) => {
  if (row?.isSunday || row?.isHoliday || status === "HOLIDAY") {
    return "bg-purple-500/10 border-purple-500/20 text-purple-400";
  }

  switch (status) {
    case "PRESENT":
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

    case "ABSENT":
      return "bg-red-500/10 border-red-500/20 text-red-400";

    case "LEAVE":
      return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";

    default:
      return "bg-gray-500/10 border-gray-500/20 text-gray-400";
  }
};

export default function ReconciliationReportSheet() {
  const navigate = useNavigate();

  const location = useLocation();

  const navigationState = location.state || {};

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const currentMonth = currentDate.getMonth() + 1;

  const employeeSlug =
    navigationState.employeeSlug ||
    navigationState.employee?.employeeSlug ||
    navigationState.employee?.slug ||
    "";

  const [month, setMonth] = useState(
    Number(navigationState.month || currentMonth),
  );

  const [year, setYear] = useState(Number(navigationState.year || currentYear));

  const [search, setSearch] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);

  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [absentConfirmOpen, setAbsentConfirmOpen] = useState(false);

  const {
    reconciliationDetail,
    reconciliationLoading,
    reconciliationLockLoading,

    submitLoading,

    fetchEmployeeMonthlyReconciliation,

    markPresent,
    markAbsent,
    updateAttendance,

    lockReconciliationAttendance,
  } = useEmployeeAttendanceStore();

  const years = useMemo(() => {
    return Array.from(
      {
        length: 7,
      },
      (_, index) => currentYear - 3 + index,
    );
  }, [currentYear]);

  const employee =
    reconciliationDetail?.employee || navigationState.employee || null;

  const attendanceData = reconciliationDetail?.rows || [];

  const loadReport = useCallback(
    async (selectedYear = year, selectedMonth = month) => {
      if (!employeeSlug) {
        toast.error("Employee not found");

        return false;
      }

      return fetchEmployeeMonthlyReconciliation(employeeSlug, {
        year: Number(selectedYear),

        month: Number(selectedMonth),
      });
    },
    [employeeSlug, year, month, fetchEmployeeMonthlyReconciliation],
  );

  useEffect(() => {
    loadReport();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return attendanceData;
    }

    return attendanceData.filter((item) => {
      const date = String(item.date || "").toLowerCase();

      const status = String(item.attendanceStatus || "").toLowerCase();

      const leave = String(item.leaveTypeName || "").toLowerCase();

      const holiday = String(item.holidayName || "").toLowerCase();

      return (
        date.includes(keyword) ||
        status.includes(keyword) ||
        leave.includes(keyword) ||
        holiday.includes(keyword)
      );
    });
  }, [attendanceData, search]);

  const selectableRows = useMemo(() => {
    return filteredData.filter(
      (item) =>
        Boolean(item.attendanceSlug) &&
        !item.isLocked &&
        !item.isSunday &&
        !item.isHoliday &&
        item.attendanceStatus !== "HOLIDAY",
    );
  }, [filteredData]);

  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((item) => selectedRows.includes(getRowKey(item)));

  const handleSelectAll = () => {
    const selectableKeys = selectableRows.map((item) => getRowKey(item));

    if (allSelected) {
      setSelectedRows((previous) =>
        previous.filter((key) => !selectableKeys.includes(key)),
      );

      return;
    }

    setSelectedRows((previous) => [
      ...new Set([...previous, ...selectableKeys]),
    ]);
  };

  const handleSelectRow = (row) => {
    if (!row.attendanceSlug) {
      toast.error("Attendance is not saved for this date");

      return;
    }

    if (row.isLocked) {
      toast.error("Attendance is already locked");

      return;
    }

    if (row.isSunday || row.isHoliday || row.attendanceStatus === "HOLIDAY") {
      return;
    }

    const key = getRowKey(row);

    setSelectedRows((previous) => {
      if (previous.includes(key)) {
        return previous.filter((item) => item !== key);
      }

      return [...previous, key];
    });
  };

  const handleGo = async () => {
    setSelectedRows([]);

    setSearch("");

    await loadReport(year, month);
  };

  const handleEdit = (row) => {
    if (row.isLocked) {
      toast.error("Attendance is locked");
      return;
    }

    if (
      row.isSunday ||
      row.isHoliday ||
      row.attendanceStatus === "HOLIDAY" ||
      row.attendanceStatus === "LEAVE"
    ) {
      return;
    }

    if (row.attendanceStatus !== "PRESENT" || !row.attendanceSlug) {
      return;
    }

    setSelectedAttendance({
      ...row,

      employeeSlug,

      fullName: employee?.fullName || "",

      employeeId: employee?.employeeId || "",

      employeeCode: employee?.employeeCode || "",
    });

    setEditMode(true);

    setAttendanceModalOpen(true);
  };

  const handleOpenAbsentModal = (row) => {
    if (row.isLocked) {
      toast.error("Attendance is locked");

      return;
    }

    if (row.isSunday || row.isHoliday || row.attendanceStatus !== "PRESENT") {
      return;
    }

    setSelectedAttendance({
      ...row,

      employeeSlug,

      fullName: employee?.fullName || "",

      employeeId: employee?.employeeId || "",

      employeeCode: employee?.employeeCode || "",
    });

    setAbsentConfirmOpen(true);
  };

  const handleConfirmAbsent = async (payload) => {
    if (!employeeSlug) {
      return;
    }

    const success = await markAbsent(employeeSlug, payload);

    if (!success) {
      return;
    }

    setAbsentConfirmOpen(false);

    setSelectedAttendance(null);

    await loadReport();
  };

  const closeAbsentModal = () => {
    if (submitLoading) {
      return;
    }

    setAbsentConfirmOpen(false);

    setSelectedAttendance(null);
  };

  const closeEditModal = () => {
    if (submitLoading) {
      return;
    }

    setEditModalOpen(false);

    setSelectedAttendance(null);
  };

  const handleMarkAttendance = (row) => {
    if (row.isLocked) {
      toast.error("Attendance is locked");
      return;
    }

    if (
      row.isSunday ||
      row.isHoliday ||
      row.attendanceStatus === "HOLIDAY" ||
      row.attendanceStatus === "LEAVE"
    ) {
      return;
    }

    setSelectedAttendance({
      ...row,

      employeeSlug,

      fullName: employee?.fullName || "",

      employeeId: employee?.employeeId || "",

      employeeCode: employee?.employeeCode || "",
    });

    setEditMode(false);

    setAttendanceModalOpen(true);
  };

  // const handleSaveEdit = async (payload) => {
  //   if (!selectedAttendance?.attendanceSlug) {
  //     toast.error("Attendance record not found");

  //     return;
  //   }

  //   const success = await updateAttendance(
  //     selectedAttendance.attendanceSlug,
  //     payload,
  //   );

  //   if (!success) {
  //     return;
  //   }

  //   setEditModalOpen(false);

  //   setSelectedAttendance(null);

  //   await loadReport();
  // };

  const handleSaveAttendance = async (payload) => {
    if (!selectedAttendance) {
      return;
    }

    let success = false;

    if (editMode) {
      if (!selectedAttendance.attendanceSlug) {
        toast.error("Attendance record not found");

        return;
      }

      success = await updateAttendance(
        selectedAttendance.attendanceSlug,
        payload,
      );
    } else {
      success = await markPresent(employeeSlug, payload);
    }

    if (!success) {
      return;
    }

    setAttendanceModalOpen(false);

    setSelectedAttendance(null);

    setEditMode(false);

    await loadReport();
  };

  const handleMarkAbsentFromModal = async (payload) => {
    if (!employeeSlug) {
      return;
    }

    const success = await markAbsent(employeeSlug, payload);

    if (!success) {
      return;
    }

    setAttendanceModalOpen(false);

    setSelectedAttendance(null);

    setEditMode(false);

    await loadReport();
  };

  const handleLock = async () => {
    if (!selectedRows.length) {
      toast.error("Please select attendance records");

      return;
    }

    const rowsToLock = attendanceData.filter(
      (item) =>
        item.attendanceSlug &&
        selectedRows.includes(getRowKey(item)) &&
        !item.isLocked &&
        !item.isSunday &&
        !item.isHoliday &&
        item.attendanceStatus !== "HOLIDAY",
    );

    if (!rowsToLock.length) {
      toast.error("No unlocked attendance records selected");

      return;
    }

    for (const row of rowsToLock) {
      const success = await lockReconciliationAttendance(row.attendanceSlug);

      if (!success) {
        return;
      }
    }

    setSelectedRows([]);

    await loadReport();
  };

  const presentCount = useMemo(() => {
    return filteredData.filter((item) => item.attendanceStatus === "PRESENT")
      .length;
  }, [filteredData]);

  const absentCount = useMemo(() => {
    return filteredData.filter((item) => item.attendanceStatus === "ABSENT")
      .length;
  }, [filteredData]);

  const lockedCount = useMemo(() => {
    return filteredData.filter((item) => item.isLocked).length;
  }, [filteredData]);

  const closeAttendanceModal = () => {
    if (submitLoading) {
      return;
    }

    setAttendanceModalOpen(false);

    setSelectedAttendance(null);

    setEditMode(false);
  };

  const selectClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

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

              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Reconciliation Report Sheet
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                  Employee monthly attendance details
                </p>
              </div>
            </div>

            {employee && (
              <div className="mt-4 ml-14">
                <p className="text-gray-200 font-medium">
                  {employee.fullName || "-"}{" "}
                  <span className="text-gray-500 text-sm mt-1">
                    ({employee.employeeId || employee.employeeCode})
                  </span>
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {employee.department || "-"} {" | "}{" "}
                  {employee.designation || "-"}
                </p>

                {/* {(employee.employeeId || employee.employeeCode) && (
                  <p className="text-gray-600 text-xs mt-1"></p>
                )} */}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* {employee?.isTransferred || employee?.isTransferred ? (
              <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2.5 rounded-lg text-sm">
                {employee.isTransferred || employee.isTransferred}
              </span>
            ) : null} */}

            {/* <button
              type="button"
              onClick={handleLock}
              disabled={selectedRows.length === 0 || reconciliationLockLoading}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reconciliationLockLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}

              {reconciliationLockLoading ? "Locking..." : "Lock"}
            </button> */}

            {/* Month / Selected Info */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
                <p className="text-indigo-300 text-sm whitespace-nowrap">
                  Month:{" "}
                  <span className="font-medium">
                    {String(month).padStart(2, "0")}-{year}
                  </span>
                </p>
              </div>

              {selectedRows.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                  <p className="text-gray-400 text-sm whitespace-nowrap">
                    Selected:{" "}
                    <span className="text-white font-medium">
                      {selectedRows.length}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end justify-end gap-3">
              <div className="w-44">
                <select
                  value={month}
                  onChange={(event) => setMonth(Number(event.target.value))}
                  disabled={reconciliationLoading}
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
                  disabled={reconciliationLoading}
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
                disabled={reconciliationLoading}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reconciliationLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {/* for checkbox */}
                {/* <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={!selectableRows.length}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:cursor-not-allowed"
                  />
                </th> */}

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  SNo.
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
              {reconciliationLoading ? (
                <tr>
                  <td colSpan={8} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />

                      <p className="text-gray-500 text-sm">
                        Loading attendance records...
                      </p>
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
                filteredData.map((item, index) => {
                  const rowKey = getRowKey(item);

                  const rowSelectable =
                    Boolean(item.attendanceSlug) &&
                    !item.isLocked &&
                    !item.isSunday &&
                    !item.isHoliday &&
                    item.attendanceStatus !== "HOLIDAY";

                  const statusShort = getStatusShortName(
                    item.attendanceStatus,
                    item,
                  );

                  return (
                    <tr
                      key={rowKey}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      {/* for checkbox  */}

                      {/* <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(rowKey)}
                          onChange={() => handleSelectRow(item)}
                          disabled={!rowSelectable}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td> */}

                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>

                      <td className="px-4 py-3">
                        {item.isSunday ||
                        item.isHoliday ||
                        item.attendanceStatus === "HOLIDAY" ? (
                          <span className="inline-flex bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md px-2.5 py-1 text-xs font-medium">
                            {item.holidayName ||
                              (item.isSunday ? "Sunday" : "Holiday")}
                          </span>
                        ) : item.inTime || item.outTime ? (
                          <div className="flex items-center gap-2 text-sm">
                            {item.inTime ? (
                              <span
                                className={`rounded-md px-2 py-1 border ${
                                  item.isLate
                                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                }`}
                              >
                                IN : {formatTime(item.inTime)}
                              </span>
                            ) : (
                              <span className="text-gray-500">IN : -</span>
                            )}

                            {item.outTime ? (
                              <span
                                className={`rounded-md px-2 py-1 border ${
                                  item.isEarly
                                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                }`}
                              >
                                OUT : {formatTime(item.outTime)}
                              </span>
                            ) : (
                              <span className="text-gray-500">OUT : -</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">- -</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.isSunday ||
                        item.isHoliday ||
                        item.attendanceStatus === "HOLIDAY" ||
                        item.attendanceStatus === "LEAVE" ? (
                          <span
                            className={`inline-flex items-center justify-center min-w-7 h-7 border rounded-md text-xs font-semibold ${getStatusClass(
                              item.attendanceStatus,
                              item,
                            )}`}
                          >
                            {statusShort}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (item.isLocked) {
                                return;
                              }

                              if (item.attendanceStatus === "PRESENT") {
                                handleOpenAbsentModal(item);

                                return;
                              }

                              handleMarkAttendance(item);
                            }}
                            disabled={item.isLocked}
                            title={
                              item.isLocked
                                ? "Attendance is locked"
                                : item.attendanceStatus === "PRESENT"
                                  ? "Mark Absent"
                                  : "Mark Attendance"
                            }
                            className={`inline-flex items-center justify-center min-w-7 h-7 border rounded-md text-xs font-semibold transition ${
                              item.isLocked
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer hover:scale-105"
                            } ${getStatusClass(item.attendanceStatus, item)}`}
                          >
                            {statusShort}
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400 text-center">
                        {item.leaveTypeName || "-"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.isLocked ? (
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
                            disabled={
                              item.isLocked ||
                              !item.attendanceSlug ||
                              item.attendanceStatus !== "PRESENT"
                            }
                            title={
                              item.isLocked
                                ? "Attendance is locked"
                                : item.attendanceStatus !== "PRESENT"
                                  ? "Only present attendance can be edited"
                                  : "Edit Attendance"
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 cursor-pointer transition-colors disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-gray-500">
              Present:{" "}
              <span className="text-emerald-400 font-medium">
                {presentCount}
              </span>
            </span>

            <span className="text-gray-500">
              Absent:{" "}
              <span className="text-red-400 font-medium">{absentCount}</span>
            </span>

            <span className="text-gray-500">
              Locked:{" "}
              <span className="text-cyan-400 font-medium">{lockedCount}</span>
            </span>
          </div>
        </div>
      </div>

      <AttendanceModal
        open={attendanceModalOpen}
        close={closeAttendanceModal}
        edit={editMode}
        data={selectedAttendance}
        attendanceDate={selectedAttendance?.date || ""}
        loading={submitLoading}
        save={handleSaveAttendance}
        markAbsent={handleMarkAbsentFromModal}
      />

      <ConfirmModal
        open={absentConfirmOpen}
        close={closeAbsentModal}
        employee={selectedAttendance}
        attendanceDate={selectedAttendance?.date || ""}
        loading={submitLoading}
        confirm={handleConfirmAbsent}
      />
    </div>
  );
}
