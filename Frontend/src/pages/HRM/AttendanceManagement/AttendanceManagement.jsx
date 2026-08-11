import React, { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Edit,
  FileSpreadsheet,
  FileText,
  Loader2,
  LockKeyhole,
  RotateCcw,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import AttendanceModal from "../../../components/HRM/Attendance/AttendanceModal";
import ConfirmModal from "../../../components/HRM/Attendance/ConfirmModal";

import { useEmployeeAttendanceStore } from "../../../store/hrm/attendance/employeeAttendanceStore";

import AttendanceImportModal from "../../../components/HRM/Attendance/AttendanceImportModal";
import AttendanceLockConfirmModal from "../../../components/HRM/Attendance/AttendanceLockConfirmModal";

import {
  buildAttendanceLockPayload,
  attendanceLockSchema,
} from "../../../validations/hrm/attendance/employeeAttendanceValidation";

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTime = (value) => {
  if (!value) {
    return "-";
  }

  const [hourString, minuteString] = String(value).slice(0, 5).split(":");

  const hour = Number(hourString);

  if (Number.isNaN(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";

  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minuteString} ${suffix}`;
};

const getEmployeeNumber = (employee) => {
  return employee.employeeId || employee.employeeCode || "-";
};

const getDepartmentDesignation = (employee) => {
  const department =
    employee.department?.name || employee.departmentName || "-";

  const designation =
    employee.designation?.name || employee.designationName || "";

  if (designation && designation !== "-") {
    return `${department} (${designation})`;
  }

  return department;
};

const getStatusShortName = (status) => {
  switch (status) {
    case "PRESENT":
      return "P";

    case "ABSENT":
      return "A";

    case "LEAVE":
      return "L";

    case "HOLIDAY":
      return "H";

    default:
      return "-";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "PRESENT":
      return "bg-green-500 hover:bg-green-600";

    case "ABSENT":
      return "bg-red-500 hover:bg-red-600";

    case "LEAVE":
      return "bg-yellow-500";

    case "HOLIDAY":
      return "bg-purple-500";

    default:
      return "bg-gray-600 hover:bg-gray-500";
  }
};

export default function AttendanceManagement() {
  const [date, setDate] = useState(getTodayDate());

  const [selected, setSelected] = useState(null);

  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const [absentConfirmOpen, setAbsentConfirmOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false);

  const navigate = useNavigate();

  // const fileInputRef = useRef(null);

  const {
    attendanceData,
    employees,
    summary,
    dashboard,

    loading,
    dashboardLoading,
    submitLoading,
    lockLoading,
    actionLoadingSlug,

    fetchAttendances,
    fetchDashboard,

    markPresent,
    markAbsent,
    updateAttendance,

    lockAttendance,
    unlockAttendance,

    // fetchYearlyReport,

    // importLoading,
    // importAttendance,
  } = useEmployeeAttendanceStore();

  const attendanceLocked = Boolean(attendanceData?.locked);

  useEffect(() => {
    if (!date) {
      return;
    }

    fetchAttendances({
      date,
    });

    fetchDashboard({
      date,
    });

    setSelectedEmployees([]);

    setSelected(null);

    setAttendanceModalOpen(false);

    setAbsentConfirmOpen(false);

    setEditMode(false);
  }, [date, fetchAttendances, fetchDashboard]);

  const yesterdaySummary = dashboard?.summary || {
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    holiday: 0,
    notMarked: 0,
  };

  const selectableEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        !employee.isLocked &&
        employee.attendanceStatus !== "HOLIDAY" &&
        employee.attendanceStatus !== "LEAVE",
    );
  }, [employees]);

  const allSelected =
    selectableEmployees.length > 0 &&
    selectableEmployees.every((employee) =>
      selectedEmployees.includes(employee.employeeSlug),
    );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEmployees(
        selectableEmployees.map((employee) => employee.employeeSlug),
      );

      return;
    }

    setSelectedEmployees([]);
  };

  const handleSingleSelect = (employeeSlug) => {
    setSelectedEmployees((previous) => {
      if (previous.includes(employeeSlug)) {
        return previous.filter((slug) => slug !== employeeSlug);
      }

      return [...previous, employeeSlug];
    });
  };

  const reloadAttendance = async () => {
    await fetchAttendances({
      date,
    });

    await fetchDashboard({
      date,
    });
  };

  const openPresentModal = (employee) => {
    if (employee.isLocked || attendanceLocked) {
      return;
    }

    if (
      employee.attendanceStatus === "HOLIDAY" ||
      employee.attendanceStatus === "LEAVE"
    ) {
      return;
    }

    setSelected(employee);

    setEditMode(false);

    setAttendanceModalOpen(true);
  };

  const openEditModal = (employee) => {
    if (
      employee.isLocked ||
      attendanceLocked ||
      employee.attendanceStatus !== "PRESENT" ||
      !employee.attendanceSlug
    ) {
      return;
    }

    setSelected(employee);

    setEditMode(true);

    setAttendanceModalOpen(true);
  };

  const openAbsentModal = (employee) => {
    if (employee.isLocked || attendanceLocked) {
      return;
    }

    if (
      employee.attendanceStatus === "HOLIDAY" ||
      employee.attendanceStatus === "LEAVE"
    ) {
      return;
    }

    setSelected(employee);

    setAbsentConfirmOpen(true);
  };

  // const handleStatusClick = (employee) => {
  //   if (employee.isLocked || attendanceLocked) {
  //     return;
  //   }

  //   switch (employee.attendanceStatus) {
  //     case "PRESENT":
  //       openAbsentModal(employee);
  //       break;

  //     case "ABSENT":
  //     case "NOT_MARKED":
  //       openPresentModal(employee);
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const handleStatusClick = (employee) => {
    if (employee.isLocked || attendanceLocked) {
      return;
    }

    if (
      employee.attendanceStatus === "HOLIDAY" ||
      employee.attendanceStatus === "LEAVE"
    ) {
      return;
    }

    // Present status par click -> Absent confirmation modal
    if (employee.attendanceStatus === "PRESENT") {
      setSelected(employee);
      setAbsentConfirmOpen(true);

      return;
    }

    // Absent / Not Marked -> Attendance modal
    setSelected(employee);
    setEditMode(false);
    setAttendanceModalOpen(true);
  };

  const handleSaveAttendance = async (payload) => {
    if (!selected) {
      return;
    }

    let success = false;

    if (editMode) {
      if (!selected.attendanceSlug) {
        toast.error("Attendance record not found");

        return;
      }

      success = await updateAttendance(selected.attendanceSlug, payload);
    } else {
      success = await markPresent(selected.employeeSlug, payload);
    }

    if (!success) {
      return;
    }

    setAttendanceModalOpen(false);

    setSelected(null);

    setEditMode(false);

    await reloadAttendance();
  };

  const handleMarkAbsentFromModal = async (payload) => {
    if (!selected?.employeeSlug) {
      return;
    }

    const success = await markAbsent(selected.employeeSlug, payload);

    if (!success) {
      return;
    }

    setAttendanceModalOpen(false);

    setSelected(null);
    setEditMode(false);

    await reloadAttendance();
  };

  const handleConfirmAbsent = async (payload) => {
    if (!selected?.employeeSlug) {
      return;
    }

    const success = await markAbsent(selected.employeeSlug, payload);

    if (!success) {
      return;
    }

    setAbsentConfirmOpen(false);

    setSelected(null);

    await reloadAttendance();
  };

  const handleLockUnlock = async () => {
    if (attendanceLocked) {
      const payload = buildAttendanceLockPayload(date);

      const validation = attendanceLockSchema.safeParse(payload);

      if (!validation.success) {
        toast.error(
          validation.error.issues?.[0]?.message || "Invalid attendance date",
        );

        return;
      }

      const success = await unlockAttendance(validation.data);

      if (!success) {
        return;
      }

      setSelectedEmployees([]);

      await reloadAttendance();

      return;
    }

    if (!selectableEmployees.length) {
      toast.error("No employees available to lock");

      return;
    }

    if (!allSelected) {
      toast.error("Please select all employees before locking attendance");

      return;
    }

    setLockConfirmOpen(true);
  };

  const handleConfirmLock = async () => {
    const payload = buildAttendanceLockPayload(date);

    const validation = attendanceLockSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid attendance date",
      );

      return;
    }

    const result = await lockAttendance(validation.data);

    if (!result?.success) {
      return;
    }

    setLockConfirmOpen(false);

    setSelectedEmployees([]);

    await reloadAttendance();
  };

  const handleYearlyReport = () => {
    navigate("/hrm/attendance-management/yearly-attendance-report");
  };

  const closeAttendanceModal = () => {
    if (submitLoading) {
      return;
    }

    setAttendanceModalOpen(false);

    setSelected(null);

    setEditMode(false);
  };

  const closeAbsentModal = () => {
    if (submitLoading) {
      return;
    }

    setAbsentConfirmOpen(false);

    setSelected(null);
  };

  // const handleAttendanceExcelImport = async (event) => {
  //   const file = event.target.files?.[0];

  //   event.target.value = "";

  //   if (!file) {
  //     return;
  //   }

  //   const allowedExtensions = [".xlsx", ".xls"];

  //   const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

  //   if (!allowedExtensions.includes(extension)) {
  //     toast.error("Please select a valid Excel file");

  //     return;
  //   }

  //   const result = await importAttendance(file);

  //   if (!result?.success) {
  //     return;
  //   }

  //   await reloadAttendance();
  // };

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Attendance Management</h1>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet size={18} />
            Upload Attendance
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/hrm/attendance-management/reconciliation-sheet")
            }
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Reconciliation
          </button>

          <button
            type="button"
            onClick={handleYearlyReport}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            <FileText size={18} />
            Yearly Attendance Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-300 font-semibold">
            Yesterday&apos;s Present Count
          </h3>

          {dashboardLoading ? (
            <div className="mt-5">
              <Loader2 size={26} className="animate-spin text-green-400" />
            </div>
          ) : (
            <h2 className="text-3xl text-white mt-5">
              {yesterdaySummary.present}/{yesterdaySummary.total}
            </h2>
          )}

          <div className="h-1 bg-green-500 rounded-full mt-8" />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-300 font-semibold">
            Yesterday&apos;s Absent Count
          </h3>

          {dashboardLoading ? (
            <div className="mt-5">
              <Loader2 size={26} className="animate-spin text-red-400" />
            </div>
          ) : (
            <h2 className="text-3xl text-white mt-5">
              {yesterdaySummary.absent}/{yesterdaySummary.total}
            </h2>
          )}

          <div className="h-1 bg-red-500 rounded-full mt-8" />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-300 font-semibold">
            Yesterday&apos;s On-Leave Count
          </h3>

          {dashboardLoading ? (
            <div className="mt-5">
              <Loader2 size={26} className="animate-spin text-yellow-400" />
            </div>
          ) : (
            <h2 className="text-3xl text-white mt-5">
              {yesterdaySummary.leave}/{yesterdaySummary.total}
            </h2>
          )}

          <div className="h-1 bg-yellow-500 rounded-full mt-8" />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl text-white">{date}</h2>

          {attendanceData?.dayName && (
            <p className="text-gray-500 text-sm mt-1">
              {attendanceData.dayName}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleLockUnlock}
            disabled={lockLoading || loading || !employees.length}
            className={`px-8 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              attendanceLocked
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {lockLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : attendanceLocked ? (
              <RotateCcw size={18} />
            ) : (
              <LockKeyhole size={18} />
            )}

            {lockLoading
              ? attendanceLocked
                ? "Unlocking..."
                : "Locking..."
              : attendanceLocked
                ? "Unlock Attendance"
                : "Lock Attendance"}
          </button>

          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white cursor-pointer outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {summary && (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg">
            Total: <strong className="text-white">{summary.total}</strong>
          </span>

          <span className="bg-green-500/15 text-green-400 px-4 py-2 rounded-lg">
            Present: {summary.present}
          </span>

          <span className="bg-red-500/15 text-red-400 px-4 py-2 rounded-lg">
            Absent: {summary.absent}
          </span>

          <span className="bg-yellow-500/15 text-yellow-400 px-4 py-2 rounded-lg">
            Leave: {summary.leave}
          </span>

          <span className="bg-purple-500/15 text-purple-400 px-4 py-2 rounded-lg">
            Holiday: {summary.holiday}
          </span>

          <span className="bg-gray-500/15 text-gray-400 px-4 py-2 rounded-lg">
            Not Marked: {summary.notMarked}
          </span>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-auto custom-scrollbar max-h-[650px]">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-gray-800 whitespace-nowrap sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left text-gray-300">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={attendanceLocked || !selectableEmployees.length}
                    className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                </th>

                {[
                  "SNo.",
                  "Emp Id",
                  "Name",
                  "Department",
                  "In/Out Time",
                  "Status",
                  "Late",
                  "Early",
                  "Leave/Holiday",
                  "Locked",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="p-4 text-left text-gray-300">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="p-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-indigo-400">
                      <Loader2 size={22} className="animate-spin" />
                      Loading attendance...
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-12 text-center text-gray-500">
                    No employees found for selected date
                  </td>
                </tr>
              ) : (
                employees.map((employee, index) => {
                  const status = employee.attendanceStatus || "NOT_MARKED";

                  const rowLocked = Boolean(employee.isLocked);

                  const immutableStatus =
                    status === "HOLIDAY" || status === "LEAVE";

                  const actionDisabled =
                    rowLocked || attendanceLocked || immutableStatus;

                  const rowLoading =
                    Boolean(actionLoadingSlug) &&
                    (actionLoadingSlug === employee.employeeSlug ||
                      (Boolean(employee.attendanceSlug) &&
                        actionLoadingSlug === employee.attendanceSlug));

                  return (
                    <tr
                      key={employee.employeeSlug}
                      className={`border-t border-gray-800 ${
                        rowLocked ? "bg-gray-950/40" : "hover:bg-gray-800/50"
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(
                            employee.employeeSlug,
                          )}
                          onChange={() =>
                            handleSingleSelect(employee.employeeSlug)
                          }
                          disabled={actionDisabled}
                          className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </td>

                      <td className="p-4 text-gray-300">{index + 1}</td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getEmployeeNumber(employee)}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {employee.fullName}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getDepartmentDesignation(employee)}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {!employee.inTime && !employee.outTime ? (
                          <span className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-sm">
                            - -
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <span
                              className={`px-3 py-1.5 rounded-lg text-sm ${
                                employee.isLate
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              IN : {formatTime(employee.inTime)}
                            </span>

                            <span
                              className={`px-3 py-1.5 rounded-lg text-sm ${
                                employee.isEarly
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              OUT : {formatTime(employee.outTime)}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={actionDisabled || rowLoading}
                          onClick={() => handleStatusClick(employee)}
                          title={
                            status === "PRESENT"
                              ? "Click to mark absent"
                              : status === "ABSENT" || status === "NOT_MARKED"
                                ? "Click to mark present"
                                : employee.leaveHoliday || status
                          }
                          className={`${getStatusClass(
                            status,
                          )} min-w-[38px] text-white px-3 py-1.5 rounded-lg ${
                            actionDisabled
                              ? "cursor-not-allowed opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          {rowLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin mx-auto"
                            />
                          ) : (
                            getStatusShortName(status)
                          )}
                        </button>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {status === "PRESENT" ? (
                          employee.isLate ? (
                            <div>
                              <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-lg text-xs">
                                YES
                              </span>

                              {employee.lateMinutes !== null &&
                                employee.lateMinutes !== undefined && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {employee.lateMinutes} min
                                  </p>
                                )}
                            </div>
                          ) : (
                            <span className="bg-green-500/15 text-green-400 px-3 py-1 rounded-lg text-xs">
                              NO
                            </span>
                          )
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {status === "PRESENT" ? (
                          employee.isEarly ? (
                            <div>
                              <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-lg text-xs">
                                YES
                              </span>

                              {employee.earlyMinutes !== null &&
                                employee.earlyMinutes !== undefined && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {employee.earlyMinutes} min
                                  </p>
                                )}
                            </div>
                          ) : (
                            <span className="bg-green-500/15 text-green-400 px-3 py-1 rounded-lg text-xs">
                              NO
                            </span>
                          )
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {employee.leaveHoliday ? (
                          <span
                            className={`px-3 py-1.5 rounded-lg text-sm ${
                              status === "HOLIDAY"
                                ? "bg-purple-500/15 text-purple-400"
                                : "bg-yellow-500/15 text-yellow-400"
                            }`}
                          >
                            {employee.leaveHoliday}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-white px-2.5 py-1.5 text-xs font-medium rounded-lg ${
                            rowLocked ? "bg-green-600" : "bg-cyan-600"
                          }`}
                        >
                          {rowLocked ? "YES" : "NO"}
                        </span>
                      </td>

                      <td className="p-4">
                        {status === "PRESENT" && !actionDisabled && (
                          <button
                            type="button"
                            onClick={() => openEditModal(employee)}
                            disabled={submitLoading}
                            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit Attendance"
                          >
                            <Edit size={16} />
                          </button>
                        )}

                        {rowLocked && (
                          <span
                            className="inline-flex items-center gap-1.5 text-green-400 text-xs"
                            title="Attendance Locked"
                          >
                            <CheckCircle2 size={16} />
                            Locked
                          </span>
                        )}

                        {!rowLocked &&
                          status !== "PRESENT" &&
                          immutableStatus && (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AttendanceModal
        open={attendanceModalOpen}
        close={closeAttendanceModal}
        edit={editMode}
        data={selected}
        attendanceDate={date}
        loading={submitLoading}
        save={handleSaveAttendance}
        markAbsent={handleMarkAbsentFromModal}
      />

      <ConfirmModal
        open={absentConfirmOpen}
        close={closeAbsentModal}
        employee={selected}
        attendanceDate={date}
        loading={submitLoading}
        confirm={handleConfirmAbsent}
      />

      <AttendanceImportModal
        open={importModalOpen}
        close={() => setImportModalOpen(false)}
        onImported={reloadAttendance}
      />

      <AttendanceLockConfirmModal
        open={lockConfirmOpen}
        close={() => setLockConfirmOpen(false)}
        confirm={handleConfirmLock}
        attendanceDate={date}
        loading={lockLoading}
      />
    </div>
  );
}
