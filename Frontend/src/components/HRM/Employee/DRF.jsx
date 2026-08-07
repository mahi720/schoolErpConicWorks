import React from "react";
import { Loader2, TriangleAlert, X } from "lucide-react";

export default function ConfirmModal({
  open,
  close,
  employee,
  onConfirm,
  loading = false,
}) {
  if (!open || !employee) {
    return null;
  }

  const currentValue = Boolean(employee.isDrfApplicable);
  const nextValue = !currentValue;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="relative w-full max-w-[450px] bg-gray-900 border border-gray-700 rounded-xl p-7 shadow-xl">
        <button
          type="button"
          onClick={close}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mb-5">
          <TriangleAlert size={30} className="text-yellow-400" />
        </div>

        <h2 className="text-xl font-semibold text-white">Are you sure?</h2>

        <p className="text-gray-400 mt-3 text-sm leading-relaxed">
          You want to update Death Relief Fund (DRF) for{" "}
          <span className="text-white font-medium">{employee.fullName}</span>.
        </p>

        <div className="mt-5 bg-gray-800/60 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Current</p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm text-white ${
                  currentValue ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {currentValue ? "Yes" : "No"}
              </span>
            </div>

            <div className="text-gray-500">→</div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Update To</p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm text-white ${
                  nextValue ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {nextValue ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition cursor-pointer disabled:opacity-50"
          >
            No, Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {loading ? "Updating..." : "Yes, Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
