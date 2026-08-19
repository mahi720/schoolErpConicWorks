import React, { useMemo, useState } from "react";
import { ArrowLeft, Loader2, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesAttendanceBriefReport = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const [month, setMonth] = useState("August");
  const [year, setYear] = useState(String(currentYear));
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

  const departments = ["TEACHING", "NON TEACHING"];

  const designations = [
    "PRINCIPAL",
    "PGT",
    "TGT",
    "PRT",
    "P E TEACHER",
    "SECOND DIVISION CLERK",
    "JR. OFFICE ASSISTANT",
    "ATTENDER",
    "AYAH",
    "NURSERY TEACHER",
  ];

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

  const attendanceData = [
    {
      id: 1,
      slug: "employee-1",
      employeeName: "RESHMA R P",
      employeeId: "1420",
      department: "TEACHING",
      designation: "PRT",
      present: 0,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0,
      salaryClaimedDays: 5,
    },
    {
      id: 2,
      slug: "employee-2",
      employeeName: "PRAMILA NAIR T",
      employeeId: "16251",
      department: "NON TEACHING",
      designation: "SECOND DIVISION CLERK",
      present: 0,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0,
      salaryClaimedDays: 5,
    },
    {
      id: 3,
      slug: "employee-3",
      employeeName: "AQUILA BEGUM MD",
      employeeId: "77118",
      department: "NON TEACHING",
      designation: "JR. OFFICE ASSISTANT",
      present: 0,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0,
      salaryClaimedDays: 5,
    },
    {
      id: 4,
      slug: "employee-4",
      employeeName: "PADMAJA P",
      employeeId: "1417",
      department: "TEACHING",
      designation: "PRT",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
    {
      id: 5,
      slug: "employee-5",
      employeeName: "IMPANA K",
      employeeId: "1414",
      department: "TEACHING",
      designation: "P E TEACHER",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
    {
      id: 6,
      slug: "employee-6",
      employeeName: "SUDHA KUMARI",
      employeeId: "1413",
      department: "TEACHING",
      designation: "PGT",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
    {
      id: 7,
      slug: "employee-7",
      employeeName: "S CHAITHANYA SIROMANI",
      employeeId: "1411",
      department: "TEACHING",
      designation: "TGT",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 1,
      deductions: 0.5,
      salaryClaimedDays: 6.5,
    },
    {
      id: 8,
      slug: "employee-8",
      employeeName: "MATHINA BEE K",
      employeeId: "1408",
      department: "NON TEACHING",
      designation: "ATTENDER",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
    {
      id: 9,
      slug: "employee-9",
      employeeName: "JOYCE M",
      employeeId: "1383",
      department: "NON TEACHING",
      designation: "AYAH",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
    {
      id: 10,
      slug: "employee-10",
      employeeName: "KAVITHA A",
      employeeId: "1382",
      department: "TEACHING",
      designation: "NURSERY TEACHER",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
    {
      id: 11,
      slug: "employee-11",
      employeeName: "MAMATHA G",
      employeeId: "1381",
      department: "TEACHING",
      designation: "NURSERY TEACHER",
      present: 0,
      holiday: 5,
      leaveSanctioned: 1,
      deductions: 0,
      salaryClaimedDays: 6,
    },
    {
      id: 12,
      slug: "employee-12",
      employeeName: "POONAM SHRIVASTAVA",
      employeeId: "1380",
      department: "TEACHING",
      designation: "TGT",
      present: 0.5,
      holiday: 5,
      leaveSanctioned: 0,
      deductions: 0.5,
      salaryClaimedDays: 5.5,
    },
  ];

  const filteredData = useMemo(() => {
    return attendanceData.filter((item) => {
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

  const handleGo = async () => {
    try {
      setLoading(true);

      const payload = {
        month: months.indexOf(month) + 1,
        year: Number(year),
      };

      console.log("Attendance Month Filter", payload);

      // Yahan month/year attendance brief report API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const payload = {
        month: months.indexOf(month) + 1,
        year: Number(year),

        department: filters.department || undefined,

        designation: filters.designation || undefined,

        employeeSlug: filters.employee || undefined,
      };

      console.log("Attendance Brief Report Filters", payload);

      // Yahan filtered brief attendance API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedMonthNumber = String(months.indexOf(month) + 1).padStart(
    2,
    "0",
  );

  const inputClass =
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
                Employees Attendance Sheet
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View monthly employee attendance summary
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-3">
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

            <button
              type="button"
              onClick={handlePrint}
              className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center justify-center cursor-pointer"
              title="Print"
            >
              <Printer size={18} />
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
              className="h-[42px] bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-gray-200 text-sm font-medium mt-1">
              <span className="text-gray-500 text-xs">Month - </span>{" "}
              {selectedMonthNumber}/{year}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">
                Attendance Brief Report
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Total Employees: {filteredData.length}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table className="w-full min-w-[1350px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  SNo.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[260px]">
                  Employee
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[170px]">
                  Department
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[220px]">
                  Designation
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Present
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Holiday
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Leave Sanctioned
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 min-w-[280px]">
                  Deductions
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Late + ABS + Before / Not Out Punched
                  </span>
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 min-w-[190px]">
                  Salary To Be Claimed For
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16">
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
                  <td colSpan={8} className="py-14 text-center text-gray-500">
                    No attendance summary records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.slug}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {index + 1}.
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-semibold">
                        {item.employeeName} ({item.employeeId})
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.department}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.designation}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-10 justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-400">
                        {item.present}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-10 justify-center rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-400">
                        {item.holiday}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-10 justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        {item.leaveSanctioned}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-10 justify-center rounded-md border px-2.5 py-1 text-xs font-medium ${
                          Number(item.deductions) > 0
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                        }`}
                      >
                        {item.deductions}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-14 justify-center rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
                        {item.salaryClaimedDays}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>{" "}
            employees
          </p>

          <p className="text-xs text-gray-500">
            Attendance Month:{" "}
            <span className="text-gray-300 font-medium">
              {selectedMonthNumber}/{year}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeesAttendanceBriefReport;
