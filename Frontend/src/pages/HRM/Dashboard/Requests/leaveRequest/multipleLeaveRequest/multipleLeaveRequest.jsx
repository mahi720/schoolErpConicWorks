import React, { useEffect, useMemo, useState } from "react";

import { ArrowLeft, Loader2, Plus, Search, X } from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../../../../store/hrm/employee/employeeStore";

import { useLeaveTypeStore } from "../../../../../../store/hrm/settings/leaveType/leaveTypeStore";

import { useEmployeeLeaveRequestStore } from "../../../../../../store/hrm/request/leaveRequest/employeeLeaveRequestStore";

import {
  buildBulkCreateLeaveRequestPayload,
  bulkCreateEmployeeLeaveRequestSchema,
} from "../../../../../../validations/hrm/request/leaveRequest/employeeLeaveRequestValidation";

const initialForm = {
  subject: "",
  leaveCategory: "",
  leaveType: "",
  description: "",
  fromDate: "",
  toDate: "",
};

const initialFilters = {
  department: "",
  designation: "",
  employee: "",
};

const CreateMultipleEmployeesLeave = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    ...initialFilters,
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [openLeaveModal, setOpenLeaveModal] = useState(false);

  const [form, setForm] = useState({
    ...initialForm,
  });

  const {
    employees,
    loading: employeeLoading,
    fetchEmployees,
  } = useEmployeeStore();

  const {
    leaveTypes = [],
    loading: leaveTypeLoading,
    fetchLeaveTypes,
  } = useLeaveTypeStore();

  const { submitLoading, bulkCreateLeaveRequests } =
    useEmployeeLeaveRequestStore();

  useEffect(() => {
    Promise.all([
      fetchEmployees(),

      fetchLeaveTypes({
        status: "active",
      }),
    ]);
  }, [fetchEmployees, fetchLeaveTypes]);

  const loading = employeeLoading || leaveTypeLoading;

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

  const getEmployeeName = (employee) => {
    return employee.fullName || employee.employeeName || employee.name || "-";
  };

  const getEmployeeId = (employee) => {
    return (
      employee.employeeId || employee.employeeCode || employee.empId || "-"
    );
  };

  const getEmployeeCode = (employee) => {
    return employee.employeeCode || employee.employeeId || "-";
  };

  const getDepartment = (employee) => {
    return (
      employee.department?.departmentName ||
      employee.department?.name ||
      employee.departmentName ||
      ""
    );
  };

  const getDesignation = (employee) => {
    return (
      employee.designation?.designationName ||
      employee.designation?.name ||
      employee.designationName ||
      ""
    );
  };

  const activeEmployees = useMemo(() => {
    return employeeList.filter(
      (employee) =>
        employee.isActive !== false && employee.isTransferred !== true,
    );
  }, [employeeList]);

  const departmentOptions = useMemo(() => {
    return [
      ...new Set(
        activeEmployees
          .map((employee) => getDepartment(employee))
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [activeEmployees]);

  const designationOptions = useMemo(() => {
    return [
      ...new Set(
        activeEmployees
          .map((employee) => getDesignation(employee))
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [activeEmployees]);

  const employeeOptions = useMemo(() => {
    return activeEmployees
      .map((employee) => ({
        value: employee.slug,

        label: getEmployeeName(employee),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [activeEmployees]);

  const leaveTypeOptions = useMemo(() => {
    return (leaveTypes || [])
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        value: item.slug,

        label: item.leaveType || item.name || item.title || "-",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [leaveTypes]);

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return activeEmployees.filter((employee) => {
      const employeeName = getEmployeeName(employee);

      const employeeId = getEmployeeId(employee);

      const employeeCode = getEmployeeCode(employee);

      const department = getDepartment(employee);

      const designation = getDesignation(employee);

      const matchesSearch =
        !keyword ||
        employeeName.toLowerCase().includes(keyword) ||
        String(employeeId).toLowerCase().includes(keyword) ||
        String(employeeCode).toLowerCase().includes(keyword);

      const matchesDepartment =
        !filters.department || department === filters.department;

      const matchesDesignation =
        !filters.designation || designation === filters.designation;

      const matchesEmployee =
        !filters.employee || employee.slug === filters.employee;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesEmployee
      );
    });
  }, [activeEmployees, search, filters]);

  const isMultiDay = form.leaveCategory === "MULTI_DAY";

  const allSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((employee) =>
      selectedEmployees.includes(employee.slug),
    );

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,

      [field]: value,
    }));

    if (field === "department") {
      setFilters((previous) => ({
        ...previous,

        department: value,

        designation: "",

        employee: "",
      }));
    }

    if (field === "designation") {
      setFilters((previous) => ({
        ...previous,

        designation: value,

        employee: "",
      }));
    }
  };

  const handleClearFilter = () => {
    setSearch("");

    setFilters({
      ...initialFilters,
    });
  };

  const handleSelectAll = () => {
    const visibleSlugs = filteredEmployees.map((employee) => employee.slug);

    if (allSelected) {
      setSelectedEmployees((previous) =>
        previous.filter((slug) => !visibleSlugs.includes(slug)),
      );

      return;
    }

    setSelectedEmployees((previous) => [
      ...new Set([...previous, ...visibleSlugs]),
    ]);
  };

  const handleSelectEmployee = (slug) => {
    setSelectedEmployees((previous) => {
      if (previous.includes(slug)) {
        return previous.filter((item) => item !== slug);
      }

      return [...previous, slug];
    });
  };

  const handleOpenLeaveModal = () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");

      return;
    }

    setForm({
      ...initialForm,
    });

    setOpenLeaveModal(true);
  };

  const handleCloseLeaveModal = () => {
    if (submitLoading) {
      return;
    }

    setOpenLeaveModal(false);

    setForm({
      ...initialForm,
    });
  };

  const handleChange = (field, value) => {
    setForm((previous) => {
      if (field === "leaveCategory" && value !== "MULTI_DAY") {
        return {
          ...previous,

          leaveCategory: value,

          toDate: "",
        };
      }

      if (
        field === "fromDate" &&
        previous.toDate &&
        new Date(previous.toDate) < new Date(value)
      ) {
        return {
          ...previous,

          fromDate: value,

          toDate: "",
        };
      }

      return {
        ...previous,

        [field]: value,
      };
    });
  };

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");

      return;
    }

    const payload = buildBulkCreateLeaveRequestPayload({
      form,

      employeeSlugs: selectedEmployees,
    });

    const validation = bulkCreateEmployeeLeaveRequestSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid leave details",
      );

      return;
    }

    const success = await bulkCreateLeaveRequests(validation.data);

    if (!success) {
      return;
    }

    setOpenLeaveModal(false);

    setForm({
      ...initialForm,
    });

    setSelectedEmployees([]);
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

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
                Create Multiple Employees Leave
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Select multiple employees and create leave requests together
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
              disabled={employeeLoading}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Filter
            </button>

            <button
              type="button"
              onClick={handleOpenLeaveModal}
              disabled={selectedEmployees.length === 0 || employeeLoading}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus size={16} />
              Request for Leave
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Department
            </label>

            <select
              value={filters.department}
              onChange={(event) =>
                handleFilterChange("department", event.target.value)
              }
              disabled={employeeLoading}
              className={inputClass}
            >
              <option value="">Select Department</option>

              {departmentOptions.map((item) => (
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
              disabled={employeeLoading}
              className={inputClass}
            >
              <option value="">Select Designation</option>

              {designationOptions.map((item) => (
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
              disabled={employeeLoading}
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
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-semibold">Employee List</h2>

            <p className="text-gray-500 text-sm mt-1">
              Select employees to create leave
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <p className="text-gray-400 text-sm">
                Selected:{" "}
                <span className="text-white font-semibold">
                  {selectedEmployees.length}
                </span>
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <p className="text-gray-400 text-sm">
                Total:{" "}
                <span className="text-white font-semibold">
                  {filteredEmployees.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-330px)] custom-scrollbar">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    disabled={employeeLoading || filteredEmployees.length === 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  Sr No
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee Id/Code
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Department
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Designation
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {employeeLoading ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />

                      <p className="text-gray-500 text-sm">
                        Loading employees...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((item, index) => {
                  const employeeName = getEmployeeName(item);

                  const employeeId = getEmployeeId(item);

                  const employeeCode = getEmployeeCode(item);

                  const department = getDepartment(item);

                  const designation = getDesignation(item);

                  return (
                    <tr
                      key={item.slug}
                      className={`transition-colors ${
                        selectedEmployees.includes(item.slug)
                          ? "bg-indigo-500/5"
                          : "hover:bg-gray-800/40"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(item.slug)}
                          onChange={() => handleSelectEmployee(item.slug)}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-200 font-medium">
                          {employeeName}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        {employeeId}

                        {employeeCode !== "-" && employeeCode !== employeeId
                          ? ` (${employeeCode})`
                          : ""}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400">
                        {department || "-"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400">
                        {designation || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Request For Leave
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Create leave for {selectedEmployees.length} selected employee
                  {selectedEmployees.length > 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseLeaveModal}
                disabled={submitLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-x-auto overflow-y-auto custom-scrollbar">
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      Subject
                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      type="text"
                      value={form.subject}
                      onChange={(event) =>
                        handleChange("subject", event.target.value)
                      }
                      placeholder="Enter subject"
                      maxLength={150}
                      disabled={submitLoading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Leave Category
                      <span className="text-red-500"> *</span>
                    </label>

                    <select
                      value={form.leaveCategory}
                      onChange={(event) =>
                        handleChange("leaveCategory", event.target.value)
                      }
                      disabled={submitLoading}
                      className={inputClass}
                    >
                      <option value="">Select Leave Category</option>

                      <option value="FULL_DAY">Full Day</option>

                      <option value="HALF_DAY">Half Day</option>

                      <option value="MULTI_DAY">Multi Day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Leave Type
                      <span className="text-red-500"> *</span>
                    </label>

                    <select
                      value={form.leaveType}
                      onChange={(event) =>
                        handleChange("leaveType", event.target.value)
                      }
                      disabled={submitLoading || leaveTypeLoading}
                      className={inputClass}
                    >
                      <option value="">Select Leave Type</option>

                      {leaveTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      Description
                      <span className="text-red-500"> *</span>
                    </label>

                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        handleChange("description", event.target.value)
                      }
                      placeholder="Write leave description..."
                      rows={3}
                      maxLength={500}
                      disabled={submitLoading}
                      className={`${inputClass} resize-none`}
                    />

                    <div className="text-right text-xs text-gray-500 mt-1">
                      {form.description.length}
                      /500
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {isMultiDay ? "From Date" : "Date"}

                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      type="date"
                      value={form.fromDate}
                      onChange={(event) =>
                        handleChange("fromDate", event.target.value)
                      }
                      disabled={submitLoading}
                      className={inputClass}
                    />
                  </div>

                  {isMultiDay ? (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        To Date
                        <span className="text-red-500"> *</span>
                      </label>

                      <input
                        type="date"
                        value={form.toDate}
                        min={form.fromDate || undefined}
                        onChange={(event) =>
                          handleChange("toDate", event.target.value)
                        }
                        disabled={submitLoading}
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    <div className="flex items-end">
                      <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2.5">
                        <p className="text-indigo-300 text-xs">
                          {form.leaveCategory === "HALF_DAY"
                            ? "Half Day leave will count as 0.5 day."
                            : "Single day leave will count as 1 day."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">
                        Selected Employees
                      </p>

                      <p className="text-white text-lg font-semibold mt-1">
                        {selectedEmployees.length}
                      </p>
                    </div>

                    <p className="text-gray-500 text-xs">
                      Same leave details will be applied to all selected
                      employees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseLeaveModal}
                disabled={submitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading || selectedEmployees.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}

                {submitLoading
                  ? "Applying..."
                  : `Apply to ${selectedEmployees.length} Employee${
                      selectedEmployees.length > 1 ? "s" : ""
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMultipleEmployeesLeave;
