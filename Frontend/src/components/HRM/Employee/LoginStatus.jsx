import React from "react";
import { X } from "lucide-react";

export default function LoginStatusModal({ open, close }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[550px] rounded-xl border border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Update Login Status</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-8">
          <label className="text-gray-300">
            Status <span className="text-red-500"> *</span>
          </label>

          <select className="mt-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer">
            <option>Default (D)</option>
            <option>Flexible (F)</option>
            <option>No Boundation (B)</option>
          </select>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button className="bg-indigo-600 px-5 py-2 rounded-lg text-white cursor-pointer">
            Update
          </button>

          <button
            onClick={close}
            className="bg-red-500 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
