import React from "react";

export default function ConfirmModal({ open, close, confirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-96">
        <h2 className="text-white text-xl">Mark Employee Absent?</h2>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={close}
            className="bg-gray-700 px-5 py-2 cursor-pointer hover:bg-gray-700 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            className="bg-red-500 px-5 py-2 rounded cursor-pointer hover:bg-red-600 text-white"
          >
            Absent
          </button>
        </div>
      </div>
    </div>
  );
}
