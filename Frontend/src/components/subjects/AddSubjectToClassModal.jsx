import React, { useState } from "react";
import Modal from "../common/Modal";

export default function AddSubjectToClassModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    year: "",
    class: "",
    studyType: "",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Subject To Class">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Academic Year <span className="text-red-500"> *</span>
          </label>
          <select className="w-full p-3 rounded-xl bg-gray-800 text-white cursor-pointer">
            <option>Select Academic Year</option>

            <option>2024-2025</option>

            <option>2025-2026</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Classes <span className="text-red-500"> *</span>
          </label>
          <select className="w-full p-3 rounded-xl bg-gray-800 text-white cursor-pointer">
            <option>Select Class</option>

            <option>Nursery</option>

            <option>LKG</option>

            <option>UKG</option>

            <option>I</option>

            <option>II</option>

            <option>III</option>

            <option>IV</option>

            <option>V</option>

            <option>VI</option>

            <option>VII</option>

            <option>VIII</option>

            <option>IX</option>

            <option>X</option>

            <option>XI</option>

            <option>XII</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Study Type <span className="text-red-500"> *</span>
          </label>
          <select className="w-full p-3 rounded-xl bg-gray-800 text-white cursor-pointer">
            <option>Study Type</option>

            <option>Theory</option>

            <option>Practical</option>
          </select>
        </div>

        <button className="w-full py-3 rounded-xl bg-green-600 text-white cursor-pointer">
          Assign Subject
        </button>
      </div>
    </Modal>
  );
}
