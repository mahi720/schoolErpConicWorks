import React, { useMemo, useState } from "react";
import { ArrowLeft, FileText, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesAttendanceDetails = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("July");
  const [year, setYear] = useState("2025");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    department: "",
    designation: "",
    employee: "",
  });

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

  const years = Array.from({ length: 8 }, (_, index) =>
    String(currentYear - 4 + index),
  );

  const departments = ["TEACHING", "NON-TEACHING"];

  const designations = ["PRINCIPAL", "PGT", "SR. TGT", "TGT", "PRT"];

  const employeeOptions = [
    {
      value: "employee-1",
      label: "RESHMA R P",
    },
    {
      value: "employee-2",
      label: "PRAMILA NAIR T",
    },
    {
      value: "employee-3",
      label: "AQUILA BEGUM MD",
    },
    {
      value: "employee-4",
      label: "PADMAJA P",
    },
    {
      value: "employee-5",
      label: "IMPANA K",
    },
  ];

  const employeeAttendanceData = [
    {
      id: 1,
      slug: "employee-1",
      employeeName: "RESHMA R P",
      employeeId: "1420",
      employeeCode: "1420",
      department: "TEACHING",
      designation: "PRT",

      summary: {
        present: 0,
        holidays: 7,
        leaveSanctioned: 0,
        deduction: 0,
        absent: 23,
        salaryClaimedDays: 7,
      },

      attendance: {
        "2025-07-21": {
          status: "ABSENT",
        },

        "2025-07-22": {
          dayType: "SUNDAY",
        },

        "2025-07-23": {
          status: "ABSENT",
        },

        "2025-07-24": {
          status: "ABSENT",
        },

        "2025-07-25": {
          status: "ABSENT",
        },

        "2025-07-26": {
          status: "ABSENT",
        },

        "2025-07-27": {
          status: "ABSENT",
        },

        "2025-07-28": {
          dayType: "HOLIDAY",
          holidayCode: "HY",
        },

        "2025-07-29": {
          dayType: "SUNDAY",
        },

        "2025-07-30": {
          status: "ABSENT",
        },

        "2025-07-31": {
          status: "ABSENT",
        },

        "2025-08-01": {
          status: "ABSENT",
        },
      },
    },

    {
      id: 2,
      slug: "employee-2",
      employeeName: "PRAMILA NAIR T",
      employeeId: "16251",
      employeeCode: "16251",
      department: "TEACHING",
      designation: "PRT",

      summary: {
        present: 0,
        holidays: 6,
        leaveSanctioned: 0,
        deduction: 0,
        absent: 24,
        salaryClaimedDays: 6,
      },

      attendance: {
        "2025-07-21": {
          status: "ABSENT",
        },

        "2025-07-22": {
          dayType: "SUNDAY",
        },

        "2025-07-23": {
          status: "ABSENT",
        },

        "2025-07-24": {
          status: "ABSENT",
        },

        "2025-07-25": {
          status: "ABSENT",
        },

        "2025-07-26": {
          status: "ABSENT",
        },

        "2025-07-27": {
          status: "ABSENT",
        },

        "2025-07-28": {
          dayType: "HOLIDAY",
          holidayCode: "HY",
        },

        "2025-07-29": {
          dayType: "SUNDAY",
        },
      },
    },

    {
      id: 3,
      slug: "employee-3",
      employeeName: "DEEPA R V",
      employeeId: "202129",
      employeeCode: "202129",
      department: "TEACHING",
      designation: "PRT",

      summary: {
        present: 18,
        holidays: 7,
        leaveSanctioned: 0,
        deduction: 0,
        absent: 5,
        salaryClaimedDays: 25,
      },

      attendance: {
        "2025-07-21": {
          inTime: "07:31 AM",
          outTime: "03:26 PM",
          status: "PRESENT",
          isLate: false,
        },

        "2025-07-22": {
          dayType: "SUNDAY",
        },

        "2025-07-23": {
          inTime: "07:04 AM",
          outTime: "03:26 PM",
          status: "PRESENT",
        },

        "2025-07-24": {
          inTime: "07:22 AM",
          outTime: "03:20 PM",
          status: "PRESENT",
        },

        "2025-07-25": {
          inTime: "07:14 AM",
          outTime: "03:49 PM",
          status: "PRESENT",
        },

        "2025-07-26": {
          inTime: "07:20 AM",
          outTime: "03:23 PM",
          status: "PRESENT",
        },

        "2025-07-27": {
          inTime: "07:11 AM",
          outTime: "03:49 PM",
          status: "PRESENT",
        },

        "2025-07-28": {
          dayType: "HOLIDAY",
          holidayCode: "HY",
        },

        "2025-07-29": {
          dayType: "SUNDAY",
        },

        "2025-07-30": {
          inTime: "07:36 AM",
          outTime: "03:53 PM",
          status: "PRESENT",
        },
      },
    },

    {
      id: 4,
      slug: "employee-4",
      employeeName: "JASMINE HARTLEY PEREIRA",
      employeeId: "812291",
      employeeCode: "812291",
      department: "TEACHING",
      designation: "PRT",

      summary: {
        present: 20,
        holidays: 7,
        leaveSanctioned: 1,
        deduction: 0,
        absent: 2,
        salaryClaimedDays: 28,
      },

      attendance: {
        "2025-07-21": {
          inTime: "07:33 AM",
          outTime: "03:33 PM",
          status: "PRESENT",
          isLate: false,
        },

        "2025-07-22": {
          dayType: "SUNDAY",
        },

        "2025-07-23": {
          inTime: "07:34 AM",
          outTime: "03:38 PM",
          status: "PRESENT",
        },

        "2025-07-24": {
          inTime: "07:33 AM",
          outTime: "04:08 PM",
          status: "PRESENT",
        },

        "2025-07-25": {
          inTime: "07:46 AM",
          outTime: "03:33 PM",
          status: "PRESENT",
          isLate: true,
        },

        "2025-07-26": {
          inTime: "07:34 AM",
          outTime: "03:28 PM",
          status: "PRESENT",
        },

        "2025-07-27": {
          inTime: "07:35 AM",
          outTime: "03:18 PM",
          status: "PRESENT",
        },

        "2025-07-28": {
          dayType: "HOLIDAY",
          holidayCode: "HY",
        },

        "2025-07-29": {
          dayType: "SUNDAY",
        },

        "2025-07-30": {
          inTime: "07:39 AM",
          outTime: "03:48 PM",
          status: "PRESENT",
          isLate: true,
        },
      },
    },

    {
      id: 5,
      slug: "employee-5",
      employeeName: "RANJINI VARMA K",
      employeeId: "812290",
      employeeCode: "812290",
      department: "TEACHING",
      designation: "PRT",

      summary: {
        present: 19,
        holidays: 7,
        leaveSanctioned: 1,
        deduction: 0,
        absent: 3,
        salaryClaimedDays: 27,
      },

      attendance: {
        "2025-07-21": {
          inTime: "07:33 AM",
          outTime: "11:54 AM",
          status: "PRESENT",
        },

        "2025-07-22": {
          dayType: "SUNDAY",
        },

        "2025-07-23": {
          inTime: "07:29 AM",
          outTime: "03:31 PM",
          status: "PRESENT",
        },

        "2025-07-24": {
          inTime: "07:35 AM",
          outTime: "03:22 PM",
          status: "PRESENT",
        },

        "2025-07-25": {
          inTime: "07:31 AM",
          outTime: "03:20 PM",
          status: "PRESENT",
        },

        "2025-07-26": {
          inTime: "07:32 AM",
          outTime: "03:29 PM",
          status: "PRESENT",
        },

        "2025-07-27": {
          inTime: "07:32 AM",
          outTime: "03:22 PM",
          status: "PRESENT",
        },

        "2025-07-28": {
          dayType: "HOLIDAY",
          holidayCode: "HY",
        },

        "2025-07-29": {
          dayType: "SUNDAY",
        },

        "2025-08-08": {
          leaveCode: "EL",
          status: "LEAVE",
        },
      },
    },
  ];

  const days = useMemo(() => {
    const monthIndex = months.indexOf(month);

    const totalDays = new Date(Number(year), monthIndex + 1, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;

      const date = new Date(Number(year), monthIndex, day);

      const dateKey = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0",
      )}-${String(day).padStart(2, "0")}`;

      return {
        day,
        date,
        dateKey,
      };
    });
  }, [month, year]);

  const filteredData = useMemo(() => {
    return employeeAttendanceData.filter((item) => {
      const matchesDepartment =
        !filters.department || item.department === filters.department;

      const matchesDesignation =
        !filters.designation || item.designation === filters.designation;

      const matchesEmployee =
        !filters.employee || item.slug === filters.employee;

      return matchesDepartment && matchesDesignation && matchesEmployee;
    });
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const payload = {
        department: filters.department || undefined,

        designation: filters.designation || undefined,

        employeeSlug: filters.employee || undefined,

        month: months.indexOf(month) + 1,

        year: Number(year),
      };

      console.log("Attendance Sheet Filters", payload);

      // Yahan employee attendance sheet API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handleGo = async () => {
    try {
      setLoading(true);

      console.log({
        month: months.indexOf(month) + 1,
        year: Number(year),
      });

      // Yahan month/year wise attendance sheet fetch karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handleBriefReport = () => {
    console.log("Open brief attendance report");
    navigate("/hrm/salaries/attendance-brief-report");
  };

  const selectedMonthNumber = String(months.indexOf(month) + 1).padStart(
    2,
    "0",
  );

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500";

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
                Employees Attendance Sheet
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View employee monthly attendance, punch timings and salary
                attendance summary
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-3">
            <button
              type="button"
              onClick={handleBriefReport}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer"
            >
              Brief Report
            </button>

            <div className="w-40">
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className={inputClass}
              >
                {months.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-36">
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={inputClass}
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
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
            <div>
              <select
                value={filters.department}
                onChange={(event) =>
                  handleFilterChange("department", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Select Department</option>

                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.designation}
                onChange={(event) =>
                  handleFilterChange("designation", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Select Designation</option>

                {designations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.employee}
                onChange={(event) =>
                  handleFilterChange("employee", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Select Employee</option>

                {employeeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="h-[42px] bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Search size={17} />
              )}
              Search
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
            <p className="text-white text-sm font-medium">
              <span className="text-gray-500 text-xs">Month - </span>{" "}
              {selectedMonthNumber}/{year}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table
            className="border-collapse"
            style={{
              minWidth: `${290 + days.length * 90 + 370}px`,
            }}
          >
            <thead className="bg-gray-800 sticky top-0 z-20">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">
                  SNo.
                </th>
                <th className="sticky left-0 z-30 bg-gray-800 min-w-[220px] px-4 py-3 text-left text-xs font-medium text-gray-400 border-r border-gray-700">
                  Employee
                </th>

                {days.map((item) => (
                  <th
                    key={item.dateKey}
                    className="min-w-[90px] px-2 py-3 text-center text-xs font-semibold text-gray-300 border-r border-gray-800"
                  >
                    {String(item.day).padStart(2, "0")}
                  </th>
                ))}

                <th className="min-w-[150px] px-3 py-3 text-left text-xs font-medium text-gray-400">
                  Total Days
                </th>

                <th className="min-w-[130px] px-3 py-3 text-left text-xs font-medium text-gray-400">
                  Deductions
                </th>

                <th className="min-w-[130px] px-3 py-3 text-left text-xs font-medium text-gray-400">
                  Salary Claimed Days
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={days.length + 4} className="py-20">
                    <div className="flex justify-center">
                      <Loader2
                        size={30}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={days.length + 4}
                    className="py-16 text-center text-gray-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredData.map((employee, index) => (
                  <tr key={employee.slug} className="hover:bg-gray-800/30">
                    <td className="px-3 py-3 text-gray-400">{index + 1}.</td>

                    <td className="sticky left-0 z-10 bg-gray-900 border-r border-gray-800 px-4 py-3 align-top">
                      <p className="text-sm text-gray-200 font-semibold max-w-[190px]">
                        {employee.employeeName}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        ({employee.employeeId})
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {employee.employeeCode}
                      </p>
                    </td>

                    {days.map((day) => {
                      const attendance = employee.attendance?.[day.dateKey];

                      return (
                        <td
                          key={day.dateKey}
                          className="border-r border-gray-800/70 px-1.5 py-2 align-top"
                        >
                          <AttendanceDayCell attendance={attendance} />
                        </td>
                      );
                    })}

                    <td className="px-3 py-3 align-top">
                      <div className="space-y-1.5">
                        <SummaryBadge
                          label="Present"
                          value={employee.summary.present}
                          className="bg-indigo-500/20 text-indigo-300"
                        />

                        <SummaryBadge
                          label="Holidays"
                          value={employee.summary.holidays}
                          className="bg-cyan-500/20 text-cyan-300"
                        />

                        <SummaryBadge
                          label="Leave Sanctioned"
                          value={employee.summary.leaveSanctioned}
                          className="bg-rose-500/20 text-rose-300"
                        />
                      </div>
                    </td>

                    <td className="px-3 py-3 align-top">
                      <div className="space-y-1.5">
                        <SummaryBadge
                          label="Deduction"
                          value={employee.summary.deduction}
                          className="bg-amber-500/20 text-amber-300"
                        />

                        <SummaryBadge
                          label="Absent"
                          value={employee.summary.absent}
                          className="bg-emerald-500/20 text-emerald-300"
                        />
                      </div>
                    </td>

                    <td className="px-3 py-3 align-top">
                      <span className="inline-flex bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1 text-xs text-white font-medium whitespace-nowrap">
                        {employee.summary.salaryClaimedDays} Days
                      </span>
                    </td>
                  </tr>
                ))
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
            employees for {month} {year}
          </p>
        </div>
      </div>
    </div>
  );
};

const AttendanceDayCell = ({ attendance }) => {
  if (!attendance) {
    return (
      <div className="min-h-[68px] flex items-center justify-center text-gray-600 text-xs">
        -
      </div>
    );
  }

  if (attendance.dayType === "SUNDAY") {
    return (
      <div className="min-h-[68px] flex justify-center">
        <span className="inline-flex self-start bg-rose-500 text-white rounded-md px-2 py-1 text-[10px] font-semibold">
          S
        </span>
      </div>
    );
  }

  if (attendance.dayType === "HOLIDAY") {
    return (
      <div className="min-h-[68px] flex flex-col items-center justify-center gap-1">
        <span className="text-gray-600 text-xs">-</span>

        <span className="inline-flex bg-cyan-500 text-white rounded-md px-2 py-1 text-[10px] font-semibold">
          {attendance.holidayCode || "HY"}
        </span>
      </div>
    );
  }

  if (attendance.status === "LEAVE") {
    return (
      <div className="min-h-[68px] flex items-center justify-center">
        <span className="inline-flex bg-indigo-600 text-white rounded-md px-2 py-1 text-[10px] font-semibold">
          {attendance.leaveCode || "L"}
        </span>
      </div>
    );
  }

  if (attendance.status === "ABSENT") {
    return (
      <div className="min-h-[68px] flex flex-col items-center justify-center gap-1.5">
        <span className="text-gray-600 text-xs">-</span>

        <span className="inline-flex bg-red-500/20 text-red-400 rounded-md px-2 py-1 text-[10px] font-semibold">
          A
        </span>
      </div>
    );
  }

  if (attendance.status === "PRESENT") {
    return (
      <div className="min-h-[68px] space-y-1 text-center">
        <div>
          <span
            className={`inline-flex rounded-md px-1.5 py-1 text-[10px] font-medium whitespace-nowrap ${
              attendance.isLate
                ? "bg-amber-500 text-gray-950"
                : "bg-indigo-500/20 text-indigo-300"
            }`}
          >
            {attendance.inTime || "-"}
          </span>
        </div>

        <div>
          <span className="inline-flex bg-gray-700 text-gray-200 rounded-md px-1.5 py-1 text-[10px] font-medium whitespace-nowrap">
            {attendance.outTime || "-"}
          </span>
        </div>

        <div>
          <span className="inline-flex bg-emerald-500 text-white rounded-md px-2 py-1 text-[10px] font-semibold">
            P
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[68px] flex items-center justify-center text-gray-600 text-xs">
      -
    </div>
  );
};

const SummaryBadge = ({ label, value, className }) => {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium whitespace-nowrap ${className}`}
    >
      {label} - {value}
    </span>
  );
};

export default EmployeesAttendanceDetails;
