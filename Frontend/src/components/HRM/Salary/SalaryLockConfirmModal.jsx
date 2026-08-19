import React from "react";

import { AlertTriangle, Loader2, LockKeyhole, X } from "lucide-react";

export default function SalaryLockConfirmModal({
  open,
  close,
  confirm,
  loading,
  employees = [],
  month,
  year,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center">
              <LockKeyhole size={20} className="text-amber-400" />
            </div>

            <div>
              <h2 className="text-xl text-white font-semibold">Lock Salary</h2>

              <p className="text-gray-500 text-sm mt-1">
                {month} {year}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="text-amber-400 shrink-0 mt-0.5"
            />

            <div>
              <p className="text-amber-300 font-medium">Confirm salary lock</p>

              <p className="text-gray-400 text-sm mt-1 leading-6">
                You are about to lock salary for{" "}
                <span className="text-white font-medium">
                  {employees.length}
                </span>{" "}
                employee
                {employees.length !== 1 ? "s" : ""}. Locked salary should not be
                changed without unlocking or authorized correction.
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-3">Selected Employees</p>

            <div className="max-h-56 overflow-auto custom-scrollbar border border-gray-800 rounded-xl">
              {employees.map((employee, index) => (
                <div
                  key={employee.slug}
                  className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-800 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {employee.fullName || "-"}
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      {employee.employeeId || employee.employeeCode || "-"}
                    </p>
                  </div>

                  <span className="text-gray-500 text-xs">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirm}
            disabled={loading}
            className="min-w-[145px] px-5 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Locking...
              </>
            ) : (
              <>
                <LockKeyhole size={17} />
                Lock Salary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
