import React, { useEffect, useMemo, useState } from "react";

import { Check, Eye, Loader2, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useEmployeeStore } from "../../../../store/hrm/employee/employeeStore";

import { useEmployeeAttendanceStore } from "../../../../store/hrm/attendance/employeeAttendanceStore";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [requestMenuOpen, setRequestMenuOpen] = useState(false);

  const [leaveRequests] = useState([
    {
      id: 11,
      employeeName: "DEEPA R V",
      date: "2026-08-03",
      status: "Pending",
      duration: "Full Day",
      leaveType: "CL",
    },
    {
      id: 12,
      employeeName: "SUNITA K",
      date: "2026-08-03",
      status: "Pending",
      duration: "Full Day",
      leaveType: "CL",
    },
    {
      id: 13,
      employeeName: "SURABHI K M K",
      date: "2026-07-29",
      status: "Pending",
      duration: "Full Day",
      leaveType: "CL",
    },
    {
      id: 14,
      employeeName: "CHARLOTTE ANTONY",
      date: "2026-07-28",
      status: "Pending",
      duration: "Full Day",
      leaveType: "CL",
    },
    {
      id: 15,
      employeeName: "B G ANILA KUMARI",
      date: "2026-07-28",
      status: "Pending",
      duration: "Full Day",
      leaveType: "CL",
    },
    {
      id: 16,
      employeeName: "RANJINI VARMA K",
      date: "2026-07-28",
      status: "Pending",
      duration: "Full Day",
      leaveType: "EL",
    },
  ]);

  const {
    employees,
    loading: employeeLoading,
    fetchEmployees,
  } = useEmployeeStore();

  const {
    employees: attendanceEmployees,
    loading: attendanceLoading,
    fetchAttendances,
  } = useEmployeeAttendanceStore();

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    fetchEmployees();

    fetchAttendances({
      date: today,
    });
  }, []);

  const employeeList = useMemo(() => {
    if (Array.isArray(employees)) {
      return employees;
    }

    if (Array.isArray(employees?.employees)) {
      return employees.employees;
    }

    if (Array.isArray(employees?.data)) {
      return employees.data;
    }

    return [];
  }, [employees]);

  const todayAttendance = useMemo(() => {
    return (attendanceEmployees || []).filter(
      (employee) =>
        Boolean(employee.attendanceSlug) &&
        employee.attendanceStatus !== "NOT_MARKED",
    );
  }, [attendanceEmployees]);

  const newEmployees = useMemo(() => {
    const currentDate = new Date();

    currentDate.setHours(23, 59, 59, 999);

    return employeeList
      .filter((employee) => {
        if (!employee.joiningDate) {
          return false;
        }

        if (employee.isActive === false) {
          return false;
        }

        const joiningDate = new Date(employee.joiningDate);

        if (Number.isNaN(joiningDate.getTime())) {
          return false;
        }

        joiningDate.setHours(0, 0, 0, 0);

        const threeMonthsAfter = new Date(joiningDate);

        threeMonthsAfter.setMonth(threeMonthsAfter.getMonth() + 3);

        return currentDate >= joiningDate && currentDate < threeMonthsAfter;
      })
      .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
  }, [employeeList]);

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
      return "-";
    }

    if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
      const [hourValue, minute] = value.split(":");

      const hour = Number(hourValue);

      const period = hour >= 12 ? "PM" : "AM";

      const displayHour = hour % 12 || 12;

      return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
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

  const getEmployeeId = (employee) => {
    return (
      employee.employeeId || employee.employeeCode || employee.empId || "-"
    );
  };

  const getEmployeeName = (employee) => {
    return employee.fullName || employee.employeeName || employee.name || "-";
  };

  const getDepartment = (employee) => {
    return (
      employee.department?.departmentName ||
      employee.department?.name ||
      employee.departmentName ||
      employee.department ||
      "-"
    );
  };

  const getDesignation = (employee) => {
    return (
      employee.designation?.designationName ||
      employee.designation?.name ||
      employee.designationName ||
      employee.designation ||
      "-"
    );
  };

  const getAttendanceStatusClass = (status) => {
    switch (status) {
      case "PRESENT":
        return "bg-emerald-500/15 border-emerald-500/20 text-emerald-400";

      case "ABSENT":
        return "bg-red-500/15 border-red-500/20 text-red-400";

      case "LEAVE":
        return "bg-amber-500/15 border-amber-500/20 text-amber-400";

      case "HOLIDAY":
        return "bg-purple-500/15 border-purple-500/20 text-purple-400";

      default:
        return "bg-gray-700 border-gray-600 text-gray-300";
    }
  };

  const loading = employeeLoading || attendanceLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl font-semibold text-white">HRM Dashboard</h1>

            <p className="text-gray-500 text-sm mt-1">
              Employee requests, joining and attendance overview
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/hrm/requests")}
              className="bg-rose-600 hover:bg-rose-700 min-w-52 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
            >
              HRM Requests
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/hrm/attendance-management/reconciliation-sheet")
              }
              className="bg-amber-600 hover:bg-amber-700 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
            >
              Reconciliation
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setRequestMenuOpen((previous) => !previous)}
                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
              >
                Requests
              </button>

              {requestMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestMenuOpen(false);
                      navigate("/hrm/employe-dashboard/leave-requests");
                    }}
                    className="w-full px-5 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                  >
                    Leave Requests
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestMenuOpen(false);
                      navigate("/hrm/employe-dashboard/overtime-requests");
                    }}
                    className="w-full px-5 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                  >
                    Over-Time Requests
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestMenuOpen(false);
                      navigate("/hrm/employe-dashboard/advance-requests");
                    }}
                    className="w-full px-5 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                  >
                    Advance Requests
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestMenuOpen(false);
                      navigate("/hrm/employe-dashboard/loan-requests");
                    }}
                    className="w-full px-5 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                  >
                    Loan Requests
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave + New Employees */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Leave Requests */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Leave Requests
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Pending employee leave requests
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/hrm/employe-dashboard/leave-requests")}
              className="text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="overflow-auto custom-scrollbar max-h-[390px]">
            <table className="w-full min-w-[750px]">
              <thead className="bg-gray-800/70 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    S No.
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Employee
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Duration
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Type
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {leaveRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/40">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.id}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 font-medium">
                      {item.employeeName}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex bg-amber-500/15 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-md text-xs">
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                        {item.duration}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.leaveType}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleView(item)}
                          className="w-8 h-8 rounded-lg text-indigo-400 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white flex items-center justify-center cursor-pointer"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(item)}
                          className="w-8 h-8 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center cursor-pointer"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReject(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Employees */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                New Employees to Join
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Employees joined within the last 3 months
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/hrm/employees")}
              className="text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="max-h-[390px] overflow-auto custom-scrollbar">
            {employeeLoading ? (
              <div className="h-52 flex items-center justify-center">
                <Loader2 size={26} className="animate-spin text-indigo-500" />
              </div>
            ) : newEmployees.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center px-5">
                <p className="text-gray-500 text-sm">No new employees</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {newEmployees.map((employee) => (
                  <div
                    key={employee.slug || employee.id}
                    className="p-4 hover:bg-gray-800/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white text-sm font-medium">
                          {getEmployeeName(employee)}
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                          {getEmployeeId(employee)}
                        </p>
                      </div>

                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-md whitespace-nowrap">
                        {formatDate(employee.joiningDate)}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs mt-3">
                      {getDepartment(employee)}

                      {getDesignation(employee) !== "-"
                        ? ` • ${getDesignation(employee)}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Today's Attendance
            </h2>

            <p className="text-gray-500 text-xs mt-1">{formatDate(today)}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/hrm/attendance-management")}
            className="text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  S No.
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Employee Id
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Employee Name
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Department
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  In/Out Time
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {attendanceLoading ? (
                <tr>
                  <td colSpan={6} className="py-14">
                    <div className="flex justify-center">
                      <Loader2
                        size={26}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : todayAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-gray-500">
                    No attendance marked today
                  </td>
                </tr>
              ) : (
                todayAttendance.map((item, index) => {
                  const employee = item.employee || item;

                  return (
                    <tr
                      key={item.slug || employee.slug || index}
                      className="hover:bg-gray-800/40"
                    >
                      <td className="px-4 py-3 text-center text-sm text-gray-400">
                        {index + 1}.
                      </td>

                      <td className="px-4 py-3 text-center text-sm text-gray-300">
                        {getEmployeeId(employee)}
                      </td>

                      <td className="px-4 py-3 text-center text-sm text-gray-200 font-medium">
                        {getEmployeeName(employee)}
                      </td>

                      <td className="px-4 py-3 text-center text-sm text-gray-400">
                        {getDepartment(employee)}

                        {getDesignation(employee) !== "-"
                          ? ` (${getDesignation(employee)})`
                          : ""}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {item.inTime ? (
                            <span className="bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                              {formatTime(item.inTime)}
                            </span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}

                          {item.outTime ? (
                            <span className="bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                              {formatTime(item.outTime)}
                            </span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex border px-2.5 py-1 rounded-md text-xs font-medium ${getAttendanceStatusClass(
                            item.attendanceStatus,
                          )}`}
                        >
                          {item.attendanceStatus || "NOT MARKED"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
