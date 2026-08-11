import React, { useEffect, useState } from "react";

import { Loader2, TriangleAlert, X } from "lucide-react";

import toast from "react-hot-toast";

import {
  markEmployeeAbsentSchema,
  buildAbsentAttendancePayload,
} from "../../../validations/hrm/attendance/employeeAttendanceValidation";

export default function ConfirmModal({
  open,
  close,
  confirm,
  attendanceDate,
  employee,
  loading = false,
}) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setRemarks("");
  }, [open]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    setRemarks("");

    close();
  };

  const handleConfirm = async () => {
    const payload = buildAbsentAttendancePayload({
      attendanceDate,

      remarks,
    });

    const validation = markEmployeeAbsentSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Invalid attendance details",
      );

      return;
    }

    await confirm(validation.data);
  };

  const employeeName = employee?.fullName || employee?.name || "";

  const employeeId =
    employee?.employeeId || employee?.employeeCode || employee?.empId || "";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-[430px] shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-5 top-5 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
        >
          <X size={19} />
        </button>

        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
          <TriangleAlert size={28} className="text-red-400" />
        </div>

        <h2 className="text-white text-xl font-semibold">
          Mark Employee Absent?
        </h2>

        {(employeeName || employeeId) && (
          <div className="mt-3">
            <p className="text-gray-300 font-medium">{employeeName}</p>

            {employeeId && (
              <p className="text-gray-500 text-sm mt-1">
                Employee ID: {employeeId}
              </p>
            )}
          </div>
        )}

        {attendanceDate && (
          <div className="mt-4 bg-gray-800/60 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-500">Attendance Date</p>

            <p className="text-gray-300 mt-1">{attendanceDate}</p>
          </div>
        )}

        <div className="mt-5">
          <label className="block text-gray-300 text-sm mb-2">Remarks</label>

          <textarea
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            placeholder="Enter Remarks"
            rows={3}
            maxLength={255}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white resize-none outline-none focus:border-red-500"
          />

          <div className="text-right text-xs text-gray-500 mt-1">
            {remarks.length}
            /255
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          This employee will be marked absent for the selected date.
        </p>

        <div className="flex justify-end gap-3 mt-7">
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
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {loading ? "Marking..." : "Mark Absent"}
          </button>
        </div>
      </div>
    </div>
  );
}
