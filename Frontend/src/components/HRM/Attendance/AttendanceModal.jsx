import React, { useEffect, useState } from "react";

import { Loader2, UserX, X } from "lucide-react";

import toast from "react-hot-toast";

import {
  employeeAttendanceInitialValues,
  markEmployeePresentSchema,
  markEmployeeAbsentSchema,
  updateEmployeeAttendanceSchema,
  buildPresentAttendancePayload,
  buildAbsentAttendancePayload,
  buildUpdateAttendancePayload,
} from "../../../validations/hrm/attendance/employeeAttendanceValidation";

export default function AttendanceModal({
  open,
  close,

  save,
  markAbsent,

  data,
  edit = false,

  attendanceDate,

  loading = false,
}) {
  const [form, setForm] = useState({
    ...employeeAttendanceInitialValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (edit && data) {
      setForm({
        inTime: data.inTime || "",

        outTime: data.outTime || "",

        remarks: data.remarks || "",
      });

      return;
    }

    setForm({
      ...employeeAttendanceInitialValues,
    });
  }, [open, edit, data]);

  if (!open) {
    return null;
  }

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setForm({
      ...employeeAttendanceInitialValues,
    });

    close();
  };

  const handlePresent = async () => {
    if (edit) {
      const payload = buildUpdateAttendancePayload(form);

      const validation = updateEmployeeAttendanceSchema.safeParse(payload);

      if (!validation.success) {
        toast.error(
          validation.error.issues?.[0]?.message ||
            "Please enter valid attendance details",
        );

        return;
      }

      await save(validation.data);

      return;
    }

    const payload = buildPresentAttendancePayload({
      attendanceDate,

      form,
    });

    const validation = markEmployeePresentSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid attendance details",
      );

      return;
    }

    await save(validation.data);
  };

  const handleAbsent = async () => {
    if (edit || !markAbsent) {
      return;
    }

    const payload = buildAbsentAttendancePayload({
      attendanceDate,

      remarks: form.remarks,
    });

    const validation = markEmployeeAbsentSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid attendance details",
      );

      return;
    }

    await markAbsent(validation.data);
  };

  const employeeName = data?.fullName || data?.name || "";

  const employeeId =
    data?.employeeId || data?.employeeCode || data?.empId || "";

  const inputClass =
    "bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-white text-xl font-semibold">
              {edit ? "Edit Attendance" : "Mark Attendance"}
            </h2>

            {(employeeName || employeeId) && (
              <p className="text-gray-500 text-sm mt-1">
                {employeeName}

                {employeeId ? ` (${employeeId})` : ""}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!edit && attendanceDate && (
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Attendance Date
              </label>

              <input
                type="date"
                value={attendanceDate}
                disabled
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 w-full cursor-not-allowed"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                In Time
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="time"
                value={form.inTime}
                onChange={(event) => handleChange("inTime", event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Out Time
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="time"
                value={form.outTime}
                onChange={(event) =>
                  handleChange("outTime", event.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Remarks</label>

            <textarea
              value={form.remarks}
              onChange={(event) => handleChange("remarks", event.target.value)}
              placeholder="Enter Remarks"
              rows={3}
              maxLength={255}
              className={`${inputClass} resize-none`}
            />

            <div className="text-right text-xs text-gray-500 mt-1">
              {form.remarks?.length || 0}
              /255
            </div>
          </div>

          {data?.shift && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Shift</p>

                  <p className="text-gray-300 mt-1">
                    {data.shift.shiftName || "-"}
                  </p>
                </div>

                <div className="flex gap-8">
                  <div>
                    <span className="text-gray-500 text-xs">Login</span>

                    <p className="text-gray-300 text-sm mt-1">
                      {data.shift.loginTime || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs">Logout</span>

                    <p className="text-gray-300 text-sm mt-1">
                      {data.shift.logoutTime || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-300 text-xs leading-relaxed">
              Late and Early status will be calculated automatically from shift
              timing and buffer settings.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex flex-wrap justify-between gap-3">
          <div>
            {!edit && (
              <button
                type="button"
                onClick={handleAbsent}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <UserX size={17} />
                )}
                Mark Absent
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePresent}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}

              {loading
                ? edit
                  ? "Updating..."
                  : "Marking..."
                : edit
                  ? "Update"
                  : "Mark Present"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
