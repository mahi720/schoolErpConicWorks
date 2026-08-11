import React from "react";

import { Loader2, LockKeyhole, X } from "lucide-react";

export default function AttendanceLockConfirmModal({
  open,
  close,
  confirm,
  attendanceDate,
  loading = false,
}) {
  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <LockKeyhole size={20} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="text-white text-lg font-semibold">
                Lock Attendance?
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Confirm attendance lock
              </p>
            </div>
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

        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            Are you sure you want to lock attendance for this date?
          </p>

          {attendanceDate && (
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500">Attendance Date</p>

              <p className="text-white mt-1 font-medium">{attendanceDate}</p>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-300 text-sm leading-relaxed">
              After locking, attendance records for this date cannot be changed
              until attendance is unlocked.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
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
            onClick={confirm}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <LockKeyhole size={17} />
            )}

            {loading ? "Locking..." : "Lock Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
