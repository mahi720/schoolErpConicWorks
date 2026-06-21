import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditRollNumberModal({
  isOpen,
  onClose,
  student,
  onSave,
}) {
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    if (student) {
      setRollNumber(student.rollNo);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = () => {
    onSave(student.id, rollNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Header */}

        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-white">
            Update Roll Number For{" "}
            <span className="text-gray-300 font-medium">"{student.name}"</span>
          </h1>

          <button onClick={onClose}>
            <X className="text-gray-400 cursor-pointer" />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          <label className="block text-gray-300 mb-2">
            Roll Number <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
          />
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-emerald-500 rounded-xl text-white cursor-pointer"
          >
            Update Roll Number
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
  );
}
