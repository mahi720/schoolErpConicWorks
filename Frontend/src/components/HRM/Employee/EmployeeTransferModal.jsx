import React, { useEffect, useMemo, useState } from "react";

import { ArrowLeftRight, Loader2, X } from "lucide-react";

import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../store/HRM/employee/employeeStore";

import { useDepartmentStore } from "../../../store/HRM/settings/department/departmentStore";

import { useDesignationStore } from "../../../store/HRM/settings/designation/designationStore";

import { usePayBandStore } from "../../../store/HRM/settings/payBand/payBandStore";

import { employeeTransferSchema } from "../../../validations/HRM/employee/employeeValidation";

const initialForm = {
  department: "",
  designation: "",
  payBand: "",
};

export default function EmployeeTransferModal({ open, close, employee }) {
  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const departments = useDepartmentStore((state) => state.departments || []);

  const fetchDepartments = useDepartmentStore(
    (state) => state.fetchDepartments,
  );

  const designations = useDesignationStore((state) => state.designations || []);

  const fetchDesignations = useDesignationStore(
    (state) => state.fetchDesignations,
  );

  const payBands = usePayBandStore((state) => state.payBands || []);

  const fetchPayBands = usePayBandStore((state) => state.fetchPayBands);

  const transferEmployee = useEmployeeStore((state) => state.transferEmployee);

  const modalLoading = useEmployeeStore((state) => state.modalLoading);

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchDepartments();
    fetchDesignations();
    fetchPayBands();

    setForm({
      department:
        employee?.department?.name ||
        employee?.department?.departmentName ||
        "",

      designation:
        employee?.designation?.name ||
        employee?.designation?.designationName ||
        "",

      payBand: employee?.payBand?.name || employee?.payBand?.payBandName || "",
    });

    setErrors({});
  }, [open, employee, fetchDepartments, fetchDesignations, fetchPayBands]);

  const filteredDesignations = useMemo(() => {
    if (!form.department) {
      return [];
    }

    return designations.filter((item) => {
      const departmentName =
        item?.department?.departmentName ||
        item?.departmentName ||
        item?.department ||
        "";

      return departmentName === form.department;
    });
  }, [designations, form.department]);

  if (!open || !employee) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,

      department: value,

      designation: "",
    }));

    setErrors((prev) => ({
      ...prev,

      department: "",

      designation: "",
    }));
  };

  const handleTransfer = async () => {
    const validation = employeeTransferSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path?.[0];

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      const firstError = validation.error.issues?.[0]?.message;

      if (firstError) {
        toast.error(firstError);
      }

      return;
    }

    const currentDepartment =
      employee?.department?.name || employee?.department?.departmentName || "";

    const currentDesignation =
      employee?.designation?.name ||
      employee?.designation?.designationName ||
      "";

    const currentPayBand =
      employee?.payBand?.name || employee?.payBand?.payBandName || "";

    if (
      validation.data.department === currentDepartment &&
      validation.data.designation === currentDesignation &&
      validation.data.payBand === currentPayBand
    ) {
      toast.error("Please change Department, Designation or Pay Band");

      return;
    }

    const success = await transferEmployee(employee.slug, validation.data);

    if (success) {
      close();
    }
  };

  const departmentOptions = departments.filter(
    (item) => item.isActive !== false,
  );

  const designationOptions = filteredDesignations.filter(
    (item) => item.isActive !== false,
  );

  const payBandOptions = payBands.filter((item) => item.isActive !== false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Transfer Employee
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {employee.fullName} ({employee.employeeId})
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-3">Current Assignment</p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Department</p>

                <p className="text-white mt-1">
                  {employee?.department?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Designation</p>

                <p className="text-white mt-1">
                  {employee?.designation?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Pay Band</p>

                <p className="text-white mt-1">
                  {employee?.payBand?.name || "-"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-300">
              Department
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="department"
              value={form.department}
              onChange={handleDepartmentChange}
              className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none cursor-pointer ${
                errors.department
                  ? "border-red-500"
                  : "border-gray-700 focus:border-indigo-500"
              }`}
            >
              <option value="">Select Department</option>

              {departmentOptions.map((item) => (
                <option key={item.slug} value={item.departmentName}>
                  {item.departmentName}
                </option>
              ))}
            </select>

            {errors.department && (
              <p className="text-red-400 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300">
              Designation
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              disabled={!form.department}
              className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.designation
                  ? "border-red-500"
                  : "border-gray-700 focus:border-indigo-500"
              }`}
            >
              <option value="">
                {form.department
                  ? "Select Designation"
                  : "Select Department First"}
              </option>

              {designationOptions.map((item) => (
                <option key={item.slug} value={item.designationName}>
                  {item.designationName}
                </option>
              ))}
            </select>

            {errors.designation && (
              <p className="text-red-400 text-sm mt-1">{errors.designation}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300">
              Pay Band
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="payBand"
              value={form.payBand}
              onChange={handleChange}
              className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none cursor-pointer ${
                errors.payBand
                  ? "border-red-500"
                  : "border-gray-700 focus:border-indigo-500"
              }`}
            >
              <option value="">Select Pay Band</option>

              {payBandOptions.map((item) => (
                <option key={item.slug} value={item.payBandName}>
                  {item.payBandName}
                </option>
              ))}
            </select>

            {errors.payBand && (
              <p className="text-red-400 text-sm mt-1">{errors.payBand}</p>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleTransfer}
            disabled={modalLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            {modalLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <ArrowLeftRight size={17} />
            )}

            {modalLoading ? "Transferring..." : "Transfer Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
