import React, { useEffect, useState } from "react";

import { LockKeyhole, Loader2, X, AlertTriangle } from "lucide-react";

export default function LockAttendanceModal({
  open,
  close,
  loading = false,
  attendanceDate,
  attendanceCount = 0,
  onConfirm,
}) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (open) {
      setRemarks("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleConfirm = () => {
    if (loading) {
      return;
    }

    onConfirm?.(remarks.trim() || `Attendance locked for ${attendanceDate}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[550px] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <LockKeyhole size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Lock Attendance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                This action prevents further editing.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={close}
            className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10">
            <AlertTriangle
              size={21}
              className="text-amber-400 shrink-0 mt-0.5"
            />

            <div>
              <p className="text-white font-medium">
                Are you sure you want to lock this attendance?
              </p>

              <p className="text-sm text-gray-400 mt-1">
                After locking, attendance status cannot be edited unless it is
                unlocked by an authorized user.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-800/70 border border-gray-700 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Attendance Date
              </p>

              <p className="mt-2 text-white font-medium">
                {attendanceDate || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-800/70 border border-gray-700 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Records to Lock
              </p>

              <p className="mt-2 text-white font-medium">{attendanceCount}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Remarks</label>

            <textarea
              rows={3}
              value={remarks}
              disabled={loading}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder="Optional lock remarks"
              className="w-full resize-none bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder:text-gray-500 outline-none focus:border-amber-500 disabled:opacity-50"
            />
          </div>

          <p className="text-sm text-gray-400">
            Please verify the selected date and all student attendance statuses
            before locking.
          </p>
        </div>

        <div className="p-5 border-t border-gray-800 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={close}
            className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || attendanceCount === 0}
            onClick={handleConfirm}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LockKeyhole size={18} />
            )}

            {loading
              ? "Locking Attendance..."
              : `Lock Attendance (${attendanceCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
