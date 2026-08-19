import React, { useEffect, useMemo, useState } from "react";

import { ArrowRight, Loader2, LockKeyhole, Save } from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useDepartmentStore } from "../../../store/HRM/settings/department/departmentStore";

import { useDesignationStore } from "../../../store/HRM/settings/designation/designationStore";

import { useEmployeePayrollStore } from "../../../store/hrm/salary/employeePayrollStore";

import SalaryLockConfirmModal from "../../../components/HRM/Salary/SalaryLockConfirmModal";

import {
  buildPayrollFilterParams,
  buildSavePayrollPayload,
  payrollFilterSchema,
  payrollPeriodSchema,
  saveEmployeePayrollSchema,
  payrollBulkActionSchema,
} from "../../../validations/hrm/salary/employeePayrollValidation";

const monthOptions = [
  {
    value: "1",
    label: "January",
  },
  {
    value: "2",
    label: "February",
  },
  {
    value: "3",
    label: "March",
  },
  {
    value: "4",
    label: "April",
  },
  {
    value: "5",
    label: "May",
  },
  {
    value: "6",
    label: "June",
  },
  {
    value: "7",
    label: "July",
  },
  {
    value: "8",
    label: "August",
  },
  {
    value: "9",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getCurrentMonth = () => {
  return String(new Date().getMonth() + 1);
};

const formatAmount = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getDepartmentOptionName = (item) => {
  return item?.departmentName || item?.name || "-";
};

const getDesignationOptionName = (item) => {
  return item?.designationName || item?.name || "-";
};

const getEmployeeNumber = (employee) => {
  return employee?.employeeId || employee?.employeeCode || "-";
};

export default function EmployeesSalary() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [selectedYear, setSelectedYear] = useState(String(getCurrentYear()));

  const [appliedSalaryPeriod, setAppliedSalaryPeriod] = useState({
    month: getCurrentMonth(),

    year: String(getCurrentYear()),
  });

  const [filters, setFilters] = useState({
    departmentSlug: "",
    designationSlug: "",
    employeeSlug: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    departmentSlug: "",
    designationSlug: "",
    employeeSlug: "",
  });

  const [lockModalOpen, setLockModalOpen] = useState(false);

  const {
    employees = [],
    summary,

    loading,
    submitLoading,
    lockLoading,

    fetchPayrollEmployees,
    savePayrolls,
    lockPayrolls,
  } = useEmployeePayrollStore();

  const {
    departments = [],
    loading: departmentLoading,
    fetchDepartments,
  } = useDepartmentStore();

  const {
    designations = [],
    loading: designationLoading,
    fetchDesignations,
  } = useDesignationStore();

  const loadPayrollEmployees = async ({
    month = appliedSalaryPeriod.month,

    year = appliedSalaryPeriod.year,

    departmentSlug = appliedFilters.departmentSlug,

    designationSlug = appliedFilters.designationSlug,

    employeeSlug = appliedFilters.employeeSlug,
  } = {}) => {
    const params = buildPayrollFilterParams({
      month,
      year,
      departmentSlug,
      designationSlug,
      employeeSlug,
    });

    const validation = payrollFilterSchema.safeParse(params);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid salary filters",
      );

      return false;
    }

    const success = await fetchPayrollEmployees(validation.data);

    if (success) {
      setSelected([]);
    }

    return success;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchDepartments({
          status: "active",
        }),

        fetchDesignations({
          status: "active",
        }),
      ]);

      await loadPayrollEmployees({
        month: getCurrentMonth(),

        year: String(getCurrentYear()),

        departmentSlug: "",

        designationSlug: "",

        employeeSlug: "",
      });
    };

    loadInitialData();
  }, [fetchDepartments, fetchDesignations, fetchPayrollEmployees]);

  const activeDepartments = useMemo(() => {
    return departments.filter((item) => item?.isActive !== false);
  }, [departments]);

  const filteredDesignations = useMemo(() => {
    return designations.filter((item) => {
      if (item?.isActive === false) {
        return false;
      }

      if (!filters.departmentSlug) {
        return true;
      }

      const departmentSlug =
        item?.departmentSlug || item?.department?.slug || "";

      return departmentSlug === filters.departmentSlug;
    });
  }, [designations, filters.departmentSlug]);

  const employeeOptions = useMemo(() => {
    return employees.filter((employee) => {
      if (
        filters.departmentSlug &&
        employee?.department?.slug !== filters.departmentSlug
      ) {
        return false;
      }

      if (
        filters.designationSlug &&
        employee?.designation?.slug !== filters.designationSlug
      ) {
        return false;
      }

      return true;
    });
  }, [employees, filters.departmentSlug, filters.designationSlug]);

  const selectableEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        !employee.locked && !employee.paid && !employee.salaryStructureMissing,
    );
  }, [employees]);

  const allSelected =
    selectableEmployees.length > 0 &&
    selectableEmployees.every((employee) =>
      selected.includes(employee.employeeSlug),
    );

  const selectedEmployees = useMemo(() => {
    return employees.filter((employee) =>
      selected.includes(employee.employeeSlug),
    );
  }, [employees, selected]);

  const lockModalEmployees = useMemo(() => {
    return selectedEmployees.map((employee) => ({
      slug: employee.employeeSlug,

      fullName: employee.employeeName,

      employeeId: employee.employeeId,

      employeeCode: employee.employeeCode,
    }));
  }, [selectedEmployees]);

  const selectedMonthLabel = useMemo(() => {
    return (
      monthOptions.find(
        (item) => item.value === String(appliedSalaryPeriod.month),
      )?.label || "-"
    );
  }, [appliedSalaryPeriod.month]);

  const yearOptions = useMemo(() => {
    const currentYear = getCurrentYear();

    return Array.from(
      {
        length: 8,
      },
      (_, index) => currentYear - index,
    );
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(selectableEmployees.map((employee) => employee.employeeSlug));

      return;
    }

    setSelected([]);
  };

  const handleSelect = (employee) => {
    if (employee.locked || employee.paid || employee.salaryStructureMissing) {
      return;
    }

    setSelected((previous) => {
      if (previous.includes(employee.employeeSlug)) {
        return previous.filter((slug) => slug !== employee.employeeSlug);
      }

      return [...previous, employee.employeeSlug];
    });
  };

  const handleDepartmentChange = (event) => {
    const value = event.target.value;

    setFilters((previous) => ({
      ...previous,

      departmentSlug: value,

      designationSlug: "",

      employeeSlug: "",
    }));
  };

  const handleDesignationChange = (event) => {
    const value = event.target.value;

    setFilters((previous) => ({
      ...previous,

      designationSlug: value,

      employeeSlug: "",
    }));
  };

  const handleEmployeeChange = (event) => {
    setFilters((previous) => ({
      ...previous,

      employeeSlug: event.target.value,
    }));
  };

  const handleSalaryPeriodGo = async () => {
    const validation = payrollPeriodSchema.safeParse({
      month: selectedMonth,

      year: selectedYear,
    });

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid salary period",
      );

      return;
    }

    const period = {
      month: String(validation.data.month),

      year: String(validation.data.year),
    };

    setAppliedSalaryPeriod(period);

    const success = await loadPayrollEmployees({
      month: period.month,

      year: period.year,

      departmentSlug: appliedFilters.departmentSlug,

      designationSlug: appliedFilters.designationSlug,

      employeeSlug: appliedFilters.employeeSlug,
    });

    if (!success) {
      return;
    }

    setSelected([]);
  };

  const handleSearch = async () => {
    const nextFilters = {
      ...filters,
    };

    const params = buildPayrollFilterParams({
      month: appliedSalaryPeriod.month,

      year: appliedSalaryPeriod.year,

      ...nextFilters,
    });

    const validation = payrollFilterSchema.safeParse(params);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid salary filters",
      );

      return;
    }

    setAppliedFilters(nextFilters);

    const success = await fetchPayrollEmployees(validation.data);

    if (!success) {
      return;
    }

    setSelected([]);
  };

  const handleSave = async () => {
    if (!selected.length) {
      toast.error("Please select at least one employee");

      return;
    }

    const selectedRows = selectedEmployees.filter(
      (employee) =>
        !employee.locked && !employee.paid && !employee.salaryStructureMissing,
    );

    if (!selectedRows.length) {
      toast.error("No employee is available for salary save");

      return;
    }

    const missingStructure = selectedEmployees.find(
      (employee) => employee.salaryStructureMissing,
    );

    if (missingStructure) {
      toast.error(
        `${missingStructure.employeeName} salary structure is not available`,
      );

      return;
    }

    const payload = buildSavePayrollPayload({
      month: appliedSalaryPeriod.month,

      year: appliedSalaryPeriod.year,

      employees: selectedRows.map((employee) => ({
        employeeSlug: employee.employeeSlug,

        claimedSalaryDays: null,

        salaryDaysRemark: null,

        manualItems: [],
      })),
    });

    const validation = saveEmployeePayrollSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid salary data",
      );

      return;
    }

    const result = await savePayrolls(validation.data);

    if (!result?.success) {
      return;
    }

    setSelected([]);

    await loadPayrollEmployees();
  };

  const handleOpenLockModal = () => {
    if (!selected.length) {
      toast.error("Please select at least one employee");

      return;
    }

    const unsavedEmployee = selectedEmployees.find(
      (employee) => !employee.saved || !employee.payrollSlug,
    );

    if (unsavedEmployee) {
      toast.error(
        `${unsavedEmployee.employeeName} salary must be saved before locking`,
      );

      return;
    }

    const lockedEmployee = selectedEmployees.find(
      (employee) => employee.locked,
    );

    if (lockedEmployee) {
      toast.error(`${lockedEmployee.employeeName} salary is already locked`);

      return;
    }

    const paidEmployee = selectedEmployees.find((employee) => employee.paid);

    if (paidEmployee) {
      toast.error(`${paidEmployee.employeeName} salary is already paid`);

      return;
    }

    setLockModalOpen(true);
  };

  const handleConfirmLock = async () => {
    const payrollSlugs = selectedEmployees
      .filter(
        (employee) =>
          employee.saved &&
          employee.payrollSlug &&
          !employee.locked &&
          !employee.paid,
      )
      .map((employee) => employee.payrollSlug);

    const validation = payrollBulkActionSchema.safeParse({
      payrollSlugs,
    });

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please select saved salary records",
      );

      return;
    }

    const result = await lockPayrolls(validation.data.payrollSlugs);

    if (!result?.success) {
      return;
    }

    setLockModalOpen(false);

    setSelected([]);

    await loadPayrollEmployees();
  };

  const handleSalaryDetails = (employee) => {
    navigate("/hrm/salary-management/salary-details", {
      state: {
        employeeSlug: employee.employeeSlug,

        employee,

        month: appliedSalaryPeriod.month,

        year: appliedSalaryPeriod.year,
      },
    });
  };

  const isLoading = loading || departmentLoading || designationLoading;

  return (
    <div className="space-y-8">
      <div className="flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-start gap-5">
        <div>
          <h1 className="text-3xl text-white font-bold">Employee Salary</h1>

          <p className="text-gray-500 text-sm mt-2">
            Manage monthly employee salary generation
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 justify-start 2xl:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate("/hrm/salaries/bank-statement", {
                  state: {
                    month: appliedSalaryPeriod.month,

                    year: appliedSalaryPeriod.year,
                  },
                })
              }
              className="bg-indigo-600 px-5 hover:bg-indigo-700 py-2 rounded-lg text-white cursor-pointer"
            >
              Bank Statement
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/hrm/salaries/salary-statement", {
                  state: {
                    month: appliedSalaryPeriod.month,

                    year: appliedSalaryPeriod.year,
                  },
                })
              }
              className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-white cursor-pointer"
            >
              Salary Statement
            </button>

            <button
              type="button"
              onClick={() => navigate("/hrm/salaries/employee-leave-balance")}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer"
            >
              Leave Balance
            </button>

            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white cursor-pointer"
            >
              All Payslip
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              disabled={loading || submitLoading || lockLoading}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-52 cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Month</option>

              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              disabled={loading || submitLoading || lockLoading}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-40 cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Year</option>

              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSalaryPeriodGo}
              disabled={loading || submitLoading || lockLoading}
              className="bg-green-500 px-5 hover:bg-green-600 py-2 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : null}
              GO
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={
                submitLoading || lockLoading || loading || !selected.length
              }
              className="bg-cyan-500 px-5 py-2 hover:bg-cyan-600 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {submitLoading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleOpenLockModal}
              disabled={
                lockLoading || submitLoading || loading || !selected.length
              }
              className="bg-gray-800 px-5 py-2 rounded-lg hover:bg-gray-700 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {lockLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LockKeyhole size={17} />
              )}

              {lockLoading ? "Locking..." : "Lock"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/hrm/salaries/attendance-details", {
                  state: {
                    month: appliedSalaryPeriod.month,

                    year: appliedSalaryPeriod.year,
                  },
                })
              }
              className="bg-indigo-600 px-5 py-2 hover:bg-indigo-700 rounded-lg text-white cursor-pointer"
            >
              Attendance Detail
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gray-500 text-sm">Salary Period</p>

            <p className="text-white font-medium mt-1">
              {selectedMonthLabel} {appliedSalaryPeriod.year}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <p className="text-gray-400">
              Employees:{" "}
              <span className="text-white font-medium">
                {summary?.totalEmployees || employees.length}
              </span>
            </p>

            <p className="text-gray-400">
              Saved:{" "}
              <span className="text-green-400 font-medium">
                {summary?.savedCount || 0}
              </span>
            </p>

            <p className="text-gray-400">
              Locked:{" "}
              <span className="text-indigo-400 font-medium">
                {summary?.lockedCount || 0}
              </span>
            </p>

            <p className="text-gray-400">
              Selected:{" "}
              <span className="text-cyan-400 font-medium">
                {selected.length}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <select
            value={filters.departmentSlug}
            onChange={handleDepartmentChange}
            disabled={departmentLoading || loading}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white cursor-pointer disabled:opacity-50 outline-none"
          >
            <option value="">All Departments</option>

            {activeDepartments.map((department) => (
              <option key={department.slug} value={department.slug}>
                {getDepartmentOptionName(department)}
              </option>
            ))}
          </select>

          <select
            value={filters.designationSlug}
            onChange={handleDesignationChange}
            disabled={designationLoading || loading}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white cursor-pointer disabled:opacity-50 outline-none"
          >
            <option value="">All Designations</option>

            {filteredDesignations.map((designation) => (
              <option key={designation.slug} value={designation.slug}>
                {getDesignationOptionName(designation)}
              </option>
            ))}
          </select>

          <select
            value={filters.employeeSlug}
            onChange={handleEmployeeChange}
            disabled={loading}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white cursor-pointer disabled:opacity-50 outline-none"
          >
            <option value="">All Employees</option>

            {employeeOptions.map((employee) => (
              <option key={employee.employeeSlug} value={employee.employeeSlug}>
                {employee.employeeName}{" "}
                {getEmployeeNumber(employee) !== "-"
                  ? `(${getEmployeeNumber(employee)})`
                  : ""}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 rounded-lg text-white cursor-pointer px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            Search
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-auto custom-scrollbar max-h-[650px]">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={
                      !selectableEmployees.length ||
                      loading ||
                      submitLoading ||
                      lockLoading
                    }
                    className="cursor-pointer disabled:cursor-not-allowed"
                  />
                </th>

                {[
                  "SNo.",
                  "Employee Name",
                  "Employee ID/Code",
                  "Department/Designation",
                  "Salary",
                  "Saved",
                  "Locked",
                  "More",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="p-4 text-gray-300 text-left whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12">
                    <div className="flex items-center justify-center gap-3 text-indigo-400">
                      <Loader2 size={22} className="animate-spin" />
                      Calculating salaries...
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-500">
                    No employees found for selected salary period
                  </td>
                </tr>
              ) : (
                employees.map((employee, index) => {
                  const isDisabled =
                    employee.locked ||
                    employee.paid ||
                    employee.salaryStructureMissing;

                  return (
                    <tr
                      key={employee.employeeSlug}
                      className={`border-t border-gray-800 ${
                        employee.locked
                          ? "bg-gray-950/50"
                          : "hover:bg-gray-800/50"
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(employee.employeeSlug)}
                          onChange={() => handleSelect(employee)}
                          disabled={isDisabled || submitLoading || lockLoading}
                          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>

                      <td className="p-4 text-gray-300">{index + 1}.</td>

                      <td className="p-4">
                        <div className="text-indigo-400 font-medium whitespace-nowrap">
                          {employee.employeeName || "-"}
                        </div>

                        {employee.salaryStructureMissing && (
                          <p className="text-red-400 text-xs mt-1">
                            Salary structure not configured
                          </p>
                        )}

                        {employee.paid && (
                          <p className="text-green-400 text-xs mt-1">
                            Salary Paid
                          </p>
                        )}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getEmployeeNumber(employee)}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        <div>{employee?.department?.name || "-"}</div>

                        <div className="text-xs text-gray-500 mt-1">
                          {employee?.designation?.name || "-"}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {employee.salaryStructureMissing ? (
                          <span className="text-gray-500">-</span>
                        ) : (
                          <div>
                            <p className="text-white font-semibold">
                              ₹ {formatAmount(employee.salary)}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Gross ₹ {formatAmount(employee.grossEarnings)}
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-white px-3 py-1.5 rounded-lg text-xs font-medium ${
                            employee.saved ? "bg-green-600" : "bg-red-500"
                          }`}
                        >
                          {employee.saved ? "YES" : "NO"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-white px-3 py-1.5 rounded-lg text-xs font-medium ${
                            employee.locked ? "bg-green-600" : "bg-indigo-600"
                          }`}
                        >
                          {employee.locked ? "YES" : "NO"}
                        </span>
                      </td>

                      <td className="p-4">
                        {!employee.salaryStructureMissing ? (
                          <button
                            type="button"
                            onClick={() => handleSalaryDetails(employee)}
                            className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 p-2 rounded-lg cursor-pointer"
                            title="View Salary Details"
                          >
                            <ArrowRight size={18} />
                          </button>
                        ) : (
                          <span className="text-gray-600">-</span>
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

      <SalaryLockConfirmModal
        open={lockModalOpen}
        close={() => {
          if (lockLoading) {
            return;
          }

          setLockModalOpen(false);
        }}
        confirm={handleConfirmLock}
        loading={lockLoading}
        employees={lockModalEmployees}
        month={selectedMonthLabel}
        year={appliedSalaryPeriod.year}
      />
    </div>
  );
}
