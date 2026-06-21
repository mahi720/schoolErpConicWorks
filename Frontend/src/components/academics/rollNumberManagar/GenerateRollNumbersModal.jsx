import React, { useState } from "react";
import { X } from "lucide-react";

export default function AssignRollNumberModal({ isOpen, onClose }) {
  const [rollNumber, setRollNumber] = useState("");
  const [rollNumberStartFrom, setRollNumberStartFrom] = useState("");

  if (!isOpen) return null;

  const handleAssign = () => {
    console.log("Assigned RollNumber:", rollNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-3xl font-semibold text-white">
            Generate Roll Numbers
          </h2>

          <button onClick={onClose}>
            <X
              size={24}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          <div>
            <label className="block text-gray-300 text-sm font-normal mb-2 gap-3">
              Roll Number Prefix
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full bg-gray-800 border gap-3 border-gray-700 rounded-xl p-3 text-white"
              placeholder="Roll Number Prefix"
            />
          </div>

          <div className="mt-5">
            <label className="block text-gray-300 gap-3 mb-2 text-sm font-normal">
              Roll Number Start From
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={rollNumberStartFrom}
              onChange={(e) => setRollNumberStartFrom(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              placeholder="Roll Number Start From"
            />
          </div>

          <div className="flex justify-end gap-3 mt-10">
            <button
              onClick={handleAssign}
              className="px-5 py-3 bg-emerald-500 rounded-xl text-white cursor-pointer"
            >
              Assign Roll Number
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
