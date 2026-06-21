import React from "react";
import { X } from "lucide-react";

export default function PromoteStudentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="
        bg-gray-900 
        w-full 
        max-w-2xl 
        rounded-2xl
        border border-gray-800
        max-h-[90vh]
        overflow-hidden
        flex flex-col
      "
      >
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-white">
            Promote Students
          </h2>

          <button onClick={onClose}>
            <X className="text-gray-400 cursor-pointer" />
          </button>
        </div>

        {/* Body */}

        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
          <h3 className="text-white font-bold border-b border-gray-700 pb-4">
            Target Class Informations
          </h3>

          {/* Academic Year */}

          <div>
            <label className="text-gray-300">
              Academic Year
              <sup className="text-red-400 text-xs ml-2">
                Must be different and newer than source class
              </sup>
            </label>

            <select className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white">
              <option>Select Acd. Year</option>
              <option>2026-2027</option>
              <option>2027-2028</option>
            </select>
          </div>

          {/* Board */}

          <div>
            <label className="text-gray-300">
              Board
              <sup className="text-red-400 text-xs ml-2">
                Must be same as source class
              </sup>
            </label>

            <select className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white">
              <option>Select Board</option>
              <option>CBSE</option>
              <option>ICSE</option>
            </select>
          </div>

          {/* Class */}

          <div>
            <label className="text-gray-300">
              Class
              <sup className="text-red-400 text-xs ml-2">
                Must be upgraded class than source.
              </sup>
            </label>

            <select className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white">
              <option>Select Class</option>
              <option>I</option>
              <option>II</option>
              <option>III</option>
            </select>
          </div>

          {/* Stream */}

          <div>
            <label className="text-gray-300">
              Stream
              <sup className="text-red-400 text-xs ml-2">
                Must be same or can left blank.
              </sup>
            </label>

            <select className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white">
              <option>Select Stream</option>
              <option>Science</option>
              <option>Commerce</option>
            </select>
          </div>

          {/* Section */}

          <div>
            <label className="text-gray-300">
              Section
              <sup className="text-red-400 text-xs ml-2">Select Section.</sup>
            </label>

            <select className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white">
              <option>Select Section</option>
              <option>A</option>
              <option>B</option>
            </select>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t border-gray-800">
          <button className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white cursor-pointer">
            Promote Students
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
