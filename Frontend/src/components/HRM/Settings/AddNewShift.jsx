import React, { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useDepartmentStore } from "../../../store/hrm/settings/department/departmentStore";
import { useShiftStore } from "../../../store/hrm/settings/shift/shiftStore";

import {
  shiftInitialValues,
  shiftSchema,
} from "../../../validations/hrm/settings/shift/shiftValidation";

const convertTimeToInputValue = (value) => {
  if (!value) return "";

  if (typeof value === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export default function ShiftModal({ open, close, editData }) {
  const [form, setForm] = useState(shiftInitialValues);

  const {
    departments,
    loading: departmentLoading,
    fetchDepartments,
  } = useDepartmentStore();

  const { submitLoading, createShift, updateShift } = useShiftStore();

  const activeDepartments = useMemo(() => {
    return departments.filter((item) => item.isActive);
  }, [departments]);

  useEffect(() => {
    if (!open) return;

    fetchDepartments({
      status: "active",
    });
  }, [open, fetchDepartments]);

  useEffect(() => {
    if (!open) return;

    if (editData) {
      setForm({
        departmentSlug:
          editData.departmentSlug || editData.department?.slug || "",
        shiftName: editData.shiftName || "",
        shiftCode: editData.shiftCode || "",
        loginTime: convertTimeToInputValue(editData.loginTime),
        loginBufferMinutes: editData.loginBufferMinutes?.toString() || "",
        logoutTime: convertTimeToInputValue(editData.logoutTime),
        logoutBufferMinutes: editData.logoutBufferMinutes?.toString() || "",
      });

      return;
    }

    setForm(shiftInitialValues);
  }, [editData, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (submitLoading) return;

    setForm(shiftInitialValues);
    close();
  };

  const handleSubmit = async () => {
    const validation = shiftSchema.safeParse(form);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid shift details",
      );

      return;
    }

    const payload = {
      departmentSlug: validation.data.departmentSlug,
      shiftName: validation.data.shiftName.trim(),
      shiftCode: validation.data.shiftCode.trim(),
      loginTime: validation.data.loginTime,
      loginBufferMinutes: validation.data.loginBufferMinutes,
      logoutTime: validation.data.logoutTime,
      logoutBufferMinutes: validation.data.logoutBufferMinutes,
    };

    let success = false;

    if (editData) {
      success = await updateShift(editData.slug, payload);
    } else {
      success = await createShift(payload);
    }

    if (success) {
      setForm(shiftInitialValues);
      close();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">
            {editData ? "Edit Shift" : "Add New Shift"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-x-auto overflow-y-auto max-h-[65vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-400 text-sm">
                Department
                <span className="text-red-500"> *</span>
              </label>

              <select
                name="departmentSlug"
                value={form.departmentSlug}
                onChange={handleChange}
                disabled={departmentLoading || submitLoading}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full cursor-pointer outline-none disabled:opacity-50"
              >
                <option value="">
                  {departmentLoading
                    ? "Loading Departments..."
                    : "Select Department"}
                </option>

                {activeDepartments.map((department) => (
                  <option key={department.slug} value={department.slug}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Shift Name
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                name="shiftName"
                value={form.shiftName}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Shift Name"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Shift Code
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                name="shiftCode"
                value={form.shiftCode}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Shift Code"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Login Time
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="time"
                name="loginTime"
                value={form.loginTime}
                onChange={handleChange}
                disabled={submitLoading}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full cursor-pointer outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Login Buffer Time (minutes)
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="number"
                min="0"
                name="loginBufferMinutes"
                value={form.loginBufferMinutes}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Login Buffer Minutes"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Logout Time
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="time"
                name="logoutTime"
                value={form.logoutTime}
                onChange={handleChange}
                disabled={submitLoading}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full cursor-pointer outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Logout Buffer Time (minutes)
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="number"
                min="0"
                name="logoutBufferMinutes"
                value={form.logoutBufferMinutes}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Logout Buffer Minutes"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitLoading && <Loader2 size={17} className="animate-spin" />}

            {submitLoading
              ? editData
                ? "Updating..."
                : "Adding..."
              : editData
                ? "Update"
                : "Add"}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
