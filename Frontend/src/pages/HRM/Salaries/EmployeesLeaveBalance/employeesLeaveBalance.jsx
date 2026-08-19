import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesLeaveBalance = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    department: "",
    designation: "",
    employee: "",
  });

  const employeeData = [
    {
      id: 1,
      slug: "employee-1",
      employeeName: "DEVENDRA SINGH",
      employeeId: "812308",
      employeeCode: "812308",
      department: "TEACHING",
      designation: "PRINCIPAL",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 0,
        CL: 5,
      },
    },
    {
      id: 2,
      slug: "employee-2",
      employeeName: "SUNITA K",
      employeeId: "811270",
      employeeCode: "811270",
      department: "TEACHING",
      designation: "PGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 1,
        CPL: 0,
        EL: 98,
        CL: 4.5,
      },
    },
    {
      id: 3,
      slug: "employee-3",
      employeeName: "RICHA KAUL",
      employeeId: "811194",
      employeeCode: "811194",
      department: "TEACHING",
      designation: "PGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 91,
        CL: 8,
      },
    },
    {
      id: 4,
      slug: "employee-4",
      employeeName: "SAVAREENA ILANGO",
      employeeId: "811193",
      employeeCode: "811193",
      department: "TEACHING",
      designation: "PGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 148,
        CL: 3,
      },
    },
    {
      id: 5,
      slug: "employee-5",
      employeeName: "KAJARI HAZRA",
      employeeId: "811195",
      employeeCode: "811195",
      department: "TEACHING",
      designation: "PGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 39,
        CL: 4,
      },
    },
    {
      id: 6,
      slug: "employee-6",
      employeeName: "SOWMINI RAMESH",
      employeeId: "812022",
      employeeCode: "812022",
      department: "TEACHING",
      designation: "PGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 145.5,
        CL: 6,
      },
    },
    {
      id: 7,
      slug: "employee-7",
      employeeName: "SUDHA KUMARI",
      employeeId: "1413",
      employeeCode: "1413",
      department: "TEACHING",
      designation: "PGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 0,
        CL: 2,
      },
    },
    {
      id: 8,
      slug: "employee-8",
      employeeName: "PAMILA J S",
      employeeId: "811004",
      employeeCode: "811004",
      department: "TEACHING",
      designation: "SR. TGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 153,
        CL: 0.5,
      },
    },
    {
      id: 9,
      slug: "employee-9",
      employeeName: "K M RAJSHIKHA SINGH",
      employeeId: "1351",
      employeeCode: "1351",
      department: "TEACHING",
      designation: "TGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 0,
        CL: 1,
      },
    },
    {
      id: 10,
      slug: "employee-10",
      employeeName: "POONAM SHRIVASTAVA",
      employeeId: "1380",
      employeeCode: "1380",
      department: "TEACHING",
      designation: "TGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 0,
        CL: 2.5,
      },
    },
    {
      id: 11,
      slug: "employee-11",
      employeeName: "S CHAITHANYA SIROMANI",
      employeeId: "1411",
      employeeCode: "1411",
      department: "TEACHING",
      designation: "TGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 0,
        CL: 1.5,
      },
    },
    {
      id: 12,
      slug: "employee-12",
      employeeName: "ADITI SHOME",
      employeeId: "811271",
      employeeCode: "811271",
      department: "TEACHING",
      designation: "TGT",
      balances: {
        ML: 0,
        LWP: 0,
        OOD: 0,
        CPL: 0,
        EL: 65,
        CL: 4,
      },
    },
  ];

  const departments = ["TEACHING", "NON-TEACHING"];

  const designations = ["PRINCIPAL", "PGT", "SR. TGT", "TGT", "PRT"];

  const employeeOptions = employeeData.map((item) => ({
    value: item.slug,
    label: item.employeeName,
  }));

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return employeeData.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.employeeName.toLowerCase().includes(keyword) ||
        item.employeeId.toLowerCase().includes(keyword) ||
        item.employeeCode.toLowerCase().includes(keyword);

      const matchesDepartment =
        !filters.department || item.department === filters.department;

      const matchesDesignation =
        !filters.designation || item.designation === filters.designation;

      const matchesEmployee =
        !filters.employee || item.slug === filters.employee;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesEmployee
      );
    });
  }, [search, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleClearFilter = () => {
    setSearch("");

    setFilters({
      department: "",
      designation: "",
      employee: "",
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const payload = {
        search: search.trim() || undefined,
        department: filters.department || undefined,
        designation: filters.designation || undefined,
        employeeSlug: filters.employee || undefined,
      };

      console.log("Leave Balance Filters", payload);

      // Yahan leave balance fetch API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = () => {
    console.log("Export leave balance PDF");
  };

  const handleExcel = () => {
    console.log("Export leave balance Excel");
  };

  const handleUpload = () => {
    console.log("Upload leave balance");
  };

  const handleDetailedLeaveBalance = () => {
    console.log("Open detailed leave balance");
    navigate("/hrm/salaries/employee-detailed-leave-balance");
  };

  const handleUpdate = (item) => {
    console.log("Update leave balance", item);

    // Yahan update leave balance modal open karna hai.
  };

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
                Employees Leave Balance
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View and manage employee leave balances
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

            <button
              type="button"
              onClick={handleClearFilter}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer whitespace-nowrap"
            >
              Clear Filter
            </button>

            <button
              type="button"
              onClick={handleDetailedLeaveBalance}
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer whitespace-nowrap"
            >
              Detailed Leave Balance
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Department
            </label>

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
            <label className="block text-gray-300 text-sm mb-2">
              Designation
            </label>

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
            <label className="block text-gray-300 text-sm mb-2">
              Employee Name
            </label>

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
            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Search"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handlePdf}
            className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
          >
            <FileText size={16} />
            PDF
          </button>

          <button
            type="button"
            onClick={handleExcel}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            Excel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold">
              Employee Leave Balance List
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Total Employees: {filteredData.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
          <table className="w-full min-w-[1350px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  Sr No
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[240px]">
                  Employee Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[190px]">
                  Employee Id/Code
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[280px]">
                  Department/Designation
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  ML
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  LWP
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  OOD
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  CPL
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  EL
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  CL
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 w-24">
                  Update
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-16">
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
                  <td colSpan={11} className="py-14 text-center text-gray-500">
                    No leave balance records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.slug}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-indigo-400 font-medium">
                        {item.employeeName}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.employeeId} ({item.employeeCode})
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.department} ({item.designation})
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.balances.ML}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.balances.LWP}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.balances.OOD}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.balances.CPL}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.balances.EL}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.balances.CL}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item)}
                          className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer"
                          title="Update Leave Balance"
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

        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>{" "}
            employee leave balance records
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeesLeaveBalance;
