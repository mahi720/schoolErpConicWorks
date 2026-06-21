import React, { useState } from "react";
import { X } from "lucide-react";

export default function AssignSectionModal({ isOpen, onClose }) {
  const [section, setSection] = useState("");

  if (!isOpen) return null;

  const handleAssign = () => {
    console.log("Assigned Section:", section);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-3xl font-semibold text-white">Assign Section</h2>

          <button onClick={onClose}>
            <X
              size={24}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          <label className="block text-gray-300 mb-2">
            Select Section
            <span className="text-red-500">*</span>
          </label>

          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
          >
            <option value="">Select Sections</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>

          <div className="flex justify-end gap-3 mt-10">
            <button
              onClick={handleAssign}
              className="px-5 py-3 bg-emerald-500 rounded-xl text-white cursor-pointer"
            >
              Assign Section
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 bg-red-500 rounded-xl text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
